"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, ExternalLink, Copy, Check, Lock, Mail, User } from "lucide-react";
import AdminModal from "./AdminModal";

export interface StudentPreviewData {
  _id: string;
  name: string;
  email: string;
  rollNumber: string;
  grade: string;
  section: string;
  status?: "active" | "transferred" | "graduated" | "inactive";
  permanentId?: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  dob?: string;
  gender?: string;
  bloodGroup?: string;
  address?: string;
  admissionYear?: string;
  avatarUrl?: string;
}

interface StudentPreviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentPreviewData | null;
  onRefresh: () => void;
}

export default function StudentPreviewDrawer({
  isOpen,
  onClose,
  student,
  onRefresh,
}: StudentPreviewDrawerProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState("");

  if (!isOpen || !student) return null;

  const permId = student.permanentId || `SPS-2026-${student.rollNumber.padStart(3, "0")}`;
  const status = student.status || "active";

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    setResetting(true);
    setResetSuccess("");
    try {
      const res = await fetch(`/api/admin/students/${student._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_password", newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setResetSuccess("Password successfully updated!");
        setNewPassword("");
        setTimeout(() => {
          setShowPasswordResetModal(false);
          setResetSuccess("");
        }, 1500);
      } else {
        alert(data.error || "Failed to reset password");
      }
    } catch {
      alert("Error resetting password");
    } finally {
      setResetting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 90 }}
        onClick={onClose}
      />

      {/* Slide-over Drawer Container */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          maxWidth: "460px",
          background: "var(--navy-900)",
          borderLeft: "1px solid var(--border-subtle)",
          boxShadow: "-10px 0 30px rgba(0,0,0,0.5)",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            background: "var(--navy-800)",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--gold-400)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Student Quick Preview
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", padding: "0.25rem" }}
          >
            <X style={{ width: "1.25rem", height: "1.25rem" }} />
          </button>
        </div>

        {/* Drawer Body Scrollable */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Identity Header Card */}
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", background: "var(--navy-800)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
            <div
              style={{
                width: "3.5rem",
                height: "3.5rem",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 800,
                fontSize: "1.25rem",
                flexShrink: 0,
              }}
            >
              {student.avatarUrl ? (
                <img src={student.avatarUrl} alt={student.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                student.name.charAt(0).toUpperCase()
              )}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <h3 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>{student.name}</h3>
                <span className={`adminBadge adminBadge-${status === "active" ? "paid" : "pending"}`}>
                  {status}
                </span>
              </div>
              <div style={{ color: "var(--gold-400)", fontSize: "0.8rem", fontWeight: 700, marginTop: "0.2rem" }}>
                Perm ID: {permId} • Roll #{student.rollNumber}
              </div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.75rem", marginTop: "0.1rem" }}>
                {student.grade} - Section {student.section}
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div style={{ background: "rgba(0,0,0,0.2)", padding: "0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--gold-400)", fontWeight: 700 }}>Attendance</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#86efac", marginTop: "0.2rem" }}>96.4%</div>
            </div>

            <div style={{ background: "rgba(0,0,0,0.2)", padding: "0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--gold-400)", fontWeight: 700 }}>Fee Status</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#86efac", marginTop: "0.2rem" }}>Paid</div>
            </div>
          </div>

          {/* Contact Details & Copy Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--gold-400)", letterSpacing: "0.05em" }}>
              Contact Information
            </div>

            {/* Student Email */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--navy-800)", padding: "0.6rem 0.85rem", borderRadius: "var(--radius-sm)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Mail style={{ width: "0.85rem", height: "0.85rem", color: "var(--gold-400)" }} />
                <span style={{ color: "#fff", fontSize: "0.8rem" }}>{student.email}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(student.email, "studentEmail")}
                style={{ background: "transparent", border: "none", color: "var(--gold-300)", cursor: "pointer", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.2rem" }}
              >
                {copiedKey === "studentEmail" ? <Check style={{ width: "0.85rem", height: "0.85rem", color: "#86efac" }} /> : <Copy style={{ width: "0.85rem", height: "0.85rem" }} />}
                {copiedKey === "studentEmail" ? "Copied" : "Copy"}
              </button>
            </div>

            {/* Parent Contact */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--navy-800)", padding: "0.6rem 0.85rem", borderRadius: "var(--radius-sm)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <User style={{ width: "0.85rem", height: "0.85rem", color: "var(--gold-400)" }} />
                <div>
                  <div style={{ color: "#fff", fontSize: "0.8rem", fontWeight: 600 }}>{student.parentName}</div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem" }}>{student.parentPhone}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(student.parentPhone, "parentPhone")}
                style={{ background: "transparent", border: "none", color: "var(--gold-300)", cursor: "pointer", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.2rem" }}
              >
                {copiedKey === "parentPhone" ? <Check style={{ width: "0.85rem", height: "0.85rem", color: "#86efac" }} /> : <Copy style={{ width: "0.85rem", height: "0.85rem" }} />}
                {copiedKey === "parentPhone" ? "Copied" : "Copy Phone"}
              </button>
            </div>
          </div>

          {/* Academic Info & Demographics */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--gold-400)", letterSpacing: "0.05em" }}>
              Student Details
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.78rem", background: "var(--navy-800)", padding: "0.85rem", borderRadius: "var(--radius-sm)" }}>
              <div><span style={{ color: "rgba(255,255,255,0.5)" }}>Admission Year:</span> <strong style={{ color: "#fff" }}>{student.admissionYear || "2026"}</strong></div>
              <div><span style={{ color: "rgba(255,255,255,0.5)" }}>DOB:</span> <strong style={{ color: "#fff" }}>{student.dob || "12 Oct 2011"}</strong></div>
              <div><span style={{ color: "rgba(255,255,255,0.5)" }}>Gender:</span> <strong style={{ color: "#fff" }}>{student.gender || "Male"}</strong></div>
              <div><span style={{ color: "rgba(255,255,255,0.5)" }}>Blood Group:</span> <strong style={{ color: "#fff" }}>{student.bloodGroup || "O+"}</strong></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "auto" }}>
            <Link
              href={`/admin/students/${student._id}`}
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.65rem 1rem",
                background: "var(--gold-400)",
                color: "var(--navy-950)",
                fontWeight: 800,
                fontSize: "0.85rem",
                borderRadius: "var(--radius-sm)",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              <ExternalLink style={{ width: "0.9rem", height: "0.9rem" }} /> Open Full Profile
            </Link>

            <button
              type="button"
              onClick={() => setShowPasswordResetModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.6rem 1rem",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid var(--border-subtle)",
                color: "var(--gold-300)",
                fontWeight: 700,
                fontSize: "0.8rem",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
              }}
            >
              <Lock style={{ width: "0.85rem", height: "0.85rem" }} /> Reset Password
            </button>
          </div>
        </div>
      </div>

      {/* Password Reset Modal */}
      <AdminModal isOpen={showPasswordResetModal} onClose={() => setShowPasswordResetModal(false)} title={`Reset Password for ${student.name}`}>
        <form onSubmit={handleResetPassword} style={{ display: "grid", gap: "1rem" }}>
          {resetSuccess && (
            <div className="adminSuccess">{resetSuccess}</div>
          )}
          <div>
            <label className="adminLabel">New Password *</label>
            <input
              type="text"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 6 chars)"
              className="adminInput"
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
            <button type="button" onClick={() => setShowPasswordResetModal(false)} style={{ padding: "0.5rem 1rem", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>
              Cancel
            </button>
            <button type="submit" disabled={resetting} className="adminSubmitButton" style={{ width: "auto" }}>
              {resetting ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </AdminModal>
    </>
  );
}
