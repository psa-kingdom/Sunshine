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
    await connectDB();

    // Support Bulk Import
    if (body.bulk && Array.isArray(body.records)) {
      const defaultPasswordHash = await bcrypt.hash("Sunshine2026!", 10);
      const docsToInsert = [];

      for (const rec of body.records) {
        if (!rec.name || !rec.email || !rec.rollNumber) continue;
        const passHash = rec.password ? await bcrypt.hash(rec.password, 10) : defaultPasswordHash;

        docsToInsert.push({
          name: String(rec.name).trim(),
          email: String(rec.email).trim().toLowerCase(),
          passwordHash: passHash,
          role: "student",
          rollNumber: String(rec.rollNumber).trim(),
          grade: String(rec.grade || "Grade X").trim(),
          section: String(rec.section || "A").trim(),
          parentName: String(rec.parentName || "Parent").trim(),
          parentPhone: String(rec.parentPhone || "+91 98765 00000").trim(),
        });
      }

      if (docsToInsert.length === 0) {
        return NextResponse.json({ error: "No valid records provided for bulk import" }, { status: 400 });
      }

      const inserted = await Student.insertMany(docsToInsert, { ordered: false });
      return NextResponse.json(
        { success: true, count: inserted.length, message: `Successfully imported ${inserted.length} students` },
        { status: 201 }
      );
    }

    // Single Student Registration
    const { name, email, password, rollNumber, grade, section, parentName, parentPhone } = body;

    if (!name || !email || !password || !rollNumber || !grade) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

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
    return NextResponse.json({ error: "Failed to create student(s)" }, { status: 500 });
  }
}
