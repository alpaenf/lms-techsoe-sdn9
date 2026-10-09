<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

$p = Hash::make('password123');

// 1. Guru Mapel PAI User
$guruMapelUser = DB::table('users')->where('username', '199208152020121005')->first();
if (!$guruMapelUser) {
    $guruMapelUserId = DB::table('users')->insertGetId([
        'name' => 'Alfiana, S.Pd.I.',
        'username' => '199208152020121005',
        'email' => 'gurumapel@sdn9gandangbatu.sch.id',
        'password' => $p,
        'role' => 'guru_mapel',
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);
} else {
    $guruMapelUserId = $guruMapelUser->id;
    DB::table('users')->where('id', $guruMapelUserId)->update(['role' => 'guru_mapel']);
}

// 2. Tendik User
$tendikUser = DB::table('users')->where('username', '199504102022032010')->first();
if (!$tendikUser) {
    DB::table('users')->insert([
        'name' => 'Rina Agustina, A.Md.',
        'username' => '199504102022032010',
        'email' => 'tendik@sdn9gandangbatu.sch.id',
        'password' => $p,
        'role' => 'tendik',
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);
} else {
    DB::table('users')->where('id', $tendikUser->id)->update(['role' => 'tendik']);
}

// 3. Teacher record for Guru Mapel
$t1 = DB::table('teachers')->where('user_id', $guruMapelUserId)->first();
if (!$t1) {
    $t1Id = DB::table('teachers')->insertGetId([
        'user_id' => $guruMapelUserId,
        'nip' => '199208152020121005',
        'full_name' => 'Alfiana, S.Pd.I.',
        'gender' => 'P',
        'employment_status' => 'PNS',
        'education_level' => 'S1',
        'teacher_type' => 'guru_mapel',
        'subject_specialization' => 'Pendidikan Agama Islam',
        'created_at' => now(),
        'updated_at' => now(),
    ]);
} else {
    $t1Id = $t1->id;
    DB::table('teachers')->where('id', $t1Id)->update([
        'teacher_type' => 'guru_mapel',
        'subject_specialization' => 'Pendidikan Agama Islam',
    ]);
}

// 4. PAI Subject
$pai = DB::table('subjects')->where('code', 'PAI-SD')->first();
if (!$pai) {
    $paiId = DB::table('subjects')->insertGetId([
        'code' => 'PAI-SD',
        'name' => 'Pendidikan Agama Islam',
        'category' => 'wajib',
        'kkm' => 75.00,
        'created_at' => now(),
        'updated_at' => now(),
    ]);
} else {
    $paiId = $pai->id;
}

// 5. Map teacher_subjects for PAI across all classes
$academicYear = DB::table('academic_years')->where('is_active', true)->first();
$acadId = $academicYear ? $academicYear->id : 1;
$classes = DB::table('classes')->get();
foreach ($classes as $c) {
    $exists = DB::table('teacher_subjects')
        ->where('teacher_id', $t1Id)
        ->where('subject_id', $paiId)
        ->where('class_id', $c->id)
        ->exists();
    if (!$exists) {
        DB::table('teacher_subjects')->insert([
            'teacher_id' => $t1Id,
            'subject_id' => $paiId,
            'class_id' => $c->id,
            'academic_year_id' => $acadId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}

echo "SUCCESS_SEEDED\n";
