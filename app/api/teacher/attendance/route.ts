import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/db";
import { Student } from "@/db/models/Student";
import { Attendance } from "@/db/models/Attendance";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const grade = searchParams.get("grade") || "Grade X";
    const section = searchParams.get("section") || "A";
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    await connectDB();

    const students = await Student.find({ grade, section }).lean();
    const studentIds = students.map((s) => s._id);

    const attendanceRecords = await Attendance.find({
      student: { $in: studentIds },
      date,
    }).lean();

    const attendanceMap: Record<string, string> = {};
    for (const record of attendanceRecords) {
      attendanceMap[record.student.toString()] = record.status;
    }

    return NextResponse.json({ students, date, attendanceMap }, { status: 200 });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { date, grade, section, records } = body;

    if (!date || !records || !Array.isArray(records)) {
      return NextResponse.json({ error: "Invalid attendance payload" }, { status: 400 });
    }

    await connectDB();

    for (const item of records) {
      const { studentId, status } = item;
      if (!studentId || !["present", "absent", "late"].includes(status)) continue;

      await Attendance.findOneAndUpdate(
        { student: studentId, date },
        {
          student: studentId,
          grade: grade || "Grade X",
          section: section || "A",
          date,
          status,
          markedBy: session.user.name || session.user.email,
        },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ success: true, message: "Attendance saved successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error saving attendance:", error);
    return NextResponse.json({ error: "Failed to save attendance" }, { status: 500 });
  }
}
