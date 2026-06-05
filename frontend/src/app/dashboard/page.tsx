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

export default function DashboardPage() {
  const [email, setEmail] = useState("");
  const [show2FA, setShow2FA] = useState(false);
  const [activeApp, setActiveApp] = useState("");
  const userInfoRef = useRef<UserInfoHandle>(null);

  const { filtered, searchList, loadApps, handleSearch } = useDashboardData();
  const { searchVal, setSearchVal, handlePrev, handleNext } = useSearchNavigation(searchList);

  useSessionCheck((validEmail) => {
    setEmail(validEmail);
    loadApps(validEmail);
  });

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      {/* Left Sidebar - full width on mobile, 15% on desktop */}
      <div className="flex flex-col w-full md:w-[15%] h-auto md:h-screen border-b-[0.25px] md:border-b-0 md:border-r-[0.25px] border-black">
        <LeftUpper />
        <div className="border-t-[0.25px] border-black" />
        <LeftLower count={filtered.length} onSearch={handleSearch} activeApp={activeApp} onBack={() => setActiveApp("")} onUserInfoData={() => setActiveApp("userinfoapp")} onPayroll={() => setActiveApp("payroll")} onAccessControl={() => setActiveApp("accesscontrol")} />
      </div>
      {/* Right Content - full width on mobile, 85% on desktop */}
      <div className="flex flex-col w-full md:w-[85%] h-auto md:h-screen">
        <RightUpper email={email} show2FA={show2FA} activeApp={activeApp} on2FA={() => setShow2FA(!show2FA)} onBack={() => { setActiveApp(""); setShow2FA(false); }} searchList={searchList} searchVal={searchVal} onSearchChange={setSearchVal} onPrev={handlePrev} onNext={handleNext} userInfoRef={userInfoRef} />
        <div className="border-t-[0.25px] border-black" />
        <RightLower show2FA={show2FA} apps={filtered} activeApp={activeApp} onAppClick={(appname) => { auditOpenModule(email, appname.trim()); setActiveApp(appname.trim()); }} userInfoRef={userInfoRef} />
      </div>
    </div>
  );
}
