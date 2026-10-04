# 🏫 DOKUMEN DESKRIPSI LENGKAP: PROFIL UPT SDN 9 GANDANGBATU SILLANAN & FITUR SMART SCHOOL LMS TECHSOE

> **Tujuan Dokumen:** Dokumen komprehensif ini berisi penjabaran lengkap tentang identitas sekolah **UPT SDN 9 Gandangbatu Sillanan**, seluruh fitur sistem **Smart School LMS TechSoe**, matriks peran (*role*), alur kerja, hingga panduan penggunaan. Dokumen ini siap disalin (*copy-paste*) ke AI sebelah (v0.dev, Midjourney, Claude, ChatGPT, dll) agar AI tersebut memahami konteks dan isi lengkap sistem saat membuat konsep desain visual / foto landing page baru.

---

## 🏛️ 1. PROFIL LENGKAP UPT SDN 9 GANDANGBATU SILLANAN

### A. Identitas Resmi Sekolah
- **Nama Satuan Pendidikan:** UPT SDN 9 Gandangbatu Sillanan
- **Nomor Pokok Sekolah Nasional (NPSN):** 40307044
- **Jenjang Pendidikan:** Sekolah Dasar (SD) — Melayani Kelas 1 s.d. Kelas 6
- **Lokasi & Wilayah Satuan:** Kecamatan Gandangbatu Sillanan, Kabupaten Tana Toraja, Provinsi Sulawesi Selatan
- **Kepala Sekolah:** Hendrika Genti, S.Pd.SD. (NIP. 198502012010012025)
- **Tahun Ajaran Aktif:** T.A. 2026/2027 Semester Ganjil
- **Pengembang Platform (Vendor):** TechSoe (Teknologi Inovasi Soedirman) — Koordinator Pelaksana: Nadzare Kafah Alfatiha

### B. Visi, Misi & Karakter Educational
- **Visi Sekolah:** "Mewujudkan Generasi Peserta Didik yang Berakhlak Mulia, Cerdas, Berkarakter Kebangsaan, serta Siap Menguasai Teknologi Informasi di Era Digital."
- **Misi Utama Sekolah:**
  1. Menyelenggarakan proses pembelajaran berkualitas berbasis Kurikulum Merdeka yang menyenangkan dan inklusif.
  2. Membentuk kedisiplinan dan karakter islami/kebangsaan melalui pendampingan bimbingan konseling yang terstruktur.
  3. Memanifestasikan transparansi tata kelola akademik antara sekolah, guru, peserta didik, dan orang tua murid.
  4. Mengintegrasikan teknologi informasi modern dalam kegiatan belajar mengajar (KBM) harian dan otomatisasi administrasi sekolah.

---

## 💻 2. GAMBARAN UMUM SISTEM (SMART SCHOOL LMS TECHSOE)

Smart School LMS TechSoe adalah platform web terpadu yang menggabungkan kapabilitas **Learning Management System (LMS)** modern dengan **Sistem Informasi Manajemen Administrasi Sekolah**. Platform ini menghubungkan seluruh warga sekolah dalam satu basis data terpusat.

### Spesifikasi Teknis & Arsitektur:
- **Arsitektur Utama:** Single Page Application (SPA) berbasis Laravel 13 & React.js via Inertia.js v2
- **Basis Data:** MySQL 8.0 terpusat dengan integritas *Foreign Key Constraints*
- **Desain & Warna Visual:** Tema **Modern Professional Education** menggunakan aksen **Deep Burgundy (`#800020` / `#5C0017`)**, latar belakang **Crisp White (`#FFFFFF`) & Canvas (`#F8F9FA`)**, tipografi **Poppins / Inter**, dan ikon vektor modern (`lucide-react`).
- **Standar Keamanan:** Autentikasi berbasis sesi terenkripsi, Role-Based Access Control (RBAC) 6 Peran, perlindungan CSRF/XSS, dan SSL TLS 1.3.

---

## 🔐 3. PERAN PENGGUNA & HAK AKSES (6 ROLE MATRIKS)

Sistem mengelompokkan pengguna ke dalam 6 tingkatan peran (*Role-Based Access Control*):

