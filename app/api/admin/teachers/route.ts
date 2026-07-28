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
    await connectDB();

    // Support Bulk Import
    if (body.bulk && Array.isArray(body.records)) {
      const defaultPasswordHash = await bcrypt.hash("Teacher2026!", 10);
      const docsToInsert = [];

      for (const rec of body.records) {
        if (!rec.name || !rec.email || !rec.employeeId) continue;
        const passHash = rec.password ? await bcrypt.hash(rec.password, 10) : defaultPasswordHash;

        docsToInsert.push({
          name: String(rec.name).trim(),
          email: String(rec.email).trim().toLowerCase(),
          passwordHash: passHash,
          role: "teacher",
          employeeId: String(rec.employeeId).trim(),
          department: String(rec.department || "General Science").trim(),
          subjectSpecialization: String(rec.subjectSpecialization || rec.department || "General").trim(),
          phone: String(rec.phone || "+91 98112 00000").trim(),
          assignedClass: String(rec.assignedClass || "Grade X-A").trim(),
        });
      }

      if (docsToInsert.length === 0) {
        return NextResponse.json({ error: "No valid records provided for bulk import" }, { status: 400 });
      }

      const inserted = await Teacher.insertMany(docsToInsert, { ordered: false });
      return NextResponse.json(
        { success: true, count: inserted.length, message: `Successfully imported ${inserted.length} faculty members` },
        { status: 201 }
      );
    }

    // Single Teacher Creation
    const { name, email, password, employeeId, department, subjectSpecialization, phone, assignedClass } = body;

    if (!name || !email || !password || !employeeId || !department) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

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
    return NextResponse.json({ error: "Failed to create teacher(s)" }, { status: 500 });
  }
}
