import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Home,
    Landmark,
    Database,
    Layers,
    Bell,
    Files,
    BookOpen,
    LogOut,
    ChevronDown,
    ChevronRight,
    Menu,
    X,
    GraduationCap,
    Clock,
    User,
    Users,
    ShieldCheck
} from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [openMenus, setOpenMenus] = useState({
        kelembagaan: route().current('kelembagaan.*'),
        masterData: route().current('master-data.*'),
        elearning: route().current('elearning.*'),
        presensi: route().current('presensi.*'),
        erapor: route().current('erapor.*'),
        bk: route().current('bk.*'),
    });

    const toggleSubmenu = (menuKey) => {
        setOpenMenus(prev => ({
            ...prev,
            [menuKey]: !prev[menuKey]
        }));
    };

    const userRole = user?.role || 'siswa';

    const getRoleLabel = (role) => {
        switch (role) {
            case 'admin': return 'Administrator Sistem';
            case 'pimpinan': return 'Kepala Sekolah';
            case 'guru': return 'Guru / Wali Kelas';
            case 'bk': return 'Guru Bimbingan Konseling';
            case 'siswa': return 'Peserta Didik';
            default: return 'Pengguna';
        }
    };

    const getNavigationItems = (role) => {
        if (role === 'admin') {
            return [
                {
                    name: 'Dashboard',
                    icon: Home,
                    href: route('dashboard'),
                    active: route().current('dashboard'),
                    type: 'link',
                },
                {
                    name: 'Kelembagaan',
                    icon: Landmark,
                    type: 'dropdown',
                    key: 'kelembagaan',
                    active: route().current('kelembagaan.*'),
                    subItems: [
                        { name: 'Profil Sekolah', href: route('kelembagaan.index') + '?tab=profil' },
                        { name: 'Tahun Ajaran & Semester', href: route('kelembagaan.index') + '?tab=akademik' },
                        { name: 'Pusat Pengumuman', href: route('kelembagaan.index') + '?tab=pengumuman' },
                    ],
                },
                {
                    name: 'Master Data',
                    icon: Database,
                    type: 'dropdown',
                    key: 'masterData',
                    active: route().current('master-data.*'),
                    subItems: [
                        { name: 'Buku Induk Siswa', href: route('master-data.index') + '?tab=siswa' },
                        { name: 'Tenaga Pendidik', href: route('master-data.index') + '?tab=guru' },
                        { name: 'Rombongan Belajar', href: route('master-data.index') + '?tab=rombel' },
                        { name: 'Mata Pelajaran', href: route('master-data.index') + '?tab=mapel' },
                    ],
                },
                {
                    name: 'E-Learning',
                    icon: Layers,
                    type: 'dropdown',
                    key: 'elearning',
                    active: route().current('elearning.*'),
                    subItems: [
                        { name: 'Modul Bahan Ajar', href: route('elearning.index') + '?tab=materi' },
                        { name: 'Tugas & Asesmen', href: route('elearning.index') + '?tab=tugas' },
                    ],
                },
                {
                    name: 'Presensi',
                    icon: Bell,
                    type: 'dropdown',
                    key: 'presensi',
                    active: route().current('presensi.*'),
                    subItems: [
                        { name: 'Presensi Siswa Harian', href: route('presensi.index') + '?type=siswa' },
                        { name: 'Presensi Tenaga Pendidik', href: route('presensi.index') + '?type=guru' },
                    ],
                },
                {
                    name: 'E-Rapor',
                    icon: Files,
                    type: 'dropdown',
                    key: 'erapor',
                    active: route().current('erapor.*'),
                    subItems: [
                        { name: 'Leger Capaian Nilai', href: route('erapor.index') + '?tab=leger' },
                        { name: 'Verifikasi & Cetak Rapor', href: route('erapor.index') + '?tab=cetak' },
                    ],
                },
                {
                    name: 'Manajemen BK',
                    icon: BookOpen,
                    type: 'dropdown',
                    key: 'bk',
                    active: route().current('bk.*'),
                    subItems: [
                        { name: 'Buku Catatan Konseling', href: route('bk.index') + '?tab=konseling' },
                        { name: 'Rekam Pelanggaran & Poin', href: route('bk.index') + '?tab=pelanggaran' },
                        { name: 'Inventarisasi Prestasi', href: route('bk.index') + '?tab=prestasi' },
                    ],
                },
            ];
        }

        if (role === 'pimpinan') {
            return [
                {
                    name: 'Dashboard Eksekutif',
                    icon: Home,
                    href: route('dashboard'),
                    active: route().current('dashboard'),
                    type: 'link',
                },
                {
                    name: 'Kelembagaan',
                    icon: Landmark,
                    type: 'dropdown',
                    key: 'kelembagaan',
                    active: route().current('kelembagaan.*'),
                    subItems: [
                        { name: 'Profil Sekolah', href: route('kelembagaan.index') + '?tab=profil' },
                        { name: 'Maklumat & Pengumuman', href: route('kelembagaan.index') + '?tab=pengumuman' },
                    ],
                },
                {
                    name: 'Supervisi Data Induk',
                    icon: Database,
                    type: 'dropdown',
                    key: 'masterData',
                    active: route().current('master-data.*'),
                    subItems: [
                        { name: 'Buku Induk Siswa', href: route('master-data.index') + '?tab=siswa' },
                        { name: 'Tenaga Pendidik', href: route('master-data.index') + '?tab=guru' },
                        { name: 'Rombongan Belajar', href: route('master-data.index') + '?tab=rombel' },
                    ],
                },
                {
                    name: 'Supervisi E-Learning',
                    icon: Layers,
                    type: 'dropdown',
                    key: 'elearning',
                    active: route().current('elearning.*'),
                    subItems: [
                        { name: 'Modul Bahan Ajar', href: route('elearning.index') + '?tab=materi' },
                        { name: 'Tugas & Asesmen', href: route('elearning.index') + '?tab=tugas' },
                    ],
                },
                {
                    name: 'Presensi Terpadu',
                    icon: Bell,
                    type: 'dropdown',
                    key: 'presensi',
                    active: route().current('presensi.*'),
                    subItems: [
                        { name: 'Presensi Tenaga Pendidik', href: route('presensi.index') + '?type=guru' },
                        { name: 'Rekap Presensi Siswa', href: route('presensi.index') + '?type=siswa' },
                    ],
                },
                {
                    name: 'Pengesahan E-Rapor',
                    icon: Files,
                    type: 'dropdown',
                    key: 'erapor',
                    active: route().current('erapor.*'),
                    subItems: [
                        { name: 'Verifikasi & Cetak Rapor', href: route('erapor.index') + '?tab=cetak' },
                        { name: 'Leger Capaian Nilai', href: route('erapor.index') + '?tab=leger' },
                    ],
                },
                {
                    name: 'Supervisi BK',
                    icon: BookOpen,
                    type: 'dropdown',
                    key: 'bk',
                    active: route().current('bk.*'),
                    subItems: [
                        { name: 'Catatan Konseling Siswa', href: route('bk.index') + '?tab=konseling' },
                        { name: 'Kedisiplinan & Poin', href: route('bk.index') + '?tab=pelanggaran' },
                        { name: 'Prestasi Siswa', href: route('bk.index') + '?tab=prestasi' },
                    ],
                },
            ];
        }

        if (role === 'guru') {
            return [
                {
                    name: 'Dashboard Pengajar',
                    icon: Home,
                    href: route('dashboard'),
                    active: route().current('dashboard'),
                    type: 'link',
                },
                {
                    name: 'Presensi Siswa Harian',
                    icon: Bell,
                    href: route('presensi.index') + '?type=siswa',
                    active: route().current('presensi.*'),
                    type: 'link',
                },
                {
                    name: 'E-Learning Guru',
                    icon: Layers,
                    type: 'dropdown',
                    key: 'elearning',
                    active: route().current('elearning.*'),
                    subItems: [
                        { name: 'Modul Bahan Ajar', href: route('elearning.index') + '?tab=materi' },
                        { name: 'Tugas & Asesmen', href: route('elearning.index') + '?tab=tugas' },
                    ],
                },
                {
                    name: 'E-Rapor Kelas',
                    icon: Files,
                    type: 'dropdown',
                    key: 'erapor',
                    active: route().current('erapor.*'),
                    subItems: [
                        { name: 'Leger Capaian Nilai', href: route('erapor.index') + '?tab=leger' },
                        { name: 'Cetak & Verifikasi Rapor', href: route('erapor.index') + '?tab=cetak' },
                    ],
                },
                {
                    name: 'Data Siswa Kelas',
                    icon: Users,
                    href: route('master-data.index') + '?tab=siswa',
                    active: route().current('master-data.*'),
                    type: 'link',
                },
                {
                    name: 'Pengumuman Sekolah',
                    icon: Landmark,
                    href: route('kelembagaan.index') + '?tab=pengumuman',
                    active: route().current('kelembagaan.*'),
                    type: 'link',
                },
            ];
        }

        if (role === 'bk') {
            return [
                {
                    name: 'Dashboard Konseling',
                    icon: Home,
                    href: route('dashboard'),
                    active: route().current('dashboard'),
                    type: 'link',
                },
                {
                    name: 'Manajemen BK',
                    icon: BookOpen,
                    type: 'dropdown',
                    key: 'bk',
                    active: route().current('bk.*'),
                    subItems: [
                        { name: 'Buku Catatan Konseling', href: route('bk.index') + '?tab=konseling' },
                        { name: 'Rekam Pelanggaran & Poin', href: route('bk.index') + '?tab=pelanggaran' },
                        { name: 'Inventarisasi Prestasi', href: route('bk.index') + '?tab=prestasi' },
                    ],
                },
                {
                    name: 'Direktori Siswa',
                    icon: Users,
                    href: route('master-data.index') + '?tab=siswa',
                    active: route().current('master-data.*'),
                    type: 'link',
                },
                {
                    name: 'Monitoring Presensi',
                    icon: Bell,
                    href: route('presensi.index') + '?type=siswa',
                    active: route().current('presensi.*'),
                    type: 'link',
                },
                {
                    name: 'Pengumuman Sekolah',
                    icon: Landmark,
                    href: route('kelembagaan.index') + '?tab=pengumuman',
                    active: route().current('kelembagaan.*'),
                    type: 'link',
                },
            ];
        }

        // Siswa
        return [
            {
                name: 'Dashboard Siswa',
                icon: Home,
                href: route('dashboard'),
                active: route().current('dashboard'),
                type: 'link',
            },
            {
                name: 'E-Learning Siswa',
                icon: Layers,
                type: 'dropdown',
                key: 'elearning',
                active: route().current('elearning.*'),
                subItems: [
                    { name: 'Materi Pembelajaran', href: route('elearning.index') + '?tab=materi' },
                    { name: 'Tugas & Asesmen', href: route('elearning.index') + '?tab=tugas' },
                ],
            },
            {
                name: 'Presensi Saya',
                icon: Bell,
                href: route('presensi.index') + '?type=siswa',
                active: route().current('presensi.*'),
                type: 'link',
            },
            {
                name: 'Rapor Digital Saya',
                icon: Files,
                href: route('erapor.index') + '?tab=cetak',
                active: route().current('erapor.*'),
                type: 'link',
            },
            {
                name: 'Pengumuman Sekolah',
                icon: Landmark,
                href: route('kelembagaan.index') + '?tab=pengumuman',
                active: route().current('kelembagaan.*'),
                type: 'link',
            },
        ];
    };

    const navigationItems = getNavigationItems(userRole);

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-slate-800 flex font-sans selection:bg-[#800020] selection:text-white">
            {/* Mobile Sidebar Overlay Backdrop */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar Navigation */}
            <aside 
                className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* School Brand Header in Sidebar */}
                <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#800020] flex items-center justify-center text-white shadow-sm shrink-0">
                            <GraduationCap className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-900 block leading-tight truncate">
                                SDN 9 Gandangbatu
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium block">
                                Smart School LMS
                            </span>
                        </div>
                    </Link>

                    <button 
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Sidebar Menu List */}
                <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                    {navigationItems.map((item, idx) => {
                        const Icon = item.icon;

                        if (item.type === 'link') {
                            return (
                                <Link
                                    key={idx}
                                    href={item.href}
                                    className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition duration-150 group ${
                                        item.active
                                            ? 'bg-[#FDF2F4] text-[#800020] border-l-4 border-[#800020] font-semibold'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                >
                                    <Icon className={`w-5 h-5 mr-3 shrink-0 ${item.active ? 'text-[#800020]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                    <span className="truncate">{item.name}</span>
                                </Link>
                            );
                        }

                        // Dropdown item
                        const isOpen = openMenus[item.key];
                        return (
                            <div key={idx} className="space-y-1">
                                <button
                                    type="button"
                                    onClick={() => toggleSubmenu(item.key)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition duration-150 group ${
                                        item.active
                                            ? 'bg-[#FDF2F4]/70 text-[#800020] font-semibold'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                >
                                    <div className="flex items-center min-w-0">
                                        <Icon className={`w-5 h-5 mr-3 shrink-0 ${item.active ? 'text-[#800020]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                        <span className="truncate">{item.name}</span>
                                    </div>
                                    <div className="text-slate-400">
                                        {isOpen ? (
                                            <ChevronDown className="w-4 h-4" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4" />
                                        )}
                                    </div>
                                </button>

                                {isOpen && (
                                    <div className="pl-11 pr-2 py-1 space-y-1">
                                        {item.subItems.map((sub, sIdx) => (
                                            <Link
                                                key={sIdx}
                                                href={sub.href}
                                                className="block px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-[#800020] hover:bg-[#FDF2F4] transition truncate"
                                            >
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Separator */}
                    <div className="pt-3 border-t border-slate-100 my-2" />

                    {/* Logout Option */}
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition duration-150 group"
                    >
                        <LogOut className="w-5 h-5 mr-3 text-rose-500 group-hover:text-rose-600 shrink-0" />
                        <span>Keluar</span>
                    </Link>
                </div>

                {/* Sidebar Footer User Info */}
                <div className="p-3 border-t border-slate-200 bg-slate-50/50">
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-[#800020] text-white flex items-center justify-center font-bold text-sm shrink-0">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-slate-900 block truncate">
                                {user?.name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium block truncate">
                                {getRoleLabel(userRole)}
                            </span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
                {/* Top Navigation Bar */}
                <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
                            aria-label="Buka menu navigasi"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-slate-600">
                            <span className="text-slate-400">Institusi:</span>
                            <span className="text-slate-800">UPT SDN 9 Gandangbatu Sillanan</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        {/* Semester Badge */}
                        <div className="hidden md:inline-flex items-center px-3 py-1 rounded-full bg-[#FDF2F4] text-[#800020] text-xs font-semibold border border-[#E8B4B8]">
                            <Clock className="w-3.5 h-3.5 mr-1.5" />
                            T.A. 2026/2027 • Ganjil
                        </div>

                        {/* Notifications */}
                        <button 
                            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                            aria-label="Lihat notifikasi"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
                        </button>

                        <div className="h-6 w-px bg-slate-200 mx-1" />

                        {/* User Profile Info */}
                        <div className="flex items-center space-x-2.5">
                            <div className="text-right hidden sm:block">
                                <span className="text-xs font-bold text-slate-900 block leading-tight">
                                    {user?.name}
                                </span>
                                <span className="text-[10px] text-[#800020] font-semibold block leading-tight">
                                    {getRoleLabel(userRole)}
                                </span>
                            </div>

                            <Link
                                href={route('profile.edit')}
                                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-[#FDF2F4] text-slate-600 hover:text-[#800020] flex items-center justify-center border border-slate-200 transition"
                                title="Pengaturan Profil"
                            >
                                <User className="w-4 h-4" />
                            </Link>

                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                title="Keluar dari sistem"
                            >
                                <LogOut className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Optional Sub-Header */}
                {header && (
                    <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4">
                        {header}
                    </div>
                )}

                {/* Page Content Body */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>

                {/* Sticky Clean Footer */}
                <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div>
                        (C) 2026 UPT SDN 9 Gandangbatu Sillanan. Seluruh Hak Cipta Dilindungi.
                    </div>
                    <div>
                        TechSoe Smart School LMS • Versi 1.1.0
                    </div>
                </footer>
            </div>
        </div>
    );
}
