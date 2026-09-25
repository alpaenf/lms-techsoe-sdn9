import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { 
    Layers, 
    BookOpen, 
    FileText, 
    Video, 
    PlusCircle, 
    Calendar, 
    Clock, 
    Download, 
    ExternalLink, 
    CheckCircle2,
    ChevronDown,
    Send
} from 'lucide-react';

export default function ELearningIndex({ subjects, classes, materials, assignments }) {
    const { auth } = usePage().props;
    const userRole = auth?.user?.role || 'siswa';
    const isSiswa = userRole === 'siswa';

    const [tab, setTab] = useState('materi');

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">
                            {isSiswa ? 'Portal E-Learning Peserta Didik' : 'E-Learning & Pembelajaran Digital'}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {isSiswa ? 'Akses modul materi pelajaran dan pengumpulan lembar kerja siswa' : 'Manajemen Modul Ajar, Silabus, dan Tugas Asesmen Peserta Didik'}
                        </p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setTab('materi')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                                tab === 'materi'
                                    ? 'bg-[#800020] text-white shadow-sm'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {isSiswa ? 'Materi Pelajaran' : 'Modul Bahan Ajar'}
                        </button>
                        <button
                            onClick={() => setTab('tugas')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                                tab === 'tugas'
                                    ? 'bg-[#800020] text-white shadow-sm'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {isSiswa ? 'Tugas Saya' : 'Tugas & Ujian'}
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`${isSiswa ? 'E-Learning Siswa' : 'E-Learning'} - Smart School LMS`} />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Action & Filter Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        <div className="relative inline-block">
                            <select className="h-10 pl-3.5 pr-9 min-w-[190px] bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:border-[#800020] focus:ring-[#800020] appearance-none cursor-pointer shadow-sm">
                                <option value="">Semua Mata Pelajaran</option>
                                {subjects && subjects.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        {!isSiswa ? (
                            <div className="relative inline-block">
                                <select className="h-10 pl-3.5 pr-9 min-w-[170px] bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:border-[#800020] focus:ring-[#800020] appearance-none cursor-pointer shadow-sm">
                                    <option value="">Semua Tingkat Kelas</option>
                                    {classes && classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        ) : (
                            <span className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                                Rombel: Kelas 6
                            </span>
                        )}
                    </div>

                    {!isSiswa ? (
                        <button className="px-4 py-2 bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-semibold rounded-xl inline-flex items-center shadow-sm transition">
                            <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                            <span>{tab === 'materi' ? 'Unggah Bahan Ajar' : 'Buat Tugas Baru'}</span>
                        </button>
                    ) : (
                        tab === 'tugas' && (
                            <button 
                                onClick={() => alert('Fitur pengunggahan berkas tugas telah dibuka. Silakan pilih tugas di bawah untuk mengirim jawaban.')}
                                className="px-4 py-2 bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-semibold rounded-xl inline-flex items-center shadow-sm transition"
                            >
                                <Send className="w-3.5 h-3.5 mr-1.5" />
                                <span>Kumpulkan Tugas</span>
                            </button>
                        )
                    )}
                </div>

                {/* TAB 1: MODUL BAHAN AJAR */}
                {tab === 'materi' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#E8B4B8] transition flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[10px] border border-blue-200">
                                        Dokumen PDF
                                    </span>
                                    <span className="text-[11px] text-slate-400">Kelas 6 • IPA</span>
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                                    Modul 01: Sistem Tata Surya & Karakteristik Planet
                                </h4>
                                <p className="text-xs text-slate-600 line-clamp-2">
                                    Materi bacaan mengenai rotasi bumi, revolusi bulan, serta pengenalan 8 planet dalam tata surya.
                                </p>
                            </div>
                            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                                <span className="text-slate-400">Ukuran: 2.4 MB</span>
                                <button className="inline-flex items-center text-[#800020] font-semibold hover:underline">
                                    <Download className="w-3.5 h-3.5 mr-1" />
                                    <span>Unduh Modul</span>
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#E8B4B8] transition flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-semibold text-[10px] border border-rose-200">
                                        Video Interaktif
                                    </span>
                                    <span className="text-[11px] text-slate-400">Kelas 6 • Matematika</span>
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                                    Video Pembelajaran: Operasi Hitung Bilangan Bulat Negatif
                                </h4>
                                <p className="text-xs text-slate-600 line-clamp-2">
                                    Panduan visual metode garis bilangan untuk menyelesaikan soal penjumlahan dan pengurangan.
                                </p>
                            </div>
                            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                                <span className="text-slate-400">Durasi: 12 Menit</span>
                                <button className="inline-flex items-center text-[#800020] font-semibold hover:underline">
                                    <ExternalLink className="w-3.5 h-3.5 mr-1" />
                                    <span>Tonton Video</span>
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#E8B4B8] transition flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[10px] border border-emerald-200">
                                        Muatan Lokal
                                    </span>
                                    <span className="text-[11px] text-slate-400">Kelas 6 • Bhs. Toraja</span>
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                                    Kosa Kata Dasar Bahasa Toraja: Silsilah Keluarga & Kekerabatan
                                </h4>
                                <p className="text-xs text-slate-600 line-clamp-2">
                                    Mengenal istilah ambe, indo, siulu, dan tatakrama komunikasi di lingkungan keluarga Toraja.
                                </p>
                            </div>
                            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                                <span className="text-slate-400">Ukuran: 1.1 MB</span>
                                <button className="inline-flex items-center text-[#800020] font-semibold hover:underline">
                                    <Download className="w-3.5 h-3.5 mr-1" />
                                    <span>Unduh Modul</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: TUGAS & UJIAN */}
                {tab === 'tugas' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-[#F8F9FA] text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="px-4 py-3.5">Judul Penugasan</th>
                                        <th className="px-4 py-3.5">Mata Pelajaran</th>
                                        <th className="px-4 py-3.5">Sasaran Kelas</th>
                                        <th className="px-4 py-3.5">Batas Pengumpulan (Deadline)</th>
                                        <th className="px-4 py-3.5 text-center">Status Siswa</th>
                                        <th className="px-4 py-3.5 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    <tr className="hover:bg-[#FDF2F4]/50 transition">
                                        <td className="px-4 py-3.5 font-bold text-slate-900">
                                            Latihan Mandiri: Rangkaian Listrik Seri & Paralel
                                        </td>
                                        <td className="px-4 py-3.5 text-slate-700">Ilmu Pengetahuan Alam</td>
                                        <td className="px-4 py-3.5 font-medium text-slate-600">Kelas 6</td>
                                        <td className="px-4 py-3.5 text-slate-600 font-mono">
                                            30 September 2026 • 23:59
                                        </td>
                                        <td className="px-4 py-3.5 text-center">
                                            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold text-[11px]">
                                                24/28 Mengumpulkan
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <button className="px-3 py-1 bg-[#800020] text-white rounded-lg font-semibold hover:bg-[#5C0017] transition">
                                                Periksa Jawaban
                                            </button>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-[#FDF2F4]/50 transition">
                                        <td className="px-4 py-3.5 font-bold text-slate-900">
                                            Soal Cerita: Menghitung Keliling dan Luas Lingkaran
                                        </td>
                                        <td className="px-4 py-3.5 text-slate-700">Matematika</td>
                                        <td className="px-4 py-3.5 font-medium text-slate-600">Kelas 6</td>
                                        <td className="px-4 py-3.5 text-slate-600 font-mono">
                                            02 Oktober 2026 • 15:00
                                        </td>
                                        <td className="px-4 py-3.5 text-center">
                                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]">
                                                Selesai Dinilai
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <button className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition">
                                                Lihat Rekap
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
