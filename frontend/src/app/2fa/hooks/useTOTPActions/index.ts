import { useState } from "react";
import { disableTOTP } from "./disable";

export function useTOTPActions() {
  const [loading, setLoading] = useState(false);

  async function handleDisable() {
    setLoading(true);
    const data = await disableTOTP();
    setLoading(false);
    return data;
  }

  return { loading, handleDisable };
}
