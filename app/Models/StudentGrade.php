<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentGrade extends Model
{
    protected $table = 'student_grades';

    protected $fillable = [
        'student_id',
        'teacher_subject_id',
        'academic_year_id',
        'grade_type',
        'tugas_avg',
        'uts_score',
        'uas_score',
        'final_score',
        'letter_grade',
        'competency_desc',
        'exam_id',
    ];

    protected $casts = [
        'tugas_avg' => 'decimal:2',
        'uts_score' => 'decimal:2',
        'uas_score' => 'decimal:2',
        'final_score' => 'decimal:2',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }
}
