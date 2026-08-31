export type Student = {
  nama: string;
  gender: "L" | "P";
  nisn: string;
  role?: string;
  roleClass?: string;
  icon?: string;
  hadir: number;
  izin: number;
  sakit: number;
  alpa: number;
};

export const allStudents: Student[] = [
  { nama: "AFFAN ASSAKHA", gender: "L", nisn: "0087654321", role: "Wakil Ketua", roleClass: "wakil", icon: "fa-user-shield", hadir: 28, izin: 0, sakit: 0, alpa: 0 },
  { nama: "AHMAD SANGAJI", gender: "L", nisn: "0081234002", hadir: 26, izin: 1, sakit: 1, alpa: 0 },
  { nama: "ALGI FAHRI TANJUNG", gender: "L", nisn: "0081234003", hadir: 24, izin: 2, sakit: 1, alpa: 1 },
  { nama: "ALVIS PRATAMA", gender: "L", nisn: "0081234004", hadir: 27, izin: 0, sakit: 1, alpa: 0 },
  { nama: "ARHAM FAUZI", gender: "L", nisn: "0081234005", hadir: 25, izin: 2, sakit: 1, alpa: 0 },
  { nama: "AZAM", gender: "L", nisn: "0081234006", hadir: 28, izin: 0, sakit: 0, alpa: 0 },
  { nama: "AZZAHRA PUTRI", gender: "P", nisn: "0081234007", role: "Kesehatan 2", roleClass: "kesehatan", icon: "fa-heart-pulse", hadir: 26, izin: 1, sakit: 1, alpa: 0 },
  { nama: "DEVANI RAMADHAN", gender: "L", nisn: "0081234008", hadir: 23, izin: 2, sakit: 1, alpa: 2 },
  { nama: "ERCHER APRILLIANO SUMADI", gender: "L", nisn: "0081234009", hadir: 27, izin: 1, sakit: 0, alpa: 0 },
  { nama: "FACHRIAL PUTRA ADITAMA", gender: "L", nisn: "0081234010", hadir: 28, izin: 0, sakit: 0, alpa: 0 },
  { nama: "FAIRUZ AHSAN FADHILLAH", gender: "L", nisn: "0081234011", hadir: 28, izin: 0, sakit: 0, alpa: 0 },
  { nama: "FARISKA DAVA SALSABIL", gender: "P", nisn: "0081234012", hadir: 27, izin: 1, sakit: 0, alpa: 0 },
  { nama: "FATHAN WAYFI AL AYUBI", gender: "L", nisn: "0081234013", role: "Kesehatan 1", roleClass: "kesehatan", icon: "fa-heart-pulse", hadir: 26, izin: 1, sakit: 1, alpa: 0 },
  { nama: "FHABYAN ARRYA RAMADAN", gender: "L", nisn: "0081234014", hadir: 28, izin: 0, sakit: 0, alpa: 0 },
  { nama: "HAFIZ FIRDAUS", gender: "L", nisn: "0081234015", hadir: 25, izin: 2, sakit: 1, alpa: 0 },
  { nama: "IRFAN DZAKI KHOERULLOH", gender: "L", nisn: "0081234567", role: "Ketua Kelas", roleClass: "ketua", icon: "fa-crown", hadir: 28, izin: 0, sakit: 0, alpa: 0 },
  { nama: "KHAERUSSALAM", gender: "L", nisn: "0081234017", hadir: 24, izin: 2, sakit: 1, alpa: 1 },
  { nama: "LUTHFI RAFFANZA CHAIRIAN", gender: "L", nisn: "0081234018", hadir: 26, izin: 1, sakit: 1, alpa: 0 },
  { nama: "M.ALIF RIDHWAN", gender: "L", nisn: "0081234019", hadir: 27, izin: 1, sakit: 0, alpa: 0 },
  { nama: "MONICKA SILVIA", gender: "P", nisn: "0081234020", role: "Bendahara 1", roleClass: "bendahara", icon: "fa-wallet", hadir: 28, izin: 0, sakit: 0, alpa: 0 },
  { nama: "MUHAMAD SYAPRAN ASSYAFIQ HASIBUAN", gender: "L", nisn: "0081234021", hadir: 25, izin: 1, sakit: 1, alpa: 1 },
  { nama: "MUHAMAD ARIEL SASMITA", gender: "L", nisn: "0081234022", hadir: 26, izin: 1, sakit: 1, alpa: 0 },
  { nama: "MUHAMAD FAUZAN FADILLAH", gender: "L", nisn: "0081234023", hadir: 27, izin: 0, sakit: 1, alpa: 0 },
  { nama: "MUHAMAD KHOIRUL FAZRI", gender: "L", nisn: "0081234024", hadir: 28, izin: 0, sakit: 0, alpa: 0 },
  { nama: "MUHAMAD SULTAN AL HAFIZH", gender: "L", nisn: "0081234025", hadir: 26, izin: 2, sakit: 0, alpa: 0 },
  { nama: "MUHAMMAD FADILLAH ADITIA PUTRA", gender: "L", nisn: "0081234026", hadir: 24, izin: 2, sakit: 1, alpa: 1 },
  { nama: "MUHAMMAD FAUZAN ASSYAKIR NOTO PAM", gender: "L", nisn: "0084567890", role: "Keamanan", roleClass: "keamanan", icon: "fa-shield-halved", hadir: 28, izin: 0, sakit: 0, alpa: 0 },
  { nama: "MUHAMMAD IHZA FAHREZI", gender: "L", nisn: "0081234028", role: "Bendahara 2", roleClass: "bendahara", icon: "fa-wallet", hadir: 27, izin: 1, sakit: 0, alpa: 0 },
  { nama: "MUHAMMAD RIZKY MAULIDAN", gender: "L", nisn: "0081234029", hadir: 26, izin: 1, sakit: 1, alpa: 0 },
  { nama: "NAZRIL ILHAM", gender: "L", nisn: "0081234030", hadir: 25, izin: 2, sakit: 1, alpa: 0 },
  { nama: "RADITYA PUTRA PRATAMA", gender: "L", nisn: "0081234031", hadir: 27, izin: 1, sakit: 0, alpa: 0 },
  { nama: "RAFFA ARDITIA PUTRA", gender: "L", nisn: "0081234032", hadir: 26, izin: 1, sakit: 1, alpa: 0 },
  { nama: "RAIDHATUL RAMADHAN", gender: "L", nisn: "0081234033", hadir: 27, izin: 1, sakit: 0, alpa: 0 },
  { nama: "RAKA SATRIA NOFPRIMA", gender: "L", nisn: "0081234034", hadir: 25, izin: 2, sakit: 1, alpa: 0 },
  { nama: "RAMA RIZKI PARNINGOTAN", gender: "L", nisn: "0081234035", hadir: 26, izin: 1, sakit: 1, alpa: 0 },
  { nama: "REGINA YUNIAR", gender: "P", nisn: "0082345678", role: "Sekretaris 1", roleClass: "sekretaris", icon: "fa-file-pen", hadir: 28, izin: 0, sakit: 0, alpa: 0 },
  { nama: "RESQY RAMADHANI", gender: "L", nisn: "0081234037", hadir: 27, izin: 1, sakit: 0, alpa: 0 },
  { nama: "RIZKI MAULANA", gender: "L", nisn: "0081234038", hadir: 26, izin: 1, sakit: 1, alpa: 0 },
  { nama: "SATRIA PUTRA PERDANA", gender: "L", nisn: "0081234039", hadir: 28, izin: 0, sakit: 0, alpa: 0 },
  { nama: "SUCI WULANDARI", gender: "P", nisn: "0083456789", hadir: 28, izin: 0, sakit: 0, alpa: 0 },
  { nama: "SYAVANA SABITUL AZMI", gender: "P", nisn: "0081234041", role: "Sekretaris 2", roleClass: "sekretaris", icon: "fa-file-pen", hadir: 27, izin: 1, sakit: 0, alpa: 0 },
  { nama: "VINCENT GABRIEL NAINGGOLAN", gender: "L", nisn: "0081234042", hadir: 26, izin: 1, sakit: 1, alpa: 0 },
  { nama: "ZIDRAM AIDIL ADHA", gender: "L", nisn: "0081234043", hadir: 27, izin: 1, sakit: 0, alpa: 0 },
];

