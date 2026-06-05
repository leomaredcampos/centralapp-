"use client";

import { useEffect } from "react";

export default function OrientationManager() {
  useEffect(() => {
    function apply() {
      const isMobile = window.innerWidth < 1024;

      if (isMobile) {
        // Portrait — 14pt font, allow pinch zoom
        document.body.setAttribute("data-orientation", "portrait");
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";

        let meta = document.querySelector("meta[name=viewport]") as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement("meta");
          meta.name = "viewport";
          document.head.appendChild(meta);
        }
        meta.content = "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes";
      } else {
        // Landscape — formula font, prevent zoom
        document.body.setAttribute("data-orientation", "landscape");
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.top = "0";
        document.body.style.left = "0";

        let meta = document.querySelector("meta[name=viewport]") as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement("meta");
          meta.name = "viewport";
          document.head.appendChild(meta);
        }
        meta.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
      }
    }

    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  return null;
}
