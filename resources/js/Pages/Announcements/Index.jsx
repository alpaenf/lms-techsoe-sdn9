import React, { useState, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, router } from '@inertiajs/react';
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
    X,
    Camera,
    Image as ImageIcon,
    UploadCloud,
    Newspaper,
    Eye,
    Heading2,
    Heading3,
    Pilcrow,
    List,
    Quote,
    Bold
} from 'lucide-react';

export default function AnnouncementsIndex({ auth, announcements = { data: [] } }) {
    const userRole = auth?.user?.role || 'siswa';
    const canManage = Boolean(auth?.user && (userRole === 'admin' || userRole === 'pimpinan' || userRole === 'tendik'));

    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const coverInputRef = useRef(null);
    const docsInputRef = useRef(null);
    const contentInputRef = useRef(null);

    const initialFormState = {
        title: '',
        content: '',
        target_role: 'all',
        is_popup: false,
        image: null,
        imagePreview: null,
        remove_image: false,
        documentation_files: [],
        documentation_previews: [],
        existing_documentation_images: [],
    };

    const [form, setForm] = useState(initialFormState);

    // Helper untuk menyisipkan pemformatan teks (Header, Sub Header, Paragraf biasa, dsb.)
    const insertFormatting = (prefix, placeholder = '', suffix = '') => {
        const textarea = contentInputRef.current;
        if (!textarea) {
            setForm(prev => ({
                ...prev,
                content: prev.content ? `${prev.content}\n\n${prefix}${placeholder}${suffix}` : `${prefix}${placeholder}${suffix}`
            }));
            return;
        }

        const start = textarea.selectionStart ?? form.content.length;
        const end = textarea.selectionEnd ?? form.content.length;
        const currentVal = form.content || '';
        const selectedText = currentVal.substring(start, end);

        let textToInsert = '';
        let selectStart = 0;
        let selectEnd = 0;

        if (selectedText.length > 0) {
            textToInsert = `${prefix}${selectedText}${suffix}`;
            selectStart = start;
            selectEnd = start + textToInsert.length;
        } else {
            textToInsert = `${prefix}${placeholder}${suffix}`;
            selectStart = start + prefix.length;
            selectEnd = selectStart + placeholder.length;
        }

        const newVal = currentVal.substring(0, start) + textToInsert + currentVal.substring(end);
        setForm(prev => ({ ...prev, content: newVal }));

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(selectStart, selectEnd);
        }, 50);
    };

    // Helper untuk menyisipkan tag foto [foto-X] ke dalam textarea di posisi kursor
    const insertPhotoTag = (photoIndex) => {
        const tag = `\n\n[foto-${photoIndex}]\n\n`;
        const textarea = contentInputRef.current;
        if (!textarea) {
            setForm(prev => ({
                ...prev,
                content: prev.content ? `${prev.content}${tag}` : `[foto-${photoIndex}]`
            }));
            return;
        }

        const start = textarea.selectionStart ?? form.content.length;
        const end = textarea.selectionEnd ?? form.content.length;
        const currentVal = form.content || '';
        const newVal = currentVal.substring(0, start) + tag + currentVal.substring(end);
        
        setForm(prev => ({ ...prev, content: newVal }));

        setTimeout(() => {
            textarea.focus();
            const newPos = start + tag.length;
            textarea.setSelectionRange(newPos, newPos);
        }, 50);
    };

    const insertGalleryTag = () => {
        const tag = `\n\n[galeri]\n\n`;
        const textarea = contentInputRef.current;
        if (!textarea) {
            setForm(prev => ({
                ...prev,
                content: prev.content ? `${prev.content}${tag}` : `[galeri]`
            }));
            return;
        }

        const start = textarea.selectionStart ?? form.content.length;
        const end = textarea.selectionEnd ?? form.content.length;
        const currentVal = form.content || '';
        const newVal = currentVal.substring(0, start) + tag + currentVal.substring(end);
        
        setForm(prev => ({ ...prev, content: newVal }));

        setTimeout(() => {
            textarea.focus();
            const newPos = start + tag.length;
            textarea.setSelectionRange(newPos, newPos);
        }, 50);
    };

    // Bersihkan teks dari markdown/tag untuk excerpt kartu
    const cleanExcerpt = (text) => {
        if (!text) return '';
        return text
            .replace(/\[(foto-\d+|foto-semua|galeri)\]/gi, '')
            .replace(/^#{1,6}\s+/gm, '')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/^>\s+/gm, '')
            .replace(/^[-*]\s+/gm, '')
            .trim();
    };

    const items = announcements?.data || [];

    const filteredItems = items.filter(item => 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openCreateModal = () => {
        setEditingItem(null);
        setForm(initialFormState);
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setForm({
            title: item.title || '',
            content: item.content || '',
            target_role: item.target_role || 'all',
            is_popup: Boolean(item.is_popup),
            image: null,
            imagePreview: item.image || null,
            remove_image: false,
            documentation_files: [],
            documentation_previews: [],
            existing_documentation_images: Array.isArray(item.documentation_images) ? item.documentation_images : [],
        });
        setIsModalOpen(true);
    };

    const handleCoverImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Ukuran foto sampul maksimal 5MB');
                return;
            }
            setForm(prev => ({
                ...prev,
                image: file,
                imagePreview: URL.createObjectURL(file),
                remove_image: false,
            }));
        }
    };

    const handleRemoveCover = () => {
        setForm(prev => ({
            ...prev,
            image: null,
            imagePreview: null,
            remove_image: true,
        }));
        if (coverInputRef.current) {
            coverInputRef.current.value = '';
        }
    };

    const handleDocsChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const validFiles = files.filter(f => {
            if (f.size > 5 * 1024 * 1024) {
                alert(`File ${f.name} melebihi batas 5MB`);
                return false;
            }
            return true;
        });

        const newPreviews = validFiles.map(f => URL.createObjectURL(f));

        setForm(prev => ({
            ...prev,
            documentation_files: [...prev.documentation_files, ...validFiles],
            documentation_previews: [...prev.documentation_previews, ...newPreviews],
        }));
    };

    const handleRemoveNewDoc = (idx) => {
        setForm(prev => {
            const nextFiles = [...prev.documentation_files];
            const nextPreviews = [...prev.documentation_previews];
            nextFiles.splice(idx, 1);
            nextPreviews.splice(idx, 1);
            return {
                ...prev,
                documentation_files: nextFiles,
                documentation_previews: nextPreviews,
            };
        });
    };

    const handleRemoveExistingDoc = (docUrl) => {
        setForm(prev => ({
            ...prev,
            existing_documentation_images: prev.existing_documentation_images.filter(url => url !== docUrl),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('content', form.content);
        formData.append('target_role', form.target_role);
        formData.append('is_popup', form.is_popup ? '1' : '0');

        if (form.image) {
            formData.append('image', form.image);
        }
        if (form.remove_image) {
            formData.append('remove_image', '1');
        }

        form.existing_documentation_images.forEach(img => {
            formData.append('existing_documentation_images[]', img);
        });

        form.documentation_files.forEach(file => {
            formData.append('documentation_images[]', file);
        });

        if (editingItem) {
            formData.append('_method', 'PUT');
            router.post(route('announcements.update', editingItem.id), formData, {
                forceFormData: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    setIsSubmitting(false);
                },
                onError: () => setIsSubmitting(false),
            });
        } else {
            router.post(route('announcements.store'), formData, {
                forceFormData: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    setIsSubmitting(false);
                },
                onError: () => setIsSubmitting(false),
            });
        }
    };

    const handleDelete = (id, title) => {
        if (confirm(`Apakah Anda yakin ingin menghapus warta/berita "${title}" beserta dokumentasinya?`)) {
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
            bk: 'Layanan BK',
            wali_kelas: 'Wali Kelas'
        };
        return labels[target] || target;
    };

    const mainContent = (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Banner Khusus untuk Pengunjung Publik yang belum login */}
            {!auth?.user && (
                <div className="bg-gradient-to-r from-[#800020] via-[#9B0027] to-[#5C0017] rounded-3xl p-6 sm:p-10 text-white shadow-sm relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-bold border border-white/20">
                            <Newspaper className="w-3.5 h-3.5 text-rose-200" />
                            Portal Warta & Pengumuman Sekolah
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                            Informasi, Berita & Dokumentasi Kegiatan
                        </h1>
                        <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
                            Pusat kabar akademik, dokumentasi kegiatan lapangan, prestasi siswa, dan maklumat resmi UPT SDN 9 Gandangbatu Sillanan.
                        </p>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
                </div>
            )}

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari judul artikel, dokumentasi, atau pengumuman..."
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:border-[#800020] focus:ring-[#800020]"
                    />
                </div>
                <span className="text-xs font-semibold text-slate-500">
                    Total {filteredItems.length} Publikasi
                </span>
            </div>

            {/* Announcement Cards Grid */}
            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => {
                        const hasDocs = Array.isArray(item.documentation_images) && item.documentation_images.length > 0;

                        return (
                            <article 
                                key={item.id} 
                                className="bg-white rounded-xl border border-slate-200 hover:border-[#800020]/40 transition duration-300 flex flex-col justify-between overflow-hidden shadow-sm group hover:shadow-md"
                            >
                                <div>
                                    {/* Cover Image / Fallback Banner */}
                                    {item.image ? (
                                        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                                            <img 
                                                src={item.image} 
                                                alt={item.title} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            
                                            {/* Badges on Image */}
                                            <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-white/95 text-[#800020] shadow-sm backdrop-blur-sm border border-white/40">
                                                    {getTargetBadge(item.target_role)}
                                                </span>
                                                {Boolean(item.is_popup) && (
                                                    <span className="inline-flex items-center text-[10px] font-bold text-amber-800 bg-amber-100/95 border border-amber-300 px-2 py-0.5 rounded-lg shadow-sm backdrop-blur-sm">
                                                        <Pin className="w-3 h-3 mr-1 text-amber-600" />
                                                        Penting
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative h-36 w-full overflow-hidden bg-gradient-to-br from-slate-100 via-rose-50/30 to-slate-100 p-5 flex flex-col justify-between border-b border-slate-100">
                                            <div className="flex items-center justify-between">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-white text-[#800020] border border-rose-200 shadow-2xs">
                                                    {getTargetBadge(item.target_role)}
                                                </span>
                                                {Boolean(item.is_popup) && (
                                                    <span className="inline-flex items-center text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-lg">
                                                        <Pin className="w-3 h-3 mr-1" />
                                                        Penting
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Newspaper className="w-5 h-5 text-[#800020]/60" />
                                                <span className="text-[11px] font-semibold text-slate-500">Artikel & Warta Sekolah</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Card Content */}
                                    <div className="p-5 space-y-2.5">
                                        <Link 
                                            href={route('announcements.show', item.id)}
                                            className="block group-hover:text-[#800020] transition"
                                        >
                                            <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug">
                                                {item.title}
                                            </h3>
                                        </Link>

                                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                                            {cleanExcerpt(item.content)}
                                        </p>
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center text-[11px] text-slate-500 gap-3">
                                        <span className="flex items-center">
                                            <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                                            {formatDate(item.published_at || item.created_at)}
                                        </span>
                                        <span className="flex items-center truncate max-w-[110px]" title={item.author_name}>
                                            <User className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
                                            {item.author_name}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        {canManage && (
                                            <>
                                                <button
                                                    onClick={() => openEditModal(item)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                                                    title="Ubah Berita / Foto"
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
                                            title="Baca Artikel Lengkap"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#800020] flex items-center justify-center mx-auto">
                        <Newspaper className="w-7 h-7" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">Belum Ada Pengumuman / Artikel</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        {searchQuery ? 'Tidak ada hasil yang cocok dengan kata kunci pencarian.' : 'Dokumentasi kegiatan dan maklumat resmi sekolah akan tampil pada halaman ini.'}
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
    );

    const modalContent = isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 animate-scale-up my-8 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">
                            {editingItem ? 'Perbarui Artikel / Warta Sekolah' : 'Buat Artikel / Warta Sekolah Baru'}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Tambahkan judul, isi, dan foto dokumentasi kegiatan sekolah
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Judul */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Judul Artikel / Pengumuman <span className="text-rose-600">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="Contoh: Dokumentasi Upacara Peringatan Hari Pendidikan Nasional 2026"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#800020] focus:ring-[#800020]"
                        />
                    </div>

                    {/* Target & Pin */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                Sasaran Pembaca <span className="text-rose-600">*</span>
                            </label>
                            <select
                                value={form.target_role}
                                onChange={(e) => setForm({ ...form, target_role: e.target.value })}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#800020] focus:ring-[#800020]"
                            >
                                <option value="all">Semua Warga Sekolah</option>
                                <option value="siswa">Khusus Peserta Didik</option>
                                <option value="guru">Khusus Guru & Tenaga Pendidik</option>
                                <option value="wali_kelas">Wali Kelas</option>
                                <option value="pimpinan">Pimpinan Sekolah</option>
                                <option value="bk">Layanan BK</option>
                            </select>
                        </div>

                        <div className="flex items-center sm:pt-6">
                            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-700 p-2 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200 w-full">
                                <input
                                    type="checkbox"
                                    checked={form.is_popup}
                                    onChange={(e) => setForm({ ...form, is_popup: e.target.checked })}
                                    className="rounded text-[#800020] focus:ring-[#800020] w-4 h-4"
                                />
                                <span>Sematkan sebagai Maklumat Penting</span>
                            </label>
                        </div>
                    </div>

                    {/* Foto Sampul Utama */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <ImageIcon className="w-4 h-4 text-[#800020]" />
                                Foto Sampul Utama (Featured Image)
                            </label>
                            <span className="text-[11px] text-slate-400">JPG, PNG, WebP (Maks. 5MB)</span>
                        </div>

                        {form.imagePreview ? (
                            <div className="relative rounded-2xl overflow-hidden border border-slate-200 group h-52 bg-slate-100">
                                <img 
                                    src={form.imagePreview} 
                                    alt="Preview Cover" 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        type="button"
                                        onClick={() => coverInputRef.current?.click()}
                                        className="px-3 py-1.5 rounded-xl bg-white text-slate-800 text-xs font-bold hover:bg-slate-100 transition shadow"
                                    >
                                        Ganti Foto
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleRemoveCover}
                                        className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition shadow"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div 
                                onClick={() => coverInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-200 hover:border-[#800020]/50 rounded-2xl p-6 text-center cursor-pointer transition hover:bg-rose-50/20 group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#800020] flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                                    <UploadCloud className="w-5 h-5" />
                                </div>
                                <p className="text-xs font-bold text-slate-700">Klik untuk unggah Foto Sampul Kegiatan</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">Akan tampil sebagai gambar tajuk artikel dan thumbnail</p>
                            </div>
                        )}
                        <input 
                            ref={coverInputRef}
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleCoverImageChange}
                        />
                    </div>

                    {/* Foto Dokumentasi Tambahan (Galeri Kegiatan) */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <Camera className="w-4 h-4 text-[#800020]" />
                                Galeri Dokumentasi Kegiatan (Foto Tambahan)
                            </label>
                            <button
                                type="button"
                                onClick={() => docsInputRef.current?.click()}
                                className="inline-flex items-center text-xs font-bold text-[#800020] hover:text-[#5C0017] transition"
                            >
                                <Plus className="w-3.5 h-3.5 mr-1" />
                                Tambah Foto
                            </button>
                        </div>
                        <p className="text-[11px] text-slate-500">
                            Unggah foto-foto suasana kegiatan, peserta, piala/sertifikat, atau momen penting untuk dokumentasi lengkap.
                        </p>

                        {/* Grid Preview Foto Dokumentasi */}
                        {(() => {
                            const totalDocs = form.existing_documentation_images.length + form.documentation_previews.length;
                            if (totalDocs === 0) return null;

                            return (
                                <div className="space-y-2 pt-1">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {/* Existing Server Docs */}
                                        {form.existing_documentation_images.map((imgUrl, idx) => {
                                            const photoNumber = idx + 1;
                                            return (
                                                <div key={`existing-${idx}`} className="relative group rounded-xl overflow-hidden border border-slate-200 h-28 bg-slate-100 flex flex-col justify-between p-1.5 shadow-2xs">
                                                    <img src={imgUrl} alt="Dokumentasi" className="absolute inset-0 w-full h-full object-cover -z-0" />
                                                    <div className="relative z-10 flex items-center justify-between">
                                                        <span className="px-2 py-0.5 rounded-md bg-[#800020] text-white text-[10px] font-extrabold shadow">
                                                            Foto #{photoNumber}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveExistingDoc(imgUrl)}
                                                            className="p-1 rounded-full bg-rose-600/90 text-white hover:bg-rose-700 transition shadow"
                                                            title="Hapus foto ini"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                    <div className="relative z-10 pt-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => insertPhotoTag(photoNumber)}
                                                            className="w-full py-1 px-2 rounded-lg bg-black/75 hover:bg-black text-white text-[10px] font-bold backdrop-blur-xs transition shadow flex items-center justify-center gap-1"
                                                            title="Sisipkan posisi foto ini di antara paragraf teks"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                            Sisipkan di Teks
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* New Upload Previews */}
                                        {form.documentation_previews.map((previewUrl, idx) => {
                                            const photoNumber = form.existing_documentation_images.length + idx + 1;
                                            return (
                                                <div key={`new-${idx}`} className="relative group rounded-xl overflow-hidden border-2 border-[#800020]/40 h-28 bg-slate-100 flex flex-col justify-between p-1.5 shadow-2xs">
                                                    <img src={previewUrl} alt="Baru" className="absolute inset-0 w-full h-full object-cover -z-0" />
                                                    <div className="relative z-10 flex items-center justify-between">
                                                        <span className="px-2 py-0.5 rounded-md bg-[#800020] text-white text-[10px] font-extrabold shadow">
                                                            Foto #{photoNumber}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveNewDoc(idx)}
                                                            className="p-1 rounded-full bg-rose-600/90 text-white hover:bg-rose-700 transition shadow"
                                                            title="Hapus foto baru ini"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                    <div className="relative z-10 pt-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => insertPhotoTag(photoNumber)}
                                                            className="w-full py-1 px-2 rounded-lg bg-black/75 hover:bg-black text-white text-[10px] font-bold backdrop-blur-xs transition shadow flex items-center justify-center gap-1"
                                                            title="Sisipkan posisi foto ini di antara paragraf teks"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                            Sisipkan di Teks
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Box Tambah Cepat */}
                                        <div 
                                            onClick={() => docsInputRef.current?.click()}
                                            className="border-2 border-dashed border-slate-200 hover:border-[#800020] rounded-xl flex flex-col items-center justify-center cursor-pointer h-28 text-slate-400 hover:text-[#800020] transition hover:bg-rose-50/20"
                                        >
                                            <Plus className="w-5 h-5 mb-0.5" />
                                            <span className="text-[10px] font-bold">+ Foto Lagi</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        <input 
                            ref={docsInputRef}
                            type="file" 
                            multiple 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleDocsChange}
                        />
                    </div>

                    {/* Isi Lengkap & Tata Letak Format Artikel Formal */}
                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <FileText className="w-4 h-4 text-[#800020]" />
                                Isi Narasi Berita / Artikel <span className="text-rose-600">*</span>
                            </label>
                            <span className="text-[11px] text-slate-400">Tekan Enter 2x untuk memisahkan paragraf</span>
                        </div>

                        {/* Bilah Toolbar Pemformatan Cepat Berita Formal */}
                        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-2.5 space-y-2 shadow-2xs">
                            {/* Baris 1: Format Teks (Header, Sub Header, Paragraf Biasa, Tebal, dsb.) */}
                            <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-200/70">
                                <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
                                    Format Teks:
                                </span>
                                <button
                                    type="button"
                                    onClick={() => insertFormatting('\n\n## ', 'Judul Bagian', '\n')}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#800020] hover:text-[#800020] text-xs font-bold text-slate-700 transition shadow-2xs hover:bg-rose-50/30"
                                    title="Sisipkan Header / Judul Bagian (H2)"
                                >
                                    <Heading2 className="w-3.5 h-3.5 text-[#800020]" />
                                    Header (H2)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertFormatting('\n\n### ', 'Subtopik Pembahasan', '\n')}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#800020] hover:text-[#800020] text-xs font-bold text-slate-700 transition shadow-2xs hover:bg-rose-50/30"
                                    title="Sisipkan Sub Header / Subtopik (H3)"
                                >
                                    <Heading3 className="w-3.5 h-3.5 text-rose-500" />
                                    Sub Header (H3)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertFormatting('\n\n', 'Tulis paragraf baru di sini...', '\n')}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#800020] hover:text-[#800020] text-xs font-bold text-slate-700 transition shadow-2xs hover:bg-rose-50/30"
                                    title="Sisipkan Paragraf Biasa"
                                >
                                    <Pilcrow className="w-3.5 h-3.5 text-slate-500" />
                                    Paragraf Biasa
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertFormatting('**', 'teks tebal', '**')}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#800020] hover:text-[#800020] text-xs font-bold text-slate-700 transition shadow-2xs hover:bg-rose-50/30"
                                    title="Tebalkan Kata / Kalimat"
                                >
                                    <Bold className="w-3.5 h-3.5" />
                                    Tebal
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertFormatting('\n- ', 'Poin pertama\n- Poin kedua', '\n')}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#800020] hover:text-[#800020] text-xs font-bold text-slate-700 transition shadow-2xs hover:bg-rose-50/30"
                                    title="Sisipkan Butir Poin / Daftar List"
                                >
                                    <List className="w-3.5 h-3.5 text-slate-500" />
                                    Poin
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertFormatting('\n> ', 'Kutipan penting atau pernyataan...', '\n')}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#800020] hover:text-[#800020] text-xs font-bold text-slate-700 transition shadow-2xs hover:bg-rose-50/30"
                                    title="Sisipkan Kutipan / Pernyataan Penting"
                                >
                                    <Quote className="w-3.5 h-3.5 text-slate-500" />
                                    Kutipan
                                </button>
                            </div>

                            {/* Baris 2: Sisipkan Posisi Foto di Antara Teks (jika ada foto) */}
                            {(() => {
                                const totalDocs = form.existing_documentation_images.length + form.documentation_previews.length;
                                if (totalDocs === 0) return null;

                                return (
                                    <div className="space-y-1.5 pt-0.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-bold text-[#800020] flex items-center gap-1.5">
                                                <Camera className="w-3.5 h-3.5" />
                                                Sisipkan Foto di Sela Teks (Posisi Kursor):
                                            </span>
                                            <span className="text-[10px] text-slate-500 hidden sm:inline">
                                                Arahkan kursor di antara teks/paragraf, lalu klik foto
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            {Array.from({ length: totalDocs }).map((_, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() => insertPhotoTag(i + 1)}
                                                    className="inline-flex items-center px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 hover:border-[#800020] hover:bg-[#800020] hover:text-white text-[11px] font-bold text-[#800020] transition shadow-2xs group"
                                                    title={`Sisipkan [foto-${i + 1}] di posisi kursor`}
                                                >
                                                    <Camera className="w-3 h-3 mr-1 text-[#800020] group-hover:text-white" />
                                                    + Foto #{i + 1}
                                                </button>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={insertGalleryTag}
                                                className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[11px] font-bold text-slate-700 transition shadow-2xs"
                                                title="Menampilkan sisa dokumentasi foto secara rapi"
                                            >
                                                + Sisa Galeri [galeri]
                                            </button>
                                        </div>
                                    </div>
                                );
                            })()}

                            <p className="text-[10px] text-slate-500 leading-normal pt-0.5">
                                💡 <strong>Struktur Berita:</strong> Gunakan <strong>## Header</strong> untuk judul bab/bagian utama, <strong>### Sub Header</strong> untuk topik bahasan, dan baris biasa untuk narasi paragraf. Foto dapat diletakkan di sela-sela paragraf sesuai keinginan.
                            </p>
                        </div>

                        <textarea
                            ref={contentInputRef}
                            required
                            rows={9}
                            value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                            placeholder="Tuliskan berita lengkap, laporan kegiatan, nama narasumber/peserta, hasil kegiatan, jadwal, atau informasi penting lainnya..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#800020] focus:ring-[#800020] resize-y leading-relaxed font-sans"
                        />
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                            disabled={isSubmitting}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 rounded-xl bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold transition shadow-sm flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                editingItem ? 'Simpan Perubahan' : 'Terbitkan Artikel Sekarang'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    // If authenticated user (Admin/Guru/Siswa): Render with Authenticated LMS Layout
    if (auth?.user) {
        return (
            <AuthenticatedLayout
                header={
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 max-w-7xl mx-auto">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 leading-tight">
                                Warta & Pengumuman Sekolah
                            </h2>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                                Pusat artikel kegiatan, dokumentasi sekolah, dan informasi resmi UPT SDN 9 Gandangbatu Sillanan
                            </p>
                        </div>

                        {canManage && (
                            <button
                                onClick={openCreateModal}
                                className="inline-flex items-center px-4 py-2.5 rounded-xl bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold transition shadow-sm"
                            >
                                <Plus className="w-4 h-4 mr-1.5" />
                                Tulis Berita / Pengumuman
                            </button>
                        )}
                    </div>
                }
            >
                <Head title="Warta & Pengumuman" />
                {mainContent}
                {modalContent}
            </AuthenticatedLayout>
        );
    }

    // If public visitor (not logged in): Render with Public Layout
    return (
        <PublicLayout auth={auth} title="Warta & Pengumuman Sekolah" activeNav="announcements">
            {mainContent}
        </PublicLayout>
    );
}
