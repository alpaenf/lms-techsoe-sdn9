# PRODUCT REQUIREMENT DOCUMENT (PRD)
## Smart School Learning Management System (LMS) Terintegrasi

---

| Parameter Dokumen | Keterangan |
| :--- | :--- |
| **Nama Dokumen** | Product Requirement Document (PRD) — Smart School LMS |
| **Target Institusi** | UPT SDN 9 Gandangbatu Sillanan[cite: 1] |
| **Penyedia Solusi** | TechSoe (Teknologi Inovasi Soedirman)[cite: 1] |
| **Penanggung Jawab Klien** | Hendrika Genti, S.Pd.SD. (NIP. 198502012010012025)[cite: 1] |
| **Penanggung Jawab Vendor**| Nadzare Kafah Alfatiha[cite: 1] |
| **Nomor Dokumen Rujukan** | 05/TS/PENAWARAN/VIII/2026[cite: 1] |
| **Tanggal Terbit Dokumen** | 21 September 2026[cite: 1] |
| **Versi Dokumen** | 1.0.0 (Production Release Candidate) |

---

## 1. Pendahuluan & Latar Belakang

### 1.1 Latar Belakang Masalah
Transformasi digital di lingkungan institusi pendidikan dasar memerlukan ekosistem terpadu yang tidak hanya berfungsi sebagai media penyampaian materi, melainkan juga mengintegrasikan administrasi akademik secara terstruktur[cite: 1]. Pada UPT SDN 9 Gandangbatu Sillanan, tata kelola presensi, riwayat buku induk, pengolahan rapor, dan pemantauan bimbingan konseling memerlukan platform sentral yang akurat dan mudah diakses[cite: 1].

### 1.2 Ringkasan Produk (*Product Overview*)
Smart School LMS TechSoe adalah sistem berbasis web responsif yang menggabungkan kapabilitas *Learning Management System* (LMS) modern dengan sistem informasi administrasi sekolah[cite: 1]. Platform ini menghubungkan enam peran pengguna: Administrator, Guru, Siswa, Wali Kelas, Guru BK, dan Pimpinan/Kepala Sekolah dalam satu basis data terpusat[cite: 1].

### 1.3 Tujuan Pengembangan
* Menyediakan platform terpadu untuk kegiatan belajar mengajar daring/hibrida dan administrasi akademik sekolah[cite: 1].
* Mengimplementasikan kontrol hak akses berbasis peran (*Role-Based Access Control*) yang aman dan akuntabel[cite: 1].
* Mengotomatisasi rekapitulasi presensi, penilaian berkala, dan penerbitan E-Raport[cite: 1].
* Memfasilitasi pengambilan keputusan pimpinan sekolah melalui dasbor statistik visual dan fitur ekspor data laporan yang fleksibel[cite: 1].

---

## 2. Panduan Desain & Antarmuka (*Design System*)

Sistem mengusung tema **Modern Professional Education**, mengedepankan keterbacaan tinggi, kerapian tata letak, dan interaksi yang intuitif.

### 2.1 Tipografi
* **Font Family:** `Poppins`, sans-serif (Google Fonts).
* **Hierarki Teks:**
  * **H1 / Judul Utama:** Poppins SemiBold / Bold (600/700), 28px – 32px.
  * **H2 / Judul Halaman & Modul:** Poppins SemiBold (600), 20px – 24px.
  * **H3 / Judul Seksi & Card:** Poppins Medium (500), 16px – 18px.
  * **Body Text:** Poppins Regular (400), 14px, *line-height* 1.6.
  * **Caption / Meta Data / Form Labels:** Poppins Regular / Medium (400/500), 12px.

### 2.2 Palet Warna (*Color Palette*)
* **Warna Dasar (*Base Colors*):**
  * `Pure White` (`#FFFFFF`): Warna latar kartu modul, panel form, dropdown, dan modal pop-up.
  * `Off-White Canvas` (`#F8F9FA`): Warna latar belakang utama viewport untuk mereduksi ketegangan mata.
  * `Border Stroke` (`#E2E8F0`): Garis pembatas tabel, divider, dan batas kartu.
