"use client";

import { monthShort, formatRupiah, NOMINAL_KAS } from "@/lib/data";
import { useAppData } from "@/lib/AppDataContext";

export default function AdminKasPage() {
  const { students, isKasPaid, setKasPaid, kasLog, addKasTransaction } =
    useAppData();

  return (
    <>
      <div className="glass-card text-center">
        <div className="title-sub">EDIT KAS</div>
        <p style={{ fontSize: 11, color: "#94a3b8" }}>
          Klik ✓ / ✕ per bulan · sinkron ke web publik
        </p>
      </div>

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
                  <td style={{ color: "#60a5fa", fontWeight: 700 }}>{si + 1}</td>
                  <td style={{ textAlign: "left", fontWeight: 700, fontSize: 10 }}>
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

      <div className="glass-card" style={{ marginTop: 12 }}>
        <div className="title-sub" style={{ marginBottom: 8 }}>
          Tambah log cepat
        </div>
        <button
          type="button"
          className="btn-action-light"
          onClick={() =>
            addKasTransaction(
              "Setoran manual admin",
              "masuk",
              NOMINAL_KAS
            )
          }
        >
          + Pemasukan {formatRupiah(NOMINAL_KAS)}
        </button>
        <p style={{ fontSize: 10, color: "#64748b", marginTop: 8 }}>
          Baris log: {kasLog.length}
        </p>
      </div>
    </>
  );
}
