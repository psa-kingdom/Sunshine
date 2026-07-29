"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Search, UserPlus, Upload, Download, Eye, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import AdminModal from "@/components/admin/AdminModal";
import AdminTable, { Column } from "@/components/admin/AdminTable";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminSkeleton from "@/components/admin/AdminSkeleton";
import BulkImportDrawer from "@/components/admin/BulkImportDrawer";
import StudentPreviewDrawer, { StudentPreviewData } from "@/components/admin/StudentPreviewDrawer";

interface StudentItem {
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

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showImportDrawer, setShowImportDrawer] = useState(false);
  const [previewStudent, setPreviewStudent] = useState<StudentPreviewData | null>(null);

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "roll" | "grade">("roll");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Form states for new student
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        setPassword("");
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

  // Bulk import handler
  const handleBulkImport = async (rows: Record<string, string>[]) => {
    const res = await fetch("/api/admin/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bulk: true, records: rows }),
    });
    const data = await res.json();
    if (res.ok) {
      return { success: true, count: data.count };
    }
    return { success: false, error: data.error };
  };

  // Filtered & Sorted Students
  const filteredStudents = useMemo(() => {
    const list = students.filter((s) => {
      const matchesQuery =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNumber.includes(searchQuery);
      const matchesGrade = selectedGrade === "all" || s.grade === selectedGrade;
      const matchesStatus = selectedStatus === "all" || (s.status || "active") === selectedStatus;
      return matchesQuery && matchesGrade && matchesStatus;
    });

    return list.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "grade") return a.grade.localeCompare(b.grade);
      return parseInt(a.rollNumber || "0") - parseInt(b.rollNumber || "0");
    });
  }, [students, searchQuery, selectedGrade, selectedStatus, sortBy]);

  // Paginated Slice
  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage]);

  // Bulk Select Toggle
  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedStudents.map((s) => s._id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected student record(s)?`)) return;

    for (const id of selectedIds) {
      try {
        await fetch(`/api/admin/students/${id}`, { method: "DELETE" });
      } catch (err) {
        console.error("Failed to delete student:", id, err);
      }
    }
    setSelectedIds([]);
    fetchStudents();
  };

  // Export CSV
  const handleExportCSV = () => {
    if (students.length === 0) return;
    const headers = ["RollNumber", "PermanentID", "Name", "Grade", "Section", "Status", "Email", "ParentName", "ParentPhone"];
    const rows = students.map(s => [
      s.rollNumber,
      s.permanentId || `SPS-2026-${s.rollNumber.padStart(3, "0")}`,
      s.name,
      s.grade,
      s.section,
      s.status || "active",
      s.email,
      s.parentName,
      s.parentPhone
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sunshine_students_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Table columns definition
  const columns: Column<StudentItem>[] = [
    {
      header: (
        <input
          type="checkbox"
          checked={paginatedStudents.length > 0 && selectedIds.length === paginatedStudents.length}
          onChange={toggleSelectAll}
          className="cursor-pointer"
          title="Select all page rows"
        />
      ),
      width: "40px",
      cell: (s) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(s._id)}
          onChange={() => toggleSelectRow(s._id)}
          className="cursor-pointer"
        />
      ),
    },
    {
      header: "Roll #",
      cell: (s) => (
        <div>
          <span style={{ color: "var(--gold-300)", fontWeight: 700 }}>#{s.rollNumber}</span>
          <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.5)" }}>{s.permanentId || `SPS-2026-${s.rollNumber.padStart(3, "0")}`}</div>
        </div>
      ),
    },
    {
      header: "Student Name",
      cell: (s) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontWeight: 600, color: "#ffffff" }}>{s.name}</span>
          <span className={`adminBadge adminBadge-${s.status === "active" || !s.status ? "paid" : "pending"}`}>
            {s.status || "active"}
          </span>
        </div>
      ),
    },
    {
      header: "Class / Section",
      cell: (s) => <span style={{ color: "#ffffff" }}>{s.grade} - {s.section}</span>,
    },
    {
      header: "Email / Login",
      cell: (s) => <span style={{ color: "rgba(255,255,255,0.8)" }}>{s.email}</span>,
    },
    {
      header: "Parent Contact",
      cell: (s) => (
        <div>
          <div style={{ color: "#ffffff" }}>{s.parentName}</div>
          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>{s.parentPhone}</div>
        </div>
      ),
    },
    {
      header: "Quick Action",
      align: "right",
      cell: (s) => (
        <button
          onClick={() => setPreviewStudent(s)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
            padding: "0.3rem 0.65rem",
            background: "rgba(255,107,53,0.15)",
            border: "1px solid rgba(255,107,53,0.3)",
            color: "var(--gold-400)",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.75rem",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <Eye style={{ width: "0.8rem", height: "0.8rem" }} /> Quick View
        </button>
      ),
    },
  ];

  return (
    <main className="adminMain">
      <div className="adminContentCard">
        {/* Header & Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2>Enrolled Students Directory ({filteredStudents.length})</h2>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>
              Manage student records, class assignments, Quick Previews, and profile data.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              onClick={handleExportCSV}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.5rem 0.85rem",
                background: "var(--navy-800)",
                border: "1px solid var(--border-subtle)",
                color: "var(--gold-400)",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <Download style={{ width: "0.9rem", height: "0.9rem" }} /> Export CSV
            </button>

            <button
              onClick={() => setShowImportDrawer(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.5rem 0.85rem",
                background: "var(--navy-800)",
                border: "1px solid var(--border-subtle)",
                color: "var(--gold-400)",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <Upload style={{ width: "0.9rem", height: "0.9rem" }} /> Bulk Import
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="adminSubmitButton"
              style={{ width: "auto", display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              <UserPlus style={{ width: "0.9rem", height: "0.9rem" }} /> Add Student
            </button>
          </div>
        </div>

        {/* Toolbar Filter, Search & Sort */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
            <Search style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", width: "1rem", height: "1rem", color: "rgba(255,255,255,0.4)" }} />
            <input
              type="text"
              placeholder="Search by name, roll # or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="adminInput"
              style={{ paddingLeft: "2.5rem" }}
            />
          </div>

          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="adminInput"
            style={{ width: "auto", minWidth: "140px" }}
          >
            <option value="all" style={{ background: "var(--navy-900)" }}>All Classes</option>
            <option value="Grade IX" style={{ background: "var(--navy-900)" }}>Grade IX</option>
            <option value="Grade X" style={{ background: "var(--navy-900)" }}>Grade X</option>
            <option value="Grade XI" style={{ background: "var(--navy-900)" }}>Grade XI</option>
            <option value="Grade XII" style={{ background: "var(--navy-900)" }}>Grade XII</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="adminInput"
            style={{ width: "auto", minWidth: "130px" }}
          >
            <option value="all" style={{ background: "var(--navy-900)" }}>All Statuses</option>
            <option value="active" style={{ background: "var(--navy-900)" }}>Active</option>
            <option value="transferred" style={{ background: "var(--navy-900)" }}>Transferred</option>
            <option value="graduated" style={{ background: "var(--navy-900)" }}>Graduated</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "name" | "roll" | "grade")}
            className="adminInput"
            style={{ width: "auto", minWidth: "130px" }}
          >
            <option value="roll" style={{ background: "var(--navy-900)" }}>Sort: Roll #</option>
            <option value="name" style={{ background: "var(--navy-900)" }}>Sort: Name</option>
            <option value="grade" style={{ background: "var(--navy-900)" }}>Sort: Grade</option>
          </select>
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", padding: "0.6rem 1rem", borderRadius: "var(--radius-sm)", marginBottom: "1rem", color: "#fca5a5" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>
              {selectedIds.length} student record(s) selected
            </span>
            <button
              onClick={handleBulkDelete}
              style={{ background: "#ef4444", border: "none", color: "#fff", padding: "0.35rem 0.8rem", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}
            >
              <Trash2 style={{ width: "0.85rem", height: "0.85rem" }} /> Delete Selected
            </button>
          </div>
        )}

        {/* Table Content */}
        {loading ? (
          <AdminSkeleton message="Loading student directory..." />
        ) : error ? (
          <div className="adminError">{error}</div>
        ) : filteredStudents.length === 0 ? (
          <AdminEmptyState message="No student records match your query." />
        ) : (
          <>
            <AdminTable columns={columns} data={paginatedStudents} keyExtractor={(s) => s._id} />

            {/* Pagination Controls */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.25rem", color: "rgba(255,255,255,0.6)", fontSize: "0.8rem" }}>
              <div>
                Showing Page {currentPage} of {totalPages} ({filteredStudents.length} Total Records)
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  style={{
                    padding: "0.35rem 0.75rem",
                    background: "var(--navy-800)",
                    border: "1px solid var(--border-subtle)",
                    color: currentPage === 1 ? "rgba(255,255,255,0.3)" : "var(--gold-400)",
                    borderRadius: "var(--radius-sm)",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.2rem",
                  }}
                >
                  <ChevronLeft style={{ width: "0.85rem", height: "0.85rem" }} /> Prev
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  style={{
                    padding: "0.35rem 0.75rem",
                    background: "var(--navy-800)",
                    border: "1px solid var(--border-subtle)",
                    color: currentPage === totalPages ? "rgba(255,255,255,0.3)" : "var(--gold-400)",
                    borderRadius: "var(--radius-sm)",
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.2rem",
                  }}
                >
                  Next <ChevronRight style={{ width: "0.85rem", height: "0.85rem" }} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick Preview Slide-over Drawer */}
      <StudentPreviewDrawer
        isOpen={!!previewStudent}
        onClose={() => setPreviewStudent(null)}
        student={previewStudent}
        onRefresh={fetchStudents}
      />

      {/* Add Student Modal */}
      <AdminModal isOpen={showModal} onClose={() => setShowModal(false)} title="Register New Student">
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
      </AdminModal>

      {/* Bulk Import Drawer */}
      <BulkImportDrawer
        isOpen={showImportDrawer}
        onClose={() => setShowImportDrawer(false)}
        title="Bulk Import Student Records"
        fields={[
          { key: "name", label: "Name", required: true },
          { key: "email", label: "Email", required: true },
          { key: "rollNumber", label: "RollNumber", required: true },
          { key: "grade", label: "Grade" },
          { key: "section", label: "Section" },
          { key: "parentName", label: "ParentName" },
          { key: "parentPhone", label: "ParentPhone" },
        ]}
        templateHeaders={["RollNumber", "Name", "Grade", "Section", "Email", "ParentName", "ParentPhone"]}
        templateSampleRow={["101", "Aarav Sharma", "Grade X", "A", "aarav.sharma@sunshineps.edu.in", "Rajesh Sharma", "+91 98111 22233"]}
        templateFilename="sunshine_students_template.csv"
        onImport={handleBulkImport}
        onSuccess={fetchStudents}
      />
    </main>
  );
}
