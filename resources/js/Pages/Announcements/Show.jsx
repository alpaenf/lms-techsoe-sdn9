import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    ArrowLeft, 
    Calendar, 
    User, 
    Bell, 
    Pin, 
    Share2, 
    Printer,
    BookOpen
} from 'lucide-react';

export default function AnnouncementsShow({ auth, announcement }) {
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

    const handlePrint = () => {
        window.print();
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link 
                        href={route('announcements.index')}
                        className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">
                            Warta Resmi Sekolah
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            UPT SDN 9 Gandangbatu Sillanan
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={announcement.title} />

            <div className="max-w-4xl mx-auto space-y-6">
                <article className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
                    {/* Header info */}
                    <div className="space-y-3 pb-6 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/10 text-[#800020] border border-rose-200">
                                Sasaran: {announcement.target_role === 'all' ? 'Seluruh Warga Sekolah' : announcement.target_role}
                            </span>
                            {Boolean(announcement.is_popup) && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-700 border border-amber-500/20">
                                    <Pin className="w-3.5 h-3.5 mr-1" />
                                    Maklumat Penting
                                </span>
                            )}
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                            {announcement.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                            <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1.5 text-slate-400" />
                                {formatDate(announcement.published_at || announcement.created_at)}
                            </span>
                            <span className="flex items-center">
                                <User className="w-4 h-4 mr-1.5 text-slate-400" />
                                Diterbitkan oleh: <strong className="ml-1 text-slate-700">{announcement.author_name}</strong>
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed whitespace-pre-wrap py-2">
                        {announcement.content}
                    </div>

                    {/* Footer / Actions */}
                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                        <Link
                            href={route('announcements.index')}
                            className="inline-flex items-center text-xs font-bold text-[#800020] hover:text-[#5C0017]"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1.5" />
                            Kembali ke Semua Warta
                        </Link>

                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition"
                        >
                            <Printer className="w-4 h-4 mr-1.5 text-slate-500" />
                            Cetak Maklumat
                        </button>
                    </div>
                </article>
            </div>
        </AuthenticatedLayout>
    );
}
