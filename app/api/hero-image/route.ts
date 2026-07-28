import { NextResponse } from "next/server";
import { connectDB } from "@/db";
import { HeroImage } from "@/db/models/HeroImage";

/** GET — public: returns the currently active hero image URL */
export async function GET() {
  try {
    await connectDB();
    const image = await HeroImage.findOne({ isActive: true }).lean();
    return NextResponse.json({ image: image || null }, { status: 200 });
  } catch (error) {
    console.error("Error fetching active hero image:", error);
    return NextResponse.json({ image: null }, { status: 200 });
  }
}
