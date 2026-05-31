export async function disableTOTP() {
  const email = localStorage.getItem("email");
  if (!email) return { status: "error" };

  const res = await fetch("/api/disable-totp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  return data;
}
