import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMediaItem extends Document {
  title: string;
  url: string;
  category: string;
  caption?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MediaItemSchema: Schema<IMediaItem> = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    category: { type: String, required: true, default: "general" },
    caption: { type: String },
  },
  { timestamps: true }
);

export const MediaItem: Model<IMediaItem> =
  mongoose.models.MediaItem || mongoose.model<IMediaItem>("MediaItem", MediaItemSchema);
