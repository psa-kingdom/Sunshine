import { NextResponse } from "next/server";
import { connectDB } from "@/db";
import { Event } from "@/db/models/Event";

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find({ isPublic: true }).sort({ startDate: 1 }).lean();
    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
