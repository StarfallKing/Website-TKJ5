"use client";

import { useMemo, useState } from "react";
import {
  monthConfigs,
  schoolYearDays,
  type StatusHarian,
} from "@/lib/data";
import { useAppData } from "@/lib/AppDataContext";

const CYCLE: StatusHarian[] = ["H", "I", "S", "A", "-"];
const DAYS = schoolYearDays(2026);

export default function AdminAbsensiPage() {
  const { students, getAttendanceCell, setAttendanceCell } = useAppData();
  const [monthIdx, setMonthIdx] = useState(0);
  const m = monthConfigs[monthIdx];

  const avg = useMemo(() => {
    const n = students.length || 1;
    const sumH = students.reduce((a, s) => a + (s.hadir || 0), 0);
    const sumI = students.reduce((a, s) => a + (s.izin || 0), 0);
    const sumS = students.reduce((a, s) => a + (s.sakit || 0), 0);
    const sumA = students.reduce((a, s) => a + (s.alpa || 0), 0);
    return {
      h: (sumH / n / DAYS) * 100,
      i: (sumI / n / DAYS) * 100,
      s: (sumS / n / DAYS) * 100,
      a: (sumA / n / DAYS) * 100,
    };
  }, [students]);

  function cycle(si: number, day: number) {
    const cur = getAttendanceCell(si, monthIdx, day);
    const i = CYCLE.indexOf(cur);
    const next = CYCLE[(i < 0 ? 0 : i + 1) % CYCLE.length];
    void setAttendanceCell(si, monthIdx, day, next);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* 1. REKAP RATA-RATA ATAS (Sesuai Gambar 1) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 10,
        }}
      >
        <div className="glass-card text-center" style={{ padding: "14px 10px" }}>
          <div
            style={{
              fontSize: 9,
              color: "#60a5fa",
              fontWeight: 800,
              letterSpacing: 0.5,
            }}
          >
            RATA-RATA HADIR
          </div>
          <div
            style={{
              fontWeight: 900,
              color: "#4ade80",
              fontSize: 20,
              marginTop: 4,
            }}
          >
            {avg.h.toFixed(1)}%
          </div>
        </div>

        <div className="glass-card text-center" style={{ padding: "14px 10px" }}>
          <div
            style={{
              fontSize: 9,
              color: "#60a5fa",
              fontWeight: 800,
              letterSpacing: 0.5,
            }}
          >
            RATA-RATA IZIN
          </div>
          <div
            style={{
              fontWeight: 900,
              color: "#60a5fa",
              fontSize: 20,
              marginTop: 4,
            }}
          >
            {avg.i.toFixed(1)}%
          </div>
        </div>

        <div className="glass-card text-center" style={{ padding: "14px 10px" }}>
          <div
            style={{
              fontSize: 9,
              color: "#60a5fa",
              fontWeight: 800,
              letterSpacing: 0.5,
            }}
          >
            RATA-RATA SAKIT
          </div>
          <div
            style={{
              fontWeight: 900,
              color: "#facc15",
              fontSize: 20,
              marginTop: 4,
            }}
          >
            {avg.s.toFixed(1)}%
          </div>
        </div>

        <div className="glass-card text-center" style={{ padding: "14px 10px" }}>
          <div
            style={{
              fontSize: 9,
              color: "#60a5fa",
              fontWeight: 800,
              letterSpacing: 0.5,
            }}
          >
            RATA-RATA ALPA
          </div>
          <div
            style={{
              fontWeight: 900,
              color: "#f43f5e",
              fontSize: 20,
              marginTop: 4,
            }}
          >
            {avg.a.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* 2. REKAP AKUMULASI 1 TAHUN AJARAN (Sesuai Gambar 3) */}
      <div className="glass-card" style={{ padding: 12 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <div className="title-sub" style={{ fontSize: 11 }}>
            REKAP 1 TAHUN (ANGKA + % DARI {DAYS} HARI)
          </div>
          <span
            style={{
              fontSize: 9,
              background: "rgba(74, 222, 128, 0.15)",
              color: "#4ade80",
              padding: "2px 8px",
              borderRadius: 12,
              fontWeight: 700,
              border: "1px solid rgba(74, 222, 128, 0.3)",
            }}
          >
            T.A 2026/2027
          </span>
        </div>

        <div className="table-responsive">
          <table className="absensi-table" style={{ width: "100%", fontSize: 10 }}>
            <thead>
              <tr>
                <th>No</th>
                <th style={{ textAlign: "left" }}>Nama</th>
                <th style={{ color: "#4ade80" }}>H</th>
                <th style={{ color: "#60a5fa" }}>I</th>
                <th style={{ color: "#facc15" }}>S</th>
                <th style={{ color: "#f43f5e" }}>A</th>
                <th style={{ textAlign: "center", minWidth: 160 }}>PERSENTASE</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => {
                const h = s.hadir || 0;
                const iz = s.izin || 0;
                const sk = s.sakit || 0;
                const al = s.alpa || 0;

                const pctH = ((h / DAYS) * 100).toFixed(1);
                const pctI = ((iz / DAYS) * 100).toFixed(1);
                const pctS = ((sk / DAYS) * 100).toFixed(1);
                const pctA = ((al / DAYS) * 100).toFixed(1);

                return (
                  <tr key={s.nisn}>
                    <td style={{ color: "#60a5fa", fontWeight: 700 }}>{i + 1}</td>
                    <td
                      style={{
                        textAlign: "left",
                        fontWeight: 700,
                        fontSize: 10,
                      }}
                    >
                      {s.nama}
                    </td>
                    <td style={{ color: "#4ade80", fontWeight: 700 }}>{h}</td>
                    <td style={{ color: "#60a5fa", fontWeight: 700 }}>{iz}</td>
                    <td style={{ color: "#facc15", fontWeight: 700 }}>{sk}</td>
                    <td style={{ color: "#f43f5e", fontWeight: 700 }}>{al}</td>
                    <td style={{ padding: "8px 4px" }}>
                      {/* Teks %H %I %S %A */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 8,
                          fontWeight: 800,
                          marginBottom: 4,
                          gap: 2,
                        }}
                      >
                        <span style={{ color: "#4ade80" }}>H:{pctH}%</span>
                        <span style={{ color: "#60a5fa" }}>I:{pctI}%</span>
                        <span style={{ color: "#facc15" }}>S:{pctS}%</span>
                        <span style={{ color: "#f43f5e" }}>A:{pctA}%</span>
                      </div>

                      {/* Stacked Progress Bar */}
                      <div
                        style={{
                          width: "100%",
                          height: 6,
                          background: "rgba(255,255,255,0.08)",
                          borderRadius: 4,
                          overflow: "hidden",
                          display: "flex",
                        }}
                      >
                        <div
                          style={{
                            width: `${pctH}%`,
                            background: "#4ade80",
                            height: "100%",
                          }}
                        />
                        <div
                          style={{
                            width: `${pctI}%`,
                            background: "#60a5fa",
                            height: "100%",
                          }}
                        />
                        <div
                          style={{
                            width: `${pctS}%`,
                            background: "#facc15",
                            height: "100%",
                          }}
                        />
                        <div
                          style={{
                            width: `${pctA}%`,
                            background: "#f43f5e",
                            height: "100%",
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT ABSENSI HARIAN */}
      <div className="glass-card text-center">
        <div className="title-sub">EDIT ABSENSI HARIAN</div>
        <p style={{ fontSize: 11, color: "#94a3b8" }}>
          Ketuk sel: H → I → S → A → -
        </p>
      </div>

      {/* Filter Bulan */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
        }}
      >
        {monthConfigs.map((mc, i) => {
          const isActive = monthIdx === i;
          return (
            <button
              key={mc.name}
              type="button"
              onClick={() => setMonthIdx(i)}
              style={{
                padding: "10px 4px",
                borderRadius: 10,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                textAlign: "center",
                border: isActive
                  ? "1px solid rgba(96,165,250,0.8)"
                  : "1px solid rgba(255,255,255,0.08)",
                background: isActive
                  ? "linear-gradient(135deg, rgba(37,99,235,0.4), rgba(29,78,216,0.6))"
                  : "rgba(15, 23, 42, 0.4)",
                color: isActive ? "#fff" : "#94a3b8",
                boxShadow: isActive ? "0 0 12px rgba(37,99,235,0.4)" : "none",
              }}
            >
              {mc.name}
            </button>
          );
        })}
      </div>

      {/* Tabel Harian */}
      <div className="glass-card" style={{ padding: 10 }}>
        <div className="table-responsive">
          <table className="absensi-table monthly-table">
            <thead>
              <tr>
                <th>No</th>
                <th style={{ textAlign: "left" }}>Nama</th>
                {Array.from({ length: m.days }, (_, d) => (
                  <th key={d}>{d + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s, si) => (
                <tr key={s.nisn}>
                  <td style={{ color: "#60a5fa", fontWeight: 700 }}>{si + 1}</td>
                  <td
                    style={{
                      textAlign: "left",
                      fontWeight: 700,
                      fontSize: 10,
                    }}
                  >
                    {s.nama}
                  </td>
                  {Array.from({ length: m.days }, (_, d) => {
                    const day = d + 1;
                    const st = getAttendanceCell(si, monthIdx, day);
                    return (
                      <td
                        key={day}
                        onClick={() => cycle(si, day)}
                        style={{
                          cursor: "pointer",
                          fontWeight: 800,
                          fontSize: 10,
                          color:
                            st === "H"
                              ? "#4ade80"
                              : st === "I"
                              ? "#60a5fa"
                              : st === "S"
                              ? "#facc15"
                              : st === "A"
                              ? "#f43f5e"
                              : "#64748b",
                        }}
                      >
                        {st}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
