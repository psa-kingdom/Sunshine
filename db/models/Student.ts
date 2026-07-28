import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAcademicRecord {
  year: string;
  grade: string;
  section: string;
  rollNumber: string;
  status: "promoted" | "transferred" | "retained";
  remarks?: string;
}

export interface IStudentDocument {
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
}

export interface IStudent extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "student";
  permanentId: string; // Permanent Student ID (immutable)
  rollNumber: string;
  grade: string;
  section: string;
  status: "active" | "transferred" | "graduated" | "inactive";
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  fatherName?: string;
  fatherPhone?: string;
  motherName?: string;
  motherPhone?: string;
  guardianName?: string;
  gender?: string;
  dob?: string;
  bloodGroup?: string;
  address?: string;
  admissionYear?: string;
  joiningClass?: string;
  avatarUrl?: string;
  academicHistory?: IAcademicRecord[];
  documents?: IStudentDocument[];
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema: Schema<IStudent> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "student", required: true },
    permanentId: { type: String, trim: true },
    rollNumber: { type: String, required: true, trim: true },
    grade: { type: String, required: true, trim: true },
    section: { type: String, required: true, default: "A", trim: true },
    status: {
      type: String,
      enum: ["active", "transferred", "graduated", "inactive"],
      default: "active",
      required: true,
    },
    parentName: { type: String, required: true, trim: true },
    parentPhone: { type: String, required: true, trim: true },
    parentEmail: { type: String, lowercase: true, trim: true },
    fatherName: { type: String, trim: true },
    fatherPhone: { type: String, trim: true },
    motherName: { type: String, trim: true },
    motherPhone: { type: String, trim: true },
    guardianName: { type: String, trim: true },
    gender: { type: String, trim: true },
    dob: { type: String, trim: true },
    bloodGroup: { type: String, trim: true },
    address: { type: String, trim: true },
    admissionYear: { type: String, default: "2026", trim: true },
    joiningClass: { type: String, trim: true },
    avatarUrl: { type: String, trim: true },
    academicHistory: [
      {
        year: String,
        grade: String,
        section: String,
        rollNumber: String,
        status: String,
        remarks: String,
      },
    ],
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

export const Student: Model<IStudent> =
  mongoose.models.Student || mongoose.model<IStudent>("Student", StudentSchema);
