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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("username", username.trim())
        .eq("password", password)
        .ilike("kode", kode.trim())
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setErr("Username / password / kode salah");
        return;
      }

      sessionStorage.setItem("admin-ok", "1");
      sessionStorage.setItem("admin-user", data.username);
      sessionStorage.setItem("admin-role", data.role || "");
      router.replace("/admin/dashboard");
    } catch {
      setErr("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div className="title-sub text-center">LOGIN ADMIN</div>
      <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center" }}>
        Username + password + kode unik
      </p>

      <input
        className="search-box expanded"
        style={{ width: "100%", padding: 12 }}
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        autoComplete="username"
      />
      <input
        type="password"
        className="search-box expanded"
        style={{ width: "100%", padding: 12 }}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      <input
        className="search-box expanded"
        style={{ width: "100%", padding: 12 }}
        placeholder="Kode unik (contoh TKJ5-ADMIN)"
        value={kode}
        onChange={(e) => setKode(e.target.value)}
        autoComplete="off"
      />

      {err ? (
        <p style={{ color: "#f43f5e", fontSize: 12, textAlign: "center" }}>{err}</p>
      ) : null}

      <button
        type="button"
        className="btn-pay-qris"
        disabled={loading}
        onClick={onSubmit}
      >
        {loading ? "Memeriksa..." : "Masuk"}
      </button>

      <p style={{ fontSize: 9, color: "#64748b", textAlign: "center" }}>
        Default: admin / tkj5admin / TKJ5-ADMIN
      </p>
    </div>
  );
}
