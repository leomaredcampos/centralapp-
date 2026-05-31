import { useEffect } from "react";
import { checkSession } from "./checkSession";
import { startPeriodicCheck } from "./periodicCheck";

export function useSessionCheck(onValidSession: (email: string) => void) {
  useEffect(() => {
    const stored = localStorage.getItem("email") || "";
    const authtype = localStorage.getItem("authtype");
    const sessionid = localStorage.getItem("sessionid");

    if (!stored) {
      window.location.href = "/login";
      return;
    }

    checkSession(stored, authtype, sessionid, () => {
      onValidSession(stored);
    });

    const interval = startPeriodicCheck();
    return () => clearInterval(interval);
  }, [onValidSession]);
}
