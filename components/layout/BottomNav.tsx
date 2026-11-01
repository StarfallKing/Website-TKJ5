"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { path: "/", icon: "fa-house" },
  { path: "/struktur", icon: "fa-sitemap" },
  { path: "/direktori", icon: "fa-users" },
  { path: "/absensi", icon: "fa-clipboard-user" },
  { path: "/kas", icon: "fa-sack-dollar" },
  { path: "/jadwal", icon: "fa-file-signature" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const activeIndex = Math.max(
    0,
    navItems.findIndex((item) => item.path === pathname)
  );

  if (
    pathname?.startsWith("/siswa") ||
    pathname?.startsWith("/qris") ||
    pathname?.startsWith("/admin")
  ) {
    return null;
  }

  return (
    <div className="nav-dual-container" style={{ touchAction: "pan-y" }}>
      {/* Kapsul Kiri (3 Menu Pertama) */}
      <div className="bubble-nav liquid-container" style={{ position: "relative", display: "flex", gap: "6px", padding: "6px", borderRadius: "32px" }}>
        {navItems.slice(0, 3).map((item, i) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.path}
              type="button"
              className={`nav-btn ${isActive ? "active" : ""}`}
              onClick={() => router.push(item.path)}
              style={{ position: "relative", zIndex: 2, background: "transparent", border: "none", cursor: "pointer", padding: "10px 16px" }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeLiquidPill"
                  className="liquid-pill-bg"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(56, 189, 248, 0.25)",
                    border: "1px solid rgba(56, 189, 248, 0.5)",
                    borderRadius: "24px",
                    boxShadow: "0 0 20px rgba(56, 189, 248, 0.35)",
                    zIndex: -1,
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              <i className={`fa-solid ${item.icon}`} style={{ color: isActive ? "#38bdf8" : "#94a3b8", fontSize: "16px" }} />
            </button>
          );
        })}
      </div>

      {/* Kapsul Kanan (3 Menu Terakhir) */}
      <div className="bubble-nav liquid-container" style={{ position: "relative", display: "flex", gap: "6px", padding: "6px", borderRadius: "32px" }}>
        {navItems.slice(3, 6).map((item, i) => {
          const actualIndex = i + 3;
          const isActive = pathname === item.path;
          return (
            <button
              key={item.path}
              type="button"
              className={`nav-btn ${isActive ? "active" : ""}`}
              onClick={() => router.push(item.path)}
              style={{ position: "relative", zIndex: 2, background: "transparent", border: "none", cursor: "pointer", padding: "10px 16px" }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeLiquidPill"
                  className="liquid-pill-bg"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(56, 189, 248, 0.25)",
                    border: "1px solid rgba(56, 189, 248, 0.5)",
                    borderRadius: "24px",
                    boxShadow: "0 0 20px rgba(56, 189, 248, 0.35)",
                    zIndex: -1,
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              <i className={`fa-solid ${item.icon}`} style={{ color: isActive ? "#38bdf8" : "#94a3b8", fontSize: "16px" }} />
            </button>
          );
        })}
      </div>
    </div>
  );
                        }
