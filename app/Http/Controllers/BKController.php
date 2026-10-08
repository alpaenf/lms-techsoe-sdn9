<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class BKController extends Controller
{
    public function index(): Response
    {
        $sessions = DB::table('counseling_sessions')
            ->leftJoin('students', 'counseling_sessions.student_id', '=', 'students.id')
            ->leftJoin('teachers', 'counseling_sessions.counselor_id', '=', 'teachers.id')
            ->select('counseling_sessions.*', 'students.full_name as student_name', 'teachers.full_name as counselor_name')
            ->orderBy('counseling_sessions.id', 'desc')
            ->get();

        $violations = DB::table('discipline_violations')
            ->leftJoin('students', 'discipline_violations.student_id', '=', 'students.id')
            ->select('discipline_violations.*', 'students.full_name as student_name')
            ->orderBy('discipline_violations.id', 'desc')
            ->get();

        $achievements = DB::table('student_achievements')
            ->leftJoin('students', 'student_achievements.student_id', '=', 'students.id')
            ->select('student_achievements.*', 'students.full_name as student_name')
            ->orderBy('student_achievements.id', 'desc')
            ->get();

        $students = DB::table('students')
            ->select('id', 'nisn', 'full_name', 'class_id')
            ->orderBy('full_name')
            ->get();

        $counselors = DB::table('teachers')
            ->select('id', 'full_name', 'nip')
            ->orderBy('full_name')
            ->get();

        return Inertia::render('BK/Index', [
            'sessions' => $sessions,
            'violations' => $violations,
            'achievements' => $achievements,
            'students' => $students,
            'counselors' => $counselors,
        ]);
    }

    public function storeSession(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'session_date' => 'required|date',
            'topic' => 'required|string|max:255',
            'action_plan' => 'required|string',
            'counselor_id' => 'nullable|exists:teachers,id',
        ]);

        $defaultCounselor = DB::table('teachers')->first();

        DB::table('counseling_sessions')->insert([
            'student_id' => $request->student_id,
            'counselor_id' => $request->counselor_id ?? ($defaultCounselor?->id ?? 1),
            'session_date' => $request->session_date,
            'topic' => $request->topic,
            'action_plan' => $request->action_plan,
            'is_confidential' => $request->boolean('is_confidential', true),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('message', 'Catatan sesi bimbingan konseling berhasil ditambahkan.');
    }

    public function storeViolation(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'violation_date' => 'required|date',
            'violation_name' => 'required|string|max:255',
            'penalty_points' => 'required|integer|min:1|max:100',
            'sanction_action' => 'required|string',
        ]);

        DB::table('discipline_violations')->insert([
            'student_id' => $request->student_id,
            'violation_date' => $request->violation_date,
            'violation_name' => $request->violation_name,
            'penalty_points' => (int) $request->penalty_points,
            'sanction_action' => $request->sanction_action,
            'call_letter_sent' => $request->boolean('call_letter_sent', false),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('message', 'Catatan pelanggaran kedisiplinan berhasil ditambahkan.');
    }

    public function storeAchievement(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'title' => 'required|string|max:255',
            'level' => 'required|in:sekolah,kecamatan,kabupaten,provinsi,nasional',
            'rank' => 'required|string|max:50',
            'event_date' => 'required|date',
        ]);

        DB::table('student_achievements')->insert([
            'student_id' => $request->student_id,
            'title' => $request->title,
            'level' => $request->level,
            'rank' => $request->rank,
            'event_date' => $request->event_date,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('message', 'Data prestasi siswa berhasil ditambahkan.');
    }

    public function destroySession($id)
    {
        DB::table('counseling_sessions')->where('id', $id)->delete();

        return back()->with('message', 'Catatan sesi konseling berhasil dihapus.');
    }

    public function destroyViolation($id)
    {
        DB::table('discipline_violations')->where('id', $id)->delete();

        return back()->with('message', 'Catatan pelanggaran berhasil dihapus.');
    }

    public function destroyAchievement($id)
    {
        DB::table('student_achievements')->where('id', $id)->delete();

        return back()->with('message', 'Catatan prestasi berhasil dihapus.');
    }
}
