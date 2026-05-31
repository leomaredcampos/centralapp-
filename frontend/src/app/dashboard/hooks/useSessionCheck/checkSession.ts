import { forceLogout } from "./forceLogout";

export async function checkSession(
  email: string,
  authtype: string | null,
  sessionid: string | null,
  onValid: () => void
) {
  const checkUrl = authtype === "totp" && sessionid ? "/api/check-totp-session" : "/api/check-session";
  const checkBody = authtype === "totp" && sessionid
    ? JSON.stringify({ email, sessionid })
    : JSON.stringify({ email });

  const res = await fetch(checkUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: checkBody,
  });
  const data = await res.json();
  
  if (data.status !== "valid") {
    forceLogout(email, authtype, sessionid);
  } else {
    onValid();
  }
}
