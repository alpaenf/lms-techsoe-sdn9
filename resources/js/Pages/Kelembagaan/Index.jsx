import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { 
    Landmark, 
    Calendar, 
    Save, 
    CheckCircle2, 
    Building, 
    Phone, 
    Mail, 
    Globe, 
    MapPin, 
    UserCheck,
    Clock,
    Shield
} from 'lucide-react';

export default function KelembagaanIndex({ schoolProfile, academicYears }) {
    const { auth } = usePage().props;
    const isAdmin = auth?.user?.role === 'admin';
    const [activeTab, setActiveTab] = useState('profil');

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">
                            Modul Kelembagaan
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Profil Satuan Pendidikan & Konfigurasi Kalender Akademik
                        </p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setActiveTab('profil')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                                activeTab === 'profil'
                                    ? 'bg-[#800020] text-white shadow-sm'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            Identitas Sekolah
                        </button>
                        <button
                            onClick={() => setActiveTab('akademik')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                                activeTab === 'akademik'
                                    ? 'bg-[#800020] text-white shadow-sm'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            Tahun Ajaran
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Kelembagaan - Smart School LMS" />

            <div className="space-y-6 max-w-6xl mx-auto">
                {activeTab === 'profil' ? (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-xl bg-[#FDF2F4] text-[#800020]">
                                    <Landmark className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        Data Pokok Satuan Pendidikan
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Identitas resmi UPT SDN 9 Gandangbatu Sillanan
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Data Terverifikasi
                            </span>
                        </div>

                        <form className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Nama Resmi Sekolah
                                    </label>
                                    <input
                                        type="text"
                                        disabled={!isAdmin}
                                        defaultValue={schoolProfile?.school_name || 'UPT SDN 9 Gandangbatu Sillanan'}
                                        className={`w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-[#800020] focus:ring-[#800020] ${!isAdmin ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        NPSN (Nomor Pokok Sekolah Nasional)
                                    </label>
                                    <input
                                        type="text"
                                        disabled={!isAdmin}
                                        defaultValue={schoolProfile?.npsn || '40307044'}
                                        className={`w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 font-mono focus:border-[#800020] focus:ring-[#800020] ${!isAdmin ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Nama Kepala Sekolah
                                    </label>
                                    <input
                                        type="text"
                                        disabled={!isAdmin}
                                        defaultValue={schoolProfile?.principal_name || 'Hendrika Genti, S.Pd.SD.'}
                                        className={`w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-[#800020] focus:ring-[#800020] ${!isAdmin ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        NIP Kepala Sekolah
                                    </label>
                                    <input
                                        type="text"
                                        disabled={!isAdmin}
                                        defaultValue={schoolProfile?.principal_nip || '198502012010012025'}
                                        className={`w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 font-mono focus:border-[#800020] focus:ring-[#800020] ${!isAdmin ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Alamat Lengkap Satuan Pendidikan
                                    </label>
                                    <textarea
                                        rows={3}
                                        disabled={!isAdmin}
                                        defaultValue={schoolProfile?.address || 'Gandangbatu, Kec. Gandangbatu Sillanan, Kab. Tana Toraja, Sulawesi Selatan 91871'}
                                        className={`w-full p-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-[#800020] focus:ring-[#800020] ${!isAdmin ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Telepon Kantor / Kontak
                                    </label>
                                    <input
                                        type="text"
                                        disabled={!isAdmin}
                                        defaultValue={schoolProfile?.phone || '081234567890'}
                                        className={`w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-[#800020] focus:ring-[#800020] ${!isAdmin ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Alamat Email Resmi
                                    </label>
                                    <input
                                        type="email"
                                        disabled={!isAdmin}
                                        defaultValue={schoolProfile?.email || 'info@sdn9gandangbatu.sch.id'}
                                        className={`w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-[#800020] focus:ring-[#800020] ${!isAdmin ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                                {!isAdmin ? (
                                    <div className="flex items-center text-xs text-slate-500 font-medium space-x-2">
                                        <Shield className="w-4 h-4 text-slate-400" />
                                        <span>Mode Tinjau Eksekutif: Hanya Administrator Sistem yang berwenang mengubah profil pokok sekolah.</span>
                                    </div>
                                ) : (
                                    <div className="text-xs text-slate-500">
                                        Pastikan data NPSN dan NIP Kepala Sekolah sesuai referensi Dapodik.
                                    </div>
                                )}

                                {isAdmin && (
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-5 py-2.5 bg-[#800020] hover:bg-[#5C0017] text-white text-sm font-semibold rounded-xl shadow-sm transition"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        <span>Simpan Perubahan</span>
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                ) : (
                    /* Tab Tahun Ajaran */
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
                        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-xl bg-[#FDF2F4] text-[#800020]">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        Konfigurasi Tahun Ajaran & Semester
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Atur periode akademik yang aktif pada sistem
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-[#F8F9FA] text-slate-600 border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold">Tahun Ajaran</th>
                                            <th className="px-4 py-3 font-semibold">Semester</th>
                                            <th className="px-4 py-3 font-semibold">Mulai</th>
                                            <th className="px-4 py-3 font-semibold">Selesai</th>
                                            <th className="px-4 py-3 font-semibold text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {academicYears && academicYears.length > 0 ? (
                                            academicYears.map((ay) => (
                                                <tr key={ay.id} className="hover:bg-[#FDF2F4]/50 transition">
                                                    <td className="px-4 py-3 font-bold text-slate-900">{ay.name}</td>
                                                    <td className="px-4 py-3 capitalize">{ay.semester}</td>
                                                    <td className="px-4 py-3 text-slate-600">{ay.start_date}</td>
                                                    <td className="px-4 py-3 text-slate-600">{ay.end_date}</td>
                                                    <td className="px-4 py-3 text-center">
                                                        {ay.is_active ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                                                Aktif Berjalan
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
                                                                Arsip
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="text-center py-6 text-slate-400">
                                                    Belum ada data tahun ajaran.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
