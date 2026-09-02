"use client";

import { masterSchedule, scheduleDays } from "@/lib/data";

export default function AdminJadwalPage() {
  return (
    <>
      <div className="glass-card text-center">
        <div className="title-sub">JADWAL PELAJARAN</div>
        <p style={{ fontSize: 11, color: "#94a3b8" }}>
          Edit detail mapel nanti di lib/data masterSchedule / Context
        </p>
      </div>

      {(["pagi", "siang"] as const).map((sesi) => (
        <div key={sesi} className="glass-card" style={{ marginBottom: 10 }}>
          <div className="title-sub" style={{ marginBottom: 8 }}>
            SESI {sesi.toUpperCase()}
          </div>
          {scheduleDays.map((day) => (
            <div key={day} style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 800, fontSize: 11, color: "#60a5fa" }}>
                {day}
              </div>
              {(masterSchedule[sesi][day] || []).map((les, i) => (
                <div
                  key={i}
                  className="flex-between"
                  style={{ fontSize: 11, padding: "4px 0" }}
                >
                  <span>{les.mapel}</span>
                  <span style={{ color: "#94a3b8" }}>
                    {les.start} – {les.end}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
