import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/db";
import { MediaItem } from "@/db/models/MediaItem";
import { deleteFile } from "@/lib/storage";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();
    const mediaItem = await MediaItem.findById(id);

    if (!mediaItem) {
      return NextResponse.json({ error: "Media item not found" }, { status: 404 });
    }

    // Delete asset from Vercel Blob via lib/storage.ts
    if (mediaItem.url) {
      try {
        await deleteFile(mediaItem.url);
      } catch (blobErr) {
        console.warn("Could not delete file from Vercel Blob:", blobErr);
      }
    }

    await MediaItem.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Media item deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting media item:", error);
    return NextResponse.json(
      { error: "Failed to delete media item" },
      { status: 500 }
    );
  }
}
