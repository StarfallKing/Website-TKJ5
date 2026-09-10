"use client";

import { useMemo, useState } from "react";
import { allStudents, monthConfigs } from "@/lib/data";
import { useAppData } from "@/lib/AppDataContext";

export default function AbsensiPage() {
  const { students, getAttendanceCell } = useAppData();
  const list = students.length ? students : allStudents;

  // Set total pembagi ke 365 hari
  const TOTAL_HARI_TAHUNAN = 365;

  // State bulan aktif (Default: bulan pertama / Juli -> index 0)
  const [selectedMonth, setSelectedMonth] = useState<number>(0);

  const [query, setQuery] = useState("");
  const [showSug, setShowSug] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState<number | null>(null);

  const sum = list.reduce(
    (acc, s) => ({
      hadir: acc.hadir + s.hadir,
      izin: acc.izin + s.izin,
      sakit: acc.sakit + s.sakit,
      alpa: acc.alpa + s.alpa,
    }),
    { hadir: 0, izin: 0, sakit: 0, alpa: 0 }
  );

  // Total kapasitas entri kelas dalam 1 tahun (jumlah siswa * 365 hari)
  const totalEntriKelasTahunan = (list.length || 1) * TOTAL_HARI_TAHUNAN;

  // PERBAIKAN ERROR BUILD: Hitung rata-rata akumulasi kelas
  const avg = useMemo(() => {
    if (!totalEntriKelasTahunan) return { h: 0, i: 0, s: 0, a: 0 };
    return {
      h: (sum.hadir / totalEntriKelasTahunan) * 100,
      i: (sum.izin / totalEntriKelasTahunan) * 100,
      s: (sum.sakit / totalEntriKelasTahunan) * 100,
      a: (sum.alpa / totalEntriKelasTahunan) * 100,
    };
  }, [sum, totalEntriKelasTahunan]);

  const matches = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return list
      .map((s, idx) => ({ ...s, idx }))
      .filter(
        (s) => s.nama.toLowerCase().includes(q) || s.nisn.includes(q)
      )
      .slice(0, 8);
  }, [query, list]);

  const selected = highlightIdx !== null ? list[highlightIdx] : null;

  function pickStudent(idx: number, nama: string) {
    setHighlightIdx(idx);
    setQuery(nama);
    setShowSug(false);
    setTimeout(() => {
      document
        .getElementById("absensi-row-" + idx)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }

  function clearPick() {
    setHighlightIdx(null);
    setQuery("");
  }

  const activeMConfig = monthConfigs[selectedMonth] || monthConfigs[0];

  return (
    <>
      <div
        className="glass-card text-center"
        style={{ display: "flex", flexDirection: "column", gap: 4 }}
      >
        <div className="title-sub">DATA KEHADIRAN & ABSENSI</div>
        <p style={{ fontSize: 12, color: "#fff", fontWeight: 700 }}>
          Rekapan Kehadiran Kelas X TKJ–5
        </p>
      </div>

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

      <div className="search-wrapper">
        <div
          className={"search-box" + (query ? " expanded" : "")}
          style={{ width: query ? "100%" : undefined }}
          onClick={(e) =>
            (e.currentTarget as HTMLElement).classList.add("expanded")
          }
        >
          <div className="search-icon">
            <i className="fa-solid fa-magnifying-glass" />
          </div>
          <input
            type="text"
            placeholder="Cari nama siswa untuk disorot..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSug(true);
              setHighlightIdx(null);
            }}
            autoComplete="off"
          />
        </div>

        {showSug && matches.length > 0 && (
          <div className="search-suggestions show">
            {matches.map((s) => (
              <div
                key={String(s.nisn) + String(s.idx)}
                className="suggestion-item"
                onClick={() => pickStudent(s.idx, s.nama)}
              >
                <span>{s.nama}</span>
                <span style={{ fontSize: 10, color: "#60a5fa" }}>
                  NISN: {s.nisn}
                </span>
              </div>
            ))}
          </div>
        )}

        {selected && (
          <div className="search-summary-card show">
            <div className="summary-title">
              <span>
                <i
                  className="fa-solid fa-user-check"
                  style={{ marginRight: 6, color: "#60a5fa" }}
                />
                {selected.nama}
              </span>
              <i
                className="fa-solid fa-xmark"
                style={{ cursor: "pointer", color: "#f43f5e" }}
                onClick={clearPick}
              />
            </div>
            <div className="summary-grid">
              <div className="summary-box">
                <div className="summary-label">HADIR</div>
                <div className="summary-val" style={{ color: "#4ade80" }}>
                  {selected.hadir}
                </div>
              </div>
              <div className="summary-box">
                <div className="summary-label">IZIN</div>
                <div className="summary-val" style={{ color: "#60a5fa" }}>
                  {selected.izin}
                </div>
              </div>
              <div className="summary-box">
                <div className="summary-label">SAKIT</div>
                <div className="summary-val" style={{ color: "#facc15" }}>
                  {selected.sakit}
                </div>
              </div>
              <div className="summary-box">
                <div className="summary-label">ALPA</div>
                <div className="summary-val" style={{ color: "#f43f5e" }}>
                  {selected.alpa}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rekap 1 tahun */}
      <div className="glass-card" style={{ padding: 10 }}>
        <div
          className="flex-between"
          style={{
            marginBottom: 10,
            paddingBottom: 6,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 800, color: "#60a5fa" }}>
            <i className="fa-solid fa-chart-pie" style={{ marginRight: 6 }} />
            Rekap Akumulasi 1 Tahun
          </span>
          <span
            style={{
              fontSize: 10,
              background: "rgba(34,197,94,0.15)",
              color: "#4ade80",
              border: "1px solid rgba(74,222,128,0.3)",
              padding: "2px 8px",
              borderRadius: 6,
              fontWeight: 700,
            }}
          >
            T.A 2026/2027
          </span>
        </div>

        <div className="table-responsive">
          {/* PERBAIKAN LAYOUT: Tambahkan class 'rekap-yearly-table' */}
          <table className="absensi-table rekap-yearly-table">
            <thead>
              <tr>
                <th style={{ width: 28 }}>No</th>
                <th style={{ textAlign: "left", paddingLeft: 6 }}>Nama</th>
                <th style={{ color: "#4ade80", width: 22 }}>H</th>
                <th style={{ color: "#60a5fa", width: 22 }}>I</th>
                <th style={{ color: "#facc15", width: 22 }}>S</th>
                <th style={{ color: "#f43f5e", width: 22 }}>A</th>
                <th style={{ textAlign: "center", width: 85 }}>PERSENTASE</th>
              </tr>
            </thead>
            <tbody>
              {list.map((s, idx) => {
                // Hitung persentase terhadap 365 hari
                const pctH = ((s.hadir / TOTAL_HARI_TAHUNAN) * 100).toFixed(1);
                const pctI = ((s.izin / TOTAL_HARI_TAHUNAN) * 100).toFixed(1);
                const pctS = ((s.sakit / TOTAL_HARI_TAHUNAN) * 100).toFixed(1);
                const pctA = ((s.alpa / TOTAL_HARI_TAHUNAN) * 100).toFixed(1);

                return (
                  <tr
                    key={String(s.nisn) + "-" + String(idx)}
                    id={"absensi-row-" + idx}
                    className={highlightIdx === idx ? "glowing-row" : ""}
                  >
                    <td style={{ fontWeight: 700, color: "#60a5fa" }}>
                      {idx + 1}
                    </td>
                    <td
                      style={{
                        textAlign: "left",
                        fontWeight: 700,
                        paddingLeft: 6,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      {s.nama}
                    </td>
                    <td style={{ color: "#4ade80", fontWeight: 800 }}>
                      {s.hadir}
                    </td>
                    <td style={{ color: "#60a5fa", fontWeight: 800 }}>
                      {s.izin}
                    </td>
                    <td style={{ color: "#facc15", fontWeight: 800 }}>
                      {s.sakit}
                    </td>
                    <td style={{ color: "#f43f5e", fontWeight: 800 }}>
                      {s.alpa}
                    </td>
                    <td style={{ padding: "6px 2px" }}>
                      {/* Class pct-breakdown & progress-bar-container mengambil style dari global.css */}
                      <div className="pct-breakdown">
                        <span style={{ color: "#4ade80" }}>H:{pctH}%</span>
                        <span style={{ color: "#60a5fa" }}>I:{pctI}%</span>
                        <span style={{ color: "#facc15" }}>S:{pctS}%</span>
                        <span style={{ color: "#f43f5e" }}>A:{pctA}%</span>
                      </div>

                      <div className="progress-bar-container">
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

      <div className="section-divider">
        <div className="divider-badge">
          <i
            className="fa-solid fa-calendar-days"
            style={{ marginRight: 5 }}
          />
          Rekap Harian Per Bulan
        </div>
      </div>

      {/* GRID 4 KASAMPING x 3 KEBAWAH TOMBOL PILIHAN BULAN */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {monthConfigs.map((mConfig, mIdx) => {
          const isActive = selectedMonth === mIdx;
          return (
            <button
              key={mConfig.name}
              onClick={() => setSelectedMonth(mIdx)}
              style={{
                padding: "8px 4px",
                borderRadius: 10,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
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
              {mConfig.name}
            </button>
          );
        })}
      </div>

      {/* RENDER HANYA 1 BULAN YANG DIPILIH */}
      <div className="glass-card" style={{ padding: 10 }}>
        <div
          className="flex-between"
          style={{
            marginBottom: 10,
            paddingBottom: 6,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 800, color: "#60a5fa" }}>
            Presensi {activeMConfig.name}
          </span>
          <span
            style={{
              fontSize: 10,
              background: "rgba(96,165,250,0.15)",
              color: "#60a5fa",
              border: "1px solid rgba(96,165,250,0.3)",
              padding: "2px 6px",
              borderRadius: 6,
              fontWeight: 700,
            }}
          >
            {activeMConfig.days} Hari
          </span>
        </div>

        <div className="table-responsive">
          <table className="absensi-table monthly-table">
            <thead>
              <tr>
                <th>No</th>
                <th style={{ textAlign: "left", paddingLeft: 10 }}>Nama</th>
                {Array.from({ length: activeMConfig.days }, (_, d) => (
                  <th key={d}>{d + 1}</th>
                ))}
                <th style={{ color: "#4ade80" }}>H</th>
                <th style={{ color: "#60a5fa" }}>I</th>
                <th style={{ color: "#facc15" }}>S</th>
                <th style={{ color: "#f43f5e" }}>A</th>
              </tr>
            </thead>
            <tbody>
              {list.map((siswa, sIdx) => {
                let mH = 0;
                let mI = 0;
                let mS = 0;
                let mA = 0;
                const cells = [];

                for (let d = 1; d <= activeMConfig.days; d++) {
                  const st = getAttendanceCell(sIdx, selectedMonth, d);
                  if (st === "H") mH++;
                  else if (st === "I") mI++;
                  else if (st === "S") mS++;
                  else if (st === "A") mA++;

                  cells.push(
                    <td
                      key={d}
                      style={{
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
                        fontWeight: 700,
                        fontSize: 10,
                      }}
                    >
                      {st}
                    </td>
                  );
                }

                return (
                  <tr
                    key={String(siswa.nisn) + "-" + selectedMonth + "-" + sIdx}
                    id={"m-row-" + selectedMonth + "-" + sIdx}
                    className={highlightIdx === sIdx ? "glowing-row" : ""}
                  >
                    <td style={{ fontWeight: 700, color: "#60a5fa" }}>
                      {sIdx + 1}
                    </td>
                    <td
                      style={{
                        textAlign: "left",
                        fontWeight: 700,
                        paddingLeft: 10,
                      }}
                    >
                      {siswa.nama}
                    </td>
                    {cells}
                    <td style={{ color: "#4ade80", fontWeight: 800 }}>
                      {mH}
                    </td>
                    <td style={{ color: "#60a5fa", fontWeight: 800 }}>
                      {mI}
                    </td>
                    <td style={{ color: "#facc15", fontWeight: 800 }}>
                      {mS}
                    </td>
                    <td style={{ color: "#f43f5e", fontWeight: 800 }}>
                      {mA}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
