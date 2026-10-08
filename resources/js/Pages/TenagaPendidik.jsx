import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    Users, 
    Search, 
    GraduationCap, 
    Award, 
    School, 
    Mail, 
    MapPin, 
    Phone, 
    ArrowRight, 
    CalendarCheck, 
    ChevronDown, 
    Menu, 
    X, 
    Building2,
    CheckCircle2,
    ExternalLink,
    UserCheck,
    BookOpen
} from 'lucide-react';

export default function TenagaPendidik({ auth, teachers = [] }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Filter teachers
    const filteredTeachers = teachers.filter((t) => {
        const matchesSearch = 
            (t.full_name && t.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (t.nip && t.nip.includes(searchQuery));
        
        const matchesStatus = 
            statusFilter === 'all' || 
            (statusFilter === 'pns' && t.employment_status === 'PNS') ||
            (statusFilter === 'pppk' && t.employment_status === 'PPPK') ||
            (statusFilter === 'gtt' && (t.employment_status === 'GTT' || t.employment_status === 'Honorer')) ||
            (statusFilter === 'pimpinan' && (t.role === 'pimpinan' || t.role === 'bk'));

        return matchesSearch && matchesStatus;
    });

    const totalTeachers = teachers.length;
    const totalPNS = teachers.filter(t => t.employment_status === 'PNS').length;
    const totalPPPK = teachers.filter(t => t.employment_status === 'PPPK').length;
    const totalGTT = teachers.filter(t => t.employment_status === 'GTT' || t.employment_status === 'Honorer').length;

    return (
        <>
            <Head title="Tenaga Pendidik & Kependidikan - UPT SDN 9 Gandangbatu Sillanan" />

            <div className="min-h-screen bg-[#F7F8FA] text-[#142033] font-sans selection:bg-[#8B001F] selection:text-white flex flex-col justify-between">
                
                {/* -------------------------------------------------------------
                    1. HEADER / NAVIGATION BAR
                ------------------------------------------------------------- */}
                <header className="sticky top-0 z-50 bg-white border-b border-[#E5EAF0]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                        
                        {/* Brand Identity */}
                        <Link href="/" className="flex items-center space-x-3 group">
                            <img 
                                src="/logo.webp" 
                                alt="Logo UPT SDN 9 Gandangbatu Sillanan" 
                                className="w-10 h-10 sm:w-11 sm:h-11 object-contain shrink-0 group-hover:scale-105 transition duration-200" 
                            />
                            <div>
                                <span className="text-base font-bold text-[#142033] block leading-tight">
                                    UPT SDN 9 Gandangbatu Sillanan
                                </span>
                                <span className="text-xs text-[#64748B] font-medium block">
                                    Smart School LMS
                                </span>
                            </div>
                        </Link>

                        {/* Navigation Links */}
                        <nav className="hidden lg:flex items-center space-x-7 text-sm font-semibold">
                            <Link href="/" className="text-[#64748B] hover:text-[#8B001F] transition">
                                Beranda
                            </Link>

                            {/* Dropdown Profil Sekolah */}
                            <div className="relative group">
                                <button className="flex items-center space-x-1.5 py-1.5 text-[#8B001F] font-bold transition duration-200">
                                    <span>Profil Sekolah</span>
                                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                                </button>
                                <div className="absolute left-0 top-full pt-2 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="bg-white rounded-2xl shadow-xl border border-[#E5EAF0] p-2 space-y-1">
                                        <Link
                                            href="/#profil"
                                            className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-[#FFF0F2] hover:text-[#8B001F] transition"
                                        >
                                            <Building2 className="w-4 h-4 text-[#8B001F]" />
                                            <span>Tentang Sekolah</span>
                                        </Link>
                                        <Link
                                            href={route('tenaga-pendidik.index')}
                                            className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-[#FFF0F2] text-[#8B001F] transition"
                                        >
                                            <Users className="w-4 h-4 text-[#8B001F]" />
                                            <span>Tenaga Pendidik</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <Link href="/#keamanan" className="text-[#64748B] hover:text-[#8B001F] transition">
                                Pengumuman
                            </Link>
                        </nav>

                        {/* Actions */}
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

                        {/* Mobile Toggle */}
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
                                <Link href="/" className="py-2 px-3 rounded-xl text-[#64748B]">
                                    Beranda
                                </Link>
                                <div className="pl-3 py-1 text-xs font-bold text-[#8B001F] uppercase tracking-wider">
                                    Profil Sekolah
                                </div>
                                <Link href="/#profil" className="py-1.5 pl-6 rounded-xl text-[#64748B] text-xs">
                                    • Tentang Sekolah
                                </Link>
                                <Link href={route('tenaga-pendidik.index')} className="py-1.5 pl-6 rounded-xl bg-[#FFF0F2] text-[#8B001F] text-xs font-bold">
                                    • Tenaga Pendidik
                                </Link>
                                <Link href="/#keamanan" className="py-2 px-3 rounded-xl text-[#64748B]">
                                    Pengumuman
                                </Link>
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
                    2. HERO & PAGE HEADER
                ------------------------------------------------------------- */}
                <section className="bg-gradient-to-b from-white to-[#F7F8FA] border-b border-[#E5EAF0] py-12 sm:py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
                        <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#FFF0F2] text-[#8B001F] text-xs font-bold border border-[#E5EAF0]">
                            <Users className="w-4 h-4 mr-1.5" />
                            DIREKTORI DEWAN GURU & STAF KEPENDIDIKAN
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#142033] tracking-tight">
                            Tenaga Pendidik UPT SDN 9<br className="hidden sm:inline" />
                            <span className="text-[#8B001F]"> Gandangbatu Sillanan</span>
                        </h1>

                        <p className="text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto leading-relaxed">
                            Mengenal jajaran guru dan staf kependidikan yang berdedikasi tinggi dalam membimbing, mendidik, serta memajukan generasi muda di UPT SDN 9 Gandangbatu Sillanan.
                        </p>

                        {/* Quick Stats Summary */}
                        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
                            <div className="bg-white p-4 rounded-2xl border border-[#E5EAF0] shadow-sm text-center">
                                <span className="text-2xl sm:text-3xl font-extrabold text-[#142033] block">{totalTeachers}</span>
                                <span className="text-xs font-semibold text-[#64748B]">Total Pendidik</span>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-[#E5EAF0] shadow-sm text-center">
                                <span className="text-2xl sm:text-3xl font-extrabold text-[#8B001F] block">{totalPNS}</span>
                                <span className="text-xs font-semibold text-[#64748B]">Guru PNS</span>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-[#E5EAF0] shadow-sm text-center">
                                <span className="text-2xl sm:text-3xl font-extrabold text-blue-700 block">{totalPPPK}</span>
                                <span className="text-xs font-semibold text-[#64748B]">Guru PPPK</span>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-[#E5EAF0] shadow-sm text-center">
                                <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 block">{totalGTT}</span>
                                <span className="text-xs font-semibold text-[#64748B]">GTT / Honorer</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* -------------------------------------------------------------
                    3. FILTER & TEACHERS GRID
                ------------------------------------------------------------- */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 flex-1 w-full">
                    
                    {/* Controls: Search & Category Filter */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E5EAF0] shadow-sm">
                        
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama guru atau NIP..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:border-[#8B001F] focus:ring-[#8B001F]"
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex flex-wrap items-center gap-1.5">
                            <button
                                onClick={() => setStatusFilter('all')}
                                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                                    statusFilter === 'all'
                                        ? 'bg-[#8B001F] text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                Semua ({totalTeachers})
                            </button>
                            <button
                                onClick={() => setStatusFilter('pns')}
                                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                                    statusFilter === 'pns'
                                        ? 'bg-[#8B001F] text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                PNS ({totalPNS})
                            </button>
                            <button
                                onClick={() => setStatusFilter('pppk')}
                                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                                    statusFilter === 'pppk'
                                        ? 'bg-[#8B001F] text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                PPPK ({totalPPPK})
                            </button>
                            <button
                                onClick={() => setStatusFilter('gtt')}
                                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                                    statusFilter === 'gtt'
                                        ? 'bg-[#8B001F] text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                GTT / Honorer ({totalGTT})
                            </button>
                        </div>

                    </div>

                    {/* Teacher Cards Grid */}
                    {filteredTeachers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredTeachers.map((t) => (
                                <div 
                                    key={t.id} 
                                    className="bg-white rounded-2xl border border-[#E5EAF0] shadow-sm hover:shadow-md hover:border-[#8B001F]/30 transition duration-200 overflow-hidden flex flex-col justify-between group"
                                >
                                    <div>
                                        {/* Photo Header */}
                                        <div className="h-52 w-full bg-[#FFF0F2] relative overflow-hidden flex items-center justify-center border-b border-[#E5EAF0]">
                                            {t.photo ? (
                                                <img 
                                                    src={t.photo} 
                                                    alt={t.full_name} 
                                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300" 
                                                />
                                            ) : (
                                                <div className="w-24 h-24 rounded-full bg-[#8B001F]/10 border-2 border-[#8B001F]/20 text-[#8B001F] flex items-center justify-center font-extrabold text-3xl shadow-inner">
                                                    {t.full_name?.charAt(0) || 'G'}
                                                </div>
                                            )}

                                            {/* Status Badge */}
                                            <div className="absolute top-3 right-3">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold shadow-sm ${
                                                    t.employment_status === 'PNS' 
                                                        ? 'bg-emerald-600 text-white' 
                                                        : t.employment_status === 'PPPK'
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-amber-500 text-white'
                                                }`}>
                                                    {t.employment_status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Teacher Info */}
                                        <div className="p-5 space-y-3">
                                            <div>
                                                <h3 className="text-base font-bold text-[#142033] group-hover:text-[#8B001F] transition leading-snug">
                                                    {t.full_name}
                                                </h3>
                                                <p className="text-xs text-[#64748B] font-medium mt-0.5">
                                                    {t.role === 'pimpinan' 
                                                        ? 'Kepala Sekolah' 
                                                        : t.role === 'bk' 
                                                        ? 'Guru Bimbingan Konseling' 
                                                        : t.homeroom_class 
                                                        ? `Wali Kelas ${t.homeroom_class}` 
                                                        : 'Guru Mata Pelajaran'}
                                                </p>
                                            </div>

                                            <div className="space-y-1.5 pt-2 border-t border-[#E5EAF0] text-xs text-[#64748B]">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] font-semibold text-slate-400 uppercase">NIP:</span>
                                                    <span className="font-mono font-bold text-slate-800 text-[11px]">{t.nip || 'Belum diisi'}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] font-semibold text-slate-400 uppercase">Pendidikan:</span>
                                                    <span className="font-semibold text-slate-700 text-[11px]">{t.education_level || 'S1'}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] font-semibold text-slate-400 uppercase">Jenis Kelamin:</span>
                                                    <span className="font-semibold text-slate-700 text-[11px]">{t.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Contact */}
                                    <div className="px-5 py-3 bg-[#F7F8FA] border-t border-[#E5EAF0] flex items-center justify-between text-xs">
                                        <div className="flex items-center space-x-1.5 text-slate-500 font-mono text-[11px] truncate">
                                            <Mail className="w-3.5 h-3.5 text-[#8B001F] shrink-0" />
                                            <span className="truncate">{t.email || '-'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-[#E5EAF0] p-12 text-center space-y-3">
                            <Users className="w-12 h-12 text-slate-300 mx-auto" />
                            <h3 className="text-base font-bold text-slate-700">Tenaga Pendidik Tidak Ditemukan</h3>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                Coba ubah kata kunci pencarian atau pilih kategori filter kepegawaian yang lain.
                            </p>
                        </div>
                    )}

                </main>

                {/* -------------------------------------------------------------
                    4. FOOTER SECTION
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
                                    <li><Link href="/" className="hover:text-[#8B001F]">Beranda</Link></li>
                                    <li><Link href="/#profil" className="hover:text-[#8B001F]">Profil Sekolah</Link></li>
                                    <li><Link href={route('tenaga-pendidik.index')} className="hover:text-[#8B001F] text-[#8B001F] font-semibold">Tenaga Pendidik</Link></li>
                                    <li><Link href="/#keamanan" className="hover:text-[#8B001F]">Pengumuman</Link></li>
                                </ul>
                            </div>

                            {/* Kontak & Lokasi */}
                            <div className="space-y-2.5">
                                <h4 className="font-bold text-[#142033] text-xs">Kontak & Lokasi</h4>
                                <div className="space-y-2 text-[11px] text-[#64748B]">
                                    <a 
                                        href="https://maps.google.com/?q=QR57%2BFHC,+Betteng+Deata,+Kec.+Gandang+Batu+Sillanan,+Kabupaten+Tana+Toraja,+Sulawesi+Selatan+91871"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-start space-x-1.5 hover:text-[#8B001F] transition group"
                                    >
                                        <MapPin className="w-3.5 h-3.5 text-[#8B001F] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                        <span>
                                            <strong className="text-[#142033] block text-[11px]">QR57+FHC, Betteng Deata</strong>
                                            Buntu, Kel. Benteng Ambeso, Kec. Gandangbatu Sillanan, Kab. Tana Toraja, Sulsel 91871
                                        </span>
                                    </a>
                                    <a 
                                        href="mailto:sdn9gandasil@gmail.com"
                                        className="flex items-center space-x-1.5 hover:text-[#8B001F] transition"
                                    >
                                        <Mail className="w-3.5 h-3.5 text-[#8B001F] shrink-0" />
                                        <span>sdn9gandasil@gmail.com</span>
                                    </a>
                                    <a 
                                        href="https://wa.me/6282236847240"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-1.5 hover:text-[#8B001F] transition"
                                    >
                                        <Phone className="w-3.5 h-3.5 text-[#8B001F] shrink-0" />
                                        <span>082236847240 (WhatsApp)</span>
                                    </a>
                                </div>

                                {/* Google Maps Embed Frame */}
                                <div className="pt-1.5">
                                    <div className="w-full h-32 rounded-xl overflow-hidden border border-[#E5EAF0] shadow-sm relative group">
                                        <iframe
                                            title="Lokasi Google Maps SDN 9 Gandangbatu Sillanan"
                                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11221.925190437056!2d119.81175191582878!3d-3.241002576641695!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d93f5005400dd8d%3A0x2b8a64a6a0d6e386!2sSDN%209%20Gandangbatu%20Sillanan!5e0!3m2!1sid!2sus!4v1791451957121!5m2!1sid!2sus"
                                            className="w-full h-full border-0"
                                            allowFullScreen=""
                                            loading="lazy"
                                            referrerPolicy="strict-origin-when-cross-origin"
                                        ></iframe>
                                    </div>
                                </div>
                            </div>

                            {/* Dev Credits */}
                            <div className="space-y-2">
                                <h4 className="font-bold text-[#142033] text-xs">Dikembangkan oleh</h4>
                                <div className="space-y-1">
                                    <a 
                                        href="https://www.techsoe.com/" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center space-x-1 font-bold text-[#8B001F] hover:text-[#650019] text-sm group"
                                    >
                                        <span>TechSoe</span>
                                        <ExternalLink className="w-3.5 h-3.5 opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
                                    </a>
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
