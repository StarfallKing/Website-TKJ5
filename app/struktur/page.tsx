"use client";

import { useAppData } from "@/lib/AppDataContext";

function displayName(nama?: string) {
  if (!nama) return "—";
  return nama
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function matchRole(role: string | undefined, target: string) {
  return (role || "").trim() === target;
}

type NodeProps = {
  title: string;
  name: string;
  color: string;
  icon: string;
  size?: "sm" | "md" | "lg";
};

function OrgNode({ title, name, color, icon, size = "md" }: NodeProps) {
  const isLg = size === "lg";
  const isSm = size === "sm";
  const avatar = isLg ? 56 : isSm ? 40 : 48;
  const iconPx = isLg ? 24 : isSm ? 16 : 20;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        width: "100%",
        maxWidth: isLg ? 220 : isSm ? 140 : 170,
        zIndex: 2,
      }}
    >
      {/* Icon circle */}
      <div
        style={{
          width: avatar,
          height: avatar,
          borderRadius: "50%",
          border: `2.5px solid ${color}`,
          background: "rgba(15, 23, 42, 0.95)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 18px ${color}66, inset 0 1px 2px rgba(255,255,255,0.25)`,
          flexShrink: 0,
        }}
      >
        <i
          className={`fa-solid ${icon}`}
          style={{ fontSize: iconPx, color }}
        />
      </div>

      {/* Name badge */}
      <div
        style={{
          marginTop: 8,
          width: "100%",
          background: "rgba(15, 23, 42, 0.92)",
          border: `1.5px solid ${color}66`,
          borderRadius: 12,
          padding: isSm ? "6px 8px" : "8px 10px",
          boxShadow: "0 6px 16px rgba(0,0,0,0.45), inset 0 1px 1px rgba(255,255,255,0.12)",
        }}
      >
        <div
          style={{
            fontSize: isSm ? 10 : 11,
            fontWeight: 700,
            color: "#f8fafc",
            lineHeight: 1.25,
            wordBreak: "break-word",
            textAlign: "center",
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: isSm ? 8 : 9,
            fontWeight: 800,
            color,
            textTransform: "uppercase",
            letterSpacing: 0.4,
            marginTop: 3,
            textAlign: "center",
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}

/** Garis vertikal pendek */
function Spine({ h = 20 }: { h?: number }) {
  return (
    <div
      style={{
        width: 2,
        height: h,
        background: "linear-gradient(180deg, #60a5fa, rgba(96,165,250,0.35))",
        margin: "0 auto",
        boxShadow: "0 0 8px rgba(96,165,250,0.45)",
        flexShrink: 0,
      }}
    />
  );
}

/**
 * Bar horizontal + 2 “kaki” ke kiri/kanan
 * Membuat garis T yang benar-benar nyambung ke node di bawahnya
 */
function BranchBar() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 360,
        height: 22,
        margin: "0 auto",
      }}
    >
      {/* batang horizontal */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "12%",
          right: "12%",
          height: 2,
          background: "#60a5fa",
          boxShadow: "0 0 8px rgba(96,165,250,0.5)",
        }}
      />
      {/* kaki kiri */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "12%",
          width: 2,
          height: 22,
          background: "#60a5fa",
          boxShadow: "0 0 6px rgba(96,165,250,0.4)",
        }}
      />
      {/* kaki kanan */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: "12%",
          width: 2,
          height: 22,
          background: "#60a5fa",
          boxShadow: "0 0 6px rgba(96,165,250,0.4)",
        }}
      />
    </div>
  );
}

function PairRow({
  left,
  right,
  compact,
}: {
  left: NodeProps;
  right: NodeProps;
  compact?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: compact ? 12 : 28,
        width: "100%",
        maxWidth: compact ? 340 : 420,
        margin: "0 auto",
        justifyItems: "center",
        alignItems: "start",
      }}
    >
      <OrgNode {...left} size={compact ? "sm" : "md"} />
      <OrgNode {...right} size={compact ? "sm" : "md"} />
    </div>
  );
}

