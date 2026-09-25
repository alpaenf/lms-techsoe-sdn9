# PANDUAN PENGEMBANGAN & STANDAR KODE (DEVELOPMENT RULES)
## Smart School LMS — UPT SDN 9 Gandangbatu Sillanan
**Penyedia Solusi:** TechSoe (Teknologi Inovasi Soedirman)  
**Tech Stack:** Laravel 13, React.js, Inertia.js, MySQL 8.0, Tailwind CSS  
**Versi Dokumen:** 1.1.0  
**Tanggal:** 25 September 2026  

---

## 1. ATURAN MUTLAK: LARANGAN PENGGUNAAN EMOJI (STRICT NO-EMOJI POLICY)

Dilarang keras menggunakan karakter emoji grafis (seperti simbol emotikon, karakter unicode bergambar) di seluruh aspek proyek ini tanpa terkecuali:

1. **Antarmuka Pengguna (UI / Frontend):**
   * Dilarang menggunakan emoji untuk ikon tombol, indikator status, lencana, judul kartu, atau navigasi.
   * Seluruh elemen visual, status, dan ikon wajib menggunakan pustaka SVG resmi (contoh: `lucide-react` atau Heroicons SVG).
2. **Kode Sumber & Komentar Program:**
   * Dilarang menyisipkan emoji di dalam komentar kode (`//`, `/* */`, `{/* */}`).
   * Dilarang menggunakan emoji pada nama variabel, fungsi, konstanta, atau penanda debug.
3. **Pesan Sistem & Validasi:**
   * Pesan flash notification, pesan error form request, dan log aktivitas dilarang memuat karakter emoji. Gunakan teks formal Bahasa Indonesia baku.
4. **Basis Data:**
   * Dilarang menyimpan karakter emoji ke dalam data master, nama institusi, ataupun seeder default sistem.
5. **Pesan Commit Git (Git Commits):**
   * Dilarang menggunakan Gitmoji atau simbol emoji pada commit message. Gunakan format teks standar *Conventional Commits* murni.
6. **Dokumentasi Teknis (.md):**
   * Seluruh berkas markdown di repositori ini dilarang memuat karakter emoji.

---

## 2. Prinsip Utama Rekayasa Perangkat Lunak

1. **Modern Monolith SPA (Laravel 13 + Inertia.js + React.js):**
   * Backend mengendalikan routing, otorisasi, validasi, dan logika bisnis.
   * Inertia.js bertindak sebagai jembatan penghubung tanpa memerlukan pembangunan REST API publik yang terpisah secara redundan.
   * React.js mengendalikan rendering antarmuka pengguna di sisi klien dengan pengalaman Single Page Application (SPA) yang cepat tanpa reload halaman penuh.
2. **Kepatuhan Terhadap Standar PSR & JavaScript/TypeScript:**
   * Wajib mematuhi **PSR-12** untuk penulisan PHP pada Laravel 13.
   * Wajib mematuhi **PSR-4** untuk *Autoloading*.
   * Komponen React wajib modular, terpisah antara *presentational components* dan *page components*.
3. **Keamanan Berlapis (Defense in Depth):**
   * Validasi seluruh input melalui kelas `FormRequest` di Laravel 13.
   * Proteksi CSRF otomatis dikelola oleh Inertia.js & Laravel Session.
   * Otorisasi ganda: di level Middleware, Controller Policy/Gate, dan props pengecekan di React.
4. **Performa Basis Data MySQL 8.0:**
   * Cegah masalah kueri **N+1** dengan selalu menggunakan *Eager Loading* (`with(...)`) pada Eloquent.
   * Wajib menerapkan database indexing pada seluruh *foreign keys*, kolom pencarian (NISN, NIP), dan kolom status.

---

## 3. Struktur Direktori Proyek

