"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useAppData } from "@/lib/AppDataContext";
import AdminBottomNav from "@/components/layout/AdminBottomNav";

const TIMEOUT_MS = 10 * 60 * 1000; // 10 menit
const KEY_OK = "admin-ok";
const KEY_LAST = "admin-last";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { setCurrentUser } = useAppData();
  const isLogin = pathname === "/admin" || pathname === "/admin/";

  useEffect(() => {
    // Jika sedang di halaman login, tidak perlu cek sesi inaktivitas
    if (isLogin) return;

    function touch() {
      sessionStorage.setItem(KEY_LAST, String(Date.now()));
    }

    function logoutAndRedirect() {
      sessionStorage.removeItem(KEY_OK);
      sessionStorage.removeItem(KEY_LAST);
      sessionStorage.removeItem("admin-user");
      setCurrentUser(null);
      
      // Menggunakan window.location.href agar state ter-reset bersih
      window.location.href = "/admin";
    }

    function check() {
      // 1. Jika token login tidak ada
      if (sessionStorage.getItem(KEY_OK) !== "1") {
        logoutAndRedirect();
        return;
      }

      // 2. Jika sesi sudah idle lebih dari 10 menit
      const last = Number(sessionStorage.getItem(KEY_LAST) || 0);
      if (last > 0 && Date.now() - last > TIMEOUT_MS) {
        logoutAndRedirect();
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
    const iv = setInterval(check, 10_000); // Cek timer setiap 10 detik

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      clearInterval(iv);
    };
  }, [pathname, isLogin, setCurrentUser]);

  return (
    <>
      <div style={{ paddingBottom: isLogin ? 0 : 100 }}>{children}</div>
      <AdminBottomNav />
    </>
  );
}
