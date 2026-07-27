import mongoose, { Schema, Document, Model } from "mongoose";

export interface IResult extends Document {
  exam: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  gradeLetter: string;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResultSchema: Schema<IResult> = new Schema(
  {
    exam: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    subject: { type: String, required: true, trim: true },
    marksObtained: { type: Number, required: true },
    totalMarks: { type: Number, required: true, default: 100 },
    gradeLetter: { type: String, required: true, trim: true },
    remarks: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Result: Model<IResult> =
  mongoose.models.Result || mongoose.model<IResult>("Result", ResultSchema);
