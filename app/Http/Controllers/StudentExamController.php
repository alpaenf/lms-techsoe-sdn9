<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\ExamAccessLog;
use App\Models\ExamQuestion;
use App\Models\Student;
use App\Models\StudentAnswer;
use App\Models\StudentExamAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StudentExamController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $student = Student::with('class')->where('user_id', $user->id)->first();

        if (! $student) {
            return redirect()->route('dashboard');
        }

        $exams = Exam::with(['subject', 'teacher.user', 'class'])
            ->where(function ($q) use ($student) {
                $q->where('class_id', $student->class_id)
                    ->orWhereNull('class_id');
            })
            ->where('status', 'published')
            ->orderBy('start_time', 'desc')
            ->get()
            ->map(function ($exam) use ($student) {
                $attempts = StudentExamAttempt::where('exam_id', $exam->id)
                    ->where('student_id', $student->id)
                    ->orderBy('attempt_number', 'desc')
                    ->get();

                $canAttempt = $attempts->count() < $exam->max_attempts || $exam->max_attempts == 999;
                $isAvailable = $exam->isAvailable();

                return [
                    'id' => $exam->id,
                    'title' => $exam->title,
                    'description' => $exam->description,
                    'subject' => $exam->subject,
                    'teacher_name' => $exam->teacher?->user?->name ?? 'Guru Pengampu',
                    'duration_minutes' => $exam->duration_minutes,
                    'start_time' => $exam->start_time,
                    'end_time' => $exam->end_time,
                    'max_attempts' => $exam->max_attempts,
                    'exam_category' => $exam->exam_category,
                    'total_questions' => $exam->questions()->count(),
                    'is_available' => $isAvailable,
                    'has_started' => $exam->hasStarted(),
                    'has_ended' => $exam->hasEnded(),
                    'can_attempt' => $canAttempt && $isAvailable,
                    'attempts_count' => $attempts->count(),
                    'latest_attempt' => $attempts->first(),
                    'best_score' => $attempts->max('percentage'),
                ];
            });

        return Inertia::render('Student/Exams/Index', [
            'exams' => $exams,
            'student' => $student,
        ]);
    }

    public function show(Exam $exam)
    {
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->first();

        if (! $student) {
            return redirect()->route('dashboard');
        }

        $exam->load(['subject', 'teacher.user', 'class']);

        $attempts = StudentExamAttempt::where('exam_id', $exam->id)
            ->where('student_id', $student->id)
            ->orderBy('attempt_number', 'desc')
            ->get();

        $canAttempt = $attempts->count() < $exam->max_attempts || $exam->max_attempts == 999;

        return Inertia::render('Student/Exams/Show', [
            'exam' => $exam,
            'attempts' => $attempts,
            'can_attempt' => $canAttempt && $exam->isAvailable(),
            'total_questions' => $exam->questions()->count(),
        ]);
    }

    public function start(Exam $exam)
    {
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->first();

        if (! $student) {
            return redirect()->route('dashboard');
        }

        if (! $exam->isAvailable()) {
            return back()->with('error', 'Ujian tidak tersedia saat ini.');
        }

        $attemptCount = StudentExamAttempt::where('exam_id', $exam->id)
            ->where('student_id', $student->id)
            ->count();

        if ($attemptCount >= $exam->max_attempts && $exam->max_attempts != 999) {
            return back()->with('error', 'Anda telah mencapai batas maksimal percobaan.');
        }

        $inProgressAttempt = StudentExamAttempt::where('exam_id', $exam->id)
            ->where('student_id', $student->id)
            ->where('status', 'in_progress')
            ->first();

        if ($inProgressAttempt) {
            return redirect()->route('student.exams.take', $inProgressAttempt->id);
        }

        $attempt = StudentExamAttempt::create([
            'exam_id' => $exam->id,
            'student_id' => $student->id,
            'attempt_number' => $attemptCount + 1,
            'started_at' => now(),
            'time_remaining_seconds' => $exam->duration_minutes * 60,
            'status' => 'in_progress',
        ]);

        ExamAccessLog::create([
            'attempt_id' => $attempt->id,
            'event_type' => 'started',
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'created_at' => now(),
        ]);

        return redirect()->route('student.exams.take', $attempt->id);
    }

    public function takeExam(StudentExamAttempt $attempt)
    {
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->first();

        if (! $student || $attempt->student_id !== $student->id) {
            abort(403);
        }

        if ($attempt->status !== 'in_progress') {
            return redirect()->route('student.exams.result', $attempt->id);
        }

        if ($attempt->isTimeUp()) {
            return $this->autoSubmit($attempt);
        }

        $exam = $attempt->exam;
        $exam->load(['subject', 'class']);

        $questionsQuery = $exam->questions();
        if ($exam->randomize_questions) {
            $questionsQuery = $questionsQuery->inRandomOrder();
        }
        $questions = $questionsQuery->get();

        $answers = $attempt->answers()
            ->with('question')
            ->get()
            ->keyBy('question_id');

        return Inertia::render('Student/Exams/Take', [
            'attempt' => $attempt,
            'exam' => $exam,
            'questions' => $questions,
            'answers' => $answers,
            'time_remaining' => $attempt->getRemainingSeconds(),
        ]);
    }

    public function saveAnswer(Request $request, StudentExamAttempt $attempt)
    {
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->first();

        if (! $student || $attempt->student_id !== $student->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($attempt->status !== 'in_progress') {
            return response()->json(['error' => 'Exam already submitted'], 400);
        }

        if ($attempt->isTimeUp()) {
            $this->autoSubmit($attempt);

            return response()->json(['error' => 'Time is up', 'auto_submitted' => true], 400);
        }

        $validated = $request->validate([
            'question_id' => 'required|exists:exam_questions,id',
            'answer_text' => 'nullable|string',
        ]);

        $question = ExamQuestion::find($validated['question_id']);

        $isCorrect = $question->checkAnswer($validated['answer_text'] ?? '');
        $pointsEarned = 0;

        if ($isCorrect === true) {
            $pointsEarned = $question->points;
        } elseif ($isCorrect === null) {
            $isCorrect = null;
        }

        StudentAnswer::updateOrCreate(
            [
                'attempt_id' => $attempt->id,
                'question_id' => $validated['question_id'],
            ],
            [
                'answer_text' => $validated['answer_text'] ?? null,
                'is_correct' => $isCorrect,
                'points_earned' => $pointsEarned,
            ]
        );

        ExamAccessLog::create([
            'attempt_id' => $attempt->id,
            'event_type' => 'auto_save',
            'metadata' => ['question_id' => $validated['question_id']],
            'created_at' => now(),
        ]);

        if ($request->header('X-Inertia')) {
            return back();
        }

        return response()->json(['success' => true, 'answered_count' => $attempt->getAnsweredCount()]);
    }

    public function submit(StudentExamAttempt $attempt)
    {
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->first();

        if (! $student || $attempt->student_id !== $student->id) {
            abort(403);
        }

        if ($attempt->status !== 'in_progress') {
            return redirect()->route('student.exams.result', $attempt->id);
        }

        $attempt->update([
            'submitted_at' => now(),
            'status' => 'submitted',
        ]);

        $attempt->calculateScore();

        $hasEssay = $attempt->answers()
            ->whereHas('question', fn ($q) => $q->where('question_type', 'essay'))
            ->exists();

        if (! $hasEssay) {
            $attempt->update(['status' => 'graded']);
            $this->syncToRapor($attempt);
        }

        ExamAccessLog::create([
            'attempt_id' => $attempt->id,
            'event_type' => 'submitted',
            'ip_address' => request()->ip(),
            'created_at' => now(),
        ]);

        return redirect()->route('student.exams.result', $attempt->id)
            ->with('success', 'Ujian berhasil dikumpulkan.');
    }

    private function autoSubmit(StudentExamAttempt $attempt)
    {
        if ($attempt->status !== 'in_progress') {
            return redirect()->route('student.exams.result', $attempt->id);
        }

        $attempt->update([
            'submitted_at' => now(),
            'auto_submitted' => true,
            'status' => 'submitted',
        ]);

        $attempt->calculateScore();

        $hasEssay = $attempt->answers()
            ->whereHas('question', fn ($q) => $q->where('question_type', 'essay'))
            ->exists();

        if (! $hasEssay) {
            $attempt->update(['status' => 'graded']);
            $this->syncToRapor($attempt);
        }

        ExamAccessLog::create([
            'attempt_id' => $attempt->id,
            'event_type' => 'timeout',
            'created_at' => now(),
        ]);

        return redirect()->route('student.exams.result', $attempt->id)
            ->with('info', 'Waktu ujian telah habis. Jawaban Anda berhasil dikumpulkan secara otomatis.');
    }

    public function result(StudentExamAttempt $attempt)
    {
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->first();

        if (! $student || $attempt->student_id !== $student->id) {
            abort(403);
        }

        $attempt->load(['exam.subject', 'answers.question']);

        $totalQuestions = $attempt->exam->questions()->count();
        $answeredCount = $attempt->getAnsweredCount();

        $mcCount = $attempt->exam->questions()->where('question_type', 'multiple_choice')->count();
        $mcCorrect = $attempt->answers()
            ->whereHas('question', fn ($q) => $q->where('question_type', 'multiple_choice'))
            ->where('is_correct', true)
            ->count();

        $shortCount = $attempt->exam->questions()->where('question_type', 'short_answer')->count();
        $shortCorrect = $attempt->answers()
            ->whereHas('question', fn ($q) => $q->where('question_type', 'short_answer'))
            ->where('is_correct', true)
            ->count();

        $essayCount = $attempt->exam->questions()->where('question_type', 'essay')->count();
        $essayGraded = $attempt->answers()
            ->whereHas('question', fn ($q) => $q->where('question_type', 'essay'))
            ->whereNotNull('is_correct')
            ->count();

        $statistics = [
            'total_questions' => $totalQuestions,
            'answered' => $answeredCount,
            'mc_correct' => $mcCorrect.'/'.$mcCount,
            'short_correct' => $shortCorrect.'/'.$shortCount,
            'essay_graded' => $essayGraded.'/'.$essayCount,
            'is_passed' => $attempt->isPassed(),
        ];

        return Inertia::render('Student/Exams/Result', [
            'attempt' => $attempt,
            'statistics' => $statistics,
        ]);
    }

    public function review(StudentExamAttempt $attempt)
    {
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->first();

        if (! $student || $attempt->student_id !== $student->id) {
            abort(403);
        }

        if (! $attempt->exam->show_review) {
            return back()->with('error', 'Review jawaban tidak diizinkan untuk ujian ini.');
        }

        $attempt->load(['exam.subject', 'answers.question']);

        return Inertia::render('Student/Exams/Review', [
            'attempt' => $attempt,
            'questions' => $attempt->exam->questions,
            'answers' => $attempt->answers->keyBy('question_id'),
        ]);
    }

    private function syncToRapor(StudentExamAttempt $attempt)
    {
        $exam = $attempt->exam;

        $teacherSubject = DB::table('teacher_subjects')
            ->where('subject_id', $exam->subject_id)
            ->where('academic_year_id', $exam->academic_year_id)
            ->when($exam->class_id, fn ($q) => $q->where('class_id', $exam->class_id))
            ->first();

        if ($teacherSubject) {
            $existingGrade = DB::table('student_grades')
                ->where('student_id', $attempt->student_id)
                ->where('teacher_subject_id', $teacherSubject->id)
                ->where('academic_year_id', $exam->academic_year_id)
                ->first();

            $tugas = $existingGrade->tugas_avg ?? 0.00;
            $uts = $existingGrade->uts_score ?? 0.00;
            $uas = $existingGrade->uas_score ?? 0.00;

            $category = $exam->exam_category;
            if ($category === 'uts') {
                $uts = $attempt->percentage;
            } elseif ($category === 'uas') {
                $uas = $attempt->percentage;
            } else {
                $tugas = $attempt->percentage;
            }

            $finalScore = round(($tugas * 0.30) + ($uts * 0.30) + ($uas * 0.40), 2);

            $letterGrade = 'C';
            if ($finalScore >= 89.00) {
                $letterGrade = 'A';
            } elseif ($finalScore >= 78.00) {
                $letterGrade = 'B';
            } elseif ($finalScore >= 65.00) {
                $letterGrade = 'C';
            } else {
                $letterGrade = 'D';
            }

            DB::table('student_grades')->updateOrInsert(
                [
                    'student_id' => $attempt->student_id,
                    'teacher_subject_id' => $teacherSubject->id,
                    'academic_year_id' => $exam->academic_year_id,
                ],
                [
                    'grade_type' => $category,
                    'tugas_avg' => $tugas,
                    'uts_score' => $uts,
                    'uas_score' => $uas,
                    'final_score' => $finalScore,
                    'letter_grade' => $letterGrade,
                    'exam_id' => $exam->id,
                    'updated_at' => now(),
                ]
            );
        }
    }
}
