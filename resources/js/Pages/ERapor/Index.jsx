import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { 
    Files, 
    FileText, 
    Printer, 
    Download, 
    CheckCircle2, 
    AlertCircle, 
    Award,
    School,
    ChevronDown,
    Check
} from 'lucide-react';

export default function ERaporIndex({ classes, selectedClassId, subjects, students }) {
    const { auth } = usePage().props;
    const userRole = auth?.user?.role || 'siswa';
    const isSiswa = userRole === 'siswa';
    const isPimpinan = userRole === 'pimpinan';

    const [selectedTab, setSelectedTab] = useState(isSiswa ? 'cetak' : 'leger');

    const handleClassChange = (e) => {
        router.get(route('erapor.index'), {
            class_id: e.target.value
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">
                            {isSiswa ? 'Lembar Rapor Digital Siswa' : 'Modul E-Raport Kurikulum Merdeka'}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {isSiswa ? 'Laporan Capaian Hasil Belajar Peserta Didik' : 'Pengolahan Nilai Akhir Semester, Leger, dan Penerbitan Lembar Rapor Resmi'}
                        </p>
                    </div>

                    {!isSiswa && (
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setSelectedTab('leger')}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                                    selectedTab === 'leger'
                                        ? 'bg-[#800020] text-white shadow-sm'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                Leger Capaian Nilai
                            </button>
                            <button
                                onClick={() => setSelectedTab('cetak')}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                                    selectedTab === 'cetak'
                                        ? 'bg-[#800020] text-white shadow-sm'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                Cetak & Pengesahan
                            </button>
                        </div>
                    )}
                </div>
            }
        >
            <Head title={`${isSiswa ? 'Rapor Saya' : 'E-Raport'} - Smart School LMS`} />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Class Filter & Print Actions */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                        {!isSiswa ? (
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                                    Rombongan Belajar
                                </label>
                                <div className="relative inline-block">
                                    <select
                                        value={selectedClassId}
                                        onChange={handleClassChange}
                                        className="h-10 pl-3.5 pr-9 min-w-[170px] bg-white rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:border-[#800020] focus:ring-[#800020] appearance-none cursor-pointer shadow-sm"
                                    >
                                        {classes && classes.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <span className="px-3 py-1.5 rounded-xl bg-[#FDF2F4] text-[#800020] font-bold text-xs border border-[#E8B4B8]">
                                    Peserta Didik: Kelas 6
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
                        {!isSiswa && (
                            <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl inline-flex items-center shadow-sm transition">
                                <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                                <span>Ekspor Leger Excel</span>
                            </button>
                        )}
                        {isPimpinan && (
                            <button 
                                onClick={() => alert('Seluruh rapor rombel berhasil diverifikasi dan disahkan secara digital oleh Kepala Sekolah.')}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl inline-flex items-center shadow-sm transition"
                            >
                                <Check className="w-3.5 h-3.5 mr-1.5" />
                                <span>Sahkan Rapor Rombel</span>
                            </button>
                        )}
                        <button className="px-4 py-2 bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-semibold rounded-xl inline-flex items-center shadow-sm transition">
                            <Printer className="w-3.5 h-3.5 mr-1.5" />
                            <span>{isSiswa ? 'Unduh Rapor Saya PDF' : 'Cetak Rapor Rombel PDF'}</span>
                        </button>
                    </div>
                </div>

                {/* Formula Callout Banner */}
                <div className="bg-[#FDF2F4] border border-[#E8B4B8] p-4 rounded-2xl flex items-center justify-between text-xs text-[#800020]">
                    <div className="flex items-center space-x-2.5">
                        <CheckCircle2 className="w-5 h-5 shrink-0 text-[#800020]" />
                        <span>
                            <strong>Formula Nilai Akhir (NA):</strong> (Rata-rata Tugas × 30%) + (Nilai UTS × 30%) + (Nilai UAS × 40%). Predikat A (&ge;89), B (78-88), C (65-77), D (&lt;65).
                        </span>
                    </div>
                    <span className="font-mono font-bold hidden md:block">
                        SK Kurikulum 2026
                    </span>
                </div>

                {/* TAB 1: LEGER NILAI */}
                {selectedTab === 'leger' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-[#F8F9FA] text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="px-4 py-3.5 w-12 text-center">No</th>
                                        <th className="px-4 py-3.5">NISN / NIS</th>
                                        <th className="px-4 py-3.5">Nama Peserta Didik</th>
                                        <th className="px-4 py-3.5 text-center">Bhs. Indo</th>
                                        <th className="px-4 py-3.5 text-center">Matematika</th>
                                        <th className="px-4 py-3.5 text-center">IPA</th>
                                        <th className="px-4 py-3.5 text-center">Rerata Akhir</th>
                                        <th className="px-4 py-3.5 text-center">Predikat</th>
                                        <th className="px-4 py-3.5 text-center">Status Rapor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {students && students.map((s, index) => (
                                        <tr key={s.id} className="hover:bg-[#FDF2F4]/50 transition">
                                            <td className="px-4 py-3.5 text-center font-bold text-slate-500">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-3.5 font-mono text-slate-700">
                                                {s.nisn}
                                            </td>
                                            <td className="px-4 py-3.5 font-bold text-slate-900">
                                                {s.full_name}
                                            </td>
                                            <td className="px-4 py-3.5 text-center font-mono font-semibold text-slate-800">
                                                88.00
                                            </td>
                                            <td className="px-4 py-3.5 text-center font-mono font-semibold text-slate-800">
                                                85.50
                                            </td>
                                            <td className="px-4 py-3.5 text-center font-mono font-semibold text-slate-800">
                                                90.00
                                            </td>
                                            <td className="px-4 py-3.5 text-center font-mono font-bold text-[#800020]">
                                                87.83
                                            </td>
                                            <td className="px-4 py-3.5 text-center">
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                                                    B (Baik)
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-center">
                                                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold">
                                                    Terverifikasi
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 2: CETAK RAPOR */}
                {selectedTab === 'cetak' && (
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-slate-900">
                                Status Lembar E-Raport Siap Cetak
                            </h3>
                            <span className="text-xs text-slate-500 font-medium">
                                Pengesahan Kepala Sekolah: <span className="font-bold text-slate-900">Hendrika Genti, S.Pd.SD.</span>
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            {students && students.map((s) => (
                                <div key={s.id} className="p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-[#FDF2F4]/30 transition">
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-900">{s.full_name}</h4>
                                        <p className="text-[11px] text-slate-500 font-mono">NISN: {s.nisn}</p>
                                    </div>
                                    <button className="px-3 py-1.5 bg-[#800020] text-white hover:bg-[#5C0017] rounded-lg text-xs font-semibold inline-flex items-center transition">
                                        <Printer className="w-3.5 h-3.5 mr-1" />
                                        <span>Cetak PDF</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
