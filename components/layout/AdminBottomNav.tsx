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
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pillLeft, setPillLeft] = useState(0);

  if (!pathname || pathname === "/admin") return null;

  const active = Math.max(
    0,
    ALL.findIndex((i) => pathname.startsWith(i.href))
  );

  useEffect(() => {
    const el = btnRefs.current[active];
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPillLeft(r.left + r.width / 2 - 22);
  }, [active, pathname]);

  function bubble(
    items: { href: string; icon: string }[],
    offset: number,
    width: number
  ) {
    return (
      <div className="bubble-nav" style={{ width }}>
        {items.map((item, i) => {
          const idx = offset + i;
          return (
            <button
              key={item.href}
              ref={(el) => {
                btnRefs.current[idx] = el;
              }}
              type="button"
              className={
                "nav-btn" + (active === idx ? " active" : "")
              }
              onClick={() => router.push(item.href)}
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
        className="glass-liquid-pill"
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
