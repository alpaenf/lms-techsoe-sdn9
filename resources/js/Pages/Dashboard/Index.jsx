import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Users, 
    BookOpen, 
    CalendarCheck, 
    FileText, 
    Award, 
    CheckCircle2, 
    Clock, 
    ArrowRight, 
    GraduationCap,
    School,
    Plus,
    UserPlus,
    Settings,
    MoreHorizontal,
    Layers, 
    AlertTriangle, 
    Calendar,
    Bell,
    ChevronRight
} from 'lucide-react';

export default function DashboardIndex({ 
    auth, 
    role = 'admin', 
    roleLabel = 'Administrator Sistem',
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

    // Format current date display
    const currentDateStr = "Sabtu, 27 September 2026";

    return (
        <AuthenticatedLayout>
            <Head title={`Dashboard ${roleLabel} - Smart School LMS`} />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* 1. COMPACT DASHBOARD HEADER */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-slate-200/80 pb-5">
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2.5">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                Dashboard
                            </h1>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-[#800020] border border-rose-200/60">
                                {roleLabel}
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                            Ringkasan data dan informasi utama sistem sekolah dalam satu tampilan terpadu.
                        </p>
                    </div>

                    {/* Right Date & Greeting Context */}
                    <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 text-right shadow-2xs shrink-0 self-start md:self-auto flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#800020] flex items-center justify-center shrink-0 border border-rose-100">
                            <Calendar className="w-4 h-4 text-[#800020]" />
                        </div>
                        <div className="text-left md:text-right">
                            <p className="text-xs font-bold text-slate-900 leading-tight">
                                {currentDateStr}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                Selamat bekerja, <span className="font-semibold text-slate-800">{user?.name?.split(' ')[0] || 'Administrator'}</span>.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. CORE METRICS GRID */}
                {role === 'admin' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        {/* Metric 1: Peserta Didik */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-slate-400">
                                    Peserta Didik
                                </p>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                                    {metrics.total_students ?? 5} Siswa
                                </h3>
                                <p className="text-xs font-bold text-emerald-600">
                                    Terdaftar Aktif
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-blue-50/90 text-blue-600 border border-blue-100/60 flex items-center justify-center shrink-0">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>

                        {/* Metric 2: Tenaga Pendidik */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-slate-400">
                                    Tenaga Pendidik
                                </p>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                                    {metrics.total_teachers ?? 2} Guru
                                </h3>
                                <p className="text-xs font-medium text-slate-400">
                                    PNS & PPPK
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50/90 text-emerald-600 border border-emerald-100/60 flex items-center justify-center shrink-0">
                                <GraduationCap className="w-5 h-5 text-emerald-600" />
                            </div>
                        </div>

                        {/* Metric 3: Rombongan Belajar */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-slate-400">
                                    Rombongan Belajar
                                </p>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                                    {metrics.total_classes ?? 6} Rombel
                                </h3>
                                <p className="text-xs font-bold text-[#800020]">
                                    Kelas 1 - Kelas 6
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-rose-50/90 text-[#800020] border border-rose-100/60 flex items-center justify-center shrink-0">
                                <School className="w-5 h-5 text-[#800020]" />
                            </div>
                        </div>

                        {/* Metric 4: Mata Pelajaran */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-slate-400">
                                    Mata Pelajaran
                                </p>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                                    {metrics.total_subjects ?? 8} Mapel
                                </h3>
                                <p className="text-xs font-medium text-slate-400">
                                    Kurikulum Merdeka
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-amber-50/90 text-amber-600 border border-amber-100/60 flex items-center justify-center shrink-0">
                                <BookOpen className="w-5 h-5 text-amber-600" />
                            </div>
                        </div>
                    </div>
                )}

                {role === 'pimpinan' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-slate-400">Rerata Presensi Siswa</p>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                                    {metrics.attendance_percentage ?? '72.0%'}
                                </h3>
                                <p className="text-xs font-bold text-emerald-600">Tingkat Kehadiran Baik</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50/90 text-emerald-600 border border-emerald-100/60 flex items-center justify-center shrink-0">
                                <CalendarCheck className="w-5 h-5 text-emerald-600" />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-slate-400">Kehadiran Pendidik</p>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                                    {metrics.teachers_present_today ?? 2} / {metrics.total_teachers ?? 2}
                                </h3>
                                <p className="text-xs font-medium text-slate-400">Hadir Bertugas Hari Ini</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-blue-50/90 text-blue-600 border border-blue-100/60 flex items-center justify-center shrink-0">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-slate-400">Total Siswa</p>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                                    {metrics.total_students ?? 5} Siswa
                                </h3>
                                <p className="text-xs font-bold text-[#800020]">6 Rombel Aktif</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-rose-50/90 text-[#800020] border border-rose-100/60 flex items-center justify-center shrink-0">
                                <School className="w-5 h-5 text-[#800020]" />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-slate-400">Prestasi Siswa</p>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                                    {metrics.achievements_count ?? 5} Piagam
                                </h3>
                                <p className="text-xs font-bold text-amber-600">Tingkat Kec & Kab</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-amber-50/90 text-amber-600 border border-amber-100/60 flex items-center justify-center shrink-0">
                                <Award className="w-5 h-5 text-amber-600" />
                            </div>
                        </div>
                    </div>
                )}

                {role === 'guru' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-slate-400">Wali Kelas</p>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                                    {metrics.class_name ?? 'Kelas 6'}
                                </h3>
                                <p className="text-xs font-bold text-emerald-600">{metrics.homeroom_students ?? 5} Peserta Didik</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50/90 text-emerald-600 border border-emerald-100/60 flex items-center justify-center shrink-0">
                                <School className="w-5 h-5 text-emerald-600" />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-slate-400">Modul Ajar Saya</p>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                                    {metrics.active_materials ?? 1} Modul
                                </h3>
                                <p className="text-xs font-medium text-slate-400">Tersedia untuk Siswa</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-blue-50/90 text-blue-600 border border-blue-100/60 flex items-center justify-center shrink-0">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-slate-400">Tugas & Asesmen</p>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                                    {metrics.active_assignments ?? 1} Tugas
                                </h3>
                                <p className="text-xs font-bold text-amber-600">Sedang Berlangsung</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-amber-50/90 text-amber-600 border border-amber-100/60 flex items-center justify-center shrink-0">
                                <Layers className="w-5 h-5 text-amber-600" />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-slate-400">Perlu Dinilai</p>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                                    {metrics.pending_grades ?? 0} Berkas
                                </h3>
                                <p className="text-xs font-bold text-[#800020]">Semua tugas dinilai</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-rose-50/90 text-[#800020] border border-rose-100/60 flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5 text-[#800020]" />
                            </div>
                        </div>
                    </div>
                )}

                {role === 'bk' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-slate-400">Sesi Konseling</p>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                                    {metrics.total_sessions ?? 2} Sesi
                                </h3>
                                <p className="text-xs font-bold text-emerald-600">Individual & Kelompok</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50/90 text-emerald-600 border border-emerald-100/60 flex items-center justify-center shrink-0">
                                <Users className="w-5 h-5 text-emerald-600" />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-slate-400">Rekam Pelanggaran</p>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                                    {metrics.active_violations ?? 1} Kasus
                                </h3>
                                <p className="text-xs font-bold text-amber-600">Terlibat Poin Tata Tertib</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-amber-50/90 text-amber-600 border border-amber-100/60 flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-5 h-5 text-amber-600" />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-slate-400">Piagam Prestasi</p>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                                    {metrics.total_achievements ?? 2} Siswa
                                </h3>
                                <p className="text-xs font-medium text-slate-400">Akademik & Non-Akademik</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-blue-50/90 text-blue-600 border border-blue-100/60 flex items-center justify-center shrink-0">
                                <Award className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-slate-400">Monitoring Siswa</p>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                                    {metrics.monitored_students ?? 5} Siswa
                                </h3>
                                <p className="text-xs font-bold text-[#800020]">Seluruh Rombel 1-6</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-rose-50/90 text-[#800020] border border-rose-100/60 flex items-center justify-center shrink-0">
                                <School className="w-5 h-5 text-[#800020]" />
                            </div>
                        </div>
                    </div>
                )}

                {role === 'siswa' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-slate-400">Rombongan Belajar</p>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                                    {metrics.class_name ?? 'Kelas 6'}
                                </h3>
                                <p className="text-xs font-bold text-[#800020]">NISN: {metrics.nisn ?? '0081234567'}</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-rose-50/90 text-[#800020] border border-rose-100/60 flex items-center justify-center shrink-0">
                                <School className="w-5 h-5 text-[#800020]" />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-slate-400">Kehadiran Saya</p>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                                    {attendance.hadir ?? 8} Hari
                                </h3>
                                <p className="text-xs font-bold text-emerald-600">Izin: {attendance.izin ?? 1} • Sakit: {attendance.sakit ?? 1}</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50/90 text-emerald-600 border border-emerald-100/60 flex items-center justify-center shrink-0">
                                <CalendarCheck className="w-5 h-5 text-emerald-600" />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-slate-400">Bahan Ajar</p>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                                    {metrics.total_materials ?? 1} Modul
                                </h3>
                                <p className="text-xs font-medium text-slate-400">Siap Dipelajari</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-blue-50/90 text-blue-600 border border-blue-100/60 flex items-center justify-center shrink-0">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-slate-400">Tugas Aktif</p>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                                    {metrics.active_assignments ?? 1} Tugas
                                </h3>
                                <p className="text-xs font-bold text-amber-600">Perlu Dikerjakan</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-amber-50/90 text-amber-600 border border-amber-100/60 flex items-center justify-center shrink-0">
                                <Layers className="w-5 h-5 text-amber-600" />
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. MAIN OPERATIONAL GRID (2 EQUAL-HEIGHT COLUMNS ON DESKTOP) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                    {/* Left Column (Wide, 2 Columns Span) */}
                    <div className="lg:col-span-2 flex flex-col justify-between">
                        {role === 'admin' && (
                            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
                                        <div>
                                            <h2 className="text-base font-bold text-slate-900 tracking-tight">
                                                Rombongan Belajar Terdaftar
                                            </h2>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                                                Daftar rombongan belajar di {schoolName}.
                                            </p>
                                        </div>
                                        <Link
                                            href={route('master-data.index') + '?tab=rombel'}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-[#800020] hover:bg-[#800020] hover:text-white transition-all text-xs font-bold border border-rose-100 shadow-2xs shrink-0 self-start sm:self-auto"
                                        >
                                            <span>Kelola Rombongan Belajar</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>

                                    {/* Structured Operational Table */}
                                    <div className="overflow-hidden border border-slate-200/80 rounded-xl bg-white">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                                        <th className="py-3 px-4 w-12 text-center">No.</th>
                                                        <th className="py-3 px-4">Kelas</th>
                                                        <th className="py-3 px-4">Wali Kelas</th>
                                                        <th className="py-3 px-4 text-center">Jumlah Siswa</th>
                                                        <th className="py-3 px-4">Status</th>
                                                        <th className="py-3 px-4 text-center w-16">Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                                                    {[1, 2, 3, 4, 5, 6].map((gradeLevel) => {
                                                        const classObj = recent_classes.find(c => c.grade_level === gradeLevel) || {
                                                            id: gradeLevel,
                                                            name: `Kelas ${gradeLevel}`,
                                                            grade_level: gradeLevel,
                                                            homeroom_teacher_name: gradeLevel === 6 ? 'Budi Santoso, S.Pd.' : null,
                                                            student_count: gradeLevel === 6 ? 5 : 0
                                                        };

                                                        const isComplete = (classObj.student_count > 0 && classObj.homeroom_teacher_name);

                                                        return (
                                                            <tr key={gradeLevel} className="hover:bg-slate-50/60 transition-colors">
                                                                <td className="py-3.5 px-4 font-semibold text-slate-400 text-center">{gradeLevel}</td>
                                                                <td className="py-3.5 px-4 font-bold text-slate-900">{classObj.name}</td>
                                                                <td className="py-3.5 px-4 text-slate-600">
                                                                    {classObj.homeroom_teacher_name ? (
                                                                        <span className="font-semibold text-slate-800">{classObj.homeroom_teacher_name}</span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center gap-1 text-slate-400 italic bg-slate-100/60 px-2 py-0.5 rounded text-[11px]">
                                                                            Belum Ditugaskan
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                                                                    <span className="inline-block bg-slate-100 px-2.5 py-0.5 rounded-md text-xs font-bold text-slate-800">
                                                                        {classObj.student_count ?? 0}
                                                                    </span>
                                                                </td>
                                                                <td className="py-3.5 px-4">
                                                                    {isComplete ? (
                                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 gap-1.5">
                                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                                            Lengkap
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200/80 gap-1.5">
                                                                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                                                            Belum lengkap
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="py-3.5 px-4 text-center">
                                                                    <Link
                                                                        href={route('master-data.index') + '?tab=rombel'}
                                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#800020] hover:bg-rose-50 transition inline-block"
                                                                        title="Detail Rombel"
                                                                    >
                                                                        <MoreHorizontal className="w-4 h-4" />
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {role === 'pimpinan' && (
                            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                                        <div>
                                            <h2 className="text-base font-bold text-slate-900 tracking-tight">Supervisi Capaian Rapor & Presensi</h2>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5">Monitoring validasi leger nilai & kehadiran tenaga pendidik.</p>
                                        </div>
                                        <Link href={route('erapor.index') + '?tab=cetak'} className="text-xs font-bold text-[#800020] hover:underline inline-flex items-center space-x-1">
                                            <span>Pengesahan Rapor</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-900">Pengisian Leger Nilai & Evaluasi Rapor Kelas 6</p>
                                                    <p className="text-[11px] text-slate-500">Wali Kelas: Budi Santoso, S.Pd. • 5 Dokumen Rapor Lengkap</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                Siap Sahkan
                                            </span>
                                        </div>

                                        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                                                    <Users className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-900">Presensi Guru & Pegawai Hari Ini</p>
                                                    <p className="text-[11px] text-slate-500">2 dari 2 Guru Hadir Tepat Waktu</p>
                                                </div>
                                            </div>
                                            <Link href={route('presensi.index') + '?type=guru'} className="text-xs font-bold text-[#800020] hover:underline">
                                                Cek Presensi
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {role === 'guru' && (
                            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                                        <div>
                                            <h2 className="text-base font-bold text-slate-900 tracking-tight">Tugas Siswa Menunggu Pemeriksaan</h2>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5">Daftar pengumpulan tugas yang perlu diberi nilai.</p>
                                        </div>
                                        <Link href={route('elearning.index') + '?tab=tugas'} className="text-xs font-bold text-[#800020] hover:underline inline-flex items-center space-x-1">
                                            <span>Kelola Tugas</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>

                                    {pending_submissions && pending_submissions.length > 0 ? (
                                        <div className="space-y-2.5">
                                            {pending_submissions.map(sub => (
                                                <div key={sub.id} className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-center justify-between">
                                                    <div>
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                                                            Belum Dinilai
                                                        </span>
                                                        <p className="text-xs font-bold text-slate-900 mt-1">{sub.assignment_title}</p>
                                                        <p className="text-[11px] text-slate-500">Dikumpulkan oleh: {sub.student_name}</p>
                                                    </div>
                                                    <Link href={route('elearning.index') + '?tab=tugas'} className="px-3.5 py-1.5 rounded-lg bg-[#800020] text-white text-xs font-bold hover:bg-[#5C0017] transition shadow-2xs">
                                                        Beri Nilai
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-6 text-center rounded-xl bg-emerald-50/40 border border-emerald-200/60 space-y-1.5">
                                            <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto" />
                                            <p className="text-xs font-bold text-emerald-900">Semua Berkas Tugas Telah Dinilai!</p>
                                            <p className="text-[11px] text-emerald-700 font-medium">Tidak ada pengumpulan tugas siswa yang tertunda saat ini.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {role === 'bk' && (
                            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                                        <div>
                                            <h2 className="text-base font-bold text-slate-900 tracking-tight">Catatan Pelanggaran Kedisiplinan Terbaru</h2>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5">Buku poin rekam kedisiplinan dan tata tertib siswa.</p>
                                        </div>
                                        <Link href={route('bk.index') + '?tab=pelanggaran'} className="text-xs font-bold text-[#800020] hover:underline inline-flex items-center space-x-1">
                                            <span>Buku Pelanggaran</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>

                                    <div className="space-y-2.5">
                                        {recent_violations && recent_violations.length > 0 ? (
                                            recent_violations.map(v => (
                                                <div key={v.id} className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-center justify-between">
                                                    <div>
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                                                            +{v.penalty_points} Poin
                                                        </span>
                                                        <p className="text-xs font-bold text-slate-900 mt-1">{v.violation_name}</p>
                                                        <p className="text-[11px] text-slate-500">Siswa: {v.student_name} ({v.class_name || 'Kelas 6'}) • {v.violation_date}</p>
                                                    </div>
                                                    <Link href={route('bk.index') + '?tab=pelanggaran'} className="text-xs font-bold text-[#800020] hover:underline">
                                                        Detail
                                                    </Link>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-6 text-xs text-slate-500 font-medium">
                                                Belum ada catatan pelanggaran kedisiplinan.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {role === 'siswa' && (
                            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                                        <div>
                                            <h2 className="text-base font-bold text-slate-900 tracking-tight">Tugas & Ujian Yang Perlu Diselesaikan</h2>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5">Daftar penugasan mandiri siswa yang aktif.</p>
                                        </div>
                                        <Link href={route('elearning.index') + '?tab=tugas'} className="text-xs font-bold text-[#800020] hover:underline inline-flex items-center space-x-1">
                                            <span>Lihat Semua Tugas</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>

                                    <div className="space-y-3">
                                        {assignments && assignments.length > 0 ? (
                                            assignments.map((asg, idx) => (
                                                <div key={asg.id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-center justify-between">
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                                                            {asg.subject_name || 'IPA'}
                                                        </span>
                                                        <p className="text-xs font-bold text-slate-900">{asg.title}</p>
                                                        <p className="text-[11px] text-slate-500 flex items-center">
                                                            <Clock className="w-3.5 h-3.5 mr-1 text-[#800020]" />
                                                            Batas Waktu: {asg.due_date || 'Segera'}
                                                        </p>
                                                    </div>
                                                    <Link href={route('elearning.index') + '?tab=tugas'} className="px-3.5 py-1.5 rounded-lg bg-[#800020] text-white text-xs font-bold hover:bg-[#5C0017] transition shadow-2xs">
                                                        Kumpul Tugas
                                                    </Link>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-6 text-center rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 font-medium">
                                                Tidak ada tugas aktif yang perlu dikumpulkan saat ini.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column (Narrow 1 Column): Quick Actions & System Info */}
                    <div className="flex flex-col justify-between space-y-6 lg:space-y-0 lg:gap-6">
                        {/* 1. AKSI CEPAT CARD */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
                            <div>
                                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Aksi Cepat
                                </h2>
                                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                    Fitur yang sering digunakan pada sistem.
                                </p>
                            </div>

                            <div className="space-y-2.5 pt-1">
                                {role === 'admin' && (
                                    <>
                                        <Link
                                            href={route('master-data.index') + '?tab=rombel'}
                                            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 hover:border-[#800020]/30 hover:bg-rose-50/30 transition-all duration-200 group"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#800020] border border-rose-100/80 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-[#800020] group-hover:text-white transition-colors duration-200">
                                                    <Plus className="w-4 h-4" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs font-bold text-slate-900 group-hover:text-[#800020] transition-colors">
                                                        Tambah Rombel Baru
                                                    </p>
                                                    <p className="text-[10px] text-slate-500 font-normal">
                                                        Mendaftarkan rombongan belajar baru
                                                    </p>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#800020] group-hover:translate-x-0.5 transition-all shrink-0" />
                                        </Link>

                                        <Link
                                            href={route('master-data.index') + '?tab=guru'}
                                            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 hover:border-[#800020]/30 hover:bg-rose-50/30 transition-all duration-200 group"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#800020] border border-rose-100/80 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-[#800020] group-hover:text-white transition-colors duration-200">
                                                    <UserPlus className="w-4 h-4" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs font-bold text-slate-900 group-hover:text-[#800020] transition-colors">
                                                        Registrasi Guru Baru
                                                    </p>
                                                    <p className="text-[10px] text-slate-500 font-normal">
                                                        Menambahkan tenaga pendidik
                                                    </p>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#800020] group-hover:translate-x-0.5 transition-all shrink-0" />
                                        </Link>

                                        <Link
                                            href={route('kelembagaan.index') + '?tab=akademik'}
                                            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 hover:border-[#800020]/30 hover:bg-rose-50/30 transition-all duration-200 group"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#800020] border border-rose-100/80 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-[#800020] group-hover:text-white transition-colors duration-200">
                                                    <Settings className="w-4 h-4" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs font-bold text-slate-900 group-hover:text-[#800020] transition-colors">
                                                        Atur Tahun Akademik
                                                    </p>
                                                    <p className="text-[10px] text-slate-500 font-normal">
                                                        Mengubah periode tahun ajaran aktif
                                                    </p>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#800020] group-hover:translate-x-0.5 transition-all shrink-0" />
                                        </Link>
                                    </>
                                )}

                                {role === 'pimpinan' && (
                                    <>
                                        <Link href={route('presensi.index') + '?type=guru'} className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-800">
                                            <span>Cek Presensi Guru Hari Ini</span>
                                            <ArrowRight className="w-4 h-4 text-slate-400" />
                                        </Link>
                                        <Link href={route('erapor.index') + '?tab=cetak'} className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-800">
                                            <span>Pengesahan Lembar Rapor</span>
                                            <ArrowRight className="w-4 h-4 text-slate-400" />
                                        </Link>
                                    </>
                                )}

                                {role === 'guru' && (
                                    <>
                                        <Link href={route('presensi.index') + '?type=siswa'} className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#5C0017] transition shadow-2xs">
                                            <span>Input Presensi Hari Ini</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                        <Link href={route('elearning.index') + '?tab=materi'} className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-800">
                                            <span>Unggah Bahan Ajar Baru</span>
                                            <ArrowRight className="w-4 h-4 text-slate-400" />
                                        </Link>
                                    </>
                                )}

                                {role === 'bk' && (
                                    <>
                                        <Link href={route('bk.index') + '?tab=konseling'} className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#5C0017] transition shadow-2xs">
                                            <span>Catat Sesi Bimbingan</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                        <Link href={route('bk.index') + '?tab=pelanggaran'} className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-800">
                                            <span>Pencatatan Poin Pelanggaran</span>
                                            <ArrowRight className="w-4 h-4 text-slate-400" />
                                        </Link>
                                    </>
                                )}

                                {role === 'siswa' && (
                                    <>
                                        <Link href={route('elearning.index') + '?tab=materi'} className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#5C0017] transition shadow-2xs">
                                            <span>Buka Materi Pelajaran</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                        <Link href={route('erapor.index') + '?tab=cetak'} className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-800">
                                            <span>Lembar Rapor Saya</span>
                                            <ArrowRight className="w-4 h-4 text-slate-400" />
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* 2. INFORMASI SISTEM CARD */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                                    Informasi Sistem
                                </h2>

                                <div className="divide-y divide-slate-100 text-xs font-medium">
                                    <div className="flex items-center justify-between py-2.5">
                                        <span className="text-slate-500 flex items-center">
                                            <Calendar className="w-4 h-4 mr-2.5 text-slate-400 shrink-0" />
                                            Tahun Akademik
                                        </span>
                                        <span className="font-bold text-slate-900">2026/2027</span>
                                    </div>

                                    <div className="flex items-center justify-between py-2.5">
                                        <span className="text-slate-500 flex items-center">
                                            <Layers className="w-4 h-4 mr-2.5 text-slate-400 shrink-0" />
                                            Semester
                                        </span>
                                        <span className="font-bold text-slate-900">Ganjil</span>
                                    </div>

                                    <div className="flex items-center justify-between py-2.5">
                                        <span className="text-slate-500 flex items-center">
                                            <CheckCircle2 className="w-4 h-4 mr-2.5 text-emerald-500 shrink-0" />
                                            Status Data
                                        </span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            Normal
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between py-2.5">
                                        <span className="text-slate-500 flex items-center">
                                            <Clock className="w-4 h-4 mr-2.5 text-slate-400 shrink-0" />
                                            Terakhir Diperbarui
                                        </span>
                                        <span className="text-slate-600 font-semibold text-[11px]">
                                            27 September 2026, 08:12
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. PENGUMUMAN SEKOLAH CARD */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
                                    <Bell className="w-3.5 h-3.5 mr-1.5 text-[#800020]" />
                                    Pengumuman Sekolah
                                </h4>
                                <Link 
                                    href={route("announcements.index")}
                                    className="text-[10px] font-semibold text-[#800020] hover:text-[#5C0017] uppercase tracking-wider flex items-center"
                                >
                                    Lihat Semua
                                    <ChevronRight className="w-3 h-3 ml-0.5" />
                                </Link>
                            </div>
                            <div className="space-y-2.5">
                                {announcements && announcements.length > 0 ? (
                                    announcements.slice(0, 3).map((announcement) => (
                                        <Link
                                            key={announcement.id}
                                            href={route("announcements.show", announcement.id)}
                                            className="block p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-[#FDF2F4] hover:border-[#800020] transition space-y-1"
                                        >
                                            <span className="text-[10px] font-semibold text-[#800020] uppercase tracking-wider">
                                                {announcement.target_role === "all" ? "Umum" : announcement.target_role}
                                            </span>
                                            <p className="text-xs font-bold text-slate-900">{announcement.title}</p>
                                            <p className="text-[11px] text-slate-500 line-clamp-2">
                                                {announcement.content.substring(0, 100)}...
                                            </p>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                                        <p className="text-xs text-slate-500 text-center">Belum ada pengumuman</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
