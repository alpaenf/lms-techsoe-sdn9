import React, { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    KeyRound, 
    GraduationCap, 
    Mail, 
    ArrowLeft, 
    Calendar, 
    Hash, 
    Lock, 
    CheckCircle2, 
    HelpCircle, 
    School, 
    Phone, 
    Eye,
    EyeOff
} from 'lucide-react';

export default function ForgotPassword({ status, statusNisn, schoolPhone = '081234567890', schoolName = 'UPT SDN 9 Gandangbatu Sillanan' }) {
    // Mode switcher: 'siswa' or 'guru'
    const [activeTab, setActiveTab] = useState('siswa');
    const [showPassword, setShowPassword] = useState(false);

    // Form for Siswa (NISN & Birth Date)
    const { 
        data: studentData, 
        setData: setStudentData, 
        post: postStudent, 
        processing: studentProcessing, 
        errors: studentErrors, 
        reset: resetStudent 
    } = useForm({
        nisn: '',
        birth_date: '',
        password: '',
        password_confirmation: '',
    });

    // Form for Guru/Staff (Email Link)
    const { 
        data: emailData, 
        setData: setEmailData, 
        post: postEmail, 
        processing: emailProcessing, 
        errors: emailErrors, 
        reset: resetEmail 
    } = useForm({
        email: '',
    });

    const handleStudentSubmit = (e) => {
        e.preventDefault();
        postStudent(route('password.nisn.reset'), {
            onSuccess: () => resetStudent('password', 'password_confirmation'),
        });
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        postEmail(route('password.email'), {
            onSuccess: () => resetEmail(),
        });
    };

    return (
        <>
            <Head title="Pemulihan Kata Sandi" />

            <div className="min-h-screen bg-[#F8F9FA] text-slate-800 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#800020] selection:text-white">
                
                {/* Brand Header */}
                <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
                    <Link href="/" className="inline-flex items-center justify-center space-x-3 group">
                        <img 
                            src="/logo.webp" 
                            alt="Logo UPT SDN 9 Gandangbatu Sillanan" 
                            className="w-16 h-16 object-contain rounded-2xl bg-white p-1.5 shadow-md border border-slate-200 group-hover:scale-105 transition shrink-0" 
                        />
                    </Link>

                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                            {schoolName}
                        </h2>
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">
                            Layanan Pemulihan Kata Sandi Akun LMS
                        </p>
                    </div>

                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#FDF2F4] text-[#800020] text-xs font-semibold border border-[#E8B4B8]">
                        <KeyRound className="w-3.5 h-3.5 mr-1.5" />
                        Pusat Bantuan & Reset Sandi Mandiri
                    </div>
                </div>

                <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl space-y-5">
                    {/* Main Card */}
                    <div className="bg-white py-7 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
                        
                        {/* Tab Switcher */}
                        <div className="flex bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200">
                            <button
                                type="button"
                                onClick={() => setActiveTab('siswa')}
                                className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2 ${
                                    activeTab === 'siswa'
                                        ? 'bg-white text-[#800020] shadow-sm border border-slate-200/60'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <GraduationCap className="w-4 h-4 text-[#800020]" />
                                <span>Peserta Didik (Siswa)</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('guru')}
                                className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2 ${
                                    activeTab === 'guru'
                                        ? 'bg-white text-[#800020] shadow-sm border border-slate-200/60'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <User className="w-4 h-4 text-slate-600" />
                                <span>Guru & Tenaga Kependidikan</span>
                            </button>
                        </div>

                        {/* ============================================================== */}
                        {/* TAB 1: RESET SISWA VIA NISN & TANGGAL LAHIR */}
                        {/* ============================================================== */}
                        {activeTab === 'siswa' && (
                            <div className="space-y-5">
                                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 leading-relaxed flex items-start space-x-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold block">Tanpa Perlu Email!</span>
                                        Siswa Sekolah Dasar (SD) dapat langsung mengatur kata sandi baru menggunakan <strong>NISN</strong> dan <strong>Tanggal Lahir</strong> yang tercantum di Buku Rapor atau Kartu Pelajar.
                                    </div>
                                </div>

                                {statusNisn && (
                                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-900 space-y-2">
                                        <div className="flex items-center space-x-2 font-bold text-emerald-800">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>Kata Sandi Berhasil Diperbarui</span>
                                        </div>
                                        <p>{statusNisn}</p>
                                        <Link
                                            href={route('login')}
                                            className="inline-flex items-center mt-2 px-3.5 py-1.5 rounded-lg bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800 transition shadow-sm"
                                        >
                                            Masuk Sekarang ke Akun Siswa &rarr;
                                        </Link>
                                    </div>
                                )}

                                <form onSubmit={handleStudentSubmit} className="space-y-4">
                                    {/* NISN */}
                                    <div>
                                        <InputLabel 
                                            htmlFor="nisn" 
                                            value="Nomor Induk Siswa Nasional (NISN / NIS)" 
                                            className="text-xs font-bold text-slate-700 uppercase tracking-wider"
                                        />
                                        <div className="mt-1.5 relative rounded-lg shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                <Hash className="h-4 w-4" />
                                            </div>
                                            <TextInput
                                                id="nisn"
                                                type="text"
                                                name="nisn"
                                                value={studentData.nisn}
                                                className="block w-full pl-10 h-11 text-sm bg-slate-50/50 focus:bg-white"
                                                placeholder="Contoh: 0081234567"
                                                isFocused={true}
                                                onChange={(e) => setStudentData('nisn', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <InputError message={studentErrors.nisn} className="mt-1.5 text-xs" />
                                    </div>

                                    {/* Tanggal Lahir */}
                                    <div>
                                        <InputLabel 
                                            htmlFor="birth_date" 
                                            value="Tanggal Lahir Siswa (Sesuai Rapor / Akta)" 
                                            className="text-xs font-bold text-slate-700 uppercase tracking-wider"
                                        />
                                        <div className="mt-1.5 relative rounded-lg shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                <Calendar className="h-4 w-4" />
                                            </div>
                                            <TextInput
                                                id="birth_date"
                                                type="date"
                                                name="birth_date"
                                                value={studentData.birth_date}
                                                className="block w-full pl-10 h-11 text-sm bg-slate-50/50 focus:bg-white"
                                                onChange={(e) => setStudentData('birth_date', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <InputError message={studentErrors.birth_date} className="mt-1.5 text-xs" />
                                    </div>

                                    {/* Kata Sandi Baru */}
                                    <div>
                                        <InputLabel 
                                            htmlFor="password" 
                                            value="Kata Sandi Baru" 
                                            className="text-xs font-bold text-slate-700 uppercase tracking-wider"
                                        />
                                        <div className="mt-1.5 relative rounded-lg shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                <Lock className="h-4 w-4" />
                                            </div>
                                            <TextInput
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={studentData.password}
                                                className="block w-full pl-10 pr-10 h-11 text-sm bg-slate-50/50 focus:bg-white"
                                                placeholder="Minimal 6 karakter"
                                                onChange={(e) => setStudentData('password', e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        <InputError message={studentErrors.password} className="mt-1.5 text-xs" />
                                    </div>

                                    {/* Konfirmasi Kata Sandi Baru */}
                                    <div>
                                        <InputLabel 
                                            htmlFor="password_confirmation" 
                                            value="Konfirmasi Kata Sandi Baru" 
                                            className="text-xs font-bold text-slate-700 uppercase tracking-wider"
                                        />
                                        <div className="mt-1.5 relative rounded-lg shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                <Lock className="h-4 w-4" />
                                            </div>
                                            <TextInput
                                                id="password_confirmation"
                                                type={showPassword ? 'text' : 'password'}
                                                name="password_confirmation"
                                                value={studentData.password_confirmation}
                                                className="block w-full pl-10 h-11 text-sm bg-slate-50/50 focus:bg-white"
                                                placeholder="Ulangi kata sandi baru"
                                                onChange={(e) => setStudentData('password_confirmation', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <InputError message={studentErrors.password_confirmation} className="mt-1.5 text-xs" />
                                    </div>

                                    <div className="pt-2">
                                        <PrimaryButton 
                                            className="w-full h-11 text-sm font-bold shadow-md bg-[#800020] hover:bg-[#5C0017]" 
                                            disabled={studentProcessing}
                                        >
                                            {studentProcessing ? 'Memverifikasi Data Siswa...' : 'Verifikasi & Reset Sandi Siswa'}
                                        </PrimaryButton>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* ============================================================== */}
                        {/* TAB 2: RESET GURU/STAFF VIA EMAIL */}
                        {/* ============================================================== */}
                        {activeTab === 'guru' && (
                            <div className="space-y-5">
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Masukkan alamat email dinas / pribadi yang terdaftar pada akun GTK Anda. Sistem akan mengirimkan tautan aman untuk membuat kata sandi baru.
                                </p>

                                {status && (
                                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center space-x-2">
                                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                                        <span>{status}</span>
                                    </div>
                                )}

                                <form onSubmit={handleEmailSubmit} className="space-y-4">
                                    <div>
                                        <InputLabel 
                                            htmlFor="email" 
                                            value="Alamat Email Terdaftar" 
                                            className="text-xs font-bold text-slate-700 uppercase tracking-wider"
                                        />
                                        <div className="mt-1.5 relative rounded-lg shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                <Mail className="h-4 w-4" />
                                            </div>
                                            <TextInput
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={emailData.email}
                                                className="block w-full pl-10 h-11 text-sm bg-slate-50/50 focus:bg-white"
                                                placeholder="contoh: nama.guru@sdn9gandangbatu.sch.id"
                                                isFocused={true}
                                                onChange={(e) => setEmailData('email', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <InputError message={emailErrors.email} className="mt-1.5 text-xs" />
                                    </div>

                                    <div className="pt-2">
                                        <PrimaryButton 
                                            className="w-full h-11 text-sm font-bold shadow-md bg-[#800020] hover:bg-[#5C0017]" 
                                            disabled={emailProcessing}
                                        >
                                            {emailProcessing ? 'Mengirimkan Tautan...' : 'Kirim Tautan Reset ke Email'}
                                        </PrimaryButton>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Assistance / Help Desk */}
                        <div className="mt-8 pt-6 border-t border-slate-200/80">
                            <div className="flex items-start space-x-3 text-slate-500">
                                <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                <div className="text-xs leading-relaxed">
                                    <span className="font-bold text-slate-700 block">Butuh bantuan pengaturan akun?</span>
                                    Jika Anda lupa NISN atau mengalami kendala, hubungi <strong>Wali Kelas</strong> atau Operator LMS UPT SDN 9 Gandangbatu Sillanan:
                                    <div className="mt-1 flex items-center space-x-2 text-[#800020] font-semibold">
                                        <Phone className="w-3.5 h-3.5" />
                                        <span>WhatsApp: {schoolPhone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Back to Login Link */}
                    <div className="text-center">
                        <Link
                            href={route('login')}
                            className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-[#800020] transition"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                            <span>Kembali ke Halaman Masuk</span>
                        </Link>
                    </div>

                </div>

            </div>
        </>
    );
}
