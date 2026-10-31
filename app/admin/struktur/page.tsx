"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppData } from "@/lib/AppDataContext";
import { supabase } from "@/lib/supabase";
import AdminHeader from "@/components/layout/AdminHeader";

const ROLES = [
  "Ketua Kelas",
  "Wakil Ketua",
  "Sekretaris 1",
  "Sekretaris 2",
  "Bendahara 1",
  "Bendahara 2",
  "Keamanan",
  "Kesehatan 1",
  "Kesehatan 2",
] as const;

const roleIcon: Record<string, string> = {
  "Ketua Kelas": "fa-crown",
  "Wakil Ketua": "fa-user-shield",
  "Sekretaris 1": "fa-file-pen",
  "Sekretaris 2": "fa-file-pen",
  "Bendahara 1": "fa-wallet",
  "Bendahara 2": "fa-wallet",
  Keamanan: "fa-shield-halved",
  "Kesehatan 1": "fa-heart-pulse",
  "Kesehatan 2": "fa-heart-pulse",
};

export default function AdminStrukturPage() {
  const router = useRouter();
  const { students, updateStudent, pushLog, currentUser, authInitialized, siteContent, setSiteContent } = useAppData();
  
  const [wali, setWali] = useState("Shendy Nuria Feriansyah, S.Pd");
  const [periode, setPeriode] = useState("PERIODE 2026/2027");
  const [jumlahAnggota, setJumlahAnggota] = useState("9 ANGGOTA INTI");
  const [busy, setBusy] = useState(false);

  // --- PROTEKSI RUTE & AUTH GUARD ---
  useEffect(() => {
    if (!authInitialized) return;

    if (!currentUser && sessionStorage.getItem("admin-ok") !== "1") {
      router.replace("/admin");
      return;
    }

    // Ambil data wali kelas dari supabase app_settings
    void supabase
      .from("app_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        const w = (data as { wali_nama?: string } | null)?.wali_nama;
        if (w) setWali(w);
      });
  }, [authInitialized, currentUser, router]);

  // Sinkronisasi data dari siteContent (yang nempel di state global / database)
  useEffect(() => {
    if (siteContent.strukturPeriode) setPeriode(siteContent.strukturPeriode);
    if (siteContent.strukturAnggota) setJumlahAnggota(siteContent.strukturAnggota);
  }, [siteContent]);

  function whoHas(role: string) {
    return (
      students.find((s) => (s.role || "").trim() === role)?.nisn || ""
    );
  }

  async function assignRole(role: string, nisn: string) {
    setBusy(true);
    try {
      const prev = students.find((s) => (s.role || "").trim() === role);
      if (prev && prev.nisn !== nisn) {
        await updateStudent(prev.nisn, {
          role: undefined,
          roleClass: undefined,
          icon: undefined,
        });
      }
      if (nisn) {
        const target = students.find((s) => s.nisn === nisn);
        if (target?.role && target.role !== role) {
          await updateStudent(nisn, {
            role: undefined,
            roleClass: undefined,
            icon: undefined,
          });
        }
        await updateStudent(nisn, {
          role,
          roleClass: role.toLowerCase().replace(/\s+/g, "-"),
          icon: roleIcon[role] || "fa-user",
        });
        pushLog("Struktur: " + role + " → " + (target?.nama || nisn));
      }
    } finally {
      setBusy(false);
    }
  }

  async function saveWali() {
    setBusy(true);
    const { error } = await supabase.from("app_settings").upsert({
      id: 1,
      wali_nama: wali.trim(),
      updated_at: new Date().toISOString(),
    });
    setBusy(false);
    if (error) {
      alert(error.message);
      return;
    }
    pushLog("Update wali kelas: " + wali);
    alert("Wali kelas berhasil disimpan!");
  }

  async function saveStrukturInfo() {
    setBusy(true);
    try {
      await setSiteContent({
        ...siteContent,
        strukturPeriode: periode.trim(),
        strukturAnggota: jumlahAnggota.trim(),
      });
      pushLog("Update Periode & Jumlah Anggota Struktur");
      alert("Informasi Periode & Jumlah Anggota berhasil disimpan & langsung sinkron ke publik!");
    } finally {
      setBusy(false);
    }
  }

  if (!authInitialized || (!currentUser && sessionStorage.getItem("admin-ok") !== "1")) {
    return (
      <div style={{ textAlign: "center", padding: 40, color: "#94a3b8", fontSize: 12 }}>
        Memuat data struktur...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <AdminHeader />

      <div className="glass-card text-center">
        <div className="title-sub">STRUKTUR KEPENGURUSAN KELAS TKJ–5</div>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#FFFFFF", marginTop: 4 }}>
          Penggerak & Pengurus Utama Kelas TKJ-5 
        </p>
      </div>

      {/* PENGATURAN PERIODE & JUMLAH ANGGOTA (Bisa diketik & disimpan fleksibel) */}
      <div
        className="glass-card"
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <div style={{ fontSize: 11, color: "#60a5fa", fontWeight: 800 }}>
          PENGATURAN PERIODE & JUMLAH ANGGOTA
        </div>

        <div>
          <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, marginBottom: 4 }}>
            TULISAN PERIODE (Badge Kiri)
          </div>
          <input
            className="search-box expanded"
            style={{ width: "100%", padding: 10 }}
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
            placeholder="Contoh: PERIODE 2026/2027"
          />
        </div>

        <div>
          <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, marginBottom: 4 }}>
            TULISAN JUMLAH ANGGOTA (Badge Kanan)
          </div>
          <input
            className="search-box expanded"
            style={{ width: "100%", padding: 10 }}
            value={jumlahAnggota}
            onChange={(e) => setJumlahAnggota(e.target.value)}
            placeholder="Contoh: 9 ANGGOTA INTI"
          />
        </div>

        <button
          type="button"
          className="btn-pay-qris"
          disabled={busy}
          onClick={() => void saveStrukturInfo()}
        >
          {busy ? "Menyimpan..." : "Simpan Periode & Anggota"}
        </button>
      </div>

      {/* Wali Kelas */}
      <div
        className="glass-card"
        style={{ display: "flex", flexDirection: "column", gap: 8 }}
      >
        <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 800 }}>
          WALI KELAS
        </div>
        <input
          className="search-box expanded"
          style={{ width: "100%", padding: 12 }}
          value={wali}
          onChange={(e) => setWali(e.target.value)}
        />
        <button
          type="button"
          className="btn-pay-qris"
          disabled={busy}
          onClick={() => void saveWali()}
        >
          {busy ? "Menyimpan..." : "Simpan wali kelas"}
        </button>
      </div>

      {/* Role selects */}
      {ROLES.map((role) => (
        <div key={role} className="glass-card" style={{ marginBottom: 4 }}>
          <div
            style={{
              fontWeight: 800,
              fontSize: 12,
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <i className={"fa-solid " + (roleIcon[role] || "fa-user")} />
            {role}
          </div>
          <select
            disabled={busy}
            value={whoHas(role)}
            onChange={(e) => void assignRole(role, e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 10,
              background: "#0f172a",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.12)",
              fontSize: 12,
            }}
          >
            <option value="">— Kosongkan —</option>
            {students.map((s) => (
              <option key={s.nisn} value={s.nisn}>
                {s.nama}
                {s.role && s.role !== role
                  ? " (sekarang: " + s.role + ")"
                  : ""}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
