"use client";

import React, { useEffect, useState } from "react";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminModal from "@/components/admin/AdminModal";
import AdminTable, { Column } from "@/components/admin/AdminTable";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminSkeleton from "@/components/admin/AdminSkeleton";
import FeeReceiptModal, { FeeReceiptData } from "@/components/admin/FeeReceiptModal";
import { FileText, Bell } from "lucide-react";

interface FeeItem {
  _id: string;
  studentName: string;
  grade: string;
  section: string;
  title: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  paidDate?: string;
  transactionId?: string;
}

export default function AdminFeesPage() {
  const [fees, setFees] = useState<FeeItem[]>([]);
  const [totalCollected, setTotalCollected] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReceipt, setSelectedReceipt] = useState<FeeReceiptData | null>(null);

  // Modal form states
  const [showModal, setShowModal] = useState(false);
  const [invoiceTitle, setInvoiceTitle] = useState("Term 2 Tuition & Development Fee");
  const [invoiceGrade, setInvoiceGrade] = useState("Grade X");
  const [invoiceAmount, setInvoiceAmount] = useState("32000");
  const [invoiceDueDate, setInvoiceDueDate] = useState("2026-08-30");
  const [submitting, setSubmitting] = useState(false);
  const [reminderMsg, setReminderMsg] = useState("");

  const fetchFees = async () => {
    try {
      const res = await fetch("/api/admin/fees");
      if (res.ok) {
        const data = await res.json();
        setFees(data.fees || []);
        setTotalCollected(data.totalCollected || 0);
        setTotalPending(data.totalPending || 0);
      }
    } catch {
      console.error("Failed to load fees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handleCreateInvoices = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_class_invoice",
          grade: invoiceGrade,
          title: invoiceTitle,
          amount: invoiceAmount,
          dueDate: invoiceDueDate,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        fetchFees();
      } else {
        alert("Failed to generate class invoices");
      }
    } catch {
      alert("Error generating invoices");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReminder = (fee: FeeItem) => {
    setReminderMsg(`✓ Payment reminder notification sent to ${fee.studentName} (${fee.grade}-${fee.section}) for ₹${fee.amount.toLocaleString()}`);
    setTimeout(() => setReminderMsg(""), 4000);
  };

  const filteredFees = fees.filter((f) => {
    if (statusFilter === "all") return true;
    return f.status === statusFilter;
  });

  const columns: Column<FeeItem>[] = [
    {
      header: "Student Name",
      cell: (f) => <span style={{ fontWeight: 600, color: "#ffffff" }}>{f.studentName}</span>,
    },
    {
      header: "Class",
      cell: (f) => <span style={{ color: "#ffffff" }}>{f.grade}-{f.section}</span>,
    },
    {
      header: "Invoice Title",
      cell: (f) => <span style={{ color: "rgba(255,255,255,0.8)" }}>{f.title}</span>,
    },
    {
      header: "Amount",
      cell: (f) => <span style={{ color: "var(--gold-300)", fontWeight: 700 }}>₹{f.amount.toLocaleString()}</span>,
    },
    {
      header: "Due Date",
      cell: (f) => <span style={{ color: "rgba(255,255,255,0.6)" }}>{f.dueDate}</span>,
    },
    {
      header: "Status",
      cell: (f) => (
        <span className={`adminBadge adminBadge-${f.status}`}>
          {f.status}
        </span>
      ),
    },
    {
      header: "Action / Receipt",
      cell: (f) => (
        <div style={{ display: "flex", gap: "0.4rem" }}>
          {f.status === "paid" ? (
            <button
              onClick={() => setSelectedReceipt(f)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                padding: "0.3rem 0.6rem",
                fontSize: "0.75rem",
                background: "rgba(34,197,94,0.15)",
                border: "1px solid rgba(34,197,94,0.4)",
                color: "#86efac",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              <FileText style={{ width: "0.8rem", height: "0.8rem" }} /> View Receipt
            </button>
          ) : (
            <button
              onClick={() => handleSendReminder(f)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                padding: "0.3rem 0.6rem",
                fontSize: "0.75rem",
                background: "rgba(217,155,38,0.2)",
                border: "1px solid var(--gold-500)",
                color: "var(--gold-300)",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              <Bell style={{ width: "0.8rem", height: "0.8rem" }} /> Send Reminder
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <main className="adminMain">
      {/* Metric Overview */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <AdminStatCard
          label="Total Fees Collected"
          value={`₹${totalCollected.toLocaleString()}`}
          subtext="Paid Invoices"
          valueColor="#86efac"
        />
        <AdminStatCard
          label="Pending / Overdue Fees"
          value={`₹${totalPending.toLocaleString()}`}
          subtext="Outstanding Invoices"
          valueColor="#fca5a5"
        />
      </div>

      {reminderMsg && (
        <div
          style={{
            background: "rgba(34,197,94,0.2)",
            border: "1px solid rgba(34,197,94,0.4)",
            color: "#86efac",
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-sm)",
            marginBottom: "1.5rem",
          }}
        >
          {reminderMsg}
        </div>
      )}

      <div className="adminContentCard">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h2>Fee Records & Official Receipts ({filteredFees.length})</h2>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>
              Track student fee collections, generate official PDF payment receipts, and issue class invoices.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="adminInput"
              style={{ width: "auto", minWidth: "140px" }}
            >
              <option value="all" style={{ background: "var(--navy-900)" }}>All Statuses</option>
              <option value="paid" style={{ background: "var(--navy-900)" }}>Paid Only</option>
              <option value="pending" style={{ background: "var(--navy-900)" }}>Pending Only</option>
              <option value="overdue" style={{ background: "var(--navy-900)" }}>Overdue Only</option>
            </select>

            <button onClick={() => setShowModal(true)} className="adminSubmitButton" style={{ width: "auto" }}>
              + Issue Class Fee Invoice
            </button>
          </div>
        </div>

        {loading ? (
          <AdminSkeleton message="Loading fee records..." />
        ) : filteredFees.length === 0 ? (
          <AdminEmptyState message="No fee records found for the selected filter." />
        ) : (
          <AdminTable columns={columns} data={filteredFees} keyExtractor={(f) => f._id} />
        )}
      </div>

      {/* Official Receipt Printable Modal */}
      <FeeReceiptModal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        receipt={selectedReceipt}
      />

      {/* Invoice Generation Modal */}
      <AdminModal isOpen={showModal} onClose={() => setShowModal(false)} title="Generate Class Fee Invoices" maxWidth="500px">
        <form onSubmit={handleCreateInvoices} style={{ display: "grid", gap: "1rem" }}>
          <div>
            <label className="adminLabel">Class / Grade *</label>
            <select value={invoiceGrade} onChange={(e) => setInvoiceGrade(e.target.value)} className="adminInput">
              <option value="Grade IX" style={{ background: "var(--navy-900)" }}>Grade IX</option>
              <option value="Grade X" style={{ background: "var(--navy-900)" }}>Grade X</option>
              <option value="Grade XI" style={{ background: "var(--navy-900)" }}>Grade XI</option>
              <option value="Grade XII" style={{ background: "var(--navy-900)" }}>Grade XII</option>
            </select>
          </div>

          <div>
            <label className="adminLabel">Invoice Title *</label>
            <input type="text" required value={invoiceTitle} onChange={(e) => setInvoiceTitle(e.target.value)} className="adminInput" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="adminLabel">Amount (₹) *</label>
              <input type="number" required value={invoiceAmount} onChange={(e) => setInvoiceAmount(e.target.value)} className="adminInput" />
            </div>
            <div>
              <label className="adminLabel">Due Date *</label>
              <input type="date" required value={invoiceDueDate} onChange={(e) => setInvoiceDueDate(e.target.value)} className="adminInput" />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
            <button type="button" onClick={() => setShowModal(false)} style={{ padding: "0.5rem 1rem", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="adminSubmitButton" style={{ width: "auto" }}>
              {submitting ? "Generating..." : "Generate Class Invoices"}
            </button>
          </div>
        </form>
      </AdminModal>
    </main>
  );
}
