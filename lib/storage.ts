import { put, del } from "@vercel/blob";

/**
 * Uploads a file or buffer to Vercel Blob storage.
 * @param filename Target file name / path key in storage
 * @param data File object, Buffer, or ReadableStream
 * @returns Public HTTP URL of the uploaded blob asset
 */
export async function uploadFile(
  filename: string,
  data: File | Buffer | Blob | ReadableStream
): Promise<string> {
  const blob = await put(filename, data, {
    access: "public",
  });
  return blob.url;
}

/**
 * Deletes a file from Vercel Blob storage using its public URL.
 * @param url The public HTTP URL of the blob to delete
 */
export async function deleteFile(url: string): Promise<void> {
  if (!url) return;
  await del(url);
}
