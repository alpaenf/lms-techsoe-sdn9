<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Exam extends Model
{
    protected $fillable = [
        'teacher_id',
        'subject_id',
        'class_id',
        'academic_year_id',
        'title',
        'description',
        'duration_minutes',
        'start_time',
        'end_time',
        'max_attempts',
        'randomize_questions',
        'show_review',
        'show_result_immediately',
        'passing_score',
        'exam_category',
        'status',
    ];

    protected $casts = [
        'start_time' => 'datetime:Y-m-d\TH:i',
        'end_time' => 'datetime:Y-m-d\TH:i',
        'randomize_questions' => 'boolean',
        'show_review' => 'boolean',
        'show_result_immediately' => 'boolean',
        'passing_score' => 'decimal:2',
    ];

    protected $appends = ['total_points'];

    public function getTotalPointsAttribute(): int
    {
        return $this->totalPoints();
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function class(): BelongsTo
    {
        return $this->belongsTo(Classes::class, 'class_id');
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(ExamQuestion::class)->orderBy('order_number');
    }

    public function attempts(): HasMany
    {
        return $this->hasMany(StudentExamAttempt::class);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeAvailable($query)
    {
        return $query->published()
            ->where('start_time', '<=', now())
            ->where('end_time', '>=', now());
    }

    public function isAvailable(): bool
    {
        return $this->status === 'published'
            && now()->between($this->start_time, $this->end_time);
    }

    public function totalPoints(): int
    {
        return (int) $this->questions()->sum('points');
    }

    public function hasStarted(): bool
    {
        return now()->greaterThanOrEqualTo($this->start_time);
    }

    public function hasEnded(): bool
    {
        return now()->greaterThan($this->end_time);
    }
}
