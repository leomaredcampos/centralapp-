"use client";

import { useEffect, useState, useRef } from "react";
import LoginLogo from "./components/LoginLogo";
import { useLoginState } from "./hooks/useLoginState";
import { useLoginFlow } from "./hooks/useLoginFlow";
import { useOrientation } from "../dashboard/hooks/useOrientation";
import MessageModal from "./components/MessageModal";

export default function LoginPage() {
  const { email, setEmail, otp, setOtp, step, setStep, otpExpires, handleEmailStepResult } = useLoginState();
  const { handleEmailSubmit, handleOTPVerify, handleTOTPVerify } = useLoginFlow(email, otp);
  const layout = useOrientation();
  const isPortrait = layout !== "landscape";
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const otpRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (isPortrait) {
      html.style.cssText = "overflow: auto; height: auto; width: 100%;";
      body.style.cssText = "overflow: auto; height: auto; width: 100%; position: relative; top: auto; left: auto; font-size: 9.5pt; font-family: Calibri, sans-serif;";
    }
    return () => { html.style.cssText = ""; body.style.cssText = ""; };
  }, [isPortrait]);

  function closeModal() {
    setModalMessage("");
    if (step === "email") { setEmail(""); setTimeout(() => emailRef.current?.focus(), 0); }
    else if (step === "otp") { setOtp(""); setTimeout(() => otpRef.current?.focus(), 0); }
    else { setCode(""); setTimeout(() => codeRef.current?.focus(), 0); }
  }

  async function onContinue() {
    setLoading(true);
    if (step === "email") {
      const data = await handleEmailSubmit();
      if (data.status === "not_found") setModalMessage("Email not found.");
      else if (data.status === "locked") setModalMessage("This account is currently in use.");
      else handleEmailStepResult(data);
    } else if (step === "otp") {
      const data = await handleOTPVerify();
      if (data.status === "invalid_otp") setModalMessage("Invalid OTP.");
    } else if (step === "totp") {
      const data = await handleTOTPVerify(code);
      if (data.status === "invalid") setModalMessage("Invalid authenticator code.");
      else if (data.status === "max_sessions") setModalMessage("Maximum of 3 active sessions reached.");
    }
    setLoading(false);
  }

  const title = step === "email" ? "Login" : step === "otp" ? "Verification" : "Authenticator";
  const btnLabel = step === "email" ? "Continue" : "Verify";
  const inputEl = step === "email" ? (
    <>
      <input ref={emailRef} autoFocus type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onContinue()} placeholder="Email Address" style={{ width: "95vw", padding: "4px", border: "0.25px solid black", outline: "none", textAlign: "center", fontSize: "inherit" }} />
      <p style={{ margin: "4px 0 0 0", color: "black" }}>Email Address</p>
    </>
  ) : step === "otp" ? (
    <>
      <input ref={otpRef} autoFocus type="text" value={otp} onChange={(e) => setOtp(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onContinue()} maxLength={6} placeholder="Enter OTP" style={{ width: "95vw", padding: "4px", border: "0.25px solid black", outline: "none", textAlign: "center", letterSpacing: "4px", fontSize: "inherit" }} />
      <p style={{ margin: "4px 0 0 0", color: "black" }}>OTP</p>
    </>
  ) : (
    <>
      <input ref={codeRef} autoFocus type="text" value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onContinue()} maxLength={6} placeholder="Enter Code" style={{ width: "95vw", padding: "4px", border: "0.25px solid black", outline: "none", textAlign: "center", letterSpacing: "4px", fontSize: "inherit" }} />
      <p style={{ margin: "4px 0 0 0", color: "black" }}>Authenticator Code</p>
    </>
  );

  if (isPortrait) {
    return (
      <div style={{ width: "100vw", height: "100dvh", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "white", fontSize: "9.5pt", padding: "40px 24px" }}>
        {modalMessage && <MessageModal message={modalMessage} onClose={closeModal} />}
        {/* TOP */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <LoginLogo />
          <p style={{ margin: "4px 0 0 0", color: "black" }}>{title}</p>
        </div>
        {/* MIDDLE */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {inputEl}
        </div>
        {/* BOTTOM */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <button onClick={onContinue} disabled={loading} style={{ width: "95vw", padding: "6px", background: "white", border: "none", borderTop: "0.25px solid black", borderBottom: "0.25px solid black", cursor: "pointer", fontSize: "inherit" }}>
            {btnLabel}
          </button>
        </div>
      </div>
    );
  }

  // LANDSCAPE
  const stepContent = step === "email" ? (
    <>
      <p style={{ margin: "5px 0", textAlign: "center", color: "black" }}>Login</p>
      <input ref={emailRef} autoFocus type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onContinue()} placeholder="Email Address" style={{ width: "500px", padding: "4px", border: "0.25px solid black", outline: "none", textAlign: "center", fontSize: "inherit" }} />
      <p style={{ margin: "2px 0 0 0", textAlign: "center", color: "black" }}>Email Address</p>
      <button onClick={onContinue} disabled={loading} style={{ width: "500px", padding: "4px", background: "white", border: "none", borderTop: "0.25px solid black", borderBottom: "0.25px solid black", cursor: "pointer", marginTop: "15px", fontSize: "inherit" }}>Continue</button>
    </>
  ) : step === "otp" ? (
    <>
      <p style={{ margin: "5px 0", textAlign: "center", color: "black" }}>Verification</p>
      <input ref={otpRef} autoFocus type="text" value={otp} onChange={(e) => setOtp(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onContinue()} maxLength={6} placeholder="Enter OTP" style={{ width: "500px", padding: "4px", border: "0.25px solid black", outline: "none", textAlign: "center", letterSpacing: "4px", fontSize: "inherit" }} />
      <p style={{ margin: "2px 0 0 0", textAlign: "center", color: "black" }}>OTP</p>
      <button onClick={onContinue} disabled={loading} style={{ width: "500px", padding: "4px", background: "white", border: "none", borderTop: "0.25px solid black", borderBottom: "0.25px solid black", cursor: "pointer", marginTop: "15px", fontSize: "inherit" }}>Verify</button>
    </>
  ) : (
    <>
      <p style={{ margin: "5px 0", textAlign: "center", color: "black" }}>Authenticator</p>
      <input ref={codeRef} autoFocus type="text" value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onContinue()} maxLength={6} placeholder="Enter Code" style={{ width: "500px", padding: "4px", border: "0.25px solid black", outline: "none", textAlign: "center", letterSpacing: "4px", fontSize: "inherit" }} />
      <p style={{ margin: "2px 0 0 0", textAlign: "center", color: "black" }}>Authenticator Code</p>
      <button onClick={onContinue} disabled={loading} style={{ width: "500px", padding: "4px", background: "white", border: "none", borderTop: "0.25px solid black", borderBottom: "0.25px solid black", cursor: "pointer", marginTop: "15px", fontSize: "inherit" }}>Verify</button>
    </>
  );

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100dvh", width: "100%", background: "#f5f5f5", fontSize: "12pt" }}>
      {modalMessage && <MessageModal message={modalMessage} onClose={closeModal} />}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "white", padding: "40px 60px 60px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <LoginLogo />
        {stepContent}
      </div>
    </div>
  );
}
