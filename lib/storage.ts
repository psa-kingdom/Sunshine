import { put, del } from "@vercel/blob";
import fs from "fs/promises";
import path from "path";

/**
 * Uploads a file or buffer to Vercel Blob storage, or local disk fallback if BLOB_READ_WRITE_TOKEN is not configured.
 * @param filename Target file name / path key in storage
 * @param data File object, Buffer, Blob, or ReadableStream
 * @returns Public HTTP URL of the uploaded asset
 */
export async function uploadFile(
  filename: string,
  data: File | Buffer | Blob | ReadableStream
): Promise<string> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (token) {
    try {
      const blob = await put(filename, data, {
        access: "public",
        token,
      });
      return blob.url;
    } catch (err) {
      console.warn("Vercel Blob upload failed, falling back to local storage:", err);
    }
  }

  // Local filesystem fallback
  try {
    const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, path.basename(sanitized));

    let buffer: Buffer;
    if (Buffer.isBuffer(data)) {
      buffer = data;
    } else if (data instanceof File || data instanceof Blob) {
      const arrayBuffer = await data.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else if (data && typeof (data as ReadableStream).getReader === "function") {
      const reader = (data as ReadableStream).getReader();
      const chunks: Uint8Array[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) chunks.push(value);
      }
      buffer = Buffer.concat(chunks);
    } else {
      throw new Error("Unsupported data format for local file storage.");
    }

    await fs.writeFile(filePath, buffer);
    return `/uploads/${path.basename(sanitized)}`;
  } catch (err) {
    console.error("Local storage fallback error:", err);
    throw new Error(err instanceof Error ? err.message : "Failed to store file");
  }
}

/**
 * Deletes a file from Vercel Blob storage or local disk using its URL.
 * @param url The public HTTP URL or local path of the asset to delete
 */
export async function deleteFile(url: string): Promise<void> {
  if (!url) return;

  if (url.startsWith("/uploads/")) {
    try {
      const fileName = path.basename(url);
      const filePath = path.join(process.cwd(), "public", "uploads", fileName);
      await fs.unlink(filePath);
    } catch (err) {
      console.warn("Could not delete local file:", err);
    }
    return;
  }

  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    await del(url, token ? { token } : undefined);
  } catch (err) {
    console.warn("Could not delete Vercel Blob asset:", err);
  }
}

