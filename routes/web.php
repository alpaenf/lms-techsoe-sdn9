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

    // 03. Master Data (Typo fixed from Mater Data)
    Route::get('/master-data', [MasterDataController::class, 'index'])->name('master-data.index');
    Route::post('/master-data/classes', [MasterDataController::class, 'storeClass'])->name('master-data.classes.store');
    Route::put('/master-data/classes/{id}', [MasterDataController::class, 'updateClass'])->name('master-data.classes.update');
    Route::delete('/master-data/classes/{id}', [MasterDataController::class, 'destroyClass'])->name('master-data.classes.destroy');

    // 04. E-Learning
    Route::get('/elearning', [ELearningController::class, 'index'])->name('elearning.index');

    // 05. Presensi
    Route::get('/presensi', [PresensiController::class, 'index'])->name('presensi.index');
    Route::post('/presensi', [PresensiController::class, 'store'])->name('presensi.store');

    // 06. E-Rapor
    Route::get('/erapor', [ERaporController::class, 'index'])->name('erapor.index');

    // 07. Manajemen BK
    Route::get('/bk', [BKController::class, 'index'])->name('bk.index');

    // Profil Pengguna
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
