import React, { useState } from 'react';
import { X, Save, Award, Trophy, Calendar } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function ModalPrestasi({ isOpen, onClose, students = [] }) {
    if (!isOpen) return null;

    const [studentId, setStudentId] = useState(students[0]?.id || '');
    const [title, setTitle] = useState('');
    const [level, setLevel] = useState('kabupaten');
    const [rank, setRank] = useState('Juara 1');
    const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post(route('bk.achievements.store'), {
            student_id: studentId,
            title,
            level,
            rank,
            event_date: eventDate,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                onClose();
            },
            onError: () => {
                setIsSubmitting(false);
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-scale-up">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#800020] to-[#5C0017] p-5 text-white flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-2">
                            <Trophy className="w-5 h-5 text-amber-300" />
                            <h3 className="font-bold text-base">Input Galeri Prestasi Siswa</h3>
                        </div>
                        <p className="text-xs text-rose-100 mt-1">
                            Pencatatan Kebanggaan Prestasi Akademik & Non-Akademik
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Pilih Peserta Didik Berprestasi
                        </label>
                        <select
                            required
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                        >
                            {students.map(s => (
                                <option key={s.id} value={s.id}>{s.full_name} (NISN: {s.nisn})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Nama Kompetisi / Kejuaraan
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: Juara 1 Olimpiade Sains Nasional (OSN) IPA..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Tingkat Kejuaraan
                            </label>
                            <select
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            >
                                <option value="sekolah">Tingkat Sekolah</option>
                                <option value="kecamatan">Tingkat Kecamatan</option>
                                <option value="kabupaten">Tingkat Kabupaten</option>
                                <option value="provinsi">Tingkat Provinsi</option>
                                <option value="nasional">Tingkat Nasional</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Peringkat / Raian
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Contoh: Juara 1, Medali Emas..."
                                value={rank}
                                onChange={(e) => setRank(e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Tanggal Pelaksanaan
                        </label>
                        <input
                            type="date"
                            required
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                        />
                    </div>

                    {/* Submit buttons */}
                    <div className="pt-2 flex items-center justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2 bg-[#800020] hover:bg-[#5C0017] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition inline-flex items-center space-x-1.5"
                        >
                            <Save className="w-4 h-4" />
                            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Prestasi'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
