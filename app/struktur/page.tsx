export default function StrukturPage() {
  return (
    <>
      {/* Judul */}
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

      {/* Widget periode */}
      <div className="flex-between" style={{ padding: "0 4px" }}>
        <div className="widget-side">
          <i className="fa-solid fa-calendar-check" style={{ color: "#60a5fa" }} />
          <span>PERIODE 2026/2027</span>
        </div>
        <div className="widget-side">
          <i className="fa-solid fa-users-gear" style={{ color: "#60a5fa" }} />
          <span>10 ANGGOTA INTI</span>
        </div>
      </div>

      {/* Tree struktur */}
      <div className="glass-card tree-wrapper">
        {/* Wali Kelas */}
        <div className="tree-node">
          <div className="avatar-box">
            <i className="fa-solid fa-user-tie" style={{ fontSize: "28px", color: "#60a5fa" }} />
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
              <i className="fa-solid fa-crown" style={{ fontSize: "26px", color: "#eab308" }} />
            </div>
            <div className="role-card" style={{ borderColor: "rgba(234,179,8,0.3)" }}>
              <div className="person-name">Irfan Dzaki Khoerulloh</div>
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
              <i className="fa-solid fa-user-shield" style={{ fontSize: "24px", color: "#38bdf8" }} />
            </div>
            <div className="role-card" style={{ borderColor: "rgba(56,189,248,0.3)" }}>
              <div className="person-name">Affan Assakha</div>
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
              <i className="fa-solid fa-file-pen" style={{ fontSize: "24px", color: "#38bdf8" }} />
            </div>
            <div className="role-card">
              <div className="person-name">Regina Yuniar</div>
              <div className="role-badge">Sekretaris 1</div>
            </div>
          </div>
          <div className="tree-node">
            <div className="avatar-box">
              <i className="fa-solid fa-file-pen" style={{ fontSize: "24px", color: "#38bdf8" }} />
            </div>
            <div className="role-card">
              <div className="person-name">Syavana Sabitul Azmi</div>
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
              <i className="fa-solid fa-wallet" style={{ fontSize: "24px", color: "#4ade80" }} />
            </div>
            <div className="role-card" style={{ borderColor: "rgba(74,222,128,0.3)" }}>
              <div className="person-name">Monicka Silvia</div>
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
              <i className="fa-solid fa-wallet" style={{ fontSize: "24px", color: "#4ade80" }} />
            </div>
            <div className="role-card" style={{ borderColor: "rgba(74,222,128,0.3)" }}>
              <div className="person-name">Muhammad Ihza Fahrezi</div>
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
              <i className="fa-solid fa-heart-pulse" style={{ fontSize: "24px", color: "#f43f5e" }} />
            </div>
            <div className="role-card" style={{ borderColor: "rgba(244,63,94,0.3)" }}>
              <div className="person-name">Fathan Wayfi Al Ayubi</div>
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
              <i className="fa-solid fa-heart-pulse" style={{ fontSize: "24px", color: "#f43f5e" }} />
            </div>
            <div className="role-card" style={{ borderColor: "rgba(244,63,94,0.3)" }}>
              <div className="person-name">Azzahra Putri</div>
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
              <i className="fa-solid fa-shield-halved" style={{ fontSize: "24px", color: "#fb923c" }} />
            </div>
            <div className="role-card" style={{ borderColor: "rgba(251,146,60,0.3)" }}>
              <div className="person-name">Muhammad Fauzan Assyakir Noto Pam</div>
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