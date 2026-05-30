"use client";

import { useRef } from "react";
import TwoFactorPage from "../../2fa/page";
import AppUserInfoRightBody, { UserInfoHandle } from "../../appuserinfo/rightbody/appuserinfoUSERDATA/page";

interface App {
  appname: string;
  buttonname: string;
}

interface Props {
  show2FA: boolean;
  apps: App[];
  activeApp: string;
  onAppClick: (appname: string) => void;
  userInfoRef?: React.RefObject<UserInfoHandle | null>;
}

export default function RightLower({ show2FA, apps, activeApp, onAppClick, userInfoRef }: Props) {
  if (show2FA) return (
    <div className="h-[93%] border border-gray-300 bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <TwoFactorPage />
    </div>
  );
  if (activeApp === "userinfoapp") return (
    <div className="h-[93%] border border-gray-300 p-[10px] flex bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <div className="flex-1 min-h-0">
        <AppUserInfoRightBody ref={userInfoRef} />
      </div>
    </div>
  );

  return (
    <div className="h-[93%] border border-gray-300 overflow-y-auto p-[20px] flex justify-center items-stretch bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <div className="w-[75%] h-full flex flex-col rounded-lg border border-gray-200 shadow-sm bg-white">
        <div className="px-[20px] py-[12px] border-b border-gray-200">
          <span className="text-[11pt] text-gray-500">{apps.length} accessible module{apps.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="p-[20px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}>
          <div className="flex flex-wrap gap-[10px] pr-[10px]">
            {apps.map((app) => (
              <div
                key={app.appname}
                onClick={() => onAppClick(app.appname)}
                className="group flex flex-col items-center justify-center w-[96px] h-[96px] rounded-xl border border-gray-200 bg-white shadow-sm cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" className="transition-all duration-200 group-hover:w-[44px] group-hover:h-[44px]">
                  <path d="M2 10a4 4 0 0 1 4-4h6l3 3h13a4 4 0 0 1 4 4v13a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V10z" fill="#FFCA28"/>
                  <path d="M2 14a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4v-9z" fill="#FFD54F"/>
                </svg>
                <span className="text-[11pt] text-center text-gray-600 transition-all duration-200 mt-[4px] px-[4px] leading-tight">
                  {app.buttonname}
                </span>
              </div>
            ))}
            {apps.length === 0 && (
              <p className="text-[11pt] text-gray-400 col-span-5">No modules available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
