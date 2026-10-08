<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Exams table
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained('teachers')->onDelete('cascade');
            $table->foreignId('subject_id')->constrained('subjects')->onDelete('cascade');
            $table->foreignId('class_id')->nullable()->constrained('classes')->onDelete('cascade');
            $table->foreignId('academic_year_id')->constrained('academic_years')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('duration_minutes');
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->integer('max_attempts')->default(1);
            $table->boolean('randomize_questions')->default(false);
            $table->boolean('show_review')->default(false);
            $table->boolean('show_result_immediately')->default(true);
            $table->decimal('passing_score', 5, 2)->default(0);
            $table->enum('exam_category', ['uts', 'uas', 'ulangan_harian', 'ujian_sekolah', 'kuis'])->default('ulangan_harian');
            $table->enum('status', ['draft', 'published', 'closed'])->default('draft');
            $table->timestamps();

            $table->index(['class_id', 'subject_id']);
            $table->index(['status', 'start_time', 'end_time']);
        });

        // 2. Exam questions table
        Schema::create('exam_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained('exams')->onDelete('cascade');
            $table->enum('question_type', ['multiple_choice', 'short_answer', 'essay']);
            $table->text('question_text');
            $table->string('question_image')->nullable();
            $table->json('options')->nullable();
            $table->text('correct_answer')->nullable();
            $table->integer('points')->default(1);
            $table->integer('order_number');
            $table->timestamps();

            $table->index(['exam_id', 'order_number']);
        });

        // 3. Student exam attempts table
        Schema::create('student_exam_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained('exams')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->integer('attempt_number')->default(1);
            $table->dateTime('started_at');
            $table->dateTime('submitted_at')->nullable();
            $table->integer('time_remaining_seconds')->nullable();
            $table->boolean('auto_submitted')->default(false);
            $table->decimal('total_score', 5, 2)->nullable();
            $table->decimal('percentage', 5, 2)->nullable();
            $table->enum('status', ['in_progress', 'submitted', 'graded'])->default('in_progress');
            $table->timestamps();

            $table->unique(['exam_id', 'student_id', 'attempt_number']);
            $table->index(['student_id', 'status']);
            $table->index(['exam_id', 'status']);
        });

        // 4. Student answers table
        Schema::create('student_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attempt_id')->constrained('student_exam_attempts')->onDelete('cascade');
            $table->foreignId('question_id')->constrained('exam_questions')->onDelete('cascade');
            $table->text('answer_text')->nullable();
            $table->string('answer_file')->nullable();
            $table->boolean('is_correct')->nullable();
            $table->decimal('points_earned', 5, 2)->default(0);
            $table->dateTime('graded_at')->nullable();
            $table->foreignId('graded_by')->nullable()->constrained('users')->onDelete('set null');
            $table->text('feedback')->nullable();
            $table->timestamps();

            $table->unique(['attempt_id', 'question_id']);
            $table->index(['is_correct', 'graded_at']);
        });

        // 5. Exam access logs table
        Schema::create('exam_access_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attempt_id')->constrained('student_exam_attempts')->onDelete('cascade');
            $table->enum('event_type', ['started', 'answered', 'tab_switch', 'submitted', 'timeout', 'auto_save']);
            $table->json('metadata')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('created_at');

            $table->index(['attempt_id', 'event_type', 'created_at']);
        });

        // 6. Modify student_grades table
        if (Schema::hasColumn('student_grades', 'grade_type')) {
            Schema::table('student_grades', function (Blueprint $table) {
                $table->dropColumn('grade_type');
            });
        }

        Schema::table('student_grades', function (Blueprint $table) {
            $table->string('grade_type')->after('teacher_subject_id');
            $table->foreignId('exam_id')->nullable()->after('final_score')->constrained('exams')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('student_grades', function (Blueprint $table) {
            if (Schema::hasColumn('student_grades', 'exam_id')) {
                $table->dropForeign(['exam_id']);
                $table->dropColumn('exam_id');
            }
            if (Schema::hasColumn('student_grades', 'grade_type')) {
                $table->dropColumn('grade_type');
            }
        });

        Schema::table('student_grades', function (Blueprint $table) {
            $table->enum('grade_type', ['tugas_avg', 'uts', 'uas'])->after('teacher_subject_id');
        });

        Schema::dropIfExists('exam_access_logs');
        Schema::dropIfExists('student_answers');
        Schema::dropIfExists('student_exam_attempts');
        Schema::dropIfExists('exam_questions');
        Schema::dropIfExists('exams');
    }
};
