import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAuditLog extends Document {
  action: "CREATE" | "UPDATE" | "DELETE" | "PASSWORD_RESET" | "BULK_IMPORT" | "BULK_EXPORT" | "LOGIN" | "LOGOUT";
  module: "STUDENT" | "TEACHER" | "FEE" | "NOTICE" | "EMAIL" | "EVENT" | "GALLERY" | "INQUIRY" | "AUTH";
  performedBy: string;
  details: string;
  targetId?: string;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AuditLogSchema: Schema<IAuditLog> = new Schema(
  {
    action: {
      type: String,
      enum: ["CREATE", "UPDATE", "DELETE", "PASSWORD_RESET", "BULK_IMPORT", "BULK_EXPORT", "LOGIN", "LOGOUT"],
      required: true,
    },
    module: {
      type: String,
      enum: ["STUDENT", "TEACHER", "FEE", "NOTICE", "EMAIL", "EVENT", "GALLERY", "INQUIRY", "AUTH"],
      required: true,
    },
    performedBy: { type: String, required: true, trim: true },
    details: { type: String, required: true, trim: true },
    targetId: { type: String, trim: true },
    ipAddress: { type: String, trim: true },
  },
  { timestamps: true }
);

export const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
