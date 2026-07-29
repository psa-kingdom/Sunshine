"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import AdminSkeleton from "@/components/admin/AdminSkeleton";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import { ToastContainer, useToast } from "@/components/admin/Toast";
import {
  Megaphone,
  CalendarDays,
  Search,
  Plus,
  Pin,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

interface NoticeItem {
  _id: string;
  title: string;
  content: string;
  category: string;
  targetAudience: string;
  isPinned: boolean;
  createdAt: string;
}

interface EventItem {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  type: string;
  isPublic: boolean;
  createdAt?: string;
}

const TYPE_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  academic: { color: "#fbbf24", bg: "rgba(251,191,36,0.15)", label: "Academic" },
  holiday: { color: "#f87171", bg: "rgba(248,113,113,0.15)", label: "Holiday" },
  exam: { color: "#a78bfa", bg: "rgba(167,139,250,0.15)", label: "Exam" },
  sports: { color: "#34d399", bg: "rgba(52,211,153,0.15)", label: "Sports" },
  cultural: { color: "#fb923c", bg: "rgba(251,146,60,0.15)", label: "Cultural" },
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDate(d: string) {
  if (!d) return "";
  const parts = d.split("-");
  if (parts.length !== 3) return d;
  return `${parseInt(parts[2])} ${MONTH_NAMES[parseInt(parts[1]) - 1]} ${parts[0]}`;
}

export default function AdminAnnouncementsPage() {
  const [activeTab, setActiveTab] = useState<"notices" | "events">("notices");
  const { toasts, removeToast, toast } = useToast();

  // ── Search & Filters ──
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // ── Notices State ──
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [noticesLoading, setNoticesLoading] = useState(true);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  const [noticeCategory, setNoticeCategory] = useState("general");
  const [noticeAudience, setNoticeAudience] = useState("all");
  const [noticePinned, setNoticePinned] = useState(false);
  const [noticeSubmitting, setNoticeSubmitting] = useState(false);

  // ── Events State ──
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventType, setEventType] = useState("academic");
  const [eventSubmitting, setEventSubmitting] = useState(false);

  // Calendar Nav
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  // ── Fetchers ──
  const fetchNotices = useCallback(async () => {
    setNoticesLoading(true);
    try {
      const res = await fetch("/api/admin/notices");
      if (res.ok) {
        const data = await res.json();
        setNotices(data.notices || []);
      }
    } catch {
      toast.error("Failed to load notices");
    } finally {
      setNoticesLoading(false);
    }
  }, [toast]);

  const fetchEvents = useCallback(async () => {
    setEventsLoading(true);
    try {
      const res = await fetch("/api/admin/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch {
      toast.error("Failed to load events");
    } finally {
      setEventsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchNotices();
    fetchEvents();
  }, [fetchNotices, fetchEvents]);

  // ── Notice Handlers ──
  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) {
      toast.error("Please fill in required fields.");
      return;
    }
    setNoticeSubmitting(true);
    try {
      const res = await fetch("/api/admin/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: noticeTitle,
          content: noticeContent,
          category: noticeCategory,
          targetAudience: noticeAudience,
          isPinned: noticePinned,
        }),
      });
      if (res.ok) {
        setNoticeTitle("");
        setNoticeContent("");
        setNoticePinned(false);
        toast.success("Notice published successfully!");
        fetchNotices();
      } else {
        toast.error("Failed to publish notice.");
      }
    } catch {
      toast.error("Error connecting to server.");
    } finally {
      setNoticeSubmitting(false);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;
    try {
      const res = await fetch(`/api/admin/notices?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Notice deleted.");
        fetchNotices();
      } else {
        toast.error("Failed to delete notice.");
      }
    } catch {
      toast.error("Error deleting notice.");
    }
  };

  // ── Event Handlers ──
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventStartDate) {
      toast.error("Title and Start Date are required.");
      return;
    }
    setEventSubmitting(true);
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: eventTitle,
          description: eventDesc,
          startDate: eventStartDate,
          endDate: eventEndDate || undefined,
          type: eventType,
          isPublic: true,
        }),
      });
      if (res.ok) {
        setEventTitle("");
        setEventDesc("");
        setEventStartDate("");
        setEventEndDate("");
        setShowEventModal(false);
        toast.success("Event created successfully!");
        fetchEvents();
      } else {
        toast.error("Failed to create event.");
      }
    } catch {
      toast.error("Error connecting to server.");
    } finally {
      setEventSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Delete this event permanently?")) return;
    try {
      const res = await fetch(`/api/admin/events?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Event deleted.");
        fetchEvents();
      } else {
        toast.error("Failed to delete event.");
      }
    } catch {
      toast.error("Error deleting event.");
    }
  };

  // ── Filtering ──
  const filteredNotices = useMemo(() => {
    return notices.filter((n) => {
      const q = searchQuery.toLowerCase();
      const matchesQ = n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
      const matchesCat = categoryFilter === "all" || n.category === categoryFilter;
      return matchesQ && matchesCat;
    });
  }, [notices, searchQuery, categoryFilter]);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const q = searchQuery.toLowerCase();
      const matchesQ = e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q);
      const matchesType = categoryFilter === "all" || e.type === categoryFilter;
      return matchesQ && matchesType;
    });
  }, [events, searchQuery, categoryFilter]);

  // Calendar Grid Math
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [firstDayOfWeek, daysInMonth]);

  const eventsByDay = useMemo(() => {
    const map: Record<number, EventItem[]> = {};
    events.forEach((ev) => {
      if (!ev.startDate) return;
      const [y, m, d] = ev.startDate.split("-").map(Number);
      if (y === viewYear && m - 1 === viewMonth) {
        if (!map[d]) map[d] = [];
        map[d].push(ev);
      }
    });
    return map;
  }, [events, viewYear, viewMonth]);

  return (
    <main className="adminMain">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ color: "#fff", fontSize: "1.6rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Megaphone style={{ color: "var(--gold-400)", width: "1.75rem", height: "1.75rem" }} />
            School Announcements
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", marginTop: "0.2rem" }}>
            Unified hub for official notice boards and academic/activity calendar events.
          </p>
        </div>

        {/* Action Button */}
        {activeTab === "events" && (
          <button
            type="button"
            onClick={() => setShowEventModal(true)}
            className="adminSubmitButton"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.2rem" }}
          >
            <Plus style={{ width: "1rem", height: "1rem" }} /> Add Calendar Event
          </button>
        )}
      </div>

      {/* Tabs & Shared Search Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        {/* Module Tabs */}
        <div style={{ display: "inline-flex", background: "var(--navy-900)", padding: "0.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
          <button
            type="button"
            onClick={() => { setActiveTab("notices"); setCategoryFilter("all"); }}
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.5rem 1.25rem", borderRadius: "var(--radius-sm)",
              border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700,
              background: activeTab === "notices" ? "var(--gold-400)" : "transparent",
              color: activeTab === "notices" ? "var(--navy-950)" : "rgba(255,255,255,0.7)",
              transition: "all 0.15s",
            }}
          >
            <Pin style={{ width: "0.9rem", height: "0.9rem" }} /> Notice Board ({notices.length})
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab("events"); setCategoryFilter("all"); }}
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.5rem 1.25rem", borderRadius: "var(--radius-sm)",
              border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700,
              background: activeTab === "events" ? "var(--gold-400)" : "transparent",
              color: activeTab === "events" ? "var(--navy-950)" : "rgba(255,255,255,0.7)",
              transition: "all 0.15s",
            }}
          >
            <CalendarDays style={{ width: "0.9rem", height: "0.9rem" }} /> Academic Events ({events.length})
          </button>
        </div>

        {/* Filter Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          {/* Search Box */}
          <div style={{ position: "relative", minWidth: "220px" }}>
            <Search style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", width: "0.85rem", height: "0.85rem", color: "rgba(255,255,255,0.4)" }} />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="adminInput"
              style={{ paddingLeft: "2.1rem", paddingRight: "0.75rem", fontSize: "0.8rem", height: "38px" }}
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="adminInput"
            style={{ fontSize: "0.8rem", height: "38px", cursor: "pointer" }}
          >
            <option value="all" style={{ background: "var(--navy-900)" }}>All Categories</option>
            {activeTab === "notices" ? (
              <>
                <option value="general" style={{ background: "var(--navy-900)" }}>General</option>
                <option value="academic" style={{ background: "var(--navy-900)" }}>Academic</option>
                <option value="exam" style={{ background: "var(--navy-900)" }}>Examinations</option>
                <option value="events" style={{ background: "var(--navy-900)" }}>Sports & Events</option>
              </>
            ) : (
              <>
                <option value="academic" style={{ background: "var(--navy-900)" }}>Academic</option>
                <option value="holiday" style={{ background: "var(--navy-900)" }}>Holiday</option>
                <option value="exam" style={{ background: "var(--navy-900)" }}>Exam</option>
                <option value="sports" style={{ background: "var(--navy-900)" }}>Sports</option>
                <option value="cultural" style={{ background: "var(--navy-900)" }}>Cultural</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* ── TAB 1: NOTICES ── */}
      {activeTab === "notices" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
          {/* Publish Notice Form */}
          <div className="adminContentCard">
            <h2 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>
              Publish School Notice
            </h2>
            <form onSubmit={handleCreateNotice} style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label className="adminLabel">Notice Title *</label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. Parent Teacher Conference Announcement"
                  className="adminInput"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="adminLabel">Category</label>
                  <select value={noticeCategory} onChange={(e) => setNoticeCategory(e.target.value)} className="adminInput">
                    <option value="general" style={{ background: "var(--navy-900)" }}>General</option>
                    <option value="academic" style={{ background: "var(--navy-900)" }}>Academic</option>
                    <option value="exam" style={{ background: "var(--navy-900)" }}>Examinations</option>
                    <option value="events" style={{ background: "var(--navy-900)" }}>Sports & Events</option>
                  </select>
                </div>

                <div>
                  <label className="adminLabel">Target Audience</label>
                  <select value={noticeAudience} onChange={(e) => setNoticeAudience(e.target.value)} className="adminInput">
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
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  placeholder="Details of the announcement..."
                  className="adminInput"
                  style={{ resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={noticePinned}
                  onChange={(e) => setNoticePinned(e.target.checked)}
                />
                <label htmlFor="pinCheck" style={{ color: "#fff", fontSize: "0.85rem", cursor: "pointer" }}>
                  📌 Pin Notice to Homepage Header
                </label>
              </div>

              <button type="submit" disabled={noticeSubmitting} className="adminSubmitButton" style={{ width: "100%" }}>
                {noticeSubmitting ? "Publishing..." : "Publish Notice"}
              </button>
            </form>
          </div>

          {/* Published Notices Feed */}
          <div className="adminContentCard">
            <h2 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>
              Published Notices ({filteredNotices.length})
            </h2>
            {noticesLoading ? (
              <AdminSkeleton message="Loading notices..." />
            ) : filteredNotices.length === 0 ? (
              <AdminEmptyState message="No notices match your filter." />
            ) : (
              <div style={{ display: "grid", gap: "1rem" }}>
                {filteredNotices.map((n) => (
                  <div
                    key={n._id}
                    style={{
                      padding: "1rem",
                      background: "var(--navy-900)",
                      border: n.isPinned ? "1px solid var(--gold-400)" : "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-sm)",
                      position: "relative",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                      <span style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--gold-400)", fontWeight: 700 }}>
                        {n.category} • Target: {n.targetAudience} {n.isPinned && "📌 [Pinned]"}
                      </span>
                      <button
                        onClick={() => handleDeleteNotice(n._id)}
                        style={{ background: "transparent", border: "none", color: "#fca5a5", fontSize: "0.8rem", cursor: "pointer" }}
                      >
                        Delete
                      </button>
                    </div>
                    <h4 style={{ color: "#fff", fontSize: "0.95rem", margin: "0.25rem 0", fontWeight: 700 }}>{n.title}</h4>
                    <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{n.content}</p>
                    <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", display: "block", marginTop: "0.5rem" }}>
                      Published on {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: EVENTS (Calendar + List) ── */}
      {activeTab === "events" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
          {/* Calendar View */}
          <div className="adminContentCard" style={{ overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 700 }}>
                {MONTH_NAMES[viewMonth]} {viewYear}
              </h2>
              <div style={{ display: "flex", gap: "0.35rem" }}>
                <button
                  onClick={() => {
                    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
                    else setViewMonth(m => m - 1);
                  }}
                  style={{ padding: "0.3rem 0.6rem", background: "var(--navy-900)", border: "1px solid var(--border-subtle)", color: "#fff", borderRadius: "4px", cursor: "pointer" }}
                >
                  <ChevronLeft style={{ width: "0.9rem", height: "0.9rem" }} />
                </button>
                <button
                  onClick={() => {
                    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
                    else setViewMonth(m => m + 1);
                  }}
                  style={{ padding: "0.3rem 0.6rem", background: "var(--navy-900)", border: "1px solid var(--border-subtle)", color: "#fff", borderRadius: "4px", cursor: "pointer" }}
                >
                  <ChevronRight style={{ width: "0.9rem", height: "0.9rem" }} />
                </button>
              </div>
            </div>

            {/* Grid Days */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center", marginBottom: "0.5rem" }}>
              {DAY_NAMES.map(d => (
                <span key={d} style={{ fontSize: "0.7rem", color: "var(--gold-400)", fontWeight: 700, textTransform: "uppercase" }}>{d}</span>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
              {calendarDays.map((day, idx) => {
                if (day === null) return <div key={`empty-${idx}`} style={{ minHeight: "54px" }} />;
                const dayEvs = eventsByDay[day] || [];
                const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

                return (
                  <div
                    key={day}
                    style={{
                      minHeight: "54px",
                      padding: "0.25rem",
                      background: isToday ? "rgba(251,191,36,0.08)" : "var(--navy-900)",
                      border: isToday ? "1px solid var(--gold-400)" : "1px solid var(--border-subtle)",
                      borderRadius: "4px",
                      textAlign: "left",
                    }}
                  >
                    <span style={{ fontSize: "0.7rem", fontWeight: isToday ? 800 : 500, color: isToday ? "var(--gold-400)" : "#fff" }}>
                      {day}
                    </span>
                    <div style={{ display: "grid", gap: "2px", marginTop: "2px" }}>
                      {dayEvs.map(ev => {
                        const cfg = TYPE_CONFIG[ev.type] || TYPE_CONFIG.academic;
                        return (
                          <div
                            key={ev._id}
                            style={{
                              fontSize: "0.6rem",
                              padding: "1px 3px",
                              borderRadius: "2px",
                              background: cfg.bg,
                              color: cfg.color,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={ev.title}
                          >
                            {ev.title}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Events List View */}
          <div className="adminContentCard">
            <h2 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>
              All Events ({filteredEvents.length})
            </h2>
            {eventsLoading ? (
              <AdminSkeleton message="Loading calendar events..." />
            ) : filteredEvents.length === 0 ? (
              <AdminEmptyState message="No events found." />
            ) : (
              <div style={{ display: "grid", gap: "1rem" }}>
                {filteredEvents.map(ev => {
                  const cfg = TYPE_CONFIG[ev.type] || TYPE_CONFIG.academic;
                  return (
                    <div
                      key={ev._id}
                      style={{
                        padding: "1rem",
                        background: "var(--navy-900)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-sm)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                        <span style={{ fontSize: "0.68rem", textTransform: "uppercase", color: cfg.color, fontWeight: 700, padding: "0.15rem 0.5rem", background: cfg.bg, borderRadius: "4px" }}>
                          {cfg.label}
                        </span>
                        <button
                          onClick={() => handleDeleteEvent(ev._id)}
                          style={{ background: "transparent", border: "none", color: "#fca5a5", fontSize: "0.8rem", cursor: "pointer" }}
                        >
                          Delete
                        </button>
                      </div>
                      <h4 style={{ color: "#fff", fontSize: "0.95rem", margin: "0.25rem 0", fontWeight: 700 }}>{ev.title}</h4>
                      {ev.description && <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{ev.description}</p>}
                      <span style={{ fontSize: "0.72rem", color: "var(--gold-400)", display: "block", marginTop: "0.4rem", fontWeight: 600 }}>
                        📅 {formatDate(ev.startDate)} {ev.endDate && `– ${formatDate(ev.endDate)}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CREATE EVENT MODAL ── */}
      {showEventModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,23,42,0.8)", padding: "1rem" }}>
          <div className="adminContentCard" style={{ width: "100%", maxWidth: "500px", background: "var(--navy-950)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700 }}>Add Calendar Event</h3>
              <button onClick={() => setShowEventModal(false)} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer" }}>
                <X style={{ width: "1.2rem", height: "1.2rem" }} />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label className="adminLabel">Event Title *</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Annual Sports Meet 2026"
                  className="adminInput"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="adminLabel">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={eventStartDate}
                    onChange={(e) => setEventStartDate(e.target.value)}
                    className="adminInput"
                  />
                </div>
                <div>
                  <label className="adminLabel">End Date (Optional)</label>
                  <input
                    type="date"
                    value={eventEndDate}
                    onChange={(e) => setEventEndDate(e.target.value)}
                    className="adminInput"
                  />
                </div>
              </div>

              <div>
                <label className="adminLabel">Category Type</label>
                <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="adminInput">
                  <option value="academic" style={{ background: "var(--navy-900)" }}>Academic</option>
                  <option value="holiday" style={{ background: "var(--navy-900)" }}>Holiday</option>
                  <option value="exam" style={{ background: "var(--navy-900)" }}>Exam</option>
                  <option value="sports" style={{ background: "var(--navy-900)" }}>Sports</option>
                  <option value="cultural" style={{ background: "var(--navy-900)" }}>Cultural</option>
                </select>
              </div>

              <div>
                <label className="adminLabel">Description</label>
                <textarea
                  rows={3}
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="Event details or instructions..."
                  className="adminInput"
                />
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                <button type="submit" disabled={eventSubmitting} className="adminSubmitButton" style={{ flex: 1 }}>
                  {eventSubmitting ? "Saving..." : "Save Event"}
                </button>
                <button type="button" onClick={() => setShowEventModal(false)} style={{ padding: "0.6rem 1.2rem", background: "var(--navy-900)", border: "1px solid var(--border-subtle)", color: "#fff", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
