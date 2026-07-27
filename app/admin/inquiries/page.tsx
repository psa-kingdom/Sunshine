"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface InquiryItem {
  _id: string;
  parentName: string;
  email: string;
  phone: string;
  gradeApplyingFor: string;
  message?: string;
  status: "new" | "contacted" | "closed";
  createdAt: string;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchInquiries = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/inquiries");
      if (!res.ok) {
        throw new Error("Failed to load admission inquiries");
      }
      const data = await res.json();
      setInquiries(data.inquiries || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
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

  const handleDelete = async (id: string) => {
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
    } catch {
      alert("Error deleting inquiry");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredInquiries = inquiries.filter((item) => {
    if (filterStatus === "all") return true;
    return item.status === filterStatus;
  });

  return (
    <div className="adminShell">
      <header className="adminHeader">
        <div className="adminHeaderInner">
          <div className="adminBrand">
            <span className="adminCrest">S</span>
            <div className="adminTitle">
              SUNSHINE PUBLIC SCHOOL
              <small>Admission Inquiries</small>
            </div>
          </div>

          <div className="adminUserInfo">
            <Link
              href="/admin"
              className="text-xs uppercase tracking-wider font-semibold text-[var(--gold-400)] hover:underline"
            >
              Dashboard
            </Link>
            <span className="text-gray-500">•</span>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="adminSignOutButton"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="adminMain">
        <div className="adminContentCard">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h2>Submitted Enquiries</h2>
              <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>
                Total Received: {inquiries.length} | Showing: {filteredInquiries.length}
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <label htmlFor="filter-status" className="adminLabel" style={{ marginBottom: 0 }}>
                Filter:
              </label>
              <select
                id="filter-status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="adminInput"
                style={{ width: "auto", padding: "0.4rem 0.8rem" }}
              >
                <option value="all">All Statuses</option>
                <option value="new">New Only</option>
                <option value="contacted">Contacted Only</option>
                <option value="closed">Closed Only</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.6)" }}>
              Loading inquiries...
            </div>
          ) : error ? (
            <div className="adminError">{error}</div>
          ) : filteredInquiries.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.5)", border: "1px dashed var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
              No admission inquiries match the selected criteria.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-subtle)", textAlign: "left", color: "var(--gold-400)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                    <th style={{ padding: "0.75rem 1rem" }}>Date</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Parent Name</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Contact Details</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Grade</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Message</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Status</th>
                    <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInquiries.map((item) => (
                    <tr
                      key={item._id}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                        opacity: updatingId === item._id ? 0.5 : 1,
                      }}
                    >
                      <td style={{ padding: "0.875rem 1rem", whiteSpace: "nowrap", color: "rgba(255,255,255,0.6)" }}>
                        {new Date(item.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td style={{ padding: "0.875rem 1rem", fontWeight: "600", color: "#ffffff" }}>
                        {item.parentName}
                      </td>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <div style={{ color: "#ffffff" }}>{item.email}</div>
                        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem" }}>{item.phone}</div>
                      </td>
                      <td style={{ padding: "0.875rem 1rem", whiteSpace: "nowrap", color: "var(--gold-300)" }}>
                        {item.gradeApplyingFor}
                      </td>
                      <td style={{ padding: "0.875rem 1rem", maxWidth: "250px", color: "rgba(255,255,255,0.7)", fontSize: "0.8rem" }}>
                        {item.message || "—"}
                      </td>
                      <td style={{ padding: "0.875rem 1rem", whiteSpace: "nowrap" }}>
                        <select
                          value={item.status}
                          disabled={updatingId === item._id}
                          onChange={(e) => handleStatusChange(item._id, e.target.value)}
                          className="adminInput"
                          style={{
                            padding: "0.25rem 0.5rem",
                            fontSize: "0.75rem",
                            background:
                              item.status === "new"
                                ? "rgba(217,155,38,0.2)"
                                : item.status === "contacted"
                                ? "rgba(59,130,246,0.2)"
                                : "rgba(34,197,94,0.2)",
                            borderColor:
                              item.status === "new"
                                ? "var(--gold-500)"
                                : item.status === "contacted"
                                ? "#3b82f6"
                                : "#22c55e",
                          }}
                        >
                          <option value="new" style={{ background: "var(--navy-900)" }}>New</option>
                          <option value="contacted" style={{ background: "var(--navy-900)" }}>Contacted</option>
                          <option value="closed" style={{ background: "var(--navy-900)" }}>Closed</option>
                        </select>
                      </td>
                      <td style={{ padding: "0.875rem 1rem", textAlign: "right", whiteSpace: "nowrap" }}>
                        <button
                          onClick={() => handleDelete(item._id)}
                          disabled={updatingId === item._id}
                          style={{
                            background: "rgba(220,38,38,0.2)",
                            border: "1px solid rgba(239,68,68,0.4)",
                            color: "#fca5a5",
                            padding: "0.25rem 0.6rem",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "0.75rem",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
