"use client";

import React, { useEffect, useState } from "react";
import ProfileDropdown from "@/components/kokonutui/profile-dropdown";

interface StudentProfile {
  name: string;
  email: string;
  rollNumber: string;
  grade: string;
  section: string;
  parentName: string;
  parentPhone: string;
}

interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  percentage: number;
  records: Array<{ _id: string; date: string; status: string; markedBy?: string }>;
}

interface ResultItem {
  _id: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  gradeLetter: string;
  remarks?: string;
}

interface ReportCard {
  term: string;
  overallPercentage: number;
  overallGrade: string;
  results: ResultItem[];
}

interface TimetableSlot {
  time: string;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
}

interface HomeworkItem {
  _id: string;
  title: string;
  subject: string;
  dueDate: string;
  description: string;
  teacherName?: string;
  resourceUrl?: string;
}

interface NoticeItem {
  _id: string;
  title: string;
  content: string;
  category: string;
}

interface FeeItem {
  _id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  paidDate?: string;
  transactionId?: string;
}

interface EventItem {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  type: string;
}

export default function StudentDashboardPage() {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [attendance, setAttendance] = useState<AttendanceStats | null>(null);
  const [reportCard, setReportCard] = useState<ReportCard | null>(null);
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [homework, setHomework] = useState<HomeworkItem[]>([]);
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [fees, setFees] = useState<FeeItem[]>([]);
  const [pendingFeesTotal, setPendingFeesTotal] = useState(0);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [submittedHwIds, setSubmittedHwIds] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "attendance" | "fees" | "calendar" | "messages">("overview");

  // Payment Modal State
  const [selectedFeeForPay, setSelectedFeeForPay] = useState<FeeItem | null>(null);
  const [processingPay, setProcessingPay] = useState(false);
  const [paidReceipt, setPaidReceipt] = useState<FeeItem | null>(null);

  // Message Form State
  const [msgTeacherEmail, setMsgTeacherEmail] = useState("teacher@sunshineps.edu.in");
  const [msgSubject, setMsgSubject] = useState("");
  const [msgContent, setMsgContent] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [sentMsgFeedback, setSentMsgFeedback] = useState("");

  const loadStudentData = async () => {
    try {
      const res = await fetch("/api/student/dashboard");
      if (!res.ok) throw new Error("Failed to load dashboard");
      const data = await res.json();
      setStudent(data.student);
      setAttendance(data.attendanceStats);
      setReportCard(data.reportCard);
      setTimetable(data.timetable || []);
      setHomework(data.homeworkList || []);
      setNotices(data.notices || []);
    } catch (err) {
      console.error("Student dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadFees = async () => {
    try {
      const res = await fetch("/api/student/fees");
      if (res.ok) {
        const data = await res.json();
        setFees(data.fees || []);
        setPendingFeesTotal(data.pendingTotal || 0);
      }
    } catch {
      console.error("Failed to load fees");
    }
  };

  const loadEvents = async () => {
    try {
      const res = await fetch("/api/student/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch {
      console.error("Failed to load events");
    }
  };

  useEffect(() => {
    loadStudentData();
    loadFees();
    loadEvents();
  }, []);

  const handlePayFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeeForPay) return;
    setProcessingPay(true);
    try {
      const res = await fetch("/api/student/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feeId: selectedFeeForPay._id }),
      });

      const data = await res.json();
      if (res.ok) {
        setSelectedFeeForPay(null);
        setPaidReceipt(data.fee);
        loadFees();
      } else {
        alert("Payment failed");
      }
    } catch {
      alert("Error processing payment");
    } finally {
      setProcessingPay(false);
    }
  };

  const toggleHomeworkSubmitted = (hwId: string) => {
    setSubmittedHwIds((prev) => ({
      ...prev,
      [hwId]: !prev[hwId],
    }));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingMsg(true);
    setSentMsgFeedback("");
    try {
      const res = await fetch("/api/student/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail: msgTeacherEmail,
          subject: msgSubject,
          content: msgContent,
        }),
      });

      if (res.ok) {
        setMsgSubject("");
        setMsgContent("");
        setSentMsgFeedback("✓ Message sent to teacher.");
        setTimeout(() => setSentMsgFeedback(""), 4000);
      } else {
        alert("Failed to send message");
      }
    } catch {
      alert("Error sending message");
    } finally {
      setSendingMsg(false);
    }
  };

  return (
    <div className="adminShell">
      <header className="adminHeader">
        <div className="adminHeaderInner">
          <div className="adminBrand">
            <span className="adminCrest">S</span>
            <div className="adminTitle">
              SUNSHINE PUBLIC SCHOOL
              <small>Student & Parent Portal</small>
            </div>
          </div>

          <div className="adminUserInfo">
            <ProfileDropdown userName={student?.name || "Aarav Patel"} userEmail={student?.email || "student@sunshineps.edu.in"} userRole="Student" />
          </div>
        </div>
      </header>

      <main className="adminMain">
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "rgba(255,255,255,0.7)" }}>
            Loading Student Portal...
          </div>
        ) : (
          <>
            {/* Profile Banner */}
            <div
              className="adminContentCard"
              style={{
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1.5rem",
                background: "linear-gradient(135deg, var(--navy-800) 0%, #112d54 100%)",
                borderLeft: "4px solid var(--gold-500)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                <div
                  style={{
                    width: "4.5rem",
                    height: "4.5rem",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid var(--gold-400)",
                    background: "var(--navy-900)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.75rem",
                    color: "var(--gold-400)",
                    fontWeight: 700,
                  }}
                >
                  {student?.name ? student.name.charAt(0) : "S"}
                </div>
                <div>
                  <h2 style={{ fontSize: "1.5rem", color: "#ffffff", marginBottom: "0.25rem" }}>
                    {student?.name}
                  </h2>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>
                    Roll No: <strong style={{ color: "var(--gold-300)" }}>#{student?.rollNumber}</strong> • Class: <strong style={{ color: "var(--gold-300)" }}>{student?.grade} - {student?.section}</strong>
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginTop: "0.25rem" }}>
                    Parent / Guardian: {student?.parentName} ({student?.parentPhone})
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
                {/* Attendance Ring */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "var(--navy-900)", padding: "0.6rem 1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ width: "3rem", height: "3rem", borderRadius: "50%", background: `conic-gradient(var(--gold-500) ${attendance?.percentage || 94}%, rgba(255,255,255,0.1) 0%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: "2.3rem", height: "2.3rem", borderRadius: "50%", background: "var(--navy-900)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, color: "var(--gold-400)" }}>
                      {attendance?.percentage || 94}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "var(--gold-400)", fontWeight: 600 }}>Attendance</div>
                    <div style={{ fontSize: "0.8rem", color: "#fff" }}>{attendance?.presentDays} / {attendance?.totalDays} Days</div>
                  </div>
                </div>

                {/* Pending Fees Alert */}
                <div style={{ background: pendingFeesTotal > 0 ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)", border: `1px solid ${pendingFeesTotal > 0 ? "#ef4444" : "#22c55e"}`, padding: "0.6rem 1rem", borderRadius: "var(--radius-md)", color: pendingFeesTotal > 0 ? "#fca5a5" : "#86efac" }}>
                  <div style={{ fontSize: "0.7rem", textTransform: "uppercase", fontWeight: 700 }}>Fee Balance</div>
                  <div style={{ fontSize: "1rem", fontWeight: 700 }}>₹{pendingFeesTotal.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem", flexWrap: "wrap" }}>
              <button onClick={() => setActiveTab("overview")} style={{ padding: "0.5rem 1rem", background: activeTab === "overview" ? "var(--gold-500)" : "transparent", color: activeTab === "overview" ? "var(--navy-900)" : "#fff", fontWeight: 700, borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer" }}>
                🎓 Academic Overview
              </button>
              <button onClick={() => setActiveTab("attendance")} style={{ padding: "0.5rem 1rem", background: activeTab === "attendance" ? "var(--gold-500)" : "transparent", color: activeTab === "attendance" ? "var(--navy-900)" : "#fff", fontWeight: 700, borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer" }}>
                📅 Attendance Log
              </button>
              <button onClick={() => setActiveTab("fees")} style={{ padding: "0.5rem 1rem", background: activeTab === "fees" ? "var(--gold-500)" : "transparent", color: activeTab === "fees" ? "var(--navy-900)" : "#fff", fontWeight: 700, borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer" }}>
                💳 Fee Management
              </button>
              <button onClick={() => setActiveTab("calendar")} style={{ padding: "0.5rem 1rem", background: activeTab === "calendar" ? "var(--gold-500)" : "transparent", color: activeTab === "calendar" ? "var(--navy-900)" : "#fff", fontWeight: 700, borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer" }}>
                📆 Events Calendar
              </button>
              <button onClick={() => setActiveTab("messages")} style={{ padding: "0.5rem 1rem", background: activeTab === "messages" ? "var(--gold-500)" : "transparent", color: activeTab === "messages" ? "var(--navy-900)" : "#fff", fontWeight: 700, borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer" }}>
                ✉ Teacher Contact
              </button>
            </div>

            {/* TAB 1: ACADEMIC OVERVIEW */}
            {activeTab === "overview" && (
              <>
                {/* Report Card */}
                <div className="adminContentCard" style={{ marginBottom: "2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                      <h2>Digital Report Card</h2>
                      <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>{reportCard?.term || "Term 1 Examination 2026"}</p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--gold-400)", fontWeight: 600 }}>Overall Score</div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "#ffffff", fontWeight: 700 }}>{reportCard?.overallPercentage}%</div>
                      </div>
                      <span style={{ padding: "0.4rem 0.8rem", borderRadius: "var(--radius-sm)", background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.5)", color: "#86efac", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem" }}>
                        {reportCard?.overallGrade}
                      </span>
                    </div>
                  </div>

                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--border-subtle)", textAlign: "left", color: "var(--gold-400)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                          <th style={{ padding: "0.75rem 1rem" }}>Subject</th>
                          <th style={{ padding: "0.75rem 1rem" }}>Marks</th>
                          <th style={{ padding: "0.75rem 1rem" }}>Max Marks</th>
                          <th style={{ padding: "0.75rem 1rem" }}>Grade</th>
                          <th style={{ padding: "0.75rem 1rem" }}>Teacher Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportCard?.results.map((res) => (
                          <tr key={res._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                            <td style={{ padding: "0.875rem 1rem", fontWeight: 600, color: "#ffffff" }}>{res.subject}</td>
                            <td style={{ padding: "0.875rem 1rem", color: "var(--gold-300)", fontWeight: 700 }}>{res.marksObtained}</td>
                            <td style={{ padding: "0.875rem 1rem", color: "rgba(255,255,255,0.6)" }}>{res.totalMarks}</td>
                            <td style={{ padding: "0.875rem 1rem" }}>
                              <span style={{ padding: "0.25rem 0.5rem", borderRadius: "4px", background: "rgba(217,155,38,0.2)", border: "1px solid var(--gold-500)", color: "var(--gold-300)", fontSize: "0.75rem", fontWeight: 700 }}>
                                {res.gradeLetter}
                              </span>
                            </td>
                            <td style={{ padding: "0.875rem 1rem", color: "rgba(255,255,255,0.7)", fontSize: "0.8rem" }}>{res.remarks || "Good performance."}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Timetable & Homework */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "2rem", marginBottom: "2rem" }}>
                  <div className="adminContentCard">
                    <h2>Class Timetable</h2>
                    <div style={{ overflowX: "auto", marginTop: "1rem" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", textAlign: "center" }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--gold-400)", textTransform: "uppercase" }}>
                            <th style={{ padding: "0.6rem 0.5rem" }}>Time</th>
                            <th style={{ padding: "0.6rem 0.5rem" }}>Mon</th>
                            <th style={{ padding: "0.6rem 0.5rem" }}>Tue</th>
                            <th style={{ padding: "0.6rem 0.5rem" }}>Wed</th>
                            <th style={{ padding: "0.6rem 0.5rem" }}>Thu</th>
                            <th style={{ padding: "0.6rem 0.5rem" }}>Fri</th>
                          </tr>
                        </thead>
                        <tbody>
                          {timetable.map((slot, idx) => (
                            <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                              <td style={{ padding: "0.6rem 0.5rem", color: "var(--gold-300)", fontWeight: 600 }}>{slot.time}</td>
                              <td style={{ padding: "0.6rem 0.5rem", color: "#fff" }}>{slot.mon}</td>
                              <td style={{ padding: "0.6rem 0.5rem", color: "#fff" }}>{slot.tue}</td>
                              <td style={{ padding: "0.6rem 0.5rem", color: "#fff" }}>{slot.wed}</td>
                              <td style={{ padding: "0.6rem 0.5rem", color: "#fff" }}>{slot.thu}</td>
                              <td style={{ padding: "0.6rem 0.5rem", color: "#fff" }}>{slot.fri}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="adminContentCard">
                    <h2>Active Homework & Assignments</h2>
                    <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
                      {homework.map((hw) => {
                        const isSubmitted = submittedHwIds[hw._id];
                        return (
                          <div key={hw._id} style={{ padding: "1rem", background: "var(--navy-900)", borderLeft: `3px solid ${isSubmitted ? "#22c55e" : "var(--gold-400)"}`, borderRadius: "var(--radius-sm)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--gold-400)", fontSize: "0.75rem", fontWeight: 600 }}>
                              <span>{hw.subject}</span>
                              <span>Due: {hw.dueDate}</span>
                            </div>
                            <h4 style={{ color: "#ffffff", fontSize: "0.95rem", margin: "0.25rem 0" }}>{hw.title}</h4>
                            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>{hw.description}</p>
                            
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem" }}>
                              {hw.resourceUrl ? (
                                <a href={hw.resourceUrl} target="_blank" rel="noreferrer" style={{ fontSize: "0.75rem", color: "var(--gold-300)", textDecoration: "underline" }}>
                                  📄 Download Resource File
                                </a>
                              ) : <span />}

                              <button
                                type="button"
                                onClick={() => toggleHomeworkSubmitted(hw._id)}
                                style={{
                                  padding: "0.3rem 0.6rem",
                                  fontSize: "0.75rem",
                                  fontWeight: 700,
                                  borderRadius: "4px",
                                  border: "none",
                                  cursor: "pointer",
                                  background: isSubmitted ? "rgba(34,197,94,0.3)" : "var(--gold-500)",
                                  color: isSubmitted ? "#86efac" : "var(--navy-900)",
                                }}
                              >
                                {isSubmitted ? "✓ Submitted" : "Mark as Completed"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: ATTENDANCE LOG */}
            {activeTab === "attendance" && (
              <div className="adminContentCard">
                <h2>Complete Attendance History Log</h2>
                <div style={{ overflowX: "auto", marginTop: "1rem" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border-subtle)", textAlign: "left", color: "var(--gold-400)", textTransform: "uppercase", fontSize: "0.75rem" }}>
                        <th style={{ padding: "0.75rem 1rem" }}>Date</th>
                        <th style={{ padding: "0.75rem 1rem" }}>Status</th>
                        <th style={{ padding: "0.75rem 1rem" }}>Marked By Faculty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance?.records.map((rec) => (
                        <tr key={rec._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                          <td style={{ padding: "0.75rem 1rem", color: "#fff", fontWeight: 600 }}>{rec.date}</td>
                          <td style={{ padding: "0.75rem 1rem" }}>
                            <span style={{ padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", background: rec.status === "present" ? "rgba(34,197,94,0.2)" : rec.status === "late" ? "rgba(234,179,8,0.2)" : "rgba(239,68,68,0.2)", color: rec.status === "present" ? "#86efac" : rec.status === "late" ? "#fef08a" : "#fca5a5" }}>
                              {rec.status}
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem 1rem", color: "rgba(255,255,255,0.7)" }}>{rec.markedBy || "Dr. Ananya Sharma"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: FEE MANAGEMENT */}
            {activeTab === "fees" && (
              <div className="adminContentCard">
                <h2>Fee Invoices & Digital Receipts</h2>
                <div style={{ overflowX: "auto", marginTop: "1rem" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border-subtle)", textAlign: "left", color: "var(--gold-400)", textTransform: "uppercase", fontSize: "0.75rem" }}>
                        <th style={{ padding: "0.75rem 1rem" }}>Invoice Title</th>
                        <th style={{ padding: "0.75rem 1rem" }}>Amount</th>
                        <th style={{ padding: "0.75rem 1rem" }}>Due Date</th>
                        <th style={{ padding: "0.75rem 1rem" }}>Status</th>
                        <th style={{ padding: "0.75rem 1rem" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fees.map((fee) => (
                        <tr key={fee._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                          <td style={{ padding: "0.75rem 1rem", color: "#fff", fontWeight: 600 }}>{fee.title}</td>
                          <td style={{ padding: "0.75rem 1rem", color: "var(--gold-300)", fontWeight: 700 }}>₹{fee.amount.toLocaleString()}</td>
                          <td style={{ padding: "0.75rem 1rem", color: "rgba(255,255,255,0.6)" }}>{fee.dueDate}</td>
                          <td style={{ padding: "0.75rem 1rem" }}>
                            <span style={{ padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", background: fee.status === "paid" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)", color: fee.status === "paid" ? "#86efac" : "#fca5a5" }}>
                              {fee.status}
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem 1rem" }}>
                            {fee.status === "paid" ? (
                              <button onClick={() => setPaidReceipt(fee)} style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", background: "rgba(34,197,94,0.2)", border: "1px solid #22c55e", color: "#86efac", borderRadius: "4px", cursor: "pointer" }}>
                                📄 View Receipt
                              </button>
                            ) : (
                              <button onClick={() => setSelectedFeeForPay(fee)} className="adminSubmitButton" style={{ width: "auto", padding: "0.3rem 0.8rem", fontSize: "0.75rem" }}>
                                💳 Pay Fee Online
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: CALENDAR */}
            {activeTab === "calendar" && (
              <div className="adminContentCard">
                <h2>Academic & Holiday Calendar 2026</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
                  {events.map((ev) => (
                    <div key={ev._id} style={{ padding: "1rem", background: "var(--navy-900)", borderLeft: `3px solid ${ev.type === "holiday" ? "#ef4444" : "var(--gold-400)"}`, borderRadius: "var(--radius-sm)" }}>
                      <div style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "var(--gold-400)", fontWeight: 700 }}>
                        {ev.type} • {ev.startDate}
                      </div>
                      <h4 style={{ color: "#fff", fontSize: "0.95rem", margin: "0.25rem 0" }}>{ev.title}</h4>
                      <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>{ev.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: TEACHER MESSAGING */}
            {activeTab === "messages" && (
              <div className="adminContentCard" style={{ maxWidth: "600px" }}>
                <h2>Contact Class Faculty</h2>
                {sentMsgFeedback && (
                  <div style={{ background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.4)", color: "#86efac", padding: "0.75rem 1rem", borderRadius: "var(--radius-sm)", marginBottom: "1rem" }}>
                    {sentMsgFeedback}
                  </div>
                )}
                <form onSubmit={handleSendMessage} style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
                  <div>
                    <label className="adminLabel">Faculty Teacher Email</label>
                    <input type="email" required value={msgTeacherEmail} onChange={(e) => setMsgTeacherEmail(e.target.value)} className="adminInput" />
                  </div>
                  <div>
                    <label className="adminLabel">Message Subject *</label>
                    <input type="text" required value={msgSubject} onChange={(e) => setMsgSubject(e.target.value)} placeholder="e.g. Inquiry regarding Physics homework" className="adminInput" />
                  </div>
                  <div>
                    <label className="adminLabel">Message Content *</label>
                    <textarea rows={4} required value={msgContent} onChange={(e) => setMsgContent(e.target.value)} placeholder="Write message..." className="adminInput" />
                  </div>
                  <button type="submit" disabled={sendingMsg} className="adminSubmitButton">
                    {sendingMsg ? "Sending..." : "✉ Send Message"}
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </main>

      {/* Online Payment Simulator Modal */}
      {selectedFeeForPay && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", zIndex: 100 }}>
          <div className="adminCard" style={{ width: "100%", maxWidth: "450px" }}>
            <h3 className="adminHeading">Online Fee Gateway</h3>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", margin: "0.5rem 0 1rem" }}>
              Pay fee invoice: <strong>{selectedFeeForPay.title}</strong>
            </p>
            <div style={{ background: "var(--navy-900)", padding: "1rem", borderRadius: "var(--radius-sm)", marginBottom: "1rem", fontSize: "1.25rem", color: "var(--gold-400)", fontWeight: 700 }}>
              Total Payable: ₹{selectedFeeForPay.amount.toLocaleString()}
            </div>

            <form onSubmit={handlePayFee} style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label className="adminLabel">Cardholder / UPI Name</label>
                <input type="text" required defaultValue={student?.parentName || "Suresh Patel"} className="adminInput" />
              </div>
              <div>
                <label className="adminLabel">Simulated Payment Mode</label>
                <select className="adminInput">
                  <option style={{ background: "var(--navy-900)" }}>UPI / NetBanking Instant</option>
                  <option style={{ background: "var(--navy-900)" }}>Credit / Debit Card</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setSelectedFeeForPay(null)} style={{ padding: "0.5rem 1rem", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" disabled={processingPay} className="adminSubmitButton" style={{ width: "auto" }}>
                  {processingPay ? "Processing..." : "Confirm & Pay ₹" + selectedFeeForPay.amount.toLocaleString()}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Digital Receipt Modal */}
      {paidReceipt && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", zIndex: 100 }}>
          <div className="adminCard" style={{ width: "100%", maxWidth: "520px", background: "#ffffff", color: "#07192f" }}>
            <div style={{ textAlign: "center", borderBottom: "2px dashed #07192f", paddingBottom: "1rem", marginBottom: "1rem" }}>
              <strong style={{ fontSize: "1.25rem", color: "#07192f", display: "block" }}>SUNSHINE PUBLIC SCHOOL</strong>
              <small style={{ color: "#d99b26", fontWeight: 700 }}>OFFICIAL FEE PAYMENT RECEIPT</small>
            </div>

            <div style={{ display: "grid", gap: "0.5rem", fontSize: "0.85rem" }}>
              <div><strong>Transaction ID:</strong> {paidReceipt.transactionId || "TXN-2026-88491"}</div>
              <div><strong>Student Name:</strong> {student?.name}</div>
              <div><strong>Class:</strong> {student?.grade} - {student?.section} (Roll #{student?.rollNumber})</div>
              <div><strong>Payment Title:</strong> {paidReceipt.title}</div>
              <div><strong>Paid Amount:</strong> ₹{paidReceipt.amount.toLocaleString()}</div>
              <div><strong>Payment Date:</strong> {paidReceipt.paidDate || new Date().toISOString().split("T")[0]}</div>
              <div><strong>Payment Status:</strong> <span style={{ color: "#22c55e", fontWeight: 700 }}>SUCCESSFUL (PAID)</span></div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem", gap: "0.5rem" }}>
              <button onClick={() => window.print()} style={{ padding: "0.5rem 1rem", background: "#07192f", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: 700 }}>
                🖨 Print Receipt
              </button>
              <button onClick={() => setPaidReceipt(null)} style={{ padding: "0.5rem 1rem", background: "#d99b26", color: "#07192f", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: 700 }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
