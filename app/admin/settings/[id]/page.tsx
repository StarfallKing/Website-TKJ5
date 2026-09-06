"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAppData } from "@/lib/AppDataContext";

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

export default function AdminSettingsEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { pushLog } = useAppData();

  const [form, setForm] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("admin-ok") !== "1") {
      router.replace("/admin");
      return;
    }
    void load();
  }, [id, router]);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", Number(id))
      .maybeSingle();
    if (error) alert(error.message);
    if (data) setForm(data as AdminUser);
    setLoading(false);
  }

  async function save() {
    if (!form) return;
    if (!form.username.trim() || !form.password || !form.kode.trim()) {
      alert("Username, password, dan kode wajib diisi");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("admin_users")
      .update({
        username: form.username.trim(),
        password: form.password,
        kode: form.kode.trim().toUpperCase(),
        role: form.role || "pengurus",
      })
      .eq("id", form.id);
    setSaving(false);
    if (error) {
      alert(error.message);
      return;
    }
    pushLog("Update admin " + form.username + " (id " + form.id + ")");
    alert("Tersimpan");
    router.push("/admin/settings");
  }

  async function resetPassword() {
    if (!form) return;
    const neu = prompt("Password baru untuk " + form.username, "tkj5admin");
    if (!neu) return;
    setForm({ ...form, password: neu });
    const { error } = await supabase
      .from("admin_users")
      .update({ password: neu })
      .eq("id", form.id);
    if (error) alert(error.message);
    else {
      pushLog("Reset password " + form.username);
      alert("Password direset");
    }
  }

  async function resetKode() {
    if (!form) return;
    const neu = prompt(
      "Kode unik baru",
      "TKJ5-" + form.username.toUpperCase().slice(0, 6)
    );
    if (!neu) return;
    const kode = neu.trim().toUpperCase();
    setForm({ ...form, kode });
    const { error } = await supabase
      .from("admin_users")
      .update({ kode })
      .eq("id", form.id);
    if (error) alert(error.message);
    else {
      pushLog("Reset kode " + form.username);
      alert("Kode direset");
    }
  }

  if (loading) {
    return (
      <div className="glass-card text-center" style={{ color: "#94a3b8" }}>
        Memuat...
      </div>
    );
  }

  if (!form) {
    return (
      <div className="glass-card text-center">
        <p style={{ color: "#94a3b8" }}>Akun tidak ditemukan</p>
        <button
          type="button"
          className="btn-action-light"
          onClick={() => router.push("/admin/settings")}
        >
          ← Kembali
        </button>
      </div>
    );
  }

  const c = roleColor[form.role] || "#94a3b8";

  return (
    <>
      <button
        type="button"
        className="btn-action-light"
        onClick={() => router.push("/admin/settings")}
      >
        ← Kembali ke daftar
      </button>

      <div
        className="glass-card"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          borderColor: c + "66",
        }}
      >
        <div className="title-sub" style={{ color: c }}>
          EDIT AKUN
        </div>
        <p style={{ fontSize: 11, color: "#94a3b8" }}>
          Role: <span style={{ color: c, fontWeight: 800 }}>{form.role}</span>
        </p>

        <label style={{ fontSize: 10, color: "#94a3b8" }}>Username</label>
        <input
          className="search-box expanded"
          style={{ width: "100%", padding: 12 }}
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <label style={{ fontSize: 10, color: "#94a3b8" }}>Password</label>
        <input
          className="search-box expanded"
          style={{ width: "100%", padding: 12 }}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <label style={{ fontSize: 10, color: "#94a3b8" }}>Kode unik</label>
        <input
          className="search-box expanded"
          style={{ width: "100%", padding: 12 }}
          value={form.kode}
          onChange={(e) => setForm({ ...form, kode: e.target.value })}
        />

        <label style={{ fontSize: 10, color: "#94a3b8" }}>Role</label>
        <input
          className="search-box expanded"
          style={{ width: "100%", padding: 12 }}
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        />

        <button
          type="button"
          className="btn-pay-qris"
          disabled={saving}
          onClick={() => void save()}
        >
          {saving ? "Menyimpan..." : "Simpan"}
        </button>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn-action-light"
            style={{ fontSize: 10 }}
            onClick={() => void resetPassword()}
          >
            Reset password
          </button>
          <button
            type="button"
            className="btn-action-light"
            style={{ fontSize: 10 }}
            onClick={() => void resetKode()}
          >
            Reset kode
          </button>
        </div>
      </div>
    </>
  );
  }
