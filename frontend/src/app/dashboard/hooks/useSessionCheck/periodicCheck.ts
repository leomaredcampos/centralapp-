import { forceLogout } from "./forceLogout";

export function startPeriodicCheck() {
  let failCount = 0;

  const interval = setInterval(() => {
    const email = localStorage.getItem("email");
    const authtype = localStorage.getItem("authtype");
    const sessionid = localStorage.getItem("sessionid");

    if (!email) {
      window.location.href = "/login";
      return;
    }

    if (authtype === "totp" && sessionid) {
      fetch("/api/check-totp-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, sessionid }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status !== "valid") {
            failCount++;
            if (failCount >= 3) {
              forceLogout(email, authtype, sessionid);
            }
          } else {
            failCount = 0;
          }
        })
        .catch(() => {
          failCount++;
          if (failCount >= 3) forceLogout(email, authtype, sessionid);
        });
    } else {
      fetch("/api/check-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status !== "valid") {
            failCount++;
            if (failCount >= 3) {
              forceLogout(email, authtype, sessionid);
            }
          } else {
            failCount = 0;
          }
        })
        .catch(() => {
          failCount++;
          if (failCount >= 3) forceLogout(email, authtype, sessionid);
        });
    }
  }, 2000);

  return interval;
}
