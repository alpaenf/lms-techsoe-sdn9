<?php

namespace App\Services;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ReligionService
{
    public const RELIGION_ISLAM = 'Islam';
    public const RELIGION_KRISTEN = 'Kristen';
    public const RELIGION_KATOLIK = 'Katolik';
    public const RELIGION_HINDU = 'Hindu';
    public const RELIGION_BUDDHA = 'Buddha';
    public const RELIGION_KHONGHUCU = 'Khonghucu';

    /**
     * Standard list of religions.
     */
    public const RELIGIONS = [
        self::RELIGION_ISLAM,
        self::RELIGION_KRISTEN,
        self::RELIGION_KATOLIK,
        self::RELIGION_HINDU,
        self::RELIGION_BUDDHA,
        self::RELIGION_KHONGHUCU,
    ];

    /**
     * Normalize religion name to standard form.
     */
    public static function normalize(?string $religion): ?string
    {
        if ($religion === null || trim($religion) === '') {
            return null;
        }

        $r = strtolower(trim($religion));

        if (str_contains($r, 'islam')) {
            return self::RELIGION_ISLAM;
        }
        if (str_contains($r, 'katolik')) {
            return self::RELIGION_KATOLIK;
        }
        if (str_contains($r, 'kristen') || str_contains($r, 'protestan')) {
            return self::RELIGION_KRISTEN;
        }
        if (str_contains($r, 'hindu')) {
            return self::RELIGION_HINDU;
        }
        if (str_contains($r, 'buddh') || str_contains($r, 'budh')) {
            return self::RELIGION_BUDDHA;
        }
        if (str_contains($r, 'khonghucu') || str_contains($r, 'konghucu') || str_contains($r, 'kong hu cu')) {
            return self::RELIGION_KHONGHUCU;
        }

        return ucfirst($religion);
    }

    /**
     * Detect religion from a string (subject name, code, or specialization).
     * Returns null if text does not indicate a religion.
     */
    public static function detectReligion(?string $text): ?string
    {
        if ($text === null || trim($text) === '') {
            return null;
        }

        $t = strtolower(trim($text));

        // Katolik check first (distinct from Kristen)
        if (str_contains($t, 'katolik')) {
            return self::RELIGION_KATOLIK;
        }

        // Islam check (Islam, PAI)
        if (str_contains($t, 'islam') || preg_match('/\b(pai|pai-sd)\b/i', $t)) {
            return self::RELIGION_ISLAM;
        }

        // Kristen / Protestan / PAK
        if (str_contains($t, 'kristen') || str_contains($t, 'protestan') || preg_match('/\b(pak|pak-sd)\b/i', $t)) {
            return self::RELIGION_KRISTEN;
        }

        // Hindu
        if (str_contains($t, 'hindu')) {
            return self::RELIGION_HINDU;
        }

        // Buddha
        if (str_contains($t, 'buddh') || str_contains($t, 'budh')) {
            return self::RELIGION_BUDDHA;
        }

        // Khonghucu
        if (str_contains($t, 'khonghucu') || str_contains($t, 'konghucu') || str_contains($t, 'kong hu cu')) {
            return self::RELIGION_KHONGHUCU;
        }

        return null;
    }

    /**
     * Detect religion from a subject (object, array, or ID).
     */
    public static function getSubjectReligion($subject): ?string
    {
        if (! $subject) {
            return null;
        }

        if (is_numeric($subject)) {
            $subject = DB::table('subjects')->where('id', $subject)->first();
            if (! $subject) {
                return null;
            }
        }

        $name = is_array($subject) ? ($subject['name'] ?? '') : ($subject->name ?? '');
        $code = is_array($subject) ? ($subject['code'] ?? '') : ($subject->code ?? '');

        return self::detectReligion($name) ?: self::detectReligion($code);
    }

    /**
     * Detect religion from a teacher (object, array, or ID).
     * Checks subject_specialization first, then teacher's claimed subjects.
     */
    public static function getTeacherReligion($teacher): ?string
    {
        if (! $teacher) {
            return null;
        }

        if (is_numeric($teacher)) {
            $teacher = DB::table('teachers')->where('id', $teacher)->first();
            if (! $teacher) {
                return null;
            }
        }

        $spec = is_array($teacher) ? ($teacher['subject_specialization'] ?? '') : ($teacher->subject_specialization ?? '');
        $religion = self::detectReligion($spec);
        if ($religion) {
            return $religion;
        }

        // Check claimed subjects in teacher_subjects
        $teacherId = is_array($teacher) ? ($teacher['id'] ?? null) : ($teacher->id ?? null);
        if ($teacherId) {
            $subjectIds = DB::table('teacher_subjects')
                ->where('teacher_id', $teacherId)
                ->pluck('subject_id')
                ->unique();

            foreach ($subjectIds as $sId) {
                $subj = DB::table('subjects')->where('id', $sId)->first();
                $r = self::getSubjectReligion($subj);
                if ($r) {
                    return $r;
                }
            }
        }

        return null;
    }

    /**
     * Check if a student can access a subject (or its assignments/materials).
     * Non-religious subjects (null) can be accessed by all students.
     * Religious subjects can only be accessed by students of matching religion.
     */
    public static function studentCanAccessSubject(?string $studentReligion, ?string $subjectReligion): bool
    {
        if ($subjectReligion === null) {
            return true;
        }

        $normStudent = self::normalize($studentReligion);

        return $normStudent === $subjectReligion;
    }

    /**
     * Filter a student collection/array by religion if a target religion is specified.
     *
     * @param  Collection|array  $students
     * @return Collection
     */
    public static function filterStudentsByReligion($students, ?string $targetReligion): Collection
    {
        $coll = $students instanceof Collection ? $students : collect($students);

        if (! $targetReligion) {
            return $coll;
        }

        $targetNorm = self::normalize($targetReligion);

        return $coll->filter(function ($student) use ($targetNorm) {
            $rel = is_array($student) ? ($student['religion'] ?? null) : ($student->religion ?? null);

            return self::normalize($rel) === $targetNorm;
        })->values();
    }

    /**
     * Filter students for a given subject.
     */
    public static function filterStudentsForSubject($students, $subject): Collection
    {
        $subjectRel = self::getSubjectReligion($subject);

        return self::filterStudentsByReligion($students, $subjectRel);
    }

    /**
     * Filter students for a given teacher (if the teacher teaches religion).
     */
    public static function filterStudentsForTeacher($students, $teacher): Collection
    {
        $teacherRel = self::getTeacherReligion($teacher);

        return self::filterStudentsByReligion($students, $teacherRel);
    }
}
