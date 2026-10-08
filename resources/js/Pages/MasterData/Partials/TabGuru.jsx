import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

export default function TabGuru({
    teachers,
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
                            <th className="px-4 py-3.5">NIP</th>
                            <th className="px-4 py-3.5">Nama Lengkap & Gelar</th>
                            <th className="px-4 py-3.5">Gender</th>
                            <th className="px-4 py-3.5">Status Kepegawaian</th>
                            <th className="px-4 py-3.5">Pendidikan</th>
                            <th className="px-4 py-3.5">Email Akun</th>
                            <th className="px-4 py-3.5 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {teachers && teachers.length > 0 ? (
                            teachers.map((t) => (
                                <tr key={t.id} className="hover:bg-[#FDF2F4]/50 transition">
                                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900">{t.nip || '-'}</td>
                                    <td className="px-4 py-3.5 font-semibold text-slate-900">
                                        <div className="flex items-center space-x-3">
                                            {t.photo ? (
                                                <img src={t.photo} alt={t.full_name} className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-[#800020]/10 text-[#800020] flex items-center justify-center font-bold text-xs shrink-0">
                                                    {t.full_name?.charAt(0) || 'G'}
                                                </div>
                                            )}
                                            <span>{t.full_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5">{t.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                                    <td className="px-4 py-3.5">
                                        <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-700 border border-blue-500/20 font-semibold text-[11px]">
                                            {t.employment_status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-600">{t.education_level}</td>
                                    <td className="px-4 py-3.5 font-mono text-slate-500">{t.email || '-'}</td>
                                    <td className="px-4 py-3.5 text-right space-x-1">
                                        {canManageMaster && (
                                            <>
                                                <button 
                                                    onClick={() => onEdit(t)}
                                                    className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition"
                                                    title="Edit Pendidik"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => onDelete(t)}
                                                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                                                    title="Hapus Pendidik"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                                    Tidak ada data tenaga pendidik ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
