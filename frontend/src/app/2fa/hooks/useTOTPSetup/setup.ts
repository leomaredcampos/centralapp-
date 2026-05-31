export async function setupTOTP() {
  const email = localStorage.getItem("email");
  if (!email) return null;

  const res = await fetch("/api/setup-totp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  
  if (data.uri) {
    return {
      qr: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.uri)}`,
      secret: data.secret,
    };
  }
  return null;
}
