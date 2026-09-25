# PANDUAN SISTEM DESAIN & UI/UX (DESIGN SYSTEM)
## Smart School LMS — UPT SDN 9 Gandangbatu Sillanan
**Penyedia Solusi:** TechSoe (Teknologi Inovasi Soedirman)  
**Frontend Framework:** React.js, Inertia.js, Tailwind CSS  
**Versi Dokumen:** 1.1.0  
**Tanggal:** 25 September 2026  

---

## 1. Filosofi & Visi Desain (Design Philosophy)

Sistem Desain Smart School LMS mengusung tema **Modern Professional Education**. Desain ini dirancang khusus untuk institusi pendidikan dasar dengan standar keunggulan visual:
* **Keterbacaan Tinggi (High Legibility):** Kontras tajam antara teks dan latar belakang untuk memudahkan guru, siswa, dan orang tua.
* **Elegan & Berwibawa (Prestige & Professionalism):** Menggunakan palet utama Deep Burgundy dipadukan dengan Off-White Canvas.
* **Minim Beban Kognitif (Low Cognitive Load):** Navigasi jelas, hierarki visual terstruktur, dan komponen UI konsisten di seluruh 12 modul.
* **Bebas Emoji (Strict No-Emoji Policy):** Seluruh penanda visual, status, dan ikon menggunakan grafis vektor SVG terstandarisasi (`lucide-react`).
* **Responsif Sepenuhnya:** Tampilan adaptif untuk smartphone, tablet, laptop, hingga proyektor kelas.

---

## 2. Palet Warna (Color Palette) & Token Desain

```
+------------------------------------------------------------------------+
|                        COLOR PALETTE PREVIEW                           |
+-------------------+-------------------+-------------------+------------+
|  Primary Burgundy |   Deep Burgundy   | Burgundy Soft Tint| Pure White |
|      #800020      |      #5C0017      |      #FDF2F4      |  #FFFFFF   |
+-------------------+-------------------+-------------------+------------+
| Off-White Canvas  |   Border Stroke   |   Success Green   | Warning /  |
|      #F8F9FA      |      #E2E8F0      |      #10B981      | Danger Red |
+-------------------+-------------------+-------------------+------------+
```

### 2.1 Warna Utama & Merek (Brand Colors)
| Token Tailwind / CSS Variable | Hex Code | Deskripsi & Peruntukan |
| :--- | :--- | :--- |
| `primary` / `--color-primary` | `#800020` | Burgundy Utama: Tombol aksi utama (CTA), menu aktif, garis aksen. |
| `primary-dark` / `--color-primary-dark` | `#5C0017` | Deep Burgundy: Status hover tombol aksi, navbar header prioritas. |
| `primary-light` / `--color-primary-light`| `#A31D36` | Burgundy Light: Efek interaktif sekunder, badge prioritas menengah. |
| `primary-soft` / `--color-primary-soft` | `#FDF2F4` | Burgundy Soft Tint: Latar menu sidebar aktif, highlight baris tabel terpilih. |
| `primary-border` / `--color-primary-border`| `#E8B4B8`| Burgundy Border Focus: Garis tepi form input saat kondisi aktif/fokus. |

### 2.2 Warna Dasar & Permukaan (Surface & Neutral Colors)
| Token Tailwind / CSS Variable | Hex Code | Deskripsi & Peruntukan |
| :--- | :--- | :--- |
| `bg-canvas` / `--color-bg-canvas` | `#F8F9FA` | Off-White Canvas: Latar belakang viewport utama. |
| `bg-card` / `--color-bg-card` | `#FFFFFF` | Pure White: Latar belakang card modul, modal pop-up, form panel. |
| `border-subtle` / `--color-border-subtle`| `#E2E8F0`| Border Stroke: Garis batas kartu, divider, garis tabel default. |
| `border-strong` / `--color-border-strong`| `#CBD5E1`| Border Strong: Garis batas input form default. |
| `text-primary` / `--color-text-primary` | `#0F172A` | Slate 900: Teks heading utama, judul tabel, nama modul. |
| `text-body` / `--color-text-body` | `#334155` | Slate 700: Isi teks umum, deskripsi materi ajar. |
| `text-muted` / `--color-text-muted` | `#64748B` | Slate 500: Subteks, keterangan tanggal, placeholder input. |

