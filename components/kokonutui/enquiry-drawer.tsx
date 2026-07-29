"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, CheckCircle, User, GraduationCap, Mail, Phone, Calendar, MessageSquare, ShieldCheck } from "lucide-react";

interface EnquiryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const inputClass = `
  w-full min-w-0 px-4 py-3 border border-[#D5C3A1]
  bg-white text-slate-800 text-sm placeholder:text-slate-400 placeholder:truncate truncate
  focus:outline-none focus:border-[#4B3425] focus:ring-2 focus:ring-[#4B3425]/10
  transition-all duration-200 text-ellipsis overflow-hidden box-border
`.trim();

const labelClass = "block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider";

const SESSIONS = ["2025–26", "2026–27", "2027–28"];

export default function EnquiryDrawer({ isOpen, onClose }: EnquiryDrawerProps) {
  // Parent & Student
  const [parentName, setParentName] = useState("");
  const [studentName, setStudentName] = useState("");

  // Contact
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Admission
  const [gradeApplyingFor, setGradeApplyingFor] = useState("Grade X");
  const [admissionSession, setAdmissionSession] = useState("2026–27");

  // Message
  const [message, setMessage] = useState("");

  // Honeypot
  const [website, setWebsite] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const resetForm = () => {
    setParentName(""); setStudentName(""); setEmail(""); setPhone("");
    setGradeApplyingFor("Grade X"); setAdmissionSession("2026–27");
    setMessage(""); setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentName, studentName, email, phone,
          gradeApplyingFor, admissionSession, message, website,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        resetForm();
      } else {
        setError(data.error || "Failed to submit enquiry. Please try again.");
      }
    } catch {
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, zIndex: 9998,
              background: "rgba(15,23,42,0.7)",
              backdropFilter: "blur(8px)",
            }}
          />

          {/* Modal */}
          <div style={{
            position: "fixed", inset: 0, zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "0.75rem",
            overflowY: "auto",
          }}>
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: "100%",
                maxWidth: "780px",
                background: "#fff",
                borderRadius: "1.5rem",
                boxShadow: "0 32px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(99,102,241,0.12)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                maxHeight: "88vh",
                margin: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Header ── */}
              <div style={{
                padding: "1.5rem 2rem",
                background: "#4B3425",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexShrink: 0,
              }}>
                <div>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: "0.35rem",
                    background: "rgba(255,255,255,0.15)", borderRadius: "9999px",
                    padding: "0.2rem 0.65rem", marginBottom: "0.5rem",
                  }}>
                    <ShieldCheck style={{ width: "0.7rem", height: "0.7rem", color: "rgba(255,255,255,0.9)" }} />
                    <span style={{ fontSize: "0.62rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.9)" }}>
                      SUNSHINE PUBLIC SCHOOL
                    </span>
                  </div>
                  <h2 style={{ color: "#fff", fontSize: "1.4rem", fontWeight: 900, margin: 0, lineHeight: 1.2 }}>
                    Admission Enquiry
                  </h2>
                  <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.82rem", margin: "0.3rem 0 0 0" }}>
                    Complete the form and our admissions team will contact you within 24 hours.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "none", cursor: "pointer",
                    borderRadius: "50%", width: "2.25rem", height: "2.25rem",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", flexShrink: 0, transition: "background 0.2s",
                  }}
                >
                  <X style={{ width: "1.1rem", height: "1.1rem" }} />
                </button>
              </div>

              {/* ── Body ── */}
              <div style={{ flex: 1, overflowY: "auto", padding: "2rem" }}>
                {success ? (
                  <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                    <div style={{
                      width: "5rem", height: "5rem",
                      background: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
                      borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 1.5rem",
                      boxShadow: "0 8px 24px rgba(16,185,129,0.2)",
                    }}>
                      <CheckCircle style={{ width: "2.5rem", height: "2.5rem", color: "#059669" }} />
                    </div>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0f172a", margin: "0 0 0.75rem 0" }}>
                      Enquiry Received!
                    </h3>
                    <p style={{ color: "#64748b", fontSize: "0.9rem", maxWidth: "360px", margin: "0 auto 2rem", lineHeight: 1.6 }}>
                      Thank you for reaching out to Sunshine Public School. Our admissions coordinator will contact you within 24 hours.
                    </p>
                    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={() => setSuccess(false)}
                        style={{
                          padding: "0.75rem 1.75rem",
                          background: "#4B3425",
                          color: "#F2E8D8", border: "none", borderRadius: "0",
                          fontWeight: 600, fontSize: "0.82rem", cursor: "pointer",
                          letterSpacing: "0.06em",
                        }}
                      >
                        Submit Another Enquiry
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        style={{
                          padding: "0.75rem 1.75rem",
                          background: "#f1f5f9", color: "#475569",
                          border: "none", borderRadius: "9999px",
                          fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {/* Honeypot */}
                    <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

                    {error && (
                      <div style={{
                        padding: "0.85rem 1rem", borderRadius: "0.75rem",
                        background: "#fff1f2", border: "1px solid #fecdd3",
                        color: "#e11d48", fontSize: "0.82rem", fontWeight: 600,
                        marginBottom: "1.5rem",
                      }}>
                        {error}
                      </div>
                    )}

                    {/* ── Two Column Grid ── */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                      gap: "2rem",
                    }}>
                      {/* ── Left Column ── */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        {/* Section: Parent Information */}
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "2px solid #eef2ff" }}>
                            <User style={{ width: "0.9rem", height: "0.9rem", color: "#6366f1" }} />
                            <span style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6366f1" }}>
                              Parent / Guardian
                            </span>
                          </div>
                          <div>
                            <label className={labelClass} htmlFor="eq-parent-name">Full Name *</label>
                            <input
                              id="eq-parent-name"
                              type="text"
                              required
                              value={parentName}
                              onChange={(e) => setParentName(e.target.value)}
                              placeholder="e.g. Rajesh Kumar"
                              className={inputClass}
                            />
                          </div>
                        </div>

                        {/* Section: Student Information */}
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "2px solid #eef2ff" }}>
                            <GraduationCap style={{ width: "0.9rem", height: "0.9rem", color: "#6366f1" }} />
                            <span style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6366f1" }}>
                              Student
                            </span>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div>
                              <label className={labelClass} htmlFor="eq-student-name">Student Name</label>
                              <input
                                id="eq-student-name"
                                type="text"
                                value={studentName}
                                onChange={(e) => setStudentName(e.target.value)}
                                placeholder="e.g. Arjun Kumar"
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <label className={labelClass} htmlFor="eq-grade">Grade Applying For *</label>
                              <select
                                id="eq-grade"
                                value={gradeApplyingFor}
                                onChange={(e) => setGradeApplyingFor(e.target.value)}
                                className={inputClass}
                                style={{ cursor: "pointer" }}
                              >
                                <option value="Nursery">Nursery / Kindergarten</option>
                                <option value="Grade I-V">Grade I – V (Primary)</option>
                                <option value="Grade VI-VIII">Grade VI – VIII (Middle)</option>
                                <option value="Grade IX">Grade IX</option>
                                <option value="Grade X">Grade X</option>
                                <option value="Grade XI">Grade XI (Science / Commerce / Arts)</option>
                                <option value="Grade XII">Grade XII</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ── Right Column ── */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        {/* Section: Contact Details */}
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "2px solid #eef2ff" }}>
                            <Mail style={{ width: "0.9rem", height: "0.9rem", color: "#6366f1" }} />
                            <span style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6366f1" }}>
                              Contact Details
                            </span>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div>
                              <label className={labelClass} htmlFor="eq-email">Email Address *</label>
                              <input
                                id="eq-email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="rajesh@example.com"
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <label className={labelClass} htmlFor="eq-phone">
                                <Phone style={{ display: "inline", width: "0.7rem", height: "0.7rem", marginRight: "0.25rem" }} />
                                Phone Number *
                              </label>
                              <input
                                id="eq-phone"
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+91 98765 43210"
                                className={inputClass}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Section: Admission Details */}
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "2px solid #eef2ff" }}>
                            <Calendar style={{ width: "0.9rem", height: "0.9rem", color: "#6366f1" }} />
                            <span style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6366f1" }}>
                              Admission Details
                            </span>
                          </div>
                          <div>
                            <label className={labelClass} htmlFor="eq-session">Academic Session</label>
                            <select
                              id="eq-session"
                              value={admissionSession}
                              onChange={(e) => setAdmissionSession(e.target.value)}
                              className={inputClass}
                              style={{ cursor: "pointer" }}
                            >
                              {SESSIONS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ── Message (full width) ── */}
                    <div style={{ marginTop: "1.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.75rem" }}>
                        <MessageSquare style={{ width: "0.9rem", height: "0.9rem", color: "#6366f1" }} />
                        <label className={labelClass} htmlFor="eq-message" style={{ marginBottom: 0 }}>
                          Message or Questions
                        </label>
                      </div>
                      <textarea
                        id="eq-message"
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Inquire about fees, transport, hostel, scholarships, or general queries..."
                        className={inputClass}
                        style={{ resize: "vertical", verticalAlign: "top", minHeight: "110px", lineHeight: "1.5" }}
                      />
                    </div>

                    {/* ── Submit ── */}
                    <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                      <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: 0 }}>
                        🔒 Your information is kept private and never shared with third parties.
                      </p>
                      <button
                        type="submit"
                        disabled={submitting}
                        style={{
                          display: "flex", alignItems: "center", gap: "0.5rem",
                          padding: "0.85rem 2rem",
                          background: submitting ? "#7A5C42" : "#4B3425",
                          color: "#F2E8D8", border: "none", borderRadius: "0",
                          fontWeight: 600, fontSize: "0.82rem", cursor: submitting ? "not-allowed" : "pointer",
                          letterSpacing: "0.07em", textTransform: "uppercase" as const,
                          transition: "background 0.18s",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Send style={{ width: "0.9rem", height: "0.9rem" }} />
                        {submitting ? "Submitting..." : "Submit Enquiry"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
