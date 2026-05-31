import { useState, useEffect } from "react";
import { checkTOTPStatus as checkStatus } from "./checkStatus";

export function useTOTPStatus() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    loadStatus();
  }, []);

  async function loadStatus() {
    setChecking(true);
    const data = await checkStatus();
    setChecking(false);
    setIsEnabled(data.enabled);
  }

  return { isEnabled, checking, setIsEnabled };
}
