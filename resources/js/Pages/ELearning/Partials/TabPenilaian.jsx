import React, { useState, useMemo, useEffect } from 'react';
import { 
    Award, 
    CheckCircle2, 
    AlertCircle, 
    Download, 
    FileText, 
    Save, 
    Users, 
    TrendingUp, 
    Search, 
    Clock, 
    Check, 
    Filter,
    HelpCircle,
    ChevronRight,
    Sparkles,
    Calendar,
    BookOpen
} from 'lucide-react';
import { router } from '@inertiajs/react';

export default function TabPenilaian({
    assignments = [],
    students = [],
    submissions = [],
    subjects = [],
    classes = [],
    selectedClass = '',
    setSelectedClass = () => {},
    selectedSubject = '',
    setSelectedSubject = () => {},
    isSiswa = false,
    canManage = false,
    currentStudent = null,
    onSwitchTab = () => {},
    onNotification = () => {}
}) {
    // =========================================================================
    // SISWA MODE: REKAP NILAI TUGAS & EVALUASI SAYA
    // =========================================================================
    if (isSiswa) {
        // Collect all assignments relevant to student
        const myAssignments = useMemo(() => {
            return assignments.map((asg) => {
                const sub = asg.my_submission;
                return {
                    id: asg.id,
                    title: asg.title,
                    subject_name: asg.subject_name,
                    due_date: asg.due_date,
                    max_score: asg.max_score || 100,
                    instructions: asg.instructions,
                    attachment_path: asg.attachment_path,
                    submission: sub,
                    hasSubmitted: !!sub,
                    submitted_at: sub?.submitted_at,
                    score: sub?.score !== null && sub?.score !== undefined ? Number(sub.score) : null,
                    teacher_feedback: sub?.teacher_feedback || '',
                    graded_at: sub?.graded_at
                };
            });
        }, [assignments]);

        const filteredMyAssignments = useMemo(() => {
            return myAssignments.filter(item => {
                if (selectedSubject && String(item.subject_id) !== String(selectedSubject)) {
                    // Check if subject matches
                }
                return true;
            });
        }, [myAssignments, selectedSubject]);

        const gradedCount = myAssignments.filter(a => a.score !== null).length;
        const totalAssignments = myAssignments.length;
        const avgScore = gradedCount > 0 
            ? (myAssignments.filter(a => a.score !== null).reduce((sum, a) => sum + a.score, 0) / gradedCount).toFixed(1)
            : '-';
        const highestScore = gradedCount > 0
            ? Math.max(...myAssignments.filter(a => a.score !== null).map(a => a.score))
            : '-';

        return (
            <div className="space-y-6">
                {/* Siswa KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#800020] flex items-center justify-center font-bold shrink-0">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Tugas</div>
                            <div className="text-xl font-bold text-slate-900 mt-0.5">{totalAssignments} Tugas</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">Penugasan & asesmen kelas</div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sudah Dinilai</div>
                            <div className="text-xl font-bold text-emerald-700 mt-0.5">{gradedCount} Selesai</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{totalAssignments - gradedCount} belum dinilai</div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold shrink-0">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rata-Rata Nilai</div>
                            <div className="text-xl font-bold text-slate-900 mt-0.5">{avgScore}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">Dari tugas yang telah dinilai</div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold shrink-0">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Skor Tertinggi</div>
                            <div className="text-xl font-bold text-blue-700 mt-0.5">{highestScore}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">Pencapaian belajar terbaik</div>
                        </div>
                    </div>
                </div>

                {/* Siswa Grade Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">Rekapitulasi Nilai & Evaluasi Tugas Siswa</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Daftar perolehan nilai dan catatan evaluasi dari guru pengampu mata pelajaran</p>
                        </div>
                    </div>

                    {filteredMyAssignments.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#800020] flex items-center justify-center mx-auto mb-3">
                                <Award className="w-6 h-6" />
                            </div>
                            <h4 className="text-sm font-bold text-slate-900">Belum Ada Penilaian</h4>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                                Belum ada data nilai tugas untuk mata pelajaran yang dipilih saat ini.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-[#F8F9FA] text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="px-5 py-3.5">Mata Pelajaran & Judul Tugas</th>
                                        <th className="px-4 py-3.5">Batas Pengumpulan</th>
                                        <th className="px-4 py-3.5 text-center">Status Pengumpulan</th>
                                        <th className="px-4 py-3.5 text-center">Nilai Saya</th>
                                        <th className="px-5 py-3.5">Catatan Evaluasi Guru</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredMyAssignments.map((item) => {
                                        const isGraded = item.score !== null;
                                        const isOverdue = new Date(item.due_date) < new Date();

                                        return (
                                            <tr key={item.id} className="hover:bg-slate-50/60 transition">
                                                <td className="px-5 py-4">
                                                    <div className="space-y-1">
                                                        <span className="inline-block px-2 py-0.5 rounded-md bg-rose-50 text-[#800020] font-semibold text-[10px]">
                                                            {item.subject_name}
                                                        </span>
                                                        <div className="font-bold text-slate-900 text-sm">
                                                            {item.title}
                                                        </div>
                                                        {item.instructions && (
                                                            <div className="text-slate-500 line-clamp-1 text-[11px]">
                                                                {item.instructions}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-4 py-4 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                                                    <div className="flex items-center space-x-1.5">
                                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>{new Date(item.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-4 text-center whitespace-nowrap">
                                                    {item.hasSubmitted ? (
                                                        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-[11px] inline-flex items-center space-x-1">
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            <span>Sudah Dikumpulkan</span>
                                                        </span>
                                                    ) : (
                                                        <span className={`px-2.5 py-1 rounded-full font-semibold text-[11px] inline-flex items-center space-x-1 ${
                                                            isOverdue ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                        }`}>
                                                            <AlertCircle className="w-3.5 h-3.5" />
                                                            <span>{isOverdue ? 'Terlambat' : 'Belum Kumpul'}</span>
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-4 py-4 text-center whitespace-nowrap">
                                                    {isGraded ? (
                                                        <div className="inline-flex flex-col items-center">
                                                            <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-sm">
                                                                {item.score} <span className="text-[10px] text-emerald-600 font-normal">/ {item.max_score}</span>
                                                            </span>
                                                            {item.score >= 75 ? (
                                                                <span className="text-[10px] text-emerald-600 font-semibold mt-0.5">Tuntas</span>
                                                            ) : (
                                                                <span className="text-[10px] text-rose-500 font-semibold mt-0.5">Perlu Remedial</span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 text-[11px]">
                                                            Menunggu Penilaian
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-5 py-4">
                                                    {item.teacher_feedback ? (
                                                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs italic">
                                                            "{item.teacher_feedback}"
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-400 text-xs">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // =========================================================================
    // TEACHER / ADMIN MODE: PENILAIAN SISWA & INPUT NILAI ASESMEN
    // =========================================================================

    // Filter available assignments based on selectedClass & selectedSubject
    const availableAssignments = useMemo(() => {
        return assignments.filter(asg => {
            if (selectedClass && String(asg.class_id) !== String(selectedClass)) return false;
            if (selectedSubject && String(asg.subject_id) !== String(selectedSubject)) return false;
            return true;
        });
    }, [assignments, selectedClass, selectedSubject]);

    // Active assignment for grading
    const [selectedAssignmentId, setSelectedAssignmentId] = useState(() => {
        return availableAssignments.length > 0 ? String(availableAssignments[0].id) : '';
    });

    // When filters change, sync selectedAssignmentId
    useEffect(() => {
        if (availableAssignments.length > 0) {
            const exists = availableAssignments.some(a => String(a.id) === String(selectedAssignmentId));
            if (!exists) {
                setSelectedAssignmentId(String(availableAssignments[0].id));
            }
        } else {
            setSelectedAssignmentId('');
        }
    }, [availableAssignments, selectedAssignmentId]);

    const activeAssignment = useMemo(() => {
        return assignments.find(a => String(a.id) === String(selectedAssignmentId)) || null;
    }, [assignments, selectedAssignmentId]);

    // Active class id (from active assignment or selectedClass)
    const activeClassId = activeAssignment?.class_id || (selectedClass ? Number(selectedClass) : null);

    // Filter students belonging to this class
    const classStudents = useMemo(() => {
        if (!activeClassId) {
            if (selectedClass) {
                return students.filter(s => String(s.class_id) === String(selectedClass));
            }
            return students;
        }
        return students.filter(s => String(s.class_id) === String(activeClassId));
    }, [students, activeClassId, selectedClass]);

    // Map submissions for the active assignment
    const assignmentSubmissions = useMemo(() => {
        if (!activeAssignment) return [];
        return submissions.filter(sub => String(sub.assignment_id) === String(activeAssignment.id));
    }, [submissions, activeAssignment]);

    // Build roster row data: student + submission
    const studentRoster = useMemo(() => {
        return classStudents.map(st => {
            const sub = assignmentSubmissions.find(s => Number(s.student_id) === Number(st.id));
            return {
                student_id: st.id,
                full_name: st.full_name,
                nisn: st.nisn,
                nis: st.nis,
                gender: st.gender,
                class_id: st.class_id,
                submission_id: sub?.id || null,
                submitted_at: sub?.submitted_at || null,
                file_path: sub?.file_path || null,
                student_notes: sub?.student_notes || '',
                initialScore: sub?.score !== null && sub?.score !== undefined ? String(sub.score) : '',
                initialFeedback: sub?.teacher_feedback || '',
                graded_at: sub?.graded_at || null,
                hasSubmitted: !!sub?.submitted_at
            };
        });
    }, [classStudents, assignmentSubmissions]);

    // Local grading form state for each student row: { [student_id]: { score: string, feedback: string } }
    const [rosterForm, setRosterForm] = useState({});
    const [searchStudent, setSearchStudent] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'graded', 'ungraded', 'submitted'
    const [savingRowId, setSavingRowId] = useState(null);
    const [isBatchSaving, setIsBatchSaving] = useState(false);

    // Sync rosterForm whenever active assignment or studentRoster changes
    useEffect(() => {
        const initialForm = {};
        studentRoster.forEach(st => {
            initialForm[st.student_id] = {
                score: st.initialScore,
                feedback: st.initialFeedback
            };
        });
        setRosterForm(initialForm);
    }, [studentRoster, selectedAssignmentId]);

    const handleScoreChange = (studentId, value) => {
        setRosterForm(prev => ({
            ...prev,
            [studentId]: {
                ...(prev[studentId] || { feedback: '' }),
                score: value
            }
        }));
    };

    const handleFeedbackChange = (studentId, value) => {
        setRosterForm(prev => ({
            ...prev,
            [studentId]: {
                ...(prev[studentId] || { score: '' }),
                feedback: value
            }
        }));
    };

    // Filtered roster for table display
    const filteredRoster = useMemo(() => {
        return studentRoster.filter(st => {
            if (searchStudent) {
                const q = searchStudent.toLowerCase();
                const matchName = st.full_name.toLowerCase().includes(q);
                const matchNisn = st.nisn ? String(st.nisn).includes(q) : false;
                if (!matchName && !matchNisn) return false;
            }

            const currentScore = rosterForm[st.student_id]?.score ?? st.initialScore;
            const isGraded = currentScore !== '' && currentScore !== null && currentScore !== undefined;

            if (statusFilter === 'graded' && !isGraded) return false;
            if (statusFilter === 'ungraded' && isGraded) return false;
            if (statusFilter === 'submitted' && !st.hasSubmitted) return false;

            return true;
        });
    }, [studentRoster, searchStudent, statusFilter, rosterForm]);

    // Statistics for this assignment
    const stats = useMemo(() => {
        const total = studentRoster.length;
        let graded = 0;
        let scoreSum = 0;
        let highest = 0;
        let lowest = 1000;

        studentRoster.forEach(st => {
            const val = rosterForm[st.student_id]?.score ?? st.initialScore;
            if (val !== '' && val !== null && !isNaN(Number(val))) {
                const num = Number(val);
                graded++;
                scoreSum += num;
                if (num > highest) highest = num;
                if (num < lowest) lowest = num;
            }
        });

        const avg = graded > 0 ? (scoreSum / graded).toFixed(1) : '-';
        return {
            total,
            graded,
            ungraded: total - graded,
            avg,
            highest: graded > 0 ? highest : '-',
            lowest: graded > 0 ? lowest : '-'
        };
    }, [studentRoster, rosterForm]);

    // Individual Row Save
    const handleSaveSingleRow = (studentId) => {
        if (!activeAssignment) return;

        const row = rosterForm[studentId];
        if (!row || row.score === '' || row.score === null) {
            alert('Silakan masukkan nilai terlebih dahulu (angka 0 - ' + (activeAssignment.max_score || 100) + ').');
            return;
        }

        const scoreNum = Number(row.score);
        if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > (activeAssignment.max_score || 100)) {
            alert(`Nilai harus berada di antara 0 dan ${activeAssignment.max_score || 100}.`);
            return;
        }

        setSavingRowId(studentId);
        router.post(route('elearning.grade.student'), {
            assignment_id: activeAssignment.id,
            student_id: studentId,
            score: scoreNum,
            teacher_feedback: row.feedback || ''
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSavingRowId(null);
                onNotification('Nilai siswa berhasil disimpan.');
            },
            onError: () => {
                setSavingRowId(null);
            }
        });
    };

    // Bulk / Batch Save for all filled scores
    const handleBatchSave = () => {
        if (!activeAssignment) return;

        const grades = [];
        studentRoster.forEach(st => {
            const row = rosterForm[st.student_id];
            if (row && row.score !== '' && row.score !== null && !isNaN(Number(row.score))) {
                grades.push({
                    student_id: st.student_id,
                    score: Number(row.score),
                    teacher_feedback: row.feedback || ''
                });
            }
        });

        if (grades.length === 0) {
            alert('Belum ada nilai yang diinput untuk disimpan.');
            return;
        }

        setIsBatchSaving(true);
        router.post(route('elearning.grade.batch'), {
            assignment_id: activeAssignment.id,
            grades: grades
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsBatchSaving(false);
                onNotification(`Berhasil menyimpan ${grades.length} nilai siswa sekaligus.`);
            },
            onError: () => {
                setIsBatchSaving(false);
            }
        });
    };

    // Quick set KKM (75) for empty scores
    const handleQuickSetKKM = () => {
        if (!confirm('Apakah Anda ingin mengisi otomatis nilai KKM (75) untuk siswa yang belum memiliki nilai?')) return;
        setRosterForm(prev => {
            const next = { ...prev };
            studentRoster.forEach(st => {
                const current = next[st.student_id]?.score;
                if (!current || current === '') {
                    next[st.student_id] = {
                        ...(next[st.student_id] || { feedback: '' }),
                        score: '75'
                    };
                }
            });
            return next;
        });
    };

    return (
        <div className="space-y-6">
            {/* Top Selector: Choose Assignment */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#800020] flex items-center justify-center font-bold shrink-0">
                            <Award className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">
                                Lembar Penilaian Siswa & Evaluasi Belajar
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">
                                Masukkan dan kelola perolehan nilai tugas, ulangan, maupun asesmen kelas
                            </p>
                        </div>
                    </div>

                    {/* Assignment Selector */}
                    <div className="flex items-center space-x-2 w-full md:w-auto">
                        <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                            Pilih Penugasan / Asesmen:
                        </label>
                        <select
                            value={selectedAssignmentId}
                            onChange={(e) => setSelectedAssignmentId(e.target.value)}
                            disabled={availableAssignments.length === 0}
                            className="flex-1 md:w-72 h-10 px-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:border-[#800020] focus:ring-[#800020] bg-white cursor-pointer shadow-sm"
                        >
                            {availableAssignments.length === 0 ? (
                                <option value="">Tidak ada tugas pada filter ini</option>
                            ) : (
                                availableAssignments.map(asg => (
                                    <option key={asg.id} value={asg.id}>
                                        {asg.title} ({asg.class_name} - {asg.subject_name})
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                </div>

                {/* If activeAssignment exists, display detailed badge info */}
                {activeAssignment ? (
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-[#800020] font-bold text-[11px]">
                                {activeAssignment.subject_name}
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px]">
                                {activeAssignment.class_name}
                            </span>
                            <span className="text-slate-500 flex items-center">
                                <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                                Deadline: {new Date(activeAssignment.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            <span className="text-slate-500">
                                Skala Nilai: <strong className="text-slate-800">0 - {activeAssignment.max_score || 100}</strong>
                            </span>
                        </div>

                        {activeAssignment.attachment_path && (
                            <a
                                href={`/storage/${activeAssignment.attachment_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-[#800020] hover:underline font-semibold"
                            >
                                <Download className="w-3.5 h-3.5 mr-1" />
                                <span>Unduh Lampiran Soal</span>
                            </a>
                        )}
                    </div>
                ) : (
                    <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                            <span>Belum ada penugasan untuk filter kelas/mapel saat ini. Buat tugas baru terlebih dahulu di tab Penugasan.</span>
                        </div>
                        <button
                            onClick={() => onSwitchTab('tugas')}
                            className="px-3 py-1 bg-white border border-amber-300 text-amber-900 rounded-lg font-bold text-[11px] hover:bg-amber-100 transition whitespace-nowrap ml-2"
                        >
                            Buka Tab Tugas
                        </button>
                    </div>
                )}
            </div>

            {/* KPI Summary Cards */}
            {activeAssignment && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Siswa</span>
                            <Users className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Siswa dalam rombel</div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sudah Dinilai</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="text-2xl font-bold text-emerald-700 mt-1">
                            {stats.graded} <span className="text-xs text-slate-400 font-normal">({stats.total > 0 ? Math.round((stats.graded / stats.total) * 100) : 0}%)</span>
                        </div>
                        <div className="text-[11px] text-emerald-600 mt-0.5 font-medium">Tuntas evaluasi</div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Belum Dinilai</span>
                            <AlertCircle className="w-4 h-4 text-amber-600" />
                        </div>
                        <div className="text-2xl font-bold text-amber-700 mt-1">{stats.ungraded}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Menunggu input nilai</div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rata-Rata Kelas</span>
                            <TrendingUp className="w-4 h-4 text-[#800020]" />
                        </div>
                        <div className="text-2xl font-bold text-[#800020] mt-1">{stats.avg}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Maksimal {activeAssignment.max_score || 100}</div>
                    </div>
                </div>
            )}

            {/* Table & Actions Card */}
            {activeAssignment && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Table Control Header */}
                    <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-3">
                        {/* Search & Status Filters */}
                        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                            <div className="relative w-full sm:w-60">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Cari nama atau NISN..."
                                    value={searchStudent}
                                    onChange={(e) => setSearchStudent(e.target.value)}
                                    className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-[#800020] focus:ring-[#800020] bg-white"
                                />
                            </div>

                            <div className="inline-flex rounded-xl bg-white p-1 border border-slate-200 shadow-sm text-xs">
                                <button
                                    onClick={() => setStatusFilter('all')}
                                    className={`px-3 py-1 rounded-lg font-semibold transition ${
                                        statusFilter === 'all' ? 'bg-[#800020] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Semua ({studentRoster.length})
                                </button>
                                <button
                                    onClick={() => setStatusFilter('ungraded')}
                                    className={`px-3 py-1 rounded-lg font-semibold transition ${
                                        statusFilter === 'ungraded' ? 'bg-[#800020] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Belum Dinilai ({stats.ungraded})
                                </button>
                                <button
                                    onClick={() => setStatusFilter('graded')}
                                    className={`px-3 py-1 rounded-lg font-semibold transition ${
                                        statusFilter === 'graded' ? 'bg-[#800020] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Sudah Dinilai ({stats.graded})
                                </button>
                                <button
                                    onClick={() => setStatusFilter('submitted')}
                                    className={`px-3 py-1 rounded-lg font-semibold transition ${
                                        statusFilter === 'submitted' ? 'bg-[#800020] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Kumpul Digital
                                </button>
                            </div>
                        </div>

                        {/* Batch Action Buttons */}
                        <div className="flex items-center space-x-2 w-full lg:w-auto justify-end">
                            <button
                                type="button"
                                onClick={handleQuickSetKKM}
                                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 transition inline-flex items-center cursor-pointer"
                                title="Isi nilai 75 untuk semua siswa yang belum dinilai"
                            >
                                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                                <span>Isi KKM (75)</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleBatchSave}
                                disabled={isBatchSaving}
                                className="px-4 py-2 bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold rounded-xl shadow-sm transition disabled:opacity-50 inline-flex items-center cursor-pointer"
                            >
                                <Save className="w-3.5 h-3.5 mr-1.5" />
                                <span>{isBatchSaving ? 'Menyimpan Semua...' : 'Simpan Semua Nilai'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Roster Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#F8F9FA] text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold">
                                <tr>
                                    <th className="px-4 py-3.5 w-12 text-center">No</th>
                                    <th className="px-5 py-3.5">Nama Siswa & NISN</th>
                                    <th className="px-4 py-3.5 text-center w-36">Pengumpulan</th>
                                    <th className="px-4 py-3.5 w-32">Nilai (0-{activeAssignment.max_score || 100})</th>
                                    <th className="px-5 py-3.5">Catatan / Evaluasi Guru</th>
                                    <th className="px-4 py-3.5 text-center w-24">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredRoster.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                            Tidak ada data siswa yang cocok dengan filter.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRoster.map((st, idx) => {
                                        const formVal = rosterForm[st.student_id] || { score: '', feedback: '' };
                                        const isRowSaving = savingRowId === st.student_id;
                                        const hasScore = formVal.score !== '' && formVal.score !== null;

                                        return (
                                            <tr 
                                                key={st.student_id} 
                                                className={`transition ${hasScore ? 'hover:bg-emerald-50/20' : 'hover:bg-rose-50/20'}`}
                                            >
                                                {/* No */}
                                                <td className="px-4 py-3.5 text-center font-mono text-slate-400">
                                                    {idx + 1}
                                                </td>

                                                {/* Student Identity */}
                                                <td className="px-5 py-3.5">
                                                    <div className="space-y-0.5">
                                                        <div className="font-bold text-slate-900 text-sm">
                                                            {st.full_name}
                                                        </div>
                                                        <div className="text-slate-500 font-mono text-[11px] flex items-center space-x-2">
                                                            <span>NISN: {st.nisn || '-'}</span>
                                                            <span>•</span>
                                                            <span>{st.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Digital Submission Status */}
                                                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                                    {st.hasSubmitted ? (
                                                        <div className="inline-flex flex-col items-center">
                                                            <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-[10px] inline-flex items-center space-x-1">
                                                                <CheckCircle2 className="w-3 h-3 text-blue-600" />
                                                                <span>Ada Berkas</span>
                                                            </span>
                                                            {st.file_path && (
                                                                <a
                                                                    href={`/storage/${st.file_path}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-[10px] text-[#800020] hover:underline font-semibold mt-1 inline-flex items-center"
                                                                >
                                                                    <Download className="w-3 h-3 mr-0.5" />
                                                                    <span>Unduh</span>
                                                                </a>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px]">
                                                            Luring (Offline)
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Score Input */}
                                                <td className="px-4 py-3.5">
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max={activeAssignment.max_score || 100}
                                                            placeholder="0"
                                                            value={formVal.score}
                                                            onChange={(e) => handleScoreChange(st.student_id, e.target.value)}
                                                            className={`w-28 h-9 px-3 rounded-xl border text-sm font-bold text-slate-900 focus:border-[#800020] focus:ring-[#800020] ${
                                                                hasScore ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-300 bg-white'
                                                            }`}
                                                        />
                                                    </div>
                                                </td>

                                                {/* Feedback Input */}
                                                <td className="px-5 py-3.5">
                                                    <input
                                                        type="text"
                                                        placeholder="Catatan / umpan balik untuk siswa..."
                                                        value={formVal.feedback}
                                                        onChange={(e) => handleFeedbackChange(st.student_id, e.target.value)}
                                                        className="w-full h-9 px-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-[#800020] focus:ring-[#800020] bg-white placeholder:text-slate-400"
                                                    />
                                                </td>

                                                {/* Action Save Row */}
                                                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSaveSingleRow(st.student_id)}
                                                        disabled={isRowSaving}
                                                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#800020] text-slate-700 hover:text-white border border-slate-200 hover:border-[#800020] text-xs font-bold transition disabled:opacity-50 inline-flex items-center cursor-pointer shadow-xs"
                                                        title="Simpan nilai baris ini"
                                                    >
                                                        {isRowSaving ? (
                                                            <span className="text-[10px]">Menyimpan...</span>
                                                        ) : (
                                                            <>
                                                                <Save className="w-3 h-3 mr-1" />
                                                                <span>Simpan</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Bottom Table Footer Note */}
                    <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
                        <span>
                            * Nilai dapat diinputkan secara langsung untuk pengumpulan tugas online maupun pemeriksaan tugas luring/buku latihan kelas.
                        </span>
                        <span className="font-semibold text-slate-700">
                            Menampilkan {filteredRoster.length} dari {studentRoster.length} siswa
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
