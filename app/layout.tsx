import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";
import Header from "@/components/layout/Header";
import { AppDataProvider } from "@/lib/AppDataContext";

export const metadata: Metadata = {
  title: "Portal X TKJ-5 - SMK PGRI 2 Cibinong",
  description: "Sistem Terpadu Kelas X TKJ-5",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" data-theme="dark">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no"
        />
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
            {children}
          </div>
          <BottomNav />
        </AppDataProvider>
      </body>
    </html>
  );
}