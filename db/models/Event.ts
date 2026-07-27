import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  type: "holiday" | "academic" | "sports" | "cultural" | "exam";
  isPublic: boolean;
  createdAt: Date;
}

const EventSchema: Schema<IEvent> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String },
    type: { type: String, enum: ["holiday", "academic", "sports", "cultural", "exam"], default: "academic" },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
