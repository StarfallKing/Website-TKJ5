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
  const { activityLog, maintenanceMode, setMaintenanceMode, currentUser, loading: appLoading, students } = useAppData();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appLoading && !currentUser && sessionStorage.getItem("admin-ok") !== "1") {
      router.replace("/admin");
      return;
    }
    void loadUsers();
  }, [currentUser, appLoading, router]);

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
      void setMaintenanceMode(nextState);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingBottom: 60 }}>
      <AdminHeader />

      <div className="glass-card text-center">
        <div className="title-sub">STRUKTUR AKUN PERANGKAT KELAS</div>
        <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
          Pilih kartu perangkat → ganti username / password / kode unik
        </p>
      </div>

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
          Memuat struktur akun...
        </p>
      )}

      {/* TAMPILAN CARD STRUKTUR ORGANISASI ADMIN */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 10,
        }}
      >
        {users.map((u) => {
          const c = colorOf(u.role);

          // Coba cari data siswa yang cocok dengan role atau username
          const matchedStudent = students.find(
            (s) =>
              s.roleClass?.toLowerCase() === u.role.toLowerCase() ||
              s.nama.toLowerCase() === u.username.toLowerCase()
          );

          return (
            <Link
              key={u.id}
              href={"/admin/settings/" + u.id}
              className="glass-card"
              style={{
                textDecoration: "none",
                borderColor: c + "66",
                boxShadow: "0 0 12px " + c + "15",
                padding: 14,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 10,
                borderRadius: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: c,
                    background: c + "18",
                    border: "1px solid " + c + "44",
                    padding: "2px 8px",
                    borderRadius: 6,
                  }}
                >
                  {u.role}
                </span>
                <span style={{ fontSize: 10, color: "#64748b" }}>#{u.id}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: c + "22",
                    border: "1.5px solid " + c,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 800,
                    color: c,
                    flexShrink: 0,
                  }}
                >
                  {matchedStudent?.icon || u.username.charAt(0).toUpperCase()}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 900,
                      fontSize: 14,
                      color: "#f8fafc",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {u.username}
                  </div>
                  <div style={{ fontSize: 10, color: "#94a3b8" }}>
                    {matchedStudent ? matchedStudent.nama : "Akun Pengurus"}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: 4,
                  paddingTop: 8,
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: 10,
                }}
              >
                <span style={{ color: "#94a3b8" }}>
                  Kode: <strong style={{ color: "#f8fafc" }}>{u.kode}</strong>
                </span>
                <span style={{ color: c, fontWeight: 700 }}>Edit akun →</span>
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
