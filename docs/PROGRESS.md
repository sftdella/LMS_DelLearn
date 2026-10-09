# PROGRESS PROJECT DELLEARN

## INFORMASI PROJECT

- Nama: DelLearn
- Jenis: LMS Admin Panel / Back-Office
- Target: SMP
- Mata Kuliah: Pemrograman Web II
- Architecture: Material Design
- Status Project: Sedang Berjalan

### Keterangan Status

| Tanda  | Arti                                                                                                                                                                             |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[x]`  | **Selesai** — sudah diperiksa **dan** sudah dikonfirmasi pemilik project ("SUDAH")                                                                                               |
| `[x]*` | **Selesai (diuji Claude)** — seluruh pengujian otomatis Claude lolos dan pemilik mengizinkan tahap ini ditandai selesai, **tetapi belum diuji langsung oleh pemilik** di browser |
| `[~]`  | **Sebagian** — sudah ada, tetapi masih ada kekurangan yang tercatat                                                                                                              |
| `[ ]`  | **Belum** — belum dikerjakan / belum ada                                                                                                                                         |
| `[?]`  | **Belum Diverifikasi** — sudah ada dan lolos pemeriksaan Claude, tetapi **belum dikonfirmasi** pemilik, atau belum dapat diperiksa                                               |

> Catatan: per audit pertama (25 September 2026) **belum ada item bertanda `[x]`**, karena belum ada konfirmasi "SUDAH" dari pemilik project.

---

# MILESTONE 1 — PERANCANGAN

Sumber utama: `docs/PERANCANGAN.md`

| Status | Bagian                        | Bukti file                               | Catatan                                                                                                                                                                                                                                                                                                                                                     |
| ------ | ----------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[~]`  | Struktur menu/sidebar         | `docs/PERANCANGAN.md` §7                 | Struktur ada (Dashboard, Kelas, Peserta, Pengajar, Pembelajaran, Ruang Try Out, Penilaian). **Belum mencantumkan menu "Pertemuan"**, padahal menu itu ada di sidebar project.                                                                                                                                                                               |
| `[?]`  | Hierarki menu                 | `docs/PERANCANGAN.md` §7                 | Hierarki bertingkat ada (sub-menu Modul/Tugas/Kuis, TO PTS/TO PAS, Rekap Nilai). Menunggu konfirmasi.                                                                                                                                                                                                                                                       |
| `[?]`  | ERD Mermaid                   | `docs/PERANCANGAN.md` §11                | Ada blok ` ```mermaid erDiagram ` dengan 13 entitas dan relasinya. **Belum dirender/dilihat** untuk memastikan diagramnya tampil benar.                                                                                                                                                                                                                     |
| `[~]`  | User Flow                     | `docs/PERANCANGAN.md` §10                | Ada User Flow Peserta, Pengajar, dan Admin **dalam bentuk teks**. Panduan dosen meminta User Flow/Wireframe di Stitch, tetapi **tidak ada screenshot** sebagai bukti.                                                                                                                                                                                       |
| `[?]`  | Rancangan halaman             | `docs/PERANCANGAN.md` §13–§15            | Rancangan Dashboard, Kelas, Pertemuan, Modul, Rekap Nilai + daftar 10 halaman wireframe. Menunggu konfirmasi.                                                                                                                                                                                                                                               |
| `[~]`  | Design System                 | `docs/PERANCANGAN.md` §12                | Hanya deskripsi umum ("Biru", "Biru muda", dst.) **tanpa kode warna HEX** dan tanpa ukuran font. Kode CSS sekarang memakai palet dari file High-Fidelity (`#004AC6`), sedangkan catatan kerja sebelumnya memakai `#1976D2` → **belum sinkron**.                                                                                                             |
| `[?]`  | Link Figma                    | `docs/PERANCANGAN.md` §16                | Link ada. **Belum dapat diperiksa** apakah link bisa dibuka publik. Nama file Figma masih "Untitled".                                                                                                                                                                                                                                                       |
| `[~]`  | Link/screenshot Stitch        | `docs/PERANCANGAN.md` §17                | Link Stitch ada. **Screenshot masih "[Akan ditambahkan]"** — panduan dosen mewajibkan embed/screenshot.                                                                                                                                                                                                                                                     |
| `[~]`  | Dokumentasi rancangan lainnya | `docs/PERANCANGAN.md` §1–§6, §8, §9, §18 | Identitas, deskripsi, role, fitur, struktur kelas & pembelajaran sudah ada. **Masalah format:** baris 1 dibuka dengan ` ````markdown ` dan baru ditutup di baris 93, sehingga §1–§4 tampil sebagai kotak kode (bukan teks biasa). Baris 744–746 berisi blok kode kosong. File High-Fidelity PDF ada di folder induk tetapi belum dirujuk di PERANCANGAN.md. |

---

# MILESTONE 2 — SLICING & LAYOUTING

> **Status: TERPENUHI — dikonfirmasi pemilik (7 Oktober 2026): "SUDAH — Milestone 2 terpenuhi."** Catatan di bawah yang menyebut "belum diperiksa" adalah kondisi saat audit awal; tablet & mobile semua halaman sudah diuji pada Tahap 6 & 8 (1280/820/500/375px).
>
> Output wajib menurut panduan: **Halaman Master/Template dasar (`layout.html`)** dengan Sidebar, Header, Content Area, Footer yang responsif.

## HTML

| Status | Bagian                       | Bukti file    | Catatan                                                                                                                                                      |
| ------ | ---------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `[x]`  | index.html                   | `index.html`  | Dashboard sesuai PDF High-Fidelity hlm. 1. Lolos cek link & struktur.                                                                                        |
| `[x]`  | layout.html                  | `layout.html` | Template dasar: sidebar, header, placeholder konten `<!-- Konten halaman diletakkan di sini -->`, footer. Tidak ada menu aktif (disengaja, karena template). |
| `[x]`  | Sidebar                      | 13 file HTML  | `<aside class="sidebar">` identik di semua halaman; tepat 1 menu aktif per halaman (dicek otomatis).                                                         |
| `[x]`  | Header / Topbar              | 13 file HTML  | `<header class="header">`: breadcrumb "Bimbingan Belajar SMP › Admin Portal", notifikasi, profil.                                                            |
| `[x]`  | Main Content                 | 13 file HTML  | `<main class="content">` ada di semua halaman.                                                                                                               |
| `[x]`  | Footer                       | 13 file HTML  | `<footer class="footer">` ada di semua halaman. (Desain PDF tidak menampilkan footer; dipertahankan karena wajib di Milestone 2.)                            |
| `[x]`  | Struktur HTML yang konsisten | 13 file HTML  | Tag semantik `aside`, `nav`, `header`, `main`, `section`, `footer` dipakai; tag pembuka/penutup seimbang (dicek otomatis).                                   |

## CSS

Semua gaya ada di satu file: `assets/css/style.css` (44 CSS variable di `:root`, 0 `!important`, 0 inline `style=""` di HTML).

| Status | Bagian        | Bukti                                 | Catatan                                                                                                                                               |
| ------ | ------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[~]`  | Design System | `style.css` bagian 1 (Design Tokens)  | Token lengkap ada, tetapi **nilainya belum sinkron dengan PERANCANGAN.md** (lihat Milestone 1).                                                       |
| `[x]`  | Color Palette | `style.css` `:root`                   | Diambil dari data vektor PDF High-Fidelity: primary `#004AC6`, latar `#F8F9FF`, teks `#000000`/`#515F74`, hijau `#116231`/`#A6F4B5`, merah `#BA1A1A`. |
| `[x]`  | Typography    | `style.css` `:root`                   | Font Inter; skala 24 / 16 / 14 / 13 / 12 px (sesuai PDF).                                                                                             |
| `[x]`  | Spacing       | `style.css` `--space-1` … `--space-8` | Sistem jarak kelipatan 4/8 px.                                                                                                                        |
| `[x]`  | Padding       | `style.css`                           | Memakai token spacing.                                                                                                                                |
| `[x]`  | Margin        | `style.css`                           | Memakai token spacing.                                                                                                                                |
| `[x]`  | Border        | `style.css` `--border: #E7E8EE`       |                                                                                                                                                       |
| `[x]`  | Border Radius | `style.css` `--radius-sm/md/pill`     | 4px / 8px / pill.                                                                                                                                     |
| `[x]`  | Button        | `style.css` bagian 8                  | Primary, Secondary, Tonal, Muted, Danger, Save, Link, Small, Icon button.                                                                             |
| `[x]`  | Card          | `style.css` bagian 9–10               | Card + stat card.                                                                                                                                     |
| `[x]`  | Table         | `style.css` bagian 13                 | Varian bergaris, zebra, polos, tfoot, pagination.                                                                                                     |
| `[x]`  | Form/Input    | `style.css` bagian 12 & 19            | Search field, select field, form-control dengan focus state. Form nyata hanya di `pages/modul.html` (validasi = Milestone 3).                         |

## LAYOUT

| Status | Bagian         | Bukti                                    | Catatan                                                                                                                                                                                                                                             |
| ------ | -------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[x]`  | Flexbox        | `style.css`                              | 63 aturan `display: flex`.                                                                                                                                                                                                                          |
| `[x]`  | CSS Grid       | `style.css`                              | 15 aturan `display: grid` (layout utama, stat cards, dashboard 2+1 kolom, grid-2, grid-3).                                                                                                                                                          |
| `[x]`  | Sidebar        | `.layout` grid 240px + `.sidebar` sticky | Lebar 240px sesuai PDF.                                                                                                                                                                                                                             |
| `[x]`  | Header         | `.header` sticky, tinggi 64px            | Sesuai PDF.                                                                                                                                                                                                                                         |
| `[x]`  | Content Area   | `.content`                               | Padding 24px/32px.                                                                                                                                                                                                                                  |
| `[x]`  | Footer         | `.footer`                                |                                                                                                                                                                                                                                                     |
| `[x]`  | Desktop Layout | Screenshot 1280px                        | Dibandingkan berdampingan dengan PDF untuk 5 halaman. Pengukuran otomatis: **tidak ada scroll horizontal** di index, data-kelas, data-peserta, data-pengajar (1280px).                                                                              |
| `[x]`  | Tablet Layout  | —                                        | **Belum diperiksa** setelah penyesuaian High-Fidelity (pengukuran otomatis terhenti sebelum sampai ukuran tablet).                                                                                                                                  |
| `[x]`  | Mobile Layout  | Screenshot 500px (index)                 | Hanya dashboard yang dicek, dan itu pun salinan sementara sebelum 3 penyesuaian CSS kecil terakhir. Hasilnya: sidebar berubah jadi menu horizontal yang bisa digeser, kartu 1 kolom, tabel bisa di-scroll ke samping. **Halaman lain belum dicek.** |

## RESPONSIVE

| Status | Bagian                        | Bukti                    | Catatan                                                                                                                                                                                                                |
| ------ | ----------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[x]`  | Desktop                       | lihat LAYOUT             |                                                                                                                                                                                                                        |
| `[x]`  | Tablet                        | —                        | Belum diperiksa (lihat LAYOUT).                                                                                                                                                                                        |
| `[x]`  | Mobile                        | —                        | Baru dashboard (lihat LAYOUT).                                                                                                                                                                                         |
| `[x]`  | Media Query                   | `style.css` bagian 24    | 4 breakpoint: 1200 / 992 / 768 / 576 px. Isinya masuk akal: stat card 4→2→1 kolom, grid 2/3 kolom → 1 kolom, sidebar → menu horizontal (≤768px), teks header disembunyikan, form 1 kolom, tombol lebar penuh (≤576px). |
| `[x]`  | Responsive Grid               | `style.css` bagian 24    | Kolom grid berkurang bertahap.                                                                                                                                                                                         |
| `[x]`  | Responsive Flexbox            | `style.css`              | `flex-wrap` pada heading, filter bar, card header (≤576px), table footer.                                                                                                                                              |
| `[x]`  | Responsive Navigation/Sidebar | `style.css` @media 768px | Sidebar menjadi menu horizontal yang bisa digeser **tanpa JavaScript**. ~~Belum ada tombol buka/tutup (hamburger)~~ — **beres:** sidebar toggle (drawer) dibuat di Milestone 3 Tahap 6.                         |

## NAVIGASI

Diperiksa otomatis di **13 file** (`index.html`, `layout.html`, 11 file di `pages/`): setiap `href` diarahkan ke file yang benar-benar ada, path relatif benar (`pages/…` dari root, `../index.html` dari `pages/`), **0 `href="#"`**, 0 link rusak, semua anchor (`#form-modul`, `#informasi`, dll.) punya tujuan.

| Status | Halaman       | File                       | Catatan                                                                                      |
| ------ | ------------- | -------------------------- | -------------------------------------------------------------------------------------------- |
| `[x]`  | Dashboard     | `index.html`               |                                                                                              |
| `[x]`  | Data Kelas    | `pages/data-kelas.html`    |                                                                                              |
| `[x]`  | Detail Kelas  | `pages/detail-kelas.html`  | Dibuka dari tombol "Kelola" (Data Kelas) dan "Kelola Kelas" (Dashboard); menu aktif = Kelas. |
| `[x]`  | Pertemuan     | `pages/pertemuan.html`     | Menu ini tidak ada di PERANCANGAN.md §7 maupun sidebar PDF, tetapi dipertahankan.            |
| `[x]`  | Data Peserta  | `pages/data-peserta.html`  |                                                                                              |
| `[x]`  | Data Pengajar | `pages/data-pengajar.html` |                                                                                              |
| `[x]`  | Modul         | `pages/modul.html`         |                                                                                              |
| `[x]`  | Tugas         | `pages/tugas.html`         |                                                                                              |
| `[x]`  | Kuis          | `pages/kuis.html`          |                                                                                              |
| `[x]`  | TO PTS        | `pages/to-pts.html`        |                                                                                              |
| `[x]`  | TO PAS        | `pages/to-pas.html`        |                                                                                              |
| `[x]`  | Rekap Nilai   | `pages/rekap-nilai.html`   |                                                                                              |

## SLICING HIGH-FIDELITY

Referensi yang tersedia dan **sudah dilihat**: `[HIGH FIDELITY] DelLearn — LMS Admin Panel.pdf` (folder induk project; hlm. 1–10 = Portal Admin). Project Figma **tidak dibuka langsung**, jadi kecocokan dengan Figma **belum dapat diverifikasi secara visual**; yang dicocokkan adalah file PDF ekspornya.

Halaman yang sudah dicocokkan dengan PDF: **Dashboard (hlm. 1), Data Kelas (hlm. 2), Data Peserta (hlm. 6), Data Pengajar (hlm. 7), Rekap Nilai (hlm. 10)**.

| Status | Bagian           | Catatan                                                                                                                                                           |
| ------ | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[x]`  | Warna            | Diambil langsung dari data vektor PDF (bukan ditebak dari gambar).                                                                                                |
| `[x]`  | Typography       | Ukuran dari data teks PDF (20 / 24 / 16 / 14 / 13 / 12).                                                                                                          |
| `[x]`  | Ukuran Sidebar   | 240px, sesuai PDF.                                                                                                                                                |
| `[x]`  | Ukuran Header    | 64px, sesuai PDF.                                                                                                                                                 |
| `[~]`  | Spacing          | Sesuai PDF, **kecuali** jarak atas konten (24px, di PDF ±8px).                                                                                                    |
| `[x]`  | Card             |                                                                                                                                                                   |
| `[x]`  | Table            |                                                                                                                                                                   |
| `[x]`  | Button           |                                                                                                                                                                   |
| `[~]`  | Form             | Filter/pencarian sudah sesuai. Halaman form modul (PDF hlm. 5) belum dicocokkan.                                                                                  |
| `[x]`  | Alignment        | Untuk 5 halaman di atas.                                                                                                                                          |
| `[~]`  | Layout           | 5 dari 10 halaman admin di PDF sudah dicocokkan. Belum: Detail Kelas (hlm. 3), Pertemuan (hlm. 4), Modul (hlm. 5), Tugas & Kuis (hlm. 8), Ruang Try Out (hlm. 9). |
| `[x]`  | Visual hierarchy | Untuk 5 halaman di atas.                                                                                                                                          |

**Perbedaan yang disengaja dari PDF:** menu Pertemuan tetap ada; kolom Aksi di tabel Pengajar tetap ada; footer tetap ada; kotak pencarian di header dihapus (mengikuti PDF); Nilai Akhir di Rekap Nilai dihitung ulang (lihat Kekurangan).

---

# MILESTONE 3 — IMPLEMENTASI KOMPONEN & INTERAKTIVITAS

Status: **SEDANG DIKERJAKAN** (dimulai 25 September 2026)

## Pemetaan 4 halaman wajib

| Kategori            | Halaman                                    | Keterangan                                                                                |
| ------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Dashboard           | `index.html`                               | Kartu statistik dihitung dari mock data + grafik Chart.js "Distribusi Peserta per Kelas". |
| Data Table / Master | `pages/data-kelas.html`                    | Tabel dirender JavaScript dari mock data; Tambah / Edit / Hapus.                          |
| Form Input / Edit   | `pages/form-kelas.html` (**halaman baru**) | Satu form untuk Tambah dan Edit Kelas, dengan validasi JavaScript.                        |
| Laporan / Detail    | `pages/rekap-nilai.html`                   | Ringkasan, tabel, statistik + tombol Cetak dan Kembali.                                   |

## Keputusan pemilik (Tahap 1)

1. **Warna:** tetap memakai palet PDF High-Fidelity (`#004AC6`, dst.). High-Fidelity final menjadi acuan visual utama Milestone 3.
2. **Status kelas:** kelima kelas berstatus **Aktif** (konsisten antara Dashboard dan Data Kelas).
3. **Kapasitas:** memakai hasil hitung dari mock data: 85 peserta / 105 kapasitas × 100 = **81.0%**, dipakai konsisten di halaman yang relevan.
4. **Form:** dibuat sebagai halaman baru `pages/form-kelas.html` untuk Tambah dan Edit Kelas.
5. **Penyimpanan data:** satu sumber mock data di `assets/js/script.js`, disimpan di `localStorage` browser agar hasil Tambah/Edit/Hapus tetap ada saat berpindah halaman. Client-side only (tanpa backend/database/API).
6. **Chart.js** dimuat dari CDN (butuh koneksi internet saat demo).

## Tahapan pengerjaan

| Status | Tahap                                    | Catatan                                                                                                                                                                                                                                                                                                |
| ------ | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `[x]`  | Tahap 1 — Audit & rencana halaman        | Dikonfirmasi pemilik 25 September 2026.                                                                                                                                                                                                                                                                |
| `[x]`  | Tahap 2 — Mock data                      | **Diuji Claude dan diverifikasi manual oleh pemilik (25 September 2026).** 31/31 uji data lolos; tanpa error JS di browser. Pemilik memastikan `getAllKelas()`, `getKelasStats()`, hapus + refresh, dan `resetKelas()` berfungsi.                                                                      |
| `[x]`  | Tahap 3 — Data Table + Tambah/Edit/Hapus | Dikonfirmasi pemilik ("SUDAH"). Tabel dirender dari mock data, Hapus (dengan `confirm()`) berfungsi & tersimpan.                                                                                                                                                                                       |
| `[x]`  | Tahap 4 — Form + Validation              | Dikonfirmasi pemilik ("SUDAH, semua pengujian Tahap 4 berhasil"). `pages/form-kelas.html` (Tambah & Edit) + validasi.                                                                                                                                                                                  |
| `[x]`  | Tahap 5 — Modal                          | Dikonfirmasi pemilik. Modal konfirmasi Hapus menggantikan `confirm()`. 28/28 uji modal + 46/46 uji regresi Tahap 3–4 lolos.                                                                                                                                                                            |
| `[x]`  | Tahap 6 — Sidebar Toggle                 | **Diuji Claude dan diverifikasi manual oleh pemilik (25 September 2026).** 14 halaman konsisten; 882/882 uji sidebar (1280/820/500/375px) + 74/74 regresi Tahap 3–5 lolos.                                                                                                                             |
| `[x]`  | Tahap 7 — Chart Dashboard                | **Diuji Claude dan diverifikasi manual oleh pemilik (25 September 2026).** Dashboard dari mock data + Chart.js 4.4.1 (CDN + integrity). 127/127 uji dashboard, uji CDN asli, dan uji tanpa internet lolos.                                                                                             |
| `[x]`  | Tahap 8 — Testing                        | **Diuji Claude dan diverifikasi manual oleh pemilik (25 September 2026).** Final testing 14 halaman: struktur, syntax, error JS, link, CRUD, form, modal, sidebar, dashboard, chart, responsive 1280/820/500/375px, konsistensi data. 2 bug data diperbaiki; tidak ada masalah tersisa dari pengujian. |
| `[x]*` | Tahap 9 — Update PROGRESS.md             | Dilakukan di setiap tahap dan pada akhir Tahap 8 (tidak ada pekerjaan Tahap 9 terpisah).                                                                                                                                                                                                               |

