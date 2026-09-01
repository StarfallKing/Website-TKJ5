"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  allStudents,
  formatRupiah,
  NOMINAL_KAS,
} from "@/lib/data";
import { useAppData } from "@/lib/AppDataContext";

export default function AdminDashboardPage() {
  const router = useRouter();
  const {
    students,
    kasLog,
    maintenanceMode,
    setMaintenanceMode,
  } = useAppData();

  const list = students?.length ? students : allStudents;

  useEffect(() => {
    if (sessionStorage.getItem("admin-ok") !== "1") {
      router.replace("/admin");
    }
  }, [router]);

  const countL = list.filter((s) => s.gender === "L").length;
  const countP = list.filter((s) => s.gender === "P").length;

  const saldo = useMemo(() => {
    if (!kasLog?.length) return 0;
    const last = [...kasLog].reverse().find((x) => x.desc?.trim() || x.val);
    return last?.balance ?? 0;
  }, [kasLog]);

  const masuk = useMemo(
    () =>
      (kasLog || [])
        .filter((x) => x.type === "masuk")
        .reduce((a, x) => a + (x.val || 0), 0),
    [kasLog]
  );

  const keluar = useMemo(
    () =>
      (kasLog || [])
        .filter((x) => x.type === "keluar")
        .reduce((a, x) => a + (x.val || 0), 0),
    [kasLog]
  );

  return (
    <>
      {/* Header mirip home publik */}
      <div
        className="glass-card"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 16px",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: "linear-gradient(135deg,#2563eb,#7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            fontSize: 14,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          TKJ
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: "#94a3b8",
              letterSpacing: 0.5,
            }}
          >
            WEBSITE RESMI KELAS · MODE ADMIN
          </div>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#60a5fa" }}>
            X TKJ–5
          </div>
        </div>
      </div>

      {/* Status maintenance — tombol keramat ringkas di home admin */}
      <div
        className="glass-card"
        style={{
          borderColor: maintenanceMode
            ? "rgba(244,63,94,0.45)"
            : "rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex-between" style={{ gap: 10 }}>
          <div>
            <div className="title-sub" style={{ color: maintenanceMode ? "#f43f5e" : "#4ade80" }}>
              {maintenanceMode ? "MAINTENANCE ON" : "WEB PUBLIK AKTIF"}
            </div>
            <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>
              {maintenanceMode
                ? "Pengunjung hanya melihat halaman perbaikan"
                : "Portal publik bisa dibuka normal"}
            </p>
          </div>
          <button
            type="button"
            className="btn-pay-qris"
            style={{
              width: "auto",
              padding: "10px 14px",
              fontSize: 10,
              background: maintenanceMode
                ? "linear-gradient(135deg,#16a34a,#15803d)"
                : "linear-gradient(135deg,#e11d48,#9f1239)",
            }}
            onClick={() => setMaintenanceMode?.(!maintenanceMode)}
          >
            {maintenanceMode ? "Matikan perbaikan" : "Website sedang perbaikan"}
          </button>
        </div>
        <p style={{ fontSize: 9, color: "#64748b", marginTop: 8 }}>
          Pengaturan lengkap (akun login) di menu Settings.
        </p>
      </div>

      {/* Widget mirip home: Murid / Kas / Mapel → link admin */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 10,
        }}
      >
        <Link href="/admin/siswa" className="glass-card text-center" style={{ padding: 12, textDecoration: "none" }}>
          <div style={{ fontSize: 18, marginBottom: 4 }}>
            <i className="fa-solid fa-users" style={{ color: "#60a5fa" }} />
          </div>
          <div className="title-sub">MURID</div>
          <div className="card-val" style={{ fontSize: 18 }}>
            {list.length}
          </div>
          <div style={{ fontSize: 9, color: "#94a3b8" }}>
            L:{countL} · P:{countP}
          </div>
          <div style={{ fontSize: 8, color: "#60a5fa", marginTop: 6, fontWeight: 700 }}>
            Kelola →
          </div>
        </Link>

        <Link href="/admin/kas" className="glass-card text-center" style={{ padding: 12, textDecoration: "none" }}>
          <div style={{ fontSize: 18, marginBottom: 4 }}>
            <i className="fa-solid fa-sack-dollar" style={{ color: "#4ade80" }} />
          </div>
          <div className="title-sub">KAS</div>
          <div className="card-val" style={{ fontSize: 13, color: "#4ade80" }}>
            {formatRupiah(saldo)}
          </div>
          <div style={{ fontSize: 9, color: "#94a3b8" }}>
            Tagihan {formatRupiah(NOMINAL_KAS)}
          </div>
          <div style={{ fontSize: 8, color: "#4ade80", marginTop: 6, fontWeight: 700 }}>
            Kelola →
          </div>
        </Link>

        <Link href="/admin/absensi" className="glass-card text-center" style={{ padding: 12, textDecoration: "none" }}>
          <div style={{ fontSize: 18, marginBottom: 4 }}>
            <i className="fa-solid fa-clipboard-user" style={{ color: "#facc15" }} />
          </div>
          <div className="title-sub">ABSENSI</div>
          <div className="card-val" style={{ fontSize: 13 }}>
            12 bln
          </div>
          <div style={{ fontSize: 9, color: "#94a3b8" }}>Edit H/I/S/A</div>
          <div style={{ fontSize: 8, color: "#facc15", marginTop: 6, fontWeight: 700 }}>
            Kelola →
          </div>
        </Link>
      </div>

      {/* Kartu ringkas kas — mirip home */}
      <div className="glass-card">
        <div className="title-sub" style={{ marginBottom: 10 }}>
          RINGKASAN KAS KELAS
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          <div
            style={{
              background: "rgba(74,222,128,0.08)",
              border: "1px solid rgba(74,222,128,0.2)",
              borderRadius: 12,
              padding: 12,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700 }}>
              PEMASUKAN
            </div>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#4ade80" }}>
              {formatRupiah(masuk)}
            </div>
          </div>
          <div
            style={{
              background: "rgba(244,63,94,0.08)",
              border: "1px solid rgba(244,63,94,0.2)",
              borderRadius: 12,
              padding: 12,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700 }}>
              PENGELUARAN
            </div>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#f43f5e" }}>
              {formatRupiah(keluar)}
            </div>
          </div>
        </div>
        <Link
          href="/admin/kas"
          className="btn-action-light"
          style={{
            display: "block",
            textAlign: "center",
            marginTop: 12,
            textDecoration: "none",
          }}
        >
          Buka tabel kas & matriks bayar
        </Link>
      </div>

      {/* Pintasan kelola — setara “menu” home */}
      <div className="glass-card">
        <div className="title-sub" style={{ marginBottom: 10 }}>
          KELOLA DATA
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            {
              href: "/admin/siswa",
              icon: "fa-user-plus",
              title: "Data siswa",
              desc: "Tambah / edit / hapus anggota kelas",
            },
            {
              href: "/admin/absensi",
              icon: "fa-table",
              title: "Tabel absensi",
              desc: "Ubah H I S A per tanggal per anak",
            },
            {
              href: "/admin/kas",
              icon: "fa-check-double",
              title: "Status kas & log",
              desc: "Centang lunas per bulan + histori",
            },
            {
              href: "/admin/settings",
              icon: "fa-gear",
              title: "Pengaturan",
              desc: "Login admin & mode perbaikan",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="glass-card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                textDecoration: "none",
                margin: 0,
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "rgba(96,165,250,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#60a5fa",
                  flexShrink: 0,
                }}
              >
                <i className={`fa-solid ${item.icon}`} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 12, color: "#f8fafc" }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 10, color: "#94a3b8" }}>{item.desc}</div>
              </div>
              <i className="fa-solid fa-chevron-right" style={{ color: "#64748b", fontSize: 12 }} />
            </Link>
          ))}
        </div>
      </div>

      <p
        style={{
          textAlign: "center",
          fontSize: 9,
          color: "#64748b",
          padding: "8px 0 20px",
        }}
      >
        Tampilan sama seperti portal publik · bedanya data bisa diubah di sini
      </p>
    </>
  );
            }
