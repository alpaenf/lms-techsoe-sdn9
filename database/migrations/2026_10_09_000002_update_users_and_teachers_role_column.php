<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Ensure users.role is VARCHAR(50) to accept 'tendik', 'guru_mapel', etc.
        if (Schema::hasTable('users')) {
            try {
                DB::statement("ALTER TABLE users MODIFY COLUMN role VARCHAR(50) NOT NULL DEFAULT 'siswa'");
            } catch (Throwable $e) {
                // Fallback using Schema Builder if supported
                Schema::table('users', function (Blueprint $table) {
                    $table->string('role', 50)->default('siswa')->change();
                });
            }
        }

        // 2. Ensure teachers table columns allow flexible string values
        if (Schema::hasTable('teachers')) {
            try {
                DB::statement("ALTER TABLE teachers MODIFY COLUMN employment_status VARCHAR(50) NOT NULL DEFAULT 'PNS'");
            } catch (Throwable $e) {
                // Ignored if already varchar or changed
            }

            try {
                DB::statement("ALTER TABLE teachers MODIFY COLUMN gender VARCHAR(10) NOT NULL DEFAULT 'L'");
            } catch (Throwable $e) {
                // Ignored
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No down needed
    }
};
