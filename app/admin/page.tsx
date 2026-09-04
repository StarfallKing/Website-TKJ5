"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [kode, setKode] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const user = username.trim();
    const pass = password;
    const code = kode.trim().toUpperCase();

    try {
      const { data, error } = await supabase
        .from("admin_users")
        .select("username, password, kode, role")
        .eq("username", user)
        .eq("password", pass)
        .maybeSingle();

      if (error) {
        setErr("Gagal koneksi database");
        setLoading(false);
        return;
      }

      if (!data || String(data.kode).toUpperCase() !== code) {
        setErr("Username / password / kode unik salah");
        setLoading(false);
        return;
      }

      sessionStorage.setItem("admin-ok", "1");
      sessionStorage.setItem("admin-user", data.username);
      sessionStorage.setItem("admin-role", data.role || "");

      // log ke Supabase (opsional)
      void supabase.from("activity_log").insert({
        at: new Date().toLocaleString("id-ID"),
        user_name: data.username,
        action: "Login admin",
      });

      router.replace("/admin/dashboard");
    } catch {
      setErr("Terjadi kesalahan. Coba lagi.");
      setLoading(false);
    }
  }

  return (
    <div className="glass-card" style={{ marginTop: 24 }}>
      <div className="title-sub">LOGIN ADMIN</div>
      <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>
        Panel pengelola data Portal X TKJ-5
      </p>
      <form
        onSubmit={submit}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <label style={{ fontSize: 10, fontWeight: 700 }}>USERNAME</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="search-box expanded"
          style={{ width: "100%", padding: 12 }}
          autoComplete="username"
          disabled={loading}
        />
        <label style={{ fontSize: 10, fontWeight: 700 }}>PASSWORD</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="search-box expanded"
          style={{ width: "100%", padding: 12 }}
          disabled={loading}
        />
        <label style={{ fontSize: 10, fontWeight: 700 }}>KODE UNIK</label>
        <input
          value={kode}
          onChange={(e) => setKode(e.target.value)}
          placeholder="Contoh: TKJ5-ADMIN"
          className="search-box expanded"
          style={{ width: "100%", padding: 12 }}
          disabled={loading}
        />
        {err && <p style={{ color: "#f43f5e", fontSize: 11 }}>{err}</p>}
        <button type="submit" className="btn-pay-qris" disabled={loading}>
          {loading ? "Memeriksa..." : "Masuk Dashboard"}
        </button>
      </form>
      <p
        style={{
          fontSize: 9,
          color: "#64748b",
          marginTop: 10,
          textAlign: "center",
        }}
      >
        Butuh username + password + kode unik (dari database)
      </p>
    </div>
  );
}
