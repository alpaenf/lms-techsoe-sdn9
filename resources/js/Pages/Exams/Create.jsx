import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    ArrowLeft, 
    Save, 
    Clock, 
    Calendar, 
    HelpCircle, 
    Settings, 
    BookOpen, 
    Layers,
    CheckCircle2
} from 'lucide-react';

export default function ExamsCreate({ auth, subjects = [], classes = [], teacher }) {
    const [form, setForm] = useState({
        title: '',
        description: '',
        subject_id: subjects[0]?.id || '',
        class_id: classes[0]?.id || '',
        exam_category: 'ulangan_harian',
        duration_minutes: 60,
        start_time: '',
        end_time: '',
        max_attempts: 1,
        passing_score: 75.00,
        randomize_questions: false,
        show_review: true,
        show_result_immediately: true,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        router.post(route('exams.store'), form, {
            onFinish: () => setIsSubmitting(false)
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route('exams.index')}
                        className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">
                            Buat Paket Ujian Baru
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Konfigurasi jadwal pelaksanaan, aturan pengerjaan, dan sasaran kelas
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Buat Ujian Baru" />

            <div className="max-w-4xl mx-auto space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* General Information Card */}
                    <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm space-y-5">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-[#FDF2F4] text-[#800020] flex items-center justify-center">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Informasi Pokok Ujian</h3>
                                <p className="text-xs text-slate-500">Nama asesmen dan pengelompokan kurikulum</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Judul Ujian / Asesmen <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="Contoh: Asesmen Tengah Semester Ganjil Matematika 2026/2027"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#800020] focus:ring-[#800020]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Deskripsi & Petunjuk Singkat
                            </label>
                            <textarea
                                rows={3}
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Tuliskan cakupan materi atau petunjuk umum bagi siswa..."
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#800020] focus:ring-[#800020] resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Mata Pelajaran <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    required
                                    value={form.subject_id}
                                    onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#800020] focus:ring-[#800020] bg-white font-medium"
                                >
                                    {subjects.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Sasaran Rombel / Kelas <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    required
                                    value={form.class_id}
                                    onChange={(e) => setForm({ ...form, class_id: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#800020] focus:ring-[#800020] bg-white font-medium"
                                >
                                    {classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Kategori Ujian <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    required
                                    value={form.exam_category}
                                    onChange={(e) => setForm({ ...form, exam_category: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#800020] focus:ring-[#800020] bg-white font-medium"
                                >
                                    <option value="ulangan_harian">Ulangan Harian</option>
                                    <option value="uts">Ujian Tengah Semester (UTS)</option>
                                    <option value="uas">Ujian Akhir Semester (UAS)</option>
                                    <option value="ujian_sekolah">Ujian Sekolah (US)</option>
                                    <option value="kuis">Kuis / Latihan Harian</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Schedule & Rules Card */}
                    <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm space-y-5">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Jadwal & Batasan Waktu</h3>
                                <p className="text-xs text-slate-500">Durasi pengerjaan dan rentang waktu akses</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Durasi Pengerjaan (Menit) <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min={5}
                                    max={300}
                                    required
                                    value={form.duration_minutes}
                                    onChange={(e) => setForm({ ...form, duration_minutes: Number(e.target.value) })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#800020] focus:ring-[#800020]"
                                />
                                <p className="text-[11px] text-slate-400 mt-1">Timer hitung mundur aktif</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Waktu Mulai Tersedia <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={form.start_time}
                                    onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#800020] focus:ring-[#800020]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Batas Akhir Ujian <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={form.end_time}
                                    onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#800020] focus:ring-[#800020]"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Batas Maksimal Percobaan
                                </label>
                                <select
                                    value={form.max_attempts}
                                    onChange={(e) => setForm({ ...form, max_attempts: Number(e.target.value) })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#800020] focus:ring-[#800020] bg-white"
                                >
                                    <option value={1}>1 Kali (Ujian Resmi)</option>
                                    <option value={2}>2 Kali Percobaan</option>
                                    <option value={3}>3 Kali Percobaan</option>
                                    <option value={999}>Tak Terbatas (Latihan Mandiri)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Nilai Kelulusan Minimum (KKM)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min={0}
                                    max={100}
                                    value={form.passing_score}
                                    onChange={(e) => setForm({ ...form, passing_score: Number(e.target.value) })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#800020] focus:ring-[#800020]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Options / Policy Card */}
                    <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                                <Settings className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Pengaturan Soal & Tampilan</h3>
                                <p className="text-xs text-slate-500">Konfigurasi randomisasi dan umpan balik bagi siswa</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                                <div>
                                    <p className="text-xs font-bold text-slate-800">Acak Urutan Soal Siswa</p>
                                    <p className="text-[11px] text-slate-500">Tiap siswa akan menerima urutan nomor soal yang berbeda</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={form.randomize_questions}
                                    onChange={(e) => setForm({ ...form, randomize_questions: e.target.checked })}
                                    className="rounded text-[#800020] focus:ring-[#800020] w-4 h-4"
                                />
                            </label>

                            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                                <div>
                                    <p className="text-xs font-bold text-slate-800">Tampilkan Nilai Langsung</p>
                                    <p className="text-[11px] text-slate-500">Siswa dapat langsung melihat skor setelah ujian selesai dikumpulkan</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={form.show_result_immediately}
                                    onChange={(e) => setForm({ ...form, show_result_immediately: e.target.checked })}
                                    className="rounded text-[#800020] focus:ring-[#800020] w-4 h-4"
                                />
                            </label>

                            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                                <div>
                                    <p className="text-xs font-bold text-slate-800">Izinkan Siswa Mereview Jawaban</p>
                                    <p className="text-[11px] text-slate-500">Siswa dapat melihat kembali soal mana yang dijawab benar dan salah</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={form.show_review}
                                    onChange={(e) => setForm({ ...form, show_review: e.target.checked })}
                                    className="rounded text-[#800020] focus:ring-[#800020] w-4 h-4"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Submit Bar */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Link
                            href={route('exams.index')}
                            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center px-6 py-2.5 rounded-xl bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isSubmitting ? 'Menyimpan...' : 'Simpan & Lanjutkan Buat Soal'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
