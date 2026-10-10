<?php

use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\BKController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ELearningController;
use App\Http\Controllers\ERaporController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\KelembagaanController;
use App\Http\Controllers\MasterDataController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PresensiController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StudentExamController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $announcements = DB::table('announcements')
        ->leftJoin('users', 'announcements.created_by', '=', 'users.id')
        ->select(
            'announcements.*',
            'users.name as author_name'
        )
        ->whereNotNull('announcements.published_at')
        ->orderBy('announcements.published_at', 'desc')
        ->take(6)
        ->get();

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'announcements' => $announcements,
        'auth' => [
            'user' => auth()->user(),
        ],
    ]);
});

Route::get('/tenaga-pendidik', function () {
    $teachers = DB::table('teachers')
        ->leftJoin('users', 'teachers.user_id', '=', 'users.id')
        ->leftJoin('classes', 'classes.homeroom_teacher_id', '=', 'teachers.id')
        ->select(
            'teachers.*',
            'users.email',
            'users.role',
            'classes.name as homeroom_class'
        )
        ->orderBy('teachers.full_name')
        ->get()
        ->map(function ($teacher) {
            $claimedSubjects = DB::table('teacher_subjects')
                ->join('subjects', 'teacher_subjects.subject_id', '=', 'subjects.id')
                ->where('teacher_subjects.teacher_id', $teacher->id)
                ->pluck('subjects.name')
                ->unique()
                ->values()
                ->toArray();

            $claimedClasses = DB::table('teacher_subjects')
                ->join('classes', 'teacher_subjects.class_id', '=', 'classes.id')
                ->where('teacher_subjects.teacher_id', $teacher->id)
                ->pluck('classes.name')
                ->unique()
                ->values()
                ->toArray();

            if (!empty($teacher->subject_specialization)) {
                $teacher->assigned_subjects = $teacher->subject_specialization;
            } elseif (!empty($claimedSubjects)) {
                $teacher->assigned_subjects = implode(', ', $claimedSubjects);
            } else {
                $teacher->assigned_subjects = null;
            }

            if (!empty($claimedClasses)) {
                $teacher->assigned_classes = implode(', ', $claimedClasses);
            } else {
                $teacher->assigned_classes = $teacher->homeroom_class;
            }

            return $teacher;
        });

    return Inertia::render('TenagaPendidik', [
        'teachers' => $teachers,
        'auth' => [
            'user' => auth()->user(),
        ],
    ]);
})->name('tenaga-pendidik.index');

Route::get('/clear-cache', function () {
    Artisan::call('optimize:clear');

    return '<h1>Cache Laravel & View Berhasil Dibersihkan!</h1><p><a href="/login">Kembali ke Halaman Login</a></p>';
});

