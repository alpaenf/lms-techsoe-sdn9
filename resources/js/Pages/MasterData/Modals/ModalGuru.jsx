import React, { useState, useRef } from 'react';
import { X, Save, Crop, Trash2, RotateCw, Camera } from 'lucide-react';
import ModalCropFoto from './ModalCropFoto';

export default function ModalGuru({
    isOpen,
    onClose,
    editingTeacher,
    teacherForm,
    setTeacherForm,
    handleSaveTeacher,
    isSubmitting
}) {
    const [rawImageForCrop, setRawImageForCrop] = useState(null);
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    const [croppedPreviewUrl, setCroppedPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setRawImageForCrop(reader.result);
                setIsCropModalOpen(true);
            };
            reader.readAsDataURL(file);
        }
        // Reset input value so selecting same file works
        e.target.value = '';
    };

    const handleCropComplete = (croppedFile, previewUrl) => {
        setTeacherForm({ ...teacherForm, photo: croppedFile });
        setCroppedPreviewUrl(previewUrl);
    };

    const handleRemovePhoto = () => {
        setTeacherForm({ ...teacherForm, photo: null });
        setCroppedPreviewUrl(null);
        setRawImageForCrop(null);
    };

    return (
        <>
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
                                className="w-full h-10 px-3.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-[#8B001F] focus:ring-[#8B001F]"
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
                                    className="w-full h-10 px-3.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:border-[#8B001F] focus:ring-[#8B001F]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Jenis Kelamin *
                                </label>
                                <select
                                    value={teacherForm.gender}
                                    onChange={(e) => setTeacherForm({ ...teacherForm, gender: e.target.value })}
                                    className="w-full h-10 px-3.5 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-[#8B001F] focus:ring-[#8B001F]"
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
                                    className="w-full h-10 px-3.5 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-[#8B001F] focus:ring-[#8B001F]"
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
                                    className="w-full h-10 px-3.5 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-[#8B001F] focus:ring-[#8B001F]"
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
                                    className="w-full h-10 px-3.5 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-[#8B001F] focus:ring-[#8B001F]"
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
                                    className="w-full h-10 px-3.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:border-[#8B001F] focus:ring-[#8B001F]"
                                />
                            </div>

                            {/* Upload Foto dengan Step Crop */}
                            <div className="sm:col-span-2 space-y-2">
                                <label className="block text-xs font-semibold text-slate-700">
                                    Foto Profil / Pass Foto (Opsional)
                                </label>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg,image/webp"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />

                                {/* Preview Card or Upload Button */}
                                {croppedPreviewUrl || (teacherForm.photo instanceof File) ? (
                                    <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF0F2] border border-[#8B001F]/20">
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={croppedPreviewUrl || (teacherForm.photo ? URL.createObjectURL(teacherForm.photo) : '')}
                                                alt="Hasil Crop"
                                                className="w-14 h-16 rounded-xl object-cover border-2 border-white shadow-sm"
                                            />
                                            <div>
                                                <span className="text-xs font-bold text-[#8B001F] block">
                                                    Foto Berhasil Dipotong (Crop)
                                                </span>
                                                <span className="text-[11px] text-slate-500 block">
                                                    Siap disimpan ke profil guru
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-1.5">
                                            {rawImageForCrop && (
                                                <button
                                                    type="button"
                                                    onClick={() => setIsCropModalOpen(true)}
                                                    className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-[11px] font-bold inline-flex items-center space-x-1 shadow-sm transition"
                                                >
                                                    <Crop className="w-3.5 h-3.5 text-[#8B001F]" />
                                                    <span>Crop Ulang</span>
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={handleRemovePhoto}
                                                className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-100 transition"
                                                title="Hapus Foto"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ) : editingTeacher?.photo ? (
                                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={editingTeacher.photo}
                                                alt="Foto Terpasang"
                                                className="w-14 h-16 rounded-xl object-cover border-2 border-white shadow-sm"
                                            />
                                            <div>
                                                <span className="text-xs font-semibold text-slate-700 block">
                                                    Foto saat ini terpasang
                                                </span>
                                                <span className="text-[11px] text-slate-400 block">
                                                    Klik ganti foto untuk mengubah & memotong
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold inline-flex items-center space-x-1.5 shadow-sm transition"
                                        >
                                            <Camera className="w-3.5 h-3.5 text-[#8B001F]" />
                                            <span>Ganti Foto</span>
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full py-3.5 px-4 border-2 border-dashed border-slate-300 hover:border-[#8B001F] rounded-2xl text-center bg-slate-50/50 hover:bg-[#FFF0F2]/40 transition group flex flex-col items-center justify-center space-y-1"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#FFF0F2] text-slate-500 group-hover:text-[#8B001F] flex items-center justify-center transition">
                                            <Camera className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-700 group-hover:text-[#8B001F] transition">
                                            Pilih Foto & Sesuaikan Ukuran (Crop)
                                        </span>
                                        <span className="text-[10px] text-slate-400">
                                            Mendukung JPG, PNG, atau WebP (Maks. 2MB)
                                        </span>
                                    </button>
                                )}
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
                                className="px-5 py-2 rounded-xl bg-[#8B001F] hover:bg-[#650019] disabled:opacity-50 text-white text-xs font-bold shadow-sm transition inline-flex items-center space-x-1.5"
                            >
                                <Save className="w-3.5 h-3.5" />
                                <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Pendidik'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modal Crop Foto */}
            <ModalCropFoto
                isOpen={isCropModalOpen}
                imageSrc={rawImageForCrop}
                onClose={() => setIsCropModalOpen(false)}
                onCropComplete={handleCropComplete}
                aspectRatio={3 / 4}
            />
        </>
    );
}

