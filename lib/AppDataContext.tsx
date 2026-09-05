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
  defaultSiteContent,
  type Student,
  type KasTransaction,
  type PaymentHistory,
  type StatusHarian,
  type SiteContent,
  NOMINAL_KAS,
  getKasPaid as seedGetKasPaid,
} from "@/lib/data";
import { supabase } from "@/lib/supabase";

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
  siteContent: SiteContent;
  loading: boolean;
  setSiteContent: (c: SiteContent) => void;
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
  refreshFromDb: () => Promise<void>;
};

const Ctx = createContext<AppData | null>(null);

function currentAdminUser() {
  if (typeof window === "undefined") return "system";
  return sessionStorage.getItem("admin-user") || "admin";
}

function rowToStudent(r: Record<string, unknown>): Student {
  return {
    nama: String(r.nama ?? ""),
    gender: (r.gender === "P" ? "P" : "L") as "L" | "P",
    nisn: String(r.nisn ?? ""),
    nis: String(r.nis ?? ""),
    role: r.role ? String(r.role) : undefined,
    roleClass: r.role_class ? String(r.role_class) : undefined,
    icon: r.icon ? String(r.icon) : undefined,
    hadir: Number(r.hadir ?? 0),
    izin: Number(r.izin ?? 0),
    sakit: Number(r.sakit ?? 0),
    alpa: Number(r.alpa ?? 0),
  };
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
  const [siteContent, setSiteContentState] =
    useState<SiteContent>(defaultSiteContent);
  const [loading, setLoading] = useState(true);

  async function refreshFromDb() {
    try {
      const [
        stRes,
        attRes,
        paidRes,
        logRes,
        payRes,
        siteRes,
        setRes,
        actRes,
      ] = await Promise.all([
        supabase.from("students").select("*").order("nama"),
        supabase.from("attendance").select("*"),
        supabase.from("kas_paid").select("*"),
        supabase.from("kas_log").select("*").order("id"),
        supabase.from("payments").select("*").order("id", { ascending: false }),
        supabase.from("site_content").select("*").eq("id", 1).maybeSingle(),
        supabase.from("app_settings").select("*").eq("id", 1).maybeSingle(),
        supabase
          .from("activity_log")
          .select("*")
          .order("id", { ascending: false })
          .limit(100),
      ]);

      if (stRes.data?.length) {
        // urut seperti seed (nis) biar index absensi stabil
        const byNisn = new Map(
          stRes.data.map((r) => [String(r.nisn), rowToStudent(r)])
        );
        const ordered: Student[] = [];
        for (const s of seedStudents) {
          ordered.push(byNisn.get(s.nisn) ?? s);
          byNisn.delete(s.nisn);
        }
        byNisn.forEach((s) => ordered.push(s));
        setStudents(ordered);
      }

      if (attRes.data) {
        const map: Record<string, StatusHarian> = {};
        const list = stRes.data?.length
          ? stRes.data.map(rowToStudent)
          : seedStudents;
        // bangun index dari urutan students final nanti — pakai nisn key dulu
        for (const row of attRes.data) {
          const idx = list.findIndex((s) => s.nisn === row.nisn);
          if (idx < 0) continue;
          const key = idx + "-" + row.month_index + "-" + row.day;
          map[key] = row.status as StatusHarian;
        }
        setAttendanceMap(map);
      }

      if (paidRes.data) {
        const ov: Record<string, boolean> = {};
        for (const row of paidRes.data) {
          ov[String(row.nisn) + "-" + row.month_index] = !!row.paid;
        }
        setPaymentOverrides(ov);
      }

      if (logRes.data?.length) {
        setKasLog(
          logRes.data.map((r, i) => ({
            no: r.no ?? i + 1,
            date: r.date ?? "",
            desc: r.desc ?? "",
            type: r.type as "masuk" | "keluar",
            val: Number(r.val ?? 0),
            balance: Number(r.balance ?? 0),
          }))
        );
      }

      if (payRes.data?.length) {
        setPayments(
          payRes.data.map((r) => ({
            name: r.name ?? "",
            date: r.date ?? "",
            code: r.code ?? "",
            status: r.status ?? "",
            amount: Number(r.amount ?? 0),
          }))
        );
      }

      if (siteRes.data) {
        setSiteContentState({
          tagline: siteRes.data.tagline || defaultSiteContent.tagline,
          widgets: (siteRes.data.widgets as SiteContent["widgets"]) ||
            defaultSiteContent.widgets,
          news: (siteRes.data.news as SiteContent["news"]) || [],
        });
      }

      if (setRes.data) {
        setMaintenanceModeState(!!setRes.data.maintenance);
      }

      if (actRes.data?.length) {
        setActivityLog(
          actRes.data.map((r) => ({
            id: String(r.id),
            at: r.at || "",
            user: r.user_name || "",
            action: r.action || "",
          }))
        );
      }
    } catch (e) {
      console.error("refreshFromDb", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshFromDb();
  }, []);

  function pushLog(action: string) {
    const item: ActivityLogItem = {
      id: String(Date.now()) + Math.random().toString(36).slice(2, 6),
      at: new Date().toLocaleString("id-ID"),
      user: currentAdminUser(),
      action,
    };
    setActivityLog((prev) => [item, ...prev].slice(0, 200));
    void supabase.from("activity_log").insert({
      at: item.at,
      user_name: item.user,
      action: item.action,
    });
  }

  function setMaintenanceMode(value: boolean) {
    setMaintenanceModeState(value);
    void supabase
      .from("app_settings")
      .upsert({ id: 1, maintenance: value, updated_at: new Date().toISOString() });
    pushLog(
      value
        ? "Menyalakan mode Website Sedang Perbaikan"
        : "Mematikan mode Website Sedang Perbaikan"
    );
  }

  function setSiteContent(c: SiteContent) {
    setSiteContentState(c);
    void supabase.from("site_content").upsert({
      id: 1,
      tagline: c.tagline,
      widgets: c.widgets,
      news: c.news,
      updated_at: new Date().toISOString(),
    });
    pushLog("Update konten homepage");
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
      siteContent,
      loading,
      setSiteContent,
      setMaintenanceMode,
      pushLog,
      refreshFromDb,
      setStudents,
      updateStudent: (nisn, patch) => {
        setStudents((prev) =>
          prev.map((s) => (s.nisn === nisn ? { ...s, ...patch } : s))
        );
        const p = patch;
        void supabase
          .from("students")
          .update({
            ...(p.nama !== undefined ? { nama: p.nama } : {}),
            ...(p.nis !== undefined ? { nis: p.nis } : {}),
            ...(p.gender !== undefined ? { gender: p.gender } : {}),
            ...(p.role !== undefined ? { role: p.role || null } : {}),
            ...(p.roleClass !== undefined
              ? { role_class: p.roleClass || null }
              : {}),
            ...(p.icon !== undefined ? { icon: p.icon || null } : {}),
            ...(p.hadir !== undefined ? { hadir: p.hadir } : {}),
            ...(p.izin !== undefined ? { izin: p.izin } : {}),
            ...(p.sakit !== undefined ? { sakit: p.sakit } : {}),
            ...(p.alpa !== undefined ? { alpa: p.alpa } : {}),
            updated_at: new Date().toISOString(),
          })
          .eq("nisn", nisn);
        pushLog("Update siswa NISN " + nisn);
      },
      addStudent: (s) => {
        setStudents((prev) => [...prev, s]);
        void supabase.from("students").upsert({
          nisn: s.nisn,
          nis: s.nis || "",
          nama: s.nama,
          gender: s.gender,
          role: s.role || null,
          role_class: s.roleClass || null,
          icon: s.icon || null,
          hadir: s.hadir,
          izin: s.izin,
          sakit: s.sakit,
          alpa: s.alpa,
        });
        pushLog("Tambah siswa " + s.nama);
      },
      removeStudent: (nisn) => {
        setStudents((prev) => prev.filter((s) => s.nisn !== nisn));
        void supabase.from("students").delete().eq("nisn", nisn);
        pushLog("Hapus siswa NISN " + nisn);
      },
      addKasTransaction: (desc, type, val) => {
        setKasLog((prev) => {
          const last = prev[prev.length - 1]?.balance ?? 0;
          const balance = type === "masuk" ? last + val : last - val;
          const row = {
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
          };
          void supabase.from("kas_log").insert({
            no: row.no,
            date: row.date,
            desc: row.desc,
            type: row.type,
            val: row.val,
            balance: row.balance,
          });
          return [...prev, row];
        });
        pushLog("Log kas " + type + ": " + desc);
      },
      isKasPaid: (nisn, studentIndex, monthIndex) => {
        const key = nisn + "-" + monthIndex;
        if (paymentOverrides[key] !== undefined) return paymentOverrides[key];
        return seedGetKasPaid(studentIndex, monthIndex);
      },
      setKasPaid: (nisn, _studentIndex, monthIndex, paid) => {
        const key = nisn + "-" + monthIndex;
        setPaymentOverrides((prev) => ({ ...prev, [key]: paid }));
        void supabase.from("kas_paid").upsert(
          { nisn, month_index: monthIndex, paid },
          { onConflict: "nisn,month_index" }
        );
        pushLog((paid ? "LUNAS " : "BELUM ") + nisn + " bulan#" + monthIndex);
      },
      markKasPaid: (nama, nisn, monthIndex = 1) => {
        const key = nisn + "-" + monthIndex;
        setPaymentOverrides((prev) => ({ ...prev, [key]: true }));
        void supabase.from("kas_paid").upsert(
          { nisn, month_index: monthIndex, paid: true },
          { onConflict: "nisn,month_index" }
        );

        setKasLog((prev) => {
          const last = prev[prev.length - 1]?.balance ?? 0;
          const row = {
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
          };
          void supabase.from("kas_log").insert({
            no: row.no,
            date: row.date,
            desc: row.desc,
            type: row.type,
            val: row.val,
            balance: row.balance,
          });
          return [...prev, row];
        });

        const now = new Date();
        const hh = now.getHours().toString().padStart(2, "0");
        const mm = now.getMinutes().toString().padStart(2, "0");
        const pay = {
          name: nama,
          date: now.toLocaleDateString("id-ID") + " - " + hh + ":" + mm + " WIB",
          code: "Kas-TKJ5-" + nisn.substring(0, 5) + "-" + String(Date.now()),
          status: "LUNAS",
          amount: NOMINAL_KAS,
        };
        setPayments((prev) => [pay, ...prev]);
        void supabase.from("payments").insert(pay);
        pushLog("QRIS LUNAS " + nama);
      },
      setAttendanceCell: (studentIndex, monthIndex, day, status) => {
        const key = studentIndex + "-" + monthIndex + "-" + day;
        setAttendanceMap((prev) => ({ ...prev, [key]: status }));
        const nisn = students[studentIndex]?.nisn;
        if (nisn) {
          void supabase.from("attendance").upsert(
            {
              nisn,
              month_index: monthIndex,
              day,
              status,
            },
            { onConflict: "nisn,month_index,day" }
          );
        }
        pushLog(
          "Absensi #" + studentIndex + " m" + monthIndex + " d" + day + " → " + status
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
      siteContent,
      loading,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppData must be inside AppDataProvider");
  return ctx;
}
