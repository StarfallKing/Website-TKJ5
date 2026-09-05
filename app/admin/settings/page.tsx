"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAppData } from "@/lib/AppDataContext";

type AdminUser = {
  id?: number;
  username: string;
  password: string;
  kode: string;
  role: string;
};

export default function AdminSettingsPage() {
  const router = useRouter();
  const { activityLog, pushLog } = useAppData();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [edit, setEdit] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("admin-ok") !== "1") {
      router.replace("/admin");
      return;
    }
    void loadUsers();
  }, [router]);

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

  async function saveUser() {
    if (!edit || !edit.username.trim()) return;
    const row = {
      username: edit.username.trim(),
      password: edit.password,
      kode: edit.kode.trim().toUpperCase(),
      role: edit.role || "pengurus",
    };
    const q = edit.id
      ? supabase.from("admin_users").update(row).eq("id", edit.id)
      : supabase.from("admin_users").insert(row);
    const { error } = await q;
    if (error) {
      alert(error.message);
      return;
    }
    pushLog("Update admin user " + row.username);
    setEdit(null);
    void loadUsers();
  }

  async function resetPassword(u: AdminUser) {
    const neu = prompt("Password baru untuk " + u.username, "tkj5admin");
    if (!neu) return;
    const { error } = await supabase
      .from("admin_users")
      .update({ password: neu })
      .eq("id", u.id!);
    if (error) alert(error.message);
    else {
      pushLog("Reset password " + u.username);
      void loadUsers();
    }
  }

  async function resetKode(u: AdminUser) {
    const neu = prompt("Kode unik baru", "TKJ5-" + u.username.toUpperCase());
    if (!neu) return;
    const { error } = await supabase
      .from("admin_users")
      .update({ kode: neu.trim().toUpperCase() })
      .eq("id", u.id!);
    if (error) alert(error.message);
    else {
      pushLog("Reset kode " + u.username);
      void loadUsers();
    }
  }

  return (
    <>
      <div className="glass-card text-center">
        <div className="title-sub">SETTINGS ADMIN</div>
        <p style={{ fontSize: 11, color: "#94a3b8" }}>
          Ganti / reset username · password · kode unik
        </p>
      </div>

      <button
        type="button"
        className="btn-pay-qris"
        style={{ marginBottom: 12 }}
        onClick={() =>
          setEdit({
            username: "",
            password: "",
            kode: "",
            role: "pengurus",
          })
        }
      >
        + Tambah akun admin
      </button>

      {loading && (
        <p style={{ textAlign: "center", color: "#94a3b8" }}>Memuat...</p>
      )}

      {users.map((u) => (
        <div key={u.id} className="glass-card" style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 800 }}>{u.username}</div>
          <div style={{ fontSize: 10, color: "#94a3b8" }}>
            Role: {u.role} · Kode: {u.kode}
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn-action-light"
              style={{ fontSize: 10 }}
              onClick={() => setEdit({ ...u })}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn-action-light"
              style={{ fontSize: 10 }}
              onClick={() => void resetPassword(u)}
            >
              Reset password
            </button>
            <button
              type="button"
              className="btn-action-light"
              style={{ fontSize: 10 }}
              onClick={() => void resetKode(u)}
            >
              Reset kode
            </button>
          </div>
        </div>
      ))}

      {edit && (
        <div
          className="glass-card"
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          <div className="title-sub">{edit.id ? "EDIT AKUN" : "AKUN BARU"}</div>
          <input
            className="search-box expanded"
            style={{ width: "100%", padding: 10 }}
            placeholder="Username"
            value={edit.username}
            onChange={(e) => setEdit({ ...edit, username: e.target.value })}
          />
          <input
            className="search-box expanded"
            style={{ width: "100%", padding: 10 }}
            placeholder="Password"
            value={edit.password}
            onChange={(e) => setEdit({ ...edit, password: e.target.value })}
          />
          <input
            className="search-box expanded"
            style={{ width: "100%", padding: 10 }}
            placeholder="Kode unik"
            value={edit.kode}
            onChange={(e) => setEdit({ ...edit, kode: e.target.value })}
          />
          <input
            className="search-box expanded"
            style={{ width: "100%", padding: 10 }}
            placeholder="Role"
            value={edit.role}
            onChange={(e) => setEdit({ ...edit, role: e.target.value })}
          />
          <button type="button" className="btn-pay-qris" onClick={() => void saveUser()}>
            Simpan
          </button>
          <button
            type="button"
            className="btn-action-light"
            onClick={() => setEdit(null)}
          >
            Batal
          </button>
        </div>
      )}

      <div className="glass-card" style={{ marginTop: 12 }}>
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
              <div style={{ fontWeight: 700 }}>{l.action}</div>
              <div style={{ color: "#64748b" }}>
                {l.user} · {l.at}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
      }
