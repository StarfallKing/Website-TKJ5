"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  
  const [pillLeft, setPillLeft] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  
  const touchStartX = useRef(0);
  const isSwiping = useRef(false);

  const activeIndex = Math.max(
    0,
    navItems.findIndex((item) => item.path === pathname)
  );

  function updatePill(index: number) {
    const btn = buttonsRef.current[index];
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    if (rect.width > 0 || rect.left > 0) {
      setPillLeft(rect.left - 2);
    }
  }

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      updatePill(activeIndex);
    });

    const t = setTimeout(() => updatePill(activeIndex), 150);

    const onResize = () => updatePill(activeIndex);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, [activeIndex, pathname]);

  if (
    pathname?.startsWith("/siswa") ||
    pathname?.startsWith("/qris") ||
    pathname?.startsWith("/admin")
  ) {
    return null;
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    isSwiping.current = false;
  }

  function onTouchMove(e: React.TouchEvent) {
    const currentX = e.touches[0].clientX;
    const diff = Math.abs(currentX - touchStartX.current);

    if (diff > 10) {
      if (!dragging) setDragging(true);
      isSwiping.current = true;
      setPillLeft(currentX - 26);
    }
  }

  function onTouchEnd(e: React.TouchEvent) {
    setDragging(false);

    if (!isSwiping.current) return;

    const touchX = e.changedTouches[0].clientX;
    let closest = activeIndex;
    let min = Infinity;

    buttonsRef.current.forEach((btn, i) => {
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const dist = Math.abs(touchX - (rect.left + rect.width / 2));
      if (dist < min) {
        min = dist;
        closest = i;
      }
    });

    router.push(navItems[closest].path);
    updatePill(closest);
  }

  return (
    <>
      {/* Gelembung Liquid Pill Mengambang Hanya Muncul/Aktif Saat Digeser atau Bertransisi */}
      <div
        className="glass-liquid-pill"
        style={{
          position: "fixed",
          bottom: "22px",
          height: "44px",
          width: "48px",
          borderRadius: "24px",
          pointerEvents: "none",
          zIndex: 999,
          left: pillLeft !== null ? `${pillLeft}px` : "16px",
          opacity: dragging ? 1 : 0, // Hanya keliatan pekat saat di-swipe/geser biar efek cairnya dapet
          background: "rgba(56, 189, 248, 0.25)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          border: "1px solid rgba(56, 189, 248, 0.5)",
          boxShadow: "0 0 25px rgba(56, 189, 248, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.4)",
          transition: dragging ? "none" : "left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s ease",
        }}
      />

      <div
        className="nav-dual-container liquid-container"
        style={{ 
          touchAction: "pan-y",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "6px 10px",
          borderRadius: "36px",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="bubble-nav" style={{ display: "flex", gap: "6px" }}>
          {navItems.slice(0, 3).map((item, i) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.path}
                ref={(el) => {
                  buttonsRef.current[i] = el;
                }}
                type="button"
                className={`nav-btn ${isActive ? "active" : ""}`}
                onClick={() => {
                  updatePill(i);
                  router.push(item.path);
                }}
                style={{
                  background: isActive ? "rgba(56, 189, 248, 0.2)" : "transparent",
                  border: isActive ? "1px solid rgba(56, 189, 248, 0.4)" : "1px solid transparent",
                  borderRadius: "22px",
                  padding: "10px 16px",
                  cursor: "pointer",
                  position: "relative",
                  zIndex: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: isActive ? "0 0 15px rgba(56, 189, 248, 0.3)" : "none",
                  transition: "all 0.3s ease",
                }}
              >
                <i 
                  className={`fa-solid ${item.icon}`} 
                  style={{ 
                    color: isActive ? "#38bdf8" : "#94a3b8", 
                    fontSize: "16px",
                    transition: "color 0.3s ease" 
                  }} 
                />
              </button>
            );
          })}
        </div>

        <div className="bubble-nav" style={{ display: "flex", gap: "6px" }}>
          {navItems.slice(3, 6).map((item, i) => {
            const actualIndex = i + 3;
            const isActive = pathname === item.path;
            return (
              <button
                key={item.path}
                ref={(el) => {
                  buttonsRef.current[actualIndex] = el;
                }}
                type="button"
                className={`nav-btn ${isActive ? "active" : ""}`}
                onClick={() => {
                  updatePill(actualIndex);
                  router.push(item.path);
                }}
                style={{
                  background: isActive ? "rgba(56, 189, 248, 0.2)" : "transparent",
                  border: isActive ? "1px solid rgba(56, 189, 248, 0.4)" : "1px solid transparent",
                  borderRadius: "22px",
                  padding: "10px 16px",
                  cursor: "pointer",
                  position: "relative",
                  zIndex: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: isActive ? "0 0 15px rgba(56, 189, 248, 0.3)" : "none",
                  transition: "all 0.3s ease",
                }}
              >
                <i 
                  className={`fa-solid ${item.icon}`} 
                  style={{ 
                    color: isActive ? "#38bdf8" : "#94a3b8", 
                    fontSize: "16px",
                    transition: "color 0.3s ease" 
                  }} 
                />
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
  