```
lms-techsoe-sdn9/
├── app/
│   ├── Actions/                  # Single-action invokable classes (e.g., GenerateErapotAction)
│   ├── Enums/                    # PHP Enums (UserRole, AttendanceStatus, GradeType)
│   ├── Exports/                  # Maatwebsite Excel Export classes (e.g., LegerNilaiExport)
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/            # Modul 01, 02, 03, 10, 11
│   │   │   ├── Guru/             # Modul 05, 06, 07, 08
│   │   │   ├── Siswa/            # Modul 04, 05, 06, 07, 08
│   │   │   ├── WaliKelas/        # Modul 06, 08, 10
│   │   │   ├── BK/               # Modul 09
│   │   │   └── Pimpinan/         # Modul 10, 11
│   │   ├── Middleware/           # HandleInertiaRequests, RoleMiddleware
│   │   └── Requests/             # Form Requests untuk sanitasi & validasi input
│   ├── Models/                   # Eloquent Models lengkap dengan relasi & scopes
│   ├── Policies/                 # Laravel Authorization Policies per entitas
│   └── Services/                 # Complex business services (e.g., RaportCalculatorService)
├── config/                       # Konfigurasi aplikasi Laravel 13
├── database/
│   ├── factories/                # Model Factories untuk data testing
│   ├── migrations/               # Skema tabel MySQL 8.0 terstruktur
│   └── seeders/                  # Seeder master UPT SDN 9 Gandangbatu Sillanan
├── docs/                         # Seluruh dokumentasi teknis & arsitektur proyek
│   ├── README.md
│   ├── prd.md
│   ├── design_system.md
│   ├── rules.md
│   ├── database_schema.md
│   ├── system_architecture.md
│   ├── api_and_routes.md
│   └── deployment_and_setup.md
├── resources/
│   ├── css/
│   │   └── app.css               # Tailwind CSS imports & Design Tokens Burgundy
│   └── js/
│       ├── app.jsx               # Titik masuk utama Inertia + React
│       ├── bootstrap.js          # Konfigurasi Axios & library pendukung
│       ├── Components/           # Komponen UI Reusable (Atoms & Molecules)
│       │   ├── UI/               # Button, Badge, Modal, Card, Table, Alert
│       │   ├── Forms/            # TextInput, SelectInput, DatePicker, FileUpload
│       │   └── Navigation/       # Navbar, Sidebar, Breadcrumb, Pagination
│       ├── Layouts/              # Master Shell Layouts per peran
│       │   ├── AuthenticatedLayout.jsx
│       │   ├── AdminLayout.jsx
│       │   ├── GuruLayout.jsx
│       │   ├── SiswaLayout.jsx
│       │   └── PimpinanLayout.jsx
│       └── Pages/                # Halaman Tampilan Inertia.js
│           ├── Auth/             # Login, ResetPassword
│           ├── Admin/            # Users, Sekolah, MasterData, Siswa, Laporan
│           ├── Guru/             # Kelas, Materi, Presensi, Tugas, LegerNilai
│           ├── Siswa/            # Dashboard, Materi, Tugas, Presensi, Raport
│           ├── WaliKelas/        # Monitoring, VerifikasiRaport, RekapPresensi
│           ├── BK/               # Konseling, Pelanggaran, Prestasi, SuratPanggilan
│           └── Pimpinan/         # DashboardEksekutif, Monitoring, ApproveRaport
├── routes/
│   ├── web.php                   # Routing web Inertia.js terkelompok berdasarkan peran
│   └── auth.php                  # Routing otentikasi login/logout
└── tests/
    ├── Feature/                  # Pengujian fungsional modul end-to-end
    └── Unit/                     # Pengujian unit kalkulator nilai & helper
```

---

## 4. Konvensi Penamaan (Naming Conventions)

| Komponen | Format / Kasus | Contoh Baku | Contoh Salah |
| :--- | :--- | :--- | :--- |
| **Model** | PascalCase (Tunggal) | `StudentAttendance`, `Subject` | `tbl_attendance`, `subjects` |
| **Controller** | PascalCase (Suffix Controller) | `StudentAttendanceController` | `PresensiCtrl`, `attendance` |
| **Migration** | snake_case (Deskriptif Tanggal) | `create_student_attendances_table` | `create_absensi_siswa` |
| **Database Table (MySQL)**| snake_case (Jamak) | `student_attendances`, `classes` | `tb_presensi`, `Siswa` |
| **Database Column** | snake_case | `academic_year_id`, `created_at` | `idTahunAjaran`, `Tgl` |
| **React Page Component** | PascalCase | `Pages/Admin/Student/Index.jsx` | `pages/admin/student_index.jsx` |
| **React UI Component** | PascalCase | `Components/UI/PrimaryButton.jsx`| `components/primary_btn.jsx` |
| **React Layout** | PascalCase | `Layouts/AdminLayout.jsx` | `layouts/admin_layout.jsx` |
| **Route Name** | snake_case / dot.notation | `admin.students.store`, `guru.tugas.index` | `adminAddStudent`, `SimpanTugas` |
| **Route URL** | kebab-case | `/admin/master-data/rombongan-belajar` | `/admin/master_data/rombel` |
| **Service Class** | PascalCase (Suffix Service) | `RaportCalculationService` | `HitungRapor` |
| **Action Class** | PascalCase (Suffix Action) | `PublishExamScoreAction` | `publish_score` |

