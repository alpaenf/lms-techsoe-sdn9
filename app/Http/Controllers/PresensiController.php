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
        $selectedMonth = $request->query('month', date('m'));
        $selectedYear = $request->query('year', date('Y'));

        $classes = DB::table('classes')->orderBy('grade_level')->get();
        $defaultClassId = $classes->first()?->id ?? 1;
        $selectedClassId = (int)$request->query('class_id', $defaultClassId);

        $students = [];
        $teachers = [];
        $monthlyRecap = [];

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

            // Monthly Recap for Teachers
            $teacherMonthly = DB::table('teacher_attendances')
                ->whereYear('attendance_date', $selectedYear)
                ->whereMonth('attendance_date', $selectedMonth)
                ->select(
                    'teacher_id',
                    DB::raw("SUM(CASE WHEN status = 'Hadir' THEN 1 ELSE 0 END) as total_hadir"),
                    DB::raw("SUM(CASE WHEN status = 'Dinas_Luar' THEN 1 ELSE 0 END) as total_dinas"),
                    DB::raw("SUM(CASE WHEN status = 'Izin' THEN 1 ELSE 0 END) as total_izin"),
                    DB::raw("SUM(CASE WHEN status = 'Sakit' THEN 1 ELSE 0 END) as total_sakit"),
                    DB::raw("SUM(CASE WHEN status = 'Alpa' THEN 1 ELSE 0 END) as total_alpa"),
                    DB::raw("COUNT(*) as total_days")
                )
                ->groupBy('teacher_id')
                ->get()
                ->keyBy('teacher_id');

            foreach ($teachers as $t) {
                $rec = $teacherMonthly[$t->id] ?? null;
                $tot = $rec?->total_days ?? 0;
                $hadir = ($rec?->total_hadir ?? 0) + ($rec?->total_dinas ?? 0);
                $pct = $tot > 0 ? round(($hadir / $tot) * 100, 1) : 100;

                $monthlyRecap[$t->id] = [
                    'hadir' => $rec?->total_hadir ?? 0,
                    'dinas' => $rec?->total_dinas ?? 0,
                    'izin' => $rec?->total_izin ?? 0,
                    'sakit' => $rec?->total_sakit ?? 0,
                    'alpa' => $rec?->total_alpa ?? 0,
                    'percentage' => $pct
                ];
            }
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

            // Monthly Recap for Students in Class
            $studentIds = $students->pluck('id')->toArray();

            $studentMonthly = DB::table('student_attendances')
                ->whereIn('student_id', $studentIds)
                ->whereYear('attendance_date', $selectedYear)
                ->whereMonth('attendance_date', $selectedMonth)
                ->select(
                    'student_id',
                    DB::raw("SUM(CASE WHEN status = 'Hadir' THEN 1 ELSE 0 END) as total_hadir"),
                    DB::raw("SUM(CASE WHEN status = 'Izin' THEN 1 ELSE 0 END) as total_izin"),
                    DB::raw("SUM(CASE WHEN status = 'Sakit' THEN 1 ELSE 0 END) as total_sakit"),
                    DB::raw("SUM(CASE WHEN status = 'Alpa' THEN 1 ELSE 0 END) as total_alpa"),
                    DB::raw("COUNT(*) as total_days")
                )
                ->groupBy('student_id')
                ->get()
                ->keyBy('student_id');

            foreach ($students as $s) {
                $rec = $studentMonthly[$s->id] ?? null;
                $tot = $rec?->total_days ?? 0;
                $hadir = $rec?->total_hadir ?? 0;
                $pct = $tot > 0 ? round(($hadir / $tot) * 100, 1) : 100;

                $monthlyRecap[$s->id] = [
                    'hadir' => $rec?->total_hadir ?? 0,
                    'izin' => $rec?->total_izin ?? 0,
                    'sakit' => $rec?->total_sakit ?? 0,
                    'alpa' => $rec?->total_alpa ?? 0,
                    'percentage' => $pct
                ];
            }
        }

        // Attendance Permissions (Pengajuan Izin / Sakit)
        $permissions = DB::table('attendance_permissions')
            ->leftJoin('users', 'attendance_permissions.user_id', '=', 'users.id')
            ->leftJoin('students', 'attendance_permissions.student_id', '=', 'students.id')
            ->leftJoin('teachers', 'attendance_permissions.teacher_id', '=', 'teachers.id')
            ->select(
                'attendance_permissions.*',
                'users.name as submitter_name',
                'students.full_name as student_name',
                'teachers.full_name as teacher_name'
            )
            ->orderBy('attendance_permissions.id', 'desc')
            ->get();

        return Inertia::render('Presensi/Index', [
            'type' => $type,
            'classes' => $classes,
            'selectedClassId' => $selectedClassId,
            'selectedDate' => $selectedDate,
            'selectedMonth' => (int)$selectedMonth,
            'selectedYear' => (int)$selectedYear,
            'students' => $students,
            'teachers' => $teachers,
            'monthlyRecap' => $monthlyRecap,
            'permissions' => $permissions,
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

    public function storePermission(Request $request)
    {
        $request->validate([
            'permission_type' => 'required|in:Izin,Sakit',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string|max:1000',
            'attachment' => 'nullable|file|mimes:jpeg,jpg,png,pdf|max:5120',
        ]);

        $user = auth()->user();
        $student = DB::table('students')->where('user_id', $user->id)->first();
        $teacher = DB::table('teachers')->where('user_id', $user->id)->first();

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('permissions', 'public');
        }

        DB::table('attendance_permissions')->insert([
            'user_id' => $user->id,
            'student_id' => $student?->id,
            'teacher_id' => $teacher?->id,
            'type' => $teacher ? 'guru' : 'siswa',
            'permission_type' => $request->permission_type,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'reason' => $request->reason,
            'attachment_path' => $attachmentPath,
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('message', 'Surat permohonan izin / sakit berhasil diajukan.');
    }

    public function updatePermissionStatus(Request $request, $id)
    {
        $status = $request->input('status'); // 'approved' or 'rejected'
        if (!in_array($status, ['approved', 'rejected'])) {
            return back()->withErrors(['status' => 'Status tidak valid.']);
        }

        $perm = DB::table('attendance_permissions')->where('id', $id)->first();
        if (!$perm) {
            return back()->withErrors(['id' => 'Data permohonan tidak ditemukan.']);
        }

        DB::table('attendance_permissions')->where('id', $id)->update([
            'status' => $status,
            'approved_by' => auth()->id(),
            'updated_at' => now(),
        ]);

        // If approved, automatically update daily attendance for the date range
        if ($status === 'approved') {
            $period = new \DatePeriod(
                new \DateTime($perm->start_date),
                new \DateInterval('P1D'),
                (new \DateTime($perm->end_date))->modify('+1 day')
            );

            $academicYear = DB::table('academic_years')->where('is_active', true)->first();

            foreach ($period as $dt) {
                $curDate = $dt->format('Y-m-d');
                if ($perm->type === 'siswa' && $perm->student_id) {
                    $student = DB::table('students')->where('id', $perm->student_id)->first();
                    DB::table('student_attendances')->updateOrInsert(
                        [
                            'student_id' => $perm->student_id,
                            'attendance_date' => $curDate,
                        ],
                        [
                            'class_id' => $student?->class_id ?? 1,
                            'academic_year_id' => $academicYear?->id ?? 1,
                            'status' => $perm->permission_type,
                            'notes' => 'Disetujui Surat Izin/Sakit: ' . $perm->reason,
                            'recorded_by' => auth()->id() ?? 1,
                            'updated_at' => now(),
                        ]
                    );
                } elseif ($perm->type === 'guru' && $perm->teacher_id) {
                    DB::table('teacher_attendances')->updateOrInsert(
                        [
                            'teacher_id' => $perm->teacher_id,
                            'attendance_date' => $curDate,
                        ],
                        [
                            'status' => $perm->permission_type,
                            'notes' => 'Disetujui Surat Izin/Sakit: ' . $perm->reason,
                            'updated_at' => now(),
                        ]
                    );
                }
            }
        }

        return back()->with('message', 'Status permohonan izin berhasil diperbarui.');
    }
}


