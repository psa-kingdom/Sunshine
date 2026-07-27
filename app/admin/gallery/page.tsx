"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface MediaItem {
  _id: string;
  title: string;
  url: string;
  category: string;
  caption?: string;
  createdAt: string;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("campus");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/media");
      if (!res.ok) {
        throw new Error("Failed to load gallery items");
      }
      const data = await res.json();
      setItems(data.mediaItems || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select an image file to upload.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("category", category);
    formData.append("caption", caption);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to upload image.");
        return;
      }

      setTitle("");
      setCaption("");
      setFile(null);
      fetchItems();
    } catch {
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image from Vercel Blob storage?")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Failed to delete media item");
        return;
      }

      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch {
      alert("Error deleting media item");
    }
  };

  return (
    <div className="adminShell">
      <header className="adminHeader">
        <div className="adminHeaderInner">
          <div className="adminBrand">
            <span className="adminCrest">S</span>
            <div className="adminTitle">
              SUNSHINE PUBLIC SCHOOL
              <small>Media Gallery</small>
            </div>
          </div>

          <div className="adminUserInfo">
            <Link
              href="/admin"
              className="text-xs uppercase tracking-wider font-semibold text-[var(--gold-400)] hover:underline"
            >
              Dashboard
            </Link>
            <span className="text-gray-500">•</span>
            <Link
              href="/admin/inquiries"
              className="text-xs uppercase tracking-wider font-semibold text-[var(--gold-400)] hover:underline"
            >
              Inquiries
            </Link>
            <span className="text-gray-500">•</span>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="adminSignOutButton"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="adminMain">
        {/* Upload Form Card */}
        <div className="adminContentCard" style={{ marginBottom: "2rem" }}>
          <h2>Upload Gallery Image (Vercel Blob Storage)</h2>
          <form onSubmit={handleUpload} style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
              <div>
                <label className="adminLabel">Image Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Science Lab Inauguration"
                  className="adminInput"
                />
              </div>

              <div>
                <label className="adminLabel">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="adminInput"
                >
                  <option value="campus" style={{ background: "var(--navy-900)" }}>Campus & Infrastructure</option>
                  <option value="sports" style={{ background: "var(--navy-900)" }}>Sports & Athletics</option>
                  <option value="academics" style={{ background: "var(--navy-900)" }}>Academics & Labs</option>
                  <option value="events" style={{ background: "var(--navy-900)" }}>Events & Celebrations</option>
                </select>
              </div>
            </div>

            <div>
              <label className="adminLabel">Select Image File *</label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="adminInput"
                style={{ padding: "0.5rem" }}
              />
            </div>

            <div>
              <label className="adminLabel">Caption (Optional)</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Brief description of the image"
                className="adminInput"
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="adminSubmitButton"
              style={{ width: "auto", justifySelf: "start" }}
            >
              {uploading ? "Uploading to Vercel Blob..." : "Upload to Gallery"}
            </button>
          </form>
        </div>

        {/* Existing Gallery Items Grid */}
        <div className="adminContentCard">
          <h2>Gallery Items ({items.length})</h2>
          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "rgba(255,255,255,0.6)" }}>
              Loading media gallery...
            </div>
          ) : error ? (
            <div className="adminError">{error}</div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "rgba(255,255,255,0.5)", border: "1px dashed var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
              No images uploaded yet. Use the form above to upload your first image.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem", marginTop: "1rem" }}>
              {items.map((item) => (
                <div
                  key={item._id}
                  style={{
                    background: "var(--navy-900)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-sm)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ height: "180px", background: "#000", overflow: "hidden", position: "relative" }}>
                    <img
                      src={item.url}
                      alt={item.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--gold-400)", fontWeight: 600 }}>
                        {item.category}
                      </div>
                      <h4 style={{ color: "#ffffff", fontSize: "1rem", margin: "0.25rem 0 0.5rem 0" }}>{item.title}</h4>
                      <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", wordBreak: "break-all", marginBottom: "0.5rem" }}>
                        URL: <a href={item.url} target="_blank" rel="noreferrer" style={{ color: "var(--gold-300)" }}>{item.url}</a>
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(item._id)}
                      style={{
                        background: "rgba(220, 38, 38, 0.2)",
                        border: "1px solid rgba(239, 68, 68, 0.4)",
                        color: "#fca5a5",
                        padding: "0.4rem 0.8rem",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        marginTop: "0.75rem",
                      }}
                    >
                      Delete Asset
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
