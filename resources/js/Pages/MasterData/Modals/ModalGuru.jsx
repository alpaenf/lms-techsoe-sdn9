import React from 'react';
import { X, Save } from 'lucide-react';

export default function ModalGuru({
    isOpen,
    onClose,
    editingTeacher,
    teacherForm,
    setTeacherForm,
    handleSaveTeacher,
    isSubmitting
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-scale-up">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">
                        {editingTeacher ? 'Edit Data Tenaga Pendidik' : 'Tambah Tenaga Pendidik Baru'}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSaveTeacher} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Nama Lengkap & Gelar *
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: Budi Santoso, S.Pd."
                            value={teacherForm.full_name}
                            onChange={(e) => setTeacherForm({ ...teacherForm, full_name: e.target.value })}
                            className="w-full h-10 px-3.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                NIP (Nomor Induk Pegawai)
                            </label>
                            <input
                                type="text"
                                placeholder="19870512..."
                                value={teacherForm.nip}
                                onChange={(e) => setTeacherForm({ ...teacherForm, nip: e.target.value })}
                                className="w-full h-10 px-3.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Jenis Kelamin *
                            </label>
                            <select
                                value={teacherForm.gender}
                                onChange={(e) => setTeacherForm({ ...teacherForm, gender: e.target.value })}
                                className="w-full h-10 px-3.5 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            >
                                <option value="L">Laki-laki</option>
                                <option value="P">Perempuan</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Status Kepegawaian *
                            </label>
                            <select
                                value={teacherForm.employment_status}
                                onChange={(e) => setTeacherForm({ ...teacherForm, employment_status: e.target.value })}
                                className="w-full h-10 px-3.5 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            >
                                <option value="PNS">PNS</option>
                                <option value="PPPK">PPPK</option>
                                <option value="GTT">GTT</option>
                                <option value="Honorer">Honorer</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Pendidikan Terakhir *
                            </label>
                            <select
                                value={teacherForm.education_level}
                                onChange={(e) => setTeacherForm({ ...teacherForm, education_level: e.target.value })}
                                className="w-full h-10 px-3.5 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            >
                                <option value="S1">S1 (Sarjana)</option>
                                <option value="S2">S2 (Magister)</option>
                                <option value="D3">D3 (Diploma)</option>
                                <option value="SMA">SMA/SMK</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Peran Hak Akses Akun *
                            </label>
                            <select
                                value={teacherForm.role}
                                onChange={(e) => setTeacherForm({ ...teacherForm, role: e.target.value })}
                                className="w-full h-10 px-3.5 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            >
                                <option value="guru">Guru / Wali Kelas</option>
                                <option value="bk">Guru BK</option>
                                <option value="pimpinan">Kepala Sekolah (Pimpinan)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Email Akun Resmi
                            </label>
                            <input
                                type="email"
                                placeholder="guru@sdn9gandangbatu.sch.id"
                                value={teacherForm.email}
                                onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                                className="w-full h-10 px-3.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            />
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
                            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Pendidik'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
