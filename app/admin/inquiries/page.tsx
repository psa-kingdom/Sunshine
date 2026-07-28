"use client";

import React, { useEffect, useState } from "react";
import Loader from "@/components/kokonutui/loader";
import SmoothTab from "@/components/kokonutui/smooth-tab";
import DataToolbar from "@/components/kokonutui/data-toolbar";
import { useRouter } from "next/navigation";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import InquiryWorkflowDrawer, { InquiryWorkflowData } from "@/components/admin/InquiryWorkflowDrawer";
import { Eye } from "lucide-react";

interface InquiryItem {
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

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeAdminTab, setActiveAdminTab] = useState("inquiries");
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryWorkflowData | null>(null);
  const router = useRouter();

  const handleTabChange = (tabId: string) => {
    setActiveAdminTab(tabId);
    if (tabId === "teachers") {
      router.push("/admin/teachers");
    } else if (tabId === "students") {
      router.push("/admin/students");
    }
  };

  const fetchInquiries = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/inquiries");
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      const data = await res.json();
      setInquiries(data.data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load inquiries";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        alert("Failed to update inquiry status");
        return;
      }

      setInquiries((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: newStatus as InquiryItem["status"] } : item
        )
      );
    } catch {
      alert("Error updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteSingle = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) {
      return;
    }

    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Failed to delete inquiry");
        return;
      }

      setInquiries((prev) => prev.filter((item) => item._id !== id));
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    } catch {
      alert("Error deleting inquiry");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} selected enquiry record(s)?`)) return;

    for (const id of selectedIds) {
      try {
        await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
      } catch (err) {
        console.error("Failed deleting", id, err);
      }
    }
    setInquiries((prev) => prev.filter((item) => !selectedIds.includes(item._id)));
    setSelectedIds([]);
  };

  const handleExportCSV = () => {
    const headers = ["Parent Name", "Email", "Phone", "Grade", "Status", "Date"];
    const rows = filteredInquiries.map((item) => [
      `"${item.parentName.replace(/"/g, '""')}"`,
      `"${item.email.replace(/"/g, '""')}"`,
      `"${item.phone.replace(/"/g, '""')}"`,
      `"${item.gradeApplyingFor.replace(/"/g, '""')}"`,
      `"${item.status}"`,
      `"${new Date(item.createdAt).toLocaleDateString()}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `sunshine_enquiries_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredInquiries.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredInquiries.map((i) => i._id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredInquiries = inquiries.filter((item) => {
    if (filterStatus === "all") return true;
    return item.status === filterStatus;
  });

  return (
    <main className="adminMain">
      {/* KokonutUI SmoothTab Navigation */}
      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <SmoothTab
          tabs={[
            { id: "inquiries", label: "Admission Enquiries", badge: inquiries.length },
            { id: "teachers", label: "Teachers & Staff" },
            { id: "students", label: "Students & Parents" },
          ]}
          activeTab={activeAdminTab}
          onChange={handleTabChange}
        />
      </div>

      <div className="adminContentCard">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2>Admission Applications Workflow ({filteredInquiries.length})</h2>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>
              Manage prospective student inquiries, staff assignments, internal notes, and pipeline stages.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <label htmlFor="filter-status" className="adminLabel" style={{ marginBottom: 0 }}>
              Stage Filter:
            </label>
            <select
              id="filter-status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="adminInput"
              style={{ width: "auto", padding: "0.4rem 0.8rem" }}
            >
              <option value="all">All Stages</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="follow_up">Follow Up</option>
              <option value="admitted">Admitted</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* KokonutUI DataToolbar */}
        <DataToolbar
          selectedCount={selectedIds.length}
          onDeleteSelected={handleDeleteSelected}
          onExportCSV={handleExportCSV}
          className="mb-4"
        />

        {loading ? (
          <Loader title="Loading enquiries..." subtitle="Fetching prospective student applications" />
        ) : error ? (
          <div className="adminError">{error}</div>
        ) : filteredInquiries.length === 0 ? (
          <AdminEmptyState message="No admission inquiries match the selected criteria." />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)", textAlign: "left", color: "var(--gold-400)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                  <th style={{ padding: "0.75rem 1rem", width: "40px" }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredInquiries.length && filteredInquiries.length > 0}
                      onChange={toggleSelectAll}
                      className="cursor-pointer"
                    />
                  </th>
                  <th style={{ padding: "0.75rem 1rem" }}>Date</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Parent Name</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Contact Info</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Grade</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Stage</th>
                  <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Workflow</th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.map((item) => (
                  <tr
                    key={item._id}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: selectedIds.includes(item._id) ? "rgba(217, 155, 38, 0.08)" : "transparent" }}
                  >
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item._id)}
                        onChange={() => toggleSelectOne(item._id)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td style={{ padding: "0.75rem 1rem", whiteSpace: "nowrap", color: "rgba(255,255,255,0.6)" }}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#ffffff" }}>
                      {item.parentName}
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <div style={{ color: "rgba(255,255,255,0.9)" }}>{item.email}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--gold-400)" }}>{item.phone}</div>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "rgba(255,255,255,0.8)" }}>
                      {item.gradeApplyingFor}
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <select
                        value={item.status}
                        disabled={updatingId === item._id}
                        onChange={(e) => handleStatusChange(item._id, e.target.value)}
                        style={{
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.75rem",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border-subtle)",
                          background:
                            item.status === "new"
                              ? "rgba(229, 173, 60, 0.15)"
                              : item.status === "contacted"
                              ? "rgba(59, 130, 246, 0.15)"
                              : item.status === "follow_up"
                              ? "rgba(192, 132, 252, 0.15)"
                              : item.status === "admitted"
                              ? "rgba(74, 222, 128, 0.15)"
                              : "rgba(248, 113, 113, 0.15)",
                          color:
                            item.status === "new"
                              ? "var(--gold-400)"
                              : item.status === "contacted"
                              ? "#60a5fa"
                              : item.status === "follow_up"
                              ? "#c084fc"
                              : item.status === "admitted"
                              ? "#4ade80"
                              : "#f87171",
                          cursor: "pointer",
                        }}
                      >
                        <option value="new" style={{ background: "var(--navy-900)", color: "#fff" }}>New</option>
                        <option value="contacted" style={{ background: "var(--navy-900)", color: "#fff" }}>Contacted</option>
                        <option value="follow_up" style={{ background: "var(--navy-900)", color: "#fff" }}>Follow Up</option>
                        <option value="admitted" style={{ background: "var(--navy-900)", color: "#fff" }}>Admitted</option>
                        <option value="closed" style={{ background: "var(--navy-900)", color: "#fff" }}>Closed</option>
                      </select>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                      <button
                        onClick={() => setSelectedInquiry(item)}
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
                        <Eye style={{ width: "0.8rem", height: "0.8rem" }} /> Notes & Workflow
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inquiry Workflow Drawer */}
      <InquiryWorkflowDrawer
        isOpen={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        inquiry={selectedInquiry}
        onRefresh={fetchInquiries}
      />
    </main>
  );
}
