"use client";

import React from "react";
import { Printer, CheckCircle } from "lucide-react";
import AdminModal from "./AdminModal";

export interface FeeReceiptData {
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

interface FeeReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: FeeReceiptData | null;
}

export default function FeeReceiptModal({
  isOpen,
  onClose,
  receipt,
}: FeeReceiptModalProps) {
  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const receiptNo = `REC-2026-${receipt._id.slice(-6).toUpperCase()}`;

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title="Official Fee Payment Receipt" maxWidth="560px">
      <div style={{ background: "#ffffff", color: "#0f172a", padding: "1.5rem", borderRadius: "var(--radius-md)", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {/* Receipt Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #e2e8f0", paddingBottom: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: "2rem", height: "2rem", borderRadius: "50%", background: "linear-gradient(135deg, #4f46e5, #ea580c)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.9rem" }}>S</div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>SUNSHINE PUBLIC SCHOOL</h3>
            </div>
            <p style={{ fontSize: "0.72rem", color: "#64748b", margin: "0.2rem 0 0 0" }}>Sector 45, Gurugram, Haryana 122003 • Affiliation No. 1234567</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#4f46e5", textTransform: "uppercase" }}>{receiptNo}</div>
            <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.1rem" }}>Date: {receipt.paidDate || new Date().toISOString().slice(0, 10)}</div>
          </div>
        </div>

        {/* Student & Payment Info */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.825rem", background: "#f8fafc", padding: "1rem", borderRadius: "var(--radius-sm)" }}>
          <div>
            <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "#64748b", fontWeight: 700 }}>Student Name</div>
            <div style={{ fontWeight: 700, color: "#0f172a" }}>{receipt.studentName}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "#64748b", fontWeight: 700 }}>Class & Section</div>
            <div style={{ fontWeight: 700, color: "#0f172a" }}>{receipt.grade} - Section {receipt.section}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "#64748b", fontWeight: 700 }}>Invoice Category</div>
            <div style={{ color: "#334155" }}>{receipt.title}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "#64748b", fontWeight: 700 }}>Payment Status</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "#16a34a", fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase" }}>
              <CheckCircle style={{ width: "0.85rem", height: "0.85rem" }} /> {receipt.status}
            </div>
          </div>
        </div>

        {/* Amount Table */}
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 1rem", background: "#f1f5f9", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", color: "#475569" }}>
            <span>Description</span>
            <span>Amount</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0.85rem 1rem", fontSize: "0.875rem", color: "#0f172a", borderBottom: "1px solid #e2e8f0" }}>
            <span>{receipt.title}</span>
            <span style={{ fontWeight: 700 }}>₹{receipt.amount.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0.85rem 1rem", background: "#f8fafc", fontSize: "1rem", fontWeight: 800, color: "#0f172a" }}>
            <span>Total Paid</span>
            <span style={{ color: "#16a34a" }}>₹{receipt.amount.toLocaleString()}</span>
          </div>
        </div>

        {/* Transaction & Stamp */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: "0.5rem" }}>
          <div>
            <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Transaction ID: {receipt.transactionId || "TXN-ONLINE-98711"}</div>
            <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Authorized By: Sunshine Accounts Office</div>
          </div>
          <div style={{ border: "2px dashed #94a3b8", padding: "0.4rem 0.8rem", borderRadius: "4px", textAlign: "center", color: "#475569", fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase" }}>
            Official Stamp
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
          <button
            type="button"
            onClick={onClose}
            style={{ padding: "0.5rem 1rem", background: "transparent", border: "1px solid #cbd5e1", color: "#334155", borderRadius: "var(--radius-sm)", cursor: "pointer", fontSize: "0.85rem" }}
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            style={{ padding: "0.5rem 1rem", background: "#4f46e5", border: "none", color: "#fff", borderRadius: "var(--radius-sm)", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.4rem" }}
          >
            <Printer style={{ width: "0.9rem", height: "0.9rem" }} /> Print Official Receipt
          </button>
        </div>
      </div>
    </AdminModal>
  );
}
