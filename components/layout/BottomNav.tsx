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
      setPillLeft(currentX - 24);
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
      {/* SVG Liquid Gooey Filter (Rahasia Efek Cair Menyatu ala Apple) */}
      <svg style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}>
        <filter id="liquid-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix 
            in="blur" 
            mode="matrix" 
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" 
            result="goo" 
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>

      {/* Gelembung Kaca Cair dengan Efek Pegas Framer Motion */}
      <motion.div
        className="glass-liquid-pill"
        style={{
          left: pillLeft !== null ? `${pillLeft}px` : "16px",
          position: "fixed",
          bottom: "28px",
          width: "48px",
          height: "44px",
          zIndex: 1000,
          pointerEvents: "none",
          filter: "url(#liquid-goo)", // Menerapkan efek lelehan cair
          background: "linear-gradient(135deg, rgba(56, 189, 248, 0.4), rgba(14, 165, 233, 0.2))",
          backdropFilter: "blur(20px) saturate(200%)",
          WebkitBackdropFilter: "blur(20px) saturate(200%)",
          border: "1.5px solid rgba(56, 189, 248, 0.7)",
          boxShadow: "0 0 30px rgba(56, 189, 248, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.6)",
          borderRadius: "999px",
        }}
        animate={{
          opacity: pillLeft !== null ? 1 : 0,
          scale: dragging ? 1.15 : 1,
        }}
        transition={
          dragging
            ? { duration: 0 }
            : { type: "spring", stiffness: 320, damping: 22 }
        }
      />

      <div
        className="nav-dual-container"
        style={{ touchAction: "pan-y" }}
        onTouchStart={onTouchStart}
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
