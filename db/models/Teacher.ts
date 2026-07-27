import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITeacher extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "teacher";
  employeeId: string;
  department: string;
  subjectSpecialization: string;
  phone: string;
  assignedClass?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeacherSchema: Schema<ITeacher> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "teacher", required: true },
    employeeId: { type: String, required: true, unique: true, trim: true },
    department: { type: String, required: true, trim: true },
    subjectSpecialization: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    assignedClass: { type: String, trim: true },
    avatarUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Teacher: Model<ITeacher> =
  mongoose.models.Teacher || mongoose.model<ITeacher>("Teacher", TeacherSchema);