* **Warna Sekunder & Aksen (*Secondary / Burgundy Red*):**
  * `Primary Burgundy` (`#800020`): Aksen utama, tombol aksi utama (*CTA*), menu navigasi aktif, badge utama.
  * `Deep Burgundy` (`#5C0017`): Warna status hover, header tabel data prioritas, dan footer navigasi.
  * `Burgundy Soft Tint` (`#FDF2F4`): Latar menu navigasi aktif, highlight baris tabel saat dihover, dan alert box netral.
  * `Burgundy Border Focus` (`#E8B4B8`): Garis batas field form saat kondisi aktif/fokus.
* **Warna Fungsional / Status:**
  * `Success` (`#10B981` / Soft: `#ECFDF5`): Indikator kehadiran Hadir (H), status tugas selesai, nilai tuntas.
  * `Warning` (`#F59E0B` / Soft: `#FFFBEB`): Indikator Izin (I), status tugas menunggu penilaian.
  * `Danger` (`#EF4444` / Soft: `#FEF2F2`): Indikator Alpa (A), pelanggaran siswa, deadline terlewat.

### 2.3 Standar Komponen Antarmuka (*UI Components*)
* **Top Navigation Bar:** Berwarna putih solid dengan garis batas bawah halus tipis (`#E2E8F0`), menampilkan identitas sekolah, penanda semester aktif, lonceng notifikasi, dan avatar profil pengguna.
* **Collapsible Sidebar:** Latar belakang putih dengan transisi halus, ikon menu modern, dan bilah vertikal rounded burgundy di sisi kiri teks menu aktif.
* **Data Presentation Tables:** Menggunakan tata letak renggang (*comfortable padding*), zebra-striping lembut, pemilahan kolom (*sortable*), dan pagination statis maupun dinamis.
* **Cards & Containers:** Sudut membulat (*border-radius: 12px*), bayangan tipis (*box-shadow: 0 1px 3px rgba(0,0,0,0.05)*), dan padding dalam seragam 20px–24px.

---

## 3. Matriks Peran & Hak Akses Pengguna (*RBAC*)

Sistem membagi pengguna ke dalam enam tingkatan peran[cite: 1]:

| Peran (*Role*) | Deskripsi Hak Akses Utama |
| :--- | :--- |
| **Administrator** | Akses menyeluruh terhadap sistem: manajemen pengguna, konfigurasi kelembagaan, master data, konfigurasi akademik, pemeliharaan sistem, serta monitoring log aktivitas[cite: 1]. |
| **Guru** | Pengelolaan kelas dan mata pelajaran yang diampu, penyusunan materi ajar, pembuatan serta penilaian tugas/ujian, pengisian presensi siswa, dan input leger nilai capaian belajar[cite: 1]. |
| **Siswa** | Akses pembelajaran digital mandiri: melihat dan mengunduh materi ajar, pengumpulan tugas, pengerjaan kuis/ujian, pemantauan riwayat presensi harian, dan melihat hasil penilaian/rapor[cite: 1]. |
| **Wali Kelas** | Pemantauan komprehensif kelas binaan: monitoring kehadiran kolektif siswa, rekapitulasi progres nilai kelas, verifikasi data rapor siswa, dan percetakan rapor digital[cite: 1]. |
| **Bimbingan Konseling (BK)** | Pencatatan sesi konseling, penanganan pelanggaran kedisiplinan, penetapan sanksi atau pembinaan, pencatatan prestasi non-akademik, dan penerbitan surat pemanggilan wali[cite: 1]. |
| **Pimpinan / Manajemen** | Akses monitoring eksekutif: dashboard statistik sekolah secara real-time, monitoring ketercapaian belajar dan presensi, serta unduh rekapitulasi laporan strategis[cite: 1]. |

