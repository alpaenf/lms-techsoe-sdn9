import React from 'react';
import { School, Edit, Trash2 } from 'lucide-react';

export default function TabRombel({
    classes,
    canManageMaster,
    onEdit,
    onDelete
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
            {classes && classes.map((c) => (
                <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#E8B4B8] transition flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center space-x-2.5">
                                <div className="p-2 rounded-xl bg-[#FDF2F4] text-[#800020]">
                                    <School className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-slate-900">{c.name}</h4>
                                    <span className="text-[11px] text-slate-400 font-medium">Tingkat Kelas {c.grade_level}</span>
                                </div>
                            </div>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Aktif
                            </span>
                        </div>
                        <div className="pt-3 space-y-1.5 text-xs">
                            <div className="flex justify-between text-slate-500">
                                <span>Wali Kelas:</span>
                                <span className="font-semibold text-slate-800">
                                    {c.homeroom_teacher_name || 'Belum Ditugaskan'}
                                </span>
                            </div>
                            <div className="flex justify-between text-slate-500">
                                <span>ID Referensi:</span>
                                <span className="font-mono text-slate-700">Rombel #{c.id}</span>
                            </div>
                        </div>
                    </div>

                    {canManageMaster && (
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => onEdit(c)}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition inline-flex items-center space-x-1"
                            >
                                <Edit className="w-3.5 h-3.5 text-slate-500" />
                                <span>Edit Rombel</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => onDelete(c)}
                                className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition"
                                title="Hapus Rombel"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
