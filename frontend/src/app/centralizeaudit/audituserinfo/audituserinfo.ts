import { logAudit } from "../centralizeaudit";

export function auditAddUser(email: string, targetUser: string) {
  logAudit(email, "add_user", "userinfo", targetUser);
}

export function auditUploadFile(email: string, filename: string) {
  logAudit(email, "upload_file", "userinfo", filename);
}
