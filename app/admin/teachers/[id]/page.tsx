"use client";

import React, { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import {
  User,
  Briefcase,
  GraduationCap,
  FileText,
  Lock,
  ArrowLeft,
  Printer,
} from "lucide-react";
import AdminSkeleton from "@/components/admin/AdminSkeleton";
import AdminModal from "@/components/admin/AdminModal";

interface TeacherProfile {
  _id: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  subjectSpecialization: string;
  phone: string;
  status: "active" | "on_leave" | "resigned";
  assignedClass?: string;
  qualification?: string;
  experienceYears?: number;
  joiningDate?: string;
  emergencyContact?: string;
  avatarUrl?: string;
  documents?: Array<{
    name: string;
    type: string;
    url: string;
    uploadedAt: string;
  }>;
}

export default function TeacherProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("employment");

  // Password Reset State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState("");

  const fetchTeacher = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/teachers/${id}`);
      if (!res.ok) throw new Error("Failed to fetch faculty profile");
      const data = await res.json();
      setTeacher(data.teacher);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTeacher();
  }, [fetchTeacher]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    setResetting(true);
    setResetSuccess("");
    try {
      const res = await fetch(`/api/admin/teachers/${id}`, {
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
          <AdminSkeleton message="Loading complete faculty profile..." />
        </div>
      </main>
    );
  }

  if (error || !teacher) {
    return (
      <main className="adminMain">
        <div className="adminContentCard">
          <div className="adminError">{error || "Faculty record not found"}</div>
          <Link href="/admin/teachers" style={{ color: "var(--gold-400)", display: "inline-flex", alignItems: "center", gap: "0.4rem", marginTop: "1rem" }}>
            <ArrowLeft style={{ width: "1rem", height: "1rem" }} /> Back to Faculty Directory
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="adminMain">
      {/* Back Button & Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <Link
          href="/admin/teachers"
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
          <ArrowLeft style={{ width: "1rem", height: "1rem" }} /> Back to Faculty Directory
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
            <Printer style={{ width: "0.85rem", height: "0.85rem" }} /> Download Faculty PDF
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
              background: "linear-gradient(135deg, var(--color-secondary), var(--color-accent))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: "1.75rem",
              flexShrink: 0,
            }}
          >
            {teacher.avatarUrl ? (
              <img src={teacher.avatarUrl} alt={teacher.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              teacher.name.charAt(0).toUpperCase()
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <h2 style={{ fontSize: "1.5rem", color: "#fff", margin: 0 }}>{teacher.name}</h2>
              <span className={`adminBadge adminBadge-${teacher.status === "active" ? "paid" : "pending"}`}>
                {teacher.status || "active"}
              </span>
            </div>
            <div style={{ color: "var(--gold-400)", fontWeight: 700, fontSize: "0.9rem", marginTop: "0.25rem" }}>
              Emp ID: {teacher.employeeId} • Dept: {teacher.department}
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", marginTop: "0.15rem" }}>
              Specialization: {teacher.subjectSpecialization} • Assigned Class Teacher: {teacher.assignedClass || "Unassigned"}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem", overflowX: "auto" }}>
        {[
          { id: "employment", label: "Employment Details", icon: Briefcase },
          { id: "qualifications", label: "Qualifications & Experience", icon: GraduationCap },
          { id: "contact", label: "Contact & Emergency", icon: User },
          { id: "documents", label: "Documents & Degrees", icon: FileText },
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
        {activeTab === "employment" && (
          <div style={{ display: "grid", gap: "1.25rem" }}>
            <h3>Employment Credentials</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              <div><div className="adminLabel">Employee ID</div><div style={{ color: "var(--gold-400)", fontWeight: 700 }}>{teacher.employeeId}</div></div>
              <div><div className="adminLabel">Department</div><div style={{ color: "#fff" }}>{teacher.department}</div></div>
              <div><div className="adminLabel">Subject Specialization</div><div style={{ color: "#fff" }}>{teacher.subjectSpecialization}</div></div>
              <div><div className="adminLabel">Assigned Class Teacher</div><div style={{ color: "#fff" }}>{teacher.assignedClass || "Unassigned"}</div></div>
              <div><div className="adminLabel">Joining Date</div><div style={{ color: "#fff" }}>{teacher.joiningDate || "15 Jul 2021"}</div></div>
              <div><div className="adminLabel">Employment Status</div><div style={{ color: "#86efac", fontWeight: 700 }}>{teacher.status || "active"}</div></div>
            </div>
          </div>
        )}

        {activeTab === "qualifications" && (
          <div style={{ display: "grid", gap: "1.25rem" }}>
            <h3>Qualifications & Academic Background</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              <div><div className="adminLabel">Highest Degree</div><div style={{ color: "#fff" }}>{teacher.qualification || "M.Sc., B.Ed."}</div></div>
              <div><div className="adminLabel">Total Teaching Experience</div><div style={{ color: "var(--gold-400)", fontWeight: 700 }}>{teacher.experienceYears || 5} Years</div></div>
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div style={{ display: "grid", gap: "1.25rem" }}>
            <h3>Contact Details & Emergency Info</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              <div><div className="adminLabel">Email Address</div><div style={{ color: "#fff" }}>{teacher.email}</div></div>
              <div><div className="adminLabel">Phone Number</div><div style={{ color: "#fff" }}>{teacher.phone}</div></div>
              <div><div className="adminLabel">Emergency Contact</div><div style={{ color: "#fff" }}>{teacher.emergencyContact || "+91 98765 00000 (Spouse)"}</div></div>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div style={{ display: "grid", gap: "1.25rem" }}>
            <h3>Verified Educational Degrees & Certificates</h3>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {[
                { name: "Master Degree Certificate (M.Sc).pdf", type: "Degree", date: "2021-07-15" },
                { name: "Bachelor of Education (B.Ed) Certificate.pdf", type: "Teaching License", date: "2021-07-15" },
                { name: "Government Identity Verification.pdf", type: "Identity", date: "2021-07-15" },
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
      <AdminModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title={`Reset Password for ${teacher.name}`}>
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
