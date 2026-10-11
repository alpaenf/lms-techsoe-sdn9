import React, { useState, useEffect } from 'react';
import { Bell, Clock, School, BookOpen, X, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from '@inertiajs/react';
import axios from 'axios';

export default function ScheduleReminderToast({ role }) {
    // Only active for teacher roles
    if (role !== 'guru' && role !== 'guru_mapel') {
        return null;
    }

    const [activeReminder, setActiveReminder] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    const checkReminders = async () => {
        try {
            const response = await axios.get(route('schedules.reminders.check'), {
                headers: { 'Accept': 'application/json' },
            });

            if (response.data && response.data.reminders && response.data.reminders.length > 0) {
                const todayStr = new Date().toISOString().split('T')[0];

                // Find first reminder not dismissed in sessionStorage
                const available = response.data.reminders.find((rem) => {
                    const dismissKey = `dismissed_sched_toast_${rem.id}_${todayStr}`;
                    const snoozeUntil = sessionStorage.getItem(`snooze_sched_toast_${rem.id}`);
                    if (snoozeUntil && Date.now() < Number(snoozeUntil)) {
                        return false;
                    }
                    return !sessionStorage.getItem(dismissKey);
                });

                if (available) {
                    setActiveReminder(available);
                    setIsVisible(true);
                }
            }
        } catch (error) {
            console.error('Error checking schedule reminders:', error);
        }
    };

    useEffect(() => {
        // Initial check after 3 seconds
        const timeout = setTimeout(checkReminders, 3000);

        // Periodic poll every 50 seconds
        const interval = setInterval(checkReminders, 50000);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, []);

    const handleDismiss = () => {
        if (!activeReminder) return;
        const todayStr = new Date().toISOString().split('T')[0];
        sessionStorage.setItem(`dismissed_sched_toast_${activeReminder.id}_${todayStr}`, 'true');
        setIsVisible(false);
    };

    const handleSnooze = () => {
        if (!activeReminder) return;
        // Snooze for 5 minutes
        sessionStorage.setItem(`snooze_sched_toast_${activeReminder.id}`, String(Date.now() + 5 * 60 * 1000));
        setIsVisible(false);
    };

    if (!isVisible || !activeReminder) {
        return null;
    }

    const isOngoing = activeReminder.status === 'ongoing';

    return (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-slide-up transition-all">
            <div className={`p-4.5 rounded-2xl shadow-2xl border backdrop-blur-md ${
                isOngoing
                    ? 'bg-emerald-950/90 text-white border-emerald-500/50 shadow-emerald-900/30'
                    : 'bg-slate-900/90 text-white border-rose-500/40 shadow-slate-950/40'
            }`}>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-2.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
                            isOngoing ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                            <Bell className="w-5 h-5 animate-bounce" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold tracking-wider uppercase opacity-75">
                                {isOngoing ? 'Sedang Berlangsung' : 'Pengingat Jadwal Mengajar'}
                            </span>
                            <h4 className="text-sm font-black leading-snug">
                                {activeReminder.subject_name}
                            </h4>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleDismiss}
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
                        title="Tutup pengingat"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Info Details */}
                <div className="mt-3 pt-2.5 border-t border-white/10 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-200">
                        <span className="flex items-center gap-1.5 opacity-85">
                            <School className="w-3.5 h-3.5" />
                            <span>{activeReminder.class_name}</span>
                        </span>
                        <span className="flex items-center gap-1 font-mono font-bold text-amber-300">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{activeReminder.start_time} - {activeReminder.end_time}</span>
                        </span>
                    </div>

                    {activeReminder.room && (
                        <p className="text-[11px] text-slate-300 opacity-80 pl-5">
                            Ruangan: {activeReminder.room}
                        </p>
                    )}

                    <div className="pt-1 text-[11px] font-medium text-emerald-300">
                        {activeReminder.status_label}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-3.5 pt-2.5 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
                    <button
                        type="button"
                        onClick={handleSnooze}
                        className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition text-[11px] font-semibold"
                    >
                        Nanti (5 mnt)
                    </button>

                    <div className="flex items-center space-x-1.5">
                        <Link
                            href={route('presensi.index')}
                            onClick={() => setIsVisible(false)}
                            className="px-3 py-1.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs transition shadow-sm flex items-center space-x-1"
                        >
                            <span>Buka Presensi</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
