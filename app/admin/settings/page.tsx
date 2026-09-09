"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAppData } from "@/lib/AppDataContext";
import AdminHeader from "@/components/layout/AdminHeader";

type AdminUser = {
  id: number;
  username: string;
  password: string;
  kode: string;
  role: string;
};

const roleColor: Record<string, string> = {
  superadmin: "#f8fafc",
  Superadmin: "#f8fafc",
  "Ketua Kelas": "#facc15",
  "Wakil Ketua": "#60a5fa",
  "Sekretaris 1": "#38bdf8",
  "Sekretaris 2": "#22d3ee",
  "Bendahara 1": "#4ade80",
  "Bendahara 2": "#34d399",
  Keamanan: "#fb923c",
  "Kesehatan 1": "#f43f5e",
  "Kesehatan 2": "#fb7185",
  pengurus: "#94a3b8",
};

function colorOf(role: string) {
  return roleColor[role] || "#94a3b8";
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const { activityLog, maintenanceMode, setMaintenanceMode } = useAppData();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("admin-ok") !== "1") {
      router.replace("/admin");
      return;
    }
    void loadUsers();
  }, [router]);

  async function loadUsers() {
    setLoading(true);
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .order("id");
    if (error) alert(error.message);
    else setUsers((data as AdminUser[]) || []);
    setLoading(false);
  }

  function handleToggleMaintenance() {
    const nextState = !maintenanceMode;
    const confirmMsg = nextState
      ? "Aktifkan Mode Perbaikan (Maintenance)? Pengunjung tidak akan bisa mengakses website publik."
      : "Matikan Mode Perbaikan? Website publik akan kembali dibuka normal.";

    if (confirm(confirmMsg)) {
      setMaintenanceMode(nextState);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <AdminHeader />

      <div className="glass-card text-center">
        <div className="title-sub">SETTINGS ADMIN</div>
        <p style={{ fontSize: 11, color: "#94a3b8" }}>
          Pilih kartu → ganti username / password / kode unik
        </p>
      </div>

      {/* MODAL / STATUS MAINTENANCE (PINDAH KE SINI) */}
      <div
        className="glass-card"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 12,
          borderColor: maintenanceMode
            ? "rgba(244, 63, 94, 0.45)"
            : "rgba(74, 222, 128, 0.3)",
        }}
      >
        <div>
          <div
            style={{
              fontWeight: 800,
              fontSize: 12,
              color: maintenanceMode ? "#f43f5e" : "#4ade80",
            }}
          >
            {maintenanceMode ? "MODE PERBAIKAN ON" : "WEB PUBLIK AKTIF"}
          </div>
          <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>
            {maintenanceMode
              ? "Pengunjung hanya lihat teks perbaikan"
              : "Portal publik bisa dibuka normal"}
          </p>
        </div>
        <button
          type="button"
          className="btn-action-light"
          style={{
            fontSize: 10,
            padding: "6px 12px",
            borderRadius: 8,
            fontWeight: 700,
            background: maintenanceMode
              ? "rgba(34,197,94,0.2)"
              : "rgba(244,63,94,0.25)",
            color: maintenanceMode ? "#4ade80" : "#fda4af",
          }}
          onClick={handleToggleMaintenance}
        >
          {maintenanceMode ? "Matikan" : "Website sedang perbaikan"}
        </button>
      </div>

      {loading && (
        <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 12 }}>
          Memuat akun...
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {users.map((u) => {
          const c = colorOf(u.role);
          return (
            <Link
              key={u.id}
              href={"/admin/settings/" + u.id}
              className="glass-card"
              style={{
                textDecoration: "none",
                borderColor: c + "55",
                boxShadow: "0 0 12px " + c + "22",
                padding: 14,
              }}
            >
              <div
                style={{
                  fontWeight: 900,
                  fontSize: 14,
                  color: c,
                  marginBottom: 4,
                }}
              >
                {u.username}
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>
                Role:{" "}
                <span style={{ color: c, fontWeight: 800 }}>{u.role}</span>
                {" · "}
                Kode: {u.kode}
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 10,
                  color: "#60a5fa",
                  fontWeight: 700,
                }}
              >
                Edit akun →
              </div>
            </Link>
          );
        })}
      </div>

      {!loading && users.length === 0 && (
        <p style={{ textAlign: "center", color: "#64748b", fontSize: 12 }}>
          Belum ada akun di tabel admin_users
        </p>
      )}

      <div className="glass-card" style={{ marginTop: 2 }}>
        <div className="title-sub" style={{ marginBottom: 8 }}>
          LOG AKTIVITAS
        </div>
        <div style={{ maxHeight: 280, overflow: "auto" }}>
          {activityLog.length === 0 && (
            <p style={{ fontSize: 11, color: "#64748b" }}>Belum ada log</p>
          )}
          {activityLog.slice(0, 50).map((l) => (
            <div
              key={l.id}
              style={{
                fontSize: 10,
                padding: "6px 0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div style={{ fontWeight: 700, color: "#f8fafc" }}>{l.action}</div>
              <div style={{ color: "#64748b" }}>
                {l.user} · {l.at}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
