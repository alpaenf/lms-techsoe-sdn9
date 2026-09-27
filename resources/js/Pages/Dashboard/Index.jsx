import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Users, 
    BookOpen, 
    CalendarCheck, 
    FileText, 
    Award, 
    Download, 
    CheckCircle2, 
    Clock, 
    ArrowRight, 
    GraduationCap,
    School,
    Shield,
    Layers,
    PlusCircle,
    UserCheck,
    AlertTriangle,
    Bell,
    Check,
    ChevronRight,
    Printer
} from 'lucide-react';

export default function DashboardIndex({ 
    auth, 
    role = 'siswa', 
    roleLabel = 'Pengguna',
    academicYear = '2026/2027 • Ganjil',
    schoolProfile = null,
    metrics = {},
    announcements = [],
    recent_classes = [],
    assignments = [],
    recent_violations = [],
    recent_sessions = [],
    recent_achievements = [],
    pending_submissions = [],
    attendance = {}
}) {
    const user = auth?.user;
    const schoolName = schoolProfile?.school_name || 'UPT SDN 9 Gandangbatu Sillanan';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold leading-tight text-slate-900">
                            {role === 'admin' && 'Dashboard Utama Administrator'}
                            {role === 'pimpinan' && 'Dashboard Eksekutif Kepala Sekolah'}
                            {role === 'guru' && 'Dashboard Ruang Pengajar & Wali Kelas'}
                            {role === 'bk' && 'Dashboard Layanan Bimbingan & Konseling'}
                            {role === 'siswa' && 'Portal Belajar Mandiri Peserta Didik'}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {schoolName} • Peran: {roleLabel}
                        </p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#FDF2F4] text-[#800020] border border-[#E8B4B8]">
                            <Clock className="w-3.5 h-3.5 mr-1.5" />
                            {academicYear}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            Sistem Aktif
                        </span>
                    </div>
                </div>
            }
        >
            <Head title={`Dashboard ${roleLabel} - Smart School LMS`} />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* HERO WELCOME BANNER */}
                <div className="bg-gradient-to-r from-[#800020] to-[#5C0017] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl space-y-3">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-white/90">
                            <Shield className="w-3.5 h-3.5 mr-1.5" />
                            <span>Portal Terpadu • {roleLabel}</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            Selamat Datang, {user?.name}
                        </h3>
                        <p className="text-sm text-slate-200 leading-relaxed">
                            {role === 'admin' && 'Kelola seluruh konfigurasi data pokok pendidikan, rombongan belajar, dan hak akses pengguna secara tersentralisasi.'}
                            {role === 'pimpinan' && 'Pantau ringkasan keterlaksanaan pembelajaran, tingkat kehadiran satuan pendidikan, dan pengesahan raport resmi.'}
                            {role === 'guru' && 'Akses pencatatan presensi siswa harian, pengelolaan bahan ajar interaktif, penugasan kelas, dan buku penilaian capaian hasil belajar.'}
                            {role === 'bk' && 'Kelola dokumentasi layanan konseling siswa, rekam pelanggaran berpoin tata tertib, dan inventarisasi piagam prestasi.'}
                            {role === 'siswa' && 'Pelajari materi pelajaran, cek tugas sekolah yang perlu dikumpulkan, dan pantau rekam nilai capaian hasil belajarmu.'}
                        </p>
                    </div>

                    {/* Decorative Background Shapes */}
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
                        <GraduationCap className="w-64 h-64 text-white -mr-16" />
                    </div>
                </div>

                {/* 1. ROLE SPECIFIC STATS CARDS */}
                {role === 'admin' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Peserta Didik</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.total_students ?? 150} Siswa</p>
                                <p className="text-[11px] text-emerald-600 font-semibold mt-1">Terdaftar Aktif</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Tenaga Pendidik</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.total_teachers ?? 12} Guru</p>
                                <p className="text-[11px] text-slate-500 mt-1">PNS & PPPK</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Rombongan Belajar</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.total_classes ?? 6} Rombel</p>
                                <p className="text-[11px] text-[#800020] font-semibold mt-1">Kelas 1 - Kelas 6</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-[#FDF2F4] text-[#800020] flex items-center justify-center">
                                <School className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Mata Pelajaran</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.total_subjects ?? 8} Mapel</p>
                                <p className="text-[11px] text-slate-500 mt-1">Kurikulum Merdeka</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                <BookOpen className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                )}

                {role === 'pimpinan' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Rerata Presensi Siswa</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.attendance_percentage ?? '96.8%'}</p>
                                <p className="text-[11px] text-emerald-600 font-semibold mt-1">Tingkat Kehadiran Baik</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <CalendarCheck className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Kehadiran Pendidik</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.teachers_present_today ?? 12} / {metrics.total_teachers ?? 12}</p>
                                <p className="text-[11px] text-blue-600 font-semibold mt-1">Hadir Bertugas</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <UserCheck className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Total Siswa Sekolah</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.total_students ?? 150} Siswa</p>
                                <p className="text-[11px] text-slate-500 mt-1">6 Rombel Aktif</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-[#FDF2F4] text-[#800020] flex items-center justify-center">
                                <School className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Prestasi Siswa</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">5 Piagam</p>
                                <p className="text-[11px] text-amber-600 font-semibold mt-1">Tingkat Kecamatan & Kab</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                <Award className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                )}

                {role === 'guru' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Wali Kelas</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.class_name ?? 'Kelas 6'}</p>
                                <p className="text-[11px] text-emerald-600 font-semibold mt-1">{metrics.homeroom_students ?? 28} Peserta Didik</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <School className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Modul Ajar Saya</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.active_materials ?? 4} Modul</p>
                                <p className="text-[11px] text-blue-600 font-semibold mt-1">Tersedia untuk Siswa</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <BookOpen className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Tugas & Asesmen</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.active_assignments ?? 3} Tugas</p>
                                <p className="text-[11px] text-slate-500 mt-1">Sedang Berlangsung</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                <Layers className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Perlu Dinilai</p>
                                <p className="text-2xl font-bold text-[#800020] mt-1">{metrics.pending_grades ?? 2} Berkas</p>
                                <p className="text-[11px] text-[#800020] font-semibold mt-1">Pengumpulan Terbaru</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-[#FDF2F4] text-[#800020] flex items-center justify-center">
                                <FileText className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                )}

                {role === 'bk' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Sesi Konseling</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.total_sessions ?? 12} Sesi</p>
                                <p className="text-[11px] text-emerald-600 font-semibold mt-1">Individual & Kelompok</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Rekam Pelanggaran</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.active_violations ?? 3} Kasus</p>
                                <p className="text-[11px] text-amber-600 font-semibold mt-1">Akumulasi Poin Disiplin</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Piagam Prestasi</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.total_achievements ?? 5} Siswa</p>
                                <p className="text-[11px] text-blue-600 font-semibold mt-1">Akademik & Non-Akademik</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Award className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Monitoring Siswa</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">150 Siswa</p>
                                <p className="text-[11px] text-slate-500 mt-1">Seluruh Rombel 1-6</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-[#FDF2F4] text-[#800020] flex items-center justify-center">
                                <School className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                )}

                {role === 'siswa' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Rombongan Belajar</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.class_name ?? 'Kelas 6'}</p>
                                <p className="text-[11px] text-emerald-600 font-semibold mt-1">NISN: {metrics.nisn ?? '0081234567'}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-[#FDF2F4] text-[#800020] flex items-center justify-center">
                                <School className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Kehadiran Saya</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{attendance.hadir ?? 18} Hari</p>
                                <p className="text-[11px] text-slate-500 mt-1">Izin: {attendance.izin ?? 1} • Sakit: {attendance.sakit ?? 1}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <CalendarCheck className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Bahan Ajar</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.total_materials ?? 4} Modul</p>
                                <p className="text-[11px] text-blue-600 font-semibold mt-1">Siap Dipelajari</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <BookOpen className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Tugas Aktif</p>
                                <p className="text-2xl font-bold text-[#800020] mt-1">{metrics.active_assignments ?? 2} Tugas</p>
                                <p className="text-[11px] text-[#800020] font-semibold mt-1">Perlu Dikerjakan</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                <Layers className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. ROLE SPECIFIC MAIN SECTIONS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left 2 Columns: Role Specific Modules */}
                    <div className="lg:col-span-2 space-y-6">
                        {role === 'admin' && (
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-base font-bold text-slate-900">
                                        Rombongan Belajar Terdaftar
                                    </h4>
                                    <Link
                                        href={route('master-data.index') + '?tab=rombel'}
                                        className="text-xs font-semibold text-[#800020] hover:underline inline-flex items-center"
                                    >
                                        <span>Kelola Rombel</span>
                                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                    </Link>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {recent_classes && recent_classes.length > 0 ? (
                                        recent_classes.map((cls) => (
                                            <div key={cls.id} className="p-3.5 rounded-xl border border-slate-200 hover:border-[#800020]/40 transition flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-9 h-9 rounded-lg bg-[#FDF2F4] text-[#800020] flex items-center justify-center font-bold text-xs">
                                                        {cls.grade_level}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-900">{cls.name}</p>
                                                        <p className="text-[11px] text-slate-500">Wali: {cls.homeroom_teacher_name || 'Belum Ditugaskan'}</p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                                                    {cls.student_count ?? 0} Siswa
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-2 text-center py-6 text-xs text-slate-500">
                                            Belum ada data rombongan belajar.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {role === 'pimpinan' && (
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-base font-bold text-slate-900">
                                            Supervisi Capaian Rapor & Presensi
                                        </h4>
                                        <Link
                                            href={route('erapor.index') + '?tab=cetak'}
                                            className="text-xs font-semibold text-[#800020] hover:underline inline-flex items-center"
                                        >
                                            <span>Pengesahan Rapor</span>
                                            <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                        </Link>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-900">Pengisian Leger Nilai & Evaluasi Rapor</p>
                                                    <p className="text-[11px] text-slate-500">{metrics.verified_raports ?? 5} Dokumen Rapor Siap Disahkan</p>
                                                </div>
                                            </div>
                                            <Link
                                                href={route('erapor.index') + '?tab=cetak'}
                                                className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
                                            >
                                                Siap Sahkan
                                            </Link>
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                                                    <UserCheck className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-900">Presensi Guru & Pegawai Hari Ini</p>
                                                    <p className="text-[11px] text-slate-500">{metrics.teachers_present_today ?? 0} dari {metrics.total_teachers ?? 0} Guru Hadir</p>
                                                </div>
                                            </div>
                                            <Link
                                                href={route('presensi.index') + '?type=guru'}
                                                className="text-xs font-semibold text-[#800020] hover:underline"
                                            >
                                                Cek Presensi
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {recent_achievements && recent_achievements.length > 0 && (
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-base font-bold text-slate-900 flex items-center">
                                                <Award className="w-4 h-4 mr-2 text-amber-500" />
                                                Galeri Piagam Prestasi Siswa Terakhir
                                            </h4>
                                            <Link
                                                href={route('bk.index') + '?tab=prestasi'}
                                                className="text-xs font-semibold text-[#800020] hover:underline inline-flex items-center"
                                            >
                                                <span>Lihat Semua</span>
                                                <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                            </Link>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {recent_achievements.map((ach) => (
                                                <div key={ach.id} className="p-3.5 rounded-xl border border-slate-200 bg-amber-50/30 flex flex-col justify-between">
                                                    <div>
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                                                            {ach.rank} • {ach.level}
                                                        </span>
                                                        <p className="text-xs font-bold text-slate-900 mt-1.5 line-clamp-1">{ach.title}</p>
                                                        <p className="text-[11px] text-slate-600 mt-0.5">Siswa: {ach.student_name}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {role === 'guru' && (
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-base font-bold text-slate-900">
                                        Tugas Siswa Menunggu Pemeriksaan
                                    </h4>
                                    <Link
                                        href={route('elearning.index') + '?tab=tugas'}
                                        className="text-xs font-semibold text-[#800020] hover:underline inline-flex items-center"
                                    >
                                        <span>Kelola Tugas</span>
                                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                    </Link>
                                </div>
                                <div className="space-y-3">
                                    {pending_submissions && pending_submissions.length > 0 ? (
                                        pending_submissions.map((sub) => (
                                            <div key={sub.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                                                <div>
                                                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold text-[10px] border border-amber-200">
                                                        Belum Dinilai
                                                    </span>
                                                    <p className="text-xs font-bold text-slate-900 mt-1">{sub.assignment_title}</p>
                                                    <p className="text-[11px] text-slate-500">Dikumpulkan oleh: {sub.student_name}</p>
                                                </div>
                                                <Link
                                                    href={route('elearning.index') + '?tab=tugas'}
                                                    className="px-3 py-1.5 rounded-lg bg-[#800020] text-white text-xs font-bold hover:bg-[#5C0017] transition"
                                                >
                                                    Beri Nilai
                                                </Link>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-6 text-center rounded-xl bg-emerald-50/50 border border-emerald-200/60 space-y-2">
                                            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                                            <p className="text-xs font-bold text-emerald-900">Semua Berkas Tugas Telah Dinilai!</p>
                                            <p className="text-[11px] text-emerald-700">Tidak ada pengumpulan tugas siswa yang tertunda saat ini.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {role === 'bk' && (
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-base font-bold text-slate-900">
                                            Catatan Pelanggaran Kedisiplinan Terbaru
                                        </h4>
                                        <Link
                                            href={route('bk.index') + '?tab=pelanggaran'}
                                            className="text-xs font-semibold text-[#800020] hover:underline inline-flex items-center"
                                        >
                                            <span>Buku Pelanggaran</span>
                                            <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                        </Link>
                                    </div>
                                    <div className="space-y-3">
                                        {recent_violations && recent_violations.length > 0 ? (
                                            recent_violations.map((v) => (
                                                <div key={v.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                                                    <div>
                                                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold text-[10px] border border-amber-200">
                                                            Poin: +{v.penalty_points} Poin
                                                        </span>
                                                        <p className="text-xs font-bold text-slate-900 mt-1">{v.violation_name}</p>
                                                        <p className="text-[11px] text-slate-500">Siswa: {v.student_name} ({v.class_name || 'Siswa'}) • {v.violation_date}</p>
                                                    </div>
                                                    <Link
                                                        href={route('bk.index') + '?tab=pelanggaran'}
                                                        className="text-xs font-semibold text-[#800020] hover:underline"
                                                    >
                                                        Detail
                                                    </Link>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-6 text-xs text-slate-500">
                                                Belum ada catatan pelanggaran kedisiplinan.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {recent_sessions && recent_sessions.length > 0 && (
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-base font-bold text-slate-900 flex items-center">
                                                <Users className="w-4 h-4 mr-2 text-emerald-600" />
                                                Sesi Bimbingan & Konseling Terakhir
                                            </h4>
                                            <Link
                                                href={route('bk.index') + '?tab=konseling'}
                                                className="text-xs font-semibold text-[#800020] hover:underline inline-flex items-center"
                                            >
                                                <span>Kelola Konseling</span>
                                                <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                            </Link>
                                        </div>
                                        <div className="space-y-3">
                                            {recent_sessions.map((s) => (
                                                <div key={s.id} className="p-3.5 rounded-xl border border-slate-200 bg-emerald-50/30 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-900">{s.topic}</p>
                                                        <p className="text-[11px] text-slate-600">Siswa: {s.student_name} ({s.class_name || 'Siswa'}) • Tanggal: {s.session_date}</p>
                                                    </div>
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                                        Terlaksana
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {role === 'siswa' && (
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-base font-bold text-slate-900">
                                        Tugas & Ujian Yang Perlu Diselesaikan
                                    </h4>
                                    <Link
                                        href={route('elearning.index') + '?tab=tugas'}
                                        className="text-xs font-semibold text-[#800020] hover:underline inline-flex items-center"
                                    >
                                        <span>Lihat Semua Tugas</span>
                                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                    </Link>
                                </div>
                                <div className="space-y-3">
                                    {assignments && assignments.length > 0 ? (
                                        assignments.map((asg, index) => (
                                            <div key={asg.id} className={`p-4 rounded-xl border flex items-center justify-between ${index === 0 ? 'bg-[#FDF2F4]/40 border-[#E8B4B8]/60' : 'bg-slate-50 border-slate-200'}`}>
                                                <div className="space-y-1">
                                                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[10px] border border-blue-200">
                                                        {asg.subject_name || 'Mata Pelajaran'}
                                                    </span>
                                                    <p className="text-xs font-bold text-slate-900">{asg.title}</p>
                                                    <p className="text-[11px] text-slate-500 flex items-center">
                                                        <Clock className="w-3.5 h-3.5 mr-1 text-[#800020]" />
                                                        Batas Waktu: {asg.due_date || 'Segera'}
                                                    </p>
                                                </div>
                                                <Link
                                                    href={route('elearning.index') + '?tab=tugas'}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${index === 0 ? 'bg-[#800020] text-white hover:bg-[#5C0017]' : 'bg-slate-800 text-white hover:bg-slate-900'}`}
                                                >
                                                    Kumpul Tugas
                                                </Link>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-6 text-center rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                                            Tidak ada tugas aktif yang perlu dikumpulkan saat ini.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right 1 Column: Announcements & Fast Actions */}
                    <div className="space-y-6">
                        {/* Quick Action Box tailored per role */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                Aksi Cepat
                            </h4>
                            <div className="space-y-2">
                                {role === 'admin' && (
                                    <>
                                        <Link
                                            href={route('master-data.index') + '?tab=rombel'}
                                            className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-[#FDF2F4] hover:text-[#800020] transition text-xs font-semibold text-slate-700"
                                        >
                                            <span className="flex items-center">
                                                <PlusCircle className="w-4 h-4 mr-2 text-[#800020]" />
                                                Tambah Rombel Baru
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-slate-400" />
                                        </Link>
                                        <Link
                                            href={route('master-data.index') + '?tab=guru'}
                                            className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-[#FDF2F4] hover:text-[#800020] transition text-xs font-semibold text-slate-700"
                                        >
                                            <span className="flex items-center">
                                                <Users className="w-4 h-4 mr-2 text-[#800020]" />
                                                Registrasi Guru Baru
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-slate-400" />
                                        </Link>
                                        <Link
                                            href={route('kelembagaan.index') + '?tab=akademik'}
                                            className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-[#FDF2F4] hover:text-[#800020] transition text-xs font-semibold text-slate-700"
                                        >
                                            <span className="flex items-center">
                                                <Clock className="w-4 h-4 mr-2 text-[#800020]" />
                                                Atur Tahun Akademik
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-slate-400" />
                                        </Link>
                                    </>
                                )}

                                {role === 'pimpinan' && (
                                    <>
                                        <Link
                                            href={route('presensi.index') + '?type=guru'}
                                            className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-[#FDF2F4] hover:text-[#800020] transition text-xs font-semibold text-slate-700"
                                        >
                                            <span className="flex items-center">
                                                <UserCheck className="w-4 h-4 mr-2 text-[#800020]" />
                                                Cek Presensi Guru Hari Ini
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-slate-400" />
                                        </Link>
                                        <Link
                                            href={route('erapor.index') + '?tab=cetak'}
                                            className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-[#FDF2F4] hover:text-[#800020] transition text-xs font-semibold text-slate-700"
                                        >
                                            <span className="flex items-center">
                                                <Printer className="w-4 h-4 mr-2 text-[#800020]" />
                                                Pengesahan Lembar Rapor
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-slate-400" />
                                        </Link>
                                        <Link
                                            href={route('elearning.index') + '?tab=materi'}
                                            className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-[#FDF2F4] hover:text-[#800020] transition text-xs font-semibold text-slate-700"
                                        >
                                            <span className="flex items-center">
                                                <BookOpen className="w-4 h-4 mr-2 text-[#800020]" />
                                                Supervisi Modul Pembelajaran
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-slate-400" />
                                        </Link>
                                    </>
                                )}

                                {role === 'guru' && (
                                    <>
                                        <Link
                                            href={route('presensi.index') + '?type=siswa'}
                                            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#800020] text-white hover:bg-[#5C0017] transition text-xs font-bold shadow-sm"
                                        >
                                            <span className="flex items-center">
                                                <CalendarCheck className="w-4 h-4 mr-2" />
                                                Input Presensi Hari Ini
                                            </span>
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={route('elearning.index') + '?tab=materi'}
                                            className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-[#FDF2F4] hover:text-[#800020] transition text-xs font-semibold text-slate-700"
                                        >
                                            <span className="flex items-center">
                                                <PlusCircle className="w-4 h-4 mr-2 text-[#800020]" />
                                                Unggah Bahan Ajar Baru
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-slate-400" />
                                        </Link>
                                        <Link
                                            href={route('erapor.index') + '?tab=leger'}
                                            className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-[#FDF2F4] hover:text-[#800020] transition text-xs font-semibold text-slate-700"
                                        >
                                            <span className="flex items-center">
                                                <FileText className="w-4 h-4 mr-2 text-[#800020]" />
                                                Pengisian Nilai Leger Rapor
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-slate-400" />
                                        </Link>
                                    </>
                                )}

                                {role === 'bk' && (
                                    <>
                                        <Link
                                            href={route('bk.index') + '?tab=konseling'}
                                            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#800020] text-white hover:bg-[#5C0017] transition text-xs font-bold shadow-sm"
                                        >
                                            <span className="flex items-center">
                                                <PlusCircle className="w-4 h-4 mr-2" />
                                                Catat Sesi Bimbingan
                                            </span>
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={route('bk.index') + '?tab=pelanggaran'}
                                            className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-[#FDF2F4] hover:text-[#800020] transition text-xs font-semibold text-slate-700"
                                        >
                                            <span className="flex items-center">
                                                <AlertTriangle className="w-4 h-4 mr-2 text-[#800020]" />
                                                Pencatatan Poin Pelanggaran
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-slate-400" />
                                        </Link>
                                        <Link
                                            href={route('bk.index') + '?tab=prestasi'}
                                            className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-[#FDF2F4] hover:text-[#800020] transition text-xs font-semibold text-slate-700"
                                        >
                                            <span className="flex items-center">
                                                <Award className="w-4 h-4 mr-2 text-[#800020]" />
                                                Inventarisasi Prestasi
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-slate-400" />
                                        </Link>
                                    </>
                                )}

                                {role === 'siswa' && (
                                    <>
                                        <Link
                                            href={route('elearning.index') + '?tab=materi'}
                                            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#800020] text-white hover:bg-[#5C0017] transition text-xs font-bold shadow-sm"
                                        >
                                            <span className="flex items-center">
                                                <BookOpen className="w-4 h-4 mr-2" />
                                                Buka Materi Pelajaran
                                            </span>
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={route('presensi.index') + '?type=siswa'}
                                            className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-[#FDF2F4] hover:text-[#800020] transition text-xs font-semibold text-slate-700"
                                        >
                                            <span className="flex items-center">
                                                <CalendarCheck className="w-4 h-4 mr-2 text-[#800020]" />
                                                Cek Catatan Kehadiran
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-slate-400" />
                                        </Link>
                                        <Link
                                            href={route('erapor.index') + '?tab=cetak'}
                                            className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-[#FDF2F4] hover:text-[#800020] transition text-xs font-semibold text-slate-700"
                                        >
                                            <span className="flex items-center">
                                                <FileText className="w-4 h-4 mr-2 text-[#800020]" />
                                                Lembar Rapor Saya
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-slate-400" />
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Announcements Box */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
                                    <Bell className="w-3.5 h-3.5 mr-1.5 text-[#800020]" />
                                    Pengumuman Sekolah
                                </h4>
                            </div>
                            <div className="space-y-2.5">
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                                    <span className="text-[10px] font-semibold text-[#800020] uppercase tracking-wider">
                                        Akademik
                                    </span>
                                    <p className="text-xs font-bold text-slate-900">Jadwal Asesmen Tengah Semester (ATS)</p>
                                    <p className="text-[11px] text-slate-500">
                                        Pelaksanaan ATS semester ganjil akan dimulai pada tanggal 05 Oktober 2026.
                                    </p>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                                    <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">
                                        Kegiatan
                                    </span>
                                    <p className="text-xs font-bold text-slate-900">Jumat Bersih & Senam Sehat</p>
                                    <p className="text-[11px] text-slate-500">
                                        Seluruh warga sekolah diwajibkan mengenakan pakaian olahraga mulai pukul 07.15 WITA.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
