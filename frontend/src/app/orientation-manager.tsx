"use client";

import { useEffect } from "react";

export default function OrientationManager() {
  useEffect(() => {
    function apply() {
      const isPortrait = window.screen.height > window.screen.width;

      if (isPortrait) {
        document.documentElement.style.cssText = "";
        document.body.style.cssText = `
          background: #ffffff;
          color: #000000;
          font-family: Calibri, sans-serif;
          font-size: 14pt;
          -webkit-text-size-adjust: none;
          text-size-adjust: none;
        `;
        const meta = document.querySelector("meta[name=viewport]") as HTMLMetaElement;
        if (meta) meta.content = "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes";
      } else {
        document.documentElement.style.cssText = "overflow: hidden; width: 100dvw; height: 100dvh;";
        document.body.style.cssText = `
          background: #ffffff;
          color: #000000;
          font-family: Calibri, sans-serif;
          font-size: min(1.17vw, 1.709dvh);
          width: 100dvw;
          height: 100dvh;
          overflow: hidden;
          position: fixed;
          top: 0;
          left: 0;
          -webkit-text-size-adjust: none;
          text-size-adjust: none;
        `;
        const meta = document.querySelector("meta[name=viewport]") as HTMLMetaElement;
        if (meta) meta.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
      }
    }

    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  return null;
}
