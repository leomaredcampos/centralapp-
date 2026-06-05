"use client";

import Image from "next/image";

export default function LeftUpper() {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 10px" }}>
        <Image
          src="/api/company-logo?type=login&id=1"
          alt="Logo"
          width={100}
          height={100}
          style={{ width: "auto", height: "80%", maxHeight: "40px", objectFit: "contain" }}
          priority
        />
      </div>
  );
}