## Checklist

- [x] Dashboard — `index.html`: 4 kartu statistik & tabel Kelas Aktif dari `getAllKelas()` / `getKelasStats()` (diuji Claude, diverifikasi pemilik)
- [x] Chart — Chart.js 4.4.1 "Peserta vs Kapasitas per Kelas"; pesan pengganti bila offline (diuji Claude, diverifikasi pemilik)
- [x] Data Table — `pages/data-kelas.html` dirender `renderTable()` dari `getAllKelas()` (dikonfirmasi pemilik)
- [x] Mock Data — `assets/js/script.js` bagian 1–3; dipakai Dashboard, Data Kelas, Form Kelas (diuji Claude, diverifikasi manual pemilik 25 September 2026)
- [x] Tambah Data — "Tambah Kelas" → `form-kelas.html` → `addKelas()` → kembali ke Data Kelas + pesan berhasil (dikonfirmasi pemilik)
- [x] Edit Data — tombol Edit → `form-kelas.html?id=N` (form terisi otomatis) → `updateKelas()`; ID tetap (dikonfirmasi pemilik)
- [x] Hapus Data — `confirm()` → `deleteKelas(id)` → `renderTable()`; tetap terhapus setelah browser dibuka ulang (dikonfirmasi pemilik; modal custom = Tahap 5)
- [x] Modal Konfirmasi — `#modal-hapus` di `pages/data-kelas.html`; `hapusData()` membuka modal, `konfirmasiHapus()` → `deleteKelas(id)` (dikonfirmasi pemilik)
- [x] Form Input — `pages/form-kelas.html` (8 kolom; pilihan dropdown dari mock data) (dikonfirmasi pemilik)
- [x] Form Validation — `validateKelas()`: 7 kolom wajib, angka bulat, peserta ≥ 0, kapasitas > 0, peserta ≤ kapasitas, nama tidak kembar; error tampil di bawah kolom (dikonfirmasi pemilik)
- [x] Halaman Laporan/Detail — `pages/rekap-nilai.html` (ringkasan, statistik, tabel nilai, rumus) & `pages/detail-kelas.html` sudah ada dan datanya konsisten; ~~tombol Cetak & Kembali pada Rekap Nilai belum dibuat~~ — **dibuat di Tahap 10 Fase 10** (dikonfirmasi pemilik 7 Oktober 2026)
- [x] Sidebar Toggle — tombol menu di header; sidebar jadi laci di ≤ 992px; backdrop & Escape menutup (diuji Claude, diverifikasi pemilik)
- [x] DOM Manipulation — tabel & kartu Data Kelas, form Tambah/Edit, modal Hapus, sidebar toggle, dan Dashboard dirender/diubah JavaScript (diuji Claude, diverifikasi pemilik)
- [x] Responsive Testing — 14 halaman × 1280/820/500/375px: tanpa overflow horizontal, sidebar & dashboard benar (diuji Claude, diverifikasi pemilik)
- [x] JavaScript Testing — syntax, 31 uji data, 16 uji validasi, uji alur browser Tahap 3–7, 14 halaman tanpa error JS (diuji Claude, diverifikasi pemilik)

## Tahap 10 — Interaktivitas Semua Halaman (pengembangan lanjutan)

Dimulai 28 September 2026 atas permintaan pemilik: semua menu sidebar dibuat benar-benar interaktif (bukan mockup), client-side only, mock data + `localStorage`, data antarhalaman saling terhubung (relasi berdasarkan ID). Dikerjakan per fase; setiap fase diuji Claude lalu dikonfirmasi pemilik sebelum lanjut. Status Tahap 2–8 di atas **tetap `[x]`**.

### Keputusan pemilik (28 September 2026)

1. **Jumlah peserta (1a):** dibuat 85 data peserta (20/18/19/15/13 per kelas); jumlah peserta kelas **dihitung dari Data Peserta**. Form Kelas tidak lagi menerima input jumlah peserta (hanya tampil); kapasitas tetap diatur dan tidak boleh lebih kecil dari peserta terdaftar; peserta tidak dapat ditambahkan ke kelas yang penuh. Dashboard tetap 85 peserta / 81.0%.
2. **Hapus kelas (2a):** data materi/kegiatan/nilai kelas ikut dihapus; **peserta tidak dihapus**, menjadi "Belum ada kelas"; modal hapus menjelaskan dampaknya.
3. **Tombol dekoratif (3a):** diberi fungsi nyata yang sederhana (mis. Ekspor CSV mengunduh file); tombol tanpa fungsi nyata (notifikasi, "Semester Ganjil") diubah menjadi informasi, bukan tombol palsu.
5. **Data nilai (7 Oktober 2026, sebelum Fase 10):** dibuat nilai mock untuk 85 peserta (koleksi `dellearn.nilai.v1`, relasi `pesertaId` + `kelasId`); nilai 5 peserta Matematika lama tetap sama persis; nilai lain deterministik (bukan acak). Rekap Nilai tetap halaman laporan, tanpa CRUD.
4. Kunci `dellearn.kelas.v1` dipertahankan; koleksi baru memakai `dellearn.<nama>.v1`. `resetSemuaData()` tersedia untuk pengujian dan **tidak dijalankan otomatis**.

### Fase

| Status | Fase                                                                                                                                                  | Catatan                                                                                                                                      |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `[x]`  | Fase 1 — Data Peserta                                                                                                                                 | Dikonfirmasi pemilik ("FASE 1 SUDAH", 28 September 2026).                                                                                    |
| `[x]`  | Fase 2 — Data Pengajar                                                                                                                                | Dikonfirmasi pemilik ("FASE 2 SUDAH", 2 Oktober 2026).                                                                                       |
| `[x]`  | Fase 3 — Pertemuan                                                                                                                                    | Dikonfirmasi pemilik ("FASE 3 SUDAH", 2 Oktober 2026).                                                                                       |
| `[x]`  | Fase 4 — Modul                                                                                                                                        | Dikonfirmasi pemilik (2 Oktober 2026): "Semua pengujian manual Fase 4 berhasil dan sesuai."                                                  |
| `[x]`  | Fase 5 — Tugas                                                                                                                                        | Dikonfirmasi pemilik (2 Oktober 2026): "Semua pengujian manual Fase 5 berhasil dan sesuai." (setelah 1 bug ditemukan pemilik dan diperbaiki) |
| `[x]`  | Fase 6 — Kuis                                                                                                                                         | Dikonfirmasi pemilik (2 Oktober 2026): "Semua pengujian manual Fase 6 berhasil dan sesuai."                                                  |
| `[x]`  | Fase 7 — TO PTS                                                                                                                                       | Dikonfirmasi pemilik (6 Oktober 2026): "Semua pengujian manual Fase 7 berhasil dan sesuai."                                                  |
| `[x]`  | Fase 8 — TO PAS                                                                                                                                       | Dikonfirmasi pemilik (6 Oktober 2026): "FASE 8 SUDAH." (setelah 1 bug ditemukan pemilik dan diperbaiki)                                      |
| `[x]`  | Fase 9 — Detail Kelas                                                                                                                                 | Dikonfirmasi pemilik (7 Oktober 2026): "FASE 9 SUDAH."                                                                                       |
| `[x]`  | Fase 10 — Rekap Nilai (filter, Cetak `window.print()`, Kembali)                                                                                       | Dikonfirmasi pemilik (7 Oktober 2026): "FASE 10 SUDAH."                                                                                      |
| `[x]`  | Fase 11 — Integrasi Dashboard + tombol dekoratif tersisa (header notifikasi, "Semester Ganjil", Ekspor CSV & pencarian Data Kelas, "Tambah Kegiatan") | Dikonfirmasi pemilik (7 Oktober 2026): "FASE 11 SUDAH."                                                                                      |

### Penyesuaian perilaku Tahap 2–8 (disengaja, akibat keputusan di atas)

- Form Kelas: kolom **Jumlah Peserta** kini _readonly_ (dihitung dari Data Peserta); validasi "peserta ≤ kapasitas" diganti "kapasitas ≥ peserta terdaftar". Pilihan pengajar diambil dari Data Pengajar (nilai = ID pengajar).
- `resetKelas()` kini mengembalikan **seluruh** data demo (sama dengan `resetSemuaData()`), agar kondisi awal 85 peserta / 81.0% tetap tercapai setelah kelas dihapus.
- Kelas menyimpan `pengajarId` (bukan nama); nama pengajar selalu diambil dari Data Pengajar terbaru. Data lama di browser yang menyimpan nama pengajar dipetakan otomatis.
- Dashboard: kartu Tenaga Pendidik = pengajar **Aktif** di Data Pengajar; badge "Semua Ditugaskan" / "N Belum Ditugaskan" dihitung.
- Uji lama yang berubah karena hal di atas (6 butir uji Node Tahap 2/4 tentang input jumlah peserta; ekspektasi Dashboard setelah IPA dihapus: 4 pengajar, "1 Belum Ditugaskan") diganti uji baru; semua uji lain tetap lolos tanpa perubahan.

## Fitur Login & Role-Based UI (pengembangan lanjutan, setelah Tahap 10)

| Status | Pekerjaan                                                     | Catatan                                                                                         |
| ------ | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `[x]`  | Login simulasi + tampilan berdasarkan role (Admin, Pengajar, Peserta) | Dikonfirmasi pemilik (7 Oktober 2026): "LOGIN SUDAH, semua pengujian manual berhasil." Uji otomatis: login & role 113/113, Node 28/28, regresi Fase 1–11 lolos. |

**PENTING — hanya simulasi frontend:** akun demo & password tertulis di `assets/js/script.js` dan session disimpan di `localStorage` (`dellearn.auth.v1`). Siapa pun dapat melihat/mengubahnya lewat DevTools. Proteksi halaman (`requireAuth()` / `requireRole()`) hanya mengatur tampilan di browser, **bukan keamanan backend**. Keamanan sungguhan memerlukan server (backend) — di luar cakupan project client-side ini.

- Akun demo: Admin `admin@dellearn.id` / `admin123`; Pengajar `pengajar@dellearn.id` / `guru123` (= Andi Saputra, `pengajarId` 1); Peserta `peserta@dellearn.id` / `siswa123` (= Budi Santoso, `pesertaId` 1). Tidak ada akun baru yang dibuat otomatis.
- Halaman baru: `pages/login.html`, `pages/dashboard-pengajar.html`, `pages/dashboard-peserta.html`, `pages/kelas-saya.html`, `pages/modul-saya.html`, `pages/aktivitas-saya.html`, `pages/latihan-saya.html`, `pages/kuis-saya.html`, `pages/to-pts-saya.html`, `pages/to-pas-saya.html`, `pages/nilai-saya.html`.
- Admin: halaman & sidebar lama tidak berubah; header kini "Portal Admin" + nama dari session + tombol Keluar.
- Pengajar: memakai halaman yang sudah ada (Pertemuan, Modul, Tugas, Kuis, TO PTS/PAS, Detail Kelas, Rekap Nilai) dengan sidebar Pengajar; data dibatasi ke kelas yang diampu (`pengajarId`); TO hanya dapat dilihat (dikelola Admin); tautan ke halaman Admin disembunyikan.
- Peserta: halaman baca-saja dari data yang sama (kelas, pertemuan, modul aktif, kuis, TO, nilai milik sendiri). Progress belajar per siswa belum tercatat di data, jadi disimulasikan dari status pertemuan kelas (Selesai 100%, Berjalan 60%, Belum Dimulai 0%).
- Tidak ada koleksi baru untuk kelas/peserta/pengajar; satu-satunya kunci baru: `dellearn.auth.v1` (+ `sessionStorage` `dellearn.akses` untuk pesan "Anda tidak memiliki akses ke halaman ini.").

## Portal Peserta & Pengajar Fungsional (pengembangan lanjutan, dimulai 7 Oktober 2026)

Tujuan: Pretest, Modul, Aktivitas, Latihan, Kuis, TO PTS/PAS, dan Tugas benar-benar dapat dikerjakan Peserta; Pengajar dapat mengelola konten & melihat hasil peserta kelasnya. Client-side + `localStorage`.

**Audit awal:** Pretest/Aktivitas/Latihan belum punya data (hanya centang komponen pertemuan); Kuis & TO hanya metadata tanpa soal; modul PDF hanya nama file; halaman Peserta hanya baca; nilai masih angka mock; belum ada pengumpulan tugas maupun halaman Hasil Peserta.

**Keputusan pemilik (7 Oktober 2026):**

1. Konten mock Pretest/Aktivitas/Latihan **mengikuti komponen yang sudah dicentang siap** (P1–P3 penuh, P4 sebagian, di 5 kelas); P5–P12 menampilkan keadaan kosong yang jelas dan dapat diisi pengajar (komponen otomatis tercentang saat konten Aktif disimpan). Bank soal tetap ditulis untuk 12 pertemuan agar TO punya soal.
2. **Hasil nyata menggantikan nilai mock per komponen** di Rekap Nilai (rata-rata kuis, nilai tugas yang dinilai, skor TO PTS/PAS); komponen tanpa hasil tetap memakai nilai awal. Bobot 20/20/30/30 tetap.
3. **Tugas dikumpulkan peserta** (jawaban teks + nama file lampiran, simulasi) dan **dinilai pengajar**; nilainya masuk komponen Tugas.
4. **Hasil mock untuk peserta lain** pada pertemuan yang sudah Selesai (dan sebagian P3), **kecuali Budi** (akun demo) agar dapat diuji dari awal. Nilai kuis & tugas mock disusun agar Rekap Nilai lama tidak berubah.

Aturan pengerjaan: Pretest, Kuis, TO dikerjakan 1 kali; Aktivitas & Latihan boleh diulang; jawaban & sisa waktu tetap tersimpan saat halaman di-refresh.

| Status | Fase                                                                                                         | Catatan                                     |
| ------ | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| `[x]`  | P1 — Data & mesin soal (bank soal 5 mapel × 12 pertemuan, koleksi evaluasi/hasil/progresmodul, nilai efektif) | Kode & uji otomatis selesai (7 Oktober 2026). |
| `[x]`  | P2 — Peserta: halaman Pertemuan, Pretest, Modul, Aktivitas, Latihan, Tugas                                   | Kode & uji otomatis selesai (7 Oktober 2026); menunggu verifikasi manual. |
| `[x]`  | P3 — Peserta: Kuis bertimer, TO PTS/PAS, Nilai Saya, dashboard dari hasil nyata                              | Kode & uji otomatis selesai (7 Oktober 2026); menunggu verifikasi manual. |
| `[x]`  | P4 — Pengajar: CRUD Pretest/Aktivitas/Latihan, editor soal (Pretest, Aktivitas + Menjodohkan, Latihan, Kuis, TO PTS/PAS), Preview, Tugas (lampiran, pengumpulan, penilaian), gambar & PDF modul | Kode & uji otomatis selesai (8 Oktober 2026); **menunggu verifikasi manual pemilik** (lihat Riwayat 8 Oktober 2026). |
| `[x]`  | P5 — Perbaikan & penyempurnaan: PDF modul tidak blank, Pretest tepat 5 soal, Aktivitas Interaktif 8 tipe (bukan kuis), Latihan Kumpulan Soal/Susun Sendiri (10 soal), TO PTS P1–6 30 soal / PAS P7–12 40 soal, hasil lengkap, progress 5 langkah, breadcrumb + riwayat + Kembali, Seftia Della (Perempuan), migrasi data. **Lanjutan (8 Oktober 2026):** alur belajar WAJIB berurutan & terkunci, Aktivitas ringkasan/Coba Lagi, Bank Soal = dokumentasi gambar/PDF + jawaban foto dinilai Pengajar, Kuis dibuat Pengajar (`dellearn.kuis.v2`, bukan dari Bank Soal), tahun data 2026 | Kode & uji otomatis selesai (8 Oktober 2026); **menunggu verifikasi manual pemilik** (lihat Riwayat 8 Oktober 2026 — P5 & P5 lanjutan). Lingkup P5 diganti pemilik 8 Oktober 2026 (rencana lama "Hasil Peserta per peserta" belum dikerjakan). |
| `[x]`  | P5b — Tugas: soal teks / dokumentasi (PDF/JPG/PNG) + jawaban Ketik / Upload File (maks. 10 MB) + penilaian manual (nilai, feedback); dokumentasi dikeluarkan dari Latihan; halaman Bank Soal & Soal Dokumentasi dihapus | Kode & uji otomatis selesai; **diverifikasi manual pemilik: "SUDAH" (8 Oktober 2026)**. Lihat Riwayat 8 Oktober 2026 — P5b. Menggantikan bagian Bank Soal dokumentasi di P5 lanjutan. |
| `[x]`  | P5c — Latihan Soal dibuat langsung oleh Pengajar: tanpa Sumber Soal / Bank Soal / Kumpulan Soal; Tambah Latihan → form soal langsung terbuka; soal PG & B/S; Edit (termasuk soal latihan lama) & Hapus dengan modal konfirmasi | Kode & uji otomatis selesai; **diverifikasi manual pemilik: "SUDAH" (8 Oktober 2026)**. Lihat Riwayat 8 Oktober 2026 — P5c. |
| `[x]`  | P6 — Detail Pengerjaan & Pemantauan Progres Peserta (Pengajar & Admin): baris daftar Pretest/Modul/Aktivitas/Latihan/Kuis/Tugas dapat diklik → halaman Pemantauan per komponen (info, ringkasan, tabel peserta + cari/filter, Lihat Detail jawaban asli & kunci, penilaian Tugas) | Kode & uji otomatis selesai; **diverifikasi manual pemilik: "SUDAH" (9 Oktober 2026)**. Lihat Riwayat 9 Oktober 2026 — P6. |
| `[x]`  | P5f — Data pembelajaran Pertemuan 5 lengkap di kelima kelas: Pretest (5 soal), Modul (materi utuh), Aktivitas Interaktif (4), Latihan Soal (10 soal), Tugas (ketik/upload), Kuis (10 soal baru) — migrasi v8 tanpa reset | Kode & uji otomatis selesai; **diverifikasi manual pemilik: "SUDAH" (9 Oktober 2026)**. Lihat Riwayat 9 Oktober 2026 — P5f. |
| `[x]`  | P5e — Data pembelajaran Pertemuan 4 lengkap di kelima kelas: Pretest (5 soal), Modul (materi utuh), Aktivitas Interaktif (4), Latihan Soal (10 soal), Tugas (ketik/upload), Kuis (10 soal baru) — migrasi v7 tanpa reset | Kode & uji otomatis selesai; **diverifikasi manual pemilik: "SUDAH" (9 Oktober 2026)**. Lihat Riwayat 9 Oktober 2026 — P5e. |
| `[x]`  | P5d — Akses Pertemuan otomatis berdasarkan jadwal (tanggal tersimpan = tanggal mulai; selesai = 1 hari sebelum pertemuan berikutnya, maks. 1 minggu) + Mode Akses Otomatis/Manual (Buka Kembali, Kembali ke Otomatis); Selesai = read-only; berlaku untuk Pretest, Modul, Aktivitas, Latihan, Kuis, Tugas | Kode & uji otomatis selesai; **diverifikasi manual pemilik: "SUDAH" (9 Oktober 2026)**. Lihat Riwayat 8 Oktober 2026 — P5d. |

