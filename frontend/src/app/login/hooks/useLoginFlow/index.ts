import { submitEmail as submit } from "./submitEmail";
import { verifyOTP as verifyOtp } from "./verifyOTP";
import { verifyTOTP as verifyTotp } from "./verifyTOTP";

export function useLoginFlow(email: string, otp: string) {
  async function handleEmailSubmit() {
    return await submit(email);
  }

  async function handleOTPVerify() {
    return await verifyOtp(email, otp);
  }

  async function handleTOTPVerify(code: string) {
    return await verifyTotp(email, code);
  }

  return { handleEmailSubmit, handleOTPVerify, handleTOTPVerify };
}
