import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
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
    Shield,
    PlusCircle,
    Trash2,
    Check
} from 'lucide-react';
import ModalTahunAjaran from './Modals/ModalTahunAjaran';

export default function KelembagaanIndex({ schoolProfile, academicYears = [] }) {
    const { auth } = usePage().props;
    const isAdmin = auth?.user?.role === 'admin' || auth?.user?.role === 'pimpinan';
    const [activeTab, setActiveTab] = useState('profil');
    const [notification, setNotification] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isModalAYOpen, setIsModalAYOpen] = useState(false);

    // Profile Form State
    const [form, setForm] = useState({
        school_name: schoolProfile?.school_name || 'UPT SDN 9 Gandangbatu Sillanan',
        npsn: schoolProfile?.npsn || '40307044',
        principal_name: schoolProfile?.principal_name || 'Hendrika Genti, S.Pd.SD.',
        principal_nip: schoolProfile?.principal_nip || '198502012010012025',
        address: schoolProfile?.address || 'Gandangbatu, Kec. Gandangbatu Sillanan, Kab. Tana Toraja, Sulawesi Selatan 91871',
        district: schoolProfile?.district || 'Gandangbatu Sillanan',
        regency: schoolProfile?.regency || 'Tana Toraja',
        province: schoolProfile?.province || 'Sulawesi Selatan',
        phone: schoolProfile?.phone || '081234567890',
        email: schoolProfile?.email || 'info@sdn9gandangbatu.sch.id',
        website: schoolProfile?.website || 'https://sdn9gandangbatu.sch.id',
    });

    const handleChange = (field, val) => {
        setForm(prev => ({ ...prev, [field]: val }));
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);

        router.post(route('kelembagaan.profile.update'), form, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSaving(false);
                setNotification('Data pokok identitas sekolah berhasil diperbarui.');
                setTimeout(() => setNotification(null), 4000);
            },
            onError: () => {
                setIsSaving(false);
            }
        });
    };

    const handleActivateAY = (id) => {
        router.post(route('kelembagaan.academic-years.activate', id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setNotification('Status tahun ajaran aktif berhasil diperbarui.');
                setTimeout(() => setNotification(null), 4000);
            }
        });
    };

    const handleDeleteAY = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data tahun ajaran ini?')) {
            router.delete(route('kelembagaan.academic-years.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    setNotification('Data tahun ajaran berhasil dihapus.');
                    setTimeout(() => setNotification(null), 4000);
                }
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">
                            Modul Kelembagaan
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Profil Satuan Pendidikan & Konfigurasi Kalender Akademik UPT SDN 9 Gandangbatu Sillanan
                        </p>
                    </div>

                    <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                        <button
                            onClick={() => setActiveTab('profil')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                                activeTab === 'profil'
                                    ? 'bg-[#800020] text-white shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Identitas Sekolah
                        </button>
                        <button
                            onClick={() => setActiveTab('akademik')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                                activeTab === 'akademik'
                                    ? 'bg-[#800020] text-white shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Tahun Ajaran ({academicYears.length})
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Kelembagaan - Smart School LMS" />

            <div className="space-y-6 max-w-6xl mx-auto">
                {/* Notification toast */}
                {notification && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center space-x-3 shadow-sm animate-fade-in">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="text-xs font-semibold">{notification}</span>
                    </div>
                )}

                {activeTab === 'profil' ? (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2.5 rounded-xl bg-[#FDF2F4] text-[#800020] border border-[#E8B4B8]">
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
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                                Data Terverifikasi Dapodik
                            </span>
                        </div>

                        <form onSubmit={handleProfileSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Nama Resmi Sekolah
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        disabled={!isAdmin}
                                        value={form.school_name}
                                        onChange={(e) => handleChange('school_name', e.target.value)}
                                        className={`w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:border-[#800020] focus:ring-[#800020] ${!isAdmin ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        NPSN (Nomor Pokok Sekolah Nasional)
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        disabled={!isAdmin}
                                        value={form.npsn}
                                        onChange={(e) => handleChange('npsn', e.target.value)}
                                        className={`w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 font-mono font-bold focus:border-[#800020] focus:ring-[#800020] ${!isAdmin ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Nama Kepala Sekolah
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        disabled={!isAdmin}
                                        value={form.principal_name}
                                        onChange={(e) => handleChange('principal_name', e.target.value)}
                                        className={`w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:border-[#800020] focus:ring-[#800020] ${!isAdmin ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        NIP Kepala Sekolah
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        disabled={!isAdmin}
                                        value={form.principal_nip}
                                        onChange={(e) => handleChange('principal_nip', e.target.value)}
                                        className={`w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 font-mono font-bold focus:border-[#800020] focus:ring-[#800020] ${!isAdmin ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Alamat Lengkap Satuan Pendidikan
                                    </label>
                                    <textarea
                                        rows={3}
                                        required
                                        disabled={!isAdmin}
                                        value={form.address}
                                        onChange={(e) => handleChange('address', e.target.value)}
                                        className={`w-full p-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-[#800020] focus:ring-[#800020] ${!isAdmin ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Kecamatan & Kabupaten
                                    </label>
                                    <input
                                        type="text"
                                        disabled={!isAdmin}
                                        value={`${form.district}, ${form.regency}`}
                                        onChange={(e) => handleChange('district', e.target.value)}
                                        className={`w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-[#800020] focus:ring-[#800020] ${!isAdmin ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Provinsi
                                    </label>
                                    <input
                                        type="text"
                                        disabled={!isAdmin}
                                        value={form.province}
                                        onChange={(e) => handleChange('province', e.target.value)}
                                        className={`w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-[#800020] focus:ring-[#800020] ${!isAdmin ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Telepon Kantor / Kontak
                                    </label>
                                    <input
                                        type="text"
                                        disabled={!isAdmin}
                                        value={form.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        className={`w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-[#800020] focus:ring-[#800020] ${!isAdmin ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Alamat Email Resmi
                                    </label>
                                    <input
                                        type="email"
                                        disabled={!isAdmin}
                                        value={form.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        className={`w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-[#800020] focus:ring-[#800020] ${!isAdmin ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                                {!isAdmin ? (
                                    <div className="flex items-center text-xs text-slate-500 font-medium space-x-2">
                                        <Shield className="w-4 h-4 text-slate-400" />
                                        <span>Mode Tinjau Eksekutif: Hanya Administrator yang berwenang mengubah profil pokok sekolah.</span>
                                    </div>
                                ) : (
                                    <div className="text-xs text-slate-500 font-medium">
                                        Pastikan data NPSN dan NIP Kepala Sekolah sesuai referensi Dapodik.
                                    </div>
                                )}

                                {isAdmin && (
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="inline-flex items-center px-6 py-2.5 bg-[#800020] hover:bg-[#5C0017] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                ) : (
                    /* Tab Tahun Ajaran */
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
                        <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center space-x-3">
                                <div className="p-2.5 rounded-xl bg-[#FDF2F4] text-[#800020] border border-[#E8B4B8]">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        Konfigurasi Tahun Ajaran & Semester
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Atur periode akademik yang aktif pada sistem LMS
                                    </p>
                                </div>
                            </div>

                            {isAdmin && (
                                <button
                                    onClick={() => setIsModalAYOpen(true)}
                                    className="px-4 py-2 bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold rounded-xl shadow-md transition inline-flex items-center space-x-1.5"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    <span>Tambah Tahun Ajaran</span>
                                </button>
                            )}
                        </div>

                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-[#F8F9FA] text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold">
                                        <tr>
                                            <th className="px-4 py-3.5">Tahun Ajaran</th>
                                            <th className="px-4 py-3.5 text-center">Semester</th>
                                            <th className="px-4 py-3.5 text-center">Tanggal Mulai</th>
                                            <th className="px-4 py-3.5 text-center">Tanggal Selesai</th>
                                            <th className="px-4 py-3.5 text-center">Status</th>
                                            {isAdmin && <th className="px-4 py-3.5 text-center">Aksi</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {academicYears && academicYears.length > 0 ? (
                                            academicYears.map((ay) => (
                                                <tr key={ay.id} className="hover:bg-[#FDF2F4]/40 transition">
                                                    <td className="px-4 py-3.5 font-bold text-slate-900 font-mono text-sm">{ay.name}</td>
                                                    <td className="px-4 py-3.5 text-center capitalize font-semibold text-slate-700">{ay.semester}</td>
                                                    <td className="px-4 py-3.5 text-center text-slate-600 font-mono">{ay.start_date}</td>
                                                    <td className="px-4 py-3.5 text-center text-slate-600 font-mono">{ay.end_date}</td>
                                                    <td className="px-4 py-3.5 text-center">
                                                        {ay.is_active ? (
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 gap-1.5">
                                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                                Aktif Berjalan
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100/80 text-slate-500 border border-slate-200/60">
                                                                Arsip
                                                            </span>
                                                        )}
                                                    </td>
                                                    {isAdmin && (
                                                        <td className="px-4 py-3.5 text-center">
                                                            <div className="inline-flex items-center space-x-1.5">
                                                                {!ay.is_active && (
                                                                    <>
                                                                        <button
                                                                            onClick={() => handleActivateAY(ay.id)}
                                                                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-sm transition inline-flex items-center space-x-1"
                                                                        >
                                                                            <Check className="w-3 h-3" />
                                                                            <span>Aktifkan</span>
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteAY(ay.id)}
                                                                            className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition"
                                                                            title="Hapus"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="text-center py-6 text-slate-400">
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

            {/* Modal Tambah Tahun Ajaran */}
            <ModalTahunAjaran 
                isOpen={isModalAYOpen}
                onClose={() => setIsModalAYOpen(false)}
            />
        </AuthenticatedLayout>
    );
}
