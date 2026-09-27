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

        // 7. Seed Students Demo (Kelas 6)
        $studentsData = [
            ['name' => 'Siti Nurhaliza', 'nis' => '2026001', 'nisn' => '0081234567', 'gender' => 'P', 'user_id' => $siswaUserId],
            ['name' => 'Markus Rapa', 'nis' => '2026002', 'nisn' => '0081234568', 'gender' => 'L', 'user_id' => null],
            ['name' => 'Yohana Tandi', 'nis' => '2026003', 'nisn' => '0081234569', 'gender' => 'P', 'user_id' => null],
            ['name' => 'Christian Batara', 'nis' => '2026004', 'nisn' => '0081234570', 'gender' => 'L', 'user_id' => null],
            ['name' => 'Elsafitri Limbong', 'nis' => '2026005', 'nisn' => '0081234571', 'gender' => 'P', 'user_id' => null],
        ];

        $studentIds = [];
        foreach ($studentsData as $st) {
            $uId = $st['user_id'];
            if (!$uId) {
                $uId = DB::table('users')->insertGetId([
                    'name' => $st['name'],
                    'username' => $st['nisn'],
                    'email' => strtolower(str_replace(' ', '', $st['name'])) . '@sdn9gandangbatu.sch.id',
                    'password' => $defaultPassword,
                    'role' => 'siswa',
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            $stId = DB::table('students')->insertGetId([
                'user_id' => $uId,
                'nis' => $st['nis'],
                'nisn' => $st['nisn'],
                'nik' => '73180123456' . rand(1000, 9999),
                'full_name' => $st['name'],
                'class_id' => $class6Id,
                'gender' => $st['gender'],
                'birth_place' => 'Gandangbatu',
                'birth_date' => '2014-05-12',
                'religion' => 'Kristen',
                'address' => 'Dusun Gandangbatu RT 02 RW 01',
                'entry_date' => '2020-07-13',
                'status' => 'aktif',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $studentIds[] = $stId;

            // Seed Guardian
            DB::table('guardians')->insert([
                'student_id' => $stId,
                'relation_type' => 'ayah',
                'name' => 'Orang Tua ' . $st['name'],
                'occupation' => 'Petani',
                'phone_number' => '08219876' . rand(1000, 9999),
                'address' => 'Dusun Gandangbatu',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        $studentId = $studentIds[0]; // Siti Nurhaliza

        // 8. Seed Announcement
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

        // 9. Seed Teacher Subjects, Topics, Materials, Assignments & Submissions
        $ipaSubject = DB::table('subjects')->where('code', 'IPA-SD')->first();
        $matSubject = DB::table('subjects')->where('code', 'MAT-SD')->first();
        $mlkSubject = DB::table('subjects')->where('code', 'MLK-TOR')->first();
        $binSubject = DB::table('subjects')->where('code', 'BIN-SD')->first();
        $ipsSubject = DB::table('subjects')->where('code', 'IPS-SD')->first();

        // Ensure teacher subjects map for all subjects in class 6
        $allSubjectRecords = DB::table('subjects')->get();
        $tsMap = [];
        foreach ($allSubjectRecords as $sbj) {
            $tsId = DB::table('teacher_subjects')->insertGetId([
                'teacher_id' => $teacherGuruId,
                'subject_id' => $sbj->id,
                'class_id' => $class6Id,
                'academic_year_id' => $academicYearId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $tsMap[$sbj->id] = $tsId;
        }

        if ($ipaSubject && isset($tsMap[$ipaSubject->id])) {
            $topicIpaId = DB::table('topics')->insertGetId([
                'teacher_subject_id' => $tsMap[$ipaSubject->id],
                'title' => 'Bab 1: Sistem Tata Surya & Karakteristik Planet',
                'description' => 'Materi rotasi bumi, revolusi bulan, serta pengenalan 8 planet dalam tata surya.',
                'order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('materials')->insert([
                'topic_id' => $topicIpaId,
                'title' => 'Modul 01: Sistem Tata Surya & Karakteristik Planet',
                'type' => 'file',
                'file_path' => null,
                'content_url' => null,
                'body_text' => 'Tata surya adalah kumpulan benda langit yang terdiri atas sebuah bintang yang disebut Matahari dan semua objek yang terikat oleh gaya gravitasinya.',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $assignmentIpaId = DB::table('assignments')->insertGetId([
                'topic_id' => $topicIpaId,
                'title' => 'Latihan Mandiri: Rangkaian Listrik Seri & Paralel',
                'instructions' => 'Gambarlah rangkaian listrik seri dan paralel pada buku gambar Anda, lalu foto dan unggah file hasil pekerjaan di sini.',
                'due_date' => now()->addDays(5)->format('Y-m-d H:i:s'),
                'max_score' => 100,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('assignment_submissions')->insert([
                'assignment_id' => $assignmentIpaId,
                'student_id' => $studentId,
                'submitted_at' => now()->subHours(2),
                'student_notes' => 'Berikut hasil gambar rangkaian listrik seri dan paralel saya Pak Budi.',
                'score' => 90.00,
                'teacher_feedback' => 'Gambar sangat rapi dan penjelasan diagram jelas. Bagus sekali!',
                'graded_at' => now()->subHour(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Seed Initial Grades & Raport Evaluations for all 5 Students in Kelas 6
        foreach ($studentIds as $idx => $sId) {
            // Seed Raport Evaluation
            DB::table('raport_evaluations')->insert([
                'student_id' => $sId,
                'academic_year_id' => $academicYearId,
                'class_id' => $class6Id,
                'attitude_score' => $idx === 0 ? 'Sangat Baik' : 'Baik',
                'homeroom_notes' => 'Menunjukkan perkembangan akademis yang sangat memuaskan, aktif dalam kegiatan pembelajaran serta bersikap sopan dan santun.',
                'status' => 'verified_wali_kelas',
                'verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Seed Grades for each subject
            foreach ($allSubjectRecords as $sbj) {
                $tugas = rand(80, 95);
                $uts = rand(75, 92);
                $uas = rand(80, 96);
                $final = round(($tugas * 0.30) + ($uts * 0.30) + ($uas * 0.40), 2);
                $grade = $final >= 89 ? 'A' : ($final >= 78 ? 'B' : ($final >= 65 ? 'C' : 'D'));

                $desc = "Menunjukkan penguasaan yang sangat baik dalam memahami konsep {$sbj->name}.";

                DB::table('student_grades')->insert([
                    'student_id' => $sId,
                    'teacher_subject_id' => $tsMap[$sbj->id],
                    'academic_year_id' => $academicYearId,
                    'tugas_avg' => $tugas,
                    'uts_score' => $uts,
                    'uas_score' => $uas,
                    'final_score' => $final,
                    'letter_grade' => $grade,
                    'competency_desc' => $desc,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Seed 15 days of historical student attendances for Kelas 6
        $statuses = ['Hadir', 'Hadir', 'Hadir', 'Hadir', 'Izin', 'Hadir', 'Sakit', 'Hadir', 'Hadir', 'Hadir'];
        for ($d = 0; $d < 15; $d++) {
            $date = date('Y-m-d', strtotime("-{$d} days"));
            // Skip weekends
            $dayOfWeek = date('N', strtotime($date));
            if ($dayOfWeek >= 6) continue;

            foreach ($studentIds as $sIdx => $sId) {
                $status = $statuses[($d + $sIdx) % count($statuses)];
                DB::table('student_attendances')->insert([
                    'student_id' => $sId,
                    'class_id' => $class6Id,
                    'academic_year_id' => $academicYearId,
                    'attendance_date' => $date,
                    'status' => $status,
                    'notes' => $status === 'Izin' ? 'Izin acara keluarga' : ($status === 'Sakit' ? 'Sakit demam' : null),
                    'recorded_by' => $guruUserId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Seed teacher attendance
            DB::table('teacher_attendances')->insert([
                'teacher_id' => $teacherGuruId,
                'attendance_date' => $date,
                'status' => 'Hadir',
                'check_in_time' => '07:15:00',
                'notes' => 'Hadir Tepat Waktu',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            DB::table('teacher_attendances')->insert([
                'teacher_id' => $teacherBkId,
                'attendance_date' => $date,
                'status' => 'Hadir',
                'check_in_time' => '07:20:00',
                'notes' => 'Hadir Tepat Waktu',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Seed Attendance Permission Request
        DB::table('attendance_permissions')->insert([
            'user_id' => $siswaUserId,
            'student_id' => $studentIds[0],
            'type' => 'siswa',
            'permission_type' => 'Sakit',
            'start_date' => date('Y-m-d', strtotime('+1 day')),
            'end_date' => date('Y-m-d', strtotime('+2 days')),
            'reason' => 'Mohon izin Bapak/Ibu Wali Kelas, anak kami Siti Nurhaliza sedang sakit demam dan disarankan istirahat oleh dokter.',
            'attachment_path' => null,
            'status' => 'approved',
            'approved_by' => $guruUserId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
