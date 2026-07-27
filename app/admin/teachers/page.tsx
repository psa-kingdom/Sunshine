"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface TeacherItem {
  _id: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  subjectSpecialization: string;
  phone: string;
  assignedClass?: string;
}

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("Teacher2026!");
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("Science");
  const [specialization, setSpecialization] = useState("");
  const [assignedClass, setAssignedClass] = useState("Grade X-A");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/teachers");
      if (!res.ok) throw new Error("Failed to fetch teachers");
      const data = await res.json();
      setTeachers(data.teachers || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          employeeId,
          department,
          subjectSpecialization: specialization,
          assignedClass,
          phone,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setName("");
        setEmail("");
        setEmployeeId("");
        setSpecialization("");
        setPhone("");
        setShowModal(false);
        fetchTeachers();
      } else {
        alert(data.error || "Failed to create teacher");
      }
    } catch {
      alert("Error creating teacher");
    } finally {
      setSubmitting(false);
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
              <small>Faculty Management</small>
            </div>
          </div>

          <div className="adminUserInfo">
            <Link href="/admin" className="text-xs uppercase tracking-wider font-semibold text-[var(--gold-400)] hover:underline">
              Dashboard
            </Link>
            <span className="text-gray-500">•</span>
            <Link href="/admin/students" className="text-xs uppercase tracking-wider font-semibold text-[var(--gold-400)] hover:underline">
              Students
            </Link>
            <span className="text-gray-500">•</span>
            <button onClick={() => signOut({ callbackUrl: "/login" })} className="adminSignOutButton">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="adminMain">
        <div className="adminContentCard">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h2>Faculty & Teaching Staff ({teachers.length})</h2>
              <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>
                Manage faculty directory, departments, and class teacher assignments.
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="adminSubmitButton"
              style={{ width: "auto" }}
            >
              + Add Faculty Member
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.6)" }}>
              Loading faculty directory...
            </div>
          ) : error ? (
            <div className="adminError">{error}</div>
          ) : teachers.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.5)", border: "1px dashed var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
              No faculty records found.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-subtle)", textAlign: "left", color: "var(--gold-400)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                    <th style={{ padding: "0.75rem 1rem" }}>Emp ID</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Faculty Name</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Department / Subject</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Assigned Class</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Email / Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((t) => (
                    <tr key={t._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      <td style={{ padding: "0.875rem 1rem", color: "var(--gold-300)", fontWeight: 700 }}>{t.employeeId}</td>
                      <td style={{ padding: "0.875rem 1rem", fontWeight: 600, color: "#ffffff" }}>{t.name}</td>
                      <td style={{ padding: "0.875rem 1rem", color: "#ffffff" }}>
                        <div>{t.department}</div>
                        <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>{t.subjectSpecialization}</div>
                      </td>
                      <td style={{ padding: "0.875rem 1rem", color: "var(--gold-400)", fontWeight: 600 }}>{t.assignedClass || "—"}</td>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <div style={{ color: "#ffffff" }}>{t.email}</div>
                        <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>{t.phone}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add Teacher Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", zIndex: 100 }}>
          <div className="adminCard" style={{ width: "100%", maxWidth: "520px" }}>
            <h3 className="adminHeading">Add Faculty Member</h3>
            <form onSubmit={handleCreateTeacher} style={{ display: "grid", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="adminLabel">Faculty Name *</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Vikram Roy" className="adminInput" />
                </div>
                <div>
                  <label className="adminLabel">Employee ID *</label>
                  <input type="text" required value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} placeholder="EMP-2026-099" className="adminInput" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="adminLabel">Department *</label>
                  <input type="text" required value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Science" className="adminInput" />
                </div>
                <div>
                  <label className="adminLabel">Specialization</label>
                  <input type="text" value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="Biology & Botany" className="adminInput" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="adminLabel">Email Address *</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teacher@sunshineps.edu.in" className="adminInput" />
                </div>
                <div>
                  <label className="adminLabel">Assigned Class</label>
                  <input type="text" value={assignedClass} onChange={(e) => setAssignedClass(e.target.value)} placeholder="Grade X-A" className="adminInput" />
                </div>
              </div>

              <div>
                <label className="adminLabel">Initial Password *</label>
                <input type="text" required value={password} onChange={(e) => setPassword(e.target.value)} className="adminInput" />
              </div>

              <div>
                <label className="adminLabel">Phone Number</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98112 00000" className="adminInput" />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: "0.5rem 1rem", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="adminSubmitButton" style={{ width: "auto" }}>
                  {submitting ? "Saving..." : "Add Faculty Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
