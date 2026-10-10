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

class ExamTimezoneAndOnlineExamTest extends TestCase
{
    use RefreshDatabase;

    protected User $teacherUser;
    protected Teacher $teacher;
    protected User $studentUser;
    protected Student $student;
    protected Subject $subject;
    protected Classes $class;
    protected AcademicYear $academicYear;

    protected function setUp(): void
    {
        parent::setUp();

        $this->academicYear = AcademicYear::create([
            'year' => '2026/2027',
            'semester' => 'ganjil',
            'is_active' => true,
        ]);

        $this->teacherUser = User::factory()->create([
            'role' => 'guru',
        ]);

        $this->teacher = Teacher::create([
            'user_id' => $this->teacherUser->id,
            'nip' => '198501012010011001',
            'full_name' => 'Guru Pengampu Ujian',
            'gender' => 'L',
        ]);

        $this->class = Classes::create([
            'name' => 'Kelas 5A',
            'grade_level' => 5,
        ]);

        $this->subject = Subject::create([
            'name' => 'Matematika',
            'code' => 'MTK-5',
        ]);

        $this->studentUser = User::factory()->create([
            'role' => 'siswa',
        ]);

        $this->student = Student::create([
            'user_id' => $this->studentUser->id,
            'nis' => '12345',
            'nisn' => '0012345678',
            'full_name' => 'Siswa Penguji',
            'gender' => 'L',
            'class_id' => $this->class->id,
        ]);
    }

    public function test_application_timezone_is_asia_makassar(): void
    {
        $this->assertEquals('Asia/Makassar', config('app.timezone'));
    }

    public function test_exam_creation_preserves_input_time_without_offset_drift(): void
    {
        $this->actingAs($this->teacherUser);

        $payload = [
            'title' => 'Asesmen Harian Matematika',
            'description' => 'Materi Pecahan dan Desimal',
            'subject_id' => $this->subject->id,
            'class_id' => $this->class->id,
            'exam_category' => 'ulangan_harian',
            'duration_minutes' => 60,
            'start_time' => '2026-10-10T08:33',
            'end_time' => '2026-10-10T09:33',
            'max_attempts' => 1,
            'passing_score' => 75.00,
            'randomize_questions' => true,
            'show_review' => true,
            'show_result_immediately' => true,
        ];

        $response = $this->post(route('exams.store'), $payload);
        $response->assertSessionHasNoErrors();

        $exam = Exam::where('title', 'Asesmen Harian Matematika')->firstOrFail();
        $this->assertEquals('2026-10-10 08:33:00', $exam->getRawOriginal('start_time'));
        $this->assertEquals('2026-10-10 09:33:00', $exam->getRawOriginal('end_time'));

        // Check Inertia / toArray() serialization
        $serialized = $exam->toArray();
        $this->assertEquals('2026-10-10T08:33', $serialized['start_time']);
        $this->assertEquals('2026-10-10T09:33', $serialized['end_time']);
        $this->assertNotEquals('2026-10-10T16:33', $serialized['start_time']);
    }

    public function test_exam_update_preserves_input_time_and_allows_field_updates(): void
    {
        $this->actingAs($this->teacherUser);

        $exam = Exam::create([
            'teacher_id' => $this->teacher->id,
            'subject_id' => $this->subject->id,
            'class_id' => $this->class->id,
            'academic_year_id' => $this->academicYear->id,
            'title' => 'Ulangan Harian',
            'duration_minutes' => 45,
            'start_time' => '2026-10-10T08:33',
            'end_time' => '2026-10-10T09:18',
            'max_attempts' => 1,
            'passing_score' => 70.00,
            'exam_category' => 'ulangan_harian',
            'status' => 'draft',
        ]);

        $updatePayload = [
            'subject_id' => $this->subject->id,
            'class_id' => $this->class->id,
            'exam_category' => 'ulangan_harian',
            'title' => 'Ulangan Harian Revisi',
            'duration_minutes' => 60,
            'start_time' => '2026-10-10T08:33',
            'end_time' => '2026-10-10T09:33',
            'max_attempts' => 2,
            'passing_score' => 75.00,
            'randomize_questions' => true,
            'show_review' => true,
            'show_result_immediately' => true,
        ];

        $response = $this->put(route('exams.update', $exam->id), $updatePayload);
        $response->assertSessionHasNoErrors();

        $exam->refresh();
        $this->assertEquals('Ulangan Harian Revisi', $exam->title);
        $this->assertEquals('2026-10-10 08:33:00', $exam->getRawOriginal('start_time'));
        $this->assertEquals('2026-10-10 09:33:00', $exam->getRawOriginal('end_time'));

        $serialized = $exam->toArray();
        $this->assertEquals('2026-10-10T08:33', $serialized['start_time']);
        $this->assertNotEquals('2026-10-10T16:33', $serialized['start_time']);
    }

    public function test_student_can_take_and_submit_online_exam(): void
    {
        $exam = Exam::create([
            'teacher_id' => $this->teacher->id,
            'subject_id' => $this->subject->id,
            'class_id' => $this->class->id,
            'academic_year_id' => $this->academicYear->id,
            'title' => 'Ujian Berjalan',
            'duration_minutes' => 60,
            'start_time' => now()->subMinutes(10)->format('Y-m-d\TH:i'),
            'end_time' => now()->addMinutes(50)->format('Y-m-d\TH:i'),
            'max_attempts' => 1,
            'passing_score' => 75.00,
            'exam_category' => 'ulangan_harian',
            'status' => 'published',
        ]);

        $q1 = ExamQuestion::create([
            'exam_id' => $exam->id,
            'question_type' => 'multiple_choice',
            'question_text' => 'Berapa 5 + 5?',
            'options' => ['A' => '8', 'B' => '10', 'C' => '12', 'D' => '15'],
            'correct_answer' => 'B',
            'points' => 50,
            'order_number' => 1,
        ]);

        $q2 = ExamQuestion::create([
            'exam_id' => $exam->id,
            'question_type' => 'short_answer',
            'question_text' => 'Ibukota Indonesia adalah?',
            'correct_answer' => 'Nusantara',
            'points' => 50,
            'order_number' => 2,
        ]);

        $this->actingAs($this->studentUser);

        // Student starts exam
        $startResponse = $this->post(route('student.exams.start', $exam->id));
        $startResponse->assertSessionHasNoErrors();

        $attempt = $exam->attempts()->where('student_id', $this->student->id)->firstOrFail();
        $this->assertEquals('in_progress', $attempt->status);

        // Student saves answers
        $save1 = $this->postJson(route('student.exams.save', $attempt->id), [
            'question_id' => $q1->id,
            'answer_text' => 'B',
        ]);
        $save1->assertOk();

        $save2 = $this->postJson(route('student.exams.save', $attempt->id), [
            'question_id' => $q2->id,
            'answer_text' => 'nusantara',
        ]);
        $save2->assertOk();

        // Student submits exam
        $submitResponse = $this->post(route('student.exams.submit', $attempt->id));
        $submitResponse->assertSessionHasNoErrors();

        $attempt->refresh();
        $this->assertEquals('graded', $attempt->status);
        $this->assertEquals(100.00, $attempt->percentage);
        $this->assertTrue($attempt->isPassed());
    }
}
