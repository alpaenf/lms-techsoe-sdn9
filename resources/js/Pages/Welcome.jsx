import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    GraduationCap, 
    BookOpen, 
    Users, 
    CalendarCheck, 
    FileText, 
    Award, 
    ShieldCheck, 
    ArrowRight, 
    Building2, 
    BarChart3, 
    CheckCircle2,
    MapPin,
    School,
    FileSpreadsheet,
    Laptop,
    Lock,
    ChevronDown,
    UserCheck,
    Bell,
    Check,
    Compass,
    Layers,
    Database,
    HardDrive,
    Activity,
    FileCheck,
    CheckSquare,
    Menu,
    X,
    User,
    ListCheck,
    LockKeyhole
} from 'lucide-react';

export default function Welcome({ auth }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeModuleTab, setActiveModuleTab] = useState('all');
    const [activeRoleTab, setActiveRoleTab] = useState('siswa');

    // Color Design System Tokens:
    // Primary Burgundy: #8B001F
    // Deep Burgundy: #650019
    // Soft Burgundy: #FFF0F2
    // Primary Text: #142033
    // Secondary Text: #64748B
    // Border: #E5EAF0
    // Success: #059669

    // Data 12 Modul Terintegrasi
    const moduleColumns = [
        {
            category: 'learning',
            columnTitle: 'Pembelajaran Digital',
            modules: [
                {
                    title: 'LMS & Bahan Ajar Digital',
                    desc: 'Penyampaian modul, modul, dan dokumen pembelajaran.',
                    icon: BookOpen
                },
                {
                    title: 'Tugas & Asesmen Daring',
                    desc: 'Penugasan, penilaian, dan evaluasi hasil belajar.',
                    icon: CheckSquare
                },
                {
                    title: 'Ujian Online / CBT',
                    desc: 'Pelaksanaan ujian secara aman dan terintegrasi.',
                    icon: Laptop
                }
            ]
        },
        {
            category: 'admin',
            columnTitle: 'Administrasi Akademik',
            modules: [
                {
                    title: 'Manajemen Multi-Role & RBAC',
                    desc: 'Hak akses untuk Admin, Guru, Siswa, Wali Kelas, dan Kepala Sekolah.',
                    icon: Users
                },
                {
                    title: 'Kelembagaan & Kalender Akademik',
                    desc: 'Profil sekolah dan pengaturan tahun ajaran.',
                    icon: School
                },
                {
                    title: 'Master Data Terintegrasi',
                    desc: 'Data guru, siswa, kelas, mata pelajaran, dan data pendukung lainnya.',
                    icon: Database
                },
                {
                    title: 'Buku Induk Siswa Digital',
                    desc: 'Pengelolaan data dan riwayat siswa secara terstruktur.',
                    icon: FileText
                }
            ]
        },
        {
            category: 'eval',
            columnTitle: 'Monitoring & Evaluasi',
            modules: [
                {
                    title: 'Presensi Harian Terintegrasi',
                    desc: 'Pencatatan kehadiran siswa dan guru dengan rekapitulasi otomatis.',
                    icon: CalendarCheck
                },
                {
                    title: 'Otomatisasi E-Raport',
                    desc: 'Pengolahan nilai dan pencetakan E-Rapor Kurikulum Merdeka.',
                    icon: Award
                },
                {
                    title: 'Dashboard Eksekutif',
                    desc: 'Statistik, grafik, dan informasi penting untuk pimpinan sekolah.',
                    icon: BarChart3
                }
            ]
        },
        {
            category: 'supervisi',
            columnTitle: 'Supervisi & Laporan',
            modules: [
                {
                    title: 'Bimbingan Konseling (BK)',
                    desc: 'Pencatatan sesi konseling, poin kedisiplinan, dan prestasi siswa.',
                    icon: UserCheck
                },
                {
                    title: 'Ekspor Data & Spreadsheet',
                    desc: 'Ekspor data dalam format Excel & PDF.',
                    icon: FileSpreadsheet
                },
                {
                    title: 'Pengumuman & Broadcast',
                    desc: 'Penyampaian informasi resmi kepada seluruh warga sekolah.',
                    icon: Bell
                }
            ]
        }
    ];

    // Data Panduan Pengguna Per Role
    const roleGuides = {
        siswa: {
            steps: [
                { num: '1', title: 'Masuk ke portal', desc: 'Login menggunakan akun NISN yang telah terdaftar.' },
                { num: '2', title: 'Periksa dashboard', desc: 'Lihat informasi kehadiran, kelas, dan pengumuman.' },
                { num: '3', title: 'Akses e-learning', desc: 'Pelajari materi pembelajaran yang tersedia.' },
                { num: '4', title: 'Kumpulkan tugas', desc: 'Unggah tugas sesuai dengan instruksi guru.' },
                { num: '5', title: 'Ikuti ujian online', desc: 'Kerjakan ujian sesuai jadwal yang ditentukan.' },
                { num: '6', title: 'Lihat E-Rapor', desc: 'Pantau hasil belajar melalui menu rapor.' }
            ]
        },
        guru: {
            steps: [
                { num: '1', title: 'Masuk ke portal', desc: 'Login dengan NIP/Username akun pendidik.' },
                { num: '2', title: 'Input presensi kelas', desc: 'Catat kehadiran harian siswa di kelas ampu.' },
                { num: '3', title: 'Unggah bahan ajar', desc: 'Membagikan modul PDF, PPT & materi pembelajaran.' },
                { num: '4', title: 'Buat & nilai tugas', desc: 'Membuat penugasan dan memberikan umpan balik.' },
                { num: '5', title: 'Jadwalkan ujian CBT', desc: 'Menyusun bank soal & waktu ujian daring.' },
                { num: '6', title: 'Input E-Rapor kelas', desc: 'Memasukkan nilai akhir & mencetak E-Rapor.' }
            ]
        },
        ortu: {
            steps: [
                { num: '1', title: 'Masuk portal wali', desc: 'Login menggunakan akun orang tua murid.' },
                { num: '2', title: 'Pantau kehadiran harian', desc: 'Melihat status presensi anak secara terupdate.' },
                { num: '3', title: 'Cek catatan BK & disiplin', desc: 'Memantau poin kedisiplinan & bimbingan siswa.' },
                { num: '4', title: 'Pantau perkembangan nilai', desc: 'Melihat progres capaian belajar berkala.' },
                { num: '5', title: 'Unduh E-Rapor semester', desc: 'Mendapatkan berkas rapor resmi digital.' },
                { num: '6', title: 'Komunikasi sekolah', desc: 'Menerima broadcast pengumuman resmi.' }
            ]
        },
        admin: {
            steps: [
                { num: '1', title: 'Masuk akun administrator', desc: 'Login dashboard utama pengelola sekolah.' },
                { num: '2', title: 'Kelola master data', desc: 'Input data guru, siswa, rombel & mata pelajaran.' },
                { num: '3', title: 'Atur kalender akademik', desc: 'Konfigurasi tahun ajaran & semester berjalan.' },
                { num: '4', title: 'Supervisi aktivitas KBM', desc: 'Monitoring statistik pembelajaran & presensi.' },
                { num: '5', title: 'Otorisasi E-Rapor', desc: 'Verifikasi & pengesahan cetak rapor sekolah.' },
                { num: '6', title: 'Ekspor rekap data', desc: 'Penarikan file Excel & PDF laporan resmi.' }
            ]
        }
    };

    return (
        <>
            <Head title="UPT SDN 9 Gandangbatu Sillanan — Smart School LMS" />

            <div className="min-h-screen bg-white text-[#142033] font-sans selection:bg-[#8B001F] selection:text-white">
                
                {/* -------------------------------------------------------------
                    1. HEADER / NAVIGATION BAR
                ------------------------------------------------------------- */}
                <header className="sticky top-0 z-50 bg-white border-b border-[#E5EAF0]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                        
                        {/* Brand Identity (Left) */}
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-[#8B001F] flex items-center justify-center text-white shadow-sm shrink-0">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-base font-bold text-[#142033] block leading-tight">
                                    UPT SDN 9 Gandangbatu Sillanan
                                </span>
                                <span className="text-xs text-[#64748B] font-medium block">
                                    Smart School LMS TechSoe
                                </span>
                            </div>
                        </div>

                        {/* Navigation Links (Center) */}
                        <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium text-[#64748B]">
                            <a href="#hero" className="text-[#8B001F] font-semibold">Beranda</a>
                            <a href="#profil" className="hover:text-[#8B001F] transition">Profil Sekolah</a>
                            <a href="#modul" className="hover:text-[#8B001F] transition">Modul Fitur</a>
                            <a href="#panduan" className="hover:text-[#8B001F] transition">Panduan</a>
                            <a href="#keamanan" className="hover:text-[#8B001F] transition">Pengumuman</a>
                        </nav>

                        {/* Actions (Right) */}
                        <div className="hidden sm:flex items-center space-x-3">
                            <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#FFF0F2] text-[#8B001F] text-xs font-semibold border border-[#E5EAF0]">
                                <CalendarCheck className="w-3.5 h-3.5 mr-1 text-[#8B001F]" />
                                T.A. 2026/2027
                                <ChevronDown className="w-3.5 h-3.5 ml-1 text-[#8B001F]" />
                            </div>

                            <Link
                                href={auth?.user ? route('dashboard') : route('login')}
                                className="inline-flex items-center px-5 py-2.5 bg-[#8B001F] hover:bg-[#650019] text-white text-sm font-semibold rounded-full shadow-sm transition duration-150"
                            >
                                <span>Masuk ke Portal</span>
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </div>

                        {/* Mobile Navigation Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-[#64748B] hover:text-[#142033] focus:outline-none"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Drawer */}
                    {mobileMenuOpen && (
                        <div className="lg:hidden bg-white border-b border-[#E5EAF0] px-4 pt-3 pb-6 space-y-3">
                            <nav className="flex flex-col space-y-2 text-sm font-medium text-[#64748B]">
                                <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="py-2 text-[#8B001F] font-semibold">Beranda</a>
                                <a href="#profil" onClick={() => setMobileMenuOpen(false)} className="py-2">Profil Sekolah</a>
                                <a href="#modul" onClick={() => setMobileMenuOpen(false)} className="py-2">Modul Fitur</a>
                                <a href="#panduan" onClick={() => setMobileMenuOpen(false)} className="py-2">Panduan</a>
                                <a href="#keamanan" onClick={() => setMobileMenuOpen(false)} className="py-2">Pengumuman</a>
                            </nav>
                            <div className="pt-2">
                                <Link
                                    href={auth?.user ? route('dashboard') : route('login')}
                                    className="w-full inline-flex items-center justify-center px-5 py-2.5 bg-[#8B001F] text-white text-sm font-semibold rounded-full"
                                >
                                    <span>Masuk ke Portal</span>
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </div>
                        </div>
                    )}
                </header>

                {/* -------------------------------------------------------------
                    2. HERO SECTION — VISUAL UTAMA (42% Left, 58% Right)
                ------------------------------------------------------------- */}
                <section id="hero" className="py-12 sm:py-20 bg-white border-b border-[#E5EAF0]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                            
                            {/* Left Content (5 Cols ~ 42%) */}
                            <div className="lg:col-span-5 space-y-6">
                                
                                {/* Eyebrow Text */}
                                <div className="inline-flex items-center text-[#8B001F] text-xs font-bold uppercase tracking-wider">
                                    <span>Sistem Informasi Pembelajaran & Akademik Terpadu</span>
                                </div>

                                {/* Main Headline */}
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#142033] tracking-tight leading-[1.15]">
                                    Pembelajaran dan<br />
                                    Tata Kelola Sekolah<br />
                                    dalam <span className="text-[#8B001F]">Satu Ekosistem.</span>
                                </h1>

                                {/* Description */}
                                <p className="text-base text-[#64748B] leading-relaxed">
                                    Ekosistem terintegrasi yang menggabungkan pembelajaran daring modern dengan tata kelola administrasi akademik, buku induk siswa, presensi harian, hingga otomatisasi pencetakan E-Rapor.
                                </p>

                                {/* Action Buttons */}
                                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                    <Link
                                        href={auth?.user ? route('dashboard') : route('login')}
                                        className="inline-flex items-center justify-center px-6 py-3.5 bg-[#8B001F] hover:bg-[#650019] text-white text-sm font-bold rounded-xl shadow-md transition duration-150"
                                    >
                                        <span>Masuk ke Portal Akademik</span>
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                    <a
                                        href="#modul"
                                        className="inline-flex items-center justify-center px-6 py-3.5 bg-white border border-[#E5EAF0] hover:bg-slate-50 text-[#142033] text-sm font-semibold rounded-xl transition"
                                    >
                                        <Compass className="w-4 h-4 mr-2 text-[#64748B]" />
                                        Jelajahi Fitur
                                    </a>
                                </div>

                                {/* Supporting Information Tags */}
                                <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#64748B] border-t border-[#E5EAF0]">
                                    <div className="flex items-center space-x-1.5">
                                        <School className="w-4 h-4 text-[#8B001F]" />
                                        <span>Kelas 1 – Kelas 6</span>
                                    </div>
                                    <div className="flex items-center space-x-1.5">
                                        <MapPin className="w-4 h-4 text-[#8B001F]" />
                                        <span>Gandangbatu Sillanan, Tana Toraja, Sulsel</span>
                                    </div>
                                </div>

                            </div>

                            {/* Right Visual (7 Cols ~ 58%) — Uses /images/dashboard_hero.png */}
                            <div className="lg:col-span-7 flex justify-center lg:justify-end">
                                <div className="relative w-full max-w-2xl">
                                    <img 
                                        src="/images/dashboard_hero.png" 
                                        alt="Smart School LMS UPT SDN 9 Gandangbatu Sillanan Dashboard Mockup" 
                                        className="w-full h-auto object-contain drop-shadow-xl"
                                        loading="eager"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* -------------------------------------------------------------
                    3. SCHOOL PROFILE SECTION (MENGENAL LEBIH DEKAT)
                ------------------------------------------------------------- */}
                <section id="profil" className="py-16 sm:py-20 bg-white border-b border-[#E5EAF0]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
                            
                            {/* Left Column: Text & Horizontal Metadata Row (4 Cols) */}
                            <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#8B001F]">
                                        <Building2 className="w-4 h-4 mr-1.5" />
                                        MENGENAL LEBIH DEKAT
                                    </div>

                                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142033] tracking-tight leading-tight">
                                        UPT SDN 9<br />Gandangbatu Sillanan
                                    </h2>

                                    <p className="text-sm text-[#64748B] leading-relaxed">
                                        UPT SDN 9 Gandangbatu Sillanan adalah satuan pendidikan dasar yang berkomitmen mewujudkan generasi peserta didik yang berakhlak mulia, cerdas, berkarakter kebangsaan, serta siap menguasai teknologi informasi di era digital.
                                    </p>
                                </div>

                                {/* Horizontal Bottom Metadata Items with vertical dividers */}
                                <div className="pt-4 border-t border-[#E5EAF0] flex flex-wrap items-center gap-3 text-xs">
                                    {/* NPSN */}
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-[#FFF0F2] text-[#8B001F] flex items-center justify-center shrink-0">
                                            <School className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-[#64748B] font-semibold block uppercase leading-none">NPSN</span>
                                            <span className="text-xs font-bold text-[#142033]">40307044</span>
                                        </div>
                                    </div>

                                    <div className="hidden sm:block h-7 w-px bg-slate-200"></div>

                                    {/* Kepala Sekolah */}
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-[#FFF0F2] text-[#8B001F] flex items-center justify-center shrink-0">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-[#64748B] font-semibold block uppercase leading-none">Kepala Sekolah</span>
                                            <span className="text-xs font-bold text-[#142033]">Hendrika Genti, S.Pd.SD.</span>
                                        </div>
                                    </div>

                                    <div className="hidden sm:block h-7 w-px bg-slate-200"></div>

                                    {/* Lokasi */}
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-[#FFF0F2] text-[#8B001F] flex items-center justify-center shrink-0">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-[#64748B] font-semibold block uppercase leading-none">Lokasi</span>
                                            <span className="text-xs font-bold text-[#142033] leading-tight block">Kec. Gandangbatu Sillanan,<br />Kab. Tana Toraja, Sulawesi Selatan</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Middle Column: Real Photo of SD (/images/sdnfoto.png) (4 Cols with object-right) */}
                            <div className="lg:col-span-4 flex items-center">
                                <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm border border-[#E5EAF0]">
                                    <img 
                                        src="/images/sdnfoto.png" 
                                        alt="Gedung UPT SDN 9 Gandangbatu Sillanan" 
                                        className="w-full h-full object-cover object-right min-h-[320px] max-h-[440px] rounded-2xl"
                                    />
                                </div>
                            </div>

                            {/* Right Column: Integrated Visi & Misi Card Container (4 Cols) */}
                            <div className="lg:col-span-4 flex items-center">
                                <div className="bg-white w-full rounded-2xl border border-[#E5EAF0] shadow-sm p-5 sm:p-6 space-y-5 divide-y divide-[#E5EAF0]">
                                    
                                    {/* Visi Block */}
                                    <div className="space-y-2.5">
                                        <div className="flex items-center space-x-2.5">
                                            <div className="w-8 h-8 rounded-xl bg-[#FFF0F2] text-[#8B001F] flex items-center justify-center border border-[#E5EAF0] shrink-0">
                                                <Award className="w-4 h-4" />
                                            </div>
                                            <h3 className="text-sm font-bold text-[#142033]">Visi Sekolah</h3>
                                        </div>
                                        <p className="text-xs text-[#64748B] italic leading-relaxed pt-1">
                                            "Mewujudkan Generasi Peserta Didik yang Berakhlak Mulia, Cerdas, Berkarakter Kebangsaan, serta Siap Menguasai Teknologi Informasi di Era Digital."
                                        </p>
                                    </div>

                                    {/* Misi Block */}
                                    <div className="pt-4 space-y-2.5">
                                        <div className="flex items-center space-x-2.5">
                                            <div className="w-8 h-8 rounded-xl bg-[#FFF0F2] text-[#8B001F] flex items-center justify-center border border-[#E5EAF0] shrink-0">
                                                <ListCheck className="w-4 h-4" />
                                            </div>
                                            <h3 className="text-sm font-bold text-[#142033]">Misi Sekolah</h3>
                                        </div>

                                        <ul className="space-y-2 text-xs text-[#142033]">
                                            <li className="flex items-start space-x-2">
                                                <Check className="w-3.5 h-3.5 text-[#8B001F] mt-0.5 shrink-0" />
                                                <span>Menyelenggarakan pembelajaran yang berkualitas.</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <Check className="w-3.5 h-3.5 text-[#8B001F] mt-0.5 shrink-0" />
                                                <span>Membentuk karakter dan akhlak mulia.</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <Check className="w-3.5 h-3.5 text-[#8B001F] mt-0.5 shrink-0" />
                                                <span>Mengembangkan potensi peserta didik.</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <Check className="w-3.5 h-3.5 text-[#8B001F] mt-0.5 shrink-0" />
                                                <span>Memanfaatkan teknologi informasi dalam pendidikan.</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <Check className="w-3.5 h-3.5 text-[#8B001F] mt-0.5 shrink-0" />
                                                <span>Mewujudkan lingkungan sekolah yang aman dan kondusif.</span>
                                            </li>
                                        </ul>
                                    </div>

                                </div>
                            </div>

                        </div>

                    </div>
                </section>

                {/* -------------------------------------------------------------
                    4. INTEGRASI SISTEM (SOLUSI KOMPREHENSIF)
                ------------------------------------------------------------- */}
                <section className="py-16 bg-white border-b border-[#E5EAF0]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                        
                        <div className="text-center max-w-2xl mx-auto space-y-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#8B001F]">INTEGRASI DALAM SATU PLATFORM</span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">
                                Solusi Komprehensif untuk Ekosistem Sekolah
                            </h2>
                            <p className="text-xs sm:text-sm text-[#64748B]">
                                Menghubungkan seluruh aktivitas pembelajaran dan administrasi dalam satu basis data terpusat MySQL 8.0.
                            </p>
                        </div>

                        {/* 4 Feature List Columns */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            
                            <div className="bg-[#F7F8FA] p-6 rounded-2xl border border-[#E5EAF0] space-y-3 hover:border-[#8B001F]/30 transition">
                                <div className="w-10 h-10 rounded-xl bg-[#FFF0F2] text-[#8B001F] flex items-center justify-center border border-[#E5EAF0]">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <h3 className="text-base font-bold text-[#142033]">Pembelajaran Digital</h3>
                                <p className="text-xs text-[#64748B] leading-relaxed">
                                    LMS, bahan ajar, tugas, asesmen, dan ujian online dalam satu sistem terintegrasi.
                                </p>
                            </div>

                            <div className="bg-[#F7F8FA] p-6 rounded-2xl border border-[#E5EAF0] space-y-3 hover:border-[#8B001F]/30 transition">
                                <div className="w-10 h-10 rounded-xl bg-[#FFF0F2] text-[#8B001F] flex items-center justify-center border border-[#E5EAF0]">
                                    <School className="w-5 h-5" />
                                </div>
                                <h3 className="text-base font-bold text-[#142033]">Administrasi Akademik</h3>
                                <p className="text-xs text-[#64748B] leading-relaxed">
                                    Master data, buku induk siswa, kalender akademik, dan otomatisasi E-Rapor.
                                </p>
                            </div>

                            <div className="bg-[#F7F8FA] p-6 rounded-2xl border border-[#E5EAF0] space-y-3 hover:border-[#8B001F]/30 transition">
                                <div className="w-10 h-10 rounded-xl bg-[#FFF0F2] text-[#8B001F] flex items-center justify-center border border-[#E5EAF0]">
                                    <CalendarCheck className="w-5 h-5" />
                                </div>
                                <h3 className="text-base font-bold text-[#142033]">Monitoring & Evaluasi</h3>
                                <p className="text-xs text-[#64748B] leading-relaxed">
                                    Presensi harian, rekapitulasi kehadiran, penilaian, dan dashboard eksekutif.
                                </p>
                            </div>

                            <div className="bg-[#F7F8FA] p-6 rounded-2xl border border-[#E5EAF0] space-y-3 hover:border-[#8B001F]/30 transition">
                                <div className="w-10 h-10 rounded-xl bg-[#FFF0F2] text-[#8B001F] flex items-center justify-center border border-[#E5EAF0]">
                                    <UserCheck className="w-5 h-5" />
                                </div>
                                <h3 className="text-base font-bold text-[#142033]">Supervisi & Pendampingan</h3>
                                <p className="text-xs text-[#64748B] leading-relaxed">
                                    Manajemen BK, pencatatan prestasi, dan pemantauan perkembangan siswa.
                                </p>
                            </div>

                        </div>

                    </div>
                </section>

                {/* -------------------------------------------------------------
                    5. MODUL FITUR — 12 MODUL TERINTEGRASI
                ------------------------------------------------------------- */}
                <section id="modul" className="py-16 sm:py-20 bg-[#F7F8FA] border-b border-[#E5EAF0]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                        
                        <div className="text-center max-w-2xl mx-auto space-y-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#8B001F]">FITUR UTAMA SISTEM</span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">
                                12 Modul Terintegrasi Platform LMS
                            </h2>
                            <p className="text-xs sm:text-sm text-[#64748B]">
                                Seluruh modul dirancang untuk mendukung proses pembelajaran dan administrasi sekolah secara menyeluruh.
                            </p>
                        </div>

                        {/* Category Filter Tabs */}
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <button
                                onClick={() => setActiveModuleTab('all')}
                                className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                                    activeModuleTab === 'all'
                                        ? 'bg-[#8B001F] text-white shadow-sm'
                                        : 'bg-white text-[#64748B] hover:bg-slate-100 border border-[#E5EAF0]'
                                }`}
                            >
                                Semua Modul
                            </button>

                            <button
                                onClick={() => setActiveModuleTab('learning')}
                                className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                                    activeModuleTab === 'learning'
                                        ? 'bg-[#8B001F] text-white shadow-sm'
                                        : 'bg-white text-[#64748B] hover:bg-slate-100 border border-[#E5EAF0]'
                                }`}
                            >
                                Pembelajaran Digital
                            </button>

                            <button
                                onClick={() => setActiveModuleTab('admin')}
                                className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                                    activeModuleTab === 'admin'
                                        ? 'bg-[#8B001F] text-white shadow-sm'
                                        : 'bg-white text-[#64748B] hover:bg-slate-100 border border-[#E5EAF0]'
                                }`}
                            >
                                Administrasi Akademik
                            </button>

                            <button
                                onClick={() => setActiveModuleTab('eval')}
                                className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                                    activeModuleTab === 'eval'
                                        ? 'bg-[#8B001F] text-white shadow-sm'
                                        : 'bg-white text-[#64748B] hover:bg-slate-100 border border-[#E5EAF0]'
                                }`}
                            >
                                Monitoring & Evaluasi
                            </button>

                            <button
                                onClick={() => setActiveModuleTab('supervisi')}
                                className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                                    activeModuleTab === 'supervisi'
                                        ? 'bg-[#8B001F] text-white shadow-sm'
                                        : 'bg-white text-[#64748B] hover:bg-slate-100 border border-[#E5EAF0]'
                                }`}
                            >
                                Supervisi & Laporan
                            </button>
                        </div>

                        {/* 4 Column Cards Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                            {moduleColumns
                                .filter(col => activeModuleTab === 'all' || col.category === activeModuleTab)
                                .map((col, idx) => (
                                    <div key={idx} className="bg-white p-5 rounded-2xl border border-[#E5EAF0] shadow-sm space-y-4">
                                        <div className="flex items-center space-x-2 text-[#8B001F] pb-2 border-b border-slate-100">
                                            <Layers className="w-4 h-4" />
                                            <h3 className="text-sm font-bold text-[#142033]">{col.columnTitle}</h3>
                                        </div>

                                        <div className="space-y-4">
                                            {col.modules.map((mod, mIdx) => {
                                                const IconC = mod.icon;
                                                return (
                                                    <div key={mIdx} className="space-y-1">
                                                        <div className="flex items-start space-x-2.5">
                                                            <div className="w-7 h-7 rounded-lg bg-[#FFF0F2] text-[#8B001F] flex items-center justify-center shrink-0 mt-0.5 border border-[#E5EAF0]">
                                                                <IconC className="w-3.5 h-3.5" />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-xs font-bold text-[#142033]">{mod.title}</h4>
                                                                <p className="text-[11px] text-[#64748B] leading-snug">{mod.desc}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                        </div>

                    </div>
                </section>

                {/* -------------------------------------------------------------
                    6. PANDUAN PENGGUNA BERDASARKAN PERAN
                ------------------------------------------------------------- */}
                <section id="panduan" className="py-16 sm:py-20 bg-white border-b border-[#E5EAF0]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                        
                        <div className="text-center max-w-2xl mx-auto space-y-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#8B001F]">AKSES MUDAH UNTUK SEMUA</span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">
                                Panduan Penggunaan Berdasarkan Peran
                            </h2>
                            <p className="text-xs sm:text-sm text-[#64748B]">
                                Ikuti panduan singkat sesuai peran Anda untuk mulai menggunakan sistem dengan optimal.
                            </p>
                        </div>

                        {/* Role Selector Tabs */}
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <button
                                onClick={() => setActiveRoleTab('siswa')}
                                className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${
                                    activeRoleTab === 'siswa'
                                        ? 'bg-[#8B001F] text-white shadow-sm'
                                        : 'bg-slate-100 text-[#64748B] hover:bg-slate-200'
                                }`}
                            >
                                Peserta Didik (Siswa)
                            </button>

                            <button
                                onClick={() => setActiveRoleTab('guru')}
                                className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${
                                    activeRoleTab === 'guru'
                                        ? 'bg-[#8B001F] text-white shadow-sm'
                                        : 'bg-slate-100 text-[#64748B] hover:bg-slate-200'
                                }`}
                            >
                                Guru
                            </button>

                            <button
                                onClick={() => setActiveRoleTab('ortu')}
                                className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${
                                    activeRoleTab === 'ortu'
                                        ? 'bg-[#8B001F] text-white shadow-sm'
                                        : 'bg-slate-100 text-[#64748B] hover:bg-slate-200'
                                }`}
                            >
                                Orang Tua
                            </button>

                            <button
                                onClick={() => setActiveRoleTab('admin')}
                                className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${
                                    activeRoleTab === 'admin'
                                        ? 'bg-[#8B001F] text-white shadow-sm'
                                        : 'bg-slate-100 text-[#64748B] hover:bg-slate-200'
                                }`}
                            >
                                Admin & Kepala Sekolah
                            </button>
                        </div>

                        {/* Layout Horizontal Steps + Phone Mockup */}
                        <div className="bg-[#F7F8FA] p-6 sm:p-8 rounded-3xl border border-[#E5EAF0]">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                                
                                {/* 6 Numbered Steps Grid (7 Cols) */}
                                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {roleGuides[activeRoleTab].steps.map((step) => (
                                        <div key={step.num} className="bg-white p-4 rounded-xl border border-[#E5EAF0] shadow-sm flex items-start space-x-3">
                                            <div className="w-7 h-7 rounded-full bg-[#FFF0F2] text-[#8B001F] font-bold text-xs flex items-center justify-center shrink-0 border border-[#E5EAF0]">
                                                {step.num}
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-[#142033]">{step.title}</h4>
                                                <p className="text-[11px] text-[#64748B] leading-snug mt-0.5">{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Smartphone Mockup Visual (5 Cols) */}
                                <div className="lg:col-span-5 flex justify-center">
                                    <div className="relative max-w-[260px] bg-slate-900 p-3 rounded-[36px] shadow-2xl border-4 border-slate-800">
                                        <div className="bg-white rounded-[26px] overflow-hidden text-[#142033] text-xs">
                                            {/* Screen Header */}
                                            <div className="bg-slate-50 p-4 border-b border-slate-100 space-y-2 text-center">
                                                <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto"></div>
                                                <h5 className="font-bold text-[#142033] text-xs pt-1">Warta & Pengumuman Sekolah</h5>
                                                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#8B001F] text-white text-[10px] font-semibold">
                                                    Sosialisasi LMS
                                                </span>
                                            </div>

                                            {/* Screen Body */}
                                            <div className="p-4 space-y-3 bg-white">
                                                <div className="p-3 bg-[#FFF0F2] rounded-xl border border-[#E5EAF0] space-y-1">
                                                    <span className="text-[10px] font-bold text-[#8B001F]">Pengumuman Baru</span>
                                                    <p className="text-[11px] text-slate-700 leading-tight">
                                                        Selamat Datang di Smart School LMS UPT SDN 9 Gandangbatu Sillanan.
                                                    </p>
                                                </div>

                                                <div className="space-y-1.5 pt-1">
                                                    <div className="h-2 bg-slate-100 rounded w-full"></div>
                                                    <div className="h-2 bg-slate-100 rounded w-4/5"></div>
                                                    <div className="h-2 bg-slate-100 rounded w-2/3"></div>
                                                </div>

                                                <div className="pt-2 text-center">
                                                    <button className="px-3 py-1.5 bg-[#8B001F] text-white rounded-lg text-[10px] font-bold w-full">
                                                        Masuk Portal Aplikasi
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </section>

                {/* -------------------------------------------------------------
                    7. KEAMANAN DATA AKADEMIK TERSTANDARISASI
                ------------------------------------------------------------- */}
                <section id="keamanan" className="py-16 sm:py-20 bg-[#F7F8FA] border-b border-[#E5EAF0]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                        
                        <div className="text-center max-w-2xl mx-auto space-y-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#8B001F]">KEPERCAYAAN UNTUK MASA DEPAN</span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">
                                Keamanan Data Akademik Terstandarisasi
                            </h2>
                            <p className="text-xs sm:text-sm text-[#64748B]">
                                Sistem dilengkapi dengan standar keamanan modern untuk melindungi data sekolah.
                            </p>
                        </div>

                        {/* 5 Points Horizontal Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            
                            <div className="bg-white p-4 rounded-xl border border-[#E5EAF0] shadow-sm space-y-2">
                                <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#059669] flex items-center justify-center border border-emerald-200">
                                    <LockKeyhole className="w-4 h-4" />
                                </div>
                                <h3 className="text-xs font-bold text-[#142033]">Enkripsi SSL TLS 1.3</h3>
                                <p className="text-[11px] text-[#64748B] leading-snug">
                                    Komunikasi data terenkripsi untuk keamanan akses.
                                </p>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-[#E5EAF0] shadow-sm space-y-2">
                                <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#059669] flex items-center justify-center border border-emerald-200">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                                <h3 className="text-xs font-bold text-[#142033]">Role-Based Access Control</h3>
                                <p className="text-[11px] text-[#64748B] leading-snug">
                                    Pembatasan hak akses sesuai peran pengguna.
                                </p>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-[#E5EAF0] shadow-sm space-y-2">
                                <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#059669] flex items-center justify-center border border-emerald-200">
                                    <FileCheck className="w-4 h-4" />
                                </div>
                                <h3 className="text-xs font-bold text-[#142033]">Validasi Data Berlapis</h3>
                                <p className="text-[11px] text-[#64748B] leading-snug">
                                    Sanitasi input untuk menjaga integritas data.
                                </p>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-[#E5EAF0] shadow-sm space-y-2">
                                <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#059669] flex items-center justify-center border border-emerald-200">
                                    <Activity className="w-4 h-4" />
                                </div>
                                <h3 className="text-xs font-bold text-[#142033]">Log Aktivitas Sistem</h3>
                                <p className="text-[11px] text-[#64748B] leading-snug">
                                    Pencatatan aktivitas pengguna secara otomatis.
                                </p>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-[#E5EAF0] shadow-sm space-y-2">
                                <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#059669] flex items-center justify-center border border-emerald-200">
                                    <HardDrive className="w-4 h-4" />
                                </div>
                                <h3 className="text-xs font-bold text-[#142033]">Backup Berkala</h3>
                                <p className="text-[11px] text-[#64748B] leading-snug">
                                    Pencadangan data secara rutin setiap malam.
                                </p>
                            </div>

                        </div>

                    </div>
                </section>

                {/* -------------------------------------------------------------
                    8. FINAL CTA BANNER (BURGUNDY SOLID)
                ------------------------------------------------------------- */}
                <section className="bg-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-[#8B001F] rounded-2xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
                            
                            <div className="space-y-2 max-w-2xl">
                                <h2 className="text-xl sm:text-2xl font-bold">
                                    Siap Mengakses Layanan Akademik Digital Sekolah?
                                </h2>
                                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                                    Masuk ke portal untuk memulai pembelajaran, mengelola administrasi, dan mengakses seluruh fitur Smart School LMS TechSoe.
                                </p>
                            </div>

                            <Link
                                href={auth?.user ? route('dashboard') : route('login')}
                                className="inline-flex items-center px-6 py-3 bg-white text-[#8B001F] hover:bg-slate-100 text-xs font-bold rounded-lg transition whitespace-nowrap shadow-sm shrink-0"
                            >
                                <span>Masuk ke Portal Sekarang</span>
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>

                        </div>
                    </div>
                </section>

                {/* -------------------------------------------------------------
                    9. FOOTER SECTION
                ------------------------------------------------------------- */}
                <footer className="bg-white border-t border-[#E5EAF0] py-10 text-[#64748B] text-xs">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-100">
                            
                            {/* Brand info */}
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <div className="w-7 h-7 rounded-lg bg-[#8B001F] flex items-center justify-center text-white shrink-0">
                                        <GraduationCap className="w-4 h-4" />
                                    </div>
                                    <span className="font-bold text-[#142033] text-sm">
                                        UPT SDN 9 Gandangbatu Sillanan
                                    </span>
                                </div>
                                <p className="text-[11px] text-[#64748B] leading-relaxed">
                                    Sistem informasi pembelajaran dan administrasi akademik UPT SDN 9 Gandangbatu Sillanan, Kecamatan Gandangbatu Sillanan, Kabupaten Tana Toraja, Sulawesi Selatan.
                                </p>
                            </div>

                            {/* Navigasi */}
                            <div className="space-y-2">
                                <h4 className="font-bold text-[#142033] text-xs">Navigasi</h4>
                                <ul className="space-y-1 text-[#64748B]">
                                    <li><a href="#hero" className="hover:text-[#8B001F]">Beranda</a></li>
                                    <li><a href="#profil" className="hover:text-[#8B001F]">Profil Sekolah</a></li>
                                    <li><a href="#modul" className="hover:text-[#8B001F]">Modul Fitur</a></li>
                                    <li><a href="#panduan" className="hover:text-[#8B001F]">Panduan Pengguna</a></li>
                                    <li><a href="#keamanan" className="hover:text-[#8B001F]">Pengumuman</a></li>
                                </ul>
                            </div>

                            {/* Kontak */}
                            <div className="space-y-2">
                                <h4 className="font-bold text-[#142033] text-xs">Kontak</h4>
                                <div className="flex items-start space-x-1.5 text-[#64748B]">
                                    <MapPin className="w-3.5 h-3.5 text-[#8B001F] shrink-0 mt-0.5" />
                                    <span>Gandangbatu Sillanan, Tana Toraja, Sulawesi Selatan.</span>
                                </div>
                            </div>

                            {/* Dev Credits */}
                            <div className="space-y-2">
                                <h4 className="font-bold text-[#142033] text-xs">Dikembangkan oleh</h4>
                                <div className="space-y-1">
                                    <span className="font-bold text-[#142033] text-sm block">TechSoe</span>
                                    <span className="text-[11px] text-[#64748B] block">Teknologi Inovasi Soedirman.</span>
                                </div>
                            </div>

                        </div>

                        {/* Bottom Copyright */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#64748B]">
                            <div>
                                © 2026 UPT SDN 9 Gandangbatu Sillanan. Seluruh Hak Cipta Dilindungi.
                            </div>
                            <div className="flex items-center space-x-3">
                                <a href="#" className="hover:text-[#142033]">Kebijakan Privasi</a>
                                <span>|</span>
                                <a href="#" className="hover:text-[#142033]">Syarat Penggunaan</a>
                            </div>
                        </div>

                    </div>
                </footer>

            </div>
        </>
    );
}
