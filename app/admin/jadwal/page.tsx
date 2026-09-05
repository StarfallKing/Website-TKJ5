"use client";

import { useState, useEffect } from "react";
import { useAppData } from "@/lib/AppDataContext";
import type { ScheduleData, ScheduleSlot } from "@/lib/data";
import { scheduleDays } from "@/lib/data";

export default function AdminJadwalPage() {
  const { schedule, setSchedule } = useAppData();
  const [draft, setDraft] = useState<ScheduleData>(schedule);
  const [shift, setShift] = useState<"pagi" | "siang">("siang");

  useEffect(() => {
    setDraft(schedule);
  }, [schedule]);

  function updateSlot(
    day: string,
    index: number,
    field: keyof ScheduleSlot,
    value: string
  ) {
    setDraft((d) => {
      const list = [...(d[shift][day] || [])];
      list[index] = { ...list[index], [field]: value };
      return {
        ...d,
        [shift]: { ...d[shift], [day]: list },
      };
    });
  }

  function addSlot(day: string) {
    setDraft((d) => ({
      ...d,
      [shift]: {
        ...d[shift],
        [day]: [
          ...(d[shift][day] || []),
          { mapel: "MAPEL BARU", start: "07:00", end: "08:00" },
        ],
      },
    }));
  }

  return (
    <>
      <div className="glass-card text-center">
        <div className="title-sub">EDIT JADWAL</div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <button
          type="button"
          className={"filter-btn" + (shift === "pagi" ? " active" : "")}
          onClick={() => setShift("pagi")}
        >
          Pagi
        </button>
        <button
          type="button"
          className={"filter-btn" + (shift === "siang" ? " active" : "")}
          onClick={() => setShift("siang")}
        >
          Siang
        </button>
      </div>

      {scheduleDays.map((day) => (
        <div key={day} className="glass-card" style={{ marginBottom: 10 }}>
          <div className="title-sub">{day}</div>
          {(draft[shift][day] || []).map((slot, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginTop: 6 }}>
              <input
                value={slot.mapel}
                onChange={(e) => updateSlot(day, i, "mapel", e.target.value)}
                style={{ flex: 2, padding: 8, borderRadius: 8, background: "#0f172a", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }}
              />
              <input
                value={slot.start}
                onChange={(e) => updateSlot(day, i, "start", e.target.value)}
                style={{ width: 64, padding: 8, borderRadius: 8, background: "#0f172a", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }}
              />
              <input
                value={slot.end}
                onChange={(e) => updateSlot(day, i, "end", e.target.value)}
                style={{ width: 64, padding: 8, borderRadius: 8, background: "#0f172a", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>
          ))}
          <button
            type="button"
            className="btn-action-light"
            style={{ marginTop: 8, fontSize: 10 }}
            onClick={() => addSlot(day)}
          >
            + Slot
          </button>
        </div>
      ))}

      <button
        type="button"
        className="btn-pay-qris"
        onClick={() => void setSchedule(draft)}
      >
        Simpan jadwal ke publik
      </button>
    </>
  );
        }
