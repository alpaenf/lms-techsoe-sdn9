<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subject extends Model
{
    protected $table = 'subjects';

    protected $fillable = [
        'code',
        'name',
        'category',
        'kkm',
    ];

    protected $casts = [
        'kkm' => 'decimal:2',
    ];

    public function exams(): HasMany
    {
        return $this->hasMany(Exam::class, 'subject_id');
    }
}
