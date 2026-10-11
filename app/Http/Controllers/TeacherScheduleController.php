<?php

namespace App\Http\Controllers;

use App\Models\AppNotification;
use App\Models\TeachingSchedule;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TeacherScheduleController extends Controller
{
    private function getIndonesianDayName(?Carbon $date = null): string
    {
        $date = $date ?: Carbon::now();
        $days = [
            0 => 'Minggu',
            1 => 'Senin',
            2 => 'Selasa',
            3 => 'Rabu',
            4 => 'Kamis',
            5 => 'Jumat',
            6 => 'Sabtu',
        ];

        return $days[$date->dayOfWeek] ?? 'Senin';
    }

    private function getTeacherForUser($user)
    {
        return DB::table('teachers')->where('user_id', $user->id)->first();
    }

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $teacher = $this->getTeacherForUser($user);

        if (! $teacher) {
            return response()->json(['schedules' => [], 'today_day' => $this->getIndonesianDayName()]);
        }

        $schedules = DB::table('teaching_schedules')
            ->join('classes', 'teaching_schedules.class_id', '=', 'classes.id')
            ->join('subjects', 'teaching_schedules.subject_id', '=', 'subjects.id')
            ->where('teaching_schedules.teacher_id', $teacher->id)
            ->where('teaching_schedules.is_active', true)
            ->select(
                'teaching_schedules.*',
                'classes.name as class_name',
                'classes.grade_level',
                'subjects.name as subject_name',
                'subjects.code as subject_code'
            )
            ->orderByRaw("FIELD(day_of_week, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu')")
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'schedules' => $schedules,
            'today_day' => $this->getIndonesianDayName(),
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $teacher = $this->getTeacherForUser($user);

        if (! $teacher) {
            return back()->with('error', 'Profil guru tidak ditemukan.');
        }

        $validated = $request->validate([
            'day_of_week' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu',
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'room' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:500',
        ], [
            'end_time.after' => 'Jam selesai harus lebih akhir dari jam mulai.',
            'class_id.required' => 'Pilih kelas atau rombel yang diajar.',
            'subject_id.required' => 'Pilih mata pelajaran yang diajar.',
        ]);

        $activeYear = DB::table('academic_years')->where('is_active', true)->first();

        TeachingSchedule::create([
            'teacher_id' => $teacher->id,
            'academic_year_id' => $activeYear?->id,
            'class_id' => $validated['class_id'],
            'subject_id' => $validated['subject_id'],
            'day_of_week' => $validated['day_of_week'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'room' => $validated['room'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'is_active' => true,
        ]);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'message' => 'Jadwal mengajar berhasil ditambahkan.']);
        }

        return back()->with('success', 'Jadwal mengajar berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $teacher = $this->getTeacherForUser($user);

        if (! $teacher) {
            return back()->with('error', 'Profil guru tidak ditemukan.');
        }

        $schedule = TeachingSchedule::where('id', $id)
            ->where('teacher_id', $teacher->id)
            ->firstOrFail();

        $validated = $request->validate([
            'day_of_week' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu',
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'room' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:500',
        ], [
            'end_time.after' => 'Jam selesai harus lebih akhir dari jam mulai.',
        ]);

        $schedule->update([
            'class_id' => $validated['class_id'],
            'subject_id' => $validated['subject_id'],
            'day_of_week' => $validated['day_of_week'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'room' => $validated['room'] ?? null,
            'notes' => $validated['notes'] ?? null,
        ]);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'message' => 'Jadwal mengajar berhasil diperbarui.']);
        }

        return back()->with('success', 'Jadwal mengajar berhasil diperbarui.');
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $teacher = $this->getTeacherForUser($user);

        if (! $teacher) {
            return back()->with('error', 'Profil guru tidak ditemukan.');
        }

        $schedule = TeachingSchedule::where('id', $id)
            ->where('teacher_id', $teacher->id)
            ->firstOrFail();

        $schedule->delete();

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'message' => 'Jadwal mengajar berhasil dihapus.']);
        }

        return back()->with('success', 'Jadwal mengajar berhasil dihapus.');
    }

    /**
     * Check reminders for today's teaching schedules.
     * Generates in-app notifications and returns toast trigger info.
     */
    public function checkReminders(Request $request): JsonResponse
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['reminders' => []]);
        }

        $teacher = $this->getTeacherForUser($user);
        if (! $teacher) {
            return response()->json(['reminders' => []]);
        }

        $now = Carbon::now();
        $todayName = $this->getIndonesianDayName($now);
        $currentTime = $now->format('H:i:s');
        $todayDateStr = $now->toDateString();

        $todaySchedules = DB::table('teaching_schedules')
            ->join('classes', 'teaching_schedules.class_id', '=', 'classes.id')
            ->join('subjects', 'teaching_schedules.subject_id', '=', 'subjects.id')
            ->where('teaching_schedules.teacher_id', $teacher->id)
            ->where('teaching_schedules.day_of_week', $todayName)
            ->where('teaching_schedules.is_active', true)
            ->select(
                'teaching_schedules.*',
                'classes.name as class_name',
                'subjects.name as subject_name',
                'subjects.code as subject_code'
            )
            ->orderBy('start_time')
            ->get();

        $reminders = [];

        foreach ($todaySchedules as $sched) {
            // Compare time in minutes
            $startTime = Carbon::createFromTimeString($sched->start_time);
            $endTime = Carbon::createFromTimeString($sched->end_time);

            $diffInMinutesToStart = $now->diffInMinutes($startTime, false);
            $isOngoing = ($currentTime >= $sched->start_time && $currentTime <= $sched->end_time);
            $isUpcomingSoon = ($diffInMinutesToStart >= 0 && $diffInMinutesToStart <= 30);

            if ($isUpcomingSoon || $isOngoing) {
                $statusType = $isOngoing ? 'ongoing' : 'upcoming';
                $statusLabel = $isOngoing
                    ? 'Sedang Berlangsung'
                    : "Mulai dalam {$diffInMinutesToStart} menit";

                // Unique notification title / identifier for today
                $notifTitle = "Pengingat Jadwal: {$sched->subject_name} ({$sched->class_name})";
                $notifMessage = $isOngoing
                    ? "Kelas {$sched->subject_name} di {$sched->class_name} sedang berlangsung ({$sched->start_time} - {$sched->end_time})."
                    : "Jadwal mengajar {$sched->subject_name} di {$sched->class_name} akan dimulai pukul {$sched->start_time} (ruang: " . ($sched->room ?: $sched->class_name) . ").";

                // Check if notification already created for this user, schedule, and date
                $alreadyNotified = AppNotification::where('user_id', $user->id)
                    ->where('type', 'jadwal_mengajar')
                    ->whereDate('created_at', $todayDateStr)
                    ->where('title', $notifTitle)
                    ->exists();

                if (! $alreadyNotified) {
                    AppNotification::create([
                        'user_id' => $user->id,
                        'role' => $user->role,
                        'title' => $notifTitle,
                        'message' => $notifMessage,
                        'type' => 'jadwal_mengajar',
                        'link' => route('dashboard'),
                        'is_read' => false,
                    ]);
                }

                $reminders[] = [
                    'id' => $sched->id,
                    'subject_name' => $sched->subject_name,
                    'class_name' => $sched->class_name,
                    'start_time' => substr($sched->start_time, 0, 5),
                    'end_time' => substr($sched->end_time, 0, 5),
                    'room' => $sched->room ?: $sched->class_name,
                    'notes' => $sched->notes,
                    'status' => $statusType,
                    'status_label' => $statusLabel,
                    'minutes_left' => $diffInMinutesToStart,
                ];
            }
        }

        return response()->json([
            'today' => $todayName,
            'current_time' => substr($currentTime, 0, 5),
            'reminders' => $reminders,
        ]);
    }
}
