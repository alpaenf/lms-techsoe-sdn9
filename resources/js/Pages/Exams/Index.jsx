import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, 
    Search, 
    Calendar, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    Eye, 
    FileText, 
    Users, 
    Play, 
    StopCircle, 
    Trash2, 
    Edit, 
    Award,
    Activity,
    ClipboardCheck
} from 'lucide-react';

export default function ExamsIndex({ auth, exams = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredExams = exams.filter(e => {
        const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.subject?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handlePublish = (id) => {
        if (confirm('Terbitkan ujian ini agar dapat diakses oleh siswa sesuai jadwal?')) {
            router.post(route('exams.publish', id));
        }
    };

    const handleClose = (id) => {
        if (confirm('Tutup ujian ini? Siswa tidak akan dapat memulai sesi ujian baru.')) {
            router.post(route('exams.close', id));
        }
    };

    const handleDelete = (id, title) => {
        if (confirm(`Apakah Anda yakin ingin menghapus ujian "${title}" beserta seluruh bank soal dan nilai siswa?`)) {
            router.delete(route('exams.destroy', id));
        }
    };

    const getCategoryBadge = (category) => {
        const map = {
            uts: { label: 'UTS', bg: 'bg-purple-500/10 text-purple-700 border-purple-200' },
            uas: { label: 'UAS', bg: 'bg-indigo-500/10 text-indigo-700 border-indigo-200' },
            ulangan_harian: { label: 'Ulangan Harian', bg: 'bg-blue-500/10 text-blue-700 border-blue-200' },
            ujian_sekolah: { label: 'Ujian Sekolah', bg: 'bg-amber-500/10 text-amber-700 border-amber-200' },
            kuis: { label: 'Kuis', bg: 'bg-teal-500/10 text-teal-700 border-teal-200' },
        };
        const cat = map[category] || { label: category, bg: 'bg-slate-100 text-slate-700 border-slate-200' };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-semibold border ${cat.bg}`}>
                {cat.label}
            </span>
        );
    };

    const getStatusBadge = (status) => {
        if (status === 'published') {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Diterbitkan
                </span>
            );
        }
        if (status === 'closed') {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                    <StopCircle className="w-3 h-3 mr-1" />
                    Ditutup
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/10 text-amber-700 border border-amber-500/20">
                <AlertCircle className="w-3 h-3 mr-1" />
                Draf
            </span>
        );
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const cleanStr = String(dateStr).replace(' ', 'T');
        const date = new Date(cleanStr);
        if (isNaN(date.getTime())) return '-';
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">
                            Manajemen Ujian Sekolah Online
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Bank soal, pengaturan asesmen digital, pengawasan real-time, dan rekap nilai
                        </p>
                    </div>

                    <Link
                        href={route('exams.create')}
                        className="inline-flex items-center px-4 py-2.5 rounded-xl bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold transition shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-1.5" />
                        Buat Ujian Baru
                    </Link>
                </div>
            }
        >
            <Head title="Manajemen Ujian Online - Smart School LMS" />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Filter and Search */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari judul ujian atau mata pelajaran..."
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:border-[#800020] focus:ring-[#800020]"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">Status:</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-[#800020] focus:ring-[#800020] bg-white"
                        >
                            <option value="all">Semua Status</option>
                            <option value="published">Diterbitkan</option>
                            <option value="draft">Draf</option>
                            <option value="closed">Ditutup</option>
                        </select>
                    </div>
                </div>

                {/* Exam List */}
                {filteredExams.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredExams.map((exam) => (
                            <div
                                key={exam.id}
                                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#800020] transition duration-200 shadow-sm space-y-4"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {getStatusBadge(exam.status)}
                                            {getCategoryBadge(exam.exam_category)}
                                            <span className="text-xs font-semibold text-slate-500">
                                                {exam.subject?.name} • {exam.class ? exam.class.name : 'Semua Rombel'}
                                            </span>
                                        </div>
                                        <h3 className="text-base font-bold text-slate-900">
                                            {exam.title}
                                        </h3>
                                        {exam.description && (
                                            <p className="text-xs text-slate-500 line-clamp-1">
                                                {exam.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                                        <Link
                                            href={route('exams.show', exam.id)}
                                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center transition"
                                        >
                                            <FileText className="w-3.5 h-3.5 mr-1" />
                                            Kelola Soal ({exam.questions?.length || 0})
                                        </Link>

                                        <Link
                                            href={route('exams.monitor', exam.id)}
                                            className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-xs font-bold text-blue-700 flex items-center transition"
                                        >
                                            <Activity className="w-3.5 h-3.5 mr-1" />
                                            Pantau Sesi
                                        </Link>

                                        <Link
                                            href={route('exams.results', exam.id)}
                                            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-700 flex items-center transition"
                                        >
                                            <Award className="w-3.5 h-3.5 mr-1" />
                                            Rekap Nilai
                                        </Link>

                                        {exam.status === 'draft' ? (
                                            <button
                                                onClick={() => handlePublish(exam.id)}
                                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center transition"
                                            >
                                                <Play className="w-3.5 h-3.5 mr-1" />
                                                Terbitkan
                                            </button>
                                        ) : exam.status === 'published' ? (
                                            <button
                                                onClick={() => handleClose(exam.id)}
                                                className="px-3 py-1.5 rounded-xl bg-slate-600 hover:bg-slate-700 text-white text-xs font-bold flex items-center transition"
                                            >
                                                <StopCircle className="w-3.5 h-3.5 mr-1" />
                                                Tutup
                                            </button>
                                        ) : null}

                                        <Link
                                            href={route('exams.edit', exam.id)}
                                            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                                            title="Edit Pengaturan"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(exam.id, exam.title)}
                                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                            title="Hapus Ujian"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Quick Details Bar */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
                                    <div className="flex items-center text-slate-600">
                                        <Clock className="w-4 h-4 text-slate-400 mr-2" />
                                        <span>Durasi: <strong>{exam.duration_minutes} Menit</strong></span>
                                    </div>
                                    <div className="flex items-center text-slate-600">
                                        <Calendar className="w-4 h-4 text-slate-400 mr-2" />
                                        <span>Mulai: {formatDate(exam.start_time)}</span>
                                    </div>
                                    <div className="flex items-center text-slate-600">
                                        <Calendar className="w-4 h-4 text-slate-400 mr-2" />
                                        <span>Berakhir: {formatDate(exam.end_time)}</span>
                                    </div>
                                    <div className="flex items-center text-slate-600">
                                        <Award className="w-4 h-4 text-slate-400 mr-2" />
                                        <span>KKM: <strong>{exam.passing_score}</strong></span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
                        <ClipboardCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h4 className="text-base font-bold text-slate-900">Belum Ada Ujian Online</h4>
                        <p className="text-xs text-slate-500 mt-1 mb-4">
                            Buat paket ujian baru untuk rombongan belajar Anda dengan pilihan soal ganda, isian, dan essay.
                        </p>
                        <Link
                            href={route('exams.create')}
                            className="inline-flex items-center px-4 py-2.5 rounded-xl bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold transition shadow-sm"
                        >
                            <Plus className="w-4 h-4 mr-1.5" />
                            Mulai Buat Ujian
                        </Link>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
