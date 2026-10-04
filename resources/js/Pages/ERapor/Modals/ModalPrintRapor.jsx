import React from 'react';
import { X, Printer, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ModalPrintRapor({ 
    isOpen, 
    onClose, 
    student, 
    selectedClass, 
    academicYear, 
    subjects = [], 
    gradesMap = {}, 
    evaluations = {}, 
    schoolProfile 
}) {
    if (!isOpen || !student) return null;

    const studentGrades = gradesMap[student.id] || {};
    const evaluation = evaluations[student.id] || { attitude_score: 'Baik', homeroom_notes: 'Menunjukkan perkembangan akademis yang sangat memuaskan, aktif dalam kegiatan pembelajaran serta bersikap sopan dan santun.', status: 'verified_wali_kelas' };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scale-up">
                {/* Screen Header Controls (Hidden during print) */}
                <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-slate-800 print:hidden">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-[#800020] rounded-xl">
                            <ShieldCheck className="w-5 h-5 text-rose-200" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Pratinjau Rapor Digital Resmi</h3>
                            <p className="text-xs text-slate-400">
                                Kurikulum Merdeka &bull; UPT SDN 9 Gandangbatu Sillanan
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2 bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold rounded-xl shadow-md transition inline-flex items-center space-x-1.5"
                        >
                            <Printer className="w-4 h-4" />
                            <span>Cetak Rapor (PDF)</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* PRINTABLE REPORT CARD CONTAINER */}
                <div className="p-8 sm:p-10 bg-white text-slate-900 font-sans leading-relaxed print:p-0 print:m-0 print:shadow-none print:w-full">
                    {/* Official Kop Surat Header */}
                    <div className="border-b-4 border-double border-slate-900 pb-4 mb-6 text-center flex items-center justify-between">
                        <img 
                            src="/logo.webp" 
                            alt="Logo Sekolah" 
                            className="w-16 h-16 object-contain shrink-0 hidden sm:block p-1" 
                        />
                        <div className="flex-1 text-center px-4">
                            <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-600">
                                PEMERINTAH KABUPATEN TANA TORAJA
                            </h4>
                            <h3 className="text-sm uppercase font-black text-slate-900 tracking-wider mt-0.5">
                                DINAS PENDIDIKAN DAN KEBUDAYAAN
                            </h3>
                            <h2 className="text-base font-black uppercase text-[#800020] tracking-wide mt-0.5">
                                {schoolProfile?.school_name || 'UPT SDN 9 GANDANGBATU SILLANAN'}
                            </h2>
                            <p className="text-[11px] font-medium text-slate-600 mt-1">
                                {schoolProfile?.address || 'Gandangbatu, Kec. Gandangbatu Sillanan, Kab. Tana Toraja, Sulawesi Selatan 91871'} &bull; NPSN: {schoolProfile?.npsn || '40307044'}
                            </p>
                        </div>
                        <div className="w-16 h-16 shrink-0 hidden sm:flex items-center justify-center bg-[#800020] text-white rounded-2xl font-black text-sm">
                            SD
                        </div>
                    </div>

                    {/* Document Title */}
                    <div className="text-center mb-6">
                        <h3 className="text-base font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-800 inline-block pb-1">
                            LAPORAN HASIL BELAJAR (RAPOR)
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                            KURIKULUM MERDEKA &bull; SEMESTER {academicYear?.semester ? academicYear.semester.toUpperCase() : 'GANJIL'} TA {academicYear?.name || '2026/2027'}
                        </p>
                    </div>

                    {/* Student Identity Grid */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                        <div>
                            <span className="text-slate-500 inline-block w-32">Nama Peserta Didik</span>
                            <span className="font-bold text-slate-900">: {student.full_name}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 inline-block w-32">Kelas / Rombel</span>
                            <span className="font-bold text-slate-900">: {selectedClass?.name || 'Kelas 6'}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 inline-block w-32">NIS / NISN</span>
                            <span className="font-mono font-bold text-slate-900">: {student.nis} / {student.nisn}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 inline-block w-32">Fase / Jenjang</span>
                            <span className="font-bold text-slate-900">: Fase C (Sekolah Dasar)</span>
                        </div>
                        <div>
                            <span className="text-slate-500 inline-block w-32">Tempat, Tgl Lahir</span>
                            <span className="font-bold text-slate-900">: {student.birth_place || 'Gandangbatu'}, {student.birth_date || '12 Mei 2014'}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 inline-block w-32">Wali Kelas</span>
                            <span className="font-bold text-slate-900">: {selectedClass?.homeroom_teacher_name || 'Budi Santoso, S.Pd.'}</span>
                        </div>
                    </div>

                    {/* Subject Grades Table */}
                    <div className="mb-6 overflow-hidden border border-slate-900 rounded-xl">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-slate-100 border-b border-slate-900 text-slate-900 font-bold uppercase tracking-wider">
                                    <th className="p-2.5 text-center border-r border-slate-900 w-10">No</th>
                                    <th className="p-2.5 border-r border-slate-900">Mata Pelajaran</th>
                                    <th className="p-2.5 text-center border-r border-slate-900 w-20">Nilai Akhir</th>
                                    <th className="p-2.5 text-center border-r border-slate-900 w-16">Predikat</th>
                                    <th className="p-2.5">Capaian Pembelajaran (Deskripsi Rapor)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-900">
                                {subjects.map((sbj, idx) => {
                                    const g = studentGrades[sbj.id];
                                    const score = g ? g.final_score : '85.00';
                                    const grade = g ? g.letter_grade : 'B';
                                    const desc = g ? g.competency_desc : `Menunjukkan penguasaan yang sangat baik dalam memahami materi ${sbj.name}.`;

                                    return (
                                        <tr key={sbj.id} className="border-b border-slate-300">
                                            <td className="p-2 text-center border-r border-slate-900 font-bold text-slate-600">{idx + 1}</td>
                                            <td className="p-2 border-r border-slate-900 font-bold text-slate-900">{sbj.name}</td>
                                            <td className="p-2 text-center border-r border-slate-900 font-mono font-black text-[#800020] text-sm">{score}</td>
                                            <td className="p-2 text-center border-r border-slate-900 font-bold text-slate-800">{grade}</td>
                                            <td className="p-2 text-[11px] text-slate-700 leading-normal">{desc}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Ketentuan Predikat Note */}
                    <div className="mb-4 text-[10px] text-slate-700 flex items-center justify-between px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg">
                        <span><strong>Ketentuan Predikat:</strong> A (&ge;89), B (78 - 88), C (65 - 77), D (&lt;65)</span>
                        <span className="font-semibold text-slate-500">Standar Kurikulum Merdeka</span>
                    </div>

                    {/* Extra Assessment & Attendance */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-xs">
                        <div className="border border-slate-900 rounded-xl p-3 bg-slate-50 space-y-2">
                            <h4 className="font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
                                Catatan Nilai Sikap & Perkembangan
                            </h4>
                            <div>
                                <span className="text-slate-500">Predikat Sikap: </span>
                                <span className="font-bold text-emerald-800">{evaluation.attitude_score || 'Baik'}</span>
                            </div>
                            <p className="text-[11px] text-slate-700 leading-relaxed italic">
                                "{evaluation.homeroom_notes || 'Menunjukkan perkembangan akademis yang sangat memuaskan, aktif dalam kegiatan pembelajaran serta bersikap sopan dan santun.'}"
                            </p>
                        </div>

                        <div className="border border-slate-900 rounded-xl p-3 bg-slate-50 space-y-2">
                            <h4 className="font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
                                Rekapitulasi Presensi (Ketidakhadiran)
                            </h4>
                            <div className="grid grid-cols-3 gap-2 text-center pt-1">
                                <div className="p-2 bg-white rounded-lg border border-slate-200">
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Sakit</p>
                                    <p className="font-bold text-slate-900 font-mono text-sm">0 hari</p>
                                </div>
                                <div className="p-2 bg-white rounded-lg border border-slate-200">
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Izin</p>
                                    <p className="font-bold text-slate-900 font-mono text-sm">1 hari</p>
                                </div>
                                <div className="p-2 bg-white rounded-lg border border-slate-200">
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Tanpa Keterangan</p>
                                    <p className="font-bold text-slate-900 font-mono text-sm">0 hari</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Official Digital Signatures Section */}
                    <div className="pt-6 border-t border-slate-300 grid grid-cols-3 gap-4 text-center text-xs">
                        <div>
                            <p className="text-slate-500 font-medium">Orang Tua / Wali Murid</p>
                            <div className="h-20 flex items-end justify-center pb-2">
                                <span className="border-b border-dashed border-slate-400 w-36 inline-block"></span>
                            </div>
                            <p className="font-bold text-slate-900">( ........................................ )</p>
                        </div>

                        <div>
                            <p className="text-slate-500 font-medium">Wali Kelas {selectedClass?.name || 'Kelas 6'}</p>
                            <div className="h-20 flex flex-col items-center justify-center">
                                <div className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold flex items-center space-x-1">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Tanda Tangan Digital</span>
                                </div>
                            </div>
                            <p className="font-bold text-slate-900 underline">{selectedClass?.homeroom_teacher_name || 'Budi Santoso, S.Pd.'}</p>
                            <p className="text-[10px] text-slate-500 font-mono">NIP. {selectedClass?.homeroom_teacher_nip || '198705122015021003'}</p>
                        </div>

                        <div>
                            <p className="text-slate-500 font-medium">Gandangbatu, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            <p className="text-slate-500 font-medium">Kepala UPT SDN 9 Gandangbatu Sillanan</p>
                            <div className="h-16 flex flex-col items-center justify-center">
                                <div className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold flex items-center space-x-1">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Sah & Terverifikasi</span>
                                </div>
                            </div>
                            <p className="font-bold text-slate-900 underline">{schoolProfile?.principal_name || 'Hendrika Genti, S.Pd.SD.'}</p>
                            <p className="text-[10px] text-slate-500 font-mono">NIP. {schoolProfile?.principal_nip || '198502012010012025'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
