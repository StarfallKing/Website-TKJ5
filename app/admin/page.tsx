"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Ganti nanti pakai env / Supabase Auth
const ADMIN_USER = "admin";
const ADMIN_PASS = "tkj5admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  function login() {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem("admin-ok", "1");
      router.push("/admin/dashboard");
    } else {
      setErr("Username / password salah");
    }
  }

  return (
    <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div className="title-sub">LOGIN ADMIN</div>
      <p style={{ fontSize: 11, color: "#94a3b8" }}>
        Panel pengelola data Portal X TKJ-5
      </p>

      <div className="form-group">
        <label className="form-label">Username</label>
        <input
          className="form-textarea"
          style={{ minHeight: 40 }}
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="admin"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-textarea"
          style={{ minHeight: 40 }}
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="••••••••"
        />
      </div>

      {err && (
        <div style={{ color: "#f43f5e", fontSize: 11, fontWeight: 700 }}>{err}</div>
      )}

      <button className="btn-pay-qris" type="button" onClick={login}>
        Masuk Dashboard
      </button>

      <p style={{ fontSize: 9, color: "#64748b", textAlign: "center" }}>
        Default: admin / tkj5admin (ganti sebelum production)
      </p>
    </div>
  );
}