"use client";

import { useMemo, useState } from "react";
import { allStudents, getInitials, type Student } from "@/lib/data";
import { useRouter } from "next/navigation";

export default function DirektoriPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [gender, setGender] = useState<"all" | "L" | "P">("all");
  const [expanded, setExpanded] = useState(false);

  const filtered = useMemo(() => {
    return allStudents.filter((s) => {
      const q = query.toLowerCase().trim();
      const matchSearch =
        !q ||
        s.nama.toLowerCase().includes(q) ||
        s.nisn.includes(q);
      const matchGender = gender === "all" || s.gender === gender;
      return matchSearch && matchGender;
    });
  }, [query, gender]);

  const countL = allStudents.filter((s) => s.gender === "L").length;
  const countP = allStudents.filter((s) => s.gender === "P").length;

  return (
    <>
      <div
        className="glass-card text-center"
        style={{ display: "flex", flexDirection: "column", gap: "4px" }}
      >
        <div className="title-sub">DIREKTORI MURID</div>
        <p style={{ fontSize: "12px", color: "#fff", fontWeight: 700 }}>
          Data Anggota Kelas X TKJ-5
        </p>
      </div>

      {/* Search */}
      <div className="search-wrapper">
        <div
          className={`search-box ${expanded || query ? "expanded" : ""}`}
          onClick={() => setExpanded(true)}
        >
          <div className="search-icon">
            <i className="fa-solid fa-magnifying-glass" />
          </div>
          <input
            type="text"
            placeholder="Cari nama atau NISN murid..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setExpanded(true)}
            autoComplete="off"
          />
        </div>
      </div>

      {/* Filter */}
      <div className="filter-pills">
        <button
          className={`filter-btn ${gender === "all" ? "active" : ""}`}
          onClick={() => setGender("all")}
        >
          Semua ({allStudents.length})
        </button>
        <button
          className={`filter-btn ${gender === "L" ? "active" : ""}`}
          onClick={() => setGender("L")}
        >
          Laki-Laki ({countL})
        </button>
        <button
          className={`filter-btn ${gender === "P" ? "active" : ""}`}
          onClick={() => setGender("P")}
        >
          Perempuan ({countP})
        </button>
      </div>

      {/* List */}
      <div className="student-list">
        {filtered.length === 0 && (
          <div className="glass-card text-center" style={{ fontSize: "11px", color: "#94a3b8", padding: "20px" }}>
            Siswa tidak ditemukan
          </div>
        )}

        {filtered.map((siswa: Student) => {
  const isMale = siswa.gender === "L";
  return (
    <div
      key={siswa.nisn}
      className="glass-card student-card"
      style={{ cursor: "pointer" }}
      onClick={() => router.push(`/siswa/${siswa.nisn}`)}
    >
      <div className="flex-row">
        <div className={`student-avatar ${isMale ? "" : "female"}`}>
          {getInitials(siswa.nama)}
        </div>
        <div className="student-info">
          <span className="student-name">{siswa.nama}</span>
          {siswa.role && (
            <div className={`officer-badge ${siswa.roleClass}`}>
              <i className={`fa-solid ${siswa.icon}`} />
              <span>{siswa.role}</span>
            </div>
          )}
          <span className="student-subtext">
            NISN: {siswa.nisn} • {isMale ? "Laki-laki" : "Perempuan"}
          </span>
        </div>
      </div>
      <span className={`student-badge ${isMale ? "badge-l" : "badge-p"}`}>
        {isMale ? "Laki-Laki" : "Perempuan"}
      </span>
    </div>
  );
})}
      </div>
    </>
  );
}