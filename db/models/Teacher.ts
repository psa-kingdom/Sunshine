import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITeacherDocument {
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
}

export interface ITeacher extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "teacher";
  employeeId: string;
  department: string;
  subjectSpecialization: string;
  phone: string;
  status: "active" | "on_leave" | "resigned";
  assignedClass?: string;
  gender?: string;
  dob?: string;
  address?: string;
  qualification?: string;
  experienceYears?: number;
  joiningDate?: string;
  emergencyContact?: string;
  avatarUrl?: string;
  documents?: ITeacherDocument[];
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
    status: {
      type: String,
      enum: ["active", "on_leave", "resigned"],
      default: "active",
      required: true,
    },
    assignedClass: { type: String, trim: true },
    gender: { type: String, trim: true },
    dob: { type: String, trim: true },
    address: { type: String, trim: true },
    qualification: { type: String, trim: true },
    experienceYears: { type: Number, default: 5 },
    joiningDate: { type: String, trim: true },
    emergencyContact: { type: String, trim: true },
    avatarUrl: { type: String, trim: true },
    documents: [
      {
        name: String,
        type: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Teacher: Model<ITeacher> =
  mongoose.models.Teacher || mongoose.model<ITeacher>("Teacher", TeacherSchema);