export const NOMINAL_KAS = 5000;

export function getInitials(name: string) {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0].substring(0, 2).toUpperCase();
}

export function formatRupiah(val: number) {
  return "Rp " + val.toLocaleString("id-ID");
}

export type KasTransaction = {
  no: number;
  date: string;
  desc: string;
  type: "masuk" | "keluar";
  val: number;
  balance: number;
};

export const kasTransactionsLog: KasTransaction[] = [
  { no: 1, date: "02 Jul 2026", desc: "Saldo Sisa Kas Kelas Periode Lalu", type: "masuk", val: 150000, balance: 150000 },
  { no: 2, date: "05 Jul 2026", desc: "Pembelian Spidol & Penghapus Papan Tulis", type: "keluar", val: 35000, balance: 115000 },
  { no: 3, date: "10 Jul 2026", desc: "Setoran Kas Mingguan Juli (Minggu 1)", type: "masuk", val: 215000, balance: 330000 },
  { no: 4, date: "15 Jul 2026", desc: "Beli Alat Kebersihan & Sapu Kelas", type: "keluar", val: 85000, balance: 245000 },
  { no: 5, date: "18 Jul 2026", desc: "Setoran Kas Mingguan Juli (Minggu 2)", type: "masuk", val: 200000, balance: 445000 },
  { no: 6, date: "22 Jul 2026", desc: "Print Format Presensi & Mapel Kelas", type: "keluar", val: 20000, balance: 425000 },
  { no: 7, date: "25 Jul 2026", desc: "Setoran Kas Mingguan Juli (Minggu 3)", type: "masuk", val: 190000, balance: 615000 },
  { no: 8, date: "28 Jul 2026", desc: "Pembelian Kertas HVS & Map Administrasi", type: "keluar", val: 45000, balance: 570000 },
  { no: 9, date: "01 Agu 2026", desc: "Hadiah Juara Lomba Kebersihan Kelas", type: "masuk", val: 100000, balance: 670000 },
  { no: 10, date: "03 Agu 2026", desc: "Setoran Kas Mingguan Agustus (Minggu 1)", type: "masuk", val: 210000, balance: 880000 },
  { no: 11, date: "06 Agu 2026", desc: "Konsumsi Kerja Bakti Kebersihan Ruang TKJ-5", type: "keluar", val: 120000, balance: 760000 },
  { no: 12, date: "10 Agu 2026", desc: "Setoran Kas Mingguan Agustus (Minggu 2)", type: "masuk", val: 205000, balance: 965000 },
  { no: 13, date: "12 Agu 2026", desc: "Service & Refill Tinta Printer Kelas", type: "keluar", val: 65000, balance: 900000 },
  { no: 14, date: "15 Agu 2026", desc: "Setoran Kas Online QRIS - Affan Assakha", type: "masuk", val: 5000, balance: 905000 },
  { no: 15, date: "16 Agu 2026", desc: "Dekorasi Kelas HUT RI ke-81", type: "keluar", val: 175000, balance: 730000 },
  { no: 16, date: "18 Agu 2026", desc: "Setoran Kas Online QRIS - Irfan Dzaki", type: "masuk", val: 5000, balance: 735000 },
  { no: 17, date: "20 Agu 2026", desc: "Beli Galon Air Minum Kelas (2x)", type: "keluar", val: 38000, balance: 697000 },
  { no: 18, date: "21 Agu 2026", desc: "Setoran Kas Online QRIS - Suci Wulandari", type: "masuk", val: 5000, balance: 702000 },
  { no: 19, date: "22 Agu 2026", desc: "Pembelian Kabel HDMI & Adaptor Display", type: "keluar", val: 95000, balance: 607000 },
  { no: 20, date: "23 Agu 2026", desc: "Setoran Kas Online QRIS - Fhabyan Arrya", type: "masuk", val: 5000, balance: 612000 },
  { no: 21, date: "24 Agu 2026", desc: "Beli Obat-obatan P3K Kelas", type: "keluar", val: 42000, balance: 570000 },
  { no: 22, date: "24 Agu 2026", desc: "Setoran Kas Online QRIS - Regina Yuniar", type: "masuk", val: 5000, balance: 575000 },
  { no: 23, date: "25 Agu 2026", desc: "Pembelian Taplak Meja & Jam Dinding Kelas", type: "keluar", val: 68000, balance: 507000 },
  { no: 24, date: "25 Agu 2026", desc: "Setoran Kas Online QRIS - Azzahra Putri", type: "masuk", val: 5000, balance: 512000 },
  { no: 25, date: "26 Agu 2026", desc: "Beli Kemoceng & Stiker Inventaris", type: "keluar", val: 25000, balance: 487000 },
  { no: 26, date: "26 Agu 2026", desc: "Setoran Kas Online QRIS - M. Ihza Fahrezi", type: "masuk", val: 5000, balance: 492000 },
  { no: 27, date: "26 Agu 2026", desc: "Sumbangan Sosial Kasih Ibu", type: "keluar", val: 100000, balance: 392000 },
  { no: 28, date: "26 Agu 2026", desc: "Setoran Kas Online QRIS - Fathan Wayfi", type: "masuk", val: 5000, balance: 397000 },
  { no: 29, date: "26 Agu 2026", desc: "Beli Spidol Boardmarker Warna Blue & Red", type: "keluar", val: 28000, balance: 369000 },
  { no: 30, date: "26 Agu 2026", desc: "Setoran Kas Online QRIS - Satria Putra", type: "masuk", val: 5000, balance: 374000 },
];

