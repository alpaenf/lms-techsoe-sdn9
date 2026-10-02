<?php

namespace Tests\Feature\Auth;

use App\Models\Classes;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class StudentPasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_can_reset_password_with_valid_nisn_and_birth_date(): void
    {
        $academicYearId = DB::table('academic_years')->insertGetId([
            'name' => '2026/2027',
            'semester' => 'ganjil',
            'start_date' => '2026-07-01',
            'end_date' => '2026-12-31',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $class = Classes::create([
            'academic_year_id' => $academicYearId,
            'name' => 'Kelas 6',
            'grade_level' => 6,
        ]);

        $user = User::factory()->create([
            'role' => 'siswa',
            'password' => Hash::make('old_password'),
        ]);

        $student = Student::create([
            'user_id' => $user->id,
            'nisn' => '0081234567',
            'nis' => '102030',
            'full_name' => 'Siti Nurhaliza',
            'class_id' => $class->id,
            'gender' => 'P',
            'birth_place' => 'Tana Toraja',
            'birth_date' => '2014-06-15',
            'entry_date' => '2020-07-15',
        ]);

        $response = $this->post('/forgot-password/nisn', [
            'nisn' => '0081234567',
            'birth_date' => '2014-06-15',
            'password' => 'new_password123',
            'password_confirmation' => 'new_password123',
        ]);

        $response->assertSessionHas('status_nisn');
        $response->assertSessionHasNoErrors();

        $this->assertTrue(Hash::check('new_password123', $user->fresh()->password));
    }

    public function test_student_cannot_reset_password_with_mismatched_birth_date(): void
    {
        $academicYearId = DB::table('academic_years')->insertGetId([
            'name' => '2026/2027',
            'semester' => 'ganjil',
            'start_date' => '2026-07-01',
            'end_date' => '2026-12-31',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $class = Classes::create([
            'academic_year_id' => $academicYearId,
            'name' => 'Kelas 6',
            'grade_level' => 6,
        ]);

        $user = User::factory()->create(['role' => 'siswa']);

        Student::create([
            'user_id' => $user->id,
            'nisn' => '0081234567',
            'nis' => '102030',
            'full_name' => 'Siti Nurhaliza',
            'class_id' => $class->id,
            'gender' => 'P',
            'birth_place' => 'Tana Toraja',
            'birth_date' => '2014-06-15',
            'entry_date' => '2020-07-15',
        ]);

        $response = $this->post('/forgot-password/nisn', [
            'nisn' => '0081234567',
            'birth_date' => '2014-01-01', // Mismatched date
            'password' => 'new_password123',
            'password_confirmation' => 'new_password123',
        ]);

        $response->assertSessionHasErrors('nisn');
    }
}
