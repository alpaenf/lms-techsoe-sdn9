import React from 'react';
import { X, ChevronDown, Save } from 'lucide-react';

export default function ModalRombel({ 
    isOpen, 
    onClose, 
    editingClass, 
    rombelForm, 
    setRombelForm, 
    handleSaveRombel, 
    teachers, 
    isSubmitting 
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-scale-up">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">
                        {editingClass ? 'Edit Rombongan Belajar' : 'Tambah Rombongan Belajar'}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSaveRombel} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Nama Rombongan Belajar *
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: Kelas 1A, Kelas 1B, Kelas 6"
                            value={rombelForm.name}
                            onChange={(e) => setRombelForm({ ...rombelForm, name: e.target.value })}
                            className="w-full h-10 px-3.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Tingkat Jenjang (Grade Level) *
                        </label>
                        <div className="relative">
                            <select
                                value={rombelForm.grade_level}
                                onChange={(e) => setRombelForm({ ...rombelForm, grade_level: parseInt(e.target.value) })}
                                className="w-full h-10 pl-3.5 pr-9 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-[#800020] focus:ring-[#800020] appearance-none cursor-pointer"
                            >
                                <option value={1}>Tingkat 1 (Satu)</option>
                                <option value={2}>Tingkat 2 (Dua)</option>
                                <option value={3}>Tingkat 3 (Tiga)</option>
                                <option value={4}>Tingkat 4 (Empat)</option>
                                <option value={5}>Tingkat 5 (Lima)</option>
                                <option value={6}>Tingkat 6 (Enam)</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Wali Kelas (Homeroom Teacher)
                        </label>
                        <div className="relative">
                            <select
                                value={rombelForm.homeroom_teacher_id}
                                onChange={(e) => setRombelForm({ ...rombelForm, homeroom_teacher_id: e.target.value })}
                                className="w-full h-10 pl-3.5 pr-9 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-[#800020] focus:ring-[#800020] appearance-none cursor-pointer"
                            >
                                <option value="">-- Pilih Wali Kelas --</option>
                                {teachers && teachers.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.full_name} ({t.employment_status || 'Guru'})
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
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
                            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Rombel'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
