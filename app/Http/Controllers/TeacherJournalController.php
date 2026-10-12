<?php

namespace App\Http\Controllers;

use App\Models\Classes;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\TeacherJournal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TeacherJournalController extends Controller
{
    private function getIndonesianDayName(string $date): string
    {
        $days = [
            0 => 'Minggu',
            1 => 'Senin',
            2 => 'Selasa',
            3 => 'Rabu',
            4 => 'Kamis',
            5 => 'Jumat',
            6 => 'Sabtu',
        ];
        $dayOfWeek = (int) date('w', strtotime($date));

        return $days[$dayOfWeek] ?? 'Senin';
    }

    public function index(Request $request): Response
    {
        $user = $request->user();
        $role = $user?->role ?? 'siswa';

        $selectedMonth = (int) $request->query('month', date('n'));
        $selectedYear = (int) $request->query('year', date('Y'));
        $filterClassId = $request->query('class_id');
        $filterSubjectId = $request->query('subject_id');

        $activeYear = DB::table('academic_years')->where('is_active', true)->first();
        $schoolProfile = DB::table('school_profiles')->first();

        // Check if teacher
        $teacher = null;
        if (in_array($role, ['guru', 'guru_mapel', 'tendik'])) {
            $teacher = Teacher::where('user_id', $user->id)->first();
            if (! $teacher) {
                $teacher = Teacher::create([
                    'user_id' => $user->id,
                    'full_name' => $user->name,
                    'gender' => 'L',
                    'teacher_type' => $role === 'guru_mapel' ? 'guru_mapel' : 'guru_kelas',
                ]);
            }
        }

        $allClasses = Classes::orderBy('grade_level')->get();
        $allSubjects = Subject::orderBy('name')->get();

        $teacherClasses = collect();
        $teacherSubjects = collect();
        $defaultClassId = null;
        $defaultSubjectId = null;

        if ($teacher) {
            $homeroomClassIds = DB::table('classes')
                ->where('homeroom_teacher_id', $teacher->id)
                ->pluck('id')
                ->toArray();

            $claimedClassIds = DB::table('teacher_subjects')
                ->where('teacher_id', $teacher->id)
                ->pluck('class_id')
                ->unique()
                ->toArray();

            $claimedSubjectIds = DB::table('teacher_subjects')
                ->where('teacher_id', $teacher->id)
                ->pluck('subject_id')
                ->unique()
                ->toArray();

            $teacherClassIds = array_values(array_unique(array_merge($homeroomClassIds, $claimedClassIds)));

            if (! empty($teacherClassIds)) {
                $teacherClasses = Classes::whereIn('id', $teacherClassIds)
                    ->orderBy('grade_level')
                    ->get();
                $defaultClassId = ! empty($homeroomClassIds) ? $homeroomClassIds[0] : ($teacherClasses->first()?->id ?? null);
            }

            if (! empty($claimedSubjectIds)) {
                $teacherSubjects = Subject::whereIn('id', $claimedSubjectIds)
                    ->orderBy('name')
                    ->get();
                $defaultSubjectId = $teacherSubjects->first()?->id ?? null;
            } elseif ($role === 'guru') {
                $teacherSubjects = $allSubjects;
                $defaultSubjectId = $allSubjects->first()?->id ?? null;
            }
        }

        $availableClasses = ($teacher && $teacherClasses->isNotEmpty()) ? $teacherClasses : $allClasses;
        $availableSubjects = ($teacher && $teacherSubjects->isNotEmpty()) ? $teacherSubjects : $allSubjects;

        // Build query
        $query = TeacherJournal::with(['teacher.user', 'class', 'subject', 'academicYear'])
            ->whereMonth('journal_date', $selectedMonth)
            ->whereYear('journal_date', $selectedYear);

        // If regular teacher, only show their own journals
        if ($teacher && ! in_array($role, ['admin', 'pimpinan'])) {
            $query->where('teacher_id', $teacher->id);
        } elseif ($request->filled('teacher_id')) {
            $query->where('teacher_id', (int) $request->query('teacher_id'));
        }

        if ($filterClassId) {
            $query->where('class_id', (int) $filterClassId);
        }

        if ($filterSubjectId) {
            $query->where('subject_id', (int) $filterSubjectId);
        }

        $journals = $query->orderBy('journal_date', 'desc')
            ->orderBy('start_time', 'desc')
            ->get();

        // Monthly statistics
        $stats = [
            'total_entries' => $journals->count(),
            'unique_classes' => $journals->pluck('class_id')->unique()->count(),
            'unique_subjects' => $journals->pluck('subject_id')->unique()->count(),
        ];

        $allTeachers = in_array($role, ['admin', 'pimpinan'])
            ? Teacher::orderBy('full_name')->get()
            : [];

        return Inertia::render('TeacherJournal/Index', [
            'journals' => $journals,
            'selectedMonth' => $selectedMonth,
            'selectedYear' => $selectedYear,
            'filterClassId' => $filterClassId ? (int) $filterClassId : null,
            'filterSubjectId' => $filterSubjectId ? (int) $filterSubjectId : null,
            'currentTeacher' => $teacher,
            'allTeachers' => $allTeachers,
            'classes' => $allClasses,
            'subjects' => $allSubjects,
            'availableClasses' => $availableClasses,
            'availableSubjects' => $availableSubjects,
            'defaultClassId' => $defaultClassId,
            'defaultSubjectId' => $defaultSubjectId,
            'stats' => $stats,
            'schoolProfile' => $schoolProfile,
            'academicYear' => $activeYear,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $teacher = Teacher::where('user_id', $user->id)->first();

        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'journal_date' => 'required|date',
            'start_time' => 'nullable|string',
            'end_time' => 'nullable|string',
            'material_topic' => 'required|string|max:255',
            'activity_description' => 'required|string',
            'learning_media' => 'nullable|string|max:255',
            'attendance_notes' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'status' => 'nullable|string|in:selesai,terlaksana,diganti',
        ]);

        $teacherId = $teacher ? $teacher->id : ($request->input('teacher_id') ?: Teacher::first()?->id ?? 1);
        $academicYearId = DB::table('academic_years')->where('is_active', true)->value('id') ?? 1;

        $dayName = $this->getIndonesianDayName($validated['journal_date']);

        TeacherJournal::create([
            'teacher_id' => $teacherId,
            'academic_year_id' => $academicYearId,
            'class_id' => $validated['class_id'],
            'subject_id' => $validated['subject_id'],
            'journal_date' => $validated['journal_date'],
            'day_name' => $dayName,
            'start_time' => ! empty($validated['start_time']) ? substr($validated['start_time'], 0, 5) : null,
            'end_time' => ! empty($validated['end_time']) ? substr($validated['end_time'], 0, 5) : null,
            'material_topic' => $validated['material_topic'],
            'activity_description' => $validated['activity_description'],
            'learning_media' => $validated['learning_media'] ?? null,
            'attendance_notes' => $validated['attendance_notes'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'status' => $validated['status'] ?? 'selesai',
        ]);

        return redirect()->back()->with('success', 'Catatan jurnal harian guru berhasil ditambahkan!');
    }

    public function update(Request $request, int $id)
    {
        $journal = TeacherJournal::findOrFail($id);

        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'journal_date' => 'required|date',
            'start_time' => 'nullable|string',
            'end_time' => 'nullable|string',
            'material_topic' => 'required|string|max:255',
            'activity_description' => 'required|string',
            'learning_media' => 'nullable|string|max:255',
            'attendance_notes' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'status' => 'nullable|string|in:selesai,terlaksana,diganti',
        ]);

        $dayName = $this->getIndonesianDayName($validated['journal_date']);

        $journal->update([
            'class_id' => $validated['class_id'],
            'subject_id' => $validated['subject_id'],
            'journal_date' => $validated['journal_date'],
            'day_name' => $dayName,
            'start_time' => ! empty($validated['start_time']) ? substr($validated['start_time'], 0, 5) : null,
            'end_time' => ! empty($validated['end_time']) ? substr($validated['end_time'], 0, 5) : null,
            'material_topic' => $validated['material_topic'],
            'activity_description' => $validated['activity_description'],
            'learning_media' => $validated['learning_media'] ?? null,
            'attendance_notes' => $validated['attendance_notes'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'status' => $validated['status'] ?? 'selesai',
        ]);

        return redirect()->back()->with('success', 'Catatan jurnal harian guru berhasil diperbarui!');
    }

    public function destroy(int $id)
    {
        $journal = TeacherJournal::findOrFail($id);
        $journal->delete();

        return redirect()->back()->with('success', 'Catatan jurnal harian guru berhasil dihapus.');
    }

    public function printMonthly(Request $request): Response
    {
        $user = $request->user();
        $role = $user?->role ?? 'siswa';

        $month = (int) $request->query('month', date('n'));
        $year = (int) $request->query('year', date('Y'));
        $classId = $request->query('class_id');
        $subjectId = $request->query('subject_id');
        $targetTeacherId = $request->query('teacher_id');

        $schoolProfile = DB::table('school_profiles')->first();
        $activeYear = DB::table('academic_years')->where('is_active', true)->first();

        $teacher = null;
        if (in_array($role, ['guru', 'guru_mapel', 'tendik'])) {
            $teacher = Teacher::where('user_id', $user->id)->first();
        } elseif ($targetTeacherId) {
            $teacher = Teacher::find($targetTeacherId);
        } else {
            $teacher = Teacher::first();
        }

        $query = TeacherJournal::with(['class', 'subject', 'teacher'])
            ->whereMonth('journal_date', $month)
            ->whereYear('journal_date', $year);

        if ($teacher) {
            $query->where('teacher_id', $teacher->id);
        }

        if ($classId) {
            $query->where('class_id', (int) $classId);
        }

        if ($subjectId) {
            $query->where('subject_id', (int) $subjectId);
        }

        $journals = $query->orderBy('journal_date', 'asc')
            ->orderBy('start_time', 'asc')
            ->get();

        $selectedClass = $classId ? Classes::find($classId) : null;
        $selectedSubject = $subjectId ? Subject::find($subjectId) : null;

        $monthNames = [
            1 => 'Januari',
            2 => 'Februari',
            3 => 'Maret',
            4 => 'April',
            5 => 'Mei',
            6 => 'Juni',
            7 => 'Juli',
            8 => 'Agustus',
            9 => 'September',
            10 => 'Oktober',
            11 => 'November',
            12 => 'Desember',
        ];

        return Inertia::render('TeacherJournal/PrintMonthly', [
            'journals' => $journals,
            'teacher' => $teacher,
            'month' => $month,
            'year' => $year,
            'monthName' => $monthNames[$month] ?? 'Bulan',
            'selectedClass' => $selectedClass,
            'selectedSubject' => $selectedSubject,
            'schoolProfile' => $schoolProfile,
            'academicYear' => $activeYear,
        ]);
    }
}
