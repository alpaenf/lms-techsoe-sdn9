<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentAnswer extends Model
{
    protected $fillable = [
        'attempt_id',
        'question_id',
        'answer_text',
        'answer_file',
        'is_correct',
        'points_earned',
        'graded_at',
        'graded_by',
        'feedback',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
        'points_earned' => 'decimal:2',
        'graded_at' => 'datetime',
    ];

    public function attempt(): BelongsTo
    {
        return $this->belongsTo(StudentExamAttempt::class, 'attempt_id');
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(ExamQuestion::class, 'question_id');
    }

    public function grader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'graded_by');
    }

    public function needsGrading(): bool
    {
        return $this->question->question_type === 'essay' && is_null($this->is_correct);
    }
}
