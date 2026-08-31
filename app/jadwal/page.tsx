"use client";

import { useEffect, useMemo, useState } from "react";
import {
  allStudents,
  masterSchedule,
  scheduleDays,
} from "@/lib/data";
import { useAppData } from "@/lib/AppDataContext";

const templates = {
  Keperluan: [
    {
      id: 1,
      title: "Template 1 (Acara Keluarga)",
      text: "Dengan surat ini saya memberitahukan bahwa siswa yang bersangkutan tidak dapat mengikuti kegiatan pembelajaran seperti biasa dikarenakan ada urusan keperluan keluarga yang sangat penting dan tidak dapat ditinggalkan. Kami memohon agar Bapak Wali Kelas dapat memberikan izin.",
    },
    {
      id: 3,
      title: "Template 3 (Mengurus Dokumen Resmi)",
      text: "Bersama pesan ini disampaikan permohonan izin tidak masuk sekolah karena siswa mendampingi orang tua untuk pengurusan administrasi kependudukan dan dokumen resmi instansi yang jadwalnya tidak dapat diubah. Diharapkan izin ini dapat disetujui.",
    },
  ],
  Sakit: [
    {
      id: 2,
      title: "Template 2 (Sakit Berobat)",
      text: "Menginformasikan bahwa kondisi tubuh siswa sedang kurang fit dan mengalami demam tinggi sehingga harus beristirahat total serta berobat ke klinik terdekat. Kami melampirkan foto surat dokter/keterangan medis sebagai bukti agar Bapak Wali Kelas memaklumi ketidakhadiran hari ini.",
    },
  ],
};

