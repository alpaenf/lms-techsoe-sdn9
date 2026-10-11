<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Guardian extends Model
{
    protected $table = 'guardians';

    protected $fillable = [
        'student_id',
        'relation_type',
        'name',
        'birth_year',
        'education',
        'occupation',
        'income',
        'nik',
        'phone_number',
        'address',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
