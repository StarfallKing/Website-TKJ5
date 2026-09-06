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
    const sumH = students.reduce((a, s) => a + s.hadir, 0);
    const sumI = students.reduce((a, s) => a + s.izin, 0);
    const sumS = students.reduce((a, s) => a + s.sakit, 0);
    const sumA = students.reduce((a, s) => a + s.alpa, 0);
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
    <>
      {/* Rata-rata kelas */}
      <div className="glass-card text-center" style={{ marginBottom: 12 }}>
        <div className="title-sub">RATA-RATA KEHADIRAN 1 TAHUN</div>
        <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>
          Pembagi: {DAYS} hari (1 Jul 2026 – 30 Jun 2027)
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: 8,
            marginTop: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 9, color: "#94a3b8" }}>HADIR</div>
            <div style={{ fontWeight: 900, color: "#4ade80", fontSize: 16 }}>
              {avg.h.toFixed(1)}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: "#94a3b8" }}>IZIN</div>
            <div style={{ fontWeight: 900, color: "#60a5fa", fontSize: 16 }}>
              {avg.i.toFixed(1)}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: "#94a3b8" }}>SAKIT</div>
            <div style={{ fontWeight: 900, color: "#facc15", fontSize: 16 }}>
              {avg.s.toFixed(1)}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: "#94a3b8" }}>ALPA</div>
            <div style={{ fontWeight: 900, color: "#f43f5e", fontSize: 16 }}>
              {avg.a.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Rekap angka + % per siswa */}
      <div className="glass-card" style={{ padding: 10, marginBottom: 12 }}>
        <div className="title-sub" style={{ marginBottom: 8 }}>
          Rekap 1 Tahun (angka + % dari {DAYS} hari)
        </div>
        <div className="table-responsive">
          <table className="absensi-table">
            <thead>
              <tr>
                <th>No</th>
                <th style={{ textAlign: "left" }}>Nama</th>
                <th style={{ color: "#4ade80" }}>H</th>
                <th style={{ color: "#60a5fa" }}>I</th>
                <th style={{ color: "#facc15" }}>S</th>
                <th style={{ color: "#f43f5e" }}>A</th>
                <th style={{ color: "#4ade80" }}>%H</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s.nisn}>
                  <td>{i + 1}</td>
                  <td style={{ textAlign: "left", fontWeight: 700, fontSize: 10 }}>
                    {s.nama}
                  </td>
                  <td style={{ color: "#4ade80" }}>{s.hadir}</td>
                  <td style={{ color: "#60a5fa" }}>{s.izin}</td>
                  <td style={{ color: "#facc15" }}>{s.sakit}</td>
                  <td style={{ color: "#f43f5e" }}>{s.alpa}</td>
                  <td style={{ color: "#4ade80", fontWeight: 800, fontSize: 10 }}>
                    {((s.hadir / DAYS) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-card text-center" style={{ marginBottom: 12 }}>
        <div className="title-sub">EDIT ABSENSI HARIAN</div>
        <p style={{ fontSize: 11, color: "#94a3b8" }}>
          Ketuk sel: H → I → S → A → -
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
          marginBottom: 16,
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
    </>
  );
          }