---

## 4. Alur Kerja Sistem (*System Workflow*)

Aktivitas operasional Smart School LMS terbagi dalam lima fase sekuensial[cite: 1]:


```

[ 01. ADMINISTRASI ] ────> [ 02. PEMBELAJARAN ] ────> [ 03. AKTIVITAS SISWA ]
• Setup Tahun Ajaran       • Unggah Materi             • Akses Materi Belajar
• Registrasi Akun          • Buat Tugas & Asesmen      • Kerjakan Tugas & Kuis
• Plotting Rombel/Mapel    • Buka Sesi Presensi        • Pantau Nilai Mandiri
│                                                    │
└──────────────────┬─────────────────────────────────┘
▼
[ 04. MONITORING ]
• Wali Kelas: Presensi & Progres Kelas
• BK: Pembinaan, Pelanggaran & Konseling
• Pimpinan: Dashboard Eksekutif & Statistik
│
▼
[ 05. PELAPORAN ]
• Pengolahan Nilai E-Raport
• Rekapitulasi Presensi Periodik
• Ekspor Dokumen ke Format Excel

```

* **Fase 01 (Administrasi):** Admin menginisialisasi parameter akademik (tahun ajaran, semester), akun pengguna, kelas rombel, dan distribusi mata pelajaran[cite: 1].
* **Fase 02 (Pembelajaran):** Guru menyusun rencana belajar, membagikan modul, mempublikasikan penugasan/asesmen, dan membuka form presensi[cite: 1].
* **Fase 03 (Aktivitas Siswa):** Siswa mengakses materi ajar, mengirimkan hasil penugasan, mengikuti asesmen, serta melihat pengumuman kelas[cite: 1].
* **Fase 04 (Monitoring):** Wali kelas dan guru BK memantau kehadiran, ketercapaian akademik, dan catatan disiplin, sementara pimpinan memantau via dashboard ringkasan[cite: 1].
* **Fase 05 (Pelaporan):** Pengolahan akumulasi nilai menjadi E-Raport resmi dan penarikan berkas laporan dalam format cetak maupun spreadsheet (Excel)[cite: 1].

---

## 5. Rincian Kebutuhan Fungsional (12 Modul Inti)

### Modul 01: Manajemen Multi-Level User[cite: 1]
* **Autentikasi & Akun:** Login berbasis akun terenkripsi, logout aman, penanganan sesi kedaluwarsa otomatis, dan perlindungan brute-force[cite: 1].
* **Manajemen Peran:** CRUD akun untuk 6 entitas peran (Admin, Guru, Siswa, Wali Kelas, BK, Pimpinan)[cite: 1].
* **Profil & Sandi:** Fitur ubah kata sandi mandiri oleh setiap pengguna dan utilitas *reset password* langsung oleh Admin.
* **Manajemen Status:** Pengaktifan dan penonaktifan akun secara massal untuk siswa alumni atau tenaga pendidik mutasi.

### Modul 02: Kelembagaan & Profil Sekolah[cite: 1]
* **Identitas Satuan Pendidikan:** Pengelolaan profil UPT SDN 9 Gandangbatu Sillanan (NPSN, alamat lengkap, kontak resmi, logo sekolah, serta data Kepala Sekolah)[cite: 1].
* **Konfigurasi Kalender Akademik:** Manajemen tahun ajaran aktif, semester (Ganjil/Genap), dan penguncian basis data semester lampau[cite: 1].
* **Struktur Kelas & Program:** Konfigurasi rombongan belajar (Tingkat Kelas 1 hingga Kelas 6) dan pemetaan kurikulum yang diimplementasikan[cite: 1].

