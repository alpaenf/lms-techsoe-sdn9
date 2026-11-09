import React, { useState, useEffect, useCallback, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { 
    Clock, 
    Save,
    Send,
    AlertTriangle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    X,
    ShieldAlert
} from 'lucide-react';

export default function TakeExam({ auth, attempt, exam, questions = [], answers = {}, time_remaining }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [studentAnswers, setStudentAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(time_remaining);
    const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
    const [lastSavedTime, setLastSavedTime] = useState(null);

    // In-page modal states (No browser alerts / confirms)
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showFiveMinWarning, setShowFiveMinWarning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lightboxImage, setLightboxImage] = useState(null);

    // Keep studentAnswers in a ref so periodic autosave always has latest answers without re-creating timers
    const answersRef = useRef(studentAnswers);
    answersRef.current = studentAnswers;

    const currentQuestion = questions[currentQuestionIndex];

    // Initialize answers from backend props
    useEffect(() => {
        const initialAnswers = {};
        Object.keys(answers).forEach(qId => {
            initialAnswers[qId] = answers[qId]?.answer_text || '';
        });
        setStudentAnswers(initialAnswers);
    }, [answers]);

    // Timer countdown
    useEffect(() => {
        if (timeLeft <= 0) {
            handleAutoSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleAutoSubmit();
                    return 0;
                }
                if (prev === 300) { // 5 minutes remaining
                    setShowFiveMinWarning(true);
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Save answer via background axios call (no Inertia page re-renders, no JSON mismatch)
    const saveAnswerApi = useCallback(async (questionId, answerValue) => {
        if (!questionId) return;

        setSaveStatus('saving');
        try {
            await axios.post(route('student.exams.save', attempt.id), {
                question_id: questionId,
                answer_text: answerValue ?? ''
            });
            setSaveStatus('saved');
            setLastSavedTime(new Date());
        } catch (err) {
            console.error('Gagal menyimpan jawaban:', err);
            setSaveStatus('error');
        }
    }, [attempt.id]);

    // Periodic auto-save every 10 seconds
    useEffect(() => {
        const autoSave = setInterval(() => {
            const curQ = questions[currentQuestionIndex];
            if (curQ) {
                const currentVal = answersRef.current[curQ.id] || '';
                saveAnswerApi(curQ.id, currentVal);
            }
        }, 10000);

        return () => clearInterval(autoSave);
    }, [currentQuestionIndex, questions, saveAnswerApi]);

    const handleAnswerChange = (questionId, value) => {
        setStudentAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));

        // For multiple choice, save immediately on selection
        if (currentQuestion?.question_type === 'multiple_choice') {
            saveAnswerApi(questionId, value);
        }
    };

    // Helpers untuk PGK MCMA (Kotak Centang)
    const getMcmaSelected = (qId) => {
        const val = studentAnswers[qId];
        if (!val) return [];
        if (Array.isArray(val)) return val;
        try {
            const parsed = JSON.parse(val);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return val ? [val] : [];
        }
    };

    const toggleMcmaOption = (qId, key) => {
        const currentList = getMcmaSelected(qId);
        const updated = currentList.includes(key)
            ? currentList.filter(k => k !== key)
            : [...currentList, key];
        const serialized = updated.length > 0 ? JSON.stringify(updated) : '';
        setStudentAnswers(prev => ({ ...prev, [qId]: serialized }));
        saveAnswerApi(qId, serialized);
    };

    // Helpers untuk PGK Kategori (Tabel Benar / Salah)
    const getKategoriMap = (qId) => {
        const val = studentAnswers[qId];
        if (!val) return {};
        if (typeof val === 'object' && !Array.isArray(val) && val !== null) return val;
        try {
            const parsed = JSON.parse(val);
            return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : {};
        } catch (e) {
            return {};
        }
    };

    const setKategoriRowChoice = (qId, rowId, category) => {
        const currentMap = getKategoriMap(qId);
        const updated = { ...currentMap, [rowId]: category };
        const serialized = JSON.stringify(updated);
        setStudentAnswers(prev => ({ ...prev, [qId]: serialized }));
        saveAnswerApi(qId, serialized);
    };

    const handleInputBlur = () => {
        if (currentQuestion) {
            saveAnswerApi(currentQuestion.id, studentAnswers[currentQuestion.id] || '');
        }
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
        return `${minutes}:${String(secs).padStart(2, '0')}`;
    };

    const handleConfirmSubmit = () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        router.post(route('student.exams.submit', attempt.id), {}, {
            onFinish: () => {
                setIsSubmitting(false);
                setShowSubmitModal(false);
            }
        });
    };

    const handleAutoSubmit = () => {
        router.post(route('student.exams.submit', attempt.id));
    };

    const goToQuestion = (index) => {
        if (currentQuestion) {
            saveAnswerApi(currentQuestion.id, studentAnswers[currentQuestion.id] || '');
        }
        setCurrentQuestionIndex(index);
    };

    const goNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            goToQuestion(currentQuestionIndex + 1);
        }
    };

    const goPrev = () => {
        if (currentQuestionIndex > 0) {
            goToQuestion(currentQuestionIndex - 1);
        }
    };

    const isAnswered = (qId) => {
        const val = studentAnswers[qId];
        if (!val || !String(val).trim()) return false;
        if (val === '[]' || val === '{}') return false;

        const q = questions.find(item => item.id === Number(qId));
        if (q && q.question_type === 'pgk_kategori') {
            const rows = q.options?.rows || [];
            if (rows.length === 0) return true;
            try {
                const parsed = typeof val === 'object' ? val : JSON.parse(val);
                if (typeof parsed !== 'object' || parsed === null) return false;
                return rows.every(r => parsed[r.id] && String(parsed[r.id]).trim());
            } catch (e) {
                return false;
            }
        }
        return true;
    };

    const answeredCount = questions.filter(q => isAnswered(q.id)).length;
    const unansweredCount = questions.length - answeredCount;

    // Timer color based on remaining time
    const getTimerColor = () => {
        if (timeLeft > 600) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
        if (timeLeft > 300) return 'text-orange-700 bg-orange-50 border-orange-300';
        return 'text-red-700 bg-red-50 border-red-300 animate-pulse';
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">
                            {exam.title}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {exam.subject?.name} • Percobaan #{attempt.attempt_number}
                        </p>
                    </div>

                    <div className={`flex items-center px-4 py-2 rounded-2xl text-sm font-extrabold border-2 shadow-sm ${getTimerColor()}`}>
                        <Clock className="w-5 h-5 mr-2" />
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                </div>
            }
        >
            <Head title={`Kerjakan: ${exam.title}`} />

            <div className="max-w-7xl mx-auto space-y-4">
                {/* 5-minute warning banner (in-page notification, no alert) */}
                {showFiveMinWarning && (
                    <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center justify-between text-xs text-amber-900 shadow-sm animate-fade-in">
                        <div className="flex items-center gap-2.5 font-bold">
                            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                            <span>Perhatian: Waktu pengerjaan ujian tersisa kurang dari 5 menit! Periksa kembali jawaban Anda.</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowFiveMinWarning(false)}
                            className="text-amber-600 hover:text-amber-800 p-1"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Content - Questions */}
                    <div className="lg:col-span-3 space-y-4">
                        {/* Progress Bar & Status */}
                        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1.5 text-xs font-bold text-slate-600">
                                    <span>Progres: {answeredCount} dari {questions.length} soal dijawab</span>
                                    <span>{Math.round((answeredCount / (questions.length || 1)) * 100)}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                    <div 
                                        className="bg-[#800020] h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${(answeredCount / (questions.length || 1)) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Auto-save status indicator */}
                            <div className="flex items-center text-xs font-semibold text-slate-500 shrink-0">
                                {saveStatus === 'saving' && (
                                    <span className="text-amber-600 flex items-center">
                                        <Save className="w-3.5 h-3.5 mr-1 animate-spin" />
                                        Menyimpan...
                                    </span>
                                )}
                                {saveStatus === 'saved' && (
                                    <span className="text-emerald-600 flex items-center">
                                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                        Tersimpan
                                    </span>
                                )}
                                {saveStatus === 'error' && (
                                    <span className="text-rose-600 flex items-center">
                                        <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                                        Gagal simpan
                                    </span>
                                )}
                                {saveStatus === 'idle' && (
                                    <span className="text-slate-400 flex items-center">
                                        <Save className="w-3.5 h-3.5 mr-1" />
                                        Otomatis tersimpan
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Question Card */}
                        {currentQuestion && (
                            <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm space-y-6">
                                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <span className="w-10 h-10 rounded-2xl bg-[#FDF2F4] text-[#800020] text-sm font-extrabold flex items-center justify-center">
                                            {currentQuestionIndex + 1}
                                        </span>
                                        <div>
                                            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                                {currentQuestion.question_type === 'multiple_choice' && 'Pilihan Ganda'}
                                                {currentQuestion.question_type === 'pgk_mcma' && 'PGK MCMA (Kotak Centang)'}
                                                {currentQuestion.question_type === 'pgk_kategori' && (() => {
                                                    const categories = (Array.isArray(currentQuestion.options?.categories) && currentQuestion.options.categories.length >= 2)
                                                        ? currentQuestion.options.categories
                                                        : ['Benar', 'Salah'];
                                                    return `PGK Kategori (${categories[0]} / ${categories[1]})`;
                                                })()}
                                                {currentQuestion.question_type === 'short_answer' && 'Isian Singkat'}
                                                {currentQuestion.question_type === 'essay' && 'Essay / Uraian'}
                                            </p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">
                                                Bobot: {currentQuestion.points} Poin
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Question Text */}
                                <div className="space-y-4">
                                    <p className="text-base text-slate-900 leading-relaxed font-medium whitespace-pre-wrap">
                                        {currentQuestion.question_text}
                                    </p>
                                    {currentQuestion.question_image && (
                                        <div className="pt-2">
                                            <img 
                                                src={`/storage/${currentQuestion.question_image}`}
                                                alt="Gambar Soal"
                                                onClick={() => setLightboxImage(`/storage/${currentQuestion.question_image}`)}
                                                className="rounded-2xl border border-slate-200 max-h-80 object-contain cursor-pointer hover:opacity-95 transition bg-white p-1"
                                                title="Klik untuk perbesar gambar soal"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Answer Input Section */}
                                <div className="space-y-3 pt-2">
                                    {currentQuestion.question_type === 'multiple_choice' && (
                                        <div className="space-y-3">
                                            {Object.entries(currentQuestion.options || {}).map(([key, value]) => {
                                                const isSelected = studentAnswers[currentQuestion.id] === key;
                                                const optionImage = currentQuestion.option_images?.[key];
                                                return (
                                                    <label
                                                        key={key}
                                                        className={`flex items-start p-4 rounded-2xl border-2 cursor-pointer transition duration-150 ${
                                                            isSelected
                                                                ? 'border-[#800020] bg-[#FDF2F4] shadow-sm'
                                                                : 'border-slate-200 hover:border-slate-300 bg-white'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`question-${currentQuestion.id}`}
                                                            value={key}
                                                            checked={isSelected}
                                                            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                                                            className="mt-1 text-[#800020] focus:ring-[#800020] w-4 h-4 shrink-0"
                                                        />
                                                        <div className="ml-3 text-sm font-medium text-slate-900 leading-relaxed flex-1 space-y-2.5">
                                                            <div className="flex items-start">
                                                                <span className="font-extrabold text-[#800020] mr-2 text-base shrink-0">{key}.</span>
                                                                {value ? <span>{value}</span> : null}
                                                            </div>
                                                            {optionImage && (
                                                                <div className="pt-1">
                                                                    <img
                                                                        src={`/storage/${optionImage}`}
                                                                        alt={`Pilihan ${key}`}
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            setLightboxImage(`/storage/${optionImage}`);
                                                                        }}
                                                                        className="rounded-xl border border-slate-200 max-h-56 max-w-full object-contain bg-white p-1.5 hover:opacity-95 shadow-sm transition cursor-zoom-in"
                                                                        title="Klik untuk perbesar gambar opsi"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* PGK MCMA (Kotak Centang) */}
                                    {currentQuestion.question_type === 'pgk_mcma' && (
                                        <div className="space-y-3">
                                            <p className="text-xs font-semibold text-indigo-900 bg-indigo-50 border border-indigo-200 p-3 rounded-xl">
                                                💡 <strong>Petunjuk:</strong> Pilihlah satu atau lebih jawaban yang benar sesuai dengan pertanyaan di atas. (Kotak centang)
                                            </p>

                                            {Object.entries(currentQuestion.options || {}).map(([key, value]) => {
                                                const selectedList = getMcmaSelected(currentQuestion.id);
                                                const isSelected = selectedList.includes(key);
                                                const optionImage = currentQuestion.option_images?.[key];
                                                return (
                                                    <label
                                                        key={key}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            toggleMcmaOption(currentQuestion.id, key);
                                                        }}
                                                        className={`flex items-start p-4 rounded-2xl border-2 cursor-pointer transition duration-150 ${
                                                            isSelected
                                                                ? 'border-indigo-600 bg-indigo-50/70 shadow-sm'
                                                                : 'border-slate-200 hover:border-slate-300 bg-white'
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => {}}
                                                            className="mt-1 text-indigo-600 focus:ring-indigo-500 rounded w-4 h-4 shrink-0"
                                                        />
                                                        <div className="ml-3 text-sm font-medium text-slate-900 leading-relaxed flex-1 space-y-2.5">
                                                            <div className="flex items-start">
                                                                <span className="font-extrabold text-indigo-900 mr-2 text-base shrink-0">{key}.</span>
                                                                {value ? <span>{value}</span> : null}
                                                            </div>
                                                            {optionImage && (
                                                                <div className="pt-1">
                                                                    <img
                                                                        src={`/storage/${optionImage}`}
                                                                        alt={`Pilihan ${key}`}
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            setLightboxImage(`/storage/${optionImage}`);
                                                                        }}
                                                                        className="rounded-xl border border-slate-200 max-h-56 max-w-full object-contain bg-white p-1.5 hover:opacity-95 shadow-sm transition cursor-zoom-in"
                                                                        title="Klik untuk perbesar gambar opsi"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* PGK Kategori */}
                                    {currentQuestion.question_type === 'pgk_kategori' && (() => {
                                        const rows = currentQuestion.options?.rows || [];
                                        const categories = (Array.isArray(currentQuestion.options?.categories) && currentQuestion.options.categories.length >= 2)
                                            ? currentQuestion.options.categories
                                            : ['Benar', 'Salah'];
                                        const cat1 = categories[0] || 'Benar';
                                        const cat2 = categories[1] || 'Salah';
                                        const answersMap = getKategoriMap(currentQuestion.id);

                                        return (
                                            <div className="space-y-4">
                                                <p className="text-xs font-semibold text-teal-900 bg-teal-50 border border-teal-200 p-3 rounded-xl">
                                                    💡 <strong>Petunjuk:</strong> Tentukan <strong>{cat1}</strong> atau <strong>{cat2}</strong> untuk setiap pernyataan pada tabel berikut!
                                                </p>

                                                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                                                    <table className="w-full text-sm text-left border-collapse">
                                                        <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                                                            <tr>
                                                                <th className="py-3.5 px-3 w-12 text-center">#</th>
                                                                <th className="py-3.5 px-4 min-w-[240px]">Pernyataan</th>
                                                                <th className="py-3.5 px-3 w-32 text-center text-teal-800 bg-teal-50/60 font-extrabold">{cat1}</th>
                                                                <th className="py-3.5 px-3 w-32 text-center text-slate-700 bg-slate-100/60 font-extrabold">{cat2}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100">
                                                            {rows.map((row) => {
                                                                const currentChoice = answersMap[row.id];
                                                                return (
                                                                    <tr key={row.id} className="hover:bg-slate-50/50 transition">
                                                                        <td className="py-4 px-3 text-center font-bold text-slate-900 align-middle">
                                                                            <span className="w-7 h-7 rounded-lg bg-slate-100 inline-flex items-center justify-center text-xs font-extrabold text-slate-800">
                                                                                {row.id}
                                                                            </span>
                                                                        </td>
                                                                        <td className="py-4 px-4 text-slate-800 font-medium leading-relaxed align-middle">
                                                                            {row.text}
                                                                        </td>
                                                                        <td 
                                                                            onClick={() => setKategoriRowChoice(currentQuestion.id, row.id, cat1)}
                                                                            className={`py-4 px-3 text-center align-middle cursor-pointer transition ${
                                                                                currentChoice === cat1 ? 'bg-teal-50/80 font-bold' : 'hover:bg-slate-50'
                                                                            }`}
                                                                        >
                                                                            <div className="flex items-center justify-center">
                                                                                <input
                                                                                    type="radio"
                                                                                    name={`kategori_${currentQuestion.id}_${row.id}`}
                                                                                    checked={currentChoice === cat1}
                                                                                    onChange={() => setKategoriRowChoice(currentQuestion.id, row.id, cat1)}
                                                                                    className="w-5 h-5 text-teal-600 focus:ring-teal-500 cursor-pointer"
                                                                                />
                                                                            </div>
                                                                        </td>
                                                                        <td 
                                                                            onClick={() => setKategoriRowChoice(currentQuestion.id, row.id, cat2)}
                                                                            className={`py-4 px-3 text-center align-middle cursor-pointer transition ${
                                                                                currentChoice === cat2 ? 'bg-slate-100/80 font-bold' : 'hover:bg-slate-50'
                                                                            }`}
                                                                        >
                                                                            <div className="flex items-center justify-center">
                                                                                <input
                                                                                    type="radio"
                                                                                    name={`kategori_${currentQuestion.id}_${row.id}`}
                                                                                    checked={currentChoice === cat2}
                                                                                    onChange={() => setKategoriRowChoice(currentQuestion.id, row.id, cat2)}
                                                                                    className="w-5 h-5 text-slate-700 focus:ring-slate-500 cursor-pointer"
                                                                                />
                                                                            </div>
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

                                    {currentQuestion.question_type === 'short_answer' && (
                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold text-slate-700">
                                                Tuliskan Jawaban Singkat Anda:
                                            </label>
                                            <input
                                                type="text"
                                                value={studentAnswers[currentQuestion.id] || ''}
                                                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                                                onBlur={handleInputBlur}
                                                placeholder="Ketik kata atau angka jawaban..."
                                                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#800020] focus:ring-[#800020]/20 text-sm font-medium"
                                            />
                                            <p className="text-[11px] text-slate-400">
                                                Huruf besar dan kecil tidak memengaruhi kebenaran jawaban.
                                            </p>
                                        </div>
                                    )}

                                    {currentQuestion.question_type === 'essay' && (
                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold text-slate-700">
                                                Tuliskan Jawaban Uraian Anda:
                                            </label>
                                            <textarea
                                                value={studentAnswers[currentQuestion.id] || ''}
                                                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                                                onBlur={handleInputBlur}
                                                placeholder="Tuliskan uraian penjelasan dan langkah penyelesaian Anda secara lengkap..."
                                                rows={7}
                                                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#800020] focus:ring-[#800020]/20 text-sm resize-none leading-relaxed"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between gap-4 pt-1">
                            <button
                                type="button"
                                onClick={goPrev}
                                disabled={currentQuestionIndex === 0}
                                className="flex items-center px-5 py-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1.5" />
                                Soal Sebelumnya
                            </button>
                            
                            {currentQuestionIndex === questions.length - 1 ? (
                                <button
                                    type="button"
                                    onClick={() => setShowSubmitModal(true)}
                                    className="flex items-center justify-center px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-md"
                                >
                                    <Send className="w-4 h-4 mr-1.5" />
                                    Kumpulkan Ujian Sekarang
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={goNext}
                                    className="flex items-center px-5 py-3 rounded-2xl bg-[#800020] hover:bg-[#5C0017] text-white font-bold text-xs transition shadow-sm"
                                >
                                    Soal Selanjutnya
                                    <ChevronRight className="w-4 h-4 ml-1.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Navigator */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm sticky top-6 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Lembar Navigasi Soal
                                </h3>
                                <span className="text-[11px] font-bold text-[#800020]">
                                    {answeredCount}/{questions.length}
                                </span>
                            </div>

                            <div className="grid grid-cols-5 gap-2">
                                {questions.map((q, index) => {
                                    const active = currentQuestionIndex === index;
                                    const answered = isAnswered(q.id);

                                    let btnClass = 'bg-slate-100 text-slate-600 border-slate-200';
                                    if (active) {
                                        btnClass = 'bg-[#800020] text-white border-[#800020] shadow-sm font-extrabold ring-2 ring-[#800020]/30';
                                    } else if (answered) {
                                        btnClass = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
                                    }

                                    return (
                                        <button
                                            key={q.id}
                                            type="button"
                                            onClick={() => goToQuestion(index)}
                                            className={`aspect-square rounded-xl border flex items-center justify-center text-xs transition hover:scale-105 ${btnClass}`}
                                        >
                                            {index + 1}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Legend */}
                            <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-600">
                                <div className="flex items-center gap-2">
                                    <span className="w-3.5 h-3.5 rounded bg-[#800020]" />
                                    <span>Sedang dibuka</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3.5 h-3.5 rounded bg-emerald-100 border border-emerald-300" />
                                    <span>Sudah dijawab</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-200" />
                                    <span>Belum dijawab</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowSubmitModal(true)}
                                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition"
                            >
                                Kumpulkan Ujian
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* In-Page Submit Confirmation Modal (No browser confirm) */}
            {showSubmitModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-scale-up">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-[#FDF2F4] text-[#800020] flex items-center justify-center font-bold">
                                    <ShieldAlert className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Konfirmasi Pengumpulan Ujian
                                    </h3>
                                    <p className="text-[11px] text-slate-500">
                                        {exam.title}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowSubmitModal(false)}
                                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Summary of answers */}
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3 text-center">
                                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                                    <p className="text-xs font-bold text-emerald-800">Dijawab</p>
                                    <p className="text-xl font-extrabold text-emerald-600 mt-0.5">{answeredCount}</p>
                                </div>

                                <div className={`p-3.5 rounded-2xl border ${
                                    unansweredCount > 0 
                                        ? 'bg-rose-50 border-rose-200' 
                                        : 'bg-slate-50 border-slate-200'
                                }`}>
                                    <p className={`text-xs font-bold ${unansweredCount > 0 ? 'text-rose-800' : 'text-slate-600'}`}>
                                        Belum Dijawab
                                    </p>
                                    <p className={`text-xl font-extrabold mt-0.5 ${unansweredCount > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                                        {unansweredCount}
                                    </p>
                                </div>
                            </div>

                            {unansweredCount > 0 && (
                                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                                    Masih terdapat <strong>{unansweredCount} butir soal</strong> yang belum Anda isi. Soal yang kosong akan dinilai 0 poin.
                                </div>
                            )}

                            <p className="text-xs text-slate-600 font-medium text-center pt-1">
                                Setelah dikumpulkan, lembar jawaban akan ditutup dan tidak dapat diedit kembali.
                            </p>
                        </div>

                        <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setShowSubmitModal(false)}
                                disabled={isSubmitting}
                                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                            >
                                Periksa Lagi
                            </button>

                            <button
                                type="button"
                                onClick={handleConfirmSubmit}
                                disabled={isSubmitting}
                                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
                            >
                                {isSubmitting ? 'Mengumpulkan...' : 'Ya, Kumpulkan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
