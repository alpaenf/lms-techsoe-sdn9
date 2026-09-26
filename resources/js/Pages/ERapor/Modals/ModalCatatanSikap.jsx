import React, { useState, useEffect } from 'react';
import { X, Save, MessageSquare, Award } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function ModalCatatanSikap({ isOpen, onClose, student, existingEvaluation }) {
    if (!isOpen || !student) return null;

    const [attitudeScore, setAttitudeScore] = useState(existingEvaluation?.attitude_score || 'Baik');
    const [homeroomNotes, setHomeroomNotes] = useState(
        existingEvaluation?.homeroom_notes || 
        'Menunjukkan perkembangan akademis yang memuaskan, aktif dalam kegiatan pembelajaran serta bersikap sopan dan santun.'
    );
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setAttitudeScore(existingEvaluation?.attitude_score || 'Baik');
        setHomeroomNotes(
            existingEvaluation?.homeroom_notes || 
            'Menunjukkan perkembangan akademis yang memuaskan, aktif dalam kegiatan pembelajaran serta bersikap sopan dan santun.'
        );
    }, [existingEvaluation, student]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);

        router.post(route('erapor.evaluation.save'), {
            student_id: student.id,
            attitude_score: attitudeScore,
            homeroom_notes: homeroomNotes,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSaving(false);
                onClose();
            },
            onError: () => {
                setIsSaving(false);
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
                            <MessageSquare className="w-5 h-5 text-rose-200" />
                            <h3 className="font-bold text-base">Nilai Sikap & Catatan Wali Kelas</h3>
                        </div>
                        <p className="text-xs text-rose-100 mt-1 font-medium">
                            {student.full_name} (NISN: {student.nisn})
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
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Attitude Score Choice */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Nilai Sikap / Karakter (Profil Pelajar Pancasila)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {['Sangat Baik', 'Baik', 'Cukup', 'Kurang'].map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => setAttitudeScore(opt)}
                                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                                        attitudeScore === opt
                                            ? 'bg-[#800020] text-white border-[#800020] shadow-sm'
                                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                    <Award className="w-3.5 h-3.5" />
                                    <span>{opt}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Homeroom Notes */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Catatan Wali Kelas
                        </label>
                        <textarea
                            rows={4}
                            value={homeroomNotes}
                            onChange={(e) => setHomeroomNotes(e.target.value)}
                            placeholder="Tuliskan apresiasi, motivasi, dan perkembangan peserta didik..."
                            className="w-full p-3.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:border-[#800020] focus:ring-[#800020] leading-relaxed"
                        />
                    </div>

                    {/* Buttons */}
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
                            disabled={isSaving}
                            className="px-5 py-2 bg-[#800020] hover:bg-[#5C0017] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition inline-flex items-center space-x-1.5"
                        >
                            <Save className="w-4 h-4" />
                            <span>{isSaving ? 'Menyimpan...' : 'Simpan Catatan'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
