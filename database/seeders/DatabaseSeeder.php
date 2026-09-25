<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $defaultPassword = Hash::make('password123');

        // 1. Seed School Profile
        DB::table('school_profiles')->updateOrInsert(
            ['id' => 1],
            [
                'npsn' => '40307044',
                'school_name' => 'UPT SDN 9 Gandangbatu Sillanan',
                'principal_name' => 'Hendrika Genti, S.Pd.SD.',
                'principal_nip' => '198502012010012025',
                'address' => 'Gandangbatu, Kec. Gandangbatu Sillanan',
                'village' => 'Gandangbatu',
                'district' => 'Gandangbatu Sillanan',
                'regency' => 'Tana Toraja',
                'province' => 'Sulawesi Selatan',
                'postal_code' => '91871',
                'phone' => '081234567890',
                'email' => 'info@sdn9gandangbatu.sch.id',
                'website' => 'https://sdn9gandangbatu.sch.id',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // 2. Seed Academic Year
        $academicYearId = DB::table('academic_years')->insertGetId([
            'name' => '2026/2027',
            'semester' => 'ganjil',
            'is_active' => true,
            'start_date' => '2026-07-15',
            'end_date' => '2026-12-20',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 3. Seed Users
        // Admin
        $adminId = DB::table('users')->insertGetId([
            'name' => 'Administrator Sistem',
            'username' => 'admin',
            'email' => 'admin@sdn9gandangbatu.sch.id',
            'password' => $defaultPassword,
            'role' => 'admin',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Kepala Sekolah (Pimpinan)
        $kepsekUserId = DB::table('users')->insertGetId([
            'name' => 'Hendrika Genti, S.Pd.SD.',
            'username' => '198502012010012025',
            'email' => 'kepsek@sdn9gandangbatu.sch.id',
            'password' => $defaultPassword,
            'role' => 'pimpinan',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Guru / Wali Kelas Demo
        $guruUserId = DB::table('users')->insertGetId([
            'name' => 'Budi Santoso, S.Pd.',
            'username' => '198705122015021003',
            'email' => 'guru@sdn9gandangbatu.sch.id',
            'password' => $defaultPassword,
            'role' => 'guru',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Guru BK Demo
        $bkUserId = DB::table('users')->insertGetId([
            'name' => 'Maria Rante, S.Pd.',
            'username' => '199003202019032008',
            'email' => 'bk@sdn9gandangbatu.sch.id',
            'password' => $defaultPassword,
            'role' => 'bk',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Siswa Demo
        $siswaUserId = DB::table('users')->insertGetId([
            'name' => 'Siti Nurhaliza',
            'username' => '0081234567',
            'email' => 'siswa@sdn9gandangbatu.sch.id',
            'password' => $defaultPassword,
            'role' => 'siswa',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 4. Seed Teachers
        $teacherGuruId = DB::table('teachers')->insertGetId([
            'user_id' => $guruUserId,
            'nip' => '198705122015021003',
            'full_name' => 'Budi Santoso, S.Pd.',
            'gender' => 'L',
            'employment_status' => 'PNS',
            'education_level' => 'S1',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $teacherBkId = DB::table('teachers')->insertGetId([
            'user_id' => $bkUserId,
            'nip' => '199003202019032008',
            'full_name' => 'Maria Rante, S.Pd.',
            'gender' => 'P',
            'employment_status' => 'PNS',
            'education_level' => 'S1',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 5. Seed Classes (Kelas 1 - Kelas 6)
        $class6Id = null;
        for ($i = 1; $i <= 6; $i++) {
            $classId = DB::table('classes')->insertGetId([
                'academic_year_id' => $academicYearId,
                'grade_level' => $i,
                'name' => "Kelas {$i}",
                'homeroom_teacher_id' => ($i === 6) ? $teacherGuruId : null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if ($i === 6) {
                $class6Id = $classId;
            }
        }

        // 6. Seed Subjects (Katalog Mapel SD)
        $subjects = [
            ['code' => 'BIN-SD', 'name' => 'Bahasa Indonesia', 'category' => 'wajib', 'kkm' => 75.00],
            ['code' => 'MAT-SD', 'name' => 'Matematika', 'category' => 'wajib', 'kkm' => 70.00],
            ['code' => 'IPA-SD', 'name' => 'Ilmu Pengetahuan Alam', 'category' => 'wajib', 'kkm' => 75.00],
            ['code' => 'IPS-SD', 'name' => 'Ilmu Pengetahuan Sosial', 'category' => 'wajib', 'kkm' => 75.00],
            ['code' => 'PKN-SD', 'name' => 'Pendidikan Pancasila dan Kewarganegaraan', 'category' => 'wajib', 'kkm' => 75.00],
            ['code' => 'PJK-SD', 'name' => 'Pendidikan Jasmani dan Kesehatan', 'category' => 'wajib', 'kkm' => 75.00],
            ['code' => 'SBR-SD', 'name' => 'Seni Budaya dan Prakarya', 'category' => 'wajib', 'kkm' => 75.00],
            ['code' => 'MLK-TOR', 'name' => 'Muatan Lokal Bahasa Toraja', 'category' => 'muatan_lokal', 'kkm' => 75.00],
        ];

        foreach ($subjects as $subject) {
            DB::table('subjects')->insert(array_merge($subject, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        // 7. Seed Student Demo (Kelas 6)
        $studentId = DB::table('students')->insertGetId([
            'user_id' => $siswaUserId,
            'nis' => '2026001',
            'nisn' => '0081234567',
            'nik' => '7318012345670001',
            'full_name' => 'Siti Nurhaliza',
            'class_id' => $class6Id,
            'gender' => 'P',
            'birth_place' => 'Gandangbatu',
            'birth_date' => '2014-05-12',
            'religion' => 'Kristen',
            'address' => 'Dusun Gandangbatu RT 02 RW 01',
            'entry_date' => '2020-07-13',
            'status' => 'aktif',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 8. Seed Guardian
        DB::table('guardians')->insert([
            'student_id' => $studentId,
            'relation_type' => 'ayah',
            'name' => 'Yohanes Rante',
            'occupation' => 'Petani',
            'phone_number' => '082198765432',
            'address' => 'Dusun Gandangbatu RT 02 RW 01',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 9. Seed Announcement
        DB::table('announcements')->insert([
            'title' => 'Selamat Datang di Smart School LMS UPT SDN 9 Gandangbatu Sillanan',
            'content' => 'Sistem pembelajaran dan administrasi akademik terintegrasi telah aktif untuk Tahun Ajaran 2026/2027 Semester Ganjil. Seluruh guru dan siswa dapat mengakses materi ajar dan presensi harian.',
            'target_role' => 'all',
            'is_popup' => true,
            'published_at' => now(),
            'created_by' => $adminId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
