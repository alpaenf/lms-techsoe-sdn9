<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('teachers')) {
            Schema::table('teachers', function (Blueprint $table) {
                if (!Schema::hasColumn('teachers', 'teacher_type')) {
                    $table->string('teacher_type', 50)->default('guru_kelas');
                }
                if (!Schema::hasColumn('teachers', 'subject_specialization')) {
                    $table->string('subject_specialization', 150)->nullable();
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('teachers')) {
            Schema::table('teachers', function (Blueprint $table) {
                if (Schema::hasColumn('teachers', 'teacher_type')) {
                    $table->dropColumn('teacher_type');
                }
                if (Schema::hasColumn('teachers', 'subject_specialization')) {
                    $table->dropColumn('subject_specialization');
                }
            });
        }
    }
};
