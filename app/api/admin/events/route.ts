import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/db";
import { Event } from "@/db/models/Event";

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find({}).sort({ startDate: 1 }).lean();
    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, startDate, endDate, type } = body;

    if (!title || !startDate) {
      return NextResponse.json({ error: "Title and start date are required" }, { status: 400 });
    }

    await connectDB();
    const event = await Event.create({
      title: title.trim(),
      description: (description || "").trim(),
      startDate,
      endDate: endDate || undefined,
      type: type || "academic",
      isPublic: true,
    });

    return NextResponse.json({ event, success: true }, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    await connectDB();
    await Event.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Event deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
