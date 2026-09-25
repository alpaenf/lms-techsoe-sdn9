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
        $classes = DB::table('classes')->orderBy('grade_level')->get();
        $defaultClassId = $classes->first()?->id ?? 1;
        $selectedClassId = $request->query('class_id', $defaultClassId);
        $subjects = DB::table('subjects')->orderBy('code')->get();

        $students = DB::table('students')
            ->where('students.class_id', $selectedClassId)
            ->select('id', 'nisn', 'full_name', 'gender')
            ->orderBy('full_name')
            ->get();

        return Inertia::render('ERapor/Index', [
            'classes' => $classes,
            'selectedClassId' => (int)$selectedClassId,
            'subjects' => $subjects,
            'students' => $students,
        ]);
    }
}
