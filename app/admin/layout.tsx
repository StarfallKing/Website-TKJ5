"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import AdminBottomNav from "@/components/layout/AdminBottomNav";

const TIMEOUT_MS = 10 * 60 * 1000;
const KEY_OK = "admin-ok";
const KEY_LAST = "admin-last";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname === "/admin" || pathname === "/admin/";

  useEffect(() => {
    if (isLogin) return;

    function touch() {
      sessionStorage.setItem(KEY_LAST, String(Date.now()));
    }

    function check() {
      if (sessionStorage.getItem(KEY_OK) !== "1") {
        router.replace("/admin");
        return;
      }
      const last = Number(sessionStorage.getItem(KEY_LAST) || 0);
      if (last > 0 && Date.now() - last > TIMEOUT_MS) {
        sessionStorage.removeItem(KEY_OK);
        sessionStorage.removeItem(KEY_LAST);
        sessionStorage.removeItem("admin-user");
        alert("Sesi berakhir (10 menit di luar panel). Login lagi.");
        router.replace("/admin");
      }
    }

    touch();
    check();

    function onVis() {
      if (document.visibilityState === "hidden") {
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
  }, [pathname, router, isLogin]);

  return (
    <>
      {!isLogin && <Header />}
      <div style={{ paddingBottom: isLogin ? 0 : 100 }}>{children}</div>
      <AdminBottomNav />
    </>
  );
}
