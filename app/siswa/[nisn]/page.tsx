"use client";

import { useParams, useRouter } from "next/navigation";
import { allStudents, formatRupiah, getInitials, NOMINAL_KAS } from "@/lib/data";

export default function SiswaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const nisn = params.nisn as string;

  const siswa = allStudents.find((s) => s.nisn === nisn);
  const sIdx = allStudents.findIndex((s) => s.nisn === nisn);

  if (!siswa) {
    return (
      <div className="glass-card text-center">
        <p style={{ color: "#94a3b8" }}>Siswa tidak ditemukan</p>
        <button className="btn-action-light" onClick={() => router.push("/direktori")}>
          Kembali
        </button>
      </div>
    );
  }

  const total = 28;
  const pctH = ((siswa.hadir / total) * 100).toFixed(1);
  const pctI = ((siswa.izin / total) * 100).toFixed(1);
  const pctS = ((siswa.sakit / total) * 100).toFixed(1);
  const pctA = ((siswa.alpa / total) * 100).toFixed(1);

  // Dummy kas progress (mirip HTML)
  let paid = 0;
  for (let m = 0; m < 12; m++) {
    if (((sIdx * 17 + m * 31) % 100) < 82) paid++;
  }
  const isPaidThisMonth = ((sIdx * 17 + 31) % 100) < 82;

  return (
    <>
      <div className="glass-card flex-between">
        <button className="btn-action-light" onClick={() => router.push("/direktori")}>
          <i className="fa-solid fa-arrow-left" /> Kembali
        </button>
        <span style={{ fontSize: "10px", fontWeight: 800, color: "#60a5fa" }}>
          BIODATA SISWA
        </span>
      </div>

      {/* Biodata */}
      <div
        className="glass-card text-center"
        style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}
      >
        <div
          className={`student-avatar ${siswa.gender === "P" ? "female" : ""}`}
          style={{ width: "72px", height: "72px", fontSize: "24px" }}
        >
          {getInitials(siswa.nama)}
        </div>
        <div>
          <div style={{ fontSize: "16px", fontWeight: 900 }}>{siswa.nama}</div>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
            NISN: {siswa.nisn}
          </div>
          {siswa.role && (
            <div style={{ marginTop: "8px" }}>
              <div className={`officer-badge ${siswa.roleClass}`}>
                <i className={`fa-solid ${siswa.icon}`} /> {siswa.role}
              </div>
            </div>
          )}
        </div>

        <div className="summary-grid" style={{ width: "100%" }}>
          <div className="summary-box">
            <div className="summary-label">JENIS KELAMIN</div>
            <div className="summary-val">
              {siswa.gender === "L" ? "Laki-laki" : "Perempuan"}
            </div>
          </div>
          <div className="summary-box">
            <div className="summary-label">STATUS</div>
            <div className="summary-val">Aktif</div>
          </div>
        </div>
      </div>

      {/* Kehadiran */}
      <div className="glass-card">
        <div className="title-sub" style={{ marginBottom: "12px" }}>
          <i className="fa-solid fa-chart-pie" style={{ marginRight: "6px" }} />
          PERSENTASE KEHADIRAN
        </div>

        <div className="grid-4" style={{ marginBottom: "10px" }}>
          <div className="text-center">
            <div style={{ fontSize: "18px", fontWeight: 900, color: "#4ade80" }}>{siswa.hadir}</div>
            <div style={{ fontSize: "9px", color: "#94a3b8" }}>HADIR</div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: "18px", fontWeight: 900, color: "#60a5fa" }}>{siswa.izin}</div>
            <div style={{ fontSize: "9px", color: "#94a3b8" }}>IZIN</div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: "18px", fontWeight: 900, color: "#facc15" }}>{siswa.sakit}</div>
            <div style={{ fontSize: "9px", color: "#94a3b8" }}>SAKIT</div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: "18px", fontWeight: 900, color: "#f43f5e" }}>{siswa.alpa}</div>
            <div style={{ fontSize: "9px", color: "#94a3b8" }}>ALPA</div>
          </div>
        </div>

        <div className="progress-bar-container" style={{ width: "100%", height: "10px", marginBottom: "8px" }}>
          <div className="progress-seg bg-hadir" style={{ width: `${pctH}%` }} />
          <div className="progress-seg bg-izin" style={{ width: `${pctI}%` }} />
          <div className="progress-seg bg-sakit" style={{ width: `${pctS}%` }} />
          <div className="progress-seg bg-alpha" style={{ width: `${pctA}%` }} />
        </div>

        <div className="pct-breakdown" style={{ justifyContent: "space-around", fontSize: "10px" }}>
          <span style={{ color: "#4ade80" }}>H:{pctH}%</span>
          <span style={{ color: "#60a5fa" }}>I:{pctI}%</span>
          <span style={{ color: "#facc15" }}>S:{pctS}%</span>
          <span style={{ color: "#f43f5e" }}>A:{pctA}%</span>
        </div>
      </div>

      {/* Kas */}
      <div className="glass-card">
        <div className="title-sub" style={{ marginBottom: "12px" }}>
          <i className="fa-solid fa-wallet" style={{ marginRight: "6px" }} />
          STATUS KAS
        </div>
        <div className="summary-grid">
          <div className="summary-box">
            <div className="summary-label">STATUS BULAN INI</div>
            <div
              className="summary-val"
              style={{ color: isPaidThisMonth ? "#4ade80" : "#f43f5e" }}
            >
              {isPaidThisMonth ? "LUNAS" : "BELUM BAYAR"}
            </div>
          </div>
          <div className="summary-box">
            <div className="summary-label">TOTAL DIBAYAR</div>
            <div className="summary-val" style={{ color: "#4ade80" }}>
              {formatRupiah(paid * NOMINAL_KAS)}
            </div>
          </div>
          <div className="summary-box">
            <div className="summary-label">TUNGGAKAN</div>
            <div className="summary-val" style={{ color: "#f43f5e" }}>
              {formatRupiah((12 - paid) * NOMINAL_KAS)}
            </div>
          </div>
          <div className="summary-box">
            <div className="summary-label">PROGRESS LUNAS</div>
            <div className="summary-val">{paid}/12 Bulan</div>
          </div>
        </div>
      </div>
    </>
  );
}