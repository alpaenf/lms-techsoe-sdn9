import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { 
    CalendarCheck, 
    Calendar, 
    Save, 
    Check, 
    Clock, 
    Download, 
    Users, 
    UserCheck, 
    Briefcase, 
    CheckCircle2, 
    RotateCcw, 
    ChevronDown,
    FileText,
    PlusCircle,
    XCircle,
    CheckCircle,
    Percent,
    PieChart
} from 'lucide-react';
import ModalPengajuanIzin from './Modals/ModalPengajuanIzin';

export default function PresensiIndex({ 
    type = 'siswa', 
    classes = [], 
    selectedClassId, 
    selectedDate,
    selectedMonth = 9,
    selectedYear = 2026,
    students = [], 
    teachers = [],
    monthlyRecap = {},
    permissions = []
}) {
    const { auth } = usePage().props;
    const userRole = auth?.user?.role || 'siswa';
    const isSiswa = userRole === 'siswa';
    const isGuruOrAdmin = userRole === 'admin' || userRole === 'guru' || userRole === 'pimpinan';
    const isGuru = type === 'guru';

    const [activeTab, setActiveTab] = useState('harian'); // 'harian', 'rekap', 'izin'
    const [isSaving, setIsSaving] = useState(false);
    const [notification, setNotification] = useState(null);
    const [isModalPermissionOpen, setIsModalPermissionOpen] = useState(false);

    // State for students attendance
    const [studentData, setStudentData] = useState(() => {
        const initial = {};
        (students || []).forEach(s => {
            initial[s.id] = {
                status: s.attendance_status || 'Hadir',
                notes: s.attendance_notes || ''
            };
        });
        return initial;
    });

    // State for teachers attendance
    const [teacherData, setTeacherData] = useState(() => {
        const initial = {};
        (teachers || []).forEach(t => {
            initial[t.id] = {
                status: t.attendance_status || 'Hadir',
                check_in_time: t.check_in_time || '07:15',
                notes: t.attendance_notes || ''
            };
        });
        return initial;
    });

    useEffect(() => {
        const initialS = {};
        (students || []).forEach(s => {
            initialS[s.id] = {
                status: s.attendance_status || 'Hadir',
                notes: s.attendance_notes || ''
            };
        });
        setStudentData(initialS);
    }, [students]);

    useEffect(() => {
        const initialT = {};
        (teachers || []).forEach(t => {
            initialT[t.id] = {
                status: t.attendance_status || 'Hadir',
                check_in_time: t.check_in_time || '07:15',
                notes: t.attendance_notes || ''
            };
        });
        setTeacherData(initialT);
    }, [teachers]);

    const handleSwitchType = (newType) => {
        router.get(route('presensi.index'), {
            type: newType,
            class_id: selectedClassId,
            date: selectedDate
        });
    };

    const handleDateChange = (e) => {
        router.get(route('presensi.index'), {
            type,
            class_id: selectedClassId,
            date: e.target.value
        });
    };

    const handleClassChange = (e) => {
        router.get(route('presensi.index'), {
            type: 'siswa',
            class_id: e.target.value,
            date: selectedDate
        });
    };

    const setStudentStatus = (studentId, status) => {
        setStudentData(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                status
            }
        }));
    };

    const setTeacherStatus = (teacherId, status) => {
        setTeacherData(prev => ({
            ...prev,
            [teacherId]: {
                ...prev[teacherId],
                status
            }
        }));
    };

    const markAllStudentsPresent = () => {
        const updated = {};
        (students || []).forEach(s => {
            updated[s.id] = {
                ...studentData[s.id],
                status: 'Hadir'
            };
        });
        setStudentData(updated);
    };

    const markAllTeachersPresent = () => {
        const updated = {};
        (teachers || []).forEach(t => {
            updated[t.id] = {
                ...teacherData[t.id],
                status: 'Hadir'
            };
        });
        setTeacherData(updated);
    };

    const handleSave = () => {
        setIsSaving(true);
        if (isGuru) {
            const records = (teachers || []).map(t => ({
                teacher_id: t.id,
                status: teacherData[t.id]?.status || 'Hadir',
                check_in_time: teacherData[t.id]?.check_in_time || '07:15',
                notes: teacherData[t.id]?.notes || ''
            }));

            router.post(route('presensi.store'), {
                type: 'guru',
                date: selectedDate,
                records
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSaving(false);
                    setNotification('Presensi pendidik berhasil disimpan ke basis data.');
                    setTimeout(() => setNotification(null), 4000);
                },
                onError: () => {
                    setIsSaving(false);
                }
            });
        } else {
            const records = (students || []).map(s => ({
                student_id: s.id,
                status: studentData[s.id]?.status || 'Hadir',
                notes: studentData[s.id]?.notes || ''
            }));

            router.post(route('presensi.store'), {
                type: 'siswa',
                class_id: selectedClassId,
                date: selectedDate,
                records
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSaving(false);
                    setNotification('Presensi siswa berhasil disimpan ke basis data.');
                    setTimeout(() => setNotification(null), 4000);
                },
                onError: () => {
                    setIsSaving(false);
                }
            });
        }
    };

    const handlePermissionStatus = (permId, newStatus) => {
        router.post(route('presensi.permissions.update-status', permId), {
            status: newStatus
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setNotification(`Status surat permohonan berhasil diperbarui menjadi ${newStatus}.`);
                setTimeout(() => setNotification(null), 4000);
            }
        });
    };

    // Calculate summary statistics
    const stats = isGuru ? {
        hadir: (teachers || []).filter(t => (teacherData[t.id]?.status || 'Hadir') === 'Hadir').length,
        dinas: (teachers || []).filter(t => teacherData[t.id]?.status === 'Dinas_Luar').length,
        izin: (teachers || []).filter(t => teacherData[t.id]?.status === 'Izin').length,
        sakit: (teachers || []).filter(t => teacherData[t.id]?.status === 'Sakit').length,
        alpa: (teachers || []).filter(t => teacherData[t.id]?.status === 'Alpa').length,
        total: (teachers || []).length
    } : {
        hadir: (students || []).filter(s => (studentData[s.id]?.status || 'Hadir') === 'Hadir').length,
        izin: (students || []).filter(s => studentData[s.id]?.status === 'Izin').length,
        sakit: (students || []).filter(s => studentData[s.id]?.status === 'Sakit').length,
        alpa: (students || []).filter(s => studentData[s.id]?.status === 'Alpa').length,
        total: (students || []).length
    };

    const monthsName = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">
                            {isSiswa ? 'Catatan Kehadiran Saya' : (isGuru ? 'Presensi Tenaga Pendidik & Pegawai' : 'Presensi Siswa Harian')}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {isSiswa ? 'Rekapitulasi riwayat presensi mandiri peserta didik UPT SDN 9 Gandangbatu Sillanan' : 'Pencatatan Kehadiran, Rekapitulasi Bulanan, & Pengajuan Surat Izin'}
                        </p>
                    </div>

                    <div className="flex items-center space-x-2">
                        {/* Tab Selector */}
                        <div className="p-1 bg-slate-100 rounded-xl border border-slate-200 flex items-center space-x-1">
                            <button
                                type="button"
                                onClick={() => setActiveTab('harian')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                    activeTab === 'harian'
                                        ? 'bg-[#800020] text-white shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Presensi Harian
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('rekap')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                    activeTab === 'rekap'
                                        ? 'bg-[#800020] text-white shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Rekap Bulanan
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('izin')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                    activeTab === 'izin'
                                        ? 'bg-[#800020] text-white shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Surat Izin ({permissions.length})
                            </button>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`Presensi ${isGuru ? 'Pendidik' : 'Siswa'} - Smart School LMS`} />

            <div className="space-y-6 max-w-6xl mx-auto">
                {/* Notification toast */}
                {notification && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center space-x-3 shadow-sm animate-fade-in">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="text-xs font-semibold">{notification}</span>
                    </div>
                )}

                {/* Switcher & Filters */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        {isGuruOrAdmin && (
                            <div className="p-1 bg-slate-100 rounded-xl border border-slate-200 flex items-center space-x-1">
                                <button
                                    type="button"
                                    onClick={() => handleSwitchType('siswa')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                                        !isGuru 
                                            ? 'bg-white text-[#800020] shadow-sm' 
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    <Users className="w-3.5 h-3.5" />
                                    <span>Siswa</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSwitchType('guru')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                                        isGuru 
                                            ? 'bg-white text-[#800020] shadow-sm' 
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    <Briefcase className="w-3.5 h-3.5" />
                                    <span>Guru & Pegawai</span>
                                </button>
                            </div>
                        )}

                        {!isGuru && !isSiswa && (
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                                    Pilih Rombongan Belajar
                                </label>
                                <div className="relative inline-block">
                                    <select
                                        value={selectedClassId}
                                        onChange={handleClassChange}
                                        className="h-10 pl-3.5 pr-9 min-w-[170px] bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-[#800020] focus:ring-[#800020] appearance-none cursor-pointer shadow-sm"
                                    >
                                        {classes && classes.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                        )}

                        {activeTab === 'harian' && (
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                                    Tanggal Presensi
                                </label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    className="h-10 px-3 rounded-xl border border-slate-300 text-xs font-mono font-medium text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                                />
                            </div>
                        )}

                        {!isSiswa && activeTab === 'harian' && (
                            <div className="flex items-end pt-5">
                                <button
                                    type="button"
                                    onClick={isGuru ? markAllTeachersPresent : markAllStudentsPresent}
                                    className="h-10 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition inline-flex items-center space-x-1.5"
                                >
                                    <UserCheck className="w-3.5 h-3.5 text-[#800020]" />
                                    <span>Tandai Semua Hadir</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-2 justify-end pt-2 md:pt-0">
                        <button
                            type="button"
                            onClick={() => setIsModalPermissionOpen(true)}
                            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition inline-flex items-center space-x-1.5"
                        >
                            <FileText className="w-4 h-4 text-[#800020]" />
                            <span>Ajukan Surat Izin</span>
                        </button>

                        {!isSiswa && activeTab === 'harian' && (
                            <button
                                type="button"
                                disabled={isSaving}
                                onClick={handleSave}
                                className="px-6 py-2.5 bg-[#800020] hover:bg-[#5C0017] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition inline-flex items-center justify-center space-x-2"
                            >
                                <Save className="w-4 h-4" />
                                <span>{isSaving ? 'Menyimpan...' : 'Simpan Presensi'}</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Summary Stat Pills */}
                {activeTab === 'harian' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total</p>
                                <p className="text-lg font-extrabold text-slate-800">{stats.total}</p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                                <Users className="w-4 h-4" />
                            </div>
                        </div>

                        <div className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-600">Hadir</p>
                                <p className="text-lg font-extrabold text-emerald-700">{stats.hadir}</p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <Check className="w-4 h-4" />
                            </div>
                        </div>

                        {isGuru && (
                            <div className="bg-white p-3.5 rounded-xl border border-indigo-200 shadow-sm flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] uppercase font-bold tracking-wider text-indigo-600">Dinas Luar</p>
                                    <p className="text-lg font-extrabold text-indigo-700">{stats.dinas}</p>
                                </div>
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <Briefcase className="w-4 h-4" />
                                </div>
                            </div>
                        )}

                        <div className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-[10px] uppercase font-bold tracking-wider text-amber-600">Izin / Sakit</p>
                                <p className="text-lg font-extrabold text-amber-700">{stats.izin + stats.sakit}</p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                                <Clock className="w-4 h-4" />
                            </div>
                        </div>

                        <div className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-[10px] uppercase font-bold tracking-wider text-rose-600">Alpa</p>
                                <p className="text-lg font-extrabold text-rose-700">{stats.alpa}</p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                                <RotateCcw className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 1: PRESENSI HARIAN */}
                {activeTab === 'harian' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            {isGuru ? (
                                /* Guru Attendance Table */
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-[#F8F9FA] text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold">
                                        <tr>
                                            <th className="px-4 py-3.5 w-12 text-center">No</th>
                                            <th className="px-4 py-3.5">NIP / Identitas</th>
                                            <th className="px-4 py-3.5">Nama Tenaga Pendidik</th>
                                            <th className="px-4 py-3.5 text-center">Jam Hadir</th>
                                            <th className="px-4 py-3.5 text-center">Pilihan Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {teachers && teachers.length > 0 ? (
                                            teachers.map((teacher, idx) => {
                                                const current = teacherData[teacher.id] || { status: 'Hadir' };
                                                return (
                                                    <tr key={teacher.id} className="hover:bg-[#FDF2F4]/50 transition">
                                                        <td className="px-4 py-3.5 text-center font-bold text-slate-500">{idx + 1}</td>
                                                        <td className="px-4 py-3.5 font-mono text-slate-700">{teacher.nip || '-'}</td>
                                                        <td className="px-4 py-3.5">
                                                            <span className="font-bold text-slate-900 block">{teacher.full_name}</span>
                                                            <span className="text-[10px] text-slate-500 block">Status: {teacher.employment_status || 'PNS'}</span>
                                                        </td>
                                                        <td className="px-4 py-3.5 text-center">
                                                            <input 
                                                                type="time" 
                                                                value={current.check_in_time || '07:15'}
                                                                onChange={(e) => {
                                                                    setTeacherData(prev => ({
                                                                        ...prev,
                                                                        [teacher.id]: {
                                                                            ...prev[teacher.id],
                                                                            check_in_time: e.target.value
                                                                        }
                                                                    }));
                                                                }}
                                                                className="h-8 px-2 rounded-lg border border-slate-300 text-xs font-mono text-center focus:border-[#800020] focus:ring-[#800020]"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-3.5 text-center">
                                                            <div className="inline-flex items-center space-x-1 p-1 bg-slate-100 rounded-xl">
                                                                {['Hadir', 'Dinas_Luar', 'Izin', 'Sakit', 'Alpa'].map(st => (
                                                                    <button
                                                                        key={st}
                                                                        type="button"
                                                                        onClick={() => setTeacherStatus(teacher.id, st)}
                                                                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                                                                            current.status === st
                                                                                ? 'bg-[#800020] text-white shadow-sm'
                                                                                : 'text-slate-600 hover:text-slate-900'
                                                                        }`}
                                                                    >
                                                                        {st.replace('_', ' ')}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="text-center py-8 text-slate-400">Tidak ada data tenaga pendidik.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            ) : (
                                /* Students Attendance Table */
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-[#F8F9FA] text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold">
                                        <tr>
                                            <th className="px-4 py-3.5 w-12 text-center">No</th>
                                            <th className="px-4 py-3.5">NISN / NIS</th>
                                            <th className="px-4 py-3.5">Nama Lengkap Siswa</th>
                                            <th className="px-4 py-3.5 text-center">Jenis Kelamin</th>
                                            <th className="px-4 py-3.5 text-center">Pilihan Kehadiran (H / I / S / A)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {students && students.length > 0 ? (
                                            students.map((student, idx) => {
                                                const current = studentData[student.id] || { status: 'Hadir' };
                                                return (
                                                    <tr key={student.id} className="hover:bg-[#FDF2F4]/50 transition">
                                                        <td className="px-4 py-3.5 text-center font-bold text-slate-500">{idx + 1}</td>
                                                        <td className="px-4 py-3.5 font-mono text-slate-700">{student.nisn}</td>
                                                        <td className="px-4 py-3.5 font-bold text-slate-900">{student.full_name}</td>
                                                        <td className="px-4 py-3.5 text-center text-slate-600">{student.gender === 'L' ? 'L' : 'P'}</td>
                                                        <td className="px-4 py-3.5 text-center">
                                                            {isSiswa ? (
                                                                <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold ${
                                                                    current.status === 'Hadir' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                                                }`}>
                                                                    {current.status || 'Hadir'}
                                                                </span>
                                                            ) : (
                                                                <div className="inline-flex items-center space-x-1 p-1 bg-slate-100 rounded-xl">
                                                                    {['Hadir', 'Izin', 'Sakit', 'Alpa'].map(st => (
                                                                        <button
                                                                            key={st}
                                                                            type="button"
                                                                            onClick={() => setStudentStatus(student.id, st)}
                                                                            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                                                                                current.status === st
                                                                                    ? (st === 'Hadir' ? 'bg-emerald-600 text-white' : st === 'Izin' ? 'bg-amber-500 text-white' : st === 'Sakit' ? 'bg-blue-600 text-white' : 'bg-rose-600 text-white')
                                                                                    : 'text-slate-600 hover:text-slate-900'
                                                                            }`}
                                                                        >
                                                                            {st}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="text-center py-8 text-slate-400">Tidak ada data siswa untuk rombel ini.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 2: REKAP BULANAN & PERSENTASE KEHADIRAN */}
                {activeTab === 'rekap' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
                        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">
                                    Rekapitulasi Presensi Bulan {monthsName[selectedMonth - 1]} {selectedYear}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Akumulasi jumlah kehadiran dan persentase (%) tingkat presensi
                                </p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-[#F8F9FA] text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="px-4 py-3.5 w-12 text-center">No</th>
                                        <th className="px-4 py-3.5">Nama {isGuru ? 'Pendidik' : 'Siswa'}</th>
                                        <th className="px-4 py-3.5 text-center">Hadir</th>
                                        {isGuru && <th className="px-4 py-3.5 text-center">Dinas Luar</th>}
                                        <th className="px-4 py-3.5 text-center">Izin</th>
                                        <th className="px-4 py-3.5 text-center">Sakit</th>
                                        <th className="px-4 py-3.5 text-center">Alpa</th>
                                        <th className="px-4 py-3.5 text-center">% Kehadiran</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {(isGuru ? teachers : students).map((person, idx) => {
                                        const rec = monthlyRecap[person.id] || { hadir: 0, izin: 0, sakit: 0, alpa: 0, percentage: 100 };
                                        return (
                                            <tr key={person.id} className="hover:bg-[#FDF2F4]/40 transition">
                                                <td className="px-4 py-3.5 text-center font-bold text-slate-500">{idx + 1}</td>
                                                <td className="px-4 py-3.5 font-bold text-slate-900">{person.full_name}</td>
                                                <td className="px-4 py-3.5 text-center font-mono font-bold text-emerald-700">{rec.hadir}</td>
                                                {isGuru && <td className="px-4 py-3.5 text-center font-mono font-bold text-indigo-700">{rec.dinas || 0}</td>}
                                                <td className="px-4 py-3.5 text-center font-mono font-bold text-amber-600">{rec.izin}</td>
                                                <td className="px-4 py-3.5 text-center font-mono font-bold text-blue-600">{rec.sakit}</td>
                                                <td className="px-4 py-3.5 text-center font-mono font-bold text-rose-600">{rec.alpa}</td>
                                                <td className="px-4 py-3.5 text-center font-mono font-bold">
                                                    <span className={`px-2.5 py-1 rounded-full border text-xs ${
                                                        rec.percentage >= 90 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                                                    }`}>
                                                        {rec.percentage}%
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 3: SURAT IZIN & SAKIT */}
                {activeTab === 'izin' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
                        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">
                                    Daftar Pengajuan Surat Izin & Sakit
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Verifikasi dan konfirmasi surat permohonan izin peserta didik
                                </p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-[#F8F9FA] text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="px-4 py-3.5">Pemohon</th>
                                        <th className="px-4 py-3.5 text-center">Kategori</th>
                                        <th className="px-4 py-3.5 text-center">Periode Izin</th>
                                        <th className="px-4 py-3.5 min-w-[250px]">Alasan Permohonan</th>
                                        <th className="px-4 py-3.5 text-center">Status</th>
                                        {isGuruOrAdmin && <th className="px-4 py-3.5 text-center">Aksi Konfirmasi</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {permissions && permissions.length > 0 ? (
                                        permissions.map((p) => (
                                            <tr key={p.id} className="hover:bg-[#FDF2F4]/40 transition">
                                                <td className="px-4 py-3.5 font-bold text-slate-900">
                                                    {p.student_name || p.teacher_name || p.submitter_name}
                                                </td>
                                                <td className="px-4 py-3.5 text-center font-bold text-slate-700">
                                                    {p.permission_type}
                                                </td>
                                                <td className="px-4 py-3.5 text-center font-mono text-slate-600">
                                                    {p.start_date} s/d {p.end_date}
                                                </td>
                                                <td className="px-4 py-3.5 text-slate-600 leading-relaxed">{p.reason}</td>
                                                <td className="px-4 py-3.5 text-center">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                                                        p.status === 'approved' 
                                                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                                            : p.status === 'rejected' 
                                                            ? 'bg-rose-50 text-rose-800 border-rose-200' 
                                                            : 'bg-amber-50 text-amber-800 border-amber-200'
                                                    }`}>
                                                        {p.status === 'approved' ? 'Disetujui' : p.status === 'rejected' ? 'Ditolak' : 'Menunggu Approval'}
                                                    </span>
                                                </td>
                                                {isGuruOrAdmin && (
                                                    <td className="px-4 py-3.5 text-center">
                                                        {p.status === 'pending' ? (
                                                            <div className="inline-flex items-center space-x-1">
                                                                <button
                                                                    onClick={() => handlePermissionStatus(p.id, 'approved')}
                                                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-sm transition"
                                                                >
                                                                    Setujui
                                                                </button>
                                                                <button
                                                                    onClick={() => handlePermissionStatus(p.id, 'rejected')}
                                                                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px] shadow-sm transition"
                                                                >
                                                                    Tolak
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-[11px] text-slate-400 font-semibold">Selesai</span>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="text-center py-8 text-slate-400">Belum ada pengajuan surat izin / sakit.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Pengajuan Izin */}
            <ModalPengajuanIzin 
                isOpen={isModalPermissionOpen}
                onClose={() => setIsModalPermissionOpen(false)}
            />
        </AuthenticatedLayout>
    );
}
