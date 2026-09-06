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
  const { students, updateStudent, removeStudent, pushLog } = useAppData();
  const found = students.find((s) => s.nisn === nisn);
  const [form, setForm] = useState<Student | null>(null);

  useEffect(() => {
    if (found) setForm({ ...found });
  }, [found]);

  if (!form) {
    return (
      <div className="glass-card text-center">Siswa tidak ditemukan</div>
    );
  }

  async function save() {
    if (!form) return;
    const role = (form.role || "").trim();

    // Role unik: boleh kosong, tapi tidak boleh sama dengan siswa lain
    if (role) {
      const dup = students.find(
        (s) => s.nisn !== form.nisn && (s.role || "").trim() === role
      );
      if (dup) {
        alert(
          'Role "' + role + '" sudah dipakai oleh ' + dup.nama + ". Pilih role lain."
        );
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
    router.push("/admin/siswa");
  }

  return (
    <>
      <button
        type="button"
        className="btn-action-light"
        onClick={() => router.back()}
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
          onClick={() => {
            if (confirm("Hapus siswa?")) {
              removeStudent(form.nisn);
              router.push("/admin/siswa");
            }
          }}
        >
          Hapus siswa
        </button>
      </div>
    </>
  );
}
