<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->string('rt', 10)->nullable()->after('address');
            $table->string('rw', 10)->nullable()->after('rt');
            $table->string('dusun', 100)->nullable()->after('rw');
            $table->string('kelurahan', 100)->nullable()->after('dusun');
            $table->string('kecamatan', 100)->nullable()->after('kelurahan');
            $table->string('postal_code', 10)->nullable()->after('kecamatan');
            $table->string('residence_type', 100)->nullable()->after('postal_code'); // Jenis Tinggal (e.g. Bersama orang tua)
            $table->string('transportation', 100)->nullable()->after('residence_type'); // Alat Transportasi (e.g. Jalan kaki)
            $table->string('phone', 30)->nullable()->after('transportation');
            $table->string('mobile_phone', 30)->nullable()->after('phone');
            $table->string('email', 150)->nullable()->after('mobile_phone');
            $table->string('skhun', 50)->nullable()->after('email');
            $table->string('is_kps_recipient', 20)->nullable()->default('Tidak')->after('skhun'); // Penerima KPS (Ya/Tidak)
            $table->string('kps_number', 50)->nullable()->after('is_kps_recipient');
        });

        Schema::table('guardians', function (Blueprint $table) {
            $table->string('birth_year', 10)->nullable()->after('name');
            $table->string('education', 100)->nullable()->after('birth_year');
            $table->string('income', 100)->nullable()->after('occupation');
            $table->string('nik', 30)->nullable()->after('income');
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn([
                'rt',
                'rw',
                'dusun',
                'kelurahan',
                'kecamatan',
                'postal_code',
                'residence_type',
                'transportation',
                'phone',
                'mobile_phone',
                'email',
                'skhun',
                'is_kps_recipient',
                'kps_number',
            ]);
        });

        Schema::table('guardians', function (Blueprint $table) {
            $table->dropColumn([
                'birth_year',
                'education',
                'income',
                'nik',
            ]);
        });
    }
};
