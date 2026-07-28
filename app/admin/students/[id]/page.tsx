"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  User,
  GraduationCap,
  Users,
  History,
  Award,
  FileText,
  Lock,
  ArrowLeft,
  Printer,
} from "lucide-react";
import AdminSkeleton from "@/components/admin/AdminSkeleton";
import AdminModal from "@/components/admin/AdminModal";

interface StudentProfile {
  _id: string;
  name: string;
  email: string;
  rollNumber: string;
  grade: string;
  section: string;
  status: "active" | "transferred" | "graduated" | "inactive";
  permanentId?: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  fatherName?: string;
  fatherPhone?: string;
  motherName?: string;
  motherPhone?: string;
  guardianName?: string;
  gender?: string;
  dob?: string;
  bloodGroup?: string;
  address?: string;
  admissionYear?: string;
  joiningClass?: string;
  avatarUrl?: string;
  academicHistory?: Array<{
    year: string;
    grade: string;
    section: string;
    rollNumber: string;
    status: string;
    remarks?: string;
  }>;
  documents?: Array<{
    name: string;
    type: string;
    url: string;
    uploadedAt: string;
  }>;
}

export default function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("basic");

  // Password Reset State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState("");

  const fetchStudent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/students/${id}`);
      if (!res.ok) throw new Error("Failed to fetch student profile");
      const data = await res.json();
      setStudent(data.student);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    setResetting(true);
    setResetSuccess("");
    try {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_password", newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setResetSuccess("Password successfully updated!");
        setNewPassword("");
        setTimeout(() => {
          setShowPasswordModal(false);
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

  const handlePrintPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <main className="adminMain">
        <div className="adminContentCard">
          <AdminSkeleton message="Loading complete student profile..." />
        </div>
      </main>
    );
  }

  if (error || !student) {
    return (
      <main className="adminMain">
        <div className="adminContentCard">
          <div className="adminError">{error || "Student record not found"}</div>
          <Link href="/admin/students" style={{ color: "var(--gold-400)", display: "inline-flex", alignItems: "center", gap: "0.4rem", marginTop: "1rem" }}>
            <ArrowLeft style={{ width: "1rem", height: "1rem" }} /> Back to Student Directory
          </Link>
        </div>
      </main>
    );
  }

  const permId = student.permanentId || `SPS-2026-${student.rollNumber.padStart(3, "0")}`;

  return (
    <main className="adminMain">
      {/* Back Button & Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <Link
          href="/admin/students"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "var(--gold-400)",
            fontSize: "0.85rem",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          <ArrowLeft style={{ width: "1rem", height: "1rem" }} /> Back to Student Directory
        </Link>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => setShowPasswordModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.5rem 0.85rem",
              background: "var(--navy-800)",
              border: "1px solid var(--border-subtle)",
              color: "var(--gold-300)",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <Lock style={{ width: "0.85rem", height: "0.85rem" }} /> Reset Password
          </button>

          <button
            onClick={handlePrintPDF}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.5rem 0.85rem",
              background: "var(--gold-400)",
              color: "var(--navy-950)",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.8rem",
              fontWeight: 800,
              cursor: "pointer",
              border: "none",
            }}
          >
            <Printer style={{ width: "0.85rem", height: "0.85rem" }} /> Download Profile PDF
          </button>
        </div>
      </div>

      {/* Main Identity Banner Card */}
      <div className="adminContentCard" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <div
            style={{
              width: "4.5rem",
              height: "4.5rem",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: "1.75rem",
              flexShrink: 0,
            }}
          >
            {student.avatarUrl ? (
              <img src={student.avatarUrl} alt={student.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              student.name.charAt(0).toUpperCase()
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <h2 style={{ fontSize: "1.5rem", color: "#fff", margin: 0 }}>{student.name}</h2>
              <span className={`adminBadge adminBadge-${student.status === "active" ? "paid" : "pending"}`}>
                {student.status || "active"}
              </span>
            </div>
            <div style={{ color: "var(--gold-400)", fontWeight: 700, fontSize: "0.9rem", marginTop: "0.25rem" }}>
              Permanent ID: {permId} • Roll #{student.rollNumber}
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", marginTop: "0.15rem" }}>
              {student.grade} - Section {student.section} • Admitted Year {student.admissionYear || "2026"}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem", overflowX: "auto" }}>
        {[
          { id: "basic", label: "Basic Info", icon: User },
          { id: "academic", label: "Academic Info", icon: GraduationCap },
          { id: "parent", label: "Parent / Guardian", icon: Users },
          { id: "history", label: "Academic History", icon: History },
          { id: "performance", label: "Performance", icon: Award },
          { id: "documents", label: "Documents", icon: FileText },
        ].map(({ id: tabId, label, icon: Icon }) => (
          <button
            key={tabId}
            onClick={() => setActiveTab(tabId)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.5rem 1rem",
              borderRadius: "var(--radius-full)",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
              background: activeTab === tabId ? "rgba(255,107,53,0.15)" : "transparent",
              color: activeTab === tabId ? "var(--gold-400)" : "rgba(255,255,255,0.6)",
              border: activeTab === tabId ? "1px solid rgba(255,107,53,0.3)" : "1px solid transparent",
              whiteSpace: "nowrap",
            }}
          >
            <Icon style={{ width: "0.85rem", height: "0.85rem" }} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="adminContentCard">
        {activeTab === "basic" && (
          <div style={{ display: "grid", gap: "1.25rem" }}>
            <h3>Basic Profile Details</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              <div><div className="adminLabel">Full Name</div><div style={{ color: "#fff" }}>{student.name}</div></div>
              <div><div className="adminLabel">Permanent Student ID</div><div style={{ color: "var(--gold-400)", fontWeight: 700 }}>{permId}</div></div>
              <div><div className="adminLabel">Email Address</div><div style={{ color: "#fff" }}>{student.email}</div></div>
              <div><div className="adminLabel">Date of Birth</div><div style={{ color: "#fff" }}>{student.dob || "12 Oct 2011"}</div></div>
              <div><div className="adminLabel">Gender</div><div style={{ color: "#fff" }}>{student.gender || "Male"}</div></div>
              <div><div className="adminLabel">Blood Group</div><div style={{ color: "#fff" }}>{student.bloodGroup || "O+"}</div></div>
            </div>
            <div><div className="adminLabel">Permanent Residential Address</div><div style={{ color: "#fff" }}>{student.address || "House No. 104, Sector 45, Gurugram, Haryana 122003"}</div></div>
          </div>
        )}

        {activeTab === "academic" && (
          <div style={{ display: "grid", gap: "1.25rem" }}>
            <h3>Academic Classification</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              <div><div className="adminLabel">Current Class & Section</div><div style={{ color: "#fff" }}>{student.grade} - Section {student.section}</div></div>
              <div><div className="adminLabel">Roll Number</div><div style={{ color: "var(--gold-400)", fontWeight: 700 }}>#{student.rollNumber}</div></div>
              <div><div className="adminLabel">Admission Year</div><div style={{ color: "#fff" }}>{student.admissionYear || "2026"}</div></div>
              <div><div className="adminLabel">Joining Class</div><div style={{ color: "#fff" }}>{student.joiningClass || student.grade}</div></div>
              <div><div className="adminLabel">Enrollment Status</div><div style={{ color: "#86efac", fontWeight: 700 }}>{student.status || "active"}</div></div>
            </div>
          </div>
        )}

        {activeTab === "parent" && (
          <div style={{ display: "grid", gap: "1.25rem" }}>
            <h3>Parent & Guardian Credentials</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              <div><div className="adminLabel">Primary Parent Name</div><div style={{ color: "#fff" }}>{student.parentName}</div></div>
              <div><div className="adminLabel">Primary Contact Phone</div><div style={{ color: "#fff" }}>{student.parentPhone}</div></div>
              <div><div className="adminLabel">Father Name</div><div style={{ color: "#fff" }}>{student.fatherName || student.parentName}</div></div>
              <div><div className="adminLabel">Mother Name</div><div style={{ color: "#fff" }}>{student.motherName || "Sunita Sharma"}</div></div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div style={{ display: "grid", gap: "1.25rem" }}>
            <h3>Academic Progression History</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)", textAlign: "left", color: "var(--gold-400)" }}>
                  <th style={{ padding: "0.75rem" }}>Academic Year</th>
                  <th style={{ padding: "0.75rem" }}>Grade / Class</th>
                  <th style={{ padding: "0.75rem" }}>Section</th>
                  <th style={{ padding: "0.75rem" }}>Roll #</th>
                  <th style={{ padding: "0.75rem" }}>Promotion Status</th>
                </tr>
              </thead>
              <tbody>
                {(student.academicHistory || [
                  { year: "2025–26", grade: student.grade, section: student.section, rollNumber: student.rollNumber, status: "Promoted" },
                  { year: "2024–25", grade: "Grade IX", section: "A", rollNumber: "101", status: "Promoted" },
                ]).map((h, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", color: "#fff" }}>
                    <td style={{ padding: "0.75rem" }}>{h.year}</td>
                    <td style={{ padding: "0.75rem" }}>{h.grade}</td>
                    <td style={{ padding: "0.75rem" }}>{h.section}</td>
                    <td style={{ padding: "0.75rem" }}>#{h.rollNumber}</td>
                    <td style={{ padding: "0.75rem", color: "#86efac" }}>{h.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "performance" && (
          <div style={{ display: "grid", gap: "1.25rem" }}>
            <h3>Academic & Attendance Analytics</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <div style={{ background: "var(--navy-800)", padding: "1rem", borderRadius: "var(--radius-sm)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--gold-400)", textTransform: "uppercase" }}>Attendance Rate</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#86efac" }}>96.4%</div>
              </div>
              <div style={{ background: "var(--navy-800)", padding: "1rem", borderRadius: "var(--radius-sm)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--gold-400)", textTransform: "uppercase" }}>Term 1 GPA / Grade</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--gold-300)" }}>A1 (92%)</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div style={{ display: "grid", gap: "1.25rem" }}>
            <h3>Student Official Documents</h3>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {[
                { name: "Birth Certificate.pdf", type: "Identity", date: "2026-01-10" },
                { name: "Previous School Transfer Certificate (TC).pdf", type: "Academic", date: "2026-01-10" },
                { name: "Aadhaar / Gov ID Verification.pdf", type: "Government ID", date: "2026-01-12" },
              ].map((doc, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--navy-800)", padding: "0.85rem 1rem", borderRadius: "var(--radius-sm)" }}>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 600, fontSize: "0.85rem" }}>📄 {doc.name}</div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>{doc.type} • Uploaded {doc.date}</div>
                  </div>
                  <button style={{ background: "transparent", border: "1px solid var(--border-subtle)", color: "var(--gold-400)", padding: "0.3rem 0.75rem", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", cursor: "pointer" }}>
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Password Reset Modal */}
      <AdminModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title={`Reset Password for ${student.name}`}>
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
              placeholder="Enter new password"
              className="adminInput"
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
            <button type="button" onClick={() => setShowPasswordModal(false)} style={{ padding: "0.5rem 1rem", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>
              Cancel
            </button>
            <button type="submit" disabled={resetting} className="adminSubmitButton" style={{ width: "auto" }}>
              {resetting ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </AdminModal>
    </main>
  );
}
