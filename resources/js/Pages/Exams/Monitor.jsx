import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    ArrowLeft, 
    RefreshCw, 
    Users, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    Timer, 
    Award,
    Search,
    Eye
} from 'lucide-react';

export default function ExamsMonitor({ auth, exam, students = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Auto refresh every 20 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            handleRefresh();
        }, 20000);
        return () => clearInterval(interval);
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            only: ['students'],
            onFinish: () => setIsRefreshing(false)
        });
    };

    const notStarted = students.filter(s => s.status === 'not_started');
    const inProgress = students.filter(s => s.status === 'in_progress');
    const submittedOrGraded = students.filter(s => s.status === 'submitted' || s.status === 'graded');

    const filteredStudents = students.filter(s => {
        const matchesSearch = s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.nis?.includes(searchQuery);
        const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        if (status === 'in_progress') {
            return (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                    <Timer className="w-3 h-3 mr-1" />
                    Sedang Mengerjakan
                </span>
            );
        }
        if (status === 'submitted' || status === 'graded') {
            return (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {status === 'graded' ? 'Selesai & Dinilai' : 'Sudah Mengumpulkan'}
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                <AlertCircle className="w-3 h-3 mr-1" />
                Belum Memulai
            </span>
        );
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '-';
        return new Date(timeStr).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('exams.show', exam.id)}
                            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 leading-tight">
                                Pengawasan Sesi Ujian (Live Monitor)
                            </h2>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                                {exam.title} • {exam.class?.name || 'Semua Rombel'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="inline-flex items-center px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition shadow-sm"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin text-[#800020]' : ''}`} />
                            Segarkan Status
                        </button>

                        <Link
                            href={route('exams.results', exam.id)}
                            className="inline-flex items-center px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold transition shadow-sm"
                        >
                            <Award className="w-3.5 h-3.5 mr-1.5" />
                            Lihat Rekap Nilai
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Monitor - ${exam.title}`} />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Real-time metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Peserta Rombel</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{students.length}</p>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
                                <Users className="w-5 h-5 text-slate-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sedang Mengerjakan</p>
                                <p className="text-2xl font-bold text-amber-600 mt-1">{inProgress.length}</p>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
                                <Timer className="w-5 h-5 text-amber-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sudah Mengumpulkan</p>
                                <p className="text-2xl font-bold text-emerald-600 mt-1">{submittedOrGraded.length}</p>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Belum Memulai</p>
                                <p className="text-2xl font-bold text-slate-500 mt-1">{notStarted.length}</p>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-slate-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter and Table */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                        <div className="relative flex-1 max-w-md">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama atau NIS siswa..."
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
                                <option value="all">Semua Siswa</option>
                                <option value="in_progress">Sedang Mengerjakan</option>
                                <option value="submitted">Sudah Mengumpulkan</option>
                                <option value="graded">Sudah Dinilai</option>
                                <option value="not_started">Belum Mulai</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-y border-slate-200">
                                <tr>
                                    <th className="py-3.5 px-4">No</th>
                                    <th className="py-3.5 px-4">Nama Siswa</th>
                                    <th className="py-3.5 px-4">NIS</th>
                                    <th className="py-3.5 px-4">Status Ujian</th>
                                    <th className="py-3.5 px-4">Percobaan</th>
                                    <th className="py-3.5 px-4">Progres Soal</th>
                                    <th className="py-3.5 px-4">Waktu Mulai</th>
                                    <th className="py-3.5 px-4">Waktu Selesai</th>
                                    <th className="py-3.5 px-4 text-right">Skor Nilai</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((st, idx) => (
                                        <tr key={st.id} className="hover:bg-slate-50/70 transition">
                                            <td className="py-3.5 px-4 text-slate-400">{idx + 1}</td>
                                            <td className="py-3.5 px-4 font-bold text-slate-900">
                                                {st.full_name}
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-600 font-mono">
                                                {st.nis || '-'}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {getStatusBadge(st.status)}
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-700">
                                                {st.attempt_number ? `Ke-${st.attempt_number}` : '-'}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="font-semibold text-slate-800">{st.progress}</span>
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-600">
                                                {formatTime(st.started_at)}
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-600">
                                                {formatTime(st.submitted_at)}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                {st.score !== null && st.score !== undefined ? (
                                                    <span className="font-bold text-sm text-[#800020]">
                                                        {Math.round(Number(st.score))}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={9} className="py-8 text-center text-slate-500">
                                            Tidak ada data peserta ujian yang sesuai filter.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
