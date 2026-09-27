import React, { useState } from 'react';
import { X, Save, AlertTriangle, ShieldAlert, Calendar } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function ModalPelanggaran({ isOpen, onClose, students = [] }) {
    if (!isOpen) return null;

    const [studentId, setStudentId] = useState(students[0]?.id || '');
    const [violationDate, setViolationDate] = useState(new Date().toISOString().split('T')[0]);
    const [violationName, setViolationName] = useState('');
    const [penaltyPoints, setPenaltyPoints] = useState(5);
    const [sanctionAction, setSanctionAction] = useState('');
    const [callLetterSent, setCallLetterSent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post(route('bk.violations.store'), {
            student_id: studentId,
            violation_date: violationDate,
            violation_name: violationName,
            penalty_points: penaltyPoints,
            sanction_action: sanctionAction,
            call_letter_sent: callLetterSent,
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
                            <AlertTriangle className="w-5 h-5 text-rose-200" />
                            <h3 className="font-bold text-base">Catat Pelanggaran Kedisiplinan</h3>
                        </div>
                        <p className="text-xs text-rose-100 mt-1">
                            Pencatatan Poin Sanksi & Tindakan Pembinaan Siswa
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
                            Pilih Peserta Didik
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

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Tanggal Kejadian
                            </label>
                            <input
                                type="date"
                                required
                                value={violationDate}
                                onChange={(e) => setViolationDate(e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Bobot Poin Pelanggaran
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                required
                                value={penaltyPoints}
                                onChange={(e) => setPenaltyPoints(e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-bold font-mono text-slate-900 focus:border-[#800020] focus:ring-[#800020] text-center"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Uraian Pelanggaran Kedisiplinan
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: Terlambat masuk kelas 20 menit tanpa surat izin..."
                            value={violationName}
                            onChange={(e) => setViolationName(e.target.value)}
                            className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Tindakan Pembinaan / Sanksi Edutainment
                        </label>
                        <textarea
                            rows={3}
                            required
                            placeholder="Contoh: Teguran lisan, membaca buku di perpustakaan..."
                            value={sanctionAction}
                            onChange={(e) => setSanctionAction(e.target.value)}
                            className="w-full p-3.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:border-[#800020] focus:ring-[#800020] leading-relaxed"
                        />
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                        <input
                            type="checkbox"
                            id="call_letter_sent"
                            checked={callLetterSent}
                            onChange={(e) => setCallLetterSent(e.target.checked)}
                            className="rounded text-[#800020] focus:ring-[#800020]"
                        />
                        <label htmlFor="call_letter_sent" className="text-xs text-slate-700 font-medium">
                            Kirim Surat Pemanggilan Orang Tua / Wali Murid
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
                            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Pelanggaran'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
