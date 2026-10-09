import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
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
    ChevronRight,
    SlidersHorizontal,
    Check,
    X,
    ShieldCheck,
    Edit3
} from 'lucide-react';

export default function DashboardIndex({ 
    auth, 
    role = 'admin', 
    roleLabel = 'Administrator Sistem',
    academicYear = '2026/2027 • Ganjil',
    schoolProfile = null,
    metrics = {},
    teacher = null,
    specialization = '',
    claimed_classes = [],
    claimed_subjects = [],
    available_subjects = [],
    available_classes = [],
    announcements = [],
    recent_classes = [],
    assignments = [],
    recent_violations = [],
    recent_sessions = [],
    recent_achievements = [],
    recent_students = [],
    pending_submissions = [],
    attendance = {}
}) {
    const user = auth?.user;
    const schoolName = schoolProfile?.school_name || 'UPT SDN 9 Gandangbatu Sillanan';
    const currentDateStr = "Sabtu, 27 September 2026";

    const [showClaimModal, setShowClaimModal] = useState(false);

    const { data: claimForm, setData: setClaimForm, post: postClaim, processing: claimProcessing } = useForm({
        teacher_type: teacher?.teacher_type || (role === 'guru_mapel' ? 'guru_mapel' : 'guru_kelas'),
        subject_specialization: specialization || '',
        subject_ids: (claimed_subjects || []).map(s => s.id),
        class_ids: (claimed_classes || []).map(c => c.id),
    });

    const toggleSubject = (id) => {
        const current = claimForm.subject_ids || [];
        if (current.includes(id)) {
            setClaimForm('subject_ids', []);
        } else {
            setClaimForm('subject_ids', [id]);
        }
    };

    const toggleClass = (id) => {
        const current = claimForm.class_ids || [];
        if (current.includes(id)) {
            setClaimForm('class_ids', current.filter(item => item !== id));
        } else {
            setClaimForm('class_ids', [...current, id]);
        }
    };

    const handleClaimSubmit = (e) => {
        e.preventDefault();
        postClaim(route('teacher.claim-subjects'), {
            onSuccess: () => {
                setShowClaimModal(false);
            }
        });
    };

    const displaySubjectTitle = (claimed_subjects && claimed_subjects.length > 0)
        ? claimed_subjects[0].name
        : (specialization && !['guru kelas', 'wali kelas'].includes(specialization.toLowerCase()) ? specialization : '');

    const card1MapelTitle = displaySubjectTitle || 'Belum Set Mapel';

    const displayTitle = (role === 'guru_mapel' || teacher?.teacher_type === 'guru_mapel')
        ? (displaySubjectTitle ? `Guru Mata Pelajaran ${displaySubjectTitle}` : 'Guru Mata Pelajaran')
        : role === 'guru'
            ? (displaySubjectTitle ? `Guru Mata Pelajaran ${displaySubjectTitle}` : (claimed_classes && claimed_classes.length > 0 ? `Wali Kelas ${claimed_classes[0].name.replace(/^Kelas\s+/i, '')}` : 'Guru / Wali Kelas'))
            : role === 'tendik'
                ? 'Tenaga Kependidikan'
                : roleLabel;

    return (
        <AuthenticatedLayout>
            <Head title={`Dashboard ${displayTitle} - Smart School LMS`} />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* 1. CLEAN & MODERN DASHBOARD HEADER */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-slate-200/80 pb-5">
                    <div className="space-y-1">
                        <p className="text-[11px] font-bold text-[#800020] uppercase tracking-wider">
                            Selamat Datang di Smart School LMS
                        </p>

                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex flex-wrap items-center gap-2">
                            <span>Dashboard {displayTitle}</span>
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                            Ringkasan data dan informasi utama sistem sekolah dalam satu tampilan terpadu.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                        {(role === 'guru' || role === 'guru_mapel') && (
                            <button
                                type="button"
                                onClick={() => setShowClaimModal(true)}
                                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#800020] text-white hover:bg-[#5C0017] transition text-xs font-bold shadow-md shadow-[#800020]/20 cursor-pointer"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                <span>Klaim Pelajaran & Kelas</span>
                            </button>
                        )}

                        <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200/80 text-right shadow-2xs shrink-0 flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#800020] flex items-center justify-center shrink-0 border border-rose-100">
                                <Calendar className="w-4 h-4 text-[#800020]" />
                            </div>
                            <div className="text-left md:text-right">
                                <p className="text-xs font-bold text-slate-900 leading-tight">
                                    {currentDateStr}
                                </p>
                                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                    Selamat bekerja, <span className="font-semibold text-slate-800">{user?.name?.split(' ')[0] || 'Pengguna'}</span>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. CORE METRICS GRID (HARMONIOUS 4-ACCENT PALETTE STYLE) */}
                {role === 'admin' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        {/* Metric 1: Peserta Didik (Deep Maroon) */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#800020] via-[#70001C] to-[#5C0017] p-5 text-white shadow-md shadow-[#800020]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[135px] border border-white/10 group">
                            {/* Decorative Background Soft Accents */}
                            <div className="w-20 h-20 rounded-full bg-white/10 absolute -top-5 -left-5 pointer-events-none blur-xs group-hover:scale-110 transition-transform duration-500" />
                            <div className="w-28 h-28 rounded-full bg-white/10 absolute -bottom-8 -right-8 pointer-events-none blur-sm group-hover:scale-110 transition-transform duration-500" />

                            {/* Top Row: Translucent Icon + Big Number */}
                            <div className="flex items-start justify-between relative z-10">
                                <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-right">
                                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white">
                                        {metrics.total_students ?? 5}
                                    </h3>
                                    <p className="text-[11px] font-medium text-rose-200 mt-0.5">Siswa</p>
                                </div>
                            </div>

                            {/* Bottom Row: Title + Status Badge */}
                            <div className="flex items-end justify-between relative z-10 pt-4">
                                <p className="text-xs font-bold text-white tracking-wide">
                                    Peserta Didik
                                </p>
                                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/15 text-white/90 border border-white/20 backdrop-blur-xs">
                                    Terdaftar Aktif
                                </span>
                            </div>
                        </div>

                        {/* Metric 2: Tenaga Pendidik (Golden Amber / Warm Gold) */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#D97706] via-[#B45309] to-[#92400E] p-5 text-white shadow-md shadow-[#D97706]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[135px] border border-white/10 group">
                            <div className="w-20 h-20 rounded-full bg-white/10 absolute -top-5 -left-5 pointer-events-none blur-xs group-hover:scale-110 transition-transform duration-500" />
                            <div className="w-28 h-28 rounded-full bg-white/10 absolute -bottom-8 -right-8 pointer-events-none blur-sm group-hover:scale-110 transition-transform duration-500" />

                            <div className="flex items-start justify-between relative z-10">
                                <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                                    <GraduationCap className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-right">
                                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white">
                                        {metrics.total_teachers ?? 2}
                                    </h3>
                                    <p className="text-[11px] font-medium text-amber-100 mt-0.5">Guru</p>
                                </div>
                            </div>

                            <div className="flex items-end justify-between relative z-10 pt-4">
                                <p className="text-xs font-bold text-white tracking-wide">
                                    Tenaga Pendidik
                                </p>
                                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/15 text-white/90 border border-white/20 backdrop-blur-xs">
                                    PNS & PPPK
                                </span>
                            </div>
                        </div>

                        {/* Metric 3: Rombongan Belajar (Sapphire Blue) */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] p-5 text-white shadow-md shadow-[#2563EB]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[135px] border border-white/10 group">
                            <div className="w-20 h-20 rounded-full bg-white/10 absolute -top-5 -left-5 pointer-events-none blur-xs group-hover:scale-110 transition-transform duration-500" />
                            <div className="w-28 h-28 rounded-full bg-white/10 absolute -bottom-8 -right-8 pointer-events-none blur-sm group-hover:scale-110 transition-transform duration-500" />

                            <div className="flex items-start justify-between relative z-10">
                                <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                                    <School className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-right">
                                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white">
                                        {metrics.total_classes ?? 6}
                                    </h3>
                                    <p className="text-[11px] font-medium text-blue-100 mt-0.5">Rombel</p>
                                </div>
                            </div>

                            <div className="flex items-end justify-between relative z-10 pt-4">
                                <p className="text-xs font-bold text-white tracking-wide">
                                    Rombongan Belajar
                                </p>
                                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/15 text-white/90 border border-white/20 backdrop-blur-xs">
                                    Kelas 1 - Kelas 6
                                </span>
                            </div>
                        </div>

                        {/* Metric 4: Mata Pelajaran (Terracotta Crimson Rose) */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#E11D48] via-[#BE123C] to-[#9F1239] p-5 text-white shadow-md shadow-[#E11D48]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[135px] border border-white/10 group">
                            <div className="w-20 h-20 rounded-full bg-white/10 absolute -top-5 -left-5 pointer-events-none blur-xs group-hover:scale-110 transition-transform duration-500" />
                            <div className="w-28 h-28 rounded-full bg-white/10 absolute -bottom-8 -right-8 pointer-events-none blur-sm group-hover:scale-110 transition-transform duration-500" />

                            <div className="flex items-start justify-between relative z-10">
                                <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                                    <BookOpen className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-right">
                                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white">
                                        {metrics.total_subjects ?? 8}
                                    </h3>
                                    <p className="text-[11px] font-medium text-rose-100 mt-0.5">Mapel</p>
                                </div>
                            </div>

                            <div className="flex items-end justify-between relative z-10 pt-4">
                                <p className="text-xs font-bold text-white tracking-wide">
                                    Mata Pelajaran
                                </p>
                                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/15 text-white/90 border border-white/20 backdrop-blur-xs">
                                    Kurikulum Merdeka
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ROLE: PIMPINAN (KEPALA SEKOLAH) */}
                {role === 'pimpinan' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#800020] via-[#70001C] to-[#5C0017] p-5 text-white shadow-md shadow-[#800020]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[135px] border border-white/10 group">
                            <div className="w-20 h-20 rounded-full bg-white/10 absolute -top-5 -left-5 pointer-events-none blur-xs group-hover:scale-110 transition-transform duration-500" />
                            <div className="w-28 h-28 rounded-full bg-white/10 absolute -bottom-8 -right-8 pointer-events-none blur-sm group-hover:scale-110 transition-transform duration-500" />
                            <div className="flex items-start justify-between relative z-10">
                                <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                                    <CalendarCheck className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-right">
                                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white">
                                        {metrics.attendance_percentage ?? '72.0%'}
                                    </h3>
                                    <p className="text-[11px] font-medium text-rose-200 mt-0.5">Tingkat Kehadiran</p>
                                </div>
                            </div>
                            <div className="flex items-end justify-between relative z-10 pt-4">
                                <p className="text-xs font-bold text-white tracking-wide">Rerata Presensi Siswa</p>
                                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/15 text-white/90 border border-white/20 backdrop-blur-xs">
                                    Kategori Baik
                                </span>
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#D97706] via-[#B45309] to-[#92400E] p-5 text-white shadow-md shadow-[#D97706]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[135px] border border-white/10 group">
                            <div className="w-20 h-20 rounded-full bg-white/10 absolute -top-5 -left-5 pointer-events-none blur-xs group-hover:scale-110 transition-transform duration-500" />
                            <div className="w-28 h-28 rounded-full bg-white/10 absolute -bottom-8 -right-8 pointer-events-none blur-sm group-hover:scale-110 transition-transform duration-500" />
                            <div className="flex items-start justify-between relative z-10">
                                <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-right">
                                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white">
                                        {metrics.teachers_present_today ?? 2} / {metrics.total_teachers ?? 2}
                                    </h3>
                                    <p className="text-[11px] font-medium text-amber-100 mt-0.5">Guru</p>
                                </div>
                            </div>
                            <div className="flex items-end justify-between relative z-10 pt-4">
                                <p className="text-xs font-bold text-white tracking-wide">Kehadiran Pendidik</p>
                                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/15 text-white/90 border border-white/20 backdrop-blur-xs">
                                    Hadir Bertugas
                                </span>
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] p-5 text-white shadow-md shadow-[#2563EB]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[135px] border border-white/10 group">
                            <div className="w-20 h-20 rounded-full bg-white/10 absolute -top-5 -left-5 pointer-events-none blur-xs group-hover:scale-110 transition-transform duration-500" />
                            <div className="w-28 h-28 rounded-full bg-white/10 absolute -bottom-8 -right-8 pointer-events-none blur-sm group-hover:scale-110 transition-transform duration-500" />
                            <div className="flex items-start justify-between relative z-10">
                                <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                                    <School className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-right">
                                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white">
                                        {metrics.total_students ?? 5}
                                    </h3>
                                    <p className="text-[11px] font-medium text-blue-100 mt-0.5">Siswa</p>
                                </div>
                            </div>
                            <div className="flex items-end justify-between relative z-10 pt-4">
                                <p className="text-xs font-bold text-white tracking-wide">Total Siswa Aktif</p>
                                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/15 text-white/90 border border-white/20 backdrop-blur-xs">
                                    6 Rombel Aktif
                                </span>
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#E11D48] via-[#BE123C] to-[#9F1239] p-5 text-white shadow-md shadow-[#E11D48]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[135px] border border-white/10 group">
                            <div className="w-20 h-20 rounded-full bg-white/10 absolute -top-5 -left-5 pointer-events-none blur-xs group-hover:scale-110 transition-transform duration-500" />
                            <div className="w-28 h-28 rounded-full bg-white/10 absolute -bottom-8 -right-8 pointer-events-none blur-sm group-hover:scale-110 transition-transform duration-500" />
                            <div className="flex items-start justify-between relative z-10">
                                <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                                    <Award className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-right">
                                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white">
                                        {metrics.achievements_count ?? 5}
                                    </h3>
                                    <p className="text-[11px] font-medium text-rose-100 mt-0.5">Piagam</p>
                                </div>
                            </div>
                            <div className="flex items-end justify-between relative z-10 pt-4">
                                <p className="text-xs font-bold text-white tracking-wide">Prestasi Siswa</p>
                                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/15 text-white/90 border border-white/20 backdrop-blur-xs">
                                    Kec. & Kab.
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ROLE: GURU / GURU MAPEL */}
                {(role === 'guru' || role === 'guru_mapel') && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                            {/* Card 1: Spesialisasi / Mapel Diampu */}
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#800020] via-[#70001C] to-[#5C0017] p-5 text-white shadow-md shadow-[#800020]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[135px] border border-white/10 group">
                                <div className="w-20 h-20 rounded-full bg-white/10 absolute -top-5 -left-5 pointer-events-none blur-xs group-hover:scale-110 transition-transform duration-500" />
                                <div className="w-28 h-28 rounded-full bg-white/10 absolute -bottom-8 -right-8 pointer-events-none blur-sm group-hover:scale-110 transition-transform duration-500" />
                                <div className="flex items-start justify-between relative z-10">
                                    <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                                        <BookOpen className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-right max-w-[65%]">
                                        <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight text-white truncate">
                                            {card1MapelTitle}
                                        </h3>
                                        <p className="text-[11px] font-medium text-rose-200 mt-0.5">Mapel Diampu</p>
                                    </div>
                                </div>
                                <div className="flex items-end justify-between relative z-10 pt-4">
                                    <p className="text-xs font-bold text-white tracking-wide">
                                        {claimed_subjects.length > 0 ? `${claimed_subjects.length} Mapel Diklaim` : 'Guru Mata Pelajaran'}
                                    </p>
                                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/15 text-white/90 border border-white/20 backdrop-blur-xs">
                                        {role === 'guru_mapel' ? 'Guru Mapel' : 'Guru Kelas'}
                                    </span>
                                </div>
                            </div>

                            {/* Card 2: Rombel / Kelas Diajar */}
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#D97706] via-[#B45309] to-[#92400E] p-5 text-white shadow-md shadow-[#D97706]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[135px] border border-white/10 group">
                                <div className="w-20 h-20 rounded-full bg-white/10 absolute -top-5 -left-5 pointer-events-none blur-xs group-hover:scale-110 transition-transform duration-500" />
                                <div className="w-28 h-28 rounded-full bg-white/10 absolute -bottom-8 -right-8 pointer-events-none blur-sm group-hover:scale-110 transition-transform duration-500" />
                                <div className="flex items-start justify-between relative z-10">
                                    <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                                        <School className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white">
                                            {claimed_classes.length > 0 ? `${claimed_classes.length} Kelas` : (metrics.class_name ?? 'Kelas 6')}
                                        </h3>
                                        <p className="text-[11px] font-medium text-amber-100 mt-0.5">Rombel Diajar</p>
                                    </div>
                                </div>
                                <div className="flex items-end justify-between relative z-10 pt-4">
                                    <p className="text-xs font-bold text-white tracking-wide truncate max-w-[150px]">
                                        {claimed_classes.length > 0 ? claimed_classes.map(c => c.name).join(', ') : 'Kelas 1 - Kelas 6'}
                                    </p>
                                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/15 text-white/90 border border-white/20 backdrop-blur-xs">
                                        {metrics.homeroom_students ?? 0} Siswa Total
                                    </span>
                                </div>
                            </div>

                            {/* Card 3: Modul Ajar */}
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] p-5 text-white shadow-md shadow-[#2563EB]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[135px] border border-white/10 group">
                                <div className="w-20 h-20 rounded-full bg-white/10 absolute -top-5 -left-5 pointer-events-none blur-xs group-hover:scale-110 transition-transform duration-500" />
                                <div className="w-28 h-28 rounded-full bg-white/10 absolute -bottom-8 -right-8 pointer-events-none blur-sm group-hover:scale-110 transition-transform duration-500" />
                                <div className="flex items-start justify-between relative z-10">
                                    <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                                        <Layers className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white">
                                            {metrics.active_materials ?? 1}
                                        </h3>
                                        <p className="text-[11px] font-medium text-blue-100 mt-0.5">Modul</p>
                                    </div>
                                </div>
                                <div className="flex items-end justify-between relative z-10 pt-4">
                                    <p className="text-xs font-bold text-white tracking-wide">Modul Ajar Saya</p>
                                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/15 text-white/90 border border-white/20 backdrop-blur-xs">
                                        Tersedia untuk Siswa
                                    </span>
                                </div>
                            </div>

                            {/* Card 4: Tugas & Asesmen */}
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#E11D48] via-[#BE123C] to-[#9F1239] p-5 text-white shadow-md shadow-[#E11D48]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[135px] border border-white/10 group">
                                <div className="w-20 h-20 rounded-full bg-white/10 absolute -top-5 -left-5 pointer-events-none blur-xs group-hover:scale-110 transition-transform duration-500" />
                                <div className="w-28 h-28 rounded-full bg-white/10 absolute -bottom-8 -right-8 pointer-events-none blur-sm group-hover:scale-110 transition-transform duration-500" />
                                <div className="flex items-start justify-between relative z-10">
                                    <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                                        <FileText className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white">
                                            {metrics.active_assignments ?? 1}
                                        </h3>
                                        <p className="text-[11px] font-medium text-rose-100 mt-0.5">Tugas</p>
                                    </div>
                                </div>
                                <div className="flex items-end justify-between relative z-10 pt-4">
                                    <p className="text-xs font-bold text-white tracking-wide">Tugas & Asesmen</p>
                                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/15 text-white/90 border border-white/20 backdrop-blur-xs">
                                        {metrics.pending_grades ?? 0} Perlu Dinilai
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* DETAIL PENUGASAN GURU CARD */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#FDF2F4] text-[#800020] flex items-center justify-center font-bold shrink-0 border border-[#E8B4B8]/40">
                                        <GraduationCap className="w-5 h-5 text-[#800020]" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                                            <span>{displayTitle}</span>
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#800020] text-white">
                                                {role === 'guru_mapel' ? 'Guru Mapel' : 'Guru Pendidik'}
                                            </span>
                                        </h2>
                                        <p className="text-xs text-slate-500 font-medium">
                                            NIP: <span className="font-mono text-slate-800">{teacher?.nip || user?.username || '-'}</span> • Status: <span className="font-semibold text-slate-700">{teacher?.employment_status || 'PNS'}</span>
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowClaimModal(true)}
                                    className="px-3.5 py-2 rounded-xl bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer shrink-0 self-start sm:self-auto"
                                >
                                    <SlidersHorizontal className="w-3.5 h-3.5" />
                                    <span>Klaim / Atur Kelas & Mapel</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                            <BookOpen className="w-3.5 h-3.5 text-[#800020]" />
                                            Mata Pelajaran Diampu
                                        </span>
                                        <span className="text-[11px] font-bold text-[#800020]">
                                            {claimed_subjects.length} Mapel
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {claimed_subjects && claimed_subjects.length > 0 ? (
                                            claimed_subjects.map((sbj, sIdx) => (
                                                <span key={sIdx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-[#800020] border border-[#800020]/20 shadow-2xs">
                                                    <Check className="w-3 h-3 text-[#800020]" />
                                                    {sbj.name}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                                Belum mengklaim mata pelajaran
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                            <School className="w-3.5 h-3.5 text-amber-600" />
                                            Rombel / Kelas Diajar
                                        </span>
                                        <span className="text-[11px] font-bold text-amber-700">
                                            {claimed_classes.length} Rombel
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {claimed_classes && claimed_classes.length > 0 ? (
                                            claimed_classes.map((cls, cIdx) => (
                                                <span key={cIdx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-slate-800 border border-slate-200 shadow-2xs">
                                                    <Check className="w-3 h-3 text-emerald-600" />
                                                    {cls.name}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                Belum mengklaim kelas
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ROLE: TENAGA KEPENDIDIKAN (TENDIK) */}
                {role === 'tendik' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#800020] via-[#70001C] to-[#5C0017] p-5 text-white shadow-md shadow-[#800020]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[135px] border border-white/10 group">
                                <div className="w-20 h-20 rounded-full bg-white/10 absolute -top-5 -left-5 pointer-events-none blur-xs group-hover:scale-110 transition-transform duration-500" />
                                <div className="w-28 h-28 rounded-full bg-white/10 absolute -bottom-8 -right-8 pointer-events-none blur-sm group-hover:scale-110 transition-transform duration-500" />
                                <div className="flex items-start justify-between relative z-10">
                                    <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                                        <Users className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white">
                                            {metrics.total_students ?? 5}
                                        </h3>
                                        <p className="text-[11px] font-medium text-rose-200 mt-0.5">Siswa</p>
                                    </div>
                                </div>
                                <div className="flex items-end justify-between relative z-10 pt-4">
                                    <p className="text-xs font-bold text-white tracking-wide">Buku Induk Siswa</p>
                                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/15 text-white/90 border border-white/20 backdrop-blur-xs">
                                        Terdaftar Aktif
                                    </span>
                                </div>
                            </div>

                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#D97706] via-[#B45309] to-[#92400E] p-5 text-white shadow-md shadow-[#D97706]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[135px] border border-white/10 group">
                                <div className="w-20 h-20 rounded-full bg-white/10 absolute -top-5 -left-5 pointer-events-none blur-xs group-hover:scale-110 transition-transform duration-500" />
                                <div className="w-28 h-28 rounded-full bg-white/10 absolute -bottom-8 -right-8 pointer-events-none blur-sm group-hover:scale-110 transition-transform duration-500" />
                                <div className="flex items-start justify-between relative z-10">
                                    <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                                        <GraduationCap className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white">
                                            {metrics.total_teachers ?? 3}
                                        </h3>
                                        <p className="text-[11px] font-medium text-amber-100 mt-0.5">Pegawai</p>
                                    </div>
                                </div>
                                <div className="flex items-end justify-between relative z-10 pt-4">
                                    <p className="text-xs font-bold text-white tracking-wide">Guru & Tendik</p>
                                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/15 text-white/90 border border-white/20 backdrop-blur-xs">
                                        Tenaga Pendidik
                                    </span>
                                </div>
                            </div>

                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] p-5 text-white shadow-md shadow-[#2563EB]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[135px] border border-white/10 group">
                                <div className="w-20 h-20 rounded-full bg-white/10 absolute -top-5 -left-5 pointer-events-none blur-xs group-hover:scale-110 transition-transform duration-500" />
                                <div className="w-28 h-28 rounded-full bg-white/10 absolute -bottom-8 -right-8 pointer-events-none blur-sm group-hover:scale-110 transition-transform duration-500" />
                                <div className="flex items-start justify-between relative z-10">
                                    <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                                        <School className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white">
                                            {metrics.total_classes ?? 6}
                                        </h3>
                                        <p className="text-[11px] font-medium text-blue-100 mt-0.5">Rombel</p>
                                    </div>
                                </div>
                                <div className="flex items-end justify-between relative z-10 pt-4">
                                    <p className="text-xs font-bold text-white tracking-wide">Rombongan Belajar</p>
                                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/15 text-white/90 border border-white/20 backdrop-blur-xs">
                                        Kelas 1 - Kelas 6
                                    </span>
                                </div>
                            </div>

                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#E11D48] via-[#BE123C] to-[#9F1239] p-5 text-white shadow-md shadow-[#E11D48]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[135px] border border-white/10 group">
                                <div className="w-20 h-20 rounded-full bg-white/10 absolute -top-5 -left-5 pointer-events-none blur-xs group-hover:scale-110 transition-transform duration-500" />
                                <div className="w-28 h-28 rounded-full bg-white/10 absolute -bottom-8 -right-8 pointer-events-none blur-sm group-hover:scale-110 transition-transform duration-500" />
                                <div className="flex items-start justify-between relative z-10">
                                    <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                                        <CalendarCheck className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white">
                                            {metrics.today_attendances ?? 18}
                                        </h3>
                                        <p className="text-[11px] font-medium text-rose-100 mt-0.5">Hadir</p>
                                    </div>
                                </div>
                                <div className="flex items-end justify-between relative z-10 pt-4">
                                    <p className="text-xs font-bold text-white tracking-wide">Presensi Terdaftar</p>
                                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/15 text-white/90 border border-white/20 backdrop-blur-xs">
                                        Administrasi Sekolah
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ROLE: GURU BK */}
                {role === 'bk' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#800020] via-[#70001C] to-[#5C0017] p-5 text-white shadow-md shadow-[#800020]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[135px] border border-white/10 group">
                            <div className="w-20 h-20 rounded-full bg-white/10 absolute -top-5 -left-5 pointer-events-none blur-xs group-hover:scale-110 transition-transform duration-500" />
                            <div className="w-28 h-28 rounded-full bg-white/10 absolute -bottom-8 -right-8 pointer-events-none blur-sm group-hover:scale-110 transition-transform duration-500" />
                            <div className="flex items-start justify-between relative z-10">
                                <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-right">
                                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white">
                                        {metrics.total_sessions ?? 2}
                                    </h3>
                                    <p className="text-[11px] font-medium text-rose-200 mt-0.5">Sesi</p>
                                </div>
                            </div>
                            <div className="flex items-end justify-between relative z-10 pt-4">
                                <p className="text-xs font-bold text-white tracking-wide">Sesi Konseling</p>
                                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/15 text-white/90 border border-white/20 backdrop-blur-xs">
                                    Individual & Kelompok
                                </span>
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#D97706] via-[#B45309] to-[#92400E] p-5 text-white shadow-md shadow-[#D97706]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[135px] border border-white/10 group">
                            <div className="w-20 h-20 rounded-full bg-white/10 absolute -top-5 -left-5 pointer-events-none blur-xs group-hover:scale-110 transition-transform duration-500" />
                            <div className="w-28 h-28 rounded-full bg-white/10 absolute -bottom-8 -right-8 pointer-events-none blur-sm group-hover:scale-110 transition-transform duration-500" />
                            <div className="flex items-start justify-between relative z-10">
                                <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                                    <AlertTriangle className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-right">
                                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white">
                                        {metrics.active_violations ?? 1}
                                    </h3>
                                    <p className="text-[11px] font-medium text-amber-100 mt-0.5">Kasus</p>
                                </div>
                            </div>
                            <div className="flex items-end justify-between relative z-10 pt-4">
                                <p className="text-xs font-bold text-white tracking-wide">Rekam Pelanggaran</p>
                                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/15 text-white/90 border border-white/20 backdrop-blur-xs">
                                    Poin Tata Tertib
                                </span>
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] p-5 text-white shadow-md shadow-[#2563EB]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[135px] border border-white/10 group">
                            <div className="w-20 h-20 rounded-full bg-white/10 absolute -top-5 -left-5 pointer-events-none blur-xs group-hover:scale-110 transition-transform duration-500" />
                            <div className="w-28 h-28 rounded-full bg-white/10 absolute -bottom-8 -right-8 pointer-events-none blur-sm group-hover:scale-110 transition-transform duration-500" />
                            <div className="flex items-start justify-between relative z-10">
                                <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                                    <Award className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-right">
                                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white">
                                        {metrics.total_achievements ?? 2}
                                    </h3>
                                    <p className="text-[11px] font-medium text-blue-100 mt-0.5">Piagam</p>
                                </div>
                            </div>
                            <div className="flex items-end justify-between relative z-10 pt-4">
                                <p className="text-xs font-bold text-white tracking-wide">Piagam Prestasi</p>
                                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/15 text-white/90 border border-white/20 backdrop-blur-xs">
                                    Akademik & Non
                                </span>
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#E11D48] via-[#BE123C] to-[#9F1239] p-5 text-white shadow-md shadow-[#E11D48]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[135px] border border-white/10 group">
                            <div className="w-20 h-20 rounded-full bg-white/10 absolute -top-5 -left-5 pointer-events-none blur-xs group-hover:scale-110 transition-transform duration-500" />
                            <div className="w-28 h-28 rounded-full bg-white/10 absolute -bottom-8 -right-8 pointer-events-none blur-sm group-hover:scale-110 transition-transform duration-500" />
                            <div className="flex items-start justify-between relative z-10">
                                <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                                    <School className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-right">
                                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white">
                                        {metrics.monitored_students ?? 5}
                                    </h3>
                                    <p className="text-[11px] font-medium text-rose-100 mt-0.5">Siswa</p>
                                </div>
                            </div>
                            <div className="flex items-end justify-between relative z-10 pt-4">
                                <p className="text-xs font-bold text-white tracking-wide">Monitoring Siswa</p>
                                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/15 text-white/90 border border-white/20 backdrop-blur-xs">
                                    Rombel 1-6
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ROLE: SISWA */}
                {role === 'siswa' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#800020] via-[#70001C] to-[#5C0017] p-5 text-white shadow-md shadow-[#800020]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[135px] border border-white/10 group">
                            <div className="w-20 h-20 rounded-full bg-white/10 absolute -top-5 -left-5 pointer-events-none blur-xs group-hover:scale-110 transition-transform duration-500" />
                            <div className="w-28 h-28 rounded-full bg-white/10 absolute -bottom-8 -right-8 pointer-events-none blur-sm group-hover:scale-110 transition-transform duration-500" />
                            <div className="flex items-start justify-between relative z-10">
                                <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                                    <School className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-right">
                                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white">
                                        {metrics.class_name ? metrics.class_name.replace(/^Kelas\s*/i, '') : '6'}
                                    </h3>
                                    <p className="text-[11px] font-medium text-rose-200 mt-0.5">Kelas Saya</p>
                                </div>
                            </div>
                            <div className="flex items-end justify-between relative z-10 pt-4">
                                <p className="text-xs font-bold text-white tracking-wide">Rombongan Belajar</p>
                                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/15 text-white/90 border border-white/20 backdrop-blur-xs">
                                    NISN: {metrics.nisn ?? '0081234567'}
                                </span>
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#D97706] via-[#B45309] to-[#92400E] p-5 text-white shadow-md shadow-[#D97706]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[135px] border border-white/10 group">
                            <div className="w-20 h-20 rounded-full bg-white/10 absolute -top-5 -left-5 pointer-events-none blur-xs group-hover:scale-110 transition-transform duration-500" />
                            <div className="w-28 h-28 rounded-full bg-white/10 absolute -bottom-8 -right-8 pointer-events-none blur-sm group-hover:scale-110 transition-transform duration-500" />
                            <div className="flex items-start justify-between relative z-10">
                                <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                                    <CalendarCheck className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-right">
                                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white">
                                        {attendance.hadir ?? 8}
                                    </h3>
                                    <p className="text-[11px] font-medium text-amber-100 mt-0.5">Hadir</p>
                                </div>
                            </div>
                            <div className="flex items-end justify-between relative z-10 pt-4">
                                <p className="text-xs font-bold text-white tracking-wide">Kehadiran Saya</p>
                                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/15 text-white/90 border border-white/20 backdrop-blur-xs">
                                    Izin: {attendance.izin ?? 1} • Sakit: {attendance.sakit ?? 1}
                                </span>
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] p-5 text-white shadow-md shadow-[#2563EB]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[135px] border border-white/10 group">
                            <div className="w-20 h-20 rounded-full bg-white/10 absolute -top-5 -left-5 pointer-events-none blur-xs group-hover:scale-110 transition-transform duration-500" />
                            <div className="w-28 h-28 rounded-full bg-white/10 absolute -bottom-8 -right-8 pointer-events-none blur-sm group-hover:scale-110 transition-transform duration-500" />
                            <div className="flex items-start justify-between relative z-10">
                                <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                                    <BookOpen className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-right">
                                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white">
                                        {metrics.total_materials ?? 1}
                                    </h3>
                                    <p className="text-[11px] font-medium text-blue-100 mt-0.5">Modul</p>
                                </div>
                            </div>
                            <div className="flex items-end justify-between relative z-10 pt-4">
                                <p className="text-xs font-bold text-white tracking-wide">Bahan Ajar LMS</p>
                                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/15 text-white/90 border border-white/20 backdrop-blur-xs">
                                    Siap Dipelajari
                                </span>
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#E11D48] via-[#BE123C] to-[#9F1239] p-5 text-white shadow-md shadow-[#E11D48]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[135px] border border-white/10 group">
                            <div className="w-20 h-20 rounded-full bg-white/10 absolute -top-5 -left-5 pointer-events-none blur-xs group-hover:scale-110 transition-transform duration-500" />
                            <div className="w-28 h-28 rounded-full bg-white/10 absolute -bottom-8 -right-8 pointer-events-none blur-sm group-hover:scale-110 transition-transform duration-500" />
                            <div className="flex items-start justify-between relative z-10">
                                <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                                    <Layers className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-right">
                                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white">
                                        {metrics.active_assignments ?? 1}
                                    </h3>
                                    <p className="text-[11px] font-medium text-rose-100 mt-0.5">Tugas</p>
                                </div>
                            </div>
                            <div className="flex items-end justify-between relative z-10 pt-4">
                                <p className="text-xs font-bold text-white tracking-wide">Tugas Aktif</p>
                                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/15 text-white/90 border border-white/20 backdrop-blur-xs">
                                    Perlu Dikerjakan
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. MAIN OPERATIONAL GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Left Column (Wide, 2 Columns Span) */}
                    <div className="lg:col-span-2 space-y-6">
                        {role === 'admin' && (
                            <>
                                {/* Card 1: Rombongan Belajar Terdaftar */}
                                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6">
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
                                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                                                                            Lengkap
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-rose-500/10 text-rose-700 border border-rose-500/20">
                                                                            Belum Lengkap
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

                                {/* Card 2: Sub-Widgets (Kelengkapan Rombel & Status LMS) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Widget A: Kelengkapan Rombel */}
                                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                            <div className="flex items-center space-x-2.5">
                                                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
                                                    <School className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                                        Kelengkapan Rombel
                                                    </h3>
                                                    <p className="text-[11px] text-slate-500 font-medium">Penugasan Wali Kelas & Siswa</p>
                                                </div>
                                            </div>
                                            <Link href={route('master-data.index') + '?tab=rombel'} className="text-[11px] font-bold text-[#800020] hover:underline flex items-center">
                                                Atur <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                                            </Link>
                                        </div>

                                        <div className="space-y-3.5">
                                            {/* Progress bar 1: Wali Kelas */}
                                            <div>
                                                <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
                                                    <span className="text-slate-600">Penugasan Wali Kelas</span>
                                                    <span className="text-slate-900 font-bold">
                                                        {metrics.classes_with_teacher ?? 1} / {metrics.total_classes ?? 6} Kelas
                                                    </span>
                                                </div>
                                                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                                    <div 
                                                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                                        style={{ width: `${Math.round(((metrics.classes_with_teacher ?? 1) / (metrics.total_classes || 6)) * 100)}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Progress bar 2: Rombel Terisi Siswa */}
                                            <div>
                                                <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
                                                    <span className="text-slate-600">Rombel Terisi Siswa</span>
                                                    <span className="text-slate-900 font-bold">
                                                        {metrics.classes_with_students ?? 1} / {metrics.total_classes ?? 6} Rombel
                                                    </span>
                                                </div>
                                                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                                    <div 
                                                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                                                        style={{ width: `${Math.round(((metrics.classes_with_students ?? 1) / (metrics.total_classes || 6)) * 100)}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                                                <span className="text-slate-500 font-medium">Rata-rata Siswa/Rombel</span>
                                                <span className="font-bold text-slate-900">
                                                    {metrics.total_classes > 0 ? (metrics.total_students / metrics.total_classes).toFixed(1) : 0} Siswa / Kelas
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Widget B: Status Pembelajaran Digital (LMS) */}
                                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                            <div className="flex items-center space-x-2.5">
                                                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-bold">
                                                    <BookOpen className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                                        Aktivitas E-Learning & Ujian
                                                    </h3>
                                                    <p className="text-[11px] text-slate-500 font-medium">Ringkasan konten pembelajaran digital</p>
                                                </div>
                                            </div>
                                            <Link href={route('elearning.index')} className="text-[11px] font-bold text-[#800020] hover:underline flex items-center">
                                                Detail <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                                            </Link>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 text-center">
                                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                                <p className="text-lg font-black text-slate-900">{metrics.total_materials ?? 1}</p>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Modul Ajar</p>
                                            </div>
                                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                                <p className="text-lg font-black text-slate-900">{metrics.total_assignments ?? 1}</p>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Tugas LMS</p>
                                            </div>
                                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                                <p className="text-lg font-black text-slate-900">{metrics.total_exams ?? 0}</p>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Ujian Online</p>
                                            </div>
                                        </div>

                                        <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100/60 flex items-center justify-between text-xs">
                                            <span className="font-semibold text-[#800020]">Status Sistem E-Learning</span>
                                            <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                                                Aktif & Normal
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </>
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
                                                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-900">Pengisian Leger Nilai & Evaluasi Rapor Kelas 6</p>
                                                    <p className="text-[11px] text-slate-500">Wali Kelas: Budi Santoso, S.Pd. • 5 Dokumen Rapor Lengkap</p>
                                                </div>
                                            </div>
                                            <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                                                Siap Sahkan
                                            </span>
                                        </div>

                                        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-lg bg-rose-50 text-[#800020] border border-rose-100 flex items-center justify-center shrink-0">
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

                        {(role === 'guru' || role === 'guru_mapel') && (
                            <div className="space-y-6">
                                {/* Card 1: Workspace & Quick Operations for Active Class/Subject */}
                                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                                        <div>
                                            <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                                                <span>Pusat Pengajaran & Pembelajaran Kelas</span>
                                            </h2>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                                                Akses cepat pengelolaan kelas, presensi, materi, dan e-rapor.
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            {displaySubjectTitle && (
                                                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-[#FDF2F4] text-[#800020] border border-[#E8B4B8]/50">
                                                    {displaySubjectTitle}
                                                </span>
                                            )}
                                            {claimed_classes && claimed_classes.length > 0 && (
                                                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                                    {claimed_classes.map(c => c.name).join(', ')}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <Link
                                            href={route('presensi.index')}
                                            className="p-4 rounded-xl border border-slate-200/80 hover:border-[#800020]/40 hover:bg-[#FDF2F4]/40 transition group flex items-start space-x-3.5"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#800020] border border-rose-100 flex items-center justify-center shrink-0 group-hover:bg-[#800020] group-hover:text-white transition">
                                                <CalendarCheck className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#800020] transition">
                                                    Presensi Siswa Harian
                                                </h4>
                                                <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                                                    Catat kehadiran harian, sakit, izin, & alpa siswa rombel.
                                                </p>
                                            </div>
                                        </Link>

                                        <Link
                                            href={route('elearning.index')}
                                            className="p-4 rounded-xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/40 transition group flex items-start space-x-3.5"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                                                <BookOpen className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition">
                                                    Modul & Bahan Ajar LMS
                                                </h4>
                                                <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                                                    Unggah materi, dokumen PDF, & bahan pembelajaran digital.
                                                </p>
                                            </div>
                                        </Link>

                                        <Link
                                            href={route('elearning.index') + '?tab=tugas'}
                                            className="p-4 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/40 transition group flex items-start space-x-3.5"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition">
                                                    Tugas & Asesmen Siswa
                                                </h4>
                                                <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                                                    Buat penugasan mandiri & koreksi berkas nilai siswa.
                                                </p>
                                            </div>
                                        </Link>

                                        <Link
                                            href={route('erapor.index')}
                                            className="p-4 rounded-xl border border-slate-200/80 hover:border-amber-300 hover:bg-amber-50/40 transition group flex items-start space-x-3.5"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition">
                                                <Award className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-800 transition">
                                                    Pengisian E-Rapor Digital
                                                </h4>
                                                <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                                                    Input nilai akhir, predikat, & catatan capaian rapor.
                                                </p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>

                                {/* Card 2: Pending Submissions */}
                                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
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
                                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/10 text-amber-700 border border-amber-500/20 uppercase">
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
                                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/10 text-amber-700 border border-amber-500/20">
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
                                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-500/10 text-blue-700 border border-blue-500/20 uppercase">
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
                                        <Link
                                            href={route('presensi.index') + '?type=guru'}
                                            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 hover:border-[#800020]/30 hover:bg-rose-50/30 transition-all duration-200 group"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#800020] border border-rose-100/80 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-[#800020] group-hover:text-white transition-colors duration-200">
                                                    <CalendarCheck className="w-4 h-4" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs font-bold text-slate-900 group-hover:text-[#800020] transition-colors">
                                                        Cek Presensi Guru Hari Ini
                                                    </p>
                                                    <p className="text-[10px] text-slate-500 font-normal">
                                                        Monitoring kehadiran pendidik
                                                    </p>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#800020] group-hover:translate-x-0.5 transition-all shrink-0" />
                                        </Link>
                                        <Link
                                            href={route('erapor.index') + '?tab=cetak'}
                                            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 hover:border-[#800020]/30 hover:bg-rose-50/30 transition-all duration-200 group"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#800020] border border-rose-100/80 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-[#800020] group-hover:text-white transition-colors duration-200">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs font-bold text-slate-900 group-hover:text-[#800020] transition-colors">
                                                        Pengesahan Lembar Rapor
                                                    </p>
                                                    <p className="text-[10px] text-slate-500 font-normal">
                                                        Validasi akhir dokumen rapor
                                                    </p>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#800020] group-hover:translate-x-0.5 transition-all shrink-0" />
                                        </Link>
                                    </>
                                )}

                                {role === 'guru' && (
                                    <>
                                        <Link
                                            href={route('presensi.index') + '?type=siswa'}
                                            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 hover:border-[#800020]/30 hover:bg-rose-50/30 transition-all duration-200 group"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#800020] border border-rose-100/80 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-[#800020] group-hover:text-white transition-colors duration-200">
                                                    <CalendarCheck className="w-4 h-4" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs font-bold text-slate-900 group-hover:text-[#800020] transition-colors">
                                                        Input Presensi Hari Ini
                                                    </p>
                                                    <p className="text-[10px] text-slate-500 font-normal">
                                                        Catat kehadiran siswa di kelas
                                                    </p>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#800020] group-hover:translate-x-0.5 transition-all shrink-0" />
                                        </Link>
                                        <Link
                                            href={route('elearning.index') + '?tab=materi'}
                                            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 hover:border-[#800020]/30 hover:bg-rose-50/30 transition-all duration-200 group"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#800020] border border-rose-100/80 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-[#800020] group-hover:text-white transition-colors duration-200">
                                                    <BookOpen className="w-4 h-4" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs font-bold text-slate-900 group-hover:text-[#800020] transition-colors">
                                                        Unggah Bahan Ajar Baru
                                                    </p>
                                                    <p className="text-[10px] text-slate-500 font-normal">
                                                        Tambah modul pembelajaran LMS
                                                    </p>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#800020] group-hover:translate-x-0.5 transition-all shrink-0" />
                                        </Link>
                                    </>
                                )}

                                {role === 'bk' && (
                                    <>
                                        <Link
                                            href={route('bk.index') + '?tab=konseling'}
                                            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 hover:border-[#800020]/30 hover:bg-rose-50/30 transition-all duration-200 group"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#800020] border border-rose-100/80 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-[#800020] group-hover:text-white transition-colors duration-200">
                                                    <Users className="w-4 h-4" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs font-bold text-slate-900 group-hover:text-[#800020] transition-colors">
                                                        Catat Sesi Bimbingan
                                                    </p>
                                                    <p className="text-[10px] text-slate-500 font-normal">
                                                        Bimbingan konseling siswa
                                                    </p>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#800020] group-hover:translate-x-0.5 transition-all shrink-0" />
                                        </Link>
                                        <Link
                                            href={route('bk.index') + '?tab=pelanggaran'}
                                            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 hover:border-[#800020]/30 hover:bg-rose-50/30 transition-all duration-200 group"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#800020] border border-rose-100/80 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-[#800020] group-hover:text-white transition-colors duration-200">
                                                    <AlertTriangle className="w-4 h-4" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs font-bold text-slate-900 group-hover:text-[#800020] transition-colors">
                                                        Pencatatan Poin Pelanggaran
                                                    </p>
                                                    <p className="text-[10px] text-slate-500 font-normal">
                                                        Buku poin tata tertib kedisiplinan
                                                    </p>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#800020] group-hover:translate-x-0.5 transition-all shrink-0" />
                                        </Link>
                                    </>
                                )}

                                {role === 'siswa' && (
                                    <>
                                        <Link
                                            href={route('elearning.index') + '?tab=materi'}
                                            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 hover:border-[#800020]/30 hover:bg-rose-50/30 transition-all duration-200 group"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#800020] border border-rose-100/80 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-[#800020] group-hover:text-white transition-colors duration-200">
                                                    <BookOpen className="w-4 h-4" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs font-bold text-slate-900 group-hover:text-[#800020] transition-colors">
                                                        Buka Materi Pelajaran
                                                    </p>
                                                    <p className="text-[10px] text-slate-500 font-normal">
                                                        Akses modul & bahan ajar
                                                    </p>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#800020] group-hover:translate-x-0.5 transition-all shrink-0" />
                                        </Link>
                                        <Link
                                            href={route('erapor.index') + '?tab=cetak'}
                                            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 hover:border-[#800020]/30 hover:bg-rose-50/30 transition-all duration-200 group"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#800020] border border-rose-100/80 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-[#800020] group-hover:text-white transition-colors duration-200">
                                                    <GraduationCap className="w-4 h-4" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs font-bold text-slate-900 group-hover:text-[#800020] transition-colors">
                                                        Lembar Rapor Saya
                                                    </p>
                                                    <p className="text-[10px] text-slate-500 font-normal">
                                                        Lihat hasil capaian belajar
                                                    </p>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#800020] group-hover:translate-x-0.5 transition-all shrink-0" />
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* 2. INFORMASI SISTEM CARD */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6">
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
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
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

            {/* MODAL KLAIM PELAJARAN & KELAS YANG DIAMPU */}
            {showClaimModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center space-x-2.5">
                                <div className="w-9 h-9 rounded-xl bg-[#FDF2F4] text-[#800020] flex items-center justify-center shrink-0 border border-[#E8B4B8]/40">
                                    <SlidersHorizontal className="w-5 h-5 text-[#800020]" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Klaim Pelajaran & Kelas yang Diampu</h3>
                                    <p className="text-xs text-slate-500">Pilih kualifikasi penugasan, mata pelajaran, dan kelas yang Anda ajar.</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowClaimModal(false)}
                                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs font-medium">
                            {/* Jenis Penugasan Guru */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Jenis Penugasan Guru
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setClaimForm({ ...claimForm, teacher_type: 'guru_mapel' })}
                                        className={`p-3 rounded-xl border text-left flex items-start space-x-2.5 transition cursor-pointer ${
                                            claimForm.teacher_type === 'guru_mapel'
                                                ? 'bg-[#FDF2F4] border-[#800020] text-[#800020] font-bold ring-2 ring-[#800020]/20'
                                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                                        }`}
                                    >
                                        <BookOpen className="w-4 h-4 mt-0.5 shrink-0 text-[#800020]" />
                                        <div>
                                            <span className="block font-bold">Guru Mata Pelajaran</span>
                                            <span className="text-[10px] text-slate-500 font-normal">Contoh: Guru PAI, PJOK, Bahasa Inggris, dll.</span>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setClaimForm({ ...claimForm, teacher_type: 'guru_kelas' })}
                                        className={`p-3 rounded-xl border text-left flex items-start space-x-2.5 transition cursor-pointer ${
                                            claimForm.teacher_type === 'guru_kelas'
                                                ? 'bg-[#FDF2F4] border-[#800020] text-[#800020] font-bold ring-2 ring-[#800020]/20'
                                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                                        }`}
                                    >
                                        <School className="w-4 h-4 mt-0.5 shrink-0 text-[#800020]" />
                                        <div>
                                            <span className="block font-bold">Guru Kelas / Wali Kelas</span>
                                            <span className="text-[10px] text-slate-500 font-normal">Mengajar dan membina rombel tertentu.</span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Nama Spesialisasi Mapel */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Spesialisasi Mata Pelajaran / Jabatan
                                </label>
                                <input
                                    type="text"
                                    value={claimForm.subject_specialization}
                                    onChange={(e) => setClaimForm('subject_specialization', e.target.value)}
                                    placeholder="Contoh: Pendidikan Agama Islam, PJOK, Bahasa Inggris"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#800020] focus:ring-2 focus:ring-[#800020]/20 text-xs text-slate-900 font-medium"
                                />
                            </div>

                            {/* Selection Mata Pelajaran (Max 1) */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                                        Pilih Mata Pelajaran yang Diampu (Pilih 1)
                                    </label>
                                    <span className="text-[10px] font-bold text-[#800020]">
                                        {claimForm.subject_ids?.length || 0} / 1 Terpilih
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[150px] overflow-y-auto p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                                    {(available_subjects || []).map((sbj) => {
                                        const isChecked = claimForm.subject_ids?.includes(sbj.id);
                                        return (
                                            <div
                                                key={sbj.id}
                                                onClick={() => toggleSubject(sbj.id)}
                                                className={`flex items-center space-x-2 p-2 rounded-lg border cursor-pointer select-none transition ${
                                                    isChecked
                                                        ? 'bg-white border-[#800020] text-[#800020] font-bold shadow-2xs'
                                                        : 'bg-white/70 border-slate-200 text-slate-600 hover:border-slate-300'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="claim_subject_choice"
                                                    checked={isChecked}
                                                    onChange={() => {}}
                                                    className="rounded-full text-[#800020] focus:ring-[#800020] w-3.5 h-3.5 cursor-pointer"
                                                />
                                                <span className="text-[11px] truncate">{sbj.name}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Checkbox Kelas / Rombel */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                                        Pilih Rombel / Kelas yang Diajar
                                    </label>
                                    <span className="text-[10px] font-bold text-amber-700">
                                        {claimForm.class_ids?.length || 0} Terpilih
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[150px] overflow-y-auto p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                                    {(available_classes || []).map((cls) => {
                                        const isChecked = claimForm.class_ids?.includes(cls.id);
                                        return (
                                            <div
                                                key={cls.id}
                                                onClick={() => toggleClass(cls.id)}
                                                className={`flex items-center space-x-2 p-2 rounded-lg border cursor-pointer select-none transition ${
                                                    isChecked
                                                        ? 'bg-white border-amber-600 text-amber-800 font-bold shadow-2xs'
                                                        : 'bg-white/70 border-slate-200 text-slate-600 hover:border-slate-300'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => {}}
                                                    className="rounded text-amber-600 focus:ring-amber-600 w-3.5 h-3.5 cursor-pointer"
                                                />
                                                <span className="text-[11px] truncate">{cls.name}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowClaimModal(false)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs transition cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={claimProcessing}
                                    className="px-5 py-2.5 rounded-xl bg-[#800020] hover:bg-[#5C0017] text-white font-bold text-xs transition shadow-sm cursor-pointer disabled:opacity-75 flex items-center gap-1.5"
                                >
                                    <Check className="w-4 h-4 text-white" />
                                    <span>{claimProcessing ? 'Menyimpan...' : 'Simpan & Klaim Kelas'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
