import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { Search, Download, PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';

// Sub-components
import TabSiswa from './Partials/TabSiswa';
import TabGuru from './Partials/TabGuru';
import TabRombel from './Partials/TabRombel';
import TabMapel from './Partials/TabMapel';

// Modals
import ModalRombel from './Modals/ModalRombel';
import ModalSiswa from './Modals/ModalSiswa';
import ModalGuru from './Modals/ModalGuru';
import ModalMapel from './Modals/ModalMapel';
import ModalDetailSiswa from './Modals/ModalDetailSiswa';

export default function MasterDataIndex({ 
    currentTab = 'siswa', 
    teachers = [], 
    classes = [], 
    subjects = [], 
    students = [], 
    errors = {} 
}) {
    const { auth } = usePage().props;
    const userRole = auth?.user?.role || 'siswa';
    const canManageMaster = userRole === 'admin' || userRole === 'pimpinan';

    const [tab, setTab] = useState(canManageMaster ? currentTab : 'siswa');
    const [search, setSearch] = useState('');
    const [notification, setNotification] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ==================== MODALS STATE ==================== //

    // 1. Rombel Modal
    const [isRombelModalOpen, setIsRombelModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState(null);
    const [rombelForm, setRombelForm] = useState({ name: '', grade_level: 1, homeroom_teacher_id: '' });

    // 2. Student Modal
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [studentForm, setStudentForm] = useState({
        full_name: '', nisn: '', nis: '', nik: '', class_id: classes[0]?.id || '',
        gender: 'L', birth_place: 'Tana Toraja', birth_date: '2014-06-15', religion: 'Kristen',
        address: '', guardian_name: '', guardian_relation: 'ayah', guardian_phone: '', guardian_occupation: ''
    });

    // 3. Student Detail Modal
    const [selectedStudentDetail, setSelectedStudentDetail] = useState(null);

    // 4. Teacher Modal
    const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [teacherForm, setTeacherForm] = useState({
        full_name: '', nip: '', gender: 'L', employment_status: 'PNS',
        education_level: 'S1', email: '', role: 'guru'
    });

    // 5. Subject Modal
    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);
    const [subjectForm, setSubjectForm] = useState({ code: '', name: '', category: 'wajib', kkm: 75.00 });

    // ==================== ROMBEL ACTIONS ==================== //

    const openCreateRombelModal = () => {
        setEditingClass(null);
        setRombelForm({ name: '', grade_level: 1, homeroom_teacher_id: '' });
        setIsRombelModalOpen(true);
    };

    const openEditRombelModal = (cls) => {
        setEditingClass(cls);
        setRombelForm({ name: cls.name, grade_level: cls.grade_level, homeroom_teacher_id: cls.homeroom_teacher_id || '' });
        setIsRombelModalOpen(true);
    };

    const handleSaveRombel = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const routeName = editingClass ? 'master-data.classes.update' : 'master-data.classes.store';
        const routeParam = editingClass ? editingClass.id : undefined;

        router[editingClass ? 'put' : 'post'](route(routeName, routeParam), rombelForm, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                setIsRombelModalOpen(false);
                setNotification(editingClass ? 'Rombel berhasil diperbarui.' : 'Rombel baru berhasil ditambahkan.');
                setTimeout(() => setNotification(null), 4000);
            },
            onError: () => setIsSubmitting(false)
        });
    };

    const handleDeleteRombel = (cls) => {
        if (confirm(`Apakah Anda yakin ingin menghapus rombel ${cls.name}?`)) {
            router.delete(route('master-data.classes.destroy', cls.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setNotification('Rombel berhasil dihapus.');
                    setTimeout(() => setNotification(null), 4000);
                }
            });
        }
    };

    // ==================== STUDENT ACTIONS ==================== //

    const openCreateStudentModal = () => {
        setEditingStudent(null);
        setStudentForm({
            full_name: '', nisn: '', nis: '', nik: '', class_id: classes[0]?.id || '',
            gender: 'L', birth_place: 'Tana Toraja', birth_date: '2014-06-15', religion: 'Kristen',
            address: '', guardian_name: '', guardian_relation: 'ayah', guardian_phone: '', guardian_occupation: ''
        });
        setIsStudentModalOpen(true);
    };

    const openEditStudentModal = (st) => {
        setEditingStudent(st);
        setStudentForm({
            full_name: st.full_name || '',
            nisn: st.nisn || '',
            nis: st.nis || '',
            nik: st.nik || '',
            class_id: st.class_id || (classes[0]?.id || ''),
            gender: st.gender || 'L',
            birth_place: st.birth_place || 'Tana Toraja',
            birth_date: st.birth_date || '2014-06-15',
            religion: st.religion || 'Kristen',
            address: st.address || '',
            guardian_name: st.guardian_name || '',
            guardian_relation: st.guardian_relation || 'ayah',
            guardian_phone: st.guardian_phone || '',
            guardian_occupation: st.guardian_occupation || ''
        });
        setIsStudentModalOpen(true);
    };

    const handleSaveStudent = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const routeName = editingStudent ? 'master-data.students.update' : 'master-data.students.store';
        const routeParam = editingStudent ? editingStudent.id : undefined;

        router[editingStudent ? 'put' : 'post'](route(routeName, routeParam), studentForm, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                setIsStudentModalOpen(false);
                setNotification(editingStudent ? 'Data siswa berhasil diperbarui.' : 'Siswa baru berhasil ditambahkan.');
                setTimeout(() => setNotification(null), 4000);
            },
            onError: () => setIsSubmitting(false)
        });
    };

    const handleDeleteStudent = (st) => {
        if (confirm(`Apakah Anda yakin ingin menghapus data siswa ${st.full_name}?`)) {
            router.delete(route('master-data.students.destroy', st.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setNotification('Data siswa berhasil dihapus.');
                    setTimeout(() => setNotification(null), 4000);
                }
            });
        }
    };

    // ==================== TEACHER ACTIONS ==================== //

    const openCreateTeacherModal = () => {
        setEditingTeacher(null);
        setTeacherForm({
            full_name: '', nip: '', gender: 'L', employment_status: 'PNS',
            education_level: 'S1', email: '', role: 'guru', subject_specialization: '', photo: null
        });
        setIsTeacherModalOpen(true);
    };

    const openEditTeacherModal = (tc) => {
        setEditingTeacher(tc);
        setTeacherForm({
            full_name: tc.full_name || '',
            nip: tc.nip || '',
            gender: tc.gender || 'L',
            employment_status: tc.employment_status || 'PNS',
            education_level: tc.education_level || 'S1',
            email: tc.email || '',
            role: tc.role || 'guru',
            subject_specialization: tc.subject_specialization || '',
            photo: null
        });
        setIsTeacherModalOpen(true);
    };

    const handleSaveTeacher = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('full_name', teacherForm.full_name || '');
        formData.append('nip', teacherForm.nip || '');
        formData.append('gender', teacherForm.gender || 'L');
        formData.append('employment_status', teacherForm.employment_status || 'PNS');
        formData.append('education_level', teacherForm.education_level || 'S1');
        formData.append('email', teacherForm.email || '');
        formData.append('role', teacherForm.role || 'guru');
        formData.append('subject_specialization', teacherForm.subject_specialization || '');
        if (teacherForm.photo instanceof File) {
            formData.append('photo', teacherForm.photo);
        }

        const isEdit = !!editingTeacher;
        if (isEdit) {
            formData.append('_method', 'PUT');
        }

        const routeUrl = isEdit
            ? route('master-data.teachers.update', editingTeacher.id)
            : route('master-data.teachers.store');

        router.post(routeUrl, formData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                setIsTeacherModalOpen(false);
                setNotification(isEdit ? 'Data pendidik berhasil diperbarui.' : 'Pendidik baru berhasil ditambahkan.');
                setTimeout(() => setNotification(null), 4000);
            },
            onError: () => setIsSubmitting(false)
        });
    };

    const handleDeleteTeacher = (tc) => {
        if (confirm(`Apakah Anda yakin ingin menghapus data pendidik ${tc.full_name}?`)) {
            router.delete(route('master-data.teachers.destroy', tc.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setNotification('Data pendidik berhasil dihapus.');
                    setTimeout(() => setNotification(null), 4000);
                }
            });
        }
    };

    // ==================== SUBJECT ACTIONS ==================== //

    const openCreateSubjectModal = () => {
        setEditingSubject(null);
        setSubjectForm({ code: '', name: '', category: 'wajib', kkm: 75.00 });
        setIsSubjectModalOpen(true);
    };

    const openEditSubjectModal = (sb) => {
        setEditingSubject(sb);
        setSubjectForm({
            code: sb.code || '',
            name: sb.name || '',
            category: sb.category || 'wajib',
            kkm: sb.kkm || 75.00
        });
        setIsSubjectModalOpen(true);
    };

    const handleSaveSubject = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const routeName = editingSubject ? 'master-data.subjects.update' : 'master-data.subjects.store';
        const routeParam = editingSubject ? editingSubject.id : undefined;

        router[editingSubject ? 'put' : 'post'](route(routeName, routeParam), subjectForm, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                setIsSubjectModalOpen(false);
                setNotification(editingSubject ? 'Mata pelajaran berhasil diperbarui.' : 'Mata pelajaran baru berhasil ditambahkan.');
                setTimeout(() => setNotification(null), 4000);
            },
            onError: () => setIsSubmitting(false)
        });
    };

    const handleDeleteSubject = (sb) => {
        if (confirm(`Apakah Anda yakin ingin menghapus mapel ${sb.name}?`)) {
            router.delete(route('master-data.subjects.destroy', sb.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setNotification('Mata pelajaran berhasil dihapus.');
                    setTimeout(() => setNotification(null), 4000);
                }
            });
        }
    };

    // ==================== EXPORTS ==================== //

    const exportToCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        if (tab === 'siswa') {
            csvContent += "NISN,NIS,Nama Lengkap,Kelas,Gender,Nama Wali,No HP Wali\n";
            (filteredStudents || []).forEach(s => {
                csvContent += `"${s.nisn}","${s.nis}","${s.full_name}","${s.class_name || ''}","${s.gender}","${s.guardian_name || ''}","${s.guardian_phone || ''}"\n`;
            });
        } else if (tab === 'guru') {
            csvContent += "NIP,Nama Lengkap,Gender,Status Kepegawaian,Pendidikan,Email\n";
            (filteredTeachers || []).forEach(t => {
                csvContent += `"${t.nip || ''}","${t.full_name}","${t.gender}","${t.employment_status}","${t.education_level}","${t.email || ''}"\n`;
            });
        } else if (tab === 'rombel') {
            csvContent += "Nama Rombel,Tingkat Kelas,Wali Kelas\n";
            (classes || []).forEach(c => {
                csvContent += `"${c.name}","${c.grade_level}","${c.homeroom_teacher_name || 'Belum Ditugaskan'}"\n`;
            });
        } else {
            csvContent += "Kode Mapel,Nama Mata Pelajaran,Kategori,KKM\n";
            (subjects || []).forEach(sb => {
                csvContent += `"${sb.code}","${sb.name}","${sb.category}","${sb.kkm}"\n`;
            });
        }

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `MasterData_${tab.toUpperCase()}_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // ==================== FILTERS ==================== //

    const studentList = Array.isArray(students) ? students : (students?.data || []);

    const filteredStudents = studentList.filter(s => 
        s.full_name?.toLowerCase().includes(search.toLowerCase()) || 
        s.nisn?.includes(search) ||
        s.nis?.includes(search)
    );

    const filteredTeachers = (teachers || []).filter(t => 
        t.full_name?.toLowerCase().includes(search.toLowerCase()) || 
        (t.nip && t.nip.includes(search))
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">
                            Master Data Sekolah
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Kelola data siswa, pendidik, rombongan belajar, dan katalog kurikulum
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
                        <button
                            onClick={() => setTab('siswa')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                                tab === 'siswa'
                                    ? 'bg-[#800020] text-white shadow-sm'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            Buku Induk Siswa ({studentList.length})
                        </button>
                        {canManageMaster && (
                            <>
                                <button
                                    onClick={() => setTab('guru')}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                                        tab === 'guru'
                                            ? 'bg-[#800020] text-white shadow-sm'
                                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    Tenaga Pendidik ({teachers ? teachers.length : 0})
                                </button>
                                <button
                                    onClick={() => setTab('rombel')}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                                        tab === 'rombel'
                                            ? 'bg-[#800020] text-white shadow-sm'
                                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    Rombel ({classes ? classes.length : 0})
                                </button>
                                <button
                                    onClick={() => setTab('mapel')}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                                        tab === 'mapel'
                                            ? 'bg-[#800020] text-white shadow-sm'
                                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    Mata Pelajaran ({subjects ? subjects.length : 0})
                                </button>
                            </>
                        )}
                    </div>
                </div>
            }
        >
            <Head title="Master Data - Smart School LMS" />

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

                {/* Action Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama, NISN, NIP..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-[#800020] focus:ring-[#800020]"
                        />
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                        <button 
                            onClick={exportToCSV}
                            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl inline-flex items-center shadow-sm transition"
                        >
                            <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                            <span>Ekspor Data (CSV)</span>
                        </button>
                        {canManageMaster && (
                            tab === 'siswa' ? (
                                <button 
                                    onClick={openCreateStudentModal}
                                    className="px-3.5 py-2 bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-semibold rounded-xl inline-flex items-center shadow-sm transition"
                                >
                                    <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                                    <span>Tambah Siswa</span>
                                </button>
                            ) : tab === 'guru' ? (
                                <button 
                                    onClick={openCreateTeacherModal}
                                    className="px-3.5 py-2 bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-semibold rounded-xl inline-flex items-center shadow-sm transition"
                                >
                                    <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                                    <span>Tambah Pendidik</span>
                                </button>
                            ) : tab === 'rombel' ? (
                                <button 
                                    onClick={openCreateRombelModal}
                                    className="px-3.5 py-2 bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-semibold rounded-xl inline-flex items-center shadow-sm transition"
                                >
                                    <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                                    <span>Tambah Rombel</span>
                                </button>
                            ) : (
                                <button 
                                    onClick={openCreateSubjectModal}
                                    className="px-3.5 py-2 bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-semibold rounded-xl inline-flex items-center shadow-sm transition"
                                >
                                    <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                                    <span>Tambah Mapel</span>
                                </button>
                            )
                        )}
                    </div>
                </div>

                {/* TAB CONTENT */}
                {tab === 'siswa' && (
                    <TabSiswa 
                        students={filteredStudents} 
                        canManageMaster={canManageMaster} 
                        onViewDetail={setSelectedStudentDetail} 
                        onEdit={openEditStudentModal} 
                        onDelete={handleDeleteStudent} 
                    />
                )}

                {tab === 'guru' && (
                    <TabGuru 
                        teachers={filteredTeachers} 
                        canManageMaster={canManageMaster} 
                        onEdit={openEditTeacherModal} 
                        onDelete={handleDeleteTeacher} 
                    />
                )}

                {tab === 'rombel' && (
                    <TabRombel 
                        classes={classes} 
                        canManageMaster={canManageMaster} 
                        onEdit={openEditRombelModal} 
                        onDelete={handleDeleteRombel} 
                    />
                )}

                {tab === 'mapel' && (
                    <TabMapel 
                        subjects={subjects} 
                        canManageMaster={canManageMaster} 
                        onEdit={openEditSubjectModal} 
                        onDelete={handleDeleteSubject} 
                    />
                )}
            </div>

            {/* MODALS */}
            <ModalRombel 
                isOpen={isRombelModalOpen} 
                onClose={() => setIsRombelModalOpen(false)} 
                editingClass={editingClass} 
                rombelForm={rombelForm} 
                setRombelForm={setRombelForm} 
                handleSaveRombel={handleSaveRombel} 
                teachers={teachers} 
                isSubmitting={isSubmitting} 
            />

            <ModalSiswa 
                isOpen={isStudentModalOpen} 
                onClose={() => setIsStudentModalOpen(false)} 
                editingStudent={editingStudent} 
                studentForm={studentForm} 
                setStudentForm={setStudentForm} 
                handleSaveStudent={handleSaveStudent} 
                classes={classes} 
                isSubmitting={isSubmitting} 
            />

            <ModalDetailSiswa 
                student={selectedStudentDetail} 
                onClose={() => setSelectedStudentDetail(null)} 
            />

            <ModalGuru 
                isOpen={isTeacherModalOpen} 
                onClose={() => setIsTeacherModalOpen(false)} 
                editingTeacher={editingTeacher} 
                teacherForm={teacherForm} 
                setTeacherForm={setTeacherForm} 
                handleSaveTeacher={handleSaveTeacher} 
                subjects={subjects}
                isSubmitting={isSubmitting} 
            />

            <ModalMapel 
                isOpen={isSubjectModalOpen} 
                onClose={() => setIsSubjectModalOpen(false)} 
                editingSubject={editingSubject} 
                subjectForm={subjectForm} 
                setSubjectForm={setSubjectForm} 
                handleSaveSubject={handleSaveSubject} 
                isSubmitting={isSubmitting} 
            />
        </AuthenticatedLayout>
    );
}
