<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Topics (Bab / Materi Ajar)
        Schema::create('topics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_subject_id')->constrained('teacher_subjects')->cascadeOnDelete();
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->integer('order')->default(1);
            $table->timestamps();
        });

        // Materials (Modul Bahan Ajar)
        Schema::create('materials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('topic_id')->constrained('topics')->cascadeOnDelete();
            $table->string('title', 255);
            $table->enum('type', ['file', 'video_link', 'article'])->default('file');
            $table->string('file_path', 255)->nullable();
            $table->text('content_url')->nullable();
            $table->longText('body_text')->nullable();
            $table->timestamps();
        });

        // Assignments (Tugas & Asesmen)
        Schema::create('assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('topic_id')->constrained('topics')->cascadeOnDelete();
            $table->string('title', 255);
            $table->text('instructions');
            $table->string('attachment_path', 255)->nullable();
            $table->dateTime('due_date');
            $table->unsignedInteger('max_score')->default(100);
            $table->timestamps();
        });

        // Assignment Submissions (Pengumpulan Tugas Siswa)
        Schema::create('assignment_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assignment_id')->constrained('assignments')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->dateTime('submitted_at');
            $table->string('file_path', 255)->nullable();
            $table->text('student_notes')->nullable();
            $table->decimal('score', 5, 2)->nullable();
            $table->text('teacher_feedback')->nullable();
            $table->dateTime('graded_at')->nullable();
            $table->timestamps();
        });

        // Student Attendances (Presensi Harian Siswa)
        Schema::create('student_attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('class_id')->constrained('classes')->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained('academic_years')->cascadeOnDelete();
            $table->date('attendance_date');
            $table->enum('status', ['Hadir', 'Izin', 'Sakit', 'Alpa'])->default('Hadir');
            $table->string('notes', 255)->nullable();
            $table->foreignId('recorded_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['student_id', 'attendance_date'], 'idx_student_daily_att');
        });

        // Teacher Attendances (Presensi Guru & Pegawai)
        Schema::create('teacher_attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained('teachers')->cascadeOnDelete();
            $table->date('attendance_date');
            $table->enum('status', ['Hadir', 'Izin', 'Sakit', 'Dinas_Luar', 'Alpa'])->default('Hadir');
            $table->time('check_in_time')->nullable();
            $table->string('notes', 255)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teacher_attendances');
        Schema::dropIfExists('student_attendances');
        Schema::dropIfExists('assignment_submissions');
        Schema::dropIfExists('assignments');
        Schema::dropIfExists('materials');
        Schema::dropIfExists('topics');
    }
};
