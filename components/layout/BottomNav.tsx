"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LiquidGlass from "liquid-glass-react";

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
      setPillLeft(rect.left - 1);
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
      setPillLeft(currentX - 22);
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
      {/* ===== LIQUID GLASS PILL (yang bergerak) ===== */}
      {pillLeft !== null && (
        <div
          className="glass-liquid-pill-wrapper"
          style={{
            left: `${pillLeft}px`,
            transition: dragging
              ? "none"
              : "left 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <LiquidGlass
            displacementScale={58}
            blurAmount={0.11}
            saturation={145}
            aberrationIntensity={1.9}
            elasticity={0.38}
            cornerRadius={999}
            padding="0"
            style={{ width: 44, height: 44 }}
          >
            <div className="w-full h-full rounded-full bg-white/15" />
          </LiquidGlass>
        </div>
      )}

      {/* ===== 2 CONTAINER PIL ===== */}
      <div
        className="nav-dual-container"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Pil Kiri (Home, Struktur, Direktori) */}
        <LiquidGlass
          displacementScale={42}
          blurAmount={0.23}
          saturation={125}
          aberrationIntensity={1.5}
          elasticity={0.18}
          cornerRadius={999}
          padding="4px 6px"
          style={{ width: 156, height: 52 }}
        >
          <div className="flex justify-between items-center w-full h-full px-1">
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
        </LiquidGlass>

        {/* Pil Kanan (Absensi, Kas, Jadwal) */}
        <LiquidGlass
          displacementScale={42}
          blurAmount={0.23}
          saturation={125}
          aberrationIntensity={1.5}
          elasticity={0.18}
          cornerRadius={999}
          padding="4px 6px"
          style={{ width: 156, height: 52 }}
        >
          <div className="flex justify-between items-center w-full h-full px-1">
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
        </LiquidGlass>
      </div>
    </>
  );
}
