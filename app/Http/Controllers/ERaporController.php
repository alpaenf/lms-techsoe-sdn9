<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ERaporController extends Controller
{
    public function index(Request $request): Response
    {
        $user = auth()->user();
        $academicYear = DB::table('academic_years')->where('is_active', true)->first();
        $academicYearId = $academicYear?->id ?? 1;

        // Check if user is student - only show their own rapor
        if ($user->role === 'siswa') {
            $student = DB::table('students')->where('user_id', $user->id)->first();

            if (! $student) {
                return Inertia::render('ERapor/Index', [
                    'error' => 'Data siswa tidak ditemukan',
                ]);
            }

            $class = DB::table('classes')
                ->leftJoin('teachers', 'classes.homeroom_teacher_id', '=', 'teachers.id')
                ->where('classes.id', $student->class_id)
                ->select('classes.*', 'teachers.full_name as homeroom_teacher_name', 'teachers.nip as homeroom_teacher_nip')
                ->first();

            $subjects = DB::table('subjects')->orderBy('code')->get();

            // Get grades for this student only
            $grades = DB::table('student_grades')
                ->join('teacher_subjects', 'student_grades.teacher_subject_id', '=', 'teacher_subjects.id')
                ->where('student_grades.student_id', $student->id)
                ->where('student_grades.academic_year_id', $academicYearId)
                ->select(
                    'student_grades.*',
                    'teacher_subjects.subject_id'
                )
                ->get();

            $gradesMap = [];
            foreach ($grades as $g) {
                $gradesMap[$g->student_id][$g->subject_id] = $g;
            }

            // Get evaluation
            $evaluation = DB::table('raport_evaluations')
                ->where('student_id', $student->id)
                ->where('academic_year_id', $academicYearId)
                ->first();

            $schoolProfile = DB::table('school_profiles')->first();

            return Inertia::render('ERapor/Index', [
                'academicYear' => $academicYear,
                'selectedClass' => $class,
                'subjects' => $subjects,
                'student' => $student,
                'students' => [$student],
                'gradesMap' => $gradesMap,
                'evaluation' => $evaluation,
                'evaluations' => $evaluation ? [$student->id => $evaluation] : [],
                'schoolProfile' => $schoolProfile,
                'isStudentView' => true,
            ]);
        }

        // For teachers/admin - show class selection
        $classes = DB::table('classes')->orderBy('grade_level')->get();
        $defaultClassId = $classes->first()?->id ?? 1;
        $selectedClassId = (int) $request->query('class_id', $defaultClassId);

        $selectedClass = DB::table('classes')
            ->leftJoin('teachers', 'classes.homeroom_teacher_id', '=', 'teachers.id')
            ->where('classes.id', $selectedClassId)
            ->select('classes.*', 'teachers.full_name as homeroom_teacher_name', 'teachers.nip as homeroom_teacher_nip')
            ->first();

        $subjects = DB::table('subjects')->orderBy('code')->get();

        $students = DB::table('students')
            ->where('students.class_id', $selectedClassId)
            ->select('id', 'nis', 'nisn', 'full_name', 'gender', 'birth_place', 'birth_date')
            ->orderBy('full_name')
            ->get();

        // Get grades for selected class students
        $studentIds = $students->pluck('id')->toArray();

        $grades = DB::table('student_grades')
            ->join('teacher_subjects', 'student_grades.teacher_subject_id', '=', 'teacher_subjects.id')
            ->whereIn('student_grades.student_id', $studentIds)
            ->where('student_grades.academic_year_id', $academicYearId)
            ->select(
                'student_grades.*',
                'teacher_subjects.subject_id'
            )
            ->get();

        // Map grades by student_id and subject_id
        $gradesMap = [];
        foreach ($grades as $g) {
            $gradesMap[$g->student_id][$g->subject_id] = $g;
        }

        // Get evaluations (Attitude & Homeroom notes)
        $evaluations = DB::table('raport_evaluations')
            ->whereIn('student_id', $studentIds)
            ->where('academic_year_id', $academicYearId)
            ->get()
            ->keyBy('student_id');

        // School Profile
        $schoolProfile = DB::table('school_profiles')->first();

        return Inertia::render('ERapor/Index', [
            'academicYear' => $academicYear,
            'classes' => $classes,
            'selectedClassId' => $selectedClassId,
            'selectedClass' => $selectedClass,
            'subjects' => $subjects,
            'students' => $students,
            'gradesMap' => $gradesMap,
            'evaluations' => $evaluations,
            'schoolProfile' => $schoolProfile,
            'isStudentView' => false,
        ]);
    }

    public function saveGrades(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'subject_id' => 'required|exists:subjects,id',
            'tugas_avg' => 'required|numeric|min:0|max:100',
            'uts_score' => 'required|numeric|min:0|max:100',
            'uas_score' => 'required|numeric|min:0|max:100',
            'competency_desc' => 'nullable|string',
        ]);

        $academicYear = DB::table('academic_years')->where('is_active', true)->first();
        $academicYearId = $academicYear?->id ?? 1;

        $student = DB::table('students')->where('id', $request->student_id)->first();
        if (! $student) {
            return back()->withErrors(['student_id' => 'Siswa tidak ditemukan.']);
        }

        // Get or create teacher_subject record
        $ts = DB::table('teacher_subjects')
            ->where('subject_id', $request->subject_id)
            ->where('class_id', $student->class_id)
            ->where('academic_year_id', $academicYearId)
            ->first();

        if (! $ts) {
            $defaultTeacher = DB::table('teachers')->first();
            $tsId = DB::table('teacher_subjects')->insertGetId([
                'teacher_id' => $defaultTeacher?->id ?? 1,
                'subject_id' => $request->subject_id,
                'class_id' => $student->class_id,
                'academic_year_id' => $academicYearId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $tsId = $ts->id;
        }

        $tugas = (float) $request->tugas_avg;
        $uts = (float) $request->uts_score;
        $uas = (float) $request->uas_score;
        $finalScore = round(($tugas * 0.30) + ($uts * 0.30) + ($uas * 0.40), 2);

        $letterGrade = 'C';
        if ($finalScore >= 89.00) {
            $letterGrade = 'A';
        } elseif ($finalScore >= 78.00) {
            $letterGrade = 'B';
        } elseif ($finalScore >= 65.00) {
            $letterGrade = 'C';
        } else {
            $letterGrade = 'D';
        }

        DB::table('student_grades')->updateOrInsert(
            [
                'student_id' => $request->student_id,
                'teacher_subject_id' => $tsId,
                'academic_year_id' => $academicYearId,
            ],
            [
                'tugas_avg' => $tugas,
                'uts_score' => $uts,
                'uas_score' => $uas,
                'final_score' => $finalScore,
                'letter_grade' => $letterGrade,
                'competency_desc' => $request->competency_desc,
                'updated_at' => now(),
            ]
        );

        return back()->with('message', 'Nilai mata pelajaran siswa berhasil diperbarui.');
    }

    public function saveEvaluation(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'attitude_score' => 'required|in:Sangat Baik,Baik,Cukup,Kurang',
            'homeroom_notes' => 'nullable|string',
        ]);

        $academicYear = DB::table('academic_years')->where('is_active', true)->first();
        $academicYearId = $academicYear?->id ?? 1;

        $student = DB::table('students')->where('id', $request->student_id)->first();

        DB::table('raport_evaluations')->updateOrInsert(
            [
                'student_id' => $request->student_id,
                'academic_year_id' => $academicYearId,
            ],
            [
                'class_id' => $student->class_id,
                'attitude_score' => $request->attitude_score,
                'homeroom_notes' => $request->homeroom_notes,
                'status' => 'draft',
                'updated_at' => now(),
            ]
        );

        return back()->with('message', 'Catatan wali kelas dan nilai sikap berhasil disimpan.');
    }

    public function verifyRapor(Request $request)
    {
        $classId = $request->input('class_id');
        $academicYear = DB::table('academic_years')->where('is_active', true)->first();
        $academicYearId = $academicYear?->id ?? 1;

        $studentIds = DB::table('students')->where('class_id', $classId)->pluck('id')->toArray();

        DB::table('raport_evaluations')
            ->whereIn('student_id', $studentIds)
            ->where('academic_year_id', $academicYearId)
            ->update([
                'status' => 'verified_wali_kelas',
                'verified_at' => now(),
                'updated_at' => now(),
            ]);

        return back()->with('message', 'Seluruh rapor rombel berhasil diverifikasi oleh Wali Kelas.');
    }

    public function approveRapor(Request $request)
    {
        $classId = $request->input('class_id');
        $academicYear = DB::table('academic_years')->where('is_active', true)->first();
        $academicYearId = $academicYear?->id ?? 1;

        $studentIds = DB::table('students')->where('class_id', $classId)->pluck('id')->toArray();

        DB::table('raport_evaluations')
            ->whereIn('student_id', $studentIds)
            ->where('academic_year_id', $academicYearId)
            ->update([
                'status' => 'approved_kepsek',
                'approved_at' => now(),
                'updated_at' => now(),
            ]);

        return back()->with('message', 'Seluruh rapor rombel berhasil disahkan secara digital oleh Kepala Sekolah.');
    }
}
