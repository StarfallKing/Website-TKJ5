export type Student = {
  nama: string;
  gender: "L" | "P";
  nisn: string;
  nis: string;
  role?: string;
  roleClass?: string;
  icon?: string;
  hadir: number;
  izin: number;
  sakit: number;
  alpa: number;
};

/** Urutan absensi resmi tabel sekolah */
export const allStudents: Student[] = [
  { nama: "AFFAN ASSAKHA", gender: "L", nisn: "0102586557", nis: "26100171", role: "Wakil Ketua", roleClass: "wakil", icon: "fa-user-shield", hadir: 26, izin: 1, sakit: 1, alpa: 0 },
  { nama: "AHMAD SANGAJI", gender: "L", nisn: "0114660917", nis: "26100172", hadir: 28, izin: 0, sakit: 0, alpa: 0 },
  { nama: "ALGI FAHRI TANJUNG", gender: "L", nisn: "0105664301", nis: "26100173", hadir: 24, izin: 2, sakit: 1, alpa: 1 },
  { nama: "ALVIS PRATAMA", gender: "L", nisn: "0104776171", nis: "26100174", hadir: 27, izin: 0, sakit: 1, alpa: 0 },
  { nama: "ARHAM FAUZI", gender: "L", nisn: "3100382674", nis: "26100175", hadir: 25, izin: 2, sakit: 1, alpa: 0 },
  { nama: "AZAM", gender: "L", nisn: "0116022538", nis: "26100176", hadir: 28, izin: 0, sakit: 0, alpa: 0 },
  { nama: "AZZAHRA PUTRI", gender: "P", nisn: "3105448585", nis: "26100177", role: "Kesehatan 2", roleClass: "kesehatan", icon: "fa-heart-pulse", hadir: 26, izin: 1, sakit: 1, alpa: 0 },
  { nama: "DEVANI RAMADHAN", gender: "L", nisn: "0102029043", nis: "26100178", hadir: 23, izin: 2, sakit: 1, alpa: 2 },
  { nama: "ERCHER APRILLIANO SUMADI", gender: "L", nisn: "0117310882", nis: "26100179", hadir: 27, izin: 1, sakit: 0, alpa: 0 },
  { nama: "FACHRIAL PUTRA ADITAMA", gender: "L", nisn: "0119591677", nis: "26100180", hadir: 28, izin: 0, sakit: 0, alpa: 0 },
  { nama: "FAIRUZ AHSAN FADHILLAH", gender: "L", nisn: "0118287129", nis: "26100181", hadir: 28, izin: 0, sakit: 0, alpa: 0 },
  { nama: "FARISKA DAVA SALSABIL", gender: "P", nisn: "0102951337", nis: "26100182", hadir: 27, izin: 1, sakit: 0, alpa: 0 },
  { nama: "FATHAN WAYFI AL AYUBI", gender: "L", nisn: "0115346422", nis: "26100183", role: "Kesehatan 1", roleClass: "kesehatan", icon: "fa-heart-pulse", hadir: 26, izin: 1, sakit: 1, alpa: 0 },
  { nama: "FHABYAN ARRYA RAMADAN", gender: "L", nisn: "3108880524", nis: "26100184", hadir: 25, izin: 1, sakit: 1, alpa: 1 },
  { nama: "HAFIZ FIRDAUS", gender: "L", nisn: "0109626026", nis: "26100185", hadir: 28, izin: 0, sakit: 0, alpa: 0 },
  { nama: "IRFAN DZAKI KHOERULLOH", gender: "L", nisn: "0115535518", nis: "26100186", role: "Ketua Kelas", roleClass: "ketua", icon: "fa-crown", hadir: 24, izin: 2, sakit: 1, alpa: 1 },
  { nama: "KHAERUSSALAM", gender: "L", nisn: "3109820909", nis: "26100187", hadir: 27, izin: 0, sakit: 1, alpa: 0 },
  { nama: "LUTHFI RAFFANZA CHAIRIAN", gender: "L", nisn: "0117279674", nis: "26100188", hadir: 26, izin: 1, sakit: 0, alpa: 1 },
  { nama: "M.ALIF RIDHWAN", gender: "L", nisn: "0115656008", nis: "26100189", hadir: 25, izin: 2, sakit: 0, alpa: 1 },
  { nama: "MONICKA SILVIA", gender: "P", nisn: "0102193855", nis: "26100190", role: "Bendahara 1", roleClass: "bendahara", icon: "fa-wallet", hadir: 28, izin: 0, sakit: 0, alpa: 0 },
  { nama: "MUHAMAD ARIEL SASMITA", gender: "L", nisn: "0109211649", nis: "26100191", hadir: 27, izin: 1, sakit: 0, alpa: 0 },
  { nama: "MUHAMAD FAUZAN FADILLAH", gender: "L", nisn: "0102306580", nis: "26100192", hadir: 26, izin: 1, sakit: 1, alpa: 0 },
  { nama: "MUHAMAD KHOIRUL FAZRI", gender: "L", nisn: "0121671431", nis: "26100193", hadir: 25, izin: 1, sakit: 1, alpa: 1 },
  { nama: "MUHAMAD SULTAN AL HAFIZH", gender: "L", nisn: "0115341712", nis: "26100194", hadir: 28, izin: 0, sakit: 0, alpa: 0 },
  { nama: "MUHAMAD SYAPRAN ASSYAFIQ HASIBUAN", gender: "L", nisn: "0104306313", nis: "26100195", hadir: 24, izin: 2, sakit: 1, alpa: 1 },
  { nama: "MUHAMMAD FADILLAH ADITIA PUTRA", gender: "L", nisn: "3117264510", nis: "26100196", hadir: 27, izin: 0, sakit: 1, alpa: 0 },
  { nama: "MUHAMMAD FAUZAN ASSYAKIR NOTO PAMBUDI", gender: "L", nisn: "0101905489", nis: "26100197", role: "Keamanan", roleClass: "keamanan", icon: "fa-shield-halved", hadir: 26, izin: 1, sakit: 1, alpa: 0 },
  { nama: "MUHAMMAD IHZA FAHREZI", gender: "L", nisn: "3105342675", nis: "26100198", role: "Bendahara 2", roleClass: "bendahara", icon: "fa-wallet", hadir: 25, izin: 2, sakit: 0, alpa: 1 },
  { nama: "MUHAMMAD RIZKY MAULIDAN", gender: "L", nisn: "0106371904", nis: "26100199", hadir: 28, izin: 0, sakit: 0, alpa: 0 },
  { nama: "NAZRIL ILHAM", gender: "L", nisn: "0102640972", nis: "26100200", hadir: 23, izin: 2, sakit: 2, alpa: 1 },
  { nama: "RADITYA PUTRA PRATAMA", gender: "L", nisn: "0106597352", nis: "26100201", hadir: 27, izin: 1, sakit: 0, alpa: 0 },
  { nama: "RAFFA ARDITIA PUTRA", gender: "L", nisn: "0112384584", nis: "26100202", hadir: 26, izin: 1, sakit: 1, alpa: 0 },
  { nama: "RAIDHATUL RAMADHAN", gender: "L", nisn: "3108516400", nis: "26100203", hadir: 25, izin: 1, sakit: 1, alpa: 1 },
  { nama: "RAKA SATRIA NOFPRIMA", gender: "L", nisn: "0107177898", nis: "26100204", hadir: 28, izin: 0, sakit: 0, alpa: 0 },
  { nama: "RAMA RIZKI PARNINGOTAN", gender: "L", nisn: "0103709797", nis: "26100205", hadir: 24, izin: 2, sakit: 1, alpa: 1 },
  { nama: "REGINA YUNIAR", gender: "P", nisn: "0112248246", nis: "26100206", role: "Sekretaris 1", roleClass: "sekretaris", icon: "fa-pen", hadir: 27, izin: 1, sakit: 0, alpa: 0 },
  { nama: "RESQY RAMADHANI", gender: "L", nisn: "0108791730", nis: "26100207", hadir: 26, izin: 1, sakit: 1, alpa: 0 },
  { nama: "RIZKI MAULANA", gender: "L", nisn: "0115861612", nis: "26100208", hadir: 25, izin: 2, sakit: 0, alpa: 1 },
  { nama: "SATRIA PUTRA PERDANA", gender: "L", nisn: "3105990197", nis: "26100209", hadir: 28, izin: 0, sakit: 0, alpa: 0 },
  { nama: "SUCI WULANDARI", gender: "P", nisn: "0118305503", nis: "26100210", hadir: 26, izin: 1, sakit: 1, alpa: 0 },
  { nama: "SYAVANA SABITUL AZMI", gender: "P", nisn: "0115533645", nis: "26100211", role: "Sekretaris 2", roleClass: "sekretaris", icon: "fa-pen", hadir: 27, izin: 0, sakit: 1, alpa: 0 },
  { nama: "VINCENT GABRIEL NAINGGOLAN", gender: "L", nisn: "0118226076", nis: "26100212", hadir: 25, izin: 1, sakit: 1, alpa: 1 },
  { nama: "ZIDRAM AIDIL ADHA", gender: "L", nisn: "0091703516", nis: "26100213", hadir: 28, izin: 0, sakit: 0, alpa: 0 },
];

