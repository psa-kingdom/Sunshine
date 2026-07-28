import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotice extends Document {
  title: string;
  content: string;
  date: Date;
  scheduledAt?: Date;
  status: "draft" | "published" | "scheduled";
  category: string;
  targetAudience: string;
  isPinned: boolean;
  isImportant: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NoticeSchema: Schema<INotice> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    scheduledAt: { type: Date },
    status: {
      type: String,
      enum: ["draft", "published", "scheduled"],
      default: "published",
      required: true,
    },
    category: { type: String, default: "general", trim: true },
    targetAudience: { type: String, default: "all", trim: true },
    isPinned: { type: Boolean, default: false },
    isImportant: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notice: Model<INotice> =
  mongoose.models.Notice || mongoose.model<INotice>("Notice", NoticeSchema);