### Modul 03: Master Data[cite: 1]
* **Data Tenaga Pendidik & Kependidikan:** Pengelolaan direktori guru (NIP/NUPTK, status kepegawaian, jabatan, kualifikasi)[cite: 1].
* **Data Rombongan Belajar (Rombel):** Pengorganisasian alokasi siswa ke dalam masing-masing ruang kelas[cite: 1].
* **Data Mata Pelajaran:** Katalog mata pelajaran formal, muatan lokal, pembagian kategori kompetensi, serta Kriteria Ketuntasan Minimal (KKM)/Capaian Pembelajaran[cite: 1].
* **Kalender Kegiatan:** Agenda libur nasional, jadwal penilaian harian/semester, dan kegiatan resmi sekolah[cite: 1].

### Modul 04: Buku Induk Siswa[cite: 1]
* **Profil Komprehensif Siswa:** Pencatatan nomor induk siswa, NISN, NIK, tempat/tanggal lahir, jenis kelamin, dan data demografi lengkap[cite: 1].
* **Data Orang Tua / Wali:** Profil identitas ayah, ibu, atau wali murid beserta pekerjaan, tingkat pendidikan, alamat domisili, dan nomor kontak darurat[cite: 1].
* **Riwayat Siswa:** Rekam jejak asal sekolah, tanggal registrasi masuk, mutasi kelas, hingga riwayat kelulusan[cite: 1].
* **Pencetakan Berkas Induk:** Ekspor profil lembar buku induk siswa ke format dokumen cetak resmi.

### Modul 05: LMS Pembelajaran[cite: 1]
* **Manajemen Materi Ajar:** Pengorganisasian topik modul berdasarkan silabus dan capaian kompetensi dasar[cite: 1].
* **Dukungan Multi-Format:** Fasilitas unggah dokumen bacaan (PDF, PPT, DOCX), lembar kerja, dan penyematan tautan video edukasi[cite: 1].
* **Papan Instruksi & Forum:** Kanal interaksi tanya jawab antara guru dan siswa di setiap topik modul pembelajaran[cite: 1].
* **Instruksi Pengumuman Kelas:** Penyampaian pesan instruksi pembelajaran spesifik oleh guru mapel[cite: 1].

### Modul 06: Presensi Guru & Siswa[cite: 1]
* **Presensi Siswa Harian:** Pencatatan status kehadiran oleh guru kelas/mapel dengan pilihan: Hadir (H), Izin (I), Sakit (S), atau Alpa (A)[cite: 1].
* **Presensi Kehadiran Guru:** Pencatatan catatan kehadiran tenaga pendidik dalam pelaksanaan tugas harian[cite: 1].
* **Rekapitulasi Otomatis:** Perhitungan persentase kehadiran per siswa, per kelas, dan per periode secara otomatis[cite: 1].
* **Filter Pemantauan:** Pencarian riwayat presensi berdasarkan rentang tanggal, tingkatan kelas, dan nama siswa[cite: 1].

### Modul 07: Tugas, Ujian & Penilaian[cite: 1]
* **Distribusi Tugas Digital:** Pengaturan tenggat waktu pengumpulan (*due date*), petunjuk tugas, dan berkas lampiran soal[cite: 1].
* **Pengumpulan Tugas Siswa:** Sarana pengunggahan berkas jawaban tugas oleh siswa (file digital atau foto pekerjaan buku catatan)[cite: 1].
* **Modul Asesmen / Ujian:** Penyusunan instrumen soal ujian daring (pilihan ganda dengan penilaian otomatis serta esai/uraian pendek)[cite: 1].
* **Rubrik Nilai & Umpan Balik:** Pengisian nilai hasil evaluasi tugas disertai catatan evaluatif guru untuk siswa[cite: 1].

### Modul 08: E-Raport[cite: 1]
* **Pengolahan Nilai Otomatis:** Penggabungan pembobotan nilai tugas berkala, penilaian tengah semester, dan penilaian akhir semester secara terstruktur[cite: 1].
* **Konversi Capaian & Predikat:** Pengubahan nilai kuantitatif menjadi deskripsi capaian kompetensi dan kualifikasi predikat akademik secara otomatis[cite: 1].
* **Verifikasi & Validasi:** Skema review nilai dari guru mapel ke wali kelas hingga pengesahan oleh kepala sekolah.
* **Cetak Rapor Digital:** Pembuatan berkas lembar rapor siap cetak dalam tata letak format baku sekolah[cite: 1].

