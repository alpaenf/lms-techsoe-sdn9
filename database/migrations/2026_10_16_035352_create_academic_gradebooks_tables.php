<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('academic_gradebooks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_year_id')->constrained('academic_years')->cascadeOnDelete();
            $table->foreignId('class_id')->constrained('classes')->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->foreignId('teacher_id')->nullable()->constrained('teachers')->nullOnDelete();
            $table->unsignedTinyInteger('semester')->default(2);
            $table->json('material_scopes')->nullable(); // defines LM and their TPs
            $table->timestamps();

            $table->unique(['academic_year_id', 'class_id', 'subject_id', 'semester'], 'idx_gradebook_unique');
        });

        Schema::create('academic_gradebook_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gradebook_id')->constrained('academic_gradebooks')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->json('formatif_scores')->nullable(); // e.g. {"lm1": {"TP1": 85, "TP2": 90}}
            $table->json('sumatif_lm_scores')->nullable(); // e.g. {"lm1": 88, "lm2": 90}
            $table->decimal('sas_score', 5, 2)->nullable(); // Sumatif Akhir Semester
            $table->decimal('final_score', 5, 2)->nullable(); // Nilai Akhir
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['gradebook_id', 'student_id'], 'idx_gradebook_student_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_gradebook_scores');
        Schema::dropIfExists('academic_gradebooks');
    }
};