1. **Administrator Sistem (`admin`)**
   - Mengelola identitas kelembagaan, mengonfigurasi tahun ajaran, memasukkan master data guru, siswa, rombel, dan mata pelajaran, mengendalikan akun pengguna, serta melakukan pengawasan teknis sistem.
2. **Kepala Sekolah / Pimpinan (`pimpinan`)**
   - Mengakses Dashboard Eksekutif real-time, memantau rasio presensi harian guru & siswa, mengawasi ketercapaian mutu KBM, serta memverifikasi dan mengesahkan E-Rapor digital.
3. **Guru Mata Pelajaran & Wali Kelas (`guru`)**
   - Mencatat presensi harian siswa kelas ampuannya, mengunggah materi ajar (PDF/Doc/Video), mendistribusikan & menilai tugas daring, mengelola leger nilai, serta merumuskan deskripsi E-Rapor Kurikulum Merdeka.
4. **Guru Bimbingan Konseling (`bk`)**
   - Mencatat sesi konseling individual/kelompok, menginventarisasi poin pelanggaran disiplin (ringan/sedang/berat), mencatat prestasi non-akademik siswa, serta menerbitkan surat pembinaan wali murid.
5. **Peserta Didik (`siswa`)**
   - Mengakses materi ajar digital, mengunduh lembar kerja, mengumpulkan jawaban tugas, mengikuti Ujian Online (CBT), melihat riwayat presensi mandiri, serta meninjau hasil E-Rapor.
6. **Orang Tua / Wali Murid**
   - Memantau rekapitulasi kehadiran harian anak, melihat catatan perkembangan karakter/disiplin dari BK, serta mengunduh E-Rapor resmi pada akhir semester.

---

## 🛠️ 4. DEKRIPSI LENGKAP 12 MODUL INTI SISTEM

### Modul 01: Manajemen Multi-Role & Autentikasi
Sistem autentikasi terenkripsi yang mendukung login menggunakan **Email, Username, NIP, atau NISN**. Dilengkapi fitur ubah password mandiri, reset password oleh admin, serta penonaktifan akun alumni / guru mutasi.

### Modul 02: Kelembagaan & Kalender Akademik
Pengelolaan profil resmi UPT SDN 9 Gandangbatu Sillanan (NPSN: 40307044, kontak, logo, alamat), pengaturan semester aktif (misal 2026/2027 Ganjil), serta penguncian data semester lampau.

### Modul 03: Master Data Terintegrasi
Pusat direktori tenaga pendidik (NIP/NUPTK, status kepegawaian), data rombongan belajar (Tingkat Kelas 1-6), struktur kurikulum mata pelajaran (Formal & Mulok beserta standar KKM/KKTP), dan kalender akademik kegiatan sekolah.

### Modul 04: Buku Induk Siswa Digital
Rekam jejak komprehensif peserta didik mencakup data NISN, NIK, demografi orang tua/wali, riwayat mutasi kelas, status registrasi, hingga percetakan lembar Buku Induk Siswa resmi.

### Modul 05: LMS & Bahan Ajar Digital
Wadah bagi guru untuk mempublikasikan materi pembelajaran multi-format (Modul Teks, PDF, PPT, Dokumen, Video Youtube/Drive) yang tersusun rapi berdasarkan bab dan kompetensi dasar.

### Modul 06: Presensi Harian Guru & Siswa
Fitur pencatatan presensi real-time dengan status: **Hadir (H), Izin (I), Sakit (S), dan Alpa (A)**. Dilengkapi tombol efisiensi *"Tandai Semua Hadir"* serta kalkulasi rekapitulasi persentase kehadiran harian, bulanan, dan semesteran secara otomatis.

### Modul 07: Tugas, Asesmen & Penilaian Daring
Modul pembuatan tugas dengan pengaturan batas waktu (*due date*). Siswa dapat mengunggah berkas jawaban (file/foto catatan), dan guru memberikan nilai serta umpan balik (*feedback*) evaluatif.

### Modul 08: Ujian Online / CBT (Computer Based Test)
Pelaksanaan Ujian Daring dengan pilihan soal Pilihan Ganda & Esai. Sistem mendukung acak soal, timer mundur otomatis, pembatasan kecurangan, serta penilaian & grading otomatis untuk pilihan ganda.

