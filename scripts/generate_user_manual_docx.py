import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

def create_manual():
    doc = Document()

    # 1. Page Margins Setup (1 inch all sides)
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        section.page_width = Inches(8.27)  # A4 Width
        section.page_height = Inches(11.69) # A4 Height

    # Helper styles
    primary_color = RGBColor(128, 0, 32) # Burgundy/Maroon #800020
    dark_color = RGBColor(15, 23, 42) # Slate-900
    gray_color = RGBColor(100, 116, 139) # Slate-500

    images_dir = os.path.abspath("docs/manual/images")

    # ==========================================
    # HALAMAN 1: COVER PAGE
    # ==========================================
    cover_p_spacer = doc.add_paragraph()
    cover_p_spacer.paragraph_format.space_before = Pt(40)

    # Logo
    logo_path = os.path.join(images_dir, "school_logo.png")
    if os.path.exists(logo_path):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_after = Pt(24)
        run_logo = p_logo.add_run()
        run_logo.add_picture(logo_path, width=Inches(1.8))

    # Instansi
    p_instansi = doc.add_paragraph()
    p_instansi.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_instansi.paragraph_format.line_spacing = 1.2
    p_instansi.paragraph_format.space_after = Pt(120)
    
    r_inst1 = p_instansi.add_run("PEMERINTAH KABUPATEN TANA TORAJA\n")
    r_inst1.bold = True
    r_inst1.font.size = Pt(13)
    r_inst1.font.name = "Arial"

    r_inst2 = p_instansi.add_run("DINAS PENDIDIKAN DAN KEBUDAYAAN\n")
    r_inst2.bold = True
    r_inst2.font.size = Pt(13)
    r_inst2.font.name = "Arial"

    r_inst3 = p_instansi.add_run("UPT SDN 9 GANDANGBATU SILLANAN")
    r_inst3.bold = True
    r_inst3.font.size = Pt(14)
    r_inst3.font.name = "Arial"
    r_inst3.font.color.rgb = primary_color

    # Judul Buku
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_after = Pt(16)
    r_t1 = p_title.add_run("USER MANUAL BOOK\n")
    r_t1.bold = True
    r_t1.font.size = Pt(22)
    r_t1.font.name = "Arial"
    r_t1.font.color.rgb = dark_color

    r_t2 = p_title.add_run("APLIKASI LEARNING MANAGEMENT SYSTEM (LMS)\nSMART SCHOOL DIGITAL")
    r_t2.bold = True
    r_t2.font.size = Pt(15)
    r_t2.font.name = "Arial"
    r_t2.font.color.rgb = primary_color

    # Copyright Notice
    p_copy = doc.add_paragraph()
    p_copy.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_copy.paragraph_format.space_before = Pt(80)
    p_copy.paragraph_format.space_after = Pt(16)
    r_copy = p_copy.add_run("Copyright © (2026) by UPT SDN 9 Gandangbatu Sillanan")
    r_copy.font.size = Pt(10)
    r_copy.font.name = "Arial"
    r_copy.font.color.rgb = dark_color

    # Confidentiality
    p_discl = doc.add_paragraph()
    p_discl.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_discl.paragraph_format.line_spacing = 1.15
    r_discl = p_discl.add_run(
        "All rights reserved. This material is confidential and proprietary to UPT SDN 9 Gandangbatu Sillanan "
        "and no part of this material should be reproduced, published in any form by any means, electronic or "
        "mechanical including photocopy or any information storage or retrieval system nor should the material "
        "be disclosed to third parties without the express written authorization of UPT SDN 9 Gandangbatu Sillanan."
    )
    r_discl.font.size = Pt(8.5)
    r_discl.font.name = "Arial"
    r_discl.font.color.rgb = gray_color

    doc.add_page_break()

    # ==========================================
    # HALAMAN 2: DAFTAR ISI
    # ==========================================
    p_toc_title = doc.add_paragraph()
    p_toc_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_toc_title.paragraph_format.space_after = Pt(24)
    r_toc = p_toc_title.add_run("DAFTAR ISI")
    r_toc.bold = True
    r_toc.font.size = Pt(16)
    r_toc.font.name = "Arial"

    toc_items = [
        ("DAFTAR ISI", "1", True),
        ("DAFTAR GAMBAR", "2", True),
        ("1. Halaman Awal & Autentikasi Pengguna", "4", True),
        ("   1.1. Halaman Utama (Landing Page LMS)", "4", False),
        ("   1.2. Halaman Masuk (Login)", "5", False),
        ("   1.3. Layanan Lupa Kata Sandi (Password Reset)", "6", False),
        ("   1.4. Registrasi Pengguna Baru", "7", False),
        ("2. Modul Administrator & Kepala Sekolah", "8", True),
        ("   2.1. Dashboard Utama Administrator", "8", False),
        ("   2.2. Panel Notifikasi Sistem", "9", False),
        ("   2.3. Halaman Riwayat Notifikasi Lengkap", "10", False),
        ("   2.4. Profil Pengguna & Keamanan Akun", "11", False),
        ("   2.5. Modul Kelembagaan & Kalender Akademik", "12", False),
        ("   2.6. Modul Master Data Rombongan Belajar (Kelas)", "13", False),
        ("   2.7. Modul Master Data Peserta Didik (Siswa)", "14", False),
        ("   2.8. Modul Master Data Pendidik & Tenaga Kependidikan", "15", False),
        ("   2.9. Modul Master Data Mata Pelajaran", "16", False),
        ("   2.10. Modul Presensi Terpadu & Rekapitulasi", "17", False),
        ("   2.11. Modul E-Rapor Leger Nilai & Penilaian", "18", False),
        ("   2.12. Modul Bimbingan & Konseling (BK)", "19", False),
        ("3. Modul Pendidik & Tenaga Kependidikan (Guru)", "20", True),
        ("   3.1. Dashboard Pendidik", "20", False),
        ("   3.2. E-Learning: Kelola Bahan Ajar & Materi", "21", False),
        ("   3.3. E-Learning: Penugasan & Asesmen Terstruktur", "22", False),
        ("   3.4. CBT Ujian: Daftar Ujian & Pelaksanaan", "23", False),
        ("   3.5. CBT Ujian: Pembuatan Paket Ujian Baru", "24", False),
        ("   3.6. CBT Ujian: Bank Soal Pilihan Ganda & Essay", "25", False),
        ("   3.7. CBT Ujian: Hasil Nilai & Koreksi Jawaban Siswa", "26", False),
        ("   3.8. Presensi Siswa Kelas Binaan", "27", False),
        ("   3.9. E-Rapor: Input Nilai & Deskripsi Capaian", "28", False),
        ("4. Modul Peserta Didik (Siswa)", "29", True),
        ("   4.1. Dashboard Siswa", "29", False),
        ("   4.2. E-Learning: Akses Materi & Unggah Tugas", "30", False),
        ("   4.3. CBT Ujian: Jadwal Ujian Aktif", "31", False),
        ("   4.4. CBT Ujian: Konfirmasi & Pengerjaan Ujian", "32", False),
        ("   4.5. Presensi Mandiri & Permohonan Izin Siswa", "33", False),
        ("   4.6. E-Rapor: Lembar Hasil Belajar Digital", "34", False),
        ("5. Modul Guru BK & Pimpinan Sekolah", "35", True),
        ("   5.1. Dashboard Guru Bimbingan Konseling (BK)", "35", False),
        ("   5.2. Dashboard Eksekutif Kepala Sekolah", "36", False),
    ]

    for title, page, is_bold in toc_items:
        p_row = doc.add_paragraph()
        p_row.paragraph_format.line_spacing = 1.15
        p_row.paragraph_format.space_after = Pt(3)
        r_t = p_row.add_run(title)
        r_t.bold = is_bold
        r_t.font.size = Pt(10)
        r_t.font.name = "Arial"
        if is_bold:
            r_t.font.color.rgb = dark_color

        dots_count = max(5, 75 - len(title))
        r_dots = p_row.add_run(" " + ("." * dots_count) + " ")
        r_dots.font.size = Pt(9)
        r_dots.font.color.rgb = RGBColor(180, 180, 180)

        r_pg = p_row.add_run(page)
        r_pg.bold = is_bold
        r_pg.font.size = Pt(10)
        r_pg.font.name = "Arial"

    doc.add_page_break()

    # ==========================================
    # HALAMAN 3: DAFTAR GAMBAR
    # ==========================================
    p_fig_title = doc.add_paragraph()
    p_fig_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_fig_title.paragraph_format.space_after = Pt(20)
    r_fig = p_fig_title.add_run("DAFTAR GAMBAR")
    r_fig.bold = True
    r_fig.font.size = Pt(16)
    r_fig.font.name = "Arial"

    figures_list = [
        ("Gambar 1 Halaman Utama (Landing Page LMS)", "4"),
        ("Gambar 2 Halaman Masuk Sistem (Login)", "5"),
        ("Gambar 3 Halaman Lupa Kata Sandi", "6"),
        ("Gambar 4 Halaman Registrasi Akun Pengguna", "7"),
        ("Gambar 5 Halaman Dashboard Administrator", "8"),
        ("Gambar 6 Panel Dropdown Notifikasi Sistem Header", "9"),
        ("Gambar 7 Halaman Manajemen Notifikasi", "10"),
        ("Gambar 8 Halaman Pengaturan Profil Pengguna", "11"),
        ("Gambar 9 Halaman Kelembagaan & Profil Sekolah", "12"),
        ("Gambar 10 Halaman Master Data Rombongan Belajar", "13"),
        ("Gambar 11 Halaman Master Data Peserta Didik", "14"),
        ("Gambar 12 Halaman Master Data Pendidik", "15"),
        ("Gambar 13 Halaman Master Data Mata Pelajaran", "16"),
        ("Gambar 14 Halaman Monitoring Presensi Harian", "17"),
        ("Gambar 15 Halaman Leger Nilai E-Rapor", "18"),
        ("Gambar 16 Halaman Bimbingan Konseling & Kedisiplinan", "19"),
        ("Gambar 17 Halaman Dashboard Pendidik", "20"),
        ("Gambar 18 Halaman E-Learning Materi & Bahan Ajar Guru", "21"),
        ("Gambar 19 Halaman E-Learning Tugas Terstruktur Guru", "22"),
        ("Gambar 20 Halaman Daftar CBT Ujian Guru", "23"),
        ("Gambar 21 Halaman Form Pembuatan Ujian CBT Baru", "24"),
        ("Gambar 22 Halaman Pengelolaan Soal CBT Ujian", "25"),
        ("Gambar 23 Halaman Hasil Nilai & Koreksi Essay Ujian", "26"),
        ("Gambar 24 Halaman Presensi Kelas Guru", "27"),
        ("Gambar 25 Halaman Input Nilai E-Rapor Kelas Guru", "28"),
        ("Gambar 26 Halaman Dashboard Peserta Didik", "29"),
        ("Gambar 27 Halaman E-Learning Materi & Tugas Siswa", "30"),
        ("Gambar 28 Halaman Jadwal Ujian CBT Siswa", "31"),
        ("Gambar 29 Halaman Petunjuk & Konfirmasi Ujian CBT Siswa", "32"),
        ("Gambar 30 Halaman Presensi & Pengajuan Izin Siswa", "33"),
        ("Gambar 31 Halaman Lembar Rapor Digital Siswa", "34"),
        ("Gambar 32 Halaman Dashboard Guru Bimbingan Konseling", "35"),
        ("Gambar 33 Halaman Dashboard Eksekutif Kepala Sekolah", "36"),
    ]

    for title, page in figures_list:
        p_row = doc.add_paragraph()
        p_row.paragraph_format.line_spacing = 1.15
        p_row.paragraph_format.space_after = Pt(2.5)
        r_t = p_row.add_run(title)
        r_t.font.size = Pt(9.5)
        r_t.font.name = "Arial"

        dots_count = max(5, 76 - len(title))
        r_dots = p_row.add_run(" " + ("." * dots_count) + " ")
        r_dots.font.size = Pt(9)
        r_dots.font.color.rgb = RGBColor(180, 180, 180)

        r_pg = p_row.add_run(page)
        r_pg.font.size = Pt(9.5)
        r_pg.font.name = "Arial"

    doc.add_page_break()

    # ==========================================
    # HELPER FUNCTION UNTUK MENAMBAH GAMBAR & STEP
    # ==========================================
    def add_feature_section(title, desc_text, img_filename, fig_caption, steps_list, is_main_header=False):
        # Header
        p_h = doc.add_paragraph()
        p_h.paragraph_format.space_before = Pt(14)
        p_h.paragraph_format.space_after = Pt(6)
        r_h = p_h.add_run(title)
        r_h.bold = True
        r_h.font.name = "Arial"
        if is_main_header:
            r_h.font.size = Pt(14)
            r_h.font.color.rgb = primary_color
        else:
            r_h.font.size = Pt(11.5)
            r_h.font.color.rgb = dark_color

        # Description
        p_d = doc.add_paragraph()
        p_d.paragraph_format.space_after = Pt(8)
        p_d.paragraph_format.line_spacing = 1.15
        r_d = p_d.add_run(desc_text)
        r_d.font.size = Pt(9.5)
        r_d.font.name = "Arial"

        # Image
        img_full_path = os.path.join(images_dir, img_filename)
        if os.path.exists(img_full_path):
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_before = Pt(4)
            p_img.paragraph_format.space_after = Pt(4)
            run_img = p_img.add_run()
            run_img.add_picture(img_full_path, width=Inches(5.9))

            # Caption
            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_after = Pt(8)
            r_cap = p_cap.add_run(fig_caption)
            r_cap.italic = True
            r_cap.font.size = Pt(8.5)
            r_cap.font.name = "Arial"
            r_cap.font.color.rgb = gray_color

        # Steps
        if steps_list:
            p_guide = doc.add_paragraph()
            p_guide.paragraph_format.space_after = Pt(4)
            r_g = p_guide.add_run("Panduan penggunaan fitur:")
            r_g.bold = True
            r_g.font.size = Pt(9.5)
            r_g.font.name = "Arial"

            for idx, step in enumerate(steps_list, start=1):
                p_step = doc.add_paragraph()
                p_step.paragraph_format.left_indent = Inches(0.25)
                p_step.paragraph_format.space_after = Pt(3)
                p_step.paragraph_format.line_spacing = 1.15
                r_num = p_step.add_run(f"{idx}. ")
                r_num.bold = True
                r_num.font.size = Pt(9.5)
                r_num.font.name = "Arial"

                r_st = p_step.add_run(step)
                r_st.font.size = Pt(9.5)
                r_st.font.name = "Arial"

        p_spacer = doc.add_paragraph()
        p_spacer.paragraph_format.space_after = Pt(10)

    # ==========================================
    # MODUL 1: HALAMAN AWAL & AUTENTIKASI
    # ==========================================
    add_feature_section(
        title="1. Halaman Awal & Autentikasi Pengguna",
        desc_text="Aplikasi Learning Management System (LMS) Smart School UPT SDN 9 Gandangbatu Sillanan dapat diakses secara daring melalui peramban web (browser). Halaman utama menyajikan portal informasi sekolah, sambutan kepala sekolah, statistik kelembagaan, dan gerbang masuk ke ruang digital pembelajaran.",
        img_filename="01_landing_page.png",
        fig_caption="Gambar 1 Halaman Utama (Landing Page LMS)",
        steps_list=[
            "Buka peramban web (Google Chrome / Mozilla Firefox / Microsoft Edge) pada perangkat komputer atau ponsel pintar.",
            "Ketik alamat URL portal resmi LMS pada bilah alamat peramban.",
            "Halaman utama akan menampilkan profil sekolah, kalender pendidikan, dan pengumuman terkini.",
            "Untuk masuk ke akun Anda, klik tombol 'Masuk ke Sistem' yang terletak pada pojok kanan atas layar.",
        ],
        is_main_header=True
    )

    add_feature_section(
        title="1.1. Halaman Masuk (Login)",
        desc_text="Halaman ini digunakan oleh seluruh pengguna sistem (Administrator, Pimpinan Sekolah, Pendidik, Guru BK, Peserta Didik, dan Orang Tua) untuk melakukan autentikasi dan masuk ke akun masing-masing dengan perlindungan enkripsi.",
        img_filename="02_login_page.png",
        fig_caption="Gambar 2 Halaman Masuk Sistem (Login)",
        steps_list=[
            "Masukkan Identitas Pengguna (Login) pada kolom yang disediakan. Anda dapat menggunakan Username, NIP (untuk Guru), NISN (untuk Siswa), atau Alamat Email terdaftar.",
            "Masukkan Kata Sandi (Password) akun Anda dengan benar.",
            "Klik ikon mata pada sisi kanan kolom kata sandi untuk menampilkan atau menyembunyikan teks kata sandi.",
            "Beri tanda centang pada opsi 'Ingat sesi masuk di perangkat ini' apabila Anda menggunakan perangkat pribadi terpercaya.",
            "Klik tombol 'Masuk ke Sistem' untuk melanjutkan ke dashboard sesuai peran pengguna.",
        ]
    )

    add_feature_section(
        title="1.2. Layanan Lupa Kata Sandi (Password Reset)",
        desc_text="Fitur pemulihan kata sandi memungkinkan pengguna yang kehilangan atau lupa kata sandi untuk mereset akun secara mandiri melalui tautan konfirmasi yang dikirimkan ke email terdaftar.",
        img_filename="03_forgot_password.png",
        fig_caption="Gambar 3 Halaman Lupa Kata Sandi",
        steps_list=[
            "Pada halaman login, klik tautan 'Lupa kata sandi?'.",
            "Sistem akan mengarahkan Anda ke formulir pemulihan kata sandi.",
            "Masukkan alamat email aktif yang tertaut pada akun LMS Anda.",
            "Klik tombol 'Kirim Tautan Reset Sandi'.",
            "Buka kotak masuk email Anda dan ikuti tautan verifikasi untuk membuat kata sandi baru.",
        ]
    )

    add_feature_section(
        title="1.3. Registrasi Pengguna Baru",
        desc_text="Halaman pendaftaran pengguna baru diperuntukkan bagi warga sekolah atau calon pengguna yang ingin mendaftarkan akun ke dalam sistem.",
        img_filename="04_register_page.png",
        fig_caption="Gambar 4 Halaman Registrasi Akun Pengguna",
        steps_list=[
            "Klik tombol pendaftaran atau tautan pendaftaran baru pada sistem.",
            "Isi kolom 'Nama Lengkap' sesuai dokumen kependudukan resmi.",
            "Masukkan alamat email aktif dan valid.",
            "Buat kata sandi yang aman dan konfirmasi ulang pada kolom 'Konfirmasi Kata Sandi'.",
            "Klik tombol 'Daftar Akun' untuk memproses permohonan pendaftaran.",
        ]
    )

    doc.add_page_break()

    # ==========================================
    # MODUL 2: ADMINISTRATOR & KEPALA SEKOLAH
    # ==========================================
    add_feature_section(
        title="2. Modul Administrator & Kepala Sekolah",
        desc_text="Modul Administrator memberikan kendali terpusat kepada pengelola sekolah untuk mengelola struktur kelembagaan, master data civitas akademika, pemantauan kegiatan belajar mengajar, serta pengesahan laporan hasil belajar siswa.",
        img_filename="05_admin_dashboard.png",
        fig_caption="Gambar 5 Halaman Dashboard Administrator",
        steps_list=[
            "Setelah berhasil masuk sebagai Administrator, sistem menampilkan ringkasan statistik sekolah: total siswa aktif, jumlah pendidik, rombel terdaftar, dan tingkat kehadiran hari ini.",
            "Gunakan bilah navigasi di sisi kiri (sidebar) untuk berpindah antar modul: Kelembagaan, Master Data, Presensi, E-Rapor, CBT, dan BK.",
            "Gunakan pemilih tahun ajaran dan semester aktif pada bilah atas (header) untuk melihat data historis maupun berjalan.",
        ],
        is_main_header=True
    )

    add_feature_section(
        title="2.1. Panel Notifikasi Sistem",
        desc_text="Fitur notifikasi real-time memudahkan pemantauan aktivitas mendesak, seperti pengajuan izin sakit siswa, ujian baru yang diterbitkan, atau koreksi jawaban essay yang telah dinilai.",
        img_filename="06_admin_notification_dropdown.png",
        fig_caption="Gambar 6 Panel Dropdown Notifikasi Sistem Header",
        steps_list=[
            "Klik ikon Lonceng Notifikasi di bagian kanan atas bilah navigasi.",
            "Panel popover akan menampilkan daftar notifikasi terkini yang dikelompokkan berdasarkan warna dan jenis (Ujian, Nilai, Presensi, Sistem).",
            "Klik salah satu notifikasi untuk membaca rincian dan langsung menuju ke halaman terkait.",
            "Klik tombol 'Dibaca' untuk menandai semua notifikasi telah selesai ditinjau.",
            "Klik tautan 'Lihat Semua Notifikasi' di bagian bawah panel untuk membuka arsip riwayat lengkap.",
        ]
    )

    add_feature_section(
        title="2.2. Halaman Riwayat & Manajemen Notifikasi",
        desc_text="Halaman khusus untuk mengarsipkan, memfilter, dan menghapus seluruh log pemberitahuan yang dikirimkan oleh sistem LMS kepada pengguna.",
        img_filename="07_admin_notifications_page.png",
        fig_caption="Gambar 7 Halaman Manajemen Notifikasi",
        steps_list=[
            "Pilih tab filter: 'Semua', 'Belum Dibaca', atau 'Sudah Dibaca' untuk menyortir data.",
            "Klik tombol ikon ceklis untuk menandai notifikasi terpilih telah dibaca.",
            "Klik tombol ikon tempat sampah untuk menghapus notifikasi yang sudah tidak relevan.",
        ]
    )

    add_feature_section(
        title="2.3. Pengaturan Profil Pengguna & Keamanan",
        desc_text="Pengguna dapat memperbarui identitas pribadi, kontak, alamat rumah, serta memperbarui kata sandi secara berkala guna menjaga keamanan akun.",
        img_filename="08_admin_profile_page.png",
        fig_caption="Gambar 8 Halaman Pengaturan Profil Pengguna",
        steps_list=[
            "Pada formulir Informasi Profil, perbarui Nama Lengkap, Alamat Email, Nomor WhatsApp, dan Alamat Rumah.",
            "Klik tombol 'Simpan Profil' untuk menyimpan pembaruan identitas.",
            "Pada bagian Perbarui Kata Sandi, masukkan kata sandi lama Anda.",
            "Ketikkan kata sandi baru dan ulangi pada kolom konfirmasi, kemudian klik tombol 'Perbarui Sandi'.",
        ]
    )

    add_feature_section(
        title="2.4. Modul Kelembagaan & Kalender Akademik",
        desc_text="Modul Kelembagaan memuat Profil Pokok Pendidikan UPT SDN 9 Gandangbatu Sillanan (NPSN, Alamat, Akreditasi, Nama Kepala Sekolah) serta konfigurasi Tahun Pelajaran dan Semester aktif.",
        img_filename="09_kelembagaan_profil.png",
        fig_caption="Gambar 9 Halaman Kelembagaan & Profil Sekolah",
        steps_list=[
            "Periksa dan perbarui data pokok identitas sekolah melalui tab 'Identitas Sekolah'.",
            "Beralih ke tab 'Tahun Ajaran & Semester' untuk menambah periode akademik baru (contoh: 2026/2027 Ganjil).",
            "Tentukan tanggal mulai dan selesai semester kalender pendidikan.",
            "Klik tombol 'Aktifkan' pada tahun ajaran yang berlaku saat ini agar seluruh rombel dan kurikulum tersinkronisasi.",
        ]
    )

    add_feature_section(
        title="2.5. Modul Master Data: Rombongan Belajar (Kelas)",
        desc_text="Pengelolaan ruang kelas belajar siswa dari jenjang Kelas 1 hingga Kelas 6 beserta penugasan Wali Kelas penanggung jawab administrasi rapor.",
        img_filename="10_master_rombel.png",
        fig_caption="Gambar 10 Halaman Master Data Rombongan Belajar",
        steps_list=[
            "Pilih tab 'Rombongan Belajar' pada Modul Master Data.",
            "Daftar kelas terdaftar akan ditampilkan beserta nama Wali Kelas dan kapasitas siswa.",
            "Klik tombol '+ Tambah Rombel' untuk mendaftarkan kelas baru.",
            "Isi Nama Rombel (misal: 'Kelas 6A'), pilih Tingkat Pendidikan, dan tetapkan Pendidik Wali Kelas.",
            "Gunakan tombol aksi edit (ikon pensil) atau hapus (ikon tempat sampah) untuk memelihara data.",
        ]
    )

    add_feature_section(
        title="2.6. Modul Master Data: Peserta Didik (Siswa)",
        desc_text="Data Induk Peserta Didik menyimpan seluruh informasi identitas siswa, NIS, NISN, NIK, penempatan rombel, tanggal lahir, dan kontak wali murid.",
        img_filename="11_master_siswa.png",
        fig_caption="Gambar 11 Halaman Master Data Peserta Didik",
        steps_list=[
            "Pilih tab 'Data Siswa' pada Modul Master Data.",
            "Gunakan bilah pencarian untuk menemukan siswa berdasarkan Nama, NIS, atau NISN.",
            "Klik tombol '+ Tambah Siswa' untuk mendaftarkan siswa baru.",
            "Lengkapi kolom: Nama Lengkap, NISN, NIS, NIK, Jenis Kelamin, Tempat/Tanggal Lahir, Alamat, serta Nama dan Nomor Telepon Orang Tua/Wali.",
            "Pilih penempatan kelas siswa, lalu klik 'Simpan Data Siswa'.",
        ]
    )

    add_feature_section(
        title="2.7. Modul Master Data: Pendidik & Tenaga Kependidikan",
        desc_text="Direktori kepegawaian tenaga pendidik (guru kelas, guru mata pelajaran, dan guru BK) beserta NIP, status kepegawaian, dan jenjang pendidikan.",
        img_filename="12_master_pendidik.png",
        fig_caption="Gambar 12 Halaman Master Data Pendidik",
        steps_list=[
            "Pilih tab 'Data Guru' untuk melihat daftar pendidik sekolah.",
            "Klik '+ Tambah Guru' untuk memasukkan data guru baru ke sistem.",
            "Isi NIP/NUPTK, Nama Lengkap disertai gelar, Jenis Kelamin, Status Kepegawaian (PNS/PPPK/Honorer), dan kualifikasi pendidikan.",
            "Tautkan akun login sistem untuk guru yang bersangkutan, kemudian klik 'Simpan Pendidik'.",
        ]
    )

    add_feature_section(
        title="2.8. Modul Master Data: Mata Pelajaran & Plotting Guru",
        desc_text="Pengaturan daftar kurikulum mata pelajaran (Pendidikan Agama, PPKn, Bahasa Indonesia, Matematika, IPA, IPS, SBdP, PJOK, Muatan Lokal) dan pemetaan guru pengampu di setiap rombel.",
        img_filename="13_master_mapel.png",
        fig_caption="Gambar 13 Halaman Master Data Mata Pelajaran",
        steps_list=[
            "Pilih tab 'Mata Pelajaran' untuk meninjau struktur kurikulum.",
            "Klik tombol '+ Tambah Mapel' untuk membuat mata pelajaran baru.",
            "Tentukan Kode Mapel, Nama Pelajaran, Kategori Kurikulum, dan Kelompok Pelajaran.",
            "Atur Guru Pengampu untuk setiap kelas agar materi dan nilai rapor dapat diinput secara otomatis oleh guru bersangkutan.",
        ]
    )

    add_feature_section(
        title="2.9. Modul Presensi Terpadu & Rekapitulasi",
        desc_text="Pusat pemantauan presensi harian seluruh warga sekolah, rekapitulasi kehadiran bulanan, serta verifikasi surat keterangan izin atau sakit dari siswa.",
        img_filename="14_presensi_harian.png",
        fig_caption="Gambar 14 Halaman Monitoring Presensi Harian",
        steps_list=[
            "Pilih tanggal presensi yang ingin ditinjau melalui kalender.",
            "Tinjau persentase kehadiran: Hadir (H), Sakit (S), Izin (I), dan Tanpa Keterangan (A).",
            "Pada bagian 'Surat Permohonan Izin Siswa', klik tinjau untuk memeriksa surat keterangan dokter atau izin orang tua.",
            "Ubah status permohonan menjadi 'Disetujui' atau 'Ditolak' dengan sekali klik.",
        ]
    )

    add_feature_section(
        title="2.10. Modul E-Rapor Leger Nilai & Penilaian",
        desc_text="Pusat pengelolaan Leger Nilai Mata Pelajaran per kelas, kalkulasi bobot nilai akhir (30% Tugas + 30% UTS + 40% UAS), penilaian sikap spiritual/sosial, catatan wali kelas, dan pencetakan buku rapor digital.",
        img_filename="15_erapor_leger.png",
        fig_caption="Gambar 15 Halaman Leger Nilai E-Rapor",
        steps_list=[
            "Pilih rombongan belajar (misal: Kelas 6) untuk memuat daftar seluruh siswa dan nilai mata pelajaran.",
            "Sistem secara otomatis menampilkan Leger Nilai komprehensif lengkap dengan nilai Tugas, UTS, UAS, Nilai Akhir, dan Predikat Huruf (A/B/C/D).",
            "Klik tombol 'Cetak Buku Rapor' untuk mengunduh atau mencetak lembar rapor siswa format resmi sekolah.",
        ]
    )

    add_feature_section(
        title="2.11. Modul Bimbingan & Konseling (BK)",
        desc_text="Pencatatan sesi konseling peserta didik, pemantauan riwayat pelanggaran tata tertib, serta apresiasi prestasi akademik dan non-akademik siswa.",
        img_filename="16_bk_konseling.png",
        fig_caption="Gambar 16 Halaman Bimbingan Konseling & Kedisiplinan",
        steps_list=[
            "Tinjau ringkasan statistik: total sesi konseling aktif, total rekor prestasi, dan poin pelanggaran siswa.",
            "Klik tombol '+ Sesi Konseling' untuk mencatat jadwal dan topik konseling bimbingan siswa.",
            "Klik '+ Catat Prestasi' untuk mengabadikan piagam atau juara yang diraih siswa.",
            "Catat pelanggaran tata tertib disertai pembinaan dan tindak lanjut edukatif yang diberikan.",
        ]
    )

    doc.add_page_break()

    # ==========================================
    # MODUL 3: PENDIDIK & GURU
    # ==========================================
    add_feature_section(
        title="3. Modul Pendidik & Tenaga Kependidikan (Guru)",
        desc_text="Modul khusus guru menyediakan fasilitas lengkap untuk mengelola proses belajar mengajar harian, pembagian materi digital, penugasan pekerjaan rumah, penyelenggaraan ujian daring CBT, input presensi harian kelas, serta penyusunan nilai rapor siswa.",
        img_filename="17_guru_dashboard.png",
        fig_caption="Gambar 17 Halaman Dashboard Pendidik",
        steps_list=[
            "Masuk ke sistem menggunakan NIP atau Username akun Guru.",
            "Dashboard Guru menampilkan kartu statistik: rombel binaan wali kelas, mata pelajaran yang diampu, serta daftar jadwal mengajar dan tugas aktif.",
            "Periksa bilah notifikasi atas untuk memeriksa tugas atau ujian siswa yang memerlukan pengoreksian.",
        ],
        is_main_header=True
    )

    add_feature_section(
        title="3.1. E-Learning: Kelola Bahan Ajar & Materi Digital",
        desc_text="Guru dapat membagikan materi pembelajaran interaktif berupa dokumen PDF, presentasi, tautan video edukasi YouTube, maupun artikel teks pembelajaran.",
        img_filename="18_guru_elearning_materi.png",
        fig_caption="Gambar 18 Halaman E-Learning Materi & Bahan Ajar Guru",
        steps_list=[
            "Buka menu 'E-Learning' dan pilih tab 'Materi Belajar'.",
            "Pilih rombel dan mata pelajaran yang bersangkutan.",
            "Klik tombol '+ Unggah Materi'.",
            "Ketik Judul Materi dan deskripsi petunjuk belajar siswa.",
            "Pilih jenis materi: Unggah Berkas (PDF/PPT/DOCX) atau Tautan Pembelajaran (URL Video/Artikel).",
            "Klik 'Terbitkan Materi' agar dapat langsung dipelajari oleh siswa.",
        ]
    )

    add_feature_section(
        title="3.2. E-Learning: Penugasan & Asesmen Terstruktur",
        desc_text="Fasilitas pembuatan tugas pekerjaan rumah (PR), lembar kerja peserta didik (LKPD), penentuan batas waktu pengumpulan (deadline), dan pengoreksian berkas tugas yang dikumpulkan siswa.",
        img_filename="19_guru_elearning_tugas.png",
        fig_caption="Gambar 19 Halaman E-Learning Tugas Terstruktur Guru",
        steps_list=[
            "Pada menu 'E-Learning', klik tab 'Tugas Terstruktur'.",
            "Klik tombol '+ Buat Tugas Baru'.",
            "Tentukan Judul Tugas, Instruksi Pengerjaan, serta Batas Akhir Pengumpulan (Tenggat Waktu).",
            "Tentukan bobot poin maksimal penilaian tugas.",
            "Setelah siswa mengumpulkan tugas, klik tombol 'Tinjau Pengumpulan' pada daftar tugas untuk memberikan nilai dan umpan balik (feedback).",
        ]
    )

    add_feature_section(
        title="3.3. CBT Ujian: Daftar Ujian & Pelaksanaan",
        desc_text="Menu Computer-Based Test (CBT) digunakan oleh guru untuk mengelola ulangan harian, Penilaian Tengah Semester (PTS/UTS), dan Penilaian Akhir Semester (PAS/UAS) secara digital.",
        img_filename="20_guru_cbt_daftar_ujian.png",
        fig_caption="Gambar 20 Halaman Daftar CBT Ujian Guru",
        steps_list=[
            "Buka menu 'Ujian CBT' pada sidebar navigasi.",
            "Halaman menampilkan status ujian: Terjadwal, Sedang Berlangsung, atau Selesai.",
            "Setiap kartu ujian menampilkan kategori ujian, mata pelajaran, durasi waktu, serta jumlah peserta yang telah menyelesaikan ujian.",
            "Klik tombol '+ Buat Ujian Baru' untuk menyusun paket tes baru.",
        ]
    )

    add_feature_section(
        title="3.4. CBT Ujian: Pembuatan Paket Ujian Baru",
        desc_text="Formulir konfigurasi parameter ujian: mata pelajaran sasaran, durasi pengerjaan, waktu mulai/selesai, acak urutan soal, opsi tinjau jawaban, dan batas nilai kelulusan (KKM).",
        img_filename="21_guru_cbt_buat_ujian.png",
        fig_caption="Gambar 21 Halaman Form Pembuatan Ujian CBT Baru",
        steps_list=[
            "Pilih Mata Pelajaran dan Rombel sasaran ujian.",
            "Ketik Judul Ujian (misal: 'Ulangan Harian Bab 1 IPA').",
            "Pilih Kategori Ujian: Ulangan Harian, UTS, UAS, Ujian Sekolah, atau Kuis.",
            "Tentukan Durasi Pengerjaan dalam satuan menit (contoh: 60 menit).",
            "Atur Waktu Mulai dan Waktu Selesai pelaksanaan ujian pada kalender.",
            "Aktifkan opsi 'Acak Butir Soal' dan 'Tampilkan Hasil Otomatis' sesuai kebijakan.",
            "Klik 'Simpan & Lanjutkan Tambah Soal'.",
        ]
    )

    add_feature_section(
        title="3.5. CBT Ujian: Bank Soal Pilihan Ganda & Essay",
        desc_text="Penyusunan butir-butir instrumen soal ujian yang mendukung tipe Pilihan Ganda (dengan kunci jawaban otomatis) dan Soal Essay/Uraian analitis.",
        img_filename="22_guru_cbt_kelola_soal.png",
        fig_caption="Gambar 22 Halaman Pengelolaan Soal CBT Ujian",
        steps_list=[
            "Pada halaman detail ujian, klik tombol '+ Tambah Butir Soal'.",
            "Pilih Tipe Soal: 'Pilihan Ganda' atau 'Essay / Uraian'.",
            "Tuliskan teks pertanyaan pada editor soal (dapat disertai gambar pendukung).",
            "Untuk Pilihan Ganda: masukkan opsi A, B, C, D dan tandai radio button kunci jawaban yang benar.",
            "Untuk Soal Essay: masukkan petunjuk penilaian dan bobot poin maksimal soal.",
            "Klik 'Simpan Soal'. Soal akan langsung masuk ke daftar urutan tes.",
        ]
    )

    add_feature_section(
        title="3.6. CBT Ujian: Hasil Nilai & Koreksi Jawaban Essay",
        desc_text="Guru dapat memonitor hasil nilai pengerjaan siswa secara real-time, mengoreksi jawaban essay siswa secara digital, dan nilai akan langsung disinkronkan otomatis ke E-Rapor.",
        img_filename="23_guru_cbt_hasil_ujian.png",
        fig_caption="Gambar 23 Halaman Hasil Nilai & Koreksi Essay Ujian",
        steps_list=[
            "Pada kartu ujian, klik tombol 'Hasil & Koreksi'.",
            "Daftar nama siswa, waktu mulai, waktu selesai, dan status pengerjaan akan disajikan.",
            "Untuk siswa dengan jawaban essay, klik tombol 'Koreksi Jawaban'.",
            "Baca teks jawaban siswa dan berikan skor nilai (0 sampai poin maksimal soal).",
            "Klik tombol 'Simpan Nilai Essay'. Sistem akan otomatis mengalkulasi nilai akhir siswa, memperbarui leger nilai rapor, dan mengirimkan notifikasi ke akun siswa.",
        ]
    )

    add_feature_section(
        title="3.7. Presensi Siswa Kelas Guru",
        desc_text="Pencatatan daftar hadir siswa pada kelas yang diampu pada jam pelajaran berlangsung.",
        img_filename="24_guru_presensi.png",
        fig_caption="Gambar 24 Halaman Presensi Kelas Guru",
        steps_list=[
            "Buka menu 'Presensi' pada akun guru.",
            "Pilih rombel kelas yang sedang diajar hari ini.",
            "Klik tombol opsi status pada masing-masing nama siswa: Hadir (H), Izin (I), Sakit (S), atau Alpa (A).",
            "Klik tombol 'Simpan Presensi Kelas' untuk mengunci data kehadiran.",
        ]
    )

    add_feature_section(
        title="3.8. E-Rapor: Input Nilai & Deskripsi Capaian Guru",
        desc_text="Guru pengampu mata pelajaran dapat menginput dan memvalidasi nilai rata-rata tugas, nilai UTS, nilai UAS, serta merumuskan deskripsi capaian kompetensi siswa untuk rapor semester.",
        img_filename="25_guru_erapor.png",
        fig_caption="Gambar 25 Halaman Input Nilai E-Rapor Kelas Guru",
        steps_list=[
            "Buka menu 'E-Rapor' dan pilih rombel yang diajar.",
            "Tabel penilaian menampilkan nilai tugas, UTS, UAS, dan Nilai Akhir hasil perhitungan bobot.",
            "Klik tombol edit nilai pada baris siswa untuk memperbarui nilai atau menginput catatan deskripsi capaian kompetensi.",
            "Klik tombol 'Simpan Nilai Mapel'.",
        ]
    )

    doc.add_page_break()

    # ==========================================
    # MODUL 4: PESERTA DIDIK (SISWA)
    # ==========================================
    add_feature_section(
        title="4. Modul Peserta Didik (Siswa)",
        desc_text="Antarmuka belajar digital ramah anak bagi siswa UPT SDN 9 Gandangbatu Sillanan untuk menyimak materi, mengumpulkan tugas secara praktis, mengerjakan ujian CBT mandiri, mengajukan surat izin, dan melihat lembar rapor digital.",
        img_filename="26_siswa_dashboard.png",
        fig_caption="Gambar 26 Halaman Dashboard Peserta Didik",
        steps_list=[
            "Masuk ke aplikasi menggunakan NISN atau Akun Siswa yang telah dibagikan pihak sekolah.",
            "Dashboard menyambut siswa dengan salam interaktif, informasi rombel kelas, ringkasan nilai akademik, serta agenda tugas dan ujian mendatang.",
            "Tinjau lonceng notifikasi untuk melihat pengumuman guru atau nilai ujian yang baru diumumkan.",
        ],
        is_main_header=True
    )

    add_feature_section(
        title="4.1. E-Learning Siswa: Akses Materi & Kumpul Tugas",
        desc_text="Ruang belajar digital siswa untuk membaca materi pelajaran yang diunggah guru serta mengunggah lembar jawaban tugas sekolah.",
        img_filename="27_siswa_elearning.png",
        fig_caption="Gambar 27 Halaman E-Learning Materi & Tugas Siswa",
        steps_list=[
            "Buka menu 'E-Learning' siswa.",
            "Pilih tab 'Materi Belajar' untuk membaca ringkasan atau mengunduh berkas modul pembelajaran.",
            "Pilih tab 'Tugas Terstruktur' untuk melihat daftar tugas yang harus diselesaikan.",
            "Klik 'Kumpulkan Tugas' pada tugas yang aktif, unggah berkas jawaban (foto / dokumen), dan klik tombol 'Kirim Tugas'.",
        ]
    )

    add_feature_section(
        title="4.2. CBT Ujian: Jadwal Ujian Aktif Siswa",
        desc_text="Daftar jadwal ujian ulangan harian, PTS, dan PAS yang dapat diikuti oleh siswa sesuai tanggal dan jam pengerjaan.",
        img_filename="28_siswa_cbt_jadwal.png",
        fig_caption="Gambar 28 Halaman Jadwal Ujian CBT Siswa",
        steps_list=[
            "Pilih menu 'Ujian CBT' pada navigasi akun siswa.",
            "Periksa jadwal ujian: Nama Mapel, Durasi Waktu, Batas Pengerjaan, dan Status.",
            "Klik tombol 'Mulai Ujian' pada jadwal ujian yang berstatus aktif.",
        ]
    )

    add_feature_section(
        title="4.3. CBT Ujian: Konfirmasi & Pengerjaan Ujian",
        desc_text="Halaman petunjuk pengerjaan ujian, konfirmasi kesiapan siswa, dan antarmuka lembar tes real-time.",
        img_filename="29_siswa_cbt_detail.png",
        fig_caption="Gambar 29 Halaman Petunjuk & Konfirmasi Ujian CBT Siswa",
        steps_list=[
            "Baca tata tertib dan petunjuk pelaksanaan ujian dengan teliti.",
            "Periksa durasi menit dan batas kesempatan pengerjaan.",
            "Klik tombol 'Konfirmasi & Mulai Mengerjakan Ujian'.",
            "Jawab setiap butir soal pilihan ganda atau ketikkan jawaban pada kotak essay.",
            "Perhatikan sisa waktu pada timer jam digital yang terus berjalan.",
            "Setelah seluruh soal selesai dijawab, klik tombol 'Kumpulkan Ujian' untuk menyelesaikan tes.",
        ]
    )

    add_feature_section(
        title="4.4. Presensi Mandiri & Permohonan Izin Siswa",
        desc_text="Siswa dan orang tua dapat memantau catatan kehadiran di sekolah serta mengajukan surat keterangan sakit atau izin resmi tanpa harus datang ke sekolah.",
        img_filename="30_siswa_presensi.png",
        fig_caption="Gambar 30 Halaman Presensi & Pengajuan Izin Siswa",
        steps_list=[
            "Buka menu 'Presensi' pada akun siswa.",
            "Halaman menampilkan kalender rekap kehadiran bulan berjalan.",
            "Untuk mengajukan izin, klik tombol '+ Ajukan Permohonan Izin'.",
            "Pilih alasan: Sakit atau Izin Keperluan Keluarga.",
            "Tuliskan surat keterangan izin dan unggah foto surat/surat dokter.",
            "Klik 'Kirim Permohonan'. Pendidik dan Administrator akan meninjau surat tersebut.",
        ]
    )

    add_feature_section(
        title="4.5. E-Rapor: Lembar Hasil Belajar Digital Siswa",
        desc_text="Siswa dan orang tua dapat melihat transparansi nilai rapor per mata pelajaran, nilai sikap spiritual, dan catatan perkembangan dari wali kelas.",
        img_filename="31_siswa_erapor.png",
        fig_caption="Gambar 31 Halaman Lembar Rapor Digital Siswa",
        steps_list=[
            "Buka menu 'E-Rapor' pada akun siswa.",
            "Lembar rapor digital memuat nilai Tugas, UTS, UAS, Nilai Akhir, dan Huruf Mutu untuk seluruh mata pelajaran.",
            "Tinjau predikat sikap dan catatan perkembangan kepribadian dari Wali Kelas.",
        ]
    )

    doc.add_page_break()

    # ==========================================
    # MODUL 5: GURU BK & PIMPINAN SEKOLAH
    # ==========================================
    add_feature_section(
        title="5. Modul Guru Bimbingan Konseling (BK) & Pimpinan",
        desc_text="Peran khusus Guru BK berfokus pada pendampingan karakter, catatan konseling pribadi, serta pembinaan kedisiplinan dan apresiasi bakat minat siswa.",
        img_filename="32_bk_dashboard.png",
        fig_caption="Gambar 32 Halaman Dashboard Guru Bimbingan Konseling",
        steps_list=[
            "Masuk menggunakan akun khusus Guru BK.",
            "Dashboard menyajikan panel statistik pembinaan: jumlah sesi konseling, grafik kedisiplinan siswa, dan daftar siswa berprestasi.",
            "Gunakan menu Bimbingan Konseling untuk mendokumentasikan interaksi bimbingan secara rahasia dan aman.",
        ],
        is_main_header=True
    )

    add_feature_section(
        title="5.1. Dashboard Eksekutif Kepala Sekolah (Pimpinan)",
        desc_text="Dashboard eksekutif untuk Kepala Sekolah yang menyajikan ringkasan makro performa sekolah, transparansi mutu pembelajaran, tingkat kehadiran guru dan siswa, serta pengesahan akhir laporan buku rapor semester.",
        img_filename="33_pimpinan_dashboard.png",
        fig_caption="Gambar 33 Halaman Dashboard Eksekutif Kepala Sekolah",
        steps_list=[
            "Masuk menggunakan akun Pimpinan / Kepala Sekolah.",
            "Dashboard menyajikan indikator kinerja utama (IKU) sekolah secara menyeluruh.",
            "Kepala Sekolah dapat memvalidasi dan menandatangani pengesahan E-Rapor sebelum rapor diterbitkan secara resmi kepada orang tua murid.",
        ]
    )

    # Simpan dokumen
    output_docx = os.path.abspath("docs/USER_MANUAL_LMS_UPT_SDN_9_GANDANGBATU_SILLANAN.docx")
    doc.save(output_docx)
    print(f"\n[BERHASIL] Dokumen Word User Manual berhasil dibuat di:\n{output_docx}")

if __name__ == "__main__":
    create_manual()
