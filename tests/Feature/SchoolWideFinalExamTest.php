<?php

namespace Tests\Feature;

use App\Models\AcademicYear;
use App\Models\Classes;
use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SchoolWideFinalExamTest extends TestCase
{
    use RefreshDatabase;

    protected User $teacherUser;
    protected Teacher $teacher;
    protected Classes $class6A;
    protected Classes $class6B;
    protected Classes $class5;
    protected User $student6AUser;
    protected Student $student6A;
    protected User $student6BUser;
    protected Student $student6B;
    protected User $student5User;
    protected Student $student5;
    protected Subject $subject;
    protected AcademicYear $academicYear;

    protected function setUp(): void
    {
        parent::setUp();

        $this->academicYear = AcademicYear::create([
            'year' => '2026/2027',
            'semester' => 'genap',
            'is_active' => true,
        ]);

        $this->teacherUser = User::factory()->create([
            'role' => 'guru',
            'name' => 'Wali Kelas 6 & Pengampu US',
        ]);

        $this->teacher = Teacher::create([
            'user_id' => $this->teacherUser->id,
            'nip' => '198502012010012025',
            'full_name' => 'Hendrika Genti, S.Pd.SD.',
            'gender' => 'P',
        ]);

        $this->class6A = Classes::create([
            'name' => 'Kelas 6A',
            'grade_level' => 6,
            'homeroom_teacher_id' => $this->teacher->id,
        ]);

        $this->class6B = Classes::create([
            'name' => 'Kelas 6B',
            'grade_level' => 6,
            'homeroom_teacher_id' => null,
        ]);

        $this->class5 = Classes::create([
            'name' => 'Kelas 5',
            'grade_level' => 5,
            'homeroom_teacher_id' => null,
        ]);

        $this->subject = Subject::create([
            'name' => 'Matematika',
            'code' => 'MAT-SD',
        ]);

        // Student in 6A
        $this->student6AUser = User::factory()->create(['role' => 'siswa']);
        $this->student6A = Student::create([
            'user_id' => $this->student6AUser->id,
            'nis' => '2026001',
            'nisn' => '0081234561',
            'full_name' => 'Siswa Kelas 6A',
            'gender' => 'L',
            'class_id' => $this->class6A->id,
        ]);

        // Student in 6B
        $this->student6BUser = User::factory()->create(['role' => 'siswa']);
        $this->student6B = Student::create([
            'user_id' => $this->student6BUser->id,
            'nis' => '2026002',
            'nisn' => '0081234562',
            'full_name' => 'Siswa Kelas 6B',
            'gender' => 'P',
            'class_id' => $this->class6B->id,
        ]);

        // Student in 5
        $this->student5User = User::factory()->create(['role' => 'siswa']);
        $this->student5 = Student::create([
            'user_id' => $this->student5User->id,
            'nis' => '2026003',
            'nisn' => '0081234563',
            'full_name' => 'Siswa Kelas 5',
            'gender' => 'L',
            'class_id' => $this->class5->id,
        ]);
    }

    public function test_teacher_can_create_ujian_sekolah_for_all_grade_6_classes(): void
    {
        $this->actingAs($this->teacherUser);

        $response = $this->post(route('exams.store'), [
            'subject_id' => $this->subject->id,
            'class_id' => '', // Empty string represents all grade 6 classes
            'exam_category' => 'ujian_sekolah',
            'title' => 'Ujian Sekolah Matematika Bersama Seluruh Kelas 6',
            'description' => 'Ujian akhir sekolah untuk seluruh siswa tingkat akhir',
            'duration_minutes' => 90,
            'start_time' => now()->subHour()->format('Y-m-d H:i:s'),
            'end_time' => now()->addHours(4)->format('Y-m-d H:i:s'),
            'max_attempts' => 1,
            'passing_score' => 75.0,
        ]);

        $exam = Exam::where('title', 'Ujian Sekolah Matematika Bersama Seluruh Kelas 6')->first();
        $this->assertNotNull($exam);
        $this->assertNull($exam->class_id);
        $this->assertEquals('ujian_sekolah', $exam->exam_category);
        $this->assertEquals('Seluruh Kelas 6 (Kelas Akhir)', $exam->target_class_label);

        $response->assertRedirect(route('exams.show', $exam->id));
    }

    public function test_all_grade_6_students_can_see_and_take_ujian_sekolah(): void
    {
        $exam = Exam::create([
            'teacher_id' => $this->teacher->id,
            'subject_id' => $this->subject->id,
            'class_id' => null, // Targeted to all Grade 6 classes
            'academic_year_id' => $this->academicYear->id,
            'title' => 'Ujian Sekolah Matematika Nasional',
            'duration_minutes' => 60,
            'start_time' => now()->subMinutes(10),
            'end_time' => now()->addHours(2),
            'max_attempts' => 1,
            'passing_score' => 75.0,
            'exam_category' => 'ujian_sekolah',
            'status' => 'published',
        ]);

        ExamQuestion::create([
            'exam_id' => $exam->id,
            'question_type' => 'multiple_choice',
            'question_text' => 'Berapakah 25 x 4?',
            'options' => ['A' => '100', 'B' => '50', 'C' => '75', 'D' => '125'],
            'correct_answer' => 'A',
            'points' => 10,
            'order_number' => 1,
        ]);

        // Student 6A can view and start exam
        $this->actingAs($this->student6AUser);
        $resIndex6A = $this->get(route('student.exams.index'));
        $resIndex6A->assertOk();

        $resStart6A = $this->post(route('student.exams.start', $exam->id));
        $this->assertDatabaseHas('student_exam_attempts', [
            'exam_id' => $exam->id,
            'student_id' => $this->student6A->id,
            'status' => 'in_progress',
        ]);

        // Student 6B can also view and start exam
        $this->actingAs($this->student6BUser);
        $resIndex6B = $this->get(route('student.exams.index'));
        $resIndex6B->assertOk();

        $resStart6B = $this->post(route('student.exams.start', $exam->id));
        $this->assertDatabaseHas('student_exam_attempts', [
            'exam_id' => $exam->id,
            'student_id' => $this->student6B->id,
            'status' => 'in_progress',
        ]);
    }

    public function test_lower_grade_students_cannot_access_ujian_sekolah(): void
    {
        $exam = Exam::create([
            'teacher_id' => $this->teacher->id,
            'subject_id' => $this->subject->id,
            'class_id' => null, // Targeted to all Grade 6 classes
            'academic_year_id' => $this->academicYear->id,
            'title' => 'Ujian Sekolah Tingkat Akhir',
            'duration_minutes' => 60,
            'start_time' => now()->subMinutes(10),
            'end_time' => now()->addHours(2),
            'max_attempts' => 1,
            'passing_score' => 75.0,
            'exam_category' => 'ujian_sekolah',
            'status' => 'published',
        ]);

        // Student in Kelas 5 attempts to access show or start
        $this->actingAs($this->student5User);

        $resShow = $this->get(route('student.exams.show', $exam->id));
        $resShow->assertRedirect(route('student.exams.index'));
        $resShow->assertSessionHas('error', 'Ujian Sekolah ini khusus untuk siswa Kelas 6 (Kelas Akhir).');

        $resStart = $this->post(route('student.exams.start', $exam->id));
        $resStart->assertRedirect(route('student.exams.index'));
        $resStart->assertSessionHas('error', 'Ujian Sekolah ini khusus untuk siswa Kelas 6 (Kelas Akhir).');

        $this->assertDatabaseMissing('student_exam_attempts', [
            'exam_id' => $exam->id,
            'student_id' => $this->student5->id,
        ]);
    }
}
