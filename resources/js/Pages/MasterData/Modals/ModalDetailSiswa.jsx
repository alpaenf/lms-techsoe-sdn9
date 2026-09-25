import React from 'react';
import { X, GraduationCap } from 'lucide-react';

export default function ModalDetailSiswa({ student, onClose }) {
    if (!student) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-scale-up">
                <div className="px-6 py-4 bg-[#800020] text-white flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-xl bg-white/10 text-white">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold leading-tight">{student.full_name}</h3>
                            <p className="text-xs text-rose-100 font-mono">NISN: {student.nisn} | NIS: {student.nis}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Rombel Kelas</span>
                            <span className="font-bold text-slate-900 text-xs">{student.class_name || '-'}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Jenis Kelamin</span>
                            <span className="font-semibold text-slate-900 text-xs">{student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Tempat, Tgl Lahir</span>
                            <span className="font-semibold text-slate-900 text-xs">{student.birth_place}, {student.birth_date}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Agama</span>
                            <span className="font-semibold text-slate-900 text-xs">{student.religion}</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Alamat Rumah</span>
                        <p className="p-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium">
                            {student.address || 'Alamat belum diisi.'}
                        </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2">
                        <h4 className="font-bold text-[#800020] text-xs uppercase tracking-wider">
                            Data Wali Murid / Orang Tua
                        </h4>
                        <div className="p-3.5 bg-[#FDF2F4] rounded-xl border border-[#E8B4B8] space-y-1">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Nama Wali:</span>
                                <span className="font-bold text-slate-900">{student.guardian_name || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Hubungan:</span>
                                <span className="font-semibold capitalize text-slate-800">{student.guardian_relation || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">No. WhatsApp:</span>
                                <span className="font-mono font-bold text-emerald-700">{student.guardian_phone || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Pekerjaan:</span>
                                <span className="font-medium text-slate-700">{student.guardian_occupation || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
