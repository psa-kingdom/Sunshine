"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function AdminEmailsPage() {
  const [targetGroup, setTargetGroup] = useState("class");
  const [grade, setGrade] = useState("Grade X");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetGroup, grade, subject, content }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubject("");
        setContent("");
        setMsg(`✓ ${data.message}`);
      } else {
        alert(data.error || "Failed to send email broadcast");
      }
    } catch {
      alert("Error sending email broadcast");
    } finally {
      setSending(false);
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
              <small>Email Broadcast Dispatcher</small>
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
        <div className="adminContentCard" style={{ maxWidth: "680px", margin: "0 auto" }}>
          <h2>Compose Email Broadcast</h2>
          <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", marginBottom: "1.5rem" }}>
            Dispatch official school email announcements to specific student classes or faculty members.
          </p>

          {msg && (
            <div style={{ background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.4)", color: "#86efac", padding: "0.75rem 1rem", borderRadius: "var(--radius-sm)", marginBottom: "1rem" }}>
              {msg}
            </div>
          )}

          <form onSubmit={handleSendBroadcast} style={{ display: "grid", gap: "1.25rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="adminLabel">Target Group *</label>
                <select value={targetGroup} onChange={(e) => setTargetGroup(e.target.value)} className="adminInput">
                  <option value="class" style={{ background: "var(--navy-900)" }}>Specific Student Class</option>
                  <option value="students" style={{ background: "var(--navy-900)" }}>All Students & Parents</option>
                  <option value="teachers" style={{ background: "var(--navy-900)" }}>All Teachers & Faculty</option>
                </select>
              </div>

              {targetGroup === "class" && (
                <div>
                  <label className="adminLabel">Class / Grade *</label>
                  <select value={grade} onChange={(e) => setGrade(e.target.value)} className="adminInput">
                    <option value="Grade IX" style={{ background: "var(--navy-900)" }}>Grade IX</option>
                    <option value="Grade X" style={{ background: "var(--navy-900)" }}>Grade X</option>
                    <option value="Grade XI" style={{ background: "var(--navy-900)" }}>Grade XI</option>
                    <option value="Grade XII" style={{ background: "var(--navy-900)" }}>Grade XII</option>
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="adminLabel">Email Subject *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Schedule Update for Term 1 Practical Exams"
                className="adminInput"
              />
            </div>

            <div>
              <label className="adminLabel">Email Content *</label>
              <textarea
                rows={6}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write message content..."
                className="adminInput"
              />
            </div>

            <button type="submit" disabled={sending} className="adminSubmitButton" style={{ width: "100%" }}>
              {sending ? "Sending Email Broadcast..." : "✉ Dispatch Email Broadcast"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
