"use client";

import { useState, useEffect } from "react";

export type LayoutType = "landscape" | "portrait-small" | "portrait-large";

export function useOrientation(): LayoutType {
  const [layout, setLayout] = useState<LayoutType>("landscape");

  useEffect(() => {
    const check = () => {
      const isPortrait = window.screen.height > window.screen.width;
      if (!isPortrait) {
        setLayout("landscape");
      } else if (window.screen.width <= 480) {
        setLayout("portrait-small");
      } else {
        setLayout("portrait-large");
      }

      if (isPortrait) {
        try {
          (screen.orientation as any).lock("portrait").catch(() => {});
        } catch {}
      }
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return layout;
}
