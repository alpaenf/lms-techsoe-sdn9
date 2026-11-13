<?php

namespace App\Services;

use App\Models\Exam;
use Illuminate\Support\Facades\DB;

class ExamWordExportService
{
    protected Exam $exam;
    protected array $images = [];
    protected int $imageCounter = 0;

    public function __construct(?Exam $exam = null)
    {
        if ($exam) {
            $this->exam = $exam->loadMissing(['subject', 'class', 'classes', 'academicYear', 'teacher.user', 'questions']);
        }
    }

    /**
     * Generate .docx file and return temporary file path.
     */
    public function generate(?Exam $exam = null): string
    {
        if ($exam) {
            $this->exam = $exam->loadMissing(['subject', 'class', 'classes', 'academicYear', 'teacher.user', 'questions']);
        }

        $this->images = [];
        $this->imageCounter = 0;

        $tempFile = tempnam(sys_get_temp_dir(), 'exam_word_') . '.docx';

        if (class_exists(\ZipArchive::class)) {
            $zip = new \ZipArchive();
            if ($zip->open($tempFile, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) !== true) {
                $zip = new SimpleZipWriter($tempFile);
            }
        } else {
            $zip = new SimpleZipWriter($tempFile);
        }

        $documentXml = $this->buildDocumentXml();
        $relsXml = $this->buildDocumentRelsXml();
        $contentTypesXml = $this->buildContentTypesXml();
        $rootRelsXml = $this->buildRootRelsXml();
        $stylesXml = $this->buildStylesXml();

        // 1. Root rels
        $zip->addFromString('_rels/.rels', $rootRelsXml);

        // 2. Content Types
        $zip->addFromString('[Content_Types].xml', $contentTypesXml);

        // 3. Word files
        $zip->addFromString('word/document.xml', $documentXml);
        $zip->addFromString('word/styles.xml', $stylesXml);
        $zip->addFromString('word/_rels/document.xml.rels', $relsXml);

        // 4. Media/Images
        foreach ($this->images as $img) {
            if (! empty($img['data'])) {
                $zip->addFromString('word/' . $img['target'], $img['data']);
            } elseif (! empty($img['path']) && file_exists($img['path'])) {
                $zip->addFile($img['path'], 'word/' . $img['target']);
            }
        }

        $zip->close();

        return $tempFile;
    }

    protected function escapeXml(string $text): string
    {
        return htmlspecialchars($text, ENT_XML1 | ENT_COMPAT, 'UTF-8');
    }

    protected function buildRootRelsXml(): string
    {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' .
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' .
            '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' .
            '</Relationships>';
    }

    protected function buildContentTypesXml(): string
    {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' .
            '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' .
            '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' .
            '<Default Extension="xml" ContentType="application/xml"/>' .
            '<Default Extension="png" ContentType="image/png"/>' .
            '<Default Extension="jpeg" ContentType="image/jpeg"/>' .
            '<Default Extension="jpg" ContentType="image/jpeg"/>' .
            '<Default Extension="webp" ContentType="image/png"/>' .
            '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' .
            '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>' .
            '</Types>';
    }

    protected function buildStylesXml(): string
    {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' .
            '<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' .
            '<w:docDefaults>' .
            '<w:rPrDefault>' .
            '<w:rPr>' .
            '<w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>' .
            '<w:sz w:val="22"/>' . // 11pt
            '<w:szCs w:val="22"/>' .
            '<w:color w:val="222222"/>' .
            '</w:rPr>' .
            '</w:rPrDefault>' .
            '</w:docDefaults>' .
            '</w:styles>';
    }

    protected function buildDocumentRelsXml(): string
    {
        $rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' .
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' .
            '<Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>';

        foreach ($this->images as $img) {
            $rels .= '<Relationship Id="' . $img['id'] . '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="' . $img['target'] . '"/>';
        }

        $rels .= '</Relationships>';

        return $rels;
    }

