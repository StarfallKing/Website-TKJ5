"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppData } from "@/lib/AppDataContext";
import { formatRupiah } from "@/lib/data";

export default function AdminKasPage() {
  const router = useRouter();
  const { kasLog, addKasTransaction } = useAppData();
  const [desc, setDesc] = useState("");
  const [type, setType] = useState<"masuk" | "keluar">("masuk");
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("admin-ok") !== "1") router.replace("/admin");
  }, [router]);

  return (
    <>
      <div className="glass-card text-center">
        <div className="title-sub">KELOLA KAS</div>
        <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
          Tambah transaksi → saldo & tabel publik ikut berubah
        </p>
      </div>

      <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          className="form-textarea"
          style={{ minHeight: 40 }}
          placeholder="Keterangan transaksi"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <div className="radio-group">
          <div
            className={`radio-card ${type === "masuk" ? "active" : ""}`}
            onClick={() => setType("masuk")}
          >
            Pemasukan
          </div>
          <div
            className={`radio-card ${type === "keluar" ? "active" : ""}`}
            onClick={() => setType("keluar")}
          >
            Pengeluaran
          </div>
        </div>
        <input
          type="number"
          className="form-textarea"
          style={{ minHeight: 40 }}
          placeholder="Nominal"
          value={val || ""}
          onChange={(e) => setVal(Number(e.target.value))}
        />
        <button
          className="btn-pay-qris"
          type="button"
          onClick={() => {
            if (!desc.trim() || val <= 0) return alert("Lengkapi data");
            addKasTransaction(desc, type, val);
            setDesc("");
            setVal(0);
          }}
        >
          Catat Transaksi
        </button>
      </div>

      <div className="glass-card" style={{ padding: 10 }}>
        <div className="title-sub" style={{ marginBottom: 8 }}>Log terbaru</div>
        {[...kasLog].reverse().slice(0, 15).map((t) => (
          <div key={t.no} className="history-card-item" style={{ marginBottom: 6 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 11 }}>{t.desc}</div>
              <div style={{ fontSize: 9, color: "#94a3b8" }}>{t.date}</div>
            </div>
            <div
              style={{
                fontWeight: 800,
                color: t.type === "masuk" ? "#4ade80" : "#f43f5e",
                fontSize: 11,
              }}
            >
              {t.type === "masuk" ? "+" : "-"}
              {formatRupiah(t.val)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}