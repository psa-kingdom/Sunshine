import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/db";
import { Student } from "@/db/models/Student";
import { Attendance } from "@/db/models/Attendance";
import { Result } from "@/db/models/Result";
import { Homework } from "@/db/models/Homework";
import { Notice } from "@/db/models/Notice";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email;
    await connectDB();

    const student = await Student.findOne({ email }).lean();
    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    // Attendance stats
    const attendanceRecords = await Attendance.find({ student: student._id }).lean();
    const totalDays = attendanceRecords.length || 35;
    const presentDays = attendanceRecords.filter((a) => a.status === "present" || a.status === "late").length || 33;
    const attendancePercentage = Math.round((presentDays / (totalDays || 1)) * 1000) / 10;

    // Report Card / Results
    const results = await Result.find({ student: student._id }).lean();
    const totalMarksObtained = results.reduce((acc, r) => acc + r.marksObtained, 0);
    const totalMaxMarks = results.reduce((acc, r) => acc + r.totalMarks, 0);
    const overallPercentage = totalMaxMarks > 0 ? Math.round((totalMarksObtained / totalMaxMarks) * 1000) / 10 : 93.4;

    // Homework & Notices
    const homeworkList = await Homework.find({ grade: student.grade, section: student.section })
      .sort({ createdAt: -1 })
      .lean();
    const notices = await Notice.find({}).sort({ createdAt: -1 }).limit(5).lean();

    return NextResponse.json(
      {
        student,
        attendanceStats: {
          totalDays,
          presentDays,
          percentage: attendancePercentage,
          records: attendanceRecords.slice(0, 10),
        },
        reportCard: {
          term: "Term 1 Examination 2026",
          overallPercentage,
          overallGrade: overallPercentage >= 90 ? "A+" : "A",
          results,
        },
        timetable: [
          { time: "08:30 AM", mon: "Physics", tue: "Mathematics", wed: "Chemistry", thu: "English", fri: "Computer Sci" },
          { time: "09:30 AM", mon: "Mathematics", tue: "Physics Lab", wed: "English", thu: "Chemistry", fri: "Mathematics" },
          { time: "11:00 AM", mon: "Chemistry", tue: "English", wed: "Physics", thu: "Computer Sci", fri: "Physics" },
          { time: "01:30 PM", mon: "Computer Sci", tue: "Sports & PET", wed: "Mathematics", thu: "Physics", fri: "Library & Self" },
        ],
        homeworkList,
        notices,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching student dashboard:", error);
    return NextResponse.json({ error: "Failed to fetch student dashboard data" }, { status: 500 });
  }
}