Koleksi baru (pola `dellearn.<nama>.v1`): `dellearn.evaluasi.v1` (Pretest/Aktivitas/Latihan + soal), `dellearn.hasil.v1` (hasil pengerjaan, pengumpulan tugas; kunci pesertaId + jenis + itemId, menyimpan kelasId & pertemuanId), `dellearn.progresmodul.v1`. Kuis mendapat isian `soal` (kuis lama tanpa `soal` memakai soal bank, tidak ada data yang dihapus). Soal TO diambil dari bank Pertemuan 1–6 (PTS) / 1–12 (PAS).

**Keputusan pemilik untuk P4 (7 Oktober 2026):** P4 harus benar-benar menyelesaikan sisi Pengajar (bukan tombol CRUD kosong): Tambah/Edit/Hapus/Preview untuk setiap jenis konten, editor soal (pertanyaan, pilihan A–D, jawaban benar, pembahasan), perubahan soal langsung terlihat peserta, tetap memakai role restriction & `localStorage` yang ada. Aktivitas Interaktif mendapat model **Menjodohkan** selain Pilihan Ganda & Benar/Salah. **Upload gambar & PDF Modul ikut P4.** P4 tidak ditandai selesai sebelum pemilik menguji manual.

**Perubahan data P4 (tanpa koleksi baru, kunci `localStorage` tetap):** TO mendapat isian `soal` (TO lama tanpa `soal` tetap memakai bank); tipe soal baru `jodoh` `{ kiri[], opsi[] (urut abjad), kunci[] }` khusus Aktivitas; tugas mendapat `lampiran { nama, ukuran, tipe, data }`; pengumpulan peserta menyimpan isi lampiran; modul menyimpan `gambar { nama, ukuran, data, keterangan }` (Tulis Materi) dan isi PDF `file.data` (Upload PDF). Batas file yang disimpan di browser: PDF modul 1 MB, gambar 500 KB, lampiran tugas 500 KB; bila penyimpanan browser penuh, data tidak disimpan dan muncul pesan.

---

# KEKURANGAN SAAT INI

_(Diperbarui setelah Tahap 8, 25 September 2026. Butir yang sudah beres ditandai ✔ dan tidak dihapus.)_

## WAJIB UNTUK MILESTONE AKTIF

1. ✔ ~~Belum ada verifikasi langsung dari pemilik untuk Tahap 6, 7, 8~~ — **beres:** diverifikasi manual oleh pemilik pada 25 September 2026. ~~Yang masih menunggu konfirmasi: **Tahap 2** (mock data)~~ — **beres:** Tahap 2 diverifikasi manual oleh pemilik pada 25 September 2026. ~~Yang masih menunggu: **konfirmasi visual Milestone 2** (5 halaman vs PDF).~~ — **beres:** dikonfirmasi pemilik 7 Oktober 2026.
2. ✔ ~~Tampilan tablet dan mobile belum diperiksa untuk semua halaman~~ — **beres (diuji Claude, Tahap 6 & 8):** 14 halaman × 820/500/375px tanpa overflow horizontal.
3. **Project belum menjadi repository Git** (`git rev-parse` → "not a git repository"). Panduan: tugas dikumpulkan lewat link GitHub/GitLab.
4. ✔ ~~**Tombol Cetak & Kembali di Rekap Nilai** (bagian dari rencana halaman Laporan pada Tahap 1) belum dibuat.~~ — **beres:** dibuat di Tahap 10 Fase 10 (Cetak `window.print()`, Kembali ke Detail Kelas/Dashboard).

## SEBAIKNYA DIPERBAIKI

1. ✔ ~~Data contoh tidak konsisten antarhalaman~~ — **beres:** kelima kelas Aktif (Tahap 1–3); "Kelas Bimbel Berjalan" di Data Peserta 12 → **5**; Detail Kelas kini memakai Budi Santoso **85.0** & Siti Aminah **90.1** sesuai Rekap Nilai (Tahap 8).
2. **Nilai Akhir di PDF tidak cocok dengan rumus 20/20/30/30.** Project memakai hasil hitung yang benar (mis. Budi 85.0, bukan 85.6; rata-rata 85.5, bukan 85.8). Perlu keputusan pemilik: tetap hitungan benar, atau ikut angka PDF.
3. **PERANCANGAN.md perlu dirapikan:** pembuka ` ````markdown ` di baris 1, blok kosong di akhir, screenshot Stitch belum ada, Design System tanpa kode HEX, menu Pertemuan belum tercantum.
4. **5 halaman admin lain di PDF belum dicocokkan:** Detail Kelas, Pertemuan, Modul, Tugas & Kuis (di PDF digabung dalam 1 halaman bertab), Ruang Try Out (di PDF digabung).
5. Jarak atas konten 24px (PDF ±8px) — dipilih agar judul tidak menempel ke header; perlu persetujuan.

## MILESTONE BERIKUTNYA

_(Daftar awal dari audit Milestone 2; statusnya setelah Milestone 3.)_

1. ✔ Sidebar toggle (tombol hamburger) untuk mobile — Tahap 6.
2. ✔ Modal konfirmasi untuk tombol Hapus — Tahap 5.
3. ✔ Validasi form — dibuat pada Form Kelas (Tahap 4). Form Tambah Modul tetap tanpa validasi (tidak termasuk tahapan).
4. ✔ Grafik dengan Chart.js di Dashboard — Tahap 7.
5. ✔ Manipulasi mock data di tabel (tambah/edit/hapus) — Tahap 3–5. ~~Pencarian & filter tabel tidak dibuat~~ — kini tersedia di semua tabel (Tahap 10).
6. ✔ Halaman Laporan/Detail (Rekap Nilai, Detail Kelas) dinamis; tombol Cetak dibuat di Tahap 10 Fase 10.
7. Belum: Upload ke GitHub/Vercel agar siap demonstrasi.

---

# NEXT ACTION

1. ✔ ~~**Pemilik mengonfirmasi Tahap 2 (Mock Data)** — jawab **SUDAH** atau **BELUM**.~~ — **beres:** Tahap 2 diverifikasi manual pemilik pada 25 September 2026. (Tahap 6, 7, 8 juga sudah diverifikasi pemilik pada tanggal yang sama.)
   1a. ✔ ~~**Tahap 10 — lanjutkan Fase 11 (Integrasi Dashboard & tombol dekoratif)**~~ — **beres:** Fase 1–11 selesai dan dikonfirmasi pemilik (Fase 11 pada 7 Oktober 2026). Tahap 10 selesai; unggah ke GitHub kini dapat dilakukan setelah pemilik menyetujui (lihat no. 4).
   1b. ✔ ~~**Pemilik menguji manual fitur Login & Role-Based UI** — jawab **LOGIN SUDAH** atau **LOGIN BELUM**.~~ — **beres:** "LOGIN SUDAH, semua pengujian manual berhasil." (7 Oktober 2026).
2. ✔ ~~**Pemilik memeriksa tampilan Milestone 2** (Dashboard, Data Kelas, Data Peserta, Data Pengajar, Rekap Nilai vs PDF) — jawab **SUDAH** atau **BELUM**.~~ — **beres:** "SUDAH — Milestone 2 terpenuhi." (7 Oktober 2026).
3. ✔ ~~**Keputusan pemilik:** tombol Cetak & Kembali di Rekap Nilai (rencana Tahap 1) — dibuat atau tidak.~~ — **beres:** dibuat di Tahap 10 Fase 10 (dikonfirmasi pemilik 7 Oktober 2026).
4. **Inisialisasi Git dan unggah project ke GitHub** (perlu persetujuan pemilik).
4a. ✔ **beres: P1–P4 dikonfirmasi pemilik ("sudah", 8 Oktober 2026)** — ~~Pemilik menguji manual P4 (Portal Pengajar)~~ — langkah uji di Riwayat 8 Oktober 2026; jawab **P4 SUDAH** atau laporkan temuan. P2 & P3 juga masih menunggu konfirmasi tertulis. Catatan: sejak P5, langkah P4 no. (3) dan (4) berubah — Aktivitas dibuat lewat form bertipe di halaman Aktivitas (bukan Kelola Soal) dan Kuis tidak lagi punya "Susun Sendiri".
4h. ✔ ~~**Pemilik menguji manual P6 (Detail Pengerjaan & Pemantauan Peserta)**~~ — **beres:** "SUDAH" (9 Oktober 2026).
4g. ✔ ~~**Pemilik menguji manual P5f (konten Pertemuan 5 lengkap)**~~ — **beres:** "SUDAH" (9 Oktober 2026).
4f. ✔ ~~**Pemilik menguji manual P5e (konten Pertemuan 4 lengkap)**~~ — **beres:** "SUDAH" (9 Oktober 2026).
4e. ✔ ~~**Pemilik menguji manual P5d (Akses Pertemuan berdasarkan jadwal)**~~ — **beres:** "SUDAH" (9 Oktober 2026).
4d. ✔ ~~**Pemilik menguji manual P5c (Latihan dibuat Pengajar)**~~ — **beres:** "SUDAH" (8 Oktober 2026).
4c. ✔ **beres: "SUDAH" (8 Oktober 2026)** — ~~Pemilik menguji manual P5b (Tugas: ketik / upload file)~~ — checklist di Riwayat 8 Oktober 2026 (P5b); jawab **SUDAH** atau laporkan temuan. Bagian Bank Soal dokumentasi / Soal Dokumentasi pada checklist P5 lanjutan sudah tidak berlaku (dipindah ke Tugas).
4b. ✔ **beres: P5 & P5 lanjutan dikonfirmasi pemilik ("sudah", 8 Oktober 2026)** — ~~Pemilik menguji manual P5 + P5 lanjutan~~ — checklist TEST 1–23 (P5) dan checklist alur berurutan/Bank Soal/Kuis/tahun (P5 lanjutan) di Riwayat 8 Oktober 2026. Catatan: sejak P5 lanjutan, TEST P5 tentang "Kuis hanya Bank Soal" & "Latihan Bank Soal" diganti aturan baru (Kuis dibuat Pengajar; sumber Latihan bernama "Kumpulan Soal"), dan setiap pertemuan kini harus dikerjakan berurutan. Jawab **SUDAH** atau laporkan temuan nomor TEST yang gagal.
5. **Rapikan PERANCANGAN.md** (format code fence, screenshot Stitch, kode HEX Design System, menu Pertemuan) — hanya setelah disetujui pemilik.

---

# VERIFIKASI MILESTONE

## STATUS MILESTONE 1

Status: **HAMPIR TERPENUHI**

Semua bagian utama ada, tetapi screenshot Stitch belum ada, Design System belum memiliki kode warna/ukuran, dan ada masalah format Markdown. Belum dikonfirmasi pemilik.

## STATUS MILESTONE 2

Status: **TERPENUHI** — dikonfirmasi pemilik (7 Oktober 2026): "SUDAH — Milestone 2 terpenuhi."

`layout.html` + semua halaman tersedia, navigasi dan struktur lolos pemeriksaan otomatis, desktop sudah dicocokkan dengan PDF. Tablet/mobile semua halaman sudah diuji Claude (Tahap 6 & 8). ~~Masih menunggu: konfirmasi visual pemilik~~ — **beres.** Repository Git dicatat terpisah sebagai pekerjaan pengumpulan (lihat NEXT ACTION no. 4).

## STATUS MILESTONE 3

Status: **TERPENUHI** — Tahap 1 sampai 8 **selesai dan dikonfirmasi pemilik** (Tahap 2, 6, 7, 8 diverifikasi manual pada 25 September 2026). ~~Yang masih terbuka: tombol Cetak pada halaman Laporan (Rekap Nilai)~~ — **beres** di Tahap 10 Fase 10.

Pengembangan lanjutan **Tahap 10 (interaktivitas semua halaman): SELESAI** — Fase 1–11 (Data Peserta, Data Pengajar, Pertemuan, Modul, Tugas, Kuis, TO PTS, TO PAS, Detail Kelas, Rekap Nilai, Integrasi Dashboard & tombol dekoratif) selesai dan dikonfirmasi pemilik (Fase 11 pada 7 Oktober 2026).

## STATUS PROJECT KESELURUHAN

Status: **HAMPIR TERPENUHI** — Milestone 2 & 3, Tahap 10, dan fitur Login sudah dikerjakan, diuji, dan dikonfirmasi pemilik. ~~Tersisa konfirmasi visual Milestone 2~~ (beres 7 Oktober 2026). Tersisa: unggah ke GitHub (menunggu persetujuan pemilik) dan kekurangan dokumentasi Milestone 1 (PERANCANGAN.md).

---

# RIWAYAT PROGRESS

## 25 September 2026

### Pekerjaan Milestone 2 (sebelum audit)

- Seluruh halaman (`index.html` + 11 halaman di `pages/`) diseragamkan memakai satu kerangka yang sama: sidebar, header, konten, footer.
- `assets/css/style.css` ditulis ulang dengan CSS variables, Flexbox, Grid, dan 4 breakpoint responsif.
- `layout.html` dibuat sebagai template dasar Admin Panel.
- Tampilan disesuaikan dengan `[HIGH FIDELITY] DelLearn — LMS Admin Panel.pdf`: palet warna, tipografi, sidebar, header, ikon SVG (tanpa library), serta isi Dashboard, Data Kelas, Data Peserta, Data Pengajar, dan Rekap Nilai.

### Audit Milestone 1

- Status: Hampir Terpenuhi
- Yang sudah ada: struktur & hierarki menu, ERD Mermaid, User Flow (teks), rancangan halaman, deskripsi Design System, link Figma, link Stitch.
- Yang masih kurang: screenshot Stitch; kode HEX/ukuran pada Design System; menu Pertemuan belum tercantum; format Markdown (` ````markdown ` di baris 1, blok kosong di akhir).
- Belum dapat diverifikasi: apakah link Figma bisa dibuka publik; apakah diagram ERD tampil benar saat dirender.

### Audit Milestone 2

- Status: Hampir Terpenuhi
- Yang sudah ada: `index.html`, `layout.html`, 11 halaman; sidebar/header/konten/footer konsisten; 0 link rusak, 0 `href="#"`, 0 inline style, 0 `!important`, 1 menu aktif per halaman; 44 CSS variable; 4 media query; desktop 1280px tanpa scroll horizontal (4 halaman diukur).
- Yang masih kurang: pemeriksaan tablet & mobile untuk semua halaman; project belum repository Git; data contoh belum konsisten antarhalaman.
- Belum dapat diverifikasi: konfirmasi visual pemilik; kecocokan langsung dengan project Figma (yang dibandingkan adalah PDF ekspornya).
- Next Action: lihat bagian NEXT ACTION.

### Dokumen

- `docs/PROGRESS.md` dibuat. Tidak ada file HTML/CSS/JS yang diubah pada tahap ini.

### Milestone 3 — Tahap 1 (Audit & rencana) — SELESAI

- Status: Selesai (dikonfirmasi pemilik).
- Pemetaan halaman: Dashboard = `index.html`, Data Table = `pages/data-kelas.html`, Form = `pages/form-kelas.html` (baru), Laporan = `pages/rekap-nilai.html`.
- Keputusan: tetap palet PDF High-Fidelity; kelima kelas Aktif; kapasitas 81.0% (85/105); form kelas sebagai halaman baru; data disimpan di `localStorage`.

### Milestone 3 — Tahap 2 (Mock data) — BELUM DIVERIFIKASI → **`[x]` diverifikasi manual pemilik (25 September 2026)**

- Yang dibuat: `assets/js/script.js` berisi mock data tunggal (5 kelas, pilihan mapel/tingkat/status/pengajar, nilai 5 peserta) dan fungsi `getAllKelas`, `getKelasById`, `addKelas`, `updateKelas`, `deleteKelas`, `resetKelas`, `getKelasStats`, `hitungNilaiAkhir`, `getRekapNilai`.
- Hasil uji: `node --check` lolos; 31/31 uji data lolos (tambah, edit, hapus, reset, data tetap ada saat pindah halaman, cadangan bila `localStorage` diblokir, rekap nilai); dimuat di `index.html`, `data-kelas.html`, `rekap-nilai.html` di Edge tanpa error JavaScript.
- Yang masih kurang: data belum ditampilkan di halaman (Tahap 3 & 7). Halaman masih menampilkan angka lama (mis. "Tidak Aktif", 70.8%).
- File lain tidak diubah.

### Milestone 3 — Tahap 3 (Data Table) — SELESAI (dikonfirmasi pemilik)

- File diubah:
  - `assets/js/script.js` — bagian 4 (helper tampilan: `escapeHtml`, `setText`, `iconHtml`, `getInitials`), bagian 5 (`renderKelasRow`, `renderKelasStats`, `renderTable`, `hapusData`, `editData`, `tambahData`, `initDataKelasPage`), bagian 6 (inisialisasi per halaman lewat `<body data-page="...">`).
  - `pages/data-kelas.html` — baris tabel manual dihapus, diganti `<tbody id="kelas-table-body">`; kartu ringkasan & teks "Menampilkan …" diisi JavaScript; `<body data-page="data-kelas">`; tombol Tambah diberi `id="btn-tambah-kelas"`; label kartu "Kapasitas Maksimal" → "Kapasitas Terisi" (karena angkanya = persentase kursi terisi).
  - `assets/css/style.css` — 1 aturan baru `.table-empty` (pesan saat tabel kosong).
- Berhasil: tabel menampilkan 5 kelas dari mock data (semua Aktif); kartu ringkasan 5 kelas aktif / 85 peserta / Kelas 8 / 81.0%; tombol Edit membawa `data-id` yang benar (1–5); Hapus memakai `confirm()` → `deleteKelas()` → `renderTable()`; teks berisi tag HTML ditampilkan aman sebagai teks.
- Hasil uji:
  - `node --check` lolos; uji data Tahap 2 tetap 31/31 lolos.
  - Uji browser (Edge) 21/21 lolos: data awal 5 baris; kapasitas 105 & 4 pengajar; Hapus + Batal tidak menghapus; Hapus IPA + OK → 4 baris, localStorage 4 kelas, kartu & footer ikut berubah (66 peserta); **setelah browser ditutup dan dibuka lagi, IPA tetap terhapus**; `resetKelas()` → kembali 5 kelas / 85 peserta / 81.0%.
  - 13 halaman dimuat tanpa error JavaScript; cek link & struktur HTML lolos.
  - Screenshot halaman asli: desktop 1280px, tablet 820px, mobile 500px — desain tetap, tabel bisa digeser horizontal di layar kecil.
- Yang belum: tombol Edit & Tambah belum membuka form (Tahap 4); tombol Reset Data tidak ada di halaman (sesuai instruksi, tidak ditambahkan — reset lewat Console `resetKelas()`); pencarian & filter di atas tabel belum berfungsi (tidak termasuk Tahap 3); layar HP < 500px belum dapat diuji (batas lebar browser headless).
- Konfirmasi: pemilik menyatakan Tahap 3 **SUDAH** (dicatat saat memulai Tahap 4).

### Milestone 3 — Tahap 4 (Form Tambah & Edit Kelas) — SELESAI (dikonfirmasi pemilik)

- File dibuat: `pages/form-kelas.html` — layout Admin Panel yang sama (menu Kelas aktif), breadcrumb, 8 kolom (Nama Kelas, Mata Pelajaran, Tingkat, Pengajar, Status, Jumlah Peserta, Kapasitas, Keterangan), tombol Batal & Simpan, tempat pesan error di bawah setiap kolom.
- File diubah:
  - `assets/js/script.js` — bagian 6 baru: `validateKelas()`, `readKelasForm()`, `showFieldError()`, `showFormErrors()`, `fillSelect()`, `initFormKelasPage()`, pesan sekali tampil (`setFlash()` / `showFlash()`, disimpan di `sessionStorage`). Tombol Edit di tabel kini link `form-kelas.html?id=N`; kerangka `editData()` / `tambahData()` dari Tahap 3 dihapus karena digantikan link. Fungsi Hapus tidak diubah.
  - `pages/data-kelas.html` — tombol "Tambah Kelas" kini link ke `form-kelas.html`; tempat pesan berhasil (`#flash-message`).
  - `assets/css/style.css` — `.required`, `.form-error`, `.form-control.is-invalid`, `.alert` (`-success`, `-error`), `.alert[hidden]`, `.badge[hidden]`.
