import React from 'react';
import { X, ChevronDown, Save } from 'lucide-react';

export default function ModalSiswa({
    isOpen,
    onClose,
    editingStudent,
    studentForm,
    setStudentForm,
    handleSaveStudent,
    classes,
    isSubmitting
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-scale-up">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">
                        {editingStudent ? 'Edit Data Peserta Didik' : 'Tambah Peserta Didik Baru'}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSaveStudent} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Nama Lengkap Siswa *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Nama sesuai akta kelahiran"
                                value={studentForm.full_name}
                                onChange={(e) => setStudentForm({ ...studentForm, full_name: e.target.value })}
                                className="w-full h-10 px-3.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                NISN (10 Digit) *
                            </label>
                            <input
                                type="text"
                                required
                                maxLength={10}
                                placeholder="008xxxxxxx"
                                value={studentForm.nisn}
                                onChange={(e) => setStudentForm({ ...studentForm, nisn: e.target.value })}
                                className="w-full h-10 px-3.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                NIS Lokal *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="2026001"
                                value={studentForm.nis}
                                onChange={(e) => setStudentForm({ ...studentForm, nis: e.target.value })}
                                className="w-full h-10 px-3.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Rombongan Belajar (Kelas) *
                            </label>
                            <div className="relative">
                                <select
                                    value={studentForm.class_id}
                                    onChange={(e) => setStudentForm({ ...studentForm, class_id: e.target.value })}
                                    className="w-full h-10 pl-3.5 pr-9 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-[#800020] focus:ring-[#800020] appearance-none cursor-pointer"
                                >
                                    {classes && classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Jenis Kelamin *
                            </label>
                            <div className="relative">
                                <select
                                    value={studentForm.gender}
                                    onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value })}
                                    className="w-full h-10 pl-3.5 pr-9 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-[#800020] focus:ring-[#800020] appearance-none cursor-pointer"
                                >
                                    <option value="L">Laki-laki</option>
                                    <option value="P">Perempuan</option>
                                </select>
                                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Tempat Lahir *
                            </label>
                            <input
                                type="text"
                                required
                                value={studentForm.birth_place}
                                onChange={(e) => setStudentForm({ ...studentForm, birth_place: e.target.value })}
                                className="w-full h-10 px-3.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Tanggal Lahir *
                            </label>
                            <input
                                type="date"
                                required
                                value={studentForm.birth_date}
                                onChange={(e) => setStudentForm({ ...studentForm, birth_date: e.target.value })}
                                className="w-full h-10 px-3.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Agama *
                            </label>
                            <div className="relative">
                                <select
                                    value={studentForm.religion}
                                    onChange={(e) => setStudentForm({ ...studentForm, religion: e.target.value })}
                                    className="w-full h-10 pl-3.5 pr-9 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-[#800020] focus:ring-[#800020] appearance-none cursor-pointer"
                                >
                                    <option value="Kristen">Kristen Protestan</option>
                                    <option value="Islam">Islam</option>
                                    <option value="Katolik">Katolik</option>
                                    <option value="Hindu">Hindu</option>
                                    <option value="Buddha">Buddha</option>
                                    <option value="Khonghucu">Khonghucu</option>
                                </select>
                                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Alamat Tempat Tinggal
                            </label>
                            <input
                                type="text"
                                placeholder="Dusun/RT/RW/Desa"
                                value={studentForm.address}
                                onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
                                className="w-full h-10 px-3.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            />
                        </div>

                        {/* Guardian Information */}
                        <div className="sm:col-span-2 pt-3 border-t border-slate-100">
                            <h4 className="text-xs font-bold text-[#800020] uppercase tracking-wider mb-3">
                                Informasi Orang Tua / Wali Murid
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                        Nama Wali Murid
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Nama Ayah/Ibu/Wali"
                                        value={studentForm.guardian_name}
                                        onChange={(e) => setStudentForm({ ...studentForm, guardian_name: e.target.value })}
                                        className="w-full h-9 px-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                        Hubungan Keluarga
                                    </label>
                                    <select
                                        value={studentForm.guardian_relation}
                                        onChange={(e) => setStudentForm({ ...studentForm, guardian_relation: e.target.value })}
                                        className="w-full h-9 px-3 bg-white rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                                    >
                                        <option value="ayah">Ayah Kandung</option>
                                        <option value="ibu">Ibu Kandung</option>
                                        <option value="wali">Wali / Kerabat</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                        No. Telepon / WhatsApp Wali
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="0821xxxxxxx"
                                        value={studentForm.guardian_phone}
                                        onChange={(e) => setStudentForm({ ...studentForm, guardian_phone: e.target.value })}
                                        className="w-full h-9 px-3 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                        Pekerjaan Wali
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Petani / PNS / Swasta"
                                        value={studentForm.guardian_occupation}
                                        onChange={(e) => setStudentForm({ ...studentForm, guardian_occupation: e.target.value })}
                                        className="w-full h-9 px-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                                    />
                                </div>
                            </div>
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
                            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Siswa'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
