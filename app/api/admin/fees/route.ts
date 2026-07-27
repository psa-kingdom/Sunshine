import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/db";
import { Fee } from "@/db/models/Fee";
import { Student } from "@/db/models/Student";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const fees = await Fee.find({}).sort({ createdAt: -1 }).lean();

    const totalCollected = fees.filter((f) => f.status === "paid").reduce((acc, f) => acc + f.amount, 0);
    const totalPending = fees.filter((f) => f.status === "pending" || f.status === "overdue").reduce((acc, f) => acc + f.amount, 0);

    return NextResponse.json({ fees, totalCollected, totalPending }, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin fees:", error);
    return NextResponse.json({ error: "Failed to fetch admin fees" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, grade, section, title, amount, dueDate } = body;

    await connectDB();

    if (action === "create_class_invoice") {
      if (!grade || !title || !amount || !dueDate) {
        return NextResponse.json({ error: "All invoice fields are required" }, { status: 400 });
      }

      const students = await Student.find({ grade }).lean();
      const createdFees = [];
      for (const s of students) {
        const fee = await Fee.create({
          student: s._id,
          studentName: s.name,
          grade: s.grade,
          section: s.section,
          title: title.trim(),
          amount: Number(amount),
          dueDate,
          status: "pending",
        });
        createdFees.push(fee);
      }

      return NextResponse.json({ success: true, count: createdFees.length, message: `Created ${createdFees.length} invoices` }, { status: 201 });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error creating fee invoice:", error);
    return NextResponse.json({ error: "Failed to create fee invoice" }, { status: 500 });
  }
}
