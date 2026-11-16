<?php

declare(strict_types=1);

/**
 * Fallback polyfill for PHP Fileinfo extension when ext-fileinfo is disabled/not installed in PHP environment (e.g., shared hosting / cPanel).
 * Prevents Fatal Error: Class "finfo" not found in Flysystem, Laravel Storage, and MIME type detectors.
 */

if (! defined('FILEINFO_NONE')) {
    define('FILEINFO_NONE', 0);
}
if (! defined('FILEINFO_SYMLINK')) {
    define('FILEINFO_SYMLINK', 2);
}
if (! defined('FILEINFO_MIME_TYPE')) {
    define('FILEINFO_MIME_TYPE', 16);
}
if (! defined('FILEINFO_MIME_ENCODING')) {
    define('FILEINFO_MIME_ENCODING', 1024);
}
if (! defined('FILEINFO_MIME')) {
    define('FILEINFO_MIME', 1040);
}
if (! defined('FILEINFO_COMPRESS')) {
    define('FILEINFO_COMPRESS', 4);
}
if (! defined('FILEINFO_DEVICES')) {
    define('FILEINFO_DEVICES', 8);
}
if (! defined('FILEINFO_CONTINUE')) {
    define('FILEINFO_CONTINUE', 32);
}
if (! defined('FILEINFO_PRESERVE_ATIME')) {
    define('FILEINFO_PRESERVE_ATIME', 128);
}
if (! defined('FILEINFO_RAW')) {
    define('FILEINFO_RAW', 256);
}
if (! defined('FILEINFO_EXTENSION')) {
    define('FILEINFO_EXTENSION', 2097152);
}