- Cara kerja:
  - Tanpa `?id=` → mode **Tambah** (judul "Tambah Kelas", form kosong) → `addKelas()`; ID & kode dibuat otomatis.
  - Dengan `?id=N` → mode **Edit** (judul "Edit Kelas", form terisi dari `getKelasById()`, badge kode) → `updateKelas()`; ID tetap. Kode mengikuti aturan fungsi yang sudah ada: kode dihitung ulang dari mapel + tingkat, jadi hanya berubah bila mapel/tingkat diubah.
  - ID tidak ada (mis. `?id=999`) → pesan "tidak ditemukan", form disembunyikan.
  - Setelah Simpan → kembali ke Data Kelas dengan pesan berhasil. Batal → kembali tanpa menyimpan.
- Validasi: 7 kolom wajib (Keterangan opsional); peserta & kapasitas bilangan bulat; peserta ≥ 0; kapasitas > 0; "Jumlah peserta tidak boleh melebihi kapasitas."; nama kelas tidak boleh kembar. Error tampil di bawah kolom + border merah, kursor pindah ke kolom error pertama, error hilang saat kolom diperbaiki.
- Hasil uji:
  - `node --check` lolos; uji data Tahap 2 31/31; uji aturan validasi 16/16.
  - Uji alur di browser Edge 45/45 lolos (termasuk perpindahan halaman sungguhan): Tambah (kelas ke-6 muncul, id 6 / kode M7, pesan berhasil, kartu 97 peserta); Edit id 2 (form terisi 8 kolom, peserta 18→19, ID tetap, tanpa data ganda); Batal (tidak ada perubahan); **browser ditutup lalu dibuka lagi → hasil tambah & edit tetap ada**; Validasi (kosong, 30 > 20, kapasitas 0, nama kembar → data tidak tersimpan); ID tidak ada; Hapus Tahap 3 tetap bekerja.
  - Screenshot: form Tambah & Edit (1280px), keadaan error (1280px & 500px), Edit (820px), pesan berhasil di Data Kelas.
  - 14 halaman dimuat tanpa error JavaScript; cek link & struktur HTML lolos.
- Temuan & perbaikan: badge "Kode" yang seharusnya tersembunyi sempat tampil sebagai garis kecil di mode Tambah (gaya `.badge` mengalahkan atribut `hidden`) → diperbaiki dengan `.badge[hidden] { display: none; }` dan dicek ulang lewat screenshot.
- Yang belum: modal Hapus (Tahap 5), sidebar toggle (Tahap 6), chart (Tahap 7), pencarian & filter tabel; layar HP < 500px belum dapat diuji.
- **Verifikasi pemilik (25 September 2026):** pemilik project menguji sendiri Tambah Kelas, Edit Kelas, validasi form, tombol Batal, penyimpanan localStorage, refresh halaman, serta tampilan responsive desktop/tablet/mobile, lalu menyatakan **"SUDAH, semua pengujian Tahap 4 berhasil."** Status Tahap 4 diubah menjadi `[x]`.

### Milestone 3 — Tahap 5 (Modal Konfirmasi Hapus)

Status: `[x]` **Selesai** — dikonfirmasi pemilik project (dicatat saat memulai Tahap 6). Hasil pengujian di bawah tidak diubah.

- Modal konfirmasi custom sudah dibuat dan **`confirm()` sudah diganti** — pencarian di seluruh file JS/HTML project: 0 pemakaian `confirm(`. Fungsi `deleteKelas()` tetap dipakai.
- File diubah:
  - `pages/data-kelas.html` — markup modal `#modal-hapus` (ikon, judul "Hapus Data Kelas?", nama kelas, catatan "Data yang dihapus tidak dapat dikembalikan.", tombol X, Batal, Hapus).
  - `assets/js/script.js` — `hapusData(id)` kini membuka modal (menyimpan ID kelas yang dipilih); fungsi baru `tutupModalHapus()`, `konfirmasiHapus()`, `initModalHapus()`; setelah hapus muncul pesan "Kelas … berhasil dihapus." di kotak pesan yang sudah ada.
  - `assets/css/style.css` — ikon `.i-x`, `.modal-overlay`, `.modal`, `.modal-header`, `.modal-icon`, `.modal-title`, `.modal-text`, `.modal-note`, `.modal-actions`, `body.modal-open`; di layar ≤ 576px tombol modal melebar sama besar.
- Tombol **Batal**, tombol **X**, tombol **Escape**, dan klik area gelap → modal tertutup, data tidak berubah. Tombol **Hapus** (merah, gaya danger) → `deleteKelas(id)` → localStorage → tabel & kartu statistik dirender ulang → modal tertutup.
- **Nama kelas dinamis**: diambil dari data berdasarkan ID (bukan posisi baris).
- Hasil uji:
  - `node --check` lolos; uji data 31/31; uji validasi 16/16.
  - Uji modal di browser Edge 28/28 lolos: 5 kelas awal; modal muncul dengan nama "Matematika SMP Kelas 8"; Batal → tetap 5; Hapus IPA → modal menyebut "IPA SMP Kelas 8"; X, Escape, dan klik luar menutup tanpa menghapus; Hapus di modal → 4 kelas, localStorage 4, kartu 4 aktif / 66 peserta, pesan berhasil; menekan Hapus lagi setelah modal tertutup tidak menghapus data lain; setelah baris bergeser modal tetap memakai ID yang benar; `confirm()` tidak dipanggil; **browser ditutup & dibuka lagi → IPA tetap terhapus**; `resetKelas()` → kembali 5 kelas.
  - Uji regresi Tahap 3–4 di browser 46/46 lolos (Tambah, Edit, Batal, refresh, Validasi, ID tidak ada, Hapus lewat modal).
  - Screenshot modal: desktop 1280px, tablet 820px, mobile 500px — modal di tengah, tidak keluar layar.
  - 14 halaman dimuat tanpa error JavaScript; cek link & struktur HTML lolos.
- Yang belum: fokus keyboard belum "dikunci" di dalam modal (tombol Tab masih bisa berpindah ke halaman di belakang) — tidak diminta dan sengaja tidak dibuat agar tetap sederhana; layar HP < 500px belum dapat diuji.
- **Konfirmasi pemilik:** Tahap 5 dinyatakan selesai (dicatat saat memulai Tahap 6).

### Kendala: Windows Defender Controlled Folder Access

- Saat Tahap 6, Controlled Folder Access (perlindungan ransomware) mulai memblokir `claude.exe` menulis ke folder project (log Defender, Event ID 1123, 18.47.18). Pekerjaan dihentikan dengan 7 dari 14 halaman sudah berisi tombol menu. Setelah pemilik mengizinkan aplikasi, pekerjaan dilanjutkan dari kondisi tersebut tanpa mengulang perubahan yang sudah berhasil.

### Milestone 3 — Tahap 6 (Sidebar Toggle) — `[x]*` diuji Claude, belum diverifikasi pemilik → **`[x]` diverifikasi manual pemilik (25 September 2026)**

- File diubah: `assets/css/style.css` (ikon `.i-menu`; `.header .menu-toggle`; `.sidebar-backdrop`; di ≤ 992px sidebar menjadi laci `position: fixed` selebar `min(280px, 85vw)` dengan animasi geser; aturan lama "sidebar jadi menu horizontal" di ≤ 768px dihapus), `assets/js/script.js` (bagian 7: `setSidebarOpen()`, `initSidebarToggle()` — satu mekanisme untuk semua halaman), dan **14 file HTML** (tombol menu `.menu-toggle` di header dengan `aria-controls`/`aria-expanded`, `id="sidebar"`, `<div class="sidebar-backdrop" hidden>`). Kerangka sidebar + header di 14 halaman identik (dicek otomatis).
- Bug ditemukan & diperbaiki: (1) tombol menu ikut tampil di desktop karena `.menu-toggle { display: none }` kalah oleh `.icon-btn` → selector dipertegas `.header .menu-toggle`; (2) fokus keyboard tidak pindah ke sidebar saat dibuka karena sidebar masih `visibility: hidden` selama animasi → `visibility` langsung terlihat saat membuka dan disembunyikan setelah animasi saat menutup.
- Hasil uji: `node --check` lolos; **882/882** uji sidebar (14 halaman × 1280/820/500/375px: tombol hanya tampil di ≤ 992px, sidebar desktop 240px & konten tidak tertutup, sidebar tersembunyi saat awal di tablet/mobile, klik menu membuka + backdrop + `aria-expanded`, fokus pindah ke menu aktif, klik backdrop menutup, Escape menutup & fokus kembali ke tombol, klik menu kedua kali menutup, tanpa overflow horizontal, tepat 1 menu aktif); regresi Tahap 3–5 **74/74**; 14 halaman tanpa error JS; cek link lolos. Lebar 375px diuji dengan memuat halaman asli di dalam iframe selebar 375px.

### Milestone 3 — Tahap 7 (Dashboard + Chart.js) — `[x]*` diuji Claude, belum diverifikasi pemilik → **`[x]` diverifikasi manual pemilik (25 September 2026)**

- File diubah: `index.html` (`<body data-page="dashboard">`; 4 kartu statistik — Kelas Terdaftar, Tenaga Pendidik, Siswa Aktif, **Kapasitas Peserta** — angkanya diisi JavaScript; tabel Kelas Aktif dirender dari data; kartu grafik baru; Chart.js 4.4.1 dari CDN dengan `integrity` SHA-384), `assets/js/script.js` (bagian 8: `renderDashboard()`, `renderDashboardRow()`, `renderDashboardChart()`, `labelSingkat()`), `assets/css/style.css` (`.chart-box`; grid dashboard kolom kiri berisi tabel + grafik).
- Semua angka dari `getAllKelas()` / `getKelasStats()` (tanpa dataset kedua): 5 kelas, 100% aktif, 4 pengajar, rasio 1:21, 85 peserta, rata-rata 17/kelas, kapasitas **81.0% (85 dari 105 kursi)**. Grafik batang horizontal "Peserta vs Kapasitas per Kelas". Bila Chart.js tidak termuat (offline), grafik diganti pesan dan halaman tetap berjalan.
- Bug ditemukan & diperbaiki: label "Bahasa Indonesia 9" terpotong di tepi kiri grafik pada pemuatan pertama (lebar label dihitung sebelum font Inter termuat) → font dimuat eksplisit lalu grafik diperbarui + ruang cadangan sumbu Y. Dicek ulang lewat screenshot 375px & 820px. Catatan: pemeriksaan otomatis lebar label ternyata tidak dapat mendeteksi bug ini (font sudah ter-cache), sehingga bukti perbaikannya adalah screenshot.
- Hasil uji: **127/127** uji dashboard (4 lebar layar; grafik tidak keluar wadah; kartu tidak bertabrakan; tanpa overflow; perubahan Tambah / Edit status / Hapus / `resetKelas()` langsung terbaca Dashboard setelah refresh; sidebar dashboard); uji halaman asli dengan **Chart.js dari CDN + integrity** lolos; uji **tanpa internet** lolos (tanpa error, pesan pengganti tampil).

### Milestone 3 — Tahap 8 (Final Testing) — `[x]*` diuji Claude, belum diverifikasi pemilik → **`[x]` diverifikasi manual pemilik (25 September 2026)**

- Struktur: 19/19 file & folder wajib ada; tidak ada file uji tertinggal di project (semua alat uji di folder sementara).
- JavaScript: `node --check` lolos; uji data 31/31; uji validasi 16/16; **14 halaman tanpa error JS** (Dashboard: Chart.js termuat, grafik terbentuk).
- Link: semua link internal & path CSS/JS benar; 0 `href="#"`; link eksternal hanya Chart.js (CDN) dan Google Fonts; tepat 1 menu aktif per halaman (`layout.html` 0, disengaja sebagai template).
- Fungsional: Tahap 3–4 (Tambah, Edit, Validasi, Batal, refresh, ID tidak ada, Hapus lewat modal) 46/46; Tahap 5 (modal: Batal, X, Escape, backdrop, Hapus, refresh, reset) 28/28; sidebar 882/882; dashboard 127/127 + uji CDN.
- Responsive & visual: 14 halaman × 1280/820/500/375px tanpa overflow; screenshot 375px Rekap Nilai, Data Pengajar, Form Kelas (keadaan error), modal Hapus, Dashboard; 820px Dashboard & Rekap (sidebar terbuka).
- Konsistensi data — **2 bug diperbaiki:** `pages/data-peserta.html` "Kelas Bimbel Berjalan" 12 → 5; `pages/detail-kelas.html` peserta/nilai lama (Alya Putri, 86.0 / 88.4) → Budi Santoso 85.0 & Siti Aminah 90.1 sesuai Rekap Nilai. Nama kelas di semua halaman cocok dengan 5 kelas mock data.
- Masalah tersisa dari pengujian: **tidak ada.** Hal di luar lingkup tahapan yang masih terbuka: tombol Cetak di Rekap Nilai; tombol dekoratif pada halaman statis (mis. Ekspor CSV, Semester Ganjil, Tambah Kegiatan, filter & pencarian, paginasi, Edit/Hapus di halaman Peserta/Pengajar/Modul/Tugas/Kuis/TO) belum memiliki fungsi; fokus keyboard belum dikunci di dalam modal/sidebar; layar di bawah 375px tidak diuji.

### Verifikasi manual pemilik — Tahap 6, 7, dan 8

- Pada **25 September 2026**, pemilik project melakukan verifikasi manual di browser terhadap **Tahap 6 (Sidebar Toggle)**, **Tahap 7 (Dashboard + Chart.js)**, dan **Tahap 8 (Final Testing)**, lalu menyatakan **ketiganya berhasil**.
- Status Tahap 6, 7, 8 diubah dari `[x]*` (diuji Claude) menjadi `[x]` (selesai & diverifikasi pemilik), begitu juga item checklist Dashboard, Chart, Sidebar Toggle, DOM Manipulation, Responsive Testing, dan JavaScript Testing.
- Tidak ada perubahan kode HTML/CSS/JS pada pencatatan ini. Hasil pengujian yang sudah tercatat tidak diubah.
- Masih terbuka: konfirmasi Tahap 2 (mock data), konfirmasi visual Milestone 2, tombol Cetak di Rekap Nilai, dan unggah ke GitHub.

### Verifikasi manual pemilik — Tahap 2 (Mock data)

- Pada **25 September 2026**, pemilik project melakukan verifikasi manual di browser terhadap **Tahap 2 (Mock data)** dan menyatakannya **BERHASIL dan SELESAI**. Yang diuji pemilik:
  - `getAllKelas()` menampilkan 5 data kelas;
  - `getKelasStats()` menampilkan statistik dari mock data;
  - setelah satu kelas dihapus, data berubah dari 5 menjadi 4 kelas;
  - setelah halaman di-refresh, kelas yang dihapus tetap terhapus (tersimpan di `localStorage`);
  - `resetKelas()` mengembalikan data ke kondisi awal, dan setelah refresh data kembali menjadi 5 kelas.
- Status Tahap 2 diubah dari `[?]` menjadi `[x]`, begitu juga item checklist Mock Data.
- Tidak ada perubahan kode HTML/CSS/JS pada pencatatan ini. Hasil pengujian yang sudah tercatat tidak diubah.
- Masih terbuka: konfirmasi visual Milestone 2, tombol Cetak di Rekap Nilai, dan unggah ke GitHub.

## 28 September – 2 Oktober 2026 — Tahap 10 (Interaktivitas Semua Halaman)

### Audit awal (28 September 2026)

- Hasil audit: hanya Dashboard, Data Kelas, dan Form Kelas yang interaktif; 10 halaman lain statis (tabel ditulis tetap, tombol tanpa fungsi). Ditemukan konflik data: jumlah peserta kelas diketik manual (85) sedangkan data peserta hanya 6 baris; pengajar hanya teks nama; nilai hanya untuk 5 peserta Matematika.
- Pemilik memilih keputusan 1a, 2a, 3a (lihat bagian Tahap 10 di atas).

### Fase 1 — Data Peserta → `[x]` dikonfirmasi pemilik (28 September 2026)

- File diubah: `assets/js/script.js` (mock 85 peserta; bagian 2A koleksi data + relasi + `resetSemuaData()`; bagian 4A komponen umum: pesan, modal hapus/detail, paginasi, ekspor CSV; bagian 6A halaman Data Peserta; jumlah peserta kelas dihitung), `pages/data-peserta.html` (isi `<main>` + modal), `pages/form-kelas.html` (Jumlah Peserta readonly), `pages/data-kelas.html` (teks dampak di modal hapus), `assets/css/style.css` (ikon modal detail, kolom readonly, jarak scroll).
- Fitur: daftar 85 peserta (ID/NIS unik, nama unik, email unik), Tambah/Edit/Hapus/Detail, validasi (nama, email unik, kelas wajib, kelas penuh ditolak), cari + filter kelas/status, paginasi 10 baris, Ekspor CSV sesuai filter, `?kelas=N`. Hapus kelas → peserta menjadi "Belum ada kelas".
- Hasil uji: Node 58/58; browser Data Peserta 113/113 (termasuk 1280/820/500/375px); regresi Tahap 3–4 53/53, Tahap 5 29/29, sidebar 882/882, dashboard 127/127; 14 halaman tanpa error JS.

### Fase 2 — Data Pengajar → `[x]` dikonfirmasi pemilik (2 Oktober 2026)

- File diubah: `assets/js/script.js` (data 4 pengajar, kelas → `pengajarId`, CRUD & validasi pengajar, bagian 6B halaman Data Pengajar, kartu Tenaga Pendidik di Dashboard), `pages/data-pengajar.html` (isi `<main>` + modal), `index.html` (badge status pengajar diberi `id`), `assets/css/style.css` (tautan di teks petunjuk).
- Fitur: Tambah/Edit/Hapus/Detail, validasi (nama & email & NIP unik), cari + filter mapel/status, Ekspor CSV; kelas diampu dihitung dari Data Kelas; statistik, donut komposisi mapel, kartu Penugasan Kelas, dan Tindakan Cepat dihitung dari data. Pengajar yang masih mengampu kelas tidak dapat dihapus/dinonaktifkan. Nama pengajar yang diedit langsung tampil di Data Kelas, Dashboard, dan detail peserta.
- Bug ditemukan & diperbaiki: tabel 8 kolom membuat nama terlipat dan tombol aksi terdorong keluar di 1280px → kembali 7 kolom (mapel di bawah nama).
- Hasil uji: Node 34/34; browser Data Pengajar 85/85; regresi Fase 1, Tahap 3–5, sidebar 882/882, dashboard 133/133; 14 halaman tanpa error JS.

### Fase 3 — Pertemuan → `[x]` dikonfirmasi pemilik (2 Oktober 2026)

- File diubah: `assets/js/script.js` (60 pertemuan awal, CRUD & validasi, bagian 6C halaman Pertemuan, pertemuan ikut terhapus saat kelas dihapus), `pages/pertemuan.html` (isi `<main>` + modal), `assets/css/style.css` (chip komponen siap, kotak centang, baris aksi boleh turun baris di layar kecil).
- Fitur: daftar per kelas dengan urutan Pertemuan 1–6 → TO PTS → Pertemuan 7–12 → TO PAS (TO = event khusus, tautan ke halaman TO); komponen Pretest/Modul/Aktivitas/Latihan Soal/Kuis; Tambah/Edit/Hapus/Detail; validasi (nomor unik per kelas, topik, tanggal valid, status Selesai wajib 5 komponen); tombol Kembali ke Detail Kelas; `?kelas=N` dan `?id=N`.
- Bug ditemukan & diperbaiki: di 375px baris aksi pertemuan terpotong → baris aksi boleh turun baris.
- Hasil uji: Node 31/31; browser Pertemuan 65/65; regresi Fase 1–2, Tahap 3–5, sidebar, dashboard lolos; 14 halaman tanpa error JS.

### Fase 4 — Modul → `[x]` dikonfirmasi pemilik (2 Oktober 2026)

