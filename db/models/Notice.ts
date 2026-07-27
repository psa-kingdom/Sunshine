import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotice extends Document {
  title: string;
  content: string;
  date: Date;
  isImportant: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NoticeSchema: Schema<INotice> = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    isImportant: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notice: Model<INotice> =
  mongoose.models.Notice || mongoose.model<INotice>("Notice", NoticeSchema);
