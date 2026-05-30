"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function LeftUpper() {
  const [imgWidth, setImgWidth] = useState(150);
  const [imgHeight, setImgHeight] = useState(150);

  useEffect(() => {
    const img = new window.Image();
    img.src = "/logo.png";
    img.onload = () => {
      if (img.naturalWidth !== img.naturalHeight) {
        setImgWidth(300);
        setImgHeight(50);
      }
    };
  }, []);

  return (
    <div className="h-[5%] border border-gray-300 flex items-center justify-center overflow-hidden">
      <Image
        src="/logo.png"
        alt="Logo"
        width={imgWidth}
        height={imgHeight}
        style={{ maxWidth: "100%", height: "auto", objectFit: "contain" }}
        priority
      />
    </div>
  );
}
