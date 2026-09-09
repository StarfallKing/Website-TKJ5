"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Link from "next/link";
import AdminBottomNav from "@/components/layout/AdminBottomNav";

const TIMEOUT_MS = 10 * 60 * 1000; // 10 menit
const KEY_OK = "admin-ok";
const KEY_LAST = "admin-last";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin" || pathname === "/admin/";

  function handleLogout() {
    sessionStorage.removeItem(KEY_OK);
    sessionStorage.removeItem(KEY_LAST);
    sessionStorage.removeItem("admin-user");
    window.location.href = "/admin";
  }

  useEffect(() => {
    // Jika sedang di halaman login, tidak perlu cek sesi
    if (isLogin) return;

    function touch() {
      sessionStorage.setItem(KEY_LAST, String(Date.now()));
    }

    function check() {
      // 1. Jika token login tidak ada
      if (sessionStorage.getItem(KEY_OK) !== "1") {
        handleLogout();
        return;
      }

      // 2. Jika sesi sudah lewat dari 10 menit
      const last = Number(sessionStorage.getItem(KEY_LAST) || 0);
      if (last > 0 && Date.now() - last > TIMEOUT_MS) {
        handleLogout();
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
    const iv = setInterval(check, 10_000); // Cek setiap 10 detik

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      clearInterval(iv);
    };
  }, [pathname, isLogin]);

  return (
    <>
      <div style={{ paddingBottom: isLogin ? 0 : 100 }}>
        {/* CARD HEADER ADMIN PANEL (Hanya muncul jika BUKAN di halaman login) */}
        {!isLogin && (
          <div className="max-w-7xl mx-auto pt-4 px-3 sm:px-4">
            <div className="w-full bg-[#0d1527]/90 border border-slate-800 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-2 shadow-xl">
              {/* Judul & Identity */}
              <div className="min-w-0 flex-1">
                <h1 className="text-xs sm:text-base font-bold tracking-wider text-blue-400 uppercase truncate">
                  ADMIN PANEL X TKJ–5
                </h1>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 truncate">
                  Sistem Kontrol & Manajemen Kelas
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Direct ke Halaman Publik */}
                <Link
                  href="/"
                  target="_blank"
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800/80 hover:bg-blue-600/20 text-slate-200 hover:text-blue-400 text-xs sm:text-sm font-medium rounded-xl border border-slate-700/60 hover:border-blue-500/50 transition-all flex items-center gap-1.5"
                >
                  <svg
                    style={{ width: "14px", height: "14px" }}
                    className="w-3.5 h-3.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  <span>Publik</span>
                </Link>

                {/* Tombol Logout */}
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800 hover:bg-red-500/20 text-slate-200 hover:text-red-400 text-xs sm:text-sm font-semibold rounded-xl border border-slate-700/60 hover:border-red-500/50 transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Isi Konten Halaman */}
        {children}
      </div>

      <AdminBottomNav />
    </>
  );
}
