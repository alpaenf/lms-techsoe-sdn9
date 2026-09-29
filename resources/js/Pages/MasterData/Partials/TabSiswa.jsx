import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';

export default function TabSiswa({
    students,
    canManageMaster,
    onViewDetail,
    onEdit,
    onDelete
}) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8F9FA] text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold">
                        <tr>
                            <th className="px-4 py-3.5">NISN / NIS</th>
                            <th className="px-4 py-3.5">Nama Lengkap</th>
                            <th className="px-4 py-3.5">Kelas</th>
                            <th className="px-4 py-3.5">Jenis Kelamin</th>
                            <th className="px-4 py-3.5">Nama Wali Murid</th>
                            <th className="px-4 py-3.5">Kontak Wali</th>
                            <th className="px-4 py-3.5 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {students && students.length > 0 ? (
                            students.map((s) => (
                                <tr key={s.id} className="hover:bg-[#FDF2F4]/50 transition">
                                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900">{s.nisn}</td>
                                    <td className="px-4 py-3.5 font-semibold text-slate-900">{s.full_name}</td>
                                    <td className="px-4 py-3.5">
                                        <span className="px-2.5 py-1 rounded-md bg-slate-100/80 text-slate-700 font-semibold text-[11px] border border-slate-200/50">
                                            {s.class_name || 'Belum ada kelas'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5">{s.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                                    <td className="px-4 py-3.5 text-slate-700">{s.guardian_name || '-'}</td>
                                    <td className="px-4 py-3.5 font-mono text-slate-500">{s.guardian_phone || '-'}</td>
                                    <td className="px-4 py-3.5 text-right space-x-1">
                                        <button 
                                            onClick={() => onViewDetail(s)}
                                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                                            title="Lihat Detail Siswa"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        {canManageMaster && (
                                            <>
                                                <button 
                                                    onClick={() => onEdit(s)}
                                                    className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition"
                                                    title="Edit Siswa"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => onDelete(s)}
                                                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                                                    title="Hapus Siswa"
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
                                    Tidak ada data siswa ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
