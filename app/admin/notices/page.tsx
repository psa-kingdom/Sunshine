"use client";

import React, { useEffect, useState } from "react";
import AdminSkeleton from "@/components/admin/AdminSkeleton";
import AdminEmptyState from "@/components/admin/AdminEmptyState";

interface NoticeItem {
  _id: string;
  title: string;
  content: string;
  category: string;
  targetAudience: string;
  isPinned: boolean;
  createdAt: string;
}

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [targetAudience, setTargetAudience] = useState("all");
  const [isPinned, setIsPinned] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchNotices = async () => {
    try {
      const res = await fetch("/api/admin/notices");
      if (res.ok) {
        const data = await res.json();
        setNotices(data.notices || []);
      }
    } catch {
      console.error("Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, category, targetAudience, isPinned }),
      });

      if (res.ok) {
        setTitle("");
        setContent("");
        setIsPinned(false);
        fetchNotices();
      } else {
        alert("Failed to create notice");
      }
    } catch {
      alert("Error creating notice");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;
    try {
      const res = await fetch(`/api/admin/notices?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchNotices();
      }
    } catch {
      alert("Failed to delete notice");
    }
  };

  return (
    <main className="adminMain">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
        {/* Create Notice Form */}
        <div className="adminContentCard">
          <h2>Publish School Notice</h2>
          <form onSubmit={handleCreateNotice} style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
            <div>
              <label className="adminLabel">Notice Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Parent Teacher Conference Announcement"
                className="adminInput"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="adminLabel">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="adminInput">
                  <option value="general" style={{ background: "var(--navy-900)" }}>General</option>
                  <option value="academic" style={{ background: "var(--navy-900)" }}>Academic</option>
                  <option value="exam" style={{ background: "var(--navy-900)" }}>Examinations</option>
                  <option value="events" style={{ background: "var(--navy-900)" }}>Sports & Events</option>
                </select>
              </div>

              <div>
                <label className="adminLabel">Target Audience</label>
                <select value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} className="adminInput">
                  <option value="all" style={{ background: "var(--navy-900)" }}>All (Public & Portals)</option>
                  <option value="teachers" style={{ background: "var(--navy-900)" }}>Faculty & Teachers Only</option>
                  <option value="students" style={{ background: "var(--navy-900)" }}>Students & Parents Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="adminLabel">Notice Content *</label>
              <textarea
                rows={4}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Details of the announcement..."
                className="adminInput"
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                id="pinCheck"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
              />
              <label htmlFor="pinCheck" style={{ color: "#fff", fontSize: "0.85rem", cursor: "pointer" }}>
                📌 Pin Notice to Homepage Header
              </label>
            </div>

            <button type="submit" disabled={submitting} className="adminSubmitButton" style={{ width: "100%" }}>
              {submitting ? "Publishing..." : "Publish Notice"}
            </button>
          </form>
        </div>

        {/* Notices Feed */}
        <div className="adminContentCard">
          <h2>Published Notices ({notices.length})</h2>
          {loading ? (
            <AdminSkeleton message="Loading notices..." />
          ) : notices.length === 0 ? (
            <div style={{ marginTop: "1rem" }}>
              <AdminEmptyState message="No published notices found." />
            </div>
          ) : (
            <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
              {notices.map((n) => (
                <div key={n._id} style={{ padding: "1rem", background: "var(--navy-900)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "var(--gold-400)", fontWeight: 700 }}>
                      {n.category} • Target: {n.targetAudience} {n.isPinned && "📌 [Pinned]"}
                    </span>
                    <button onClick={() => handleDeleteNotice(n._id)} style={{ background: "transparent", border: "none", color: "#fca5a5", fontSize: "0.8rem", cursor: "pointer" }}>
                      Delete
                    </button>
                  </div>
                  <h4 style={{ color: "#fff", fontSize: "0.95rem", margin: "0.25rem 0" }}>{n.title}</h4>
                  <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>{n.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
