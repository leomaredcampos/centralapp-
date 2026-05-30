"use client";

import { useEffect, useState } from "react";

export default function TwoFactorPage() {
  const [qr, setQr] = useState("");
  const [code, setCode] = useState("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkTOTPStatus();
  }, []);

  async function checkTOTPStatus() {
    const email = localStorage.getItem("email");
    if (!email) return;
    setChecking(true);
    // This part of code calling the backend → /backend/credential/totp.go → HandleCheckTOTPStatus
    const res = await fetch("/api/check-totp-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setChecking(false);
    setIsEnabled(data.enabled);
  }

  async function handleSetup() {
    const email = localStorage.getItem("email");
    if (!email) return;
    setLoading(true);
    // This part of code calling the backend → /backend/credential/totp.go → HandleSetupTOTP
    const res = await fetch("/api/setup-totp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.uri) {
      setQr(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.uri)}`);
      setSecret(data.secret);
    }
  }

  async function handleVerify() {
    const email = localStorage.getItem("email");
    if (!email || !code) return;
    setLoading(true);
    // This part of code calling the backend → /backend/credential/totp.go → HandleVerifyTOTPSetup
    const res = await fetch("/api/verify-totp-setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, secret }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.status === "verified") {
      setIsEnabled(true);
      setQr("");
      setCode("");
    } else {
      alert("Invalid code");
    }
  }

  async function handleDisable() {
    const email = localStorage.getItem("email");
    if (!email) return;
    setLoading(true);
    // This part of code calling the backend → /backend/credential/totp.go → HandleDisableTOTP
    const res = await fetch("/api/disable-totp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.status === "disabled") {
      setIsEnabled(false);
      setQr("");
      setCode("");
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
    return (
      <div className="flex flex-col items-center justify-center h-full gap-[10px]">
        <p className="text-[10.5pt] text-[#333]">2FA is enabled.</p>
        <button
          onClick={handleDisable}
          disabled={loading}
          className="w-[350px] text-[9pt] p-[2px] leading-none bg-white border-t border-b border-[#ff0000] border-l-0 border-r-0 cursor-pointer text-[#ff0000] hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Disable
        </button>
        <button
          onClick={() => window.location.reload()}
          className="w-[350px] text-[9pt] p-[2px] leading-none bg-white border-t border-b border-[#333] border-l-0 border-r-0 cursor-pointer hover:bg-[#f0f0f0] transition-colors"
        >
          ← Back
        </button>
      </div>
    );
  }

  if (!qr) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-[10px]">
        <p className="text-[10.5pt] text-[#333]">2FA is not enabled.</p>
        <button
          onClick={handleSetup}
          disabled={loading}
          className="w-[350px] text-[9pt] p-[2px] leading-none bg-white border-t border-b border-[#333] border-l-0 border-r-0 cursor-pointer hover:bg-[#f0f0f0] transition-colors disabled:opacity-50"
        >
          Setup 2FA
        </button>
        <button
          onClick={() => window.location.reload()}
          className="w-[350px] text-[9pt] p-[2px] leading-none bg-white border-t border-b border-[#333] border-l-0 border-r-0 cursor-pointer hover:bg-[#f0f0f0] transition-colors"
        >
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-[10px]">
      <p className="text-[10.5pt] text-[#333]">Scan this QR code using Microsoft Authenticator</p>
      {qr && <img src={qr} alt="QR Code" width={200} height={200} />}
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !loading && handleVerify()}
        maxLength={6}
        placeholder="Enter Code"
        disabled={loading}
        autoFocus
        className="w-[350px] text-[9pt] p-[2px] border border-[#333] outline-none text-center tracking-[4px] disabled:opacity-50"
      />
      <p className="text-[9pt] text-center text-[#333] mt-[2px] mb-0">Authenticator Code</p>
      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-[350px] text-[9pt] p-[2px] leading-none bg-white border-t border-b border-[#333] border-l-0 border-r-0 cursor-pointer hover:bg-[#f0f0f0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Verify
      </button>
      <button
        onClick={() => window.location.reload()}
        className="w-[350px] text-[9pt] p-[2px] leading-none bg-white border-t border-b border-[#333] border-l-0 border-r-0 cursor-pointer hover:bg-[#f0f0f0] transition-colors"
      >
        ← Back
      </button>
    </div>
  );
}