export type StatusHarian = "H" | "I" | "S" | "A" | "-";

export const attendanceMap: Record<string, StatusHarian> = {};

export function attendanceKey(
  studentIndex: number,
  monthIndex: number,
  day: number
) {
  return studentIndex + "-" + monthIndex + "-" + day;
}

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

export type NewsItem = {
  id: string;
  title: string;
  body: string;
  imageUrl: string;
  source: string; // teks sumber
  sourceUrl: string; // link (opsional)
};

export type SiteContent = {
  tagline: string;
  widgets: {
    muridLabel: string;
    muridSub: string;
    mapelLabel: string;
    mapelSub: string;
    ruangLabel: string;
    ruangSub: string;
    // Kas: label saja; nominal dari kasLog
    kasLabel: string;
  };
  news: NewsItem[];
};

export const defaultSiteContent: SiteContent = {
  tagline: "Transparansi Kehadiran, Kas, dan Informasi Resmi.",
  widgets: {
    muridLabel: "MURID",
    muridSub: "TOTAL : 43 SISWA",
    kasLabel: "KAS KELAS",
    mapelLabel: "MAPEL",
    mapelSub: "TOTAL : 13 MAPEL",
    ruangLabel: "INFO RUANG",
    ruangSub: "KELAS X TKJ – 5",
  },
  news: [
    {
      id: "1",
      title:
        "Pelantikan Kepala Sekolah SMK PGRI 2 Cibinong Periode 2026 – 2030",
      body:
        "Selamat atas dilantiknya Dr. Andi Hermawan, M.Pd sebagai Kepala SMK PGRI 2 Cibinong. Semoga amanah ini menjadi ladang...",
      imageUrl: "", // isi URL atau path /public/...
      source: "SMK PGRI 2 Cibinong",
      sourceUrl: "",
    },
  ],
};

/** Histori QRIS kosong */
export const paymentHistoryLogs: PaymentHistory[] = [];
