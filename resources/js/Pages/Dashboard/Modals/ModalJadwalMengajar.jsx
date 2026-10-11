import React, { useState, useEffect } from 'react';
import { X, Save, Clock, BookOpen, School, Calendar, FileText, Trash2, AlertCircle } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function ModalJadwalMengajar({
    isOpen,
    onClose,
    schedule = null,
    availableClasses = [],
    availableSubjects = [],
    todayDay = 'Senin',
    onSuccess,
}) {
    if (!isOpen) return null;

    const daysList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

    const [form, setForm] = useState({
        day_of_week: todayDay || 'Senin',
        class_id: availableClasses[0]?.id || '',
        subject_id: availableSubjects[0]?.id || '',
        start_time: '07:30',
        end_time: '09:00',
        room: '',
        notes: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (schedule) {
            setForm({
                day_of_week: schedule.day_of_week || 'Senin',
                class_id: schedule.class_id || availableClasses[0]?.id || '',
                subject_id: schedule.subject_id || availableSubjects[0]?.id || '',
                start_time: schedule.start_time ? schedule.start_time.substring(0, 5) : '07:30',
                end_time: schedule.end_time ? schedule.end_time.substring(0, 5) : '09:00',
                room: schedule.room || '',
                notes: schedule.notes || '',
            });
        } else {
            setForm({
                day_of_week: todayDay && daysList.includes(todayDay) ? todayDay : 'Senin',
                class_id: availableClasses[0]?.id || '',
                subject_id: availableSubjects[0]?.id || '',
                start_time: '07:30',
                end_time: '09:00',
                room: '',
                notes: '',
            });
        }
        setErrors({});
    }, [schedule, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        if (schedule) {
            router.put(route('schedules.update', schedule.id), form, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    if (onSuccess) onSuccess('Jadwal mengajar berhasil diperbarui.');
                    onClose();
                },
                onError: (errs) => {
                    setIsSubmitting(false);
                    setErrors(errs);
                },
            });
        } else {
            router.post(route('schedules.store'), form, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    if (onSuccess) onSuccess('Jadwal mengajar baru berhasil ditambahkan.');
                    onClose();
                },
                onError: (errs) => {
                    setIsSubmitting(false);
                    setErrors(errs);
                },
            });
        }
    };

    const handleDelete = () => {
        if (!schedule) return;
        if (!confirm('Apakah Anda yakin ingin menghapus jadwal mengajar ini?')) return;

        setIsSubmitting(true);
        router.delete(route('schedules.destroy', schedule.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                if (onSuccess) onSuccess('Jadwal mengajar berhasil dihapus.');
                onClose();
            },
            onError: (errs) => {
                setIsSubmitting(false);
                setErrors(errs);
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-scale-up">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">
                            {schedule ? 'Edit Jadwal Mengajar' : 'Tambah Jadwal Mengajar Guru'}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            Atur jadwal pelajaran reguler mingguan untuk mendapatkan reminder otomatis.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Error Alert */}
                    {Object.keys(errors).length > 0 && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
                            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                            <div className="space-y-0.5">
                                {Object.values(errors).map((err, i) => (
                                    <div key={i}>{err}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Hari */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>Hari Mengajar *</span>
                        </label>
                        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                            {daysList.map((day) => (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => setForm({ ...form, day_of_week: day })}
                                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition border ${
                                        form.day_of_week === day
                                            ? 'bg-[#800020] text-white border-[#800020] shadow-sm'
                                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mata Pelajaran & Kelas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                                <span>Mata Pelajaran *</span>
                            </label>
                            <select
                                required
                                value={form.subject_id}
                                onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
                                className="w-full h-10 px-3 bg-white rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            >
                                <option value="" disabled>Pilih Mata Pelajaran</option>
                                {availableSubjects.map((sb) => (
                                    <option key={sb.id} value={sb.id}>
                                        {sb.name} ({sb.code})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                                <School className="w-3.5 h-3.5 text-slate-400" />
                                <span>Kelas / Rombel *</span>
                            </label>
                            <select
                                required
                                value={form.class_id}
                                onChange={(e) => setForm({ ...form, class_id: e.target.value })}
                                className="w-full h-10 px-3 bg-white rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            >
                                <option value="" disabled>Pilih Rombel</option>
                                {availableClasses.map((cls) => (
                                    <option key={cls.id} value={cls.id}>
                                        {cls.name} (Tingkat {cls.grade_level})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Jam Mulai & Jam Selesai */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span>Jam Mulai *</span>
                            </label>
                            <input
                                type="time"
                                required
                                value={form.start_time}
                                onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span>Jam Selesai *</span>
                            </label>
                            <input
                                type="time"
                                required
                                value={form.end_time}
                                onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            />
                        </div>
                    </div>

                    {/* Ruangan & Catatan */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Ruangan / Tempat Mengajar (Opsional)
                        </label>
                        <input
                            type="text"
                            placeholder="Contoh: Ruang Kelas 1A, Lapangan, Lab Komputer"
                            value={form.room}
                            onChange={(e) => setForm({ ...form, room: e.target.value })}
                            className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                            <span>Catatan / Topik Ajar (Opsional)</span>
                        </label>
                        <textarea
                            rows={2}
                            placeholder="Catatan persiapan ajar, bab/materi pembelajaran, atau media yang dibawa..."
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                        />
                    </div>

                    {/* Footer Buttons */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                        {schedule ? (
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isSubmitting}
                                className="px-3 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition flex items-center gap-1.5"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Hapus</span>
                            </button>
                        ) : (
                            <div />
                        )}

                        <div className="flex items-center space-x-2">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#6b001a] text-white text-xs font-bold shadow-sm transition flex items-center space-x-1.5 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Jadwal'}</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
