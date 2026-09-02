"use client";

import { usePathname } from "next/navigation";
import { useAppData } from "@/lib/AppDataContext";
import type { ReactNode } from "react";

export default function MaintenanceGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { maintenanceMode } = useAppData();

  const isAdmin = pathname?.startsWith("/admin");

  if (maintenanceMode && !isAdmin) {
    return (
      <div
        className="glass-card text-center"
        style={{
          marginTop: 100,
          padding: "28px 20px",
          borderColor: "rgba(244,63,94,0.35)",
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 900,
            color: "#f8fafc",
            marginBottom: 10,
          }}
        >
          Website Sedang Perbaikan
        </div>
        <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>
          Harap Kembali Lagi Nanti
        </p>
        <p style={{ fontSize: 10, color: "#64748b", marginTop: 14 }}>
          Portal X TKJ-5 · SMK PGRI 2 Cibinong
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
