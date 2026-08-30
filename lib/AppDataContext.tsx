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
  type Student,
  type KasTransaction,
  type PaymentHistory,
  NOMINAL_KAS,
  getKasPaid as seedGetKasPaid,
} from "@/lib/data";

type AppData = {
  students: Student[];
  kasLog: KasTransaction[];
  payments: PaymentHistory[];
  /** key: `\( {nisn}- \){monthIndex}` → true = lunas */
  paymentOverrides: Record<string, boolean>;
  setStudents: (s: Student[]) => void;
  updateStudent: (nisn: string, patch: Partial<Student>) => void;
  addStudent: (s: Student) => void;
  removeStudent: (nisn: string) => void;
  addKasTransaction: (desc: string, type: "masuk" | "keluar", val: number) => void;
  markKasPaid: (nama: string, nisn: string, monthIndex?: number) => void;
  /** Cek status bayar: override dulu, baru seed */
  isKasPaid: (nisn: string, studentIndex: number, monthIndex: number) => boolean;
};

const Ctx = createContext<AppData | null>(null);
const STORAGE_KEY = "portal-tkj5-data-v1";

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(seedStudents);
  const [kasLog, setKasLog] = useState<KasTransaction[]>(seedKas);
  const [payments, setPayments] = useState<PaymentHistory[]>(seedPay);
  const [paymentOverrides, setPaymentOverrides] = useState<Record<string, boolean>>({});
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
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ students, kasLog, payments, paymentOverrides })
    );
  }, [students, kasLog, payments, paymentOverrides, ready]);

  const value = useMemo<AppData>(
    () => ({
      students,
      kasLog,
      payments,
      paymentOverrides,
      setStudents,
      updateStudent: (nisn, patch) => {
        setStudents((prev) =>
          prev.map((s) => (s.nisn === nisn ? { ...s, ...patch } : s))
        );
      },
      addStudent: (s) => setStudents((prev) => [...prev, s]),
      removeStudent: (nisn) =>
        setStudents((prev) => prev.filter((s) => s.nisn !== nisn)),
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
      },
      isKasPaid: (nisn, studentIndex, monthIndex) => {
        const key = `\( {nisn}- \){monthIndex}`;
        if (paymentOverrides[key] !== undefined) return paymentOverrides[key];
        return seedGetKasPaid(studentIndex, monthIndex);
      },
      markKasPaid: (nama, nisn, monthIndex = 1) => {
        const key = `\( {nisn}- \){monthIndex}`;
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
              desc: `Setoran Kas Online QRIS - ${nama}`,
              type: "masuk",
              val: NOMINAL_KAS,
              balance: last + NOMINAL_KAS,
            },
          ];
        });

        const now = new Date();
        const time = `\( {now.getHours().toString().padStart(2, "0")}: \){now
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
        setPayments((prev) => [
          {
            name: nama,
            date: `${now.toLocaleDateString("id-ID")} - ${time} WIB`,
            code: `Kas-TKJ5-\( {nisn.substring(0, 5)}- \){Date.now()}`,
            status: "LUNAS",
            amount: NOMINAL_KAS,
          },
          ...prev,
        ]);
      },
    }),
    [students, kasLog, payments, paymentOverrides]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppData must be inside AppDataProvider");
  return ctx;
}