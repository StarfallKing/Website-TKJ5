"use client";

import { useMemo, useState } from "react";
import {
  monthShort,
  monthConfigs,
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
  } = useAppData();

  const [monthIdx, setMonthIdx] = useState(1); // default Agustus
  const [desc, setDesc] = useState("");
  const [type, setType] = useState<"masuk" | "keluar">("masuk");
  const [val, setVal] = useState("");
  const [saving, setSaving] = useState(false);

  const logs = useMemo(
    () => kasLog.filter((t) => t.desc?.trim() || t.val),
    [kasLog]
  );

  const totalMasuk = logs
    .filter((t) => t.type === "masuk")
    .reduce((a, t) => a + t.val, 0);
  const totalKeluar = logs
    .filter((t) => t.type === "keluar")
    .reduce((a, t) => a + t.val, 0);
  const totalKas = logs.length ? logs[logs.length - 1].balance : 0;

  async function submitLog() {
    const n = Number(val);
    if (!desc.trim() || !n) {
      alert("Isi keterangan dan nominal");
      return;
    }
    setSaving(true);
    try {
      await addKasTransaction(desc.trim(), type, n);
      setDesc("");
      setVal("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="glass-card text-center">
        <div className="title-sub">EDIT KAS</div>
        <p style={{ fontSize: 11, color: "#94a3b8" }}>
          Nominal / bulan: {formatRupiah(NOMINAL_KAS)} · sinkron publik
        </p>
      </div>

      {/* Ringkasan */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
        }}
      >
        <div className="glass-card text-center" style={{ padding: 10 }}>
          <div style={{ fontSize: 8, color: "#94a3b8", fontWeight: 800 }}>
            TOTAL KAS
          </div>
          <div style={{ fontWeight: 800, color: "#4ade80", fontSize: 13 }}>
            {formatRupiah(totalKas)}
          </div>
        </div>
        <div className="glass-card text-center" style={{ padding: 10 }}>
          <div style={{ fontSize: 8, color: "#94a3b8", fontWeight: 800 }}>
            PEMASUKAN
          </div>
          <div style={{ fontWeight: 800, color: "#60a5fa", fontSize: 13 }}>
            {formatRupiah(totalMasuk)}
          </div>
        </div>
        <div className="glass-card text-center" style={{ padding: 10 }}>
          <div style={{ fontSize: 8, color: "#94a3b8", fontWeight: 800 }}>
            PENGELUARAN
          </div>
          <div style={{ fontWeight: 800, color: "#f43f5e", fontSize: 13 }}>
            {formatRupiah(totalKeluar)}
          </div>
        </div>
      </div>

      {/* Tabel 1 — status per bulan (pilih bulan) */}
      <div className="glass-card" style={{ padding: 10 }}>
        <div className="title-sub" style={{ marginBottom: 8 }}>
          Tabel 1: Status Kas Bulan
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 10,
          }}
        >
          {monthConfigs.map((m, i) => (
            <button
              key={m.name}
              type="button"
              className={"filter-btn" + (monthIdx === i ? " active" : "")}
              onClick={() => setMonthIdx(i)}
              style={{ fontSize: 9 }}
            >
              {m.name}
            </button>
          ))}
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
                const paid = isKasPaid(s.nisn, si, monthIdx);
                return (
                  <tr
                    key={s.nisn + "-st"}
                    onClick={() => void setKasPaid(s.nisn, si, monthIdx, !paid)}
                    style={{ cursor: "pointer" }}
                  >
                    <td style={{ color: "#60a5fa", fontWeight: 700 }}>
                      {si + 1}
                    </td>
                    <td style={{ textAlign: "left", fontWeight: 700, fontSize: 10 }}>
                      {s.nama}
                    </td>
                    <td
                      style={{
                        color: paid ? "#4ade80" : "#f43f5e",
                        fontWeight: 800,
                        fontSize: 10,
                      }}
                    >
                      {paid ? "LUNAS" : "BELUM"}
                    </td>
                    <td style={{ color: "#4ade80", fontSize: 10 }}>
                      {paid ? formatRupiah(NOMINAL_KAS) : "Rp 0"}
                    </td>
                    <td style={{ color: "#f43f5e", fontSize: 10 }}>
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
          Tabel 2: Matriks ✓ / ✕ 12 Bulan
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
                  {monthShort.map((_, mi) => {
                    const paid = isKasPaid(s.nisn, si, mi);
                    return (
                      <td
                        key={mi}
                        onClick={() =>
                          void setKasPaid(s.nisn, si, mi, !paid)
                        }
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

      {/* Tabel 3 — log */}
      <div
        className="glass-card"
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <div className="title-sub">Tabel 3: Tambah Log Kas</div>
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Keterangan / barang"
          className="search-box expanded"
          style={{ width: "100%", padding: 10 }}
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "masuk" | "keluar")}
          style={{
            padding: 10,
            borderRadius: 10,
            background: "#0f172a",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.12)",
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
          disabled={saving}
          onClick={() => void submitLog()}
        >
          {saving ? "Menyimpan..." : "Simpan log"}
        </button>

        <div style={{ maxHeight: 260, overflow: "auto", marginTop: 4 }}>
          {logs.length === 0 && (
            <p style={{ fontSize: 11, color: "#64748b", textAlign: "center" }}>
              Belum ada log
            </p>
          )}
          {[...logs].reverse().map((row) => (
            <div
              key={row.no + "-" + row.date + "-" + row.desc}
              style={{
                fontSize: 10,
                padding: "8px 0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
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
    </div>
  );
}
