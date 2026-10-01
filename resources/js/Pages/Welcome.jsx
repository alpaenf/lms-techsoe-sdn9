import React from 'react';
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
    Clock,
    CheckCircle2
} from 'lucide-react';

export default function Welcome({ auth }) {
    const modules = [
        {
            title: 'Manajemen Multi-Role',
            desc: 'Akses terintegrasi untuk Admin, Guru, Siswa, Wali Kelas, Guru BK, dan Kepala Sekolah.',
            icon: Users,
        },
        {
            title: 'LMS & Bahan Ajar Digital',
            desc: 'Penyampaian modul, bahan bacaan PDF/dokumen, tugas daring, dan evaluasi hasil belajar.',
            icon: BookOpen,
        },
        {
            title: 'Presensi Terintegrasi',
            desc: 'Pencatatan presensi harian siswa dan guru dengan rekapitulasi kehadiran otomatis.',
            icon: CalendarCheck,
        },
        {
            title: 'Otomatisasi E-Raport',
            desc: 'Pengolahan nilai tugas, UTS, UAS menjadi lembar rapor resmi berstandar kurikulum.',
            icon: FileText,
        },
        {
            title: 'Bimbingan Konseling (BK)',
            desc: 'Pencatatan sesi bimbingan siswa, inventarisasi poin kedisiplinan, dan rekam prestasi.',
            icon: Award,
        },
        {
            title: 'Dashboard & Ekspor Excel',
            desc: 'Statistik eksekutif pimpinan sekolah dan penarikan rekapitulasi data format Excel & PDF.',
            icon: BarChart3,
        },
    ];

    return (
        <>
            <Head title="Smart School LMS - UPT SDN 9 Gandangbatu Sillanan" />

            <div className="min-h-screen bg-[#F8F9FA] text-slate-800 font-sans selection:bg-[#800020] selection:text-white">
                {/* Top Navigation */}
                <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-[#800020] flex items-center justify-center text-white shadow-sm">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-base font-bold text-slate-900 block leading-tight">
                                    UPT SDN 9 Gandangbatu Sillanan
                                </span>
                                <span className="text-xs text-slate-500 font-medium">
                                    Smart School LMS TechSoe
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-[#FDF2F4] text-[#800020] text-xs font-semibold border border-[#E8B4B8]">
                                <Clock className="w-3.5 h-3.5 mr-1.5" />
                                T.A. 2026/2027 Ganjil
                            </div>

                            {auth?.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center px-4 py-2 bg-[#800020] hover:bg-[#5C0017] text-white text-sm font-semibold rounded-lg shadow-sm transition"
                                >
                                    <span>Buka Dashboard</span>
                                    <ArrowRight className="w-4 h-4 ml-1.5" />
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="inline-flex items-center px-4 py-2 bg-[#800020] hover:bg-[#5C0017] text-white text-sm font-semibold rounded-lg shadow-sm transition"
                                >
                                    <span>Masuk ke Sistem</span>
                                    <ArrowRight className="w-4 h-4 ml-1.5" />
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden bg-white border-b border-slate-200 py-16 sm:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto space-y-6">
                            <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#FDF2F4] border border-[#E8B4B8] text-[#800020] text-xs font-semibold">
                                <Building2 className="w-4 h-4 mr-2" />
                                Sistem Informasi Pembelajaran & Akademik Terpadu
                            </div>

                            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                Transformasi Digital Pendidikan di <br />
                                <span className="text-[#800020]">UPT SDN 9 Gandangbatu Sillanan</span>
                            </h1>

                            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                                Ekosistem terintegrasi yang menggabungkan pembelajaran daring modern dengan tata kelola administrasi akademik, buku induk siswa, presensi harian, hingga otomatisasi pencetakan E-Raport.
                            </p>

                            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                                <Link
                                    href={auth?.user ? route('dashboard') : route('login')}
                                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-[#800020] hover:bg-[#5C0017] text-white text-sm font-semibold rounded-xl shadow-md transition transform active:scale-95"
                                >
                                    <span>{auth?.user ? 'Masuk ke Dashboard' : 'Login Portal Akademik'}</span>
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                                <a
                                    href="#modul"
                                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition"
                                >
                                    Pelajari 12 Modul Inti
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Modules Grid */}
                <section id="modul" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#800020]">Fitur Unggulan</span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                            Solusi Komprehensif Berbasis Peran
                        </h2>
                        <p className="text-sm text-slate-600">
                            Menghubungkan 6 tingkatan entitas pengguna dalam satu basis data terpusat MySQL 8.0.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {modules.map((item, idx) => {
                            const IconComponent = item.icon;
                            return (
                                <div
                                    key={idx}
                                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-[#E8B4B8] hover:shadow-md transition duration-200 flex flex-col justify-between"
                                >
                                    <div className="space-y-4">
                                        <div className="w-12 h-12 rounded-xl bg-[#FDF2F4] text-[#800020] flex items-center justify-center border border-[#E8B4B8]">
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                                        <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                                    </div>
                                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-[#800020]">
                                        <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                                        <span>Terintegrasi Penuh</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Security & Reliability Banner */}
                <section className="bg-white border-y border-slate-200 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-[#5C0017] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                            <div className="space-y-3 max-w-2xl">
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold">
                                    <ShieldCheck className="w-4 h-4 mr-1.5" />
                                    Standar Akuntabilitas Tinggi
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold">
                                    Keamanan Data & Privasi Peserta Didik
                                </h3>
                                <p className="text-sm text-white/80 leading-relaxed">
                                    Didukung enkripsi kata sandi terstandarisasi, validasi data berlapis, log audit aktivitas, serta pencadangan berkala otomatis setiap malam.
                                </p>
                            </div>
                            <Link
                                href={auth?.user ? route('dashboard') : route('login')}
                                className="inline-flex items-center px-6 py-3.5 bg-white text-[#800020] hover:bg-slate-100 text-sm font-bold rounded-xl transition shadow-sm whitespace-nowrap"
                            >
                                <span>Akses Portal Sekarang</span>
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-white py-8 border-t border-slate-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                        <div>
                            (C) 2026 UPT SDN 9 Gandangbatu Sillanan. Seluruh Hak Cipta Dilindungi.
                        </div>
                        <div>
                            Dikembangkan oleh TechSoe (Teknologi Inovasi Soedirman).
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
