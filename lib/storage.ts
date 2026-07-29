import { put, del } from "@vercel/blob";

/**
 * Uploads a file or buffer to Vercel Blob storage.
 *
 * On production/Vercel: ALWAYS uses Vercel Blob.
 *   If BLOB_READ_WRITE_TOKEN is missing → throws a clear error immediately.
 *   No filesystem fallback is attempted — Vercel's runtime is read-only.
 *
 * On local development (NODE_ENV=development): falls back to public/uploads/
 *   only when BLOB_READ_WRITE_TOKEN is not configured.
 *
 * @param filename  Target path/key inside Blob storage
 * @param data      File | Buffer | Blob | ReadableStream to upload
 * @returns         Public URL of the uploaded asset
 */
export async function uploadFile(
  filename: string,
  data: File | Buffer | Blob | ReadableStream
): Promise<string> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const isDev = process.env.NODE_ENV === "development";

  // ── Production path: always use Vercel Blob ──────────────────────────────
  if (!isDev) {
    if (!token) {
      console.error(
        "[storage] BLOB_READ_WRITE_TOKEN is not set. " +
        "Add it to your Vercel project environment variables at: " +
        "https://vercel.com/dashboard → Project → Settings → Environment Variables"
      );
      throw new Error(
        "Missing Blob Token: BLOB_READ_WRITE_TOKEN is not configured. " +
        "Contact the system administrator."
      );
    }

    const blob = await put(filename, data, { access: "public", token });
    console.log("[storage] Uploaded to Vercel Blob:", blob.url);
    return blob.url;
  }

  // ── Development path: try Vercel Blob first, fall back to disk ───────────
  if (token) {
    try {
      const blob = await put(filename, data, { access: "public", token });
      console.log("[storage] Uploaded to Vercel Blob (dev):", blob.url);
      return blob.url;
    } catch (err) {
      console.warn("[storage] Vercel Blob upload failed in dev, falling back to disk:", err);
    }
  } else {
    console.warn("[storage] No BLOB_READ_WRITE_TOKEN — using local disk fallback (dev only)");
  }

  // Local filesystem fallback — ONLY in development
  const { promises: fs } = await import("fs");
  const path = await import("path");
  const sanitized = filename.replace(/[/\\]/g, "_").replace(/[^a-zA-Z0-9._-]/g, "_");
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, path.basename(sanitized));
  let buffer: Buffer;

  if (Buffer.isBuffer(data)) {
    buffer = data;
  } else if (data instanceof File || data instanceof Blob) {
    buffer = Buffer.from(await data.arrayBuffer());
  } else if (typeof (data as ReadableStream).getReader === "function") {
    const reader = (data as ReadableStream).getReader();
    const chunks: Uint8Array[] = [];
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }
    buffer = Buffer.concat(chunks);
  } else {
    throw new Error("[storage] Unsupported data format for local disk fallback.");
  }

  await fs.writeFile(filePath, buffer);
  const localUrl = `/uploads/${path.basename(sanitized)}`;
  console.log("[storage] Saved to local disk (dev):", localUrl);
  return localUrl;
}

/**
 * Deletes an asset from Vercel Blob storage or (in development) from local disk.
 * @param url  The public URL or local path returned by uploadFile
 */
export async function deleteFile(url: string): Promise<void> {
  if (!url) return;

  // Local disk file (development fallback)
  if (url.startsWith("/uploads/")) {
    if (process.env.NODE_ENV === "development") {
      try {
        const path = await import("path");
        const { promises: fs } = await import("fs");
        await fs.unlink(path.join(process.cwd(), "public", "uploads", path.basename(url)));
      } catch (err) {
        console.warn("[storage] Could not delete local file:", err);
      }
    }
    return;
  }

  // Vercel Blob
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    await del(url, token ? { token } : undefined);
  } catch (err) {
    console.warn("[storage] Could not delete Vercel Blob asset:", err);
  }
}


