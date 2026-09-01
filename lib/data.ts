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

/* ========== ABSENSI HARIAN (edit per index / bulan / tanggal) ========== */
export type StatusHarian = "H" | "I" | "S" | "A" | "-";

/**
 * Key: `\( {indexSiswa}- \){bulanIndex}-${tanggal}`
 * indexSiswa = urutan di allStudents (0 = Affan, 1 = Ahmad, ...)
 * bulanIndex: 0=Juli ... 11=Juni
 *
 * Contoh:
 * "0-0-15": "H"  → Affan, Juli tgl 15
 * "15-1-3": "S"  → Irfan (index 15), Agustus tgl 3
 */
export const attendanceMap: Record<string, StatusHarian> = {
  // "0-0-1": "H",
  // "0-0-2": "I",
};

export function attendanceKey(
  studentIndex: number,
  monthIndex: number,
  day: number
) {
  return `\( {studentIndex}- \){monthIndex}-${day}`;
}

/** Baca 1 hari. Belum diisi → "-" */
export function getDailyStatus(
  studentIndex: number,
  day: number,
  monthIndex: number
): StatusHarian {
  return attendanceMap[attendanceKey(studentIndex, monthIndex, day)] ?? "-";
}

export function setDailyStatus(
  studentIndex: number,
  monthIndex: number,
  day: number,
  status: StatusHarian
) {
  attendanceMap[attendanceKey(studentIndex, monthIndex, day)] = status;
}

export function sumMonthAttendance(
  studentIndex: number,
  monthIndex: number,
  daysInMonth: number
) {
  let hadir = 0,
    izin = 0,
    sakit = 0,
    alpa = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const st = getDailyStatus(studentIndex, d, monthIndex);
    if (st === "H") hadir++;
    else if (st === "I") izin++;
    else if (st === "S") sakit++;
    else if (st === "A") alpa++;
  }
  return { hadir, izin, sakit, alpa };
}

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

/** 30 baris tetap ada, data kosong */
export const kasTransactionsLog: KasTransaction[] = Array.from(
  { length: 30 },
  (_, i) => ({
    no: i + 1,
    date: "",
    desc: "",
    type: "masuk" as const,
    val: 0,
    balance: 0,
  })
);

export const monthShort = [
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
];

export function getKasPaid(siswaIndex: number, monthIndex: number) {
  return (siswaIndex * 17 + monthIndex * 31) % 100 < 82;
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
    Selasa: [
      { mapel: "B. INGGRIS", start: "06:30", end: "07:50" },
      { mapel: "MATEMATIKA", start: "07:50", end: "09:10" },
      { mapel: "ISTIRAHAT", start: "09:10", end: "09:40" },
      { mapel: "INFORMATIKA", start: "09:40", end: "10:50" },
      { mapel: "KEJURUAN TKJ", start: "10:50", end: "12:00" },
      { mapel: "PPKN - DARING", start: "14:00", end: "15:00" },
    ],
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
      { mapel: "KEJURUAN TKJ", start: "16:10", end: "16:40" },
      { mapel: "INFORMATIKA", start: "16:40", end: "17:30" },
    ],
    Sabtu: [{ mapel: "LIBUR AKHIR PEKAN", start: "00:00", end: "23:59" }],
    Minggu: [{ mapel: "LIBUR AKHIR PEKAN", start: "00:00", end: "23:59" }],
  },
};

export const scheduleDays = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
] as const;

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

export type PaymentHistory = {
  name: string;
  date: string;
  code: string;
  status: string;
  amount: number;
};

/** Histori QRIS kosong */
export const paymentHistoryLogs: PaymentHistory[] = [];
