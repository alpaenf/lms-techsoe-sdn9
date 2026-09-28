import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { 
    Bell, 
    Calendar, 
    User, 
    Plus, 
    Search, 
    ChevronRight, 
    Pin, 
    FileText,
    Trash2,
    Edit,
    CheckCircle2,
    X
} from 'lucide-react';

export default function AnnouncementsIndex({ auth, announcements = { data: [] } }) {
    const userRole = auth?.user?.role || 'siswa';
    const canManage = userRole === 'admin' || userRole === 'pimpinan';

    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form, setForm] = useState({
        title: '',
        content: '',
        target_role: 'all',
        is_popup: false,
    });

    const items = announcements?.data || [];

    const filteredItems = items.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openCreateModal = () => {
        setEditingItem(null);
        setForm({
            title: '',
            content: '',
            target_role: 'all',
            is_popup: false,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setForm({
            title: item.title,
            content: item.content,
            target_role: item.target_role || 'all',
            is_popup: Boolean(item.is_popup),
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingItem) {
            router.put(route('announcements.update', editingItem.id), form, {
                onSuccess: () => setIsModalOpen(false)
            });
        } else {
            router.post(route('announcements.store'), form, {
                onSuccess: () => setIsModalOpen(false)
            });
        }
    };

    const handleDelete = (id, title) => {
        if (confirm(`Apakah Anda yakin ingin menghapus pengumuman "${title}"?`)) {
            router.delete(route('announcements.destroy', id));
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const getTargetBadge = (target) => {
        const labels = {
            all: 'Semua Warga',
            siswa: 'Peserta Didik',
            guru: 'Guru & Tenaga Pendidik',
            admin: 'Administrator',
            pimpinan: 'Pimpinan Sekolah',
            bk: 'Layanan BK'
        };
        return labels[target] || target;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">
                            Warta & Pengumuman Sekolah
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Pusat informasi resmi dan artikel kegiatan UPT SDN 9 Gandangbatu Sillanan
                        </p>
                    </div>

                    {canManage && (
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center px-4 py-2.5 rounded-xl bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold transition shadow-sm"
                        >
                            <Plus className="w-4 h-4 mr-1.5" />
                            Buat Pengumuman Baru
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Warta & Pengumuman - Smart School LMS" />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Search Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari judul berita atau isi pengumuman..."
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:border-[#800020] focus:ring-[#800020]"
                        />
                    </div>
                    <span className="text-xs font-semibold text-slate-500">
                        Total {filteredItems.length} Pengumuman
                    </span>
                </div>

                {/* Announcement Cards Grid */}
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredItems.map((item) => (
                            <div 
                                key={item.id} 
                                className="bg-white rounded-2xl border border-slate-200 hover:border-[#800020] transition duration-200 flex flex-col justify-between overflow-hidden shadow-sm group hover:shadow-md"
                            >
                                <div className="p-6 space-y-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FDF2F4] text-[#800020] border border-[#E8B4B8]">
                                            {getTargetBadge(item.target_role)}
                                        </span>
                                        {Boolean(item.is_popup) && (
                                            <span className="inline-flex items-center text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                                <Pin className="w-3 h-3 mr-1" />
                                                Penting
                                            </span>
                                        )}
                                    </div>

                                    <Link 
                                        href={route('announcements.show', item.id)}
                                        className="block group-hover:text-[#800020] transition"
                                    >
                                        <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug">
                                            {item.title}
                                        </h3>
                                    </Link>

                                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                                        {item.content}
                                    </p>
                                </div>

                                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center text-[11px] text-slate-500 gap-3">
                                        <span className="flex items-center">
                                            <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                                            {formatDate(item.published_at || item.created_at)}
                                        </span>
                                        <span className="flex items-center">
                                            <User className="w-3.5 h-3.5 mr-1 text-slate-400" />
                                            {item.author_name}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {canManage && (
                                            <>
                                                <button
                                                    onClick={() => openEditModal(item)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                                                    title="Ubah"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id, item.title)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                        <Link
                                            href={route('announcements.show', item.id)}
                                            className="p-1.5 rounded-lg text-[#800020] hover:bg-[#FDF2F4] transition"
                                            title="Baca Selengkapnya"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
                        <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h4 className="text-base font-bold text-slate-900">Belum Ada Pengumuman</h4>
                        <p className="text-xs text-slate-500 mt-1">
                            {searchQuery ? 'Tidak ada hasil yang cocok dengan kata kunci pencarian.' : 'Seluruh informasi atau maklumat sekolah akan tampil pada halaman ini.'}
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {announcements?.links && announcements.links.length > 3 && (
                    <div className="flex items-center justify-center gap-1 pt-4">
                        {announcements.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                    link.active
                                        ? 'bg-[#800020] text-white'
                                        : link.url
                                        ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                        : 'text-slate-300 cursor-not-allowed'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Create / Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-scale-up">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="text-base font-bold text-slate-900">
                                {editingItem ? 'Perbarui Maklumat & Pengumuman' : 'Buat Maklumat / Berita Baru'}
                            </h3>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Judul Pengumuman / Artikel
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="Contoh: Jadwal Asesmen Akhir Semester Ganjil..."
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#800020] focus:ring-[#800020]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Sasaran Pengguna
                                    </label>
                                    <select
                                        value={form.target_role}
                                        onChange={(e) => setForm({ ...form, target_role: e.target.value })}
                                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#800020] focus:ring-[#800020]"
                                    >
                                        <option value="all">Semua Warga</option>
                                        <option value="siswa">Khusus Peserta Didik</option>
                                        <option value="guru">Khusus Guru / Wali Kelas</option>
                                        <option value="bk">Layanan BK</option>
                                        <option value="pimpinan">Pimpinan</option>
                                    </select>
                                </div>

                                <div className="flex items-center pt-5">
                                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                                        <input
                                            type="checkbox"
                                            checked={form.is_popup}
                                            onChange={(e) => setForm({ ...form, is_popup: e.target.checked })}
                                            className="rounded text-[#800020] focus:ring-[#800020]"
                                        />
                                        <span>Sematkan / Tandai Penting</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Isi Lengkap Maklumat
                                </label>
                                <textarea
                                    required
                                    rows={6}
                                    value={form.content}
                                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                                    placeholder="Tuliskan isi informasi, ketentuan, rincian jadwal, atau berita sekolah di sini..."
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#800020] focus:ring-[#800020] resize-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-xl bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold transition shadow-sm"
                                >
                                    {editingItem ? 'Simpan Perubahan' : 'Terbitkan Sekarang'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
