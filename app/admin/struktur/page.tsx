"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppData } from "@/lib/AppDataContext";
import { supabase } from "@/lib/supabase";

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
  const { students, updateStudent, pushLog } = useAppData();
  const [wali, setWali] = useState("Shendy Nuria Feriansyah, S.Pd");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("admin-ok") !== "1") {
      router.replace("/admin");
      return;
    }
    void supabase
      .from("app_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        const w = (data as { wali_nama?: string } | null)?.wali_nama;
        if (w) setWali(w);
      });
  }, [router]);

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
        // kalau siswa sudah punya role lain, lepas dulu
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
      alert(
        error.message +
          "\n(Jika kolom belum ada, jalankan di SQL: alter table app_settings add column if not exists wali_nama text;)"
      );
      return;
    }
    pushLog("Update wali kelas: " + wali);
    alert("Wali kelas disimpan");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="glass-card text-center">
        <div className="title-sub">EDIT STRUKTUR</div>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginTop: 4 }}>
          1 role = 1 siswa · sinkron ke bagan publik
        </p>
      </div>

      {/* Wali */}
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
          Simpan wali kelas
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

      <Link
        href="/admin/siswa"
        className="btn-action-light"
        style={{ textAlign: "center", fontSize: 11 }}
      >
        Atau edit detail lewat Data Siswa →
      </Link>
    </div>
  );
}
