import mongoose, { Schema, Document, Model } from "mongoose";

export interface IExam extends Document {
  title: string;
  grade: string;
  subject: string;
  examDate: string;
  totalMarks: number;
  term: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExamSchema: Schema<IExam> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    grade: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    examDate: { type: String, required: true, trim: true },
    totalMarks: { type: Number, required: true, default: 100 },
    term: { type: String, required: true, default: "Term 1", trim: true },
  },
  { timestamps: true }
);

export const Exam: Model<IExam> =
  mongoose.models.Exam || mongoose.model<IExam>("Exam", ExamSchema);
