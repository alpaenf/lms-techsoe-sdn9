import React, { useEffect } from 'react';
import { X, BookOpen, Calendar, Clock, Layers, FileText, CheckCircle2 } from 'lucide-react';

export default function ModalJournal({
    isOpen,
    onClose,
    editingJournal,
    journalForm,
    setJournalForm,
    handleSaveJournal,
    subjects = [],
    classes = [],
    userRole = '',
    isSubmitting = false
}) {
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    const handleDateChange = (newDate) => {
        if (!newDate) {
            setJournalForm({ ...journalForm, journal_date: '' });
            return;
        }
        const d = new Date(newDate + 'T00:00:00');
        const dayName = !isNaN(d.getDay()) ? dayNames[d.getDay()] : 'Senin';
        setJournalForm({
            ...journalForm,
            journal_date: newDate,
            day_name: dayName
        });
    };

    useEffect(() => {
        if (isOpen) {
            if (!journalForm.subject_id && subjects.length > 0) {
                setJournalForm(prev => ({ ...prev, subject_id: String(subjects[0].id) }));
            }
            if (!journalForm.class_id && classes.length > 0) {
                setJournalForm(prev => ({ ...prev, class_id: String(classes[0].id) }));
            }
        }
    }, [isOpen, subjects, classes]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden my-8">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                    <div className="flex items-center space-x-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#800020] flex items-center justify-center font-bold shadow-sm border border-rose-100">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">
                                {editingJournal ? 'Edit Catatan Jurnal Harian' : 'Tambah Jurnal Mengajar Harian'}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">
                                Catat materi, aktivitas belajar, dan rekapitulasi kehadiran siswa
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        type="button"
                        className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSaveJournal} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    {/* Baris 1: Tanggal & Hari */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Tanggal Pelaksanaan <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={journalForm.journal_date}
                                onChange={(e) => handleDateChange(e.target.value)}
                                className="w-full h-10 px-3.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Hari
                            </label>
                            <div className="h-10 px-3.5 bg-slate-100 rounded-xl border border-slate-200 flex items-center text-xs font-bold text-slate-800">
                                {journalForm.day_name || 'Senin'}
                            </div>
                        </div>
                    </div>

                    {/* Baris 2: Mapel & Sasaran Kelas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Mata Pelajaran <span className="text-rose-500">*</span>
                            </label>
                            {subjects.length === 1 && !['admin', 'pimpinan'].includes(userRole) ? (
                                <div className="w-full h-10 px-3 rounded-xl border border-rose-200 bg-rose-50/70 flex items-center justify-between text-xs font-bold text-[#800020]">
                                    <span className="truncate">{subjects[0]?.name}</span>
                                    <span className="text-[10px] font-semibold text-[#800020] bg-white px-2 py-0.5 rounded-full border border-rose-200 shrink-0">
                                        Mapel Anda
                                    </span>
                                </div>
                            ) : (
                                <select
                                    required
                                    value={journalForm.subject_id}
                                    onChange={(e) => setJournalForm({ ...journalForm, subject_id: e.target.value })}
                                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                                >
                                    <option value="">Pilih Mata Pelajaran</option>
                                    {subjects.map((s) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Rombongan Belajar (Kelas) <span className="text-rose-500">*</span>
                            </label>
                            {classes.length === 1 && !['admin', 'pimpinan'].includes(userRole) ? (
                                <div className="w-full h-10 px-3 rounded-xl border border-rose-200 bg-rose-50/70 flex items-center justify-between text-xs font-bold text-[#800020]">
                                    <span className="truncate">{classes[0]?.name}</span>
                                    <span className="text-[10px] font-semibold text-[#800020] bg-white px-2 py-0.5 rounded-full border border-rose-200 shrink-0">
                                        Kelas Tetap
                                    </span>
                                </div>
                            ) : (
                                <select
                                    required
                                    value={journalForm.class_id}
                                    onChange={(e) => setJournalForm({ ...journalForm, class_id: e.target.value })}
                                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                                >
                                    <option value="">Pilih Rombel / Kelas</option>
                                    {classes.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>

                    {/* Baris 3: Jam Pelajaran */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Jam Mulai (WIB/WITA)
                            </label>
                            <input
                                type="time"
                                value={journalForm.start_time || ''}
                                onChange={(e) => setJournalForm({ ...journalForm, start_time: e.target.value })}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Jam Selesai (WIB/WITA)
                            </label>
                            <input
                                type="time"
                                value={journalForm.end_time || ''}
                                onChange={(e) => setJournalForm({ ...journalForm, end_time: e.target.value })}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            />
                        </div>
                    </div>

                    {/* Baris 4: Materi / Pokok Bahasan */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Pokok Bahasan / Materi yang Diberikan <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: Bab 2: Pecahan Senilai dan Operasi Hitung Dasar"
                            value={journalForm.material_topic}
                            onChange={(e) => setJournalForm({ ...journalForm, material_topic: e.target.value })}
                            className="w-full h-10 px-3.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                        />
                    </div>

                    {/* Baris 5: Aktivitas Pembelajaran */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Aktivitas Pembelajaran yang Dilakukan <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                            required
                            rows="3"
                            placeholder="Deskripsikan kegiatan pembuka, inti, dan penutup pembelajaran..."
                            value={journalForm.activity_description}
                            onChange={(e) => setJournalForm({ ...journalForm, activity_description: e.target.value })}
                            className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                        ></textarea>
                    </div>

                    {/* Baris 6: Media Pembelajaran & Catatan Presensi Siswa */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Media / Alat Pembelajaran
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: Buku Siswa, Alat Peraga, Proyektor"
                                value={journalForm.learning_media || ''}
                                onChange={(e) => setJournalForm({ ...journalForm, learning_media: e.target.value })}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Catatan Kehadiran Siswa
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: Hadir: 24, Sakit: 1, Izin: 0"
                                value={journalForm.attendance_notes || ''}
                                onChange={(e) => setJournalForm({ ...journalForm, attendance_notes: e.target.value })}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            />
                        </div>
                    </div>

                    {/* Baris 7: Catatan Kendala / Refleksi */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Catatan Refleksi / Kendala (Opsional)
                        </label>
                        <textarea
                            rows="2"
                            placeholder="Catat kendala siswa dalam memahami materi atau tindak lanjut pertemuan berikutnya..."
                            value={journalForm.notes || ''}
                            onChange={(e) => setJournalForm({ ...journalForm, notes: e.target.value })}
                            className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                        ></textarea>
                    </div>

                    {/* Modal Footer */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 rounded-xl bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold shadow-md shadow-rose-900/10 transition inline-flex items-center space-x-1.5 disabled:opacity-50"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{editingJournal ? 'Simpan Perubahan' : 'Terbitkan Jurnal'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
