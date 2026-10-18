<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ELearningController;
use App\Http\Controllers\PenilaianController;
use App\Http\Controllers\PresensiController;
use App\Http\Controllers\StudentExamController;
use App\Models\AcademicYear;
use App\Models\Classes;
use App\Models\Exam;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\User;
use App\Services\ReligionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

$passCount = 0;
$failCount = 0;

function assertTest($cond, $msg) {
    global $passCount, $failCount;
    if ($cond) {
        echo "[PASS ✅] $msg\n";
        $passCount++;
    } else {
        echo "[FAIL ❌] $msg\n";
        $failCount++;
    }
}

echo "=========================================================\n";
echo "  TESTING FITUR PEMISAHAN AGAMA (LMS UPT SDN 9) \n";
echo "=========================================================\n\n";

DB::beginTransaction();

try {
    // 1. Setup Academic Year & Class
    $academicYear = AcademicYear::firstOrCreate(
        ['is_active' => true],
        ['year' => '2026/2027', 'semester' => 'ganjil', 'name' => '2026/2027']
    );

    $testClass = Classes::create([
        'name' => 'Kelas Uji Coba Agama',
        'grade_level' => 4,
        'academic_year_id' => $academicYear->id,
    ]);

    // 2. Setup Subjects
    $paiSubject = Subject::where('code', 'PAI-SD')->first();
    if (! $paiSubject) {
        $paiSubject = Subject::create([
            'code' => 'PAI-SD',
            'name' => 'Pendidikan Agama Islam',
            'category' => 'wajib',
            'kkm' => 75.00,
        ]);
    }

    $pakSubject = Subject::where('code', 'PAK-SD')->first();
    if (! $pakSubject) {
        $pakSubject = Subject::create([
            'code' => 'PAK-SD',
            'name' => 'Pendidikan Agama Kristen',
            'category' => 'wajib',
            'kkm' => 75.00,
        ]);
    }

    $matSubject = Subject::where('code', 'MAT-SD')->first();
    if (! $matSubject) {
        $matSubject = Subject::create([
            'code' => 'MAT-SD',
            'name' => 'Matematika',
            'category' => 'wajib',
            'kkm' => 70.00,
        ]);
    }

    // 3. Setup Students (1 Islam, 1 Kristen, 1 Katolik)
    $islamUser = User::create([
        'name' => 'Siswa Islam',
        'username' => 'siswa_islam_test_' . time(),
        'email' => 'siswa_islam_' . time() . '@test.com',
        'password' => Hash::make('password123'),
        'role' => 'siswa',
        'is_active' => true,
    ]);
    $islamStudent = Student::create([
        'user_id' => $islamUser->id,
        'nis' => 'ISL' . rand(100, 999),
        'nisn' => '009' . rand(1000000, 9999999),
        'full_name' => 'Ahmad Fauzi (Islam)',
        'class_id' => $testClass->id,
        'gender' => 'L',
        'religion' => 'Islam',
        'birth_place' => 'Makassar',
        'birth_date' => '2014-01-01',
        'entry_date' => '2020-07-13',
        'status' => 'aktif',
    ]);

    $kristenUser = User::create([
        'name' => 'Siswa Kristen',
        'username' => 'siswa_kristen_test_' . time(),
        'email' => 'siswa_kristen_' . time() . '@test.com',
        'password' => Hash::make('password123'),
        'role' => 'siswa',
        'is_active' => true,
    ]);
    $kristenStudent = Student::create([
        'user_id' => $kristenUser->id,
        'nis' => 'KRS' . rand(100, 999),
        'nisn' => '008' . rand(1000000, 9999999),
        'full_name' => 'Markus Tandi (Kristen)',
        'class_id' => $testClass->id,
        'gender' => 'L',
        'religion' => 'Kristen',
        'birth_place' => 'Toraja',
        'birth_date' => '2014-02-02',
        'entry_date' => '2020-07-13',
        'status' => 'aktif',
    ]);

    // 4. Setup Teachers (Guru Agama Islam & Guru Agama Kristen & Guru Kelas)
    $guruPaiUser = User::create([
        'name' => 'Ustadz PAI',
        'username' => 'guru_pai_test_' . time(),
        'email' => 'guru_pai_' . time() . '@test.com',
        'password' => Hash::make('password123'),
        'role' => 'guru_mapel',
        'is_active' => true,
    ]);
    $guruPaiTeacher = Teacher::create([
        'user_id' => $guruPaiUser->id,
        'nip' => '199001' . rand(100000, 999999),
        'full_name' => 'Drs. Haji PAI, M.Pd.I.',
        'gender' => 'L',
        'teacher_type' => 'guru_mapel',
        'subject_specialization' => 'Pendidikan Agama Islam',
    ]);

    $guruPakUser = User::create([
        'name' => 'Ibu PAK',
        'username' => 'guru_pak_test_' . time(),
        'email' => 'guru_pak_' . time() . '@test.com',
        'password' => Hash::make('password123'),
        'role' => 'guru_mapel',
        'is_active' => true,
    ]);
    $guruPakTeacher = Teacher::create([
        'user_id' => $guruPakUser->id,
        'nip' => '198502' . rand(100000, 999999),
        'full_name' => 'Debora, S.Th.',
        'gender' => 'P',
        'teacher_type' => 'guru_mapel',
        'subject_specialization' => 'Pendidikan Agama Kristen',
    ]);

    $guruKelasUser = User::create([
        'name' => 'Guru Kelas 4',
        'username' => 'guru_kelas_test_' . time(),
        'email' => 'guru_kelas_' . time() . '@test.com',
        'password' => Hash::make('password123'),
        'role' => 'guru',
        'is_active' => true,
    ]);
    $guruKelasTeacher = Teacher::create([
        'user_id' => $guruKelasUser->id,
        'nip' => '198803' . rand(100000, 999999),
        'full_name' => 'Guru Kelas 4, S.Pd.',
        'gender' => 'P',
        'teacher_type' => 'guru_kelas',
        'subject_specialization' => 'Wali Kelas',
    ]);
    $testClass->homeroom_teacher_id = $guruKelasTeacher->id;
    $testClass->save();

    // Map teacher_subjects
    $tsPaiId = DB::table('teacher_subjects')->insertGetId([
        'teacher_id' => $guruPaiTeacher->id,
        'subject_id' => $paiSubject->id,
        'class_id' => $testClass->id,
        'academic_year_id' => $academicYear->id,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $tsPakId = DB::table('teacher_subjects')->insertGetId([
        'teacher_id' => $guruPakTeacher->id,
        'subject_id' => $pakSubject->id,
        'class_id' => $testClass->id,
        'academic_year_id' => $academicYear->id,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $tsMatId = DB::table('teacher_subjects')->insertGetId([
        'teacher_id' => $guruKelasTeacher->id,
        'subject_id' => $matSubject->id,
        'class_id' => $testClass->id,
        'academic_year_id' => $academicYear->id,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    // Create Topics & Assignments
    $topicPai = DB::table('topics')->insertGetId([
        'teacher_subject_id' => $tsPaiId,
        'title' => 'Bab 1: Rukun Iman',
        'order' => 1,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $asgPaiId = DB::table('assignments')->insertGetId([
        'topic_id' => $topicPai,
        'title' => 'Tugas Hafalan Surat Pendek PAI',
        'instructions' => 'Hafalkan surat Al-Fatihah dan An-Nas',
        'due_date' => now()->addDays(3),
        'max_score' => 100,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $topicPak = DB::table('topics')->insertGetId([
        'teacher_subject_id' => $tsPakId,
        'title' => 'Bab 1: Kasih Allah',
        'order' => 1,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $asgPakId = DB::table('assignments')->insertGetId([
        'topic_id' => $topicPak,
        'title' => 'Tugas Rangkuman Alkitab PAK',
        'instructions' => 'Rangkum cerita Daud dan Goliat',
        'due_date' => now()->addDays(3),
        'max_score' => 100,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $topicMat = DB::table('topics')->insertGetId([
        'teacher_subject_id' => $tsMatId,
        'title' => 'Bab 1: Pecahan',
        'order' => 1,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $asgMatId = DB::table('assignments')->insertGetId([
        'topic_id' => $topicMat,
        'title' => 'Latihan Pecahan Matematika',
        'instructions' => 'Kerjakan hal 20',
        'due_date' => now()->addDays(3),
        'max_score' => 100,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    // ----------------------------------------------------
    // TEST 1: E-Learning - Tugas Siswa Islam vs Siswa Kristen
    // ----------------------------------------------------
    echo "\n--- TEST 1: E-Learning Assignment Filtering by Religion ---\n";
    $eLearningCtrl = new ELearningController();

    // Student Islam logs in
    Auth::login($islamUser);
    $req = Request::create('/elearning', 'GET');
    $req->setUserResolver(fn() => $islamUser);
    $respIslam = $eLearningCtrl->index($req);
    $propsIslam = $respIslam->toResponse($req)->original->getData()['page']['props'];

    $asgTitlesIslam = array_column(json_decode(json_encode($propsIslam['assignments']), true), 'title');
    assertTest(in_array('Tugas Hafalan Surat Pendek PAI', $asgTitlesIslam), "Siswa Islam DAPAT melihat 'Tugas Hafalan Surat Pendek PAI'");
    assertTest(in_array('Latihan Pecahan Matematika', $asgTitlesIslam), "Siswa Islam DAPAT melihat tugas umum 'Latihan Pecahan Matematika'");
    assertTest(! in_array('Tugas Rangkuman Alkitab PAK', $asgTitlesIslam), "Siswa Islam TIDAK BISA melihat 'Tugas Rangkuman Alkitab PAK'");

    // Student Kristen logs in
    Auth::login($kristenUser);
    $reqK = Request::create('/elearning', 'GET');
    $reqK->setUserResolver(fn() => $kristenUser);
    $respKristen = $eLearningCtrl->index($reqK);
    $propsKristen = $respKristen->toResponse($reqK)->original->getData()['page']['props'];

    $asgTitlesKristen = array_column(json_decode(json_encode($propsKristen['assignments']), true), 'title');
    assertTest(in_array('Tugas Rangkuman Alkitab PAK', $asgTitlesKristen), "Siswa Kristen DAPAT melihat 'Tugas Rangkuman Alkitab PAK'");
    assertTest(in_array('Latihan Pecahan Matematika', $asgTitlesKristen), "Siswa Kristen DAPAT melihat tugas umum 'Latihan Pecahan Matematika'");
    assertTest(! in_array('Tugas Hafalan Surat Pendek PAI', $asgTitlesKristen), "Siswa Kristen TIDAK BISA melihat 'Tugas Hafalan Surat Pendek PAI'");

    // Total student count in assignment map
    $paiAsg = collect($propsIslam['assignments'])->firstWhere('title', 'Tugas Hafalan Surat Pendek PAI');
    assertTest($paiAsg['total_students'] === 1, "Total siswa pada tugas PAI hanya menghitung siswa beragama Islam (1 siswa)");

    // ----------------------------------------------------
    // TEST 2: Guru Assignment Submissions Modal
    // ----------------------------------------------------
    echo "\n--- TEST 2: Guru Submissions List Filtered by Religion ---\n";
    $subRespPai = $eLearningCtrl->getAssignmentSubmissions($asgPaiId);
    $subDataPai = json_decode($subRespPai->getContent(), true);
    $studentsInPai = array_column($subDataPai['students'], 'full_name');

    assertTest(count($studentsInPai) === 1, "Tinjau tugas PAI hanya menampilkan 1 siswa");
    assertTest(in_array('Ahmad Fauzi (Islam)', $studentsInPai), "Siswa Islam ada di daftar tugas PAI");
    assertTest(! in_array('Markus Tandi (Kristen)', $studentsInPai), "Siswa Kristen TIDAK ADA di daftar tugas PAI");

    $subRespPak = $eLearningCtrl->getAssignmentSubmissions($asgPakId);
    $subDataPak = json_decode($subRespPak->getContent(), true);
    $studentsInPak = array_column($subDataPak['students'], 'full_name');

    assertTest(count($studentsInPak) === 1, "Tinjau tugas PAK hanya menampilkan 1 siswa");
    assertTest(in_array('Markus Tandi (Kristen)', $studentsInPak), "Siswa Kristen ada di daftar tugas PAK");
    assertTest(! in_array('Ahmad Fauzi (Islam)', $studentsInPak), "Siswa Islam TIDAK ADA di daftar tugas PAK");

    // ----------------------------------------------------
    // TEST 3: Penilaian (Buku Nilai) Filtered by Religion
    // ----------------------------------------------------
    echo "\n--- TEST 3: Penilaian (Buku Nilai) Filtered by Religion ---\n";
    $penilaianCtrl = new PenilaianController();

    // Guru PAI logs in and opens Penilaian for Kelas Uji Coba
    Auth::login($guruPaiUser);
    $reqPenPai = Request::create('/penilaian', 'GET', [
        'class_id' => $testClass->id,
        'subject_id' => $paiSubject->id,
    ]);
    $reqPenPai->setUserResolver(fn() => $guruPaiUser);
    $propsPenPai = $penilaianCtrl->getGradebookProps($reqPenPai);

    $studentNamesPenPai = array_column($propsPenPai['students']->toArray(), 'full_name');
    assertTest(count($studentNamesPenPai) === 1, "Menu Penilaian Guru PAI hanya menampilkan 1 siswa");
    assertTest(in_array('Ahmad Fauzi (Islam)', $studentNamesPenPai), "Siswa Islam muncul di Penilaian PAI");
    assertTest(! in_array('Markus Tandi (Kristen)', $studentNamesPenPai), "Siswa Kristen TIDAK MUNCUL di Penilaian PAI");

    // Guru PAK logs in and opens Penilaian for Kelas Uji Coba
    Auth::login($guruPakUser);
    $reqPenPak = Request::create('/penilaian', 'GET', [
        'class_id' => $testClass->id,
        'subject_id' => $pakSubject->id,
    ]);
    $reqPenPak->setUserResolver(fn() => $guruPakUser);
    $propsPenPak = $penilaianCtrl->getGradebookProps($reqPenPak);

    $studentNamesPenPak = array_column($propsPenPak['students']->toArray(), 'full_name');
    assertTest(count($studentNamesPenPak) === 1, "Menu Penilaian Guru PAK hanya menampilkan 1 siswa");
    assertTest(in_array('Markus Tandi (Kristen)', $studentNamesPenPak), "Siswa Kristen muncul di Penilaian PAK");
    assertTest(! in_array('Ahmad Fauzi (Islam)', $studentNamesPenPak), "Siswa Islam TIDAK MUNCUL di Penilaian PAK");

    // Guru Kelas opens Matematika -> all students appear
    Auth::login($guruKelasUser);
    $reqPenMat = Request::create('/penilaian', 'GET', [
        'class_id' => $testClass->id,
        'subject_id' => $matSubject->id,
    ]);
    $reqPenMat->setUserResolver(fn() => $guruKelasUser);
    $propsPenMat = $penilaianCtrl->getGradebookProps($reqPenMat);
    $studentNamesPenMat = array_column($propsPenMat['students']->toArray(), 'full_name');
    assertTest(count($studentNamesPenMat) >= 2, "Menu Penilaian Mapel Umum (Matematika) menampilkan SEMUA siswa (Islam & Kristen)");

    // ----------------------------------------------------
    // TEST 4: Absensi (Presensi) Filtered by Religion Teacher
    // ----------------------------------------------------
    echo "\n--- TEST 4: Absensi (Presensi) Guru Agama ---\n";
    $presensiCtrl = new PresensiController();

    // Guru PAI opens Presensi
    Auth::login($guruPaiUser);
    $reqPresPai = Request::create('/presensi', 'GET', [
        'class_id' => $testClass->id,
        'type' => 'siswa',
    ]);
    $reqPresPai->setUserResolver(fn() => $guruPaiUser);
    $respPresPai = $presensiCtrl->index($reqPresPai);
    $propsPresPai = $respPresPai->toResponse($reqPresPai)->original->getData()['page']['props'];

    $studentNamesPresPai = array_column(json_decode(json_encode($propsPresPai['students']), true), 'full_name');
    assertTest($propsPresPai['teacherReligion'] === 'Islam', "Presensi mendeteksi spesialisasi guru: 'Islam'");
    assertTest(count($studentNamesPresPai) === 1, "Menu Presensi Guru PAI hanya menampilkan 1 siswa");
    assertTest(in_array('Ahmad Fauzi (Islam)', $studentNamesPresPai), "Siswa Islam ada di Presensi Guru PAI");
    assertTest(! in_array('Markus Tandi (Kristen)', $studentNamesPresPai), "Siswa Kristen TIDAK MUNCUL di Presensi Guru PAI");

    // Guru PAK opens Presensi
    Auth::login($guruPakUser);
    $reqPresPak = Request::create('/presensi', 'GET', [
        'class_id' => $testClass->id,
        'type' => 'siswa',
    ]);
    $reqPresPak->setUserResolver(fn() => $guruPakUser);
    $respPresPak = $presensiCtrl->index($reqPresPak);
    $propsPresPak = $respPresPak->toResponse($reqPresPak)->original->getData()['page']['props'];

    $studentNamesPresPak = array_column(json_decode(json_encode($propsPresPak['students']), true), 'full_name');
    assertTest($propsPresPak['teacherReligion'] === 'Kristen', "Presensi mendeteksi spesialisasi guru: 'Kristen'");
    assertTest(count($studentNamesPresPak) === 1, "Menu Presensi Guru PAK hanya menampilkan 1 siswa");
    assertTest(in_array('Markus Tandi (Kristen)', $studentNamesPresPak), "Siswa Kristen ada di Presensi Guru PAK");
    assertTest(! in_array('Ahmad Fauzi (Islam)', $studentNamesPresPak), "Siswa Islam TIDAK MUNCUL di Presensi Guru PAK");

    // Guru Kelas opens Presensi -> all students appear
    Auth::login($guruKelasUser);
    $reqPresKelas = Request::create('/presensi', 'GET', [
        'class_id' => $testClass->id,
        'type' => 'siswa',
    ]);
    $reqPresKelas->setUserResolver(fn() => $guruKelasUser);
    $respPresKelas = $presensiCtrl->index($reqPresKelas);
    $propsPresKelas = $respPresKelas->toResponse($reqPresKelas)->original->getData()['page']['props'];

    $studentNamesPresKelas = array_column(json_decode(json_encode($propsPresKelas['students']), true), 'full_name');
    assertTest($propsPresKelas['teacherReligion'] === null, "Guru Kelas bukan guru agama khusus (teacherReligion = null)");
    assertTest(count($studentNamesPresKelas) >= 2, "Guru Kelas melihat SEMUA siswa pada presensi harian");

    // ----------------------------------------------------
    // TEST 5: Student Dashboard Assignment & Metrics
    // ----------------------------------------------------
    echo "\n--- TEST 5: Student Dashboard Assignment Filtered by Religion ---\n";
    $dashCtrl = new DashboardController();

    Auth::login($kristenUser);
    $reqDashK = Request::create('/dashboard', 'GET');
    $reqDashK->setUserResolver(fn() => $kristenUser);
    $respDashK = $dashCtrl->index($reqDashK);
    $propsDashK = $respDashK->toResponse($reqDashK)->original->getData()['page']['props'];

    $dashAsgTitlesK = array_column(json_decode(json_encode($propsDashK['assignments']), true), 'title');
    assertTest(in_array('Tugas Rangkuman Alkitab PAK', $dashAsgTitlesK), "Dashboard Siswa Kristen menampilkan tugas PAK");
    assertTest(! in_array('Tugas Hafalan Surat Pendek PAI', $dashAsgTitlesK), "Dashboard Siswa Kristen TIDAK menampilkan tugas PAI");

} finally {
    DB::rollBack();
}

echo "\n=========================================================\n";
echo "  HASIL AKHIR: $passCount LULUS, $failCount GAGAL\n";
echo "=========================================================\n";
