# PANDUAN ROUTING & SPESIFIKASI ENDPOINT (ROUTING & API SPEC)
## Smart School LMS — UPT SDN 9 Gandangbatu Sillanan
**Penyedia Solusi:** TechSoe (Teknologi Inovasi Soedirman)  
**Tech Stack:** Laravel 13, React.js, Inertia.js, MySQL 8.0  
**Versi Dokumen:** 1.1.0  
**Tanggal:** 25 September 2026  

---

## 1. Ikhtisar Struktur Routing Inertia.js

Seluruh rute pada Smart School LMS disegregasi berdasarkan domain hak akses peran pengguna (*Role Grouping*) dengan perlindungan middleware otentikasi session dan otorisasi peran. Respons antarmuka dirender melalui `Inertia::render('Page/Component', $props)`.

```
/
├── auth/                         # Autentikasi (Login, Logout, Ganti Password)
├── admin/                        # Panel Administrator (React: Pages/Admin/*)
├── guru/                         # Panel Guru Mapel (React: Pages/Guru/*)
├── siswa/                        # Panel Mandiri Siswa (React: Pages/Siswa/*)
├── wali-kelas/                   # Panel Wali Kelas (React: Pages/WaliKelas/*)
├── bk/                           # Panel Bimbingan Konseling (React: Pages/BK/*)
├── pimpinan/                     # Panel Eksekutif (React: Pages/Pimpinan/*)
└── api/v1/                       # Internal Async API untuk Live Fetch & Dynamic Poll
```

---

## 2. Rute Otentikasi (routes/auth.php)

