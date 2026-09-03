"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const LEFT = [
  { href: "/admin/dashboard", icon: "fa-gauge" },
  { href: "/admin/struktur", icon: "fa-sitemap" },
];
const MID = [
  { href: "/admin/siswa", icon: "fa-users" },
  { href: "/admin/absensi", icon: "fa-clipboard-user" },
  { href: "/admin/kas", icon: "fa-sack-dollar" },
];
const RIGHT = [
  { href: "/admin/jadwal", icon: "fa-calendar-days" },
  { href: "/admin/settings", icon: "fa-gear" },
];
const ALL = [...LEFT, ...MID, ...RIGHT];

export default function AdminBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pillLeft, setPillLeft] = useState(0);
  const [dragging, setDragging] = useState(false);

  if (!pathname || pathname === "/admin") return null;

  const active = Math.max(
    0,
    ALL.findIndex((i) => pathname.startsWith(i.href))
  );

  function snap(i: number) {
    const el = refs.current[i];
    if (el) {
      const r = el.getBoundingClientRect();
      setPillLeft(r.left + r.width / 2 - 22);
    }
    router.push(ALL[i].href);
  }

  useEffect(() => {
    const el = refs.current[active];
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPillLeft(r.left + r.width / 2 - 22);
  }, [active, pathname]);

  function onTouchEnd(e: React.TouchEvent) {
    setDragging(false);
    const x = e.changedTouches[0].clientX;
    let best = active;
    let min = Infinity;
    refs.current.forEach((btn, i) => {
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      const d = Math.abs(x - (r.left + r.width / 2));
      if (d < min) {
        min = d;
        best = i;
      }
    });
    snap(best);
  }

  function bubble(
    items: { href: string; icon: string }[],
    offset: number,
    width: number
  ) {
    return (
      <div
        className="bubble-nav"
        style={{ width }}
        onTouchStart={() => setDragging(true)}
        onTouchMove={(e) => {
          if (!dragging) return;
          setPillLeft(e.touches[0].clientX - 22);
        }}
        onTouchEnd={onTouchEnd}
      >
        {items.map((item, i) => {
          const idx = offset + i;
          return (
            <button
              key={item.href}
              ref={(el) => {
                refs.current[idx] = el;
              }}
              type="button"
              className={"nav-btn" + (active === idx ? " active" : "")}
              onClick={() => snap(idx)}
            >
              <i className={"fa-solid " + item.icon} />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <>
      <div
        className={
          "glass-liquid-pill" + (dragging ? " dragging" : "")
        }
        style={{ left: pillLeft, bottom: 28 }}
      />
      <div
        className="nav-dual-container"
        style={{ maxWidth: 360, gap: 8, justifyContent: "center" }}
      >
        {bubble(LEFT, 0, 100)}
        {bubble(MID, 2, 150)}
        {bubble(RIGHT, 5, 100)}
      </div>
    </>
  );
}
