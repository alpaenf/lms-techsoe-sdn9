import React, { useState } from 'react';
import {
    Calendar,
    Clock,
    Plus,
    Edit,
    CheckCircle2,
    AlertCircle,
    BookOpen,
    School,
    MapPin,
    ChevronRight,
    Users,
    ClipboardCheck,
    Layers,
    Sparkles
} from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function TeacherScheduleWidget({
    teachingSchedules = [],
    todayDay = 'Senin',
    onAddSchedule,
    onEditSchedule,
}) {
    const daysList = ['Hari Ini', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu', 'Semua'];
    const [selectedTab, setSelectedTab] = useState('Hari Ini');

    // Filter schedules according to tab
    const filteredSchedules = teachingSchedules.filter((item) => {
        if (selectedTab === 'Hari Ini') {
            return item.day_of_week === todayDay;
        }
        if (selectedTab === 'Semua') {
            return true;
        }
        return item.day_of_week === selectedTab;
    });

    // Count today's schedule
    const todayCount = teachingSchedules.filter(s => s.day_of_week === todayDay).length;

    // Determine current time
    const now = new Date();
    const timeFormatter = new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    const currentTimeStr = timeFormatter.format(now).replace('.', ':');

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            {/* Widget Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-white via-slate-50/50 to-rose-50/20">
                <div className="flex items-start space-x-3.5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#800020] to-[#5C0017] text-white flex items-center justify-center shadow-sm shadow-[#800020]/20 shrink-0">
                        <Calendar className="w-5 h-5 text-rose-100" />
                    </div>
                    <div>
                        <div className="flex items-center space-x-2">
                            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                                Jadwal Mengajar Guru
                            </h2>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#800020]/10 text-[#800020] border border-[#800020]/20">
                                {todayCount} Kelas Hari Ini ({todayDay})
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Pengingat jam pelajaran kelas otomatis dengan link aksi cepat presensi & materi.
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                    <button
                        type="button"
                        onClick={onAddSchedule}
                        className="px-3.5 py-2 rounded-xl bg-[#800020] hover:bg-[#6b001a] text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-sm shadow-[#800020]/20"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Jadwal</span>
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="px-5 pt-3 border-b border-slate-100 overflow-x-auto scrollbar-none flex items-center gap-1.5">
                {daysList.map((tab) => {
                    const isActive = selectedTab === tab;
                    let count = 0;
                    if (tab === 'Hari Ini') {
                        count = todayCount;
                    } else if (tab === 'Semua') {
                        count = teachingSchedules.length;
                    } else {
                        count = teachingSchedules.filter(s => s.day_of_week === tab).length;
                    }

                    return (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setSelectedTab(tab)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center space-x-1.5 ${
                                isActive
                                    ? 'bg-[#800020] text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            <span>{tab}</span>
                            <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                                isActive
                                    ? 'bg-white/20 text-white'
                                    : 'bg-slate-200/70 text-slate-600'
                            }`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Schedule Cards Body */}
            <div className="p-5 sm:p-6">
                {filteredSchedules.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                        {filteredSchedules.map((schedule) => {
                            const isToday = schedule.day_of_week === todayDay;
                            const isOngoing = schedule.status === 'ongoing';
                            const isUpcoming = schedule.status === 'upcoming';
                            const isCompleted = schedule.status === 'completed';

                            return (
                                <div
                                    key={schedule.id}
                                    className={`relative rounded-2xl p-5 sm:p-6 border transition-all duration-200 flex flex-col justify-between group shadow-2xs hover:shadow-sm ${
                                        isOngoing
                                            ? 'bg-emerald-50/40 border-emerald-300 shadow-sm shadow-emerald-500/10 ring-1 ring-emerald-400'
                                            : isUpcoming && isToday
                                            ? 'bg-amber-50/40 border-amber-300 shadow-xs'
                                            : 'bg-white hover:bg-slate-50/60 border-slate-200/80'
                                    }`}
                                >
                                    <div>
                                        {/* Top Bar: Day / Status */}
                                        <div className="flex items-center justify-between gap-2 mb-3.5">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                                    {schedule.day_of_week}
                                                </span>
                                                {isToday && (
                                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 ${
                                                        isOngoing
                                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                                            : isUpcoming
                                                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                                                    }`}>
                                                        {isOngoing && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping mr-0.5" />}
                                                        <span>{schedule.status_label || (isOngoing ? 'Sedang Berlangsung' : isUpcoming ? 'Akan Datang' : 'Selesai')}</span>
                                                    </span>
                                                )}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => onEditSchedule(schedule)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-[#800020] hover:bg-rose-50 transition opacity-80 group-hover:opacity-100 cursor-pointer"
                                                title="Edit Jadwal"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Time badge */}
                                        <div className="mb-3">
                                            <div className="inline-flex items-center space-x-1.5 font-mono font-black text-sm text-[#800020] bg-rose-50/70 border border-[#800020]/15 px-3 py-1.5 rounded-xl">
                                                <Clock className="w-4 h-4 text-[#800020]" />
                                                <span>{schedule.start_time_formatted || schedule.start_time?.substring(0, 5)} - {schedule.end_time_formatted || schedule.end_time?.substring(0, 5)}</span>
                                            </div>
                                        </div>

                                        {/* Subject Title */}
                                        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#800020] transition line-clamp-1 leading-snug">
                                            {schedule.subject_name}
                                        </h3>
                                        <p className="text-xs font-mono text-slate-400 mt-1">
                                            Kode: {schedule.subject_code}
                                        </p>

                                        {/* Class & Room details */}
                                        <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2 text-xs">
                                            <div className="flex items-center text-slate-700">
                                                <School className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                                                <span className="font-bold text-slate-900 text-sm">{schedule.class_name}</span>
                                                <span className="text-xs text-slate-500 ml-2">(Tingkat {schedule.grade_level})</span>
                                            </div>

                                            {schedule.room && (
                                                <div className="flex items-center text-slate-600 text-xs">
                                                    <MapPin className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                                                    <span>{schedule.room}</span>
                                                </div>
                                            )}

                                            {schedule.notes && (
                                                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 line-clamp-2 mt-2 leading-relaxed">
                                                    {schedule.notes}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action buttons footer */}
                                    <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2.5">
                                        <Link
                                            href={route('presensi.index')}
                                            className="flex-1 justify-center px-3 py-2 rounded-xl bg-slate-100 hover:bg-[#800020] hover:text-white text-slate-700 text-xs font-bold transition flex items-center space-x-1.5"
                                            title="Buka Presensi Siswa"
                                        >
                                            <ClipboardCheck className="w-4 h-4" />
                                            <span>Presensi</span>
                                        </Link>

                                        <Link
                                            href={route('elearning.index')}
                                            className="flex-1 justify-center px-3 py-2 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-bold transition flex items-center space-x-1.5"
                                            title="Buka Materi & Modul Ajar"
                                        >
                                            <BookOpen className="w-4 h-4" />
                                            <span>Bahan Ajar</span>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-10 px-4 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#800020] flex items-center justify-center mb-3">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-800">
                            {selectedTab === 'Hari Ini'
                                ? `Belum Ada Jadwal Mengajar untuk Hari Ini (${todayDay})`
                                : `Belum Ada Jadwal Mengajar untuk ${selectedTab}`
                            }
                        </h4>
                        <p className="text-xs text-slate-500 max-w-sm mt-1">
                            Tambahkan jadwal pelajaran Anda agar sistem dapat memberikan notifikasi pengingat otomatis sebelum jam mengajar dimulai.
                        </p>
                        <button
                            type="button"
                            onClick={onAddSchedule}
                            className="mt-4 px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#6b001a] text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Atur Jadwal Pelajaran</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
