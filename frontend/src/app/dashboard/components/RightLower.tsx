"use client";

import { useRef } from "react";
import TwoFactorPage from "../../2fa/page";
import AppUserInfoRightBody, { UserInfoHandle } from "../../appuserinfo/rightbody/appuserinfoUSERDATA/page";
import { useOrientation } from "../../dashboard/hooks/useOrientation";

interface App {
  appname: string;
  buttonname: string;
}

interface LeftLowerProps {
  count: number;
  onSearch: (query: string) => void;
  activeApp: string;
  onBack: () => void;
  onUserInfoData?: () => void;
  onPayroll?: () => void;
  onAccessControl?: () => void;
}

interface Props {
  show2FA: boolean;
  apps: App[];
  activeApp: string;
  onAppClick: (appname: string) => void;
  userInfoRef?: React.RefObject<UserInfoHandle | null>;
  leftLowerProps?: LeftLowerProps;
}

export default function RightLower({ show2FA, apps, activeApp, onAppClick, userInfoRef, leftLowerProps }: Props) {
  const layout = useOrientation();
  const cols = layout === "portrait-small" ? 3 : 5;
  if (show2FA) return (
    <div className="h-full bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <TwoFactorPage />
    </div>
  );
  if (activeApp === "userinfoapp") return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <AppUserInfoRightBody ref={userInfoRef} />
    </div>
  );

  if (activeApp === "logisticapp") return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden" }} />
  );

  return (
    <div className="h-full overflow-y-auto p-[10px] md:p-[20px] flex justify-center items-stretch bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <div className="w-full md:w-[75%] h-full flex flex-col rounded-lg border-[0.25px] border-black shadow-sm bg-white">
        <div className="px-[10px] md:px-[20px] py-[8px] md:py-[12px] border-b-[0.25px] border-black">
          <span className="text-black">{apps.length} accessible module{apps.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="p-[10px] md:p-[20px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "6px" }}>
            {apps.map((app) => (
              <div
                key={app.appname}
                onClick={() => onAppClick(app.appname)}
                className="group flex flex-col items-center justify-center aspect-square rounded-xl border-[0.25px] border-black bg-white shadow-sm cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md p-[4px]"
                style={{ maxWidth: "100px", maxHeight: "100px", margin: "0 auto", width: "100%" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="37.5%" height="37.5%" viewBox="0 0 36 36" className="transition-all duration-200 group-hover:w-[45.8%] group-hover:h-[45.8%] shrink-0">
                  <path d="M2 10a4 4 0 0 1 4-4h6l3 3h13a4 4 0 0 1 4 4v13a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V10z" fill="#FFCA28"/>
                  <path d="M2 14a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4v-9z" fill="#FFD54F"/>
                </svg>
                <span className="text-center text-black transition-all duration-200 mt-[2px] px-[2px] leading-tight line-clamp-2">
                  {app.buttonname}
                </span>
              </div>
            ))}
            {apps.length === 0 && (
              <p className="text-black col-span-full text-center py-[20px]">No modules available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
