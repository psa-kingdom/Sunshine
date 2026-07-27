import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/db";
import { Message } from "@/db/models/Message";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email;
    await connectDB();

    const inbox = await Message.find({
      $or: [{ recipientEmail: email }, { recipientRole: "student" }, { recipientRole: "all" }],
    })
      .sort({ createdAt: -1 })
      .lean();

    const sent = await Message.find({ senderEmail: email }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ inbox, sent }, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { recipientEmail, subject, content } = body;

    if (!recipientEmail || !subject || !content) {
      return NextResponse.json({ error: "All message fields are required" }, { status: 400 });
    }

    await connectDB();
    const message = await Message.create({
      senderName: session.user.name || "Student",
      senderEmail: session.user.email,
      senderRole: "student",
      recipientEmail: recipientEmail.trim(),
      recipientRole: "teacher",
      subject: subject.trim(),
      content: content.trim(),
    });

    return NextResponse.json({ message, success: true }, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
