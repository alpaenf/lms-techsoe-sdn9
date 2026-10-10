import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Clock, 
    BookOpen, 
    CheckCircle2, 
    AlertTriangle,
    Calendar,
    FileText,
    ArrowLeft,
    Trophy,
    Timer,
    PlayCircle,
    X,
    ShieldAlert
} from 'lucide-react';

export default function StudentExamsShow({ auth, exam, attempts = [], can_attempt, total_questions }) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isStarting, setIsStarting] = useState(false);

    const getCategoryLabel = (category) => {
        const labels = {
            uts: 'UTS',
            uas: 'UAS',
            ulangan_harian: 'Ulangan Harian',
            ujian_sekolah: 'Ujian Sekolah',
            kuis: 'Kuis'
        };
        return labels[category] || category;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const cleanStr = String(dateString).replace(' ', 'T');
        const date = new Date(cleanStr);
        if (isNaN(date.getTime())) return '-';
        return date.toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleConfirmStart = () => {
        if (!can_attempt || isStarting) return;
        setIsStarting(true);
        router.post(route('student.exams.start', exam.id), {}, {
            onFinish: () => {
                setIsStarting(false);
                setShowConfirmModal(false);
            }
        });
    };

    const inProgressAttempt = attempts.find(a => a.status === 'in_progress');
    const completedAttempts = attempts.filter(a => a.status !== 'in_progress');
    const bestScore = completedAttempts.length > 0 
        ? Math.max(...completedAttempts.map(a => a.percentage || 0))
        : null;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link 
                        href={route('student.exams.index')}
                        className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            Detail Ujian
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {exam.subject?.name}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={`${exam.title} - Ujian Online`} />

            <div className="space-y-6 max-w-4xl mx-auto">
                {/* Exam Info Card */}
                <div className="bg-gradient-to-r from-[#800020] to-[#5C0017] rounded-3xl p-8 text-white shadow-lg">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white mb-3">
                                {getCategoryLabel(exam.exam_category)}
                            </span>
                            <h1 className="text-2xl font-bold mb-2">{exam.title}</h1>
                            {exam.description && (
                                <p className="text-sm text-slate-200 leading-relaxed">{exam.description}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <Clock className="w-5 h-5 text-white/70 mb-2" />
                            <p className="text-xs text-white/70">Durasi</p>
                            <p className="text-lg font-bold text-white">{exam.duration_minutes} menit</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <FileText className="w-5 h-5 text-white/70 mb-2" />
                            <p className="text-xs text-white/70">Soal</p>
                            <p className="text-lg font-bold text-white">{total_questions} soal</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <Trophy className="w-5 h-5 text-white/70 mb-2" />
                            <p className="text-xs text-white/70">Percobaan</p>
                            <p className="text-lg font-bold text-white">
                                {attempts.length}/{exam.max_attempts === 999 ? '∞' : exam.max_attempts}
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <CheckCircle2 className="w-5 h-5 text-white/70 mb-2" />
                            <p className="text-xs text-white/70">Nilai KKM</p>
                            <p className="text-lg font-bold text-white">{exam.passing_score}</p>
                        </div>
                    </div>
                </div>

                {/* In Progress Warning */}
                {inProgressAttempt && (
                    <div className="bg-orange-50 border-l-4 border-orange-500 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-start">
                            <Timer className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-orange-900 mb-1">
                                    Sesi Ujian Sedang Berjalan
                                </h3>
                                <p className="text-xs text-orange-700 mb-3 leading-relaxed">
                                    Anda memiliki sesi pengerjaan aktif untuk percobaan ke-{inProgressAttempt.attempt_number}. Silakan lanjutkan pengerjaan Anda.
                                </p>
                                <Link
                                    href={route('student.exams.take', inProgressAttempt.id)}
                                    className="inline-flex items-center px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition shadow-sm"
                                >
                                    <PlayCircle className="w-4 h-4 mr-2" />
                                    Lanjutkan Pengerjaan Ujian
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Start Exam Card */}
                {!inProgressAttempt && can_attempt && (
                    <div className="bg-white rounded-3xl p-7 border-2 border-[#800020]/20 shadow-sm space-y-5">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 mb-2">Petunjuk & Persiapan Memulai Ujian</h3>
                            <ul className="space-y-2.5 text-xs text-slate-600">
                                <li className="flex items-start">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Pastikan koneksi internet Anda stabil sebelum menekan tombol mulai.</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Timer hitung mundur ({exam.duration_minutes} menit) akan langsung berjalan setelah Anda memulai.</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Jawaban Anda disimpan otomatis secara berkala di latar belakang.</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Sisa kuota pengerjaan Anda: <strong>{exam.max_attempts === 999 ? 'Tak Terbatas' : `${exam.max_attempts - attempts.length} kali`}</strong>.</span>
                                </li>
                            </ul>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowConfirmModal(true)}
                            className="w-full flex items-center justify-center px-6 py-3.5 rounded-2xl bg-[#800020] hover:bg-[#5C0017] text-white text-sm font-bold transition shadow-md"
                        >
                            <PlayCircle className="w-5 h-5 mr-2" />
                            Mulai Ujian Sekarang
                        </button>
                    </div>
                )}

                {/* No More Attempts */}
                {!inProgressAttempt && !can_attempt && (
                    <div className="bg-slate-50 border-l-4 border-slate-400 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-start">
                            <AlertTriangle className="w-5 h-5 text-slate-500 mr-3 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-slate-900 mb-1">
                                    Batas Percobaan Tercapai
                                </h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Anda telah menggunakan seluruh kuota percobaan yang dialokasikan untuk paket ujian ini.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Schedule Info */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-wider">
                        Jadwal Ketersediaan Asesmen
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                            <Calendar className="w-5 h-5 text-emerald-600 mr-3 mt-0.5" />
                            <div>
                                <p className="text-[11px] font-bold text-slate-500 uppercase">Mulai Dibuka</p>
                                <p className="text-xs font-bold text-slate-900 mt-0.5">{formatDate(exam.start_time)}</p>
                            </div>
                        </div>
                        <div className="flex items-start p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                            <Calendar className="w-5 h-5 text-rose-600 mr-3 mt-0.5" />
                            <div>
                                <p className="text-[11px] font-bold text-slate-500 uppercase">Batas Ditutup</p>
                                <p className="text-xs font-bold text-slate-900 mt-0.5">{formatDate(exam.end_time)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attempts History */}
                {completedAttempts.length > 0 && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                Riwayat Percobaan Anda
                            </h3>
                            {bestScore !== null && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <Trophy className="w-3.5 h-3.5 mr-1" />
                                    Nilai Tertinggi: {Math.round(Number(bestScore))}
                                </span>
                            )}
                        </div>
                        <div className="space-y-3">
                            {completedAttempts.map((attempt) => (
                                <Link
                                    key={attempt.id}
                                    href={route('student.exams.result', attempt.id)}
                                    className="block bg-slate-50 hover:bg-[#FDF2F4] rounded-2xl p-4 border border-slate-200 hover:border-[#800020] transition group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-900 group-hover:text-[#800020] transition">
                                                Percobaan #{attempt.attempt_number}
                                            </p>
                                            <p className="text-[11px] text-slate-500">
                                                Diserahkan: {new Date(attempt.submitted_at).toLocaleString('id-ID')}
                                                {attempt.auto_submitted && ' • (Auto-submit sistem)'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-extrabold text-[#800020]">
                                                {Math.round(Number(attempt.percentage || 0))}
                                            </p>
                                            <p className="text-[10px] font-semibold text-slate-500">
                                                {attempt.status === 'graded' ? 'Dinilai' : 'Menunggu Koreksi'}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* In-Page Confirmation Modal (Tanpa browser alert/confirm) */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-scale-up">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-[#FDF2F4] text-[#800020] flex items-center justify-center font-bold">
                                    <ShieldAlert className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Konfirmasi Memulai Ujian
                                    </h3>
                                    <p className="text-[11px] text-slate-500">
                                        Percobaan ke-{(attempts.length || 0) + 1}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowConfirmModal(false)}
                                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-2">
                            <p className="font-bold">Perhatikan ketentuan berikut:</p>
                            <ul className="space-y-1 text-[11px] text-amber-800">
                                <li>• Durasi pengerjaan: <strong>{exam.duration_minutes} menit</strong>.</li>
                                <li>• Timer hitung mundur akan langsung berjalan saat Anda menekan tombol di bawah.</li>
                                <li>• Dilarang menutup atau merefresh halaman saat ujian sedang berlangsung.</li>
                            </ul>
                        </div>

                        <p className="text-xs text-slate-600 font-medium text-center">
                            Apakah Anda sudah siap memulai pengerjaan sekarang?
                        </p>

                        <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setShowConfirmModal(false)}
                                disabled={isStarting}
                                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                            >
                                Belum, Periksa Lagi
                            </button>

                            <button
                                type="button"
                                onClick={handleConfirmStart}
                                disabled={isStarting}
                                className="flex-1 py-2.5 rounded-xl bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
                            >
                                {isStarting ? 'Menyiapkan...' : 'Ya, Mulai Sekarang'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
