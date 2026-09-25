# DOKUMENTASI TEKNIS & PANDUAN PENGEMBANGAN
## Smart School LMS — UPT SDN 9 Gandangbatu Sillanan
**Penyedia Solusi:** TechSoe (Teknologi Inovasi Soedirman)  
**Tech Stack Utama:** Laravel 13, React.js, Inertia.js, MySQL 8.0, Tailwind CSS  
**Versi Sistem:** 1.1.0 (Production Release Candidate)  
**Tanggal:** 25 September 2026  

---

## 1. Daftar Indeks Dokumentasi Proyek

Seluruh spesifikasi teknis, pedoman desain, skema basis data, dan arsitektur sistem Smart School LMS telah disusun secara terstruktur dalam repositori ini:

```
docs/
├── README.md                  # Indeks utama & navigasi berkas dokumentasi
├── akun_demo_dan_panduan_role.md # Akun login uji coba & penjelasan halaman tiap role
├── prd.md                     # Product Requirement Document (PRD) komprehensif
├── design_system.md           # Panduan Sistem Desain, UI/UX, Warna Burgundy & Tipografi
├── rules.md                   # Standar Rekayasa Kode, Aturan Bebas Emoji & Arsitektur SPA
├── database_schema.md         # Diagram Relasi Entitas (ERD), Skema MySQL 8.0 & Kamus Data
├── system_architecture.md     # Arsitektur Inertia Monolith, Matriks RBAC & Formula Rapor
├── api_and_routes.md          # Daftar Rute Inertia, Komponen React, Controller & Async API
└── deployment_and_setup.md    # Petunjuk Instalasi Lokal (Laragon) & Server Produksi (VPS Nginx)
```

---

## 2. Ringkasan Isi Setiap Dokumen

### 1. [Akun Uji Coba & Panduan Hak Akses Role](file:///c:/laragon/www/lms-techsoe-sdn9/docs/akun_demo_dan_panduan_role.md)
* **Kredensial Demo:** Daftar lengkap akun login uji coba (Admin, Kepala Sekolah, Guru/Wali Kelas, Guru BK, Siswa).
* **Matriks Hak Akses:** Wewenang operasional tiap modul (Akses Penuh, Kelola, Monitoring, Read-only).
* **Rincian Halaman:** Penjelasan fungsi mendalam untuk setiap halaman aplikasi berdasarkan perannya masing-masing.

### 2. [Product Requirement Document (PRD)](file:///c:/laragon/www/lms-techsoe-sdn9/docs/prd.md)
* **Tujuan & Ruang Lingkup:** Kebutuhan sistem pembelajaran daring dan administrasi akademik UPT SDN 9 Gandangbatu Sillanan.
* **12 Modul Fungsional Utama:** Multi-Level User, Kelembagaan, Master Data, Buku Induk Siswa, LMS Pembelajaran, Presensi Guru & Siswa, Tugas & Ujian, E-Raport, Bimbingan Konseling (BK), Ekspor Data Excel/PDF, Dashboard Statistik, dan Notifikasi Informasi.
* **Informasi Proyek:** Milestone kerja 2 pekan, rincian biaya penawaran resmi, lembar pengesahan Kepala Sekolah (**Hendrika Genti, S.Pd.SD.**) dan Koordinator Vendor (**Nadzare Kafah Alfatiha**).

### 2. [Panduan Sistem Desain & UI/UX](file:///c:/laragon/www/lms-techsoe-sdn9/docs/design_system.md)
* **Tema Visual:** Modern Professional Education.
* **Palet Warna:** Primary Burgundy (`#800020`), Deep Burgundy (`#5C0017`), Burgundy Soft Tint (`#FDF2F4`), Off-White Canvas (`#F8F9FA`), dan Border Stroke (`#E2E8F0`).
* **Tipografi:** Google Font Poppins (Display, Headings H1-H4, Body, Badges).
* **Komponen React & Tailwind:** Implementasi tombol, input text focus ring burgundy, tabel data zebra-striping, modal dialog, status badge presensi (Hadir, Izin, Sakit, Alpa), serta penggunaan ikon vektor SVG (`lucide-react`) tanpa karakter emoji.

