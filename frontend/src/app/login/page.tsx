"use client";

import LoginLogo from "./components/LoginLogo";
import EmailStep from "./components/EmailStep";
import OtpStep from "./components/OtpStep";
import AuthenticatorStep from "./components/AuthenticatorStep";
import { useLoginState } from "./hooks/useLoginState";
import { useLoginFlow } from "./hooks/useLoginFlow";

export default function LoginPage() {
  const { email, setEmail, otp, setOtp, step, setStep, otpExpires, handleEmailStepResult } = useLoginState();
  const { handleEmailSubmit, handleOTPVerify, handleTOTPVerify } = useLoginFlow(email, otp);

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#f5f5f5]">
      <div className="flex flex-col items-center bg-white p-[20px] pb-[40px] shadow-md">
        <LoginLogo />
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
      </div>
    </div>
  );
}