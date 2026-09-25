# Panduan Akun Uji Coba dan Hak Akses Role Pengguna
## Smart School LMS - UPT SDN 9 Gandangbatu Sillanan

Dokumen ini memuat daftar akun uji coba (demo credentials) yang telah disediakan di dalam basis data sistem, beserta matriks hak akses dan penjelasan fungsi setiap halaman aplikasi berdasarkan masing-masing peran (role) pengguna.

---

## 1. Daftar Akun Login Uji Coba

Seluruh akun demo di bawah ini telah terdaftar aktif pada basis data MySQL dengan kata sandi bawaan yang seragam. Sistem mendukung proses autentikasi baik menggunakan **Email** maupun **Username / NIP / NISN**.

| No | Peran (Role) | Nama Pengguna | Username / NIP / NISN | Alamat Email | Kata Sandi (Default) |
|---|---|---|---|---|---|
| 1 | Administrator Sistem (`admin`) | Administrator Sistem | `admin` | `admin@sdn9gandangbatu.sch.id` | `password123` |
| 2 | Kepala Sekolah (`pimpinan`) | Hendrika Genti, S.Pd.SD. | `198502012010012025` | `kepsek@sdn9gandangbatu.sch.id` | `password123` |
| 3 | Guru / Wali Kelas (`guru`) | Budi Santoso, S.Pd. | `198705122015021003` | `guru@sdn9gandangbatu.sch.id` | `password123` |
| 4 | Guru BK (`bk`) | Maria Rante, S.Pd. | `199003202019032008` | `bk@sdn9gandangbatu.sch.id` | `password123` |
| 5 | Peserta Didik (`siswa`) | Siti Nurhaliza | `0081234567` | `siswa@sdn9gandangbatu.sch.id` | `password123` |

> Catatan: Pada halaman login (`/login`), pengguna juga dapat menggunakan fitur kartu pengisian cepat (quick fill) untuk memasukkan kredensial akun uji coba secara otomatis dengan satu kali klik.

---

## 2. Matriks Hak Akses Modul per Role

Setiap peran memiliki wewenang operasional yang disesuaikan dengan tupoksi pada ekosistem UPT SDN 9 Gandangbatu Sillanan:

| Modul Aplikasi | Rute Utama | Admin | Kepala Sekolah | Guru / Wali Kelas | Guru BK | Siswa |
|---|---|:---:|:---:|:---:|:---:|:---:|
| **Dashboard** | `/dashboard` | Akses Penuh | Akses Penuh | Sesuai Kelas | Sesuai Kasus | Sesuai Pribadi |
| **Kelembagaan** | `/kelembagaan` | Kelola Penuh | Monitoring & Validasi | Lihat Profil & Pengumuman | Lihat Profil & Pengumuman | Lihat Profil & Pengumuman |
| **Master Data** | `/master-data` | Kelola Penuh | Monitoring & Verifikasi | Lihat Rombel & Siswa | Lihat Data Siswa | Profil Pribadi |
| **E-Learning** | `/elearning` | Monitoring Sistem | Monitoring Mutu | Kelola Materi & Tugas | - | Akses Materi & Kumpul Tugas |
| **Presensi** | `/presensi` | Kelola & Rekap | Rekap Sekolah | Input Presensi Siswa | Monitoring Kehadiran | Lihat Catatan Presensi |
| **E-Rapor** | `/erapor` | Konfigurasi Leger | Pengesahan Rapor | Input Nilai & Cetak | - | Lihat & Unduh Rapor |
| **Manajemen BK** | `/bk` | Tata Kelola Data | Monitoring & Disposisi | Rujukan & Kolaborasi | Kelola Konseling & Poin | Lihat Riwayat Prestasi |
| **Profil Pengguna** | `/profile` | Akun Sendiri | Akun Sendiri | Akun Sendiri | Akun Sendiri | Akun Sendiri |

Keterangan simbol matriks:
- **Akses Penuh**: Memiliki wewenang Create, Read, Update, Delete secara komprehensif.
- **Kelola**: Memiliki wewenang menginput, menyunting, dan memproses data sesuai ruang lingkup tugas.
- **Monitoring**: Memiliki wewenang meninjau seluruh data rekapitulasi untuk kebutuhan evaluasi dan pengambilan keputusan.
- **Lihat**: Memiliki wewenang baca (Read-only) terhadap informasi yang dipublikasikan.

---

## 3. Rincian Halaman dan Fungsi per Peran (Role)

### 3.1. Role: Administrator Sistem (`admin`)
Peran ini bertanggung jawab atas operasional teknis, integritas data induk, pemeliharaan sistem, dan konfigurasi master aplikasi.

1. **Halaman Dashboard (`/dashboard`)**
   - Menampilkan metrik kesehatan sistem: total pengguna terdaftar, jumlah rombel aktif, kapasitas penyimpanan materi, dan riwayat aktivitas sistem.
