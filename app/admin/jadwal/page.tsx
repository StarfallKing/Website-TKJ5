"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppData } from "@/lib/AppDataContext";
import type { ScheduleData, ScheduleSlot } from "@/lib/data";
import { scheduleDays, masterSchedule } from "@/lib/data";
import AdminHeader from "@/components/layout/AdminHeader";
import { supabase } from "@/lib/supabase";

function getRotatedSession(): "pagi" | "siang" {
  const baseDate = new Date(2026, 6, 20);
  const now = new Date();
  const diffDays = Math.floor(
    Math.abs(now.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const weekIndex = Math.floor(diffDays / 7);
  return weekIndex % 2 === 0 ? "siang" : "pagi";
}

function isLessonNow(start: string, end: string) {
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return cur >= sh * 60 + sm && cur < eh * 60 + em;
}

export default function AdminJadwalPage() {
  const router = useRouter();
  const {
    schedule,
    setSchedule,
    currentUser,
    authInitialized,
  } = useAppData();

  const [draft, setDraft] = useState<ScheduleData>(schedule || masterSchedule);
  const [shift, setShift] = useState<"pagi" | "siang">("siang");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // State Kontrol Cepat Sesi & Libur (Disinkronkan ke Supabase)
  const [islandOpen, setIslandOpen] = useState(false);
  const [timeStr, setTimeStr] = useState("");
  const [manualSession, setManualSession] = useState<"pagi" | "siang" | null>(null);
  const [holidayDays, setHolidayDays] = useState<Record<string, boolean>>({});

  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const dayName = days[new Date().getDay()];
  const currentSession = manualSession || getRotatedSession();

  useEffect(() => {
    const t = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString("id-ID"));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Ambil pengaturan override sesi & libur dari Supabase saat load
  useEffect(() => {
    async function loadAppSettings() {
      const { data } = await supabase.from("app_settings").select("*").eq("id", 1).maybeSingle();
      if (data) {
        if (data.forced_session) setManualSession(data.forced_session);
        if (data.holiday_days) setHolidayDays(data.holiday_days);
      }
    }
    void loadAppSettings();
  }, []);

  useEffect(() => {
    if (!authInitialized) return;
    if (!currentUser && sessionStorage.getItem("admin-ok") !== "1") {
      router.replace("/admin");
    }
  }, [authInitialized, currentUser, router]);

  useEffect(() => {
    if (schedule && (schedule.pagi || schedule.siang)) {
      setDraft(schedule);
    }
  }, [schedule]);

  const currentShiftData = draft?.[shift] || masterSchedule[shift] || {};
  const todayLessons = holidayDays[dayName] 
    ? [{ mapel: "📅 HARI LIBUR / TANGGAL MERAH", start: "00:00", end: "23:59" }] 
    : (draft?.[currentSession]?.[dayName] || masterSchedule[currentSession]?.[dayName] || []);

  function updateSlot(day: string, index: number, field: keyof ScheduleSlot, value: string) {
    setDraft((prev) => {
      const base = prev || masterSchedule;
      const currentShift = base[shift] || {};
      const daySlots = [...(currentShift[day] || [])];
      if (!daySlots[index]) return base;
      daySlots[index] = { ...daySlots[index], [field]: value };
      return { ...base, [shift]: { ...currentShift, [day]: daySlots } };
    });
  }

  function addSlot(day: string) {
    setDraft((prev) => {
      const base = prev || masterSchedule;
      const currentShift = base[shift] || {};
      const daySlots = [...(currentShift[day] || [])];
      daySlots.push({ mapel: "MAPEL BARU", start: "07:00", end: "08:00" });
      return { ...base, [shift]: { ...currentShift, [day]: daySlots } };
    });
  }

  function removeSlot(day: string, index: number) {
    setDraft((prev) => {
      const base = prev || masterSchedule;
      const currentShift = base[shift] || {};
      const daySlots = (currentShift[day] || []).filter((_, i) => i !== index);
      return { ...base, [shift]: { ...currentShift, [day]: daySlots } };
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      await setSchedule(draft);
      setToast("Jadwal berhasil disimpan ke database! ✓");
    } catch (e: any) {
      setToast("Gagal menyimpan jadwal: " + (e.message || e));
    } finally {
      setSaving(false);
    }
  }

  // Fungsi simpan status paksa sesi & libur ke Supabase agar publik ikut berubah
  async function updateControlSetting(newSession: "pagi" | "siang" | null, newHol: Record<string, boolean>) {
    setManualSession(newSession);
    setHolidayDays(newHol);

    await supabase.from("app_settings").upsert({
      id: 1,
      forced_session: newSession,
      holiday_days: newHol,
      updated_at: new Date().toISOString(),
    });
  }

  if (!authInitialized || (!currentUser && sessionStorage.getItem("admin-ok") !== "1")) {
    return (
      <div style={{ textAlign: "center", padding: 40, color: "#94a3b8", fontSize: 12 }}>
        Memuat data jadwal...
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 110, display: "flex", flexDirection: "column", gap: 12 }}>
      <AdminHeader />

      <div className="glass-card text-center">
        <div className="title-sub">DATA JADWAL PELAJARAN</div>
      </div>

      {/* Dynamic Island di Admin */}
      <div
        className={"dynamic-island-bar" + (islandOpen ? " open" : "")}
        onClick={() => setIslandOpen((v) => !v)}
      >
        <div className="island-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <i className="fa-solid fa-clock" style={{ color: "#60a5fa" }} />
            <span style={{ fontSize: "11px", fontWeight: 800 }}>
              {dayName.toUpperCase()} • {currentSession.toUpperCase()}
              {holidayDays[dayName] ? " (LIBUR)" : ""}
            </span>
          </div>
          <span className="island-badge">{currentSession.toUpperCase()}</span>
        </div>

        <div
          style={{
            fontSize: "10px",
            color: "#94a3b8",
            display: "flex",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <span>Jam: {timeStr || "12:00:00"} WIB</span>
          <span style={{ color: "#60a5fa", fontWeight: 700 }}>
            {islandOpen ? "Tutup" : "Tekan Ringkasan"}{" "}
            <i
              className={"fa-solid " + (islandOpen ? "fa-chevron-up" : "fa-chevron-down")}
              style={{ fontSize: "9px" }}
            />
          </span>
        </div>

        <div className="island-expanded-content" onClick={(e) => e.stopPropagation()}>
          <div style={{ fontSize: "10px", fontWeight: 800, color: "#60a5fa", marginBottom: 6 }}>
            Kontrol Cepat Sesi & Libur Hari Ini (Sinkron Publik)
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
            <button
              type="button"
              onClick={() => {
                void updateControlSetting("pagi", holidayDays);
                setToast("Sesi dipaksa ke: PAGI (Sinkron ke Publik)");
              }}
              style={{
                background: currentSession === "pagi" ? "#2563eb" : "rgba(15,23,42,0.8)",
                color: "#fff",
                border: "1px solid rgba(96,165,250,0.4)",
                padding: "8px",
                borderRadius: 8,
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              ☀️ Tetapkan Jadwal Pagi
            </button>
            <button
              type="button"
              onClick={() => {
                void updateControlSetting("siang", holidayDays);
                setToast("Sesi dipaksa ke: SIANG (Sinkron ke Publik)");
              }}
              style={{
                background: currentSession === "siang" ? "#2563eb" : "rgba(15,23,42,0.8)",
                color: "#fff",
                border: "1px solid rgba(96,165,250,0.4)",
                padding: "8px",
                borderRadius: 8,
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              🌙 Tetapkan Jadwal Siang
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              const nextHol = { ...holidayDays, [dayName]: !holidayDays[dayName] };
              void updateControlSetting(manualSession, nextHol);
              setToast(nextHol[dayName] ? `Hari ${dayName} ditetapkan sebagai Libur!` : `Status libur ${dayName} dibatalkan.`);
            }}
            style={{
              width: "100%",
              background: holidayDays[dayName] ? "rgba(239, 68, 68, 0.3)" : "rgba(239, 68, 68, 0.15)",
              color: "#f43f5e",
              border: "1.5px solid rgba(239, 68, 68, 0.4)",
              padding: "9px",
              borderRadius: 8,
              fontSize: 10,
              fontWeight: 800,
              cursor: "pointer",
              marginBottom: 10,
            }}
          >
            {holidayDays[dayName] ? "✓ Batalkan Status Hari Libur" : "📅 Tetapkan sebagai tanggal merah/hari libur"}
          </button>

          <div style={{ fontSize: "10px", fontWeight: 800, color: "#60a5fa", marginBottom: 4 }}>
            Jadwal Real-Time ({dayName} - Sesi {currentSession})
          </div>

          {todayLessons.map((item, i) => {
            const active = isLessonNow(item.start, item.end);
            return (
              <div key={i} className={"schedule-item-live" + (active ? " active-lesson" : "")}>
                <div>
                  <strong style={{ color: active ? "#60a5fa" : "#f8fafc" }}>{item.mapel}</strong>
                  {active && !holidayDays[dayName] && (
                    <span style={{ fontSize: "8px", background: "#2563eb", color: "#fff", padding: "2px 5px", borderRadius: "4px", fontWeight: 800, marginLeft: "4px" }}>
                      SEDANG BERLANGSUNG
                    </span>
                  )}
                </div>
                <span style={{ fontWeight: 700, color: active ? "#60a5fa" : "#94a3b8" }}>
                  {item.start} - {item.end}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Switcher Shift */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          className={"filter-btn" + (shift === "pagi" ? " active" : "")}
          onClick={() => setShift("pagi")}
        >
          Shift Pagi
        </button>
        <button
          type="button"
          className={"filter-btn" + (shift === "siang" ? " active" : "")}
          onClick={() => setShift("siang")}
        >
          Shift Siang
        </button>
      </div>

      {/* Render Hari */}
      {scheduleDays.map((day) => {
        const daySlots = currentShiftData[day] || [];
        return (
          <div key={day} className="glass-card" style={{ padding: 12 }}>
            <div className="title-sub" style={{ marginBottom: 8, fontWeight: "bold" }}>
              {day}
            </div>
            {daySlots.length === 0 ? (
              <div style={{ fontSize: 12, opacity: 0.6 }}>Belum ada mata pelajaran</div>
            ) : (
              daySlots.map((slot, i) => (
                <div key={i} style={{ display: "flex", gap: 4, marginTop: 6, alignItems: "center", width: "100%" }}>
                  <input
                    type="text"
                    placeholder="Nama Mapel"
                    value={slot.mapel || ""}
                    onChange={(e) => updateSlot(day, i, "mapel", e.target.value)}
                    style={{ flex: 1, minWidth: 0, padding: "8px 6px", borderRadius: 8, background: "#0f172a", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", fontSize: 11 }}
                  />
                  <input
                    type="text"
                    placeholder="Mulai"
                    value={slot.start || ""}
                    onChange={(e) => updateSlot(day, i, "start", e.target.value)}
                    style={{ width: 52, padding: "8px 2px", borderRadius: 8, background: "#0f172a", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", fontSize: 11, textAlign: "center" }}
                  />
                  <input
                    type="text"
                    placeholder="Selesai"
                    value={slot.end || ""}
                    onChange={(e) => updateSlot(day, i, "end", e.target.value)}
                    style={{ width: 52, padding: "8px 2px", borderRadius: 8, background: "#0f172a", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", fontSize: 11, textAlign: "center" }}
                  />
                  <button
                    type="button"
                    onClick={() => removeSlot(day, i)}
                    style={{ background: "rgba(239, 68, 68, 0.2)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: 8, padding: "8px 8px", cursor: "pointer", fontSize: 11, flexShrink: 0 }}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
            <button
              type="button"
              className="btn-action-light"
              style={{ marginTop: 10, fontSize: 11, cursor: "pointer" }}
              onClick={() => addSlot(day)}
            >
              + Tambah Slot {day}
            </button>
          </div>
        );
      })}

      <button
        type="button"
        className="btn-pay-qris"
        disabled={saving}
        onClick={() => void handleSave()}
      >
        {saving ? "Menyimpan..." : "Simpan jadwal ke database"}
      </button>

      {toast && (
        <div className="app-toast-overlay" onClick={() => setToast(null)}>
          <div className="app-toast" onClick={(e) => e.stopPropagation()}>
            <div className="app-toast-msg">{toast}</div>
            <button type="button" className="app-toast-btn" onClick={() => setToast(null)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
    }
    
