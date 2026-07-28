"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Search, UserPlus, Upload, Download, Eye, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import AdminModal from "@/components/admin/AdminModal";
import AdminTable, { Column } from "@/components/admin/AdminTable";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminSkeleton from "@/components/admin/AdminSkeleton";
import BulkImportDrawer from "@/components/admin/BulkImportDrawer";
import TeacherPreviewDrawer, { TeacherPreviewData } from "@/components/admin/TeacherPreviewDrawer";

interface TeacherItem {
  _id: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  subjectSpecialization: string;
  phone: string;
  status?: "active" | "on_leave" | "resigned";
  assignedClass?: string;
  qualification?: string;
  experienceYears?: number;
  joiningDate?: string;
  avatarUrl?: string;
}

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showImportDrawer, setShowImportDrawer] = useState(false);
  const [previewTeacher, setPreviewTeacher] = useState<TeacherPreviewData | null>(null);

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "empId" | "dept">("empId");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        setPassword("");
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

  // Bulk import handler
  const handleBulkImport = async (rows: Record<string, string>[]) => {
    const res = await fetch("/api/admin/teachers", {
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

  // Filtered & Sorted teachers
  const filteredTeachers = useMemo(() => {
    const list = teachers.filter((t) => {
      const matchesQuery =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = selectedDept === "all" || t.department.toLowerCase() === selectedDept.toLowerCase();
      const matchesStatus = selectedStatus === "all" || (t.status || "active") === selectedStatus;
      return matchesQuery && matchesDept && matchesStatus;
    });

    return list.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "dept") return a.department.localeCompare(b.department);
      return a.employeeId.localeCompare(b.employeeId);
    });
  }, [teachers, searchQuery, selectedDept, selectedStatus, sortBy]);

  // Paginated Slice
  const totalPages = Math.ceil(filteredTeachers.length / pageSize) || 1;
  const paginatedTeachers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTeachers.slice(start, start + pageSize);
  }, [filteredTeachers, currentPage]);

  // Bulk selection
  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected faculty record(s)?`)) return;

    for (const id of selectedIds) {
      try {
        await fetch(`/api/admin/teachers/${id}`, { method: "DELETE" });
      } catch (err) {
        console.error("Failed to delete faculty member:", id, err);
      }
    }
    setSelectedIds([]);
    fetchTeachers();
  };

  // Export CSV
  const handleExportCSV = () => {
    if (teachers.length === 0) return;
    const headers = ["EmployeeID", "Name", "Department", "Specialization", "AssignedClass", "Status", "Email", "Phone"];
    const rows = teachers.map(t => [t.employeeId, t.name, t.department, t.subjectSpecialization, t.assignedClass || "—", t.status || "active", t.email, t.phone]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sunshine_faculty_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: Column<TeacherItem>[] = [
    {
      header: "",
      width: "40px",
      cell: (t) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(t._id)}
          onChange={() => toggleSelectRow(t._id)}
          className="cursor-pointer"
        />
      ),
    },
    {
      header: "Emp ID",
      cell: (t) => <span style={{ color: "var(--gold-300)", fontWeight: 700 }}>{t.employeeId}</span>,
    },
    {
      header: "Faculty Name",
      cell: (t) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontWeight: 600, color: "#ffffff" }}>{t.name}</span>
          <span className={`adminBadge adminBadge-${t.status === "active" || !t.status ? "paid" : "pending"}`}>
            {t.status || "active"}
          </span>
        </div>
      ),
    },
    {
      header: "Department / Subject",
      cell: (t) => (
        <div>
          <div style={{ color: "#ffffff" }}>{t.department}</div>
          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>{t.subjectSpecialization}</div>
        </div>
      ),
    },
    {
      header: "Assigned Class",
      cell: (t) => <span style={{ color: "var(--gold-400)", fontWeight: 600 }}>{t.assignedClass || "—"}</span>,
    },
    {
      header: "Email / Phone",
      cell: (t) => (
        <div>
          <div style={{ color: "#ffffff" }}>{t.email}</div>
          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>{t.phone}</div>
        </div>
      ),
    },
    {
      header: "Quick Action",
      align: "right",
      cell: (t) => (
        <button
          onClick={() => setPreviewTeacher(t)}
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
            <h2>Faculty & Teaching Staff Directory ({filteredTeachers.length})</h2>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>
              Manage teaching staff, Quick Previews, department assignments, and class responsibilities.
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
              <UserPlus style={{ width: "0.9rem", height: "0.9rem" }} /> Add Faculty
            </button>
          </div>
        </div>

        {/* Toolbar Filter, Search & Sort */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
            <Search style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", width: "1rem", height: "1rem", color: "rgba(255,255,255,0.4)" }} />
            <input
              type="text"
              placeholder="Search by faculty name, Emp ID, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="adminInput"
              style={{ paddingLeft: "2.5rem" }}
            />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="adminInput"
            style={{ width: "auto", minWidth: "150px" }}
          >
            <option value="all" style={{ background: "var(--navy-900)" }}>All Departments</option>
            <option value="science" style={{ background: "var(--navy-900)" }}>Science</option>
            <option value="mathematics" style={{ background: "var(--navy-900)" }}>Mathematics</option>
            <option value="english" style={{ background: "var(--navy-900)" }}>English</option>
            <option value="computer science" style={{ background: "var(--navy-900)" }}>Computer Science</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="adminInput"
            style={{ width: "auto", minWidth: "130px" }}
          >
            <option value="all" style={{ background: "var(--navy-900)" }}>All Statuses</option>
            <option value="active" style={{ background: "var(--navy-900)" }}>Active</option>
            <option value="on_leave" style={{ background: "var(--navy-900)" }}>On Leave</option>
            <option value="resigned" style={{ background: "var(--navy-900)" }}>Resigned</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "name" | "empId" | "dept")}
            className="adminInput"
            style={{ width: "auto", minWidth: "130px" }}
          >
            <option value="empId" style={{ background: "var(--navy-900)" }}>Sort: Emp ID</option>
            <option value="name" style={{ background: "var(--navy-900)" }}>Sort: Name</option>
            <option value="dept" style={{ background: "var(--navy-900)" }}>Sort: Department</option>
          </select>
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", padding: "0.6rem 1rem", borderRadius: "var(--radius-sm)", marginBottom: "1rem", color: "#fca5a5" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>
              {selectedIds.length} faculty record(s) selected
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
          <AdminSkeleton message="Loading faculty directory..." />
        ) : error ? (
          <div className="adminError">{error}</div>
        ) : filteredTeachers.length === 0 ? (
          <AdminEmptyState message="No faculty records match your query." />
        ) : (
          <>
            <AdminTable columns={columns} data={paginatedTeachers} keyExtractor={(t) => t._id} />

            {/* Pagination Controls */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.25rem", color: "rgba(255,255,255,0.6)", fontSize: "0.8rem" }}>
              <div>
                Showing Page {currentPage} of {totalPages} ({filteredTeachers.length} Total Records)
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
      <TeacherPreviewDrawer
        isOpen={!!previewTeacher}
        onClose={() => setPreviewTeacher(null)}
        teacher={previewTeacher}
        onRefresh={fetchTeachers}
      />

      {/* Add Teacher Modal */}
      <AdminModal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Faculty Member">
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
      </AdminModal>

      {/* Bulk Import Drawer */}
      <BulkImportDrawer
        isOpen={showImportDrawer}
        onClose={() => setShowImportDrawer(false)}
        title="Bulk Import Faculty Members"
        fields={[
          { key: "name", label: "Name", required: true },
          { key: "email", label: "Email", required: true },
          { key: "employeeId", label: "EmployeeID", required: true },
          { key: "department", label: "Department", required: true },
          { key: "subjectSpecialization", label: "Specialization" },
          { key: "assignedClass", label: "AssignedClass" },
          { key: "phone", label: "Phone" },
        ]}
        templateHeaders={["EmployeeID", "Name", "Department", "Specialization", "AssignedClass", "Email", "Phone"]}
        templateSampleRow={["EMP-2026-045", "Dr. Sunita Kapoor", "Mathematics", "Advanced Calculus", "Grade XI-A", "sunita.kapoor@sunshineps.edu.in", "+91 98222 33344"]}
        templateFilename="sunshine_faculty_template.csv"
        onImport={handleBulkImport}
        onSuccess={fetchTeachers}
      />
    </main>
  );
}
