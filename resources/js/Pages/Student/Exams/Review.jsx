import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    ArrowLeft,
    CheckCircle2,
    XCircle,
    HelpCircle,
    Award,
    FileText,
    ChevronLeft,
    ChevronRight,
    MessageSquare,
    Eye,
    X
} from 'lucide-react';
import QuestionContentRenderer from '@/Components/QuestionContentRenderer';

export default function StudentExamReview({ auth, attempt, questions = [], answers = {} }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lightboxImage, setLightboxImage] = useState(null);
    const exam = attempt.exam;
    const currentQuestion = questions[currentIndex];
    const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;

    const isCorrect = currentAnswer?.is_correct;
    const isEssay = currentQuestion?.question_type === 'essay';

    const getQuestionStatus = (q) => {
        const ans = answers[q.id];
        if (!ans || !ans.answer_text) return 'unanswered';
        if (q.question_type === 'essay') {
            return ans.graded_at ? 'graded' : 'waiting';
        }
        return ans.is_correct ? 'correct' : 'wrong';
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link 
                        href={route('student.exams.result', attempt.id)}
                        className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            Review Jawaban Ujian
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {exam.title} • Percobaan #{attempt.attempt_number}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={`Review - ${exam.title}`} />

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Review Area */}
                    <div className="lg:col-span-3 space-y-4">
                        {currentQuestion && (
                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
                                {/* Header */}
                                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <span className="w-9 h-9 rounded-xl bg-[#FDF2F4] text-[#800020] text-sm font-bold flex items-center justify-center">
                                            {currentIndex + 1}
                                        </span>
                                        <div>
                                            <p className="text-xs font-bold text-slate-700 uppercase">
                                                {currentQuestion.question_type === 'multiple_choice' && 'Pilihan Ganda'}
                                                {currentQuestion.question_type === 'pgk_mcma' && 'PGK MCMA (Kotak Centang)'}
                                                {currentQuestion.question_type === 'pgk_kategori' && (() => {
                                                    const cats = (Array.isArray(currentQuestion.options?.categories) && currentQuestion.options.categories.length >= 2)
                                                        ? currentQuestion.options.categories
                                                        : ['Benar', 'Salah'];
                                                    return `PGK Kategori (${cats[0]} / ${cats[1]})`;
                                                })()}
                                                {currentQuestion.question_type === 'short_answer' && 'Isian Singkat'}
                                                {currentQuestion.question_type === 'essay' && 'Essay / Uraian'}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Bobot: {currentQuestion.points} Poin
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div>
                                        {isEssay ? (
                                            currentAnswer?.graded_at ? (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    <Award className="w-3.5 h-3.5 mr-1" />
                                                    Poin: {currentAnswer.points_earned} / {currentQuestion.points}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                                    <HelpCircle className="w-3.5 h-3.5 mr-1" />
                                                    Menunggu Penilaian Guru
                                                </span>
                                            )
                                        ) : isCorrect ? (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                                Benar (+{currentAnswer?.points_earned} poin)
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                                <XCircle className="w-3.5 h-3.5 mr-1" />
                                                Salah (0 poin)
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Question Text & Image */}
                                <div>
                                    <QuestionContentRenderer
                                        text={currentQuestion.question_text}
                                        images={currentQuestion.question_images || (currentQuestion.question_image ? [currentQuestion.question_image] : [])}
                                        alignment={currentQuestion.image_alignment || 'center'}
                                        position={currentQuestion.image_position || 'bottom'}
                                        className="text-base text-slate-900 leading-relaxed font-medium"
                                        imageClassName="max-h-72 object-contain"
                                        onImageClick={(src) => setLightboxImage(src)}
                                    />
                                </div>

                                {/* Answer Content Breakdown */}
                                <div className="space-y-4 pt-2">
                                    {/* Multiple choice options */}
                                    {currentQuestion.question_type === 'multiple_choice' && (
                                        <div className="space-y-2.5">
                                            {Object.entries(currentQuestion.options || {}).map(([key, val]) => {
                                                const isStudentChoice = currentAnswer?.answer_text === key;
                                                const isRightAnswer = currentQuestion.correct_answer === key;
                                                const optionImage = currentQuestion.option_images?.[key];

                                                let style = 'border-slate-200 bg-white text-slate-700';
                                                if (isRightAnswer) {
                                                    style = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                                                } else if (isStudentChoice && !isRightAnswer) {
                                                    style = 'border-rose-400 bg-rose-50 text-rose-900';
                                                }

                                                return (
                                                    <div 
                                                        key={key} 
                                                        className={`p-3.5 rounded-xl border-2 space-y-2 text-sm ${style}`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2.5">
                                                                <span className="font-bold w-6 text-base">{key}.</span>
                                                                {val ? <span>{val}</span> : (!optionImage && <span className="italic text-slate-400 font-normal">(Tidak ada teks)</span>)}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-xs">
                                                                {isStudentChoice && (
                                                                    <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold">
                                                                        Jawaban Anda
                                                                    </span>
                                                                )}
                                                                {isRightAnswer && (
                                                                    <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-800 font-bold">
                                                                        Kunci Benar
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {optionImage && (
                                                            <div className="pl-8 pt-1">
                                                                <img
                                                                    src={`/storage/${optionImage}`}
                                                                    alt={`Pilihan ${key}`}
                                                                    onClick={() => setLightboxImage(`/storage/${optionImage}`)}
                                                                    className="rounded-lg border border-slate-200 max-h-48 max-w-full object-contain bg-white p-1 cursor-pointer hover:opacity-95 shadow-sm transition"
                                                                    title="Klik untuk perbesar gambar"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* PGK MCMA Review */}
                                    {currentQuestion.question_type === 'pgk_mcma' && (() => {
                                        let correctKeys = [];
                                        try {
                                            correctKeys = typeof currentQuestion.correct_answer === 'string'
                                                ? JSON.parse(currentQuestion.correct_answer)
                                                : (currentQuestion.correct_answer || []);
                                        } catch (e) {
                                            correctKeys = [String(currentQuestion.correct_answer)];
                                        }
                                        if (!Array.isArray(correctKeys)) correctKeys = [];

                                        let studentKeys = [];
                                        try {
                                            studentKeys = typeof currentAnswer?.answer_text === 'string'
                                                ? JSON.parse(currentAnswer.answer_text)
                                                : (currentAnswer?.answer_text || []);
                                        } catch (e) {
                                            studentKeys = currentAnswer?.answer_text ? [currentAnswer.answer_text] : [];
                                        }
                                        if (!Array.isArray(studentKeys)) studentKeys = [];

                                        return (
                                            <div className="space-y-3">
                                                <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs text-indigo-900 font-medium">
                                                    Pilihan Ganda Kompleks (Kotak Centang): periksa pilihan jawaban Anda dengan kunci benar di bawah ini.
                                                </div>
                                                <div className="space-y-2.5">
                                                    {Object.entries(currentQuestion.options || {}).map(([key, val]) => {
                                                        const isStudentChoice = studentKeys.includes(key);
                                                        const isRightAnswer = correctKeys.includes(key);
                                                        const optionImage = currentQuestion.option_images?.[key];

                                                        let cardStyle = 'border-slate-200 bg-white text-slate-700';
                                                        if (isRightAnswer && isStudentChoice) {
                                                            cardStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                                                        } else if (isStudentChoice && !isRightAnswer) {
                                                            cardStyle = 'border-rose-400 bg-rose-50 text-rose-900 font-medium';
                                                        } else if (isRightAnswer && !isStudentChoice) {
                                                            cardStyle = 'border-amber-400 bg-amber-50/80 text-amber-900';
                                                        }

                                                        return (
                                                            <div 
                                                                key={key} 
                                                                className={`p-3.5 rounded-xl border-2 space-y-2 text-sm ${cardStyle}`}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2.5">
                                                                        <span className={`w-4 h-4 rounded border flex items-center justify-center font-bold text-[10px] shrink-0 ${
                                                                            isStudentChoice ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                                                                        }`}>
                                                                            {isStudentChoice ? '✓' : ''}
                                                                        </span>
                                                                        <span className="font-bold w-6 text-base">{key}.</span>
                                                                        {val ? <span>{val}</span> : (!optionImage && <span className="italic text-slate-400 font-normal">(Tidak ada teks)</span>)}
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-xs">
                                                                        {isStudentChoice && (
                                                                            <span className={`px-2 py-0.5 rounded font-bold ${
                                                                                isRightAnswer ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'
                                                                            }`}>
                                                                                Pilihan Anda {isRightAnswer ? '✓' : '✗'}
                                                                            </span>
                                                                        )}
                                                                        {isRightAnswer && (
                                                                            <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-800 font-bold">
                                                                                Kunci Benar
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                {optionImage && (
                                                                    <div className="pl-8 pt-1">
                                                                        <img
                                                                            src={`/storage/${optionImage}`}
                                                                            alt={`Pilihan ${key}`}
                                                                            onClick={() => setLightboxImage(`/storage/${optionImage}`)}
                                                                            className="rounded-lg border border-slate-200 max-h-48 max-w-full object-contain bg-white p-1 cursor-pointer hover:opacity-95 shadow-sm transition"
                                                                            title="Klik untuk perbesar gambar"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* PGK Kategori Review */}
                                    {currentQuestion.question_type === 'pgk_kategori' && (() => {
                                        const rows = currentQuestion.options?.rows || [];
                                        const categories = (Array.isArray(currentQuestion.options?.categories) && currentQuestion.options.categories.length >= 2)
                                            ? currentQuestion.options.categories
                                            : ['Benar', 'Salah'];
                                        let correctMap = {};
                                        try {
                                            correctMap = typeof currentQuestion.correct_answer === 'string'
                                                ? JSON.parse(currentQuestion.correct_answer)
                                                : (currentQuestion.correct_answer || {});
                                        } catch (e) {
                                            correctMap = {};
                                        }

                                        let studentMap = {};
                                        try {
                                            studentMap = typeof currentAnswer?.answer_text === 'string'
                                                ? JSON.parse(currentAnswer.answer_text)
                                                : (currentAnswer?.answer_text || {});
                                        } catch (e) {
                                            studentMap = {};
                                        }

                                        return (
                                            <div className="space-y-3">
                                                <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl text-xs text-teal-900 font-medium">
                                                    PGK Kategori ({categories[0]} / {categories[1]}): periksa pilihan pernyataan Anda dengan kunci jawaban benar pada tabel di bawah ini.
                                                </div>
                                                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                                                    <table className="w-full text-xs text-left border-collapse">
                                                        <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                                                            <tr>
                                                                <th className="py-3 px-3 w-12 text-center">#</th>
                                                                <th className="py-3 px-4 min-w-[220px]">Pernyataan</th>
                                                                <th className="py-3 px-3 w-28 text-center">Pilihan Anda</th>
                                                                <th className="py-3 px-3 w-28 text-center">Kunci Benar</th>
                                                                <th className="py-3 px-3 w-20 text-center">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100">
                                                            {rows.map((row) => {
                                                                const studentChoice = studentMap[row.id] || '(Kosong)';
                                                                const rightChoice = correctMap[row.id] || '-';
                                                                const isRowCorrect = studentChoice === rightChoice;

                                                                return (
                                                                    <tr key={row.id} className={isRowCorrect ? 'bg-emerald-50/30' : 'bg-rose-50/30'}>
                                                                        <td className="py-3 px-3 text-center font-bold text-slate-900">
                                                                            <span className="w-6 h-6 rounded bg-slate-100 inline-flex items-center justify-center font-bold">
                                                                                {row.id}
                                                                            </span>
                                                                        </td>
                                                                        <td className="py-3 px-4 text-slate-800 font-medium">
                                                                            <div className="space-y-1.5">
                                                                                {currentQuestion.option_images?.[row.id] && (
                                                                                    <div>
                                                                                        <img
                                                                                            src={`/storage/${currentQuestion.option_images[row.id]}`}
                                                                                            alt={`Pilihan ${row.id}`}
                                                                                            onClick={() => setLightboxImage(`/storage/${currentQuestion.option_images[row.id]}`)}
                                                                                            className="rounded-lg border border-slate-200 max-h-36 max-w-full object-contain bg-white p-1 cursor-pointer hover:opacity-95 shadow-sm transition"
                                                                                            title="Klik untuk perbesar gambar"
                                                                                        />
                                                                                    </div>
                                                                                )}
                                                                                {row.text && <div>{row.text}</div>}
                                                                            </div>
                                                                        </td>
                                                                        <td className="py-3 px-3 text-center">
                                                                            <span className={`px-2.5 py-1 rounded-md font-bold text-xs ${
                                                                                studentChoice === '(Kosong)'
                                                                                    ? 'bg-slate-100 text-slate-500'
                                                                                    : isRowCorrect
                                                                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                                                                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                                                                            }`}>
                                                                                {studentChoice}
                                                                            </span>
                                                                        </td>
                                                                        <td className="py-3 px-3 text-center font-extrabold text-slate-900">
                                                                            <span className="px-2.5 py-1 rounded-md text-xs font-extrabold bg-teal-100 text-teal-800 border border-teal-200">
                                                                                {rightChoice}
                                                                            </span>
                                                                        </td>
                                                                        <td className="py-3 px-3 text-center">
                                                                            {isRowCorrect ? (
                                                                                <span className="inline-flex items-center text-emerald-600 font-bold">
                                                                                    <CheckCircle2 className="w-4 h-4 mr-1" />
                                                                                    Tepat
                                                                                </span>
                                                                            ) : (
                                                                                <span className="inline-flex items-center text-rose-600 font-bold">
                                                                                    <XCircle className="w-4 h-4 mr-1" />
                                                                                    Keliru
                                                                                </span>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* Short answer */}
                                    {currentQuestion.question_type === 'short_answer' && (
                                        <div className="space-y-3">
                                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                                    Jawaban Anda:
                                                </p>
                                                <p className="text-sm font-semibold text-slate-900">
                                                    {currentAnswer?.answer_text || '(Tidak dijawab)'}
                                                </p>
                                            </div>

                                            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                                                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                                                    Kunci Jawaban Benar:
                                                </p>
                                                <p className="text-sm font-bold text-emerald-900">
                                                    {currentQuestion.correct_answer}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Essay */}
                                    {currentQuestion.question_type === 'essay' && (
                                        <div className="space-y-3">
                                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                                    Jawaban Uraian Anda:
                                                </p>
                                                <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                                                    {currentAnswer?.answer_text || '(Tidak dijawab)'}
                                                </p>
                                            </div>

                                            {currentAnswer?.feedback && (
                                                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
                                                    <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                                                    <div>
                                                        <p className="text-xs font-bold text-blue-900 uppercase">
                                                            Catatan & Koreksi Guru:
                                                        </p>
                                                        <p className="text-xs text-blue-800 mt-1 leading-relaxed">
                                                            {currentAnswer.feedback}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Prev/Next controls */}
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <button
                                        onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                                        disabled={currentIndex === 0}
                                        className="flex items-center px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 disabled:opacity-40 transition"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1.5" />
                                        Soal Sebelumnya
                                    </button>

                                    <button
                                        onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                        disabled={currentIndex === questions.length - 1}
                                        className="flex items-center px-4 py-2.5 rounded-xl bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold disabled:opacity-40 transition"
                                    >
                                        Soal Berikutnya
                                        <ChevronRight className="w-4 h-4 ml-1.5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Question Grid Navigator */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm sticky top-6">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                                Daftar Soal
                            </h3>
                            <div className="grid grid-cols-5 gap-2">
                                {questions.map((q, idx) => {
                                    const st = getQuestionStatus(q);
                                    let btnStyle = 'bg-slate-100 text-slate-700 border-slate-200';
                                    if (st === 'correct') btnStyle = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                                    if (st === 'wrong') btnStyle = 'bg-rose-100 text-rose-800 border-rose-300';
                                    if (st === 'waiting') btnStyle = 'bg-amber-100 text-amber-800 border-amber-300';
                                    if (currentIndex === idx) btnStyle += ' ring-2 ring-[#800020] font-black';

                                    return (
                                        <button
                                            key={q.id}
                                            onClick={() => setCurrentIndex(idx)}
                                            className={`aspect-square rounded-xl border flex items-center justify-center text-xs font-bold transition hover:scale-105 ${btnStyle}`}
                                        >
                                            {idx + 1}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Legend */}
                            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-600">
                                <div className="flex items-center gap-2">
                                    <span className="w-3.5 h-3.5 rounded bg-emerald-100 border border-emerald-300" />
                                    <span>Benar</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3.5 h-3.5 rounded bg-rose-100 border border-rose-300" />
                                    <span>Salah</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3.5 h-3.5 rounded bg-amber-100 border border-amber-300" />
                                    <span>Menunggu Penilaian (Essay)</span>
                                </div>
                            </div>

                            <Link
                                href={route('student.exams.result', attempt.id)}
                                className="mt-5 w-full block text-center py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition"
                            >
                                Kembali ke Skor Akhir
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox Preview */}
            {lightboxImage && (
                <div
                    onClick={() => setLightboxImage(null)}
                    className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
                >
                    <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
                        <img
                            src={lightboxImage}
                            alt="Ukuran Penuh"
                            className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl bg-white/10 p-2"
                        />
                        <button
                            type="button"
                            onClick={() => setLightboxImage(null)}
                            className="absolute top-2 right-2 sm:-top-4 sm:-right-4 bg-black/70 hover:bg-black text-white p-2 rounded-full transition shadow-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
