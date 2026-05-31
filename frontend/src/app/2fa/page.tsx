"use client";

import EnabledView from "./components/EnabledView";
import DisabledView from "./components/DisabledView";
import SetupView from "./components/SetupView";
import { useTOTPStatus } from "./hooks/useTOTPStatus";
import { useTOTPSetup } from "./hooks/useTOTPSetup";
import { useTOTPActions } from "./hooks/useTOTPActions";

export default function TwoFactorPage() {
  const { isEnabled, checking, setIsEnabled } = useTOTPStatus();
  const { qr, code, setCode, loading: setupLoading, handleSetup, handleVerify, reset } = useTOTPSetup();
  const { loading: actionLoading, handleDisable } = useTOTPActions();

  async function onVerify() {
    const data = await handleVerify();
    if (data.status === "verified") {
      setIsEnabled(true);
      reset();
    } else {
      alert("Invalid code");
    }
  }

  async function onDisable() {
    const data = await handleDisable();
    if (data.status === "disabled") {
      setIsEnabled(false);
      reset();
    }
  }

  if (checking) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[10.5pt] text-[#333]">Loading...</p>
      </div>
    );
  }

  if (isEnabled) {
    return <EnabledView onDisable={onDisable} loading={actionLoading} />;
  }

  if (!qr) {
    return <DisabledView onSetup={handleSetup} loading={setupLoading} />;
  }

  return <SetupView qr={qr} code={code} setCode={setCode} onVerify={onVerify} loading={setupLoading} />;
}
