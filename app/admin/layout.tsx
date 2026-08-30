"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin";

  return (
    <div style={{ minHeight: "100vh", paddingBottom: isLogin ? 16 : 100 }}>
      {!isLogin && (
        <div className="glass-card" style={{ marginBottom: 12 }}>
          <div className="flex-between" style={{ marginBottom: 10 }}>
            <span className="title-sub">ADMIN PANEL X TKJ-5</span>
            <button
              className="btn-action-light"
              type="button"
              onClick={() => {
                sessionStorage.removeItem("admin-ok");
                router.push("/admin");
              }}
            >
              Logout
            </button>
          </div>
          <div className="filter-pills">
            <button
              className={`filter-btn ${pathname.includes("dashboard") ? "active" : ""}`}
              onClick={() => router.push("/admin/dashboard")}
            >
              Dashboard
            </button>
            <button
              className={`filter-btn ${pathname.includes("siswa") ? "active" : ""}`}
              onClick={() => router.push("/admin/siswa")}
            >
              Siswa
            </button>
            <button
              className={`filter-btn ${pathname.includes("/admin/kas") ? "active" : ""}`}
              onClick={() => router.push("/admin/kas")}
            >
              Kas
            </button>
            <button
              className="filter-btn"
              onClick={() => router.push("/")}
            >
              Lihat Web Publik
            </button>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}