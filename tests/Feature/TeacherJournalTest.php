<?php

namespace Tests\Feature;

use App\Models\Classes;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\TeacherJournal;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TeacherJournalTest extends TestCase
{
    use RefreshDatabase;

    protected User $teacherUser;
    protected Teacher $teacher;
    protected Classes $class;
    protected Subject $subject;

    protected function setUp(): void
    {
        parent::setUp();

        DB::table('academic_years')->insert([
            'id' => 1,
            'name' => '2026/2027',
            'semester' => 'ganjil',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('school_profiles')->insert([
            'id' => 1,
            'npsn' => '40304321',
            'school_name' => 'UPT SDN 9 Gandangbatu Sillanan',
            'principal_name' => 'Hendrika Genti, S.Pd.SD.',
            'principal_nip' => '198502012010012025',
            'district' => 'Gandangbatu Sillanan',
            'regency' => 'Tana Toraja',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->teacherUser = User::factory()->create([
            'role' => 'guru',
        ]);

        $this->teacher = Teacher::create([
            'user_id' => $this->teacherUser->id,
            'full_name' => 'Guru Penguji Jurnal',
            'gender' => 'L',
            'teacher_type' => 'guru_kelas',
        ]);

        $this->class = Classes::create([
            'name' => 'Kelas 4',
            'grade_level' => 4,
            'homeroom_teacher_id' => $this->teacher->id,
        ]);

        $this->subject = Subject::create([
            'name' => 'Matematika',
            'code' => 'MTK',
        ]);
    }

    public function test_teacher_can_view_journal_index_page(): void
    {
        $response = $this->actingAs($this->teacherUser)->get(route('journals.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('TeacherJournal/Index')
            ->has('journals')
            ->has('availableClasses')
            ->has('availableSubjects')
        );
    }

    public function test_teacher_can_create_journal_entry(): void
    {
        $payload = [
            'class_id' => $this->class->id,
            'subject_id' => $this->subject->id,
            'journal_date' => '2026-10-12',
            'start_time' => '07:30',
            'end_time' => '09:00',
            'material_topic' => 'Operasi Hitung Pecahan Campuran',
            'activity_description' => 'Siswa berdiskusi dalam kelompok dan menyelesaikan latihan soal di papan tulis.',
            'learning_media' => 'Buku Siswa & Papan Pecahan',
            'attendance_notes' => 'Hadir: 25, Izin: 0',
            'notes' => 'Semua siswa tuntas memahami konsep dasar.',
            'status' => 'selesai',
        ];

        $response = $this->actingAs($this->teacherUser)->post(route('journals.store'), $payload);

        $response->assertRedirect();
        $this->assertDatabaseHas('teacher_journals', [
            'teacher_id' => $this->teacher->id,
            'class_id' => $this->class->id,
            'subject_id' => $this->subject->id,
            'material_topic' => 'Operasi Hitung Pecahan Campuran',
            'day_name' => 'Senin',
        ]);
    }

    public function test_teacher_can_update_journal_entry(): void
    {
        $journal = TeacherJournal::create([
            'teacher_id' => $this->teacher->id,
            'academic_year_id' => 1,
            'class_id' => $this->class->id,
            'subject_id' => $this->subject->id,
            'journal_date' => '2026-10-12',
            'day_name' => 'Senin',
            'start_time' => '07:30',
            'end_time' => '09:00',
            'material_topic' => 'Materi Lama',
            'activity_description' => 'Aktivitas lama',
            'status' => 'selesai',
        ]);

        $updatePayload = [
            'class_id' => $this->class->id,
            'subject_id' => $this->subject->id,
            'journal_date' => '2026-10-12',
            'start_time' => '07:30',
            'end_time' => '09:00',
            'material_topic' => 'Materi Baru yang Diperbarui',
            'activity_description' => 'Aktivitas yang sudah diperbaiki',
            'status' => 'selesai',
        ];

        $response = $this->actingAs($this->teacherUser)->put(route('journals.update', $journal->id), $updatePayload);

        $response->assertRedirect();
        $this->assertDatabaseHas('teacher_journals', [
            'id' => $journal->id,
            'material_topic' => 'Materi Baru yang Diperbarui',
        ]);
    }

    public function test_teacher_can_delete_journal_entry(): void
    {
        $journal = TeacherJournal::create([
            'teacher_id' => $this->teacher->id,
            'academic_year_id' => 1,
            'class_id' => $this->class->id,
            'subject_id' => $this->subject->id,
            'journal_date' => '2026-10-12',
            'day_name' => 'Senin',
            'material_topic' => 'Materi untuk Dihapus',
            'activity_description' => 'Aktivitas dihapus',
            'status' => 'selesai',
        ]);

        $response = $this->actingAs($this->teacherUser)->delete(route('journals.destroy', $journal->id));

        $response->assertRedirect();
        $this->assertDatabaseMissing('teacher_journals', [
            'id' => $journal->id,
        ]);
    }

    public function test_teacher_can_view_monthly_print_page(): void
    {
        $response = $this->actingAs($this->teacherUser)->get(route('journals.print-monthly', [
            'month' => 10,
            'year' => 2026,
            'class_id' => $this->class->id,
        ]));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('TeacherJournal/PrintMonthly')
            ->where('month', 10)
            ->where('year', 2026)
            ->has('journals')
            ->has('schoolProfile')
        );
    }
}
