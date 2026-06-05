"use client";

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

  const stepContent = (
    <>
      {step === "email" && (
        <EmailStep
          email={email}
          setEmail={setEmail}
          onSubmit={async () => {
            const data = await handleEmailSubmit();
            return handleEmailStepResult(data);
          }}
        />
      )}
      {step === "otp" && (
        <OtpStep
          otp={otp}
          setOtp={setOtp}
          onSubmit={handleOTPVerify}
          expiresIn={otpExpires}
          onExpired={() => setStep("email")}
        />
      )}
      {step === "totp" && (
        <AuthenticatorStep onSubmit={handleTOTPVerify} />
      )}
    </>
  );

  // ─── PORTRAIT LAYOUT ───────────────────────────────────────────────
  if (isPortrait) {
    return (
      <div style={{ width: "100dvw", height: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f5f5f5", fontSize: "14pt" }}>
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "white", padding: "20px" }}>
          <LoginLogo />
          {stepContent}
        </div>
      </div>
    );
  }

  // ─── LANDSCAPE LAYOUT ──────────────────────────────────────────────
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100dvh", width: "100%", background: "#f5f5f5", fontSize: "14pt" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "white", padding: "20px 20px 40px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <LoginLogo />
        {stepContent}
      </div>
    </div>
  );
}
