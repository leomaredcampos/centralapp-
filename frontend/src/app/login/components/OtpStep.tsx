"use client";

import { useState, useEffect, useRef } from "react";
import MessageModal from "./MessageModal";

interface Props {
  otp: string;
  setOtp: (val: string) => void;
  onSubmit: () => Promise<{ status: string; remaining?: number }>;
  expiresIn: number;
  onExpired: () => void;
}

export default function OtpStep({ otp, setOtp, onSubmit, expiresIn, onExpired }: Props) {
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otpTimer, setOtpTimer] = useState(expiresIn);
  const [modalMessage, setModalMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setOtpTimer(expiresIn); }, [expiresIn]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  useEffect(() => {
    if (otpTimer <= 0) { onExpired(); return; }
    const t = setTimeout(() => setOtpTimer((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [otpTimer]);

  async function handleSubmit() {
    if (countdown > 0 || otpTimer <= 0) return;
    setLoading(true);
    const data = await onSubmit();
    setLoading(false);
    if (data.status === "attempt_locked") setCountdown(data.remaining || 60);
    else if (data.status === "invalid_otp") setModalMessage("Invalid OTP.");
    else if (data.status === "otp_expired") onExpired();
  }

  const minutes = Math.floor(otpTimer / 60);
  const seconds = otpTimer % 60;

  return (
    <>
      {modalMessage && (
        <MessageModal
          message={modalMessage}
          onClose={() => {
            setModalMessage("");
            setOtp("");
            inputRef.current?.focus();
          }}
        />
      )}
      <p className="text-center text-black mt-[5px] mb-[5px]">Verification</p>
      <input
        ref={inputRef}
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !loading && !countdown && handleSubmit()}
        maxLength={6}
        placeholder="Enter OTP"
        disabled={loading || countdown > 0 || otpTimer <= 0}
        autoFocus
        className="w-[350px] p-[2px] border-[0.25px] border-black outline-none text-center tracking-[4px] disabled:opacity-50"
      />
      <p className="text-center text-black mt-[2px] mb-0">OTP</p>
      <p className="text-center text-black mt-[2px]">
        Expires in {minutes}:{seconds.toString().padStart(2, "0")}
      </p>
      {countdown > 0 ? (
        <p className="text-center text-red-500 mt-[6px]">
          Too many attempts. Please wait {countdown}s.
        </p>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={loading || otpTimer <= 0}
          className="w-[350px] p-[2px] leading-none bg-white border-t-[0.25px] border-b-[0.25px] border-black border-l-0 border-r-0 cursor-pointer mt-[15px] hover:bg-[#f0f0f0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Verify
        </button>
      )}
    </>
  );
}
