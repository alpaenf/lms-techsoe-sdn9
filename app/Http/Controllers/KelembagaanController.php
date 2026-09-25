<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class KelembagaanController extends Controller
{
    public function index(): Response
    {
        $schoolProfile = DB::table('school_profiles')->first();
        $academicYears = DB::table('academic_years')->orderBy('id', 'desc')->get();

        return Inertia::render('Kelembagaan/Index', [
            'schoolProfile' => $schoolProfile,
            'academicYears' => $academicYears,
        ]);
    }
}