- File diubah: `assets/js/script.js` (16 modul awal, CRUD & validasi, bagian 6D halaman Modul, relasi pertemuan → modul, modul terkait di detail pertemuan), `pages/modul.html` (isi `<main>` + modal), `assets/css/style.css` (isian form tersembunyi, pratinjau isi materi).
- Fitur: Tambah/Edit/Hapus/Detail; format **Tulis Materi** (editor teks) atau **Upload PDF** (simulasi — hanya nama & ukuran file yang dicatat, tidak diunggah ke server, maks. 10 MB, harus .pdf); cari + filter kelas/format/status; paginasi; `?kelas=N` dan `?id=N`. Hapus kelas → modul ikut dihapus; hapus pertemuan → modul **dilepas** ("Tanpa pertemuan"), bukan dihapus.
- Tidak dibuat: tambah gambar pada Tulis Materi (berisiko menghabiskan kapasitas localStorage); format lama "Teks + Gambar" tidak dipakai.
- Hasil uji: Node 31/31; browser Modul 74/74; regresi Fase 1–3 (Node & browser), Tahap 3–5, sidebar 882/882, dashboard 133/133; 14 halaman tanpa error JS.
- **Konfirmasi pemilik (2 Oktober 2026):** "FASE 4 SUDAH. Semua pengujian manual Fase 4 berhasil dan sesuai."

### Fase 5 — Tugas → `[x]` dikonfirmasi pemilik (2 Oktober 2026)

- File diubah: `assets/js/script.js` (15 tugas awal, CRUD & validasi tugas, bagian 6E halaman Tugas, relasi kelas/pertemuan → tugas, tugas terkait di detail pertemuan, helper `saatNilaiBerubah()`, fungsi `renderOpsiPertemuan()` dipakai bersama Modul/Tugas), `pages/tugas.html` (isi `<main>` + modal).
- Fitur: Tambah/Edit/Hapus/Detail; kolom Judul, Kelas/Mata Pelajaran, Pertemuan, Deskripsi, Deadline (tanggal + jam WIB), Status (Draft/Aktif/Ditutup); validasi (judul unik per kelas, pertemuan harus milik kelas, deskripsi 10–500, deadline lengkap dan **tidak boleh sebelum tanggal pertemuan — hari yang sama boleh**); deadline otomatis 6 hari setelah pertemuan; petunjuk "Tanggal pertemuan: …" di bawah kolom Deadline; cari + filter kelas/status; paginasi; `?kelas=N` & `?id=N`. Hapus kelas → tugas ikut dihapus; hapus pertemuan → tugas dilepas ("Tanpa pertemuan"). Tidak ada fitur pengumpulan file siswa.
- Laporan pemilik saat uji manual & tindak lanjut:
  1. Deadline 02/09/2024 untuk Pertemuan 1 tersimpan → **bukan bug**: Pertemuan 1 Matematika bertanggal 2 September 2024 (hari yang sama diperbolehkan). Pemilik memilih aturan tetap (hari yang sama boleh) + **petunjuk tanggal pertemuan** di bawah kolom Deadline.
  2. Petunjuk tanggal tidak berubah saat Pertemuan 1 → Pertemuan 2 → **bug, diperbaiki**: dropdown hanya bereaksi pada event `change`, padahal browser/cara memilih tertentu hanya mengirim `input`. Semua dropdown (Kelas & Pertemuan di form Tugas, Kelas di form Modul & Pertemuan, filter di Peserta/Pengajar/Pertemuan/Modul/Tugas) kini memakai `saatNilaiBerubah()` (mendengarkan `input` dan `change`, aksi dijalankan sekali per pilihan).
- Hasil uji: Node 27/27; browser Tugas 67/67; uji Edit deadline + petunjuk 17/17; reproduksi bug petunjuk 21/21; regresi Fase 1–4 (Node & browser), Tahap 3–5, sidebar 882/882, dashboard 133/133; 14 halaman tanpa error JS; screenshot Pertemuan 1 → 2 (petunjuk berubah 2 → 9 September 2024).
- **Konfirmasi pemilik (2 Oktober 2026):** "FASE 5 SUDAH. Semua pengujian manual Fase 5 berhasil dan sesuai."

### Fase 6 — Kuis → `[x]` dikonfirmasi pemilik (2 Oktober 2026)

- File diubah: `assets/js/script.js` (15 kuis awal, CRUD & validasi kuis, helper `cekBilanganBulat()`, bagian 6F halaman Kuis, relasi kelas/pertemuan → kuis, kuis terkait di detail pertemuan), `pages/kuis.html` (isi `<main>` + modal).
- Fitur: Tambah/Edit/Hapus/Detail; Judul, Kelas, **Mata Pelajaran (otomatis dari kelas, tidak disimpan ganda)**, Pertemuan, Jumlah Soal (1–100), Durasi (5–180 menit), Status (Draft/Aktif/Ditutup); validasi (judul unik per kelas, pertemuan harus milik kelas, angka bulat dalam rentang); cari (judul/kelas/mapel/topik) + filter kelas/status; paginasi; `?kelas=N` & `?id=N`. Hapus kelas → kuis ikut dihapus; hapus pertemuan → kuis dilepas. Bank soal (daftar pertanyaan) tidak dibuat (opsional).
- Hasil uji: Node 25/25; browser Kuis 68/68 (termasuk ganti kelas dengan event `input` saja); regresi Fase 1–5 (Node & browser), Tahap 3–5, sidebar 882/882, dashboard 133/133; 14 halaman tanpa error JS.
- **Konfirmasi pemilik (2 Oktober 2026):** "FASE 6 SUDAH. Semua pengujian manual Fase 6 berhasil dan sesuai."

### Fase 7 — TO PTS → `[x]` dikonfirmasi pemilik (6 Oktober 2026)
- File diubah: `assets/js/script.js` (data TO awal 5 PTS + 5 PAS dalam satu koleksi `dellearn.to.v1`, CRUD & validasi TO, bagian 6G halaman Try Out — satu kode untuk PTS & PAS lewat `<body data-jenis>`, jadwal TO di penanda halaman Pertemuan, TO ikut dihapus saat kelas dihapus), `pages/to-pts.html` (isi `<main>` + modal), `assets/css/style.css` (`.btn[hidden]`, baris tabel terpilih `.is-selected`).
- Fitur: TO PTS = Try Out simulasi ujian sekolah (bukan ujian resmi, bukan penentu kelulusan, bukan pertemuan biasa). Tambah/Edit/Hapus/Lihat Detail; Judul, Kelas, Mata Pelajaran (otomatis), Tanggal, Waktu Mulai, Durasi (30–240 menit), Jumlah Soal (10–100), Status (Draft/Terjadwal/Selesai); satu TO PTS per kelas; tanggal tidak boleh sebelum Pertemuan 6 kelas tersebut (hari yang sama boleh) + petunjuk tanggal; kartu Detail & Ketentuan dari data (pengajar, peserta sasaran, cakupan Pertemuan 1–6 dapat diklik); cari + filter; `?kelas=N` & `?id=N`.
- Hasil uji: Node 34/34; browser TO PTS 73/73; regresi Fase 1–6 (Node & browser), Tahap 3–5, sidebar 882/882, dashboard 133/133; 14 halaman tanpa error JS.
- **Konfirmasi pemilik (6 Oktober 2026):** "FASE 7 SUDAH. Semua pengujian manual Fase 7 berhasil dan sesuai."

### Fase 8 — TO PAS → `[x]` dikonfirmasi pemilik (6 Oktober 2026)
- File diubah: `pages/to-pas.html` (isi `<main>` + modal, susunan sama dengan TO PTS, `<body data-page="to-pas" data-jenis="PAS">`), `assets/js/script.js` (pendaftaran halaman `to-pas`; perbaikan `getCakupanTO()`).
- Fitur: sama dengan TO PTS (logika bersama bagian 6G) — 5 TO PAS awal 15 Desember 2024, 120 menit; satu TO PAS per kelas; tanggal tidak boleh sebelum Pertemuan 12 (hari yang sama boleh); kartu Detail (cakupan Pertemuan 1–12) & Ketentuan (120 menit, bobot 30%). Data TO PAS terpisah dari TO PTS.
- Laporan pemilik saat uji manual & tindak lanjut: TO PAS B.Inggris tanggal 30 November 2024 tersimpan walaupun Pertemuan 12 = 3 Desember 2024 → **bug, diperbaiki**: batas TO diambil dari pertemuan bernomor terbesar di kelas, sehingga Pertemuan 13 tambahan (data hasil uji manual) menggeser batas. Kini batas = tanggal paling akhir di antara Pertemuan 1–12 (PAS) / 1–6 (PTS); validasi & petunjuk memakai fungsi yang sama.
- Hasil uji: Node Fase 8 11/11; browser TO PAS 62/62; reproduksi lewat form 14/14 (6 kondisi data); regresi Fase 1–7 (Node & browser), Tahap 3–5, sidebar 882/882, dashboard 133/133; 14 halaman tanpa error JS; screenshot 30 Nov ditolak / 3 Des tersimpan.
- Kendala lingkungan: Windows Defender Controlled Folder Access kembali memblokir penulisan dari terminal (bash/PowerShell) ke folder project; file ditulis lewat editor Claude.
- **Konfirmasi pemilik (6 Oktober 2026):** "FASE 8 SUDAH."

### Fase 9 — Detail Kelas → `[x]` dikonfirmasi pemilik (7 Oktober 2026)
- File diubah: `pages/detail-kelas.html` (seluruh isi dinamis; 4 panel tab; keadaan "Kelas tidak ditemukan"), `assets/js/script.js` (bagian 6H: `renderDetailKelas()`, `initDetailKelasPage()`, `getNilaiKelas()`, `hitungMateriPerPertemuan()`; tombol Kelola di Data Kelas & Dashboard kini membawa `?id=`), `assets/css/style.css` (tab berupa tombol, panel tersembunyi, baris pertemuan yang dapat diklik).
- Fitur: `detail-kelas.html?id=N` — header (nama, mapel, tingkat, pengajar lewat `pengajarId`, peserta dari Data Peserta / kapasitas, jumlah pertemuan, status), tombol Kembali & Edit Kelas; tab Informasi (detail kelas + progress dari status/komponen pertemuan), Pembelajaran (Pertemuan 1–6 → TO PTS → Pertemuan 7–12 → TO PAS; tiap pertemuan: topik, tanggal, status, chip komponen, jumlah modul/tugas/kuis; tautan `pertemuan.html?id=`, `to-pts.html?kelas=`, `to-pas.html?kelas=`, modul/tugas/kuis kelas), Peserta (dari Data Peserta + tautan `data-peserta.html?kelas=`), Nilai (data nilai yang tersedia, dicocokkan lewat NIS; kelas tanpa data nilai menampilkan "Belum ada data nilai"); hash `#peserta` dll.; navigasi tab dengan panah; halaman hanya membaca data.
- Hasil uji: Node 10/10; browser Detail Kelas 86/86 (id berbeda, kelas tidak ditemukan ×3, perubahan peserta/pengajar/pertemuan tercermin, 1280/820/500/375px); regresi Fase 1–8 (Node & browser), Tahap 3–5, sidebar 882/882, dashboard 133/133; 14 halaman tanpa error JS.
- **Konfirmasi pemilik (7 Oktober 2026):** "FASE 9 SUDAH."

### Fase 10 — Rekap Nilai → `[x]` dikonfirmasi pemilik (7 Oktober 2026)
- Keputusan pemilik sebelum mulai: nilai mock untuk 85 peserta (lihat keputusan no. 5).
- File diubah: `assets/js/script.js` (data nilai `NILAI_AWAL` → koleksi `dellearn.nilai.v1`; `getAllNilai()`, `getBarisRekap()`, `getRingkasanRekap()`; bagian 6I halaman Rekap Nilai; hapus peserta → nilainya ikut dihapus; hapus kelas → nilai kelas ikut dihapus; Detail Kelas tab Nilai memakai koleksi nilai), `pages/rekap-nilai.html` (isi dinamis, tombol Kembali/Ekspor CSV/Bobot Komponen/Cetak, modal detail), `pages/detail-kelas.html` (tautan Rekap Nilai per kelas), `assets/css/style.css` (bagian 25: aturan cetak).
- Fitur (laporan, bukan CRUD): filter mata pelajaran → kelas (termasuk Semua Kelas) + cari nama/NIS; 4 kartu ringkasan & baris rata-rata mengikuti filter; Lihat Detail (rincian bobot per komponen); Bobot Komponen (20/20/30/30); **Cetak `window.print()`** (semua baris, tanpa sidebar/filter/tombol/kolom Aksi; juga lewat Ctrl+P); Ekspor CSV (menggantikan ".xlsx"); Kembali → Detail Kelas (tab Nilai) / Dashboard; `?kelas=N`; peserta baru tampil "Belum dinilai". Tanpa status lulus/tidak lulus.
- Bug ditemukan & diperbaiki saat uji: (1) nilai peserta yang pindah kelas dapat hilang permanen setelah peserta lain dihapus; (2) celah helper dropdown `saatNilaiBerubah()` (Fase 5) — pada urutan event tertentu pilihan dapat diabaikan; (3) hasil cetak: halaman 1 hanya berisi kartu ringkasan karena `break-inside: avoid` pada kartu tabel — dicek ulang lewat PDF.
- Hasil uji: Node 20/20; browser Rekap Nilai 65/65; cetak ke PDF (semua baris, tanpa elemen layar); regresi Fase 1–9 (Node & browser), Tahap 3–5, sidebar 882/882, dashboard 133/133; 14 halaman tanpa error JS.
- **Konfirmasi pemilik (7 Oktober 2026):** "FASE 10 SUDAH."

### Fase 11 — Integrasi Dashboard & tombol dekoratif → `[x]` dikonfirmasi pemilik (7 Oktober 2026)
- File diubah: `index.html` (Semester Ganjil jadi informasi, menu Tambah Kegiatan, cari + filter tingkat + paginasi Kelas Aktif, kartu Try Out Mendatang & Distribusi Modul dinamis), `pages/data-kelas.html` (Ekspor CSV, cari, filter tingkat/status, tombol reset, paginasi, pesan ekspor), header notifikasi di `layout.html` + 13 halaman, `assets/js/script.js` (`filterKelas()`, `resetFilterKelas()`, `eksporKelas()`, `renderDashKelasTable()`, `renderTOMendatang()`, `renderDistribusiModul()`, `initMenuKegiatan()`, `initDashboardPage()`; `?aksi=tambah` di Pertemuan & TO), `assets/css/style.css` (`.notif-status`, `.info-chip`, `.menu`/`.menu-list`, `.select-field-sm`, `.status-inline-warning`/`-muted`; `.notif-dot` dihapus).
- Sesuai keputusan 3a: ikon notifikasi & "Semester Ganjil" **bukan tombol lagi** (informasi/status; titik merah palsu dihapus); "Tambah Kegiatan" = pintasan ke form Tambah Pertemuan / TO PTS / TO PAS; Ekspor CSV Data Kelas benar-benar mengunduh (mengikuti cari/filter); tombol ikon filter Dashboard diganti dropdown tingkat; paginasi statis diganti paginasi nyata (10 baris/halaman, sama dengan tabel lain). Kartu TO = TO terdekat yang belum Selesai per jenis (PTS & PAS); kartu Modul dihitung dari koleksi modul.
- Hasil uji: browser Fase 11 132/132 (14 halaman, menu, cari/filter/paginasi, kartu TO & modul berubah mengikuti data, `?aksi=tambah`, ekspor CSV, hapus bersama filter, 1280/820/500/375px); regresi Node Fase 1–10, browser Fase 1–10, Tahap 4–5, sidebar 882/882, dashboard 133/133; 14 halaman tanpa error JS.
- **Konfirmasi pemilik (7 Oktober 2026):** "FASE 11 SUDAH." Dengan ini **Tahap 10 (Fase 1–11) selesai**.

## 7–8 Oktober 2026 — Pemindahan project & Portal Pengajar P4

### Pemindahan lokasi project (7 Oktober 2026)
- Root project baru: `C:\Pemrograman Web 2\LMS-Admin-Panel` (sebelumnya di folder OneDrive). Audit: 32 file HTML, 0 link rusak, tidak ada referensi path OneDrive di HTML/CSS/JS/docs (hanya di daftar izin `.claude/settings*.json`, tidak memengaruhi aplikasi). File `[HIGH FIDELITY] DelLearn — LMS Admin Panel.pdf` tidak ikut terpindah (masih di folder OneDrive lama).

### P4 — Portal Pengajar → `[x]` diverifikasi manual pemilik ("sudah", 8 Oktober 2026)
- Laporan pemilik sebelum mulai: sisi Peserta dapat dibuka/dikerjakan, tetapi Pengajar belum punya form untuk membuat/mengisi konten (Pretest, Aktivitas, Latihan, soal Kuis & TO, pengumpulan & penilaian Tugas).
- **Halaman baru:**
  - `pages/evaluasi.html?jenis=pretest|aktivitas|latihan` — tab Pretest / Aktivitas Interaktif / Latihan Soal; daftar (hanya kelas yang diampu untuk Pengajar), cari + filter kelas/status, paginasi, Tambah/Edit (judul, kelas, pertemuan, durasi, status, instruksi; judul otomatis dari topik), Hapus (hasil peserta ikut dihapus, disebut di modal), Detail, **Kelola Soal**, **Preview**. Validasi: 1 pretest per pertemuan, pertemuan harus milik kelas, Aktif wajib sudah ada soal. Item baru tersimpan sebagai Draft lalu langsung dibuka di Kelola Soal. `?id=N`, `?kelas=N`, `?aksi=tambah&pertemuan=N`.
  - `pages/kelola-soal.html?jenis=…&id=N` — satu editor soal untuk Pretest, Aktivitas, Latihan, Kuis, TO PTS, TO PAS: daftar kartu soal (jawaban benar ditandai, pembahasan), **Tambah / Edit** (modal: tipe, pertanyaan, pilihan A–D wajib & tidak kembar, jawaban benar, pembahasan opsional), **Simpan & Tambah Lagi**, **Hapus** (konfirmasi), **Naik/Turun**, **Preview** (`kerjakan.html` mode pratinjau, tombol kembali ke editor). Soal **Menjodohkan** khusus Aktivitas: 2–6 pasangan, kedua sisi wajib & tidak kembar. Aturan terbit: item Aktif/Terjadwal tidak boleh kehabisan soal (TO minimal 10). Info bila soal masih dari bank & jumlah peserta yang sudah mengerjakan.
  - `pages/pengumpulan-tugas.html?id=N` — semua peserta kelas + status (Perlu dinilai / Dinilai / Belum mengumpulkan / Tidak mengumpulkan bila tugas Ditutup), ringkasan (mengumpulkan, perlu dinilai, dinilai, rata-rata), cari + filter status, modal baca jawaban + unduh lampiran peserta + **Nilai (0–100) & Feedback** (dapat diubah). Nilai langsung masuk Rekap Nilai & Nilai Saya.
