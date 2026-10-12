<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teacher_journals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained('teachers')->cascadeOnDelete();
            $table->foreignId('academic_year_id')->nullable()->constrained('academic_years')->nullOnDelete();
            $table->foreignId('class_id')->constrained('classes')->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->date('journal_date');
            $table->string('day_name', 20); // Senin, Selasa, Rabu, dll.
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->string('material_topic'); // Materi yang diberikan / Pokok Bahasan
            $table->text('activity_description'); // Aktivitas yang dilakukan / Uraian Kegiatan
            $table->string('learning_media', 255)->nullable(); // Media / Alat Pembelajaran
            $table->string('attendance_notes', 255)->nullable(); // Kehadiran siswa
            $table->text('notes')->nullable(); // Catatan Tambahan / Kendala
            $table->string('status', 30)->default('selesai'); // selesai, diganti, terlaksana
            $table->timestamps();

            $table->index(['teacher_id', 'journal_date']);
            $table->index(['class_id', 'journal_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teacher_journals');
    }
};
