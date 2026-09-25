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
            ->get();

        $violations = DB::table('discipline_violations')
            ->leftJoin('students', 'discipline_violations.student_id', '=', 'students.id')
            ->select('discipline_violations.*', 'students.full_name as student_name')
            ->get();

        $achievements = DB::table('student_achievements')
            ->leftJoin('students', 'student_achievements.student_id', '=', 'students.id')
            ->select('student_achievements.*', 'students.full_name as student_name')
            ->get();

        return Inertia::render('BK/Index', [
            'sessions' => $sessions,
            'violations' => $violations,
            'achievements' => $achievements,
        ]);
    }
}
