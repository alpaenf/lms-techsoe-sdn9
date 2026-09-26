import React from 'react';
import { X, BookOpen, Upload, ExternalLink } from 'lucide-react';

export default function ModalMateri({ 
    isOpen, 
    onClose, 
    editingMaterial, 
    materialForm, 
    setMaterialForm, 
    handleSaveMaterial, 
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
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">
                                {editingMaterial ? 'Edit Bahan Ajar' : 'Publikasikan Bahan Ajar Baru'}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">
                                Tambahkan modul PDF, video interaktif, atau materi bacaan
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
                <form onSubmit={handleSaveMaterial} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Judul Bahan Ajar <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: Modul 01: Sistem Tata Surya & Karakteristik Planet"
                            value={materialForm.title}
                            onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
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
                                value={materialForm.subject_id}
                                onChange={(e) => setMaterialForm({ ...materialForm, subject_id: e.target.value })}
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
                                value={materialForm.class_id}
                                onChange={(e) => setMaterialForm({ ...materialForm, class_id: e.target.value })}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            >
                                <option value="">Pilih Kelas</option>
                                {classes.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Tipe Format Materi <span className="text-rose-500">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setMaterialForm({ ...materialForm, type: 'file' })}
                                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition flex flex-col items-center justify-center gap-1 ${
                                    materialForm.type === 'file' 
                                        ? 'bg-rose-50 border-[#800020] text-[#800020]' 
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <span>Dokumen PDF/File</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setMaterialForm({ ...materialForm, type: 'video_link' })}
                                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition flex flex-col items-center justify-center gap-1 ${
                                    materialForm.type === 'video_link' 
                                        ? 'bg-rose-50 border-[#800020] text-[#800020]' 
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <span>Link Video</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setMaterialForm({ ...materialForm, type: 'article' })}
                                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition flex flex-col items-center justify-center gap-1 ${
                                    materialForm.type === 'article' 
                                        ? 'bg-rose-50 border-[#800020] text-[#800020]' 
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <span>Artikel / Teks</span>
                            </button>
                        </div>
                    </div>

                    {materialForm.type === 'file' && (
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Berkas Modul (PDF / DOCX / PPT)
                            </label>
                            <div className="border border-dashed border-slate-300 rounded-xl p-3 bg-slate-50/50 text-center">
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                                    onChange={(e) => setMaterialForm({ ...materialForm, file: e.target.files[0] })}
                                    className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#800020] file:text-white hover:file:bg-[#5C0017] cursor-pointer"
                                />
                                {editingMaterial?.file_path && !materialForm.file && (
                                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                                        Berkas terpilih saat ini tersimpan di server.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {materialForm.type === 'video_link' && (
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Tautan URL Video (YouTube / Edukasi)
                            </label>
                            <input
                                type="url"
                                placeholder="https://www.youtube.com/watch?v=..."
                                value={materialForm.content_url}
                                onChange={(e) => setMaterialForm({ ...materialForm, content_url: e.target.value })}
                                className="w-full h-10 px-3.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Deskripsi / Ringkasan Materi
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Tuliskan ringkasan materi atau petunjuk membaca modul..."
                            value={materialForm.body_text}
                            onChange={(e) => setMaterialForm({ ...materialForm, body_text: e.target.value })}
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
                            {isSubmitting ? 'Simpan Data...' : editingMaterial ? 'Perbarui Bahan Ajar' : 'Simpan Bahan Ajar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
