"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import {
  formatRupiah,
  NOMINAL_KAS,
  type NewsItem,
  type SiteContent,
} from "@/lib/data";
import { useAppData } from "@/lib/AppDataContext";
import { createClient } from "@supabase/supabase-js";
import AdminHeader from "@/components/layout/AdminHeader";

// Inisialisasi Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const MAX_NEWS = 7;

const inp: CSSProperties = {
  width: "100%",
  padding: 10,
  borderRadius: 10,
  background: "#0f172a",
  color: "#f8fafc",
  border: "1px solid rgba(255,255,255,0.12)",
  fontSize: 12,
};

// --- KOMPONEN KHUSUS UPLOAD / PASTE URL GAMBAR DENGAN GAYA TOMBOL KUSTOM ---
function NewsImageInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [mode, setMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setErr("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErr("Ukuran gambar terlalu besar! Maksimal 2MB.");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);
      const ext = file.name.split(".").pop();
      const fileName = `berita-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("berita-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("berita-images")
        .getPublicUrl(fileName);

      onChange(data.publicUrl);
    } catch (error: any) {
      setErr(error.message || "Gagal mengunggah gambar ke Supabase");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Tombol Tab Pilihan Mode */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={"filter-btn" + (mode === "url" ? " active" : "")}
          style={{
            padding: "6px 8px",
            fontSize: 11,
            fontWeight: 700,
            borderRadius: 8,
            justifyContent: "center",
          }}
        >
          <i className="fa-solid fa-link" style={{ fontSize: 10 }} /> Paste URL Link
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={"filter-btn" + (mode === "upload" ? " active" : "")}
          style={{
            padding: "6px 8px",
            fontSize: 11,
            fontWeight: 700,
            borderRadius: 8,
            justifyContent: "center",
          }}
        >
          <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: 10 }} /> Upload File (Maks 2MB)
        </button>
      </div>

      {mode === "url" ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... atau /public/..."
          style={inp}
        />
      ) : (
        <div className="custom-file-upload">
          <input
            type="file"
            id={`newsFile-${value}`}
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            style={{ display: "none" }}
          />
          <label
            htmlFor={`newsFile-${value}`}
            className="file-upload-btn has-file"
            style={{
              padding: "10px",
              borderRadius: 10,
              background: "#0f172a",
              border: "1px dashed rgba(96,165,250,0.4)",
              color: "#60a5fa",
              fontSize: 11,
              fontWeight: 700,
              textAlign: "center",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <i className="fa-solid fa-image" />
            <span>{uploading ? "Mengunggah..." : "Pilih Gambar dari Perangkat"}</span>
          </label>
        </div>
      )}

      {uploading && (
        <span style={{ fontSize: 10, color: "#60a5fa" }}>
          Mengunggah gambar...
        </span>
      )}
      {err && <span style={{ fontSize: 10, color: "#f43f5e" }}>⚠️ {err}</span>}
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const {
    students,
    paymentOverrides,
    kasLog,
    siteContent,
    setSiteContent,
    currentUser,
    authInitialized,
  } = useAppData();

  const [draft, setDraft] = useState<SiteContent>(siteContent);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // State untuk modal konfirmasi hapus berita (menggantikan confirm() bawaan browser)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // --- CEK SESI LOGIN DENGAN SAFE GUARD ---
  useEffect(() => {
    if (!authInitialized) return;

    if (!currentUser && sessionStorage.getItem("admin-ok") !== "1") {
      router.replace("/admin");
    }
  }, [authInitialized, currentUser, router]);

  useEffect(() => {
    setDraft(siteContent);
  }, [siteContent]);

  // Kalkulasi saldo otomatis gabungan kas_paid dan kasLog
  const saldo = useMemo(() => {
    const totalMasukPaid =
      Object.values(paymentOverrides || {}).filter(Boolean).length *
      (NOMINAL_KAS || 2000);

    const totalLog = (kasLog || []).reduce((acc, curr) => {
      return curr.type === "masuk" ? acc + curr.val : acc - curr.val;
    }, 0);

    return totalMasukPaid + totalLog;
  }, [paymentOverrides, kasLog]);

  async function save() {
    setSaving(true);
    try {
      const news = draft.news.slice(0, MAX_NEWS);
      await setSiteContent({ ...draft, news });
      setToast("Homepage publik berhasil disimpan! ✓");
    } catch (e: any) {
      setToast("Gagal menyimpan: " + (e.message || e));
    } finally {
      setSaving(false);
    }
  }

  function updateWidget(key: keyof SiteContent["widgets"], value: string) {
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
      setToast(`Maksimal ${MAX_NEWS} berita tercapai! Tidak dapat menambah lagi.`);
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

  function confirmDeleteNews() {
    if (deleteIndex === null) return;
    setDraft((d) => ({
      ...d,
      news: d.news.filter((_, idx) => idx !== deleteIndex),
    }));
    setDeleteIndex(null);
    setToast("Berita berhasil dihapus.");
  }

  if (!authInitialized || (!currentUser && sessionStorage.getItem("admin-ok") !== "1")) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: 40,
          color: "#94a3b8",
          fontSize: 12,
        }}
      >
        Memuat Dashboard Admin...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 100 }}>
      <AdminHeader />

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
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
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
        </div>

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
        </div>

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

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {draft.news.map((n, i) => (
            <div
              key={n.id}
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: 12,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div className="flex-between">
                <span
                  style={{ fontSize: 10, fontWeight: 800, color: "#60a5fa" }}
                >
                  Berita #{i + 1}
                </span>
                <button
                  type="button"
                  className="btn-action-light"
                  style={{ fontSize: 10, color: "#f43f5e" }}
                  onClick={() => setDeleteIndex(i)}
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

              <NewsImageInput
                value={n.imageUrl}
                onChange={(url) => updateNews(i, { imageUrl: url })}
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
      </div>

      <button
        type="button"
        className="btn-pay-qris"
        onClick={() => void save()}
        disabled={saving}
      >
        {saving ? "Menyimpan..." : "Simpan Ke Homepage"}
      </button>

      {/* MODAL KONFIRMASI HAPUS BERITA */}
      {deleteIndex !== null && (
        <div className="app-toast-overlay" onClick={() => setDeleteIndex(null)}>
          <div className="app-toast" onClick={(e) => e.stopPropagation()} style={{ gap: 14 }}>
            <div className="app-toast-msg" style={{ fontSize: 13 }}>
              Yakin ingin menghapus Berita #{deleteIndex + 1}?
            </div>
            <div style={{ display: "flex", gap: 8, width: "100%" }}>
              <button
                type="button"
                className="app-toast-btn"
                style={{ background: "#334155", color: "#fff" }}
                onClick={() => setDeleteIndex(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="app-toast-btn"
                style={{ background: "#f43f5e", color: "#fff" }}
                onClick={confirmDeleteNews}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL / TOAST NOTIFIKASI KUSTOM */}
      {toast && (
        <div className="app-toast-overlay" onClick={() => setToast(null)}>
          <div className="app-toast" onClick={(e) => e.stopPropagation()}>
            <div className="app-toast-msg">{toast}</div>
            <button
              type="button"
              className="app-toast-btn"
              onClick={() => setToast(null)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
      }
    
