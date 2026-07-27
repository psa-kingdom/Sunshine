import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAttendance extends Document {
  student: mongoose.Types.ObjectId;
  grade: string;
  section: string;
  date: string; // YYYY-MM-DD
  status: "present" | "absent" | "late";
  markedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema: Schema<IAttendance> = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    grade: { type: String, required: true, trim: true },
    section: { type: String, required: true, default: "A", trim: true },
    date: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["present", "absent", "late"],
      default: "present",
      required: true,
    },
    markedBy: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Attendance: Model<IAttendance> =
  mongoose.models.Attendance || mongoose.model<IAttendance>("Attendance", AttendanceSchema);
