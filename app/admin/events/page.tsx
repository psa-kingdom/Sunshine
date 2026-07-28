"use client";

import React, { useEffect, useState, useMemo } from "react";
import AdminSkeleton from "@/components/admin/AdminSkeleton";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import { ChevronLeft, ChevronRight, Plus, X, Trash2, CalendarDays, Tag } from "lucide-react";

interface EventItem {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  type: string;
  isPublic: boolean;
}

const TYPE_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  academic:  { color: "#fbbf24", bg: "rgba(251,191,36,0.15)",  label: "Academic"  },
  holiday:   { color: "#f87171", bg: "rgba(248,113,113,0.15)", label: "Holiday"   },
  exam:      { color: "#a78bfa", bg: "rgba(167,139,250,0.15)", label: "Exam"      },
  sports:    { color: "#34d399", bg: "rgba(52,211,153,0.15)",  label: "Sports"    },
  cultural:  { color: "#fb923c", bg: "rgba(251,146,60,0.15)",  label: "Cultural"  },
};

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function formatDate(d: string) {
  if (!d) return "";
  const parts = d.split("-");
  if (parts.length !== 3) return d;
  return `${parseInt(parts[2])} ${MONTH_NAMES[parseInt(parts[1]) - 1]} ${parts[0]}`;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // Calendar nav
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("academic");

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

  useEffect(() => { fetchEvents(); }, []);

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
        setTitle(""); setDescription(""); setStartDate(""); setEndDate(""); setType("academic");
        setShowForm(false);
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
      if (res.ok) {
        setSelectedEvent(null);
        fetchEvents();
      }
    } catch {
      alert("Failed to delete event");
    }
  };

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const days: Array<{ date: number | null; fullDate: string | null; events: EventItem[] }> = [];

    // Padding before
    for (let i = 0; i < firstDay; i++) {
      days.push({ date: null, fullDate: null, events: [] });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const fullDate = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dayEvents = events.filter((ev) => {
        const start = ev.startDate;
        const end = ev.endDate || ev.startDate;
        return fullDate >= start && fullDate <= end;
      });
      days.push({ date: d, fullDate, events: dayEvents });
    }
    return days;
  }, [viewYear, viewMonth, events]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else { setViewMonth((m) => m - 1); }
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else { setViewMonth((m) => m + 1); }
  };

  const isToday = (fullDate: string | null) => {
    if (!fullDate) return false;
    return fullDate === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  };

  const upcomingEvents = [...events]
    .filter((ev) => ev.startDate >= `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-01`)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, 8);

  return (
    <main className="adminMain">
      {/* ── Page Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 900, margin: 0 }}>Academic Calendar</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", margin: "0.25rem 0 0 0" }}>
            Manage school events, holidays, exams, and cultural activities.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="adminSubmitButton"
          style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1.2rem" }}
        >
          <Plus style={{ width: "0.9rem", height: "0.9rem" }} />
          Add Event
        </button>
      </div>

      {/* ── Add Event Form ── */}
      {showForm && (
        <div className="adminContentCard" style={{ marginBottom: "1.5rem", border: "1px solid rgba(255,215,0,0.2)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h2 style={{ margin: 0 }}>New Calendar Event</h2>
            <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)" }}>
              <X style={{ width: "1.1rem", height: "1.1rem" }} />
            </button>
          </div>
          <form onSubmit={handleCreateEvent} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="adminLabel">Event Title *</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Annual Athletic Meet 2026" className="adminInput" />
            </div>
            <div>
              <label className="adminLabel">Category *</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="adminInput">
                {Object.entries(TYPE_CONFIG).map(([k, v]) => (
                  <option key={k} value={k} style={{ background: "var(--navy-900)" }}>{v.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="adminLabel">Start Date *</label>
              <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className="adminInput" />
            </div>
            <div>
              <label className="adminLabel">End Date (Optional)</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="adminInput" />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="adminLabel">Description</label>
              <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief event details..." className="adminInput" />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <button type="submit" disabled={submitting} className="adminSubmitButton">
                {submitting ? "Adding..." : "Add to Calendar"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Main Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem", alignItems: "start" }}>

        {/* ── Calendar ── */}
        <div className="adminContentCard" style={{ padding: "1.25rem" }}>
          {/* Month Navigation */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <button onClick={prevMonth} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.4rem 0.6rem", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center" }}>
              <ChevronLeft style={{ width: "1rem", height: "1rem" }} />
            </button>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#fff", fontWeight: 900, fontSize: "1.1rem" }}>
                {MONTH_NAMES[viewMonth]} {viewYear}
              </div>
            </div>
            <button onClick={nextMonth} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.4rem 0.6rem", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center" }}>
              <ChevronRight style={{ width: "1rem", height: "1rem" }} />
            </button>
          </div>

          {/* Day Headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", marginBottom: "4px" }}>
            {DAY_NAMES.map((d) => (
              <div key={d} style={{ textAlign: "center", fontSize: "0.68rem", fontWeight: 800, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", padding: "0.3rem 0" }}>
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          {loading ? (
            <AdminSkeleton message="Loading calendar..." />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
              {calendarDays.map((day, idx) => (
                <div
                  key={idx}
                  onClick={() => day.date && day.events.length > 0 && setSelectedEvent(day.events[0])}
                  style={{
                    minHeight: "70px",
                    padding: "0.3rem",
                    borderRadius: "0.4rem",
                    background: day.date
                      ? isToday(day.fullDate)
                        ? "rgba(255,215,0,0.12)"
                        : day.events.length > 0
                        ? "rgba(255,255,255,0.04)"
                        : "transparent"
                      : "transparent",
                    border: isToday(day.fullDate) ? "1px solid rgba(255,215,0,0.4)" : "1px solid transparent",
                    cursor: day.events.length > 0 ? "pointer" : "default",
                    transition: "background 0.15s",
                  }}
                >
                  {day.date && (
                    <>
                      <div style={{
                        fontSize: "0.75rem",
                        fontWeight: isToday(day.fullDate) ? 900 : 600,
                        color: isToday(day.fullDate) ? "var(--gold-400)" : "rgba(255,255,255,0.65)",
                        marginBottom: "0.2rem",
                      }}>
                        {day.date}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        {day.events.slice(0, 2).map((ev) => {
                          const cfg = TYPE_CONFIG[ev.type] || TYPE_CONFIG.academic;
                          return (
                            <div
                              key={ev._id}
                              style={{
                                fontSize: "0.58rem",
                                fontWeight: 700,
                                color: cfg.color,
                                background: cfg.bg,
                                borderRadius: "3px",
                                padding: "1px 4px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {ev.title}
                            </div>
                          );
                        })}
                        {day.events.length > 2 && (
                          <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.4)", fontWeight: 700, paddingLeft: "2px" }}>
                            +{day.events.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Legend */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: cfg.color }} />
                <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Column: Selected Event + Upcoming ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Selected Event Detail */}
          {selectedEvent && (
            <div className="adminContentCard" style={{ border: `1px solid ${TYPE_CONFIG[selectedEvent.type]?.color || "rgba(255,255,255,0.1)"}40` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <span style={{
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: TYPE_CONFIG[selectedEvent.type]?.color || "var(--gold-400)",
                  background: TYPE_CONFIG[selectedEvent.type]?.bg || "rgba(255,215,0,0.1)",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "9999px",
                }}>
                  {TYPE_CONFIG[selectedEvent.type]?.label || selectedEvent.type}
                </span>
                <button onClick={() => setSelectedEvent(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)" }}>
                  <X style={{ width: "0.9rem", height: "0.9rem" }} />
                </button>
              </div>
              <h3 style={{ color: "#fff", fontSize: "1rem", fontWeight: 800, margin: "0 0 0.5rem 0" }}>{selectedEvent.title}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
                <CalendarDays style={{ width: "0.8rem", height: "0.8rem", color: "rgba(255,255,255,0.4)" }} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)" }}>
                  {formatDate(selectedEvent.startDate)}
                  {selectedEvent.endDate && selectedEvent.endDate !== selectedEvent.startDate && ` → ${formatDate(selectedEvent.endDate)}`}
                </span>
              </div>
              {selectedEvent.description && (
                <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.55)", margin: "0 0 1rem 0" }}>{selectedEvent.description}</p>
              )}
              <button
                onClick={() => handleDeleteEvent(selectedEvent._id)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.35rem",
                  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
                  color: "#fca5a5", borderRadius: "0.5rem", padding: "0.4rem 0.8rem",
                  fontSize: "0.75rem", fontWeight: 700, cursor: "pointer",
                }}
              >
                <Trash2 style={{ width: "0.75rem", height: "0.75rem" }} />
                Delete Event
              </button>
            </div>
          )}

          {/* Upcoming Events List */}
          <div className="adminContentCard">
            <h3 style={{ margin: "0 0 1rem 0", color: "#fff", fontSize: "0.95rem", fontWeight: 800 }}>
              Upcoming Events
            </h3>
            {loading ? (
              <AdminSkeleton message="Loading..." />
            ) : upcomingEvents.length === 0 ? (
              <AdminEmptyState message="No upcoming events this month." />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {upcomingEvents.map((ev) => {
                  const cfg = TYPE_CONFIG[ev.type] || TYPE_CONFIG.academic;
                  return (
                    <div
                      key={ev._id}
                      onClick={() => setSelectedEvent(ev)}
                      style={{
                        display: "flex", alignItems: "flex-start", gap: "0.6rem",
                        padding: "0.6rem 0.75rem",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderLeft: `3px solid ${cfg.color}`,
                        borderRadius: "0.5rem",
                        cursor: "pointer",
                        transition: "background 0.15s",
                      }}
                    >
                      <Tag style={{ width: "0.8rem", height: "0.8rem", color: cfg.color, flexShrink: 0, marginTop: "2px" }} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {ev.title}
                        </div>
                        <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", fontWeight: 600, marginTop: "2px" }}>
                          {formatDate(ev.startDate)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Total Count */}
          <div style={{
            padding: "0.75rem 1rem",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "0.75rem",
            display: "flex", alignItems: "center", gap: "0.5rem",
          }}>
            <CalendarDays style={{ width: "1rem", height: "1rem", color: "var(--gold-400)" }} />
            <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>
              <strong style={{ color: "#fff" }}>{events.length}</strong> total events in the calendar
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
