import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/db";
import { Inquiry } from "@/db/models/Inquiry";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ inquiries }, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin inquiries:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}
