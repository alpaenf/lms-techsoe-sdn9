import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

export default function TabMapel({
    subjects,
    canManageMaster,
    onEdit,
    onDelete
}) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8F9FA] text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold">
                        <tr>
                            <th className="px-4 py-3.5">Kode Mapel</th>
                            <th className="px-4 py-3.5">Nama Mata Pelajaran</th>
                            <th className="px-4 py-3.5">Kategori</th>
                            <th className="px-4 py-3.5 text-center">Standar KKM</th>
                            <th className="px-4 py-3.5 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {subjects && subjects.map((sub) => (
                            <tr key={sub.id} className="hover:bg-[#FDF2F4]/50 transition">
                                <td className="px-4 py-3.5 font-mono font-bold text-slate-900">{sub.code}</td>
                                <td className="px-4 py-3.5 font-semibold text-slate-900">{sub.name}</td>
                                <td className="px-4 py-3.5 capitalize">
                                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                        {sub.category.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-4 py-3.5 text-center font-bold text-[#800020]">
                                    {parseFloat(sub.kkm).toFixed(2)}
                                </td>
                                <td className="px-4 py-3.5 text-right space-x-1">
                                    {canManageMaster && (
                                        <>
                                            <button 
                                                onClick={() => onEdit(sub)}
                                                className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition"
                                                title="Edit Mapel"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => onDelete(sub)}
                                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                                                title="Hapus Mapel"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
