import { NextResponse } from "next/server";
import { connectDB } from "@/db";
import { HeroVideo } from "@/db/models/HeroVideo";

/** GET — public: returns the currently active hero video URL (if any) */
export async function GET() {
  try {
    await connectDB();
    const video = await HeroVideo.findOne({ isActive: true }).lean();
    return NextResponse.json({ video: video || null }, { status: 200 });
  } catch (error) {
    console.error("Error fetching active hero video:", error);
    return NextResponse.json({ video: null }, { status: 200 }); // graceful fallback
  }
}
