import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";
import Header from "@/components/layout/Header";
import { AppDataProvider } from "@/lib/AppDataContext";
import MaintenanceGate from "@/components/MaintenanceGate";

// Konfigurasi Metadata + PWA Manifest
export const metadata: Metadata = {
  title: "Portal X TKJ-5 - SMK PGRI 2 Cibinong",
  description: "Sistem Terpadu Kelas X TKJ-5",
  manifest: "/manifest.json", // <-- PWA Manifest
  openGraph: {
    title: "Portal X TKJ-5 - SMK PGRI 2 Cibinong",
    description: "Sistem Terpadu Kelas X TKJ-5",
    url: "https://website-tkj5.vercel.app",
    siteName: "Portal X TKJ-5",
    images: [
      {
        url: "/og.png",
        width: 512,
        height: 512,
        alt: "Portal X TKJ-5",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

// Konfigurasi Viewport & Theme Color khas Next.js App Router
export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" data-theme="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body>
        <AppDataProvider>
          <div className="blob-1" />
          <div className="blob-2" />
          <div className="container">
            <Header />
            <MaintenanceGate>{children}</MaintenanceGate>
          </div>
          <BottomNav />
        </AppDataProvider>
      </body>
    </html>
  );
}
