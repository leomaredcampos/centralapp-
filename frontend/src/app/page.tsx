"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-[#f5f5f5]">
      <p className="text-[11pt] text-black">Loading...</p>
    </div>
  );
}