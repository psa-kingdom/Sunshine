import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/db";
import { Student } from "@/db/models/Student";
import { recordAuditLog } from "@/lib/audit";
import bcrypt from "bcryptjs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const student = await Student.findById(id).lean();

    if (!student) {
      return NextResponse.json({ error: "Student record not found" }, { status: 404 });
    }

    return NextResponse.json({ student }, { status: 200 });
  } catch (error) {
    console.error("Error fetching student record:", error);
    return NextResponse.json({ error: "Failed to fetch student record" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    await connectDB();

    // Password reset action
    if (body.action === "reset_password") {
      if (!body.newPassword) {
        return NextResponse.json({ error: "New password is required" }, { status: 400 });
      }
      const passwordHash = await bcrypt.hash(body.newPassword, 10);
      const updated = await Student.findByIdAndUpdate(id, { passwordHash }, { new: true });

      await recordAuditLog({
        action: "PASSWORD_RESET",
        module: "STUDENT",
        details: `Reset password for student ${updated?.name} (Roll #${updated?.rollNumber})`,
        targetId: id,
      });

      return NextResponse.json({ success: true, message: "Password reset successfully" }, { status: 200 });
    }

    // Prevent mutating permanentId if present
    delete body.permanentId;

    const updatedStudent = await Student.findByIdAndUpdate(id, { $set: body }, { new: true }).lean();

    if (!updatedStudent) {
      return NextResponse.json({ error: "Student record not found" }, { status: 404 });
    }

    await recordAuditLog({
      action: "UPDATE",
      module: "STUDENT",
      details: `Updated profile for student ${updatedStudent.name} (${updatedStudent.grade}-${updatedStudent.section})`,
      targetId: id,
    });

    return NextResponse.json({ student: updatedStudent, success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating student record:", error);
    return NextResponse.json({ error: "Failed to update student record" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const deleted = await Student.findByIdAndDelete(id);

    if (deleted) {
      await recordAuditLog({
        action: "DELETE",
        module: "STUDENT",
        details: `Deleted student record: ${deleted.name} (${deleted.email})`,
        targetId: id,
      });
    }

    return NextResponse.json({ success: true, message: "Student record deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json({ error: "Failed to delete student record" }, { status: 500 });
  }
}
