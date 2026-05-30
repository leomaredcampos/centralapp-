"use client";
import Image from "next/image";
import { useState } from "react";

export default function LeftUpper() {
  const [dimensions, setDimensions] = useState({ width: 50, height: 50 });

  return (
    <div className="h-[5%] border border-gray-300 flex items-center justify-center">
      <Image
        src="/logo.png"
        alt="Logo"
        width={dimensions.width}
        height={dimensions.height}
        style={{ objectFit: "contain" }}
        onLoad={(e) => {
          const img = e.target as HTMLImageElement;
          if (img.naturalWidth !== img.naturalHeight) {
            setDimensions({ width: 300, height: 50 });
          }
        }}
      />
    </div>
  );
}