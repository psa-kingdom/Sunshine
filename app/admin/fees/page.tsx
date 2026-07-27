"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

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

  return (
    <div className="adminShell">
      <header className="adminHeader">
        <div className="adminHeaderInner">
          <div className="adminBrand">
            <span className="adminCrest">S</span>
            <div className="adminTitle">
              SUNSHINE PUBLIC SCHOOL
              <small>Fee & Accounts Management</small>
            </div>
          </div>

          <div className="adminUserInfo">
            <Link href="/admin" className="text-xs uppercase tracking-wider font-semibold text-[var(--gold-400)] hover:underline">
              Dashboard
            </Link>
            <span className="text-gray-500">•</span>
            <button onClick={() => signOut({ callbackUrl: "/login" })} className="adminSignOutButton">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="adminMain">
        {/* Metric Overview */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
          <div className="adminContentCard">
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--gold-400)", fontWeight: 600 }}>
              Total Fees Collected
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "#86efac", fontWeight: 700, margin: "0.25rem 0" }}>
              ₹{totalCollected.toLocaleString()}
            </div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>Paid Invoices</div>
          </div>

          <div className="adminContentCard">
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--gold-400)", fontWeight: 600 }}>
              Pending / Overdue Fees
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "#fca5a5", fontWeight: 700, margin: "0.25rem 0" }}>
              ₹{totalPending.toLocaleString()}
            </div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>Outstanding Invoices</div>
          </div>
        </div>

        {reminderMsg && (
          <div style={{ background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.4)", color: "#86efac", padding: "0.75rem 1rem", borderRadius: "var(--radius-sm)", marginBottom: "1.5rem" }}>
            {reminderMsg}
          </div>
        )}

        <div className="adminContentCard">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h2>Fee History & Invoices ({fees.length})</h2>
              <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>
                Track student fee collections, audit payment history, and generate class-wise invoices.
              </p>
            </div>

            <button onClick={() => setShowModal(true)} className="adminSubmitButton" style={{ width: "auto" }}>
              + Issue Class Fee Invoice
            </button>
          </div>

          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.6)" }}>Loading fee records...</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-subtle)", textAlign: "left", color: "var(--gold-400)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                    <th style={{ padding: "0.75rem 1rem" }}>Student Name</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Class</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Invoice Title</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Amount</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Due Date</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Status</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((f) => (
                    <tr key={f._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      <td style={{ padding: "0.875rem 1rem", fontWeight: 600, color: "#ffffff" }}>{f.studentName}</td>
                      <td style={{ padding: "0.875rem 1rem", color: "#ffffff" }}>{f.grade}-{f.section}</td>
                      <td style={{ padding: "0.875rem 1rem", color: "rgba(255,255,255,0.8)" }}>{f.title}</td>
                      <td style={{ padding: "0.875rem 1rem", color: "var(--gold-300)", fontWeight: 700 }}>₹{f.amount.toLocaleString()}</td>
                      <td style={{ padding: "0.875rem 1rem", color: "rgba(255,255,255,0.6)" }}>{f.dueDate}</td>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <span
                          style={{
                            padding: "0.25rem 0.6rem",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            background: f.status === "paid" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)",
                            color: f.status === "paid" ? "#86efac" : "#fca5a5",
                            border: `1px solid ${f.status === "paid" ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}`,
                          }}
                        >
                          {f.status}
                        </span>
                      </td>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        {f.status !== "paid" && (
                          <button
                            onClick={() => handleSendReminder(f)}
                            style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", background: "rgba(217,155,38,0.2)", border: "1px solid var(--gold-500)", color: "var(--gold-300)", borderRadius: "4px", cursor: "pointer" }}
                          >
                            🔔 Send Reminder
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Invoice Generation Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", zIndex: 100 }}>
          <div className="adminCard" style={{ width: "100%", maxWidth: "500px" }}>
            <h3 className="adminHeading">Generate Class Fee Invoices</h3>
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
          </div>
        </div>
      )}
    </div>
  );
}
