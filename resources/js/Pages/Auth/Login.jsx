import React, { useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    GraduationCap, 
    Lock, 
    User, 
    Eye, 
    EyeOff, 
    ArrowRight, 
    ShieldCheck, 
    Info, 
    School,
    Sparkles
} from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        login: '',
        password: '',
        remember: false,
    });

    const demoAccounts = [
        {
            role: 'Administrator',
            identifier: 'admin',
            email: 'admin@sdn9gandangbatu.sch.id',
            desc: 'Akses penuh kelola pengguna, kelembagaan & master data',
        },
        {
            role: 'Kepala Sekolah',
            identifier: '198502012010012025',
            name: 'Hendrika Genti, S.Pd.SD.',
            email: 'kepsek@sdn9gandangbatu.sch.id',
            desc: 'Monitoring eksekutif & pengesahan E-Raport',
        },
        {
            role: 'Guru / Wali Kelas',
            identifier: '198705122015021003',
            name: 'Budi Santoso, S.Pd.',
            email: 'guru@sdn9gandangbatu.sch.id',
            desc: 'Kelola materi, tugas, presensi & leger nilai',
        },
        {
            role: 'Guru BK',
            identifier: '199003202019032008',
            name: 'Maria Rante, S.Pd.',
            email: 'bk@sdn9gandangbatu.sch.id',
            desc: 'Bimbingan konseling, pelanggaran & prestasi',
        },
        {
            role: 'Siswa Demo',
            identifier: '0081234567',
            name: 'Siti Nurhaliza (Kelas 6)',
            email: 'siswa@sdn9gandangbatu.sch.id',
            desc: 'Akses modul, kumpul tugas & lihat rapor',
        },
    ];

    const fillDemo = (identifier) => {
        setData({
            ...data,
            login: identifier,
            password: 'password123',
        });
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Masuk - Smart School LMS UPT SDN 9 Gandangbatu Sillanan" />

            <div className="min-h-screen bg-[#F8F9FA] text-slate-800 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#800020] selection:text-white">
                <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
                    <Link href="/" className="inline-flex items-center justify-center space-x-3 group">
                        <div className="w-12 h-12 rounded-2xl bg-[#800020] flex items-center justify-center text-white shadow-md group-hover:bg-[#5C0017] transition">
                            <GraduationCap className="w-7 h-7" />
                        </div>
                    </Link>

                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                            UPT SDN 9 Gandangbatu Sillanan
                        </h2>
                        <p className="text-sm text-slate-500 font-medium">
                            Portal Masuk Terpadu Smart School LMS
                        </p>
                    </div>

                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#FDF2F4] text-[#800020] text-xs font-semibold border border-[#E8B4B8]">
                        <School className="w-3.5 h-3.5 mr-1.5" />
                        T.A. 2026/2027 • Semester Ganjil
                    </div>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl space-y-6">
                    {/* Main Login Card */}
                    <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
                        {status && (
                            <div className="mb-5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm font-medium text-emerald-800">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            {/* Identifier: Email / Username / NIP / NISN */}
                            <div>
                                <InputLabel 
                                    htmlFor="login" 
                                    value="Email, NIP, NISN, atau Username" 
                                    className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
                                />

                                <div className="mt-1.5 relative rounded-lg shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <TextInput
                                        id="login"
                                        type="text"
                                        name="login"
                                        value={data.login}
                                        className="block w-full pl-10 h-11 text-sm bg-slate-50/50 focus:bg-white"
                                        autoComplete="username"
                                        placeholder="Contoh: admin / 19850201... / 0081234567"
                                        isFocused={true}
                                        onChange={(e) => setData('login', e.target.value)}
                                        required
                                    />
                                </div>
                                <InputError message={errors.login || errors.email} className="mt-2 text-xs" />
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <InputLabel 
                                        htmlFor="password" 
                                        value="Kata Sandi" 
                                        className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
                                    />
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-xs text-[#800020] hover:text-[#5C0017] font-medium transition"
                                        >
                                            Lupa kata sandi?
                                        </Link>
                                    )}
                                </div>

                                <div className="mt-1.5 relative rounded-lg shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <TextInput
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        className="block w-full pl-10 pr-10 h-11 text-sm bg-slate-50/50 focus:bg-white"
                                        autoComplete="current-password"
                                        placeholder="Masukkan kata sandi akun"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                                        tabIndex={-1}
                                        aria-label="Tampilkan atau sembunyikan kata sandi"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-2 text-xs" />
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center justify-between pt-1">
                                <label className="flex items-center cursor-pointer">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <span className="ms-2.5 text-xs text-slate-600 font-medium select-none">
                                        Ingat sesi masuk di perangkat ini
                                    </span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <PrimaryButton 
                                    className="w-full h-11 text-base shadow-md font-bold" 
                                    disabled={processing}
                                >
                                    <span>{processing ? 'Memverifikasi...' : 'Masuk ke Sistem'}</span>
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    {/* Quick Demo Credentials Panel */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center space-x-2">
                                <div className="p-1 rounded bg-[#FDF2F4] text-[#800020]">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                                    Daftar Akun Bawaan (Data Seeder)
                                </span>
                            </div>
                            <span className="text-xs text-slate-500 font-medium">
                                Sandi Semua Akun: <span className="font-mono text-[#800020] font-bold">password123</span>
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {demoAccounts.map((acc, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => fillDemo(acc.identifier)}
                                    className="text-left p-3 rounded-xl border border-slate-200 hover:border-[#E8B4B8] hover:bg-[#FDF2F4] transition group flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-900 group-hover:text-[#800020]">
                                                {acc.role}
                                            </span>
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium group-hover:bg-[#800020] group-hover:text-white transition">
                                                Gunakan
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
                                            ID: {acc.identifier}
                                        </p>
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-2 line-clamp-1">
                                        {acc.desc}
                                    </p>
                                </button>
                            ))}
                        </div>

                        <div className="pt-2 text-[11px] text-slate-500 flex items-start space-x-1.5">
                            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span>
                                Klik salah satu tombol akun di atas untuk mengisi kolom formulir secara otomatis.
                            </span>
                        </div>
                    </div>

                    <div className="text-center text-xs text-slate-500">
                        <Link href="/" className="hover:text-[#800020] transition font-medium">
                            Kembali ke Halaman Beranda
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
