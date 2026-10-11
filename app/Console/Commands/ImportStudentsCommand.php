<?php

namespace App\Console\Commands;

use App\Services\StudentImportService;
use Illuminate\Console\Command;

class ImportStudentsCommand extends Command
{
    protected $signature = 'students:import {file : Path to the Excel or CSV file} {--reset : Reset existing students before import}';

    protected $description = 'Import students from Dapodik Excel or standard spreadsheet file';

    public function handle(StudentImportService $service): int
    {
        $filePath = $this->argument('file');
        $reset = $this->option('reset');

        if (! file_exists($filePath)) {
            $this->error("File tidak ditemukan: {$filePath}");

            return 1;
        }

        $this->info("Memulai proses impor siswa dari: {$filePath}...");
        if ($reset) {
            $this->warn('Opsi --reset aktif: Data siswa lama akan dihapus terlebih dahulu.');
        }

        try {
            $result = $service->import($filePath, (bool) $reset);

            $this->newLine();
            $this->info('✓ Proses impor siswa selesai dengan sukses!');
            $this->table(
                ['Kategori', 'Jumlah / Keterangan'],
                [
                    ['Total Diproses', $result['total_processed']],
                    ['Siswa Baru (Imported)', $result['imported']],
                    ['Siswa Diperbarui (Updated)', $result['updated']],
                    ['Baris Dilewati (Skipped)', $result['skipped']],
                    ['Rombel Baru Dibuat', count($result['classes_created']) . ' (' . implode(', ', $result['classes_created']) . ')'],
                ]
            );

            return 0;
        } catch (\Throwable $e) {
            $this->error('Gagal mengimpor siswa: ' . $e->getMessage());
            $this->error($e->getTraceAsString());

            return 1;
        }
    }
}
