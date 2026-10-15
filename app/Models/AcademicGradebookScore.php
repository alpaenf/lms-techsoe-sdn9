<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AcademicGradebookScore extends Model
{
    protected $table = 'academic_gradebook_scores';

    protected $fillable = [
        'gradebook_id',
        'student_id',
        'formatif_scores',
        'sumatif_lm_scores',
        'sas_score',
        'final_score',
        'notes',
    ];

    protected $casts = [
        'formatif_scores' => 'array',
        'sumatif_lm_scores' => 'array',
        'sas_score' => 'decimal:2',
        'final_score' => 'decimal:2',
    ];

    public function gradebook(): BelongsTo
    {
        return $this->belongsTo(AcademicGradebook::class, 'gradebook_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
