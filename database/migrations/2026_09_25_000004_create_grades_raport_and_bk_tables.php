<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Student Grades (Leger Nilai Mata Pelajaran)
        Schema::create('student_grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('teacher_subject_id')->constrained('teacher_subjects')->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained('academic_years')->cascadeOnDelete();
            $table->decimal('tugas_avg', 5, 2)->default(0.00); // 30%
            $table->decimal('uts_score', 5, 2)->default(0.00); // 30%
            $table->decimal('uas_score', 5, 2)->default(0.00); // 40%
            $table->decimal('final_score', 5, 2)->default(0.00);
            $table->enum('letter_grade', ['A', 'B', 'C', 'D'])->default('C');
            $table->text('competency_desc')->nullable();
            $table->timestamps();

            $table->unique(['student_id', 'teacher_subject_id', 'academic_year_id'], 'idx_student_subject_grade');
        });

        // Raport Evaluations (Pengesahan & Buku Rapor)
        Schema::create('raport_evaluations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained('academic_years')->cascadeOnDelete();
            $table->foreignId('class_id')->constrained('classes')->cascadeOnDelete();
            $table->enum('attitude_score', ['Sangat Baik', 'Baik', 'Cukup', 'Kurang'])->default('Baik');
            $table->text('homeroom_notes')->nullable();
            $table->enum('status', ['draft', 'verified_wali_kelas', 'approved_kepsek', 'published'])->default('draft');
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();

            $table->unique(['student_id', 'academic_year_id'], 'idx_student_raport');
        });

        // Counseling Sessions (Bimbingan Konseling)
        Schema::create('counseling_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('counselor_id')->constrained('teachers')->cascadeOnDelete();
            $table->date('session_date');
            $table->string('topic', 255);
            $table->text('action_plan');
            $table->boolean('is_confidential')->default(true);
            $table->timestamps();
        });

        // Discipline Violations (Catatan Pelanggaran & Poin Sanksi)
        Schema::create('discipline_violations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->date('violation_date');
            $table->string('violation_name', 255);
            $table->unsignedInteger('penalty_points')->default(5);
            $table->text('sanction_action')->nullable();
            $table->boolean('call_letter_sent')->default(false);
            $table->timestamps();
        });

        // Student Achievements (Prestasi Siswa)
        Schema::create('student_achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->string('title', 255);
            $table->enum('level', ['sekolah', 'kecamatan', 'kabupaten', 'provinsi', 'nasional'])->default('sekolah');
            $table->string('rank', 50); // e.g. Juara 1
            $table->date('event_date');
            $table->string('certificate_file', 255)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_achievements');
        Schema::dropIfExists('discipline_violations');
        Schema::dropIfExists('counseling_sessions');
        Schema::dropIfExists('raport_evaluations');
        Schema::dropIfExists('student_grades');
    }
};
