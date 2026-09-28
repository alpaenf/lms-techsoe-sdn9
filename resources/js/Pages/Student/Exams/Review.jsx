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
    Eye
} from 'lucide-react';

export default function StudentExamReview({ auth, attempt, questions = [], answers = {} }) {
    const [currentIndex, setCurrentIndex] = useState(0);
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

                                {/* Question Text */}
                                <div>
                                    <p className="text-base text-slate-900 leading-relaxed font-medium">
                                        {currentQuestion.question_text}
                                    </p>
                                    {currentQuestion.question_image && (
                                        <img 
                                            src={`/storage/${currentQuestion.question_image}`} 
                                            alt="Soal"
                                            className="mt-4 rounded-xl border border-slate-200 max-h-64 object-contain"
                                        />
                                    )}
                                </div>

                                {/* Answer Content Breakdown */}
                                <div className="space-y-4 pt-2">
                                    {/* Multiple choice options */}
                                    {currentQuestion.question_type === 'multiple_choice' && (
                                        <div className="space-y-2">
                                            {Object.entries(currentQuestion.options || {}).map(([key, val]) => {
                                                const isStudentChoice = currentAnswer?.answer_text === key;
                                                const isRightAnswer = currentQuestion.correct_answer === key;

                                                let style = 'border-slate-200 bg-white text-slate-700';
                                                if (isRightAnswer) {
                                                    style = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                                                } else if (isStudentChoice && !isRightAnswer) {
                                                    style = 'border-rose-400 bg-rose-50 text-rose-900';
                                                }

                                                return (
                                                    <div 
                                                        key={key} 
                                                        className={`p-3.5 rounded-xl border-2 flex items-center justify-between text-sm ${style}`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-bold w-6">{key}.</span>
                                                            <span>{val}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs">
                                                            {isStudentChoice && (
                                                                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">
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
                                                );
                                            })}
                                        </div>
                                    )}

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
        </AuthenticatedLayout>
    );
}
