import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/db";
import { Student } from "@/db/models/Student";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const students = await Student.find({}).sort({ grade: 1, rollNumber: 1 }).lean();

    return NextResponse.json({ students }, { status: 200 });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, password, rollNumber, grade, section, parentName, parentPhone } = body;

    if (!name || !email || !password || !rollNumber || !grade) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    await connectDB();
    const passwordHash = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: "student",
      rollNumber: rollNumber.trim(),
      grade: grade.trim(),
      section: (section || "A").trim(),
      parentName: (parentName || "Parent").trim(),
      parentPhone: (parentPhone || "+91 98765 00000").trim(),
    });

    return NextResponse.json({ student, success: true, message: "Student created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
  }
}
