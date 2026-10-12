import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage, Link } from '@inertiajs/react';
import {
    BookOpen,
    Calendar,
    PlusCircle,
    Printer,
    Edit3,
    Trash2,
    Search,
    ChevronDown,
    Clock,
    Users,
    Layers,
    CheckCircle2,
    FileText,
    Filter
} from 'lucide-react';
import ModalJournal from './Modals/ModalJournal';

export default function TeacherJournalIndex({
    journals = [],
    selectedMonth = 10,
    selectedYear = 2026,
    filterClassId = null,
    filterSubjectId = null,
    currentTeacher = null,
    allTeachers = [],
    classes = [],
    subjects = [],
    availableClasses = [],
    availableSubjects = [],
    defaultClassId = null,
    defaultSubjectId = null,
    stats = {},
    schoolProfile = null,
    academicYear = null,
}) {
    const { auth } = usePage().props;
    const userRole = auth?.user?.role || 'siswa';
    const isTeacher = ['guru', 'guru_mapel'].includes(userRole);
    const isAdminOrPrincipal = ['admin', 'pimpinan'].includes(userRole);

    const [month, setMonth] = useState(selectedMonth);
    const [year, setYear] = useState(selectedYear);
    const [classId, setClassId] = useState(filterClassId ? String(filterClassId) : '');
    const [subjectId, setSubjectId] = useState(filterSubjectId ? String(filterSubjectId) : '');
    const [teacherId, setTeacherId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJournal, setEditingJournal] = useState(null);

    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayDayName = dayNames[new Date().getDay()];

    const initialClass = defaultClassId ? String(defaultClassId) : (availableClasses[0]?.id ? String(availableClasses[0].id) : '');
    const initialSubject = defaultSubjectId ? String(defaultSubjectId) : (availableSubjects[0]?.id ? String(availableSubjects[0].id) : '');

    const [journalForm, setJournalForm] = useState({
        class_id: initialClass,
        subject_id: initialSubject,
        journal_date: todayStr,
        day_name: todayDayName,
        start_time: '07:30',
        end_time: '09:00',
        material_topic: '',
        activity_description: '',
        learning_media: '',
        attendance_notes: '',
        notes: '',
        status: 'selesai',
    });

    const monthOptions = [
        { value: 1, label: 'Januari' },
        { value: 2, label: 'Februari' },
        { value: 3, label: 'Maret' },
        { value: 4, label: 'April' },
        { value: 5, label: 'Mei' },
        { value: 6, label: 'Juni' },
        { value: 7, label: 'Juli' },
        { value: 8, label: 'Agustus' },
        { value: 9, label: 'September' },
        { value: 10, label: 'Oktober' },
        { value: 11, label: 'November' },
        { value: 12, label: 'Desember' },
    ];

    const yearOptions = [2025, 2026, 2027];

    const handleApplyFilter = (newMonth, newYear, newClass, newSubj, newTeacher) => {
        router.get(route('journals.index'), {
            month: newMonth !== undefined ? newMonth : month,
            year: newYear !== undefined ? newYear : year,
            class_id: newClass !== undefined ? newClass : classId,
            subject_id: newSubj !== undefined ? newSubj : subjectId,
            teacher_id: newTeacher !== undefined ? newTeacher : teacherId,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const openCreateModal = () => {
        setEditingJournal(null);
        setJournalForm({
            class_id: initialClass,
            subject_id: initialSubject,
            journal_date: todayStr,
            day_name: todayDayName,
            start_time: '07:30',
            end_time: '09:00',
            material_topic: '',
            activity_description: '',
            learning_media: '',
            attendance_notes: '',
            notes: '',
            status: 'selesai',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (journal) => {
        setEditingJournal(journal);
        const dateStr = journal.journal_date ? String(journal.journal_date).slice(0, 10) : todayStr;
        setJournalForm({
            class_id: String(journal.class_id),
            subject_id: String(journal.subject_id),
            journal_date: dateStr,
            day_name: journal.day_name || 'Senin',
            start_time: journal.start_time ? journal.start_time.slice(0, 5) : '',
            end_time: journal.end_time ? journal.end_time.slice(0, 5) : '',
            material_topic: journal.material_topic || '',
            activity_description: journal.activity_description || '',
            learning_media: journal.learning_media || '',
            attendance_notes: journal.attendance_notes || '',
            notes: journal.notes || '',
            status: journal.status || 'selesai',
        });
        setIsModalOpen(true);
    };

    const handleSaveJournal = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (editingJournal) {
            router.put(route('journals.update', editingJournal.id), journalForm, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    setIsModalOpen(false);
                    setNotification('Catatan jurnal harian berhasil diperbarui.');
                    setTimeout(() => setNotification(null), 4000);
                },
                onError: () => setIsSubmitting(false),
            });
        } else {
            router.post(route('journals.store'), journalForm, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    setIsModalOpen(false);
                    setNotification('Catatan jurnal harian baru berhasil diterbitkan.');
                    setTimeout(() => setNotification(null), 4000);
                },
                onError: () => setIsSubmitting(false),
            });
        }
    };

    const handleDeleteJournal = (journal) => {
        if (confirm(`Apakah Anda yakin ingin menghapus jurnal tanggal ${journal.journal_date} (${journal.material_topic})?`)) {
            router.delete(route('journals.destroy', journal.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setNotification('Catatan jurnal berhasil dihapus.');
                    setTimeout(() => setNotification(null), 4000);
                },
            });
        }
    };

    // Filtered by local search query
    const filteredJournals = journals.filter(j => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            (j.material_topic && j.material_topic.toLowerCase().includes(q)) ||
            (j.activity_description && j.activity_description.toLowerCase().includes(q)) ||
            (j.subject?.name && j.subject.name.toLowerCase().includes(q)) ||
            (j.class?.name && j.class.name.toLowerCase().includes(q))
        );
    });

    const activeMonthName = monthOptions.find(m => m.value === month)?.label || 'Bulan';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">
                            Jurnal Harian Guru & Logbook Mengajar
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Pencatatan materi pokok, uraian kegiatan pembelajaran, dan rekapitulasi cetak bulanan
                        </p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Link
                            href={route('journals.print-monthly', {
                                month,
                                year,
                                class_id: classId || undefined,
                                subject_id: subjectId || undefined,
                                teacher_id: teacherId || undefined,
                            })}
                            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-sm transition inline-flex items-center space-x-1.5"
                        >
                            <Printer className="w-4 h-4 text-[#800020]" />
                            <span>Cetak Bulanan (PDF)</span>
                        </Link>

                        <button
                            type="button"
                            onClick={openCreateModal}
                            className="px-4 py-2 bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold rounded-xl shadow-md transition inline-flex items-center space-x-1.5"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>Tambah Jurnal</span>
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Jurnal Harian Guru - ${activeMonthName} ${year}`} />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Notification */}
                {notification && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center space-x-3 shadow-sm animate-fade-in">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="text-xs font-semibold">{notification}</span>
                    </div>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#800020] shrink-0 font-bold">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Pembelajaran</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                                {stats.total_entries || journals.length} <span className="text-xs font-semibold text-slate-500">Pertemuan</span>
                            </h3>
                            <p className="text-[11px] text-slate-500 font-medium">Bulan {activeMonthName} {year}</p>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 shrink-0 font-bold">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rombel / Kelas Aktif</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                                {stats.unique_classes || 0} <span className="text-xs font-semibold text-slate-500">Kelas Terjangkau</span>
                            </h3>
                            <p className="text-[11px] text-slate-500 font-medium">Berdasarkan entri jurnal</p>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 font-bold">
                            <Layers className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mata Pelajaran</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                                {stats.unique_subjects || 0} <span className="text-xs font-semibold text-slate-500">Mapel Terlaksana</span>
                            </h3>
                            <p className="text-[11px] text-slate-500 font-medium">Kurikulum reguler</p>
                        </div>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                        {/* Bulan Selector */}
                        <div className="relative inline-block">
                            <select
                                value={month}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    setMonth(val);
                                    handleApplyFilter(val, year, classId, subjectId, teacherId);
                                }}
                                className="h-10 pl-3.5 pr-8 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-[#800020] focus:ring-[#800020] appearance-none cursor-pointer shadow-sm"
                            >
                                {monthOptions.map(m => (
                                    <option key={m.value} value={m.value}>{m.label}</option>
                                ))}
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* Tahun Selector */}
                        <div className="relative inline-block">
                            <select
                                value={year}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    setYear(val);
                                    handleApplyFilter(month, val, classId, subjectId, teacherId);
                                }}
                                className="h-10 pl-3.5 pr-8 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-[#800020] focus:ring-[#800020] appearance-none cursor-pointer shadow-sm"
                            >
                                {yearOptions.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* Kelas Filter */}
                        <div className="relative inline-block">
                            <select
                                value={classId}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setClassId(val);
                                    handleApplyFilter(month, year, val, subjectId, teacherId);
                                }}
                                className="h-10 pl-3.5 pr-8 min-w-[150px] bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-[#800020] focus:ring-[#800020] appearance-none cursor-pointer shadow-sm"
                            >
                                <option value="">Semua Rombel</option>
                                {(isTeacher ? availableClasses : classes).map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* Mapel Filter */}
                        <div className="relative inline-block">
                            <select
                                value={subjectId}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSubjectId(val);
                                    handleApplyFilter(month, year, classId, val, teacherId);
                                }}
                                className="h-10 pl-3.5 pr-8 min-w-[160px] bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-[#800020] focus:ring-[#800020] appearance-none cursor-pointer shadow-sm"
                            >
                                <option value="">Semua Mapel</option>
                                {(isTeacher ? availableSubjects : subjects).map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* Admin / Kepala Sekolah Guru Selector */}
                        {isAdminOrPrincipal && allTeachers.length > 0 && (
                            <div className="relative inline-block">
                                <select
                                    value={teacherId}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setTeacherId(val);
                                        handleApplyFilter(month, year, classId, subjectId, val);
                                    }}
                                    className="h-10 pl-3.5 pr-8 min-w-[180px] bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-[#800020] focus:ring-[#800020] appearance-none cursor-pointer shadow-sm"
                                >
                                    <option value="">Semua Guru</option>
                                    {allTeachers.map(t => (
                                        <option key={t.id} value={t.id}>{t.full_name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        )}
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-64">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Cari materi / aktivitas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 pl-10 pr-3.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                        />
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">
                                Rekapitulasi Jurnal Harian ({filteredJournals.length})
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">
                                Daftar seluruh materi dan aktivitas pembelajaran guru pada bulan {activeMonthName} {year}
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="bg-slate-50/70 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-100">
                                    <th className="p-4 w-12 text-center">No</th>
                                    <th className="p-4 w-36">Hari & Tanggal</th>
                                    <th className="p-4 w-28 text-center">Waktu</th>
                                    <th className="p-4 w-28">Kelas</th>
                                    <th className="p-4 w-36">Mata Pelajaran</th>
                                    <th className="p-4">Pokok Bahasan & Aktivitas</th>
                                    <th className="p-4 w-36">Presensi & Media</th>
                                    <th className="p-4 w-24 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredJournals.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="p-12 text-center">
                                            <div className="max-w-sm mx-auto space-y-3">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                                                    <BookOpen className="w-6 h-6" />
                                                </div>
                                                <h4 className="text-sm font-bold text-slate-800">
                                                    Belum Ada Catatan Jurnal
                                                </h4>
                                                <p className="text-xs text-slate-500">
                                                    Tidak ada catatan pembelajaran pada bulan {activeMonthName} {year}. Silakan tambahkan jurnal harian baru.
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={openCreateModal}
                                                    className="px-4 py-2 bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold rounded-xl shadow-sm transition inline-flex items-center space-x-1.5"
                                                >
                                                    <PlusCircle className="w-4 h-4" />
                                                    <span>Tambah Jurnal Sekarang</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredJournals.map((item, idx) => {
                                        const d = new Date(item.journal_date + 'T00:00:00');
                                        const formattedDate = !isNaN(d.getTime())
                                            ? d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                                            : item.journal_date;

                                        return (
                                            <tr key={item.id} className="hover:bg-slate-50/60 transition">
                                                <td className="p-4 text-center font-bold text-slate-500">
                                                    {idx + 1}
                                                </td>

                                                <td className="p-4">
                                                    <div className="font-bold text-slate-900">{item.day_name}</div>
                                                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">{formattedDate}</div>
                                                </td>

                                                <td className="p-4 text-center font-mono text-[11px] text-slate-600">
                                                    {item.start_time ? (
                                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold">
                                                            {item.start_time.slice(0, 5)} - {item.end_time ? item.end_time.slice(0, 5) : 'selesai'}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400">-</span>
                                                    )}
                                                </td>

                                                <td className="p-4">
                                                    <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-[#800020] font-bold text-[11px] border border-rose-100">
                                                        {item.class?.name || '-'}
                                                    </span>
                                                </td>

                                                <td className="p-4 font-semibold text-slate-800">
                                                    {item.subject?.name || '-'}
                                                </td>

                                                <td className="p-4 space-y-1">
                                                    <div className="font-bold text-slate-900 text-xs">
                                                        {item.material_topic}
                                                    </div>
                                                    <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                                                        {item.activity_description}
                                                    </p>
                                                    {item.notes && (
                                                        <div className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-block font-medium">
                                                            Kendala: {item.notes}
                                                        </div>
                                                    )}
                                                </td>

                                                <td className="p-4 text-[11px]">
                                                    {item.attendance_notes ? (
                                                        <div className="font-medium text-slate-800">{item.attendance_notes}</div>
                                                    ) : (
                                                        <span className="text-slate-400">-</span>
                                                    )}
                                                    {item.learning_media && (
                                                        <div className="text-[10px] text-slate-500 mt-0.5">Media: {item.learning_media}</div>
                                                    )}
                                                </td>

                                                <td className="p-4 text-center">
                                                    <div className="flex items-center justify-center space-x-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditModal(item)}
                                                            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
                                                            title="Edit Jurnal"
                                                        >
                                                            <Edit3 className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteJournal(item)}
                                                            className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 flex items-center justify-center transition"
                                                            title="Hapus Jurnal"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Tambah / Edit Jurnal */}
            <ModalJournal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingJournal={editingJournal}
                journalForm={journalForm}
                setJournalForm={setJournalForm}
                handleSaveJournal={handleSaveJournal}
                subjects={availableSubjects}
                classes={availableClasses}
                userRole={userRole}
                isSubmitting={isSubmitting}
            />
        </AuthenticatedLayout>
    );
}
