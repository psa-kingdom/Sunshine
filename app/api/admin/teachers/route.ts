import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/db";
import { Teacher } from "@/db/models/Teacher";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const teachers = await Teacher.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ teachers }, { status: 200 });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, password, employeeId, department, subjectSpecialization, phone, assignedClass } = body;

    if (!name || !email || !password || !employeeId || !department) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    await connectDB();
    const passwordHash = await bcrypt.hash(password, 10);

    const teacher = await Teacher.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: "teacher",
      employeeId: employeeId.trim(),
      department: department.trim(),
      subjectSpecialization: (subjectSpecialization || department).trim(),
      phone: (phone || "+91 98112 00000").trim(),
      assignedClass: (assignedClass || "Grade X-A").trim(),
    });

    return NextResponse.json({ teacher, success: true, message: "Teacher created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating teacher:", error);
    return NextResponse.json({ error: "Failed to create teacher" }, { status: 500 });
  }
}
