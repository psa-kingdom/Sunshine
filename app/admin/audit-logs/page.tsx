"use client";

import React, { useEffect, useState, useMemo } from "react";
import AdminTable, { Column } from "@/components/admin/AdminTable";
import AdminSkeleton from "@/components/admin/AdminSkeleton";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import { Search, Download, ShieldCheck } from "lucide-react";

interface AuditLogItem {
  _id: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "PASSWORD_RESET" | "BULK_IMPORT" | "BULK_EXPORT" | "LOGIN" | "LOGOUT";
  module: "STUDENT" | "TEACHER" | "FEE" | "NOTICE" | "EMAIL" | "EVENT" | "GALLERY" | "INQUIRY" | "AUTH";
  performedBy: string;
  details: string;
  targetId?: string;
  createdAt: string;
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/audit-logs");
      if (!res.ok) throw new Error("Failed to fetch audit logs");
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const matchesSearch =
        l.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.performedBy.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesModule = moduleFilter === "all" || l.module === moduleFilter;
      const matchesAction = actionFilter === "all" || l.action === actionFilter;
      return matchesSearch && matchesModule && matchesAction;
    });
  }, [logs, searchQuery, moduleFilter, actionFilter]);

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) return;
    const headers = ["Timestamp", "Action", "Module", "PerformedBy", "Details"];
    const rows = filteredLogs.map(l => [
      new Date(l.createdAt).toLocaleString(),
      l.action,
      l.module,
      l.performedBy,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sunshine_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: Column<AuditLogItem>[] = [
    {
      header: "Timestamp",
      cell: (l) => (
        <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>
          {new Date(l.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Action / Event",
      cell: (l) => (
        <span
          style={{
            padding: "0.2rem 0.6rem",
            borderRadius: "4px",
            fontSize: "0.7rem",
            fontWeight: 800,
            textTransform: "uppercase",
            background:
              l.action === "CREATE"
                ? "rgba(34,197,94,0.15)"
                : l.action === "DELETE"
                ? "rgba(239,68,68,0.15)"
                : l.action === "PASSWORD_RESET"
                ? "rgba(192,132,252,0.15)"
                : "rgba(234,179,8,0.15)",
            color:
              l.action === "CREATE"
                ? "#86efac"
                : l.action === "DELETE"
                ? "#fca5a5"
                : l.action === "PASSWORD_RESET"
                ? "#c084fc"
                : "#fde047",
            border: `1px solid ${
              l.action === "CREATE"
                ? "rgba(34,197,94,0.3)"
                : l.action === "DELETE"
                ? "rgba(239,68,68,0.3)"
                : "rgba(234,179,8,0.3)"
            }`,
          }}
        >
          {l.action}
        </span>
      ),
    },
    {
      header: "Module",
      cell: (l) => (
        <span style={{ color: "var(--gold-400)", fontWeight: 700, fontSize: "0.75rem" }}>
          {l.module}
        </span>
      ),
    },
    {
      header: "Performed By",
      cell: (l) => <span style={{ color: "#ffffff", fontWeight: 600 }}>{l.performedBy}</span>,
    },
    {
      header: "Audit Details",
      cell: (l) => <span style={{ color: "rgba(255,255,255,0.85)" }}>{l.details}</span>,
    },
  ];

  return (
    <main className="adminMain">
      <div className="adminContentCard">
        {/* Header & Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ShieldCheck style={{ width: "1.25rem", height: "1.25rem", color: "var(--gold-400)" }} />
              <h2>System Audit Trail & Security Logs ({filteredLogs.length})</h2>
            </div>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>
              Immutable audit log tracking all administrative creations, profile updates, deletions, password resets, and bulk operations.
            </p>
          </div>

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
            <Download style={{ width: "0.9rem", height: "0.9rem" }} /> Export Audit Log CSV
          </button>
        </div>

        {/* Toolbar Filters */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
            <Search style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", width: "1rem", height: "1rem", color: "rgba(255,255,255,0.4)" }} />
            <input
              type="text"
              placeholder="Search details or performer email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="adminInput"
              style={{ paddingLeft: "2.5rem" }}
            />
          </div>

          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="adminInput"
            style={{ width: "auto", minWidth: "140px" }}
          >
            <option value="all" style={{ background: "var(--navy-900)" }}>All Modules</option>
            <option value="STUDENT" style={{ background: "var(--navy-900)" }}>Student</option>
            <option value="TEACHER" style={{ background: "var(--navy-900)" }}>Teacher</option>
            <option value="FEE" style={{ background: "var(--navy-900)" }}>Fee</option>
            <option value="NOTICE" style={{ background: "var(--navy-900)" }}>Notice</option>
            <option value="INQUIRY" style={{ background: "var(--navy-900)" }}>Inquiry</option>
          </select>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="adminInput"
            style={{ width: "auto", minWidth: "140px" }}
          >
            <option value="all" style={{ background: "var(--navy-900)" }}>All Actions</option>
            <option value="CREATE" style={{ background: "var(--navy-900)" }}>CREATE</option>
            <option value="UPDATE" style={{ background: "var(--navy-900)" }}>UPDATE</option>
            <option value="DELETE" style={{ background: "var(--navy-900)" }}>DELETE</option>
            <option value="PASSWORD_RESET" style={{ background: "var(--navy-900)" }}>PASSWORD_RESET</option>
            <option value="BULK_IMPORT" style={{ background: "var(--navy-900)" }}>BULK_IMPORT</option>
          </select>
        </div>

        {/* Table Content */}
        {loading ? (
          <AdminSkeleton message="Loading security audit trail..." />
        ) : error ? (
          <div className="adminError">{error}</div>
        ) : filteredLogs.length === 0 ? (
          <AdminEmptyState message="No audit log entries match the selected criteria." />
        ) : (
          <AdminTable columns={columns} data={filteredLogs} keyExtractor={(l) => l._id} />
        )}
      </div>
    </main>
  );
}
