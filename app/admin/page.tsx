"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAppData, type UserRole } from "@/lib/AppDataContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, currentUser, authInitialized } = useAppData();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [kode, setKode] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Tunggu sampai pembacaan localStorage selesai 100%
    if (!authInitialized) return;

    // Jika sesi login aktif, redirect ke dashboard
    if (currentUser) {
      router.replace("/admin/dashboard");
    }
  }, [currentUser, authInitialized, router]);

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
        setLoading(false);
        return;
      }

      // Tentukan UserRole sederhana berdasarkan string role dari DB
      const dbRole = String(data.role || "").toLowerCase();
      let parsedRole: UserRole = "admin";
      if (dbRole.includes("ketua")) parsedRole = "ketua";
      else if (dbRole.includes("sekretaris")) parsedRole = "sekretaris";
      else if (dbRole.includes("bendahara")) parsedRole = "bendahara";

      // Eksekusi login persistent 6 bulan
      login({
        id: data.id ?? 1,
        username: data.username,
        name: data.username,
        password: data.password,
        kode: data.kode,
        role: parsedRole,
        roleClass: data.role || "Pengurus Kelas",
        avatar: "/avatars/default.png",
      });

      sessionStorage.setItem("admin-ok", "1");
      router.replace("/admin/dashboard");
    } catch {
      setErr("Gagal terhubung ke server");
      setLoading(false);
    }
  }

  // Tampilkan indikator memuat selama localStorage belum selesai dibaca
  if (!authInitialized) {
    return (
      <div style={{ textAlign: "center", padding: 20, color: "#94a3b8", fontSize: 12 }}>
        Memeriksa sesi...
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="glass-card"
      style={{ display: "flex", flexDirection: "column", gap: 12 }}
    >
      <div className="title-sub text-center">LOGIN ADMIN</div>
      <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center" }}>
        Harap Masukkan Username, Password, Dan Kode Unik Dengan Benar.
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
        placeholder="Kode Unik"
        value={kode}
        onChange={(e) => setKode(e.target.value)}
        autoComplete="off"
      />

      {err ? (
        <p style={{ color: "#f43f5e", fontSize: 12, textAlign: "center" }}>
          {err}
        </p>
      ) : null}

      <button type="submit" className="btn-pay-qris" disabled={loading}>
        {loading ? "Memeriksa..." : "Masuk"}
      </button>
    </form>
  );
}
