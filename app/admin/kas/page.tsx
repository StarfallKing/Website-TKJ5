"use client";

import { monthShort, formatRupiah, NOMINAL_KAS } from "@/lib/data";
import { useAppData } from "@/lib/AppDataContext";

export default function AdminKasPage() {
  const { students, isKasPaid, setKasPaid, kasLog, addKasTransaction } =
    useAppData();

  return (
    <>
      {/* Tabel status bulan berjalan — mirip publik */}
<div className="glass-card" style={{ padding: 10, marginTop: 12 }}>
  <div className="flex-between" style={{ marginBottom: 8 }}>
    <span style={{ fontWeight: 800, fontSize: 11, color: "#60a5fa" }}>
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
              key={s.nisn}
              onClick={() => setKasPaid(s.nisn, si, 1, !paid)}
              style={{ cursor: "pointer" }}
            >
              <td>{si + 1}</td>
              <td style={{ textAlign: "left", fontWeight: 700 }}>{s.nama}</td>
              <td style={{ color: paid ? "#4ade80" : "#f43f5e", fontWeight: 800 }}>
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
<div className="glass-card" style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
  <div className="title-sub">TAMBAH LOG KAS</div>
  <input id="kas-desc" placeholder="Keterangan / barang" className="search-box expanded" style={{ width: "100%", padding: 10 }} />
  <select id="kas-type" style={{ padding: 10, borderRadius: 10, background: "#0f172a", color: "#fff" }}>
    <option value="masuk">Pemasukan</option>
    <option value="keluar">Pengeluaran</option>
  </select>
  <input id="kas-val" type="number" placeholder="Nominal" className="search-box expanded" style={{ width: "100%", padding: 10 }} />
  <button
    type="button"
    className="btn-pay-qris"
    onClick={() => {
      const desc = (document.getElementById("kas-desc") as HTMLInputElement).value;
      const type = (document.getElementById("kas-type") as HTMLSelectElement).value as "masuk" | "keluar";
      const val = Number((document.getElementById("kas-val") as HTMLInputElement).value || 0);
      if (!desc || !val) return;
      addKasTransaction(desc, type, val);
      pushLog?.("Log kas: " + type + " " + desc + " " + val);
    }}
  >
    Simpan log
  </button>
  <div style={{ maxHeight: 200, overflow: "auto" }}>
    {kasLog.slice().reverse().slice(0, 15).map((row) => (
      <div key={row.no} style={{ fontSize: 10, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        #{row.no} {row.desc} · {row.type} · {formatRupiah(row.val)}
      </div>
    ))}
  </div>
</div>
