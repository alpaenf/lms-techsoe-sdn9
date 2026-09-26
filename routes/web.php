<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KelembagaanController;
use App\Http\Controllers\MasterDataController;
use App\Http\Controllers\ELearningController;
use App\Http\Controllers\PresensiController;
use App\Http\Controllers\ERaporController;
use App\Http\Controllers\BKController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    // 01. Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // 02. Kelembagaan
    Route::get('/kelembagaan', [KelembagaanController::class, 'index'])->name('kelembagaan.index');

    // 03. Master Data
    Route::get('/master-data', [MasterDataController::class, 'index'])->name('master-data.index');

    // Master Data: Rombel / Classes
    Route::post('/master-data/classes', [MasterDataController::class, 'storeClass'])->name('master-data.classes.store');
    Route::put('/master-data/classes/{id}', [MasterDataController::class, 'updateClass'])->name('master-data.classes.update');
    Route::delete('/master-data/classes/{id}', [MasterDataController::class, 'destroyClass'])->name('master-data.classes.destroy');

    // Master Data: Siswa / Students
    Route::post('/master-data/students', [MasterDataController::class, 'storeStudent'])->name('master-data.students.store');
    Route::put('/master-data/students/{id}', [MasterDataController::class, 'updateStudent'])->name('master-data.students.update');
    Route::delete('/master-data/students/{id}', [MasterDataController::class, 'destroyStudent'])->name('master-data.students.destroy');

    // Master Data: Tenaga Pendidik / Teachers
    Route::post('/master-data/teachers', [MasterDataController::class, 'storeTeacher'])->name('master-data.teachers.store');
    Route::put('/master-data/teachers/{id}', [MasterDataController::class, 'updateTeacher'])->name('master-data.teachers.update');
    Route::delete('/master-data/teachers/{id}', [MasterDataController::class, 'destroyTeacher'])->name('master-data.teachers.destroy');

    // Master Data: Mata Pelajaran / Subjects
    Route::post('/master-data/subjects', [MasterDataController::class, 'storeSubject'])->name('master-data.subjects.store');
    Route::put('/master-data/subjects/{id}', [MasterDataController::class, 'updateSubject'])->name('master-data.subjects.update');
    Route::delete('/master-data/subjects/{id}', [MasterDataController::class, 'destroySubject'])->name('master-data.subjects.destroy');

    // 04. E-Learning & Penugasan
    Route::get('/elearning', [ELearningController::class, 'index'])->name('elearning.index');

    // E-Learning Materials (Bahan Ajar)
    Route::post('/elearning/materials', [ELearningController::class, 'storeMaterial'])->name('elearning.materials.store');
    Route::put('/elearning/materials/{id}', [ELearningController::class, 'updateMaterial'])->name('elearning.materials.update');
    Route::delete('/elearning/materials/{id}', [ELearningController::class, 'destroyMaterial'])->name('elearning.materials.destroy');

    // E-Learning Assignments (Tugas & Asesmen)
    Route::post('/elearning/assignments', [ELearningController::class, 'storeAssignment'])->name('elearning.assignments.store');
    Route::put('/elearning/assignments/{id}', [ELearningController::class, 'updateAssignment'])->name('elearning.assignments.update');
    Route::delete('/elearning/assignments/{id}', [ELearningController::class, 'destroyAssignment'])->name('elearning.assignments.destroy');

    // E-Learning Submissions & Grading
    Route::post('/elearning/submissions', [ELearningController::class, 'submitAssignment'])->name('elearning.submissions.submit');
    Route::get('/elearning/assignments/{id}/submissions', [ELearningController::class, 'getAssignmentSubmissions'])->name('elearning.assignments.submissions');
    Route::post('/elearning/submissions/{id}/grade', [ELearningController::class, 'gradeSubmission'])->name('elearning.submissions.grade');

    // 05. Presensi
    Route::get('/presensi', [PresensiController::class, 'index'])->name('presensi.index');
    Route::post('/presensi', [PresensiController::class, 'store'])->name('presensi.store');

    // 06. E-Rapor
    Route::get('/erapor', [ERaporController::class, 'index'])->name('erapor.index');
    Route::post('/erapor/grades', [ERaporController::class, 'saveGrades'])->name('erapor.grades.save');
    Route::post('/erapor/evaluation', [ERaporController::class, 'saveEvaluation'])->name('erapor.evaluation.save');
    Route::post('/erapor/verify', [ERaporController::class, 'verifyRapor'])->name('erapor.verify');
    Route::post('/erapor/approve', [ERaporController::class, 'approveRapor'])->name('erapor.approve');

    // 07. Manajemen BK
    Route::get('/bk', [BKController::class, 'index'])->name('bk.index');

    // Profil Pengguna
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
