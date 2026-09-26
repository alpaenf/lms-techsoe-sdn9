import React from 'react';
import { X, FileText } from 'lucide-react';

export default function ModalTugas({ 
    isOpen, 
    onClose, 
    editingAssignment, 
    assignmentForm, 
    setAssignmentForm, 
    handleSaveAssignment, 
    subjects = [], 
    classes = [], 
    isSubmitting = false 
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden my-8">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center space-x-2.5">
                        <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#800020] flex items-center justify-center font-bold">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">
                                {editingAssignment ? 'Edit Penugasan Digital' : 'Buat Penugasan / Asesmen Baru'}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">
                                Atur instruksi soal, tenggat waktu, dan lampiran lembar kerja
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

                {/* Modal Body */}
                <form onSubmit={handleSaveAssignment} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Judul Penugasan <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: Latihan Mandiri: Rangkaian Listrik Seri & Paralel"
                            value={assignmentForm.title}
                            onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                            className="w-full h-10 px-3.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Mata Pelajaran <span className="text-rose-500">*</span>
                            </label>
                            <select
                                required
                                value={assignmentForm.subject_id}
                                onChange={(e) => setAssignmentForm({ ...assignmentForm, subject_id: e.target.value })}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            >
                                <option value="">Pilih Mapel</option>
                                {subjects.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Sasaran Kelas <span className="text-rose-500">*</span>
                            </label>
                            <select
                                required
                                value={assignmentForm.class_id}
                                onChange={(e) => setAssignmentForm({ ...assignmentForm, class_id: e.target.value })}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            >
                                <option value="">Pilih Kelas</option>
                                {classes.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Batas Pengumpulkan (Deadline) <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                required
                                value={assignmentForm.due_date}
                                onChange={(e) => setAssignmentForm({ ...assignmentForm, due_date: e.target.value })}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Nilai Maksimal <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="10"
                                max="100"
                                required
                                value={assignmentForm.max_score}
                                onChange={(e) => setAssignmentForm({ ...assignmentForm, max_score: e.target.value })}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Instruksi Soal / Petunjuk Pengerjaan <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                            rows={3}
                            required
                            placeholder="Tuliskan petunjuk pengerjaan tugas secara rinci untuk siswa..."
                            value={assignmentForm.instructions}
                            onChange={(e) => setAssignmentForm({ ...assignmentForm, instructions: e.target.value })}
                            className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Lampiran Berkas Soal (Opsional)
                        </label>
                        <div className="border border-dashed border-slate-300 rounded-xl p-3 bg-slate-50/50 text-center">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.png"
                                onChange={(e) => setAssignmentForm({ ...assignmentForm, attachment: e.target.files[0] })}
                                className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#800020] file:text-white hover:file:bg-[#5C0017] cursor-pointer"
                            />
                        </div>
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
                            {isSubmitting ? 'Simpan Data...' : editingAssignment ? 'Perbarui Penugasan' : 'Publikasikan Tugas'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
