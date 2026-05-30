"use client";

import Image from "next/image";

export default function LeftUpper() {
  return (
    <div className="h-[7%] border border-gray-300 flex items-center justify-center">
      <Image
        src="/left.png"
        alt="Logo"
        width={100}
        height={100}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
        priority
      />
    </div>
  );
}