if (! class_exists('finfo', false)) {
    class finfo
    {
        private int $flags;
        private ?string $magicDatabase;

        public function __construct(int $flags = FILEINFO_NONE, ?string $magic_database = null)
        {
            $this->flags = $flags;
            $this->magicDatabase = $magic_database;
        }

        public function set_flags(int $flags): bool
        {
            $this->flags = $flags;

            return true;
        }

        public function file(string $filename, int $flags = FILEINFO_NONE, $context = null): string|false
        {
            if (! file_exists($filename) || ! is_readable($filename)) {
                return false;
            }

            // Coba deteksi dari signature / magic bytes di awal file
            $handle = @fopen($filename, 'rb');
            if ($handle) {
                $sample = fread($handle, 4096);
                fclose($handle);
                if ($sample !== false) {
                    $mime = $this->detectFromBuffer($sample);
                    if ($mime !== null) {
                        return $mime;
                    }
                }
            }

            // Fallback: deteksi berdasarkan ekstensi file
            $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
            $detected = $this->detectFromExtension($ext);

            return $detected ?: 'application/octet-stream';
        }

        public function buffer(string $string, int $flags = FILEINFO_NONE, $context = null): string|false
        {
            $mime = $this->detectFromBuffer($string);

            return $mime ?: false;
        }

        private function detectFromBuffer(string $buffer): ?string
        {
            $len = strlen($buffer);
            if ($len === 0) {
                return null;
            }

            // PNG
            if ($len >= 8 && substr($buffer, 0, 8) === "\x89PNG\r\n\x1a\n") {
                return 'image/png';
            }

            // JPEG
            if ($len >= 3 && substr($buffer, 0, 3) === "\xFF\xD8\xFF") {
                return 'image/jpeg';
            }

            // GIF
            if ($len >= 6 && (substr($buffer, 0, 6) === 'GIF87a' || substr($buffer, 0, 6) === 'GIF89a')) {
                return 'image/gif';
            }

            // WEBP
            if ($len >= 12 && substr($buffer, 0, 4) === 'RIFF' && substr($buffer, 8, 4) === 'WEBP') {
                return 'image/webp';
            }

            // BMP
            if ($len >= 2 && substr($buffer, 0, 2) === 'BM') {
                return 'image/bmp';
            }

            // ICO
            if ($len >= 4 && substr($buffer, 0, 4) === "\x00\x00\x01\x00") {
                return 'image/x-icon';
            }

            // PDF
            if ($len >= 4 && substr($buffer, 0, 4) === '%PDF') {
                return 'application/pdf';
            }

            // ZIP / Office OpenXML (docx, xlsx, pptx)
            if ($len >= 4 && (substr($buffer, 0, 4) === "PK\x03\x04" || substr($buffer, 0, 4) === "PK\x05\x06")) {
                return 'application/zip';
            }

            // MP4
            if ($len >= 12 && substr($buffer, 4, 4) === 'ftyp') {
                return 'video/mp4';
            }

            // MP3
            if ($len >= 3 && substr($buffer, 0, 3) === 'ID3') {
                return 'audio/mpeg';
            }

            // SVG / XML
            $trimmed = ltrim($buffer);
            if (str_starts_with($trimmed, '<svg') || (str_starts_with($trimmed, '<?xml') && str_contains($trimmed, '<svg'))) {
                return 'image/svg+xml';
            }

            return null;
        }

        private function detectFromExtension(string $ext): ?string
        {
            if (empty($ext)) {
                return null;
            }

            if (class_exists(\League\MimeTypeDetection\GeneratedExtensionToMimeTypeMap::class)) {
                $map = new \League\MimeTypeDetection\GeneratedExtensionToMimeTypeMap();
                $detected = $map->lookupMimeType($ext);
                if (! empty($detected)) {
                    return $detected;
                }
            }

            static $fallbackMap = [
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'webp' => 'image/webp',
                'gif' => 'image/gif',
                'bmp' => 'image/bmp',
                'svg' => 'image/svg+xml',
                'ico' => 'image/x-icon',
                'jfif' => 'image/jpeg',
                'avif' => 'image/avif',
                'heic' => 'image/heic',
                'heif' => 'image/heif',
                'tif' => 'image/tiff',
                'tiff' => 'image/tiff',
                'pdf' => 'application/pdf',
                'doc' => 'application/msword',
                'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'xls' => 'application/vnd.ms-excel',
                'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'ppt' => 'application/vnd.ms-powerpoint',
                'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'txt' => 'text/plain',
                'csv' => 'text/csv',
                'zip' => 'application/zip',
                'rar' => 'application/x-rar-compressed',
                '7z' => 'application/x-7z-compressed',
                'mp3' => 'audio/mpeg',
                'mp4' => 'video/mp4',
                'json' => 'application/json',
            ];

            return $fallbackMap[$ext] ?? null;
        }
    }
}

if (! function_exists('finfo_open')) {
    function finfo_open(int $flags = FILEINFO_NONE, ?string $magicFile = null): finfo|false
    {
        return new finfo($flags, $magicFile);
    }
}

if (! function_exists('finfo_file')) {
    function finfo_file(finfo $finfo, string $filename, int $flags = FILEINFO_NONE, $context = null): string|false
    {
        return $finfo->file($filename, $flags, $context);
    }
}

if (! function_exists('finfo_buffer')) {
    function finfo_buffer(finfo $finfo, string $string, int $flags = FILEINFO_NONE, $context = null): string|false
    {
        return $finfo->buffer($string, $flags, $context);
    }
}

if (! function_exists('finfo_close')) {
    function finfo_close(finfo $finfo): bool
    {
        return true;
    }
}

if (! function_exists('finfo_set_flags')) {
    function finfo_set_flags(finfo $finfo, int $flags): bool
    {
        return $finfo->set_flags($flags);
    }
}

if (! function_exists('mime_content_type')) {
    function mime_content_type(mixed $filename): string|false
    {
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        if (is_resource($filename)) {
            $meta = stream_get_meta_data($filename);
            if (isset($meta['uri']) && file_exists($meta['uri'])) {
                return $finfo->file($meta['uri']);
            }

            return false;
        }

        return $finfo->file((string) $filename);
    }
}