- **Halaman yang diubah:** Kuis (pilihan sumber soal: bank soal dengan jumlah soal / susun sendiri; jumlah soal otomatis bila soal sudah disusun; aksi Kelola Soal & Preview), TO PTS/PAS (Kelola Soal & Preview juga untuk Pengajar — jadwal tetap dikelola Admin; jumlah soal otomatis bila sudah disusun), Tugas (lampiran pengajar ≤ 500 KB yang dapat diunduh peserta; aksi Pengumpulan; jumlah pengumpulan per tugas), Modul (gambar pendukung ≤ 500 KB + keterangan; PDF ≤ 1 MB disimpan agar dapat dibuka peserta), Pertemuan (detail menampilkan Pretest/Aktivitas/Latihan terkait + pintasan Tambah), Tugas Saya (unduh lampiran pengajar; lampiran jawaban peserta disimpan ≤ 500 KB), Kerjakan (soal menjodohkan: dropdown pasangan, Periksa, koreksi per pasangan, pembahasan), sidebar Admin (14 file HTML) & menu Pengajar: + Pretest, Aktivitas Interaktif, Latihan Soal.
- **Perilaku yang sengaja berubah:** kuis/TO lama yang soalnya pertama kali diubah disalin dulu dari bank (peserta tetap mendapat soal yang sama); PDF modul baru maksimal 1 MB (sebelumnya hanya nama file dicatat, maks. 10 MB — modul lama tetap valid); lampiran tugas peserta maks. 500 KB (sebelumnya 10 MB, hanya nama); detail kuis/TO menyebut sumber soal; tombol kembali pratinjau membawa `&id=`. File yang dipilih tetapi ditolak (format/ukuran) menahan Simpan sampai diganti/dihapus.
- **Perubahan soal & peserta:** peserta yang mulai mengerjakan setelah perubahan memakai soal terbaru; pengerjaan yang sudah dimulai/selesai tetap memakai salinan soalnya (nilai lama tidak berubah).
- **Pembatasan role:** Peserta tidak dapat membuka Evaluasi/Kelola Soal/Pengumpulan (dialihkan) dan tidak dapat memanggil fungsi kelola soal/penilaian; Pengajar hanya item & tugas di kelas yang diampu (selain itu "tidak ditemukan"); Admin semua kelas.
- **Hasil uji otomatis:** Node P4 **91/91** (model soal & menjodohkan, penilaian jawaban, evaluasi, API Kelola Soal + role, alur peserta, kuis/TO tersusun, tugas: lampiran, pengumpulan, penilaian, modul gambar/PDF, penyimpanan penuh, menu); browser P4 **91/91** (alur Pengajar → Peserta nyata di halaman project, 375/820px, tanpa error JS); semua halaman **54/54** (32 halaman × role, tanpa error JS/alih/scroll horizontal); regresi Node Fase 1–10, Login, P1 lolos; regresi browser P2 79/79, P3 53/53, Login 113/113, Fase 1–11, sidebar 882/882, dashboard 133/133. Ekspektasi uji lama yang berubah karena perubahan sengaja di atas (menu 11 → 14 item, teks sumber soal, PDF 2 MB → 900 KB) diperbarui; 6 uji Node Tahap 2/4 tentang input jumlah peserta tetap usang sejak Tahap 10 (bukan regresi).
- Temuan & perbaikan selama uji: placeholder gambar `data:,` memicu error muat di halaman Modul (dihapus); status "Tidak mengumpulkan" sempat muncul untuk tugas yang masih Aktif (kini hanya bila Ditutup); file ditolak sempat tidak menahan Simpan (diperbaiki); info PDF contoh sempat disebut "hanya nama" padahal dapat dibuka.
- Kendala lingkungan: Edge headless (v154) tidak lagi menghasilkan output; uji browser memakai Chrome headless.
- **Langkah uji manual yang disarankan:** (1) login Pengajar → Pretest → Tambah (Draft) → Kelola Soal: tambah PG & Benar/Salah, coba simpan kosong, edit, naik/turun, hapus, Preview → ubah status Aktif; (2) login Peserta → Pertemuan terkait → kerjakan pretest tersebut; (3) Pengajar → Aktivitas → Kelola Soal → tambah soal Menjodohkan → Preview; Peserta mengerjakan aktivitas; (4) Pengajar → Kuis → Tambah dengan "Susun soal sendiri" → isi soal → Aktif; kuis lama → Kelola Soal (soal bank disalin); (5) Pengajar → TO PTS → Kelola Soal (coba hapus sampai < 10); (6) Pengajar → Tugas → Edit + lampiran → Peserta unduh lampiran & kumpulkan dengan lampiran → Pengajar → Pengumpulan → Nilai + feedback → Peserta → Nilai Saya; (7) Modul: tambah gambar & PDF kecil → Peserta → Baca Modul; (8) coba buka halaman pengelolaan sebagai Peserta & kuis kelas lain sebagai Pengajar; (9) ulangi beberapa halaman di layar HP.

### P5 — Perbaikan & penyempurnaan Portal → `[x]` diverifikasi manual pemilik ("sudah", 8 Oktober 2026)
- **Lingkup dari pemilik (8 Oktober 2026), urutan prioritas:** PDF blank/hitam; Pretest tepat 5 soal; Aktivitas Interaktif benar-benar berbeda dari kuis (8 tipe, form berubah per tipe, 3–5 per pertemuan); variasi tipe per mapel & pertemuan; Latihan dari Bank Soal / Susun Sendiri (target 10, penghitung "x / 10", bank tidak diubah); breadcrumb + riwayat navigasi + tombol Kembali; Budi Santoso → **Seftia Della (Perempuan)**; regresi penuh. Juga: Kuis **tanpa** Susun Sendiri (bawaan 10 soal), TO PTS materi P1–6 30 soal, TO PAS materi P7–12 40 soal, hasil (nilai, benar, salah, persentase, waktu; pembahasan TO setelah selesai), progress 5 langkah per pertemuan, Modul dengan subjudul/contoh/rangkuman/PDF. Tanpa forum/chat/leaderboard; tetap `localStorage`.
- **PDF blank/hitam — penyebab:** PDF disimpan sebagai `data:` URL lalu dibuka di tab/iframe; Chrome/Edge memblokir navigasi ke `data:` dan sebagian file tersimpan tanpa MIME yang benar. **Perbaikan:** Baca Modul merender PDF dengan **PDF.js 3.11.174** (cdnjs + SRI) ke canvas per halaman, toolbar jumlah halaman + **Buka di Tab Baru** & **Unduh** memakai **Blob URL**; tanpa internet → viewer bawaan browser lewat Blob URL; prefix MIME dinormalkan (migrasi + saat upload); upload memeriksa tanda `%PDF` (file rusak/bukan PDF ditolak).
- **Aktivitas Interaktif (pemutar baru `pages/aktivitas.html?id=N`):** 8 tipe — Menjodohkan (`matching`), Seret & Kelompokkan (`drag_drop`), Urutkan (`ordering`), Benar/Salah visual (`true_false`), Pilih Gambar (`image_selection`), Susun Kalimat (`sentence_builder`), Temukan Kesalahan (`find_error`), Tantangan Kilat (`challenge`, bertimer 90 detik, soal PG/BS). Umpan balik langsung (✓ Benar! / ↻ Coba lagi!), Ulangi, Lihat Jawaban, boleh diulang (skor terbaik disimpan). Form Pengajar berubah sesuai tipe (editor baris, unggah gambar ≤ 200 KB, naik/turun urutan aktivitas), maks. 5 per pertemuan, Preview. Alamat lama `kerjakan.html?jenis=aktivitas` dialihkan ke pemutar baru.
- **Variasi tipe (data awal, 4 aktivitas per pertemuan, Pertemuan 1–3 tiap kelas):** Matematika P1 ordering/find_error/matching/challenge, P2 true_false/ordering/challenge/drag_drop, P3 find_error/challenge/matching/drag_drop; B. Inggris P1 sentence_builder/matching/find_error/challenge, P2 matching/ordering/challenge/image_selection, P3 true_false/challenge/drag_drop/sentence_builder; IPA P1 drag_drop/matching/true_false/challenge, P2 image_selection/matching/challenge/ordering, P3 image_selection/challenge/drag_drop/find_error; IPS P1 drag_drop/matching/true_false/challenge, P2 drag_drop/ordering/challenge/image_selection, P3 find_error/challenge/matching/ordering; B. Indonesia P1 ordering/find_error/sentence_builder/challenge, P2 matching/image_selection/challenge/ordering, P3 true_false/challenge/drag_drop/ordering. Pertemuan 4–12 belum diisi (Pengajar menambah sendiri).
- **Latihan:** sumber **Bank Soal** (pilih dari bank mapel per pertemuan; soal disalin, bank asli tidak berubah; tidak dapat edit teks soal bank) atau **Susun Sendiri** (editor soal); target bawaan 10 (5–50), penghitung "Soal: x / target", tidak dapat Aktif sebelum target terpenuhi ("Belum siap diterbitkan: baru X dari Y soal"). Sumber tidak dapat diganti saat edit. **Kuis:** pilihan Susun Sendiri dihapus; Kelola Soal kuis hanya mode Bank Soal.
- **Pretest:** tepat 5 soal (3 PG + 2 B/S pada data awal); soal ke-6 ditolak; tidak dapat Aktif bila < 5.
- **TO:** PTS mengambil bank Pertemuan 1–6 (30 soal), PAS Pertemuan 7–12 (40 soal); soal kembar dari bank dibuang. Hasil menampilkan Nilai, Benar, Salah, Persentase, Waktu pengerjaan + pesan; selama TO tanpa umpan balik, pembahasan setelah selesai.
- **Peserta:** Pertemuan Saya menampilkan 5 langkah (Pretest, Modul, Aktivitas, Latihan, Kuis) ✓/○ + "Progress: x/5 langkah (n%)" + "Pertemuan selesai 🎉"; langkah dihitung dari hasil/progres modul nyata (bukan sekadar membuka halaman). Kelas Saya: "x/5 langkah selesai". Modul: subjudul (`## `), kotak Contoh & Rangkuman.
- **Navigasi:** breadcrumb dinamis (setiap bagian yang punya halaman dapat diklik), riwayat `dellearn.navigation.v1` (sessionStorage, maks. 15, tanpa duplikat berturut-turut, halaman yang dialihkan tidak dicatat), tombol **← Kembali** ke halaman sebelumnya di riwayat atau halaman induk (bukan `history.back()` buta).
- **Seftia Della:** nama peserta demo (NIS/email/password/ID tetap) + isian **Gender** baru di Data Peserta (form, detail, validasi), dashboard Peserta (sapaan + profil NIS & Gender), header, Rekap/Detail Kelas.
- **Perubahan data & migrasi aman (`dellearn.schema.v1` = 2, dijalankan sekali saat halaman dimuat, tanpa menghapus data):** peserta mendapat `gender`; Budi (data awal) → Seftia (nama sesi ikut diperbarui); pretest diisi sampai 5 dari bank atau dijadikan Draft; latihan mendapat `sumber`/`target`, latihan bank dilengkapi 10 soal; aktivitas lama → tipe `challenge` (soal menjodohkan lama → `matching`) + aktivitas bertipe ditambahkan untuk P1–3 (maks. 5); evaluasi mendapat `tipe`/`konten`/`urutan`; soal bank membawa `ref`; TO PTS 40 → 30 bila soalnya belum disusun; prefix PDF modul dinormalkan; modul mendapat `contoh`/`rangkuman`. Kunci baru: `dellearn.schema.v1` (localStorage), `dellearn.navigation.v1` (sessionStorage).
- **File baru:** `pages/aktivitas.html`. **Diubah:** `assets/js/script.js`, `assets/css/style.css`, `pages/baca-modul.html`, `evaluasi.html`, `kelola-soal.html`, `kuis.html`, `pertemuan-saya.html`, `kerjakan.html`, `data-peserta.html`, `dashboard-peserta.html`, `modul.html`.
- **Bug lama ikut diperbaiki:** soal kembar di TO PAS IPS; cakupan TO PAS sebelumnya P1–12.
- **Hasil uji otomatis (8 Oktober 2026):** `node --check` lolos; Node P5 **85/85**, P4 90/90, P1 46/46, Login 28/28, Fase 1–10 lolos; browser P5 **69/69** (8 tipe dibuat & dimainkan, Latihan bank/manual, breadcrumb/riwayat/Kembali, 18 tampilan × 1280/820/500/375 tanpa scroll horizontal & tanpa error JS), P4 81/81, P3 53/53, P2 74/74, Login 113/113, Fase 1–11 lolos, dashboard 133/133, sidebar 882/882; PDF (Chrome, PDF.js nyata) **11/11** (canvas berisi isi, setelah refresh & logout→login, Blob URL); semua halaman **60/60** (33 halaman × role, tanpa error JS/alih/scroll horizontal); cek link 0 rusak. Ekspektasi uji lama yang berubah karena keputusan P5 (nama Budi, pretest 4 → 5, latihan 5 → 10, TO PTS 40 → 30, cakupan PAS, Blob URL, kuis tanpa Susun Sendiri) diperbarui di salinan uji.
- **Belum/keterbatasan:** konten aktivitas contoh hanya P1–3; Latihan & Kuis bawaan memakai kumpulan bank yang sama; PDF.js butuh internet (luring → viewer bawaan); file HIGH FIDELITY PDF masih di folder OneDrive lama. **Checklist uji manual TEST 1–23** diberikan di laporan P5 kepada pemilik.

### P5 lanjutan — Alur belajar berurutan, Bank Soal dokumentasi, Kuis buatan Pengajar, tahun 2026 → `[x]` diverifikasi manual pemilik ("sudah", 8 Oktober 2026)
- **Permintaan pemilik (8 Oktober 2026):** alur wajib berurutan & terkunci (Pretest → Modul → Aktivitas → Latihan → Kuis → Penilaian), status ✓/▶/🔒/○ dengan alasan; Aktivitas yang sudah dikerjakan dibuka sebagai ringkasan (Coba Lagi lewat konfirmasi); Bank Soal = dokumentasi soal (JPG/JPEG/PNG/PDF) dijawab peserta dengan foto tulisan tangan dan dinilai manual oleh Pengajar (tanpa OCR/AI); Kuis dibuat Pengajar dan TIDAK mengambil soal dari Bank Soal (`dellearn.kuis.v2`); semua data demo memakai tahun 2026; migrasi aman.
- **Alur berurutan:** dihitung per pertemuan dari data nyata (hasil & progres modul). Langkah berikutnya 🔒 sampai SEMUA isi langkah sebelumnya (yang tersedia) selesai; langkah tanpa isi dilewati; langkah yang sudah pernah dikerjakan tidak dikunci kembali (data lama aman). Modul selesai hanya lewat tombol **Tandai Modul Selesai** (membuka modul = "Sedang Dikerjakan"). Latihan Soal = latihan + soal dokumentasi pertemuan itu (selesai bila foto jawaban terkirim). Akses URL langsung ke langkah terkunci (baca-modul, aktivitas, kerjakan latihan/kuis, soal-dokumentasi) dialihkan ke langkah yang harus diselesaikan + pesan alasan. Pretest: 1 kali, waktu habis → terkirim otomatis, tanpa Ulangi (sudah ada sejak P2, diuji ulang). Halaman Pertemuan menampilkan 6 kartu langkah (termasuk Penilaian/Hasil) dengan alasan kunci.
- **Aktivitas:** belum pernah → panel **Mulai Aktivitas**; sudah pernah → **Ringkasan** (status, skor terbaik, skor percobaan terakhir, jumlah percobaan, waktu pengerjaan terakhir, waktu terakhir) + **Lihat Hasil** (rincian per butir) + **Coba Lagi** (konfirmasi "Anda akan mengerjakan aktivitas ini kembali. Skor terbaik tetap disimpan."). Skor terbaik tidak pernah turun.
- **Bank Soal (halaman baru `pages/bank-soal.html`, Pengajar mapel yang diampu & Admin):** tab Bank Soal (Tambah/Lihat/Edit/Hapus; nama, mapel, pertemuan 1–12, file JPG/JPEG/PNG/PDF + preview, kunci/jawaban, status) dan tab **Jawaban Peserta** (Peserta | Soal | Jawaban foto | Status | Nilai | Aksi Lihat/Nilai; nilai 0–100 + feedback). Gambar dikompres di browser (canvas → JPEG ≤ 600 KB), PDF ≤ 1 MB & dicek `%PDF`, PDF ditampilkan dengan penampil PDF.js yang sama dengan Baca Modul. Contoh: 1 lembar soal (gambar) Pertemuan 1 tiap mapel.
- **Soal Dokumentasi peserta (halaman baru `pages/soal-dokumentasi.html`):** lihat lembar soal → upload foto jawaban (JPG/PNG, kamera/galeri, dikompres) → preview → **Simpan Jawaban** → "✓ Jawaban berhasil dikirim"; foto boleh diganti sampai dinilai; nilai & feedback tampil setelah dinilai.
- **Kuis:** koleksi `dellearn.kuis.v2` `{ …, deskripsi, jumlahSoal (rencana), soal: [...] }`; tombol **+ Buat Kuis** (judul, kelas, mapel otomatis, pertemuan, deskripsi, durasi, jumlah soal, status) → langsung ke Kelola Soal untuk membuat soal satu per satu (PG A–D/B-S, jawaban benar, penjelasan; tambah/edit/hapus/urutkan). Aktif hanya bila soal = jumlah soal. Lihat/Edit/Hapus kuis. `getSoalKuis` tidak lagi mengambil soal bank. Sumber Latihan "Bank Soal" lama berganti nama **"Kumpulan Soal"** (soal teks bawaan) agar tidak tertukar dengan Bank Soal dokumentasi.
- **Tahun 2026:** Pertemuan 1 = 5 September 2026 (mingguan), TO PTS 23 Oktober 2026, TO PAS 18 Desember 2026, tenggat tugas ikut pertemuan, NIS angkatan 2026 (20260801…), "Semester Ganjil 2026/2027" & "© 2026" di semua halaman (32 HTML). Pencarian 2024/2025 di HTML/CSS/JS: 0 (sisa hanya riwayat di dokumen ini).
- **Migrasi (skema v3, sekali, tanpa menghapus data):** kuis v1 → `dellearn.kuis.v2` (soal kuis lama tanpa soal disalin sekali menjadi milik kuis; v1 tidak dihapus); tanggal pertemuan/tugas/TO/hasil/progres modul dengan tahun < 2026 digeser +733 hari (nama hari tetap); NIS angkatan lama → 2026; hasil aktivitas mendapat skorTerakhir/durasiTerakhir. Koleksi baru: `dellearn.banksoal.v1`; hasil jenis baru `dokumentasi`.
- **Menu:** Pengajar & Admin + "Bank Soal" (Pembelajaran) & "Jawaban Foto Peserta" (Penilaian); sidebar Admin tertulis di 14 HTML ikut diperbarui.
- **File baru:** `pages/bank-soal.html`, `pages/soal-dokumentasi.html`. **Diubah:** `assets/js/script.js`, `assets/css/style.css`, `pages/aktivitas.html`, `pages/kuis.html`, `pages/evaluasi.html`, `pages/kelola-soal.html`, `pages/to-pts.html`, `pages/to-pas.html`, sidebar/tahun di `index.html`, `layout.html` & semua `pages/*.html`, `docs/PROGRESS.md`.
- **Hasil uji otomatis (8 Oktober 2026):** `node --check` lolos; Node baru **P6 99/99** (alur terkunci langkah demi langkah, URL langsung, pretest waktu habis, aktivitas skor terbaik/terakhir, bank soal JPG/PNG/PDF + role, jawaban foto + penilaian, kuis v2 CRUD + soal, tahun, migrasi v3); regresi Node P5 85/85, P4 90/90, P1 46/46, Login 28/28, Fase 1–10 lolos; browser baru **P6 49/49** (Bank Soal UI, upload foto 3000×4000 → 37 KB, Jawaban Peserta Lihat/Nilai, role, 9 tampilan × 1280/820/500/375, tanpa error JS); P5 75/75, P4 84/84, P3 54/54, P2 80/80 (termasuk pengalihan URL terkunci), Login 113/113, Fase 1–11 lolos (Kuis 69/69), dashboard 133/133, sidebar 882/882, PDF 11/11, semua halaman **66/66** (35 HTML × role), cek link 0 rusak. Ekspektasi uji lama yang berubah karena keputusan ini (tanggal/NIS 2026, kuis bukan dari bank, menu bertambah, langkah terkunci) diperbarui di salinan uji.
- **Keterbatasan:** foto/gambar disimpan di localStorage (±5 MB total) — dikompres, tetapi banyak foto besar tetap dapat memenuhi penyimpanan (pesan "Penyimpanan browser penuh" muncul); nilai jawaban foto belum masuk komponen Rekap Nilai (bobot 20/20/30/30 tidak diubah); Tugas tidak termasuk alur terkunci; TO masih memakai kumpulan soal bawaan.

