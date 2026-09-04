"use client";

import { useAppData } from "@/lib/AppDataContext";

function displayName(nama?: string) {
  if (!nama) return "—";
  // Title Case sederhana biar mirip tampilan bagan
  return nama
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function StrukturPage() {
  const { students } = useAppData();
  const officers = students.filter((s) => s.role);

  const ketua = officers.find((s) => s.role === "Ketua Kelas");
  const wakil = officers.find((s) => s.role === "Wakil Ketua");
  const sek1 = officers.find((s) => s.role === "Sekretaris 1");
  const sek2 = officers.find((s) => s.role === "Sekretaris 2");
  const ben1 = officers.find((s) => s.role === "Bendahara 1");
  const ben2 = officers.find((s) => s.role === "Bendahara 2");
  const kes1 = officers.find((s) => s.role === "Kesehatan 1");
  const kes2 = officers.find((s) => s.role === "Kesehatan 2");
  const amn = officers.find((s) => s.role === "Keamanan");

  return (
    <>
      <div
        className="glass-card text-center"
        style={{ display: "flex", flexDirection: "column", gap: "4px" }}
      >
        <div className="title-sub">STRUKTUR KEPENGURUSAN X TKJ–5</div>
        <p
          style={{
            fontSize: "12px",
            color: "#ffffff",
            fontWeight: 700,
            lineHeight: 1.4,
          }}
        >
          Nakhoda & Penggerak Utama Generasi Komputer Jaringan
        </p>
      </div>

      <div className="flex-between" style={{ padding: "0 4px" }}>
        <div className="widget-side">
          <i className="fa-solid fa-calendar-check" style={{ color: "#60a5fa" }} />
          <span>PERIODE 2026/2027</span>
        </div>
        <div className="widget-side">
          <i className="fa-solid fa-users-gear" style={{ color: "#60a5fa" }} />
          <span>{officers.length} ANGGOTA INTI</span>
        </div>
      </div>

      <div className="glass-card tree-wrapper">
        {/* Wali Kelas — tetap hardcode */}
        <div className="tree-node">
          <div className="avatar-box">
            <i
              className="fa-solid fa-user-tie"
              style={{ fontSize: "28px", color: "#60a5fa" }}
            />
          </div>
          <div className="role-card">
            <div className="person-name">Shendy Nuria Feriansyah, S.Pd</div>
            <div className="role-badge">Wali Kelas</div>
          </div>
        </div>

        <div className="line-v" />
        <div className="branch-split">
          <div className="branch-left" />
          <div className="branch-right" />
        </div>

        {/* Ketua & Wakil */}
        <div className="tree-row">
          <div className="tree-node">
            <div
              className="avatar-box"
              style={{
                borderColor: "#eab308",
                boxShadow: "0 0 16px rgba(234,179,8,0.4)",
              }}
            >
              <i
                className="fa-solid fa-crown"
                style={{ fontSize: "26px", color: "#eab308" }}
              />
            </div>
            <div
              className="role-card"
              style={{ borderColor: "rgba(234,179,8,0.3)" }}
            >
              <div className="person-name">{displayName(ketua?.nama)}</div>
              <div className="role-badge" style={{ color: "#eab308" }}>
                Ketua Kelas
              </div>
            </div>
          </div>
          <div className="tree-node">
            <div
              className="avatar-box"
              style={{
                borderColor: "#38bdf8",
                boxShadow: "0 0 16px rgba(56,189,248,0.4)",
              }}
            >
              <i
                className="fa-solid fa-user-shield"
                style={{ fontSize: "24px", color: "#38bdf8" }}
              />
            </div>
            <div
              className="role-card"
              style={{ borderColor: "rgba(56,189,248,0.3)" }}
            >
              <div className="person-name">{displayName(wakil?.nama)}</div>
              <div className="role-badge" style={{ color: "#38bdf8" }}>
                Wakil Ketua
              </div>
            </div>
          </div>
        </div>

        <div className="line-v" />
        <div className="branch-split">
          <div className="branch-left" />
          <div className="branch-right" />
        </div>

        {/* Sekretaris */}
        <div className="tree-row">
          <div className="tree-node">
            <div className="avatar-box">
              <i
                className="fa-solid fa-file-pen"
                style={{ fontSize: "24px", color: "#38bdf8" }}
              />
            </div>
            <div className="role-card">
              <div className="person-name">{displayName(sek1?.nama)}</div>
              <div className="role-badge">Sekretaris 1</div>
            </div>
          </div>
          <div className="tree-node">
            <div className="avatar-box">
              <i
                className="fa-solid fa-file-pen"
                style={{ fontSize: "24px", color: "#38bdf8" }}
              />
            </div>
            <div className="role-card">
              <div className="person-name">{displayName(sek2?.nama)}</div>
              <div className="role-badge">Sekretaris 2</div>
            </div>
          </div>
        </div>

        <div className="line-v" />
        <div className="branch-split">
          <div className="branch-left" />
          <div className="branch-right" />
        </div>

        {/* Bendahara */}
        <div className="tree-row">
          <div className="tree-node">
            <div
              className="avatar-box"
              style={{
                borderColor: "#4ade80",
                boxShadow: "0 0 16px rgba(74,222,128,0.4)",
              }}
            >
              <i
                className="fa-solid fa-wallet"
                style={{ fontSize: "24px", color: "#4ade80" }}
              />
            </div>
            <div
              className="role-card"
              style={{ borderColor: "rgba(74,222,128,0.3)" }}
            >
              <div className="person-name">{displayName(ben1?.nama)}</div>
              <div className="role-badge" style={{ color: "#4ade80" }}>
                Bendahara 1
              </div>
            </div>
          </div>
          <div className="tree-node">
            <div
              className="avatar-box"
              style={{
                borderColor: "#4ade80",
                boxShadow: "0 0 16px rgba(74,222,128,0.4)",
              }}
            >
              <i
                className="fa-solid fa-wallet"
                style={{ fontSize: "24px", color: "#4ade80" }}
              />
            </div>
            <div
              className="role-card"
              style={{ borderColor: "rgba(74,222,128,0.3)" }}
            >
              <div className="person-name">{displayName(ben2?.nama)}</div>
              <div className="role-badge" style={{ color: "#4ade80" }}>
                Bendahara 2
              </div>
            </div>
          </div>
        </div>

        <div className="line-v" />
        <div className="branch-split">
          <div className="branch-left" />
          <div className="branch-right" />
        </div>

        {/* Kesehatan */}
        <div className="tree-row">
          <div className="tree-node">
            <div
              className="avatar-box"
              style={{
                borderColor: "#f43f5e",
                boxShadow: "0 0 16px rgba(244,63,94,0.4)",
              }}
            >
              <i
                className="fa-solid fa-heart-pulse"
                style={{ fontSize: "24px", color: "#f43f5e" }}
              />
            </div>
            <div
              className="role-card"
              style={{ borderColor: "rgba(244,63,94,0.3)" }}
            >
              <div className="person-name">{displayName(kes1?.nama)}</div>
              <div className="role-badge" style={{ color: "#f43f5e" }}>
                Kesehatan 1
              </div>
            </div>
          </div>
          <div className="tree-node">
            <div
              className="avatar-box"
              style={{
                borderColor: "#f43f5e",
                boxShadow: "0 0 16px rgba(244,63,94,0.4)",
              }}
            >
              <i
                className="fa-solid fa-heart-pulse"
                style={{ fontSize: "24px", color: "#f43f5e" }}
              />
            </div>
            <div
              className="role-card"
              style={{ borderColor: "rgba(244,63,94,0.3)" }}
            >
              <div className="person-name">{displayName(kes2?.nama)}</div>
              <div className="role-badge" style={{ color: "#f43f5e" }}>
                Kesehatan 2
              </div>
            </div>
          </div>
        </div>

        <div className="line-v" />
        <div className="branch-split">
          <div className="branch-left" />
          <div className="branch-right" />
        </div>

        {/* Keamanan */}
        <div className="tree-row">
          <div className="tree-node">
            <div
              className="avatar-box"
              style={{
                borderColor: "#fb923c",
                boxShadow: "0 0 16px rgba(251,146,60,0.4)",
              }}
            >
              <i
                className="fa-solid fa-shield-halved"
                style={{ fontSize: "24px", color: "#fb923c" }}
              />
            </div>
            <div
              className="role-card"
              style={{ borderColor: "rgba(251,146,60,0.3)" }}
            >
              <div className="person-name">{displayName(amn?.nama)}</div>
              <div className="role-badge" style={{ color: "#fb923c" }}>
                Keamanan
              </div>
            </div>
          </div>
          <div className="tree-node" style={{ visibility: "hidden" }} />
        </div>
      </div>
    </>
  );
                }
