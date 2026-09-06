"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

const TIMEOUT_MS = 10 * 60 * 1000; // 10 menit
const KEY_OK = "admin-ok";
const KEY_LAST = "admin-last";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // login page sendiri
    if (pathname === "/admin" || pathname === "/admin/") return;

    function touch() {
      sessionStorage.setItem(KEY_LAST, String(Date.now()));
    }

    function check() {
      if (sessionStorage.getItem(KEY_OK) !== "1") {
        router.replace("/admin");
        return;
      }
      const last = Number(sessionStorage.getItem(KEY_LAST) || 0);
      // hanya hitung timeout kalau user SUDAH pernah keluar area admin
      // (last di-set saat visibility hidden / route non-admin)
      if (last > 0 && Date.now() - last > TIMEOUT_MS) {
        sessionStorage.removeItem(KEY_OK);
        sessionStorage.removeItem(KEY_LAST);
        sessionStorage.removeItem("admin-user");
        alert("Sesi admin berakhir (10 menit di luar panel). Login lagi.");
        router.replace("/admin");
      }
    }

    // di dalam admin → anggap aktif, jangan timeout
    touch();
    check();

    function onVis() {
      if (document.visibilityState === "hidden") {
        // mulai hitung keluar
        sessionStorage.setItem(KEY_LAST, String(Date.now()));
      } else {
        check();
        touch();
      }
    }

    document.addEventListener("visibilitychange", onVis);
    const iv = setInterval(check, 30_000);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      clearInterval(iv);
    };
  }, [pathname, router]);

  return <>{children}</>;
}