### Modul 09: Otomatisasi E-Raport Kurikulum Merdeka
Pengolahan akumulasi nilai formatif, sumatif, UTS, dan UAS menjadi lembar E-Rapor resmi. Sistem secara otomatis merumuskan deskripsi capaian pembelajaran, mengintegrasikan data presensi, serta menyediakan fitur pengesahan Kepala Sekolah dan cetak PDF Rapor Baku.

### Modul 10: Manajemen Bimbingan Konseling (BK) & Prestasi
Pencatatan sesi konseling secara konfidensial, inventarisasi poin kedisiplinan siswa (pelanggaran ringan, sedang, berat), pencatatan rekam prestasi akademik/non-akademik, serta pencetakan surat pemanggilan orang tua.

### Modul 11: Ekspor Data & Laporan Spreadsheet
Kemudahan penarikan data dalam format **Microsoft Excel (`.xlsx`)** dan **PDF** untuk seluruh data master sekolah, rekapitulasi presensi bulanan, serta leger nilai kelas.

### Modul 12: Dashboard Eksekutif & Broadcast Informasi
Tampilan dasbor berdasar peran yang menyajikan metrik KPI (rasio kehadiran, total siswa/guru), grafik statistik, serta pusat broadcast pengumuman resmi sekolah.

---

## 📖 5. PANDUAN PENGGUNAAN SISTEM (USER GUIDE LANGKAH DEMI LANGKAH)

### 👨‍🎓 A. Panduan untuk Siswa:
1. **Masuk ke Portal:** Buka halaman landing page, klik *Masuk ke Portal*, lalu login menggunakan NISN/Username dan Kata Sandi.
2. **Cek Dashboard & Presensi:** Tinjau jadwal pelajaran hari ini, pengumuman sekolah, serta status presensi harian diri sendiri.
3. **Akses E-Learning:** Buka menu *E-Learning*, pilih mata pelajaran untuk membaca modul atau mengunduh bahan ajar PDF.
4. **Kerjakan & Unggah Tugas:** Pada menu *Tugas*, baca instruksi guru, lalu unggah file/foto jawaban sebelum batas waktu berakhir.
5. **Ikuti Ujian Online (CBT):** Buka menu *Ujian Online*, pilih ujian yang aktif, jawab soal tepat waktu, lalu tekan *Submit*.
6. **Lihat E-Rapor:** Pada akhir semester, buka menu *E-Rapor* untuk melihat dan mengunduh lembar hasil belajar digital.

### 👩‍🏫 B. Panduan untuk Guru & Wali Kelas:
1. **Input Presensi Harian:** Akses menu *Presensi*, pilih kelas rombel, gunakan tombol *"Tandai Semua Hadir"* untuk efisiensi, lalu tekan *Simpan Presensi*.
2. **Unggah Materi Ajar:** Buka menu *E-Learning*, buat topik materi baru, lalu lampirkan file modul PDF atau link video pembelajaran.
3. **Buat & Nilai Tugas:** Buat penugasan baru dengan batas waktu. Saat siswa mengumpulkan, periksa berkas jawaban, input skor nilai, dan beri catatan evaluasi.
4. **Input & Cetak E-Rapor Kelas:** Pada menu *E-Rapor*, masukkan nilai formatif/sumatif pada *Leger Nilai*, rumuskan deskripsi capaian kompetensi, lalu cetak lembar E-Rapor siswa setelah disahkan.

### 👨‍👩‍👧 C. Panduan untuk Orang Tua / Wali Murid:
1. **Pantau Kehadiran Anak:** Dapatkan laporan absensi harian anak secara transparan (Hadir/Izin/Sakit/Alpa).
2. **Pantau Perkembangan Karakter:** Cek menu BK untuk melihat catatan kedisiplinan maupun prestasi yang diraih anak di sekolah.
3. **Tinjau Capaian Rapor:** Unduh lembar E-Rapor digital anak pada akhir semester tanpa perlu mengantre lama.

### 🛠️ D. Panduan untuk Administrator & Kepala Sekolah:
1. **Kelola Master Data & User:** Input data siswa baru, guru, mata pelajaran, dan tentukan wali kelas di setiap rombel.
2. **Aktifkan Tahun Ajaran:** Atur status semester berjalan (misal 2026/2027 Ganjil) pada menu Kelembagaan.
3. **Supervisi & Pengesahan:** Kepala Sekolah memantau dashboard statistik mutu KBM dan mengesahkan lembar E-Rapor secara digital.
4. **Ekspor Laporan:** Tarik rekapitulasi presensi dan leger nilai ke format Excel untuk kearsipan dinas pendidikan.

