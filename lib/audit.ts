import { connectDB } from "@/db";
import { AuditLog } from "@/db/models/AuditLog";

interface LogParams {
  action: "CREATE" | "UPDATE" | "DELETE" | "PASSWORD_RESET" | "BULK_IMPORT" | "BULK_EXPORT" | "LOGIN" | "LOGOUT";
  module: "STUDENT" | "TEACHER" | "FEE" | "NOTICE" | "EMAIL" | "EVENT" | "GALLERY" | "INQUIRY" | "AUTH";
  performedBy?: string;
  details: string;
  targetId?: string;
}

export async function recordAuditLog({
  action,
  module,
  performedBy = "admin@sunshineps.edu.in",
  details,
  targetId,
}: LogParams) {
  try {
    await connectDB();
    await AuditLog.create({
      action,
      module,
      performedBy,
      details,
      targetId,
    });
  } catch (error) {
    console.error("Failed to record audit log:", error);
  }
}
