<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class MasterDataController extends Controller
{
    public function index(Request $request): Response
    {
        $tab = $request->query('tab', 'siswa');

        $teachers = DB::table('teachers')
            ->leftJoin('users', 'teachers.user_id', '=', 'users.id')
            ->select(
                'teachers.*',
                'users.email',
                'users.username',
                'users.role'
            )
            ->orderBy('teachers.full_name')
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
            ->select(
                'students.*',
                'classes.name as class_name',
                'guardians.name as guardian_name',
                'guardians.relation_type as guardian_relation',
                'guardians.phone_number as guardian_phone',
                'guardians.occupation as guardian_occupation'
            )
            ->orderBy('students.full_name')
            ->get();

        return Inertia::render('MasterData/Index', [
            'currentTab' => $tab,
            'teachers' => $teachers,
            'classes' => $classes,
            'subjects' => $subjects,
            'students' => $students,
        ]);
    }

    // ==================== ROMBEL / CLASSES ==================== //

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

    // ==================== SISWA / STUDENTS ==================== //

    public function storeStudent(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'nisn' => 'required|string|size:10|unique:students,nisn',
            'nis' => 'required|string|max:20|unique:students,nis',
            'nik' => 'nullable|string|max:20',
            'class_id' => 'required|exists:classes,id',
            'gender' => 'required|in:L,P',
            'birth_place' => 'required|string|max:100',
            'birth_date' => 'required|date',
            'religion' => 'required|string|max:50',
            'address' => 'nullable|string',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_relation' => 'nullable|in:ayah,ibu,wali',
            'guardian_phone' => 'nullable|string|max:25',
            'guardian_occupation' => 'nullable|string|max:100',
        ]);

        DB::transaction(function () use ($validated) {
            // 1. Create User account
            $userId = DB::table('users')->insertGetId([
                'name' => $validated['full_name'],
                'username' => $validated['nisn'],
                'email' => $validated['nisn'].'@sdn9gandangbatu.sch.id',
                'password' => Hash::make('password123'),
                'role' => 'siswa',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 2. Create Student record
            $studentId = DB::table('students')->insertGetId([
                'user_id' => $userId,
                'nis' => $validated['nis'],
                'nisn' => $validated['nisn'],
                'nik' => $validated['nik'] ?? null,
                'full_name' => $validated['full_name'],
                'class_id' => $validated['class_id'],
                'gender' => $validated['gender'],
                'birth_place' => $validated['birth_place'],
                'birth_date' => date('Y-m-d', strtotime($validated['birth_date'])),
                'religion' => $validated['religion'],
                'address' => $validated['address'] ?? null,
                'entry_date' => date('Y-m-d'),
                'status' => 'aktif',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 3. Create Guardian record if specified
            if (! empty($validated['guardian_name'])) {
                DB::table('guardians')->insert([
                    'student_id' => $studentId,
                    'relation_type' => $validated['guardian_relation'] ?? 'ayah',
                    'name' => $validated['guardian_name'],
                    'occupation' => $validated['guardian_occupation'] ?? null,
                    'phone_number' => $validated['guardian_phone'] ?? null,
                    'address' => $validated['address'] ?? null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        });

        return back()->with('message', 'Data peserta didik baru berhasil ditambahkan.');
    }

    public function updateStudent(Request $request, $id)
    {
        $student = DB::table('students')->where('id', $id)->first();
        if (! $student) {
            return back()->withErrors(['error' => 'Data siswa tidak ditemukan.']);
        }

        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'nisn' => 'required|string|size:10|unique:students,nisn,'.$id,
            'nis' => 'required|string|max:20|unique:students,nis,'.$id,
            'nik' => 'nullable|string|max:20',
            'class_id' => 'required|exists:classes,id',
            'gender' => 'required|in:L,P',
            'birth_place' => 'required|string|max:100',
            'birth_date' => 'required|date',
            'religion' => 'required|string|max:50',
            'address' => 'nullable|string',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_relation' => 'nullable|in:ayah,ibu,wali',
            'guardian_phone' => 'nullable|string|max:25',
            'guardian_occupation' => 'nullable|string|max:100',
        ]);

        DB::transaction(function () use ($student, $validated) {
            // Update Student
            DB::table('students')->where('id', $student->id)->update([
                'full_name' => $validated['full_name'],
                'nisn' => $validated['nisn'],
                'nis' => $validated['nis'],
                'nik' => $validated['nik'] ?? null,
                'class_id' => $validated['class_id'],
                'gender' => $validated['gender'],
                'birth_place' => $validated['birth_place'],
                'birth_date' => $validated['birth_date'],
                'religion' => $validated['religion'],
                'address' => $validated['address'] ?? null,
                'updated_at' => now(),
            ]);

            // Update User
            DB::table('users')->where('id', $student->user_id)->update([
                'name' => $validated['full_name'],
                'username' => $validated['nisn'],
                'updated_at' => now(),
            ]);

            // Update/Insert Guardian
            if (! empty($validated['guardian_name'])) {
                DB::table('guardians')->updateOrInsert(
                    ['student_id' => $student->id],
                    [
                        'relation_type' => $validated['guardian_relation'] ?? 'ayah',
                        'name' => $validated['guardian_name'],
                        'occupation' => $validated['guardian_occupation'] ?? null,
                        'phone_number' => $validated['guardian_phone'] ?? null,
                        'address' => $validated['address'] ?? null,
                        'updated_at' => now(),
                    ]
                );
            }
        });

        return back()->with('message', 'Data peserta didik berhasil diperbarui.');
    }

    public function destroyStudent($id)
    {
        $student = DB::table('students')->where('id', $id)->first();
        if (! $student) {
            return back()->withErrors(['error' => 'Data siswa tidak ditemukan.']);
        }

        DB::transaction(function () use ($student) {
            DB::table('guardians')->where('student_id', $student->id)->delete();
            DB::table('students')->where('id', $student->id)->delete();
            DB::table('users')->where('id', $student->user_id)->delete();
        });

        return back()->with('message', 'Data peserta didik berhasil dihapus.');
    }

    // ==================== TENAGA PENDIDIK / TEACHERS ==================== //

    public function storeTeacher(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'nip' => 'nullable|string|max:30|unique:teachers,nip',
            'gender' => 'required|in:L,P',
            'employment_status' => 'required|in:PNS,PPPK,GTT,Honorer',
            'education_level' => 'required|string|max:50',
            'email' => 'nullable|email|unique:users,email',
            'role' => 'required|in:guru,guru_mapel,tendik,bk,pimpinan,admin',
            'subject_specialization' => 'nullable|string|max:255',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('teachers', 'public');
            $photoPath = '/storage/'.$path;
        }

        DB::transaction(function () use ($validated, $photoPath, $request) {
            $username = ! empty($validated['nip']) ? $validated['nip'] : 'guru_'.time();
            $email = ! empty($validated['email']) ? $validated['email'] : $username.'@sdn9gandangbatu.sch.id';

            $userId = DB::table('users')->insertGetId([
                'name' => $validated['full_name'],
                'username' => $username,
                'email' => $email,
                'password' => Hash::make('password123'),
                'role' => $validated['role'],
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $spec = $request->input('subject_specialization') ?: null;
            $teacherType = (! empty($spec) && ! in_array(strtolower($spec), ['guru kelas', 'wali kelas'])) ? 'guru_mapel' : 'guru_kelas';

            DB::table('teachers')->insert([
                'user_id' => $userId,
                'nip' => $validated['nip'] ?: null,
                'full_name' => $validated['full_name'],
                'gender' => $validated['gender'],
                'employment_status' => $validated['employment_status'],
                'education_level' => $validated['education_level'],
                'teacher_type' => $teacherType,
                'subject_specialization' => $spec,
                'photo' => $photoPath,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });

        return back()->with('message', 'Data tenaga pendidik baru berhasil ditambahkan.');
    }

    public function updateTeacher(Request $request, $id)
    {
        $teacher = DB::table('teachers')->where('id', $id)->first();
        if (! $teacher) {
            return back()->withErrors(['error' => 'Data pendidik tidak ditemukan.']);
        }

        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'nip' => 'nullable|string|max:30|unique:teachers,nip,'.$id,
            'gender' => 'required|in:L,P',
            'employment_status' => 'required|in:PNS,PPPK,GTT,Honorer',
            'education_level' => 'required|string|max:50',
            'email' => 'nullable|email|unique:users,email,'.$teacher->user_id,
            'role' => 'required|in:guru,guru_mapel,tendik,bk,pimpinan,admin',
            'subject_specialization' => 'nullable|string|max:255',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $photoPath = $teacher->photo;
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('teachers', 'public');
            $photoPath = '/storage/'.$path;
        }

        DB::transaction(function () use ($teacher, $validated, $photoPath, $request) {
            $spec = $request->input('subject_specialization') ?: null;
            $teacherType = (! empty($spec) && ! in_array(strtolower($spec), ['guru kelas', 'wali kelas'])) ? 'guru_mapel' : 'guru_kelas';

            $teacherData = [
                'full_name' => $validated['full_name'],
                'nip' => $validated['nip'] ?: null,
                'gender' => $validated['gender'],
                'employment_status' => $validated['employment_status'],
                'education_level' => $validated['education_level'],
                'teacher_type' => $teacherType,
                'photo' => $photoPath,
                'updated_at' => now(),
            ];
            if ($request->has('subject_specialization')) {
                $teacherData['subject_specialization'] = $spec;
            }

            DB::table('teachers')->where('id', $teacher->id)->update($teacherData);

            $userData = [
                'name' => $validated['full_name'],
                'role' => $validated['role'],
                'updated_at' => now(),
            ];
            if (! empty($validated['email'])) {
                $userData['email'] = $validated['email'];
            }
            if (! empty($validated['nip'])) {
                $userData['username'] = $validated['nip'];
            }

            DB::table('users')->where('id', $teacher->user_id)->update($userData);
        });

        return back()->with('message', 'Data tenaga pendidik berhasil diperbarui.');
    }

    public function destroyTeacher($id)
    {
        $teacher = DB::table('teachers')->where('id', $id)->first();
        if (! $teacher) {
            return back()->withErrors(['error' => 'Data pendidik tidak ditemukan.']);
        }

        $isHomeroom = DB::table('classes')->where('homeroom_teacher_id', $id)->exists();
        if ($isHomeroom) {
            return back()->withErrors(['error' => 'Pendidik ini tidak dapat dihapus karena masih bertugas sebagai Wali Kelas.']);
        }

        DB::transaction(function () use ($teacher) {
            DB::table('teachers')->where('id', $teacher->id)->delete();
            DB::table('users')->where('id', $teacher->user_id)->delete();
        });

        return back()->with('message', 'Data tenaga pendidik berhasil dihapus.');
    }

    // ==================== MATA PELAJARAN / SUBJECTS ==================== //

    public function storeSubject(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:20|unique:subjects,code',
            'name' => 'required|string|max:150',
            'category' => 'required|in:wajib,muatan_lokal,pilihan',
            'kkm' => 'required|numeric|min:0|max:100',
        ]);

        DB::table('subjects')->insert([
            'code' => strtoupper($validated['code']),
            'name' => $validated['name'],
            'category' => $validated['category'],
            'kkm' => $validated['kkm'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('message', 'Mata pelajaran berhasil ditambahkan.');
    }

    public function updateSubject(Request $request, $id)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:20|unique:subjects,code,'.$id,
            'name' => 'required|string|max:150',
            'category' => 'required|in:wajib,muatan_lokal,pilihan',
            'kkm' => 'required|numeric|min:0|max:100',
        ]);

        DB::table('subjects')->where('id', $id)->update([
            'code' => strtoupper($validated['code']),
            'name' => $validated['name'],
            'category' => $validated['category'],
            'kkm' => $validated['kkm'],
            'updated_at' => now(),
        ]);

        return back()->with('message', 'Mata pelajaran berhasil diperbarui.');
    }

    public function destroySubject($id)
    {
        DB::table('subjects')->where('id', $id)->delete();

        return back()->with('message', 'Mata pelajaran berhasil dihapus.');
    }
}
