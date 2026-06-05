"use client";

import { useState, useRef, useCallback } from "react";
import LeftUpper from "./components/LeftUpper";
import LeftLower from "./components/LeftLower";
import RightUpper from "./components/RightUpper";
import RightLower from "./components/RightLower";
import { auditOpenModule } from "../centralizeaudit/auditdashboard/auditdashboard";
import { UserInfoHandle } from "../appuserinfo/rightbody/appuserinfoUSERDATA/page";
import { useSessionCheck } from "./hooks/useSessionCheck";
import { useDashboardData } from "./hooks/useDashboardData";
import { useSearchNavigation } from "./hooks/useSearchNavigation";
import { useOrientation } from "./hooks/useOrientation";

export default function DashboardPage() {
  const [email, setEmail] = useState("");
  const [show2FA, setShow2FA] = useState(false);
  const [activeApp, setActiveApp] = useState("");
  const userInfoRef = useRef<UserInfoHandle>(null);

  const { filtered, searchList, loadApps, handleSearch } = useDashboardData();
  const { searchVal, setSearchVal, handlePrev, handleNext } = useSearchNavigation(searchList);
  const isPortrait = useOrientation();

  const onValidSession = useCallback((validEmail: string) => {
    setEmail(validEmail);
    loadApps(validEmail);
  }, [loadApps]);

  useSessionCheck(onValidSession);

  const rightUpperProps = { email, show2FA, activeApp, on2FA: () => setShow2FA(!show2FA), onBack: () => { setActiveApp(""); setShow2FA(false); }, searchList, searchVal, onSearchChange: setSearchVal, onPrev: handlePrev, onNext: handleNext, userInfoRef };
  const rightLowerProps = { show2FA, apps: filtered, activeApp, onAppClick: (appname: string) => { auditOpenModule(email, appname.trim()); setActiveApp(appname.trim()); }, userInfoRef };
  const leftLowerProps = { count: filtered.length, onSearch: handleSearch, activeApp: activeApp || (show2FA ? "2fa" : ""), onBack: () => { setActiveApp(""); setShow2FA(false); }, onUserInfoData: () => setActiveApp("userinfoapp"), onPayroll: () => setActiveApp("payroll"), onAccessControl: () => setActiveApp("accesscontrol") };

  // ─── PORTRAIT LAYOUT ───────────────────────────────────────────────
  if (isPortrait) {
    return (
      <div style={{ width: "100dvw", height: "100dvh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* LeftUpper - 2.5dvh */}
        <div style={{ height: "2.5dvh", flexShrink: 0, borderBottom: "0.25px solid black" }}>
          <LeftUpper />
        </div>
        {/* RightUpper - 2.5dvh */}
        <div style={{ height: "2.5dvh", flexShrink: 0, borderBottom: "0.25px solid black" }}>
          <RightUpper {...rightUpperProps} />
        </div>
        {/* RightLower - 90dvh */}
        <div style={{ height: "90dvh", overflow: "hidden", minHeight: 0 }}>
          <RightLower {...rightLowerProps} />
        </div>
        {/* LeftLower - 5dvh */}
        <div style={{ height: "5dvh", flexShrink: 0, borderTop: "0.25px solid black" }}>
          <LeftLower {...leftLowerProps} />
        </div>
      </div>
    );
  }

  // ─── LANDSCAPE LAYOUT ──────────────────────────────────────────────
  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "row", overflow: "hidden" }}>
      {/* Left Sidebar - 15vw */}
      <div style={{ width: "15vw", height: "100vh", display: "flex", flexDirection: "column", borderRight: "0.25px solid black", flexShrink: 0 }}>
        {/* LeftUpper - 5vh */}
        <div style={{ height: "5vh", flexShrink: 0, borderBottom: "0.25px solid black" }}>
          <LeftUpper />
        </div>
        {/* LeftLower - remaining */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          <LeftLower {...leftLowerProps} />
        </div>
      </div>
      {/* Right Content - 85vw */}
      <div style={{ width: "85vw", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* RightUpper - 5vh */}
        <div style={{ height: "5vh", flexShrink: 0, borderBottom: "0.25px solid black" }}>
          <RightUpper {...rightUpperProps} />
        </div>
        {/* RightLower - remaining */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          <RightLower {...rightLowerProps} />
        </div>
      </div>
    </div>
  );
}
