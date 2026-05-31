"use client";

import { useState, useEffect } from "react";

interface Props {
  email: string;
  setEmail: (val: string) => void;
  onSubmit: () => Promise<{ status: string; remaining?: number }>;
}

export default function EmailStep({ email, setEmail, onSubmit }: Props) {
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
    const data = await onSubmit();
    setLoading(false);
    if (data.status === "attempt_locked") {
      setCountdown(data.remaining || 60);
    } else if (data.status === "not_found") {
      alert("Email not found.");
    } else if (data.status === "locked") {
      alert("This account is currently in use.");
    }
  }

  return (
    <>
      <p className="text-[11pt] text-center text-black mt-[5px] mb-[5px]">Login</p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !loading && !countdown && handleSubmit()}
        placeholder="Email Address"
        disabled={loading || countdown > 0}
        autoFocus
        className="w-[350px] text-[9pt] p-[2px] border-[0.25px] border-black outline-none text-center disabled:opacity-50"
      />
      <p className="text-[9pt] text-center text-black mt-[2px] mb-0">Email Address</p>
      {countdown > 0 ? (
        <p className="text-[9pt] text-center text-red-500 mt-[10px]">
          Too many attempts. Please wait {countdown}s.
        </p>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-[350px] text-[9pt] p-[2px] leading-none bg-white border-t-[0.25px] border-b-[0.25px] border-black border-l-0 border-r-0 cursor-pointer mt-[15px] hover:bg-[#f0f0f0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      )}
    </>
  );
}
