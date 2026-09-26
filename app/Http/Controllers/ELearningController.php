<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ELearningController extends Controller
{
    public function index(Request $request): Response
    {
        $user = auth()->user();
        $userRole = $user?->role ?? 'siswa';

        $subjects = DB::table('subjects')->orderBy('name')->get();
        $classes = DB::table('classes')->orderBy('grade_level')->get();

        $student = null;
        if ($userRole === 'siswa') {
            $student = DB::table('students')->where('user_id', $user->id)->first();
        }

        $teacher = null;
        if (in_array($userRole, ['guru', 'bk', 'pimpinan'])) {
            $teacher = DB::table('teachers')->where('user_id', $user->id)->first();
        }

        // Query Materials
        $materials = DB::table('materials')
            ->join('topics', 'materials.topic_id', '=', 'topics.id')
            ->join('teacher_subjects', 'topics.teacher_subject_id', '=', 'teacher_subjects.id')
            ->join('subjects', 'teacher_subjects.subject_id', '=', 'subjects.id')
            ->join('classes', 'teacher_subjects.class_id', '=', 'classes.id')
            ->select(
                'materials.*',
                'topics.title as topic_title',
                'subjects.id as subject_id',
                'subjects.name as subject_name',
                'subjects.code as subject_code',
                'classes.id as class_id',
                'classes.name as class_name'
            )
            ->orderBy('materials.created_at', 'desc')
            ->get();

        // Query Assignments
        $rawAssignments = DB::table('assignments')
            ->join('topics', 'assignments.topic_id', '=', 'topics.id')
            ->join('teacher_subjects', 'topics.teacher_subject_id', '=', 'teacher_subjects.id')
            ->join('subjects', 'teacher_subjects.subject_id', '=', 'subjects.id')
            ->join('classes', 'teacher_subjects.class_id', '=', 'classes.id')
            ->select(
                'assignments.*',
                'topics.title as topic_title',
                'subjects.id as subject_id',
                'subjects.name as subject_name',
                'subjects.code as subject_code',
                'classes.id as class_id',
                'classes.name as class_name'
            )
            ->orderBy('assignments.created_at', 'desc')
            ->get();

        $assignments = $rawAssignments->map(function ($assignment) use ($student) {
            $classStudentCount = DB::table('students')
                ->where('class_id', $assignment->class_id)
                ->where('status', 'aktif')
                ->count();

            $submissionCount = DB::table('assignment_submissions')
                ->where('assignment_id', $assignment->id)
                ->count();

            $mySubmission = null;
            if ($student) {
                $mySubmission = DB::table('assignment_submissions')
                    ->where('assignment_id', $assignment->id)
                    ->where('student_id', $student->id)
                    ->first();
            }

            return array_merge((array)$assignment, [
                'total_students' => $classStudentCount,
                'submissions_count' => $submissionCount,
                'my_submission' => $mySubmission,
            ]);
        });

        return Inertia::render('ELearning/Index', [
            'subjects' => $subjects,
            'classes' => $classes,
            'materials' => $materials,
            'assignments' => $assignments,
            'currentStudent' => $student,
            'currentTeacher' => $teacher,
        ]);
    }

    // Helper to get or create topic connection
    private function getOrCreateTopic($subjectId, $classId, $topicTitle = null)
    {
        $user = auth()->user();
        $teacher = DB::table('teachers')->where('user_id', $user->id)->first();
        $teacherId = $teacher?->id ?? DB::table('teachers')->value('id') ?? 1;

        $activeYear = DB::table('academic_years')->where('is_active', true)->first();
        $academicYearId = $activeYear?->id ?? 1;

        $teacherSubject = DB::table('teacher_subjects')
            ->where('subject_id', $subjectId)
            ->where('class_id', $classId)
            ->first();

        if (!$teacherSubject) {
            $tsId = DB::table('teacher_subjects')->insertGetId([
                'teacher_id' => $teacherId,
                'subject_id' => $subjectId,
                'class_id' => $classId,
                'academic_year_id' => $academicYearId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $tsId = $teacherSubject->id;
        }

        $title = $topicTitle ?: 'Modul & Penugasan Pembelajaran';
        $topic = DB::table('topics')
            ->where('teacher_subject_id', $tsId)
            ->where('title', $title)
            ->first();

        if (!$topic) {
            $topicId = DB::table('topics')->insertGetId([
                'teacher_subject_id' => $tsId,
                'title' => $title,
                'description' => 'Materi dan penugasan kurikulum reguler.',
                'order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $topicId = $topic->id;
        }

        return $topicId;
    }

    // ==================== MATERIALS (BAHAN AJAR) ==================== //

    public function storeMaterial(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subject_id' => 'required|exists:subjects,id',
            'class_id' => 'required|exists:classes,id',
            'type' => 'required|in:file,video_link,article',
            'body_text' => 'nullable|string',
            'content_url' => 'nullable|string|max:500',
            'file' => 'nullable|file|max:10240',
        ]);

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('materials', 'public');
        }

        $topicId = $this->getOrCreateTopic($validated['subject_id'], $validated['class_id']);

        DB::table('materials')->insert([
            'topic_id' => $topicId,
            'title' => $validated['title'],
            'type' => $validated['type'],
            'file_path' => $filePath,
            'content_url' => $validated['content_url'] ?? null,
            'body_text' => $validated['body_text'] ?? null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('message', 'Bahan ajar baru berhasil dipublikasikan.');
    }

    public function updateMaterial(Request $request, $id)
    {
        $material = DB::table('materials')->where('id', $id)->first();
        if (!$material) {
            return back()->withErrors(['error' => 'Materi tidak ditemukan.']);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subject_id' => 'required|exists:subjects,id',
            'class_id' => 'required|exists:classes,id',
            'type' => 'required|in:file,video_link,article',
            'body_text' => 'nullable|string',
            'content_url' => 'nullable|string|max:500',
            'file' => 'nullable|file|max:10240',
        ]);

        $filePath = $material->file_path;
        if ($request->hasFile('file')) {
            if ($material->file_path) {
                Storage::disk('public')->delete($material->file_path);
            }
            $filePath = $request->file('file')->store('materials', 'public');
        }

        $topicId = $this->getOrCreateTopic($validated['subject_id'], $validated['class_id']);

        DB::table('materials')->where('id', $id)->update([
            'topic_id' => $topicId,
            'title' => $validated['title'],
            'type' => $validated['type'],
            'file_path' => $filePath,
            'content_url' => $validated['content_url'] ?? null,
            'body_text' => $validated['body_text'] ?? null,
            'updated_at' => now(),
        ]);

        return back()->with('message', 'Bahan ajar berhasil diperbarui.');
    }

    public function destroyMaterial($id)
    {
        $material = DB::table('materials')->where('id', $id)->first();
        if ($material) {
            if ($material->file_path) {
                Storage::disk('public')->delete($material->file_path);
            }
            DB::table('materials')->where('id', $id)->delete();
        }

        return back()->with('message', 'Bahan ajar berhasil dihapus.');
    }

    // ==================== ASSIGNMENTS (TUGAS & ASESMEN) ==================== //

    public function storeAssignment(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subject_id' => 'required|exists:subjects,id',
            'class_id' => 'required|exists:classes,id',
            'instructions' => 'required|string',
            'due_date' => 'required|date',
            'max_score' => 'required|numeric|min:10|max:100',
            'attachment' => 'nullable|file|max:10240',
        ]);

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('assignments', 'public');
        }

        $topicId = $this->getOrCreateTopic($validated['subject_id'], $validated['class_id']);

        DB::table('assignments')->insert([
            'topic_id' => $topicId,
            'title' => $validated['title'],
            'instructions' => $validated['instructions'],
            'attachment_path' => $attachmentPath,
            'due_date' => date('Y-m-d H:i:s', strtotime($validated['due_date'])),
            'max_score' => $validated['max_score'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('message', 'Tugas baru berhasil dipublikasikan.');
    }

    public function updateAssignment(Request $request, $id)
    {
        $assignment = DB::table('assignments')->where('id', $id)->first();
        if (!$assignment) {
            return back()->withErrors(['error' => 'Tugas tidak ditemukan.']);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subject_id' => 'required|exists:subjects,id',
            'class_id' => 'required|exists:classes,id',
            'instructions' => 'required|string',
            'due_date' => 'required|date',
            'max_score' => 'required|numeric|min:10|max:100',
            'attachment' => 'nullable|file|max:10240',
        ]);

        $attachmentPath = $assignment->attachment_path;
        if ($request->hasFile('attachment')) {
            if ($assignment->attachment_path) {
                Storage::disk('public')->delete($assignment->attachment_path);
            }
            $attachmentPath = $request->file('attachment')->store('assignments', 'public');
        }

        $topicId = $this->getOrCreateTopic($validated['subject_id'], $validated['class_id']);

        DB::table('assignments')->where('id', $id)->update([
            'topic_id' => $topicId,
            'title' => $validated['title'],
            'instructions' => $validated['instructions'],
            'attachment_path' => $attachmentPath,
            'due_date' => date('Y-m-d H:i:s', strtotime($validated['due_date'])),
            'max_score' => $validated['max_score'],
            'updated_at' => now(),
        ]);

        return back()->with('message', 'Tugas berhasil diperbarui.');
    }

    public function destroyAssignment($id)
    {
        $assignment = DB::table('assignments')->where('id', $id)->first();
        if ($assignment) {
            if ($assignment->attachment_path) {
                Storage::disk('public')->delete($assignment->attachment_path);
            }
            DB::table('assignments')->where('id', $id)->delete();
        }

        return back()->with('message', 'Tugas berhasil dihapus.');
    }

    // ==================== SUBMISSIONS & GRADING ==================== //

    public function submitAssignment(Request $request)
    {
        $user = auth()->user();
        $student = DB::table('students')->where('user_id', $user->id)->first();

        if (!$student) {
            return back()->withErrors(['error' => 'Akun Anda tidak terdaftar sebagai peserta didik aktif.']);
        }

        $validated = $request->validate([
            'assignment_id' => 'required|exists:assignments,id',
            'student_notes' => 'nullable|string',
            'file' => 'nullable|file|max:10240',
        ]);

        $existing = DB::table('assignment_submissions')
            ->where('assignment_id', $validated['assignment_id'])
            ->where('student_id', $student->id)
            ->first();

        $filePath = $existing?->file_path;
        if ($request->hasFile('file')) {
            if ($filePath) {
                Storage::disk('public')->delete($filePath);
            }
            $filePath = $request->file('file')->store('submissions', 'public');
        }

        DB::table('assignment_submissions')->updateOrInsert(
            [
                'assignment_id' => $validated['assignment_id'],
                'student_id' => $student->id,
            ],
            [
                'submitted_at' => now(),
                'file_path' => $filePath,
                'student_notes' => $validated['student_notes'] ?? null,
                'updated_at' => now(),
            ]
        );

        return back()->with('message', 'Tugas berhasil dikumpulkan.');
    }

    public function getAssignmentSubmissions($id)
    {
        $assignment = DB::table('assignments')
            ->join('topics', 'assignments.topic_id', '=', 'topics.id')
            ->join('teacher_subjects', 'topics.teacher_subject_id', '=', 'teacher_subjects.id')
            ->join('subjects', 'teacher_subjects.subject_id', '=', 'subjects.id')
            ->join('classes', 'teacher_subjects.class_id', '=', 'classes.id')
            ->select(
                'assignments.*',
                'subjects.name as subject_name',
                'classes.id as class_id',
                'classes.name as class_name'
            )
            ->where('assignments.id', $id)
            ->first();

        if (!$assignment) {
            return response()->json(['error' => 'Penugasan tidak ditemukan.'], 404);
        }

        $students = DB::table('students')
            ->where('class_id', $assignment->class_id)
            ->where('status', 'aktif')
            ->select('id', 'nisn', 'nis', 'full_name', 'gender')
            ->orderBy('full_name')
            ->get();

        $submissions = DB::table('assignment_submissions')
            ->where('assignment_id', $id)
            ->get()
            ->keyBy('student_id');

        $studentList = $students->map(function ($st) use ($submissions) {
            $sub = $submissions->get($st->id);
            return [
                'student_id' => $st->id,
                'full_name' => $st->full_name,
                'nisn' => $st->nisn,
                'submission_id' => $sub?->id,
                'submitted_at' => $sub?->submitted_at,
                'file_path' => $sub?->file_path,
                'student_notes' => $sub?->student_notes,
                'score' => $sub?->score,
                'teacher_feedback' => $sub?->teacher_feedback,
                'graded_at' => $sub?->graded_at,
                'status' => $sub ? ($sub->score !== null ? 'graded' : 'submitted') : 'missing'
            ];
        });

        return response()->json([
            'assignment' => $assignment,
            'students' => $studentList,
        ]);
    }

    public function gradeSubmission(Request $request, $id)
    {
        $validated = $request->validate([
            'score' => 'required|numeric|min:0|max:100',
            'teacher_feedback' => 'nullable|string',
        ]);

        DB::table('assignment_submissions')->where('id', $id)->update([
            'score' => $validated['score'],
            'teacher_feedback' => $validated['teacher_feedback'] ?? null,
            'graded_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('message', 'Nilai dan umpan balik tugas berhasil disimpan.');
    }
}
