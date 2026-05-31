export async function verifyOTP(email: string, otp: string) {
  if (!otp) return { status: "error" };
  
  const res = await fetch("/api/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  const data = await res.json();
  
  if (data.status === "verified") {
    localStorage.setItem("email", email);
    window.location.href = "/dashboard";
  }
  return data;
}
