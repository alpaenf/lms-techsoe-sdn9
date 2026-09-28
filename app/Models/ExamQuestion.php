<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExamQuestion extends Model
{
    protected $fillable = [
        'exam_id',
        'question_type',
        'question_text',
        'question_image',
        'options',
        'correct_answer',
        'points',
        'order_number',
    ];

    protected $casts = [
        'options' => 'array',
        'points' => 'integer',
    ];

    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(StudentAnswer::class, 'question_id');
    }

    public function checkAnswer($studentAnswer): ?bool
    {
        if ($this->question_type === 'multiple_choice') {
            return $this->correct_answer === $studentAnswer;
        }

        if ($this->question_type === 'short_answer') {
            return strcasecmp(trim((string) $this->correct_answer), trim((string) $studentAnswer)) === 0;
        }

        return null;
    }

    public function getPointsForAnswer($studentAnswer): float
    {
        $isCorrect = $this->checkAnswer($studentAnswer);

        if ($isCorrect === true) {
            return $this->points;
        }

        return 0;
    }
}
