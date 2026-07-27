"use client";

import React, { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

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
  records: Array<{ _id: string; date: string; status: string }>;
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
}

interface NoticeItem {
  _id: string;
  title: string;
  content: string;
  category: string;
}

export default function StudentDashboardPage() {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [attendance, setAttendance] = useState<AttendanceStats | null>(null);
  const [reportCard, setReportCard] = useState<ReportCard | null>(null);
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [homework, setHomework] = useState<HomeworkItem[]>([]);
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudentData() {
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
    }
    loadStudentData();
  }, []);

  return (
    <div className="adminShell">
      <header className="adminHeader">
        <div className="adminHeaderInner">
          <div className="adminBrand">
            <span className="adminCrest">S</span>
            <div className="adminTitle">
              SUNSHINE PUBLIC SCHOOL
              <small>Student Portal</small>
            </div>
          </div>

          <div className="adminUserInfo">
            <span>
              Logged in as <strong>{student?.name || "Student"}</strong> ({student?.grade}-{student?.section})
            </span>
            <span className="text-gray-500">•</span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="adminSignOutButton"
            >
              Sign Out
            </button>
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
            {/* Top Profile Banner */}
            <div
              className="adminContentCard"
              style={{
                marginBottom: "2rem",
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

              {/* Attendance Circular Metric */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  background: "var(--navy-900)",
                  padding: "0.75rem 1.25rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div
                  style={{
                    width: "3.5rem",
                    height: "3.5rem",
                    borderRadius: "50%",
                    background: `conic-gradient(var(--gold-500) ${attendance?.percentage || 94}%, rgba(255,255,255,0.1) 0%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: "2.75rem",
                      height: "2.75rem",
                      borderRadius: "50%",
                      background: "var(--navy-900)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "var(--gold-400)",
                    }}
                  >
                    {attendance?.percentage || 94}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--gold-400)", fontWeight: 600 }}>
                    Attendance Rate
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#ffffff" }}>
                    {attendance?.presentDays} / {attendance?.totalDays} Days Attended
                  </div>
                </div>
              </div>
            </div>

            {/* Digital Report Card Section */}
            <div className="adminContentCard" style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h2>Digital Report Card</h2>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>
                    {reportCard?.term || "Term 1 Examination 2026"}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--gold-400)", fontWeight: 600 }}>
                      Overall Percentage
                    </div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "#ffffff", fontWeight: 700 }}>
                      {reportCard?.overallPercentage}%
                    </div>
                  </div>
                  <span
                    style={{
                      padding: "0.4rem 0.8rem",
                      borderRadius: "var(--radius-sm)",
                      background: "rgba(34,197,94,0.2)",
                      border: "1px solid rgba(34,197,94,0.5)",
                      color: "#86efac",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "1.25rem",
                    }}
                  >
                    {reportCard?.overallGrade}
                  </span>
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-subtle)", textAlign: "left", color: "var(--gold-400)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                      <th style={{ padding: "0.75rem 1rem" }}>Subject</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Marks Obtained</th>
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
                        <td style={{ padding: "0.875rem 1rem", color: "rgba(255,255,255,0.7)", fontSize: "0.8rem" }}>
                          {res.remarks || "Good performance."}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Weekly Timetable & Homework Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "2rem", marginBottom: "2rem" }}>
              {/* Weekly Timetable */}
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

              {/* Active Homework Assignments */}
              <div className="adminContentCard">
                <h2>Active Homework</h2>
                <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
                  {homework.map((hw) => (
                    <div
                      key={hw._id}
                      style={{
                        padding: "1rem",
                        background: "var(--navy-900)",
                        borderLeft: "3px solid var(--gold-400)",
                        borderRadius: "var(--radius-sm)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", color: "var(--gold-400)", fontSize: "0.75rem", fontWeight: 600 }}>
                        <span>{hw.subject}</span>
                        <span>Due: {hw.dueDate}</span>
                      </div>
                      <h4 style={{ color: "#ffffff", fontSize: "0.95rem", margin: "0.25rem 0" }}>{hw.title}</h4>
                      <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>{hw.description}</p>
                      <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", marginTop: "0.4rem" }}>
                        Assigned by: {hw.teacherName || "Subject Faculty"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* School Notices */}
            <div className="adminContentCard">
              <h2>School Announcements</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
                {notices.map((n) => (
                  <div
                    key={n._id}
                    style={{
                      padding: "1rem",
                      background: "var(--navy-900)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    <div style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "var(--gold-400)", fontWeight: 600 }}>
                      {n.category}
                    </div>
                    <h4 style={{ color: "#ffffff", fontSize: "0.95rem", margin: "0.25rem 0" }}>{n.title}</h4>
                    <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>{n.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
