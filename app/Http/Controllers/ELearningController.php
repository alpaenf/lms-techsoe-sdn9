<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ELearningController extends Controller
{
    public function index(): Response
    {
        $subjects = DB::table('subjects')->get();
        $classes = DB::table('classes')->get();
        
        $materials = DB::table('materials')
            ->leftJoin('topics', 'materials.topic_id', '=', 'topics.id')
            ->select('materials.*', 'topics.title as topic_title')
            ->get();

        $assignments = DB::table('assignments')
            ->leftJoin('topics', 'assignments.topic_id', '=', 'topics.id')
            ->select('assignments.*', 'topics.title as topic_title')
            ->get();

        return Inertia::render('ELearning/Index', [
            'subjects' => $subjects,
            'classes' => $classes,
            'materials' => $materials,
            'assignments' => $assignments,
        ]);
    }
}
