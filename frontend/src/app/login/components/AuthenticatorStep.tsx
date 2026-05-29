"use client";

import { useState, useEffect } from "react";

interface Props {
  onSubmit: (code: string) => Promise<{ status: string; remaining?: number }>;
}

export default function AuthenticatorStep({ onSubmit }: Props) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  async function handleSubmit() {
    if (countdown > 0) return;
    setLoading(true);
    const data = await onSubmit(code);
    setLoading(false);
    if (data.status === "attempt_locked") {
      setCountdown(data.remaining || 60);
    } else if (data.status === "invalid") {
      alert("Invalid authenticator code.");
    }
  }

  return (
    <>
      <p className="text-[11pt] text-center text-[#333] mt-[5px] mb-[5px]">Authenticator</p>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !loading && !countdown && handleSubmit()}
        maxLength={6}
        placeholder="Enter Code"
        disabled={loading || countdown > 0}
        autoFocus
        className="w-[350px] text-[9pt] p-[2px] border border-[#333] outline-none text-center tracking-[4px] disabled:opacity-50"
      />
      <p className="text-[9pt] text-center text-[#333] mt-[2px] mb-0">Authenticator Code</p>
      {countdown > 0 ? (
        <p className="text-[9pt] text-center text-red-500 mt-[6px]">
          Too many attempts. Please wait {countdown}s.
        </p>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-[350px] text-[9pt] p-[2px] leading-none bg-white border-t border-b border-[#333] border-l-0 border-r-0 cursor-pointer mt-[15px] hover:bg-[#f0f0f0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Verify
        </button>
      )}
    </>
  );
}
