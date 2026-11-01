"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const [pillStyle, setPillStyle] = useState<{ left: number; width: number } | null>(null);
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
    if (rect.width < 8) return;

    setPillStyle({
      left: rect.left,
      width: rect.width,
    });
  }

  useEffect(() => {
    // Update beberapa kali biar akurat
    const timers = [
      setTimeout(() => updatePill(activeIndex), 50),
      setTimeout(() => updatePill(activeIndex), 150),
      setTimeout(() => updatePill(activeIndex), 400),
    ];

    const onResize = () => updatePill(activeIndex);
    window.addEventListener("resize", onResize);

    return () => {
      timers.forEach(clearTimeout);
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

    if (diff > 12) {
      if (!dragging) setDragging(true);
      isSwiping.current = true;

      setPillStyle((prev) => ({
        left: currentX - (prev?.width ?? 44) / 2,
        width: prev?.width ?? 44,
      }));
    }
  }

  function onTouchEnd(e: React.TouchEvent) {
    setDragging(false);
    if (!isSwiping.current) return;

    const touchX = e.changedTouches[0].clientX;
    let closest = activeIndex;
    let minDist = Infinity;

    buttonsRef.current.forEach((btn, i) => {
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const dist = Math.abs(touchX - center);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });

    router.push(navItems[closest].path);
    updatePill(closest);
  }

  return (
    <>
      {/* Pill biru mengkilap */}
      <motion.div
        className="glass-liquid-pill"
        style={{
          left: pillStyle ? `${pillStyle.left}px` : "-100px",
          width: pillStyle ? `${pillStyle.width}px` : "44px",
          position: "fixed",
          bottom: "28px",
          height: "48px",
          borderRadius: "9999px",
          zIndex: 1000,
          pointerEvents: "none",
        }}
        animate={{
          opacity: pillStyle ? 1 : 0,
          scale: dragging ? 1.1 : 1,
        }}
        transition={
          dragging
            ? { duration: 0 }
            : { type: "spring", stiffness: 400, damping: 28 }
        }
      />

      {/* Navigasi dua bubble */}
      <div
        ref={containerRef}
        className="nav-dual-container"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Bubble Kiri */}
        <div className="bubble-nav">
          {navItems.slice(0, 3).map((item, i) => (
            <button
              key={item.path}
              ref={(el) => {
                buttonsRef.current[i] = el;
              }}
              type="button"
              className={`nav-btn ${pathname === item.path ? "active" : ""}`}
              onClick={() => {
                updatePill(i);
                router.push(item.path);
              }}
            >
              <i className={`fa-solid ${item.icon}`} />
            </button>
          ))}
        </div>

        {/* Bubble Kanan */}
        <div className="bubble-nav">
          {navItems.slice(3, 6).map((item, i) => (
            <button
              key={item.path}
              ref={(el) => {
                buttonsRef.current[i + 3] = el;
              }}
              type="button"
              className={`nav-btn ${pathname === item.path ? "active" : ""}`}
              onClick={() => {
                updatePill(i + 3);
                router.push(item.path);
              }}
            >
              <i className={`fa-solid ${item.icon}`} />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
