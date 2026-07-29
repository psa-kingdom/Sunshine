import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/db";
import { HeroVideo } from "@/db/models/HeroVideo";
import { uploadFile, deleteFile } from "@/lib/storage";

/** GET — admin: list all hero videos */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const videos = await HeroVideo.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ videos }, { status: 200 });
  } catch (error) {
    console.error("Error fetching hero videos:", error);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}

/** POST — upload a new hero video */
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Video file is required." }, { status: 400 });
    }
    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }

    const MAX_SIZE = 100 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `Video file exceeds maximum limit of 100MB (File: ${(file.size / (1024 * 1024)).toFixed(1)}MB).` },
        { status: 413 }
      );
    }

    const videoUrl = await uploadFile(`hero-videos/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`, file);

    await connectDB();
    const video = await HeroVideo.create({
      title: title.trim(),
      url: videoUrl,
      isActive: false,
    });

    return NextResponse.json({ video, success: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to upload video";
    console.error("Error uploading hero video:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** PATCH — set a video as active (one active at a time) */
export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, isActive } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required." }, { status: 400 });
    }

    await connectDB();

    if (isActive) {
      // Deactivate all others first
      await HeroVideo.updateMany({}, { isActive: false });
    }

    const video = await HeroVideo.findByIdAndUpdate(
      id,
      { isActive: !!isActive },
      { new: true }
    );

    if (!video) {
      return NextResponse.json({ error: "Video not found." }, { status: 404 });
    }

    return NextResponse.json({ video, success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating hero video:", error);
    return NextResponse.json({ error: "Failed to update video" }, { status: 500 });
  }
}

/** DELETE — remove a hero video */
export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required." }, { status: 400 });
    }

    await connectDB();
    const video = await HeroVideo.findByIdAndDelete(id);
    if (!video) {
      return NextResponse.json({ error: "Video not found." }, { status: 404 });
    }

    // Delete from Vercel Blob
    try { await deleteFile(video.url); } catch {}

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting hero video:", error);
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  }
}
