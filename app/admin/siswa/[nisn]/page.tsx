"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppData } from "@/lib/AppDataContext";
import type { Student } from "@/lib/data";

export default function AdminEditSiswaPage() {
  const { nisn } = useParams<{ nisn: string }>();
  const router = useRouter();
  const { students, updateStudent, removeStudent, pushLog } = useAppData();

  const found = students.find((s) => s.nisn === nisn);
  const [form, setForm] = useState<Student | null>(null);

  useEffect(() => {
    if (found) setForm({ ...found });
  }, [found]);

  if (!form) {
    return (
      <div className="glass-card text-center" style={{ marginTop: 20 }}>
        Siswa tidak ditemukan
      </div>
    );
  }

  function save() {
    if (!form) return;
    if (!form.nama.trim()) {
      alert("Nama wajib diisi");
      return;
    }
    updateStudent(form.nisn, form);
    pushLog("Edit siswa " + form.nama);
    router.push("/admin/siswa");
  }

  return (
    <>
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
        <p style={{ fontSize: 11, color: "#94a3b8" }}>
          Ubah biodata · NISN / NIS · absensi rekap · role
        </p>

        <label style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8" }}>
          NAMA
        </label>
        <input
          className="search-box expanded"
          style={{ width: "100%", padding: 12 }}
          value={form.nama}
          placeholder="Nama lengkap"
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
        />

        <label style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8" }}>
          NISN
        </label>
        <input
          className="search-box expanded"
          style={{ width: "100%", padding: 12 }}
          value={form.nisn}
          placeholder="NISN"
          onChange={(e) => setForm({ ...form, nisn: e.target.value })}
        />

        <label style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8" }}>
          NIS (Nomor Induk)
        </label>
        <input
          className="search-box expanded"
          style={{ width: "100%", padding: 12 }}
          value={form.nis || ""}
          placeholder="Contoh: 26100171"
          onChange={(e) => setForm({ ...form, nis: e.target.value })}
        />

        <label style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8" }}>
          GENDER
        </label>
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
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>

        <label style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8" }}>
          ROLE / JABATAN (opsional)
        </label>
        <input
          className="search-box expanded"
          style={{ width: "100%", padding: 12 }}
          value={form.role || ""}
          placeholder="Contoh: Bendahara 1, Wakil Ketua"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        />

        <div className="title-sub" style={{ marginTop: 6 }}>
          REKAP ABSENSI (1 tahun)
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
          }}
        >
          {(
            [
              ["hadir", "#4ade80"],
              ["izin", "#60a5fa"],
              ["sakit", "#facc15"],
              ["alpa", "#f43f5e"],
            ] as const
          ).map(([k, color]) => (
            <label key={k} style={{ fontSize: 10, color }}>
              {k.toUpperCase()}
              <input
                type="number"
                min={0}
                value={form[k]}
                onChange={(e) =>
                  setForm({ ...form, [k]: Number(e.target.value) || 0 })
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

        <button type="button" className="btn-pay-qris" onClick={save}>
          Simpan perubahan
        </button>

        <button
          type="button"
          className="btn-action-light"
          style={{ color: "#f43f5e" }}
          onClick={() => {
            if (confirm("Hapus " + form.nama + " dari data kelas?")) {
              removeStudent(form.nisn);
              pushLog("Hapus siswa " + form.nama);
              router.push("/admin/siswa");
            }
          }}
        >
          Hapus siswa
        </button>
      </div>

      {/* Shortcut GLMS */}
      <a
        href="https://smkpgri2cbn.sch.id/glms/siswa/login.html"
        target="_blank"
        rel="noopener noreferrer"
        className="glass-card flex-between"
        style={{ textDecoration: "none", marginTop: 12 }}
      >
        <div>
          <div style={{ fontWeight: 800, fontSize: 12, color: "#f8fafc" }}>
            GLMS Account
          </div>
          <div style={{ fontSize: 10, color: "#94a3b8" }}>
            Gocir LMS · Login siswa sekolah
          </div>
        </div>
        <i
          className="fa-solid fa-arrow-up-right-from-square"
          style={{ color: "#60a5fa" }}
        />
      </a>
    </>
  );
        }
