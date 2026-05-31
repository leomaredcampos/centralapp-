export async function checkTOTPStatus() {
  const email = localStorage.getItem("email");
  if (!email) return { enabled: false };

  const res = await fetch("/api/check-totp-status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  return data;
}
