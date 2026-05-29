"use client";

import { useEffect, useState, useRef } from "react";
import LeftUpper from "./components/LeftUpper";
import LeftLower from "./components/LeftLower";
import RightUpper from "./components/RightUpper";
import RightLower from "./components/RightLower";
import { auditOpenModule } from "../centralizeaudit/auditdashboard/auditdashboard";
import { UserInfoHandle } from "../appuserinfo/rightbody/appuserinfoUSERDATA/page";

interface App {
  appname: string;
  buttonname: string;
}

export default function DashboardPage() {
  const [email, setEmail] = useState("");
  const [show2FA, setShow2FA] = useState(false);
  const [activeApp, setActiveApp] = useState("");
  const [apps, setApps] = useState<App[]>([]);
  const [filtered, setFiltered] = useState<App[]>([]);
  const [searchList, setSearchList] = useState<{emailx: string, fname: string, lname: string}[]>([]);
  const [searchVal, setSearchVal] = useState("");
  const [searchIndex, setSearchIndex] = useState(0);
  const userInfoRef = useRef<UserInfoHandle>(null);

  useEffect(() => {
    const stored = localStorage.getItem("email") || "";
    const authtype = localStorage.getItem("authtype");
    const sessionid = localStorage.getItem("sessionid");
    if (!stored) {
      window.location.href = "/login";
      return;
    }

    // This part of code calling the backend → /backend/credential/session.go or totpsession.go
    const checkUrl = authtype === "totp" && sessionid ? "/api/check-totp-session" : "/api/check-session";
    const checkBody = authtype === "totp" && sessionid
      ? JSON.stringify({ email: stored, sessionid })
      : JSON.stringify({ email: stored });

    fetch(checkUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: checkBody,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== "valid") {
          localStorage.removeItem("email");
          localStorage.removeItem("sessionid");
          localStorage.removeItem("authtype");
          window.location.href = "/login";
        } else {
          setEmail(stored);
          fetchApps(stored);
        }
      });

    // Periodic session check every 1 second
    const interval = setInterval(() => {
      const email = localStorage.getItem("email");
      const authtype = localStorage.getItem("authtype");
      const sessionid = localStorage.getItem("sessionid");
      if (!email) {
        window.location.href = "/login";
        return;
      }
      if (authtype === "totp" && sessionid) {
        // This part of code calling the backend → /backend/credential/totpsession.go → HandleCheckTOTPSession
        fetch("/api/check-totp-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, sessionid }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status !== "valid") {
              localStorage.removeItem("email");
              localStorage.removeItem("sessionid");
              localStorage.removeItem("authtype");
              window.location.href = "/login";
            }
          });
      } else {
        // This part of code calling the backend → /backend/credential/session.go → HandleCheckSession
        fetch("/api/check-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status !== "valid") {
              localStorage.removeItem("email");
              window.location.href = "/login";
            }
          });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  async function fetchApps(userEmail: string) {
    // This part of code calling the backend → /backend/apps/apps.go → HandleGetApps
    const res = await fetch("/api/get-apps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail }),
    });
    const data = await res.json();
    setApps(data);
    setFiltered(data);

    // This part of code calling the backend → /backend/appuserinfo/rightbody/appuserinfoUSERDATA/userdata.go → HandleListUsers
    const res2 = await fetch("/api/appuserinfo/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data2 = await res2.json();
    setSearchList(Array.isArray(data2) ? data2 : []);
  }

  function handlePrev() {
    if (searchList.length === 0) return;
    const prev = (searchIndex - 1 + searchList.length) % searchList.length;
    setSearchIndex(prev);
    setSearchVal(searchList[prev].emailx);
  }

  function handleNext() {
    if (searchList.length === 0) return;
    const next = (searchIndex + 1) % searchList.length;
    setSearchIndex(next);
    setSearchVal(searchList[next].emailx);
  }

  function handleSearch(query: string) {
    if (!query.trim()) {
      setFiltered(apps);
      return;
    }
    const q = query.toLowerCase();
    const result = apps.filter((a) =>
      a.buttonname.toLowerCase().includes(q)
    );
    setFiltered(result);
  }

  return (
    <div className="flex w-screen h-screen">
      <div className="flex flex-col w-[15%] h-full">
        <LeftUpper />
        <LeftLower count={filtered.length} onSearch={handleSearch} activeApp={activeApp} onBack={() => setActiveApp("")} onUserInfoData={() => setActiveApp("userinfoapp")} onPayroll={() => setActiveApp("payroll")} onAccessControl={() => setActiveApp("accesscontrol")} />
      </div>
      <div className="flex flex-col w-[85%] h-full">
        <RightUpper email={email} show2FA={show2FA} activeApp={activeApp} on2FA={() => setShow2FA(!show2FA)} onBack={() => { setActiveApp(""); setShow2FA(false); }} searchList={searchList} searchVal={searchVal} onSearchChange={setSearchVal} onPrev={handlePrev} onNext={handleNext} userInfoRef={userInfoRef} />
        <RightLower show2FA={show2FA} apps={filtered} activeApp={activeApp} onAppClick={(appname) => { auditOpenModule(email, appname.trim()); setActiveApp(appname.trim()); }} userInfoRef={userInfoRef} />
      </div>
    </div>
  );
}
