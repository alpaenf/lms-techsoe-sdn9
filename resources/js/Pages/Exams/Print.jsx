import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Printer, ArrowLeft, Download, CheckSquare, Eye, EyeOff } from 'lucide-react';
import QuestionContentRenderer from '@/Components/QuestionContentRenderer';

export default function ExamPrint({
    exam = {},
    schoolProfile = null,
}) {
    const [showAnswerKey, setShowAnswerKey] = useState(false);
    const questions = exam.questions || [];

    const handlePrint = () => {
        window.print();
    };

    const formatDateIndo = (dateStr) => {
        if (!dateStr) return '-';
        const parts = String(dateStr).slice(0, 10).split('-');
        if (parts.length === 3) {
            const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
            return d.toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }
        return dateStr;
    };

    const targetClassLabel = exam.classes && exam.classes.length > 1
        ? exam.classes.map(c => c.name).join(', ')
        : (exam.class?.name || (exam.exam_category === 'ujian_sekolah' ? 'Seluruh Kelas 6' : 'Semua Rombel'));

    return (
        <div className="min-h-screen bg-slate-100 py-6 px-4 print:p-0 print:bg-white text-slate-900 font-serif">
            <Head title={`Cetak Naskah Ujian - ${exam.title}`} />

            {/* Top Action Bar (Hidden when printing) */}
            <div className="max-w-4xl mx-auto mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between no-print font-sans">
                <Link
                    href={route('exams.show', exam.id)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition inline-flex items-center space-x-1.5"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Kelola Ujian</span>
                </Link>

                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={() => setShowAnswerKey(!showAnswerKey)}
                        className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition inline-flex items-center space-x-1.5 ${
                            showAnswerKey
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                        title="Tampilkan / sembunyikan kunci jawaban untuk versi cetak"
                    >
                        {showAnswerKey ? <Eye className="w-4 h-4 text-amber-700" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
                        <span>{showAnswerKey ? 'Kunci Jawaban: Tampil' : 'Kunci Jawaban: Sembunyi'}</span>
                    </button>

                    <a
                        href={route('exams.export-word', exam.id)}
                        className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition inline-flex items-center space-x-1.5"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export Word (.docx)</span>
                    </a>

                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold rounded-xl shadow-md transition inline-flex items-center space-x-1.5"
                    >
                        <Printer className="w-4 h-4" />
                        <span>Cetak Sekarang</span>
                    </button>
                </div>
            </div>

            {/* Printable Document Container */}
            <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 print:p-0 shadow-lg print:shadow-none border border-slate-200 print:border-none rounded-2xl print:rounded-none">
                {/* School Letterhead (KOP SURAT) */}
                <div className="border-b-[3px] border-double border-slate-900 pb-3 mb-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="w-20 h-20 shrink-0 flex items-center justify-center">
                            {schoolProfile?.logo ? (
                                <img
                                    src={`/storage/${schoolProfile.logo}`}
                                    alt="Logo Sekolah"
                                    className="max-h-20 max-w-20 object-contain"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full border-2 border-slate-800 flex items-center justify-center font-bold text-lg font-sans">
                                    SD
                                </div>
                            )}
                        </div>

                        <div className="flex-1 text-center font-sans space-y-0.5">
                            <p className="text-xs font-bold tracking-wider uppercase text-slate-700">
                                {schoolProfile?.district ? `PEMERINTAH KABUPATEN / KOTA` : 'DINAS PENDIDIKAN DAN KEBUDAYAAN'}
                            </p>
                            <h1 className="text-lg sm:text-xl font-extrabold tracking-wide uppercase text-slate-900">
                                {schoolProfile?.name || 'SD NEGERI 9 SAMARINDA'}
                            </h1>
                            <p className="text-[11px] text-slate-600">
                                {schoolProfile?.address || 'Jl. P. Hidayatullah, Samarinda, Kalimantan Timur'}
                                {schoolProfile?.phone ? ` • Telp: ${schoolProfile.phone}` : ''}
                                {schoolProfile?.email ? ` • Email: ${schoolProfile.email}` : ''}
                            </p>
                        </div>

                        <div className="w-20 shrink-0 hidden sm:block"></div>
                    </div>
                </div>

                {/* Exam Title */}
                <div className="text-center my-3 font-sans">
                    <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-slate-900">
                        {exam.title}
                    </h2>
                    {exam.academic_year && (
                        <p className="text-xs font-bold text-slate-700 uppercase">
                            Tahun Ajaran {exam.academic_year.name}
                        </p>
                    )}
                    {showAnswerKey && (
                        <span className="inline-block mt-1 px-3 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-extrabold uppercase rounded-full">
                            NASKAH DENGAN KUNCI JAWABAN (PEGANGAN GURU)
                        </span>
                    )}
                </div>

                {/* Identity & Exam Details Table */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 border border-slate-400 rounded-lg text-xs font-sans mb-4">
                    <div className="space-y-1">
                        <div className="flex">
                            <span className="w-32 font-bold text-slate-700">Mata Pelajaran</span>
                            <span className="mr-2 font-bold">:</span>
                            <span className="font-semibold">{exam.subject?.name || '-'}</span>
                        </div>
                        <div className="flex">
                            <span className="w-32 font-bold text-slate-700">Kelas / Rombel</span>
                            <span className="mr-2 font-bold">:</span>
                            <span className="font-semibold">{targetClassLabel}</span>
                        </div>
                        <div className="flex">
                            <span className="w-32 font-bold text-slate-700">Guru Pengampu</span>
                            <span className="mr-2 font-bold">:</span>
                            <span className="font-semibold">{exam.teacher?.full_name || exam.teacher?.user?.name || '-'}</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex">
                            <span className="w-28 font-bold text-slate-700">Hari, Tanggal</span>
                            <span className="mr-2 font-bold">:</span>
                            <span className="font-semibold">{formatDateIndo(exam.start_time)}</span>
                        </div>
                        <div className="flex">
                            <span className="w-28 font-bold text-slate-700">Alokasi Waktu</span>
                            <span className="mr-2 font-bold">:</span>
                            <span className="font-semibold">{exam.duration_minutes} Menit</span>
                        </div>
                        <div className="flex">
                            <span className="w-28 font-bold text-slate-700">Nama Siswa</span>
                            <span className="mr-2 font-bold">:</span>
                            <span className="font-mono text-slate-400">................................................</span>
                        </div>
                    </div>
                </div>

                {/* Petunjuk Umum */}
                <div className="p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-[11px] font-sans text-slate-700 mb-6 space-y-0.5">
                    <p className="font-bold text-slate-900">Petunjuk Umum:</p>
                    <ol className="list-decimal list-inside space-y-0.5 pl-1 leading-relaxed">
                        <li>Tulislah nama dan nomor presensi Anda pada kolom identitas yang telah disediakan.</li>
                        <li>Bacalah setiap butir soal dengan teliti dan cermat sebelum menjawab.</li>
                        <li>Dahulukan menjawab soal-soal yang Anda anggap lebih mudah.</li>
                        <li>Periksa kembali seluruh lembar jawaban sebelum diserahkan kepada pengawas ujian.</li>
                    </ol>
                </div>

                {/* Questions List */}
                <div className="space-y-6">
                    {questions.map((q, idx) => {
                        const qNum = idx + 1;
                        return (
                            <div key={q.id} className="text-sm leading-relaxed page-break-inside-avoid">
                                {/* Number, Text, and Points */}
                                <div className="flex items-start gap-2">
                                    <span className="font-bold text-base w-6 shrink-0">{qNum}.</span>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <QuestionContentRenderer
                                                    text={q.question_text}
                                                    images={q.question_images || (q.question_image ? [q.question_image] : [])}
                                                    alignment={q.image_alignment || 'center'}
                                                    position={q.image_position || 'bottom'}
                                                    className="font-medium text-slate-900 leading-relaxed font-serif text-sm"
                                                    imageClassName="max-h-60 max-w-md object-contain"
                                                    isPrint={true}
                                                />
                                            </div>
                                            <span className="text-[10px] font-sans font-bold text-slate-500 border border-slate-300 px-1.5 py-0.5 rounded shrink-0">
                                                {q.points} Poin
                                            </span>
                                        </div>

                                        {/* 1. Multiple Choice Options */}
                                        {q.question_type === 'multiple_choice' && q.options && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pt-1 font-sans text-xs">
                                                {['A', 'B', 'C', 'D'].map((letter) => {
                                                    const optText = q.options[letter];
                                                    const optImg = q.option_images?.[letter];
                                                    const isCorrect = String(q.correct_answer).toUpperCase() === letter;

                                                    return (
                                                        <div
                                                            key={letter}
                                                            className={`flex items-start gap-2 p-1.5 rounded ${
                                                                showAnswerKey && isCorrect
                                                                    ? 'bg-emerald-50 border border-emerald-400 font-bold text-emerald-950'
                                                                    : ''
                                                            }`}
                                                        >
                                                            <span className="font-bold w-4 shrink-0">{letter}.</span>
                                                            <div className="space-y-1">
                                                                {optImg && (
                                                                    <img
                                                                        src={`/storage/${optImg}`}
                                                                        alt={`Gambar ${letter}`}
                                                                        className="max-h-24 max-w-full rounded border border-slate-300 object-contain"
                                                                    />
                                                                )}
                                                                {optText && <span>{optText}</span>}
                                                                {showAnswerKey && isCorrect && (
                                                                    <span className="text-[10px] text-emerald-700 font-extrabold ml-1 font-sans">
                                                                        [Kunci Benar]
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* 2. PGK MCMA Options (Checkbox multiple) */}
                                        {q.question_type === 'pgk_mcma' && q.options && (() => {
                                            let correctArr = [];
                                            try {
                                                correctArr = typeof q.correct_answer === 'string' ? JSON.parse(q.correct_answer) : (q.correct_answer || []);
                                            } catch (e) {
                                                correctArr = [String(q.correct_answer)];
                                            }
                                            if (!Array.isArray(correctArr)) correctArr = [];

                                            return (
                                                <div className="space-y-1.5 pt-1 font-sans text-xs">
                                                    <p className="text-[11px] text-slate-500 italic">
                                                        * Berilah tanda centang (✓) pada kotak untuk pilihan jawaban yang benar (jawaban dapat lebih dari satu).
                                                    </p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {Object.entries(q.options).map(([key, val]) => {
                                                            const isCorrect = correctArr.includes(key);
                                                            const optImg = q.option_images?.[key];
                                                            return (
                                                                <div
                                                                    key={key}
                                                                    className={`flex items-start gap-2 p-2 rounded border ${
                                                                        showAnswerKey && isCorrect
                                                                            ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-950'
                                                                            : 'border-slate-300'
                                                                    }`}
                                                                >
                                                                    <span className="w-4 h-4 rounded border border-slate-500 inline-flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                                                        {showAnswerKey && isCorrect ? '✓' : ''}
                                                                    </span>
                                                                    <div className="space-y-1 flex-1">
                                                                        <span className="font-bold mr-1">{key}.</span>
                                                                        {optImg && (
                                                                            <img
                                                                                src={`/storage/${optImg}`}
                                                                                alt={`Gambar ${key}`}
                                                                                className="max-h-24 max-w-full rounded border border-slate-300 object-contain"
                                                                            />
                                                                        )}
                                                                        <span>{val}</span>
                                                                        {showAnswerKey && isCorrect && (
                                                                            <span className="text-[10px] text-emerald-700 font-bold ml-1">
                                                                                [Kunci]
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        {/* 3. PGK Kategori Table */}
                                        {q.question_type === 'pgk_kategori' && (() => {
                                            const rows = q.options?.rows || [];
                                            const categories = (Array.isArray(q.options?.categories) && q.options.categories.length >= 2)
                                                ? q.options.categories
                                                : ['Benar', 'Salah'];
                                            let correctMap = {};
                                            try {
                                                correctMap = typeof q.correct_answer === 'string' ? JSON.parse(q.correct_answer) : (q.correct_answer || {});
                                            } catch (e) {
                                                correctMap = {};
                                            }

                                            return (
                                                <div className="pt-1 space-y-1.5 font-sans">
                                                    <p className="text-[11px] text-slate-500 italic">
                                                        * Berilah tanda centang (✓) pada kolom <strong>{categories[0]}</strong> atau <strong>{categories[1]}</strong> untuk setiap pernyataan berikut.
                                                    </p>
                                                    <table className="w-full text-xs text-left border-collapse border border-slate-400">
                                                        <thead>
                                                            <tr className="bg-slate-100 border-b border-slate-400 font-bold">
                                                                <th className="py-2 px-2.5 w-10 text-center border-r border-slate-400">#</th>
                                                                <th className="py-2 px-3 border-r border-slate-400">Pernyataan</th>
                                                                <th className="py-2 px-3 w-28 text-center border-r border-slate-400">{categories[0]}</th>
                                                                <th className="py-2 px-3 w-28 text-center">{categories[1]}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-300">
                                                            {rows.map((row) => (
                                                                <tr key={row.id}>
                                                                    <td className="py-2 px-2.5 text-center font-bold border-r border-slate-300">
                                                                        {row.id}
                                                                    </td>
                                                                    <td className="py-2 px-3 border-r border-slate-300">
                                                                        <div className="space-y-1">
                                                                            {q.option_images?.[row.id] && (
                                                                                <img
                                                                                    src={`/storage/${q.option_images[row.id]}`}
                                                                                    alt={`Gambar ${row.id}`}
                                                                                    className="max-h-24 max-w-xs rounded border border-slate-300 object-contain"
                                                                                />
                                                                            )}
                                                                            {row.text && <div>{row.text}</div>}
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-2 px-3 text-center border-r border-slate-300 font-extrabold text-sm">
                                                                        {showAnswerKey && correctMap[row.id] === categories[0] ? '✓' : ''}
                                                                    </td>
                                                                    <td className="py-2 px-3 text-center font-extrabold text-sm">
                                                                        {showAnswerKey && correctMap[row.id] === categories[1] ? '✓' : ''}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            );
                                        })()}

                                        {/* 4. Short Answer */}
                                        {q.question_type === 'short_answer' && (
                                            <div className="pt-2 font-sans text-xs">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-700">Jawaban:</span>
                                                    <span className="flex-1 border-b border-dotted border-slate-400 h-5"></span>
                                                </div>
                                                {showAnswerKey && (
                                                    <p className="mt-1 text-emerald-800 font-bold">
                                                        Kunci Jawaban: <span className="font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{q.correct_answer}</span>
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* 5. Essay / Uraian */}
                                        {q.question_type === 'essay' && (
                                            <div className="pt-2 font-sans space-y-2">
                                                <span className="text-xs font-bold text-slate-700">Lembar Jawaban / Uraian:</span>
                                                <div className="space-y-3.5 pt-1">
                                                    <div className="border-b border-dotted border-slate-400 h-4"></div>
                                                    <div className="border-b border-dotted border-slate-400 h-4"></div>
                                                    <div className="border-b border-dotted border-slate-400 h-4"></div>
                                                    <div className="border-b border-dotted border-slate-400 h-4"></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer Signatures */}
                <div className="mt-12 pt-6 border-t border-slate-300 grid grid-cols-2 text-center text-xs font-sans page-break-inside-avoid">
                    <div>
                        <p className="text-slate-600">Mengetahui,</p>
                        <p className="font-bold text-slate-900 mt-0.5">Kepala Sekolah</p>
                        <div className="h-20 sm:h-24"></div>
                        <p className="font-bold text-slate-900 underline underline-offset-2">
                            {schoolProfile?.headmaster_name || '................................................'}
                        </p>
                        <p className="text-slate-600 text-[11px] mt-0.5">
                            NIP. {schoolProfile?.headmaster_nip || '........................................'}
                        </p>
                    </div>

                    <div>
                        <p className="text-slate-600">
                            Samarinda, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <p className="font-bold text-slate-900 mt-0.5">Guru Pengampu</p>
                        <div className="h-20 sm:h-24"></div>
                        <p className="font-bold text-slate-900 underline underline-offset-2">
                            {exam.teacher?.full_name || exam.teacher?.user?.name || '................................................'}
                        </p>
                        <p className="text-slate-600 text-[11px] mt-0.5">
                            NIP. {exam.teacher?.nip || exam.teacher?.nuptk || '........................................'}
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    body {
                        background: #ffffff !important;
                        color: #000000 !important;
                    }
                    @page {
                        size: A4 portrait;
                        margin: 1.5cm 1cm 1.5cm 1cm;
                    }
                    .page-break-inside-avoid {
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }
                }
            `}</style>
        </div>
    );
}

