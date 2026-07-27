import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/db";
import { Teacher } from "@/db/models/Teacher";
import { Student } from "@/db/models/Student";
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

    const teacher = await Teacher.findOne({ email }).lean();
    if (!teacher) {
      return NextResponse.json({ error: "Teacher profile not found" }, { status: 404 });
    }

    // Get students in teacher's assigned class
    const grade = teacher.assignedClass?.split("-")[0] || "Grade X";
    const section = teacher.assignedClass?.split("-")[1] || "A";

    const students = await Student.find({ grade, section }).lean();
    const homeworkList = await Homework.find({ grade, section }).sort({ createdAt: -1 }).lean();
    const notices = await Notice.find({}).sort({ createdAt: -1 }).limit(5).lean();

    return NextResponse.json(
      {
        teacher,
        students,
        homeworkList,
        notices,
        todayClasses: [
          { time: "08:30 AM - 09:15 AM", subject: "Physics Theory", gradeSection: "Grade X-A", room: "Lab 2" },
          { time: "09:30 AM - 10:15 AM", subject: "Natural Sciences", gradeSection: "Grade IX-B", room: "Room 104" },
          { time: "11:00 AM - 12:00 PM", subject: "Physics Practical Lab", gradeSection: "Grade X-A", room: "Physics Lab" },
          { time: "01:30 PM - 02:15 PM", subject: "Science Doubt Clearing", gradeSection: "Grade X-A", room: "Room 108" },
        ],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching teacher dashboard:", error);
    return NextResponse.json({ error: "Failed to fetch teacher dashboard data" }, { status: 500 });
  }
}
