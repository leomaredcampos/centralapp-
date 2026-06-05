"use client";

import { useRef } from "react";
import AppUserInfoRightBody, { UserInfoHandle } from "./rightbody/appuserinfoUSERDATA/page";

export default function AppUserInfoPage() {
  const userInfoRef = useRef<UserInfoHandle>(null);
  return (
    <div style={{ width: "100dvw", height: "100dvh", overflow: "hidden" }}>
      <AppUserInfoRightBody ref={userInfoRef} />
    </div>
  );
}
