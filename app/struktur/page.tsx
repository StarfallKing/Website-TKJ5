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

type Officer = {
  nama?: string;
  role: string;
  color: string;
  icon: string;
};

function NodeCard({
  title,
  name,
  color,
  icon,
  size = "md",
}: {
  title: string;
  name: string;
  color: string;
  icon: string;
  size?: "sm" | "md" | "lg";
}) {
  const avatarSize = size === "lg" ? 64 : size === "sm" ? 44 : 56;
  const iconSize = size === "lg" ? 26 : size === "sm" ? 18 : 22;

  return (
    <div
      className="struktur-node"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        width: "100%",
        maxWidth: size === "lg" ? 200 : 160,
      }}
    >
      <div
        className="avatar-box"
        style={{
          width: avatarSize,
          height: avatarSize,
          borderColor: color,
          boxShadow: `0 0 16px ${color}66`,
        }}
      >
        <i
          className={`fa-solid ${icon}`}
          style={{ fontSize: iconSize, color }}
        />
      </div>
      <div
        className="role-card"
        style={{
          borderColor: `${color}55`,
          width: "100%",
          marginTop: 8,
          textAlign: "center",
        }}
      >
        <div
          className="person-name"
          style={{
            textAlign: "center",
            width: "100%",
            wordBreak: "break-word",
            lineHeight: 1.25,
          }}
        >
          {name}
        </div>
        <div
          className="role-badge"
          style={{ color, textAlign: "center", width: "100%" }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}

/** Node ringkas untuk HP (tanpa avatar besar) */
function MobileNode({
  title,
  name,
  color,
}: {
  title: string;
  name: string;
  color: string;
}) {
  return (
    <div
      className="glass-card"
      style={{
        padding: "10px 12px",
        textAlign: "center",
        borderColor: `${color}55`,
        minWidth: 0,
        flex: 1,
      }}
    >
      <div
        style={{
          fontSize: 9,
          fontWeight: 800,
          color,
          textTransform: "uppercase",
          letterSpacing: 0.4,
          marginBottom: 4,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#f8fafc",
          lineHeight: 1.3,
          wordBreak: "break-word",
        }}
      >
        {name}
      </div>
    </div>
  );
}

function VLine() {
  return (
    <div
      style={{
        width: 2,
        height: 18,
        background: "linear-gradient(180deg, #60a5fa, rgba(96,165,250,0.3))",
        margin: "0 auto",
        boxShadow: "0 0 8px rgba(96,165,250,0.4)",
      }}
    />
  );
}

function HPair({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
        width: "100%",
        position: "relative",
      }}
    >
      {left}
      {right}
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

  const desktopPairs: Officer[][] = [
    [
      {
        nama: ketua?.nama,
        role: "Ketua Kelas",
        color: "#eab308",
        icon: "fa-crown",
      },
      {
        nama: wakil?.nama,
        role: "Wakil Ketua",
        color: "#38bdf8",
        icon: "fa-user-shield",
      },
    ],
    [
      {
        nama: sek1?.nama,
        role: "Sekretaris 1",
        color: "#c084fc",
        icon: "fa-file-pen",
      },
      {
        nama: sek2?.nama,
        role: "Sekretaris 2",
        color: "#c084fc",
        icon: "fa-file-pen",
      },
    ],
    [
      {
        nama: ben1?.nama,
        role: "Bendahara 1",
        color: "#4ade80",
        icon: "fa-wallet",
      },
      {
        nama: ben2?.nama,
        role: "Bendahara 2",
        color: "#4ade80",
        icon: "fa-wallet",
      },
    ],
    [
      {
        nama: kes1?.nama,
        role: "Kesehatan 1",
        color: "#f43f5e",
        icon: "fa-heart-pulse",
      },
      {
        nama: kes2?.nama,
        role: "Kesehatan 2",
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

      {/* ========== MOBILE: node ringkas (referensi bagan) ========== */}
      <div className="struktur-mobile glass-card" style={{ padding: 14 }}>
        {/* Wali */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <MobileNode
            title="Wali Kelas"
            name="Shendy Nuria Feriansyah, S.Pd"
            color="#60a5fa"
          />
        </div>
        <VLine />

        <HPair
          left={
            <MobileNode
              title="Ketua Kelas"
              name={displayName(ketua?.nama)}
              color="#eab308"
            />
          }
          right={
            <MobileNode
              title="Wakil Ketua"
              name={displayName(wakil?.nama)}
              color="#38bdf8"
            />
          }
        />
        <VLine />

        <HPair
          left={
            <MobileNode
              title="Sekretaris 1"
              name={displayName(sek1?.nama)}
              color="#c084fc"
            />
          }
          right={
            <MobileNode
              title="Sekretaris 2"
              name={displayName(sek2?.nama)}
              color="#c084fc"
            />
          }
        />
        <VLine />

        <HPair
          left={
            <MobileNode
              title="Bendahara 1"
              name={displayName(ben1?.nama)}
              color="#4ade80"
            />
          }
          right={
            <MobileNode
              title="Bendahara 2"
              name={displayName(ben2?.nama)}
              color="#4ade80"
            />
          }
        />
        <VLine />

        <HPair
          left={
            <MobileNode
              title="Kesehatan 1"
              name={displayName(kes1?.nama)}
              color="#f43f5e"
            />
          }
          right={
            <MobileNode
              title="Kesehatan 2"
              name={displayName(kes2?.nama)}
              color="#f43f5e"
            />
          }
        />
        <VLine />

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "50%" }}>
            <MobileNode
              title="Keamanan"
              name={displayName(amn?.nama)}
              color="#fb923c"
            />
          </div>
        </div>
      </div>

      {/* ========== DESKTOP: tree + avatar (gambar 2, teks center) ========== */}
      <div
        className="struktur-desktop glass-card tree-wrapper"
        style={{
          display: "none",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          padding: "24px 16px",
        }}
      >
        {/* Wali */}
        <NodeCard
          title="Wali Kelas"
          name="Shendy Nuria Feriansyah, S.Pd"
          color="#60a5fa"
          icon="fa-user-tie"
          size="lg"
        />

        <div className="line-v" />
        <div className="branch-split" style={{ maxWidth: 420, margin: "0 auto" }}>
          <div className="branch-left" />
          <div className="branch-right" />
        </div>

        {desktopPairs.map((pair, idx) => (
          <div key={idx} style={{ width: "100%", maxWidth: 480 }}>
            <div
              className="tree-row"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
                justifyItems: "center",
                width: "100%",
              }}
            >
              {pair.map((o) => (
                <NodeCard
                  key={o.role}
                  title={o.role}
                  name={displayName(o.nama)}
                  color={o.color}
                  icon={o.icon}
                />
              ))}
            </div>
            {idx < desktopPairs.length - 1 && (
              <>
                <div className="line-v" style={{ margin: "0 auto" }} />
                <div
                  className="branch-split"
                  style={{ maxWidth: 420, margin: "0 auto" }}
                >
                  <div className="branch-left" />
                  <div className="branch-right" />
                </div>
              </>
            )}
          </div>
        ))}

        <div className="line-v" style={{ margin: "0 auto" }} />
        <div
          className="branch-split"
          style={{ maxWidth: 420, margin: "0 auto" }}
        >
          <div className="branch-left" />
          <div className="branch-right" />
        </div>

        {/* Keamanan di tengah */}
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <NodeCard
            title="Keamanan"
            name={displayName(amn?.nama)}
            color="#fb923c"
            icon="fa-shield-halved"
          />
        </div>
      </div>
    </>
  );
}
