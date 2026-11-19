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
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Csv;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

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
        $filename = \Illuminate\Support\Str::random(40).'.'.$ext;

        try {
            $storedPath = $file->storeAs($directory, $filename, 'public');
            if ($storedPath) {
                return $storedPath;
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('storeAs public disk failed, fallback to direct storage: '.$e->getMessage());
        }

        // Direct storage fallback if Flysystem / Storage disk fails
        $cleanDir = trim(str_replace(['\\', '/'], DIRECTORY_SEPARATOR, $directory), DIRECTORY_SEPARATOR);
        $targetDir = storage_path('app'.DIRECTORY_SEPARATOR.'public'.DIRECTORY_SEPARATOR.$cleanDir);
        if (! is_dir($targetDir)) {
            @mkdir($targetDir, 0755, true);
        }
        $file->move($targetDir, $filename);

        return trim(str_replace('\\', '/', $cleanDir), '/').'/'.$filename;
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

        if ($request->hasFile('question_image_files')) {
            foreach ($request->file('question_image_files') as $file) {
                if ($file && $file->isValid()) {
                    $path = $this->storeUploadedFile($file, 'exam-questions');
                    $questionImages[] = $path;
                }
            }
        } elseif ($request->hasFile('question_image_file')) {
            $path = $this->storeUploadedFile($request->file('question_image_file'), 'exam-questions');
            $questionImages[] = $path;
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

            if ($request->hasFile('question_image_files')) {
                foreach ($request->file('question_image_files') as $file) {
                    if ($file && $file->isValid()) {
                        $path = $this->storeUploadedFile($file, 'exam-questions');
                        $updatedImages[] = $path;
                    }
                }
            } elseif ($request->hasFile('question_image_file')) {
                $path = $this->storeUploadedFile($request->file('question_image_file'), 'exam-questions');
                $updatedImages[] = $path;
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

        $totalExamPoints = (float) $exam->totalPoints();
        if ($totalExamPoints <= 0 && $exam->total_points > 0) {
            $totalExamPoints = (float) $exam->total_points;
        }

        $totalQuestions = $exam->questions->count();
        $attempts->transform(function ($att) use ($totalQuestions, $totalExamPoints) {
            $answers = $att->answers;
            $correctCount = $answers->where('is_correct', true)->count();
            $wrongCount = $answers->where('is_correct', false)->count();
            $essayAnswers = $answers->filter(fn ($a) => $a->question?->question_type === 'essay');
            $hasEssay = $essayAnswers->isNotEmpty();
            $ungradedEssayCount = $essayAnswers->whereNull('is_correct')->count();
            $answeredCount = $answers->whereNotNull('answer_text')->filter(fn ($a) => $a->answer_text !== '')->count();

            $earnedPoints = (float) $answers->sum('points_earned');
            $calculatedPercentage = $totalExamPoints > 0 ? round(($earnedPoints / $totalExamPoints) * 100, 1) : 0;

            $att->total_score = $earnedPoints;
            $att->percentage = $calculatedPercentage;
            $att->total_questions = $totalQuestions;
            $att->correct_count = $correctCount;
            $att->wrong_count = $wrongCount;
            $att->unanswered_count = max(0, $totalQuestions - $answeredCount);
            $att->has_essay = $hasEssay;
            $att->ungraded_essay_count = $ungradedEssayCount;
            $att->earned_points = $earnedPoints;
            $att->total_possible_points = $totalExamPoints;

            return $att;
        });

        $attempts = $attempts->sortByDesc('percentage')->values();

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
            'passed' => $attempts->where('percentage', '>=', (float) $exam->passing_score)->count(),
            'failed' => $attempts->where('percentage', '<', (float) $exam->passing_score)->count(),
        ];

        return Inertia::render('Exams/Results', [
            'exam' => $exam,
            'attempts' => $attempts,
            'statistics' => $statistics,
        ]);
    }

    public function reviewAttempt(Exam $exam, StudentExamAttempt $attempt)
    {
        if ($attempt->exam_id !== $exam->id) {
            abort(404);
        }

        $exam->load(['subject', 'class', 'classes', 'academicYear', 'teacher.user']);
        $attempt->load(['student.class', 'answers.question']);

        $order = $attempt->question_order ?? [];
        if (! empty($order)) {
            $questions = $exam->questions()
                ->whereIn('id', $order)
                ->get()
                ->sortBy(function ($q) use ($order) {
                    $pos = array_search($q->id, $order);
                    return $pos === false ? 999999 : $pos;
                })
                ->values();
        } else {
            $questions = $exam->questions()->orderBy('order_number')->get();
        }

        $totalExamPossiblePoints = (float) $exam->totalPoints();
        if ($totalExamPossiblePoints <= 0 && $exam->total_points > 0) {
            $totalExamPossiblePoints = (float) $exam->total_points;
        }

        $studentList = StudentExamAttempt::where('exam_id', $exam->id)
            ->whereIn('status', ['submitted', 'graded'])
            ->with(['student.class', 'answers'])
            ->get()
            ->map(function ($att) use ($totalExamPossiblePoints) {
                $earned = (float) $att->answers->sum('points_earned');
                $calcPct = $totalExamPossiblePoints > 0 ? round(($earned / $totalExamPossiblePoints) * 100, 1) : round((float) $att->percentage, 1);
                $att->dynamic_percentage = $calcPct;
                return $att;
            })
            ->sortByDesc('dynamic_percentage')
            ->values()
            ->map(function ($att, $idx) use ($exam) {
                return [
                    'id' => $att->id,
                    'rank' => $idx + 1,
                    'student_id' => $att->student_id,
                    'full_name' => $att->student?->full_name ?? '-',
                    'nis' => $att->student?->nis ?? '-',
                    'class_name' => $att->student?->class?->name ?? 'Kelas',
                    'percentage' => $att->dynamic_percentage,
                    'is_passed' => $att->dynamic_percentage >= (float) $exam->passing_score,
                ];
            });

        $answers = $attempt->answers->keyBy('question_id');
        $totalQuestions = $questions->count();
        $correctCount = 0;
        $wrongCount = 0;
        $unansweredCount = 0;
        $essayCount = 0;
        $ungradedEssayCount = 0;
        $totalPointsEarned = 0;
        $totalPossiblePoints = 0;

        foreach ($questions as $q) {
            $totalPossiblePoints += (float) $q->points;
            $ans = $answers->get($q->id);
            $hasAnswerText = $ans && $ans->answer_text !== null && $ans->answer_text !== '';

            if (! $hasAnswerText) {
                $unansweredCount++;
            }

            if ($q->question_type === 'essay') {
                $essayCount++;
                if (! $ans || $ans->is_correct === null) {
                    $ungradedEssayCount++;
                }
            } else {
                if ($ans && $ans->is_correct === true) {
                    $correctCount++;
                } elseif ($ans && $ans->is_correct === false) {
                    $wrongCount++;
                }
            }

            if ($ans) {
                $totalPointsEarned += (float) ($ans->points_earned ?? 0);
            }
        }

        $finalPossiblePoints = $totalPossiblePoints > 0 ? $totalPossiblePoints : $totalExamPossiblePoints;
        $calculatedScore = $finalPossiblePoints > 0 ? round(($totalPointsEarned / $finalPossiblePoints) * 100, 1) : 0;
        $attempt->percentage = $calculatedScore;
        $attempt->total_score = $totalPointsEarned;

        $statistics = [
            'total_questions' => $totalQuestions,
            'correct_count' => $correctCount,
            'wrong_count' => $wrongCount,
            'unanswered_count' => $unansweredCount,
            'essay_count' => $essayCount,
            'ungraded_essay_count' => $ungradedEssayCount,
            'total_points_earned' => $totalPointsEarned,
            'total_possible_points' => $finalPossiblePoints,
            'score' => $calculatedScore,
            'is_passed' => $calculatedScore >= (float) $exam->passing_score,
        ];

        return Inertia::render('Exams/Review', [
            'exam' => $exam,
            'attempt' => $attempt,
            'questions' => $questions,
            'answers' => $answers,
            'studentList' => $studentList,
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
        $exam->loadMissing(['subject', 'class', 'classes', 'academicYear', 'teacher.user', 'questions']);

        $totalExamPoints = (float) $exam->totalPoints();
        if ($totalExamPoints <= 0 && $exam->total_points > 0) {
            $totalExamPoints = (float) $exam->total_points;
        }

        $examQuestions = $exam->questions;
        $totalQuestionsCount = $examQuestions->count();
        $mcCount = $examQuestions->where('question_type', 'multiple_choice')->count();
        $pgkCount = $examQuestions->whereIn('question_type', ['pgk_mcma', 'pgk_kategori'])->count();
        $shortCount = $examQuestions->where('question_type', 'short_answer')->count();
        $essayCount = $examQuestions->where('question_type', 'essay')->count();

        $attempts = StudentExamAttempt::where('exam_id', $exam->id)
            ->whereIn('status', ['submitted', 'graded'])
            ->with(['student.class', 'answers.question'])
            ->get()
            ->map(function ($att) use ($totalExamPoints) {
                $answers = $att->answers;
                $earnedPoints = (float) $answers->sum('points_earned');
                $calcPct = $totalExamPoints > 0 ? round(($earnedPoints / $totalExamPoints) * 100, 1) : round((float) $att->percentage, 1);
                $att->dynamic_score = $earnedPoints;
                $att->dynamic_percentage = $calcPct;

                return $att;
            })
            ->sortByDesc('dynamic_percentage')
            ->values();

        $schoolProfile = DB::table('school_profiles')->first();
        $schoolName = strtoupper($schoolProfile?->school_name ?? 'UPT SDN 9 GANDANGBATU SILLANAN');
        $principalName = $schoolProfile?->principal_name ?? 'Hendrika Genti, S.Pd.SD.';
        $principalNip = $schoolProfile?->principal_nip ?? '198502012010012025';

        $teacherName = $exam->teacher?->full_name ?? ($exam->teacher?->user?->name ?? 'Guru Pengampu');
        $teacherNip = $exam->teacher?->nip ?? '-';

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Leger Nilai Ujian');

        $sheet->getPageSetup()->setOrientation(\PhpOffice\PhpSpreadsheet\Worksheet\PageSetup::ORIENTATION_LANDSCAPE);
        $sheet->getPageSetup()->setPaperSize(\PhpOffice\PhpSpreadsheet\Worksheet\PageSetup::PAPERSIZE_A4);

        // Header Title
        $sheet->setCellValue('A1', 'PEMERINTAH KABUPATEN TANA TORAJA');
        $sheet->setCellValue('A2', 'DINAS PENDIDIKAN DAN KEBUDAYAAN');
        $sheet->setCellValue('A3', $schoolName);
        $sheet->setCellValue('A4', 'REKAPITULASI HASIL & NILAI UJIAN ONLINE');

        $sheet->mergeCells('A1:O1');
        $sheet->mergeCells('A2:O2');
        $sheet->mergeCells('A3:O3');
        $sheet->mergeCells('A4:O4');

        $sheet->getStyle('A1:A4')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('A1:A2')->getFont()->setSize(11)->setBold(true);
        $sheet->getStyle('A3')->getFont()->setSize(13)->setBold(true);
        $sheet->getStyle('A4')->getFont()->setSize(11)->setBold(true)->setUnderline(true);

        // Metadata Info
        $categoryLabels = [
            'uts' => 'Penilaian Tengah Semester (PTS/UTS)',
            'uas' => 'Penilaian Akhir Semester (PAS/UAS)',
            'ulangan_harian' => 'Ulangan Harian / Penilaian Harian',
            'ujian_sekolah' => 'Ujian Sekolah (US)',
            'kuis' => 'Kuis Harian',
        ];
        $categoryName = $categoryLabels[$exam->exam_category] ?? strtoupper($exam->exam_category);
        $targetClassLabel = $exam->class?->name ?? ($exam->exam_category === 'ujian_sekolah' ? 'Seluruh Kelas 6 (Kelas Akhir)' : 'Semua Rombel');
        $printDate = now()->setTimezone('Asia/Makassar')->translatedFormat('d F Y, H:i').' WITA';

        $sheet->setCellValue('B6', 'Mata Pelajaran');
        $sheet->setCellValue('D6', ': '.($exam->subject?->name ?? '-'));
        $sheet->setCellValue('B7', 'Judul Ujian');
        $sheet->setCellValue('D7', ': '.$exam->title);
        $sheet->setCellValue('B8', 'Kategori Ujian');
        $sheet->setCellValue('D8', ': '.$categoryName);
        $sheet->setCellValue('B9', 'Kelas / Sasaran');
        $sheet->setCellValue('D9', ': '.$targetClassLabel);

        $sheet->setCellValue('I6', 'Tahun Ajaran');
        $sheet->setCellValue('K6', ': '.($exam->academicYear?->name ?? '-'));
        $sheet->setCellValue('I7', 'Batas KKM');
        $sheet->setCellValue('K7', ': '.number_format((float) $exam->passing_score, 0).' / 100');
        $sheet->setCellValue('I8', 'Total Soal & Poin');
        $sheet->setCellValue('K8', ': '.$totalQuestionsCount.' Soal (Maks: '.$totalExamPoints.' Poin)');
        $sheet->setCellValue('I9', 'Tanggal Cetak');
        $sheet->setCellValue('K9', ': '.$printDate);

        $sheet->getStyle('B6:B9')->getFont()->setBold(true)->setSize(9);
        $sheet->getStyle('D6:D9')->getFont()->setSize(9);
        $sheet->getStyle('I6:I9')->getFont()->setBold(true)->setSize(9);
        $sheet->getStyle('K6:K9')->getFont()->setSize(9);

        // Table Column Headers (Row 11)
        $headers = [
            'A11' => 'NO',
            'B11' => 'PERINGKAT',
            'C11' => 'NIS',
            'D11' => 'NISN',
            'E11' => 'NAMA LENGKAP SISWA',
            'F11' => 'KELAS',
            'G11' => 'PERCOBAAN',
            'H11' => 'WAKTU SELESAI',
            'I11' => 'PG BENAR',
            'J11' => 'PGK BENAR',
            'K11' => 'ISIAN BENAR',
            'L11' => 'POIN DIPEROLEH',
            'M11' => 'POIN MAKSIMAL',
            'N11' => 'NILAI (0-100)',
            'O11' => 'STATUS KKM',
        ];

        foreach ($headers as $cell => $text) {
            $sheet->setCellValue($cell, $text);
        }

        $headerStyle = [
            'font' => ['bold' => true, 'size' => 9, 'color' => ['rgb' => 'FFFFFF']],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                'wrapText' => true,
            ],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => '4A0012']]],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '800020'],
            ],
        ];
        $sheet->getStyle('A11:O11')->applyFromArray($headerStyle);
        $sheet->getRowDimension(11)->setRowHeight(28);

        // Data Rows
        $currentRow = 12;
        if ($attempts->isEmpty()) {
            $sheet->setCellValue('A12', 'Belum ada data pengerjaan ujian yang tersimpan.');
            $sheet->mergeCells('A12:O12');
            $sheet->getStyle('A12')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle('A12')->getFont()->setItalic(true)->setSize(10);
            $sheet->getStyle('A12:O12')->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);
            $currentRow = 13;
        } else {
            foreach ($attempts as $idx => $att) {
                $student = $att->student;
                $answers = $att->answers;

                $correctMc = $answers->where('is_correct', true)->filter(fn ($a) => $a->question?->question_type === 'multiple_choice')->count();
                $correctPgk = $answers->where('is_correct', true)->filter(fn ($a) => in_array($a->question?->question_type, ['pgk_mcma', 'pgk_kategori']))->count();
                $correctShort = $answers->where('is_correct', true)->filter(fn ($a) => $a->question?->question_type === 'short_answer')->count();

                $submittedText = $att->submitted_at
                    ? $att->submitted_at->setTimezone('Asia/Makassar')->format('d/m/Y H:i')
                    : '-';

                $isPassed = $att->dynamic_percentage >= (float) $exam->passing_score;

                $sheet->setCellValue('A'.$currentRow, $idx + 1);
                $sheet->setCellValue('B'.$currentRow, '#'.($idx + 1));
                $sheet->setCellValueExplicit('C'.$currentRow, (string) ($student?->nis ?? '-'), \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
                $sheet->setCellValueExplicit('D'.$currentRow, (string) ($student?->nisn ?? '-'), \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
                $sheet->setCellValue('E'.$currentRow, $student?->full_name ?? '-');
                $sheet->setCellValue('F'.$currentRow, $student?->class?->name ?? '-');
                $sheet->setCellValue('G'.$currentRow, 'Ke-'.$att->attempt_number);
                $sheet->setCellValue('H'.$currentRow, $submittedText);
                $sheet->setCellValue('I'.$currentRow, "{$correctMc} / {$mcCount}");
                $sheet->setCellValue('J'.$currentRow, "{$correctPgk} / {$pgkCount}");
                $sheet->setCellValue('K'.$currentRow, "{$correctShort} / {$shortCount}");
                $sheet->setCellValue('L'.$currentRow, $att->dynamic_score);
                $sheet->setCellValue('M'.$currentRow, $totalExamPoints);
                $sheet->setCellValue('N'.$currentRow, round($att->dynamic_percentage, 1));
                $sheet->setCellValue('O'.$currentRow, $isPassed ? 'LULUS' : 'BELUM LULUS');

                // Zebra striping
                if ($idx % 2 === 1) {
                    $sheet->getStyle("A{$currentRow}:O{$currentRow}")->getFill()
                        ->setFillType(Fill::FILL_SOLID)
                        ->getStartColor()->setRGB('F8FAFC');
                }

                // Status KKM formatting
                if ($isPassed) {
                    $sheet->getStyle('O'.$currentRow)->getFont()->setBold(true)->getColor()->setRGB('15803D');
                } else {
                    $sheet->getStyle('O'.$currentRow)->getFont()->setBold(true)->getColor()->setRGB('B91C1C');
                }

                $sheet->getStyle('N'.$currentRow)->getFont()->setBold(true);
                $sheet->getRowDimension($currentRow)->setRowHeight(20);
                $currentRow++;
            }

            $dataEndRow = $currentRow - 1;

            $sheet->getStyle("A12:O{$dataEndRow}")->applyFromArray([
                'font' => ['size' => 9],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'CBD5E1']]],
                'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
            ]);

            $sheet->getStyle("A12:D{$dataEndRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("E12:E{$dataEndRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
            $sheet->getStyle("F12:K{$dataEndRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("L12:M{$dataEndRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
            $sheet->getStyle("N12:O{$dataEndRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        }

        // Summary Statistics Box
        $summaryRow = $currentRow + 1;
        $sheet->setCellValue('B'.$summaryRow, 'REKAPITULASI HASIL:');
        $sheet->getStyle('B'.$summaryRow)->getFont()->setBold(true)->setSize(10);

        $totalCompleted = $attempts->count();
        $avgScore = $totalCompleted > 0 ? round($attempts->avg('dynamic_percentage'), 2) : 0;
        $maxScore = $totalCompleted > 0 ? $attempts->max('dynamic_percentage') : 0;
        $minScore = $totalCompleted > 0 ? $attempts->min('dynamic_percentage') : 0;
        $passedCount = $attempts->where('dynamic_percentage', '>=', (float) $exam->passing_score)->count();
        $failedCount = $totalCompleted - $passedCount;

        $sheet->setCellValue('B'.($summaryRow + 1), 'Total Siswa Mengikuti');
        $sheet->setCellValue('D'.($summaryRow + 1), ': '.$totalCompleted.' Siswa');
        $sheet->setCellValue('B'.($summaryRow + 2), 'Nilai Rata-rata Ujian');
        $sheet->setCellValue('D'.($summaryRow + 2), ': '.$avgScore);
        $sheet->setCellValue('B'.($summaryRow + 3), 'Nilai Tertinggi / Terendah');
        $sheet->setCellValue('D'.($summaryRow + 3), ': '.$maxScore.' / '.$minScore);

        $passedPct = $totalCompleted > 0 ? round(($passedCount / $totalCompleted) * 100, 1) : 0;
        $failedPct = $totalCompleted > 0 ? round(($failedCount / $totalCompleted) * 100, 1) : 0;
        $sheet->setCellValue('H'.($summaryRow + 1), 'Jumlah Lulus KKM');
        $sheet->setCellValue('J'.($summaryRow + 1), ': '.$passedCount.' Siswa ('.$passedPct.'%)');
        $sheet->setCellValue('H'.($summaryRow + 2), 'Jumlah Belum Lulus');
        $sheet->setCellValue('J'.($summaryRow + 2), ': '.$failedCount.' Siswa ('.$failedPct.'%)');

        $sheet->getStyle('B'.($summaryRow + 1).':D'.($summaryRow + 3))->getFont()->setSize(9);
        $sheet->getStyle('H'.($summaryRow + 1).':J'.($summaryRow + 2))->getFont()->setSize(9);

        // Signatures
        $sigRow = $summaryRow + 5;
        $todayDate = now()->setTimezone('Asia/Makassar')->translatedFormat('d F Y');

        $sheet->setCellValue('B'.$sigRow, 'Mengetahui,');
        $sheet->setCellValue('B'.($sigRow + 1), 'Kepala Sekolah');
        $sheet->setCellValue('B'.($sigRow + 4), $principalName);
        $sheet->setCellValue('B'.($sigRow + 5), 'NIP. '.$principalNip);

        $sheet->setCellValue('K'.$sigRow, 'Gandangbatu Sillanan, '.$todayDate);
        $sheet->setCellValue('K'.($sigRow + 1), 'Guru Mata Pelajaran / Pengampu,');
        $sheet->setCellValue('K'.($sigRow + 4), $teacherName);
        $sheet->setCellValue('K'.($sigRow + 5), $teacherNip !== '-' ? 'NIP. '.$teacherNip : '-');

        $sheet->getStyle('B'.($sigRow + 4))->getFont()->setBold(true)->setUnderline(true)->setSize(10);
        $sheet->getStyle('K'.($sigRow + 4))->getFont()->setBold(true)->setUnderline(true)->setSize(10);
        $sheet->getStyle('B'.($sigRow + 5))->getFont()->setSize(9);
        $sheet->getStyle('K'.($sigRow + 5))->getFont()->setSize(9);

        // Column Widths
        $colWidths = [
            'A' => 6,
            'B' => 12,
            'C' => 14,
            'D' => 16,
            'E' => 32,
            'F' => 14,
            'G' => 13,
            'H' => 20,
            'I' => 13,
            'J' => 13,
            'K' => 13,
            'L' => 15,
            'M' => 15,
            'N' => 15,
            'O' => 15,
        ];
        foreach ($colWidths as $col => $w) {
            $sheet->getColumnDimension($col)->setWidth($w);
        }

        $safeExam = preg_replace('/[^A-Za-z0-9]/', '_', substr($exam->title, 0, 30));
        $safeClass = preg_replace('/[^A-Za-z0-9]/', '_', $exam->class?->name ?? 'Semua_Rombel');

        // Check if ZipArchive is available on server
        if (! class_exists(\ZipArchive::class)) {
            $fileNameCsv = "LEGER_NILAI_{$safeExam}_{$safeClass}.csv";

            return response()->streamDownload(function () use ($spreadsheet) {
                $writer = new Csv($spreadsheet);
                $writer->setUseBOM(true);
                $writer->save('php://output');
            }, $fileNameCsv, [
                'Content-Type' => 'text/csv; charset=UTF-8',
                'Cache-Control' => 'max-age=0',
            ]);
        }

        $fileName = "LEGER_NILAI_{$safeExam}_{$safeClass}.xlsx";

        return response()->streamDownload(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        }, $fileName, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Cache-Control' => 'max-age=0',
        ]);
    }
}
