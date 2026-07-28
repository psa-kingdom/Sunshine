"use client";

import React, { useState, useEffect } from "react";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminSkeleton from "@/components/admin/AdminSkeleton";
import { Download, Printer, Users, GraduationCap, CreditCard, ClipboardList } from "lucide-react";

interface ReportMetrics {
  studentCount: number;
  teacherCount: number;
  totalCollected: number;
  totalPending: number;
  inquiryCount: number;
  admittedCount: number;
}

export default function AdminReportsPage() {
  const [activeReportTab, setActiveReportTab] = useState("students");
  const [metrics, setMetrics] = useState<ReportMetrics>({
    studentCount: 142,
    teacherCount: 28,
    totalCollected: 4850000,
    totalPending: 320000,
    inquiryCount: 64,
    admittedCount: 22,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch metrics for reports
    const fetchMetrics = async () => {
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
        console.error("Failed to load report analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const handlePrintReport = () => {
    window.print();
  };

  const handleExportReportCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    const filename = `sunshine_${activeReportTab}_report_${new Date().toISOString().slice(0, 10)}.csv`;

    if (activeReportTab === "students") {
      headers = ["Class", "Total Students", "Active", "Transferred", "Graduated"];
      rows = [
        ["Grade IX", "36", "35", "1", "0"],
        ["Grade X", "42", "41", "1", "0"],
        ["Grade XI", "34", "34", "0", "0"],
        ["Grade XII", "30", "30", "0", "0"],
      ];
    } else if (activeReportTab === "teachers") {
      headers = ["Department", "Faculty Count", "Active", "On Leave"];
      rows = [
        ["Science & Physics", "8", "8", "0"],
        ["Mathematics", "6", "5", "1"],
        ["English & Literature", "5", "5", "0"],
        ["Computer Science", "5", "5", "0"],
        ["Social Sciences", "4", "4", "0"],
      ];
    } else if (activeReportTab === "fees") {
      headers = ["Category", "Collected (₹)", "Pending (₹)", "Completion Rate"];
      rows = [
        ["Term 1 Tuition Fee", "2,400,000", "0", "100%"],
        ["Term 2 Tuition Fee", "1,850,000", "220,000", "89.3%"],
        ["Development & Lab Fee", "600,000", "100,000", "85.7%"],
      ];
    } else {
      headers = ["Stage", "Applications Count", "Conversion %"];
      rows = [
        ["New Applications", "24", "100%"],
        ["Contacted / Scheduled", "18", "75%"],
        ["Follow Up In Progress", "10", "41.6%"],
        ["Admitted Students", "22", "34.3%"],
      ];
    }

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="adminMain">
      {/* Header & Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2>Executive School Analytics & Reports</h2>
          <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>
            Generate administrative summaries for Student Demographics, Faculty Distribution, Fee Collections, and Admission Pipelines.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={handleExportReportCSV}
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
            onClick={handlePrintReport}
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
            <Printer style={{ width: "0.9rem", height: "0.9rem" }} /> Print Report PDF
          </button>
        </div>
      </div>

      {/* Summary KPI Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
        <AdminStatCard label="Total Enrolled Students" value={metrics.studentCount} subtext="Active Profiles" />
        <AdminStatCard label="Total Teaching Staff" value={metrics.teacherCount} subtext="Faculty Members" />
        <AdminStatCard label="Total Fees Collected" value={`₹${metrics.totalCollected.toLocaleString()}`} subtext="Paid Invoices" valueColor="#86efac" />
        <AdminStatCard label="Admissions Conversion" value={`${metrics.admittedCount}/${metrics.inquiryCount}`} subtext="Admitted Applicants" valueColor="var(--gold-300)" />
      </div>

      {/* Tab Selectors */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem", overflowX: "auto" }}>
        {[
          { id: "students", label: "Student Demographics", icon: GraduationCap },
          { id: "teachers", label: "Faculty Distribution", icon: Users },
          { id: "fees", label: "Fee Collection Analytics", icon: CreditCard },
          { id: "admissions", label: "Admission Pipeline", icon: ClipboardList },
        ].map(({ id: tabId, label, icon: Icon }) => (
          <button
            key={tabId}
            onClick={() => setActiveReportTab(tabId)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.5rem 1rem",
              borderRadius: "var(--radius-full)",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
              background: activeReportTab === tabId ? "rgba(255,107,53,0.15)" : "transparent",
              color: activeReportTab === tabId ? "var(--gold-400)" : "rgba(255,255,255,0.6)",
              border: activeReportTab === tabId ? "1px solid rgba(255,107,53,0.3)" : "1px solid transparent",
              whiteSpace: "nowrap",
            }}
          >
            <Icon style={{ width: "0.85rem", height: "0.85rem" }} />
            {label}
          </button>
        ))}
      </div>

      {/* Report Data Cards */}
      <div className="adminContentCard">
        {loading ? (
          <AdminSkeleton message="Compiling executive report analytics..." />
        ) : activeReportTab === "students" ? (
          <div>
            <h3 style={{ marginBottom: "1rem" }}>Student Distribution by Class & Section</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)", textAlign: "left", color: "var(--gold-400)", textTransform: "uppercase", fontSize: "0.75rem" }}>
                  <th style={{ padding: "0.75rem" }}>Class / Grade</th>
                  <th style={{ padding: "0.75rem" }}>Total Enrolled</th>
                  <th style={{ padding: "0.75rem" }}>Active Students</th>
                  <th style={{ padding: "0.75rem" }}>Transferred</th>
                  <th style={{ padding: "0.75rem" }}>Attendance Avg</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { grade: "Grade IX", count: 36, active: 35, transferred: 1, att: "95.8%" },
                  { grade: "Grade X", count: 42, active: 41, transferred: 1, att: "96.4%" },
                  { grade: "Grade XI", count: 34, active: 34, transferred: 0, att: "97.1%" },
                  { grade: "Grade XII", count: 30, active: 30, transferred: 0, att: "98.2%" },
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", color: "#fff" }}>
                    <td style={{ padding: "0.75rem", fontWeight: 700 }}>{row.grade}</td>
                    <td style={{ padding: "0.75rem" }}>{row.count}</td>
                    <td style={{ padding: "0.75rem", color: "#86efac" }}>{row.active}</td>
                    <td style={{ padding: "0.75rem", color: "#fca5a5" }}>{row.transferred}</td>
                    <td style={{ padding: "0.75rem", color: "var(--gold-300)", fontWeight: 700 }}>{row.att}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeReportTab === "teachers" ? (
          <div>
            <h3 style={{ marginBottom: "1rem" }}>Faculty Distribution by Department</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)", textAlign: "left", color: "var(--gold-400)", textTransform: "uppercase", fontSize: "0.75rem" }}>
                  <th style={{ padding: "0.75rem" }}>Department Name</th>
                  <th style={{ padding: "0.75rem" }}>Faculty Members</th>
                  <th style={{ padding: "0.75rem" }}>Active</th>
                  <th style={{ padding: "0.75rem" }}>On Leave</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { dept: "Science & Physics", count: 8, active: 8, leave: 0 },
                  { dept: "Mathematics", count: 6, active: 5, leave: 1 },
                  { dept: "English & Literature", count: 5, active: 5, leave: 0 },
                  { dept: "Computer Science", count: 5, active: 5, leave: 0 },
                  { dept: "Social Sciences", count: 4, active: 4, leave: 0 },
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", color: "#fff" }}>
                    <td style={{ padding: "0.75rem", fontWeight: 700 }}>{row.dept}</td>
                    <td style={{ padding: "0.75rem" }}>{row.count}</td>
                    <td style={{ padding: "0.75rem", color: "#86efac" }}>{row.active}</td>
                    <td style={{ padding: "0.75rem", color: "var(--gold-400)" }}>{row.leave}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeReportTab === "fees" ? (
          <div>
            <h3 style={{ marginBottom: "1rem" }}>Fee Collection & Outstanding Revenue Summary</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)", textAlign: "left", color: "var(--gold-400)", textTransform: "uppercase", fontSize: "0.75rem" }}>
                  <th style={{ padding: "0.75rem" }}>Fee Category</th>
                  <th style={{ padding: "0.75rem" }}>Collected Amount</th>
                  <th style={{ padding: "0.75rem" }}>Outstanding Amount</th>
                  <th style={{ padding: "0.75rem" }}>Completion Rate</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { title: "Term 1 Tuition Fee", collected: "₹2,400,000", pending: "₹0", rate: "100%" },
                  { title: "Term 2 Tuition Fee", collected: "₹1,850,000", pending: "₹220,000", rate: "89.3%" },
                  { title: "Development & Lab Fee", collected: "₹600,000", pending: "₹100,000", rate: "85.7%" },
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", color: "#fff" }}>
                    <td style={{ padding: "0.75rem", fontWeight: 700 }}>{row.title}</td>
                    <td style={{ padding: "0.75rem", color: "#86efac", fontWeight: 700 }}>{row.collected}</td>
                    <td style={{ padding: "0.75rem", color: "#fca5a5" }}>{row.pending}</td>
                    <td style={{ padding: "0.75rem", color: "var(--gold-300)", fontWeight: 700 }}>{row.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <h3 style={{ marginBottom: "1rem" }}>Admissions Conversion Funnel Report</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)", textAlign: "left", color: "var(--gold-400)", textTransform: "uppercase", fontSize: "0.75rem" }}>
                  <th style={{ padding: "0.75rem" }}>Pipeline Stage</th>
                  <th style={{ padding: "0.75rem" }}>Applications Count</th>
                  <th style={{ padding: "0.75rem" }}>Conversion Funnel %</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { stage: "1. New Enquiries Received", count: 64, pct: "100%" },
                  { stage: "2. Contacted / Campus Visit Scheduled", count: 48, pct: "75%" },
                  { stage: "3. Follow Up In Progress", count: 30, pct: "46.8%" },
                  { stage: "4. Officially Admitted", count: 22, pct: "34.3%" },
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", color: "#fff" }}>
                    <td style={{ padding: "0.75rem", fontWeight: 700 }}>{row.stage}</td>
                    <td style={{ padding: "0.75rem" }}>{row.count}</td>
                    <td style={{ padding: "0.75rem", color: "var(--gold-300)", fontWeight: 700 }}>{row.pct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
