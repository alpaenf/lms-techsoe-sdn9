<?php

namespace App\Http\Controllers;

use App\Models\AcademicGradebook;
use App\Models\AcademicGradebookScore;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PenilaianController extends Controller
{
    /**
     * Default material scopes structure for Kurikulum Merdeka
     */
    private function getDefaultMaterialScopes(int $semester = 2): array
    {
        $startNumber = $semester === 2 ? 6 : 1;

        $scopes = [];
        for ($i = 0; $i < 5; $i++) {
            $lmNum = $startNumber + $i;
            $scopes[] = [
                'id' => 'lm' . ($i + 1),
                'name' => 'Lingkup Materi ' . $lmNum,
                'tps' => ['TP1', 'TP2', 'TP3', 'TP4'],
            ];
        }

        return $scopes;
    }

    /**
     * Get assigned / claimed class IDs for a teacher
     */
    private function getTeacherClassIds($teacher): array
    {
        if (! $teacher) {
            return [];
        }

        $homeroomClassIds = DB::table('classes')
            ->where('homeroom_teacher_id', $teacher->id)
            ->pluck('id')
            ->toArray();

        $claimedClassIds = DB::table('teacher_subjects')
            ->where('teacher_id', $teacher->id)
            ->pluck('class_id')
            ->unique()
            ->toArray();

        $scheduledClassIds = DB::table('teaching_schedules')
            ->where('teacher_id', $teacher->id)
            ->pluck('class_id')
            ->unique()
            ->toArray();

        return array_values(array_unique(array_merge($homeroomClassIds, $claimedClassIds, $scheduledClassIds)));
    }

    /**
     * Display the main Kurikulum Merdeka Gradebook or redirect to elearning tab
     */
    public function index(Request $request)
    {
        if ($request->has('standalone')) {
            return Inertia::render('Penilaian/Index', $this->getGradebookProps($request));
        }

        return redirect()->route('elearning.index', array_merge(['tab' => 'penilaian'], $request->query()));
    }

    /**
     * Get all gradebook props for Kurikulum Merdeka assessment
     */
    public function getGradebookProps(Request $request): array
    {
        $user = auth()->user();
        $userRole = $user->role ?? 'guru';

        $activeAcademicYear = DB::table('academic_years')->where('is_active', true)->first();
        $academicYearId = $activeAcademicYear?->id ?? 1;

        // =========================================================================
        // SISWA VIEW: LIHAT REKAP NILAI SEMUA MATA PELAJARAN
        // =========================================================================
        if ($userRole === 'siswa') {
            $student = DB::table('students')->where('user_id', $user->id)->first();

            if (! $student) {
                return [
                    'isStudentView' => true,
                    'error' => 'Data profil siswa Anda tidak ditemukan.',
                ];
            }

            $studentClass = DB::table('classes')->where('id', $student->class_id)->first();
            $subjects = DB::table('subjects')->orderBy('name')->get();

            // Fetch gradebooks for this class
            $gradebooks = AcademicGradebook::where('class_id', $student->class_id)
                ->where('academic_year_id', $academicYearId)
                ->with(['subject', 'scores' => function ($q) use ($student) {
                    $q->where('student_id', $student->id);
                }])
                ->get();

            $studentGradesData = [];
            foreach ($subjects as $subj) {
                $gb = $gradebooks->firstWhere('subject_id', $subj->id);
                $score = $gb?->scores?->first();

                $studentGradesData[] = [
                    'subject_id' => $subj->id,
                    'subject_name' => $subj->name,
                    'subject_code' => $subj->code,
                    'material_scopes' => $gb?->material_scopes ?? $this->getDefaultMaterialScopes(),
                    'formatif_scores' => $score?->formatif_scores ?? [],
                    'sumatif_lm_scores' => $score?->sumatif_lm_scores ?? [],
                    'sas_score' => $score?->sas_score !== null ? (float) $score->sas_score : null,
                    'final_score' => $score?->final_score !== null ? (float) $score->final_score : null,
                    'notes' => $score?->notes ?? '',
                ];
            }

            return [
                'isStudentView' => true,
                'student' => $student,
                'studentClass' => $studentClass,
                'activeAcademicYear' => $activeAcademicYear,
                'studentGrades' => $studentGradesData,
            ];
        }

        // =========================================================================
        // GURU / ADMIN / PIMPINAN VIEW: BUKU NILAI & SPREADSHEET PENILAIAN
        // =========================================================================
        $allClasses = DB::table('classes')->orderBy('grade_level')->get();
        $allSubjects = DB::table('subjects')->orderBy('name')->get();

        $teacher = DB::table('teachers')->where('user_id', $user->id)->first();
        $isStaffOrAdmin = in_array($userRole, ['admin', 'pimpinan']);

        $classes = $allClasses;
        $subjects = $allSubjects;
        $defaultClassId = $allClasses->first()?->id ?? 1;
        $defaultSubjectId = $allSubjects->first()?->id ?? 1;

        if ($teacher && ! $isStaffOrAdmin) {
            $teacherClassIds = $this->getTeacherClassIds($teacher);

            if (! empty($teacherClassIds)) {
                $classes = DB::table('classes')
                    ->whereIn('id', $teacherClassIds)
                    ->orderBy('grade_level')
                    ->get();

                // Homeroom class prioritized as default
                $homeroomClassId = DB::table('classes')
                    ->where('homeroom_teacher_id', $teacher->id)
                    ->value('id');

                $defaultClassId = $homeroomClassId ?: ($classes->first()?->id ?? 1);
            }

            // Filter subjects if teacher is guru_mapel with claimed subjects
            $claimedSubjectIds = DB::table('teacher_subjects')
                ->where('teacher_id', $teacher->id)
                ->pluck('subject_id')
                ->unique()
                ->toArray();

            if ($userRole === 'guru_mapel' && ! empty($claimedSubjectIds)) {
                $subjects = DB::table('subjects')
                    ->whereIn('id', $claimedSubjectIds)
                    ->orderBy('name')
                    ->get();
                $defaultSubjectId = $subjects->first()?->id ?? $defaultSubjectId;
            }
        }

        // Strictly enforce selectedClassId within allowed classes
        $requestedClassId = $request->query('class_id');
        if ($requestedClassId && $classes->pluck('id')->contains((int) $requestedClassId)) {
            $selectedClassId = (int) $requestedClassId;
        } else {
            $selectedClassId = (int) $defaultClassId;
        }

        // Strictly enforce selectedSubjectId within allowed subjects
        $requestedSubjectId = $request->query('subject_id');
        if ($requestedSubjectId && $subjects->pluck('id')->contains((int) $requestedSubjectId)) {
            $selectedSubjectId = (int) $requestedSubjectId;
        } else {
            $selectedSubjectId = (int) $defaultSubjectId;
        }

        $selectedSemester = (int) $request->query('semester', $activeAcademicYear->semester ?? 2);

        $selectedClass = $classes->firstWhere('id', $selectedClassId) ?? $allClasses->firstWhere('id', $selectedClassId);
        $selectedSubject = $subjects->firstWhere('id', $selectedSubjectId) ?? $allSubjects->firstWhere('id', $selectedSubjectId);

        // Find or create AcademicGradebook
        $gradebook = AcademicGradebook::firstOrCreate(
            [
                'academic_year_id' => $academicYearId,
                'class_id' => $selectedClassId,
                'subject_id' => $selectedSubjectId,
                'semester' => $selectedSemester,
            ],
            [
                'material_scopes' => $this->getDefaultMaterialScopes($selectedSemester),
                'teacher_id' => DB::table('teachers')->where('user_id', $user->id)->value('id'),
            ]
        );

        // Load students in selected class
        $students = DB::table('students')
            ->where('class_id', $selectedClassId)
            ->where('status', 'aktif')
            ->select('id', 'nisn', 'nis', 'full_name', 'gender')
            ->orderBy('full_name')
            ->get();

        // Load existing scores for this gradebook
        $scoresMap = AcademicGradebookScore::where('gradebook_id', $gradebook->id)
            ->get()
            ->keyBy('student_id');

        // Build composite student score records
        $studentsWithScores = $students->map(function ($st, $idx) use ($scoresMap) {
            $scoreRecord = $scoresMap->get($st->id);

            $formatif = $scoreRecord?->formatif_scores ?? [];
            $sumatifLm = $scoreRecord?->sumatif_lm_scores ?? [];
            $sas = $scoreRecord?->sas_score !== null ? (float) $scoreRecord->sas_score : null;
            $final = $scoreRecord?->final_score !== null ? (float) $scoreRecord->final_score : null;

            return [
                'no' => $idx + 1,
                'student_id' => $st->id,
                'nisn' => $st->nisn,
                'nis' => $st->nis,
                'full_name' => $st->full_name,
                'gender' => $st->gender,
                'formatif_scores' => $formatif,
                'sumatif_lm_scores' => $sumatifLm,
                'sas_score' => $sas,
                'final_score' => $final,
                'notes' => $scoreRecord?->notes ?? '',
            ];
        });

        // Compute KPI Summary Stats
        $totalStudents = $studentsWithScores->count();
        $gradedScores = $studentsWithScores->pluck('final_score')->filter(fn ($v) => $v !== null && $v > 0);
        $gradedCount = $gradedScores->count();
        $avgScore = $gradedCount > 0 ? round($gradedScores->avg(), 1) : 0;
        $maxScore = $gradedCount > 0 ? $gradedScores->max() : 0;
        $minScore = $gradedCount > 0 ? $gradedScores->min() : 0;
        $passedCount = $gradedScores->filter(fn ($v) => $v >= 75)->count();
        $passRate = $gradedCount > 0 ? round(($passedCount / $gradedCount) * 100, 1) : 0;

        return [
            'isStudentView' => false,
            'classes' => $classes,
            'subjects' => $subjects,
            'selectedClass' => $selectedClass,
            'selectedSubject' => $selectedSubject,
            'selectedSemester' => $selectedSemester,
            'activeAcademicYear' => $activeAcademicYear,
            'gradebook' => $gradebook,
            'materialScopes' => $gradebook->material_scopes ?? $this->getDefaultMaterialScopes($selectedSemester),
            'students' => $studentsWithScores,
            'summaryStats' => [
                'total_students' => $totalStudents,
                'graded_count' => $gradedCount,
                'avg_score' => $avgScore,
                'max_score' => $maxScore,
                'min_score' => $minScore,
                'passed_count' => $passedCount,
                'pass_rate' => $passRate,
            ],
        ];
    }

    /**
     * Save / Update students grades directly from web table
     */
    public function saveScores(Request $request)
    {
        $request->validate([
            'gradebook_id' => 'required|exists:academic_gradebooks,id',
            'scores' => 'required|array',
            'scores.*.student_id' => 'required|exists:students,id',
            'scores.*.formatif_scores' => 'nullable|array',
            'scores.*.sumatif_lm_scores' => 'nullable|array',
            'scores.*.sas_score' => 'nullable|numeric|min:0|max:100',
            'scores.*.final_score' => 'nullable|numeric|min:0|max:100',
            'scores.*.notes' => 'nullable|string',
        ]);

        $gradebook = AcademicGradebook::findOrFail($request->gradebook_id);

        $user = auth()->user();
        $userRole = $user->role ?? 'guru';
        $teacher = DB::table('teachers')->where('user_id', $user->id)->first();
        $isStaffOrAdmin = in_array($userRole, ['admin', 'pimpinan']);

        if ($teacher && ! $isStaffOrAdmin) {
            $teacherClassIds = $this->getTeacherClassIds($teacher);
            if (! empty($teacherClassIds) && ! in_array($gradebook->class_id, $teacherClassIds)) {
                abort(403, 'Anda tidak memiliki hak akses untuk mengubah nilai kelas ini.');
            }
        }

        // Find or create teacher_subjects row for E-Rapor sync
        $ts = DB::table('teacher_subjects')
            ->where('subject_id', $gradebook->subject_id)
            ->where('class_id', $gradebook->class_id)
            ->where('academic_year_id', $gradebook->academic_year_id)
            ->first();

        $teacherSubjectId = $ts?->id;
        if (! $teacherSubjectId) {
            $defaultTeacher = DB::table('teachers')->first();
            $teacherSubjectId = DB::table('teacher_subjects')->insertGetId([
                'teacher_id' => $gradebook->teacher_id ?? $defaultTeacher?->id ?? 1,
                'subject_id' => $gradebook->subject_id,
                'class_id' => $gradebook->class_id,
                'academic_year_id' => $gradebook->academic_year_id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        DB::transaction(function () use ($request, $gradebook, $teacherSubjectId) {
            foreach ($request->scores as $row) {
                $studentId = $row['student_id'];
                $formatif = $row['formatif_scores'] ?? [];
                $sumatifLm = $row['sumatif_lm_scores'] ?? [];
                $sas = isset($row['sas_score']) && $row['sas_score'] !== '' ? (float) $row['sas_score'] : null;
                $notes = $row['notes'] ?? null;

                // Calculate final score
                $calculatedFinal = null;
                $lmScores = array_filter(array_map('floatval', array_values($sumatifLm)), fn ($v) => $v > 0);

                if (! empty($lmScores) || $sas !== null) {
                    $avgLm = ! empty($lmScores) ? (array_sum($lmScores) / count($lmScores)) : ($sas ?? 0);
                    if ($sas !== null && ! empty($lmScores)) {
                        $calculatedFinal = round(($avgLm * 0.6) + ($sas * 0.4), 2);
                    } else {
                        $calculatedFinal = round($avgLm, 2);
                    }
                }

                if (isset($row['final_score']) && $row['final_score'] !== '' && (float) $row['final_score'] > 0) {
                    $calculatedFinal = (float) $row['final_score'];
                }

                AcademicGradebookScore::updateOrCreate(
                    [
                        'gradebook_id' => $gradebook->id,
                        'student_id' => $studentId,
                    ],
                    [
                        'formatif_scores' => $formatif,
                        'sumatif_lm_scores' => $sumatifLm,
                        'sas_score' => $sas,
                        'final_score' => $calculatedFinal,
                        'notes' => $notes,
                    ]
                );

                // Sync to student_grades for E-Rapor
                if ($calculatedFinal !== null && $teacherSubjectId) {
                    $letterGrade = 'C';
                    if ($calculatedFinal >= 89.00) {
                        $letterGrade = 'A';
                    } elseif ($calculatedFinal >= 78.00) {
                        $letterGrade = 'B';
                    } elseif ($calculatedFinal >= 65.00) {
                        $letterGrade = 'C';
                    } else {
                        $letterGrade = 'D';
                    }

                    $avgFormatif = 0;
                    $flatFormatif = [];
                    foreach ($formatif as $tpList) {
                        if (is_array($tpList)) {
                            foreach ($tpList as $val) {
                                if (is_numeric($val) && $val > 0) {
                                    $flatFormatif[] = (float) $val;
                                }
                            }
                        }
                    }
                    if (! empty($flatFormatif)) {
                        $avgFormatif = round(array_sum($flatFormatif) / count($flatFormatif), 2);
                    }

                    $avgLmVal = ! empty($lmScores) ? round(array_sum($lmScores) / count($lmScores), 2) : $calculatedFinal;

                    DB::table('student_grades')->updateOrInsert(
                        [
                            'student_id' => $studentId,
                            'teacher_subject_id' => $teacherSubjectId,
                            'academic_year_id' => $gradebook->academic_year_id,
                        ],
                        [
                            'tugas_avg' => $avgFormatif,
                            'uts_score' => $avgLmVal,
                            'uas_score' => $sas ?? $avgLmVal,
                            'final_score' => $calculatedFinal,
                            'letter_grade' => $letterGrade,
                            'competency_desc' => $notes,
                            'updated_at' => now(),
                        ]
                    );
                }
            }
        });

        return back()->with('message', 'Seluruh data nilai siswa berhasil disimpan.');
    }

    /**
     * Update material scopes (Lingkup Materi & TP configuration)
     */
    public function updateConfig(Request $request)
    {
        $request->validate([
            'gradebook_id' => 'required|exists:academic_gradebooks,id',
            'material_scopes' => 'required|array',
            'material_scopes.*.id' => 'required|string',
            'material_scopes.*.name' => 'required|string',
            'material_scopes.*.tps' => 'required|array',
        ]);

        $gradebook = AcademicGradebook::findOrFail($request->gradebook_id);

        $user = auth()->user();
        $userRole = $user->role ?? 'guru';
        $teacher = DB::table('teachers')->where('user_id', $user->id)->first();
        $isStaffOrAdmin = in_array($userRole, ['admin', 'pimpinan']);

        if ($teacher && ! $isStaffOrAdmin) {
            $teacherClassIds = $this->getTeacherClassIds($teacher);
            if (! empty($teacherClassIds) && ! in_array($gradebook->class_id, $teacherClassIds)) {
                abort(403, 'Anda tidak memiliki hak akses untuk mengubah konfigurasi kelas ini.');
            }
        }

        $gradebook->update([
            'material_scopes' => $request->material_scopes,
        ]);

        return back()->with('message', 'Konfigurasi Lingkup Materi dan TP berhasil disimpan.');
    }

    /**
     * Export official Kurikulum Merdeka Gradebook Excel file (.xlsx)
     */
    public function exportExcel(Request $request): StreamedResponse
    {
        $classId = (int) $request->query('class_id', 1);
        $subjectId = (int) $request->query('subject_id', 1);
        $semester = (int) $request->query('semester', 2);

        $user = auth()->user();
        $userRole = $user->role ?? 'guru';
        $teacher = DB::table('teachers')->where('user_id', $user->id)->first();
        $isStaffOrAdmin = in_array($userRole, ['admin', 'pimpinan']);

        if ($teacher && ! $isStaffOrAdmin) {
            $teacherClassIds = $this->getTeacherClassIds($teacher);
            if (! empty($teacherClassIds) && ! in_array($classId, $teacherClassIds)) {
                abort(403, 'Anda tidak memiliki hak akses untuk mengekspor nilai kelas ini.');
            }
        }

        $activeAcademicYear = DB::table('academic_years')->where('is_active', true)->first();
        $academicYearId = $activeAcademicYear?->id ?? 1;

        $class = DB::table('classes')->where('id', $classId)->first();
        $subject = DB::table('subjects')->where('id', $subjectId)->first();
        $schoolProfile = DB::table('school_profiles')->first();

        $homeroomTeacher = null;
        if ($class && $class->homeroom_teacher_id) {
            $homeroomTeacher = DB::table('teachers')->where('id', $class->homeroom_teacher_id)->first();
        }

        $gradebook = AcademicGradebook::firstOrCreate(
            [
                'academic_year_id' => $academicYearId,
                'class_id' => $classId,
                'subject_id' => $subjectId,
                'semester' => $semester,
            ],
            [
                'material_scopes' => $this->getDefaultMaterialScopes($semester),
            ]
        );

        $materialScopes = $gradebook->material_scopes ?? $this->getDefaultMaterialScopes($semester);

        $students = DB::table('students')
            ->where('class_id', $classId)
            ->where('status', 'aktif')
            ->select('id', 'nisn', 'nis', 'full_name')
            ->orderBy('full_name')
            ->get();

        $scoresMap = AcademicGradebookScore::where('gradebook_id', $gradebook->id)
            ->get()
            ->keyBy('student_id');

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle(substr($subject?->name ?? 'Nilai', 0, 31));

        // Document Title & School Headers
        $sheet->setCellValue('A1', 'DAFTAR NILAI SEMESTER ' . $semester);
        $sheet->setCellValue('A2', strtoupper($schoolProfile?->name ?? 'UPT SDN 9 GANDANGBATU SILLANAN'));
        $sheet->setCellValue('B3', 'Kelas');
        $sheet->setCellValue('D3', ': ' . ($class?->name ?? '1'));
        $sheet->setCellValue('B4', 'Mata Pelajaran');
        $sheet->setCellValue('D4', ': ' . ($subject?->name ?? '-'));

        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
        $sheet->getStyle('A2')->getFont()->setBold(true)->setSize(12);
        $sheet->getStyle('B3:D4')->getFont()->setBold(true)->setSize(10);

        // Header Structure Rows 6, 7, 8
        $sheet->setCellValue('A6', 'No.');
        $sheet->setCellValue('B6', 'NO. INDUK');
        $sheet->setCellValue('C6', 'NAMA');

        $sheet->mergeCells('A6:A8');
        $sheet->mergeCells('B6:B8');
        $sheet->mergeCells('C6:C8');

        $colIdx = 5; // Column E
        $formatifStartCol = Coordinate::stringFromColumnIndex($colIdx);

        // Build Formatif Columns per LM and TP
        $formatifColMap = []; // ['lm_id' => ['tp' => colIndex]]
        foreach ($materialScopes as $lm) {
            $lmId = $lm['id'];
            $lmName = $lm['name'];
            $tps = $lm['tps'] ?? ['TP1', 'TP2', 'TP3', 'TP4'];

            $lmStartColIdx = $colIdx;
            foreach ($tps as $tp) {
                $colLetter = Coordinate::stringFromColumnIndex($colIdx);
                $sheet->setCellValue($colLetter . '8', $tp);
                $formatifColMap[$lmId][$tp] = $colLetter;
                $colIdx++;
            }
            $lmEndColIdx = $colIdx - 1;

            $startLetter = Coordinate::stringFromColumnIndex($lmStartColIdx);
            $endLetter = Coordinate::stringFromColumnIndex($lmEndColIdx);

            $sheet->setCellValue($startLetter . '7', $lmName);
            if ($lmStartColIdx < $lmEndColIdx) {
                $sheet->mergeCells("{$startLetter}7:{$endLetter}7");
            }
        }

        $formatifEndColIdx = $colIdx - 1;
        $formatifEndCol = Coordinate::stringFromColumnIndex($formatifEndColIdx);

        $sheet->setCellValue($formatifStartCol . '6', 'FORMATIF');
        $sheet->mergeCells("{$formatifStartCol}6:{$formatifEndCol}6");

        // Sumatif Lingkup Materi Block
        $sumatifLmStartColIdx = $colIdx;
        $sumatifLmColMap = [];
        foreach ($materialScopes as $sIdx => $lm) {
            $colLetter = Coordinate::stringFromColumnIndex($colIdx);
            $lmCode = 'LM' . ($sIdx + 1);
            $sheet->setCellValue($colLetter . '8', $lmCode);
            $sumatifLmColMap[$lm['id']] = $colLetter;
            $colIdx++;
        }
        $sumatifLmEndColIdx = $colIdx - 1;

        $sumatifStartLetter = Coordinate::stringFromColumnIndex($sumatifLmStartColIdx);
        $sumatifEndLetter = Coordinate::stringFromColumnIndex($sumatifLmEndColIdx);

        $sheet->setCellValue($sumatifStartLetter . '6', 'Sumatif Lingkup Materi');
        $sheet->mergeCells("{$sumatifStartLetter}6:{$sumatifEndLetter}7");

        // Sumatif Akhir Semester Column
        $sasColLetter = Coordinate::stringFromColumnIndex($colIdx);
        $sheet->setCellValue($sasColLetter . '6', "Sumatif\nAkhir\nSemester");
        $sheet->mergeCells("{$sasColLetter}6:{$sasColLetter}8");
        $colIdx++;

        // Nilai Akhir (NA) Column
        $naColLetter = Coordinate::stringFromColumnIndex($colIdx);
        $sheet->setCellValue($naColLetter . '6', "Nilai\nAkhir");
        $sheet->mergeCells("{$naColLetter}6:{$naColLetter}8");

        $highestHeaderCol = $naColLetter;

        // Data Rows
        $currentRow = 9;
        foreach ($students as $sIdx => $st) {
            $scoreRecord = $scoresMap->get($st->id);
            $formatif = $scoreRecord?->formatif_scores ?? [];
            $sumatifLm = $scoreRecord?->sumatif_lm_scores ?? [];
            $sas = $scoreRecord?->sas_score !== null ? (float) $scoreRecord->sas_score : '';
            $final = $scoreRecord?->final_score !== null ? (float) $scoreRecord->final_score : '';

            $sheet->setCellValue('A' . $currentRow, $sIdx + 1);
            $sheet->setCellValue('B' . $currentRow, $st->nisn ?: $st->nis);
            $sheet->setCellValue('C' . $currentRow, $st->full_name);

            // Populate Formatif
            foreach ($materialScopes as $lm) {
                $lmId = $lm['id'];
                $tps = $lm['tps'] ?? [];
                foreach ($tps as $tp) {
                    if (isset($formatifColMap[$lmId][$tp])) {
                        $colL = $formatifColMap[$lmId][$tp];
                        $val = $formatif[$lmId][$tp] ?? '';
                        $sheet->setCellValue($colL . $currentRow, $val !== '' ? (float) $val : '');
                    }
                }
            }

            // Populate Sumatif LM
            foreach ($materialScopes as $lm) {
                $lmId = $lm['id'];
                if (isset($sumatifLmColMap[$lmId])) {
                    $colL = $sumatifLmColMap[$lmId];
                    $val = $sumatifLm[$lmId] ?? '';
                    $sheet->setCellValue($colL . $currentRow, $val !== '' ? (float) $val : '');
                }
            }

            // Populate SAS & Final
            $sheet->setCellValue($sasColLetter . $currentRow, $sas);
            $sheet->setCellValue($naColLetter . $currentRow, $final);

            $currentRow++;
        }

        // Table Styling & Borders
        $headerStyle = [
            'font' => ['bold' => true, 'size' => 9],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                'wrapText' => true,
            ],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => 'F1F5F9'],
            ],
        ];

        $sheet->getStyle("A6:{$highestHeaderCol}8")->applyFromArray($headerStyle);

        // Data Rows Borders & Alignment
        $dataEndRow = $currentRow - 1;
        if ($dataEndRow >= 9) {
            $sheet->getStyle("A9:{$highestHeaderCol}{$dataEndRow}")->applyFromArray([
                'font' => ['size' => 9],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
                'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
            ]);
            $sheet->getStyle("A9:A{$dataEndRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("B9:B{$dataEndRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("D9:{$highestHeaderCol}{$dataEndRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        }

        // Signature Section
        $sigRow = $currentRow + 2;
        $sheet->setCellValue('C' . $sigRow, 'Mengetahui,');
        $sheet->setCellValue('J' . $sigRow, 'Keterangan:');
        $sheet->setCellValue($sumatifStartLetter . $sigRow, 'Guru Kelas / Pengampu,');

        $sheet->setCellValue('C' . ($sigRow + 1), 'Kepala Sekolah');
        $sheet->setCellValue('J' . ($sigRow + 1), 'TP = Tujuan Pembelajaran');
        $sheet->setCellValue('J' . ($sigRow + 2), 'LM = Lingkup Materi');

        $principalName = $schoolProfile?->principal_name ?? 'DINA SENTI LUDEN, S.Th';
        $principalNip = $schoolProfile?->principal_nip ?? '19660418 198511 2 001';

        $teacherName = $homeroomTeacher?->full_name ?? 'ELISABET DURUK, S.Pd.';
        $teacherNip = $homeroomTeacher?->nip ?? '19670407 200801 2 010';

        $sheet->setCellValue('C' . ($sigRow + 4), $principalName);
        $sheet->setCellValue('C' . ($sigRow + 5), 'NIP. ' . $principalNip);

        $sheet->setCellValue($sumatifStartLetter . ($sigRow + 4), $teacherName);
        $sheet->setCellValue($sumatifStartLetter . ($sigRow + 5), 'NIP. ' . $teacherNip);

        $sheet->getStyle("C" . ($sigRow + 4))->getFont()->setBold(true)->setUnderline(true);
        $sheet->getStyle($sumatifStartLetter . ($sigRow + 4))->getFont()->setBold(true)->setUnderline(true);

        // Auto column widths
        foreach (range(1, Coordinate::columnIndexFromString($highestHeaderCol)) as $cIdx) {
            $colString = Coordinate::stringFromColumnIndex($cIdx);
            if ($colString === 'A') {
                $sheet->getColumnDimension($colString)->setWidth(5);
            } elseif ($colString === 'B') {
                $sheet->getColumnDimension($colString)->setWidth(16);
            } elseif ($colString === 'C') {
                $sheet->getColumnDimension($colString)->setWidth(28);
            } else {
                $sheet->getColumnDimension($colString)->setWidth(8);
            }
        }

        $safeClass = preg_replace('/[^A-Za-z0-9]/', '_', $class?->name ?? 'Kelas');
        $safeSubject = preg_replace('/[^A-Za-z0-9]/', '_', $subject?->name ?? 'Mapel');
        $fileName = "DAFTAR_NILAI_{$safeClass}_{$safeSubject}_SMT{$semester}.xlsx";

        return response()->streamDownload(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        }, $fileName, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Cache-Control' => 'max-age=0',
        ]);
    }

    /**
     * Import official Kurikulum Merdeka Gradebook Excel file (.xlsx)
     */
    public function importExcel(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'semester' => 'required|integer|in:1,2',
        ]);

        $file = $request->file('file');
        $classId = (int) $request->input('class_id');
        $subjectId = (int) $request->input('subject_id');
        $semester = (int) $request->input('semester', 2);

        $user = auth()->user();
        $userRole = $user->role ?? 'guru';
        $teacher = DB::table('teachers')->where('user_id', $user->id)->first();
        $isStaffOrAdmin = in_array($userRole, ['admin', 'pimpinan']);

        if ($teacher && ! $isStaffOrAdmin) {
            $teacherClassIds = $this->getTeacherClassIds($teacher);
            if (! empty($teacherClassIds) && ! in_array($classId, $teacherClassIds)) {
                abort(403, 'Anda tidak memiliki hak akses untuk mengimpor nilai ke kelas ini.');
            }
        }

        $activeAcademicYear = DB::table('academic_years')->where('is_active', true)->first();
        $academicYearId = $activeAcademicYear?->id ?? 1;

        $targetSubject = DB::table('subjects')->where('id', $subjectId)->first();

        // Load gradebook
        $gradebook = AcademicGradebook::firstOrCreate(
            [
                'academic_year_id' => $academicYearId,
                'class_id' => $classId,
                'subject_id' => $subjectId,
                'semester' => $semester,
            ],
            [
                'material_scopes' => $this->getDefaultMaterialScopes($semester),
            ]
        );

        $materialScopes = $gradebook->material_scopes ?? $this->getDefaultMaterialScopes($semester);

        // Load all class students
        $classStudents = DB::table('students')
            ->where('class_id', $classId)
            ->select('id', 'nisn', 'nis', 'full_name')
            ->get();

        $spreadsheet = IOFactory::load($file->getRealPath());

        // Determine active worksheet
        $selectedSheet = null;
        $targetSubjName = strtolower($targetSubject?->name ?? '');

        // Try to match sheet name by subject name
        foreach ($spreadsheet->getSheetNames() as $sIdx => $sName) {
            $cleanSheetName = strtolower(trim($sName));
            if (
                stripos($cleanSheetName, $targetSubjName) !== false ||
                stripos($targetSubjName, $cleanSheetName) !== false ||
                ($targetSubjName === 'pendidikan pancasila dan kewarganegaraan' && (stripos($cleanSheetName, 'ppkn') !== false || stripos($cleanSheetName, 'pancasila') !== false)) ||
                (stripos($targetSubjName, 'seni') !== false && stripos($cleanSheetName, 'seni') !== false)
            ) {
                $selectedSheet = $spreadsheet->getSheet($sIdx);
                break;
            }
        }

        // If no sheet matches subject name, use active sheet
        if (! $selectedSheet) {
            $selectedSheet = $spreadsheet->getActiveSheet();
        }

        $highestCol = $selectedSheet->getHighestColumn();
        $maxColIdx = Coordinate::columnIndexFromString($highestCol);

        // Find header rows
        $formatifRow = 6;
        $lmRow = 7;
        $tpRow = 8;
        for ($r = 5; $r <= 10; $r++) {
            $rowConcat = '';
            for ($c = 1; $c <= min($maxColIdx, 15); $c++) {
                $colL = Coordinate::stringFromColumnIndex($c);
                $rowConcat .= ' ' . $selectedSheet->getCell($colL . $r)->getValue();
            }
            if (stripos($rowConcat, 'FORMATIF') !== false) {
                $formatifRow = $r;
                $lmRow = $r + 1;
                $tpRow = $r + 2;
                break;
            }
        }

        // Detect Formatif & Sumatif Columns
        $formatifCols = []; // [colIndex => ['lm_key' => 'lm1', 'tp' => 'TP1']]
        $sumatifLmCols = []; // [colIndex => 'lm1']
        $sasColIdx = null;

        $currentLmIdx = 0;
        for ($c = 4; $c <= $maxColIdx; $c++) {
            $colL = Coordinate::stringFromColumnIndex($c);
            $lmCell = trim((string) $selectedSheet->getCell($colL . $lmRow)->getValue());
            if (! empty($lmCell) && stripos($lmCell, 'Lingkup Materi') !== false) {
                $currentLmIdx++;
            }

            $tpCell = strtoupper(trim((string) $selectedSheet->getCell($colL . $tpRow)->getValue()));
            $row6Cell = strtoupper(str_replace(["\r", "\n", " "], '', (string) $selectedSheet->getCell($colL . $formatifRow)->getValue()));
            $row7Cell = strtoupper(str_replace(["\r", "\n", " "], '', (string) $selectedSheet->getCell($colL . $lmRow)->getValue()));

            if (
                stripos($row6Cell, 'SUMATIFAKHIR') !== false ||
                stripos($row7Cell, 'SUMATIFAKHIR') !== false ||
                stripos($tpCell, 'SAS') !== false
            ) {
                $sasColIdx = $c;
            } elseif (preg_match('/^LM(\d+)$/i', $tpCell, $m)) {
                $lmNum = (int) $m[1];
                $sumatifLmCols[$c] = 'lm' . $lmNum;
            } elseif (preg_match('/^TP(\d+)$/i', $tpCell)) {
                $lmKey = 'lm' . max(1, $currentLmIdx);
                $formatifCols[$c] = [
                    'lm_key' => $lmKey,
                    'tp' => $tpCell,
                ];
            }
        }

        // If no sumatif cols detected by LM tag, check default positions
        if (empty($sumatifLmCols) && ! empty($formatifCols)) {
            $lastFormatifCol = max(array_keys($formatifCols));
            for ($k = 1; $k <= count($materialScopes); $k++) {
                $targetCol = $lastFormatifCol + $k;
                if ($targetCol <= $maxColIdx && $targetCol !== $sasColIdx) {
                    $sumatifLmCols[$targetCol] = 'lm' . $k;
                }
            }
        }

        // Parse student rows & import
        $importedCount = 0;
        $startRow = $tpRow + 1;
        $highestRow = $selectedSheet->getHighestRow();

        DB::transaction(function () use (
            $selectedSheet,
            $startRow,
            $highestRow,
            $classStudents,
            $formatifCols,
            $sumatifLmCols,
            $sasColIdx,
            $gradebook,
            &$importedCount
        ) {
            for ($r = $startRow; $r <= $highestRow; $r++) {
                $namaCell = trim((string) $selectedSheet->getCell('C' . $r)->getValue());
                $nisnCell = trim((string) $selectedSheet->getCell('B' . $r)->getValue());
                $noCell = trim((string) $selectedSheet->getCell('A' . $r)->getValue());

                if (stripos($namaCell, 'Mengetahui') !== false || stripos($noCell, 'Mengetahui') !== false) {
                    break;
                }
                if (empty($namaCell) && empty($noCell) && empty($nisnCell)) {
                    continue;
                }

                // Match student in class
                $matchedStudent = null;
                if (! empty($nisnCell)) {
                    $matchedStudent = $classStudents->first(function ($s) use ($nisnCell) {
                        return (string) $s->nisn === (string) $nisnCell || (string) $s->nis === (string) $nisnCell;
                    });
                }

                if (! $matchedStudent && ! empty($namaCell)) {
                    $cleanNama = strtolower(preg_replace('/[^a-zA-Z]/', '', $namaCell));
                    $matchedStudent = $classStudents->first(function ($s) use ($cleanNama) {
                        $sClean = strtolower(preg_replace('/[^a-zA-Z]/', '', $s->full_name));
                        return $sClean === $cleanNama || stripos($sClean, $cleanNama) !== false || stripos($cleanNama, $sClean) !== false;
                    });
                }

                if (! $matchedStudent) {
                    continue;
                }

                // Extract formatif scores
                $studentFormatif = [];
                foreach ($formatifCols as $cIdx => $meta) {
                    $colL = Coordinate::stringFromColumnIndex($cIdx);
                    $val = $selectedSheet->getCell($colL . $r)->getValue();
                    if ($val !== null && $val !== '' && is_numeric($val)) {
                        $studentFormatif[$meta['lm_key']][$meta['tp']] = (float) $val;
                    }
                }

                // Extract sumatif LM scores
                $studentSumatifLm = [];
                foreach ($sumatifLmCols as $cIdx => $lmKey) {
                    $colL = Coordinate::stringFromColumnIndex($cIdx);
                    $val = $selectedSheet->getCell($colL . $r)->getValue();
                    if ($val !== null && $val !== '' && is_numeric($val)) {
                        $studentSumatifLm[$lmKey] = (float) $val;
                    }
                }

                // Extract SAS
                $sasVal = null;
                if ($sasColIdx) {
                    $colL = Coordinate::stringFromColumnIndex($sasColIdx);
                    $v = $selectedSheet->getCell($colL . $r)->getValue();
                    if ($v !== null && $v !== '' && is_numeric($v)) {
                        $sasVal = (float) $v;
                    }
                }

                // Calculate Final Score
                $calculatedFinal = null;
                $lmScores = array_values($studentSumatifLm);
                if (! empty($lmScores) || $sasVal !== null) {
                    $avgLm = ! empty($lmScores) ? (array_sum($lmScores) / count($lmScores)) : ($sasVal ?? 0);
                    if ($sasVal !== null && ! empty($lmScores)) {
                        $calculatedFinal = round(($avgLm * 0.6) + ($sasVal * 0.4), 2);
                    } else {
                        $calculatedFinal = round($avgLm, 2);
                    }
                }

                // Save or update score
                AcademicGradebookScore::updateOrCreate(
                    [
                        'gradebook_id' => $gradebook->id,
                        'student_id' => $matchedStudent->id,
                    ],
                    [
                        'formatif_scores' => $studentFormatif,
                        'sumatif_lm_scores' => $studentSumatifLm,
                        'sas_score' => $sasVal,
                        'final_score' => $calculatedFinal,
                    ]
                );

                $importedCount++;
            }
        });

        return back()->with('message', "Sukses mengimpor nilai untuk {$importedCount} siswa dari lembar '{$selectedSheet->getTitle()}'.");
    }

    /**
     * Download template pre-filled with class students
     */
    public function downloadTemplate(Request $request): StreamedResponse
    {
        return $this->exportExcel($request);
    }
}
