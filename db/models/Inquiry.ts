import mongoose, { Schema, Document, Model } from "mongoose";

export type InquiryStatus = "new" | "contacted" | "follow_up" | "admitted" | "closed";

export interface IInternalNote {
  note: string;
  author: string;
  createdAt: Date;
}

export interface IInquiry extends Document {
  parentName: string;
  studentName?: string;
  email: string;
  phone: string;
  gradeApplyingFor: string;
  admissionSession?: string;
  message?: string;
  status: InquiryStatus;
  assignedStaff?: string;
  internalNotes?: IInternalNote[];
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema: Schema<IInquiry> = new Schema(
  {
    parentName: { type: String, required: true, trim: true },
    studentName: { type: String, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    gradeApplyingFor: { type: String, required: true, trim: true },
    admissionSession: { type: String, trim: true },
    message: { type: String, trim: true },
    status: {
      type: String,
      enum: ["new", "contacted", "follow_up", "admitted", "closed"],
      default: "new",
      required: true,
    },
    assignedStaff: { type: String, default: "Unassigned", trim: true },
    internalNotes: [
      {
        note: { type: String, required: true },
        author: { type: String, default: "Admin" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);
