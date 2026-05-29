export function logAudit(email: string, action: string, module: string, details: string) {
  // This part of code calling the backend → /backend/centralizeaudit/centralizeaudit.go → HandleAuditLog
  fetch("/api/audit/log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, action, module, details }),
  });
}