### P5b — Tugas mendukung jawaban Ketik & Upload File; dokumentasi dipindah dari Latihan ke Tugas → `[x]` diverifikasi manual pemilik ("SUDAH", 8 Oktober 2026)
- **Permintaan pemilik (8 Oktober 2026):** dokumentasi soal TIDAK lagi menjadi bagian Latihan Soal / Bank Soal Latihan; soal yang memerlukan jawaban tertulis menjadi bagian **Tugas**. Tugas: soal teks dan/atau dokumentasi (PDF/JPG/JPEG/PNG); metode pengumpulan Ketik Langsung / Upload File / Keduanya; tulisan tangan didukung lewat Upload File (foto/scan/PDF), Word lewat ekspor PDF; Pengajar menilai manual (nilai + feedback). Tugas tetap di luar alur terkunci Pretest → Modul → Aktivitas → Latihan → Kuis.
- **Dihapus/dipindah:** halaman `pages/bank-soal.html` & `pages/soal-dokumentasi.html`, menu "Bank Soal" & "Jawaban Foto Peserta" (Pengajar & Admin, termasuk sidebar tertulis 14 HTML), soal dokumentasi di Latihan Soal & syarat foto jawaban untuk membuka Kuis, fungsi Bank Soal dokumentasi. Latihan kembali hanya berisi latihan yang dikerjakan langsung di sistem (mekanisme latihan tidak diubah).
- **Tugas (Pengajar, `tugas.html`):** form Judul, Deskripsi/Petunjuk, Soal (teks), Dokumentasi Soal (PDF/JPG/JPEG/PNG, maks. 10 MB, preview), Kelas, Pertemuan, Deadline, Status, Metode Pengumpulan (Ketik / Upload / Keduanya). Validasi: minimal soal teks atau dokumentasi, metode wajib, tipe & ukuran file. Daftar menampilkan metode jawaban; Lihat/Edit/Hapus; dokumentasi soal yang diganti/dihapus dibuang dari penyimpanan file.
- **Tugas (Peserta, `tugas-saya.html`):** daftar tugas → Kerjakan Tugas → petunjuk, deadline, metode, soal teks + dokumentasi (gambar/PDF dengan Lihat & Download); Keduanya → pilih Ketik Jawaban / Upload File; area upload sederhana (PDF, JPG, JPEG, PNG, DOCX boleh; maks. 10 MB; tips tulisan tangan & Word); preview file; **Kumpulkan Jawaban**; status "✓ Sudah Dikumpulkan", tanggal, metode, jawaban/file; setelah dinilai: Nilai & Feedback Pengajar (jawaban terkunci). Jawaban boleh diperbarui sampai dinilai.
- **Pengumpulan (Pengajar, `pengumpulan-tugas.html`):** petunjuk + soal + dokumentasi + metode; tabel peserta (status, tanggal, metode, file, nilai) dengan tombol **Periksa** (ada jawaban) / **Lihat** (belum mengumpulkan); modal Periksa: nama, status, tanggal, metode, jawaban ketik, file jawaban (preview gambar/PDF, Lihat, Download), Nilai + Feedback → **Simpan Penilaian**.
- **Penyimpanan:** tugas di `dellearn.tugas.v2` (soal, fileSoal, metode); jawaban tetap di koleksi hasil (jenis `tugas`) agar Rekap Nilai tidak berubah — pemetaan: itemId = taskId, pesertaId = participantId, teks = jawaban ketik, lampiran = file jawaban, dikumpulkan, status, nilai = score, catatan = feedback, **dinilaiOleh** = gradedBy, **dinilaiPada** = gradedAt, **metode**. Isi file (soal & jawaban) disimpan di **IndexedDB** browser (`dellearn.files`), localStorage hanya menyimpan data ringkas (nama, ukuran, tipe, fileId) sehingga file sampai 10 MB tidak memenuhi localStorage; bila IndexedDB tidak tersedia/tidak merespons (batas 4 detik), file ≤ 900 KB disimpan sebagai data URL dan file lebih besar ditolak dengan pesan (aplikasi tidak crash). Lampiran lama (data URL) tetap dapat dibuka.
- **Migrasi v4 (sekali, tanpa menghapus data):** `dellearn.tugas.v1` → v2 (tugas data awal mendapat soal/dokumentasi/metode bawaan; tugas buatan pengajar: deskripsi menjadi soal, lampiran lama menjadi dokumentasi soal, metode Keduanya, tahun 2026); dokumen Bank Soal lama + foto jawaban peserta → Tugas "Tugas Dokumentasi: …" + jawaban tugas (metode upload, nilai/feedback tetap); jawaban tugas lama mendapat metode. `dellearn.tugas.v1` & `dellearn.banksoal.v1` dibiarkan.
- **Data awal 2026:** 15 tugas (Pertemuan 1–3) dengan soal teks; tugas Pertemuan 1 punya dokumentasi soal (lembar soal gambar); metode bervariasi (Keduanya / Ketik / Upload). Contoh soal: "Jelaskan langkah-langkah menyelesaikan persamaan 2x + 5 = 15".
- **Hasil uji otomatis (8 Oktober 2026):** `node --check` lolos; Node baru **P7 Tugas 60/60** (CRUD tugas, soal teks/dokumentasi, metode, validasi tipe & 10 MB, ketik/upload/keduanya, DOCX, penilaian + gradedBy/gradedAt, role, rekap & bobot tetap, Latihan tanpa dokumentasi, Tugas bukan syarat unlock, migrasi v4); browser baru **Tugas 53/53** (waktu nyata, IndexedDB: Pengajar membuat tugas teks/JPG/PDF + preview, Peserta mengetik & mengunggah PNG/PDF/DOCX, file > 10 MB & .exe ditolak, refresh tetap tersimpan, Periksa + preview + Download, nilai & feedback terlihat peserta, role, 1280/820/500/375, tanpa error JS). Regresi: Node P6 69/69, P5 85/85, P4 90/90, P1 46/46, Login 28/28, Fase 1–10 lolos; browser P5 75/75, P4 90/90, P3 54/54, P2 80/80, Login 113/113, Fase 1–11 lolos (Tugas 67/67, Edit Deadline 17/17), dashboard 133/133, sidebar 882/882, PDF 11/11, semua halaman **64/64** (33 HTML × role), cek link 0 rusak, 0 `href="#"`. Ekspektasi uji lama yang berubah karena keputusan ini (dokumentasi di Latihan, menu Bank Soal, form tugas wajib soal + metode, lampiran → dokumentasi soal) diperbarui di salinan uji; uji Bank Soal lama (P6 browser) tidak dipakai lagi.
- **Keterbatasan:** file di IndexedDB terikat pada browser/perangkat yang sama (seperti data localStorage lainnya); DOCX tidak dapat dipratinjau (tersedia Download); nilai tugas memakai mekanisme Rekap Nilai yang ada (rata-rata tugas dinilai, bobot 20%).

### P5c — Latihan Soal dibuat langsung oleh Pengajar (tanpa sumber soal) → `[x]` diverifikasi manual pemilik ("SUDAH", 8 Oktober 2026)
- **Permintaan pemilik (8 Oktober 2026):** Latihan tidak memakai "Sumber Soal" / "Bank Soal" / "Soal Dokumentasi"; Pengajar menambah Latihan lalu langsung menulis soal (Pilihan Ganda A–D + jawaban benar, atau Benar/Salah); satu latihan berisi banyak soal; Edit soal harus berfungsi (sebelumnya soal latihan dari kumpulan soal bawaan tidak dapat diedit); Hapus dengan modal konfirmasi; validasi soal kosong; flow peserta, skor, percobaan ulang & unlock berurutan tetap; Latihan & Tugas terpisah.
- **Perubahan:** isian "Sumber Soal" (Kumpulan Soal / Susun Sendiri) dihapus dari form Latihan, detail & daftar; panel pemilihan Kumpulan/Bank Soal dihapus dari Kelola Soal (fungsi `pilihSoalBank`, `renderBankSoal`, `SUMBER_LATIHAN`, mode `bank` dihapus). Tambah Latihan → "Simpan & Tulis Soal" → Kelola Soal Latihan dengan form Tambah Soal langsung terbuka (Simpan & Tambah Lagi untuk soal berikutnya). Daftar Latihan: tombol **Kelola Soal / Edit Latihan / Hapus**; kartu soal: tipe, pertanyaan, pilihan, **Jawaban: …**, pembahasan, tombol **Edit / Hapus** (+ naik/turun). Modal Edit terisi data soal dengan tombol "Simpan Perubahan"; Hapus memakai modal "Hapus Soal?" (Batal / Hapus).
- **Bug diperbaiki:** soal dengan jawaban benar belum dipilih (`kunci: null`) sempat dianggap jawaban A dan lolos validasi bila dikirim lewat fungsi; kini selalu ditolak ("Pilih jawaban yang benar.").
- **Data & migrasi v5 (sekali, tanpa menghapus data):** latihan tersimpan kehilangan isian `sumber`; soal yang dulu dipilih dari kumpulan soal (punya `ref`) menjadi soal milik latihan sehingga dapat diedit/dihapus. Soal, target (bawaan 10, min. 5), status & hasil peserta tidak berubah. Data awal: 15 latihan × 10 soal milik latihan.
- **Tidak berubah:** Tugas v2 (P5b), Kuis, Pretest, TO; sumber soal TO bawaan tetap internal (bukan bagian Latihan).
- **Hasil uji otomatis (8 Oktober 2026):** Node baru **P8 Latihan 35/35** (tambah latihan, PG & B/S, validasi kosong/PG/BS, edit + ubah tipe, refresh, hapus, modal konfirmasi, data tersimpan, soal data awal dapat diedit, peserta mengerjakan & skor, percobaan ulang, unlock, tanpa sumber/Bank Soal/dokumentasi, migrasi v5, Tugas tetap jalan); browser baru **Latihan 35/35** (alur UI lengkap, refresh, modal hapus, peserta skor 80, unlock, Tugas ketik, 1280/820/500/375, tanpa error JS). Regresi: Node P7 Tugas 60/60, P6 69/69, P5 81/81, P4 90/90, P1 46/46, Login 28/28, Fase 1–10 lolos; browser Tugas 53/53, P5 70/70, P4 90/90, P3 54/54, P2 80/80, Login 113/113, Fase 1–11 lolos, dashboard 133/133, sidebar 882/882, PDF 11/11, semua halaman 64/64, cek link 0 rusak, 0 `href="#"`. Ekspektasi uji lama tentang Latihan bersumber Bank Soal / Susun Sendiri disesuaikan (fitur tidak dikembalikan).

### P5d — Akses Pertemuan otomatis berdasarkan jadwal + override Admin/Pengajar → `[x]` diverifikasi manual pemilik ("SUDAH", 9 Oktober 2026)
- **Permintaan pemilik (8 Oktober 2026):** status akses Pertemuan mengikuti tanggal yang sudah ada (tanpa membuat tanggal baru), tanggal selesai = 1 hari sebelum pertemuan berikutnya; Belum Dimulai → tidak dapat diakses, Berjalan → dapat dikerjakan (alur berurutan tetap), Selesai → read-only (hasil lama terlihat, attempt/submission baru ditolak); Mode Akses Otomatis/Manual dengan Buka Kembali & Kembali ke Otomatis; validasi di logika JS (bukan sekadar menyembunyikan tombol), termasuk URL langsung dan submit dari halaman yang masih terbuka.
- **Keputusan pemilik (jawaban pertanyaan klarifikasi):** (1) durasi maksimal 1 minggu — P6 berakhir 16 Oktober, jeda 17–30 Oktober (TO PTS) tidak memperpanjang P6; pertemuan terakhir juga 1 minggu; (2) saat Selesai, Modul dan soal Tugas tetap **boleh dibaca**; (3) pengerjaan berbatas waktu yang sedang berjalan saat pertemuan ditutup **dibekukan**: jawaban tersimpan tetap ada, jawaban baru & kirim ditolak, dapat dilanjutkan bila dibuka kembali.
- **Model (tanpa sistem status kedua):** isian `status` Pertemuan yang sudah ada dipakai sebagai status override; isian baru `modeAkses` (`otomatis` | `manual`). Status efektif = `modeAkses === 'manual'` ? `status` : dihitung dari `tanggal` + tanggal pertemuan berikutnya dan hari ini. Tanggal, nomor, judul, urutan, 12 pertemuan, TO PTS/PAS tidak diubah. Fungsi: `jadwalPertemuan`, `statusOtomatisPertemuan`, `statusPertemuan`, `aksesPertemuan`, `cekAksesAksiPeserta`, `aturAksesPertemuan`.
- **Penegakan di logika:** `mulaiPengerjaan`, `simpanJawaban`, `selesaikanPengerjaan`, `simpanHasilAktivitas`, `setProgresModul`, `kumpulkanTugas` membaca status TERBARU setiap kali dipanggil. URL langsung: Belum Dimulai → dialihkan ke halaman Pertemuan + pesan; Selesai → halaman dibuka read-only. Admin/Pengajar (pratinjau) tidak dibatasi. TO PTS/PAS (tanpa pertemuan) tidak terpengaruh.
- **Tampilan Pengajar/Admin:** halaman Pertemuan menampilkan rentang jadwal, mode akses, status efektif (+ badge "Override"), tombol **Buka Kembali** / **Buka Lebih Awal** / **Kembali ke Otomatis**; detail menampilkan Tanggal Mulai, Tanggal Selesai, Status Otomatis, Mode Akses, Status Akses Peserta; form punya kolom **Mode Akses** (kolom Status hanya aktif pada mode Manual) + info jadwal. Ringkasan, Detail Kelas, Dashboard Pengajar memakai status efektif.
- **Tampilan Peserta:** banner jadwal di Pertemuan Saya; jadwal & status di Kelas Saya; item bertanda "⏳ Belum Dimulai" / "⏹ Ditutup"; Kerjakan/Aktivitas/Baca Modul/Tugas Saya menyembunyikan tombol mengerjakan/mengirim dan menampilkan alasannya.
- **Data & migrasi v6 (sekali, tanpa menghapus data):** pertemuan tersimpan tanpa `modeAkses` mendapat `modeAkses: 'otomatis'`; tanggal, judul, nomor, status tersimpan tidak berubah. Kunci `localStorage` tetap `dellearn.pertemuan.v1`.
- **Catatan:** status mengikuti tanggal perangkat. Data awal Matematika: pada 3–9 Oktober 2026 P1–P4 Selesai, P5 Berjalan, P6 dst. Belum Dimulai; mulai 10 Oktober P5 Selesai dan P6 Berjalan (sampai 16 Oktober). Pengajar dapat memakai Buka Kembali bila perlu.
- **Hasil uji otomatis (8–9 Oktober 2026):** `node --check` lolos. Node baru **P9 Jadwal 72/72** (TESTING WAJIB 1–12: belum mulai ditolak, periode aktif boleh, setelah selesai attempt/submission baru ditolak, hasil lama terlihat, URL langsung, submit cek status terbaru + pengerjaan dibekukan & dilanjutkan, Buka Kembali, Kembali ke Otomatis, tanggal tidak berubah + migrasi v6, alur berurutan, Tugas di luar alur tetapi submit ikut status, tanpa regresi CRUD/Rekap Nilai). Browser baru **Akses Jadwal 42/42** (tanggal browser disimulasikan 20 September 2026: daftar & detail Pengajar, form Mode Akses, peserta di halaman yang masih terbuka ditolak saat ditutup, Buka Kembali / Kembali ke Otomatis lewat tombol, URL langsung, Modul/Aktivitas read-only, hasil lama terlihat, Tugas, 375px, tanpa error JS). Regresi: total Node 762/762 (f1–f10, Login, P1, P4–P8); browser P2 80/80, P3 54/54, P4 90/90, P5 70/70, Tugas 53/53, Latihan 35/35, Login 113/113, Fase 1–11 lolos (Fase 3 65/65, Fase 9 86/86), dashboard 133/133, sidebar 882/882, PDF 11/11, semua halaman 64/64 (juga pada tanggal nyata), cek link 0 rusak, 0 `href="#"`.
- **Penyesuaian uji lama (fitur tidak diubah):** uji lama yang menguji perilaku saat pertemuan berjalan dijalankan dengan status dipaku "Berjalan" (Node: stub di sandbox; browser: injeksi skrip uji lewat DevTools, aplikasi tidak diubah); uji Fase 3 & 9 dijalankan pada tanggal 20 September 2026 (cocok dengan status data awal) dan memilih Mode Akses Manual sebelum mengubah Status; harapan versi skema 5 → 6.
- **Checklist uji manual pemilik (jawab SUDAH atau laporkan nomor yang gagal):**
  1. Login Pengajar → Pertemuan (Matematika): tiap pertemuan menampilkan "Jadwal … – …", "Mode Akses: Otomatis", dan status sesuai tanggal hari ini; P6 berakhir 16 Oktober, P7 mulai 31 Oktober.
  2. Lihat Detail sebuah pertemuan: Tanggal Mulai, Tanggal Selesai, Status Otomatis, Mode Akses, Status Akses Peserta.
  3. Edit pertemuan: kolom Mode Akses; kolom Status nonaktif pada Otomatis dan aktif pada Manual; simpan tanpa perubahan → tanggal tetap.
  4. Login Peserta (Seftia Della) → Kelas Saya & Pertemuan Saya: banner jadwal; pertemuan Selesai menampilkan "⏹ Ditutup" / hasil lama, pertemuan belum mulai "⏳ Belum Dimulai".
  5. Ketik di address bar `kerjakan.html?jenis=pretest&id=…` untuk pertemuan yang belum dimulai → dialihkan ke halaman Pertemuan dengan pesan.
  6. Pertemuan Selesai: Modul tetap bisa dibaca (Tandai Selesai nonaktif), Aktivitas tanpa tombol Mulai, Tugas tanpa form kirim; hasil/nilai/feedback lama tetap terlihat.
  7. Buka Pretest pertemuan yang sedang Berjalan di satu tab, jawab 1 soal; di tab lain (Pengajar) edit pertemuan itu → Mode Manual, Status Selesai; kembali ke tab peserta, pilih jawaban berikutnya → ditolak, pengerjaan "dibekukan".
  8. Pengajar menekan **Kembali ke Otomatis** → peserta dapat "Lanjutkan Mengerjakan", jawaban lama masih ada, lalu kirim.
  9. Pengajar menekan **Buka Kembali** pada pertemuan yang sudah Selesai → peserta dapat mengerjakan/mengirim lagi (alur Pretest → Modul → … tetap berurutan); tekan **Kembali ke Otomatis** → tertutup lagi.
  10. Tugas pertemuan yang Berjalan dapat dikirim walau Modul belum selesai; Tugas pertemuan Selesai tidak dapat dikirim.
  11. Rekap Nilai, Dashboard, TO PTS/PAS tetap seperti sebelumnya.

## 9 Oktober 2026

### P5e — Data pembelajaran Pertemuan 4 lengkap (kelima kelas) → `[x]` diverifikasi manual pemilik ("SUDAH", 9 Oktober 2026)
- **Permintaan pemilik (9 Oktober 2026):** Pertemuan 4 harus memiliki 6 komponen (Pretest, Modul, Aktivitas Interaktif, Latihan Soal, Tugas, Kuis) yang benar-benar terhubung ke ID Pertemuan 4, berisi konten sesuai mapel, dapat dikerjakan peserta; tanpa duplikat, tanpa reset localStorage, tanpa mengubah tanggal/status/urutan/data lain. Pemilik memilih: **kelima kelas** (bukan hanya Matematika).
- **Audit sebelum perubahan:** di kelima kelas Pertemuan 4 hanya memiliki Pretest (5 soal, Aktif). Matematika juga punya 1 Modul **Draft** berisi kerangka umum (tidak dapat dibuka peserta). Aktivitas, Latihan, Tugas, Kuis: **belum ada** di kelas mana pun. Tidak ditemukan konten P4 dengan relasi/ID yang salah. Komponen siap P4 tercatat 2/5.
- **Yang ditambahkan (per kelas, terhubung ke pertemuanId & kelasId Pertemuan 4):** Modul "Tulis Materi" berisi materi utuh (tujuan, 5–7 subbab, contoh, rangkuman; modul Draft Matematika **dilengkapi & diaktifkan**, bukan diduplikasi); 4 Aktivitas Interaktif (3 aktivitas bertipe sesuai materi + 1 Mini Challenge dari soal bank pertemuan); Latihan Soal 10 soal (dari bank soal Pertemuan 4, pola sama dengan P1–P3); Tugas Aktif (petunjuk + soal teks, metode Ketik atau Upload File, tenggat 6 hari setelah tanggal pertemuan); Kuis Aktif 10 soal **baru** (6 PG + 4 B/S, berbeda dari soal Pretest/Latihan) 20 menit. Pretest yang sudah ada tidak diubah. Komponen siap P4 → 5/5.
  - Matematika (Relasi dan Fungsi) · B. Inggris (Simple Present Tense) · IPA (Usaha dan Pesawat Sederhana) · IPS (Perdagangan Internasional) · B. Indonesia (Teks Tanggapan).
