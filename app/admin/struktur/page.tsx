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

  // State untuk melacak dropdown mana yang sedang terbuka (berdasarkan role name)
  const [openDropdownRole, setopenDropdownRole] = useState<string | null>(null);

  useEffect(() => {
    if (!authInitialized) return;

    if (!currentUser && sessionStorage.getItem("admin-ok") !== "1") {
      router.replace("/admin");
      return;
    }
  }, [authInitialized, currentUser, router]);

  useEffect(() => {
    if (siteContent.strukturPeriode) setPeriode(siteContent.strukturPeriode);
    if (siteContent.strukturAnggota) setJumlahAnggota(siteContent.strukturAnggota);
    if (siteContent.waliKelas) setWali(siteContent.waliKelas);
  }, [siteContent]);

  function whoHas(role: string) {
    const cleanRole = role.trim().toLowerCase();
    return (
      students.find((s) => (s.role || "").trim().toLowerCase() === cleanRole)?.nisn || ""
    );
  }

  // --- LOGIKA PERGANTIAN ROLE YANG BERSIH & ANTI-DOBEL ---
  async function assignRole(role: string, nisn: string) {
    setBusy(true);
    setopenDropdownRole(null); // Tutup dropdown setelah dipilih
    try {
      const cleanRole = role.trim().toLowerCase();

      if (!nisn) {
        // Jika opsi dikosongkan, hapus role dari semua siswa yang memegang role ini
        const holders = students.filter((s) => (s.role || "").trim().toLowerCase() === cleanRole);
        for (const h of holders) {
          await updateStudent(h.nisn, {
            role: undefined,
            roleClass: undefined,
            icon: undefined,
          });
        }
        pushLog("Struktur: Kosongkan " + role);
        alert(`Posisi ${role} berhasil dikosongkan.`);
        return;
      }

      const targetStudent = students.find((s) => s.nisn === nisn);
      if (!targetStudent) return;

      // 1. Bersihkan dulu SEMUA siswa lain yang mungkin memegang role ini (mencegah dobel role)
      const existingHolders = students.filter((s) => (s.role || "").trim().toLowerCase() === cleanRole && s.nisn !== nisn);
      for (const h of existingHolders) {
        await updateStudent(h.nisn, {
          role: undefined,
          roleClass: undefined,
          icon: undefined,
        });
      }

      // 2. Jika siswa yang dipilih ini punya role lain di tempat berbeda, lepaskan role lamanya dulu
      if (targetStudent.role && targetStudent.role.trim().toLowerCase() !== cleanRole) {
        await updateStudent(nisn, {
          role: undefined,
          roleClass: undefined,
          icon: undefined,
        });
      }

      // 3. Berikan role baru ke siswa yang dipilih
      await updateStudent(nisn, {
        role,
        roleClass: role.toLowerCase().replace(/\s+/g, "-"),
        icon: roleIcon[role] || "fa-user",
      });

      pushLog("Struktur: " + role + " → " + targetStudent.nama);
      alert(`Berhasil menetapkan ${targetStudent.nama} sebagai ${role}!`);
    } catch (err: any) {
      alert("Gagal memperbarui struktur: " + (err.message || err));
    } finally {
      setBusy(false);
    }
  }

  async function saveWali() {
    setBusy(true);
    try {
      const { error } = await supabase.from("app_settings").upsert({
        id: 1,
        wali_nama: wali.trim(),
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      
      await setSiteContent({
        ...siteContent,
        waliKelas: wali.trim(),
      });
      
      pushLog("Update wali kelas: " + wali);
      alert("Wali kelas berhasil disimpan & langsung sinkron!");
    } catch (err: any) {
      alert("Gagal simpan wali kelas: " + (err.message || err));
    } finally {
      setBusy(false);
    }
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

      {/* CUSTOM DROPDOWN SELECTOR UNTUK SISWA PENGURUS */}
      {ROLES.map((role) => {
        const currentNisn = whoHas(role);
        const currentStudent = students.find((s) => s.nisn === currentNisn);
        const isOpen = openDropdownRole === role;

        return (
          <div key={role} className="glass-card" style={{ marginBottom: 4, position: "relative" }}>
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

            {/* Kotak Trigger Custom */}
            <div
              onClick={() => !busy && setopenDropdownRole(isOpen ? null : role)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 12,
                background: "rgba(15, 23, 42, 0.95)",
                color: "#f8fafc",
                border: "1.5px solid rgba(96, 165, 250, 0.35)",
                fontSize: 12,
                fontWeight: 700,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                boxShadow: "inset 0 1px 2px rgba(255,255,255,0.08)",
              }}
            >
              <span>{currentStudent ? currentStudent.nama : "— Kosongkan —"}</span>
              <i className={`fa-solid fa-chevron-${isOpen ? "up" : "down"}`} style={{ color: "#60a5fa", fontSize: 10 }} />
            </div>

            {/* Dropdown Menu Kustom (Gaya Glassmorphism) */}
            {isOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  marginTop: 6,
                  maxHeight: 240,
                  overflowY: "auto",
                  background: "#0b0f19",
                  border: "1.5px solid rgba(96, 165, 250, 0.4)",
                  borderRadius: 12,
                  zIndex: 99,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.8)",
                }}
              >
                <div
                  onClick={() => void assignRole(role, "")}
                  style={{
                    padding: "10px 14px",
                    fontSize: 12,
                    color: "#f87171",
                    fontWeight: 700,
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    cursor: "pointer",
                  }}
                >
                  — Kosongkan / Lepas Jabatan —
                </div>

                {students.map((s) => {
                  const isSelected = s.nisn === currentNisn;
                  return (
                    <div
                      key={s.nisn}
                      onClick={() => void assignRole(role, s.nisn)}
                      style={{
                        padding: "10px 14px",
                        fontSize: 12,
                        color: isSelected ? "#38bdf8" : "#e2e8f0",
                        fontWeight: isSelected ? 800 : 600,
                        background: isSelected ? "rgba(56, 189, 248, 0.15)" : "transparent",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>{s.nama}</span>
                      {s.role && s.role.trim().toLowerCase() !== role.trim().toLowerCase() && (
                        <span style={{ fontSize: 9, color: "#fb923c", fontStyle: "italic" }}>
                          (Jabat: {s.role})
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
      }
    
