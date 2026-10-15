import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Users,
    Mail,
    MapPin,
    Phone,
    ArrowRight,
    CalendarCheck,
    ChevronDown,
    Menu,
    X,
    Building2,
    ExternalLink,
    School
} from 'lucide-react';

export default function PublicLayout({ auth, title, activeNav = 'announcements', children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F7F8FA] text-[#142033] font-sans selection:bg-[#8B001F] selection:text-white flex flex-col justify-between">
            {title && <Head title={title} />}

            {/* -------------------------------------------------------------
                1. HEADER / NAVIGATION BAR (Konsisten dengan Halaman Utama)
            ------------------------------------------------------------- */}
            <header className="sticky top-0 z-50 bg-white border-b border-[#E5EAF0]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    
                    {/* Brand Identity (Left) */}
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

                    {/* Navigation Links (Center) */}
                    <nav className="hidden lg:flex items-center space-x-7 text-sm font-semibold">
                        <Link
                            href="/"
                            className={`transition-colors duration-300 ease-in-out relative py-1.5 ${
                                activeNav === 'home' ? 'text-[#8B001F]' : 'text-[#64748B] hover:text-[#8B001F]'
                            }`}
                        >
                            Beranda
                            <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B001F] rounded-full transition-all duration-300 ${
                                activeNav === 'home' ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                            }`} />
                        </Link>

                        {/* Profil Sekolah Dropdown */}
                        <div className="relative group">
                            <button
                                className={`flex items-center space-x-1 transition-colors duration-300 relative py-1.5 ${
                                    activeNav === 'profil' ? 'text-[#8B001F]' : 'text-[#64748B] hover:text-[#8B001F]'
                                }`}
                            >
                                <span>Profil Sekolah</span>
                                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                                <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B001F] rounded-full transition-all duration-300 ${
                                    activeNav === 'profil' ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                                }`} />
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
                                        className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-[#FFF0F2] hover:text-[#8B001F] transition"
                                    >
                                        <Users className="w-4 h-4 text-[#8B001F]" />
                                        <span>Tenaga Pendidik</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <Link
                            href="/#panduan"
                            className={`transition-colors duration-300 ease-in-out relative py-1.5 ${
                                activeNav === 'panduan' ? 'text-[#8B001F]' : 'text-[#64748B] hover:text-[#8B001F]'
                            }`}
                        >
                            Panduan
                            <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B001F] rounded-full transition-all duration-300 ${
                                activeNav === 'panduan' ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                            }`} />
                        </Link>

                        <Link
                            href={route('announcements.index')}
                            className={`transition-colors duration-300 ease-in-out relative py-1.5 ${
                                activeNav === 'announcements' ? 'text-[#8B001F]' : 'text-[#64748B] hover:text-[#8B001F]'
                            }`}
                        >
                            Pengumuman
                            <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B001F] rounded-full transition-all duration-300 ${
                                activeNav === 'announcements' ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                            }`} />
                        </Link>
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

                {/* Mobile Navigation Drawer */}
                {mobileMenuOpen && (
                    <div className="lg:hidden bg-white border-b border-[#E5EAF0] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
                        <nav className="flex flex-col space-y-1.5 text-sm font-semibold">
                            <Link
                                href="/"
                                className={`py-2 px-3 rounded-xl transition-all ${
                                    activeNav === 'home' ? 'bg-[#FFF0F2] text-[#8B001F]' : 'text-[#64748B] hover:bg-slate-50'
                                }`}
                            >
                                Beranda
                            </Link>

                            <div className="space-y-1 pl-2">
                                <div className="py-1 px-3 text-xs font-bold text-[#8B001F] uppercase tracking-wider">
                                    Profil Sekolah
                                </div>
                                <Link
                                    href="/#profil"
                                    className="block py-1.5 pl-5 rounded-xl text-xs text-[#64748B] hover:text-[#8B001F]"
                                >
                                    • Tentang Sekolah
                                </Link>
                                <Link
                                    href={route('tenaga-pendidik.index')}
                                    className="block py-1.5 pl-5 rounded-xl text-xs text-[#64748B] hover:text-[#8B001F]"
                                >
                                    • Tenaga Pendidik
                                </Link>
                            </div>

                            <Link
                                href="/#panduan"
                                className="py-2 px-3 rounded-xl text-[#64748B] hover:bg-slate-50 transition-all"
                            >
                                Panduan
                            </Link>

                            <Link
                                href={route('announcements.index')}
                                className={`py-2 px-3 rounded-xl transition-all ${
                                    activeNav === 'announcements' ? 'bg-[#FFF0F2] text-[#8B001F] font-bold' : 'text-[#64748B] hover:bg-slate-50'
                                }`}
                            >
                                Pengumuman
                            </Link>
                        </nav>

                        <div className="pt-3 border-t border-[#E5EAF0]">
                            <Link
                                href={auth?.user ? route('dashboard') : route('login')}
                                className="w-full flex items-center justify-center py-2.5 bg-[#8B001F] hover:bg-[#650019] text-white text-sm font-semibold rounded-full shadow-sm transition"
                            >
                                <span>Masuk ke Portal</span>
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            {/* -------------------------------------------------------------
                2. MAIN CONTENT
            ------------------------------------------------------------- */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                {children}
            </main>

            {/* -------------------------------------------------------------
                3. FOOTER (Konsisten dengan Halaman Utama)
            ------------------------------------------------------------- */}
            <footer className="bg-white border-t border-[#E5EAF0] pt-12 pb-8 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Identitas Sekolah */}
                        <div className="md:col-span-2 space-y-4">
                            <div className="flex items-center space-x-3">
                                <img
                                    src="/logo.webp"
                                    alt="Logo UPT SDN 9 Gandangbatu Sillanan"
                                    className="w-10 h-10 object-contain"
                                />
                                <div>
                                    <span className="text-base font-bold text-[#142033] block">
                                        UPT SDN 9 Gandangbatu Sillanan
                                    </span>
                                    <span className="text-xs text-[#64748B] block">
                                        NPSN: 40306406 • Kec. Gandangbatu Sillanan, Tana Toraja
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs text-[#64748B] leading-relaxed max-w-md">
                                Platform Learning Management System terpadu dan portal warta kegiatan akademik untuk mendukung proses pembelajaran digital yang transparan dan akuntabel.
                            </p>
                        </div>

                        {/* Tautan Cepat */}
                        <div className="space-y-3">
                            <h4 className="font-bold text-[#142033] text-xs uppercase tracking-wider">Navigasi Utama</h4>
                            <ul className="space-y-2 text-xs text-[#64748B]">
                                <li><Link href="/" className="hover:text-[#8B001F] transition">Beranda</Link></li>
                                <li><Link href={route('tenaga-pendidik.index')} className="hover:text-[#8B001F] transition">Tenaga Pendidik</Link></li>
                                <li><Link href={route('announcements.index')} className="hover:text-[#8B001F] transition">Pengumuman & Warta</Link></li>
                                <li><Link href="/login" className="hover:text-[#8B001F] transition">Masuk ke Portal</Link></li>
                            </ul>
                        </div>

                        {/* Kontak & Pengembang */}
                        <div className="space-y-3">
                            <h4 className="font-bold text-[#142033] text-xs uppercase tracking-wider">Pengembang Sistem</h4>
                            <div className="space-y-1 text-xs">
                                <a
                                    href="https://www.techsoe.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-1 font-bold text-[#8B001F] hover:text-[#650019] group"
                                >
                                    <span>TechSoe</span>
                                    <ExternalLink className="w-3.5 h-3.5 opacity-75 group-hover:opacity-100 transition" />
                                </a>
                                <span className="text-[11px] text-[#64748B] block">
                                    Teknologi Inovasi Soedirman.
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="pt-6 border-t border-[#E5EAF0] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#64748B]">
                        <span>
                            © 2026 UPT SDN 9 Gandangbatu Sillanan. Seluruh Hak Cipta Dilindungi.
                        </span>
                        <div className="flex items-center space-x-3">
                            <Link href="/" className="hover:text-[#142033]">Beranda</Link>
                            <span>•</span>
                            <Link href={route('announcements.index')} className="hover:text-[#142033]">Pengumuman</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
