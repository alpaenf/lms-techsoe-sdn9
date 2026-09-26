import React, { useState, useEffect } from 'react';
import { X, Save, Calculator, AlertCircle, Award } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function ModalEditNilaiMapel({ isOpen, onClose, student, subject, existingGrade }) {
    if (!isOpen || !student || !subject) return null;

    const [tugasAvg, setTugasAvg] = useState(existingGrade?.tugas_avg ?? 85);
    const [utsScore, setUtsScore] = useState(existingGrade?.uts_score ?? 80);
    const [uasScore, setUasScore] = useState(existingGrade?.uas_score ?? 85);
    const [competencyDesc, setCompetencyDesc] = useState(
        existingGrade?.competency_desc || 
        `Menunjukkan penguasaan yang sangat baik dalam memahami konsep materi ${subject.name}.`
    );

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setTugasAvg(existingGrade?.tugas_avg ?? 85);
        setUtsScore(existingGrade?.uts_score ?? 80);
        setUasScore(existingGrade?.uas_score ?? 85);
        setCompetencyDesc(
            existingGrade?.competency_desc || 
            `Menunjukkan penguasaan yang sangat baik dalam memahami konsep materi ${subject.name}.`
        );
    }, [existingGrade, student, subject]);

    // Live calculate final score
    const t = parseFloat(tugasAvg) || 0;
    const ut = parseFloat(utsScore) || 0;
    const ua = parseFloat(uasScore) || 0;
    const finalScore = ((t * 0.30) + (ut * 0.30) + (ua * 0.40)).toFixed(2);

    const getLetterGrade = (score) => {
        const val = parseFloat(score);
        if (val >= 89) return { grade: 'A', label: 'Sangat Baik', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
        if (val >= 78) return { grade: 'B', label: 'Baik', color: 'bg-blue-100 text-blue-800 border-blue-200' };
        if (val >= 65) return { grade: 'C', label: 'Cukup', color: 'bg-amber-100 text-amber-800 border-amber-200' };
        return { grade: 'D', label: 'Perlu Bimbingan', color: 'bg-rose-100 text-rose-800 border-rose-200' };
    };

    const gradeInfo = getLetterGrade(finalScore);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);

        router.post(route('erapor.grades.save'), {
            student_id: student.id,
            subject_id: subject.id,
            tugas_avg: t,
            uts_score: ut,
            uas_score: ua,
            competency_desc: competencyDesc,
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
            <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-scale-up">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#800020] to-[#5C0017] p-5 text-white flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-2">
                            <Calculator className="w-5 h-5 text-rose-200" />
                            <h3 className="font-bold text-base">Input Nilai Formatif & Sumatif</h3>
                        </div>
                        <p className="text-xs text-rose-100 mt-1">
                            {student.full_name} &bull; <span className="font-semibold">{subject.name} ({subject.code})</span>
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
                    {/* Formula Info Pill */}
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-800 flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Bobot: Tugas (30%) + UTS (30%) + UAS (40%)</span>
                    </div>

                    {/* Inputs Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                                Rerata Tugas
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                required
                                value={tugasAvg}
                                onChange={(e) => setTugasAvg(e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm font-mono font-bold text-slate-900 focus:border-[#800020] focus:ring-[#800020] text-center"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                                Nilai UTS
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                required
                                value={utsScore}
                                onChange={(e) => setUtsScore(e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm font-mono font-bold text-slate-900 focus:border-[#800020] focus:ring-[#800020] text-center"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                                Nilai UAS
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                required
                                value={uasScore}
                                onChange={(e) => setUasScore(e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm font-mono font-bold text-slate-900 focus:border-[#800020] focus:ring-[#800020] text-center"
                            />
                        </div>
                    </div>

                    {/* Calculated NA & Predikat Card */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Nilai Akhir (NA)</p>
                            <p className="text-2xl font-black text-[#800020] font-mono">{finalScore}</p>
                        </div>

                        <div className="text-right">
                            <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Predikat</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${gradeInfo.color}`}>
                                {gradeInfo.grade} ({gradeInfo.label})
                            </span>
                        </div>
                    </div>

                    {/* Deskripsi Capaian Pembelajaran */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Capaian Pembelajaran (Deskripsi Rapor Kurikulum Merdeka)
                        </label>
                        <textarea
                            rows={3}
                            value={competencyDesc}
                            onChange={(e) => setCompetencyDesc(e.target.value)}
                            placeholder="Contoh: Menunjukkan penguasaan yang sangat baik dalam..."
                            className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 focus:border-[#800020] focus:ring-[#800020] leading-relaxed"
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
                            <span>{isSaving ? 'Menyimpan...' : 'Simpan Nilai'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
