"use client";

import { useState, useEffect } from "react";

export function useOrientation() {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.screen.width < 1280 && window.screen.height > window.screen.width;
      setIsPortrait(mobile);

      if (mobile) {
        try {
          (screen.orientation as any).lock("portrait").catch(() => {});
        } catch {}
      }
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isPortrait;
}
