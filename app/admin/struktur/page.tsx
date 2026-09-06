"use client";

import { useMemo } from "react";
import { useAppData } from "@/lib/AppDataContext";

export default function AdminStrukturPage() {
  const { students } = useAppData();

  const officers = useMemo(
    () => students.filter((s) => s.role),
    [students]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="glass-card text-center">
        <div className="title-sub">STRUKTUR KEPENGURUSAN</div>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginTop: 4 }}>
          Edit lewat Data Siswa (role / badge)
        </p>
      </div>

      <div className="glass-card text-center" style={{ padding: 16 }}>
        <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>
          WALI KELAS
        </div>
        <div style={{ fontWeight: 800 }}>Shendy Nuria Feriansyah, S.Pd</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {officers.map((s) => (
          <div key={s.nisn} className="glass-card flex-between">
            <div>
              <div style={{ fontWeight: 800, fontSize: 12 }}>{s.nama}</div>
              <div style={{ fontSize: 10, color: "#60a5fa" }}>{s.role}</div>
            </div>
            <LinkOrHint />
          </div>
        ))}
      </div>
    </div>
  );
}

function LinkOrHint() {
  return (
    <a href="/admin/siswa" className="btn-action-light" style={{ fontSize: 10 }}>
      Edit
    </a>
  );
}
