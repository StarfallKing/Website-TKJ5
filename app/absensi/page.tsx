"use client";

import { useMemo, useState } from "react";
import {
  allStudents,
  monthConfigs,
  getDailyStatus,
} from "@/lib/data";
import { useAppData } from "@/lib/AppDataContext";

export default function AbsensiPage() {
  const { students } = useAppData();
  const list = students.length ? students : allStudents;
  const total = 28;

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
  const n = list.length * total || 1;

  const matches = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return list
      .map((s, idx) => ({ ...s, idx }))
      .filter(
        (s) =>
          s.nama.toLowerCase().includes(q) || s.nisn.includes(q)
      )
      .slice(0, 8);
  }, [query, list]);

  const selected =
    highlightIdx !== null ? list[highlightIdx] : null;

  function pickStudent(idx: number, nama: string) {
    setHighlightIdx(idx);
    setQuery(nama);
    setShowSug(false);
    setTimeout(() => {
      document
        .getElementById(`absensi-row-${idx}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }

  function clearPick() {
    setHighlightIdx(null);
    setQuery("");
  }

  return (
    <>
      <div
        className="glass-card text-center"
        style={{ display: "flex", flexDirection: "column", gap: "4px" }}
      >
        <div className="title-sub">DATA KEHADIRAN & ABSENSI</div>
        <p style={{ fontSize: "12px", color: "#fff", fontWeight: 700 }}>
          Rekapitulasi Kehadiran Kelas X TKJ–5
        </p>
      </div>

      <div className="grid-4">
        {[
          { label: "RATA-RATA HADIR", val: sum.hadir, color: "#4ade80" },
          { label: "RATA-RATA IZIN", val: sum.izin, color: "#60a5fa" },
          { label: "RATA-RATA SAKIT", val: sum.sakit, color: "#facc15" },
          { label: "RATA-RATA ALPA", val: sum.alpa, color: "#f43f5e" },
        ].map((item) => (
          <div
            key={item.label}
            className="glass-card text-center"
            style={{ padding: "8px" }}
          >
            <div className="title-sub" style={{ fontSize: "7.5px" }}>
              {item.label}
            </div>
            <div
              className="card-val"
              style={{ color: item.color, fontSize: "13px" }}
            >
              {((item.val / n) * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>

      <div className="search-wrapper">
        <div
          className={`search-box ${query ? "expanded" : ""}`}
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
                <span style={{ fontSize: "9px", color: "#60a5fa" }}>
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
                  style={{ marginRight: "6px", color: "#60a5fa" }}
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

      <div className="glass-card" style={{ padding: "10px" }}>
        <div
          className="flex-between"
          style={{
            marginBottom: "10px",
            paddingBottom: "6px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span style={{ fontSize: "10px", fontWeight: 800, color: "#60a5fa" }}>
            <i className="fa-solid fa-chart-pie" style={{ marginRight: "4px" }} />
            Rekap Akumulasi 1 Tahun
          </span>
          <span
            style={{
              fontSize: "8.5px",
              background: "rgba(34,197,94,0.15)",
              color: "#4ade80",
              border: "1px solid rgba(74,222,128,0.3)",
              padding: "2px 6px",
              borderRadius: "6px",
              fontWeight: 700,
            }}
          >
            T.A 2026/2027
          </span>
        </div>

        <div className="table-responsive">
          <table className="absensi-table">
            <thead>
              <tr>
                <th>No</th>
                <th style={{ textAlign: "left", paddingLeft: "10px" }}>Nama</th>
                <th style={{ color: "#4ade80" }}>Hadir</th>
                <th style={{ color: "#60a5fa" }}>Izin</th>
                <th style={{ color: "#facc15" }}>Sakit</th>
                <th style={{ color: "#f43f5e" }}>Alpa</th>
                <th>Persentase</th>
              </tr>
            </thead>
            <tbody>
              {list.map((s, idx) => {
                const pctH = ((s.hadir / total) * 100).toFixed(1);
                const pctI = ((s.izin / total) * 100).toFixed(1);
                const pctS = ((s.sakit / total) * 100).toFixed(1);
                const pctA = ((s.alpa / total) * 100).toFixed(1);
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
                        paddingLeft: "10px",
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
                    <td>
                      <div className="pct-breakdown">
                        <span style={{ color: "#4ade80" }}>H:{pctH}%</span>
                        <span style={{ color: "#60a5fa" }}>I:{pctI}%</span>
                        <span style={{ color: "#facc15" }}>S:{pctS}%</span>
                        <span style={{ color: "#f43f5e" }}>A:{pctA}%</span>
                      </div>
                      <div className="progress-bar-container">
                        <div
                          className="progress-seg bg-hadir"
                          style={{ width: pctH + "%" }}
                        />
                        <div
                          className="progress-seg bg-izin"
                          style={{ width: pctI + "%" }}
                        />
                        <div
                          className="progress-seg bg-sakit"
                          style={{ width: pctS + "%" }}
                        />
                        <div
                          className="progress-seg bg-alpha"
                          style={{ width: pctA + "%" }}
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
            style={{ marginRight: "5px" }}
          />
          Rekap Harian Per Bulan (Juli 2026 – Juni 2027)
        </div>
      </div>

      {monthConfigs.map((mConfig, mIdx) => (
        <div
          key={mConfig.name}
          className="glass-card"
          style={{ padding: "10px" }}
        >
          <div
            className="flex-between"
            style={{
              marginBottom: "10px",
              paddingBottom: "6px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span
              style={{ fontSize: "10px", fontWeight: 800, color: "#60a5fa" }}
            >
              Presensi {mConfig.name}
            </span>
            <span
              style={{
                fontSize: "8.5px",
                background: "rgba(96,165,250,0.15)",
                color: "#60a5fa",
                border: "1px solid rgba(96,165,250,0.3)",
                padding: "2px 6px",
                borderRadius: "6px",
                fontWeight: 700,
              }}
            >
              {mConfig.days} Hari
            </span>
          </div>

          <div className="table-responsive">
            <table className="absensi-table monthly-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th style={{ textAlign: "left", paddingLeft: "10px" }}>
                    Nama
                  </th>
                  {Array.from({ length: mConfig.days }, (_, d) => (
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

                  for (let d = 1; d <= mConfig.days; d++) {
                    const st = getDailyStatus(sIdx, d, mIdx);
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
                          fontSize: "9px",
                        }}
                      >
                        {st}
                      </td>
                    );
                  }

                  return (
                    <tr
                      key={String(siswa.nisn) + "-" + mIdx + "-" + sIdx}
                      id={"m-row-" + mIdx + "-" + sIdx}
                      className={highlightIdx === sIdx ? "glowing-row" : ""}
                    >
                      <td style={{ fontWeight: 700, color: "#60a5fa" }}>
                        {sIdx + 1}
                      </td>
                      <td
                        style={{
                          textAlign: "left",
                          fontWeight: 700,
                          paddingLeft: "10px",
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
      ))}
    </>
  );
  }
