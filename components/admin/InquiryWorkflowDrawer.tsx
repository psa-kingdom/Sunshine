"use client";

import React, { useState } from "react";
import { X, Send, MessageSquare } from "lucide-react";

export interface InquiryWorkflowData {
  _id: string;
  parentName: string;
  email: string;
  phone: string;
  gradeApplyingFor: string;
  message?: string;
  status: "new" | "contacted" | "follow_up" | "admitted" | "closed";
  assignedStaff?: string;
  internalNotes?: Array<{
    note: string;
    author: string;
    createdAt: string;
  }>;
  createdAt: string;
}

interface InquiryWorkflowDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: InquiryWorkflowData | null;
  onRefresh: () => void;
}

export default function InquiryWorkflowDrawer({
  isOpen,
  onClose,
  inquiry,
  onRefresh,
}: InquiryWorkflowDrawerProps) {
  const [newNote, setNewNote] = useState("");
  const [assignedStaff, setAssignedStaff] = useState(inquiry?.assignedStaff || "Admissions Team");
  const [currentStatus, setCurrentStatus] = useState(inquiry?.status || "new");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !inquiry) return null;

  const handleUpdateStatus = async (statusVal: string) => {
    setCurrentStatus(statusVal as InquiryWorkflowData["status"]);
    try {
      await fetch(`/api/admin/inquiries/${inquiry._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusVal, assignedStaff }),
      });
      onRefresh();
    } catch {
      alert("Failed to update status");
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiry._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: newNote.trim(), author: "Admin", assignedStaff }),
      });
      if (res.ok) {
        setNewNote("");
        onRefresh();
      }
    } catch {
      alert("Failed to add internal note");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 90 }}
        onClick={onClose}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          maxWidth: "480px",
          background: "var(--navy-900)",
          borderLeft: "1px solid var(--border-subtle)",
          boxShadow: "-10px 0 30px rgba(0,0,0,0.5)",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "1.25rem 1.5rem", background: "var(--navy-800)", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--gold-400)", textTransform: "uppercase" }}>Admission Workflow</div>
            <h3 style={{ color: "#fff", fontSize: "1.1rem", margin: "0.2rem 0 0 0" }}>{inquiry.parentName}</h3>
          </div>
          <button type="button" onClick={onClose} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>
            <X style={{ width: "1.25rem", height: "1.25rem" }} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Status Pipeline Selection */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div className="adminLabel">Workflow Stage</div>
            <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
              {[
                { id: "new", label: "New", color: "var(--gold-400)" },
                { id: "contacted", label: "Contacted", color: "#60a5fa" },
                { id: "follow_up", label: "Follow Up", color: "#c084fc" },
                { id: "admitted", label: "Admitted", color: "#4ade80" },
                { id: "closed", label: "Closed", color: "#f87171" },
              ].map(({ id: stId, label, color }) => (
                <button
                  key={stId}
                  type="button"
                  onClick={() => handleUpdateStatus(stId)}
                  style={{
                    padding: "0.4rem 0.75rem",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    background: currentStatus === stId ? "rgba(255,255,255,0.15)" : "var(--navy-800)",
                    color: currentStatus === stId ? color : "rgba(255,255,255,0.6)",
                    border: `1px solid ${currentStatus === stId ? color : "var(--border-subtle)"}`,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Application Details */}
          <div style={{ background: "var(--navy-800)", padding: "1rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", display: "grid", gap: "0.5rem", fontSize: "0.8rem" }}>
            <div><span style={{ color: "rgba(255,255,255,0.5)" }}>Grade Applying For:</span> <strong style={{ color: "var(--gold-300)" }}>{inquiry.gradeApplyingFor}</strong></div>
            <div><span style={{ color: "rgba(255,255,255,0.5)" }}>Email:</span> <strong style={{ color: "#fff" }}>{inquiry.email}</strong></div>
            <div><span style={{ color: "rgba(255,255,255,0.5)" }}>Phone:</span> <strong style={{ color: "#fff" }}>{inquiry.phone}</strong></div>
            <div><span style={{ color: "rgba(255,255,255,0.5)" }}>Submitted Message:</span> <div style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.2rem", background: "rgba(0,0,0,0.2)", padding: "0.5rem", borderRadius: "4px" }}>{inquiry.message || "No message specified."}</div></div>
          </div>

          {/* Internal Staff Notes */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", fontWeight: 700, color: "var(--gold-400)", textTransform: "uppercase" }}>
              <MessageSquare style={{ width: "0.85rem", height: "0.85rem" }} /> Internal Staff Notes
            </div>

            <form onSubmit={handleAddNote} style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add internal note..."
                className="adminInput"
                style={{ fontSize: "0.8rem" }}
              />
              <button type="submit" disabled={submitting} className="adminSubmitButton" style={{ width: "auto", flexShrink: 0 }}>
                <Send style={{ width: "0.85rem", height: "0.85rem" }} />
              </button>
            </form>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
              {(inquiry.internalNotes || []).length === 0 ? (
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>No internal notes added yet.</div>
              ) : (
                (inquiry.internalNotes || []).map((n, idx) => (
                  <div key={idx} style={{ background: "rgba(0,0,0,0.2)", padding: "0.6rem 0.85rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                    <div style={{ color: "#fff", fontSize: "0.8rem" }}>{n.note}</div>
                    <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.5)", marginTop: "0.2rem" }}>
                      By {n.author} • {new Date(n.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
