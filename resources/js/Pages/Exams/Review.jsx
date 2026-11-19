import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
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
    X,
    Printer,
    User,
    Save,
    Filter,
    CheckSquare,
    AlertCircle,
    LayoutList,
    Layers,
    ChevronDown
} from 'lucide-react';
import QuestionContentRenderer from '@/Components/QuestionContentRenderer';

export default function ExamAttemptReview({ 
    auth, 
    exam, 
    attempt, 
    questions = [], 
    answers = {}, 
    studentList = [], 
    statistics = {} 
}) {
    const [viewMode, setViewMode] = useState('single'); // 'single' | 'all'
    const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'wrong' | 'correct' | 'essay'
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lightboxImage, setLightboxImage] = useState(null);

    // State for essay grading in-place
    const [essayGrades, setEssayGrades] = useState(() => {
        const initial = {};
        questions.forEach(q => {
            if (q.question_type === 'essay') {
                const ans = answers[q.id];
                initial[q.id] = {
                    points: ans?.points_earned !== undefined && ans?.points_earned !== null ? ans.points_earned : '',
                    feedback: ans?.feedback || '',
                    isSaving: false
                };
            }
        });
        return initial;
    });

    const student = attempt.student || {};

    // Helper to determine question correctness status
    const getQuestionStatus = (q) => {
        const ans = answers[q.id];
        if (!ans || ans.answer_text === null || ans.answer_text === '') {
            return 'unanswered';
        }
        if (q.question_type === 'essay') {
            return ans.is_correct !== null || ans.graded_at ? 'graded' : 'waiting';
        }
        return ans.is_correct ? 'correct' : 'wrong';
    };

    // Filter questions based on filterStatus
    const filteredQuestions = useMemo(() => {
        if (filterStatus === 'all') return questions;
        return questions.filter(q => {
            const st = getQuestionStatus(q);
            if (filterStatus === 'wrong') return st === 'wrong' || st === 'unanswered';
            if (filterStatus === 'correct') return st === 'correct';
            if (filterStatus === 'essay') return q.question_type === 'essay';
            return true;
        });
    }, [questions, answers, filterStatus]);

    // Ensure valid index for current filtered question
    const safeIndex = Math.min(currentIndex, Math.max(0, filteredQuestions.length - 1));
    const currentQuestion = filteredQuestions[safeIndex] || null;
    const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;

    // Student navigation in list
    const currentStudentIdx = studentList.findIndex(s => s.id === attempt.id);
    const prevStudent = currentStudentIdx > 0 ? studentList[currentStudentIdx - 1] : null;
    const nextStudent = currentStudentIdx >= 0 && currentStudentIdx < studentList.length - 1 ? studentList[currentStudentIdx + 1] : null;

    const handleSwitchStudent = (targetAttemptId) => {
        if (!targetAttemptId || targetAttemptId === attempt.id) return;
        router.get(route('exams.attempts.review', [exam.id, targetAttemptId]));
    };

    const handleSaveEssayGrade = (questionId, answerId) => {
        const gradeData = essayGrades[questionId];
        if (!gradeData || !answerId) return;

        setEssayGrades(prev => ({
            ...prev,
            [questionId]: { ...prev[questionId], isSaving: true }
        }));

        router.post(
            route('exams.grade', answerId),
            {
                points_earned: gradeData.points,
                feedback: gradeData.feedback
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setEssayGrades(prev => ({
                        ...prev,
                        [questionId]: { ...prev[questionId], isSaving: false }
                    }));
                }
            }
        );
    };

    const handlePrint = () => {
        window.print();
    };

    // Render detail for a specific question (reused in both single & all modes)
    const renderQuestionDetail = (q, indexInFiltered, originalNumber) => {
        const ans = answers[q.id];
        const status = getQuestionStatus(q);
        const isEssay = q.question_type === 'essay';

        return (
            <div 
                key={q.id} 
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5 print:shadow-none print:border-slate-300 print:rounded-none print:p-4 print:space-y-3"
            >
                {/* Header Soal */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-2xl bg-[#800020]/10 text-[#800020] text-sm font-extrabold flex items-center justify-center shrink-0 border border-[#800020]/20">
                            {originalNumber}
                        </span>
                        <div>
                            <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                                {q.question_type === 'multiple_choice' && 'Pilihan Ganda'}
                                {q.question_type === 'pgk_mcma' && 'PGK MCMA (Kotak Centang)'}
                                {q.question_type === 'pgk_kategori' && (() => {
                                    const cats = (Array.isArray(q.options?.categories) && q.options.categories.length >= 2)
                                        ? q.options.categories
                                        : ['Benar', 'Salah'];
                                    return `PGK Kategori (${cats[0]} / ${cats[1]})`;
                                })()}
                                {q.question_type === 'short_answer' && 'Isian Singkat'}
                                {q.question_type === 'essay' && 'Essay / Uraian'}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium">
                                Bobot Soal: <span className="font-bold text-slate-700">{q.points} Poin</span>
                            </p>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                        {isEssay ? (
                            ans?.graded_at ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
                                    <Award className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                                    Dinilai: {ans.points_earned} / {q.points} Poin
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-xs animate-pulse">
                                    <HelpCircle className="w-3.5 h-3.5 mr-1 text-amber-600" />
                                    Perlu Penilaian Guru
                                </span>
                            )
                        ) : status === 'correct' ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                                Jawaban Benar (+{ans?.points_earned || q.points} Poin)
                            </span>
                        ) : status === 'wrong' ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 shadow-xs">
                                <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />
                                Jawaban Salah (0 Poin)
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 shadow-xs">
                                <AlertCircle className="w-3.5 h-3.5 mr-1 text-slate-500" />
                                Tidak Dijawab (0 Poin)
                            </span>
                        )}
                    </div>
                </div>

                {/* Teks & Gambar Soal */}
                <div className="text-slate-900 leading-relaxed font-medium">
                    <QuestionContentRenderer
                        text={q.question_text}
                        images={q.question_images || (q.question_image ? [q.question_image] : [])}
                        alignment={q.image_alignment || 'center'}
                        position={q.image_position || 'bottom'}
                        className="text-sm sm:text-base text-slate-900 leading-relaxed font-medium"
                        imageClassName="max-h-72 object-contain"
                        onImageClick={(src) => setLightboxImage(src)}
                    />
                </div>

                {/* Breakdown Jawaban Siswa & Kunci Jawaban */}
                <div className="pt-2">
                    {/* 1. Multiple Choice */}
                    {q.question_type === 'multiple_choice' && (
                        <div className="space-y-2.5">
                            {Object.entries(q.options || {}).map(([key, val]) => {
                                const isStudentChoice = ans?.answer_text === key;
                                const isRightAnswer = q.correct_answer === key;
                                const optionImage = q.option_images?.[key];

                                let cardStyle = 'border-slate-200 bg-white text-slate-700';
                                if (isRightAnswer && isStudentChoice) {
                                    cardStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                                } else if (isStudentChoice && !isRightAnswer) {
                                    cardStyle = 'border-rose-400 bg-rose-50/80 text-rose-950 font-medium ring-1 ring-rose-400';
                                } else if (isRightAnswer && !isStudentChoice) {
                                    cardStyle = 'border-emerald-300 bg-emerald-50/40 text-emerald-900 font-semibold border-dashed';
                                }

                                return (
                                    <div 
                                        key={key} 
                                        className={`p-3.5 rounded-2xl border-2 space-y-2 text-xs sm:text-sm transition ${cardStyle}`}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2.5">
                                                <span className="font-extrabold w-6 text-sm sm:text-base text-slate-900">{key}.</span>
                                                {val ? <span>{val}</span> : (!optionImage && <span className="italic text-slate-400 font-normal">(Tidak ada teks)</span>)}
                                            </div>
                                            <div className="flex items-center gap-1.5 shrink-0 text-xs">
                                                {isStudentChoice && (
                                                    <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                                                        isRightAnswer ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                                                    }`}>
                                                        Jawaban Siswa {isRightAnswer ? '✓' : '✗'}
                                                    </span>
                                                )}
                                                {isRightAnswer && (
                                                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px] border border-emerald-300">
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
                                                    className="rounded-xl border border-slate-200 max-h-40 max-w-full object-contain bg-white p-1 cursor-pointer hover:opacity-95 shadow-xs transition"
                                                    title="Klik untuk perbesar gambar"
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* 2. PGK MCMA (Kotak Centang) */}
                    {q.question_type === 'pgk_mcma' && (() => {
                        let correctKeys = [];
                        try {
                            correctKeys = typeof q.correct_answer === 'string'
                                ? JSON.parse(q.correct_answer)
                                : (q.correct_answer || []);
                        } catch (e) {
                            correctKeys = [String(q.correct_answer)];
                        }
                        if (!Array.isArray(correctKeys)) correctKeys = [];

                        let studentKeys = [];
                        try {
                            studentKeys = typeof ans?.answer_text === 'string'
                                ? JSON.parse(ans.answer_text)
                                : (ans?.answer_text || []);
                        } catch (e) {
                            studentKeys = ans?.answer_text ? [ans.answer_text] : [];
                        }
                        if (!Array.isArray(studentKeys)) studentKeys = [];

                        return (
                            <div className="space-y-3">
                                <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs text-indigo-900 font-medium">
                                    Pilihan Ganda Kompleks (Kotak Centang): periksa pilihan yang dicentang siswa dengan kunci jawaban benar.
                                </div>
                                <div className="space-y-2.5">
                                    {Object.entries(q.options || {}).map(([key, val]) => {
                                        const isStudentChoice = studentKeys.includes(key);
                                        const isRightAnswer = correctKeys.includes(key);
                                        const optionImage = q.option_images?.[key];

                                        let cardStyle = 'border-slate-200 bg-white text-slate-700';
                                        if (isRightAnswer && isStudentChoice) {
                                            cardStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                                        } else if (isStudentChoice && !isRightAnswer) {
                                            cardStyle = 'border-rose-400 bg-rose-50/80 text-rose-950 font-medium ring-1 ring-rose-400';
                                        } else if (isRightAnswer && !isStudentChoice) {
                                            cardStyle = 'border-amber-400 bg-amber-50/60 text-amber-900 border-dashed';
                                        }

                                        return (
                                            <div 
                                                key={key} 
                                                className={`p-3.5 rounded-2xl border-2 space-y-2 text-xs sm:text-sm ${cardStyle}`}
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <span className={`w-5 h-5 rounded-md border flex items-center justify-center font-bold text-xs shrink-0 ${
                                                            isStudentChoice ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                                                        }`}>
                                                            {isStudentChoice ? '✓' : ''}
                                                        </span>
                                                        <span className="font-extrabold w-6 text-sm sm:text-base text-slate-900">{key}.</span>
                                                        {val ? <span>{val}</span> : (!optionImage && <span className="italic text-slate-400 font-normal">(Tidak ada teks)</span>)}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 shrink-0 text-xs">
                                                        {isStudentChoice && (
                                                            <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                                                                isRightAnswer ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                                                            }`}>
                                                                Dicentang Siswa {isRightAnswer ? '✓' : '✗'}
                                                            </span>
                                                        )}
                                                        {isRightAnswer && (
                                                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px] border border-emerald-300">
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
                                                            className="rounded-xl border border-slate-200 max-h-40 max-w-full object-contain bg-white p-1 cursor-pointer hover:opacity-95 shadow-xs transition"
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

                    {/* 3. PGK Kategori (Tabel Matriks) */}
                    {q.question_type === 'pgk_kategori' && (() => {
                        const rows = q.options?.rows || [];
                        const categories = (Array.isArray(q.options?.categories) && q.options.categories.length >= 2)
                            ? q.options.categories
                            : ['Benar', 'Salah'];
                        let correctMap = {};
                        try {
                            correctMap = typeof q.correct_answer === 'string'
                                ? JSON.parse(q.correct_answer)
                                : (q.correct_answer || {});
                        } catch (e) {
                            correctMap = {};
                        }

                        let studentMap = {};
                        try {
                            studentMap = typeof ans?.answer_text === 'string'
                                ? JSON.parse(ans.answer_text)
                                : (ans?.answer_text || {});
                        } catch (e) {
                            studentMap = {};
                        }

                        return (
                            <div className="space-y-3">
                                <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl text-xs text-teal-900 font-medium">
                                    PGK Kategori ({categories[0]} / {categories[1]}): analisis kecocokan pilihan siswa pada setiap pernyataan di bawah ini.
                                </div>
                                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                                    <table className="w-full text-xs text-left border-collapse">
                                        <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                                            <tr>
                                                <th className="py-3 px-3 w-12 text-center">#</th>
                                                <th className="py-3 px-4 min-w-[220px]">Pernyataan</th>
                                                <th className="py-3 px-3 w-28 text-center">Pilihan Siswa</th>
                                                <th className="py-3 px-3 w-28 text-center">Kunci Benar</th>
                                                <th className="py-3 px-3 w-24 text-center">Hasil Analisis</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 font-medium">
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
                                                        <td className="py-3 px-4 text-slate-800">
                                                            <div className="space-y-1.5">
                                                                {q.option_images?.[row.id] && (
                                                                    <div>
                                                                        <img
                                                                            src={`/storage/${q.option_images[row.id]}`}
                                                                            alt={`Pilihan ${row.id}`}
                                                                            onClick={() => setLightboxImage(`/storage/${q.option_images[row.id]}`)}
                                                                            className="rounded-lg border border-slate-200 max-h-32 max-w-full object-contain bg-white p-1 cursor-pointer hover:opacity-95 shadow-xs transition"
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
                                                                <span className="inline-flex items-center text-emerald-700 font-bold">
                                                                    <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
                                                                    Tepat
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center text-rose-700 font-bold">
                                                                    <XCircle className="w-4 h-4 mr-1 text-rose-600" />
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

                    {/* 4. Short Answer */}
                    {q.question_type === 'short_answer' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className={`p-4 rounded-2xl border ${
                                status === 'correct' 
                                    ? 'bg-emerald-50/70 border-emerald-300' 
                                    : 'bg-rose-50/70 border-rose-300'
                            }`}>
                                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                                    Jawaban Teks Siswa:
                                </p>
                                <p className="text-sm font-bold text-slate-900">
                                    {ans?.answer_text || <span className="italic text-slate-400 font-normal">(Tidak dijawab)</span>}
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-300">
                                <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                                    Kunci Jawaban Benar (Sistem):
                                </p>
                                <p className="text-sm font-extrabold text-emerald-950 font-mono">
                                    {q.correct_answer}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* 5. Essay / Uraian (With In-Place Grading Box) */}
                    {q.question_type === 'essay' && (
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                                    <span>Jawaban Uraian Siswa:</span>
                                    {ans?.answer_text && (
                                        <span className="text-[10px] text-slate-400 font-normal">
                                            {ans.answer_text.length} Karakter
                                        </span>
                                    )}
                                </p>
                                <div className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-sans bg-white p-3.5 rounded-xl border border-slate-200">
                                    {ans?.answer_text || <span className="italic text-slate-400">(Siswa tidak mengisi jawaban essay ini)</span>}
                                </div>
                            </div>

                            {/* Form Koreksi Essay oleh Guru */}
                            {ans?.id && (
                                <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-3.5 print:hidden">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                                            <MessageSquare className="w-4 h-4 text-amber-700" />
                                            <span>Penilaian & Catatan Koreksi Guru</span>
                                        </div>
                                        <span className="text-xs font-semibold text-amber-800">
                                            Skor Maksimal: {q.points} Poin
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                        <div className="sm:col-span-1">
                                            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                                Beri Nilai Poin:
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={q.points}
                                                    step="0.5"
                                                    value={essayGrades[q.id]?.points ?? ''}
                                                    onChange={(e) => setEssayGrades(prev => ({
                                                        ...prev,
                                                        [q.id]: { ...prev[q.id], points: e.target.value }
                                                    }))}
                                                    placeholder="0"
                                                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:ring-amber-500 focus:border-amber-500"
                                                />
                                                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">
                                                    / {q.points}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                                Catatan / Feedback Koreksi untuk Siswa:
                                            </label>
                                            <input
                                                type="text"
                                                value={essayGrades[q.id]?.feedback ?? ''}
                                                onChange={(e) => setEssayGrades(prev => ({
                                                    ...prev,
                                                    [q.id]: { ...prev[q.id], feedback: e.target.value }
                                                }))}
                                                placeholder="Contoh: Penjelasan cukup baik namun rumus langkah kedua kurang tepat..."
                                                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-amber-500 focus:border-amber-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end pt-1">
                                        <button
                                            type="button"
                                            onClick={() => handleSaveEssayGrade(q.id, ans.id)}
                                            disabled={essayGrades[q.id]?.isSaving}
                                            className="px-4 py-2 bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold rounded-xl shadow-xs transition inline-flex items-center space-x-1.5 disabled:opacity-50"
                                        >
                                            <Save className="w-3.5 h-3.5" />
                                            <span>{essayGrades[q.id]?.isSaving ? 'Menyimpan...' : 'Simpan Nilai Essay'}</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* View feedback for printing */}
                            {ans?.feedback && (
                                <div className="hidden print:block p-3 rounded-xl bg-slate-100 text-xs text-slate-800">
                                    <strong className="block mb-0.5">Catatan Koreksi Guru:</strong>
                                    <span>{ans.feedback} (Nilai: {ans.points_earned} / {q.points})</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 print:hidden">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('exams.results', exam.id)}
                            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition shrink-0"
                            title="Kembali ke Rekapitulasi Nilai"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 leading-tight">
                                Hasil Aksi & Koreksi Ujian
                            </h2>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                                {exam.title} • {exam.class?.name || (exam.exam_category === 'ujian_sekolah' ? 'Seluruh Kelas 6' : 'Semua Rombel')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Print Button */}
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-200 shadow-xs"
                            title="Cetak lembar koreksi ujian ini"
                        >
                            <Printer className="w-4 h-4 mr-1.5" />
                            <span>Cetak Hasil</span>
                        </button>

                        <Link
                            href={route('exams.results', exam.id)}
                            className="inline-flex items-center px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold transition shadow-xs"
                        >
                            <FileText className="w-4 h-4 mr-1.5" />
                            <span>Daftar Nilai Siswa</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Koreksi & Hasil - ${student.full_name || 'Siswa'} - ${exam.title}`} />

            <div className="space-y-6 max-w-7xl mx-auto pb-10">
                {/* 1. Student Identity & Quick Switcher Card */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4 print:border-none print:shadow-none print:p-0">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Student Details */}
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#800020] to-[#5C0017] text-white flex items-center justify-center font-extrabold text-xl shadow-md shrink-0">
                                {student.full_name ? student.full_name.charAt(0).toUpperCase() : 'S'}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="text-lg font-bold text-slate-900 leading-tight">
                                        {student.full_name || 'Nama Siswa'}
                                    </h3>
                                    {student.class?.name && (
                                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                            {student.class.name}
                                        </span>
                                    )}
                                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-50 text-slate-500 border border-slate-200 font-mono">
                                        NIS: {student.nis || '-'}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    Percobaan #{attempt.attempt_number} • Selesai: {attempt.submitted_at ? new Date(attempt.submitted_at).toLocaleString('id-ID') : '-'}
                                </p>
                            </div>
                        </div>

                        {/* Student Switcher for Teachers */}
                        <div className="flex items-center gap-2 self-start lg:self-center print:hidden">
                            <button
                                type="button"
                                onClick={() => prevStudent && handleSwitchStudent(prevStudent.id)}
                                disabled={!prevStudent}
                                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition flex items-center gap-1"
                                title={prevStudent ? `Sebelumnya: ${prevStudent.full_name}` : 'Siswa Pertama'}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">Sebelumnya</span>
                            </button>

                            <div className="relative">
                                <select
                                    value={attempt.id}
                                    onChange={(e) => handleSwitchStudent(Number(e.target.value))}
                                    className="pl-3 pr-8 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-[#800020] focus:border-[#800020] cursor-pointer"
                                >
                                    {studentList.map(st => (
                                        <option key={st.id} value={st.id}>
                                            #{st.rank} {st.full_name} ({st.percentage} - {st.is_passed ? 'Lulus' : 'Belum Lulus'})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="button"
                                onClick={() => nextStudent && handleSwitchStudent(nextStudent.id)}
                                disabled={!nextStudent}
                                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition flex items-center gap-1"
                                title={nextStudent ? `Berikutnya: ${nextStudent.full_name}` : 'Siswa Terakhir'}
                            >
                                <span className="hidden sm:inline">Berikutnya</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Score & Statistics Bar */}
                    <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {/* Nilai Akhir */}
                        <div className="bg-gradient-to-br from-[#800020]/5 to-[#800020]/15 rounded-2xl p-3 border border-[#800020]/20 flex items-center justify-between col-span-2 sm:col-span-1">
                            <div>
                                <p className="text-[10px] font-bold text-[#800020] uppercase">Skor Akhir</p>
                                <p className="text-2xl font-black text-[#800020]">{statistics.score || 0}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                statistics.is_passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                                {statistics.is_passed ? 'Lulus KKM' : 'Belum Lulus'}
                            </span>
                        </div>

                        {/* Soal Benar */}
                        <div className="bg-emerald-50/70 rounded-2xl p-3 border border-emerald-200">
                            <p className="text-[10px] font-bold text-emerald-700 uppercase">Jawaban Benar</p>
                            <p className="text-xl font-extrabold text-emerald-800 mt-0.5">
                                {statistics.correct_count || 0} <span className="text-xs font-semibold text-emerald-600">soal</span>
                            </p>
                        </div>

                        {/* Soal Salah */}
                        <div className="bg-rose-50/70 rounded-2xl p-3 border border-rose-200">
                            <p className="text-[10px] font-bold text-rose-700 uppercase">Jawaban Salah</p>
                            <p className="text-xl font-extrabold text-rose-800 mt-0.5">
                                {statistics.wrong_count || 0} <span className="text-xs font-semibold text-rose-600">soal</span>
                            </p>
                        </div>

                        {/* Tidak Dijawab */}
                        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Tidak Dijawab</p>
                            <p className="text-xl font-extrabold text-slate-700 mt-0.5">
                                {statistics.unanswered_count || 0} <span className="text-xs font-semibold text-slate-500">soal</span>
                            </p>
                        </div>

                        {/* Essay Penilaian */}
                        <div className="bg-amber-50/70 rounded-2xl p-3 border border-amber-200">
                            <p className="text-[10px] font-bold text-amber-800 uppercase">Soal Essay</p>
                            <p className="text-xl font-extrabold text-amber-900 mt-0.5">
                                {statistics.essay_count || 0} <span className="text-xs font-semibold text-amber-700">soal</span>
                            </p>
                        </div>

                        {/* Total Poin Diperoleh */}
                        <div className="bg-indigo-50/70 rounded-2xl p-3 border border-indigo-200">
                            <p className="text-[10px] font-bold text-indigo-700 uppercase">Poin Diperoleh</p>
                            <p className="text-xl font-extrabold text-indigo-900 mt-0.5">
                                {statistics.total_points_earned || 0} <span className="text-xs font-semibold text-indigo-600">/ {statistics.total_possible_points || 0}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. Control Toolbar: Filter & View Mode */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
                    {/* Status Filters */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                            <Filter className="w-3.5 h-3.5" />
                            <span>Filter Analisis:</span>
                        </span>

                        <button
                            type="button"
                            onClick={() => { setFilterStatus('all'); setCurrentIndex(0); }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                                filterStatus === 'all'
                                    ? 'bg-[#800020] text-white shadow-xs'
                                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            Semua Soal ({questions.length})
                        </button>

                        <button
                            type="button"
                            onClick={() => { setFilterStatus('wrong'); setCurrentIndex(0); }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                                filterStatus === 'wrong'
                                    ? 'bg-rose-600 text-white shadow-xs'
                                    : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
                            }`}
                            title="Tampilkan butir soal yang dijawab salah oleh siswa"
                        >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Hanya yang Salah ({statistics.wrong_count + statistics.unanswered_count})</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => { setFilterStatus('correct'); setCurrentIndex(0); }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                                filterStatus === 'correct'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
                            }`}
                        >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Hanya yang Benar ({statistics.correct_count})</span>
                        </button>

                        {statistics.essay_count > 0 && (
                            <button
                                type="button"
                                onClick={() => { setFilterStatus('essay'); setCurrentIndex(0); }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                                    filterStatus === 'essay'
                                        ? 'bg-amber-600 text-white shadow-xs'
                                        : 'bg-white text-amber-700 border border-amber-300 hover:bg-amber-50'
                                }`}
                            >
                                <HelpCircle className="w-3.5 h-3.5" />
                                <span>Soal Essay ({statistics.essay_count})</span>
                            </button>
                        )}
                    </div>

                    {/* View Mode Switcher */}
                    <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs self-start sm:self-auto">
                        <button
                            type="button"
                            onClick={() => setViewMode('single')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                viewMode === 'single'
                                    ? 'bg-[#800020] text-white shadow-xs'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            <Layers className="w-3.5 h-3.5" />
                            <span>Per Soal</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setViewMode('all')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                viewMode === 'all'
                                    ? 'bg-[#800020] text-white shadow-xs'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            <LayoutList className="w-3.5 h-3.5" />
                            <span>Lembar Lengkap (Semua)</span>
                        </button>
                    </div>
                </div>

                {/* 3. Main Question Content Area */}
                {viewMode === 'all' ? (
                    /* Mode Tampilkan Semua Soal Sekaligus */
                    <div className="space-y-6">
                        {filteredQuestions.length > 0 ? (
                            filteredQuestions.map((q, idx) => {
                                const originalNumber = questions.findIndex(orig => orig.id === q.id) + 1;
                                return renderQuestionDetail(q, idx, originalNumber);
                            })
                        ) : (
                            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500">
                                Tidak ada soal yang cocok dengan filter yang dipilih.
                            </div>
                        )}
                    </div>
                ) : (
                    /* Mode Per Soal dengan Grid Navigator Sidebar */
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Single Question Container */}
                        <div className="lg:col-span-3 space-y-4">
                            {currentQuestion ? (
                                <div className="space-y-4">
                                    {(() => {
                                        const originalNumber = questions.findIndex(orig => orig.id === currentQuestion.id) + 1;
                                        return renderQuestionDetail(currentQuestion, safeIndex, originalNumber);
                                    })()}

                                    {/* Pagination Controls */}
                                    <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-slate-200 shadow-xs print:hidden">
                                        <button
                                            type="button"
                                            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                                            disabled={safeIndex === 0}
                                            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition flex items-center gap-1.5"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            <span>Soal Sebelumnya</span>
                                        </button>

                                        <span className="text-xs font-bold text-slate-500">
                                            Soal {safeIndex + 1} dari {filteredQuestions.length}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => setCurrentIndex(prev => Math.min(filteredQuestions.length - 1, prev + 1))}
                                            disabled={safeIndex === filteredQuestions.length - 1}
                                            className="px-4 py-2.5 rounded-xl bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold disabled:opacity-40 transition flex items-center gap-1.5"
                                        >
                                            <span>Soal Berikutnya</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500">
                                    Tidak ada butir soal dalam filter ini.
                                </div>
                            )}
                        </div>

                        {/* Navigator Sidebar */}
                        <div className="lg:col-span-1 space-y-4 print:hidden">
                            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm sticky top-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        Nomor Soal
                                    </h4>
                                    <span className="text-[11px] font-bold text-slate-500">
                                        Total {questions.length}
                                    </span>
                                </div>

                                {/* Numbers Grid */}
                                <div className="grid grid-cols-5 gap-2 max-h-[360px] overflow-y-auto p-1">
                                    {questions.map((q, idx) => {
                                        const st = getQuestionStatus(q);
                                        const isCurrent = currentQuestion?.id === q.id;

                                        let btnStyle = 'bg-slate-100 text-slate-700 border-slate-200';
                                        if (st === 'correct') btnStyle = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                                        if (st === 'wrong') btnStyle = 'bg-rose-100 text-rose-800 border-rose-300';
                                        if (st === 'unanswered') btnStyle = 'bg-slate-100 text-slate-500 border-dashed border-slate-300';
                                        if (st === 'waiting') btnStyle = 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse';
                                        if (st === 'graded') btnStyle = 'bg-indigo-100 text-indigo-800 border-indigo-300';

                                        if (isCurrent) {
                                            btnStyle += ' ring-2 ring-[#800020] font-black scale-105 shadow-xs';
                                        }

                                        return (
                                            <button
                                                key={q.id}
                                                type="button"
                                                onClick={() => {
                                                    // Jika pertanyaan ini ada di filter saat ini, pindah ke index-nya.
                                                    // Jika tidak ada di filter saat ini, kembalikan filter ke 'all' dulu.
                                                    const targetInFiltered = filteredQuestions.findIndex(item => item.id === q.id);
                                                    if (targetInFiltered !== -1) {
                                                        setCurrentIndex(targetInFiltered);
                                                    } else {
                                                        setFilterStatus('all');
                                                        const targetInAll = questions.findIndex(item => item.id === q.id);
                                                        setCurrentIndex(targetInAll !== -1 ? targetInAll : 0);
                                                    }
                                                }}
                                                className={`aspect-square rounded-xl border flex items-center justify-center text-xs font-bold transition hover:scale-105 ${btnStyle}`}
                                            >
                                                {idx + 1}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Legend */}
                                <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-600 font-medium">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3.5 h-3.5 rounded bg-emerald-100 border border-emerald-300 shrink-0" />
                                        <span>Jawaban Benar</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-3.5 h-3.5 rounded bg-rose-100 border border-rose-300 shrink-0" />
                                        <span>Jawaban Salah</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-300 border-dashed shrink-0" />
                                        <span>Tidak Dijawab</span>
                                    </div>
                                    {statistics.essay_count > 0 && (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <span className="w-3.5 h-3.5 rounded bg-amber-100 border border-amber-300 shrink-0" />
                                                <span>Essay Belum Dinilai</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-3.5 h-3.5 rounded bg-indigo-100 border border-indigo-300 shrink-0" />
                                                <span>Essay Sudah Dinilai</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <Link
                                    href={route('exams.results', exam.id)}
                                    className="w-full block text-center py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition"
                                >
                                    Kembali ke Rekapitulasi
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
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
