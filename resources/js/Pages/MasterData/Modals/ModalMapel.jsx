import React from 'react';
import { X, Save } from 'lucide-react';

export default function ModalMapel({
    isOpen,
    onClose,
    editingSubject,
    subjectForm,
    setSubjectForm,
    handleSaveSubject,
    isSubmitting
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-scale-up">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">
                        {editingSubject ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSaveSubject} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Kode Mata Pelajaran *
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: BIN-SD, MAT-SD, MLK-TOR"
                            value={subjectForm.code}
                            onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value.toUpperCase() })}
                            className="w-full h-10 px-3.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Nama Resmi Mata Pelajaran *
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: Bahasa Indonesia, Matematika"
                            value={subjectForm.name}
                            onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                            className="w-full h-10 px-3.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Kategori Kurikulum *
                        </label>
                        <select
                            value={subjectForm.category}
                            onChange={(e) => setSubjectForm({ ...subjectForm, category: e.target.value })}
                            className="w-full h-10 px-3.5 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                        >
                            <option value="wajib">Wajib Nasional</option>
                            <option value="muatan_lokal">Muatan Lokal (Mulok)</option>
                            <option value="pilihan">Pilihan / Ekstrakurikuler</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Standar Nilai KKM *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            required
                            value={subjectForm.kkm}
                            onChange={(e) => setSubjectForm({ ...subjectForm, kkm: parseFloat(e.target.value) })}
                            className="w-full h-10 px-3.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                        />
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2 rounded-xl bg-[#800020] hover:bg-[#5C0017] disabled:opacity-50 text-white text-xs font-bold shadow-sm transition inline-flex items-center space-x-1.5"
                        >
                            <Save className="w-3.5 h-3.5" />
                            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Mapel'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
