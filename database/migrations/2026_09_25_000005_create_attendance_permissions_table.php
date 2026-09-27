<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('student_id')->nullable()->constrained('students')->cascadeOnDelete();
            $table->foreignId('teacher_id')->nullable()->constrained('teachers')->cascadeOnDelete();
            $table->enum('type', ['siswa', 'guru'])->default('siswa');
            $table->enum('permission_type', ['Izin', 'Sakit'])->default('Izin');
            $table->date('start_date');
            $table->date('end_date');
            $table->text('reason');
            $table->string('attachment_path', 255)->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_permissions');
    }
};
