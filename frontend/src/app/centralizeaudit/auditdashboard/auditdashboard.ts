import { logAudit } from "../centralizeaudit";

export function auditOpenModule(email: string, moduleName: string) {
  logAudit(email, "open_module", "dashboard", moduleName);
}
