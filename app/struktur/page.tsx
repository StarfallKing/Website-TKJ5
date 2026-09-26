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

  // Desktop jauh lebih besar; mobile tetap kompak
  const avatar = isLg ? 78 : isSm ? 42 : 56;
  const iconPx = isLg ? 30 : isSm ? 17 : 22;
  const maxW = isLg ? 280 : isSm ? 148 : 200;
  const nameFs = isLg ? 14 : isSm ? 10 : 12;
  const roleFs = isLg ? 11 : isSm ? 8 : 9;
  const pad = isLg ? "12px 14px" : isSm ? "6px 8px" : "9px 11px";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        width: "100%",
        maxWidth: maxW,
        zIndex: 2,
      }}
    >
      <div
        style={{
          width: avatar,
          height: avatar,
          borderRadius: "50%",
          border: `3px solid ${color}`,
          background: "rgba(15, 23, 42, 0.95)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 22px ${color}66, inset 0 1px 2px rgba(255,255,255,0.25)`,
          flexShrink: 0,
        }}
      >
        <i
          className={`fa-solid ${icon}`}
          style={{ fontSize: iconPx, color }}
        />
      </div>

      <div
        style={{
          marginTop: 10,
          width: "100%",
          background: "rgba(15, 23, 42, 0.92)",
          border: `1.5px solid ${color}66`,
          borderRadius: 14,
          padding: pad,
          boxShadow:
            "0 8px 20px rgba(0,0,0,0.45), inset 0 1px 1px rgba(255,255,255,0.12)",
        }}
      >
        <div
          style={{
            fontSize: nameFs,
            fontWeight: 700,
            color: "#f8fafc",
            lineHeight: 1.3,
            wordBreak: "break-word",
            textAlign: "center",
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: roleFs,
            fontWeight: 800,
            color,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginTop: 4,
            textAlign: "center",
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}

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

/** Garis T — lebar menyesuaikan mode (mobile / desktop) */
function BranchBar({ wide }: { wide?: boolean }) {
  // wide = desktop → kaki lebih ke tepi supaya nyambung ke node yang melebar
  const side = wide ? "8%" : "14%";
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: wide ? 640 : 340,
        height: wide ? 28 : 20,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: side,
          right: side,
          height: 2,
          background: "#60a5fa",
          boxShadow: "0 0 8px rgba(96,165,250,0.5)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: side,
          width: 2,
          height: "100%",
          background: "#60a5fa",
          boxShadow: "0 0 6px rgba(96,165,250,0.4)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: side,
          width: 2,
          height: "100%",
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
        // Desktop: gap besar supaya tidak dempet di tengah
        gap: compact ? 14 : 64,
        width: "100%",
        maxWidth: compact ? 340 : 680,
        margin: "0 auto",
        justifyItems: "center",
        alignItems: "start",
        padding: compact ? "0 4px" : "0 12px",
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

      {/* MOBILE — kompak */}
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

      {/* DESKTOP — besar + melebar kiri-kanan */}
      <div
        className="struktur-desktop glass-card"
        style={{
          display: "none",
          flexDirection: "column",
          alignItems: "center",
          padding: "36px 24px 40px",
          width: "100%",
        }}
      >
        <OrgNode
          title="Wali Kelas"
          name="Shendy Nuria Feriansyah, S.Pd"
          color="#60a5fa"
          icon="fa-user-tie"
          size="lg"
        />
        <Spine h={28} />
        <BranchBar wide />

        {pairs.map((pair, i) => (
          <div key={i} style={{ width: "100%" }}>
            <PairRow left={pair[0]} right={pair[1]} />
            <Spine h={28} />
            {i < pairs.length - 1 ? <BranchBar wide /> : null}
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
