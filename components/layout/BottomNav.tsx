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
  
  // Menggunakan null sebagai nilai awal agar tidak 'nyasar' di 0px saat iOS layout belum siap
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
    // Validasi agar Safari iOS tidak mengembalikan nilai 0 saat render awal
    if (rect.width > 0 || rect.left > 0) {
      setPillLeft(rect.left - 1);
    }
  }

  useEffect(() => {
    // Memaksa browser menghitung posisi layout setelah frame pertama digambar
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
      <div
        className={`glass-liquid-pill ${dragging ? "dragging" : ""}`}
        style={{
          left: pillLeft !== null ? `${pillLeft}px` : "16px",
          opacity: pillLeft !== null ? 1 : 0, // Fade in saat posisi tepat terdeteksi
          transition: dragging ? "none" : "left 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease",
        }}
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
