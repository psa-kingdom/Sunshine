import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
  senderName: string;
  senderEmail: string;
  senderRole: "admin" | "teacher" | "student";
  recipientEmail: string;
  recipientRole?: "admin" | "teacher" | "student" | "all";
  gradeSection?: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
}

const MessageSchema: Schema<IMessage> = new Schema(
  {
    senderName: { type: String, required: true },
    senderEmail: { type: String, required: true },
    senderRole: { type: String, enum: ["admin", "teacher", "student"], required: true },
    recipientEmail: { type: String, required: true },
    recipientRole: { type: String, enum: ["admin", "teacher", "student", "all"], default: "teacher" },
    gradeSection: { type: String },
    subject: { type: String, required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
