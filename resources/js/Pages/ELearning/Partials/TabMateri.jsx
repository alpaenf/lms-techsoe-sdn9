import React from 'react';
import { 
    BookOpen, 
    FileText, 
    Video, 
    Download, 
    ExternalLink, 
    Edit, 
    Trash2,
    Layers
} from 'lucide-react';

export default function TabMateri({ 
    materials = [], 
    isSiswa = false, 
    canManage = false, 
    onEdit, 
    onDelete 
}) {
    if (materials.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#800020] flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Belum Ada Modul Bahan Ajar</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    {isSiswa 
                        ? 'Belum ada bahan ajar yang dipublikasikan oleh guru untuk kriteria pencarian ini.' 
                        : 'Mulai publikasikan modul bacaan, dokumen PDF, atau link video pembelajaran untuk peserta didik.'}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {materials.map((m) => {
                const isPdf = m.type === 'file';
                const isVideo = m.type === 'video_link';

                return (
                    <div 
                        key={m.id} 
                        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#E8B4B8] transition flex flex-col justify-between group"
                    >
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className={`px-2.5 py-0.5 rounded-md font-semibold text-[10px] border ${
                                    isPdf 
                                        ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                        : isVideo 
                                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                }`}>
                                    {isPdf ? 'Dokumen / File' : isVideo ? 'Video Pembelajaran' : 'Artikel / Teks'}
                                </span>
                                <span className="text-[11px] text-slate-500 font-medium">
                                    {m.class_name} • {m.subject_name}
                                </span>
                            </div>

                            <h4 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-[#800020] transition">
                                {m.title}
                            </h4>

                            {m.body_text && (
                                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                                    {m.body_text}
                                </p>
                            )}
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                            <div>
                                {m.file_path ? (
                                    <a 
                                        href={`/storage/${m.file_path}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-[#800020] font-semibold hover:underline"
                                    >
                                        <Download className="w-3.5 h-3.5 mr-1" />
                                        <span>Unduh Berkas</span>
                                    </a>
                                ) : m.content_url ? (
                                    <a 
                                        href={m.content_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-[#800020] font-semibold hover:underline"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5 mr-1" />
                                        <span>Buka Tautan</span>
                                    </a>
                                ) : (
                                    <span className="text-slate-400 italic text-[11px]">Modul Teks</span>
                                )}
                            </div>

                            {canManage && (
                                <div className="flex items-center space-x-1">
                                    <button 
                                        onClick={() => onEdit(m)}
                                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition"
                                        title="Edit Bahan Ajar"
                                    >
                                        <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                        onClick={() => onDelete(m)}
                                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition"
                                        title="Hapus Bahan Ajar"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
