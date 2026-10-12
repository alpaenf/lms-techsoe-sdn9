<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeacherJournal extends Model
{
    use HasFactory;

    protected $table = 'teacher_journals';

    protected $fillable = [
        'teacher_id',
        'academic_year_id',
        'class_id',
        'subject_id',
        'journal_date',
        'day_name',
        'start_time',
        'end_time',
        'material_topic',
        'activity_description',
        'learning_media',
        'attendance_notes',
        'notes',
        'status',
    ];

    protected $casts = [
        'journal_date' => 'date',
    ];

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class, 'academic_year_id');
    }

    public function class(): BelongsTo
    {
        return $this->belongsTo(Classes::class, 'class_id');
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }
}
