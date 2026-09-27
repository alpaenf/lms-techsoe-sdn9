import React, { useState } from 'react';
import { X, Save, HeartHandshake, Calendar, User, FileText, Lock } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function ModalSesiKonseling({ isOpen, onClose, students = [], counselors = [] }) {
    if (!isOpen) return null;

    const [studentId, setStudentId] = useState(students[0]?.id || '');
    const [counselorId, setCounselorId] = useState(counselors[0]?.id || '');
    const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
    const [topic, setTopic] = useState('');
    const [actionPlan, setActionPlan] = useState('');
    const [isConfidential, setIsConfidential] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post(route('bk.sessions.store'), {
            student_id: studentId,
            counselor_id: counselorId,
            session_date: sessionDate,
            topic,
            action_plan: actionPlan,
            is_confidential: isConfidential,
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
                            <HeartHandshake className="w-5 h-5 text-rose-200" />
                            <h3 className="font-bold text-base">Tambah Catatan Sesi Konseling</h3>
                        </div>
                        <p className="text-xs text-rose-100 mt-1">
                            Bimbingan Konseling Ramah Anak & Rahasia
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
                                Tanggal Bimbingan
                            </label>
                            <input
                                type="date"
                                required
                                value={sessionDate}
                                onChange={(e) => setSessionDate(e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Guru BK / Pembimbing
                            </label>
                            <select
                                value={counselorId}
                                onChange={(e) => setCounselorId(e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            >
                                {counselors.map(c => (
                                    <option key={c.id} value={c.id}>{c.full_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Topik Bimbingan & Konseling
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: Konsultasi Kesulitan Belajar Matematika..."
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Rencana Tindak Lanjut / Solusi
                        </label>
                        <textarea
                            rows={3}
                            required
                            placeholder="Tuliskan rekomendasi dan kesepakatan tindak lanjut..."
                            value={actionPlan}
                            onChange={(e) => setActionPlan(e.target.value)}
                            className="w-full p-3.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:border-[#800020] focus:ring-[#800020] leading-relaxed"
                        />
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                        <input
                            type="checkbox"
                            id="is_confidential"
                            checked={isConfidential}
                            onChange={(e) => setIsConfidential(e.target.checked)}
                            className="rounded text-[#800020] focus:ring-[#800020]"
                        />
                        <label htmlFor="is_confidential" className="text-xs text-slate-700 font-medium">
                            Bersifat Rahasia (Hanya Konselor & Guru BK yang dapat melihat)
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
                            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Sesi BK'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
