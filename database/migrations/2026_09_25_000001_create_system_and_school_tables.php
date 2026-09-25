<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Activity Logs
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action', 100);
            $table->text('description');
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        // School Profiles
        Schema::create('school_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('npsn', 20);
            $table->string('school_name', 255)->default('UPT SDN 9 Gandangbatu Sillanan');
            $table->string('principal_name', 255)->default('Hendrika Genti, S.Pd.SD.');
            $table->string('principal_nip', 30)->nullable()->default('198502012010012025');
            $table->text('address')->nullable();
            $table->string('village', 100)->nullable();
            $table->string('district', 100)->nullable()->default('Gandangbatu Sillanan');
            $table->string('regency', 100)->nullable()->default('Tana Toraja');
            $table->string('province', 100)->nullable()->default('Sulawesi Selatan');
            $table->string('postal_code', 10)->nullable();
            $table->string('phone', 25)->nullable();
            $table->string('email', 100)->nullable();
            $table->string('logo_path', 255)->nullable();
            $table->string('website', 100)->nullable();
            $table->timestamps();
        });

        // Academic Years
        Schema::create('academic_years', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50); // e.g. 2026/2027
            $table->enum('semester', ['ganjil', 'genap'])->default('ganjil');
            $table->boolean('is_active')->default(false);
            $table->date('start_date');
            $table->date('end_date');
            $table->timestamps();
        });

        // Announcements
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255);
            $table->text('content');
            $table->enum('target_role', ['all', 'guru', 'siswa', 'wali_kelas'])->default('all');
            $table->boolean('is_popup')->default(false);
            $table->timestamp('published_at')->useCurrent();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('announcements');
        Schema::dropIfExists('academic_years');
        Schema::dropIfExists('school_profiles');
        Schema::dropIfExists('activity_logs');
    }
};