### 3. [Standar Rekayasa & Aturan Kode](file:///c:/laragon/www/lms-techsoe-sdn9/docs/rules.md)
* **Kebijakan Mutlak:** Larangan penggunaan karakter emoji pada UI, komentar kode, pesan error/flash, basis data, commit message, dan file markdown.
* **Standar Backend:** Laravel 13 dengan kepatuhan penuh PSR-12 dan PSR-4, pemisahan lapisan Controller, FormRequest, Service Layer, dan Eloquent Model.
* **Standar Frontend:** React.js dengan Inertia.js v2, hooks `useForm`, pemisahan Layouts dan Pages.
* **Keamanan:** Proteksi CSRF, Sanitasi XSS, Enkripsi Sandi Bcrypt, Rate Limiting Login, Validasi Ekstensi Berkas (Max 10MB), serta Activity Audit Log.
* **Git Workflow:** Percabangan `main`, `develop`, `feature/*`, serta konvensi commit murni tanpa simbol grafis.

### 4. [Skema Basis Data & Kamus Data](file:///c:/laragon/www/lms-techsoe-sdn9/docs/database_schema.md)
* **Database Engine:** MySQL 8.0 Community Server.
* **Diagram ERD:** Diagram relasi entitas Mermaid yang menghubungkan seluruh tabel sistem secara transaksional.
* **Kamus Data Lengkap:** Spesifikasi kolom, tipe data, foreign keys, index performa, dan constraints untuk 17+ tabel utama (`users`, `students`, `teachers`, `classes`, `subjects`, `topics`, `materials`, `assignments`, `student_attendances`, `student_grades`, `counseling_sessions`, dll).

### 5. [Arsitektur Sistem & Spesifikasi Teknis](file:///c:/laragon/www/lms-techsoe-sdn9/docs/system_architecture.md)
* **Arsitektur Monolith SPA:** Klien React -> Inertia Bridge XHR -> Laravel 13 Pipeline -> MySQL 8.0 Database.
* **Matriks RBAC:** Pemetaan hak akses untuk 6 peran (Admin, Guru, Siswa, Wali Kelas, BK, Pimpinan).
* **Formula E-Raport:** Bobot Tugas (30%), UTS (30%), UAS (40%), dan tabel konversi predikat A/B/C/D otomatis.
* **Mesin Ekspor:** Integrasi Maatwebsite Excel (`.xlsx`) dan Laravel DomPDF (`.pdf`).

### 6. [Routing & Spesifikasi Endpoint](file:///c:/laragon/www/lms-techsoe-sdn9/docs/api_and_routes.md)
* **Segregasi Rute Per Peran:** `/auth/*`, `/admin/*`, `/guru/*`, `/siswa/*`, `/wali-kelas/*`, `/bk/*`, `/pimpinan/*` dengan render komponen React Inertia terkait.
* **Internal API Endpoints:** Endpoint `/api/v1/*` untuk rekap presensi instan, live search siswa, quick toggle status, dan polling notifikasi.

### 7. [Panduan Deployment & Instalasi Server](file:///c:/laragon/www/lms-techsoe-sdn9/docs/deployment_and_setup.md)
* **Setup Lokal:** Konfigurasi Laragon pada direktori `c:\laragon\www\lms-techsoe-sdn9`, migrasi MySQL, build aset Vite, dan seeder akun default.
* **Setup Produksi:** Konfigurasi virtual host Nginx Ubuntu VPS, aktivasi sertifikat SSL Let's Encrypt TLS 1.3, izin direktori, optimasi cache produksi, cron scheduler, dan backup basis data harian otomatis.

---

## 3. Quick Start untuk Tim Pengembang

```powershell
# 1. Masuk ke direktori kerja
cd c:\laragon\www\lms-techsoe-sdn9

# 2. Salin environment dan install dependensi
cp .env.example .env
composer install
npm install

# 3. Setup database MySQL dan enkripsi key
php artisan key:generate
php artisan migrate --seed
php artisan storage:link

# 4. Jalankan dev server Vite untuk React SPA
npm run dev
```

---
*Dokumentasi ini dikelola secara resmi oleh tim pengembang **TechSoe (Teknologi Inovasi Soedirman)** untuk **UPT SDN 9 Gandangbatu Sillanan**.*
