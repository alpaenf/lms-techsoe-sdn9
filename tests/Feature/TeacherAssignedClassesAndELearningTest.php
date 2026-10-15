<?php

namespace Tests\Feature;

use App\Models\Classes;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TeacherAssignedClassesAndELearningTest extends TestCase
{
    use RefreshDatabase;

    protected User $homeroomTeacherUser;
    protected Teacher $homeroomTeacher;
    protected Classes $class4;
    protected Classes $class5;
    protected Subject $subjectMtk;

    protected function setUp(): void
    {
        parent::setUp();

        DB::table('academic_years')->insert([
            'id' => 1,
            'name' => '2026/2027',
            'semester' => 'ganjil',
            'is_active' => true,
            'start_date' => '2026-07-01',
            'end_date' => '2026-12-31',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->class4 = Classes::create([
            'academic_year_id' => 1,
            'name' => 'Kelas 4',
            'grade_level' => 4,
        ]);

        $this->class5 = Classes::create([
            'academic_year_id' => 1,
            'name' => 'Kelas 5',
            'grade_level' => 5,
        ]);

        $this->subjectMtk = Subject::create([
            'name' => 'Matematika',
            'code' => 'MTK',
        ]);

        $this->homeroomTeacherUser = User::factory()->create([
            'role' => 'guru',
        ]);

        $this->homeroomTeacher = Teacher::create([
            'user_id' => $this->homeroomTeacherUser->id,
            'full_name' => 'Wali Kelas 4',
            'gender' => 'L',
        ]);

        $this->class4->update([
            'homeroom_teacher_id' => $this->homeroomTeacher->id,
        ]);
    }

    public function test_homeroom_teacher_presensi_defaults_to_assigned_class(): void
    {
        $response = $this->actingAs($this->homeroomTeacherUser)->get(route('presensi.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Presensi/Index')
            ->where('selectedClassId', $this->class4->id)
            ->has('classes', 1)
            ->where('classes.0.id', $this->class4->id)
        );
    }

    public function test_guru_mapel_presensi_only_shows_claimed_classes(): void
    {
        $mapelUser = User::factory()->create(['role' => 'guru_mapel']);
        $mapelTeacher = Teacher::create([
            'user_id' => $mapelUser->id,
            'full_name' => 'Guru PJOK',
            'gender' => 'L',
        ]);

        DB::table('teacher_subjects')->insert([
            'teacher_id' => $mapelTeacher->id,
            'subject_id' => $this->subjectMtk->id,
            'class_id' => $this->class5->id,
            'academic_year_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->actingAs($mapelUser)->get(route('presensi.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Presensi/Index')
            ->where('selectedClassId', $this->class5->id)
            ->has('classes', 1)
            ->where('classes.0.id', $this->class5->id)
        );
    }

    public function test_elearning_provides_teacher_assigned_classes_and_defaults(): void
    {
        $response = $this->actingAs($this->homeroomTeacherUser)->get(route('elearning.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('ELearning/Index')
            ->where('defaultClassId', $this->class4->id)
            ->has('availableClasses', 1)
            ->where('availableClasses.0.id', $this->class4->id)
        );
    }

    public function test_guru_mapel_claim_classes_does_not_overwrite_homeroom_teacher(): void
    {
        $mapelUser = User::factory()->create([
            'role' => 'guru_mapel',
        ]);
        $mapelTeacher = Teacher::create([
            'user_id' => $mapelUser->id,
            'full_name' => 'Guru Agama / Mapel',
            'gender' => 'L',
        ]);

        // class4 originally has homeroomTeacher
        $this->assertEquals($this->homeroomTeacher->id, $this->class4->fresh()->homeroom_teacher_id);

        // Guru mapel claims class4 and class5
        $response = $this->actingAs($mapelUser)->post(route('teacher.claim-subjects'), [
            'teacher_type' => 'guru_mapel',
            'subject_specialization' => 'Pendidikan Agama Islam',
            'subject_ids' => [$this->subjectMtk->id],
            'class_ids' => [$this->class4->id, $this->class5->id],
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        // class4's homeroom_teacher_id must STILL be $this->homeroomTeacher, NOT replaced by $mapelTeacher
        $this->assertEquals($this->homeroomTeacher->id, $this->class4->fresh()->homeroom_teacher_id);
        // class5's homeroom_teacher_id must still be null (not replaced by $mapelTeacher)
        $this->assertNull($this->class5->fresh()->homeroom_teacher_id);

        // But the mapping in teacher_subjects MUST exist
        $this->assertDatabaseHas('teacher_subjects', [
            'teacher_id' => $mapelTeacher->id,
            'subject_id' => $this->subjectMtk->id,
            'class_id' => $this->class4->id,
        ]);
        $this->assertDatabaseHas('teacher_subjects', [
            'teacher_id' => $mapelTeacher->id,
            'subject_id' => $this->subjectMtk->id,
            'class_id' => $this->class5->id,
        ]);
    }
}
