import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/db";
import { Teacher } from "@/db/models/Teacher";
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
    const teacher = await Teacher.findById(id).lean();

    if (!teacher) {
      return NextResponse.json({ error: "Faculty record not found" }, { status: 404 });
    }

    return NextResponse.json({ teacher }, { status: 200 });
  } catch (error) {
    console.error("Error fetching faculty record:", error);
    return NextResponse.json({ error: "Failed to fetch faculty record" }, { status: 500 });
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
      const updated = await Teacher.findByIdAndUpdate(id, { passwordHash }, { new: true });

      await recordAuditLog({
        action: "PASSWORD_RESET",
        module: "TEACHER",
        details: `Reset password for faculty ${updated?.name} (Emp ID: ${updated?.employeeId})`,
        targetId: id,
      });

      return NextResponse.json({ success: true, message: "Password reset successfully" }, { status: 200 });
    }

    // Prevent mutating employeeId if present
    delete body.employeeId;

    const updatedTeacher = await Teacher.findByIdAndUpdate(id, { $set: body }, { new: true }).lean();

    if (!updatedTeacher) {
      return NextResponse.json({ error: "Faculty record not found" }, { status: 404 });
    }

    await recordAuditLog({
      action: "UPDATE",
      module: "TEACHER",
      details: `Updated profile for faculty member ${updatedTeacher.name} (${updatedTeacher.department})`,
      targetId: id,
    });

    return NextResponse.json({ teacher: updatedTeacher, success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating faculty record:", error);
    return NextResponse.json({ error: "Failed to update faculty record" }, { status: 500 });
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

    const deleted = await Teacher.findByIdAndDelete(id);

    if (deleted) {
      await recordAuditLog({
        action: "DELETE",
        module: "TEACHER",
        details: `Deleted faculty record: ${deleted.name} (${deleted.employeeId})`,
        targetId: id,
      });
    }

    return NextResponse.json({ success: true, message: "Faculty record deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting faculty record:", error);
    return NextResponse.json({ error: "Failed to delete faculty record" }, { status: 500 });
  }
}
