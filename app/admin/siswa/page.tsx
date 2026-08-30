"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppData } from "@/lib/AppDataContext";
import type { Student } from "@/lib/data";

export default function AdminSiswaPage() {
  const router = useRouter();
  const { students, updateStudent, addStudent, removeStudent } = useAppData();
  const [editNisn, setEditNisn] = useState<string | null>(null);
  const [form, setForm] = useState({
    nama: "",
    nisn: "",
    gender: "L" as "L" | "P",
    hadir: 0,
    izin: 0,
    sakit: 0,
    alpa: 0,
  });

  useEffect(() => {
    if (sessionStorage.getItem("admin-ok") !== "1") router.replace("/admin");
  }, [router]);

  function startEdit(s: Student) {
    setEditNisn(s.nisn);
    setForm({
      nama: s.nama,
      nisn: s.nisn,
      gender: s.gender,
      hadir: s.hadir,
      izin: s.izin,
      sakit: s.sakit,
      alpa: s.alpa,
    });
  }

  function save() {
    if (!form.nama.trim() || !form.nisn.trim()) {
      alert("Nama & NISN wajib");
      return;
    }
    if (editNisn) {
      updateStudent(editNisn, {
        nama: form.nama.toUpperCase(),
        gender: form.gender,
        hadir: Number(form.hadir),
        izin: Number(form.izin),
        sakit: Number(form.sakit),
        alpa: Number(form.alpa),
      });
    } else {
      if (students.some((s) => s.nisn === form.nisn)) {
        alert("NISN sudah ada");
        return;
      }
      addStudent({
        nama: form.nama.toUpperCase(),
        nisn: form.nisn,
        gender: form.gender,
        hadir: Number(form.hadir),
        izin: Number(form.izin),
        sakit: Number(form.sakit),
        alpa: Number(form.alpa),
      });
    }
    setEditNisn(null);
    setForm({
      nama: "",
      nisn: "",
      gender: "L",
      hadir: 0,
      izin: 0,
      sakit: 0,
      alpa: 0,
    });
  }

  return (
    <>
      <div className="glass-card text-center">
        <div className="title-sub">KELOLA DATA SISWA</div>
        <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
          Tambah / edit / hapus — langsung terlihat di web publik
        </p>
      </div>

      <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="title-sub">{editNisn ? "Edit Siswa" : "Tambah Siswa"}</div>
        <input
          className="form-textarea"
          style={{ minHeight: 40 }}
          placeholder="Nama"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
        />
        <input
          className="form-textarea"
          style={{ minHeight: 40 }}
          placeholder="NISN"
          value={form.nisn}
          disabled={!!editNisn}
          onChange={(e) => setForm({ ...form, nisn: e.target.value })}
        />
        <select
          className="form-select"
          value={form.gender}
          onChange={(e) =>
            setForm({ ...form, gender: e.target.value as "L" | "P" })
          }
        >
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>
        <div className="grid-4">
          {(["hadir", "izin", "sakit", "alpa"] as const).map((k) => (
            <input
              key={k}
              type="number"
              className="form-textarea"
              style={{ minHeight: 36, fontSize: 11 }}
              placeholder={k}
              value={form[k]}
              onChange={(e) =>
                setForm({ ...form, [k]: Number(e.target.value) })
              }
            />
          ))}
        </div>
        <button className="btn-pay-qris" type="button" onClick={save}>
          {editNisn ? "Simpan Perubahan" : "Tambah Siswa"}
        </button>
      </div>

      <div className="student-list">
        {students.map((s) => (
          <div key={s.nisn} className="glass-card student-card">
            <div className="student-info">
              <span className="student-name">{s.nama}</span>
              <span className="student-subtext">
                {s.nisn} · H{s.hadir} I{s.izin} S{s.sakit} A{s.alpa}
              </span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="btn-action-light" type="button" onClick={() => startEdit(s)}>
                Edit
              </button>
              <button
                className="btn-action-light"
                type="button"
                style={{ color: "#f43f5e" }}
                onClick={() => {
                  if (confirm(`Hapus ${s.nama}?`)) removeStudent(s.nisn);
                }}
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}