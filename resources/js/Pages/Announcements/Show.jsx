import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    ArrowLeft, 
    Calendar, 
    User, 
    Bell, 
    Pin, 
    Share2, 
    BookOpen,
    Camera,
    Eye,
    X,
    ChevronLeft,
    ChevronRight,
    Check,
    Newspaper,
    Clock
} from 'lucide-react';

export default function AnnouncementsShow({ auth, announcement, recentAnnouncements = [] }) {
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const [copied, setCopied] = useState(false);

    // Collect all photos: cover image (if any) + documentation images
    const allImages = [];
    if (announcement.image) {
        allImages.push({ url: announcement.image, title: 'Foto Utama' });
    }
    if (Array.isArray(announcement.documentation_images)) {
        announcement.documentation_images.forEach((img, idx) => {
            allImages.push({ url: img, title: `Dokumentasi Kegiatan #${idx + 1}` });
        });
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    // Keyboard navigation for lightbox
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (lightboxIndex === null) return;
            if (e.key === 'Escape') setLightboxIndex(null);
            if (e.key === 'ArrowRight') {
                setLightboxIndex((prev) => (prev + 1) % allImages.length);
            }
            if (e.key === 'ArrowLeft') {
                setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxIndex, allImages.length]);

    const getTargetBadge = (target) => {
        const labels = {
            all: 'Semua Warga Sekolah',
            siswa: 'Peserta Didik',
            guru: 'Guru & Tenaga Pendidik',
            admin: 'Administrator',
            pimpinan: 'Pimpinan Sekolah',
            bk: 'Layanan BK',
            wali_kelas: 'Wali Kelas'
        };
        return labels[target] || target;
    };

    // Helper to render single photo figure with sharp radius and clean presentation (no unwanted caption)
    const renderPhotoFigure = (imgUrl, caption, globalIdx, key) => (
        <figure key={key} className="my-6 sm:my-8">
            <div 
                className="relative rounded-lg overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer group shadow-2xs hover:shadow-md transition duration-300"
                onClick={() => setLightboxIndex(globalIdx)}
            >
                <img 
                    src={imgUrl} 
                    alt="Dokumentasi kegiatan" 
                    className="w-full h-auto max-h-[520px] object-cover group-hover:scale-[1.01] transition-transform duration-500" 
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-md bg-black/75 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-1.5 shadow">
                        <Eye className="w-4 h-4" />
                        Perbesar Foto
                    </span>
                </div>
            </div>
        </figure>
    );

    // Helper to format inline markdown like **bold text**
    const renderInlineFormatting = (text) => {
        if (!text || typeof text !== 'string') return text;
        if (!text.includes('**')) return text;
        const parts = text.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    // Helper to parse and render a content block (supports Headers ##, Sub Headers ###, Blockquotes >, Lists -, and Paragraphs)
    const renderFormattedBlock = (blockText, blockKey) => {
        const trimmed = (blockText || '').trim();
        if (!trimmed) return null;

        const lines = trimmed.split('\n');

        // Single line H2 Header
        if (lines.length === 1 && trimmed.startsWith('## ')) {
            return (
                <h2 key={blockKey} className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 pt-5 pb-1.5 border-b border-slate-100 flex items-center gap-2.5">
                    <span className="w-1.5 h-5 sm:h-6 bg-[#800020] rounded-full inline-block shrink-0"></span>
                    <span>{trimmed.replace(/^##\s+/, '')}</span>
                </h2>
            );
        }

        // Single line H3 Sub Header
        if (lines.length === 1 && trimmed.startsWith('### ')) {
            return (
                <h3 key={blockKey} className="text-base sm:text-lg font-bold text-slate-900 pt-3 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-rose-500 rounded-full inline-block shrink-0"></span>
                    <span>{trimmed.replace(/^###\s+/, '')}</span>
                </h3>
            );
        }

        // Single line Blockquote
        if (lines.length === 1 && trimmed.startsWith('> ')) {
            return (
                <blockquote key={blockKey} className="my-2 p-3.5 sm:p-4 rounded-r-xl border-l-4 border-[#800020] bg-rose-50/50 text-slate-700 italic text-sm sm:text-base leading-relaxed">
                    {renderInlineFormatting(trimmed.replace(/^>\s+/, ''))}
                </blockquote>
            );
        }

        // Check if all lines are list items
        const isAllList = lines.every(l => l.trim().startsWith('- ') || l.trim().startsWith('* '));
        if (isAllList && lines.length > 0) {
            return (
                <ul key={blockKey} className="space-y-1.5 my-2 pl-2">
                    {lines.map((l, lIdx) => (
                        <li key={lIdx} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-800 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#800020] mt-2 shrink-0"></span>
                            <span>{renderInlineFormatting(l.trim().replace(/^[-*]\s+/, ''))}</span>
                        </li>
                    ))}
                </ul>
            );
        }

        // Multi-line block that may contain inline headers, quotes, lists, or normal paragraph lines
        const subElements = [];
        let currentParagraphLines = [];

        const flushParagraph = (subKey) => {
            if (currentParagraphLines.length > 0) {
                const pText = currentParagraphLines.join('\n');
                subElements.push(
                    <p key={subKey} className="text-slate-800 text-sm sm:text-base leading-relaxed font-normal whitespace-pre-line">
                        {renderInlineFormatting(pText)}
                    </p>
                );
                currentParagraphLines = [];
            }
        };

        lines.forEach((line, lIdx) => {
            const lTrim = line.trim();
            if (lTrim.startsWith('## ')) {
                flushParagraph(`${blockKey}-flush-${lIdx}`);
                subElements.push(
                    <h2 key={`${blockKey}-h2-${lIdx}`} className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 pt-5 pb-1.5 border-b border-slate-100 flex items-center gap-2.5">
                        <span className="w-1.5 h-5 sm:h-6 bg-[#800020] rounded-full inline-block shrink-0"></span>
                        <span>{lTrim.replace(/^##\s+/, '')}</span>
                    </h2>
                );
            } else if (lTrim.startsWith('### ')) {
                flushParagraph(`${blockKey}-flush-${lIdx}`);
                subElements.push(
                    <h3 key={`${blockKey}-h3-${lIdx}`} className="text-base sm:text-lg font-bold text-slate-900 pt-3 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-rose-500 rounded-full inline-block shrink-0"></span>
                        <span>{lTrim.replace(/^###\s+/, '')}</span>
                    </h3>
                );
            } else if (lTrim.startsWith('> ')) {
                flushParagraph(`${blockKey}-flush-${lIdx}`);
                subElements.push(
                    <blockquote key={`${blockKey}-quote-${lIdx}`} className="my-2 p-3.5 sm:p-4 rounded-r-xl border-l-4 border-[#800020] bg-rose-50/50 text-slate-700 italic text-sm sm:text-base leading-relaxed">
                        {renderInlineFormatting(lTrim.replace(/^>\s+/, ''))}
                    </blockquote>
                );
            } else if (lTrim.startsWith('- ') || lTrim.startsWith('* ')) {
                flushParagraph(`${blockKey}-flush-${lIdx}`);
                subElements.push(
                    <div key={`${blockKey}-li-${lIdx}`} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-800 leading-relaxed my-1 pl-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#800020] mt-2 shrink-0"></span>
                        <span>{renderInlineFormatting(lTrim.replace(/^[-*]\s+/, ''))}</span>
                    </div>
                );
            } else {
                currentParagraphLines.push(line);
            }
        });

        flushParagraph(`${blockKey}-final`);

        if (subElements.length === 1) {
            return subElements[0];
        }

        return <div key={blockKey} className="space-y-3">{subElements}</div>;
    };

    // Renderer for article narrative with flexible photo interleaving (seperti artikel berita formal)
    const renderArticleNarrative = () => {
        const docImages = Array.isArray(announcement.documentation_images) ? announcement.documentation_images : [];
        const content = announcement.content || '';

        // Deteksi shortcodes seperti [foto-1], [foto-2], [foto-semua], [galeri]
        const tagRegex = /\[(foto-\d+|foto-semua|galeri)\]/i;
        const hasTags = tagRegex.test(content);
        const usedDocIndices = new Set();

        if (hasTags) {
            // Split dengan capture group agar shortcode tersimpan di array parts
            const parts = content.split(/(\[(?:foto-\d+|foto-semua|galeri)\])/i);
            const elements = [];

            parts.forEach((part, idx) => {
                const trimmed = part.trim();
                if (!trimmed) return;

                const matchSingle = trimmed.match(/^\[foto-(\d+)\]$/i);
                const matchAll = trimmed.match(/^\[(?:foto-semua|galeri)\]$/i);

                if (matchSingle) {
                    const photoNum = parseInt(matchSingle[1], 10);
                    const docIdx = photoNum - 1;
                    if (docImages[docIdx]) {
                        usedDocIndices.add(docIdx);
                        const globalIdx = announcement.image ? docIdx + 1 : docIdx;
                        elements.push(
                            renderPhotoFigure(
                                docImages[docIdx],
                                null,
                                globalIdx,
                                `tag-doc-${idx}`
                            )
                        );
                        return;
                    }
                } else if (matchAll) {
                    const remaining = docImages
                        .map((url, i) => ({ url, idx: i }))
                        .filter(item => !usedDocIndices.has(item.idx));

                    if (remaining.length > 0) {
                        remaining.forEach(item => usedDocIndices.add(item.idx));
                        elements.push(
                            <div key={`tag-all-${idx}`} className="my-6 sm:my-8">
                                <div className={`grid gap-3.5 ${remaining.length === 1 ? 'grid-cols-1 max-w-xl' : remaining.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
                                    {remaining.map(({ url, idx: dIdx }) => {
                                        const globalIdx = announcement.image ? dIdx + 1 : dIdx;
                                        return (
                                            <div 
                                                key={dIdx}
                                                onClick={() => setLightboxIndex(globalIdx)}
                                                className="group relative rounded-lg overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer aspect-4/3 shadow-2xs hover:shadow-md transition"
                                            >
                                                <img src={url} alt={`Dokumentasi ${dIdx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" loading="lazy" />
                                                <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                                    <Eye className="w-4 h-4" />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                        return;
                    }
                } else {
                    // Blok teks: pecah per paragraf/bagian dan render format kaya (h2, h3, p)
                    const paras = part.split(/\n\n+/).filter(p => p.trim() !== '');
                    paras.forEach((pText, pIdx) => {
                        const blockEl = renderFormattedBlock(pText, `p-${idx}-${pIdx}`);
                        if (blockEl) elements.push(blockEl);
                    });
                }
            });

            // Foto dokumentasi tersisa yang belum disisipkan oleh tag
            const unrendered = docImages
                .map((url, i) => ({ url, idx: i }))
                .filter(item => !usedDocIndices.has(item.idx));

            if (unrendered.length > 0) {
                elements.push(
                    <div key="unrendered-docs" className="pt-8 mt-6 border-t border-slate-100 space-y-3">
                        <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <Camera className="w-3.5 h-3.5 text-[#800020]" />
                            Dokumentasi Tambahan Kegiatan
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                            {unrendered.map(({ url, idx: dIdx }) => {
                                const globalIdx = announcement.image ? dIdx + 1 : dIdx;
                                return (
                                    <div 
                                        key={dIdx}
                                        onClick={() => setLightboxIndex(globalIdx)}
                                        className="group relative rounded-lg overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer aspect-4/3 shadow-2xs hover:shadow-md transition"
                                    >
                                        <img src={url} alt={`Dokumentasi ${dIdx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" loading="lazy" />
                                        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                            <Eye className="w-4 h-4" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            }

            return <div className="space-y-4">{elements}</div>;
        }

        // Automatic natural editorial flow (when no tags specified)
        const paragraphs = content.split(/\n\n+/).filter(p => p.trim() !== '');
        const elements = [];
        let docPointer = 0;

        paragraphs.forEach((para, pIdx) => {
            const blockEl = renderFormattedBlock(para, `p-${pIdx}`);
            if (blockEl) elements.push(blockEl);

            // After paragraph 1, embed documentation photo 1
            if (pIdx === 0 && docPointer < docImages.length) {
                const currentDocIdx = docPointer;
                const globalIdx = announcement.image ? currentDocIdx + 1 : currentDocIdx;
                elements.push(
                    renderPhotoFigure(
                        docImages[currentDocIdx],
                        null,
                        globalIdx,
                        `auto-doc-${currentDocIdx}`
                    )
                );
                docPointer++;
            }
            // After paragraph 2 or 3, embed documentation photo 2
            else if (pIdx === 2 && docPointer < docImages.length) {
                const currentDocIdx = docPointer;
                const globalIdx = announcement.image ? currentDocIdx + 1 : currentDocIdx;
                elements.push(
                    renderPhotoFigure(
                        docImages[currentDocIdx],
                        null,
                        globalIdx,
                        `auto-doc-${currentDocIdx}`
                    )
                );
                docPointer++;
            }
        });

        // Any remaining documentation photos: sleek editorial gallery
        const remainingDocs = docImages.slice(docPointer);
        if (remainingDocs.length > 0) {
            elements.push(
                <div key="remaining-grid" className="pt-6 border-t border-slate-100 space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-[#800020]" />
                        Galeri Dokumentasi Foto Kegiatan
                    </h4>
                    <div className={`grid gap-3.5 ${remainingDocs.length === 1 ? 'grid-cols-1 max-w-xl' : remainingDocs.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
                        {remainingDocs.map((url, rIdx) => {
                            const actualDocIdx = docPointer + rIdx;
                            const globalIdx = announcement.image ? actualDocIdx + 1 : actualDocIdx;
                            return (
                                <div 
                                    key={rIdx}
                                    onClick={() => setLightboxIndex(globalIdx)}
                                    className="group relative rounded-lg overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer aspect-4/3 shadow-2xs hover:shadow-md transition"
                                >
                                    <img src={url} alt={`Dokumentasi ${actualDocIdx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" loading="lazy" />
                                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                        <Eye className="w-4 h-4" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }

        return <div className="space-y-4">{elements}</div>;
    };

    const articleBodyContent = (
        <div className="space-y-8 max-w-7xl mx-auto w-full">
            {/* Navigasi Breadcrumb untuk Pengunjung Publik */}
            {!auth?.user && (
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Link href="/" className="hover:text-[#800020] transition">
                        Beranda
                    </Link>
                    <span>/</span>
                    <Link href={route('announcements.index')} className="hover:text-[#800020] transition">
                        Warta & Pengumuman
                    </Link>
                    <span>/</span>
                    <span className="text-slate-700 font-semibold truncate max-w-[220px] sm:max-w-md">
                        {announcement.title}
                    </span>
                </div>
            )}

            {/* Main Article Container dengan Thumbnail sebagai Header */}
            <article className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                
                {/* 1. Thumbnail Menjadi Header Artikel (Foto Sampul Utama / Featured Header Ramping) */}
                {announcement.image && (
                    <div 
                        className="relative w-full h-48 sm:h-60 md:h-72 lg:h-80 overflow-hidden bg-slate-900 cursor-pointer group"
                        onClick={() => setLightboxIndex(0)}
                    >
                        <img 
                            src={announcement.image} 
                            alt={announcement.title} 
                            className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="px-3.5 py-2 rounded-md bg-black/75 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-1.5 shadow">
                                <Eye className="w-4 h-4" />
                                Perbesar Foto Sampul
                            </span>
                        </div>
                    </div>
                )}

                {/* 2. Isi Artikel */}
                <div className="p-6 sm:p-10 lg:p-12 space-y-8">
                    {/* Header Judul & Headline Info */}
                    <div className="space-y-4 pb-6 border-b border-slate-100">
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Target Badge */}
                            <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold bg-rose-50 text-[#800020] border border-rose-200">
                                {getTargetBadge(announcement.target_role)}
                            </span>
                            {Boolean(announcement.is_popup) && (
                                <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                    <Pin className="w-3.5 h-3.5 mr-1 text-amber-600" />
                                    Maklumat Penting
                                </span>
                            )}
                        </div>

                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[38px] font-extrabold text-slate-900 leading-tight tracking-tight">
                            {announcement.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-500 pt-1">
                            <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1.5 text-[#800020]" />
                                {formatDate(announcement.published_at || announcement.created_at)}
                            </span>
                            <span className="flex items-center">
                                <User className="w-4 h-4 mr-1.5 text-slate-400" />
                                Penulis: <strong className="ml-1 text-slate-800">{announcement.author_name || 'Admin Sekolah'}</strong>
                            </span>
                        </div>
                    </div>

                    {/* 3. Narasi Artikel Berita Formal dengan Foto Dokumentasi Mengalir */}
                    <div className="pt-2">
                        {renderArticleNarrative()}
                    </div>

                    {/* 4. Footer Artikel & Tombol Aksi */}
                    <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <Link
                            href={route('announcements.index')}
                            className="inline-flex items-center text-xs font-bold text-[#800020] hover:text-[#5C0017] transition"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1.5" />
                            Kembali ke Pusat Pengumuman
                        </Link>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleShare}
                                className="px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 transition inline-flex items-center gap-1.5"
                            >
                                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                                {copied ? 'Tautan Tersalin!' : 'Bagikan Artikel'}
                            </button>
                        </div>
                    </div>
                </div>
            </article>

            {/* Berita / Pengumuman Terkini Lainnya */}
            {recentAnnouncements.length > 0 && (
                <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                                Warta & Pengumuman Lainnya
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Publikasi informasi dan agenda kegiatan sekolah lainnya
                            </p>
                        </div>
                        <Link 
                            href={route('announcements.index')}
                            className="text-xs font-bold text-[#800020] hover:text-[#5C0017] transition flex items-center gap-1"
                        >
                            <span>Lihat Semua Pengumuman</span>
                            <span>&rarr;</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {recentAnnouncements.map((item) => (
                            <Link
                                key={item.id}
                                href={route('announcements.show', item.id)}
                                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-[#800020]/40 transition group shadow-2xs hover:shadow-md flex flex-col justify-between"
                            >
                                <div>
                                    {item.image ? (
                                        <div className="h-40 w-full overflow-hidden bg-slate-100">
                                            <img 
                                                src={item.image} 
                                                alt={item.title} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-32 w-full bg-slate-100 p-4 flex items-center justify-center text-slate-400">
                                            <Newspaper className="w-8 h-8 text-[#800020]/40" />
                                        </div>
                                    )}
                                    <div className="p-4 space-y-1.5">
                                        <span className="text-[10px] font-bold text-[#800020]">
                                            {formatDate(item.published_at || item.created_at)}
                                        </span>
                                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-[#800020] transition leading-snug">
                                            {item.title}
                                        </h4>
                                    </div>
                                </div>
                                <div className="p-4 pt-0 text-[11px] font-semibold text-slate-500 flex items-center justify-between">
                                    <span className="group-hover:text-[#800020] transition">Baca Selengkapnya &rarr;</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const lightboxModal = lightboxIndex !== null && allImages[lightboxIndex] && (
        <div 
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setLightboxIndex(null)}
        >
            <div 
                className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Top bar */}
                <div className="w-full flex items-center justify-between text-white pb-3">
                    <span className="text-xs font-bold text-slate-300">
                        {allImages[lightboxIndex].title} ({lightboxIndex + 1} dari {allImages.length})
                    </span>
                    <button
                        onClick={() => setLightboxIndex(null)}
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Image viewer */}
                <div className="relative w-full flex items-center justify-center max-h-[78vh] overflow-hidden rounded-2xl bg-black/40">
                    <img 
                        src={allImages[lightboxIndex].url} 
                        alt="Dokumentasi Penuh" 
                        className="max-w-full max-h-[78vh] object-contain rounded-xl shadow-2xl"
                    />

                    {/* Nav buttons */}
                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
                                }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition backdrop-blur-sm"
                                title="Sebelumnya"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxIndex((prev) => (prev + 1) % allImages.length);
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition backdrop-blur-sm"
                                title="Selanjutnya"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    // If authenticated user: Render inside AuthenticatedLayout
    if (auth?.user) {
        return (
            <AuthenticatedLayout
                header={
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 max-w-7xl mx-auto">
                        <div className="flex items-center gap-3">
                            <Link 
                                href={route('announcements.index')}
                                className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center transition shadow-2xs text-slate-600 hover:text-slate-900"
                                title="Kembali ke Pusat Pengumuman"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                    <Link href={route('announcements.index')} className="hover:text-[#800020] transition">
                                        Warta & Artikel
                                    </Link>
                                    <span>/</span>
                                    <span className="text-slate-700 font-semibold truncate max-w-[200px] sm:max-w-md">
                                        {announcement.title}
                                    </span>
                                </div>
                                <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight mt-0.5">
                                    Artikel Warta Sekolah
                                </h2>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleShare}
                                className="inline-flex items-center px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition shadow-2xs"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4 mr-1.5 text-emerald-600" />
                                        <span className="text-emerald-700">Tersalin!</span>
                                    </>
                                ) : (
                                    <>
                                        <Share2 className="w-4 h-4 mr-1.5 text-slate-500" />
                                        Bagikan
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                }
            >
                <Head title={announcement.title} />
                {articleBodyContent}
                {lightboxModal}
            </AuthenticatedLayout>
        );
    }

    // If guest visitor: Render inside PublicLayout
    return (
        <PublicLayout auth={auth} title={announcement.title} activeNav="announcements">
            {articleBodyContent}
            {lightboxModal}
        </PublicLayout>
    );
}
