import React, { useState } from 'react';
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight, Phone, UserCheck } from 'lucide-react';

export default function TabSiswa({
    students = [],
    canManageMaster,
    onViewDetail,
    onEdit,
    onDelete
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(25);

    const totalStudents = students.length;
    const totalPages = Math.ceil(totalStudents / perPage) || 1;
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, totalStudents);
    const currentStudents = students.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in flex flex-col">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8F9FA] text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold">
                        <tr>
                            <th className="px-4 py-3.5 w-12 text-center">No</th>
                            <th className="px-4 py-3.5">NISN / NIPD</th>
                            <th className="px-4 py-3.5">Nama Lengkap</th>
                            <th className="px-4 py-3.5">Rombel</th>
                            <th className="px-4 py-3.5">JK</th>
                            <th className="px-4 py-3.5">Orang Tua / Wali</th>
                            <th className="px-4 py-3.5">Kontak</th>
                            <th className="px-4 py-3.5 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {currentStudents && currentStudents.length > 0 ? (
                            currentStudents.map((s, idx) => (
                                <tr key={s.id} className="hover:bg-[#FDF2F4]/50 transition">
                                    <td className="px-4 py-3.5 text-center text-slate-400 font-mono">
                                        {startIndex + idx + 1}
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <div className="font-mono font-bold text-slate-900 text-xs">
                                            {s.nisn}
                                        </div>
                                        <div className="text-[11px] font-mono text-slate-400">
                                            NIPD: {s.nis || '-'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <div className="font-semibold text-slate-900 text-xs">
                                            {s.full_name}
                                        </div>
                                        {s.nik && (
                                            <div className="text-[10px] text-slate-400 font-mono">
                                                NIK: {s.nik}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className="px-2.5 py-1 rounded-md bg-[#800020]/10 text-[#800020] font-bold text-[11px] border border-[#800020]/20">
                                            {s.class_name || 'Belum ada'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                            s.gender === 'L' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'
                                        }`}>
                                            {s.gender === 'L' ? 'L' : 'P'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-700">
                                        <div className="font-medium text-slate-900">
                                            {s.guardian_name || '-'}
                                        </div>
                                        {s.guardian_relation && s.guardian_relation !== '-' && (
                                            <span className="text-[10px] text-slate-400 capitalize">
                                                ({s.guardian_relation})
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3.5 font-mono text-slate-600">
                                        {s.guardian_phone && s.guardian_phone !== '-' ? (
                                            <span className="text-emerald-700 font-medium">
                                                {s.guardian_phone}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3.5 text-right space-x-1 whitespace-nowrap">
                                        <button
                                            onClick={() => onViewDetail(s)}
                                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                                            title="Lihat Detail Lengkap Dapodik"
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
                                <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                                    Tidak ada data siswa ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalStudents > 0 && (
                <div className="px-4 py-3 bg-[#F8F9FA] border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
                    <div className="flex items-center space-x-2">
                        <span>Menampilkan</span>
                        <select
                            value={perPage}
                            onChange={(e) => {
                                setPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="h-8 px-2 rounded-lg border border-slate-300 text-xs bg-white focus:border-[#800020] focus:ring-[#800020]"
                        >
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={totalStudents}>Semua ({totalStudents})</option>
                        </select>
                        <span>dari <strong>{totalStudents}</strong> siswa</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            title="Halaman Sebelumnya"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-1 font-semibold text-slate-800">
                            Halaman {currentPage} dari {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            title="Halaman Berikutnya"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
