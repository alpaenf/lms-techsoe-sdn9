<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('subjects')) {
            $religionSubjects = [
                ['code' => 'PAK-SD', 'name' => 'Pendidikan Agama Kristen', 'category' => 'wajib', 'kkm' => 75.00],
                ['code' => 'KAT-SD', 'name' => 'Pendidikan Agama Katolik', 'category' => 'wajib', 'kkm' => 75.00],
                ['code' => 'HIN-SD', 'name' => 'Pendidikan Agama Hindu', 'category' => 'wajib', 'kkm' => 75.00],
                ['code' => 'BUD-SD', 'name' => 'Pendidikan Agama Buddha', 'category' => 'wajib', 'kkm' => 75.00],
                ['code' => 'KHO-SD', 'name' => 'Pendidikan Agama Khonghucu', 'category' => 'wajib', 'kkm' => 75.00],
            ];

            foreach ($religionSubjects as $subj) {
                $exists = DB::table('subjects')->where('code', $subj['code'])->exists();
                if (! $exists) {
                    DB::table('subjects')->insert(array_merge($subj, [
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]));
                }
            }
        }
    }

    public function down(): void
    {
        // Keep subjects in down migration to avoid data loss
    }
};
