"use client";

import Image from "next/image";

export default function LeftUpper() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center px-[10px]">
        <Image
          src="/api/company-logo?type=login&id=1"
          alt="Logo"
          width={100}
          height={100}
          style={{ width: "auto", height: "100%", maxHeight: "100%", objectFit: "contain" }}
          priority
        />
      </div>
    </div>
  );
}
