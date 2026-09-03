"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppData } from "@/lib/AppDataContext";
import type { Student } from "@/lib/data";

export default function AdminEditSiswaPage() {
  const { nisn } = useParams<{ nisn: string }>();
  const router = useRouter();
  const { students, updateStudent, removeStudent, pushLog } = useAppData() as any;
  const found = students.find((s: Student) => s.nisn === nisn);
  const [form, setForm] = useState<Student | null>(null);

  useEffect(() => {
    if (found) setForm({ ...found });
  }, [found]);

  if (!form) {
    return (
      <div className="glass-card text-center">Siswa tidak ditemukan</div>
    );
  }

  function save() {
    if (!form) return;
    updateStudent(form.nisn, form);
    pushLog?.("Edit siswa " + form.nama);
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
      <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="title-sub">EDIT SISWA</div>
        {(["nama", "role"] as const).map((k) => (
          <input
            key={k}
            className="search-box expanded"
            style={{ width: "100%", padding: 12 }}
            value={(form as any)[k] || ""}
            placeholder={k}
            onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          />
        ))}
        <select
          value={form.gender}
          onChange={(e) =>
            setForm({ ...form, gender: e.target.value as "L" | "P" })
          }
          style={{ padding: 12, borderRadius: 10, background: "#0f172a", color: "#fff" }}
        >
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
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
        <button type="button" className="btn-pay-qris" onClick={save}>
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
