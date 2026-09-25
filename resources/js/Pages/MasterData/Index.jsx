import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { 
    Database, 
    Users, 
    GraduationCap, 
    School, 
    BookOpen, 
    Search, 
    PlusCircle, 
    Download, 
    Eye, 
    Edit, 
    Trash2,
    ChevronDown,
    X,
    Save,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

export default function MasterDataIndex({ currentTab = 'siswa', teachers = [], classes = [], subjects = [], students, errors = {} }) {
    const { auth } = usePage().props;
    const userRole = auth?.user?.role || 'siswa';
    const canManageMaster = userRole === 'admin' || userRole === 'pimpinan';

    const [tab, setTab] = useState(canManageMaster ? currentTab : 'siswa');
    const [search, setSearch] = useState('');
    const [notification, setNotification] = useState(null);

    // Modal state for Rombel
    const [isRombelModalOpen, setIsRombelModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState(null);
    const [rombelForm, setRombelForm] = useState({
        name: '',
        grade_level: 1,
        homeroom_teacher_id: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const openCreateRombelModal = () => {
        setEditingClass(null);
        setRombelForm({
            name: '',
            grade_level: 1,
            homeroom_teacher_id: ''
        });
        setIsRombelModalOpen(true);
    };

    const openEditRombelModal = (cls) => {
        setEditingClass(cls);
        setRombelForm({
            name: cls.name,
            grade_level: cls.grade_level,
            homeroom_teacher_id: cls.homeroom_teacher_id || ''
        });
        setIsRombelModalOpen(true);
    };

    const handleSaveRombel = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (editingClass) {
            router.put(route('master-data.classes.update', editingClass.id), rombelForm, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    setIsRombelModalOpen(false);
                    setNotification('Rombongan belajar berhasil diperbarui.');
                    setTimeout(() => setNotification(null), 4000);
                },
                onError: () => {
                    setIsSubmitting(false);
                }
            });
        } else {
            router.post(route('master-data.classes.store'), rombelForm, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    setIsRombelModalOpen(false);
                    setNotification('Rombongan belajar baru berhasil ditambahkan.');
                    setTimeout(() => setNotification(null), 4000);
                },
                onError: () => {
                    setIsSubmitting(false);
                }
            });
        }
    };

    const handleDeleteRombel = (cls) => {
        if (confirm(`Apakah Anda yakin ingin menghapus rombel ${cls.name}?`)) {
            router.delete(route('master-data.classes.destroy', cls.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setNotification('Rombongan belajar berhasil dihapus.');
                    setTimeout(() => setNotification(null), 4000);
                },
                onError: (err) => {
                    if (err.error) {
                        alert(err.error);
                    }
                }
            });
        }
    };

    const filteredStudents = (students?.data || []).filter(s => 
        s.full_name?.toLowerCase().includes(search.toLowerCase()) || 
        s.nisn?.includes(search)
    );

    const filteredTeachers = (teachers || []).filter(t => 
        t.full_name?.toLowerCase().includes(search.toLowerCase()) || 
        t.nip?.includes(search)
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">
                            Master Data Sekolah
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Kelola data siswa, pendidik, rombongan belajar, dan katalog kurikulum
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
                        <button
                            onClick={() => setTab('siswa')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                                tab === 'siswa'
                                    ? 'bg-[#800020] text-white shadow-sm'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            Buku Induk Siswa ({students?.data ? students.data.length : 0})
                        </button>
                        {canManageMaster && (
                            <>
                                <button
                                    onClick={() => setTab('guru')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                                        tab === 'guru'
                                            ? 'bg-[#800020] text-white shadow-sm'
                                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    Tenaga Pendidik ({teachers ? teachers.length : 0})
                                </button>
                                <button
                                    onClick={() => setTab('rombel')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                                        tab === 'rombel'
                                            ? 'bg-[#800020] text-white shadow-sm'
                                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    Rombel ({classes ? classes.length : 0})
                                </button>
                                <button
                                    onClick={() => setTab('mapel')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                                        tab === 'mapel'
                                            ? 'bg-[#800020] text-white shadow-sm'
                                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    Mata Pelajaran ({subjects ? subjects.length : 0})
                                </button>
                            </>
                        )}
                    </div>
                </div>
            }
        >
            <Head title="Master Data - Smart School LMS" />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Notification toast */}
                {notification && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center space-x-3 shadow-sm animate-fade-in">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="text-xs font-semibold">{notification}</span>
                    </div>
                )}

                {/* Error Banner */}
                {errors && errors.error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-2xl flex items-center space-x-3 shadow-sm">
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        <span className="text-xs font-semibold">{errors.error}</span>
                    </div>
                )}

                {/* Action Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama, NISN, NIP..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                        />
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                        <button className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl inline-flex items-center shadow-sm transition">
                            <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                            <span>Ekspor Excel</span>
                        </button>
                        {canManageMaster && (
                            tab === 'rombel' ? (
                                <button 
                                    onClick={openCreateRombelModal}
                                    className="px-3.5 py-2 bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-semibold rounded-xl inline-flex items-center shadow-sm transition"
                                >
                                    <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                                    <span>Tambah Rombel</span>
                                </button>
                            ) : (
                                <button className="px-3.5 py-2 bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-semibold rounded-xl inline-flex items-center shadow-sm transition">
                                    <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                                    <span>Tambah Data</span>
                                </button>
                            )
                        )}
                    </div>
                </div>

                {/* TAB 1: BUKU INDUK SISWA */}
                {tab === 'siswa' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((s) => (
                                            <tr key={s.id} className="hover:bg-[#FDF2F4]/50 transition">
                                                <td className="px-4 py-3.5 font-mono font-bold text-slate-900">{s.nisn}</td>
                                                <td className="px-4 py-3.5 font-semibold text-slate-900">{s.full_name}</td>
                                                <td className="px-4 py-3.5">
                                                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                                                        {s.class_name || 'Belum ada kelas'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5">{s.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                                                <td className="px-4 py-3.5 text-slate-700">{s.guardian_name || '-'}</td>
                                                <td className="px-4 py-3.5 font-mono text-slate-500">{s.guardian_phone || '-'}</td>
                                                <td className="px-4 py-3.5 text-right space-x-1">
                                                    <button className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-1 rounded text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
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
                )}

                {/* TAB 2: TENAGA PENDIDIK */}
                {tab === 'guru' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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
                                    {filteredTeachers.map((t) => (
                                        <tr key={t.id} className="hover:bg-[#FDF2F4]/50 transition">
                                            <td className="px-4 py-3.5 font-mono font-bold text-slate-900">{t.nip || '-'}</td>
                                            <td className="px-4 py-3.5 font-semibold text-slate-900">{t.full_name}</td>
                                            <td className="px-4 py-3.5">{t.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                                            <td className="px-4 py-3.5">
                                                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-[11px]">
                                                    {t.employment_status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-slate-600">{t.education_level}</td>
                                            <td className="px-4 py-3.5 font-mono text-slate-500">{t.email || '-'}</td>
                                            <td className="px-4 py-3.5 text-right space-x-1">
                                                <button className="p-1 rounded text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 3: ROMBONGAN BELAJAR */}
                {tab === 'rombel' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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

                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => openEditRombelModal(c)}
                                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition inline-flex items-center space-x-1"
                                    >
                                        <Edit className="w-3.5 h-3.5 text-slate-500" />
                                        <span>Edit Rombel</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteRombel(c)}
                                        className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition"
                                        title="Hapus Rombel"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* TAB 4: MATA PELAJARAN */}
                {tab === 'mapel' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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
                                            <td className="px-4 py-3.5 text-right">
                                                <button className="p-1 rounded text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL TAMBAH / EDIT ROMBEL */}
            {isRombelModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-scale-up">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-base font-bold text-slate-900">
                                {editingClass ? 'Edit Rombongan Belajar' : 'Tambah Rombongan Belajar'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsRombelModalOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveRombel} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Nama Rombongan Belajar
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Kelas 1A, Kelas 1B, Kelas 6"
                                    value={rombelForm.name}
                                    onChange={(e) => setRombelForm({ ...rombelForm, name: e.target.value })}
                                    className="w-full h-10 px-3.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                                />
                                <p className="text-[11px] text-slate-400 mt-1">
                                    Nama kelas dapat mencantumkan jenjang dan paralel (misal Kelas 1A, 1B).
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Tingkat Jenjang (Grade Level)
                                </label>
                                <div className="relative">
                                    <select
                                        value={rombelForm.grade_level}
                                        onChange={(e) => setRombelForm({ ...rombelForm, grade_level: parseInt(e.target.value) })}
                                        className="w-full h-10 pl-3.5 pr-9 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-[#800020] focus:ring-[#800020] appearance-none cursor-pointer"
                                    >
                                        <option value={1}>Tingkat 1 (Satu)</option>
                                        <option value={2}>Tingkat 2 (Dua)</option>
                                        <option value={3}>Tingkat 3 (Tiga)</option>
                                        <option value={4}>Tingkat 4 (Empat)</option>
                                        <option value={5}>Tingkat 5 (Lima)</option>
                                        <option value={6}>Tingkat 6 (Enam)</option>
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Wali Kelas (Homeroom Teacher)
                                </label>
                                <div className="relative">
                                    <select
                                        value={rombelForm.homeroom_teacher_id}
                                        onChange={(e) => setRombelForm({ ...rombelForm, homeroom_teacher_id: e.target.value })}
                                        className="w-full h-10 pl-3.5 pr-9 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-[#800020] focus:ring-[#800020] appearance-none cursor-pointer"
                                    >
                                        <option value="">-- Pilih Wali Kelas (Opsional) --</option>
                                        {teachers && teachers.map((t) => (
                                            <option key={t.id} value={t.id}>
                                                {t.full_name} ({t.employment_status || 'Guru'})
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setIsRombelModalOpen(false)}
                                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2 rounded-xl bg-[#800020] hover:bg-[#5C0017] disabled:opacity-50 text-white text-xs font-bold shadow-sm transition inline-flex items-center space-x-1.5"
                                >
                                    <Save className="w-3.5 h-3.5" />
                                    <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Rombel'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
