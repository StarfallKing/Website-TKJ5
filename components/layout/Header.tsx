"use client";

import { useEffect, useRef, useState } from "react";

function useDragToggle(initialSecond = true) {
  const [isSecond, setIsSecond] = useState(initialSecond);
  const [left, setLeft] = useState(initialSecond ? 49 : 3);
  const dragging = useRef(false);
  const startX = useRef(0);
  const baseLeft = useRef(initialSecond ? 49 : 3);

  function setTo(second: boolean, smooth = true) {
    setIsSecond(second);
    setLeft(second ? 49 : 3);
  }

  function onTouchStart(e: React.TouchEvent) {
    dragging.current = true;
    startX.current = e.touches[0].clientX;
    baseLeft.current = isSecond ? 49 : 3;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!dragging.current) return;
    const diff = e.touches[0].clientX - startX.current;
    const next = Math.min(Math.max(baseLeft.current + diff, 3), 49);
    setLeft(next);
  }

  function onTouchEnd() {
    if (!dragging.current) return;
    dragging.current = false;
    setTo(left > 26);
  }

  return {
    isSecond,
    left,
    setTo,
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  };
}

export default function Header() {
  const lang = useDragToggle(true); // ID default
  const theme = useDragToggle(true); // moon default

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme.isSecond ? "dark" : "light"
    );
  }, [theme.isSecond]);

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang.isSecond ? "id" : "en");
  }, [lang.isSecond]);

  return (
    <>
      <div className="flex-between">
        <div
          className="top-pill-container"
          style={{ touchAction: "none" }}
          {...lang.handlers}
        >
          <div className="capsule-bg-green" style={{ left: `${lang.left}px` }} />
          <button
            className={`top-btn ${!lang.isSecond ? "active" : ""}`}
            type="button"
            onClick={() => lang.setTo(false)}
          >
            🇺🇸
          </button>
          <button
            className={`top-btn ${lang.isSecond ? "active" : ""}`}
            type="button"
            onClick={() => lang.setTo(true)}
          >
            🇮🇩
          </button>
        </div>

        <div
          className="top-pill-container"
          style={{ touchAction: "none" }}
          {...theme.handlers}
        >
          <div
            className="capsule-bg-yellow"
            style={{ left: `${theme.left}px` }}
          />
          <button
            className={`top-btn ${!theme.isSecond ? "active" : ""}`}
            type="button"
            onClick={() => theme.setTo(false)}
          >
            ☀️
          </button>
          <button
            className={`top-btn ${theme.isSecond ? "active" : ""}`}
            type="button"
            onClick={() => theme.setTo(true)}
          >
            🌙
          </button>
        </div>
      </div>

      <div className="glass-card flex-row">
        <div
          style={{
            background: "rgba(37,99,235,0.2)",
            border: "1px solid rgba(96,165,250,0.4)",
            padding: "10px 14px",
            borderRadius: "12px",
            fontWeight: 900,
            color: "#60a5fa",
            fontSize: "16px",
          }}
        >
          TKJ
        </div>
        <div>
          <div
            style={{
              fontSize: "10px",
              fontWeight: 800,
              color: "#cbd5e1",
              letterSpacing: "0.5px",
            }}
          >
            {lang.isSecond ? "WEBSITE RESMI KELAS" : "OFFICIAL CLASS WEBSITE"}
          </div>
          <div className="title-main">X TKJ–5</div>
        </div>
      </div>
    </>
  );
}