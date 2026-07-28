import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/db";
import { MediaItem } from "@/db/models/MediaItem";
import { uploadFile } from "@/lib/storage";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const mediaItems = await MediaItem.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ mediaItems }, { status: 200 });
  } catch (error) {
    console.error("Error fetching media items:", error);
    return NextResponse.json(
      { error: "Failed to fetch media items" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;
    const category = (formData.get("category") as string) || "general";
    const caption = (formData.get("caption") as string) || "";

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "File attachment is required." }, { status: 400 });
    }

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }

    // Size limit: 15MB for gallery uploads
    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds maximum limit of 15MB (File: ${(file.size / (1024 * 1024)).toFixed(1)}MB).` },
        { status: 413 }
      );
    }

    // Upload to Vercel Blob via lib/storage.ts
    const blobUrl = await uploadFile(`gallery/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`, file);

    await connectDB();
    const mediaItem = await MediaItem.create({
      title: title.trim(),
      url: blobUrl,
      category: category.trim(),
      caption: caption.trim(),
    });

    return NextResponse.json({ mediaItem, success: true }, { status: 201 });
  } catch (error) {
    console.error("Error uploading media file:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload media item" },
      { status: 500 }
    );
  }
}
