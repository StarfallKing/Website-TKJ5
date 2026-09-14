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
  paymentHistoryLogs as seedPay,
  attendanceMap as seedAttendance,
  defaultSiteContent,
  defaultSchedule,
  monthConfigs,
  type Student,
  type KasTransaction,
  type PaymentHistory,
  type StatusHarian,
  type SiteContent,
  type ScheduleData,
  NOMINAL_KAS,
} from "@/lib/data";
import { supabase } from "@/lib/supabase";

// --- TYPE DEFINITIONS MULTI-AKUN & SESI 6 BULAN ---
export type UserRole = "admin" | "ketua" | "sekretaris" | "bendahara" | "superadmin" | string;

export type UserAccount = {
  id: number;
  username: string;
  name?: string;
  password?: string;
  kode?: string;
  role: UserRole;
  roleClass?: string;
  avatar?: string;
};

export type UserSession = UserAccount & {
  expiresAt: number; // Timestamp kedaluwarsa 6 bulan
};

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
  // --- AUTH STATES & METHODS ---
  authInitialized: boolean;
  currentUser: UserSession | null;
  setCurrentUser: (user: UserAccount | null) => void;
  login: (account: UserAccount) => void;
  logout: () => void;
  // --- ACTION METHODS ---
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
  ) => Promise<void>;
  deleteKasTransactions: (keys: string[]) => Promise<void>;
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

const SIX_MONTHS_MS = 180 * 24 * 60 * 60 * 1000;
const SESSION_STORAGE_KEY = "portal_tkj5_session";

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

