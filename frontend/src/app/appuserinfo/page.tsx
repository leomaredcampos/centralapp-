"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import AppUserInfoRightBody, { UserInfoHandle } from "./rightbody/appuserinfoUSERDATA/page";
import { useOrientation } from "../dashboard/hooks/useOrientation";
import LeftUpper from "../dashboard/components/LeftUpper";

export default function AppUserInfoPage() {
  const router = useRouter();
  const userInfoRef = useRef<UserInfoHandle>(null);
  const isPortrait = useOrientation();

  const mainBtn = (
    <button
      onClick={() => router.push("/dashboard")}
      style={{ background: "transparent", border: "none", cursor: "pointer", color: "#2563eb", fontSize: "inherit" }}
    >
      Main
    </button>
  );

  if (isPortrait) {
    return (
      <div style={{ width: "100dvw", height: "100dvh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ height: "2.5dvh", flexShrink: 0, borderBottom: "0.25px solid black" }}>
          <LeftUpper />
        </div>
        <div style={{ flex: 1, overflow: "hidden", minHeight: 0 }}>
          <AppUserInfoRightBody ref={userInfoRef} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "row", overflow: "hidden" }}>
      {/* Left Sidebar */}
      <div style={{ width: "15vw", height: "100vh", display: "flex", flexDirection: "column", borderRight: "0.25px solid black", flexShrink: 0 }}>
        <div style={{ height: "5vh", flexShrink: 0, borderBottom: "0.25px solid black" }}>
          <LeftUpper />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "10px", gap: "8px" }}>
          <button onClick={() => router.push("/appuserinfo")} className="w-full p-[2px] leading-none bg-transparent border-t-0 border-b-[0.25px] border-black border-l-0 border-r-0 cursor-pointer text-black hover:bg-gray-50">User Info Data</button>
          <button onClick={() => router.push("/payroll")} className="w-full p-[2px] leading-none bg-transparent border-t-0 border-b-[0.25px] border-black border-l-0 border-r-0 cursor-pointer text-black hover:bg-gray-50">Payroll Computation</button>
          <button onClick={() => router.push("/accesscontrol")} className="w-full p-[2px] leading-none bg-transparent border-t-0 border-b-[0.25px] border-black border-l-0 border-r-0 cursor-pointer text-black hover:bg-gray-50">Access Control</button>
          <div style={{ flex: 1 }} />
          {mainBtn}
        </div>
      </div>
      {/* Right Content */}
      <div style={{ flex: 1, height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ height: "5vh", flexShrink: 0, borderBottom: "0.25px solid black", display: "flex", alignItems: "center", paddingLeft: "10px" }}>
          <span>Employee Info</span>
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <AppUserInfoRightBody ref={userInfoRef} />
        </div>
      </div>
    </div>
  );
}
