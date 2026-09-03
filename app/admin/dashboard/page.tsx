"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  formatRupiah,
  type NewsItem,
  type SiteContent,
} from "@/lib/data";
import { useAppData } from "@/lib/AppDataContext";

const MAX_NEWS = 7;

export default function AdminDashboardPage() {
  const router = useRouter();
  const {
    students,
    kasLog,
    siteContent,
    setSiteContent,
    maintenanceMode,
    setMaintenanceMode,
  } = useAppData();

  const [draft, setDraft] = useState<SiteContent>(siteContent);

  useEffect(() => {
    if (sessionStorage.getItem("admin-ok") !== "1") {
      router.replace("/admin");
    }
  }, [router]);

  useEffect(() => {
    setDraft(siteContent);
  }, [siteContent]);

  const saldo = useMemo(() => {
    if (!kasLog?.length) return 0;
    const last = [...kasLog].reverse().find((x) => x.desc?.trim() || x.val);
    return last?.balance ?? 0;
  }, [kasLog]);

  const countL = students.filter((s) => s.gender === "L").length;
  const countP = students.filter((s) => s.gender === "P").length;

  function save() {
    const news = draft.news.slice(0, MAX_NEWS);
    setSiteContent({ ...draft, news });
    alert("Homepage tersimpan");
  }

  function updateWidget(
    key: keyof SiteContent["widgets"],
    value: string
  ) {
    setDraft((d) => ({
      ...d,
      widgets: { ...d.widgets, [key]: value },
    }));
  }

  function updateNews(i: number, patch: Partial<NewsItem>) {
    setDraft((d) => ({
      ...d,
      news: d.news.map((n, idx) => (idx === i ? { ...n, ...patch } : n)),
    }));
  }

  function addNews() {
    if (draft.news.length >= MAX_NEWS) {
      alert("Maksimal " + MAX_NEWS + " berita");
      return;
    }
    setDraft((d) => ({
      ...d,
      news: [
        ...d.news,
        {
          id: String(Date.now()),
          title: "Judul berita baru",
          body: "Isi deskripsi berita...",
          imageUrl: "",
          source: "",
          sourceUrl: "",
        },
      ],
    }));
  }

  function removeNews(i: number) {
    if (!confirm("Hapus berita ini?")) return;
    setDraft((d) => ({
      ...d,
      news: d.news.filter((_, idx) => idx !== i),
    }));
  }

  return (
    <>
      {/* ===== Preview mirip home publik + editable ===== */}
      <div
        className="glass-card text-center"
        style={{ display: "flex", flexDirection: "column", gap: 8 }}
      >
        <div className="title-sub">SISTEM TERPADU KELAS X–TKJ 5</div>
        <textarea
          value={draft.tagline}
          onChange={(e) =>
            setDraft((d) => ({ ...d, tagline: e.target.value }))
          }
          rows={2}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 10,
            background: "#0f172a",
            color: "#f8fafc",
            border: "1px solid rgba(255,255,255,0.12)",
            fontSize: 13,
            resize: "vertical",
          }}
          placeholder="Tagline di bawah judul..."
        />
        <p style={{ fontSize: 9, color: "#64748b" }}>
          Edit tagline · tampil di homepage publik
        </p>
      </div>

      {/* Widgets 2x2 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        {/* MURID */}
        <div className="glass-card" style={{ padding: 12 }}>
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <i className="fa-solid fa-users" style={{ color: "#60a5fa" }} />
          </div>
          <input
            value={draft.widgets.muridLabel}
            onChange={(e) => updateWidget("muridLabel", e.target.value)}
            style={inp}
            placeholder="Label"
          />
          <input
            value={draft.widgets.muridSub}
            onChange={(e) => updateWidget("muridSub", e.target.value)}
            style={{ ...inp, marginTop: 6 }}
            placeholder="Sub (TOTAL : 43 SISWA)"
          />
          <p style={{ fontSize: 9, color: "#64748b", marginTop: 6 }}>
            Live: {students.length} · L{countL}/P{countP}
          </p>
        </div>

        {/* KAS — nominal tidak diedit */}
        <div className="glass-card" style={{ padding: 12 }}>
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <i
              className="fa-solid fa-money-bill-wave"
              style={{ color: "#4ade80" }}
            />
          </div>
          <input
            value={draft.widgets.kasLabel}
            onChange={(e) => updateWidget("kasLabel", e.target.value)}
            style={inp}
            placeholder="Label Kas"
          />
          <div
            style={{
              marginTop: 8,
              textAlign: "center",
              fontWeight: 800,
              color: "#4ade80",
              fontSize: 14,
            }}
          >
            {formatRupiah(saldo)}
          </div>
          <p style={{ fontSize: 9, color: "#64748b", marginTop: 4 }}>
            Nominal dari tabel kas (otomatis)
          </p>
        </div>

        {/* MAPEL */}
        <div className="glass-card" style={{ padding: 12 }}>
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <i className="fa-solid fa-book" style={{ color: "#a78bfa" }} />
          </div>
          <input
            value={draft.widgets.mapelLabel}
            onChange={(e) => updateWidget("mapelLabel", e.target.value)}
            style={inp}
            placeholder="Label"
          />
          <input
            value={draft.widgets.mapelSub}
            onChange={(e) => updateWidget("mapelSub", e.target.value)}
            style={{ ...inp, marginTop: 6 }}
            placeholder="Sub"
          />
        </div>

        {/* RUANG */}
        <div className="glass-card" style={{ padding: 12 }}>
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <i className="fa-solid fa-school" style={{ color: "#facc15" }} />
          </div>
          <input
            value={draft.widgets.ruangLabel}
            onChange={(e) => updateWidget("ruangLabel", e.target.value)}
            style={inp}
            placeholder="Label"
          />
          <input
            value={draft.widgets.ruangSub}
            onChange={(e) => updateWidget("ruangSub", e.target.value)}
            style={{ ...inp, marginTop: 6 }}
            placeholder="Sub"
          />
        </div>
      </div>

      {/* BERITA */}
      <div className="glass-card" style={{ padding: 12 }}>
        <div className="flex-between" style={{ marginBottom: 10 }}>
          <div className="title-sub">BERITA TERKINI</div>
          <span style={{ fontSize: 10, color: "#94a3b8" }}>
            {draft.news.length}/{MAX_NEWS}
          </span>
        </div>

        <button
          type="button"
          className="btn-action-light"
          style={{ marginBottom: 12, width: "100%" }}
          onClick={addNews}
        >
          + Tambah berita
        </button>

        {draft.news.map((n, i) => (
          <div
            key={n.id}
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: 12,
              marginBottom: 12,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div className="flex-between">
              <span style={{ fontSize: 10, fontWeight: 800, color: "#60a5fa" }}>
                Berita #{i + 1}
              </span>
              <button
                type="button"
                className="btn-action-light"
                style={{ fontSize: 10, color: "#f43f5e" }}
                onClick={() => removeNews(i)}
              >
                Hapus
              </button>
            </div>

            <input
              value={n.title}
              onChange={(e) => updateNews(i, { title: e.target.value })}
              placeholder="Judul berita"
              style={inp}
            />
            <textarea
              value={n.body}
              onChange={(e) => updateNews(i, { body: e.target.value })}
              placeholder="Deskripsi / isi berita"
              rows={3}
              style={{ ...inp, resize: "vertical" }}
            />
            <input
              value={n.imageUrl}
              onChange={(e) => updateNews(i, { imageUrl: e.target.value })}
              placeholder="URL gambar (opsional)"
              style={inp}
            />
            {n.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={n.imageUrl}
                alt=""
                style={{
                  width: "100%",
                  borderRadius: 10,
                  maxHeight: 140,
                  objectFit: "cover",
                }}
              />
            ) : null}
            <input
              value={n.source}
              onChange={(e) => updateNews(i, { source: e.target.value })}
              placeholder="Teks sumber (opsional)"
              style={inp}
            />
            <input
              value={n.sourceUrl}
              onChange={(e) => updateNews(i, { sourceUrl: e.target.value })}
              placeholder="Link sumber (opsional)"
              style={inp}
            />
          </div>
        ))}
      </div>

      <button type="button" className="btn-pay-qris" onClick={save}>
        Simpan ke homepage publik
      </button>

      {/* Maintenance */}
      <div
        className="glass-card"
        style={{
          marginTop: 12,
          borderColor: maintenanceMode
            ? "rgba(244,63,94,0.45)"
            : undefined,
        }}
      >
        <div className="flex-between">
          <div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 12,
                color: maintenanceMode ? "#f43f5e" : "#4ade80",
              }}
            >
              {maintenanceMode ? "MODE PERBAIKAN ON" : "WEB PUBLIK AKTIF"}
            </div>
            <p style={{ fontSize: 10, color: "#94a3b8" }}>
              {maintenanceMode
                ? "Pengunjung hanya lihat teks perbaikan"
                : "Portal publik bisa dibuka normal"}
            </p>
          </div>
          <button
            type="button"
            className="btn-action-light"
            style={{
              fontSize: 10,
              background: maintenanceMode
                ? "rgba(34,197,94,0.2)"
                : "rgba(244,63,94,0.25)",
              color: maintenanceMode ? "#4ade80" : "#fda4af",
            }}
            onClick={() => setMaintenanceMode(!maintenanceMode)}
          >
            {maintenanceMode ? "Matikan" : "Website sedang perbaikan"}
          </button>
        </div>
      </div>

      {/* Pintasan */}
      <div className="glass-card" style={{ marginTop: 12 }}>
        <div className="title-sub" style={{ marginBottom: 8 }}>
          KELOLA DATA
        </div>
        {[
          { href: "/admin/siswa", title: "Siswa", icon: "fa-users" },
          { href: "/admin/kas", title: "Kas", icon: "fa-sack-dollar" },
          { href: "/admin/absensi", title: "Absensi", icon: "fa-clipboard-user" },
          { href: "/admin/settings", title: "Settings", icon: "fa-gear" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex-between"
            style={{
              textDecoration: "none",
              padding: "10px 0",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              color: "#f8fafc",
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700 }}>
              <i
                className={"fa-solid " + item.icon}
                style={{ marginRight: 8, color: "#60a5fa" }}
              />
              {item.title}
            </span>
            <i className="fa-solid fa-chevron-right" style={{ color: "#64748b" }} />
          </Link>
        ))}
      </div>
    </>
  );
}

const inp: React.CSSProperties = {
  width: "100%",
  padding: 10,
  borderRadius: 10,
  background: "#0f172a",
  color: "#f8fafc",
  border: "1px solid rgba(255,255,255,0.12)",
  fontSize: 12,
};
