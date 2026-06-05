"use client";

import { useState, useRef } from "react";
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

  useSessionCheck((validEmail) => {
    setEmail(validEmail);
    loadApps(validEmail);
  });

  return (
    <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden">
      {/* Left Sidebar - hidden on mobile, 15% on desktop */}
      <div className="hidden md:flex flex-col w-[15%] h-screen border-r-[0.25px] border-black">
        <LeftUpper />
        <div className="border-t-[0.25px] border-black" />
        <LeftLower count={filtered.length} onSearch={handleSearch} activeApp={activeApp} onBack={() => setActiveApp("")} onUserInfoData={() => setActiveApp("userinfoapp")} onPayroll={() => setActiveApp("payroll")} onAccessControl={() => setActiveApp("accesscontrol")} />
      </div>
      {/* Right Content */}
      <div className="flex flex-col w-full md:w-[85%] h-screen overflow-hidden">
        {/* Portrait: LeftUpper sa taas */}
        {isPortrait && (
          <div className="flex-shrink-0 border-b-[0.25px] border-black" style={{ height: "5vh" }}>
            <LeftUpper />
          </div>
        )}
        {/* RightUpper */}
        <div className="flex-shrink-0" style={{ height: "5vh" }}>
          <RightUpper email={email} show2FA={show2FA} activeApp={activeApp} on2FA={() => setShow2FA(!show2FA)} onBack={() => { setActiveApp(""); setShow2FA(false); }} searchList={searchList} searchVal={searchVal} onSearchChange={setSearchVal} onPrev={handlePrev} onNext={handleNext} userInfoRef={userInfoRef} />
        </div>
        <div className="border-t-[0.25px] border-black flex-shrink-0" />
        <div className="flex-1 overflow-hidden min-h-0">
          <RightLower show2FA={show2FA} apps={filtered} activeApp={activeApp} onAppClick={(appname) => { auditOpenModule(email, appname.trim()); setActiveApp(appname.trim()); }} userInfoRef={userInfoRef} />
        </div>
        {/* Portrait: LeftLower sa baba */}
        {isPortrait && (
          <div className="flex-shrink-0 border-t-[0.25px] border-black" style={{ height: "5vh" }}>
            <LeftLower count={filtered.length} onSearch={handleSearch} activeApp={activeApp} onBack={() => setActiveApp("")} onUserInfoData={() => setActiveApp("userinfoapp")} onPayroll={() => setActiveApp("payroll")} onAccessControl={() => setActiveApp("accesscontrol")} />
          </div>
        )}
      </div>
    </div>
  );
}
