"use client";

import { useState, useEffect } from "react";
import { useAppData } from "@/lib/AppDataContext";
import type { ScheduleData, ScheduleSlot } from "@/lib/data";
import { scheduleDays, masterSchedule } from "@/lib/data";

export default function AdminJadwalPage() {
  const { schedule, setSchedule } = useAppData();
  
  // 1. Inisialisasi awal selalu beri fallback masterSchedule agar tidak pernah undefined
  const [draft, setDraft] = useState<ScheduleData>(schedule || masterSchedule);
  const [shift, setShift] = useState<"pagi" | "siang">("siang");

  // 2. Update draft jika data schedule dari context/Supabase baru saja dimuat
  useEffect(() => {
    if (schedule && (schedule.pagi || schedule.siang)) {
      setDraft(schedule);
    }
  }, [schedule]);

  // 3. Ambil data shift dengan fallback aman
  const currentShiftData = draft?.[shift] || masterSchedule[shift] || {};

  // 4. Update slot dengan imutabilitas yang aman
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

  // 5. Tambah slot baru dengan aman
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

  // 6. Hapus slot
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

  return (
    <>
      <div className="glass-card text-center" style={{ marginBottom: 12 }}>
        <div className="title-sub">EDIT JADWAL PELAJARAN</div>
      </div>

      {/* Switcher Shift */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
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
          <div key={day} className="glass-card" style={{ marginBottom: 12, padding: 12 }}>
            <div className="title-sub" style={{ marginBottom: 8, fontWeight: "bold" }}>
              {day}
            </div>

            {daySlots.length === 0 ? (
              <div style={{ fontSize: 12, opacity: 0.6 }}>Belum ada mata pelajaran</div>
            ) : (
              daySlots.map((slot, i) => (
                <div key={i} style={{ display: "flex", gap: 6, marginTop: 6, alignItems: "center" }}>
                  <input
                    type="text"
                    placeholder="Nama Mapel"
                    value={slot.mapel || ""}
                    onChange={(e) => updateSlot(day, i, "mapel", e.target.value)}
                    style={{
                      flex: 2,
                      padding: 8,
                      borderRadius: 8,
                      background: "#0f172a",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontSize: 13,
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Mulai"
                    value={slot.start || ""}
                    onChange={(e) => updateSlot(day, i, "start", e.target.value)}
                    style={{
                      width: 65,
                      padding: 8,
                      borderRadius: 8,
                      background: "#0f172a",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontSize: 13,
                      textAlign: "center",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Selesai"
                    value={slot.end || ""}
                    onChange={(e) => updateSlot(day, i, "end", e.target.value)}
                    style={{
                      width: 65,
                      padding: 8,
                      borderRadius: 8,
                      background: "#0f172a",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontSize: 13,
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
                      padding: "8px 10px",
                      cursor: "pointer",
                      fontSize: 12,
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
        style={{ marginTop: 16, width: "100%", padding: 12, cursor: "pointer" }}
        onClick={() => void setSchedule(draft)}
      >
        Simpan Jadwal ke Publik
      </button>
    </>
  );
}
