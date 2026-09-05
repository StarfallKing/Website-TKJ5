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
  defaultSchedule,
  type Student,
  type KasTransaction,
  type PaymentHistory,
  type StatusHarian,
  type SiteContent,
  type ScheduleData,
  NOMINAL_KAS,
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
  schedule: ScheduleData;
  loading: boolean;
  setSiteContent: (c: SiteContent) => Promise<void>;
  setMaintenanceMode: (value: boolean) => Promise<void>;
  setSchedule: (s: ScheduleData) => Promise<void>;
  pushLog: (action: string) => void;
  setStudents: (s: Student[]) => void;
  updateStudent: (nisn: string, patch: Partial<Student>) => Promise<void>;
  addStudent: (s: Student) => void;
  removeStudent: (nisn: string) => void;
  addKasTransaction: (
    desc: string,
    type: "masuk" | "keluar",
    val: number
  ) => void;
  markKasPaid: (nama: string, nisn: string, monthIndex?: number) => Promise<void>;
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
  ) => Promise<void>;
  setAttendanceCell: (
    studentIndex: number,
    monthIndex: number,
    day: number,
    status: StatusHarian
  ) => Promise<void>;
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
  const [schedule, setScheduleState] =
    useState<ScheduleData>(defaultSchedule);
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
        schedRes,
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
        supabase.from("schedule").select("*").eq("id", 1).maybeSingle(),
      ]);

      let ordered: Student[] = seedStudents;
      if (stRes.data?.length) {
        const byNisn = new Map(
          stRes.data.map((r) => [String(r.nisn), rowToStudent(r)])
        );
        ordered = [];
        for (const s of seedStudents) {
          ordered.push(byNisn.get(s.nisn) ?? s);
          byNisn.delete(s.nisn);
        }
        byNisn.forEach((s) => ordered.push(s));
        setStudents(ordered);
      }

      if (attRes.data) {
        const map: Record<string, StatusHarian> = {};
        for (const row of attRes.data) {
          const idx = ordered.findIndex((s) => s.nisn === row.nisn);
          if (idx < 0) continue;
          map[idx + "-" + row.month_index + "-" + row.day] =
            row.status as StatusHarian;
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
          widgets:
            (siteRes.data.widgets as SiteContent["widgets"]) ||
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

      if (schedRes.data?.data) {
        setScheduleState(schedRes.data.data as ScheduleData);
      }
    } catch (e) {
      console.error("refreshFromDb", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshFromDb();
  }, []);

  // REALTIME
  useEffect(() => {
    const channel = supabase
      .channel("portal-tkj5")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "students" },
        () => void refreshFromDb()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "kas_paid" },
        () => void refreshFromDb()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "attendance" },
        () => void refreshFromDb()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "kas_log" },
        () => void refreshFromDb()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_content" },
        () => void refreshFromDb()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "app_settings" },
        () => void refreshFromDb()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "schedule" },
        () => void refreshFromDb()
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
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

  async function setMaintenanceMode(value: boolean) {
    setMaintenanceModeState(value);
    const { error } = await supabase.from("app_settings").upsert({
      id: 1,
      maintenance: value,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      alert("Gagal maintenance: " + error.message);
      return;
    }
    pushLog(value ? "Maintenance ON" : "Maintenance OFF");
  }

  async function setSiteContent(c: SiteContent) {
    setSiteContentState(c);
    const { error } = await supabase.from("site_content").upsert({
      id: 1,
      tagline: c.tagline,
      widgets: c.widgets,
      news: c.news,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      alert("Gagal homepage: " + error.message);
      return;
    }
    pushLog("Update konten homepage");
  }

  async function setSchedule(s: ScheduleData) {
    setScheduleState(s);
    const { error } = await supabase.from("schedule").upsert({
      id: 1,
      data: s,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      alert("Gagal jadwal: " + error.message);
      return;
    }
    pushLog("Update jadwal pelajaran");
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
      schedule,
      loading,
      setSiteContent,
      setMaintenanceMode,
      setSchedule,
      pushLog,
      refreshFromDb,
      setStudents,

      updateStudent: async (nisn, patch) => {
        setStudents((prev) =>
          prev.map((s) => (s.nisn === nisn ? { ...s, ...patch } : s))
        );
        const p = patch;
        const { error } = await supabase
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
        if (error) {
          alert("Gagal siswa: " + error.message);
          return;
        }
        pushLog("Update siswa " + nisn);
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
        pushLog("Hapus siswa " + nisn);
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

      isKasPaid: (nisn, _si, monthIndex) =>
        paymentOverrides[nisn + "-" + monthIndex] === true,

      setKasPaid: async (nisn, _si, monthIndex, paid) => {
        setPaymentOverrides((prev) => ({
          ...prev,
          [nisn + "-" + monthIndex]: paid,
        }));
        const { error } = await supabase.from("kas_paid").upsert(
          { nisn, month_index: monthIndex, paid },
          { onConflict: "nisn,month_index" }
        );
        if (error) {
          alert("Gagal kas: " + error.message);
          return;
        }
        pushLog((paid ? "LUNAS " : "BELUM ") + nisn + " m" + monthIndex);
      },

      markKasPaid: async (nama, nisn, monthIndex = 1) => {
        setPaymentOverrides((prev) => ({
          ...prev,
          [nisn + "-" + monthIndex]: true,
        }));
        const { error: e1 } = await supabase.from("kas_paid").upsert(
          { nisn, month_index: monthIndex, paid: true },
          { onConflict: "nisn,month_index" }
        );
        if (e1) {
          alert(e1.message);
          return;
        }
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
        const pay = {
          name: nama,
          date:
            now.toLocaleDateString("id-ID") +
            " - " +
            now.getHours().toString().padStart(2, "0") +
            ":" +
            now.getMinutes().toString().padStart(2, "0") +
            " WIB",
          code: "Kas-TKJ5-" + nisn.substring(0, 5) + "-" + String(Date.now()),
          status: "LUNAS",
          amount: NOMINAL_KAS,
        };
        setPayments((prev) => [pay, ...prev]);
        void supabase.from("payments").insert(pay);
        pushLog("QRIS LUNAS " + nama);
      },

      setAttendanceCell: async (studentIndex, monthIndex, day, status) => {
        setAttendanceMap((prev) => ({
          ...prev,
          [studentIndex + "-" + monthIndex + "-" + day]: status,
        }));
        const nisn = students[studentIndex]?.nisn;
        if (!nisn) return;
        const { error } = await supabase.from("attendance").upsert(
          { nisn, month_index: monthIndex, day, status },
          { onConflict: "nisn,month_index,day" }
        );
        if (error) {
          alert("Gagal absensi: " + error.message);
          return;
        }
        pushLog("Absensi " + nisn + " → " + status);
      },

      getAttendanceCell: (studentIndex, monthIndex, day) =>
        attendanceMap[studentIndex + "-" + monthIndex + "-" + day] ?? "-",
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
      schedule,
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
