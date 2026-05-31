export async function verifyTOTPSetup(code: string, secret: string) {
  const email = localStorage.getItem("email");
  if (!email || !code) return { status: "error" };

  const res = await fetch("/api/verify-totp-setup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, secret }),
  });
  const data = await res.json();
  return data;
}
