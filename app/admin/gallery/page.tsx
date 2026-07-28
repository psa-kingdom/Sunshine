"use client";

import React, { useEffect, useState, useRef } from "react";
import AdminSkeleton from "@/components/admin/AdminSkeleton";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import { ToastContainer, useToast } from "@/components/admin/Toast";
import {
  Upload, X, Trash2, ChevronLeft, FolderOpen, ImageIcon, Film,
  Eye, EyeOff, ExternalLink, Sparkles
} from "lucide-react";

interface MediaItem {
  _id: string;
  title: string;
  url: string;
  category: string;
  caption?: string;
  createdAt: string;
}

interface HeroMediaAsset {
  _id: string;
  title: string;
  url: string;
  isActive: boolean;
  createdAt: string;
}

const CATEGORIES = [
  { key: "hero-media",   label: "Hero Media",             emoji: "🎯", desc: "Homepage hero images & hero videos" },
  { key: "campus",       label: "Campus & Infrastructure", emoji: "🏫", desc: "Buildings, grounds, facilities" },
  { key: "events",       label: "Events & Celebrations",   emoji: "🎉", desc: "Annual day, sports day, fests" },
  { key: "academics",    label: "Academics & Labs",        emoji: "🔬", desc: "Classrooms, labs, library" },
  { key: "sports",       label: "Sports & Athletics",      emoji: "🏆", desc: "Sports, tournaments, athletics" },
];

