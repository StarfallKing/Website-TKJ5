"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  allStudents,
  formatRupiah,
  NOMINAL_KAS,
  kasTransactionsLog as seedKas,
  monthShort,
  getKasPaid,
} from "@/lib/data";

export default function KasPage() {
  const router = useRouter();

  // Seed dulu; ganti ke useAppData() kalau Context sudah siap
  const students = allStudents;
  const kasLog = seedKas;

  const [query, setQuery] = useState("");
  const [showSug, setShowSug] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState<number | null>(null);

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
    return students
      .map((s, idx) => ({ ...s, idx }))
      .filter(
        (s) =>
          s.nama.toLowerCase().includes(q) || s.nisn.includes(q)
      )
      .slice(0, 8);
  }, [query, students]);

  const selected =
    highlightIdx !== null ? students[highlightIdx] : null;

  let paidCount = 0;
  if (highlightIdx !== null) {
    for (let m = 0; m < 12; m++) {
      if (getKasPaid(highlightIdx, m)) paidCount++;
    }
  }
  const isMonthPaid =
    highlightIdx !== null ? getKasPaid(highlightIdx, 1) : false;

  function pickStudent(idx: number, nama: string) {
    setHighlightIdx(idx);
    setQuery(nama);
    setShowSug(false);
    setTimeout(() => {
      document
        .getElementById(`kas-t1-row-${idx}`)
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
        <div className="title-sub">TRANSPARANSI KAS KELAS</div>
        <p style={{ fontSize: "12px", color: "#fff", fontWeight: 700 }}>
          Rekap Uang Kas, Pemasukan & Pengeluaran X TKJ–5
        </p>
      </div>

      <div className="grid-3">
        <div className="glass-card text-center" style={{ padding: "8px" }}>
          <div className="title-sub" style={{ fontSize: "7.5px" }}>TOTAL KAS</div>
          <div className="card-val" style={{ color: "#4ade80", fontSize: "12px" }}>
            {formatRupiah(lastBalance)}
          </div>
        </div>
        <div className="glass-card text-center" style={{ padding: "8px" }}>
          <div className="title-sub" style={{ fontSize: "7.5px" }}>PEMASUKAN</div>
          <div className="card-val" style={{ color: "#60a5fa", fontSize: "12px" }}>
            {formatRupiah(totalMasuk)}
          </div>
        </div>
        <div className="glass-card text-center" style={{ padding: "8px" }}>
          <div className="title-sub" style={{ fontSize: "7.5px" }}>PENGELUARAN</div>
          <div className="card-val" style={{ color: "#f43f5e", fontSize: "12px" }}>
            {formatRupiah(totalKeluar)}
          </div>
        </div>
      </div>

      {/* SEARCH + SUMMARY */}
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
            placeholder="Cari nama siswa untuk ringkasan kas & absensi..."
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
            {matches.map((item) => (
              <div
                key={item.nisn}
                className="suggestion-item"
                onClick={() => pickStudent(item.idx, item.nama)}
              >
                <span>{item.nama}</span>
                <span
                  style={{
                    fontSize: "9px",
                    color: "#60a5fa",
                    background: "rgba(37,99,235,0.2)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  NISN: {item.nisn}
                </span>
              </div>
            ))}
          </div>
        )}

        {selected && highlightIdx !== null && (
          <div className="search-summary-card show">
            <div className="summary-title">
              <span>
                <i
                  className="fa-solid fa-address-card"
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
                <div className="summary-label">STATUS BULAN INI</div>
                <div
                  className="summary-val"
                  style={{ color: isMonthPaid ? "#4ade80" : "#f43f5e" }}
                >
                  {isMonthPaid ? "LUNAS" : "BELUM BAYAR"}
                </div>
              </div>
              <div className="summary-box">
                <div className="summary-label">TOTAL KAS DIBAYAR</div>
                <div className="summary-val" style={{ color: "#4ade80" }}>
                  {formatRupiah(paidCount * NOMINAL_KAS)}
                </div>
              </div>
              <div className="summary-box">
                <div className="summary-label">TUNGGAKAN</div>
                <div className="summary-val" style={{ color: "#f43f5e" }}>
                  {formatRupiah((12 - paidCount) * NOMINAL_KAS)}
                </div>
              </div>
              <div className="summary-box">
                <div className="summary-label">KEHADIRAN (HADIR)</div>
                <div className="summary-val" style={{ color: "#60a5fa" }}>
                  {selected.hadir} / 28 Hari
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TABEL 1 */}
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
            Tabel 1: Status Kas Bulan Berjalan
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
            Agustus 2026
          </span>
        </div>
        <div className="table-responsive">
          <table className="absensi-table">
            <thead>
              <tr>
                <th>No</th>
                <th style={{ textAlign: "left", paddingLeft: "8px" }}>Nama</th>
                <th>Status</th>
                <th>Dibayar</th>
                <th>Tunggakan</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => {
                const paid = getKasPaid(idx, 1);
                return (
                  <tr
                    key={s.nisn}
                    id={`kas-t1-row-${idx}`}
                    className={highlightIdx === idx ? "glowing-row" : ""}
                  >
                    <td style={{ fontWeight: 700, color: "#60a5fa" }}>{idx + 1}</td>
                    <td
                      style={{
                        textAlign: "left",
                        fontWeight: 700,
                        paddingLeft: "8px",
                      }}
                    >
                      {s.nama}
                    </td>
                    <td>
                      <span className={paid ? "badge-kas-lunas" : "badge-kas-nongt"}>
                        {paid ? "LUNAS" : "BELUM"}
                      </span>
                    </td>
                    <td
                      style={{
                        color: paid ? "#4ade80" : "#cbd5e1",
                        fontWeight: 800,
                      }}
                    >
                      {formatRupiah(paid ? NOMINAL_KAS : 0)}
                    </td>
                    <td
                      style={{
                        color: paid ? "#cbd5e1" : "#f43f5e",
                        fontWeight: 800,
                      }}
                    >
                      {formatRupiah(paid ? 0 : NOMINAL_KAS)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section-divider">
        <div className="divider-badge">Tabel 2: Matriks Kas 12 Bulan</div>
      </div>

      {/* TABEL 2 */}
      <div className="glass-card" style={{ padding: "10px" }}>
        <div className="table-responsive">
          <table className="absensi-table kas-yearly-table">
            <thead>
              <tr>
                <th>No</th>
                <th style={{ textAlign: "left", paddingLeft: "8px" }}>Nama</th>
                {monthShort.map((m) => (
                  <th key={m}>{m}</th>
                ))}
                <th>Total</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, sIdx) => {
                let cnt = 0;
                const cells = monthShort.map((_, m) => {
                  const paid = getKasPaid(sIdx, m);
                  if (paid) cnt++;
                  return (
                    <td
                      key={m}
                      className={`kas-m-cell ${paid ? "kas-paid" : "kas-unpaid"}`}
                    >
                      {paid ? "✓" : "✕"}
                    </td>
                  );
                });
                const pct = ((cnt / 12) * 100).toFixed(1);
                return (
                  <tr
                    key={s.nisn}
                    id={`kas-t2-row-${sIdx}`}
                    className={highlightIdx === sIdx ? "glowing-row" : ""}
                  >
                    <td style={{ fontWeight: 700, color: "#60a5fa" }}>{sIdx + 1}</td>
                    <td
                      style={{
                        textAlign: "left",
                        fontWeight: 700,
                        paddingLeft: "8px",
                      }}
                    >
                      {s.nama}
                    </td>
                    {cells}
                    <td style={{ color: "#4ade80", fontWeight: 800 }}>
                      {formatRupiah(cnt * NOMINAL_KAS)}
                    </td>
                    <td>
                      <div className="pct-breakdown">
                        <span style={{ color: "#4ade80" }}>{pct}%</span>
                      </div>
                      <div className="progress-bar-container">
                        <div
                          className="progress-seg bg-hadir"
                          style={{ width: `${pct}%` }}
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

      <div className="qris-pay-card">
        <div style={{ fontSize: "11px", fontWeight: 800, color: "#60a5fa" }}>
          <i className="fa-solid fa-qrcode" style={{ marginRight: "5px" }} />
          PEMBAYARAN KAS ONLINE (QRIS)
        </div>
        <div style={{ fontSize: "10px", color: "#cbd5e1", marginTop: "4px" }}>
          Bayar iuran kas Rp 5.000 / bulan via e-wallet
        </div>
        <button
          className="btn-pay-qris"
          type="button"
          onClick={() => router.push("/qris")}
        >
          <i className="fa-solid fa-wallet" />
          <span>Bayar Uang Kas (QRIS)</span>
        </button>
      </div>

      <div className="section-divider">
        <div className="divider-badge">Tabel 3: Log Transaksi (30 Entry)</div>
      </div>

      <div className="glass-card" style={{ padding: "10px" }}>
        <div className="table-responsive">
          <table className="absensi-table kas-log-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th style={{ textAlign: "left", paddingLeft: "8px" }}>
                  Keterangan
                </th>
                <th>Jenis</th>
                <th>Nominal</th>
                <th>Sisa Kas</th>
              </tr>
            </thead>
            <tbody>
              {kasLog.map((item, index) => {
                const isMasuk = item.type === "masuk";
                return (
                  <tr key={item.no}>
                    <td style={{ fontWeight: 700, color: "#60a5fa" }}>
                      {index + 1}
                    </td>
                    <td style={{ color: "#94a3b8", fontSize: "10px" }}>
                      {item.date}
                    </td>
                    <td
                      style={{
                        textAlign: "left",
                        fontWeight: 700,
                        paddingLeft: "8px",
                      }}
                    >
                      {item.desc}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: "8.5px",
                          fontWeight: 800,
                          padding: "2px 6px",
                          borderRadius: "4px",
                          background: isMasuk
                            ? "rgba(34,197,94,0.15)"
                            : "rgba(244,63,94,0.15)",
                          color: isMasuk ? "#4ade80" : "#f43f5e",
                        }}
                      >
                        {isMasuk ? "PEMASUKAN" : "PENGELUARAN"}
                      </span>
                    </td>
                    <td
                      style={{
                        fontWeight: 800,
                        color: isMasuk ? "#4ade80" : "#f43f5e",
                      }}
                    >
                      {isMasuk ? "+" : "-"}
                      {formatRupiah(item.val)}
                    </td>
                    <td style={{ fontWeight: 800, color: "#60a5fa" }}>
                      {formatRupiah(item.balance)}
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