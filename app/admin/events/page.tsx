"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface EventItem {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  type: string;
  isPublic: boolean;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("academic");
  const [submitting, setSubmitting] = useState(false);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/admin/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch {
      console.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, startDate, endDate, type }),
      });

      if (res.ok) {
        setTitle("");
        setDescription("");
        setStartDate("");
        setEndDate("");
        fetchEvents();
      } else {
        alert("Failed to create event");
      }
    } catch {
      alert("Error creating event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    try {
      const res = await fetch(`/api/admin/events?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchEvents();
    } catch {
      alert("Failed to delete event");
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
              <small>Events & Holiday Calendar Manager</small>
            </div>
          </div>

          <div className="adminUserInfo">
            <Link href="/admin" className="text-xs uppercase tracking-wider font-semibold text-[var(--gold-400)] hover:underline">
              Dashboard
            </Link>
            <span className="text-gray-500">•</span>
            <button onClick={() => signOut({ callbackUrl: "/login" })} className="adminSignOutButton">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="adminMain">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
          {/* Add Event Form */}
          <div className="adminContentCard">
            <h2>Add Academic Event / Holiday</h2>
            <form onSubmit={handleCreateEvent} style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
              <div>
                <label className="adminLabel">Event Title *</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Annual Athletic Meet 2026" className="adminInput" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="adminLabel">Event Category *</label>
                  <select value={type} onChange={(e) => setType(e.target.value)} className="adminInput">
                    <option value="academic" style={{ background: "var(--navy-900)" }}>Academic</option>
                    <option value="holiday" style={{ background: "var(--navy-900)" }}>Holiday</option>
                    <option value="exam" style={{ background: "var(--navy-900)" }}>Exam Schedule</option>
                    <option value="sports" style={{ background: "var(--navy-900)" }}>Sports Event</option>
                    <option value="cultural" style={{ background: "var(--navy-900)" }}>Cultural Event</option>
                  </select>
                </div>
                <div>
                  <label className="adminLabel">Start Date *</label>
                  <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className="adminInput" />
                </div>
              </div>

              <div>
                <label className="adminLabel">End Date (Optional)</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="adminInput" />
              </div>

              <div>
                <label className="adminLabel">Description</label>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Event details..." className="adminInput" />
              </div>

              <button type="submit" disabled={submitting} className="adminSubmitButton" style={{ width: "100%" }}>
                {submitting ? "Adding..." : "Add Calendar Event"}
              </button>
            </form>
          </div>

          {/* Events List */}
          <div className="adminContentCard">
            <h2>Academic Calendar Events ({events.length})</h2>
            {loading ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.6)" }}>Loading calendar...</div>
            ) : (
              <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
                {events.map((ev) => (
                  <div key={ev._id} style={{ padding: "1rem", background: "var(--navy-900)", borderLeft: `3px solid ${ev.type === "holiday" ? "#ef4444" : "var(--gold-400)"}`, borderRadius: "var(--radius-sm)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "var(--gold-400)", fontWeight: 700 }}>
                        {ev.type} • {ev.startDate} {ev.endDate ? `to ${ev.endDate}` : ""}
                      </span>
                      <button onClick={() => handleDeleteEvent(ev._id)} style={{ background: "transparent", border: "none", color: "#fca5a5", fontSize: "0.8rem", cursor: "pointer" }}>
                        Delete
                      </button>
                    </div>
                    <h4 style={{ color: "#fff", fontSize: "0.95rem", margin: "0.25rem 0" }}>{ev.title}</h4>
                    <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>{ev.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
