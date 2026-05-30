"use client";

import Image from "next/image";

export default function LeftUpper() {
  return (
    <div className="h-[7%] border border-gray-300 flex items-center justify-center">
      <div className="flex-1 flex items-center justify-center px-[10px] border-b border-gray-200">
      <Image
        src="/left.png"
        alt="Logo"
        width={100}
        height={100}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
        priority
      />
      </div>
    </div>
  );
}
