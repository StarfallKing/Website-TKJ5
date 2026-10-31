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
  const { students, updateStudent, pushLog, currentUser, authInitialized } = useAppData();
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

    void supabase
      .from("app_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        const settings = data as { wali_nama?: string; struktur_periode?: string; struktur_anggota?: string } | null;
        if (settings?.wali_nama) setWali(settings.wali_nama);
        if (settings?.struktur_periode) setPeriode(settings.struktur_periode);
        if (settings?.struktur_anggota) setJumlahAnggota(settings.struktur_anggota);
      });
  }, [authInitialized, currentUser, router]);

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

  async function saveSettings() {
    setBusy(true);
    const { error } = await supabase.from("app_settings").upsert({
      id: 1,
      wali_nama: wali.trim(),
      struktur_periode: periode.trim(),
      struktur_anggota: jumlahAnggota.trim(),
      updated_at: new Date().toISOString(),
    });
    setBusy(false);
    if (error) {
      alert(
        error.message +
          "\n(Jika kolom belum ada, jalankan SQL: alter table app_settings add column if not exists struktur_periode text, add column if not exists struktur_anggota text;)"
      );
      return;
    }
    pushLog("Update pengaturan struktur kelas");
    alert("Pengaturan struktur berhasil disimpan!");
  }

  // Prevent render jika status auth belum siap
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

      {/* Pengaturan Wali Kelas, Periode & Jumlah Anggota */}
      <div
        className="glass-card"
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <div style={{ fontSize: 11, color: "#60a5fa", fontWeight: 800 }}>
          PENGATURAN INFORMASI STRUKTUR
        </div>

        <div>
          <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, marginBottom: 4 }}>
            WALI KELAS
          </div>
          <input
            className="search-box expanded"
            style={{ width: "100%", padding: 10 }}
            value={wali}
            onChange={(e) => setWali(e.target.value)}
          />
        </div>

        <div>
          <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, marginBottom: 4 }}>
            PERIODE (Badge Kiri)
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
            JUMLAH ANGGOTA (Badge Kanan)
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
          onClick={() => void saveSettings()}
        >
          Simpan Pengaturan Struktur
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
              alignItems:---center,
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
            --  padding: 10,
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
