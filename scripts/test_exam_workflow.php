<?php

use App\Models\User;
use App\Models\Teacher;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Classes;
use App\Models\AcademicYear;
use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Models\StudentExamAttempt;
use App\Models\StudentAnswer;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\StudentExamController;

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "====================================================\n";
echo "  SIMULASI & TESTING REVISI UJIAN ONLINE LMS SDN 9  \n";
echo "====================================================\n\n";

$passCount = 0;
$failCount = 0;

function assertTest($condition, $testName) {
    global $passCount, $failCount;
    if ($condition) {
        echo "[SUCCESS ✅] " . $testName . "\n";
        $passCount++;
    } else {
        echo "[FAILED ❌] " . $testName . "\n";
        $failCount++;
    }
}

// ----------------------------------------------------
// TEST 1: Konfigurasi Timezone Aplikasi (Asia/Makassar / WITA)
// ----------------------------------------------------
echo "--- TEST 1: Verifikasi Timezone (Asia/Makassar / WITA) ---\n";
assertTest(config('app.timezone') === 'Asia/Makassar', "Timezone app.timezone = 'Asia/Makassar'");
assertTest(date_default_timezone_get() === 'Asia/Makassar', "PHP date_default_timezone_get = 'Asia/Makassar'");
echo "Current Time: " . now()->format('Y-m-d H:i:s T') . "\n\n";

// ----------------------------------------------------
// TEST 2: Buat Asesmen dengan Jam 08.33 (Preservasi Waktu)
// ----------------------------------------------------
echo "--- TEST 2: Pembuatan Asesmen dengan Jam 08.33 ---\n";
$teacherUser = User::where('role', 'guru')->first() ?? User::first();
$teacher = Teacher::where('user_id', $teacherUser->id)->first() ?? Teacher::first();
$subject = Subject::first();
$class = Classes::first();

Auth::login($teacherUser);

$controller = new ExamController();
$storeRequest = Request::create('/exams', 'POST', [
    'title' => 'Asesmen Harian Simulasi Jam 08.33',
    'description' => 'Pengujian input jam 08.33 agar tidak bergeser ke 16.33',
    'subject_id' => $subject->id,
    'class_id' => $class->id,
    'exam_category' => 'ulangan_harian',
    'duration_minutes' => 60,
    'start_time' => '2026-10-10T08:33',
    'end_time' => '2026-10-10T09:33',
    'max_attempts' => 1,
    'passing_score' => 75.00,
    'randomize_questions' => true,
    'show_review' => true,
    'show_result_immediately' => true,
]);
$storeRequest->setUserResolver(fn() => $teacherUser);

$response = $controller->store($storeRequest);
assertTest($response->isRedirection(), "Pembuatan ujian berhasil (HTTP Redirect)");

$createdExam = Exam::where('title', 'Asesmen Harian Simulasi Jam 08.33')->first();
assertTest($createdExam !== null, "Ujian baru berhasil tersimpan di database");
echo "Raw DB start_time: '" . $createdExam->getRawOriginal('start_time') . "'\n";
echo "Raw DB end_time:   '" . $createdExam->getRawOriginal('end_time') . "'\n";
assertTest(str_contains($createdExam->getRawOriginal('start_time'), '08:33'), "Nilai start_time di database tersimpan jam 08:33");

// ----------------------------------------------------
// TEST 3: Serialisasi JSON ke Frontend Edit Page (Tidak Berubah ke 16.33)
// ----------------------------------------------------
echo "\n--- TEST 3: Serialisasi ke Frontend (Form Edit / Props) ---\n";
$serialized = $createdExam->toArray();
assertTest($serialized['start_time'] === '2026-10-10T08:33', "Serialisasi start_time ke frontend = '2026-10-10T08:33'");
assertTest($serialized['end_time'] === '2026-10-10T09:33', "Serialisasi end_time ke frontend = '2026-10-10T09:33'");
assertTest($serialized['start_time'] !== '2026-10-10T16:33', "Nilai start_time TIDAK bergeser ke 16.33 (Bug Fixed!)");

// ----------------------------------------------------
// TEST 4: Update Pengaturan Ujian
// ----------------------------------------------------
echo "\n--- TEST 4: Update Pengaturan Ujian ---\n";
$updateRequest = Request::create("/exams/{$createdExam->id}", 'PUT', [
    'title' => 'Asesmen Harian Matematika (Diperbarui)',
    'description' => 'Deskripsi diperbarui',
    'subject_id' => $subject->id,
    'class_id' => $class->id,
    'exam_category' => 'ulangan_harian',
    'duration_minutes' => 90,
    'start_time' => '2026-10-10T08:33',
    'end_time' => '2026-10-10T10:03',
    'max_attempts' => 2,
    'passing_score' => 80.00,
    'randomize_questions' => false,
    'show_review' => true,
    'show_result_immediately' => true,
]);
$updateRequest->setUserResolver(fn() => $teacherUser);

$updateResponse = $controller->update($updateRequest, $createdExam);
assertTest($updateResponse->isRedirection(), "Update ujian berhasil (HTTP Redirect)");

$createdExam->refresh();
assertTest($createdExam->title === 'Asesmen Harian Matematika (Diperbarui)', "Judul berhasil diperbarui");
assertTest(str_contains($createdExam->getRawOriginal('start_time'), '08:33'), "start_time tetap 08:33 setelah update");
assertTest($createdExam->toArray()['start_time'] === '2026-10-10T08:33', "toArray start_time tetap '2026-10-10T08:33'");

