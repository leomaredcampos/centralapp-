"use client";

import { useEffect } from "react";
import LoginLogo from "./components/LoginLogo";
import EmailStep from "./components/EmailStep";
import OtpStep from "./components/OtpStep";
import AuthenticatorStep from "./components/AuthenticatorStep";
import { useLoginState } from "./hooks/useLoginState";
import { useLoginFlow } from "./hooks/useLoginFlow";
import { useOrientation } from "../dashboard/hooks/useOrientation";

export default function LoginPage() {
  const { email, setEmail, otp, setOtp, step, setStep, otpExpires, handleEmailStepResult } = useLoginState();
  const { handleEmailSubmit, handleOTPVerify, handleTOTPVerify } = useLoginFlow(email, otp);
  const isPortrait = useOrientation();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (isPortrait) {
      html.style.cssText = "overflow: auto; height: auto; width: 100%;";
      body.style.cssText = "overflow: auto; height: auto; width: 100%; position: relative; top: auto; left: auto; font-size: 12pt; font-family: Calibri, sans-serif;";
    }
    return () => {
      html.style.cssText = "";
      body.style.cssText = "";
    };
  }, [isPortrait]);

  const stepContent = (
    <>
      {step === "email" && (
        <EmailStep email={email} setEmail={setEmail} onSubmit={async () => { const data = await handleEmailSubmit(); return handleEmailStepResult(data); }} />
      )}
      {step === "otp" && (
        <OtpStep otp={otp} setOtp={setOtp} onSubmit={handleOTPVerify} expiresIn={otpExpires} onExpired={() => setStep("email")} />
      )}
      {step === "totp" && (
        <AuthenticatorStep onSubmit={handleTOTPVerify} />
      )}
    </>
  );

  if (isPortrait) {
    return (
      <div style={{ width: "100vw", minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "white", padding: "40px 24px", fontSize: "12pt", gap: "16px" }}>
        <div style={{ marginBottom: "24px" }}>
          <LoginLogo />
        </div>
        {stepContent}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100dvh", width: "100%", background: "#f5f5f5", fontSize: "12pt" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "white", padding: "20px 20px 40px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <LoginLogo />
        {stepContent}
      </div>
    </div>
  );
}
