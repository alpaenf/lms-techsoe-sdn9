<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StudentExamAttempt extends Model
{
    protected $fillable = [
        'exam_id',
        'student_id',
        'attempt_number',
        'started_at',
        'submitted_at',
        'time_remaining_seconds',
        'auto_submitted',
        'total_score',
        'percentage',
        'status',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'submitted_at' => 'datetime',
        'auto_submitted' => 'boolean',
        'total_score' => 'decimal:2',
        'percentage' => 'decimal:2',
    ];

    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(StudentAnswer::class, 'attempt_id');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(ExamAccessLog::class, 'attempt_id');
    }

    public function calculateScore(): float
    {
        $totalEarned = (float) $this->answers()->sum('points_earned');
        $totalPossible = (float) $this->exam->totalPoints();

        $this->total_score = $totalEarned;
        $this->percentage = $totalPossible > 0 ? ($totalEarned / $totalPossible) * 100 : 0;
        $this->save();

        return (float) $this->percentage;
    }

    public function isFullyGraded(): bool
    {
        return ! $this->answers()
            ->whereHas('question', fn ($q) => $q->where('question_type', 'essay'))
            ->whereNull('is_correct')
            ->exists();
    }

    public function isTimeUp(): bool
    {
        $elapsed = now()->diffInSeconds($this->started_at);
        $duration = $this->exam->duration_minutes * 60;

        if ($elapsed >= $duration) {
            return true;
        }

        if ($this->exam->end_time && now()->greaterThan($this->exam->end_time)) {
            return true;
        }

        return false;
    }

    public function getRemainingSeconds(): int
    {
        $elapsed = now()->diffInSeconds($this->started_at);
        $duration = $this->exam->duration_minutes * 60;
        $remaining = $duration - $elapsed;

        if ($this->exam->end_time) {
            $secondsUntilEnd = now()->diffInSeconds($this->exam->end_time, false);
            if ($secondsUntilEnd < $remaining) {
                $remaining = max(0, $secondsUntilEnd);
            }
        }

        return (int) max(0, round($remaining));
    }

    public function getAnsweredCount(): int
    {
        return $this->answers()->whereNotNull('answer_text')->count();
    }

    public function isPassed(): bool
    {
        return $this->percentage >= $this->exam->passing_score;
    }
}
