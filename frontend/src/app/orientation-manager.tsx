"use client";

import { useEffect } from "react";

export default function OrientationManager() {
  useEffect(() => {
    function apply() {
      const isMobile = window.innerWidth < 1024;

      if (isMobile) {
        document.body.setAttribute("data-orientation", "portrait");
        document.documentElement.style.overflow = "auto";
        document.documentElement.style.height = "auto";
        document.documentElement.style.width = "100%";
        document.body.style.overflow = "auto";
        document.body.style.height = "auto";
        document.body.style.width = "100%";
        document.body.style.position = "relative";
        document.body.style.top = "";
        document.body.style.left = "";

        let meta = document.querySelector("meta[name=viewport]") as HTMLMetaElement;
        if (!meta) { meta = document.createElement("meta"); meta.name = "viewport"; document.head.appendChild(meta); }
        meta.content = "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes";
      } else {
        document.body.setAttribute("data-orientation", "landscape");
        document.documentElement.style.overflow = "hidden";
        document.documentElement.style.height = "100dvh";
        document.documentElement.style.width = "100dvw";
        document.body.style.overflow = "hidden";
        document.body.style.height = "100dvh";
        document.body.style.width = "100dvw";
        document.body.style.position = "fixed";
        document.body.style.top = "0";
        document.body.style.left = "0";

        let meta = document.querySelector("meta[name=viewport]") as HTMLMetaElement;
        if (!meta) { meta = document.createElement("meta"); meta.name = "viewport"; document.head.appendChild(meta); }
        meta.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
      }
    }

    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  return null;
}