- **Data & migrasi v7 (sekali, tanpa reset, tanpa menghapus data):** fungsi `lengkapiPertemuan4()` hanya menambah komponen yang belum ada (ID baru di akhir koleksi sehingga ID data lain tidak bergeser) dan dipakai untuk data awal maupun data tersimpan. Pertemuan 4 yang topiknya sudah diganti pengguna dilewati; modul P4 yang sudah diedit pengajar tidak ditimpa. Hasil, nilai, jawaban, progres modul, pengumpulan tugas, feedback, tanggal, status, mode akses, & pertemuan lain tidak berubah. Kunci `localStorage` tetap.
- **Catatan akses (aturan P5d):** Pertemuan 4 kelima kelas berlangsung 26 Sep–6 Okt 2026, sehingga per 9 Oktober statusnya **Selesai** (read-only): materi P4 dapat dibaca, tetapi peserta baru dapat mengerjakan Aktivitas/Latihan/Kuis/Tugas P4 bila Pengajar menekan **Buka Kembali** pada pertemuan tersebut.
- **Hasil uji otomatis (9 Oktober 2026):** Node baru **P10 Pertemuan 4 105/105** (audit 6 komponen × 5 kelas, relasi ID, validitas soal & kunci, aktivitas valid & dapat diselesaikan skor 100, soal kuis tidak menggandakan, data lain identik dengan data awal sebelumnya, migrasi v7 tanpa reset + idempoten + tidak menimpa modul yang diedit, alur peserta Pretest → Modul → Aktivitas → Latihan → Kuis + Tugas & penilaian, status Belum Dimulai/Berjalan/Selesai & Buka Kembali); browser baru **Pertemuan 4 39/39** (tanggal disimulasikan 28 Sep 2026: halaman Pengajar 5/5 komponen, detail & Kelola Soal; peserta mengerjakan Pretest, membaca & menandai Modul, memainkan 4 aktivitas, Latihan, Kuis + pembahasan, mengumpulkan Tugas; progress 5/5; Pengajar menilai; read-only saat ditutup; 375px; tanpa error JS). Regresi: Node total 867/867; browser total 2.640/2.640 (P2–P5, Tugas, Latihan, Akses Jadwal 43/43, Login, Fase 1–11, dashboard, sidebar 882/882, PDF 11/11, semua halaman 64/64 juga pada tanggal nyata), cek link 0 rusak, 0 `href="#"`.
- **Penyesuaian uji lama (fitur tidak diubah):** jumlah data awal di uji lama diperbarui (modul 16 → 20 dan semua Aktif, tugas 15 → 20, kuis 15 → 20 / 205 soal, per kelas 3 → 4, aktivitas Matematika 17 → 21, P4 komponen 2/5 → 5/5, skema 6 → 7, halaman tabel terakhir 2 → 3); dua uji yang membutuhkan modul Draft kini membuat modul Draft sendiri.
- **Checklist uji manual pemilik (jawab SUDAH atau laporkan nomor yang gagal):**
  1. Buka aplikasi tanpa reset data: Pertemuan 4 otomatis bertambah komponennya (data lama Anda tetap ada).
  2. Login Pengajar → Pertemuan (setiap kelas): Pertemuan 4 "5/5 komponen siap"; Lihat Detail menampilkan Pretest, 4 Aktivitas, Latihan, Modul, Tugas, Kuis terkait.
  3. Halaman Modul, Tugas, Kuis, Pretest/Aktivitas/Latihan: item Pertemuan 4 tercantum; Kelola Soal Kuis & Latihan P4 menampilkan 10 soal yang dapat diedit.
  4. Pengajar menekan **Buka Kembali** pada Pertemuan 4 Matematika (karena per hari ini P4 sudah Selesai).
  5. Login Peserta (Seftia Della) → Kelas Saya → Pertemuan 4: tampil 6 kelompok komponen.
  6. Kerjakan Pretest (5 soal) → Modul terbuka; baca Modul (subbab, contoh, rangkuman) → Tandai Modul Selesai.
  7. Mainkan keempat Aktivitas (Kelompokkan, Menjodohkan, Cari Kesalahan, Tantangan Kilat) → skor tersimpan; Latihan terbuka.
  8. Kerjakan Latihan (10 soal) → Kuis terbuka; kerjakan Kuis (10 soal, 20 menit) → nilai & pembahasan tampil.
  9. Tugas Pertemuan 4: kirim jawaban dengan Ketik, lalu coba juga Upload File (PDF/JPG/PNG); Pengajar memeriksa & memberi nilai/feedback → terlihat peserta.
  10. Pengajar menekan **Kembali ke Otomatis** → P4 kembali Selesai: hasil tetap terlihat, pengerjaan baru ditolak.
  11. Pertemuan lain (P1–P3, P5 dst.), Rekap Nilai, Dashboard, TO PTS/PAS tetap seperti sebelumnya.

### P5f — Data pembelajaran Pertemuan 5 lengkap (kelima kelas) → `[x]` diverifikasi manual pemilik ("SUDAH", 9 Oktober 2026)
- **Permintaan pemilik (9 Oktober 2026):** Pertemuan 5 harus memiliki 6 komponen (Pretest 5 soal, Modul, Aktivitas Interaktif, Latihan Soal, Tugas, Kuis) yang terhubung ke ID Pertemuan 5, sesuai topik dari data yang ada, dapat dikerjakan peserta; tanpa mengubah P1–P4 & P6–P12, tanggal, status akses, data pengguna, struktur penyimpanan; tanpa reset. Cakupan kelas mengikuti keputusan P5e: **kelima kelas**.
- **Audit sebelum perubahan:** Pertemuan 5 kelima kelas **kosong sama sekali** (tanpa Pretest, Modul, Aktivitas, Latihan, Tugas, Kuis; komponen siap 0/5). Topik ditentukan dari data yang sudah ada (`TOPIK_PERTEMUAN` & bank soal Pertemuan 5): Matematika — Persamaan Garis Lurus · B. Inggris — Asking and Giving Opinion · IPA — Struktur Tumbuhan · IPS — Pasar Modal · B. Indonesia — Teks Diskusi.
- **Yang ditambahkan (per kelas, terhubung ke pertemuanId & kelasId Pertemuan 5):** Pretest 5 soal (3 PG + 2 B/S dari bank soal Pertemuan 5, kunci sudah diperiksa); Modul "Tulis Materi" (tujuan pembelajaran, 4–6 subbab, contoh, rangkuman); 4 Aktivitas Interaktif (3 aktivitas bertipe + Mini Challenge dari bank soal); Latihan Soal 10 soal (bank soal Pertemuan 5); Tugas Aktif (judul, deskripsi, soal/instruksi, metode Ketik atau Upload File, tenggat 6 hari setelah tanggal pertemuan); Kuis Aktif 10 soal **baru** (6 PG + 4 B/S, berbeda dari Pretest/Latihan) 20 menit. Komponen siap P5 → 5/5.
- **Kode:** konten baru `KONTEN_PERTEMUAN_5`; fungsi P5e dijadikan umum: `lengkapiKontenPertemuan(data, nomor)` (P4 tetap lewat `lengkapiPertemuan4`, hasilnya identik). **Migrasi v8** (sekali, tanpa reset): hanya komponen P5 yang belum ada yang ditambahkan, ID baru di akhir koleksi; konten P5 buatan pengajar dipertahankan; P5 yang topiknya diganti pengguna dilewati. Kunci `localStorage` & struktur data tetap.
- **Catatan akses:** P5 berlangsung 3–9 Okt (Matematika) s.d. 7–13 Okt (B. Indonesia). Per 9 Oktober 2026 kelimanya **Berjalan**; Matematika selesai 9 Okt, sehingga mulai 10 Okt P5 Matematika menjadi Selesai (read-only) kecuali dibuka kembali Pengajar.
- **Hasil uji otomatis (9 Oktober 2026):** Node baru **P12 Pertemuan 5 117/117** (audit 6 komponen × 5 kelas, topik dari data, Pretest dari bank P5, relasi ID, validitas soal/opsi unik/kunci/pembahasan, kunci hitungan diperiksa, aktivitas dapat diselesaikan skor 100 & skor < 100 bila salah, soal kuis tidak menggandakan, data selain P5 identik dengan kondisi sebelumnya, migrasi v8 dari skema 7 & berurutan dari skema 6, idempoten, konten P5 buatan pengajar dipertahankan, alur peserta + tugas + penilaian + edit soal oleh pengajar, status Belum Dimulai/Berjalan/Selesai & Buka Kembali); browser baru **Pertemuan 5 39/39** (tanggal 5 Okt 2026: Pengajar 5/5 komponen, detail, Kelola Soal; peserta mengerjakan semua komponen lewat halaman, progress 5/5, nilai tugas; read-only saat ditutup; 375px; tanpa error JS). Regresi: Node total 984/984 (P10 Pertemuan 4 105/105 tetap); browser total 2.679/2.679 (Pertemuan 4 39/39, Akses Jadwal 43/43, P2–P5, Tugas, Latihan, Login, Fase 1–11, dashboard, sidebar 882/882, PDF 11/11, semua halaman 64/64 juga pada tanggal nyata), cek link 0 rusak, 0 `href="#"`.
- **Penyesuaian uji lama (fitur tidak diubah):** jumlah data awal diperbarui (modul/tugas/kuis 20 → 25, kuis 255 soal, per kelas 4 → 5, Pretest Matematika 5, aktivitas Matematika 25, skema 7 → 8); uji yang memakai Pertemuan 5 sebagai "pertemuan kosong" (membuat Pretest/Aktivitas/Latihan buatan pengajar sendiri) kini memakai Pertemuan 6; judul kuis uji "Kuis Pasar Modal" diganti "Kuis Investasi Saham" karena kini sama dengan judul kuis P5 IPS; beberapa uji browser diberi waktu tunggu pemuatan halaman (waktu nyata).
- **Checklist uji manual pemilik (jawab SUDAH atau laporkan nomor yang gagal):**
  1. Buka aplikasi tanpa reset: Pertemuan 5 kelima kelas otomatis terisi; data lama Anda tetap ada.
  2. Login Pengajar → Pertemuan (beberapa kelas): Pertemuan 5 "5/5 komponen siap", status Berjalan; Lihat Detail menampilkan Pretest, 4 Aktivitas, Latihan, Modul, Tugas, Kuis.
  3. Kelola Soal Pretest (5), Latihan (10), Kuis (10) Pertemuan 5: soal tampil & dapat diedit.
  4. Login Peserta (Seftia Della) → Kelas Saya → Pertemuan 5 (Persamaan Garis Lurus): 6 kelompok komponen, banner jadwal 3–9 Oktober (Berjalan). Catatan: lakukan pada 9 Oktober; mulai 10 Oktober P5 Matematika Selesai — gunakan **Buka Kembali** bila perlu.
  5. Kerjakan Pretest (5 soal) → Modul terbuka; baca Modul → Tandai Modul Selesai.
  6. Mainkan keempat Aktivitas (Menjodohkan, Kelompokkan, Susun Urutan, Tantangan Kilat) → skor tersimpan; Latihan terbuka.
  7. Kerjakan Latihan → Kuis terbuka; kerjakan Kuis (10 soal, 20 menit) → nilai & pembahasan tampil, tidak dapat diulang.
  8. Tugas Pertemuan 5: kirim jawaban (Ketik dan/atau Upload File); Pengajar memeriksa & memberi nilai/feedback → terlihat peserta.
  9. Buka URL Kuis P5 langsung sebelum Latihan selesai → dialihkan (alur berurutan tetap).
  10. Pertemuan 1–4 dan 6–12, Rekap Nilai, Dashboard, TO PTS/PAS tetap seperti sebelumnya.

### P6 — Detail Pengerjaan & Pemantauan Progres Peserta (Pengajar & Admin) → `[x]` diverifikasi manual pemilik ("SUDAH", 9 Oktober 2026)
- **Permintaan pemilik (9 Oktober 2026):** setiap data pembelajaran (Pretest, Modul, Aktivitas Interaktif, Latihan Soal, Kuis, Tugas) di Portal Pengajar & Admin dapat diklik untuk membuka detail komponen + daftar peserta & status pengerjaannya; Lihat Detail menampilkan jawaban/hasil yang benar-benar tersimpan; penilaian tugas; hak akses dicek di logika; pola sama untuk keenam komponen; tanpa data palsu, tanpa reset.
- **Audit data (sumber yang dipakai, dihubungkan lewat ID):** Pretest/Latihan/Kuis → koleksi `hasil` (pesertaId + jenis + itemId; salinan soal yang dikerjakan + jawaban + skor, benar/salah/kosong, waktu mulai & selesai; Latihan hanya menyimpan jawaban percobaan terakhir + nilai terbaik + jumlah percobaan; hasil data awal hanya berisi nilai tanpa jawaban). Aktivitas → `hasil` (jawaban percobaan terakhir, skor terakhir/terbaik, percobaan, durasi). Modul → `progresmodul` (status "Sedang dipelajari" saat dibuka / "Selesai" saat ditandai, waktu dibuka & selesai — tidak ada persentase/lama membaca). Tugas → `hasil` jenis tugas (teks, lampiran file, waktu, terlambat, nilai, feedback, dinilai oleh/pada). **Tidak ada penyimpanan baru** — semua data yang dibutuhkan sudah tersedia.
- **Yang dibuat:**
  - Halaman baru `pages/pemantauan.html?jenis=…&id=…` (satu pola untuk 6 komponen): breadcrumb, tombol Kembali ke daftar & Kelola, info komponen (judul, mapel, kelas, pertemuan + jadwal/status, instruksi/deskripsi, jumlah soal/durasi/jenis aktivitas/format/deadline sesuai jenis), ringkasan (terdaftar, sudah, sedang/rata-rata, belum, rata-rata nilai), tabel peserta (No, Nama + NIS, Kelas, Status, Nilai/Progres, Waktu, Aksi) dengan pencarian nama/NIS & filter status, tampilan kosong & pesan "tidak ditemukan".
  - Status dari bukti tersimpan: Belum Mengerjakan / Sedang Mengerjakan / Sudah Mengerjakan (Pretest, Latihan, Kuis); Belum Mengerjakan / Selesai (Aktivitas); Belum Membuka / Sedang Dipelajari / Selesai (Modul — hanya membuka **tidak** dihitung selesai); Belum Mengumpulkan / Tidak Mengumpulkan / Sudah Mengumpulkan / Sudah Dinilai (Tugas). Peserta yang belum mengerjakan tetap tampil; peserta yang pindah kelas tetapi punya hasil ikut tampil (ditandai).
  - Lihat Detail (modal): Pretest/Kuis/Latihan → waktu mulai & kirim, lama pengerjaan, nilai, benar/salah/tidak dijawab, semua soal dengan **jawaban peserta** (dari hasil) & **jawaban benar** (dari data soal yang dikerjakan) + penanda Benar/Salah + pembahasan; pengerjaan belum dikirim ditandai; Latihan dengan beberapa percobaan diberi keterangan; hasil data awal → "rincian tidak tersedia". Aktivitas → jenis, skor terbaik/terakhir, percobaan, durasi, respons per bagian. Modul → waktu dibuka & ditandai selesai (tanpa persentase karangan). Tugas → instruksi, jawaban teks, file jawaban (hanya bila tersimpan) + pratinjau, waktu, status, nilai, feedback, dinilai oleh/pada, **form penilaian** (simpan/perbarui nilai & feedback lewat `nilaiTugas` yang sudah ada).
  - Halaman daftar Pretest, Aktivitas, Latihan (evaluasi.html), Modul, Kuis, Tugas: setiap baris dapat diklik (kursor pointer + sorot saat diarahkan) dan judul menjadi tautan ke Pemantauan; klik tombol/tautan aksi di baris tidak memicu klik baris.
  - Fungsi bersama: tampilan pembahasan soal (`reviewSoalHtml`) & rincian aktivitas (`rincianAktivitasHtml`) kini dipakai halaman peserta dan Pemantauan (tampilan peserta tidak berubah).
- **Hak akses (di logika, bukan hanya tombol):** halaman hanya untuk Admin & Pengajar (`AKSES_HALAMAN`); Pengajar hanya komponen kelas yang diampu (data diambil lewat fungsi yang sudah dibatasi role) — kelas lain → "tidak ditemukan", tidak dapat menilai tugas kelas lain; Admin dapat memantau semua kelas; penilaian tugas mengikuti kebijakan yang sudah ada (Pengajar & Admin, sama seperti halaman Pengumpulan Tugas); jawaban & nilai pretest/latihan/kuis/aktivitas tidak dapat diubah dari halaman ini.
- **Hasil uji otomatis (9 Oktober 2026):** Node baru **P14 Pemantauan 40/40** (6 komponen tampil dengan semua peserta & status awal, ID salah → null, hasil data awal tanpa rincian, jawaban asli vs kunci & penanda benar/salah, kuis belum dikirim, latihan 2 percobaan, aktivitas, modul dibuka ≠ selesai, tugas teks & file + penilaian Pengajar/Admin + validasi nilai, peserta lain tidak terpengaruh, muat ulang, akses Pengajar/Admin/Peserta, peserta pindah kelas, baris daftar menuju ID yang benar); browser baru **Pemantauan 48/48** (klik baris di 6 daftar → komponen yang benar, tombol Lihat tetap membuka modal, ringkasan, cari & filter, Lihat Detail jawaban asli & kunci, modul, kuis, latihan, aktivitas, beri nilai tugas + validasi + muat ulang + terlihat peserta, akses Peserta/Admin/Pengajar, 820/375px, tanpa error JS). Regresi: Node total 1.024/1.024; browser total 2.733/2.733 (semua halaman kini 67/67 termasuk Pemantauan, juga pada tanggal nyata), cek link 0 rusak, 0 `href="#"`.
- **Checklist uji manual pemilik (jawab SUDAH atau laporkan nomor yang gagal):**
  1. Login Pengajar → Pretest: arahkan kursor ke baris (tersorot, kursor tangan), klik baris "Pretest: Persamaan Linear Satu Variabel" → halaman Pemantauan pretest tersebut.
  2. Di daftar yang sama, klik tombol Lihat/Preview/Kelola/Edit/Hapus → tetap menjalankan aksinya masing-masing (tidak pindah ke Pemantauan).
  3. Ulangi klik baris di Aktivitas Interaktif, Latihan Soal, Modul, Kuis, Tugas → Pemantauan komponen yang diklik.
  4. Halaman Pemantauan: info komponen, ringkasan (terdaftar/sudah/belum), tabel semua peserta kelas, cari nama, filter status, breadcrumb & tombol Kembali.
  5. Login Peserta (Seftia Della), kerjakan Pretest/Latihan/Kuis Pertemuan yang sedang Berjalan dengan beberapa jawaban salah, buka Modul tanpa menandai selesai, kumpulkan Tugas.
  6. Login Pengajar → Pemantauan komponen tersebut → Lihat Detail Seftia: jawaban yang dipilih Seftia, kunci, tanda Benar/Salah, nilai; Modul "Sedang Dipelajari" (bukan Selesai).
  7. Pemantauan Tugas → Lihat Detail → beri nilai & feedback → status "Sudah Dinilai"; muat ulang halaman → tetap; Seftia melihat nilai & feedback.
  8. Login Admin → Pemantauan komponen kelas lain (mis. Bahasa Inggris) dapat dibuka; Pengajar Matematika membuka alamat yang sama → "tidak ditemukan".
  9. Cek tampilan di layar sempit (ponsel/tablet).
