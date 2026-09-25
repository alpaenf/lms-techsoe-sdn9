<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PresensiController extends Controller
{
    public function index(Request $request): Response
    {
        $type = $request->query('type', 'siswa'); // 'siswa' or 'guru'
        $selectedDate = $request->query('date', date('Y-m-d'));
        $classes = DB::table('classes')->orderBy('grade_level')->get();
        $defaultClassId = $classes->first()?->id ?? 1;
        $selectedClassId = $request->query('class_id', $defaultClassId);

        $students = [];
        $teachers = [];

        if ($type === 'guru') {
            $teachers = DB::table('teachers')
                ->leftJoin('teacher_attendances', function ($join) use ($selectedDate) {
                    $join->on('teachers.id', '=', 'teacher_attendances.teacher_id')
                         ->where('teacher_attendances.attendance_date', '=', $selectedDate);
                })
                ->select(
                    'teachers.*',
                    'teacher_attendances.status as attendance_status',
                    'teacher_attendances.check_in_time',
                    'teacher_attendances.notes as attendance_notes'
                )
                ->orderBy('teachers.full_name')
                ->get();
        } else {
            $students = DB::table('students')
                ->where('students.class_id', $selectedClassId)
                ->leftJoin('student_attendances', function ($join) use ($selectedDate) {
                    $join->on('students.id', '=', 'student_attendances.student_id')
                         ->where('student_attendances.attendance_date', '=', $selectedDate);
                })
                ->select(
                    'students.*',
                    'student_attendances.status as attendance_status',
                    'student_attendances.notes as attendance_notes'
                )
                ->orderBy('students.full_name')
                ->get();
        }

        return Inertia::render('Presensi/Index', [
            'type' => $type,
            'classes' => $classes,
            'selectedClassId' => (int)$selectedClassId,
            'selectedDate' => $selectedDate,
            'students' => $students,
            'teachers' => $teachers,
        ]);
    }

    public function store(Request $request)
    {
        $type = $request->input('type', 'siswa');
        $date = $request->input('date', date('Y-m-d'));
        $records = $request->input('records', []);

        if ($type === 'guru') {
            foreach ($records as $item) {
                if (empty($item['teacher_id'])) {
                    continue;
                }
                DB::table('teacher_attendances')->updateOrInsert(
                    [
                        'teacher_id' => $item['teacher_id'],
                        'attendance_date' => $date,
                    ],
                    [
                        'status' => $item['status'] ?? 'Hadir',
                        'check_in_time' => $item['check_in_time'] ?? null,
                        'notes' => $item['notes'] ?? null,
                        'updated_at' => now(),
                    ]
                );
            }
        } else {
            $classId = $request->input('class_id');
            $activeAcademicYear = DB::table('academic_years')->where('is_active', true)->first();
            $academicYearId = $activeAcademicYear?->id ?? 1;

            foreach ($records as $item) {
                if (empty($item['student_id'])) {
                    continue;
                }
                DB::table('student_attendances')->updateOrInsert(
                    [
                        'student_id' => $item['student_id'],
                        'attendance_date' => $date,
                    ],
                    [
                        'class_id' => $classId,
                        'academic_year_id' => $academicYearId,
                        'status' => $item['status'] ?? 'Hadir',
                        'notes' => $item['notes'] ?? null,
                        'recorded_by' => auth()->id() ?? 1,
                        'updated_at' => now(),
                    ]
                );
            }
        }

        return back()->with('message', 'Presensi berhasil disimpan.');
    }
}

