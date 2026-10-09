/* ==========================================================
   DelLearn — Admin Panel
   Milestone 3 — JavaScript & Interaktivitas (client-side only)

   Bagian file:
   1. Mock data awal (sumber data tunggal untuk semua halaman)
   2. Penyimpanan (localStorage) + fungsi CRUD data kelas
   2A. Koleksi data lain (peserta, dst.), relasi antar data, reset
   3. Statistik & perhitungan nilai
   4. Helper tampilan (DOM)
   4A. Komponen umum: pesan, modal, paginasi, ekspor CSV
   5. Halaman Data Kelas
   6. Halaman Form Kelas (Tambah & Edit + validasi)
   6A. Halaman Data Peserta
   6B. Halaman Data Pengajar
   6C. Halaman Pertemuan
   6D. Halaman Modul
   6E. Halaman Tugas
   6F. Halaman Kuis
   6G. Halaman Try Out (TO PTS & TO PAS)
   6H. Halaman Detail Kelas
   6I. Halaman Rekap Nilai
   7. Sidebar toggle (semua halaman)
   8. Dashboard (statistik, kelas aktif, grafik Chart.js)
   10. Login, session & role (simulasi frontend, bukan keamanan backend)
   11. Halaman Login
   12. Portal Pengajar
   13. Portal Peserta
   14. Pengerjaan soal (kerjakan.html) — termasuk soal menjodohkan
   15. Kelola Soal (kelola-soal.html) — editor soal Pretest/Aktivitas/Latihan/Kuis/TO
   16. Halaman Pretest / Aktivitas Interaktif / Latihan Soal (evaluasi.html)
   17. Pengumpulan & penilaian tugas (pengumpulan-tugas.html)
   9. Inisialisasi per halaman (berdasarkan <body data-page="...">) + cek login & role
   ========================================================== */

/* =========================
   1. MOCK DATA AWAL
========================= */

// Kunci penyimpanan di localStorage. Ganti versinya bila struktur data berubah.
const STORAGE_KEY = 'dellearn.kelas.v1';

// Pilihan untuk form & label tampilan
const MAPEL_OPTIONS = [
    { nama: 'Matematika', kode: 'M', icon: 'calculator' },
    { nama: 'Bahasa Inggris', kode: 'B', icon: 'language' },
    { nama: 'IPA', kode: 'I', icon: 'flask' },
    { nama: 'IPS', kode: 'S', icon: 'globe' },
    { nama: 'Bahasa Indonesia', kode: 'D', icon: 'book' },
];

const TINGKAT_OPTIONS = ['SMP Kelas 7', 'SMP Kelas 8', 'SMP Kelas 9'];

const STATUS_OPTIONS = ['Aktif', 'Tidak Aktif'];

// Data pengajar awal. Kelas merujuk pengajar lewat pengajarId, jadi nama selalu diambil dari data terbaru.
// Kelas yang diampu tidak disimpan di sini: dihitung dari data kelas.
const STATUS_PENGAJAR = ['Aktif', 'Tidak Aktif'];

const PENGAJAR_AWAL = [
    { id: 1, kode: 'PGJ-001', nama: 'Andi Saputra', gelar: 'S.Pd.', nip: '19880412 201201 1 002', email: 'andi.saputra@dellearn.id', mapel: 'Matematika', status: 'Aktif' },
    { id: 2, kode: 'PGJ-002', nama: 'Rina Wulandari', gelar: 'M.Pd.', nip: '19910825 201502 2 004', email: 'rina.w@dellearn.id', mapel: 'Bahasa Inggris', status: 'Aktif' },
    { id: 3, kode: 'PGJ-003', nama: 'Budi Hartono', gelar: 'S.Si.', nip: '19851104 201003 1 007', email: 'budi.hartono@dellearn.id', mapel: 'IPA', status: 'Aktif' },
    { id: 4, kode: 'PGJ-004', nama: 'Sari Permata', gelar: 'S.Sos.', nip: '19930219 201701 2 001', email: 'sari.permata@dellearn.id', mapel: 'IPS', status: 'Aktif' },
];

// Data kelas awal — sama dengan isi Dashboard & Data Kelas (5 kelas, kapasitas 105).
// Jumlah peserta TIDAK disimpan di sini: dihitung dari data peserta (PESERTA_AWAL: 20/18/19/15/13 = 85).
const KELAS_AWAL = [
    {
        id: 1,
        kode: 'M8',
        nama: 'Matematika SMP Kelas 8',
        mapel: 'Matematika',
        tingkat: 'SMP Kelas 8',
        keterangan: 'Kurikulum Merdeka • Sesi Sore',
        pengajarId: 1,
        kapasitas: 25,
        status: 'Aktif',
    },
    {
        id: 2,
        kode: 'B8',
        nama: 'Bahasa Inggris SMP Kelas 8',
        mapel: 'Bahasa Inggris',
        tingkat: 'SMP Kelas 8',
        keterangan: 'Speaking & Grammar Prep',
        pengajarId: 2,
        kapasitas: 20,
        status: 'Aktif',
    },
    {
        id: 3,
        kode: 'I8',
        nama: 'IPA SMP Kelas 8',
        mapel: 'IPA',
        tingkat: 'SMP Kelas 8',
        keterangan: 'Fisika & Biologi Terpadu',
        pengajarId: 3,
        kapasitas: 20,
        status: 'Aktif',
    },
    {
        id: 4,
        kode: 'S9',
        nama: 'IPS SMP Kelas 9',
        mapel: 'IPS',
        tingkat: 'SMP Kelas 9',
        keterangan: 'Geografi & Ekonomi Terapan',
        pengajarId: 4,
        kapasitas: 20,
        status: 'Aktif',
    },
    {
        id: 5,
        kode: 'D9',
        nama: 'Bahasa Indonesia SMP Kelas 9',
        mapel: 'Bahasa Indonesia',
        tingkat: 'SMP Kelas 9',
        keterangan: 'Persiapan Asesmen Standar',
        pengajarId: 2,
        kapasitas: 20,
        status: 'Aktif',
    },
];

// Nilai peserta kelas Matematika SMP Kelas 8 (sama dengan halaman Rekap Nilai)
const BOBOT_NILAI = { tugas: 0.2, kuis: 0.2, pts: 0.3, pas: 0.3 };

const NILAI_PESERTA = [
    { inisial: 'SD', nama: 'Seftia Della', nis: '20260801', tugas: 88, kuis: 85, pts: 82, pas: 86 },
    { inisial: 'SA', nama: 'Siti Aminah', nis: '20260802', tugas: 92, kuis: 90, pts: 88, pas: 91 },
    { inisial: 'AP', nama: 'Andi Pratama', nis: '20260803', tugas: 78, kuis: 80, pts: 75, pas: 79 },
    { inisial: 'RP', nama: 'Rina Putri', nis: '20260804', tugas: 95, kuis: 92, pts: 90, pas: 94 },
    { inisial: 'DS', nama: 'Dimas Saputra', nis: '20260805', tugas: 82, kuis: 84, pts: 80, pas: 83 },
];

// ---- Data peserta awal (85 peserta) ----
const STATUS_PESERTA = ['Aktif', 'Tidak Aktif'];

// Nama peserta per ID kelas: 20 + 18 + 19 + 15 + 13 = 85.
// Lima nama pertama Matematika = peserta di Rekap Nilai (NIS 20260801–20260805).
const NAMA_PESERTA_AWAL = {
    1: ['Seftia Della', 'Siti Aminah', 'Andi Pratama', 'Rina Putri', 'Dimas Saputra', 'Ahmad Fauzi', 'Nabila Zahra',
        'Rizky Ramadhan', 'Aulia Rahma', 'Fajar Nugroho', 'Salsabila Putri', 'Bagas Wicaksono', 'Intan Permatasari',
        'Yoga Pratama', 'Nadia Safitri', 'Farhan Hidayat', 'Cahya Lestari', 'Reza Kurniawan', 'Tiara Anjani', 'Galih Prasetyo'],
    2: ['Alya Putri', 'Kevin Wijaya', 'Putri Maharani', 'Arif Setiawan', 'Dewi Kartika', 'Hendra Gunawan', 'Laras Ayu',
        'Naufal Akbar', 'Citra Dewi', 'Ilham Maulana', 'Zahra Amelia', 'Rafi Ananda', 'Melati Suci', 'Daffa Aditya',
        'Keisha Aurelia', 'Bima Sakti', 'Anisa Fitri', 'Teguh Santoso'],
    3: ['Sekar Arum', 'Raka Pradipta', 'Vina Oktaviani', 'Wahyu Hidayat', 'Nurul Hikmah', 'Gilang Ramadhan', 'Ayu Lestari',
        'Rendi Saputra', 'Fitri Handayani', 'Joko Susilo', 'Mega Puspita', 'Aditya Nugraha', 'Lina Marlina',
        'Hafiz Ramadhan', 'Putri Ayuningtyas', 'Dani Firmansyah', 'Rosa Amalia', 'Eko Prasetyo', 'Clara Wijayanti'],
    4: ['Maya Anggraini', 'Yusuf Hakim', 'Indah Purnama', 'Bayu Saputro', 'Shinta Maharani', 'Arya Wibisono',
        'Kirana Larasati', 'Fikri Haikal', 'Dinda Ayu', 'Rizal Fahmi', 'Anggun Sari', 'Taufik Hidayat', 'Nisa Rahmawati',
        'Gerry Putra', 'Lestari Wulan'],
    5: ['Ratna Sari', 'Hanif Abdullah', 'Sinta Dewi', 'Irfan Hakim', 'Amelia Putri', 'Rangga Aditya', 'Febri Yanti',
        'Agus Salim', 'Wulan Sari', 'Iqbal Ramadhan', 'Tasya Kamila', 'Doni Setiawan', 'Nadya Paramitha'],
};

const SEKOLAH_ASAL = ['SMPN 1 Jakarta', 'SMPN 3 Jakarta', 'SMP Labschool', 'SMPN 19 Jakarta', 'SMP Kristen 1',
    'SMPN 2 Jakarta', 'SMP Al-Azhar 2', 'SMPN 11 Jakarta'];

// "SMP Kelas 8" → "8"
function angkaTingkat(tingkat) {
    return (String(tingkat).match(/\d+/) || [''])[0];
}

// "Seftia Della" → "seftia.della@email.com"
function buatEmailPeserta(nama) {
    return `${String(nama).toLowerCase().trim().replace(/[^a-z0-9]+/g, '.')}@email.com`;
}

// Gender peserta (opsional). Hanya diisi bila diketahui; tidak ditebak dari nama.
const GENDER_PESERTA = ['Laki-laki', 'Perempuan'];
const GENDER_AWAL = { 1: 'Perempuan' };   // akun peserta demo: Seftia Della

// Peserta: { id, nis, nama, email, sekolah, kelasId, status, gender }. NIS = 2026 (angkatan) + tingkat (2 digit) + urutan.
function buatPesertaAwal() {
    const list = [];
    const urutPerTingkat = {};
    KELAS_AWAL.forEach(kelas => {
        const tingkat = angkaTingkat(kelas.tingkat);
        NAMA_PESERTA_AWAL[kelas.id].forEach(nama => {
            const id = list.length + 1;
            urutPerTingkat[tingkat] = (urutPerTingkat[tingkat] || 0) + 1;
            list.push({
                id,
                nis: `2026${tingkat.padStart(2, '0')}${String(urutPerTingkat[tingkat]).padStart(2, '0')}`,
                nama,
                email: buatEmailPeserta(nama),
                sekolah: `${SEKOLAH_ASAL[(id - 1) % SEKOLAH_ASAL.length]} (Kelas ${tingkat}${'ABCD'.charAt((id - 1) % 4)})`,
                kelasId: kelas.id,
                status: 'Aktif',
                gender: GENDER_AWAL[id] || '',
            });
        });
    });
    return list;
}

const PESERTA_AWAL = buatPesertaAwal();

// ---- Data pertemuan awal (12 pertemuan per kelas) ----
// Struktur: Pertemuan 1–6 → TO PTS → Pertemuan 7–12 → TO PAS (TO = event khusus, bukan pertemuan)
const STATUS_PERTEMUAN = ['Belum Dimulai', 'Berjalan', 'Selesai'];

// Komponen setiap pertemuan; yang disimpan = daftar komponen yang sudah siap
const KOMPONEN_PERTEMUAN = [
    { key: 'pretest', label: 'Pretest', singkat: 'Pretest' },
    { key: 'modul', label: 'Modul Pembelajaran', singkat: 'Modul' },
    { key: 'aktivitas', label: 'Aktivitas Interaktif', singkat: 'Aktivitas' },
    { key: 'latihan', label: 'Latihan Soal', singkat: 'Latihan Soal' },
    { key: 'kuis', label: 'Kuis', singkat: 'Kuis' },
];

const TOPIK_PERTEMUAN = {
    'Matematika': ['Persamaan Linear Satu Variabel', 'Pola Bilangan', 'Koordinat Kartesius', 'Relasi dan Fungsi',
        'Persamaan Garis Lurus', 'Sistem Persamaan Linear Dua Variabel', 'Teorema Pythagoras', 'Lingkaran',
        'Garis Singgung Lingkaran', 'Bangun Ruang Sisi Datar', 'Statistika', 'Peluang'],
    'Bahasa Inggris': ['Introduction', 'Greetings and Vocabulary', 'Describing People', 'Simple Present Tense',
        'Asking and Giving Opinion', 'Descriptive Text', 'Simple Past Tense', 'Recount Text',
        'Invitation and Announcement', 'Comparison Degree', 'Narrative Text', 'Grammar Review'],
    'IPA': ['Gerak Lurus', 'Sistem Pernapasan', 'Gaya dan Hukum Newton', 'Usaha dan Pesawat Sederhana',
        'Struktur Tumbuhan', 'Sistem Pencernaan', 'Zat Aditif dan Adiktif', 'Sistem Peredaran Darah',
        'Tekanan Zat', 'Getaran dan Gelombang', 'Cahaya dan Alat Optik', 'Review Materi'],
    'IPS': ['Perubahan Sosial Budaya', 'Globalisasi', 'Interaksi Antarnegara Asia', 'Perdagangan Internasional',
        'Pasar Modal', 'Kolonialisme di Indonesia', 'Pergerakan Nasional', 'Proklamasi Kemerdekaan',
        'Ekonomi Kreatif', 'Kerja Sama ASEAN', 'Mobilitas Sosial', 'Review Materi'],
    'Bahasa Indonesia': ['Teks Laporan Percobaan', 'Teks Pidato Persuasif', 'Cerita Pendek', 'Teks Tanggapan',
        'Teks Diskusi', 'Teks Cerita Inspiratif', 'Teks Prosedur', 'Surat Dinas', 'Teks Eksplanasi', 'Puisi',
        'Teks Argumentasi', 'Latihan Asesmen'],
};

// Tanggal "YYYY-MM-DD" + n hari (dihitung dalam UTC agar tidak bergeser karena zona waktu)
function tambahHari(tanggal, hari) {
    const [y, m, d] = String(tanggal).split('-').map(Number);
    const t = new Date(Date.UTC(y, m - 1, d + hari));
    return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, '0')}-${String(t.getUTCDate()).padStart(2, '0')}`;
}

// Pertemuan: { id, kelasId, nomor, judul, tanggal (= tanggal mulai), status, modeAkses: 'otomatis'|'manual', komponen: ['pretest', ...] }
// Jadwal (Semester Ganjil 2026/2027): mingguan mulai 5 September 2026 (kelas berikutnya bergeser 1 hari);
// 2 minggu jeda untuk TO PTS (Oktober 2026) setelah Pertemuan 6; TO PAS Desember 2026.
const TAHUN_AJARAN = '2026/2027';
const SEMESTER_AKTIF = `Semester Ganjil ${TAHUN_AJARAN}`;
const MULAI_PERTEMUAN = '2026-09-05';
function buatPertemuanAwal() {
    const list = [];
    const semua = KOMPONEN_PERTEMUAN.map(k => k.key);
    KELAS_AWAL.forEach(kelas => {
        const mulai = tambahHari(MULAI_PERTEMUAN, kelas.id - 1);
        (TOPIK_PERTEMUAN[kelas.mapel] || []).forEach((judul, i) => {
            const nomor = i + 1;
            list.push({
                id: list.length + 1,
                kelasId: kelas.id,
                nomor,
                judul,
                tanggal: tambahHari(mulai, i * 7 + (nomor > 6 ? 14 : 0)),
                status: nomor <= 2 ? 'Selesai' : nomor === 3 ? 'Berjalan' : 'Belum Dimulai',
                komponen: nomor <= 3 ? [...semua] : nomor === 4 ? ['pretest', 'modul'] : [],
                // Akses peserta mengikuti jadwal (status di atas hanya dipakai bila override manual)
                modeAkses: 'otomatis',
            });
        });
    });
    return list;
}

const PERTEMUAN_AWAL = buatPertemuanAwal();

// ---- Data modul awal ----
// Format: "Tulis Materi" (isi ditulis langsung) atau "Upload PDF" (simulasi: hanya nama & ukuran file yang dicatat)
const FORMAT_MODUL = ['Tulis Materi', 'Upload PDF'];
const STATUS_MODUL = ['Aktif', 'Draft'];
const BATAS_PDF_MB = 10;
// File yang isinya DISIMPAN di browser (localStorage ±5 MB untuk seluruh data) — dibatasi kecil agar muat:
// PDF modul & gambar materi dapat dibuka peserta; lampiran tugas dari pengajar dapat diunduh peserta.
const BATAS_SIMPAN_PDF_KB = 1024;
const BATAS_GAMBAR_KB = 500;
const BATAS_LAMPIRAN_KB = 500;
const EKSTENSI_GAMBAR = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
const EKSTENSI_LAMPIRAN = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'jpg', 'jpeg', 'png'];

// "Modul 1.PDF" → "pdf"
function ekstensiFile(nama) {
    const cocok = /\.([a-z0-9]+)$/i.exec(String(nama || ''));
    return cocok ? cocok[1].toLowerCase() : '';
}

// "Persamaan Linear Satu Variabel" → "persamaan-linear-satu-variabel"
function buatSlug(teks) {
    return String(teks).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Contoh singkat di modul tertulis (Pertemuan 1 & 3; Pertemuan 2 berupa PDF)
const CONTOH_MODUL = {
    'Matematika': { 1: 'Selesaikan 2x + 4 = 10.\nKurangi kedua ruas dengan 4: 2x = 6.\nBagi kedua ruas dengan 2: x = 3.', 3: 'Titik A(3, −2): bergerak 3 satuan ke kanan, lalu 2 satuan ke bawah. Titik A berada di Kuadran IV.' },
    'Bahasa Inggris': { 1: 'Hello! My name is Sinta. I am fourteen years old. I am from Bandung.', 3: 'She is tall. She has long black hair. She is very friendly.' },
    'IPA': { 1: 'Mobil menempuh 100 m dalam 20 s dengan kecepatan tetap.\nKecepatan = jarak ÷ waktu = 100 ÷ 20 = 5 m/s (GLB).', 3: 'Saat bus direm mendadak, tubuh penumpang terdorong ke depan karena kelembaman (Hukum I Newton).' },
    'IPS': { 1: 'Penggunaan telepon pintar mengubah cara masyarakat berkomunikasi — contoh perubahan sosial akibat teknologi.', 3: 'Indonesia bekerja sama dengan Jepang dalam bidang pendidikan melalui program beasiswa.' },
    'Bahasa Indonesia': { 1: 'Tujuan: mengetahui pengaruh garam terhadap telur di dalam air.\nAlat dan bahan: gelas, air, garam, telur.', 3: 'Orientasi: "Pagi itu Rani terlambat ke sekolah." → memperkenalkan tokoh dan latar.' },
};

// Modul: { id, kelasId, pertemuanId, judul, deskripsi, format, isi, contoh, rangkuman, file: { nama, ukuran } | null, status }
// Satu modul untuk Pertemuan 1–3 setiap kelas (P2 berupa PDF) + satu draft Pertemuan 4 Matematika.
function buatModulAwal() {
    const list = [];
    PERTEMUAN_AWAL.filter(p => p.nomor <= 3 || (p.kelasId === 1 && p.nomor === 4)).forEach(p => {
        const kelas = KELAS_AWAL.find(k => k.id === p.kelasId);
        const pdf = p.nomor === 2;
        list.push({
            id: list.length + 1,
            kelasId: p.kelasId,
            pertemuanId: p.id,
            judul: p.judul,
            deskripsi: `Materi pokok Pertemuan ${p.nomor} ${kelas.nama}: ${p.judul}.`,
            format: pdf ? 'Upload PDF' : 'Tulis Materi',
            isi: pdf ? '' : `## Tujuan Pembelajaran\nPeserta memahami konsep ${p.judul} dan dapat menerapkannya pada soal latihan.\n\n## Materi Pokok\n1. Pengertian dan konsep dasar ${p.judul}.\n2. Langkah-langkah penting yang perlu diingat.\n3. Tips mengerjakan soal ujian sekolah.`,
            contoh: pdf ? '' : (CONTOH_MODUL[kelas.mapel] || {})[p.nomor] || '',
            rangkuman: pdf ? '' : `${p.judul} adalah materi penting di ${kelas.mapel}. Pahami konsep dasarnya, perhatikan contoh, lalu uji pemahamanmu lewat aktivitas, latihan, dan kuis.`,
            file: pdf ? { nama: `modul-${buatSlug(p.judul)}.pdf`, ukuran: 1258291 } : null,
            status: p.nomor === 4 ? 'Draft' : 'Aktif',
        });
    });
    return list;
}

const MODUL_AWAL = buatModulAwal();

// ---- Data tugas awal ----
const STATUS_TUGAS = ['Draft', 'Aktif', 'Ditutup'];

// Judul khusus (sama dengan halaman Tugas lama): "kelasId-nomorPertemuan" → judul
const JUDUL_TUGAS_KHUSUS = { '1-1': 'Latihan Persamaan Linear', '2-2': 'Vocabulary Practice', '3-2': 'Sistem Pernapasan Manusia' };

// Metode pengumpulan jawaban peserta (dipilih pengajar per tugas)
const METODE_TUGAS = { ketik: 'Ketik Langsung', upload: 'Upload File', keduanya: 'Keduanya (Ketik atau Upload)' };
const LABEL_METODE_JAWABAN = { ketik: 'Ketik Langsung', upload: 'Upload File' };
const LABEL_METODE_TUGAS_SINGKAT = { ketik: 'jawab diketik', upload: 'jawab upload file', keduanya: 'jawab diketik / upload file' };
// Metode tugas awal Pertemuan 2 per kelas (variasi contoh); Pertemuan 1 = keduanya, Pertemuan 3 = ketik
const METODE_TUGAS_P2 = { 1: 'keduanya', 2: 'ketik', 3: 'keduanya', 4: 'upload', 5: 'keduanya' };
const SOAL_TUGAS_KHUSUS = {
    '1-1': 'Jelaskan langkah-langkah menyelesaikan persamaan 2x + 5 = 15, lalu kerjakan juga soal pada lembar dokumentasi.',
    '1-2': '1. Tentukan suku ke-8 dari barisan 5, 10, 15, 20, …\n2. Jelaskan cara menemukan rumus suku ke-n barisan tersebut.',
    '2-2': 'Write five new vocabulary words about greetings and use each word in a sentence.',
};

// Tugas (koleksi dellearn.tugas.v2): { id, kelasId, pertemuanId, judul, deskripsi (petunjuk), soal (teks),
//   fileSoal: { nama, ukuran, tipe, data | fileId } | null (dokumentasi soal PDF/gambar), metode: ketik|upload|keduanya,
//   deadline: "YYYY-MM-DDTHH:MM", status }
// Satu tugas untuk Pertemuan 1–3 setiap kelas; tenggat 6 hari setelah pertemuan pukul 23:59.
// Soal & dokumentasi soal data awal dilengkapi lengkapiTugasAwal() (bagian 1D).
function buatTugasAwal() {
    const list = [];
    PERTEMUAN_AWAL.filter(p => p.nomor <= 3).forEach(p => {
        const kunci = `${p.kelasId}-${p.nomor}`;
        list.push({
            id: list.length + 1,
            kelasId: p.kelasId,
            pertemuanId: p.id,
            judul: JUDUL_TUGAS_KHUSUS[kunci] || `Tugas ${p.judul}`,
            deskripsi: `Kerjakan soal latihan ${p.judul} pada lembar tugas, lalu kumpulkan sebelum tenggat.`,
            soal: '',
            fileSoal: null,
            metode: p.nomor === 1 ? 'keduanya' : p.nomor === 2 ? METODE_TUGAS_P2[p.kelasId] || 'keduanya' : 'ketik',
            deadline: `${tambahHari(p.tanggal, 6)}T23:59`,
            status: kunci === '3-2' ? 'Draft' : p.nomor === 1 ? 'Ditutup' : p.nomor === 2 ? 'Aktif' : 'Draft',
        });
    });
    return list;
}

const TUGAS_AWAL = buatTugasAwal();

// ---- Data kuis awal ----
const STATUS_KUIS = ['Draft', 'Aktif', 'Ditutup'];

// Kuis lama di halaman Kuis: "kelasId-nomorPertemuan" → { judul, jumlahSoal, status }
const KUIS_KHUSUS = {
    '1-1': { judul: 'Kuis Persamaan Linear', jumlahSoal: 10, status: 'Aktif' },
    '2-1': { judul: 'Basic Vocabulary Quiz', jumlahSoal: 10, status: 'Aktif' },
    '3-2': { judul: 'Sistem Pernapasan', jumlahSoal: 15, status: 'Draft' },
};

// Kuis (koleksi dellearn.kuis.v2): { id, kelasId, pertemuanId, judul, deskripsi, jumlahSoal, durasi (menit), status, soal: [...] }
// Soal kuis MILIK kuis itu sendiri (dibuat Pengajar lewat Kelola Soal), TIDAK diambil dari Bank Soal.
// jumlahSoal = jumlah soal yang direncanakan Pengajar; kuis baru dapat Aktif bila soalnya sudah lengkap.
// Mata pelajaran tidak disimpan: diambil dari kelas. Satu kuis untuk Pertemuan 1–3 setiap kelas
// (soal contoh ditulis ke dalam kuis saat data awal dibuat — lihat lengkapiSoalKuisAwal()).
function buatKuisAwal() {
    const list = [];
    PERTEMUAN_AWAL.filter(p => p.nomor <= 3).forEach(p => {
        const khusus = KUIS_KHUSUS[`${p.kelasId}-${p.nomor}`] || {};
        const jumlahSoal = khusus.jumlahSoal || 10;
        list.push({
            id: list.length + 1,
            kelasId: p.kelasId,
            pertemuanId: p.id,
            judul: khusus.judul || `Kuis ${p.judul}`,
            deskripsi: `Kuis Pertemuan ${p.nomor} untuk menguji pemahaman materi ${p.judul}.`,
            jumlahSoal,
            durasi: jumlahSoal * 2,
            status: khusus.status || (p.nomor === 3 ? 'Draft' : 'Aktif'),
            soal: [],
        });
    });
    return list;
}

const KUIS_AWAL = buatKuisAwal();

// ---- Data Try Out (TO PTS & TO PAS) ----
// TO = event khusus (simulasi ujian sekolah), bukan pertemuan biasa dan bukan penentu kelulusan.
const STATUS_TO = ['Draft', 'Terjadwal', 'Selesai'];

// Cakupan materi: PTS = Pertemuan 1–6, PAS = Pertemuan 7–12 (batasPertemuan = pertemuan terakhir cakupan).
// Jumlah soal bawaan: PTS 30, PAS 40.
const JENIS_TO = {
    PTS: { nama: 'Penilaian Tengah Semester', dariPertemuan: 1, batasPertemuan: 6, tanggal: '2026-10-23', durasi: 90, jumlahSoal: 30 },
    PAS: { nama: 'Penilaian Akhir Semester', dariPertemuan: 7, batasPertemuan: 12, tanggal: '2026-12-18', durasi: 120, jumlahSoal: 40 },
};

// TO: { id, jenis: 'PTS'|'PAS', kelasId, judul, tanggal, waktu: "HH:MM", durasi (menit), jumlahSoal, status }
// Satu TO PTS dan satu TO PAS untuk setiap kelas (kelas 8 pukul 08:00, kelas 9 pukul 10:30).
function buatTOAwal() {
    const list = [];
    ['PTS', 'PAS'].forEach(jenis => {
        KELAS_AWAL.forEach(kelas => {
            list.push({
                id: list.length + 1,
                jenis,
                kelasId: kelas.id,
                judul: `TO ${jenis} ${kelas.mapel}`,
                tanggal: JENIS_TO[jenis].tanggal,
                waktu: angkaTingkat(kelas.tingkat) === '8' ? '08:00' : '10:30',
                durasi: JENIS_TO[jenis].durasi,
                jumlahSoal: JENIS_TO[jenis].jumlahSoal,
                status: 'Terjadwal',
            });
        });
    });
    return list;
}

const TO_AWAL = buatTOAwal();

// ---- Data nilai awal (85 peserta) ----
// Nilai: { id, pesertaId, kelasId, tugas, kuis, pts, pas } — skala 0–100; Nilai Akhir dihitung, tidak disimpan.
// 5 peserta Matematika pertama memakai NILAI_PESERTA apa adanya (dicocokkan lewat NIS).
// Peserta lain: nilai dibuat dari ID peserta (selalu sama setiap kali dibuka, bukan acak).
function buatNilaiAwal() {
    const batas = angka => Math.max(55, Math.min(100, angka));
    return PESERTA_AWAL.map((p, i) => {
        const lama = NILAI_PESERTA.find(n => n.nis === p.nis);
        const dasar = 72 + ((p.id * 7) % 21);
        const nilai = lama
            ? { tugas: lama.tugas, kuis: lama.kuis, pts: lama.pts, pas: lama.pas }
            : {
                tugas: batas(dasar + ((p.id * 3) % 7) - 2),
                kuis: batas(dasar + ((p.id * 5) % 7) - 3),
                pts: batas(dasar + ((p.id * 11) % 9) - 5),
                pas: batas(dasar + ((p.id * 13) % 9) - 4),
            };
        return { id: i + 1, pesertaId: p.id, kelasId: p.kelasId, ...nilai };
    });
}

const NILAI_AWAL = buatNilaiAwal();

/* =========================
   1A. BANK SOAL (5 mata pelajaran × 12 pertemuan, sesuai TOPIK_PERTEMUAN)
   Sumber soal awal untuk Pretest, Aktivitas Interaktif, Latihan Soal, Kuis, TO PTS & TO PAS.
   Format: pg = [soal, [opsi A–D], indeks jawaban benar, pembahasan?]
           bs = [pernyataan, benar?, pembahasan?]   (soal Benar/Salah)
   Urutan opsi pilihan ganda diacak tetap (bukan acak setiap dibuka) saat soal dipakai.
========================= */

const BANK_SOAL = {
    'Matematika': [
        { // 1. Persamaan Linear Satu Variabel
            pg: [
                ['Jika 2x + 4 = 10, maka nilai x adalah …', ['3', '2', '4', '5'], 0, '2x = 10 − 4 = 6, sehingga x = 6 : 2 = 3.'],
                ['Penyelesaian dari 3x − 5 = 16 adalah …', ['x = 7', 'x = 5', 'x = 6', 'x = 8'], 0, '3x = 16 + 5 = 21, maka x = 7.'],
                ['Nilai x yang memenuhi 5x + 3 = 2x + 15 adalah …', ['4', '3', '5', '6'], 0, '5x − 2x = 15 − 3 → 3x = 12 → x = 4.'],
                ['Jika x/4 = 6, maka x = …', ['24', '10', '18', '28'], 0, 'Kedua ruas dikali 4: x = 6 × 4 = 24.'],
                ['Umur Andi 3 tahun lebih tua dari Budi. Jumlah umur mereka 27 tahun. Umur Budi adalah …', ['12 tahun', '10 tahun', '15 tahun', '13 tahun'], 0, 'Misal umur Budi x: x + (x + 3) = 27 → 2x = 24 → x = 12.'],
                ['Penyelesaian dari 2(x − 3) = 8 adalah …', ['x = 7', 'x = 5', 'x = 4', 'x = 11'], 0, '2x − 6 = 8 → 2x = 14 → x = 7.'],
            ],
            bs: [
                ['Persamaan 4x − 7 = 9 memiliki penyelesaian x = 4.', true, '4(4) − 7 = 16 − 7 = 9.'],
                ['3x + 2 = 3x + 5 memiliki tepat satu penyelesaian.', false, 'Kedua ruas tidak pernah sama (2 ≠ 5), sehingga tidak ada penyelesaian.'],
                ['Kedua ruas 6x = 18 boleh dibagi 6 tanpa mengubah penyelesaiannya.', true, 'Membagi kedua ruas dengan bilangan yang sama (≠ 0) menghasilkan persamaan setara: x = 3.'],
                ['x² + 1 = 5 termasuk persamaan linear satu variabel.', false, 'Pangkat tertinggi variabelnya 2, jadi bukan persamaan linear.'],
            ],
        },
        { // 2. Pola Bilangan
            pg: [
                ['Suku berikutnya dari pola 2, 5, 8, 11, … adalah …', ['14', '13', '15', '16'], 0, 'Beda tiap suku 3, maka 11 + 3 = 14.'],
                ['Suku ke-10 dari barisan 3, 7, 11, 15, … adalah …', ['39', '41', '43', '37'], 0, 'Un = 3 + (n − 1) × 4 → U10 = 3 + 36 = 39.'],
                ['Pola 1, 4, 9, 16, … disebut pola bilangan …', ['persegi', 'ganjil', 'segitiga', 'genap'], 0, 'Setiap suku merupakan kuadrat bilangan asli: 1², 2², 3², 4².'],
                ['Suku berikutnya dari 1, 3, 6, 10, … adalah …', ['15', '13', '14', '16'], 0, 'Selisihnya 2, 3, 4, berikutnya 5: 10 + 5 = 15.'],
                ['Jumlah 5 bilangan ganjil pertama adalah …', ['25', '20', '30', '35'], 0, '1 + 3 + 5 + 7 + 9 = 25 = 5².'],
                ['Rumus suku ke-n dari barisan 5, 10, 15, 20, … adalah …', ['Un = 5n', 'Un = n + 5', 'Un = 5n + 5', 'Un = 10n'], 0, 'Setiap suku adalah kelipatan 5: Un = 5n.'],
            ],
            bs: [
                ['Barisan 2, 4, 8, 16, … memiliki beda yang tetap.', false, 'Barisan ini dikali 2 (rasio tetap), bukan ditambah bilangan tetap.'],
                ['Suku ke-6 pola bilangan genap 2, 4, 6, … adalah 12.', true, 'Un = 2n → U6 = 12.'],
                ['Pola bilangan segitiga dimulai 1, 3, 6, 10, 15.', true, 'Suku ke-n = n(n + 1)/2.'],
                ['Suku ke-5 pola bilangan persegi adalah 20.', false, 'Suku ke-5 = 5² = 25.'],
            ],
        },
        { // 3. Koordinat Kartesius
            pg: [
                ['Titik A(3, −2) terletak di kuadran …', ['IV', 'I', 'II', 'III'], 0, 'x positif dan y negatif berada di kuadran IV.'],
                ['Titik yang terletak pada sumbu-y adalah …', ['(0, −3)', '(4, 0)', '(2, 2)', '(−1, 1)'], 0, 'Titik pada sumbu-y memiliki absis (x) = 0.'],
                ['Jarak titik P(5, 3) terhadap sumbu-x adalah …', ['3 satuan', '5 satuan', '8 satuan', '2 satuan'], 0, 'Jarak ke sumbu-x sama dengan |y| = 3.'],
                ['Titik B(−4, −1) berada di kuadran …', ['III', 'I', 'II', 'IV'], 0, 'x negatif dan y negatif berada di kuadran III.'],
                ['Titik (2, 1) digeser 3 satuan ke kanan. Koordinat barunya …', ['(5, 1)', '(2, 4)', '(−1, 1)', '(5, 4)'], 0, 'Geser ke kanan menambah nilai x: 2 + 3 = 5.'],
                ['Titik asal (origin) pada bidang Kartesius adalah …', ['(0, 0)', '(1, 1)', '(0, 1)', '(1, 0)'], 0, 'Titik potong sumbu-x dan sumbu-y adalah (0, 0).'],
            ],
            bs: [
                ['Pada titik (x, y), x disebut absis dan y disebut ordinat.', true, 'Absis = jarak mendatar, ordinat = jarak tegak.'],
                ['Titik (−2, 5) berada di kuadran I.', false, 'x negatif dan y positif berada di kuadran II.'],
                ['Titik (0, 0) tidak termasuk kuadran mana pun.', true, 'Titik asal berada pada kedua sumbu.'],
                ['Titik (3, 4) dan (4, 3) adalah titik yang sama.', false, 'Urutan koordinat berpengaruh.'],
            ],
        },
        { // 4. Relasi dan Fungsi
            pg: [
                ['Fungsi f(x) = 2x + 1. Nilai f(3) adalah …', ['7', '5', '6', '8'], 0, 'f(3) = 2(3) + 1 = 7.'],
                ['Himpunan pertama (daerah asal) pada fungsi disebut …', ['domain', 'kodomain', 'range', 'relasi'], 0, 'Domain = daerah asal.'],
                ['Jika f(x) = 3x − 2 dan f(a) = 10, maka a = …', ['4', '3', '5', '6'], 0, '3a − 2 = 10 → 3a = 12 → a = 4.'],
                ['Himpunan pasangan berurutan berikut yang merupakan fungsi adalah …', ['{(1,a), (2,a), (3,b)}', '{(1,a), (1,b), (2,c)}', '{(2,a), (2,b), (2,c)}', '{(1,a), (2,b), (2,c)}'], 0, 'Setiap anggota domain dipasangkan tepat satu kali.'],
                ['Daerah hasil f(x) = x + 2 dengan domain {1, 2, 3} adalah …', ['{3, 4, 5}', '{1, 2, 3}', '{2, 3, 4}', '{3, 5, 7}'], 0, 'f(1) = 3, f(2) = 4, f(3) = 5.'],
                ['Banyak pemetaan dari A = {1, 2} ke B = {a, b, c} adalah …', ['9', '6', '8', '5'], 0, 'Banyak pemetaan = n(B)^n(A) = 3² = 9.'],
            ],
            bs: [
                ['Setiap fungsi pasti merupakan relasi.', true, 'Fungsi adalah relasi khusus.'],
                ['Setiap relasi pasti merupakan fungsi.', false, 'Relasi yang memasangkan satu anggota domain ke lebih dari satu anggota bukan fungsi.'],
                ['Jika f(x) = x², maka f(−2) = −4.', false, '(−2)² = 4.'],
                ['Kodomain adalah himpunan kedua (daerah kawan) pada pemetaan.', true, 'Kodomain = daerah kawan.'],
            ],
        },
        { // 5. Persamaan Garis Lurus
            pg: [
                ['Gradien garis y = 3x + 2 adalah …', ['3', '2', '−3', '5'], 0, 'Pada y = mx + c, gradien m = 3.'],
                ['Gradien garis yang melalui (1, 2) dan (3, 6) adalah …', ['2', '1', '3', '4'], 0, 'm = (6 − 2)/(3 − 1) = 2.'],
                ['Persamaan garis dengan gradien 2 yang melalui (0, 1) adalah …', ['y = 2x + 1', 'y = x + 2', 'y = 2x − 1', 'y = x − 2'], 0, 'y = mx + c dengan c = 1.'],
                ['Garis yang sejajar dengan y = −4x + 5 memiliki gradien …', ['−4', '4', '1/4', '−1/4'], 0, 'Garis sejajar memiliki gradien sama.'],
                ['Titik potong garis y = 2x − 6 dengan sumbu-x adalah …', ['(3, 0)', '(0, −6)', '(−3, 0)', '(6, 0)'], 0, 'y = 0 → 2x = 6 → x = 3.'],
                ['Gradien garis 2y = 4x + 8 adalah …', ['2', '4', '8', '1/2'], 0, 'Bagi 2: y = 2x + 4, gradien 2.'],
            ],
            bs: [
                ['Dua garis tegak lurus memiliki hasil kali gradien −1.', true, 'm1 × m2 = −1.'],
                ['Garis y = 5 memiliki gradien 5.', false, 'Garis mendatar memiliki gradien 0.'],
                ['Garis y = x melalui titik (0, 0).', true, 'x = 0 menghasilkan y = 0.'],
                ['Gradien positif berarti garis turun dari kiri ke kanan.', false, 'Gradien positif berarti garis naik dari kiri ke kanan.'],
            ],
        },
        { // 6. Sistem Persamaan Linear Dua Variabel
            pg: [
                ['Penyelesaian dari x + y = 7 dan x − y = 1 adalah …', ['x = 4, y = 3', 'x = 3, y = 4', 'x = 5, y = 2', 'x = 6, y = 1'], 0, 'Jumlahkan: 2x = 8 → x = 4, lalu y = 3.'],
                ['Jika 2x + y = 10 dan x = 3, maka y = …', ['4', '3', '5', '6'], 0, '6 + y = 10 → y = 4.'],
                ['Metode menyelesaikan SPLDV dengan menghilangkan salah satu variabel disebut …', ['eliminasi', 'substitusi', 'grafik', 'faktorisasi'], 0, 'Eliminasi = menghilangkan variabel.'],
                ['Harga 2 buku dan 1 pensil Rp12.000; 1 buku dan 1 pensil Rp7.000. Harga 1 buku adalah …', ['Rp5.000', 'Rp4.000', 'Rp6.000', 'Rp3.000'], 0, 'Kurangkan kedua persamaan: 1 buku = Rp5.000.'],
                ['Jika 3x + 2y = 12 dan x = 2, maka y = …', ['3', '2', '4', '6'], 0, '6 + 2y = 12 → y = 3.'],
                ['Grafik dua persamaan SPLDV yang berpotongan di satu titik menunjukkan …', ['satu penyelesaian', 'tidak ada penyelesaian', 'tak hingga penyelesaian', 'dua penyelesaian'], 0, 'Titik potong = satu penyelesaian.'],
            ],
            bs: [
                ['SPLDV memiliki dua variabel berpangkat satu.', true, 'Contoh: x dan y berpangkat satu.'],
                ['Pasangan x = 2, y = 1 memenuhi x + 2y = 5.', false, '2 + 2(1) = 4, bukan 5.'],
                ['Dua garis sejajar pada SPLDV berarti tidak ada penyelesaian.', true, 'Garis sejajar tidak berpotongan.'],
                ['Metode substitusi dilakukan dengan menjumlahkan dua persamaan.', false, 'Substitusi mengganti variabel dengan nilai/ekspresi dari persamaan lain.'],
            ],
        },
        { // 7. Teorema Pythagoras
            pg: [
                ['Segitiga siku-siku dengan sisi siku 6 cm dan 8 cm memiliki sisi miring …', ['10 cm', '12 cm', '14 cm', '9 cm'], 0, '√(6² + 8²) = √100 = 10.'],
                ['Sisi miring 13 cm dan salah satu sisi siku 5 cm. Sisi siku lainnya …', ['12 cm', '8 cm', '10 cm', '11 cm'], 0, '√(169 − 25) = √144 = 12.'],
                ['Bilangan berikut yang merupakan tripel Pythagoras adalah …', ['5, 12, 13', '3, 4, 6', '6, 7, 9', '4, 5, 7'], 0, '5² + 12² = 169 = 13².'],
                ['Panjang diagonal persegi panjang 9 cm × 12 cm adalah …', ['15 cm', '13 cm', '17 cm', '21 cm'], 0, '√(81 + 144) = √225 = 15.'],
                ['Tangga 5 m bersandar pada tembok, kaki tangga 3 m dari tembok. Tinggi ujung tangga …', ['4 m', '3 m', '2 m', '6 m'], 0, '√(25 − 9) = 4.'],
                ['Segitiga dengan sisi 7, 24, 25 adalah segitiga …', ['siku-siku', 'lancip', 'tumpul', 'sama sisi'], 0, '7² + 24² = 625 = 25².'],
            ],
            bs: [
                ['Teorema Pythagoras hanya berlaku pada segitiga siku-siku.', true, 'a² + b² = c² khusus segitiga siku-siku.'],
                ['Sisi miring adalah sisi terpendek segitiga siku-siku.', false, 'Sisi miring adalah sisi terpanjang.'],
                ['8, 15, 17 merupakan tripel Pythagoras.', true, '64 + 225 = 289 = 17².'],
                ['Jika a² + b² > c² (c sisi terpanjang), segitiga itu tumpul.', false, 'Jika a² + b² > c², segitiga itu lancip.'],
            ],
        },
        { // 8. Lingkaran
            pg: [
                ['Keliling lingkaran berjari-jari 7 cm (π = 22/7) adalah …', ['44 cm', '22 cm', '154 cm', '88 cm'], 0, 'K = 2πr = 2 × 22/7 × 7 = 44.'],
                ['Luas lingkaran berjari-jari 14 cm (π = 22/7) adalah …', ['616 cm²', '308 cm²', '88 cm²', '154 cm²'], 0, 'L = πr² = 22/7 × 196 = 616.'],
                ['Garis yang menghubungkan pusat dengan titik pada lingkaran disebut …', ['jari-jari', 'diameter', 'tali busur', 'apotema'], 0, 'Jari-jari menghubungkan pusat ke keliling lingkaran.'],
                ['Diameter lingkaran yang jari-jarinya 10 cm adalah …', ['20 cm', '5 cm', '10 cm', '31,4 cm'], 0, 'd = 2r = 20.'],
                ['Panjang busur dengan sudut pusat 90° pada lingkaran berjari-jari 14 cm (π = 22/7) …', ['22 cm', '11 cm', '44 cm', '88 cm'], 0, '90/360 × 2 × 22/7 × 14 = 22.'],
                ['Sudut keliling yang menghadap busur sama dengan sudut pusat 80° besarnya …', ['40°', '80°', '160°', '20°'], 0, 'Sudut keliling = ½ sudut pusat.'],
            ],
            bs: [
                ['Diameter adalah tali busur terpanjang.', true, 'Diameter melalui pusat lingkaran.'],
                ['Luas juring sebanding dengan besar sudut pusatnya.', true, 'Luas juring = sudut/360° × πr².'],
                ['Apotema adalah garis dari pusat ke titik pada lingkaran.', false, 'Apotema adalah jarak terpendek dari pusat ke tali busur.'],
                ['Keliling lingkaran berdiameter 14 cm adalah 88 cm.', false, 'K = πd = 22/7 × 14 = 44 cm.'],
            ],
        },
        { // 9. Garis Singgung Lingkaran
            pg: [
                ['Garis singgung lingkaran selalu … terhadap jari-jari di titik singgungnya.', ['tegak lurus', 'sejajar', 'berimpit', 'membentuk 45°'], 0, 'Garis singgung tegak lurus jari-jari.'],
                ['Jarak titik P ke pusat lingkaran 10 cm, jari-jari 6 cm. Panjang garis singgung dari P …', ['8 cm', '4 cm', '16 cm', '12 cm'], 0, '√(100 − 36) = 8.'],
                ['Dari satu titik di luar lingkaran dapat dibuat … garis singgung.', ['2', '1', '3', 'tak hingga'], 0, 'Selalu ada dua garis singgung.'],
                ['Panjang garis singgung 12 cm, jari-jari 5 cm. Jarak titik ke pusat …', ['13 cm', '17 cm', '7 cm', '10 cm'], 0, '√(144 + 25) = 13.'],
                ['Jari-jari dua lingkaran 7 cm dan 2 cm, jarak pusat 13 cm. Garis singgung persekutuan luar …', ['12 cm', '10 cm', '11 cm', '9 cm'], 0, '√(13² − (7 − 2)²) = √144 = 12.'],
                ['Jari-jari dua lingkaran 4 cm dan 1 cm, jarak pusat 13 cm. Garis singgung persekutuan dalam …', ['12 cm', '10 cm', '11 cm', '8 cm'], 0, '√(13² − (4 + 1)²) = √144 = 12.'],
            ],
            bs: [
                ['Garis singgung lingkaran memotong lingkaran di dua titik.', false, 'Garis singgung menyentuh di tepat satu titik.'],
                ['Dua garis singgung dari titik yang sama di luar lingkaran sama panjang.', true, 'Kedua garis singgung sama panjang.'],
                ['Garis singgung persekutuan dalam melintas di antara kedua lingkaran.', true, 'Ia memotong garis pusat kedua lingkaran.'],
                ['Rumus garis singgung persekutuan luar memakai jumlah jari-jari.', false, 'Persekutuan luar memakai selisih jari-jari.'],
            ],
        },
        { // 10. Bangun Ruang Sisi Datar
            pg: [
                ['Volume kubus dengan rusuk 5 cm adalah …', ['125 cm³', '25 cm³', '150 cm³', '100 cm³'], 0, 'V = s³ = 125.'],
                ['Luas permukaan kubus dengan rusuk 4 cm adalah …', ['96 cm²', '64 cm²', '16 cm²', '48 cm²'], 0, 'L = 6s² = 96.'],
                ['Volume balok 6 cm × 4 cm × 3 cm adalah …', ['72 cm³', '13 cm³', '36 cm³', '52 cm³'], 0, 'V = p × l × t = 72.'],
                ['Banyak rusuk pada balok adalah …', ['12', '6', '8', '10'], 0, 'Balok memiliki 12 rusuk.'],
                ['Volume prisma dengan luas alas 20 cm² dan tinggi 10 cm adalah …', ['200 cm³', '30 cm³', '100 cm³', '2.000 cm³'], 0, 'V = luas alas × tinggi = 200.'],
                ['Volume limas dengan luas alas 36 cm² dan tinggi 10 cm adalah …', ['120 cm³', '360 cm³', '180 cm³', '36 cm³'], 0, 'V = ⅓ × 36 × 10 = 120.'],
            ],
            bs: [
                ['Kubus memiliki 6 sisi berbentuk persegi.', true, 'Semua sisi kubus berbentuk persegi yang kongruen.'],
                ['Limas segi empat memiliki 5 titik sudut.', true, '4 titik sudut alas + 1 titik puncak.'],
                ['Prisma segitiga memiliki 6 sisi.', false, 'Prisma segitiga memiliki 5 sisi (2 alas + 3 sisi tegak).'],
                ['Volume limas sama dengan volume prisma yang alas dan tingginya sama.', false, 'Volume limas = ⅓ volume prisma.'],
            ],
        },
        { // 11. Statistika
            pg: [
                ['Rata-rata dari data 6, 7, 8, 9, 10 adalah …', ['8', '7', '9', '7,5'], 0, '40 : 5 = 8.'],
                ['Median dari data 3, 7, 5, 9, 1 adalah …', ['5', '3', '7', '9'], 0, 'Urutkan: 1, 3, 5, 7, 9 → nilai tengah 5.'],
                ['Modus dari data 4, 5, 5, 6, 7, 5, 8 adalah …', ['5', '4', '6', '7'], 0, '5 muncul paling sering.'],
                ['Jangkauan dari data 12, 15, 9, 20, 14 adalah …', ['11', '9', '20', '14'], 0, '20 − 9 = 11.'],
                ['Rata-rata 4 bilangan adalah 7. Jika ditambah bilangan 12, rata-ratanya menjadi …', ['8', '9', '7,5', '10'], 0, '(28 + 12) : 5 = 8.'],
                ['Median dari data 2, 4, 6, 8 adalah …', ['5', '4', '6', '4,5'], 0, '(4 + 6) : 2 = 5.'],
            ],
            bs: [
                ['Modus adalah nilai yang paling sering muncul.', true, 'Itulah definisi modus.'],
                ['Median selalu sama dengan rata-rata.', false, 'Median dan rata-rata bisa berbeda.'],
                ['Data harus diurutkan sebelum menentukan median.', true, 'Median adalah nilai tengah data terurut.'],
                ['Sebuah data tidak mungkin memiliki lebih dari satu modus.', false, 'Data dapat memiliki dua modus atau lebih.'],
            ],
        },
        { // 12. Peluang
            pg: [
                ['Peluang muncul mata dadu genap pada pelemparan satu dadu adalah …', ['1/2', '1/6', '1/3', '2/3'], 0, '{2, 4, 6} → 3/6 = 1/2.'],
                ['Sebuah koin dilempar sekali. Peluang muncul gambar adalah …', ['1/2', '0', '1/4', '1'], 0, 'Ada dua kemungkinan yang sama besar.'],
                ['Kantong berisi 3 bola merah dan 5 bola biru. Peluang terambil bola merah …', ['3/8', '3/5', '5/8', '1/3'], 0, '3 : (3 + 5) = 3/8.'],
                ['Peluang kejadian yang pasti terjadi adalah …', ['1', '0', '0,5', '2'], 0, 'Kejadian pasti bernilai 1.'],
                ['Dadu dilempar 60 kali. Frekuensi harapan muncul mata 3 adalah …', ['10', '6', '12', '20'], 0, '1/6 × 60 = 10.'],
                ['Banyak titik sampel pelemparan dua koin adalah …', ['4', '2', '3', '6'], 0, 'AA, AG, GA, GG.'],
            ],
            bs: [
                ['Nilai peluang berada di antara 0 dan 1.', true, '0 ≤ P(A) ≤ 1.'],
                ['Peluang muncul mata 7 pada satu dadu adalah 1/7.', false, 'Mata 7 tidak ada, peluangnya 0.'],
                ['Peluang komplemen A adalah 1 − P(A).', true, 'P(Aᶜ) = 1 − P(A).'],
                ['Ruang sampel pelemparan satu dadu memiliki 12 titik sampel.', false, 'Ruang sampel satu dadu memiliki 6 titik sampel.'],
            ],
        },
    ],
    'Bahasa Inggris': [
        { // 1. Introduction
            pg: [
                ['"Hello, my name is Rina." Kalimat ini digunakan untuk …', ['memperkenalkan diri', 'meminta maaf', 'berterima kasih', 'berpamitan'], 0, 'Kalimat tersebut adalah perkenalan diri.'],
                ['"Nice to meet you." Respons yang tepat adalah …', ['Nice to meet you too.', 'Good night.', 'I am sorry.', 'See you.'], 0, 'Balasan yang umum: "Nice to meet you too."'],
                ['"Where are you from?" — "I … from Bandung."', ['am', 'is', 'are', 'be'], 0, 'Subjek I memakai "am".'],
                ['Kalimat untuk memperkenalkan orang lain adalah …', ['This is my friend, Dimas.', 'I am Dimas.', 'Goodbye, Dimas.', 'Thank you, Dimas.'], 0, '"This is …" dipakai untuk memperkenalkan orang lain.'],
                ['"How old are you?" menanyakan …', ['umur', 'alamat', 'hobi', 'nama'], 0, '"How old" = berapa umur.'],
                ['"I live … Jalan Merdeka No. 5."', ['at', 'in', 'on', 'to'], 0, 'Alamat lengkap memakai preposisi "at".'],
            ],
            bs: [
                ['"My hobby is reading" berarti hobiku membaca.', true, 'Terjemahannya tepat.'],
                ['"Goodbye" diucapkan saat bertemu seseorang.', false, '"Goodbye" diucapkan saat berpisah.'],
                ['"What is your name?" menanyakan nama.', true, 'Name = nama.'],
                ['Subjek "She" diikuti "am".', false, '"She" diikuti "is".'],
            ],
        },
        { // 2. Greetings and Vocabulary
            pg: [
                ['Sapaan yang tepat pukul 08.00 pagi adalah …', ['Good morning', 'Good evening', 'Good night', 'Good afternoon'], 0, 'Pagi hari = Good morning.'],
                ['"How are you?" — "…"', ['I am fine, thank you.', 'I am ten.', 'My name is Budi.', 'Good night.'], 0, 'Pertanyaan kabar dijawab dengan keadaan.'],
                ['Kata "teacher" berarti …', ['guru', 'siswa', 'kepala sekolah', 'pustakawan'], 0, 'Teacher = guru.'],
                ['"Good afternoon" diucapkan sekitar pukul …', ['14.00', '07.00', '10.00', '21.00'], 0, 'Afternoon = siang hingga sore.'],
                ['Lawan kata "big" adalah …', ['small', 'tall', 'long', 'wide'], 0, 'big ↔ small.'],
                ['"See you tomorrow" diucapkan saat …', ['berpisah', 'bertemu', 'meminta tolong', 'meminta maaf'], 0, 'Ungkapan perpisahan.'],
            ],
            bs: [
                ['"Good night" diucapkan saat bertemu seseorang di malam hari.', false, 'Bertemu malam hari memakai "Good evening"; "Good night" untuk berpamitan.'],
                ['"Library" berarti perpustakaan.', true, 'Library = perpustakaan.'],
                ['"I am fine" adalah jawaban untuk "How are you?".', true, 'Menyatakan kabar baik.'],
                ['Kata "blackboard" berarti penghapus.', false, 'Blackboard = papan tulis; eraser = penghapus.'],
            ],
        },
        { // 3. Describing People
            pg: [
                ['"She has long straight hair." Kalimat ini mendeskripsikan …', ['rambut', 'sifat', 'pekerjaan', 'hobi'], 0, 'Hair = rambut.'],
                ['Kata sifat untuk orang yang suka membantu adalah …', ['helpful', 'lazy', 'rude', 'shy'], 0, 'Helpful = suka membantu.'],
                ['"He is tall and thin." Kata "thin" berarti …', ['kurus', 'gemuk', 'pendek', 'tinggi'], 0, 'Thin = kurus.'],
                ['Pertanyaan untuk menanyakan ciri fisik seseorang adalah …', ['What does he look like?', 'Where does he live?', 'What does he do?', 'How old is he?'], 0, '"What does … look like?" menanyakan ciri fisik.'],
                ['"My brother … curly hair."', ['has', 'have', 'is', 'are'], 0, 'He/She/It diikuti "has".'],
                ['Lawan kata "friendly" adalah …', ['unfriendly', 'kind', 'smart', 'polite'], 0, 'Awalan un- membentuk lawan kata.'],
            ],
            bs: [
                ['"Diligent" berarti rajin.', true, 'Diligent = rajin.'],
                ['"He is shy" berarti dia pemberani.', false, 'Shy = pemalu.'],
                ['"What is she like?" menanyakan sifat seseorang.', true, 'Pertanyaan tentang karakter.'],
                ['"I has a round face" adalah kalimat yang benar.', false, 'Subjek I memakai "have".'],
            ],
        },
        { // 4. Simple Present Tense
            pg: [
                ['She … to school every day.', ['goes', 'go', 'going', 'went'], 0, 'Subjek tunggal she + V1-s/es.'],
                ['They … football every Sunday.', ['play', 'plays', 'playing', 'played'], 0, 'They + V1 tanpa -s.'],
                ['… he like coffee?', ['Does', 'Do', 'Is', 'Are'], 0, 'He memakai "Does".'],
                ['The sun … in the east.', ['rises', 'rise', 'rising', 'rose'], 0, 'Fakta umum dengan subjek tunggal.'],
                ['Kalimat negatif yang benar adalah …', ['He does not eat meat.', 'I does not eat meat.', 'She do not eat meat.', 'They does not eat meat.'], 0, 'He + does not + V1.'],
                ['Simple present tense digunakan untuk menyatakan …', ['kebiasaan dan fakta', 'kejadian lampau', 'rencana pasti', 'kejadian yang sedang berlangsung'], 0, 'Kebiasaan dan kebenaran umum.'],
            ],
            bs: [
                ['"My mother cooks every morning" sudah benar.', true, 'Subjek tunggal + V1-s.'],
                ['"He don\'t like milk" sudah benar.', false, 'Seharusnya "He doesn\'t like milk".'],
                ['Kata "usually" sering dipakai dalam simple present tense.', true, 'Adverb of frequency menunjukkan kebiasaan.'],
                ['"Water boil at 100°C" sudah benar.', false, 'Seharusnya "Water boils at 100°C".'],
            ],
        },
        { // 5. Asking and Giving Opinion
            pg: [
                ['"What do you think about the movie?" adalah ungkapan untuk …', ['meminta pendapat', 'memberi pendapat', 'meminta maaf', 'menolak'], 0, 'Kalimat tanya untuk meminta pendapat.'],
                ['Ungkapan untuk memberi pendapat adalah …', ['In my opinion, …', 'Can you help me?', 'Excuse me.', 'How are you?'], 0, '"In my opinion" = menurut pendapat saya.'],
                ['"I agree with you" berarti …', ['saya setuju', 'saya tidak setuju', 'saya ragu', 'saya bingung'], 0, 'Agree = setuju.'],
                ['"How do you feel about online learning?" — "…"', ['I think it is helpful.', 'I am twelve.', 'It is Monday.', 'Yes, I do.'], 0, 'Jawaban berupa pendapat.'],
                ['Ungkapan tidak setuju adalah …', ['I disagree.', 'I think so.', 'Exactly.', 'That\'s right.'], 0, 'Disagree = tidak setuju.'],
                ['"I believe our school needs a bigger library." Kalimat ini berisi …', ['pendapat', 'pertanyaan', 'perintah', 'larangan'], 0, '"I believe" menyatakan pendapat.'],
            ],
            bs: [
                ['"I don\'t think so" menunjukkan ketidaksetujuan.', true, 'Ungkapan tidak setuju yang halus.'],
                ['"In my view" digunakan untuk meminta pendapat.', false, '"In my view" digunakan untuk memberi pendapat.'],
                ['"What\'s your opinion?" meminta pendapat orang lain.', true, 'Opinion = pendapat.'],
                ['"Absolutely" menunjukkan ketidaksetujuan.', false, '"Absolutely" menunjukkan sangat setuju.'],
            ],
        },
        { // 6. Descriptive Text
            pg: [
                ['Tujuan descriptive text adalah …', ['mendeskripsikan orang/benda/tempat', 'menceritakan pengalaman', 'menjelaskan langkah', 'membujuk pembaca'], 0, 'Descriptive = menggambarkan.'],
                ['Struktur descriptive text adalah …', ['identification – description', 'orientation – events – reorientation', 'goal – materials – steps', 'thesis – arguments – conclusion'], 0, 'Identifikasi lalu deskripsi.'],
                ['Tense yang umum dipakai dalam descriptive text adalah …', ['simple present', 'simple past', 'future', 'past perfect'], 0, 'Fakta tentang objek memakai simple present.'],
                ['"Borobudur is a magnificent temple in Magelang." Bagian ini termasuk …', ['identification', 'description', 'resolution', 'complication'], 0, 'Kalimat yang memperkenalkan objek.'],
                ['Kata "magnificent" berarti …', ['megah', 'kecil', 'tua', 'sepi'], 0, 'Magnificent = megah.'],
                ['Contoh judul descriptive text adalah …', ['My Cat, Kitty', 'My Holiday in Bali', 'How to Make Tea', 'The Legend of Toba Lake'], 0, 'Mendeskripsikan seekor kucing.'],
            ],
            bs: [
                ['Descriptive text banyak menggunakan kata sifat.', true, 'Kata sifat menggambarkan ciri objek.'],
                ['Descriptive text menggunakan struktur goal dan steps.', false, 'Itu struktur procedure text.'],
                ['Bagian description berisi ciri-ciri objek.', true, 'Description merinci ciri objek.'],
                ['Descriptive text selalu ditulis dalam simple past tense.', false, 'Umumnya memakai simple present tense.'],
            ],
        },
        { // 7. Simple Past Tense
            pg: [
                ['I … to Bali last year.', ['went', 'go', 'goes', 'gone'], 0, 'Last year → V2: went.'],
                ['She … her homework yesterday.', ['finished', 'finish', 'finishes', 'finishing'], 0, 'Yesterday → V2.'],
                ['Did you … the movie last night?', ['watch', 'watched', 'watches', 'watching'], 0, 'Did + V1.'],
                ['They … not come to the party.', ['did', 'do', 'does', 'done'], 0, 'Kalimat negatif lampau: did not + V1.'],
                ['Bentuk kedua (V2) dari "buy" adalah …', ['bought', 'buyed', 'buys', 'brought'], 0, 'buy – bought – bought.'],
                ['Keterangan waktu simple past tense adalah …', ['yesterday', 'tomorrow', 'every day', 'now'], 0, 'Yesterday = kemarin.'],
            ],
            bs: [
                ['"He visited his grandmother last week" sudah benar.', true, 'V2 dengan keterangan waktu lampau.'],
                ['"Did she went to school?" sudah benar.', false, 'Did + V1: "Did she go to school?"'],
                ['"Eat" memiliki bentuk lampau "ate".', true, 'eat – ate – eaten.'],
                ['Simple past tense digunakan untuk kebiasaan sekarang.', false, 'Simple past untuk kejadian lampau.'],
            ],
        },
        { // 8. Recount Text
            pg: [
                ['Tujuan recount text adalah …', ['menceritakan pengalaman masa lalu', 'mendeskripsikan benda', 'memberi petunjuk', 'membujuk'], 0, 'Recount = menceritakan kembali pengalaman.'],
                ['Struktur recount text adalah …', ['orientation – events – reorientation', 'identification – description', 'goal – steps', 'issue – arguments'], 0, 'Orientasi, urutan kejadian, reorientasi.'],
                ['Bagian yang berisi urutan kejadian disebut …', ['events', 'orientation', 'reorientation', 'coda'], 0, 'Events = rangkaian kejadian.'],
                ['Kata penghubung waktu dalam recount text adalah …', ['then', 'because', 'but', 'although'], 0, '"Then" menunjukkan urutan waktu.'],
                ['"Last holiday, my family and I went to Yogyakarta." Kalimat ini termasuk …', ['orientation', 'events', 'reorientation', 'resolution'], 0, 'Memperkenalkan siapa, kapan, dan di mana.'],
                ['Reorientation berisi …', ['kesan atau penutup', 'pengenalan tokoh', 'langkah-langkah', 'alasan'], 0, 'Reorientasi = penutup/kesan.'],
            ],
            bs: [
                ['Recount text umumnya memakai simple past tense.', true, 'Menceritakan kejadian lampau.'],
                ['Recount text selalu memiliki complication.', false, 'Complication ada pada narrative text.'],
                ['"Finally" dapat digunakan di akhir bagian events.', true, 'Menunjukkan kejadian terakhir.'],
                ['Orientation berisi kesan penulis.', false, 'Orientation memperkenalkan siapa, kapan, dan di mana.'],
            ],
        },
        { // 9. Invitation and Announcement
            pg: [
                ['Tujuan teks undangan adalah …', ['mengajak seseorang hadir dalam acara', 'menjelaskan cara membuat sesuatu', 'menceritakan pengalaman', 'mendeskripsikan tempat'], 0, 'Invitation = undangan.'],
                ['"Would you like to come to my birthday party?" adalah ungkapan …', ['mengundang', 'menolak undangan', 'menerima undangan', 'meminta maaf'], 0, '"Would you like to come …" = mengundang.'],
                ['Respons untuk menerima undangan adalah …', ['I\'d love to.', 'Sorry, I can\'t.', 'I\'m busy.', 'No, thanks.'], 0, '"I\'d love to" = saya senang sekali hadir.'],
                ['Informasi yang wajib ada dalam undangan adalah …', ['waktu dan tempat acara', 'resep makanan', 'biografi tamu', 'harga tiket pesawat'], 0, 'Tamu perlu tahu kapan dan di mana.'],
                ['Pengumuman (announcement) biasanya ditujukan kepada …', ['khalayak umum', 'satu orang tertentu', 'diri sendiri', 'keluarga inti saja'], 0, 'Pengumuman untuk banyak orang.'],
                ['"All students must gather in the hall at 7 a.m." Kalimat ini bagian dari …', ['pengumuman', 'undangan pribadi', 'resep', 'biografi'], 0, 'Berisi informasi untuk seluruh siswa.'],
            ],
            bs: [
                ['"I\'m afraid I can\'t come" adalah ungkapan menolak undangan.', true, 'Penolakan yang sopan.'],
                ['Pengumuman tidak perlu mencantumkan waktu.', false, 'Waktu adalah informasi penting dalam pengumuman.'],
                ['RSVP berarti mohon konfirmasi kehadiran.', true, 'Répondez s\'il vous plaît.'],
                ['Undangan resmi boleh tanpa nama pengundang.', false, 'Nama pengundang perlu dicantumkan.'],
            ],
        },
        { // 10. Comparison Degree
            pg: [
                ['Ani is … than Rina.', ['taller', 'tall', 'tallest', 'more tall'], 0, 'Komparatif kata pendek: -er + than.'],
                ['Mount Everest is the … mountain in the world.', ['highest', 'high', 'higher', 'most high'], 0, 'Superlatif: the + -est.'],
                ['This book is … expensive than that one.', ['more', 'much', 'most', 'many'], 0, 'Kata panjang: more + adjective.'],
                ['Bentuk komparatif dari "good" adalah …', ['better', 'gooder', 'best', 'more good'], 0, 'good – better – best.'],
                ['Budi is as … as Andi.', ['tall', 'taller', 'tallest', 'the tallest'], 0, 'as + adjective + as.'],
                ['Bentuk superlatif dari "beautiful" adalah …', ['most beautiful', 'beautifullest', 'more beautiful', 'beautifuller'], 0, 'Kata panjang: the most + adjective.'],
            ],
            bs: [
                ['"Bad – worse – worst" adalah bentuk perbandingan yang benar.', true, 'Bentuk tidak beraturan.'],
                ['"She is more smarter than me" sudah benar.', false, 'Cukup "smarter" tanpa "more".'],
                ['Superlatif biasanya didahului "the".', true, 'Contoh: the tallest.'],
                ['"As big as" digunakan untuk dua hal yang berbeda ukurannya.', false, '"As … as" untuk dua hal yang sama.'],
            ],
        },
        { // 11. Narrative Text
            pg: [
                ['Tujuan narrative text adalah …', ['menghibur pembaca dengan cerita', 'menjelaskan langkah', 'mendeskripsikan benda', 'melaporkan berita'], 0, 'Narrative bertujuan menghibur.'],
                ['Struktur narrative text adalah …', ['orientation – complication – resolution', 'goal – materials – steps', 'identification – description', 'thesis – arguments'], 0, 'Orientasi, konflik, penyelesaian.'],
                ['Bagian yang berisi puncak masalah disebut …', ['complication', 'orientation', 'resolution', 'coda'], 0, 'Complication = konflik.'],
                ['Contoh narrative text adalah …', ['Malin Kundang', 'How to Make Coffee', 'My School', 'Announcement of Holiday'], 0, 'Cerita rakyat termasuk narrative.'],
                ['Resolution berisi …', ['penyelesaian masalah', 'awal cerita', 'pengenalan tokoh', 'judul cerita'], 0, 'Resolution = penyelesaian.'],
                ['Pesan moral cerita biasanya terdapat pada bagian …', ['coda', 'orientation', 'complication', 'title'], 0, 'Coda berisi pesan moral.'],
            ],
            bs: [
                ['Fabel termasuk narrative text.', true, 'Fabel adalah cerita fiksi.'],
                ['Narrative text tidak memiliki konflik.', false, 'Complication adalah konflik.'],
                ['Narrative text umumnya memakai simple past tense.', true, 'Cerita terjadi di masa lampau.'],
                ['Orientation berisi penyelesaian masalah.', false, 'Orientation memperkenalkan tokoh, waktu, dan tempat.'],
            ],
        },
        { // 12. Grammar Review
            pg: [
                ['She … reading a book now.', ['is', 'are', 'am', 'be'], 0, 'Present continuous: she is + V-ing.'],
                ['We … to the zoo last Sunday.', ['went', 'go', 'goes', 'going'], 0, 'Last Sunday → simple past.'],
                ['My father … coffee every morning.', ['drinks', 'drink', 'drank', 'drinking'], 0, 'Kebiasaan, subjek tunggal.'],
                ['This bag is … than that bag.', ['heavier', 'heavy', 'heaviest', 'more heavy'], 0, 'heavy → heavier.'],
                ['There … many students in the hall.', ['are', 'is', 'am', 'be'], 0, 'Subjek jamak memakai "are".'],
                ['I will … my grandmother tomorrow.', ['visit', 'visited', 'visits', 'visiting'], 0, 'Will + V1.'],
            ],
            bs: [
                ['"He can swims" sudah benar.', false, 'Modal can + V1: "He can swim".'],
                ['"Will" digunakan untuk menyatakan masa depan.', true, 'Simple future tense.'],
                ['"There is two books" sudah benar.', false, 'Benda jamak: "There are two books".'],
                ['"They were playing" adalah past continuous tense.', true, 'was/were + V-ing.'],
            ],
        },
    ],
    'IPA': [
        { // 1. Gerak Lurus
            pg: [
                ['Gerak lurus dengan kecepatan tetap disebut …', ['GLB', 'GLBB', 'gerak melingkar', 'gerak parabola'], 0, 'GLB = Gerak Lurus Beraturan.'],
                ['Mobil menempuh 120 km dalam 2 jam. Kecepatannya …', ['60 km/jam', '40 km/jam', '80 km/jam', '240 km/jam'], 0, 'v = s : t = 120 : 2 = 60.'],
                ['Satuan percepatan dalam SI adalah …', ['m/s²', 'm/s', 'km/jam', 'N'], 0, 'Percepatan = perubahan kecepatan per sekon.'],
                ['Benda jatuh bebas merupakan contoh …', ['GLBB dipercepat', 'GLB', 'GLBB diperlambat', 'gerak melingkar'], 0, 'Kecepatannya bertambah karena gravitasi.'],
                ['Sepeda bergerak 5 m/s selama 20 s. Jarak tempuhnya …', ['100 m', '4 m', '25 m', '15 m'], 0, 's = v × t = 100 m.'],
                ['Mobil yang direm hingga berhenti mengalami …', ['GLBB diperlambat', 'GLB', 'GLBB dipercepat', 'gerak tetap'], 0, 'Kecepatannya berkurang teratur.'],
            ],
            bs: [
                ['Pada GLB, percepatannya nol.', true, 'Kecepatan tetap berarti tidak ada percepatan.'],
                ['Kelajuan adalah besaran vektor.', false, 'Kelajuan besaran skalar; kecepatan besaran vektor.'],
                ['Perpindahan memperhatikan arah.', true, 'Perpindahan adalah besaran vektor.'],
                ['Pada GLBB, kecepatan benda selalu tetap.', false, 'Pada GLBB kecepatan berubah secara teratur.'],
            ],
        },
        { // 2. Sistem Pernapasan
            pg: [
                ['Pertukaran O₂ dan CO₂ terjadi di …', ['alveolus', 'trakea', 'bronkus', 'faring'], 0, 'Alveolus dikelilingi kapiler darah.'],
                ['Otot yang berperan dalam pernapasan perut adalah …', ['diafragma', 'otot antartulang rusuk', 'otot jantung', 'otot bisep'], 0, 'Pernapasan perut digerakkan diafragma.'],
                ['Saluran pernapasan yang dilengkapi cincin tulang rawan adalah …', ['trakea', 'alveolus', 'hidung', 'laring'], 0, 'Cincin tulang rawan menjaga trakea tetap terbuka.'],
                ['Penyakit akibat bakteri Mycobacterium tuberculosis adalah …', ['TBC', 'asma', 'influenza', 'bronkitis'], 0, 'TBC disebabkan Mycobacterium tuberculosis.'],
                ['Udara pertama kali masuk melalui …', ['hidung', 'laring', 'trakea', 'paru-paru'], 0, 'Hidung menyaring dan menghangatkan udara.'],
                ['Saat inspirasi, rongga dada …', ['membesar', 'mengecil', 'tetap', 'menutup'], 0, 'Volume dada membesar sehingga udara masuk.'],
            ],
            bs: [
                ['Paru-paru kanan memiliki tiga lobus.', true, 'Kanan 3 lobus, kiri 2 lobus.'],
                ['Epiglotis mencegah makanan masuk ke kerongkongan.', false, 'Epiglotis mencegah makanan masuk ke tenggorokan (trakea).'],
                ['Asma menyebabkan penyempitan saluran pernapasan.', true, 'Saluran napas menyempit sehingga sesak.'],
                ['Saat ekspirasi, diafragma berkontraksi dan mendatar.', false, 'Saat ekspirasi diafragma relaksasi dan melengkung.'],
            ],
        },
        { // 3. Gaya dan Hukum Newton
            pg: [
                ['Satuan gaya dalam SI adalah …', ['newton', 'joule', 'watt', 'pascal'], 0, 'Gaya diukur dalam newton (N).'],
                ['Benda 2 kg diberi gaya 10 N. Percepatannya …', ['5 m/s²', '2 m/s²', '10 m/s²', '20 m/s²'], 0, 'a = F : m = 5.'],
                ['Penumpang terdorong ke depan saat bus direm mendadak sesuai Hukum …', ['I Newton', 'II Newton', 'III Newton', 'Archimedes'], 0, 'Hukum kelembaman (inersia).'],
                ['Gaya yang berlawanan arah gerak benda pada permukaan adalah gaya …', ['gesek', 'gravitasi', 'magnet', 'pegas'], 0, 'Gaya gesek menghambat gerak.'],
                ['Peluncuran roket merupakan penerapan Hukum …', ['III Newton', 'I Newton', 'II Newton', 'Pascal'], 0, 'Aksi–reaksi.'],
                ['Resultan gaya 8 N ke kanan dan 3 N ke kiri adalah …', ['5 N ke kanan', '11 N ke kanan', '5 N ke kiri', '11 N ke kiri'], 0, 'Gaya berlawanan arah dikurangkan.'],
            ],
            bs: [
                ['Berat benda bergantung pada percepatan gravitasi.', true, 'w = m × g.'],
                ['Massa benda di Bulan lebih kecil daripada di Bumi.', false, 'Massa tetap; yang berubah beratnya.'],
                ['Gaya aksi dan reaksi bekerja pada dua benda berbeda.', true, 'Sesuai Hukum III Newton.'],
                ['Gaya gesek selalu merugikan.', false, 'Gaya gesek juga bermanfaat, misalnya saat berjalan.'],
            ],
        },
        { // 4. Usaha dan Pesawat Sederhana
            pg: [
                ['Gaya 20 N memindahkan benda sejauh 5 m. Usahanya …', ['100 J', '4 J', '25 J', '15 J'], 0, 'W = F × s = 100 J.'],
                ['Gunting merupakan tuas jenis …', ['pertama', 'kedua', 'ketiga', 'keempat'], 0, 'Titik tumpu berada di tengah.'],
                ['Keuntungan mekanis katrol tetap adalah …', ['1', '2', '3', '0,5'], 0, 'Katrol tetap hanya mengubah arah gaya.'],
                ['Bidang miring digunakan untuk …', ['memperkecil gaya yang diperlukan', 'memperbesar gaya', 'menambah berat beban', 'mengubah massa'], 0, 'Lintasan lebih panjang, gaya lebih kecil.'],
                ['Satuan daya adalah …', ['watt', 'joule', 'newton', 'meter'], 0, 'Daya = usaha per waktu (watt).'],
                ['Gerobak dorong termasuk tuas jenis …', ['kedua', 'pertama', 'ketiga', 'tidak termasuk tuas'], 0, 'Beban berada di tengah.'],
            ],
            bs: [
                ['Usaha bernilai nol jika benda tidak berpindah.', true, 'W = F × s, dengan s = 0.'],
                ['Pinset termasuk tuas jenis kedua.', false, 'Pinset termasuk tuas jenis ketiga.'],
                ['Sekrup merupakan penerapan bidang miring.', true, 'Ulir sekrup = bidang miring melingkar.'],
                ['Katrol majemuk memiliki keuntungan mekanis 1.', false, 'Keuntungan mekanisnya lebih dari 1.'],
            ],
        },
        { // 5. Struktur Tumbuhan
            pg: [
                ['Jaringan pengangkut air dari akar ke daun adalah …', ['xilem', 'floem', 'epidermis', 'kambium'], 0, 'Xilem mengangkut air dan mineral.'],
                ['Fotosintesis terjadi di organel …', ['kloroplas', 'mitokondria', 'vakuola', 'inti sel'], 0, 'Kloroplas mengandung klorofil.'],
                ['Stomata berfungsi untuk …', ['pertukaran gas', 'menyerap air', 'menyimpan makanan', 'penopang'], 0, 'Stomata = mulut daun.'],
                ['Hasil fotosintesis yang diangkut floem adalah …', ['zat makanan (gula)', 'air', 'mineral', 'oksigen'], 0, 'Floem mengangkut hasil fotosintesis.'],
                ['Jaringan yang aktif membelah disebut jaringan …', ['meristem', 'epidermis', 'parenkim', 'sklerenkim'], 0, 'Meristem = jaringan muda yang aktif membelah.'],
                ['Bagian akar yang menyerap air dan mineral adalah …', ['rambut akar', 'tudung akar', 'batang', 'kambium'], 0, 'Rambut akar memperluas bidang penyerapan.'],
            ],
            bs: [
                ['Klorofil memberi warna hijau pada daun.', true, 'Klorofil = zat hijau daun.'],
                ['Floem mengangkut air dari akar ke daun.', false, 'Itu tugas xilem.'],
                ['Fotosintesis membutuhkan cahaya matahari.', true, 'Cahaya adalah sumber energi fotosintesis.'],
                ['Tumbuhan monokotil umumnya memiliki kambium.', false, 'Monokotil umumnya tidak berkambium.'],
            ],
        },
        { // 6. Sistem Pencernaan
            pg: [
                ['Enzim ptialin terdapat di …', ['mulut', 'lambung', 'usus halus', 'usus besar'], 0, 'Ptialin dihasilkan kelenjar ludah.'],
                ['Penyerapan sari makanan terutama terjadi di …', ['usus halus', 'lambung', 'usus besar', 'kerongkongan'], 0, 'Vili usus halus menyerap sari makanan.'],
                ['Gerak peristaltik terjadi di …', ['kerongkongan', 'gigi', 'lidah', 'hati'], 0, 'Gerak meremas mendorong makanan.'],
                ['Asam klorida (HCl) di lambung berfungsi …', ['membunuh kuman', 'mencerna lemak', 'menyerap air', 'menghasilkan empedu'], 0, 'HCl juga mengaktifkan pepsinogen.'],
                ['Penyerapan air terjadi di …', ['usus besar', 'lambung', 'mulut', 'pankreas'], 0, 'Usus besar menyerap kembali air.'],
                ['Gangguan pencernaan akibat kurang serat adalah …', ['sembelit', 'diare', 'maag', 'hepatitis'], 0, 'Serat membantu melancarkan buang air besar.'],
            ],
            bs: [
                ['Hati menghasilkan cairan empedu.', true, 'Empedu membantu mengemulsi lemak.'],
                ['Pencernaan kimiawi hanya terjadi di mulut.', false, 'Juga terjadi di lambung dan usus halus.'],
                ['Pankreas menghasilkan enzim amilase, lipase, dan tripsin.', true, 'Enzim pankreas dialirkan ke usus halus.'],
                ['Usus buntu adalah tempat utama penyerapan sari makanan.', false, 'Penyerapan utama di usus halus.'],
            ],
        },
        { // 7. Zat Aditif dan Adiktif
            pg: [
                ['Zat tambahan makanan yang memberi rasa manis adalah …', ['pemanis', 'pengawet', 'pewarna', 'pengental'], 0, 'Contoh: gula, aspartam.'],
                ['Contoh pewarna alami adalah …', ['kunyit', 'tartrazin', 'sakarin', 'boraks'], 0, 'Kunyit memberi warna kuning.'],
                ['Zat yang menimbulkan ketergantungan disebut zat …', ['adiktif', 'aditif', 'gizi', 'mineral'], 0, 'Adiktif = menimbulkan kecanduan.'],
                ['Contoh pengawet alami adalah …', ['garam', 'formalin', 'boraks', 'rhodamin B'], 0, 'Garam menghambat pertumbuhan mikroba.'],
                ['Nikotin terdapat pada …', ['rokok', 'kopi', 'teh', 'cokelat'], 0, 'Nikotin adalah zat adiktif pada tembakau.'],
                ['Boraks berbahaya bila digunakan sebagai …', ['pengawet makanan', 'bahan pembersih', 'bahan percobaan', 'bahan industri'], 0, 'Boraks merusak organ tubuh.'],
            ],
            bs: [
                ['MSG termasuk zat aditif penyedap rasa.', true, 'MSG = monosodium glutamat.'],
                ['Formalin aman digunakan sebagai pengawet makanan.', false, 'Formalin berbahaya bagi tubuh.'],
                ['Kafein terdapat pada kopi.', true, 'Kafein bersifat adiktif ringan.'],
                ['Semua zat aditif sintetis aman tanpa batas.', false, 'Ada batas aman penggunaan.'],
            ],
        },
        { // 8. Sistem Peredaran Darah
            pg: [
                ['Pembuluh darah yang membawa darah dari jantung adalah …', ['arteri', 'vena', 'kapiler', 'limfa'], 0, 'Arteri keluar dari jantung.'],
                ['Sel darah yang berperan dalam pembekuan darah adalah …', ['trombosit', 'eritrosit', 'leukosit', 'plasma'], 0, 'Trombosit = keping darah.'],
                ['Ruang jantung yang memompa darah ke seluruh tubuh adalah …', ['bilik kiri', 'serambi kanan', 'serambi kiri', 'bilik kanan'], 0, 'Bilik kiri berdinding paling tebal.'],
                ['Hemoglobin berfungsi mengikat …', ['oksigen', 'glukosa', 'air', 'lemak'], 0, 'Hemoglobin ada pada sel darah merah.'],
                ['Peredaran darah kecil adalah peredaran dari jantung ke …', ['paru-paru', 'seluruh tubuh', 'otak', 'ginjal'], 0, 'Jantung → paru-paru → jantung.'],
                ['Penyakit akibat tekanan darah tinggi disebut …', ['hipertensi', 'anemia', 'leukemia', 'varises'], 0, 'Hipertensi = tekanan darah tinggi.'],
            ],
            bs: [
                ['Manusia memiliki sistem peredaran darah ganda.', true, 'Darah melewati jantung dua kali.'],
                ['Vena pulmonalis membawa darah kaya CO₂.', false, 'Vena pulmonalis membawa darah kaya O₂ dari paru-paru.'],
                ['Leukosit berperan melawan kuman penyakit.', true, 'Leukosit = sel darah putih.'],
                ['Jantung manusia memiliki tiga ruang.', false, 'Jantung manusia memiliki empat ruang.'],
            ],
        },
        { // 9. Tekanan Zat
            pg: [
                ['Gaya 100 N bekerja pada luas 2 m². Tekanannya …', ['50 Pa', '200 Pa', '102 Pa', '98 Pa'], 0, 'P = F : A = 50 Pa.'],
                ['Satuan tekanan adalah …', ['pascal', 'newton', 'joule', 'watt'], 0, '1 Pa = 1 N/m².'],
                ['Dongkrak hidrolik bekerja berdasarkan hukum …', ['Pascal', 'Archimedes', 'Newton', 'Boyle'], 0, 'Tekanan diteruskan sama besar ke segala arah.'],
                ['Kapal laut dapat terapung berdasarkan hukum …', ['Archimedes', 'Pascal', 'Bernoulli', 'Ohm'], 0, 'Gaya apung = berat zat cair yang dipindahkan.'],
                ['Tekanan hidrostatis semakin besar jika …', ['kedalaman bertambah', 'kedalaman berkurang', 'massa jenis berkurang', 'gravitasi berkurang'], 0, 'P = ρ × g × h.'],
                ['Pisau tajam mudah memotong karena …', ['luas bidang tekannya kecil', 'gayanya kecil', 'luas bidang tekannya besar', 'massanya besar'], 0, 'Luas kecil → tekanan besar.'],
            ],
            bs: [
                ['Tekanan berbanding terbalik dengan luas bidang tekan.', true, 'P = F : A.'],
                ['Tekanan udara semakin besar di tempat yang lebih tinggi.', false, 'Tekanan udara makin kecil di tempat tinggi.'],
                ['Kapal selam mengatur posisinya dengan mengubah isi tangki pemberat.', true, 'Massa air di tangki diubah.'],
                ['Hukum Pascal berlaku untuk benda padat.', false, 'Berlaku untuk zat cair di ruang tertutup.'],
            ],
        },
        { // 10. Getaran dan Gelombang
            pg: [
                ['Satu getaran penuh pada bandul adalah gerak …', ['A–B–C–B–A', 'A–B', 'A–B–C', 'B–C'], 0, 'Kembali ke posisi awal.'],
                ['Bandul bergetar 20 kali dalam 5 s. Frekuensinya …', ['4 Hz', '25 Hz', '100 Hz', '0,25 Hz'], 0, 'f = n : t = 4 Hz.'],
                ['Gelombang yang memerlukan medium disebut gelombang …', ['mekanik', 'elektromagnetik', 'cahaya', 'radio'], 0, 'Contoh: bunyi, gelombang tali.'],
                ['Gelombang bunyi termasuk gelombang …', ['longitudinal', 'transversal', 'elektromagnetik', 'stasioner'], 0, 'Berupa rapatan dan renggangan.'],
                ['Cepat rambat gelombang dengan λ = 2 m dan f = 5 Hz adalah …', ['10 m/s', '2,5 m/s', '7 m/s', '3 m/s'], 0, 'v = λ × f = 10.'],
                ['Satuan frekuensi adalah …', ['hertz', 'sekon', 'meter', 'm/s'], 0, 'Hz = getaran per sekon.'],
            ],
            bs: [
                ['Periode adalah waktu untuk satu getaran.', true, 'T = t : n.'],
                ['Gelombang pada tali termasuk gelombang longitudinal.', false, 'Gelombang tali adalah gelombang transversal.'],
                ['Bunyi tidak dapat merambat di ruang hampa.', true, 'Bunyi memerlukan medium.'],
                ['Amplitudo adalah jumlah getaran per sekon.', false, 'Itu frekuensi; amplitudo = simpangan terjauh.'],
            ],
        },
        { // 11. Cahaya dan Alat Optik
            pg: [
                ['Cermin yang digunakan pada spion kendaraan adalah cermin …', ['cembung', 'datar', 'cekung', 'silinder'], 0, 'Cermin cembung memperluas pandangan.'],
                ['Penderita rabun jauh (miopi) ditolong dengan lensa …', ['cekung', 'cembung', 'silinder', 'datar'], 0, 'Lensa cekung menyebarkan cahaya.'],
                ['Pembiasan cahaya terjadi ketika cahaya …', ['melewati dua medium berbeda', 'dipantulkan', 'diserap', 'berhenti'], 0, 'Cahaya berbelok saat berpindah medium.'],
                ['Bagian mata yang mengatur jumlah cahaya masuk adalah …', ['pupil', 'retina', 'lensa', 'kornea'], 0, 'Pupil diatur oleh iris.'],
                ['Pelangi terjadi akibat peristiwa …', ['dispersi cahaya', 'pemantulan', 'difraksi bunyi', 'resonansi'], 0, 'Cahaya putih terurai menjadi warna-warni.'],
                ['Alat optik untuk melihat benda yang sangat kecil adalah …', ['mikroskop', 'teleskop', 'periskop', 'kamera'], 0, 'Mikroskop memperbesar benda renik.'],
            ],
            bs: [
                ['Cahaya merambat lurus.', true, 'Salah satu sifat cahaya.'],
                ['Cermin cekung bersifat menyebarkan cahaya.', false, 'Cermin cekung mengumpulkan cahaya.'],
                ['Bayangan pada retina bersifat nyata dan terbalik.', true, 'Otak menafsirkannya menjadi tegak.'],
                ['Hipermetropi ditolong dengan lensa cekung.', false, 'Hipermetropi ditolong lensa cembung.'],
            ],
        },
        { // 12. Review Materi
            pg: [
                ['Rumus kecepatan pada GLB adalah …', ['v = s : t', 'v = s × t', 'v = t : s', 'v = m × a'], 0, 'Kecepatan = jarak dibagi waktu.'],
                ['Alveolus berfungsi sebagai tempat …', ['pertukaran gas', 'pencernaan', 'penyaringan darah', 'pembentukan suara'], 0, 'O₂ dan CO₂ dipertukarkan di alveolus.'],
                ['Hukum II Newton dirumuskan …', ['F = m × a', 'P = F : A', 'W = F × s', 'v = λ × f'], 0, 'Resultan gaya = massa × percepatan.'],
                ['Xilem berfungsi mengangkut …', ['air dan mineral', 'hasil fotosintesis', 'oksigen', 'hormon'], 0, 'Dari akar ke daun.'],
                ['Pembuluh darah terkecil adalah …', ['kapiler', 'arteri', 'vena', 'aorta'], 0, 'Kapiler menghubungkan arteri dan vena.'],
                ['Lensa cekung disebut juga lensa …', ['negatif', 'positif', 'konvergen', 'pembesar'], 0, 'Lensa cekung = lensa divergen (negatif).'],
            ],
            bs: [
                ['Diafragma berperan dalam pernapasan perut.', true, 'Kontraksi diafragma memperbesar rongga dada.'],
                ['Katrol tetap memperkecil gaya yang diperlukan.', false, 'Katrol tetap hanya mengubah arah gaya.'],
                ['Bunyi merupakan gelombang longitudinal.', true, 'Berupa rapatan dan renggangan.'],
                ['Usus besar adalah tempat utama penyerapan sari makanan.', false, 'Tempat utamanya usus halus.'],
            ],
        },
    ],
    'IPS': [
        { // 1. Perubahan Sosial Budaya
            pg: [
                ['Perubahan sosial yang berlangsung lambat disebut …', ['evolusi', 'revolusi', 'reformasi', 'inovasi'], 0, 'Evolusi = perubahan lambat.'],
                ['Faktor pendorong perubahan sosial adalah …', ['pendidikan yang maju', 'sikap tertutup', 'adat yang sangat kuat', 'rasa takut'], 0, 'Pendidikan membuka pola pikir baru.'],
                ['Penemuan baru yang diterima dan diterapkan masyarakat disebut …', ['invention', 'discovery', 'akulturasi', 'asimilasi'], 0, 'Invention = penemuan yang sudah diterapkan.'],
                ['Perubahan cepat yang menyangkut sendi pokok kehidupan disebut …', ['revolusi', 'evolusi', 'modernisasi', 'inovasi'], 0, 'Revolusi = perubahan cepat dan mendasar.'],
                ['Contoh dampak negatif perubahan sosial adalah …', ['meningkatnya individualisme', 'kemudahan komunikasi', 'kemajuan teknologi', 'pendidikan meningkat'], 0, 'Individualisme melemahkan kebersamaan.'],
                ['Percampuran dua kebudayaan tanpa menghilangkan unsur aslinya disebut …', ['akulturasi', 'asimilasi', 'difusi', 'integrasi'], 0, 'Contoh: bangunan masjid bergaya candi.'],
            ],
            bs: [
                ['Kontak dengan budaya lain dapat mendorong perubahan sosial.', true, 'Kontak budaya membawa unsur baru.'],
                ['Masyarakat yang tertutup mempercepat perubahan.', false, 'Sikap tertutup menghambat perubahan.'],
                ['Penggunaan telepon pintar merupakan contoh perubahan teknologi.', true, 'Teknologi mengubah cara berkomunikasi.'],
                ['Asimilasi mempertahankan sepenuhnya ciri budaya asli.', false, 'Asimilasi melahirkan budaya baru dan ciri asli memudar.'],
            ],
        },
        { // 2. Globalisasi
            pg: [
                ['Globalisasi adalah proses …', ['mendunia', 'menutup diri', 'memisahkan negara', 'mengurangi teknologi'], 0, 'Hubungan antarbangsa makin erat.'],
                ['Contoh globalisasi di bidang ekonomi adalah …', ['perdagangan bebas', 'tari tradisional', 'upacara adat', 'gotong royong'], 0, 'Barang bebas keluar masuk antarnegara.'],
                ['Dampak positif globalisasi adalah …', ['kemudahan akses informasi', 'lunturnya budaya lokal', 'gaya hidup konsumtif', 'kesenjangan sosial'], 0, 'Informasi mudah diperoleh.'],
                ['Sikap yang tepat menghadapi globalisasi adalah …', ['menyaring budaya asing', 'menolak semua budaya asing', 'meniru semua budaya asing', 'mengabaikan budaya sendiri'], 0, 'Ambil yang baik, tolak yang buruk.'],
                ['Media yang paling mempercepat globalisasi adalah …', ['internet', 'surat', 'kentongan', 'merpati pos'], 0, 'Informasi menyebar dalam hitungan detik.'],
                ['Contoh globalisasi di bidang budaya adalah …', ['masuknya musik K-pop', 'penurunan suku bunga', 'pembentukan WTO', 'ekspor kopi'], 0, 'Budaya populer menyebar lintas negara.'],
            ],
            bs: [
                ['Globalisasi membuat batas antarnegara terasa semakin sempit.', true, 'Dunia seolah tanpa batas.'],
                ['Gaya hidup konsumtif adalah dampak positif globalisasi.', false, 'Itu dampak negatif.'],
                ['Bahasa Inggris banyak digunakan sebagai bahasa internasional.', true, 'Bahasa pengantar antarbangsa.'],
                ['Globalisasi hanya terjadi di bidang ekonomi.', false, 'Terjadi di berbagai bidang kehidupan.'],
            ],
        },
        { // 3. Interaksi Antarnegara Asia
            pg: [
                ['Negara dengan jumlah penduduk terbesar di Asia Tenggara adalah …', ['Indonesia', 'Malaysia', 'Filipina', 'Thailand'], 0, 'Penduduk Indonesia lebih dari 270 juta jiwa.'],
                ['Contoh interaksi antarnegara di bidang pendidikan adalah …', ['pertukaran pelajar', 'perang dagang', 'embargo', 'sengketa batas'], 0, 'Kerja sama pendidikan.'],
                ['Indonesia banyak mengimpor beras dari …', ['Thailand dan Vietnam', 'Jepang', 'Korea Selatan', 'Mongolia'], 0, 'Keduanya produsen beras besar.'],
                ['Jepang dikenal sebagai negara maju di bidang …', ['teknologi dan industri', 'tambang emas', 'pertanian gandum', 'peternakan unta'], 0, 'Contoh: elektronik dan otomotif.'],
                ['Kerja sama ekonomi negara-negara Asia Pasifik adalah …', ['APEC', 'NATO', 'Uni Eropa', 'OPEC'], 0, 'Asia-Pacific Economic Cooperation.'],
                ['Faktor pendorong interaksi antarnegara adalah …', ['perbedaan sumber daya alam', 'kesamaan semua produk', 'isolasi wilayah', 'larangan perdagangan'], 0, 'Negara saling membutuhkan.'],
            ],
            bs: [
                ['Perbedaan sumber daya alam mendorong perdagangan antarnegara.', true, 'Negara saling melengkapi kebutuhan.'],
                ['Indonesia tidak pernah mengekspor barang ke negara Asia.', false, 'Indonesia mengekspor batu bara, minyak sawit, dll.'],
                ['Kerja sama pariwisata termasuk interaksi antarnegara.', true, 'Contoh: bebas visa kunjungan.'],
                ['APEC adalah organisasi pertahanan militer.', false, 'APEC adalah kerja sama ekonomi.'],
            ],
        },
        { // 4. Perdagangan Internasional
            pg: [
                ['Kegiatan menjual barang ke luar negeri disebut …', ['ekspor', 'impor', 'barter', 'produksi'], 0, 'Ekspor = mengirim barang ke luar negeri.'],
                ['Contoh komoditas ekspor Indonesia adalah …', ['minyak kelapa sawit', 'gandum', 'salju', 'pesawat Boeing'], 0, 'Indonesia produsen sawit terbesar.'],
                ['Pajak yang dikenakan pada barang impor disebut …', ['bea masuk', 'subsidi', 'pajak penghasilan', 'kuota ekspor'], 0, 'Bea masuk = tarif impor.'],
                ['Pembatasan jumlah barang impor disebut …', ['kuota', 'dumping', 'embargo', 'subsidi'], 0, 'Kuota = batas jumlah.'],
                ['Larangan perdagangan dengan negara tertentu disebut …', ['embargo', 'kuota', 'tarif', 'devisa'], 0, 'Embargo = larangan dagang.'],
                ['Manfaat perdagangan internasional adalah …', ['memperoleh barang yang tidak diproduksi sendiri', 'menghilangkan semua industri', 'mengurangi devisa', 'menutup lapangan kerja'], 0, 'Kebutuhan dapat terpenuhi.'],
            ],
            bs: [
                ['Devisa dapat diperoleh dari kegiatan ekspor.', true, 'Ekspor menghasilkan valuta asing.'],
                ['Impor adalah kegiatan menjual barang ke luar negeri.', false, 'Impor = membeli dari luar negeri.'],
                ['Perbedaan iklim mendorong perdagangan internasional.', true, 'Hasil bumi tiap negara berbeda.'],
                ['Dumping berarti menjual ke luar negeri lebih mahal daripada di dalam negeri.', false, 'Dumping = menjual lebih murah.'],
            ],
        },
        { // 5. Pasar Modal
            pg: [
                ['Pasar modal adalah tempat bertemunya penjual dan pembeli …', ['instrumen keuangan jangka panjang', 'sayuran', 'barang elektronik', 'jasa transportasi'], 0, 'Contoh: saham dan obligasi.'],
                ['Bukti kepemilikan atas suatu perusahaan disebut …', ['saham', 'obligasi', 'reksa dana', 'deposito'], 0, 'Pemegang saham = pemilik sebagian perusahaan.'],
                ['Surat utang jangka panjang disebut …', ['obligasi', 'saham', 'cek', 'giro'], 0, 'Obligasi memberi bunga (kupon).'],
                ['Bursa efek di Indonesia adalah …', ['BEI', 'BI', 'OJK', 'LPS'], 0, 'Bursa Efek Indonesia.'],
                ['Keuntungan perusahaan yang dibagikan kepada pemegang saham disebut …', ['dividen', 'bunga', 'pajak', 'premi'], 0, 'Dividen = bagian laba.'],
                ['Lembaga yang mengawasi pasar modal di Indonesia adalah …', ['OJK', 'BPS', 'KPU', 'BMKG'], 0, 'Otoritas Jasa Keuangan.'],
            ],
            bs: [
                ['Reksa dana dikelola oleh manajer investasi.', true, 'Dana investor dikelola profesional.'],
                ['Investasi saham bebas risiko.', false, 'Harga saham dapat naik atau turun.'],
                ['Pemegang obligasi mendapat bunga (kupon).', true, 'Sebagai imbalan pinjaman.'],
                ['Pasar modal hanya memperdagangkan barang konsumsi.', false, 'Yang diperdagangkan instrumen keuangan.'],
            ],
        },
        { // 6. Kolonialisme di Indonesia
            pg: [
                ['Bangsa Eropa pertama yang tiba di Indonesia adalah …', ['Portugis', 'Belanda', 'Inggris', 'Spanyol'], 0, 'Portugis tiba di Malaka 1511 lalu ke Maluku.'],
                ['Kongsi dagang Belanda di Nusantara adalah …', ['VOC', 'EIC', 'KNIL', 'NHM'], 0, 'Vereenigde Oostindische Compagnie.'],
                ['Sistem tanam paksa diterapkan pada masa …', ['Van den Bosch', 'Daendels', 'Raffles', 'Jan Pieterszoon Coen'], 0, 'Cultuurstelsel tahun 1830.'],
                ['Tujuan awal bangsa Eropa datang ke Nusantara adalah mencari …', ['rempah-rempah', 'emas dan batu bara', 'minyak bumi', 'teh'], 0, 'Rempah sangat mahal di Eropa.'],
                ['Jalan Anyer–Panarukan dibangun pada masa …', ['Daendels', 'Raffles', 'Van den Bosch', 'Cornelis de Houtman'], 0, 'Untuk pertahanan Jawa.'],
                ['Sistem sewa tanah diperkenalkan oleh …', ['Raffles', 'Daendels', 'Van den Bosch', 'Van Heutsz'], 0, 'Landrent pada masa Inggris.'],
            ],
            bs: [
                ['VOC dibubarkan pada tahun 1799.', true, 'Karena korupsi dan utang.'],
                ['Cornelis de Houtman memimpin armada Portugis.', false, 'Ia memimpin armada Belanda (1596).'],
                ['Tanam paksa menimbulkan penderitaan bagi rakyat.', true, 'Terjadi kelaparan di berbagai daerah.'],
                ['Inggris tidak pernah berkuasa di Indonesia.', false, 'Inggris berkuasa tahun 1811–1816.'],
            ],
        },
        { // 7. Pergerakan Nasional
            pg: [
                ['Organisasi pergerakan nasional pertama adalah …', ['Budi Utomo', 'Sarekat Islam', 'PNI', 'Indische Partij'], 0, 'Didirikan 20 Mei 1908.'],
                ['Hari Kebangkitan Nasional diperingati setiap tanggal …', ['20 Mei', '28 Oktober', '17 Agustus', '10 November'], 0, 'Tanggal berdirinya Budi Utomo.'],
                ['Sumpah Pemuda dicetuskan pada tahun …', ['1928', '1908', '1945', '1912'], 0, '28 Oktober 1928.'],
                ['Pendiri Budi Utomo adalah …', ['dr. Sutomo', 'Ir. Soekarno', 'Ki Hajar Dewantara', 'H. Samanhudi'], 0, 'Bersama para pelajar STOVIA.'],
                ['Tiga Serangkai adalah pendiri organisasi …', ['Indische Partij', 'Budi Utomo', 'PNI', 'Muhammadiyah'], 0, 'Douwes Dekker, Cipto Mangunkusumo, Suwardi Suryaningrat.'],
                ['Organisasi yang didirikan Ir. Soekarno tahun 1927 adalah …', ['PNI', 'Sarekat Islam', 'Budi Utomo', 'Perhimpunan Indonesia'], 0, 'Partai Nasional Indonesia.'],
            ],
            bs: [
                ['Sarekat Islam berawal dari Sarekat Dagang Islam.', true, 'Didirikan H. Samanhudi.'],
                ['Sumpah Pemuda dibacakan pada 20 Mei 1908.', false, 'Sumpah Pemuda pada 28 Oktober 1928.'],
                ['Ki Hajar Dewantara mendirikan Taman Siswa.', true, 'Tahun 1922.'],
                ['Pergerakan nasional bertujuan memperkuat penjajahan.', false, 'Tujuannya mencapai kemerdekaan.'],
            ],
        },
        { // 8. Proklamasi Kemerdekaan
            pg: [
                ['Proklamasi kemerdekaan Indonesia dibacakan pada …', ['17 Agustus 1945', '18 Agustus 1945', '16 Agustus 1945', '1 Juni 1945'], 0, 'Hari Jumat, 17 Agustus 1945.'],
                ['Teks proklamasi diketik oleh …', ['Sayuti Melik', 'Sukarni', 'Ahmad Soebardjo', 'Fatmawati'], 0, 'Sayuti Melik mengetik naskah tulisan tangan Soekarno.'],
                ['Peristiwa pengamanan Soekarno–Hatta ke luar Jakarta disebut peristiwa …', ['Rengasdengklok', 'Bandung Lautan Api', 'Linggarjati', 'Renville'], 0, 'Terjadi 16 Agustus 1945.'],
                ['Proklamasi dibacakan di …', ['Jalan Pegangsaan Timur 56', 'Gedung Sate', 'Istana Bogor', 'Lapangan Ikada'], 0, 'Rumah Ir. Soekarno di Jakarta.'],
                ['Bendera Merah Putih yang dikibarkan saat proklamasi dijahit oleh …', ['Fatmawati', 'Kartini', 'Dewi Sartika', 'Cut Nyak Dien'], 0, 'Bendera Pusaka.'],
                ['PPKI mengesahkan UUD 1945 pada tanggal …', ['18 Agustus 1945', '17 Agustus 1945', '22 Juni 1945', '1 Juni 1945'], 0, 'Sidang PPKI pertama.'],
            ],
            bs: [
                ['Golongan muda mendesak proklamasi segera dilaksanakan.', true, 'Memanfaatkan kekosongan kekuasaan.'],
                ['Teks proklamasi dirumuskan di rumah Laksamana Maeda.', true, 'Pada malam 16–17 Agustus 1945.'],
                ['Proklamasi dibacakan oleh Ahmad Soebardjo.', false, 'Dibacakan Ir. Soekarno didampingi Moh. Hatta.'],
                ['Kekalahan Jepang dari Sekutu tidak berpengaruh pada proklamasi.', false, 'Kekosongan kekuasaan mendorong proklamasi.'],
            ],
        },
        { // 9. Ekonomi Kreatif
            pg: [
                ['Ekonomi kreatif mengandalkan …', ['ide dan kreativitas manusia', 'sumber daya alam saja', 'modal asing', 'tenaga mesin'], 0, 'Nilai tambah dari gagasan.'],
                ['Contoh subsektor ekonomi kreatif adalah …', ['kuliner', 'pertambangan', 'perikanan tangkap', 'kehutanan'], 0, 'Kuliner termasuk 17 subsektor ekonomi kreatif.'],
                ['Hak yang melindungi karya cipta disebut …', ['hak cipta', 'hak guna usaha', 'hak milik tanah', 'hak pilih'], 0, 'Melindungi karya dari penjiplakan.'],
                ['Pelajar membuat konten video edukasi di internet. Ini termasuk subsektor …', ['film, animasi, dan video', 'pertanian', 'tambang', 'manufaktur berat'], 0, 'Konten video termasuk subsektor kreatif.'],
                ['Manfaat ekonomi kreatif adalah …', ['membuka lapangan kerja', 'menambah pengangguran', 'merusak lingkungan', 'mengurangi inovasi'], 0, 'Menciptakan usaha baru.'],
                ['Batik tulis termasuk produk ekonomi kreatif subsektor …', ['fesyen dan kriya', 'aplikasi', 'arsitektur', 'periklanan'], 0, 'Kerajinan dan busana.'],
            ],
            bs: [
                ['Ekonomi kreatif dapat dikembangkan oleh pelajar.', true, 'Siapa pun dapat berkarya.'],
                ['Ekonomi kreatif hanya dapat dilakukan perusahaan besar.', false, 'Dapat dilakukan siapa saja, termasuk UMKM.'],
                ['Desain grafis termasuk subsektor ekonomi kreatif.', true, 'Termasuk desain komunikasi visual.'],
                ['Plagiarisme mendukung perkembangan ekonomi kreatif.', false, 'Plagiarisme melanggar hak cipta.'],
            ],
        },
        { // 10. Kerja Sama ASEAN
            pg: [
                ['ASEAN didirikan pada tanggal …', ['8 Agustus 1967', '17 Agustus 1945', '1 Januari 1970', '28 Oktober 1928'], 0, 'Melalui Deklarasi Bangkok.'],
                ['Deklarasi pembentukan ASEAN ditandatangani di …', ['Bangkok', 'Jakarta', 'Kuala Lumpur', 'Manila'], 0, 'Deklarasi Bangkok.'],
                ['Wakil Indonesia dalam pembentukan ASEAN adalah …', ['Adam Malik', 'Soekarno', 'Moh. Hatta', 'B.J. Habibie'], 0, 'Menteri Luar Negeri saat itu.'],
                ['Sekretariat ASEAN berkedudukan di …', ['Jakarta', 'Singapura', 'Bangkok', 'Hanoi'], 0, 'Di Jakarta, Indonesia.'],
                ['Kawasan perdagangan bebas ASEAN disebut …', ['AFTA', 'APEC', 'NAFTA', 'EFTA'], 0, 'ASEAN Free Trade Area.'],
                ['Pesta olahraga negara-negara ASEAN disebut …', ['SEA Games', 'Asian Games', 'Olimpiade', 'PON'], 0, 'Southeast Asian Games.'],
            ],
            bs: [
                ['Timor Leste merupakan negara pendiri ASEAN.', false, 'Pendiri: Indonesia, Malaysia, Singapura, Thailand, Filipina.'],
                ['ASEAN bertujuan mempercepat pertumbuhan ekonomi kawasan.', true, 'Salah satu tujuan Deklarasi Bangkok.'],
                ['Filipina termasuk negara pendiri ASEAN.', true, 'Diwakili Narciso Ramos.'],
                ['ASEAN merupakan pakta pertahanan militer.', false, 'ASEAN adalah kerja sama regional.'],
            ],
        },
        { // 11. Mobilitas Sosial
            pg: [
                ['Perpindahan status sosial seseorang disebut …', ['mobilitas sosial', 'migrasi', 'urbanisasi', 'asimilasi'], 0, 'Gerak dalam struktur sosial.'],
                ['Guru diangkat menjadi kepala sekolah merupakan mobilitas …', ['vertikal naik', 'vertikal turun', 'horizontal', 'antargenerasi'], 0, 'Status sosial meningkat.'],
                ['Saluran mobilitas sosial yang paling umum adalah …', ['pendidikan', 'keturunan', 'warna kulit', 'suku'], 0, 'Pendidikan membuka peluang kerja.'],
                ['Perpindahan status yang sederajat disebut mobilitas …', ['horizontal', 'vertikal', 'naik', 'turun'], 0, 'Tingkat statusnya tetap.'],
                ['Pedagang yang bangkrut lalu menjadi buruh mengalami mobilitas …', ['vertikal turun', 'vertikal naik', 'horizontal', 'lateral'], 0, 'Status sosial menurun.'],
                ['Anak petani menjadi dokter merupakan mobilitas …', ['antargenerasi', 'intragenerasi', 'horizontal', 'lateral'], 0, 'Perubahan status antara orang tua dan anak.'],
            ],
            bs: [
                ['Pendidikan dapat menjadi saluran mobilitas sosial.', true, 'Ijazah membuka peluang pekerjaan.'],
                ['Mobilitas horizontal mengubah tingkat status sosial.', false, 'Mobilitas horizontal berstatus sederajat.'],
                ['Pernikahan dapat menjadi saluran mobilitas sosial.', true, 'Status dapat berubah karena pernikahan.'],
                ['Masyarakat berkasta tertutup memudahkan mobilitas sosial.', false, 'Sistem tertutup justru mempersulit.'],
            ],
        },
        { // 12. Review Materi
            pg: [
                ['Percampuran budaya tanpa menghilangkan unsur asli disebut …', ['akulturasi', 'asimilasi', 'difusi', 'evolusi'], 0, 'Unsur asli tetap terlihat.'],
                ['Kegiatan membeli barang dari luar negeri disebut …', ['impor', 'ekspor', 'dumping', 'kuota'], 0, 'Impor = mendatangkan barang.'],
                ['Bukti kepemilikan perusahaan disebut …', ['saham', 'obligasi', 'dividen', 'kupon'], 0, 'Saham diperdagangkan di pasar modal.'],
                ['Organisasi pergerakan nasional pertama adalah …', ['Budi Utomo', 'PNI', 'Sarekat Islam', 'Indische Partij'], 0, 'Berdiri 1908.'],
                ['ASEAN didirikan pada tahun …', ['1967', '1945', '1975', '1999'], 0, '8 Agustus 1967.'],
                ['Anak buruh menjadi pengusaha merupakan mobilitas …', ['vertikal naik', 'vertikal turun', 'horizontal', 'tetap'], 0, 'Status sosial meningkat.'],
            ],
            bs: [
                ['Globalisasi mempermudah akses informasi.', true, 'Melalui internet dan media.'],
                ['Tanam paksa diterapkan oleh Raffles.', false, 'Tanam paksa diterapkan Van den Bosch.'],
                ['Proklamasi dibacakan pada 17 Agustus 1945.', true, 'Di Jalan Pegangsaan Timur 56.'],
                ['Ekonomi kreatif bergantung sepenuhnya pada sumber daya alam.', false, 'Bergantung pada kreativitas manusia.'],
            ],
        },
    ],
    'Bahasa Indonesia': [
        { // 1. Teks Laporan Percobaan
            pg: [
                ['Tujuan teks laporan percobaan adalah …', ['melaporkan langkah dan hasil percobaan', 'menghibur pembaca', 'membujuk pembaca', 'menceritakan pengalaman pribadi'], 0, 'Laporan percobaan bersifat ilmiah.'],
                ['Bagian yang mencantumkan peralatan yang dipakai termasuk struktur …', ['alat dan bahan', 'tujuan', 'langkah kerja', 'simpulan'], 0, 'Alat dan bahan ditulis sebelum langkah kerja.'],
                ['Kalimat pada langkah percobaan umumnya berupa kalimat …', ['perintah', 'tanya', 'seru', 'harapan'], 0, 'Contoh: "Masukkan air ke dalam gelas."'],
                ['Bagian akhir laporan percobaan berisi …', ['simpulan', 'orientasi', 'komplikasi', 'reorientasi'], 0, 'Simpulan menjawab tujuan percobaan.'],
                ['Kata "pertama, kemudian, selanjutnya" disebut konjungsi …', ['temporal', 'kausal', 'pertentangan', 'tujuan'], 0, 'Menyatakan urutan waktu.'],
                ['Contoh judul laporan percobaan adalah …', ['Pengaruh Cahaya terhadap Pertumbuhan Kecambah', 'Liburan ke Pantai', 'Si Kancil dan Buaya', 'Ayo Hemat Energi!'], 0, 'Menyebutkan variabel yang diuji.'],
            ],
            bs: [
                ['Laporan percobaan menggunakan bahasa yang objektif.', true, 'Berdasarkan data, bukan perasaan.'],
                ['Laporan percobaan berisi pendapat pribadi tanpa data.', false, 'Laporan berisi data hasil percobaan.'],
                ['Hasil pengamatan dapat disajikan dalam tabel.', true, 'Tabel memudahkan membaca data.'],
                ['Langkah percobaan boleh ditulis tidak berurutan.', false, 'Langkah harus berurutan.'],
            ],
        },
        { // 2. Teks Pidato Persuasif
            pg: [
                ['Tujuan pidato persuasif adalah …', ['mengajak atau membujuk pendengar', 'menghibur', 'melaporkan percobaan', 'menceritakan dongeng'], 0, 'Persuasif = membujuk.'],
                ['Struktur pidato adalah …', ['pembukaan – isi – penutup', 'orientasi – komplikasi – resolusi', 'tesis – argumen', 'judul – alat – langkah'], 0, 'Tiga bagian utama pidato.'],
                ['Kata ajakan dalam pidato persuasif contohnya …', ['marilah', 'kemarin', 'sehingga', 'namun'], 0, '"Marilah" mengajak pendengar.'],
                ['Salam pembuka pidato terdapat pada bagian …', ['pembukaan', 'isi', 'penutup', 'lampiran'], 0, 'Pembukaan berisi salam dan sapaan.'],
                ['Kalimat yang bersifat persuasif adalah …', ['Ayo, jaga kebersihan sekolah kita!', 'Sekolah kami berdiri tahun 1990.', 'Hari ini hujan.', 'Saya pergi ke pasar.'], 0, 'Berisi ajakan.'],
                ['Hal yang perlu diperhatikan saat berpidato adalah …', ['intonasi dan kontak mata', 'membaca cepat tanpa jeda', 'membelakangi penonton', 'berbicara sangat pelan'], 0, 'Agar pesan tersampaikan.'],
            ],
            bs: [
                ['Pidato persuasif berisi ajakan kepada pendengar.', true, 'Itulah ciri persuasif.'],
                ['Bagian penutup pidato berisi salam pembuka.', false, 'Penutup berisi simpulan dan salam penutup.'],
                ['Pidato perlu disesuaikan dengan pendengarnya.', true, 'Bahasa disesuaikan dengan audiens.'],
                ['Pidato persuasif tidak boleh menyertakan fakta.', false, 'Fakta memperkuat ajakan.'],
            ],
        },
        { // 3. Cerita Pendek
            pg: [
                ['Unsur intrinsik cerpen yang berkaitan dengan waktu dan tempat adalah …', ['latar', 'tokoh', 'amanat', 'alur'], 0, 'Latar = tempat, waktu, suasana.'],
                ['Pesan moral dalam cerpen disebut …', ['amanat', 'tema', 'sudut pandang', 'alur'], 0, 'Amanat = pesan pengarang.'],
                ['Rangkaian peristiwa dalam cerita disebut …', ['alur', 'latar', 'tema', 'penokohan'], 0, 'Alur = jalan cerita.'],
                ['Bagian cerpen yang berisi puncak masalah adalah …', ['komplikasi', 'orientasi', 'resolusi', 'koda'], 0, 'Komplikasi = konflik memuncak.'],
                ['Penggunaan kata "aku" sebagai pencerita menunjukkan sudut pandang …', ['orang pertama', 'orang ketiga', 'orang kedua', 'campuran'], 0, 'Pencerita terlibat dalam cerita.'],
                ['Unsur ekstrinsik cerpen adalah …', ['latar belakang pengarang', 'tokoh', 'alur', 'latar'], 0, 'Berasal dari luar karya.'],
            ],
            bs: [
                ['Cerpen dapat dibaca dalam sekali duduk.', true, 'Ceritanya pendek.'],
                ['Tema adalah tokoh utama dalam cerita.', false, 'Tema adalah gagasan pokok cerita.'],
                ['Tokoh protagonis biasanya berwatak baik.', true, 'Tokoh yang didukung pembaca.'],
                ['Amanat selalu ditulis secara tersurat.', false, 'Amanat bisa tersirat.'],
            ],
        },
        { // 4. Teks Tanggapan
            pg: [
                ['Teks tanggapan berisi …', ['penilaian terhadap suatu karya atau peristiwa', 'langkah membuat sesuatu', 'cerita fantasi', 'laporan percobaan'], 0, 'Disebut juga teks ulasan.'],
                ['Struktur teks tanggapan adalah …', ['konteks – deskripsi – penilaian – simpulan', 'orientasi – komplikasi', 'tesis – argumen – penegasan', 'judul – alat – langkah'], 0, 'Empat bagian teks tanggapan.'],
                ['Tanggapan yang baik harus …', ['disertai alasan yang logis', 'berisi ejekan', 'tanpa data', 'menyerang pribadi'], 0, 'Alasan membuat tanggapan dapat dipercaya.'],
                ['Kalimat tanggapan yang santun adalah …', ['Menurut saya, film ini akan lebih menarik jika alurnya dipercepat.', 'Film ini jelek sekali!', 'Sutradaranya tidak becus.', 'Tidak ada yang bagus.'], 0, 'Kritik disampaikan dengan sopan dan membangun.'],
                ['Bagian yang berisi pendapat tentang kelebihan dan kekurangan disebut …', ['penilaian', 'konteks', 'deskripsi', 'simpulan'], 0, 'Penilaian = evaluasi.'],
                ['Teks tanggapan termasuk jenis teks …', ['evaluasi/ulasan', 'narasi', 'prosedur', 'eksplanasi'], 0, 'Menilai suatu karya.'],
            ],
            bs: [
                ['Teks tanggapan dapat berisi kritik yang membangun.', true, 'Kritik membantu perbaikan.'],
                ['Tanggapan yang baik menggunakan kata-kata kasar.', false, 'Tanggapan harus santun.'],
                ['Simpulan berisi rangkuman penilaian.', true, 'Menutup teks tanggapan.'],
                ['Teks tanggapan tidak memerlukan bukti.', false, 'Penilaian perlu bukti atau alasan.'],
            ],
        },
        { // 5. Teks Diskusi
            pg: [
                ['Teks diskusi menyajikan …', ['pendapat pro dan kontra', 'cerita fantasi', 'langkah kerja', 'biografi'], 0, 'Dua sudut pandang terhadap isu.'],
                ['Struktur teks diskusi adalah …', ['isu – argumen pendukung – argumen penentang – simpulan', 'orientasi – komplikasi', 'konteks – penilaian', 'tujuan – langkah'], 0, 'Empat bagian teks diskusi.'],
                ['Konjungsi yang menyatakan pertentangan adalah …', ['namun', 'dan', 'kemudian', 'karena'], 0, '"Namun" mempertentangkan dua hal.'],
                ['Bagian yang berisi permasalahan yang dibahas disebut …', ['isu', 'argumen', 'simpulan', 'saran'], 0, 'Isu = pokok persoalan.'],
                ['Contoh isu teks diskusi adalah …', ['penggunaan ponsel di sekolah', 'cara membuat nasi goreng', 'kancil yang cerdik', 'liburan ke Bali'], 0, 'Topik yang menimbulkan pro dan kontra.'],
                ['Bagian akhir teks diskusi berisi …', ['simpulan atau saran', 'orientasi', 'koda', 'langkah'], 0, 'Penutup teks diskusi.'],
            ],
            bs: [
                ['Teks diskusi memuat dua sudut pandang atau lebih.', true, 'Pro dan kontra.'],
                ['Teks diskusi hanya memuat argumen pendukung.', false, 'Memuat argumen pendukung dan penentang.'],
                ['Argumen sebaiknya didukung fakta.', true, 'Fakta membuat argumen kuat.'],
                ['Simpulan teks diskusi harus selalu menolak isu.', false, 'Simpulan dapat netral atau berupa saran.'],
            ],
        },
        { // 6. Teks Cerita Inspiratif
            pg: [
                ['Tujuan cerita inspiratif adalah …', ['memberi motivasi dan teladan', 'melaporkan percobaan', 'menjelaskan proses alam', 'mengajak membeli produk'], 0, 'Menginspirasi pembaca.'],
                ['Struktur cerita inspiratif adalah …', ['orientasi – komplikasi – resolusi – koda', 'tesis – argumen', 'isu – argumen', 'tujuan – langkah'], 0, 'Mirip struktur cerita naratif.'],
                ['Bagian yang berisi pesan atau hikmah adalah …', ['koda', 'orientasi', 'komplikasi', 'resolusi'], 0, 'Koda = pesan moral.'],
                ['Tokoh dalam cerita inspiratif umumnya …', ['mampu bangkit dari kesulitan', 'selalu gagal', 'tidak memiliki masalah', 'berwatak jahat'], 0, 'Kegigihannya menjadi teladan.'],
                ['Contoh judul cerita inspiratif adalah …', ['Perjuangan Anak Penjual Koran Meraih Beasiswa', 'Cara Menanam Cabai', 'Proses Terjadinya Hujan', 'Undangan Rapat'], 0, 'Kisah perjuangan tokoh.'],
                ['Nilai yang dapat diteladani dari cerita inspiratif adalah …', ['sikap pantang menyerah', 'sifat malas', 'perilaku curang', 'sikap sombong'], 0, 'Nilai positif tokoh.'],
            ],
            bs: [
                ['Cerita inspiratif dapat diambil dari kisah nyata.', true, 'Banyak diangkat dari tokoh nyata.'],
                ['Cerita inspiratif tidak memiliki konflik.', false, 'Ada bagian komplikasi.'],
                ['Koda berisi pesan moral.', true, 'Bagian penutup cerita.'],
                ['Cerita inspiratif bertujuan menakut-nakuti pembaca.', false, 'Tujuannya memotivasi.'],
            ],
        },
        { // 7. Teks Prosedur
            pg: [
                ['Teks prosedur berisi …', ['langkah-langkah melakukan sesuatu', 'pendapat pro dan kontra', 'kisah masa lalu', 'deskripsi tempat'], 0, 'Petunjuk melakukan sesuatu.'],
                ['Struktur teks prosedur adalah …', ['tujuan – bahan – langkah', 'orientasi – komplikasi', 'isu – argumen', 'konteks – penilaian'], 0, 'Tujuan, alat/bahan, langkah-langkah.'],
                ['Kalimat yang tepat dalam langkah prosedur adalah …', ['Masukkan gula ke dalam gelas.', 'Gula itu manis sekali.', 'Kemarin saya membeli gula.', 'Apakah gula sudah habis?'], 0, 'Kalimat perintah.'],
                ['Kata "lalu, kemudian, setelah itu" menunjukkan …', ['urutan langkah', 'sebab akibat', 'pertentangan', 'perbandingan'], 0, 'Konjungsi temporal.'],
                ['Contoh judul teks prosedur adalah …', ['Cara Membuat Pupuk Kompos', 'Pahlawan dari Timur', 'Liburanku', 'Debat Ujian Nasional'], 0, 'Diawali "Cara …".'],
                ['Jika langkah prosedur tidak berurutan, akibatnya …', ['hasil tidak sesuai tujuan', 'hasil lebih baik', 'tidak ada pengaruh', 'waktu lebih singkat'], 0, 'Urutan menentukan hasil.'],
            ],
            bs: [
                ['Teks prosedur banyak menggunakan kalimat perintah.', true, 'Kalimat imperatif.'],
                ['Langkah-langkah teks prosedur boleh diacak.', false, 'Langkah harus berurutan.'],
                ['Alat dan bahan dicantumkan sebelum langkah-langkah.', true, 'Agar disiapkan lebih dulu.'],
                ['Teks prosedur bertujuan menghibur pembaca.', false, 'Tujuannya memberi petunjuk.'],
            ],
        },
        { // 8. Surat Dinas
            pg: [
                ['Surat dinas digunakan untuk keperluan …', ['resmi instansi', 'pribadi dengan teman', 'undangan ulang tahun', 'curahan hati'], 0, 'Surat resmi antarinstansi.'],
                ['Bagian surat dinas yang memuat nama dan alamat instansi adalah …', ['kop surat', 'isi surat', 'penutup', 'lampiran'], 0, 'Kop surat = kepala surat.'],
                ['Salam pembuka yang tepat dalam surat dinas adalah …', ['Dengan hormat,', 'Hai, apa kabar?', 'Halo semua!', 'Sampai jumpa,'], 0, 'Salam resmi.'],
                ['Penulisan perihal yang tepat adalah …', ['Perihal: Undangan Rapat', 'perihal: undangan rapat!', 'Perihal = undangan', 'PERIHAL undangan rapat'], 0, 'Huruf kapital di awal kata, tanpa tanda seru.'],
                ['Bahasa dalam surat dinas harus …', ['baku dan efektif', 'santai', 'gaul', 'berbelit-belit'], 0, 'Surat resmi memakai bahasa baku.'],
                ['Bagian akhir surat dinas berisi …', ['salam penutup, tanda tangan, dan nama terang', 'kop surat', 'nomor surat', 'perihal'], 0, 'Penutup surat.'],
            ],
            bs: [
                ['Surat dinas memiliki nomor surat.', true, 'Untuk arsip dan administrasi.'],
                ['Surat dinas boleh menggunakan bahasa gaul.', false, 'Harus memakai bahasa baku.'],
                ['Kop surat berisi identitas instansi.', true, 'Nama, alamat, dan logo instansi.'],
                ['Surat dinas tidak memerlukan tanda tangan.', false, 'Perlu tanda tangan pejabat berwenang.'],
            ],
        },
        { // 9. Teks Eksplanasi
            pg: [
                ['Teks eksplanasi menjelaskan …', ['proses terjadinya suatu fenomena', 'langkah membuat makanan', 'pendapat pro dan kontra', 'kisah seorang tokoh'], 0, 'Proses alam atau sosial.'],
                ['Struktur teks eksplanasi adalah …', ['pernyataan umum – deretan penjelas – interpretasi', 'orientasi – komplikasi', 'tujuan – langkah', 'isu – argumen'], 0, 'Tiga bagian teks eksplanasi.'],
                ['Contoh konjungsi kausal adalah …', ['sehingga', 'namun', 'dan', 'atau'], 0, 'Menyatakan sebab–akibat.'],
                ['Contoh judul teks eksplanasi adalah …', ['Proses Terjadinya Gempa Bumi', 'Cara Membuat Layang-layang', 'Liburan di Desa', 'Si Kancil'], 0, 'Menjelaskan proses fenomena.'],
                ['Bagian yang berisi urutan proses disebut …', ['deretan penjelas', 'pernyataan umum', 'interpretasi', 'koda'], 0, 'Rincian proses.'],
                ['Interpretasi dalam teks eksplanasi berisi …', ['simpulan atau pendapat penulis', 'langkah kerja', 'tokoh cerita', 'alamat'], 0, 'Bagian penutup.'],
            ],
            bs: [
                ['Teks eksplanasi banyak menggunakan istilah ilmiah.', true, 'Contoh: lempeng tektonik, evaporasi.'],
                ['Teks eksplanasi berisi cerita khayalan.', false, 'Berisi fakta.'],
                ['Hubungan sebab-akibat penting dalam teks eksplanasi.', true, 'Proses dijelaskan secara kausal.'],
                ['Teks eksplanasi sama dengan teks prosedur.', false, 'Eksplanasi menjelaskan proses fenomena; prosedur memberi langkah.'],
            ],
        },
        { // 10. Puisi
            pg: [
                ['Persamaan bunyi di akhir baris puisi disebut …', ['rima', 'irama', 'diksi', 'tipografi'], 0, 'Rima = persajakan.'],
                ['Pilihan kata dalam puisi disebut …', ['diksi', 'rima', 'majas', 'amanat'], 0, 'Diksi = pilihan kata.'],
                ['"Bulan tersenyum di balik awan" merupakan majas …', ['personifikasi', 'hiperbola', 'metafora', 'litotes'], 0, 'Benda mati seolah berperilaku seperti manusia.'],
                ['Unsur fisik (bentuk) puisi adalah …', ['tipografi', 'tema', 'amanat', 'perasaan'], 0, 'Tipografi = tata wajah puisi.'],
                ['Gagasan utama dalam puisi disebut …', ['tema', 'rima', 'bait', 'larik'], 0, 'Tema = pokok persoalan.'],
                ['Satu baris dalam puisi disebut …', ['larik', 'bait', 'rima', 'majas'], 0, 'Larik = baris.'],
            ],
            bs: [
                ['Puisi menggunakan bahasa yang padat dan indah.', true, 'Ciri khas puisi.'],
                ['Bait adalah satu baris dalam puisi.', false, 'Bait adalah kumpulan larik.'],
                ['Majas hiperbola melebih-lebihkan sesuatu.', true, 'Contoh: tangisnya membanjiri bumi.'],
                ['Puisi tidak memiliki amanat.', false, 'Puisi juga memiliki amanat.'],
            ],
        },
        { // 11. Teks Argumentasi
            pg: [
                ['Teks argumentasi bertujuan …', ['meyakinkan pembaca dengan alasan dan bukti', 'menceritakan pengalaman', 'memberi langkah kerja', 'mendeskripsikan objek'], 0, 'Meyakinkan dengan bukti.'],
                ['Struktur teks argumentasi adalah …', ['tesis – argumen – penegasan ulang', 'orientasi – komplikasi', 'tujuan – langkah', 'konteks – penilaian'], 0, 'Tiga bagian teks argumentasi.'],
                ['Pernyataan pendapat penulis di awal teks disebut …', ['tesis', 'argumen', 'penegasan', 'data'], 0, 'Tesis = pendapat utama.'],
                ['Bukti yang paling kuat dalam argumen adalah …', ['data dan fakta', 'gosip', 'perasaan pribadi', 'tebakan'], 0, 'Data dapat dibuktikan.'],
                ['Kata "oleh karena itu" berfungsi sebagai konjungsi …', ['simpulan', 'pertentangan', 'waktu', 'tambahan'], 0, 'Menarik kesimpulan.'],
                ['Penegasan ulang berisi …', ['penguatan kembali pendapat', 'pengenalan tokoh', 'langkah-langkah', 'alat dan bahan'], 0, 'Bagian penutup.'],
            ],
            bs: [
                ['Argumen harus didukung bukti yang relevan.', true, 'Bukti membuat argumen meyakinkan.'],
                ['Teks argumentasi berisi khayalan.', false, 'Berisi fakta dan alasan logis.'],
                ['Tesis terdapat pada bagian awal teks.', true, 'Pernyataan pendapat di awal.'],
                ['Penegasan ulang terletak di awal teks.', false, 'Penegasan ulang ada di akhir teks.'],
            ],
        },
        { // 12. Latihan Asesmen
            pg: [
                ['Teks yang menjelaskan proses terjadinya fenomena alam adalah teks …', ['eksplanasi', 'prosedur', 'cerpen', 'deskripsi'], 0, 'Eksplanasi menjelaskan proses.'],
                ['Unsur cerpen yang berisi pesan moral adalah …', ['amanat', 'latar', 'alur', 'tokoh'], 0, 'Amanat = pesan.'],
                ['Bagian pidato yang berisi salam pembuka adalah …', ['pembukaan', 'isi', 'penutup', 'lampiran'], 0, 'Pembukaan pidato.'],
                ['Kalimat perintah paling banyak dijumpai dalam teks …', ['prosedur', 'eksplanasi', 'cerpen', 'argumentasi'], 0, 'Langkah-langkah berupa perintah.'],
                ['Salam pembuka surat dinas yang tepat adalah …', ['Dengan hormat,', 'Hai,', 'Halo,', 'Apa kabar, Bro?'], 0, 'Salam resmi.'],
                ['Teks yang menyajikan pendapat pro dan kontra adalah teks …', ['diskusi', 'prosedur', 'laporan percobaan', 'puisi'], 0, 'Teks diskusi.'],
            ],
            bs: [
                ['Teks argumentasi memerlukan bukti yang mendukung.', true, 'Bukti memperkuat tesis.'],
                ['Puisi termasuk teks nonfiksi.', false, 'Puisi adalah karya sastra.'],
                ['Surat dinas menggunakan bahasa baku.', true, 'Surat resmi.'],
                ['Teks laporan percobaan bersifat subjektif.', false, 'Laporan percobaan bersifat objektif.'],
            ],
        },
    ],
};

// Soal standar: { tipe: 'pg'|'bs', teks, opsi: [..], kunci: indeks opsi benar, pembahasan }
// posisi = letak jawaban benar (0–3) yang dihitung tetap dari nomor soal, sehingga kunci tersebar di A–D
// dan tidak berubah setiap halaman dibuka. Opsi lain tetap dalam urutan aslinya.
function soalPG([teks, opsi, kunci, pembahasan], posisi) {
    const lain = opsi.filter((_, i) => i !== kunci);
    const letak = posisi % opsi.length;
    return {
        tipe: 'pg',
        teks,
        opsi: [...lain.slice(0, letak), opsi[kunci], ...lain.slice(letak)],
        kunci: letak,
        pembahasan: pembahasan || `Jawaban yang tepat: ${opsi[kunci]}.`,
    };
}

function soalBS([teks, benar, pembahasan]) {
    return { tipe: 'bs', teks, opsi: ['Benar', 'Salah'], kunci: benar ? 0 : 1, pembahasan: pembahasan || `Pernyataan ini ${benar ? 'benar' : 'salah'}.` };
}

// Soal satu pertemuan dari bank: { pg: [6 soal], bs: [4 soal] } atau null bila mapel/nomor tidak ada di bank.
// Setiap soal bank memiliki ref tetap ("Matematika|1|pg|0") agar soal yang dipilih untuk Latihan/Kuis dapat
// dikenali; yang disimpan selalu SALINAN, soal asli di bank tidak pernah diubah.
function soalBankPertemuan(mapel, nomor) {
    const data = (BANK_SOAL[mapel] || [])[nomor - 1];
    if (!data) {
        return null;
    }
    const dasar = MAPEL_OPTIONS.findIndex(m => m.nama === mapel) * 3 + nomor * 2;
    return {
        pg: data.pg.map((s, i) => ({ ...soalPG(s, dasar + i * 3 + Math.floor(i / 2)), ref: `${mapel}|${nomor}|pg|${i}` })),
        bs: data.bs.map((s, i) => ({ ...soalBS(s), ref: `${mapel}|${nomor}|bs|${i}` })),
    };
}

// Semua soal bank satu mapel (Pertemuan 1–12), dipakai pemilih soal Latihan & Kuis
function soalBankMapel(mapel) {
    const hasil = [];
    for (let n = 1; n <= 12; n++) {
        const b = soalBankPertemuan(mapel, n);
        if (b) {
            [...b.pg, ...b.bs].forEach(s => hasil.push({ ...s, nomor: n }));
        }
    }
    return hasil;
}

// Susunan soal setiap jenis (indeks soal dari bank pertemuan).
// Pretest = TEPAT 5 soal; Latihan = 10 soal (PG & B/S berselang-seling); Aktivitas memakai konten bertipe (lihat 1C).
const PRETEST_JUMLAH_SOAL = 5;
const LATIHAN_TARGET_AWAL = 10;
const SUSUNAN_EVALUASI = {
    pretest: { pg: [0, 1, 2], bs: [0, 1], durasi: 10 },
    latihan: { urutan: [['pg', 0], ['bs', 0], ['pg', 1], ['bs', 1], ['pg', 2], ['bs', 2], ['pg', 3], ['bs', 3], ['pg', 4], ['pg', 5]], durasi: 0 },
    // Mini Challenge bawaan setiap pertemuan (dulu "Aktivitas Benar atau Salah"): soal bank pg 3 + bs 1–3
    challenge: { pg: [3], bs: [1, 2, 3], durasiDetik: 90 },
};

/* =========================
   1C. AKTIVITAS INTERAKTIF (tipe & konten contoh)
   Aktivitas = kegiatan belajar sambil melakukan sesuatu, BUKAN soal pilihan ganda biasa.
   Setiap aktivitas punya satu tipe & konten sesuai tipenya. 4 aktivitas per pertemuan (target 3–5),
   tipenya bervariasi menurut mapel & pertemuan. Contoh dibuat untuk Pertemuan 1–3 (komponen siap).
========================= */
const TIPE_AKTIVITAS = {
    matching: { label: 'Menjodohkan', judul: 'Match It!', ikon: '🧩', instruksi: 'Pasangkan setiap istilah di kiri dengan pasangan yang tepat di kanan.' },
    drag_drop: { label: 'Kelompokkan (Drag & Drop)', judul: 'Kelompokkan!', ikon: '🗂️', instruksi: 'Tarik setiap kartu ke kelompok yang tepat (atau ketuk kartu, lalu ketuk kelompoknya).' },
    ordering: { label: 'Susun Urutan', judul: 'Susun Urutan!', ikon: '🎯', instruksi: 'Susun langkah-langkah berikut dari awal sampai akhir.' },
    true_false: { label: 'Benar atau Salah', judul: 'Benar atau Salah?', ikon: '✅', instruksi: 'Baca setiap kartu, lalu tentukan: BENAR atau SALAH?' },
    image_selection: { label: 'Pilih Gambar', judul: 'Pilih yang Tepat!', ikon: '🖼️', instruksi: 'Ketuk SEMUA kartu yang sesuai dengan pertanyaan.' },
    sentence_builder: { label: 'Susun Kata', judul: 'Susun Kalimat!', ikon: '🔤', instruksi: 'Ketuk kata-kata secara berurutan sehingga membentuk kalimat yang benar.' },
    find_error: { label: 'Cari Kesalahan', judul: 'Cari Kesalahannya!', ikon: '🔎', instruksi: 'Temukan bagian yang salah, lalu pilih atau tulis perbaikannya.' },
    challenge: { label: 'Mini Challenge', judul: 'Mini Challenge!', ikon: '⚡', instruksi: 'Jawab semua tantangan sebelum waktu habis!' },
};
const AKTIVITAS_MAKS_PER_PERTEMUAN = 5;

// Pembuat konten contoh (ringkas)
const AKT = {
    match: (judul, pasangan) => ({ tipe: 'matching', judul, konten: { pasangan: pasangan.map(([kiri, kanan]) => ({ kiri, kanan })) } }),
    group: (judul, kategori, item) => ({ tipe: 'drag_drop', judul, konten: { kategori, item: item.map(([teks, k]) => ({ teks, kategori: k })) } }),
    order: (judul, urutan, instruksi) => ({ tipe: 'ordering', judul, instruksi, konten: { urutan } }),
    tf: (judul, pernyataan) => ({ tipe: 'true_false', judul, konten: { pernyataan: pernyataan.map(([teks, benar, penjelasan]) => ({ teks, benar, penjelasan })) } }),
    img: (judul, pertanyaan, pilihan) => ({ tipe: 'image_selection', judul, konten: { pertanyaan, pilihan: pilihan.map(([gambar, label, benar]) => ({ gambar, label, benar })) } }),
    sentence: (judul, kalimat) => ({ tipe: 'sentence_builder', judul, konten: { kalimat: kalimat.map(([teks, pengecoh = []]) => ({ teks, pengecoh })) } }),
    error: (judul, butir) => ({ tipe: 'find_error', judul, konten: { butir: butir.map(([bagian, salah, koreksi, pilihanKoreksi, penjelasan]) => ({ bagian, salah, koreksi, pilihanKoreksi, penjelasan })) } }),
};

// AKTIVITAS_CONTOH[mapel][nomorPertemuan] = 3 aktivitas (+ 1 Mini Challenge dari bank soal = 4 per pertemuan)
const AKTIVITAS_CONTOH = {
    'Matematika': {
        1: [
            AKT.order('Langkah Menyelesaikan 2x + 4 = 10', ['2x + 4 = 10', '2x + 4 − 4 = 10 − 4', '2x = 6', '2x ÷ 2 = 6 ÷ 2', 'x = 3'], 'Susun langkah penyelesaian persamaan dari awal sampai akhir.'),
            AKT.error('Temukan Langkah yang Keliru', [
                [['3x − 5 = 10', '3x = 5', 'x = 5/3'], 1, '3x = 15', ['3x = 10', '3x = −15'], 'Kedua ruas ditambah 5: 10 + 5 = 15, jadi 3x = 15 dan x = 5.'],
                [['x/2 = 8', 'x = 4'], 1, 'x = 16', ['x = 10', 'x = 6'], 'Kedua ruas dikali 2: x = 8 × 2 = 16.'],
            ]),
            AKT.match('Pasangkan Persamaan dengan Penyelesaiannya', [['x + 3 = 7', 'x = 4'], ['2x = 12', 'x = 6'], ['x − 5 = 2', 'x = 7'], ['x/3 = 4', 'x = 12']]),
        ],
        2: [
            AKT.group('Kelompokkan Jenis Pola Bilangan', ['Pola Ganjil', 'Pola Genap', 'Pola Persegi'], [
                ['1, 3, 5, 7, …', 0], ['2, 4, 6, 8, …', 1], ['1, 4, 9, 16, …', 2], ['11, 13, 15, 17, …', 0], ['20, 22, 24, 26, …', 1], ['25, 36, 49, 64, …', 2],
            ]),
            AKT.tf('Benar atau Salah: Pola Bilangan', [
                ['Suku berikutnya dari pola 3, 6, 9, 12 adalah 15.', true, 'Pola bertambah 3: 12 + 3 = 15.'],
                ['Pola 1, 4, 9, 16 disebut pola bilangan segitiga.', false, 'Itu pola bilangan persegi (1², 2², 3², 4²).'],
                ['Jumlah n bilangan ganjil pertama sama dengan n².', true, 'Contoh: 1 + 3 + 5 = 9 = 3².'],
                ['Pola 2, 4, 8, 16 bertambah 2 setiap suku.', false, 'Pola itu dikali 2 setiap suku.'],
            ]),
            AKT.order('Urutkan Suku Pola Aritmetika', ['2', '5', '8', '11', '14'], 'Susun suku-suku pola bilangan berikut dari suku pertama sampai suku kelima.'),
        ],
        3: [
            AKT.match('Titik dan Kuadrannya', [['(3, 2)', 'Kuadran I'], ['(−3, 2)', 'Kuadran II'], ['(−3, −2)', 'Kuadran III'], ['(3, −2)', 'Kuadran IV']]),
            AKT.group('Di Mana Letak Titiknya?', ['Pada sumbu X', 'Pada sumbu Y', 'Tidak pada sumbu'], [
                ['(4, 0)', 0], ['(0, 5)', 1], ['(2, 3)', 2], ['(−6, 0)', 0], ['(0, −1)', 1], ['(−2, −4)', 2],
            ]),
            AKT.error('Cari Kesalahan Koordinat', [
                [['Titik A(2, −5)', 'terletak di', 'Kuadran II'], 2, 'Kuadran IV', ['Kuadran I', 'Kuadran III'], 'x positif dan y negatif → Kuadran IV.'],
                [['Jarak titik (0, 7)', 'ke sumbu X', 'adalah 0 satuan'], 2, 'adalah 7 satuan', ['adalah 14 satuan', 'adalah 1 satuan'], 'Jarak ke sumbu X sama dengan |y| = 7.'],
            ]),
        ],
    },
    'Bahasa Inggris': {
        1: [
            AKT.sentence('Build Your Introduction', [['My name is Sinta.', ['are']], ['I am from Bandung.', ['at']], ['I am fourteen years old.']]),
            AKT.match('Match the Question and Answer', [['What is your name?', 'My name is Dika.'], ['Where are you from?', 'I am from Surabaya.'], ['How old are you?', 'I am fourteen.'], ['What is your hobby?', 'I like reading.']]),
            AKT.error('Find the Grammar Error', [
                [['She', 'are', 'my classmate.'], 1, 'is', ['am', 'be'], 'She → is.'],
                [['I', 'comes', 'from Bali.'], 1, 'come', ['coming', 'is come'], 'I + come (tanpa -s).'],
            ]),
        ],
        2: [
            AKT.img('Choose the Fruits', 'Which pictures are FRUITS?', [['🍎', 'Apple', true], ['🍌', 'Banana', true], ['🥕', 'Carrot', false], ['🍇', 'Grapes', true], ['🍞', 'Bread', false], ['🥦', 'Broccoli', false]]),
            AKT.match('Greetings Vocabulary', [['Good morning', 'Selamat pagi'], ['See you later', 'Sampai jumpa nanti'], ['Thank you', 'Terima kasih'], ['How are you?', 'Apa kabar?']]),
            AKT.order('Arrange the Dialogue', ['Hi, Dimas! Good morning.', 'Good morning, Lala. How are you?', 'I am fine, thanks. And you?', 'I am great. Let\'s go to class!'], 'Susun percakapan berikut menjadi dialog yang runtut.'),
        ],
        3: [
            AKT.group('Appearance or Personality?', ['Physical Appearance', 'Personality'], [
                ['tall', 0], ['friendly', 1], ['curly hair', 0], ['honest', 1], ['slim', 0], ['kind', 1],
            ]),
            AKT.sentence('Describe the Person', [['She has long black hair.', ['have']], ['He is tall and friendly.', ['are']]]),
            AKT.tf('True or False: Describing People', [
                ['"Curly" is used to describe hair.', true, 'Curly hair = rambut keriting.'],
                ['"Lazy" is a positive personality.', false, 'Lazy (malas) adalah sifat negatif.'],
                ['We say "She has blue eyes", not "She have blue eyes".', true, 'She + has.'],
                ['"Tall" describes personality.', false, 'Tall menggambarkan penampilan fisik.'],
            ]),
        ],
    },
    'IPA': {
        1: [
            AKT.group('GLB atau GLBB?', ['GLB (kecepatan tetap)', 'GLBB (kecepatan berubah)'], [
                ['Mobil melaju dengan kecepatan tetap di jalan tol', 0], ['Bola jatuh bebas dari ketinggian', 1], ['Kereta mulai bergerak dari stasiun', 1],
                ['Eskalator bergerak dengan kecepatan tetap', 0], ['Sepeda direm hingga berhenti', 1], ['Pesawat terbang mendatar dengan kelajuan tetap', 0],
            ]),
            AKT.match('Besaran dan Satuannya', [['Kecepatan', 'meter per sekon (m/s)'], ['Percepatan', 'meter per sekon kuadrat (m/s²)'], ['Jarak', 'meter (m)'], ['Waktu', 'sekon (s)']]),
            AKT.tf('Benar atau Salah: Gerak Lurus', [
                ['Pada GLB, percepatan benda bernilai nol.', true, 'Kecepatan tetap → percepatan 0.'],
                ['Kecepatan termasuk besaran skalar.', false, 'Kecepatan punya arah, jadi besaran vektor.'],
                ['Jarak tempuh selalu sama dengan perpindahan.', false, 'Perpindahan hanya melihat posisi awal & akhir.'],
                ['Benda yang diam memiliki kecepatan nol.', true, 'Tidak berpindah → kecepatan 0.'],
            ]),
        ],
        2: [
            AKT.order('Perjalanan Udara Saat Menghirup Napas', ['Hidung', 'Faring', 'Laring', 'Trakea', 'Bronkus', 'Bronkiolus', 'Alveolus'], 'Susun jalur udara dari luar tubuh sampai tempat pertukaran gas.'),
            AKT.img('Organ Pernapasan', 'Manakah yang termasuk organ pernapasan?', [['🫁', 'Paru-paru', true], ['👃', 'Hidung', true], ['🫀', 'Jantung', false], ['🧠', 'Otak', false], ['🦷', 'Gigi', false]]),
            AKT.match('Organ dan Fungsinya', [['Alveolus', 'Tempat pertukaran O₂ dan CO₂'], ['Trakea', 'Saluran udara menuju paru-paru'], ['Diafragma', 'Otot yang membantu bernapas'], ['Hidung', 'Menyaring dan menghangatkan udara']]),
        ],
        3: [
            AKT.group('Hukum Newton yang Mana?', ['Hukum I (Kelembaman)', 'Hukum II', 'Hukum III (Aksi–Reaksi)'], [
                ['Penumpang terdorong ke depan saat bus direm mendadak', 0], ['Troli kosong lebih mudah didorong daripada troli penuh', 1],
                ['Roket menyemburkan gas ke bawah lalu terdorong ke atas', 2], ['Kaki terasa sakit saat menendang tembok', 2],
                ['Taplak ditarik cepat, piring tetap di meja', 0], ['Bola melaju lebih cepat jika ditendang lebih keras', 1],
            ]),
            AKT.error('Cari Kesalahan Konsep Gaya', [
                [['Satuan gaya', 'dalam SI adalah', 'joule'], 2, 'newton', ['watt', 'pascal'], 'Gaya diukur dalam newton (N).'],
                [['Gaya gesek', 'selalu searah', 'dengan arah gerak benda'], 1, 'selalu berlawanan arah', ['tegak lurus', 'tidak berarah'], 'Gaya gesek melawan arah gerak.'],
            ]),
            AKT.img('Gaya Gesek yang Menguntungkan', 'Pilih contoh gaya gesek yang MENGUNTUNGKAN.', [['👟', 'Alas sepatu bergerigi agar tidak tergelincir', true], ['🚲', 'Rem sepeda untuk memperlambat laju', true], ['⚙️', 'Mesin yang aus karena gesekan', false], ['✍️', 'Pensil dapat menulis di atas kertas', true]]),
        ],
    },
    'IPS': {
        1: [
            AKT.group('Pendorong atau Penghambat?', ['Faktor Pendorong', 'Faktor Penghambat'], [
                ['Kontak dengan kebudayaan lain', 0], ['Sistem pendidikan yang maju', 0], ['Sikap masyarakat yang sangat tradisional', 1],
                ['Kurangnya hubungan dengan masyarakat lain', 1], ['Keinginan masyarakat untuk maju', 0], ['Rasa takut terjadi kegoyahan budaya', 1],
            ]),
            AKT.match('Istilah Perubahan Sosial', [['Evolusi', 'Perubahan yang berlangsung lambat'], ['Revolusi', 'Perubahan yang berlangsung cepat'], ['Akulturasi', 'Percampuran budaya tanpa menghilangkan budaya asli'], ['Asimilasi', 'Peleburan budaya menjadi budaya baru']]),
            AKT.tf('Benar atau Salah: Perubahan Sosial', [
                ['Penggunaan telepon pintar mengubah cara orang berkomunikasi.', true, 'Teknologi mendorong perubahan sosial.'],
                ['Perubahan sosial selalu berdampak positif.', false, 'Perubahan dapat berdampak positif maupun negatif.'],
                ['Gotong royong adalah nilai budaya yang perlu dilestarikan.', true, 'Nilai gotong royong memperkuat persatuan.'],
            ]),
        ],
        2: [
            AKT.img('Pendorong Globalisasi', 'Pilih sarana yang MEMPERCEPAT globalisasi.', [['📱', 'Telepon pintar', true], ['💻', 'Internet', true], ['✈️', 'Pesawat terbang', true], ['🪔', 'Lampu minyak', false], ['🐎', 'Delman', false]]),
            AKT.group('Dampak Globalisasi', ['Dampak Positif', 'Dampak Negatif'], [
                ['Informasi mudah diperoleh', 0], ['Gaya hidup konsumtif', 1], ['Perdagangan antarnegara meningkat', 0],
                ['Lunturnya budaya lokal', 1], ['Ilmu pengetahuan berkembang pesat', 0], ['Sikap individualis', 1],
            ]),
            AKT.order('Perkembangan Alat Komunikasi', ['Surat pos', 'Telegram', 'Telepon rumah', 'Internet', 'Media sosial'], 'Urutkan alat komunikasi dari yang paling awal muncul sampai yang terbaru.'),
        ],
        3: [
            AKT.match('Negara dan Ibu Kotanya', [['Jepang', 'Tokyo'], ['Thailand', 'Bangkok'], ['India', 'New Delhi'], ['Korea Selatan', 'Seoul']]),
            AKT.order('Kronologi Keanggotaan ASEAN', ['ASEAN berdiri (1967)', 'Brunei Darussalam bergabung (1984)', 'Vietnam bergabung (1995)', 'Laos dan Myanmar bergabung (1997)', 'Kamboja bergabung (1999)'], 'Susun peristiwa berikut sesuai urutan waktu.'),
            AKT.error('Cari Kesalahan Sejarah ASEAN', [
                [['ASEAN didirikan', 'melalui Deklarasi Jakarta', 'tahun 1967'], 1, 'melalui Deklarasi Bangkok', ['melalui Deklarasi Manila', 'melalui Deklarasi Kuala Lumpur'], 'ASEAN didirikan lewat Deklarasi Bangkok, 8 Agustus 1967.'],
                [['Sekretariat ASEAN', 'berkedudukan di', 'Singapura'], 2, 'Jakarta', ['Bangkok', 'Manila'], 'Sekretariat ASEAN berada di Jakarta.'],
            ]),
        ],
    },
    'Bahasa Indonesia': {
        1: [
            AKT.order('Struktur Teks Laporan Percobaan', ['Tujuan', 'Alat dan bahan', 'Langkah-langkah', 'Hasil pengamatan', 'Simpulan'], 'Susun bagian teks laporan percobaan sesuai urutan yang benar.'),
            AKT.error('Cari Kesalahan Penulisan', [
                [['Percobaan ini', 'di lakukan', 'di laboratorium sekolah.'], 1, 'dilakukan', ['di-lakukan', 'dilaksana'], '"di" sebagai awalan ditulis serangkai dengan kata kerja.'],
                [['Masukan', 'dua sendok garam', 'ke dalam gelas.'], 0, 'Masukkan', ['Memasukan', 'Masuk'], 'Kata kerja perintah dari "masuk" + -kan = "masukkan".'],
            ]),
            AKT.sentence('Susun Kalimat Langkah Percobaan', [['Siapkan gelas berisi air bersih.', ['yang']], ['Aduk larutan hingga garam larut.']]),
        ],
        2: [
            AKT.order('Struktur Pidato Persuasif', ['Salam pembuka', 'Pendahuluan', 'Isi pidato', 'Penegasan dan ajakan', 'Penutup'], 'Susun struktur pidato persuasif dari awal sampai akhir.'),
            AKT.match('Istilah Seputar Pidato', [['Persuasif', 'Bersifat membujuk atau mengajak'], ['Orasi', 'Pidato di depan umum'], ['Audiens', 'Pendengar pidato'], ['Retorika', 'Seni berbicara yang efektif']]),
            AKT.img('Kalimat Ajakan', 'Pilih SEMUA kalimat yang berisi ajakan.', [['📢', 'Mari kita jaga kebersihan sekolah!', true], ['🏫', 'Sekolah kita memiliki tiga lantai.', false], ['♻️', 'Ayo, biasakan membuang sampah pada tempatnya!', true], ['🌧️', 'Kemarin hujan turun deras.', false]]),
        ],
        3: [
            AKT.group('Unsur Intrinsik atau Ekstrinsik?', ['Unsur Intrinsik', 'Unsur Ekstrinsik'], [
                ['Tema', 0], ['Alur', 0], ['Latar belakang kehidupan pengarang', 1], ['Tokoh dan penokohan', 0], ['Nilai sosial masyarakat', 1], ['Sudut pandang', 0],
            ]),
            AKT.order('Alur Cerita Pendek', ['Orientasi', 'Komplikasi', 'Klimaks', 'Resolusi', 'Koda'], 'Susun tahapan alur cerpen dari awal sampai akhir.'),
            AKT.tf('Benar atau Salah: Cerpen', [
                ['Cerpen umumnya dapat dibaca sekali duduk.', true, 'Cerpen relatif pendek.'],
                ['Tokoh antagonis adalah tokoh yang selalu baik hati.', false, 'Tokoh antagonis adalah penentang tokoh utama.'],
                ['Latar meliputi tempat, waktu, dan suasana.', true, 'Ketiganya disebut latar.'],
                ['Amanat adalah pesan yang ingin disampaikan pengarang.', true, 'Amanat = pesan moral cerita.'],
            ]),
        ],
    },
};

// Aktivitas bawaan satu pertemuan (tanpa id): 3 aktivitas contoh + 1 Mini Challenge dari bank soal
function aktivitasBawaanPertemuan(kelas, p, bank) {
    const contoh = ((AKTIVITAS_CONTOH[kelas.mapel] || {})[p.nomor] || []);
    const c = SUSUNAN_EVALUASI.challenge;
    const tantangan = {
        tipe: 'challenge',
        judul: `Tantangan Kilat: ${p.judul}`,
        konten: { durasiDetik: c.durasiDetik },
        soal: [...c.pg.map(i => bank.pg[i]), ...c.bs.map(i => bank.bs[i])],
    };
    // Variasi urutan antarpertemuan agar tipe pertama tidak selalu sama
    const daftar = [...contoh, tantangan];
    const geser = (p.nomor - 1) % daftar.length;
    return [...daftar.slice(geser), ...daftar.slice(0, geser)].map((a, i) => ({
        kelasId: p.kelasId,
        pertemuanId: p.id,
        jenis: 'aktivitas',
        judul: a.judul,
        instruksi: a.instruksi || TIPE_AKTIVITAS[a.tipe].instruksi,
        durasi: 0,
        status: 'Aktif',
        tipe: a.tipe,
        konten: a.konten,
        soal: a.soal || [],
        urutan: i + 1,
    }));
}

// Soal contoh kuis lama (dipakai SEKALI: saat data awal dibuat & saat migrasi kuis v1 → v2).
// 6 PG + 4 B/S pertemuan kuis; bila kuis meminta lebih banyak, ditambah dari pertemuan berikutnya.
// Hasilnya disalin menjadi soal milik kuis (tanpa ref) — sesudah itu kuis tidak bergantung pada kumpulan soal mana pun.
function soalKuisDariBank(mapel, nomor, jumlah) {
    const hasil = [];
    for (let n = nomor; hasil.length < jumlah && n <= nomor + 3; n++) {
        const bank = soalBankPertemuan(mapel, n);
        if (bank) {
            hasil.push(...bank.pg, ...bank.bs);
        }
    }
    return hasil.slice(0, jumlah).map(({ ref, ...s }) => s);
}

// Data awal kuis: soal contoh ditulis ke dalam setiap kuis (milik kuis)
function lengkapiSoalKuisAwal() {
    KUIS_AWAL.forEach(k => {
        const kelas = KELAS_AWAL.find(x => x.id === k.kelasId);
        const p = PERTEMUAN_AWAL.find(x => x.id === k.pertemuanId);
        k.soal = kelas && p ? soalKuisDariBank(kelas.mapel, p.nomor, k.jumlahSoal) : [];
        k.jumlahSoal = Math.max(k.soal.length, 1);
    });
}
lengkapiSoalKuisAwal();

// ---- Data Pretest, Aktivitas Interaktif & Latihan Soal awal ----
const JENIS_EVALUASI = {
    pretest: { label: 'Pretest', komponen: 'pretest', instruksi: 'Kerjakan pretest ini sebelum mempelajari modul untuk mengukur pemahaman awal. Pretest hanya dapat dikerjakan satu kali.' },
    aktivitas: { label: 'Aktivitas Interaktif', komponen: 'aktivitas', instruksi: 'Belajar sambil melakukan aktivitas: pasangkan, kelompokkan, susun, dan temukan jawabannya.' },
    latihan: { label: 'Latihan Soal', komponen: 'latihan', instruksi: 'Jawab semua soal, lalu kirim jawaban. Setelah dikirim, nilai dan pembahasan setiap soal ditampilkan. Latihan boleh diulang.' },
};
const STATUS_EVALUASI = ['Aktif', 'Draft'];
// Latihan Soal: soal (Pilihan Ganda / Benar-Salah) DIBUAT LANGSUNG oleh Pengajar di Kelola Soal, dikerjakan di sistem
// dengan skor otomatis. Tidak ada "sumber soal", Bank Soal, dokumentasi, maupun upload jawaban (itu bagian Tugas).

// Evaluasi: { id, kelasId, pertemuanId, jenis, judul, instruksi, durasi (menit, 0 = tanpa batas), status, soal: [...] }
//   Pretest  : tepat 5 soal
//   Aktivitas: + tipe, konten (sesuai tipe), urutan; tipe 'challenge' memakai soal (+ konten.durasiDetik)
//   Latihan  : + target (jumlah soal minimum sebelum Aktif, bawaan 10); soal milik latihan (ditulis Pengajar)
// Hanya dibuat untuk pertemuan yang komponennya sudah dicentang "siap" (keputusan pemilik).
function buatEvaluasiAwal() {
    const list = [];
    const tambah = data => list.push({ id: list.length + 1, ...data });
    PERTEMUAN_AWAL.forEach(p => {
        const kelas = KELAS_AWAL.find(k => k.id === p.kelasId);
        const bank = soalBankPertemuan(kelas.mapel, p.nomor);
        if (!bank) {
            return;
        }
        const dasar = { kelasId: p.kelasId, pertemuanId: p.id, status: 'Aktif' };
        if (p.komponen.includes('pretest')) {
            const s = SUSUNAN_EVALUASI.pretest;
            tambah({ ...dasar, jenis: 'pretest', judul: `Pretest: ${p.judul}`, instruksi: JENIS_EVALUASI.pretest.instruksi, durasi: s.durasi,
                soal: [...s.pg.map(i => bank.pg[i]), ...s.bs.map(i => bank.bs[i])] });
        }
        if (p.komponen.includes('aktivitas')) {
            aktivitasBawaanPertemuan(kelas, p, bank).forEach(tambah);
        }
        if (p.komponen.includes('latihan')) {
            tambah({ ...dasar, jenis: 'latihan', judul: `Latihan Soal: ${p.judul}`, instruksi: JENIS_EVALUASI.latihan.instruksi, durasi: 0,
                target: LATIHAN_TARGET_AWAL, soal: SUSUNAN_EVALUASI.latihan.urutan.map(([tipe, i]) => bank[tipe][i]).map(({ ref, ...s }) => s) });
        }
    });
    return list;
}

const EVALUASI_AWAL = buatEvaluasiAwal();

/* =========================
   1D. SOAL DOKUMENTASI UNTUK TUGAS (contoh lembar soal gambar) & DATA LAMA BANK SOAL
   Dokumentasi soal (gambar/PDF) kini menjadi bagian dari TUGAS, BUKAN Latihan Soal.
   - Lembar soal contoh (SVG kecil) dipakai sebagai dokumentasi soal tugas Pertemuan 1 (data awal).
   - BANK_SOAL_AWAL = data awal koleksi lama dellearn.banksoal.v1 (P5 lanjutan). Koleksi itu tidak dipakai lagi;
     hanya dibaca sekali oleh migrasi v4 (dokumen & jawaban foto peserta → Tugas) dan tidak dihapus.
========================= */
function escapeXml(teks) {
    return String(teks).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
}

// Lembar soal contoh berbentuk gambar (SVG kecil, tanpa file eksternal)
function gambarLembarSoal(judul, subjudul, soal) {
    const baris = soal.map((s, i) => `<text x="40" y="${170 + i * 70}" font-size="22" fill="#1f2937">${i + 1}. ${escapeXml(s)}</text>`).join('');
    const tinggi = 210 + soal.length * 70;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="${tinggi}" viewBox="0 0 900 ${tinggi}">`
        + `<rect width="900" height="${tinggi}" fill="#ffffff"/><rect x="0" y="0" width="900" height="90" fill="#1a56db"/>`
        + `<text x="40" y="58" font-size="30" font-family="Arial, sans-serif" font-weight="bold" fill="#ffffff">${escapeXml(judul)}</text>`
        + `<text x="40" y="128" font-size="20" font-family="Arial, sans-serif" fill="#4b5563">${escapeXml(subjudul)}</text>`
        + `<g font-family="Arial, sans-serif">${baris}</g>`
        + `<text x="40" y="${tinggi - 30}" font-size="16" font-family="Arial, sans-serif" fill="#6b7280">Kerjakan di kertas, foto jawabanmu, lalu unggah di DelLearn.</text></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const DOKUMEN_SOAL_CONTOH = {
    'Matematika': { soal: ['Tentukan nilai x dari 3x + 5 = 20.', 'Tentukan nilai x dari 2(x − 4) = 10.', 'Tentukan nilai x dari x/2 + 7 = 12.'], kunci: '1) x = 5\n2) x = 9\n3) x = 10\nNilai penuh bila langkah penyelesaian ditulis lengkap.' },
    'Bahasa Inggris': { soal: ['Write three sentences to introduce yourself.', 'Translate: "Nama saya Rina. Saya berumur 13 tahun."', 'Write one question to ask about someone\'s hobby.'], kunci: '1) Bebas, memuat nama, umur, asal.\n2) My name is Rina. I am 13 years old.\n3) Contoh: What is your hobby?' },
    'IPA': { soal: ['Sepeda menempuh 300 m dalam 60 s. Hitung kecepatannya.', 'Mobil bergerak 20 m/s selama 15 s. Berapa jaraknya?', 'Sebutkan perbedaan GLB dan GLBB.'], kunci: '1) v = 300 ÷ 60 = 5 m/s\n2) s = 20 × 15 = 300 m\n3) GLB kecepatan tetap; GLBB kecepatan berubah beraturan (ada percepatan).' },
    'IPS': { soal: ['Sebutkan dua faktor pendorong perubahan sosial budaya.', 'Berikan satu contoh perubahan sosial akibat teknologi.', 'Jelaskan satu dampak positif dan satu dampak negatifnya.'], kunci: '1) Contoh: pendidikan maju, kontak dengan budaya lain, keinginan untuk maju.\n2) Contoh: komunikasi lewat ponsel pintar.\n3) Positif: informasi cepat; negatif: berkurangnya interaksi langsung.' },
    'Bahasa Indonesia': { soal: ['Sebutkan struktur teks laporan percobaan.', 'Tuliskan tujuan percobaan "telur mengapung di air garam".', 'Tuliskan tiga langkah percobaan tersebut.'], kunci: '1) Tujuan, alat dan bahan, langkah kerja, hasil, simpulan.\n2) Mengetahui pengaruh garam terhadap telur di dalam air.\n3) Isi gelas dengan air, masukkan telur, tambahkan garam sedikit demi sedikit.' },
};

// Lembar soal Pertemuan 1 setiap mapel (data awal lama Bank Soal — acuan migrasi v4)
function buatBankSoalAwal() {
    return MAPEL_OPTIONS.map(m => m.nama).filter(mapel => DOKUMEN_SOAL_CONTOH[mapel]).map((mapel, i) => {
        const contoh = DOKUMEN_SOAL_CONTOH[mapel];
        const topik = (TOPIK_PERTEMUAN[mapel] || [])[0] || '';
        const data = gambarLembarSoal(`${mapel} · Pertemuan 1`, `Lembar Soal: ${topik}`, contoh.soal);
        return {
            id: i + 1, nama: `${mapel} Pertemuan 1`, mapel, nomorPertemuan: 1,
            file: { nama: `lembar-soal-${buatSlug(mapel)}-p1.svg`, tipe: 'gambar', mime: 'image/svg+xml', ukuran: data.length, data },
            kunci: contoh.kunci, status: 'Aktif', dibuat: `${MULAI_PERTEMUAN}T08:00:00`,
        };
    });
}

const BANK_SOAL_AWAL = buatBankSoalAwal();

// Data awal tugas dilengkapi soal (teks) & dokumentasi soal (lembar soal gambar Pertemuan 1)
function lengkapiTugasAwal() {
    TUGAS_AWAL.forEach(t => {
        const p = PERTEMUAN_AWAL.find(x => x.id === t.pertemuanId);
        const kelas = KELAS_AWAL.find(k => k.id === t.kelasId);
        if (!p || !kelas) {
            return;
        }
        t.soal = SOAL_TUGAS_KHUSUS[`${t.kelasId}-${p.nomor}`]
            || `1. Jelaskan pengertian ${p.judul} dengan bahasamu sendiri.\n2. Berikan satu contoh penerapan ${p.judul} dalam kehidupan sehari-hari.\n3. Tuliskan satu hal yang paling sulit dari materi ini dan cara kamu memahaminya.`;
        if (p.nomor === 1 && DOKUMEN_SOAL_CONTOH[kelas.mapel]) {
            const data = gambarLembarSoal(`${kelas.mapel} · Pertemuan 1`, `Lembar Soal: ${p.judul}`, DOKUMEN_SOAL_CONTOH[kelas.mapel].soal);
            t.fileSoal = { nama: `lembar-soal-${buatSlug(kelas.mapel)}-p1.svg`, ukuran: data.length, tipe: 'image/svg+xml', data };
        }
    });
}
lengkapiTugasAwal();

/* =========================
   1E. KONTEN LENGKAP PERTEMUAN 4 (kelima kelas awal)
   Pertemuan 4 semula hanya memiliki Pretest (+ satu modul Draft berisi kerangka di Matematika).
   Bagian ini melengkapi Modul (materi utuh), Aktivitas Interaktif (3 aktivitas + Mini Challenge dari bank soal),
   Latihan Soal (10 soal dari bank soal pertemuan), Tugas (ketik / upload file), dan Kuis (10 soal baru, berbeda dari
   soal Pretest & Latihan). Dipakai untuk data awal dan migrasi v7 (data yang sudah tersimpan) lewat
   lengkapiPertemuan4(): hanya komponen yang BELUM ada yang ditambahkan (ID baru di akhir koleksi, tanpa duplikat).
========================= */
const KONTEN_PERTEMUAN_4 = {
    'Matematika': {
        modul: {
            deskripsi: 'Materi Pertemuan 4: relasi, fungsi (pemetaan), domain–kodomain–range, notasi & nilai fungsi, serta banyak pemetaan.',
            isi: '## Tujuan Pembelajaran\nSetelah mempelajari modul ini, kamu dapat membedakan relasi dan fungsi, menyatakan relasi dengan beberapa cara, menentukan domain, kodomain, dan range, serta menghitung nilai fungsi.\n\n'
                + '## 1. Relasi\nRelasi dari himpunan A ke himpunan B adalah aturan yang memasangkan anggota A dengan anggota B.\nContoh: A = {Rina, Doni, Sari}, B = {Matematika, IPA, IPS}, relasi "pelajaran yang disukai": Rina → Matematika, Doni → IPA, Sari → Matematika, Sari → IPS.\nRelasi dapat dinyatakan dengan tiga cara:\n• Diagram panah\n• Himpunan pasangan berurutan: {(Rina, Matematika), (Doni, IPA), (Sari, Matematika), (Sari, IPS)}\n• Diagram Cartesius (titik-titik pada bidang koordinat)\n\n'
                + '## 2. Fungsi (Pemetaan)\nFungsi dari A ke B adalah relasi khusus yang memasangkan SETIAP anggota A dengan TEPAT SATU anggota B.\nRelasi "pelajaran yang disukai" di atas BUKAN fungsi, karena Sari dipasangkan dengan dua pelajaran.\nAnggota B boleh tidak mendapat pasangan atau mendapat lebih dari satu pasangan.\n\n'
                + '## 3. Domain, Kodomain, dan Range\n• Domain (daerah asal) = himpunan A.\n• Kodomain (daerah kawan) = himpunan B.\n• Range (daerah hasil) = anggota B yang mendapat pasangan.\nContoh: A = {1, 2, 3}, B = {1, 2, 3, 4, 5, 6}, aturan "dua kali dari". Pasangan: (1, 2), (2, 4), (3, 6). Domain {1, 2, 3}, kodomain {1, 2, 3, 4, 5, 6}, range {2, 4, 6}.\n\n'
                + '## 4. Notasi dan Nilai Fungsi\nFungsi ditulis f: x → ax + b atau f(x) = ax + b.\nNilai fungsi diperoleh dengan mengganti x pada rumus. Contoh: f(x) = 3x − 1 → f(2) = 3(2) − 1 = 5.\n\n'
                + '## 5. Banyak Pemetaan\nJika n(A) = a dan n(B) = b, banyak pemetaan dari A ke B = b^a, dan dari B ke A = a^b.\nContoh: n(A) = 2 dan n(B) = 3 → banyak pemetaan dari A ke B = 3² = 9.',
            contoh: 'Diketahui f(x) = 2x + 3 dengan domain {0, 1, 2, 3}.\nf(0) = 3, f(1) = 5, f(2) = 7, f(3) = 9 → range = {3, 5, 7, 9}.\nJika f(a) = 15, maka 2a + 3 = 15 → 2a = 12 → a = 6.',
            rangkuman: 'Relasi memasangkan anggota dua himpunan. Fungsi adalah relasi yang memasangkan setiap anggota domain dengan tepat satu anggota kodomain; range adalah himpunan hasilnya. Nilai fungsi dicari dengan mensubstitusi x ke rumus f(x), dan banyak pemetaan dari A ke B = n(B)^n(A).',
        },
        aktivitas: [
            AKT.group('Fungsi atau Bukan Fungsi?', ['Fungsi', 'Bukan Fungsi'], [
                ['{(1, a), (2, b), (3, c)}', 0], ['{(1, a), (1, b), (2, c)}', 1], ['{(1, a), (2, a), (3, a)}', 0],
                ['{(2, p), (3, q), (2, r)}', 1], ['{(0, 1), (1, 2), (2, 3)}', 0], ['{(5, x), (5, y), (6, z)}', 1],
            ]),
            AKT.match('Hitung Nilai Fungsi f(x) = 2x + 1', [['f(0)', '1'], ['f(2)', '5'], ['f(4)', '9'], ['f(−1)', '−1']]),
            AKT.error('Cari Kesalahan Domain dan Nilai Fungsi', [
                [['Pada fungsi f: A → B,', 'himpunan A disebut', 'kodomain'], 2, 'domain', ['range', 'relasi'], 'Himpunan A (daerah asal) disebut domain; kodomain adalah himpunan B.'],
                [['f(x) = 3x − 2,', 'sehingga', 'f(4) = 14'], 2, 'f(4) = 10', ['f(4) = 12', 'f(4) = 6'], 'f(4) = 3(4) − 2 = 12 − 2 = 10.'],
            ]),
        ],
        tugas: {
            judul: 'Tugas Relasi dan Fungsi',
            deskripsi: 'Kerjakan ketiga soal dengan menuliskan langkah penyelesaian. Jawaban boleh diketik langsung atau ditulis di kertas lalu difoto/di-scan dan diunggah (PDF/JPG/PNG, maks. 10 MB).',
            soal: '1. Diketahui A = {1, 2, 3, 4} dan B = {2, 3, 4, 5, 6}. Relasi dari A ke B adalah "satu kurangnya dari". Tuliskan relasi tersebut sebagai himpunan pasangan berurutan, lalu jelaskan apakah relasi itu merupakan fungsi.\n2. Fungsi f(x) = 4x − 3 dengan domain {−1, 0, 1, 2}. Tentukan range fungsi tersebut.\n3. Jika g(x) = 5x + 2 dan g(a) = 27, tentukan nilai a beserta langkah-langkahnya.',
        },
        kuis: {
            pg: [
                ['Relasi "faktor dari" dari A = {2, 3, 5} ke B = {4, 6, 9, 10, 15} memuat pasangan berikut, kecuali …', ['(3, 10)', '(2, 4)', '(3, 9)', '(5, 15)'], 0, '3 bukan faktor dari 10.'],
                ['Diketahui f(x) = 5 − 2x. Nilai f(−3) adalah …', ['11', '−1', '1', '−11'], 0, 'f(−3) = 5 − 2(−3) = 5 + 6 = 11.'],
                ['Fungsi f(x) = ax + 3 memiliki nilai f(2) = 11. Nilai a adalah …', ['4', '3', '7', '5'], 0, '2a + 3 = 11 → 2a = 8 → a = 4.'],
                ['Diketahui n(P) = 3 dan n(Q) = 2. Banyak pemetaan dari P ke Q adalah …', ['8', '9', '6', '5'], 0, 'n(Q)^n(P) = 2³ = 8.'],
                ['Range fungsi f(x) = x² dengan domain {−2, −1, 0, 1, 2} adalah …', ['{0, 1, 4}', '{−4, −1, 0, 1, 4}', '{−2, −1, 0, 1, 2}', '{1, 4}'], 0, 'f(±2) = 4, f(±1) = 1, f(0) = 0 → {0, 1, 4}.'],
                ['Fungsi f(x) = 2x − 1 dalam notasi pemetaan ditulis …', ['f: x → 2x − 1', 'f: 2x → x − 1', 'f: x → x − 2', 'f: 2 → x − 1'], 0, 'Notasi pemetaan: f: x → rumus fungsinya.'],
            ],
            bs: [
                ['Pada fungsi, setiap anggota kodomain harus memiliki pasangan di domain.', false, 'Yang wajib berpasangan tepat satu kali adalah anggota domain; anggota kodomain boleh tidak berpasangan.'],
                ['Range selalu merupakan himpunan bagian dari kodomain.', true, 'Range adalah anggota kodomain yang mendapat pasangan.'],
                ['Jika f(x) = 3x + 2, maka f(0) = 2.', true, 'f(0) = 3(0) + 2 = 2.'],
                ['Himpunan {(1, 2), (2, 3), (1, 4)} merupakan fungsi.', false, 'Anggota 1 memiliki dua pasangan (2 dan 4).'],
            ],
        },
    },
    'Bahasa Inggris': {
        modul: {
            deskripsi: 'Materi Pertemuan 4: penggunaan simple present tense, pola kalimat positif–negatif–tanya, aturan -s/-es, dan adverb of frequency.',
            isi: '## Tujuan Pembelajaran\nSetelah mempelajari modul ini, kamu dapat memakai simple present tense untuk menceritakan kebiasaan, rutinitas, dan fakta; membuat kalimat positif, negatif, dan tanya dengan benar; serta memakai adverb of frequency.\n\n'
                + '## 1. Kapan Dipakai?\n• Kebiasaan dan rutinitas: I brush my teeth twice a day.\n• Fakta umum: The earth goes around the sun.\n• Jadwal: The bus leaves at 7 a.m.\n\n'
                + '## 2. Pola Kalimat dengan Kata Kerja\n(+) Subject + V1 (s/es): She reads a book every night.\n(−) Subject + do/does + not + V1: She does not (doesn\'t) read comics.\n(?) Do/Does + Subject + V1?: Does she read every night? — Yes, she does. / No, she doesn\'t.\nI / You / We / They memakai "do"; He / She / It memakai "does".\n\n'
                + '## 3. Menambah -s / -es (subjek He, She, It)\n• Umumnya + s: play → plays, eat → eats\n• Berakhiran -o, -s, -sh, -ch, -x + es: go → goes, wash → washes, watch → watches, fix → fixes\n• Konsonan + y → ies: study → studies, fly → flies (vokal + y tetap + s: play → plays)\n• Tidak beraturan: have → has\n\n'
                + '## 4. Pola Kalimat dengan to be\n(+) I am a student. / She is kind. / They are at school.\n(−) He is not (isn\'t) late.\n(?) Are you ready?\n\n'
                + '## 5. Adverb of Frequency\nalways (selalu) – usually (biasanya) – often (sering) – sometimes (kadang-kadang) – rarely (jarang) – never (tidak pernah).\nLetaknya sebelum kata kerja utama (She always wakes up early), tetapi sesudah to be (He is never late).',
            contoh: 'Daily routine Dimas:\nDimas wakes up at 5 a.m. He takes a bath and has breakfast. He usually goes to school by bike.\nNegative: Dimas does not go to school by bus.\nQuestion: Does Dimas go to school by bike? — Yes, he does.',
            rangkuman: 'Simple present tense dipakai untuk kebiasaan, fakta umum, dan jadwal. Subjek he/she/it memakai kata kerja + s/es dan "does"; subjek I/you/we/they memakai kata kerja dasar dan "do". Negatif: do/does + not + V1; tanya: Do/Does + subjek + V1. Adverb of frequency diletakkan sebelum kata kerja utama atau sesudah to be.',
        },
        aktivitas: [
            AKT.group('Add -s, -es, or -ies?', ['+ s', '+ es', 'y → ies'], [
                ['play', 0], ['watch', 1], ['study', 2], ['read', 0], ['go', 1], ['fly', 2],
            ]),
            AKT.sentence('Build Simple Present Sentences', [['She always drinks milk in the morning.', ['drink']], ['They do not play football on Monday.', ['does']], ['Does he live near the school?', ['Do']]]),
            AKT.error('Find the Mistake', [
                [['My father', 'go', 'to the office by car.'], 1, 'goes', ['going', 'is go'], 'My father = he, sehingga kata kerjanya goes.'],
                [['They', 'doesn\'t', 'like spicy food.'], 1, 'don\'t', ['isn\'t', 'aren\'t'], 'Subjek they memakai do not (don\'t).'],
                [['Does', 'your sister', 'cooks every day?'], 2, 'cook every day?', ['cooking every day?', 'cooked every day?'], 'Setelah does, kata kerja kembali ke bentuk dasar (V1).'],
            ]),
        ],
        tugas: {
            judul: 'Tugas My Daily Routine',
            deskripsi: 'Tulis kegiatan sehari-harimu dalam bahasa Inggris memakai simple present tense. Jawaban boleh diketik langsung atau ditulis di kertas lalu difoto dan diunggah (PDF/JPG/PNG, maks. 10 MB).',
            soal: '1. Write a paragraph (at least 6 sentences) about your daily routine from morning to night. Use at least three adverbs of frequency (always, usually, often, sometimes, never).\n2. Change two of your sentences into negative sentences.\n3. Write two questions about a friend\'s routine using "Does", then answer them.',
        },
        kuis: {
            pg: [
                ['My cat … on the sofa every afternoon.', ['sleeps', 'sleep', 'sleeping', 'is sleep'], 0, 'My cat = it, sehingga kata kerjanya sleeps.'],
                ['My brother … English every evening.', ['studies', 'studys', 'study', 'studying'], 0, 'Konsonan + y berubah menjadi -ies: studies.'],
                ['We … not have class on Sunday.', ['do', 'does', 'are', 'is'], 0, 'Subjek we memakai do not.'],
                ['"… your parents work in Jakarta?" "Yes, they do."', ['Do', 'Does', 'Are', 'Is'], 0, 'Subjek jamak (your parents) memakai Do.'],
                ['Susunan yang benar dari kata: always / Andi / early / wakes up adalah …', ['Andi always wakes up early.', 'Andi wakes up always early.', 'Always Andi early wakes up.', 'Andi early always wakes up.'], 0, 'Adverb of frequency diletakkan sebelum kata kerja utama.'],
                ['Bentuk kata kerja "have" untuk subjek he/she/it adalah …', ['has', 'haves', 'having', 'had'], 0, 'Have berubah menjadi has.'],
            ],
            bs: [
                ['"She watchs TV every night" sudah benar.', false, 'Kata kerja berakhiran -ch ditambah -es: watches.'],
                ['"I am never late for school" sudah benar.', true, 'Adverb of frequency diletakkan sesudah to be.'],
                ['Kalimat "The train leaves at 8 o\'clock" menyatakan jadwal.', true, 'Simple present juga dipakai untuk jadwal.'],
                ['Jawaban singkat untuk "Does he like music?" adalah "Yes, he do."', false, 'Yang benar: "Yes, he does."'],
            ],
        },
    },
    'IPA': {
        modul: {
            deskripsi: 'Materi Pertemuan 4: usaha, daya, dan pesawat sederhana (tuas, katrol, bidang miring, roda berporos) beserta keuntungan mekanisnya.',
            isi: '## Tujuan Pembelajaran\nSetelah mempelajari modul ini, kamu dapat menghitung usaha dan daya, menjelaskan jenis-jenis pesawat sederhana, menghitung keuntungan mekanisnya, dan memberi contoh penerapannya dalam kehidupan sehari-hari.\n\n'
                + '## 1. Usaha\nUsaha (W) adalah hasil kali gaya (F) dengan perpindahan (s) yang searah gaya.\nW = F × s (satuan joule, J)\nUsaha bernilai nol jika benda tidak berpindah, misalnya saat mendorong tembok yang tidak bergeser.\n\n'
                + '## 2. Daya\nDaya (P) adalah usaha yang dilakukan setiap satuan waktu.\nP = W ÷ t (satuan watt, W)\n\n'
                + '## 3. Pesawat Sederhana\nPesawat sederhana adalah alat yang memudahkan pekerjaan. Pesawat sederhana tidak mengurangi usaha, tetapi memperkecil gaya atau mengubah arah gaya.\nKeuntungan mekanis (KM) = berat beban ÷ gaya kuasa.\n\n'
                + '## 4. Tuas (Pengungkit)\nBagian tuas: titik tumpu, beban, dan kuasa. Berlaku: beban × lengan beban = kuasa × lengan kuasa, dan KM = lengan kuasa ÷ lengan beban.\n• Jenis pertama (titik tumpu di tengah): gunting, tang, jungkat-jungkit.\n• Jenis kedua (beban di tengah): gerobak dorong, pembuka tutup botol, pemecah kemiri.\n• Jenis ketiga (kuasa di tengah): pinset, sekop, alat pancing.\n\n'
                + '## 5. Katrol\n• Katrol tetap: KM = 1, hanya mengubah arah gaya (tiang bendera, timba sumur).\n• Katrol bebas: KM = 2.\n• Katrol majemuk: KM = jumlah tali yang menyangga beban.\n\n'
                + '## 6. Bidang Miring\nKM = panjang bidang miring ÷ tinggi. Semakin landai, semakin kecil gaya yang diperlukan.\nContoh: tangga, jalan berkelok di pegunungan, sekrup, dan baji (kapak, pisau).\n\n'
                + '## 7. Roda Berporos\nRoda yang dihubungkan dengan poros sehingga berputar bersama, misalnya setir mobil, gerinda, dan roda sepeda.',
            contoh: 'Batu 600 N diangkat dengan tuas. Lengan beban 0,5 m dan lengan kuasa 1,5 m.\nKuasa = (600 × 0,5) ÷ 1,5 = 200 N, KM = 1,5 ÷ 0,5 = 3.\nMendorong lemari dengan gaya 50 N sejauh 4 m: W = 50 × 4 = 200 J.',
            rangkuman: 'Usaha W = F × s (joule) dan daya P = W ÷ t (watt). Pesawat sederhana (tuas, katrol, bidang miring, roda berporos) memudahkan pekerjaan dengan memperkecil gaya atau mengubah arah gaya. Keuntungan mekanis = beban ÷ kuasa; pada tuas = lengan kuasa ÷ lengan beban, pada bidang miring = panjang ÷ tinggi.',
        },
        aktivitas: [
            AKT.group('Tuas Jenis Berapa?', ['Jenis Pertama (tumpu di tengah)', 'Jenis Kedua (beban di tengah)', 'Jenis Ketiga (kuasa di tengah)'], [
                ['Gunting', 0], ['Gerobak dorong', 1], ['Pinset', 2], ['Jungkat-jungkit', 0], ['Pembuka tutup botol', 1], ['Sekop', 2],
            ]),
            AKT.match('Pesawat Sederhana dan Contohnya', [['Katrol tetap', 'Timba sumur'], ['Bidang miring', 'Jalan berkelok di pegunungan'], ['Roda berporos', 'Setir mobil'], ['Baji', 'Kapak']]),
            AKT.tf('Benar atau Salah: Usaha dan Daya', [
                ['Mendorong tembok yang tidak bergeser tidak menghasilkan usaha.', true, 'Perpindahannya nol, sehingga W = 0.'],
                ['Satuan usaha adalah watt.', false, 'Usaha dalam joule; watt adalah satuan daya.'],
                ['Gaya 10 N yang memindahkan benda sejauh 3 m menghasilkan usaha 30 J.', true, 'W = 10 × 3 = 30 J.'],
                ['Pesawat sederhana mengurangi besar usaha yang dilakukan.', false, 'Pesawat sederhana memperkecil gaya, bukan usaha.'],
            ]),
        ],
        tugas: {
            judul: 'Tugas Pesawat Sederhana di Rumah',
            deskripsi: 'Amati alat di rumahmu, lalu kerjakan soal hitungan dengan langkah lengkap. Jawaban boleh diketik atau ditulis di kertas lalu difoto/di-scan dan diunggah (PDF/JPG/PNG, maks. 10 MB).',
            soal: '1. Temukan 3 alat di rumahmu yang termasuk pesawat sederhana. Sebutkan jenisnya (tuas jenis ke berapa, katrol, bidang miring, atau roda berporos) dan jelaskan cara alat itu memudahkan pekerjaan.\n2. Peti 800 N didorong ke atas truk melalui papan sepanjang 4 m dengan tinggi bak truk 1 m. Hitung gaya dorong yang diperlukan dan keuntungan mekanisnya.\n3. Seorang anak menarik kereta mainan dengan gaya 15 N sejauh 8 m dalam waktu 4 sekon. Hitung usaha dan dayanya.',
        },
        kuis: {
            pg: [
                ['Ali mendorong meja dengan gaya 40 N sehingga meja berpindah 3 m. Usaha yang dilakukan Ali adalah …', ['120 J', '43 J', '13,3 J', '37 J'], 0, 'W = 40 × 3 = 120 J.'],
                ['Sebuah mesin melakukan usaha 600 J dalam 20 sekon. Dayanya adalah …', ['30 W', '12.000 W', '580 W', '620 W'], 0, 'P = 600 ÷ 20 = 30 W.'],
                ['Beban 300 N diangkat dengan tuas yang lengan bebannya 0,5 m dan lengan kuasanya 1,5 m. Gaya kuasa yang diperlukan adalah …', ['100 N', '900 N', '150 N', '450 N'], 0, '300 × 0,5 = F × 1,5 → F = 100 N.'],
                ['Bidang miring panjangnya 6 m dan tingginya 2 m. Keuntungan mekanisnya adalah …', ['3', '12', '4', '8'], 0, 'KM = 6 ÷ 2 = 3.'],
                ['Keuntungan mekanis katrol bebas adalah …', ['2', '1', '3', '4'], 0, 'Gaya kuasa katrol bebas setengah dari berat beban.'],
                ['Alat yang bekerja dengan prinsip roda berporos adalah …', ['setir mobil', 'pinset', 'tangga', 'gunting'], 0, 'Setir mobil adalah roda yang terhubung dengan poros.'],
            ],
            bs: [
                ['Pembuka tutup botol termasuk tuas jenis kedua.', true, 'Beban berada di antara titik tumpu dan kuasa.'],
                ['Semakin curam bidang miring, semakin kecil gaya yang diperlukan.', false, 'Semakin landai (panjang) bidang miring, semakin kecil gayanya.'],
                ['Usaha 1 joule sama dengan gaya 1 newton yang memindahkan benda sejauh 1 meter.', true, '1 J = 1 N × 1 m.'],
                ['Pisau dan kapak tidak termasuk pesawat sederhana.', false, 'Pisau dan kapak adalah baji, penerapan bidang miring.'],
            ],
        },
    },
    'IPS': {
        modul: {
            deskripsi: 'Materi Pertemuan 4: pengertian, faktor pendorong, ekspor–impor, manfaat & dampak, serta kebijakan perdagangan internasional.',
            isi: '## Tujuan Pembelajaran\nSetelah mempelajari modul ini, kamu dapat menjelaskan pengertian perdagangan internasional, faktor pendorong dan manfaatnya, membedakan ekspor dan impor, serta menjelaskan kebijakan perdagangan internasional.\n\n'
                + '## 1. Pengertian\nPerdagangan internasional adalah kegiatan jual beli barang dan jasa antara penduduk suatu negara dengan penduduk negara lain berdasarkan kesepakatan bersama.\n\n'
                + '## 2. Faktor Pendorong\n• Perbedaan sumber daya alam dan iklim (Indonesia kaya kelapa sawit, Australia kaya gandum).\n• Perbedaan kemampuan teknologi.\n• Keinginan memperluas pasar dan memperoleh keuntungan.\n• Kebutuhan dalam negeri yang tidak dapat dipenuhi sendiri.\n• Efisiensi biaya produksi.\n\n'
                + '## 3. Ekspor dan Impor\n• Ekspor: menjual barang/jasa ke luar negeri. Contoh ekspor Indonesia: minyak kelapa sawit, batu bara, karet, kopi, tekstil.\n• Impor: membeli barang/jasa dari luar negeri. Contoh impor Indonesia: gandum, kedelai, mesin, kendaraan.\nEkspor menghasilkan devisa (alat pembayaran luar negeri) bagi negara.\n\n'
                + '## 4. Manfaat dan Dampak\nManfaat: memperoleh barang yang tidak diproduksi sendiri, memperluas pasar, menambah devisa, memperluas lapangan kerja, dan alih teknologi.\nDampak negatif: ketergantungan pada negara lain, persaingan dengan produk lokal, dan meningkatnya perilaku konsumtif.\n\n'
                + '## 5. Kebijakan Perdagangan Internasional\n• Tarif/bea masuk: pajak atas barang impor.\n• Kuota: pembatasan jumlah barang impor atau ekspor.\n• Subsidi: bantuan pemerintah agar produk dalam negeri lebih murah dan mampu bersaing.\n• Embargo: larangan perdagangan dengan negara tertentu.\n• Dumping: menjual barang di luar negeri lebih murah daripada di dalam negeri.\n\n'
                + '## 6. Alat Pembayaran\nPembayaran internasional memakai valuta asing (devisa), misalnya melalui letter of credit (L/C), transfer bank, atau cek.',
            contoh: 'Indonesia mengekspor minyak kelapa sawit ke India dan mengimpor gandum dari Australia.\nDevisa dari penjualan sawit dipakai untuk membeli gandum, yang sulit ditanam secara luas di iklim tropis.',
            rangkuman: 'Perdagangan internasional terjadi karena setiap negara memiliki sumber daya, iklim, dan teknologi yang berbeda. Ekspor menambah devisa, sedangkan impor memenuhi kebutuhan yang tidak diproduksi sendiri. Pemerintah mengatur perdagangan dengan tarif, kuota, subsidi, dan embargo.',
        },
        aktivitas: [
            AKT.group('Ekspor atau Impor Indonesia?', ['Komoditas Ekspor Utama', 'Komoditas Impor Utama'], [
                ['Minyak kelapa sawit', 0], ['Gandum', 1], ['Batu bara', 0], ['Kedelai', 1], ['Karet', 0], ['Mesin industri', 1],
            ]),
            AKT.match('Istilah Kebijakan Perdagangan', [['Tarif', 'Pajak atas barang impor'], ['Kuota', 'Pembatasan jumlah barang'], ['Embargo', 'Larangan dagang dengan negara tertentu'], ['Subsidi', 'Bantuan agar produk dalam negeri lebih murah']]),
            AKT.tf('Benar atau Salah: Perdagangan Internasional', [
                ['Perdagangan internasional dapat memperluas lapangan kerja.', true, 'Industri ekspor membutuhkan banyak tenaga kerja.'],
                ['Embargo bertujuan memperlancar perdagangan dengan semua negara.', false, 'Embargo melarang perdagangan dengan negara tertentu.'],
                ['Subsidi membantu produk dalam negeri bersaing di pasar.', true, 'Harga produk menjadi lebih murah.'],
                ['Impor selalu merugikan negara.', false, 'Impor membantu memenuhi kebutuhan yang tidak diproduksi sendiri.'],
            ]),
        ],
        tugas: {
            judul: 'Tugas Produk Impor di Sekitarku',
            deskripsi: 'Amati barang di rumah atau di toko sekitar, lalu jawab pertanyaan. Jawaban boleh diketik atau ditulis tangan lalu difoto dan diunggah (PDF/JPG/PNG, maks. 10 MB).',
            soal: '1. Catat 3 barang di rumahmu yang merupakan produk impor (lihat tulisan "Made in …" atau negara asal pada kemasan). Tuliskan nama barang dan negara asalnya.\n2. Sebutkan 2 komoditas ekspor Indonesia dan jelaskan mengapa Indonesia mampu mengekspornya.\n3. Menurutmu, apa satu dampak positif dan satu dampak negatif perdagangan internasional bagi masyarakat di sekitarmu? Jelaskan dengan contoh.',
        },
        kuis: {
            pg: [
                ['Pembayaran dalam perdagangan internasional menggunakan …', ['valuta asing (devisa)', 'barter barang', 'uang rupiah saja', 'emas batangan saja'], 0, 'Transaksi antarnegara memakai mata uang asing (devisa).'],
                ['Negara yang mengirim barang ke luar negeri disebut negara …', ['pengekspor', 'pengimpor', 'penerima', 'konsumen'], 0, 'Negara pengekspor menjual barang ke luar negeri.'],
                ['Indonesia mengimpor gandum terutama karena …', ['iklim tropis kurang cocok untuk menanam gandum secara luas', 'gandum dilarang ditanam', 'harga gandum lokal terlalu murah', 'gandum tidak dibutuhkan masyarakat'], 0, 'Gandum tumbuh baik di daerah beriklim sedang/subtropis.'],
                ['Bantuan pemerintah kepada produsen dalam negeri agar harga produknya lebih murah disebut …', ['subsidi', 'tarif', 'kuota', 'embargo'], 0, 'Subsidi meringankan biaya produksi.'],
                ['Salah satu dampak negatif perdagangan internasional adalah …', ['ketergantungan pada produk negara lain', 'bertambahnya devisa', 'alih teknologi', 'meluasnya pasar'], 0, 'Ketergantungan impor melemahkan produksi dalam negeri.'],
                ['Surat jaminan pembayaran dari bank dalam perdagangan internasional disebut …', ['letter of credit (L/C)', 'kuitansi', 'nota dinas', 'surat kuasa'], 0, 'L/C menjamin pembayaran kepada eksportir.'],
            ],
            bs: [
                ['Perdagangan internasional hanya mencakup barang, tidak termasuk jasa.', false, 'Jasa seperti pariwisata dan transportasi juga diperdagangkan.'],
                ['Kuota impor dapat melindungi produsen dalam negeri.', true, 'Jumlah produk impor dibatasi agar produk lokal mampu bersaing.'],
                ['Batu bara termasuk komoditas impor utama Indonesia.', false, 'Batu bara adalah komoditas ekspor utama Indonesia.'],
                ['Alih teknologi merupakan salah satu manfaat perdagangan internasional.', true, 'Teknologi dari negara lain dapat dipelajari dan diterapkan.'],
            ],
        },
    },
    'Bahasa Indonesia': {
        modul: {
            deskripsi: 'Materi Pertemuan 4: pengertian, struktur, kaidah kebahasaan, dan cara menyampaikan teks tanggapan secara santun.',
            isi: '## Tujuan Pembelajaran\nSetelah mempelajari modul ini, kamu dapat menjelaskan pengertian dan tujuan teks tanggapan, mengidentifikasi struktur dan kaidah kebahasaannya, serta menulis tanggapan yang santun dan logis.\n\n'
                + '## 1. Pengertian\nTeks tanggapan (ulasan) adalah teks yang berisi penilaian, kritik, atau saran terhadap suatu karya, peristiwa, kebijakan, atau fenomena. Tanggapan dapat berupa pujian (kelebihan) maupun kritik (kekurangan) yang membangun.\n\n'
                + '## 2. Struktur Teks Tanggapan\n• Konteks: memperkenalkan hal yang ditanggapi (judul karya, peristiwa, atau isu).\n• Deskripsi: gambaran singkat tentang isi atau bagian penting hal tersebut.\n• Penilaian: kelebihan dan kekurangan disertai alasan atau bukti.\n• Simpulan: rangkuman penilaian serta saran atau rekomendasi.\n\n'
                + '## 3. Kaidah Kebahasaan\n• Kata sifat penilaian: menarik, membosankan, inspiratif, kurang jelas.\n• Konjungsi: tetapi, namun, meskipun, selain itu, oleh karena itu.\n• Ungkapan pendapat: menurut saya, saya kira, saya berpendapat.\n• Kalimat saran: sebaiknya, alangkah baiknya, perlu.\n\n'
                + '## 4. Menyampaikan Tanggapan secara Santun\n• Sertakan alasan yang logis dan bukti.\n• Gunakan bahasa yang sopan; hindari kata kasar dan serangan pribadi.\n• Sampaikan kelebihan sebelum kekurangan, lalu berikan saran perbaikan.',
            contoh: 'Konteks: Film "Langit Biru" mengisahkan perjuangan siswa desa mengikuti lomba sains.\nDeskripsi: Raka, tokoh utama, belajar dengan peralatan seadanya.\nPenilaian: Alur ceritanya menarik dan penuh semangat, tetapi beberapa adegan terlalu panjang sehingga terasa lambat.\nSimpulan: Film ini layak ditonton pelajar; sebaiknya durasinya dipersingkat agar lebih padat.',
            rangkuman: 'Teks tanggapan menilai suatu karya atau peristiwa dengan struktur konteks – deskripsi – penilaian – simpulan. Penilaian memuat kelebihan dan kekurangan beserta alasannya, disampaikan dengan bahasa santun, kata sifat penilaian, konjungsi, dan ungkapan pendapat.',
        },
        aktivitas: [
            AKT.order('Susun Paragraf Teks Tanggapan', [
                'Novel "Jejak di Pantai" adalah karya terbaru untuk pembaca remaja.',
                'Novel ini menceritakan persahabatan tiga remaja dari kampung nelayan.',
                'Bahasanya mudah dipahami, tetapi bagian akhir ceritanya kurang jelas.',
                'Secara keseluruhan novel ini layak dibaca; sebaiknya bagian akhirnya diperjelas.',
            ], 'Susun kalimat berikut sesuai struktur teks tanggapan: konteks, deskripsi, penilaian, simpulan.'),
            AKT.img('Tanggapan yang Santun', 'Pilih SEMUA tanggapan yang disampaikan dengan santun.', [
                ['💬', 'Menurut saya, ceritanya menarik, tetapi alurnya agak lambat.', true], ['😠', 'Filmnya jelek, pemainnya tidak berbakat!', false],
                ['👍', 'Sebaiknya penulis menambahkan gambar agar lebih menarik.', true], ['🙄', 'Buku ini membuang-buang waktu saja.', false],
                ['📝', 'Meskipun singkat, penjelasannya cukup jelas.', true],
            ]),
            AKT.group('Bagian Teks Tanggapan', ['Konteks', 'Penilaian', 'Simpulan'], [
                ['Pameran seni sekolah digelar di aula pada Sabtu lalu.', 0], ['Karya lukisnya beragam, tetapi penataan ruangnya kurang rapi.', 1],
                ['Secara keseluruhan, pameran ini layak dikunjungi.', 2], ['Film animasi "Si Kancil" tayang di bioskop mulai bulan ini.', 0],
                ['Musiknya indah, namun beberapa dialog sulit dipahami.', 1], ['Oleh karena itu, film ini cocok ditonton bersama keluarga.', 2],
            ]),
        ],
        tugas: {
            judul: 'Tugas Menulis Teks Tanggapan',
            deskripsi: 'Tulislah teks tanggapan sesuai struktur yang sudah dipelajari. Jawaban boleh diketik langsung atau ditulis tangan lalu difoto dan diunggah (PDF/JPG/PNG, maks. 10 MB).',
            soal: '1. Pilih satu karya yang pernah kamu baca atau tonton (buku, film, lagu, atau acara sekolah).\n2. Tulislah teks tanggapan minimal 4 paragraf dengan struktur konteks, deskripsi, penilaian, dan simpulan.\n3. Pada bagian penilaian, tuliskan minimal satu kelebihan dan satu kekurangan beserta alasannya.\n4. Gunakan bahasa yang santun dan minimal dua konjungsi (tetapi, namun, meskipun, selain itu, oleh karena itu).',
        },
        kuis: {
            pg: [
                ['Bagian teks tanggapan yang memperkenalkan hal yang akan ditanggapi disebut …', ['konteks', 'deskripsi', 'penilaian', 'simpulan'], 0, 'Konteks memperkenalkan karya atau peristiwa yang ditanggapi.'],
                ['Kata yang termasuk kata sifat penilaian adalah …', ['inspiratif', 'membaca', 'kemarin', 'sekolah'], 0, '"Inspiratif" menilai kualitas suatu karya.'],
                ['Konjungsi yang tepat untuk kalimat "Ceritanya menarik, … alurnya terlalu cepat." adalah …', ['tetapi', 'sehingga', 'karena', 'agar'], 0, '"Tetapi" menyatakan pertentangan.'],
                ['Ungkapan yang menandakan pendapat penulis adalah …', ['menurut saya', 'pada zaman dahulu', 'langkah pertama', 'tiba-tiba'], 0, '"Menurut saya" menandai pendapat pribadi.'],
                ['Bagian teks tanggapan yang berisi gambaran singkat isi karya disebut …', ['deskripsi', 'konteks', 'penilaian', 'simpulan'], 0, 'Deskripsi menggambarkan isi karya.'],
                ['Saran yang membangun terdapat pada kalimat …', ['Sebaiknya ukuran huruf diperbesar agar mudah dibaca.', 'Bukunya sangat buruk.', 'Saya tidak suka penulisnya.', 'Tidak ada yang menarik dari buku ini.'], 0, 'Saran membangun memberi jalan perbaikan dengan santun.'],
            ],
            bs: [
                ['Teks tanggapan hanya boleh berisi kelebihan suatu karya.', false, 'Tanggapan memuat kelebihan dan kekurangan.'],
                ['Kata "namun" dapat dipakai untuk mempertentangkan kelebihan dan kekurangan.', true, '"Namun" adalah konjungsi pertentangan.'],
                ['Simpulan teks tanggapan dapat berisi rekomendasi atau saran.', true, 'Simpulan menutup teks dengan rangkuman dan saran.'],
                ['Tanggapan yang menyerang pribadi pembuat karya termasuk tanggapan yang santun.', false, 'Tanggapan santun menilai karyanya, bukan menyerang orangnya.'],
            ],
        },
    },
};
// Konten lengkap Pertemuan 5 (kelima kelas awal; topik sesuai TOPIK_PERTEMUAN & bank soal Pertemuan 5).
// Struktur sama dengan KONTEN_PERTEMUAN_4. Pretest & Latihan diambil dari bank soal Pertemuan 5; soal Kuis ditulis baru.
const KONTEN_PERTEMUAN_5 = {
    'Matematika': {
        modul: {
            deskripsi: 'Materi Pertemuan 5: bentuk persamaan garis lurus, gradien, menentukan persamaan garis, titik potong dengan sumbu, serta garis sejajar dan tegak lurus.',
            isi: '## Tujuan Pembelajaran\nSetelah mempelajari modul ini, kamu dapat menentukan gradien garis dari persamaan maupun dari dua titik, menentukan persamaan garis, menentukan titik potong garis dengan sumbu koordinat, serta mengenali gradien garis yang sejajar dan tegak lurus.\n\n'
                + '## 1. Bentuk Persamaan Garis Lurus\nPersamaan garis lurus dapat ditulis dalam bentuk:\n• y = mx + c (m = gradien, c = titik potong dengan sumbu-y)\n• ax + by + c = 0 (bentuk umum)\nContoh: y = 2x + 3 memiliki gradien 2 dan memotong sumbu-y di (0, 3).\n\n'
                + '## 2. Gradien (Kemiringan Garis)\n• Dari persamaan y = mx + c: gradien = m.\n• Dari bentuk ax + by + c = 0: gradien = −a/b.\n• Dari dua titik (x₁, y₁) dan (x₂, y₂): m = (y₂ − y₁) ÷ (x₂ − x₁).\nGradien positif → garis naik dari kiri ke kanan; gradien negatif → garis turun; garis mendatar (y = k) memiliki gradien 0.\n\n'
                + '## 3. Menentukan Persamaan Garis\n• Melalui titik (x₁, y₁) dengan gradien m: y − y₁ = m(x − x₁).\n• Melalui dua titik: hitung gradiennya dahulu, lalu gunakan rumus di atas dengan salah satu titik.\n\n'
                + '## 4. Titik Potong dengan Sumbu\n• Dengan sumbu-x: substitusi y = 0.\n• Dengan sumbu-y: substitusi x = 0.\nContoh: 2x + 3y = 12 memotong sumbu-x di (6, 0) dan sumbu-y di (0, 4).\n\n'
                + '## 5. Garis Sejajar dan Tegak Lurus\n• Sejajar: gradiennya sama (m₁ = m₂).\n• Tegak lurus: hasil kali gradiennya −1 (m₁ × m₂ = −1).\nContoh: garis yang tegak lurus dengan y = 2x + 1 memiliki gradien −1/2.',
            contoh: 'Tentukan persamaan garis yang melalui A(1, 3) dan B(3, 7).\nGradien m = (7 − 3) ÷ (3 − 1) = 4 ÷ 2 = 2.\ny − 3 = 2(x − 1) → y − 3 = 2x − 2 → y = 2x + 1.\nCek titik B: 2(3) + 1 = 7 ✓',
            rangkuman: 'Persamaan garis lurus ditulis y = mx + c atau ax + by + c = 0. Gradien dapat dicari dari persamaan atau dari dua titik dengan m = (y₂ − y₁) ÷ (x₂ − x₁). Persamaan garis melalui satu titik: y − y₁ = m(x − x₁). Garis sejajar memiliki gradien sama; garis tegak lurus memiliki hasil kali gradien −1.',
        },
        aktivitas: [
            AKT.match('Persamaan Garis dan Gradiennya', [['y = 3x − 1', 'm = 3'], ['y = −2x + 5', 'm = −2'], ['2y = x + 4', 'm = 1/2'], ['y = 7', 'm = 0']]),
            AKT.group('Naik, Turun, atau Mendatar?', ['Naik (gradien positif)', 'Turun (gradien negatif)', 'Mendatar (gradien 0)'], [
                ['y = 4x + 1', 0], ['y = −x + 3', 1], ['y = 6', 2], ['y = x/2 − 2', 0], ['y = −3x', 1], ['y = −2', 2],
            ]),
            AKT.order('Persamaan Garis melalui (2, 1) dan (4, 5)', [
                'Hitung gradien: m = (5 − 1) ÷ (4 − 2) = 2',
                'Pilih salah satu titik, misalnya (2, 1)',
                'Substitusi ke y − y₁ = m(x − x₁): y − 1 = 2(x − 2)',
                'Uraikan: y − 1 = 2x − 4',
                'Hasilnya: y = 2x − 3',
            ], 'Susun langkah menentukan persamaan garis yang melalui titik (2, 1) dan (4, 5) dari awal sampai akhir.'),
        ],
        tugas: {
            judul: 'Tugas Persamaan Garis Lurus',
            deskripsi: 'Kerjakan ketiga soal dengan menuliskan langkah penyelesaian. Jawaban boleh diketik langsung atau ditulis di kertas lalu difoto/di-scan dan diunggah (PDF/JPG/PNG, maks. 10 MB).',
            soal: '1. Tentukan gradien garis yang melalui titik P(−2, 1) dan Q(4, 13).\n2. Tentukan persamaan garis yang melalui titik (3, −1) dan sejajar dengan garis y = 2x + 5.\n3. Garis 3x + 4y = 24 memotong sumbu-x dan sumbu-y. Tentukan kedua titik potongnya, lalu gambarkan garis tersebut pada bidang Kartesius (gambar boleh difoto).',
        },
        kuis: {
            pg: [
                ['Gradien garis 3x + y − 5 = 0 adalah …', ['−3', '3', '5', '−5'], 0, 'y = −3x + 5, sehingga gradiennya −3.'],
                ['Gradien garis yang melalui titik (−1, 4) dan (2, −2) adalah …', ['−2', '2', '−1/2', '1/2'], 0, 'm = (−2 − 4) ÷ (2 − (−1)) = −6 ÷ 3 = −2.'],
                ['Persamaan garis yang melalui (2, 5) dengan gradien 3 adalah …', ['y = 3x − 1', 'y = 3x + 5', 'y = 3x + 1', 'y = 2x + 5'], 0, 'y − 5 = 3(x − 2) → y = 3x − 1.'],
                ['Gradien garis yang tegak lurus dengan garis y = 4x − 3 adalah …', ['−1/4', '4', '−4', '1/4'], 0, '4 × m = −1 → m = −1/4.'],
                ['Titik potong garis 2x + 5y = 10 dengan sumbu-y adalah …', ['(0, 2)', '(5, 0)', '(0, 5)', '(2, 0)'], 0, 'x = 0 → 5y = 10 → y = 2.'],
                ['Titik yang terletak pada garis y = −2x + 7 adalah …', ['(3, 1)', '(1, 3)', '(2, 4)', '(0, −7)'], 0, '−2(3) + 7 = 1, sehingga (3, 1) terletak pada garis.'],
            ],
            bs: [
                ['Garis x = 3 sejajar dengan sumbu-y.', true, 'Semua titiknya memiliki x = 3, sehingga garisnya tegak dan sejajar sumbu-y.'],
                ['Garis y = 2x + 1 dan y = 2x − 4 saling sejajar.', true, 'Gradien keduanya sama, yaitu 2.'],
                ['Garis y = 3x + 6 memotong sumbu-y di titik (0, 3).', false, 'x = 0 → y = 6, jadi titik potongnya (0, 6).'],
                ['Garis y = −x + 2 naik dari kiri ke kanan.', false, 'Gradiennya −1 (negatif), sehingga garis turun dari kiri ke kanan.'],
            ],
        },
    },
    'Bahasa Inggris': {
        modul: {
            deskripsi: 'Materi Pertemuan 5: ungkapan meminta pendapat, memberi pendapat, serta menyatakan setuju dan tidak setuju secara sopan.',
            isi: '## Tujuan Pembelajaran\nSetelah mempelajari modul ini, kamu dapat meminta pendapat, memberi pendapat, serta menyatakan setuju dan tidak setuju dengan sopan dalam bahasa Inggris.\n\n'
                + '## 1. Asking for Opinion (Meminta Pendapat)\n• What do you think about …?\n• What is your opinion about …?\n• How do you feel about …?\n• Do you think …?\n• What about you?\n\n'
                + '## 2. Giving Opinion (Memberi Pendapat)\n• I think …\n• In my opinion, …\n• I believe …\n• In my view, …\n• Personally, I think …\nTips: tambahkan alasan setelah pendapat, misalnya "I think the library is comfortable because it is quiet."\n\n'
                + '## 3. Agreeing (Menyatakan Setuju)\n• I agree with you.\n• That\'s right. / Exactly.\n• I think so too.\n• Absolutely!\n\n'
                + '## 4. Disagreeing (Menyatakan Tidak Setuju dengan Sopan)\n• I don\'t think so.\n• I\'m afraid I disagree.\n• I see your point, but …\n• I\'m not sure about that.\nSaat tidak setuju, tetap hargai pendapat teman dan jelaskan alasanmu dengan sopan.',
            contoh: 'Rina: What do you think about the new school canteen?\nDoni: In my opinion, it is better because it is cleaner now.\nRina: I agree with you. But I think the food is a bit expensive.\nDoni: I see your point, but the portion is bigger.',
            rangkuman: 'Untuk meminta pendapat gunakan "What do you think about …?" atau "How do you feel about …?". Untuk memberi pendapat gunakan "I think …", "In my opinion, …", atau "I believe …" disertai alasan. Setuju: "I agree", "Exactly", "Absolutely". Tidak setuju dengan sopan: "I don\'t think so", "I\'m afraid I disagree", "I see your point, but …".',
        },
        aktivitas: [
            AKT.group('Asking, Giving, or Disagreeing?', ['Asking for Opinion', 'Giving Opinion', 'Disagreeing'], [
                ['What do you think about it?', 0], ['In my opinion, it is useful.', 1], ['I\'m afraid I disagree.', 2],
                ['How do you feel about the new rule?', 0], ['I believe we can win the match.', 1], ['I don\'t think so.', 2],
            ]),
            AKT.match('Match the Question and the Response', [
                ['What do you think about the new library?', 'I think it is very comfortable.'],
                ['Do you agree that homework is important?', 'Yes, I agree. It helps us practise.'],
                ['How do you feel about the school trip?', 'I feel excited about it.'],
                ['Is the test difficult, in your opinion?', 'In my view, it is quite easy.'],
            ]),
            AKT.sentence('Build Opinion Sentences', [['In my opinion, reading is fun.', ['opinions']], ['I don\'t think so.', ['doesn\'t']], ['What do you think about this song?', ['does']]]),
        ],
        tugas: {
            judul: 'Tugas Opinion Dialogue',
            deskripsi: 'Buat dialog dan tulis pendapatmu dalam bahasa Inggris. Jawaban boleh diketik langsung atau ditulis di kertas lalu difoto dan diunggah (PDF/JPG/PNG, maks. 10 MB).',
            soal: '1. Write a short dialogue (8–10 lines) between two students about this topic: "Should students bring mobile phones to school?" Use at least 2 expressions of asking for opinion, 2 expressions of giving opinion, 1 expression of agreeing, and 1 expression of disagreeing.\n2. Write the expressions you use in CAPITAL letters (or underline them if you write by hand).\n3. Write your own opinion about the topic in 2–3 sentences with a reason ("… because …").',
        },
        kuis: {
            pg: [
                ['Ungkapan yang digunakan untuk menyatakan setuju adalah …', ['I think so too.', 'I\'m afraid I disagree.', 'What about you?', 'I\'m not sure.'], 0, '"I think so too" berarti saya juga berpikir begitu (setuju).'],
                ['"…" — "I think the movie is boring."', ['How do you feel about the movie?', 'Where is the cinema?', 'When does the movie start?', 'Who plays in the movie?'], 0, 'Jawabannya berupa pendapat, jadi pertanyaannya meminta pendapat.'],
                ['"I see your point, but I don\'t agree." Ungkapan ini digunakan untuk …', ['tidak setuju secara sopan', 'meminta pendapat', 'memberi saran', 'meminta maaf'], 0, 'Menghargai pendapat lawan bicara, lalu menyatakan tidak setuju.'],
                ['Kata yang tepat untuk melengkapi "In my …, we should save water." adalah …', ['opinion', 'think', 'agree', 'believe'], 0, 'Ungkapan yang benar: "In my opinion".'],
                ['Dina: "The new rule is good." Andi: "Absolutely!" Artinya Andi …', ['sangat setuju', 'tidak setuju', 'ragu-ragu', 'meminta pendapat'], 0, '"Absolutely" menyatakan sangat setuju.'],
                ['Ungkapan untuk meminta pendapat adalah …', ['What is your opinion about it?', 'I believe it is good.', 'That\'s right.', 'I disagree with you.'], 0, '"What is your opinion …?" adalah kalimat tanya untuk meminta pendapat.'],
            ],
            bs: [
                ['"Personally, I think …" digunakan untuk memberi pendapat.', true, 'Ungkapan ini menyatakan pendapat pribadi.'],
                ['"Exactly!" digunakan untuk menyatakan tidak setuju.', false, '"Exactly" menyatakan setuju.'],
                ['"I\'m not sure about that" dapat menunjukkan keraguan atau ketidaksetujuan yang halus.', true, 'Ungkapan ini menolak dengan halus.'],
                ['Saat tidak setuju, sebaiknya kita memakai kata-kata kasar agar jelas.', false, 'Ketidaksetujuan tetap disampaikan dengan sopan.'],
            ],
        },
    },
    'IPA': {
        modul: {
            deskripsi: 'Materi Pertemuan 5: jaringan tumbuhan, struktur dan fungsi akar, batang, daun, fotosintesis, serta perbedaan monokotil dan dikotil.',
            isi: '## Tujuan Pembelajaran\nSetelah mempelajari modul ini, kamu dapat menjelaskan jaringan penyusun tumbuhan, struktur dan fungsi akar, batang, dan daun, proses fotosintesis, serta membedakan tumbuhan monokotil dan dikotil.\n\n'
                + '## 1. Jaringan pada Tumbuhan\n• Meristem: jaringan muda yang terus membelah (ujung akar, ujung batang, kambium).\n• Epidermis: lapisan terluar yang melindungi bagian dalam; pada daun terdapat stomata.\n• Parenkim (jaringan dasar): mengisi ruang antarjaringan dan dapat menyimpan cadangan makanan.\n• Jaringan penguat: kolenkim dan sklerenkim, memperkuat tubuh tumbuhan.\n• Jaringan pengangkut: xilem mengangkut air dan mineral dari akar ke daun; floem mengangkut hasil fotosintesis ke seluruh tubuh.\n\n'
                + '## 2. Akar\nMenyerap air dan mineral, menopang tumbuhan, dan pada beberapa tumbuhan menyimpan cadangan makanan (wortel, singkong). Rambut akar memperluas bidang penyerapan; tudung akar melindungi ujung akar saat menembus tanah.\n\n'
                + '## 3. Batang\nMenopang tubuh tumbuhan, menjadi jalur pengangkutan air dan zat makanan, serta pada beberapa tumbuhan menyimpan cadangan makanan (tebu, kentang).\n\n'
                + '## 4. Daun\nTempat fotosintesis. Kloroplas berisi klorofil (zat hijau daun). Stomata berfungsi untuk pertukaran gas dan penguapan air (transpirasi).\n\n'
                + '## 5. Fotosintesis\nkarbon dioksida + air → (cahaya matahari, klorofil) → glukosa + oksigen\n6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂\n\n'
                + '## 6. Monokotil dan Dikotil\n• Monokotil: akar serabut, tulang daun sejajar atau melengkung, umumnya tidak berkambium (padi, jagung, kelapa).\n• Dikotil: akar tunggang, tulang daun menyirip atau menjari, berkambium (mangga, kacang tanah, jambu).',
            contoh: 'Mengapa tanaman di pot menjadi layu bila lama tidak disiram?\nAkar tidak mendapat air untuk diserap, sehingga xilem tidak dapat mengangkut air ke daun. Sel-sel daun kehilangan air dan tanaman menjadi layu.',
            rangkuman: 'Tumbuhan tersusun atas jaringan meristem, epidermis, parenkim, penguat, dan pengangkut (xilem dan floem). Akar menyerap air dan mineral, batang menopang dan mengangkut zat, daun menjadi tempat fotosintesis yang menghasilkan glukosa dan oksigen. Monokotil berakar serabut dan tidak berkambium; dikotil berakar tunggang dan berkambium.',
        },
        aktivitas: [
            AKT.match('Jaringan dan Fungsinya', [['Xilem', 'Mengangkut air dan mineral'], ['Floem', 'Mengangkut hasil fotosintesis'], ['Meristem', 'Membelah diri untuk pertumbuhan'], ['Epidermis', 'Melindungi bagian dalam tumbuhan']]),
            AKT.group('Monokotil atau Dikotil?', ['Monokotil', 'Dikotil'], [
                ['Padi', 0], ['Mangga', 1], ['Jagung', 0], ['Kacang tanah', 1], ['Kelapa', 0], ['Jambu', 1],
            ]),
            AKT.order('Perjalanan Air dalam Tumbuhan', [
                'Rambut akar menyerap air dari tanah',
                'Air masuk ke xilem akar',
                'Air naik melalui xilem batang',
                'Air sampai ke daun',
                'Air dipakai untuk fotosintesis atau menguap lewat stomata',
            ], 'Susun perjalanan air dari tanah sampai ke daun.'),
        ],
        tugas: {
            judul: 'Tugas Pengamatan Struktur Tumbuhan',
            deskripsi: 'Amati satu tanaman di sekitarmu, lalu jawab pertanyaan. Jawaban boleh diketik atau ditulis/digambar di kertas lalu difoto dan diunggah (PDF/JPG/PNG, maks. 10 MB).',
            soal: '1. Pilih satu tanaman di sekitar rumahmu (misalnya rumput, cabai, atau tanaman lain). Gambar atau foto akar, batang, dan daunnya, lalu beri keterangan fungsi setiap bagian.\n2. Tentukan apakah tanaman tersebut monokotil atau dikotil. Sebutkan dua ciri yang menjadi alasanmu.\n3. Jelaskan mengapa daun disebut "dapur" bagi tumbuhan dengan menuliskan bahan, syarat, dan hasil fotosintesis.',
        },
        kuis: {
            pg: [
                ['Jaringan yang melindungi lapisan terluar tumbuhan adalah …', ['epidermis', 'xilem', 'meristem', 'floem'], 0, 'Epidermis adalah lapisan pelindung terluar.'],
                ['Tumbuhan berikut yang memiliki akar serabut adalah …', ['jagung', 'mangga', 'jambu', 'kacang tanah'], 0, 'Jagung termasuk monokotil yang berakar serabut.'],
                ['Gas yang dihasilkan dalam fotosintesis adalah …', ['oksigen', 'karbon dioksida', 'nitrogen', 'hidrogen'], 0, 'Fotosintesis menghasilkan glukosa dan oksigen.'],
                ['Penguapan air melalui stomata disebut …', ['transpirasi', 'respirasi', 'fotosintesis', 'difusi'], 0, 'Transpirasi adalah penguapan air dari daun.'],
                ['Kentang menyimpan cadangan makanan di bagian …', ['batang', 'akar', 'daun', 'bunga'], 0, 'Kentang adalah umbi batang.'],
                ['Bahan yang diperlukan dalam fotosintesis adalah …', ['karbon dioksida dan air', 'oksigen dan glukosa', 'nitrogen dan air', 'oksigen dan air'], 0, '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂.'],
            ],
            bs: [
                ['Tudung akar melindungi ujung akar saat menembus tanah.', true, 'Tudung akar berada di ujung akar sebagai pelindung.'],
                ['Tulang daun tumbuhan dikotil umumnya sejajar atau melengkung.', false, 'Itu ciri monokotil; dikotil bertulang daun menyirip atau menjari.'],
                ['Jaringan parenkim dapat menyimpan cadangan makanan.', true, 'Contohnya parenkim pada umbi.'],
                ['Xilem mengangkut zat makanan hasil fotosintesis ke seluruh tubuh tumbuhan.', false, 'Hasil fotosintesis diangkut floem; xilem mengangkut air dan mineral.'],
            ],
        },
    },
    'IPS': {
        modul: {
            deskripsi: 'Materi Pertemuan 5: pengertian pasar modal, instrumen (saham, obligasi, reksa dana), lembaga dan pelaku, manfaat, serta risiko dan investasi yang bijak.',
            isi: '## Tujuan Pembelajaran\nSetelah mempelajari modul ini, kamu dapat menjelaskan pengertian pasar modal, membedakan instrumennya, menyebutkan lembaga dan pelakunya, serta menjelaskan manfaat, risiko, dan cara berinvestasi dengan bijak.\n\n'
                + '## 1. Pengertian\nPasar modal adalah pasar untuk berbagai instrumen keuangan jangka panjang yang dapat diperjualbelikan, seperti saham dan obligasi. Pasar modal mempertemukan pihak yang membutuhkan dana (perusahaan atau pemerintah) dengan pihak yang memiliki dana (investor).\n\n'
                + '## 2. Instrumen Pasar Modal\n• Saham: bukti kepemilikan sebagian perusahaan. Keuntungannya berupa dividen (bagian laba) dan capital gain (selisih harga jual yang lebih tinggi daripada harga beli).\n• Obligasi: surat utang jangka panjang; pemegangnya mendapat bunga (kupon) dan pokok pinjaman dikembalikan saat jatuh tempo.\n• Reksa dana: wadah dana dari banyak investor yang dikelola oleh manajer investasi.\n\n'
                + '## 3. Lembaga dan Pelaku\n• Bursa Efek Indonesia (BEI): tempat perdagangan efek.\n• Otoritas Jasa Keuangan (OJK): mengatur dan mengawasi pasar modal.\n• Perusahaan efek/sekuritas: perantara jual beli saham bagi investor.\n• Emiten: perusahaan yang menerbitkan saham atau obligasi.\n• Investor: pihak yang menanamkan modal.\n\n'
                + '## 4. Manfaat Pasar Modal\n• Bagi perusahaan: sumber dana untuk mengembangkan usaha.\n• Bagi investor: sarana investasi untuk memperoleh keuntungan.\n• Bagi negara: mendorong pertumbuhan ekonomi dan membuka lapangan kerja.\n\n'
                + '## 5. Risiko dan Investasi yang Bijak\nHarga saham dapat naik atau turun, dan perusahaan yang merugi dapat tidak membagikan dividen. Berinvestasilah dengan bijak: pahami produknya, gunakan dana yang tidak dipakai untuk kebutuhan sehari-hari, pilih lembaga yang terdaftar di OJK, dan waspadai tawaran yang menjanjikan untung besar tanpa risiko (investasi bodong).',
            contoh: 'Pak Budi membeli 100 lembar saham seharga Rp1.000 per lembar (modal Rp100.000). Setahun kemudian harganya naik menjadi Rp1.200 per lembar.\nJika dijual: 100 × Rp1.200 = Rp120.000, sehingga capital gain = Rp20.000.\nJika perusahaan membagikan dividen Rp50 per lembar, Pak Budi menerima 100 × Rp50 = Rp5.000.',
            rangkuman: 'Pasar modal memperdagangkan instrumen keuangan jangka panjang seperti saham, obligasi, dan reksa dana. Perdagangan berlangsung di BEI dan diawasi OJK. Pasar modal bermanfaat bagi perusahaan, investor, dan negara, tetapi investasi memiliki risiko sehingga perlu dilakukan dengan bijak dan melalui lembaga resmi.',
        },
        aktivitas: [
            AKT.match('Istilah Pasar Modal', [['Dividen', 'Bagian laba untuk pemegang saham'], ['Capital gain', 'Keuntungan dari selisih harga jual dan beli'], ['Emiten', 'Perusahaan penerbit saham atau obligasi'], ['Sekuritas', 'Perantara jual beli saham']]),
            AKT.group('Saham, Obligasi, atau Reksa Dana?', ['Saham', 'Obligasi', 'Reksa Dana'], [
                ['Bukti kepemilikan sebagian perusahaan', 0], ['Surat utang jangka panjang', 1], ['Dana banyak investor dikelola manajer investasi', 2],
                ['Pemiliknya dapat menerima dividen', 0], ['Pemiliknya menerima kupon bunga', 1], ['Isinya dapat berupa gabungan saham dan obligasi', 2],
            ]),
            AKT.tf('Benar atau Salah: Investasi Bijak', [
                ['Tawaran investasi yang menjanjikan untung besar tanpa risiko patut dicurigai.', true, 'Setiap investasi memiliki risiko; janji tanpa risiko adalah ciri investasi bodong.'],
                ['Lembaga investasi sebaiknya dipilih yang terdaftar di OJK.', true, 'Lembaga yang terdaftar diawasi oleh OJK.'],
                ['Harga saham selalu naik setiap tahun.', false, 'Harga saham dapat naik atau turun.'],
                ['Uang untuk kebutuhan sehari-hari sebaiknya diinvestasikan seluruhnya.', false, 'Gunakan dana yang tidak dipakai untuk kebutuhan sehari-hari.'],
            ]),
        ],
        tugas: {
            judul: 'Tugas Mengenal Investasi',
            deskripsi: 'Jawab pertanyaan berikut dengan lengkap. Jawaban boleh diketik atau ditulis tangan lalu difoto dan diunggah (PDF/JPG/PNG, maks. 10 MB).',
            soal: '1. Jelaskan perbedaan saham dan obligasi dari segi kepemilikan dan bentuk keuntungannya.\n2. Rina membeli 200 lembar saham seharga Rp500 per lembar, lalu menjualnya ketika harganya Rp650 per lembar. Hitung modal awal, hasil penjualan, dan capital gain yang diperoleh Rina.\n3. Tuliskan tiga ciri investasi bodong dan cara menghindarinya.',
        },
        kuis: {
            pg: [
                ['Perusahaan yang menerbitkan saham atau obligasi disebut …', ['emiten', 'investor', 'sekuritas', 'manajer investasi'], 0, 'Emiten adalah pihak penerbit efek.'],
                ['Keuntungan dari selisih harga jual saham yang lebih tinggi daripada harga belinya disebut …', ['capital gain', 'dividen', 'kupon', 'premi'], 0, 'Capital gain = selisih harga jual dan harga beli.'],
                ['Pihak yang menanamkan modal di pasar modal disebut …', ['investor', 'emiten', 'regulator', 'debitur'], 0, 'Investor menanamkan dana untuk memperoleh keuntungan.'],
                ['Andi membeli 100 lembar saham seharga Rp2.000 per lembar, lalu menjualnya seharga Rp2.500 per lembar. Keuntungan Andi adalah …', ['Rp50.000', 'Rp500', 'Rp25.000', 'Rp250.000'], 0, '100 × (Rp2.500 − Rp2.000) = Rp50.000.'],
                ['Manfaat pasar modal bagi perusahaan adalah …', ['memperoleh dana untuk mengembangkan usaha', 'menghindari pajak', 'menghapus utang negara', 'menentukan harga barang di pasar'], 0, 'Perusahaan menjual saham/obligasi untuk mendapat dana.'],
                ['Ciri investasi bodong adalah …', ['menjanjikan keuntungan sangat besar dalam waktu singkat tanpa risiko', 'terdaftar dan diawasi OJK', 'menjelaskan risiko investasi', 'memiliki laporan keuangan yang terbuka'], 0, 'Investasi resmi selalu menjelaskan risikonya.'],
            ],
            bs: [
                ['Pemegang saham adalah salah satu pemilik perusahaan.', true, 'Saham adalah bukti kepemilikan sebagian perusahaan.'],
                ['Obligasi adalah instrumen jangka pendek yang jatuh tempo kurang dari satu bulan.', false, 'Obligasi umumnya surat utang jangka panjang.'],
                ['Perusahaan sekuritas berperan sebagai perantara jual beli saham.', true, 'Investor membeli saham melalui perusahaan sekuritas.'],
                ['Dividen selalu dibagikan walaupun perusahaan mengalami kerugian.', false, 'Dividen berasal dari laba; perusahaan yang merugi dapat tidak membagikannya.'],
            ],
        },
    },
    'Bahasa Indonesia': {
        modul: {
            deskripsi: 'Materi Pertemuan 5: pengertian, struktur, kaidah kebahasaan, fakta dan opini, serta langkah menulis teks diskusi.',
            isi: '## Tujuan Pembelajaran\nSetelah mempelajari modul ini, kamu dapat menjelaskan pengertian teks diskusi, mengidentifikasi struktur dan kaidah kebahasaannya, membedakan fakta dan opini dalam argumen, serta menulis teks diskusi.\n\n'
                + '## 1. Pengertian\nTeks diskusi adalah teks yang menyajikan suatu isu dari dua sudut pandang atau lebih, yaitu pendapat yang mendukung (pro) dan yang menentang (kontra), lalu ditutup dengan simpulan atau saran.\n\n'
                + '## 2. Struktur Teks Diskusi\n• Isu: permasalahan yang dibahas dan menimbulkan perbedaan pendapat.\n• Argumen pendukung: pendapat yang setuju, disertai alasan dan fakta.\n• Argumen penentang: pendapat yang tidak setuju, disertai alasan dan fakta.\n• Simpulan/saran: pendapat akhir penulis atau jalan tengah dari kedua pendapat.\n\n'
                + '## 3. Kaidah Kebahasaan\n• Konjungsi pertentangan: namun, tetapi, sebaliknya, meskipun demikian.\n• Konjungsi penambahan dan urutan: selain itu, di samping itu, pertama, kedua.\n• Ungkapan pendapat: menurut, sebagian orang berpendapat, ada yang menganggap.\n• Kata penyimpul: jadi, dengan demikian, oleh karena itu.\n\n'
                + '## 4. Fakta dan Opini\nArgumen yang kuat didukung fakta, misalnya data, hasil survei, atau kejadian nyata, bukan hanya opini pribadi.\nFakta: "Survei sekolah menunjukkan 70% siswa membawa bekal." Opini: "Bekal dari rumah lebih enak."\n\n'
                + '## 5. Langkah Menulis Teks Diskusi\n• Tentukan isu yang menimbulkan pro dan kontra.\n• Kumpulkan argumen dan fakta dari kedua pihak.\n• Susun sesuai struktur: isu, argumen pendukung, argumen penentang, simpulan.\n• Tutup dengan simpulan atau saran yang adil.',
            contoh: 'Isu: Perlukah siswa membawa ponsel ke sekolah?\nPendukung: ponsel membantu siswa mencari informasi pelajaran dan menghubungi orang tua.\nPenentang: namun, ponsel dapat mengganggu konsentrasi dan memicu perundungan di media sosial.\nSimpulan: jadi, siswa boleh membawa ponsel, tetapi hanya digunakan saat diizinkan guru.',
            rangkuman: 'Teks diskusi menyajikan isu dari sudut pandang pendukung dan penentang dengan struktur isu – argumen pendukung – argumen penentang – simpulan/saran. Argumen sebaiknya didukung fakta, dihubungkan dengan konjungsi pertentangan dan penambahan, lalu ditutup dengan simpulan yang adil.',
        },
        aktivitas: [
            AKT.group('Isu Seragam Sekolah: Mendukung atau Menentang?', ['Argumen Pendukung', 'Argumen Penentang'], [
                ['Seragam menumbuhkan rasa disiplin', 0], ['Seragam membuat siswa tampak setara', 0], ['Seragam membatasi kreativitas berpakaian', 1],
                ['Biaya membeli seragam memberatkan sebagian orang tua', 1], ['Seragam memudahkan mengenali siswa sekolah tertentu', 0], ['Bahan seragam terasa panas saat cuaca terik', 1],
            ]),
            AKT.order('Susun Teks Diskusi', [
                'Akhir-akhir ini muncul usulan agar pekerjaan rumah (PR) dihapuskan.',
                'Sebagian orang setuju karena siswa membutuhkan waktu istirahat dan bermain bersama keluarga.',
                'Namun, sebagian lain menolak karena PR melatih siswa belajar mandiri dan mengulang pelajaran.',
                'Jadi, PR sebaiknya tetap ada, tetapi jumlahnya dibatasi agar tidak memberatkan siswa.',
            ], 'Susun kalimat berikut sesuai struktur teks diskusi: isu, argumen pendukung, argumen penentang, simpulan.'),
            AKT.error('Cari Kesalahan Konjungsi', [
                [['Ponsel memudahkan siswa belajar.', 'Karena itu,', 'ponsel juga dapat mengganggu konsentrasi.'], 1, 'Namun,', ['Selain itu,', 'Jadi,'], 'Kalimat kedua bertentangan dengan kalimat pertama, sehingga memakai konjungsi pertentangan "Namun".'],
                [['Sebagian siswa setuju dengan usulan itu.', 'Jadi,', 'sebagian lain menolaknya.'], 1, 'Sebaliknya,', ['Selain itu,', 'Oleh karena itu,'], 'Pendapat yang berlawanan dihubungkan dengan "Sebaliknya".'],
            ]),
        ],
        tugas: {
            judul: 'Tugas Menulis Teks Diskusi',
            deskripsi: 'Tulislah teks diskusi sesuai struktur yang sudah dipelajari. Jawaban boleh diketik langsung atau ditulis tangan lalu difoto dan diunggah (PDF/JPG/PNG, maks. 10 MB).',
            soal: '1. Pilih satu isu: (a) siswa SMP boleh membawa ponsel ke sekolah, (b) kantin sekolah hanya boleh menjual makanan sehat, atau (c) kegiatan belajar di sekolah dilakukan lima hari dalam seminggu.\n2. Tulislah teks diskusi minimal 4 paragraf dengan struktur isu, argumen pendukung, argumen penentang, dan simpulan/saran.\n3. Setiap argumen harus memuat minimal satu alasan atau fakta.\n4. Gunakan minimal dua konjungsi pertentangan (namun, tetapi, sebaliknya, meskipun demikian) dan tandai konjungsi tersebut.',
        },
        kuis: {
            pg: [
                ['Argumen yang tidak setuju terhadap isu disebut argumen …', ['penentang (kontra)', 'pendukung (pro)', 'simpulan', 'isu'], 0, 'Argumen penentang menolak isu.'],
                ['Kalimat yang merupakan fakta adalah …', ['Hasil survei sekolah menunjukkan 70% siswa membawa bekal dari rumah.', 'Menurut saya, bekal dari rumah lebih enak.', 'Sebaiknya semua siswa membawa bekal.', 'Bekal dari rumah pasti disukai semua orang.'], 0, 'Fakta dapat dibuktikan dengan data.'],
                ['Konjungsi yang tepat untuk menyatakan simpulan adalah …', ['dengan demikian', 'namun', 'selain itu', 'sebaliknya'], 0, '"Dengan demikian" menandai simpulan.'],
                ['Konjungsi yang tepat: "Belajar daring menghemat waktu perjalanan. …, siswa sering sulit berkonsentrasi di rumah."', ['Akan tetapi', 'Oleh karena itu', 'Selain itu', 'Jadi'], 0, 'Kedua kalimat bertentangan, sehingga memakai "Akan tetapi".'],
                ['Tujuan teks diskusi adalah …', ['menyajikan berbagai sudut pandang tentang suatu isu secara seimbang', 'menceritakan pengalaman pribadi', 'menjelaskan langkah membuat sesuatu', 'menghibur pembaca dengan kisah fantasi'], 0, 'Teks diskusi menampilkan pendapat pro dan kontra.'],
                ['Ungkapan "sebagian orang berpendapat" pada teks diskusi digunakan untuk …', ['menyampaikan pendapat pihak tertentu', 'menyatakan urutan waktu', 'menyatakan sebab akibat', 'menutup teks'], 0, 'Ungkapan ini memperkenalkan pendapat suatu pihak.'],
            ],
            bs: [
                ['Isu teks diskusi sebaiknya merupakan masalah yang menimbulkan perbedaan pendapat.', true, 'Isu memicu pendapat pro dan kontra.'],
                ['"Pertama" dan "selain itu" termasuk konjungsi pertentangan.', false, 'Keduanya menyatakan urutan atau penambahan.'],
                ['Simpulan teks diskusi dapat berupa jalan tengah dari kedua pendapat.', true, 'Simpulan boleh mengambil jalan tengah.'],
                ['Opini pribadi tanpa alasan sudah cukup menjadi argumen yang kuat.', false, 'Argumen yang kuat didukung alasan dan fakta.'],
            ],
        },
    },
};

// Pertemuan yang kontennya dilengkapi (nomor → konten per mapel); aktivitas bertipe ikut menjadi aktivitas contoh pertemuan itu
const KONTEN_PERTEMUAN_LENGKAP = { 4: KONTEN_PERTEMUAN_4, 5: KONTEN_PERTEMUAN_5 };
Object.entries(KONTEN_PERTEMUAN_LENGKAP).forEach(([nomor, konten]) => {
    Object.keys(konten).forEach(mapel => {
        AKTIVITAS_CONTOH[mapel][nomor] = konten[mapel].aktivitas;
    });
});

// Isi modul kerangka bawaan (data awal lama) — modul Draft yang isinya masih kerangka ini boleh dilengkapi
function isiModulKerangka(judul) {
    return `## Tujuan Pembelajaran\nPeserta memahami konsep ${judul} dan dapat menerapkannya pada soal latihan.\n\n## Materi Pokok\n1. Pengertian dan konsep dasar ${judul}.\n2. Langkah-langkah penting yang perlu diingat.\n3. Tips mengerjakan soal ujian sekolah.`;
}

// Lengkapi Pertemuan bernomor `nomor` (4 atau 5) kelas awal pada daftar data (diubah langsung). Hanya komponen yang BELUM
// ada yang ditambahkan; relasi memakai pertemuanId pertemuan bernomor itu di kelas tersebut. Pertemuan yang topiknya sudah
// diganti / kelas yang mapelnya berubah dilewati. Hasil: daftar catatan; data.ubah = koleksi yang berubah.
function lengkapiPertemuan4(data) {
    return lengkapiKontenPertemuan(data, 4);
}

function lengkapiKontenPertemuan(data, nomor) {
    const { kelas, pertemuan, modul, evaluasi, tugas, kuis } = data;
    const catatan = [];
    data.ubah = new Set();
    const tambah = (nama, list, item) => {
        list.push({ id: nextIdKoleksi(list), ...item });
        data.ubah.add(nama);
    };
    kelas.forEach(k => {
        const awal = KELAS_AWAL.find(a => a.id === k.id);
        const konten = (KONTEN_PERTEMUAN_LENGKAP[nomor] || {})[k.mapel];
        const topik = (TOPIK_PERTEMUAN[k.mapel] || [])[nomor - 1];
        const p = pertemuan.find(x => x.kelasId === k.id && x.nomor === nomor);
        if (!awal || awal.mapel !== k.mapel || !konten || !p || p.judul !== topik) {
            return;
        }
        const bank = soalBankPertemuan(k.mapel, nomor);
        const dasar = { kelasId: k.id, pertemuanId: p.id, status: 'Aktif' };
        const ada = (list, jenis) => list.some(x => x.pertemuanId === p.id && (!jenis || x.jenis === jenis));
        const ditambah = [];

        if (!ada(evaluasi, 'pretest')) {
            const s = SUSUNAN_EVALUASI.pretest;
            tambah('evaluasi', evaluasi, { ...dasar, jenis: 'pretest', judul: `Pretest: ${p.judul}`, instruksi: JENIS_EVALUASI.pretest.instruksi, durasi: s.durasi,
                soal: [...s.pg.map(i => bank.pg[i]), ...s.bs.map(i => bank.bs[i])].map(({ ref, ...x }) => x) });
            ditambah.push('Pretest');
        }
        // Modul: modul Draft berisi kerangka bawaan dilengkapi (tidak dibuat duplikat); modul lain milik pengajar tidak diubah
        const modulP = modul.filter(m => m.pertemuanId === p.id);
        const isiModul = { deskripsi: konten.modul.deskripsi, format: 'Tulis Materi', isi: konten.modul.isi, contoh: konten.modul.contoh, rangkuman: konten.modul.rangkuman, file: null, status: 'Aktif' };
        const kerangka = modulP.find(m => m.status === 'Draft' && m.format === 'Tulis Materi' && String(m.isi || '').trim() === isiModulKerangka(p.judul));
        if (!modulP.some(m => m.status === 'Aktif') && kerangka) {
            Object.assign(kerangka, isiModul);
            data.ubah.add('modul');
            ditambah.push('Modul (draft kerangka dilengkapi & diaktifkan)');
        } else if (!modulP.length) {
            tambah('modul', modul, { kelasId: k.id, pertemuanId: p.id, judul: p.judul, ...isiModul });
            ditambah.push('Modul');
        }
        if (!ada(evaluasi, 'aktivitas')) {
            aktivitasBawaanPertemuan(k, p, bank).forEach(a => tambah('evaluasi', evaluasi, copyData(a)));
            ditambah.push('Aktivitas Interaktif');
        }
        if (!ada(evaluasi, 'latihan')) {
            tambah('evaluasi', evaluasi, { ...dasar, jenis: 'latihan', judul: `Latihan Soal: ${p.judul}`, instruksi: JENIS_EVALUASI.latihan.instruksi, durasi: 0,
                target: LATIHAN_TARGET_AWAL, soal: SUSUNAN_EVALUASI.latihan.urutan.map(([tipe, i]) => bank[tipe][i]).map(({ ref, ...x }) => x) });
            ditambah.push('Latihan Soal');
        }
        if (!ada(tugas)) {
            tambah('tugas', tugas, { kelasId: k.id, pertemuanId: p.id, judul: konten.tugas.judul, deskripsi: konten.tugas.deskripsi, soal: konten.tugas.soal,
                fileSoal: null, metode: 'keduanya', deadline: `${tambahHari(p.tanggal, 6)}T23:59`, status: 'Aktif' });
            ditambah.push('Tugas');
        }
        if (!ada(kuis)) {
            const posisi = MAPEL_OPTIONS.findIndex(m => m.nama === k.mapel) * 3 + 1;
            const soal = [...konten.kuis.pg.map((s, i) => soalPG(s, posisi + i * 3 + Math.floor(i / 2))), ...konten.kuis.bs.map(soalBS)];
            tambah('kuis', kuis, { kelasId: k.id, pertemuanId: p.id, judul: `Kuis ${p.judul}`,
                deskripsi: `Kuis Pertemuan ${p.nomor} untuk menguji pemahaman materi ${p.judul}.`, jumlahSoal: soal.length, durasi: soal.length * 2, status: 'Aktif', soal });
            ditambah.push('Kuis');
        }
        // Daftar komponen siap pertemuan (Pretest–Kuis) ikut lengkap; tanggal, status, & urutan tidak diubah
        const semua = KOMPONEN_PERTEMUAN.map(x => x.key);
        if (semua.some(key => !p.komponen.includes(key))) {
            p.komponen = [...semua];
            data.ubah.add('pertemuan');
        }
        if (ditambah.length) {
            catatan.push(`${k.nama} · Pertemuan ${p.nomor} (${p.judul}): ${ditambah.join(', ')} ditambahkan`);
        }
    });
    return catatan;
}

// Data awal: Pertemuan 4 kelima kelas langsung lengkap (ID baru di akhir setiap koleksi, data lain tidak bergeser)
lengkapiPertemuan4({ kelas: KELAS_AWAL, pertemuan: PERTEMUAN_AWAL, modul: MODUL_AWAL, evaluasi: EVALUASI_AWAL, tugas: TUGAS_AWAL, kuis: KUIS_AWAL });
// Data awal: Pertemuan 5 kelima kelas juga lengkap (ditambahkan sesudah Pertemuan 4, ID data lain tidak bergeser)
lengkapiKontenPertemuan({ kelas: KELAS_AWAL, pertemuan: PERTEMUAN_AWAL, modul: MODUL_AWAL, evaluasi: EVALUASI_AWAL, tugas: TUGAS_AWAL, kuis: KUIS_AWAL }, 5);

/* =========================
   2. PENYIMPANAN & CRUD KELAS
========================= */

// Cadangan di memori bila localStorage tidak tersedia (mis. mode privat / diblokir)
let kelasMemory = null;

function copyData(data) {
    return JSON.parse(JSON.stringify(data));
}

function readStorage() {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        return null;
    }
}

function writeStorage(list) {
    kelasMemory = copyData(list);
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (error) {
        // localStorage tidak tersedia — data tetap ada di memori selama halaman terbuka
    }
}

// Data kelas seperti tersimpan (dari localStorage; bila kosong, pakai data awal)
function getKelasTersimpan() {
    const stored = readStorage();
    if (Array.isArray(stored)) {
        return stored;
    }
    if (kelasMemory) {
        return copyData(kelasMemory);
    }
    return copyData(KELAS_AWAL);
}

// Ambil semua kelas. Jumlah peserta selalu dihitung dari data peserta (tidak diketik manual),
// nama pengajar selalu diambil dari data pengajar terbaru (lewat pengajarId).
// Untuk Pengajar & Peserta yang login, hanya kelas miliknya yang dikembalikan (lihat filterKelasMenurutRole).
function getAllKelas() {
    const jumlah = hitungPesertaPerKelas();
    const pengajarList = getAllPengajar();
    return filterKelasMenurutRole(getKelasTersimpan().map(kelas => {
        // Data lama (sebelum Fase 2) menyimpan nama pengajar, bukan ID → dicocokkan lewat nama
        const pengajarId = kelas.pengajarId ?? cariPengajarId(kelas.pengajar, pengajarList);
        const pengajar = pengajarList.find(p => p.id === pengajarId);
        return {
            ...kelas,
            pengajarId,
            pengajar: pengajar ? pengajar.nama : (kelas.pengajar || 'Belum ditentukan'),
            peserta: jumlah[kelas.id] || 0,
        };
    }));
}

function getKelasById(id) {
    return getAllKelas().find(kelas => kelas.id === Number(id)) || null;
}

// Kode singkat kelas, mis. "Matematika" + "SMP Kelas 8" → "M8"
function buatKodeKelas(mapel, tingkat) {
    const opsi = MAPEL_OPTIONS.find(m => m.nama === mapel);
    const angka = (String(tingkat).match(/\d+/) || [''])[0];
    return (opsi ? opsi.kode : String(mapel).charAt(0).toUpperCase()) + angka;
}

// Rapikan input sebelum disimpan (teks di-trim, angka jadi Number).
// Jumlah peserta tidak ikut disimpan karena dihitung dari data peserta.
// Pengajar disimpan sebagai pengajarId (boleh dikirim sebagai ID atau nama pengajar).
function normalisasiKelas(data) {
    return {
        nama: String(data.nama || '').trim(),
        mapel: String(data.mapel || '').trim(),
        tingkat: String(data.tingkat || '').trim(),
        keterangan: String(data.keterangan || '').trim(),
        pengajarId: cariPengajarId(data.pengajarId ?? data.pengajar),
        kapasitas: Number(data.kapasitas),
        status: String(data.status || 'Aktif').trim(),
    };
}

function addKelas(data) {
    // Simpan dulu data turunan (peserta, dst.) agar ID kelas baru tidak tertukar dengan data awal
    simpanDataTerkaitKelas();
    const list = getKelasTersimpan();
    const nextId = list.reduce((max, kelas) => Math.max(max, kelas.id), 0) + 1;
    const kelas = normalisasiKelas(data);
    const baru = { id: nextId, kode: buatKodeKelas(kelas.mapel, kelas.tingkat), ...kelas };
    list.push(baru);
    writeStorage(list);
    return getKelasById(nextId);
}

function updateKelas(id, data) {
    const list = getKelasTersimpan();
    const index = list.findIndex(kelas => kelas.id === Number(id));
    if (index === -1) {
        return null;
    }
    const kelas = normalisasiKelas(data);
    list[index] = { ...list[index], ...kelas, kode: buatKodeKelas(kelas.mapel, kelas.tingkat) };
    delete list[index].peserta;
    delete list[index].pengajar;
    writeStorage(list);
    return getKelasById(id);
}

// Hapus kelas. Data terkait ikut dibersihkan (lihat RELASI_KELAS):
// peserta tidak dihapus, tetapi menjadi "Belum ada kelas".
function deleteKelas(id) {
    const list = getKelasTersimpan();
    const sisa = list.filter(kelas => kelas.id !== Number(id));
    if (sisa.length === list.length) {
        return false;
    }
    bersihkanDataKelas(Number(id));
    writeStorage(sisa);
    return true;
}

// Kembalikan data ke kondisi awal (untuk demo). Karena data kelas terhubung dengan peserta
// dan data lain, seluruh data demo ikut dikembalikan (sama dengan resetSemuaData()).
function resetKelas() {
    resetSemuaData();
    return getAllKelas();
}

/* =========================
   2A. KOLEKSI DATA LAIN, RELASI & RESET
   Setiap koleksi disimpan di localStorage dengan kuncinya sendiri. Bila belum pernah disimpan,
   data awal dipakai (membaca data tidak menulis apa pun ke localStorage).
========================= */

const STORAGE_KEYS = {
    kelas: STORAGE_KEY,
    peserta: 'dellearn.peserta.v1',
    pengajar: 'dellearn.pengajar.v1',
    pertemuan: 'dellearn.pertemuan.v1',
    modul: 'dellearn.modul.v1',
    // Tugas v2: soal (teks), dokumentasi soal (file), metode pengumpulan. dellearn.tugas.v1 dibaca sekali oleh migrasi v4.
    tugas: 'dellearn.tugas.v2',
    // Kuis v2: soal milik kuis (dibuat Pengajar). dellearn.kuis.v1 lama tidak dihapus — dibaca sekali oleh migrasi.
    kuis: 'dellearn.kuis.v2',
    to: 'dellearn.to.v1',
    nilai: 'dellearn.nilai.v1',
    evaluasi: 'dellearn.evaluasi.v1',
    hasil: 'dellearn.hasil.v1',
    progresmodul: 'dellearn.progresmodul.v1',
    // Koleksi lama (P5 lanjutan) — tidak dipakai lagi, hanya dibaca migrasi v4; tidak dihapus
    banksoal: 'dellearn.banksoal.v1',
};
const KUIS_V1_KEY = 'dellearn.kuis.v1';
const TUGAS_V1_KEY = 'dellearn.tugas.v1';

// Fungsi cek: apakah kelas awal (ID + mapel sama) masih ada di data kelas tersimpan
function cekKelasAwalAda() {
    const kelasAda = getKelasTersimpan();
    return kelasId => {
        const awal = KELAS_AWAL.find(k => k.id === kelasId);
        return kelasAda.some(k => k.id === kelasId && awal && k.mapel === awal.mapel);
    };
}

// Data awal tiap koleksi. Data yang merujuk kelas yang sudah tidak ada dilepas (peserta) atau tidak dipakai.
const DATA_AWAL = {
    peserta: () => {
        const cocok = cekKelasAwalAda();
        return copyData(PESERTA_AWAL).map(p => (cocok(p.kelasId) ? p : { ...p, kelasId: null }));
    },
    pengajar: () => copyData(PENGAJAR_AWAL),
    pertemuan: () => {
        const cocok = cekKelasAwalAda();
        return copyData(PERTEMUAN_AWAL).filter(p => cocok(p.kelasId));
    },
    modul: () => {
        const cocok = cekKelasAwalAda();
        return copyData(MODUL_AWAL).filter(m => cocok(m.kelasId));
    },
    tugas: () => {
        const cocok = cekKelasAwalAda();
        return copyData(TUGAS_AWAL).filter(t => cocok(t.kelasId));
    },
    kuis: () => {
        const cocok = cekKelasAwalAda();
        return copyData(KUIS_AWAL).filter(k => cocok(k.kelasId));
    },
    to: () => {
        const cocok = cekKelasAwalAda();
        return copyData(TO_AWAL).filter(t => cocok(t.kelasId));
    },
    nilai: () => {
        // Nilai peserta & kelas yang masih ada. Peserta yang pindah kelas tetap menyimpan nilai kelas lamanya
        // (hanya tidak ditampilkan di kelas barunya — lihat getBarisRekap).
        const cocok = cekKelasAwalAda();
        const peserta = getKoleksi('peserta');
        return copyData(NILAI_AWAL).filter(n => cocok(n.kelasId) && peserta.some(p => p.id === n.pesertaId));
    },
    evaluasi: () => {
        const cocok = cekKelasAwalAda();
        return copyData(EVALUASI_AWAL).filter(e => cocok(e.kelasId));
    },
    // Hasil awal dibentuk dari data yang sedang berlaku (peserta, nilai, evaluasi, kuis, tugas, pertemuan)
    hasil: () => buatHasilAwal(),
    progresmodul: () => [],
};

// Cadangan di memori per koleksi bila localStorage tidak tersedia
const koleksiMemory = {};

function readKoleksi(nama) {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEYS[nama]);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        return null;
    }
}

// Hasil false hanya bila penyimpanan browser PENUH (data tidak tersimpan; mis. file lampiran terlalu banyak).
// Bila localStorage tidak tersedia sama sekali, data tetap ada di memori selama halaman terbuka (hasil true).
function writeKoleksi(nama, list) {
    try {
        window.localStorage.setItem(STORAGE_KEYS[nama], JSON.stringify(list));
    } catch (error) {
        if (error && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED' || error.code === 22)) {
            return false;
        }
        // localStorage tidak tersedia — data tetap ada di memori selama halaman terbuka
    }
    koleksiMemory[nama] = copyData(list);
    return true;
}

const PESAN_PENYIMPANAN_PENUH = 'Penyimpanan browser penuh, data belum tersimpan. Gunakan file yang lebih kecil atau hapus lampiran/file yang tidak dipakai.';

function getKoleksi(nama) {
    const stored = readKoleksi(nama);
    if (Array.isArray(stored)) {
        return stored;
    }
    if (koleksiMemory[nama]) {
        return copyData(koleksiMemory[nama]);
    }
    return DATA_AWAL[nama]();
}

function nextIdKoleksi(list) {
    return list.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

// Koleksi yang bergantung pada kelas. aksi 'lepas' = kelasId dikosongkan, 'hapus' = ikut dihapus.
const RELASI_KELAS = [
    { koleksi: 'peserta', aksi: 'lepas' },
    { koleksi: 'pertemuan', aksi: 'hapus' },
    { koleksi: 'modul', aksi: 'hapus' },
    { koleksi: 'tugas', aksi: 'hapus' },
    { koleksi: 'kuis', aksi: 'hapus' },
    { koleksi: 'to', aksi: 'hapus' },
    { koleksi: 'nilai', aksi: 'hapus' },
    { koleksi: 'evaluasi', aksi: 'hapus' },
    { koleksi: 'hasil', aksi: 'hapus' },
    { koleksi: 'progresmodul', aksi: 'hapus' },
];

// Koleksi yang merujuk pertemuan (pertemuanId). Saat pertemuan dihapus, datanya dilepas dari pertemuan
// (pertemuanId = null) agar materi yang sudah dibuat tidak ikut hilang.
const RELASI_PERTEMUAN = ['modul', 'tugas', 'kuis'];

function lepasDariPertemuan(pertemuanId) {
    // Pretest/Aktivitas/Latihan & hasil pengerjaannya juga dilepas (data tidak hilang)
    [...RELASI_PERTEMUAN, 'evaluasi', 'hasil'].forEach(nama => {
        const list = getKoleksi(nama);
        if (list.some(item => item.pertemuanId === pertemuanId)) {
            writeKoleksi(nama, list.map(item => (item.pertemuanId === pertemuanId ? { ...item, pertemuanId: null } : item)));
        }
    });
}

// Jumlah data per koleksi yang merujuk satu pertemuan, mis. { modul: 1 }
function getDampakHapusPertemuan(pertemuanId) {
    const hasil = {};
    RELASI_PERTEMUAN.forEach(nama => {
        hasil[nama] = getKoleksi(nama).filter(item => item.pertemuanId === Number(pertemuanId)).length;
    });
    return hasil;
}

// Pastikan data turunan kelas sudah tersimpan (dipanggil sebelum ID kelas berubah)
function simpanDataTerkaitKelas() {
    RELASI_KELAS.forEach(relasi => {
        if (!Array.isArray(readKoleksi(relasi.koleksi)) && !koleksiMemory[relasi.koleksi]) {
            writeKoleksi(relasi.koleksi, getKoleksi(relasi.koleksi));
        }
    });
}

function bersihkanDataKelas(kelasId) {
    RELASI_KELAS.forEach(relasi => {
        const list = getKoleksi(relasi.koleksi);
        const hasil = relasi.aksi === 'lepas'
            ? list.map(item => (item.kelasId === kelasId ? { ...item, kelasId: null } : item))
            : list.filter(item => item.kelasId !== kelasId);
        writeKoleksi(relasi.koleksi, hasil);
    });
}

// Ringkasan dampak penghapusan kelas (untuk teks modal konfirmasi)
function getDampakHapusKelas(kelasId) {
    const id = Number(kelasId);
    return {
        peserta: getAllPeserta().filter(p => p.kelasId === id).length,
        pertemuan: getAllPertemuan().filter(p => p.kelasId === id).length,
        modul: getAllModul().filter(m => m.kelasId === id).length,
        tugas: getAllTugas().filter(t => t.kelasId === id).length,
        kuis: getAllKuis().filter(k => k.kelasId === id).length,
        to: getAllTO().filter(t => t.kelasId === id).length,
        nilai: getAllNilai().filter(n => n.kelasId === id).length,
        evaluasi: getAllEvaluasi().filter(e => e.kelasId === id).length,
        hasil: getAllHasil().filter(h => h.kelasId === id).length,
    };
}

// Kembalikan SEMUA data demo ke kondisi awal. Hanya dijalankan manual (mis. dari Console).
function resetSemuaData() {
    writeStorage(copyData(KELAS_AWAL));
    Object.keys(DATA_AWAL).forEach(nama => writeKoleksi(nama, DATA_AWAL[nama]()));
    tulisVersiSkema(SKEMA_VERSI);
    return true;
}

/* =========================
   2C. MIGRASI DATA (localStorage) — aman, satu kali, tanpa menghapus data
   Versi 1 = data hingga P4. Versi 2 (P5):
   - peserta demo "Budi Santoso" → "Seftia Della" (gender Perempuan); nama di session ikut diperbarui
   - Pretest dilengkapi menjadi TEPAT 5 soal dari bank pertemuannya (soal pengajar tidak dihapus)
   - Aktivitas lama (soal PG/BS) → Mini Challenge; soal menjodohkan lama → aktivitas Menjodohkan;
     aktivitas contoh bertipe ditambahkan untuk Pertemuan 1–3 (maks. 5 per pertemuan)
   - Latihan mendapat sumber (bank/manual) & target 10 soal; latihan dari bank dilengkapi menjadi 10 soal
   - TO PTS bawaan (40 soal dari bank) → 30 soal; PDF modul tersimpan dinormalkan ke application/pdf
   Hanya koleksi yang SUDAH tersimpan yang diubah (data awal sudah berbentuk versi baru).
   Hasil pengerjaan peserta tidak diubah: setiap hasil menyimpan salinan soalnya sendiri.
========================= */
const SKEMA_KEY = 'dellearn.schema.v1';
// Versi 3 (alur belajar berurutan, 8 Oktober 2026):
// - Kuis dipindah ke dellearn.kuis.v2: soal setiap kuis menjadi MILIK kuis (kuis lama tanpa soal mendapat salinan soal
//   contohnya sekali), jumlahSoal = banyak soal, + deskripsi. dellearn.kuis.v1 dibiarkan (tidak dihapus).
// - Tahun data demo → 2026: tanggal pertemuan, tenggat tugas, jadwal TO & waktu hasil awal yang tahunnya < 2026 digeser
//   +733 hari (Pertemuan 1 lama → 5 Sep 2026, nama hari tetap sama); NIS demo angkatan lama → 2026xxxx.
// - Hasil aktivitas mendapat skorTerakhir & durasiTerakhir (diisi dari data yang ada).
// Versi 4 (Tugas mendukung jawaban ketik & upload file, 8 Oktober 2026):
// - Tugas dipindah ke dellearn.tugas.v2: + soal (teks), fileSoal (dokumentasi soal; lampiran lama pengajar dipindah ke sini),
//   metode pengumpulan (ketik/upload/keduanya). dellearn.tugas.v1 dibiarkan (tidak dihapus).
// - Soal dokumentasi lama (dellearn.banksoal.v1, sempat menjadi bagian Latihan) + foto jawaban peserta → Tugas &
//   jawaban tugas (metode upload), agar dokumentasi tidak lagi menjadi bagian Latihan dan tidak ada data pengguna hilang.
// - Jawaban tugas lama mendapat metode ('ketik' bila ada teks).
// Versi 5 (Latihan dibuat langsung oleh Pengajar, 8 Oktober 2026):
// - Latihan tidak lagi memiliki pilihan asal soal (kumpulan soal bawaan / tulis sendiri): isian itu dihapus dan soal latihan
//   (termasuk yang dulu dipilih dari kumpulan soal) menjadi soal milik latihan sehingga dapat diedit & dihapus.
//   Soal, target, status & hasil peserta tidak berubah.
// Versi 6 (akses Pertemuan otomatis berdasarkan jadwal, 8 Oktober 2026):
// - Pertemuan mendapat modeAkses 'otomatis' (status efektif dihitung dari tanggal yang SUDAH tersimpan). Tanggal, nama,
//   urutan & isian status lama tidak diubah (status lama dipakai lagi bila Admin/Pengajar memilih override manual).
// Versi 7 (konten Pertemuan 4 lengkap, 9 Oktober 2026):
// - Pertemuan 4 kelima kelas awal dilengkapi Modul, Aktivitas Interaktif, Latihan Soal, Tugas, & Kuis (lengkapiPertemuan4) —
//   hanya komponen yang belum ada; modul Draft berisi kerangka bawaan dilengkapi (bukan duplikat). Hasil, nilai, progres,
//   pengumpulan, tanggal, status, & data pertemuan lain tidak diubah.
// Versi 8 (konten Pertemuan 5 lengkap, 9 Oktober 2026):
// - Pertemuan 5 kelima kelas awal dilengkapi Pretest, Modul, Aktivitas Interaktif, Latihan Soal, Tugas, & Kuis
//   (lengkapiKontenPertemuan(…, 5)) — hanya komponen yang belum ada; data lain tidak diubah.
const SKEMA_VERSI = 8;

function bacaVersiSkema() {
    try {
        return Number(window.localStorage.getItem(SKEMA_KEY)) || 1;
    } catch (error) {
        return SKEMA_VERSI;   // localStorage tidak tersedia → tidak ada data lama yang perlu dimigrasi
    }
}

function tulisVersiSkema(versi) {
    try {
        window.localStorage.setItem(SKEMA_KEY, String(versi));
    } catch (error) {
        // localStorage tidak tersedia
    }
}

// Jalankan migrasi bila perlu. Hasil: daftar catatan perubahan (kosong bila tidak ada yang dimigrasi)
function migrasiData() {
    const versi = bacaVersiSkema();
    if (versi >= SKEMA_VERSI) {
        return [];
    }
    const catatan = [];
    if (versi < 2) {
        migrasiPesertaDemo(catatan);
        migrasiEvaluasiV2(catatan);
        migrasiTOV2(catatan);
        migrasiModulV2(catatan);
    }
    if (versi < 3) {
        migrasiKuisV3(catatan);
        migrasiTahunV3(catatan);
        migrasiNisV3(catatan);
        migrasiHasilAktivitasV3(catatan);
    }
    if (versi < 4) {
        migrasiTugasV4(catatan);
        migrasiDokumentasiV4(catatan);
        migrasiHasilTugasV4(catatan);
    }
    if (versi < 5) {
        migrasiLatihanV5(catatan);
    }
    if (versi < 6) {
        migrasiPertemuanV6(catatan);
    }
    if (versi < 7) {
        migrasiPertemuan4V7(catatan);
    }
    if (versi < 8) {
        migrasiKontenPertemuan(catatan, 5);
    }
    tulisVersiSkema(SKEMA_VERSI);
    return catatan;
}

// Pertemuan 4 lengkap (v7). Koleksi yang belum tersimpan memakai data awal (sudah lengkap) dan tidak ditulis.
function migrasiPertemuan4V7(catatan) {
    migrasiKontenPertemuan(catatan, 4);
}

// Pertemuan `nomor` lengkap (v7: 4, v8: 5). Koleksi yang belum tersimpan memakai data awal (sudah lengkap) dan tidak ditulis.
function migrasiKontenPertemuan(catatan, nomor) {
    const nama = ['pertemuan', 'modul', 'evaluasi', 'tugas', 'kuis'];
    const data = { kelas: getKelasTersimpan() };
    nama.forEach(n => {
        data[n] = getKoleksi(n);
    });
    const hasil = lengkapiKontenPertemuan(data, nomor);
    nama.filter(n => data.ubah.has(n) && Array.isArray(readKoleksi(n))).forEach(n => writeKoleksi(n, data[n]));
    catatan.push(...hasil);
}

// Kuis v1 → v2 (soal milik kuis). Hanya bila v2 belum ada dan v1 tersimpan; v1 tidak diubah/dihapus.
function migrasiKuisV3(catatan) {
    let lama = null;
    try {
        if (window.localStorage.getItem(STORAGE_KEYS.kuis) !== null) {
            return;
        }
        lama = JSON.parse(window.localStorage.getItem(KUIS_V1_KEY) || 'null');
    } catch (error) {
        return;
    }
    if (!Array.isArray(lama)) {
        return;
    }
    const kelasList = getKelasTersimpan();
    const pertemuanList = getKoleksi('pertemuan');
    let disalin = 0;
    const baru = lama.map(k => {
        let soal = Array.isArray(k.soal) ? k.soal.map(({ ref, ...s }) => s) : null;
        if (!soal) {
            const kelas = kelasList.find(x => x.id === k.kelasId);
            const p = pertemuanList.find(x => x.id === k.pertemuanId);
            soal = kelas && p ? soalKuisDariBank(kelas.mapel, p.nomor, Number(k.jumlahSoal) || 10) : [];
            disalin++;
        }
        const item = { ...k, deskripsi: k.deskripsi || '', soal, jumlahSoal: soal.length || Number(k.jumlahSoal) || 10 };
        if (!soal.length && item.status === 'Aktif') {
            item.status = 'Draft';
        }
        return item;
    });
    writeKoleksi('kuis', baru);
    catatan.push(`${baru.length} kuis dipindah ke dellearn.kuis.v2 (${disalin} kuis mendapat salinan soal contohnya)`);
}

// "YYYY-MM-DD..." dengan tahun < 2026 → digeser +733 hari; sisanya (jam) tetap
const GESER_HARI_2026 = 733;
function geserTahun2026(teks) {
    const s = String(teks || '');
    const m = /^(\d{4})-(\d{2})-(\d{2})(.*)$/.exec(s);
    if (!m || Number(m[1]) >= 2026) {
        return teks;
    }
    return tambahHari(`${m[1]}-${m[2]}-${m[3]}`, GESER_HARI_2026) + m[4];
}

// Tugas v1 → v2. Hanya bila v2 belum ada dan v1 tersimpan; v1 tidak diubah/dihapus.
function migrasiTugasV4(catatan) {
    let lama = null;
    try {
        if (window.localStorage.getItem(STORAGE_KEYS.tugas) !== null) {
            return;
        }
        lama = JSON.parse(window.localStorage.getItem(TUGAS_V1_KEY) || 'null');
    } catch (error) {
        return;
    }
    if (!Array.isArray(lama)) {
        return;
    }
    const baru = lama.map(({ lampiran, ...t }) => {
        // Tugas data awal (id & judul sama) mendapat soal, dokumentasi & metode bawaan; tugas buatan pengajar:
        // deskripsi lama dipakai sebagai soal, lampiran lama menjadi dokumentasi soal
        const awal = TUGAS_AWAL.find(s => s.id === t.id && s.judul === t.judul && s.kelasId === t.kelasId);
        return {
            ...t,
            deadline: geserTahun2026(t.deadline),
            soal: t.soal || (awal ? awal.soal : t.deskripsi || ''),
            fileSoal: lampiran && lampiran.nama ? normalisasiLampiran(lampiran) : awal && awal.fileSoal ? copyData(awal.fileSoal) : null,
            metode: METODE_TUGAS[t.metode] ? t.metode : awal ? awal.metode : 'keduanya',
        };
    });
    writeKoleksi('tugas', baru);
    catatan.push(`${baru.length} tugas dipindah ke dellearn.tugas.v2 (soal, dokumentasi soal, metode pengumpulan)`);
}

// Dokumentasi soal lama (Bank Soal) & foto jawaban → Tugas. Dokumen data awal tanpa jawaban peserta tidak dipindah.
function migrasiDokumentasiV4(catatan) {
    const bank = readKoleksi('banksoal');
    const hasil = readKoleksi('hasil');
    const dokHasil = Array.isArray(hasil) ? hasil.filter(h => h.jenis === 'dokumentasi') : [];
    if (!Array.isArray(bank) && !dokHasil.length) {
        return;
    }
    const bankList = Array.isArray(bank) ? bank : BANK_SOAL_AWAL;
    const bawaan = b => BANK_SOAL_AWAL.some(s => s.id === b.id && s.nama === b.nama && b.file && s.file.data === b.file.data);
    const tugasList = getKoleksi('tugas');
    const kelasList = getKelasTersimpan();
    const pertemuanList = getKoleksi('pertemuan');
    const dibuat = {};
    bankList.forEach(b => {
        if (!b || !b.file) {
            return;
        }
        kelasList.filter(k => k.mapel === b.mapel).forEach(k => {
            const p = pertemuanList.find(x => x.kelasId === k.id && x.nomor === b.nomorPertemuan);
            const adaJawaban = dokHasil.some(h => h.itemId === b.id && h.kelasId === k.id);
            if (!p || (bawaan(b) && !adaJawaban)) {
                return;
            }
            let judul = `Tugas Dokumentasi: ${b.nama}`;
            for (let n = 2; tugasList.some(t => t.kelasId === k.id && t.judul.toLowerCase() === judul.toLowerCase()); n++) {
                judul = `Tugas Dokumentasi: ${b.nama} (${n})`;
            }
            const t = {
                id: nextIdKoleksi(tugasList), kelasId: k.id, pertemuanId: p.id, judul,
                deskripsi: 'Kerjakan soal pada dokumentasi berikut, lalu kumpulkan jawaban: ketik langsung atau unggah file (foto/scan tulisan tangan atau PDF).',
                soal: '', fileSoal: { nama: b.file.nama, ukuran: b.file.ukuran || 0, tipe: b.file.mime || b.file.tipe || '', data: b.file.data },
                metode: 'keduanya', deadline: `${tambahHari(p.tanggal, 6)}T23:59`, status: adaJawaban ? 'Aktif' : 'Draft',
            };
            tugasList.push(t);
            dibuat[`${b.id}-${k.id}`] = t.id;
        });
    });
    let pindah = 0;
    dokHasil.forEach(h => {
        const tugasId = dibuat[`${h.itemId}-${h.kelasId}`];
        if (!tugasId) {
            return;
        }
        const foto = h.foto || {};
        Object.assign(h, {
            jenis: 'tugas', itemId: tugasId, metode: 'upload', teks: '', terlambat: false,
            lampiran: foto.data ? { nama: foto.nama || 'jawaban.jpg', ukuran: foto.ukuran || 0, tipe: foto.mime || 'image/jpeg', data: foto.data } : null,
            dinilaiOleh: h.dinilaiOleh || null,
        });
        delete h.foto;
        pindah++;
    });
    if (Object.keys(dibuat).length) {
        writeKoleksi('tugas', tugasList);
    }
    if (pindah) {
        writeKoleksi('hasil', hasil);
    }
    if (Object.keys(dibuat).length || pindah) {
        catatan.push(`Dokumentasi soal lama → ${Object.keys(dibuat).length} tugas, ${pindah} foto jawaban → jawaban tugas (upload)`);
    }
}

function migrasiPertemuanV6(catatan) {
    const list = readKoleksi('pertemuan');
    if (!Array.isArray(list)) {
        return;
    }
    let ubah = 0;
    list.forEach(p => {
        if (!p.modeAkses) {
            p.modeAkses = 'otomatis';
            ubah++;
        }
    });
    if (ubah) {
        writeKoleksi('pertemuan', list);
        catatan.push(`${ubah} pertemuan: akses peserta otomatis mengikuti jadwal (tanggal tidak diubah)`);
    }
}

function migrasiLatihanV5(catatan) {
    const list = readKoleksi('evaluasi');
    if (!Array.isArray(list)) {
        return;
    }
    let ubah = 0;
    list.filter(e => e.jenis === 'latihan').forEach(e => {
        const adaRef = Array.isArray(e.soal) && e.soal.some(s => s && s.ref);
        if ('sumber' in e || adaRef) {
            delete e.sumber;
            e.soal = (e.soal || []).map(({ ref, ...s }) => s);
            ubah++;
        }
    });
    if (ubah) {
        writeKoleksi('evaluasi', list);
        catatan.push(`${ubah} latihan: tanpa sumber soal; semua soal kini milik latihan (dapat diedit)`);
    }
}

function migrasiHasilTugasV4(catatan) {
    const list = readKoleksi('hasil');
    if (!Array.isArray(list)) {
        return;
    }
    let ubah = 0;
    list.filter(h => h.jenis === 'tugas' && !h.metode).forEach(h => {
        h.metode = String(h.teks || '').trim() ? 'ketik' : 'upload';
        ubah++;
    });
    if (ubah) {
        writeKoleksi('hasil', list);
        catatan.push(`${ubah} jawaban tugas lama: metode pengumpulan ditambahkan`);
    }
}

function migrasiTahunV3(catatan) {
    const kolom = { pertemuan: ['tanggal'], tugas: ['deadline'], to: ['tanggal'], hasil: ['mulai', 'selesai', 'dikumpulkan', 'dinilaiPada'], progresmodul: ['dibuka', 'selesai'] };
    Object.entries(kolom).forEach(([nama, fields]) => {
        const list = readKoleksi(nama);
        if (!Array.isArray(list)) {
            return;
        }
        let ubah = 0;
        list.forEach(item => {
            fields.forEach(f => {
                if (item[f]) {
                    const baru = geserTahun2026(item[f]);
                    if (baru !== item[f]) {
                        item[f] = baru;
                        ubah++;
                    }
                }
            });
            // Waktu mulai (ms) hasil awal mengikuti tanggal mulai yang baru
            if (nama === 'hasil' && item.mulaiMs && item.mulai && new Date(item.mulaiMs).getFullYear() < 2026) {
                item.mulaiMs = new Date(item.mulai).getTime() || item.mulaiMs;
            }
        });
        if (ubah) {
            writeKoleksi(nama, list);
            catatan.push(`${nama}: ${ubah} tanggal lama → 2026`);
        }
    });
}

function migrasiNisV3(catatan) {
    const list = readKoleksi('peserta');
    if (!Array.isArray(list)) {
        return;
    }
    const ada = new Set(list.map(p => String(p.nis)));
    let ubah = 0;
    list.forEach(p => {
        const nis = String(p.nis || '');
        const baru = /^202[45]\d{4}$/.test(nis) ? `2026${nis.slice(4)}` : nis;
        if (baru !== nis && !ada.has(baru)) {
            ada.delete(nis);
            ada.add(baru);
            p.nis = baru;
            ubah++;
        }
    });
    if (ubah) {
        writeKoleksi('peserta', list);
        catatan.push(`${ubah} NIS peserta: angkatan lama → 2026`);
    }
}

function migrasiHasilAktivitasV3(catatan) {
    const list = readKoleksi('hasil');
    if (!Array.isArray(list)) {
        return;
    }
    let ubah = 0;
    list.filter(h => h.jenis === 'aktivitas' && h.skorTerakhir === undefined).forEach(h => {
        h.skorTerakhir = h.skor ?? null;
        h.skorTerbaik = h.skorTerbaik ?? h.skor ?? null;
        h.durasiTerakhir = h.durasiTerakhir ?? null;
        ubah++;
    });
    if (ubah) {
        writeKoleksi('hasil', list);
        catatan.push(`${ubah} hasil aktivitas: skor terakhir & waktu pengerjaan ditambahkan`);
    }
}

function migrasiPesertaDemo(catatan) {
    const list = readKoleksi('peserta');
    if (Array.isArray(list)) {
        const p = list.find(x => x.id === 1 && x.nama === 'Budi Santoso');
        if (p) {
            p.nama = 'Seftia Della';
            p.gender = 'Perempuan';
            if (p.email === 'budi.santoso@email.com') {
                p.email = 'seftia.della@email.com';
            }
            writeKoleksi('peserta', list);
            catatan.push('Peserta ID 1: Budi Santoso → Seftia Della (Perempuan)');
        }
    }
    const session = bacaSession();
    if (session && session.userId === 'peserta' && session.nama === 'Budi Santoso') {
        try {
            window.localStorage.setItem(AUTH_KEY, JSON.stringify({ ...session, nama: 'Seftia Della' }));
        } catch (error) {
            // session tidak dapat diperbarui; nama tetap diambil dari Data Peserta saat login berikutnya
        }
    }
}

function migrasiEvaluasiV2(catatan) {
    const list = readKoleksi('evaluasi');
    if (!Array.isArray(list)) {
        return;
    }
    const kelasList = getKelasTersimpan();
    const pertemuanList = getKoleksi('pertemuan');
    const konteks = e => {
        const kelas = kelasList.find(k => k.id === e.kelasId);
        const p = pertemuanList.find(x => x.id === e.pertemuanId);
        return { kelas, p, bank: kelas && p ? soalBankPertemuan(kelas.mapel, p.nomor) : null };
    };
    const kunciTeks = s => String(s.teks || '').trim().toLowerCase();
    const tambahan = [];

    list.forEach(e => {
        const { p, bank } = konteks(e);
        // Pretest → tepat 5 soal
        if (e.jenis === 'pretest' && e.soal.length !== PRETEST_JUMLAH_SOAL) {
            if (e.soal.length < PRETEST_JUMLAH_SOAL && bank) {
                const ada = new Set(e.soal.map(kunciTeks));
                [...bank.pg, ...bank.bs].filter(s => !ada.has(kunciTeks(s))).slice(0, PRETEST_JUMLAH_SOAL - e.soal.length)
                    .forEach(s => e.soal.push(s));
            }
            if (e.soal.length !== PRETEST_JUMLAH_SOAL && e.status === 'Aktif') {
                e.status = 'Draft';
                catatan.push(`Pretest #${e.id} dijadikan Draft: ${e.soal.length} soal (harus tepat 5)`);
            }
        }
        // Latihan → sumber & target; latihan dari bank dilengkapi 10 soal
        if (e.jenis === 'latihan' && !e.sumber) {
            const refBank = bank ? [...bank.pg, ...bank.bs] : [];
            const dariBank = e.soal.length > 0 && e.soal.every(s => refBank.some(b => kunciTeks(b) === kunciTeks(s)));
            e.sumber = dariBank ? 'bank' : 'manual';
            e.soal = e.soal.map(s => (dariBank ? { ...s, ref: refBank.find(b => kunciTeks(b) === kunciTeks(s)).ref } : s));
            e.target = LATIHAN_TARGET_AWAL;
            if (dariBank) {
                const ada = new Set(e.soal.map(kunciTeks));
                SUSUNAN_EVALUASI.latihan.urutan.map(([tipe, i]) => bank[tipe][i])
                    .filter(s => !ada.has(kunciTeks(s))).slice(0, LATIHAN_TARGET_AWAL - e.soal.length).forEach(s => e.soal.push(s));
            } else if (e.soal.length < LATIHAN_TARGET_AWAL) {
                // Soal susunan pengajar dipertahankan; target disesuaikan (minimal 5)
                e.target = Math.max(5, e.soal.length);
                if (e.soal.length < 5 && e.status === 'Aktif') {
                    e.status = 'Draft';
                }
            }
            catatan.push(`Latihan #${e.id}: sumber ${e.sumber}, ${e.soal.length}/${e.target} soal`);
        }
        // Aktivitas lama (tanpa tipe) → Mini Challenge (+ soal menjodohkan menjadi aktivitas Menjodohkan)
        if (e.jenis === 'aktivitas' && !e.tipe) {
            const jodoh = e.soal.filter(s => s.tipe === 'jodoh');
            e.tipe = 'challenge';
            e.soal = e.soal.filter(s => s.tipe !== 'jodoh');
            e.konten = { durasiDetik: SUSUNAN_EVALUASI.challenge.durasiDetik };
            e.durasi = 0;
            if (p && e.judul === `Aktivitas Benar atau Salah: ${p.judul}`) {
                e.judul = `Tantangan Kilat: ${p.judul}`;
            }
            if (validateKontenAktivitas('challenge', e.konten, e.soal) && e.status === 'Aktif') {
                e.status = 'Draft';
            }
            jodoh.forEach((s, i) => {
                const konten = { pasangan: pasanganSoal(s) };
                tambahan.push({
                    kelasId: e.kelasId, pertemuanId: e.pertemuanId, jenis: 'aktivitas', judul: `${e.judul} — Menjodohkan ${i + 1}`,
                    instruksi: s.teks || TIPE_AKTIVITAS.matching.instruksi, durasi: 0,
                    status: validateKontenAktivitas('matching', konten) ? 'Draft' : e.status, tipe: 'matching', konten, soal: [],
                });
            });
            catatan.push(`Aktivitas #${e.id} → Mini Challenge${jodoh.length ? ` + ${jodoh.length} Menjodohkan` : ''}`);
        }
    });

    // Aktivitas contoh bertipe untuk Pertemuan 1–3 kelas awal (bila belum ada & masih di bawah batas)
    pertemuanList.forEach(p => {
        const kelas = kelasList.find(k => k.id === p.kelasId);
        const awal = KELAS_AWAL.find(k => k.id === p.kelasId);
        const contoh = kelas && awal && awal.mapel === kelas.mapel ? (AKTIVITAS_CONTOH[kelas.mapel] || {})[p.nomor] : null;
        if (!contoh || !p.komponen.includes('aktivitas')) {
            return;
        }
        contoh.forEach(a => {
            const sudah = [...list, ...tambahan].filter(e => e.jenis === 'aktivitas' && e.pertemuanId === p.id);
            if (sudah.some(e => e.judul === a.judul) || sudah.length >= AKTIVITAS_MAKS_PER_PERTEMUAN) {
                return;
            }
            tambahan.push({
                kelasId: p.kelasId, pertemuanId: p.id, jenis: 'aktivitas', judul: a.judul, instruksi: a.instruksi || TIPE_AKTIVITAS[a.tipe].instruksi,
                durasi: 0, status: 'Aktif', tipe: a.tipe, konten: copyData(a.konten), soal: [],
            });
        });
    });
    tambahan.forEach(a => list.push({ id: nextIdKoleksi(list), ...a }));
    if (tambahan.length) {
        catatan.push(`${tambahan.length} aktivitas interaktif bertipe ditambahkan`);
    }
    // Urutan aktivitas per pertemuan
    const perPertemuan = {};
    list.filter(e => e.jenis === 'aktivitas').forEach(e => {
        perPertemuan[e.pertemuanId] = (perPertemuan[e.pertemuanId] || 0) + 1;
        if (!e.urutan) {
            e.urutan = perPertemuan[e.pertemuanId];
        }
    });
    writeKoleksi('evaluasi', list);
}

function migrasiTOV2(catatan) {
    const list = readKoleksi('to');
    if (!Array.isArray(list)) {
        return;
    }
    let ubah = 0;
    list.forEach(t => {
        // TO PTS bawaan (soal otomatis dari bank, 40 soal) → 30 soal sesuai aturan baru
        if (t.jenis === 'PTS' && !Array.isArray(t.soal) && Number(t.jumlahSoal) === 40) {
            t.jumlahSoal = JENIS_TO.PTS.jumlahSoal;
            ubah++;
        }
    });
    if (ubah) {
        writeKoleksi('to', list);
        catatan.push(`${ubah} TO PTS: 40 → 30 soal`);
    }
}

function migrasiModulV2(catatan) {
    const list = readKoleksi('modul');
    if (!Array.isArray(list)) {
        return;
    }
    let ubah = 0;
    list.forEach(m => {
        if (m.file && m.file.data) {
            const data = normalisasiDataUrlPdf(m.file.data);
            if (data !== m.file.data) {
                m.file.data = data;
                ubah++;
            }
        }
    });
    if (ubah) {
        writeKoleksi('modul', list);
        catatan.push(`${ubah} PDF modul: tipe data dinormalkan ke application/pdf`);
    }
}

/* =========================
   2B. EVALUASI, HASIL PENGERJAAN & PROGRES MODUL
   - evaluasi     : Pretest / Aktivitas Interaktif / Latihan Soal per pertemuan (berisi soal)
   - hasil        : satu catatan per pesertaId + jenis + itemId (pretest, aktivitas, latihan, kuis, to, tugas)
                    berisi pertemuanId, kelasId, jawaban, skor, status, waktu mulai/selesai
   - progresmodul : status belajar modul per peserta (Sedang dipelajari / Selesai)
========================= */

// ---- Waktu (format lokal "YYYY-MM-DDTHH:MM:SS", sama gaya dengan deadline tugas) ----
function waktuSekarang() {
    const d = new Date();
    const dua = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${dua(d.getMonth() + 1)}-${dua(d.getDate())}T${dua(d.getHours())}:${dua(d.getMinutes())}:${dua(d.getSeconds())}`;
}

// "2026-09-11T23:59" → "11 September 2026, 23:59" (tanggal saja bila tanpa jam)
function formatTanggalWaktu(teks) {
    const [tanggal, jam] = String(teks || '').split('T');
    if (!tanggalValid(tanggal)) {
        return '–';
    }
    return jam ? `${formatTanggal(tanggal)}, ${jam.slice(0, 5)}` : formatTanggal(tanggal);
}

// ---- Soal (dipakai Evaluasi, Kuis & TO) ----
// Soal pilihan: { tipe: 'pg'|'bs', teks, opsi: [2–4 teks], kunci: indeks opsi benar, pembahasan }
// Soal menjodohkan (khusus Aktivitas Interaktif):
//   { tipe: 'jodoh', teks, kiri: [pernyataan], opsi: [pasangan, urut abjad], kunci: [indeks opsi untuk tiap kiri], pembahasan }
//   Jawaban peserta = array indeks opsi (satu per pernyataan kiri). Boleh juga dikirim sebagai pasangan: [{ kiri, kanan }].
const TIPE_SOAL = { pg: 'Pilihan Ganda', bs: 'Benar/Salah', jodoh: 'Menjodohkan' };
const JODOH_MIN = 2;
const JODOH_MAKS = 6;

function normalisasiSoal(s) {
    const tipe = TIPE_SOAL[s.tipe] ? s.tipe : 'pg';
    const teks = String(s.teks || '').trim();
    const pembahasan = String(s.pembahasan || '').trim();
    if (tipe === 'jodoh') {
        const pasangan = Array.isArray(s.pasangan)
            ? s.pasangan
            : (Array.isArray(s.kiri) ? s.kiri : []).map((kiri, i) => ({ kiri, kanan: (s.opsi || [])[(s.kunci || [])[i]] }));
        const rapi = pasangan.map(p => ({ kiri: String(p.kiri ?? '').trim(), kanan: String(p.kanan ?? '').trim() }));
        // Pasangan ditampilkan urut abjad (tetap, bukan acak) agar urutannya tidak sama dengan pernyataan kiri
        const opsi = [...new Set(rapi.map(p => p.kanan))].sort((a, b) => a.localeCompare(b, 'id'));
        return { tipe, teks, kiri: rapi.map(p => p.kiri), opsi, kunci: rapi.map(p => opsi.indexOf(p.kanan)), pembahasan };
    }
    const opsi = tipe === 'bs' ? ['Benar', 'Salah'] : (Array.isArray(s.opsi) ? s.opsi : []).map(o => String(o ?? '').trim());
    // ref = asal soal di Bank Soal (salinan); soal susunan sendiri tidak memiliki ref
    return { tipe, teks, opsi, kunci: Number(s.kunci), pembahasan, ...(s.ref ? { ref: String(s.ref) } : {}) };
}

function normalisasiSoalList(list) {
    return (Array.isArray(list) ? list : []).map(normalisasiSoal);
}

// Pasangan kiri ↔ kanan dari soal menjodohkan (untuk editor & pembahasan)
function pasanganSoal(s) {
    return (s.kiri || []).map((kiri, i) => ({ kiri, kanan: s.opsi[s.kunci[i]] }));
}

// Validasi satu soal. opsiWajib = jumlah pilihan PG yang wajib (editor Pengajar: 4 = A–D).
// Hasil: { field: pesan } — kosong bila valid. Field: teks, opsi, kunci, pembahasan, pasangan, tipe.
function validateSoal(soal, { opsiWajib = null, bolehJodoh = true } = {}) {
    const errors = {};
    const tipe = soal && TIPE_SOAL[soal.tipe] ? soal.tipe : null;
    if (!tipe) {
        errors.tipe = 'Pilih tipe soal.';
        return errors;
    }
    if (tipe === 'jodoh' && !bolehJodoh) {
        errors.tipe = 'Soal menjodohkan hanya tersedia untuk Aktivitas Interaktif.';
        return errors;
    }
    const s = normalisasiSoal(soal);
    if (s.teks.length < 5) {
        errors.teks = s.teks ? 'Pertanyaan minimal 5 karakter.' : 'Pertanyaan wajib diisi.';
    } else if (s.teks.length > 1000) {
        errors.teks = 'Pertanyaan maksimal 1000 karakter.';
    }
    if (s.pembahasan.length > 1000) {
        errors.pembahasan = 'Pembahasan maksimal 1000 karakter.';
    }
    if (tipe === 'jodoh') {
        const pasangan = pasanganSoal(s);
        if (pasangan.length < JODOH_MIN || pasangan.length > JODOH_MAKS) {
            errors.pasangan = `Isi ${JODOH_MIN}–${JODOH_MAKS} pasangan.`;
        } else if (pasangan.some(p => !p.kiri || !p.kanan)) {
            errors.pasangan = 'Setiap pasangan wajib diisi di kedua sisi.';
        } else if (new Set(pasangan.map(p => p.kiri.toLowerCase())).size !== pasangan.length) {
            errors.pasangan = 'Pernyataan di sisi kiri tidak boleh kembar.';
        } else if (new Set(pasangan.map(p => p.kanan.toLowerCase())).size !== pasangan.length) {
            errors.pasangan = 'Pasangan di sisi kanan tidak boleh kembar.';
        } else if (pasangan.some(p => p.kiri.length > 200 || p.kanan.length > 200)) {
            errors.pasangan = 'Setiap isian pasangan maksimal 200 karakter.';
        }
        return errors;
    }
    if (tipe === 'pg') {
        const jumlah = s.opsi.length;
        if (opsiWajib !== null && jumlah !== opsiWajib) {
            errors.opsi = `Isi ${opsiWajib} pilihan jawaban.`;
        } else if (jumlah < 2 || jumlah > 4) {
            errors.opsi = 'Pilihan jawaban harus 2–4.';
        } else if (s.opsi.some(o => !o)) {
            errors.opsi = 'Semua pilihan jawaban wajib diisi.';
        } else if (new Set(s.opsi.map(o => o.toLowerCase())).size !== jumlah) {
            errors.opsi = 'Pilihan jawaban tidak boleh kembar.';
        } else if (s.opsi.some(o => o.length > 300)) {
            errors.opsi = 'Setiap pilihan jawaban maksimal 300 karakter.';
        }
    }
    // Kunci kosong (null/'' belum dipilih) tidak boleh dianggap 0 = jawaban A
    const kunciKosong = soal.kunci === null || soal.kunci === undefined || String(soal.kunci).trim() === '';
    if (kunciKosong || !Number.isInteger(s.kunci) || s.kunci < 0 || s.kunci >= s.opsi.length) {
        errors.kunci = 'Pilih jawaban yang benar.';
    }
    return errors;
}

// Validasi daftar soal. Hasil: '' bila valid, atau pesan error pertama (dengan nomor soal)
function validateSoalList(list, { bolehJodoh = true } = {}) {
    if (!Array.isArray(list) || !list.length) {
        return 'Tambahkan minimal 1 soal.';
    }
    if (list.length > 100) {
        return 'Maksimal 100 soal.';
    }
    for (let i = 0; i < list.length; i++) {
        const errors = validateSoal(list[i], { bolehJodoh });
        const pertama = ['tipe', 'teks', 'opsi', 'pasangan', 'kunci', 'pembahasan'].find(f => errors[f]);
        if (pertama) {
            return `Soal ${i + 1}: ${errors[pertama].charAt(0).toLowerCase()}${errors[pertama].slice(1)}`;
        }
    }
    return '';
}

// Jawaban satu soal sudah lengkap? (menjodohkan: semua pernyataan sudah dipasangkan)
function jawabanLengkap(j) {
    if (Array.isArray(j)) {
        return j.length > 0 && j.every(x => x !== null && x !== undefined);
    }
    return j !== null && j !== undefined;
}

function jawabanBenar(s, j) {
    if (s.tipe === 'jodoh') {
        return Array.isArray(j) && Array.isArray(s.kunci) && j.length === s.kunci.length && j.every((x, i) => Number(x) === s.kunci[i]);
    }
    return j !== null && j !== undefined && !Array.isArray(j) && Number(j) === s.kunci;
}

// Nilai jawaban: { benar, salah, kosong, total, skor (0–100, bulat) }.
// Menjodohkan dinilai benar bila semua pasangan tepat; belum diisi sama sekali = kosong.
function nilaiJawaban(soal, jawaban) {
    const total = soal.length;
    let benar = 0;
    let kosong = 0;
    soal.forEach((s, i) => {
        const j = jawaban[i];
        const tidakDiisi = j === null || j === undefined || (Array.isArray(j) && j.every(x => x === null || x === undefined));
        if (tidakDiisi) {
            kosong++;
        } else if (jawabanBenar(s, j)) {
            benar++;
        }
    });
    return { benar, salah: total - benar - kosong, kosong, total, skor: total ? Math.round((benar / total) * 100) : 0 };
}

// ---- Evaluasi (Pretest / Aktivitas / Latihan) ----
const EVALUASI_FIELDS = ['judul', 'kelasId', 'pertemuanId', 'jenis', 'durasi', 'status', 'instruksi', 'soal'];

function getAllEvaluasi() {
    return getKoleksi('evaluasi');
}

function getEvaluasiById(id) {
    return dalamKelasTerlihat(getAllEvaluasi().find(e => e.id === Number(id)));
}

function normalisasiEvaluasi(data) {
    const jenis = String(data.jenis || '').trim();
    const hasil = {
        kelasId: Number(data.kelasId),
        pertemuanId: data.pertemuanId === null || data.pertemuanId === '' || data.pertemuanId === undefined ? null : Number(data.pertemuanId),
        jenis,
        judul: String(data.judul || '').trim().replace(/\s+/g, ' '),
        instruksi: String(data.instruksi || '').trim(),
        durasi: jenis === 'aktivitas' ? 0 : Number(data.durasi) || 0,
        status: String(data.status || 'Draft').trim(),
        soal: normalisasiSoalList(data.soal),
    };
    if (jenis === 'aktivitas') {
        const tipe = TIPE_AKTIVITAS[data.tipe] ? data.tipe : 'challenge';
        hasil.tipe = tipe;
        hasil.konten = normalisasiKontenAktivitas(tipe, data.konten);
        hasil.urutan = Number(data.urutan) || 0;
        if (tipe !== 'challenge') {
            hasil.soal = [];
        }
    }
    if (jenis === 'latihan') {
        hasil.target = Number(data.target) || LATIHAN_TARGET_AWAL;
    }
    return hasil;
}

// ---- Konten Aktivitas Interaktif ----
const teksRapi = v => String(v ?? '').trim().replace(/\s+/g, ' ');
const daftarTeks = v => (Array.isArray(v) ? v : []).map(teksRapi);

function normalisasiKontenAktivitas(tipe, k = {}) {
    k = k || {};
    switch (tipe) {
        case 'matching':
            return { pasangan: (k.pasangan || []).map(p => ({ kiri: teksRapi(p.kiri), kanan: teksRapi(p.kanan) })) };
        case 'drag_drop':
            return { kategori: daftarTeks(k.kategori), item: (k.item || []).map(it => ({ teks: teksRapi(it.teks), kategori: Number(it.kategori) })) };
        case 'ordering':
            return { urutan: daftarTeks(k.urutan) };
        case 'true_false':
            return { pernyataan: (k.pernyataan || []).map(p => ({ teks: teksRapi(p.teks), benar: p.benar === true || p.benar === 'true', penjelasan: teksRapi(p.penjelasan) })) };
        case 'image_selection':
            return { pertanyaan: teksRapi(k.pertanyaan), pilihan: (k.pilihan || []).map(p => ({ gambar: String(p.gambar || '').trim(), label: teksRapi(p.label), benar: p.benar === true || p.benar === 'true' })) };
        case 'sentence_builder':
            return { kalimat: (k.kalimat || []).map(s => ({ teks: teksRapi(s.teks), pengecoh: daftarTeks(s.pengecoh).filter(Boolean) })) };
        case 'find_error':
            return {
                butir: (k.butir || []).map(b => ({
                    bagian: daftarTeks(b.bagian), salah: Number(b.salah), koreksi: teksRapi(b.koreksi),
                    pilihanKoreksi: daftarTeks(b.pilihanKoreksi).filter(Boolean), penjelasan: teksRapi(b.penjelasan),
                })),
            };
        default:
            return { durasiDetik: Number(k.durasiDetik) || 60 };
    }
}

// Kata-kata kalimat target (tanda baca menempel pada kata)
function kataKalimat(teks) {
    return teksRapi(teks).split(' ').filter(Boolean);
}

// Validasi konten aktivitas sesuai tipe. Hasil: '' bila valid atau pesan error pertama yang jelas.
function validateKontenAktivitas(tipe, kontenMentah, soal = []) {
    if (!TIPE_AKTIVITAS[tipe]) {
        return 'Pilih tipe aktivitas.';
    }
    const k = normalisasiKontenAktivitas(tipe, kontenMentah);
    const unik = list => new Set(list.map(x => x.toLowerCase())).size === list.length;
    const panjang = (list, maks) => list.some(x => x.length > maks);
    switch (tipe) {
        case 'matching': {
            const p = k.pasangan;
            if (p.length < 3 || p.length > 8) return 'Isi 3–8 pasangan.';
            const kosong = p.findIndex(x => !x.kiri || !x.kanan);
            if (kosong !== -1) return `Pasangan ${kosong + 1}: sisi kiri dan kanan wajib diisi.`;
            if (!unik(p.map(x => x.kiri))) return 'Isian sisi kiri tidak boleh kembar.';
            if (!unik(p.map(x => x.kanan))) return 'Isian sisi kanan tidak boleh kembar.';
            if (panjang([...p.map(x => x.kiri), ...p.map(x => x.kanan)], 150)) return 'Setiap isian maksimal 150 karakter.';
            return '';
        }
        case 'drag_drop': {
            if (k.kategori.length < 2 || k.kategori.length > 4) return 'Isi 2–4 kelompok.';
            if (k.kategori.some(x => !x)) return 'Nama setiap kelompok wajib diisi.';
            if (!unik(k.kategori)) return 'Nama kelompok tidak boleh kembar.';
            if (k.item.length < 4 || k.item.length > 12) return 'Isi 4–12 kartu.';
            const kosong = k.item.findIndex(x => !x.teks);
            if (kosong !== -1) return `Kartu ${kosong + 1}: teks wajib diisi.`;
            const salah = k.item.findIndex(x => !Number.isInteger(x.kategori) || x.kategori < 0 || x.kategori >= k.kategori.length);
            if (salah !== -1) return `Kartu ${salah + 1}: pilih kelompok yang benar.`;
            if (!unik(k.item.map(x => x.teks))) return 'Teks kartu tidak boleh kembar.';
            const tanpaIsi = k.kategori.findIndex((_, i) => !k.item.some(x => x.kategori === i));
            if (tanpaIsi !== -1) return `Kelompok "${k.kategori[tanpaIsi]}" belum memiliki kartu.`;
            if (panjang([...k.kategori, ...k.item.map(x => x.teks)], 120)) return 'Setiap isian maksimal 120 karakter.';
            return '';
        }
        case 'ordering': {
            if (k.urutan.length < 3 || k.urutan.length > 8) return 'Isi 3–8 langkah.';
            const kosong = k.urutan.findIndex(x => !x);
            if (kosong !== -1) return `Langkah ${kosong + 1} wajib diisi.`;
            if (!unik(k.urutan)) return 'Langkah tidak boleh kembar.';
            if (panjang(k.urutan, 150)) return 'Setiap langkah maksimal 150 karakter.';
            return '';
        }
        case 'true_false': {
            if (k.pernyataan.length < 3 || k.pernyataan.length > 8) return 'Isi 3–8 pernyataan.';
            const pendek = k.pernyataan.findIndex(x => x.teks.length < 5);
            if (pendek !== -1) return `Pernyataan ${pendek + 1}: minimal 5 karakter.`;
            if (panjang(k.pernyataan.map(x => x.teks), 250) || panjang(k.pernyataan.map(x => x.penjelasan), 250)) return 'Pernyataan dan penjelasan maksimal 250 karakter.';
            return '';
        }
        case 'image_selection': {
            if (k.pertanyaan.length < 5) return 'Pertanyaan wajib diisi (minimal 5 karakter).';
            if (k.pilihan.length < 3 || k.pilihan.length > 8) return 'Isi 3–8 kartu pilihan.';
            const kosong = k.pilihan.findIndex(x => !x.gambar || !x.label);
            if (kosong !== -1) return `Kartu ${kosong + 1}: gambar (emoji atau unggahan) dan keterangan wajib diisi.`;
            if (!k.pilihan.some(x => x.benar)) return 'Tandai minimal 1 kartu yang benar.';
            if (k.pilihan.every(x => x.benar)) return 'Harus ada minimal 1 kartu yang salah.';
            if (panjang(k.pilihan.map(x => x.label), 120)) return 'Keterangan kartu maksimal 120 karakter.';
            return '';
        }
        case 'sentence_builder': {
            if (k.kalimat.length < 1 || k.kalimat.length > 5) return 'Isi 1–5 kalimat.';
            for (let i = 0; i < k.kalimat.length; i++) {
                const kata = kataKalimat(k.kalimat[i].teks);
                if (kata.length < 3 || kata.length > 12) return `Kalimat ${i + 1}: harus terdiri dari 3–12 kata.`;
                if (k.kalimat[i].pengecoh.length > 3) return `Kalimat ${i + 1}: maksimal 3 kata pengecoh.`;
                if (k.kalimat[i].pengecoh.some(w => kata.map(x => x.toLowerCase()).includes(w.toLowerCase()))) return `Kalimat ${i + 1}: kata pengecoh tidak boleh sama dengan kata di kalimat.`;
            }
            return '';
        }
        case 'find_error': {
            if (k.butir.length < 1 || k.butir.length > 5) return 'Isi 1–5 pernyataan.';
            for (let i = 0; i < k.butir.length; i++) {
                const b = k.butir[i];
                const no = `Pernyataan ${i + 1}`;
                if (b.bagian.length < 2 || b.bagian.length > 6) return `${no}: bagi teks menjadi 2–6 bagian.`;
                if (b.bagian.some(x => !x)) return `${no}: setiap bagian wajib diisi.`;
                if (!Number.isInteger(b.salah) || b.salah < 0 || b.salah >= b.bagian.length) return `${no}: pilih bagian yang salah.`;
                if (!b.koreksi) return `${no}: koreksi wajib diisi.`;
                if (b.koreksi.toLowerCase() === b.bagian[b.salah].toLowerCase()) return `${no}: koreksi harus berbeda dari bagian yang salah.`;
                if (b.pilihanKoreksi.length > 3) return `${no}: maksimal 3 pilihan koreksi pengecoh.`;
                if (b.pilihanKoreksi.some(x => x.toLowerCase() === b.koreksi.toLowerCase())) return `${no}: pilihan pengecoh tidak boleh sama dengan koreksi.`;
            }
            return '';
        }
        default: {
            const durasi = cekBilanganBulat(k.durasiDetik, 'Waktu tantangan', 30, 300, ' detik');
            if (durasi) return durasi;
            if (!Array.isArray(soal) || soal.length < 3 || soal.length > 10) return 'Isi 3–10 soal tantangan.';
            return validateSoalList(soal, { bolehJodoh: false });
        }
    }
}

// Banyaknya butir yang dinilai dalam satu aktivitas
function jumlahButirAktivitas(e) {
    const k = e.konten || {};
    return {
        matching: () => (k.pasangan || []).length, drag_drop: () => (k.item || []).length, ordering: () => (k.urutan || []).length,
        true_false: () => (k.pernyataan || []).length, image_selection: () => (k.pilihan || []).length,
        sentence_builder: () => (k.kalimat || []).length, find_error: () => (k.butir || []).length,
    }[e.tipe]?.() ?? (e.soal || []).length;
}

// Nilai jawaban aktivitas. Bentuk jawaban per tipe:
//   matching: [indeks kanan untuk tiap kiri] · drag_drop: [indeks kelompok tiap kartu] · ordering: [indeks asli sesuai urutan disusun]
//   true_false: [true/false] · image_selection: [indeks kartu yang dipilih] · sentence_builder: [[kata…] tiap kalimat]
//   find_error: [{ bagian, koreksi }] · challenge: [indeks opsi]
// Hasil: { benar, total, skor (0–100), detail: [true/false per butir] }
function nilaiAktivitas(e, jawaban) {
    const k = e.konten || {};
    const j = Array.isArray(jawaban) ? jawaban : [];
    const sama = (a, b) => teksRapi(a).toLowerCase() === teksRapi(b).toLowerCase();
    let detail;
    switch (e.tipe) {
        case 'matching': detail = k.pasangan.map((_, i) => j[i] === i); break;
        case 'drag_drop': detail = k.item.map((it, i) => j[i] === it.kategori); break;
        case 'ordering': detail = k.urutan.map((_, i) => j[i] === i); break;
        case 'true_false': detail = k.pernyataan.map((p, i) => j[i] === p.benar); break;
        case 'image_selection': detail = k.pilihan.map((p, i) => j.includes(i) === p.benar); break;
        case 'sentence_builder': detail = k.kalimat.map((s, i) => Array.isArray(j[i]) && j[i].join(' ') === kataKalimat(s.teks).join(' ')); break;
        case 'find_error': detail = k.butir.map((b, i) => Boolean(j[i]) && j[i].bagian === b.salah && sama(j[i].koreksi, b.koreksi)); break;
        default: detail = e.soal.map((s, i) => jawabanBenar(s, j[i]));
    }
    const benar = detail.filter(Boolean).length;
    const total = detail.length;
    return { benar, total, skor: total ? Math.round((benar / total) * 100) : 0, detail };
}

// Simpan hasil satu percobaan aktivitas (boleh diulang lewat "Coba Lagi"; skor terbaik TIDAK pernah turun).
// Disimpan: status selesai, jumlah percobaan, skor terbaik, skor percobaan terakhir, waktu pengerjaan terakhir (detik),
// jawaban terakhir (untuk "Lihat Hasil"). durasiDetik = lama percobaan ini (null bila tidak diketahui).
function simpanHasilAktivitas(pesertaId, aktivitasId, jawaban, durasiDetik = null) {
    const e = getEvaluasiById(aktivitasId);
    if (!e || e.jenis !== 'aktivitas' || e.status !== 'Aktif' || cekAksesAksiPeserta(e.pertemuanId)) {
        return null;
    }
    const n = nilaiAktivitas(e, jawaban);
    const list = getAllHasil();
    const lama = list.find(h => h.pesertaId === Number(pesertaId) && h.jenis === 'aktivitas' && h.itemId === e.id);
    const detik = Number.isFinite(Number(durasiDetik)) && durasiDetik !== null ? Math.max(0, Math.round(Number(durasiDetik))) : null;
    const data = {
        id: lama ? lama.id : nextIdKoleksi(list),
        pesertaId: Number(pesertaId), kelasId: e.kelasId, pertemuanId: e.pertemuanId, jenis: 'aktivitas', itemId: e.id,
        tipe: e.tipe, status: 'Selesai', mulai: lama ? lama.mulai : waktuSekarang(), selesai: waktuSekarang(),
        jawaban: copyData(Array.isArray(jawaban) ? jawaban : []), benar: n.benar, salah: n.total - n.benar, kosong: 0, total: n.total, skor: n.skor,
        soal: null, percobaan: (lama ? lama.percobaan || 1 : 0) + 1, skorTerbaik: Math.max(n.skor, lama ? lama.skorTerbaik ?? lama.skor ?? 0 : 0),
        skorTerakhir: n.skor, durasiTerakhir: detik,
    };
    if (lama) {
        list[list.indexOf(lama)] = data;
    } else {
        list.push(data);
    }
    simpanHasilList(list);
    return data;
}

// Konten Aktif yang disimpan → komponen pertemuannya otomatis ditandai "siap"
function tandaiKomponenSiap(pertemuanId, komponen) {
    if (pertemuanId === null || pertemuanId === undefined) {
        return;
    }
    const list = getAllPertemuan();
    const p = list.find(item => item.id === Number(pertemuanId));
    if (p && !p.komponen.includes(komponen)) {
        p.komponen = KOMPONEN_PERTEMUAN.map(k => k.key).filter(k => k === komponen || p.komponen.includes(k));
        writeKoleksi('pertemuan', list);
    }
}

function addEvaluasi(data) {
    const list = getAllEvaluasi();
    const baru = { id: nextIdKoleksi(list), ...normalisasiEvaluasi(data) };
    list.push(baru);
    writeKoleksi('evaluasi', list);
    if (baru.status === 'Aktif') {
        tandaiKomponenSiap(baru.pertemuanId, JENIS_EVALUASI[baru.jenis].komponen);
    }
    return baru;
}

function updateEvaluasi(id, data) {
    const list = getAllEvaluasi();
    const index = list.findIndex(e => e.id === Number(id));
    if (index === -1) {
        return null;
    }
    // Form info (tanpa soal) tidak menghapus soal yang sudah ada
    list[index] = { ...list[index], ...normalisasiEvaluasi({ ...list[index], ...data }) };
    writeKoleksi('evaluasi', list);
    if (list[index].status === 'Aktif') {
        tandaiKomponenSiap(list[index].pertemuanId, JENIS_EVALUASI[list[index].jenis].komponen);
    }
    return list[index];
}

function deleteEvaluasi(id) {
    const list = getAllEvaluasi();
    const sisa = list.filter(e => e.id !== Number(id));
    if (sisa.length === list.length) {
        return false;
    }
    const evaluasi = list.find(e => e.id === Number(id));
    hapusHasilItem(evaluasi.jenis, id);
    writeKoleksi('evaluasi', sisa);
    return true;
}

function validateEvaluasi(data, currentId = null) {
    const errors = {};
    // Edit: isian yang tidak dikirim form (soal, tipe/konten aktivitas, target latihan) memakai data tersimpan
    if (currentId !== null) {
        const lama = getAllEvaluasi().find(e => e.id === Number(currentId));
        if (lama) {
            data = { tipe: lama.tipe, konten: lama.konten, target: lama.target, ...data, soal: Array.isArray(data.soal) ? data.soal : lama.soal };
        }
    }
    const judul = String(data.judul || '').trim();
    const kelas = getKelasById(data.kelasId);
    if (!judul) {
        errors.judul = 'Judul wajib diisi.';
    } else if (judul.length < 3) {
        errors.judul = 'Judul minimal 3 karakter.';
    } else if (judul.length > 100) {
        errors.judul = 'Judul maksimal 100 karakter.';
    }
    if (!JENIS_EVALUASI[data.jenis]) {
        errors.jenis = 'Pilih jenis (Pretest, Aktivitas Interaktif, atau Latihan Soal).';
    }
    if (!kelas) {
        errors.kelasId = 'Pilih kelas.';
    }
    const pertemuan = data.pertemuanId ? getPertemuanById(data.pertemuanId) : null;
    if (!pertemuan) {
        errors.pertemuanId = 'Pilih pertemuan.';
    } else if (kelas && pertemuan.kelasId !== kelas.id) {
        errors.pertemuanId = 'Pertemuan tidak termasuk kelas yang dipilih.';
    } else if (data.jenis === 'pretest' && getAllEvaluasi().some(e => e.jenis === 'pretest' && e.pertemuanId === pertemuan.id && e.id !== Number(currentId))) {
        errors.pertemuanId = 'Pertemuan ini sudah memiliki pretest.';
    } else if (data.jenis === 'aktivitas' && getAllEvaluasi().filter(e => e.jenis === 'aktivitas' && e.pertemuanId === pertemuan.id && e.id !== Number(currentId)).length >= AKTIVITAS_MAKS_PER_PERTEMUAN) {
        errors.pertemuanId = `Pertemuan ini sudah memiliki ${AKTIVITAS_MAKS_PER_PERTEMUAN} aktivitas (maksimal).`;
    }
    if (data.jenis !== 'aktivitas') {
        const durasi = String(data.durasi ?? '').trim() === '' ? '0' : data.durasi;
        const errDurasi = cekBilanganBulat(durasi, 'Durasi', 0, 180, ' menit');
        if (errDurasi) {
            errors.durasi = errDurasi;
        }
    }
    if (!STATUS_EVALUASI.includes(data.status)) {
        errors.status = 'Pilih status.';
    }
    if (String(data.instruksi || '').trim().length > 500) {
        errors.instruksi = 'Instruksi maksimal 500 karakter.';
    }
    const soal = Array.isArray(data.soal) ? data.soal : [];

    // Aktivitas: tipe & konten sesuai tipe selalu divalidasi (tidak ada aktivitas kosong yang dianggap valid)
    if (data.jenis === 'aktivitas') {
        if (!TIPE_AKTIVITAS[data.tipe]) {
            errors.tipe = 'Pilih tipe aktivitas.';
        } else {
            const errKonten = validateKontenAktivitas(data.tipe, data.konten, soal);
            if (errKonten) {
                errors.konten = errKonten;
            }
        }
        return errors;
    }

    // Latihan: target jumlah soal 5–50 (soal ditulis Pengajar lewat Kelola Soal)
    if (data.jenis === 'latihan') {
        const errTarget = cekBilanganBulat(data.target ?? LATIHAN_TARGET_AWAL, 'Jumlah soal', 5, 50, ' soal');
        if (errTarget) {
            errors.target = errTarget;
        }
    }

    // Draft boleh belum lengkap (soal diisi lewat Kelola Soal); yang diterbitkan (Aktif) harus lengkap
    if (soal.length) {
        const errSoal = validateSoalList(soal, { bolehJodoh: false });
        if (errSoal) {
            errors.soal = errSoal;
        }
    }
    if (data.jenis === 'pretest' && soal.length > PRETEST_JUMLAH_SOAL) {
        errors.soal = `Pretest harus tepat ${PRETEST_JUMLAH_SOAL} soal (sekarang ${soal.length}). Hapus ${soal.length - PRETEST_JUMLAH_SOAL} soal.`;
    }
    if (data.status === 'Aktif' && !errors.status) {
        const target = data.jenis === 'pretest' ? PRETEST_JUMLAH_SOAL : data.jenis === 'latihan' ? Number(data.target) || LATIHAN_TARGET_AWAL : 1;
        if (soal.length < target) {
            errors.status = soal.length
                ? `Belum siap diterbitkan: baru ${soal.length} dari ${target} soal. Lengkapi lewat Kelola Soal atau simpan sebagai Draft.`
                : 'Belum ada soal. Simpan sebagai Draft, lalu tambahkan soal lewat Kelola Soal sebelum diterbitkan.';
        }
    }
    return errors;
}

// ---- Soal Kuis & TO ----
// Soal kuis = soal milik kuis (dibuat Pengajar). Tidak ada lagi pengambilan otomatis dari bank/kumpulan soal.
const KUIS_SOAL_MAKS = 100;
function getSoalKuis(kuis) {
    return Array.isArray(kuis.soal) ? kuis.soal : [];
}

// Soal TO: soal yang disusun Pengajar/Admin (Kelola Soal) bila ada; bila belum pernah disusun,
// diambil bergiliran dari bank Pertemuan 1–6 (PTS) / 1–12 (PAS) sebanyak jumlahSoal
function getSoalTO(to) {
    if (Array.isArray(to.soal)) {
        return to.soal;
    }
    const kelas = getKelasTersimpan().find(k => k.id === to.kelasId);
    if (!kelas || !JENIS_TO[to.jenis]) {
        return [];
    }
    const bank = [];
    for (let n = JENIS_TO[to.jenis].dariPertemuan; n <= JENIS_TO[to.jenis].batasPertemuan; n++) {
        const b = soalBankPertemuan(kelas.mapel, n);
        if (b) {
            bank.push(b);
        }
    }
    const hasil = [];
    const ada = new Set();   // bank dapat memuat soal yang sama di dua pertemuan → TO tidak boleh berisi soal kembar
    ['pg', 'bs'].forEach(tipe => {
        const maks = Math.max(0, ...bank.map(b => b[tipe].length));
        for (let i = 0; i < maks; i++) {
            bank.forEach(b => {
                const s = b[tipe][i];
                if (s && !ada.has(s.teks.toLowerCase())) {
                    ada.add(s.teks.toLowerCase());
                    hasil.push(s);
                }
            });
        }
    });
    return hasil.slice(0, to.jumlahSoal);
}

// ---- Kelola Soal (Pengajar & Admin) ----
// Satu API untuk Pretest, Aktivitas Interaktif, Latihan Soal, Kuis, TO PTS & TO PAS.
// Setiap perubahan langsung tersimpan ke koleksi asalnya (evaluasi / kuis / to), sehingga peserta yang
// MULAI mengerjakan setelah perubahan memakai soal terbaru. Hasil yang sudah ada tetap memakai salinan soalnya.
// Pembatasan: Peserta tidak boleh mengelola soal; Pengajar hanya item di kelas yang diampu (lewat getter yang
// sudah dibatasi role); Admin semua kelas.
// Batas jumlah soal TO (sama dengan aturan form TO). TO Draft boleh belum lengkap.
const TO_SOAL_MIN = 10;
const TO_SOAL_MAKS = 100;

// Aktivitas Interaktif tidak memakai editor soal (konten bertipe diatur di form aktivitas).
// Semua soal ditulis sendiri oleh Pengajar/Admin (Pretest, Latihan, Kuis, TO) — tidak ada pemilihan dari Bank Soal.
// Kuis: soal SELALU dibuat Pengajar; target & batas = Jumlah Soal yang direncanakan di form kuis.
const JENIS_KELOLA_SOAL = {
    pretest: { label: 'Pretest', minTerbit: PRETEST_JUMLAH_SOAL, maks: PRETEST_JUMLAH_SOAL },
    latihan: { label: 'Latihan Soal', minTerbit: LATIHAN_TARGET_AWAL, maks: 100 },
    kuis: { label: 'Kuis', minTerbit: 1, maks: KUIS_SOAL_MAKS },
    to: { label: 'Try Out', minTerbit: TO_SOAL_MIN, maks: TO_SOAL_MAKS },
};

// Status yang berarti item sudah terlihat peserta
function itemTerbit(jenis, item) {
    return JENIS_EVALUASI[jenis] ? item.status === 'Aktif' : item.status !== 'Draft';
}

// { jenis, item, soal (salinan), tersusun, label, bolehJodoh, terbit, minTerbit, maks } atau null
function getItemKelolaSoal(jenis, id) {
    const user = getCurrentUser();
    if ((user && user.role === 'peserta') || !JENIS_KELOLA_SOAL[jenis]) {
        return null;
    }
    let item = null;
    let soal = [];
    if (JENIS_EVALUASI[jenis]) {
        item = getEvaluasiById(id);
        if (item && item.jenis !== jenis) {
            item = null;
        }
        soal = item ? item.soal : [];
    } else if (jenis === 'kuis') {
        item = getKuisById(id);
        soal = item ? getSoalKuis(item) : [];
    } else {
        item = getTOById(id);
        soal = item ? getSoalTO(item) : [];
    }
    if (!item) {
        return null;
    }
    const aturan = JENIS_KELOLA_SOAL[jenis];
    const kelas = getKelasTersimpan().find(k => k.id === item.kelasId);
    const target = jenis === 'latihan' ? Number(item.target) || LATIHAN_TARGET_AWAL
        : jenis === 'kuis' ? Math.max(1, Number(item.jumlahSoal) || 1) : aturan.minTerbit;
    return {
        jenis,
        item,
        soal: copyData(soal),
        // false = soal TO masih diambil otomatis dari kumpulan soal bawaan; disalin saat pertama kali diubah
        tersusun: Array.isArray(item.soal),
        label: jenis === 'to' ? `TO ${item.jenis}` : aturan.label,
        bolehJodoh: false,
        mapel: kelas ? kelas.mapel : '',
        terbit: itemTerbit(jenis, item),
        minTerbit: target,
        target,
        // Kuis: banyak soal dibatasi Jumlah Soal yang direncanakan (ubah lewat Edit Kuis)
        maks: jenis === 'kuis' ? target : aturan.maks,
    };
}

// Simpan seluruh daftar soal sebuah item. Hasil: { ok, item, soal } atau { ok: false, pesan }
function simpanSoalItem(jenis, id, soalList) {
    const data = getItemKelolaSoal(jenis, id);
    if (!data) {
        return { ok: false, pesan: 'Data tidak ditemukan atau Anda tidak memiliki akses untuk mengelola soal ini.' };
    }
    const list = Array.isArray(soalList) ? soalList : [];
    if (list.length > data.maks) {
        return { ok: false, pesan: `Maksimal ${data.maks} soal.` };
    }
    if (data.terbit && list.length < data.minTerbit) {
        const status = data.item.status;
        return {
            ok: false,
            pesan: jenis === 'pretest'
                ? `Pretest berstatus ${status} harus tepat ${PRETEST_JUMLAH_SOAL} soal. Ubah status ke Draft terlebih dahulu bila ingin mengganti soal.`
                : data.minTerbit > 1
                    ? `${data.label} berstatus ${status} harus memiliki minimal ${data.minTerbit} soal. Ubah status ke Draft terlebih dahulu bila ingin mengurangi soal.`
                    : `${data.label} berstatus ${status} harus memiliki minimal 1 soal. Ubah status ke Draft terlebih dahulu bila ingin menghapus semua soal.`,
        };
    }
    if (list.length) {
        const err = validateSoalList(list, { bolehJodoh: data.bolehJodoh });
        if (err) {
            return { ok: false, pesan: err };
        }
    }
    const soal = normalisasiSoalList(list);
    let item;
    if (JENIS_EVALUASI[jenis]) {
        item = updateEvaluasi(data.item.id, { soal });
    } else if (jenis === 'kuis') {
        item = updateKuis(data.item.id, { soal });
    } else {
        item = updateTO(data.item.id, { soal });
    }
    return { ok: true, item, soal };
}

// Validasi soal dari editor: pilihan ganda wajib 4 pilihan (A–D)
function validateSoalEditor(jenis, soal) {
    return validateSoal(soal, { opsiWajib: 4, bolehJodoh: jenis === 'aktivitas' });
}

// Tambah / ubah / hapus / geser satu soal. Hasil: { ok, soal, item } atau { ok: false, errors?, pesan }
function tambahSoalItem(jenis, id, soal) {
    const data = getItemKelolaSoal(jenis, id);
    if (!data) {
        return { ok: false, pesan: 'Data tidak ditemukan atau Anda tidak memiliki akses untuk mengelola soal ini.' };
    }
    const errors = validateSoalEditor(jenis, soal);
    if (Object.keys(errors).length) {
        return { ok: false, errors, pesan: 'Soal belum tersimpan. Periksa kolom yang ditandai merah.' };
    }
    if (data.soal.length >= data.maks) {
        return {
            ok: false,
            pesan: jenis === 'kuis'
                ? `Kuis ini sudah berisi ${data.soal.length} dari ${data.target} soal yang direncanakan. Ubah Jumlah Soal lewat Edit Kuis untuk menambah soal lain.`
                : `Maksimal ${data.maks} soal.`,
        };
    }
    return simpanSoalItem(jenis, id, [...data.soal, normalisasiSoal(soal)]);
}

function ubahSoalItem(jenis, id, index, soal) {
    const data = getItemKelolaSoal(jenis, id);
    if (!data || index < 0 || index >= data.soal.length) {
        return { ok: false, pesan: 'Soal tidak ditemukan. Mungkin sudah dihapus.' };
    }
    const errors = validateSoalEditor(jenis, soal);
    if (Object.keys(errors).length) {
        return { ok: false, errors, pesan: 'Perubahan soal belum tersimpan. Periksa kolom yang ditandai merah.' };
    }
    const list = [...data.soal];
    list[index] = normalisasiSoal(soal);
    return simpanSoalItem(jenis, id, list);
}

function hapusSoalItem(jenis, id, index) {
    const data = getItemKelolaSoal(jenis, id);
    if (!data || index < 0 || index >= data.soal.length) {
        return { ok: false, pesan: 'Soal tidak ditemukan. Mungkin sudah dihapus.' };
    }
    return simpanSoalItem(jenis, id, data.soal.filter((_, i) => i !== index));
}

// arah: -1 (naik) atau +1 (turun)
function geserSoalItem(jenis, id, index, arah) {
    const data = getItemKelolaSoal(jenis, id);
    const tujuan = index + arah;
    if (!data || index < 0 || index >= data.soal.length || tujuan < 0 || tujuan >= data.soal.length) {
        return { ok: false, pesan: 'Urutan soal tidak dapat diubah.' };
    }
    const list = [...data.soal];
    [list[index], list[tujuan]] = [list[tujuan], list[index]];
    return simpanSoalItem(jenis, id, list);
}

// Jumlah peserta yang sudah/sedang mengerjakan item (info di editor: hasil mereka memakai salinan soal lama)
function hitungPengerjaanItem(jenis, itemId) {
    const milik = getAllHasil().filter(h => h.jenis === jenis && h.itemId === Number(itemId));
    return {
        selesai: milik.filter(h => h.status === 'Selesai').length,
        sedang: milik.filter(h => h.status === 'Sedang dikerjakan').length,
    };
}

// ---- Hasil pengerjaan ----
// Aturan: Pretest, Kuis, TO hanya 1 kali; Aktivitas & Latihan boleh diulang
const BOLEH_DIULANG = { pretest: false, aktivitas: true, latihan: true, kuis: false, to: false };

function getAllHasil() {
    return getKoleksi('hasil');
}

function getHasil(pesertaId, jenis, itemId) {
    return getAllHasil().find(h => h.pesertaId === Number(pesertaId) && h.jenis === jenis && h.itemId === Number(itemId)) || null;
}

function simpanHasilList(list) {
    return writeKoleksi('hasil', list);
}

function hapusHasilItem(jenis, itemId) {
    const nama = jenis === 'modul' ? 'progresmodul' : 'hasil';
    const list = getKoleksi(nama);
    const cocok = item => (nama === 'progresmodul' ? item.modulId === Number(itemId) : item.jenis === jenis && item.itemId === Number(itemId));
    if (list.some(cocok)) {
        writeKoleksi(nama, list.filter(item => !cocok(item)));
    }
}

// Item yang dapat dikerjakan peserta: { jenis, item, soal, durasi, kelasId, pertemuanId } atau null
function getItemPengerjaan(jenis, itemId) {
    if (JENIS_EVALUASI[jenis]) {
        const e = getEvaluasiById(itemId);
        return e && e.jenis === jenis ? { jenis, item: e, soal: e.soal, durasi: e.durasi, kelasId: e.kelasId, pertemuanId: e.pertemuanId } : null;
    }
    if (jenis === 'kuis') {
        const k = getKuisById(itemId);
        return k ? { jenis, item: k, soal: getSoalKuis(k), durasi: k.durasi, kelasId: k.kelasId, pertemuanId: k.pertemuanId } : null;
    }
    if (jenis === 'to') {
        const t = getTOById(itemId);
        return t ? { jenis, item: t, soal: getSoalTO(t), durasi: t.durasi, kelasId: t.kelasId, pertemuanId: null } : null;
    }
    return null;
}

// Mulai (atau lanjutkan) pengerjaan. Hasil: { ok, hasil } atau { ok: false, pesan }
function mulaiPengerjaan(pesertaId, jenis, itemId) {
    const data = getItemPengerjaan(jenis, itemId);
    if (!data || !data.soal.length) {
        return { ok: false, pesan: 'Soal tidak ditemukan atau belum tersedia.' };
    }
    // Akses jadwal pertemuan (status terbaru): hanya "Berjalan" yang boleh memulai/melanjutkan pengerjaan
    const tutup = cekAksesAksiPeserta(data.pertemuanId);
    if (tutup) {
        return { ok: false, pesan: tutup, tutup: true };
    }
    const list = getAllHasil();
    let h = list.find(x => x.pesertaId === Number(pesertaId) && x.jenis === jenis && x.itemId === Number(itemId));
    if (h && h.status === 'Sedang dikerjakan') {
        return { ok: true, hasil: h };
    }
    if (h && h.status === 'Selesai' && !BOLEH_DIULANG[jenis]) {
        return { ok: false, pesan: 'Bagian ini hanya dapat dikerjakan satu kali dan sudah selesai.' };
    }
    const baru = {
        id: h ? h.id : nextIdKoleksi(list),
        pesertaId: Number(pesertaId),
        kelasId: data.kelasId,
        pertemuanId: data.pertemuanId,
        jenis,
        itemId: Number(itemId),
        ...(jenis === 'to' ? { jenisTO: data.item.jenis } : {}),
        status: 'Sedang dikerjakan',
        mulai: waktuSekarang(),
        mulaiMs: Date.now(),
        durasi: Number(data.durasi) || 0,
        soal: copyData(data.soal),  // salinan soal: hasil tetap dapat dilihat walau soal diubah pengajar
        jawaban: data.soal.map(() => null),
        percobaan: (h ? h.percobaan || 1 : 0) + 1,
        skorTerbaik: h ? h.skorTerbaik ?? h.skor ?? null : null,
    };
    if (h) {
        list[list.indexOf(h)] = baru;
    } else {
        list.push(baru);
    }
    simpanHasilList(list);
    return { ok: true, hasil: baru };
}

// Sisa waktu (detik) pengerjaan berbatas waktu; null bila tanpa batas
function sisaWaktu(hasil, sekarang = Date.now()) {
    if (!hasil.durasi) {
        return null;
    }
    return Math.max(0, Math.round((hasil.mulaiMs + hasil.durasi * 60000 - sekarang) / 1000));
}

function simpanJawaban(hasilId, nomor, pilihan) {
    const list = getAllHasil();
    const h = list.find(x => x.id === Number(hasilId));
    if (!h || h.status !== 'Sedang dikerjakan' || nomor < 0 || nomor >= h.jawaban.length) {
        return null;
    }
    // Pertemuan sudah tidak Berjalan → jawaban baru ditolak (pengerjaan dibekukan, jawaban lama tetap)
    if (cekAksesAksiPeserta(h.pertemuanId)) {
        return null;
    }
    // Menjodohkan: array indeks pasangan (null = pernyataan belum dipasangkan)
    h.jawaban[nomor] = pilihan === null ? null
        : Array.isArray(pilihan) ? pilihan.map(x => (x === null || x === '' || x === undefined ? null : Number(x)))
            : Number(pilihan);
    simpanHasilList(list);
    return h;
}

function selesaikanPengerjaan(hasilId) {
    const list = getAllHasil();
    const h = list.find(x => x.id === Number(hasilId));
    if (!h || h.status !== 'Sedang dikerjakan') {
        return h || null;
    }
    // Pertemuan sudah tidak Berjalan → pengiriman ditolak; pengerjaan dibekukan (dapat dilanjutkan bila dibuka kembali)
    if (cekAksesAksiPeserta(h.pertemuanId)) {
        return h;
    }
    Object.assign(h, nilaiJawaban(h.soal, h.jawaban), { status: 'Selesai', selesai: waktuSekarang() });
    h.skorTerbaik = Math.max(h.skor, h.skorTerbaik ?? 0);
    simpanHasilList(list);
    return h;
}

// ---- Tugas: pengumpulan oleh peserta & penilaian oleh pengajar ----
// Jawaban tugas tersimpan di koleksi hasil (jenis 'tugas') agar langsung dipakai Rekap Nilai & Nilai Saya.
// Pemetaan field: itemId = taskId, pesertaId = participantId, teks = jawaban ketik, lampiran = file jawaban,
// dikumpulkan = tanggal pengumpulan, status (Dikumpulkan/Dinilai), nilai = score, catatan = feedback,
// dinilaiOleh = gradedBy, dinilaiPada = gradedAt, metode = 'ketik' | 'upload'.
const STATUS_PENGUMPULAN = ['Dikumpulkan', 'Dinilai'];

// Metode jawaban yang boleh dipakai peserta untuk sebuah tugas
function metodeJawabanTugas(tugas) {
    return tugas.metode === 'ketik' ? ['ketik'] : tugas.metode === 'upload' ? ['upload'] : ['ketik', 'upload'];
}

// { metode: 'ketik'|'upload', teks, file } — teks untuk Ketik Langsung, file (data ringkas file tersimpan) untuk Upload File.
// Pemanggil lama { teks, lampiran } tetap didukung (metode ditebak: ada teks → ketik, selain itu upload).
// Hasil { ok, hasil } atau { ok: false, pesan, field: 'teks'|'file'|'metode' }
function kumpulkanTugas(pesertaId, tugasId, { metode, teks, file, lampiran } = {}) {
    const tugas = getTugasById(tugasId);
    if (!tugas) {
        return { ok: false, pesan: 'Tugas tidak ditemukan.' };
    }
    const user = getCurrentUser();
    if (user && user.role !== 'peserta') {
        return { ok: false, pesan: 'Hanya peserta yang dapat mengumpulkan jawaban tugas.' };
    }
    // Tugas di luar alur berurutan, tetapi pengiriman mengikuti status pertemuannya (status terbaru)
    const tutup = cekAksesAksiPeserta(tugas.pertemuanId);
    if (tutup) {
        return { ok: false, pesan: tutup, field: 'jadwal', tutup: true };
    }
    const izin = metodeJawabanTugas(tugas);
    const fileJawaban = file || lampiran || null;
    const dipilih = metode || (String(teks || '').trim() ? 'ketik' : fileJawaban ? 'upload' : izin[0]);
    if (!izin.includes(dipilih)) {
        return { ok: false, pesan: `Tugas ini hanya menerima jawaban dengan metode ${METODE_TUGAS[tugas.metode]}.`, field: 'metode' };
    }
    const isi = String(teks || '').trim();
    let fileSimpan = null;
    if (dipilih === 'ketik') {
        if (isi.length < 10) {
            return { ok: false, pesan: 'Jawaban tugas minimal 10 karakter.', field: 'teks' };
        }
        if (isi.length > 3000) {
            return { ok: false, pesan: 'Jawaban tugas maksimal 3000 karakter.', field: 'teks' };
        }
        // Kompatibel dengan data lama: lampiran tambahan pada jawaban ketik tetap disimpan
        if (!metode && lampiran && lampiran.nama) {
            const errLama = validateLampiran(lampiran);
            if (errLama) {
                return { ok: false, pesan: errLama, field: 'file' };
            }
            fileSimpan = normalisasiLampiran(lampiran);
        }
    } else {
        const errFile = validateFileTugas(fileJawaban, 'jawaban');
        if (errFile) {
            return { ok: false, pesan: errFile, field: 'file' };
        }
        fileSimpan = normalisasiLampiran(fileJawaban);
    }
    const list = getAllHasil();
    const lama = list.find(h => h.pesertaId === Number(pesertaId) && h.jenis === 'tugas' && h.itemId === tugas.id);
    if (lama && lama.status === 'Dinilai') {
        return { ok: false, pesan: 'Tugas sudah dinilai pengajar dan tidak dapat dikirim ulang.' };
    }
    const data = {
        id: lama ? lama.id : nextIdKoleksi(list),
        pesertaId: Number(pesertaId),
        kelasId: tugas.kelasId,
        pertemuanId: tugas.pertemuanId,
        jenis: 'tugas',
        itemId: tugas.id,
        status: 'Dikumpulkan',
        metode: dipilih,
        teks: dipilih === 'ketik' ? isi : '',
        lampiran: fileSimpan,
        dikumpulkan: waktuSekarang(),
        terlambat: Boolean(tugas.deadline) && waktuSekarang() > `${tugas.deadline}:59`,
        nilai: null,
        catatan: '',
        dinilaiOleh: null,
        dinilaiPada: null,
    };
    if (lama) {
        list[list.indexOf(lama)] = data;
    } else {
        list.push(data);
    }
    if (!simpanHasilList(list)) {
        return { ok: false, pesan: PESAN_PENYIMPANAN_PENUH, field: 'file' };
    }
    return { ok: true, hasil: data, lama: lama || null };
}

// Pengajar/Admin menilai pengumpulan tugas (boleh diubah lagi). errors: { nilai?, catatan? }
function nilaiTugas(hasilId, nilai, catatan = '') {
    const errors = {};
    const err = cekBilanganBulat(nilai, 'Nilai', 0, 100);
    if (err) {
        errors.nilai = err;
    }
    const feedback = String(catatan || '').trim();
    if (feedback.length > 500) {
        errors.catatan = 'Feedback maksimal 500 karakter.';
    }
    if (Object.keys(errors).length) {
        return { ok: false, errors, pesan: errors.nilai || errors.catatan };
    }
    const user = getCurrentUser();
    const list = getAllHasil();
    const h = list.find(x => x.id === Number(hasilId) && x.jenis === 'tugas');
    // Peserta tidak boleh menilai; Pengajar hanya tugas di kelas yang diampu (getTugasById dibatasi role)
    if (!h || (user && user.role === 'peserta') || !getTugasById(h.itemId)) {
        return { ok: false, errors: {}, pesan: 'Pengumpulan tugas tidak ditemukan atau Anda tidak memiliki akses untuk menilainya.' };
    }
    Object.assign(h, { status: 'Dinilai', nilai: Number(nilai), catatan: feedback, dinilaiOleh: user ? user.nama : null, dinilaiPada: waktuSekarang() });
    simpanHasilList(list);
    return { ok: true, hasil: h };
}

// Status pengumpulan satu peserta untuk tampilan Pengajar. Selama tugas Aktif peserta masih dapat mengumpulkan
// (lewat deadline = terlambat), jadi "Tidak mengumpulkan" hanya dipakai bila tugas sudah Ditutup.
function statusPengumpulan(tugas, hasil) {
    if (!hasil) {
        return tugas.status === 'Ditutup' ? 'Tidak mengumpulkan' : 'Belum mengumpulkan';
    }
    return hasil.status === 'Dinilai' ? 'Dinilai' : 'Perlu dinilai';
}

// Pengumpulan sebuah tugas: semua peserta kelas (yang belum mengumpulkan juga tampil) + pengumpulan
// dari peserta yang sudah pindah kelas. Hasil null bila tugas tidak ada / bukan kelas yang boleh dilihat.
function getPengumpulanTugas(tugasId) {
    const tugas = getTugasById(tugasId);
    const user = getCurrentUser();
    if (!tugas || (user && user.role === 'peserta')) {
        return null;
    }
    const hasil = getAllHasil().filter(h => h.jenis === 'tugas' && h.itemId === tugas.id);
    const pesertaList = getAllPeserta();
    const dariKelas = pesertaList.filter(p => p.kelasId === tugas.kelasId);
    const pindah = hasil.filter(h => !dariKelas.some(p => p.id === h.pesertaId))
        .map(h => pesertaList.find(p => p.id === h.pesertaId)).filter(Boolean);
    const baris = [...dariKelas, ...pindah].map(p => {
        const h = hasil.find(x => x.pesertaId === p.id) || null;
        return { peserta: p, hasil: h, status: statusPengumpulan(tugas, h), pindahKelas: p.kelasId !== tugas.kelasId };
    });
    const dinilai = baris.filter(b => b.status === 'Dinilai');
    return {
        tugas,
        baris,
        ringkasan: {
            peserta: dariKelas.length,
            mengumpulkan: baris.filter(b => b.hasil).length,
            perluDinilai: baris.filter(b => b.status === 'Perlu dinilai').length,
            dinilai: dinilai.length,
            terlambat: baris.filter(b => b.hasil && b.hasil.terlambat).length,
            rataRata: dinilai.length ? bulatkan(dinilai.reduce((s, b) => s + b.hasil.nilai, 0) / dinilai.length) : null,
        },
    };
}

// ---- Pemantauan pengerjaan peserta per komponen (Pengajar: kelas yang diampu; Admin: semua kelas) ----
// Sumber data (dihubungkan lewat ID, bukan judul/nama):
//   Pretest/Aktivitas/Latihan/Kuis → koleksi hasil (jenis + itemId + pesertaId; salinan soal + jawaban peserta)
//   Modul → koleksi progresmodul (modulId + pesertaId; status "Sedang dipelajari" = baru dibuka, "Selesai" = ditandai selesai)
//   Tugas → koleksi hasil (jenis 'tugas'; teks/lampiran, nilai & feedback)
const JENIS_PEMANTAUAN = {
    pretest: { label: 'Pretest', daftar: 'evaluasi.html?jenis=pretest', menu: 'evaluasi-pretest' },
    modul: { label: 'Modul Pembelajaran', daftar: 'modul.html', menu: 'modul' },
    aktivitas: { label: 'Aktivitas Interaktif', daftar: 'evaluasi.html?jenis=aktivitas', menu: 'evaluasi-aktivitas' },
    latihan: { label: 'Latihan Soal', daftar: 'evaluasi.html?jenis=latihan', menu: 'evaluasi-latihan' },
    kuis: { label: 'Kuis', daftar: 'kuis.html', menu: 'kuis' },
    tugas: { label: 'Tugas', daftar: 'tugas.html', menu: 'tugas' },
};
// Status yang dapat muncul (urutan filter) & status yang dihitung "sudah"
const STATUS_PEMANTAUAN = {
    pretest: ['Belum Mengerjakan', 'Sedang Mengerjakan', 'Sudah Mengerjakan'],
    kuis: ['Belum Mengerjakan', 'Sedang Mengerjakan', 'Sudah Mengerjakan'],
    latihan: ['Belum Mengerjakan', 'Sedang Mengerjakan', 'Sudah Mengerjakan'],
    aktivitas: ['Belum Mengerjakan', 'Selesai'],
    modul: ['Belum Membuka', 'Sedang Dipelajari', 'Selesai'],
    tugas: ['Belum Mengumpulkan', 'Tidak Mengumpulkan', 'Sudah Mengumpulkan', 'Sudah Dinilai'],
};
const STATUS_PEMANTAUAN_SUDAH = ['Sudah Mengerjakan', 'Selesai', 'Sudah Mengumpulkan', 'Sudah Dinilai'];
const STATUS_PEMANTAUAN_SEDANG = ['Sedang Mengerjakan', 'Sedang Dipelajari'];

// Komponen yang dipantau (dibatasi role lewat get…ById). null bila tidak ada / bukan kelas yang boleh dilihat.
function itemPemantauan(jenis, id) {
    if (jenis === 'modul') {
        return getModulById(id);
    }
    if (jenis === 'kuis') {
        return getKuisById(id);
    }
    if (jenis === 'tugas') {
        return getTugasById(id);
    }
    const e = JENIS_EVALUASI[jenis] ? getEvaluasiById(id) : null;
    return e && e.jenis === jenis ? e : null;
}

// Status satu peserta dari rekam data yang benar-benar tersimpan (hasil / progres modul). Hanya membuka modul ≠ selesai.
function statusPemantauan(jenis, item, rekam) {
    if (jenis === 'modul') {
        return !rekam ? 'Belum Membuka' : rekam.status === 'Selesai' ? 'Selesai' : 'Sedang Dipelajari';
    }
    if (jenis === 'tugas') {
        return !rekam ? (item.status === 'Ditutup' ? 'Tidak Mengumpulkan' : 'Belum Mengumpulkan') : rekam.status === 'Dinilai' ? 'Sudah Dinilai' : 'Sudah Mengumpulkan';
    }
    if (!rekam) {
        return 'Belum Mengerjakan';
    }
    if (jenis === 'aktivitas') {
        return 'Selesai';
    }
    return rekam.status === 'Selesai' ? 'Sudah Mengerjakan' : 'Sedang Mengerjakan';
}

// Nilai yang ditampilkan (null bila belum ada nilai): Pretest/Kuis = nilai pengerjaan; Latihan/Aktivitas = nilai terbaik;
// Tugas = nilai setelah dinilai; Modul tidak bernilai.
function nilaiPemantauan(jenis, rekam) {
    if (!rekam || jenis === 'modul') {
        return null;
    }
    if (jenis === 'tugas') {
        return rekam.status === 'Dinilai' ? rekam.nilai : null;
    }
    if (jenis === 'latihan' || jenis === 'aktivitas') {
        return rekam.skorTerbaik ?? (rekam.status === 'Selesai' ? rekam.skor ?? null : null);
    }
    return rekam.status === 'Selesai' ? rekam.skor ?? null : null;
}

// Data halaman Pemantauan: komponen + seluruh peserta kelasnya (yang belum mengerjakan juga tampil) + peserta yang sudah
// pindah kelas tetapi punya rekam data. Hasil null bila komponen tidak ada / tidak boleh dilihat / login sebagai peserta.
function getPemantauan(jenis, id) {
    const user = getCurrentUser();
    if (!JENIS_PEMANTAUAN[jenis] || (user && user.role === 'peserta')) {
        return null;
    }
    const item = itemPemantauan(jenis, id);
    if (!item) {
        return null;
    }
    const rekamList = jenis === 'modul'
        ? getKoleksi('progresmodul').filter(p => p.modulId === item.id)
        : getAllHasil().filter(h => h.jenis === jenis && h.itemId === item.id);
    const pesertaList = getAllPeserta();
    const dariKelas = pesertaList.filter(p => p.kelasId === item.kelasId);
    const pindah = rekamList.filter(r => !dariKelas.some(p => p.id === r.pesertaId))
        .map(r => pesertaList.find(p => p.id === r.pesertaId)).filter(Boolean);
    const kelasMap = Object.fromEntries(getKelasTersimpan().map(k => [k.id, k]));
    const baris = [...dariKelas, ...pindah].map(p => {
        const rekam = rekamList.find(r => r.pesertaId === p.id) || null;
        const status = statusPemantauan(jenis, item, rekam);
        return { peserta: p, kelas: kelasMap[p.kelasId] || null, rekam, status, nilai: nilaiPemantauan(jenis, rekam), pindahKelas: p.kelasId !== item.kelasId };
    });
    const bernilai = baris.filter(b => b.nilai !== null && b.nilai !== undefined);
    const hitung = daftar => baris.filter(b => daftar.includes(b.status)).length;
    return {
        jenis,
        item,
        kelas: getKelasById(item.kelasId),
        pertemuan: item.pertemuanId ? getPertemuanById(item.pertemuanId) : null,
        statusList: STATUS_PEMANTAUAN[jenis],
        baris,
        ringkasan: {
            terdaftar: dariKelas.length,
            sudah: hitung(STATUS_PEMANTAUAN_SUDAH),
            sedang: hitung(STATUS_PEMANTAUAN_SEDANG),
            belum: baris.length - hitung(STATUS_PEMANTAUAN_SUDAH) - hitung(STATUS_PEMANTAUAN_SEDANG),
            dinilai: hitung(['Sudah Dinilai']),
            rataRata: bernilai.length ? bulatkan(bernilai.reduce((s, b) => s + Number(b.nilai), 0) / bernilai.length) : null,
            bernilai: bernilai.length,
        },
    };
}

// ---- Progres modul peserta ----
function getProgresModul(pesertaId, modulId) {
    return getKoleksi('progresmodul').find(p => p.pesertaId === Number(pesertaId) && p.modulId === Number(modulId)) || null;
}

// status: 'Sedang dipelajari' (saat modul dibuka) atau 'Selesai' (ditandai peserta)
function setProgresModul(pesertaId, modulId, status) {
    const modul = getModulById(modulId);
    if (!modul) {
        return null;
    }
    const list = getKoleksi('progresmodul');
    // Pertemuan tidak Berjalan → progres tidak berubah (membaca modul tetap boleh saat Selesai, tetapi tidak dicatat)
    if (cekAksesAksiPeserta(modul.pertemuanId)) {
        return list.find(x => x.pesertaId === Number(pesertaId) && x.modulId === modul.id) || null;
    }
    let p = list.find(x => x.pesertaId === Number(pesertaId) && x.modulId === modul.id);
    if (p && p.status === 'Selesai' && status !== 'Selesai') {
        return p;   // membuka ulang modul yang sudah selesai tidak menurunkan statusnya
    }
    if (!p) {
        p = { id: nextIdKoleksi(list), pesertaId: Number(pesertaId), modulId: modul.id, kelasId: modul.kelasId, status, dibuka: waktuSekarang(), selesai: null };
        list.push(p);
    }
    p.status = status;
    if (status === 'Selesai') {
        p.selesai = waktuSekarang();
    }
    writeKoleksi('progresmodul', list);
    return p;
}

// ---- Hasil awal (keputusan pemilik): peserta selain akun demo Budi (pesertaId 1) sudah mengerjakan
// Pertemuan yang Selesai (P1–P2) dan sebagian Pertemuan Berjalan (P3, peserta ber-ID genap).
// Nilai kuis & tugas awal disusun agar rata-ratanya sama dengan nilai awal → Rekap Nilai tidak berubah.
const PESERTA_DEMO_ID = 1;

// n nilai bulat yang rata-ratanya tepat "dasar" (selisih simetris), dalam rentang 0–100
function sebaranNilai(dasar, n, seed) {
    const d = Math.min(1 + (seed % 4), 100 - dasar, dasar);
    const hasil = Array(n).fill(dasar);
    // Pasangan dari depan & belakang: +d dan −d, sehingga jumlahnya tetap n × dasar
    for (let i = 0; i < Math.floor(n / 2); i++) {
        hasil[i] = dasar + d;
        hasil[n - 1 - i] = dasar - d;
    }
    return hasil;
}

function buatHasilAwal() {
    const kelasAda = getKelasTersimpan();
    const peserta = getKoleksi('peserta');
    const nilai = getKoleksi('nilai');
    const pertemuan = getKoleksi('pertemuan');
    const evaluasi = getKoleksi('evaluasi');
    const kuis = getKoleksi('kuis');
    const tugas = getKoleksi('tugas');
    const list = [];
    const jam = (id, tambah) => `${String(9 + ((id + tambah) % 8)).padStart(2, '0')}:${String((id * 7 + tambah * 13) % 60).padStart(2, '0')}`;

    peserta.forEach(p => {
        const n = nilai.find(x => x.pesertaId === p.id && x.kelasId === p.kelasId);
        if (p.id === PESERTA_DEMO_ID || !n || !kelasAda.some(k => k.id === p.kelasId)) {
            return;
        }
        const dikerjakan = pertemuan.filter(pt => pt.kelasId === p.kelasId &&
            (pt.status === 'Selesai' || (pt.status === 'Berjalan' && p.id % 2 === 0)));
        dikerjakan.forEach(pt => {
            const waktu = `${pt.tanggal}T${jam(p.id, pt.nomor)}`;
            evaluasi.filter(e => e.pertemuanId === pt.id && e.status === 'Aktif').forEach(e => {
                const total = e.jenis === 'aktivitas' ? jumlahButirAktivitas(e) : e.soal.length;
                const target = Math.max(40, Math.min(100, n.kuis + ((p.id + e.id) % 11) - 6));
                const benar = Math.round((target / 100) * total);
                list.push({
                    id: list.length + 1, pesertaId: p.id, kelasId: p.kelasId, pertemuanId: pt.id, jenis: e.jenis, itemId: e.id,
                    status: 'Selesai', mulai: waktu, selesai: waktu, durasi: e.durasi, soal: null, jawaban: null,
                    benar, salah: total - benar, kosong: 0, total, skor: Math.round((benar / total) * 100), percobaan: 1, awal: true,
                });
            });
        });
        // Kuis & tugas hanya untuk pertemuan yang sudah Selesai
        const selesai = dikerjakan.filter(pt => pt.status === 'Selesai').map(pt => pt.id);
        const kuisSelesai = kuis.filter(k => selesai.includes(k.pertemuanId) && k.status !== 'Draft');
        sebaranNilai(n.kuis, kuisSelesai.length, p.id).forEach((skor, i) => {
            const k = kuisSelesai[i];
            const pt = pertemuan.find(x => x.id === k.pertemuanId);
            list.push({
                id: list.length + 1, pesertaId: p.id, kelasId: p.kelasId, pertemuanId: k.pertemuanId, jenis: 'kuis', itemId: k.id,
                status: 'Selesai', mulai: `${pt.tanggal}T${jam(p.id, 20 + i)}`, selesai: `${pt.tanggal}T${jam(p.id, 21 + i)}`, durasi: k.durasi,
                soal: null, jawaban: null, benar: null, salah: null, kosong: null, total: k.jumlahSoal, skor, percobaan: 1, awal: true,
            });
        });
        const tugasSelesai = tugas.filter(t => selesai.includes(t.pertemuanId) && t.status !== 'Draft');
        sebaranNilai(n.tugas, tugasSelesai.length, p.id + 3).forEach((nilaiTugasAwal, i) => {
            const t = tugasSelesai[i];
            const tanggal = t.deadline ? t.deadline.slice(0, 10) : pertemuan.find(x => x.id === t.pertemuanId).tanggal;
            list.push({
                id: list.length + 1, pesertaId: p.id, kelasId: p.kelasId, pertemuanId: t.pertemuanId, jenis: 'tugas', itemId: t.id,
                status: 'Dinilai', metode: 'ketik', teks: `Jawaban tugas "${t.judul}" dari ${p.nama}.`, lampiran: null,
                dikumpulkan: `${tambahHari(tanggal, -1)}T${jam(p.id, 30 + i)}`, terlambat: false,
                nilai: nilaiTugasAwal, catatan: '', dinilaiOleh: (kelasAda.find(k => k.id === p.kelasId) || {}).pengajar || null,
                dinilaiPada: `${tanggal}T20:00`, awal: true,
            });
        });
    });
    return list;
}

// ---- Nilai efektif untuk Rekap Nilai (keputusan pemilik: hasil nyata menggantikan nilai awal per komponen) ----
// tugas = rata-rata nilai tugas yang sudah dinilai, kuis = rata-rata skor kuis selesai, pts/pas = skor TO.
// Bila komponen belum punya hasil, dipakai nilai awal (koleksi nilai). Bobot 20/20/30/30 tidak berubah.
const KOMPONEN_NILAI = ['tugas', 'kuis', 'pts', 'pas'];

function getNilaiEfektif(pesertaId, kelasId, hasilList = getAllHasil(), nilaiList = getAllNilai()) {
    const pid = Number(pesertaId);
    const kid = Number(kelasId);
    const dasar = nilaiList.find(n => n.pesertaId === pid && n.kelasId === kid) || null;
    const milik = hasilList.filter(h => h.pesertaId === pid && h.kelasId === kid);
    const rata = angka => (angka.length ? Math.round(angka.reduce((a, b) => a + b, 0) / angka.length) : null);
    const nyata = {
        tugas: rata(milik.filter(h => h.jenis === 'tugas' && h.status === 'Dinilai').map(h => h.nilai)),
        kuis: rata(milik.filter(h => h.jenis === 'kuis' && h.status === 'Selesai').map(h => h.skor)),
        pts: rata(milik.filter(h => h.jenis === 'to' && h.jenisTO === 'PTS' && h.status === 'Selesai').map(h => h.skor)),
        pas: rata(milik.filter(h => h.jenis === 'to' && h.jenisTO === 'PAS' && h.status === 'Selesai').map(h => h.skor)),
    };
    const hasil = { sumber: {} };
    KOMPONEN_NILAI.forEach(k => {
        if (nyata[k] !== null) {
            hasil[k] = nyata[k];
            hasil.sumber[k] = 'hasil';
        } else if (dasar) {
            hasil[k] = dasar[k];
            hasil.sumber[k] = 'awal';
        } else {
            hasil[k] = null;
            hasil.sumber[k] = null;
        }
    });
    if (KOMPONEN_NILAI.every(k => hasil[k] === null)) {
        return null;
    }
    hasil.lengkap = KOMPONEN_NILAI.every(k => hasil[k] !== null);
    return hasil;
}

// ---- Peserta ----

function getAllPeserta() {
    return getKoleksi('peserta');
}

function getPesertaById(id) {
    return getAllPeserta().find(p => p.id === Number(id)) || null;
}

// { kelasId: jumlah peserta }
function hitungPesertaPerKelas() {
    const jumlah = {};
    getAllPeserta().forEach(p => {
        if (p.kelasId !== null && p.kelasId !== undefined) {
            jumlah[p.kelasId] = (jumlah[p.kelasId] || 0) + 1;
        }
    });
    return jumlah;
}

// "" / "none" / null → null (Belum ada kelas), selain itu ID kelas berupa angka
function normalisasiKelasId(value) {
    if (value === null || value === undefined || value === '' || value === 'none') {
        return null;
    }
    return Number(value);
}

function normalisasiPeserta(data) {
    return {
        nama: String(data.nama || '').trim().replace(/\s+/g, ' '),
        email: String(data.email || '').trim().toLowerCase(),
        sekolah: String(data.sekolah || '').trim(),
        kelasId: normalisasiKelasId(data.kelasId),
        status: String(data.status || 'Aktif').trim(),
        gender: GENDER_PESERTA.includes(data.gender) ? data.gender : '',
    };
}

// NIS baru = NIS terbesar + 1
function buatNisBaru(list) {
    const terbesar = list.reduce((max, p) => Math.max(max, Number(p.nis) || 0), 0);
    return String(terbesar ? terbesar + 1 : 20260001);
}

function addPeserta(data) {
    const list = getAllPeserta();
    const baru = { id: nextIdKoleksi(list), nis: buatNisBaru(list), ...normalisasiPeserta(data) };
    list.push(baru);
    writeKoleksi('peserta', list);
    return baru;
}

function updatePeserta(id, data) {
    const list = getAllPeserta();
    const index = list.findIndex(p => p.id === Number(id));
    if (index === -1) {
        return null;
    }
    list[index] = { ...list[index], ...normalisasiPeserta(data) };
    writeKoleksi('peserta', list);
    return list[index];
}

// Hapus peserta: nilai milik peserta itu ikut dihapus (tidak ada nilai tanpa peserta)
function deletePeserta(id) {
    const list = getAllPeserta();
    const sisa = list.filter(p => p.id !== Number(id));
    if (sisa.length === list.length) {
        return false;
    }
    const nilai = getAllNilai();
    if (nilai.some(n => n.pesertaId === Number(id))) {
        writeKoleksi('nilai', nilai.filter(n => n.pesertaId !== Number(id)));
    }
    // Hasil pengerjaan & progres modul milik peserta itu juga ikut dihapus
    ['hasil', 'progresmodul'].forEach(nama => {
        const list = getKoleksi(nama);
        if (list.some(item => item.pesertaId === Number(id))) {
            writeKoleksi(nama, list.filter(item => item.pesertaId !== Number(id)));
        }
    });
    writeKoleksi('peserta', sisa);
    return true;
}

// Validasi data peserta. Mengembalikan { namaField: pesanError }
function validatePeserta(data, currentId = null) {
    const errors = {};
    const nama = String(data.nama || '').trim();
    const email = String(data.email || '').trim().toLowerCase();
    const sekolah = String(data.sekolah || '').trim();
    const peserta = getAllPeserta();

    if (!nama) {
        errors.nama = 'Nama peserta wajib diisi.';
    } else if (nama.length < 3) {
        errors.nama = 'Nama peserta minimal 3 karakter.';
    }

    if (!email) {
        errors.email = 'Email wajib diisi.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Format email tidak valid (contoh: nama@email.com).';
    } else if (peserta.some(p => p.email.toLowerCase() === email && p.id !== Number(currentId))) {
        errors.email = 'Email sudah digunakan peserta lain.';
    }

    if (sekolah.length > 60) {
        errors.sekolah = 'Asal sekolah maksimal 60 karakter.';
    }

    if (data.kelasId === '' || data.kelasId === undefined) {
        errors.kelasId = 'Pilih kelas bimbel atau "Belum ada kelas".';
    } else {
        const kelasId = normalisasiKelasId(data.kelasId);
        if (kelasId !== null) {
            const kelas = getKelasById(kelasId);
            const lama = currentId ? getPesertaById(currentId) : null;
            const sudahDiKelas = lama && lama.kelasId === kelasId;
            if (!kelas) {
                errors.kelasId = 'Kelas tidak ditemukan.';
            } else if (!sudahDiKelas && kelas.peserta >= kelas.kapasitas) {
                errors.kelasId = `Kelas "${kelas.nama}" sudah penuh (${kelas.peserta}/${kelas.kapasitas} peserta).`;
            }
        }
    }

    if (!STATUS_PESERTA.includes(data.status)) {
        errors.status = 'Pilih status peserta.';
    }

    if (data.gender && !GENDER_PESERTA.includes(data.gender)) {
        errors.gender = 'Pilih gender: Laki-laki atau Perempuan.';
    }

    return errors;
}

// ---- Pengajar ----

function getAllPengajar() {
    return getKoleksi('pengajar');
}

function getPengajarById(id) {
    return getAllPengajar().find(p => p.id === Number(id)) || null;
}

// ID pengajar dari ID (angka / teks angka) atau dari nama pengajar. null bila tidak ditemukan.
function cariPengajarId(value, list = getAllPengajar()) {
    if (value === null || value === undefined || String(value).trim() === '') {
        return null;
    }
    const teks = String(value).trim();
    const byId = /^\d+$/.test(teks) ? list.find(p => p.id === Number(teks)) : null;
    if (byId) {
        return byId.id;
    }
    const byNama = list.find(p => p.nama.toLowerCase() === teks.toLowerCase());
    return byNama ? byNama.id : null;
}

// "Andi Saputra" + "S.Pd." → "Andi Saputra, S.Pd."
function namaLengkapPengajar(pengajar) {
    return pengajar.gelar ? `${pengajar.nama}, ${pengajar.gelar}` : pengajar.nama;
}

// Kelas yang diampu setiap pengajar: { pengajarId: [kelas, ...] }
function getKelasPerPengajar(kelasList = getAllKelas()) {
    const hasil = {};
    kelasList.forEach(kelas => {
        if (kelas.pengajarId !== null && kelas.pengajarId !== undefined) {
            (hasil[kelas.pengajarId] = hasil[kelas.pengajarId] || []).push(kelas);
        }
    });
    return hasil;
}

function normalisasiPengajar(data) {
    return {
        nama: String(data.nama || '').trim().replace(/\s+/g, ' '),
        gelar: String(data.gelar || '').trim(),
        nip: String(data.nip || '').trim().replace(/\s+/g, ' '),
        email: String(data.email || '').trim().toLowerCase(),
        mapel: String(data.mapel || '').trim(),
        status: String(data.status || 'Aktif').trim(),
    };
}

// Kode pengajar baru: PGJ-001, PGJ-002, ...
function buatKodePengajar(id) {
    return `PGJ-${String(id).padStart(3, '0')}`;
}

function addPengajar(data) {
    const list = getAllPengajar();
    const id = nextIdKoleksi(list);
    const baru = { id, kode: buatKodePengajar(id), ...normalisasiPengajar(data) };
    list.push(baru);
    writeKoleksi('pengajar', list);
    return baru;
}

function updatePengajar(id, data) {
    const list = getAllPengajar();
    const index = list.findIndex(p => p.id === Number(id));
    if (index === -1) {
        return null;
    }
    list[index] = { ...list[index], ...normalisasiPengajar(data) };
    writeKoleksi('pengajar', list);
    return list[index];
}

// Pengajar yang masih mengampu kelas tidak boleh dihapus (kelas tidak boleh kehilangan pengajarnya)
function deletePengajar(id) {
    const list = getAllPengajar();
    const pengajar = list.find(p => p.id === Number(id));
    if (!pengajar || (getKelasPerPengajar()[pengajar.id] || []).length) {
        return false;
    }
    writeKoleksi('pengajar', list.filter(p => p.id !== pengajar.id));
    return true;
}

function validatePengajar(data, currentId = null) {
    const errors = {};
    const nama = String(data.nama || '').trim().replace(/\s+/g, ' ');
    const email = String(data.email || '').trim().toLowerCase();
    const nip = String(data.nip || '').trim();
    const lain = getAllPengajar().filter(p => p.id !== Number(currentId));

    if (!nama) {
        errors.nama = 'Nama pengajar wajib diisi.';
    } else if (nama.length < 3) {
        errors.nama = 'Nama pengajar minimal 3 karakter.';
    } else if (lain.some(p => p.nama.toLowerCase() === nama.toLowerCase())) {
        errors.nama = 'Nama pengajar sudah terdaftar.';
    }

    if (String(data.gelar || '').trim().length > 20) {
        errors.gelar = 'Gelar maksimal 20 karakter.';
    }

    if (nip) {
        const angka = nip.replace(/\s+/g, '');
        if (!/^\d{18}$/.test(angka)) {
            errors.nip = 'NIP harus berisi 18 digit angka (spasi boleh).';
        } else if (lain.some(p => String(p.nip || '').replace(/\s+/g, '') === angka)) {
            errors.nip = 'NIP sudah digunakan pengajar lain.';
        }
    }

    if (!email) {
        errors.email = 'Email wajib diisi.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Format email tidak valid (contoh: nama@dellearn.id).';
    } else if (lain.some(p => p.email.toLowerCase() === email)) {
        errors.email = 'Email sudah digunakan pengajar lain.';
    }

    if (!MAPEL_OPTIONS.some(m => m.nama === data.mapel)) {
        errors.mapel = 'Pilih mata pelajaran.';
    }

    if (!STATUS_PENGAJAR.includes(data.status)) {
        errors.status = 'Pilih status pengajar.';
    } else if (data.status === 'Tidak Aktif' && currentId !== null) {
        const aktif = (getKelasPerPengajar()[Number(currentId)] || []).filter(k => k.status === 'Aktif');
        if (aktif.length) {
            errors.status = `Pengajar masih mengampu ${aktif.length} kelas aktif. Ganti pengajar kelas tersebut di Data Kelas terlebih dahulu.`;
        }
    }

    return errors;
}

// ---- Pertemuan ----

function getAllPertemuan() {
    return getKoleksi('pertemuan');
}

function getPertemuanById(id) {
    return dalamKelasTerlihat(getAllPertemuan().find(p => p.id === Number(id)));
}

// Pertemuan satu kelas, urut nomor pertemuan
function getPertemuanByKelas(kelasId) {
    return getAllPertemuan()
        .filter(p => p.kelasId === Number(kelasId))
        .sort((a, b) => a.nomor - b.nomor);
}

function normalisasiPertemuan(data) {
    const pilihan = Array.isArray(data.komponen) ? data.komponen : [];
    return {
        kelasId: Number(data.kelasId),
        nomor: Number(data.nomor),
        judul: String(data.judul || '').trim().replace(/\s+/g, ' '),
        tanggal: String(data.tanggal || '').trim(),
        status: String(data.status || 'Belum Dimulai').trim(),
        // Akses peserta: 'otomatis' = status mengikuti jadwal (tanggal); 'manual' = status di atas dipakai (override)
        modeAkses: MODE_AKSES_PERTEMUAN[data.modeAkses] ? data.modeAkses : 'otomatis',
        // Disimpan sesuai urutan baku komponen
        komponen: KOMPONEN_PERTEMUAN.map(k => k.key).filter(key => pilihan.includes(key)),
    };
}

function addPertemuan(data) {
    const list = getAllPertemuan();
    const baru = { id: nextIdKoleksi(list), ...normalisasiPertemuan(data) };
    list.push(baru);
    writeKoleksi('pertemuan', list);
    return baru;
}

function updatePertemuan(id, data) {
    const list = getAllPertemuan();
    const index = list.findIndex(p => p.id === Number(id));
    if (index === -1) {
        return null;
    }
    list[index] = { ...list[index], ...normalisasiPertemuan({ modeAkses: list[index].modeAkses, ...data }) };
    writeKoleksi('pertemuan', list);
    return list[index];
}

function deletePertemuan(id) {
    const list = getAllPertemuan();
    const sisa = list.filter(p => p.id !== Number(id));
    if (sisa.length === list.length) {
        return false;
    }
    lepasDariPertemuan(Number(id));
    writeKoleksi('pertemuan', sisa);
    return true;
}

// ---- Akses Pertemuan berdasarkan jadwal (+ override manual Admin/Pengajar) ----
// Tanggal pertemuan yang tersimpan = TANGGAL MULAI (tidak pernah diubah oleh sistem).
// Tanggal selesai = 1 hari sebelum pertemuan berikutnya di kelas yang sama, maksimal 7 hari (1 pertemuan = 1 minggu;
// jeda TO PTS/PAS tidak memperpanjang pertemuan). Pertemuan terakhir: 1 minggu.
// Status efektif (dipakai seluruh aplikasi):
//   modeAkses 'otomatis' → dihitung dari hari ini: sebelum mulai "Belum Dimulai", mulai–selesai "Berjalan", sesudahnya "Selesai"
//   modeAkses 'manual'   → status yang dipilih Admin/Pengajar (mis. "Berjalan" untuk membuka kembali)
// Hanya status "Berjalan" yang mengizinkan attempt/submit baru; "Selesai" = read-only (hasil lama tetap terlihat).
const MODE_AKSES_PERTEMUAN = { otomatis: 'Otomatis (ikut jadwal)', manual: 'Manual (override)' };
const DURASI_PERTEMUAN_HARI = 7;

// Tanggal hari ini (zona waktu perangkat) "YYYY-MM-DD"
function hariIni() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// { mulai, selesai } dari tanggal tersimpan; null bila tanggal tidak valid
function jadwalPertemuan(p, list = getAllPertemuan()) {
    if (!p || !tanggalValid(p.tanggal)) {
        return null;
    }
    const berikut = list.filter(x => x.kelasId === p.kelasId && x.id !== p.id && tanggalValid(x.tanggal) && x.tanggal > p.tanggal)
        .sort((a, b) => a.tanggal.localeCompare(b.tanggal))[0];
    const maks = tambahHari(p.tanggal, DURASI_PERTEMUAN_HARI - 1);
    const sebelumBerikut = berikut ? tambahHari(berikut.tanggal, -1) : maks;
    return { mulai: p.tanggal, selesai: sebelumBerikut < maks ? sebelumBerikut : maks };
}

function statusOtomatisPertemuan(p, hari = hariIni(), list = getAllPertemuan()) {
    const j = jadwalPertemuan(p, list);
    if (!j) {
        return STATUS_PERTEMUAN.includes(p && p.status) ? p.status : 'Belum Dimulai';
    }
    return hari < j.mulai ? 'Belum Dimulai' : hari <= j.selesai ? 'Berjalan' : 'Selesai';
}

// Status efektif pertemuan (otomatis atau override manual)
function statusPertemuan(p, hari = hariIni(), list = getAllPertemuan()) {
    if (!p) {
        return null;
    }
    return p.modeAkses === 'manual' && STATUS_PERTEMUAN.includes(p.status) ? p.status : statusOtomatisPertemuan(p, hari, list);
}

// "5 – 11 September 2026"
function formatRentangJadwal(j) {
    return j ? `${formatTanggal(j.mulai)} – ${formatTanggal(j.selesai)}` : '–';
}

// Akses peserta ke isi sebuah pertemuan. pertemuanId null (konten tanpa pertemuan) → selalu boleh.
// Hasil { status, boleh, alasan, jadwal, override, pertemuan }
function aksesPertemuan(pertemuanId, list = getAllPertemuan(), hari = hariIni()) {
    if (pertemuanId === null || pertemuanId === undefined) {
        return { status: 'Berjalan', boleh: true, alasan: '', jadwal: null, override: false, pertemuan: null };
    }
    const p = list.find(x => x.id === Number(pertemuanId));
    if (!p) {
        return { status: 'Berjalan', boleh: true, alasan: '', jadwal: null, override: false, pertemuan: null };
    }
    const status = statusPertemuan(p, hari, list);
    const jadwal = jadwalPertemuan(p, list);
    const override = p.modeAkses === 'manual';
    const alasan = status === 'Berjalan' ? ''
        : status === 'Belum Dimulai'
            ? `⏳ Pertemuan ${p.nomor} belum dimulai${jadwal && !override ? ` — dibuka ${formatTanggal(jadwal.mulai)}` : ''}. Belum dapat dikerjakan.`
            : `⏹ Pertemuan ${p.nomor} sudah selesai${jadwal && !override ? ` (${formatTanggal(jadwal.selesai)})` : ''}. Hasil yang sudah ada tetap dapat dilihat; pengerjaan & pengiriman baru ditutup. Hubungi pengajar bila perlu dibuka kembali.`;
    return { status, boleh: status === 'Berjalan', alasan, jadwal, override, pertemuan: p };
}

// Aksi peserta (attempt/submit) hanya boleh saat pertemuan Berjalan. Admin/Pengajar (pratinjau) tidak dibatasi.
// Hasil '' bila boleh, atau alasan penolakan. Selalu membaca data & tanggal TERBARU.
function cekAksesAksiPeserta(pertemuanId) {
    const user = getCurrentUser();
    if (user && user.role !== 'peserta') {
        return '';
    }
    const a = aksesPertemuan(pertemuanId);
    return a.boleh ? '' : a.alasan;
}

// Admin/Pengajar: buka kembali / tutup (override manual) atau kembali ke mode otomatis. Tanggal tidak diubah.
// mode 'otomatis' | 'manual'; status (untuk manual) salah satu STATUS_PERTEMUAN. Hasil { ok, pertemuan } / { ok: false, pesan }
function aturAksesPertemuan(id, mode, status = null) {
    const user = getCurrentUser();
    if (user && user.role === 'peserta') {
        return { ok: false, pesan: PESAN_TANPA_AKSES };
    }
    const p = getPertemuanById(id);
    if (!p) {
        return { ok: false, pesan: 'Pertemuan tidak ditemukan atau bukan kelas yang Anda ampu.' };
    }
    if (!MODE_AKSES_PERTEMUAN[mode] || (mode === 'manual' && !STATUS_PERTEMUAN.includes(status))) {
        return { ok: false, pesan: 'Pilih mode akses dan status yang valid.' };
    }
    const list = getAllPertemuan();
    const item = list.find(x => x.id === p.id);
    item.modeAkses = mode;
    if (mode === 'manual') {
        item.status = status;
    }
    writeKoleksi('pertemuan', list);
    return { ok: true, pertemuan: item };
}

// "2026-09-05" valid? (format & tanggal benar-benar ada)
function tanggalValid(teks) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(teks))) {
        return false;
    }
    return tambahHari(teks, 0) === teks;
}

function validatePertemuan(data, currentId = null) {
    const errors = {};
    const kelas = getKelasById(data.kelasId);
    const nomorRaw = String(data.nomor ?? '').trim();
    const nomor = Number(nomorRaw);
    const judul = String(data.judul || '').trim();
    const komponen = Array.isArray(data.komponen) ? data.komponen : [];

    if (!kelas) {
        errors.kelasId = 'Pilih kelas.';
    }

    if (nomorRaw === '') {
        errors.nomor = 'Nomor pertemuan wajib diisi.';
    } else if (!Number.isInteger(nomor) || nomor < 1 || nomor > 30) {
        errors.nomor = 'Nomor pertemuan harus bilangan bulat 1–30.';
    } else if (kelas && getPertemuanByKelas(kelas.id).some(p => p.nomor === nomor && p.id !== Number(currentId))) {
        errors.nomor = `Pertemuan ${nomor} sudah ada di kelas ${kelas.nama}.`;
    }

    if (!judul) {
        errors.judul = 'Topik pertemuan wajib diisi.';
    } else if (judul.length < 3) {
        errors.judul = 'Topik pertemuan minimal 3 karakter.';
    } else if (judul.length > 80) {
        errors.judul = 'Topik pertemuan maksimal 80 karakter.';
    }

    if (!String(data.tanggal || '').trim()) {
        errors.tanggal = 'Tanggal pertemuan wajib diisi.';
    } else if (!tanggalValid(data.tanggal)) {
        errors.tanggal = 'Tanggal tidak valid.';
    }

    if (data.modeAkses !== undefined && !MODE_AKSES_PERTEMUAN[data.modeAkses]) {
        errors.modeAkses = 'Pilih mode akses.';
    }
    // Mode otomatis: status mengikuti jadwal (isian status hanya dipakai saat override manual)
    if (!STATUS_PERTEMUAN.includes(data.status)) {
        errors.status = 'Pilih status pertemuan.';
    } else if (data.modeAkses !== 'otomatis' && data.status === 'Selesai' && komponen.length < KOMPONEN_PERTEMUAN.length) {
        errors.komponen = 'Pertemuan berstatus Selesai harus memiliki kelima komponen (Pretest sampai Kuis).';
    }

    return errors;
}

// ---- Modul ----

function getAllModul() {
    return getKoleksi('modul');
}

function getModulById(id) {
    return dalamKelasTerlihat(getAllModul().find(m => m.id === Number(id)));
}

// Ukuran file → "1,2 MB" / "350 KB"
function formatUkuran(bytes) {
    const n = Number(bytes) || 0;
    if (n >= 1024 * 1024) {
        return `${(n / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`;
    }
    return `${Math.max(1, Math.round(n / 1024))} KB`;
}

// file  (Upload PDF)   : { nama, ukuran, data? } — data = isi PDF (data URL) agar dapat dibuka peserta;
//                        modul lama hanya mencatat nama & ukuran.
// gambar (Tulis Materi): { nama, ukuran, data, keterangan } | null — gambar pendukung materi.
function normalisasiModul(data) {
    const format = String(data.format || '').trim();
    const pdf = format === 'Upload PDF';
    const file = data.file && data.file.nama
        ? { nama: String(data.file.nama), ukuran: Number(data.file.ukuran) || 0, ...(data.file.data ? { data: normalisasiDataUrlPdf(data.file.data) } : {}) }
        : null;
    const gambar = data.gambar && data.gambar.data
        ? {
            nama: String(data.gambar.nama || 'gambar'),
            ukuran: Number(data.gambar.ukuran) || 0,
            data: String(data.gambar.data),
            keterangan: String(data.gambar.keterangan || '').trim(),
        }
        : null;
    return {
        kelasId: Number(data.kelasId),
        pertemuanId: data.pertemuanId === null || data.pertemuanId === '' || data.pertemuanId === undefined ? null : Number(data.pertemuanId),
        judul: String(data.judul || '').trim().replace(/\s+/g, ' '),
        deskripsi: String(data.deskripsi || '').trim(),
        format,
        // Hanya data sesuai format yang disimpan. Tulis Materi: isi (baris "## " = subjudul), contoh & rangkuman (opsional)
        isi: pdf ? '' : String(data.isi || '').trim(),
        contoh: pdf ? '' : String(data.contoh || '').trim(),
        rangkuman: pdf ? '' : String(data.rangkuman || '').trim(),
        file: pdf ? file : null,
        gambar: pdf ? null : gambar,
        status: String(data.status || 'Aktif').trim(),
    };
}

// Hasil null bila penyimpanan browser penuh (lihat PESAN_PENYIMPANAN_PENUH)
function addModul(data) {
    const list = getAllModul();
    const baru = { id: nextIdKoleksi(list), ...normalisasiModul(data) };
    list.push(baru);
    if (!writeKoleksi('modul', list)) {
        return null;
    }
    return baru;
}

function updateModul(id, data) {
    const list = getAllModul();
    const index = list.findIndex(m => m.id === Number(id));
    if (index === -1) {
        return null;
    }
    list[index] = { ...list[index], ...normalisasiModul(data) };
    if (!writeKoleksi('modul', list)) {
        return null;
    }
    return list[index];
}

function deleteModul(id) {
    const list = getAllModul();
    const sisa = list.filter(m => m.id !== Number(id));
    if (sisa.length === list.length) {
        return false;
    }
    hapusHasilItem('modul', id);
    writeKoleksi('modul', sisa);
    return true;
}

function validateModul(data, currentId = null) {
    const errors = {};
    const judul = String(data.judul || '').trim();
    const deskripsi = String(data.deskripsi || '').trim();
    const kelas = getKelasById(data.kelasId);

    if (!judul) {
        errors.judul = 'Judul modul wajib diisi.';
    } else if (judul.length < 3) {
        errors.judul = 'Judul modul minimal 3 karakter.';
    } else if (judul.length > 100) {
        errors.judul = 'Judul modul maksimal 100 karakter.';
    } else if (kelas && getAllModul().some(m => m.kelasId === kelas.id && m.id !== Number(currentId) && m.judul.toLowerCase() === judul.toLowerCase())) {
        errors.judul = 'Judul modul sudah digunakan di kelas ini.';
    }

    if (!kelas) {
        errors.kelasId = 'Pilih kelas.';
    }

    const pertemuan = data.pertemuanId ? getPertemuanById(data.pertemuanId) : null;
    if (!pertemuan) {
        errors.pertemuanId = 'Pilih pertemuan.';
    } else if (kelas && pertemuan.kelasId !== kelas.id) {
        errors.pertemuanId = 'Pertemuan tidak termasuk kelas yang dipilih.';
    }

    if (!deskripsi) {
        errors.deskripsi = 'Deskripsi wajib diisi.';
    } else if (deskripsi.length < 10) {
        errors.deskripsi = 'Deskripsi minimal 10 karakter.';
    } else if (deskripsi.length > 300) {
        errors.deskripsi = 'Deskripsi maksimal 300 karakter.';
    }

    if (!FORMAT_MODUL.includes(data.format)) {
        errors.format = 'Pilih format modul.';
    } else if (data.format === 'Tulis Materi') {
        if (String(data.isi || '').trim().length < 20) {
            errors.isi = 'Isi materi wajib diisi (minimal 20 karakter).';
        }
        if (String(data.contoh || '').trim().length > 2000) {
            errors.contoh = 'Contoh maksimal 2000 karakter.';
        }
        if (String(data.rangkuman || '').trim().length > 1000) {
            errors.rangkuman = 'Rangkuman maksimal 1000 karakter.';
        }
        // Gambar pendukung (opsional)
        const g = data.gambar;
        if (g && g.data) {
            if (!EKSTENSI_GAMBAR.includes(ekstensiFile(g.nama))) {
                errors.gambar = `Gambar harus berformat ${EKSTENSI_GAMBAR.join(', ').toUpperCase()}.`;
            } else if (Number(g.ukuran) > BATAS_GAMBAR_KB * 1024) {
                errors.gambar = `Ukuran gambar maksimal ${BATAS_GAMBAR_KB} KB agar dapat disimpan di browser.`;
            } else if (String(g.keterangan || '').trim().length > 150) {
                errors.gambar = 'Keterangan gambar maksimal 150 karakter.';
            }
        }
    } else {
        const file = data.file;
        if (!file || !file.nama) {
            errors.file = 'Pilih file PDF.';
        } else if (!/\.pdf$/i.test(file.nama)) {
            errors.file = 'File harus berformat PDF (.pdf).';
        } else if (Number(file.ukuran) > BATAS_PDF_MB * 1024 * 1024) {
            errors.file = `Ukuran file maksimal ${BATAS_PDF_MB} MB.`;
        } else if (file.data && Number(file.ukuran) > BATAS_SIMPAN_PDF_KB * 1024) {
            errors.file = `Ukuran PDF maksimal ${BATAS_SIMPAN_PDF_KB / 1024} MB agar dapat disimpan dan dibuka peserta.`;
        } else if (file.data && !bytesPdfValid(bytesDariDataUrl(file.data))) {
            errors.file = 'File ini bukan PDF yang valid (isi file rusak atau bukan dokumen PDF).';
        }
    }

    if (!STATUS_MODUL.includes(data.status)) {
        errors.status = 'Pilih status modul.';
    }

    return errors;
}

// ---- Tugas ----

function getAllTugas() {
    return getKoleksi('tugas');
}

function getTugasById(id) {
    return dalamKelasTerlihat(getAllTugas().find(t => t.id === Number(id)));
}

// "2026-09-11T23:59" valid? (tanggal ada, jam 00–23, menit 00–59)
function deadlineValid(teks) {
    const cocok = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})$/.exec(String(teks));
    return Boolean(cocok) && tanggalValid(cocok[1]) && Number(cocok[2]) < 24 && Number(cocok[3]) < 60;
}

// "2026-09-11T23:59" → "11 September 2026, 23:59 WIB"
function formatDeadline(teks) {
    if (!deadlineValid(teks)) {
        return '–';
    }
    const [tanggal, jam] = teks.split('T');
    return `${formatTanggal(tanggal)}, ${jam} WIB`;
}

// File (lampiran lama, dokumentasi soal tugas, file jawaban peserta): { nama, ukuran, tipe, data? | fileId? }
//   data   = data URL (file kecil lama / data awal, tersimpan di localStorage)
//   fileId = isi file disimpan di IndexedDB browser (lihat bagian "File tugas") — localStorage hanya menyimpan data ringkas
// Bila keduanya tidak ada, hanya nama file yang tercatat.
function normalisasiLampiran(file) {
    if (!file || !file.nama) {
        return null;
    }
    return {
        nama: String(file.nama),
        ukuran: Number(file.ukuran) || 0,
        tipe: String(file.tipe || file.mime || ''),
        ...(file.data ? { data: String(file.data) } : {}),
        ...(file.fileId ? { fileId: String(file.fileId) } : {}),
    };
}

// ---- File tugas: isi file di IndexedDB (kapasitas besar), data ringkas di localStorage ----
// localStorage hanya ±5 MB untuk SELURUH data DelLearn, sehingga file sampai 10 MB tidak mungkin disimpan di sana.
// Bila IndexedDB tidak tersedia (mis. mode privat tertentu), file kecil (≤ 900 KB) disimpan sebagai data URL;
// file lebih besar ditolak dengan pesan yang jelas (aplikasi tidak crash).
const BATAS_FILE_TUGAS_MB = 10;
const EKSTENSI_SOAL_TUGAS = ['pdf', 'jpg', 'jpeg', 'png'];
const EKSTENSI_JAWABAN_TUGAS = ['pdf', 'jpg', 'jpeg', 'png', 'docx'];
const BATAS_FILE_TANPA_DB_KB = 900;
const FILE_DB_NAMA = 'dellearn.files';
const FILE_DB_STORE = 'files';
const MIME_FILE = { pdf: 'application/pdf', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', svg: 'image/svg+xml',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };

// Validasi file tugas. jenis 'soal' (dokumentasi soal: PDF/JPG/JPEG/PNG, opsional) atau 'jawaban' (PDF/JPG/JPEG/PNG/DOCX, wajib).
// butuhIsi = false untuk pemeriksaan sebelum file dibaca/disimpan (hanya nama & ukuran). Hasil '' bila valid.
function validateFileTugas(file, jenis = 'jawaban', { butuhIsi = true } = {}) {
    if (!file || !file.nama) {
        return jenis === 'soal' ? '' : 'Pilih file jawaban terlebih dahulu.';
    }
    const izin = jenis === 'soal' ? EKSTENSI_SOAL_TUGAS : EKSTENSI_JAWABAN_TUGAS;
    const ext = ekstensiFile(file.nama);
    if (!izin.includes(ext)) {
        return `Format .${ext || '?'} tidak didukung. Gunakan ${jenis === 'soal' ? 'PDF, JPG, JPEG, atau PNG' : 'PDF, JPG, JPEG, PNG, atau DOCX'}.`;
    }
    const ukuran = Number(file.ukuran) || 0;
    if (ukuran <= 0) {
        return 'File kosong. Pilih file lain.';
    }
    if (ukuran > BATAS_FILE_TUGAS_MB * 1024 * 1024) {
        return `Ukuran file maksimal ${BATAS_FILE_TUGAS_MB} MB (file ini ${formatUkuran(ukuran)}).`;
    }
    if (butuhIsi && !file.data && !file.fileId) {
        return 'Isi file belum tersimpan. Pilih ulang file.';
    }
    return '';
}

function samaFile(a, b) {
    return Boolean(a && b) && a.nama === b.nama && (a.fileId || a.data || '') === (b.fileId || b.data || '');
}

function bukaDbFile() {
    return new Promise((resolve, reject) => {
        if (typeof indexedDB === 'undefined' || !indexedDB) {
            reject(new Error('IndexedDB tidak tersedia'));
            return;
        }
        // Browser yang memblokir IndexedDB kadang tidak pernah merespons → batas waktu agar aplikasi tidak macet
        const batas = setTimeout(() => reject(new Error('IndexedDB tidak merespons')), 4000);
        const req = indexedDB.open(FILE_DB_NAMA, 1);
        req.onupgradeneeded = () => req.result.createObjectStore(FILE_DB_STORE);
        req.onsuccess = () => {
            clearTimeout(batas);
            resolve(req.result);
        };
        req.onerror = () => {
            clearTimeout(batas);
            reject(req.error);
        };
    });
}

// Simpan file pilihan pengguna. Hasil Promise<{ nama, ukuran, tipe, fileId } | { …, data }>; gagal → Error dengan pesan jelas
async function simpanFileBrowser(file) {
    const meta = { nama: file.name, ukuran: file.size, tipe: file.type || MIME_FILE[ekstensiFile(file.name)] || '' };
    try {
        const db = await bukaDbFile();
        const fileId = `f${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
        await new Promise((resolve, reject) => {
            const tx = db.transaction(FILE_DB_STORE, 'readwrite');
            tx.objectStore(FILE_DB_STORE).put(file, fileId);
            tx.oncomplete = resolve;
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(tx.error || new Error('Penyimpanan file dibatalkan browser.'));
        });
        db.close();
        return { ...meta, fileId };
    } catch (error) {
        if (file.size > BATAS_FILE_TANPA_DB_KB * 1024) {
            throw new Error(`File tidak dapat disimpan: penyimpanan file browser tidak tersedia atau penuh. Tanpa penyimpanan file, maksimal ${BATAS_FILE_TANPA_DB_KB} KB.`);
        }
        const f = await bacaFileDataUrl(file);
        return { ...meta, data: f.data };
    }
}

// Isi file sebagai Blob (dari data URL atau IndexedDB); null bila tidak ditemukan
async function ambilFileBrowser(file) {
    if (!file) {
        return null;
    }
    if (file.data) {
        const res = await fetch(file.data);
        return res.blob();
    }
    if (!file.fileId) {
        return null;
    }
    const db = await bukaDbFile();
    const blob = await new Promise((resolve, reject) => {
        const req = db.transaction(FILE_DB_STORE).objectStore(FILE_DB_STORE).get(file.fileId);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
    });
    db.close();
    return blob;
}

// Hapus isi file di IndexedDB (dipakai saat file diganti/dihapus); file data URL cukup dilepas dari datanya
function hapusFileBrowser(file) {
    if (!file || !file.fileId || typeof indexedDB === 'undefined') {
        return;
    }
    bukaDbFile().then(db => {
        const tx = db.transaction(FILE_DB_STORE, 'readwrite');
        tx.objectStore(FILE_DB_STORE).delete(file.fileId);
        tx.oncomplete = () => db.close();
    }).catch(() => {});
}

// Tugas: metode pengumpulan & soal. Soal = teks dan/atau dokumentasi (fileSoal) — minimal salah satu.
function normalisasiTugas(data) {
    return {
        kelasId: Number(data.kelasId),
        pertemuanId: data.pertemuanId === null || data.pertemuanId === '' || data.pertemuanId === undefined ? null : Number(data.pertemuanId),
        judul: String(data.judul || '').trim().replace(/\s+/g, ' '),
        deskripsi: String(data.deskripsi || '').trim(),
        soal: String(data.soal || '').trim(),
        fileSoal: normalisasiLampiran(data.fileSoal),
        metode: METODE_TUGAS[data.metode] ? data.metode : 'keduanya',
        deadline: String(data.deadline || '').trim(),
        status: String(data.status || 'Draft').trim(),
    };
}

function addTugas(data) {
    const list = getAllTugas();
    const baru = { id: nextIdKoleksi(list), ...normalisasiTugas(data) };
    list.push(baru);
    if (!writeKoleksi('tugas', list)) {
        return null;
    }
    return baru;
}

function updateTugas(id, data) {
    const list = getAllTugas();
    const index = list.findIndex(t => t.id === Number(id));
    if (index === -1) {
        return null;
    }
    // Dokumentasi soal lama tetap ada bila form tidak mengirim isian fileSoal (fileSoal: null = dihapus)
    list[index] = { ...list[index], ...normalisasiTugas({ ...list[index], ...data }) };
    if (!writeKoleksi('tugas', list)) {
        return null;
    }
    return list[index];
}

// Validasi lampiran (tugas). Hasil: pesan error atau ''
function validateLampiran(file, label = 'Lampiran') {
    if (!file) {
        return '';
    }
    if (!file.nama) {
        return `${label} tidak valid.`;
    }
    if (!EKSTENSI_LAMPIRAN.includes(ekstensiFile(file.nama))) {
        return `${label} harus berformat ${EKSTENSI_LAMPIRAN.join(', ').toUpperCase()}.`;
    }
    if (Number(file.ukuran) > BATAS_LAMPIRAN_KB * 1024) {
        return `Ukuran ${label.toLowerCase()} maksimal ${BATAS_LAMPIRAN_KB} KB agar dapat disimpan di browser.`;
    }
    return '';
}

function deleteTugas(id) {
    const list = getAllTugas();
    const sisa = list.filter(t => t.id !== Number(id));
    if (sisa.length === list.length) {
        return false;
    }
    hapusHasilItem('tugas', id);
    writeKoleksi('tugas', sisa);
    return true;
}

function validateTugas(data, currentId = null) {
    const errors = {};
    const judul = String(data.judul || '').trim();
    const deskripsi = String(data.deskripsi || '').trim();
    const kelas = getKelasById(data.kelasId);

    if (!judul) {
        errors.judul = 'Judul tugas wajib diisi.';
    } else if (judul.length < 3) {
        errors.judul = 'Judul tugas minimal 3 karakter.';
    } else if (judul.length > 100) {
        errors.judul = 'Judul tugas maksimal 100 karakter.';
    } else if (kelas && getAllTugas().some(t => t.kelasId === kelas.id && t.id !== Number(currentId) && t.judul.toLowerCase() === judul.toLowerCase())) {
        errors.judul = 'Judul tugas sudah digunakan di kelas ini.';
    }

    if (!kelas) {
        errors.kelasId = 'Pilih kelas.';
    }

    const pertemuan = data.pertemuanId ? getPertemuanById(data.pertemuanId) : null;
    if (!pertemuan) {
        errors.pertemuanId = 'Pilih pertemuan.';
    } else if (kelas && pertemuan.kelasId !== kelas.id) {
        errors.pertemuanId = 'Pertemuan tidak termasuk kelas yang dipilih.';
    }

    if (!deskripsi) {
        errors.deskripsi = 'Deskripsi tugas wajib diisi.';
    } else if (deskripsi.length < 10) {
        errors.deskripsi = 'Deskripsi minimal 10 karakter.';
    } else if (deskripsi.length > 500) {
        errors.deskripsi = 'Deskripsi maksimal 500 karakter.';
    }

    if (!String(data.deadline || '').trim()) {
        errors.deadline = 'Deadline wajib diisi.';
    } else if (!deadlineValid(data.deadline)) {
        errors.deadline = 'Deadline tidak valid (isi tanggal dan jam).';
    } else if (pertemuan && data.deadline.slice(0, 10) < pertemuan.tanggal) {
        // Tugas diberikan saat pertemuan → tenggat tidak boleh sebelum tanggal pertemuan
        errors.deadline = `Deadline tidak boleh sebelum tanggal pertemuan (${formatTanggal(pertemuan.tanggal)}).`;
    }

    if (!STATUS_TUGAS.includes(data.status)) {
        errors.status = 'Pilih status tugas.';
    }

    if (!METODE_TUGAS[data.metode]) {
        errors.metode = 'Pilih metode pengumpulan jawaban.';
    }

    // Soal: teks dan/atau dokumentasi soal (PDF/JPG/JPEG/PNG, maks. 10 MB) — minimal salah satu
    const soal = String(data.soal || '').trim();
    if (soal.length > 3000) {
        errors.soal = 'Soal maksimal 3000 karakter.';
    }
    const lama = currentId !== null ? getAllTugas().find(t => t.id === Number(currentId)) : null;
    // Dokumentasi soal lama yang tidak diganti (mis. lampiran tugas versi lama) tetap diterima
    if (data.fileSoal && !(lama && samaFile(lama.fileSoal, data.fileSoal))) {
        const errFile = validateFileTugas(data.fileSoal, 'soal');
        if (errFile) {
            errors.fileSoal = errFile;
        }
    }
    if (!soal && !data.fileSoal && !errors.soal) {
        errors.soal = 'Isi soal tugas (teks) atau unggah dokumentasi soal (PDF/gambar).';
    }

    return errors;
}

// ---- Kuis ----

function getAllKuis() {
    return getKoleksi('kuis');
}

function getKuisById(id) {
    return dalamKelasTerlihat(getAllKuis().find(k => k.id === Number(id)));
}

// jumlahSoal = jumlah soal yang direncanakan Pengajar (target); soal = soal milik kuis (selalu array)
function normalisasiKuis(data) {
    return {
        kelasId: Number(data.kelasId),
        pertemuanId: data.pertemuanId === null || data.pertemuanId === '' || data.pertemuanId === undefined ? null : Number(data.pertemuanId),
        judul: String(data.judul || '').trim().replace(/\s+/g, ' '),
        deskripsi: String(data.deskripsi || '').trim(),
        jumlahSoal: Number(data.jumlahSoal),
        durasi: Number(data.durasi),
        status: String(data.status || 'Draft').trim(),
        soal: normalisasiSoalList(Array.isArray(data.soal) ? data.soal : []),
    };
}

function addKuis(data) {
    const list = getAllKuis();
    const baru = { id: nextIdKoleksi(list), ...normalisasiKuis(data) };
    list.push(baru);
    writeKoleksi('kuis', list);
    return baru;
}

function updateKuis(id, data) {
    const list = getAllKuis();
    const index = list.findIndex(k => k.id === Number(id));
    if (index === -1) {
        return null;
    }
    // Form info (tanpa soal) tidak menghapus soal yang sudah disusun; jumlah soal tetap mengikuti soal tersebut
    list[index] = { ...list[index], ...normalisasiKuis({ ...list[index], ...data }) };
    writeKoleksi('kuis', list);
    return list[index];
}

function deleteKuis(id) {
    const list = getAllKuis();
    const sisa = list.filter(k => k.id !== Number(id));
    if (sisa.length === list.length) {
        return false;
    }
    hapusHasilItem('kuis', id);
    writeKoleksi('kuis', sisa);
    return true;
}

// Cek bilangan bulat dalam rentang; mengembalikan pesan error atau ''
function cekBilanganBulat(nilai, label, min, max, satuan = '') {
    const teks = String(nilai ?? '').trim();
    const angka = Number(teks);
    if (teks === '') {
        return `${label} wajib diisi.`;
    }
    if (!Number.isInteger(angka)) {
        return `${label} harus berupa bilangan bulat.`;
    }
    if (angka < min || angka > max) {
        return `${label} harus antara ${min}–${max}${satuan}.`;
    }
    return '';
}

function validateKuis(data, currentId = null) {
    const errors = {};
    const judul = String(data.judul || '').trim();
    const kelas = getKelasById(data.kelasId);

    if (!judul) {
        errors.judul = 'Judul kuis wajib diisi.';
    } else if (judul.length < 3) {
        errors.judul = 'Judul kuis minimal 3 karakter.';
    } else if (judul.length > 100) {
        errors.judul = 'Judul kuis maksimal 100 karakter.';
    } else if (kelas && getAllKuis().some(k => k.kelasId === kelas.id && k.id !== Number(currentId) && k.judul.toLowerCase() === judul.toLowerCase())) {
        errors.judul = 'Judul kuis sudah digunakan di kelas ini.';
    }

    if (!kelas) {
        errors.kelasId = 'Pilih kelas.';
    }

    const pertemuan = data.pertemuanId ? getPertemuanById(data.pertemuanId) : null;
    if (!pertemuan) {
        errors.pertemuanId = 'Pilih pertemuan.';
    } else if (kelas && pertemuan.kelasId !== kelas.id) {
        errors.pertemuanId = 'Pertemuan tidak termasuk kelas yang dipilih.';
    }

    if (String(data.deskripsi || '').trim().length > 500) {
        errors.deskripsi = 'Deskripsi maksimal 500 karakter.';
    }

    // Soal kuis dibuat Pengajar (Kelola Soal) — tidak pernah diambil dari Bank Soal.
    // Jumlah Soal = rencana banyak soal; tidak boleh lebih kecil dari soal yang sudah dibuat.
    const lama = currentId !== null ? getAllKuis().find(k => k.id === Number(currentId)) : null;
    const soal = Array.isArray(data.soal) ? data.soal : lama && Array.isArray(lama.soal) ? lama.soal : [];
    const errJumlah = cekBilanganBulat(data.jumlahSoal, 'Jumlah soal', 1, KUIS_SOAL_MAKS, ' soal');
    if (errJumlah) {
        errors.jumlahSoal = errJumlah;
    } else if (Number(data.jumlahSoal) < soal.length) {
        errors.jumlahSoal = `Kuis ini sudah berisi ${soal.length} soal. Jumlah soal tidak boleh kurang dari itu (hapus soal terlebih dahulu lewat Kelola Soal).`;
    }
    if (soal.length) {
        const errSoal = validateSoalList(soal, { bolehJodoh: false });
        if (errSoal) {
            errors.soal = errSoal;
        }
    }
    const durasi = cekBilanganBulat(data.durasi, 'Durasi', 5, 180, ' menit');
    if (durasi) {
        errors.durasi = durasi;
    }

    if (!STATUS_KUIS.includes(data.status)) {
        errors.status = 'Pilih status kuis.';
    } else if (data.status === 'Aktif' && !errors.jumlahSoal && soal.length < Number(data.jumlahSoal)) {
        errors.status = soal.length
            ? `Belum siap diterbitkan: baru ${soal.length} dari ${Number(data.jumlahSoal)} soal. Simpan sebagai Draft, lalu lengkapi soal lewat Kelola Soal.`
            : 'Kuis belum memiliki soal. Simpan sebagai Draft, lalu buat soalnya lewat Kelola Soal.';
    }

    return errors;
}

// ---- Try Out (TO PTS & TO PAS) ----

function getAllTO(jenis = null) {
    const list = getKoleksi('to');
    return jenis ? list.filter(t => t.jenis === jenis) : list;
}

function getTOById(id) {
    return dalamKelasTerlihat(getAllTO().find(t => t.id === Number(id)));
}

// TO PTS / TO PAS milik satu kelas (atau null)
function getTOKelas(kelasId, jenis) {
    return getAllTO(jenis).find(t => t.kelasId === Number(kelasId)) || null;
}

// Pertemuan yang menjadi cakupan & batas jadwal TO:
// PTS → Pertemuan 1–6, PAS → Pertemuan 1–12 (pertemuan tambahan bernomor lebih besar tidak ikut).
// Batas = pertemuan dalam cakupan dengan TANGGAL paling akhir (bukan sekadar nomor terbesar),
// sehingga TO tidak pernah terjadwal sebelum salah satu pertemuan cakupannya.
function getCakupanTO(kelasId, jenis) {
    const batas = JENIS_TO[jenis] ? JENIS_TO[jenis].batasPertemuan : null;
    const dari = JENIS_TO[jenis] ? JENIS_TO[jenis].dariPertemuan : 1;
    const list = getPertemuanByKelas(kelasId).filter(p => batas === null || (p.nomor >= dari && p.nomor <= batas));
    const terakhir = list
        .filter(p => tanggalValid(p.tanggal))
        .reduce((maks, p) => (!maks || p.tanggal > maks.tanggal || (p.tanggal === maks.tanggal && p.nomor > maks.nomor) ? p : maks), null);
    return { pertemuan: list, terakhir };
}

function waktuValid(teks) {
    const cocok = /^(\d{2}):(\d{2})$/.exec(String(teks));
    return Boolean(cocok) && Number(cocok[1]) < 24 && Number(cocok[2]) < 60;
}

function normalisasiTO(data) {
    return {
        jenis: String(data.jenis || '').trim(),
        kelasId: Number(data.kelasId),
        judul: String(data.judul || '').trim().replace(/\s+/g, ' '),
        tanggal: String(data.tanggal || '').trim(),
        waktu: String(data.waktu || '').trim(),
        durasi: Number(data.durasi),
        jumlahSoal: Array.isArray(data.soal) ? data.soal.length : Number(data.jumlahSoal),
        status: String(data.status || 'Draft').trim(),
        // Soal disimpan bila sudah disusun lewat Kelola Soal; TO tanpa "soal" memakai soal dari bank
        ...(Array.isArray(data.soal) ? { soal: normalisasiSoalList(data.soal) } : {}),
    };
}

function addTO(data) {
    const list = getAllTO();
    const baru = { id: nextIdKoleksi(list), ...normalisasiTO(data) };
    list.push(baru);
    writeKoleksi('to', list);
    return baru;
}

function updateTO(id, data) {
    const list = getAllTO();
    const index = list.findIndex(t => t.id === Number(id));
    if (index === -1) {
        return null;
    }
    // Jenis TO tidak berubah saat edit (TO PTS tetap PTS); soal yang sudah disusun tidak hilang saat form info disimpan
    list[index] = { ...list[index], ...normalisasiTO({ ...list[index], ...data, jenis: list[index].jenis }) };
    writeKoleksi('to', list);
    return list[index];
}

function deleteTO(id) {
    const list = getAllTO();
    const sisa = list.filter(t => t.id !== Number(id));
    if (sisa.length === list.length) {
        return false;
    }
    hapusHasilItem('to', id);
    writeKoleksi('to', sisa);
    return true;
}

function validateTO(data, currentId = null) {
    const errors = {};
    const jenis = String(data.jenis || '');
    const judul = String(data.judul || '').trim();
    const kelas = getKelasById(data.kelasId);

    if (!JENIS_TO[jenis]) {
        errors.jenis = 'Jenis TO tidak dikenal.';
        return errors;
    }

    if (!judul) {
        errors.judul = 'Judul TO wajib diisi.';
    } else if (judul.length < 3) {
        errors.judul = 'Judul TO minimal 3 karakter.';
    } else if (judul.length > 100) {
        errors.judul = 'Judul TO maksimal 100 karakter.';
    }

    if (!kelas) {
        errors.kelasId = 'Pilih kelas.';
    } else {
        // Setiap kelas hanya memiliki satu TO PTS dan satu TO PAS
        const ada = getTOKelas(kelas.id, jenis);
        if (ada && ada.id !== Number(currentId)) {
            errors.kelasId = `Kelas ${kelas.nama} sudah memiliki TO ${jenis} ("${ada.judul}").`;
        }
    }

    if (!String(data.tanggal || '').trim()) {
        errors.tanggal = 'Tanggal TO wajib diisi.';
    } else if (!tanggalValid(data.tanggal)) {
        errors.tanggal = 'Tanggal tidak valid.';
    } else if (kelas) {
        const { terakhir } = getCakupanTO(kelas.id, jenis);
        if (terakhir && tanggalValid(terakhir.tanggal) && data.tanggal < terakhir.tanggal) {
            errors.tanggal = `TO ${jenis} tidak boleh sebelum Pertemuan ${terakhir.nomor} (${formatTanggal(terakhir.tanggal)}).`;
        }
    }

    if (!String(data.waktu || '').trim()) {
        errors.waktu = 'Waktu mulai wajib diisi.';
    } else if (!waktuValid(data.waktu)) {
        errors.waktu = 'Waktu mulai tidak valid (format JJ:MM).';
    }

    const durasi = cekBilanganBulat(data.durasi, 'Durasi', 30, 240, ' menit');
    if (durasi) {
        errors.durasi = durasi;
    }
    // TO dengan soal tersusun: jumlah soal = banyaknya soal. TO lama: jumlah soal diketik (soal dari bank).
    const lama = currentId !== null ? getAllTO().find(t => t.id === Number(currentId)) : null;
    const soalTersusun = Array.isArray(data.soal) ? data.soal : lama && Array.isArray(lama.soal) ? lama.soal : null;
    if (soalTersusun) {
        if (data.status !== 'Draft' && (soalTersusun.length < TO_SOAL_MIN || soalTersusun.length > TO_SOAL_MAKS)) {
            errors.status = `TO ${jenis} baru dapat dijadwalkan bila memiliki ${TO_SOAL_MIN}–${TO_SOAL_MAKS} soal (sekarang ${soalTersusun.length}). Lengkapi lewat Kelola Soal atau simpan sebagai Draft.`;
        } else if (soalTersusun.length) {
            const errSoal = validateSoalList(soalTersusun, { bolehJodoh: false });
            if (errSoal) {
                errors.soal = errSoal;
            }
        }
    } else {
        const soal = cekBilanganBulat(data.jumlahSoal, 'Jumlah soal', TO_SOAL_MIN, TO_SOAL_MAKS, ' soal');
        if (soal) {
            errors.jumlahSoal = soal;
        }
    }

    if (!STATUS_TO.includes(data.status)) {
        errors.status = 'Pilih status TO.';
    }

    return errors;
}

// ---- Nilai (laporan; tidak ada CRUD di halaman Rekap Nilai) ----

function getAllNilai() {
    return getKoleksi('nilai');
}

// Baris rekap = peserta yang berada di kelas + nilainya di kelas itu (null bila belum dinilai).
// Nilai = nilai efektif (hasil pengerjaan nyata menggantikan nilai awal per komponen, lihat getNilaiEfektif).
// akhir hanya dihitung bila keempat komponen sudah ada. Nama/NIS/kelas selalu dari data terbaru.
// Filter: kelasId, mapel (dari kelas), cari (nama / NIS).
function getBarisRekap({ kelasId = null, mapel = '', cari = '' } = {}) {
    const kelasMap = Object.fromEntries(getAllKelas().map(k => [k.id, k]));
    const hasilList = getAllHasil();
    const nilaiList = getAllNilai();
    const kata = String(cari).trim().toLowerCase();
    return getAllPeserta()
        .filter(p => kelasMap[p.kelasId])
        .filter(p => kelasId === null || kelasId === '' || p.kelasId === Number(kelasId))
        .filter(p => !mapel || kelasMap[p.kelasId].mapel === mapel)
        .filter(p => !kata || p.nama.toLowerCase().includes(kata) || String(p.nis).includes(kata))
        .map(p => {
            const nilai = getNilaiEfektif(p.id, p.kelasId, hasilList, nilaiList);
            return { peserta: p, kelas: kelasMap[p.kelasId], nilai, akhir: nilai && nilai.lengkap ? hitungNilaiAkhir(nilai) : null };
        });
}

// Ringkasan rekap dari baris yang sudah dinilai
function getRingkasanRekap(baris) {
    const dinilai = baris.filter(b => b.akhir !== null);
    const rata = key => (dinilai.length ? bulatkan(dinilai.reduce((sum, b) => sum + b.nilai[key], 0) / dinilai.length) : null);
    const urut = [...dinilai].sort((a, b) => b.akhir - a.akhir);
    return {
        jumlah: baris.length,
        dinilai: dinilai.length,
        rataRata: {
            tugas: rata('tugas'), kuis: rata('kuis'), pts: rata('pts'), pas: rata('pas'),
            akhir: dinilai.length ? bulatkan(dinilai.reduce((sum, b) => sum + b.akhir, 0) / dinilai.length) : null,
        },
        tertinggi: urut[0] || null,
        terendah: urut[urut.length - 1] || null,
    };
}

/* =========================
   3. STATISTIK & NILAI
========================= */

function bulatkan(angka, digit = 1) {
    const faktor = 10 ** digit;
    return Math.round(angka * faktor) / faktor;
}

// Ringkasan untuk Dashboard & Data Kelas
function getKelasStats(list = getAllKelas()) {
    const totalKelas = list.length;
    const kelasAktif = list.filter(kelas => kelas.status === 'Aktif').length;
    const totalPeserta = list.reduce((sum, kelas) => sum + kelas.peserta, 0);
    const totalKapasitas = list.reduce((sum, kelas) => sum + kelas.kapasitas, 0);
    const totalPengajar = new Set(list.map(kelas => kelas.pengajar)).size;

    return {
        totalKelas,
        kelasAktif,
        persenAktif: totalKelas ? bulatkan((kelasAktif / totalKelas) * 100, 0) : 0,
        totalPeserta,
        totalKapasitas,
        persenKapasitas: totalKapasitas ? bulatkan((totalPeserta / totalKapasitas) * 100) : 0,
        rataPeserta: totalKelas ? bulatkan(totalPeserta / totalKelas) : 0,
        totalPengajar,
    };
}

// Nilai Akhir = 20% Tugas + 20% Kuis + 30% TO PTS + 30% TO PAS
function hitungNilaiAkhir(nilai) {
    return bulatkan(
        nilai.tugas * BOBOT_NILAI.tugas +
        nilai.kuis * BOBOT_NILAI.kuis +
        nilai.pts * BOBOT_NILAI.pts +
        nilai.pas * BOBOT_NILAI.pas
    );
}

function getRekapNilai(list = NILAI_PESERTA) {
    const rows = list.map(p => ({ ...p, akhir: hitungNilaiAkhir(p) }));
    const rata = key => (rows.length ? bulatkan(rows.reduce((sum, p) => sum + p[key], 0) / rows.length) : 0);
    const urut = [...rows].sort((a, b) => b.akhir - a.akhir);

    return {
        rows,
        rataRata: { tugas: rata('tugas'), kuis: rata('kuis'), pts: rata('pts'), pas: rata('pas'), akhir: rata('akhir') },
        tertinggi: urut[0] || null,
        terendah: urut[urut.length - 1] || null,
    };
}

/* =========================
   4. HELPER TAMPILAN (DOM)
========================= */

// Amankan teks sebelum dimasukkan ke HTML (mencegah tag HTML dari input pengguna ikut dijalankan)
function escapeHtml(value) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(value).replace(/[&<>"']/g, char => map[char]);
}

function setText(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

function iconHtml(name, extraClass = 'icon-sm') {
    return `<span class="icon i-${name} ${extraClass}" aria-hidden="true"></span>`;
}

// "Andi Saputra" → "AS"
function getInitials(nama) {
    return String(nama)
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(kata => kata.charAt(0).toUpperCase())
        .join('');
}

// Warna avatar pengajar mengikuti desain High-Fidelity (default: avatar-neutral)
const AVATAR_TONE = { 'Budi Hartono': 'avatar-success' };

/* =========================
   4A. KOMPONEN UMUM (pesan, modal, paginasi, ekspor CSV)
   Dipakai halaman master selain Data Kelas (Data Kelas memakai modal Tahap 5 miliknya sendiri).
========================= */

// Pesan di atas halaman: type 'success' (hijau) atau 'error' (merah)
function tampilkanPesan(type, message) {
    const box = document.getElementById('page-alert');
    if (!box) {
        return;
    }
    const sukses = type === 'success';
    box.classList.toggle('alert-success', sukses);
    box.classList.toggle('alert-error', !sukses);
    box.setAttribute('role', sukses ? 'status' : 'alert');
    const icon = box.querySelector('.icon');
    if (icon) {
        icon.className = `icon ${sukses ? 'i-check-circle' : 'i-info'}`;
    }
    setText('page-alert-text', message);
    box.hidden = false;
}

function sembunyikanPesan() {
    const box = document.getElementById('page-alert');
    if (box) {
        box.hidden = true;
    }
}

// ---- Modal (konfirmasi hapus & detail) ----
let modalTerbuka = null;
let fokusSebelumModalUmum = null;
let aksiKonfirmasi = null;

function bukaModal(id) {
    const modal = document.getElementById(id);
    if (!modal) {
        return;
    }
    if (modalTerbuka && modalTerbuka !== modal) {
        modalTerbuka.hidden = true;
    } else {
        fokusSebelumModalUmum = document.activeElement;
    }
    modalTerbuka = modal;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    const fokus = modal.querySelector('.modal-actions [data-modal-close]') || modal.querySelector('button');
    if (fokus) {
        fokus.focus();
    }
}

function tutupModal() {
    if (!modalTerbuka) {
        return;
    }
    modalTerbuka.hidden = true;
    modalTerbuka = null;
    aksiKonfirmasi = null;
    document.body.classList.remove('modal-open');
    if (fokusSebelumModalUmum && document.body.contains(fokusSebelumModalUmum)) {
        fokusSebelumModalUmum.focus();
    }
    fokusSebelumModalUmum = null;
}

// Tampilkan modal konfirmasi hapus. onConfirm dijalankan hanya bila tombol Hapus ditekan.
function konfirmasiHapusData({ judul, jenis, nama, dampak, onConfirm }) {
    setText('modal-hapus-title', judul);
    setText('modal-hapus-jenis', jenis);
    setText('modal-hapus-nama', nama);
    const note = document.getElementById('modal-hapus-dampak');
    if (note) {
        note.textContent = dampak || '';
        note.hidden = !dampak;
    }
    bukaModal('modal-hapus');
    aksiKonfirmasi = onConfirm;
}

// Modal detail: baris = [[label, isi HTML yang sudah aman], ...]
function tampilkanDetail(judul, baris, onEdit) {
    setText('modal-detail-title', judul);
    const body = document.getElementById('modal-detail-body');
    body.innerHTML = baris.map(([label, isi]) => `<div><dt>${escapeHtml(label)}</dt><dd>${isi}</dd></div>`).join('');
    const tombolEdit = document.getElementById('modal-detail-edit');
    if (tombolEdit) {
        tombolEdit.hidden = !onEdit;
        tombolEdit.onclick = () => {
            tutupModal();
            onEdit();
        };
    }
    bukaModal('modal-detail');
}

function initModalUmum() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.querySelectorAll('[data-modal-close]').forEach(tombol => tombol.addEventListener('click', tutupModal));
        // Klik area gelap di luar kotak modal
        modal.addEventListener('click', event => {
            if (event.target === modal) {
                tutupModal();
            }
        });
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            tutupModal();
        }
    });
    const tombolHapus = document.getElementById('modal-hapus-confirm');
    if (tombolHapus) {
        tombolHapus.addEventListener('click', () => {
            const aksi = aksiKonfirmasi;
            tutupModal();
            if (aksi) {
                aksi();
            }
        });
    }
}

// ---- Form umum ----
function tampilkanErrorForm(form, fields, errors) {
    fields.forEach(field => showFieldError(form, field, errors[field]));
    const pertama = fields.find(field => errors[field]);
    if (pertama) {
        form.elements[pertama].focus();
    }
    return !pertama;
}

// Setelah Simpan ditekan, error diperbarui saat kolom yang salah diperbaiki
function pantauPerbaikanForm(form, fields, validasi) {
    form.addEventListener('input', () => {
        const salah = fields.filter(field => form.elements[field].classList.contains('is-invalid'));
        if (salah.length) {
            const errors = validasi();
            salah.forEach(field => showFieldError(form, field, errors[field]));
        }
    });
}

// Jalankan fn setiap kali pengguna mengganti pilihan <select>. Mendengarkan "input" DAN "change" karena
// tiap browser/cara memilih (mouse, keyboard) tidak selalu mengirim keduanya. Bila satu pilihan mengirim
// "input" lalu "change" sekaligus, fn hanya dijalankan sekali.
function saatNilaiBerubah(element, fn) {
    let barusInput = null;
    // Form dibuka ulang (form.reset) → pilihan berikutnya selalu dianggap perubahan baru
    if (element.form) {
        element.form.addEventListener('reset', () => {
            barusInput = null;
        });
    }
    element.addEventListener('input', () => {
        fn();
        barusInput = element.value;
        setTimeout(() => {
            barusInput = null;
        }, 0);
    });
    element.addEventListener('change', () => {
        // "change" selalu menutup satu pilihan: penanda dibersihkan apa pun hasilnya
        const duplikat = barusInput !== null && barusInput === element.value;
        barusInput = null;
        if (!duplikat) {
            fn();
        }
    });
}

// ---- Paginasi ----
const BARIS_PER_HALAMAN = 10;

// Nomor halaman yang ditampilkan: 1 … (sekitar halaman aktif) … terakhir
function nomorHalaman(aktif, total) {
    const nomor = [];
    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || Math.abs(i - aktif) <= 1) {
            nomor.push(i);
        } else if (nomor[nomor.length - 1] !== '…') {
            nomor.push('…');
        }
    }
    return nomor;
}

function renderPagination(nav, aktif, total, onPilih) {
    if (!nav) {
        return;
    }
    const tombol = (halaman, isi, label, disabled) =>
        `<button type="button" class="page-btn" data-page="${halaman}" aria-label="${label}"${disabled ? ' disabled' : ''}>${isi}</button>`;
    nav.innerHTML = [
        tombol(aktif - 1, iconHtml('chevron-left'), 'Halaman sebelumnya', aktif <= 1),
        ...nomorHalaman(aktif, total).map(n => (n === '…'
            ? '<span class="page-gap">…</span>'
            : `<button type="button" class="page-btn${n === aktif ? ' active' : ''}" data-page="${n}"${n === aktif ? ' aria-current="page"' : ''}>${n}</button>`)),
        tombol(aktif + 1, iconHtml('chevron-right'), 'Halaman berikutnya', aktif >= total),
    ].join('');
    nav.onclick = event => {
        const button = event.target.closest('button[data-page]');
        if (button && !button.disabled) {
            onPilih(Number(button.dataset.page));
        }
    };
}

// ---- Ekspor CSV (dibuat di browser, tanpa server) ----
function buatCsv(header, rows) {
    const sel = value => {
        const teks = String(value ?? '');
        return /[",\r\n;]/.test(teks) ? `"${teks.replace(/"/g, '""')}"` : teks;
    };
    return [header, ...rows].map(row => row.map(sel).join(',')).join('\r\n');
}

function unduhCsv(namaFile, header, rows) {
    // BOM agar huruf non-ASCII terbaca benar saat dibuka di Excel
    const blob = new Blob(['﻿' + buatCsv(header, rows)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = namaFile;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Tanggal hari ini "YYYY-MM-DD" (untuk nama file)
function tanggalHariIni() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Daftar tautan ke data terkait (dipakai di modal detail), mis. modul sebuah pertemuan
function daftarTautan(list, href, kosong) {
    return list.length
        ? list.map(item => `<a class="text-primary" href="${href(item)}">${escapeHtml(item.judul)}</a>`).join('<br>')
        : `<span class="cell-muted">${escapeHtml(kosong)}</span>`;
}

// Opsi <select> kelas bimbel (value = ID kelas)
function opsiKelasHtml(list, { denganKapasitas = false } = {}) {
    return list.map(kelas => {
        const info = denganKapasitas ? ` (${kelas.peserta}/${kelas.kapasitas})` : '';
        return `<option value="${kelas.id}">${escapeHtml(kelas.nama)}${info}</option>`;
    }).join('');
}

/* =========================
   5. HALAMAN DATA KELAS
========================= */

function renderKelasRow(kelas, index) {
    const aktif = kelas.status === 'Aktif';
    const mapel = MAPEL_OPTIONS.find(m => m.nama === kelas.mapel);
    const nama = escapeHtml(kelas.nama);

    return `
        <tr${aktif ? '' : ' class="is-inactive"'}>
            <td class="col-no">${index + 1}</td>
            <td>
                <div class="cell-flex cell-flex-sm">
                    <span class="dot${aktif ? '' : ' dot-disabled'}" aria-hidden="true"></span>
                    <span class="cell-title">${nama}</span>
                </div>
            </td>
            <td>
                <div class="cell-flex cell-flex-sm">
                    ${iconHtml(mapel ? mapel.icon : 'book', 'icon-sm cell-icon')}
                    ${escapeHtml(kelas.mapel)}
                </div>
            </td>
            <td><span class="tag">${escapeHtml(kelas.tingkat)}</span></td>
            <td>
                <div class="cell-flex cell-flex-sm">
                    <span class="avatar-initial avatar-initial-sm ${AVATAR_TONE[kelas.pengajar] || 'avatar-neutral'}">${escapeHtml(getInitials(kelas.pengajar))}</span>
                    ${escapeHtml(kelas.pengajar)}
                </div>
            </td>
            <td><span class="count-box">${iconHtml('user', 'icon-sm cell-icon')}${kelas.peserta} Siswa</span></td>
            <td><span class="badge ${aktif ? 'badge-success' : 'badge-muted'} badge-dot">${escapeHtml(kelas.status)}</span></td>
            <td>
                <div class="actions actions-end">
                    <a href="detail-kelas.html?id=${kelas.id}" class="btn ${aktif ? 'btn-tonal' : 'btn-muted'} btn-small">Kelola</a>
                    <a href="form-kelas.html?id=${kelas.id}" class="icon-btn icon-btn-ghost icon-btn-small" data-action="edit" data-id="${kelas.id}" aria-label="Edit ${nama}">${iconHtml('pencil')}</a>
                    <button type="button" class="icon-btn icon-btn-ghost icon-btn-small icon-btn-danger" data-action="hapus" data-id="${kelas.id}" aria-label="Hapus ${nama}">${iconHtml('trash')}</button>
                </div>
            </td>
        </tr>`;
}

// Kartu ringkasan di atas tabel, dihitung dari data yang sama dengan tabel
function renderKelasStats(list) {
    const stats = getKelasStats(list);

    // Tingkat dengan jumlah kelas terbanyak
    const perTingkat = {};
    list.forEach(kelas => {
        perTingkat[kelas.tingkat] = (perTingkat[kelas.tingkat] || 0) + 1;
    });
    const [tingkat, jumlah] = Object.entries(perTingkat).sort((a, b) => b[1] - a[1])[0] || ['–', 0];

    setText('stat-kelas-aktif', stats.kelasAktif);
    setText('stat-kelas-aktif-info', `${stats.persenAktif}% Berjalan lancar`);
    setText('stat-total-peserta', stats.totalPeserta);
    setText('stat-total-peserta-info', `Tersebar di ${stats.totalKelas} rombel`);
    setText('stat-tingkat', tingkat.replace('SMP ', ''));
    setText('stat-tingkat-info', `${jumlah} Kelas Terjadwal`);
    setText('stat-kapasitas', `${stats.persenKapasitas.toFixed(1)}%`);

    const bar = document.getElementById('stat-kapasitas-bar');
    if (bar) {
        bar.value = stats.persenKapasitas;
        bar.textContent = `${stats.persenKapasitas.toFixed(1)}%`;
    }
}

// Pencarian, filter & halaman tabel Data Kelas (Fase 11)
const kelasView = { cari: '', tingkat: '', status: '', halaman: 1 };

function filterKelas(list) {
    const cari = kelasView.cari.trim().toLowerCase();
    return list.filter(kelas => {
        if (kelasView.tingkat && kelas.tingkat !== kelasView.tingkat) {
            return false;
        }
        if (kelasView.status && kelas.status !== kelasView.status) {
            return false;
        }
        return !cari || [kelas.nama, kelas.mapel, kelas.kode, kelas.pengajar, kelas.tingkat]
            .some(teks => String(teks || '').toLowerCase().includes(cari));
    });
}

function renderTable() {
    const tbody = document.getElementById('kelas-table-body');
    if (!tbody) {
        return;
    }

    const list = getAllKelas();
    const hasil = filterKelas(list);
    const totalHalaman = Math.max(1, Math.ceil(hasil.length / BARIS_PER_HALAMAN));
    kelasView.halaman = Math.min(Math.max(1, kelasView.halaman), totalHalaman);
    const mulai = (kelasView.halaman - 1) * BARIS_PER_HALAMAN;
    const tampil = hasil.slice(mulai, mulai + BARIS_PER_HALAMAN);

    tbody.innerHTML = tampil.length
        ? tampil.map((kelas, i) => renderKelasRow(kelas, mulai + i)).join('')
        : `<tr><td colspan="8" class="table-empty">${list.length ? 'Tidak ada kelas yang cocok dengan pencarian/filter.' : 'Belum ada data kelas.'}</td></tr>`;

    setText('kelas-table-info', hasil.length
        ? `Menampilkan ${mulai + 1}-${mulai + tampil.length} dari ${hasil.length} data`
        : 'Tidak ada data');
    renderPagination(document.getElementById('kelas-pagination'), kelasView.halaman, totalHalaman, halaman => {
        kelasView.halaman = halaman;
        renderTable();
    });
    // Kartu ringkasan selalu dari seluruh kelas (tidak terpengaruh filter)
    renderKelasStats(list);
}

function resetFilterKelas() {
    Object.assign(kelasView, { cari: '', tingkat: '', status: '', halaman: 1 });
    ['kelas-search', 'kelas-filter-tingkat', 'kelas-filter-status'].forEach(id => {
        document.getElementById(id).value = '';
    });
    renderTable();
}

// Ekspor kelas yang sedang tampil (mengikuti pencarian/filter) ke CSV
function eksporKelas() {
    const hasil = filterKelas(getAllKelas());
    const flash = document.getElementById('flash-message');
    if (flash) {
        flash.hidden = true;
    }
    if (!hasil.length) {
        tampilkanPesan('error', 'Tidak ada data kelas untuk diekspor.');
        return;
    }
    const namaFile = `data-kelas-${tanggalHariIni()}.csv`;
    unduhCsv(namaFile,
        ['No', 'Kode', 'Nama Kelas', 'Mata Pelajaran', 'Tingkat', 'Pengajar', 'Peserta', 'Kapasitas', 'Status'],
        hasil.map((k, i) => [i + 1, k.kode, k.nama, k.mapel, k.tingkat, k.pengajar, k.peserta, k.kapasitas, k.status]));
    tampilkanPesan('success', `${hasil.length} data kelas diekspor ke file ${namaFile}.`);
}

// ---- Modal konfirmasi Hapus (Tahap 5) ----
// ID kelas yang menunggu konfirmasi; null bila modal tertutup
let idAkanDihapus = null;
let fokusSebelumModal = null;

// Klik "Hapus" di tabel → tampilkan modal (belum menghapus apa pun)
function hapusData(id) {
    const kelas = getKelasById(id);
    const modal = document.getElementById('modal-hapus');
    if (!kelas || !modal) {
        return;
    }
    idAkanDihapus = kelas.id;
    setText('modal-hapus-nama', kelas.nama);
    const dampak = getDampakHapusKelas(kelas.id);
    setText('modal-hapus-dampak', [
        dampak.peserta
            ? `${dampak.peserta} peserta di kelas ini tidak ikut terhapus, tetapi statusnya menjadi "Belum ada kelas".`
            : 'Kelas ini belum memiliki peserta.',
        dampak.pertemuan ? `${dampak.pertemuan} pertemuan kelas ini ikut dihapus.` : '',
        dampak.modul ? `${dampak.modul} modul kelas ini ikut dihapus.` : '',
        dampak.tugas ? `${dampak.tugas} tugas kelas ini ikut dihapus.` : '',
        dampak.kuis ? `${dampak.kuis} kuis kelas ini ikut dihapus.` : '',
        dampak.to ? `${dampak.to} jadwal TO (PTS/PAS) kelas ini ikut dihapus.` : '',
        dampak.nilai ? `${dampak.nilai} data nilai kelas ini ikut dihapus.` : '',
        dampak.evaluasi ? `${dampak.evaluasi} pretest/aktivitas/latihan kelas ini ikut dihapus.` : '',
        dampak.hasil ? `${dampak.hasil} hasil pengerjaan peserta di kelas ini ikut dihapus.` : '',
    ].filter(Boolean).join(' '));
    fokusSebelumModal = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    // Fokus awal di tombol Batal (pilihan paling aman)
    modal.querySelector('.modal-actions [data-modal-close]').focus();
}

function tutupModalHapus() {
    const modal = document.getElementById('modal-hapus');
    if (!modal || modal.hidden) {
        return;
    }
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    idAkanDihapus = null;
    // Kembalikan fokus ke tombol yang membuka modal (bila barisnya masih ada)
    if (fokusSebelumModal && document.body.contains(fokusSebelumModal)) {
        fokusSebelumModal.focus();
    }
    fokusSebelumModal = null;
}

// Klik "Hapus" di dalam modal → hapus berdasarkan ID, simpan, render ulang
function konfirmasiHapus() {
    if (idAkanDihapus === null) {
        return;
    }
    const kelas = getKelasById(idAkanDihapus);
    deleteKelas(idAkanDihapus);
    tutupModalHapus();
    sembunyikanPesan();
    renderTable();

    if (kelas) {
        setText('flash-text', `Kelas "${kelas.nama}" berhasil dihapus.`);
        const flash = document.getElementById('flash-message');
        if (flash) {
            flash.hidden = false;
        }
    }
}

function initModalHapus() {
    const modal = document.getElementById('modal-hapus');
    if (!modal) {
        return;
    }
    // Tombol Batal & X
    modal.querySelectorAll('[data-modal-close]').forEach(tombol => {
        tombol.addEventListener('click', tutupModalHapus);
    });
    // Klik area gelap di luar kotak modal
    modal.addEventListener('click', event => {
        if (event.target === modal) {
            tutupModalHapus();
        }
    });
    // Tombol Escape
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            tutupModalHapus();
        }
    });
    document.getElementById('modal-hapus-confirm').addEventListener('click', konfirmasiHapus);
}

function initDataKelasPage() {
    showFlash();
    const filterTingkat = document.getElementById('kelas-filter-tingkat');
    filterTingkat.innerHTML = '<option value="">Semua Tingkat</option>' +
        TINGKAT_OPTIONS.map(t => `<option value="${t}">${t}</option>`).join('');
    renderTable();
    initModalHapus();

    document.getElementById('kelas-search').addEventListener('input', event => {
        kelasView.cari = event.target.value;
        kelasView.halaman = 1;
        renderTable();
    });
    ['tingkat', 'status'].forEach(key => {
        const select = document.getElementById(`kelas-filter-${key}`);
        saatNilaiBerubah(select, () => {
            kelasView[key] = select.value;
            kelasView.halaman = 1;
            renderTable();
        });
    });
    document.getElementById('btn-reset-filter-kelas').addEventListener('click', resetFilterKelas);
    document.getElementById('btn-ekspor-kelas').addEventListener('click', eksporKelas);

    // Satu event listener untuk semua tombol Hapus di tabel (event delegation),
    // sehingga tetap bekerja walaupun baris tabel dirender ulang.
    // Tombol Tambah & Edit berupa link ke form-kelas.html (Tahap 4).
    const tbody = document.getElementById('kelas-table-body');
    tbody.addEventListener('click', event => {
        const button = event.target.closest('button[data-action="hapus"]');
        if (button) {
            hapusData(Number(button.dataset.id));
        }
    });
}

/* =========================
   6. HALAMAN FORM KELAS (Tambah & Edit)
========================= */

// Pesan sekali tampil ("flash") yang dibawa dari form ke halaman Data Kelas
const FLASH_KEY = 'dellearn.flash';

function setFlash(message) {
    try {
        window.sessionStorage.setItem(FLASH_KEY, message);
    } catch (error) {
        // sessionStorage tidak tersedia — pesan dilewati
    }
}

function showFlash() {
    const box = document.getElementById('flash-message');
    let message = null;
    try {
        message = window.sessionStorage.getItem(FLASH_KEY);
        window.sessionStorage.removeItem(FLASH_KEY);
    } catch (error) {
        message = null;
    }
    if (box && message) {
        setText('flash-text', message);
        box.hidden = false;
    }
}

// Aturan validasi. Menerima nilai mentah dari form (teks), mengembalikan { namaField: pesanError }
function validateKelas(data, currentId = null) {
    const errors = {};
    const nama = String(data.nama || '').trim();

    if (!nama) {
        errors.nama = 'Nama kelas wajib diisi.';
    } else if (nama.length < 3) {
        errors.nama = 'Nama kelas minimal 3 karakter.';
    } else if (getAllKelas().some(k => k.nama.toLowerCase() === nama.toLowerCase() && k.id !== Number(currentId))) {
        errors.nama = 'Nama kelas sudah digunakan oleh kelas lain.';
    }

    if (!MAPEL_OPTIONS.some(m => m.nama === data.mapel)) {
        errors.mapel = 'Pilih mata pelajaran.';
    }
    if (!TINGKAT_OPTIONS.includes(data.tingkat)) {
        errors.tingkat = 'Pilih tingkat kelas.';
    }
    // Pengajar harus ada di Data Pengajar. Pengajar Tidak Aktif hanya boleh bila memang pengajar lama kelas ini.
    const pengajarId = cariPengajarId(data.pengajar);
    const pengajar = pengajarId !== null ? getPengajarById(pengajarId) : null;
    const lama = currentId !== null ? getKelasById(currentId) : null;
    if (!pengajar) {
        errors.pengajar = 'Pilih pengajar.';
    } else if (pengajar.status !== 'Aktif' && !(lama && lama.pengajarId === pengajar.id)) {
        errors.pengajar = `Pengajar "${pengajar.nama}" berstatus Tidak Aktif.`;
    }
    if (!STATUS_OPTIONS.includes(data.status)) {
        errors.status = 'Pilih status kelas.';
    }

    // Jumlah peserta tidak diisi manual: dihitung dari Data Peserta. Kelas baru = 0 peserta.
    const kapasitasRaw = String(data.kapasitas ?? '').trim();
    const kapasitas = Number(kapasitasRaw);
    const terdaftar = currentId !== null ? (hitungPesertaPerKelas()[Number(currentId)] || 0) : 0;

    if (kapasitasRaw === '') {
        errors.kapasitas = 'Kapasitas wajib diisi.';
    } else if (!Number.isInteger(kapasitas)) {
        errors.kapasitas = 'Kapasitas harus berupa bilangan bulat.';
    } else if (kapasitas <= 0) {
        errors.kapasitas = 'Kapasitas harus lebih dari 0.';
    } else if (kapasitas < terdaftar) {
        errors.kapasitas = `Kapasitas tidak boleh lebih kecil dari jumlah peserta terdaftar (${terdaftar} peserta).`;
    }

    return errors;
}

const FORM_FIELDS = ['nama', 'mapel', 'tingkat', 'pengajar', 'peserta', 'kapasitas', 'status', 'keterangan'];

function readKelasForm(form) {
    const data = {};
    FORM_FIELDS.forEach(field => {
        data[field] = form.elements[field].value;
    });
    return data;
}

function showFieldError(form, field, message) {
    const input = form.elements[field];
    const errorBox = document.getElementById(`${field}-error`);
    if (!input || !errorBox) {
        return;
    }
    errorBox.textContent = message || '';
    input.classList.toggle('is-invalid', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
}

function showFormErrors(form, errors) {
    FORM_FIELDS.forEach(field => showFieldError(form, field, errors[field]));
}

function fillSelect(select, options, placeholder) {
    select.innerHTML = `<option value="">${escapeHtml(placeholder)}</option>` +
        options.map(option => `<option>${escapeHtml(option)}</option>`).join('');
}

function showFormAlert(message) {
    setText('form-alert-text', message);
    const box = document.getElementById('form-alert');
    if (box) {
        box.hidden = false;
    }
}

function initFormKelasPage() {
    const form = document.getElementById('form-kelas');
    fillSelect(form.elements.mapel, MAPEL_OPTIONS.map(m => m.nama), 'Pilih mata pelajaran');
    fillSelect(form.elements.tingkat, TINGKAT_OPTIONS, 'Pilih tingkat');
    fillSelect(form.elements.status, STATUS_OPTIONS, 'Pilih status');

    // Tanpa ?id= → mode Tambah. Dengan ?id=N → mode Edit.
    const idParam = new URLSearchParams(window.location.search).get('id');
    const isEdit = idParam !== null && idParam !== '';
    const kelas = isEdit ? getKelasById(idParam) : null;

    // Pilihan pengajar dari Data Pengajar (value = ID): pengajar Aktif + pengajar lama kelas ini
    const pilihanPengajar = getAllPengajar().filter(p => p.status === 'Aktif' || (kelas && kelas.pengajarId === p.id));
    form.elements.pengajar.innerHTML = '<option value="">Pilih pengajar</option>' +
        pilihanPengajar.map(p => `<option value="${p.id}">${escapeHtml(p.nama)}${p.status === 'Aktif' ? '' : ' (Tidak Aktif)'}</option>`).join('');

    if (isEdit && !kelas) {
        showFormAlert(`Data kelas dengan ID "${idParam}" tidak ditemukan. Kembali ke Data Kelas untuk memilih kelas yang tersedia.`);
        document.getElementById('form-card').hidden = true;
        return;
    }

    if (isEdit) {
        const judul = `Edit Kelas`;
        document.title = `${judul} — DelLearn Admin`;
        setText('form-title', judul);
        setText('form-breadcrumb', judul);
        setText('form-description', `Ubah data kelas ${kelas.nama}`);
        setText('form-kode', `Kode: ${kelas.kode}`);
        document.getElementById('form-kode').hidden = false;
        FORM_FIELDS.forEach(field => {
            form.elements[field].value = kelas[field] ?? '';
        });
        form.elements.pengajar.value = kelas.pengajarId ?? '';
    } else {
        // Kelas baru belum memiliki peserta; peserta ditambahkan dari halaman Data Peserta
        form.elements.peserta.value = 0;
    }

    form.addEventListener('submit', event => {
        event.preventDefault();
        const data = readKelasForm(form);
        const errors = validateKelas(data, isEdit ? kelas.id : null);
        showFormErrors(form, errors);

        const fieldPertama = FORM_FIELDS.find(field => errors[field]);
        if (fieldPertama) {
            form.elements[fieldPertama].focus();
            return;
        }

        if (isEdit) {
            const hasil = updateKelas(kelas.id, data);
            setFlash(`Perubahan kelas "${hasil.nama}" berhasil disimpan.`);
        } else {
            const hasil = addKelas(data);
            setFlash(`Kelas "${hasil.nama}" berhasil ditambahkan.`);
        }
        window.location.href = 'data-kelas.html';
    });

    // Setelah tombol Simpan ditekan, pesan error diperbarui saat isian diperbaiki.
    // Hanya field yang sedang error yang diperiksa ulang (tidak memunculkan error baru saat mengetik).
    form.addEventListener('input', () => {
        const fieldError = FORM_FIELDS.filter(field => form.elements[field].classList.contains('is-invalid'));
        if (!fieldError.length) {
            return;
        }
        const errors = validateKelas(readKelasForm(form), isEdit ? kelas.id : null);
        fieldError.forEach(field => showFieldError(form, field, errors[field]));
    });
}

/* =========================
   6A. HALAMAN DATA PESERTA (daftar, cari/filter, Tambah/Edit/Hapus/Detail, ekspor CSV)
========================= */

const PESERTA_FIELDS = ['nama', 'email', 'sekolah', 'kelasId', 'status', 'gender'];

// Keadaan tampilan tabel (tidak disimpan)
const pesertaView = { cari: '', kelas: '', status: '', halaman: 1, editId: null };

function namaKelasPeserta(peserta, kelasMap) {
    const kelas = kelasMap[peserta.kelasId];
    return kelas ? kelas.nama : 'Belum ada kelas';
}

// Peserta yang lolos pencarian & filter (seluruh halaman)
function filterPeserta(list, kelasMap) {
    const cari = pesertaView.cari.trim().toLowerCase();
    return list.filter(p => {
        if (pesertaView.kelas === 'none' && kelasMap[p.kelasId]) {
            return false;
        }
        if (pesertaView.kelas && pesertaView.kelas !== 'none' && p.kelasId !== Number(pesertaView.kelas)) {
            return false;
        }
        if (pesertaView.status && p.status !== pesertaView.status) {
            return false;
        }
        if (!cari) {
            return true;
        }
        return [p.nama, p.email, p.sekolah, p.nis, namaKelasPeserta(p, kelasMap)]
            .some(teks => String(teks).toLowerCase().includes(cari));
    });
}

function renderPesertaRow(peserta, nomor, kelasMap) {
    const aktif = peserta.status === 'Aktif';
    const nama = escapeHtml(peserta.nama);
    const kelas = kelasMap[peserta.kelasId];
    return `
        <tr>
            <td class="col-no">${nomor}</td>
            <td>
                <div class="cell-flex">
                    <span class="avatar-initial${aktif ? '' : ' avatar-muted'}">${escapeHtml(getInitials(peserta.nama))}</span>
                    <div>
                        <p class="cell-title">${nama}</p>
                        <p class="cell-meta">ID: ${escapeHtml(peserta.nis)}</p>
                    </div>
                </div>
            </td>
            <td>${escapeHtml(peserta.email)}</td>
            <td>${peserta.sekolah ? `<span class="tag tag-muted">${escapeHtml(peserta.sekolah)}</span>` : '<span class="cell-muted">–</span>'}</td>
            <td>${kelas ? `<span class="text-primary">${escapeHtml(kelas.nama)}</span>` : '<span class="cell-muted">Belum ada kelas</span>'}</td>
            <td><span class="badge ${aktif ? 'badge-success' : 'badge-muted'} badge-dot">${escapeHtml(peserta.status)}</span></td>
            <td>
                <div class="actions actions-center">
                    <button type="button" class="icon-btn icon-btn-ghost icon-btn-small" data-action="detail" data-id="${peserta.id}" aria-label="Lihat detail ${nama}">${iconHtml('eye')}</button>
                    <button type="button" class="icon-btn icon-btn-ghost icon-btn-small" data-action="edit" data-id="${peserta.id}" aria-label="Edit ${nama}">${iconHtml('pencil')}</button>
                    <button type="button" class="icon-btn icon-btn-ghost icon-btn-small icon-btn-danger" data-action="hapus" data-id="${peserta.id}" aria-label="Hapus ${nama}">${iconHtml('trash')}</button>
                </div>
            </td>
        </tr>`;
}

function renderPesertaStats(list, kelasList) {
    const aktif = list.filter(p => p.status === 'Aktif').length;
    setText('peserta-badge', `${list.length} Terdaftar`);
    setText('stat-peserta-total', list.length);
    setText('stat-peserta-aktif', aktif);
    setText('stat-peserta-nonaktif', list.length - aktif);
    setText('stat-peserta-kelas', kelasList.filter(k => k.status === 'Aktif').length);
}

// Isi ulang pilihan kelas (filter & form) — jumlah peserta per kelas ikut diperbarui
function renderOpsiKelasPeserta(kelasList) {
    const filter = document.getElementById('peserta-filter-kelas');
    const pilihFilter = filter.value;
    filter.innerHTML = '<option value="">Semua Kelas Bimbel</option>' + opsiKelasHtml(kelasList) +
        '<option value="none">Belum ada kelas</option>';
    filter.value = [...filter.options].some(o => o.value === pilihFilter) ? pilihFilter : '';
    pesertaView.kelas = filter.value;

    const select = document.getElementById('peserta-kelasId');
    const pilihForm = select.value;
    select.innerHTML = '<option value="">Pilih kelas bimbel</option>' + opsiKelasHtml(kelasList, { denganKapasitas: true }) +
        '<option value="none">Belum ada kelas</option>';
    select.value = [...select.options].some(o => o.value === pilihForm) ? pilihForm : '';
}

function renderPesertaTable() {
    const tbody = document.getElementById('peserta-table-body');
    if (!tbody) {
        return;
    }
    const semua = getAllPeserta();
    const kelasList = getAllKelas();
    const kelasMap = Object.fromEntries(kelasList.map(k => [k.id, k]));
    const hasil = filterPeserta(semua, kelasMap);

    const totalHalaman = Math.max(1, Math.ceil(hasil.length / BARIS_PER_HALAMAN));
    pesertaView.halaman = Math.min(Math.max(1, pesertaView.halaman), totalHalaman);
    const mulai = (pesertaView.halaman - 1) * BARIS_PER_HALAMAN;
    const tampil = hasil.slice(mulai, mulai + BARIS_PER_HALAMAN);

    tbody.innerHTML = tampil.length
        ? tampil.map((p, i) => renderPesertaRow(p, mulai + i + 1, kelasMap)).join('')
        : `<tr><td colspan="7" class="table-empty">${semua.length ? 'Tidak ada peserta yang cocok dengan pencarian/filter.' : 'Belum ada data peserta.'}</td></tr>`;

    setText('peserta-table-info', hasil.length
        ? `Menampilkan ${mulai + 1}-${mulai + tampil.length} dari ${hasil.length} peserta`
        : 'Tidak ada data');
    renderPagination(document.getElementById('peserta-pagination'), pesertaView.halaman, totalHalaman, halaman => {
        pesertaView.halaman = halaman;
        renderPesertaTable();
    });
    renderPesertaStats(semua, kelasList);
}

// Muat ulang tampilan setelah data berubah
function refreshPesertaPage() {
    renderOpsiKelasPeserta(getAllKelas());
    renderPesertaTable();
}

function bukaFormPeserta(id = null) {
    const card = document.getElementById('peserta-form-card');
    const form = document.getElementById('form-peserta');
    const peserta = id !== null ? getPesertaById(id) : null;
    if (id !== null && !peserta) {
        tampilkanPesan('error', 'Data peserta tidak ditemukan. Mungkin sudah dihapus.');
        return;
    }
    pesertaView.editId = peserta ? peserta.id : null;
    form.reset();
    renderOpsiKelasPeserta(getAllKelas());
    PESERTA_FIELDS.forEach(field => showFieldError(form, field, ''));

    setText('peserta-form-title', peserta ? 'Edit Peserta' : 'Tambah Peserta');
    const badge = document.getElementById('peserta-form-nis');
    badge.hidden = !peserta;
    setText('peserta-form-nis', peserta ? `ID: ${peserta.nis}` : '');
    if (peserta) {
        form.elements.nama.value = peserta.nama;
        form.elements.email.value = peserta.email;
        form.elements.sekolah.value = peserta.sekolah;
        form.elements.kelasId.value = peserta.kelasId === null ? 'none' : String(peserta.kelasId);
        form.elements.status.value = peserta.status;
        form.elements.gender.value = peserta.gender || '';
    } else {
        form.elements.status.value = 'Aktif';
    }
    card.hidden = false;
    card.scrollIntoView({ block: 'start' });
    form.elements.nama.focus();
}

function tutupFormPeserta() {
    document.getElementById('peserta-form-card').hidden = true;
    pesertaView.editId = null;
}

function readPesertaForm(form) {
    const data = {};
    PESERTA_FIELDS.forEach(field => {
        data[field] = form.elements[field].value;
    });
    return data;
}

function simpanFormPeserta(event) {
    event.preventDefault();
    const form = event.target;
    const data = readPesertaForm(form);
    const errors = validatePeserta(data, pesertaView.editId);
    if (!tampilkanErrorForm(form, PESERTA_FIELDS, errors)) {
        tampilkanPesan('error', 'Data peserta belum tersimpan. Periksa kolom yang ditandai merah.');
        return;
    }

    if (pesertaView.editId !== null) {
        const hasil = updatePeserta(pesertaView.editId, data);
        tampilkanPesan('success', `Perubahan data peserta "${hasil.nama}" berhasil disimpan.`);
    } else {
        const hasil = addPeserta(data);
        // Tampilkan halaman tabel yang berisi peserta baru (filter dikosongkan)
        resetFilterPeserta(false);
        pesertaView.halaman = Math.ceil(getAllPeserta().length / BARIS_PER_HALAMAN);
        tampilkanPesan('success', `Peserta "${hasil.nama}" (ID ${hasil.nis}) berhasil ditambahkan.`);
    }
    tutupFormPeserta();
    refreshPesertaPage();
    document.getElementById('page-alert').scrollIntoView({ block: 'nearest' });
}

function lihatPeserta(id) {
    const peserta = getPesertaById(id);
    if (!peserta) {
        return;
    }
    const kelas = peserta.kelasId !== null ? getKelasById(peserta.kelasId) : null;
    const aktif = peserta.status === 'Aktif';
    tampilkanDetail('Detail Peserta', [
        ['ID Peserta (NIS)', escapeHtml(peserta.nis)],
        ['Nama', escapeHtml(peserta.nama)],
        ['Gender', escapeHtml(peserta.gender || '–')],
        ['Email', escapeHtml(peserta.email)],
        ['Asal Sekolah', escapeHtml(peserta.sekolah || '–')],
        ['Kelas Bimbel', kelas ? escapeHtml(kelas.nama) : 'Belum ada kelas'],
        ['Pengajar', kelas ? escapeHtml(kelas.pengajar) : '–'],
        ['Status', `<span class="badge ${aktif ? 'badge-success' : 'badge-muted'} badge-dot">${escapeHtml(peserta.status)}</span>`],
    ], () => bukaFormPeserta(peserta.id));
}

function hapusPeserta(id) {
    const peserta = getPesertaById(id);
    if (!peserta) {
        return;
    }
    konfirmasiHapusData({
        judul: 'Hapus Data Peserta?',
        jenis: 'peserta',
        nama: peserta.nama,
        dampak: `ID ${peserta.nis}. Jumlah peserta kelas akan berkurang otomatis.`,
        onConfirm: () => {
            deletePeserta(peserta.id);
            if (pesertaView.editId === peserta.id) {
                tutupFormPeserta();
            }
            refreshPesertaPage();
            tampilkanPesan('success', `Peserta "${peserta.nama}" berhasil dihapus.`);
        },
    });
}

function resetFilterPeserta(render = true) {
    pesertaView.cari = '';
    pesertaView.kelas = '';
    pesertaView.status = '';
    pesertaView.halaman = 1;
    document.getElementById('peserta-search').value = '';
    document.getElementById('peserta-filter-kelas').value = '';
    document.getElementById('peserta-filter-status').value = '';
    if (render) {
        renderPesertaTable();
    }
}

function eksporPeserta() {
    const kelasMap = Object.fromEntries(getAllKelas().map(k => [k.id, k]));
    const hasil = filterPeserta(getAllPeserta(), kelasMap);
    if (!hasil.length) {
        tampilkanPesan('error', 'Tidak ada data peserta untuk diekspor.');
        return;
    }
    const namaFile = `data-peserta-${tanggalHariIni()}.csv`;
    unduhCsv(namaFile,
        ['No', 'ID Peserta', 'Nama', 'Email', 'Asal Sekolah', 'Kelas Bimbel', 'Pengajar', 'Status'],
        hasil.map((p, i) => {
            const kelas = kelasMap[p.kelasId];
            return [i + 1, p.nis, p.nama, p.email, p.sekolah, kelas ? kelas.nama : 'Belum ada kelas', kelas ? kelas.pengajar : '', p.status];
        }));
    tampilkanPesan('success', `${hasil.length} data peserta diekspor ke file ${namaFile}.`);
}

function initDataPesertaPage() {
    initModalUmum();

    // ?kelas=ID → langsung tampilkan peserta kelas tersebut (dipakai dari Detail Kelas)
    const kelasParam = new URLSearchParams(window.location.search).get('kelas');
    refreshPesertaPage();
    if (kelasParam) {
        const filter = document.getElementById('peserta-filter-kelas');
        filter.value = kelasParam;
        pesertaView.kelas = filter.value;
        renderPesertaTable();
    }

    const statusSelect = document.getElementById('peserta-status');
    statusSelect.innerHTML = STATUS_PESERTA.map(s => `<option>${s}</option>`).join('');

    document.getElementById('peserta-search').addEventListener('input', event => {
        pesertaView.cari = event.target.value;
        pesertaView.halaman = 1;
        renderPesertaTable();
    });
    const filterKelasPeserta = document.getElementById('peserta-filter-kelas');
    saatNilaiBerubah(filterKelasPeserta, () => {
        pesertaView.kelas = filterKelasPeserta.value;
        pesertaView.halaman = 1;
        renderPesertaTable();
    });
    const filterStatusPeserta = document.getElementById('peserta-filter-status');
    saatNilaiBerubah(filterStatusPeserta, () => {
        pesertaView.status = filterStatusPeserta.value;
        pesertaView.halaman = 1;
        renderPesertaTable();
    });
    document.getElementById('btn-reset-filter-peserta').addEventListener('click', () => resetFilterPeserta());
    document.getElementById('btn-tambah-peserta').addEventListener('click', () => {
        sembunyikanPesan();
        bukaFormPeserta();
    });
    document.getElementById('btn-ekspor-peserta').addEventListener('click', eksporPeserta);
    document.getElementById('btn-batal-peserta').addEventListener('click', tutupFormPeserta);

    const form = document.getElementById('form-peserta');
    form.addEventListener('submit', simpanFormPeserta);
    pantauPerbaikanForm(form, PESERTA_FIELDS, () => validatePeserta(readPesertaForm(form), pesertaView.editId));

    document.getElementById('peserta-table-body').addEventListener('click', event => {
        const button = event.target.closest('button[data-action]');
        if (!button) {
            return;
        }
        const id = Number(button.dataset.id);
        if (button.dataset.action === 'detail') {
            lihatPeserta(id);
        } else if (button.dataset.action === 'edit') {
            sembunyikanPesan();
            bukaFormPeserta(id);
        } else if (button.dataset.action === 'hapus') {
            hapusPeserta(id);
        }
    });
}

/* =========================
   6B. HALAMAN DATA PENGAJAR (daftar, cari/filter, Tambah/Edit/Hapus/Detail, ekspor CSV,
       statistik & komposisi mapel dari data)
========================= */

const PENGAJAR_FIELDS = ['nama', 'gelar', 'nip', 'email', 'mapel', 'status'];

// Singkatan mapel untuk kartu Distribusi Mapel
const SINGKATAN_MAPEL = { 'Matematika': 'MTK', 'Bahasa Inggris': 'B.Inggris', 'IPA': 'IPA', 'IPS': 'IPS', 'Bahasa Indonesia': 'B.Indo' };

// Kelompok donut Komposisi Mata Pelajaran (warna mengikuti desain)
const KELOMPOK_MAPEL = [
    { label: 'Matematika & IPA', mapel: ['Matematika', 'IPA'], warna: 'var(--primary)', dot: '' },
    { label: 'Bahasa', mapel: ['Bahasa Inggris', 'Bahasa Indonesia'], warna: 'var(--text-secondary)', dot: ' legend-dot-muted' },
    { label: 'IPS & Lainnya', mapel: null, warna: 'var(--success)', dot: ' legend-dot-success' },
];

const pengajarView = { cari: '', mapel: '', status: '', halaman: 1, editId: null };

function filterPengajar(list, perPengajar) {
    const cari = pengajarView.cari.trim().toLowerCase();
    return list.filter(p => {
        if (pengajarView.mapel && p.mapel !== pengajarView.mapel) {
            return false;
        }
        if (pengajarView.status && p.status !== pengajarView.status) {
            return false;
        }
        if (!cari) {
            return true;
        }
        const kelas = (perPengajar[p.id] || []).map(k => k.nama);
        return [namaLengkapPengajar(p), p.email, p.kode, p.nip, p.mapel, ...kelas]
            .some(teks => String(teks || '').toLowerCase().includes(cari));
    });
}

function renderPengajarRow(pengajar, nomor, perPengajar) {
    const aktif = pengajar.status === 'Aktif';
    const nama = escapeHtml(namaLengkapPengajar(pengajar));
    const kelas = perPengajar[pengajar.id] || [];
    // Baris ringkas: ID + mata pelajaran di bawah nama (NIP ada di Detail & CSV)
    const meta = `${pengajar.kode} · ${pengajar.mapel}`;
    return `
        <tr>
            <td class="col-no">${nomor}</td>
            <td>
                <div class="cell-flex">
                    <span class="avatar-initial avatar-initial-lg ${aktif ? (AVATAR_TONE[pengajar.nama] || '') : 'avatar-muted'}">${escapeHtml(getInitials(pengajar.nama))}</span>
                    <div>
                        <p class="cell-title">${nama}</p>
                        <p class="cell-meta">${escapeHtml(meta)}</p>
                    </div>
                </div>
            </td>
            <td>
                <div class="cell-flex cell-flex-sm">
                    ${iconHtml('mail', 'icon-sm cell-icon')}
                    ${escapeHtml(pengajar.email)}
                </div>
            </td>
            <td>
                ${kelas.length
                    ? `<div class="tag-list">${kelas.map(k => `<span class="tag">${escapeHtml(k.nama)}</span>`).join('')}</div>`
                    : '<span class="cell-muted">Belum ada kelas</span>'}
            </td>
            <td class="text-center"><span class="badge badge-muted">${kelas.length} Kelas</span></td>
            <td><span class="badge ${aktif ? 'badge-success' : 'badge-muted'} badge-dot">${escapeHtml(pengajar.status)}</span></td>
            <td>
                <div class="actions actions-center">
                    <button type="button" class="icon-btn icon-btn-ghost icon-btn-small" data-action="detail" data-id="${pengajar.id}" aria-label="Lihat detail ${nama}">${iconHtml('eye')}</button>
                    <button type="button" class="icon-btn icon-btn-ghost icon-btn-small" data-action="edit" data-id="${pengajar.id}" aria-label="Edit ${nama}">${iconHtml('pencil')}</button>
                    <button type="button" class="icon-btn icon-btn-ghost icon-btn-small icon-btn-danger" data-action="hapus" data-id="${pengajar.id}" aria-label="Hapus ${nama}">${iconHtml('trash')}</button>
                </div>
            </td>
        </tr>`;
}

// Kartu statistik, penugasan kelas & komposisi mapel — semua dihitung dari data
function renderPengajarRingkasan(list, kelasList) {
    const aktif = list.filter(p => p.status === 'Aktif');
    const persen = list.length ? Math.round((aktif.length / list.length) * 100) : 0;
    const totalPeserta = getKelasStats(kelasList).totalPeserta;
    const kelasBerpengajar = kelasList.filter(k => list.some(p => p.id === k.pengajarId));
    const mapelKelas = [...new Set(kelasList.map(k => k.mapel))];

    setText('stat-pengajar-total', list.length);
    setText('stat-pengajar-persen', `${persen}% Aktif`);
    setText('stat-pengajar-info', `${aktif.length} aktif · ${list.length - aktif.length} tidak aktif`);
    setText('stat-rasio', aktif.length ? `~${Math.round(totalPeserta / aktif.length)} : 1` : '–');
    setText('stat-rasio-info', `${totalPeserta} peserta / ${aktif.length} pengajar aktif`);
    setText('stat-kelas-diampu', `${kelasBerpengajar.length} Kelas`);
    setText('stat-kelas-rata', aktif.length
        ? `Rata-rata ${bulatkan(kelasBerpengajar.length / aktif.length, 2)} rombel / tutor`
        : 'Belum ada pengajar aktif');
    setText('stat-mapel', `${mapelKelas.length} Bidang`);
    setText('stat-mapel-info', mapelKelas.length ? mapelKelas.map(m => SINGKATAN_MAPEL[m] || m).join(', ') : 'Belum ada kelas');

    // Penugasan kelas (kelas → pengajar)
    const penugasan = document.getElementById('penugasan-list');
    if (penugasan) {
        penugasan.innerHTML = kelasList.length
            ? kelasList.map(k => `
                <li class="schedule-item${k.status === 'Aktif' ? '' : ' schedule-item-muted'}">
                    <div>
                        <p class="schedule-title">${escapeHtml(k.nama)}</p>
                        <p class="schedule-meta">${escapeHtml(k.pengajar)} • ${escapeHtml(k.status)}</p>
                    </div>
                    <span class="tag${k.status === 'Aktif' ? '' : ' tag-muted'}">${k.peserta}/${k.kapasitas} siswa</span>
                </li>`).join('')
            : '<li class="schedule-meta">Belum ada kelas.</li>';
    }

    // Komposisi mapel: persentase kelas per kelompok mapel
    const donut = document.getElementById('donut-mapel');
    const legend = document.getElementById('legend-mapel');
    if (donut && legend) {
        const jumlah = KELOMPOK_MAPEL.map(g => kelasList.filter(k => (g.mapel
            ? g.mapel.includes(k.mapel)
            : !KELOMPOK_MAPEL.some(x => x.mapel && x.mapel.includes(k.mapel)))).length);
        const total = kelasList.length;
        const persenGrup = jumlah.map(n => (total ? Math.round((n / total) * 100) : 0));
        let batas = 0;
        const segmen = KELOMPOK_MAPEL.map((g, i) => {
            const awal = batas;
            batas = i === KELOMPOK_MAPEL.length - 1 ? 100 : batas + (total ? (jumlah[i] / total) * 100 : 0);
            return `${g.warna} ${awal}% ${batas}%`;
        });
        donut.style.background = total ? `conic-gradient(${segmen.join(', ')})` : 'var(--surface-low)';
        const label = KELOMPOK_MAPEL.map((g, i) => `${g.label} ${persenGrup[i]}%`).join(', ');
        donut.setAttribute('aria-label', total ? label : 'Belum ada kelas');
        legend.innerHTML = KELOMPOK_MAPEL.map((g, i) =>
            `<li><span class="legend-dot${g.dot}"></span>${escapeHtml(g.label)} (${persenGrup[i]}%)</li>`).join('');
        setText('komposisi-info', `Dihitung dari ${total} kelas di Data Kelas`);
    }
}

function renderPengajarTable() {
    const tbody = document.getElementById('pengajar-table-body');
    if (!tbody) {
        return;
    }
    const semua = getAllPengajar();
    const kelasList = getAllKelas();
    const perPengajar = getKelasPerPengajar(kelasList);
    const hasil = filterPengajar(semua, perPengajar);

    const totalHalaman = Math.max(1, Math.ceil(hasil.length / BARIS_PER_HALAMAN));
    pengajarView.halaman = Math.min(Math.max(1, pengajarView.halaman), totalHalaman);
    const mulai = (pengajarView.halaman - 1) * BARIS_PER_HALAMAN;
    const tampil = hasil.slice(mulai, mulai + BARIS_PER_HALAMAN);

    tbody.innerHTML = tampil.length
        ? tampil.map((p, i) => renderPengajarRow(p, mulai + i + 1, perPengajar)).join('')
        : `<tr><td colspan="7" class="table-empty">${semua.length ? 'Tidak ada pengajar yang cocok dengan pencarian/filter.' : 'Belum ada data pengajar.'}</td></tr>`;

    setText('pengajar-table-info', hasil.length
        ? `Menampilkan ${mulai + 1} - ${mulai + tampil.length} dari ${hasil.length} pengajar`
        : 'Tidak ada data');
    renderPagination(document.getElementById('pengajar-pagination'), pengajarView.halaman, totalHalaman, halaman => {
        pengajarView.halaman = halaman;
        renderPengajarTable();
    });
    renderPengajarRingkasan(semua, kelasList);
}

function bukaFormPengajar(id = null) {
    const card = document.getElementById('pengajar-form-card');
    const form = document.getElementById('form-pengajar');
    const pengajar = id !== null ? getPengajarById(id) : null;
    if (id !== null && !pengajar) {
        tampilkanPesan('error', 'Data pengajar tidak ditemukan. Mungkin sudah dihapus.');
        return;
    }
    pengajarView.editId = pengajar ? pengajar.id : null;
    form.reset();
    PENGAJAR_FIELDS.forEach(field => showFieldError(form, field, ''));
    setText('pengajar-form-title', pengajar ? 'Edit Pengajar' : 'Tambah Pengajar');
    const badge = document.getElementById('pengajar-form-kode');
    badge.hidden = !pengajar;
    setText('pengajar-form-kode', pengajar ? `ID: ${pengajar.kode}` : '');
    if (pengajar) {
        PENGAJAR_FIELDS.forEach(field => {
            form.elements[field].value = pengajar[field] || '';
        });
    } else {
        form.elements.status.value = 'Aktif';
    }
    card.hidden = false;
    card.scrollIntoView({ block: 'start' });
    form.elements.nama.focus();
}

function tutupFormPengajar() {
    document.getElementById('pengajar-form-card').hidden = true;
    pengajarView.editId = null;
}

function readPengajarForm(form) {
    const data = {};
    PENGAJAR_FIELDS.forEach(field => {
        data[field] = form.elements[field].value;
    });
    return data;
}

function simpanFormPengajar(event) {
    event.preventDefault();
    const form = event.target;
    const data = readPengajarForm(form);
    const errors = validatePengajar(data, pengajarView.editId);
    if (!tampilkanErrorForm(form, PENGAJAR_FIELDS, errors)) {
        tampilkanPesan('error', 'Data pengajar belum tersimpan. Periksa kolom yang ditandai merah.');
        return;
    }
    if (pengajarView.editId !== null) {
        const hasil = updatePengajar(pengajarView.editId, data);
        tampilkanPesan('success', `Perubahan data pengajar "${namaLengkapPengajar(hasil)}" berhasil disimpan.`);
    } else {
        const hasil = addPengajar(data);
        resetFilterPengajar(false);
        pengajarView.halaman = Math.ceil(getAllPengajar().length / BARIS_PER_HALAMAN);
        tampilkanPesan('success', `Pengajar "${namaLengkapPengajar(hasil)}" (ID ${hasil.kode}) berhasil ditambahkan.`);
    }
    tutupFormPengajar();
    renderPengajarTable();
    document.getElementById('page-alert').scrollIntoView({ block: 'nearest' });
}

function lihatPengajar(id) {
    const pengajar = getPengajarById(id);
    if (!pengajar) {
        return;
    }
    const kelas = getKelasPerPengajar()[pengajar.id] || [];
    const aktif = pengajar.status === 'Aktif';
    tampilkanDetail('Detail Pengajar', [
        ['ID Pengajar', escapeHtml(pengajar.kode)],
        ['Nama', escapeHtml(namaLengkapPengajar(pengajar))],
        ['NIP', escapeHtml(pengajar.nip || '–')],
        ['Email', escapeHtml(pengajar.email)],
        ['Mata Pelajaran', escapeHtml(pengajar.mapel)],
        ['Kelas yang Diampu', kelas.length
            ? kelas.map(k => `${escapeHtml(k.nama)} <span class="cell-muted">(${k.peserta} siswa)</span>`).join('<br>')
            : 'Belum ada kelas'],
        ['Status', `<span class="badge ${aktif ? 'badge-success' : 'badge-muted'} badge-dot">${escapeHtml(pengajar.status)}</span>`],
    ], () => bukaFormPengajar(pengajar.id));
}

function hapusPengajar(id) {
    const pengajar = getPengajarById(id);
    if (!pengajar) {
        return;
    }
    const nama = namaLengkapPengajar(pengajar);
    const kelas = getKelasPerPengajar()[pengajar.id] || [];
    if (kelas.length) {
        // Kelas tidak boleh kehilangan pengajarnya → tolak dengan penjelasan
        tampilkanPesan('error', `Pengajar "${nama}" tidak dapat dihapus karena masih mengampu ${kelas.length} kelas (${kelas.map(k => k.nama).join(', ')}). Ganti pengajar kelas tersebut di Data Kelas terlebih dahulu.`);
        document.getElementById('page-alert').scrollIntoView({ block: 'nearest' });
        return;
    }
    konfirmasiHapusData({
        judul: 'Hapus Data Pengajar?',
        jenis: 'pengajar',
        nama,
        dampak: `ID ${pengajar.kode}. Pengajar ini tidak sedang mengampu kelas.`,
        onConfirm: () => {
            deletePengajar(pengajar.id);
            if (pengajarView.editId === pengajar.id) {
                tutupFormPengajar();
            }
            renderPengajarTable();
            tampilkanPesan('success', `Pengajar "${nama}" berhasil dihapus.`);
        },
    });
}

function resetFilterPengajar(render = true) {
    pengajarView.cari = '';
    pengajarView.mapel = '';
    pengajarView.status = '';
    pengajarView.halaman = 1;
    document.getElementById('pengajar-search').value = '';
    document.getElementById('pengajar-filter-mapel').value = '';
    document.getElementById('pengajar-filter-status').value = '';
    if (render) {
        renderPengajarTable();
    }
}

function eksporPengajar() {
    const perPengajar = getKelasPerPengajar();
    const hasil = filterPengajar(getAllPengajar(), perPengajar);
    if (!hasil.length) {
        tampilkanPesan('error', 'Tidak ada data pengajar untuk diekspor.');
        return;
    }
    const namaFile = `data-pengajar-${tanggalHariIni()}.csv`;
    unduhCsv(namaFile,
        ['No', 'ID Pengajar', 'Nama', 'NIP', 'Email', 'Mata Pelajaran', 'Kelas yang Diampu', 'Jumlah Kelas', 'Status'],
        hasil.map((p, i) => {
            const kelas = perPengajar[p.id] || [];
            return [i + 1, p.kode, namaLengkapPengajar(p), p.nip, p.email, p.mapel, kelas.map(k => k.nama).join('; '), kelas.length, p.status];
        }));
    tampilkanPesan('success', `${hasil.length} data pengajar diekspor ke file ${namaFile}.`);
}

function initDataPengajarPage() {
    initModalUmum();

    const form = document.getElementById('form-pengajar');
    form.elements.mapel.innerHTML = '<option value="">Pilih mata pelajaran</option>' +
        MAPEL_OPTIONS.map(m => `<option>${escapeHtml(m.nama)}</option>`).join('');
    form.elements.status.innerHTML = STATUS_PENGAJAR.map(s => `<option>${s}</option>`).join('');
    document.getElementById('pengajar-filter-mapel').innerHTML = '<option value="">Semua Mata Pelajaran</option>' +
        MAPEL_OPTIONS.map(m => `<option>${escapeHtml(m.nama)}</option>`).join('');
    renderPengajarTable();

    document.getElementById('pengajar-search').addEventListener('input', event => {
        pengajarView.cari = event.target.value;
        pengajarView.halaman = 1;
        renderPengajarTable();
    });
    const filterMapelPengajar = document.getElementById('pengajar-filter-mapel');
    saatNilaiBerubah(filterMapelPengajar, () => {
        pengajarView.mapel = filterMapelPengajar.value;
        pengajarView.halaman = 1;
        renderPengajarTable();
    });
    const filterStatusPengajar = document.getElementById('pengajar-filter-status');
    saatNilaiBerubah(filterStatusPengajar, () => {
        pengajarView.status = filterStatusPengajar.value;
        pengajarView.halaman = 1;
        renderPengajarTable();
    });
    document.getElementById('btn-reset-filter-pengajar').addEventListener('click', () => resetFilterPengajar());
    document.querySelectorAll('[data-aksi="tambah-pengajar"]').forEach(tombol => tombol.addEventListener('click', () => {
        sembunyikanPesan();
        bukaFormPengajar();
    }));
    document.querySelectorAll('[data-aksi="ekspor-pengajar"]').forEach(tombol => tombol.addEventListener('click', eksporPengajar));
    document.getElementById('btn-batal-pengajar').addEventListener('click', tutupFormPengajar);

    form.addEventListener('submit', simpanFormPengajar);
    pantauPerbaikanForm(form, PENGAJAR_FIELDS, () => validatePengajar(readPengajarForm(form), pengajarView.editId));

    document.getElementById('pengajar-table-body').addEventListener('click', event => {
        const button = event.target.closest('button[data-action]');
        if (!button) {
            return;
        }
        const id = Number(button.dataset.id);
        if (button.dataset.action === 'detail') {
            lihatPengajar(id);
        } else if (button.dataset.action === 'edit') {
            sembunyikanPesan();
            bukaFormPengajar(id);
        } else if (button.dataset.action === 'hapus') {
            hapusPengajar(id);
        }
    });
}

/* =========================
   6C. HALAMAN PERTEMUAN (daftar per kelas, Tambah/Edit/Hapus/Detail, penanda TO PTS & TO PAS)
========================= */

const NAMA_BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September',
    'Oktober', 'November', 'Desember'];

// "2026-09-05" → "5 September 2026"
function formatTanggal(tanggal) {
    if (!tanggalValid(tanggal)) {
        return '–';
    }
    const [y, m, d] = tanggal.split('-').map(Number);
    return `${d} ${NAMA_BULAN[m - 1]} ${y}`;
}

const BADGE_STATUS_PERTEMUAN = { 'Selesai': 'badge-success', 'Berjalan': 'badge-info', 'Belum Dimulai': 'badge-neutral' };

// Badge status efektif pertemuan (otomatis dari jadwal, atau override manual)
function badgeStatusPertemuanHtml(p, list) {
    const status = statusPertemuan(p, hariIni(), list);
    return `<span class="badge ${BADGE_STATUS_PERTEMUAN[status] || 'badge-muted'} badge-dot">${escapeHtml(status)}</span>${p.modeAkses === 'manual' ? ' <span class="badge badge-warning badge-override" title="Status diatur manual oleh Admin/Pengajar">Override</span>' : ''}`;
}

const PERTEMUAN_FIELDS = ['kelasId', 'nomor', 'judul', 'tanggal', 'modeAkses', 'status', 'komponen'];

const pertemuanView = { kelasId: null, editId: null };

function chipKomponenHtml(komponen) {
    return KOMPONEN_PERTEMUAN.map(k => {
        const siap = komponen.includes(k.key);
        return `<li class="chip${siap ? ' chip-ready' : ''}" title="${siap ? 'Siap' : 'Belum siap'}">${siap ? '✓ ' : ''}${escapeHtml(k.singkat)}</li>`;
    }).join('');
}

function renderPertemuanItem(p) {
    const judul = escapeHtml(`Pertemuan ${p.nomor}`);
    const list = getAllPertemuan();
    const status = statusPertemuan(p, hariIni(), list);
    const manual = p.modeAkses === 'manual';
    // Buka Kembali: pertemuan yang tertutup (selesai/belum dimulai) dibuka manual; Kembali ke Otomatis: hapus override
    const aksiAkses = manual
        ? `<button type="button" class="btn btn-tonal btn-small" data-action="otomatis" data-id="${p.id}">Kembali ke Otomatis</button>`
        : status !== 'Berjalan' ? `<button type="button" class="btn btn-tonal btn-small" data-action="buka" data-id="${p.id}">${status === 'Selesai' ? 'Buka Kembali' : 'Buka Lebih Awal'}</button>` : '';
    return `
        <li class="meeting-item" data-pertemuan="${p.id}">
            <div class="meeting-left">
                <span class="meeting-number">${p.nomor}</span>
                <div>
                    <p class="meeting-title">${judul} · ${escapeHtml(p.judul)}</p>
                    <p class="meeting-info">Jadwal ${formatRentangJadwal(jadwalPertemuan(p, list))} · ${p.komponen.length}/${KOMPONEN_PERTEMUAN.length} komponen siap</p>
                    <p class="meeting-info meeting-akses">Mode Akses: ${manual ? `Manual — status otomatis ${escapeHtml(statusOtomatisPertemuan(p, hariIni(), list))}` : 'Otomatis (ikut jadwal)'}</p>
                    <ul class="chip-list" aria-label="Komponen pertemuan">${chipKomponenHtml(p.komponen)}</ul>
                </div>
            </div>
            <div class="actions">
                ${badgeStatusPertemuanHtml(p, list)}
                ${aksiAkses}
                <button type="button" class="btn btn-secondary btn-small" data-action="detail" data-id="${p.id}">Lihat Detail</button>
                <button type="button" class="icon-btn icon-btn-ghost icon-btn-small" data-action="edit" data-id="${p.id}" aria-label="Edit ${judul}">${iconHtml('pencil')}</button>
                <button type="button" class="icon-btn icon-btn-ghost icon-btn-small icon-btn-danger" data-action="hapus" data-id="${p.id}" aria-label="Hapus ${judul}">${iconHtml('trash')}</button>
            </div>
        </li>`;
}

// Penanda TO PTS / TO PAS (event khusus, dikelola di halaman Ruang Try Out)
function renderPenandaTO(jenis, kelasId) {
    const pts = jenis === 'PTS';
    const to = getTOKelas(kelasId, jenis);
    const jadwal = to ? `${formatTanggal(to.tanggal)}, ${escapeHtml(to.waktu)} WIB` : 'belum dijadwalkan';
    return `
        <li class="meeting-item meeting-item-exam">
            <div class="meeting-left">
                <span class="meeting-number">TO</span>
                <div>
                    <p class="meeting-title">TO ${jenis}</p>
                    <p class="meeting-info">Simulasi Penilaian ${pts ? 'Tengah' : 'Akhir'} Semester · ${jadwal} · event khusus, bukan pertemuan biasa</p>
                </div>
            </div>
            <a href="to-${jenis.toLowerCase()}.html?kelas=${kelasId}" class="btn btn-primary btn-small">Kelola TO ${jenis}</a>
        </li>`;
}

function renderPertemuanList() {
    const box = document.getElementById('pertemuan-list');
    if (!box) {
        return;
    }
    const kelas = getKelasById(pertemuanView.kelasId);
    const list = kelas ? getPertemuanByKelas(kelas.id) : [];
    const sebelumPts = list.filter(p => p.nomor <= 6);
    const setelahPts = list.filter(p => p.nomor > 6);

    if (!kelas) {
        box.innerHTML = '<li class="table-empty">Belum ada kelas. Tambahkan kelas di halaman Data Kelas terlebih dahulu.</li>';
    } else if (!list.length) {
        box.innerHTML = '<li class="table-empty">Kelas ini belum memiliki pertemuan. Klik "Tambah Pertemuan" untuk membuat pertemuan pertama.</li>';
    } else {
        box.innerHTML = sebelumPts.map(renderPertemuanItem).join('') + renderPenandaTO('PTS', kelas.id) +
            setelahPts.map(renderPertemuanItem).join('') + renderPenandaTO('PAS', kelas.id);
    }

    const semua = getAllPertemuan();
    const hitung = status => list.filter(p => statusPertemuan(p, hariIni(), semua) === status).length;
    setText('pertemuan-ringkasan', kelas
        ? `${kelas.nama} · ${list.length} pertemuan · ${hitung('Selesai')} selesai · ${hitung('Berjalan')} berjalan · ${hitung('Belum Dimulai')} belum dimulai`
        : 'Belum ada kelas');
    const kembali = document.getElementById('btn-kembali-pertemuan');
    if (kembali) {
        kembali.href = kelas ? `detail-kelas.html?id=${kelas.id}` : 'data-kelas.html';
    }
}

function renderOpsiKelasPertemuan() {
    const kelasList = getAllKelas();
    if (!kelasList.some(k => k.id === pertemuanView.kelasId)) {
        pertemuanView.kelasId = kelasList.length ? kelasList[0].id : null;
    }
    const filter = document.getElementById('pertemuan-filter-kelas');
    filter.innerHTML = opsiKelasHtml(kelasList);
    filter.value = pertemuanView.kelasId ?? '';
    const select = document.getElementById('pertemuan-kelasId');
    select.innerHTML = '<option value="">Pilih kelas</option>' + opsiKelasHtml(kelasList);
}

// Nilai awal form Tambah: nomor berikutnya & tanggal seminggu setelah pertemuan terakhir
function isiDefaultPertemuan(form, kelasId) {
    const list = getPertemuanByKelas(kelasId);
    const terakhir = list[list.length - 1];
    form.elements.nomor.value = terakhir ? terakhir.nomor + 1 : 1;
    form.elements.tanggal.value = terakhir && tanggalValid(terakhir.tanggal) ? tambahHari(terakhir.tanggal, 7) : '';
}

function readPertemuanForm(form) {
    const modeAkses = form.elements.modeAkses.value;
    const lama = pertemuanView.editId !== null ? getPertemuanById(pertemuanView.editId) : null;
    return {
        kelasId: form.elements.kelasId.value,
        nomor: form.elements.nomor.value,
        judul: form.elements.judul.value,
        tanggal: form.elements.tanggal.value,
        modeAkses,
        // Mode otomatis: status tersimpan tidak diubah (status efektif dihitung dari jadwal)
        status: modeAkses === 'otomatis' ? (lama ? lama.status : statusOtomatisPratinjau(form)) : form.elements.status.value,
        komponen: [...form.querySelectorAll('input[name="komponen-item"]:checked')].map(c => c.value),
    };
}

// Status otomatis untuk isian form saat ini (pertemuan yang diedit diganti tanggalnya sementara, tidak disimpan)
function statusOtomatisPratinjau(form) {
    const p = { id: pertemuanView.editId ?? -1, kelasId: Number(form.elements.kelasId.value), tanggal: form.elements.tanggal.value };
    const list = getAllPertemuan().filter(x => x.id !== p.id).concat(p);
    return statusOtomatisPertemuan(p, hariIni(), list);
}

// Info jadwal & status otomatis pada form + kolom Status hanya aktif pada mode Manual
function renderAksesFormPertemuan(form) {
    const p = { id: pertemuanView.editId ?? -1, kelasId: Number(form.elements.kelasId.value), tanggal: form.elements.tanggal.value };
    const list = getAllPertemuan().filter(x => x.id !== p.id).concat(p);
    const jadwal = jadwalPertemuan(p, list);
    const otomatis = statusOtomatisPertemuan(p, hariIni(), list);
    const manual = form.elements.modeAkses.value === 'manual';
    form.elements.status.disabled = !manual;
    if (!manual) {
        form.elements.status.value = otomatis;
    }
    setText('pertemuan-jadwal-info', jadwal
        ? `Tanggal mulai ${formatTanggal(jadwal.mulai)} · tanggal selesai ${formatTanggal(jadwal.selesai)} · status otomatis hari ini: ${otomatis}.${manual ? ' Mode Manual: status di bawah dipakai (override) sampai dikembalikan ke Otomatis.' : ''}`
        : 'Isi kelas dan tanggal untuk melihat jadwal otomatis.');
}

function bukaFormPertemuan(id = null) {
    const card = document.getElementById('pertemuan-form-card');
    const form = document.getElementById('form-pertemuan');
    const pertemuan = id !== null ? getPertemuanById(id) : null;
    if (id !== null && !pertemuan) {
        tampilkanPesan('error', 'Data pertemuan tidak ditemukan. Mungkin sudah dihapus.');
        return;
    }
    pertemuanView.editId = pertemuan ? pertemuan.id : null;
    form.reset();
    PERTEMUAN_FIELDS.forEach(field => showFieldError(form, field, ''));
    setText('pertemuan-form-title', pertemuan ? `Edit Pertemuan ${pertemuan.nomor}` : 'Tambah Pertemuan');

    const data = pertemuan || { kelasId: pertemuanView.kelasId, status: 'Belum Dimulai', modeAkses: 'otomatis', komponen: [] };
    form.elements.kelasId.value = data.kelasId ?? '';
    form.elements.modeAkses.value = data.modeAkses || 'otomatis';
    form.elements.status.value = data.status;
    form.querySelectorAll('input[name="komponen-item"]').forEach(c => {
        c.checked = data.komponen.includes(c.value);
    });
    if (pertemuan) {
        form.elements.nomor.value = pertemuan.nomor;
        form.elements.judul.value = pertemuan.judul;
        form.elements.tanggal.value = pertemuan.tanggal;
    } else if (data.kelasId) {
        isiDefaultPertemuan(form, data.kelasId);
    }
    renderAksesFormPertemuan(form);
    card.hidden = false;
    card.scrollIntoView({ block: 'start' });
    form.elements.judul.focus();
}

function tutupFormPertemuan() {
    document.getElementById('pertemuan-form-card').hidden = true;
    pertemuanView.editId = null;
}

function simpanFormPertemuan(event) {
    event.preventDefault();
    const form = event.target;
    const data = readPertemuanForm(form);
    const errors = validatePertemuan(data, pertemuanView.editId);
    if (!tampilkanErrorForm(form, PERTEMUAN_FIELDS, errors)) {
        tampilkanPesan('error', 'Data pertemuan belum tersimpan. Periksa kolom yang ditandai merah.');
        return;
    }
    const hasil = pertemuanView.editId !== null ? updatePertemuan(pertemuanView.editId, data) : addPertemuan(data);
    const kelas = getKelasById(hasil.kelasId);
    tampilkanPesan('success', pertemuanView.editId !== null
        ? `Perubahan Pertemuan ${hasil.nomor} (${kelas.nama}) berhasil disimpan.`
        : `Pertemuan ${hasil.nomor} "${hasil.judul}" berhasil ditambahkan ke ${kelas.nama}.`);
    // Tampilkan daftar kelas tempat pertemuan disimpan
    pertemuanView.kelasId = hasil.kelasId;
    document.getElementById('pertemuan-filter-kelas').value = hasil.kelasId;
    tutupFormPertemuan();
    renderPertemuanList();
    document.getElementById('page-alert').scrollIntoView({ block: 'nearest' });
}

function lihatPertemuan(id) {
    const p = getPertemuanById(id);
    if (!p) {
        return;
    }
    const kelas = getKelasById(p.kelasId);
    const semua = getAllPertemuan();
    const jadwal = jadwalPertemuan(p, semua);
    const otomatis = statusOtomatisPertemuan(p, hariIni(), semua);
    tampilkanDetail(`Pertemuan ${p.nomor}`, [
        ['Kelas', kelas ? escapeHtml(kelas.nama) : '–'],
        ['Pengajar', kelas ? escapeHtml(kelas.pengajar) : '–'],
        ['Topik', escapeHtml(p.judul)],
        ['Tanggal Mulai', jadwal ? formatTanggal(jadwal.mulai) : '–'],
        ['Tanggal Selesai', jadwal ? `${formatTanggal(jadwal.selesai)} <span class="cell-muted">(1 hari sebelum pertemuan berikutnya, maks. 1 minggu)</span>` : '–'],
        ['Status Otomatis', `<span class="badge ${BADGE_STATUS_PERTEMUAN[otomatis] || 'badge-muted'} badge-dot">${escapeHtml(otomatis)}</span>`],
        ['Mode Akses', escapeHtml(MODE_AKSES_PERTEMUAN[p.modeAkses] || MODE_AKSES_PERTEMUAN.otomatis)],
        ['Status Akses Peserta', `${badgeStatusPertemuanHtml(p, semua)} <span class="cell-muted">${escapeHtml({ 'Berjalan': 'dapat dikerjakan', 'Selesai': 'read-only (hasil lama terlihat, pengiriman baru ditutup)', 'Belum Dimulai': 'belum dapat diakses' }[statusPertemuan(p, hariIni(), semua)])}</span>`],
        ['Komponen Pertemuan', KOMPONEN_PERTEMUAN.map(k => `${p.komponen.includes(k.key) ? '✓' : '–'} ${escapeHtml(k.label)}${p.komponen.includes(k.key) ? '' : ' <span class="cell-muted">(belum siap)</span>'}`).join('<br>')],
        // Pretest / Aktivitas / Latihan: tautan ke data + pintasan Tambah untuk pertemuan ini
        ...Object.keys(JENIS_EVALUASI).map(jenis => {
            const list = getAllEvaluasi().filter(e => e.jenis === jenis && e.pertemuanId === p.id);
            const tambah = `<a class="text-primary" href="evaluasi.html?jenis=${jenis}&aksi=tambah&pertemuan=${p.id}">+ Tambah ${escapeHtml(JENIS_EVALUASI[jenis].label)}</a>`;
            return [`${JENIS_EVALUASI[jenis].label} Terkait`, list.length
                ? `${daftarTautan(list, e => `evaluasi.html?jenis=${jenis}&id=${e.id}`, '')}${jenis !== 'pretest' ? `<br>${tambah}` : ''}`
                : `<span class="cell-muted">Belum ada</span> · ${tambah}`];
        }),
        ['Modul Terkait', daftarTautan(getAllModul().filter(m => m.pertemuanId === p.id), m => `modul.html?id=${m.id}`, 'Belum ada modul')],
        ['Tugas Terkait', daftarTautan(getAllTugas().filter(t => t.pertemuanId === p.id), t => `tugas.html?id=${t.id}`, 'Belum ada tugas')],
        ['Kuis Terkait', daftarTautan(getAllKuis().filter(k => k.pertemuanId === p.id), k => `kuis.html?id=${k.id}`, 'Belum ada kuis')],
    ], () => bukaFormPertemuan(p.id));
}

// Buka Kembali (override manual "Berjalan") / Kembali ke Otomatis. Tanggal & data lain tidak berubah.
function ubahAksesPertemuan(id, aksi) {
    const r = aksi === 'buka' ? aturAksesPertemuan(id, 'manual', 'Berjalan') : aturAksesPertemuan(id, 'otomatis');
    if (!r.ok) {
        tampilkanPesan('error', r.pesan);
        return;
    }
    const p = r.pertemuan;
    renderPertemuanList();
    if (pertemuanView.editId === p.id) {
        bukaFormPertemuan(p.id);
    }
    tampilkanPesan('success', aksi === 'buka'
        ? `Pertemuan ${p.nomor} dibuka ${statusOtomatisPertemuan(p) === 'Belum Dimulai' ? 'lebih awal' : 'kembali'} (override manual: Berjalan). Peserta dapat mengerjakan & mengirim.`
        : `Pertemuan ${p.nomor} kembali ke mode Otomatis — status sekarang: ${statusPertemuan(p)}.`);
}

function hapusPertemuan(id) {
    const p = getPertemuanById(id);
    if (!p) {
        return;
    }
    const kelas = getKelasById(p.kelasId);
    const terkait = getDampakHapusPertemuan(p.id);
    konfirmasiHapusData({
        judul: 'Hapus Pertemuan?',
        jenis: 'pertemuan',
        nama: `Pertemuan ${p.nomor} · ${p.judul}`,
        dampak: [
            kelas ? `Kelas ${kelas.nama}. Pertemuan lain tidak berubah nomornya.` : '',
            terkait.modul ? `${terkait.modul} modul tidak ikut terhapus, tetapi dilepas dari pertemuan ini.` : '',
            terkait.tugas ? `${terkait.tugas} tugas tidak ikut terhapus, tetapi dilepas dari pertemuan ini.` : '',
            terkait.kuis ? `${terkait.kuis} kuis tidak ikut terhapus, tetapi dilepas dari pertemuan ini.` : '',
        ].filter(Boolean).join(' '),
        onConfirm: () => {
            deletePertemuan(p.id);
            if (pertemuanView.editId === p.id) {
                tutupFormPertemuan();
            }
            renderPertemuanList();
            tampilkanPesan('success', `Pertemuan ${p.nomor} "${p.judul}" berhasil dihapus.`);
        },
    });
}

function initPertemuanPage() {
    initModalUmum();
    const params = new URLSearchParams(window.location.search);
    // ?id=N → buka detail pertemuan; ?kelas=N → tampilkan kelas tersebut
    const target = params.get('id') ? getPertemuanById(params.get('id')) : null;
    pertemuanView.kelasId = target ? target.kelasId : Number(params.get('kelas')) || null;

    const form = document.getElementById('form-pertemuan');
    form.elements.status.innerHTML = STATUS_PERTEMUAN.map(s => `<option>${s}</option>`).join('');
    form.elements.modeAkses.innerHTML = Object.entries(MODE_AKSES_PERTEMUAN).map(([v, l]) => `<option value="${v}">${l}</option>`).join('');
    ['modeAkses', 'tanggal', 'kelasId'].forEach(nama => saatNilaiBerubah(form.elements[nama], () => renderAksesFormPertemuan(form)));
    renderOpsiKelasPertemuan();
    renderPertemuanList();

    const filterKelasPertemuan = document.getElementById('pertemuan-filter-kelas');
    saatNilaiBerubah(filterKelasPertemuan, () => {
        pertemuanView.kelasId = Number(filterKelasPertemuan.value);
        tutupFormPertemuan();
        renderPertemuanList();
    });
    document.getElementById('btn-tambah-pertemuan').addEventListener('click', () => {
        sembunyikanPesan();
        bukaFormPertemuan();
    });
    document.getElementById('btn-batal-pertemuan').addEventListener('click', tutupFormPertemuan);
    // Mode Tambah: ganti kelas → nomor & tanggal menyesuaikan kelas tersebut
    saatNilaiBerubah(form.elements.kelasId, () => {
        if (pertemuanView.editId === null && form.elements.kelasId.value) {
            isiDefaultPertemuan(form, form.elements.kelasId.value);
        }
    });
    form.addEventListener('submit', simpanFormPertemuan);
    pantauPerbaikanForm(form, PERTEMUAN_FIELDS, () => validatePertemuan(readPertemuanForm(form), pertemuanView.editId));
    // ?aksi=tambah (pintasan "Tambah Kegiatan" di Dashboard) → langsung buka form Tambah
    if (params.get('aksi') === 'tambah') {
        bukaFormPertemuan();
    }

    document.getElementById('pertemuan-list').addEventListener('click', event => {
        const button = event.target.closest('button[data-action]');
        if (!button) {
            return;
        }
        const id = Number(button.dataset.id);
        if (button.dataset.action === 'detail') {
            lihatPertemuan(id);
        } else if (button.dataset.action === 'edit') {
            sembunyikanPesan();
            bukaFormPertemuan(id);
        } else if (button.dataset.action === 'hapus') {
            hapusPertemuan(id);
        } else if (button.dataset.action === 'buka' || button.dataset.action === 'otomatis') {
            ubahAksesPertemuan(id, button.dataset.action);
        }
    });

    if (target) {
        lihatPertemuan(target.id);
    }
}

/* =========================
   6D. HALAMAN MODUL (daftar, cari/filter, Tambah/Edit/Hapus/Detail; format Tulis Materi / Upload PDF)
========================= */

const MODUL_FIELDS = ['judul', 'kelasId', 'pertemuanId', 'status', 'deskripsi', 'format', 'isi', 'contoh', 'rangkuman', 'gambar', 'file'];
const BADGE_FORMAT_MODUL = { 'Tulis Materi': 'badge-info', 'Upload PDF': 'badge-neutral' };

// fileBaru = file PDF yang baru dipilih di form (beserta isinya); undefined = belum memilih file baru
// gambarBaru = gambar materi yang baru dipilih; undefined = tidak diubah, null = dihapus
// fileDitolak / gambarDitolak = pesan bila file terakhir yang dipilih ditolak (Simpan tetap ditahan sampai diganti)
const modulView = { cari: '', kelas: '', format: '', status: '', halaman: 1, editId: null, fileBaru: undefined, gambarBaru: undefined, fileDitolak: '', gambarDitolak: '' };

function gambarModulForm() {
    if (modulView.gambarBaru !== undefined) {
        return modulView.gambarBaru;
    }
    const lama = modulView.editId !== null ? getModulById(modulView.editId) : null;
    return lama && lama.gambar ? lama.gambar : null;
}

// Validasi form modul + file yang baru dipilih tetapi ditolak (format/ukuran): tetap error agar tidak tersimpan tanpa disadari
function validateModulForm(form) {
    const data = readModulForm(form);
    const errors = validateModul(data, modulView.editId);
    if (modulView.fileDitolak && data.format === 'Upload PDF') {
        errors.file = modulView.fileDitolak;
    }
    if (modulView.gambarDitolak && data.format === 'Tulis Materi') {
        errors.gambar = modulView.gambarDitolak;
    }
    return errors;
}

function renderInfoGambarModul() {
    const g = gambarModulForm();
    setText('modul-gambar-info', g
        ? `Gambar: ${g.nama} (${formatUkuran(g.ukuran)})`
        : `JPG, PNG, GIF, atau WEBP, maks. ${BATAS_GAMBAR_KB} KB. Gambar tampil di atas isi materi peserta.`);
    // Tombol Hapus juga membatalkan gambar yang ditolak
    document.getElementById('btn-hapus-gambar-modul').hidden = !g && !modulView.gambarDitolak;
    const pratinjau = document.getElementById('modul-gambar-pratinjau');
    pratinjau.hidden = !g;
    if (g) {
        document.getElementById('modul-gambar-img').src = g.data;
    }
}

function labelPertemuan(p) {
    return p ? `Pertemuan ${p.nomor}` : 'Tanpa pertemuan';
}

function filterModul(list, kelasMap, pertemuanMap) {
    const cari = modulView.cari.trim().toLowerCase();
    return list.filter(m => {
        if (modulView.kelas && m.kelasId !== Number(modulView.kelas)) {
            return false;
        }
        if (modulView.format && m.format !== modulView.format) {
            return false;
        }
        if (modulView.status && m.status !== modulView.status) {
            return false;
        }
        if (!cari) {
            return true;
        }
        const kelas = kelasMap[m.kelasId];
        const pertemuan = pertemuanMap[m.pertemuanId];
        return [m.judul, m.deskripsi, kelas && kelas.nama, pertemuan && pertemuan.judul, m.file && m.file.nama]
            .some(teks => String(teks || '').toLowerCase().includes(cari));
    });
}

function renderModulRow(m, nomor, kelasMap, pertemuanMap) {
    const kelas = kelasMap[m.kelasId];
    const pertemuan = pertemuanMap[m.pertemuanId];
    const judul = escapeHtml(m.judul);
    return `
        <tr${atributBarisPantau('modul', m.id)}>
            <td class="col-no">${nomor}</td>
            <td>
                <p class="cell-title">${judulPantauHtml('modul', m.id, judul)}</p>
                <p class="cell-meta">${escapeHtml(m.format === 'Upload PDF' && m.file ? `${m.file.nama} · ${formatUkuran(m.file.ukuran)}` : m.deskripsi)}</p>
            </td>
            <td>${kelas ? escapeHtml(labelSingkat(kelas)) : '–'}</td>
            <td>${pertemuan
                ? `${labelPertemuan(pertemuan)}<p class="cell-meta">${escapeHtml(pertemuan.judul)}</p>`
                : '<span class="cell-muted">Tanpa pertemuan</span>'}</td>
            <td><span class="badge ${BADGE_FORMAT_MODUL[m.format] || 'badge-muted'}">${escapeHtml(m.format)}</span></td>
            <td><span class="badge ${m.status === 'Aktif' ? 'badge-success' : 'badge-warning'} badge-dot">${escapeHtml(m.status)}</span></td>
            <td>
                <div class="actions">
                    <button type="button" class="icon-btn icon-btn-ghost icon-btn-small" data-action="detail" data-id="${m.id}" aria-label="Lihat detail ${judul}">${iconHtml('eye')}</button>
                    <button type="button" class="icon-btn icon-btn-ghost icon-btn-small" data-action="edit" data-id="${m.id}" aria-label="Edit ${judul}">${iconHtml('pencil')}</button>
                    <button type="button" class="icon-btn icon-btn-ghost icon-btn-small icon-btn-danger" data-action="hapus" data-id="${m.id}" aria-label="Hapus ${judul}">${iconHtml('trash')}</button>
                </div>
            </td>
        </tr>`;
}

function renderModulTable() {
    const tbody = document.getElementById('modul-table-body');
    if (!tbody) {
        return;
    }
    const kelasMap = Object.fromEntries(getAllKelas().map(k => [k.id, k]));
    // Hanya modul dari kelas yang boleh dilihat (Pengajar: kelas yang diampu)
    const semua = getAllModul().filter(m => kelasMap[m.kelasId]);
    const pertemuanMap = Object.fromEntries(getAllPertemuan().map(p => [p.id, p]));
    const hasil = filterModul(semua, kelasMap, pertemuanMap);

    const totalHalaman = Math.max(1, Math.ceil(hasil.length / BARIS_PER_HALAMAN));
    modulView.halaman = Math.min(Math.max(1, modulView.halaman), totalHalaman);
    const mulai = (modulView.halaman - 1) * BARIS_PER_HALAMAN;
    const tampil = hasil.slice(mulai, mulai + BARIS_PER_HALAMAN);

    tbody.innerHTML = tampil.length
        ? tampil.map((m, i) => renderModulRow(m, mulai + i + 1, kelasMap, pertemuanMap)).join('')
        : `<tr><td colspan="7" class="table-empty">${semua.length ? 'Tidak ada modul yang cocok dengan pencarian/filter.' : 'Belum ada modul.'}</td></tr>`;

    setText('modul-table-info', hasil.length ? `Menampilkan ${mulai + 1}-${mulai + tampil.length} dari ${hasil.length} modul` : 'Tidak ada data');
    renderPagination(document.getElementById('modul-pagination'), modulView.halaman, totalHalaman, halaman => {
        modulView.halaman = halaman;
        renderModulTable();
    });
    const aktif = semua.filter(m => m.status === 'Aktif').length;
    setText('modul-ringkasan', `${semua.length} modul terdaftar · ${aktif} aktif · ${semua.length - aktif} draft`);
}

function renderOpsiKelasModul() {
    const kelasList = getAllKelas();
    const filter = document.getElementById('modul-filter-kelas');
    const pilih = filter.value;
    filter.innerHTML = '<option value="">Semua Kelas</option>' + opsiKelasHtml(kelasList);
    filter.value = [...filter.options].some(o => o.value === pilih) ? pilih : '';
    modulView.kelas = filter.value;
    document.getElementById('modul-kelasId').innerHTML = '<option value="">Pilih kelas</option>' + opsiKelasHtml(kelasList);
}

// Pilihan pertemuan mengikuti kelas yang dipilih di form (dipakai form Modul, Tugas, Kuis)
function renderOpsiPertemuan(form, kelasId, pilih = '') {
    const list = kelasId ? getPertemuanByKelas(kelasId) : [];
    form.elements.pertemuanId.innerHTML = `<option value="">${kelasId ? 'Pilih pertemuan' : 'Pilih kelas terlebih dahulu'}</option>` +
        list.map(p => `<option value="${p.id}">Pertemuan ${p.nomor} · ${escapeHtml(p.judul)}</option>`).join('');
    form.elements.pertemuanId.value = list.some(p => String(p.id) === String(pilih)) ? String(pilih) : '';
}

function formatModulTerpilih(form) {
    const radio = form.querySelector('input[name="format-pilih"]:checked');
    return radio ? radio.value : '';
}

// Tampilkan isian sesuai format: Tulis Materi → editor teks, Upload PDF → pilih file
function tampilkanIsianFormat(form) {
    const format = formatModulTerpilih(form);
    document.getElementById('modul-isi-group').hidden = format !== 'Tulis Materi';
    document.getElementById('modul-gambar-group').hidden = format !== 'Tulis Materi';
    document.getElementById('modul-contoh-group').hidden = format !== 'Tulis Materi';
    document.getElementById('modul-rangkuman-group').hidden = format !== 'Tulis Materi';
    document.getElementById('modul-file-group').hidden = format !== 'Upload PDF';
}

function fileModulForm() {
    if (modulView.fileBaru !== undefined) {
        return modulView.fileBaru;
    }
    const lama = modulView.editId !== null ? getModulById(modulView.editId) : null;
    return lama && lama.file ? lama.file : null;
}

function renderInfoFileModul() {
    const file = fileModulForm();
    // Dapat dibuka peserta bila isinya tersimpan atau berupa PDF contoh di assets/pdf (lihat urlPdfModul)
    const bisaDibuka = file && (file.data || PDF_CONTOH.includes(file.nama));
    setText('modul-file-info', file
        ? `${bisaDibuka ? 'File tersimpan' : 'File tercatat (hanya nama, belum dapat dibuka peserta)'}: ${file.nama} (${formatUkuran(file.ukuran)})`
        : 'Belum ada file dipilih.');
}

function readModulForm(form) {
    const gambar = gambarModulForm();
    return {
        judul: form.elements.judul.value,
        kelasId: form.elements.kelasId.value,
        pertemuanId: form.elements.pertemuanId.value,
        status: form.elements.status.value,
        deskripsi: form.elements.deskripsi.value,
        format: formatModulTerpilih(form),
        isi: form.elements.isi.value,
        contoh: form.elements.contoh.value,
        rangkuman: form.elements.rangkuman.value,
        gambar: gambar ? { ...gambar, keterangan: document.getElementById('modul-gambar-keterangan').value } : null,
        file: fileModulForm(),
    };
}

function bukaFormModul(id = null) {
    const card = document.getElementById('modul-form-card');
    const form = document.getElementById('form-modul');
    const modul = id !== null ? getModulById(id) : null;
    if (id !== null && !modul) {
        tampilkanPesan('error', 'Data modul tidak ditemukan. Mungkin sudah dihapus.');
        return;
    }
    modulView.editId = modul ? modul.id : null;
    modulView.fileBaru = undefined;
    modulView.gambarBaru = undefined;
    modulView.fileDitolak = '';
    modulView.gambarDitolak = '';
    form.reset();
    MODUL_FIELDS.forEach(field => showFieldError(form, field, ''));
    setText('modul-form-title', modul ? 'Edit Modul' : 'Tambah Modul');
    document.getElementById('modul-gambar-keterangan').value = modul && modul.gambar ? modul.gambar.keterangan || '' : '';
    renderInfoGambarModul();

    const kelasAwal = modul ? modul.kelasId : (Number(modulView.kelas) || '');
    form.elements.kelasId.value = kelasAwal;
    renderOpsiPertemuan(form, kelasAwal, modul ? modul.pertemuanId : '');
    form.elements.status.value = modul ? modul.status : 'Aktif';
    const format = modul ? modul.format : 'Tulis Materi';
    form.querySelectorAll('input[name="format-pilih"]').forEach(r => {
        r.checked = r.value === format;
    });
    if (modul) {
        form.elements.judul.value = modul.judul;
        form.elements.deskripsi.value = modul.deskripsi;
        form.elements.isi.value = modul.isi || '';
        form.elements.contoh.value = modul.contoh || '';
        form.elements.rangkuman.value = modul.rangkuman || '';
    }
    tampilkanIsianFormat(form);
    renderInfoFileModul();
    card.hidden = false;
    card.scrollIntoView({ block: 'start' });
    form.elements.judul.focus();
}

function tutupFormModul() {
    document.getElementById('modul-form-card').hidden = true;
    modulView.editId = null;
    modulView.fileBaru = undefined;
    modulView.gambarBaru = undefined;
}

function simpanFormModul(event) {
    event.preventDefault();
    const form = event.target;
    const data = readModulForm(form);
    const errors = validateModulForm(form);
    if (!tampilkanErrorForm(form, MODUL_FIELDS, errors)) {
        tampilkanPesan('error', 'Modul belum tersimpan. Periksa kolom yang ditandai merah.');
        return;
    }
    if (modulView.editId !== null) {
        const hasil = updateModul(modulView.editId, data);
        if (!hasil) {
            tampilkanPesan('error', PESAN_PENYIMPANAN_PENUH);
            return;
        }
        tampilkanPesan('success', `Perubahan modul "${hasil.judul}" berhasil disimpan.`);
    } else {
        const hasil = addModul(data);
        if (!hasil) {
            tampilkanPesan('error', PESAN_PENYIMPANAN_PENUH);
            return;
        }
        resetFilterModul(false);
        modulView.halaman = Math.ceil(getAllModul().length / BARIS_PER_HALAMAN);
        tampilkanPesan('success', hasil.format === 'Upload PDF'
            ? `Modul "${hasil.judul}" berhasil ditambahkan. File ${hasil.file.nama} tersimpan di browser dan dapat dibuka peserta.`
            : `Modul "${hasil.judul}" berhasil ditambahkan${hasil.gambar ? ' beserta gambar pendukung' : ''}.`);
    }
    tutupFormModul();
    renderModulTable();
    document.getElementById('page-alert').scrollIntoView({ block: 'nearest' });
}

function lihatModul(id) {
    const m = getModulById(id);
    if (!m) {
        return;
    }
    const kelas = getKelasById(m.kelasId);
    const pertemuan = m.pertemuanId !== null ? getPertemuanById(m.pertemuanId) : null;
    // PDF tersimpan dibuka lewat Blob URL bertipe application/pdf (bukan data: URL yang diblokir/blank di tab baru)
    let urlPdf = m.format === 'Upload PDF' ? urlPdfModul(m) : null;
    if (urlPdf && m.file.data) {
        const bytes = bytesDariDataUrl(urlPdf);
        urlPdf = bytesPdfValid(bytes) ? blobUrlPdf(bytes) : null;
    }
    const isi = m.format === 'Upload PDF'
        ? ['File PDF', m.file
            ? `${urlPdf ? `<a class="text-primary" href="${escapeHtml(urlPdf)}" target="_blank" rel="noopener">${escapeHtml(m.file.nama)}</a>` : escapeHtml(m.file.nama)} <span class="cell-muted">(${formatUkuran(m.file.ukuran)})</span><br><span class="cell-muted">${urlPdf ? 'Dapat dibuka peserta.' : 'Hanya nama file yang tercatat; unggah ulang PDF agar dapat dibuka peserta.'}</span>`
            : '–']
        : ['Isi Materi', `${m.gambar && m.gambar.data ? `<figure class="materi-gambar materi-gambar-kecil"><img src="${escapeHtml(m.gambar.data)}" alt="${escapeHtml(m.gambar.keterangan || `Gambar materi ${m.judul}`)}">${m.gambar.keterangan ? `<figcaption>${escapeHtml(m.gambar.keterangan)}</figcaption>` : ''}</figure>` : ''}<div class="materi-preview">${escapeHtml(m.isi)}</div>`];
    tampilkanDetail('Detail Modul', [
        ['Judul Modul', escapeHtml(m.judul)],
        ['Kelas', kelas ? escapeHtml(kelas.nama) : '–'],
        ['Pertemuan', pertemuan
            ? `<a class="text-primary" href="pertemuan.html?id=${pertemuan.id}">Pertemuan ${pertemuan.nomor} · ${escapeHtml(pertemuan.judul)}</a>`
            : '<span class="cell-muted">Tanpa pertemuan (pertemuan sudah dihapus)</span>'],
        ['Deskripsi', escapeHtml(m.deskripsi)],
        ['Format', `<span class="badge ${BADGE_FORMAT_MODUL[m.format] || 'badge-muted'}">${escapeHtml(m.format)}</span>`],
        isi,
        ['Status', `<span class="badge ${m.status === 'Aktif' ? 'badge-success' : 'badge-warning'} badge-dot">${escapeHtml(m.status)}</span>`],
    ], () => bukaFormModul(m.id));
}

function hapusModul(id) {
    const m = getModulById(id);
    if (!m) {
        return;
    }
    const kelas = getKelasById(m.kelasId);
    konfirmasiHapusData({
        judul: 'Hapus Modul?',
        jenis: 'modul',
        nama: m.judul,
        dampak: kelas ? `Kelas ${kelas.nama}.` : '',
        onConfirm: () => {
            deleteModul(m.id);
            if (modulView.editId === m.id) {
                tutupFormModul();
            }
            renderModulTable();
            tampilkanPesan('success', `Modul "${m.judul}" berhasil dihapus.`);
        },
    });
}

function resetFilterModul(render = true) {
    Object.assign(modulView, { cari: '', kelas: '', format: '', status: '', halaman: 1 });
    ['modul-search', 'modul-filter-kelas', 'modul-filter-format', 'modul-filter-status'].forEach(id => {
        document.getElementById(id).value = '';
    });
    if (render) {
        renderModulTable();
    }
}

function initModulPage() {
    initModalUmum();
    const form = document.getElementById('form-modul');
    form.elements.status.innerHTML = STATUS_MODUL.map(s => `<option>${s}</option>`).join('');
    renderOpsiKelasModul();

    const params = new URLSearchParams(window.location.search);
    const target = params.get('id') ? getModulById(params.get('id')) : null;
    if (params.get('kelas')) {
        const filter = document.getElementById('modul-filter-kelas');
        filter.value = params.get('kelas');
        modulView.kelas = filter.value;
    }
    renderModulTable();

    // Pencarian: setiap ketikan ("input"); dropdown filter: setiap pilihan berubah (input/change)
    const pasangFilter = (id, key, eventName = 'change') => {
        const el = document.getElementById(id);
        const terapkan = () => {
            modulView[key] = el.value;
            modulView.halaman = 1;
            renderModulTable();
        };
        if (eventName === 'input') {
            el.addEventListener('input', terapkan);
        } else {
            saatNilaiBerubah(el, terapkan);
        }
    };
    pasangFilter('modul-search', 'cari', 'input');
    pasangFilter('modul-filter-kelas', 'kelas');
    pasangFilter('modul-filter-format', 'format');
    pasangFilter('modul-filter-status', 'status');
    document.getElementById('btn-reset-filter-modul').addEventListener('click', () => resetFilterModul());
    document.getElementById('btn-tambah-modul').addEventListener('click', () => {
        sembunyikanPesan();
        bukaFormModul();
    });
    document.getElementById('btn-batal-modul').addEventListener('click', tutupFormModul);

    saatNilaiBerubah(form.elements.kelasId, () => renderOpsiPertemuan(form, form.elements.kelasId.value));
    form.querySelectorAll('input[name="format-pilih"]').forEach(r => r.addEventListener('change', () => tampilkanIsianFormat(form)));
    // PDF: isinya dibaca & disimpan di browser (maks. BATAS_SIMPAN_PDF_KB) agar dapat dibuka peserta
    form.elements.file.addEventListener('change', async () => {
        const file = form.elements.file.files[0];
        if (!file) {
            return;
        }
        const tolak = !/\.pdf$/i.test(file.name) ? 'File harus berformat PDF (.pdf).'
            : file.size > BATAS_SIMPAN_PDF_KB * 1024 ? `Ukuran PDF maksimal ${BATAS_SIMPAN_PDF_KB / 1024} MB agar dapat disimpan dan dibuka peserta.` : '';
        modulView.fileDitolak = tolak;
        if (tolak) {
            showFieldError(form, 'file', tolak);
            form.elements.file.value = '';
            return;
        }
        try {
            const hasil = await bacaFileDataUrl(file);
            // MIME selalu application/pdf (file.type bisa kosong), dan isi harus benar-benar PDF
            const data = normalisasiDataUrlPdf(hasil.data);
            if (!bytesPdfValid(bytesDariDataUrl(data))) {
                modulView.fileDitolak = 'File ini bukan PDF yang valid (isi file rusak atau bukan dokumen PDF).';
                showFieldError(form, 'file', modulView.fileDitolak);
                form.elements.file.value = '';
                renderInfoFileModul();
                return;
            }
            modulView.fileBaru = { nama: hasil.nama, ukuran: hasil.ukuran, data };
            showFieldError(form, 'file', '');
        } catch (error) {
            modulView.fileDitolak = 'File tidak dapat dibaca. Coba pilih ulang file.';
            showFieldError(form, 'file', modulView.fileDitolak);
        }
        renderInfoFileModul();
    });
    // Gambar pendukung (Tulis Materi)
    form.elements.gambar.addEventListener('change', async () => {
        const file = form.elements.gambar.files[0];
        if (!file) {
            return;
        }
        const tolak = !EKSTENSI_GAMBAR.includes(ekstensiFile(file.name)) ? `Gambar harus berformat ${EKSTENSI_GAMBAR.join(', ').toUpperCase()}.`
            : file.size > BATAS_GAMBAR_KB * 1024 ? `Ukuran gambar maksimal ${BATAS_GAMBAR_KB} KB agar dapat disimpan di browser.` : '';
        modulView.gambarDitolak = tolak;
        if (tolak) {
            showFieldError(form, 'gambar', tolak);
            form.elements.gambar.value = '';
            renderInfoGambarModul();
            return;
        }
        try {
            const hasil = await bacaFileDataUrl(file);
            modulView.gambarBaru = { nama: hasil.nama, ukuran: hasil.ukuran, data: hasil.data };
            showFieldError(form, 'gambar', '');
        } catch (error) {
            modulView.gambarDitolak = 'Gambar tidak dapat dibaca. Coba pilih ulang file.';
            showFieldError(form, 'gambar', modulView.gambarDitolak);
        }
        form.elements.gambar.value = '';
        renderInfoGambarModul();
    });
    document.getElementById('btn-hapus-gambar-modul').addEventListener('click', () => {
        modulView.gambarBaru = null;
        modulView.gambarDitolak = '';
        document.getElementById('modul-gambar-keterangan').value = '';
        showFieldError(form, 'gambar', '');
        renderInfoGambarModul();
        form.elements.gambar.focus();
    });
    form.addEventListener('submit', simpanFormModul);
    pantauPerbaikanForm(form, MODUL_FIELDS, () => validateModulForm(form));

    document.getElementById('modul-table-body').addEventListener('click', event => {
        const button = event.target.closest('button[data-action]');
        if (!button) {
            return;
        }
        const id = Number(button.dataset.id);
        if (button.dataset.action === 'detail') {
            lihatModul(id);
        } else if (button.dataset.action === 'edit') {
            sembunyikanPesan();
            bukaFormModul(id);
        } else if (button.dataset.action === 'hapus') {
            hapusModul(id);
        }
    });

    if (target) {
        lihatModul(target.id);
    }
}

/* =========================
   6E. HALAMAN TUGAS (daftar, cari/filter, Tambah/Edit/Hapus/Detail)
   Tidak ada fitur pengumpulan file siswa (admin panel client-side).
========================= */

const TUGAS_FIELDS = ['judul', 'kelasId', 'pertemuanId', 'deadline', 'status', 'deskripsi', 'soal'];
const BADGE_STATUS_TUGAS = { 'Aktif': 'badge-success', 'Draft': 'badge-warning', 'Ditutup': 'badge-muted' };

// fileSoal: undefined = tidak diubah, null = dihapus, objek = file baru (sudah tersimpan di penyimpanan file browser)
// fileSoalDitolak = pesan bila file terakhir yang dipilih ditolak (Simpan ditahan sampai diganti/dihapus)
const tugasView = { cari: '', kelas: '', status: '', halaman: 1, editId: null, fileSoal: undefined, fileSoalDitolak: '', fileSoalProses: false };

// Baca file pilihan pengguna sebagai data URL. Hasil Promise<{ nama, ukuran, tipe, data }>
function bacaFileDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ nama: file.name, ukuran: file.size, tipe: file.type || '', data: String(reader.result) });
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

function fileSoalForm() {
    if (tugasView.fileSoal !== undefined) {
        return tugasView.fileSoal;
    }
    const lama = tugasView.editId !== null ? getTugasById(tugasView.editId) : null;
    return lama && lama.fileSoal ? lama.fileSoal : null;
}

function renderInfoFileSoal() {
    const file = fileSoalForm();
    setText('tugas-filesoal-info', tugasView.fileSoalProses ? 'Menyimpan file…'
        : file ? `File: ${file.nama} (${formatUkuran(file.ukuran)})` : 'Mis. lembar soal dari buku/modul (foto atau PDF).');
    document.getElementById('btn-hapus-filesoal').hidden = !file && !tugasView.fileSoalDitolak;
    const wadah = document.getElementById('tugas-filesoal-preview');
    wadah.hidden = !file;
    const kunci = file ? `${file.nama}|${file.fileId || (file.data || '').length}` : '';
    if (file && wadah.dataset.kunci !== kunci) {
        wadah.dataset.kunci = kunci;
        tampilkanFileTugas(wadah, file, { judul: 'Dokumentasi soal' });
    } else if (!file) {
        wadah.dataset.kunci = '';
        wadah.innerHTML = '';
    }
}

// Metode & dokumentasi soal ditampilkan errornya terpisah (radio & input file tidak memakai showFieldError)
function tampilkanErrorKhususTugas(form, errors) {
    setText('metode-error', errors.metode || '');
    document.getElementById('tugas-metode-group').classList.toggle('is-invalid', Boolean(errors.metode));
    setText('fileSoal-error', errors.fileSoal || '');
    form.elements.fileSoal.classList.toggle('is-invalid', Boolean(errors.fileSoal));
    return !errors.metode && !errors.fileSoal;
}

// Validasi form tugas + file yang dipilih tetapi ditolak
function validateTugasForm(form) {
    const errors = validateTugas(readTugasForm(form), tugasView.editId);
    if (tugasView.fileSoalDitolak) {
        errors.fileSoal = tugasView.fileSoalDitolak;
    }
    return errors;
}

function badgeTugas(status) {
    return `<span class="badge ${BADGE_STATUS_TUGAS[status] || 'badge-muted'} badge-dot">${escapeHtml(status)}</span>`;
}

function filterTugas(list, kelasMap, pertemuanMap) {
    const cari = tugasView.cari.trim().toLowerCase();
    return list.filter(t => {
        if (tugasView.kelas && t.kelasId !== Number(tugasView.kelas)) {
            return false;
        }
        if (tugasView.status && t.status !== tugasView.status) {
            return false;
        }
        if (!cari) {
            return true;
        }
        const kelas = kelasMap[t.kelasId];
        const pertemuan = pertemuanMap[t.pertemuanId];
        return [t.judul, t.deskripsi, kelas && kelas.nama, pertemuan && pertemuan.judul]
            .some(teks => String(teks || '').toLowerCase().includes(cari));
    });
}

function renderTugasRow(t, nomor, kelasMap, pertemuanMap, kumpul = {}) {
    const kelas = kelasMap[t.kelasId];
    const pertemuan = pertemuanMap[t.pertemuanId];
    const judul = escapeHtml(t.judul);
    const [tanggal, jam] = deadlineValid(t.deadline) ? t.deadline.split('T') : ['', ''];
    const k = kumpul[t.id] || { total: 0, perlu: 0 };
    return `
        <tr${atributBarisPantau('tugas', t.id)}>
            <td class="col-no">${nomor}</td>
            <td>
                <p class="cell-title">${judulPantauHtml('tugas', t.id, judul)}${t.fileSoal ? ` <span class="cell-meta" title="Ada dokumentasi soal">${iconHtml('file')}</span>` : ''}</p>
                <p class="cell-meta">${escapeHtml(t.soal || t.deskripsi)}</p>
                <p class="cell-meta">Jawaban: ${escapeHtml(METODE_TUGAS[t.metode] || METODE_TUGAS.keduanya)}</p>
            </td>
            <td>${kelas ? escapeHtml(labelSingkat(kelas)) : '–'}</td>
            <td>${pertemuan
                ? `${labelPertemuan(pertemuan)}<p class="cell-meta">${escapeHtml(pertemuan.judul)}</p>`
                : '<span class="cell-muted">Tanpa pertemuan</span>'}</td>
            <td>${tanggal ? `<p class="cell-title">${formatTanggal(tanggal)}</p><p class="cell-meta">${jam} WIB</p>` : '–'}</td>
            <td>${badgeTugas(t.status)}<p class="cell-meta">${k.total}/${kelas ? kelas.peserta : 0} mengumpulkan${k.perlu ? ` · <span class="status-inline-warning">${k.perlu} perlu dinilai</span>` : ''}</p></td>
            <td>
                <div class="actions">
                    <a class="icon-btn icon-btn-ghost icon-btn-small" href="pengumpulan-tugas.html?id=${t.id}" aria-label="Pengumpulan & penilaian ${judul}" title="Pengumpulan & Penilaian">${iconHtml('inbox')}</a>
                    <button type="button" class="icon-btn icon-btn-ghost icon-btn-small" data-action="detail" data-id="${t.id}" aria-label="Lihat detail ${judul}" title="Lihat">${iconHtml('eye')}</button>
                    <button type="button" class="icon-btn icon-btn-ghost icon-btn-small" data-action="edit" data-id="${t.id}" aria-label="Edit ${judul}" title="Edit">${iconHtml('pencil')}</button>
                    <button type="button" class="icon-btn icon-btn-ghost icon-btn-small icon-btn-danger" data-action="hapus" data-id="${t.id}" aria-label="Hapus ${judul}">${iconHtml('trash')}</button>
                </div>
            </td>
        </tr>`;
}

function renderTugasTable() {
    const tbody = document.getElementById('tugas-table-body');
    if (!tbody) {
        return;
    }
    const kelasMap = Object.fromEntries(getAllKelas().map(k => [k.id, k]));
    // Hanya tugas dari kelas yang boleh dilihat (Pengajar: kelas yang diampu)
    const semua = getAllTugas().filter(t => kelasMap[t.kelasId]);
    const pertemuanMap = Object.fromEntries(getAllPertemuan().map(p => [p.id, p]));
    const hasil = filterTugas(semua, kelasMap, pertemuanMap);

    const totalHalaman = Math.max(1, Math.ceil(hasil.length / BARIS_PER_HALAMAN));
    tugasView.halaman = Math.min(Math.max(1, tugasView.halaman), totalHalaman);
    const mulai = (tugasView.halaman - 1) * BARIS_PER_HALAMAN;
    const tampil = hasil.slice(mulai, mulai + BARIS_PER_HALAMAN);

    // Jumlah pengumpulan per tugas (semua & yang belum dinilai)
    const kumpul = {};
    getAllHasil().filter(h => h.jenis === 'tugas').forEach(h => {
        kumpul[h.itemId] = kumpul[h.itemId] || { total: 0, perlu: 0 };
        kumpul[h.itemId].total++;
        if (h.status !== 'Dinilai') {
            kumpul[h.itemId].perlu++;
        }
    });
    tbody.innerHTML = tampil.length
        ? tampil.map((t, i) => renderTugasRow(t, mulai + i + 1, kelasMap, pertemuanMap, kumpul)).join('')
        : `<tr><td colspan="7" class="table-empty">${semua.length ? 'Tidak ada tugas yang cocok dengan pencarian/filter.' : 'Belum ada tugas.'}</td></tr>`;

    setText('tugas-table-info', hasil.length ? `Menampilkan ${mulai + 1}-${mulai + tampil.length} dari ${hasil.length} tugas` : 'Tidak ada data');
    renderPagination(document.getElementById('tugas-pagination'), tugasView.halaman, totalHalaman, halaman => {
        tugasView.halaman = halaman;
        renderTugasTable();
    });
    const hitung = status => semua.filter(t => t.status === status).length;
    setText('tugas-ringkasan', `${semua.length} tugas terdaftar · ${hitung('Aktif')} aktif · ${hitung('Draft')} draft · ${hitung('Ditutup')} ditutup`);
}

function renderOpsiKelasTugas() {
    const kelasList = getAllKelas();
    const filter = document.getElementById('tugas-filter-kelas');
    const pilih = filter.value;
    filter.innerHTML = '<option value="">Semua Kelas</option>' + opsiKelasHtml(kelasList);
    filter.value = [...filter.options].some(o => o.value === pilih) ? pilih : '';
    tugasView.kelas = filter.value;
    document.getElementById('tugas-kelasId').innerHTML = '<option value="">Pilih kelas</option>' + opsiKelasHtml(kelasList);
}

function readTugasForm(form) {
    const data = {};
    TUGAS_FIELDS.forEach(field => {
        data[field] = form.elements[field].value;
    });
    const metode = form.querySelector('input[name="metode"]:checked');
    data.metode = metode ? metode.value : '';
    data.fileSoal = fileSoalForm();
    return data;
}

function bukaFormTugas(id = null) {
    const card = document.getElementById('tugas-form-card');
    const form = document.getElementById('form-tugas');
    const tugas = id !== null ? getTugasById(id) : null;
    if (id !== null && !tugas) {
        tampilkanPesan('error', 'Data tugas tidak ditemukan. Mungkin sudah dihapus.');
        return;
    }
    buangFileSoalBelumDisimpan();
    tugasView.editId = tugas ? tugas.id : null;
    tugasView.fileSoal = undefined;
    tugasView.fileSoalDitolak = '';
    form.reset();
    TUGAS_FIELDS.forEach(field => showFieldError(form, field, ''));
    tampilkanErrorKhususTugas(form, {});
    setText('tugas-form-title', tugas ? 'Edit Tugas' : 'Tambah Tugas');
    renderInfoFileSoal();
    const metode = tugas ? tugas.metode || 'keduanya' : 'keduanya';
    form.querySelectorAll('input[name="metode"]').forEach(r => {
        r.checked = r.value === metode;
    });

    const kelasAwal = tugas ? tugas.kelasId : (Number(tugasView.kelas) || '');
    form.elements.kelasId.value = kelasAwal;
    renderOpsiPertemuan(form, kelasAwal, tugas ? tugas.pertemuanId : '');
    form.elements.status.value = tugas ? tugas.status : 'Draft';
    if (tugas) {
        form.elements.judul.value = tugas.judul;
        form.elements.deskripsi.value = tugas.deskripsi;
        form.elements.soal.value = tugas.soal || '';
        form.elements.deadline.value = tugas.deadline;
    }
    renderPetunjukDeadline(form);
    card.hidden = false;
    card.scrollIntoView({ block: 'start' });
    form.elements.judul.focus();
}

// File soal yang sudah diunggah tetapi form dibatalkan → isi file di penyimpanan browser dibuang
function buangFileSoalBelumDisimpan() {
    const lama = tugasView.editId !== null ? getTugasById(tugasView.editId) : null;
    if (tugasView.fileSoal && !(lama && samaFile(lama.fileSoal, tugasView.fileSoal))) {
        hapusFileBrowser(tugasView.fileSoal);
    }
}

function tutupFormTugas() {
    buangFileSoalBelumDisimpan();
    document.getElementById('tugas-form-card').hidden = true;
    tugasView.editId = null;
    tugasView.fileSoal = undefined;
    tugasView.fileSoalDitolak = '';
}

// Petunjuk di bawah kolom Deadline: tanggal pertemuan yang dipilih (dipakai untuk validasi deadline)
function renderPetunjukDeadline(form) {
    const pertemuan = getPertemuanById(form.elements.pertemuanId.value);
    setText('deadline-hint', pertemuan && tanggalValid(pertemuan.tanggal)
        ? `Tanggal pertemuan: ${formatTanggal(pertemuan.tanggal)}. Deadline boleh di hari yang sama, tetapi tidak boleh sebelum tanggal ini.`
        : 'Pilih pertemuan terlebih dahulu. Deadline terisi otomatis 6 hari setelah pertemuan (bisa diubah).');
}

// Pilih pertemuan di form Tambah → deadline otomatis 6 hari setelah pertemuan pukul 23:59 (bila masih kosong)
function isiDeadlineOtomatis(form) {
    const pertemuan = getPertemuanById(form.elements.pertemuanId.value);
    if (tugasView.editId === null && pertemuan && !form.elements.deadline.value && tanggalValid(pertemuan.tanggal)) {
        form.elements.deadline.value = `${tambahHari(pertemuan.tanggal, 6)}T23:59`;
    }
}

function simpanFormTugas(event) {
    event.preventDefault();
    const form = event.target;
    if (tugasView.fileSoalProses) {
        tampilkanPesan('error', 'Dokumentasi soal masih disimpan. Tunggu sebentar, lalu simpan lagi.');
        return;
    }
    const data = readTugasForm(form);
    const errors = validateTugasForm(form);
    const okKhusus = tampilkanErrorKhususTugas(form, errors);
    if (!tampilkanErrorForm(form, TUGAS_FIELDS, errors) || !okKhusus) {
        if (!TUGAS_FIELDS.some(f => errors[f])) {
            (errors.metode ? form.querySelector('input[name="metode"]') : form.elements.fileSoal).focus();
        }
        tampilkanPesan('error', 'Tugas belum tersimpan. Periksa kolom yang ditandai merah.');
        return;
    }
    if (tugasView.editId !== null) {
        const sebelum = getTugasById(tugasView.editId);
        const hasil = updateTugas(tugasView.editId, data);
        // Dokumentasi soal lama yang diganti/dihapus dibuang dari penyimpanan file browser
        if (hasil && sebelum && sebelum.fileSoal && !samaFile(sebelum.fileSoal, hasil.fileSoal)) {
            hapusFileBrowser(sebelum.fileSoal);
        }
        if (!hasil) {
            tampilkanPesan('error', PESAN_PENYIMPANAN_PENUH);
            return;
        }
        tampilkanPesan('success', `Perubahan tugas "${hasil.judul}" berhasil disimpan.`);
    } else {
        const hasil = addTugas(data);
        if (!hasil) {
            tampilkanPesan('error', PESAN_PENYIMPANAN_PENUH);
            return;
        }
        resetFilterTugas(false);
        tugasView.halaman = Math.ceil(getAllTugas().length / BARIS_PER_HALAMAN);
        tampilkanPesan('success', `Tugas "${hasil.judul}" berhasil ditambahkan (deadline ${formatDeadline(hasil.deadline)}, jawaban: ${METODE_TUGAS[hasil.metode]}).`);
    }
    tugasView.fileSoal = undefined;   // sudah tersimpan → jangan dibuang saat form ditutup
    tugasView.editId = null;
    tutupFormTugas();
    renderTugasTable();
    document.getElementById('page-alert').scrollIntoView({ block: 'nearest' });
}

function lihatTugas(id) {
    const t = getTugasById(id);
    if (!t) {
        return;
    }
    const kelas = getKelasById(t.kelasId);
    const pertemuan = t.pertemuanId !== null ? getPertemuanById(t.pertemuanId) : null;
    tampilkanDetail('Detail Tugas', [
        ['Judul Tugas', escapeHtml(t.judul)],
        ['Kelas', kelas ? `${escapeHtml(kelas.nama)} <span class="cell-muted">(${escapeHtml(kelas.mapel)})</span>` : '–'],
        ['Pengajar', kelas ? escapeHtml(kelas.pengajar) : '–'],
        ['Pertemuan', pertemuan
            ? `<a class="text-primary" href="pertemuan.html?id=${pertemuan.id}">Pertemuan ${pertemuan.nomor} · ${escapeHtml(pertemuan.judul)}</a>`
            : '<span class="cell-muted">Tanpa pertemuan (pertemuan sudah dihapus)</span>'],
        ['Petunjuk', `<div class="materi-preview">${escapeHtml(t.deskripsi)}</div>`],
        ['Soal', t.soal ? `<div class="materi-preview pre-wrap">${escapeHtml(t.soal)}</div>` : '<span class="cell-muted">– (soal berupa dokumentasi)</span>'],
        ['Dokumentasi Soal', tautanLampiran(t.fileSoal, 'Tidak ada')],
        ['Metode Pengumpulan', escapeHtml(METODE_TUGAS[t.metode] || METODE_TUGAS.keduanya)],
        ['Deadline', formatDeadline(t.deadline)],
        ['Status', badgeTugas(t.status)],
        ['Pengumpulan', `<a class="text-primary" href="pengumpulan-tugas.html?id=${t.id}">${getAllHasil().filter(h => h.jenis === 'tugas' && h.itemId === t.id).length} jawaban peserta — lihat &amp; beri nilai</a>`],
    ], () => bukaFormTugas(t.id));
}

function hapusTugas(id) {
    const t = getTugasById(id);
    if (!t) {
        return;
    }
    const kelas = getKelasById(t.kelasId);
    konfirmasiHapusData({
        judul: 'Hapus Tugas?',
        jenis: 'tugas',
        nama: t.judul,
        dampak: kelas ? `Kelas ${kelas.nama}.` : '',
        onConfirm: () => {
            deleteTugas(t.id);
            if (tugasView.editId === t.id) {
                tutupFormTugas();
            }
            renderTugasTable();
            tampilkanPesan('success', `Tugas "${t.judul}" berhasil dihapus.`);
        },
    });
}

function resetFilterTugas(render = true) {
    Object.assign(tugasView, { cari: '', kelas: '', status: '', halaman: 1 });
    ['tugas-search', 'tugas-filter-kelas', 'tugas-filter-status'].forEach(id => {
        document.getElementById(id).value = '';
    });
    if (render) {
        renderTugasTable();
    }
}

function initTugasPage() {
    initModalUmum();
    const form = document.getElementById('form-tugas');
    form.elements.status.innerHTML = STATUS_TUGAS.map(s => `<option>${s}</option>`).join('');
    renderOpsiKelasTugas();

    const params = new URLSearchParams(window.location.search);
    const target = params.get('id') ? getTugasById(params.get('id')) : null;
    if (params.get('kelas')) {
        const filter = document.getElementById('tugas-filter-kelas');
        filter.value = params.get('kelas');
        tugasView.kelas = filter.value;
    }
    renderTugasTable();

    // Pencarian: setiap ketikan ("input"); dropdown filter: setiap pilihan berubah (input/change)
    const pasangFilter = (id, key, eventName = 'change') => {
        const el = document.getElementById(id);
        const terapkan = () => {
            tugasView[key] = el.value;
            tugasView.halaman = 1;
            renderTugasTable();
        };
        if (eventName === 'input') {
            el.addEventListener('input', terapkan);
        } else {
            saatNilaiBerubah(el, terapkan);
        }
    };
    pasangFilter('tugas-search', 'cari', 'input');
    pasangFilter('tugas-filter-kelas', 'kelas');
    pasangFilter('tugas-filter-status', 'status');
    document.getElementById('btn-reset-filter-tugas').addEventListener('click', () => resetFilterTugas());
    document.getElementById('btn-tambah-tugas').addEventListener('click', () => {
        sembunyikanPesan();
        bukaFormTugas();
    });
    document.getElementById('btn-batal-tugas').addEventListener('click', tutupFormTugas);
    // Ganti Kelas → pilihan Pertemuan & petunjuk Deadline diperbarui; ganti Pertemuan → petunjuk tanggal diperbarui
    saatNilaiBerubah(form.elements.kelasId, () => {
        renderOpsiPertemuan(form, form.elements.kelasId.value);
        renderPetunjukDeadline(form);
    });
    saatNilaiBerubah(form.elements.pertemuanId, () => {
        isiDeadlineOtomatis(form);
        renderPetunjukDeadline(form);
    });
    // Dokumentasi soal: dicek dulu (format & ukuran), lalu disimpan di penyimpanan file browser
    form.elements.fileSoal.addEventListener('change', async () => {
        const file = form.elements.fileSoal.files[0];
        if (!file) {
            return;
        }
        const err = validateFileTugas({ nama: file.name, ukuran: file.size }, 'soal', { butuhIsi: false });
        tugasView.fileSoalDitolak = err;
        if (!err) {
            tugasView.fileSoalProses = true;
            renderInfoFileSoal();
            try {
                const meta = await simpanFileBrowser(file);
                buangFileSoalBelumDisimpan();
                tugasView.fileSoal = meta;
            } catch (error) {
                tugasView.fileSoalDitolak = error.message || 'File tidak dapat disimpan. Coba pilih ulang file.';
            }
            tugasView.fileSoalProses = false;
        }
        tampilkanErrorKhususTugas(form, { fileSoal: tugasView.fileSoalDitolak });
        form.elements.fileSoal.value = '';
        renderInfoFileSoal();
    });
    document.getElementById('btn-hapus-filesoal').addEventListener('click', () => {
        buangFileSoalBelumDisimpan();
        tugasView.fileSoal = null;
        tugasView.fileSoalDitolak = '';
        tampilkanErrorKhususTugas(form, {});
        renderInfoFileSoal();
        form.elements.fileSoal.focus();
    });
    form.addEventListener('change', event => {
        if (event.target.name === 'metode') {
            tampilkanErrorKhususTugas(form, { fileSoal: tugasView.fileSoalDitolak });
        }
    });
    form.addEventListener('submit', simpanFormTugas);
    pantauPerbaikanForm(form, TUGAS_FIELDS, () => validateTugasForm(form));

    document.getElementById('tugas-table-body').addEventListener('click', event => {
        const button = event.target.closest('button[data-action]');
        if (!button) {
            return;
        }
        const id = Number(button.dataset.id);
        if (button.dataset.action === 'detail') {
            lihatTugas(id);
        } else if (button.dataset.action === 'edit') {
            sembunyikanPesan();
            bukaFormTugas(id);
        } else if (button.dataset.action === 'hapus') {
            hapusTugas(id);
        }
    });

    if (target) {
        lihatTugas(target.id);
    }
}

/* =========================
   6F. HALAMAN KUIS (daftar, cari/filter, Tambah/Edit/Hapus/Detail)
   Mata pelajaran mengikuti kelas yang dipilih (tidak diketik ulang).
========================= */

const KUIS_FIELDS = ['judul', 'kelasId', 'pertemuanId', 'deskripsi', 'jumlahSoal', 'durasi', 'status'];

const kuisView = { cari: '', kelas: '', status: '', halaman: 1, editId: null };

function filterKuis(list, kelasMap, pertemuanMap) {
    const cari = kuisView.cari.trim().toLowerCase();
    return list.filter(k => {
        if (kuisView.kelas && k.kelasId !== Number(kuisView.kelas)) {
            return false;
        }
        if (kuisView.status && k.status !== kuisView.status) {
            return false;
        }
        if (!cari) {
            return true;
        }
        const kelas = kelasMap[k.kelasId];
        const pertemuan = pertemuanMap[k.pertemuanId];
        return [k.judul, kelas && kelas.nama, kelas && kelas.mapel, pertemuan && pertemuan.judul]
            .some(teks => String(teks || '').toLowerCase().includes(cari));
    });
}

function renderKuisRow(k, nomor, kelasMap, pertemuanMap) {
    const kelas = kelasMap[k.kelasId];
    const pertemuan = pertemuanMap[k.pertemuanId];
    const judul = escapeHtml(k.judul);
    return `
        <tr${atributBarisPantau('kuis', k.id)}>
            <td class="col-no">${nomor}</td>
            <td class="cell-title">${judulPantauHtml('kuis', k.id, judul)}</td>
            <td>${kelas ? `${escapeHtml(labelSingkat(kelas))}<p class="cell-meta">${escapeHtml(kelas.mapel)}</p>` : '–'}</td>
            <td>${pertemuan
                ? `${labelPertemuan(pertemuan)}<p class="cell-meta">${escapeHtml(pertemuan.judul)}</p>`
                : '<span class="cell-muted">Tanpa pertemuan</span>'}</td>
            <td>${(n => (n && n >= k.jumlahSoal ? `${n} Soal` : `<span class="status-inline-warning">${n} / ${k.jumlahSoal} Soal</span>`))(getSoalKuis(k).length)}<p class="cell-meta">${k.durasi} menit · soal dibuat pengajar</p></td>
            <td>${badgeTugas(k.status)}</td>
            <td>
                <div class="actions">
                    <a class="icon-btn icon-btn-ghost icon-btn-small" href="kelola-soal.html?jenis=kuis&id=${k.id}" aria-label="Kelola soal ${judul}" title="Kelola Soal (tambah, edit, hapus soal)">${iconHtml('list')}</a>
                    ${getSoalKuis(k).length ? `<a class="icon-btn icon-btn-ghost icon-btn-small" href="kerjakan.html?jenis=kuis&id=${k.id}" aria-label="Preview ${judul}" title="Preview seperti peserta">${iconHtml('play')}</a>` : ''}
                    <button type="button" class="icon-btn icon-btn-ghost icon-btn-small" data-action="detail" data-id="${k.id}" aria-label="Lihat ${judul}" title="Lihat">${iconHtml('eye')}</button>
                    <button type="button" class="icon-btn icon-btn-ghost icon-btn-small" data-action="edit" data-id="${k.id}" aria-label="Edit ${judul}" title="Edit">${iconHtml('pencil')}</button>
                    <button type="button" class="icon-btn icon-btn-ghost icon-btn-small icon-btn-danger" data-action="hapus" data-id="${k.id}" aria-label="Hapus ${judul}" title="Hapus">${iconHtml('trash')}</button>
                </div>
            </td>
        </tr>`;
}

function renderKuisTable() {
    const tbody = document.getElementById('kuis-table-body');
    if (!tbody) {
        return;
    }
    const kelasMap = Object.fromEntries(getAllKelas().map(k => [k.id, k]));
    // Hanya kuis dari kelas yang boleh dilihat (Pengajar: kelas yang diampu)
    const semua = getAllKuis().filter(k => kelasMap[k.kelasId]);
    const pertemuanMap = Object.fromEntries(getAllPertemuan().map(p => [p.id, p]));
    const hasil = filterKuis(semua, kelasMap, pertemuanMap);

    const totalHalaman = Math.max(1, Math.ceil(hasil.length / BARIS_PER_HALAMAN));
    kuisView.halaman = Math.min(Math.max(1, kuisView.halaman), totalHalaman);
    const mulai = (kuisView.halaman - 1) * BARIS_PER_HALAMAN;
    const tampil = hasil.slice(mulai, mulai + BARIS_PER_HALAMAN);

    tbody.innerHTML = tampil.length
        ? tampil.map((k, i) => renderKuisRow(k, mulai + i + 1, kelasMap, pertemuanMap)).join('')
        : `<tr><td colspan="7" class="table-empty">${semua.length ? 'Tidak ada kuis yang cocok dengan pencarian/filter.' : 'Belum ada kuis.'}</td></tr>`;

    setText('kuis-table-info', hasil.length ? `Menampilkan ${mulai + 1}-${mulai + tampil.length} dari ${hasil.length} kuis` : 'Tidak ada data');
    renderPagination(document.getElementById('kuis-pagination'), kuisView.halaman, totalHalaman, halaman => {
        kuisView.halaman = halaman;
        renderKuisTable();
    });
    const hitung = status => semua.filter(k => k.status === status).length;
    const totalSoal = semua.reduce((sum, k) => sum + getSoalKuis(k).length, 0);
    setText('kuis-ringkasan', `${semua.length} kuis terdaftar · ${hitung('Aktif')} aktif · ${hitung('Draft')} draft · ${hitung('Ditutup')} ditutup · ${totalSoal} soal`);
}

function renderOpsiKelasKuis() {
    const kelasList = getAllKelas();
    const filter = document.getElementById('kuis-filter-kelas');
    const pilih = filter.value;
    filter.innerHTML = '<option value="">Semua Kelas</option>' + opsiKelasHtml(kelasList);
    filter.value = [...filter.options].some(o => o.value === pilih) ? pilih : '';
    kuisView.kelas = filter.value;
    document.getElementById('kuis-kelasId').innerHTML = '<option value="">Pilih kelas</option>' + opsiKelasHtml(kelasList);
}

// Mata pelajaran (hanya tampil) mengikuti kelas yang dipilih
function renderMapelKuis(form) {
    const kelas = getKelasById(form.elements.kelasId.value);
    document.getElementById('kuis-mapel').value = kelas ? kelas.mapel : '';
}

function readKuisForm(form) {
    const data = {};
    KUIS_FIELDS.forEach(field => {
        data[field] = form.elements[field].value;
    });
    return data;
}

// Kolom Jumlah Soal = rencana banyak soal yang dibuat Pengajar sendiri (bukan dari Bank Soal)
function renderIsianJumlahSoalKuis(form) {
    const kuis = kuisView.editId !== null ? getKuisById(kuisView.editId) : null;
    const dibuat = kuis ? getSoalKuis(kuis).length : 0;
    if (!Number(form.elements.jumlahSoal.value)) {
        form.elements.jumlahSoal.value = 10;
    }
    setText('jumlahSoal-hint', kuis
        ? `Sudah dibuat ${dibuat} soal. Jumlah soal tidak boleh kurang dari ${dibuat}. Soal dibuat/diubah lewat Kelola Soal.`
        : 'Banyak soal yang akan Anda buat sendiri (satu per satu) setelah kuis disimpan. Kuis dapat Aktif setelah semua soal dibuat.');
}

function bukaFormKuis(id = null) {
    const card = document.getElementById('kuis-form-card');
    const form = document.getElementById('form-kuis');
    const kuis = id !== null ? getKuisById(id) : null;
    if (id !== null && !kuis) {
        tampilkanPesan('error', 'Data kuis tidak ditemukan. Mungkin sudah dihapus.');
        return;
    }
    kuisView.editId = kuis ? kuis.id : null;
    form.reset();
    KUIS_FIELDS.forEach(field => showFieldError(form, field, ''));
    setText('kuis-form-title', kuis ? 'Edit Kuis' : 'Buat Kuis');
    setText('btn-simpan-kuis', kuis ? 'Simpan Perubahan' : 'Simpan & Buat Soal');

    const kelasAwal = kuis ? kuis.kelasId : (Number(kuisView.kelas) || '');
    form.elements.kelasId.value = kelasAwal;
    renderOpsiPertemuan(form, kelasAwal, kuis ? kuis.pertemuanId : '');
    renderMapelKuis(form);
    form.elements.status.value = kuis ? kuis.status : 'Draft';
    form.elements.judul.value = kuis ? kuis.judul : '';
    form.elements.deskripsi.value = kuis ? kuis.deskripsi || '' : '';
    form.elements.jumlahSoal.value = kuis ? kuis.jumlahSoal : 10;
    form.elements.durasi.value = kuis ? kuis.durasi : 20;
    renderIsianJumlahSoalKuis(form);
    card.hidden = false;
    card.scrollIntoView({ block: 'start' });
    form.elements.judul.focus();
}

function tutupFormKuis() {
    document.getElementById('kuis-form-card').hidden = true;
    kuisView.editId = null;
}

function simpanFormKuis(event) {
    event.preventDefault();
    const form = event.target;
    const data = readKuisForm(form);
    const errors = validateKuis(data, kuisView.editId);
    if (!tampilkanErrorForm(form, KUIS_FIELDS, errors)) {
        tampilkanPesan('error', 'Kuis belum tersimpan. Periksa kolom yang ditandai merah.');
        return;
    }
    if (kuisView.editId !== null) {
        const hasil = updateKuis(kuisView.editId, data);
        tampilkanPesan('success', `Perubahan kuis "${hasil.judul}" berhasil disimpan.`);
    } else {
        // Kuis baru tersimpan tanpa soal, lalu langsung ke Kelola Soal untuk membuat soal satu per satu
        const hasil = addKuis({ ...data, soal: [] });
        pindahHalaman(`kelola-soal.html?jenis=kuis&id=${hasil.id}&baru=1`);
        return;
    }
    tutupFormKuis();
    renderKuisTable();
    document.getElementById('page-alert').scrollIntoView({ block: 'nearest' });
}

function lihatKuis(id) {
    const k = getKuisById(id);
    if (!k) {
        return;
    }
    const kelas = getKelasById(k.kelasId);
    const pertemuan = k.pertemuanId !== null ? getPertemuanById(k.pertemuanId) : null;
    tampilkanDetail('Detail Kuis', [
        ['Judul Kuis', escapeHtml(k.judul)],
        ['Kelas', kelas ? escapeHtml(kelas.nama) : '–'],
        ['Mata Pelajaran', kelas ? escapeHtml(kelas.mapel) : '–'],
        ['Pengajar', kelas ? escapeHtml(kelas.pengajar) : '–'],
        ['Pertemuan', pertemuan
            ? `<a class="text-primary" href="pertemuan.html?id=${pertemuan.id}">Pertemuan ${pertemuan.nomor} · ${escapeHtml(pertemuan.judul)}</a>`
            : '<span class="cell-muted">Tanpa pertemuan (pertemuan sudah dihapus)</span>'],
        ['Deskripsi', k.deskripsi ? escapeHtml(k.deskripsi) : '<span class="cell-muted">–</span>'],
        ['Jumlah Soal', `${getSoalKuis(k).length} dari ${k.jumlahSoal} soal dibuat <span class="cell-muted">(soal dibuat pengajar, bukan dari Bank Soal)</span>`],
        ['Durasi', `${k.durasi} menit`],
        ['Pengerjaan Peserta', (kerja => `${kerja.selesai} selesai${kerja.sedang ? ` · ${kerja.sedang} sedang mengerjakan` : ''}`)(hitungPengerjaanItem('kuis', k.id))],
        ['Status', badgeTugas(k.status)],
    ], () => bukaFormKuis(k.id));
    const tombolSoal = document.getElementById('modal-detail-soal');
    if (tombolSoal) {
        tombolSoal.href = `kelola-soal.html?jenis=kuis&id=${k.id}`;
    }
}

function hapusKuis(id) {
    const k = getKuisById(id);
    if (!k) {
        return;
    }
    const kelas = getKelasById(k.kelasId);
    konfirmasiHapusData({
        judul: 'Hapus Kuis?',
        jenis: 'kuis',
        nama: k.judul,
        dampak: kelas ? `Kelas ${kelas.nama}.` : '',
        onConfirm: () => {
            deleteKuis(k.id);
            if (kuisView.editId === k.id) {
                tutupFormKuis();
            }
            renderKuisTable();
            tampilkanPesan('success', `Kuis "${k.judul}" berhasil dihapus.`);
        },
    });
}

function resetFilterKuis(render = true) {
    Object.assign(kuisView, { cari: '', kelas: '', status: '', halaman: 1 });
    ['kuis-search', 'kuis-filter-kelas', 'kuis-filter-status'].forEach(id => {
        document.getElementById(id).value = '';
    });
    if (render) {
        renderKuisTable();
    }
}

function initKuisPage() {
    initModalUmum();
    const form = document.getElementById('form-kuis');
    form.elements.status.innerHTML = STATUS_KUIS.map(s => `<option>${s}</option>`).join('');
    renderOpsiKelasKuis();

    const params = new URLSearchParams(window.location.search);
    const target = params.get('id') ? getKuisById(params.get('id')) : null;
    if (params.get('kelas')) {
        const filter = document.getElementById('kuis-filter-kelas');
        filter.value = params.get('kelas');
        kuisView.kelas = filter.value;
    }
    renderKuisTable();

    const search = document.getElementById('kuis-search');
    search.addEventListener('input', () => {
        kuisView.cari = search.value;
        kuisView.halaman = 1;
        renderKuisTable();
    });
    ['kelas', 'status'].forEach(key => {
        const select = document.getElementById(`kuis-filter-${key}`);
        saatNilaiBerubah(select, () => {
            kuisView[key] = select.value;
            kuisView.halaman = 1;
            renderKuisTable();
        });
    });
    document.getElementById('btn-reset-filter-kuis').addEventListener('click', () => resetFilterKuis());
    document.getElementById('btn-tambah-kuis').addEventListener('click', () => {
        sembunyikanPesan();
        bukaFormKuis();
    });
    document.getElementById('btn-batal-kuis').addEventListener('click', tutupFormKuis);
    // Ganti Kelas → pilihan Pertemuan & Mata Pelajaran mengikuti kelas
    saatNilaiBerubah(form.elements.kelasId, () => {
        renderOpsiPertemuan(form, form.elements.kelasId.value);
        renderMapelKuis(form);
    });
    form.addEventListener('submit', simpanFormKuis);
    pantauPerbaikanForm(form, KUIS_FIELDS, () => validateKuis(readKuisForm(form), kuisView.editId));

    document.getElementById('kuis-table-body').addEventListener('click', event => {
        const button = event.target.closest('button[data-action]');
        if (!button) {
            return;
        }
        const id = Number(button.dataset.id);
        if (button.dataset.action === 'detail') {
            lihatKuis(id);
        } else if (button.dataset.action === 'edit') {
            sembunyikanPesan();
            bukaFormKuis(id);
        } else if (button.dataset.action === 'hapus') {
            hapusKuis(id);
        }
    });

    if (target) {
        lihatKuis(target.id);
    }
}

/* =========================
   6G. HALAMAN TRY OUT (TO PTS & TO PAS — satu kode, jenis dari <body data-jenis>)
   Daftar, cari/filter, Tambah/Edit/Hapus, kartu Detail & Ketentuan dari data.
========================= */

const TO_FIELDS = ['judul', 'kelasId', 'tanggal', 'waktu', 'durasi', 'jumlahSoal', 'status'];
const BADGE_STATUS_TO = { 'Terjadwal': 'badge-info', 'Draft': 'badge-warning', 'Selesai': 'badge-success' };

const toView = { jenis: 'PTS', cari: '', kelas: '', status: '', halaman: 1, editId: null, dipilihId: null };

function badgeTO(status) {
    return `<span class="badge ${BADGE_STATUS_TO[status] || 'badge-muted'} badge-dot">${escapeHtml(status)}</span>`;
}

// "Pertemuan 1 – 6" dari cakupan TO kelas
function labelCakupanTO(kelasId, jenis) {
    const { pertemuan } = getCakupanTO(kelasId, jenis);
    if (!pertemuan.length) {
        return 'Belum ada pertemuan';
    }
    return `Pertemuan ${pertemuan[0].nomor} – ${pertemuan[pertemuan.length - 1].nomor}`;
}

function filterTO(list, kelasMap) {
    const cari = toView.cari.trim().toLowerCase();
    return list.filter(t => {
        if (toView.kelas && t.kelasId !== Number(toView.kelas)) {
            return false;
        }
        if (toView.status && t.status !== toView.status) {
            return false;
        }
        if (!cari) {
            return true;
        }
        const kelas = kelasMap[t.kelasId];
        return [t.judul, kelas && kelas.nama, kelas && kelas.mapel]
            .some(teks => String(teks || '').toLowerCase().includes(cari));
    });
}

function renderTORow(t, nomor, kelasMap) {
    const kelas = kelasMap[t.kelasId];
    const judul = escapeHtml(t.judul);
    return `
        <tr${t.id === toView.dipilihId ? ' class="is-selected"' : ''}>
            <td class="col-no">${nomor}</td>
            <td class="cell-title">${judul}</td>
            <td>${kelas ? `${escapeHtml(kelas.nama)}<p class="cell-meta">${escapeHtml(kelas.mapel)}</p>` : '–'}</td>
            <td><p class="cell-title">${formatTanggal(t.tanggal)}</p><p class="cell-meta">${escapeHtml(t.waktu)} WIB</p></td>
            <td>${t.durasi} Menit</td>
            <td>${(n => (n ? `${n} Soal` : '<span class="status-inline-warning">Belum ada soal</span>'))(getSoalTO(t).length)}<p class="cell-meta">${Array.isArray(t.soal) ? 'disusun' : 'dari bank'}</p></td>
            <td>${badgeTO(t.status)}</td>
            <td>
                <div class="actions">
                    <a class="icon-btn icon-btn-ghost icon-btn-small" href="kelola-soal.html?jenis=to&id=${t.id}" aria-label="Kelola soal ${judul}" title="Kelola Soal">${iconHtml('list')}</a>
                    ${getSoalTO(t).length ? `<a class="icon-btn icon-btn-ghost icon-btn-small" href="kerjakan.html?jenis=to&id=${t.id}" aria-label="Preview ${judul}" title="Preview seperti peserta">${iconHtml('play')}</a>` : ''}
                    <button type="button" class="icon-btn icon-btn-ghost icon-btn-small" data-action="detail" data-id="${t.id}" aria-label="Lihat detail ${judul}" title="Lihat">${iconHtml('eye')}</button>
                    <button type="button" class="icon-btn icon-btn-ghost icon-btn-small" data-action="edit" data-id="${t.id}" aria-label="Edit ${judul}" title="Edit">${iconHtml('pencil')}</button>
                    <button type="button" class="icon-btn icon-btn-ghost icon-btn-small icon-btn-danger" data-action="hapus" data-id="${t.id}" aria-label="Hapus ${judul}">${iconHtml('trash')}</button>
                </div>
            </td>
        </tr>`;
}

// Kartu "Detail TO" & "Ketentuan" untuk TO yang dipilih
function renderDetailTO() {
    const t = toView.dipilihId !== null ? getTOById(toView.dipilihId) : null;
    const body = document.getElementById('to-detail-body');
    const ketentuan = document.getElementById('to-ketentuan');
    const tombolEdit = document.getElementById('btn-edit-to-detail');
    if (!body) {
        return;
    }
    const tombolSoal = document.getElementById('btn-soal-to-detail');
    if (!t) {
        setText('to-detail-subtitle', `Pilih TO ${toView.jenis} pada tabel untuk melihat detail`);
        body.innerHTML = `<div><dt>Belum ada TO yang dipilih</dt><dd>–</dd></div>`;
        ketentuan.innerHTML = `<li>Belum ada TO ${toView.jenis} yang dipilih.</li>`;
        tombolEdit.hidden = true;
        if (tombolSoal) {
            tombolSoal.hidden = true;
        }
        return;
    }
    if (tombolSoal) {
        tombolSoal.hidden = false;
        tombolSoal.href = `kelola-soal.html?jenis=to&id=${t.id}`;
    }
    const kelas = getKelasById(t.kelasId);
    const info = JENIS_TO[t.jenis];
    setText('to-detail-subtitle', `${t.judul} — ${kelas ? kelas.nama : 'kelas tidak ditemukan'}`);
    const baris = [
        ['Judul Try Out', escapeHtml(t.judul)],
        ['Kelas', kelas ? escapeHtml(kelas.nama) : '–'],
        ['Mata Pelajaran', kelas ? escapeHtml(kelas.mapel) : '–'],
        ['Pengajar', kelas ? escapeHtml(kelas.pengajar) : '–'],
        ['Jenis', `Simulasi ${escapeHtml(info.nama)} (${t.jenis})`],
        ['Tanggal', formatTanggal(t.tanggal)],
        ['Waktu Mulai', `${escapeHtml(t.waktu)} WIB`],
        ['Durasi', `${t.durasi} Menit`],
        ['Jumlah Soal', `${getSoalTO(t).length} Soal <span class="cell-muted">(${Array.isArray(t.soal) ? 'disusun pengajar/admin' : 'diambil dari kumpulan soal bawaan'})</span>`],
        ['Pengerjaan Peserta', (kerja => `${kerja.selesai} selesai${kerja.sedang ? ` · ${kerja.sedang} sedang mengerjakan` : ''}`)(hitungPengerjaanItem('to', t.id))],
        ['Cakupan Materi', kelas
            ? `<a class="text-primary" href="pertemuan.html?kelas=${kelas.id}">${labelCakupanTO(kelas.id, t.jenis)}</a>`
            : '–'],
        ['Peserta Sasaran', kelas ? `${kelas.peserta} peserta` : '–'],
        ['Status', badgeTO(t.status)],
    ];
    body.innerHTML = baris.map(([label, isi]) => `<div><dt>${escapeHtml(label)}</dt><dd>${isi}</dd></div>`).join('');
    ketentuan.innerHTML = [
        'Peserta mengerjakan secara daring sesuai jadwal.',
        `Waktu berjalan otomatis selama ${t.durasi} menit.`,
        'Setiap peserta memiliki 1 kali kesempatan.',
        `Nilai TO ${t.jenis} berkontribusi 30% pada nilai akhir.`,
        'TO adalah simulasi ujian sekolah, bukan ujian resmi dan bukan penentu kelulusan.',
    ].map(teks => `<li>${escapeHtml(teks)}</li>`).join('');
    tombolEdit.hidden = false;
}

function renderTOTable() {
    const tbody = document.getElementById('to-table-body');
    if (!tbody) {
        return;
    }
    const kelasMap = Object.fromEntries(getAllKelas().map(k => [k.id, k]));
    // Hanya TO dari kelas yang boleh dilihat (Pengajar: kelas yang diampu)
    const semua = getAllTO(toView.jenis).filter(t => kelasMap[t.kelasId]);
    const hasil = filterTO(semua, kelasMap);

    // TO yang dipilih harus masih ada; bila tidak, pilih baris pertama hasil filter
    if (!semua.some(t => t.id === toView.dipilihId)) {
        toView.dipilihId = hasil.length ? hasil[0].id : null;
    }

    const totalHalaman = Math.max(1, Math.ceil(hasil.length / BARIS_PER_HALAMAN));
    toView.halaman = Math.min(Math.max(1, toView.halaman), totalHalaman);
    const mulai = (toView.halaman - 1) * BARIS_PER_HALAMAN;
    const tampil = hasil.slice(mulai, mulai + BARIS_PER_HALAMAN);

    tbody.innerHTML = tampil.length
        ? tampil.map((t, i) => renderTORow(t, mulai + i + 1, kelasMap)).join('')
        : `<tr><td colspan="8" class="table-empty">${semua.length ? `Tidak ada TO ${toView.jenis} yang cocok dengan pencarian/filter.` : `Belum ada TO ${toView.jenis}.`}</td></tr>`;

    setText('to-table-info', hasil.length ? `Menampilkan ${mulai + 1}-${mulai + tampil.length} dari ${hasil.length} try out` : 'Tidak ada data');
    renderPagination(document.getElementById('to-pagination'), toView.halaman, totalHalaman, halaman => {
        toView.halaman = halaman;
        renderTOTable();
    });
    const hitung = status => semua.filter(t => t.status === status).length;
    setText('to-ringkasan', `${semua.length} try out · ${hitung('Terjadwal')} terjadwal · ${hitung('Draft')} draft · ${hitung('Selesai')} selesai`);
    renderDetailTO();
}

function renderOpsiKelasTO() {
    const kelasList = getAllKelas();
    const filter = document.getElementById('to-filter-kelas');
    const pilih = filter.value;
    filter.innerHTML = '<option value="">Semua Kelas</option>' + opsiKelasHtml(kelasList);
    filter.value = [...filter.options].some(o => o.value === pilih) ? pilih : '';
    toView.kelas = filter.value;
    document.getElementById('to-kelasId').innerHTML = '<option value="">Pilih kelas</option>' + opsiKelasHtml(kelasList);
}

// Mata pelajaran (otomatis) & petunjuk batas tanggal mengikuti kelas yang dipilih
function renderInfoKelasTO(form) {
    const kelas = getKelasById(form.elements.kelasId.value);
    document.getElementById('to-mapel').value = kelas ? kelas.mapel : '';
    let petunjuk = 'Pilih kelas terlebih dahulu.';
    if (kelas) {
        const { terakhir } = getCakupanTO(kelas.id, toView.jenis);
        petunjuk = terakhir && tanggalValid(terakhir.tanggal)
            ? `Pertemuan ${terakhir.nomor} kelas ini: ${formatTanggal(terakhir.tanggal)}. TO ${toView.jenis} boleh di hari yang sama, tetapi tidak boleh sebelum tanggal ini.`
            : 'Kelas ini belum memiliki pertemuan.';
    }
    setText('tanggal-hint', petunjuk);
}

function readTOForm(form) {
    const data = { jenis: toView.jenis };
    TO_FIELDS.forEach(field => {
        data[field] = form.elements[field].value;
    });
    return data;
}

// Jadwal Try Out dikelola Admin; Pengajar hanya melihat
function bolehKelolaTO() {
    const user = getCurrentUser();
    return !user || user.role === 'admin';
}

function bukaFormTO(id = null) {
    if (!bolehKelolaTO()) {
        tampilkanPesan('error', 'Jadwal Try Out dikelola oleh Admin. Pengajar hanya dapat melihat jadwal TO.');
        return;
    }
    const card = document.getElementById('to-form-card');
    const form = document.getElementById('form-to');
    const to = id !== null ? getTOById(id) : null;
    if (id !== null && !to) {
        tampilkanPesan('error', 'Data TO tidak ditemukan. Mungkin sudah dihapus.');
        return;
    }
    toView.editId = to ? to.id : null;
    form.reset();
    TO_FIELDS.forEach(field => showFieldError(form, field, ''));
    setText('to-form-title', to ? `Edit TO ${toView.jenis}` : `Tambah TO ${toView.jenis}`);
    const info = JENIS_TO[toView.jenis];
    const data = to || {
        judul: '', kelasId: Number(toView.kelas) || '', tanggal: info.tanggal, waktu: '08:00',
        durasi: info.durasi, jumlahSoal: info.jumlahSoal, status: 'Draft',
    };
    TO_FIELDS.forEach(field => {
        form.elements[field].value = data[field] ?? '';
    });
    // Soal sudah disusun → jumlah soal mengikuti banyaknya soal (diubah lewat Kelola Soal)
    const tersusun = Boolean(to && Array.isArray(to.soal));
    form.elements.jumlahSoal.readOnly = tersusun;
    if (tersusun) {
        form.elements.jumlahSoal.value = to.soal.length;
    }
    setText('jumlahSoal-hint', tersusun
        ? `Mengikuti banyaknya soal yang disusun (minimal ${TO_SOAL_MIN} untuk status Terjadwal). Ubah lewat Kelola Soal.`
        : 'Jumlah soal yang diambil dari kumpulan soal bawaan cakupan pertemuan; soal dapat disusun ulang lewat Kelola Soal.');
    renderInfoKelasTO(form);
    card.hidden = false;
    card.scrollIntoView({ block: 'start' });
    form.elements.judul.focus();
}

function tutupFormTO() {
    document.getElementById('to-form-card').hidden = true;
    toView.editId = null;
}

function simpanFormTO(event) {
    event.preventDefault();
    const form = event.target;
    const data = readTOForm(form);
    const errors = validateTO(data, toView.editId);
    if (!tampilkanErrorForm(form, TO_FIELDS, errors)) {
        tampilkanPesan('error', `TO ${toView.jenis} belum tersimpan. Periksa kolom yang ditandai merah.`);
        return;
    }
    let hasil;
    if (toView.editId !== null) {
        hasil = updateTO(toView.editId, data);
        tampilkanPesan('success', `Perubahan "${hasil.judul}" berhasil disimpan.`);
    } else {
        hasil = addTO(data);
        resetFilterTO(false);
        toView.halaman = Math.ceil(getAllTO(toView.jenis).length / BARIS_PER_HALAMAN);
        tampilkanPesan('success', `"${hasil.judul}" berhasil dijadwalkan pada ${formatTanggal(hasil.tanggal)}, ${hasil.waktu} WIB.`);
    }
    toView.dipilihId = hasil.id;
    tutupFormTO();
    renderTOTable();
    document.getElementById('page-alert').scrollIntoView({ block: 'nearest' });
}

function pilihTO(id, gulir = true) {
    if (!getTOById(id)) {
        return;
    }
    toView.dipilihId = Number(id);
    renderTOTable();
    if (gulir) {
        document.getElementById('to-detail-card').scrollIntoView({ block: 'start' });
    }
}

function hapusTO(id) {
    const t = getTOById(id);
    if (!t || !bolehKelolaTO()) {
        return;
    }
    const kelas = getKelasById(t.kelasId);
    konfirmasiHapusData({
        judul: `Hapus TO ${t.jenis}?`,
        jenis: `jadwal TO ${t.jenis}`,
        nama: t.judul,
        dampak: kelas ? `Kelas ${kelas.nama}, ${formatTanggal(t.tanggal)}.` : '',
        onConfirm: () => {
            deleteTO(t.id);
            if (toView.editId === t.id) {
                tutupFormTO();
            }
            renderTOTable();
            tampilkanPesan('success', `"${t.judul}" berhasil dihapus.`);
        },
    });
}

function resetFilterTO(render = true) {
    Object.assign(toView, { cari: '', kelas: '', status: '', halaman: 1 });
    ['to-search', 'to-filter-kelas', 'to-filter-status'].forEach(id => {
        document.getElementById(id).value = '';
    });
    if (render) {
        renderTOTable();
    }
}

function initTOPage() {
    initModalUmum();
    toView.jenis = document.body.dataset.jenis === 'PAS' ? 'PAS' : 'PTS';
    const form = document.getElementById('form-to');
    form.elements.status.innerHTML = STATUS_TO.map(s => `<option>${s}</option>`).join('');
    renderOpsiKelasTO();

    // ?id=N → tampilkan TO tersebut; ?kelas=N → filter kelas & tampilkan TO kelas itu
    const params = new URLSearchParams(window.location.search);
    const target = params.get('id') ? getTOById(params.get('id')) : null;
    if (target && target.jenis === toView.jenis) {
        toView.dipilihId = target.id;
    }
    if (params.get('kelas')) {
        const filter = document.getElementById('to-filter-kelas');
        filter.value = params.get('kelas');
        toView.kelas = filter.value;
        const milikKelas = getTOKelas(params.get('kelas'), toView.jenis);
        if (milikKelas) {
            toView.dipilihId = milikKelas.id;
        }
    }
    renderTOTable();

    const search = document.getElementById('to-search');
    search.addEventListener('input', () => {
        toView.cari = search.value;
        toView.halaman = 1;
        renderTOTable();
    });
    ['kelas', 'status'].forEach(key => {
        const select = document.getElementById(`to-filter-${key}`);
        saatNilaiBerubah(select, () => {
            toView[key] = select.value;
            toView.halaman = 1;
            renderTOTable();
        });
    });
    document.getElementById('btn-reset-filter-to').addEventListener('click', () => resetFilterTO());
    document.getElementById('btn-tambah-to').addEventListener('click', () => {
        sembunyikanPesan();
        bukaFormTO();
    });
    document.getElementById('btn-batal-to').addEventListener('click', tutupFormTO);
    document.getElementById('btn-edit-to-detail').addEventListener('click', () => {
        sembunyikanPesan();
        bukaFormTO(toView.dipilihId);
    });
    // Ganti kelas → mapel & petunjuk tanggal; judul otomatis bila masih kosong (mode Tambah)
    saatNilaiBerubah(form.elements.kelasId, () => {
        const kelas = getKelasById(form.elements.kelasId.value);
        if (toView.editId === null && kelas && !form.elements.judul.value.trim()) {
            form.elements.judul.value = `TO ${toView.jenis} ${kelas.mapel}`;
        }
        renderInfoKelasTO(form);
    });
    form.addEventListener('submit', simpanFormTO);
    pantauPerbaikanForm(form, TO_FIELDS, () => validateTO(readTOForm(form), toView.editId));
    // ?aksi=tambah (pintasan "Tambah Kegiatan" di Dashboard) → langsung buka form Tambah
    if (params.get('aksi') === 'tambah') {
        bukaFormTO();
    }

    document.getElementById('to-table-body').addEventListener('click', event => {
        const button = event.target.closest('button[data-action]');
        if (!button) {
            return;
        }
        const id = Number(button.dataset.id);
        if (button.dataset.action === 'detail') {
            pilihTO(id);
        } else if (button.dataset.action === 'edit') {
            sembunyikanPesan();
            bukaFormTO(id);
        } else if (button.dataset.action === 'hapus') {
            hapusTO(id);
        }
    });
}

/* =========================
   6H. HALAMAN DETAIL KELAS (detail-kelas.html?id=N)
   Semua isi dari data: kelas, pengajar (pengajarId), peserta (kelasId), pertemuan, modul/tugas/kuis, TO, nilai.
   Hanya membaca data — tidak ada data yang diubah di halaman ini.
========================= */

const TAB_DETAIL = ['informasi', 'pembelajaran', 'peserta', 'nilai'];

function pilihTabDetail(nama, ubahHash = true) {
    const tab = TAB_DETAIL.includes(nama) ? nama : 'informasi';
    document.querySelectorAll('[data-tab]').forEach(tombol => {
        const aktif = tombol.dataset.tab === tab;
        tombol.classList.toggle('active', aktif);
        tombol.setAttribute('aria-selected', String(aktif));
        tombol.tabIndex = aktif ? 0 : -1;
    });
    TAB_DETAIL.forEach(t => {
        const panel = document.getElementById(`panel-${t}`);
        if (panel) {
            panel.hidden = t !== tab;
        }
    });
    if (ubahHash && window.history && window.history.replaceState) {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${tab}`);
    }
}

// Jumlah modul/tugas/kuis per pertemuan: { pertemuanId: { modul, tugas, kuis } }
function hitungMateriPerPertemuan(kelasId) {
    const hasil = {};
    [['modul', getAllModul()], ['tugas', getAllTugas()], ['kuis', getAllKuis()]].forEach(([nama, list]) => {
        list.filter(item => item.kelasId === kelasId && item.pertemuanId !== null).forEach(item => {
            hasil[item.pertemuanId] = hasil[item.pertemuanId] || { modul: 0, tugas: 0, kuis: 0 };
            hasil[item.pertemuanId][nama] += 1;
        });
    });
    return hasil;
}

function renderDetailPertemuanItem(p, materi) {
    const m = materi[p.id] || { modul: 0, tugas: 0, kuis: 0 };
    const info = [formatTanggal(p.tanggal), `${p.komponen.length}/${KOMPONEN_PERTEMUAN.length} komponen siap`,
        `${m.modul} modul · ${m.tugas} tugas · ${m.kuis} kuis`].join(' · ');
    return `
        <li class="meeting-item">
            <a class="meeting-left meeting-link" href="pertemuan.html?id=${p.id}">
                <span class="meeting-number">${p.nomor}</span>
                <span>
                    <span class="meeting-title">Pertemuan ${p.nomor} · ${escapeHtml(p.judul)}</span>
                    <span class="meeting-info">${info}</span>
                    <span class="chip-list" aria-label="Komponen pertemuan">${chipKomponenHtml(p.komponen).replace(/<li /g, '<span ').replace(/<\/li>/g, '</span>')}</span>
                </span>
            </a>
            <div class="actions">
                ${badgeStatusPertemuanHtml(p)}
                <a class="btn btn-secondary btn-small" href="pertemuan.html?id=${p.id}">Lihat Pertemuan</a>
            </div>
        </li>`;
}

function renderDetailTOItem(jenis, kelasId) {
    const to = getTOKelas(kelasId, jenis);
    const nama = JENIS_TO[jenis].nama;
    const jadwal = to ? `${formatTanggal(to.tanggal)}, ${escapeHtml(to.waktu)} WIB · ${to.durasi} menit · ${to.jumlahSoal} soal` : 'Belum dijadwalkan';
    return `
        <li class="meeting-item meeting-item-exam">
            <a class="meeting-left meeting-link" href="to-${jenis.toLowerCase()}.html?kelas=${kelasId}">
                <span class="meeting-number">TO</span>
                <span>
                    <span class="meeting-title">TO ${jenis}</span>
                    <span class="meeting-info">Simulasi ${nama} · ${jadwal}</span>
                </span>
            </a>
            <div class="actions">
                ${to ? badgeTO(to.status) : '<span class="badge badge-muted badge-dot">Belum ada</span>'}
                <a class="btn btn-primary btn-small" href="to-${jenis.toLowerCase()}.html?kelas=${kelasId}">Kelola TO ${jenis}</a>
            </div>
        </li>`;
}

// Nilai peserta kelas yang sudah dinilai (dari koleksi nilai; nama & NIS dari Data Peserta terbaru)
function getNilaiKelas(kelasId) {
    return getBarisRekap({ kelasId })
        .filter(b => b.akhir !== null)
        .map(b => ({ nama: b.peserta.nama, nis: b.peserta.nis, tugas: b.nilai.tugas, kuis: b.nilai.kuis, pts: b.nilai.pts, pas: b.nilai.pas, akhir: b.akhir }));
}

function renderDetailKelas(kelas) {
    const pengajar = kelas.pengajarId !== null ? getPengajarById(kelas.pengajarId) : null;
    const peserta = getAllPeserta().filter(p => p.kelasId === kelas.id);
    const pertemuan = getPertemuanByKelas(kelas.id);
    const materi = hitungMateriPerPertemuan(kelas.id);
    const aktif = kelas.status === 'Aktif';
    const namaPengajar = pengajar ? namaLengkapPengajar(pengajar) : kelas.pengajar;
    // Jumlah modul/tugas/kuis milik kelas ini (termasuk yang sudah dilepas dari pertemuan)
    const jumlahDiKelas = {
        modul: getAllModul().filter(m => m.kelasId === kelas.id).length,
        tugas: getAllTugas().filter(t => t.kelasId === kelas.id).length,
        kuis: getAllKuis().filter(k => k.kelasId === kelas.id).length,
    };

    document.title = `${kelas.nama} — Detail Kelas — DelLearn Admin`;
    setText('detail-breadcrumb', kelas.nama);
    setText('judul-kelas', kelas.nama);
    document.getElementById('detail-meta').innerHTML = `
        <span>Mata Pelajaran: <strong>${escapeHtml(kelas.mapel)}</strong></span>
        <span>Tingkat: <strong>${escapeHtml(kelas.tingkat)}</strong></span>
        <span>Pengajar: <strong>${escapeHtml(namaPengajar)}</strong></span>
        <span>Peserta: <strong>${peserta.length} / ${kelas.kapasitas}</strong></span>
        <span>Pertemuan: <strong>${pertemuan.length}</strong></span>
        <span class="badge ${aktif ? 'badge-success' : 'badge-muted'} badge-dot">${escapeHtml(kelas.status)}</span>`;
    document.getElementById('btn-edit-kelas').href = `form-kelas.html?id=${kelas.id}`;

    // ---- Tab Informasi ----
    const persen = kelas.kapasitas ? ((peserta.length / kelas.kapasitas) * 100).toFixed(1) : '0.0';
    const info = [
        ['Nama Kelas', escapeHtml(kelas.nama)],
        ['Kode Kelas', escapeHtml(kelas.kode)],
        ['Mata Pelajaran', escapeHtml(kelas.mapel)],
        ['Tingkat', escapeHtml(kelas.tingkat)],
        ['Pengajar', pengajar
            ? `${escapeHtml(namaPengajar)}<br><span class="cell-muted">${escapeHtml(pengajar.kode)} · ${escapeHtml(pengajar.email)}</span>`
            : `<span class="cell-muted">${escapeHtml(kelas.pengajar)}</span>`],
        ['Kapasitas', `${peserta.length} / ${kelas.kapasitas} Peserta <span class="cell-muted">(${persen}% terisi)</span>`],
        ['Jumlah Pertemuan', `${pertemuan.length} Pertemuan + TO PTS + TO PAS`],
        ['Keterangan', escapeHtml(kelas.keterangan || '–')],
        ['Status', `<span class="badge ${aktif ? 'badge-success' : 'badge-muted'} badge-dot">${escapeHtml(kelas.status)}</span>`],
    ];
    document.getElementById('detail-info').innerHTML = info.map(([l, v]) => `<div><dt>${escapeHtml(l)}</dt><dd>${v}</dd></div>`).join('');

    // Progress dari data pertemuan (status & komponen yang sudah siap)
    const total = pertemuan.length;
    const hitungKomponen = key => pertemuan.filter(p => p.komponen.includes(key)).length;
    const progres = [
        ['Pertemuan Selesai', pertemuan.filter(p => statusPertemuan(p) === 'Selesai').length, 'pertemuan', ''],
        ['Modul Pembelajaran Siap', hitungKomponen('modul'), 'pertemuan', ' progress-secondary'],
        ['Aktivitas Interaktif Siap', hitungKomponen('aktivitas'), 'pertemuan', ' progress-secondary'],
        ['Kuis Siap', hitungKomponen('kuis'), 'pertemuan', ' progress-success'],
    ];
    document.getElementById('detail-progress').innerHTML = total
        ? progres.map(([label, n, satuan, kelasBar]) => `
            <div>
                <div class="progress-head">
                    <span>${label}</span>
                    <span class="progress-value">${n} / ${total} ${satuan}</span>
                </div>
                <progress class="progress${kelasBar}" value="${n}" max="${total}">${n} / ${total} ${satuan}</progress>
            </div>`).join('')
        : '<p class="cell-muted">Kelas ini belum memiliki pertemuan.</p>';
    setText('detail-materi-ringkas', `${jumlahDiKelas.modul} modul · ${jumlahDiKelas.tugas} tugas · ${jumlahDiKelas.kuis} kuis di kelas ini`);

    // ---- Tab Pembelajaran ----
    const list = document.getElementById('detail-pertemuan');
    list.innerHTML = total
        ? pertemuan.filter(p => p.nomor <= 6).map(p => renderDetailPertemuanItem(p, materi)).join('') +
          renderDetailTOItem('PTS', kelas.id) +
          pertemuan.filter(p => p.nomor > 6).map(p => renderDetailPertemuanItem(p, materi)).join('') +
          renderDetailTOItem('PAS', kelas.id)
        : `<li class="table-empty">Kelas ini belum memiliki pertemuan. <a class="text-primary" href="pertemuan.html?kelas=${kelas.id}">Tambah pertemuan</a></li>`;
    setText('detail-pertemuan-subtitle', `${total} pertemuan · TO PTS setelah Pertemuan 6 · TO PAS di akhir semester`);
    document.getElementById('btn-kelola-pertemuan').href = `pertemuan.html?kelas=${kelas.id}`;
    document.getElementById('link-modul-kelas').href = `modul.html?kelas=${kelas.id}`;
    document.getElementById('link-tugas-kelas').href = `tugas.html?kelas=${kelas.id}`;
    document.getElementById('link-kuis-kelas').href = `kuis.html?kelas=${kelas.id}`;
    setText('link-modul-kelas', `Modul (${jumlahDiKelas.modul})`);
    setText('link-tugas-kelas', `Tugas (${jumlahDiKelas.tugas})`);
    setText('link-kuis-kelas', `Kuis (${jumlahDiKelas.kuis})`);

    // ---- Tab Peserta ----
    setText('detail-peserta-subtitle', `${peserta.length} peserta terdaftar dari kapasitas ${kelas.kapasitas}`);
    document.getElementById('btn-semua-peserta').href = `data-peserta.html?kelas=${kelas.id}`;
    document.getElementById('detail-peserta-body').innerHTML = peserta.length
        ? peserta.map((p, i) => `
            <tr>
                <td class="col-no">${i + 1}</td>
                <td>
                    <div class="cell-flex">
                        <span class="avatar-initial${p.status === 'Aktif' ? '' : ' avatar-muted'}">${escapeHtml(getInitials(p.nama))}</span>
                        <div>
                            <p class="cell-title">${escapeHtml(p.nama)}</p>
                            <p class="cell-meta">ID: ${escapeHtml(p.nis)}</p>
                        </div>
                    </div>
                </td>
                <td>${escapeHtml(p.email)}</td>
                <td>${p.sekolah ? escapeHtml(p.sekolah) : '<span class="cell-muted">–</span>'}</td>
                <td><span class="badge ${p.status === 'Aktif' ? 'badge-success' : 'badge-muted'} badge-dot">${escapeHtml(p.status)}</span></td>
            </tr>`).join('')
        : '<tr><td colspan="5" class="table-empty">Belum ada peserta di kelas ini.</td></tr>';

    // ---- Tab Nilai ----
    document.getElementById('btn-rekap-kelas').href = `rekap-nilai.html?kelas=${kelas.id}`;
    const nilai = getNilaiKelas(kelas.id);
    document.getElementById('detail-nilai-body').innerHTML = nilai.length
        ? nilai.map(n => `
            <tr>
                <td class="cell-title">${escapeHtml(n.nama)}<p class="cell-meta">NIS: ${escapeHtml(n.nis)}</p></td>
                <td class="num">${n.tugas}</td>
                <td class="num">${n.kuis}</td>
                <td class="num">${n.pts}</td>
                <td class="num">${n.pas}</td>
                <td class="num"><strong>${n.akhir.toFixed(1)}</strong></td>
            </tr>`).join('')
        : '<tr><td colspan="6" class="table-empty">Belum ada data nilai untuk kelas ini.</td></tr>';
    setText('detail-nilai-subtitle', nilai.length
        ? `${nilai.length} dari ${peserta.length} peserta sudah memiliki nilai · Nilai Akhir = 20% Tugas + 20% Kuis + 30% TO PTS + 30% TO PAS`
        : 'Data nilai kelas ini belum tersedia');
}

function initDetailKelasPage() {
    const idParam = new URLSearchParams(window.location.search).get('id');
    const kelas = idParam ? getKelasById(idParam) : null;
    if (!kelas) {
        // Kelas tidak ditemukan / tanpa ?id= → tampilkan pesan & tombol kembali, sembunyikan isi detail
        document.title = 'Kelas tidak ditemukan — DelLearn Admin';
        setText('detail-breadcrumb', 'Kelas tidak ditemukan');
        setText('detail-notfound-text', idParam
            ? `Kelas dengan ID "${idParam}" tidak ditemukan. Mungkin sudah dihapus.`
            : 'ID kelas tidak disertakan. Pilih kelas dari halaman Data Kelas.');
        document.getElementById('detail-notfound').hidden = false;
        document.getElementById('detail-konten').hidden = true;
        return;
    }
    renderDetailKelas(kelas);

    const tabs = [...document.querySelectorAll('[data-tab]')];
    tabs.forEach((tombol, i) => {
        tombol.addEventListener('click', () => pilihTabDetail(tombol.dataset.tab));
        // Panah kiri/kanan berpindah tab (pola tab yang aksesibel)
        tombol.addEventListener('keydown', event => {
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                const tujuan = tabs[(i + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
                pilihTabDetail(tujuan.dataset.tab);
                tujuan.focus();
            }
        });
    });
    pilihTabDetail(window.location.hash.replace('#', ''), false);

    // Menu Pengajar "Detail Kelas" / "Hasil Peserta" (#nilai) membuka halaman yang sama → ganti tab & menu aktif
    window.addEventListener('hashchange', () => {
        const tab = window.location.hash.replace('#', '');
        pilihTabDetail(tab, false);
        const aktif = tab === 'nilai' ? 'hasil-peserta' : 'detail-kelas';
        document.querySelectorAll('.sidebar [data-menu="detail-kelas"], .sidebar [data-menu="hasil-peserta"]').forEach(link => {
            link.classList.toggle('active', link.dataset.menu === aktif);
            if (link.dataset.menu === aktif) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    });
}

/* =========================
   6I. HALAMAN REKAP NILAI (laporan: filter kelas/mapel/peserta, ringkasan, detail, Cetak, Ekspor CSV, Kembali)
   Bukan CRUD — nilai hanya dibaca dari koleksi nilai. Bobot: Tugas 20%, Kuis 20%, TO PTS 30%, TO PAS 30%.
========================= */

const rekapView = { kelas: '', mapel: '', cari: '', halaman: 1, cetak: false };

// "85" → "85.0" (satu angka desimal untuk nilai akhir / rata-rata)
function formatNilai(angka) {
    return angka === null || angka === undefined ? '–' : Number(angka).toFixed(1);
}

function barisRekapTampil() {
    return getBarisRekap({ kelasId: rekapView.kelas || null, mapel: rekapView.mapel, cari: rekapView.cari });
}

function renderRekapRow(b, nomor, semuaKelas) {
    const p = b.peserta;
    const n = b.nilai;
    const sel = key => `<td class="num">${n && n[key] !== null ? n[key] : '–'}</td>`;
    const meta = [`NIS: ${escapeHtml(p.nis)}`, semuaKelas ? escapeHtml(b.kelas.nama) : ''].filter(Boolean).join(' · ');
    return `
        <tr>
            <td class="col-no">${nomor}</td>
            <td>
                <div class="cell-flex">
                    <span class="avatar-initial avatar-initial-lg avatar-rounded">${escapeHtml(getInitials(p.nama))}</span>
                    <div>
                        <p class="cell-title">${escapeHtml(p.nama)}</p>
                        <p class="cell-meta">${meta}</p>
                    </div>
                </div>
            </td>
            ${sel('tugas')}${sel('kuis')}${sel('pts')}${sel('pas')}
            <td class="num">${b.akhir !== null ? `<strong>${formatNilai(b.akhir)}</strong>` : `<span class="cell-muted">${n ? 'Belum lengkap' : 'Belum dinilai'}</span>`}</td>
            <td class="text-center col-aksi"><button type="button" class="btn btn-link" data-action="detail" data-id="${p.id}">Lihat Detail</button></td>
        </tr>`;
}

function renderRekapNilai() {
    const tbody = document.getElementById('rekap-table-body');
    if (!tbody) {
        return;
    }
    const baris = barisRekapTampil();
    const ringkas = getRingkasanRekap(baris);
    const kelas = rekapView.kelas ? getKelasById(rekapView.kelas) : null;
    const semuaKelas = !kelas;
    const cakupan = kelas ? kelas.nama : (rekapView.mapel ? `Semua kelas ${rekapView.mapel}` : 'Semua kelas');

    // Kartu ringkasan
    setText('rekap-rata', formatNilai(ringkas.rataRata.akhir));
    setText('rekap-rata-info', cakupan);
    setText('rekap-jumlah', `${ringkas.jumlah} Siswa`);
    setText('rekap-jumlah-info', `${ringkas.dinilai} dinilai · ${ringkas.jumlah - ringkas.dinilai} belum dinilai`);
    setText('rekap-tertinggi', ringkas.tertinggi ? formatNilai(ringkas.tertinggi.akhir) : '–');
    setText('rekap-tertinggi-info', ringkas.tertinggi ? `${ringkas.tertinggi.peserta.nama} (NIS: ${ringkas.tertinggi.peserta.nis})` : 'Belum ada nilai');
    setText('rekap-terendah', ringkas.terendah ? formatNilai(ringkas.terendah.akhir) : '–');
    setText('rekap-terendah-info', ringkas.terendah ? `${ringkas.terendah.peserta.nama} (NIS: ${ringkas.terendah.peserta.nis})` : 'Belum ada nilai');

    // Tabel (saat dicetak: semua baris tanpa paginasi)
    const totalHalaman = Math.max(1, Math.ceil(baris.length / BARIS_PER_HALAMAN));
    rekapView.halaman = Math.min(Math.max(1, rekapView.halaman), totalHalaman);
    const mulai = rekapView.cetak ? 0 : (rekapView.halaman - 1) * BARIS_PER_HALAMAN;
    const tampil = rekapView.cetak ? baris : baris.slice(mulai, mulai + BARIS_PER_HALAMAN);
    tbody.innerHTML = tampil.length
        ? tampil.map((b, i) => renderRekapRow(b, mulai + i + 1, semuaKelas)).join('')
        : `<tr><td colspan="8" class="table-empty">${rekapView.cari ? 'Tidak ada peserta yang cocok dengan pencarian.' : 'Belum ada peserta pada pilihan ini.'}</td></tr>`;

    const r = ringkas.rataRata;
    document.getElementById('rekap-table-foot').innerHTML = `
        <tr>
            <td colspan="2"><span class="cell-flex cell-flex-sm">${iconHtml('sigma', 'text-primary')}Rata-rata</span></td>
            <td class="num">${formatNilai(r.tugas)}</td>
            <td class="num">${formatNilai(r.kuis)}</td>
            <td class="num">${formatNilai(r.pts)}</td>
            <td class="num">${formatNilai(r.pas)}</td>
            <td class="num text-primary">${formatNilai(r.akhir)}</td>
            <td class="text-center col-aksi"><span class="cell-meta">${ringkas.dinilai} Siswa Dinilai</span></td>
        </tr>`;

    setText('rekap-table-info', baris.length
        ? `Menampilkan ${mulai + 1}-${mulai + tampil.length} dari ${baris.length} peserta`
        : 'Tidak ada data');
    renderPagination(document.getElementById('rekap-pagination'), rekapView.halaman, totalHalaman, halaman => {
        rekapView.halaman = halaman;
        renderRekapNilai();
    });

    // Judul cetak & tombol Kembali mengikuti kelas yang dipilih
    setText('rekap-print-info', `${cakupan} · ${ringkas.jumlah} peserta · dicetak ${formatTanggal(tanggalHariIni())}`);
    const kembali = document.getElementById('btn-kembali-rekap');
    kembali.href = kelas ? `detail-kelas.html?id=${kelas.id}#nilai` : '../index.html';
    setText('btn-kembali-rekap-text', kelas ? 'Kembali ke Detail Kelas' : 'Kembali ke Dashboard');
}

// Pilihan kelas mengikuti mata pelajaran yang dipilih
function renderOpsiRekap() {
    const kelasList = getAllKelas();
    const mapelSelect = document.getElementById('rekap-filter-mapel');
    const mapelAda = [...new Set(kelasList.map(k => k.mapel))];
    mapelSelect.innerHTML = '<option value="">Semua Mata Pelajaran</option>' +
        mapelAda.map(m => `<option>${escapeHtml(m)}</option>`).join('');
    mapelSelect.value = mapelAda.includes(rekapView.mapel) ? rekapView.mapel : '';
    rekapView.mapel = mapelSelect.value;

    const kelasSelect = document.getElementById('rekap-filter-kelas');
    const pilihan = kelasList.filter(k => !rekapView.mapel || k.mapel === rekapView.mapel);
    kelasSelect.innerHTML = '<option value="">Semua Kelas</option>' + opsiKelasHtml(pilihan);
    kelasSelect.value = pilihan.some(k => String(k.id) === String(rekapView.kelas)) ? String(rekapView.kelas) : '';
    rekapView.kelas = kelasSelect.value;
}

function lihatNilaiPeserta(pesertaId) {
    const b = getBarisRekap().find(x => x.peserta.id === Number(pesertaId));
    if (!b) {
        return;
    }
    const n = b.nilai;
    const komponen = [['Tugas', 'tugas'], ['Kuis', 'kuis'], ['TO PTS', 'pts'], ['TO PAS', 'pas']];
    const baris = [
        ['Peserta', `${escapeHtml(b.peserta.nama)} <span class="cell-muted">(NIS: ${escapeHtml(b.peserta.nis)})</span>`],
        ['Kelas', `<a class="text-primary" href="detail-kelas.html?id=${b.kelas.id}#nilai">${escapeHtml(b.kelas.nama)}</a>`],
        ['Pengajar', escapeHtml(b.kelas.pengajar)],
    ];
    if (n) {
        komponen.forEach(([label, key]) => {
            const bobot = BOBOT_NILAI[key];
            const sumber = n.sumber[key] === 'hasil' ? ' <span class="cell-muted">(dari hasil pengerjaan)</span>' : '';
            baris.push([`${label} (bobot ${bobot * 100}%)`, n[key] === null
                ? '<span class="cell-muted">Belum ada nilai</span>'
                : `${n[key]} × ${bobot * 100}% = ${formatNilai(bulatkan(n[key] * bobot, 2))}${sumber}`]);
        });
        baris.push(['Nilai Akhir', b.akhir !== null ? `<strong>${formatNilai(b.akhir)}</strong>` : '<span class="cell-muted">Belum lengkap</span>']);
    } else {
        baris.push(['Nilai', '<span class="cell-muted">Belum dinilai</span>']);
    }
    tampilkanDetail('Detail Nilai Peserta', baris, null);
}

function tampilkanBobot() {
    tampilkanDetail('Bobot Komponen Nilai', [
        ['Tugas', '20%'],
        ['Kuis', '20%'],
        ['TO PTS (Try Out Penilaian Tengah Semester)', '30%'],
        ['TO PAS (Try Out Penilaian Akhir Semester)', '30%'],
        ['Rumus', 'Nilai Akhir = (Tugas × 20%) + (Kuis × 20%) + (TO PTS × 30%) + (TO PAS × 30%)'],
        ['Catatan', 'Rekap nilai bersifat laporan bimbingan belajar; tidak menentukan kelulusan.'],
    ], null);
}

function eksporRekap() {
    const baris = barisRekapTampil();
    if (!baris.length) {
        tampilkanPesan('error', 'Tidak ada data nilai untuk diekspor.');
        return;
    }
    const namaFile = `rekap-nilai-${tanggalHariIni()}.csv`;
    unduhCsv(namaFile,
        ['No', 'NIS', 'Nama', 'Kelas', 'Mata Pelajaran', 'Tugas', 'Kuis', 'TO PTS', 'TO PAS', 'Nilai Akhir'],
        baris.map((b, i) => [i + 1, b.peserta.nis, b.peserta.nama, b.kelas.nama, b.kelas.mapel,
            ...KOMPONEN_NILAI.map(k => (b.nilai && b.nilai[k] !== null ? b.nilai[k] : '')),
            b.akhir !== null ? formatNilai(b.akhir) : (b.nilai ? 'Belum lengkap' : 'Belum dinilai')]));
    tampilkanPesan('success', `${baris.length} baris rekap nilai diekspor ke file ${namaFile}.`);
}

// Cetak: tampilkan semua baris (tanpa paginasi) selama dialog cetak, lalu kembali seperti semula
function siapCetak(aktif) {
    rekapView.cetak = aktif;
    renderRekapNilai();
}

function initRekapNilaiPage() {
    initModalUmum();
    const params = new URLSearchParams(window.location.search);
    // Default: kelas pertama (atau ?kelas=N)
    const kelasList = getAllKelas();
    rekapView.kelas = params.get('kelas') || (kelasList.length ? String(kelasList[0].id) : '');
    renderOpsiRekap();
    renderRekapNilai();

    const kelasSelect = document.getElementById('rekap-filter-kelas');
    const mapelSelect = document.getElementById('rekap-filter-mapel');
    saatNilaiBerubah(kelasSelect, () => {
        rekapView.kelas = kelasSelect.value;
        rekapView.halaman = 1;
        renderRekapNilai();
    });
    saatNilaiBerubah(mapelSelect, () => {
        rekapView.mapel = mapelSelect.value;
        rekapView.halaman = 1;
        renderOpsiRekap();
        renderRekapNilai();
    });
    const search = document.getElementById('rekap-search');
    search.addEventListener('input', () => {
        rekapView.cari = search.value;
        rekapView.halaman = 1;
        renderRekapNilai();
    });

    document.getElementById('btn-cetak-rekap').addEventListener('click', () => {
        siapCetak(true);
        window.print();
        siapCetak(false);
    });
    // Cetak lewat Ctrl+P juga menampilkan semua baris
    window.addEventListener('beforeprint', () => siapCetak(true));
    window.addEventListener('afterprint', () => siapCetak(false));
    document.getElementById('btn-ekspor-rekap').addEventListener('click', eksporRekap);
    document.getElementById('btn-bobot-rekap').addEventListener('click', tampilkanBobot);
    document.getElementById('rekap-table-body').addEventListener('click', event => {
        const button = event.target.closest('button[data-action="detail"]');
        if (button) {
            lihatNilaiPeserta(button.dataset.id);
        }
    });
}

/* =========================
   7. SIDEBAR TOGGLE (semua halaman)
   Desktop: sidebar selalu tampil. Tablet & mobile (≤ 992px): sidebar berupa laci
   yang dibuka dengan tombol menu di header, ditutup dengan backdrop / Escape.
========================= */

const SIDEBAR_BREAKPOINT = '(max-width: 992px)';

function isSidebarOpen() {
    return document.body.classList.contains('sidebar-open');
}

function setSidebarOpen(open) {
    const toggle = document.querySelector('.menu-toggle');
    const backdrop = document.querySelector('.sidebar-backdrop');

    document.body.classList.toggle('sidebar-open', open);
    if (backdrop) {
        backdrop.hidden = !open;
    }
    if (toggle) {
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi');
    }
}

function initSidebarToggle() {
    const toggle = document.querySelector('.menu-toggle');
    const sidebar = document.getElementById('sidebar');
    if (!toggle || !sidebar) {
        return;
    }

    toggle.addEventListener('click', () => {
        const open = !isSidebarOpen();
        setSidebarOpen(open);
        if (open) {
            // Pindahkan fokus ke menu aktif agar bisa langsung dipakai dengan keyboard
            const target = sidebar.querySelector('.nav-link.active') || sidebar.querySelector('.nav-link');
            if (target) {
                target.focus();
            }
        }
    });

    const backdrop = document.querySelector('.sidebar-backdrop');
    if (backdrop) {
        backdrop.addEventListener('click', () => setSidebarOpen(false));
    }

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && isSidebarOpen()) {
            setSidebarOpen(false);
            toggle.focus();
        }
    });

    // Bila layar diperbesar ke ukuran desktop, kembalikan ke keadaan normal
    const media = window.matchMedia(SIDEBAR_BREAKPOINT);
    const onChange = event => {
        if (!event.matches) {
            setSidebarOpen(false);
        }
    };
    if (media.addEventListener) {
        media.addEventListener('change', onChange);
    }
}

/* =========================
   8. DASHBOARD (statistik, kelas aktif, grafik Chart.js)
   Semua angka dihitung dari getAllKelas() / getKelasStats() — tidak ada dataset kedua.
========================= */

let dashboardChart = null;

// "Matematika" + "SMP Kelas 8" → "Matematika 8" (label singkat untuk grafik)
function labelSingkat(kelas) {
    const angka = (String(kelas.tingkat).match(/\d+/) || [''])[0];
    return `${kelas.mapel} ${angka}`.trim();
}

function renderDashboardRow(kelas) {
    return `
        <tr>
            <td>
                <div class="cell-flex">
                    <span class="avatar-initial avatar-code">${escapeHtml(kelas.kode)}</span>
                    <div>
                        <p class="cell-title">${escapeHtml(kelas.nama)}</p>
                        <p class="cell-meta">${escapeHtml(kelas.keterangan || kelas.mapel)}</p>
                    </div>
                </div>
            </td>
            <td>
                <div class="cell-flex cell-flex-sm">
                    ${iconHtml('user-circle', 'icon-sm cell-icon')}
                    ${escapeHtml(kelas.pengajar)}
                </div>
            </td>
            <td class="num"><strong>${kelas.peserta}</strong> <span class="cell-muted">/ ${kelas.kapasitas}</span></td>
            <td><span class="badge badge-success badge-dot">${escapeHtml(kelas.status)}</span></td>
            <td class="text-end"><a href="pages/detail-kelas.html?id=${kelas.id}" class="btn btn-tonal btn-small">Kelola Kelas</a></td>
        </tr>`;
}

function renderDashboardChart(list) {
    const canvas = document.getElementById('chart-peserta');
    const fallback = document.getElementById('chart-fallback');
    if (!canvas) {
        return;
    }
    // Chart.js dimuat dari CDN; bila tidak tersedia (offline), tampilkan keterangan saja
    if (typeof window.Chart === 'undefined') {
        canvas.parentElement.hidden = true;
        if (fallback) {
            fallback.hidden = false;
        }
        return;
    }

    const css = getComputedStyle(document.documentElement);
    const warna = nama => css.getPropertyValue(nama).trim();
    window.Chart.defaults.font.family = 'Inter, "Segoe UI", Roboto, Arial, sans-serif';

    if (dashboardChart) {
        dashboardChart.destroy();
    }
    dashboardChart = new window.Chart(canvas, {
        type: 'bar',
        data: {
            labels: list.map(labelSingkat),
            datasets: [
                // Kapasitas digambar sebagai batang lebar berwarna muda, peserta di atasnya (batang biru)
                {
                    label: 'Kapasitas',
                    data: list.map(kelas => kelas.kapasitas),
                    backgroundColor: warna('--secondary-container'),
                    borderRadius: 4,
                    barPercentage: 0.8,
                    grouped: false,
                    order: 2,
                },
                {
                    label: 'Peserta',
                    data: list.map(kelas => kelas.peserta),
                    backgroundColor: warna('--primary'),
                    borderRadius: 4,
                    barPercentage: 0.45,
                    grouped: false,
                    order: 1,
                },
            ],
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 400 },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { usePointStyle: true, pointStyle: 'rectRounded', color: warna('--text-secondary'), font: { size: 12 } },
                },
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.dataset.label}: ${ctx.parsed.x} siswa`,
                        footer: items => {
                            const kelas = list[items[0].dataIndex];
                            return kelas.kapasitas ? `Terisi ${((kelas.peserta / kelas.kapasitas) * 100).toFixed(1)}%` : '';
                        },
                    },
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: { precision: 0, color: warna('--text-secondary') },
                    grid: { color: warna('--border') },
                    title: { display: true, text: 'Jumlah siswa', color: warna('--text-secondary') },
                },
                y: {
                    ticks: { color: warna('--text-muted'), font: { size: 12 } },
                    grid: { display: false },
                    // Ruang cadangan agar label nama kelas tidak terpotong di tepi kiri
                    afterFit: scale => {
                        scale.width += 8;
                    },
                },
            },
        },
    });

    // Canvas tidak memicu pemuatan font, jadi font Inter dimuat eksplisit,
    // lalu lebar label dihitung ulang (mencegah label terpotong)
    if (document.fonts && document.fonts.load) {
        document.fonts.load('12px Inter').then(() => {
            if (dashboardChart) {
                dashboardChart.update();
            }
        }).catch(() => {});
    }
}

function renderDashboard() {
    const list = getAllKelas();
    const stats = getKelasStats(list);
    const aktif = list.filter(kelas => kelas.status === 'Aktif');

    // Kartu ringkasan
    const tingkat = [...new Set(list.map(kelas => (String(kelas.tingkat).match(/\d+/) || [''])[0]))]
        .filter(Boolean)
        .sort((a, b) => a - b);
    setText('dash-total-kelas', stats.totalKelas);
    setText('dash-persen-aktif', `${stats.persenAktif}% Aktif`);
    // ["7", "8", "9"] → "7, 8 & 9"
    const daftarTingkat = tingkat.length > 1
        ? `${tingkat.slice(0, -1).join(', ')} & ${tingkat[tingkat.length - 1]}`
        : tingkat.join('');
    setText('dash-tingkat', tingkat.length ? `Tingkat Kelas ${daftarTingkat}` : 'Belum ada kelas');
    // Tenaga pendidik = pengajar berstatus Aktif di Data Pengajar
    const pengajarAktif = getAllPengajar().filter(p => p.status === 'Aktif');
    const perPengajar = getKelasPerPengajar(list);
    const belumDitugaskan = pengajarAktif.filter(p => !(perPengajar[p.id] || []).length).length;
    setText('dash-total-pengajar', pengajarAktif.length);
    setText('dash-pengajar-status', belumDitugaskan ? `${belumDitugaskan} Belum Ditugaskan` : 'Semua Ditugaskan');
    setText('dash-rasio', pengajarAktif.length ? Math.round(stats.totalPeserta / pengajarAktif.length) : 0);
    setText('dash-total-peserta', stats.totalPeserta);
    setText('dash-rata-peserta', `Rata-rata ${stats.rataPeserta} / kelas`);
    setText('dash-kapasitas', `${stats.persenKapasitas.toFixed(1)}%`);
    setText('dash-kapasitas-info', `${stats.totalPeserta} dari ${stats.totalKapasitas} kursi terisi`);
    const bar = document.getElementById('dash-kapasitas-bar');
    if (bar) {
        bar.value = stats.persenKapasitas;
        bar.textContent = `${stats.persenKapasitas.toFixed(1)}%`;
    }

    renderDashKelasTable(aktif);
    renderTOMendatang();
    renderDistribusiModul();
    renderDashboardChart(list);
}

// ---- Tabel Kelas Aktif: cari, filter tingkat, halaman (Fase 11; 10 baris per halaman seperti tabel lain) ----
const dashView = { cari: '', tingkat: '', halaman: 1 };

function renderDashKelasTable(aktif = getAllKelas().filter(kelas => kelas.status === 'Aktif')) {
    const tbody = document.getElementById('dash-kelas-body');
    if (!tbody) {
        return;
    }
    const cari = dashView.cari.trim().toLowerCase();
    const hasil = aktif.filter(kelas => (!dashView.tingkat || kelas.tingkat === dashView.tingkat) &&
        (!cari || [kelas.nama, kelas.kode, kelas.mapel, kelas.pengajar, kelas.keterangan]
            .some(teks => String(teks || '').toLowerCase().includes(cari))));

    const totalHalaman = Math.max(1, Math.ceil(hasil.length / BARIS_PER_HALAMAN));
    dashView.halaman = Math.min(Math.max(1, dashView.halaman), totalHalaman);
    const mulai = (dashView.halaman - 1) * BARIS_PER_HALAMAN;
    const tampil = hasil.slice(mulai, mulai + BARIS_PER_HALAMAN);

    tbody.innerHTML = tampil.length
        ? tampil.map(renderDashboardRow).join('')
        : `<tr><td colspan="5" class="table-empty">${aktif.length ? 'Tidak ada rombel yang cocok dengan pencarian/filter.' : 'Belum ada kelas aktif.'}</td></tr>`;
    setText('dash-kelas-info', hasil.length
        ? `Menampilkan ${mulai + 1}-${mulai + tampil.length} dari ${hasil.length} rombel aktif`
        : `Menampilkan 0 dari ${aktif.length} rombel aktif`);
    renderPagination(document.getElementById('dash-kelas-pagination'), dashView.halaman, totalHalaman, halaman => {
        dashView.halaman = halaman;
        renderDashKelasTable();
    });
}

// ---- Kartu Try Out Mendatang: per jenis (PTS, PAS) satu TO terdekat yang belum Selesai ----
function renderTOMendatang() {
    const box = document.getElementById('dash-to-list');
    if (!box) {
        return;
    }
    const kelasMap = Object.fromEntries(getAllKelas().map(k => [k.id, k]));
    const urut = (a, b) => `${a.tanggal} ${a.waktu}`.localeCompare(`${b.tanggal} ${b.waktu}`) || a.id - b.id;
    const list = Object.keys(JENIS_TO).map(jenis => {
        const belum = getAllTO(jenis).filter(t => t.status !== 'Selesai').sort(urut);
        return belum.length ? { to: belum[0], lain: belum.length - 1 } : null;
    }).filter(Boolean);

    box.innerHTML = list.length ? list.map(({ to: t, lain }) => {
        const kelas = kelasMap[t.kelasId];
        const halaman = `pages/to-${t.jenis.toLowerCase()}.html`;
        const siap = t.status === 'Terjadwal';
        return `
            <article class="event-card">
                <div class="event-head">
                    <h3 class="event-title">${escapeHtml(t.judul)}</h3>
                    ${badgeTO(t.status)}
                </div>
                <ul class="meta-list">
                    <li>${iconHtml('calendar', 'icon-sm')}${formatTanggal(t.tanggal)}</li>
                    <li>${iconHtml('clock', 'icon-sm')}${escapeHtml(t.waktu)} WIB (Durasi: ${t.durasi} Menit)</li>
                    <li>${iconHtml('users', 'icon-sm')}Sasaran: ${kelas ? `${kelas.peserta} Peserta ${escapeHtml(kelas.nama)}` : '–'}</li>
                    ${lain ? `<li>${iconHtml('calendar-check', 'icon-sm')}+${lain} TO ${t.jenis} lain belum selesai</li>` : ''}
                </ul>
                <div class="event-foot">
                    <span class="${siap ? 'status-inline' : 'text-secondary'}">${siap ? 'Soal Siap' : 'Penyusunan Butir Soal'} (${t.jumlahSoal} Soal)</span>
                    <a href="${halaman}?id=${t.id}" class="btn btn-small">Detail Ujian</a>
                </div>
            </article>`;
    }).join('') : '<p class="card-text">Belum ada Try Out yang dijadwalkan. Tambahkan melalui menu TO PTS atau TO PAS.</p>';
}

// ---- Kartu Distribusi Modul: dihitung dari data modul ----
function renderDistribusiModul() {
    const status = document.getElementById('dash-modul-status');
    if (!status) {
        return;
    }
    const kelasIds = new Set(getAllKelas().map(k => k.id));
    const modul = getAllModul().filter(m => kelasIds.has(m.kelasId));
    const aktif = modul.filter(m => m.status === 'Aktif');
    const draft = modul.length - aktif.length;
    const jumlahKelas = new Set(aktif.map(m => m.kelasId)).size;

    if (!modul.length) {
        setText('dash-modul-text', 'Belum ada modul belajar. Unggah materi melalui menu Modul.');
    } else {
        setText('dash-modul-text', `${aktif.length} dari ${modul.length} modul sudah aktif dan dapat diakses siswa di ${jumlahKelas} dari ${kelasIds.size} kelas.` +
            (draft ? ` ${draft} modul masih berstatus Draft.` : ''));
    }
    status.classList.toggle('status-inline-warning', modul.length > 0 && draft > 0);
    status.classList.toggle('status-inline-muted', !modul.length);
    status.innerHTML = !modul.length
        ? 'Belum Ada Modul'
        : draft
            ? `${iconHtml('info', 'icon-sm')}${draft} Modul Draft`
            : `${iconHtml('check-circle', 'icon-sm')}Semua Modul Aktif`;
}

// ---- Menu "Tambah Kegiatan": pintasan ke form Tambah Pertemuan / TO PTS / TO PAS ----
function initMenuKegiatan() {
    const menu = document.getElementById('menu-kegiatan');
    if (!menu) {
        return;
    }
    const tombol = document.getElementById('btn-tambah-kegiatan');
    const list = document.getElementById('menu-kegiatan-list');
    const atur = buka => {
        list.hidden = !buka;
        tombol.setAttribute('aria-expanded', String(buka));
    };
    tombol.addEventListener('click', () => {
        atur(list.hidden);
        if (!list.hidden) {
            list.querySelector('a').focus();
        }
    });
    document.addEventListener('click', event => {
        if (!menu.contains(event.target)) {
            atur(false);
        }
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !list.hidden) {
            atur(false);
            tombol.focus();
        }
    });
}

function initDashboardPage() {
    const tingkat = document.getElementById('dash-kelas-tingkat');
    if (tingkat) {
        // Teks singkat ("Semua", "Kelas 8") karena ruang di kepala kartu sempit
        tingkat.innerHTML = '<option value="">Semua</option>' +
            TINGKAT_OPTIONS.map(t => `<option value="${t}">${t.replace('SMP ', '')}</option>`).join('');
        saatNilaiBerubah(tingkat, () => {
            dashView.tingkat = tingkat.value;
            dashView.halaman = 1;
            renderDashKelasTable();
        });
    }
    const search = document.getElementById('dash-kelas-search');
    if (search) {
        search.addEventListener('input', () => {
            dashView.cari = search.value;
            dashView.halaman = 1;
            renderDashKelasTable();
        });
    }
    initMenuKegiatan();
    renderDashboard();
}

/* =========================
   10. LOGIN, SESSION & ROLE (SIMULASI FRONTEND)
   PENTING: ini hanya simulasi untuk tugas client-side. Akun demo & password tertulis di file ini dan
   session disimpan di localStorage, sehingga dapat dilihat/diubah siapa pun lewat DevTools.
   Proteksi halaman di bawah BUKAN keamanan sungguhan — keamanan nyata harus dilakukan di server (backend).
========================= */

const AUTH_KEY = 'dellearn.auth.v1';
// Pesan "tidak memiliki akses" dibawa ke dashboard role (sekali tampil)
const AKSES_KEY = 'dellearn.akses';
const PESAN_TANPA_AKSES = 'Anda tidak memiliki akses ke halaman ini.';

// Akun demo. Pengajar & Peserta terhubung ke data yang sudah ada lewat ID (pengajarId / pesertaId).
const AKUN_DEMO = [
    { id: 'admin', email: 'admin@dellearn.id', password: 'admin123', role: 'admin', nama: 'Administrator DelLearn' },
    { id: 'pengajar', email: 'pengajar@dellearn.id', password: 'guru123', role: 'pengajar', nama: 'Andi Saputra', mapel: 'Matematika', pengajarId: 1 },
    { id: 'peserta', email: 'peserta@dellearn.id', password: 'siswa123', role: 'peserta', nama: 'Seftia Della', gender: 'Perempuan', kelas: 'Matematika SMP Kelas 8', pesertaId: 1 },
];

// Dashboard = alamat dari folder utama project
const ROLE_INFO = {
    admin: { label: 'Admin', portal: 'Portal Admin', dashboard: 'index.html' },
    pengajar: { label: 'Pengajar', portal: 'Portal Pengajar', dashboard: 'pages/dashboard-pengajar.html' },
    peserta: { label: 'Peserta', portal: 'Portal Peserta', dashboard: 'pages/dashboard-peserta.html' },
};

// Halaman (body data-page) → role yang boleh membuka. Halaman yang tidak terdaftar dianggap halaman Admin.
const SEMUA_STAF = ['admin', 'pengajar'];
const AKSES_HALAMAN = {
    'dashboard': ['admin'],
    'data-kelas': ['admin'],
    'form-kelas': ['admin'],
    'data-peserta': ['admin'],
    'data-pengajar': ['admin'],
    'pertemuan': SEMUA_STAF,
    'modul': SEMUA_STAF,
    'tugas': SEMUA_STAF,
    'kuis': SEMUA_STAF,
    'to-pts': SEMUA_STAF,
    'to-pas': SEMUA_STAF,
    'detail-kelas': SEMUA_STAF,
    'rekap-nilai': SEMUA_STAF,
    // P4: Pretest/Aktivitas/Latihan, editor soal, pengumpulan & penilaian tugas (Pengajar: kelas yang diampu)
    'evaluasi': SEMUA_STAF,
    'kelola-soal': SEMUA_STAF,
    'pengumpulan-tugas': SEMUA_STAF,
    // Pemantauan pengerjaan peserta per komponen (Pengajar: kelas yang diampu; Admin: semua kelas)
    'pemantauan': SEMUA_STAF,
    'dashboard-pengajar': ['pengajar'],
    'dashboard-peserta': ['peserta'],
    'kelas-saya': ['peserta'],
    'modul-saya': ['peserta'],
    'aktivitas-saya': ['peserta'],
    'latihan-saya': ['peserta'],
    'kuis-saya': ['peserta'],
    'to-pts-saya': ['peserta'],
    'to-pas-saya': ['peserta'],
    'nilai-saya': ['peserta'],
    'pertemuan-saya': ['peserta'],
    'baca-modul': ['peserta'],
    'tugas-saya': ['peserta'],
    // Peserta mengerjakan; Pengajar & Admin hanya pratinjau (lihat initKerjakanPage)
    'kerjakan': ['peserta', 'pengajar', 'admin'],
    // Pemutar Aktivitas Interaktif: Peserta mengerjakan; Pengajar & Admin pratinjau
    'aktivitas': ['peserta', 'pengajar', 'admin'],
};

function bacaSession() {
    try {
        const raw = window.localStorage.getItem(AUTH_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        return null;
    }
}

// User yang sedang login, atau null. Session yang rusak / akun yang tidak dikenal dianggap belum login.
function getCurrentUser() {
    const session = bacaSession();
    if (!session || session.isLoggedIn !== true) {
        return null;
    }
    const akun = AKUN_DEMO.find(a => a.id === session.userId && a.role === session.role);
    if (!akun) {
        return null;
    }
    return { ...session, pengajarId: akun.pengajarId ?? null, pesertaId: akun.pesertaId ?? null };
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Cari akun dari email atau ID pengguna (tidak membedakan huruf besar/kecil)
function cariAkun(identitas) {
    const kunci = String(identitas || '').trim().toLowerCase();
    return AKUN_DEMO.find(a => a.email === kunci || a.id === kunci) || null;
}

// Proses login. Hasil: { ok: true, user } atau { ok: false, pesan, errors: { identitas?, password? } }
function login(identitas, password) {
    const errors = {};
    if (!String(identitas || '').trim()) {
        errors.identitas = 'Email / ID Pengguna wajib diisi.';
    }
    if (!String(password || '')) {
        errors.password = 'Password wajib diisi.';
    }
    if (Object.keys(errors).length) {
        return { ok: false, errors, pesan: 'Lengkapi Email / ID Pengguna dan Password.' };
    }
    const akun = cariAkun(identitas);
    if (!akun) {
        return { ok: false, errors: { identitas: 'Akun tidak ditemukan.' }, pesan: 'Akun tidak ditemukan. Periksa kembali Email / ID Pengguna.' };
    }
    if (akun.password !== String(password)) {
        return { ok: false, errors: { password: 'Password salah.' }, pesan: 'Password salah. Silakan coba lagi.' };
    }
    // Nama diambil dari Data Pengajar / Data Peserta bila ada, agar sama dengan data yang tampil di sistem
    const sumber = akun.pengajarId ? getPengajarById(akun.pengajarId) : akun.pesertaId ? getPesertaById(akun.pesertaId) : null;
    const session = {
        isLoggedIn: true,
        userId: akun.id,
        nama: sumber ? sumber.nama : akun.nama,
        email: akun.email,
        role: akun.role,
        loginAt: new Date().toISOString(),
    };
    try {
        window.localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    } catch (error) {
        return { ok: false, errors: {}, pesan: 'Session tidak dapat disimpan karena penyimpanan browser (localStorage) diblokir.' };
    }
    return { ok: true, user: getCurrentUser() };
}

function hapusSession() {
    try {
        window.localStorage.removeItem(AUTH_KEY);
    } catch (error) {
        // localStorage tidak tersedia — tidak ada session yang perlu dihapus
    }
}

// Alamat halaman relatif terhadap halaman yang sedang dibuka (folder utama atau folder pages/)
function diFolderPages() {
    return /\/pages\/[^/]*$/.test(window.location.pathname);
}

function urlHalaman(path) {
    return (diFolderPages() ? '../' : '') + path;
}

function dashboardRole(role) {
    return urlHalaman((ROLE_INFO[role] || ROLE_INFO.admin).dashboard);
}

// location.replace: halaman yang ditolak tidak masuk riwayat, jadi tombol Back tidak kembali ke sana
function pindahHalaman(url) {
    halamanDialihkan = true;   // halaman yang langsung dialihkan tidak dicatat di riwayat navigasi
    window.location.replace(url);
}

function logout() {
    hapusSession();
    pindahHalaman(urlHalaman('pages/login.html'));
}

// Belum login → ke halaman login. Hasil true bila boleh lanjut.
function requireAuth() {
    if (isLoggedIn()) {
        return true;
    }
    pindahHalaman(urlHalaman('pages/login.html'));
    return false;
}

// Role tidak sesuai → kembali ke dashboard role masing-masing dengan pesan. Hasil true bila boleh lanjut.
function requireRole(role) {
    if (!requireAuth()) {
        return false;
    }
    const daftar = Array.isArray(role) ? role : [role];
    const user = getCurrentUser();
    if (daftar.includes(user.role)) {
        return true;
    }
    try {
        window.sessionStorage.setItem(AKSES_KEY, PESAN_TANPA_AKSES);
    } catch (error) {
        // sessionStorage tidak tersedia — pesan dilewati, pengalihan tetap berjalan
    }
    pindahHalaman(dashboardRole(user.role));
    return false;
}

// Penjaga setiap halaman (dijalankan sebelum isi halaman disiapkan)
function jagaHalaman() {
    const page = document.body.dataset.page || '';
    if (page === 'login') {
        const user = getCurrentUser();
        if (user) {
            pindahHalaman(dashboardRole(user.role));
            return false;
        }
        return true;
    }
    return requireRole(AKSES_HALAMAN[page] || ['admin']);
}

// ---- Pembatasan data per role (tampilan saja; data di localStorage tidak berubah) ----

// Pengajar → kelas yang diampu; Peserta → kelas yang diikuti; Admin / belum login → semua kelas
function filterKelasMenurutRole(list) {
    const user = getCurrentUser();
    if (!user || user.role === 'admin') {
        return list;
    }
    if (user.role === 'pengajar') {
        return list.filter(kelas => kelas.pengajarId === user.pengajarId);
    }
    const peserta = getPesertaById(user.pesertaId);
    return list.filter(kelas => peserta && kelas.id === peserta.kelasId);
}

// Data (pertemuan/modul/tugas/kuis/TO) hanya dikembalikan bila kelasnya boleh dilihat role yang login
function dalamKelasTerlihat(item) {
    if (!item) {
        return null;
    }
    const user = getCurrentUser();
    if (!user || user.role === 'admin') {
        return item;
    }
    return getKelasById(item.kelasId) ? item : null;
}

// ---- Menu sidebar Pengajar & Peserta (Admin memakai sidebar yang sudah ada di HTML) ----
// href relatif dari folder pages/ (halaman Pengajar & Peserta semuanya ada di sana)
const MENU_ROLE = {
    pengajar: [
        { items: [{ page: 'dashboard-pengajar', label: 'Dashboard Pengajar', icon: 'dashboard', href: 'dashboard-pengajar.html' }] },
        { judul: 'Kelas yang Diampu', items: [{ page: 'detail-kelas', label: 'Detail Kelas', icon: 'book', href: 'detail-kelas.html?id={kelas}' }] },
        {
            judul: 'Pembelajaran', items: [
                { page: 'pertemuan', label: 'Pertemuan', icon: 'calendar', href: 'pertemuan.html' },
                { page: 'evaluasi-pretest', label: 'Pretest', icon: 'clipboard', href: 'evaluasi.html?jenis=pretest' },
                { page: 'modul', label: 'Modul', icon: 'file', href: 'modul.html' },
                { page: 'evaluasi-aktivitas', label: 'Aktivitas Interaktif', icon: 'star', href: 'evaluasi.html?jenis=aktivitas' },
                { page: 'evaluasi-latihan', label: 'Latihan Soal', icon: 'list', href: 'evaluasi.html?jenis=latihan' },
                { page: 'tugas', label: 'Tugas', icon: 'check-square', href: 'tugas.html' },
                { page: 'kuis', label: 'Kuis', icon: 'help', href: 'kuis.html' },
            ],
        },
        {
            judul: 'Penilaian', items: [
                { page: 'hasil-peserta', label: 'Hasil Peserta', icon: 'users', href: 'detail-kelas.html?id={kelas}#nilai' },
                { page: 'rekap-nilai', label: 'Rekap Nilai', icon: 'bar-chart', href: 'rekap-nilai.html' },
            ],
        },
        {
            judul: 'Ruang Try Out', items: [
                { page: 'to-pts', label: 'TO PTS', icon: 'trophy', href: 'to-pts.html' },
                { page: 'to-pas', label: 'TO PAS', icon: 'calendar-check', href: 'to-pas.html' },
            ],
        },
    ],
    peserta: [
        {
            items: [
                { page: 'dashboard-peserta', label: 'Dashboard', icon: 'dashboard', href: 'dashboard-peserta.html' },
                { page: 'kelas-saya', label: 'Kelas Saya', icon: 'book', href: 'kelas-saya.html' },
            ],
        },
        {
            judul: 'Pembelajaran', items: [
                { page: 'modul-saya', label: 'Modul', icon: 'file', href: 'modul-saya.html' },
                { page: 'aktivitas-saya', label: 'Aktivitas Interaktif', icon: 'star', href: 'aktivitas-saya.html' },
                { page: 'latihan-saya', label: 'Latihan Soal', icon: 'check-square', href: 'latihan-saya.html' },
                { page: 'kuis-saya', label: 'Kuis', icon: 'help', href: 'kuis-saya.html' },
                { page: 'tugas-saya', label: 'Tugas', icon: 'pencil', href: 'tugas-saya.html' },
            ],
        },
        {
            judul: 'Ruang Try Out', items: [
                { page: 'to-pts-saya', label: 'TO PTS', icon: 'trophy', href: 'to-pts-saya.html' },
                { page: 'to-pas-saya', label: 'TO PAS', icon: 'calendar-check', href: 'to-pas-saya.html' },
            ],
        },
        { judul: 'Penilaian', items: [{ page: 'nilai-saya', label: 'Nilai Saya', icon: 'bar-chart', href: 'nilai-saya.html' }] },
    ],
};

// Menu Admin untuk halaman baru yang tidak memiliki sidebar tertulis di HTML (mis. kerjakan.html)
MENU_ROLE.admin = [
    { items: [{ page: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: '../index.html' }, { page: 'data-kelas', label: 'Kelas', icon: 'book', href: 'data-kelas.html' }, { page: 'data-peserta', label: 'Peserta', icon: 'users', href: 'data-peserta.html' }, { page: 'data-pengajar', label: 'Pengajar', icon: 'user-check', href: 'data-pengajar.html' }] },
    { judul: 'Pembelajaran', items: MENU_ROLE.pengajar.find(g => g.judul === 'Pembelajaran').items },
    { judul: 'Ruang Try Out', items: [{ page: 'to-pts', label: 'TO PTS', icon: 'trophy', href: 'to-pts.html' }, { page: 'to-pas', label: 'TO PAS', icon: 'calendar-check', href: 'to-pas.html' }] },
    { judul: 'Penilaian', items: [{ page: 'rekap-nilai', label: 'Rekap Nilai', icon: 'bar-chart', href: 'rekap-nilai.html' }] },
];

// Halaman turunan memakai menu aktif halaman induknya
function menuAktif(role) {
    const page = document.body.dataset.page;
    if (page === 'detail-kelas' && window.location.hash === '#nilai') {
        return 'hasil-peserta';   // Detail Kelas & Hasil Peserta memakai halaman yang sama
    }
    if (page === 'pertemuan-saya') {
        return 'kelas-saya';
    }
    if (page === 'baca-modul') {
        return 'modul-saya';
    }
    if (page === 'pengumpulan-tugas') {
        return 'tugas';
    }
    if (page === 'pemantauan') {
        return (JENIS_PEMANTAUAN[new URLSearchParams(window.location.search).get('jenis')] || JENIS_PEMANTAUAN.pretest).menu;
    }
    if (page === 'aktivitas') {
        return role === 'peserta' ? 'aktivitas-saya' : 'evaluasi-aktivitas';
    }
    if (page === 'kerjakan' || page === 'kelola-soal' || page === 'evaluasi') {
        const params = new URLSearchParams(window.location.search);
        const jenis = params.get('jenis');
        const to = jenis === 'to' ? getTOById(params.get('id')) : null;
        const jenisTO = to ? to.jenis.toLowerCase() : 'pts';
        if (role === 'peserta') {
            return { pretest: 'kelas-saya', aktivitas: 'aktivitas-saya', latihan: 'latihan-saya', kuis: 'kuis-saya', to: `to-${jenisTO}-saya` }[jenis] || 'kelas-saya';
        }
        return JENIS_EVALUASI[jenis] ? `evaluasi-${jenis}` : { kuis: 'kuis', to: `to-${jenisTO}` }[jenis] || 'pertemuan';
    }
    return page;
}

function renderMenuRole(role) {
    const aktif = menuAktif(role);
    const kelas = getAllKelas()[0];
    return MENU_ROLE[role].map(grup => {
        const items = grup.items.map(item => {
            // Tanpa kelas yang diampu, menu Detail Kelas / Hasil Peserta kembali ke dashboard
            const href = item.href.includes('{kelas}')
                ? (kelas ? item.href.replace('{kelas}', kelas.id) : 'dashboard-pengajar.html')
                : item.href;
            const kelasLink = `nav-link${grup.judul ? ' nav-sub' : ''}${item.page === aktif ? ' active' : ''}`;
            const current = item.page === aktif ? ' aria-current="page"' : '';
            return `<li><a href="${href}" class="${kelasLink}"${current} data-menu="${item.page}">${iconHtml(item.icon, '')}${escapeHtml(item.label)}</a></li>`;
        }).join('');
        return `${grup.judul ? `<p class="nav-group-title">${escapeHtml(grup.judul)}</p>` : ''}<ul class="nav-list">${items}</ul>`;
    }).join('');
}

// Header (Portal, nama & role dari session, tombol Keluar) + sidebar sesuai role
function terapkanTampilanRole(user) {
    document.body.dataset.role = user.role;
    const info = ROLE_INFO[user.role];

    const portal = document.querySelector('.header-breadcrumb a');
    if (portal) {
        portal.textContent = info.portal;
        portal.href = dashboardRole(user.role);
    }
    const nama = document.querySelector('.profile-name');
    if (nama) {
        const peserta = user.role === 'peserta' ? getPesertaById(user.pesertaId) : null;
        nama.textContent = peserta ? peserta.nama : user.nama;
    }
    const peran = document.querySelector('.profile-role');
    if (peran) {
        peran.textContent = info.label;
    }

    const kanan = document.querySelector('.header-right');
    if (kanan && !document.getElementById('btn-keluar')) {
        kanan.insertAdjacentHTML('beforeend',
            `<button type="button" class="btn btn-secondary btn-small btn-keluar" id="btn-keluar" aria-label="Keluar dari ${escapeHtml(info.portal)}">${iconHtml('logout')}<span class="btn-keluar-text">Keluar</span></button>`);
        document.getElementById('btn-keluar').addEventListener('click', logout);
    }

    // Admin: sidebar tertulis di HTML dipertahankan; halaman tanpa sidebar tertulis diisi menu Admin
    const navAdminKosong = user.role === 'admin' && document.querySelector('.sidebar-nav') && !document.querySelector('.sidebar-nav').children.length;
    if (navAdminKosong) {
        document.querySelector('.sidebar-nav').innerHTML = renderMenuRole('admin');
    }
    if (user.role !== 'admin') {
        const nav = document.querySelector('.sidebar-nav');
        if (nav) {
            nav.innerHTML = renderMenuRole(user.role);
        }
        // Tautan "Dashboard" (index.html = dashboard Admin) diarahkan ke dashboard role masing-masing
        document.addEventListener('click', event => {
            const link = event.target.closest('a[href]');
            if (link && /(^|\/)index\.html([?#].*)?$/.test(link.getAttribute('href'))) {
                event.preventDefault();
                window.location.href = dashboardRole(user.role);
            }
        }, true);
    }
    tampilkanPesanAkses();
}

// Pesan setelah dialihkan dari halaman yang tidak boleh dibuka
function tampilkanPesanAkses() {
    let pesan = null;
    try {
        pesan = window.sessionStorage.getItem(AKSES_KEY);
        window.sessionStorage.removeItem(AKSES_KEY);
    } catch (error) {
        pesan = null;
    }
    const content = document.querySelector('.content');
    if (!pesan || !content) {
        return;
    }
    content.insertAdjacentHTML('afterbegin',
        `<div class="alert alert-error" id="akses-alert" role="alert">${iconHtml('info', '')}<span>${escapeHtml(pesan)}</span></div>`);
}

/* =========================
   11. HALAMAN LOGIN
========================= */

function initLoginPage() {
    const form = document.getElementById('form-login');
    const alert = document.getElementById('login-alert');
    const password = form.elements.password;
    const fields = ['identitas', 'password'];

    const tampilkanError = hasil => {
        setText('login-alert-text', hasil.pesan);
        alert.hidden = false;
        tampilkanErrorForm(form, fields, hasil.errors || {});
    };

    form.addEventListener('submit', event => {
        event.preventDefault();
        const hasil = login(form.elements.identitas.value, password.value);
        if (!hasil.ok) {
            tampilkanError(hasil);
            return;
        }
        alert.hidden = true;
        pindahHalaman(dashboardRole(hasil.user.role));
    });

    // Error kolom hilang saat kolom diisi lagi
    form.addEventListener('input', event => {
        if (fields.includes(event.target.name)) {
            showFieldError(form, event.target.name, '');
        }
    });

    // Tampilkan / sembunyikan password
    const toggle = document.getElementById('btn-lihat-password');
    toggle.addEventListener('click', () => {
        const tampil = password.type === 'password';
        password.type = tampil ? 'text' : 'password';
        toggle.setAttribute('aria-pressed', String(tampil));
        toggle.setAttribute('aria-label', tampil ? 'Sembunyikan password' : 'Tampilkan password');
        toggle.querySelector('.icon').className = `icon ${tampil ? 'i-eye-off' : 'i-eye'}`;
    });

    // Klik akun demo → isi email & password (tidak membuat akun baru)
    document.querySelectorAll('[data-demo]').forEach(tombol => {
        tombol.addEventListener('click', () => {
            const akun = AKUN_DEMO.find(a => a.id === tombol.dataset.demo);
            form.elements.identitas.value = akun.email;
            password.value = akun.password;
            fields.forEach(field => showFieldError(form, field, ''));
            alert.hidden = true;
            form.elements.identitas.focus();
        });
    });
}

/* =========================
   12. PORTAL PENGAJAR (dashboard-pengajar.html)
   Semua angka dari data yang sudah ada: kelas (pengajarId), peserta, pertemuan, modul, tugas, kuis, TO.
========================= */

// Kelas yang diampu pengajar yang login (getAllKelas sudah dibatasi untuk role Pengajar)
function getKelasDiampu() {
    const user = getCurrentUser();
    return getAllKelas().filter(kelas => user && kelas.pengajarId === user.pengajarId);
}

function daftarAktivitasHtml(list, kosong) {
    return list.length
        ? list.map(a => `
            <li class="activity-item">
                <span class="activity-icon">${iconHtml(a.icon, '')}</span>
                <div>
                    <p class="activity-title">${escapeHtml(a.judul)}</p>
                    <p class="activity-meta">${escapeHtml(a.meta)}</p>
                </div>
            </li>`).join('')
        : `<li class="table-empty">${escapeHtml(kosong)}</li>`;
}

function jadwalTOSingkat(kelasId, jenis) {
    const to = getTOKelas(kelasId, jenis);
    return to ? `${formatTanggal(to.tanggal)} · ${to.status}` : 'Belum dijadwalkan';
}

// Aktivitas terbaru kelas: data terbaru (ID terbesar) dari modul/tugas/kuis + pertemuan terakhir yang selesai
function getAktivitasKelas(kelasIds, untukPeserta = false) {
    const ids = new Set(kelasIds);
    const namaKelas = id => (getKelasById(id) || { nama: '' }).nama;
    const terbaru = list => list.filter(item => ids.has(item.kelasId)).sort((a, b) => b.id - a.id)[0];
    const hasil = [];

    const selesai = getAllPertemuan().filter(p => ids.has(p.kelasId) && statusPertemuan(p) === 'Selesai')
        .sort((a, b) => b.tanggal.localeCompare(a.tanggal))[0];
    if (selesai) {
        hasil.push({
            icon: 'check-circle',
            judul: untukPeserta
                ? `Menyelesaikan Pertemuan ${selesai.nomor} · ${selesai.judul}`
                : `Pertemuan ${selesai.nomor} · ${selesai.judul} selesai`,
            meta: `${namaKelas(selesai.kelasId)} · ${formatTanggal(selesai.tanggal)}`,
        });
    }
    const modul = terbaru(getAllModul().filter(m => !untukPeserta || m.status === 'Aktif'));
    if (modul) {
        hasil.push({ icon: 'file', judul: `Modul "${modul.judul}" ${untukPeserta ? 'tersedia' : 'ditambahkan'}`, meta: `${namaKelas(modul.kelasId)} · ${modul.format}` });
    }
    const tugas = terbaru(getAllTugas().filter(t => !untukPeserta || t.status !== 'Draft'));
    if (tugas) {
        hasil.push({ icon: 'check-square', judul: `Tugas "${tugas.judul}" ${untukPeserta ? 'diberikan' : 'dibuat'}`, meta: `${namaKelas(tugas.kelasId)} · ${tugas.deadline ? `deadline ${formatTanggalWaktu(tugas.deadline)}` : 'tanpa deadline'}` });
    }
    const kuis = terbaru(getAllKuis().filter(k => !untukPeserta || k.status !== 'Draft'));
    if (kuis) {
        hasil.push({ icon: 'help', judul: `Kuis "${kuis.judul}" (${kuis.status})`, meta: `${namaKelas(kuis.kelasId)} · ${kuis.jumlahSoal} soal` });
    }
    return hasil;
}

function initDashboardPengajarPage() {
    const user = getCurrentUser();
    const kelasList = getKelasDiampu();
    const ids = kelasList.map(k => k.id);
    const milik = list => list.filter(item => ids.includes(item.kelasId));

    setText('pengajar-sapaan', `Halo, ${user.nama} 👋`);
    const pengajar = getPengajarById(user.pengajarId);
    setText('pengajar-mapel', pengajar ? `Pengajar ${pengajar.mapel}` : 'Pengajar');

    const tugas = milik(getAllTugas());
    const kuis = milik(getAllKuis());
    setText('pg-stat-kelas', kelasList.length);
    setText('pg-stat-kelas-info', `${kelasList.filter(k => k.status === 'Aktif').length} kelas aktif`);
    setText('pg-stat-peserta', kelasList.reduce((sum, k) => sum + k.peserta, 0));
    setText('pg-stat-peserta-info', 'Dari Data Peserta');
    setText('pg-stat-modul', milik(getAllModul()).length);
    setText('pg-stat-modul-info', `${milik(getAllModul()).filter(m => m.status === 'Aktif').length} aktif`);
    setText('pg-stat-evaluasi', tugas.length + kuis.length);
    setText('pg-stat-evaluasi-info', `${tugas.length} tugas · ${kuis.length} kuis`);

    // Kelas yang diampu
    document.getElementById('pg-kelas-list').innerHTML = kelasList.length ? kelasList.map(kelas => {
        const pertemuan = getPertemuanByKelas(kelas.id);
        const selesai = pertemuan.filter(p => statusPertemuan(p) === 'Selesai').length;
        return `
            <article class="event-card">
                <div class="event-head">
                    <h3 class="event-title">${escapeHtml(kelas.nama)}</h3>
                    <span class="badge ${kelas.status === 'Aktif' ? 'badge-success' : 'badge-muted'} badge-dot">${escapeHtml(kelas.status)}</span>
                </div>
                <ul class="meta-list">
                    <li>${iconHtml('users')}${kelas.peserta} Peserta (kapasitas ${kelas.kapasitas})</li>
                    <li>${iconHtml('calendar')}${pertemuan.length} Pertemuan · ${selesai} selesai</li>
                    <li>${iconHtml('trophy')}TO PTS: ${escapeHtml(jadwalTOSingkat(kelas.id, 'PTS'))}</li>
                    <li>${iconHtml('calendar-check')}TO PAS: ${escapeHtml(jadwalTOSingkat(kelas.id, 'PAS'))}</li>
                </ul>
                <progress class="progress" value="${selesai}" max="${pertemuan.length || 1}">${selesai} dari ${pertemuan.length} pertemuan</progress>
                <div class="event-foot">
                    <a href="pertemuan.html?kelas=${kelas.id}" class="btn btn-small">Pertemuan</a>
                    <a href="detail-kelas.html?id=${kelas.id}" class="btn btn-small">Detail Kelas</a>
                </div>
            </article>`;
    }).join('') : '<p class="card-text">Belum ada kelas yang diampu. Admin dapat menugaskan kelas melalui menu Kelas.</p>';

    // Pertemuan mendatang = belum selesai, tanggal terdekat dulu
    const mendatang = milik(getAllPertemuan()).filter(p => statusPertemuan(p) !== 'Selesai')
        .sort((a, b) => a.tanggal.localeCompare(b.tanggal) || a.nomor - b.nomor).slice(0, 4);
    document.getElementById('pg-pertemuan-list').innerHTML = mendatang.length ? mendatang.map(p => `
        <li class="meeting-item">
            <a class="meeting-left meeting-link" href="pertemuan.html?id=${p.id}">
                <span class="meeting-number">${p.nomor}</span>
                <span>
                    <span class="meeting-title">Pertemuan ${p.nomor} · ${escapeHtml(p.judul)}</span>
                    <span class="meeting-info">${escapeHtml((getKelasById(p.kelasId) || { nama: '' }).nama)} · ${formatTanggal(p.tanggal)} · ${p.komponen.length}/${KOMPONEN_PERTEMUAN.length} komponen siap</span>
                </span>
            </a>
            ${badgeStatusPertemuanHtml(p)}
        </li>`).join('') : '<li class="table-empty">Tidak ada pertemuan mendatang.</li>';

    document.getElementById('pg-aktivitas-list').innerHTML = daftarAktivitasHtml(getAktivitasKelas(ids), 'Belum ada aktivitas.');
}

/* =========================
   13. PORTAL PESERTA (dashboard-peserta.html & halaman "… Saya")
   Status & progress belajar dihitung dari hasil pengerjaan nyata (koleksi hasil & progresmodul).
========================= */

// Peserta & kelas yang login. Bila peserta/kelasnya sudah tidak ada, halaman menampilkan keadaan kosong.
function getKonteksPeserta() {
    const user = getCurrentUser();
    const peserta = user ? getPesertaById(user.pesertaId) : null;
    const kelas = peserta && peserta.kelasId !== null ? getKelasById(peserta.kelasId) : null;
    const pertemuan = kelas ? getPertemuanByKelas(kelas.id) : [];
    const pertemuanMap = Object.fromEntries(pertemuan.map(p => [p.id, p]));
    return { user, peserta, kelas, pertemuan, pertemuanMap };
}

function getModulPeserta(ctx) {
    return ctx.kelas ? getAllModul().filter(m => m.kelasId === ctx.kelas.id && m.status === 'Aktif') : [];
}

// Nilai efektif peserta (hasil pengerjaan nyata menggantikan nilai awal per komponen); bisa belum lengkap
function getNilaiPeserta(ctx) {
    if (!ctx.peserta || !ctx.kelas) {
        return null;
    }
    return getNilaiEfektif(ctx.peserta.id, ctx.kelas.id);
}

// Keadaan kosong (peserta belum punya kelas / data peserta tidak ditemukan). Hasil true bila halaman boleh diisi.
function siapkanHalamanPeserta(ctx) {
    const kosong = document.getElementById('peserta-kosong');
    const konten = document.getElementById('peserta-konten');
    const ada = Boolean(ctx.kelas);
    if (kosong) {
        kosong.hidden = ada;
        kosong.textContent = ctx.peserta
            ? 'Anda belum terdaftar di kelas mana pun. Hubungi Admin DelLearn untuk didaftarkan ke kelas.'
            : 'Data peserta untuk akun ini tidak ditemukan di Data Peserta. Hubungi Admin DelLearn.';
    }
    if (konten) {
        konten.hidden = !ada;
    }
    return ada;
}

function namaPengajarKelas(kelas) {
    const pengajar = kelas.pengajarId !== null ? getPengajarById(kelas.pengajarId) : null;
    return pengajar ? namaLengkapPengajar(pengajar) : kelas.pengajar;
}

// TO PTS/PAS kelas peserta beserta status pengerjaannya: { to, status, skor, aksi } atau null bila belum dijadwalkan
function getTOPeserta(ctx, jenis, data = bacaDataBelajar()) {
    const to = getTOKelas(ctx.kelas.id, jenis);
    if (!to || to.status === 'Draft') {
        return null;
    }
    const s = statusItemPeserta(ctx.peserta.id, 'to', to, data.hasil);
    const x = { jenis: 'to', item: to, ...s };
    return { ...x, aksi: aksiItemPeserta(x) };
}

function kartuTOPesertaHtml(ctx, jenis, data) {
    const t = getTOPeserta(ctx, jenis, data);
    const to = t ? t.item : null;
    return `
        <article class="event-card">
            <div class="event-head">
                <h3 class="event-title">${to ? escapeHtml(to.judul) : `TO ${jenis}`}</h3>
                ${t ? badgeStatusPeserta(t.status) : '<span class="badge badge-muted badge-dot">Belum dijadwalkan</span>'}
            </div>
            <ul class="meta-list">
                <li>${iconHtml('calendar')}${to ? `${formatTanggal(to.tanggal)}, ${escapeHtml(to.waktu)} WIB` : 'Jadwal akan diumumkan'}</li>
                ${to ? `<li>${iconHtml('clock')}${getSoalTO(to).length} soal · ${to.durasi} menit</li>` : ''}
                <li>${iconHtml('book')}Materi: ${escapeHtml(labelCakupanTO(ctx.kelas.id, jenis))}</li>
            </ul>
            <div class="event-foot">
                <span class="${t && t.skor !== null ? 'status-inline' : 'text-secondary'}">${t && t.skor !== null ? `Nilai ${t.skor}` : `Simulasi ${escapeHtml(JENIS_TO[jenis].nama)}`}</span>
                <a href="to-${jenis.toLowerCase()}-saya.html" class="btn btn-small">Lihat TO ${jenis}</a>
            </div>
        </article>`;
}

// Riwayat belajar peserta (terbaru dulu) untuk "Aktivitas Terbaru"
function getRiwayatPeserta(ctx, data = bacaDataBelajar()) {
    const judulItem = (jenis, id) => {
        const sumber = { modul: data.modul, kuis: data.kuis, tugas: data.tugas, to: getAllTO() }[jenis] || data.evaluasi;
        const item = sumber.find(x => x.id === id);
        return item ? item.judul : '(sudah dihapus)';
    };
    const ikon = { pretest: 'help', aktivitas: 'star', latihan: 'check-square', kuis: 'trophy', to: 'calendar-check', tugas: 'pencil', modul: 'file' };
    const riwayat = [
        ...data.hasil.filter(h => h.pesertaId === ctx.peserta.id && h.kelasId === ctx.kelas.id && ikon[h.jenis] && (h.selesai || h.dikumpulkan)).map(h => ({
            waktu: h.selesai || h.dikumpulkan,
            icon: ikon[h.jenis],
            judul: h.jenis === 'tugas'
                ? `${h.status === 'Dinilai' ? 'Tugas dinilai' : 'Mengumpulkan tugas'}: ${judulItem('tugas', h.itemId)}`
                : `Menyelesaikan ${LABEL_JENIS_KERJA[h.jenis]}: ${judulItem(h.jenis, h.itemId)}`,
            meta: h.jenis === 'tugas' ? (h.status === 'Dinilai' ? `Nilai ${h.nilai}` : 'Menunggu penilaian pengajar') : `Nilai ${h.skor}`,
        })),
        ...data.progres.filter(p => p.pesertaId === ctx.peserta.id && p.status === 'Selesai').map(p => ({
            waktu: p.selesai, icon: 'file', judul: `Selesai mempelajari modul: ${judulItem('modul', p.modulId)}`, meta: 'Modul ditandai sudah dipelajari',
        })),
    ];
    return riwayat.sort((a, b) => String(b.waktu).localeCompare(String(a.waktu)))
        .map(r => ({ ...r, meta: `${r.meta} · ${formatTanggalWaktu(r.waktu)}` }));
}

function initDashboardPesertaPage() {
    const ctx = getKonteksPeserta();
    // Nama & gender selalu dari Data Peserta terbaru (bukan dari session yang mungkin lama)
    const nama = ctx.peserta ? ctx.peserta.nama : ctx.user.nama;
    setText('peserta-sapaan', `Halo, ${nama} 👋`);
    if (ctx.peserta) {
        setText('peserta-profil', `NIS ${ctx.peserta.nis}${ctx.peserta.gender ? ` · Gender: ${ctx.peserta.gender}` : ''} · Yuk lanjutkan belajar hari ini.`);
    }
    if (!siapkanHalamanPeserta(ctx)) {
        return;
    }
    const { kelas, pertemuan, peserta } = ctx;
    const data = bacaDataBelajar();
    const konten = pertemuan.map(p => ({ p, grup: getKontenPertemuanPeserta(peserta.id, p.id, data) }));
    const progres = hitungProgresKonten(konten.flatMap(k => k.grup));

    // Kelas Saya
    setText('ps-kelas-nama', kelas.nama);
    setText('ps-kelas-pengajar', `Pengajar: ${namaPengajarKelas(kelas)}`);
    setText('ps-kelas-info', `${progres.selesai} dari ${progres.total} materi & evaluasi dikerjakan`);
    setText('ps-kelas-progress-text', `${progres.persen}%`);
    const bar = document.getElementById('ps-kelas-progress');
    bar.value = progres.persen;
    bar.textContent = `${progres.persen}%`;

    // Lanjutkan belajar: pertemuan pertama (urut nomor) yang masih punya bagian belum dikerjakan
    const box = document.getElementById('ps-lanjut');
    const berisi = konten.filter(k => hitungProgresKonten(k.grup).total);
    const lanjut = berisi.find(k => { const pr = hitungProgresKonten(k.grup); return pr.selesai < pr.total; }) || berisi[berisi.length - 1];
    if (lanjut) {
        const pr = hitungProgresKonten(lanjut.grup);
        const berikut = lanjut.grup.flatMap(g => g.items).find(x => !x.tuntas);
        box.innerHTML = `
            <p class="eyebrow">Pertemuan ${lanjut.p.nomor} · ${statusPertemuanPeserta(pr)}</p>
            <h3 class="lanjut-title">${escapeHtml(lanjut.p.judul)}</h3>
            <div class="progress-head">
                <span>Progress</span>
                <span class="progress-value">${pr.persen}%</span>
            </div>
            <progress class="progress" value="${pr.persen}" max="100">${pr.persen}%</progress>
            <p class="cell-meta">${berikut ? `Berikutnya: ${escapeHtml(berikut.item.judul)}` : 'Semua bagian pertemuan ini sudah dikerjakan.'}</p>
            <a href="pertemuan-saya.html?id=${lanjut.p.id}" class="btn btn-primary" id="btn-tampilkan-pembelajaran">Tampilkan Pembelajaran</a>`;
    } else {
        box.innerHTML = '<p class="card-text">Pengajar belum menerbitkan materi untuk kelas Anda.</p>';
    }

    // Statistik belajar
    const semuaItem = konten.flatMap(k => k.grup.flatMap(g => g.items));
    const hitung = jenis => {
        const items = semuaItem.filter(x => x.jenis === jenis);
        return `${items.filter(x => x.tuntas).length} / ${items.length}`;
    };
    const nilai = getNilaiPeserta(ctx);
    setText('ps-stat-modul', hitung('modul'));
    setText('ps-stat-kuis', hitung('kuis'));
    setText('ps-stat-nilai', nilai && nilai.lengkap ? formatNilai(hitungNilaiAkhir(nilai)) : '–');
    setText('ps-stat-nilai-info', nilai && nilai.lengkap ? 'Nilai akhir (bobot 20/20/30/30)' : 'Belum lengkap');
    setText('ps-stat-progress', `${progres.persen}%`);

    document.getElementById('ps-to-list').innerHTML = kartuTOPesertaHtml(ctx, 'PTS', data) + kartuTOPesertaHtml(ctx, 'PAS', data);
    // Aktivitas terbaru: riwayat belajar peserta; bila belum ada, materi terbaru di kelas
    const riwayat = getRiwayatPeserta(ctx, data).slice(0, 5);
    document.getElementById('ps-aktivitas-list').innerHTML = daftarAktivitasHtml(
        riwayat.length ? riwayat : getAktivitasKelas([kelas.id], true), 'Belum ada aktivitas.');
}

// ---- Status belajar peserta dari data nyata (hasil pengerjaan & progres modul) ----
const BADGE_STATUS_PESERTA = {
    'Belum dikerjakan': 'badge-neutral', 'Sedang dikerjakan': 'badge-warning', 'Selesai': 'badge-success',
    'Belum dipelajari': 'badge-neutral', 'Sedang dipelajari': 'badge-warning',
    'Belum dikumpulkan': 'badge-neutral', 'Dikumpulkan': 'badge-info', 'Dinilai': 'badge-success',
    'Ditutup': 'badge-muted', 'Belum dimulai': 'badge-neutral', 'Belum ada materi': 'badge-muted',
};
function badgeStatusPeserta(status) {
    return `<span class="badge ${BADGE_STATUS_PESERTA[status] || 'badge-muted'} badge-dot">${escapeHtml(status)}</span>`;
}

// Status satu item untuk seorang peserta: { status, skor, tuntas, hasil }
// tuntas = sudah pernah diselesaikan (dipakai untuk progress); Latihan/Aktivitas yang sedang diulang tetap tuntas
function statusItemPeserta(pesertaId, jenis, item, hasilList = getAllHasil(), progresList = getKoleksi('progresmodul')) {
    if (jenis === 'modul') {
        const p = progresList.find(x => x.pesertaId === pesertaId && x.modulId === item.id);
        const status = p ? p.status : 'Belum dipelajari';
        return { status, skor: null, tuntas: status === 'Selesai', hasil: p || null };
    }
    const h = hasilList.find(x => x.pesertaId === pesertaId && x.jenis === jenis && x.itemId === item.id);
    if (jenis === 'tugas') {
        if (!h) {
            return { status: item.status === 'Ditutup' ? 'Ditutup' : 'Belum dikumpulkan', skor: null, tuntas: false, hasil: null };
        }
        return { status: h.status, skor: h.status === 'Dinilai' ? h.nilai : null, tuntas: true, hasil: h };
    }
    if (!h) {
        const tutup = (jenis === 'kuis' && item.status === 'Ditutup') || (jenis === 'to' && item.status === 'Selesai');
        return { status: tutup ? 'Ditutup' : 'Belum dikerjakan', skor: null, tuntas: false, hasil: null };
    }
    const pernahSelesai = h.skorTerbaik !== null && h.skorTerbaik !== undefined;
    return {
        status: h.status,
        // Aktivitas & Latihan (boleh diulang): yang ditampilkan skor terbaik
        skor: BOLEH_DIULANG[jenis] && pernahSelesai ? h.skorTerbaik : h.status === 'Selesai' ? h.skor : (pernahSelesai ? h.skorTerbaik : null),
        tuntas: h.status === 'Selesai' || pernahSelesai,
        hasil: h,
    };
}

// Urutan isi setiap pertemuan (sesuai PERANCANGAN.md: Pretest → Modul → Aktivitas → Latihan → Kuis), ditambah Tugas
const GRUP_PERTEMUAN = [
    { key: 'pretest', label: 'Pretest', icon: 'help', emoji: '🧭', tagline: 'Seberapa jauh aku sudah tahu sebelum belajar?', kosong: 'Pengajar belum menyiapkan pretest untuk pertemuan ini.' },
    { key: 'modul', label: 'Modul Pembelajaran', icon: 'file', emoji: '📖', tagline: 'Aku mempelajari materinya.', kosong: 'Pengajar belum menerbitkan modul untuk pertemuan ini.' },
    { key: 'aktivitas', label: 'Aktivitas Interaktif', icon: 'star', emoji: '🧩', tagline: 'Aku belajar sambil melakukan aktivitas.', kosong: 'Pengajar belum menyiapkan aktivitas interaktif untuk pertemuan ini.' },
    { key: 'latihan', label: 'Latihan Soal', icon: 'check-square', emoji: '✏️', tagline: 'Aku berlatih memahami materi.', kosong: 'Pengajar belum menyiapkan latihan soal untuk pertemuan ini.' },
    { key: 'kuis', label: 'Kuis', icon: 'trophy', emoji: '🏆', tagline: 'Aku menguji pemahamanku.', kosong: 'Pengajar belum menerbitkan kuis untuk pertemuan ini.' },
    { key: 'tugas', label: 'Tugas', icon: 'pencil', emoji: '📝', tagline: 'Tugas tambahan dari pengajar.', kosong: 'Tidak ada tugas pada pertemuan ini.' },
];
// Lima komponen utama setiap pertemuan (Tugas = tambahan, tidak dihitung dalam 5 langkah).
// ALUR WAJIB BERURUTAN: Pretest → Modul → Aktivitas Interaktif → Latihan Soal → Kuis → Penilaian.
// Langkah berikutnya TERKUNCI sampai semua langkah sebelumnya (yang tersedia) selesai.
const LANGKAH_PERTEMUAN = ['pretest', 'modul', 'aktivitas', 'latihan', 'kuis'];
const ALASAN_KUNCI = {
    pretest: '🔒 Selesaikan Pretest terlebih dahulu.',
    modul: '🔒 Selesaikan seluruh modul pembelajaran terlebih dahulu.',
    aktivitas: '🔒 Selesaikan seluruh aktivitas interaktif terlebih dahulu.',
    latihan: '🔒 Selesaikan latihan soal terlebih dahulu.',
    kuis: '🔒 Selesaikan kuis terlebih dahulu.',
};
// Status langkah yang ditampilkan ke peserta
const STATUS_LANGKAH = {
    selesai: { tanda: '✓', label: 'Selesai' },
    sedang: { tanda: '▶', label: 'Sedang Dikerjakan' },
    terkunci: { tanda: '🔒', label: 'Terkunci' },
    belum: { tanda: '○', label: 'Belum Dimulai' },
    kosong: { tanda: '–', label: 'Belum tersedia' },
};

// Item yang wajib diselesaikan: kuis/TO yang sudah ditutup tanpa hasil tidak dapat dikerjakan → tidak menghalangi
function itemWajib(x) {
    return !(x.status === 'Ditutup' && !x.hasil);
}

// Alur satu pertemuan: setiap langkah { key, label, emoji, ada, selesai, progres, terkunci, alasan, kode, status, items }.
// Langkah tanpa isi dilewati (tidak mengunci). Langkah yang sudah pernah dikerjakan tidak dikunci kembali.
function alurPertemuan(grup) {
    let penghalang = null;   // langkah pertama (tersedia) yang belum selesai
    const langkah = LANGKAH_PERTEMUAN.map(key => {
        const g = grup.find(x => x.key === key) || { label: key, emoji: '', items: [] };
        const wajib = g.items.filter(itemWajib);
        const ada = wajib.length > 0;
        const selesai = ada && wajib.every(i => i.tuntas);
        const progres = g.items.some(i => i.hasil);
        const terkunci = ada && !selesai && penghalang !== null && !progres;
        const kode = !ada ? 'kosong' : selesai ? 'selesai' : terkunci ? 'terkunci' : progres ? 'sedang' : 'belum';
        const l = { key, label: g.label, emoji: g.emoji, ada, selesai, progres, terkunci, kode, status: STATUS_LANGKAH[kode].label,
            alasan: terkunci ? ALASAN_KUNCI[penghalang.key] : '', penghalang: terkunci ? penghalang : null, items: g.items };
        if (ada && !selesai && penghalang === null) {
            penghalang = l;
        }
        return l;
    });
    const tersedia = langkah.filter(l => l.ada);
    const selesai = tersedia.filter(l => l.selesai).length;
    const tuntas = tersedia.length > 0 && selesai === tersedia.length;
    return { langkah, total: tersedia.length, selesai, tuntas, berikut: tersedia.find(l => !l.selesai) || null };
}

// Kompatibel dengan pemanggil lama: progres 5 langkah = alur pertemuan
function progresLangkah(grup) {
    return alurPertemuan(grup);
}

// Tandai setiap item dengan status kunci langkahnya (x.terkunci, x.alasan)
function terapkanKunci(grup) {
    const alur = alurPertemuan(grup);
    alur.langkah.forEach(l => l.items.forEach(x => {
        x.terkunci = l.terkunci;
        x.alasan = l.alasan;
    }));
    return alur;
}

// Data yang dibaca sekali per halaman (agar tidak membaca localStorage berulang-ulang)
function bacaDataBelajar() {
    return {
        evaluasi: getAllEvaluasi(), modul: getAllModul(), kuis: getAllKuis(), tugas: getAllTugas(),
        hasil: getAllHasil(), progres: getKoleksi('progresmodul'), pertemuan: getAllPertemuan(),
    };
}

// Isi satu pertemuan untuk peserta: hanya konten yang Aktif / tidak Draft. Latihan Soal = latihan yang dikerjakan
// langsung di sistem saja. Tugas tampil di pertemuan tetapi BUKAN bagian alur terkunci. Status kunci ditandai per item.
function getKontenPertemuanPeserta(pesertaId, pertemuanId, data = bacaDataBelajar()) {
    const pid = Number(pertemuanId);
    const evaluasi = jenis => data.evaluasi.filter(e => e.pertemuanId === pid && e.jenis === jenis && e.status === 'Aktif');
    const sumber = {
        pretest: evaluasi('pretest'),
        modul: data.modul.filter(m => m.pertemuanId === pid && m.status === 'Aktif'),
        aktivitas: evaluasi('aktivitas').sort((a, b) => (a.urutan || 0) - (b.urutan || 0) || a.id - b.id),
        latihan: evaluasi('latihan'),
        kuis: data.kuis.filter(k => k.pertemuanId === pid && k.status !== 'Draft'),
        tugas: data.tugas.filter(t => t.pertemuanId === pid && t.status !== 'Draft'),
    };
    const grup = GRUP_PERTEMUAN.map(g => ({
        ...g,
        items: sumber[g.key].map(item => ({ jenis: g.key, item, ...statusItemPeserta(pesertaId, g.key, item, data.hasil, data.progres) })),
    }));
    terapkanKunci(grup);
    terapkanJadwal(grup, aksesPertemuan(pid, data.pertemuan || getAllPertemuan()));
    return grup;
}

// Akses jadwal pertemuan pada setiap item (setelah kunci alur berurutan):
//   Belum Dimulai → semua item tertutup (termasuk Tugas)
//   Selesai       → read-only: item yang sudah punya hasil tetap dapat dilihat; Modul & soal Tugas tetap dapat dibaca;
//                   Pretest/Aktivitas/Latihan/Kuis yang belum pernah dikerjakan ditutup
//   Berjalan      → mengikuti kunci alur berurutan yang sudah ada
function terapkanJadwal(grup, akses) {
    grup.forEach(g => g.items.forEach(x => {
        x.jadwal = akses.status;
        x.readOnly = !akses.boleh;
        if (akses.boleh) {
            return;
        }
        const bolehLihat = akses.status === 'Selesai' && (x.hasil || x.jenis === 'modul' || x.jenis === 'tugas');
        x.terkunci = !bolehLihat;
        x.alasan = akses.alasan;
        x.labelKunci = akses.status === 'Belum Dimulai' ? '⏳ Belum Dimulai' : '⏹ Ditutup';
    }));
}

// Pemeriksaan kunci untuk akses langsung lewat URL (peserta). jenis: pretest|modul|aktivitas|latihan|kuis (Tugas tidak dikunci).
// Hasil null bila boleh dibuka, atau { alasan, href } (href = langkah yang harus diselesaikan dulu, relatif folder pages/).
function cekKunciPeserta(jenis, itemId) {
    const user = getCurrentUser();
    if (!user || user.role !== 'peserta') {
        return null;
    }
    const ctx = getKonteksPeserta();
    if (!ctx.kelas) {
        return null;
    }
    const data = bacaDataBelajar();
    const key = jenis;
    if (!LANGKAH_PERTEMUAN.includes(key)) {
        return null;
    }
    for (const p of ctx.pertemuan) {
        const grup = getKontenPertemuanPeserta(ctx.peserta.id, p.id, data);
        const x = (grup.find(g => g.key === key) || { items: [] }).items.find(i => i.jenis === jenis && i.item.id === Number(itemId));
        if (x) {
            // 1. Jadwal: belum dimulai → kembali ke halaman pertemuan; selesai → halaman dibuka read-only (aksi baru ditolak)
            const akses = aksesPertemuan(p.id, data.pertemuan);
            if (akses.status === 'Belum Dimulai') {
                return { alasan: akses.alasan, href: `pertemuan-saya.html?id=${p.id}` };
            }
            if (!akses.boleh) {
                return null;
            }
            // 2. Alur berurutan (tidak berubah; saat Berjalan, x.terkunci hanya berasal dari kunci alur)
            if (!x.terkunci) {
                return null;
            }
            const alur = alurPertemuan(grup);
            const l = alur.langkah.find(s => s.key === key);
            const target = l.penghalang.items.find(i => itemWajib(i) && !i.tuntas);
            return { alasan: x.alasan, href: target ? aksiItemPeserta(target).href : `pertemuan-saya.html?id=${p.id}` };
        }
    }
    return null;
}

// Kalimat singkat setelah menyelesaikan sesuatu: langkah apa yang kini terbuka / pembelajaran selesai
function pesanLangkahBerikut(pesertaId, pertemuanId) {
    const alur = alurPertemuan(getKontenPertemuanPeserta(pesertaId, pertemuanId));
    if (alur.tuntas) {
        return '🎉 Seluruh langkah pertemuan ini selesai — hasilmu sudah masuk ke Penilaian.';
    }
    return alur.berikut ? `➡️ Langkah berikutnya: ${alur.berikut.emoji} ${alur.berikut.label}.` : '';
}

// Akses langsung ke langkah yang terkunci → kembali ke langkah yang harus diselesaikan dengan pesan. Hasil true bila dialihkan.
function tolakBilaTerkunci(jenis, itemId) {
    const kunci = cekKunciPeserta(jenis, itemId);
    if (!kunci) {
        return false;
    }
    try {
        window.sessionStorage.setItem(AKSES_KEY, kunci.alasan);
    } catch (error) {
        // sessionStorage tidak tersedia — pesan dilewati, pengalihan tetap berjalan
    }
    pindahHalaman(kunci.href);
    return true;
}

function hitungProgresKonten(grup) {
    const items = grup.flatMap(g => g.items);
    const selesai = items.filter(i => i.tuntas).length;
    return { total: items.length, selesai, persen: items.length ? Math.round((selesai / items.length) * 100) : 0 };
}

function statusPertemuanPeserta(progres) {
    if (!progres.total) {
        return 'Belum ada materi';
    }
    if (progres.selesai === progres.total) {
        return 'Selesai';
    }
    return progres.selesai ? 'Sedang dipelajari' : 'Belum dimulai';
}

// Label & tautan tombol aksi setiap item
function aksiItemPeserta(x) {
    if (x.jenis === 'modul') {
        return { label: { 'Sedang dipelajari': 'Lanjut Baca', 'Selesai': 'Baca Lagi' }[x.status] || 'Baca Modul', href: `baca-modul.html?id=${x.item.id}` };
    }
    if (x.jenis === 'tugas') {
        return { label: { 'Dinilai': 'Lihat Nilai', 'Dikumpulkan': 'Lihat / Ubah', 'Ditutup': 'Lihat Tugas' }[x.status] || 'Kerjakan Tugas', href: `tugas-saya.html?id=${x.item.id}` };
    }
    if (x.jenis === 'aktivitas') {
        return { label: x.status === 'Selesai' ? 'Lihat Ringkasan' : 'Mulai Aktivitas', href: `aktivitas.html?id=${x.item.id}` };
    }
    const href = `kerjakan.html?jenis=${x.jenis}&id=${x.item.id}`;
    const mulai = { pretest: 'Mulai Pretest', kuis: 'Mulai Kuis', to: 'Lihat & Mulai' }[x.jenis] || 'Mulai';
    return { label: { 'Selesai': 'Lihat Hasil', 'Sedang dikerjakan': 'Lanjutkan', 'Ditutup': 'Lihat Info' }[x.status] || mulai, href };
}

// Tombol aksi item; item terkunci → tombol nonaktif + alasan yang mudah dipahami
function tombolAksiItemHtml(x) {
    if (x.terkunci) {
        return `<span class="btn btn-secondary btn-small is-terkunci" aria-disabled="true" role="link" title="${escapeHtml(x.alasan)}">${escapeHtml(x.labelKunci || '🔒 Terkunci')}</span>`;
    }
    const aksi = aksiItemPeserta(x);
    return `<a href="${aksi.href}" class="btn btn-tonal btn-small">${escapeHtml(aksi.label)}</a>`;
}

function badgeItemPeserta(x) {
    return x.terkunci ? `<span class="badge badge-muted badge-dot badge-kunci">${escapeHtml(x.labelKunci || '🔒 Terkunci')}</span>` : badgeStatusPeserta(x.status);
}

// Keterangan singkat item (jumlah soal, durasi, format, tenggat)
function infoItemPeserta(x) {
    const it = x.item;
    if (x.jenis === 'modul') {
        return it.format === 'Upload PDF' ? 'Materi PDF' : 'Materi tertulis';
    }
    if (x.jenis === 'tugas') {
        return `Tenggat: ${it.deadline ? formatTanggalWaktu(it.deadline) : 'tanpa tenggat'} · ${LABEL_METODE_TUGAS_SINGKAT[it.metode] || 'Ketik / Upload'}${it.fileSoal ? ' · ada dokumentasi soal' : ''}`;
    }
    if (x.jenis === 'aktivitas' && TIPE_AKTIVITAS[it.tipe]) {
        const h = x.hasil;
        return `${TIPE_AKTIVITAS[it.tipe].ikon} ${TIPE_AKTIVITAS[it.tipe].judul} · ${jumlahButirAktivitas(it)} bagian${h ? ` · ${h.percobaan || 1}× percobaan` : ''}`;
    }
    const jumlah = x.jenis === 'kuis' ? getSoalKuis(it).length : it.soal.length;
    const durasi = Number(it.durasi) || 0;
    return `${jumlah} soal · ${durasi ? `${durasi} menit` : 'tanpa batas waktu'}`;
}

function itemKontenHtml(x) {
    const skor = x.skor !== null && x.skor !== undefined ? `<span class="konten-skor">${BOLEH_DIULANG[x.jenis] ? 'Terbaik' : 'Nilai'} ${x.skor}</span>` : '';
    return `
        <li class="konten-item${x.terkunci ? ' is-terkunci' : ''}">
            <div class="konten-info">
                <p class="cell-title">${escapeHtml(x.item.judul)}</p>
                <p class="cell-meta">${escapeHtml(infoItemPeserta(x))}</p>
                ${x.terkunci ? `<p class="alasan-kunci">${escapeHtml(x.alasan)}</p>` : ''}
            </div>
            <div class="konten-aksi">
                ${skor}${badgeItemPeserta(x)}
                ${tombolAksiItemHtml(x)}
            </div>
        </li>`;
}

// ---- Kelas Saya ----
function initKelasSayaPage() {
    const ctx = getKonteksPeserta();
    if (!siapkanHalamanPeserta(ctx)) {
        return;
    }
    const { kelas, pertemuan, peserta } = ctx;
    const data = bacaDataBelajar();
    const konten = Object.fromEntries(pertemuan.map(p => [p.id, getKontenPertemuanPeserta(peserta.id, p.id, data)]));
    const progres = hitungProgresKonten(Object.values(konten).flat());
    setText('ks-judul', kelas.nama);
    document.getElementById('ks-meta').innerHTML = `
        <span>Mata Pelajaran: <strong>${escapeHtml(kelas.mapel)}</strong></span>
        <span>Tingkat: <strong>${escapeHtml(kelas.tingkat)}</strong></span>
        <span>Pengajar: <strong>${escapeHtml(namaPengajarKelas(kelas))}</strong></span>
        <span>Peserta: <strong>${kelas.peserta}</strong></span>`;
    setText('ks-progress-text', `${progres.persen}% · ${progres.selesai} dari ${progres.total} materi & evaluasi sudah dikerjakan`);
    const bar = document.getElementById('ks-progress');
    bar.value = progres.persen;
    bar.textContent = `${progres.persen}%`;

    const item = p => {
        const pr = hitungProgresKonten(konten[p.id]);
        const lk = progresLangkah(konten[p.id]);
        return `
        <li class="meeting-item" id="pertemuan-${p.id}">
            <a class="meeting-left meeting-link" href="pertemuan-saya.html?id=${p.id}">
                <span class="meeting-number">${p.nomor}</span>
                <span>
                    <span class="meeting-title">Pertemuan ${p.nomor} · ${escapeHtml(p.judul)}</span>
                    <span class="meeting-info">Jadwal ${formatRentangJadwal(jadwalPertemuan(p, data.pertemuan))} · ${lk.total ? `${lk.selesai}/${lk.total} langkah selesai${lk.tuntas ? ' 🎉' : ''}` : 'belum ada materi'}</span>
                    <span class="chip-list" aria-label="Isi pertemuan">${konten[p.id].filter(g => g.items.length).map(g => `<span class="chip${g.items.every(i => i.tuntas) ? ' chip-ready' : ''}">${g.items.every(i => i.tuntas) ? '✓ ' : ''}${escapeHtml(g.label)}</span>`).join('')}</span>
                </span>
            </a>
            <div class="actions">
                ${badgeStatusPeserta(lk.tuntas ? 'Selesai' : statusPertemuanPeserta(pr))}
                ${badgeStatusPertemuanHtml(p, data.pertemuan)}
                <a class="btn btn-secondary btn-small" href="pertemuan-saya.html?id=${p.id}">Buka</a>
            </div>
        </li>`;
    };
    const to = jenis => {
        const t = getTOKelas(kelas.id, jenis);
        const tampil = t && t.status !== 'Draft';
        return `
            <li class="meeting-item meeting-item-exam">
                <a class="meeting-left meeting-link" href="to-${jenis.toLowerCase()}-saya.html">
                    <span class="meeting-number">TO</span>
                    <span>
                        <span class="meeting-title">TO ${jenis}</span>
                        <span class="meeting-info">Simulasi ${escapeHtml(JENIS_TO[jenis].nama)} · ${tampil ? `${formatTanggal(t.tanggal)}, ${escapeHtml(t.waktu)} WIB` : 'belum dijadwalkan'}</span>
                    </span>
                </a>
                ${tampil ? badgeTO(t.status) : '<span class="badge badge-muted badge-dot">Belum dijadwalkan</span>'}
            </li>`;
    };
    document.getElementById('ks-pertemuan').innerHTML = pertemuan.length
        ? pertemuan.filter(p => p.nomor <= 6).map(item).join('') + to('PTS') +
          pertemuan.filter(p => p.nomor > 6).map(item).join('') + to('PAS')
        : '<li class="table-empty">Kelas ini belum memiliki pertemuan.</li>';

    // #pertemuan-ID (dari tombol "Tampilkan Pembelajaran") → sorot & gulir ke pertemuan tersebut
    const sorot = () => {
        document.querySelectorAll('#ks-pertemuan .is-selected').forEach(el => el.classList.remove('is-selected'));
        const target = window.location.hash ? document.getElementById(window.location.hash.slice(1)) : null;
        if (target) {
            target.classList.add('is-selected');
            target.scrollIntoView({ block: 'center' });
        }
    };
    sorot();
    window.addEventListener('hashchange', sorot);
}

// Tabel sederhana halaman peserta
function isiTabelPeserta(tbodyId, rows, kolom, kosong) {
    document.getElementById(tbodyId).innerHTML = rows.length
        ? rows.join('')
        : `<tr><td colspan="${kolom}" class="table-empty">${escapeHtml(kosong)}</td></tr>`;
}

// Baris tabel item peserta (dipakai halaman Modul, Aktivitas, Latihan, Kuis, Tugas)
function barisItemPeserta(x, nomor, pertemuan, kolomInfo = true) {
    return `
        <tr${x.terkunci ? ' class="is-terkunci"' : ''}>
            <td class="col-no">${nomor}</td>
            <td><p class="cell-title">${escapeHtml(x.item.judul)}</p>${kolomInfo ? `<p class="cell-meta">${escapeHtml(infoItemPeserta(x))}</p>` : ''}${x.terkunci ? `<p class="alasan-kunci">${escapeHtml(x.alasan)}</p>` : ''}</td>
            <td>${pertemuan ? `<a class="text-primary" href="pertemuan-saya.html?id=${pertemuan.id}">Pertemuan ${pertemuan.nomor}</a><p class="cell-meta">${escapeHtml(pertemuan.judul)}</p>` : '<span class="cell-muted">Tanpa pertemuan</span>'}</td>
            <td>${badgeItemPeserta(x)}</td>
            <td class="num">${x.skor !== null && x.skor !== undefined ? x.skor : '–'}</td>
            <td>${tombolAksiItemHtml(x)}</td>
        </tr>`;
}

// Semua item satu jenis di kelas peserta, diurutkan menurut nomor pertemuan
function itemPesertaPerJenis(ctx, jenis, data = bacaDataBelajar()) {
    const urut = x => (ctx.pertemuanMap[x.item.pertemuanId] || { nomor: 99 }).nomor;
    return ctx.pertemuan
        .flatMap(p => getKontenPertemuanPeserta(ctx.peserta.id, p.id, data).find(g => g.key === jenis).items)
        .sort((a, b) => urut(a) - urut(b) || a.item.id - b.item.id);
}

// ---- Modul (peserta) ----
function initModulSayaPage() {
    const ctx = getKonteksPeserta();
    if (!siapkanHalamanPeserta(ctx)) {
        return;
    }
    const items = itemPesertaPerJenis(ctx, 'modul');
    const selesai = items.filter(x => x.tuntas).length;
    setText('peserta-subjudul', `${ctx.kelas.nama} · ${selesai} dari ${items.length} modul sudah dipelajari`);
    isiTabelPeserta('ms-body', items.map((x, i) => barisItemPeserta(x, i + 1, ctx.pertemuanMap[x.item.pertemuanId])),
        6, 'Belum ada modul yang diterbitkan di kelas Anda.');
}

// ---- Aktivitas Interaktif & Latihan Soal (dari koleksi evaluasi) ----
function initKomponenSayaPage(jenis) {
    const ctx = getKonteksPeserta();
    if (!siapkanHalamanPeserta(ctx)) {
        return;
    }
    const items = itemPesertaPerJenis(ctx, jenis);
    const selesai = items.filter(x => x.tuntas).length;
    setText('peserta-subjudul', `${ctx.kelas.nama} · ${selesai} dari ${items.length} ${JENIS_EVALUASI[jenis].label.toLowerCase()} sudah dikerjakan`);
    isiTabelPeserta('komponen-body', items.map((x, i) => barisItemPeserta(x, i + 1, ctx.pertemuanMap[x.item.pertemuanId])),
        6, `Belum ada ${JENIS_EVALUASI[jenis].label.toLowerCase()} yang diterbitkan pengajar di kelas Anda.`);
}

// ---- Halaman Pertemuan (peserta): Pretest → Modul → Aktivitas → Latihan → Kuis → Tugas ----
function initPertemuanSayaPage() {
    const ctx = getKonteksPeserta();
    if (!siapkanHalamanPeserta(ctx)) {
        return;
    }
    const id = Number(new URLSearchParams(window.location.search).get('id'));
    const p = ctx.pertemuanMap[id];
    const tidakAda = document.getElementById('ps-pertemuan-tidak-ada');
    if (!p) {
        tidakAda.hidden = false;
        document.getElementById('ps-pertemuan-isi').hidden = true;
        return;
    }
    document.title = `Pertemuan ${p.nomor} · ${p.judul} — DelLearn`;
    const grup = getKontenPertemuanPeserta(ctx.peserta.id, p.id);
    const pr = hitungProgresKonten(grup);
    const lk = progresLangkah(grup);
    setText('pt-judul', `Pertemuan ${p.nomor} · ${p.judul}`);
    document.getElementById('pt-meta').innerHTML = `
        <span>Kelas: <strong>${escapeHtml(ctx.kelas.nama)}</strong></span>
        <span>Tanggal: <strong>${formatTanggal(p.tanggal)}</strong></span>
        <span>Pengajar: <strong>${escapeHtml(namaPengajarKelas(ctx.kelas))}</strong></span>
        ${badgeStatusPeserta(lk.tuntas ? 'Selesai' : statusPertemuanPeserta(pr))}`;
    // Jadwal akses pertemuan: tanggal mulai–selesai, status (otomatis/dibuka pengajar) + alasan bila tertutup
    const akses = aksesPertemuan(p.id);
    const jadwalEl = document.getElementById('pt-jadwal');
    jadwalEl.hidden = false;
    jadwalEl.className = `info-box info-jadwal is-${{ 'Berjalan': 'berjalan', 'Selesai': 'selesai', 'Belum Dimulai': 'belum' }[akses.status]}`;
    jadwalEl.innerHTML = `<strong>📅 Jadwal: ${formatRentangJadwal(akses.jadwal)}</strong> · Status: ${badgeStatusPertemuanHtml(p)}${akses.override ? ' <span class="cell-meta">(diatur pengajar)</span>' : ''}
        <span class="jadwal-alasan">${escapeHtml(akses.boleh ? 'Pertemuan sedang berjalan — kerjakan langkah belajar sesuai urutan.' : akses.alasan)}</span>`;
    // Progres = 5 langkah belajar (komponen selesai bila semua isinya sudah dikerjakan)
    const persen = lk.total ? Math.round((lk.selesai / lk.total) * 100) : 0;
    setText('pt-progress-text', lk.total ? `Progress: ${lk.selesai}/${lk.total} langkah (${persen}%)` : 'Pertemuan ini belum memiliki materi atau evaluasi.');
    const bar = document.getElementById('pt-progress');
    bar.value = persen;
    bar.textContent = `${persen}%`;
    // Alur wajib berurutan: ✓ Selesai · ▶ Sedang Dikerjakan · 🔒 Terkunci (dengan alasan) · ○ Belum Dimulai
    const kodeLangkah = Object.fromEntries(lk.langkah.map(l => [l.key, l]));
    const penilaian = { key: 'penilaian', label: 'Penilaian / Hasil', emoji: '📊', ada: lk.total > 0, selesai: lk.tuntas,
        kode: !lk.total ? 'kosong' : lk.tuntas ? 'selesai' : 'terkunci', alasan: lk.tuntas ? '' : '🔒 Selesaikan seluruh langkah pembelajaran terlebih dahulu.' };
    document.getElementById('pt-langkah').innerHTML = [...lk.langkah, penilaian].map((l, i) => {
        const st = STATUS_LANGKAH[l.kode];
        const href = l.key === 'penilaian' ? (lk.tuntas ? 'nilai-saya.html' : '#grup-kuis') : `#grup-${l.key}`;
        return `
        <li class="langkah langkah-st-${l.kode}${l.kode === 'selesai' ? ' is-selesai' : ''}${l.kode === 'kosong' ? ' is-kosong' : ''}${lk.berikut && lk.berikut.key === l.key ? ' is-berikut' : ''}" data-langkah="${l.key}" data-status="${l.kode}">
            <a href="${href}"><span class="langkah-tanda" aria-hidden="true">${st.tanda}</span><span class="langkah-nama">${i + 1}. ${escapeHtml(l.label)}</span>
            <span class="langkah-status">${escapeHtml(st.label)}</span>
            ${l.kode === 'terkunci' ? `<span class="langkah-alasan">${escapeHtml(l.alasan)}</span>` : ''}</a></li>`;
    }).join('');
    const aksesPt = aksesPertemuan(p.id);
    setText('pt-langkah-info', lk.tuntas ? 'Pertemuan selesai 🎉 Hebat! Hasilmu sudah masuk ke Penilaian — lanjutkan ke pertemuan berikutnya.'
        : !aksesPt.boleh ? (aksesPt.status === 'Belum Dimulai' ? 'Langkah belajar dapat dikerjakan setelah pertemuan dimulai.' : 'Pertemuan sudah ditutup — langkah yang belum selesai tidak dapat dikerjakan lagi.')
            : lk.berikut ? `Langkah berikutnya: ${lk.berikut.emoji} ${lk.berikut.label}` : '');
    document.getElementById('pt-langkah-info').classList.toggle('is-tuntas', lk.tuntas);

    document.getElementById('pt-konten').innerHTML = grup.map((g, i) => {
        const l = kodeLangkah[g.key];
        const kunci = l && l.terkunci;
        return `
        <section class="card konten-grup konten-${g.key}${kunci ? ' is-terkunci' : ''}" aria-labelledby="grup-${g.key}" id="grup-${g.key}-kartu">
            <header class="card-header">
                <div class="card-heading">
                    <span class="stat-icon grup-emoji" aria-hidden="true">${kunci ? '🔒' : g.emoji}</span>
                    <div>
                        <h2 class="card-title" id="grup-${g.key}" tabindex="-1">${i + 1}. ${escapeHtml(g.label)}</h2>
                        <p class="card-subtitle grup-tagline">${escapeHtml(g.tagline)}</p>
                        <p class="card-subtitle">${g.items.length ? `${g.items.filter(x => x.tuntas).length} dari ${g.items.length} selesai${l ? ` · ${STATUS_LANGKAH[l.kode].tanda} ${l.status}` : ''}` : 'Belum ada'}</p>
                    </div>
                </div>
            </header>
            <div class="card-body">
                ${kunci ? `<p class="info-box info-kunci" role="note">${escapeHtml(l.alasan)}</p>` : ''}
                ${g.items.length ? `<ul class="konten-list">${g.items.map(itemKontenHtml).join('')}</ul>` : `<p class="cell-muted">${escapeHtml(g.kosong)}</p>`}
            </div>
        </section>`;
    }).join('');

    // Pertemuan sebelumnya / berikutnya
    const indeks = ctx.pertemuan.findIndex(x => x.id === p.id);
    const sebelum = ctx.pertemuan[indeks - 1];
    const sesudah = ctx.pertemuan[indeks + 1];
    const nav = document.getElementById('pt-nav');
    nav.innerHTML = `
        ${sebelum ? `<a class="btn btn-secondary" href="pertemuan-saya.html?id=${sebelum.id}">${iconHtml('chevron-left', '')}Pertemuan ${sebelum.nomor}</a>` : '<span></span>'}
        ${sesudah ? `<a class="btn btn-secondary" href="pertemuan-saya.html?id=${sesudah.id}">Pertemuan ${sesudah.nomor}${iconHtml('chevron-right', '')}</a>` : ''}`;
}

// ---- Baca Modul (peserta) ----
// PDF contoh untuk modul PDF data awal (file sungguhan di assets/pdf/)
const PDF_CONTOH = ['modul-pola-bilangan.pdf', 'modul-greetings-and-vocabulary.pdf', 'modul-sistem-pernapasan.pdf',
    'modul-globalisasi.pdf', 'modul-teks-pidato-persuasif.pdf'];

// ---- PDF modul: penyimpanan & penampil ----
// Akar bug "PDF blank/hitam": PDF dibuka sebagai alamat data: di tab baru; Chrome/Edge memblokir/tidak merender
// navigasi seperti itu. Kini: data URL selalu bertipe application/pdf, isi dicek (%PDF-), lalu dirender di halaman
// dengan PDF.js (canvas). Bila PDF.js tidak termuat (offline), dipakai penampil bawaan browser lewat Blob URL.
const PDFJS_WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// "data:application/octet-stream;base64,JVBE…" / "data:;base64,…" → "data:application/pdf;base64,JVBE…"
function normalisasiDataUrlPdf(dataUrl) {
    const teks = String(dataUrl || '');
    const koma = teks.indexOf(',');
    if (!teks.startsWith('data:') || koma === -1 || !/;base64$/i.test(teks.slice(0, koma))) {
        return teks;
    }
    return `data:application/pdf;base64,${teks.slice(koma + 1)}`;
}

// Isi biner dari data URL base64 (Uint8Array) atau null bila format tidak dikenal
function bytesDariDataUrl(dataUrl) {
    const teks = String(dataUrl || '');
    const koma = teks.indexOf(',');
    if (!teks.startsWith('data:') || koma === -1 || !/;base64$/i.test(teks.slice(0, koma))) {
        return null;
    }
    try {
        const biner = atob(teks.slice(koma + 1));
        const bytes = new Uint8Array(biner.length);
        for (let i = 0; i < biner.length; i++) {
            bytes[i] = biner.charCodeAt(i);
        }
        return bytes;
    } catch (error) {
        return null;
    }
}

// File PDF utuh? (diawali "%PDF-")
function bytesPdfValid(bytes) {
    return Boolean(bytes) && bytes.length > 8 && String.fromCharCode(...bytes.slice(0, 5)) === '%PDF-';
}

let blobUrlPdfTerakhir = null;
// Blob URL application/pdf (untuk "Buka di tab baru" / "Unduh"); URL lama dibebaskan
function blobUrlPdf(bytes) {
    if (blobUrlPdfTerakhir) {
        URL.revokeObjectURL(blobUrlPdfTerakhir);
    }
    blobUrlPdfTerakhir = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
    return blobUrlPdfTerakhir;
}

// Tampilkan PDF di dalam wadah. sumber = { data } (data URL), { bytes } (isi file dari penyimpanan file browser)
// atau { url } (PDF contoh di assets/pdf)
async function tampilkanPdf(wadah, sumber, nama) {
    const pesan = (teks, kelas = 'cell-muted') => `<p class="${kelas} pdf-pesan">${escapeHtml(teks)}</p>`;
    if (sumber.url) {
        // PDF contoh berupa file sungguhan → penampil bawaan browser
        wadah.innerHTML = `
            <div class="pdf-toolbar"><span class="cell-meta">${escapeHtml(nama)}</span>
                <a class="btn btn-secondary btn-small" href="${escapeHtml(sumber.url)}" target="_blank" rel="noopener" id="bm-buka-pdf">${iconHtml('eye', '')}Buka di Tab Baru</a></div>
            <iframe class="pdf-frame" src="${escapeHtml(sumber.url)}" title="PDF ${escapeHtml(nama)}"></iframe>`;
        return 'bawaan';
    }
    const bytes = sumber.bytes || bytesDariDataUrl(sumber.data);
    if (!bytesPdfValid(bytes)) {
        wadah.innerHTML = pesan('File PDF ini rusak atau bukan PDF yang valid. Minta pengajar mengunggah ulang file PDF-nya.', 'alert alert-error');
        return 'rusak';
    }
    const url = blobUrlPdf(bytes);
    wadah.innerHTML = `
        <div class="pdf-toolbar">
            <span class="cell-meta" id="pdf-info">${escapeHtml(nama)} · memuat…</span>
            <span class="actions actions-wrap">
                <a class="btn btn-secondary btn-small" href="${url}" target="_blank" rel="noopener" id="bm-buka-pdf">${iconHtml('eye', '')}Buka di Tab Baru</a>
                <a class="btn btn-secondary btn-small" href="${url}" download="${escapeHtml(nama)}" id="bm-unduh-pdf">${iconHtml('download', '')}Unduh</a>
            </span>
        </div>
        <div class="pdf-halaman" id="pdf-halaman"></div>`;
    const info = wadah.querySelector('#pdf-info');
    const area = wadah.querySelector('#pdf-halaman');
    const lib = window.pdfjsLib;
    if (!lib) {
        // Tanpa internet: penampil bawaan browser dari Blob URL (bukan data: URL)
        area.innerHTML = `<iframe class="pdf-frame" src="${url}" title="PDF ${escapeHtml(nama)}"></iframe>`;
        info.textContent = `${nama} · ditampilkan dengan penampil bawaan browser`;
        return 'bawaan';
    }
    try {
        lib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
        const doc = await lib.getDocument({ data: bytes.slice() }).promise;
        const maks = Math.min(doc.numPages, 50);
        info.textContent = `${nama} · ${doc.numPages} halaman`;
        const lebar = Math.max(280, area.clientWidth || 600);
        for (let n = 1; n <= maks; n++) {
            const page = await doc.getPage(n);
            const dasar = page.getViewport({ scale: 1 });
            const skala = lebar / dasar.width;
            const rasio = window.devicePixelRatio || 1;
            const view = page.getViewport({ scale: skala * rasio });
            const canvas = document.createElement('canvas');
            canvas.className = 'pdf-canvas';
            canvas.width = Math.floor(view.width);
            canvas.height = Math.floor(view.height);
            canvas.setAttribute('aria-label', `Halaman ${n} dari ${doc.numPages}`);
            canvas.setAttribute('role', 'img');
            area.appendChild(canvas);
            await page.render({ canvasContext: canvas.getContext('2d'), viewport: view }).promise;
        }
        if (doc.numPages > maks) {
            area.insertAdjacentHTML('beforeend', pesan(`Menampilkan ${maks} dari ${doc.numPages} halaman. Unduh PDF untuk membaca semuanya.`));
        }
        return 'pdfjs';
    } catch (error) {
        area.innerHTML = `<iframe class="pdf-frame" src="${url}" title="PDF ${escapeHtml(nama)}"></iframe>`;
        info.textContent = `${nama} · ditampilkan dengan penampil bawaan browser`;
        return 'bawaan';
    }
}

// Alamat file PDF modul: file unggahan (disimpan di browser) atau PDF contoh; null bila hanya nama file yang tercatat
function urlPdfModul(m) {
    if (!m.file) {
        return null;
    }
    if (m.file.data) {
        return m.file.data;
    }
    return PDF_CONTOH.includes(m.file.nama) ? urlHalaman(`assets/pdf/${m.file.nama}`) : null;
}

// Teks materi → HTML aman: paragraf; baris berawalan "## " menjadi subjudul
function materiHtml(teks) {
    return String(teks || '').split(/\n{2,}/).map(par => {
        const baris = par.split('\n');
        const sub = [];
        while (baris.length && /^##\s+/.test(baris[0])) {
            sub.push(`<h3 class="materi-subjudul">${escapeHtml(baris.shift().replace(/^##\s+/, ''))}</h3>`);
        }
        return sub.join('') + (baris.length ? `<p>${baris.map(escapeHtml).join('<br>')}</p>` : '');
    }).join('');
}

function renderBacaModul(ctx, m) {
    const p = ctx.pertemuanMap[m.pertemuanId];
    const progres = getProgresModul(ctx.peserta.id, m.id);
    const selesai = progres && progres.status === 'Selesai';
    setText('bm-judul', m.judul);
    document.getElementById('bm-meta').innerHTML = `
        <span>${p ? `<a class="text-primary" href="pertemuan-saya.html?id=${p.id}">Pertemuan ${p.nomor} · ${escapeHtml(p.judul)}</a>` : 'Tanpa pertemuan'}</span>
        <span>Format: <strong>${escapeHtml(m.format)}</strong></span>
        ${badgeStatusPeserta(progres ? progres.status : 'Belum dipelajari')}`;
    setText('bm-deskripsi', m.deskripsi || '');
    const isi = [];
    if (m.gambar && m.gambar.data) {
        isi.push(`<figure class="materi-gambar"><img src="${m.gambar.data}" alt="${escapeHtml(m.gambar.keterangan || `Gambar materi ${m.judul}`)}">${m.gambar.keterangan ? `<figcaption>${escapeHtml(m.gambar.keterangan)}</figcaption>` : ''}</figure>`);
    }
    let pdf = null;
    if (m.format === 'Upload PDF') {
        const url = urlPdfModul(m);
        pdf = url ? (m.file.data ? { data: url } : { url }) : null;
        isi.push(pdf
            ? '<div class="pdf-viewer" id="bm-pdf-viewer"></div>'
            : `<div class="pdf-card">
                <span class="stat-icon">${iconHtml('file', '')}</span>
                <div>
                    <p class="cell-title">${escapeHtml(m.file ? m.file.nama : 'File PDF')}</p>
                    <p class="cell-meta">${m.file ? formatUkuran(m.file.ukuran) : ''}</p>
                </div>
                <p class="cell-muted">File PDF ini hanya tercatat namanya. Minta pengajar mengunggah ulang file PDF-nya.</p>
            </div>`);
    }
    if (m.isi) {
        isi.push(`<div class="materi-teks">${materiHtml(m.isi)}</div>`);
    }
    if (m.contoh) {
        isi.push(`<section class="materi-kotak materi-contoh" aria-label="Contoh"><h3 class="materi-subjudul">💡 Contoh</h3>${materiHtml(m.contoh)}</section>`);
    }
    if (m.rangkuman) {
        isi.push(`<section class="materi-kotak materi-rangkuman" aria-label="Rangkuman"><h3 class="materi-subjudul">📌 Rangkuman</h3>${materiHtml(m.rangkuman)}</section>`);
    }
    // Isi materi hanya dirender sekali per modul (menandai "sudah dipelajari" tidak memuat ulang PDF)
    const wadahIsi = document.getElementById('bm-isi');
    if (wadahIsi.dataset.modul !== String(m.id)) {
        wadahIsi.dataset.modul = String(m.id);
        wadahIsi.innerHTML = isi.join('') || '<p class="cell-muted">Modul ini belum memiliki isi.</p>';
        if (pdf) {
            tampilkanPdf(document.getElementById('bm-pdf-viewer'), pdf, m.file.nama).then(cara => {
                wadahIsi.dataset.pdf = cara;
            });
        }
    }

    const tombol = document.getElementById('btn-tandai-modul');
    // Pertemuan selesai (read-only): modul tetap dapat dibaca, tetapi tidak dapat ditandai selesai lagi
    const tutup = cekAksesAksiPeserta(m.pertemuanId);
    tombol.disabled = selesai || Boolean(tutup);
    tombol.innerHTML = selesai ? `${iconHtml('check-circle', '')}Modul Selesai` : `${iconHtml('check-circle', '')}Tandai Modul Selesai`;
    setText('bm-status-info', selesai ? `Ditandai selesai ${formatTanggalWaktu(progres.selesai)}.`
        : tutup ? `${tutup} Modul tetap dapat dibaca.`
            : 'Membuka modul belum dihitung selesai. Setelah selesai membaca, tekan "Tandai Modul Selesai" agar Aktivitas Interaktif terbuka.');

    // Modul lain pada pertemuan yang sama
    const lain = getModulPeserta(ctx).filter(x => x.pertemuanId === m.pertemuanId && x.id !== m.id);
    document.getElementById('bm-lain').innerHTML = lain.length
        ? lain.map(x => `<li><a class="text-primary" href="baca-modul.html?id=${x.id}">${escapeHtml(x.judul)}</a></li>`).join('')
        : '<li class="cell-muted">Tidak ada modul lain pada pertemuan ini.</li>';
    const kembali = document.getElementById('bm-kembali');
    kembali.href = p ? `pertemuan-saya.html?id=${p.id}` : 'modul-saya.html';
}

function initBacaModulPage() {
    const ctx = getKonteksPeserta();
    if (!siapkanHalamanPeserta(ctx)) {
        return;
    }
    const id = Number(new URLSearchParams(window.location.search).get('id'));
    const m = getModulPeserta(ctx).find(x => x.id === id);
    if (!m) {
        document.getElementById('bm-tidak-ada').hidden = false;
        document.getElementById('bm-isi-modul').hidden = true;
        return;
    }
    // Alur berurutan: Modul hanya terbuka setelah Pretest pertemuannya selesai (juga bila URL dibuka langsung)
    if (tolakBilaTerkunci('modul', m.id)) {
        return;
    }
    document.title = `${m.judul} — Modul — DelLearn`;
    setProgresModul(ctx.peserta.id, m.id, 'Sedang dipelajari');
    renderBacaModul(ctx, m);
    document.getElementById('btn-tandai-modul').addEventListener('click', () => {
        // Status akses dicek ulang saat tombol ditekan (halaman bisa terbuka lama)
        const tutup = cekAksesAksiPeserta(m.pertemuanId);
        if (tutup) {
            renderBacaModul(ctx, m);
            tampilkanPesan('error', `Modul tidak dapat ditandai selesai. ${tutup}`);
            return;
        }
        setProgresModul(ctx.peserta.id, m.id, 'Selesai');
        renderBacaModul(ctx, m);
        // Semua modul wajib pertemuan ini selesai → Aktivitas Interaktif terbuka
        const grup = m.pertemuanId ? getKontenPertemuanPeserta(ctx.peserta.id, m.pertemuanId) : [];
        const modulSelesai = (grup.find(g => g.key === 'modul') || { items: [] }).items.every(x => x.tuntas);
        const adaAktivitas = (grup.find(g => g.key === 'aktivitas') || { items: [] }).items.length > 0;
        tampilkanPesan('success', `Modul "${m.judul}" ditandai selesai.${modulSelesai && adaAktivitas ? ' 🔓 Aktivitas Interaktif kini terbuka.' : modulSelesai ? '' : ' Selesaikan modul lain pada pertemuan ini untuk membuka Aktivitas Interaktif.'}`);
    });
}

// ---- Tugas (peserta): baca soal (teks / dokumentasi), pilih metode, ketik jawaban atau upload file ----
// Tugas berada di luar alur terkunci (Pretest → Modul → Aktivitas → Latihan → Kuis): selalu dapat dibuka.
// file: undefined = belum memilih, objek = file jawaban yang sudah tersimpan di penyimpanan file browser
const tugasSayaView = { dipilih: null, metode: null, file: undefined, fileDitolak: '', proses: false };

function renderTugasSaya(ctx) {
    const items = itemPesertaPerJenis(ctx, 'tugas');
    const terkumpul = items.filter(x => x.tuntas).length;
    setText('peserta-subjudul', `${ctx.kelas.nama} · ${terkumpul} dari ${items.length} tugas sudah dikumpulkan`);
    isiTabelPeserta('tugas-saya-body', items.map((x, i) => `
        <tr${x.item.id === tugasSayaView.dipilih ? ' class="is-selected"' : ''}>
            <td class="col-no">${i + 1}</td>
            <td><p class="cell-title">${escapeHtml(x.item.judul)}</p><p class="cell-meta">${escapeHtml(infoItemPeserta(x))}</p></td>
            <td>${(p => (p ? `Pertemuan ${p.nomor}` : '–'))(ctx.pertemuanMap[x.item.pertemuanId])}</td>
            <td>${x.terkunci ? badgeItemPeserta(x) : badgeStatusPeserta(x.status)}</td>
            <td class="num">${x.skor !== null ? x.skor : '–'}</td>
            <td><button type="button" class="btn btn-tonal btn-small" data-id="${x.item.id}">${escapeHtml(aksiItemPeserta(x).label)}</button></td>
        </tr>`), 6, 'Belum ada tugas yang diberikan di kelas Anda.');

    const kartu = document.getElementById('tugas-detail-card');
    const x = items.find(i => i.item.id === tugasSayaView.dipilih);
    kartu.hidden = !x;
    if (!x) {
        return;
    }
    const t = x.item;
    const h = x.hasil;
    const p = ctx.pertemuanMap[t.pertemuanId];
    setText('tugas-detail-judul', t.judul);
    document.getElementById('tugas-detail-info').innerHTML = [
        ['Pertemuan', p ? `<a class="text-primary" href="pertemuan-saya.html?id=${p.id}">Pertemuan ${p.nomor} · ${escapeHtml(p.judul)}</a>` : '–'],
        ['Petunjuk', `<span class="pre-wrap">${escapeHtml(t.deskripsi)}</span>`],
        ['Deadline', t.deadline ? formatDeadline(t.deadline) : 'Tanpa deadline'],
        ['Metode Pengumpulan', escapeHtml(t.metode === 'keduanya' ? 'Ketik Jawaban / Upload File (pilih salah satu)' : METODE_TUGAS[t.metode] || METODE_TUGAS.keduanya)],
        ['Status', badgeStatusPeserta(x.status)],
    ].map(([l, v]) => `<div><dt>${escapeHtml(l)}</dt><dd>${v}</dd></div>`).join('');

    // Soal: teks dan/atau dokumentasi (gambar/PDF). Pertemuan belum dimulai → soal belum ditampilkan.
    const belumMulai = (aksesPertemuan(t.pertemuanId) || {}).status === 'Belum Dimulai';
    const soalTeks = document.getElementById('tugas-soal-teks');
    soalTeks.hidden = !t.soal || belumMulai;
    soalTeks.textContent = belumMulai ? '' : t.soal || '';
    const soalFile = document.getElementById('tugas-soal-file');
    soalFile.hidden = !t.fileSoal || belumMulai;
    const kunciSoal = t.fileSoal ? `${t.id}|${t.fileSoal.nama}|${t.fileSoal.fileId || (t.fileSoal.data || '').length}` : '';
    if (t.fileSoal && !belumMulai && soalFile.dataset.kunci !== kunciSoal) {
        soalFile.dataset.kunci = kunciSoal;
        tampilkanFileTugas(soalFile, t.fileSoal, { judul: `Dokumentasi soal ${t.judul}` });
    }

    // Status pengumpulan, jawaban terkirim, nilai & feedback
    const status = document.getElementById('tugas-status-kumpul');
    status.hidden = !h;
    if (h) {
        const dinilai = h.status === 'Dinilai';
        status.innerHTML = `
            <p class="tugas-status-judul">✓ Sudah Dikumpulkan${dinilai ? ' · Sudah Dinilai' : ''}</p>
            <dl class="detail-list detail-list-2">
                <div><dt>Tanggal pengumpulan</dt><dd>${escapeHtml(formatTanggalWaktu(h.dikumpulkan))}${h.terlambat ? ' <span class="status-inline-warning">(melewati deadline)</span>' : ''}</dd></div>
                <div><dt>Metode</dt><dd>${escapeHtml(LABEL_METODE_JAWABAN[h.metode] || (h.teks ? LABEL_METODE_JAWABAN.ketik : LABEL_METODE_JAWABAN.upload))}</dd></div>
                ${h.teks ? `<div class="full"><dt>Jawaban Anda</dt><dd class="pre-wrap">${escapeHtml(h.teks)}</dd></div>` : ''}
                ${h.lampiran ? `<div class="full"><dt>File Jawaban</dt><dd>${tautanLampiran(h.lampiran)}</dd></div>` : ''}
                ${dinilai ? `<div><dt>Nilai</dt><dd class="tugas-nilai">${h.nilai}</dd></div>
                <div class="full"><dt>Feedback Pengajar</dt><dd>${h.catatan ? `"${escapeHtml(h.catatan)}"` : '–'}</dd></div>` : ''}
            </dl>`;
    }

    const form = document.getElementById('form-tugas-saya');
    // Tugas di luar alur berurutan, tetapi pengirimannya mengikuti status jadwal pertemuan
    const tutup = cekAksesAksiPeserta(t.pertemuanId);
    const bolehKirim = t.status === 'Aktif' && (!h || h.status !== 'Dinilai') && !tutup;
    form.hidden = !bolehKirim;
    setText('tugas-tidak-bisa', !bolehKirim
        ? (h && h.status === 'Dinilai' ? 'Tugas sudah dinilai pengajar. Jawaban tidak dapat diubah lagi.'
            : t.status !== 'Aktif' ? 'Pengumpulan tugas ini sudah ditutup oleh pengajar.' : tutup)
        : '');
    document.getElementById('tugas-tidak-bisa').hidden = bolehKirim;
    if (bolehKirim) {
        renderFormTugasSaya(t, h);
    }
}

// Bagian form: pilihan metode (bila Keduanya), area ketik atau area upload
function renderFormTugasSaya(t, h) {
    const form = document.getElementById('form-tugas-saya');
    const izin = metodeJawabanTugas(t);
    if (!izin.includes(tugasSayaView.metode)) {
        tugasSayaView.metode = h && izin.includes(h.metode) ? h.metode : izin[0];
    }
    const metode = tugasSayaView.metode;
    document.getElementById('tugas-pilih-metode').hidden = izin.length < 2;
    form.querySelectorAll('input[name="metode"]').forEach(r => {
        r.checked = r.value === metode;
    });
    setText('tugas-metode-info', izin.length < 2 ? `Tugas ini dikumpulkan dengan cara: ${LABEL_METODE_JAWABAN[metode]}.` : 'Pilih salah satu cara mengumpulkan jawaban.');
    document.getElementById('tugas-grup-ketik').hidden = metode !== 'ketik';
    document.getElementById('tugas-grup-upload').hidden = metode !== 'upload';
    const file = tugasSayaView.file !== undefined ? tugasSayaView.file : (h && h.metode === 'upload' ? h.lampiran : null);
    setText('tugas-file-info', tugasSayaView.proses ? 'Menyimpan file…'
        : file ? `${tugasSayaView.file !== undefined ? 'File dipilih' : 'File tersimpan'}: ${file.nama} (${formatUkuran(file.ukuran)})` : 'Belum ada file dipilih.');
    const preview = document.getElementById('tugas-file-preview');
    preview.hidden = !file;
    const kunci = file ? `${file.nama}|${file.fileId || (file.data || '').length}` : '';
    if (file && preview.dataset.kunci !== kunci) {
        preview.dataset.kunci = kunci;
        tampilkanFileTugas(preview, file, { judul: 'Preview file jawaban' });
    } else if (!file) {
        preview.dataset.kunci = '';
        preview.innerHTML = '';
    }
    setText('btn-kirim-tugas-teks', h ? 'Perbarui Jawaban' : 'Kumpulkan Jawaban');
}

function initTugasSayaPage() {
    const ctx = getKonteksPeserta();
    if (!siapkanHalamanPeserta(ctx)) {
        return;
    }
    const idParam = Number(new URLSearchParams(window.location.search).get('id'));
    if (getAllTugas().some(t => t.id === idParam && t.kelasId === ctx.kelas.id && t.status !== 'Draft')) {
        tugasSayaView.dipilih = idParam;
    }
    const form = document.getElementById('form-tugas-saya');
    // Isi awal form untuk tugas terpilih (jawaban ketik yang sudah terkirim)
    const isiAwal = () => {
        const h = tugasSayaView.dipilih ? getHasil(ctx.peserta.id, 'tugas', tugasSayaView.dipilih) : null;
        form.elements.teks.value = h && h.teks ? h.teks : '';
        ['teks', 'file'].forEach(fl => showFieldError(form, fl, ''));
    };
    const buangFileBelumTerkirim = () => {
        const h = tugasSayaView.dipilih ? getHasil(ctx.peserta.id, 'tugas', tugasSayaView.dipilih) : null;
        if (tugasSayaView.file && !(h && samaFile(h.lampiran, tugasSayaView.file))) {
            hapusFileBrowser(tugasSayaView.file);
        }
    };
    isiAwal();
    renderTugasSaya(ctx);
    document.getElementById('tugas-saya-body').addEventListener('click', event => {
        const tombol = event.target.closest('button[data-id]');
        if (tombol) {
            buangFileBelumTerkirim();
            Object.assign(tugasSayaView, { dipilih: Number(tombol.dataset.id), metode: null, file: undefined, fileDitolak: '' });
            sembunyikanPesan();
            isiAwal();
            renderTugasSaya(ctx);
            document.getElementById('tugas-detail-card').scrollIntoView({ block: 'start' });
        }
    });
    form.addEventListener('change', event => {
        if (event.target.name === 'metode') {
            tugasSayaView.metode = event.target.value;
            renderTugasSaya(ctx);
        }
    });
    form.elements.file.addEventListener('change', async () => {
        const file = form.elements.file.files[0];
        if (!file) {
            return;
        }
        const err = validateFileTugas({ nama: file.name, ukuran: file.size }, 'jawaban', { butuhIsi: false });
        tugasSayaView.fileDitolak = err;
        if (!err) {
            tugasSayaView.proses = true;
            renderTugasSaya(ctx);
            try {
                const meta = await simpanFileBrowser(file);
                buangFileBelumTerkirim();
                tugasSayaView.file = meta;
            } catch (error) {
                tugasSayaView.fileDitolak = error.message || 'File tidak dapat disimpan. Coba pilih ulang file.';
            }
            tugasSayaView.proses = false;
        }
        form.elements.file.value = '';
        renderTugasSaya(ctx);
        showFieldError(form, 'file', tugasSayaView.fileDitolak);
    });
    form.addEventListener('submit', event => {
        event.preventDefault();
        if (tugasSayaView.proses) {
            tampilkanPesan('error', 'File jawaban masih disimpan. Tunggu sebentar, lalu kumpulkan lagi.');
            return;
        }
        const metode = tugasSayaView.metode;
        // File terakhir yang dipilih ditolak → jangan kirim tanpa disadari
        if (metode === 'upload' && tugasSayaView.fileDitolak) {
            showFieldError(form, 'file', tugasSayaView.fileDitolak);
            tampilkanPesan('error', `Tugas belum terkirim. ${tugasSayaView.fileDitolak}`);
            return;
        }
        const lama = getHasil(ctx.peserta.id, 'tugas', tugasSayaView.dipilih);
        const file = tugasSayaView.file !== undefined ? tugasSayaView.file : (lama && lama.metode === 'upload' ? lama.lampiran : null);
        const hasil = kumpulkanTugas(ctx.peserta.id, tugasSayaView.dipilih, { metode, teks: form.elements.teks.value, file });
        if (!hasil.ok && hasil.tutup) {
            // Pertemuan ditutup saat halaman masih terbuka: form disembunyikan, alasan ditampilkan
            buangFileBelumTerkirim();
            tugasSayaView.file = undefined;
            renderTugasSaya(ctx);
            tampilkanPesan('error', `Tugas belum terkirim. ${hasil.pesan}`);
            return;
        }
        if (!hasil.ok) {
            const field = hasil.field === 'file' ? 'file' : 'teks';
            showFieldError(form, field, hasil.pesan);
            if (field === 'teks') {
                form.elements.teks.focus();
            }
            tampilkanPesan('error', `Tugas belum terkirim. ${hasil.pesan}`);
            return;
        }
        // File jawaban lama yang diganti dibuang dari penyimpanan file browser
        if (hasil.lama && hasil.lama.lampiran && !samaFile(hasil.lama.lampiran, hasil.hasil.lampiran)) {
            hapusFileBrowser(hasil.lama.lampiran);
        }
        tugasSayaView.file = undefined;
        tampilkanPesan('success', `✓ Jawaban tugas "${getTugasById(tugasSayaView.dipilih).judul}" berhasil dikumpulkan ${formatTanggalWaktu(hasil.hasil.dikumpulkan)} (${LABEL_METODE_JAWABAN[hasil.hasil.metode]}).`);
        isiAwal();
        renderTugasSaya(ctx);
        document.getElementById('page-alert').scrollIntoView({ block: 'nearest' });
    });
}

/* =========================
   14. PENGERJAAN SOAL (kerjakan.html?jenis=pretest|aktivitas|latihan|kuis|to&id=N)
   Satu mesin untuk semua jenis. Peserta: jawaban disimpan setiap dipilih (aman saat refresh), timer berjalan
   dari waktu mulai yang tersimpan. Pengajar/Admin: mode pratinjau (preview) — jawaban tidak disimpan.
========================= */

const LABEL_JENIS_KERJA = { pretest: 'Pretest', aktivitas: 'Aktivitas Interaktif', latihan: 'Latihan Soal', kuis: 'Kuis', to: 'Try Out' };
const kerjaView = { jenis: null, data: null, hasil: null, preview: false, nomor: 0, timer: null, review: false, pesertaId: null };

function hurufOpsi(i) {
    return 'ABCD'.charAt(i);
}

// Label & tautan kembali sesuai konteks
function tautanKembaliKerja() {
    const { jenis, data, preview } = kerjaView;
    if (preview) {
        // Dibuka dari editor soal (…&dari=soal) → kembali ke editor soal; selain itu ke halaman pengelolaan
        if (new URLSearchParams(window.location.search).get('dari') === 'soal') {
            return { href: `kelola-soal.html?jenis=${jenis}&id=${data.item.id}`, label: 'Kembali ke Kelola Soal' };
        }
        const halaman = jenis === 'kuis' ? `kuis.html?id=${data.item.id}` : jenis === 'to' ? `to-${data.item.jenis.toLowerCase()}.html?id=${data.item.id}` : `evaluasi.html?jenis=${jenis}&id=${data.item.id}`;
        return { href: halaman, label: 'Kembali ke Pengelolaan' };
    }
    if (data && data.pertemuanId) {
        return { href: `pertemuan-saya.html?id=${data.pertemuanId}`, label: 'Kembali ke Pertemuan' };
    }
    if (jenis === 'to') {
        return { href: `to-${data.item.jenis.toLowerCase()}-saya.html`, label: `Kembali ke TO ${data.item.jenis}` };
    }
    return { href: jenis === 'kuis' ? 'kuis-saya.html' : 'kelas-saya.html', label: 'Kembali' };
}

// Akses jadwal pertemuan item yang sedang dikerjakan ('' = boleh; TO tanpa pertemuan selalu '')
function aksesKerja() {
    return kerjaView.preview || !kerjaView.data ? '' : cekAksesAksiPeserta(kerjaView.data.pertemuanId);
}

// Pengerjaan ditolak karena pertemuan sudah ditutup/belum dimulai: kembali ke intro dengan alasannya
function tolakAksiKerja(pesan) {
    renderIntroKerja();
    tampilkanPesan('error', pesan || aksesKerja() || 'Aksi tidak dapat dilakukan.');
}

// Boleh dikerjakan peserta? Hasil: '' bila boleh mulai, atau alasan
function alasanTidakBisaMulai() {
    const { jenis, data, hasil } = kerjaView;
    const akses = aksesKerja();
    if (akses) {
        return akses;
    }
    if (hasil && hasil.status === 'Selesai' && !BOLEH_DIULANG[jenis]) {
        return `${LABEL_JENIS_KERJA[jenis]} ini hanya dapat dikerjakan satu kali dan sudah selesai.`;
    }
    if (jenis === 'kuis' && data.item.status === 'Ditutup' && !(hasil && hasil.status === 'Sedang dikerjakan')) {
        return 'Kuis ini sudah ditutup oleh pengajar.';
    }
    if (jenis === 'to' && data.item.status === 'Selesai' && !(hasil && hasil.status === 'Sedang dikerjakan')) {
        return `TO ${data.item.jenis} ini sudah berakhir.`;
    }
    if (!data.soal.length) {
        return 'Belum ada soal. Pengajar perlu menambahkan soal terlebih dahulu.';
    }
    return '';
}

function formatSisa(detik) {
    const m = Math.floor(detik / 60);
    const s = detik % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function renderIntroKerja() {
    const { jenis, data, hasil, preview } = kerjaView;
    if (kerjaView.tampilHasil) {
        kerjaView.tampilHasil = false;
        renderNavigasi(getCurrentUser(), false);
    }
    const it = data.item;
    const kelas = getKelasById(data.kelasId);
    const pertemuan = data.pertemuanId ? getPertemuanById(data.pertemuanId) : null;
    const formal = jenis === 'to';
    document.body.classList.toggle('ujian-formal', formal);
    // Setiap jenis punya tujuan yang jelas bagi siswa
    const tujuan = { pretest: 'Pemahaman Awal', latihan: 'Latihan Pemahaman', kuis: 'Evaluasi Pembelajaran' }[jenis];
    setText('kj-jenis', formal ? `Simulasi ${JENIS_TO[it.jenis].nama} (${it.jenis}) · materi ${labelCakupanTO(data.kelasId, it.jenis)}`
        : `${LABEL_JENIS_KERJA[jenis]}${pertemuan ? ` Pertemuan ${pertemuan.nomor}` : ''}${tujuan ? ` · ${tujuan}` : ''} · ${data.soal.length} Soal`);
    setText('kj-judul', it.judul);
    const info = [
        ['Kelas', kelas ? escapeHtml(kelas.nama) : '–'],
        ...(pertemuan ? [['Pertemuan', `Pertemuan ${pertemuan.nomor} · ${escapeHtml(pertemuan.judul)}`]] : []),
        ...(formal ? [['Jadwal', `${formatTanggal(it.tanggal)}, ${escapeHtml(it.waktu)} WIB`]] : []),
        ['Jumlah Soal', `${data.soal.length} soal`],
        ['Durasi', Number(data.durasi) ? `${data.durasi} menit (waktu berjalan sejak tombol Mulai ditekan)` : 'Tanpa batas waktu'],
        ['Kesempatan', BOLEH_DIULANG[jenis] ? 'Boleh diulang' : '1 kali'],
    ];
    if (formal && !preview) {
        const p = getPesertaById(kerjaView.pesertaId);
        info.unshift(['Nama Peserta', escapeHtml(p ? p.nama : '–')], ['NIS', escapeHtml(p ? p.nis : '–')]);
    }
    document.getElementById('kj-info').innerHTML = info.map(([l, v]) => `<div><dt>${escapeHtml(l)}</dt><dd>${v}</dd></div>`).join('');
    const instruksi = it.instruksi || {
        kuis: 'Kuis menguji pemahamanmu setelah mempelajari materi. Jawab semua soal sebelum waktu habis; jawaban tersimpan otomatis. Setelah dikirim, kuis tidak dapat dikerjakan ulang.',
        to: 'Kerjakan seperti ujian sungguhan: tidak ada umpan balik selama ujian. Nilai, jawaban benar, dan pembahasan tampil setelah selesai.',
    }[jenis] || '';
    document.getElementById('kj-instruksi').hidden = !instruksi;
    setText('kj-instruksi', instruksi);
    const tatib = document.getElementById('kj-tatib');
    tatib.hidden = !formal;

    // Status & tombol
    const status = hasil ? hasil.status : 'Belum dikerjakan';
    document.getElementById('kj-status').innerHTML = preview
        ? '<span class="badge badge-info">Mode Pratinjau</span>'
        : `${badgeStatusPeserta(status)}${hasil && hasil.status === 'Selesai' ? ` <span class="cell-meta">Nilai ${hasil.skor} · ${formatTanggalWaktu(hasil.selesai)}</span>` : ''}`;
    const alasan = preview ? (data.soal.length ? '' : 'Belum ada soal untuk dipratinjau.') : alasanTidakBisaMulai();
    const tombolMulai = document.getElementById('btn-mulai-kerja');
    const sedang = hasil && hasil.status === 'Sedang dikerjakan';
    // Pertemuan ditutup saat pengerjaan berjalan → pengerjaan dibekukan (jawaban tersimpan tetap ada)
    const tutup = preview ? '' : aksesKerja();
    const beku = Boolean(tutup) && sedang;
    tombolMulai.hidden = beku || (Boolean(alasan) && !sedang);
    tombolMulai.textContent = preview ? 'Mulai Pratinjau' : sedang ? 'Lanjutkan Mengerjakan'
        : hasil && hasil.status === 'Selesai' ? `Ulangi ${LABEL_JENIS_KERJA[jenis]}` : `Mulai ${formal ? `TO ${it.jenis}` : LABEL_JENIS_KERJA[jenis]}`;
    const setuju = document.getElementById('kj-setuju');
    setuju.checked = Boolean(sedang);
    tombolMulai.disabled = formal && !preview && !setuju.checked;
    const pesanAlasan = document.getElementById('kj-alasan');
    pesanAlasan.hidden = !alasan || (sedang && !beku);
    setText('kj-alasan', beku
        ? `${tutup} Pengerjaan dibekukan: ${hasil.jawaban.filter(jawabanLengkap).length} dari ${hasil.soal.length} jawaban yang sudah tersimpan tetap aman dan dapat dilanjutkan bila pertemuan dibuka kembali.`
        : alasan);
    document.getElementById('btn-lihat-hasil').hidden = !(hasil && hasil.status === 'Selesai');
    const kembali = tautanKembaliKerja();
    document.querySelectorAll('[data-kembali]').forEach(a => {
        a.href = kembali.href;
        a.textContent = kembali.label;
    });
    tampilkanBagianKerja('intro');
}

function tampilkanBagianKerja(nama) {
    ['intro', 'soal', 'hasil'].forEach(b => {
        document.getElementById(`kj-bagian-${b}`).hidden = b !== nama;
    });
    if (nama !== 'soal') {
        clearInterval(kerjaView.timer);
        kerjaView.timer = null;
    }
}

function mulaiKerja() {
    const { jenis, data, preview } = kerjaView;
    if (preview) {
        kerjaView.hasil = {
            id: 0, jenis, status: 'Sedang dikerjakan', mulaiMs: Date.now(), durasi: Number(data.durasi) || 0,
            soal: copyData(data.soal), jawaban: data.soal.map(() => null), percobaan: 1,
        };
    } else {
        const r = mulaiPengerjaan(kerjaView.pesertaId, jenis, data.item.id);
        if (!r.ok) {
            tampilkanPesan('error', r.pesan);
            return;
        }
        kerjaView.hasil = r.hasil;
    }
    sembunyikanPesan();
    // Lanjutkan dari soal pertama yang belum dijawab
    const kosong = kerjaView.hasil.jawaban.findIndex(j => !jawabanLengkap(j));
    kerjaView.nomor = kosong === -1 ? 0 : kosong;
    tampilkanBagianKerja('soal');
    renderSoalKerja();
    mulaiTimer();
}

function mulaiTimer() {
    clearInterval(kerjaView.timer);
    const h = kerjaView.hasil;
    const el = document.getElementById('kj-timer');
    el.hidden = !h.durasi;
    if (!h.durasi) {
        return;
    }
    const tick = () => {
        const sisa = sisaWaktu(h);
        setText('kj-timer-teks', formatSisa(sisa));
        el.classList.toggle('is-warning', sisa <= 60);
        if (sisa <= 0) {
            clearInterval(kerjaView.timer);
            kirimKerja(true);
        }
    };
    tick();
    kerjaView.timer = setInterval(tick, 1000);
}

// Simpan satu jawaban. false = ditolak (mis. pertemuan baru saja ditutup) → kembali ke intro dengan alasan
function simpanPilihan(nomor, pilihan) {
    const h = kerjaView.hasil;
    if (kerjaView.preview) {
        h.jawaban[nomor] = pilihan;
        return true;
    }
    const baru = simpanJawaban(h.id, nomor, pilihan);
    if (!baru) {
        kerjaView.hasil = getAllHasil().find(x => x.id === h.id) || h;
        tolakAksiKerja(aksesKerja() || 'Jawaban tidak dapat disimpan.');
        return false;
    }
    kerjaView.hasil = baru;
    return true;
}

// Pilihan pasangan saat ini dari dropdown soal menjodohkan (null = belum dipilih)
function bacaPilihanJodoh() {
    return [...document.querySelectorAll('#kj-opsi select[data-baris]')].map(sel => (sel.value === '' ? null : Number(sel.value)));
}

// Soal menjodohkan: setiap pernyataan kiri dipasangkan dengan satu pilihan dari dropdown
function jodohKerjaHtml(s, jawab, dicek) {
    const pilih = Array.isArray(jawab) ? jawab : [];
    return `<div class="jodoh-list">${s.kiri.map((kiri, i) => {
        const nilai = pilih[i] ?? null;
        const status = dicek ? (nilai === s.kunci[i] ? ' is-correct' : ' is-wrong') : nilai !== null ? ' is-selected' : '';
        return `
            <div class="jodoh-baris${status}">
                <label class="jodoh-kiri" for="kj-jodoh-${i}"><span class="opsi-huruf">${i + 1}</span><span class="opsi-teks">${escapeHtml(kiri)}</span></label>
                <select class="form-control jodoh-pilih" id="kj-jodoh-${i}" data-baris="${i}"${dicek ? ' disabled' : ''}>
                    <option value="">Pilih pasangan…</option>
                    ${s.opsi.map((o, k) => `<option value="${k}"${nilai === k ? ' selected' : ''}>${escapeHtml(o)}</option>`).join('')}
                </select>
                ${dicek && nilai !== s.kunci[i] ? `<p class="jodoh-koreksi">Pasangan yang benar: <strong>${escapeHtml(s.opsi[s.kunci[i]])}</strong></p>` : ''}
            </div>`;
    }).join('')}</div>`;
}

function renderSoalKerja() {
    const { jenis, hasil: h, nomor } = kerjaView;
    const s = h.soal[nomor];
    const total = h.soal.length;
    const jawab = h.jawaban[nomor];
    const aktivitas = jenis === 'aktivitas';
    const jodoh = s.tipe === 'jodoh';
    // Aktivitas: soal yang sudah dijawab dianggap sudah diperiksa (jawaban terkunci & umpan balik tampil)
    const dicek = aktivitas && jawabanLengkap(jawab);
    const dijawab = h.jawaban.filter(jawabanLengkap).length;

    setText('kj-nomor', `Soal ${nomor + 1} dari ${total}`);
    setText('kj-terjawab', `${dijawab} dari ${total} terjawab`);
    const bar = document.getElementById('kj-progress');
    bar.max = total;
    bar.value = dijawab;
    setText('kj-tipe', jodoh ? 'Menjodohkan: pasangkan setiap pernyataan dengan jawaban yang tepat' : s.tipe === 'bs' ? 'Benar atau Salah?' : 'Pilihan ganda');
    setText('kj-soal-teks', s.teks);
    document.getElementById('kj-opsi').innerHTML = jodoh ? jodohKerjaHtml(s, jawab, dicek) : s.opsi.map((o, i) => {
        const kelasOpsi = ['opsi'];
        if (jawab === i) {
            kelasOpsi.push('is-selected');
        }
        if (dicek && i === s.kunci) {
            kelasOpsi.push('is-correct');
        }
        if (dicek && jawab === i && i !== s.kunci) {
            kelasOpsi.push('is-wrong');
        }
        return `
            <label class="${kelasOpsi.join(' ')}">
                <input type="radio" name="opsi" value="${i}"${jawab === i ? ' checked' : ''}${dicek ? ' disabled' : ''}>
                <span class="opsi-huruf">${s.tipe === 'bs' ? (i === 0 ? 'B' : 'S') : hurufOpsi(i)}</span>
                <span class="opsi-teks">${escapeHtml(o)}</span>
            </label>`;
    }).join('');

    // Umpan balik (Aktivitas)
    const fb = document.getElementById('kj-feedback');
    fb.hidden = !dicek;
    if (dicek) {
        const benar = jawabanBenar(s, jawab);
        const tepat = jodoh ? jawab.filter((x, i) => x === s.kunci[i]).length : 0;
        const pesanSalah = jodoh
            ? `Belum tepat. ${tepat} dari ${s.kiri.length} pasangan benar; lihat pasangan yang benar di atas.`
            : `Belum tepat. Jawaban yang benar: ${escapeHtml(s.opsi[s.kunci])}.`;
        fb.className = `feedback ${benar ? 'feedback-benar' : 'feedback-salah'}`;
        fb.innerHTML = `<strong>${benar ? (jodoh ? 'Tepat! Semua pasangan benar.' : 'Tepat! Jawabanmu benar.') : pesanSalah}</strong>${s.pembahasan ? `<p>${escapeHtml(s.pembahasan)}</p>` : ''}`;
    }

    // Tombol navigasi
    const terakhir = nomor === total - 1;
    document.getElementById('btn-soal-sebelum').disabled = nomor === 0;
    const periksa = document.getElementById('btn-periksa');
    periksa.hidden = !aktivitas || dicek;
    periksa.disabled = true;
    const lanjut = document.getElementById('btn-soal-lanjut');
    lanjut.hidden = aktivitas && !dicek;
    lanjut.textContent = terakhir ? (aktivitas ? 'Lihat Skor' : 'Kirim Jawaban') : 'Berikutnya';
    lanjut.classList.toggle('btn-primary', terakhir);
    lanjut.classList.toggle('btn-secondary', !terakhir);

    // Daftar nomor soal (tidak dipakai Aktivitas: dikerjakan berurutan)
    const grid = document.getElementById('kj-grid');
    document.getElementById('kj-grid-panel').hidden = aktivitas;
    grid.innerHTML = h.soal.map((_, i) => {
        const sudah = jawabanLengkap(h.jawaban[i]);
        return `<button type="button" class="nomor-btn${sudah ? ' is-answered' : ''}${i === nomor ? ' is-current' : ''}" data-nomor="${i}" aria-label="Soal ${i + 1}${sudah ? ' (sudah dijawab)' : ' (belum dijawab)'}"${i === nomor ? ' aria-current="step"' : ''}>${i + 1}</button>`;
    }).join('');
}

function pindahSoal(nomor) {
    kerjaView.nomor = Math.min(Math.max(0, nomor), kerjaView.hasil.soal.length - 1);
    renderSoalKerja();
    document.getElementById('kj-soal-teks').focus();
}

// Kirim jawaban. otomatis = waktu habis (tanpa konfirmasi)
function kirimKerja(otomatis = false) {
    const h = kerjaView.hasil;
    const kosong = h.jawaban.filter(j => !jawabanLengkap(j)).length;
    const kirim = () => {
        if (kerjaView.preview) {
            Object.assign(h, nilaiJawaban(h.soal, h.jawaban), { status: 'Selesai', selesai: waktuSekarang() });
        } else {
            // Status akses dicek ulang saat kirim: halaman yang lama terbuka tetap ditolak bila pertemuan sudah ditutup
            const r = selesaikanPengerjaan(h.id);
            if (!r || r.status !== 'Selesai') {
                kerjaView.hasil = r || h;
                tolakAksiKerja(`Jawaban belum terkirim. ${aksesKerja() || 'Pengerjaan tidak dapat dikirim.'}`);
                return;
            }
            kerjaView.hasil = r;
        }
        kerjaView.review = false;
        renderHasilKerja();
        if (otomatis) {
            tampilkanPesan('error', 'Waktu habis. Jawaban yang sudah diisi dikirim otomatis.');
        } else {
            tampilkanPesan('success', `${LABEL_JENIS_KERJA[kerjaView.jenis]} selesai dikerjakan${kerjaView.preview ? ' (pratinjau, tidak disimpan)' : ' dan hasilnya tersimpan'}.`);
        }
    };
    if (otomatis || kerjaView.jenis === 'aktivitas') {
        kirim();
        return;
    }
    konfirmasiAksi({
        judul: 'Kirim Jawaban?',
        pesan: kosong ? `Masih ada ${kosong} soal yang belum dijawab. Soal kosong dinilai salah.` : 'Semua soal sudah dijawab.',
        catatan: BOLEH_DIULANG[kerjaView.jenis] ? 'Latihan dapat diulang setelah dikirim.' : 'Setelah dikirim, jawaban tidak dapat diubah.',
        tombol: 'Kirim Jawaban',
        onConfirm: kirim,
    });
}

// Lama pengerjaan "12 menit 5 detik" dari waktu mulai & selesai (null bila tidak tersedia)
function lamaPengerjaan(h) {
    const ms = h && h.mulai && h.selesai ? new Date(h.selesai) - new Date(h.mulai) : NaN;
    if (!Number.isFinite(ms) || ms < 0) {
        return null;
    }
    const detik = Math.round(ms / 1000);
    const m = Math.floor(detik / 60);
    return m ? `${m} menit ${detik % 60} detik` : `${detik} detik`;
}

// Pesan sederhana setelah selesai, sesuai tujuan setiap jenis
function pesanHasilKerja(jenis, h) {
    const skor = Number(h.skor) || 0;
    if (jenis === 'pretest') {
        return skor >= 80 ? '🌟 Kamu sudah punya bekal yang bagus. Pelajari modulnya untuk memperdalam pemahaman.'
            : skor >= 50 ? '👍 Lumayan! Pretest hanya mengukur pemahaman awal — modul berikutnya akan membantumu.'
                : '🌱 Tidak apa-apa, ini baru pemahaman awal. Yuk pelajari modulnya dengan teliti!';
    }
    if (jenis === 'latihan') {
        return skor >= 80 ? '💪 Latihanmu bagus! Lanjutkan ke kuis.' : '🔁 Baca pembahasannya, lalu coba latihan lagi untuk memperkuat pemahaman.';
    }
    if (jenis === 'kuis') {
        return skor >= 70 ? '🏆 Selamat! Pemahamanmu pada pertemuan ini sudah baik.' : '📚 Pelajari lagi modul dan pembahasan kuis ini, ya.';
    }
    return skor >= 70 ? '🎯 Hasil try out yang baik. Pertahankan!' : '📘 Gunakan pembahasan untuk mempersiapkan ujian sekolah.';
}

function kategoriNilai(skor) {
    if (skor >= 85) {
        return 'Sangat baik';
    }
    if (skor >= 70) {
        return 'Baik';
    }
    if (skor >= 55) {
        return 'Cukup';
    }
    return 'Perlu belajar lagi';
}

function renderHasilKerja() {
    const { jenis, hasil: h, preview } = kerjaView;
    tampilkanBagianKerja('hasil');
    // Breadcrumb: … › Pretest › Hasil
    if (!kerjaView.tampilHasil) {
        kerjaView.tampilHasil = true;
        renderNavigasi(getCurrentUser(), false);
    }
    setText('kj-hasil-skor', h.skor);
    setText('kj-hasil-kategori', kategoriNilai(h.skor));
    const waktu = lamaPengerjaan(h);
    const rinci = h.benar === null || h.benar === undefined
        ? [['Status', 'Selesai'], ['Selesai', formatTanggalWaktu(h.selesai)]]
        : [['Benar', h.benar], ['Salah', h.salah], ['Tidak dijawab', h.kosong], ['Jumlah soal', h.total],
            ['Persentase', `${h.total ? Math.round((h.benar / h.total) * 100) : 0}%`],
            ...(waktu ? [['Waktu pengerjaan', waktu]] : []), ['Selesai', formatTanggalWaktu(h.selesai)],
            ...(BOLEH_DIULANG[jenis] && !preview ? [['Percobaan ke', h.percobaan], ['Nilai terbaik', h.skorTerbaik ?? h.skor]] : [])];
    const lanjut = preview || !kerjaView.data || !kerjaView.data.pertemuanId ? '' : pesanLangkahBerikut(kerjaView.pesertaId, kerjaView.data.pertemuanId);
    setText('kj-hasil-pesan', `${pesanHasilKerja(jenis, h)}${lanjut ? ` ${lanjut}` : ''}`);
    document.getElementById('kj-hasil-rinci').innerHTML = rinci.map(([l, v]) => `<div><dt>${escapeHtml(l)}</dt><dd>${escapeHtml(String(v))}</dd></div>`).join('');
    const adaRincian = Array.isArray(h.soal) && Array.isArray(h.jawaban);
    document.getElementById('btn-pembahasan').hidden = !adaRincian;
    setText('kj-tanpa-rincian', adaRincian ? '' : 'Rincian jawaban tidak tersedia karena hasil ini berasal dari data awal.');
    document.getElementById('btn-ulangi').hidden = preview || !BOLEH_DIULANG[jenis] || Boolean(aksesKerja());
    document.getElementById('kj-review').hidden = !kerjaView.review;
    setText('btn-pembahasan', kerjaView.review ? 'Sembunyikan Pembahasan' : 'Lihat Pembahasan');
    if (kerjaView.review && adaRincian) {
        document.getElementById('kj-review-list').innerHTML = reviewSoalHtml(h.soal, h.jawaban);
    }
}

// Daftar soal + jawaban peserta + kunci + tanda benar/salah + pembahasan (<li> untuk <ol class="review-list">).
// soal = salinan soal yang tersimpan di hasil (soal yang benar-benar dikerjakan), jawaban = jawaban peserta.
// labelJawaban: "Jawabanmu" (peserta) atau "Jawaban peserta" (Pengajar/Admin).
function reviewSoalHtml(soal, jawaban, labelJawaban = 'Jawabanmu') {
    return soal.map((s, i) => {
        const j = Array.isArray(jawaban) ? jawaban[i] ?? null : null;
        const benar = jawabanBenar(s, j);
        const kosong = j === null || j === undefined || (Array.isArray(j) && j.every(x => x === null));
        const jawabanHtml = s.tipe === 'jodoh'
            ? `<ul class="review-jodoh">${s.kiri.map((kiri, k) => {
                const pilih = Array.isArray(j) ? j[k] : null;
                const tepat = pilih === s.kunci[k];
                return `<li class="${tepat ? 'is-benar' : 'is-salah'}">${escapeHtml(kiri)} → <strong>${pilih === null || pilih === undefined ? '–' : escapeHtml(s.opsi[pilih])}</strong>${tepat ? '' : ` <span class="cell-meta">(benar: ${escapeHtml(s.opsi[s.kunci[k]])})</span>`}</li>`;
            }).join('')}</ul>`
            : `<p>${escapeHtml(labelJawaban)}: <strong>${j === null ? '–' : `${hurufOpsi(j)}. ${escapeHtml(s.opsi[j])}`}</strong></p>
                <p>Jawaban benar: <strong>${hurufOpsi(s.kunci)}. ${escapeHtml(s.opsi[s.kunci])}</strong></p>`;
        return `
            <li class="review-item ${benar ? 'is-benar' : 'is-salah'}">
                <p class="review-head"><strong>Soal ${i + 1}</strong> ${benar ? '<span class="badge badge-success">Benar</span>' : `<span class="badge badge-danger">${kosong ? 'Tidak dijawab' : 'Salah'}</span>`}</p>
                <p class="review-soal">${escapeHtml(s.teks)}</p>
                ${jawabanHtml}
                ${s.pembahasan ? `<p class="review-pembahasan">${escapeHtml(s.pembahasan)}</p>` : ''}
            </li>`;
    }).join('');
}

// Modal konfirmasi umum (bukan confirm() bawaan browser)
let aksiKonfirmasiUmum = null;

function konfirmasiAksi({ judul, pesan, catatan = '', tombol = 'Lanjutkan', onConfirm }) {
    setText('modal-konfirmasi-title', judul);
    setText('modal-konfirmasi-text', pesan);
    setText('modal-konfirmasi-note', catatan);
    document.getElementById('modal-konfirmasi-note').hidden = !catatan;
    setText('modal-konfirmasi-ok', tombol);
    aksiKonfirmasiUmum = onConfirm;
    bukaModal('modal-konfirmasi');
}

function initKerjakanPage() {
    initModalUmum();
    const okKonfirmasi = document.getElementById('modal-konfirmasi-ok');
    okKonfirmasi.addEventListener('click', () => {
        const aksi = aksiKonfirmasiUmum;
        aksiKonfirmasiUmum = null;
        tutupModal();
        if (aksi) {
            aksi();
        }
    });
    const params = new URLSearchParams(window.location.search);
    const user = getCurrentUser();
    const jenis = params.get('jenis');
    // Aktivitas Interaktif kini memiliki pemutar sendiri (alamat lama tetap berfungsi)
    if (jenis === 'aktivitas') {
        pindahHalaman(`aktivitas.html?id=${encodeURIComponent(params.get('id') || '')}`);
        return;
    }
    kerjaView.jenis = jenis;
    // Pengajar & Admin hanya dapat melihat pratinjau (tidak tersimpan); Peserta mengerjakan sungguhan
    kerjaView.preview = user.role !== 'peserta';
    kerjaView.pesertaId = user.pesertaId;
    const data = LABEL_JENIS_KERJA[jenis] ? getItemPengerjaan(jenis, params.get('id')) : null;
    // Peserta hanya melihat item yang sudah diterbitkan
    const terbit = data && (kerjaView.preview ||
        (JENIS_EVALUASI[jenis] ? data.item.status === 'Aktif' : jenis === 'kuis' ? data.item.status !== 'Draft' : data.item.status !== 'Draft'));
    if (!terbit) {
        document.getElementById('kj-tidak-ada').hidden = false;
        document.getElementById('kj-konten').hidden = true;
        document.getElementById('kj-kembali-tidak-ada').href = user.role === 'peserta' ? 'kelas-saya.html' : 'pertemuan.html';
        return;
    }
    // Alur berurutan: Latihan/Kuis yang masih terkunci tidak dapat dibuka lewat URL langsung
    if (!kerjaView.preview && tolakBilaTerkunci(jenis, data.item.id)) {
        return;
    }
    kerjaView.data = data;
    kerjaView.hasil = kerjaView.preview ? null : getHasil(user.pesertaId, jenis, data.item.id);
    document.title = `${data.item.judul} — DelLearn`;
    document.getElementById('kj-preview-banner').hidden = !kerjaView.preview;

    // Pengerjaan berbatas waktu yang waktunya habis saat halaman ditutup → langsung dikirim
    // (Pertemuan ditutup → pengerjaan dibekukan, tidak dikirim otomatis)
    if (kerjaView.hasil && kerjaView.hasil.status === 'Sedang dikerjakan' && sisaWaktu(kerjaView.hasil) === 0 && !aksesKerja()) {
        kerjaView.hasil = selesaikanPengerjaan(kerjaView.hasil.id);
        renderHasilKerja();
        tampilkanPesan('error', 'Waktu pengerjaan sudah habis. Jawaban yang tersimpan telah dikirim otomatis.');
    } else {
        renderIntroKerja();
    }

    document.getElementById('kj-setuju').addEventListener('change', event => {
        document.getElementById('btn-mulai-kerja').disabled = !event.target.checked;
    });
    document.getElementById('btn-mulai-kerja').addEventListener('click', mulaiKerja);
    document.getElementById('btn-lihat-hasil').addEventListener('click', () => {
        kerjaView.review = false;
        renderHasilKerja();
    });
    document.getElementById('kj-opsi').addEventListener('change', event => {
        // Menjodohkan: setiap dropdown pasangan
        if (event.target.matches('select[data-baris]')) {
            const pilihan = bacaPilihanJodoh();
            if (kerjaView.jenis === 'aktivitas') {
                // Aktivitas: disimpan setelah "Periksa Jawaban" (semua pernyataan harus dipasangkan dulu)
                event.target.closest('.jodoh-baris').classList.toggle('is-selected', event.target.value !== '');
                document.getElementById('btn-periksa').disabled = !jawabanLengkap(pilihan);
                return;
            }
            const id = event.target.id;
            if (!simpanPilihan(kerjaView.nomor, pilihan)) {
                return;
            }
            renderSoalKerja();
            const fokus = document.getElementById(id);
            if (fokus) {
                fokus.focus();
            }
            return;
        }
        if (event.target.name !== 'opsi') {
            return;
        }
        const pilihan = Number(event.target.value);
        if (kerjaView.jenis === 'aktivitas') {
            // Aktivitas: pilihan baru disimpan setelah "Periksa Jawaban"
            document.querySelectorAll('#kj-opsi .opsi').forEach((el, i) => el.classList.toggle('is-selected', i === pilihan));
            document.getElementById('btn-periksa').disabled = false;
            return;
        }
        if (simpanPilihan(kerjaView.nomor, pilihan)) {
            renderSoalKerja();
        }
    });
    document.getElementById('btn-periksa').addEventListener('click', () => {
        if (kerjaView.hasil.soal[kerjaView.nomor].tipe === 'jodoh') {
            const pilihan = bacaPilihanJodoh();
            if (jawabanLengkap(pilihan) && simpanPilihan(kerjaView.nomor, pilihan)) {
                renderSoalKerja();
            }
            return;
        }
        const pilih = document.querySelector('#kj-opsi input:checked');
        if (pilih && simpanPilihan(kerjaView.nomor, Number(pilih.value))) {
            renderSoalKerja();
        }
    });
    document.getElementById('btn-soal-sebelum').addEventListener('click', () => pindahSoal(kerjaView.nomor - 1));
    document.getElementById('btn-soal-lanjut').addEventListener('click', () => {
        if (kerjaView.nomor === kerjaView.hasil.soal.length - 1) {
            kirimKerja();
        } else {
            pindahSoal(kerjaView.nomor + 1);
        }
    });
    document.getElementById('btn-kirim').addEventListener('click', () => kirimKerja());
    document.getElementById('kj-grid').addEventListener('click', event => {
        const tombol = event.target.closest('button[data-nomor]');
        if (tombol) {
            pindahSoal(Number(tombol.dataset.nomor));
        }
    });
    document.getElementById('btn-pembahasan').addEventListener('click', () => {
        kerjaView.review = !kerjaView.review;
        renderHasilKerja();
        if (kerjaView.review) {
            document.getElementById('kj-review').scrollIntoView({ block: 'start' });
        }
    });
    document.getElementById('btn-ulangi').addEventListener('click', () => {
        renderIntroKerja();
        sembunyikanPesan();
    });
}

// ---- Kuis (peserta) ----
function initKuisSayaPage() {
    const ctx = getKonteksPeserta();
    if (!siapkanHalamanPeserta(ctx)) {
        return;
    }
    const items = itemPesertaPerJenis(ctx, 'kuis');
    const selesai = items.filter(x => x.tuntas).length;
    setText('peserta-subjudul', `${ctx.kelas.nama} · ${selesai} dari ${items.length} kuis sudah dikerjakan`);
    isiTabelPeserta('kuis-saya-body', items.map((x, i) => barisItemPeserta(x, i + 1, ctx.pertemuanMap[x.item.pertemuanId])),
        6, 'Belum ada kuis yang diterbitkan di kelas Anda.');
}

// ---- TO PTS / TO PAS (peserta) ----
function initTOSayaPage() {
    const jenis = document.body.dataset.jenis === 'PAS' ? 'PAS' : 'PTS';
    const ctx = getKonteksPeserta();
    if (!siapkanHalamanPeserta(ctx)) {
        return;
    }
    const t = getTOPeserta(ctx, jenis);
    const to = t ? t.item : null;
    const tampil = Boolean(to);
    const info = JENIS_TO[jenis];
    setText('peserta-subjudul', `${ctx.kelas.nama} · Simulasi ${info.nama}`);
    document.getElementById('to-saya-detail').innerHTML = [
        ['Judul', tampil ? escapeHtml(to.judul) : `TO ${jenis}`],
        ['Kelas', escapeHtml(ctx.kelas.nama)],
        ['Tanggal', tampil ? formatTanggal(to.tanggal) : 'Belum dijadwalkan'],
        ['Waktu Mulai', tampil ? `${escapeHtml(to.waktu)} WIB` : '–'],
        ['Durasi', tampil ? `${to.durasi} Menit` : '–'],
        ['Jumlah Soal', tampil ? `${getSoalTO(to).length} Soal` : '–'],
        ['Cakupan Materi', escapeHtml(labelCakupanTO(ctx.kelas.id, jenis))],
        ['Jadwal TO', tampil ? badgeTO(to.status) : '<span class="badge badge-muted badge-dot">Belum dijadwalkan</span>'],
    ].map(([l, v]) => `<div><dt>${escapeHtml(l)}</dt><dd>${v}</dd></div>`).join('');

    // Pengerjaan: status, nilai, tombol mulai/lanjutkan/lihat hasil
    document.getElementById('to-saya-status').innerHTML = t
        ? `${badgeStatusPeserta(t.status)}${t.skor !== null ? ` <strong class="konten-skor">Nilai ${t.skor}</strong>` : ''}`
        : '<span class="badge badge-muted badge-dot">Belum dijadwalkan</span>';
    setText('to-saya-status-info', !t ? 'Jadwal TO ini belum diumumkan pengajar.'
        : t.status === 'Selesai' ? `Selesai dikerjakan ${formatTanggalWaktu(t.hasil.selesai)}.`
            : t.status === 'Sedang dikerjakan' ? 'Pengerjaan belum dikirim. Waktu tetap berjalan.'
                : t.status === 'Ditutup' ? `TO ${jenis} ini sudah berakhir.` : 'Baca ketentuan, lalu mulai saat Anda siap.');
    const tombol = document.getElementById('btn-to-saya');
    tombol.hidden = !t;
    if (t) {
        tombol.href = t.aksi.href;
        tombol.textContent = t.status === 'Belum dikerjakan' ? `Mulai TO ${jenis}` : t.status === 'Sedang dikerjakan' ? `Lanjutkan TO ${jenis}` : t.aksi.label;
    }
    document.getElementById('to-saya-ketentuan').innerHTML = [
        'TO dikerjakan secara daring sesuai jadwal.',
        tampil ? `Waktu berjalan otomatis selama ${to.durasi} menit.` : 'Durasi diumumkan bersama jadwal.',
        'Setiap peserta memiliki 1 kali kesempatan.',
        `Nilai TO ${jenis} berkontribusi 30% pada nilai akhir.`,
        'TO adalah simulasi ujian sekolah, bukan penentu kelulusan.',
    ].map(teks => `<li>${escapeHtml(teks)}</li>`).join('');
}

// ---- Nilai Saya ----
function initNilaiSayaPage() {
    const ctx = getKonteksPeserta();
    if (!siapkanHalamanPeserta(ctx)) {
        return;
    }
    const nilai = getNilaiPeserta(ctx);
    const data = bacaDataBelajar();
    setText('peserta-subjudul', `${ctx.kelas.nama} · NIS ${ctx.peserta.nis}`);
    const komponen = [['tugas', 'Tugas'], ['kuis', 'Kuis'], ['pts', 'TO PTS'], ['pas', 'TO PAS']];
    const milik = data.hasil.filter(h => h.pesertaId === ctx.peserta.id && h.kelasId === ctx.kelas.id);
    const jumlahHasil = {
        tugas: milik.filter(h => h.jenis === 'tugas' && h.status === 'Dinilai').length,
        kuis: milik.filter(h => h.jenis === 'kuis' && h.status === 'Selesai').length,
        pts: milik.filter(h => h.jenisTO === 'PTS' && h.status === 'Selesai').length,
        pas: milik.filter(h => h.jenisTO === 'PAS' && h.status === 'Selesai').length,
    };
    const sumber = key => {
        if (!nilai || nilai[key] === null) {
            return 'Belum ada nilai';
        }
        if (nilai.sumber[key] === 'hasil') {
            return key === 'kuis' || key === 'tugas' ? `Rata-rata ${jumlahHasil[key]} ${key} yang dinilai` : 'Dari hasil Try Out';
        }
        return 'Nilai awal dari pengajar';
    };
    komponen.forEach(([key]) => {
        setText(`ns-${key}`, nilai && nilai[key] !== null ? nilai[key] : '–');
        setText(`ns-${key}-info`, `Bobot ${BOBOT_NILAI[key] * 100}% · ${sumber(key)}`);
    });
    const lengkap = nilai && nilai.lengkap;
    setText('ns-akhir', lengkap ? formatNilai(hitungNilaiAkhir(nilai)) : '–');
    setText('ns-akhir-info', lengkap ? 'Dihitung dari bobot komponen (20/20/30/30)' : nilai ? 'Belum lengkap: masih ada komponen tanpa nilai' : 'Belum dinilai');
    isiTabelPeserta('ns-body', nilai ? komponen.map(([key, label]) => `
        <tr>
            <td class="cell-title">${label}<p class="cell-meta">${escapeHtml(sumber(key))}</p></td>
            <td class="num">${nilai[key] !== null ? nilai[key] : '–'}</td>
            <td class="num">${BOBOT_NILAI[key] * 100}%</td>
            <td class="num">${nilai[key] !== null ? formatNilai(nilai[key] * BOBOT_NILAI[key]) : '–'}</td>
        </tr>`) : [], 4, 'Nilai Anda belum tersedia. Nilai akan tampil setelah mengerjakan kuis, Try Out, atau tugas dinilai pengajar.');

    // Riwayat nilai yang membentuk komponen (kuis, TO, tugas)
    const judul = h => {
        const sumberItem = { kuis: data.kuis, tugas: data.tugas, to: getAllTO() }[h.jenis];
        const item = sumberItem.find(x => x.id === h.itemId);
        return item ? item.judul : '(sudah dihapus)';
    };
    const riwayat = milik.filter(h => (['kuis', 'to'].includes(h.jenis) && h.status === 'Selesai') || (h.jenis === 'tugas' && h.status === 'Dinilai'))
        .sort((a, b) => String(b.selesai || b.dinilaiPada).localeCompare(String(a.selesai || a.dinilaiPada)));
    isiTabelPeserta('ns-riwayat-body', riwayat.map(h => `
        <tr>
            <td class="cell-title">${escapeHtml(judul(h))}${h.jenis === 'tugas' && h.catatan ? `<p class="cell-meta">Catatan: ${escapeHtml(h.catatan)}</p>` : ''}</td>
            <td>${h.jenis === 'to' ? `TO ${h.jenisTO}` : h.jenis === 'kuis' ? 'Kuis' : 'Tugas'}</td>
            <td>${formatTanggalWaktu(h.selesai || h.dinilaiPada)}</td>
            <td class="num"><strong>${h.jenis === 'tugas' ? h.nilai : h.skor}</strong></td>
        </tr>`), 4, 'Belum ada kuis, Try Out, atau tugas yang dinilai.');
}

/* =========================
   15. KELOLA SOAL (kelola-soal.html?jenis=pretest|aktivitas|latihan|kuis|to&id=N) — Pengajar & Admin
   Daftar soal + Tambah/Edit (modal), Hapus (konfirmasi), urutan Naik/Turun, Preview (kerjakan.html mode pratinjau).
   Semua perubahan memakai API Kelola Soal di bagian 2B (langsung tersimpan, dibatasi role).
========================= */

const kelolaSoalView = { jenis: null, id: null, editIndex: null };

// Halaman asal item (untuk tombol Kembali & breadcrumb)
function tautanAsalSoal(jenis, item) {
    if (JENIS_EVALUASI[jenis]) {
        return { href: `evaluasi.html?jenis=${jenis}&id=${item.id}`, label: JENIS_EVALUASI[jenis].label };
    }
    if (jenis === 'kuis') {
        return { href: `kuis.html?id=${item.id}`, label: 'Kuis' };
    }
    return { href: `to-${item.jenis.toLowerCase()}.html?id=${item.id}`, label: `TO ${item.jenis}` };
}

function ringkasTeks(teks, maks = 60) {
    const t = String(teks || '').replace(/\s+/g, ' ').trim();
    return t.length > maks ? `${t.slice(0, maks - 1)}…` : t;
}

// Badge status item sesuai jenisnya
function badgeStatusItem(jenis, status) {
    return jenis === 'to' ? badgeTO(status) : badgeTugas(status);
}

function soalCardHtml(s, i, total, bisaEdit = true) {
    const isi = s.tipe === 'jodoh'
        ? `<ul class="soal-jodoh-list">${pasanganSoal(s).map((p, k) => `
            <li><span class="opsi-huruf">${k + 1}</span><span>${escapeHtml(p.kiri)}</span>${iconHtml('arrow-right')}<strong>${escapeHtml(p.kanan)}</strong></li>`).join('')}</ul>`
        : `<ul class="soal-opsi-list">${s.opsi.map((o, k) => `
            <li class="${k === s.kunci ? 'is-kunci' : ''}">
                <span class="opsi-huruf">${s.tipe === 'bs' ? (k === 0 ? 'B' : 'S') : hurufOpsi(k)}</span>
                <span class="opsi-teks">${escapeHtml(o)}</span>
                ${k === s.kunci ? '<span class="badge badge-success">Jawaban benar</span>' : ''}
            </li>`).join('')}</ul>`;
    return `
        <li class="soal-card" id="soal-${i + 1}">
            <div class="soal-card-head">
                <span class="soal-nomor">${i + 1}</span>
                <span class="badge ${s.tipe === 'jodoh' ? 'badge-info' : s.tipe === 'bs' ? 'badge-neutral' : 'badge-muted'}">${TIPE_SOAL[s.tipe]}</span>
                <div class="actions soal-card-aksi">
                    <button type="button" class="icon-btn icon-btn-ghost icon-btn-small" data-action="naik" data-index="${i}" aria-label="Pindahkan soal ${i + 1} ke atas"${i === 0 ? ' disabled' : ''}>${iconHtml('arrow-up')}</button>
                    <button type="button" class="icon-btn icon-btn-ghost icon-btn-small" data-action="turun" data-index="${i}" aria-label="Pindahkan soal ${i + 1} ke bawah"${i === total - 1 ? ' disabled' : ''}>${iconHtml('arrow-down')}</button>
                    ${bisaEdit ? `<button type="button" class="btn btn-secondary btn-small" data-action="edit" data-index="${i}" aria-label="Edit soal ${i + 1}">${iconHtml('pencil', '')}Edit</button>` : ''}
                    <button type="button" class="btn btn-secondary btn-small btn-hapus-soal" data-action="hapus" data-index="${i}" aria-label="Hapus soal ${i + 1}">${iconHtml('trash', '')}Hapus</button>
                </div>
            </div>
            <p class="soal-card-teks">${escapeHtml(s.teks)}</p>
            ${isi}
            ${s.tipe !== 'jodoh' ? `<p class="soal-card-jawaban">Jawaban: <strong>${s.tipe === 'bs' ? (s.kunci === 0 ? 'Benar' : 'Salah') : `${hurufOpsi(s.kunci)}. ${escapeHtml(s.opsi[s.kunci])}`}</strong></p>` : ''}
            ${s.pembahasan ? `<p class="soal-card-pembahasan"><strong>Pembahasan:</strong> ${escapeHtml(s.pembahasan)}</p>` : '<p class="soal-card-pembahasan cell-muted">Tanpa pembahasan.</p>'}
        </li>`;
}

// Render seluruh halaman. Hasil: data item atau null bila tidak ditemukan / tanpa akses.
function renderKelolaSoal() {
    const { jenis, id } = kelolaSoalView;
    const data = getItemKelolaSoal(jenis, id);
    document.getElementById('ks-tidak-ada').hidden = Boolean(data);
    document.getElementById('ks-konten').hidden = !data;
    if (!data) {
        return null;
    }
    const it = data.item;
    const kelas = getKelasById(it.kelasId);
    const pertemuan = it.pertemuanId ? getPertemuanById(it.pertemuanId) : null;
    const asal = tautanAsalSoal(jenis, it);
    setText('ks-jenis', `Kelola Soal · ${data.label}`);
    setText('ks-judul', it.judul);
    document.getElementById('ks-meta').innerHTML = [
        kelas ? escapeHtml(kelas.nama) : 'Kelas tidak ditemukan',
        pertemuan ? `Pertemuan ${pertemuan.nomor} · ${escapeHtml(pertemuan.judul)}` : jenis === 'to' ? `${formatTanggal(it.tanggal)}, ${escapeHtml(it.waktu)} WIB` : 'Tanpa pertemuan',
        badgeStatusItem(jenis, it.status),
    ].join(' · ');
    // Breadcrumb statis bisa sudah diganti breadcrumb dinamis (renderNavigasi) → elemen ini opsional
    const asalLink = document.getElementById('ks-asal');
    if (asalLink) {
        asalLink.href = asal.href;
        asalLink.textContent = asal.label;
    }
    document.getElementById('ks-kembali').href = asal.href;

    // Preview hanya bila sudah ada soal
    const preview = document.getElementById('btn-preview-soal');
    const adaSoal = data.soal.length > 0;
    preview.href = `kerjakan.html?jenis=${jenis}&id=${it.id}&dari=soal`;
    preview.classList.toggle('is-disabled', !adaSoal);
    preview.setAttribute('aria-disabled', String(!adaSoal));
    preview.title = adaSoal ? 'Lihat tampilan seperti peserta (jawaban tidak disimpan)' : 'Tambahkan soal terlebih dahulu';

    const infoBank = document.getElementById('ks-info-bank');
    infoBank.hidden = data.tersusun || !adaSoal;
    infoBank.textContent = `Soal ${data.label.toLowerCase()} ini masih diambil otomatis dari kumpulan soal bawaan pertemuan. Saat Anda menambah, mengubah, menghapus, atau mengurutkan soal, seluruh soal di bawah ini disalin menjadi milik ${data.label.toLowerCase()} ini dan dapat dikelola bebas.`;
    const pengerjaan = hitungPengerjaanItem(jenis, it.id);
    const infoHasil = document.getElementById('ks-info-hasil');
    infoHasil.hidden = !(pengerjaan.selesai + pengerjaan.sedang);
    infoHasil.textContent = `${pengerjaan.selesai} peserta sudah menyelesaikan${pengerjaan.sedang ? ` dan ${pengerjaan.sedang} sedang mengerjakan` : ''}. Nilai dan pembahasan mereka tetap memakai soal saat mereka mulai; perubahan berlaku untuk pengerjaan berikutnya.`;

    const hitung = tipe => data.soal.filter(s => s.tipe === tipe).length;
    // Penghitung "x / target" untuk Pretest (tepat 5), Latihan (target) & Kuis (jumlah soal rencana); TO jumlah soal
    const pakaiTarget = jenis === 'pretest' || jenis === 'latihan' || jenis === 'kuis';
    const kurang = pakaiTarget && data.soal.length < data.target;
    setText('ks-ringkasan', `${pakaiTarget ? `Soal: ${data.soal.length} / ${data.target}` : `${data.soal.length} soal`}${adaSoal ? ` · ${hitung('pg')} pilihan ganda · ${hitung('bs')} benar/salah` : ''}${jenis === 'latihan' || jenis === 'kuis' ? ' · soal dibuat pengajar' : ''}`);
    document.getElementById('ks-ringkasan').classList.toggle('status-inline-warning', kurang);
    setText('ks-syarat', jenis === 'pretest'
        ? `Pretest harus tepat ${PRETEST_JUMLAH_SOAL} soal${data.terbit ? ' (status Aktif)' : ' sebelum diaktifkan'}`
        : data.terbit
            ? `Status ${it.status}: terlihat peserta, minimal ${data.minTerbit} soal`
            : kurang ? `Belum siap: perlu ${data.target - data.soal.length} soal lagi sebelum diaktifkan` : 'Status Draft: belum terlihat peserta');
    // Tambah Soal (ditulis Pengajar); Pretest maks. 5 soal, Kuis = Jumlah Soal
    const tambah = document.getElementById('btn-tambah-soal');
    tambah.hidden = false;
    tambah.disabled = data.soal.length >= data.maks;
    tambah.title = tambah.disabled ? (jenis === 'kuis' ? `Sudah ${data.maks} dari ${data.target} soal. Ubah Jumlah Soal lewat Edit Kuis untuk menambah.` : `Sudah ${data.maks} soal (maksimal)`) : '';
    setText('ks-jenis', `Kelola Soal ${data.label}`);
    document.getElementById('ks-soal-list').innerHTML = adaSoal
        ? data.soal.map((s, i) => soalCardHtml(s, i, data.soal.length)).join('')
        : `<li class="table-empty">Belum ada soal. Klik "Tambah Soal" untuk membuat soal pertama${jenis === 'to' ? ` (TO memerlukan minimal ${TO_SOAL_MIN} soal sebelum dijadwalkan)` : ''}</li>`;
    return data;
}

// ---- Form soal (modal) ----
function renderEditorOpsi(opsi = ['', '', '', ''], kunci = null) {
    document.getElementById('soal-opsi-editor').innerHTML = [0, 1, 2, 3].map(i => `
        <div class="opsi-edit-baris">
            <label class="opsi-kunci" title="Tandai ${hurufOpsi(i)} sebagai jawaban benar">
                <input type="radio" name="soalKunciPg" value="${i}"${kunci === i ? ' checked' : ''}>
                <span class="opsi-huruf">${hurufOpsi(i)}</span>
                <span class="visually-hidden">Tandai pilihan ${hurufOpsi(i)} sebagai jawaban benar</span>
            </label>
            <input type="text" class="form-control" name="soalOpsi${i}" maxlength="300" placeholder="Pilihan ${hurufOpsi(i)}" aria-label="Teks pilihan ${hurufOpsi(i)}" value="${escapeHtml(opsi[i] || '')}">
        </div>`).join('');
}

function renderEditorJodoh(pasangan) {
    const list = pasangan.length ? pasangan : [{ kiri: '', kanan: '' }, { kiri: '', kanan: '' }];
    document.getElementById('soal-jodoh-editor').innerHTML = list.map((p, i) => `
        <div class="jodoh-edit-baris">
            <span class="opsi-huruf">${i + 1}</span>
            <input type="text" class="form-control" data-sisi="kiri" maxlength="200" placeholder="Pernyataan / istilah" aria-label="Pernyataan ${i + 1}" value="${escapeHtml(p.kiri)}">
            ${iconHtml('arrow-right', 'icon-sm jodoh-panah')}
            <input type="text" class="form-control" data-sisi="kanan" maxlength="200" placeholder="Pasangan yang benar" aria-label="Pasangan yang benar untuk pernyataan ${i + 1}" value="${escapeHtml(p.kanan)}">
            <button type="button" class="icon-btn icon-btn-ghost icon-btn-small icon-btn-danger" data-hapus-pasangan="${i}" aria-label="Hapus pasangan ${i + 1}"${list.length <= JODOH_MIN ? ' disabled' : ''}>${iconHtml('x')}</button>
        </div>`).join('');
    document.getElementById('btn-tambah-pasangan').disabled = list.length >= JODOH_MAKS;
}

function bacaPasanganEditor() {
    return [...document.querySelectorAll('#soal-jodoh-editor .jodoh-edit-baris')].map(baris => ({
        kiri: baris.querySelector('[data-sisi="kiri"]').value,
        kanan: baris.querySelector('[data-sisi="kanan"]').value,
    }));
}

function tampilkanGrupTipe(tipe) {
    document.getElementById('soal-grup-pg').hidden = tipe !== 'pg';
    document.getElementById('soal-grup-bs').hidden = tipe !== 'bs';
    document.getElementById('soal-grup-jodoh').hidden = tipe !== 'jodoh';
    document.getElementById('soal-teks-label').innerHTML = `${tipe === 'jodoh' ? 'Instruksi Soal' : tipe === 'bs' ? 'Pernyataan' : 'Pertanyaan'} <span class="required">*</span>`;
    document.getElementById('soal-teks').placeholder = tipe === 'jodoh'
        ? 'Contoh: Pasangkan setiap istilah dengan pengertiannya.'
        : tipe === 'bs' ? 'Tulis pernyataan yang akan dinilai benar atau salah…' : 'Tulis pertanyaan…';
}

// Soal dari form (kunci undefined = belum dipilih → error "Pilih jawaban yang benar")
function bacaFormSoal(form) {
    const tipe = form.elements.soalTipe.value;
    const terpilih = nama => {
        const r = form.querySelector(`input[name="${nama}"]:checked`);
        return r ? Number(r.value) : undefined;
    };
    const soal = { tipe, teks: form.elements.soalTeks.value, pembahasan: form.elements.soalPembahasan.value };
    if (tipe === 'pg') {
        soal.opsi = [0, 1, 2, 3].map(i => form.elements[`soalOpsi${i}`].value);
        soal.kunci = terpilih('soalKunciPg');
    } else if (tipe === 'bs') {
        soal.kunci = terpilih('soalKunciBs');
    } else if (tipe === 'jodoh') {
        soal.pasangan = bacaPasanganEditor();
    }
    return soal;
}

// Error per bagian form soal; hasil true bila tidak ada error
function tampilkanErrorSoal(form, errors) {
    showFieldError(form, 'soalTipe', errors.tipe);
    showFieldError(form, 'soalTeks', errors.teks);
    showFieldError(form, 'soalPembahasan', errors.pembahasan);
    setText('soalOpsi-error', errors.opsi || '');
    setText('soalPasangan-error', errors.pasangan || '');
    setText('soalKunci-error', errors.kunci || '');
    const opsiSalah = Boolean(errors.opsi);
    form.querySelectorAll('#soal-opsi-editor input[type="text"]').forEach(input => {
        const tandai = opsiSalah && (!input.value.trim() || /kembar/.test(errors.opsi));
        input.classList.toggle('is-invalid', tandai);
        input.setAttribute('aria-invalid', String(tandai));
    });
    form.querySelectorAll('#soal-jodoh-editor input').forEach(input => {
        const tandai = Boolean(errors.pasangan) && !input.value.trim();
        input.classList.toggle('is-invalid', tandai);
        input.setAttribute('aria-invalid', String(tandai));
    });
    document.getElementById('soal-opsi-editor').classList.toggle('is-invalid', Boolean(errors.kunci) && form.elements.soalTipe.value === 'pg');
    document.querySelector('#soal-grup-bs .pilih-bs').classList.toggle('is-invalid', Boolean(errors.kunci) && form.elements.soalTipe.value === 'bs');
    // Fokus ke bagian pertama yang salah
    const urutan = [
        ['tipe', () => form.elements.soalTipe],
        ['teks', () => form.elements.soalTeks],
        ['opsi', () => [...form.querySelectorAll('#soal-opsi-editor input[type="text"]')].find(i => !i.value.trim()) || form.elements.soalOpsi0],
        ['pasangan', () => [...form.querySelectorAll('#soal-jodoh-editor input')].find(i => !i.value.trim()) || form.querySelector('#soal-jodoh-editor input')],
        ['kunci', () => form.querySelector(form.elements.soalTipe.value === 'bs' ? 'input[name="soalKunciBs"]' : 'input[name="soalKunciPg"]')],
        ['pembahasan', () => form.elements.soalPembahasan],
    ];
    const pertama = urutan.find(([key]) => errors[key]);
    if (pertama) {
        const el = pertama[1]();
        if (el) {
            el.focus();
        }
    }
    return !pertama;
}

function tampilkanAlertSoal(pesan) {
    const alert = document.getElementById('soal-form-alert');
    alert.hidden = !pesan;
    setText('soal-form-alert-text', pesan || '');
}

// Isi form soal: s = soal yang diedit, atau null (Tambah). tipeAwal dipakai untuk "Simpan & Tambah Lagi".
function isiFormSoal(s, tipeAwal = 'pg') {
    const form = document.getElementById('form-soal');
    form.reset();
    tampilkanAlertSoal('');
    tampilkanErrorSoal(form, {});
    const tipe = s ? s.tipe : tipeAwal;
    form.elements.soalTipe.value = tipe;
    form.elements.soalTeks.value = s ? s.teks : '';
    form.elements.soalPembahasan.value = s ? s.pembahasan : '';
    renderEditorOpsi(s && s.tipe === 'pg' ? s.opsi : ['', '', '', ''], s && s.tipe === 'pg' ? s.kunci : null);
    form.querySelectorAll('input[name="soalKunciBs"]').forEach(r => {
        r.checked = Boolean(s && s.tipe === 'bs' && Number(r.value) === s.kunci);
    });
    renderEditorJodoh(s && s.tipe === 'jodoh' ? pasanganSoal(s) : []);
    tampilkanGrupTipe(tipe);
}

function bukaFormSoal(index = null) {
    const data = getItemKelolaSoal(kelolaSoalView.jenis, kelolaSoalView.id);
    if (!data) {
        tampilkanPesan('error', 'Data tidak ditemukan. Mungkin sudah dihapus.');
        return;
    }
    const s = index !== null ? data.soal[index] : null;
    if (index !== null && !s) {
        tampilkanPesan('error', 'Soal tidak ditemukan. Mungkin sudah dihapus.');
        return;
    }
    kelolaSoalView.editIndex = s ? index : null;
    isiFormSoal(s);
    setText('modal-soal-title', s ? `Edit Soal ${index + 1}` : `Tambah Soal ${data.soal.length + 1}`);
    document.getElementById('btn-simpan-soal-lagi').hidden = Boolean(s);
    setText('btn-simpan-soal', s ? 'Simpan Perubahan' : 'Simpan Soal');
    bukaModal('modal-soal');
    document.getElementById('form-soal').elements.soalTeks.focus();
}

function simpanFormSoal(lagi = false) {
    const form = document.getElementById('form-soal');
    const { jenis, id, editIndex } = kelolaSoalView;
    const soal = bacaFormSoal(form);
    const hasil = editIndex === null ? tambahSoalItem(jenis, id, soal) : ubahSoalItem(jenis, id, editIndex, soal);
    if (!hasil.ok) {
        tampilkanAlertSoal(hasil.errors ? '' : hasil.pesan);
        if (hasil.errors) {
            tampilkanErrorSoal(form, hasil.errors);
        }
        return;
    }
    const nomor = editIndex === null ? hasil.soal.length : editIndex + 1;
    renderKelolaSoal();
    tampilkanPesan('success', editIndex === null
        ? `Soal ${nomor} berhasil ditambahkan. Total ${hasil.soal.length} soal.`
        : `Perubahan soal ${nomor} berhasil disimpan.`);
    if (lagi) {
        // Form dikosongkan untuk soal berikutnya dengan tipe yang sama
        isiFormSoal(null, soal.tipe);
        setText('modal-soal-title', `Tambah Soal ${hasil.soal.length + 1}`);
        form.elements.soalTeks.focus();
        return;
    }
    tutupModal();
    const kartu = document.getElementById(`soal-${nomor}`);
    if (kartu) {
        kartu.scrollIntoView({ block: 'nearest' });
    }
}

function hapusSoalKelola(index) {
    const { jenis, id } = kelolaSoalView;
    const data = getItemKelolaSoal(jenis, id);
    const s = data ? data.soal[index] : null;
    if (!s) {
        return;
    }
    konfirmasiHapusData({
        judul: 'Hapus Soal?',
        jenis: 'soal',
        nama: `${index + 1}. ${ringkasTeks(s.teks)}`,
        dampak: data.terbit ? `${data.label} ini sudah diterbitkan. Peserta yang mulai mengerjakan setelah ini tidak lagi mendapat soal ini.` : '',
        onConfirm: () => {
            const hasil = hapusSoalItem(jenis, id, index);
            if (!hasil.ok) {
                tampilkanPesan('error', hasil.pesan);
                return;
            }
            renderKelolaSoal();
            tampilkanPesan('success', `Soal ${index + 1} berhasil dihapus. Sisa ${hasil.soal.length} soal.`);
        },
    });
}

function geserSoalKelola(index, arah) {
    const hasil = geserSoalItem(kelolaSoalView.jenis, kelolaSoalView.id, index, arah);
    if (!hasil.ok) {
        tampilkanPesan('error', hasil.pesan);
        return;
    }
    renderKelolaSoal();
    tampilkanPesan('success', `Soal ${index + 1} dipindahkan menjadi soal ${index + arah + 1}.`);
    // Fokus tetap pada tombol yang sama di posisi barunya (agar mudah dipindah lagi dengan keyboard)
    const tombol = document.querySelector(`#ks-soal-list [data-action="${arah < 0 ? 'naik' : 'turun'}"][data-index="${index + arah}"]`);
    if (tombol && !tombol.disabled) {
        tombol.focus();
    } else {
        const kartu = document.getElementById(`soal-${index + arah + 1}`);
        if (kartu) {
            kartu.querySelector('[data-action="edit"]').focus();
        }
    }
}

function initKelolaSoalPage() {
    initModalUmum();
    const params = new URLSearchParams(window.location.search);
    kelolaSoalView.jenis = params.get('jenis');
    kelolaSoalView.id = Number(params.get('id'));
    const data = renderKelolaSoal();
    const user = getCurrentUser();
    if (!data) {
        document.getElementById('ks-kembali-tidak-ada').href = user && user.role === 'pengajar' ? 'dashboard-pengajar.html' : 'pertemuan.html';
        return;
    }
    document.title = `Kelola Soal: ${data.item.judul} — DelLearn`;
    if (params.get('baru') === '1') {
        tampilkanPesan('success', `"${data.item.judul}" berhasil dibuat sebagai ${data.item.status}. ${data.jenis === 'kuis' ? 'Buat soal kuis satu per satu dengan tombol "Tambah Soal"' : data.jenis === 'latihan' ? 'Tulis soal latihan satu per satu (Pilihan Ganda / Benar-Salah)' : 'Tambahkan soal di bawah ini'}${data.jenis === 'pretest' ? ` (tepat ${PRETEST_JUMLAH_SOAL} soal)` : data.jenis === 'latihan' || data.jenis === 'kuis' ? ` (perlu ${data.target} soal)` : ''}, lalu ubah status menjadi Aktif agar terlihat peserta.`);
    }
    const form = document.getElementById('form-soal');
    form.elements.soalTipe.innerHTML = Object.keys(TIPE_SOAL)
        .filter(t => t !== 'jodoh' || data.bolehJodoh)
        .map(t => `<option value="${t}">${TIPE_SOAL[t]}</option>`).join('');

    document.getElementById('btn-tambah-soal').addEventListener('click', () => {
        sembunyikanPesan();
        bukaFormSoal();
    });
    document.getElementById('btn-preview-soal').addEventListener('click', event => {
        if (event.currentTarget.getAttribute('aria-disabled') === 'true') {
            event.preventDefault();
            tampilkanPesan('error', 'Belum ada soal untuk dipratinjau. Tambahkan soal terlebih dahulu.');
        }
    });
    document.getElementById('ks-soal-list').addEventListener('click', event => {
        const tombol = event.target.closest('button[data-action]');
        if (!tombol || tombol.disabled) {
            return;
        }
        const index = Number(tombol.dataset.index);
        sembunyikanPesan();
        if (tombol.dataset.action === 'edit') {
            bukaFormSoal(index);
        } else if (tombol.dataset.action === 'hapus') {
            hapusSoalKelola(index);
        } else if (tombol.dataset.action === 'naik') {
            geserSoalKelola(index, -1);
        } else if (tombol.dataset.action === 'turun') {
            geserSoalKelola(index, 1);
        }
    });

    form.addEventListener('submit', event => {
        event.preventDefault();
        simpanFormSoal(false);
    });
    document.getElementById('btn-simpan-soal-lagi').addEventListener('click', () => simpanFormSoal(true));
    saatNilaiBerubah(form.elements.soalTipe, () => {
        tampilkanGrupTipe(form.elements.soalTipe.value);
        tampilkanErrorSoal(form, {});
        tampilkanAlertSoal('');
    });
    document.getElementById('btn-tambah-pasangan').addEventListener('click', () => {
        const pasangan = bacaPasanganEditor();
        if (pasangan.length < JODOH_MAKS) {
            renderEditorJodoh([...pasangan, { kiri: '', kanan: '' }]);
            const baris = document.querySelectorAll('#soal-jodoh-editor [data-sisi="kiri"]');
            baris[baris.length - 1].focus();
        }
    });
    document.getElementById('soal-jodoh-editor').addEventListener('click', event => {
        const tombol = event.target.closest('button[data-hapus-pasangan]');
        if (tombol && !tombol.disabled) {
            renderEditorJodoh(bacaPasanganEditor().filter((_, i) => i !== Number(tombol.dataset.hapusPasangan)));
            document.getElementById('btn-tambah-pasangan').focus();
        }
    });
    // Setelah Simpan ditekan, error diperbarui saat bagian yang salah diperbaiki
    form.addEventListener('input', () => {
        const adaError = form.querySelector('.is-invalid') || ['soalOpsi-error', 'soalPasangan-error', 'soalKunci-error'].some(idErr => document.getElementById(idErr).textContent);
        if (adaError) {
            tampilkanErrorSoalTanpaFokus(form, validateSoalEditor(kelolaSoalView.jenis, bacaFormSoal(form)));
        }
    });
    form.addEventListener('change', event => {
        if (event.target.name === 'soalKunciPg' || event.target.name === 'soalKunciBs') {
            setText('soalKunci-error', '');
            document.getElementById('soal-opsi-editor').classList.remove('is-invalid');
            document.querySelector('#soal-grup-bs .pilih-bs').classList.remove('is-invalid');
        }
    });
    // Latihan baru: Pengajar langsung menulis soal pertama (form Tambah Soal terbuka)
    if (params.get('baru') === '1' && data.jenis === 'latihan' && !data.soal.length) {
        bukaFormSoal();
    }
}

/* =========================
   19. NAVIGASI: BREADCRUMB, RIWAYAT SESI & TOMBOL KEMBALI
   - Breadcrumb dibangun dari konteks halaman (bukan teks tetap), setiap bagian yang punya alamat dapat diklik:
     Dashboard › Kelas Saya › Matematika SMP Kelas 8 › Pertemuan 1 › Pretest › Hasil
   - Riwayat sesi (sessionStorage dellearn.navigation.v1): { url, label, waktu }. Halaman sama berurutan tidak
     dicatat ganda; membuka kembali halaman yang sudah ada di riwayat memotong riwayat sesudahnya (seperti tumpukan),
     sehingga klik breadcrumb / Kembali tidak menambah entri duplikat.
   - Tombol "← Kembali" menuju halaman sebelumnya di riwayat; bila tidak ada, ke induk di breadcrumb.
     Tidak memakai history.back(), sehingga tidak pernah keluar dari alur DelLearn.
========================= */
const NAV_KEY = 'dellearn.navigation.v1';
const NAV_MAKS = 15;
let halamanDialihkan = false;

// Halaman yang menampilkan tombol ← Kembali
const HALAMAN_KEMBALI = ['kelas-saya', 'pertemuan-saya', 'baca-modul', 'kerjakan', 'aktivitas', 'tugas-saya', 'modul-saya', 'aktivitas-saya',
    'latihan-saya', 'kuis-saya', 'to-pts-saya', 'to-pas-saya', 'nilai-saya', 'kelola-soal', 'pengumpulan-tugas', 'pemantauan', 'detail-kelas', 'form-kelas', 'evaluasi'];

// Alamat dari folder utama project → alamat relatif terhadap halaman ini ("pages/x.html" dari pages/ → "x.html")
function alamatRelatif(path) {
    return diFolderPages() && path.startsWith('pages/') ? path.slice('pages/'.length) : urlHalaman(path);
}

// Alamat halaman ini relatif terhadap folder utama project, mis. "pages/pertemuan-saya.html?id=3"
function alamatHalamanIni() {
    const nama = window.location.pathname.split('/').pop() || 'index.html';
    return `${diFolderPages() ? 'pages/' : ''}${nama}${window.location.search}`;
}

function bacaRiwayatNav() {
    try {
        const list = JSON.parse(window.sessionStorage.getItem(NAV_KEY) || '[]');
        return Array.isArray(list) ? list.filter(x => x && typeof x.url === 'string') : [];
    } catch (error) {
        return [];
    }
}

function tulisRiwayatNav(list) {
    try {
        window.sessionStorage.setItem(NAV_KEY, JSON.stringify(list));
    } catch (error) {
        // sessionStorage tidak tersedia: tombol Kembali memakai induk breadcrumb
    }
}

// Catat halaman ini ke riwayat (dipanggil sekali per halaman setelah isi siap). Hasil: riwayat terbaru.
function catatNavigasi(label) {
    const url = alamatHalamanIni();
    let list = bacaRiwayatNav();
    const ada = list.findIndex(x => x.url === url);
    if (ada !== -1) {
        list = list.slice(0, ada + 1);
        list[ada] = { ...list[ada], label, waktu: Date.now() };
    } else {
        list.push({ url, label, waktu: Date.now() });
    }
    list = list.slice(-NAV_MAKS);
    tulisRiwayatNav(list);
    return list;
}

// Jalur breadcrumb halaman ini: [{ label, href? }] (href relatif terhadap folder utama; bagian terakhir tanpa href)
function jalurBreadcrumb(user) {
    const page = document.body.dataset.page;
    const params = new URLSearchParams(window.location.search);
    const P = 'pages/';
    if (user.role === 'peserta') {
        const ctx = getKonteksPeserta();
        const dasar = [{ label: 'Dashboard', href: `${P}dashboard-peserta.html` }];
        const kelas = ctx.kelas ? [{ label: 'Kelas Saya', href: `${P}kelas-saya.html` }, { label: ctx.kelas.nama, href: `${P}kelas-saya.html` }] : [{ label: 'Kelas Saya', href: `${P}kelas-saya.html` }];
        const pertemuan = id => {
            const p = ctx.pertemuanMap[id];
            return p ? [...kelas, { label: `Pertemuan ${p.nomor}`, href: `${P}pertemuan-saya.html?id=${p.id}` }] : kelas;
        };
        const daftar = { 'modul-saya': 'Modul', 'aktivitas-saya': 'Aktivitas Interaktif', 'latihan-saya': 'Latihan Soal', 'kuis-saya': 'Kuis', 'tugas-saya': 'Tugas', 'to-pts-saya': 'TO PTS', 'to-pas-saya': 'TO PAS', 'nilai-saya': 'Nilai Saya' };
        if (page === 'dashboard-peserta') {
            return [{ label: 'Dashboard' }];
        }
        if (page === 'kelas-saya') {
            return [...dasar, ...kelas.slice(0, 1), ...(ctx.kelas ? [{ label: ctx.kelas.nama }] : [])];
        }
        if (page === 'pertemuan-saya') {
            return [...dasar, ...pertemuan(Number(params.get('id')))];
        }
        if (page === 'baca-modul') {
            const m = getModulPeserta(ctx).find(x => x.id === Number(params.get('id')));
            return [...dasar, ...(m ? pertemuan(m.pertemuanId) : kelas), { label: m ? `Modul: ${m.judul}` : 'Modul' }];
        }
        if (page === 'aktivitas') {
            const e = getEvaluasiById(params.get('id'));
            return [...dasar, ...(e ? pertemuan(e.pertemuanId) : kelas), { label: 'Aktivitas Interaktif', href: `${P}aktivitas-saya.html` }, { label: e ? e.judul : 'Aktivitas' }];
        }
        if (page === 'kerjakan') {
            const jenis = params.get('jenis');
            const data = LABEL_JENIS_KERJA[jenis] ? getItemPengerjaan(jenis, params.get('id')) : null;
            const label = LABEL_JENIS_KERJA[jenis] || 'Pengerjaan';
            const hasil = kerjaView.tampilHasil ? [{ label: 'Hasil' }] : [];
            const diri = { label, ...(hasil.length ? { href: alamatHalamanIni() } : {}) };
            if (jenis === 'to' && data) {
                const t = `to-${data.item.jenis.toLowerCase()}-saya.html`;
                return [...dasar, { label: `TO ${data.item.jenis}`, href: `${P}${t}` }, { ...diri, label: data.item.judul }, ...hasil];
            }
            return [...dasar, ...(data ? pertemuan(data.pertemuanId) : kelas), diri, ...hasil];
        }
        if (page === 'tugas-saya' && tugasSayaView.dipilih) {
            const t = getTugasById(tugasSayaView.dipilih);
            return [...dasar, ...(t ? pertemuan(t.pertemuanId) : []), { label: 'Tugas', href: `${P}tugas-saya.html` }, { label: t ? t.judul : 'Tugas' }];
        }
        if (daftar[page]) {
            return [...dasar, { label: daftar[page] }];
        }
        return null;
    }
    // Pengajar & Admin: halaman pengelolaan konten pertemuan
    const dash = { label: 'Dashboard', href: user.role === 'admin' ? 'index.html' : `${P}dashboard-pengajar.html` };
    const kelasDetail = kelasId => {
        const k = getKelasById(kelasId);
        return k ? [{ label: k.nama, href: `${P}detail-kelas.html?id=${k.id}` }] : [];
    };
    const pertemuanStaf = pid => {
        const p = pid ? getPertemuanById(pid) : null;
        return p ? [{ label: `Pertemuan ${p.nomor}`, href: `${P}pertemuan.html?id=${p.id}` }] : [];
    };
    if (page === 'kelola-soal' || ((page === 'kerjakan' || page === 'aktivitas') && user.role !== 'peserta')) {
        const jenis = page === 'aktivitas' ? 'aktivitas' : params.get('jenis');
        const item = page === 'aktivitas' ? getEvaluasiById(params.get('id')) : jenis === 'kuis' ? getKuisById(params.get('id')) : jenis === 'to' ? getTOById(params.get('id')) : getEvaluasiById(params.get('id'));
        if (!item) {
            return null;
        }
        const daftar = JENIS_EVALUASI[jenis] ? { label: JENIS_EVALUASI[jenis].label, href: `${P}evaluasi.html?jenis=${jenis}` }
            : jenis === 'kuis' ? { label: 'Kuis', href: `${P}kuis.html` } : { label: `TO ${item.jenis}`, href: `${P}to-${String(item.jenis).toLowerCase()}.html` };
        const kelola = page === 'kelola-soal' ? [{ label: 'Kelola Soal' }]
            : params.get('dari') === 'soal' ? [{ label: 'Kelola Soal', href: `${P}kelola-soal.html?jenis=${jenis}&id=${item.id}` }, { label: 'Preview' }] : [{ label: `Preview: ${item.judul}` }];
        return [dash, ...kelasDetail(item.kelasId), ...pertemuanStaf(item.pertemuanId), daftar, ...kelola];
    }
    if (page === 'pengumpulan-tugas') {
        const t = getTugasById(params.get('id'));
        return t ? [dash, ...kelasDetail(t.kelasId), ...pertemuanStaf(t.pertemuanId), { label: 'Tugas', href: `${P}tugas.html?kelas=${t.kelasId}` }, { label: `Pengumpulan: ${t.judul}` }] : null;
    }
    if (page === 'pemantauan') {
        const jenis = params.get('jenis');
        const item = JENIS_PEMANTAUAN[jenis] ? itemPemantauan(jenis, params.get('id')) : null;
        return item ? [dash, ...kelasDetail(item.kelasId), ...pertemuanStaf(item.pertemuanId), { label: JENIS_PEMANTAUAN[jenis].label, href: `${P}${JENIS_PEMANTAUAN[jenis].daftar}` }, { label: `Pemantauan: ${item.judul}` }] : null;
    }
    return null;
}

// Render breadcrumb + tombol ← Kembali. Dipanggil setelah isi halaman siap (dan ulang bila jalur berubah, mis. "Hasil")
function renderNavigasi(user, catat = true) {
    if (!user || document.body.dataset.page === 'login') {
        return;
    }
    const jalur = jalurBreadcrumb(user);
    const content = document.querySelector('.content');
    let nav = content ? content.querySelector('.breadcrumb') : null;
    if (jalur && content) {
        if (!nav) {
            nav = document.createElement('nav');
            nav.className = 'breadcrumb';
            nav.setAttribute('aria-label', 'Breadcrumb');
            content.prepend(nav);
        }
        nav.innerHTML = `<ol>${jalur.map((b, i) => (i < jalur.length - 1 && b.href
            ? `<li><a href="${escapeHtml(alamatRelatif(b.href))}">${escapeHtml(b.label)}</a></li>`
            : `<li${i === jalur.length - 1 ? ' aria-current="page"' : ''}>${escapeHtml(b.label)}</li>`)).join('')}</ol>`;
    }
    // Label riwayat = bagian terakhir breadcrumb (atau judul halaman)
    const label = jalur ? jalur[jalur.length - 1].label : document.title.replace(/ — DelLearn.*$/, '');
    const riwayat = catat ? catatNavigasi(label) : bacaRiwayatNav();
    const page = document.body.dataset.page;
    if (!HALAMAN_KEMBALI.includes(page) || !content) {
        return;
    }
    const sebelum = riwayat.length > 1 ? riwayat[riwayat.length - 2] : null;
    const induk = jalur ? [...jalur].reverse().find((b, i) => i > 0 && b.href) : null;
    const tujuan = sebelum ? { href: sebelum.url, label: sebelum.label } : induk ? { href: induk.href, label: induk.label } : null;
    if (!tujuan) {
        return;
    }
    let baris = content.querySelector('.nav-baris');
    if (!baris) {
        baris = document.createElement('div');
        baris.className = 'nav-baris';
        (nav || content.firstElementChild).insertAdjacentElement(nav ? 'beforebegin' : 'beforebegin', baris);
        if (nav) {
            baris.appendChild(nav);
        }
    }
    let tombol = baris.querySelector('.btn-kembali-nav');
    if (!tombol) {
        tombol = document.createElement('a');
        tombol.className = 'btn btn-secondary btn-small btn-kembali-nav';
        baris.prepend(tombol);
    }
    tombol.href = alamatRelatif(tujuan.href);
    tombol.innerHTML = `${iconHtml('chevron-left', '')}<span>Kembali</span>`;
    tombol.title = `Kembali ke ${tujuan.label}`;
    tombol.setAttribute('aria-label', `Kembali ke ${tujuan.label}`);
}

/* =========================
   18. AKTIVITAS INTERAKTIF — PEMUTAR (aktivitas.html?id=N)
   Peserta: kerjakan → Periksa → ✓ Benar! / ↻ Coba lagi (boleh diulang, nilai terbaik disimpan).
   Pengajar/Admin: pratinjau (tidak disimpan). Semua interaksi bisa dengan klik/ketuk (ponsel);
   pengelompokan & susun urutan juga mendukung seret (drag & drop) di desktop.
========================= */

// Alur halaman: belum pernah dikerjakan → panel "Mulai Aktivitas"; sudah pernah → RINGKASAN (bukan langsung soal);
// mengulang hanya lewat tombol "Coba Lagi" + konfirmasi. Skor terbaik tidak pernah hilang.
const aktView = { e: null, preview: false, pesertaId: null, state: null, cek: null, percobaan: 0, solusi: false, timer: null, mulaiMs: null, lihatHasil: false };

// Acak tetap (bukan acak setiap render): mulberry32
function acakTetap(benih) {
    let a = benih >>> 0;
    return () => {
        a = (a + 0x6D2B79F5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// Urutan indeks teracak yang dijamin tidak sama dengan urutan asli (bila n > 1)
function indeksAcak(n, benih) {
    const r = acakTetap(benih);
    const idx = [...Array(n).keys()];
    for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(r() * (i + 1));
        [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    if (n > 1 && idx.every((v, i) => v === i)) {
        idx.push(idx.shift());
    }
    return idx;
}

// Gambar kartu: emoji/teks atau data URL gambar unggahan (tidak pernah tautan gambar rusak)
function gambarKartuHtml(g, alt) {
    return /^data:image\//.test(g)
        ? `<img src="${escapeHtml(g)}" alt="${escapeHtml(alt)}" class="akt-gambar-img">`
        : `<span class="akt-gambar-emoji" aria-hidden="true">${escapeHtml(g)}</span>`;
}

const AKT_RENDER = {
    matching: {
        awal: (e, benih) => ({ pasang: e.konten.pasangan.map(() => null), pilihKiri: null, urutKanan: indeksAcak(e.konten.pasangan.length, benih) }),
        lengkap: s => s.pasang.every(x => x !== null),
        jawaban: s => s.pasang,
        solusi: (e, s) => { s.pasang = e.konten.pasangan.map((_, i) => i); },
        html: (e, s, cek) => {
            const p = e.konten.pasangan;
            const dipakai = new Set(s.pasang.filter(x => x !== null));
            const kiri = p.map((x, i) => {
                const st = cek ? (cek.detail[i] ? ' is-benar' : ' is-salah') : s.pilihKiri === i ? ' is-aktif' : s.pasang[i] !== null ? ' is-terisi' : '';
                return `<button type="button" class="akt-kartu akt-kiri${st}" data-kiri="${i}"${cek ? ' disabled' : ''} aria-pressed="${s.pilihKiri === i}">
                    <span class="akt-nomor">${i + 1}</span><span class="akt-kartu-teks">${escapeHtml(x.kiri)}</span>
                    <span class="akt-pasangan">${s.pasang[i] !== null ? `→ ${escapeHtml(p[s.pasang[i]].kanan)}` : 'Ketuk lalu pilih pasangannya'}</span>
                </button>`;
            }).join('');
            const kanan = s.urutKanan.map(i => `<button type="button" class="akt-kartu akt-kanan${dipakai.has(i) ? ' is-dipakai' : ''}" data-kanan="${i}"${cek ? ' disabled' : ''}>
                    <span class="akt-kartu-teks">${escapeHtml(p[i].kanan)}</span></button>`).join('');
            return `<div class="akt-matching"><div class="akt-kolom" aria-label="Istilah"><p class="akt-kolom-judul">Istilah</p>${kiri}</div>
                <div class="akt-kolom" aria-label="Pasangan"><p class="akt-kolom-judul">Pasangan</p>${kanan}</div></div>`;
        },
        klik: (s, el) => {
            if (el.dataset.kiri !== undefined) {
                const i = Number(el.dataset.kiri);
                if (s.pasang[i] !== null && s.pilihKiri !== i) {
                    s.pasang[i] = null;   // ketuk istilah yang sudah berpasangan → lepas pasangan
                }
                s.pilihKiri = s.pilihKiri === i ? null : i;
            } else if (el.dataset.kanan !== undefined && s.pilihKiri !== null) {
                const k = Number(el.dataset.kanan);
                s.pasang = s.pasang.map(x => (x === k ? null : x));
                s.pasang[s.pilihKiri] = k;
                s.pilihKiri = null;
            }
        },
    },
    drag_drop: {
        awal: (e, benih) => ({ letak: e.konten.item.map(() => null), pilih: null, urut: indeksAcak(e.konten.item.length, benih) }),
        lengkap: s => s.letak.every(x => x !== null),
        jawaban: s => s.letak,
        solusi: (e, s) => { s.letak = e.konten.item.map(it => it.kategori); },
        html: (e, s, cek) => {
            const kartu = i => {
                const st = cek ? (cek.detail[i] ? ' is-benar' : ' is-salah') : s.pilih === i ? ' is-aktif' : '';
                return `<button type="button" class="akt-chip${st}" data-item="${i}" draggable="${cek ? 'false' : 'true'}"${cek ? ' disabled' : ''} aria-pressed="${s.pilih === i}">${escapeHtml(e.konten.item[i].teks)}</button>`;
            };
            const kolam = s.urut.filter(i => s.letak[i] === null);
            return `<div class="akt-kolam akt-zona" data-zona="kolam" aria-label="Kartu yang belum dikelompokkan">
                    ${kolam.length ? kolam.map(kartu).join('') : '<span class="cell-muted">Semua kartu sudah dikelompokkan.</span>'}</div>
                <div class="akt-kelompok-grid">${e.konten.kategori.map((nama, k) => `
                    <div class="akt-kelompok akt-zona" data-zona="${k}" role="group" aria-label="Kelompok ${escapeHtml(nama)}">
                        <p class="akt-kelompok-judul">${escapeHtml(nama)}</p>
                        <div class="akt-kelompok-isi">${s.urut.filter(i => s.letak[i] === k).map(kartu).join('') || '<span class="akt-kosong">Ketuk kartu lalu ketuk di sini</span>'}</div>
                    </div>`).join('')}</div>`;
        },
        klik: (s, el) => {
            if (el.dataset.item !== undefined) {
                const i = Number(el.dataset.item);
                s.pilih = s.pilih === i ? null : i;
                return;
            }
            const zona = el.closest('[data-zona]');
            if (zona && s.pilih !== null) {
                s.letak[s.pilih] = zona.dataset.zona === 'kolam' ? null : Number(zona.dataset.zona);
                s.pilih = null;
            }
        },
        lepas: (s, item, zona) => { s.letak[item] = zona === 'kolam' ? null : Number(zona); s.pilih = null; },
    },
    ordering: {
        awal: (e, benih) => ({ urut: indeksAcak(e.konten.urutan.length, benih) }),
        lengkap: () => true,
        jawaban: s => s.urut,
        solusi: (e, s) => { s.urut = e.konten.urutan.map((_, i) => i); },
        html: (e, s, cek) => `<ol class="akt-urut">${s.urut.map((asli, pos) => {
            const st = cek ? (cek.detail[pos] ? ' is-benar' : ' is-salah') : '';
            return `<li class="akt-urut-item${st}" data-pos="${pos}" draggable="${cek ? 'false' : 'true'}">
                <span class="akt-nomor">${pos + 1}</span><span class="akt-kartu-teks">${escapeHtml(e.konten.urutan[asli])}</span>
                <span class="akt-urut-tombol">
                    <button type="button" class="icon-btn icon-btn-ghost icon-btn-small" data-geser="-1" data-pos="${pos}" aria-label="Naikkan langkah ${pos + 1}"${cek || pos === 0 ? ' disabled' : ''}>${iconHtml('arrow-up')}</button>
                    <button type="button" class="icon-btn icon-btn-ghost icon-btn-small" data-geser="1" data-pos="${pos}" aria-label="Turunkan langkah ${pos + 1}"${cek || pos === s.urut.length - 1 ? ' disabled' : ''}>${iconHtml('arrow-down')}</button>
                </span></li>`;
        }).join('')}</ol>`,
        klik: (s, el) => {
            if (el.dataset.geser !== undefined) {
                const pos = Number(el.dataset.pos);
                const ke = pos + Number(el.dataset.geser);
                [s.urut[pos], s.urut[ke]] = [s.urut[ke], s.urut[pos]];
                s.fokus = `[data-geser="${el.dataset.geser}"][data-pos="${ke}"]`;
            }
        },
        lepas: (s, dari, ke) => { const [x] = s.urut.splice(dari, 1); s.urut.splice(ke, 0, x); },
    },
    true_false: {
        awal: e => ({ jawab: e.konten.pernyataan.map(() => null) }),
        lengkap: s => s.jawab.every(x => x !== null),
        jawaban: s => s.jawab,
        solusi: (e, s) => { s.jawab = e.konten.pernyataan.map(p => p.benar); },
        html: (e, s, cek) => `<div class="akt-tf-grid">${e.konten.pernyataan.map((p, i) => {
            const st = cek ? (cek.detail[i] ? ' is-benar' : ' is-salah') : '';
            return `<div class="akt-tf${st}">
                <p class="akt-tf-teks">${escapeHtml(p.teks)}</p>
                <div class="akt-tf-tombol">
                    <button type="button" class="akt-tf-btn akt-tf-benar${s.jawab[i] === true ? ' is-dipilih' : ''}" data-tf="${i}" data-nilai="true" aria-pressed="${s.jawab[i] === true}"${cek ? ' disabled' : ''}>✓ BENAR</button>
                    <button type="button" class="akt-tf-btn akt-tf-salah${s.jawab[i] === false ? ' is-dipilih' : ''}" data-tf="${i}" data-nilai="false" aria-pressed="${s.jawab[i] === false}"${cek ? ' disabled' : ''}>✕ SALAH</button>
                </div>
                ${cek && p.penjelasan ? `<p class="akt-penjelasan">${escapeHtml(p.penjelasan)}</p>` : ''}
            </div>`;
        }).join('')}</div>`,
        klik: (s, el) => { if (el.dataset.tf !== undefined) { s.jawab[Number(el.dataset.tf)] = el.dataset.nilai === 'true'; } },
    },
    image_selection: {
        awal: (e, benih) => ({ pilih: [], urut: indeksAcak(e.konten.pilihan.length, benih) }),
        lengkap: s => s.pilih.length > 0,
        jawaban: s => s.pilih,
        solusi: (e, s) => { s.pilih = e.konten.pilihan.map((p, i) => (p.benar ? i : null)).filter(i => i !== null); },
        html: (e, s, cek) => `<p class="akt-pertanyaan">${escapeHtml(e.konten.pertanyaan)}</p><div class="akt-gambar-grid">${s.urut.map(i => {
            const p = e.konten.pilihan[i];
            const dipilih = s.pilih.includes(i);
            const st = cek ? (cek.detail[i] ? (dipilih ? ' is-benar' : '') : ' is-salah') : '';
            return `<button type="button" class="akt-gambar${dipilih ? ' is-dipilih' : ''}${st}" data-gambar="${i}" aria-pressed="${dipilih}"${cek ? ' disabled' : ''}>
                ${gambarKartuHtml(p.gambar, p.label)}<span class="akt-gambar-label">${escapeHtml(p.label)}</span>
                ${dipilih ? '<span class="akt-centang" aria-hidden="true">✓</span>' : ''}</button>`;
        }).join('')}</div>`,
        klik: (s, el) => {
            if (el.dataset.gambar !== undefined) {
                const i = Number(el.dataset.gambar);
                s.pilih = s.pilih.includes(i) ? s.pilih.filter(x => x !== i) : [...s.pilih, i];
            }
        },
    },
    sentence_builder: {
        awal: (e, benih) => ({
            kalimat: e.konten.kalimat.map((k, n) => {
                const kata = [...kataKalimat(k.teks), ...k.pengecoh];
                return { kata, bank: indeksAcak(kata.length, benih + n * 7), susun: [] };
            }),
        }),
        lengkap: s => s.kalimat.every(k => k.susun.length > 0),
        jawaban: s => s.kalimat.map(k => k.susun.map(i => k.kata[i])),
        solusi: (e, s) => { s.kalimat.forEach((k, n) => { k.susun = kataKalimat(e.konten.kalimat[n].teks).map((_, i) => i); }); },
        html: (e, s, cek) => s.kalimat.map((k, n) => {
            const st = cek ? (cek.detail[n] ? ' is-benar' : ' is-salah') : '';
            return `<div class="akt-kalimat${st}">
                <p class="akt-kolom-judul">Kalimat ${n + 1}</p>
                <div class="akt-susun" aria-label="Susunan kalimat ${n + 1}">${k.susun.length ? k.susun.map(i => `<button type="button" class="akt-chip is-terpasang" data-kal="${n}" data-lepas="${i}"${cek ? ' disabled' : ''}>${escapeHtml(k.kata[i])}</button>`).join('') : '<span class="akt-kosong">Ketuk kata di bawah untuk menyusun kalimat</span>'}</div>
                <div class="akt-bank-kata">${k.bank.filter(i => !k.susun.includes(i)).map(i => `<button type="button" class="akt-chip" data-kal="${n}" data-ambil="${i}"${cek ? ' disabled' : ''}>${escapeHtml(k.kata[i])}</button>`).join('')}</div>
            </div>`;
        }).join(''),
        klik: (s, el) => {
            if (el.dataset.kal === undefined) {
                return;
            }
            const k = s.kalimat[Number(el.dataset.kal)];
            if (el.dataset.ambil !== undefined) {
                k.susun.push(Number(el.dataset.ambil));
            } else if (el.dataset.lepas !== undefined) {
                k.susun = k.susun.filter(i => i !== Number(el.dataset.lepas));
            }
        },
    },
    find_error: {
        awal: (e, benih) => ({ butir: e.konten.butir.map((b, n) => ({ bagian: null, koreksi: '', opsi: indeksAcak(b.pilihanKoreksi.length + 1, benih + n * 5) })) }),
        lengkap: s => s.butir.every(b => b.bagian !== null && b.koreksi.trim()),
        jawaban: s => s.butir.map(b => ({ bagian: b.bagian, koreksi: b.koreksi })),
        solusi: (e, s) => { s.butir.forEach((b, n) => { b.bagian = e.konten.butir[n].salah; b.koreksi = e.konten.butir[n].koreksi; }); },
        html: (e, s, cek) => s.butir.map((b, n) => {
            const asli = e.konten.butir[n];
            const st = cek ? (cek.detail[n] ? ' is-benar' : ' is-salah') : '';
            const pilihan = [asli.koreksi, ...asli.pilihanKoreksi];
            return `<div class="akt-error${st}">
                <p class="akt-kolom-judul">Pernyataan ${n + 1} · ketuk bagian yang salah</p>
                <div class="akt-segmen">${asli.bagian.map((teks, i) => `<button type="button" class="akt-chip${b.bagian === i ? ' is-aktif' : ''}" data-butir="${n}" data-bagian="${i}" aria-pressed="${b.bagian === i}"${cek ? ' disabled' : ''}>${escapeHtml(teks)}</button>`).join('')}</div>
                ${b.bagian !== null ? `<div class="akt-koreksi"><p class="akt-kolom-judul">Perbaikannya:</p>${asli.pilihanKoreksi.length
                    ? `<div class="akt-segmen">${b.opsi.map(i => `<button type="button" class="akt-chip${b.koreksi === pilihan[i] ? ' is-aktif' : ''}" data-butir="${n}" data-koreksi="${escapeHtml(pilihan[i])}"${cek ? ' disabled' : ''}>${escapeHtml(pilihan[i])}</button>`).join('')}</div>`
                    : `<input type="text" class="form-control akt-koreksi-input" data-butir="${n}" value="${escapeHtml(b.koreksi)}" placeholder="Tulis perbaikannya" aria-label="Perbaikan pernyataan ${n + 1}"${cek ? ' disabled' : ''}>`}</div>` : ''}
                ${cek && asli.penjelasan ? `<p class="akt-penjelasan">${escapeHtml(asli.penjelasan)}</p>` : ''}
            </div>`;
        }).join(''),
        klik: (s, el) => {
            if (el.dataset.butir === undefined) {
                return;
            }
            const b = s.butir[Number(el.dataset.butir)];
            if (el.dataset.bagian !== undefined) {
                b.bagian = Number(el.dataset.bagian);
            } else if (el.dataset.koreksi !== undefined) {
                b.koreksi = el.dataset.koreksi;
            }
        },
    },
    challenge: {
        awal: e => ({ mulai: false, nomor: 0, jawab: e.soal.map(() => null), sisa: Number(e.konten.durasiDetik) || 60, habis: false }),
        lengkap: s => s.mulai && (s.habis || s.jawab.every(x => x !== null)),
        jawaban: s => s.jawab,
        solusi: (e, s) => { s.jawab = e.soal.map(x => x.kunci); s.mulai = true; s.nomor = e.soal.length; },
        html: (e, s, cek) => {
            if (!s.mulai) {
                return `<div class="akt-challenge-mulai"><p class="akt-challenge-besar">⚡ Jawab ${e.soal.length} tantangan dalam ${s.sisa} detik!</p>
                    <p class="cell-meta">Waktu berjalan setelah tombol Mulai ditekan. Jawaban langsung lanjut ke tantangan berikutnya.</p>
                    <button type="button" class="btn btn-primary" data-mulai="1">Mulai Tantangan</button></div>`;
            }
            if (cek || s.nomor >= e.soal.length) {
                return `<ol class="akt-challenge-rekap">${e.soal.map((q, i) => {
                    const ok = cek ? cek.detail[i] : null;
                    return `<li class="${ok === null ? '' : ok ? 'is-benar' : 'is-salah'}"><span>${escapeHtml(q.teks)}</span>
                        <strong>${s.jawab[i] === null ? 'Tidak dijawab' : escapeHtml(q.opsi[s.jawab[i]])}</strong>
                        ${cek && !ok && aktView.solusi ? `<span class="cell-meta">Jawaban: ${escapeHtml(q.opsi[q.kunci])}</span>` : ''}</li>`;
                }).join('')}</ol>`;
            }
            const q = e.soal[s.nomor];
            return `<div class="akt-challenge">
                <div class="akt-challenge-kepala"><span class="badge badge-info">Tantangan ${s.nomor + 1}/${e.soal.length}</span>
                    <span class="akt-timer${s.sisa <= 10 ? ' is-warning' : ''}" id="akt-timer" role="timer">⏱ ${s.sisa} detik</span></div>
                <p class="akt-challenge-soal">${escapeHtml(q.teks)}</p>
                <div class="akt-challenge-opsi">${q.opsi.map((o, i) => `<button type="button" class="akt-tf-btn" data-cjawab="${i}">${escapeHtml(o)}</button>`).join('')}</div>
            </div>`;
        },
        klik: (s, el) => {
            if (el.dataset.mulai) {
                s.mulai = true;
                mulaiTimerTantangan();
            } else if (el.dataset.cjawab !== undefined && s.nomor < s.jawab.length) {
                s.jawab[s.nomor] = Number(el.dataset.cjawab);
                s.nomor++;
                if (s.nomor >= s.jawab.length) {
                    clearInterval(aktView.timer);
                    setTimeout(() => periksaAktivitas(), 0);
                }
            }
        },
    },
};

function mulaiTimerTantangan() {
    clearInterval(aktView.timer);
    aktView.timer = setInterval(() => {
        const s = aktView.state;
        s.sisa = Math.max(0, s.sisa - 1);
        const t = document.getElementById('akt-timer');
        if (t) {
            t.textContent = `⏱ ${s.sisa} detik`;
            t.classList.toggle('is-warning', s.sisa <= 10);
        }
        if (s.sisa === 0) {
            clearInterval(aktView.timer);
            s.habis = true;
            s.nomor = s.jawab.length;
            periksaAktivitas(true);
        }
    }, 1000);
}

function renderAktivitas() {
    const { e, state, cek } = aktView;
    const r = AKT_RENDER[e.tipe];
    const area = document.getElementById('akt-area');
    area.innerHTML = r.html(e, state, cek);
    area.dataset.tipe = e.tipe;
    if (state.fokus) {
        const el = area.querySelector(state.fokus);
        if (el && !el.disabled) {
            el.focus();
        }
        state.fokus = null;
    }
    const lengkap = r.lengkap(state);
    const periksa = document.getElementById('btn-akt-periksa');
    periksa.hidden = Boolean(cek) || (e.tipe === 'challenge' && !state.mulai);
    periksa.disabled = !lengkap;
    periksa.textContent = e.tipe === 'challenge' ? 'Selesai & Periksa' : 'Periksa Jawaban';
    document.getElementById('btn-akt-ulang').hidden = !cek || Boolean(aksesAktivitas());
    document.getElementById('btn-akt-ke-ringkasan').hidden = !cek || aktView.preview;
    document.getElementById('btn-akt-jawaban').hidden = !cek || cek.benar === cek.total || aktView.solusi;
    document.getElementById('btn-akt-lanjut').hidden = !cek;
}

// Periksa jawaban. otomatis = waktu tantangan habis
function periksaAktivitas(otomatis = false) {
    const { e, state } = aktView;
    const r = AKT_RENDER[e.tipe];
    if (!otomatis && !r.lengkap(state)) {
        return;
    }
    clearInterval(aktView.timer);
    const jawaban = r.jawaban(state);
    if (!aktView.preview) {
        // Status akses dicek ulang saat menyimpan: pertemuan yang sudah ditutup menolak hasil baru
        const detik = aktView.mulaiMs ? (Date.now() - aktView.mulaiMs) / 1000 : null;
        const h = simpanHasilAktivitas(aktView.pesertaId, e.id, jawaban, detik);
        if (!h) {
            tolakAksiAktivitas('Hasil aktivitas tidak tersimpan.');
            return;
        }
        aktView.percobaan = h.percobaan;
    }
    aktView.cek = nilaiAktivitas(e, jawaban);
    const { benar, total, skor } = aktView.cek;
    const fb = document.getElementById('akt-feedback');
    const semua = benar === total;
    fb.hidden = false;
    fb.className = `akt-feedback ${semua ? 'is-benar' : 'is-ulang'}`;
    fb.innerHTML = semua
        ? `<p class="akt-feedback-judul">✓ Benar! 🎉</p><p>Hebat, semuanya tepat (${benar}/${total}). Lanjutkan ke aktivitas berikutnya!</p>`
        : `<p class="akt-feedback-judul">↻ Coba lagi!</p><p>${otomatis ? 'Waktu habis. ' : ''}${benar} dari ${total} sudah benar (skor ${skor}). Bagian yang ditandai merah masih keliru — ayo coba lagi!</p>`;
    renderAktivitas();
    renderStatusAktivitas();
    fb.focus();
}

// Akses jadwal pertemuan aktivitas ini ('' = boleh dikerjakan). Selalu dibaca ulang dari data terbaru.
function aksesAktivitas() {
    return aktView.preview || !aktView.e ? '' : cekAksesAksiPeserta(aktView.e.pertemuanId);
}

// Pertemuan ditutup/belum dimulai: tampilkan ringkasan (atau layar mulai) tanpa tombol mengerjakan + alasannya
function tolakAksiAktivitas(awalan = '') {
    const alasan = aksesAktivitas() || 'Aktivitas tidak dapat dikerjakan.';
    clearInterval(aktView.timer);
    aktView.cek = null;
    document.getElementById('akt-feedback').hidden = true;
    renderRingkasanAktivitas();
    tampilkanPesan('error', `${awalan ? `${awalan} ` : ''}${alasan}`);
}

// Mulai satu percobaan baru (setelah "Mulai Aktivitas" atau konfirmasi "Coba Lagi")
function mulaiPercobaanAktivitas() {
    if (aksesAktivitas()) {
        tolakAksiAktivitas();
        return;
    }
    aktView.cek = null;
    aktView.solusi = false;
    aktView.mulaiMs = Date.now();
    aktView.state = AKT_RENDER[aktView.e.tipe].awal(aktView.e, aktView.e.id * 31 + (aktView.percobaan + 1) * 17);
    document.getElementById('akt-feedback').hidden = true;
    tampilBagianAktivitas('main');
    renderAktivitas();
    document.getElementById('akt-area').querySelector('button, input')?.focus();
}

// "Coba Lagi" selalu lewat konfirmasi (pratinjau Pengajar/Admin langsung)
function ulangiAktivitas() {
    if (aktView.preview) {
        mulaiPercobaanAktivitas();
        return;
    }
    konfirmasiAksi({
        judul: 'Coba Lagi?',
        pesan: 'Anda akan mengerjakan aktivitas ini kembali. Skor terbaik tetap disimpan.',
        tombol: 'Ya, Coba Lagi',
        onConfirm: mulaiPercobaanAktivitas,
    });
}

// Bagian halaman yang tampil: 'ringkasan' | 'mulai' | 'main'
function tampilBagianAktivitas(nama) {
    document.getElementById('akt-ringkasan').hidden = nama !== 'ringkasan';
    document.getElementById('akt-mulai').hidden = nama !== 'mulai';
    document.getElementById('akt-main').hidden = nama !== 'main';
    if (nama !== 'main') {
        clearInterval(aktView.timer);
    }
}

// "75 detik" → "1 menit 15 detik"
function formatDetik(detik) {
    if (detik === null || detik === undefined || !Number.isFinite(Number(detik))) {
        return '–';
    }
    const d = Math.round(Number(detik));
    const m = Math.floor(d / 60);
    return m ? `${m} menit ${d % 60} detik` : `${d} detik`;
}

// Rincian jawaban terakhir per butir: [{ label, jawab, kunci, benar }] (null bila jawaban tidak tersimpan)
function rincianJawabanAktivitas(e, jawaban) {
    if (!Array.isArray(jawaban)) {
        return null;
    }
    const k = e.konten || {};
    const j = jawaban;
    const n = nilaiAktivitas(e, j);
    const teks = v => (v === null || v === undefined || v === '' ? '–' : String(v));
    let baris;
    switch (e.tipe) {
        case 'matching': baris = k.pasangan.map((p, i) => ({ label: p.kiri, jawab: teks(k.pasangan[j[i]]?.kanan), kunci: p.kanan })); break;
        case 'drag_drop': baris = k.item.map((it, i) => ({ label: it.teks, jawab: teks(k.kategori[j[i]]), kunci: k.kategori[it.kategori] })); break;
        case 'ordering': baris = k.urutan.map((u, pos) => ({ label: `Langkah ${pos + 1}`, jawab: teks(k.urutan[j[pos]]), kunci: u })); break;
        case 'true_false': baris = k.pernyataan.map((p, i) => ({ label: p.teks, jawab: j[i] === true ? 'Benar' : j[i] === false ? 'Salah' : '–', kunci: p.benar ? 'Benar' : 'Salah' })); break;
        case 'image_selection': baris = k.pilihan.map((p, i) => ({ label: p.label, jawab: j.includes(i) ? 'Dipilih' : 'Tidak dipilih', kunci: p.benar ? 'Dipilih' : 'Tidak dipilih' })); break;
        case 'sentence_builder': baris = k.kalimat.map((s, i) => ({ label: `Kalimat ${i + 1}`, jawab: Array.isArray(j[i]) ? j[i].join(' ') || '–' : '–', kunci: s.teks })); break;
        case 'find_error': baris = k.butir.map((b, i) => ({ label: b.bagian.join(' '), jawab: j[i] && j[i].bagian !== null && j[i].bagian !== undefined ? `${b.bagian[j[i].bagian]} → ${teks(j[i].koreksi)}` : '–', kunci: `${b.bagian[b.salah]} → ${b.koreksi}` })); break;
        default: baris = (e.soal || []).map((q, i) => ({ label: q.teks, jawab: j[i] === null || j[i] === undefined ? 'Tidak dijawab' : teks(q.opsi[j[i]]), kunci: q.opsi[q.kunci] }));
    }
    return baris.map((b, i) => ({ ...b, benar: Boolean(n.detail[i]) }));
}

// Rincian jawaban percobaan terakhir sebuah aktivitas (dipakai peserta & halaman Pemantauan Pengajar/Admin)
function rincianAktivitasHtml(e, h, labelJawaban = 'Jawabanmu') {
    const rinci = rincianJawabanAktivitas(e, h.jawaban);
    return `<h3 class="materi-subjudul">Hasil percobaan terakhir · ${h.benar ?? 0} dari ${h.total ?? 0} benar (skor ${h.skorTerakhir ?? h.skor})</h3>${rinci
        ? `<ol class="akt-rincian">${rinci.map(r => `<li class="${r.benar ? 'is-benar' : 'is-salah'}"><span class="akt-rincian-label">${escapeHtml(r.label)}</span>
            <span>${escapeHtml(labelJawaban)}: <strong>${escapeHtml(r.jawab)}</strong> ${r.benar ? '<span class="badge badge-success">Benar</span>' : `<span class="badge badge-danger">Salah</span> <span class="cell-meta">Seharusnya: ${escapeHtml(r.kunci)}</span>`}</span></li>`).join('')}</ol>`
        : '<p class="cell-muted">Rincian jawaban tidak tersedia karena hasil ini berasal dari data awal.</p>'}`;
}

// Ringkasan status peserta (dibuka kembali setelah aktivitas pernah dikerjakan)
function renderRingkasanAktivitas() {
    const h = getHasil(aktView.pesertaId, 'aktivitas', aktView.e.id);
    const tutup = aksesAktivitas();
    document.getElementById('btn-akt-mulai').hidden = Boolean(tutup);
    document.getElementById('btn-akt-coba-lagi').hidden = Boolean(tutup);
    if (!h) {
        if (tutup) {
            setText('akt-mulai-teks', tutup);
        }
        tampilBagianAktivitas('mulai');
        return;
    }
    const rows = [
        ['Status', '✓ Sudah Dikerjakan'],
        ['Skor Terbaik', h.skorTerbaik ?? h.skor ?? '–'],
        ['Skor Percobaan Terakhir', h.skorTerakhir ?? h.skor ?? '–'],
        ['Percobaan', h.percobaan || 1],
        ['Waktu Pengerjaan Terakhir', formatDetik(h.durasiTerakhir)],
        ['Terakhir Dikerjakan', h.selesai ? formatTanggalWaktu(h.selesai) : '–'],
    ];
    document.getElementById('akt-ringkasan-info').innerHTML = rows.map(([l, v]) => `<div><dt>${escapeHtml(l)}</dt><dd>${escapeHtml(String(v))}</dd></div>`).join('');
    const box = document.getElementById('akt-hasil-terakhir');
    box.hidden = !aktView.lihatHasil;
    setText('btn-akt-lihat-hasil', aktView.lihatHasil ? 'Sembunyikan Hasil' : 'Lihat Hasil');
    if (aktView.lihatHasil) {
        box.innerHTML = rincianAktivitasHtml(aktView.e, h);
    }
    tampilBagianAktivitas('ringkasan');
}

function lihatJawabanAktivitas() {
    aktView.solusi = true;
    AKT_RENDER[aktView.e.tipe].solusi(aktView.e, aktView.state);
    aktView.cek = nilaiAktivitas(aktView.e, AKT_RENDER[aktView.e.tipe].jawaban(aktView.state));
    const fb = document.getElementById('akt-feedback');
    fb.className = 'akt-feedback is-info';
    fb.innerHTML = '<p class="akt-feedback-judul">💡 Ini jawaban yang benar</p><p>Pelajari jawabannya, lalu tekan "Coba Lagi" untuk mencoba sendiri.</p>';
    renderAktivitas();
}

// Status & nilai terbaik peserta
function renderStatusAktivitas() {
    const el = document.getElementById('akt-status');
    if (aktView.preview) {
        el.innerHTML = '<span class="badge badge-info">Mode Pratinjau</span>';
        return;
    }
    const h = getHasil(aktView.pesertaId, 'aktivitas', aktView.e.id);
    el.innerHTML = h ? `<span class="badge badge-success badge-dot">✓ Sudah Dikerjakan</span><span class="cell-meta">Terbaik ${h.skorTerbaik ?? h.skor} · ${h.percobaan}× percobaan</span>` : badgeStatusPeserta('Belum dikerjakan');
}

// Aktivitas lain di pertemuan yang sama (urut), untuk langkah & tombol berikutnya
function aktivitasSePertemuan(e, preview) {
    return getAllEvaluasi()
        .filter(x => x.jenis === 'aktivitas' && x.pertemuanId === e.pertemuanId && x.pertemuanId !== null && (preview || x.status === 'Aktif'))
        .sort((a, b) => (a.urutan || 0) - (b.urutan || 0) || a.id - b.id);
}

function initAktivitasPage() {
    const user = getCurrentUser();
    const id = Number(new URLSearchParams(window.location.search).get('id'));
    aktView.preview = user.role !== 'peserta';
    aktView.pesertaId = user.pesertaId;
    const e = getEvaluasiById(id);
    let boleh = Boolean(e) && e.jenis === 'aktivitas';
    if (boleh && !aktView.preview) {
        const ctx = getKonteksPeserta();
        boleh = Boolean(ctx.kelas) && e.kelasId === ctx.kelas.id && e.status === 'Aktif';
    }
    if (!boleh) {
        document.getElementById('akt-tidak-ada').hidden = false;
        document.getElementById('akt-konten').hidden = true;
        document.getElementById('akt-kembali-tidak-ada').href = aktView.preview ? 'evaluasi.html?jenis=aktivitas' : 'kelas-saya.html';
        return;
    }
    // Alur berurutan: Aktivitas hanya terbuka setelah seluruh modul pertemuannya selesai (juga lewat URL langsung)
    if (!aktView.preview && tolakBilaTerkunci('aktivitas', e.id)) {
        return;
    }
    initModalUmum();
    document.getElementById('modal-konfirmasi-ok').addEventListener('click', () => {
        const aksi = aksiKonfirmasiUmum;
        aksiKonfirmasiUmum = null;
        tutupModal();
        if (aksi) {
            aksi();
        }
    });
    aktView.e = e;
    const info = TIPE_AKTIVITAS[e.tipe];
    const p = e.pertemuanId ? getPertemuanById(e.pertemuanId) : null;
    document.title = `${info.judul} ${e.judul} — DelLearn`;
    document.getElementById('akt-preview-banner').hidden = !aktView.preview;
    setText('akt-ikon', info.ikon);
    setText('akt-eyebrow', `Aktivitas Interaktif${p ? ` · Pertemuan ${p.nomor}` : ''} · ${info.label}`);
    setText('akt-tipe-judul', info.judul);
    setText('akt-judul', e.judul);
    setText('akt-instruksi', e.instruksi || info.instruksi);
    const h = aktView.preview ? null : getHasil(aktView.pesertaId, 'aktivitas', e.id);
    aktView.percobaan = h ? h.percobaan || 0 : 0;
    renderStatusAktivitas();

    // Langkah aktivitas di pertemuan ini + tombol kembali/berikutnya
    const daftar = aktivitasSePertemuan(e, aktView.preview);
    const posisi = daftar.findIndex(x => x.id === e.id);
    const hasilList = aktView.preview ? [] : getAllHasil();
    document.getElementById('akt-langkah').innerHTML = daftar.length > 1 ? daftar.map((x, i) => {
        const selesai = hasilList.some(r => r.pesertaId === aktView.pesertaId && r.jenis === 'aktivitas' && r.itemId === x.id && r.status === 'Selesai');
        return `<a class="akt-langkah-item${x.id === e.id ? ' is-aktif' : ''}${selesai ? ' is-selesai' : ''}" href="aktivitas.html?id=${x.id}"${x.id === e.id ? ' aria-current="step"' : ''}>
            <span aria-hidden="true">${selesai ? '✓' : TIPE_AKTIVITAS[x.tipe].ikon}</span>${i + 1}. ${escapeHtml(TIPE_AKTIVITAS[x.tipe].judul)}</a>`;
    }).join('') : '';
    const kembali = aktView.preview ? `evaluasi.html?jenis=aktivitas&id=${e.id}` : p ? `pertemuan-saya.html?id=${p.id}` : 'aktivitas-saya.html';
    ['akt-kembali', 'akt-ringkasan-kembali', 'akt-mulai-kembali'].forEach(idEl => {
        document.getElementById(idEl).href = kembali;
    });
    const berikut = daftar[posisi + 1];
    const teksLanjut = berikut ? `Aktivitas Berikutnya${iconHtml('chevron-right', '')}` : `${p && !aktView.preview ? 'Kembali ke Pertemuan' : 'Selesai'}${iconHtml('chevron-right', '')}`;
    ['btn-akt-lanjut', 'btn-akt-ringkasan-lanjut'].forEach(idEl => {
        const a = document.getElementById(idEl);
        a.href = berikut ? `aktivitas.html?id=${berikut.id}` : kembali;
        a.innerHTML = teksLanjut;
    });

    aktView.state = AKT_RENDER[e.tipe].awal(e, e.id * 31 + (aktView.percobaan + 1) * 17);
    renderAktivitas();
    // Sudah pernah dikerjakan → ringkasan (tidak langsung membuka soal); belum → tombol Mulai Aktivitas
    setText('akt-mulai-teks', aktView.preview ? 'Pratinjau: tekan Mulai Aktivitas untuk melihat aktivitas seperti peserta.'
        : 'Siap? Baca instruksinya, lalu tekan Mulai Aktivitas untuk mulai mengerjakan.');
    // Ringkasan juga mengatur tombol Mulai/Coba Lagi sesuai akses jadwal pertemuan
    renderRingkasanAktivitas();
    if (aksesAktivitas()) {
        tampilkanPesan('error', aksesAktivitas());
    }
    document.getElementById('btn-akt-mulai').addEventListener('click', mulaiPercobaanAktivitas);
    document.getElementById('btn-akt-coba-lagi').addEventListener('click', ulangiAktivitas);
    document.getElementById('btn-akt-lihat-hasil').addEventListener('click', () => {
        aktView.lihatHasil = !aktView.lihatHasil;
        renderRingkasanAktivitas();
    });

    const area = document.getElementById('akt-area');
    area.addEventListener('click', event => {
        const el = event.target.closest('button, [data-zona]');
        if (!el || el.disabled || aktView.cek) {
            return;
        }
        AKT_RENDER[e.tipe].klik(aktView.state, el);
        if (!aktView.state.fokus && el.dataset) {
            // Pertahankan fokus keyboard pada kartu yang sama setelah render ulang
            const kunci = ['kiri', 'kanan', 'item', 'tf', 'gambar', 'bagian', 'ambil', 'butir', 'mulai'].find(k => el.dataset[k] !== undefined);
            if (kunci && el.dataset[kunci] !== undefined && kunci !== 'ambil') {
                aktView.state.fokus = `[data-${kunci}="${el.dataset[kunci]}"]${el.dataset.nilai ? `[data-nilai="${el.dataset.nilai}"]` : ''}`;
            }
        }
        if (!aktView.cek) {
            renderAktivitas();
        }
    });
    area.addEventListener('input', event => {
        if (event.target.matches('.akt-koreksi-input')) {
            aktView.state.butir[Number(event.target.dataset.butir)].koreksi = event.target.value;
            document.getElementById('btn-akt-periksa').disabled = !AKT_RENDER[e.tipe].lengkap(aktView.state);
        }
    });
    // Seret & lepas (desktop): kartu kelompok & langkah urutan
    area.addEventListener('dragstart', event => {
        const el = event.target.closest('[data-item], .akt-urut-item');
        if (el && !aktView.cek) {
            event.dataTransfer.setData('text/plain', el.dataset.item ?? el.dataset.pos);
            event.dataTransfer.effectAllowed = 'move';
        }
    });
    area.addEventListener('dragover', event => {
        if (event.target.closest('[data-zona], .akt-urut-item')) {
            event.preventDefault();
        }
    });
    area.addEventListener('drop', event => {
        const sumber = event.dataTransfer.getData('text/plain');
        if (sumber === '' || aktView.cek) {
            return;
        }
        if (e.tipe === 'drag_drop') {
            const zona = event.target.closest('[data-zona]');
            if (zona) {
                event.preventDefault();
                AKT_RENDER.drag_drop.lepas(aktView.state, Number(sumber), zona.dataset.zona);
                renderAktivitas();
            }
        } else if (e.tipe === 'ordering') {
            const target = event.target.closest('.akt-urut-item');
            if (target) {
                event.preventDefault();
                AKT_RENDER.ordering.lepas(aktView.state, Number(sumber), Number(target.dataset.pos));
                renderAktivitas();
            }
        }
    });
    document.getElementById('btn-akt-periksa').addEventListener('click', () => periksaAktivitas());
    document.getElementById('btn-akt-ulang').addEventListener('click', ulangiAktivitas);
    document.getElementById('btn-akt-ke-ringkasan').addEventListener('click', () => {
        aktView.lihatHasil = false;
        renderRingkasanAktivitas();
        document.getElementById('akt-ringkasan').scrollIntoView({ block: 'start' });
    });
    document.getElementById('btn-akt-jawaban').addEventListener('click', lihatJawabanAktivitas);
    document.getElementById('akt-feedback').tabIndex = -1;
}

/* =========================
   16. HALAMAN PRETEST / AKTIVITAS INTERAKTIF / LATIHAN SOAL (evaluasi.html?jenis=…)
   Daftar, cari/filter, Tambah/Edit (informasi), Hapus, Detail, Kelola Soal, Preview. Koleksi: evaluasi.
========================= */

const EVALUASI_FORM_FIELDS = ['judul', 'kelasId', 'pertemuanId', 'durasi', 'status', 'instruksi'];

// ---- Editor konten Aktivitas Interaktif (form berubah sesuai tipe) ----
const BARIS_KOSONG_AKT = {
    pasangan: () => ({ kiri: '', kanan: '' }),
    kategori: () => '',
    item: () => ({ teks: '', kategori: 0 }),
    urutan: () => '',
    pernyataan: () => ({ teks: '', benar: true, penjelasan: '' }),
    pilihan: () => ({ gambar: '', label: '', benar: false }),
    kalimat: () => ({ teks: '', pengecoh: [] }),
    butir: () => ({ bagian: [], salah: 0, koreksi: '', pilihanKoreksi: [], penjelasan: '' }),
    soal: () => ({ tipe: 'pg', teks: '', opsi: ['', '', '', ''], kunci: 0, pembahasan: '' }),
};

// Konten awal saat tipe dipilih (baris kosong sesuai batas minimum)
function kontenKosongAktivitas(tipe) {
    const n = (key, jumlah) => Array.from({ length: jumlah }, BARIS_KOSONG_AKT[key]);
    return {
        matching: { konten: { pasangan: n('pasangan', 3) } },
        drag_drop: { konten: { kategori: n('kategori', 2), item: n('item', 4) } },
        ordering: { konten: { urutan: n('urutan', 3) } },
        true_false: { konten: { pernyataan: n('pernyataan', 3) } },
        image_selection: { konten: { pertanyaan: '', pilihan: n('pilihan', 3) } },
        sentence_builder: { konten: { kalimat: n('kalimat', 1) } },
        find_error: { konten: { butir: n('butir', 1) } },
        challenge: { konten: { durasiDetik: 60 }, soal: n('soal', 3) },
    }[tipe];
}

const editorAkt = { tipe: null };

function tombolBarisHtml(list, i, total, min, urut = false) {
    return `<span class="akt-editor-aksi">
        ${urut ? `<button type="button" class="icon-btn icon-btn-ghost icon-btn-small" data-geser-baris="-1" data-geser-list="${list}" data-i="${i}" aria-label="Naikkan baris ${i + 1}"${i === 0 ? ' disabled' : ''}>${iconHtml('arrow-up')}</button>
        <button type="button" class="icon-btn icon-btn-ghost icon-btn-small" data-geser-baris="1" data-geser-list="${list}" data-i="${i}" aria-label="Turunkan baris ${i + 1}"${i === total - 1 ? ' disabled' : ''}>${iconHtml('arrow-down')}</button>` : ''}
        <button type="button" class="icon-btn icon-btn-ghost icon-btn-small icon-btn-danger" data-hapus-baris="${list}" data-i="${i}" aria-label="Hapus baris ${i + 1}"${total <= min ? ' disabled' : ''}>${iconHtml('x')}</button>
    </span>`;
}

function tombolTambahHtml(list, label, total, maks) {
    return `<button type="button" class="btn btn-secondary btn-small akt-editor-tambah" data-tambah-baris="${list}"${total >= maks ? ' disabled' : ''}>${iconHtml('plus', '')}${escapeHtml(label)}</button>`;
}

const inputAkt = (f, nilai, label, extra = '') => `<input type="text" class="form-control" data-f="${f}" value="${escapeHtml(nilai ?? '')}" aria-label="${escapeHtml(label)}" placeholder="${escapeHtml(label)}"${extra}>`;

function opsiKategoriHtml(kategori, pilih) {
    return kategori.map((k, i) => `<option value="${i}"${Number(pilih) === i ? ' selected' : ''}>${escapeHtml(k || `Kelompok ${i + 1}`)}</option>`).join('');
}

function opsiBagianHtml(bagian, pilih) {
    return bagian.length
        ? bagian.map((b, i) => `<option value="${i}"${Number(pilih) === i ? ' selected' : ''}>${i + 1}. ${escapeHtml(b)}</option>`).join('')
        : '<option value="">Tulis teks dulu</option>';
}

// HTML editor untuk satu tipe. data = { konten, soal }
function editorAktivitasHtml(tipe, data) {
    const k = data.konten;
    const hint = teks => `<p class="form-hint">${teks}</p>`;
    switch (tipe) {
        case 'matching':
            return `${hint('Tulis 3–8 pasangan. Peserta mengetuk istilah di kiri lalu memilih pasangannya (urutan kanan diacak).')}
                ${k.pasangan.map((p, i) => `<div class="akt-editor-baris" data-list="pasangan" data-i="${i}"><span class="akt-nomor">${i + 1}</span>
                    ${inputAkt('kiri', p.kiri, `Istilah ${i + 1}`)}<span class="jodoh-panah" aria-hidden="true">→</span>${inputAkt('kanan', p.kanan, `Pasangan ${i + 1}`)}
                    ${tombolBarisHtml('pasangan', i, k.pasangan.length, 3)}</div>`).join('')}
                ${tombolTambahHtml('pasangan', 'Tambah Pasangan', k.pasangan.length, 8)}`;
        case 'drag_drop':
            return `${hint('Buat 2–4 kelompok, lalu 4–12 kartu beserta kelompok yang benar.')}
                <p class="akt-kolom-judul">Kelompok</p>
                ${k.kategori.map((nama, i) => `<div class="akt-editor-baris" data-list="kategori" data-i="${i}"><span class="akt-nomor">${i + 1}</span>
                    ${inputAkt('nama', nama, `Nama kelompok ${i + 1}`)}${tombolBarisHtml('kategori', i, k.kategori.length, 2)}</div>`).join('')}
                ${tombolTambahHtml('kategori', 'Tambah Kelompok', k.kategori.length, 4)}
                <p class="akt-kolom-judul">Kartu</p>
                ${k.item.map((it, i) => `<div class="akt-editor-baris" data-list="item" data-i="${i}"><span class="akt-nomor">${i + 1}</span>
                    ${inputAkt('teks', it.teks, `Teks kartu ${i + 1}`)}
                    <select class="form-control akt-editor-select" data-f="kategori" aria-label="Kelompok yang benar untuk kartu ${i + 1}">${opsiKategoriHtml(k.kategori, it.kategori)}</select>
                    ${tombolBarisHtml('item', i, k.item.length, 4)}</div>`).join('')}
                ${tombolTambahHtml('item', 'Tambah Kartu', k.item.length, 12)}`;
        case 'ordering':
            return `${hint('Tulis 3–8 langkah dalam URUTAN YANG BENAR. Peserta akan menerima urutan teracak.')}
                ${k.urutan.map((x, i) => `<div class="akt-editor-baris" data-list="urutan" data-i="${i}"><span class="akt-nomor">${i + 1}</span>
                    ${inputAkt('teks', x, `Langkah ${i + 1}`)}${tombolBarisHtml('urutan', i, k.urutan.length, 3, true)}</div>`).join('')}
                ${tombolTambahHtml('urutan', 'Tambah Langkah', k.urutan.length, 8)}`;
        case 'true_false':
            return `${hint('Tulis 3–8 pernyataan, tentukan Benar/Salah, dan penjelasan singkat (tampil setelah peserta mencoba).')}
                ${k.pernyataan.map((p, i) => `<div class="akt-editor-blok" data-list="pernyataan" data-i="${i}">
                    <div class="akt-editor-baris"><span class="akt-nomor">${i + 1}</span>${inputAkt('teks', p.teks, `Pernyataan ${i + 1}`)}
                    <select class="form-control akt-editor-select" data-f="benar" aria-label="Kunci pernyataan ${i + 1}"><option value="true"${p.benar ? ' selected' : ''}>✓ Benar</option><option value="false"${p.benar ? '' : ' selected'}>✕ Salah</option></select>
                    ${tombolBarisHtml('pernyataan', i, k.pernyataan.length, 3)}</div>
                    ${inputAkt('penjelasan', p.penjelasan, `Penjelasan pernyataan ${i + 1} (opsional)`)}</div>`).join('')}
                ${tombolTambahHtml('pernyataan', 'Tambah Pernyataan', k.pernyataan.length, 8)}`;
        case 'image_selection':
            return `${hint('Tulis pertanyaan, lalu 3–8 kartu. Gambar boleh emoji (mis. 🐄) atau unggah gambar (JPG/PNG, maks. 200 KB). Centang kartu yang benar.')}
                <div class="akt-editor-baris" data-list="umum">${inputAkt('pertanyaan', k.pertanyaan, 'Pertanyaan, mis. Manakah yang termasuk hewan herbivora?')}</div>
                ${k.pilihan.map((p, i) => {
                    const unggah = /^data:image\//.test(p.gambar);
                    return `<div class="akt-editor-baris" data-list="pilihan" data-i="${i}"><span class="akt-nomor">${i + 1}</span>
                        <span class="akt-editor-gambar">${unggah ? `<img src="${escapeHtml(p.gambar)}" alt="Gambar kartu ${i + 1}">` : ''}
                            <input type="text" class="form-control akt-editor-emoji" data-f="emoji" value="${unggah ? '' : escapeHtml(p.gambar)}" maxlength="8" aria-label="Emoji kartu ${i + 1}" placeholder="🐄"${unggah ? ' hidden' : ''}>
                            <input type="hidden" data-f="unggah" value="${unggah ? escapeHtml(p.gambar) : ''}">
                            <label class="btn btn-secondary btn-small akt-editor-unggah">${iconHtml('plus', '')}${unggah ? 'Ganti' : 'Unggah'}<input type="file" accept="image/png,image/jpeg,image/gif,image/webp" data-unggah-gambar="${i}" class="visually-hidden"></label>
                            ${unggah ? `<button type="button" class="btn btn-secondary btn-small" data-hapus-gambar="${i}">Pakai emoji</button>` : ''}</span>
                        ${inputAkt('label', p.label, `Keterangan kartu ${i + 1}`)}
                        <label class="check-item akt-editor-benar"><input type="checkbox" data-f="benar"${p.benar ? ' checked' : ''}>Benar</label>
                        ${tombolBarisHtml('pilihan', i, k.pilihan.length, 3)}</div>`;
                }).join('')}
                ${tombolTambahHtml('pilihan', 'Tambah Kartu', k.pilihan.length, 8)}`;
        case 'sentence_builder':
            return `${hint('Tulis 1–5 kalimat yang benar (3–12 kata). Kata pengecoh opsional, pisahkan dengan koma (maks. 3).')}
                ${k.kalimat.map((s, i) => `<div class="akt-editor-blok" data-list="kalimat" data-i="${i}">
                    <div class="akt-editor-baris"><span class="akt-nomor">${i + 1}</span>${inputAkt('teks', s.teks, `Kalimat benar ${i + 1}, mis. She is a student.`)}${tombolBarisHtml('kalimat', i, k.kalimat.length, 1)}</div>
                    ${inputAkt('pengecoh', s.pengecoh.join(', '), 'Kata pengecoh (opsional), mis. are, am')}</div>`).join('')}
                ${tombolTambahHtml('kalimat', 'Tambah Kalimat', k.kalimat.length, 5)}`;
        case 'find_error':
            return `${hint('Tulis pernyataan yang mengandung kesalahan, pisahkan bagian-bagiannya dengan tanda | (garis tegak). Pilih bagian yang salah dan tulis koreksinya.')}
                ${k.butir.map((b, i) => `<div class="akt-editor-blok" data-list="butir" data-i="${i}">
                    <div class="akt-editor-baris"><span class="akt-nomor">${i + 1}</span>${inputAkt('bagian', b.bagian.join(' | '), 'Contoh: 2 + 3 × 4 | = | 20', ' data-segmen="1"')}${tombolBarisHtml('butir', i, k.butir.length, 1)}</div>
                    <div class="akt-editor-baris akt-editor-dua">
                        <select class="form-control akt-editor-select" data-f="salah" aria-label="Bagian yang salah pada pernyataan ${i + 1}">${opsiBagianHtml(b.bagian, b.salah)}</select>
                        ${inputAkt('koreksi', b.koreksi, 'Koreksi yang benar, mis. 14')}</div>
                    ${inputAkt('pilihanKoreksi', b.pilihanKoreksi.join(', '), 'Pilihan koreksi pengecoh (opsional, pisahkan koma). Kosong = peserta mengetik koreksi')}
                    ${inputAkt('penjelasan', b.penjelasan, 'Penjelasan (opsional)')}</div>`).join('')}
                ${tombolTambahHtml('butir', 'Tambah Pernyataan', k.butir.length, 5)}`;
        default: {
            const soal = data.soal || [];
            return `${hint('Tantangan kilat: 3–10 soal pilihan ganda (A–D) dengan batas waktu 30–300 detik.')}
                <div class="akt-editor-baris" data-list="umum"><label class="form-label form-label-sm" for="akt-durasi-detik">Waktu (detik)</label>
                    <input type="number" class="form-control akt-editor-angka" id="akt-durasi-detik" data-f="durasiDetik" min="30" max="300" value="${escapeHtml(k.durasiDetik ?? 60)}"></div>
                ${soal.map((s, i) => `<div class="akt-editor-blok" data-list="soal" data-i="${i}">
                    <div class="akt-editor-baris"><span class="akt-nomor">${i + 1}</span>${inputAkt('teks', s.teks, `Pertanyaan ${i + 1}`)}${tombolBarisHtml('soal', i, soal.length, 3)}</div>
                    <div class="akt-editor-opsi">${[0, 1, 2, 3].map(o => `<input type="text" class="form-control" data-f="opsi" data-o="${o}" value="${escapeHtml((s.opsi || [])[o] || '')}" aria-label="Pilihan ${hurufOpsi(o)} soal ${i + 1}" placeholder="Pilihan ${hurufOpsi(o)}">`).join('')}</div>
                    <select class="form-control akt-editor-select" data-f="kunci" aria-label="Jawaban benar soal ${i + 1}">${[0, 1, 2, 3].map(o => `<option value="${o}"${Number(s.kunci) === o ? ' selected' : ''}>Jawaban benar: ${hurufOpsi(o)}</option>`).join('')}</select></div>`).join('')}
                ${tombolTambahHtml('soal', 'Tambah Soal Tantangan', soal.length, 10)}`;
        }
    }
}

function renderEditorAktivitas(tipe, data) {
    editorAkt.tipe = tipe;
    document.getElementById('ev-konten-editor').innerHTML = editorAktivitasHtml(tipe, data);
}

// Baca isi editor → { konten, soal }
function bacaEditorAktivitas() {
    const root = document.getElementById('ev-konten-editor');
    const tipe = editorAkt.tipe;
    const baris = list => [...root.querySelectorAll(`[data-list="${list}"]`)];
    const nilai = (el, f) => { const x = el.querySelector(`[data-f="${f}"]`); return x ? x.value : ''; };
    const pisah = (teks, tanda) => String(teks || '').split(tanda).map(s => s.trim()).filter(Boolean);
    const umum = root.querySelector('[data-list="umum"]');
    switch (tipe) {
        case 'matching': return { konten: { pasangan: baris('pasangan').map(b => ({ kiri: nilai(b, 'kiri'), kanan: nilai(b, 'kanan') })) } };
        case 'drag_drop': return { konten: { kategori: baris('kategori').map(b => nilai(b, 'nama')), item: baris('item').map(b => ({ teks: nilai(b, 'teks'), kategori: Number(nilai(b, 'kategori')) })) } };
        case 'ordering': return { konten: { urutan: baris('urutan').map(b => nilai(b, 'teks')) } };
        case 'true_false': return { konten: { pernyataan: baris('pernyataan').map(b => ({ teks: nilai(b, 'teks'), benar: nilai(b, 'benar') === 'true', penjelasan: nilai(b, 'penjelasan') })) } };
        case 'image_selection': return {
            konten: {
                pertanyaan: umum ? nilai(umum, 'pertanyaan') : '',
                pilihan: baris('pilihan').map(b => ({ gambar: nilai(b, 'unggah') || nilai(b, 'emoji'), label: nilai(b, 'label'), benar: b.querySelector('[data-f="benar"]').checked })),
            },
        };
        case 'sentence_builder': return { konten: { kalimat: baris('kalimat').map(b => ({ teks: nilai(b, 'teks'), pengecoh: pisah(nilai(b, 'pengecoh'), ',') })) } };
        case 'find_error': return {
            konten: {
                butir: baris('butir').map(b => ({
                    bagian: pisah(nilai(b, 'bagian'), '|'), salah: Number(nilai(b, 'salah')), koreksi: nilai(b, 'koreksi'),
                    pilihanKoreksi: pisah(nilai(b, 'pilihanKoreksi'), ','), penjelasan: nilai(b, 'penjelasan'),
                })),
            },
        };
        default: return {
            konten: { durasiDetik: umum ? Number(nilai(umum, 'durasiDetik')) : 60 },
            soal: baris('soal').map(b => ({
                tipe: 'pg', teks: nilai(b, 'teks'), opsi: [...b.querySelectorAll('[data-f="opsi"]')].map(x => x.value), kunci: Number(nilai(b, 'kunci')), pembahasan: '',
            })),
        };
    }
}

// Kunci daftar di konten (atau 'soal') yang diubah oleh tombol tambah/hapus/geser baris
function ubahBarisEditor(list, ubah) {
    const data = bacaEditorAktivitas();
    const arr = list === 'soal' ? data.soal : data.konten[list];
    ubah(arr);
    renderEditorAktivitas(editorAkt.tipe, data);
}

function initEditorAktivitas(form) {
    const root = document.getElementById('ev-konten-editor');
    root.addEventListener('click', event => {
        const el = event.target.closest('button');
        if (!el || el.disabled) {
            return;
        }
        if (el.dataset.tambahBaris) {
            const list = el.dataset.tambahBaris;
            ubahBarisEditor(list, arr => arr.push(BARIS_KOSONG_AKT[list]()));
            const semua = root.querySelectorAll(`[data-list="${list}"]`);
            semua[semua.length - 1]?.querySelector('input[type="text"]:not([hidden])')?.focus();
        } else if (el.dataset.hapusBaris) {
            ubahBarisEditor(el.dataset.hapusBaris, arr => arr.splice(Number(el.dataset.i), 1));
            root.querySelector(`[data-tambah-baris="${el.dataset.hapusBaris}"]`)?.focus();
        } else if (el.dataset.geserBaris) {
            const i = Number(el.dataset.i);
            const ke = i + Number(el.dataset.geserBaris);
            ubahBarisEditor(el.dataset.geserList, arr => { [arr[i], arr[ke]] = [arr[ke], arr[i]]; });
            root.querySelector(`[data-geser-baris="${el.dataset.geserBaris}"][data-i="${ke}"]`)?.focus();
        } else if (el.dataset.hapusGambar !== undefined) {
            ubahBarisEditor('pilihan', arr => { arr[Number(el.dataset.hapusGambar)].gambar = ''; });
        }
    });
    root.addEventListener('input', event => {
        // Nama kelompok berubah → pilihan kelompok pada kartu ikut berubah
        if (event.target.closest('[data-list="kategori"]')) {
            const nama = [...root.querySelectorAll('[data-list="kategori"] [data-f="nama"]')].map(x => x.value);
            root.querySelectorAll('[data-list="item"] [data-f="kategori"]').forEach(sel => {
                const v = sel.value;
                sel.innerHTML = opsiKategoriHtml(nama, v);
            });
        }
        // Teks pernyataan "cari kesalahan" berubah → pilihan bagian yang salah ikut berubah
        if (event.target.dataset.segmen) {
            const blok = event.target.closest('[data-list="butir"]');
            const sel = blok.querySelector('[data-f="salah"]');
            const v = sel.value;
            sel.innerHTML = opsiBagianHtml(String(event.target.value).split('|').map(s => s.trim()).filter(Boolean), v);
        }
        if (document.getElementById('konten-error').textContent) {
            setText('konten-error', validateKontenAktivitas(editorAkt.tipe, bacaEditorAktivitas().konten, bacaEditorAktivitas().soal));
        }
    });
    root.addEventListener('change', async event => {
        const input = event.target;
        if (input.dataset.unggahGambar === undefined || !input.files[0]) {
            return;
        }
        const file = input.files[0];
        if (!/^image\/(png|jpeg|gif|webp)$/.test(file.type) || file.size > 200 * 1024) {
            setText('konten-error', 'Gambar kartu harus JPG/PNG/GIF/WEBP dan maksimal 200 KB.');
            input.value = '';
            return;
        }
        const hasil = await bacaFileDataUrl(file);
        ubahBarisEditor('pilihan', arr => { arr[Number(input.dataset.unggahGambar)].gambar = hasil.data; });
    });
    saatNilaiBerubah(form.elements.tipe, () => {
        const tipe = form.elements.tipe.value;
        renderEditorAktivitas(tipe, kontenKosongAktivitas(tipe));
        setText('konten-error', '');
        showFieldError(form, 'tipe', '');
        if (!evaluasiView.editId) {
            form.elements.instruksi.value = TIPE_AKTIVITAS[tipe].instruksi;
        }
    });
}
const DESKRIPSI_EVALUASI = {
    pretest: 'Soal awal sebelum peserta mempelajari modul (1 pretest per pertemuan, dikerjakan 1 kali).',
    aktivitas: 'Aktivitas interaktif dengan umpan balik langsung: pilihan ganda, benar/salah, dan menjodohkan.',
    latihan: 'Latihan soal dengan nilai dan pembahasan setelah dikirim; peserta boleh mengulang.',
};
const DURASI_AWAL_EVALUASI = { pretest: 10, aktivitas: 0, latihan: 0 };

const evaluasiView = { jenis: 'pretest', cari: '', kelas: '', status: '', halaman: 1, editId: null };

function filterEvaluasi(list, kelasMap, pertemuanMap) {
    const cari = evaluasiView.cari.trim().toLowerCase();
    return list.filter(e => {
        if (evaluasiView.kelas && e.kelasId !== Number(evaluasiView.kelas)) {
            return false;
        }
        if (evaluasiView.status && e.status !== evaluasiView.status) {
            return false;
        }
        if (!cari) {
            return true;
        }
        const kelas = kelasMap[e.kelasId];
        const pertemuan = pertemuanMap[e.pertemuanId];
        return [e.judul, kelas && kelas.nama, kelas && kelas.mapel, pertemuan && pertemuan.judul]
            .some(teks => String(teks || '').toLowerCase().includes(cari));
    });
}

function badgeStatusEvaluasi(status) {
    return `<span class="badge ${status === 'Aktif' ? 'badge-success' : 'badge-warning'} badge-dot">${escapeHtml(status)}</span>`;
}

function renderEvaluasiRow(e, nomor, kelasMap, pertemuanMap) {
    const kelas = kelasMap[e.kelasId];
    const pertemuan = pertemuanMap[e.pertemuanId];
    const judul = escapeHtml(e.judul);
    const jumlah = e.soal.length;
    const aktivitas = e.jenis === 'aktivitas';
    const info = TIPE_AKTIVITAS[e.tipe];
    // Kolom isi: Aktivitas → tipe & jumlah bagian; Pretest → x/5 soal; Latihan → x/target soal (dibuat pengajar)
    const target = e.jenis === 'pretest' ? PRETEST_JUMLAH_SOAL : e.jenis === 'latihan' ? Number(e.target) || LATIHAN_TARGET_AWAL : null;
    const isi = aktivitas
        ? `${info ? `${info.ikon} ${escapeHtml(info.label)}` : '–'}<p class="cell-meta">${jumlahButirAktivitas(e)} bagian${e.tipe === 'challenge' ? ` · ${e.konten.durasiDetik} detik` : ''}</p>`
        : `${jumlah < target ? `<span class="status-inline-warning">${jumlah} / ${target} Soal</span>` : `${jumlah}${target ? ` / ${target}` : ''} Soal`}<p class="cell-meta">${e.jenis === 'latihan' ? 'Soal dibuat pengajar · ' : ''}${Number(e.durasi) ? `${e.durasi} menit` : 'Tanpa batas waktu'}</p>`;
    const preview = aktivitas ? `aktivitas.html?id=${e.id}` : `kerjakan.html?jenis=${e.jenis}&id=${e.id}`;
    const bisaPreview = aktivitas ? !validateKontenAktivitas(e.tipe, e.konten, e.soal) : jumlah > 0;
    return `
        <tr${atributBarisPantau(e.jenis, e.id)}>
            <td class="col-no">${nomor}</td>
            <td><p class="cell-title">${judulPantauHtml(e.jenis, e.id, judul)}</p><p class="cell-meta">${escapeHtml(ringkasTeks(e.instruksi || 'Tanpa instruksi', 70))}</p></td>
            <td>${kelas ? `${escapeHtml(labelSingkat(kelas))}<p class="cell-meta">${escapeHtml(kelas.mapel)}</p>` : '–'}</td>
            <td>${pertemuan
                ? `${labelPertemuan(pertemuan)}${aktivitas ? ` · #${e.urutan || '–'}` : ''}<p class="cell-meta">${escapeHtml(pertemuan.judul)}</p>`
                : '<span class="cell-muted">Tanpa pertemuan</span>'}</td>
            <td>${isi}</td>
            <td>${badgeStatusEvaluasi(e.status)}</td>
            <td>
                <div class="actions">
                    ${aktivitas ? `<button type="button" class="icon-btn icon-btn-ghost icon-btn-small" data-action="naik" data-id="${e.id}" aria-label="Pindahkan ${judul} ke urutan sebelumnya" title="Urutan naik">${iconHtml('arrow-up')}</button>
                    <button type="button" class="icon-btn icon-btn-ghost icon-btn-small" data-action="turun" data-id="${e.id}" aria-label="Pindahkan ${judul} ke urutan berikutnya" title="Urutan turun">${iconHtml('arrow-down')}</button>` : ''}
                    <button type="button" class="icon-btn icon-btn-ghost icon-btn-small" data-action="detail" data-id="${e.id}" aria-label="Lihat detail ${judul}" title="Detail">${iconHtml('eye')}</button>
                    ${bisaPreview ? `<a class="icon-btn icon-btn-ghost icon-btn-small" href="${preview}" aria-label="Preview ${judul}" title="Preview seperti peserta">${iconHtml('play')}</a>` : ''}
                    ${e.jenis === 'latihan'
                        ? `<a class="btn btn-tonal btn-small" href="kelola-soal.html?jenis=latihan&id=${e.id}" aria-label="Kelola soal ${judul}">${iconHtml('list', '')}Kelola Soal</a>
                    <button type="button" class="btn btn-secondary btn-small" data-action="edit" data-id="${e.id}" aria-label="Edit latihan ${judul}">${iconHtml('pencil', '')}Edit Latihan</button>
                    <button type="button" class="btn btn-secondary btn-small btn-hapus-soal" data-action="hapus" data-id="${e.id}" aria-label="Hapus ${judul}">${iconHtml('trash', '')}Hapus</button>`
                        : `${aktivitas ? '' : `<a class="icon-btn icon-btn-ghost icon-btn-small" href="kelola-soal.html?jenis=${e.jenis}&id=${e.id}" aria-label="Kelola soal ${judul}" title="Kelola Soal">${iconHtml('list')}</a>`}
                    <button type="button" class="icon-btn icon-btn-ghost icon-btn-small" data-action="edit" data-id="${e.id}" aria-label="Edit ${judul}" title="Edit">${iconHtml('pencil')}</button>
                    <button type="button" class="icon-btn icon-btn-ghost icon-btn-small icon-btn-danger" data-action="hapus" data-id="${e.id}" aria-label="Hapus ${judul}" title="Hapus">${iconHtml('trash')}</button>`}
                </div>
            </td>
        </tr>`;
}

function renderEvaluasiTable() {
    const tbody = document.getElementById('ev-table-body');
    const { jenis } = evaluasiView;
    const label = JENIS_EVALUASI[jenis].label;
    const kelasMap = Object.fromEntries(getAllKelas().map(k => [k.id, k]));
    // Hanya data kelas yang boleh dilihat (Pengajar: kelas yang diampu)
    const semua = getAllEvaluasi().filter(e => e.jenis === jenis && kelasMap[e.kelasId]);
    const pertemuanMap = Object.fromEntries(getAllPertemuan().map(p => [p.id, p]));
    // Urut: kelas, nomor pertemuan, lalu urutan aktivitas
    const urut = [...semua].sort((a, b) => a.kelasId - b.kelasId
        || ((pertemuanMap[a.pertemuanId] || { nomor: 99 }).nomor - (pertemuanMap[b.pertemuanId] || { nomor: 99 }).nomor)
        || (a.urutan || 0) - (b.urutan || 0) || a.id - b.id);
    const hasil = filterEvaluasi(urut, kelasMap, pertemuanMap);

    const totalHalaman = Math.max(1, Math.ceil(hasil.length / BARIS_PER_HALAMAN));
    evaluasiView.halaman = Math.min(Math.max(1, evaluasiView.halaman), totalHalaman);
    const mulai = (evaluasiView.halaman - 1) * BARIS_PER_HALAMAN;
    const tampil = hasil.slice(mulai, mulai + BARIS_PER_HALAMAN);

    tbody.innerHTML = tampil.length
        ? tampil.map((e, i) => renderEvaluasiRow(e, mulai + i + 1, kelasMap, pertemuanMap)).join('')
        : `<tr><td colspan="7" class="table-empty">${semua.length ? 'Tidak ada data yang cocok dengan pencarian/filter.' : `Belum ada ${label.toLowerCase()}. Klik "Tambah ${label}" untuk membuat.`}</td></tr>`;
    setText('ev-table-info', hasil.length ? `Menampilkan ${mulai + 1}-${mulai + tampil.length} dari ${hasil.length} ${label.toLowerCase()}` : 'Tidak ada data');
    renderPagination(document.getElementById('ev-pagination'), evaluasiView.halaman, totalHalaman, halaman => {
        evaluasiView.halaman = halaman;
        renderEvaluasiTable();
    });
    const aktif = semua.filter(e => e.status === 'Aktif').length;
    if (jenis === 'aktivitas') {
        const tipe = new Set(semua.map(e => e.tipe)).size;
        setText('ev-ringkasan', `${semua.length} aktivitas · ${aktif} aktif · ${semua.length - aktif} draft · ${tipe} tipe aktivitas · disarankan 3–5 per pertemuan`);
        return;
    }
    const target = e => (jenis === 'pretest' ? PRETEST_JUMLAH_SOAL : jenis === 'latihan' ? Number(e.target) || LATIHAN_TARGET_AWAL : 1);
    const belum = semua.filter(e => e.soal.length < target(e)).length;
    setText('ev-ringkasan', `${semua.length} ${label.toLowerCase()} · ${aktif} aktif · ${semua.length - aktif} draft · ${semua.reduce((n, e) => n + e.soal.length, 0)} soal${belum ? ` · ${belum} belum lengkap` : ''}`);
}

// Ubah urutan aktivitas dalam satu pertemuan (arah -1 naik, +1 turun)
function geserUrutanAktivitas(id, arah) {
    const list = getAllEvaluasi();
    const e = list.find(x => x.id === Number(id));
    if (!e || !getEvaluasiById(id)) {
        return false;
    }
    const sePertemuan = list.filter(x => x.jenis === 'aktivitas' && x.pertemuanId === e.pertemuanId)
        .sort((a, b) => (a.urutan || 0) - (b.urutan || 0) || a.id - b.id);
    const i = sePertemuan.indexOf(e);
    const j = i + arah;
    if (j < 0 || j >= sePertemuan.length) {
        return false;
    }
    [sePertemuan[i], sePertemuan[j]] = [sePertemuan[j], sePertemuan[i]];
    sePertemuan.forEach((x, n) => { x.urutan = n + 1; });
    writeKoleksi('evaluasi', list);
    return true;
}

function renderOpsiKelasEvaluasi() {
    const kelasList = getAllKelas();
    const filter = document.getElementById('ev-filter-kelas');
    const pilih = filter.value;
    filter.innerHTML = '<option value="">Semua Kelas</option>' + opsiKelasHtml(kelasList);
    filter.value = [...filter.options].some(o => o.value === pilih) ? pilih : '';
    evaluasiView.kelas = filter.value;
    document.getElementById('ev-kelasId').innerHTML = '<option value="">Pilih kelas</option>' + opsiKelasHtml(kelasList);
}

function readEvaluasiForm(form) {
    const data = { jenis: evaluasiView.jenis };
    EVALUASI_FORM_FIELDS.forEach(field => {
        data[field] = form.elements[field].value;
    });
    if (evaluasiView.jenis === 'aktivitas') {
        const isi = bacaEditorAktivitas();
        data.tipe = form.elements.tipe.value;
        data.konten = isi.konten;
        data.soal = isi.soal || [];
        data.durasi = 0;
    }
    if (evaluasiView.jenis === 'latihan') {
        data.target = form.elements.target.value;
    }
    return data;
}

// Tampilkan error isian khusus (jumlah soal latihan, tipe & isi aktivitas)
function tampilkanErrorKhususEvaluasi(form, errors) {
    showFieldError(form, 'target', errors.target);
    showFieldError(form, 'tipe', errors.tipe);
    setText('konten-error', errors.konten || '');
    return !errors.target && !errors.tipe && !errors.konten;
}

// Judul otomatis (mode Tambah, bila masih kosong): "Pretest: <topik pertemuan>"
function isiJudulEvaluasiOtomatis(form) {
    const p = getPertemuanById(form.elements.pertemuanId.value);
    if (evaluasiView.editId === null && p && !form.elements.judul.value.trim()) {
        form.elements.judul.value = `${JENIS_EVALUASI[evaluasiView.jenis].label}: ${p.judul}`;
    }
}

function bukaFormEvaluasi(id = null, awal = {}) {
    const card = document.getElementById('ev-form-card');
    const form = document.getElementById('form-evaluasi');
    const e = id !== null ? getEvaluasiById(id) : null;
    if (id !== null && (!e || e.jenis !== evaluasiView.jenis)) {
        tampilkanPesan('error', 'Data tidak ditemukan. Mungkin sudah dihapus.');
        return;
    }
    const label = JENIS_EVALUASI[evaluasiView.jenis].label;
    evaluasiView.editId = e ? e.id : null;
    form.reset();
    EVALUASI_FORM_FIELDS.forEach(field => showFieldError(form, field, ''));
    setText('ev-form-title', e ? `Edit ${label}` : `Tambah ${label}`);
    const kelasAwal = e ? e.kelasId : (awal.kelasId || Number(evaluasiView.kelas) || '');
    form.elements.kelasId.value = kelasAwal;
    renderOpsiPertemuan(form, kelasAwal, e ? e.pertemuanId : (awal.pertemuanId || ''));
    form.elements.judul.value = e ? e.judul : '';
    form.elements.durasi.value = e ? e.durasi : DURASI_AWAL_EVALUASI[evaluasiView.jenis];
    form.elements.status.value = e ? e.status : 'Draft';
    form.elements.instruksi.value = e ? e.instruksi : JENIS_EVALUASI[evaluasiView.jenis].instruksi;
    tampilkanErrorKhususEvaluasi(form, {});
    const jenis = evaluasiView.jenis;
    if (jenis === 'aktivitas') {
        // Aktivitas: tipe & isi sesuai tipe langsung di form ini (tanpa Kelola Soal)
        const tipe = e ? e.tipe : 'matching';
        form.elements.tipe.value = tipe;
        renderEditorAktivitas(tipe, e ? { konten: copyData(e.konten), soal: copyData(e.soal) } : kontenKosongAktivitas(tipe));
        if (!e) {
            form.elements.instruksi.value = TIPE_AKTIVITAS[tipe].instruksi;
        }
    }
    if (jenis === 'latihan') {
        form.elements.target.value = e ? e.target : LATIHAN_TARGET_AWAL;
    }
    isiJudulEvaluasiOtomatis(form);
    setText('btn-simpan-evaluasi', e || jenis === 'aktivitas' ? 'Simpan' : jenis === 'latihan' ? 'Simpan & Tulis Soal' : 'Simpan & Kelola Soal');
    card.hidden = false;
    card.scrollIntoView({ block: 'start' });
    form.elements.judul.focus();
}

function tutupFormEvaluasi() {
    document.getElementById('ev-form-card').hidden = true;
    evaluasiView.editId = null;
}

function simpanFormEvaluasi(event) {
    event.preventDefault();
    const form = event.target;
    const data = readEvaluasiForm(form);
    const errors = validateEvaluasi(data, evaluasiView.editId);
    const label = JENIS_EVALUASI[evaluasiView.jenis].label;
    const formOk = tampilkanErrorForm(form, EVALUASI_FORM_FIELDS, errors);
    const khususOk = tampilkanErrorKhususEvaluasi(form, errors);
    if (!formOk || !khususOk) {
        if (formOk && errors.konten) {
            document.getElementById('ev-konten-editor').querySelector('input, select')?.focus();
        }
        tampilkanPesan('error', `${label} belum tersimpan. ${errors.konten || 'Periksa kolom yang ditandai merah.'}`);
        return;
    }
    if (errors.soal) {
        tampilkanPesan('error', `${label} belum tersimpan: ${errors.soal} Perbaiki lewat Kelola Soal.`);
        return;
    }
    if (evaluasiView.editId !== null) {
        const hasil = updateEvaluasi(evaluasiView.editId, data);
        tutupFormEvaluasi();
        renderEvaluasiTable();
        tampilkanPesan('success', `Perubahan "${hasil.judul}" berhasil disimpan.`);
        document.getElementById('page-alert').scrollIntoView({ block: 'nearest' });
        return;
    }
    if (evaluasiView.jenis === 'aktivitas') {
        // Aktivitas baru: urutan terakhir di pertemuannya; isi sudah lengkap di form
        const urutan = getAllEvaluasi().filter(x => x.jenis === 'aktivitas' && x.pertemuanId === Number(data.pertemuanId)).length + 1;
        const hasil = addEvaluasi({ ...data, urutan });
        resetFilterEvaluasi(false);
        tutupFormEvaluasi();
        renderEvaluasiTable();
        tampilkanPesan('success', `Aktivitas "${hasil.judul}" (${TIPE_AKTIVITAS[hasil.tipe].label}) berhasil ditambahkan${hasil.status === 'Aktif' ? ' dan langsung terlihat peserta' : ' sebagai Draft'}. Gunakan tombol ▶ untuk preview.`);
        document.getElementById('page-alert').scrollIntoView({ block: 'nearest' });
        return;
    }
    // Pretest/Latihan baru: tersimpan tanpa soal, lalu langsung ke Kelola Soal (Latihan: form Tambah Soal langsung terbuka)
    const hasil = addEvaluasi({ ...data, soal: [] });
    window.location.href = `kelola-soal.html?jenis=${hasil.jenis}&id=${hasil.id}&baru=1`;
}

function lihatEvaluasi(id) {
    const e = getEvaluasiById(id);
    if (!e || e.jenis !== evaluasiView.jenis) {
        return;
    }
    const kelas = getKelasById(e.kelasId);
    const pertemuan = e.pertemuanId !== null ? getPertemuanById(e.pertemuanId) : null;
    const hitung = tipe => e.soal.filter(s => s.tipe === tipe).length;
    const kerja = hitungPengerjaanItem(e.jenis, e.id);
    tampilkanDetail(`Detail ${JENIS_EVALUASI[e.jenis].label}`, [
        ['Judul', escapeHtml(e.judul)],
        ['Kelas', kelas ? `${escapeHtml(kelas.nama)} <span class="cell-muted">(${escapeHtml(kelas.mapel)})</span>` : '–'],
        ['Pertemuan', pertemuan
            ? `<a class="text-primary" href="pertemuan.html?id=${pertemuan.id}">Pertemuan ${pertemuan.nomor} · ${escapeHtml(pertemuan.judul)}</a>`
            : '<span class="cell-muted">Tanpa pertemuan (pertemuan sudah dihapus)</span>'],
        ['Instruksi', e.instruksi ? `<div class="materi-preview">${escapeHtml(e.instruksi)}</div>` : '–'],
        ...(e.jenis === 'aktivitas'
            ? [['Tipe Aktivitas', TIPE_AKTIVITAS[e.tipe] ? `${TIPE_AKTIVITAS[e.tipe].ikon} ${escapeHtml(TIPE_AKTIVITAS[e.tipe].label)}` : '–'],
                ['Isi', `${jumlahButirAktivitas(e)} bagian${e.tipe === 'challenge' ? ` · waktu ${e.konten.durasiDetik} detik` : ''}`],
                ['Urutan di Pertemuan', `#${e.urutan || '–'}`]]
            : [['Soal', e.soal.length
                ? `${e.soal.length}${e.jenis === 'pretest' ? ` / ${PRETEST_JUMLAH_SOAL}` : e.jenis === 'latihan' ? ` / ${e.target}` : ''} soal <span class="cell-muted">(${hitung('pg')} pilihan ganda · ${hitung('bs')} benar/salah)</span>`
                : '<span class="status-inline-warning">Belum ada soal</span>'],
            ['Durasi', Number(e.durasi) ? `${e.durasi} menit` : 'Tanpa batas waktu']]),
        ['Kesempatan', BOLEH_DIULANG[e.jenis] ? 'Boleh diulang' : '1 kali'],
        ['Pengerjaan Peserta', `${kerja.selesai} selesai${kerja.sedang ? ` · ${kerja.sedang} sedang mengerjakan` : ''}`],
        ['Status', badgeStatusEvaluasi(e.status)],
    ], () => bukaFormEvaluasi(e.id));
    const tombol = document.getElementById('modal-detail-soal');
    tombol.href = e.jenis === 'aktivitas' ? `aktivitas.html?id=${e.id}` : `kelola-soal.html?jenis=${e.jenis}&id=${e.id}`;
    tombol.textContent = e.jenis === 'aktivitas' ? 'Preview' : 'Kelola Soal';
}

function hapusEvaluasi(id) {
    const e = getEvaluasiById(id);
    if (!e) {
        return;
    }
    const kelas = getKelasById(e.kelasId);
    const kerja = hitungPengerjaanItem(e.jenis, e.id);
    konfirmasiHapusData({
        judul: `Hapus ${JENIS_EVALUASI[e.jenis].label}?`,
        jenis: JENIS_EVALUASI[e.jenis].label.toLowerCase(),
        nama: e.judul,
        dampak: [kelas ? `Kelas ${kelas.nama}, ${e.soal.length} soal.` : '',
            kerja.selesai + kerja.sedang ? `${kerja.selesai + kerja.sedang} hasil pengerjaan peserta ikut dihapus.` : ''].filter(Boolean).join(' '),
        onConfirm: () => {
            deleteEvaluasi(e.id);
            if (evaluasiView.editId === e.id) {
                tutupFormEvaluasi();
            }
            renderEvaluasiTable();
            tampilkanPesan('success', `"${e.judul}" berhasil dihapus.`);
        },
    });
}

function resetFilterEvaluasi(render = true) {
    Object.assign(evaluasiView, { cari: '', kelas: '', status: '', halaman: 1 });
    ['ev-search', 'ev-filter-kelas', 'ev-filter-status'].forEach(id => {
        document.getElementById(id).value = '';
    });
    if (render) {
        renderEvaluasiTable();
    }
}

function initEvaluasiPage() {
    initModalUmum();
    const params = new URLSearchParams(window.location.search);
    evaluasiView.jenis = JENIS_EVALUASI[params.get('jenis')] ? params.get('jenis') : 'pretest';
    const { jenis } = evaluasiView;
    const label = JENIS_EVALUASI[jenis].label;
    document.title = `${label} — DelLearn`;
    ['ev-crumb', 'ev-judul-halaman', 'btn-tambah-evaluasi-teks'].forEach((idEl, i) => setText(idEl, i === 2 ? `Tambah ${label}` : label));
    setText('ev-deskripsi-halaman', DESKRIPSI_EVALUASI[jenis]);
    setText('ev-daftar-judul', `Daftar ${label}`);
    setText('ev-caption', `Daftar ${label}`);
    document.querySelectorAll('.tabs .tab').forEach(tab => {
        const aktif = tab.dataset.jenis === jenis;
        tab.classList.toggle('active', aktif);
        if (aktif) {
            tab.setAttribute('aria-current', 'page');
        }
    });

    const form = document.getElementById('form-evaluasi');
    form.elements.status.innerHTML = STATUS_EVALUASI.map(s => `<option>${s}</option>`).join('');
    // Isian khusus per jenis: Aktivitas (tipe + isi), Latihan (jumlah soal); Aktivitas tanpa durasi
    document.getElementById('ev-tipe-group').hidden = jenis !== 'aktivitas';
    document.getElementById('ev-konten-group').hidden = jenis !== 'aktivitas';
    document.getElementById('ev-durasi-group').hidden = jenis === 'aktivitas';
    document.getElementById('ev-target-group').hidden = jenis !== 'latihan';
    if (jenis === 'aktivitas') {
        form.elements.tipe.innerHTML = Object.entries(TIPE_AKTIVITAS).map(([k, v]) => `<option value="${k}">${v.ikon} ${escapeHtml(v.label)}</option>`).join('');
        initEditorAktivitas(form);
        setText('status-hint', 'Draft = belum terlihat peserta. Aktif = langsung dapat dimainkan peserta.');
    } else if (jenis === 'pretest') {
        setText('status-hint', `Draft = belum terlihat peserta. Aktif = diterbitkan (wajib tepat ${PRETEST_JUMLAH_SOAL} soal).`);
    } else {
        setText('status-hint', 'Draft = belum terlihat peserta. Aktif = diterbitkan (jumlah soal harus sudah terpenuhi).');
    }
    renderOpsiKelasEvaluasi();
    if (params.get('kelas')) {
        const filter = document.getElementById('ev-filter-kelas');
        filter.value = params.get('kelas');
        evaluasiView.kelas = filter.value;
    }
    renderEvaluasiTable();

    const search = document.getElementById('ev-search');
    search.addEventListener('input', () => {
        evaluasiView.cari = search.value;
        evaluasiView.halaman = 1;
        renderEvaluasiTable();
    });
    ['kelas', 'status'].forEach(key => {
        const select = document.getElementById(`ev-filter-${key}`);
        saatNilaiBerubah(select, () => {
            evaluasiView[key] = select.value;
            evaluasiView.halaman = 1;
            renderEvaluasiTable();
        });
    });
    document.getElementById('btn-reset-filter-evaluasi').addEventListener('click', () => resetFilterEvaluasi());
    document.getElementById('btn-tambah-evaluasi').addEventListener('click', () => {
        sembunyikanPesan();
        bukaFormEvaluasi();
    });
    document.getElementById('btn-batal-evaluasi').addEventListener('click', tutupFormEvaluasi);
    saatNilaiBerubah(form.elements.kelasId, () => renderOpsiPertemuan(form, form.elements.kelasId.value));
    saatNilaiBerubah(form.elements.pertemuanId, () => isiJudulEvaluasiOtomatis(form));
    form.addEventListener('submit', simpanFormEvaluasi);
    pantauPerbaikanForm(form, EVALUASI_FORM_FIELDS, () => validateEvaluasi(readEvaluasiForm(form), evaluasiView.editId));

    document.getElementById('ev-table-body').addEventListener('click', event => {
        const button = event.target.closest('button[data-action]');
        if (!button) {
            return;
        }
        const id = Number(button.dataset.id);
        if (button.dataset.action === 'detail') {
            lihatEvaluasi(id);
        } else if (button.dataset.action === 'edit') {
            sembunyikanPesan();
            bukaFormEvaluasi(id);
        } else if (button.dataset.action === 'hapus') {
            hapusEvaluasi(id);
        } else if (button.dataset.action === 'naik' || button.dataset.action === 'turun') {
            const arah = button.dataset.action === 'naik' ? -1 : 1;
            if (geserUrutanAktivitas(id, arah)) {
                renderEvaluasiTable();
                tampilkanPesan('success', `Urutan aktivitas diperbarui (peserta melihat urutan yang sama).`);
                document.querySelector(`#ev-table-body [data-action="${button.dataset.action}"][data-id="${id}"]`)?.focus();
            } else {
                tampilkanPesan('error', `Aktivitas ini sudah berada di urutan ${arah < 0 ? 'pertama' : 'terakhir'} pada pertemuannya.`);
            }
        }
    });

    // ?id=N → detail; ?aksi=tambah&pertemuan=N → form Tambah untuk pertemuan tersebut
    const target = params.get('id') ? getEvaluasiById(params.get('id')) : null;
    if (target && target.jenis === jenis) {
        lihatEvaluasi(target.id);
    } else if (params.get('aksi') === 'tambah') {
        const p = getPertemuanById(params.get('pertemuan'));
        bukaFormEvaluasi(null, p ? { kelasId: p.kelasId, pertemuanId: p.id } : {});
    }
}

/* =========================
   17. PENGUMPULAN & PENILAIAN TUGAS (pengumpulan-tugas.html?id=N) — Pengajar & Admin
   Semua peserta kelas + status pengumpulan; modal untuk membaca jawaban, mengunduh lampiran, memberi nilai & feedback.
   Nilai tersimpan di koleksi hasil (jenis 'tugas') → langsung dipakai Rekap Nilai & Nilai Saya peserta.
========================= */

const pengumpulanView = { tugasId: null, cari: '', status: '', hasilId: null };
const BADGE_PENGUMPULAN = { 'Dinilai': 'badge-success', 'Perlu dinilai': 'badge-warning', 'Belum mengumpulkan': 'badge-muted', 'Tidak mengumpulkan': 'badge-danger' };

function badgePengumpulan(status) {
    return `<span class="badge ${BADGE_PENGUMPULAN[status] || 'badge-muted'} badge-dot">${escapeHtml(status)}</span>`;
}

// Tautan unduh file (lampiran lama: data URL; file tugas baru: tombol yang mengambil isi file dari penyimpanan browser).
// Bila hanya nama tercatat, tampil sebagai teks.
function tautanLampiran(file, teksKosong = '–') {
    if (!file || !file.nama) {
        return escapeHtml(teksKosong);
    }
    const info = `${escapeHtml(file.nama)} <span class="cell-muted">(${formatUkuran(file.ukuran)})</span>`;
    if (file.data) {
        return `<a class="text-primary lampiran-link" href="${escapeHtml(file.data)}" download="${escapeHtml(file.nama)}">${iconHtml('download')}${info}</a>`;
    }
    if (file.fileId) {
        return `<button type="button" class="link-btn lampiran-link" data-unduh-file="${escapeHtml(JSON.stringify({ nama: file.nama, tipe: file.tipe, fileId: file.fileId }))}">${iconHtml('download')}${info}</button>`;
    }
    return `${info} <span class="cell-muted">— hanya nama file yang tercatat</span>`;
}

// Jenis tampilan file: 'gambar' | 'pdf' | 'lain'
function jenisTampilanFile(file) {
    const ext = ekstensiFile(file.nama);
    if (ext === 'pdf' || /pdf/.test(file.tipe || '')) {
        return 'pdf';
    }
    return ['jpg', 'jpeg', 'png', 'svg', 'gif', 'webp'].includes(ext) || /^image\//.test(file.tipe || '') ? 'gambar' : 'lain';
}

// Pratinjau file di wadah (async): gambar → <img>, PDF → penampil PDF.js, lainnya (DOCX) → tombol Lihat/Download.
function tampilkanFileTugas(wadah, file, { judul = '' } = {}) {
    if (!wadah) {
        return Promise.resolve('');
    }
    if (!file || !file.nama) {
        wadah.innerHTML = '<p class="cell-muted">Tidak ada file.</p>';
        return Promise.resolve('');
    }
    const info = `${escapeHtml(file.nama)} · ${formatUkuran(file.ukuran)}`;
    if (!file.data && !file.fileId) {
        wadah.innerHTML = `<p class="cell-meta">${info} — hanya nama file yang tercatat</p>`;
        return Promise.resolve('nama');
    }
    wadah.innerHTML = `<p class="cell-muted">Memuat ${escapeHtml(file.nama)}…</p>`;
    return ambilFileBrowser(file).catch(() => null).then(async blob => {
        if (!blob) {
            wadah.innerHTML = `<p class="alert alert-error" role="alert">${iconHtml('info', '')}<span>File ${escapeHtml(file.nama)} tidak ditemukan di penyimpanan browser ini.</span></p>`;
            return 'hilang';
        }
        const url = URL.createObjectURL(blob);
        const jenis = jenisTampilanFile(file);
        const tombol = `<span class="actions actions-wrap"><a class="btn btn-secondary btn-small" href="${url}" target="_blank" rel="noopener" data-file-lihat>${iconHtml('eye', '')}Lihat</a><a class="btn btn-secondary btn-small" href="${url}" download="${escapeHtml(file.nama)}" data-file-unduh>${iconHtml('download', '')}Download</a></span>`;
        if (jenis === 'pdf') {
            wadah.innerHTML = '<div class="pdf-viewer"></div>';
            await tampilkanPdf(wadah.querySelector('.pdf-viewer'), { bytes: new Uint8Array(await blob.arrayBuffer()) }, file.nama);
            return 'pdf';
        }
        wadah.innerHTML = jenis === 'gambar'
            ? `<div class="file-toolbar"><span class="cell-meta">${info}</span>${tombol}</div><img class="dok-gambar" src="${url}" alt="${escapeHtml(judul || file.nama)}">`
            : `<div class="file-toolbar"><span class="cell-meta">${iconHtml('file')} ${info}</span>${tombol}</div><p class="cell-muted">Pratinjau tidak tersedia untuk file .${escapeHtml(ekstensiFile(file.nama))}. Gunakan Download untuk membukanya.</p>`;
        return jenis;
    });
}

// Tombol unduh file dari penyimpanan browser (tautanLampiran)
async function unduhFileTugas(file) {
    try {
        const blob = await ambilFileBrowser(file);
        if (!blob) {
            throw new Error('tidak ada');
        }
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = file.nama;
        document.body.appendChild(a);
        a.click();
        a.remove();
    } catch (error) {
        tampilkanPesan('error', `File "${file.nama}" tidak ditemukan di penyimpanan browser ini.`);
    }
}

function renderPengumpulanTugas() {
    const data = getPengumpulanTugas(pengumpulanView.tugasId);
    document.getElementById('pt-tidak-ada').hidden = Boolean(data);
    document.getElementById('pt-konten').hidden = !data;
    if (!data) {
        return null;
    }
    const { tugas: t, ringkasan: r } = data;
    const kelas = getKelasById(t.kelasId);
    const pertemuan = t.pertemuanId ? getPertemuanById(t.pertemuanId) : null;
    setText('pt-judul', t.judul);
    document.getElementById('pt-meta').innerHTML = [
        kelas ? escapeHtml(kelas.nama) : '–',
        pertemuan ? `Pertemuan ${pertemuan.nomor} · ${escapeHtml(pertemuan.judul)}` : 'Tanpa pertemuan',
        badgeTugas(t.status),
    ].join(' · ');
    document.getElementById('pt-kembali').href = kelas ? `tugas.html?kelas=${kelas.id}` : 'tugas.html';
    document.getElementById('pt-edit-tugas').href = `tugas.html?id=${t.id}`;
    setText('pt-deadline', `Deadline: ${formatDeadline(t.deadline)}`);
    setText('pt-instruksi', t.deskripsi);
    const soal = document.getElementById('pt-soal');
    soal.hidden = !t.soal;
    soal.textContent = t.soal || '';
    const soalFile = document.getElementById('pt-soal-file');
    soalFile.hidden = !t.fileSoal;
    if (t.fileSoal && soalFile.dataset.kunci !== String(t.id)) {
        soalFile.dataset.kunci = String(t.id);
        tampilkanFileTugas(soalFile, t.fileSoal, { judul: 'Dokumentasi soal' });
    }
    document.getElementById('pt-lampiran').innerHTML = `Metode pengumpulan: <strong>${escapeHtml(METODE_TUGAS[t.metode] || METODE_TUGAS.keduanya)}</strong>`;

    setText('pt-stat-kumpul', `${r.mengumpulkan}/${r.peserta}`);
    setText('pt-stat-kumpul-info', r.terlambat ? `${r.terlambat} melewati deadline` : 'Semua tepat waktu');
    setText('pt-stat-perlu', r.perluDinilai);
    setText('pt-stat-perlu-info', r.perluDinilai ? 'Menunggu nilai Anda' : 'Tidak ada antrean');
    setText('pt-stat-dinilai', r.dinilai);
    setText('pt-stat-dinilai-info', 'Masuk ke Rekap Nilai (Tugas)');
    setText('pt-stat-rata', r.rataRata === null ? '–' : formatNilai(r.rataRata));
    setText('pt-stat-rata-info', r.rataRata === null ? 'Belum ada nilai' : `Dari ${r.dinilai} tugas dinilai`);

    const cari = pengumpulanView.cari.trim().toLowerCase();
    const baris = data.baris
        .filter(b => !pengumpulanView.status || b.status === pengumpulanView.status)
        .filter(b => !cari || b.peserta.nama.toLowerCase().includes(cari) || String(b.peserta.nis).includes(cari));
    setText('pt-ringkasan', `${data.baris.length} peserta · menampilkan ${baris.length}`);
    document.getElementById('pt-table-body').innerHTML = baris.length ? baris.map((b, i) => {
        const h = b.hasil;
        return `
            <tr${h && h.id === pengumpulanView.hasilId ? ' class="is-selected"' : ''}>
                <td class="col-no">${i + 1}</td>
                <td><p class="cell-title">${escapeHtml(b.peserta.nama)}</p><p class="cell-meta">NIS ${escapeHtml(b.peserta.nis)}${b.pindahKelas ? ' · sudah pindah kelas' : ''}</p></td>
                <td>${badgePengumpulan(b.status)}</td>
                <td>${h ? `${formatTanggalWaktu(h.dikumpulkan)}${h.terlambat ? '<p class="cell-meta status-inline-warning">Terlambat</p>' : ''}<p class="cell-meta">${escapeHtml(LABEL_METODE_JAWABAN[h.metode] || LABEL_METODE_JAWABAN.ketik)}${h.lampiran ? ` · ${iconHtml('file')} ${escapeHtml(h.lampiran.nama)}` : ''}</p>` : '<span class="cell-muted">–</span>'}</td>
                <td class="num">${h && h.status === 'Dinilai' ? `<strong>${h.nilai}</strong>` : '–'}</td>
                <td>${h
                    ? `<button type="button" class="btn ${h.status === 'Dinilai' ? 'btn-secondary' : 'btn-primary'} btn-small" data-hasil="${h.id}">Periksa</button>`
                    : `<button type="button" class="btn btn-secondary btn-small" data-peserta="${b.peserta.id}">Lihat</button>`}</td>
            </tr>`;
    }).join('') : `<tr><td colspan="6" class="table-empty">${data.baris.length ? 'Tidak ada peserta yang cocok dengan pencarian/filter.' : 'Kelas ini belum memiliki peserta.'}</td></tr>`;
    return data;
}

// Periksa (ada jawaban: lihat jawaban ketik / file + form nilai & feedback) atau Lihat (belum mengumpulkan)
function bukaPenilaian(hasilId, pesertaId = null) {
    const data = getPengumpulanTugas(pengumpulanView.tugasId);
    const b = data ? data.baris.find(x => (hasilId ? x.hasil && x.hasil.id === Number(hasilId) : x.peserta.id === Number(pesertaId))) : null;
    if (!b) {
        tampilkanPesan('error', 'Pengumpulan tidak ditemukan. Mungkin sudah dihapus.');
        return;
    }
    const h = b.hasil;
    pengumpulanView.hasilId = h ? h.id : null;
    setText('modal-nilai-title', h ? `Periksa Jawaban — ${b.peserta.nama}` : `Lihat — ${b.peserta.nama}`);
    document.getElementById('nilai-info').innerHTML = [
        ['Nama Peserta', `${escapeHtml(b.peserta.nama)} <span class="cell-muted">(NIS ${escapeHtml(b.peserta.nis)})</span>`],
        ['Status', badgePengumpulan(b.status)],
        ...(h ? [
            ['Tanggal Pengumpulan', `${formatTanggalWaktu(h.dikumpulkan)}${h.terlambat ? ' <span class="status-inline-warning">(melewati deadline)</span>' : ''}`],
            ['Metode', escapeHtml(LABEL_METODE_JAWABAN[h.metode] || LABEL_METODE_JAWABAN.ketik)],
            ...(h.lampiran ? [['File Jawaban', tautanLampiran(h.lampiran)]] : []),
            ...(h.status === 'Dinilai' ? [['Dinilai', `${formatTanggalWaktu(h.dinilaiPada)}${h.dinilaiOleh ? ` oleh ${escapeHtml(h.dinilaiOleh)}` : ''}`]] : []),
        ] : []),
    ].map(([l, v]) => `<div><dt>${escapeHtml(l)}</dt><dd>${v}</dd></div>`).join('');
    const teks = document.getElementById('nilai-jawaban');
    teks.hidden = Boolean(h && !h.teks);
    teks.textContent = !h ? 'Peserta ini belum mengumpulkan jawaban.' : h.teks || '';
    setText('nilai-jawaban-judul', h && !h.teks ? 'File Jawaban' : 'Jawaban Peserta');
    const fileWadah = document.getElementById('nilai-file');
    fileWadah.hidden = !(h && h.lampiran);
    fileWadah.dataset.kunci = '';
    if (h && h.lampiran) {
        tampilkanFileTugas(fileWadah, h.lampiran, { judul: `File jawaban ${b.peserta.nama}` });
    } else {
        fileWadah.innerHTML = '';
    }
    const form = document.getElementById('form-nilai');
    form.hidden = !h;
    form.reset();
    ['nilai', 'catatan'].forEach(f => showFieldError(form, f, ''));
    if (h) {
        form.elements.nilai.value = h.status === 'Dinilai' ? h.nilai : '';
        form.elements.catatan.value = h.catatan || '';
    }
    // Sorot baris dulu (render ulang tabel), lalu buka modal agar fokus kembali ke tombol baris setelah ditutup
    renderPengumpulanTugas();
    bukaModal('modal-nilai');
    if (h) {
        form.elements.nilai.focus();
    }
}

function simpanPenilaian(event) {
    event.preventDefault();
    const form = event.target;
    const hasil = nilaiTugas(pengumpulanView.hasilId, form.elements.nilai.value, form.elements.catatan.value);
    if (!hasil.ok) {
        if (hasil.errors && Object.keys(hasil.errors).length) {
            tampilkanErrorForm(form, ['nilai', 'catatan'], hasil.errors);
        } else {
            tutupModal();
            tampilkanPesan('error', hasil.pesan);
        }
        return;
    }
    const p = getPesertaById(hasil.hasil.pesertaId);
    tutupModal();
    renderPengumpulanTugas();
    tampilkanPesan('success', `Penilaian tersimpan: nilai ${hasil.hasil.nilai} untuk ${p ? p.nama : 'peserta'} (sudah terlihat di Tugas & Nilai Saya peserta).`);
}

function initPengumpulanTugasPage() {
    initModalUmum();
    pengumpulanView.tugasId = Number(new URLSearchParams(window.location.search).get('id'));
    const data = renderPengumpulanTugas();
    if (!data) {
        return;
    }
    document.title = `Pengumpulan: ${data.tugas.judul} — DelLearn`;
    const search = document.getElementById('pt-search');
    search.addEventListener('input', () => {
        pengumpulanView.cari = search.value;
        renderPengumpulanTugas();
    });
    const filter = document.getElementById('pt-filter-status');
    saatNilaiBerubah(filter, () => {
        pengumpulanView.status = filter.value;
        renderPengumpulanTugas();
    });
    document.getElementById('pt-table-body').addEventListener('click', event => {
        const tombol = event.target.closest('button[data-hasil], button[data-peserta]');
        if (tombol) {
            sembunyikanPesan();
            bukaPenilaian(tombol.dataset.hasil || null, tombol.dataset.peserta || null);
        }
    });
    const form = document.getElementById('form-nilai');
    form.addEventListener('submit', simpanPenilaian);
    pantauPerbaikanForm(form, ['nilai', 'catatan'], () => {
        const errors = {};
        const err = cekBilanganBulat(form.elements.nilai.value, 'Nilai', 0, 100);
        if (err) {
            errors.nilai = err;
        }
        if (form.elements.catatan.value.trim().length > 500) {
            errors.catatan = 'Feedback maksimal 500 karakter.';
        }
        return errors;
    });
}

// Sama dengan tampilkanErrorSoal tetapi fokus tidak dipindah (dipakai saat pengguna sedang mengetik)
function tampilkanErrorSoalTanpaFokus(form, errors) {
    const aktif = document.activeElement;
    tampilkanErrorSoal(form, errors);
    if (aktif && form.contains(aktif)) {
        aktif.focus();
    }
}

/* =========================
   15. PEMANTAUAN PENGERJAAN PESERTA (pemantauan.html?jenis=pretest|modul|aktivitas|latihan|kuis|tugas&id=N)
   Satu pola untuk keenam komponen: info komponen, ringkasan, tabel peserta (cari & filter status), Lihat Detail
   (jawaban/hasil yang benar-benar tersimpan). Tugas: Pengajar/Admin dapat menilai (nilaiTugas, aturan yang sudah ada).
========================= */
const pantauView = { jenis: null, id: null, cari: '', status: '', pesertaId: null };

const BADGE_PEMANTAUAN = {
    'Belum Mengerjakan': 'badge-muted', 'Belum Membuka': 'badge-muted', 'Belum Mengumpulkan': 'badge-muted',
    'Tidak Mengumpulkan': 'badge-danger', 'Sedang Mengerjakan': 'badge-warning', 'Sedang Dipelajari': 'badge-warning',
    'Sudah Mengerjakan': 'badge-success', 'Selesai': 'badge-success', 'Sudah Mengumpulkan': 'badge-info', 'Sudah Dinilai': 'badge-success',
};

function badgePemantauan(status) {
    return `<span class="badge ${BADGE_PEMANTAUAN[status] || 'badge-muted'} badge-dot">${escapeHtml(status)}</span>`;
}

// Alamat halaman Pemantauan sebuah komponen (relatif dari folder pages/)
function urlPemantauan(jenis, id) {
    return `pemantauan.html?jenis=${jenis}&id=${id}`;
}

// Baris tabel daftar yang dapat diklik → Pemantauan (tombol aksi di baris itu tetap berfungsi sendiri)
function atributBarisPantau(jenis, id) {
    return ` class="baris-klik" data-pantau="${urlPemantauan(jenis, id)}"`;
}

// Judul komponen sebagai tautan ke Pemantauan (dapat dipakai dengan keyboard)
function judulPantauHtml(jenis, id, judulHtml) {
    return `<a class="link-pantau" href="${urlPemantauan(jenis, id)}" title="Lihat detail pengerjaan peserta">${judulHtml}</a>`;
}

// Klik baris tabel daftar (bukan tombol/tautan/isian di dalamnya) → halaman Pemantauan
function pasangKlikBarisPantau() {
    document.addEventListener('click', event => {
        const tr = event.target.closest('tr[data-pantau]');
        if (!tr || event.target.closest('a, button, input, select, textarea, label')) {
            return;
        }
        window.location.href = tr.dataset.pantau;
    });
}

// Tautan ke pengelolaan komponen (halaman yang sudah ada)
function tautanKelolaPemantauan(jenis, item) {
    if (jenis === 'modul') {
        return { href: `modul.html?id=${item.id}`, label: 'Detail & Edit Modul' };
    }
    if (jenis === 'tugas') {
        return { href: `tugas.html?id=${item.id}`, label: 'Detail & Edit Tugas' };
    }
    if (jenis === 'aktivitas') {
        return { href: `evaluasi.html?jenis=aktivitas&id=${item.id}`, label: 'Detail & Edit Aktivitas' };
    }
    return { href: `kelola-soal.html?jenis=${jenis}&id=${item.id}`, label: 'Kelola Soal' };
}

// Info komponen (dt/dd) sesuai jenis
function infoKomponenPemantauan(data) {
    const { jenis, item, kelas, pertemuan } = data;
    const jadwal = pertemuan ? jadwalPertemuan(pertemuan) : null;
    const rows = [
        ['Mata Pelajaran', kelas ? escapeHtml(kelas.mapel) : '–'],
        ['Kelas', kelas ? escapeHtml(kelas.nama) : '–'],
        ['Pertemuan', pertemuan ? `Pertemuan ${pertemuan.nomor} · ${escapeHtml(pertemuan.judul)}${jadwal ? ` <span class="cell-meta">(${escapeHtml(formatRentangJadwal(jadwal))} · ${escapeHtml(statusPertemuan(pertemuan))})</span>` : ''}` : 'Tanpa pertemuan'],
        ['Status Komponen', escapeHtml(item.status)],
    ];
    if (JENIS_EVALUASI[jenis] && jenis !== 'aktivitas' || jenis === 'kuis') {
        const soal = jenis === 'kuis' ? getSoalKuis(item) : item.soal;
        rows.push(['Jumlah Soal', `${soal.length} soal`], ['Durasi', Number(item.durasi) ? `${item.durasi} menit` : 'Tanpa batas waktu']);
    }
    if (jenis === 'aktivitas') {
        const info = TIPE_AKTIVITAS[item.tipe];
        rows.push(['Jenis Aktivitas', info ? `${info.ikon} ${escapeHtml(info.label)}` : '–']);
    }
    if (jenis === 'modul') {
        rows.push(['Format', escapeHtml(item.format)]);
    }
    if (jenis === 'tugas') {
        rows.push(['Deadline', escapeHtml(item.deadline ? formatDeadline(item.deadline) : 'Tanpa deadline')], ['Metode Pengumpulan', escapeHtml(METODE_TUGAS[item.metode] || METODE_TUGAS.keduanya)]);
    }
    const teks = jenis === 'modul' || jenis === 'kuis' || jenis === 'tugas' ? item.deskripsi : item.instruksi;
    rows.push([jenis === 'modul' || jenis === 'kuis' ? 'Deskripsi' : 'Instruksi', teks ? `<span class="pre-wrap">${escapeHtml(teks)}</span>` : '<span class="cell-muted">–</span>']);
    if (jenis === 'tugas' && item.soal) {
        rows.push(['Soal Tugas', `<span class="pre-wrap">${escapeHtml(item.soal)}</span>`]);
    }
    return rows.map(([l, v]) => `<div${['Instruksi', 'Deskripsi', 'Soal Tugas'].includes(l) ? ' class="full"' : ''}><dt>${escapeHtml(l)}</dt><dd>${v}</dd></div>`).join('');
}

// Kolom Nilai/Progres & Waktu untuk satu baris peserta
function selNilaiPemantauan(jenis, b) {
    const r = b.rekam;
    if (jenis === 'modul') {
        return b.status === 'Selesai' ? 'Ditandai selesai' : b.status === 'Sedang Dipelajari' ? 'Dibuka, belum selesai' : '–';
    }
    if (b.nilai === null || b.nilai === undefined) {
        return jenis === 'tugas' && r ? '<span class="cell-muted">Belum dinilai</span>' : '–';
    }
    const ulang = (jenis === 'latihan' || jenis === 'aktivitas') && r && r.percobaan ? `<p class="cell-meta">${r.percobaan}× percobaan</p>` : '';
    const benar = (jenis === 'pretest' || jenis === 'kuis') && r && r.total ? `<p class="cell-meta">${r.benar} / ${r.total} benar</p>` : '';
    return `<strong>${b.nilai}</strong>${benar}${ulang}`;
}

function selWaktuPemantauan(jenis, b) {
    const r = b.rekam;
    if (!r) {
        return '<span class="cell-muted">–</span>';
    }
    if (jenis === 'modul') {
        return `${r.dibuka ? `Dibuka ${formatTanggalWaktu(r.dibuka)}` : ''}${r.selesai ? `<p class="cell-meta">Selesai ${formatTanggalWaktu(r.selesai)}</p>` : ''}` || '–';
    }
    if (jenis === 'tugas') {
        return `${formatTanggalWaktu(r.dikumpulkan)}${r.terlambat ? '<p class="cell-meta status-inline-warning">Terlambat</p>' : ''}`;
    }
    if (r.status !== 'Selesai') {
        return `Mulai ${formatTanggalWaktu(r.mulai)}<p class="cell-meta">Belum dikirim</p>`;
    }
    const lama = lamaPengerjaan(r);
    return `${formatTanggalWaktu(r.selesai)}${lama ? `<p class="cell-meta">${escapeHtml(lama)}</p>` : ''}`;
}

function renderPemantauan() {
    const data = getPemantauan(pantauView.jenis, pantauView.id);
    document.getElementById('pm-tidak-ada').hidden = Boolean(data);
    document.getElementById('pm-konten').hidden = !data;
    const daftarUrl = (JENIS_PEMANTAUAN[pantauView.jenis] || JENIS_PEMANTAUAN.pretest).daftar;
    document.getElementById('pm-kembali-tidak-ada').href = daftarUrl;
    if (!data) {
        return null;
    }
    const { jenis, item, kelas, ringkasan: r } = data;
    const label = JENIS_PEMANTAUAN[jenis].label;
    setText('pm-eyebrow', `Pemantauan ${label}`);
    setText('pm-judul', item.judul);
    setText('pm-meta', `${kelas ? kelas.nama : '–'} · ${data.pertemuan ? `Pertemuan ${data.pertemuan.nomor}` : 'Tanpa pertemuan'} · ${r.terdaftar} peserta terdaftar`);
    document.getElementById('pm-kembali').href = daftarUrl;
    const kelola = tautanKelolaPemantauan(jenis, item);
    const linkKelola = document.getElementById('pm-kelola');
    linkKelola.href = kelola.href;
    linkKelola.lastChild.textContent = kelola.label;
    document.getElementById('pm-pengumpulan').hidden = jenis !== 'tugas';
    document.getElementById('pm-pengumpulan').href = `pengumpulan-tugas.html?id=${item.id}`;
    document.getElementById('pm-info').innerHTML = infoKomponenPemantauan(data);

    // Ringkasan
    const kataSudah = { modul: 'Selesai', aktivitas: 'Selesai', tugas: 'Mengumpulkan' }[jenis] || 'Sudah Mengerjakan';
    const kataSedang = jenis === 'modul' ? 'Sedang Dipelajari' : 'Sedang Mengerjakan';
    const kataBelum = { modul: 'Belum Membuka', tugas: 'Belum Mengumpulkan' }[jenis] || 'Belum Mengerjakan';
    setText('pm-stat-terdaftar', r.terdaftar);
    setText('pm-stat-terdaftar-info', kelas ? kelas.nama : '–');
    setText('pm-stat-sudah-label', kataSudah);
    setText('pm-stat-sudah', r.sudah);
    setText('pm-stat-sudah-info', jenis === 'tugas' ? `${r.dinilai} sudah dinilai` : `dari ${r.terdaftar} peserta`);
    setText('pm-stat-sedang-label', jenis === 'tugas' || jenis === 'aktivitas' ? 'Rata-rata Nilai' : kataSedang);
    const pakaiRata = jenis === 'tugas' || jenis === 'aktivitas';
    setText('pm-stat-sedang', pakaiRata ? (r.rataRata === null ? '–' : formatNilai(r.rataRata)) : r.sedang);
    setText('pm-stat-sedang-info', pakaiRata ? (r.bernilai ? `Dari ${r.bernilai} peserta${jenis === 'aktivitas' ? ' (nilai terbaik)' : ' dinilai'}` : 'Belum ada nilai') : jenis === 'modul' ? 'Dibuka, belum ditandai selesai' : 'Belum mengirim jawaban');
    setText('pm-stat-belum-label', kataBelum);
    setText('pm-stat-belum', r.belum);
    setText('pm-stat-belum-info', r.belum ? 'Tetap tercantum di tabel' : 'Semua peserta sudah');
    const rataEl = document.getElementById('pm-stat-rata-card');
    rataEl.hidden = pakaiRata || jenis === 'modul';
    setText('pm-stat-rata', r.rataRata === null ? '–' : formatNilai(r.rataRata));
    setText('pm-stat-rata-info', r.rataRata === null ? 'Belum ada nilai' : `Dari ${r.bernilai} peserta${jenis === 'latihan' ? ' (nilai terbaik)' : ''}`);

    // Filter status & kolom
    const filter = document.getElementById('pm-filter-status');
    if (filter.dataset.jenis !== jenis) {
        filter.dataset.jenis = jenis;
        filter.innerHTML = '<option value="">Semua Status</option>' + data.statusList.map(s => `<option>${escapeHtml(s)}</option>`).join('');
    }
    setText('pm-kolom-nilai', jenis === 'modul' ? 'Progres' : jenis === 'latihan' || jenis === 'aktivitas' ? 'Nilai Terbaik' : 'Nilai');
    setText('pm-kolom-waktu', jenis === 'tugas' ? 'Waktu Pengumpulan' : jenis === 'modul' ? 'Waktu Belajar' : 'Waktu Pengerjaan');
    const cari = pantauView.cari.trim().toLowerCase();
    const baris = data.baris
        .filter(b => !pantauView.status || b.status === pantauView.status)
        .filter(b => !cari || b.peserta.nama.toLowerCase().includes(cari) || String(b.peserta.nis).includes(cari));
    setText('pm-ringkasan', `${data.baris.length} peserta · menampilkan ${baris.length}`);
    document.getElementById('pm-table-body').innerHTML = baris.length ? baris.map((b, i) => `
        <tr${b.peserta.id === pantauView.pesertaId ? ' class="is-selected"' : ''}>
            <td class="col-no">${i + 1}</td>
            <td><p class="cell-title">${escapeHtml(b.peserta.nama)}</p><p class="cell-meta">NIS ${escapeHtml(b.peserta.nis)}</p></td>
            <td>${b.kelas ? escapeHtml(labelSingkat(b.kelas)) : '–'}${b.pindahKelas ? '<p class="cell-meta">sudah pindah kelas</p>' : ''}</td>
            <td>${badgePemantauan(b.status)}</td>
            <td class="num">${selNilaiPemantauan(jenis, b)}</td>
            <td>${selWaktuPemantauan(jenis, b)}</td>
            <td><button type="button" class="btn ${b.rekam ? 'btn-tonal' : 'btn-secondary'} btn-small" data-peserta="${b.peserta.id}">Lihat Detail</button></td>
        </tr>`).join('')
        : `<tr><td colspan="7" class="table-empty">${data.baris.length ? 'Tidak ada peserta yang cocok dengan pencarian/filter.' : 'Kelas ini belum memiliki peserta.'}</td></tr>`;
    return data;
}

// Isi detail pengerjaan satu peserta (hanya data yang benar-benar tersimpan)
function isiDetailPengerjaan(data, b) {
    const { jenis, item } = data;
    const r = b.rekam;
    const info = [
        ['Nama Peserta', `${escapeHtml(b.peserta.nama)} <span class="cell-muted">(NIS ${escapeHtml(b.peserta.nis)})</span>`],
        [JENIS_PEMANTAUAN[jenis].label, escapeHtml(item.judul)],
        ['Status', badgePemantauan(b.status)],
    ];
    let isi = '';
    const kosong = teks => `<p class="pm-kosong">${escapeHtml(teks)}</p>`;
    if (jenis === 'modul') {
        if (r) {
            info.push(['Pertama Dibuka', escapeHtml(formatTanggalWaktu(r.dibuka))], ['Ditandai Selesai', r.selesai ? escapeHtml(formatTanggalWaktu(r.selesai)) : '<span class="cell-muted">Belum</span>']);
        }
        isi = kosong(!r ? 'Peserta ini belum pernah membuka modul.'
            : r.status === 'Selesai' ? 'Peserta sudah menandai modul selesai.' : 'Peserta sudah membuka modul, tetapi belum menandainya selesai — belum dihitung selesai.')
            + '<p class="cell-meta">Aplikasi mencatat waktu modul pertama dibuka dan waktu ditandai selesai; persentase atau lama membaca tidak dicatat.</p>';
    } else if (jenis === 'tugas') {
        info.splice(2, 0, ['Instruksi', `<span class="pre-wrap">${escapeHtml(item.deskripsi || '–')}</span>`]);
        if (r) {
            info.push(
                ['Waktu Pengumpulan', `${escapeHtml(formatTanggalWaktu(r.dikumpulkan))}${r.terlambat ? ' <span class="status-inline-warning">(melewati deadline)</span>' : ''}`],
                ['Metode', escapeHtml(LABEL_METODE_JAWABAN[r.metode] || (r.teks ? LABEL_METODE_JAWABAN.ketik : LABEL_METODE_JAWABAN.upload))],
                ['Nilai', r.status === 'Dinilai' ? `<strong>${r.nilai}</strong>` : '<span class="cell-muted">Belum dinilai</span>'],
                ...(r.status === 'Dinilai' ? [['Feedback Pengajar', r.catatan ? escapeHtml(r.catatan) : '<span class="cell-muted">–</span>'], ['Dinilai', `${escapeHtml(formatTanggalWaktu(r.dinilaiPada))}${r.dinilaiOleh ? ` oleh ${escapeHtml(r.dinilaiOleh)}` : ''}`]] : []),
            );
            isi = `<h3 class="sub-judul">Jawaban Peserta</h3>${r.teks ? `<div class="materi-preview jawaban-peserta pre-wrap">${escapeHtml(r.teks)}</div>` : ''}${r.lampiran
                ? `<p>File jawaban: ${tautanLampiran(r.lampiran)}</p><div class="dok-preview" id="pm-detail-file"></div>`
                : r.teks ? '' : kosong('Tidak ada isi jawaban yang tersimpan.')}`;
        } else {
            isi = kosong(b.status === 'Tidak Mengumpulkan' ? 'Peserta tidak mengumpulkan tugas ini (tugas sudah ditutup).' : 'Peserta belum mengumpulkan tugas ini.');
        }
    } else if (jenis === 'aktivitas') {
        const tipe = TIPE_AKTIVITAS[item.tipe];
        info.splice(2, 0, ['Jenis Aktivitas', tipe ? `${tipe.ikon} ${escapeHtml(tipe.label)}` : '–']);
        if (r) {
            info.push(['Skor Terbaik', String(r.skorTerbaik ?? r.skor ?? '–')], ['Skor Percobaan Terakhir', String(r.skorTerakhir ?? r.skor ?? '–')], ['Percobaan', String(r.percobaan || 1)],
                ['Waktu Pengerjaan Terakhir', escapeHtml(formatDetik(r.durasiTerakhir))], ['Terakhir Dikerjakan', escapeHtml(formatTanggalWaktu(r.selesai))]);
            isi = rincianAktivitasHtml(item, r, 'Jawaban peserta');
        } else {
            isi = kosong('Peserta belum mengerjakan aktivitas ini.');
        }
    } else if (r) {
        const sedang = r.status !== 'Selesai';
        const lama = lamaPengerjaan(r);
        info.push(
            ['Mulai', escapeHtml(formatTanggalWaktu(r.mulai))],
            ['Selesai / Dikirim', sedang ? '<span class="cell-muted">Belum dikirim</span>' : escapeHtml(formatTanggalWaktu(r.selesai))],
            ...(lama && !sedang ? [['Waktu Pengerjaan', escapeHtml(lama)]] : []),
            ['Nilai', sedang ? '<span class="cell-muted">Belum dihitung (belum dikirim)</span>' : `<strong>${r.skor}</strong>`],
            ...(!sedang && r.total ? [['Benar / Salah / Tidak Dijawab', `${r.benar} / ${r.salah} / ${r.kosong} dari ${r.total} soal`]] : []),
            ...(jenis === 'latihan' ? [['Percobaan', String(r.percobaan || 1)], ['Nilai Terbaik', String(r.skorTerbaik ?? r.skor ?? '–')]] : []),
        );
        const catatan = jenis === 'latihan' && (r.percobaan || 1) > 1 ? `<p class="cell-meta">Yang ditampilkan adalah jawaban percobaan terakhir (percobaan ke-${r.percobaan}); aplikasi hanya menyimpan jawaban percobaan terakhir.</p>` : '';
        const catatanSedang = sedang ? '<p class="cell-meta status-inline-warning">Pengerjaan belum dikirim — jawaban di bawah adalah jawaban yang sudah tersimpan sejauh ini.</p>' : '';
        isi = Array.isArray(r.soal) && Array.isArray(r.jawaban)
            ? `<h3 class="sub-judul">Soal, Jawaban Peserta & Kunci</h3>${catatanSedang}${catatan}<ol class="review-list">${reviewSoalHtml(r.soal, r.jawaban, 'Jawaban peserta')}</ol>`
            : kosong('Rincian jawaban tidak tersedia karena hasil ini berasal dari data awal — hanya nilai yang tersimpan.');
    } else {
        isi = kosong(`Peserta belum mengerjakan ${JENIS_PEMANTAUAN[jenis].label.toLowerCase()} ini.`);
    }
    return { info, isi };
}

function bukaDetailPengerjaan(pesertaId) {
    const data = getPemantauan(pantauView.jenis, pantauView.id);
    const b = data ? data.baris.find(x => x.peserta.id === Number(pesertaId)) : null;
    if (!b) {
        tampilkanPesan('error', 'Data peserta tidak ditemukan atau Anda tidak memiliki akses.');
        return;
    }
    pantauView.pesertaId = b.peserta.id;
    const { info, isi } = isiDetailPengerjaan(data, b);
    setText('modal-pengerjaan-title', `Detail Pengerjaan — ${b.peserta.nama}`);
    document.getElementById('pm-detail-info').innerHTML = info.map(([l, v]) => `<div${['Instruksi'].includes(l) ? ' class="full"' : ''}><dt>${escapeHtml(l)}</dt><dd>${v}</dd></div>`).join('');
    document.getElementById('pm-detail-isi').innerHTML = isi;
    const file = document.getElementById('pm-detail-file');
    if (file && b.rekam && b.rekam.lampiran) {
        tampilkanFileTugas(file, b.rekam.lampiran, { judul: `File jawaban ${b.peserta.nama}` });
    }
    // Penilaian tugas: hanya bila ada pengumpulan (Pengajar kelas yang diampu & Admin, sesuai nilaiTugas)
    const form = document.getElementById('form-nilai-pantau');
    const bisaNilai = data.jenis === 'tugas' && Boolean(b.rekam);
    form.hidden = !bisaNilai;
    document.getElementById('pm-detail-tutup').hidden = bisaNilai;   // form penilaian punya tombol Tutup sendiri
    form.reset();
    ['nilai', 'catatan'].forEach(f => showFieldError(form, f, ''));
    if (bisaNilai) {
        form.elements.nilai.value = b.rekam.status === 'Dinilai' ? b.rekam.nilai : '';
        form.elements.catatan.value = b.rekam.catatan || '';
        setText('btn-simpan-nilai-pantau', b.rekam.status === 'Dinilai' ? 'Perbarui Penilaian' : 'Simpan Penilaian');
    }
    renderPemantauan();
    bukaModal('modal-pengerjaan');
}

function simpanNilaiPemantauan(event) {
    event.preventDefault();
    const form = event.target;
    const data = getPemantauan(pantauView.jenis, pantauView.id);
    const b = data && data.jenis === 'tugas' ? data.baris.find(x => x.peserta.id === pantauView.pesertaId) : null;
    if (!b || !b.rekam) {
        tutupModal();
        tampilkanPesan('error', 'Pengumpulan tugas tidak ditemukan.');
        return;
    }
    const hasil = nilaiTugas(b.rekam.id, form.elements.nilai.value, form.elements.catatan.value);
    if (!hasil.ok) {
        if (hasil.errors && Object.keys(hasil.errors).length) {
            tampilkanErrorForm(form, ['nilai', 'catatan'], hasil.errors);
        } else {
            tutupModal();
            tampilkanPesan('error', hasil.pesan);
        }
        return;
    }
    tutupModal();
    renderPemantauan();
    tampilkanPesan('success', `Penilaian tersimpan: nilai ${hasil.hasil.nilai} untuk ${b.peserta.nama} (terlihat di Tugas & Nilai Saya peserta).`);
}

function initPemantauanPage() {
    initModalUmum();
    const params = new URLSearchParams(window.location.search);
    pantauView.jenis = params.get('jenis');
    pantauView.id = Number(params.get('id'));
    const data = renderPemantauan();
    if (!data) {
        return;
    }
    document.title = `Pemantauan: ${data.item.judul} — DelLearn`;
    const search = document.getElementById('pm-search');
    search.addEventListener('input', () => {
        pantauView.cari = search.value;
        renderPemantauan();
    });
    const filter = document.getElementById('pm-filter-status');
    saatNilaiBerubah(filter, () => {
        pantauView.status = filter.value;
        renderPemantauan();
    });
    document.getElementById('pm-table-body').addEventListener('click', event => {
        const tombol = event.target.closest('button[data-peserta]');
        if (tombol) {
            sembunyikanPesan();
            bukaDetailPengerjaan(tombol.dataset.peserta);
        }
    });
    const form = document.getElementById('form-nilai-pantau');
    form.addEventListener('submit', simpanNilaiPemantauan);
    pantauPerbaikanForm(form, ['nilai', 'catatan'], () => {
        const errors = {};
        const err = cekBilanganBulat(form.elements.nilai.value, 'Nilai', 0, 100);
        if (err) {
            errors.nilai = err;
        }
        if (form.elements.catatan.value.trim().length > 500) {
            errors.catatan = 'Feedback maksimal 500 karakter.';
        }
        return errors;
    });
}

/* =========================
   9. INISIALISASI PER HALAMAN
========================= */

const PAGE_INIT = {
    'dashboard': initDashboardPage,
    'data-kelas': initDataKelasPage,
    'form-kelas': initFormKelasPage,
    'data-peserta': initDataPesertaPage,
    'data-pengajar': initDataPengajarPage,
    'pertemuan': initPertemuanPage,
    'modul': initModulPage,
    'tugas': initTugasPage,
    'kuis': initKuisPage,
    'to-pts': initTOPage,
    'to-pas': initTOPage,
    'detail-kelas': initDetailKelasPage,
    'rekap-nilai': initRekapNilaiPage,
    'login': initLoginPage,
    'dashboard-pengajar': initDashboardPengajarPage,
    'dashboard-peserta': initDashboardPesertaPage,
    'kelas-saya': initKelasSayaPage,
    'modul-saya': initModulSayaPage,
    'aktivitas-saya': () => initKomponenSayaPage('aktivitas'),
    'latihan-saya': () => initKomponenSayaPage('latihan'),
    'kuis-saya': initKuisSayaPage,
    'to-pts-saya': initTOSayaPage,
    'to-pas-saya': initTOSayaPage,
    'nilai-saya': initNilaiSayaPage,
    'pertemuan-saya': initPertemuanSayaPage,
    'baca-modul': initBacaModulPage,
    'tugas-saya': initTugasSayaPage,
    'kerjakan': initKerjakanPage,
    'kelola-soal': initKelolaSoalPage,
    'evaluasi': initEvaluasiPage,
    'pengumpulan-tugas': initPengumpulanTugasPage,
    'pemantauan': initPemantauanPage,
    'aktivitas': initAktivitasPage,
};

// Hanya dijalankan di browser (file ini juga diuji di Node tanpa document)
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Data lama di browser diperbarui ke skema terbaru (sekali saja, tanpa menghapus data)
        migrasiData();
        // Cek login & role dulu; bila ditolak, halaman dialihkan dan isinya tidak disiapkan
        if (!jagaHalaman()) {
            return;
        }
        const user = getCurrentUser();
        if (user) {
            terapkanTampilanRole(user);
        }
        initSidebarToggle();
        // Tombol unduh file tugas yang disimpan di penyimpanan file browser (tautanLampiran)
        document.addEventListener('click', event => {
            const tombol = event.target.closest('[data-unduh-file]');
            if (tombol) {
                unduhFileTugas(JSON.parse(tombol.dataset.unduhFile));
            }
        });
        // Baris daftar Pretest/Modul/Aktivitas/Latihan/Kuis/Tugas yang dapat diklik → Pemantauan
        pasangKlikBarisPantau();
        const init = PAGE_INIT[document.body.dataset.page];
        if (init) {
            init();
        }
        // Breadcrumb dinamis, riwayat navigasi sesi & tombol ← Kembali
        if (user && !halamanDialihkan) {
            renderNavigasi(user);
        }
    });

    // Tombol Back/Forward dapat menampilkan halaman dari cache browser tanpa memuat ulang script.
    // Cek session lagi agar halaman internal tidak terbuka setelah logout.
    window.addEventListener('pageshow', event => {
        if (event.persisted) {
            jagaHalaman();
        }
    });
}