2. **Halaman Kelembagaan (`/kelembagaan`)**
   - Tab Profil Lembaga: Pembaruan identitas sekolah, NPSN (40307044), data perizinan, kontak, dan alamat sekolah.
   - Tab Tahun Akademik: Pengaturan tahun ajaran aktif (misal 2026/2027 Ganjil), pembukaan/penutupan semester, dan kalender kegiatan sekolah.
   - Tab Pusat Pengumuman: Publikasi maklumat resmi sekolah kepada seluruh warga satuan pendidikan.
3. **Halaman Master Data (`/master-data`)**
   - Tab Rombel: Manajemen ruang kelas (Kelas 1 sampai Kelas 6) dan penetapan guru wali kelas.
   - Tab Pendidik: Perekaman data NIP, NUPTK, nama, status kepegawaian (PNS, PPPK, Honorer), dan penugasan mata pelajaran.
   - Tab Siswa: Registrasi data peserta didik baru, penomoran NISN/NIS, riwayat kelas, dan kontak orang tua/wali.
   - Tab Mata Pelajaran: Penentuan struktur kurikulum SD, kode mapel, kategori muatan lokal, dan standar nilai KKM/KKTP.
4. **Halaman Presensi (`/presensi`)**
   - Meninjau rekapitulasi kehadiran global baik kehadiran siswa harian maupun kehadiran tenaga pendidik dan tenaga kependidikan.
5. **Halaman E-Learning & E-Rapor (`/elearning`, `/erapor`)**
   - Pengawasan aktivitas modul daring dan pemeliharaan format kalkulasi nilai raport akhir semester.
6. **Halaman Manajemen Profil (`/profile`)**
   - Pembaruan informasi kredensial administrator, penggantian password keamanan, dan pengelolaan sesi aktif.

---

### 3.2. Role: Kepala Sekolah / Pimpinan (`pimpinan`)
Peran ini difokuskan pada fungsi manajerial, pengawasan mutu pendidikan, monitoring kedisiplinan warga sekolah, dan pengesahan dokumen formal sekolah.

1. **Halaman Dashboard Eksekutif (`/dashboard`)**
   - Ringkasan KPI sekolah: tingkat kehadiran siswa dan guru hari ini, rasio kelengkapan perangkat ajar, dan rekap capaian akademik.
2. **Halaman Kelembagaan (`/kelembagaan`)**
   - Validasi data kelembagaan resmi sekolah dan peninjauan draf pengumuman sebelum dibagikan kepada wali murid.
3. **Halaman Master Data Monitoring (`/master-data`)**
   - Meninjau sebaran data peserta didik per rombel, profil kompetensi tenaga pendidik, dan pemetaan guru kelas.
4. **Halaman Supervisi E-Learning (`/elearning`)**
   - Melakukan supervisi klinis atas bahan ajar digital, keaktifan interaksi penugasan, dan ketepatan waktu pengembalian nilai tugas.
5. **Halaman Presensi Tenaga Pendidik & Siswa (`/presensi?type=guru`, `/presensi?type=siswa`)**
   - Meninjau presensi harian seluruh guru (status Hadir, Dinas Luar, Izin, Sakit, Alpa) dan catatan waktu kedatangan.
   - Meninjau persentase absensi siswa per jenjang kelas untuk identifikasi tingkat partisipasi belajar.
6. **Halaman Verifikasi & Pengesahan Rapor (`/erapor?tab=cetak`)**
   - Memverifikasi kelengkapan nilai dari seluruh wali kelas.
   - Melakukan otorisasi dan pengesahan raport digital sebelum dibagikan kepada orang tua siswa.
7. **Halaman Pengawasan Kasus BK (`/bk`)**
   - Memantau penanganan kasus khusus yang memerlukan mediasi pimpinan atau kebijakan pemanggilan orang tua murid.

---

### 3.3. Role: Guru Mata Pelajaran / Wali Kelas (`guru`)
Peran ini merupakan pengguna utama proses kegiatan belajar mengajar (KBM), administrasi kelas, evaluasi capaian belajar, dan penyusunan buku laporan pendidikan.

1. **Halaman Dashboard Pengajar (`/dashboard`)**
   - Jadwal mengajar harian, daftar tugas siswa yang perlu dinilai, dan pemberitahuan penting dari sekolah.
2. **Halaman Presensi Siswa Harian (`/presensi?type=siswa`)**
   - Memilih rombongan belajar yang diampu (misal Kelas 6).
   - Menentukan tanggal presensi (otomatis terisi hari ini).
   - Menentukan status kehadiran tiap murid: Hadir (H), Izin (I), Sakit (S), atau Alpa (A).
   - Fitur efisiensi: Tombol "Tandai Semua Hadir" untuk mempercepat proses pencatatan presensi.
   - Tombol "Simpan Presensi" untuk menyimpan rekam kehadiran secara permanen ke basis data.