export const monthShort = ["Jul", "Agu", "Sep", "Okt", "Nov", "Des", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun"];

export function getKasPaid(siswaIndex: number, monthIndex: number) {
  return ((siswaIndex * 17 + monthIndex * 31) % 100) < 82;
}

export type Lesson = { mapel: string; start: string; end: string };

export const masterSchedule: {
  pagi: Record<string, Lesson[]>;
  siang: Record<string, Lesson[]>;
} = {
  pagi: {
    Senin: [
      { mapel: "PAI", start: "06:30", end: "09:10" },
      { mapel: "ISTIRAHAT", start: "09:10", end: "09:40" },
      { mapel: "IPAS", start: "09:40", end: "12:00" },
    ],
    Selasa: [{ mapel: "LIBUR TANGGAL MERAH", start: "00:00", end: "23:59" }],
    Rabu: [
      { mapel: "WAWASAN DUNIA KERJA & K3LH", start: "06:30", end: "08:30" },
      { mapel: "PJOK", start: "08:30", end: "09:10" },
      { mapel: "ISTIRAHAT", start: "09:10", end: "09:40" },
      { mapel: "PJOK", start: "09:40", end: "10:50" },
      { mapel: "KEJURUAN TKJ", start: "10:50", end: "12:00" },
      { mapel: "B. INDONESIA - DARING", start: "14:00", end: "15:00" },
    ],
    Kamis: [
      { mapel: "B.INGGRIS", start: "06:30", end: "07:50" },
      { mapel: "MTK", start: "07:50", end: "09:10" },
      { mapel: "ISTIRAHAT", start: "09:10", end: "09:40" },
      { mapel: "SENI BUDAYA", start: "09:40", end: "10:50" },
      { mapel: "B. INDONESIA", start: "10:50", end: "12:00" },
      { mapel: "B. SUNDA - DARING", start: "14:00", end: "15:00" },
    ],
    Jumat: [
      { mapel: "KEJURUAN TKJ", start: "06:30", end: "07:50" },
      { mapel: "INFORMATIKA", start: "07:50", end: "09:10" },
      { mapel: "ISTIRAHAT", start: "09:10", end: "09:40" },
      { mapel: "WAWASAN DUNIA KERJA & K3LH", start: "09:40", end: "11:20" },
      { mapel: "SEJARAH - DARING", start: "14:00", end: "15:00" },
    ],
    Sabtu: [{ mapel: "LIBUR AKHIR PEKAN", start: "00:00", end: "23:59" }],
    Minggu: [{ mapel: "LIBUR AKHIR PEKAN", start: "00:00", end: "23:59" }],
  },
  siang: {
    Senin: [
      { mapel: "B. INGGRIS - DARING", start: "08:30", end: "09:30" },
      { mapel: "B. SUNDA", start: "12:30", end: "13:50" },
      { mapel: "IPAS", start: "13:50", end: "15:10" },
      { mapel: "ISTIRAHAT", start: "15:10", end: "15:40" },
      { mapel: "PAI", start: "15:40", end: "17:10" },
    ],
    Selasa: [
      { mapel: "IPAS - DARING", start: "08:30", end: "09:30" },
      { mapel: "KEJURUAN TKJ", start: "12:30", end: "13:50" },
      { mapel: "SEJARAH", start: "13:50", end: "15:10" },
      { mapel: "ISTIRAHAT", start: "15:10", end: "15:40" },
      { mapel: "MATEMATIKA", start: "15:40", end: "16:40" },
      { mapel: "B. INDONESIA", start: "16:40", end: "17:30" },
    ],
    Rabu: [
      { mapel: "KEJURUAN TKJ", start: "12:30", end: "13:50" },
      { mapel: "PJOK", start: "13:50", end: "15:10" },
      { mapel: "ISTIRAHAT", start: "15:10", end: "15:40" },
      { mapel: "PJOK", start: "15:40", end: "16:10" },
      { mapel: "WAWASAN DUNIA KERJA & K3LH", start: "16:10", end: "17:30" },
    ],
    Kamis: [
      { mapel: "SENI BUDAYA - DARING", start: "08:30", end: "09:30" },
      { mapel: "B. INDONESIA", start: "12:30", end: "13:50" },
      { mapel: "B. INGGRIS", start: "13:50", end: "15:10" },
      { mapel: "ISTIRAHAT", start: "15:10", end: "15:40" },
      { mapel: "MATEMATIKA", start: "15:40", end: "16:40" },
      { mapel: "PPKN", start: "16:40", end: "17:30" },
    ],
    Jumat: [
      { mapel: "INFORMATIKA - DARING", start: "08:30", end: "09:30" },
      { mapel: "WAWASAN DUNIA KERJA & K3LH", start: "13:00", end: "15:00" },
      { mapel: "KEJURUAN TKJ", start: "15:00", end: "15:40" },
      { mapel: "ISTIRAHAT", start: "15:40", end: "16:10" },
      { mapel: "INFORMATIKA", start: "16:10", end: "17:30" },
    ],
    Sabtu: [{ mapel: "LIBUR AKHIR PEKAN", start: "00:00", end: "23:59" }],
    Minggu: [{ mapel: "LIBUR AKHIR PEKAN", start: "00:00", end: "23:59" }],
  },
};

export const scheduleDays = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"] as const;

export const monthConfigs = [
  { name: "Juli 2026", days: 31 },
  { name: "Agustus 2026", days: 31 },
  { name: "September 2026", days: 30 },
  { name: "Oktober 2026", days: 31 },
  { name: "November 2026", days: 30 },
  { name: "Desember 2026", days: 31 },
  { name: "Januari 2027", days: 31 },
  { name: "Februari 2027", days: 28 },
  { name: "Maret 2027", days: 31 },
  { name: "April 2027", days: 30 },
  { name: "Mei 2027", days: 31 },
  { name: "Juni 2027", days: 30 },
];

export function getDailyStatus(
  studentIndex: number,
  day: number,
  mIndex: number
): "H" | "I" | "S" | "A" | "-" {
  if (day % 7 === 0 || day % 7 === 6) return "-";
  const seed = (studentIndex * 37 + day * 13 + mIndex * 19) % 100;
  if (seed < 85) return "H";
  if (seed < 92) return "I";
  if (seed < 97) return "S";
  return "A";
}

export type PaymentHistory = {
  name: string;
  date: string;
  code: string;
  status: string;
  amount: number;
};

export const paymentHistoryLogs: PaymentHistory[] = [
  {
    name: "Nama Siswa",
    date: "Tanggal - Jam WIB",
    code: "xxxxxxxxxxxxxxxxxx",
    status: "Tidak Ada",
    amount: 5000,
  },
  {
    name: "Nama Siswa",
    date: "Tanggal - Jam WIB",
    code: "xxxxxxxxxxxxxxxxxx",
    status: "Tidak Ada",
    amount: 5000,
  },
  {
    name: "Nama Siswa",
    date: "Tanggal - Jam WIB",
    code: "xxxxxxxxxxxxxxxxxx",
    status: "Tidak Ada",
    amount: 5000,
  },
  {
    name: "Nama Siswa",
    date: "Tanggal - Jam WIB",
    code: "xxxxxxxxxxxxxxxxxx",
    status: "Tidak Ada",
    amount: 5000,
  },
];
