"use client";

import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const router = useRouter();

  function logout() {
    sessionStorage.removeItem("admin-ok");
    sessionStorage.removeItem("admin-user");
    sessionStorage.removeItem("admin-last");
    router.replace("/admin");
  }

  return (
    <div
      className="glass-card"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        padding: "10px 12px",
        marginBottom: 4,
      }}
    >
      <div>
        <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700 }}>
          PANEL ADMIN
        </div>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#60a5fa" }}>
          Portal X TKJ-5
        </div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button
          type="button"
          className="btn-action-light"
          style={{ fontSize: 10 }}
          onClick={() => window.open("/", "_blank")}
        >
          <i className="fa-solid fa-arrow-up-right-from-square" /> Publik
        </button>
        <button
          type="button"
          className="btn-action-light"
          style={{ fontSize: 10, color: "#f43f5e" }}
          onClick={logout}
        >
          <i className="fa-solid fa-right-from-bracket" /> Logout
        </button>
      </div>
    </div>
  );
}