| Metode | URI | Nama Rute | Controller Action | Komponen React Target |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/login` | `login` | `AuthController@showLoginForm` | `Pages/Auth/Login.jsx` |
| `POST` | `/login` | `login.submit` | `AuthController@login` | Redirect -> Dashboard Peran |
| `POST` | `/logout` | `logout` | `AuthController@logout` | Redirect -> `/login` |
| `GET` | `/password/reset` | `password.request` | `PasswordController@showResetForm` | `Pages/Auth/ForgotPassword.jsx` |
| `POST` | `/password/reset` | `password.update` | `PasswordController@reset` | Redirect with Flash Message |

---

## 3. Rute Panel Administrator (/admin/*)
*Middleware:* `['auth', 'role:admin']`

| Metode | URI | Nama Rute | Modul | Komponen React / Action |
| :--- | :--- | :--- | :---: | :--- |
| `GET` | `/admin/dashboard` | `admin.dashboard` | Modul 11 | `Pages/Admin/Dashboard.jsx` |
| `GET` | `/admin/users` | `admin.users.index` | Modul 01 | `Pages/Admin/User/Index.jsx` |
| `POST` | `/admin/users` | `admin.users.store` | Modul 01 | `Admin/UserController@store` |
| `PUT` | `/admin/users/{id}/reset` | `admin.users.reset-password` | Modul 01 | `Admin/UserController@resetPassword` |
| `PUT` | `/admin/users/{id}/toggle`| `admin.users.toggle-status` | Modul 01 | `Admin/UserController@toggleStatus` |
| `GET` | `/admin/sekolah/profil` | `admin.school.profile` | Modul 02 | `Pages/Admin/School/Profile.jsx` |
| `POST` | `/admin/sekolah/profil` | `admin.school.update` | Modul 02 | `Admin/SchoolController@update` |
| `GET` | `/admin/akademik/tahun-ajaran`| `admin.academic-year.index` | Modul 02 | `Pages/Admin/Academic/Index.jsx` |
| `POST` | `/admin/akademik/tahun-ajaran/activate/{id}`| `admin.academic-year.activate` | Modul 02 | `Admin/AcademicController@activate` |
| `RESOURCE`| `/admin/master/guru` | `admin.teachers.*` | Modul 03 | `Pages/Admin/Teacher/Index.jsx` |
| `RESOURCE`| `/admin/master/rombel` | `admin.classes.*` | Modul 03 | `Pages/Admin/Classes/Index.jsx` |
| `RESOURCE`| `/admin/master/mapel` | `admin.subjects.*` | Modul 03 | `Pages/Admin/Subject/Index.jsx` |
| `RESOURCE`| `/admin/master/siswa` | `admin.students.*` | Modul 04 | `Pages/Admin/Student/Index.jsx` |
| `GET` | `/admin/siswa/{id}/cetak-induk` | `admin.students.print-book` | Modul 04 | Stream Download PDF Buku Induk |
| `GET` | `/admin/laporan/ekspor-excel` | `admin.reports.export-excel` | Modul 10 | Download Excel Master Data |
| `GET` | `/admin/pengumuman` | `admin.announcements.index` | Modul 12 | `Pages/Admin/Announcement/Index.jsx` |
| `POST` | `/admin/pengumuman` | `admin.announcements.store` | Modul 12 | `Admin/AnnouncementController@store` |

---

## 4. Rute Panel Guru (/guru/*)
*Middleware:* `['auth', 'role:guru']`

| Metode | URI | Nama Rute | Modul | Komponen React / Action |
| :--- | :--- | :--- | :---: | :--- |
| `GET` | `/guru/dashboard` | `guru.dashboard` | Modul 11 | `Pages/Guru/Dashboard.jsx` |
| `GET` | `/guru/kelas` | `guru.classes.index` | Modul 05 | `Pages/Guru/Class/Index.jsx` |
| `GET` | `/guru/kelas/{id}/materi` | `guru.materials.index` | Modul 05 | `Pages/Guru/Material/Index.jsx` |
| `POST` | `/guru/kelas/{id}/materi` | `guru.materials.store` | Modul 05 | `Guru/MaterialController@store` |
| `GET` | `/guru/presensi` | `guru.attendance.index` | Modul 06 | `Pages/Guru/Attendance/Index.jsx` |
| `POST` | `/guru/presensi/bulk-store`| `guru.attendance.store` | Modul 06 | `Guru/AttendanceController@bulkStore`|
| `GET` | `/guru/tugas` | `guru.assignments.index` | Modul 07 | `Pages/Guru/Assignment/Index.jsx` |
| `POST` | `/guru/tugas` | `guru.assignments.store` | Modul 07 | `Guru/AssignmentController@store` |
| `GET` | `/guru/tugas/{id}/penilaian`| `guru.assignments.grading` | Modul 07 | `Pages/Guru/Assignment/Grading.jsx` |
| `POST` | `/guru/tugas/{id}/penilaian`| `guru.assignments.submit-grade`| Modul 07 | `Guru/AssignmentController@grade` |
| `GET` | `/guru/leger-nilai` | `guru.grades.index` | Modul 08 | `Pages/Guru/Grade/Index.jsx` |
| `POST` | `/guru/leger-nilai/save` | `guru.grades.store` | Modul 08 | `Guru/GradeController@store` |

---

## 5. Rute Panel Siswa (/siswa/*)
*Middleware:* `['auth', 'role:siswa']`

| Metode | URI | Nama Rute | Modul | Komponen React / Action |
| :--- | :--- | :--- | :---: | :--- |
| `GET` | `/siswa/dashboard` | `siswa.dashboard` | Modul 11 | `Pages/Siswa/Dashboard.jsx` |
| `GET` | `/siswa/materi` | `siswa.materials.index` | Modul 05 | `Pages/Siswa/Material/Index.jsx` |
| `GET` | `/siswa/tugas` | `siswa.assignments.index` | Modul 07 | `Pages/Siswa/Assignment/Index.jsx` |
| `POST` | `/siswa/tugas/{id}/submit`| `siswa.assignments.submit` | Modul 07 | `Siswa/AssignmentController@submit` |
| `GET` | `/siswa/presensi-saya` | `siswa.attendance.my-history` | Modul 06 | `Pages/Siswa/Attendance/Index.jsx` |
| `GET` | `/siswa/e-raport` | `siswa.raport.view` | Modul 08 | `Pages/Siswa/Raport/Index.jsx` |
| `GET` | `/siswa/e-raport/unduh` | `siswa.raport.download` | Modul 08 | Stream Download PDF Rapor |

---

## 6. Rute Panel Wali Kelas (/wali-kelas/*)
*Middleware:* `['auth', 'role:wali_kelas']`

| Metode | URI | Nama Rute | Modul | Komponen React / Action |
| :--- | :--- | :--- | :---: | :--- |
| `GET` | `/wali-kelas/dashboard` | `walikelas.dashboard` | Modul 11 | `Pages/WaliKelas/Dashboard.jsx` |
| `GET` | `/wali-kelas/presensi-rekap`| `walikelas.attendance.recap` | Modul 06 | `Pages/WaliKelas/Attendance/Recap.jsx`|
| `GET` | `/wali-kelas/e-raport` | `walikelas.raport.index` | Modul 08 | `Pages/WaliKelas/Raport/Index.jsx` |
| `POST` | `/wali-kelas/e-raport/{id}/catatan`| `walikelas.raport.save-notes` | Modul 08 | `WaliKelas/RaportController@notes` |
| `POST` | `/wali-kelas/e-raport/{id}/verifikasi`| `walikelas.raport.verify` | Modul 08 | `WaliKelas/RaportController@verify`|
| `GET` | `/wali-kelas/e-raport/cetak-semua`| `walikelas.raport.print-bulk`| Modul 08 | Download Zip PDF Rapor Rombel |

---

## 7. Rute Panel Bimbingan Konseling (/bk/*)
*Middleware:* `['auth', 'role:bk']`

| Metode | URI | Nama Rute | Modul | Komponen React / Action |
| :--- | :--- | :--- | :---: | :--- |
| `GET` | `/bk/dashboard` | `bk.dashboard` | Modul 11 | `Pages/BK/Dashboard.jsx` |
| `RESOURCE`| `/bk/konseling` | `bk.counseling.*` | Modul 09 | `Pages/BK/Counseling/Index.jsx` |
| `RESOURCE`| `/bk/pelanggaran` | `bk.violations.*` | Modul 09 | `Pages/BK/Violation/Index.jsx` |
| `RESOURCE`| `/bk/prestasi` | `bk.achievements.*` | Modul 09 | `Pages/BK/Achievement/Index.jsx` |
| `GET` | `/bk/surat-panggilan/{id}/cetak`| `bk.letters.print` | Modul 09 | Stream Download PDF Surat Panggilan |

---

## 8. Rute Panel Pimpinan / Kepala Sekolah (/pimpinan/*)
*Middleware:* `['auth', 'role:pimpinan']`

| Metode | URI | Nama Rute | Modul | Komponen React / Action |
| :--- | :--- | :--- | :---: | :--- |
| `GET` | `/pimpinan/dashboard` | `pimpinan.dashboard` | Modul 11 | `Pages/Pimpinan/Dashboard.jsx` |
| `GET` | `/pimpinan/monitoring/presensi`| `pimpinan.monitoring.attendance` | Modul 06 | `Pages/Pimpinan/Attendance/Index.jsx`|
| `GET` | `/pimpinan/e-raport` | `pimpinan.raport.index` | Modul 08 | `Pages/Pimpinan/Raport/Index.jsx` |
| `POST` | `/pimpinan/e-raport/approve-all`| `pimpinan.raport.approve-all` | Modul 08 | `Pimpinan/RaportController@approveAll`|
| `GET` | `/pimpinan/laporan/ekspor` | `pimpinan.reports.export` | Modul 10 | Download Rekap Laporan Eksekutif |

---

## 9. Internal Asynchronous API Endpoints (/api/v1/*)
*Digunakan untuk live search, dynamic dropdown filter, dan quick toggle status.*

```json
// Format Payload Response: GET /api/v1/stats/attendance-today
{
  "status": "success",
  "data": {
    "date": "2026-09-25",
    "total_students": 150,
    "present": 142,
    "permission": 4,
    "sick": 3,
    "absent": 1,
    "attendance_rate": "94.67%"
  }
}
```

| Metode | Endpoint | Keterangan |
| :--- | :--- | :--- |
| `GET` | `/api/v1/stats/attendance-today` | Mengambil data kehadiran hari ini untuk widget dashboard |
| `GET` | `/api/v1/students/search?q={query}`| Pencarian instan siswa berdasarkan NISN atau Nama |
| `POST` | `/api/v1/attendance/quick-toggle`| Pembaruan status presensi siswa langsung via fetch |
| `GET` | `/api/v1/notifications/unread` | Mengambil daftar notifikasi belum dibaca pengguna aktif |
