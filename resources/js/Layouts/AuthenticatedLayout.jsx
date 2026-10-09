import React, { useState } from 'react';
import NotificationDropdown from '@/Components/NotificationDropdown';
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
    School,
    SlidersHorizontal,
    CheckCircle2,
    ClipboardCheck
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
            case 'guru_mapel': return 'Guru Mata Pelajaran';
            case 'tendik': return 'Tenaga Kependidikan';
            case 'bk': return 'Guru Bimbingan Konseling';
            case 'siswa': return 'Peserta Didik';
            default: return 'Pengguna';
        }
    };

    const getGroupedNavigation = (role) => {
        if (role === 'admin') {
            return [
                {
                    category: 'UTAMA',
                    items: [
                        { name: 'Dashboard', icon: Home, href: route('dashboard'), active: route().current('dashboard'), type: 'link' }
                    ]
                },
                {
                    category: 'AKADEMIK',
                    items: [
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
                            name: 'Ujian Online',
                            icon: ClipboardCheck,
                            href: route('exams.index'),
                            active: route().current('exams.*'),
                            type: 'link',
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
                    ]
                },
                {
                    category: 'LAYANAN',
                    items: [
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
                        { name: 'Pengumuman & Berita', icon: Landmark, href: route('announcements.index'), active: route().current('announcements.*'), type: 'link' },
                    ]
                }
            ];
        }

        if (role === 'pimpinan') {
            return [
                {
                    category: 'UTAMA',
                    items: [
                        { name: 'Dashboard Eksekutif', icon: Home, href: route('dashboard'), active: route().current('dashboard'), type: 'link' }
                    ]
                },
                {
                    category: 'AKADEMIK',
                    items: [
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
                            name: 'Supervisi Ujian Online',
                            icon: ClipboardCheck,
                            href: route('exams.index'),
                            active: route().current('exams.*'),
                            type: 'link',
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
                    ]
                },
                {
                    category: 'LAYANAN',
                    items: [
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
                    ]
                }
            ];
        }

        if (role === 'guru' || role === 'guru_mapel') {
            return [
                {
                    category: 'UTAMA',
                    items: [
                        { name: role === 'guru_mapel' ? 'Dashboard Guru Mapel' : 'Dashboard Pengajar', icon: Home, href: route('dashboard'), active: route().current('dashboard'), type: 'link' }
                    ]
                },
                {
                    category: 'AKADEMIK',
                    items: [
                        { name: 'Presensi Siswa Harian', icon: Bell, href: route('presensi.index') + '?type=siswa', active: route().current('presensi.*'), type: 'link' },
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
                        { name: 'Ujian Online', icon: ClipboardCheck, href: route('exams.index'), active: route().current('exams.*'), type: 'link' },
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
                        { name: 'Data Siswa Kelas', icon: Users, href: route('master-data.index') + '?tab=siswa', active: route().current('master-data.*'), type: 'link' },
                    ]
                },
                {
                    category: 'LAYANAN',
                    items: [
                        { name: 'Pengumuman Sekolah', icon: Landmark, href: route('announcements.index'), active: route().current('announcements.*'), type: 'link' },
                    ]
                }
            ];
        }

        if (role === 'tendik') {
            return [
                {
                    category: 'UTAMA',
                    items: [
                        { name: 'Dashboard Administrasi', icon: Home, href: route('dashboard'), active: route().current('dashboard'), type: 'link' }
                    ]
                },
                {
                    category: 'AKADEMIK & TENDIK',
                    items: [
                        {
                            name: 'Master Data Staff',
                            icon: Database,
                            type: 'dropdown',
                            key: 'masterData',
                            active: route().current('master-data.*'),
                            subItems: [
                                { name: 'Buku Induk Siswa', href: route('master-data.index') + '?tab=siswa' },
                                { name: 'Tenaga Pendidik & Tendik', href: route('master-data.index') + '?tab=guru' },
                                { name: 'Rombongan Belajar', href: route('master-data.index') + '?tab=rombel' },
                                { name: 'Mata Pelajaran', href: route('master-data.index') + '?tab=mapel' },
                            ],
                        },
                        {
                            name: 'Presensi Sekolah',
                            icon: Bell,
                            type: 'dropdown',
                            key: 'presensi',
                            active: route().current('presensi.*'),
                            subItems: [
                                { name: 'Presensi Siswa Harian', href: route('presensi.index') + '?type=siswa' },
                                { name: 'Presensi Staf & Guru', href: route('presensi.index') + '?type=guru' },
                            ],
                        },
                        { name: 'Kelembagaan & Profil', icon: Landmark, href: route('kelembagaan.index'), active: route().current('kelembagaan.*'), type: 'link' },
                    ]
                },
                {
                    category: 'LAYANAN',
                    items: [
                        { name: 'Pengumuman & Berita', icon: Landmark, href: route('announcements.index'), active: route().current('announcements.*'), type: 'link' },
                    ]
                }
            ];
        }

        if (role === 'bk') {
            return [
                {
                    category: 'UTAMA',
                    items: [
                        { name: 'Dashboard Konseling', icon: Home, href: route('dashboard'), active: route().current('dashboard'), type: 'link' }
                    ]
                },
                {
                    category: 'AKADEMIK',
                    items: [
                        { name: 'Direktori Siswa', icon: Users, href: route('master-data.index') + '?tab=siswa', active: route().current('master-data.*'), type: 'link' },
                        { name: 'Monitoring Presensi', icon: Bell, href: route('presensi.index') + '?type=siswa', active: route().current('presensi.*'), type: 'link' },
                    ]
                },
                {
                    category: 'LAYANAN',
                    items: [
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
                        { name: 'Pengumuman & Berita', icon: Landmark, href: route('announcements.index'), active: route().current('announcements.*'), type: 'link' },
                        { name: 'Pengumuman Sekolah', icon: Landmark, href: route('announcements.index'), active: route().current('announcements.*'), type: 'link' },
                    ]
                }
            ];
        }

        // Siswa
        return [
            {
                category: 'UTAMA',
                items: [
                    { name: 'Dashboard Siswa', icon: Home, href: route('dashboard'), active: route().current('dashboard'), type: 'link' }
                ]
            },
            {
                category: 'AKADEMIK',
                items: [
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
                    { name: 'Ujian Online', icon: ClipboardCheck, href: route('student.exams.index'), active: route().current('student.exams.*'), type: 'link' },
                    { name: 'Presensi Saya', icon: Bell, href: route('presensi.index') + '?type=siswa', active: route().current('presensi.*'), type: 'link' },
                    { name: 'Rapor Digital Saya', icon: Files, href: route('erapor.index') + '?tab=cetak', active: route().current('erapor.*'), type: 'link' },
                ]
            },
            {
                category: 'LAYANAN',
                items: [
                    { name: 'Pengumuman Sekolah', icon: Landmark, href: route('announcements.index'), active: route().current('announcements.*'), type: 'link' },
                ]
            }
        ];
    };

    const groupedNavigation = getGroupedNavigation(userRole);

    return (
        <div className="min-h-screen bg-[#F8F9FB] text-slate-800 flex font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#800020] selection:text-white">
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
                <div className="h-16 bg-[#800020] px-4 flex items-center justify-between text-white shrink-0">
                    <Link href="/" className="flex items-center space-x-3">
                        <img 
                            src="/logo.webp" 
                            alt="Logo SDN 9 Gandangbatu" 
                            className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 shadow-sm shrink-0" 
                        />
                        <div className="min-w-0">
                            <span className="text-xs font-bold block leading-tight truncate tracking-wide text-white">
                                SDN 9 Gandangbatu
                            </span>
                            <span className="text-[10px] text-white/70 font-medium block truncate">
                                Smart School LMS
                            </span>
                        </div>
                    </Link>

                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-1.5 rounded-lg text-white/80 hover:bg-white/10"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Sidebar Menu List */}
                <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
                    {groupedNavigation.map((group, gIdx) => (
                        <div key={gIdx} className="space-y-1">
                            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                                {group.category}
                            </div>
                            {group.items.map((item, idx) => {
                                const Icon = item.icon;

                                if (item.type === 'link') {
                                    return (
                                        <Link
                                            key={idx}
                                            href={item.href}
                                            className={`flex items-center px-3 py-2 rounded-lg text-xs font-semibold transition duration-150 group relative ${
                                                item.active
                                                    ? 'bg-[#FDF2F4] text-[#800020] font-bold'
                                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                        >
                                            {item.active && (
                                                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-[#800020]" />
                                            )}
                                            <Icon className={`w-4 h-4 mr-2.5 shrink-0 ${item.active ? 'text-[#800020]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                            <span className="truncate">{item.name}</span>
                                        </Link>
                                    );
                                }

                                const isOpen = openMenus[item.key];
                                return (
                                    <div key={idx} className="space-y-0.5">
                                        <button
                                            type="button"
                                            onClick={() => toggleSubmenu(item.key)}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition duration-150 group relative ${
                                                item.active
                                                    ? 'bg-[#FDF2F4]/80 text-[#800020] font-bold'
                                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                        >
                                            {item.active && (
                                                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-[#800020]" />
                                            )}
                                            <div className="flex items-center min-w-0">
                                                <Icon className={`w-4 h-4 mr-2.5 shrink-0 ${item.active ? 'text-[#800020]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                                <span className="truncate">{item.name}</span>
                                            </div>
                                            <div className="text-slate-400">
                                                {isOpen ? (
                                                    <ChevronDown className="w-3.5 h-3.5" />
                                                ) : (
                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                )}
                                            </div>
                                        </button>

                                        {isOpen && (
                                            <div className="pl-9 pr-1 py-1 space-y-0.5">
                                                {item.subItems.map((sub, sIdx) => (
                                                    <Link
                                                        key={sIdx}
                                                        href={sub.href}
                                                        className="block px-2 py-1.5 rounded-md text-[11px] font-medium text-slate-500 hover:text-[#800020] hover:bg-[#FDF2F4] transition truncate"
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}

                    <div className="pt-2 border-t border-slate-100" />

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition duration-150 group"
                    >
                        <LogOut className="w-4 h-4 mr-2.5 text-rose-500 group-hover:text-rose-600 shrink-0" />
                        <span>Keluar</span>
                    </Link>
                </div>

                {/* Sidebar Footer User Info */}
                <div className="p-3 border-t border-slate-200 bg-slate-50/70 shrink-0">
                    <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#800020] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-slate-900 block truncate leading-tight">
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

                        <div className="hidden sm:flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-[#FDF2F4] text-[#800020] flex items-center justify-center shrink-0 border border-[#E8B4B8]/40">
                                <School className="w-4 h-4 text-[#800020]" />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-slate-900 block leading-tight">
                                    UPT SDN 9 Gandangbatu Sillanan
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium block leading-tight">
                                    Kabupaten Tana Toraja, Sulawesi Selatan
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        {/* Selector 1: T.A. Dropdown Control */}
                        <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:border-slate-300 cursor-pointer">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>T.A. 2026/2027</span>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        </div>

                        {/* Selector 2: Semester Dropdown Control */}
                        <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:border-slate-300 cursor-pointer">
                            <Layers className="w-3.5 h-3.5 text-slate-400" />
                            <span>Ganjil</span>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        </div>

                        {/* Notifications */}
                        <NotificationDropdown />

                        <div className="h-5 w-px bg-slate-200 mx-0.5" />

                        {/* User Profile Info */}
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200 shrink-0">
                                <User className="w-4 h-4 text-slate-500" />
                            </div>

                            <div className="text-left hidden sm:block">
                                <span className="text-xs font-bold text-slate-900 block leading-tight">
                                    {user?.name}
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium block leading-tight">
                                    {getRoleLabel(userRole)}
                                </span>
                            </div>

                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                title="Keluar"
                            >
                                <LogOut className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Optional Sub-Header */}
                {header && (
                    <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3">
                        {header}
                    </div>
                )}

                {/* Page Content Body */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>

                {/* Sticky Clean Footer */}
                <footer className="bg-white border-t border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div>
                        © 2026 UPT SDN 9 Gandangbatu Sillanan. All Rights Reserved.
                    </div>
                    <div>
                        Smart School LMS • Software Administrasi Sekolah
                    </div>
                </footer>
            </div>
        </div>
    );
}