function getCategoryConfig(key: string) {
  return CATEGORIES.find((c) => c.key === key) || { key, label: key, emoji: "📁", desc: "" };
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const { toasts, removeToast, toast } = useToast();

  // ── Hero Media States ──
  const [heroSubTab, setHeroSubTab] = useState<"hero-images" | "hero-videos">("hero-images");
  const [heroImages, setHeroImages] = useState<HeroMediaAsset[]>([]);
  const [heroVideos, setHeroVideos] = useState<HeroMediaAsset[]>([]);
  const [heroLoading, setHeroLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("campus");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setItems(data.mediaItems || []);
    } catch {
      toast.error("Failed to load gallery items.");
    } finally {
      setLoading(false);
    }
  };

  const fetchHeroMedia = async () => {
    setHeroLoading(true);
    try {
      const [imgRes, vidRes] = await Promise.all([
        fetch("/api/admin/hero-image"),
        fetch("/api/admin/hero-video"),
      ]);
      const imgData = await imgRes.json();
      const vidData = await vidRes.json();
      setHeroImages(imgData.images || []);
      setHeroVideos(vidData.videos || []);
    } catch {
      toast.error("Failed to load hero media assets.");
    } finally {
      setHeroLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchHeroMedia();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { toast.error("Select a file to upload."); return; }
    if (!title.trim()) { toast.error("Enter a title."); return; }

    setUploading(true);

    // If uploading directly into Hero Media (images or videos)
    if (category === "hero-media") {
      const isVideo = file.type.startsWith("video/");
      const endpoint = isVideo ? "/api/admin/hero-video" : "/api/admin/hero-image";
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);

      try {
        const res = await fetch(endpoint, { method: "POST", body: formData });
        if (!res.ok) {
          let errorMsg = `Upload failed (${res.status})`;
          const ct = res.headers.get("content-type") || "";
          if (ct.includes("application/json")) {
            const data = await res.json();
            errorMsg = data.error || errorMsg;
          } else if (res.status === 413) {
            errorMsg = "File exceeds the maximum payload size limit.";
          }
          toast.error("Upload failed.", errorMsg);
          return;
        }
        const data = await res.json();
        toast.success(isVideo ? "Hero Video uploaded!" : "Hero Image uploaded!", title);
        setTitle(""); setCaption(""); setFile(null); setPreviewUrl(null);
        if (fileRef.current) fileRef.current.value = "";
        setShowUploadForm(false);
        fetchHeroMedia();
      } catch (err) {
        toast.error("Upload error.", err instanceof Error ? err.message : "Check network connection.");
      } finally {
        setUploading(false);
      }
      return;
    }

    // Standard Gallery Upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("category", category);
    formData.append("caption", caption);

    try {
      const res = await fetch("/api/admin/media", { method: "POST", body: formData });
      if (!res.ok) {
        let errorMsg = `Upload failed (${res.status})`;
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const data = await res.json();
          errorMsg = data.error || errorMsg;
        } else if (res.status === 413) {
          errorMsg = "File exceeds the maximum payload size limit.";
        }
        toast.error("Upload failed.", errorMsg);
        return;
      }
      const data = await res.json();
      toast.success("Image uploaded!", title);
      setTitle(""); setCaption(""); setFile(null); setPreviewUrl(null);
      if (fileRef.current) fileRef.current.value = "";
      setShowUploadForm(false);
      fetchItems();
    } catch (err) {
      toast.error("Upload error.", err instanceof Error ? err.message : "Check network connection.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image from Vercel Blob storage?")) return;
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      if (!res.ok) { toast.error("Delete failed."); return; }
      toast.success("Image deleted.");
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch {
      toast.error("Delete error.");
    }
  };

  const handleHeroActivate = async (type: "image" | "video", id: string, currentlyActive: boolean) => {
    const endpoint = type === "image" ? "/api/admin/hero-image" : "/api/admin/hero-video";
    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentlyActive }),
      });
      if (res.ok) {
        toast.success(currentlyActive ? `${type === "image" ? "Image" : "Video"} deactivated.` : `Set as active hero ${type}!`);
        fetchHeroMedia();
      } else {
        toast.error("Failed to update status.");
      }
    } catch {
      toast.error("Update error.");
    }
  };

  const handleHeroDelete = async (type: "image" | "video", id: string) => {
    if (!confirm(`Delete this hero ${type}? This cannot be undone.`)) return;
    const endpoint = type === "image" ? `/api/admin/hero-image?id=${id}` : `/api/admin/hero-video?id=${id}`;
    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (res.ok) {
        toast.success(`Hero ${type} deleted.`);
        fetchHeroMedia();
      } else {
        toast.error("Delete failed.");
      }
    } catch {
      toast.error("Delete error.");
    }
  };

  // Group by category
  const grouped = CATEGORIES.map((cat) => {
    if (cat.key === "hero-media") {
      const totalHeroCount = heroImages.length + heroVideos.length;
      const cover = heroImages[0]?.url || heroVideos[0]?.url || "";
      return { ...cat, itemsCount: totalHeroCount, coverUrl: cover };
    }
    const catItems = items.filter((i) => i.category === cat.key);
    return { ...cat, itemsCount: catItems.length, coverUrl: catItems[0]?.url || "" };
  });

  const knownKeys = CATEGORIES.map((c) => c.key);
  const other = items.filter((i) => !knownKeys.includes(i.category));

  // ── ALBUM DETAIL VIEW ──
  if (selectedAlbum) {
    const isHeroAlbum = selectedAlbum === "hero-media";
    const albumConfig = selectedAlbum === "__other__"
      ? { key: "__other__", label: "Other / Uncategorised", emoji: "📁", desc: "" }
      : getCategoryConfig(selectedAlbum);

    const standardAlbumItems = selectedAlbum === "__other__"
      ? other
      : items.filter((i) => i.category === selectedAlbum);

    return (
      <main className="adminMain">
        <ToastContainer toasts={toasts} onRemove={removeToast} />

        {/* Album Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={() => setSelectedAlbum(null)}
              style={{
                display: "flex", alignItems: "center", gap: "0.35rem",
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.7)", borderRadius: "0.6rem", padding: "0.45rem 0.85rem",
                fontSize: "0.8rem", fontWeight: 700, cursor: "pointer",
              }}
            >
              <ChevronLeft style={{ width: "0.9rem", height: "0.9rem" }} /> All Albums
            </button>
            <div>
              <h1 style={{ color: "#fff", fontSize: "1.35rem", fontWeight: 900, margin: 0 }}>
                {albumConfig.emoji} {albumConfig.label}
              </h1>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem", margin: "0.15rem 0 0 0" }}>
                {isHeroAlbum ? `${heroImages.length} image(s) • ${heroVideos.length} video(s)` : `${standardAlbumItems.length} image(s)`}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => window.open("/", "_blank")}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                padding: "0.5rem 0.9rem",
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff", borderRadius: "0.5rem", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
              }}
            >
              <ExternalLink style={{ width: "0.85rem", height: "0.85rem" }} />
              Preview Homepage
            </button>

            <button
              onClick={() => { setCategory(selectedAlbum === "__other__" ? "campus" : selectedAlbum); setShowUploadForm(true); }}
              className="adminSubmitButton"
              style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem" }}
            >
              <Upload style={{ width: "0.85rem", height: "0.85rem" }} /> Upload to Album
            </button>
          </div>
        </div>

        {/* Upload Form Modal/Inline */}
        {showUploadForm && (
          <div className="adminContentCard" style={{ marginBottom: "1.5rem", border: "1px solid rgba(255,215,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ margin: 0 }}>Upload Asset to {albumConfig.label}</h2>
              <button onClick={() => setShowUploadForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)" }}>
                <X style={{ width: "1rem", height: "1rem" }} />
              </button>
            </div>
            <form onSubmit={handleUpload} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="adminLabel">Asset Title *</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Science Lab Inauguration" className="adminInput" />
              </div>
              <div>
                <label className="adminLabel">Album / Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="adminInput">
                  {CATEGORIES.map((c) => <option key={c.key} value={c.key} style={{ background: "var(--navy-900)" }}>{c.emoji} {c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="adminLabel">Caption (Optional)</label>
                <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Brief description" className="adminInput" />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="adminLabel">File * (Image or Video)</label>
                <input ref={fileRef} type="file" accept={category === "hero-media" ? "image/*,video/*" : "image/*"} required onChange={handleFileChange} className="adminInput" style={{ padding: "0.5rem" }} />
              </div>
              {previewUrl && (
                <div style={{ gridColumn: "1 / -1", borderRadius: "0.5rem", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {file?.type.startsWith("video/") ? (
                    <video src={previewUrl} controls muted style={{ width: "100%", maxHeight: "220px", background: "#000" }} />
                  ) : (
                    <img src={previewUrl} alt="preview" style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }} />
                  )}
                </div>
              )}
              <div style={{ gridColumn: "1 / -1" }}>
                <button type="submit" disabled={uploading} className="adminSubmitButton">
                  <Upload style={{ width: "0.85rem", height: "0.85rem" }} />
                  {uploading ? "Uploading to Vercel Blob..." : "Upload Asset"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── HERO MEDIA ALBUM VIEW ── */}
        {isHeroAlbum ? (
          <div>
            {/* Hero Sub Tab Switcher */}
            <div style={{
              display: "inline-flex", gap: "0.3rem",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "0.75rem", padding: "0.3rem", marginBottom: "1.5rem"
            }}>
              <button
                onClick={() => setHeroSubTab("hero-images")}
                style={{
                  display: "flex", alignItems: "center", gap: "0.4rem",
                  padding: "0.5rem 1rem", borderRadius: "0.5rem", border: "none",
                  background: heroSubTab === "hero-images" ? "rgba(255,255,255,0.12)" : "transparent",
                  color: heroSubTab === "hero-images" ? "#fff" : "rgba(255,255,255,0.45)",
                  fontWeight: 700, fontSize: "0.8rem", cursor: "pointer",
                }}
              >
                <ImageIcon style={{ width: "0.85rem", height: "0.85rem" }} />
                Hero Images ({heroImages.length})
              </button>
              <button
                onClick={() => setHeroSubTab("hero-videos")}
                style={{
                  display: "flex", alignItems: "center", gap: "0.4rem",
                  padding: "0.5rem 1rem", borderRadius: "0.5rem", border: "none",
                  background: heroSubTab === "hero-videos" ? "rgba(255,255,255,0.12)" : "transparent",
                  color: heroSubTab === "hero-videos" ? "#fff" : "rgba(255,255,255,0.45)",
                  fontWeight: 700, fontSize: "0.8rem", cursor: "pointer",
                }}
              >
                <Film style={{ width: "0.85rem", height: "0.85rem" }} />
                Hero Videos ({heroVideos.length})
              </button>
            </div>

            {heroLoading ? (
              <AdminSkeleton message="Loading hero media assets..." />
            ) : heroSubTab === "hero-images" ? (
              heroImages.length === 0 ? (
                <AdminEmptyState message="No hero images uploaded yet. Click Upload to add one." />
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
                  {heroImages.map((img) => (
                    <div key={img._id} style={{ background: img.isActive ? "rgba(255,215,0,0.06)" : "var(--navy-900)", border: `1px solid ${img.isActive ? "rgba(255,215,0,0.3)" : "var(--border-subtle)"}`, borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                      <div style={{ height: "160px", background: "#000", position: "relative" }}>
                        <img src={img.url} alt={img.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        {img.isActive && (
                          <div style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "var(--gold-400)", color: "#000", fontSize: "0.62rem", fontWeight: 900, padding: "0.15rem 0.5rem", borderRadius: "9999px", textTransform: "uppercase" }}>
                            Active Hero
                          </div>
                        )}
                      </div>
                      <div style={{ padding: "0.85rem" }}>
                        <h4 style={{ color: "#fff", fontSize: "0.88rem", fontWeight: 700, margin: "0 0 0.5rem 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{img.title}</h4>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={() => handleHeroActivate("image", img._id, img.isActive)}
                            style={{
                              flex: 1, padding: "0.4rem", borderRadius: "0.4rem", border: "1px solid rgba(255,255,255,0.12)",
                              background: img.isActive ? "rgba(255,215,0,0.1)" : "rgba(255,255,255,0.06)",
                              color: img.isActive ? "var(--gold-400)" : "rgba(255,255,255,0.6)",
                              fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem",
                            }}
                          >
                            {img.isActive ? <><EyeOff style={{ width: "0.75rem", height: "0.75rem" }} /> Deactivate</> : <><Eye style={{ width: "0.75rem", height: "0.75rem" }} /> Activate</>}
                          </button>
                          <button
                            onClick={() => handleHeroDelete("image", img._id)}
                            style={{ padding: "0.4rem 0.6rem", borderRadius: "0.4rem", border: "1px solid rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.1)", color: "#fca5a5", fontSize: "0.72rem", cursor: "pointer" }}
                          >
                            <Trash2 style={{ width: "0.75rem", height: "0.75rem" }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              heroVideos.length === 0 ? (
                <AdminEmptyState message="No hero videos uploaded yet. Click Upload to add one." />
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
                  {heroVideos.map((vid) => (
                    <div key={vid._id} style={{ background: vid.isActive ? "rgba(255,215,0,0.06)" : "var(--navy-900)", border: `1px solid ${vid.isActive ? "rgba(255,215,0,0.3)" : "var(--border-subtle)"}`, borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                      <div style={{ height: "160px", background: "#000", position: "relative" }}>
                        <video src={vid.url} muted preload="metadata" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        {vid.isActive && (
                          <div style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "var(--gold-400)", color: "#000", fontSize: "0.62rem", fontWeight: 900, padding: "0.15rem 0.5rem", borderRadius: "9999px", textTransform: "uppercase" }}>
                            Active Hero
                          </div>
                        )}
                      </div>
                      <div style={{ padding: "0.85rem" }}>
                        <h4 style={{ color: "#fff", fontSize: "0.88rem", fontWeight: 700, margin: "0 0 0.5rem 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{vid.title}</h4>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={() => handleHeroActivate("video", vid._id, vid.isActive)}
                            style={{
                              flex: 1, padding: "0.4rem", borderRadius: "0.4rem", border: "1px solid rgba(255,255,255,0.12)",
                              background: vid.isActive ? "rgba(255,215,0,0.1)" : "rgba(255,255,255,0.06)",
                              color: vid.isActive ? "var(--gold-400)" : "rgba(255,255,255,0.6)",
                              fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem",
                            }}
                          >
                            {vid.isActive ? <><EyeOff style={{ width: "0.75rem", height: "0.75rem" }} /> Deactivate</> : <><Eye style={{ width: "0.75rem", height: "0.75rem" }} /> Activate</>}
                          </button>
                          <button
                            onClick={() => handleHeroDelete("video", vid._id)}
                            style={{ padding: "0.4rem 0.6rem", borderRadius: "0.4rem", border: "1px solid rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.1)", color: "#fca5a5", fontSize: "0.72rem", cursor: "pointer" }}
                          >
                            <Trash2 style={{ width: "0.75rem", height: "0.75rem" }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        ) : (
          /* ── STANDARD GALLERY ALBUM ── */
          standardAlbumItems.length === 0 ? (
            <AdminEmptyState message="No images in this album yet. Click Upload to add one." />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
              {standardAlbumItems.map((item) => (
                <div key={item._id} style={{ background: "var(--navy-900)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                  <div style={{ height: "180px", background: "#000", overflow: "hidden" }}>
                    <img src={item.url} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ padding: "0.875rem" }}>
                    <div style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--gold-400)", fontWeight: 700, marginBottom: "0.25rem" }}>
                      {getCategoryConfig(item.category).label}
                    </div>
                    <h4 style={{ color: "#fff", fontSize: "0.9rem", margin: "0 0 0.25rem 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</h4>
                    {item.caption && <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", margin: "0 0 0.75rem 0" }}>{item.caption}</p>}
                    <button
                      onClick={() => handleDelete(item._id)}
                      style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5", borderRadius: "0.4rem", padding: "0.35rem 0.65rem", fontSize: "0.72rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}
                    >
                      <Trash2 style={{ width: "0.7rem", height: "0.7rem" }} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </main>
    );
  }

  // ── ALBUM GRID VIEW (default overview) ──
  return (
    <main className="adminMain">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 900, margin: "0 0 0.25rem 0" }}>
            Gallery &amp; Media Management
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", margin: 0 }}>
            Unified media repository across {CATEGORIES.length} albums including Hero Media.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={() => window.open("/", "_blank")}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              padding: "0.6rem 1.1rem",
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff", borderRadius: "var(--radius-full)", fontSize: "0.8rem",
              fontWeight: 700, cursor: "pointer",
            }}
          >
            <ExternalLink style={{ width: "0.85rem", height: "0.85rem" }} />
            Preview Homepage
          </button>
          <button
            onClick={() => setShowUploadForm((v) => !v)}
            className="adminSubmitButton"
            style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1.2rem" }}
          >
            <Upload style={{ width: "0.85rem", height: "0.85rem" }} />
            Upload Asset
          </button>
        </div>
      </div>

      {/* Quick Upload Form */}
      {showUploadForm && (
        <div className="adminContentCard" style={{ marginBottom: "1.5rem", border: "1px solid rgba(255,215,0,0.15)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h2 style={{ margin: 0 }}>Upload New Asset</h2>
            <button onClick={() => setShowUploadForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)" }}>
              <X style={{ width: "1rem", height: "1rem" }} />
            </button>
          </div>
          <form onSubmit={handleUpload} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="adminLabel">Asset Title *</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Science Lab Inauguration" className="adminInput" />
            </div>
            <div>
              <label className="adminLabel">Album / Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="adminInput">
                {CATEGORIES.map((c) => <option key={c.key} value={c.key} style={{ background: "var(--navy-900)" }}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="adminLabel">Caption (Optional)</label>
              <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Brief description" className="adminInput" />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="adminLabel">Asset File * (Image or Video for Hero Media)</label>
              <input ref={fileRef} type="file" accept={category === "hero-media" ? "image/*,video/*" : "image/*"} required onChange={handleFileChange} className="adminInput" style={{ padding: "0.5rem" }} />
            </div>
            {previewUrl && (
              <div style={{ gridColumn: "1 / -1", borderRadius: "0.5rem", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                {file?.type.startsWith("video/") ? (
                  <video src={previewUrl} controls muted style={{ width: "100%", maxHeight: "200px", background: "#000" }} />
                ) : (
                  <img src={previewUrl} alt="preview" style={{ width: "100%", maxHeight: "180px", objectFit: "cover" }} />
                )}
              </div>
            )}
            <div style={{ gridColumn: "1 / -1" }}>
              <button type="submit" disabled={uploading} className="adminSubmitButton">
                <Upload style={{ width: "0.85rem", height: "0.85rem" }} />
                {uploading ? "Uploading to Vercel Blob..." : "Upload Asset"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <AdminSkeleton message="Loading media albums..." />
      ) : (
        <>
          {/* Album Category Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
            {grouped.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedAlbum(cat.key)}
                style={{
                  background: cat.key === "hero-media" ? "rgba(99,102,241,0.06)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${cat.key === "hero-media" ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "var(--radius-sm)",
                  overflow: "hidden", cursor: "pointer",
                  textAlign: "left", padding: 0,
                  transition: "border-color 0.2s, transform 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,215,0,0.3)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = cat.key === "hero-media" ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                {/* Cover Image */}
                <div style={{ height: "140px", background: "rgba(255,255,255,0.04)", overflow: "hidden", position: "relative" }}>
                  {cat.coverUrl ? (
                    cat.coverUrl.endsWith(".mp4") || cat.coverUrl.endsWith(".webm") ? (
                      <video src={cat.coverUrl} muted preload="metadata" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <img src={cat.coverUrl} alt={cat.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    )
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ImageIcon style={{ width: "2rem", height: "2rem", color: "rgba(255,255,255,0.15)" }} />
                    </div>
                  )}
                  {/* Count Badge */}
                  <div style={{
                    position: "absolute", top: "0.5rem", right: "0.5rem",
                    background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
                    borderRadius: "9999px", padding: "0.15rem 0.55rem",
                    fontSize: "0.68rem", fontWeight: 800, color: "#fff",
                  }}>
                    {cat.itemsCount} asset{cat.itemsCount !== 1 ? "s" : ""}
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: "0.85rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.2rem" }}>
                    <span style={{ fontSize: "1rem" }}>{cat.emoji}</span>
                    <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "#fff" }}>{cat.label}</span>
                  </div>
                  <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", margin: 0 }}>{cat.desc}</p>
                </div>
              </button>
            ))}

            {/* Other category card if any */}
            {other.length > 0 && (
              <button
                onClick={() => setSelectedAlbum("__other__")}
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "var(--radius-sm)", overflow: "hidden", cursor: "pointer", textAlign: "left", padding: 0 }}
              >
                <div style={{ height: "140px", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FolderOpen style={{ width: "2rem", height: "2rem", color: "rgba(255,255,255,0.2)" }} />
                </div>
                <div style={{ padding: "0.85rem" }}>
                  <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#fff", marginBottom: "0.15rem" }}>📁 Other</div>
                  <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", margin: 0 }}>{other.length} uncategorised item{other.length !== 1 ? "s" : ""}</p>
                </div>
              </button>
            )}
          </div>
        </>
      )}
    </main>
  );
}
