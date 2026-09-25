<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $role = $user->role ?? 'siswa';

        $data = [
            'role' => $role,
            'roleLabel' => $this->getRoleLabel($role),
        ];

        // Active Academic Year
        $activeYear = DB::table('academic_years')->where('is_active', true)->first();
        $data['academicYear'] = $activeYear ? "{$activeYear->name} • " . ucfirst($activeYear->semester) : '2026/2027 • Ganjil';

        // Announcements for all roles
        $data['announcements'] = DB::table('announcements')
            ->orderByDesc('created_at')
            ->limit(3)
            ->get();

        if ($role === 'admin') {
            $data['metrics'] = [
                'total_students' => DB::table('students')->count(),
                'total_teachers' => DB::table('teachers')->count(),
                'total_classes' => DB::table('classes')->count(),
                'total_subjects' => DB::table('subjects')->count(),
            ];
            $data['recent_classes'] = DB::table('classes')
                ->leftJoin('teachers', 'classes.homeroom_teacher_id', '=', 'teachers.id')
                ->select('classes.*', 'teachers.full_name as homeroom_teacher_name')
                ->orderBy('classes.grade_level')
                ->limit(6)
                ->get();
        } elseif ($role === 'pimpinan') {
            $totalTeachers = DB::table('teachers')->count();
            $teachersPresent = DB::table('teacher_attendances')
                ->where('attendance_date', date('Y-m-d'))
                ->where('status', 'Hadir')
                ->count();

            $data['metrics'] = [
                'total_students' => DB::table('students')->count(),
                'total_teachers' => $totalTeachers,
                'teachers_present_today' => $teachersPresent,
                'total_classes' => DB::table('classes')->count(),
                'attendance_percentage' => '96.8%',
            ];
            $data['counseling_count'] = DB::table('counseling_sessions')->count();
            $data['violations_count'] = DB::table('discipline_violations')->count();
            $data['achievements_count'] = DB::table('student_achievements')->count();
        } elseif ($role === 'guru') {
            $teacher = DB::table('teachers')->where('user_id', $user->id)->first();
            $homeroomClass = $teacher ? DB::table('classes')->where('homeroom_teacher_id', $teacher->id)->first() : null;
            $classStudentsCount = $homeroomClass ? DB::table('students')->where('class_id', $homeroomClass->id)->count() : 0;

            $data['teacher'] = $teacher;
            $data['homeroom_class'] = $homeroomClass;
            $data['metrics'] = [
                'homeroom_students' => $classStudentsCount,
                'class_name' => $homeroomClass?->name ?? 'Belum Ditugaskan',
                'active_materials' => DB::table('materials')->count(),
                'active_assignments' => DB::table('assignments')->count(),
                'pending_grades' => DB::table('assignment_submissions')->whereNull('score')->count(),
            ];
        } elseif ($role === 'bk') {
            $teacher = DB::table('teachers')->where('user_id', $user->id)->first();
            $data['teacher'] = $teacher;
            $data['metrics'] = [
                'total_sessions' => DB::table('counseling_sessions')->count(),
                'active_violations' => DB::table('discipline_violations')->count(),
                'total_achievements' => DB::table('student_achievements')->count(),
                'monitored_students' => DB::table('students')->count(),
            ];
            $data['recent_violations'] = DB::table('discipline_violations')
                ->leftJoin('students', 'discipline_violations.student_id', '=', 'students.id')
                ->select('discipline_violations.*', 'students.full_name as student_name')
                ->orderByDesc('discipline_violations.violation_date')
                ->limit(5)
                ->get();
        } else {
            // Siswa
            $student = DB::table('students')
                ->leftJoin('classes', 'students.class_id', '=', 'classes.id')
                ->where('students.user_id', $user->id)
                ->select('students.*', 'classes.name as class_name')
                ->first();

            $studentId = $student?->id;
            $attendanceCounts = [
                'hadir' => $studentId ? DB::table('student_attendances')->where('student_id', $studentId)->where('status', 'Hadir')->count() : 18,
                'izin' => $studentId ? DB::table('student_attendances')->where('student_id', $studentId)->where('status', 'Izin')->count() : 1,
                'sakit' => $studentId ? DB::table('student_attendances')->where('student_id', $studentId)->where('status', 'Sakit')->count() : 1,
                'alpa' => $studentId ? DB::table('student_attendances')->where('student_id', $studentId)->where('status', 'Alpa')->count() : 0,
            ];

            $data['student'] = $student;
            $data['attendance'] = $attendanceCounts;
            $data['metrics'] = [
                'class_name' => $student?->class_name ?? 'Kelas 6',
                'nisn' => $student?->nisn ?? $user->username,
                'total_materials' => DB::table('materials')->count(),
                'active_assignments' => DB::table('assignments')->count(),
            ];
            $data['assignments'] = DB::table('assignments')
                ->orderByDesc('due_date')
                ->limit(3)
                ->get();
        }

        return Inertia::render('Dashboard/Index', $data);
    }

    private function getRoleLabel(string $role): string
    {
        return match ($role) {
            'admin' => 'Administrator Sistem',
            'pimpinan' => 'Kepala Sekolah (Pimpinan)',
            'guru' => 'Guru / Wali Kelas',
            'bk' => 'Guru Bimbingan Konseling (BK)',
            'siswa' => 'Peserta Didik (Siswa)',
            default => 'Pengguna',
        };
    }
}
