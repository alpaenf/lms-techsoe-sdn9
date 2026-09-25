<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class MasterDataController extends Controller
{
    public function index(Request $request): Response
    {
        $tab = $request->query('tab', 'siswa');

        $teachers = DB::table('teachers')
            ->leftJoin('users', 'teachers.user_id', '=', 'users.id')
            ->select('teachers.*', 'users.email', 'users.username')
            ->get();

        $classes = DB::table('classes')
            ->leftJoin('teachers', 'classes.homeroom_teacher_id', '=', 'teachers.id')
            ->select('classes.*', 'teachers.full_name as homeroom_teacher_name')
            ->orderBy('classes.grade_level')
            ->get();

        $subjects = DB::table('subjects')
            ->orderBy('code')
            ->get();

        $students = DB::table('students')
            ->leftJoin('classes', 'students.class_id', '=', 'classes.id')
            ->leftJoin('guardians', 'students.id', '=', 'guardians.student_id')
            ->select('students.*', 'classes.name as class_name', 'guardians.name as guardian_name', 'guardians.phone_number as guardian_phone')
            ->orderBy('students.full_name')
            ->paginate(15);

        return Inertia::render('MasterData/Index', [
            'currentTab' => $tab,
            'teachers' => $teachers,
            'classes' => $classes,
            'subjects' => $subjects,
            'students' => $students,
        ]);
    }

    public function storeClass(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'grade_level' => 'required|integer|min:1|max:12',
            'homeroom_teacher_id' => 'nullable|exists:teachers,id',
        ]);

        $activeYear = DB::table('academic_years')->where('is_active', true)->first();
        $academicYearId = $activeYear?->id ?? 1;

        DB::table('classes')->insert([
            'academic_year_id' => $academicYearId,
            'name' => $validated['name'],
            'grade_level' => $validated['grade_level'],
            'homeroom_teacher_id' => $validated['homeroom_teacher_id'] ?: null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('message', 'Rombongan belajar berhasil ditambahkan.');
    }

    public function updateClass(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'grade_level' => 'required|integer|min:1|max:12',
            'homeroom_teacher_id' => 'nullable|exists:teachers,id',
        ]);

        DB::table('classes')->where('id', $id)->update([
            'name' => $validated['name'],
            'grade_level' => $validated['grade_level'],
            'homeroom_teacher_id' => $validated['homeroom_teacher_id'] ?: null,
            'updated_at' => now(),
        ]);

        return back()->with('message', 'Rombongan belajar berhasil diperbarui.');
    }

    public function destroyClass($id)
    {
        $studentCount = DB::table('students')->where('class_id', $id)->count();
        if ($studentCount > 0) {
            return back()->withErrors(['error' => "Tidak dapat menghapus kelas ini karena masih memiliki {$studentCount} peserta didik terdaftar."]);
        }

        DB::table('classes')->where('id', $id)->delete();

        return back()->with('message', 'Rombongan belajar berhasil dihapus.');
    }
}

