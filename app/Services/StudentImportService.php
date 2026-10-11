<?php

namespace App\Services;

use App\Models\Classes;
use App\Models\Guardian;
use App\Models\Student;
use App\Models\User;
use DateTime;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;

class StudentImportService
{
    /**
     * Import students from an uploaded file or file path.
     */
    public function import(UploadedFile|string $file, bool $resetOld = false): array
    {
        $filePath = is_string($file) ? $file : $file->getRealPath();

        if (! file_exists($filePath)) {
            throw new Exception("File tidak ditemukan: {$filePath}");
        }

        $spreadsheet = IOFactory::load($filePath);
        $worksheet = $spreadsheet->getActiveSheet();
        $rows = $worksheet->toArray(null, true, true, true);

        if (empty($rows)) {
            throw new Exception('File Excel kosong atau tidak terbaca.');
        }

        // Identify header row structure (Dapodik 2-row header or standard 1-row)
        $startRow = 3; // Default for Dapodik
        $isDapodik = false;

        $row1 = array_map(fn ($v) => trim((string) $v), $rows[1] ?? []);
        $row2 = array_map(fn ($v) => trim((string) $v), $rows[2] ?? []);

        // Check if row 1 has "Nama" and "NIPD" or "NISN"
        if (in_array('Nama', $row1) && (in_array('NIPD', $row1) || in_array('NISN', $row1))) {
            $isDapodik = true;
            $startRow = 3;
        } else {
            // Find which row has the headers
            foreach ($rows as $rNum => $rData) {
                $cleaned = array_map(fn ($v) => strtolower(trim((string) $v)), $rData);
                if (in_array('nama', $cleaned) || in_array('nama lengkap', $cleaned) || in_array('nisn', $cleaned)) {
                    $startRow = $rNum + 1;
                    break;
                }
            }
        }

        // Find active academic year ID
        $activeYear = DB::table('academic_years')->where('is_active', true)->first();
        $academicYearId = $activeYear?->id ?? 1;

        $importedCount = 0;
        $updatedCount = 0;
        $skippedCount = 0;
        $errors = [];
        $classesCreated = [];

        DB::beginTransaction();
        try {
            if ($resetOld) {
                // Delete previous students and their associated user accounts
                $oldStudents = Student::all();
                foreach ($oldStudents as $oldS) {
                    $userId = $oldS->user_id;
                    $oldS->guardians()->delete();
                    $oldS->delete();
                    if ($userId) {
                        User::where('id', $userId)->where('role', 'siswa')->delete();
                    }
                }
            }

            foreach ($rows as $rowIndex => $row) {
                if ($rowIndex < $startRow) {
                    continue;
                }

                // Extract data based on Dapodik column mapping
                // A: No, B: Nama, C: NIPD, D: JK, E: NISN, F: Tempat Lahir, G: Tanggal Lahir, H: NIK, I: Agama, J: Alamat, K: RT, L: RW, M: Dusun, N: Kelurahan, O: Kecamatan, P: Kode Pos, Q: Jenis Tinggal, R: Transportasi, S: Telepon, T: HP, U: Email, V: SKHUN, W: KPS, X: No KPS
                // Y-AD: Data Ayah (Nama, Thn Lahir, Pendidikan, Pekerjaan, Penghasilan, NIK)
                // AE-AJ: Data Ibu (Nama, Thn Lahir, Pendidikan, Pekerjaan, Penghasilan, NIK)
                // AK-AP: Data Wali (Nama, Thn Lahir, Pendidikan, Pekerjaan, Penghasilan, NIK)
                // AQ: Rombel Saat Ini

                $fullName = trim((string) ($row['B'] ?? ''));
                $nipd = trim((string) ($row['C'] ?? ''));
                $gender = strtoupper(trim((string) ($row['D'] ?? 'L')));
                $nisn = trim((string) ($row['E'] ?? ''));
                $birthPlace = trim((string) ($row['F'] ?? 'Tana Toraja'));
                $rawBirthDate = trim((string) ($row['G'] ?? ''));
                $nik = trim((string) ($row['H'] ?? ''));
                $religion = trim((string) ($row['I'] ?? 'Kristen'));
                $address = trim((string) ($row['J'] ?? ''));
                $rt = trim((string) ($row['K'] ?? ''));
                $rw = trim((string) ($row['L'] ?? ''));
                $dusun = trim((string) ($row['M'] ?? ''));
                $kelurahan = trim((string) ($row['N'] ?? ''));
                $kecamatan = trim((string) ($row['O'] ?? ''));
                $postalCode = trim((string) ($row['P'] ?? ''));
                $residenceType = trim((string) ($row['Q'] ?? 'Bersama orang tua'));
                $transportation = trim((string) ($row['R'] ?? 'Jalan kaki'));
                $phone = trim((string) ($row['S'] ?? ''));
                $mobilePhone = trim((string) ($row['T'] ?? ''));
                $email = trim((string) ($row['U'] ?? ''));
                $skhun = trim((string) ($row['V'] ?? ''));
                $isKps = trim((string) ($row['W'] ?? 'Tidak'));
                $kpsNumber = trim((string) ($row['X'] ?? ''));

                // Data Ayah
                $ayahNama = trim((string) ($row['Y'] ?? ''));
                $ayahTahun = trim((string) ($row['Z'] ?? ''));
                $ayahPendidikan = trim((string) ($row['AA'] ?? ''));
                $ayahPekerjaan = trim((string) ($row['AB'] ?? ''));
                $ayahPenghasilan = trim((string) ($row['AC'] ?? ''));
                $ayahNik = trim((string) ($row['AD'] ?? ''));

                // Data Ibu
                $ibuNama = trim((string) ($row['AE'] ?? ''));
                $ibuTahun = trim((string) ($row['AF'] ?? ''));
                $ibuPendidikan = trim((string) ($row['AG'] ?? ''));
                $ibuPekerjaan = trim((string) ($row['AH'] ?? ''));
                $ibuPenghasilan = trim((string) ($row['AI'] ?? ''));
                $ibuNik = trim((string) ($row['AJ'] ?? ''));

                // Data Wali
                $waliNama = trim((string) ($row['AK'] ?? ''));
                $waliTahun = trim((string) ($row['AL'] ?? ''));
                $waliPendidikan = trim((string) ($row['AM'] ?? ''));
                $waliPekerjaan = trim((string) ($row['AN'] ?? ''));
                $waliPenghasilan = trim((string) ($row['AO'] ?? ''));
                $waliNik = trim((string) ($row['AP'] ?? ''));

                // Rombel
                $rombelName = trim((string) ($row['AQ'] ?? ''));

                // Skip if no name and no nisn
                if (empty($fullName) && empty($nisn)) {
                    $skippedCount++;
                    continue;
                }

                // If NISN is missing, fallback to NIPD or generated
                if (empty($nisn)) {
                    $nisn = ! empty($nipd) ? str_pad($nipd, 10, '0', STR_PAD_LEFT) : '00'.time().$rowIndex;
                }
                if (empty($nipd)) {
                    $nipd = $nisn;
                }

                // Normalize Gender
                $gender = in_array($gender, ['P', 'PEREMPUAN']) ? 'P' : 'L';

                // Parse Birth Date
                $birthDate = $this->parseDate($rawBirthDate);

                // Find or Create Class (Rombel)
                $classId = null;
                if (! empty($rombelName)) {
                    $class = Classes::where('name', $rombelName)->first();
                    if (! $class) {
                        $gradeLevel = $this->determineGradeLevel($rombelName);
                        $class = Classes::create([
                            'academic_year_id' => $academicYearId,
                            'name' => $rombelName,
                            'grade_level' => $gradeLevel,
                            'homeroom_teacher_id' => null,
                        ]);
                        $classesCreated[$rombelName] = $gradeLevel;
                    }
                    $classId = $class->id;
                }

                // Default class fallback if not set
                if (! $classId) {
                    $defaultClass = Classes::first();
                    $classId = $defaultClass?->id ?? 1;
                }

                // 1. Create or Update User account
                $userEmail = ! empty($email) ? $email : "{$nisn}@sdn9gandangbatu.sch.id";
                $user = User::where('username', $nisn)
                    ->orWhere('email', $userEmail)
                    ->first();

                if (! $user) {
                    $user = User::create([
                        'name' => $fullName,
                        'username' => $nisn,
                        'email' => $userEmail,
                        'password' => Hash::make('password123'),
                        'role' => 'siswa',
                        'is_active' => true,
                    ]);
                } else {
                    $user->update([
                        'name' => $fullName,
                        'username' => $nisn,
                        'role' => 'siswa',
                        'is_active' => true,
                    ]);
                }

                // 2. Create or Update Student record
                $studentData = [
                    'user_id' => $user->id,
                    'nis' => $nipd,
                    'nisn' => $nisn,
                    'nik' => ! empty($nik) ? $nik : null,
                    'full_name' => $fullName,
                    'class_id' => $classId,
                    'gender' => $gender,
                    'birth_place' => ! empty($birthPlace) ? $birthPlace : 'Tana Toraja',
                    'birth_date' => $birthDate,
                    'religion' => ! empty($religion) ? $religion : 'Kristen',
                    'address' => ! empty($address) ? $address : null,
                    'rt' => ! empty($rt) && $rt !== '0' ? $rt : null,
                    'rw' => ! empty($rw) && $rw !== '0' ? $rw : null,
                    'dusun' => ! empty($dusun) ? $dusun : null,
                    'kelurahan' => ! empty($kelurahan) ? $kelurahan : null,
                    'kecamatan' => ! empty($kecamatan) ? $kecamatan : null,
                    'postal_code' => ! empty($postalCode) ? $postalCode : null,
                    'residence_type' => ! empty($residenceType) ? $residenceType : 'Bersama orang tua',
                    'transportation' => ! empty($transportation) ? $transportation : 'Jalan kaki',
                    'phone' => ! empty($phone) ? $phone : null,
                    'mobile_phone' => ! empty($mobilePhone) ? $mobilePhone : null,
                    'email' => ! empty($email) ? $email : null,
                    'skhun' => ! empty($skhun) ? $skhun : null,
                    'is_kps_recipient' => ! empty($isKps) ? $isKps : 'Tidak',
                    'kps_number' => ! empty($kpsNumber) ? $kpsNumber : null,
                    'entry_date' => date('Y-07-15'),
                    'status' => 'aktif',
                ];

                $student = Student::where('nisn', $nisn)
                    ->orWhere('nis', $nipd)
                    ->orWhere('user_id', $user->id)
                    ->first();

                if ($student) {
                    $student->update($studentData);
                    $updatedCount++;
                } else {
                    $student = Student::create($studentData);
                    $importedCount++;
                }

                // 3. Create / Update Guardians
                // Delete existing guardians for this student to sync cleanly
                Guardian::where('student_id', $student->id)->delete();

                // Ayah
                if (! empty($ayahNama) && $ayahNama !== '(tidak diisi)') {
                    Guardian::create([
                        'student_id' => $student->id,
                        'relation_type' => 'ayah',
                        'name' => $ayahNama,
                        'birth_year' => ! empty($ayahTahun) && $ayahTahun !== '(tidak diisi)' ? $ayahTahun : null,
                        'education' => ! empty($ayahPendidikan) && $ayahPendidikan !== '(tidak diisi)' ? $ayahPendidikan : null,
                        'occupation' => ! empty($ayahPekerjaan) && $ayahPekerjaan !== '(tidak diisi)' ? $ayahPekerjaan : null,
                        'income' => ! empty($ayahPenghasilan) && $ayahPenghasilan !== '(tidak diisi)' ? $ayahPenghasilan : null,
                        'nik' => ! empty($ayahNik) && $ayahNik !== '(tidak diisi)' ? $ayahNik : null,
                        'phone_number' => ! empty($mobilePhone) ? $mobilePhone : null,
                        'address' => $student->address,
                    ]);
                }

                // Ibu
                if (! empty($ibuNama) && $ibuNama !== '(tidak diisi)') {
                    Guardian::create([
                        'student_id' => $student->id,
                        'relation_type' => 'ibu',
                        'name' => $ibuNama,
                        'birth_year' => ! empty($ibuTahun) && $ibuTahun !== '(tidak diisi)' ? $ibuTahun : null,
                        'education' => ! empty($ibuPendidikan) && $ibuPendidikan !== '(tidak diisi)' ? $ibuPendidikan : null,
                        'occupation' => ! empty($ibuPekerjaan) && $ibuPekerjaan !== '(tidak diisi)' ? $ibuPekerjaan : null,
                        'income' => ! empty($ibuPenghasilan) && $ibuPenghasilan !== '(tidak diisi)' ? $ibuPenghasilan : null,
                        'nik' => ! empty($ibuNik) && $ibuNik !== '(tidak diisi)' ? $ibuNik : null,
                        'phone_number' => null,
                        'address' => $student->address,
                    ]);
                }

                // Wali (hanya jika terisi dan bukan '(tidak diisi)')
                if (! empty($waliNama) && $waliNama !== '(tidak diisi)') {
                    Guardian::create([
                        'student_id' => $student->id,
                        'relation_type' => 'wali',
                        'name' => $waliNama,
                        'birth_year' => ! empty($waliTahun) && $waliTahun !== '(tidak diisi)' ? $waliTahun : null,
                        'education' => ! empty($waliPendidikan) && $waliPendidikan !== '(tidak diisi)' ? $waliPendidikan : null,
                        'occupation' => ! empty($waliPekerjaan) && $waliPekerjaan !== '(tidak diisi)' ? $waliPekerjaan : null,
                        'income' => ! empty($waliPenghasilan) && $waliPenghasilan !== '(tidak diisi)' ? $waliPenghasilan : null,
                        'nik' => ! empty($waliNik) && $waliNik !== '(tidak diisi)' ? $waliNik : null,
                        'phone_number' => ! empty($mobilePhone) ? $mobilePhone : null,
                        'address' => $student->address,
                    ]);
                }
            }

            DB::commit();

            return [
                'success' => true,
                'total_processed' => $importedCount + $updatedCount,
                'imported' => $importedCount,
                'updated' => $updatedCount,
                'skipped' => $skippedCount,
                'classes_created' => array_keys($classesCreated),
                'errors' => $errors,
            ];
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Parse date string or numeric Excel date into Y-m-d format.
     */
    private function parseDate(mixed $dateValue): string
    {
        if (empty($dateValue)) {
            return '2015-01-01';
        }

        // If numeric Excel timestamp
        if (is_numeric($dateValue)) {
            try {
                return ExcelDate::excelToDateTimeObject($dateValue)->format('Y-m-d');
            } catch (Exception) {
                // fallthrough
            }
        }

        // If string date
        $dateStr = trim((string) $dateValue);

        // Check if YYYY-MM-DD
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateStr)) {
            return $dateStr;
        }

        // Check if DD/MM/YYYY or DD-MM-YYYY
        if (preg_match('/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/', $dateStr, $m)) {
            return sprintf('%04d-%02d-%02d', $m[3], $m[2], $m[1]);
        }

        // Generic strtotime
        $time = strtotime($dateStr);
        if ($time !== false) {
            return date('Y-m-d', $time);
        }

        return '2015-01-01';
    }

    /**
     * Determine grade level (1-6) from rombel name.
     */
    private function determineGradeLevel(string $rombelName): int
    {
        $upper = strtoupper($rombelName);

        if (preg_match('/VI[A-Z\b]/', $upper) || str_contains($upper, 'VI') || str_contains($upper, '6')) {
            return 6;
        }
        if (preg_match('/IV[A-Z\b]/', $upper) || str_contains($upper, 'IV') || str_contains($upper, '4')) {
            return 4;
        }
        if (preg_match('/V[A-Z\b]/', $upper) || str_contains($upper, 'V') || str_contains($upper, '5')) {
            return 5;
        }
        if (preg_match('/III[A-Z\b]/', $upper) || str_contains($upper, 'III') || str_contains($upper, '3')) {
            return 3;
        }
        if (preg_match('/II[A-Z\b]/', $upper) || str_contains($upper, 'II') || str_contains($upper, '2')) {
            return 2;
        }
        if (preg_match('/I[A-Z\b]/', $upper) || str_contains($upper, 'I') || str_contains($upper, '1')) {
            return 1;
        }

        return 1;
    }
}
