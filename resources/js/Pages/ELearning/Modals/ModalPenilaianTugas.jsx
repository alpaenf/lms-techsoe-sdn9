import React, { useState, useEffect } from 'react';
import { X, Award, CheckCircle2, AlertCircle, Download, FileText, Send, UserCheck, Clock } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function ModalPenilaianTugas({ 
    isOpen, 
    onClose, 
    assignment, 
    onNotification 
}) {
    if (!isOpen || !assignment) return null;

    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const [gradeForm, setGradeForm] = useState({
        score: '',
        teacher_feedback: ''
    });

    const [isSaving, setIsSaving] = useState(false);

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const res = await fetch(route('elearning.assignments.submissions', assignment.id));
            const data = await res.json();
            if (data.students) {
                setStudents(data.students);
                if (data.students.length > 0) {
                    const firstSubmitted = data.students.find(s => s.status !== 'missing') || data.students[0];
                    setSelectedStudent(firstSubmitted);
                    setGradeForm({
                        score: firstSubmitted.score !== null ? firstSubmitted.score : '',
                        teacher_feedback: firstSubmitted.teacher_feedback || ''
                    });
                }
            }
        } catch (err) {
            console.error('Failed to fetch submissions:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && assignment) {
            fetchSubmissions();
        }
    }, [isOpen, assignment]);

    const handleSelectStudent = (st) => {
        setSelectedStudent(st);
        setGradeForm({
            score: st.score !== null ? st.score : '',
            teacher_feedback: st.teacher_feedback || ''
        });
    };

    const handleSaveGrade = (e) => {
        e.preventDefault();
        if (!selectedStudent || !selectedStudent.submission_id) {
            alert('Siswa ini belum mengumpulkan tugas.');
            return;
        }

        setIsSaving(true);
        router.post(route('elearning.submissions.grade', selectedStudent.submission_id), gradeForm, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSaving(false);
                onNotification('Nilai dan catatan evaluasi berhasil disimpan.');
                fetchSubmissions();
            },
            onError: () => setIsSaving(false)
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full overflow-hidden my-8 flex flex-col max-h-[90vh]">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                    <div className="flex items-center space-x-2.5">
                        <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#800020] flex items-center justify-center font-bold">
                            <Award className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">
                                Penilaian & Pemeriksaan Tugas Siswa
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">
                                {assignment.title} • {assignment.class_name} ({assignment.subject_name})
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Modal Content Layout (Grid 2 Column) */}
                <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                    {/* Left Column: Student List */}
                    <div className="md:col-span-5 overflow-y-auto p-4 space-y-2 max-h-[60vh] md:max-h-full">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Daftar Siswa Kelas ({students.length})
                        </div>

                        {loading ? (
                            <div className="text-center py-8 text-xs text-slate-400">Memuat data pengumpulan...</div>
                        ) : (
                            students.map((st) => {
                                const isSelected = selectedStudent?.student_id === st.student_id;
                                const isSubmitted = st.status !== 'missing';
                                const isGraded = st.status === 'graded';

                                return (
                                    <div
                                        key={st.student_id}
                                        onClick={() => handleSelectStudent(st)}
                                        className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                                            isSelected 
                                                ? 'bg-rose-50/80 border-[#800020] shadow-sm' 
                                                : 'bg-white border-slate-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className="space-y-0.5">
                                            <div className="font-bold text-slate-900">{st.full_name}</div>
                                            <div className="text-[11px] text-slate-500 font-mono">NISN: {st.nisn}</div>
                                        </div>

                                        <div className="text-right">
                                            {isGraded ? (
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                                    Nilai: {st.score}
                                                </span>
                                            ) : isSubmitted ? (
                                                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold text-[10px]">
                                                    Dikumpulkan
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px]">
                                                    Belum ADA
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Right Column: Submission Details & Grading Form */}
                    <div className="md:col-span-7 overflow-y-auto p-6 space-y-5 bg-slate-50/30">
                        {selectedStudent ? (
                            <>
                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-bold text-slate-900">
                                            {selectedStudent.full_name}
                                        </h4>
                                        <span className="text-xs font-mono text-slate-500">
                                            NISN: {selectedStudent.nisn}
                                        </span>
                                    </div>

                                    {selectedStudent.submitted_at ? (
                                        <div className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                                            <div className="flex items-center text-slate-500">
                                                <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                                                <span>Dikumpulkan: {new Date(selectedStudent.submitted_at).toLocaleString('id-ID')}</span>
                                            </div>

                                            {selectedStudent.file_path && (
                                                <a
                                                    href={`/storage/${selectedStudent.file_path}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-3 py-1.5 rounded-xl bg-[#FDF2F4] text-[#800020] font-semibold text-xs border border-[#E8B4B8] hover:bg-[#800020] hover:text-white transition"
                                                >
                                                    <Download className="w-3.5 h-3.5 mr-1.5" />
                                                    <span>Lihat Berkas Jawaban Siswa</span>
                                                </a>
                                            )}

                                            {selectedStudent.student_notes && (
                                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                                                    <div className="font-bold text-slate-700 text-[11px] mb-0.5">Catatan Siswa:</div>
                                                    <p className="text-slate-600 italic">"{selectedStudent.student_notes}"</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl flex items-center space-x-2 mt-2">
                                            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                                            <span>Siswa ini belum mengumpulkan berkas atau lembar jawaban tugas.</span>
                                        </div>
                                    )}
                                </div>

                                {/* Grading Form */}
                                {selectedStudent.submission_id ? (
                                    <form onSubmit={handleSaveGrade} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                        <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
                                            <UserCheck className="w-4 h-4 mr-1.5 text-[#800020]" />
                                            Input Nilai & Evaluasi Guru
                                        </h5>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                                Nilai Hasil Evaluasi (Skala 0 - {assignment.max_score}) <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                max={assignment.max_score}
                                                placeholder="Contoh: 90"
                                                value={gradeForm.score}
                                                onChange={(e) => setGradeForm({ ...gradeForm, score: e.target.value })}
                                                className="w-full h-10 px-3.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                                Catatan / Umpan Balik Guru untuk Siswa
                                            </label>
                                            <textarea
                                                rows={3}
                                                placeholder="Berikan apresiasi atau saran perbaikan untuk siswa..."
                                                value={gradeForm.teacher_feedback}
                                                onChange={(e) => setGradeForm({ ...gradeForm, teacher_feedback: e.target.value })}
                                                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="w-full py-2.5 bg-[#800020] hover:bg-[#5C0017] text-white font-bold text-xs rounded-xl shadow-sm transition disabled:opacity-50 inline-flex items-center justify-center"
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                            <span>{isSaving ? 'Menyimpan Nilai...' : 'Simpan Nilai & Catatan Evaluasi'}</span>
                                        </button>
                                    </form>
                                ) : null}
                            </>
                        ) : (
                            <div className="text-center py-12 text-slate-400 text-xs">
                                Pilih siswa di panel sebelah kiri untuk melihat jawaban dan memberikan nilai.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
