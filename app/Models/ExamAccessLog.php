<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamAccessLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'attempt_id',
        'event_type',
        'metadata',
        'ip_address',
        'user_agent',
        'created_at',
    ];

    protected $casts = [
        'metadata' => 'array',
        'created_at' => 'datetime',
    ];

    public function attempt(): BelongsTo
    {
        return $this->belongsTo(StudentExamAttempt::class, 'attempt_id');
    }
}
