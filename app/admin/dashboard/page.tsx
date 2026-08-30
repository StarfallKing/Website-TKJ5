"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppData } from "@/lib/AppDataContext";
import { formatRupiah } from "@/lib/data";

export default function AdminDashboard() {
  const router = useRouter();
  const { students, kasLog, payments } = useAppData();

  useEffect(() => {
    if (sessionStorage.getItem("admin-ok") !== "1") {
      router.replace("/admin");
    }
  }, [router]);

  const saldo = kasLog[kasLog.length - 1]?.balance ?? 0;
  const masuk = kasLog.filter((t) => t.type === "masuk").reduce((a, t) => a + t.val, 0);
  const keluar = kasLog.filter((t) => t.type === "keluar").reduce((a, t) => a + t.val, 0);
  const L = students.filter((s) => s.gender === "L").length;
  const P = students.filter((s) => s.gender === "P").length;

  return (
    <>
      <div className="glass-card text-center">
        <div className="title-sub">DASHBOARD ADMIN</div>
        <p style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>
          Ringkasan data real-time (tersimpan di browser)
        </p>
      </div>

      <div className="grid-2">
        <div className="glass-card text-center">
          <div className="title-sub">SISWA</div>
          <div className="card-val" style={{ fontSize: 18 }}>{students.length}</div>
          <div style={{ fontSize: 10, color: "#94a3b8" }}>L:{L} · P:{P}</div>
        </div>
        <div className="glass-card text-center">
          <div className="title-sub">SALDO KAS</div>
          <div className="card-val" style={{ color: "#4ade80", fontSize: 14 }}>
            {formatRupiah(saldo)}
          </div>
        </div>
        <div className="glass-card text-center">
          <div className="title-sub">PEMASUKAN</div>
          <div className="card-val" style={{ color: "#60a5fa" }}>{formatRupiah(masuk)}</div>
        </div>
        <div className="glass-card text-center">
          <div className="title-sub">PENGELUARAN</div>
          <div className="card-val" style={{ color: "#f43f5e" }}>{formatRupiah(keluar)}</div>
        </div>
      </div>

      <div className="glass-card">
        <div className="title-sub" style={{ marginBottom: 8 }}>QRIS TERAKHIR</div>
        {payments.slice(0, 5).map((p) => (
          <div key={p.code} className="history-card-item" style={{ marginBottom: 6 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 11 }}>{p.name}</div>
              <div style={{ fontSize: 9, color: "#94a3b8" }}>{p.date}</div>
            </div>
            <div style={{ color: "#4ade80", fontWeight: 800, fontSize: 11 }}>
              {formatRupiah(p.amount)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}