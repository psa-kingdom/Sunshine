import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/db";
import { Notice } from "@/db/models/Notice";

export async function GET() {
  try {
    await connectDB();
    const notices = await Notice.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ notices }, { status: 200 });
  } catch (error) {
    console.error("Error fetching notices:", error);
    return NextResponse.json({ error: "Failed to fetch notices" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, category, targetAudience, isPinned } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    await connectDB();
    const notice = await Notice.create({
      title: title.trim(),
      content: content.trim(),
      category: category || "general",
      targetAudience: targetAudience || "all",
      isPinned: Boolean(isPinned),
    });

    return NextResponse.json({ notice, success: true }, { status: 201 });
  } catch (error) {
    console.error("Error creating notice:", error);
    return NextResponse.json({ error: "Failed to create notice" }, { status: 500 });
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
      return NextResponse.json({ error: "Notice ID is required" }, { status: 400 });
    }

    await connectDB();
    await Notice.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Notice deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting notice:", error);
    return NextResponse.json({ error: "Failed to delete notice" }, { status: 500 });
  }
}
