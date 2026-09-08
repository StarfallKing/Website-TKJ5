"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppData } from "@/lib/AppDataContext";
import { getInitials, type Student } from "@/lib/data";

export default function DirektoriPage() {
  const router = useRouter();
  const { students } = useAppData();

  const [query, setQuery] = useState("");
  const [gender, setGender] = useState<"all" | "L" | "P">("all");
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    return students.filter((s: Student) => {
      const q = query.toLowerCase().trim();
      const matchSearch =
        !q ||
        s.nama.toLowerCase().includes(q) ||
        s.nisn.includes(q) ||
        (s.nis && s.nis.includes(q));
      const matchGender = gender === "all" || s.gender === gender;
      return matchSearch && matchGender;
    });
  }, [query, gender, students]);

  const countL = students.filter((s) => s.gender === "L").length;
  const countP = students.filter((s) => s.gender === "P").length;

  // Fungsi menyalin nama siswa berdasarkan filter/pencarian saat ini
  const handleCopyNames = () => {
    if (!filtered || filtered.length === 0) return;

    // Gabungkan nama siswa dengan enter/line break (\n) agar pas dipaste di Wheel of Names
    const namesList = filtered.map((s) => s.nama).join("\n");

    navigator.clipboard.writeText(namesList).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

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

      <div className="filter-pills" style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px" }}>
        <button
          type="button"
          className={`filter-btn ${gender === "all" ? "active" : ""}`}
          onClick={() => setGender("all")}
        >
          Semua ({students.length})
        </button>
        <button
          type="button"
          className={`filter-btn ${gender === "L" ? "active" : ""}`}
          onClick={() => setGender("L")}
        >
          Laki-Laki ({countL})
        </button>
        <button
          type="button"
          className={`filter-btn ${gender === "P" ? "active" : ""}`}
          onClick={() => setGender("P")}
        >
          Perempuan ({countP})
        </button>

        {/* Tombol Salin Nama Siswa untuk Wheel of Names */}
        <button
          type="button"
          className="filter-btn"
          onClick={handleCopyNames}
          style={{
            background: copied ? "rgba(34,197,94,0.25)" : "rgba(59,130,246,0.2)",
            color: copied ? "#4ade80" : "#60a5fa",
            borderColor: copied ? "rgba(34,197,94,0.4)" : "rgba(96,165,250,0.35)",
            whiteSpace: "nowrap",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          <i className={`fa-solid ${copied ? "fa-check" : "fa-copy"}`} style={{ marginRight: 6 }} />
          {copied ? "Nama Tersalin!" : "Salin Nama"}
        </button>
      </div>

      <div className="student-list">
        {filtered.length === 0 && (
          <div
            className="glass-card text-center"
            style={{ fontSize: "11px", color: "#94a3b8", padding: "20px" }}
          >
            Siswa tidak ditemukan
          </div>
        )}

        {filtered.map((siswa) => {
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
                    <div className={`officer-badge ${siswa.roleClass || ""}`}>
                      <i className={`fa-solid ${siswa.icon || "fa-user"}`} />
                      <span>{siswa.role}</span>
                    </div>
                  )}
                  <span className="student-subtext">
                    NISN: {siswa.nisn}
                    {siswa.nis ? ` · NIS: ${siswa.nis}` : ""} ·{" "}
                    {isMale ? "Laki-laki" : "Perempuan"}
                  </span>
                </div>
              </div>
              <span
                className={`student-badge ${isMale ? "badge-l" : "badge-p"}`}
              >
                {isMale ? "Laki-Laki" : "Perempuan"}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}
