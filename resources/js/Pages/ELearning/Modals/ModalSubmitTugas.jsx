import React from 'react';
import { X, Send, FileText, Download, Award, CheckCircle2 } from 'lucide-react';

export default function ModalSubmitTugas({ 
    isOpen, 
    onClose, 
    assignment, 
    submitForm, 
    setSubmitForm, 
    handleSubmitAssignment, 
    isSubmitting = false 
}) {
    if (!isOpen || !assignment) return null;

    const mySub = assignment.my_submission;
    const isGraded = mySub && mySub.score !== null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden my-8">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center space-x-2.5">
                        <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#800020] flex items-center justify-center font-bold">
                            <Send className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">
                                Lembar Pengumpulan Tugas
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">
                                Upload berkas jawaban atau ketikkan penjelasan hasil pekerjaan
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Assignment Detail Box */}
                <div className="bg-[#FDF2F4]/60 p-4 border-b border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#800020] uppercase tracking-wider">
                            {assignment.subject_name} • {assignment.class_name}
                        </span>
                        <span className="text-[11px] text-slate-500 font-semibold">
                            Maks: {assignment.max_score} Poin
                        </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {assignment.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                        {assignment.instructions}
                    </p>

                    {assignment.attachment_path && (
                        <a 
                            href={`/storage/${assignment.attachment_path}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs font-semibold text-[#800020] hover:underline pt-1"
                        >
                            <Download className="w-3.5 h-3.5 mr-1" />
                            <span>Unduh Berkas Lampiran Soal Guru</span>
                        </a>
                    )}
                </div>

                {/* Teacher Evaluation Banner (If Graded) */}
                {isGraded && (
                    <div className="m-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold flex items-center">
                                <Award className="w-4 h-4 mr-1.5 text-emerald-600" />
                                Nilai Capaian Belajar:
                            </span>
                            <span className="text-base font-extrabold text-emerald-700">
                                {mySub.score} / {assignment.max_score}
                            </span>
                        </div>
                        {mySub.teacher_feedback && (
                            <p className="text-xs text-emerald-800 italic pt-1 border-t border-emerald-200/60 mt-1">
                                "{mySub.teacher_feedback}"
                            </p>
                        )}
                    </div>
                )}

                {/* Submission Form */}
                <form onSubmit={handleSubmitAssignment} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Unggah Berkas Jawaban (PDF, DOCX, Foto Pekerjaan)
                        </label>
                        <div className="border border-dashed border-slate-300 rounded-xl p-3 bg-slate-50/50 text-center">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={(e) => setSubmitForm({ ...submitForm, file: e.target.files[0] })}
                                className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#800020] file:text-white hover:file:bg-[#5C0017] cursor-pointer"
                            />
                            {mySub?.file_path && !submitForm.file && (
                                <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                                    Berkas jawaban sebelumnya telah tersimpan. Unggah berkas baru jika ingin mengganti.
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Catatan / Penjelasan Jawaban Siswa
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Tuliskan pesan atau catatan tambahan untuk guru..."
                            value={submitForm.student_notes}
                            onChange={(e) => setSubmitForm({ ...submitForm, student_notes: e.target.value })}
                            className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                        />
                    </div>

                    {/* Modal Footer */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-[#800020] hover:bg-[#5C0017] text-white font-semibold text-xs rounded-xl shadow-sm transition disabled:opacity-50"
                        >
                            {isSubmitting ? 'Mengirim Jawaban...' : mySub ? 'Perbarui Jawaban Saya' : 'Kumpulkan Tugas'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