// ----------------------------------------------------
// TEST 5: Tambah Butir Soal & Terbitkan Ujian
// ----------------------------------------------------
echo "\n--- TEST 5: Kelola Butir Soal & Terbitkan Ujian ---\n";
$addQRequest = Request::create("/exams/{$createdExam->id}/questions", 'POST', [
    'question_type' => 'multiple_choice',
    'question_text' => 'Berapa hasil dari 25 x 4?',
    'options' => ['A' => '50', 'B' => '75', 'C' => '100', 'D' => '125'],
    'correct_answer' => 'C',
    'points' => 50,
]);
$addQRequest->setUserResolver(fn() => $teacherUser);
$controller->addQuestion($addQRequest, $createdExam);

$addQ2Request = Request::create("/exams/{$createdExam->id}/questions", 'POST', [
    'question_type' => 'short_answer',
    'question_text' => 'Berapa 100 dibagi 4?',
    'correct_answer' => '25',
    'points' => 50,
]);
$addQ2Request->setUserResolver(fn() => $teacherUser);
$controller->addQuestion($addQ2Request, $createdExam);

assertTest($createdExam->questions()->count() === 2, "2 butir soal berhasil ditambahkan ke ujian");
assertTest($createdExam->totalPoints() === 100, "Total poin akumulasi soal = 100 poin");

// Publish exam
$publishResponse = $controller->publish($createdExam);
$createdExam->refresh();
assertTest($createdExam->status === 'published', "Ujian berhasil diterbitkan (status = 'published')");

// ----------------------------------------------------
// TEST 6: Alur Siswa (Student Exam - Ambil, Simpan Jawaban, Submit)
// ----------------------------------------------------
$student = Student::with('user')->first();
if ($student) {
    $studentUser = $student->user;
} else {
    $studentUser = User::create([
        'name' => 'Siswa Test',
        'username' => 'siswa_test_' . time(),
        'password' => bcrypt('password'),
        'role' => 'siswa',
    ]);
    $student = Student::create([
        'user_id' => $studentUser->id,
        'nis' => '99999',
        'nisn' => '9999999999',
        'full_name' => 'Siswa Test Online',
        'gender' => 'L',
        'birth_place' => 'Tana Toraja',
        'birth_date' => '2014-01-01',
        'entry_date' => '2026-07-15',
        'religion' => 'Kristen',
        'class_id' => $createdExam->class_id,
    ]);
}
$student->update(['class_id' => $createdExam->class_id]);

// Adjust start/end time to active window so student can start
$createdExam->update([
    'start_time' => now()->subMinutes(5)->format('Y-m-d\TH:i'),
    'end_time' => now()->addMinutes(55)->format('Y-m-d\TH:i'),
]);
$createdExam->refresh();

assertTest($createdExam->isAvailable(), "Ujian aktif dan tersedia sesuai jadwal");

Auth::login($studentUser);
$studentController = new StudentExamController();

$startRequest = Request::create("/student/exams/{$createdExam->id}/start", 'POST');
$startRequest->setUserResolver(fn() => $studentUser);
$startResponse = $studentController->start($createdExam);

$attempt = StudentExamAttempt::where('exam_id', $createdExam->id)->where('student_id', $student->id)->first();
assertTest($attempt !== null && $attempt->status === 'in_progress', "Sesi pengerjaan siswa dimulai (status = 'in_progress')");
assertTest($attempt->getRemainingSeconds() > 0, "Sisa durasi pengerjaan aktif (> 0 detik)");

// Student answers Q1 (Multiple choice C)
$q1 = $createdExam->questions()->where('question_type', 'multiple_choice')->first();
$saveQ1 = Request::create("/student/exams/attempts/{$attempt->id}/save", 'POST', [
    'question_id' => $q1->id,
    'answer_text' => 'C',
]);
$saveQ1->setUserResolver(fn() => $studentUser);
$saveQ1Response = $studentController->saveAnswer($saveQ1, $attempt);
assertTest($saveQ1Response->getStatusCode() === 200, "Jawaban soal 1 berhasil disimpan otomatis");

// Student answers Q2 (Short answer 25)
$q2 = $createdExam->questions()->where('question_type', 'short_answer')->first();
$saveQ2 = Request::create("/student/exams/attempts/{$attempt->id}/save", 'POST', [
    'question_id' => $q2->id,
    'answer_text' => '25',
]);
$saveQ2->setUserResolver(fn() => $studentUser);
$saveQ2Response = $studentController->saveAnswer($saveQ2, $attempt);
assertTest($saveQ2Response->getStatusCode() === 200, "Jawaban soal 2 berhasil disimpan otomatis");

// Student submits exam
$submitResponse = $studentController->submit($attempt);
$attempt->refresh();

assertTest($attempt->status === 'graded', "Ujian berhasil dikumpulkan dan dinilai (status = 'graded')");
assertTest((float) $attempt->percentage === 100.0, "Nilai akhir siswa = 100%");
assertTest($attempt->isPassed(), "Siswa dinyatakan Lulus (Passing Score)");

// Clean up test exam
$createdExam->delete();

// ----------------------------------------------------
// RINGKASAN HASIL SIMULASI
// ----------------------------------------------------
echo "\n====================================================\n";
echo "  HASIL AKHIR TESTING: $passCount PASSED | $failCount FAILED  \n";
echo "====================================================\n";

if ($failCount === 0) {
    echo "🎉 SEMUA PENGUJIAN DAN SIMULASI UJIAN ONLINE LULUS 100%!\n";
    echo "✨ Masalah jam 08.33 berubah jadi 16.33 telah tuntas diperbaiki.\n";
} else {
    echo "⚠️ ADA PENGUJIAN YANG GAGAL.\n";
}
