"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatRupiah, getKasPaid, NOMINAL_KAS } from "@/lib/data";
import { useAppData } from "@/lib/AppDataContext";

export default function QrisPage() {
  const router = useRouter();
  const { students, payments, markKasPaid } = useAppData();

  const [query, setQuery] = useState("");
  const [showSug, setShowSug] = useState(false);
  const [selected, setSelected] = useState<(typeof students)[0] | null>(null);
  const [sIdx, setSIdx] = useState(-1);
  const [histFilter, setHistFilter] = useState("");
  const [justPaid, setJustPaid] = useState(false);

  const matches = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return students
      .map((s, idx) => ({ ...s, idx }))
      .filter(
        (s) => s.nama.toLowerCase().includes(q) || s.nisn.includes(q)
      )
      .slice(0, 8);
  }, [query, students]);

  const isPaid = justPaid || (sIdx >= 0 && getKasPaid(sIdx, 1));

  const invoice = selected
    ? `Kas-TKJ5-\( {selected.nisn.substring(0, 5)}- \){Math.floor(Date.now() / 1000)}`
    : "";

  const filteredHistory = payments.filter((log) =>
    log.name.toLowerCase().includes(histFilter.toLowerCase().trim())
  );

  return (
    <>
      <div className="glass-card flex-between">
        <button className="btn-action-light" onClick={() => router.push("/kas")}>
          <i className="fa-solid fa-arrow-left" /> Kembali ke Halaman Kas
        </button>
        <span style={{ fontSize: "10px", fontWeight: 800, color: "#4ade80" }}>
          PORTAL GATEWAY QRIS
        </span>
      </div>

      <div
        className="glass-card text-center"
        style={{ display: "flex", flexDirection: "column", gap: "4px" }}
      >
        <div className="title-sub">PEMBAYARAN KAS VIA QRIS</div>
        <p style={{ fontSize: "12px", color: "#fff", fontWeight: 700 }}>
          Cari Nama, Scan QRIS & Konfirmasi
        </p>
      </div>

      <div className="search-wrapper">
        <div className="search-box expanded" style={{ width: "100%" }}>
          <div className="search-icon">
            <i className="fa-solid fa-user-tag" />
          </div>
          <input
            type="text"
            placeholder="Ketik nama siswa untuk membayar kas..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSug(true);
              setSelected(null);
              setSIdx(-1);
              setJustPaid(false);
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
                onClick={() => {
                  setSelected(item);
                  setSIdx(item.idx);
                  setQuery(item.nama);
                  setShowSug(false);
                  setJustPaid(false);
                }}
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
      </div>

      {selected && (
        <div
          className="glass-card text-center"
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <div style={{ fontSize: "11px", fontWeight: 800, color: "#60a5fa" }}>
            {selected.nama}
          </div>
          <div style={{ fontSize: "9px", color: "#94a3b8" }}>
            NISN: {selected.nisn}
          </div>

          <div className="qr-box-wrapper">
            <div className="qr-dummy" />
            <div
              style={{
                fontSize: "10px",
                fontWeight: 900,
                color: "#0f172a",
                marginTop: "8px",
              }}
            >
              QRIS RESMI X TKJ-5
            </div>
            <div style={{ fontSize: "8px", color: "#64748b" }}>
              Scan via GoPay, OVO, Dana, ShopeePay, Mobile Banking
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              padding: "10px",
              textAlign: "left",
              fontSize: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <div className="flex-between">
              <span style={{ color: "#94a3b8" }}>Nominal Tagihan:</span>
              <span style={{ fontWeight: 800, color: "#4ade80" }}>
                {formatRupiah(NOMINAL_KAS)}
              </span>
            </div>
            <div className="flex-between">
              <span style={{ color: "#94a3b8" }}>Kode Invoice:</span>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "9.5px",
                  fontWeight: 800,
                  color: "#60a5fa",
                }}
              >
                {invoice}
              </span>
            </div>
            <div className="flex-between">
              <span style={{ color: "#94a3b8" }}>Status Bayar:</span>
              <span
                style={{
                  fontWeight: 800,
                  color: isPaid ? "#4ade80" : "#f43f5e",
                }}
              >
                {isPaid ? "LUNAS / TERBAYAR" : "MENUNGGU PEMBAYARAN"}
              </span>
            </div>
          </div>

          <div className="grid-2" style={{ marginTop: "4px" }}>
            <button
              className="btn-action-light"
              type="button"
              style={{ justifyContent: "center" }}
              onClick={() => setJustPaid(false)}
            >
              <i className="fa-solid fa-rotate" /> Refresh Status
            </button>
            <button
              className="btn-action-light"
              type="button"
              style={{
                justifyContent: "center",
                background: "rgba(34,197,94,0.2)",
                borderColor: "rgba(74,222,128,0.4)",
                color: "#4ade80",
              }}
              onClick={() => {
                markKasPaid(selected.nama, selected.nisn, 1);
                setJustPaid(true);
                alert(
                  `Pembayaran QRIS berhasil untuk ${selected.nama}!\nSaldo kas & histori diperbarui.`
                );
              }}
            >
              <i className="fa-solid fa-circle-check" /> Konfirmasi Lunas
            </button>
          </div>
        </div>
      )}

      <div className="section-divider">
        <div className="divider-badge">
          <i className="fa-solid fa-clock-rotate-left" style={{ marginRight: "5px" }} />
          Histori Pembayaran Kas
        </div>
      </div>

      <div
        className="glass-card"
        style={{
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div className="search-box expanded" style={{ width: "100%" }}>
          <div className="search-icon">
            <i className="fa-solid fa-magnifying-glass" />
          </div>
          <input
            type="text"
            placeholder="Filter histori berdasarkan nama..."
            value={histFilter}
            onChange={(e) => setHistFilter(e.target.value)}
            autoComplete="off"
          />
        </div>

        {filteredHistory.length === 0 && (
          <div
            style={{
              fontSize: "10px",
              color: "#94a3b8",
              textAlign: "center",
              padding: "10px",
            }}
          >
            Tidak ada histori pembayaran
          </div>
        )}

        {filteredHistory.map((log) => (
          <div key={log.code} className="history-card-item">
            <div>
              <div style={{ fontWeight: 700, color: "#f8fafc" }}>{log.name}</div>
              <div
                style={{ fontSize: "8.5px", color: "#94a3b8", marginTop: "2px" }}
              >
                {log.date} •{" "}
                <span style={{ fontFamily: "monospace", color: "#60a5fa" }}>
                  {log.code}
                </span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 800, color: "#4ade80" }}>
                +{formatRupiah(log.amount)}
              </div>
              <div
                style={{
                  fontSize: "8px",
                  fontWeight: 800,
                  color: "#4ade80",
                  textTransform: "uppercase",
                }}
              >
                {log.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}