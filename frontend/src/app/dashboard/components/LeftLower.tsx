"use client";

import { useRouter } from "next/navigation";

interface Props {
  count: number;
  onSearch: (query: string) => void;
  activeApp: string;
  onBack: () => void;
  onUserInfoData?: () => void;
  onPayroll?: () => void;
  onAccessControl?: () => void;
}

export default function LeftLower({ count, onSearch, activeApp, onBack, onUserInfoData, onPayroll, onAccessControl }: Props) {
  const router = useRouter();
  const btnClass = "w-full p-[2px] leading-none bg-transparent border-t-0 border-b-[0.25px] border-black border-l-0 border-r-0 cursor-pointer text-black hover:bg-gray-50 transition-all duration-200 hover:scale-105 hover:font-medium";

  return (
    <div className="h-full flex flex-col p-[10px] gap-[8px]">
      {activeApp ? (
        <>
          <button onClick={() => router.push("/appuserinfo")} className={btnClass}>User Info Data</button>
          <button onClick={() => router.push("/payroll")} className={btnClass}>Payroll Computation</button>
          <button onClick={() => router.push("/accesscontrol")} className={btnClass}>Access Control</button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Search Module..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full p-[6px] border-[0.25px] border-black outline-none rounded"
          />
          <div className="text-center text-black bg-gray-50 rounded p-[6px]">
            {count} module(s) available
          </div>
        </>
      )}
      <div className="flex-1" />
      <button
        onClick={async () => {
          const email = localStorage.getItem("email");
          const authtype = localStorage.getItem("authtype");
          const sessionid = localStorage.getItem("sessionid");
          if (authtype === "totp" && sessionid) {
            await fetch("/api/delete-totp-session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, sessionid }),
            });
          } else {
            await fetch("/api/logout", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            });
          }
          localStorage.removeItem("email");
          localStorage.removeItem("sessionid");
          localStorage.removeItem("authtype");
          window.location.href = "/login";
        }}
        className="w-full p-[4px] md:p-[2px] leading-none bg-transparent border-t-0 border-b-[0.25px] border-[#ff0000] border-l-0 border-r-0 cursor-pointer text-[#ff0000] hover:bg-red-50 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}
