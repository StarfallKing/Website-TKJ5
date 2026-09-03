"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const USERS = [
  { username: "admin", password: "tkj5admin", kode: "TKJ5-ADMIN" },
  { username: "bendahara1", password: "kas123", kode: "TKJ5-B1" },
  { username: "bendahara2", password: "kas123", kode: "TKJ5-B2" },
  { username: "sekretaris1", password: "sek123", kode: "TKJ5-S1" },
  { username: "sekretaris2", password: "sek123", kode: "TKJ5-S2" },
  { username: "ketua", password: "ketua123", kode: "TKJ5-KET" },
  { username: "wakil", password: "wakil123", kode: "TKJ5-WAK" },
  { username: "keamanan", password: "aman123", kode: "TKJ5-AMN" },
  { username: "kesehatan1", password: "kes123", kode: "TKJ5-KS1" },
  { username: "kesehatan2", password: "kes123", kode: "TKJ5-KS2" },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [kode, setKode] = useState("");
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const u = USERS.find(
      (x) =>
        x.username === username.trim() &&
        x.password === password &&
        x.kode.toUpperCase() === kode.trim().toUpperCase()
    );
    if (!u) {
      setErr("Username / password / kode unik salah");
      return;
    }
    sessionStorage.setItem("admin-ok", "1");
    sessionStorage.setItem("admin-user", u.username);
    // log login (nanti dari Context pushLog di dashboard)
    localStorage.setItem(
      "tkj5-last-login",
      JSON.stringify({
        user: u.username,
        at: new Date().toLocaleString("id-ID"),
      })
    );
    router.replace("/admin/dashboard");
  }

  return (
    <div className="glass-card" style={{ marginTop: 24 }}>
      <div className="title-sub">LOGIN ADMIN</div>
      <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>
        Panel pengelola data Portal X TKJ-5
      </p>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <label style={{ fontSize: 10, fontWeight: 700 }}>USERNAME</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="search-box expanded"
          style={{ width: "100%", padding: 12 }}
          autoComplete="username"
        />
        <label style={{ fontSize: 10, fontWeight: 700 }}>PASSWORD</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="search-box expanded"
          style={{ width: "100%", padding: 12 }}
        />
        <label style={{ fontSize: 10, fontWeight: 700 }}>KODE UNIK</label>
        <input
          value={kode}
          onChange={(e) => setKode(e.target.value)}
          placeholder="Contoh: TKJ5-ADMIN"
          className="search-box expanded"
          style={{ width: "100%", padding: 12 }}
        />
        {err && (
          <p style={{ color: "#f43f5e", fontSize: 11 }}>{err}</p>
        )}
        <button type="submit" className="btn-pay-qris">
          Masuk Dashboard
        </button>
      </form>
      <p style={{ fontSize: 9, color: "#64748b", marginTop: 10, textAlign: "center" }}>
        Butuh username + password + kode unik
      </p>
    </div>
  );
      }
