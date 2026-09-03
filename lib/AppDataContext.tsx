"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  allStudents as seedStudents,
  kasTransactionsLog as seedKas,
  paymentHistoryLogs as seedPay,
  attendanceMap as seedAttendance,
  type Student,
  type KasTransaction,
  type PaymentHistory,
  type StatusHarian,
  NOMINAL_KAS,
  getKasPaid as seedGetKasPaid,
} from "@/lib/data";

export type ActivityLogItem = {
  id: string;
  at: string;
  user: string;
  action: string;
};

type AppData = {
  students: Student[];
  kasLog: KasTransaction[];
  payments: PaymentHistory[];
  paymentOverrides: Record<string, boolean>;
  attendanceMap: Record<string, StatusHarian>;
  maintenanceMode: boolean;
  activityLog: ActivityLogItem[];
  setMaintenanceMode: (value: boolean) => void;
  pushLog: (action: string) => void;
  setStudents: (s: Student[]) => void;
  updateStudent: (nisn: string, patch: Partial<Student>) => void;
  addStudent: (s: Student) => void;
  removeStudent: (nisn: string) => void;
  addKasTransaction: (
    desc: string,
    type: "masuk" | "keluar",
    val: number
  ) => void;
  markKasPaid: (nama: string, nisn: string, monthIndex?: number) => void;
  isKasPaid: (
    nisn: string,
    studentIndex: number,
    monthIndex: number
  ) => boolean;
  setKasPaid: (
    nisn: string,
    studentIndex: number,
    monthIndex: number,
    paid: boolean
  ) => void;
  setAttendanceCell: (
    studentIndex: number,
    monthIndex: number,
    day: number,
    status: StatusHarian
  ) => void;
  getAttendanceCell: (
    studentIndex: number,
    monthIndex: number,
    day: number
  ) => StatusHarian;
};

const Ctx = createContext<AppData | null>(null);
const STORAGE_KEY = "portal-tkj5-data-v1";

