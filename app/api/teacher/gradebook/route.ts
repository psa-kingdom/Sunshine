import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/db";
import { Student } from "@/db/models/Student";
import { Exam } from "@/db/models/Exam";
import { Result } from "@/db/models/Result";

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
    const students = await Student.find({ grade, section }).lean();
    const exams = await Exam.find({ grade }).lean();
    const results = await Result.find({ student: { $in: students.map((s) => s._id) } }).lean();

    return NextResponse.json({ students, exams, results }, { status: 200 });
  } catch (error) {
    console.error("Error fetching gradebook:", error);
    return NextResponse.json({ error: "Failed to fetch gradebook" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { studentId, examId, subject, marksObtained, totalMarks, remarks } = body;

    if (!studentId || !subject || marksObtained === undefined) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    await connectDB();
    const maxMarks = totalMarks || 100;
    const percentage = (marksObtained / maxMarks) * 100;
    let gradeLetter = "F";
    if (percentage >= 90) gradeLetter = "A+";
    else if (percentage >= 80) gradeLetter = "A";
    else if (percentage >= 70) gradeLetter = "B";
    else if (percentage >= 60) gradeLetter = "C";
    else if (percentage >= 50) gradeLetter = "D";

    const result = await Result.findOneAndUpdate(
      { student: studentId, subject },
      {
        student: studentId,
        exam: examId || undefined,
        subject,
        marksObtained,
        totalMarks: maxMarks,
        gradeLetter,
        remarks: remarks || "Term assessment",
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ result, success: true, message: "Marks saved successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error saving gradebook marks:", error);
    return NextResponse.json({ error: "Failed to save marks" }, { status: 500 });
  }
}