function normalizeKasRows(data: Record<string, unknown>[]): KasTransaction[] {
  const normalized = data
    .map((r, i) => ({
      no: Number(r.no ?? i + 1),
      date: String(r.date ?? ""),
      desc: String(r.desc ?? "").trim(),
      type: (r.type === "keluar" ? "keluar" : "masuk") as "masuk" | "keluar",
      val: Number(r.val ?? 0),
      balance: Number(r.balance ?? 0),
    }))
    .filter((r) => r.desc !== "" || r.val !== 0);

  return normalized.sort((a, b) => a.no - b.no);
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(seedStudents);
  const [kasLog, setKasLog] = useState<KasTransaction[]>([]);
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
  const [schedule, setScheduleState] = useState<ScheduleData>(defaultSchedule);
  const [loading, setLoading] = useState(true);

  // --- STATE AKUN LOGIN (PERSISTENT 6 BULAN) ---
  const [currentUser, setCurrentUserSession] = useState<UserSession | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(SESSION_STORAGE_KEY);
        if (saved) {
          const session: UserSession = JSON.parse(saved);
          const now = Date.now();
          if (now < session.expiresAt) {
            setCurrentUserSession(session);
            sessionStorage.setItem("admin-ok", "1");
          } else {
            localStorage.removeItem(SESSION_STORAGE_KEY);
            sessionStorage.removeItem("admin-ok");
            sessionStorage.removeItem("admin-user");
            sessionStorage.removeItem("admin-last");
          }
        }
      } catch (e) {
        console.error("Failed parsing session:", e);
      } finally {
        setAuthInitialized(true);
      }
    }
  }, []);

  const handleSetCurrentUser = (account: UserAccount | null) => {
    if (account) {
      const session: UserSession = {
        ...account,
        name: account.name || account.username,
        expiresAt: Date.now() + SIX_MONTHS_MS,
      };
      setCurrentUserSession(session);
      if (typeof window !== "undefined") {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
        sessionStorage.setItem("admin-ok", "1");
      }
    } else {
      setCurrentUserSession(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        sessionStorage.removeItem("admin-ok");
        sessionStorage.removeItem("admin-user");
        sessionStorage.removeItem("admin-last");
      }
    }
  };

  const login = (account: UserAccount) => {
    handleSetCurrentUser(account);
    pushLog(`Login Akun (${account.roleClass || account.role})`);
  };

  const logout = () => {
    if (currentUser) {
      pushLog(`Logout Akun (${currentUser.roleClass || currentUser.role})`);
    }
    handleSetCurrentUser(null);
  };

  function currentAdminUser() {
    return currentUser?.name || currentUser?.username || "system";
  }

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
        supabase.from("kas_log").select("*").order("id", { ascending: true }),
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

      if (logRes.error) console.error("kas_log load", logRes.error);
      if (actRes.error) console.error("activity_log load", actRes.error);

      let ordered: Student[] = seedStudents;
      if (stRes.data?.length) {
        const byNisn = new Map(
          stRes.data.map((r) => [String(r.nisn).trim(), rowToStudent(r)])
        );
        ordered = [];
        for (const s of seedStudents) {
          const cleanNisn = String(s.nisn).trim();
          ordered.push(byNisn.get(cleanNisn) ?? s);
          byNisn.delete(cleanNisn);
        }
        byNisn.forEach((s) => ordered.push(s));
        setStudents(ordered);
      }

      if (attRes.data) {
        const map: Record<string, StatusHarian> = {};
        for (const row of attRes.data) {
          // PERBAIKAN PENTING: PENGUBAHAN SAMAKAN TIPE DATA NISN STRING & TRIM
          const cleanRowNisn = String(row.nisn ?? "").trim();
          const idx = ordered.findIndex((s) => String(s.nisn).trim() === cleanRowNisn);
          if (idx < 0) continue;
          map[idx + "-" + Number(row.month_index) + "-" + Number(row.day)] =
            row.status as StatusHarian;
        }
        setAttendanceMap(map);
      }

      if (paidRes.data) {
        const ov: Record<string, boolean> = {};
        for (const row of paidRes.data) {
          ov[`${String(row.nisn).trim()}-${Number(row.month_index)}`] = Boolean(
            row.paid
          );
        }
        setPaymentOverrides(ov);
      }

      if (logRes.data) {
        setKasLog(normalizeKasRows(logRes.data as Record<string, unknown>[]));
      } else {
        setKasLog([]);
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
            at:
              r.at ||
              (r.created_at
                ? new Date(r.created_at).toLocaleString("id-ID")
                : ""),
            user: r.user_name || r.user || "admin",
            action: r.action || "",
          }))
        );
      } else {
        setActivityLog([]);
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
    let isMounted = true;
    const forceStopLoading = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 1500);

    async function loadData() {
      try {
        await refreshFromDb();
      } catch (err) {
        console.error("Gagal load dari DB:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
          clearTimeout(forceStopLoading);
        }
      }
    }

    void loadData();
    return () => {
      isMounted = false;
      clearTimeout(forceStopLoading);
    };
  }, []);

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
        { event: "*", schema: "public", table: "activity_log" },
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

    void supabase
      .from("activity_log")
      .insert({
        at: item.at,
        user_name: item.user,
        action: item.action,
      })
      .then(({ error }) => {
        if (error) {
          console.error("Gagal insert activity_log ke Supabase:", error);
        }
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
      alert("Gagal simpan jadwal: " + error.message);
      return;
    }
    alert("Jadwal berhasil diperbarui ke database!");
    pushLog("Update jadwal pelajaran");
  }

  async function addKasTransaction(
    desc: string,
    type: "masuk" | "keluar",
    val: number
  ) {
    const clean = desc.trim();
    const amount = Number(val);
    if (!clean || !amount || amount <= 0) {
      alert("Isi keterangan dan nominal > 0");
      return;
    }

    const lastBalance =
      kasLog.length > 0 ? kasLog[kasLog.length - 1].balance : 0;
    const balance =
      type === "masuk" ? lastBalance + amount : lastBalance - amount;
    const no = kasLog.length + 1;
    const date = new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const row: KasTransaction = {
      no,
      date,
      desc: clean,
      type,
      val: amount,
      balance,
    };

    setKasLog((prev) => [...prev, row]);

    const { error } = await supabase.from("kas_log").insert({
      no: row.no,
      date: row.date,
      desc: row.desc,
      type: row.type,
      val: row.val,
      balance: row.balance,
    });

    if (error) {
      console.error("kas_log insert", error);
      alert("Gagal simpan log kas: " + error.message);
      setKasLog((prev) => prev.filter((r) => r !== row));
      return;
    }

    pushLog("Log kas " + type + ": " + clean + " (" + amount + ")");
  }

  async function deleteKasTransactions(keys: string[]) {
    if (!keys.length) return;

    const nosToDelete = keys
      .map((k) => Number(k.split("-")[0]))
      .filter((n) => !isNaN(n));

    if (!nosToDelete.length) return;

    setKasLog((prev) => prev.filter((row) => !nosToDelete.includes(row.no)));

    const { error } = await supabase
      .from("kas_log")
      .delete()
      .in("no", nosToDelete);

    if (error) {
      console.error("kas_log delete", error);
      alert("Gagal menghapus log kas: " + error.message);
      void refreshFromDb();
      return;
    }

    pushLog("Hapus log kas sebanyak " + nosToDelete.length + " item");
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
      authInitialized,
      currentUser,
      setCurrentUser: handleSetCurrentUser,
      login,
      logout,
      setSiteContent,
      setMaintenanceMode,
      setSchedule,
      pushLog,
      refreshFromDb,
      setStudents,
      addKasTransaction,
      deleteKasTransactions,

      updateStudent: async (nisn, patch) => {
        const cleanNisn = String(nisn).trim();
        setStudents((prev) =>
          prev.map((s) => (String(s.nisn).trim() === cleanNisn ? { ...s, ...patch } : s))
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
          .eq("nisn", cleanNisn);
        if (error) {
          alert("Gagal siswa: " + error.message);
          return;
        }
        pushLog("Update siswa " + cleanNisn);
      },

      addStudent: (s) => {
        setStudents((prev) => [...prev, s]);
        void supabase.from("students").upsert({
          nisn: String(s.nisn).trim(),
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
        const cleanNisn = String(nisn).trim();
        setStudents((prev) => prev.filter((s) => String(s.nisn).trim() !== cleanNisn));
        void supabase.from("students").delete().eq("nisn", cleanNisn);
        pushLog("Hapus siswa " + cleanNisn);
      },

      isKasPaid: (nisn, _si, monthIndex) => {
        const cleanNisn = String(nisn ?? "").trim();
        const key = `${cleanNisn}-${Number(monthIndex)}`;
        return paymentOverrides[key] === true;
      },

      setKasPaid: async (nisn, _si, monthIndex, paid) => {
        const cleanNisn = String(nisn ?? "").trim();
        const mIdx = Number(monthIndex);
        const key = `${cleanNisn}-${mIdx}`;
        const wasPaid = paymentOverrides[key] === true;

        if (paid === wasPaid) return;

        setPaymentOverrides((prev) => ({
          ...prev,
          [key]: paid,
        }));

        const { error } = await supabase.from("kas_paid").upsert(
          { nisn: cleanNisn, month_index: mIdx, paid },
          { onConflict: "nisn,month_index" }
        );

        if (error) {
          alert("Gagal simpan kas ke DB: " + error.message);
          setPaymentOverrides((prev) => ({
            ...prev,
            [key]: wasPaid,
          }));
          return;
        }

        const siswa = students.find((s) => String(s.nisn).trim() === cleanNisn);
        const nama = siswa?.nama || cleanNisn;
        const bulan = monthConfigs[mIdx]?.name || "bulan#" + mIdx;

        pushLog((paid ? "LUNAS " : "BELUM ") + nama + " · " + bulan);
      },

      markKasPaid: async (nama, nisn, monthIndex = 1) => {
        const cleanNisn = String(nisn ?? "").trim();
        const mIdx = Number(monthIndex);
        const key = `${cleanNisn}-${mIdx}`;
        const wasPaid = paymentOverrides[key] === true;

        setPaymentOverrides((prev) => ({
          ...prev,
          [key]: true,
        }));

        const { error: e1 } = await supabase.from("kas_paid").upsert(
          { nisn: cleanNisn, month_index: mIdx, paid: true },
          { onConflict: "nisn,month_index" }
        );

        if (e1) {
          alert(e1.message);
          setPaymentOverrides((prev) => ({
            ...prev,
            [key]: wasPaid,
          }));
          return;
        }

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
          code:
            "Kas-TKJ5-" + cleanNisn.substring(0, 5) + "-" + String(Date.now()),
          status: "LUNAS",
          amount: NOMINAL_KAS,
        };
        setPayments((prev) => [pay, ...prev]);
        void supabase.from("payments").insert(pay);

        pushLog("QRIS LUNAS " + nama);
      },

      setAttendanceCell: async (studentIndex, monthIndex, day, status) => {
        const mIdx = Number(monthIndex);
        const dNum = Number(day);
        
        // Optimistic UI Update
        setAttendanceMap((prev) => ({
          ...prev,
          [studentIndex + "-" + mIdx + "-" + dNum]: status,
        }));

        const rawNisn = students[studentIndex]?.nisn;
        if (!rawNisn) return;
        const cleanNisn = String(rawNisn).trim();

        const { error } = await supabase.from("attendance").upsert(
          { nisn: cleanNisn, month_index: mIdx, day: dNum, status },
          { onConflict: "nisn,month_index,day" }
        );

        if (error) {
          console.error("Gagal simpan absensi:", error);
          alert("Gagal absensi: " + error.message);
          void refreshFromDb();
          return;
        }

        pushLog("Absensi " + cleanNisn + " → " + status);
      },

      getAttendanceCell: (studentIndex, monthIndex, day) => {
        const key = studentIndex + "-" + Number(monthIndex) + "-" + Number(day);
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
      schedule,
      loading,
      authInitialized,
      currentUser,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppData must be inside AppDataProvider");
  return ctx;
}