function currentAdminUser() {
  if (typeof window === "undefined") return "system";
  return sessionStorage.getItem("admin-user") || "admin";
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(seedStudents);
  const [kasLog, setKasLog] = useState<KasTransaction[]>(seedKas);
  const [payments, setPayments] = useState<PaymentHistory[]>(seedPay);
  const [paymentOverrides, setPaymentOverrides] = useState<
    Record<string, boolean>
  >({});
  const [attendanceMap, setAttendanceMap] = useState<
    Record<string, StatusHarian>
  >(seedAttendance || {});
  const [maintenanceMode, setMaintenanceModeState] = useState(false);
  const [activityLog, setActivityLog] = useState<ActivityLogItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (p.students) setStudents(p.students);
        if (p.kasLog) setKasLog(p.kasLog);
        if (p.payments) setPayments(p.payments);
        if (p.paymentOverrides) setPaymentOverrides(p.paymentOverrides);
        if (p.attendanceMap) setAttendanceMap(p.attendanceMap);
        if (typeof p.maintenanceMode === "boolean") {
          setMaintenanceModeState(p.maintenanceMode);
        }
        if (Array.isArray(p.activityLog)) setActivityLog(p.activityLog);
      }
      if (localStorage.getItem("tkj5-maintenance") === "1") {
        setMaintenanceModeState(true);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          students,
          kasLog,
          payments,
          paymentOverrides,
          attendanceMap,
          maintenanceMode,
          activityLog,
        })
      );
      localStorage.setItem("tkj5-maintenance", maintenanceMode ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [
    students,
    kasLog,
    payments,
    paymentOverrides,
    attendanceMap,
    maintenanceMode,
    activityLog,
    ready,
  ]);

  function setMaintenanceMode(value: boolean) {
    setMaintenanceModeState(value);
    setActivityLog((prev) =>
      [
        {
          id: String(Date.now()),
          at: new Date().toLocaleString("id-ID"),
          user: currentAdminUser(),
          action: value
            ? "Menyalakan mode Website Sedang Perbaikan"
            : "Mematikan mode Website Sedang Perbaikan",
        },
        ...prev,
      ].slice(0, 200)
    );
  }

  function pushLog(action: string) {
    setActivityLog((prev) =>
      [
        {
          id: String(Date.now()) + Math.random().toString(36).slice(2, 6),
          at: new Date().toLocaleString("id-ID"),
          user: currentAdminUser(),
          action,
        },
        ...prev,
      ].slice(0, 200)
    );
  }

  const value = useMemo<AppData>(
    () => ({
      students,
      kasLog,
      payments,
      paymentOverrides,
      attendanceMap,
      maintenanceMode,
      activityLog,
      setMaintenanceMode,
      pushLog,
      setStudents,
      updateStudent: (nisn, patch) => {
        setStudents((prev) =>
          prev.map((s) => (s.nisn === nisn ? { ...s, ...patch } : s))
        );
        pushLog("Update siswa NISN " + nisn);
      },
      addStudent: (s) => {
        setStudents((prev) => [...prev, s]);
        pushLog("Tambah siswa " + s.nama);
      },
      removeStudent: (nisn) => {
        setStudents((prev) => prev.filter((s) => s.nisn !== nisn));
        pushLog("Hapus siswa NISN " + nisn);
      },
      addKasTransaction: (desc, type, val) => {
        setKasLog((prev) => {
          const last = prev[prev.length - 1]?.balance ?? 0;
          const balance = type === "masuk" ? last + val : last - val;
          return [
            ...prev,
            {
              no: prev.length + 1,
              date: new Date().toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
              desc,
              type,
              val,
              balance,
            },
          ];
        });
        pushLog(
          "Log kas " + type + ": " + desc + " (" + val + ")"
        );
      },
      isKasPaid: (nisn, studentIndex, monthIndex) => {
        const key = nisn + "-" + monthIndex;
        if (paymentOverrides[key] !== undefined) return paymentOverrides[key];
        return seedGetKasPaid(studentIndex, monthIndex);
      },
      setKasPaid: (nisn, _studentIndex, monthIndex, paid) => {
        const key = nisn + "-" + monthIndex;
        setPaymentOverrides((prev) => ({ ...prev, [key]: paid }));
        pushLog(
          (paid ? "Centang LUNAS " : "Centang BELUM ") +
            nisn +
            " bulan#" +
            monthIndex
        );
      },
      markKasPaid: (nama, nisn, monthIndex = 1) => {
        const key = nisn + "-" + monthIndex;
        setPaymentOverrides((prev) => ({ ...prev, [key]: true }));

        setKasLog((prev) => {
          const last = prev[prev.length - 1]?.balance ?? 0;
          return [
            ...prev,
            {
              no: prev.length + 1,
              date: new Date().toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
              desc: "Setoran Kas Online QRIS - " + nama,
              type: "masuk" as const,
              val: NOMINAL_KAS,
              balance: last + NOMINAL_KAS,
            },
          ];
        });

        const now = new Date();
        const hh = now.getHours().toString().padStart(2, "0");
        const mm = now.getMinutes().toString().padStart(2, "0");
        setPayments((prev) => [
          {
            name: nama,
            date:
              now.toLocaleDateString("id-ID") +
              " - " +
              hh +
              ":" +
              mm +
              " WIB",
            code:
              "Kas-TKJ5-" +
              nisn.substring(0, 5) +
              "-" +
              String(Date.now()),
            status: "LUNAS",
            amount: NOMINAL_KAS,
          },
          ...prev,
        ]);
        pushLog("QRIS LUNAS " + nama + " (" + nisn + ")");
      },
      setAttendanceCell: (studentIndex, monthIndex, day, status) => {
        const key = studentIndex + "-" + monthIndex + "-" + day;
        setAttendanceMap((prev) => ({ ...prev, [key]: status }));
        pushLog(
          "Absensi index#" +
            studentIndex +
            " bulan#" +
            monthIndex +
            " tgl " +
            day +
            " → " +
            status
        );
      },
      getAttendanceCell: (studentIndex, monthIndex, day) => {
        const key = studentIndex + "-" + monthIndex + "-" + day;
        return attendanceMap[key] ?? "-";
      },
    }),
    [
      students,
      kasLog,
      payments,
      paymentOverrides,
      attendanceMap,
      maintenanceMode,
      activityLog,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppData must be inside AppDataProvider");
  return ctx;
  }
