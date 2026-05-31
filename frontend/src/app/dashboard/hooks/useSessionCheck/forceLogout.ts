export function forceLogout(email: string, authtype: string | null, sessionid: string | null) {
  if (authtype === "totp" && sessionid) {
    fetch("/api/delete-totp-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, sessionid }),
    });
  }
  localStorage.removeItem("email");
  localStorage.removeItem("sessionid");
  localStorage.removeItem("authtype");
  window.location.href = "/login";
}
