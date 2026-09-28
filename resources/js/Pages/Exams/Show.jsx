import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    ArrowLeft, 
    Plus, 
    Clock, 
    Calendar, 
    CheckCircle2, 
    FileText, 
    Users, 
    Play, 
    StopCircle, 
    Edit, 
    Trash2, 
    Image, 
    Upload, 
    X,
    Activity,
    Award,
    HelpCircle
} from 'lucide-react';

export default function ExamsShow({ auth, exam, statistics = {} }) {
    const questions = exam.questions || [];
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);

    const [questionForm, setQuestionForm] = useState({
        question_type: 'multiple_choice',
        question_text: '',
        points: 10,
        options: { A: '', B: '', C: '', D: '' },
        correct_answer: 'A',
    });

    const [imageUploadQuestionId, setImageUploadQuestionId] = useState(null);
    const [selectedImageFile, setSelectedImageFile] = useState(null);

    const openAddQuestionModal = () => {
        setEditingQuestion(null);
        setQuestionForm({
            question_type: 'multiple_choice',
            question_text: '',
            points: 10,
            options: { A: '', B: '', C: '', D: '' },
            correct_answer: 'A',
        });
        setIsQuestionModalOpen(true);
    };

    const openEditQuestionModal = (q) => {
        setEditingQuestion(q);
        setQuestionForm({
            question_type: q.question_type,
            question_text: q.question_text,
            points: q.points || 10,
            options: q.options || { A: '', B: '', C: '', D: '' },
            correct_answer: q.correct_answer || '',
        });
        setIsQuestionModalOpen(true);
    };

    const handleSaveQuestion = (e) => {
        e.preventDefault();
        if (editingQuestion) {
            router.put(route('exams.questions.update', editingQuestion.id), questionForm, {
                onSuccess: () => setIsQuestionModalOpen(false)
            });
        } else {
            router.post(route('exams.questions.add', exam.id), questionForm, {
                onSuccess: () => setIsQuestionModalOpen(false)
            });
        }
    };

    const handleDeleteQuestion = (qId, num) => {
        if (confirm(`Apakah Anda yakin ingin menghapus Soal No. ${num}?`)) {
            router.delete(route('exams.questions.delete', qId));
        }
    };

    const handleImageUpload = (e) => {
        e.preventDefault();
        if (!selectedImageFile || !imageUploadQuestionId) return;

        const formData = new FormData();
        formData.append('image', selectedImageFile);

        router.post(route('exams.questions.image', imageUploadQuestionId), formData, {
            onSuccess: () => {
                setImageUploadQuestionId(null);
                setSelectedImageFile(null);
            }
        });
    };

    const handlePublish = () => {
        if (questions.length === 0) {
            alert('Tambahkan minimal 1 butir soal sebelum menerbitkan ujian!');
            return;
        }
        if (confirm('Terbitkan ujian ini? Siswa yang terdaftar pada rombel ini akan dapat mengakses ujian sesuai jadwal.')) {
            router.post(route('exams.publish', exam.id));
        }
    };

    const handleClose = () => {
        if (confirm('Tutup ujian ini? Siswa tidak akan dapat memulai sesi pengerjaan baru.')) {
            router.post(route('exams.close', exam.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('exams.index')}
                            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 leading-tight">
                                {exam.title}
                            </h2>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                                {exam.subject?.name} • {exam.class ? exam.class.name : 'Semua Rombel'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <Link
                            href={route('exams.monitor', exam.id)}
                            className="inline-flex items-center px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition"
                        >
                            <Activity className="w-4 h-4 mr-1.5" />
                            Pantau Siswa
                        </Link>

                        <Link
                            href={route('exams.results', exam.id)}
                            className="inline-flex items-center px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition"
                        >
                            <Award className="w-4 h-4 mr-1.5" />
                            Rekap Nilai
                        </Link>

                        {exam.status === 'draft' ? (
                            <button
                                onClick={handlePublish}
                                className="inline-flex items-center px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
                            >
                                <Play className="w-4 h-4 mr-1.5" />
                                Terbitkan Ujian
                            </button>
                        ) : exam.status === 'published' ? (
                            <button
                                onClick={handleClose}
                                className="inline-flex items-center px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
                            >
                                <StopCircle className="w-4 h-4 mr-1.5" />
                                Tutup Ujian
                            </button>
                        ) : null}
                    </div>
                </div>
            }
        >
            <Head title={`Kelola Soal - ${exam.title}`} />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Butir Soal</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{questions.length}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Akumulasi Poin</p>
                        <p className="text-2xl font-bold text-[#800020] mt-1">{statistics.total_points || 0}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Siswa Menyelesaikan</p>
                        <p className="text-2xl font-bold text-emerald-600 mt-1">{statistics.completed || 0}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rata-rata Nilai</p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">{statistics.average_score || 0}</p>
                    </div>
                </div>

                {/* Question Section Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Daftar Bank Soal Ujian</h3>
                        <p className="text-xs text-slate-500">Kelola pertanyaan pilihan ganda, isian singkat, dan essay</p>
                    </div>

                    <button
                        onClick={openAddQuestionModal}
                        className="inline-flex items-center px-4 py-2.5 rounded-xl bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold transition shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-1.5" />
                        Tambah Butir Soal
                    </button>
                </div>

                {/* Questions List */}
                {questions.length > 0 ? (
                    <div className="space-y-4">
                        {questions.map((q, idx) => (
                            <div
                                key={q.id}
                                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4"
                            >
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-lg bg-[#FDF2F4] text-[#800020] text-xs font-bold flex items-center justify-center">
                                            #{idx + 1}
                                        </span>
                                        <div>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                                                {q.question_type === 'multiple_choice' && 'Pilihan Ganda'}
                                                {q.question_type === 'short_answer' && 'Isian Singkat'}
                                                {q.question_type === 'essay' && 'Essay / Uraian'}
                                            </span>
                                            <span className="ml-2 text-xs font-bold text-[#800020]">
                                                {q.points} Poin
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setImageUploadQuestionId(q.id)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition"
                                            title="Unggah Gambar Soal"
                                        >
                                            <Image className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => openEditQuestionModal(q)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                                            title="Ubah Soal"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteQuestion(q.id, idx + 1)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                            title="Hapus Soal"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Question Text */}
                                <div>
                                    <p className="text-sm text-slate-900 leading-relaxed font-medium">
                                        {q.question_text}
                                    </p>
                                    {q.question_image && (
                                        <div className="mt-3">
                                            <img
                                                src={`/storage/${q.question_image}`}
                                                alt={`Gambar Soal #${idx + 1}`}
                                                className="rounded-xl border border-slate-200 max-h-56 object-contain"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Options & Answer Preview */}
                                {q.question_type === 'multiple_choice' && q.options && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                                        {Object.entries(q.options).map(([key, val]) => (
                                            <div
                                                key={key}
                                                className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                                                    q.correct_answer === key
                                                        ? 'bg-emerald-50 border-emerald-300 font-semibold text-emerald-900'
                                                        : 'bg-slate-50 border-slate-200 text-slate-700'
                                                }`}
                                            >
                                                <span><strong>{key}.</strong> {val}</span>
                                                {q.correct_answer === key && (
                                                    <span className="text-[10px] bg-emerald-200 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                                                        Kunci
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {q.question_type === 'short_answer' && (
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                                        <span className="text-slate-500 font-semibold">Kunci Jawaban Benar (Cocok Huruf): </span>
                                        <strong className="text-slate-900 font-mono text-sm ml-1">{q.correct_answer}</strong>
                                    </div>
                                )}

                                {q.question_type === 'essay' && (
                                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                                        Soal bertipe essay akan dinilai secara manual oleh guru pada lembar periksa hasil.
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h4 className="text-base font-bold text-slate-900">Belum Ada Soal Ujian</h4>
                        <p className="text-xs text-slate-500 mt-1 mb-4">
                            Tambahkan butir-butir soal pilihan ganda, isian singkat, atau essay ke dalam paket ujian ini.
                        </p>
                        <button
                            onClick={openAddQuestionModal}
                            className="inline-flex items-center px-4 py-2.5 rounded-xl bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold transition shadow-sm"
                        >
                            <Plus className="w-4 h-4 mr-1.5" />
                            Tambah Butir Soal Pertama
                        </button>
                    </div>
                )}
            </div>

            {/* Modal Add / Edit Question */}
            {isQuestionModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="text-base font-bold text-slate-900">
                                {editingQuestion ? 'Perbarui Butir Soal' : 'Tambah Butir Soal Baru'}
                            </h3>
                            <button
                                onClick={() => setIsQuestionModalOpen(false)}
                                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveQuestion} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Jenis / Format Soal
                                    </label>
                                    <select
                                        disabled={Boolean(editingQuestion)}
                                        value={questionForm.question_type}
                                        onChange={(e) => setQuestionForm({ ...questionForm, question_type: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#800020] focus:ring-[#800020] bg-white"
                                    >
                                        <option value="multiple_choice">Pilihan Ganda (A/B/C/D)</option>
                                        <option value="short_answer">Isian Singkat (Cocok Kata)</option>
                                        <option value="essay">Essay / Uraian Bebas</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Bobot Poin
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={100}
                                        required
                                        value={questionForm.points}
                                        onChange={(e) => setQuestionForm({ ...questionForm, points: Number(e.target.value) })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#800020] focus:ring-[#800020]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Pertanyaan / Teks Soal
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={questionForm.question_text}
                                    onChange={(e) => setQuestionForm({ ...questionForm, question_text: e.target.value })}
                                    placeholder="Tuliskan butir pertanyaan di sini..."
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#800020] focus:ring-[#800020] resize-none"
                                />
                            </div>

                            {/* Multiple Choice Options */}
                            {questionForm.question_type === 'multiple_choice' && (
                                <div className="space-y-3 pt-2">
                                    <p className="text-xs font-bold text-slate-700">Pilihan Jawaban & Kunci Benar:</p>
                                    {['A', 'B', 'C', 'D'].map((opt) => (
                                        <div key={opt} className="flex items-center gap-2">
                                            <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                                                <input
                                                    type="radio"
                                                    name="correct_answer_radio"
                                                    checked={questionForm.correct_answer === opt}
                                                    onChange={() => setQuestionForm({ ...questionForm, correct_answer: opt })}
                                                    className="text-[#800020] focus:ring-[#800020]"
                                                />
                                                <span className="text-xs font-bold text-slate-700 w-5">{opt}.</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={questionForm.options[opt] || ''}
                                                onChange={(e) => setQuestionForm({
                                                    ...questionForm,
                                                    options: { ...questionForm.options, [opt]: e.target.value }
                                                })}
                                                placeholder={`Jawaban pilihan ${opt}...`}
                                                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#800020] focus:ring-[#800020]"
                                            />
                                        </div>
                                    ))}
                                    <p className="text-[11px] text-slate-400">Tandai tombol lingkaran pada opsi yang merupakan kunci jawaban benar.</p>
                                </div>
                            )}

                            {/* Short Answer Input */}
                            {questionForm.question_type === 'short_answer' && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Kunci Jawaban Singkat
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={questionForm.correct_answer}
                                        onChange={(e) => setQuestionForm({ ...questionForm, correct_answer: e.target.value })}
                                        placeholder="Jawaban kata atau angka kunci..."
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#800020] focus:ring-[#800020]"
                                    />
                                    <p className="text-[11px] text-slate-400 mt-1">
                                        Sistem akan mengoreksi otomatis dengan mencocokkan teks tanpa membedakan huruf besar/kecil.
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsQuestionModalOpen(false)}
                                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-xl bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold transition shadow-sm"
                                >
                                    {editingQuestion ? 'Simpan Perubahan' : 'Tambahkan ke Paket'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Image Upload */}
            {imageUploadQuestionId && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="text-base font-bold text-slate-900">Unggah Gambar Soal</h3>
                            <button
                                onClick={() => setImageUploadQuestionId(null)}
                                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleImageUpload} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2">
                                    Pilih Berkas Gambar (PNG, JPG, JPEG maks 2MB)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    required
                                    onChange={(e) => setSelectedImageFile(e.target.files[0])}
                                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#FDF2F4] file:text-[#800020] hover:file:bg-[#FCE8EB]"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setImageUploadQuestionId(null)}
                                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-xl bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold transition shadow-sm"
                                >
                                    Unggah Gambar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
