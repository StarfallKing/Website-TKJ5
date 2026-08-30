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
  const [pillLeft, setPillLeft] = useState(0);
  const [dragging, setDragging] = useState(false);

  const activeIndex = Math.max(
    0,
    navItems.findIndex((item) => item.path === pathname)
  );

  function updatePill(index: number) {
    const btn = buttonsRef.current[index];
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    setPillLeft(rect.left - 1);
  }

  useEffect(() => {
    const t = setTimeout(() => updatePill(activeIndex), 50);
    const onResize = () => updatePill(activeIndex);
    window.addEventListener("resize", onResize);
    return () => {
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

  function onTouchMove(e: React.TouchEvent) {
    if (!dragging) return;
    setPillLeft(e.touches[0].clientX - 22);
  }

  function onTouchEnd(e: React.TouchEvent) {
    setDragging(false);
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
      <div
        className={`glass-liquid-pill ${dragging ? "dragging" : ""}`}
        style={{ left: `${pillLeft}px` }}
      />

      <div
        className="nav-dual-container"
        onTouchStart={() => setDragging(true)}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="bubble-nav">
          {navItems.slice(0, 3).map((item, i) => (
            <button
              key={item.path}
              ref={(el) => {
                buttonsRef.current[i] = el;
              }}
              className={`nav-btn ${pathname === item.path ? "active" : ""}`}
              onClick={() => router.push(item.path)}
            >
              <i className={`fa-solid ${item.icon}`} />
            </button>
          ))}
        </div>

        <div className="bubble-nav">
          {navItems.slice(3, 6).map((item, i) => (
            <button
              key={item.path}
              ref={(el) => {
                buttonsRef.current[i + 3] = el;
              }}
              className={`nav-btn ${pathname === item.path ? "active" : ""}`}
              onClick={() => router.push(item.path)}
            >
              <i className={`fa-solid ${item.icon}`} />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}