import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFee extends Document {
  student: mongoose.Types.ObjectId;
  studentName: string;
  grade: string;
  section: string;
  title: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  paidDate?: string;
  transactionId?: string;
  createdAt: Date;
}

const FeeSchema: Schema<IFee> = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    studentName: { type: String, required: true },
    grade: { type: String, required: true },
    section: { type: String, required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    dueDate: { type: String, required: true },
    status: { type: String, enum: ["paid", "pending", "overdue"], default: "pending" },
    paidDate: { type: String },
    transactionId: { type: String },
  },
  { timestamps: true }
);

export const Fee: Model<IFee> = mongoose.models.Fee || mongoose.model<IFee>("Fee", FeeSchema);