    protected function registerImage(?string $storageRelPath): ?array
    {
        if (empty($storageRelPath)) {
            return null;
        }

        $fullPath = storage_path('app/public/' . ltrim($storageRelPath, '/'));
        if (! file_exists($fullPath)) {
            return null;
        }

        $this->imageCounter++;
        $ext = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION)) ?: 'jpg';
        if ($ext === 'jpeg') {
            $ext = 'jpg';
        }

        $rId = 'rIdImg' . $this->imageCounter;
        $target = 'media/image' . $this->imageCounter . '.' . $ext;

        // Cek dimensi gambar asli
        $imgInfo = @getimagesize($fullPath);
        $wPx = $imgInfo[0] ?? 400;
        $hPx = $imgInfo[1] ?? 300;

        // Batasi lebar maksimal di docx ke 480px (sekitar 4.8 inci / 4389120 EMUs)
        $maxW = 460;
        if ($wPx > $maxW) {
            $ratio = $maxW / $wPx;
            $wPx = $maxW;
            $hPx = (int) ($hPx * $ratio);
        }

        // 1 px = 9525 EMUs (English Metric Units)
        $wEmu = $wPx * 9525;
        $hEmu = $hPx * 9525;

        $entry = [
            'id' => $rId,
            'target' => $target,
            'path' => $fullPath,
            'wEmu' => $wEmu,
            'hEmu' => $hEmu,
            'name' => 'Image ' . $this->imageCounter,
        ];

        $this->images[] = $entry;

        return $entry;
    }

    protected function imageXml(array $img, string $alignment = 'center'): string
    {
        $id = $img['id'];
        $w = $img['wEmu'];
        $h = $img['hEmu'];
        $name = $this->escapeXml($img['name']);
        $jc = match ($alignment) {
            'left' => 'left',
            'right' => 'right',
            default => 'center',
        };

        return '<w:p><w:pPr><w:jc w:val="' . $jc . '"/><w:spacing w:before="60" w:after="120"/></w:pPr><w:r>' .
            '<w:drawing>' .
            '<wp:inline distT="0" distB="0" distL="0" distR="0" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing">' .
            '<wp:extent cx="' . $w . '" cy="' . $h . '"/>' .
            '<wp:docPr id="' . rand(100, 99999) . '" name="' . $name . '"/>' .
            '<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">' .
            '<a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">' .
            '<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">' .
            '<pic:nvPicPr>' .
            '<pic:cNvPr id="0" name="' . $name . '"/>' .
            '<pic:cNvPicPr/>' .
            '</pic:nvPicPr>' .
            '<pic:blipFill>' .
            '<a:blip r:embed="' . $id . '" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/>' .
            '<a:stretch><a:fillRect/></a:stretch>' .
            '</pic:blipFill>' .
            '<pic:spPr>' .
            '<a:xfrm><a:off x="0" y="0"/><a:ext cx="' . $w . '" cy="' . $h . '"/></a:xfrm>' .
            '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom>' .
            '</pic:spPr>' .
            '</pic:pic>' .
            '</a:graphicData>' .
            '</a:graphic>' .
            '</wp:inline>' .
            '</w:drawing>' .
            '</w:r></w:p>';
    }

    protected function buildDocumentXml(): string
    {
        $schoolProfile = DB::table('school_profiles')->first();
        $schoolName = $schoolProfile?->school_name ?? 'UPT SDN 9 Gandangbatu Sillanan';
        $regency = $schoolProfile?->regency ?? 'Tana Toraja';
        $district = $schoolProfile?->district ?? 'Gandangbatu Sillanan';
        $schoolAddress = $schoolProfile?->address ? ($schoolProfile->address . ', Kab. ' . $regency) : 'Gandangbatu, Kec. Gandangbatu Sillanan, Kab. Tana Toraja, Sulawesi Selatan';

        $examTitle = $this->exam->title;
        $subjectName = $this->exam->subject?->name ?? 'Mata Pelajaran';
        $classLabel = $this->exam->target_class_label;
        $academicYear = $this->exam->academicYear?->name ?? 'Tahun Pelajaran';
        $duration = $this->exam->duration_minutes . ' Menit';

        $xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' .
            '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" ' .
            'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ' .
            'xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math">' .
            '<w:body>';

        // 1. Kop Surat
        $xml .= '<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="20"/></w:pPr>' .
            '<w:r><w:rPr><w:b/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr>' .
            '<w:t>PEMERINTAH KABUPATEN ' . $this->escapeXml(strtoupper($regency)) . '</w:t></w:r></w:p>';

        $xml .= '<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="20"/></w:pPr>' .
            '<w:r><w:rPr><w:b/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr>' .
            '<w:t>DINAS PENDIDIKAN</w:t></w:r></w:p>';

        $xml .= '<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="40"/></w:pPr>' .
            '<w:r><w:rPr><w:b/><w:sz w:val="28"/><w:szCs w:val="28"/></w:rPr>' .
            '<w:t>' . $this->escapeXml(strtoupper($schoolName)) . '</w:t></w:r></w:p>';

        $xml .= '<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="40"/></w:pPr>' .
            '<w:r><w:rPr><w:sz w:val="18"/><w:szCs w:val="18"/><w:color w:val="555555"/></w:rPr>' .
            '<w:t>' . $this->escapeXml($schoolAddress) . '</w:t></w:r></w:p>';

        $xml .= '<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="60" w:after="160"/><w:pBdr><w:bottom w:val="double" w:sz="12" w:space="8" w:color="000000"/></w:pBdr></w:pPr>' .
            '<w:r><w:rPr><w:b/><w:sz w:val="24"/><w:szCs w:val="24"/><w:color w:val="800020"/></w:rPr>' .
            '<w:t>' . $this->escapeXml(strtoupper($examTitle)) . '</w:t></w:r></w:p>';

        // 2. Metadata Ujian (Tabel 2 Kolom Bersih)
        $xml .= '<w:tbl>' .
            '<w:tblPr>' .
            '<w:tblW w:w="9200" w:type="dxa"/>' .
            '<w:jc w:val="center"/>' .
            '<w:tblBorders>' .
            '<w:top w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>' .
            '<w:left w:val="none"/>' .
            '<w:bottom w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>' .
            '<w:right w:val="none"/>' .
            '<w:insideH w:val="none"/>' .
            '<w:insideV w:val="none"/>' .
            '</w:tblBorders>' .
            '</w:tblPr>' .
            '<w:tr>' .
            '<w:tc><w:tcPr><w:tcW w:w="4600" w:type="dxa"/></w:tcPr>' .
            '<w:p><w:r><w:b/><w:t>Mata Pelajaran: </w:b></w:r><w:r><w:t>' . $this->escapeXml($subjectName) . '</w:t></w:r></w:p>' .
            '<w:p><w:r><w:b/><w:t>Kelas / Sasaran: </w:b></w:r><w:r><w:t>' . $this->escapeXml($classLabel) . '</w:t></w:r></w:p>' .
            '</w:tc>' .
            '<w:tc><w:tcPr><w:tcW w:w="4600" w:type="dxa"/></w:tcPr>' .
            '<w:p><w:r><w:b/><w:t>Alokasi Waktu: </w:b></w:r><w:r><w:t>' . $this->escapeXml($duration) . '</w:t></w:r></w:p>' .
            '<w:p><w:r><w:b/><w:t>Tahun Ajaran: </w:b></w:r><w:r><w:t>' . $this->escapeXml($academicYear) . '</w:t></w:r></w:p>' .
            '</w:tc>' .
            '</w:tr>' .
            '</w:tbl>';

        // 3. Petunjuk Umum
        $xml .= '<w:p><w:pPr><w:spacing w:before="160" w:after="80"/></w:pPr>' .
            '<w:r><w:rPr><w:i/><w:sz w:val="18"/><w:color w:val="666666"/></w:rPr>' .
            '<w:t>Petunjuk: Berdoalah sebelum mengerjakan soal. Bacalah dengan teliti setiap butir pertanyaan dan berikan jawaban yang paling tepat!</w:t>' .
            '</w:r></w:p>';

        $xml .= '<w:p><w:pPr><w:spacing w:after="160"/><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="4" w:color="000000"/></w:pBdr></w:pPr></w:p>';

        // 4. Render Butir Soal
        $questions = $this->exam->questions;

        foreach ($questions as $idx => $q) {
            $num = $idx + 1;
            $typeLabel = match ($q->question_type) {
                'multiple_choice' => 'Pilihan Ganda',
                'pgk_mcma' => 'PGK (Pilihan Ganda Kompleks - Kotak Centang)',
                'pgk_kategori' => 'PGK (Pilihan Ganda Kompleks - Tabel Kategori)',
                'short_answer' => 'Isian Singkat',
                'essay' => 'Uraian / Essay',
                default => 'Soal'
            };

            // Nomor dan Header Soal
            $xml .= '<w:p><w:pPr><w:spacing w:before="140" w:after="60"/></w:pPr>' .
                '<w:r><w:rPr><w:b/><w:color w:val="800020"/></w:rPr><w:t>' . $num . '. </w:t></w:r>' .
                '<w:r><w:rPr><w:i/><w:sz w:val="18"/><w:color w:val="888888"/></w:rPr><w:t>[' . $this->escapeXml($typeLabel) . ' - ' . $q->points . ' Poin] </w:t></w:r>' .
                '</w:p>';

            // Gambar Soal jika ada (mendukung multiple images)
            $allImages = method_exists($q, 'getAllImages')
                ? $q->getAllImages()
                : (! empty($q->question_images) && is_array($q->question_images)
                    ? $q->question_images
                    : (! empty($q->question_image) ? [$q->question_image] : []));

            $imageMarkups = [];
            foreach ($allImages as $idx => $imgPath) {
                $img = $this->registerImage($imgPath);
                if ($img) {
                    $captionXml = count($allImages) > 1
                        ? '<w:p><w:pPr><w:jc w:val="' . ($q->image_alignment ?? 'center') . '"/><w:spacing w:after="40"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="18"/><w:color w:val="555555"/></w:rPr><w:t>Gambar ' . ($idx + 1) . '</w:t></w:r></w:p>'
                        : '';
                    $imageMarkups[$idx] = $captionXml . $this->imageXml($img, $q->image_alignment ?? 'center');
                }
            }

            // Teks Soal & Letak Gambar
            $qText = (string) $q->question_text;
            $pos = $q->image_position ?? 'bottom';
            $numberedTagRegex = '/\[(gambar|image|foto)\s*([0-9]+)\]/i';
            $generalTagRegex = '/\[(gambar|image|foto)\]/i';

            $usedIndices = [];

            // Ganti tag bernomor seperti [gambar1], [gambar2]
            if (preg_match($numberedTagRegex, $qText)) {
                $qText = preg_replace_callback($numberedTagRegex, function ($matches) use (&$usedIndices, $imageMarkups) {
                    $num = (int) $matches[2];
                    $idx = $num - 1;
                    if (isset($imageMarkups[$idx])) {
                        $usedIndices[] = $idx;
                        return '___IMG_MARKUP_' . $idx . '___';
                    }
                    return '';
                }, $qText);
            }

            // Gambar tersisa yang belum diposisikan via tag nomor
            $remainingMarkups = [];
            foreach ($imageMarkups as $idx => $markup) {
                if (! in_array($idx, $usedIndices, true)) {
                    $remainingMarkups[] = $markup;
                }
            }
            $remainingMarkupStr = implode('', $remainingMarkups);

            if ($remainingMarkupStr && preg_match($generalTagRegex, $qText)) {
                $qText = preg_replace($generalTagRegex, '___REMAINING_IMAGES___', $qText, 1);
            }

            $splitParts = preg_split('/(___IMG_MARKUP_[0-9]+___|___REMAINING_IMAGES___)/', $qText, -1, PREG_SPLIT_DELIM_CAPTURE);
            $hasReplacements = count($splitParts) > 1;

            if ($hasReplacements) {
                foreach ($splitParts as $part) {
                    if (preg_match('/^___IMG_MARKUP_([0-9]+)___$/', $part, $m)) {
                        $idx = (int) $m[1];
                        if (isset($imageMarkups[$idx])) {
                            $xml .= $imageMarkups[$idx];
                        }
                    } elseif ($part === '___REMAINING_IMAGES___') {
                        $xml .= $remainingMarkupStr;
                        $remainingMarkupStr = '';
                    } elseif (! empty(trim($part))) {
                        $xml .= '<w:p><w:pPr><w:ind w:left="360"/><w:spacing w:after="80"/></w:pPr>' .
                            '<w:r><w:t xml:space="preserve">' . $this->escapeXml(trim($part)) . '</w:t></w:r></w:p>';
                    }
                }
            } else {
                if ($remainingMarkupStr && $pos === 'top') {
                    $xml .= $remainingMarkupStr;
                    $xml .= '<w:p><w:pPr><w:ind w:left="360"/><w:spacing w:after="80"/></w:pPr>' .
                        '<w:r><w:t xml:space="preserve">' . $this->escapeXml($qText) . '</w:t></w:r></w:p>';
                } elseif ($remainingMarkupStr && $pos === 'middle') {
                    $paragraphs = preg_split('/\n\s*\n/', $qText);
                    if (count($paragraphs) >= 2) {
                        $mid = (int) ceil(count($paragraphs) / 2);
                        $firstHalf = implode("\n\n", array_slice($paragraphs, 0, $mid));
                        $secondHalf = implode("\n\n", array_slice($paragraphs, $mid));
                        $xml .= '<w:p><w:pPr><w:ind w:left="360"/><w:spacing w:after="80"/></w:pPr>' .
                            '<w:r><w:t xml:space="preserve">' . $this->escapeXml(trim($firstHalf)) . '</w:t></w:r></w:p>';
                        $xml .= $remainingMarkupStr;
                        $xml .= '<w:p><w:pPr><w:ind w:left="360"/><w:spacing w:after="80"/></w:pPr>' .
                            '<w:r><w:t xml:space="preserve">' . $this->escapeXml(trim($secondHalf)) . '</w:t></w:r></w:p>';
                    } else {
                        $xml .= '<w:p><w:pPr><w:ind w:left="360"/><w:spacing w:after="80"/></w:pPr>' .
                            '<w:r><w:t xml:space="preserve">' . $this->escapeXml($qText) . '</w:t></w:r></w:p>';
                        $xml .= $remainingMarkupStr;
                    }
                } else {
                    $xml .= '<w:p><w:pPr><w:ind w:left="360"/><w:spacing w:after="80"/></w:pPr>' .
                        '<w:r><w:t xml:space="preserve">' . $this->escapeXml($qText) . '</w:t></w:r></w:p>';
                    if ($remainingMarkupStr) {
                        $xml .= $remainingMarkupStr;
                    }
                }
            }

            // Opsi Jawaban Berdasarkan Tipe Soal
            if ($q->question_type === 'multiple_choice') {
                $options = is_array($q->options) ? $q->options : json_decode($q->options ?? '{}', true);
                $optImages = is_array($q->option_images) ? $q->option_images : json_decode($q->option_images ?? '{}', true);

                foreach (['A', 'B', 'C', 'D'] as $optKey) {
                    $text = $options[$optKey] ?? '';
                    $xml .= '<w:p><w:pPr><w:ind w:left="720"/><w:spacing w:after="40"/></w:pPr>' .
                        '<w:r><w:rPr><w:b/></w:rPr><w:t>' . $optKey . '. </w:t></w:r>' .
                        '<w:r><w:t xml:space="preserve">' . $this->escapeXml($text) . '</w:t></w:r>' .
                        '</w:p>';

                    if (! empty($optImages[$optKey])) {
                        $optImg = $this->registerImage($optImages[$optKey]);
                        if ($optImg) {
                            $xml .= $this->imageXml($optImg);
                        }
                    }
                }
            } elseif ($q->question_type === 'pgk_mcma') {
                $options = is_array($q->options) ? $q->options : json_decode($q->options ?? '{}', true);
                $optImages = is_array($q->option_images) ? $q->option_images : json_decode($q->option_images ?? '{}', true);

                $xml .= '<w:p><w:pPr><w:ind w:left="720"/><w:spacing w:after="40"/></w:pPr>' .
                    '<w:r><w:rPr><w:i/><w:sz w:val="18"/><w:color w:val="666666"/></w:rPr><w:t>Berikan tanda centang [✓] pada setiap pernyataan yang benar (jawaban benar dapat lebih dari satu):</w:t></w:r>' .
                    '</w:p>';

                foreach ($options as $optKey => $text) {
                    $xml .= '<w:p><w:pPr><w:ind w:left="720"/><w:spacing w:after="40"/></w:pPr>' .
                        '<w:r><w:rPr><w:b/></w:rPr><w:t>[  ] ' . $this->escapeXml($optKey) . '. </w:t></w:r>' .
                        '<w:r><w:t xml:space="preserve">' . $this->escapeXml((string) $text) . '</w:t></w:r>' .
                        '</w:p>';

                    if (! empty($optImages[$optKey])) {
                        $optImg = $this->registerImage($optImages[$optKey]);
                        if ($optImg) {
                            $xml .= $this->imageXml($optImg);
                        }
                    }
                }
            } elseif ($q->question_type === 'pgk_kategori') {
                $opts = is_array($q->options) ? $q->options : json_decode($q->options ?? '{}', true);
                $categories = $opts['categories'] ?? ['Benar', 'Salah'];
                $cat1 = $categories[0] ?? 'Benar';
                $cat2 = $categories[1] ?? 'Salah';
                $rows = $opts['rows'] ?? [];
                $optImages = is_array($q->option_images) ? $q->option_images : json_decode($q->option_images ?? '{}', true);

                $xml .= '<w:p><w:pPr><w:ind w:left="360"/><w:spacing w:after="60"/></w:pPr>' .
                    '<w:r><w:rPr><w:i/><w:sz w:val="18"/><w:color w:val="666666"/></w:rPr><w:t>Berikan tanda centang (✓) pada kolom ' . $this->escapeXml($cat1) . ' atau ' . $this->escapeXml($cat2) . ' untuk setiap pernyataan berikut:</w:t></w:r>' .
                    '</w:p>';

                // Render Tabel Matriks OpenXML
                $xml .= '<w:tbl>' .
                    '<w:tblPr>' .
                    '<w:tblW w:w="8600" w:type="dxa"/>' .
                    '<w:jc w:val="center"/>' .
                    '<w:tblBorders>' .
                    '<w:top w:val="single" w:sz="6" w:space="0" w:color="999999"/>' .
                    '<w:left w:val="single" w:sz="6" w:space="0" w:color="999999"/>' .
                    '<w:bottom w:val="single" w:sz="6" w:space="0" w:color="999999"/>' .
                    '<w:right w:val="single" w:sz="6" w:space="0" w:color="999999"/>' .
                    '<w:insideH w:val="single" w:sz="4" w:space="0" w:color="DDDDDD"/>' .
                    '<w:insideV w:val="single" w:sz="4" w:space="0" w:color="DDDDDD"/>' .
                    '</w:tblBorders>' .
                    '</w:tblPr>' .
                    '<w:tr>' .
                    '<w:tc><w:tcPr><w:tcW w:w="800" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="F2F2F2"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/></w:rPr><w:t>#</w:t></w:r></w:p></w:tc>' .
                    '<w:tc><w:tcPr><w:tcW w:w="5400" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="F2F2F2"/></w:tcPr><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Pernyataan</w:t></w:r></w:p></w:tc>' .
                    '<w:tc><w:tcPr><w:tcW w:w="1200" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="F2F2F2"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/></w:rPr><w:t>' . $this->escapeXml($cat1) . '</w:t></w:r></w:p></w:tc>' .
                    '<w:tc><w:tcPr><w:tcW w:w="1200" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="F2F2F2"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/></w:rPr><w:t>' . $this->escapeXml($cat2) . '</w:t></w:r></w:p></w:tc>' .
                    '</w:tr>';

                foreach ($rows as $row) {
                    $rowId = $row['id'] ?? '';
                    $rowText = $row['text'] ?? '';
                    $xml .= '<w:tr>' .
                        '<w:tc><w:tcPr><w:tcW w:w="800" w:type="dxa"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/></w:rPr><w:t>' . $this->escapeXml($rowId) . '</w:t></w:r></w:p></w:tc>' .
                        '<w:tc><w:tcPr><w:tcW w:w="5400" w:type="dxa"/></w:tcPr><w:p><w:r><w:t xml:space="preserve">' . $this->escapeXml($rowText) . '</w:t></w:r></w:p></w:tc>' .
                        '<w:tc><w:tcPr><w:tcW w:w="1200" w:type="dxa"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:t>(   )</w:t></w:r></w:p></w:tc>' .
                        '<w:tc><w:tcPr><w:tcW w:w="1200" w:type="dxa"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:t>(   )</w:t></w:r></w:p></w:tc>' .
                        '</w:tr>';

                    if (! empty($optImages[$rowId])) {
                        $optImg = $this->registerImage($optImages[$rowId]);
                        if ($optImg) {
                            $xml .= '<w:tr><w:tc/><w:tc>' . $this->imageXml($optImg) . '</w:tc><w:tc/><w:tc/></w:tr>';
                        }
                    }
                }
                $xml .= '</w:tbl>';
            } elseif ($q->question_type === 'short_answer') {
                $xml .= '<w:p><w:pPr><w:ind w:left="720"/><w:spacing w:after="80"/></w:pPr>' .
                    '<w:r><w:rPr><w:b/></w:rPr><w:t>Jawaban: </w:t></w:r>' .
                    '<w:r><w:t>..................................................................................................................................................................</w:t></w:r>' .
                    '</w:p>';
            } elseif ($q->question_type === 'essay') {
                $xml .= '<w:p><w:pPr><w:ind w:left="720"/><w:spacing w:after="40"/></w:pPr>' .
                    '<w:r><w:rPr><w:b/></w:rPr><w:t>Lembar Uraian Jawaban:</w:t></w:r>' .
                    '</w:p>' .
                    '<w:p><w:pPr><w:ind w:left="720"/><w:spacing w:after="40"/></w:pPr><w:r><w:t>__________________________________________________________________________________________________</w:t></w:r></w:p>' .
                    '<w:p><w:pPr><w:ind w:left="720"/><w:spacing w:after="40"/></w:pPr><w:r><w:t>__________________________________________________________________________________________________</w:t></w:r></w:p>' .
                    '<w:p><w:pPr><w:ind w:left="720"/><w:spacing w:after="80"/></w:pPr><w:r><w:t>__________________________________________________________________________________________________</w:t></w:r></w:p>';
            }

            // Spacing antar soal
            $xml .= '<w:p><w:pPr><w:spacing w:after="120"/></w:pPr></w:p>';
        }

        // 5. Tanda Tangan Mengetahui & Guru Pengampu
        $principalName = $schoolProfile?->principal_name ?? 'Hendrika Genti, S.Pd.SD.';
        $principalNip = $schoolProfile?->principal_nip ?? '198502012010012025';
        $teacherName = $this->exam->teacher?->full_name ?? $this->exam->teacher?->user?->name ?? '................................................';
        $teacherNip = $this->exam->teacher?->nip ?? $this->exam->teacher?->nuptk ?? '........................................';
        $signCity = $district ?: 'Gandangbatu Sillanan';
        $dateFormatted = \Carbon\Carbon::now()->translatedFormat('d F Y');

        $xml .= '<w:p><w:pPr><w:spacing w:before="280" w:after="120"/></w:pPr></w:p>';
        $xml .= '<w:tbl>' .
            '<w:tblPr><w:tblW w:w="9200" w:type="dxa"/><w:jc w:val="center"/><w:tblBorders><w:top w:val="none"/><w:left w:val="none"/><w:bottom w:val="none"/><w:right w:val="none"/><w:insideH w:val="none"/><w:insideV w:val="none"/></w:tblBorders></w:tblPr>' .
            '<w:tr>' .
            '<w:tc><w:tcPr><w:tcW w:w="4600" w:type="dxa"/></w:tcPr>' .
            '<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:t>Mengetahui,</w:t></w:r></w:p>' .
            '<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/></w:rPr><w:t>Kepala Sekolah</w:t></w:r></w:p>' .
            '<w:p><w:pPr><w:spacing w:before="1000"/><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:u w:val="single"/></w:rPr><w:t>' . $this->escapeXml($principalName) . '</w:t></w:r></w:p>' .
            '<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="18"/></w:rPr><w:t>NIP. ' . $this->escapeXml($principalNip) . '</w:t></w:r></w:p>' .
            '</w:tc>' .
            '<w:tc><w:tcPr><w:tcW w:w="4600" w:type="dxa"/></w:tcPr>' .
            '<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:t>' . $this->escapeXml($signCity) . ', ' . $this->escapeXml($dateFormatted) . '</w:t></w:r></w:p>' .
            '<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/></w:rPr><w:t>Guru Pengampu</w:t></w:r></w:p>' .
            '<w:p><w:pPr><w:spacing w:before="1000"/><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:u w:val="single"/></w:rPr><w:t>' . $this->escapeXml($teacherName) . '</w:t></w:r></w:p>' .
            '<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="18"/></w:rPr><w:t>NIP. ' . $this->escapeXml($teacherNip) . '</w:t></w:r></w:p>' .
            '</w:tc>' .
            '</w:tr>' .
            '</w:tbl>';

        $xml .= '</w:body></w:document>';

        return $xml;
    }
}
