import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHomework extends Document {
  title: string;
  subject: string;
  grade: string;
  section: string;
  description: string;
  dueDate: string;
  teacherName?: string;
  resourceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const HomeworkSchema: Schema<IHomework> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    grade: { type: String, required: true, trim: true },
    section: { type: String, required: true, default: "A", trim: true },
    description: { type: String, required: true, trim: true },
    dueDate: { type: String, required: true, trim: true },
    teacherName: { type: String, trim: true },
    resourceUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Homework: Model<IHomework> =
  mongoose.models.Homework || mongoose.model<IHomework>("Homework", HomeworkSchema);
