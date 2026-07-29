import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/db";
import { HeroImage } from "@/db/models/HeroImage";
import { uploadFile, deleteFile } from "@/lib/storage";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const images = await HeroImage.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ images }, { status: 200 });
  } catch (error) {
    console.error("Error fetching hero images:", error);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;

    if (!file || !(file instanceof File))
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    if (!title || !title.trim())
      return NextResponse.json({ error: "Title is required." }, { status: 400 });

    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `Image file exceeds maximum limit of 15MB (File: ${(file.size / (1024 * 1024)).toFixed(1)}MB).` },
        { status: 413 }
      );
    }

    const imageUrl = await uploadFile(`hero-images/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`, file);

    await connectDB();
    const image = await HeroImage.create({ title: title.trim(), url: imageUrl, isActive: false });
    return NextResponse.json({ image, success: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to upload image";
    console.error("Error uploading hero image:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, isActive } = await req.json();
    if (!id) return NextResponse.json({ error: "ID is required." }, { status: 400 });

    await connectDB();
    if (isActive) await HeroImage.updateMany({}, { isActive: false });

    const image = await HeroImage.findByIdAndUpdate(id, { isActive: !!isActive }, { new: true });
    if (!image) return NextResponse.json({ error: "Image not found." }, { status: 404 });

    return NextResponse.json({ image, success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating hero image:", error);
    return NextResponse.json({ error: "Failed to update image" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID is required." }, { status: 400 });

    await connectDB();
    const image = await HeroImage.findByIdAndDelete(id);
    if (!image) return NextResponse.json({ error: "Image not found." }, { status: 404 });

    try { await deleteFile(image.url); } catch {}

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting hero image:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
