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

    // State untuk PGK MCMA (Kotak Centang - Kunci Lebih dari Satu dengan Pilihan Dinamis)
    const [mcmaOptions, setMcmaOptions] = useState([
        { id: 'A', text: '', isCorrect: false, imagePreview: null, imageFile: null, removeImage: false, existingImagePath: null },
        { id: 'B', text: '', isCorrect: false, imagePreview: null, imageFile: null, removeImage: false, existingImagePath: null },
        { id: 'C', text: '', isCorrect: false, imagePreview: null, imageFile: null, removeImage: false, existingImagePath: null },
    ]);

    const handleAddMcmaOption = () => {
        if (mcmaOptions.length >= 8) {
            alert('Maksimal 8 pilihan jawaban untuk PGK MCMA.');
            return;
        }
        const nextLetter = String.fromCharCode(65 + mcmaOptions.length);
        setMcmaOptions(prev => [
            ...prev,
            {
                id: nextLetter,
                text: '',
                isCorrect: false,
                imagePreview: null,
                imageFile: null,
                removeImage: false,
                existingImagePath: null,
            }
        ]);
    };

    const handleRemoveMcmaOption = (indexToRemove) => {
        if (mcmaOptions.length <= 2) {
            alert('Minimal harus ada 2 pilihan jawaban untuk PGK MCMA.');
            return;
        }
        setMcmaOptions(prev => {
            const filtered = prev.filter((_, idx) => idx !== indexToRemove);
            return filtered.map((item, idx) => ({
                ...item,
                id: String.fromCharCode(65 + idx)
            }));
        });
    };

    const handleMcmaOptionImageChange = (index, e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            alert('Ukuran berkas gambar maksimal adalah 10MB.');
            return;
        }

        setMcmaOptions(prev => prev.map((opt, i) => i === index ? {
            ...opt,
            imageFile: file,
            imagePreview: URL.createObjectURL(file),
            removeImage: false,
        } : opt));
    };

    const handleRemoveMcmaOptionImage = (index) => {
        setMcmaOptions(prev => prev.map((opt, i) => i === index ? {
            ...opt,
            imageFile: null,
            imagePreview: null,
            removeImage: true,
            existingImagePath: null,
        } : opt));
    };

    // State untuk PGK Kategori (Tabel Benar / Salah)
    const [kategoriRows, setKategoriRows] = useState([
        { id: 'A', text: '' },
        { id: 'B', text: '' },
        { id: 'C', text: '' }
    ]);
    const [kategoriAnswers, setKategoriAnswers] = useState({ A: 'Benar', B: 'Benar', C: 'Salah' });

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
        setMcmaOptions([
            { id: 'A', text: '', isCorrect: false, imagePreview: null, imageFile: null, removeImage: false, existingImagePath: null },
            { id: 'B', text: '', isCorrect: false, imagePreview: null, imageFile: null, removeImage: false, existingImagePath: null },
            { id: 'C', text: '', isCorrect: false, imagePreview: null, imageFile: null, removeImage: false, existingImagePath: null },
        ]);
        setKategoriRows([
            { id: 'A', text: '' },
            { id: 'B', text: '' },
            { id: 'C', text: '' }
        ]);
        setKategoriAnswers({ A: 'Benar', B: 'Benar', C: 'Salah' });
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

        // Initialize PGK MCMA
        if (q.question_type === 'pgk_mcma') {
            let parsedMcma = [];
            try {
                parsedMcma = typeof q.correct_answer === 'string' ? JSON.parse(q.correct_answer) : (q.correct_answer || []);
            } catch (e) {
                parsedMcma = [String(q.correct_answer)];
            }
            if (!Array.isArray(parsedMcma)) parsedMcma = [];

            const rawOptions = q.options || {};
            const entries = Object.entries(rawOptions);
            if (entries.length > 0) {
                setMcmaOptions(entries.map(([key, val], idx) => {
                    const letter = key || String.fromCharCode(65 + idx);
                    const imgPath = q.option_images?.[letter] || null;
                    return {
                        id: letter,
                        text: val || '',
                        isCorrect: parsedMcma.includes(letter),
                        imagePreview: imgPath ? `/storage/${imgPath}` : null,
                        imageFile: null,
                        removeImage: false,
                        existingImagePath: imgPath,
                    };
                }));
            } else {
                setMcmaOptions([
                    { id: 'A', text: '', isCorrect: false, imagePreview: null, imageFile: null, removeImage: false, existingImagePath: null },
                    { id: 'B', text: '', isCorrect: false, imagePreview: null, imageFile: null, removeImage: false, existingImagePath: null },
                    { id: 'C', text: '', isCorrect: false, imagePreview: null, imageFile: null, removeImage: false, existingImagePath: null },
                ]);
            }
        } else {
            setMcmaOptions([
                { id: 'A', text: '', isCorrect: false, imagePreview: null, imageFile: null, removeImage: false, existingImagePath: null },
                { id: 'B', text: '', isCorrect: false, imagePreview: null, imageFile: null, removeImage: false, existingImagePath: null },
                { id: 'C', text: '', isCorrect: false, imagePreview: null, imageFile: null, removeImage: false, existingImagePath: null },
            ]);
        }

        // Initialize PGK Kategori
        if (q.question_type === 'pgk_kategori') {
            let rows = [
                { id: 'A', text: '' },
                { id: 'B', text: '' },
                { id: 'C', text: '' }
            ];
            if (q.options?.rows && Array.isArray(q.options.rows)) {
                rows = q.options.rows;
            }
            setKategoriRows(rows);

            let parsedKategori = {};
            try {
                parsedKategori = typeof q.correct_answer === 'string' ? JSON.parse(q.correct_answer) : (q.correct_answer || {});
            } catch (e) {
                parsedKategori = {};
            }
            setKategoriAnswers(parsedKategori);
        } else {
            setKategoriRows([
                { id: 'A', text: '' },
                { id: 'B', text: '' },
                { id: 'C', text: '' }
            ]);
            setKategoriAnswers({ A: 'Benar', B: 'Benar', C: 'Salah' });
        }

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

        const hasText = Boolean(questionForm.question_text && questionForm.question_text.trim());
        const hasImg = Boolean(questionImagePreview);
        if (!hasText && !hasImg) {
            alert('Silakan tuliskan teks soal atau unggah foto/gambar soal terlebih dahulu.');
            return;
        }

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

        if (questionForm.question_type === 'pgk_mcma') {
            if (mcmaOptions.length < 2) {
                alert('Tipe soal PGK MCMA minimal harus memiliki 2 pilihan jawaban.');
                return;
            }
            for (const opt of mcmaOptions) {
                const hasText = opt.text !== undefined && opt.text !== null && String(opt.text).trim() !== '';
                const hasImg = Boolean(opt.imagePreview);
                if (!hasText && !hasImg) {
                    alert(`Pilihan ${opt.id} belum memiliki teks jawaban atau gambar.`);
                    return;
                }
            }
            const correctCount = mcmaOptions.filter(o => o.isCorrect).length;
            if (correctCount === 0) {
                alert('Silakan pilih setidaknya satu kotak centang kunci jawaban benar untuk PGK MCMA.');
                return;
            }
        }

        if (questionForm.question_type === 'pgk_kategori') {
            if (kategoriRows.length < 2) {
                alert('Tipe soal PGK Kategori minimal harus memiliki 2 baris pernyataan.');
                return;
            }
            for (const row of kategoriRows) {
                if (!row.text || !row.text.trim()) {
                    alert(`Pernyataan baris ${row.id} masih kosong. Silakan lengkapi teks pernyataan.`);
                    return;
                }
                if (!kategoriAnswers[row.id]) {
                    alert(`Silakan pilih kunci (Benar / Salah) untuk pernyataan baris ${row.id}.`);
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

        if (questionForm.question_type === 'multiple_choice') {
            formData.append('correct_answer', questionForm.correct_answer || 'A');
            ['A', 'B', 'C', 'D'].forEach((opt) => {
                formData.append(`options[${opt}]`, questionForm.options?.[opt] || '');
                if (optionImageFiles[opt]) {
                    formData.append(`option_image_files[${opt}]`, optionImageFiles[opt]);
                }
                if (removeOptionImages[opt]) {
                    formData.append(`remove_option_images[${opt}]`, '1');
                }
            });
        } else if (questionForm.question_type === 'pgk_mcma') {
            const correctArr = mcmaOptions.filter(o => o.isCorrect).map(o => o.id);
            formData.append('correct_answer', JSON.stringify(correctArr));
            mcmaOptions.forEach((opt) => {
                formData.append(`options[${opt.id}]`, opt.text || '');
                if (opt.imageFile) {
                    formData.append(`option_image_files[${opt.id}]`, opt.imageFile);
                } else if (opt.existingImagePath && !opt.removeImage) {
                    formData.append(`existing_option_images[${opt.id}]`, opt.existingImagePath);
                }
                if (opt.removeImage) {
                    formData.append(`remove_option_images[${opt.id}]`, '1');
                }
            });
        } else if (questionForm.question_type === 'pgk_kategori') {
            formData.append('options', JSON.stringify({ categories: ['Benar', 'Salah'], rows: kategoriRows }));
            formData.append('correct_answer', JSON.stringify(kategoriAnswers));
        } else {
            formData.append('correct_answer', questionForm.correct_answer || '');
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
            preserveScroll: true,
            onSuccess: () => {
                setIsQuestionModalOpen(false);
                setIsSubmittingQuestion(false);
            },
            onError: (errors) => {
                setIsSubmittingQuestion(false);
                const firstErr = Object.values(errors)[0];
                if (firstErr) alert(firstErr);
            },
            onFinish: () => {
                setIsSubmittingQuestion(false);
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
                                            <span>#{idx + 1}</span>
                                        </span>
                                        <div>
                                            <span className="inline-flex items-center text-[10px] font-bold uppercase">
                                                {q.question_type === 'multiple_choice' && <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">Pilihan Ganda</span>}
                                                {q.question_type === 'pgk_mcma' && <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full">PGK MCMA (Kotak Centang)</span>}
                                                {q.question_type === 'pgk_kategori' && <span className="bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-0.5 rounded-full">PGK Kategori (Benar / Salah)</span>}
                                                {q.question_type === 'short_answer' && <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full">Isian Singkat</span>}
                                                {q.question_type === 'essay' && <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full">Essay / Uraian</span>}
                                            </span>
                                            <span className="ml-2 text-xs font-bold text-[#800020]">
                                                <span>{q.points} Poin</span>
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
                                                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                                        <span className="font-bold text-slate-900">{key}.</span>
                                                        <span className="font-normal text-slate-700 truncate">
                                                            {val ? String(val) : <span className="italic text-slate-400 font-normal">(Hanya Gambar)</span>}
                                                        </span>
                                                    </div>
                                                    {q.correct_answer === key && (
                                                        <span className="text-[10px] bg-emerald-200 text-emerald-800 font-bold px-1.5 py-0.5 rounded shrink-0 ml-2">
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

                                {/* PGK MCMA Preview */}
                                {q.question_type === 'pgk_mcma' && q.options && (() => {
                                    let correctArr = [];
                                    try {
                                        correctArr = typeof q.correct_answer === 'string' ? JSON.parse(q.correct_answer) : (q.correct_answer || []);
                                    } catch (e) {
                                        correctArr = [String(q.correct_answer)];
                                    }
                                    if (!Array.isArray(correctArr)) correctArr = [];

                                    return (
                                        <div className="space-y-2 pt-2">
                                            <p className="text-[11px] font-bold text-indigo-900 flex items-center gap-1.5 mb-1.5">
                                                <span>Pilihan Jawaban (Kotak Centang - Kunci Lebih dari Satu):</span>
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                {Object.entries(q.options).map(([key, val]) => {
                                                    const isKey = correctArr.includes(key);
                                                    return (
                                                        <div
                                                            key={key}
                                                            className={`p-3 rounded-xl border text-xs space-y-2 ${
                                                                isKey
                                                                    ? 'bg-indigo-50/70 border-indigo-300 font-medium text-indigo-950'
                                                                    : 'bg-slate-50 border-slate-200 text-slate-700'
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                    <span className={`w-4 h-4 rounded border flex items-center justify-center font-bold text-[10px] shrink-0 ${isKey ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'}`}>
                                                                        {isKey ? '✓' : ''}
                                                                    </span>
                                                                    <span className="font-bold text-slate-900">{key}.</span>
                                                                    <span className="font-normal text-slate-700 truncate">
                                                                        {val ? String(val) : <span className="italic text-slate-400 font-normal">(Hanya Gambar)</span>}
                                                                    </span>
                                                                </div>
                                                                {isKey && (
                                                                    <span className="text-[10px] bg-indigo-200 text-indigo-800 font-bold px-1.5 py-0.5 rounded shrink-0 ml-2">
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
                                                                        className="max-h-24 rounded-lg border border-slate-200 bg-white object-contain p-1 cursor-pointer hover:opacity-95 shadow-sm transition"
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

                                {/* PGK Kategori Preview */}
                                {q.question_type === 'pgk_kategori' && (() => {
                                    let rows = q.options?.rows || [];
                                    let correctMap = {};
                                    try {
                                        correctMap = typeof q.correct_answer === 'string' ? JSON.parse(q.correct_answer) : (q.correct_answer || {});
                                    } catch (e) {
                                        correctMap = {};
                                    }

                                    return (
                                        <div className="pt-2 space-y-2">
                                            <p className="text-[11px] font-bold text-teal-900 flex items-center gap-1.5 mb-1.5">
                                                <span>Tabel Pernyataan & Kunci Kategori (Benar / Salah):</span>
                                            </p>
                                            <div className="overflow-x-auto rounded-xl border border-teal-100">
                                                <table className="w-full text-xs text-left">
                                                    <thead className="bg-teal-50/80 text-teal-900 font-bold border-b border-teal-100">
                                                        <tr>
                                                            <th className="py-2.5 px-3 w-12 text-center">#</th>
                                                            <th className="py-2.5 px-3">Pernyataan</th>
                                                            <th className="py-2.5 px-3 w-28 text-center">Kunci Kategori</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-teal-50 bg-white">
                                                        {rows.map((row) => (
                                                            <tr key={row.id} className="hover:bg-teal-50/30">
                                                                <td className="py-2.5 px-3 font-bold text-teal-950 text-center">{row.id}</td>
                                                                <td className="py-2.5 px-3 text-slate-800 font-medium">{row.text}</td>
                                                                <td className="py-2.5 px-3 text-center">
                                                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                                                                        correctMap[row.id] === 'Benar'
                                                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                                                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                                                                    }`}>
                                                                        {correctMap[row.id] || '-'}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    );
                                })()}

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
                                        <option value="pgk_mcma">PGK MCMA (Kotak Centang - Jawaban Lebih dari Satu)</option>
                                        <option value="pgk_kategori">PGK Kategori (Tabel Benar / Salah)</option>
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

                            {/* PGK MCMA Builder (Kotak Centang) */}
                            {questionForm.question_type === 'pgk_mcma' && (
                                <div className="space-y-3 pt-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-1">
                                        <div>
                                            <p className="text-xs font-bold text-indigo-900">
                                                Pilihan Jawaban & Kunci Benar (Bisa Pilih &gt; 1):
                                            </p>
                                            <p className="text-[11px] text-slate-500">
                                                Centang kotak pada pilihan yang merupakan jawaban benar (bisa tambah/hapus pilihan)
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleAddMcmaOption}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition self-start sm:self-auto shadow-sm"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            Tambah Pilihan Jawaban
                                        </button>
                                    </div>

                                    <div className="space-y-2.5">
                                        {mcmaOptions.map((opt, idx) => {
                                            const isChecked = opt.isCorrect;
                                            return (
                                                <div
                                                    key={opt.id}
                                                    className={`border rounded-2xl p-3.5 space-y-2.5 transition ${
                                                        isChecked ? 'bg-indigo-50/50 border-indigo-300' : 'bg-slate-50/80 border-slate-200'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <label className="flex items-center gap-1.5 cursor-pointer shrink-0" title={`Tandai ${opt.id} sebagai salah satu kunci benar`}>
                                                            <input
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                onChange={() => {
                                                                    setMcmaOptions(prev => prev.map((item, i) => i === idx ? { ...item, isCorrect: !item.isCorrect } : item));
                                                                }}
                                                                className="text-indigo-600 focus:ring-indigo-500 rounded w-4 h-4 cursor-pointer"
                                                            />
                                                            <span className="text-xs font-extrabold text-indigo-900 w-5">{opt.id}.</span>
                                                        </label>

                                                        <input
                                                            type="text"
                                                            value={opt.text}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setMcmaOptions(prev => prev.map((item, i) => i === idx ? { ...item, text: val } : item));
                                                            }}
                                                            placeholder={`Pernyataan / opsi ${opt.id} (opsional jika foto diunggah)...`}
                                                            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-indigo-600 focus:ring-indigo-600 bg-white font-medium"
                                                        />

                                                        {/* Upload button for option */}
                                                        <label
                                                            className="px-3 py-2.5 rounded-xl border border-slate-200 hover:border-indigo-600 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-bold cursor-pointer flex items-center gap-1.5 transition shrink-0 shadow-sm"
                                                            title={`Unggah foto gambar pilihan ${opt.id}`}
                                                        >
                                                            <Upload className="w-3.5 h-3.5 text-slate-400" />
                                                            <span className="hidden sm:inline">Foto {opt.id}</span>
                                                            <span className="sm:hidden">Foto</span>
                                                            <input
                                                                type="file"
                                                                accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.bmp,.svg,.jfif,.avif"
                                                                onChange={(e) => handleMcmaOptionImageChange(idx, e)}
                                                                className="hidden"
                                                            />
                                                        </label>

                                                        {/* Delete button if options > 2 */}
                                                        {mcmaOptions.length > 2 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveMcmaOption(idx)}
                                                                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition shrink-0"
                                                                title={`Hapus Pilihan ${opt.id}`}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Option Image Preview if present */}
                                                    {opt.imagePreview && (
                                                        <div className="flex items-center gap-3 pl-8 pt-1">
                                                            <img
                                                                src={opt.imagePreview}
                                                                alt={`Gambar Opsi ${opt.id}`}
                                                                className="h-20 max-w-[180px] object-contain rounded-xl border border-slate-200 bg-white p-1 cursor-pointer hover:opacity-90 shadow-sm"
                                                                onClick={() => setLightboxImage(opt.imagePreview)}
                                                                title="Klik untuk perbesar foto"
                                                            />
                                                            <div className="space-y-1">
                                                                <span className="text-[11px] font-bold text-slate-700 block">
                                                                    Foto Pilihan {opt.id} Terlampir
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveMcmaOptionImage(idx)}
                                                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-800 transition"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                    Hapus Foto Opsi {opt.id}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <p className="text-[11px] text-slate-400">
                                        Tandai semua kotak centang yang menjadi kunci jawaban benar. Siswa harus memilih tepat semua kunci untuk mendapatkan poin.
                                    </p>
                                </div>
                            )}

                            {/* PGK Kategori Builder (Tabel Matriks Benar / Salah) */}
                            {questionForm.question_type === 'pgk_kategori' && (
                                <div className="space-y-3 pt-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-1">
                                        <div>
                                            <p className="text-xs font-bold text-teal-950">
                                                Daftar Pernyataan & Kunci Kategori (Benar / Salah):
                                            </p>
                                            <p className="text-[11px] text-slate-500">
                                                Tuliskan butir pernyataan dan pilih radio Benar atau Salah sebagai kuncinya
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const nextId = String.fromCharCode(65 + kategoriRows.length);
                                                setKategoriRows(prev => [...prev, { id: nextId, text: '' }]);
                                                setKategoriAnswers(prev => ({ ...prev, [nextId]: 'Benar' }));
                                            }}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200 transition self-start sm:self-auto"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            Tambah Baris Pernyataan
                                        </button>
                                    </div>

                                    <div className="space-y-2.5">
                                        {kategoriRows.map((row) => (
                                            <div
                                                key={row.id}
                                                className="p-3.5 rounded-2xl border border-teal-200 bg-teal-50/30 space-y-2"
                                            >
                                                <div className="flex items-start gap-2">
                                                    <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-900 font-extrabold text-xs flex items-center justify-center shrink-0 mt-1">
                                                        {row.id}
                                                    </span>
                                                    <textarea
                                                        rows={2}
                                                        value={row.text}
                                                        onChange={(e) => {
                                                            const newText = e.target.value;
                                                            setKategoriRows(prev => prev.map(r => r.id === row.id ? { ...r, text: newText } : r));
                                                        }}
                                                        placeholder={`Tuliskan teks pernyataan baris ${row.id}...`}
                                                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-teal-600 focus:ring-teal-600 bg-white font-medium resize-none"
                                                    />
                                                    {kategoriRows.length > 2 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setKategoriRows(prev => prev.filter(r => r.id !== row.id));
                                                                setKategoriAnswers(prev => {
                                                                    const copy = { ...prev };
                                                                    delete copy[row.id];
                                                                    return copy;
                                                                });
                                                            }}
                                                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition shrink-0 mt-1"
                                                            title="Hapus Baris Ini"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Radio Kunci Benar / Salah */}
                                                <div className="flex items-center justify-end gap-6 pr-2 pt-1 border-t border-teal-100">
                                                    <span className="text-[11px] font-bold text-slate-600 mr-auto">
                                                        Kunci baris {row.id}:
                                                    </span>
                                                    <label className="flex items-center gap-1.5 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name={`kategori_kunci_${row.id}`}
                                                            checked={kategoriAnswers[row.id] === 'Benar'}
                                                            onChange={() => setKategoriAnswers(prev => ({ ...prev, [row.id]: 'Benar' }))}
                                                            className="text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                                                        />
                                                        <span className="text-xs font-bold text-emerald-800">Benar</span>
                                                    </label>
                                                    <label className="flex items-center gap-1.5 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name={`kategori_kunci_${row.id}`}
                                                            checked={kategoriAnswers[row.id] === 'Salah'}
                                                            onChange={() => setKategoriAnswers(prev => ({ ...prev, [row.id]: 'Salah' }))}
                                                            className="text-rose-600 focus:ring-rose-500 w-4 h-4"
                                                        />
                                                        <span className="text-xs font-bold text-rose-800">Salah</span>
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <p className="text-[11px] text-slate-400">
                                        Tentukan pilihan Benar atau Salah pada setiap baris pernyataan yang menjadi kunci jawaban.
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
                                    {isSubmittingQuestion ? (
                                        <span className="inline-flex items-center gap-1.5">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Menyimpan...</span>
                                        </span>
                                    ) : (
                                        <span>{editingQuestion ? 'Simpan Perubahan' : 'Tambahkan ke Paket'}</span>
                                    )}
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
