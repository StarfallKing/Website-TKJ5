"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAppData } from "@/lib/AppDataContext";
import AdminHeader from "@/components/layout/AdminHeader";

export default function AdminSettingsPage() {
  const router = useRouter();
  const { currentUser, setCurrentUser, maintenanceMode, setMaintenanceMode, activityLog, pushLog, loading: appLoading } = useAppData();

  const [targetId, setTargetId] = useState<number | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [kode, setKode] = useState("");
  const [role, setRole] = useState("");
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "all_users">("profile");

  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (!appLoading && !currentUser && sessionStorage.getItem("admin-ok") !== "1") {
      router.replace("/admin");
      return;
    }

    if (currentUser && !targetId) {
      setTargetId(currentUser.id ?? 1);
      setUsername(currentUser.username || currentUser.name || "");
      setPassword(currentUser.password || "");
      setKode(currentUser.kode || "");
      setRole(currentUser.role || "");

      if (isSuperAdmin(currentUser.role)) {
        void loadAllUsers();
      }
    }
  }, [currentUser, appLoading, router, targetId]);

  function isSuperAdmin(r?: string) {
    if (!r) return false;
    const lower = r.toLowerCase();
    return lower === "superadmin" || lower === "super admin" || lower === "admin";
  }

  async function loadAllUsers() {
    setLoadingUsers(true);
    const { data } = await supabase.from("admin_users").select("*").order("id");
    if (data) setAllUsers(data);
    setLoadingUsers(false);
  }

  function handleSelectUserToEdit(u: any) {
    setTargetId(u.id);
    setUsername(u.username || "");
    setPassword(u.password || "");
    setKode(u.kode || "");
    setRole(u.role || "");
    setActiveTab("profile");
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!targetId) return alert("ID Akun tidak terdeteksi!");

    setSaving(true);
    const updatePayload = {
      username: username.trim(),
      password: password.trim(),
      kode: kode.trim().toUpperCase(),
      role: role.trim() || "pengurus",
    };

    const { error } = await supabase
      .from("admin_users")
      .update(updatePayload)
      .eq("id", targetId);

    setSaving(false);

    if (error) {
      alert("Gagal update data: " + error.message);
    } else {
      if (currentUser && targetId === currentUser.id) {
        setCurrentUser({
          ...currentUser,
          ...updatePayload,
        });
      }

      pushLog("Update akun " + username + " (#" + targetId + ")");
      alert("Data berhasil disimpan secara Real-time!");
      
      if (isSuperAdmin(currentUser?.role)) {
        void loadAllUsers();
      }
    }
  }

  if (appLoading || !currentUser) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 12 }}>
        Memuat data sistem...
      </div>
    );
  }

  const isSuper = isSuperAdmin(currentUser.role);
  const userInitial = (currentUser.username || currentUser.name || "A").substring(0, 2).toUpperCase();
  
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    fontSize: 13,
    borderRadius: 10,
    background: "rgba(15, 23, 42, 0.6)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    color: "#f8fafc",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 90 }}>
      <AdminHeader />

      {/* HEADER CARD PROFIL */}
      <div
        className="glass-card"
        style={{
          padding: 16,
          background: "linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.95) 100%)",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 900,
              boxShadow: "0 4px 12px rgba(239, 68, 68, 0.35)",
              flexShrink: 0,
            }}
          >
            {userInitial}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#f8fafc" }}>
                {currentUser.username || currentUser.name}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  background: "rgba(34, 197, 94, 0.15)",
                  color: "#4ade80",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  padding: "2px 8px",
                  borderRadius: 12,
                }}
              >
                Verified Account
              </span>
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
              Jabatan: <strong style={{ color: "#38bdf8" }}>{currentUser.role}</strong>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 12,
            padding: 10,
            borderRadius: 10,
            background: "rgba(0,0,0,0.25)",
            border: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
            <span style={{ color: "#94a3b8" }}>ID Sesi Login</span>
            <span style={{ color: "#f8fafc", fontWeight: 700, fontFamily: "monospace" }}>
              #{targetId ?? currentUser.id ?? "-"}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
            <span style={{ color: "#94a3b8" }}>Kode Akses Login</span>
            <span style={{ color: "#facc15", fontWeight: 700, fontFamily: "monospace" }}>
              {kode || currentUser.kode || "-"}
            </span>
          </div>
        </div>
      </div>

      {/* TABS SUPERADMIN */}
      {isSuper && (
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => {
              if (currentUser.id) handleSelectUserToEdit(currentUser);
            }}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 10,
              fontSize: 11,
              fontWeight: 800,
              background: activeTab === "profile" ? "rgba(56, 189, 248, 0.15)" : "rgba(255,255,255,0.03)",
              color: activeTab === "profile" ? "#38bdf8" : "#94a3b8",
              border: "1px solid " + (activeTab === "profile" ? "rgba(56, 189, 248, 0.4)" : "rgba(255,255,255,0.05)"),
            }}
          >
            👤 Profil Akun Saya
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("all_users")}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 10,
              fontSize: 11,
              fontWeight: 800,
              background: activeTab === "all_users" ? "rgba(56, 189, 248, 0.15)" : "rgba(255,255,255,0.03)",
              color: activeTab === "all_users" ? "#38bdf8" : "#94a3b8",
              border: "1px solid " + (activeTab === "all_users" ? "rgba(56, 189, 248, 0.4)" : "rgba(255,255,255,0.05)"),
            }}
          >
            ⚙️ Kelola Semua Akun ({allUsers.length})
          </button>
        </div>
      )}

      {/* FORM KREDENSIAL AKUN GLASSMORPHISM */}
      {activeTab === "profile" && (
        <form
          onSubmit={handleSaveProfile}
          className="glass-card"
          style={{
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            background: "rgba(15, 23, 42, 0.75)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 16,
          }}
        >
          <div className="title-sub" style={{ fontSize: 11, color: "#38bdf8", fontWeight: 800, letterSpacing: 0.5 }}>
            PENGATURAN KREDENSIAL AKUN {targetId ? `(#${targetId})` : ""}
          </div>

          <div>
            <label style={{ fontSize: 10, color: "#94a3b8", display: "block", marginBottom: 6 }}>
              Username Akses
            </label>
            <input
              type="text"
              style={inputStyle}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: 10, color: "#94a3b8", display: "block", marginBottom: 6 }}>
              Password Login
            </label>
            <input
              type="text"
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: 10, color: "#94a3b8", display: "block", marginBottom: 6 }}>
              Kode Unik Akun
            </label>
            <input
              type="text"
              style={inputStyle}
              value={kode}
              onChange={(e) => setKode(e.target.value)}
              required
            />
          </div>

          {isSuper && (
            <div>
              <label style={{ fontSize: 10, color: "#94a3b8", display: "block", marginBottom: 6 }}>
                Role / Jabatan
              </label>
              <input
                type="text"
                style={inputStyle}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            style={{
              marginTop: 6,
              padding: "12px",
              fontWeight: 800,
              fontSize: 12,
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              color: "#ffffff",
              borderRadius: 10,
              border: "none",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
              cursor: "pointer",
            }}
          >
            {saving ? "Menyimpan Perubahan..." : "Simpan Perubahan Akun"}
          </button>
        </form>
      )}

      {/* TAB KELOLA AKUN */}
      {isSuper && activeTab === "all_users" && (
        <div className="glass-card" style={{ padding: 14 }}>
          <div className="title-sub" style={{ marginBottom: 10, fontSize: 11, color: "#38bdf8" }}>
            DAFTAR SELURUH AKUN ADMIN
          </div>
          {loadingUsers ? (
            <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center" }}>Memuat data akun...</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {allUsers.map((u) => (
                <div
                  key={u.id}
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.025)",
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
                  <button
                    type="button"
                    style={{
                      fontSize: 10,
                      padding: "6px 10px",
                      borderRadius: 6,
                      background: "rgba(56, 189, 248, 0.2)",
                      color: "#38bdf8",
                      border: "1px solid rgba(56, 189, 248, 0.4)",
                      fontWeight: 700,
                    }}
                    onClick={() => handleSelectUserToEdit(u)}
                  >
                    Edit →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MAINTENANCE MODE CARD */}
      <div
        className="glass-card"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 14,
          borderColor: maintenanceMode ? "rgba(244, 63, 94, 0.4)" : "rgba(74, 222, 128, 0.25)",
        }}
      >
        <div>
          <div style={{ fontWeight: 800, fontSize: 11, color: maintenanceMode ? "#f43f5e" : "#4ade80" }}>
            {maintenanceMode ? "🔴 MODE PERBAIKAN AKTIF" : "🟢 WEBSITE PUBLIK AKTIF"}
          </div>
          <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>
            {maintenanceMode ? "Akses publik dikunci sementara" : "Publik dapat mengakses normal"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void setMaintenanceMode(!maintenanceMode)}
          style={{
            fontSize: 10,
            padding: "8px 12px",
            borderRadius: 8,
            fontWeight: 700,
            background: maintenanceMode ? "rgba(34,197,94,0.2)" : "rgba(244,63,94,0.2)",
            color: maintenanceMode ? "#4ade80" : "#fda4af",
            border: "none",
          }}
        >
          {maintenanceMode ? "Matikan" : "Set Maintenance"}
        </button>
      </div>

      {/* RIWAYAT AKTIVITAS CARD */}
      <div className="glass-card" style={{ padding: 14 }}>
        <div className="title-sub" style={{ marginBottom: 8, fontSize: 11, color: "#94a3b8" }}>
          📋 RIWAYAT AKTIVITAS SAYA
        </div>
        <div style={{ maxHeight: 180, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
          {activityLog.length === 0 ? (
            <p style={{ fontSize: 10, color: "#64748b" }}>Belum ada catatan aktivitas</p>
          ) : (
            activityLog
              .filter((l) => isSuper || l.user === (currentUser.username || currentUser.name))
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
