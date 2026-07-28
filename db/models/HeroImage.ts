import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHeroImage extends Document {
  title: string;
  url: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HeroImageSchema: Schema<IHeroImage> = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const HeroImage: Model<IHeroImage> =
  mongoose.models.HeroImage ||
  mongoose.model<IHeroImage>("HeroImage", HeroImageSchema);
