"use client";

import { useRef, useState } from "react";
import { UserInfoHandle } from "../../appuserinfo/rightbody/appuserinfoUSERDATA/page";
import { useOrientation } from "../../dashboard/hooks/useOrientation";

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
  const layout = useOrientation();
  const isSmall = layout === "portrait-small";
  const [moduleSearch, setModuleSearch] = useState("");
  const [showModuleDropdown, setShowModuleDropdown] = useState(false);
  const moduleRef = useRef<HTMLDivElement>(null);

  const appList = userInfoRef?.current?.getAppList() ?? [];
  const selectedApps = userInfoRef?.current?.getSelectedApps() ?? [];
  const files = userInfoRef?.current?.getFiles() ?? null;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-wrap items-center px-[6px] md:px-[10px] gap-[4px] md:gap-[8px] overflow-hidden">
        <span className="shrink-0">{show2FA ? "2FA" : isUserInfo ? "Employee Info" : "Module"}</span>
        {isUserInfo && !show2FA && (
          <>
            <label className="text-blue-600 border-b-[0.25px] border-blue-600 cursor-pointer whitespace-nowrap">
              Choose File
              <input type="file" multiple accept="*" onChange={(e) => userInfoRef?.current?.setFiles(e.target.files)} className="hidden" />
            </label>
            <span className="text-black whitespace-nowrap">{files && files.length > 0 ? `${files.length} file(s)` : "No file"}</span>
            <button className={`${btnClass} whitespace-nowrap`}>Upload</button>
            <button onClick={() => userInfoRef?.current?.handleSave()} disabled={userInfoRef?.current?.loading} className={`${btnClass} whitespace-nowrap disabled:opacity-50`}>Save</button>
          </>
        )}
        <div className="ml-auto flex items-center gap-[4px] md:gap-[8px] shrink-0">
          {!isUserInfo && !show2FA && (
            <button onClick={on2FA} className="text-blue-600 bg-transparent border-none cursor-pointer hover:underline whitespace-nowrap">2FA</button>
          )}
          {!(isUserInfo && isSmall) && (
            <span className="truncate max-w-[120px] md:max-w-none">{email}</span>
          )}
        </div>
      </div>
    </div>
  );
}
