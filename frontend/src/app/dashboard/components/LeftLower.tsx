"use client";

import { useState, useRef, useEffect } from "react";
import { useOrientation } from "../hooks/useOrientation";

interface App {
  appname: string;
  buttonname: string;
}

interface Props {
  count: number;
  onSearch: (query: string) => void;
  activeApp: string;
  onBack: () => void;
  onUserInfoData?: () => void;
  onPayroll?: () => void;
  onAccessControl?: () => void;
  apps?: App[];
  onAppClick?: (appname: string) => void;
  searchVal?: string;
  onSearchChange?: (val: string) => void;
}

export default function LeftLower({ count, onSearch, activeApp, onBack, onUserInfoData, onPayroll, onAccessControl, apps = [], onAppClick, searchVal = "", onSearchChange }: Props) {
  const isPortrait = useOrientation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered = searchVal ? apps.filter(a => a.buttonname.toLowerCase().includes(searchVal.toLowerCase())) : apps;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    const email = localStorage.getItem("email");
    const authtype = localStorage.getItem("authtype");
    const sessionid = localStorage.getItem("sessionid");
    if (authtype === "totp" && sessionid) {
      await fetch("/api/delete-totp-session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, sessionid }) });
    } else {
      await fetch("/api/logout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    }
    localStorage.removeItem("email");
    localStorage.removeItem("sessionid");
    localStorage.removeItem("authtype");
    window.location.href = "/login";
  }

  const mainBtn = (
    <button onClick={onBack} style={{ background: "transparent", border: "none", borderBottom: "0.25px solid #2563eb", cursor: "pointer", color: "#2563eb", padding: "2px", fontSize: "inherit", whiteSpace: "nowrap" }}>Main</button>
  );

  const logoutBtn = (
    <button onClick={handleLogout} style={{ background: "transparent", border: "none", borderBottom: "0.25px solid #ff0000", cursor: "pointer", color: "#ff0000", padding: "2px", fontSize: "inherit", whiteSpace: "nowrap" }}>Logout</button>
  );

  const comboBox = (
    <div ref={dropdownRef} style={{ position: "relative", flex: 1 }}>
      <input
        type="text"
        value={searchVal}
        placeholder="Search Module..."
        onChange={(e) => { onSearchChange?.(e.target.value); onSearch(e.target.value); setShowDropdown(true); }}
        onFocus={() => setShowDropdown(true)}
        style={{ width: "100%", padding: "2px 6px", border: "0.25px solid black", outline: "none", borderRadius: "4px", fontSize: "inherit", boxSizing: "border-box" }}
      />
      {showDropdown && filtered.length > 0 && (
        <div style={{ position: "absolute", bottom: isPortrait ? "100%" : "auto", top: isPortrait ? "auto" : "100%", left: 0, right: 0, background: "white", border: "0.25px solid black", maxHeight: "200px", overflowY: "auto", zIndex: 50 }}>
          {filtered.map(app => (
            <div key={app.appname} onClick={() => { onAppClick?.(app.appname); onSearchChange?.(app.buttonname); setShowDropdown(false); }}
              style={{ padding: "4px 8px", cursor: "pointer", borderBottom: "0.25px solid #eee" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
              onMouseLeave={e => (e.currentTarget.style.background = "white")}>
              {app.buttonname}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const isMainOnly = activeApp === "2fa" || activeApp === "logisticapp";
  const isUserInfoApp = activeApp === "userinfoapp";

  // ─── PORTRAIT ─────────────────────────────────────────────────────
  if (isPortrait) {
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "row", alignItems: "flex-start", justifyContent: "center", gap: "8px", padding: "4px 10px", flexWrap: "wrap", alignContent: "flex-start" }}>
        {isMainOnly ? mainBtn :
          activeApp ? (
            <>
              <button onClick={onUserInfoData} style={{ background: "transparent", border: "none", borderBottom: "0.25px solid black", cursor: "pointer", padding: "2px", fontSize: "inherit", whiteSpace: "nowrap" }}>User Info Data</button>
              <button onClick={onPayroll} style={{ background: "transparent", border: "none", borderBottom: "0.25px solid black", cursor: "pointer", padding: "2px", fontSize: "inherit", whiteSpace: "nowrap" }}>Payroll Computation</button>
              <button onClick={onAccessControl} style={{ background: "transparent", border: "none", borderBottom: "0.25px solid black", cursor: "pointer", padding: "2px", fontSize: "inherit", whiteSpace: "nowrap" }}>Access Control</button>
              {mainBtn}
            </>
          ) : (
            <>
              {comboBox}
              {logoutBtn}
            </>
          )}
      </div>
    );
  }

  // ─── LANDSCAPE ────────────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col p-[10px] gap-[8px]">
      {!isMainOnly && activeApp && (
        <>
          <button onClick={onUserInfoData} className="w-full p-[2px] leading-none bg-transparent border-t-0 border-b-[0.25px] border-black border-l-0 border-r-0 cursor-pointer text-black hover:bg-gray-50">User Info Data</button>
          <button onClick={onPayroll} className="w-full p-[2px] leading-none bg-transparent border-t-0 border-b-[0.25px] border-black border-l-0 border-r-0 cursor-pointer text-black hover:bg-gray-50">Payroll Computation</button>
          <button onClick={onAccessControl} className="w-full p-[2px] leading-none bg-transparent border-t-0 border-b-[0.25px] border-black border-l-0 border-r-0 cursor-pointer text-black hover:bg-gray-50">Access Control</button>
        </>
      )}
      {!activeApp && (
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <input type="text" value={searchVal} placeholder="Search Module..."
            onChange={(e) => { onSearchChange?.(e.target.value); onSearch(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            className="w-full p-[6px] border-[0.25px] border-black outline-none rounded" style={{ fontSize: "inherit" }} />
          {showDropdown && filtered.length > 0 && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "white", border: "0.25px solid black", maxHeight: "200px", overflowY: "auto", zIndex: 50 }}>
              {filtered.map(app => (
                <div key={app.appname} onClick={() => { onAppClick?.(app.appname); onSearchChange?.(app.buttonname); setShowDropdown(false); }}
                  style={{ padding: "4px 8px", cursor: "pointer", borderBottom: "0.25px solid #eee" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
                  onMouseLeave={e => (e.currentTarget.style.background = "white")}>
                  {app.buttonname}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="flex-1" />
      {activeApp ? (
        <button onClick={onBack} className="w-full p-[4px] leading-none bg-transparent border-t-0 border-b-[0.25px] border-blue-600 border-l-0 border-r-0 cursor-pointer text-blue-600 hover:bg-blue-50">Main</button>
      ) : (
        <button onClick={handleLogout} className="w-full p-[4px] leading-none bg-transparent border-t-0 border-b-[0.25px] border-[#ff0000] border-l-0 border-r-0 cursor-pointer text-[#ff0000] hover:bg-red-50">Logout</button>
      )}
    </div>
  );
}
