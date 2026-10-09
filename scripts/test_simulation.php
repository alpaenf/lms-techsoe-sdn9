<?php

use App\Models\User;
use App\Models\Teacher;
use App\Models\Subject;
use App\Models\SchoolClass;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\DashboardController;

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "====================================================\n";
echo "  SIMULASI & TESTING SISTEM REVISI CLIENT LMS  \n";
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
// TEST 1: Authentication & Dashboard Load - Guru Mapel (PAI)
// ----------------------------------------------------
echo "--- TEST 1: Guru Mapel (PAI) Login & Dashboard ---\n";
$guruMapelUser = User::where('username', '199208152020121005')->first();
assertTest($guruMapelUser !== null, "Akun Guru Mapel (PAI) '199208152020121005' ditemukan di database");
assertTest($guruMapelUser->role === 'guru_mapel', "Role user sesuai: 'guru_mapel'");

Auth::login($guruMapelUser);
assertTest(Auth::check() && Auth::id() === $guruMapelUser->id, "Sesi login Guru Mapel berhasil dibuat");

$controller = new DashboardController();
$request = Request::create('/dashboard', 'GET');
$request->setUserResolver(fn() => $guruMapelUser);

$response = $controller->index($request);
$middleware = new \App\Http\Middleware\HandleInertiaRequests();
$sharedProps = $middleware->share($request);
$inertiaProps = array_merge($sharedProps, $response->toResponse($request)->original->getData()['page']['props']);

assertTest(isset($inertiaProps['auth']['user']), "Prop 'auth.user' berhasil dirender ke Inertia");
assertTest(($inertiaProps['auth']['user']['role'] ?? '') === 'guru_mapel', "Prop user role pada frontend = 'guru_mapel'");
assertTest(count($inertiaProps['claimed_subjects'] ?? []) > 0, "Guru Mapel memiliki mapel terklaim: " . implode(', ', array_column($inertiaProps['claimed_subjects'] ?? [], 'name')));
assertTest(count($inertiaProps['claimed_classes'] ?? []) > 0, "Guru Mapel memiliki kelas terklaim (Total: " . count($inertiaProps['claimed_classes'] ?? []) . " kelas)");

echo "\n";

// ----------------------------------------------------
// TEST 2: Simulasi Klaim Pelajaran & Kelas yang Diampu
// ----------------------------------------------------
echo "--- TEST 2: Simulasi Klaim Pelajaran & Kelas (POST /teacher/claim-subjects) ---\n";
$paiSubject = Subject::where('code', 'PAI-SD')->first();
$classes = DB::table('classes')->limit(3)->get();

assertTest($paiSubject !== null, "Subject PAI (PAI-SD) tersedia di database");

$claimRequest = Request::create('/teacher/claim-subjects', 'POST', [
    'teacher_type' => 'guru_mapel',
    'subject_specialization' => 'Pendidikan Agama Islam (Revisi Klien)',
    'subject_ids' => [$paiSubject->id],
    'class_ids' => $classes->pluck('id')->toArray(),
]);
$claimRequest->setUserResolver(fn() => $guruMapelUser);

$claimResponse = $controller->claimSubjects($claimRequest);
assertTest($claimResponse->isRedirection(), "Response klaim berupa redirect (HTTP 302 / back)");

// Refresh teacher data
$teacher = Teacher::where('user_id', $guruMapelUser->id)->first();
assertTest($teacher->subject_specialization === 'Pendidikan Agama Islam', "Spesialisasi berhasil diperbarui di database: {$teacher->subject_specialization}");
assertTest(DB::table('teacher_subjects')->where('teacher_id', $teacher->id)->where('subject_id', $paiSubject->id)->exists(), "Mata Pelajaran berhasil terikat dengan Guru di database");

echo "\n";

// ----------------------------------------------------
// TEST 3: Authentication & Dashboard Load - Tenaga Kependidikan (Tendik)
// ----------------------------------------------------
echo "--- TEST 3: Tenaga Kependidikan (Tendik) Login & Dashboard ---\n";
$tendikUser = User::where('username', '199504102022032010')->first();
assertTest($tendikUser !== null, "Akun Tendik '199504102022032010' ditemukan di database");
assertTest($tendikUser->role === 'tendik', "Role user sesuai: 'tendik'");

Auth::login($tendikUser);
$tendikReq = Request::create('/dashboard', 'GET');
$tendikReq->setUserResolver(fn() => $tendikUser);
$tendikResponse = $controller->index($tendikReq);
$tendikProps = array_merge($middleware->share($tendikReq), $tendikResponse->toResponse($tendikReq)->original->getData()['page']['props']);

assertTest(($tendikProps['auth']['user']['role'] ?? '') === 'tendik', "Prop user role Tendik pada frontend = 'tendik'");

echo "\n";

// ----------------------------------------------------
// RINGKASAN HASIL SIMULASI
// ----------------------------------------------------
echo "====================================================\n";
echo "  HASIL AKHIR TESTING & SIMULASI: $passCount PASSED | $failCount FAILED  \n";
echo "====================================================\n";

if ($failCount === 0) {
    echo "🎉 SEMUA PENGUJIAN DAN SIMULASI LULUS 100%! TIDAK ADA ERROR ATAU BUG.\n";
} else {
    echo "⚠️ ADA PENGUJIAN YANG GAGAL.\n";
}
