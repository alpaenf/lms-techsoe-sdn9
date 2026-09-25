import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { 
    BookOpen, 
    AlertTriangle, 
    Award, 
    PlusCircle, 
    FileText, 
    Calendar, 
    User, 
    ShieldAlert, 
    Download,
    HeartHandshake,
    Sparkles,
    MessageSquareQuote,
    CheckCircle2
} from 'lucide-react';

export default function BKIndex({ sessions, violations, achievements }) {
    const { auth } = usePage().props;
    const userRole = auth?.user?.role || 'admin';
    const isStudent = userRole === 'siswa';

    const [tab, setTab] = useState(isStudent ? 'prestasi' : 'konseling');
    const [requestSuccess, setRequestSuccess] = useState(false);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">
                            {isStudent ? 'Pusat Prestasi & Bimbingan Siswa' : 'Manajemen Bimbingan Konseling (BK)'}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {isStudent 
                                ? 'Galeri Kebanggaan Prestasi Siswa & Konsultasi Ramah Anak'
                                : 'Buku Sesi Bimbingan Siswa, Inventarisasi Kedisiplinan & Piagam Prestasi'}
                        </p>
                    </div>

                    <div className="flex items-center space-x-2">
                        {!isStudent && (
                            <>
                                <button
                                    onClick={() => setTab('konseling')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                                        tab === 'konseling'
                                            ? 'bg-[#800020] text-white shadow-sm'
                                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    Sesi Konseling ({sessions ? sessions.length : 0})
                                </button>
                                <button
                                    onClick={() => setTab('pelanggaran')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                                        tab === 'pelanggaran'
                                            ? 'bg-[#800020] text-white shadow-sm'
                                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    Pelanggaran & Poin ({violations ? violations.length : 0})
                                </button>
                            </>
                        )}

                        <button
                            onClick={() => setTab('prestasi')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                                tab === 'prestasi'
                                    ? 'bg-[#800020] text-white shadow-sm'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {isStudent ? 'Galeri Prestasi' : `Catatan Prestasi (${achievements ? achievements.length : 0})`}
                        </button>

                        {isStudent && (
                            <button
                                onClick={() => setTab('konseling')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                                    tab === 'konseling'
                                        ? 'bg-[#800020] text-white shadow-sm'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                Layanan Curhat & Bimbingan
                            </button>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={isStudent ? "Prestasi & Bimbingan - Smart School LMS" : "Bimbingan Konseling - Smart School LMS"} />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Action Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-xs text-slate-500 font-medium">
                        Guru BK Penanggung Jawab: <span className="font-bold text-slate-900">Maria Rante, S.Pd.</span>
                    </span>

                    {isStudent ? (
                        <button 
                            onClick={() => {
                                setRequestSuccess(true);
                                setTimeout(() => setRequestSuccess(false), 4000);
                            }}
                            className="px-3.5 py-2 bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-semibold rounded-xl inline-flex items-center shadow-sm transition"
                        >
                            <HeartHandshake className="w-3.5 h-3.5 mr-1.5" />
                            <span>Ajukan Janji Temu Bimbingan</span>
                        </button>
                    ) : (
                        <button className="px-3.5 py-2 bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-semibold rounded-xl inline-flex items-center shadow-sm transition">
                            <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                            <span>
                                {tab === 'konseling' && 'Tambah Catatan Konseling'}
                                {tab === 'pelanggaran' && 'Catat Pelanggaran Baru'}
                                {tab === 'prestasi' && 'Input Prestasi Siswa'}
                            </span>
                        </button>
                    )}
                </div>

                {requestSuccess && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>Permintaan bimbingan konseling berhasil dikirim ke Ibu Maria Rante, S.Pd. Jadwal bimbingan akan dikabarkan melalui wali kelas.</span>
                    </div>
                )}

                {/* TAB 1: KONSELING */}
                {tab === 'konseling' && (
                    isStudent ? (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                            <div className="p-5 rounded-2xl bg-[#FDF2F4] border border-[#E8B4B8] flex items-start space-x-4">
                                <div className="p-3 bg-[#800020] text-white rounded-xl">
                                    <HeartHandshake className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-[#800020]">
                                        Ruang Bimbingan & Konseling Sahabat Siswa
                                    </h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Layanan bimbingan konseling di UPT SDN 9 Gandangbatu Sillanan bersifat ramah anak, rahasia, dan mendampingi kamu dalam proses belajar, pertemanan, dan pengembangan bakat minat.
                                    </p>
                                </div>
                            </div>

                            <div className="border border-slate-100 rounded-2xl p-5 bg-[#F8F9FA] space-y-3">
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                    Topik Yang Bisa Kamu Konsultasikan:
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                                        <p className="font-bold text-xs text-slate-900">Bimbingan Belajar</p>
                                        <p className="text-[11px] text-slate-500 mt-1">Mengatasi kesulitan memahami materi atau persiapan ujian.</p>
                                    </div>
                                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                                        <p className="font-bold text-xs text-slate-900">Hubungan Sosial</p>
                                        <p className="text-[11px] text-slate-500 mt-1">Cara bergaul yang sehat, anti perundungan (bullying), dan kekompakan kelas.</p>
                                    </div>
                                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                                        <p className="font-bold text-xs text-slate-900">Minat & Bakat</p>
                                        <p className="text-[11px] text-slate-500 mt-1">Mengikuti lomba seni, olahraga, dan olimpiade sains.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                                Riwayat Sesi Bimbingan & Konseling Peserta Didik
                            </h3>

                            <div className="divide-y divide-slate-100">
                                <div className="py-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-900">
                                            Siti Nurhaliza (Kelas 6)
                                        </span>
                                        <span className="text-[11px] text-slate-400 font-mono">
                                            22 September 2026
                                        </span>
                                    </div>
                                    <p className="text-xs font-medium text-slate-700">
                                        Topik: Konsultasi Persiapan Asesmen Akhir Jenjang Sekolah Dasar
                                    </p>
                                    <p className="text-xs text-slate-500 bg-[#F8F9FA] p-3 rounded-xl">
                                        Rencana Tindak Lanjut: Pemberian bimbingan belajar tambahan di luar jam pelajaran dan penguatan motivasi kepercayaan diri.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                )}

                {/* TAB 2: PELANGGARAN (Only for Staff/Teachers/Admin) */}
                {tab === 'pelanggaran' && !isStudent && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-[#F8F9FA] text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="px-4 py-3.5">Tanggal</th>
                                        <th className="px-4 py-3.5">Nama Siswa</th>
                                        <th className="px-4 py-3.5">Uraian Pelanggaran Kedisiplinan</th>
                                        <th className="px-4 py-3.5 text-center">Poin Sanksi</th>
                                        <th className="px-4 py-3.5">Tindakan Pembinaan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    <tr className="hover:bg-[#FDF2F4]/50 transition">
                                        <td className="px-4 py-3.5 font-mono text-slate-600">18 September 2026</td>
                                        <td className="px-4 py-3.5 font-bold text-slate-900">Siswa Binaan (Kelas 5)</td>
                                        <td className="px-4 py-3.5 text-slate-700">Terlambat masuk kelas melebihi 15 menit tanpa surat izin</td>
                                        <td className="px-4 py-3.5 text-center">
                                            <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                                                5 Poin
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-slate-600">Teguran lisan & piket kebersihan kelas</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 3: PRESTASI */}
                {tab === 'prestasi' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#E8B4B8] transition space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                                    Tingkat Kabupaten
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono">Agustus 2026</span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900">
                                Juara 1 Olimpiade Sains Nasional (OSN) IPA SD
                            </h4>
                            <p className="text-xs text-slate-600">
                                Diraih oleh Siti Nurhaliza (Kelas 6) mewakili Kecamatan Gandangbatu Sillanan di Tana Toraja.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