---

## 🎨 6. SPESIFIKASI KONTEN LANDING PAGE UNTUK DESAIN VISUAL

Berikut adalah susunan teks dan bagian yang wajib tampil pada landing page baru UPT SDN 9 Gandangbatu Sillanan:

### 1. Header (Navigasi Atas)
- Logo Sekolah + Nama **"UPT SDN 9 Gandangbatu Sillanan"** (Sub-teks: *Smart School LMS TechSoe*).
- Pill Badge Status: `T.A. 2026/2027 Ganjil`.
- Menu Navigasi: *Beranda, Profil Sekolah, Modul Fitur, Panduan Pengguna, Pengumuman*.
- Tombol CTA Utama: `Masuk ke Portal / Login` (Warna Deep Burgundy `#800020`).

### 2. Hero Section (Halaman Utama)
- Tagline: `Sistem Informasi Pembelajaran & Akademik Terpadu`
- Headline Utama: **"Transformasi Digital Pendidikan di UPT SDN 9 Gandangbatu Sillanan"**
- Sub-headline: *"Ekosistem terintegrasi yang menggabungkan pembelajaran daring modern dengan tata kelola administrasi akademik, buku induk siswa, presensi harian, hingga otomatisasi pencetakan E-Raport."*
- 2 Tombol Aksi: `Masuk ke Portal Akademik` (Primary Burgundy) & `Pelajari Modul & Panduan` (Secondary White).
- 4 Metrik Kilat:
  - 🏫 **Jenjang Sekolah:** Kelas 1 - Kelas 6 (Sekolah Dasar)
  - 📍 **Wilayah Satuan:** Gandangbatu Sillanan, Tana Toraja, Sulsel
  - ⚙️ **Arsitektur:** Laravel 13 & React (Inertia.js v2)
  - 🔒 **Keamanan Data:** RBAC 6 Role & Enkripsi SSL TLS 1.3

### 3. Seksi Profil & Nilai Utama Sekolah
- Penjelasan profil UPT SDN 9 Gandangbatu Sillanan di bawah kepemimpinan **Hendrika Genti, S.Pd.SD.**.
- 3 Card Nilai Utama: *Integritas & Karakter Siswa*, *Akademik Digital Modern*, dan *Transparansi Kolaborasi Sekolah & Orang Tua*.

### 4. Seksi Gambaran Fitur LMS (6 Grid Card)
- Card 1: **Manajemen Multi-Role** (Admin, Guru, Siswa, Wali Kelas, BK, Kepsek).
- Card 2: **LMS & Bahan Ajar Digital** (Modul PDF, PPT, Video, Tugas Daring).
- Card 3: **Presensi Harian Terintegrasi** (Catatan Hadir/Izin/Sakit/Alpa Otomatis).
- Card 4: **Otomatisasi E-Raport** (Pengolahan Nilai & Cetak PDF Resmi Kurikulum Merdeka).
- Card 5: **Manajemen BK & Prestasi** (Konseling, Poin Pelanggaran & Catatan Prestasi).
- Card 6: **Ujian Online (CBT)** (Bank Soal, Anti-Curang, Timer & Grading Otomatis).

### 5. Seksi Panduan Pengguna (Tabbed User Guide)
- Menampilkan tab panduan interaktif untuk **Siswa**, **Guru**, **Orang Tua**, dan **Admin/Kepsek**.

### 6. Banner Keamanan & Footer Penutup
- Banner Burgundy: *"Keamanan Data & Privasi Peserta Didik - Didukung enkripsi kata sandi terstandarisasi, validasi data berlapis, log audit aktivitas, serta pencadangan berkala."*
- Footer: *"© 2026 UPT SDN 9 Gandangbatu Sillanan. Seluruh Hak Cipta Dilindungi. Dikembangkan oleh TechSoe (Teknologi Inovasi Soedirman)."*

---
*Dokumen ini disusun lengkap berdasarkan arsitektur, PRD, dan kode program nyata Smart School LMS UPT SDN 9 Gandangbatu Sillanan.*
