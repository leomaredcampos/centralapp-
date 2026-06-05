"use client";

import { useState, useEffect } from "react";

export function useOrientation() {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 1024;
      setIsPortrait(mobile);

      if (mobile) {
        try {
          screen.orientation.lock("portrait").catch(() => {});
        } catch {}
      }
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isPortrait;
}
