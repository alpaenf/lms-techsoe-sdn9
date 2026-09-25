<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Teachers
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('nip', 30)->nullable()->unique();
            $table->string('nuptk', 30)->nullable();
            $table->string('full_name', 255);
            $table->enum('gender', ['L', 'P'])->default('L');
            $table->enum('employment_status', ['PNS', 'PPPK', 'GTT', 'Honorer'])->default('PNS');
            $table->string('education_level', 50)->nullable()->default('S1');
            $table->timestamps();
        });

        // Classes (Rombel)
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_year_id')->constrained('academic_years')->cascadeOnDelete();
            $table->unsignedTinyInteger('grade_level'); // 1 to 6
            $table->string('name', 50); // e.g. Kelas 1A, Kelas 6
            $table->foreignId('homeroom_teacher_id')->nullable()->constrained('teachers')->nullOnDelete();
            $table->timestamps();
        });

        // Subjects (Mata Pelajaran)
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('code', 20)->unique();
            $table->string('name', 150);
            $table->enum('category', ['wajib', 'muatan_lokal', 'pilihan'])->default('wajib');
            $table->decimal('kkm', 5, 2)->default(75.00);
            $table->timestamps();
        });

        // Teacher Subjects Mapping
        Schema::create('teacher_subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained('teachers')->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->foreignId('class_id')->constrained('classes')->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained('academic_years')->cascadeOnDelete();
            $table->timestamps();
        });

        // Students (Buku Induk Siswa)
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('nis', 20)->unique();
            $table->string('nisn', 10)->unique();
            $table->string('nik', 20)->nullable();
            $table->string('full_name', 255);
            $table->foreignId('class_id')->constrained('classes')->cascadeOnDelete();
            $table->enum('gender', ['L', 'P'])->default('L');
            $table->string('birth_place', 100);
            $table->date('birth_date');
            $table->string('religion', 50)->default('Kristen');
            $table->text('address')->nullable();
            $table->date('entry_date');
            $table->enum('status', ['aktif', 'lulus', 'mutasi', 'keluar'])->default('aktif');
            $table->timestamps();
        });

        // Guardians (Orang Tua / Wali Murid)
        Schema::create('guardians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->enum('relation_type', ['ayah', 'ibu', 'wali'])->default('ayah');
            $table->string('name', 255);
            $table->string('occupation', 100)->nullable();
            $table->string('phone_number', 25)->nullable();
            $table->text('address')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guardians');
        Schema::dropIfExists('students');
        Schema::dropIfExists('teacher_subjects');
        Schema::dropIfExists('subjects');
        Schema::dropIfExists('classes');
        Schema::dropIfExists('teachers');
    }
};