3. **Halaman E-Learning Guru (`/elearning`)**
   - Tab Materi Ajar (`/elearning?tab=materi`): Mengunggah materi pelajaran berupa modul teks ringkas, petunjuk belajar, atau link media pembelajaran interaktif.
   - Tab Tugas Pembelajaran (`/elearning?tab=tugas`): Membuat tugas kelas dengan tenggat waktu pengumpulan dan skor maksimal.
   - Tab Penilaian Pengumpulan (`/elearning?tab=pengumpulan`): Memeriksa hasil pekerjaan siswa, memberikan skor nilai, dan menuliskan catatan umpan balik yang membangun.
4. **Halaman E-Rapor Wali Kelas (`/erapor`)**
   - Tab Leger Nilai (`/erapor?tab=leger`): Menginput rekapitulasi nilai formatif dan sumatif per mata pelajaran.
   - Tab Cetak & Verifikasi Rapor (`/erapor?tab=cetak`): Merumuskan deskripsi capaian pembelajaran siswa (Kurikulum Merdeka), mencatat kehadiran semester, dan mencetak lembar rapor siswa.
5. **Halaman Master Data Terbatas (`/master-data`)**
   - Melihat daftar murid pada rombel ampuannya beserta nomor induk dan informasi kontak orang tua/wali siswa.

---

### 3.4. Role: Guru Bimbingan Konseling (`bk`)
Peran spesialisasi untuk pendampingan perkembangan kepribadian, sosial, penegakan tata tertib sekolah, dan pencatatan prestasi peserta didik.

1. **Halaman Dashboard Konseling (`/dashboard`)**
   - Notifikasi siswa yang membutuhkan penanganan khusus, akumulasi pelanggaran disiplin teratas, dan jadwal konseling hari ini.
2. **Halaman Manajemen BK (`/bk`)**
   - Tab Buku Konseling (`/bk?tab=konseling`): Perekaman riwayat sesi bimbingan individual atau kelompok dengan menjaga kerahasiaan catatan konseling.
   - Tab Tata Tertib & Poin Pelanggaran (`/bk?tab=pelanggaran`): Perekaman pelanggaran peraturan sekolah berdasarkan bobot poin yang berlaku (ringan, sedang, berat) serta catatan komitmen siswa.
   - Tab Inventarisasi Prestasi (`/bk?tab=prestasi`): Pencatatan prestasi yang diraih peserta didik baik di bidang akademik maupun non-akademik (olahraga, seni, keagamaan).
3. **Halaman Monitoring Presensi Siswa (`/presensi?type=siswa`)**
   - Menelusuri rekam jejak ketidakhadiran siswa tertentu yang berpotensi drop-out atau memerlukan kunjungan rumah (home visit).

---

### 3.5. Role: Peserta Didik (`siswa`)
Peran untuk siswa UPT SDN 9 Gandangbatu Sillanan dalam mengakses materi belajar, mengerjakan tugas, dan melihat rekam perkembangan belajar secara mandiri.

1. **Halaman Dashboard Siswa (`/dashboard`)**
   - Menyajikan informasi jadwal pelajaran hari ini, pengumuman sekolah, tugas aktif yang mendekati batas waktu, dan capaian poin kehadiran pribadi.
2. **Halaman E-Learning Siswa (`/elearning`)**
   - Membaca dan mempelajari materi yang telah dibagikan oleh guru kelas.
   - Mengunduh lembar kerja dan panduan pengerjaan tugas.
   - Mengunggah jawaban tugas sebelum tenggat waktu berakhir.
   - Melihat nilai tugas dan membaca catatan masukan dari guru.
3. **Halaman Catatan Presensi (`/presensi`)**
   - Melihat riwayat presensi harian diri sendiri selama semester berlangsung.
4. **Halaman E-Rapor Siswa (`/erapor`)**
   - Melihat pratinjau lembar laporan hasil belajar (rapor) digital yang telah diverifikasi dan disahkan oleh wali kelas serta kepala sekolah.
5. **Halaman Profil Akun (`/profile`)**
   - Meninjau data identitas diri (NISN, kelas) dan memperbarui kata sandi akun secara mandiri.

---

## 4. Panduan Verifikasi Uji Coba (Testing Guide)

Untuk melakukan pengujian alur fungsional pada masing-masing peran, ikuti langkah pengujian berikut:

1. Buka browser pada alamat lokal: `http://127.0.0.1:8000`
2. Klik tombol **Masuk ke Portal LMS** pada halaman utama.
3. Pada halaman Login, pilih salah satu kartu akun demo (misal **Guru / Wali Kelas**). Seluruh kolom username dan kata sandi akan terisi secara otomatis.
4. Klik **Masuk ke Sistem**.
5. Akses menu **Presensi Siswa Harian** pada bilah navigasi samping (sidebar).
6. Uji fitur pemilihan tanggal atau pergantian rombel. Klik tombol **Tandai Semua Hadir** dan tekan **Simpan Presensi**.
7. Sistem akan menampilkan notifikasi bahwa data kehadiran berhasil disimpan ke basis data MySQL.
8. Untuk berpindah akun, klik tombol **Keluar** pada pojok kanan atas navbar atau bagian bawah sidebar, kemudian ulangi langkah dengan akun peran lain (Kepala Sekolah, Guru BK, atau Siswa).
