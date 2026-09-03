"use client";

import { useAppData } from "@/lib/AppDataContext";

const DEFAULT_USERS = [
  { username: "admin", password: "tkj5admin", kode: "TKJ5-ADMIN", role: "Super Admin" },
  { username: "bendahara1", password: "kas123", kode: "TKJ5-B1", role: "Bendahara 1" },
  { username: "bendahara2", password: "kas123", kode: "TKJ5-B2", role: "Bendahara 2" },
  { username: "sekretaris1", password: "sek123", kode: "TKJ5-S1", role: "Sekretaris 1" },
  { username: "sekretaris2", password: "sek123", kode: "TKJ5-S2", role: "Sekretaris 2" },
  { username: "ketua", password: "ketua123", kode: "TKJ5-KET", role: "Ketua Kelas" },
  { username: "wakil", password: "wakil123", kode: "TKJ5-WAK", role: "Wakil Ketua" },
  { username: "keamanan", password: "aman123", kode: "TKJ5-AMN", role: "Keamanan" },
  { username: "kesehatan1", password: "kes123", kode: "TKJ5-KS1", role: "Kesehatan 1" },
  { username: "kesehatan2", password: "kes123", kode: "TKJ5-KS2", role: "Kesehatan 2" },
];

export default function AdminSettingsPage() {
  const { maintenanceMode, setMaintenanceMode } = useAppData();
  const { activityLog } = useAppData(); // setelah pushLog ada di Context

// di JSX:
<div className="glass-card">
  <div className="title-sub" style={{ marginBottom: 8 }}>LOG AKTIVITAS</div>
  {(activityLog || []).length === 0 && (
    <p style={{ fontSize: 11, color: "#64748b" }}>Belum ada aktivitas</p>
  )}
  {(activityLog || []).slice(0, 50).map((row) => (
    <div
      key={row.id}
      style={{
        fontSize: 10,
        padding: "8px 0",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ color: "#60a5fa", fontWeight: 700 }}>{row.user}</div>
      <div style={{ color: "#f8fafc" }}>{row.action}</div>
      <div style={{ color: "#64748b" }}>{row.at}</div>
    </div>
  ))}
</div>
  
  return (
    <>
      <div className="glass-card text-center">
        <div className="title-sub">PENGATURAN</div>
        <p style={{ fontSize: 12, fontWeight: 700 }}>
          Akun login · Maintenance · Log (menyusul)
        </p>
      </div>

      <div
        className="glass-card"
        style={{
          borderColor: maintenanceMode
            ? "rgba(244,63,94,0.5)"
            : "rgba(255,255,255,0.08)",
        }}
      >
        <div className="title-sub" style={{ color: "#f43f5e" }}>
          ZONA BAHAYA
        </div>
        <p style={{ fontSize: 11, color: "#94a3b8", margin: "8px 0" }}>
          Web publik hanya menampilkan: &quot;Website Sedang Perbaikan, Harap
          Kembali Lagi Nanti&quot;. Admin tetap bisa masuk.
        </p>
        <button
          type="button"
          className="btn-pay-qris"
          style={{
            background: maintenanceMode
              ? "linear-gradient(135deg,#16a34a,#15803d)"
              : "linear-gradient(135deg,#e11d48,#9f1239)",
          }}
          onClick={() => setMaintenanceMode(!maintenanceMode)}
        >
          {maintenanceMode
            ? "Matikan mode perbaikan"
            : "Website sedang perbaikan"}
        </button>
        <p style={{ fontSize: 10, marginTop: 8, color: maintenanceMode ? "#f43f5e" : "#4ade80" }}>
          Status: {maintenanceMode ? "ON" : "OFF"}
        </p>
      </div>

      <div className="glass-card">
        <div className="title-sub" style={{ marginBottom: 10 }}>
          10 AKUN PENGURUS (template)
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {DEFAULT_USERS.map((u) => (
            <div
              key={u.username}
              style={{
                background: "rgba(255,255,255,0.04)",
                borderRadius: 10,
                padding: 10,
                fontSize: 11,
              }}
            >
              <div style={{ fontWeight: 800 }}>{u.role}</div>
              <div style={{ color: "#94a3b8" }}>
                user: <span style={{ color: "#60a5fa" }}>{u.username}</span>
                {" · "}
                pass: <span style={{ color: "#facc15" }}>{u.password}</span>
              </div>
              <div style={{ color: "#64748b", fontFamily: "monospace" }}>
                kode: {u.kode}
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 9, color: "#64748b", marginTop: 10 }}>
          Login form masih memakai admin / tkj5admin. Binding 10 akun ke form
          login bisa tahap berikutnya.
        </p>
      </div>
    </>
  );
          }
