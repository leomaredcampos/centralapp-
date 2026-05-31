export async function verifyTOTP(email: string, code: string) {
  const res = await fetch("/api/verify-totp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  const data = await res.json();
  
  if (data.status === "verified") {
    localStorage.setItem("email", email);
    localStorage.setItem("sessionid", data.sessionid);
    localStorage.setItem("authtype", "totp");
    window.location.href = "/dashboard";
  } else if (data.status === "max_sessions") {
    alert("Maximum of 3 active sessions reached.");
  }
  return data;
}