### 2.3 Warna Fungsional & Status Presensi (Semantic Colors)
| Status / Fitur | Solid Hex | Soft Background | Peruntukan di Sistem |
| :--- | :--- | :--- | :--- |
| **Success (Hadir / Tuntas)** | `#10B981` | `#ECFDF5` | Presensi Hadir (H), Tugas telah dinilai, Nilai tuntas KKM. |
| **Warning (Izin / Pending)** | `#F59E0B` | `#FFFBEB` | Presensi Izin (I), Menunggu verifikasi nilai, Deadline mendekat. |
| **Info (Sakit / Maklumat)** | `#3B82F6` | `#EFF6FF` | Presensi Sakit (S), Notifikasi baru, Pengumuman umum. |
| **Danger (Alpa / Sanksi)** | `#EF4444` | `#FEF2F2` | Presensi Alpa (A), Pelanggaran disiplin siswa, Tombol hapus. |

---

## 3. Tipografi (Typography System)

* **Font Family Utama:** `'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
* **Google Fonts:** `https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap`

### 3.1 Skala Ukuran Teks (Type Scale Hierarchy)
| Level | Font Weight | Ukuran (Desktop) | Ukuran (Mobile) | Line Height | Contoh Penggunaan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / H1** | Bold (700) | `32px` (2.0rem) | `26px` (1.625rem) | `1.25` | Judul Dashboard Utama, Lembar E-Raport |
| **Heading 2 (H2)** | SemiBold (600) | `24px` (1.5rem) | `20px` (1.25rem) | `1.3` | Judul Halaman Modul (Presensi, Buku Induk) |
| **Heading 3 (H3)** | SemiBold (600) | `18px` (1.125rem) | `16px` (1.0rem) | `1.4` | Judul Card, Nama Bab Pembelajaran |
| **Heading 4 (H4)** | Medium (500) | `16px` (1.0rem) | `15px` (0.9375rem)| `1.4` | Sub-seksi form, widget metrik |
| **Body Large** | Regular (400) | `15px` (0.9375rem)| `14px` (0.875rem) | `1.6` | Pengantar materi, instruksi tugas |
| **Body Base** | Regular (400) | `14px` (0.875rem) | `13px` (0.8125rem)| `1.5` | Tabel data, form input field |
| **Caption / Small**| Medium (500) | `12px` (0.75rem) | `11px` (0.6875rem)| `1.4` | Lencana status (Badges), helper text |
| **Micro / Tag** | SemiBold (600) | `11px` (0.6875rem)| `10px` (0.625rem) | `1.2` | Tag NISN, NIP, counter badge notifikasi |

---

## 4. Spasi, Elevasi & Tata Letak (Layout & Spatial System)

### 4.1 Unit Spasi Tailwind
* `p-1` / `gap-1`: `4px`
* `p-2` / `gap-2`: `8px`
* `p-3` / `gap-3`: `12px`
* `p-4` / `gap-4`: `16px` (Padding standar form & list)
* `p-6` / `gap-6`: `24px` (Padding container card)
* `p-8` / `gap-8`: `32px` (Margin antar seksi halaman)

### 4.2 Sudut Membulat (Border Radius)
* `rounded-md`: `6px` (Badge status, tombol kecil)
* `rounded-lg`: `8px` (Input field, tombol standar, dropdown)
* `rounded-xl`: `12px` (Card modul, modal dialog, panel widget)
* `rounded-2xl`: `16px` (Hero container, drawer navigasi)
* `rounded-full`: `9999px` (Avatar, pill badges)

### 4.3 Elevasi & Bayangan (Box Shadows)
* `shadow-sm`: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
* `shadow-md`: `0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04)`
* `shadow-lg`: `0 10px 15px -3px rgba(128, 0, 32, 0.08)` (Efek hover khas Burgundy)
* `shadow-2xl`: `0 25px 50px -12px rgba(15, 23, 42, 0.25)` (Modal backdrop & dialog)

---

## 5. Implementasi Komponen React & Tailwind CSS

### 5.1 Komponen Tombol (PrimaryButton.jsx)
```jsx
import React from 'react';

