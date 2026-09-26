"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppData } from "@/lib/AppDataContext";
import {
  formatRupiah,
  getInitials,
  NOMINAL_KAS,
  monthConfigs,
} from "@/lib/data";

export default function SiswaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const nisn = params.nisn as string;

  const { students, isKasPaid } = useAppData();

  const sIdx = students.findIndex((s) => s.nisn === nisn);
  const siswa = sIdx >= 0 ? students[sIdx] : undefined;

  const currentMonthIdx = useMemo(() => {
    const now = new Date();
    const curMonth = now.getMonth();
    const curYear = now.getFullYear();

    const foundIdx = monthConfigs.findIndex((m) => {
      const parts = m.name.split(" ");
      const monthName = parts[0];
      const yearNum = parseInt(parts[1], 10);
      const idMonths: Record<string, number> = {
        Juli: 6,
        Agustus: 7,
        September: 8,
        Oktober: 9,
        November: 10,
        Desember: 11,
        Januari: 0,
        Februari: 1,
        Maret: 2,
        April: 3,
        Mei: 4,
        Juni: 5,
      };
      return idMonths[monthName] === curMonth && yearNum === curYear;
    });

    return foundIdx !== -1 ? foundIdx : 0;
  }, []);

  if (!siswa) {
    return (
      <div className="glass-card text-center">
        <p style={{ color: "#94a3b8" }}>Siswa tidak ditemukan</p>
        <button
          type="button"
          className="btn-action-light"
          onClick={() => router.push("/direktori")}
        >
          Kembali
        </button>
      </div>
    );
  }

  const total =
    Math.max(siswa.hadir + siswa.izin + siswa.sakit + siswa.alpa, 1) || 28;
  const pctH = ((siswa.hadir / total) * 100).toFixed(1);
  const pctI = ((siswa.izin / total) * 100).toFixed(1);
  const pctS = ((siswa.sakit / total) * 100).toFixed(1);
  const pctA = ((siswa.alpa / total) * 100).toFixed(1);

  let paidMonths = 0;
  for (let m = 0; m < 12; m++) {
    if (isKasPaid(siswa.nisn, sIdx, m)) paidMonths++;
  }

  const isPaidThisMonth = isKasPaid(siswa.nisn, sIdx, currentMonthIdx);
  const isMale = siswa.gender === "L";

  return (
    <>
      {/* Header: Kembali terpisah + label BIODATA di card pendek */}
      <div
        className="siswa-detail-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          width: "100%",
        }}
      >
        <button
          type="button"
          className="btn-action-light"
          onClick={() => router.push("/direktori")}
          style={{ flexShrink: 0 }}
        >
          <i className="fa-solid fa-arrow-left" /> Kembali
        </button>

        <div
          className="glass-card"
          style={{
            padding: "8px 14px",
            width: "fit-content",
            marginLeft: "auto",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: "#60a5fa",
              letterSpacing: 0.6,
              textTransform: "uppercase",
            }}
          >
            BIODATA SISWA
          </span>
        </div>
      </div>

      {/* GLMS */}
      <a
        href="https://smkpgri2cbn.sch.id/glms/siswa/login.html"
        target="_blank"
        rel="noopener noreferrer"
        className="glass-card flex-between"
        style={{ textDecoration: "none" }}
      >
        <div>
          <div style={{ fontWeight: 800, fontSize: 12, color: "#f8fafc" }}>
            GLMS Account
          </div>
          <div style={{ fontSize: 10, color: "#94a3b8" }}>
            GLMS · Akun login siswa sekolah
          </div>
        </div>
        <i
          className="fa-solid fa-arrow-up-right-from-square"
          style={{ color: "#60a5fa" }}
        />
      </a>

      {/* ===== PROFILE CARD =====
          Mobile: tetap center
          Desktop: layout TikTok (avatar kiri, bio kanan)
      */}
      <div className="glass-card siswa-profile-card">
        {/* Avatar */}
        <div
          className={
            "student-avatar siswa-profile-avatar" +
            (siswa.gender === "P" ? " female" : "")
          }
        >
          {getInitials(siswa.nama)}
        </div>

        {/* Bio text */}
        <div className="siswa-profile-bio">
          <div className="siswa-profile-name">{siswa.nama}</div>
          <div className="siswa-profile-meta">
            NISN: {siswa.nisn}
            {siswa.nis ? ` · NIS: ${siswa.nis}` : ""}
          </div>
          {siswa.role && (
            <div style={{ marginTop: 8 }}>
              <div className={"officer-badge " + (siswa.roleClass || "")}>
                <i className={"fa-solid " + (siswa.icon || "fa-user")} />{" "}
                {siswa.role}
              </div>
            </div>
          )}

          <div className="siswa-profile-stats">
            <div className="summary-box" style={{ flex: 1, minWidth: 0 }}>
              <div className="summary-label">JENIS KELAMIN</div>
              <div className="summary-val">
                {isMale ? "Laki-laki" : "Perempuan"}
              </div>
            </div>
            <div className="summary-box" style={{ flex: 1, minWidth: 0 }}>
              <div className="summary-label">STATUS</div>
              <div className="summary-val" style={{ color: "#4ade80" }}>
                Aktif
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Persentase kehadiran — bar lebih panjang */}
      <div className="glass-card">
        <div className="title-sub" style={{ marginBottom: 12 }}>
          <i className="fa-solid fa-chart-pie" style={{ marginRight: 6 }} />
          PERSENTASE KEHADIRAN
        </div>
        <div className="grid-4" style={{ marginBottom: 12 }}>
          <div className="text-center">
            <div style={{ fontSize: 18, fontWeight: 900, color: "#4ade80" }}>
              {siswa.hadir}
            </div>
            <div style={{ fontSize: 9, color: "#94a3b8" }}>HADIR</div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: 18, fontWeight: 900, color: "#60a5fa" }}>
              {siswa.izin}
            </div>
            <div style={{ fontSize: 9, color: "#94a3b8" }}>IZIN</div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: 18, fontWeight: 900, color: "#facc15" }}>
              {siswa.sakit}
            </div>
            <div style={{ fontSize: 9, color: "#94a3b8" }}>SAKIT</div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: 18, fontWeight: 900, color: "#f43f5e" }}>
              {siswa.alpa}
            </div>
            <div style={{ fontSize: 9, color: "#94a3b8" }}>ALPA</div>
          </div>
        </div>

        {/* Bar full width, lebih tinggi */}
        <div
          className="progress-bar-container"
          style={{
            width: "100%",
            maxWidth: "100%",
            height: 14,
            marginBottom: 10,
            borderRadius: 999,
          }}
        >
          <div className="progress-seg bg-hadir" style={{ width: pctH + "%" }} />
          <div className="progress-seg bg-izin" style={{ width: pctI + "%" }} />
          <div className="progress-seg bg-sakit" style={{ width: pctS + "%" }} />
          <div className="progress-seg bg-alpha" style={{ width: pctA + "%" }} />
        </div>
        <div
          className="pct-breakdown"
          style={{ justifyContent: "space-around", fontSize: 10 }}
        >
          <span style={{ color: "#4ade80" }}>H:{pctH}%</span>
          <span style={{ color: "#60a5fa" }}>I:{pctI}%</span>
          <span style={{ color: "#facc15" }}>S:{pctS}%</span>
          <span style={{ color: "#f43f5e" }}>A:{pctA}%</span>
        </div>
      </div>

      {/* Status kas */}
      <div className="glass-card">
        <div className="title-sub" style={{ marginBottom: 12 }}>
          <i className="fa-solid fa-wallet" style={{ marginRight: 6 }} />
          STATUS KAS
        </div>
        <div className="summary-grid">
          <div className="summary-box">
            <div className="summary-label">
              STATUS (
              {(
                monthConfigs[currentMonthIdx]?.name || "BULAN INI"
              ).toUpperCase()}
              )
            </div>
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
              {formatRupiah(paidMonths * NOMINAL_KAS)}
            </div>
          </div>
          <div className="summary-box">
            <div className="summary-label">TUNGGAKAN</div>
            <div className="summary-val" style={{ color: "#f43f5e" }}>
              {formatRupiah((12 - paidMonths) * NOMINAL_KAS)}
            </div>
          </div>
          <div className="summary-box">
            <div className="summary-label">PROGRESS LUNAS</div>
            <div className="summary-val">{paidMonths}/12 Bulan</div>
          </div>
        </div>
      </div>
    </>
  );
                       }
