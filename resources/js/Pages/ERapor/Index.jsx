import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { 
    Files, 
    FileText, 
    Printer, 
    Download, 
    CheckCircle2, 
    AlertCircle, 
    Award,
    School,
    ChevronDown,
    Check,
    Edit3,
    BookOpen,
    MessageSquare,
    Search,
    ShieldCheck,
    UserCheck
} from 'lucide-react';
import ModalEditNilaiMapel from './Modals/ModalEditNilaiMapel';
import ModalCatatanSikap from './Modals/ModalCatatanSikap';
import ModalPrintRapor from './Modals/ModalPrintRapor';

export default function ERaporIndex({ 
    academicYear,
    classes = [], 
    selectedClassId, 
    selectedClass,
    subjects = [], 
    students = [],
    gradesMap = {},
    evaluations = {},
    schoolProfile
}) {
    const { auth } = usePage().props;
    const userRole = auth?.user?.role || 'siswa';
    const isSiswa = userRole === 'siswa';
    const isPimpinan = userRole === 'pimpinan';
    const isGuruOrAdmin = userRole === 'admin' || userRole === 'guru';

    const [selectedTab, setSelectedTab] = useState(isSiswa ? 'cetak' : 'leger');
    const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || 1);
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState(null);

    // Modal States
    const [modalGrade, setModalGrade] = useState({ isOpen: false, student: null, subject: null, existingGrade: null });
    const [modalSikap, setModalSikap] = useState({ isOpen: false, student: null, existingEvaluation: null });
    const [modalPrint, setModalPrint] = useState({ isOpen: false, student: null });

    const handleClassChange = (e) => {
        router.get(route('erapor.index'), {
            class_id: e.target.value
        });
    };

    const handleVerifyRapor = () => {
        router.post(route('erapor.verify'), {
            class_id: selectedClassId
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setNotification('Seluruh rapor rombel berhasil diverifikasi oleh Wali Kelas.');
                setTimeout(() => setNotification(null), 4000);
            }
        });
    };

    const handleApproveRapor = () => {
        router.post(route('erapor.approve'), {
            class_id: selectedClassId
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setNotification('Seluruh rapor rombel berhasil disahkan secara digital oleh Kepala Sekolah.');
                setTimeout(() => setNotification(null), 4000);
            }
        });
    };

    // Filtered Students
    const filteredStudents = students.filter(s => 
        s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nisn.includes(searchQuery)
    );

    // Get selected subject object
    const selectedSubjectObj = subjects.find(s => s.id === (int => int)(selectedSubjectId)) || subjects[0];

    // Helper to calculate student overall average
    const calculateStudentAverage = (studentId) => {
        const studentGrades = gradesMap[studentId];
        if (!studentGrades) return { avg: 85.00, letter: 'B' };
        
        let sum = 0;
        let count = 0;
        subjects.forEach(sbj => {
            if (studentGrades[sbj.id]) {
                sum += parseFloat(studentGrades[sbj.id].final_score);
                count++;
            }
        });

        const avg = count > 0 ? (sum / count) : 85.00;
        const letter = avg >= 89 ? 'A' : (avg >= 78 ? 'B' : (avg >= 65 ? 'C' : 'D'));
        return { avg: avg.toFixed(2), letter };
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">
                            {isSiswa ? 'Lembar Rapor Digital Siswa' : 'Modul E-Raport Kurikulum Merdeka'}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {isSiswa ? 'Laporan Capaian Hasil Belajar Peserta Didik UPT SDN 9 Gandangbatu Sillanan' : 'Pengolahan Nilai Formatif & Sumatif, Leger, dan Penerbitan Rapor Resmi'}
                        </p>
                    </div>

                    {!isSiswa && (
                        <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                            <button
                                onClick={() => setSelectedTab('leger')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                    selectedTab === 'leger'
                                        ? 'bg-[#800020] text-white shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Leger Rombel
                            </button>
                            <button
                                onClick={() => setSelectedTab('mapel')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                    selectedTab === 'mapel'
                                        ? 'bg-[#800020] text-white shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Input Per Mapel
                            </button>
                            <button
                                onClick={() => setSelectedTab('sikap')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                    selectedTab === 'sikap'
                                        ? 'bg-[#800020] text-white shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Catatan Wali Kelas
                            </button>
                            <button
                                onClick={() => setSelectedTab('cetak')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                    selectedTab === 'cetak'
                                        ? 'bg-[#800020] text-white shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Cetak Rapor
                            </button>
                        </div>
                    )}
                </div>
            }
        >
            <Head title={`${isSiswa ? 'Rapor Saya' : 'E-Raport Kurikulum Merdeka'} - Smart School LMS`} />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Notification toast */}
                {notification && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center space-x-3 shadow-sm animate-fade-in">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="text-xs font-semibold">{notification}</span>
                    </div>
                )}

                {/* Control & Class Selection Bar */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        {!isSiswa ? (
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                                    Pilih Rombongan Belajar (Kelas)
                                </label>
                                <div className="relative inline-block">
                                    <select
                                        value={selectedClassId}
                                        onChange={handleClassChange}
                                        className="h-10 pl-3.5 pr-9 min-w-[180px] bg-white rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:border-[#800020] focus:ring-[#800020] appearance-none cursor-pointer shadow-sm"
                                    >
                                        {classes && classes.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <span className="px-3 py-1.5 rounded-xl bg-[#FDF2F4] text-[#800020] font-bold text-xs border border-[#E8B4B8]">
                                    Peserta Didik: {selectedClass?.name || 'Kelas 6'} &bull; Tahun Ajaran {academicYear?.name || '2026/2027'}
                                </span>
                            </div>
                        )}

                        {/* Search Input */}
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                                Cari Peserta Didik
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Cari berdasarkan nama / NISN..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                                />
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 justify-end pt-2 md:pt-0">
                        {isGuruOrAdmin && (
                            <button 
                                onClick={handleVerifyRapor}
                                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition inline-flex items-center space-x-1.5"
                            >
                                <UserCheck className="w-4 h-4 text-[#800020]" />
                                <span>Verifikasi Wali Kelas</span>
                            </button>
                        )}
                        {isPimpinan && (
                            <button 
                                onClick={handleApproveRapor}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition inline-flex items-center space-x-1.5"
                            >
                                <Check className="w-4 h-4" />
                                <span>Sahkan Rapor Digital</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Ketentuan Predikat Banner */}
                <div className="bg-[#FDF2F4] border border-[#E8B4B8] p-4 rounded-2xl flex items-center justify-between text-xs text-[#800020]">
                    <div className="flex items-center space-x-2.5">
                        <CheckCircle2 className="w-5 h-5 shrink-0 text-[#800020]" />
                        <span>
                            <strong>Ketentuan Predikat:</strong> A (&ge;89), B (78 - 88), C (65 - 77), D (&lt;65)
                        </span>
                    </div>
                    <span className="font-mono font-bold hidden md:block">
                        Kurikulum Merdeka 2026
                    </span>
                </div>

                {/* TAB 1: LEGER CAPAIAN NILAI MATRIX */}
                {selectedTab === 'leger' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
                        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">
                                    Leger Matriks Nilai Akhir {selectedClass?.name || 'Rombel'}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Daftar perolehan Nilai Akhir (NA) seluruh mata pelajaran Kurikulum Merdeka
                                </p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-[#F8F9FA] text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="px-3 py-3.5 w-10 text-center">No</th>
                                        <th className="px-4 py-3.5 min-w-[120px]">NISN</th>
                                        <th className="px-4 py-3.5 min-w-[180px]">Nama Peserta Didik</th>
                                        {subjects.map(s => (
                                            <th key={s.id} className="px-3 py-3.5 text-center min-w-[90px]">
                                                {s.code.split('-')[0]}
                                            </th>
                                        ))}
                                        <th className="px-4 py-3.5 text-center min-w-[100px] bg-slate-100 text-slate-900">Rerata NA</th>
                                        <th className="px-4 py-3.5 text-center min-w-[90px]">Predikat</th>
                                        <th className="px-4 py-3.5 text-center min-w-[110px]">Rapor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {filteredStudents && filteredStudents.length > 0 ? (
                                        filteredStudents.map((s, index) => {
                                            const sGrades = gradesMap[s.id] || {};
                                            const stat = calculateStudentAverage(s.id);
                                            const evalObj = evaluations[s.id] || {};

                                            return (
                                                <tr key={s.id} className="hover:bg-[#FDF2F4]/40 transition">
                                                    <td className="px-3 py-3.5 text-center font-bold text-slate-500">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-4 py-3.5 font-mono text-slate-700">
                                                        {s.nisn}
                                                    </td>
                                                    <td className="px-4 py-3.5 font-bold text-slate-900">
                                                        {s.full_name}
                                                    </td>

                                                    {subjects.map(sbj => {
                                                        const gradeObj = sGrades[sbj.id];
                                                        const score = gradeObj ? gradeObj.final_score : '85.00';
                                                        return (
                                                            <td key={sbj.id} className="px-3 py-3.5 text-center font-mono font-semibold text-slate-800">
                                                                {score}
                                                            </td>
                                                        );
                                                    })}

                                                    <td className="px-4 py-3.5 text-center font-mono font-black text-[#800020] bg-slate-50 text-sm">
                                                        {stat.avg}
                                                    </td>

                                                    <td className="px-4 py-3.5 text-center">
                                                        <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-700 font-semibold border border-emerald-500/20 text-[11px]">
                                                            {stat.letter} ({stat.letter === 'A' ? 'Sangat Baik' : 'Baik'})
                                                        </span>
                                                    </td>

                                                    <td className="px-4 py-3.5 text-center">
                                                        <button
                                                            onClick={() => setModalPrint({ isOpen: true, student: s })}
                                                            className="px-2.5 py-1 bg-[#800020] hover:bg-[#5C0017] text-white text-[11px] font-bold rounded-lg shadow-sm transition inline-flex items-center space-x-1"
                                                        >
                                                            <Printer className="w-3 h-3" />
                                                            <span>Pratinjau</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={subjects.length + 6} className="text-center py-8 text-slate-400">
                                                Tidak ada data peserta didik pada rombel ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 2: INPUT PER MAPEL */}
                {selectedTab === 'mapel' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
                        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">
                                    Pengolahan Nilai Formatif & Sumatif Per Mapel
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Pilih mata pelajaran untuk menginput rerata Tugas, UTS, UAS, dan Capaian Pembelajaran
                                </p>
                            </div>

                            {/* Subject Selector Pill */}
                            <div className="flex items-center space-x-2">
                                <label className="text-xs font-semibold text-slate-500">Mata Pelajaran:</label>
                                <select
                                    value={selectedSubjectId}
                                    onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
                                    className="h-10 px-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                                >
                                    {subjects.map(sbj => (
                                        <option key={sbj.id} value={sbj.id}>{sbj.name} ({sbj.code})</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-[#F8F9FA] text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="px-4 py-3.5 w-12 text-center">No</th>
                                        <th className="px-4 py-3.5 min-w-[120px]">NISN</th>
                                        <th className="px-4 py-3.5 min-w-[180px]">Nama Peserta Didik</th>
                                        <th className="px-4 py-3.5 text-center min-w-[90px]">Tugas (30%)</th>
                                        <th className="px-4 py-3.5 text-center min-w-[90px]">UTS (30%)</th>
                                        <th className="px-4 py-3.5 text-center min-w-[90px]">UAS (40%)</th>
                                        <th className="px-4 py-3.5 text-center min-w-[90px]">Nilai Akhir</th>
                                        <th className="px-4 py-3.5 text-center min-w-[80px]">Predikat</th>
                                        <th className="px-4 py-3.5 min-w-[200px]">Deskripsi Capaian Pembelajaran</th>
                                        <th className="px-4 py-3.5 text-center min-w-[80px]">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {filteredStudents && filteredStudents.length > 0 ? (
                                        filteredStudents.map((s, index) => {
                                            const sGrades = gradesMap[s.id] || {};
                                            const g = sGrades[selectedSubjectId];
                                            const tugas = g ? g.tugas_avg : '85.00';
                                            const uts = g ? g.uts_score : '80.00';
                                            const uas = g ? g.uas_score : '85.00';
                                            const score = g ? g.final_score : '83.50';
                                            const grade = g ? g.letter_grade : 'B';
                                            const desc = g ? g.competency_desc : `Menunjukkan penguasaan yang sangat baik dalam memahami konsep ${selectedSubjectObj?.name || 'Mata Pelajaran'}.`;

                                            return (
                                                <tr key={s.id} className="hover:bg-[#FDF2F4]/40 transition">
                                                    <td className="px-4 py-3.5 text-center font-bold text-slate-500">{index + 1}</td>
                                                    <td className="px-4 py-3.5 font-mono text-slate-700">{s.nisn}</td>
                                                    <td className="px-4 py-3.5 font-bold text-slate-900">{s.full_name}</td>
                                                    <td className="px-4 py-3.5 text-center font-mono font-semibold text-slate-800">{tugas}</td>
                                                    <td className="px-4 py-3.5 text-center font-mono font-semibold text-slate-800">{uts}</td>
                                                    <td className="px-4 py-3.5 text-center font-mono font-semibold text-slate-800">{uas}</td>
                                                    <td className="px-4 py-3.5 text-center font-mono font-black text-[#800020] text-sm">{score}</td>
                                                    <td className="px-4 py-3.5 text-center">
                                                        <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 font-semibold border border-blue-500/20 text-[10px]">
                                                            {grade}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3.5 text-slate-600 truncate max-w-xs">{desc}</td>
                                                    <td className="px-4 py-3.5 text-center">
                                                        <button
                                                            onClick={() => setModalGrade({
                                                                isOpen: true,
                                                                student: s,
                                                                subject: selectedSubjectObj,
                                                                existingGrade: g
                                                            })}
                                                            className="p-1.5 bg-slate-100 hover:bg-[#800020] text-slate-600 hover:text-white rounded-lg transition"
                                                            title="Edit Nilai"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={10} className="text-center py-8 text-slate-400">
                                                Tidak ada data peserta didik pada rombel ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 3: CATATAN & NILAI SIKAP WALI KELAS */}
                {selectedTab === 'sikap' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
                        <div className="px-6 py-4 border-b border-slate-200">
                            <h3 className="text-base font-bold text-slate-900">
                                Evaluation Sikap & Catatan Wali Kelas
                            </h3>
                            <p className="text-xs text-slate-500">
                                Penilaian Karakter Profil Pelajar Pancasila dan Catatan Motivasi Rapor
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-[#F8F9FA] text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="px-4 py-3.5 w-12 text-center">No</th>
                                        <th className="px-4 py-3.5 min-w-[120px]">NISN</th>
                                        <th className="px-4 py-3.5 min-w-[180px]">Nama Peserta Didik</th>
                                        <th className="px-4 py-3.5 text-center min-w-[120px]">Nilai Sikap</th>
                                        <th className="px-4 py-3.5 min-w-[280px]">Catatan Wali Kelas</th>
                                        <th className="px-4 py-3.5 text-center min-w-[80px]">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {filteredStudents && filteredStudents.length > 0 ? (
                                        filteredStudents.map((s, index) => {
                                            const ev = evaluations[s.id] || {};
                                            const attitude = ev.attitude_score || 'Baik';
                                            const notes = ev.homeroom_notes || 'Menunjukkan perkembangan akademis yang sangat memuaskan, aktif dalam kegiatan pembelajaran serta bersikap sopan dan santun.';

                                            return (
                                                <tr key={s.id} className="hover:bg-[#FDF2F4]/40 transition">
                                                    <td className="px-4 py-3.5 text-center font-bold text-slate-500">{index + 1}</td>
                                                    <td className="px-4 py-3.5 font-mono text-slate-700">{s.nisn}</td>
                                                    <td className="px-4 py-3.5 font-bold text-slate-900">{s.full_name}</td>
                                                    <td className="px-4 py-3.5 text-center">
                                                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                                                            attitude === 'Sangat Baik' 
                                                                ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' 
                                                                : attitude === 'Baik' 
                                                                ? 'bg-blue-500/10 text-blue-700 border-blue-500/20'
                                                                : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                                                        }`}>
                                                            {attitude}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3.5 text-slate-600 leading-relaxed italic">{notes}</td>
                                                    <td className="px-4 py-3.5 text-center">
                                                        <button
                                                            onClick={() => setModalSikap({
                                                                isOpen: true,
                                                                student: s,
                                                                existingEvaluation: ev
                                                            })}
                                                            className="p-1.5 bg-slate-100 hover:bg-[#800020] text-slate-600 hover:text-white rounded-lg transition"
                                                            title="Edit Catatan & Sikap"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="text-center py-8 text-slate-400">
                                                Tidak ada data peserta didik pada rombel ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 4: CETAK & PENGESAHAN RAPOR */}
                {selectedTab === 'cetak' && (
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">
                                    Status Penerbitan & Cetak Rapor Digital
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Cetak Lembar Rapor Resmi Kurikulum Merdeka UPT SDN 9 Gandangbatu Sillanan
                                </p>
                            </div>
                            <span className="text-xs text-slate-600 font-medium bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                                Pengesahan Kepsek: <strong className="text-slate-900">{schoolProfile?.principal_name || 'Hendrika Genti, S.Pd.SD.'}</strong>
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredStudents && filteredStudents.map((s) => {
                                const ev = evaluations[s.id] || {};
                                const isApproved = ev.status === 'approved_kepsek';
                                const isVerified = ev.status === 'verified_wali_kelas' || isApproved;

                                return (
                                    <div key={s.id} className="p-4 rounded-2xl border border-slate-200 hover:border-[#E8B4B8] flex items-center justify-between bg-white hover:bg-[#FDF2F4]/20 transition shadow-sm">
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold text-slate-900">{s.full_name}</h4>
                                            <p className="text-xs text-slate-500 font-mono">NISN: {s.nisn} &bull; NIS: {s.nis}</p>
                                            <div className="flex items-center space-x-1.5 pt-0.5">
                                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                                                    isApproved
                                                        ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                                                        : isVerified
                                                        ? 'bg-blue-500/10 text-blue-700 border-blue-500/20'
                                                        : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                                                }`}>
                                                    {isApproved ? 'Sah & Disetujui Kepsek' : isVerified ? 'Terverifikasi Wali Kelas' : 'Draft Rapor'}
                                                </span>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => setModalPrint({ isOpen: true, student: s })}
                                            className="px-3.5 py-2 bg-[#800020] hover:bg-[#5C0017] text-white rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 shadow-md transition"
                                        >
                                            <Printer className="w-3.5 h-3.5" />
                                            <span>{isSiswa ? 'Cetak PDF Saya' : 'Cetak Rapor'}</span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <ModalEditNilaiMapel 
                isOpen={modalGrade.isOpen}
                onClose={() => setModalGrade({ ...modalGrade, isOpen: false })}
                student={modalGrade.student}
                subject={modalGrade.subject}
                existingGrade={modalGrade.existingGrade}
            />

            <ModalCatatanSikap 
                isOpen={modalSikap.isOpen}
                onClose={() => setModalSikap({ ...modalSikap, isOpen: false })}
                student={modalSikap.student}
                existingEvaluation={modalSikap.existingEvaluation}
            />

            <ModalPrintRapor 
                isOpen={modalPrint.isOpen}
                onClose={() => setModalPrint({ ...modalPrint, isOpen: false })}
                student={modalPrint.student}
                selectedClass={selectedClass}
                academicYear={academicYear}
                subjects={subjects}
                gradesMap={gradesMap}
                evaluations={evaluations}
                schoolProfile={schoolProfile}
            />
        </AuthenticatedLayout>
    );
}
