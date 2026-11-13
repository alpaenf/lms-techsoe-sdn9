<?php

namespace App\Services;

/**
 * Pure PHP Zip Archive Writer
 *
 * Provides fallback ZIP archive creation when PHP's ext-zip / ZipArchive
 * is not installed on the server (e.g. shared cPanel hosting).
 */
class SimpleZipWriter
{
    protected array $files = [];
    protected ?string $outputPath = null;

    public function __construct(?string $outputPath = null)
    {
        $this->outputPath = $outputPath;
    }

    /**
     * Open or set target file path (compatible with ZipArchive interface).
     */
    public function open(string $filename, int $flags = 0): bool
    {
        $this->outputPath = $filename;
        $this->files = [];

        return true;
    }

    /**
     * Add a file to the zip from a string of contents.
     */
    public function addFromString(string $localName, string $contents): void
    {
        $normalizedName = ltrim(str_replace('\\', '/', $localName), '/');

        $this->files[] = [
            'name' => $normalizedName,
            'data' => $contents,
            'time' => time(),
        ];
    }

    /**
     * Add a file to the zip from filesystem path.
     */
    public function addFile(string $filePath, ?string $localName = null): bool
    {
        if (! file_exists($filePath) || ! is_readable($filePath)) {
            return false;
        }

        $contents = file_get_contents($filePath);
        if ($contents === false) {
            return false;
        }

        $targetName = $localName ?: basename($filePath);
        $this->addFromString($targetName, $contents);

        return true;
    }

    /**
     * Close the archive and write to disk (compatible with ZipArchive interface).
     */
    public function close(): bool
    {
        if (empty($this->outputPath)) {
            return false;
        }

        return $this->saveTo($this->outputPath);
    }

    /**
     * Build zip bytes and write to the specified path.
     */
    public function saveTo(string $targetPath): bool
    {
        $data = $this->buildZip();

        return file_put_contents($targetPath, $data) !== false;
    }

    /**
     * Construct the binary ZIP file format.
     */
    public function buildZip(): string
    {
        $localHeaders = '';
        $centralDir = '';
        $offset = 0;

        foreach ($this->files as $file) {
            $name = $file['name'];
            $data = $file['data'];
            $uncompressedSize = strlen($data);
            $crc = crc32($data);

            if (function_exists('gzdeflate')) {
                $compressedData = gzdeflate($data);
                $compressionMethod = 8; // Deflate
                $compressedSize = strlen($compressedData);
            } else {
                $compressedData = $data;
                $compressionMethod = 0; // Store
                $compressedSize = $uncompressedSize;
            }

            $time = $file['time'];
            $d = getdate($time);
            $dosTime = (($d['hours'] << 11) | ($d['minutes'] << 5) | ($d['seconds'] >> 1));
            $dosDate = ((($d['year'] - 1980) << 9) | ($d['mon'] << 5) | $d['mday']);

            // Local file header: PK\x03\x04
            $lh = pack(
                'VvvvvvVVVvv',
                0x04034b50, // Signature
                20,         // Version needed (2.0)
                0x0800,     // General purpose bit flag (UTF-8 encoding)
                $compressionMethod,
                $dosTime,
                $dosDate,
                $crc,
                $compressedSize,
                $uncompressedSize,
                strlen($name),
                0           // Extra field length
            ) . $name . $compressedData;

            // Central directory entry: PK\x01\x02
            $cd = pack(
                'VvvvvvvVVVvvvvvVV',
                0x02014b50, // Signature
                20,         // Version made by
                20,         // Version needed
                0x0800,     // UTF-8 flag
                $compressionMethod,
                $dosTime,
                $dosDate,
                $crc,
                $compressedSize,
                $uncompressedSize,
                strlen($name),
                0,          // Extra field length
                0,          // File comment length
                0,          // Disk number start
                0,          // Internal file attributes
                0,          // External file attributes
                $offset     // Relative offset of local header
            ) . $name;

            $localHeaders .= $lh;
            $centralDir .= $cd;
            $offset += strlen($lh);
        }

        $centralDirOffset = strlen($localHeaders);
        $centralDirLength = strlen($centralDir);
        $count = count($this->files);

        // End of central directory record (EOCD): PK\x05\x06
        $eocd = pack(
            'VvvvvVVv',
            0x06054b50, // Signature
            0,          // Number of this disk
            0,          // Disk where central directory starts
            $count,     // Number of central directory records on this disk
            $count,     // Total number of central directory records
            $centralDirLength,
            $centralDirOffset,
            0           // Zip file comment length
        );

        return $localHeaders . $centralDir . $eocd;
    }
}

