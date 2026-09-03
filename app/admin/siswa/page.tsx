"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getInitials, type Student } from "@/lib/data";
import { useAppData } from "@/lib/AppDataContext";

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
  const { students, addStudent, updateStudent, removeStudent } = useAppData();
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<Student | null>(null);
  const [isNew, setIsNew] = useState(false);

  const list = useMemo(() => {
    const t = q.toLowerCase().trim();
    return students.filter(
      (s) =>
        !t ||
        s.nama.toLowerCase().includes(t) ||
        s.nisn.includes(t)
    );
  }, [students, q]);

  function save() {
    if (!edit || !edit.nama.trim()) return;
    if (isNew) {
      addStudent({
        ...edit,
        nisn: edit.nisn || "TMP" + Date.now(),
      });
    } else {
      updateStudent(edit.nisn, edit);
    }
    setEdit(null);
    setIsNew(false);
  }

  return (
    <>
      <div className="glass-card text-center">
        <div className="title-sub">DATA SISWA</div>
        <p style={{ fontSize: 12, fontWeight: 700 }}>
          Tambah / edit / hapus · tampilan seperti direktori
        </p>
      </div>

      <button
        type="button"
        className="btn-pay-qris"
        style={{ marginBottom: 10 }}
        onClick={() => {
          setIsNew(true);
          setEdit({ ...empty });
        }}
      >
        + Tambah siswa
      </button>

      <div
        className="search-box expanded"
        style={{ width: "100%", marginBottom: 10 }}
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
          <div className="title-sub">{isNew ? "TAMBAH" : "EDIT CEPAT"}</div>
          <input
            className="search-box expanded"
            style={{ width: "100%", padding: 10 }}
            placeholder="Nama"
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
            }}
          >
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
          <input
            className="search-box expanded"
            style={{ width: "100%", padding: 10 }}
            placeholder="Role (opsional)"
            value={edit.role || ""}
            onChange={(e) => setEdit({ ...edit, role: e.target.value })}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" className="btn-pay-qris" onClick={save}>
              Simpan
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
                <span className="student-subtext">NISN: {s.nisn}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              {/* Sub-page edit lengkap */}
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
                onClick={() => {
                  if (confirm("Hapus " + s.nama + "?")) {
                    removeStudent(s.nisn);
                  }
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
