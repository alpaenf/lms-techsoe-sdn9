import React, { useState, useEffect } from 'react';
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
    const [activeSection, setActiveSection] = useState('hero');

    const navItems = [
        { id: 'hero', label: 'Beranda' },
        { id: 'profil', label: 'Profil Sekolah' },
        { id: 'modul', label: 'Modul Fitur' },
        { id: 'panduan', label: 'Panduan' },
        { id: 'keamanan', label: 'Pengumuman' },
    ];

    useEffect(() => {
        // Enable smooth scrolling globally
        document.documentElement.style.scrollBehavior = 'smooth';

        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollPosition = window.scrollY + 140;

                    for (let i = navItems.length - 1; i >= 0; i--) {
                        const section = document.getElementById(navItems[i].id);
                        if (section) {
                            const top = section.offsetTop;
                            if (scrollPosition >= top) {
                                setActiveSection(navItems[i].id);
                                break;
                            }
                        }
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e, id) => {
        e.preventDefault();
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        window.history.pushState(null, '', `#${id}`);
    };

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
                            <img 
                                src="/logo.webp" 
                                alt="Logo UPT SDN 9 Gandangbatu Sillanan" 
                                className="w-10 h-10 sm:w-11 sm:h-11 object-contain shrink-0" 
                            />
                            <div>
                                <span className="text-base font-bold text-[#142033] block leading-tight">
                                    UPT SDN 9 Gandangbatu Sillanan
                                </span>
                                <span className="text-xs text-[#64748B] font-medium block">
                                    Smart School LMS
                                </span>
                            </div>
                        </div>

                        {/* Navigation Links (Center) */}
                        <nav className="hidden lg:flex items-center space-x-7 text-sm font-semibold">
                            {navItems.map((item) => {
                                const isActive = activeSection === item.id;
                                return (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        onClick={(e) => handleNavClick(e, item.id)}
                                        className={`transition-colors duration-300 ease-in-out relative py-1.5 ${
                                            isActive
                                                ? 'text-[#8B001F]'
                                                : 'text-[#64748B] hover:text-[#8B001F]'
                                        }`}
                                    >
                                        {item.label}
                                        <span 
                                            className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B001F] rounded-full transition-all duration-300 ease-in-out origin-left ${
                                                isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                                            }`} 
                                        />
                                    </a>
                                );
                            })}
                        </nav>

                        {/* Actions (Right) */}
                        <div className="hidden sm:flex items-center space-x-3">
                            <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#F7F8FA] text-[#64748B] text-xs font-semibold border border-[#E5EAF0]">
                                <CalendarCheck className="w-3.5 h-3.5 mr-1.5 text-[#64748B]" />
                                T.A. 2026/2027
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
                            <nav className="flex flex-col space-y-1.5 text-sm font-semibold">
                                {navItems.map((item) => {
                                    const isActive = activeSection === item.id;
                                    return (
                                        <a
                                            key={item.id}
                                            href={`#${item.id}`}
                                            onClick={(e) => {
                                                setMobileMenuOpen(false);
                                                handleNavClick(e, item.id);
                                            }}
                                            className={`py-2 px-3 rounded-xl transition-all duration-300 ease-in-out ${
                                                isActive
                                                    ? 'bg-[#FFF0F2] text-[#8B001F]'
                                                    : 'text-[#64748B] hover:bg-slate-50'
                                            }`}
                                        >
                                            {item.label}
                                        </a>
                                    );
                                })}
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
                    2. HERO SECTION — VISUAL UTAMA (50% Left, 50% Right)
                ------------------------------------------------------------- */}
                <section id="hero" className="py-12 sm:py-20 bg-white border-b border-[#E5EAF0]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                            
                            {/* Left Content */}
                            <div className="lg:col-span-6 space-y-6">
                                
                                {/* Eyebrow Text */}
                                <div className="inline-flex items-center text-[#8B001F] text-xs sm:text-sm font-bold uppercase tracking-wider">
                                    <span>Sistem Informasi Pembelajaran & Akademik Terpadu</span>
                                </div>

                                {/* Main Headline — Block lines with explicit vertical spacing */}
                                <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-extrabold text-[#142033] tracking-tight max-w-xl">
                                    <span className="block">Pembelajaran dan</span>
                                    <span className="block mt-2 sm:mt-3">Tata Kelola Sekolah</span>
                                    <span className="block mt-2 sm:mt-3">dalam <span className="text-[#8B001F]">Satu Ekosistem.</span></span>
                                </h1>

                                {/* Description — Clean 3-line paragraph wrap */}
                                <p className="text-base sm:text-[17px] text-[#64748B] leading-relaxed max-w-xl pt-1">
                                    Ekosistem terintegrasi yang menggabungkan pembelajaran daring modern dengan tata kelola administrasi akademik, buku induk siswa, presensi harian, hingga otomatisasi pencetakan E-Rapor.
                                </p>

                                {/* Action Buttons */}
                                <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
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
                                <div className="pt-5 flex flex-wrap items-center gap-6 text-xs sm:text-sm font-semibold text-[#64748B] border-t border-[#E5EAF0]">
                                    <div className="flex items-center space-x-2">
                                        <School className="w-4 h-4 text-[#8B001F]" />
                                        <span>Kelas 1 – Kelas 6</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="w-4 h-4 text-[#8B001F]" />
                                        <span>Gandangbatu Sillanan, Tana Toraja, Sulsel</span>
                                    </div>
                                </div>

                            </div>

                            {/* Right Visual — Uses /images/herohiasan.webp (Enlarged Leftward + Aligned Right) */}
                            <div className="lg:col-span-6 flex justify-center lg:justify-end relative">
                                <div className="relative w-full max-w-2xl lg:max-w-none lg:w-[138%] xl:w-[148%] lg:-ml-18 xl:-ml-28 lg:mr-0 ml-auto">
                                    
                                    {/* Soft Ambient Bottom Shadow */}
                                    <div className="absolute -bottom-4 sm:-bottom-6 left-[5%] right-[5%] h-10 sm:h-14 bg-black/25 blur-2xl rounded-full pointer-events-none transform scale-y-60"></div>
                                    
                                    {/* Secondary Subtle Burgundy Glow behind visual */}
                                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[70%] h-14 bg-[#8B001F]/15 blur-3xl rounded-full pointer-events-none"></div>

                                    <img 
                                        src="/images/herohiasan.webp" 
                                        alt="Smart School LMS UPT SDN 9 Gandangbatu Sillanan Dashboard Mockup" 
                                        className="relative z-10 w-full h-auto object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.18)]"
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

                            {/* Middle Column: Real Photo of SD (/images/sdnfoto.webp) (4 Cols with object-right) */}
                            <div className="lg:col-span-4 flex items-center">
                                <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm border border-[#E5EAF0]">
                                    <img 
                                        src="/images/sdnfoto.webp" 
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

                        {/* Layout 2-Column White Step Cards + Half Phone Mockup */}
                        <div className="bg-[#F7F8FA] p-6 sm:p-8 rounded-3xl border border-[#E5EAF0] overflow-hidden relative">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[280px]">
                                
                                {/* 2-Column White Cards Grid (8 Cols) — Strictly determines parent card height */}
                                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                    {roleGuides[activeRoleTab].steps.map((step) => (
                                        <div key={step.num} className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5EAF0] shadow-sm flex items-start space-x-3.5">
                                            <div className="w-8 h-8 rounded-full bg-[#FFF0F2] text-[#8B001F] font-extrabold text-xs sm:text-sm flex items-center justify-center shrink-0 border border-[#E5EAF0]">
                                                {step.num}
                                            </div>
                                            <div>
                                                <h4 className="text-xs sm:text-sm font-bold text-[#142033]">{step.title}</h4>
                                                <p className="text-[11px] sm:text-xs text-[#64748B] leading-relaxed mt-1">{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Smartphone Mockup Visual (4 Cols) — Phone image lowered downwards (Card untouched) */}
                                <div className="lg:col-span-4 relative self-stretch hidden lg:block">
                                    <div className="absolute -bottom-32 xl:-bottom-36 right-0 left-0 flex justify-center items-end pointer-events-none">
                                        <div className="w-[310px] xl:w-[340px] max-w-none translate-y-14">
                                            <img 
                                                src="/images/mokuphp.webp" 
                                                alt="Smart School LMS UPT SDN 9 Gandangbatu Sillanan Mobile App Mockup" 
                                                className="w-full h-auto object-contain drop-shadow-2xl"
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile Phone Visual Fallback */}
                                <div className="lg:hidden flex justify-center pt-2">
                                    <div className="max-w-[240px]">
                                        <img 
                                            src="/images/mokuphp.webp" 
                                            alt="Smart School LMS UPT SDN 9 Gandangbatu Sillanan Mobile App Mockup" 
                                            className="w-full h-auto object-contain drop-shadow-xl"
                                            loading="lazy"
                                        />
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
                                    <img 
                                        src="/logo.webp" 
                                        alt="Logo UPT SDN 9 Gandangbatu Sillanan" 
                                        className="w-8 h-8 object-contain shrink-0" 
                                    />
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
