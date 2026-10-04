import React, { useState, useEffect, useRef } from 'react';
import { Link, router } from '@inertiajs/react';
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
    X,
    Loader2
} from 'lucide-react';
import axios from 'axios';

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await axios.get(route('notifications.index'), {
                headers: { 'Accept': 'application/json' }
            });
            if (response.data) {
                setNotifications(response.data.notifications || []);
                setUnreadCount(response.data.unread_count || 0);
            }
        } catch (error) {
            console.error('Gagal mengambil notifikasi:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 45 seconds
        const interval = setInterval(fetchNotifications, 45000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = () => {
        if (!isOpen) {
            fetchNotifications();
        }
        setIsOpen(!isOpen);
    };

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
        setIsOpen(false);
        if (notification.link) {
            router.visit(notification.link);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'exam':
                return <FileText className="w-4 h-4 text-amber-600" />;
            case 'grade':
                return <Award className="w-4 h-4 text-emerald-600" />;
            case 'permission':
                return <Calendar className="w-4 h-4 text-blue-600" />;
            case 'announcement':
                return <Megaphone className="w-4 h-4 text-rose-600" />;
            case 'raport':
                return <CheckCircle2 className="w-4 h-4 text-purple-600" />;
            default:
                return <Info className="w-4 h-4 text-indigo-600" />;
        }
    };

    const getTypeBg = (type) => {
        switch (type) {
            case 'exam':
                return 'bg-amber-50 border-amber-200';
            case 'grade':
                return 'bg-emerald-50 border-emerald-200';
            case 'permission':
                return 'bg-blue-50 border-blue-200';
            case 'announcement':
                return 'bg-rose-50 border-rose-200';
            case 'raport':
                return 'bg-purple-50 border-purple-200';
            default:
                return 'bg-indigo-50 border-indigo-200';
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) return 'Baru saja';
        if (diffMins < 60) return `${diffMins} mnt lalu`;
        if (diffHours < 24) return `${diffHours} jam lalu`;
        if (diffDays < 7) return `${diffDays} hr lalu`;
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Bell Button */}
            <button
                onClick={toggleDropdown}
                className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition focus:outline-none"
                aria-label="Lihat notifikasi"
            >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Header */}
                    <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Bell className="w-4 h-4 text-emerald-400" />
                            <span className="font-semibold text-sm">Notifikasi</span>
                            {unreadCount > 0 && (
                                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                                    {unreadCount} baru
                                </span>
                            )}
                        </div>
                        <div className="flex items-center space-x-1">
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    title="Tandai semua dibaca"
                                    className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition flex items-center text-[11px] space-x-1"
                                >
                                    <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="hidden sm:inline">Dibaca</span>
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Notification List */}
                    <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
                        {loading && notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
                                <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                                <span>Memuat notifikasi...</span>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
                                <Bell className="w-8 h-8 text-slate-200" />
                                <span className="font-medium">Tidak ada notifikasi saat ini</span>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`p-3.5 transition cursor-pointer flex items-start space-x-3 group relative ${
                                        notification.is_read
                                            ? 'bg-white hover:bg-slate-50 opacity-80'
                                            : 'bg-emerald-50/40 hover:bg-emerald-50/70 border-l-2 border-emerald-500'
                                    }`}
                                >
                                    {/* Icon Badge */}
                                    <div className={`p-2 rounded-lg border shrink-0 ${getTypeBg(notification.type)}`}>
                                        {getTypeIcon(notification.type)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 pr-6">
                                        <div className="flex items-center justify-between gap-1 mb-0.5">
                                            <h4 className={`text-xs truncate font-semibold ${notification.is_read ? 'text-slate-700' : 'text-slate-900 font-bold'}`}>
                                                {notification.title}
                                            </h4>
                                            <span className="text-[10px] text-slate-400 shrink-0">
                                                {formatTime(notification.created_at)}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                                            {notification.message}
                                        </p>
                                        {notification.link && (
                                            <span className="inline-flex items-center text-[10px] font-semibold text-emerald-600 mt-1 hover:underline">
                                                Lihat Rincian <ExternalLink className="w-2.5 h-2.5 ml-1" />
                                            </span>
                                        )}
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 transition flex items-center space-x-1 bg-white/90 p-1 rounded border border-slate-200 shadow-sm">
                                        {!notification.is_read && (
                                            <button
                                                onClick={(e) => handleMarkAsRead(notification.id, e)}
                                                title="Tandai dibaca"
                                                className="p-1 text-slate-400 hover:text-emerald-600 rounded"
                                            >
                                                <CheckCheck className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => handleDelete(notification.id, e)}
                                            title="Hapus"
                                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
                        <Link
                            href={route('notifications.index')}
                            onClick={() => setIsOpen(false)}
                            className="text-xs font-semibold text-slate-700 hover:text-emerald-600 transition inline-flex items-center space-x-1"
                        >
                            <span>Lihat Semua Notifikasi</span>
                            <ExternalLink className="w-3 h-3" />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