export default function PrimaryButton({ children, disabled, className = '', ...props }) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={
                `inline-flex items-center justify-center px-4 py-2.5 bg-[#800020] hover:bg-[#5C0017] active:scale-[0.98] text-white text-sm font-medium rounded-lg transition duration-150 ease-in-out shadow-sm disabled:opacity-50 ${className}`
            }
        >
            {children}
        </button>
    );
}
```

### 5.2 Komponen Badge Status Presensi (AttendanceBadge.jsx)
```jsx
import React from 'react';

export default function AttendanceBadge({ status }) {
    const statusMap = {
        Hadir: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        Izin: 'bg-amber-50 text-amber-700 border-amber-200',
        Sakit: 'bg-blue-50 text-blue-700 border-blue-200',
        Alpa: 'bg-rose-50 text-rose-700 border-rose-200',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusMap[status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
            {status}
        </span>
    );
}
```

### 5.3 Komponen Input Form (TextInput.jsx)
```jsx
import React, { forwardRef } from 'react';

export default forwardRef(function TextInput({ type = 'text', className = '', isError, ...props }, ref) {
    return (
        <input
            {...props}
            type={type}
            ref={ref}
            className={
                `h-[42px] px-3.5 bg-white border text-sm text-slate-900 rounded-lg transition focus:outline-none ${
                    isError
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                        : 'border-slate-300 focus:border-[#800020] focus:ring-2 focus:ring-[#E8B4B8]'
                } ${className}`
            }
        />
    );
});
```

---

## 6. Pola Tata Letak Halaman (Layout Templates)

### 6.1 Struktur Layout Dashboard (Desktop)
```
+---------------------------------------------------------------------------+
| [TOP NAVIGATION: Logo | TA 2026/2027 Ganjil | Notifikasi SVG | Profil]    |
+--------------+------------------------------------------------------------+
|              | [Page Header: Breadcrumbs > Judul Modul + Tombol Aksi]     |
|   SIDEBAR    +------------------------------------------------------------+
|  NAVIGASI    | [METRIK STATISTIK: 4 Kolom Card Metrik Utama]              |
|              +----------------------------------------+-------------------+
| * Dashboard  |                                        |                   |
| * Pengguna   |  [KONTEN UTAMA: Tabel / Form / Grafik] |  [SIDE PANEL:     |
| * Akademik   |                                        |   Aktivitas Baru, |
| * Presensi   |                                        |   Agenda Ujian]   |
| * Raport     |                                        |                   |
| * BK         +----------------------------------------+-------------------+
| * Laporan    | [FOOTER: (C) 2026 UPT SDN 9 Gandangbatu Sillanan - TechSoe] |
+--------------+------------------------------------------------------------+
```

### 6.2 Titik Henti Responsif (Breakpoints)
* **Mobile (`< 640px`):** Sidebar ditutup (Drawer overlay), navigasi via burger button SVG.
* **Tablet (`640px - 1024px`):** Sidebar mode ikon kompak, statistik 2 kolom.
* **Desktop (`>= 1024px`):** Tampilan 12 kolom grid penuh, sidebar permanen.
* **Wide Screen (`>= 1440px`):** Lebar container maksimum `1400px` terpusat rapi.

---

## 7. Pedoman Aksesibilitas (Accessibility Standards)

1. **Kontras Teks:** Semua teks utama memiliki rasio kontras minimal 4.5:1 terhadap latar belakang (Standar WCAG 2.1 AA).
2. **Fokus Visual:** Seluruh elemen interaktif memiliki ring indikator fokus yang jelas (`focus:ring-2`).
3. **Screen Reader:** Elemen tombol ikon wajib memiliki atribut `aria-label` yang deskriptif.
4. **Ukuran Target Sentuh:** Tombol aksi pada perangkat mobile berukuran minimal `44px x 44px`.
