"use client";

import { useState, useEffect } from "react";
import { useAppData } from "@/lib/AppDataContext";
import type { ScheduleData, ScheduleSlot } from "@/lib/data";
import { scheduleDays, masterSchedule } from "@/lib/data";
import AdminHeader from "@/components/layout/AdminHeader"; // 1. IMPORT ADMIN HEADER

export default function AdminJadwalPage() {
  const { schedule, setSchedule } = useAppData();
  
  const [draft, setDraft] = useState<ScheduleData>(schedule || masterSchedule);
  const [shift, setShift] = useState<"pagi" | "siang">("siang");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (schedule && (schedule.pagi || schedule.siang)) {
      setDraft(schedule);
    }
  }, [schedule]);

  const currentShiftData = draft?.[shift] || masterSchedule[shift] || {};

  function updateSlot(
    day: string,
    index: number,
    field: keyof ScheduleSlot,
    value: string
  ) {
    setDraft((prev) => {
      const base = prev || masterSchedule;
      const currentShift = base[shift] || {};
      const daySlots = [...(currentShift[day] || [])];

      if (!daySlots[index]) return base;

      daySlots[index] = {
        ...daySlots[index],
        [field]: value,
      };

      return {
        ...base,
        [shift]: {
          ...currentShift,
          [day]: daySlots,
        },
      };
    });
  }

  function addSlot(day: string) {
    setDraft((prev) => {
      const base = prev || masterSchedule;
      const currentShift = base[shift] || {};
      const daySlots = [...(currentShift[day] || [])];

      daySlots.push({ mapel: "MAPEL BARU", start: "07:00", end: "08:00" });

      return {
        ...base,
        [shift]: {
          ...currentShift,
          [day]: daySlots,
        },
      };
    });
  }

  function removeSlot(day: string, index: number) {
    setDraft((prev) => {
      const base = prev || masterSchedule;
      const currentShift = base[shift] || {};
      const daySlots = (currentShift[day] || []).filter((_, i) => i !== index);

      return {
        ...base,
        [shift]: {
          ...currentShift,
          [day]: daySlots,
        },
      };
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      await setSchedule(draft);
    } finally {
      setSaving(false);
    }
  }

  return (
    /* Pembungkus utama diberi paddingBottom 110px agar navbar tidak ketutupan/offside */
    <div style={{ paddingBottom: 110, display: "flex", flexDirection: "column", gap: 12 }}>
      {/* 2. PASANG ADMIN HEADER DI PALING ATAS */}
      <AdminHeader />

      <div className="glass-card text-center">
        <div className="title-sub">EDIT JADWAL PELAJARAN</div>
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
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 4,
                    marginTop: 6,
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Nama Mapel"
                    value={slot.mapel || ""}
                    onChange={(e) => updateSlot(day, i, "mapel", e.target.value)}
                    style={{
                      flex: 1,
                      minWidth: 0, // Mencegah input melar keluar dari flexbox
                      padding: "8px 6px",
                      borderRadius: 8,
                      background: "#0f172a",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontSize: 11,
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Mulai"
                    value={slot.start || ""}
                    onChange={(e) => updateSlot(day, i, "start", e.target.value)}
                    style={{
                      width: 52,
                      padding: "8px 2px",
                      borderRadius: 8,
                      background: "#0f172a",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontSize: 11,
                      textAlign: "center",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Selesai"
                    value={slot.end || ""}
                    onChange={(e) => updateSlot(day, i, "end", e.target.value)}
                    style={{
                      width: 52,
                      padding: "8px 2px",
                      borderRadius: 8,
                      background: "#0f172a",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontSize: 11,
                      textAlign: "center",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeSlot(day, i)}
                    style={{
                      background: "rgba(239, 68, 68, 0.2)",
                      color: "#ef4444",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      borderRadius: 8,
                      padding: "8px 8px",
                      cursor: "pointer",
                      fontSize: 11,
                      flexShrink: 0,
                    }}
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
    </div>
  );
}
