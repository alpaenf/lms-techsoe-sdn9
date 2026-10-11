import React, { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle2, Loader2, Info } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function ModalImportSiswa({ isOpen, onClose, onSuccess }) {
    if (!isOpen) return null;

    const [file, setFile] = useState(null);
    const [resetOld, setResetOld] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (selectedFile) => {
        setErrorMessage('');
        const validExtensions = ['xlsx', 'xls', 'csv'];
        const ext = selectedFile.name.split('.').pop().toLowerCase();

        if (!validExtensions.includes(ext)) {
            setErrorMessage('Format file tidak didukung. Mohon gunakan file .xlsx, .xls, atau .csv');
            return;
        }

        if (selectedFile.size > 20 * 1024 * 1024) {
            setErrorMessage('Ukuran file terlalu besar (maksimal 20MB).');
            return;
        }

        setFile(selectedFile);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file) {
            setErrorMessage('Silakan pilih file terlebih dahulu.');
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('reset_old', resetOld ? '1' : '0');

        router.post(route('master-data.students.import'), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: (page) => {
                setIsSubmitting(false);
                setFile(null);
                if (onSuccess) onSuccess();
                onClose();
            },
            onError: (errors) => {
                setIsSubmitting(false);
                setErrorMessage(errors.file || errors.error || 'Terjadi kesalahan saat memproses file import.');
            }
        });
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-scale-up">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div className="flex items-center space-x-2.5">
                        <div className="p-2 rounded-xl bg-[#800020]/10 text-[#800020]">
                            <FileSpreadsheet className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Import Data Siswa</h3>
                            <p className="text-xs text-slate-500">Mendukung format resmi Dapodik (.xlsx) & Spreadsheet</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Error message */}
                    {errorMessage && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl flex items-start space-x-2.5 text-xs animate-shake">
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* Info Callout */}
                    <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 flex items-start space-x-2.5 text-xs text-amber-900">
                        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="font-semibold">Format Otomatis Dapodik</p>
                            <p className="text-amber-800 text-[11px] leading-relaxed">
                                Sistem membaca seluruh kolom Dapodik: NIPD, NISN, NIK, Tempat/Tgl Lahir, Alamat, RT/RW, Rombel, serta data lengkap Ayah, Ibu, dan Wali. Rombel dan akun siswa dibuat otomatis.
                            </p>
                        </div>
                    </div>

                    {/* Dropzone */}
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[170px] ${
                            dragActive
                                ? 'border-[#800020] bg-[#800020]/5'
                                : file
                                ? 'border-emerald-300 bg-emerald-50/40'
                                : 'border-slate-300 hover:border-[#800020] hover:bg-slate-50'
                        }`}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {file ? (
                            <div className="space-y-2">
                                <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                    <FileSpreadsheet className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-800 truncate max-w-xs mx-auto">
                                        {file.name}
                                    </p>
                                    <p className="text-[11px] text-slate-500 font-mono">
                                        {formatFileSize(file.size)}
                                    </p>
                                </div>
                                <span className="inline-block text-[11px] text-[#800020] font-semibold underline hover:text-[#5C0017]">
                                    Ganti file lain
                                </span>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-800">
                                        Klik untuk pilih file atau seret file ke sini
                                    </p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                        Mendukung file Excel (.xlsx, .xls) atau CSV (Maks. 20MB)
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Reset Option */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start space-x-3">
                        <input
                            type="checkbox"
                            id="resetOld"
                            checked={resetOld}
                            onChange={(e) => setResetOld(e.target.checked)}
                            className="mt-0.5 rounded border-slate-300 text-[#800020] focus:ring-[#800020] cursor-pointer"
                        />
                        <label htmlFor="resetOld" className="text-xs text-slate-700 cursor-pointer select-none">
                            <span className="font-semibold block text-slate-900">
                                Bersihkan data siswa sebelumnya (Reset)
                            </span>
                            <span className="text-[11px] text-slate-500 block mt-0.5">
                                Aktifkan opsi ini jika ingin mengganti seluruh data siswa lama dengan data dari file ini secara bersih.
                            </span>
                        </label>
                    </div>

                    {/* Footer / Buttons */}
                    <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                        <a
                            href={route('master-data.students.template')}
                            download
                            className="inline-flex items-center text-xs text-slate-600 hover:text-[#800020] font-medium transition"
                        >
                            <Download className="w-3.5 h-3.5 mr-1" />
                            Unduh Template CSV
                        </a>

                        <div className="flex items-center space-x-2">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={!file || isSubmitting}
                                className="px-4 py-2 bg-[#800020] hover:bg-[#5C0017] disabled:opacity-50 text-white text-xs font-semibold rounded-xl inline-flex items-center shadow-sm transition"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-3.5 h-3.5 mr-1.5" />
                                        <span>Mulai Import</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