### Modul 09: Manajemen Bimbingan Konseling (BK)[cite: 1]
* **Buku Catatan Konseling:** Dokumentasi wawancara bimbingan dan sesi konseling perilaku siswa secara konfidensial[cite: 1].
* **Buku Rekam Pelanggaran:** Sistem inventarisasi pelanggaran kedisiplinan sekolah dilengkapi poin/kategori sanksi[cite: 1].
* **Pencatatan Rekam Prestasi:** Inventarisasi prestasi akademik dan non-akademik siswa di luar kurikulum reguler.
* **Tindak Lanjut & Pembinaan:** Pencetakan surat tindak lanjut pembinaan dan pemanggilan orang tua/wali murid[cite: 1].

### Modul 10: Ekspor Data & Laporan[cite: 1]
* **Ekspor Spreadsheet:** Fitur penarikan data ke dalam berkas Microsoft Excel (`.xlsx`) untuk seluruh tabel master (siswa, guru, rombel)[cite: 1].
* **Ekspor Presensi:** Rekap absensi bulanan dan semesteran dalam format tabel cetak Excel[cite: 1].
* **Ekspor Leger Nilai:** Lembar rekapitulasi nilai komprehensif per kelas untuk kebutuhan arsip kurikulum[cite: 1].

### Modul 11: Dashboard & Monitoring[cite: 1]
* **Metrik Utama Sekolah:** Statistik total siswa aktif, total guru, rombongan belajar, dan rasio kehadiran harian[cite: 1].
* **Visualisasi Tren:** Tampilan grafik tren kehadiran berkala dan rekapitulasi ketuntasan mata pelajaran[cite: 1].
* **Panel Notifikasi Aktivitas:** Ringkasan tugas yang baru masuk, sesi konseling terkini, dan agenda ujian mendatang[cite: 1].

### Modul 12: Notifikasi & Informasi[cite: 1]
* **Broadcast Pengumuman:** Pengiriman buletin informasi dengan segregasi penerima (Semua Warga Sekolah, Khusus Tenaga Pendidik, Khusus Siswa)[cite: 1].
* **Popup / Banner Interaktif:** Penyampaian maklumat penting langsung di halaman depan sesaat setelah pengguna login[cite: 1].
* **Indikator Lencana (*Notification Badges*):** Penanda visual di navigasi atas saat ada materi baru, tugas baru, atau rilis nilai ujian.

---

## 6. Kebutuhan Non-Fungsional (*NFR*)

### 6.1 Aspek Keamanan (*Security*)
* **Enkripsi Saluran:** Penggunaan protokol HTTPS dengan sertifikat SSL aktif secara penuh di lingkungan produksi[cite: 1].
* **Proteksi Akses:** Otentikasi berbasis session token yang terlindungi dari serangan CSRF (*Cross-Site Request Forgery*)[cite: 1].
* **Validasi Input:** Sanitasi input ketat pada setiap parameter URL dan form input untuk meniadakan risiko SQL Injection dan XSS[cite: 1].
* **Pencadangan Data (*Backup*):** Prosedur pencadangan basis data dan direktori penyimpanan file secara terjadwal[cite: 1].

### 6.2 Performa & Keandalan (*Performance & Reliability*)
* **Waktu Respon Halaman:** Waktu tunggu muat data rata-rata kurang dari 2 detik dalam lalu lintas beban standar.
* **Optimasi Penyimpanan:** Pembatasan kapasitas per file unggahan bahan ajar dan jawaban tugas (maksimal 10 MB).
* **Integritas Relasi Basis Data:** Pemanfaatan *foreign key constraints* dan indeks performa pada kolom krusial (NISN, NIP, ID Rombel, ID Mapel).

