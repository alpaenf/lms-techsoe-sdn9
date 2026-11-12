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
use App\Services\ExamWordExportService;
use App\Services\ReligionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ExamController extends Controller
{
    protected function getTeacher(): ?Teacher
    {
        $user = auth()->user();
        if (! $user) {
            return null;
        }

        $teacher = Teacher::where('user_id', $user->id)->first();
        if (! $teacher && in_array($user->role, ['guru', 'guru_mapel'])) {
            $teacher = Teacher::create([
                'user_id' => $user->id,
                'full_name' => $user->name,
                'teacher_type' => $user->role === 'guru_mapel' ? 'guru_mapel' : 'guru_kelas',
            ]);
        }

        return $teacher;
    }

    public function index()
    {
        $user = auth()->user();
        $teacher = $this->getTeacher();

        $exams = Exam::with(['subject', 'class', 'academicYear', 'questions', 'teacher.user'])
            ->when($teacher && $user->role !== 'admin' && $user->role !== 'pimpinan', function ($q) use ($teacher) {
                $q->where(function ($sub) use ($teacher) {
                    $sub->where('teacher_id', $teacher->id)
                        ->orWhere(function ($us) use ($teacher) {
                            $us->where('exam_category', 'ujian_sekolah')
                                ->where(function ($c) use ($teacher) {
                                    $c->whereNull('class_id')
                                        ->orWhereHas('class', fn ($cl) => $cl->where('grade_level', 6));
                                });
                        });
                });
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
        $teacher = $this->getTeacher();

        $subjects = Subject::all();
        $classes = Classes::with('homeroomTeacher')->orderBy('grade_level')->orderBy('name')->get();

        return Inertia::render('Exams/Create', [
            'subjects' => $subjects,
            'classes' => $classes,
            'teacher' => $teacher,
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        $teacher = $this->getTeacher();

        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'class_id' => 'nullable|exists:classes,id',
            'class_ids' => 'nullable|array',
            'class_ids.*' => 'exists:classes,id',
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
            'questions.*.type' => 'required|in:multiple_choice,pgk_mcma,pgk_kategori,short_answer,essay',
            'questions.*.text' => 'required|string',
            'questions.*.options' => 'nullable',
            'questions.*.correct_answer' => 'required_unless:questions.*.type,essay',
            'questions.*.points' => 'required|integer|min:1',
        ]);

        $teacherId = $teacher ? $teacher->id : Teacher::first()?->id ?? 1;
        $academicYearId = DB::table('academic_years')->where('is_active', true)->value('id') ?? 1;

        $validated['teacher_id'] = $teacherId;
        $validated['academic_year_id'] = $academicYearId;

        $classIds = [];
        if ($request->has('class_ids') && is_array($request->input('class_ids'))) {
            $classIds = array_values(array_filter($request->input('class_ids')));
        } elseif (! empty($validated['class_id'])) {
            $classIds = [$validated['class_id']];
        }

        $validated['class_id'] = ! empty($classIds) ? $classIds[0] : null;

        $exam = Exam::create($validated);
        if (! empty($classIds)) {
            $exam->classes()->sync($classIds);
        }

        $exam->load('subject');

        if ($request->has('questions')) {
            foreach ($request->questions as $index => $q) {
                ExamQuestion::create([
                    'exam_id' => $exam->id,
                    'question_type' => $q['type'],
                    'question_text' => $q['text'],
                    'question_image' => $q['image'] ?? null,
                    'options' => $q['options'] ?? null,
                    'option_images' => $q['option_images'] ?? null,
                    'correct_answer' => $q['correct_answer'] ?? null,
                    'points' => $q['points'] ?? 10,
                    'order_number' => $index + 1,
                ]);
            }
        }

        return redirect()->route('exams.show', $exam->id)
            ->with('success', 'Ujian berhasil dibuat. Silakan tambahkan butir-butir soal.');
    }

    public function show(Exam $exam)
    {
        $exam->load(['subject', 'class', 'classes', 'academicYear', 'teacher', 'questions']);

        $attemptsCount = $exam->attempts()->count();
        $completedCount = $exam->attempts()->where('status', 'graded')->count();
        $avgScore = $exam->attempts()->where('status', 'graded')->avg('percentage');

        // Daftar ujian lain dengan mapel yang sama yang memiliki soal (untuk fitur salin bank soal paralel)
        $parallelExams = Exam::where('id', '!=', $exam->id)
            ->where('subject_id', $exam->subject_id)
            ->with(['classes', 'class'])
            ->withCount('questions')
            ->having('questions_count', '>', 0)
            ->orderBy('created_at', 'desc')
            ->get(['id', 'title', 'class_id', 'created_at']);

        return Inertia::render('Exams/Show', [
            'exam' => $exam,
            'parallelExams' => $parallelExams,
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
        $exam->load(['questions', 'classes']);
        $subjects = Subject::all();
        $classes = Classes::orderBy('grade_level')->orderBy('name')->get();

        return Inertia::render('Exams/Edit', [
            'exam' => $exam,
            'subjects' => $subjects,
            'classes' => $classes,
        ]);
    }

    public function update(Request $request, Exam $exam)
    {
        $validated = $request->validate([
            'subject_id' => 'sometimes|required|exists:subjects,id',
            'class_id' => 'nullable|exists:classes,id',
            'class_ids' => 'nullable|array',
            'class_ids.*' => 'exists:classes,id',
            'exam_category' => 'sometimes|required|in:uts,uas,ulangan_harian,ujian_sekolah,kuis',
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

        if ($request->has('class_ids')) {
            $classIds = array_values(array_filter($request->input('class_ids', [])));
            $validated['class_id'] = ! empty($classIds) ? $classIds[0] : null;
            $exam->classes()->sync($classIds);
        } elseif (array_key_exists('class_id', $validated)) {
            $validated['class_id'] = ! empty($validated['class_id']) ? $validated['class_id'] : null;
            $exam->classes()->sync($validated['class_id'] ? [$validated['class_id']] : []);
        }

        $exam->update($validated);

        return redirect()->route('exams.show', $exam->id)
            ->with('success', 'Pengaturan ujian berhasil diperbarui.');
    }

    public function destroy(Exam $exam)
    {
        AppNotification::where('type', 'exam')
            ->where('title', 'Ujian Baru: '.$exam->title)
            ->delete();

        $exam->delete();

        return redirect()->route('exams.index')
            ->with('success', 'Paket ujian berhasil dihapus.');
    }

    protected function storeUploadedFile(\Illuminate\Http\UploadedFile $file, string $directory): string
    {
        $ext = strtolower($file->getClientOriginalExtension());
        if (empty($ext)) {
            $clientMime = strtolower((string) $file->getClientMimeType());
            $ext = match ($clientMime) {
                'image/png' => 'png',
                'image/webp' => 'webp',
                'image/gif' => 'gif',
                'image/svg+xml' => 'svg',
                default => 'jpg'
            };
        }
        $filename = \Illuminate\Support\Str::random(40) . '.' . $ext;

        return $file->storeAs($directory, $filename, 'public');
    }

    protected function getImageValidationRule(bool $required = false): array
    {
        $rules = [
            $required ? 'required' : 'nullable',
            'max:10240',
            function ($attribute, $value, $fail) {
                if (! $value instanceof \Illuminate\Http\UploadedFile) {
                    return;
                }
                if (! $value->isValid()) {
                    $fail('Berkas yang diunggah gagal diproses atau rusak.');

                    return;
                }
                $extension = strtolower($value->getClientOriginalExtension());
                $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg', 'jfif', 'avif', 'heic', 'heif', 'tif', 'tiff'];

                $clientMime = strtolower((string) $value->getClientMimeType());
                $mime = '';
                try {
                    if (function_exists('finfo_open')) {
                        $mime = strtolower((string) @$value->getMimeType());
                    }
                } catch (\Throwable $e) {
                    $mime = '';
                }

                $isImageMime = ($mime && str_starts_with($mime, 'image/')) || ($clientMime && str_starts_with($clientMime, 'image/'));

                if (! in_array($extension, $allowedExtensions, true) && ! $isImageMime) {
                    $fail('Berkas yang diunggah harus berupa format foto/gambar (JPG, JPEG, PNG, WEBP, GIF, dll).');
                }
            },
        ];

        return $rules;
    }

    public function addQuestion(Request $request, Exam $exam)
    {
        $validated = $request->validate([
            'question_type' => 'required|in:multiple_choice,pgk_mcma,pgk_kategori,short_answer,essay',
            'question_text' => 'nullable|string',
            'question_image' => 'nullable|string',
            'question_image_file' => $this->getImageValidationRule(),
            'question_image_files' => 'nullable|array',
            'question_image_files.*' => $this->getImageValidationRule(),
            'existing_question_images' => 'nullable',
            'image_alignment' => 'nullable|in:left,center,right',
            'image_position' => 'nullable|in:bottom,top,middle',
            'options' => 'nullable',
            'option_image_files' => 'nullable|array',
            'option_image_files.*' => $this->getImageValidationRule(),
            'correct_answer' => 'required_unless:question_type,essay',
            'points' => 'required|integer|min:1',
        ]);

        if (isset($validated['options']) && is_string($validated['options'])) {
            $decodedOptions = json_decode($validated['options'], true);
            if (is_array($decodedOptions)) {
                $validated['options'] = $decodedOptions;
            }
        }

        if (isset($validated['correct_answer']) && is_array($validated['correct_answer'])) {
            $validated['correct_answer'] = json_encode($validated['correct_answer']);
        }

        $questionImages = [];

        if ($request->has('existing_question_images')) {
            $existing = is_string($request->input('existing_question_images'))
                ? json_decode($request->input('existing_question_images'), true)
                : $request->input('existing_question_images');
            if (is_array($existing)) {
                foreach ($existing as $p) {
                    if (! empty($p) && Storage::disk('public')->exists($p)) {
                        $questionImages[] = $p;
                    }
                }
            }
        }

        if ($request->hasFile('question_image_file')) {
            $path = $this->storeUploadedFile($request->file('question_image_file'), 'exam-questions');
            $questionImages[] = $path;
        }

        if ($request->hasFile('question_image_files')) {
            foreach ($request->file('question_image_files') as $file) {
                if ($file && $file->isValid()) {
                    $path = $this->storeUploadedFile($file, 'exam-questions');
                    $questionImages[] = $path;
                }
            }
        }

        if (empty($questionImages) && ! empty($validated['question_image'])) {
            $questionImages[] = $validated['question_image'];
        }

        $validated['question_images'] = ! empty($questionImages) ? array_values(array_unique($questionImages)) : null;
        $validated['question_image'] = ! empty($questionImages) ? $questionImages[0] : null;

        $hasText = ! empty(trim((string) ($validated['question_text'] ?? '')));
        $hasImage = ! empty($questionImages);

        if (! $hasText && ! $hasImage) {
            return back()->withErrors(['question_text' => 'Teks pertanyaan atau gambar soal wajib diisi.']);
        }

        if (! $hasText) {
            $validated['question_text'] = '(Lihat gambar soal)';
        }

        $validated['image_alignment'] = $validated['image_alignment'] ?? 'center';
        $validated['image_position'] = $validated['image_position'] ?? 'bottom';

        $optionImages = [];
        if ($request->hasFile('option_image_files')) {
            foreach ($request->file('option_image_files') as $optKey => $file) {
                if ($file && $file->isValid()) {
                    $path = $this->storeUploadedFile($file, 'exam-options');
                    $optionImages[$optKey] = $path;
                }
            }
        }
        $validated['option_images'] = ! empty($optionImages) ? $optionImages : null;

        $lastOrder = $exam->questions()->max('order_number') ?? 0;
        $validated['exam_id'] = $exam->id;
        $validated['order_number'] = $lastOrder + 1;

        ExamQuestion::create($validated);

        return back()->with('success', 'Butir soal berhasil ditambahkan.');
    }

    public function updateQuestion(Request $request, ExamQuestion $question)
    {
        $validated = $request->validate([
            'question_type' => 'nullable|in:multiple_choice,pgk_mcma,pgk_kategori,short_answer,essay',
            'question_text' => 'nullable|string',
            'question_image' => 'nullable|string',
            'question_image_file' => $this->getImageValidationRule(),
            'question_image_files' => 'nullable|array',
            'question_image_files.*' => $this->getImageValidationRule(),
            'existing_question_images' => 'nullable',
            'image_alignment' => 'nullable|in:left,center,right',
            'image_position' => 'nullable|in:bottom,top,middle',
            'remove_question_image' => 'nullable',
            'options' => 'nullable',
            'option_image_files' => 'nullable|array',
            'option_image_files.*' => $this->getImageValidationRule(),
            'existing_option_images' => 'nullable|array',
            'remove_option_images' => 'nullable|array',
            'correct_answer' => 'required_unless:question_type,essay',
            'points' => 'required|integer|min:1',
        ]);

        if (isset($validated['options']) && is_string($validated['options'])) {
            $decodedOptions = json_decode($validated['options'], true);
            if (is_array($decodedOptions)) {
                $validated['options'] = $decodedOptions;
            }
        }

        if (isset($validated['correct_answer']) && is_array($validated['correct_answer'])) {
            $validated['correct_answer'] = json_encode($validated['correct_answer']);
        }

        $oldImages = $question->getAllImages();
        $updatedImages = [];

        if ($request->filled('remove_question_image') && $request->input('remove_question_image') !== '0') {
            foreach ($oldImages as $oldImg) {
                if ($oldImg && Storage::disk('public')->exists($oldImg)) {
                    Storage::disk('public')->delete($oldImg);
                }
            }
            $updatedImages = [];
        } else {
            $keptExisting = [];
            if ($request->has('existing_question_images')) {
                $rawExisting = is_string($request->input('existing_question_images'))
                    ? json_decode($request->input('existing_question_images'), true)
                    : $request->input('existing_question_images');
                if (is_array($rawExisting)) {
                    foreach ($rawExisting as $p) {
                        if (! empty($p) && Storage::disk('public')->exists($p)) {
                            $keptExisting[] = $p;
                        }
                    }
                }
            } elseif (! empty($question->question_image)) {
                $keptExisting = $oldImages;
            }

            foreach ($oldImages as $oldImg) {
                if (! in_array($oldImg, $keptExisting, true)) {
                    if ($oldImg && Storage::disk('public')->exists($oldImg)) {
                        Storage::disk('public')->delete($oldImg);
                    }
                }
            }

            $updatedImages = $keptExisting;

            if ($request->hasFile('question_image_file')) {
                $path = $this->storeUploadedFile($request->file('question_image_file'), 'exam-questions');
                $updatedImages[] = $path;
            }

            if ($request->hasFile('question_image_files')) {
                foreach ($request->file('question_image_files') as $file) {
                    if ($file && $file->isValid()) {
                        $path = $this->storeUploadedFile($file, 'exam-questions');
                        $updatedImages[] = $path;
                    }
                }
            }
        }

        $validated['question_images'] = ! empty($updatedImages) ? array_values(array_unique($updatedImages)) : null;
        $validated['question_image'] = ! empty($updatedImages) ? $updatedImages[0] : null;

        $hasText = ! empty(trim((string) ($validated['question_text'] ?? '')));
        $hasImage = ! empty($updatedImages);

        if (! $hasText && ! $hasImage) {
            return back()->withErrors(['question_text' => 'Teks pertanyaan atau gambar soal wajib diisi.']);
        }

        if (! $hasText) {
            $validated['question_text'] = '(Lihat gambar soal)';
        }

        if (! array_key_exists('image_alignment', $validated) || empty($validated['image_alignment'])) {
            $validated['image_alignment'] = $question->image_alignment ?? 'center';
        }
        if (! array_key_exists('image_position', $validated) || empty($validated['image_position'])) {
            $validated['image_position'] = $question->image_position ?? 'bottom';
        }

        $currentOptionImages = $question->option_images ?? [];

        if ($request->has('existing_option_images') && is_array($request->input('existing_option_images'))) {
            $submittedExisting = $request->input('existing_option_images');
            $newImages = [];
            foreach ($submittedExisting as $k => $imgPath) {
                if (! empty($imgPath) && Storage::disk('public')->exists($imgPath)) {
                    $newImages[$k] = $imgPath;
                }
            }
            // Hapus file gambar lama yang tidak dipertahankan lagi
            foreach ($currentOptionImages as $oldKey => $oldPath) {
                if (! in_array($oldPath, $newImages, true)) {
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                    }
                }
            }
            $currentOptionImages = $newImages;
        }

        if ($request->has('remove_option_images') && is_array($request->remove_option_images)) {
            foreach ($request->remove_option_images as $optKey => $shouldRemove) {
                if (! empty($shouldRemove) && $shouldRemove !== '0' && ! empty($currentOptionImages[$optKey])) {
                    if (Storage::disk('public')->exists($currentOptionImages[$optKey])) {
                        Storage::disk('public')->delete($currentOptionImages[$optKey]);
                    }
                    unset($currentOptionImages[$optKey]);
                }
            }
        }

        if ($request->hasFile('option_image_files')) {
            foreach ($request->file('option_image_files') as $optKey => $file) {
                if ($file && $file->isValid()) {
                    if (! empty($currentOptionImages[$optKey]) && Storage::disk('public')->exists($currentOptionImages[$optKey])) {
                        Storage::disk('public')->delete($currentOptionImages[$optKey]);
                    }
                    $path = $this->storeUploadedFile($file, 'exam-options');
                    $currentOptionImages[$optKey] = $path;
                }
            }
        }

        if (is_array($validated['options'] ?? null) && is_array($currentOptionImages)) {
            $validKeys = [];
            if (isset($validated['options']['rows']) && is_array($validated['options']['rows'])) {
                foreach ($validated['options']['rows'] as $r) {
                    if (isset($r['id'])) {
                        $validKeys[] = (string) $r['id'];
                    }
                }
            } else {
                $validKeys = array_map('strval', array_keys($validated['options']));
            }

            foreach (array_keys($currentOptionImages) as $imgKey) {
                if (! in_array((string) $imgKey, $validKeys, true)) {
                    if (Storage::disk('public')->exists($currentOptionImages[$imgKey])) {
                        Storage::disk('public')->delete($currentOptionImages[$imgKey]);
                    }
                    unset($currentOptionImages[$imgKey]);
                }
            }
        }

        $validated['option_images'] = ! empty($currentOptionImages) ? $currentOptionImages : null;

        $question->update($validated);

        return back()->with('success', 'Butir soal berhasil diperbarui.');
    }

    public function copyQuestions(Request $request, Exam $exam)
    {
        $validated = $request->validate([
            'source_exam_id' => 'required|exists:exams,id',
            'mode' => 'nullable|in:append,replace',
        ]);

        $sourceExam = Exam::with('questions')->findOrFail($validated['source_exam_id']);
        if ($sourceExam->questions->isEmpty()) {
            return back()->with('error', 'Ujian sumber tidak memiliki butir soal untuk disalin.');
        }

        DB::transaction(function () use ($exam, $sourceExam, $validated) {
            $startOrder = 0;
            if (($validated['mode'] ?? 'append') === 'replace') {
                foreach ($exam->questions as $oldQ) {
                    $oldQ->delete();
                }
            } else {
                $startOrder = $exam->questions()->max('order_number') ?? 0;
            }

            foreach ($sourceExam->questions as $index => $q) {
                ExamQuestion::create([
                    'exam_id' => $exam->id,
                    'question_type' => $q->question_type,
                    'question_text' => $q->question_text,
                    'question_image' => $q->question_image,
                    'question_images' => $q->question_images,
                    'image_alignment' => $q->image_alignment ?? 'center',
                    'image_position' => $q->image_position ?? 'bottom',
                    'options' => $q->options,
                    'option_images' => $q->option_images,
                    'correct_answer' => $q->correct_answer,
                    'points' => $q->points,
                    'order_number' => $startOrder + $index + 1,
                ]);
            }
        });

        return back()->with('success', 'Berhasil menyalin '.$sourceExam->questions->count().' butir soal dari "'.$sourceExam->title.'".');
    }

    public function printView(Exam $exam)
    {
        $exam->load(['subject', 'class', 'classes', 'academicYear', 'teacher.user', 'questions' => function ($q) {
            $q->orderBy('order_number', 'asc');
        }]);

        $schoolProfile = DB::table('school_profiles')->first();

        return Inertia::render('Exams/Print', [
            'exam' => $exam,
            'schoolProfile' => $schoolProfile,
        ]);
    }

    public function exportWord(Exam $exam, ExamWordExportService $exportService)
    {
        $exam->load(['subject', 'class', 'classes', 'academicYear', 'teacher.user', 'questions' => function ($q) {
            $q->orderBy('order_number', 'asc');
        }]);

        $filePath = $exportService->generate($exam);
        $filename = 'Naskah_Soal_'.\Illuminate\Support\Str::slug($exam->title).'.docx';

        return response()->download($filePath, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ])->deleteFileAfterSend(true);
    }

    public function deleteQuestion(ExamQuestion $question)
    {
        foreach ($question->getAllImages() as $path) {
            if ($path && Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
        }
        if (! empty($question->option_images) && is_array($question->option_images)) {
            foreach ($question->option_images as $path) {
                if ($path && Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
            }
        }

        $question->delete();

        return back()->with('success', 'Butir soal berhasil dihapus.');
    }

    public function uploadQuestionImage(Request $request, ExamQuestion $question)
    {
        $request->validate([
            'image' => $this->getImageValidationRule(true),
        ]);

        if ($question->question_image && Storage::disk('public')->exists($question->question_image)) {
            Storage::disk('public')->delete($question->question_image);
        }

        $path = $this->storeUploadedFile($request->file('image'), 'exam-questions');
        $question->update(['question_image' => $path]);

        return back()->with('success', 'Gambar soal berhasil diunggah.');
    }

    public function publish(Exam $exam)
    {
        if ($exam->questions()->count() === 0) {
            return back()->with('error', 'Tidak dapat menerbitkan ujian tanpa butir soal.');
        }

        $exam->update(['status' => 'published']);

        $this->notifyEligibleStudents($exam);

        return back()->with('success', 'Ujian berhasil diterbitkan.');
    }

    /**
     * Kirim notifikasi ujian baru hanya kepada siswa yang berhak/ditargetkan.
     */
    protected function notifyEligibleStudents(Exam $exam): void
    {
        if ($exam->status !== 'published') {
            return;
        }

        $exam->loadMissing(['subject', 'class', 'classes']);

        $assignedClassIds = $exam->assignedClassIds();

        $studentsQuery = Student::query()
            ->whereNotNull('user_id')
            ->with('class');

        if (! empty($assignedClassIds)) {
            // Ujian khusus untuk rombel tertentu (satu atau beberapa paralel)
            $studentsQuery->whereIn('class_id', $assignedClassIds);
        } elseif ($exam->exam_category === 'ujian_sekolah') {
            // Ujian Sekolah khusus untuk seluruh siswa Kelas 6 (Kelas Akhir)
            $studentsQuery->whereHas('class', fn ($c) => $c->where('grade_level', 6));
        } else {
            // Jangan broadcast ke seluruh siswa jika tanpa rombel target dan bukan ujian sekolah
            return;
        }

        $students = $studentsQuery->get();

        // Validasi kesesuaian agama jika mata pelajaran terkait keagamaan
        $subjRel = ReligionService::getSubjectReligion($exam->subject);
        if ($subjRel) {
            $students = $students->filter(function ($student) use ($subjRel) {
                return ReligionService::studentCanAccessSubject($student->religion, $subjRel);
            });
        }

        if ($students->isEmpty()) {
            return;
        }

        $targetUserIds = $students->pluck('user_id')->unique()->filter()->values();

        // Cegah duplikasi notifikasi untuk ujian yang sama
        $existingNotified = AppNotification::where('type', 'exam')
            ->where('title', 'Ujian Baru: '.$exam->title)
            ->whereIn('user_id', $targetUserIds)
            ->pluck('user_id')
            ->all();

        $newUserIds = $targetUserIds->diff($existingNotified);

        if ($newUserIds->isEmpty()) {
            return;
        }

        $now = now();
        $records = [];
        $subjectName = $exam->subject?->name ?? 'Mata Pelajaran';

        foreach ($newUserIds as $userId) {
            $records[] = [
                'user_id' => $userId,
                'role' => 'siswa',
                'title' => 'Ujian Baru: '.$exam->title,
                'message' => 'Ujian baru telah diterbitkan untuk mata pelajaran '.$subjectName.'.',
                'type' => 'exam',
                'link' => route('student.exams.index'),
                'is_read' => false,
                'read_at' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        AppNotification::insert($records);
    }

    public function close(Exam $exam)
    {
        $exam->update(['status' => 'closed']);

        return back()->with('success', 'Ujian berhasil ditutup.');
    }

    public function monitor(Exam $exam)
    {
        $exam->load(['subject', 'class', 'classes', 'questions']);

        $assignedClassIds = $exam->assignedClassIds();

        $studentsQuery = Student::with('class');
        if (! empty($assignedClassIds)) {
            $studentsQuery->whereIn('class_id', $assignedClassIds);
        } elseif ($exam->exam_category === 'ujian_sekolah') {
            $studentsQuery->whereHas('class', fn ($c) => $c->where('grade_level', 6));
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
                    'class_name' => $student->class?->name ?? 'Kelas 6',
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
        $exam->load(['subject', 'class', 'classes', 'questions']);

        $attempts = StudentExamAttempt::where('exam_id', $exam->id)
            ->with(['student.class', 'answers.question'])
            ->whereIn('status', ['submitted', 'graded'])
            ->orderBy('percentage', 'desc')
            ->get();

        $assignedClassIds = $exam->assignedClassIds();

        $studentsCount = ! empty($assignedClassIds)
            ? Student::whereIn('class_id', $assignedClassIds)->count()
            : ($exam->exam_category === 'ujian_sekolah'
                ? Student::whereHas('class', fn ($c) => $c->where('grade_level', 6))->count()
                : Student::count());

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
        $studentClassId = $attempt->student?->class_id ?? $exam->class_id;

        $teacherSubject = DB::table('teacher_subjects')
            ->where('subject_id', $exam->subject_id)
            ->where('academic_year_id', $exam->academic_year_id)
            ->when($studentClassId, fn ($q) => $q->where('class_id', $studentClassId))
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
