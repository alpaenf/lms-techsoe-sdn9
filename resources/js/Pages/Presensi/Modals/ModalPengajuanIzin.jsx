import React, { useState } from 'react';
import { X, Send, FileText, Calendar, Upload, AlertCircle } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function ModalPengajuanIzin({ isOpen, onClose }) {
    if (!isOpen) return null;

    const [permissionType, setPermissionType] = useState('Izin');
    const [startDate, setStartDate] = useState(dateOffset(1));
    const [endDate, setEndDate] = useState(dateOffset(1));
    const [reason, setReason] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function dateOffset(days) {
        const d = new Date();
        d.setDate(d.getDate() + days);
        return d.toISOString().split('T')[0];
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('permission_type', permissionType);
        formData.append('start_date', startDate);
        formData.append('end_date', endDate);
        formData.append('reason', reason);
        if (attachment) {
            formData.append('attachment', attachment);
        }

        router.post(route('presensi.permissions.store'), formData, {
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
                            <FileText className="w-5 h-5 text-rose-200" />
                            <h3 className="font-bold text-base">Pengajuan Surat Izin / Sakit</h3>
                        </div>
                        <p className="text-xs text-rose-100 mt-1">
                            Permohonan Izin Mandiri Peserta Didik & Tenaga Pendidik
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
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Permission Type Radio */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Kategori Permohonan
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setPermissionType('Izin')}
                                className={`py-3 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-2 ${
                                    permissionType === 'Izin'
                                        ? 'bg-[#800020] text-white border-[#800020] shadow-sm'
                                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                <span>Izin Acara / Keperluan</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setPermissionType('Sakit')}
                                className={`py-3 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-2 ${
                                    permissionType === 'Sakit'
                                        ? 'bg-[#800020] text-white border-[#800020] shadow-sm'
                                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                <span>Sakit / Istirahat</span>
                            </button>
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Tanggal Mulai
                            </label>
                            <input
                                type="date"
                                required
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Sampai Tanggal
                            </label>
                            <input
                                type="date"
                                required
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            />
                        </div>
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Alasan Permohonan Izin / Sakit
                        </label>
                        <textarea
                            rows={3}
                            required
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Tuliskan keterangan lengkap alasan permohonan izin/sakit..."
                            className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 focus:border-[#800020] focus:ring-[#800020] leading-relaxed"
                        />
                    </div>

                    {/* File Attachment */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Lampiran Berkas (Surat Dokter / Surat Orang Tua - Opsional)
                        </label>
                        <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => setAttachment(e.target.files[0] || null)}
                            className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                        />
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
                            <Send className="w-4 h-4" />
                            <span>{isSubmitting ? 'Mengirim...' : 'Kirim Permohonan'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
