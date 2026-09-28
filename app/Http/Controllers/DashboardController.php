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

        // School Profile Info
        $schoolProfile = DB::table('school_profiles')->find(1);
        $data['schoolProfile'] = $schoolProfile;

        // Announcements for all roles
        $announcements = DB::table('announcements')
            ->orderByDesc('created_at')
            ->limit(3)
            ->get();
        $data['announcements'] = $announcements;

        if ($role === 'admin') {
            $data['metrics'] = [
                'total_students' => DB::table('students')->where('status', 'aktif')->count(),
                'total_teachers' => DB::table('teachers')->count(),
                'total_classes' => DB::table('classes')->count(),
                'total_subjects' => DB::table('subjects')->count(),
                'total_users' => DB::table('users')->count(),
            ];
            $data['recent_classes'] = DB::table('classes')
                ->leftJoin('teachers', 'classes.homeroom_teacher_id', '=', 'teachers.id')
                ->select('classes.*', 'teachers.full_name as homeroom_teacher_name')
                ->orderBy('classes.grade_level')
                ->get()
                ->map(function ($cls) {
                    $cls->student_count = DB::table('students')->where('class_id', $cls->id)->count();
                    return $cls;
                });
        } elseif ($role === 'pimpinan') {
            $totalTeachers = DB::table('teachers')->count();
            $today = date('Y-m-d');
            $teachersPresent = DB::table('teacher_attendances')
                ->where('attendance_date', $today)
                ->where('status', 'Hadir')
                ->count();
            
            if ($teachersPresent === 0 && $totalTeachers > 0) {
                $latestDate = DB::table('teacher_attendances')->max('attendance_date');
                if ($latestDate) {
                    $teachersPresent = DB::table('teacher_attendances')
                        ->where('attendance_date', $latestDate)
                        ->where('status', 'Hadir')
                        ->count();
                }
            }

            $totalAttendances = DB::table('student_attendances')->count();
            $hadirCount = DB::table('student_attendances')->where('status', 'Hadir')->count();
            $attendancePercentage = $totalAttendances > 0 
                ? number_format(($hadirCount / $totalAttendances) * 100, 1) . '%' 
                : '100.0%';

            $verifiedRaports = DB::table('raport_evaluations')->whereIn('status', ['verified_wali_kelas', 'approved_kepsek'])->count();

            $data['metrics'] = [
                'total_students' => DB::table('students')->where('status', 'aktif')->count(),
                'total_teachers' => $totalTeachers,
                'teachers_present_today' => $teachersPresent,
                'total_classes' => DB::table('classes')->count(),
                'attendance_percentage' => $attendancePercentage,
                'verified_raports' => $verifiedRaports,
                'counseling_count' => DB::table('counseling_sessions')->count(),
                'violations_count' => DB::table('discipline_violations')->count(),
                'achievements_count' => DB::table('student_achievements')->count(),
            ];

            $data['recent_achievements'] = DB::table('student_achievements')
                ->join('students', 'student_achievements.student_id', '=', 'students.id')
                ->select('student_achievements.*', 'students.full_name as student_name')
                ->orderByDesc('student_achievements.event_date')
                ->limit(4)
                ->get();

        } elseif ($role === 'guru') {
            $teacher = DB::table('teachers')->where('user_id', $user->id)->first();
            $homeroomClass = $teacher ? DB::table('classes')->where('homeroom_teacher_id', $teacher->id)->first() : null;
            $classStudentsCount = $homeroomClass ? DB::table('students')->where('class_id', $homeroomClass->id)->count() : 0;

            $data['teacher'] = $teacher;
            $data['homeroom_class'] = $homeroomClass;
            
            $teacherSubjectIds = $teacher ? DB::table('teacher_subjects')->where('teacher_id', $teacher->id)->pluck('id') : collect([]);
            $topicIds = DB::table('topics')->whereIn('teacher_subject_id', $teacherSubjectIds)->pluck('id');

            $data['metrics'] = [
                'homeroom_students' => $classStudentsCount,
                'class_name' => $homeroomClass?->name ?? 'Belum Ditugaskan',
                'active_materials' => DB::table('materials')->whereIn('topic_id', $topicIds)->count() ?: DB::table('materials')->count(),
                'active_assignments' => DB::table('assignments')->whereIn('topic_id', $topicIds)->count() ?: DB::table('assignments')->count(),
                'pending_grades' => DB::table('assignment_submissions')->whereNull('score')->count(),
            ];

            $data['pending_submissions'] = DB::table('assignment_submissions')
                ->join('assignments', 'assignment_submissions.assignment_id', '=', 'assignments.id')
                ->join('students', 'assignment_submissions.student_id', '=', 'students.id')
                ->whereNull('assignment_submissions.score')
                ->select(
                    'assignment_submissions.*', 
                    'assignments.title as assignment_title',
                    'students.full_name as student_name'
                )
                ->orderByDesc('assignment_submissions.submitted_at')
                ->limit(5)
                ->get();

        } elseif ($role === 'bk') {
            $teacher = DB::table('teachers')->where('user_id', $user->id)->first();
            $data['teacher'] = $teacher;
            $data['metrics'] = [
                'total_sessions' => DB::table('counseling_sessions')->count(),
                'active_violations' => DB::table('discipline_violations')->count(),
                'total_achievements' => DB::table('student_achievements')->count(),
                'monitored_students' => DB::table('students')->where('status', 'aktif')->count(),
            ];

            $data['recent_violations'] = DB::table('discipline_violations')
                ->join('students', 'discipline_violations.student_id', '=', 'students.id')
                ->leftJoin('classes', 'students.class_id', '=', 'classes.id')
                ->select(
                    'discipline_violations.*', 
                    'students.full_name as student_name',
                    'classes.name as class_name'
                )
                ->orderByDesc('discipline_violations.violation_date')
                ->limit(4)
                ->get();

            $data['recent_sessions'] = DB::table('counseling_sessions')
                ->join('students', 'counseling_sessions.student_id', '=', 'students.id')
                ->leftJoin('classes', 'students.class_id', '=', 'classes.id')
                ->select(
                    'counseling_sessions.*', 
                    'students.full_name as student_name',
                    'classes.name as class_name'
                )
                ->orderByDesc('counseling_sessions.session_date')
                ->limit(4)
                ->get();

        } else {
            // Siswa
            $student = $user ? DB::table('students')
                ->leftJoin('classes', 'students.class_id', '=', 'classes.id')
                ->where('students.user_id', $user->id)
                ->select('students.*', 'classes.name as class_name')
                ->first() : null;

            $studentId = $student?->id;
            
            $hadirCount = $studentId ? DB::table('student_attendances')->where('student_id', $studentId)->where('status', 'Hadir')->count() : 18;
            $izinCount = $studentId ? DB::table('student_attendances')->where('student_id', $studentId)->where('status', 'Izin')->count() : 1;
            $sakitCount = $studentId ? DB::table('student_attendances')->where('student_id', $studentId)->where('status', 'Sakit')->count() : 1;
            $alpaCount = $studentId ? DB::table('student_attendances')->where('student_id', $studentId)->where('status', 'Alpa')->count() : 0;

            $attendanceCounts = [
                'hadir' => $hadirCount,
                'izin' => $izinCount,
                'sakit' => $sakitCount,
                'alpa' => $alpaCount,
            ];

            $avgScore = $studentId ? DB::table('student_grades')->where('student_id', $studentId)->avg('final_score') : null;

            $data['student'] = $student;
            $data['attendance'] = $attendanceCounts;
            $data['metrics'] = [
                'class_name' => $student?->class_name ?? 'Kelas 6',
                'nisn' => $student?->nisn ?? $user?->username ?? '-',
                'total_materials' => DB::table('materials')->count(),
                'active_assignments' => DB::table('assignments')->count(),
                'gpa_avg' => $avgScore ? number_format($avgScore, 1) : '88.5',
            ];

            $data['assignments'] = DB::table('assignments')
                ->join('topics', 'assignments.topic_id', '=', 'topics.id')
                ->join('teacher_subjects', 'topics.teacher_subject_id', '=', 'teacher_subjects.id')
                ->join('subjects', 'teacher_subjects.subject_id', '=', 'subjects.id')
                ->select(
                    'assignments.*',
                    'subjects.name as subject_name'
                )
                ->orderByDesc('assignments.due_date')
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