### 6.3 Aksesibilitas & Kompatibilitas (*Responsiveness & Compatibility*)
* **Desain Responsif:** Tampilan adaptif yang berfungsi mulus di layar smartphone, tablet, laptop, dan komputer desktop[cite: 1].
* **Dukungan Peramban (*Cross-Browser*):** Kompatibilitas penuh pada Google Chrome, Mozilla Firefox, Microsoft Edge, dan Apple Safari versi modern[cite: 1].

---

## 7. Arsitektur Teknis & Infrastruktur

Spesifikasi teknis dasar yang direkomendasikan untuk implementasi sistem[cite: 1]:

| Komponen Arsitektur | Pilihan Teknologi Rekomendasi |
| :--- | :--- |
| **Arsitektur Platform** | Web-based Application (Model-View-Controller)[cite: 1] |
| **Backend Framework** | PHP 8.x / Laravel Framework[cite: 1] |
| **Database Server** | MySQL versi 8.0 / MariaDB 10.x[cite: 1] |
| **Frontend Stack** | HTML5, CSS3/Tailwind, Modern JavaScript, Font Poppins[cite: 1] |
| **Web Server** | Nginx atau Apache dengan konfigurasi Gzip aktif[cite: 1] |
| **Keamanan Jaringan** | HTTPS / Sertifikat SSL Let's Encrypt[cite: 1] |
| **Hosting / Server** | VPS Cloud (Spesifikasi awal disesuaikan dengan volume pengguna sekolah)[cite: 1] |
| **Format Ekspor File** | Microsoft Excel (`.xlsx`) dan format cetak PDF[cite: 1] |

---

## 8. Jadwal Pelaksanaan & *Milestone*

Proyek dirancang selesai dalam durasi kerja 2 pekan terstruktur[cite: 1]:

| Periode | Tahap Pekerjaan | Uraian Aktivitas Teknis |
| :--- | :--- | :--- |
| **Minggu 1** | **Analisis & UI/UX**[cite: 1] | • Wawancara analisis alur kerja sekolah dan finalisasi kebutuhan[cite: 1]<br>• Perancangan struktur tata letak UI (White & Burgundy, Font Poppins)[cite: 1]<br>• Perancangan skema relasi basis data (ERD) dan arsitektur sistem[cite: 1] |
| **Minggu 1 s/d Minggu 2** | **Development, Integrasi & Testing**[cite: 1] | • Implementasi kode program backend dan antarmuka untuk 12 modul[cite: 1]<br>• Integrasi basis data, hak akses RBAC, dan validasi fungsional modul[cite: 1]<br>• Pengujian fungsi, perbaikan bug (*bug fixing*), dan uji responsivitas tampilan[cite: 1] |
| **Minggu 2** | **UAT, Deployment & Training**[cite: 1] | • Pengujian bersama pihak sekolah (*User Acceptance Test*)[cite: 1]<br>• Deployment aplikasi pada server produksi dan aktivasi domain/SSL[cite: 1]<br>• Pelatihan (*knowledge transfer*) kepada Admin dan perwakilan guru[cite: 1]<br>• Penyerahan panduan operasional dan serah terima sistem[cite: 1] |

---

## 9. Rencana Anggaran & Biaya Investasi

Berdasarkan Dokumen Penawaran Resmi Nomor: `05/TS/PENAWARAN/VIII/2026`[cite: 1]:

