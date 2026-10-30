import React, { useState } from 'react';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Lock,
    User,
    Eye,
    EyeOff,
    ArrowRight,
    Calendar,
} from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        login: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Masuk" />

            <div className="min-h-screen lg:h-screen w-full relative bg-gradient-to-br from-[#7B0D1E] via-[#650817] to-[#45040F] text-slate-800 font-sans selection:bg-[#800020] selection:text-white flex flex-col justify-between overflow-x-hidden lg:overflow-hidden">
                {/* Background Pattern Grid Overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid-pattern-login" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.8" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid-pattern-login)" />
                    </svg>
                </div>

                {/* Subtle Geometric Lighting Glows */}
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] bg-red-900/40 rounded-full blur-3xl pointer-events-none" />

                {/* School Photo Background at Bottom Left with Smooth Maroon Overlay Gradient */}
                <div className="absolute bottom-0 left-0 w-full lg:w-[58%] h-[40%] lg:h-[58%] pointer-events-none z-0 overflow-hidden">
                    <img
                        src="/images/sdnfoto.webp"
                        alt="Gedung UPT SDN 9 Gandangbatu Sillanan"
                        className="w-full h-full object-cover object-left-bottom opacity-30 mix-blend-overlay filter contrast-125 brightness-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#45040F] via-transparent to-[#650817]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#650817]/40 to-[#650817]" />
                </div>

                {/* Main Interactive Content */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-5 lg:py-8 h-full flex-1 flex flex-col justify-between">

                    <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch h-full flex-1">

                        {/* Left Hero & Headline (Col 1 to 7) */}
                        <div className="lg:col-span-7 flex flex-col justify-between py-2 space-y-6 lg:space-y-0 h-full">

                            {/* Top Header Logo */}
                            <div>
                                <Link href="/" className="inline-flex items-center space-x-2.5 sm:space-x-3.5 group">
                                    <img
                                        src="/logo.webp"
                                        alt="Logo UPT SDN 9 Gandangbatu Sillanan"
                                        className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 object-contain drop-shadow-md group-hover:scale-105 transition duration-200 shrink-0"
                                        style={{ maxWidth: '64px', maxHeight: '64px', width: 'auto', height: 'auto' }}
                                    />
                                    <div>
                                        <h1 className="text-white font-extrabold text-sm sm:text-lg lg:text-xl leading-tight tracking-tight">
                                            UPT SDN 9
                                        </h1>
                                        <h2 className="text-white font-extrabold text-sm sm:text-lg lg:text-xl leading-tight tracking-tight">
                                            Gandangbatu Sillanan
                                        </h2>
                                        <p className="text-white/70 text-[11px] sm:text-xs lg:text-sm font-normal mt-0.5">
                                            Smart School LMS
                                        </p>
                                    </div>
                                </Link>
                            </div>

                            {/* Middle Headline */}
                            <div className="my-auto py-2">
                                <h2 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[48px] font-bold text-white tracking-tight leading-[1.15]">
                                    Satu Portal untuk<br />
                                    Seluruh Aktivitas Sekolah
                                </h2>

                                <p className="text-white/80 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl font-normal mt-4">
                                    Kelola pembelajaran, presensi, penugasan, administrasi,<br className="hidden sm:inline" />
                                    dan aktivitas akademik dalam satu platform<br className="hidden sm:inline" />
                                    Smart School yang terintegrasi.
                                </p>
                            </div>

                            {/* Bottom Badge & Link */}
                            <div className="space-y-3 pt-1">
                                <div className="inline-flex items-center gap-4 bg-[#580916]/80 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 sm:p-4 shadow-xl">
                                    <div className="w-11 h-11 rounded-xl bg-[#800020] border border-white/15 flex items-center justify-center text-white shrink-0 shadow-inner">
                                        <Calendar className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <span className="text-white/70 text-xs font-medium block">
                                            Tahun Ajaran
                                        </span>
                                        <span className="text-white font-bold text-base sm:text-lg block leading-tight">
                                            2026/2027
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-1">
                                    <Link href="/" className="text-white/70 hover:text-white transition text-xs font-medium inline-block">
                                        ← Kembali ke Halaman Beranda
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Right Login Card (Col 8 to 12) */}
                        <div className="lg:col-span-5 flex items-center justify-center lg:justify-end h-full">
                            <div className="bg-white rounded-[24px] sm:rounded-[28px] p-6 sm:px-9 sm:py-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] w-full max-w-[440px] min-h-[492px] border border-white/20 relative my-auto flex flex-col justify-center">

                                {status && (
                                    <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                                        {status}
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-2xl sm:text-[28px] font-bold text-[#142033] tracking-tight">
                                        Selamat Datang Kembali
                                    </h3>
                                    <p className="text-slate-500 text-xs sm:text-sm mt-1.5 mb-6 leading-relaxed font-normal">
                                        Masuk ke Smart School LMS untuk melanjutkan aktivitas Anda.
                                    </p>
                                </div>

                                <form onSubmit={submit} className="space-y-4">
                                    {/* Identifier Input */}
                                    <div>
                                        <label htmlFor="login" className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                                            EMAIL, NIP, NISN, ATAU USERNAME
                                        </label>
                                        <div className="relative flex items-center bg-[#EDF2F7] rounded-xl border border-slate-200/80 focus-within:border-slate-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#740D1E]/20 transition-all">
                                            <User className="w-4.5 h-4.5 text-slate-400 ml-3.5 shrink-0 pointer-events-none" />
                                            <input
                                                id="login"
                                                type="text"
                                                name="login"
                                                value={data.login}
                                                onChange={(e) => setData('login', e.target.value)}
                                                placeholder="admin@gandasil.id"
                                                className="w-full bg-transparent py-3 pl-3 pr-4 text-slate-800 placeholder-slate-400 text-sm font-normal focus:outline-none rounded-xl"
                                                required
                                                autoComplete="username"
                                            />
                                        </div>
                                        <InputError message={errors.login || errors.email} className="mt-1 text-xs" />
                                    </div>

                                    {/* Password Input */}
                                    <div>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <label htmlFor="password" className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                                KATA SANDI
                                            </label>
                                            {canResetPassword && (
                                                <Link
                                                    href={route('password.request')}
                                                    className="text-xs font-semibold text-[#800020] hover:text-[#5a0017] hover:underline transition"
                                                >
                                                    Lupa kata sandi?
                                                </Link>
                                            )}
                                        </div>
                                        <div className="relative flex items-center bg-[#EDF2F7] rounded-xl border border-slate-200/80 focus-within:border-slate-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#740D1E]/20 transition-all">
                                            <Lock className="w-4.5 h-4.5 text-slate-400 ml-3.5 shrink-0 pointer-events-none" />
                                            <input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full bg-transparent py-3 pl-3 pr-10 text-slate-800 placeholder-slate-400 text-sm font-normal focus:outline-none rounded-xl"
                                                required
                                                autoComplete="current-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition"
                                                tabIndex={-1}
                                                aria-label="Tampilkan atau sembunyikan kata sandi"
                                            >
                                                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                                            </button>
                                        </div>
                                        <InputError message={errors.password} className="mt-1 text-xs" />
                                    </div>

                                    {/* Remember Me Checkbox */}
                                    <div className="flex items-center pt-1 pb-1">
                                        <label className="flex items-center cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                name="remember"
                                                checked={data.remember}
                                                onChange={(e) => setData('remember', e.target.checked)}
                                                className="w-4.5 h-4.5 rounded border-slate-300 text-[#6a0918] focus:ring-[#6a0918] cursor-pointer"
                                            />
                                            <span className="ml-2.5 text-xs sm:text-sm text-slate-600 font-medium">
                                                Ingat sesi masuk di perangkat ini
                                            </span>
                                        </label>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full py-3.5 px-6 bg-[#6a0918] hover:bg-[#520512] active:bg-[#40030d] text-white font-bold rounded-xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#6a0918]/30 transition duration-200 cursor-pointer disabled:opacity-75"
                                        >
                                            <span>{processing ? 'Memverifikasi...' : 'Masuk ke Sistem'}</span>
                                            <ArrowRight className="w-4.5 h-4.5" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </main>

                </div>
            </div>
        </>
    );
}


