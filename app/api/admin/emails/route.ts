import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/db";
import { Student } from "@/db/models/Student";
import { Teacher } from "@/db/models/Teacher";
import { Message } from "@/db/models/Message";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { targetGroup, grade, subject, content } = body;

    if (!targetGroup || !subject || !content) {
      return NextResponse.json({ error: "All broadcast fields are required" }, { status: 400 });
    }

    await connectDB();

    let recipientCount = 0;

    if (targetGroup === "teachers") {
      const teachers = await Teacher.find({}).lean();
      recipientCount = teachers.length;
      for (const t of teachers) {
        await Message.create({
          senderName: "Admin Office",
          senderEmail: session.user.email,
          senderRole: "admin",
          recipientEmail: t.email,
          recipientRole: "teacher",
          subject: subject.trim(),
          content: content.trim(),
        });
      }
    } else if (targetGroup === "students" || targetGroup === "class") {
      const query = grade ? { grade } : {};
      const students = await Student.find(query).lean();
      recipientCount = students.length;
      for (const s of students) {
        await Message.create({
          senderName: "Admin Office",
          senderEmail: session.user.email,
          senderRole: "admin",
          recipientEmail: s.email,
          recipientRole: "student",
          gradeSection: s.grade,
          subject: subject.trim(),
          content: content.trim(),
        });
      }
    }

    return NextResponse.json(
      { success: true, count: recipientCount, message: `Email broadcast sent to ${recipientCount} recipients.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email broadcast:", error);
    return NextResponse.json({ error: "Failed to send email broadcast" }, { status: 500 });
  }
}