| No | Rincian Pekerjaan | Ruang Lingkup Output | Nilai Biaya (IDR) |
| :---: | :--- | :--- | :---: |
| 1 | **Analisis & UI/UX**[cite: 1] | Analisis alur kebutuhan sekolah, struktur tata letak modul, dan desain antarmuka responsif[cite: 1] | Rp 500.000[cite: 1] |
| 2 | **Pengembangan LMS**[cite: 1] | Implementasi penuh 12 modul fungsional LMS dan modul administrasi sekolah[cite: 1] | Rp 2.000.000[cite: 1] |
| 3 | **Deployment & Konfigurasi**[cite: 1] | Konfigurasi web server, migrasi basis data ke VPS, aktivasi domain, dan sertifikat HTTPS/SSL[cite: 1] | Rp 300.000[cite: 1] |
| 4 | **Training & Dokumentasi**[cite: 1] | Sosialisasi/pelatihan teknis pengguna utama serta berkas dokumentasi buku panduan dasar[cite: 1] | Rp 300.000[cite: 1] |
| 5 | **Maintenance / Support**[cite: 1] | Layanan pendampingan purnajual dan penanganan kendala sistem/bug dalam masa garansi[cite: 1] | Rp 400.000[cite: 1] |
| **TOTAL** | **Nilai Investasi Proyek**[cite: 1] | **Pengembangan Smart School LMS UPT SDN 9 Gandangbatu Sillanan**[cite: 1] | **Rp 3.500.000**[cite: 1] |

*Catatan:* Nilai investasi di atas belum mencakup beban pemotongan pajak yang berlaku[cite: 1]. Biaya operasional sewa hosting/VPS tahunan dan layanan API pihak ketiga berbayar (jika ada kebutuhan ke depan) berada di luar lingkup penawaran ini[cite: 1].

---

## 10. Deliverables (Artefak Hasil Proyek)

TechSoe menyerahkan artefak proyek sebagai berikut[cite: 1]:
1. **Source Code Aplikasi:** Seluruh kode sumber platform Smart School LMS siap jalan sesuai kesepakatan serah terima lisensi[cite: 1].
2. **Database & Skema:** Basis data terstruktur lengkap beserta skema relasi dan data awal sekolah[cite: 1].
3. **Sistem Terpasang (*Live Instance*):** Aplikasi web yang terpasang aktif pada server produksi dan siap digunakan oleh warga sekolah[cite: 1].
4. **Buku Panduan (*User Manual*):** Dokumen petunjuk teknis operasional untuk Administrator dan Guru[cite: 1].
5. **Dokumentasi Deployment:** Catatan konfigurasi teknis lingkungan server hosting[cite: 1].
6. **Berita Acara UAT & Garansi:** Lembar verifikasi penerimaan fungsionalitas sistem yang disahkan bersama[cite: 1].

---

## 11. Layanan Dukungan & Pemeliharaan (*Maintenance*)

TechSoe memberikan jaminan keberlangsungan sistem pasca implementasi meliputi[cite: 1]:
* **Garansi Bug (*Bug Warranty*):** Layanan perbaikan terhadap bug kode yang timbul dari ruang lingkup pengembangan selama periode garansi[cite: 1].
* **Bantuan Teknis (*Technical Support*):** Layanan asistensi teknis dan operasional sistem pada jam kerja yang disepakati[cite: 1].
* **Pemeliharaan Berkala (*Maintenance*):** Pengecekan berkala terhadap integritas basis data dan keandalan sistem[cite: 1].
* **Pengembangan Lanjutan:** Peluang penambahan fitur atau modul baru di masa mendatang melalui mekanisme pengajuan pekerjaan tambahan (*Change Request*)[cite: 1].

---

## 12. Lembar Pengesahan

Dokumen PRD ini disetujui sebagai acuan spesifikasi resmi pengembangan platform:

| Pihak Pertama (Penyedia Solusi) | Pihak Kedua (Pengguna Sistem) |
| :---: | :---: |
| **TechSoe (Teknologi Inovasi Soedirman)**[cite: 1] | **UPT SDN 9 Gandangbatu Sillanan**[cite: 1] |
| | |
| | |
| **Nadzare Kafah Alfatiha**[cite: 1] | **Hendrika Genti, S.Pd.SD.**[cite: 1] |
| Koordinator Pelaksana Proyek[cite: 1] | Kepala Sekolah (NIP. 198502012010012025)[cite: 1] |

```