Route::middleware(['auth', 'verified'])->group(function () {
    // 01. Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/teacher/claim-subjects', [DashboardController::class, 'claimSubjects'])->name('teacher.claim-subjects');

    // 02. Kelembagaan
    Route::get('/kelembagaan', [KelembagaanController::class, 'index'])->name('kelembagaan.index');
    Route::post('/kelembagaan/profile', [KelembagaanController::class, 'updateProfile'])->name('kelembagaan.profile.update');
    Route::post('/kelembagaan/academic-years', [KelembagaanController::class, 'storeAcademicYear'])->name('kelembagaan.academic-years.store');
    Route::post('/kelembagaan/academic-years/{id}/activate', [KelembagaanController::class, 'activateAcademicYear'])->name('kelembagaan.academic-years.activate');
    Route::delete('/kelembagaan/academic-years/{id}', [KelembagaanController::class, 'destroyAcademicYear'])->name('kelembagaan.academic-years.destroy');

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
    Route::post('/presensi/permissions', [PresensiController::class, 'storePermission'])->name('presensi.permissions.store');
    Route::post('/presensi/permissions/{id}/status', [PresensiController::class, 'updatePermissionStatus'])->name('presensi.permissions.update-status');

    // 06. E-Rapor
    Route::get('/erapor', [ERaporController::class, 'index'])->name('erapor.index');
    Route::post('/erapor/grades', [ERaporController::class, 'saveGrades'])->name('erapor.grades.save');
    Route::post('/erapor/evaluation', [ERaporController::class, 'saveEvaluation'])->name('erapor.evaluation.save');
    Route::post('/erapor/verify', [ERaporController::class, 'verifyRapor'])->name('erapor.verify');
    Route::post('/erapor/approve', [ERaporController::class, 'approveRapor'])->name('erapor.approve');

    // 07. Manajemen BK
    Route::get('/bk', [BKController::class, 'index'])->name('bk.index');
    Route::post('/bk/sessions', [BKController::class, 'storeSession'])->name('bk.sessions.store');
    Route::delete('/bk/sessions/{id}', [BKController::class, 'destroySession'])->name('bk.sessions.destroy');
    Route::post('/bk/violations', [BKController::class, 'storeViolation'])->name('bk.violations.store');
    Route::delete('/bk/violations/{id}', [BKController::class, 'destroyViolation'])->name('bk.violations.destroy');
    Route::post('/bk/achievements', [BKController::class, 'storeAchievement'])->name('bk.achievements.store');
    Route::delete('/bk/achievements/{id}', [BKController::class, 'destroyAchievement'])->name('bk.achievements.destroy');

    // 08. Ujian Online - Guru & Pimpinan (Supervisi) Routes
    Route::prefix('exams')->middleware(['role:guru,guru_mapel,admin,pimpinan'])->group(function () {
        Route::get('/', [ExamController::class, 'index'])->name('exams.index');
        Route::get('/create', [ExamController::class, 'create'])->name('exams.create');
        Route::post('/', [ExamController::class, 'store'])->name('exams.store');
        Route::get('/{exam}', [ExamController::class, 'show'])->name('exams.show');
        Route::get('/{exam}/edit', [ExamController::class, 'edit'])->name('exams.edit');
        Route::put('/{exam}', [ExamController::class, 'update'])->name('exams.update');
        Route::delete('/{exam}', [ExamController::class, 'destroy'])->name('exams.destroy');

        // Questions management
        Route::post('/{exam}/questions', [ExamController::class, 'addQuestion'])->name('exams.questions.add');
        Route::put('/questions/{question}', [ExamController::class, 'updateQuestion'])->name('exams.questions.update');
        Route::delete('/questions/{question}', [ExamController::class, 'deleteQuestion'])->name('exams.questions.delete');
        Route::post('/questions/{question}/upload-image', [ExamController::class, 'uploadQuestionImage'])->name('exams.questions.image');

        // Monitoring & Grading
        Route::get('/{exam}/monitor', [ExamController::class, 'monitor'])->name('exams.monitor');
        Route::get('/{exam}/results', [ExamController::class, 'results'])->name('exams.results');
        Route::get('/{exam}/export', [ExamController::class, 'exportResults'])->name('exams.export');
        Route::post('/answers/{answer}/grade', [ExamController::class, 'gradeEssay'])->name('exams.grade');

        // Publish/Close
        Route::post('/{exam}/publish', [ExamController::class, 'publish'])->name('exams.publish');
        Route::post('/{exam}/close', [ExamController::class, 'close'])->name('exams.close');
    });

    // 09. Ujian Online - Student Routes
    Route::prefix('student/exams')->middleware(['role:siswa'])->group(function () {
        Route::get('/', [StudentExamController::class, 'index'])->name('student.exams.index');
        Route::get('/{exam}', [StudentExamController::class, 'show'])->name('student.exams.show');
        Route::post('/{exam}/start', [StudentExamController::class, 'start'])->name('student.exams.start');
        Route::get('/attempts/{attempt}', [StudentExamController::class, 'takeExam'])->name('student.exams.take');
        Route::post('/attempts/{attempt}/save', [StudentExamController::class, 'saveAnswer'])->name('student.exams.save');
        Route::post('/attempts/{attempt}/submit', [StudentExamController::class, 'submit'])->name('student.exams.submit');
        Route::get('/attempts/{attempt}/review', [StudentExamController::class, 'review'])->name('student.exams.review');
        Route::get('/attempts/{attempt}/result', [StudentExamController::class, 'result'])->name('student.exams.result');
    });

    // 10. Pengumuman & Berita Sekolah
    Route::get('/announcements', [AnnouncementController::class, 'index'])->name('announcements.index');
    Route::get('/announcements/{id}', [AnnouncementController::class, 'show'])->name('announcements.show');

    // Admin only - manage announcements
    Route::middleware(['role:admin,pimpinan'])->group(function () {
        Route::post('/announcements', [AnnouncementController::class, 'store'])->name('announcements.store');
        Route::put('/announcements/{id}', [AnnouncementController::class, 'update'])->name('announcements.update');
        Route::delete('/announcements/{id}', [AnnouncementController::class, 'destroy'])->name('announcements.destroy');
    });

    // 11. Notifikasi Sistem
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');

    // Profil Pengguna
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
