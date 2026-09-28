import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    ArrowLeft, 
    Download, 
    Award, 
    TrendingUp, 
    CheckCircle2, 
    XCircle, 
    Clock, 
    Search, 
    FileText, 
    Edit3, 
    X,
    Save,
    HelpCircle,
    User
} from 'lucide-react';

export default function ExamsResults({ auth, exam, attempts = [], statistics = {} }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [gradingModal, setGradingModal] = useState({
        isOpen: false,
        attempt: null,
        essayAnswers: [],
        currentIndex: 0,
        points: 0,
        feedback: ''
    });

    const filteredAttempts = attempts.filter(a => 
        a.student?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.student?.nis?.includes(searchQuery)
    );

    const openGradingModal = (attempt) => {
        const essays = (attempt.answers || []).filter(ans => ans.question?.question_type === 'essay');
        if (essays.length === 0) {
            alert('Tidak ada soal essay pada ujian ini untuk dinilai.');
            return;
        }

        setGradingModal({
            isOpen: true,
            attempt,
            essayAnswers: essays,
            currentIndex: 0,
            points: essays[0].points_earned || 0,
            feedback: essays[0].feedback || ''
        });
    };

    const handleSelectEssay = (idx) => {
        const target = gradingModal.essayAnswers[idx];
        setGradingModal(prev => ({
            ...prev,
            currentIndex: idx,
            points: target.points_earned || 0,
            feedback: target.feedback || ''
        }));
    };

    const handleSaveEssayGrade = (e) => {
        e.preventDefault();
        const currentEssay = gradingModal.essayAnswers[gradingModal.currentIndex];
        if (!currentEssay) return;

        router.post(
            route('exams.grade', currentEssay.id),
            {
                points_earned: gradingModal.points,
                feedback: gradingModal.feedback
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Update local essay answer in modal
                    const updatedEssays = [...gradingModal.essayAnswers];
                    updatedEssays[gradingModal.currentIndex] = {
                        ...updatedEssays[gradingModal.currentIndex],
                        points_earned: gradingModal.points,
                        feedback: gradingModal.feedback,
                        is_correct: Number(gradingModal.points) === Number(currentEssay.question.points)
                    };

                    // Check if next essay exists
                    if (gradingModal.currentIndex < updatedEssays.length - 1) {
                        const nextIdx = gradingModal.currentIndex + 1;
                        setGradingModal(prev => ({
                            ...prev,
                            essayAnswers: updatedEssays,
                            currentIndex: nextIdx,
                            points: updatedEssays[nextIdx].points_earned || 0,
                            feedback: updatedEssays[nextIdx].feedback || ''
                        }));
                    } else {
                        setGradingModal(prev => ({
                            ...prev,
                            essayAnswers: updatedEssays
                        }));
                        alert('Nilai essay berhasil disimpan dan skor akhir ujian telah disinkronkan ke E-Rapor!');
                    }
                }
            }
        );
    };

    const handleExport = () => {
        router.get(route('exams.export', exam.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('exams.show', exam.id)}
                            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 leading-tight">
                                Rekapitulasi Nilai & Koreksi Ujian
                            </h2>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                                {exam.title} • {exam.class?.name || 'Semua Rombel'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleExport}
                            className="inline-flex items-center px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
                        >
                            <Download className="w-4 h-4 mr-1.5" />
                            Ekspor Nilai (.xlsx)
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Hasil & Nilai - ${exam.title}`} />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Statistics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                        <p className="text-[11px] font-bold text-slate-500 uppercase">Siswa Selesai</p>
                        <p className="text-xl font-bold text-slate-900 mt-1">{statistics.completed || 0} / {statistics.total_students || 0}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                        <p className="text-[11px] font-bold text-slate-500 uppercase">Rata-rata Skor</p>
                        <p className="text-xl font-bold text-[#800020] mt-1">{statistics.average_score || 0}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                        <p className="text-[11px] font-bold text-slate-500 uppercase">Nilai Tertinggi</p>
                        <p className="text-xl font-bold text-emerald-600 mt-1">{statistics.highest_score || 0}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                        <p className="text-[11px] font-bold text-slate-500 uppercase">Nilai Terendah</p>
                        <p className="text-xl font-bold text-rose-600 mt-1">{statistics.lowest_score || 0}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                        <p className="text-[11px] font-bold text-slate-500 uppercase">Lulus KKM</p>
                        <p className="text-xl font-bold text-emerald-600 mt-1">{statistics.passed || 0}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                        <p className="text-[11px] font-bold text-slate-500 uppercase">Belum Lulus</p>
                        <p className="text-xl font-bold text-rose-600 mt-1">{statistics.failed || 0}</p>
                    </div>
                </div>

                {/* Table of Results */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="relative flex-1 max-w-md">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama siswa atau NIS..."
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:border-[#800020] focus:ring-[#800020]"
                            />
                        </div>

                        <span className="text-xs font-bold text-slate-500">
                            Total {filteredAttempts.length} Berkas Ujian
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-y border-slate-200">
                                <tr>
                                    <th className="py-3.5 px-4">Peringkat</th>
                                    <th className="py-3.5 px-4">Nama Siswa</th>
                                    <th className="py-3.5 px-4">NIS</th>
                                    <th className="py-3.5 px-4">Percobaan</th>
                                    <th className="py-3.5 px-4">Waktu Selesai</th>
                                    <th className="py-3.5 px-4 text-center">Status KKM</th>
                                    <th className="py-3.5 px-4 text-right">Skor Total</th>
                                    <th className="py-3.5 px-4 text-center">Aksi & Koreksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                                {filteredAttempts.length > 0 ? (
                                    filteredAttempts.map((att, idx) => {
                                        const isPassed = Number(att.percentage) >= Number(exam.passing_score);
                                        const hasEssay = (att.answers || []).some(a => a.question?.question_type === 'essay');
                                        const hasUngradedEssay = (att.answers || []).some(a => a.question?.question_type === 'essay' && a.is_correct === null);

                                        return (
                                            <tr key={att.id} className="hover:bg-slate-50/70 transition">
                                                <td className="py-3.5 px-4">
                                                    <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                                                        idx === 0 ? 'bg-amber-100 text-amber-800' :
                                                        idx === 1 ? 'bg-slate-200 text-slate-700' :
                                                        idx === 2 ? 'bg-orange-100 text-orange-800' :
                                                        'text-slate-400'
                                                    }`}>
                                                        {idx + 1}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 font-bold text-slate-900">
                                                    {att.student?.full_name}
                                                </td>
                                                <td className="py-3.5 px-4 text-slate-600 font-mono">
                                                    {att.student?.nis || '-'}
                                                </td>
                                                <td className="py-3.5 px-4 text-slate-700">
                                                    Ke-{att.attempt_number}
                                                </td>
                                                <td className="py-3.5 px-4 text-slate-600">
                                                    {att.submitted_at ? new Date(att.submitted_at).toLocaleString('id-ID') : '-'}
                                                </td>
                                                <td className="py-3.5 px-4 text-center">
                                                    {isPassed ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                                            Lulus KKM
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                                            <XCircle className="w-3 h-3 mr-1" />
                                                            Belum Lulus
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3.5 px-4 text-right">
                                                    <span className="text-base font-extrabold text-[#800020]">
                                                        {Math.round(Number(att.percentage || 0))}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-center">
                                                    {hasEssay && (
                                                        <button
                                                            onClick={() => openGradingModal(att)}
                                                            className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                                                                hasUngradedEssay
                                                                    ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                                                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                                            }`}
                                                        >
                                                            <Edit3 className="w-3.5 h-3.5 mr-1" />
                                                            {hasUngradedEssay ? 'Nilai Essay' : 'Cek Essay'}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="py-8 text-center text-slate-500">
                                            Belum ada data pengerjaan ujian dari siswa.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Essay Grading */}
            {gradingModal.isOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">
                                    Lembar Koreksi Essay Siswa
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {gradingModal.attempt?.student?.full_name} ({gradingModal.attempt?.student?.nis})
                                </p>
                            </div>
                            <button
                                onClick={() => setGradingModal(prev => ({ ...prev, isOpen: false }))}
                                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Essay Nav Selector */}
                        <div className="flex items-center gap-2">
                            {gradingModal.essayAnswers.map((ans, idx) => (
                                <button
                                    key={ans.id}
                                    onClick={() => handleSelectEssay(idx)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                                        gradingModal.currentIndex === idx
                                            ? 'bg-[#800020] text-white shadow-sm'
                                            : ans.graded_at
                                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    Essay #{idx + 1} {ans.graded_at && '✓'}
                                </button>
                            ))}
                        </div>

                        {/* Current Question and Student Answer */}
                        {gradingModal.essayAnswers[gradingModal.currentIndex] && (
                            <form onSubmit={handleSaveEssayGrade} className="space-y-4">
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-[#800020] uppercase tracking-wider">
                                            Soal Pertanyaan:
                                        </span>
                                        <span className="text-xs font-bold text-slate-500">
                                            Maksimal: {gradingModal.essayAnswers[gradingModal.currentIndex].question?.points} Poin
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-900 leading-relaxed">
                                        {gradingModal.essayAnswers[gradingModal.currentIndex].question?.question_text}
                                    </p>
                                </div>

                                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                                    <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                                        Jawaban Tertulis Siswa:
                                    </span>
                                    <p className="text-sm text-slate-900 leading-relaxed whitespace-pre-wrap">
                                        {gradingModal.essayAnswers[gradingModal.currentIndex].answer_text || '(Tidak dijawab oleh siswa)'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Beri Poin Nilai (0 - {gradingModal.essayAnswers[gradingModal.currentIndex].question?.points}) <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            max={gradingModal.essayAnswers[gradingModal.currentIndex].question?.points || 100}
                                            required
                                            value={gradingModal.points}
                                            onChange={(e) => setGradingModal(prev => ({ ...prev, points: Number(e.target.value) }))}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Catatan / Umpan Balik Guru (Opsional)
                                        </label>
                                        <input
                                            type="text"
                                            value={gradingModal.feedback}
                                            onChange={(e) => setGradingModal(prev => ({ ...prev, feedback: e.target.value }))}
                                            placeholder="Contoh: Pembahasan bagus dan logis..."
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#800020] focus:ring-[#800020]"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <span className="text-[11px] text-slate-400">
                                        Nilai akan langsung diperhitungkan ke dalam total skor siswa.
                                    </span>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setGradingModal(prev => ({ ...prev, isOpen: false }))}
                                            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                                        >
                                            Tutup
                                        </button>
                                        <button
                                            type="submit"
                                            className="inline-flex items-center px-5 py-2 rounded-xl bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold transition shadow-sm"
                                        >
                                            <Save className="w-4 h-4 mr-1.5" />
                                            Simpan Nilai Essay
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
