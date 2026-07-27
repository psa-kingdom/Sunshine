"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface StudentItem {
  _id: string;
  name: string;
  email: string;
  rollNumber: string;
  grade: string;
  section: string;
  parentName: string;
  parentPhone: string;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("Student2026!");
  const [rollNumber, setRollNumber] = useState("");
  const [grade, setGrade] = useState("Grade X");
  const [section, setSection] = useState("A");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/students");
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(data.students || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          rollNumber,
          grade,
          section,
          parentName,
          parentPhone,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setName("");
        setEmail("");
        setRollNumber("");
        setParentName("");
        setParentPhone("");
        setShowModal(false);
        fetchStudents();
      } else {
        alert(data.error || "Failed to create student");
      }
    } catch {
      alert("Error creating student");
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
              <small>Student Management</small>
            </div>
          </div>

          <div className="adminUserInfo">
            <Link href="/admin" className="text-xs uppercase tracking-wider font-semibold text-[var(--gold-400)] hover:underline">
              Dashboard
            </Link>
            <span className="text-gray-500">•</span>
            <Link href="/admin/teachers" className="text-xs uppercase tracking-wider font-semibold text-[var(--gold-400)] hover:underline">
              Teachers
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
              <h2>Enrolled Students ({students.length})</h2>
              <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>
                Manage student records, class assignments, and portal access.
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="adminSubmitButton"
              style={{ width: "auto" }}
            >
              + Add New Student
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.6)" }}>
              Loading student directory...
            </div>
          ) : error ? (
            <div className="adminError">{error}</div>
          ) : students.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.5)", border: "1px dashed var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
              No student records found.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-subtle)", textAlign: "left", color: "var(--gold-400)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                    <th style={{ padding: "0.75rem 1rem" }}>Roll #</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Student Name</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Class / Section</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Email / Login</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Parent Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      <td style={{ padding: "0.875rem 1rem", color: "var(--gold-300)", fontWeight: 700 }}>#{s.rollNumber}</td>
                      <td style={{ padding: "0.875rem 1rem", fontWeight: 600, color: "#ffffff" }}>{s.name}</td>
                      <td style={{ padding: "0.875rem 1rem", color: "#ffffff" }}>{s.grade} - {s.section}</td>
                      <td style={{ padding: "0.875rem 1rem", color: "rgba(255,255,255,0.8)" }}>{s.email}</td>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <div style={{ color: "#ffffff" }}>{s.parentName}</div>
                        <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>{s.parentPhone}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add Student Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", zIndex: 100 }}>
          <div className="adminCard" style={{ width: "100%", maxWidth: "520px" }}>
            <h3 className="adminHeading">Register New Student</h3>
            <form onSubmit={handleCreateStudent} style={{ display: "grid", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="adminLabel">Full Name *</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Vikram Singh" className="adminInput" />
                </div>
                <div>
                  <label className="adminLabel">Roll Number *</label>
                  <input type="text" required value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} placeholder="105" className="adminInput" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="adminLabel">Grade / Class *</label>
                  <select value={grade} onChange={(e) => setGrade(e.target.value)} className="adminInput">
                    <option value="Grade IX" style={{ background: "var(--navy-900)" }}>Grade IX</option>
                    <option value="Grade X" style={{ background: "var(--navy-900)" }}>Grade X</option>
                    <option value="Grade XI" style={{ background: "var(--navy-900)" }}>Grade XI</option>
                    <option value="Grade XII" style={{ background: "var(--navy-900)" }}>Grade XII</option>
                  </select>
                </div>
                <div>
                  <label className="adminLabel">Section *</label>
                  <input type="text" required value={section} onChange={(e) => setSection(e.target.value)} className="adminInput" />
                </div>
              </div>

              <div>
                <label className="adminLabel">Student Email Address *</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vikram@sunshineps.edu.in" className="adminInput" />
              </div>

              <div>
                <label className="adminLabel">Initial Password *</label>
                <input type="text" required value={password} onChange={(e) => setPassword(e.target.value)} className="adminInput" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="adminLabel">Parent Name</label>
                  <input type="text" value={parentName} onChange={(e) => setParentName(e.target.value)} placeholder="Parent Name" className="adminInput" />
                </div>
                <div>
                  <label className="adminLabel">Parent Phone</label>
                  <input type="tel" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} placeholder="+91 98765 00000" className="adminInput" />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: "0.5rem 1rem", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="adminSubmitButton" style={{ width: "auto" }}>
                  {submitting ? "Saving..." : "Register Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
