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
        'question_images',
        'image_alignment',
        'image_position',
        'options',
        'option_images',
        'correct_answer',
        'points',
        'order_number',
    ];

    protected $casts = [
        'options' => 'array',
        'option_images' => 'array',
        'question_images' => 'array',
        'points' => 'integer',
    ];

    /**
     * Mendapatkan daftar seluruh berkas gambar soal (multiple images dengan fallback single image).
     *
     * @return array<int, string>
     */
    public function getAllImages(): array
    {
        if (is_array($this->question_images) && ! empty($this->question_images)) {
            return array_values(array_filter($this->question_images));
        }

        if (! empty($this->question_image)) {
            return [$this->question_image];
        }

        return [];
    }

    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(StudentAnswer::class, 'question_id');
    }

    /**
     * Mengevaluasi apakah jawaban siswa benar.
     * Mengembalikan true jika benar, false jika salah, atau null jika butuh pemeriksaan manual (essay).
     */
    public function checkAnswer($studentAnswer): ?bool
    {
        if ($this->question_type === 'multiple_choice') {
            return $this->correct_answer === $studentAnswer;
        }

        if ($this->question_type === 'short_answer') {
            return strcasecmp(trim((string) $this->correct_answer), trim((string) $studentAnswer)) === 0;
        }

        // PGK MCMA (Kotak Centang - Jawaban Lebih dari Satu) - All or Nothing
        if ($this->question_type === 'pgk_mcma') {
            $correct = $this->parseJsonArray($this->correct_answer);
            $student = $this->parseJsonArray($studentAnswer);

            if (empty($correct) || empty($student)) {
                return false;
            }

            sort($correct);
            sort($student);

            return $correct === $student;
        }

        // PGK Kategori (Tabel Benar / Salah) - All or Nothing
        if ($this->question_type === 'pgk_kategori') {
            $correctMap = $this->parseJsonMap($this->correct_answer);
            $studentMap = $this->parseJsonMap($studentAnswer);

            if (empty($correctMap) || empty($studentMap)) {
                return false;
            }

            // Jumlah pernyataan yang dijawab harus sama persis
            if (count($correctMap) !== count($studentMap)) {
                return false;
            }

            // Setiap baris pernyataan wajib sesuai dengan kunci
            foreach ($correctMap as $rowKey => $expectedVal) {
                if (! isset($studentMap[$rowKey])) {
                    return false;
                }
                if (strcasecmp(trim((string) $expectedVal), trim((string) $studentMap[$rowKey])) !== 0) {
                    return false;
                }
            }

            return true;
        }

        return null;
    }

    /**
     * Menghitung poin yang diperoleh siswa berdasarkan evaluasi jawaban.
     */
    public function getPointsForAnswer($studentAnswer): float
    {
        $isCorrect = $this->checkAnswer($studentAnswer);

        if ($isCorrect === true) {
            return (float) $this->points;
        }

        return 0.0;
    }

    /**
     * Helper untuk parse array JSON atau string ke list array sederhana.
     */
    public function parseJsonArray($value): array
    {
        if (is_array($value)) {
            return array_values(array_filter(array_map('strval', $value), fn ($v) => trim($v) !== ''));
        }

        if (is_string($value)) {
            $decoded = json_decode($value, true);
            if (is_array($decoded)) {
                return array_values(array_filter(array_map('strval', $decoded), fn ($v) => trim($v) !== ''));
            }
            $trimmed = trim($value);

            return $trimmed !== '' ? [$trimmed] : [];
        }

        return [];
    }

    /**
     * Helper untuk parse map/asosiatif JSON ke array asosiatif.
     */
    public function parseJsonMap($value): array
    {
        if (is_array($value)) {
            return $value;
        }

        if (is_string($value)) {
            $decoded = json_decode($value, true);
            if (is_array($decoded)) {
                return $decoded;
            }
        }

        return [];
    }
}
