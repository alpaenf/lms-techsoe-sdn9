import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
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
    MessageSquareQuote,
    CheckCircle2,
    Trash2,
    Trophy,
    Shield
} from 'lucide-react';
import ModalSesiKonseling from './Modals/ModalSesiKonseling';
import ModalPelanggaran from './Modals/ModalPelanggaran';
import ModalPrestasi from './Modals/ModalPrestasi';

export default function BKIndex({ 
    sessions = [], 
    violations = [], 
    achievements = [], 
    students = [], 
    counselors = [] 
}) {
    const { auth } = usePage().props;
    const userRole = auth?.user?.role || 'admin';
    const isStudent = userRole === 'siswa';
    const isGuruOrAdmin = userRole === 'admin' || userRole === 'guru' || userRole === 'bk' || userRole === 'pimpinan';

    const [tab, setTab] = useState(isStudent ? 'prestasi' : 'konseling');
    const [notification, setNotification] = useState(null);

    // Modal States
    const [isModalSessionOpen, setIsModalSessionOpen] = useState(false);
    const [isModalViolationOpen, setIsModalViolationOpen] = useState(false);
    const [isModalAchievementOpen, setIsModalAchievementOpen] = useState(false);

    const handleDeleteSession = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus catatan sesi konseling ini?')) {
            router.delete(route('bk.sessions.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    setNotification('Catatan sesi konseling berhasil dihapus.');
                    setTimeout(() => setNotification(null), 4000);
                }
            });
        }
    };

    const handleDeleteViolation = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus catatan pelanggaran ini?')) {
            router.delete(route('bk.violations.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    setNotification('Catatan pelanggaran berhasil dihapus.');
                    setTimeout(() => setNotification(null), 4000);
                }
            });
        }
    };

    const handleDeleteAchievement = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data prestasi ini?')) {
            router.delete(route('bk.achievements.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    setNotification('Data prestasi berhasil dihapus.');
                    setTimeout(() => setNotification(null), 4000);
                }
            });
        }
    };

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
                                ? 'Galeri Kebanggaan Prestasi Siswa & Konsultasi Ramah Anak UPT SDN 9'
                                : 'Buku Sesi Bimbingan Siswa, Inventarisasi Kedisiplinan & Piagam Prestasi'}
                        </p>
                    </div>

                    <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                        {!isStudent && (
                            <>
                                <button
                                    onClick={() => setTab('konseling')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                        tab === 'konseling'
                                            ? 'bg-[#800020] text-white shadow-sm'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Sesi Konseling ({sessions ? sessions.length : 0})
                                </button>
                                <button
                                    onClick={() => setTab('pelanggaran')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                        tab === 'pelanggaran'
                                            ? 'bg-[#800020] text-white shadow-sm'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Pelanggaran & Poin ({violations ? violations.length : 0})
                                </button>
                            </>
                        )}

                        <button
                            onClick={() => setTab('prestasi')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                tab === 'prestasi'
                                    ? 'bg-[#800020] text-white shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            {isStudent ? 'Galeri Prestasi' : `Catatan Prestasi (${achievements ? achievements.length : 0})`}
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={isStudent ? "Prestasi & Bimbingan" : "Bimbingan Konseling"} />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Notification toast */}
                {notification && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center space-x-3 shadow-sm animate-fade-in">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="text-xs font-semibold">{notification}</span>
                    </div>
                )}

                {/* Action Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-xs text-slate-500 font-medium">
                        Guru BK Penanggung Jawab: <span className="font-bold text-slate-900">Maria Rante, S.Pd.</span>
                    </span>

                    {isStudent ? (
                        <button 
                            onClick={() => setIsModalSessionOpen(true)}
                            className="px-4 py-2.5 bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold rounded-xl inline-flex items-center space-x-1.5 shadow-md transition"
                        >
                            <HeartHandshake className="w-4 h-4" />
                            <span>Ajukan Sesi Konseling BK</span>
                        </button>
                    ) : (
                        <div className="flex items-center space-x-2">
                            {tab === 'konseling' && (
                                <button 
                                    onClick={() => setIsModalSessionOpen(true)}
                                    className="px-4 py-2 bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold rounded-xl inline-flex items-center space-x-1.5 shadow-md transition"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    <span>Tambah Catatan Konseling</span>
                                </button>
                            )}
                            {tab === 'pelanggaran' && (
                                <button 
                                    onClick={() => setIsModalViolationOpen(true)}
                                    className="px-4 py-2 bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold rounded-xl inline-flex items-center space-x-1.5 shadow-md transition"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    <span>Catat Pelanggaran Baru</span>
                                </button>
                            )}
                            {tab === 'prestasi' && (
                                <button 
                                    onClick={() => setIsModalAchievementOpen(true)}
                                    className="px-4 py-2 bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold rounded-xl inline-flex items-center space-x-1.5 shadow-md transition"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    <span>Input Prestasi Siswa</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* TAB 1: KONSELING */}
                {tab === 'konseling' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-slate-900">
                                Riwayat Sesi Bimbingan & Konseling Peserta Didik
                            </h3>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-700 border border-blue-500/20">
                                Total: {sessions.length} Sesi
                            </span>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {sessions && sessions.length > 0 ? (
                                sessions.map((sess) => (
                                    <div key={sess.id} className="py-4 space-y-2 hover:bg-[#FDF2F4]/30 p-3 rounded-2xl transition">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-bold text-slate-900">
                                                    {sess.student_name || 'Peserta Didik'}
                                                </span>
                                                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-500/10 text-purple-700 border border-purple-500/20">
                                                    Pembimbing: {sess.counselor_name || 'Maria Rante, S.Pd.'}
                                                </span>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <span className="text-xs text-slate-400 font-mono">
                                                    {sess.session_date}
                                                </span>
                                                {isGuruOrAdmin && (
                                                    <button
                                                        onClick={() => handleDeleteSession(sess.id)}
                                                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition"
                                                        title="Hapus Catatan"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-xs font-bold text-[#800020]">
                                            Topik: {sess.topic}
                                        </p>

                                        <div className="text-xs text-slate-600 bg-[#F8F9FA] p-3.5 rounded-xl border border-slate-100 space-y-1">
                                            <span className="font-bold text-slate-800 block">Rencana Tindak Lanjut & Kesepakatan:</span>
                                            <p className="leading-relaxed">{sess.action_plan}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-slate-400">
                                    Belum ada catatan sesi bimbingan konseling.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 2: PELANGGARAN & POIN */}
                {tab === 'pelanggaran' && !isStudent && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
                        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">
                                    Buku Catatan Pelanggaran Kedisiplinan & Poin Sanksi
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Inventarisasi pelanggaran tata tertib dan tindakan pembinaan karakter
                                </p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-[#F8F9FA] text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="px-4 py-3.5">Tanggal</th>
                                        <th className="px-4 py-3.5">Nama Peserta Didik</th>
                                        <th className="px-4 py-3.5">Uraian Pelanggaran</th>
                                        <th className="px-4 py-3.5 text-center">Poin Sanksi</th>
                                        <th className="px-4 py-3.5">Tindakan Pembinaan</th>
                                        <th className="px-4 py-3.5 text-center">Surat Ortu</th>
                                        <th className="px-4 py-3.5 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {violations && violations.length > 0 ? (
                                        violations.map((vio) => (
                                            <tr key={vio.id} className="hover:bg-[#FDF2F4]/40 transition">
                                                <td className="px-4 py-3.5 font-mono text-slate-600">{vio.violation_date}</td>
                                                <td className="px-4 py-3.5 font-bold text-slate-900">{vio.student_name}</td>
                                                <td className="px-4 py-3.5 text-slate-700">{vio.violation_name}</td>
                                                <td className="px-4 py-3.5 text-center">
                                                    <span className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-700 border border-rose-500/20 font-semibold text-[11px]">
                                                        +{vio.penalty_points} Poin
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5 text-slate-600">{vio.sanction_action}</td>
                                                <td className="px-4 py-3.5 text-center">
                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                                                        vio.call_letter_sent 
                                                            ? 'bg-rose-500/10 text-rose-700 border-rose-500/20' 
                                                            : 'bg-slate-100 text-slate-500 border-slate-200'
                                                    }`}>
                                                        {vio.call_letter_sent ? 'Dikirim' : 'Tidak'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5 text-center">
                                                    <button
                                                        onClick={() => handleDeleteViolation(vio.id)}
                                                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                                                        title="Hapus Pelanggaran"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="text-center py-8 text-slate-400">
                                                Tidak ada catatan pelanggaran kedisiplinan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 3: GALERI PRESTASI */}
                {tab === 'prestasi' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-slate-900">
                                Galeri Kebanggaan Prestasi Siswa UPT SDN 9 Gandangbatu Sillanan
                            </h3>
                            <span className="text-xs text-slate-500 font-medium">
                                Total Prestasi: <strong className="text-slate-900">{achievements.length} Piagam</strong>
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {achievements && achievements.length > 0 ? (
                                achievements.map((ach) => (
                                    <div key={ach.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#E8B4B8] transition space-y-3 relative group">
                                        <div className="flex items-center justify-between">
                                            <span className={`px-2.5 py-1 rounded-md border text-[10px] font-semibold uppercase tracking-wider ${
                                                ach.level === 'nasional' ? 'bg-amber-500/10 text-amber-700 border-amber-500/20' :
                                                ach.level === 'provinsi' ? 'bg-purple-500/10 text-purple-700 border-purple-500/20' :
                                                ach.level === 'kabupaten' ? 'bg-blue-500/10 text-blue-700 border-blue-500/20' : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                                            }`}>
                                                Tingkat {ach.level}
                                            </span>
                                            <span className="text-[11px] text-slate-400 font-mono">{ach.event_date}</span>
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-200 shrink-0">
                                                <Trophy className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                                                    {ach.title}
                                                </h4>
                                                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                                                    {ach.rank} &bull; <span className="text-slate-900 font-bold">{ach.student_name}</span>
                                                </p>
                                            </div>
                                        </div>

                                        {isGuruOrAdmin && (
                                            <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                                                <button
                                                    onClick={() => handleDeleteAchievement(ach.id)}
                                                    className="text-xs text-slate-400 hover:text-rose-600 font-semibold transition inline-flex items-center space-x-1"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    <span>Hapus</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-3 bg-white p-8 text-center rounded-2xl border border-slate-200 text-slate-400">
                                    Belum ada data prestasi siswa yang dicatat.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <ModalSesiKonseling 
                isOpen={isModalSessionOpen}
                onClose={() => setIsModalSessionOpen(false)}
                students={students}
                counselors={counselors}
            />

            <ModalPelanggaran 
                isOpen={isModalViolationOpen}
                onClose={() => setIsModalViolationOpen(false)}
                students={students}
            />

            <ModalPrestasi 
                isOpen={isModalAchievementOpen}
                onClose={() => setIsModalAchievementOpen(false)}
                students={students}
            />
        </AuthenticatedLayout>
    );
}
