"use client";

import { useRef, useState } from "react";
import { UserInfoHandle } from "../../appuserinfo/rightbody/appuserinfoUSERDATA/page";

interface Props {
  email: string;
  show2FA: boolean;
  activeApp: string;
  on2FA: () => void;
  onBack?: () => void;
  searchList?: { emailx: string; fname: string; lname: string }[];
  searchVal?: string;
  onSearchChange?: (val: string) => void;
  onPrev?: () => void;
  onNext?: () => void;
  userInfoRef?: React.RefObject<UserInfoHandle | null>;
}

const btnClass = "px-[8px] py-[1px] bg-white border-[0.25px] border-black cursor-pointer hover:bg-gray-50";

export default function RightUpper({ email, show2FA, activeApp, on2FA, onBack, searchList = [], searchVal = "", onSearchChange, onPrev, onNext, userInfoRef }: Props) {
  const isUserInfo = activeApp === "userinfoapp";
  const [moduleSearch, setModuleSearch] = useState("");
  const [showModuleDropdown, setShowModuleDropdown] = useState(false);
  const moduleRef = useRef<HTMLDivElement>(null);

  const appList = userInfoRef?.current?.getAppList() ?? [];
  const selectedApps = userInfoRef?.current?.getSelectedApps() ?? [];
  const files = userInfoRef?.current?.getFiles() ?? null;
  const filteredApps = appList.filter((a) => a.buttonname.toLowerCase().includes(moduleSearch.toLowerCase()));
  const selectedLabels = appList.filter((a) => selectedApps.includes(a.appname)).map((a) => a.buttonname).join(", ");

  return (
    <div className="h-[7%] border-[0.25px] border-black flex flex-col">
      {/* Row 1 */}
      <div className="flex-1 flex items-center px-[10px] gap-[8px] border-b-[0.25px] border-black">
        <span>{show2FA ? "2FA" : isUserInfo ? "Employee Information App" : "Module"}</span>
        {isUserInfo && !show2FA && (
          <>
            <label className="text-blue-600 border-b-[0.25px] border-blue-600 cursor-pointer">
              Choose File
              <input type="file" multiple accept="*" onChange={(e) => userInfoRef?.current?.setFiles(e.target.files)} className="hidden" />
            </label>
            <span className="text-black">{files && files.length > 0 ? `${files.length} file(s)` : "No file"}</span>
            <button className={btnClass}>Upload</button>
            <button onClick={() => userInfoRef?.current?.handleSave()} disabled={userInfoRef?.current?.loading} className={`${btnClass} disabled:opacity-50`}>Save</button>
          </>
        )}
        <div className="ml-auto flex items-center gap-[8px]">
          {!isUserInfo && !show2FA && (
            <button onClick={on2FA} className="text-blue-600 bg-transparent border-none cursor-pointer hover:underline">
              2FA
            </button>
          )}
          {(isUserInfo || show2FA) && (
            <button onClick={onBack} className="text-black bg-transparent border-none cursor-pointer hover:underline">
              ← Back
            </button>
          )}
          <span>{email}</span>
        </div>
      </div>

      {/* Row 2 removed */}
    </div>
  );
}
