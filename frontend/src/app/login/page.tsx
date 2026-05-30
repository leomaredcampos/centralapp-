"use client";

import { useState } from "react";
import Image from "next/image";
import EmailStep from "./components/EmailStep";
import OtpStep from "./components/OtpStep";
import AuthenticatorStep from "./components/AuthenticatorStep";

type Step = "email" | "otp" | "totp";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<Step>("email");
  const [otpExpires, setOtpExpires] = useState(300);

  async function submitEmail() {
    if (!email) return { status: "error" };
    // This part of code calling the backend → /backend/credential/login.go → HandleLogin
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  }

  function handleOtpSent(expires: number) {
    setOtpExpires(expires);
    setStep("otp");
  }

  async function verifyOTP() {
    if (!otp) return { status: "error" };
    // This part of code calling the backend → /backend/credential/login.go → HandleVerifyOTP
    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (data.status === "verified") {
      localStorage.setItem("email", email);
      window.location.href = "/dashboard";
    }
    return data;
  }

  async function verifyTOTP(code: string) {
    // This part of code calling the backend → /backend/credential/totp.go → HandleVerifyTOTP
    const res = await fetch("/api/verify-totp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (data.status === "verified") {
      localStorage.setItem("email", email);
      localStorage.setItem("sessionid", data.sessionid);
      localStorage.setItem("authtype", "totp");
      window.location.href = "/dashboard";
    } else if (data.status === "max_sessions") {
      alert("Maximum of 3 active sessions reached.");
    }
    return data;
  }

  function handleEmailStepResult(data: { status: string; remaining?: number }) {
    if (data.status === "totp_required") setStep("totp");
    if (data.status === "otp_sent") handleOtpSent(data.remaining || 300);
    return data;
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-[#f5f5f5]">
      <div className="flex flex-col items-center bg-white p-[20px] pb-[40px] shadow-md">
        <Image src="/logo.png" alt="Logo" width={150} height={150} />
        {step === "email" && (
          <EmailStep
            email={email}
            setEmail={setEmail}
            onSubmit={async () => {
              const data = await submitEmail();
              return handleEmailStepResult(data);
            }}
          />
        )}
        {step === "otp" && (
          <OtpStep
            otp={otp}
            setOtp={setOtp}
            onSubmit={verifyOTP}
            expiresIn={otpExpires}
            onExpired={() => setStep("email")}
          />
        )}
        {step === "totp" && (
          <AuthenticatorStep onSubmit={verifyTOTP} />
        )}
      </div>
    </div>
  );
}
