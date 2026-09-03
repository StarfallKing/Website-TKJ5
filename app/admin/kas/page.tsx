"use client";

import { useState } from "react";
import {
  monthShort,
  formatRupiah,
  NOMINAL_KAS,
} from "@/lib/data";
import { useAppData } from "@/lib/AppDataContext";

export default function AdminKasPage() {
  const {
    students,
    isKasPaid,
    setKasPaid,
    kasLog,
    addKasTransaction,
    pushLog,
  } = useAppData();

  const [desc, setDesc] = useState("");
  const [type, setType] = useState<"masuk" | "keluar">("masuk");
  const [val, setVal] = useState("");

  function submitLog() {
    const n = Number(val);
    if (!desc.trim() || !n) return;
    addKasTransaction(desc.trim(), type, n);
    pushLog("Log kas " + type + ": " + desc.trim() + " (" + n + ")");
    setDesc("");
    setVal("");
  }

  return (
    <>
      <div className="glass-card text-center">
        <div className="title-sub">EDIT KAS</div>
        <p style={{ fontSize: 11, color: "#94a3b8" }}>
          Klik ✓ / ✕ per bulan · sinkron ke web publik
        </p>
      </div>

      {/* Matriks 12 bulan */}
      <div className="glass-card" style={{ padding: 10 }}>
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
              {students.map((s, si) => (
                <tr key={s.nisn}>
                  <td style={{ color: "#60a5fa", fontWeight: 700 }}>
                    {si + 1}
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
                    const paid = isKasPaid(s.nisn, si, mi);
                    return (
                      <td
                        key={mi}
                        onClick={() => setKasPaid(s.nisn, si, mi, !paid)}
                        style={{
                          cursor: "pointer",
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

      {/* Status bulan berjalan (Agustus = index 1) */}
      <div className="glass-card" style={{ padding: 10, marginTop: 12 }}>
        <div className="flex-between" style={{ marginBottom: 8 }}>
          <span
            style={{ fontWeight: 800, fontSize: 11, color: "#60a5fa" }}
          >
            Status Kas Bulan Berjalan
          </span>
          <span style={{ fontSize: 10 }}>Agustus</span>
        </div>
        <div className="table-responsive">
          <table className="absensi-table">
            <thead>
              <tr>
                <th>No</th>
                <th style={{ textAlign: "left" }}>Nama</th>
                <th>Status</th>
                <th>Dibayar</th>
                <th>Tunggakan</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, si) => {
                const paid = isKasPaid(s.nisn, si, 1);
                return (
                  <tr
                    key={s.nisn + "-st"}
                    onClick={() => setKasPaid(s.nisn, si, 1, !paid)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{si + 1}</td>
                    <td
                      style={{ textAlign: "left", fontWeight: 700 }}
                    >
                      {s.nama}
                    </td>
                    <td
                      style={{
                        color: paid ? "#4ade80" : "#f43f5e",
                        fontWeight: 800,
                      }}
                    >
                      {paid ? "LUNAS" : "BELUM"}
                    </td>
                    <td style={{ color: "#4ade80" }}>
                      {paid ? formatRupiah(NOMINAL_KAS) : "Rp 0"}
                    </td>
                    <td style={{ color: "#f43f5e" }}>
                      {paid ? "Rp 0" : formatRupiah(NOMINAL_KAS)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form log custom */}
      <div
        className="glass-card"
        style={{
          marginTop: 12,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div className="title-sub">TAMBAH LOG KAS</div>
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Keterangan / barang"
          className="search-box expanded"
          style={{ width: "100%", padding: 10 }}
        />
        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value as "masuk" | "keluar")
          }
          style={{
            padding: 10,
            borderRadius: 10,
            background: "#0f172a",
            color: "#fff",
          }}
        >
          <option value="masuk">Pemasukan</option>
          <option value="keluar">Pengeluaran</option>
        </select>
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          type="number"
          placeholder="Nominal"
          className="search-box expanded"
          style={{ width: "100%", padding: 10 }}
        />
        <button
          type="button"
          className="btn-pay-qris"
          onClick={submitLog}
        >
          Simpan log
        </button>

        <div style={{ maxHeight: 220, overflow: "auto" }}>
          {kasLog
            .slice()
            .reverse()
            .slice(0, 20)
            .map((row) => (
              <div
                key={row.no}
                style={{
                  fontSize: 10,
                  padding: "6px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                #{row.no} {row.desc || "—"} · {row.type} ·{" "}
                {formatRupiah(row.val)}
              </div>
            ))}
        </div>
      </div>
    </>
  );
          }