---

## 5. Standar Backend: Laravel 13

### 5.1 Standar Controller & Inertia Response
* Controller harus tetap ramping (*Thin Controllers*). Controller mengembalikan `Inertia::render(...)` dengan payload props yang terstruktur.
* Wajib menggunakan `FormRequest` untuk validasi seluruh payload masukan dari React.
* Seluruh kueri wajib menggunakan Type-hinting dan Return Type declaration secara eksplisit.

```php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreStudentRequest;
use App\Models\Student;
use App\Models\Classes;
use App\Services\StudentService;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class StudentController extends Controller
{
    public function __construct(
        protected StudentService $studentService
    ) {}

    public function index(): Response
    {
        $students = Student::with(['class', 'user'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Student/Index', [
            'students' => $students,
            'classes' => Classes::select('id', 'name')->get(),
        ]);
    }

    public function store(StoreStudentRequest $request): RedirectResponse
    {
        $this->studentService->registerStudent($request->validated());

        return redirect()
            ->route('admin.students.index')
            ->with('success', 'Data siswa berhasil ditambahkan.');
    }
}
```

### 5.2 Standar Middleware HandleInertiaRequests
* Shared props (seperti data pengguna aktif, flash messages, tahun ajaran aktif) dibagikan secara global melalui middleware `HandleInertiaRequests`.

```php
namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'username' => $request->user()->username,
                    'role' => $request->user()->role,
                    'avatar' => $request->user()->avatar,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'school' => [
                'name' => 'UPT SDN 9 Gandangbatu Sillanan',
                'active_academic_year' => '2026/2027 (Ganjil)',
            ],
        ]);
    }
}
```

---

## 6. Standar Frontend: React.js & Inertia.js

### 6.1 Konvensi Struktur Folder Berbasis Fitur (Resource & Feature Folder Architecture)
Untuk menjaga keteraturan dan kemudahan ekspansi kode jangka panjang, **dilarang menaruh berkas komponen halaman secara lepas (*flat files*) di root `resources/js/Pages/`**. Setiap modul atau fitur wajib memiliki folder tersendiri yang memuat aksi-aksi terstandarisasi:

```
resources/js/Pages/
├── Dashboard/
│   └── Index.jsx             # Tampilan utama dashboard
├── Students/
│   ├── Index.jsx             # Daftar tabel data siswa
│   ├── Create.jsx            # Formulir tambah siswa baru
│   ├── Edit.jsx              # Formulir ubah data siswa
│   └── Show.jsx              # Tampilan detail profil buku induk siswa
├── Attendance/
│   ├── Index.jsx             # Form input presensi harian
│   └── Recap.jsx             # Rekapitulasi absensi bulanan / semester
├── Materials/
│   ├── Index.jsx             # Daftar modul bahan ajar
│   ├── Create.jsx            # Form unggah materi / modul ajar
│   └── Edit.jsx              # Form edit materi
├── Assignments/
│   ├── Index.jsx             # Daftar penugasan & kuis
│   ├── Create.jsx            # Form pembuatan tugas baru
│   └── Grading.jsx           # Panel evaluasi & input nilai tugas siswa
└── Raport/
    ├── Index.jsx             # Leger & verifikasi nilai rapor
    └── Show.jsx              # Pratinjau lembar E-Raport siap cetak
```

* **Pemanggilan pada Controller:**
  ```php
  // Menampilkan dashboard
  return Inertia::render('Dashboard/Index');

  // Menampilkan daftar siswa
  return Inertia::render('Students/Index', ['students' => $students]);

  // Menampilkan form create siswa
  return Inertia::render('Students/Create');
  ```

### 6.2 Standar Komponen React
* Gunakan Functional Components dengan React Hooks.
* Gunakan `useForm` dari `@inertiajs/react` untuk seluruh interaksi form guna menangani state, loading, submit, dan error otomatis.
* Gunakan pustaka ikon `lucide-react` untuk elemen visual. **Dilarang memakai emoji.**

