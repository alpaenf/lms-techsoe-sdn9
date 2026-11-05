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
    HelpCircle,
    Loader2,
    ZoomIn
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

    const [questionImageFile, setQuestionImageFile] = useState(null);
    const [questionImagePreview, setQuestionImagePreview] = useState(null);
    const [removeQuestionImage, setRemoveQuestionImage] = useState(false);

    const [optionImageFiles, setOptionImageFiles] = useState({ A: null, B: null, C: null, D: null });
    const [optionImagePreviews, setOptionImagePreviews] = useState({ A: null, B: null, C: null, D: null });
    const [removeOptionImages, setRemoveOptionImages] = useState({ A: false, B: false, C: false, D: false });

    const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
    const [lightboxImage, setLightboxImage] = useState(null);

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
        setQuestionImageFile(null);
        setQuestionImagePreview(null);
        setRemoveQuestionImage(false);
        setOptionImageFiles({ A: null, B: null, C: null, D: null });
        setOptionImagePreviews({ A: null, B: null, C: null, D: null });
        setRemoveOptionImages({ A: false, B: false, C: false, D: false });
        setIsQuestionModalOpen(true);
    };

    const openEditQuestionModal = (q) => {
        setEditingQuestion(q);
        setQuestionForm({
            question_type: q.question_type,
            question_text: q.question_text,
            points: q.points || 10,
            options: q.options || { A: '', B: '', C: '', D: '' },
            correct_answer: q.correct_answer || 'A',
        });
        setQuestionImageFile(null);
        setQuestionImagePreview(q.question_image ? `/storage/${q.question_image}` : null);
        setRemoveQuestionImage(false);
        setOptionImageFiles({ A: null, B: null, C: null, D: null });
        setOptionImagePreviews({
            A: q.option_images?.A ? `/storage/${q.option_images.A}` : null,
            B: q.option_images?.B ? `/storage/${q.option_images.B}` : null,
            C: q.option_images?.C ? `/storage/${q.option_images.C}` : null,
            D: q.option_images?.D ? `/storage/${q.option_images.D}` : null,
        });
        setRemoveOptionImages({ A: false, B: false, C: false, D: false });
        setIsQuestionModalOpen(true);
    };

    const handleQuestionImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            alert('Ukuran gambar maksimal adalah 10MB.');
            return;
        }

        setQuestionImageFile(file);
        setQuestionImagePreview(URL.createObjectURL(file));
        setRemoveQuestionImage(false);
    };

    const handleRemoveQuestionImage = () => {
        setQuestionImageFile(null);
        setQuestionImagePreview(null);
        setRemoveQuestionImage(true);
    };

    const handleOptionImageChange = (opt, e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            alert(`Ukuran berkas gambar pilihan ${opt} maksimal adalah 10MB.`);
            return;
        }

        setOptionImageFiles(prev => ({ ...prev, [opt]: file }));
        setOptionImagePreviews(prev => ({ ...prev, [opt]: URL.createObjectURL(file) }));
        setRemoveOptionImages(prev => ({ ...prev, [opt]: false }));
    };

    const handleRemoveOptionImage = (opt) => {
        setOptionImageFiles(prev => ({ ...prev, [opt]: null }));
        setOptionImagePreviews(prev => ({ ...prev, [opt]: null }));
        setRemoveOptionImages(prev => ({ ...prev, [opt]: true }));
    };

    const handleSaveQuestion = (e) => {
        e.preventDefault();

        if (questionForm.question_type === 'multiple_choice') {
            for (const opt of ['A', 'B', 'C', 'D']) {
                const textVal = questionForm.options?.[opt];
                const hasText = textVal !== undefined && textVal !== null && String(textVal).trim() !== '';
                const hasImg = Boolean(optionImagePreviews[opt]);
                if (!hasText && !hasImg) {
                    alert(`Pilihan ${opt} belum memiliki teks jawaban atau gambar.`);
                    return;
                }
            }
        }

        const formData = new FormData();
        if (editingQuestion) {
            formData.append('_method', 'PUT');
        }
        formData.append('question_type', questionForm.question_type);
        formData.append('points', questionForm.points);
        formData.append('question_text', questionForm.question_text);
        formData.append('correct_answer', questionForm.correct_answer || '');

        if (questionForm.question_type === 'multiple_choice') {
            ['A', 'B', 'C', 'D'].forEach((opt) => {
                formData.append(`options[${opt}]`, questionForm.options?.[opt] || '');
                if (optionImageFiles[opt]) {
                    formData.append(`option_image_files[${opt}]`, optionImageFiles[opt]);
                }
                if (removeOptionImages[opt]) {
                    formData.append(`remove_option_images[${opt}]`, '1');
                }
            });
        }

        if (questionImageFile) {
            formData.append('question_image_file', questionImageFile);
        }
        if (removeQuestionImage) {
            formData.append('remove_question_image', '1');
        }

        setIsSubmittingQuestion(true);
        const targetRoute = editingQuestion
            ? route('exams.questions.update', editingQuestion.id)
            : route('exams.questions.add', exam.id);

        router.post(targetRoute, formData, {
            forceFormData: true,
            onSuccess: () => {
                setIsQuestionModalOpen(false);
                setIsSubmittingQuestion(false);
            },
            onError: (errors) => {
                setIsSubmittingQuestion(false);
                const firstErr = Object.values(errors)[0];
                if (firstErr) alert(firstErr);
            }
        });
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
                                {exam.subject?.name} • {exam.class ? exam.class.name : (exam.exam_category === 'ujian_sekolah' ? 'Seluruh Kelas 6 (Kelas Akhir)' : 'Semua Rombel')}
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
                                    <p className="text-sm text-slate-900 leading-relaxed font-medium whitespace-pre-wrap">
                                        {q.question_text}
                                    </p>
                                    {q.question_image && (
                                        <div className="mt-3">
                                            <img
                                                src={`/storage/${q.question_image}`}
                                                alt={`Gambar Soal #${idx + 1}`}
                                                onClick={() => setLightboxImage(`/storage/${q.question_image}`)}
                                                className="rounded-xl border border-slate-200 max-h-56 object-contain cursor-pointer hover:opacity-95 transition bg-white p-1"
                                                title="Klik untuk melihat ukuran penuh"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Options & Answer Preview */}
                                {q.question_type === 'multiple_choice' && q.options && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                        {Object.entries(q.options).map(([key, val]) => (
                                            <div
                                                key={key}
                                                className={`p-3 rounded-xl border text-xs space-y-2 ${
                                                    q.correct_answer === key
                                                        ? 'bg-emerald-50/70 border-emerald-300 font-medium text-emerald-900'
                                                        : 'bg-slate-50 border-slate-200 text-slate-700'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-slate-900">
                                                        {key}. <span className="font-normal">{val || <span className="italic text-slate-400 font-normal">(Hanya Gambar)</span>}</span>
                                                    </span>
                                                    {q.correct_answer === key && (
                                                        <span className="text-[10px] bg-emerald-200 text-emerald-800 font-bold px-1.5 py-0.5 rounded shrink-0">
                                                            Kunci Benar
                                                        </span>
                                                    )}
                                                </div>
                                                {q.option_images?.[key] && (
                                                    <div className="pt-1">
                                                        <img
                                                            src={`/storage/${q.option_images[key]}`}
                                                            alt={`Gambar Pilihan ${key}`}
                                                            onClick={() => setLightboxImage(`/storage/${q.option_images[key]}`)}
                                                            className="max-h-28 rounded-lg border border-slate-200 bg-white object-contain p-1 cursor-pointer hover:opacity-95 transition"
                                                            title="Klik untuk perbesar"
                                                        />
                                                    </div>
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
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#800020] focus:ring-[#800020] resize-none font-medium"
                                />
                            </div>

                            {/* Unggah Gambar / Foto Soal */}
                            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                        <Image className="w-4 h-4 text-[#800020]" />
                                        Unggah Gambar / Foto Soal (Opsional)
                                    </label>
                                    <span className="text-[11px] font-semibold text-[#800020] bg-[#FDF2F4] px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                                        Semua Format Foto Didukung (Maks. 10MB)
                                    </span>
                                </div>

                                {questionImagePreview ? (
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                        <img
                                            src={questionImagePreview}
                                            alt="Pratinjau Gambar Soal"
                                            className="max-h-36 max-w-[240px] rounded-lg object-contain border border-slate-100 bg-slate-50 cursor-pointer hover:opacity-90 transition"
                                            onClick={() => setLightboxImage(questionImagePreview)}
                                            title="Klik untuk melihat ukuran penuh"
                                        />
                                        <div className="space-y-1.5">
                                            <p className="text-xs font-bold text-slate-800">Foto Soal Terlampir</p>
                                            <p className="text-[11px] text-slate-500">Klik gambar untuk melihat ukuran penuh</p>
                                            <button
                                                type="button"
                                                onClick={handleRemoveQuestionImage}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Hapus Foto Soal
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#800020] bg-white text-xs font-bold text-slate-700 hover:text-[#800020] cursor-pointer transition shadow-sm">
                                            <Upload className="w-4 h-4 text-slate-400" />
                                            <span>Pilih Foto / Gambar Soal</span>
                                            <input
                                                type="file"
                                                accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.bmp,.svg,.jfif,.avif"
                                                onChange={handleQuestionImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                        <p className="text-[11px] text-slate-400 mt-1.5">
                                            Mendukung JPG, JPEG, PNG, WEBP, GIF, SVG, BMP, dll. Cocok untuk soal TKA dengan diagram, pola, atau grafik.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Multiple Choice Options */}
                            {questionForm.question_type === 'multiple_choice' && (
                                <div className="space-y-3 pt-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-1">
                                        <p className="text-xs font-bold text-slate-800">
                                            Pilihan Jawaban & Kunci Benar:
                                        </p>
                                        <span className="text-[11px] font-semibold text-slate-500">
                                            Mendukung teks jawaban, foto pilihan (semua format), atau keduanya
                                        </span>
                                    </div>

                                    {['A', 'B', 'C', 'D'].map((opt) => (
                                        <div
                                            key={opt}
                                            className="bg-slate-50/80 border border-slate-200 rounded-2xl p-3.5 space-y-2.5"
                                        >
                                            <div className="flex items-center gap-2">
                                                <label className="flex items-center gap-1.5 cursor-pointer shrink-0" title={`Pilih ${opt} sebagai kunci jawaban`}>
                                                    <input
                                                        type="radio"
                                                        name="correct_answer_radio"
                                                        checked={questionForm.correct_answer === opt}
                                                        onChange={() => setQuestionForm({ ...questionForm, correct_answer: opt })}
                                                        className="text-[#800020] focus:ring-[#800020] w-4 h-4"
                                                    />
                                                    <span className="text-xs font-extrabold text-[#800020] w-5">{opt}.</span>
                                                </label>

                                                <input
                                                    type="text"
                                                    value={questionForm.options[opt] || ''}
                                                    onChange={(e) => setQuestionForm({
                                                        ...questionForm,
                                                        options: { ...questionForm.options, [opt]: e.target.value }
                                                    })}
                                                    placeholder={`Jawaban pilihan ${opt} (opsional jika foto diunggah)...`}
                                                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#800020] focus:ring-[#800020] bg-white font-medium"
                                                />

                                                {/* Upload button for option */}
                                                <label
                                                    className="px-3 py-2.5 rounded-xl border border-slate-200 hover:border-[#800020] bg-white hover:bg-[#FDF2F4] text-slate-700 hover:text-[#800020] text-xs font-bold cursor-pointer flex items-center gap-1.5 transition shrink-0 shadow-sm"
                                                    title={`Unggah foto gambar pilihan ${opt} (semua format)`}
                                                >
                                                    <Upload className="w-3.5 h-3.5 text-slate-400" />
                                                    <span className="hidden sm:inline">Foto {opt}</span>
                                                    <span className="sm:hidden">Foto</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.bmp,.svg,.jfif,.avif"
                                                        onChange={(e) => handleOptionImageChange(opt, e)}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>

                                            {/* Option Image Preview if present */}
                                            {optionImagePreviews[opt] && (
                                                <div className="flex items-center gap-3 pl-8 pt-1">
                                                    <img
                                                        src={optionImagePreviews[opt]}
                                                        alt={`Gambar Opsi ${opt}`}
                                                        className="h-20 max-w-[180px] object-contain rounded-xl border border-slate-200 bg-white p-1 cursor-pointer hover:opacity-90 shadow-sm"
                                                        onClick={() => setLightboxImage(optionImagePreviews[opt])}
                                                        title="Klik untuk perbesar foto"
                                                    />
                                                    <div className="space-y-1">
                                                        <span className="text-[11px] font-bold text-slate-700 block">
                                                            Foto Pilihan {opt} Terlampir
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveOptionImage(opt)}
                                                            className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-800 transition"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                            Hapus Foto Opsi {opt}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <p className="text-[11px] text-slate-400">
                                        Tandai tombol lingkaran pada opsi yang merupakan kunci jawaban benar. Mendukung semua format gambar.
                                    </p>
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
                                    disabled={isSubmittingQuestion}
                                    className="inline-flex items-center px-5 py-2 rounded-xl bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
                                >
                                    {isSubmittingQuestion && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
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
                                    Pilih Berkas Gambar (Semua Format Foto: JPG, PNG, WEBP, GIF, dll. Maks. 10MB)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.bmp,.svg,.jfif,.avif"
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

            {/* Lightbox Preview */}
            {lightboxImage && (
                <div
                    onClick={() => setLightboxImage(null)}
                    className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
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