export default function StrukturPage() {
  const { students } = useAppData();
  const officers = students.filter((s) => s.role);

  const ketua = officers.find((s) => matchRole(s.role, "Ketua Kelas"));
  const wakil = officers.find((s) => matchRole(s.role, "Wakil Ketua"));
  const sek1 = officers.find((s) => matchRole(s.role, "Sekretaris 1"));
  const sek2 = officers.find((s) => matchRole(s.role, "Sekretaris 2"));
  const ben1 = officers.find((s) => matchRole(s.role, "Bendahara 1"));
  const ben2 = officers.find((s) => matchRole(s.role, "Bendahara 2"));
  const kes1 = officers.find((s) => matchRole(s.role, "Kesehatan 1"));
  const kes2 = officers.find((s) => matchRole(s.role, "Kesehatan 2"));
  const amn = officers.find((s) => matchRole(s.role, "Keamanan"));

  const pairs: [NodeProps, NodeProps][] = [
    [
      {
        title: "Ketua Kelas",
        name: displayName(ketua?.nama),
        color: "#eab308",
        icon: "fa-crown",
      },
      {
        title: "Wakil Ketua",
        name: displayName(wakil?.nama),
        color: "#38bdf8",
        icon: "fa-user-shield",
      },
    ],
    [
      {
        title: "Sekretaris 1",
        name: displayName(sek1?.nama),
        color: "#c084fc",
        icon: "fa-file-pen",
      },
      {
        title: "Sekretaris 2",
        name: displayName(sek2?.nama),
        color: "#c084fc",
        icon: "fa-file-pen",
      },
    ],
    [
      {
        title: "Bendahara 1",
        name: displayName(ben1?.nama),
        color: "#4ade80",
        icon: "fa-wallet",
      },
      {
        title: "Bendahara 2",
        name: displayName(ben2?.nama),
        color: "#4ade80",
        icon: "fa-wallet",
      },
    ],
    [
      {
        title: "Kesehatan 1",
        name: displayName(kes1?.nama),
        color: "#f43f5e",
        icon: "fa-heart-pulse",
      },
      {
        title: "Kesehatan 2",
        name: displayName(kes2?.nama),
        color: "#f43f5e",
        icon: "fa-heart-pulse",
      },
    ],
  ];

  return (
    <>
      {/* Header */}
      <div
        className="glass-card text-center"
        style={{ display: "flex", flexDirection: "column", gap: 4 }}
      >
        <div className="title-sub">STRUKTUR KEPENGURUSAN X TKJ–5</div>
        <p
          style={{
            fontSize: 12,
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

      {/* ========== MOBILE ========== */}
      <div
        className="struktur-mobile glass-card"
        style={{
          padding: "18px 12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <OrgNode
          title="Wali Kelas"
          name="Shendy Nuria Feriansyah, S.Pd"
          color="#60a5fa"
          icon="fa-user-tie"
          size="md"
        />
        <Spine h={16} />
        <BranchBar />

        {pairs.map((pair, i) => (
          <div key={i} style={{ width: "100%" }}>
            <PairRow left={pair[0]} right={pair[1]} compact />
            <Spine h={16} />
            {i < pairs.length - 1 ? <BranchBar /> : null}
          </div>
        ))}

        {/* Keamanan di tengah */}
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <OrgNode
            title="Keamanan"
            name={displayName(amn?.nama)}
            color="#fb923c"
            icon="fa-shield-halved"
            size="sm"
          />
        </div>
      </div>

      {/* ========== DESKTOP (lebih besar, tidak mengecil) ========== */}
      <div
        className="struktur-desktop glass-card"
        style={{
          display: "none",
          flexDirection: "column",
          alignItems: "center",
          padding: "28px 20px 32px",
        }}
      >
        <OrgNode
          title="Wali Kelas"
          name="Shendy Nuria Feriansyah, S.Pd"
          color="#60a5fa"
          icon="fa-user-tie"
          size="lg"
        />
        <Spine h={24} />
        <BranchBar />

        {pairs.map((pair, i) => (
          <div key={i} style={{ width: "100%" }}>
            <PairRow left={pair[0]} right={pair[1]} />
            <Spine h={24} />
            {i < pairs.length - 1 ? <BranchBar /> : null}
          </div>
        ))}

        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <OrgNode
            title="Keamanan"
            name={displayName(amn?.nama)}
            color="#fb923c"
            icon="fa-shield-halved"
            size="md"
          />
        </div>
      </div>
    </>
  );
            }
