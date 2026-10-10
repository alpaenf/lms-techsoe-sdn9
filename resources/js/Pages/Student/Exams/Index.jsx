import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Clock, 
    BookOpen, 
    CheckCircle2, 
    AlertCircle, 
    Calendar,
    FileText,
    ArrowRight,
    Trophy,
    Timer,
    Users
} from 'lucide-react';

export default function StudentExamsIndex({ auth, exams = [], student }) {
    const getStatusBadge = (exam) => {
        if (!exam.is_available) {
            if (!exam.has_started) {
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        <Clock className="w-3 h-3 mr-1" />
                        Belum Dimulai
                    </span>
                );
            }
            if (exam.has_ended) {
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Ditutup
                    </span>
                );
            }
        }
        
        if (exam.latest_attempt && exam.latest_attempt.status === 'in_progress') {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-orange-500/10 text-orange-700 border border-orange-500/20">
                    <Timer className="w-3 h-3 mr-1" />
                    Sedang Dikerjakan
                </span>
            );
        }

        if (exam.latest_attempt && exam.latest_attempt.status !== 'in_progress') {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Selesai
                </span>
            );
        }

        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-500/10 text-[#800020] border border-rose-200">
                <BookOpen className="w-3 h-3 mr-1" />
                Tersedia
            </span>
        );
    };

    const getCategoryLabel = (category) => {
        const labels = {
            uts: 'UTS',
            uas: 'UAS',
            ulangan_harian: 'Ulangan Harian',
            ujian_sekolah: 'Ujian Sekolah',
            kuis: 'Kuis'
        };
        return labels[category] || category;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const cleanStr = String(dateString).replace(' ', 'T');
        const date = new Date(cleanStr);
        if (isNaN(date.getTime())) return '-';
        return date.toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const upcomingExams = exams.filter(e => !e.has_started);
    const availableExams = exams.filter(e => e.is_available && e.can_attempt);
    const completedExams = exams.filter(e => e.latest_attempt && e.latest_attempt.status !== 'in_progress');
    const inProgressExams = exams.filter(e => e.latest_attempt && e.latest_attempt.status === 'in_progress');

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            Ujian Online
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Daftar ujian yang tersedia untuk Anda
                        </p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-rose-500/10 text-[#800020] border border-rose-200">
                        <Users className="w-3.5 h-3.5 mr-1.5" />
                        {student?.class_name || 'Siswa'}
                    </span>
                </div>
            }
        >
            <Head title="Ujian Online" />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tersedia</p>
                                <p className="text-2xl font-bold text-[#800020] mt-1">{availableExams.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-[#FDF2F4] flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-[#800020]" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Dikerjakan</p>
                                <p className="text-2xl font-bold text-orange-600 mt-1">{inProgressExams.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                                <Timer className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Selesai</p>
                                <p className="text-2xl font-bold text-emerald-600 mt-1">{completedExams.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mendatang</p>
                                <p className="text-2xl font-bold text-slate-600 mt-1">{upcomingExams.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-slate-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* In Progress Exams */}
                {inProgressExams.length > 0 && (
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold mb-1">Ujian Sedang Berlangsung</h3>
                                <p className="text-sm text-orange-100">Lanjutkan ujian yang sedang Anda kerjakan</p>
                            </div>
                            <Timer className="w-12 h-12 opacity-20" />
                        </div>
                        <div className="mt-4 space-y-3">
                            {inProgressExams.map((exam) => (
                                <Link
                                    key={exam.id}
                                    href={route('student.exams.take', exam.latest_attempt.id)}
                                    className="block bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-white">{exam.title}</p>
                                            <p className="text-xs text-orange-100 mt-1">
                                                {exam.subject.name} • Percobaan ke-{exam.latest_attempt.attempt_number}
                                            </p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-white" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Available Exams */}
                {availableExams.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider flex items-center">
                            <BookOpen className="w-4 h-4 mr-2 text-[#800020]" />
                            Ujian Tersedia
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {availableExams.map((exam) => (
                                <Link
                                    key={exam.id}
                                    href={route('student.exams.show', exam.id)}
                                    className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#800020] hover:shadow-md transition group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                {getStatusBadge(exam)}
                                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                    {getCategoryLabel(exam.exam_category)}
                                                </span>
                                            </div>
                                            <h4 className="text-base font-bold text-slate-900 group-hover:text-[#800020] transition">
                                                {exam.title}
                                            </h4>
                                            <p className="text-sm text-slate-600 mt-1">{exam.subject.name} • {exam.teacher_name}</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#800020] transition" />
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <div className="flex items-center text-xs">
                                            <Clock className="w-4 h-4 text-slate-400 mr-2" />
                                            <div>
                                                <p className="text-slate-500">Durasi</p>
                                                <p className="font-semibold text-slate-900">{exam.duration_minutes} menit</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-xs">
                                            <FileText className="w-4 h-4 text-slate-400 mr-2" />
                                            <div>
                                                <p className="text-slate-500">Soal</p>
                                                <p className="font-semibold text-slate-900">{exam.total_questions} soal</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-xs">
                                            <Trophy className="w-4 h-4 text-slate-400 mr-2" />
                                            <div>
                                                <p className="text-slate-500">Percobaan</p>
                                                <p className="font-semibold text-slate-900">
                                                    {exam.attempts_count}/{exam.max_attempts === 999 ? '∞' : exam.max_attempts}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-xs">
                                            <Calendar className="w-4 h-4 text-slate-400 mr-2" />
                                            <div>
                                                <p className="text-slate-500">Berakhir</p>
                                                <p className="font-semibold text-slate-900">
                                                    {new Date(String(exam.end_time).replace(' ', 'T')).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Upcoming Exams */}
                {upcomingExams.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-slate-600" />
                            Ujian Mendatang
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {upcomingExams.map((exam) => (
                                <div
                                    key={exam.id}
                                    className="bg-slate-50 rounded-2xl p-6 border border-slate-200"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                {getStatusBadge(exam)}
                                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                    {getCategoryLabel(exam.exam_category)}
                                                </span>
                                            </div>
                                            <h4 className="text-base font-bold text-slate-900">{exam.title}</h4>
                                            <p className="text-sm text-slate-600 mt-1">{exam.subject.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-xs text-slate-600">
                                        <Clock className="w-4 h-4 mr-2" />
                                        Dimulai: {formatDate(exam.start_time)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Completed Exams */}
                {completedExams.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider flex items-center">
                            <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
                            Ujian Selesai
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {completedExams.map((exam) => (
                                <Link
                                    key={exam.id}
                                    href={route('student.exams.result', exam.latest_attempt.id)}
                                    className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-500 hover:shadow-md transition group"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                {getStatusBadge(exam)}
                                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                    {getCategoryLabel(exam.exam_category)}
                                                </span>
                                            </div>
                                            <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition">
                                                {exam.title}
                                            </h4>
                                            <p className="text-sm text-slate-600 mt-1">{exam.subject.name}</p>
                                        </div>
                                        <div className="text-right">
                                            {exam.best_score !== null && (
                                                <>
                                                    <p className="text-2xl font-bold text-emerald-600">{Math.round(Number(exam.best_score || 0))}</p>
                                                    <p className="text-xs text-slate-500">Nilai Terbaik</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {exams.length === 0 && (
                    <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Belum Ada Ujian</h3>
                        <p className="text-sm text-slate-500">
                            Saat ini belum ada ujian yang tersedia untuk Anda.
                        </p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
