import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Trophy,
    CheckCircle2,
    XCircle,
    Clock,
    FileText,
    ArrowLeft,
    Eye,
    RotateCcw,
    AlertCircle,
    TrendingUp,
    Award
} from 'lucide-react';

export default function StudentExamResult({ auth, attempt, statistics }) {
    const formatScore = (val) => {
        if (val === null || val === undefined || isNaN(val)) return 0;
        return Math.round(Number(val));
    };

    const getGradeColor = (percentage) => {
        const val = Number(percentage || 0);
        if (val >= 85) return 'text-emerald-600';
        if (val >= 70) return 'text-blue-600';
        if (val >= 60) return 'text-orange-600';
        return 'text-red-600';
    };

    const getGradeLabel = (percentage) => {
        const val = Number(percentage || 0);
        if (val >= 85) return 'A';
        if (val >= 70) return 'B';
        if (val >= 60) return 'C';
        return 'D';
    };

    const isPassed = Boolean(statistics?.is_passed);
    const maxAttempts = Number(attempt?.exam?.max_attempts || 1);
    const attemptNum = Number(attempt?.attempt_number || 1);
    const canRetry = maxAttempts === 999 || attemptNum < maxAttempts;

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
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">
                            Hasil Evaluasi Ujian
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {attempt.exam?.title}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={`Hasil Ujian - ${attempt.exam?.title}`} />

            <div className="space-y-6 max-w-4xl mx-auto">
                {/* Result Hero Card */}
                <div className={`rounded-3xl p-8 text-white shadow-lg ${
                    isPassed 
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-700' 
                        : 'bg-gradient-to-r from-[#800020] to-[#5C0017]'
                }`}>
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                                {isPassed ? (
                                    <CheckCircle2 className="w-6 h-6 text-white" />
                                ) : (
                                    <AlertCircle className="w-6 h-6 text-white" />
                                )}
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white">
                                    Percobaan #{attempt.attempt_number}
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
                                {isPassed ? 'Selamat! Anda Berhasil Lulus' : 'Belum Memenuhi KKM'}
                            </h1>
                            <p className="text-sm text-white/90">
                                {isPassed 
                                    ? 'Capaian nilai Anda telah memenuhi kriteria ketuntasan minimal.'
                                    : `Batas nilai ketuntasan minimal (KKM): ${attempt.exam?.passing_score}`
                                }
                            </p>
                        </div>
                        <Trophy className="w-16 h-16 text-white opacity-20 shrink-0" />
                    </div>

                    {/* Score Display */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                        <div className="text-center">
                            <p className="text-xs text-white/80 uppercase tracking-wider font-bold mb-2">Skor Akhir Anda</p>
                            <div className="flex items-center justify-center gap-4">
                                <span className="text-6xl font-black text-white">
                                    {formatScore(attempt.percentage)}
                                </span>
                                <div className="text-left pl-2 border-l border-white/20">
                                    <p className="text-3xl font-extrabold text-white">{getGradeLabel(attempt.percentage)}</p>
                                    <p className="text-xs text-white/70">Predikat</p>
                                </div>
                            </div>
                            <p className="text-xs text-white/80 mt-3">
                                Total Poin: <strong>{formatScore(attempt.total_score)}</strong> dari {attempt.exam?.total_points || (statistics?.total_questions || 0) * 10} poin maksimal
                            </p>
                        </div>
                    </div>

                    {/* Submission Info */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-white/80 pt-2 border-t border-white/10">
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1.5" />
                            Diserahkan: {attempt.submitted_at ? new Date(attempt.submitted_at).toLocaleString('id-ID') : '-'}
                        </div>
                        {attempt.auto_submitted && (
                            <span className="text-[11px] bg-white/20 px-2.5 py-0.5 rounded-full font-semibold">
                                Otomatis dikumpulkan sistem
                            </span>
                        )}
                    </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <FileText className="w-5 h-5 text-blue-500" />
                            <TrendingUp className="w-4 h-4 text-slate-400" />
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Soal</p>
                        <p className="text-2xl font-extrabold text-slate-900 mt-1">{statistics?.total_questions || 0}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            <TrendingUp className="w-4 h-4 text-slate-400" />
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Terjawab</p>
                        <p className="text-2xl font-extrabold text-emerald-600 mt-1">{statistics?.answered || 0}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <Trophy className="w-5 h-5 text-amber-500" />
                            <TrendingUp className="w-4 h-4 text-slate-400" />
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Poin Diperoleh</p>
                        <p className="text-2xl font-extrabold text-amber-600 mt-1">{formatScore(attempt.total_score)}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <Award className="w-5 h-5 text-purple-500" />
                            <TrendingUp className="w-4 h-4 text-slate-400" />
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Persentase</p>
                        <p className="text-2xl font-extrabold text-purple-600 mt-1">{formatScore(attempt.percentage)}%</p>
                    </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Rincian Hasil Pengerjaan per Jenis Soal
                    </h3>
                    <div className="space-y-3">
                        {/* Multiple Choice */}
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mr-3 text-blue-700">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Pilihan Ganda</p>
                                    <p className="text-xs text-slate-500">Penilaian otomatis oleh sistem</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-base font-extrabold text-blue-700">{statistics?.mc_correct || '0/0'}</p>
                                <p className="text-[11px] font-semibold text-slate-400">benar</p>
                            </div>
                        </div>

                        {/* Short Answer */}
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mr-3 text-emerald-700">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Isian Singkat</p>
                                    <p className="text-xs text-slate-500">Pencocokan kata otomatis</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-base font-extrabold text-emerald-700">{statistics?.short_correct || '0/0'}</p>
                                <p className="text-[11px] font-semibold text-slate-400">benar</p>
                            </div>
                        </div>

                        {/* Essay */}
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mr-3 text-amber-700">
                                    <Award className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Essay / Uraian</p>
                                    <p className="text-xs text-slate-500">Koreksi & penilaian langsung oleh guru</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-base font-extrabold text-amber-700">{statistics?.essay_graded || '0/0'}</p>
                                <p className="text-[11px] font-semibold text-slate-400">telah dinilai</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Waiting for Essay Grading */}
                {statistics?.essay_graded && statistics.essay_graded.includes('/') && statistics.essay_graded.split('/')[0] !== statistics.essay_graded.split('/')[1] && (
                    <div className="bg-amber-50 border-l-4 border-amber-500 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-start">
                            <Clock className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="text-sm font-bold text-amber-900 mb-1">
                                    Menunggu Koreksi Essay
                                </h3>
                                <p className="text-xs text-amber-800 leading-relaxed">
                                    Beberapa soal essay Anda masih dalam proses penilaian oleh guru mata pelajaran. Nilai akhir Anda akan otomatis diperbarui dan disinkronkan ke E-Rapor setelah seluruh essay selesai dikoreksi.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    {attempt.exam?.show_review && (
                        <Link
                            href={route('student.exams.review', attempt.id)}
                            className="flex-1 flex items-center justify-center px-6 py-3.5 rounded-2xl bg-white border-2 border-[#800020] text-[#800020] hover:bg-[#FDF2F4] text-xs font-bold transition shadow-sm"
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            Review Pembahasan Jawaban
                        </Link>
                    )}
                    
                    {canRetry && !isPassed && (
                        <Link
                            href={route('student.exams.show', attempt.exam.id)}
                            className="flex-1 flex items-center justify-center px-6 py-3.5 rounded-2xl bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold transition shadow-md"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Coba Ujian Kembali
                        </Link>
                    )}

                    <Link
                        href={route('student.exams.index')}
                        className="flex-1 flex items-center justify-center px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                    >
                        Kembali ke Katalog Ujian
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
