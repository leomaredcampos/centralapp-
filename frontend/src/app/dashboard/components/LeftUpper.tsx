"use client";

import Image from "next/image";

export default function LeftUpper() {
  return (
    <div className="h-[7%] border-[0.25px] border-black 300 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-[10px] border-b-[0.25px] border-black 200">
        <Image
          src="/api/company-logo?type=login&id=1"
          alt="Logo"
          width={100}
          height={100}
          style={{ width: "auto", height: "80%", objectFit: "contain" }}
          priority
        />
      </div>
    </div>
  );
}
