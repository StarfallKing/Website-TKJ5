"use client";

import { useState } from "react";
import { monthConfigs, type StatusHarian } from "@/lib/data";
import { useAppData } from "@/lib/AppDataContext";

const CYCLE: StatusHarian[] = ["H", "I", "S", "A", "-"];

export default function AdminAbsensiPage() {
  const { students, getAttendanceCell, setAttendanceCell } = useAppData();
  const [monthIdx, setMonthIdx] = useState(0);
  const m = monthConfigs[monthIdx];

  function cycle(si: number, day: number) {
    const cur = getAttendanceCell(si, monthIdx, day);
    const next = CYCLE[(CYCLE.indexOf(cur) + 1) % CYCLE.length];
    setAttendanceCell(si, monthIdx, day, next);
  }

  return (
    <>
      <div className="glass-card text-center">
        <div className="title-sub">EDIT ABSENSI</div>
        <p style={{ fontSize: 11, color: "#94a3b8" }}>
          Ketuk sel seperti Excel: H → I → S → A → -
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
        {monthConfigs.map((mc, i) => (
          <button
            key={mc.name}
            type="button"
            className={"filter-btn" + (monthIdx === i ? " active" : "")}
            onClick={() => setMonthIdx(i)}
          >
            {mc.name.replace(" 2026", "").replace(" 2027", "")}
          </button>
        ))}
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
                  <td style={{ textAlign: "left", fontWeight: 700, fontSize: 10 }}>
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
