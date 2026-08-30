"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppData } from "@/lib/AppDataContext";
import { formatRupiah } from "@/lib/data";

export default function HomePage() {
  const router = useRouter();
  const { students, kasLog } = useAppData();
  const [newsOpen, setNewsOpen] = useState(false);
  const kasNow = kasLog[kasLog.length - 1]?.balance ?? 0;

  return (
    <>
      <div
        className="glass-card text-center"
        style={{
          background:
            "linear-gradient(135deg, rgba(30,58,138,0.25), rgba(15,23,42,0.5))",
          borderColor: "rgba(96,165,250,0.3)",
          padding: "16px",
        }}
      >
        <div className="title-sub" style={{ marginBottom: "4px" }}>
          SISTEM TERPADU KELAS X–TKJ 5
        </div>
        <p style={{ fontSize: "12px", color: "#fff", fontWeight: 700, lineHeight: 1.4 }}>
          Transparansi Kehadiran, Kas, dan Informasi Resmi.
        </p>
      </div>

      <div className="grid-2">
        <div
          className="glass-card text-center"
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/direktori")}
        >
          <div style={{ fontSize: "20px", marginBottom: "2px" }}>👥</div>
          <div className="title-sub">MURID</div>
          <div className="card-val">TOTAL : {students.length} SISWA</div>
        </div>

        <div
          className="glass-card text-center"
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/kas")}
        >
          <div style={{ fontSize: "20px", marginBottom: "2px" }}>💵</div>
          <div className="title-sub">KAS KELAS</div>
          <div className="card-val" style={{ color: "#4ade80" }}>
            {formatRupiah(kasNow)}
          </div>
        </div>

        <div
          className="glass-card text-center"
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/jadwal")}
        >
          <div style={{ fontSize: "20px", marginBottom: "2px" }}>📚</div>
          <div className="title-sub">MAPEL</div>
          <div className="card-val">TOTAL : 13 MAPEL</div>
        </div>

        <div className="glass-card text-center">
          <div style={{ fontSize: "20px", marginBottom: "2px" }}>🏫</div>
          <div className="title-sub">INFO RUANG</div>
          <div className="card-val">KELAS X TKJ – 5</div>
        </div>
      </div>

      <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div
          className="flex-between"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            paddingBottom: "6px",
          }}
        >
          <span style={{ fontSize: "10px", fontWeight: 800, color: "#60a5fa" }}>
            BERITA TERKINI
          </span>
          <span
            style={{
              fontSize: "8px",
              background: "rgba(37,99,235,0.2)",
              color: "#93c5fd",
              padding: "2px 6px",
              borderRadius: "10px",
              border: "1px solid rgba(96,165,250,0.3)",
              fontWeight: 700,
            }}
          >
            AI Scraped
          </span>
        </div>

        <div style={{ fontSize: "12px", fontWeight: 800, lineHeight: 1.35 }}>
          Pelantikan Kepala Sekolah SMK PGRI 2 Cibinong Periode 2026 – 2030
        </div>

        <img
          src="/3899.png"
          alt="Pelantikan Kepala Sekolah"
          className="news-banner"
        />
        
        <p className={`news-desc ${newsOpen ? "expanded" : ""}`}>
          Selamat atas dilantiknya Dr. Andi Hermawan, M.Pd sebagai Kepala SMK
          PGRI 2 Cibinong. Semoga amanah ini menjadi ladang keberkahan dan
          membawa sekolah kita tercinta semakin unggul dalam bidang teknologi,
          kejuruan, serta pencetakan generasi muda berbakat di era digital
          mutakhir.
          <span
            className="read-more-btn"
            style={{ fontSize: "9.5px", marginLeft: "4px" }}
            onClick={() => setNewsOpen((v) => !v)}
          >
            {newsOpen ? "lihat lebih sedikit" : "lihat selengkapnya"}
          </span>
        </p>

        <a
          href="https://smkpgri2cbn.sch.id"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "9px",
            fontWeight: 800,
            color: "#93c5fd",
            background: "rgba(37,99,235,0.2)",
            border: "1px solid rgba(96,165,250,0.35)",
            padding: "2px 8px",
            borderRadius: "999px",
            textDecoration: "none",
            display: "inline-block",
            width: "fit-content",
          }}
        >
          Sumber: SMK PGRI 2 Cibinong
        </a>
      </div>
    </>
  );
}