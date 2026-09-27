import React, { useState } from 'react';
import { X, Save, Calendar, CheckCircle2 } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function ModalTahunAjaran({ isOpen, onClose }) {
    if (!isOpen) return null;

    const [name, setName] = useState('2027/2028');
    const [semester, setSemester] = useState('ganjil');
    const [startDate, setStartDate] = useState('2027-07-15');
    const [endDate, setEndDate] = useState('2027-12-20');
    const [isActive, setIsActive] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post(route('kelembagaan.academic-years.store'), {
            name,
            semester,
            start_date: startDate,
            end_date: endDate,
            is_active: isActive,
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
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-scale-up">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#800020] to-[#5C0017] p-5 text-white flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-2">
                            <Calendar className="w-5 h-5 text-rose-200" />
                            <h3 className="font-bold text-base">Tambah Tahun Ajaran Baru</h3>
                        </div>
                        <p className="text-xs text-rose-100 mt-1 font-medium">
                            Konfigurasi Kalender Akademik Sekolah
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
                            Tahun Ajaran (Format: YYYY/YYYY)
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: 2027/2028"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Semester Akademik
                        </label>
                        <select
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                            className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                        >
                            <option value="ganjil">Semester Ganjil</option>
                            <option value="genap">Semester Genap</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Tanggal Mulai
                            </label>
                            <input
                                type="date"
                                required
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Tanggal Selesai
                            </label>
                            <input
                                type="date"
                                required
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="rounded text-[#800020] focus:ring-[#800020]"
                        />
                        <label htmlFor="is_active" className="text-xs text-slate-700 font-medium">
                            Set sebagai Tahun Ajaran Aktif Berjalan
                        </label>
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
                            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Tahun Ajaran'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
