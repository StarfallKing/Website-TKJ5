"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAppData } from "@/lib/AppDataContext";
import AdminHeader from "@/components/layout/AdminHeader";

export default function AdminSettingsPage() {
  const router = useRouter();
  const { currentUser, maintenanceMode, setMaintenanceMode, activityLog, loading: appLoading } = useAppData();

  // State Form Edit Kredensial Akun Aktif
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [kode, setKode] = useState("");
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "all_users">("profile");

  // State untuk Superadmin (List Semua Akun)
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (!appLoading && !currentUser && sessionStorage.getItem("admin-ok") !== "1") {
      router.replace("/admin");
      return;
    }

    if (currentUser) {
      setUsername(currentUser.username || "");
      setPassword(currentUser.password || "");
      setKode(currentUser.kode || "");

      // Jika yang login Superadmin, baru load data semua akun
      if (isSuperAdmin(currentUser.role)) {
        void loadAllUsers();
      }
    }
  }, [currentUser, appLoading, router]);

  function isSuperAdmin(role?: string) {
    if (!role) return false;
    const r = role.toLowerCase();
    return r === "superadmin" || r === "super admin" || r === "admin";
  }

  async function loadAllUsers() {
    setLoadingUsers(true);
    const { data } = await supabase.from("admin_users").select("*").order("id");
    if (data) setAllUsers(data);
    setLoadingUsers(false);
  }

  // Simpan Perubahan Akun Sendiri
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser?.id) return alert("Sesi login tidak valid!");

    setSaving(true);
    const { error } = await supabase
      .from("admin_users")
      .update({
        username: username.trim(),
        password: password.trim(),
        kode: kode.trim(),
      })
      .eq("id", currentUser.id);

    setSaving(false);

    if (error) {
      alert("Gagal memperbarui data: " + error.message);
    } else {
      alert("Data akun Anda berhasil diperbarui! Silakan gunakan kredensial baru saat login berikutnya.");
    }
  }

  function handleToggleMaintenance() {
    const nextState = !maintenanceMode;
    const confirmMsg = nextState
      ? "Aktifkan Mode Perbaikan (Maintenance)? Pengunjung publik tidak bisa mengakses web."
      : "Matikan Mode Perbaikan? Website publik akan kembali diakses normal.";

    if (confirm(confirmMsg)) {
      void setMaintenanceMode(nextState);
    }
  }

  // Tampilan Loading
  if (appLoading || !currentUser) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "#94a3b8", fontSize: 12 }}>
        Memuat profil akun...
      </div>
    );
  }

  const isSuper = isSuperAdmin(currentUser.role);
  const userInitial = (currentUser.username || "A").substring(0, 2).toUpperCase();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 80 }}>
      <AdminHeader />

      {/* HEADER PROFIL PERSONAL (Sesuai Gambar 2) */}
      <div
        className="glass-card"
        style={{
          padding: 16,
          background: "linear-gradient(135deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%)",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Avatar Inisial Bulat */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 900,
              boxShadow: "0 4px 12px rgba(239, 68, 68, 0.4)",
              flexShrink: 0,
            }}
          >
            {userInitial}
          </div>

          {/* Info Utama User Login */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: "#f8fafc" }}>
                {currentUser.username}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  background: "rgba(34, 197, 94, 0.2)",
                  color: "#4ade80",
                  border: "1px solid rgba(34, 197, 94, 0.4)",
                  padding: "2px 8px",
                  borderRadius: 12,
                }}
              >
                Verified Account
              </span>
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
              Jabatan: <strong style={{ color: "#38bdf8" }}>{currentUser.role}</strong>
            </div>
          </div>
        </div>

        {/* METRICS / BADGE ID (Sesuai Layout Gambar 2) */}
        <div
          style={{
            marginTop: 14,
            padding: 12,
            borderRadius: 12,
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
            <span style={{ color: "#94a3b8" }}>ID Sesi Login</span>
            <span style={{ color: "#f8fafc", fontWeight: 700, fontFamily: "monospace" }}>
              #{currentUser.id}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
            <span style={{ color: "#94a3b8" }}>Kode Akses Login</span>
            <span style={{ color: "#facc15", fontWeight: 700, fontFamily: "monospace" }}>
              {currentUser.kode}
            </span>
          </div>
        </div>
      </div>

      {/* TAB KHUSUS UNTUK SUPERADMIN */}
      {isSuper && (
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 800,
              background: activeTab === "profile" ? "rgba(56, 189, 248, 0.2)" : "rgba(255,255,255,0.05)",
              color: activeTab === "profile" ? "#38bdf8" : "#94a3b8",
              border: "1px solid " + (activeTab === "profile" ? "#38bdf8" : "transparent"),
            }}
          >
            👤 Profil Akun Saya
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("all_users")}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 800,
              background: activeTab === "all_users" ? "rgba(56, 189, 248, 0.2)" : "rgba(255,255,255,0.05)",
              color: activeTab === "all_users" ? "#38bdf8" : "#94a3b8",
              border: "1px solid " + (activeTab === "all_users" ? "#38bdf8" : "transparent"),
            }}
          >
            ⚙️ Kelola Semua Akun ({allUsers.length})
          </button>
        </div>
      )}

      {/* TAB 1: EDIT FORM AKUN LOGIN SAAT INI */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="glass-card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="title-sub" style={{ fontSize: 12 }}>
            PENGATURAN KREDENSIAL AKUN
          </div>

          <div>
            <label style={{ fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 4 }}>
              Username Akses
            </label>
            <input
              type="text"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: "100%", padding: 10, fontSize: 12, borderRadius: 8 }}
            />
          </div>

          <div>
            <label style={{ fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 4 }}>
              Password Login
            </label>
            <input
              type="text"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: 10, fontSize: 12, borderRadius: 8 }}
            />
          </div>

          <div>
            <label style={{ fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 4 }}>
              Kode Unik Akun
            </label>
            <input
              type="text"
              className="input-field"
              value={kode}
              onChange={(e) => setKode(e.target.value)}
              required
              style={{ width: "100%", padding: 10, fontSize: 12, borderRadius: 8 }}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-action-light"
            style={{
              marginTop: 4,
              padding: 10,
              fontWeight: 800,
              fontSize: 12,
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              color: "#fff",
              borderRadius: 8,
              border: "none",
            }}
          >
            {saving ? "Menyimpan Perubahan..." : "Simpan Perubahan Akun"}
          </button>
        </form>
      )}

      {/* TAB 2: KHUSUS SUPERADMIN KELOLA DATA AKUN LAIN */}
      {isSuper && activeTab === "all_users" && (
        <div className="glass-card" style={{ padding: 14 }}>
          <div className="title-sub" style={{ marginBottom: 10 }}>
            DAFTAR SELURUH AKUN ADMIN
          </div>
          {loadingUsers ? (
            <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center" }}>Memuat daftar akun...</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {allUsers.map((u) => (
                <div
                  key={u.id}
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 12, color: "#f8fafc" }}>
                      {u.username} <span style={{ color: "#38bdf8", fontSize: 10 }}>({u.role})</span>
                    </div>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>
                      Kode: {u.kode} · Pass: {u.password}
                    </div>
                  </div>
                  <span style={{ fontSize: 10, color: "#64748b" }}>#{u.id}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* KONTROL MAINTENANCE (GLOBAL) */}
      <div
        className="glass-card"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 12,
          borderColor: maintenanceMode ? "rgba(244, 63, 94, 0.45)" : "rgba(74, 222, 128, 0.3)",
        }}
      >
        <div>
          <div style={{ fontWeight: 800, fontSize: 12, color: maintenanceMode ? "#f43f5e" : "#4ade80" }}>
            {maintenanceMode ? "🔴 MODE PERBAIKAN AKTIF" : "🟢 WEBSITE PUBLIK AKTIF"}
          </div>
          <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>
            {maintenanceMode ? "Publik dialihkan ke perbaikan" : "Publik bisa akses normal"}
          </p>
        </div>
        <button
          type="button"
          onClick={handleToggleMaintenance}
          style={{
            fontSize: 10,
            padding: "8px 12px",
            borderRadius: 8,
            fontWeight: 700,
            background: maintenanceMode ? "rgba(34,197,94,0.2)" : "rgba(244,63,94,0.25)",
            color: maintenanceMode ? "#4ade80" : "#fda4af",
            border: "none",
          }}
        >
          {maintenanceMode ? "Matikan" : "Set Maintenance"}
        </button>
      </div>

      {/* LOG AKTIVITAS USER SAYA */}
      <div className="glass-card" style={{ padding: 14 }}>
        <div className="title-sub" style={{ marginBottom: 8 }}>
          📋 RIWAYAT AKTIVITAS SAYA
        </div>
        <div style={{ maxHeight: 200, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
          {activityLog.length === 0 ? (
            <p style={{ fontSize: 11, color: "#64748b" }}>Belum ada log aktivitas</p>
          ) : (
            activityLog
              .filter((l) => isSuper || l.user === currentUser.username)
              .slice(0, 30)
              .map((l) => (
                <div
                  key={l.id}
                  style={{
                    fontSize: 10,
                    padding: "6px 8px",
                    borderRadius: 6,
                    background: "rgba(255,255,255,0.02)",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ color: "#f8fafc", fontWeight: 700 }}>{l.action}</span>
                  <span style={{ color: "#64748b" }}>{l.at}</span>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
