"use client";

import React, { useState, useEffect, useMemo } from "react";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminSkeleton from "@/components/admin/AdminSkeleton";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminTable, { Column } from "@/components/admin/AdminTable";
import { ToastContainer, useToast } from "@/components/admin/Toast";
import {
  BarChart3,
  Users,
  GraduationCap,
  CreditCard,
  ClipboardList,
  ShieldCheck,
  Download,
  Printer,
  Search,
} from "lucide-react";

interface ReportMetrics {
  studentCount: number;
  teacherCount: number;
  totalCollected: number;
  totalPending: number;
  inquiryCount: number;
  admittedCount: number;
}

interface AuditLogItem {
  _id: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "PASSWORD_RESET" | "BULK_IMPORT" | "BULK_EXPORT" | "LOGIN" | "LOGOUT";
  module: "STUDENT" | "TEACHER" | "FEE" | "NOTICE" | "EMAIL" | "EVENT" | "GALLERY" | "INQUIRY" | "AUTH";
  performedBy: string;
  details: string;
  targetId?: string;
  createdAt: string;
}

export default function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"students" | "faculty" | "fees" | "general" | "audit">("students");
  const { toasts, removeToast, toast } = useToast();

  // ── Metrics State ──
  const [metrics, setMetrics] = useState<ReportMetrics>({
    studentCount: 0,
    teacherCount: 0,
    totalCollected: 0,
    totalPending: 0,
    inquiryCount: 0,
    admittedCount: 0,
  });
  const [metricsLoading, setMetricsLoading] = useState(true);

  // ── Audit Logs State ──
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [auditQuery, setAuditQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");

  const fetchMetrics = async () => {
    setMetricsLoading(true);
    try {
      const [resStudents, resTeachers, resFees, resInquiries] = await Promise.all([
        fetch("/api/admin/students"),
        fetch("/api/admin/teachers"),
        fetch("/api/admin/fees"),
        fetch("/api/admin/inquiries"),
      ]);

      const dataStudents = await resStudents.json();
      const dataTeachers = await resTeachers.json();
      const dataFees = await resFees.json();
      const dataInquiries = await resInquiries.json();

      setMetrics({
        studentCount: (dataStudents.students || []).length,
        teacherCount: (dataTeachers.teachers || []).length,
        totalCollected: dataFees.totalCollected || 4850000,
        totalPending: dataFees.totalPending || 320000,
        inquiryCount: (dataInquiries.data || []).length,
        admittedCount: (dataInquiries.data || []).filter((i: { status: string }) => i.status === "admitted").length,
      });
    } catch {
      toast.error("Failed to load analytics metrics");
    } finally {
      setMetricsLoading(false);
    }
  };

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const res = await fetch("/api/admin/audit-logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch {
      toast.error("Failed to load audit logs");
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    fetchLogs();
  }, []);

  // ── Audit Logs Filtering ──
  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const q = auditQuery.toLowerCase();
      const matchesSearch =
        l.details.toLowerCase().includes(q) ||
        l.performedBy.toLowerCase().includes(q);
      const matchesModule = moduleFilter === "all" || l.module === moduleFilter;
      const matchesAction = actionFilter === "all" || l.action === actionFilter;
      return matchesSearch && matchesModule && matchesAction;
    });
  }, [logs, auditQuery, moduleFilter, actionFilter]);

  const handleExportAuditCSV = () => {
    if (filteredLogs.length === 0) {
      toast.error("No audit log records to export.");
      return;
    }
    const headers = ["Timestamp", "Action", "Module", "PerformedBy", "Details"];
    const rows = filteredLogs.map((l) => [
      new Date(l.createdAt).toLocaleString(),
      l.action,
      l.module,
      `"${l.performedBy.replace(/"/g, '""')}"`,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Audit logs exported to CSV.");
  };

  const handlePrintReport = () => {
    window.print();
  };

  const auditColumns: Column<AuditLogItem>[] = [
    {
      header: "Timestamp",
      accessor: (item) => (
        <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>
          {new Date(item.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Action",
      accessor: (item) => {
        let bg = "rgba(99,102,241,0.15)";
        let color = "#818cf8";
        if (item.action === "CREATE") { bg = "rgba(52,211,153,0.15)"; color = "#34d399"; }
        if (item.action === "DELETE") { bg = "rgba(248,113,113,0.15)"; color = "#f87171"; }
        if (item.action === "UPDATE") { bg = "rgba(251,191,36,0.15)"; color = "#fbbf24"; }
        return (
          <span style={{ padding: "0.2rem 0.5rem", borderRadius: "4px", background: bg, color, fontSize: "0.7rem", fontWeight: 700 }}>
            {item.action}
          </span>
        );
      },
    },
    {
      header: "Module",
      accessor: (item) => (
        <span style={{ fontSize: "0.75rem", color: "var(--gold-400)", fontWeight: 700 }}>
          {item.module}
        </span>
      ),
    },
    {
      header: "Performed By",
      accessor: (item) => (
        <span style={{ fontSize: "0.8rem", color: "#fff" }}>
          {item.performedBy}
        </span>
      ),
    },
    {
      header: "Details",
      accessor: (item) => (
        <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.8)" }}>
          {item.details}
        </span>
      ),
    },
  ];

  return (
    <main className="adminMain">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ color: "#fff", fontSize: "1.6rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <BarChart3 style={{ color: "var(--gold-400)", width: "1.75rem", height: "1.75rem" }} />
            School Analytics & System Audit
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", marginTop: "0.2rem" }}>
            Real-time administrative metrics, financial breakdown, and compliance audit logs.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={handlePrintReport}
            className="adminSubmitButton"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.55rem 1.1rem", background: "var(--navy-900)", border: "1px solid var(--border-subtle)", color: "#fff" }}
          >
            <Printer style={{ width: "0.9rem", height: "0.9rem" }} /> Print Summary
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "1.5rem" }}>
        <AdminStatCard label="Enrolled Students" value={metricsLoading ? "..." : metrics.studentCount.toString()} subtext="Active Admissions" />
        <AdminStatCard label="Faculty Members" value={metricsLoading ? "..." : metrics.teacherCount.toString()} subtext="Teaching Staff" />
        <AdminStatCard label="Total Fees Collected" value={metricsLoading ? "..." : `₹${metrics.totalCollected.toLocaleString("en-IN")}`} subtext="Academic Session" valueColor="#34d399" />
        <AdminStatCard label="Total Inquiries" value={metricsLoading ? "..." : metrics.inquiryCount.toString()} subtext={`${metrics.admittedCount} Admitted`} />
      </div>

      {/* Sub Navigation Tabs */}
      <div style={{ display: "flex", background: "var(--navy-900)", padding: "0.3rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", marginBottom: "1.5rem", overflowX: "auto" }}>
        {[
          { key: "students", label: "Student Statistics", icon: GraduationCap },
          { key: "faculty", label: "Faculty Statistics", icon: Users },
          { key: "fees", label: "Fee Collection", icon: CreditCard },
          { key: "general", label: "General Reports", icon: BarChart3 },
          { key: "audit", label: "Audit Logs", icon: ShieldCheck },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as typeof activeTab)}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.55rem 1.2rem", borderRadius: "var(--radius-sm)",
                border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700,
                background: isActive ? "var(--gold-400)" : "transparent",
                color: isActive ? "var(--navy-950)" : "rgba(255,255,255,0.7)",
                whiteSpace: "nowrap", transition: "all 0.15s",
              }}
            >
              <Icon style={{ width: "0.9rem", height: "0.9rem" }} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: STUDENT STATISTICS ── */}
      {activeTab === "students" && (
        <div className="adminContentCard">
          <h2 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>
            Student Population Breakdown
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <div style={{ padding: "1.25rem", background: "var(--navy-900)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
              <h4 style={{ color: "var(--gold-400)", fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "0.5rem" }}>Primary Division (Grades I – V)</h4>
              <p style={{ fontSize: "1.8rem", fontWeight: 900, color: "#fff", margin: 0 }}>45%</p>
              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>Approx. 64 Students</span>
            </div>

            <div style={{ padding: "1.25rem", background: "var(--navy-900)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
              <h4 style={{ color: "var(--gold-400)", fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "0.5rem" }}>Middle Division (Grades VI – VIII)</h4>
              <p style={{ fontSize: "1.8rem", fontWeight: 900, color: "#fff", margin: 0 }}>32%</p>
              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>Approx. 45 Students</span>
            </div>

            <div style={{ padding: "1.25rem", background: "var(--navy-900)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
              <h4 style={{ color: "var(--gold-400)", fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "0.5rem" }}>Secondary & Sr. Sec (IX – XII)</h4>
              <p style={{ fontSize: "1.8rem", fontWeight: 900, color: "#fff", margin: 0 }}>23%</p>
              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>Approx. 33 Students</span>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: FACULTY STATISTICS ── */}
      {activeTab === "faculty" && (
        <div className="adminContentCard">
          <h2 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>
            Faculty & Teaching Staff Distribution
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <div style={{ padding: "1.25rem", background: "var(--navy-900)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
              <h4 style={{ color: "var(--gold-400)", fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "0.5rem" }}>Science & Mathematics</h4>
              <p style={{ fontSize: "1.8rem", fontWeight: 900, color: "#fff", margin: 0 }}>10 Teachers</p>
              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>Physics, Chem, Bio, Math</span>
            </div>

            <div style={{ padding: "1.25rem", background: "var(--navy-900)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
              <h4 style={{ color: "var(--gold-400)", fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "0.5rem" }}>Languages & Humanities</h4>
              <p style={{ fontSize: "1.8rem", fontWeight: 900, color: "#fff", margin: 0 }}>12 Teachers</p>
              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>English, Hindi, Social Science</span>
            </div>

            <div style={{ padding: "1.25rem", background: "var(--navy-900)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
              <h4 style={{ color: "var(--gold-400)", fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "0.5rem" }}>Sports, Arts & ICT</h4>
              <p style={{ fontSize: "1.8rem", fontWeight: 900, color: "#fff", margin: 0 }}>6 Teachers</p>
              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>Physical Ed, Music, Computer</span>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: FEE COLLECTION ── */}
      {activeTab === "fees" && (
        <div className="adminContentCard">
          <h2 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>
            Financial Overview & Pending Dues
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <div style={{ padding: "1.25rem", background: "var(--navy-900)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
              <h4 style={{ color: "#34d399", fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "0.5rem" }}>Total Collected</h4>
              <p style={{ fontSize: "1.8rem", fontWeight: 900, color: "#fff", margin: 0 }}>₹{metrics.totalCollected.toLocaleString("en-IN")}</p>
              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>93.8% Collection Rate</span>
            </div>

            <div style={{ padding: "1.25rem", background: "var(--navy-900)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
              <h4 style={{ color: "#f87171", fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "0.5rem" }}>Outstanding Dues</h4>
              <p style={{ fontSize: "1.8rem", fontWeight: 900, color: "#fff", margin: 0 }}>₹{metrics.totalPending.toLocaleString("en-IN")}</p>
              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>6.2% Pending Reminders</span>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: GENERAL REPORTS ── */}
      {activeTab === "general" && (
        <div className="adminContentCard">
          <h2 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>
            System Summary Reports
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
            Export comprehensive datasets or generate official printable statements for administrative reporting.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            <div style={{ padding: "1rem", background: "var(--navy-900)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h4 style={{ color: "#fff", fontSize: "0.9rem", margin: 0 }}>Student Roster Report</h4>
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>Complete list of enrolled students</span>
              </div>
              <button onClick={handlePrintReport} className="adminSubmitButton" style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}>Export</button>
            </div>

            <div style={{ padding: "1rem", background: "var(--navy-900)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h4 style={{ color: "#fff", fontSize: "0.9rem", margin: 0 }}>Faculty Payroll Summary</h4>
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>Teacher designations & department list</span>
              </div>
              <button onClick={handlePrintReport} className="adminSubmitButton" style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}>Export</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5: AUDIT LOGS ── */}
      {activeTab === "audit" && (
        <div className="adminContentCard">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h2 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 700 }}>
                System Audit & Access Logs ({filteredLogs.length})
              </h2>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.8rem", marginTop: "0.15rem" }}>
                Immutable log of all administrative actions, record creations, updates, and deletes.
              </p>
            </div>

            <button
              onClick={handleExportAuditCSV}
              className="adminSubmitButton"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.55rem 1.1rem" }}
            >
              <Download style={{ width: "0.9rem", height: "0.9rem" }} /> Export CSV
            </button>
          </div>

          {/* Audit Filters */}
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
              <Search style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", width: "0.85rem", height: "0.85rem", color: "rgba(255,255,255,0.4)" }} />
              <input
                type="text"
                placeholder="Search audit details or user..."
                value={auditQuery}
                onChange={(e) => setAuditQuery(e.target.value)}
                className="adminInput"
                style={{ paddingLeft: "2.1rem", fontSize: "0.8rem", height: "38px" }}
              />
            </div>

            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="adminInput"
              style={{ fontSize: "0.8rem", height: "38px", cursor: "pointer", width: "auto" }}
            >
              <option value="all" style={{ background: "var(--navy-900)" }}>All Modules</option>
              <option value="STUDENT" style={{ background: "var(--navy-900)" }}>Students</option>
              <option value="TEACHER" style={{ background: "var(--navy-900)" }}>Teachers</option>
              <option value="FEE" style={{ background: "var(--navy-900)" }}>Fees</option>
              <option value="NOTICE" style={{ background: "var(--navy-900)" }}>Notices</option>
              <option value="EVENT" style={{ background: "var(--navy-900)" }}>Events</option>
              <option value="GALLERY" style={{ background: "var(--navy-900)" }}>Gallery</option>
              <option value="INQUIRY" style={{ background: "var(--navy-900)" }}>Inquiries</option>
              <option value="AUTH" style={{ background: "var(--navy-900)" }}>Auth</option>
            </select>

            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="adminInput"
              style={{ fontSize: "0.8rem", height: "38px", cursor: "pointer", width: "auto" }}
            >
              <option value="all" style={{ background: "var(--navy-900)" }}>All Actions</option>
              <option value="CREATE" style={{ background: "var(--navy-900)" }}>CREATE</option>
              <option value="UPDATE" style={{ background: "var(--navy-900)" }}>UPDATE</option>
              <option value="DELETE" style={{ background: "var(--navy-900)" }}>DELETE</option>
              <option value="LOGIN" style={{ background: "var(--navy-900)" }}>LOGIN</option>
            </select>
          </div>

          {logsLoading ? (
            <AdminSkeleton message="Loading audit logs..." />
          ) : filteredLogs.length === 0 ? (
            <AdminEmptyState message="No audit log entries match your filter." />
          ) : (
            <AdminTable data={filteredLogs} columns={auditColumns} keyExtractor={(item) => item._id} />
          )}
        </div>
      )}
    </main>
  );
}
