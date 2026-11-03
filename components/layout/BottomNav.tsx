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
    if (rect.width > 0) {
      setPillLeft(rect.left);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => updatePill(activeIndex), 100);
    const onResize = () => updatePill(activeIndex);
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(timer);
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
      setDragging(true);
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
    <div className="bottom-nav-root">
      {/* Pill yang bergerak */}
      {pillLeft !== null && (
        <div
          className="glass-liquid-pill-wrapper"
          style={{
            left: `${pillLeft}px`,
            transition: dragging ? "none" : "left 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <LiquidGlass
            displacementScale={55}
            blurAmount={0.1}
            saturation={140}
            aberrationIntensity={1.8}
            elasticity={0.35}
            cornerRadius={999}
            padding="0"
            style={{ width: 44, height: 44 }}
          >
            <div style={{ width: "100%", height: "100%", borderRadius: 999, background: "rgba(255,255,255,0.15)" }} />
          </LiquidGlass>
        </div>
      )}

      {/* 2 Container Pil */}
      <div
        className="nav-dual-container"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Pil Kiri */}
        <div className="bubble-nav">
          <LiquidGlass
            displacementScale={40}
            blurAmount={0.22}
            saturation={120}
            aberrationIntensity={1.4}
            elasticity={0.15}
            cornerRadius={999}
            padding="0"
            style={{ width: "100%", height: "100%" }}
          >
            <div className="bubble-inner">
              {navItems.slice(0, 3).map((item, i) => (
                <button
                  key={item.path}
                  ref={(el) => { buttonsRef.current[i] = el; }}
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
        </div>

        {/* Pil Kanan */}
        <div className="bubble-nav">
          <LiquidGlass
            displacementScale={40}
            blurAmount={0.22}
            saturation={120}
            aberrationIntensity={1.4}
            elasticity={0.15}
            cornerRadius={999}
            padding="0"
            style={{ width: "100%", height: "100%" }}
          >
            <div className="bubble-inner">
              {navItems.slice(3, 6).map((item, i) => (
                <button
                  key={item.path}
                  ref={(el) => { buttonsRef.current[i + 3] = el; }}
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
      </div>
    </div>
  );
            }
