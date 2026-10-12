import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Printer, ArrowLeft } from 'lucide-react';

export default function PrintMonthly({
    journals = [],
    teacher = null,
    month = 10,
    year = 2026,
    monthName = 'Oktober',
    selectedClass = null,
    selectedSubject = null,
    schoolProfile = null,
    academicYear = null,
}) {
    const handlePrint = () => {
        window.print();
    };

    // Calculate last date of month for signature
    const lastDay = new Date(year, month, 0).getDate();

    const formatDateIndo = (dateStr) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr + 'T00:00:00');
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-slate-100 py-6 px-4 print:p-0 print:bg-white text-slate-900 font-sans">
            <Head title={`Cetak Jurnal Harian Guru - Bulan ${monthName} ${year}`} />

            {/* Action Bar (Hidden when Printing) */}
            <div className="max-w-5xl mx-auto mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between no-print">
                <Link
                    href={route('journals.index', { month, year, class_id: selectedClass?.id, subject_id: selectedSubject?.id })}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition inline-flex items-center space-x-1.5"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Jurnal</span>
                </Link>

                <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                        Gunakan ukuran kertas <strong>A4</strong> atau <strong>F4/Folio</strong> (Landscape / Portrait)
                    </span>
                    <button
                        onClick={handlePrint}
                        className="px-5 py-2.5 bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold rounded-xl shadow-md transition inline-flex items-center space-x-2"
                    >
                        <Printer className="w-4 h-4" />
                        <span>Cetak / Unduh PDF</span>
                    </button>
                </div>
            </div>

            {/* Printable Document Container */}
            <div className="max-w-5xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-lg border border-slate-200 print:shadow-none print:border-none print:p-0">
                {/* Official School Letterhead / Kop Surat */}
                <div className="border-b-4 border-double border-slate-900 pb-3 mb-6 text-center">
                    <h4 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-800">
                        Pemerintah Kabupaten Tana Toraja
                    </h4>
                    <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-800">
                        Dinas Pendidikan
                    </h3>
                    <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-slate-950 mt-0.5">
                        {schoolProfile?.school_name || 'UPT SDN 9 GANDANGBATU SILLANAN'}
                    </h2>
                    <p className="text-[11px] sm:text-xs text-slate-600 mt-1 font-medium">
                        {schoolProfile?.address || 'Kecamatan Gandangbatu Sillanan'}, Kabupaten Tana Toraja, Sulawesi Selatan
                        {schoolProfile?.postal_code ? ` ${schoolProfile.postal_code}` : ''}
                        {schoolProfile?.email ? ` • Email: ${schoolProfile.email}` : ''}
                    </p>
                </div>

                {/* Document Title */}
                <div className="text-center mb-6">
                    <h3 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-wide underline underline-offset-4">
                        Jurnal Mengajar Harian Guru (Logbook Bulanan)
                    </h3>
                    <p className="text-xs font-bold text-slate-700 mt-1">
                        Bulan: <span className="uppercase">{monthName} {year}</span> • Tahun Ajaran: {academicYear?.name || '2026/2027'} ({academicYear?.semester ? academicYear.semester.toUpperCase() : 'GANJIL'})
                    </p>
                </div>

                {/* Guru & Identitas Rombel */}
                <div className="grid grid-cols-2 gap-4 text-xs mb-6 bg-slate-50 print:bg-transparent p-4 print:p-0 rounded-2xl border border-slate-200 print:border-none">
                    <div className="space-y-1.5">
                        <div className="flex">
                            <span className="w-32 font-bold text-slate-700">Nama Guru</span>
                            <span className="font-semibold text-slate-900">: {teacher?.full_name || 'Semua Guru'}</span>
                        </div>
                        <div className="flex">
                            <span className="w-32 font-bold text-slate-700">NIP / NUPTK</span>
                            <span className="font-semibold text-slate-900">: {teacher?.nip || teacher?.nuptk || '-'}</span>
                        </div>
                        <div className="flex">
                            <span className="w-32 font-bold text-slate-700">Jabatan Guru</span>
                            <span className="font-semibold text-slate-900">: {teacher?.teacher_type === 'guru_mapel' ? 'Guru Mata Pelajaran' : 'Guru / Wali Kelas'}</span>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex">
                            <span className="w-36 font-bold text-slate-700">Mata Pelajaran</span>
                            <span className="font-semibold text-slate-900">: {selectedSubject?.name || 'Semua Mata Pelajaran'}</span>
                        </div>
                        <div className="flex">
                            <span className="w-36 font-bold text-slate-700">Rombongan Belajar</span>
                            <span className="font-semibold text-slate-900">: {selectedClass?.name || 'Semua Kelas Binaan'}</span>
                        </div>
                        <div className="flex">
                            <span className="w-36 font-bold text-slate-700">Total Pembelajaran</span>
                            <span className="font-bold text-[#800020]">: {journals.length} Pertemuan / Kegiatan</span>
                        </div>
                    </div>
                </div>

                {/* Journal Table */}
                <div className="overflow-x-auto mb-8">
                    <table className="w-full text-left text-xs border-collapse border border-slate-300">
                        <thead>
                            <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-300 text-center">
                                <th className="border border-slate-300 p-2 w-8">No</th>
                                <th className="border border-slate-300 p-2 w-28">Hari / Tanggal</th>
                                <th className="border border-slate-300 p-2 w-20">Waktu</th>
                                <th className="border border-slate-300 p-2 w-20">Kelas</th>
                                <th className="border border-slate-300 p-2 w-28">Mata Pelajaran</th>
                                <th className="border border-slate-300 p-2">Pokok Bahasan / Materi</th>
                                <th className="border border-slate-300 p-2">Uraian Aktivitas Belajar</th>
                                <th className="border border-slate-300 p-2 w-28">Kehadiran / Media</th>
                            </tr>
                        </thead>
                        <tbody>
                            {journals.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="border border-slate-300 p-6 text-center text-slate-500 italic font-medium">
                                        Tidak ada catatan jurnal mengajar pada bulan {monthName} {year}.
                                    </td>
                                </tr>
                            ) : (
                                journals.map((item, idx) => (
                                    <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50/50 print:hover:bg-transparent">
                                        <td className="border border-slate-300 p-2 text-center font-bold text-slate-700">
                                            {idx + 1}
                                        </td>
                                        <td className="border border-slate-300 p-2">
                                            <div className="font-bold text-slate-900">{item.day_name}</div>
                                            <div className="text-[11px] text-slate-600 font-medium">{formatDateIndo(item.journal_date)}</div>
                                        </td>
                                        <td className="border border-slate-300 p-2 text-center text-[11px] font-mono">
                                            {item.start_time ? (
                                                <span>{item.start_time.slice(0, 5)} - {item.end_time ? item.end_time.slice(0, 5) : 'selesai'}</span>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="border border-slate-300 p-2 text-center font-semibold text-slate-800">
                                            {item.class?.name || '-'}
                                        </td>
                                        <td className="border border-slate-300 p-2 font-semibold text-slate-800">
                                            {item.subject?.name || '-'}
                                        </td>
                                        <td className="border border-slate-300 p-2 font-medium text-slate-900">
                                            {item.material_topic}
                                        </td>
                                        <td className="border border-slate-300 p-2 text-slate-700 leading-relaxed text-[11px]">
                                            {item.activity_description}
                                            {item.notes && (
                                                <div className="mt-1 text-[10px] text-slate-500 italic">
                                                    Catatan: {item.notes}
                                                </div>
                                            )}
                                        </td>
                                        <td className="border border-slate-300 p-2 text-[11px]">
                                            {item.attendance_notes && (
                                                <div className="font-medium text-slate-800">{item.attendance_notes}</div>
                                            )}
                                            {item.learning_media && (
                                                <div className="text-[10px] text-slate-500 mt-0.5">Media: {item.learning_media}</div>
                                            )}
                                            {!item.attendance_notes && !item.learning_media && (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Signatures Section */}
                <div className="grid grid-cols-2 gap-8 text-xs pt-4 break-inside-avoid">
                    <div className="text-center">
                        <p className="text-slate-700">Mengetahui,</p>
                        <p className="font-bold text-slate-900 mt-0.5">Kepala UPT SDN 9 Gandangbatu Sillanan</p>
                        <div className="h-20 sm:h-24"></div>
                        <p className="font-bold text-slate-900 underline underline-offset-2">
                            {schoolProfile?.principal_name || 'Hendrika Genti, S.Pd.SD.'}
                        </p>
                        <p className="text-slate-600 text-[11px] mt-0.5">
                            NIP. {schoolProfile?.principal_nip || '198502012010012025'}
                        </p>
                    </div>

                    <div className="text-center">
                        <p className="text-slate-700">
                            Gandangbatu Sillanan, {lastDay} {monthName} {year}
                        </p>
                        <p className="font-bold text-slate-900 mt-0.5">
                            {teacher?.teacher_type === 'guru_mapel' ? 'Guru Mata Pelajaran' : 'Guru / Wali Kelas'}
                        </p>
                        <div className="h-20 sm:h-24"></div>
                        <p className="font-bold text-slate-900 underline underline-offset-2">
                            {teacher?.full_name || 'Guru Pengampu'}
                        </p>
                        <p className="text-slate-600 text-[11px] mt-0.5">
                            NIP. {teacher?.nip || teacher?.nuptk || '-'}
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    body {
                        background: #ffffff !important;
                        color: #000000 !important;
                    }
                    @page {
                        size: A4 portrait;
                        margin: 1.5cm 1cm 1.5cm 1cm;
                    }
                }
            `}</style>
        </div>
    );
}
