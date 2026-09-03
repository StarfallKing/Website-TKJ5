"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppData } from "@/lib/AppDataContext";
import { formatRupiah } from "@/lib/data";

export default function HomePage() {
  const router = useRouter();
  const { students, kasLog, siteContent } = useAppData();
  const [openId, setOpenId] = useState<string | null>(null);

  const kasNow = useMemo(() => {
    if (!kasLog?.length) return 0;
    const last = [...kasLog].reverse().find((x) => x.desc?.trim() || x.val);
    return last?.balance ?? kasLog[kasLog.length - 1]?.balance ?? 0;
  }, [kasLog]);

  const w = siteContent.widgets;
  const news = siteContent.news || [];

  return (
    <>
      {/* Header sistem */}
      <div
        className="glass-card text-center"
        style={{
          background:
            "linear-gradient(135deg, rgba(30,58,138,0.25), rgba(15,23,42,0.5))",
          borderColor: "rgba(96,165,250,0.3)",
          padding: 16,
        }}
      >
        <div className="title-sub" style={{ marginBottom: 4 }}>
          SISTEM TERPADU KELAS X–TKJ 5
        </div>
        <p
          style={{
            fontSize: 12,
            color: "#fff",
            fontWeight: 700,
            lineHeight: 1.4,
          }}
        >
          {siteContent.tagline}
        </p>
      </div>

      {/* Widgets */}
      <div className="grid-2">
        <div
          className="glass-card text-center"
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/direktori")}
        >
          <div style={{ fontSize: 20, marginBottom: 2 }}>👥</div>
          <div className="title-sub">{w.muridLabel}</div>
          <div className="card-val">{w.muridSub}</div>
        </div>

        <div
          className="glass-card text-center"
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/kas")}
        >
          <div style={{ fontSize: 20, marginBottom: 2 }}>💵</div>
          <div className="title-sub">{w.kasLabel}</div>
          <div className="card-val" style={{ color: "#4ade80" }}>
            {formatRupiah(kasNow)}
          </div>
        </div>

        <div
          className="glass-card text-center"
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/jadwal")}
        >
          <div style={{ fontSize: 20, marginBottom: 2 }}>📚</div>
          <div className="title-sub">{w.mapelLabel}</div>
          <div className="card-val">{w.mapelSub}</div>
        </div>

        <div className="glass-card text-center">
          <div style={{ fontSize: 20, marginBottom: 2 }}>🏫</div>
          <div className="title-sub">{w.ruangLabel}</div>
          <div className="card-val">{w.ruangSub}</div>
        </div>
      </div>

      {/* Berita dari siteContent (maks 7 dari admin) */}
      <div
        className="glass-card"
        style={{ display: "flex", flexDirection: "column", gap: 14 }}
      >
        <div
          className="flex-between"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            paddingBottom: 6,
          }}
        >
          <span style={{ fontSize: 10, fontWeight: 800, color: "#60a5fa" }}>
            BERITA TERKINI
          </span>
          <span
            style={{
              fontSize: 8,
              background: "rgba(37,99,235,0.2)",
              color: "#93c5fd",
              padding: "2px 6px",
              borderRadius: 10,
              border: "1px solid rgba(96,165,250,0.3)",
              fontWeight: 700,
            }}
          >
            {news.length} berita
          </span>
        </div>

        {news.length === 0 && (
          <p style={{ fontSize: 11, color: "#64748b", textAlign: "center" }}>
            Belum ada berita
          </p>
        )}

        {news.map((n) => {
          const expanded = openId === n.id;
          return (
            <div
              key={n.id}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                paddingBottom: 12,
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{ fontSize: 12, fontWeight: 800, lineHeight: 1.35 }}
              >
                {n.title}
              </div>

              {n.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={n.imageUrl}
                  alt={n.title}
                  className="news-banner"
                  style={{
                    width: "100%",
                    borderRadius: 12,
                    objectFit: "cover",
                    maxHeight: 180,
                  }}
                />
              ) : null}

              <p className={"news-desc" + (expanded ? " expanded" : "")}>
                {n.body}
                <span
                  className="read-more-btn"
                  style={{
                    fontSize: 9.5,
                    marginLeft: 4,
                    cursor: "pointer",
                    color: "#60a5fa",
                  }}
                  onClick={() =>
                    setOpenId(expanded ? null : n.id)
                  }
                >
                  {expanded ? "lihat lebih sedikit" : "lihat selengkapnya"}
                </span>
              </p>

              {n.source ? (
                n.sourceUrl ? (
                  <a
                    href={n.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      color: "#93c5fd",
                      background: "rgba(37,99,235,0.2)",
                      border: "1px solid rgba(96,165,250,0.35)",
                      padding: "2px 8px",
                      borderRadius: 999,
                      textDecoration: "none",
                      display: "inline-block",
                      width: "fit-content",
                    }}
                  >
                    Sumber: {n.source}
                  </a>
                ) : (
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      color: "#93c5fd",
                      background: "rgba(37,99,235,0.2)",
                      border: "1px solid rgba(96,165,250,0.35)",
                      padding: "2px 8px",
                      borderRadius: 999,
                      display: "inline-block",
                      width: "fit-content",
                    }}
                  >
                    Sumber: {n.source}
                  </span>
                )
              ) : null}
            </div>
          );
        })}
      </div>
    </>
  );
}