```jsx
import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PlusCircle, Search } from 'lucide-react';

export default function StudentIndex({ auth, students, classes }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nisn: '',
        nis: '',
        full_name: '',
        class_id: '',
        gender: 'L',
        birth_date: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.students.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Manajemen Buku Induk Siswa" />

            <div className="py-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Buku Induk Siswa</h1>
                        <p className="text-sm text-slate-500">Kelola direktori siswa UPT SDN 9 Gandangbatu Sillanan</p>
                    </div>
                    <button className="bg-[#800020] hover:bg-[#5C0017] text-white px-4 py-2 rounded-lg inline-flex items-center text-sm font-medium transition">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Tambah Siswa
                    </button>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3">NISN / NIS</th>
                                <th className="px-4 py-3">Nama Lengkap</th>
                                <th className="px-4 py-3">Kelas</th>
                                <th className="px-4 py-3">Jenis Kelamin</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {students.data.map((student) => (
                                <tr key={student.id} className="hover:bg-[#FDF2F4] transition">
                                    <td className="px-4 py-3 font-medium text-slate-900">{student.nisn}</td>
                                    <td className="px-4 py-3 text-slate-700">{student.full_name}</td>
                                    <td className="px-4 py-3 text-slate-600">{student.class?.name}</td>
                                    <td className="px-4 py-3">{student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button className="text-[#800020] hover:underline font-medium">Detail</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
```

### 6.2 Standar Navigasi & Tautan
* Selalu gunakan `<Link href={route('...')} />` dari `@inertiajs/react` untuk navigasi internal SPA tanpa refresh.
* Gunakan helper `route('nama.rute')` dari paket Ziggy.

---

## 7. Protokol Keamanan Sistem (Security Rules)

1. **Otentikasi & Kata Sandi:**
   * Kata sandi di-hash menggunakan algoritma `bcrypt` (work factor 12) atau `Argon2id`.
   * Pembatasan laju percobaan login (*Rate Limiting*): maksimal 5 kali percobaan gagal per menit per alamat IP.
2. **Otorisasi (RBAC):**
   * Pemeriksaan hak akses dilakukan ketat pada rute backend melalui middleware otorisasi.
   * Siswa hanya dapat mengakses materi, tugas, nilai, dan presensi miliknya sendiri.
3. **Pencegahan Eksploitasi File Upload:**
   * Validasi tipe MIME ketat pada FormRequest (hanya izinkan ekstensi `.pdf`, `.docx`, `.pptx`, `.jpg`, `.png`, `.xlsx`).
   * Setiap file disimpan dengan nama hash UUID unik di direktori `storage/app/` tertutup.
   * Batas ukuran berkas maksimum: **10 MB**.
4. **Log Audit & Pencatatan Aktivitas:**
   * Seluruh perubahan data penting (nilai rapor, mutasi siswa, reset password) wajib dicatat dalam tabel `activity_logs`.

---

## 8. Standar Pengujian & Kualitas Kode (Testing & QA)

* **Unit Testing:** Wajib untuk formula pembobotan E-Raport (Tugas 30%, UTS 30%, UAS 40%) dan kalkulasi persentase kehadiran.
* **Feature Testing:** Wajib untuk pengujian alur kerja end-to-end (Login multi-role, submit tugas oleh siswa, penilaian guru, verifikasi wali kelas, pengesahan kepala sekolah).
* **Perintah Uji:**
```bash
php artisan test
```

---

## 9. Alur Kerja Git & Standar Commit (Git Workflow)

### 9.1 Percabangan (Branching Strategy)
* `main`: Cabang produksi (*live deployment*). Kode wajib stabil dan lulus UAT.
* `develop`: Cabang integrasi pengembangan harian.
* `feature/{modul-name}`: Cabang modul individual (contoh: `feature/modul-06-presensi`).
* `bugfix/{issue-name}`: Cabang perbaikan kutu (contoh: `bugfix/fix-raport-rounding`).

### 9.2 Konvensi Pesan Commit (Conventional Commits Tanpa Emoji)
Format commit wajib menggunakan pola teks baku tanpa simbol emoji:
* `feat: implementasi antarmuka react dan controller untuk presensi guru dan siswa`
* `fix: perbaikan kalkulasi pembobotan nilai akhir di raport service`
* `docs: perbarui spesifikasi teknis laravel 13 dan react inertia pada database schema`
* `style: penyesuaian palet warna burgundy dan layout kartu modul`
* `refactor: optimasi eager loading relasi siswa untuk mereduksi kueri n plus 1`
* `test: penambahan feature test untuk proses pengesahan e-raport oleh kepala sekolah`
