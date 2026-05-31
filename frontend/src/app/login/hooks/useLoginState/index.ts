import { useState } from "react";

type Step = "email" | "otp" | "totp";

export function useLoginState() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<Step>("email");
  const [otpExpires, setOtpExpires] = useState(300);

  function handleOtpSent(expires: number) {
    setOtpExpires(expires);
    setStep("otp");
  }

  function handleEmailStepResult(data: { status: string; remaining?: number }) {
    if (data.status === "totp_required") setStep("totp");
    if (data.status === "otp_sent") handleOtpSent(data.remaining || 300);
    return data;
  }

  return { email, setEmail, otp, setOtp, step, setStep, otpExpires, handleEmailStepResult };
}
