import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { 
    Bell, 
    CheckCheck, 
    Trash2, 
    FileText, 
    Award, 
    Calendar, 
    Megaphone, 
    Info, 
    CheckCircle2, 
    ExternalLink,
    Filter,
    Check,
    AlertCircle
} from 'lucide-react';
import axios from 'axios';

export default function Index({ notifications: initialNotifications = [], unreadCount: initialUnreadCount = 0 }) {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
    const [activeFilter, setActiveFilter] = useState('all'); // all, unread, read

    const handleMarkAsRead = async (id, e) => {
        if (e) e.stopPropagation();
        try {
            await axios.post(route('notifications.read', id));
            setNotifications(prev => 
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Gagal menandai notifikasi dibaca:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await axios.post(route('notifications.read-all'));
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Gagal menandai semua dibaca:', error);
        }
    };

    const handleDelete = async (id, e) => {
        if (e) e.stopPropagation();
        try {
            await axios.delete(route('notifications.destroy', id));
            const target = notifications.find(n => n.id === id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            if (target && !target.is_read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Gagal menghapus notifikasi:', error);
        }
    };

    const handleNotificationClick = (notification) => {
        if (!notification.is_read) {
            handleMarkAsRead(notification.id);
        }
        if (notification.link) {
            router.visit(notification.link);
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (activeFilter === 'unread') return !n.is_read;
        if (activeFilter === 'read') return n.is_read;
        return true;
    });

    const getTypeIcon = (type) => {
        switch (type) {
            case 'exam':
                return <FileText className="w-5 h-5 text-amber-600" />;
            case 'grade':
                return <Award className="w-5 h-5 text-emerald-600" />;
            case 'permission':
                return <Calendar className="w-5 h-5 text-blue-600" />;
            case 'announcement':
                return <Megaphone className="w-5 h-5 text-rose-600" />;
            case 'raport':
                return <CheckCircle2 className="w-5 h-5 text-purple-600" />;
            default:
                return <Info className="w-5 h-5 text-indigo-600" />;
        }
    };

    const getTypeBadge = (type) => {
        switch (type) {
            case 'exam':
                return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">Ujian</span>;
            case 'grade':
                return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Nilai</span>;
            case 'permission':
                return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">Perizinan</span>;
            case 'announcement':
                return <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded">Pengumuman</span>;
            case 'raport':
                return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">Rapor</span>;
            default:
                return <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded">Sistem</span>;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="font-bold text-xl text-slate-800 leading-tight flex items-center gap-2">
                            <Bell className="w-5 h-5 text-emerald-600" />
                            Pemberitahuan & Notifikasi
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Kelola semua notifikasi dan pengumuman sistem sekolah Anda
                        </p>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition shadow-sm"
                        >
                            <CheckCheck className="w-4 h-4" />
                            <span>Tandai Semua Dibaca ({unreadCount})</span>
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Notifikasi" />

            <div className="max-w-5xl mx-auto space-y-6">
                {/* Filter Tabs */}
                <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={() => setActiveFilter('all')}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                                activeFilter === 'all'
                                    ? 'bg-slate-900 text-white shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            Semua ({notifications.length})
                        </button>
                        <button
                            onClick={() => setActiveFilter('unread')}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                                activeFilter === 'unread'
                                    ? 'bg-slate-900 text-white shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            <span>Belum Dibaca</span>
                            {unreadCount > 0 && (
                                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveFilter('read')}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                                activeFilter === 'read'
                                    ? 'bg-slate-900 text-white shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            Sudah Dibaca ({notifications.length - unreadCount})
                        </button>
                    </div>
                </div>

                {/* Notifications List Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    {filteredNotifications.length === 0 ? (
                        <div className="p-12 text-center text-slate-400 space-y-3">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-300">
                                <Bell className="w-6 h-6" />
                            </div>
                            <h3 className="text-sm font-semibold text-slate-700">Tidak ada notifikasi</h3>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                Belum ada pemberitahuan baru pada kategori ini. Notifikasi ujian, nilai, dan perizinan akan muncul di sini.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {filteredNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`p-4 transition cursor-pointer flex items-start space-x-4 group ${
                                        notification.is_read
                                            ? 'bg-white hover:bg-slate-50'
                                            : 'bg-emerald-50/30 hover:bg-emerald-50/60 border-l-4 border-emerald-500'
                                    }`}
                                >
                                    <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 shrink-0">
                                        {getTypeIcon(notification.type)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-1">
                                            {getTypeBadge(notification.type)}
                                            <span className="text-xs text-slate-400">
                                                {new Date(notification.created_at).toLocaleString('id-ID', {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short'
                                                })}
                                            </span>
                                            {!notification.is_read && (
                                                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                                            )}
                                        </div>

                                        <h3 className={`text-sm font-bold ${notification.is_read ? 'text-slate-800' : 'text-slate-900'}`}>
                                            {notification.title}
                                        </h3>

                                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                            {notification.message}
                                        </p>

                                        {notification.link && (
                                            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 mt-2 hover:underline">
                                                Buka Rincian <ExternalLink className="w-3 h-3 ml-1" />
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition">
                                        {!notification.is_read && (
                                            <button
                                                onClick={(e) => handleMarkAsRead(notification.id, e)}
                                                className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-white border border-slate-200 shadow-sm"
                                                title="Tandai dibaca"
                                            >
                                                <CheckCheck className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => handleDelete(notification.id, e)}
                                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white border border-slate-200 shadow-sm"
                                            title="Hapus notifikasi"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
