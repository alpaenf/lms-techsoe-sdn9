<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    protected $table = 'students';

    protected $fillable = [
        'user_id',
        'nis',
        'nisn',
        'nik',
        'full_name',
        'class_id',
        'gender',
        'birth_place',
        'birth_date',
        'religion',
        'address',
        'rt',
        'rw',
        'dusun',
        'kelurahan',
        'kecamatan',
        'postal_code',
        'residence_type',
        'transportation',
        'phone',
        'mobile_phone',
        'email',
        'skhun',
        'is_kps_recipient',
        'kps_number',
        'entry_date',
        'status',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'entry_date' => 'date',
    ];

    protected $appends = ['class_name'];

    public function getClassNameAttribute(): ?string
    {
        return $this->class?->name;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function class(): BelongsTo
    {
        return $this->belongsTo(Classes::class, 'class_id');
    }

    public function guardians(): HasMany
    {
        return $this->hasMany(Guardian::class, 'student_id');
    }

    public function examAttempts(): HasMany
    {
        return $this->hasMany(StudentExamAttempt::class, 'student_id');
    }

    public function grades(): HasMany
    {
        return $this->hasMany(StudentGrade::class, 'student_id');
    }
}
