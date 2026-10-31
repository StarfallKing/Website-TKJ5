"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppData } from "@/lib/AppDataContext";
import type { Student } from "@/lib/data";

const ROLE_OPTIONS = [
  "",
  "Ketua Kelas",
  "Wakil Ketua",
  "Sekretaris 1",
  "Sekretaris 2",
  "Bendahara 1",
  "Bendahara 2",
  "Keamanan",
  "Kesehatan 1",
  "Kesehatan 2",
];

export default function AdminEditSiswaPage() {
  const { nisn } = useParams<{ nisn: string }>();
  const router = useRouter();
  const {
    students,
    updateStudent,
    removeStudent,
    pushLog,
    refreshFromDb,
    currentUser,
    authInitialized,
  } = useAppData();

  const found = students.find((s) => s.nisn === nisn);
  const [form, setForm] = useState<Student | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // --- PROTEKSI RUTE & AUTH GUARD ---
  useEffect(() => {
    if (!authInitialized) return;

    if (!currentUser && sessionStorage.getItem("admin-ok") !== "1") {
      router.replace("/admin");
    }
  }, [authInitialized, currentUser, router]);

  useEffect(() => {
    if (found) setForm({ ...found });
  }, [found]);

  async function save() {
    if (!form) return;
    const role = (form.role || "").trim();

    if (role) {
      const dup = students.find(
        (s) => s.nisn !== form.nisn && (s.role || "").trim() === role
      );
      if (dup) {
        setToast(`Role "${role}" sudah dipakai oleh ${dup.nama}. Pilih role lain.`);
        return;
      }
    }

    await updateStudent(form.nisn, {
      ...form,
      role: role || undefined,
      roleClass: role
        ? role.toLowerCase().replace(/\s+/g, "-")
        : undefined,
    });
    pushLog("Edit siswa " + form.nama + (role ? " → " + role : ""));
    if (typeof refreshFromDb === "function") {
      await refreshFromDb();
    }
    router.push("/admin/siswa");
  }

  async function confirmDeleteStudent() {
    if (!form) return;
    await removeStudent(form.nisn);
    if (typeof refreshFromDb === "function") {
      await refreshFromDb();
    }
    router.push("/admin/siswa");
  }

  // Prevent render jika status auth belum siap
  if (!authInitialized || (!currentUser && sessionStorage.getItem("admin-ok") !== "1")) {
    return (
      <div style={{ textAlign: "center", padding: 40, color: "#94a3b8", fontSize: 12 }}>
        Memuat data autentikasi...
      </div>
    );
  }

  if (!form) {
    return (
      <div className="glass-card text-center" style={{ padding: 20 }}>
        <p style={{ color: "#94a3b8", marginBottom: 12 }}>Siswa tidak ditemukan</p>
        <button
          type="button"
          className="btn-action-light"
          onClick={() => router.push("/admin/siswa")}
        >
          ← Kembali ke Data Siswa
        </button>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 100 }}>
      <button
        type="button"
        className="btn-action-light"
        onClick={() => router.back()}
        style={{ marginBottom: 10 }}
      >
        ← Kembali
      </button>

      <div
        className="glass-card"
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <div className="title-sub">EDIT SISWA</div>

        <label style={{ fontSize: 10, color: "#94a3b8" }}>Nama</label>
        <input
          className="search-box expanded"
          style={{ width: "100%", padding: 12 }}
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
        />

        <label style={{ fontSize: 10, color: "#94a3b8" }}>NISN</label>
        <input
          className="search-box expanded"
          style={{ width: "100%", padding: 12 }}
          value={form.nisn}
          disabled
        />

        <label style={{ fontSize: 10, color: "#94a3b8" }}>NIS</label>
        <input
          className="search-box expanded"
          style={{ width: "100%", padding: 12 }}
          value={form.nis || ""}
          onChange={(e) => setForm({ ...form, nis: e.target.value })}
        />

        <label style={{ fontSize: 10, color: "#94a3b8" }}>Gender</label>
        <select
          value={form.gender}
          onChange={(e) =>
            setForm({ ...form, gender: e.target.value as "L" | "P" })
          }
          style={{
            padding: 12,
            borderRadius: 10,
            background: "#0f172a",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>

        <label style={{ fontSize: 10, color: "#94a3b8" }}>
          Role (unik — 1 role = 1 orang)
        </label>
        <select
          value={form.role || ""}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          style={{
            padding: 12,
            borderRadius: 10,
            background: "#0f172a",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          {ROLE_OPTIONS.map((r) => (
            <option key={r || "none"} value={r}>
              {r || "— Tanpa role —"}
            </option>
          ))}
        </select>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
        >
          {(["hadir", "izin", "sakit", "alpa"] as const).map((k) => (
            <label key={k} style={{ fontSize: 10 }}>
              {k}
              <input
                type="number"
                value={form[k]}
                onChange={(e) =>
                  setForm({ ...form, [k]: Number(e.target.value) })
                }
                style={{
                  width: "100%",
                  marginTop: 4,
                  padding: 8,
                  borderRadius: 8,
                  background: "#0f172a",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
            </label>
          ))}
        </div>

        <button type="button" className="btn-pay-qris" onClick={() => void save()}>
          Simpan
        </button>
        <button
          type="button"
          className="btn-action-light"
          style={{ color: "#f43f5e" }}
          onClick={() => setShowDeleteConfirm(true)}
        >
          Hapus siswa
        </button>
      </div>

      {/* MODAL KONFIRMASI HAPUS */}
      {showDeleteConfirm && (
        <div className="app-toast-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="app-toast" onClick={(e) => e.stopPropagation()} style={{ gap: 14 }}>
            <div className="app-toast-msg" style={{ fontSize: 13 }}>
              Yakin ingin menghapus siswa <strong>{form.nama}</strong>?
            </div>
            <div style={{ display: "flex", gap: 8, width: "100%" }}>
              <button
                type="button"
                className="app-toast-btn"
                style={{ background: "#334155", color: "#fff" }}
                onClick={() => setShowDeleteConfirm(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="app-toast-btn"
                style={{ background: "#f43f5e", color: "#fff" }}
                onClick={confirmDeleteStudent}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST / NOTIFIKASI KUSTOM */}
      {toast && (
        <div className="app-toast-overlay" onClick={() => setToast(null)}>
          <div className="app-toast" onClick={(e) => e.stopPropagation()}>
            <div className="app-toast-msg">{toast}</div>
            <button
              type="button"
              className="app-toast-btn"
              onClick={() => setToast(null)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
                }