function getRotatedSession(): "pagi" | "siang" {
  const baseDate = new Date(2026, 6, 20); // 20 Juli 2026
  const now = new Date();
  const diffDays = Math.floor(
    Math.abs(now.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const weekIndex = Math.floor(diffDays / 7);

  // Minggu ini SIANG, minggu depan PAGI, dst.
  return weekIndex % 2 === 0 ? "siang" : "pagi";
             }

function isLessonNow(start: string, end: string) {
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return cur >= sh * 60 + sm && cur < eh * 60 + em;
}

export default function JadwalPage() {
  let students = allStudents;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const data = useAppData();
    if (data?.students?.length) students = data.students;
  } catch {
    // Context belum ada → pakai seed
  }

  const [izinType, setIzinType] = useState<"Keperluan" | "Sakit">("Keperluan");
  const [nama, setNama] = useState("");
  const [alasan, setAlasan] = useState("");
  const [fileName, setFileName] = useState("");
  const [query, setQuery] = useState("");
  const [showSug, setShowSug] = useState(false);
  const [timeStr, setTimeStr] = useState("");
  const [islandOpen, setIslandOpen] = useState(false);
  const [session, setSession] = useState<"pagi" | "siang">("pagi");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setSession(getRotatedSession());
    const t = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString("id-ID"));
      setSession(getRotatedSession());
      setTick((v) => v + 1);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const dayName = days[new Date().getDay()];
  const todayLessons = masterSchedule[session][dayName] || [];

  const matches = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return students
      .map((s) => s.nama)
      .filter((n) => n.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, students]);

  function submitWA() {
  if (!nama.trim()) {
    alert("Pilih nama siswa dulu!");
    return;
  }
  if (!alasan.trim()) {
    alert("Alasan wajib diisi!");
    return;
  }
  if (!fileName) {
    alert("Wajib lampirkan foto/surat!");
    return;
  }

  const phone = "628561534411";

  const message =
    "*SURAT PERMOHONAN IZIN SISWA X TKJ-5*\n\n" +
    "*Nama Siswa:* " +
    nama +
    "\n" +
    "*Jenis Izin:* " +
    izinType +
    "\n" +
    "*Tanggal:* " +
    new Date().toLocaleDateString("id-ID") +
    "\n\n" +
    "*Keterangan / Alasan:*\n" +
    alasan +
    "\n\n" +
    "*(Lampiran file disiapkan di chat)*\n\n" +
    "_Digenerate via Portal X TKJ-5_";

  const url =
    "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);

  window.open(url, "_blank");
  }

  function renderScheduleBlock(
    title: string,
    icon: string,
    color: string,
    data: typeof masterSchedule.pagi
  ) {
    return (
      <div className="glass-card">
        <div
          className="flex-between"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            paddingBottom: "6px",
            marginBottom: "12px",
          }}
        >
          <div className="title-sub">
            <i className={`fa-solid ${icon}`} style={{ color, marginRight: "6px" }} />
            {title}
          </div>
          <span style={{ fontSize: "9px", fontWeight: 800, color }}>
            {title.includes("PAGI") ? "06.30 - 12.00" : "12.30 - 17.30"} WIB
          </span>
        </div>

        {scheduleDays.map((day) => (
          <div key={day} className="schedule-day-box">
            <div className="schedule-day-title">{day.toUpperCase()}</div>
            {(data[day] || []).map((item, i) => {
              const isBreak = item.mapel.includes("ISTIRAHAT");
              const isLibur = item.mapel.includes("LIBUR");
              return (
                <div
                  key={i}
                  className="schedule-row"
                  style={{
                    color: isLibur ? "#f43f5e" : isBreak ? "#eab308" : undefined,
                    fontWeight: isLibur ? 800 : undefined,
                  }}
                >
                  <span>{item.mapel}</span>
                  <span>{isLibur ? "-" : `${item.start} - ${item.end}`}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  // tick dipakai biar highlight jam update tiap detik
  void tick;

  return (
    <>
      <div
        className="glass-card text-center"
        style={{ display: "flex", flexDirection: "column", gap: "4px" }}
      >
        <div className="title-sub">DATA JADWAL & SURAT DOKUMEN IZIN</div>
        <p style={{ fontSize: "12px", color: "#fff", fontWeight: 700 }}>
          Jadwal Real-Time & Pengajuan Izin Siswa X TKJ-5
        </p>
      </div>

      {/* DYNAMIC ISLAND */}
      <div
        className={`dynamic-island-bar ${islandOpen ? "open" : ""}`}
        onClick={() => setIslandOpen((v) => !v)}
      >
        <div className="island-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <i className="fa-solid fa-clock" style={{ color: "#60a5fa" }} />
            <span style={{ fontSize: "11px", fontWeight: 800 }}>
              {dayName.toUpperCase()} • {session.toUpperCase()}
            </span>
          </div>
          <span className="island-badge">{session.toUpperCase()}</span>
        </div>

        <div
          style={{
            fontSize: "10px",
            color: "#94a3b8",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Jam: {timeStr} WIB</span>
          <span style={{ color: "#60a5fa", fontWeight: 700 }}>
            Tekan Ringkasan{" "}
            <i className="fa-solid fa-chevron-down" style={{ fontSize: "9px" }} />
          </span>
        </div>

        <div className="island-expanded-content">
          <div style={{ fontSize: "10px", fontWeight: 800, color: "#60a5fa" }}>
            Jadwal Real-Time ({dayName} - Sesi {session})
          </div>

          {todayLessons.map((item, i) => {
            const active = isLessonNow(item.start, item.end);
            return (
              <div
                key={i}
                className={`schedule-item-live ${active ? "active-lesson" : ""}`}
              >
                <div>
                  <strong style={{ color: active ? "#60a5fa" : "#f8fafc" }}>
                    {item.mapel}
                  </strong>
                  {active && (
                    <span
                      style={{
                        fontSize: "8px",
                        background: "#2563eb",
                        color: "#fff",
                        padding: "2px 5px",
                        borderRadius: "4px",
                        fontWeight: 800,
                        marginLeft: "4px",
                      }}
                    >
                      SEDANG BERLANGSUNG
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontWeight: 700,
                    color: active ? "#60a5fa" : "#94a3b8",
                  }}
                >
                  {item.start} - {item.end}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* FORM IZIN */}
      <div
        className="glass-card"
        style={{ display: "flex", flexDirection: "column", gap: "14px" }}
      >
        <div
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            paddingBottom: "8px",
          }}
        >
          <div className="title-sub">
            <i className="fa-solid fa-file-signature" style={{ marginRight: "6px" }} />
            DOKUMEN IZIN SISWA
          </div>
          <p style={{ fontSize: "11px", color: "#cbd5e1", marginTop: "2px" }}>
            Pengajuan via WhatsApp Pak Shendy
          </p>
        </div>

        <div className="form-group">
          <label className="form-label">Nama Siswa</label>
          <div className="search-wrapper" style={{ marginBottom: 0 }}>
            <div className="search-box expanded" style={{ width: "100%" }}>
              <div className="search-icon">
                <i className="fa-solid fa-magnifying-glass" />
              </div>
              <input
                type="text"
                placeholder="Ketik nama siswa..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSug(true);
                  setNama("");
                }}
                autoComplete="off"
              />
            </div>
            {showSug && matches.length > 0 && (
              <div className="search-suggestions show">
                {matches.map((n) => (
                  <div
                    key={n}
                    className="suggestion-item"
                    onClick={() => {
                      setNama(n);
                      setQuery(n);
                      setShowSug(false);
                    }}
                  >
                    <span>{n}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Jenis Izin</label>
          <div className="radio-group">
            <div
              className={`radio-card ${izinType === "Keperluan" ? "active" : ""}`}
              onClick={() => {
                setIzinType("Keperluan");
                setAlasan("");
              }}
            >
              <i className="fa-solid fa-briefcase" style={{ marginRight: "4px" }} />{" "}
              Keperluan
            </div>
            <div
              className={`radio-card ${izinType === "Sakit" ? "active" : ""}`}
              onClick={() => {
                setIzinType("Sakit");
                setAlasan("");
              }}
            >
              <i
                className="fa-solid fa-notes-medical"
                style={{ marginRight: "4px" }}
              />{" "}
              Sakit
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Template</label>
          {templates[izinType].map((t) => (
            <div
              key={t.id}
              className="template-card"
              onClick={() => setAlasan(t.text)}
            >
              <strong style={{ color: "#60a5fa" }}>{t.title}:</strong>
              <br />
              {t.text}
            </div>
          ))}
        </div>

        <div className="form-group">
          <label className="form-label">Alasan (Wajib)</label>
          <textarea
            className="form-textarea"
            rows={4}
            value={alasan}
            onChange={(e) => setAlasan(e.target.value)}
            placeholder="Ketik alasan atau pilih template..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Lampirkan Foto / Surat <span style={{ color: "#f43f5e" }}>*</span>
          </label>
          <div className="custom-file-upload">
            <input
              type="file"
              id="izinFile"
              accept="image/*,application/pdf"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return setFileName("");
                if (f.size > 20 * 1024 * 1024) {
                  alert("Maks 20MB!");
                  e.target.value = "";
                  setFileName("");
                  return;
                }
                setFileName(f.name);
              }}
            />
            <label
              htmlFor="izinFile"
              className={`file-upload-btn ${fileName ? "has-file" : ""}`}
            >
              <i className="fa-solid fa-cloud-arrow-up" />
              <span>{fileName || "Pilih Foto / Surat Izin"}</span>
            </label>
          </div>
        </div>

        <button className="btn-whatsapp-submit" type="button" onClick={submitWA}>
          <i className="fa-brands fa-whatsapp" style={{ fontSize: "18px" }} />
          <span>Kirim Dokumen Izin ke Pak Shendy</span>
        </button>
      </div>

      {renderScheduleBlock(
        "JADWAL SESI 1 (PAGI) - X TKJ 5",
        "fa-sun",
        "#facc15",
        masterSchedule.pagi
      )}
      {renderScheduleBlock(
        "JADWAL SESI 2 (SIANG) - X TKJ 5",
        "fa-moon",
        "#38bdf8",
        masterSchedule.siang
      )}
    </>
  );
}
