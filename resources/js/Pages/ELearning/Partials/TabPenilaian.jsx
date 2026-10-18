import React, { useState, useMemo, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import { 
    BookOpen, 
    Users, 
    CheckCircle2, 
    AlertCircle, 
    Download, 
    Upload, 
    Save, 
    FileSpreadsheet, 
    Layers, 
    Settings2, 
    TrendingUp, 
    Award, 
    Search, 
    Plus, 
    Trash2, 
    Check, 
    X,
    School,
    Calendar,
    ChevronDown,
    Filter,
    HelpCircle,
    FileText,
    Sparkles
} from 'lucide-react';

export default function TabPenilaian({
    auth = {},
    isSiswa = false,
    isStudentView = false,
    student = null,
    studentClass = null,
    studentGrades = [],
    classes = [],
    subjects = [],
    selectedClass = null,
    selectedSubject = null,
    selectedSemester = 2,
    activeAcademicYear = null,
    gradebook = null,
    materialScopes = [],
    students = [],
    summaryStats = {
        total_students: 0,
        graded_count: 0,
        avg_score: 0,
        max_score: 0,
        min_score: 0,
        passed_count: 0,
        pass_rate: 0
    }
}) {
    // Determine student mode
    const isStudentMode = isSiswa || isStudentView;
    const userRole = auth?.user?.role || '';
    const isStaffOrAdmin = ['admin', 'pimpinan'].includes(userRole);

    // =========================================================================
    // SISWA VIEW: TAMPILAN REKAP NILAI SISWA
    // =========================================================================
    if (isStudentMode) {
        return (
            <div className="space-y-6 animate-fade-in">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-[#800020] via-[#9e1b32] to-[#5c0017] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 backdrop-blur-3xs rounded-l-full pointer-events-none transform translate-x-10" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                                <Award className="w-3.5 h-3.5 text-amber-300" />
                                Buku Capaian Nilai Siswa
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                {student?.full_name || auth?.user?.name}
                            </h2>
                            <p className="text-rose-100 text-xs sm:text-sm">
                                NISN: <span className="font-semibold text-white">{student?.nisn || '-'}</span> | Kelas: <span className="font-semibold text-white">{studentClass?.name || '-'}</span> | Tahun Ajaran: <span className="font-semibold text-white">{activeAcademicYear?.year || '2025/2026'} (Semester {activeAcademicYear?.semester || 2})</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Subject Grade Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {studentGrades.map((item, idx) => {
                        const finalScore = item.final_score !== null ? Number(item.final_score) : null;
                        let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
                        let letter = '-';
                        if (finalScore !== null) {
                            if (finalScore >= 89) { badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-300'; letter = 'A'; }
                            else if (finalScore >= 78) { badgeColor = 'bg-blue-50 text-blue-800 border-blue-300'; letter = 'B'; }
                            else if (finalScore >= 65) { badgeColor = 'bg-amber-50 text-amber-800 border-amber-300'; letter = 'C'; }
                            else { badgeColor = 'bg-rose-50 text-rose-800 border-rose-300'; letter = 'D'; }
                        }

                        return (
                            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition duration-300 flex flex-col justify-between space-y-4">
                                <div>
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                {item.subject_code || 'MAPEL'}
                                            </span>
                                            <h3 className="text-base font-bold text-slate-800 line-clamp-1">
                                                {item.subject_name}
                                            </h3>
                                        </div>
                                        <div className={`px-2.5 py-1 rounded-xl text-xs font-extrabold border ${badgeColor}`}>
                                            Predikat {letter}
                                        </div>
                                    </div>

                                    {/* Score Summary */}
                                    <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                        <div>
                                            <div className="text-[11px] font-semibold text-slate-500 uppercase">Nilai Akhir (NA)</div>
                                            <div className="text-2xl font-black text-[#800020]">
                                                {finalScore !== null ? finalScore.toFixed(1) : '-'}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[11px] font-semibold text-slate-500 uppercase">SAS</div>
                                            <div className="text-base font-bold text-slate-700">
                                                {item.sas_score !== null ? Number(item.sas_score).toFixed(0) : '-'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Breakdown Formatif & Sumatif LM */}
                                    <div className="mt-4 space-y-2">
                                        <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                                            <span>Rincian Sumatif Lingkup Materi</span>
                                            <span className="text-[11px] text-slate-400 font-normal">
                                                {Object.keys(item.sumatif_lm_scores || {}).length} LM terdata
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-5 gap-1.5">
                                            {[1, 2, 3, 4, 5].map((lmNum) => {
                                                const lmKey = `lm${lmNum}`;
                                                const scoreVal = item.sumatif_lm_scores?.[lmKey];
                                                return (
                                                    <div key={lmNum} className="text-center p-1.5 rounded-lg bg-slate-100/70 border border-slate-200/60">
                                                        <div className="text-[10px] font-medium text-slate-500">LM{lmNum}</div>
                                                        <div className="text-xs font-bold text-slate-800">
                                                            {scoreVal !== undefined && scoreVal !== null && scoreVal !== '' ? scoreVal : '-'}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {item.notes && (
                                    <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 italic">
                                        "{item.notes}"
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // =========================================================================
    // GURU / ADMIN / PIMPINAN VIEW: SPREADSHEET BUKU NILAI
    // =========================================================================
    const [searchStudent, setSearchStudent] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    // Modal Config LM & TP
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [editableScopes, setEditableScopes] = useState([]);

    // Modal Import Excel
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importFile, setImportFile] = useState(null);
    const [isImporting, setIsImporting] = useState(false);

    // Local mutable state for student scores
    const [scoreData, setScoreData] = useState(() => {
        const initial = {};
        students.forEach(st => {
            initial[st.student_id] = {
                formatif: JSON.parse(JSON.stringify(st.formatif_scores || {})),
                sumatifLm: JSON.parse(JSON.stringify(st.sumatif_lm_scores || {})),
                sas: st.sas_score !== null && st.sas_score !== undefined ? String(st.sas_score) : '',
                final: st.final_score !== null && st.final_score !== undefined ? String(st.final_score) : '',
                notes: st.notes || '',
            };
        });
        return initial;
    });

    // Sync scoreData whenever students prop changes
    useEffect(() => {
        const initial = {};
        students.forEach(st => {
            initial[st.student_id] = {
                formatif: JSON.parse(JSON.stringify(st.formatif_scores || {})),
                sumatifLm: JSON.parse(JSON.stringify(st.sumatif_lm_scores || {})),
                sas: st.sas_score !== null && st.sas_score !== undefined ? String(st.sas_score) : '',
                final: st.final_score !== null && st.final_score !== undefined ? String(st.final_score) : '',
                notes: st.notes || '',
            };
        });
        setScoreData(initial);
        setIsDirty(false);
    }, [students, gradebook?.id]);

    useEffect(() => {
        setEditableScopes(JSON.parse(JSON.stringify(materialScopes)));
    }, [materialScopes]);

    // Handle score change for formatif
    const handleFormatifChange = (studentId, lmId, tp, value) => {
        setIsDirty(true);
        setScoreData(prev => {
            const studentEntry = prev[studentId] || { formatif: {}, sumatifLm: {}, sas: '', final: '' };
            const nextFormatif = { ...(studentEntry.formatif || {}) };
            if (!nextFormatif[lmId]) nextFormatif[lmId] = {};
            nextFormatif[lmId][tp] = value;

            return {
                ...prev,
                [studentId]: {
                    ...studentEntry,
                    formatif: nextFormatif,
                }
            };
        });
    };

    // Handle score change for Sumatif LM
    const handleSumatifLmChange = (studentId, lmId, value) => {
        setIsDirty(true);
        setScoreData(prev => {
            const studentEntry = prev[studentId] || { formatif: {}, sumatifLm: {}, sas: '', final: '' };
            const nextSumatifLm = { ...(studentEntry.sumatifLm || {}) };
            nextSumatifLm[lmId] = value;

            // Recalculate auto final score
            const lmVals = Object.values(nextSumatifLm)
                .map(v => parseFloat(v))
                .filter(v => !isNaN(v) && v > 0);

            const sasVal = parseFloat(studentEntry.sas);
            let nextFinal = studentEntry.final;

            if (lmVals.length > 0 || !isNaN(sasVal)) {
                const avgLm = lmVals.length > 0 ? (lmVals.reduce((a, b) => a + b, 0) / lmVals.length) : (sasVal || 0);
                if (!isNaN(sasVal) && lmVals.length > 0) {
                    nextFinal = ((avgLm * 0.6) + (sasVal * 0.4)).toFixed(1);
                } else {
                    nextFinal = avgLm.toFixed(1);
                }
            }

            return {
                ...prev,
                [studentId]: {
                    ...studentEntry,
                    sumatifLm: nextSumatifLm,
                    final: nextFinal,
                }
            };
        });
    };

    // Handle score change for Sumatif Akhir Semester (SAS)
    const handleSasChange = (studentId, value) => {
        setIsDirty(true);
        setScoreData(prev => {
            const studentEntry = prev[studentId] || { formatif: {}, sumatifLm: {}, sas: '', final: '' };
            const sasVal = parseFloat(value);

            const lmVals = Object.values(studentEntry.sumatifLm || {})
                .map(v => parseFloat(v))
                .filter(v => !isNaN(v) && v > 0);

            let nextFinal = studentEntry.final;
            if (lmVals.length > 0 || !isNaN(sasVal)) {
                const avgLm = lmVals.length > 0 ? (lmVals.reduce((a, b) => a + b, 0) / lmVals.length) : (sasVal || 0);
                if (!isNaN(sasVal) && lmVals.length > 0) {
                    nextFinal = ((avgLm * 0.6) + (sasVal * 0.4)).toFixed(1);
                } else {
                    nextFinal = avgLm.toFixed(1);
                }
            }

            return {
                ...prev,
                [studentId]: {
                    ...studentEntry,
                    sas: value,
                    final: nextFinal,
                }
            };
        });
    };

    // Handle manual edit of final score
    const handleFinalChange = (studentId, value) => {
        setIsDirty(true);
        setScoreData(prev => ({
            ...prev,
            [studentId]: {
                ...(prev[studentId] || {}),
                final: value,
            }
        }));
    };

    // Filter students by search
    const filteredStudents = useMemo(() => {
        if (!searchStudent) return students;
        const q = searchStudent.toLowerCase();
        return students.filter(s => 
            s.full_name?.toLowerCase().includes(q) ||
            s.nisn?.includes(q) ||
            s.nis?.includes(q)
        );
    }, [students, searchStudent]);

    // Save All Scores to Database
    const handleSaveAllScores = () => {
        if (!gradebook?.id) return;
        setIsSaving(true);

        const payloadScores = Object.entries(scoreData).map(([stId, data]) => ({
            student_id: Number(stId),
            formatif_scores: data.formatif,
            sumatif_lm_scores: data.sumatifLm,
            sas_score: data.sas !== '' ? Number(data.sas) : null,
            final_score: data.final !== '' ? Number(data.final) : null,
            notes: data.notes || '',
        }));

        router.post(route('penilaian.save'), {
            gradebook_id: gradebook.id,
            scores: payloadScores,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSaving(false);
                setIsDirty(false);
            },
            onError: () => setIsSaving(false),
        });
    };

    // Switch filters (Class, Subject, Semester)
    const handleFilterChange = (newClassId, newSubjectId, newSemester) => {
        const isStandalone = typeof window !== 'undefined' && window.location.pathname.includes('/penilaian');
        const targetRoute = isStandalone ? route('penilaian.index') : route('elearning.index');
        const params = isStandalone 
            ? { standalone: 1, class_id: newClassId, subject_id: newSubjectId, semester: newSemester }
            : { tab: 'penilaian', class_id: newClassId, subject_id: newSubjectId, semester: newSemester };

        router.get(targetRoute, params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Save Config (LM & TP)
    const handleSaveConfig = (e) => {
        e.preventDefault();
        router.post(route('penilaian.config'), {
            gradebook_id: gradebook.id,
            material_scopes: editableScopes,
        }, {
            onSuccess: () => setIsConfigModalOpen(false),
        });
    };

    // Import Excel File
    const handleImportSubmit = (e) => {
        e.preventDefault();
        if (!importFile) return;

        setIsImporting(true);
        const formData = new FormData();
        formData.append('file', importFile);
        formData.append('class_id', selectedClass?.id);
        formData.append('subject_id', selectedSubject?.id);
        formData.append('semester', selectedSemester);

        router.post(route('penilaian.import'), formData, {
            forceFormData: true,
            onSuccess: () => {
                setIsImporting(false);
                setIsImportModalOpen(false);
                setImportFile(null);
            },
            onError: () => setIsImporting(false),
        });
    };

    // Export Excel URL
    const exportUrl = route('penilaian.export', {
        class_id: selectedClass?.id,
        subject_id: selectedSubject?.id,
        semester: selectedSemester,
    });

    return (
        <div className="space-y-6 animate-fade-in">
            {/* 1. Header & Title Banner */}
            <div className="bg-gradient-to-r from-[#800020] via-[#94172f] to-[#5c0017] rounded-3xl p-6 sm:p-7 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div className="space-y-1.5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                            <FileSpreadsheet className="w-3.5 h-3.5 text-rose-200" />
                            Buku Nilai & Asesmen Kurikulum Merdeka
                        </span>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
                            Penilaian {selectedSubject?.name || 'Mata Pelajaran'} - {selectedClass?.name || 'Kelas'}
                        </h2>
                        <p className="text-rose-100 text-xs sm:text-sm">
                            Kelola nilai formatif per tujuan pembelajaran (TP), sumatif lingkup materi (LM), dan sumatif akhir semester (SAS) secara mandiri & fleksibel.
                        </p>
                    </div>

                    {/* Top School & Semester Badges */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        <div className="px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-semibold text-rose-100 flex items-center space-x-2">
                            <School className="w-4 h-4 text-rose-200" />
                            <span>UPT SDN 9 Gandangbatu Sillanan</span>
                        </div>
                        <div className="px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-bold text-white flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-amber-300" />
                            <span>{activeAcademicYear?.year || '2025/2026'} • Semester {selectedSemester}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Filter Bar: Pilihan Kelas, Mata Pelajaran, Semester */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto flex-1 max-w-4xl">
                    {/* Kelas */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                            Kelas
                        </label>
                        {classes.length === 1 && !isStaffOrAdmin ? (
                            <div className="h-[38px] px-3.5 bg-rose-50 border border-rose-200/80 rounded-xl flex items-center justify-between text-xs font-bold text-[#800020] shadow-2xs">
                                <span className="truncate">{selectedClass?.name || classes[0]?.name}</span>
                                <span className="text-[10px] font-semibold px-2 py-0.5 bg-white text-[#800020] border border-rose-200 rounded-full shrink-0">
                                    Kelas Ampuan
                                </span>
                            </div>
                        ) : classes.length > 1 && !isStaffOrAdmin && classes.length <= 6 ? (
                            <div className="flex flex-wrap gap-1.5 items-center min-h-[38px]">
                                {classes.map(c => {
                                    const isSelected = String(selectedClass?.id) === String(c.id);
                                    return (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => handleFilterChange(c.id, selectedSubject?.id, selectedSemester)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                                                isSelected
                                                    ? 'bg-[#800020] text-white shadow-xs'
                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                                            }`}
                                        >
                                            {c.name}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="relative">
                                <select
                                    value={selectedClass?.id || ''}
                                    onChange={(e) => handleFilterChange(e.target.value, selectedSubject?.id, selectedSemester)}
                                    className="w-full pl-3 pr-8 py-2 text-xs font-semibold rounded-xl border-slate-200 focus:border-[#800020] focus:ring-[#800020] bg-slate-50 cursor-pointer"
                                >
                                    {classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Mata Pelajaran */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                Mata Pelajaran
                            </label>
                            {(() => {
                                const sName = (selectedSubject?.name || '').toLowerCase();
                                const sCode = (selectedSubject?.code || '').toLowerCase();
                                let rel = null;
                                if (sName.includes('katolik')) rel = 'Katolik';
                                else if (sName.includes('islam') || sCode.includes('pai')) rel = 'Islam';
                                else if (sName.includes('kristen') || sName.includes('protestan') || sCode.includes('pak')) rel = 'Kristen';
                                else if (sName.includes('hindu')) rel = 'Hindu';
                                else if (sName.includes('buddh') || sName.includes('budh')) rel = 'Buddha';
                                else if (sName.includes('khonghucu') || sName.includes('konghucu')) rel = 'Khonghucu';

                                return rel ? (
                                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                                        Khusus Siswa {rel}
                                    </span>
                                ) : null;
                            })()}
                        </div>
                        <div className="relative">
                            <select
                                value={selectedSubject?.id || ''}
                                onChange={(e) => handleFilterChange(selectedClass?.id, e.target.value, selectedSemester)}
                                className="w-full pl-3 pr-8 py-2 text-xs font-semibold rounded-xl border-slate-200 focus:border-[#800020] focus:ring-[#800020] bg-slate-50 cursor-pointer"
                            >
                                {subjects.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Semester */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                            Semester
                        </label>
                        <div className="relative">
                            <select
                                value={selectedSemester}
                                onChange={(e) => handleFilterChange(selectedClass?.id, selectedSubject?.id, e.target.value)}
                                className="w-full pl-3 pr-8 py-2 text-xs font-semibold rounded-xl border-slate-200 focus:border-[#800020] focus:ring-[#800020] bg-slate-50"
                            >
                                <option value={1}>Semester 1 (Ganjil - LM 1..5)</option>
                                <option value={2}>Semester 2 (Genap - LM 6..10)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Right: Save Status & Button */}
                <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
                    {isDirty && (
                        <span className="text-xs font-semibold text-amber-600 flex items-center gap-1 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            Ada perubahan belum disimpan
                        </span>
                    )}
                    <button
                        type="button"
                        onClick={handleSaveAllScores}
                        disabled={isSaving}
                        className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-md cursor-pointer ${
                            isDirty 
                                ? 'bg-[#800020] hover:bg-[#600018] text-white ring-2 ring-[#800020]/20 animate-bounce-subtle' 
                                : 'bg-slate-800 hover:bg-slate-900 text-white'
                        }`}
                    >
                        <Save className="w-3.5 h-3.5" />
                        {isSaving ? 'Menyimpan...' : 'Simpan Semua Nilai'}
                    </button>
                </div>
            </div>

            {/* 3. Summary Statistics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Siswa</div>
                        <div className="text-lg font-black text-slate-800">{summaryStats.total_students} Anak</div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sudah Dinilai</div>
                        <div className="text-lg font-black text-emerald-700">
                            {summaryStats.graded_count} / {summaryStats.total_students}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rata-Rata Nilai</div>
                        <div className="text-lg font-black text-purple-800">{summaryStats.avg_score}</div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ketuntasan (≥75)</div>
                        <div className="text-lg font-black text-amber-800">{summaryStats.pass_rate}%</div>
                    </div>
                </div>
            </div>

            {/* 4. Unified Action & Control Toolbar */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
                {/* Left: Search Bar */}
                <div className="relative flex-1 min-w-[280px] max-w-xl">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari nama lengkap siswa, NISN, atau NIS..."
                        value={searchStudent}
                        onChange={(e) => setSearchStudent(e.target.value)}
                        className="w-full pl-10 pr-9 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#800020] focus:ring-[#800020] bg-slate-50/60 hover:bg-white focus:bg-white transition"
                    />
                    {searchStudent && (
                        <button
                            type="button"
                            onClick={() => setSearchStudent('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-1 cursor-pointer"
                            title="Hapus pencarian"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* Right: Ergonomic Action Buttons Group */}
                <div className="flex flex-wrap items-center gap-2 justify-start xl:justify-end">
                    {/* Button 1: Atur Lingkup Materi & TP */}
                    <button
                        type="button"
                        onClick={() => setIsConfigModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/90 text-slate-700 text-xs font-bold transition border border-slate-200/90 cursor-pointer shadow-2xs hover:shadow-xs"
                        title="Atur jumlah dan nama Lingkup Materi serta Tujuan Pembelajaran"
                    >
                        <Settings2 className="w-4 h-4 text-slate-600" />
                        <span>Atur LM & TP</span>
                    </button>

                    <div className="hidden sm:block h-6 w-px bg-slate-200 mx-0.5" />

                    {/* Button 2: Unduh Template */}
                    <button
                        type="button"
                        onClick={() => {
                            window.location.href = route('penilaian.template', { gradebook_id: gradebook?.id });
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition border border-slate-200/80 cursor-pointer shadow-2xs"
                        title="Unduh file template Excel kosong yang sudah berisi nama & NISN siswa kelas ini"
                    >
                        <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                        <span>Template Excel</span>
                    </button>

                    {/* Button 3: Import Excel */}
                    <button
                        type="button"
                        onClick={() => setIsImportModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm hover:shadow-md cursor-pointer"
                        title="Impor nilai lama dari format DAFTAR NILAI KLS 1.xlsx"
                    >
                        <Upload className="w-4 h-4" />
                        <span>Import Excel</span>
                    </button>

                    {/* Button 4: Export Excel */}
                    <a
                        href={exportUrl}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-[#800020] text-xs font-bold transition border border-rose-200/90 shadow-2xs hover:shadow-xs cursor-pointer"
                        title="Ekspor daftar nilai lengkap dengan kop sekolah dan tanda tangan"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export Excel</span>
                    </a>

                    <div className="hidden sm:block h-6 w-px bg-slate-200 mx-0.5" />

                    {/* Button 5: Simpan Semua Nilai */}
                    <button
                        type="button"
                        onClick={handleSaveAllScores}
                        disabled={isSaving}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-sm cursor-pointer ${
                            isDirty 
                                ? 'bg-[#800020] hover:bg-[#600018] text-white ring-2 ring-[#800020]/20 animate-pulse' 
                                : 'bg-slate-800 hover:bg-slate-900 text-white'
                        }`}
                    >
                        <Save className="w-4 h-4" />
                        <span>{isSaving ? 'Menyimpan...' : 'Simpan Nilai'}</span>
                    </button>
                </div>
            </div>

            {/* 5. Main Spreadsheet Table Grid */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="overflow-x-auto max-h-[75vh]">
                    <table className="w-full text-xs text-left border-collapse border-spacing-0">
                        <thead>
                            {/* Tier 1 Header: Groups */}
                            <tr className="bg-slate-800 text-white font-bold text-center border-b border-slate-700">
                                <th rowSpan={3} className="sticky left-0 z-20 bg-slate-800 px-3 py-3 w-10 border-r border-slate-700 text-center">
                                    No
                                </th>
                                <th rowSpan={3} className="sticky left-10 z-20 bg-slate-800 px-3 py-3 w-28 border-r border-slate-700 text-center">
                                    NISN / NIS
                                </th>
                                <th rowSpan={3} className="sticky left-38 z-20 bg-slate-800 px-4 py-3 min-w-[200px] border-r border-slate-700 text-left">
                                    Nama Lengkap Siswa
                                </th>

                                {/* Formatif Section */}
                                {(() => {
                                    const totalTpCols = (materialScopes || []).reduce((acc, curr) => acc + (curr.tps?.length || 0), 0) + 1; // +1 for R
                                    return (
                                        <th colSpan={totalTpCols} className="bg-indigo-900/90 text-indigo-100 py-2 border-r border-indigo-700">
                                            FORMATIF (TUJUAN PEMBELAJARAN)
                                        </th>
                                    );
                                })()}

                                {/* Sumatif Lingkup Materi Section */}
                                <th colSpan={6} className="bg-teal-900/90 text-teal-100 py-2 border-r border-teal-700">
                                    SUMATIF LINGKUP MATERI
                                </th>

                                {/* SAS Section */}
                                <th rowSpan={2} colSpan={1} className="bg-purple-900/90 text-purple-100 px-3 py-2 border-r border-purple-700 w-16">
                                    SAS
                                </th>

                                {/* Nilai Akhir Section */}
                                <th rowSpan={2} colSpan={1} className="bg-[#800020] text-rose-100 px-3 py-2 border-r border-rose-800 w-16">
                                    NA
                                </th>

                                {/* Predikat & Ket */}
                                <th rowSpan={2} colSpan={1} className="bg-slate-900 text-slate-200 px-3 py-2 w-16 text-center">
                                    Predikat
                                </th>
                            </tr>

                            {/* Tier 2 Header: Material Scopes / Lingkup Materi */}
                            <tr className="bg-slate-700 text-slate-100 text-center font-semibold text-[11px] border-b border-slate-600">
                                {(materialScopes || []).map((scope, sIdx) => (
                                    <th 
                                        key={scope.id || sIdx} 
                                        colSpan={scope.tps?.length || 1} 
                                        className="px-2 py-1.5 border-r border-slate-600 bg-indigo-950/60"
                                        title={scope.name}
                                    >
                                        <div className="truncate max-w-[130px] mx-auto">{scope.name}</div>
                                    </th>
                                ))}
                                <th className="px-2 py-1.5 border-r border-slate-600 bg-indigo-950 text-amber-300 font-bold w-12" title="Rata-Rata Formatif">
                                    R
                                </th>

                                {/* Sub Lingkup Materi 1-5 */}
                                {[1, 2, 3, 4, 5].map((lmNum) => (
                                    <th key={lmNum} className="px-2 py-1.5 border-r border-slate-600 bg-teal-950/60 w-12">
                                        LM{lmNum}
                                    </th>
                                ))}
                                <th className="px-2 py-1.5 border-r border-slate-600 bg-teal-950 text-amber-300 font-bold w-12" title="Rata-Rata Sumatif LM">
                                    R
                                </th>
                            </tr>

                            {/* Tier 3 Header: Specific TPs */}
                            <tr className="bg-slate-600 text-slate-200 text-center font-medium text-[10px] border-b border-slate-500">
                                {(materialScopes || []).flatMap((scope, sIdx) => 
                                    (scope.tps || ['TP1']).map((tp, tpIdx) => (
                                        <th key={`${sIdx}-${tpIdx}`} className="px-1.5 py-1 border-r border-slate-500 w-11 bg-indigo-900/30">
                                            {tp}
                                        </th>
                                    ))
                                )}
                                <th className="px-1 py-1 border-r border-slate-500 w-12 bg-indigo-900/60 font-bold text-amber-300">
                                    Rata
                                </th>

                                {[1, 2, 3, 4, 5].map((lmNum) => (
                                    <th key={lmNum} className="px-1 py-1 border-r border-slate-500 w-12 bg-teal-900/30">
                                        LM{lmNum}
                                    </th>
                                ))}
                                <th className="px-1 py-1 border-r border-slate-500 w-12 bg-teal-900/60 font-bold text-amber-300">
                                    Rata
                                </th>

                                <th className="px-1 py-1 border-r border-purple-900/40 bg-purple-900/30 text-[9px]">
                                    Sem.
                                </th>
                                <th className="px-1 py-1 border-r border-rose-900/40 bg-rose-900/30 text-[9px] font-bold text-amber-300">
                                    Akhir
                                </th>
                                <th className="px-1 py-1 bg-slate-800 text-[9px]">
                                    A-D
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-200 bg-white">
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={40} className="px-6 py-12 text-center text-slate-400 font-semibold">
                                        Tidak ada siswa ditemukan di kelas ini atau dengan kata kunci pencarian.
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((st, idx) => {
                                    const stState = scoreData[st.student_id] || { formatif: {}, sumatifLm: {}, sas: '', final: '' };

                                    // Compute Live Formatif Average
                                    const formatifVals = [];
                                    (materialScopes || []).forEach(sc => {
                                        (sc.tps || []).forEach(tp => {
                                            const v = parseFloat(stState.formatif?.[sc.id]?.[tp]);
                                            if (!isNaN(v) && v > 0) formatifVals.push(v);
                                        });
                                    });
                                    const avgFormatif = formatifVals.length > 0 
                                        ? (formatifVals.reduce((a, b) => a + b, 0) / formatifVals.length).toFixed(1) 
                                        : '-';

                                    // Compute Live Sumatif LM Average
                                    const sumatifLmVals = [];
                                    [1, 2, 3, 4, 5].forEach(num => {
                                        const v = parseFloat(stState.sumatifLm?.[`lm${num}`]);
                                        if (!isNaN(v) && v > 0) sumatifLmVals.push(v);
                                    });
                                    const avgSumatifLm = sumatifLmVals.length > 0 
                                        ? (sumatifLmVals.reduce((a, b) => a + b, 0) / sumatifLmVals.length).toFixed(1) 
                                        : '-';

                                    // Final Score & Predicate
                                    const numFinal = parseFloat(stState.final);
                                    let predicateLetter = '-';
                                    let predicateBg = 'text-slate-400';
                                    if (!isNaN(numFinal)) {
                                        if (numFinal >= 89) { predicateLetter = 'A'; predicateBg = 'text-emerald-700 font-extrabold bg-emerald-50'; }
                                        else if (numFinal >= 78) { predicateLetter = 'B'; predicateBg = 'text-blue-700 font-extrabold bg-blue-50'; }
                                        else if (numFinal >= 65) { predicateLetter = 'C'; predicateBg = 'text-amber-700 font-extrabold bg-amber-50'; }
                                        else { predicateLetter = 'D'; predicateBg = 'text-rose-700 font-extrabold bg-rose-50'; }
                                    }

                                    return (
                                        <tr key={st.student_id} className="hover:bg-slate-50 transition-colors">
                                            {/* Sticky Columns */}
                                            <td className="sticky left-0 z-10 bg-inherit px-3 py-2 text-center text-slate-500 font-semibold border-r border-slate-200">
                                                {idx + 1}
                                            </td>
                                            <td className="sticky left-10 z-10 bg-inherit px-3 py-2 text-slate-600 font-mono text-[11px] border-r border-slate-200">
                                                {st.nisn || st.nis || '-'}
                                            </td>
                                            <td className="sticky left-38 z-10 bg-inherit px-4 py-2 font-bold text-slate-800 border-r border-slate-200 whitespace-nowrap">
                                                {st.full_name}
                                            </td>

                                            {/* Formatif Inputs */}
                                            {(materialScopes || []).flatMap((scope) => 
                                                (scope.tps || ['TP1']).map((tp) => {
                                                    const curVal = stState.formatif?.[scope.id]?.[tp] ?? '';
                                                    return (
                                                        <td key={`${scope.id}-${tp}`} className="p-1 border-r border-slate-200 text-center">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max="100"
                                                                value={curVal}
                                                                onChange={(e) => handleFormatifChange(st.student_id, scope.id, tp, e.target.value)}
                                                                className="w-11 px-1 py-1 text-center font-semibold text-slate-700 rounded-md border-slate-200 hover:border-indigo-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-500 text-xs bg-slate-50/50"
                                                            />
                                                        </td>
                                                    );
                                                })
                                            )}

                                            {/* Rata-Rata Formatif */}
                                            <td className="p-1 border-r border-slate-200 text-center font-bold bg-indigo-50/60 text-indigo-900">
                                                {avgFormatif}
                                            </td>

                                            {/* Sumatif LM 1-5 Inputs */}
                                            {[1, 2, 3, 4, 5].map((lmNum) => {
                                                const lmKey = `lm${lmNum}`;
                                                const curVal = stState.sumatifLm?.[lmKey] ?? '';
                                                return (
                                                    <td key={lmKey} className="p-1 border-r border-slate-200 text-center">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            value={curVal}
                                                            onChange={(e) => handleSumatifLmChange(st.student_id, lmKey, e.target.value)}
                                                            className="w-11 px-1 py-1 text-center font-bold text-teal-800 rounded-md border-slate-200 hover:border-teal-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-500 text-xs bg-teal-50/30"
                                                        />
                                                    </td>
                                                );
                                            })}

                                            {/* Rata-Rata Sumatif LM */}
                                            <td className="p-1 border-r border-slate-200 text-center font-bold bg-teal-50/70 text-teal-900">
                                                {avgSumatifLm}
                                            </td>

                                            {/* SAS Input */}
                                            <td className="p-1 border-r border-purple-200 text-center bg-purple-50/30">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={stState.sas}
                                                    onChange={(e) => handleSasChange(st.student_id, e.target.value)}
                                                    className="w-12 px-1 py-1 text-center font-bold text-purple-900 rounded-md border-purple-200 hover:border-purple-400 focus:border-purple-600 focus:ring-1 focus:ring-purple-500 text-xs bg-white"
                                                />
                                            </td>

                                            {/* Final Score (NA) */}
                                            <td className="p-1 border-r border-rose-200 text-center bg-rose-50/40">
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    min="0"
                                                    max="100"
                                                    value={stState.final}
                                                    onChange={(e) => handleFinalChange(st.student_id, e.target.value)}
                                                    className="w-14 px-1 py-1 text-center font-black text-[#800020] rounded-md border-rose-200 hover:border-[#800020] focus:border-[#800020] focus:ring-1 focus:ring-[#800020] text-xs bg-white"
                                                />
                                            </td>

                                            {/* Predikat */}
                                            <td className={`p-1 text-center text-xs border-r border-slate-200 ${predicateBg}`}>
                                                {predicateLetter}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Notes */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
                    <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>
                            <b>Catatan:</b> Nilai Akhir (NA) otomatis dihitung dari gabungan bobot Rata-rata Sumatif Lingkup Materi (60%) dan Sumatif Akhir Semester / SAS (40%). Nilai dapat disesuaikan manual sewaktu-waktu.
                        </span>
                    </div>
                    <div>
                        Menampilkan <b>{filteredStudents.length}</b> siswa
                    </div>
                </div>
            </div>

            {/* ========================================================================= */}
            {/* MODAL 1: ATUR LINGKUP MATERI & TUJUAN PEMBELAJARAN (TP)                   */}
            {/* ========================================================================= */}
            {isConfigModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                                    <Settings2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-extrabold">Atur Lingkup Materi (LM) & Tujuan Pembelajaran (TP)</h3>
                                    <p className="text-xs text-slate-300">
                                        {selectedSubject?.name} - {selectedClass?.name} (Semester {selectedSemester})
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsConfigModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveConfig} className="p-6 overflow-y-auto space-y-5 flex-1">
                            <div className="text-xs text-slate-600 bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-start space-x-2.5">
                                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    Anda dapat mengubah nama Lingkup Materi dan menambah atau menghapus butir Tujuan Pembelajaran (TP) di bawah masing-masing bab/materi.
                                </div>
                            </div>

                            <div className="space-y-4">
                                {editableScopes.map((scope, sIdx) => (
                                    <div key={scope.id || sIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <input
                                                type="text"
                                                value={scope.name}
                                                onChange={(e) => {
                                                    const updated = [...editableScopes];
                                                    updated[sIdx].name = e.target.value;
                                                    setEditableScopes(updated);
                                                }}
                                                className="font-bold text-xs text-slate-800 bg-white rounded-xl border-slate-300 px-3 py-1.5 w-full max-w-sm focus:border-[#800020] focus:ring-[#800020]"
                                                placeholder="Nama Lingkup Materi..."
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updated = [...editableScopes];
                                                    const currentTps = updated[sIdx].tps || [];
                                                    updated[sIdx].tps = [...currentTps, `TP${currentTps.length + 1}`];
                                                    setEditableScopes(updated);
                                                }}
                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition cursor-pointer"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                <span>Tambah TP</span>
                                            </button>
                                        </div>

                                        {/* TP Tags */}
                                        <div className="flex flex-wrap items-center gap-2 pt-1">
                                            {(scope.tps || []).map((tp, tpIdx) => (
                                                <div key={tpIdx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
                                                    <span>{tp}</span>
                                                    {scope.tps.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const updated = [...editableScopes];
                                                                updated[sIdx].tps = updated[sIdx].tps.filter((_, i) => i !== tpIdx);
                                                                setEditableScopes(updated);
                                                            }}
                                                            className="text-slate-400 hover:text-rose-600 transition cursor-pointer"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsConfigModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#800020] hover:bg-[#600018] shadow-md transition cursor-pointer"
                                >
                                    Simpan Konfigurasi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* MODAL 2: IMPORT EXCEL NILAI LAMA                                          */}
            {/* ========================================================================= */}
            {isImportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                                    <Upload className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-extrabold">Import Nilai Siswa dari Excel</h3>
                                    <p className="text-xs text-emerald-200">
                                        Mendukung format file DAFTAR NILAI KLS 1.xlsx
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsImportModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleImportSubmit} className="p-6 space-y-5">
                            <div className="text-xs text-slate-600 bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl space-y-2">
                                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    Petunjuk Import Otomatis:
                                </div>
                                <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                                    <li>Format Excel harus memiliki baris header <b>FORMATIF</b> dan <b>Sumatif Lingkup Materi</b> (seperti template resmi SDN 9).</li>
                                    <li>Siswa dicocokkan otomatis berdasarkan <b>NISN</b>, <b>NIS</b>, atau <b>Nama Lengkap</b>.</li>
                                    <li>Nilai Formatif TP, Sumatif LM1-LM5, dan SAS akan langsung tersimpan dan dihitung.</li>
                                </ul>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2">
                                    Pilih File Excel (.xlsx / .xls)
                                </label>
                                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-emerald-500 transition bg-slate-50">
                                    <FileSpreadsheet className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                                    <input
                                        type="file"
                                        accept=".xlsx,.xls"
                                        onChange={(e) => setImportFile(e.target.files[0])}
                                        className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                                    />
                                    {importFile && (
                                        <div className="mt-2 text-xs font-bold text-emerald-700">
                                            File terpilih: {importFile.name} ({(importFile.size / 1024).toFixed(1)} KB)
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsImportModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={!importFile || isImporting}
                                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition disabled:opacity-50 cursor-pointer"
                                >
                                    {isImporting ? 'Mengimpor & Memetakan...' : 'Mulai Import Nilai'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Floating Save Notification Pill when edits are made */}
            {isDirty && (
                <div className="fixed bottom-6 right-6 z-40 bg-slate-900/95 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center space-x-4 backdrop-blur-md animate-fade-in">
                    <div className="flex items-center space-x-2.5">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                        </span>
                        <span className="text-xs font-medium text-slate-200">
                            Ada perubahan nilai belum disimpan
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={handleSaveAllScores}
                        disabled={isSaving}
                        className="px-4 py-2 bg-[#800020] hover:bg-[#600018] text-white text-xs font-bold rounded-xl shadow-md transition flex items-center space-x-1.5 cursor-pointer"
                    >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSaving ? 'Menyimpan...' : 'Simpan Sekarang'}</span>
                    </button>
                </div>
            )}
        </div>
    );
}
