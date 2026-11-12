<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('student_exam_attempts', function (Blueprint $table) {
            if (! Schema::hasColumn('student_exam_attempts', 'question_order')) {
                $table->json('question_order')->nullable()->after('attempt_number');
            }
        });
    }

    public function down(): void
    {
        Schema::table('student_exam_attempts', function (Blueprint $table) {
            if (Schema::hasColumn('student_exam_attempts', 'question_order')) {
                $table->dropColumn('question_order');
            }
        });
    }
};

