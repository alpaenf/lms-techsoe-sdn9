<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AcademicYear extends Model
{
    protected $table = 'academic_years';

    protected $fillable = [
        'name',
        'semester',
        'is_active',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function classes(): HasMany
    {
        return $this->hasMany(Classes::class);
    }

    public function exams(): HasMany
    {
        return $this->hasMany(Exam::class);
    }
}
