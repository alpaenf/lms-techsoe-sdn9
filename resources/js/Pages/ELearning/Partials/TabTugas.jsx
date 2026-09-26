import React from 'react';
import { 
    FileText, 
    Calendar, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    Send, 
    Edit, 
    Trash2, 
    Eye, 
    Download,
    Award
} from 'lucide-react';

export default function TabTugas({ 
    assignments = [], 
    isSiswa = false, 
    canManage = false, 
    onSubmitAssignment, 
    onOpenSubmissions, 
    onEdit, 
    onDelete 
}) {
    if (assignments.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#800020] flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Belum Ada Penugasan Digital</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    {isSiswa 
                        ? 'Tidak ada tugas atau asesmen yang aktif untuk kelas dan mata pelajaran ini saat ini.' 
                        : 'Buat penugasan digital baru dengan instruksi, tenggat waktu, dan lampiran soal.'}
                </p>
            </div>
        );
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8F9FA] text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold">
                        <tr>
                            <th className="px-5 py-4">Judul Penugasan</th>
                            <th className="px-4 py-4">Mata Pelajaran & Kelas</th>
                            <th className="px-4 py-4">Deadline (Batas Pengumpulan)</th>
                            <th className="px-4 py-4 text-center">{isSiswa ? 'Status Saya' : 'Status Pengumpulan'}</th>
                            <th className="px-5 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {assignments.map((asg) => {
                            const isOverdue = new Date(asg.due_date) < new Date();
                            const sub = asg.my_submission;
                            const isGraded = sub && sub.score !== null;

                            return (
                                <tr key={asg.id} className="hover:bg-[#FDF2F4]/40 transition">
                                    <td className="px-5 py-4">
                                        <div className="space-y-1">
                                            <div className="font-bold text-slate-900 leading-snug">
                                                {asg.title}
                                            </div>
                                            <div className="text-slate-500 line-clamp-1 max-w-md text-[11px]">
                                                {asg.instructions}
                                            </div>
                                            {asg.attachment_path && (
                                                <a 
                                                    href={`/storage/${asg.attachment_path}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-[11px] font-semibold text-[#800020] hover:underline pt-0.5"
                                                >
                                                    <Download className="w-3 h-3 mr-1" />
                                                    <span>Unduh Lampiran Soal</span>
                                                </a>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-4 py-4">
                                        <div className="font-semibold text-slate-800">{asg.subject_name}</div>
                                        <div className="text-slate-500 text-[11px]">{asg.class_name}</div>
                                    </td>

                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className={`font-mono text-[11px] font-semibold flex items-center ${isOverdue ? 'text-rose-600' : 'text-slate-700'}`}>
                                            <Clock className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                                            <span>{formatDate(asg.due_date)}</span>
                                        </div>
                                        {isOverdue && (
                                            <span className="text-[10px] text-rose-500 font-semibold block mt-0.5">Telah Melewati Deadline</span>
                                        )}
                                    </td>

                                    <td className="px-4 py-4 text-center whitespace-nowrap">
                                        {isSiswa ? (
                                            sub ? (
                                                isGraded ? (
                                                    <div className="inline-flex flex-col items-center">
                                                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px] inline-flex items-center">
                                                            <Award className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                                                            <span>Nilai: {sub.score} / {asg.max_score}</span>
                                                        </span>
                                                        {sub.teacher_feedback && (
                                                            <span className="text-[10px] text-slate-500 mt-1 max-w-[150px] truncate" title={sub.teacher_feedback}>
                                                                Catatan: {sub.teacher_feedback}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-[11px] inline-flex items-center">
                                                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-blue-600" />
                                                        <span>Dikumpulkan</span>
                                                    </span>
                                                )
                                            ) : (
                                                <span className={`px-3 py-1 rounded-full border font-semibold text-[11px] inline-flex items-center ${
                                                    isOverdue ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}>
                                                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                                                    <span>Belum Dikumpulkan</span>
                                                </span>
                                            )
                                        ) : (
                                            <button 
                                                onClick={() => onOpenSubmissions(asg)}
                                                className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 font-semibold text-[11px] inline-flex items-center transition"
                                            >
                                                <Eye className="w-3.5 h-3.5 mr-1 text-slate-600" />
                                                <span>{asg.submissions_count} / {asg.total_students} Mengumpulkan</span>
                                            </button>
                                        )}
                                    </td>

                                    <td className="px-5 py-4 text-right whitespace-nowrap">
                                        {isSiswa ? (
                                            <button 
                                                onClick={() => onSubmitAssignment(asg)}
                                                className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs inline-flex items-center shadow-sm transition ${
                                                    sub 
                                                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200' 
                                                        : 'bg-[#800020] hover:bg-[#5C0017] text-white'
                                                }`}
                                            >
                                                <Send className="w-3.5 h-3.5 mr-1.5" />
                                                <span>{sub ? 'Edit Jawaban' : 'Kumpulkan Tugas'}</span>
                                            </button>
                                        ) : (
                                            <div className="flex items-center justify-end space-x-1.5">
                                                <button 
                                                    onClick={() => onOpenSubmissions(asg)}
                                                    className="px-3 py-1.5 bg-[#800020] text-white hover:bg-[#5C0017] rounded-xl font-semibold text-xs inline-flex items-center transition shadow-sm"
                                                >
                                                    <Eye className="w-3.5 h-3.5 mr-1" />
                                                    <span>Periksa & Nilai</span>
                                                </button>

                                                {canManage && (
                                                    <>
                                                        <button 
                                                            onClick={() => onEdit(asg)}
                                                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition"
                                                            title="Edit Tugas"
                                                        >
                                                            <Edit className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button 
                                                            onClick={() => onDelete(asg)}
                                                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition"
                                                            title="Hapus Tugas"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
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
}
