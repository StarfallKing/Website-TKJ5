"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  allStudents,
  formatRupiah,
  NOMINAL_KAS,
  monthShort,
} from "@/lib/data";
import { useAppData } from "@/lib/AppDataContext";

export default function KasPage() {
  const router = useRouter();
  const { students, kasLog, isKasPaid } = useAppData();
  const list = students.length ? students : allStudents;

  const [query, setQuery] = useState("");
  const [showSug, setShowSug] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState<number | null>(null);

  // Agustus 2026 = index 1 (ikut monthShort: Jul=0, Agu=1, ...)
  const CURRENT_MONTH = 1;

  const lastBalance = kasLog[kasLog.length - 1]?.balance ?? 0;
  const totalMasuk = kasLog
    .filter((t) => t.type === "masuk")
    .reduce((a, t) => a + t.val, 0);
  const totalKeluar = kasLog
    .filter((t) => t.type === "keluar")
    .reduce((a, t) => a + t.val, 0);

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

  function pickStudent(idx: number, nama: string) {
    setHighlightIdx(idx);
    setQuery(nama);
    setShowSug(false);
    setTimeout(() => {
      document
        .getElementById("kas-row-" + idx)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }

  return (
    <>
      <div
        className="glass-card text-center"
        style={{ display: "flex", flexDirection: "column", gap: 4 }}
      >
        <div className="title-sub">TRANSPARANSI KAS KELAS</div>
        <p style={{ fontSize: 12, color: "#fff", fontWeight: 700 }}>
          Rekap Uang Kas, Pemasukan & Pengeluaran X TKJ–5
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
        }}
      >
        <div className="glass-card text-center" style={{ padding: 10 }}>
          <div className="title-sub" style={{ fontSize: 8 }}>
            TOTAL KAS
          </div>
          <div className="card-val" style={{ color: "#4ade80", fontSize: 13 }}>
            {formatRupiah(lastBalance)}
          </div>
        </div>
        <div className="glass-card text-center" style={{ padding: 10 }}>
          <div className="title-sub" style={{ fontSize: 8 }}>
            PEMASUKAN
          </div>
          <div className="card-val" style={{ color: "#60a5fa", fontSize: 13 }}>
            {formatRupiah(totalMasuk)}
          </div>
        </div>
        <div className="glass-card text-center" style={{ padding: 10 }}>
          <div className="title-sub" style={{ fontSize: 8 }}>
            PENGELUARAN
          </div>
          <div className="card-val" style={{ color: "#f43f5e", fontSize: 13 }}>
            {formatRupiah(totalKeluar)}
          </div>
        </div>
      </div>

      {/* Search */}
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
            placeholder="Cari nama siswa..."
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
                key={s.nisn + String(s.idx)}
                className="suggestion-item"
                onClick={() => pickStudent(s.idx, s.nama)}
              >
                <span>{s.nama}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabel 1 — status bulan berjalan (Context isKasPaid) */}
      <div className="glass-card" style={{ padding: 10 }}>
        <div className="flex-between" style={{ marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: "#60a5fa" }}>
            Tabel 1: Status Kas Bulan Berjalan
          </span>
          <span
            style={{
              fontSize: 8.5,
              background: "rgba(34,197,94,0.15)",
              color: "#4ade80",
              border: "1px solid rgba(74,222,128,0.3)",
              padding: "2px 6px",
              borderRadius: 6,
              fontWeight: 700,
            }}
          >
            Agustus 2026
          </span>
        </div>
        <div className="table-responsive">
          <table className="absensi-table">
            <thead>
              <tr>
                <th>No</th>
                <th style={{ textAlign: "left", paddingLeft: 10 }}>Nama</th>
                <th>Status</th>
                <th>Dibayar</th>
                <th>Tunggakan</th>
              </tr>
            </thead>
            <tbody>
              {list.map((s, idx) => {
                const paid = isKasPaid(s.nisn, idx, CURRENT_MONTH);
                return (
                  <tr
                    key={s.nisn}
                    id={"kas-row-" + idx}
                    className={highlightIdx === idx ? "glowing-row" : ""}
                  >
                    <td style={{ fontWeight: 700, color: "#60a5fa" }}>
                      {idx + 1}
                    </td>
                    <td
                      style={{
                        textAlign: "left",
                        fontWeight: 700,
                        paddingLeft: 10,
                      }}
                    >
                      {s.nama}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 800,
                          padding: "3px 8px",
                          borderRadius: 8,
                          background: paid
                            ? "rgba(74,222,128,0.15)"
                            : "rgba(244,63,94,0.15)",
                          color: paid ? "#4ade80" : "#f43f5e",
                          border: paid
                            ? "1px solid rgba(74,222,128,0.35)"
                            : "1px solid rgba(244,63,94,0.35)",
                        }}
                      >
                        {paid ? "LUNAS" : "BELUM"}
                      </span>
                    </td>
                    <td
                      style={{
                        color: "#4ade80",
                        fontWeight: 700,
                        fontSize: 10,
                      }}
                    >
                      {paid ? formatRupiah(NOMINAL_KAS) : "Rp 0"}
                    </td>
                    <td
                      style={{
                        color: "#f43f5e",
                        fontWeight: 700,
                        fontSize: 10,
                      }}
                    >
                      {paid ? "Rp 0" : formatRupiah(NOMINAL_KAS)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabel 2 — matriks 12 bulan */}
      <div className="glass-card" style={{ padding: 10 }}>
        <div className="title-sub" style={{ marginBottom: 8 }}>
          Tabel 2: Matriks Kas 12 Bulan
        </div>
        <div className="table-responsive">
          <table className="absensi-table">
            <thead>
              <tr>
                <th>No</th>
                <th style={{ textAlign: "left" }}>Nama</th>
                {monthShort.map((m) => (
                  <th key={m}>{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((s, idx) => (
                <tr key={s.nisn + "-m"}>
                  <td style={{ color: "#60a5fa", fontWeight: 700 }}>
                    {idx + 1}
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      fontWeight: 700,
                      fontSize: 10,
                    }}
                  >
                    {s.nama}
                  </td>
                  {monthShort.map((_, mi) => {
                    const paid = isKasPaid(s.nisn, idx, mi);
                    return (
                      <td
                        key={mi}
                        style={{
                          fontWeight: 900,
                          color: paid ? "#4ade80" : "#f43f5e",
                        }}
                      >
                        {paid ? "✓" : "✕"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log transaksi */}
      <div className="glass-card" style={{ padding: 10 }}>
        <div className="title-sub" style={{ marginBottom: 8 }}>
          Tabel 3: Log Pemasukan & Pengeluaran
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {kasLog.length === 0 && (
            <p style={{ fontSize: 11, color: "#64748b", textAlign: "center" }}>
              Belum ada transaksi
            </p>
          )}
          {kasLog.map((row) => (
            <div
              key={row.no}
              className="flex-between"
              style={{
                fontSize: 10,
                padding: "8px 0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{row.desc || "—"}</div>
                <div style={{ color: "#64748b" }}>
                  #{row.no} · {row.date || "-"}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontWeight: 800,
                    color: row.type === "masuk" ? "#4ade80" : "#f43f5e",
                  }}
                >
                  {row.type === "masuk" ? "+" : "-"}
                  {formatRupiah(row.val)}
                </div>
                <div style={{ color: "#94a3b8" }}>
                  Saldo {formatRupiah(row.balance)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="btn-pay-qris"
        onClick={() => router.push("/qris")}
      >
        Bayar Kas via QRIS
      </button>
    </>
  );
                            }
