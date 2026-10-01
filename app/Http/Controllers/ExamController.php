<?php

namespace App\Http\Controllers;

use App\Models\AppNotification;
use App\Models\Classes;
use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Models\Student;
use App\Models\StudentAnswer;
use App\Models\StudentExamAttempt;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ExamController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $teacher = Teacher::where('user_id', $user->id)->first();

        $exams = Exam::with(['subject', 'class', 'academicYear', 'questions'])
            ->when($teacher && $user->role !== 'admin' && $user->role !== 'pimpinan', function ($q) use ($teacher) {
                $q->where('teacher_id', $teacher->id);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Exams/Index', [
            'exams' => $exams,
        ]);
    }

    public function create()
    {
        $user = auth()->user();
        $teacher = Teacher::where('user_id', $user->id)->first();

        $subjects = Subject::all();
        $classes = Classes::with('homeroomTeacher')->get();

        return Inertia::render('Exams/Create', [
            'subjects' => $subjects,
            'classes' => $classes,
            'teacher' => $teacher,
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        $teacher = Teacher::where('user_id', $user->id)->first();

        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'class_id' => 'nullable|exists:classes,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration_minutes' => 'required|integer|min:1|max:300',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'max_attempts' => 'required|integer|min:1|max:999',
            'randomize_questions' => 'boolean',
            'show_review' => 'boolean',
            'show_result_immediately' => 'boolean',
            'passing_score' => 'nullable|numeric|min:0|max:100',
            'exam_category' => 'required|in:uts,uas,ulangan_harian,ujian_sekolah,kuis',
            'questions' => 'nullable|array',
            'questions.*.type' => 'required|in:multiple_choice,short_answer,essay',
            'questions.*.text' => 'required|string',
            'questions.*.options' => 'required_if:questions.*.type,multiple_choice|array',
            'questions.*.correct_answer' => 'required_unless:questions.*.type,essay',
            'questions.*.points' => 'required|integer|min:1',
        ]);

        $teacherId = $teacher ? $teacher->id : Teacher::first()?->id ?? 1;
        $academicYearId = DB::table('academic_years')->where('is_active', true)->value('id') ?? 1;

        $validated['teacher_id'] = $teacherId;
        $validated['academic_year_id'] = $academicYearId;

        $exam = Exam::create($validated);
        $exam->load('subject');

        if ($request->has('questions')) {
            foreach ($request->questions as $index => $q) {
                ExamQuestion::create([
                    'exam_id' => $exam->id,
                    'question_type' => $q['type'],
                    'question_text' => $q['text'],
                    'question_image' => $q['image'] ?? null,
                    'options' => $q['options'] ?? null,
                    'correct_answer' => $q['correct_answer'] ?? null,
                    'points' => $q['points'] ?? 10,
                    'order_number' => $index + 1,
                ]);
            }
        }

        // Notify students
        AppNotification::create([
            'role' => 'siswa',
            'title' => 'Ujian Baru: '.$exam->title,
            'message' => 'Ujian baru telah diterbitkan untuk mata pelajaran '.($exam->subject?->name ?? 'Mata Pelajaran').'.',
            'type' => 'exam',
            'link' => route('student.exams.index'),
        ]);

        return redirect()->route('exams.show', $exam->id)
            ->with('success', 'Ujian berhasil dibuat. Silakan tambahkan butir-butir soal.');
    }

    public function show(Exam $exam)
    {
        $exam->load(['subject', 'class', 'academicYear', 'teacher', 'questions']);

        $attemptsCount = $exam->attempts()->count();
        $completedCount = $exam->attempts()->where('status', 'graded')->count();
        $avgScore = $exam->attempts()->where('status', 'graded')->avg('percentage');

        return Inertia::render('Exams/Show', [
            'exam' => $exam,
            'statistics' => [
                'total_attempts' => $attemptsCount,
                'completed' => $completedCount,
                'average_score' => round($avgScore ?? 0, 2),
                'total_questions' => $exam->questions->count(),
                'total_points' => $exam->totalPoints(),
            ],
        ]);
    }

    public function edit(Exam $exam)
    {
        $exam->load('questions');
        $subjects = Subject::all();
        $classes = Classes::all();

        return Inertia::render('Exams/Edit', [
            'exam' => $exam,
            'subjects' => $subjects,
            'classes' => $classes,
        ]);
    }

    public function update(Request $request, Exam $exam)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration_minutes' => 'required|integer|min:1|max:300',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'max_attempts' => 'required|integer|min:1|max:999',
            'randomize_questions' => 'boolean',
            'show_review' => 'boolean',
            'show_result_immediately' => 'boolean',
            'passing_score' => 'nullable|numeric|min:0|max:100',
        ]);

        $exam->update($validated);

        return redirect()->route('exams.show', $exam->id)
            ->with('success', 'Pengaturan ujian berhasil diperbarui.');
    }

    public function destroy(Exam $exam)
    {
        $exam->delete();

        return redirect()->route('exams.index')
            ->with('success', 'Paket ujian berhasil dihapus.');
    }

    public function addQuestion(Request $request, Exam $exam)
    {
        $validated = $request->validate([
            'question_type' => 'required|in:multiple_choice,short_answer,essay',
            'question_text' => 'required|string',
            'question_image' => 'nullable|string',
            'options' => 'required_if:question_type,multiple_choice|array',
            'correct_answer' => 'required_unless:question_type,essay',
            'points' => 'required|integer|min:1',
        ]);

        $lastOrder = $exam->questions()->max('order_number') ?? 0;
        $validated['exam_id'] = $exam->id;
        $validated['order_number'] = $lastOrder + 1;

        ExamQuestion::create($validated);

        return back()->with('success', 'Butir soal berhasil ditambahkan.');
    }

    public function updateQuestion(Request $request, ExamQuestion $question)
    {
        $validated = $request->validate([
            'question_text' => 'required|string',
            'question_image' => 'nullable|string',
            'options' => 'required_if:question_type,multiple_choice|array',
            'correct_answer' => 'required_unless:question_type,essay',
            'points' => 'required|integer|min:1',
        ]);

        $question->update($validated);

        return back()->with('success', 'Butir soal berhasil diperbarui.');
    }

    public function deleteQuestion(ExamQuestion $question)
    {
        $question->delete();

        return back()->with('success', 'Butir soal berhasil dihapus.');
    }

    public function uploadQuestionImage(Request $request, ExamQuestion $question)
    {
        $request->validate([
            'image' => 'required|image|max:2048',
        ]);

        $path = $request->file('image')->store('exam-questions', 'public');
        $question->update(['question_image' => $path]);

        return back()->with('success', 'Gambar soal berhasil diunggah.');
    }

    public function publish(Exam $exam)
    {
        if ($exam->questions()->count() === 0) {
            return back()->with('error', 'Tidak dapat menerbitkan ujian tanpa butir soal.');
        }

        $exam->update(['status' => 'published']);

        return back()->with('success', 'Ujian berhasil diterbitkan.');
    }

    public function close(Exam $exam)
    {
        $exam->update(['status' => 'closed']);

        return back()->with('success', 'Ujian berhasil ditutup.');
    }

    public function monitor(Exam $exam)
    {
        $exam->load(['subject', 'class', 'questions']);

        $studentsQuery = Student::query();
        if ($exam->class_id) {
            $studentsQuery->where('class_id', $exam->class_id);
        }

        $students = $studentsQuery->get()
            ->map(function ($student) use ($exam) {
                $attempt = StudentExamAttempt::where('exam_id', $exam->id)
                    ->where('student_id', $student->id)
                    ->orderBy('attempt_number', 'desc')
                    ->first();

                return [
                    'id' => $student->id,
                    'nis' => $student->nis,
                    'full_name' => $student->full_name,
                    'status' => $attempt ? $attempt->status : 'not_started',
                    'attempt_number' => $attempt?->attempt_number,
                    'progress' => $attempt ? $attempt->getAnsweredCount().'/'.$exam->questions->count() : '0/'.$exam->questions->count(),
                    'score' => $attempt?->percentage,
                    'started_at' => $attempt?->started_at,
                    'submitted_at' => $attempt?->submitted_at,
                ];
            });

        return Inertia::render('Exams/Monitor', [
            'exam' => $exam,
            'students' => $students,
        ]);
    }

    public function results(Exam $exam)
    {
        $exam->load(['subject', 'class', 'questions']);

        $attempts = StudentExamAttempt::where('exam_id', $exam->id)
            ->with(['student', 'answers.question'])
            ->whereIn('status', ['submitted', 'graded'])
            ->orderBy('percentage', 'desc')
            ->get();

        $studentsCount = $exam->class_id
            ? Student::where('class_id', $exam->class_id)->count()
            : Student::count();

        $statistics = [
            'total_students' => $studentsCount,
            'completed' => $attempts->count(),
            'average_score' => round($attempts->avg('percentage') ?? 0, 2),
            'highest_score' => $attempts->max('percentage') ?? 0,
            'lowest_score' => $attempts->min('percentage') ?? 0,
            'passed' => $attempts->where('percentage', '>=', $exam->passing_score)->count(),
            'failed' => $attempts->where('percentage', '<', $exam->passing_score)->count(),
        ];

        return Inertia::render('Exams/Results', [
            'exam' => $exam,
            'attempts' => $attempts,
            'statistics' => $statistics,
        ]);
    }

    public function gradeEssay(Request $request, StudentAnswer $answer)
    {
        $validated = $request->validate([
            'points_earned' => 'required|numeric|min:0|max:'.($answer->question?->points ?? 100),
            'feedback' => 'nullable|string',
        ]);

        $maxPoints = $answer->question?->points ?? 0;

        $answer->update([
            'is_correct' => $validated['points_earned'] == $maxPoints,
            'points_earned' => $validated['points_earned'],
            'feedback' => $validated['feedback'],
            'graded_at' => now(),
            'graded_by' => auth()->id(),
        ]);

        $attempt = $answer->attempt;
        $attempt->calculateScore();

        if ($attempt->isFullyGraded()) {
            $attempt->update(['status' => 'graded']);
            $this->syncToRapor($attempt);

            if ($attempt->student && $attempt->student->user_id) {
                AppNotification::create([
                    'user_id' => $attempt->student->user_id,
                    'title' => 'Jawaban Essay Ujian Dinilai',
                    'message' => 'Jawaban essay Anda pada ujian "'.($attempt->exam->title ?? 'Ujian').'" telah dinilai (Nilai Akhir: '.number_format($attempt->percentage, 1).').',
                    'type' => 'grade',
                    'link' => route('student.exams.result', $attempt->id),
                ]);
            }
        }

        return back()->with('success', 'Nilai essay berhasil disimpan.');
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

    public function exportResults(Exam $exam)
    {
        return back()->with('info', 'Fitur unduh leger nilai akan segera tersedia.');
    }
}
