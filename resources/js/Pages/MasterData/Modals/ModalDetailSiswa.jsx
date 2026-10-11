import React, { useState } from 'react';
import { X, GraduationCap, MapPin, Users, HeartHandshake, Phone, Mail, Award, CheckCircle, ShieldCheck } from 'lucide-react';

export default function ModalDetailSiswa({ student, onClose }) {
    if (!student) return null;

    const [activeSection, setActiveSection] = useState('profil');

    const father = student.father_data || (student.guardians?.find(g => g.relation_type === 'ayah'));
    const mother = student.mother_data || (student.guardians?.find(g => g.relation_type === 'ibu'));
    const guardian = student.guardian_data || (student.guardians?.find(g => g.relation_type === 'wali'));

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-scale-up">
                {/* Header Banner */}
                <div className="px-6 py-4 bg-gradient-to-r from-[#800020] to-[#5C0017] text-white flex items-center justify-between shrink-0 shadow-sm">
                    <div className="flex items-center space-x-3.5">
                        <div className="p-2.5 rounded-xl bg-white/10 text-white backdrop-blur-sm border border-white/10">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold leading-tight tracking-wide">{student.full_name}</h3>
                            <div className="flex items-center space-x-2 text-xs text-rose-100/90 font-mono mt-0.5">
                                <span>NISN: {student.nisn}</span>
                                <span>•</span>
                                <span>NIPD/NIS: {student.nis}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Section Navigation Tabs */}
                <div className="flex border-b border-slate-200 bg-slate-50/70 px-6 py-2 gap-2 text-xs font-semibold overflow-x-auto shrink-0">
                    <button
                        onClick={() => setActiveSection('profil')}
                        className={`px-3.5 py-1.5 rounded-xl transition flex items-center space-x-1.5 ${
                            activeSection === 'profil'
                                ? 'bg-white text-[#800020] shadow-sm border border-slate-200/80 font-bold'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                    >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Identitas Siswa</span>
                    </button>
                    <button
                        onClick={() => setActiveSection('domisili')}
                        className={`px-3.5 py-1.5 rounded-xl transition flex items-center space-x-1.5 ${
                            activeSection === 'domisili'
                                ? 'bg-white text-[#800020] shadow-sm border border-slate-200/80 font-bold'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                    >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Alamat & Fasilitas</span>
                    </button>
                    <button
                        onClick={() => setActiveSection('ortu')}
                        className={`px-3.5 py-1.5 rounded-xl transition flex items-center space-x-1.5 ${
                            activeSection === 'ortu'
                                ? 'bg-white text-[#800020] shadow-sm border border-slate-200/80 font-bold'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                    >
                        <Users className="w-3.5 h-3.5" />
                        <span>Data Orang Tua / Wali</span>
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
                    {/* TAB 1: IDENTITAS SISWA */}
                    {activeSection === 'profil' && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                                        Rombongan Belajar (Kelas)
                                    </span>
                                    <span className="font-bold text-slate-900 text-sm mt-0.5 inline-block text-[#800020]">
                                        {student.class_name || '-'}
                                    </span>
                                </div>
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                                        Nomor Induk Kependudukan (NIK)
                                    </span>
                                    <span className="font-mono font-bold text-slate-900 text-xs mt-0.5 inline-block">
                                        {student.nik || '-'}
                                    </span>
                                </div>
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                                        Jenis Kelamin
                                    </span>
                                    <span className="font-semibold text-slate-900 text-xs mt-0.5 inline-block">
                                        {student.gender === 'L' ? 'Laki-laki (L)' : 'Perempuan (P)'}
                                    </span>
                                </div>
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                                        Agama
                                    </span>
                                    <span className="font-semibold text-slate-900 text-xs mt-0.5 inline-block">
                                        {student.religion || 'Kristen'}
                                    </span>
                                </div>
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                                        Tempat Lahir
                                    </span>
                                    <span className="font-semibold text-slate-900 text-xs mt-0.5 inline-block">
                                        {student.birth_place || '-'}
                                    </span>
                                </div>
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                                        Tanggal Lahir
                                    </span>
                                    <span className="font-semibold text-slate-900 text-xs mt-0.5 inline-block">
                                        {formatDate(student.birth_date)}
                                    </span>
                                </div>
                            </div>

                            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                    <span className="font-semibold text-emerald-900 text-xs">Status Peserta Didik</span>
                                </div>
                                <span className="px-2.5 py-0.5 bg-emerald-600 text-white font-bold text-[10px] rounded-full uppercase tracking-wider">
                                    {student.status || 'Aktif'}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: ALAMAT & FASILITAS */}
                    {activeSection === 'domisili' && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                                    Alamat Tempat Tinggal
                                </span>
                                <p className="font-semibold text-slate-800 text-xs leading-relaxed">
                                    {student.address || '-'}
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/60 text-[11px]">
                                    <div>
                                        <span className="text-slate-400 block">RT / RW</span>
                                        <span className="font-bold text-slate-700 font-mono">
                                            {student.rt || '0'} / {student.rw || '0'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block">Dusun</span>
                                        <span className="font-semibold text-slate-700">{student.dusun || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block">Kelurahan/Desa</span>
                                        <span className="font-semibold text-slate-700">{student.kelurahan || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block">Kecamatan</span>
                                        <span className="font-semibold text-slate-700">{student.kecamatan || '-'}</span>
                                    </div>
                                </div>
                                <div className="pt-1 text-[11px]">
                                    <span className="text-slate-400">Kode Pos: </span>
                                    <span className="font-mono font-bold text-slate-700">{student.postal_code || '-'}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                                        Jenis Tinggal
                                    </span>
                                    <span className="font-semibold text-slate-900 text-xs mt-0.5 inline-block">
                                        {student.residence_type || 'Bersama orang tua'}
                                    </span>
                                </div>
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                                        Alat Transportasi
                                    </span>
                                    <span className="font-semibold text-slate-900 text-xs mt-0.5 inline-block">
                                        {student.transportation || 'Jalan kaki'}
                                    </span>
                                </div>
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                                        No. Handphone / Telepon
                                    </span>
                                    <span className="font-mono font-bold text-emerald-700 text-xs mt-0.5 inline-block">
                                        {student.mobile_phone || student.phone || student.guardian_phone || '-'}
                                    </span>
                                </div>
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                                        Penerima KPS / KIP
                                    </span>
                                    <span className={`font-bold text-xs mt-0.5 inline-block ${
                                        student.is_kps_recipient === 'Ya' ? 'text-amber-600' : 'text-slate-700'
                                    }`}>
                                        {student.is_kps_recipient || 'Tidak'}
                                        {student.kps_number ? ` (No: ${student.kps_number})` : ''}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: DATA ORANG TUA & WALI */}
                    {activeSection === 'ortu' && (
                        <div className="space-y-3.5 animate-fade-in">
                            {/* Data Ayah */}
                            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                                    <span className="font-bold text-[#800020] text-xs uppercase tracking-wider flex items-center space-x-1.5">
                                        <span>Data Ayah Kandung</span>
                                    </span>
                                    <span className="font-mono text-[10px] text-slate-500">NIK: {father?.nik || '-'}</span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                                    <div>
                                        <span className="text-slate-400 block">Nama Lengkap</span>
                                        <span className="font-bold text-slate-900">{father?.name || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block">Tahun Lahir</span>
                                        <span className="font-semibold text-slate-700">{father?.birth_year || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block">Pendidikan</span>
                                        <span className="font-semibold text-slate-700">{father?.education || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block">Pekerjaan</span>
                                        <span className="font-semibold text-slate-700">{father?.occupation || '-'}</span>
                                    </div>
                                </div>
                                <div className="text-[11px] pt-1">
                                    <span className="text-slate-400">Penghasilan: </span>
                                    <span className="font-semibold text-emerald-700">{father?.income || '-'}</span>
                                </div>
                            </div>

                            {/* Data Ibu */}
                            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                                    <span className="font-bold text-[#800020] text-xs uppercase tracking-wider flex items-center space-x-1.5">
                                        <span>Data Ibu Kandung</span>
                                    </span>
                                    <span className="font-mono text-[10px] text-slate-500">NIK: {mother?.nik || '-'}</span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                                    <div>
                                        <span className="text-slate-400 block">Nama Lengkap</span>
                                        <span className="font-bold text-slate-900">{mother?.name || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block">Tahun Lahir</span>
                                        <span className="font-semibold text-slate-700">{mother?.birth_year || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block">Pendidikan</span>
                                        <span className="font-semibold text-slate-700">{mother?.education || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block">Pekerjaan</span>
                                        <span className="font-semibold text-slate-700">{mother?.occupation || '-'}</span>
                                    </div>
                                </div>
                                <div className="text-[11px] pt-1">
                                    <span className="text-slate-400">Penghasilan: </span>
                                    <span className="font-semibold text-emerald-700">{mother?.income || '-'}</span>
                                </div>
                            </div>

                            {/* Data Wali (if exists) */}
                            {guardian && guardian.name && guardian.name !== '(tidak diisi)' && (
                                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
                                    <div className="flex items-center justify-between pb-1.5 border-b border-amber-200">
                                        <span className="font-bold text-amber-900 text-xs uppercase tracking-wider">
                                            Data Wali Murid
                                        </span>
                                        <span className="font-mono text-[10px] text-amber-700">NIK: {guardian.nik || '-'}</span>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                                        <div>
                                            <span className="text-slate-400 block">Nama Wali</span>
                                            <span className="font-bold text-slate-900">{guardian.name}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 block">Tahun Lahir</span>
                                            <span className="font-semibold text-slate-700">{guardian.birth_year || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 block">Pendidikan</span>
                                            <span className="font-semibold text-slate-700">{guardian.education || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 block">Pekerjaan</span>
                                            <span className="font-semibold text-slate-700">{guardian.occupation || '-'}</span>
                                        </div>
                                    </div>
                                    <div className="text-[11px] pt-1">
                                        <span className="text-slate-400">Penghasilan: </span>
                                        <span className="font-semibold text-emerald-700">{guardian.income || '-'}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
