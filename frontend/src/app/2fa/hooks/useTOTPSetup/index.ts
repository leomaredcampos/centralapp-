import { useState } from "react";
import { setupTOTP } from "./setup";
import { verifyTOTPSetup } from "./verify";

export function useTOTPSetup() {
  const [qr, setQr] = useState("");
  const [code, setCode] = useState("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSetup() {
    setLoading(true);
    const data = await setupTOTP();
    setLoading(false);
    if (data) {
      setQr(data.qr);
      setSecret(data.secret);
    }
  }

  async function handleVerify() {
    setLoading(true);
    const data = await verifyTOTPSetup(code, secret);
    setLoading(false);
    return data;
  }

  function reset() {
    setQr("");
    setCode("");
    setSecret("");
  }

  return { qr, code, setCode, loading, handleSetup, handleVerify, reset };
}
