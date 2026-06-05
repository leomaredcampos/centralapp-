"use client";

import { useEffect } from "react";

export default function PreventZoom() {
  useEffect(() => {
    const preventZoom = (e: WheelEvent | KeyboardEvent) => {
      const isPortrait = window.screen.height > window.screen.width;
      if (isPortrait) return;

      if (e instanceof WheelEvent && e.ctrlKey) {
        e.preventDefault();
      }
      if (e instanceof KeyboardEvent) {
        if (
          (e.ctrlKey && (e.key === "+" || e.key === "-" || e.key === "=")) ||
          (e.ctrlKey && e.key === "0")
        ) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener("wheel", preventZoom as EventListener, { passive: false });
    document.addEventListener("keydown", preventZoom as EventListener);

    return () => {
      document.removeEventListener("wheel", preventZoom as EventListener);
      document.removeEventListener("keydown", preventZoom as EventListener);
    };
  }, []);

  return null;
}
