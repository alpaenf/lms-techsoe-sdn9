import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { 
    BookOpen, 
    FileText, 
    PlusCircle, 
    ChevronDown, 
    Send, 
    CheckCircle2, 
    AlertCircle,
    Search
} from 'lucide-react';

// Subcomponents
import TabMateri from './Partials/TabMateri';
import TabTugas from './Partials/TabTugas';

// Modals
import ModalMateri from './Modals/ModalMateri';
import ModalTugas from './Modals/ModalTugas';
import ModalSubmitTugas from './Modals/ModalSubmitTugas';
import ModalPenilaianTugas from './Modals/ModalPenilaianTugas';

export default function ELearningIndex({ 
    subjects = [], 
    classes = [], 
    materials = [], 
    assignments = [], 
    currentStudent = null, 
    currentTeacher = null,
    errors = {} 
}) {
    const { auth } = usePage().props;
    const userRole = auth?.user?.role || 'siswa';
    const isSiswa = userRole === 'siswa';
    const canManage = ['admin', 'guru', 'pimpinan'].includes(userRole);

    const [tab, setTab] = useState('materi');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ==================== MODALS STATE ==================== //

    // 1. Material Modal
    const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState(null);
    const [materialForm, setMaterialForm] = useState({
        title: '', subject_id: subjects[0]?.id || '', class_id: classes[0]?.id || '',
        type: 'file', body_text: '', content_url: '', file: null
    });

    // 2. Assignment Modal
    const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [assignmentForm, setAssignmentForm] = useState({
        title: '', subject_id: subjects[0]?.id || '', class_id: classes[0]?.id || '',
        instructions: '', due_date: '', max_score: 100, attachment: null
    });

    // 3. Student Submit Modal
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [selectedAssignmentForSubmit, setSelectedAssignmentForSubmit] = useState(null);
    const [submitForm, setSubmitForm] = useState({ assignment_id: '', student_notes: '', file: null });

    // 4. Teacher Grading Modal
    const [isPenilaianModalOpen, setIsPenilaianModalOpen] = useState(false);
    const [selectedAssignmentForPenilaian, setSelectedAssignmentForPenilaian] = useState(null);

    // ==================== MATERIAL ACTIONS ==================== //

    const openCreateMaterialModal = () => {
        setEditingMaterial(null);
        setMaterialForm({
            title: '', 
            subject_id: subjects.length > 0 ? String(subjects[0].id) : '', 
            class_id: classes.length > 0 ? String(classes[0].id) : '',
            type: 'file', 
            body_text: '', 
            content_url: '', 
            file: null
        });
        setIsMaterialModalOpen(true);
    };

    const openEditMaterialModal = (m) => {
        setEditingMaterial(m);
        setMaterialForm({
            title: m.title || '',
            subject_id: m.subject_id ? String(m.subject_id) : '',
            class_id: m.class_id ? String(m.class_id) : '',
            type: m.type || 'file',
            body_text: m.body_text || '',
            content_url: m.content_url || '',
            file: null
        });
        setIsMaterialModalOpen(true);
    };

    const handleSaveMaterial = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('title', materialForm.title);
        formData.append('subject_id', materialForm.subject_id);
        formData.append('class_id', materialForm.class_id);
        formData.append('type', materialForm.type);
        if (materialForm.body_text) formData.append('body_text', materialForm.body_text);
        if (materialForm.content_url) formData.append('content_url', materialForm.content_url);
        if (materialForm.file) formData.append('file', materialForm.file);

        if (editingMaterial) {
            formData.append('_method', 'PUT');
            router.post(route('elearning.materials.update', editingMaterial.id), formData, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    setIsMaterialModalOpen(false);
                    setNotification('Bahan ajar berhasil diperbarui.');
                    setTimeout(() => setNotification(null), 4000);
                },
                onError: () => setIsSubmitting(false)
            });
        } else {
            router.post(route('elearning.materials.store'), formData, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    setIsMaterialModalOpen(false);
                    setNotification('Bahan ajar baru berhasil dipublikasikan.');
                    setTimeout(() => setNotification(null), 4000);
                },
                onError: () => setIsSubmitting(false)
            });
        }
    };

    const handleDeleteMaterial = (m) => {
        if (confirm(`Apakah Anda yakin ingin menghapus bahan ajar "${m.title}"?`)) {
            router.delete(route('elearning.materials.destroy', m.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setNotification('Bahan ajar berhasil dihapus.');
                    setTimeout(() => setNotification(null), 4000);
                }
            });
        }
    };

    // ==================== ASSIGNMENT ACTIONS ==================== //

    const openCreateAssignmentModal = () => {
        setEditingAssignment(null);
        const defaultDueDate = new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16);
        setAssignmentForm({
            title: '', 
            subject_id: subjects.length > 0 ? String(subjects[0].id) : '', 
            class_id: classes.length > 0 ? String(classes[0].id) : '',
            instructions: '', 
            due_date: defaultDueDate, 
            max_score: 100, 
            attachment: null
        });
        setIsAssignmentModalOpen(true);
    };

    const openEditAssignmentModal = (asg) => {
        setEditingAssignment(asg);
        const formattedDueDate = asg.due_date ? new Date(asg.due_date).toISOString().slice(0, 16) : '';
        setAssignmentForm({
            title: asg.title || '',
            subject_id: asg.subject_id || '',
            class_id: asg.class_id || '',
            instructions: asg.instructions || '',
            due_date: formattedDueDate,
            max_score: asg.max_score || 100,
            attachment: null
        });
        setIsAssignmentModalOpen(true);
    };

    const handleSaveAssignment = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('title', assignmentForm.title);
        formData.append('subject_id', assignmentForm.subject_id);
        formData.append('class_id', assignmentForm.class_id);
        formData.append('instructions', assignmentForm.instructions);
        formData.append('due_date', assignmentForm.due_date);
        formData.append('max_score', assignmentForm.max_score);
        if (assignmentForm.attachment) formData.append('attachment', assignmentForm.attachment);

        if (editingAssignment) {
            formData.append('_method', 'PUT');
            router.post(route('elearning.assignments.update', editingAssignment.id), formData, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    setIsAssignmentModalOpen(false);
                    setNotification('Penugasan berhasil diperbarui.');
                    setTimeout(() => setNotification(null), 4000);
                },
                onError: () => setIsSubmitting(false)
            });
        } else {
            router.post(route('elearning.assignments.store'), formData, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    setIsAssignmentModalOpen(false);
                    setNotification('Penugasan baru berhasil dipublikasikan.');
                    setTimeout(() => setNotification(null), 4000);
                },
                onError: () => setIsSubmitting(false)
            });
        }
    };

    const handleDeleteAssignment = (asg) => {
        if (confirm(`Apakah Anda yakin ingin menghapus penugasan "${asg.title}"?`)) {
            router.delete(route('elearning.assignments.destroy', asg.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setNotification('Penugasan berhasil dihapus.');
                    setTimeout(() => setNotification(null), 4000);
                }
            });
        }
    };

    // ==================== SUBMISSION ACTIONS (SISWA) ==================== //

    const openSubmitAssignmentModal = (asg) => {
        setSelectedAssignmentForSubmit(asg);
        setSubmitForm({
            assignment_id: asg.id,
            student_notes: asg.my_submission?.student_notes || '',
            file: null
        });
        setIsSubmitModalOpen(true);
    };

    const handleSubmitAssignment = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('assignment_id', submitForm.assignment_id);
        if (submitForm.student_notes) formData.append('student_notes', submitForm.student_notes);
        if (submitForm.file) formData.append('file', submitForm.file);

        router.post(route('elearning.submissions.submit'), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                setIsSubmitModalOpen(false);
                setNotification('Jawaban tugas Anda berhasil dikumpulkan.');
                setTimeout(() => setNotification(null), 4000);
            },
            onError: () => setIsSubmitting(false)
        });
    };

    // ==================== PENILAIAN ACTIONS (GURU) ==================== //

    const openPenilaianModal = (asg) => {
        setSelectedAssignmentForPenilaian(asg);
        setIsPenilaianModalOpen(true);
    };

    // ==================== FILTERS ==================== //

    const filteredMaterials = materials.filter(m => {
        const matchSubject = !selectedSubject || String(m.subject_id) === String(selectedSubject);
        const matchClass = !selectedClass || String(m.class_id) === String(selectedClass);
        const matchSearch = !searchQuery || m.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchSubject && matchClass && matchSearch;
    });

    const filteredAssignments = assignments.filter(asg => {
        const matchSubject = !selectedSubject || String(asg.subject_id) === String(selectedSubject);
        const matchClass = !selectedClass || String(asg.class_id) === String(selectedClass);
        const matchSearch = !searchQuery || asg.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchSubject && matchClass && matchSearch;
    });

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">
                            {isSiswa ? 'Portal E-Learning Peserta Didik' : 'E-Learning & Pembelajaran Digital'}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {isSiswa 
                                ? 'Akses modul materi pelajaran dan lembar pengumpulan penugasan digital' 
                                : 'Manajemen Modul Ajar, Pembelajaran Digital, dan Asesmen Tugas Siswa'}
                        </p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setTab('materi')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                                tab === 'materi'
                                    ? 'bg-[#800020] text-white shadow-sm'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {isSiswa ? 'Materi Pelajaran' : 'Modul Bahan Ajar'} ({filteredMaterials.length})
                        </button>
                        <button
                            onClick={() => setTab('tugas')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                                tab === 'tugas'
                                    ? 'bg-[#800020] text-white shadow-sm'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {isSiswa ? 'Tugas Saya' : 'Penugasan & Ujian'} ({filteredAssignments.length})
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={isSiswa ? 'E-Learning Siswa' : 'E-Learning'} />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Notification toast */}
                {notification && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center space-x-3 shadow-sm animate-fade-in">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="text-xs font-semibold">{notification}</span>
                    </div>
                )}

                {/* Error Banner */}
                {errors && errors.error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-2xl flex items-center space-x-3 shadow-sm">
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        <span className="text-xs font-semibold">{errors.error}</span>
                    </div>
                )}

                {/* Filter Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        <div className="relative inline-block w-full sm:w-auto">
                            <select 
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="w-full sm:w-auto h-10 pl-3.5 pr-9 min-w-[200px] bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:border-[#800020] focus:ring-[#800020] appearance-none cursor-pointer shadow-sm"
                            >
                                <option value="">Semua Mata Pelajaran</option>
                                {subjects.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        <div className="relative inline-block w-full sm:w-auto">
                            <select 
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full sm:w-auto h-10 pl-3.5 pr-9 min-w-[170px] bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:border-[#800020] focus:ring-[#800020] appearance-none cursor-pointer shadow-sm"
                            >
                                <option value="">Semua Tingkat Kelas</option>
                                {classes.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        <div className="relative w-full sm:w-64">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Cari judul..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                            />
                        </div>
                    </div>

                    {canManage && (
                        <div className="w-full sm:w-auto flex justify-end">
                            {tab === 'materi' ? (
                                <button 
                                    onClick={openCreateMaterialModal}
                                    className="px-4 py-2 bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-semibold rounded-xl inline-flex items-center shadow-sm transition"
                                >
                                    <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                                    <span>Tambah Bahan Ajar</span>
                                </button>
                            ) : (
                                <button 
                                    onClick={openCreateAssignmentModal}
                                    className="px-4 py-2 bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-semibold rounded-xl inline-flex items-center shadow-sm transition"
                                >
                                    <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                                    <span>Buat Tugas Baru</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* TAB 1: MODUL BAHAN AJAR */}
                {tab === 'materi' && (
                    <TabMateri 
                        materials={filteredMaterials} 
                        isSiswa={isSiswa} 
                        canManage={canManage} 
                        onEdit={openEditMaterialModal} 
                        onDelete={handleDeleteMaterial} 
                    />
                )}

                {/* TAB 2: TUGAS & UJIAN */}
                {tab === 'tugas' && (
                    <TabTugas 
                        assignments={filteredAssignments} 
                        isSiswa={isSiswa} 
                        canManage={canManage} 
                        onSubmitAssignment={openSubmitAssignmentModal} 
                        onOpenSubmissions={openPenilaianModal} 
                        onEdit={openEditAssignmentModal} 
                        onDelete={handleDeleteAssignment} 
                    />
                )}
            </div>

            {/* MODALS */}
            <ModalMateri 
                isOpen={isMaterialModalOpen} 
                onClose={() => setIsMaterialModalOpen(false)} 
                editingMaterial={editingMaterial} 
                materialForm={materialForm} 
                setMaterialForm={setMaterialForm} 
                handleSaveMaterial={handleSaveMaterial} 
                subjects={subjects} 
                classes={classes} 
                isSubmitting={isSubmitting} 
            />

            <ModalTugas 
                isOpen={isAssignmentModalOpen} 
                onClose={() => setIsAssignmentModalOpen(false)} 
                editingAssignment={editingAssignment} 
                assignmentForm={assignmentForm} 
                setAssignmentForm={setAssignmentForm} 
                handleSaveAssignment={handleSaveAssignment} 
                subjects={subjects} 
                classes={classes} 
                isSubmitting={isSubmitting} 
            />

            <ModalSubmitTugas 
                isOpen={isSubmitModalOpen} 
                onClose={() => setIsSubmitModalOpen(false)} 
                assignment={selectedAssignmentForSubmit} 
                submitForm={submitForm} 
                setSubmitForm={setSubmitForm} 
                handleSubmitAssignment={handleSubmitAssignment} 
                isSubmitting={isSubmitting} 
            />

            <ModalPenilaianTugas 
                isOpen={isPenilaianModalOpen} 
                onClose={() => setIsPenilaianModalOpen(false)} 
                assignment={selectedAssignmentForPenilaian} 
                onNotification={(msg) => {
                    setNotification(msg);
                    setTimeout(() => setNotification(null), 4000);
                }} 
            />
        </AuthenticatedLayout>
    );
}
