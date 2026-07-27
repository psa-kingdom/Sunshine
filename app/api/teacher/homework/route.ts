import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/db";
import { Homework } from "@/db/models/Homework";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const grade = searchParams.get("grade") || "Grade X";
    const section = searchParams.get("section") || "A";

    await connectDB();
    const homeworkList = await Homework.find({ grade, section }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ homeworkList }, { status: 200 });
  } catch (error) {
    console.error("Error fetching homework:", error);
    return NextResponse.json({ error: "Failed to fetch homework" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, subject, grade, section, description, dueDate } = body;

    if (!title || !subject || !description || !dueDate) {
      return NextResponse.json({ error: "All homework fields are required" }, { status: 400 });
    }

    await connectDB();
    const homework = await Homework.create({
      title: title.trim(),
      subject: subject.trim(),
      grade: grade || "Grade X",
      section: section || "A",
      description: description.trim(),
      dueDate,
      teacherName: session.user.name || "Teacher",
    });

    return NextResponse.json({ homework, success: true, message: "Homework created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating homework:", error);
    return NextResponse.json({ error: "Failed to create homework" }, { status: 500 });
  }
}
