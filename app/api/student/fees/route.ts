import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/db";
import { Student } from "@/db/models/Student";
import { Fee } from "@/db/models/Fee";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const student = await Student.findOne({ email: session.user.email }).lean();
    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    const fees = await Fee.find({ student: student._id }).sort({ createdAt: -1 }).lean();
    const pendingTotal = fees
      .filter((f) => f.status === "pending" || f.status === "overdue")
      .reduce((acc, f) => acc + f.amount, 0);
    const paidTotal = fees
      .filter((f) => f.status === "paid")
      .reduce((acc, f) => acc + f.amount, 0);

    return NextResponse.json({ fees, pendingTotal, paidTotal }, { status: 200 });
  } catch (error) {
    console.error("Error fetching student fees:", error);
    return NextResponse.json({ error: "Failed to fetch student fees" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { feeId } = body;

    if (!feeId) {
      return NextResponse.json({ error: "Fee ID is required" }, { status: 400 });
    }

    await connectDB();
    const transactionId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const paidDate = new Date().toISOString().split("T")[0];

    const updatedFee = await Fee.findByIdAndUpdate(
      feeId,
      {
        status: "paid",
        paidDate,
        transactionId,
      },
      { new: true }
    );

    return NextResponse.json(
      { success: true, message: "Fee payment successful", fee: updatedFee },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing fee payment:", error);
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 });
  }
}
