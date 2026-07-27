import { NextResponse } from "next/server";
import { connectDB } from "@/db";
import { Inquiry } from "@/db/models/Inquiry";

// Naive in-memory rate limiter (5 requests per 10 minutes per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return true;
  }

  record.count += 1;
  return false;
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many submission attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Honeypot check (b_hp_2026): hidden field filled by automated spam bots
    if (body.b_hp_2026 && String(body.b_hp_2026).trim() !== "") {
      // Silently accept submission without saving so bots don't adapt
      return NextResponse.json(
        { success: true, message: "Thank you! Your admission enquiry has been submitted successfully." },
        { status: 200 }
      );
    }

    const { parentName, email, phone, gradeApplyingFor, message } = body;

    // Server-side field validation
    if (!parentName || typeof parentName !== "string" || !parentName.trim()) {
      return NextResponse.json(
        { error: "Parent or guardian name is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== "string" || !phone.trim()) {
      return NextResponse.json(
        { error: "Contact phone number is required." },
        { status: 400 }
      );
    }

    if (!gradeApplyingFor || typeof gradeApplyingFor !== "string" || !gradeApplyingFor.trim()) {
      return NextResponse.json(
        { error: "Grade/Class applying for is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const inquiry = await Inquiry.create({
      parentName: parentName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      gradeApplyingFor: gradeApplyingFor.trim(),
      message: message && typeof message === "string" ? message.trim() : "",
      status: "new",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your admission enquiry has been submitted successfully.",
        id: inquiry._id.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing admission enquiry:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
