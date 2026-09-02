"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import AdminBottomNav from "@/components/layout/AdminBottomNav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin";

  useEffect(() => {
    if (isLogin) return;
    if (sessionStorage.getItem("admin-ok") !== "1") {
      router.replace("/admin");
    }
  }, [isLogin, router, pathname]);

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Bar atas admin + gear settings kiri */}
      <div className="glass-card flex-between" style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link
            href="/admin/settings"
            title="Settings"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(96,165,250,0.15)",
              color: "#60a5fa",
              textDecoration: "none",
            }}
          >
            <i className="fa-solid fa-gear" />
          </Link>
          <div>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "#94a3b8",
                letterSpacing: 0.4,
              }}
            >
              WEBSITE RESMI KELAS
            </div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#60a5fa" }}>
              ADMIN PANEL X TKJ-5
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <Link href="/" className="btn-action-light" style={{ fontSize: 10 }}>
            Publik
          </Link>
          <button
            type="button"
            className="btn-action-light"
            style={{ fontSize: 10 }}
            onClick={() => {
              sessionStorage.removeItem("admin-ok");
              router.replace("/admin");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {children}
      <AdminBottomNav />
    </div>
  );
}
