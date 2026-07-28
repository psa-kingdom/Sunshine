import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHeroVideo extends Document {
  title: string;
  url: string;
  thumbnailUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HeroVideoSchema: Schema<IHeroVideo> = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    thumbnailUrl: { type: String },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const HeroVideo: Model<IHeroVideo> =
  mongoose.models.HeroVideo ||
  mongoose.model<IHeroVideo>("HeroVideo", HeroVideoSchema);
