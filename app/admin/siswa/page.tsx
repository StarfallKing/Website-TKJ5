"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getInitials, type Student } from "@/lib/data";
import { useAppData } from "@/lib/AppDataContext";
import AdminHeader from "@/components/layout/AdminHeader";

const empty: Student = {
  nama: "",
  gender: "L",
  nisn: "",
  nis: "",
  hadir: 0,
  izin: 0,
  sakit: 0,
  alpa: 0,
};

export default function AdminSiswaPage() {
  const router = useRouter();
  const {
    students,
    addStudent,
    updateStudent,
    removeStudent,
    refreshFromDb,
    currentUser,
    authInitialized,
  } = useAppData();
  
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<Student | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [saving, setSaving] = useState(false);

  // --- PROTEKSI RUTE & AUTH GUARD ---
  useEffect(() => {
    if (!authInitialized) return;

    if (!currentUser && sessionStorage.getItem("admin-ok") !== "1") {
      router.replace("/admin");
    }
  }, [authInitialized, currentUser, router]);

  const list = useMemo(() => {
    const t = q.toLowerCase().trim();
    return students.filter(
      (s) =>
        !t ||
        s.nama.toLowerCase().includes(t) ||
        s.nisn.includes(t)
    );
  }, [students, q]);

  async function save() {
    if (!edit || !edit.nama.trim()) {
      setToast("Nama siswa tidak boleh kosong!");
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        await addStudent({
          ...edit,
          nisn: edit.nisn.trim() || "TMP" + Date.now(),
        });
        setToast("Siswa baru berhasil ditambahkan & disinkronkan! ✓");
      } else {
        await updateStudent(edit.nisn, edit);
        setToast("Data siswa berhasil diperbarui! ✓");
      }
      setEdit(null);
      setIsNew(false);
      if (typeof refreshFromDb === "function") {
        await refreshFromDb();
      }
    } catch (e: any) {
      setToast("Gagal menyimpan data: " + (e.message || e));
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await removeStudent(deleteTarget.nisn);
      setToast(`Siswa ${deleteTarget.nama} berhasil dihapus.`);
      setDeleteTarget(null);
      if (typeof refreshFromDb === "function") {
        await refreshFromDb();
      }
    } catch (e: any) {
      setToast("Gagal menghapus siswa: " + (e.message || e));
    }
  }

  // Prevent render jika status auth belum siap
  if (!authInitialized || (!currentUser && sessionStorage.getItem("admin-ok") !== "1")) {
    return (
      <div style={{ textAlign: "center", padding: 40, color: "#94a3b8", fontSize: 12 }}>
        Memuat data siswa...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingBottom: 100 }}>
      <AdminHeader />

      <div className="glass-card text-center">
        <div className="title-sub">DIREKTORI MURID</div>
        <p style={{ fontSize: 12, fontWeight: 700 }}>
          Data Anggota Siswa Kelas TKJ-5
        </p>
      </div>

      <button
        type="button"
        className="btn-pay-qris"
        style={{ marginBottom: 2 }}
        onClick={() => {
          setIsNew(true);
          setEdit({ ...empty });
        }}
      >
        + Tambah siswa
      </button>

      <div
        className="search-box expanded"
        style={{ width: "100%", marginBottom: 2 }}
      >
        <div className="search-icon">
          <i className="fa-solid fa-magnifying-glass" />
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari nama / NISN..."
        />
      </div>

      {edit && (
        <div
          className="glass-card"
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          <div className="title-sub">{isNew ? "TAMBAH SISWA BARU" : "EDIT CEPAT"}</div>
          <input
            className="search-box expanded"
            style={{ width: "100%", padding: 10 }}
            placeholder="Nama Lengkap"
            value={edit.nama}
            onChange={(e) => setEdit({ ...edit, nama: e.target.value })}
          />
          <input
            className="search-box expanded"
            style={{ width: "100%", padding: 10 }}
            placeholder="NISN"
            value={edit.nisn}
            disabled={!isNew}
            onChange={(e) => setEdit({ ...edit, nisn: e.target.value })}
          />

          <input
            className="search-box expanded"
            style={{ width: "100%", padding: 10 }}
            placeholder="NIS (Nomor Induk)"
            value={edit.nis}
            onChange={(e) => setEdit({ ...edit, nis: e.target.value })}
          />
          
          <select
            value={edit.gender}
            onChange={(e) =>
              setEdit({ ...edit, gender: e.target.value as "L" | "P" })
            }
            style={{
              padding: 10,
              borderRadius: 10,
              background: "#0f172a",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>

          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" className="btn-pay-qris" onClick={save} disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              type="button"
              className="btn-action-light"
              onClick={() => {
                setEdit(null);
                setIsNew(false);
              }}
            >
              Batal
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {list.map((s) => (
          <div key={s.nisn} className="glass-card student-card">
            <div className="flex-row">
              <div
                className={
                  "student-avatar" + (s.gender === "P" ? " female" : "")
                }
              >
                {getInitials(s.nama)}
              </div>
              <div className="student-info">
                <span className="student-name">{s.nama}</span>
                {s.role && (
                  <div className="officer-badge">
                    <span>{s.role}</span>
                  </div>
                )}
                <span className="student-subtext">
                  NISN: {s.nisn} · NIS: {s.nis}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              <button
                type="button"
                className="btn-action-light"
                style={{ fontSize: 10 }}
                onClick={() => router.push("/admin/siswa/" + s.nisn)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn-action-light"
                style={{ fontSize: 10, color: "#f43f5e" }}
                onClick={() => setDeleteTarget(s)}
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL KONFIRMASI HAPUS SISWA */}
      {deleteTarget && (
        <div className="app-toast-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="app-toast" onClick={(e) => e.stopPropagation()} style={{ gap: 14 }}>
            <div className="app-toast-msg" style={{ fontSize: 13 }}>
              Yakin ingin menghapus siswa <strong>{deleteTarget.nama}</strong>?
            </div>
            <div style={{ display: "flex", gap: 8, width: "100%" }}>
              <button
                type="button"
                className="app-toast-btn"
                style={{ background: "#334155", color: "#fff" }}
                onClick={() => setDeleteTarget(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="app-toast-btn"
                style={{ background: "#f43f5e", color: "#fff" }}
                onClick={confirmDelete}
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
                         
