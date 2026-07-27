"use client";

import React, { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

interface TeacherProfile {
  name: string;
  email: string;
  employeeId: string;
  department: string;
  assignedClass: string;
  avatarUrl?: string;
}

interface StudentItem {
  _id: string;
  name: string;
  rollNumber: string;
  email: string;
}

interface ClassItem {
  time: string;
  subject: string;
  gradeSection: string;
  room: string;
}

interface HomeworkItem {
  _id: string;
  title: string;
  subject: string;
  dueDate: string;
  description: string;
}

interface NoticeItem {
  _id: string;
  title: string;
  content: string;
  category: string;
}

export default function TeacherDashboardPage() {
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [homework, setHomework] = useState<HomeworkItem[]>([]);
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Attendance state
  const [attendanceDate, setAttendanceDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceMap, setAttendanceMap] = useState<Record<string, "present" | "absent" | "late">>({});
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [attendanceMsg, setAttendanceMsg] = useState("");

  // Homework creation state
  const [showHomeworkModal, setShowHomeworkModal] = useState(false);
  const [hwTitle, setHwTitle] = useState("");
  const [hwSubject, setHwSubject] = useState("Physics");
  const [hwDesc, setHwDesc] = useState("");
  const [hwDueDate, setHwDueDate] = useState("");
  const [creatingHw, setCreatingHw] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/teacher/dashboard");
      if (!res.ok) throw new Error("Failed to load dashboard");
      const data = await res.json();
      setTeacher(data.teacher);
      setStudents(data.students || []);
      setClasses(data.todayClasses || []);
      setHomework(data.homeworkList || []);
      setNotices(data.notices || []);

      // Initialize default attendance map
      const initialMap: Record<string, "present" | "absent" | "late"> = {};
      (data.students || []).forEach((s: StudentItem) => {
        initialMap[s._id] = "present";
      });
      setAttendanceMap(initialMap);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceForDate = async (dateStr: string) => {
    try {
      const res = await fetch(`/api/teacher/attendance?date=${dateStr}&grade=Grade X&section=A`);
      if (res.ok) {
        const data = await res.json();
        if (data.attendanceMap && Object.keys(data.attendanceMap).length > 0) {
          setAttendanceMap(data.attendanceMap);
        } else {
          // Default all to present if no record exists for this date
          const defaultMap: Record<string, "present" | "absent" | "late"> = {};
          students.forEach((s) => {
            defaultMap[s._id] = "present";
          });
          setAttendanceMap(defaultMap);
        }
      }
    } catch {
      console.error("Failed to load date attendance");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDateChange = (newDate: string) => {
    setAttendanceDate(newDate);
    fetchAttendanceForDate(newDate);
  };

  const handleAttendanceToggle = (studentId: string, status: "present" | "absent" | "late") => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSaveAttendance = async () => {
    setSavingAttendance(true);
    setAttendanceMsg("");

    const records = Object.keys(attendanceMap).map((studentId) => ({
      studentId,
      status: attendanceMap[studentId],
    }));

    try {
      const res = await fetch("/api/teacher/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: attendanceDate,
          grade: teacher?.assignedClass?.split("-")[0] || "Grade X",
          section: teacher?.assignedClass?.split("-")[1] || "A",
          records,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setAttendanceMsg("✓ Attendance saved successfully!");
        setTimeout(() => setAttendanceMsg(""), 4000);
      } else {
        alert(data.error || "Failed to save attendance");
      }
    } catch {
      alert("Error saving attendance");
    } finally {
      setSavingAttendance(false);
    }
  };

  const handleCreateHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingHw(true);
    try {
      const res = await fetch("/api/teacher/homework", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: hwTitle,
          subject: hwSubject,
          grade: teacher?.assignedClass?.split("-")[0] || "Grade X",
          section: teacher?.assignedClass?.split("-")[1] || "A",
          description: hwDesc,
          dueDate: hwDueDate,
        }),
      });

      if (res.ok) {
        setHwTitle("");
        setHwDesc("");
        setHwDueDate("");
        setShowHomeworkModal(false);
        fetchDashboardData();
      } else {
        alert("Failed to create homework");
      }
    } catch {
      alert("Error creating homework");
    } finally {
      setCreatingHw(false);
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
              <small>Teacher Portal</small>
            </div>
          </div>

          <div className="adminUserInfo">
            <span>
              Logged in as <strong>{teacher?.name || "Teacher"}</strong> ({teacher?.employeeId || "Staff"})
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
            Loading Teacher Portal...
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
                background: "linear-gradient(135deg, var(--navy-800) 0%, #0d274c 100%)",
                borderLeft: "4px solid var(--gold-500)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                <div
                  style={{
                    width: "4rem",
                    height: "4rem",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid var(--gold-400)",
                    background: "var(--navy-900)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    color: "var(--gold-400)",
                    fontWeight: 700,
                  }}
                >
                  {teacher?.name ? teacher.name.charAt(0) : "T"}
                </div>
                <div>
                  <h2 style={{ fontSize: "1.5rem", color: "#ffffff", marginBottom: "0.25rem" }}>
                    Welcome back, {teacher?.name}!
                  </h2>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>
                    {teacher?.department} • Assigned Class: <strong style={{ color: "var(--gold-300)" }}>{teacher?.assignedClass}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowHomeworkModal(true)}
                className="adminSubmitButton"
                style={{ width: "auto", padding: "0.6rem 1.25rem" }}
              >
                + Create Homework
              </button>
            </div>

            {/* Overview Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
              <div className="adminContentCard" style={{ padding: "1.25rem" }}>
                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--gold-400)", fontWeight: 600 }}>
                  Assigned Students
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "#ffffff", fontWeight: 700, margin: "0.25rem 0" }}>
                  {students.length}
                </div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>Class {teacher?.assignedClass}</div>
              </div>

              <div className="adminContentCard" style={{ padding: "1.25rem" }}>
                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--gold-400)", fontWeight: 600 }}>
                  Today&apos;s Classes
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "#ffffff", fontWeight: 700, margin: "0.25rem 0" }}>
                  {classes.length}
                </div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>Scheduled Sessions</div>
              </div>

              <div className="adminContentCard" style={{ padding: "1.25rem" }}>
                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--gold-400)", fontWeight: 600 }}>
                  Active Homework
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "#ffffff", fontWeight: 700, margin: "0.25rem 0" }}>
                  {homework.length}
                </div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>Assignments Assigned</div>
              </div>
            </div>

            {/* Main Interactive Grid: Attendance & Schedule */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "2rem", marginBottom: "2rem" }}>
              {/* Daily Attendance Marker Module */}
              <div className="adminContentCard">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
                  <div>
                    <h2>Mark Class Attendance</h2>
                    <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>
                      Class: {teacher?.assignedClass}
                    </p>
                  </div>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="adminInput"
                    style={{ width: "auto", padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                  />
                </div>

                {attendanceMsg && (
                  <div style={{ background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.4)", color: "#86efac", padding: "0.5rem 0.75rem", borderRadius: "var(--radius-sm)", marginBottom: "1rem", fontSize: "0.8rem" }}>
                    {attendanceMsg}
                  </div>
                )}

                <div style={{ display: "grid", gap: "0.75rem", maxHeight: "360px", overflowY: "auto", paddingRight: "0.5rem" }}>
                  {students.map((student) => {
                    const status = attendanceMap[student._id] || "present";
                    return (
                      <div
                        key={student._id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0.75rem 1rem",
                          background: "var(--navy-900)",
                          border: "1px solid var(--border-subtle)",
                          borderRadius: "var(--radius-sm)",
                        }}
                      >
                        <div>
                          <strong style={{ color: "#ffffff", fontSize: "0.875rem", display: "block" }}>
                            {student.name}
                          </strong>
                          <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>
                            Roll No: {student.rollNumber}
                          </span>
                        </div>

                        <div style={{ display: "flex", gap: "0.25rem" }}>
                          <button
                            type="button"
                            onClick={() => handleAttendanceToggle(student._id, "present")}
                            style={{
                              padding: "0.3rem 0.6rem",
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              borderRadius: "4px",
                              border: "1px solid",
                              cursor: "pointer",
                              background: status === "present" ? "rgba(34,197,94,0.3)" : "transparent",
                              borderColor: status === "present" ? "#22c55e" : "rgba(255,255,255,0.2)",
                              color: status === "present" ? "#86efac" : "rgba(255,255,255,0.6)",
                            }}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAttendanceToggle(student._id, "absent")}
                            style={{
                              padding: "0.3rem 0.6rem",
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              borderRadius: "4px",
                              border: "1px solid",
                              cursor: "pointer",
                              background: status === "absent" ? "rgba(239,68,68,0.3)" : "transparent",
                              borderColor: status === "absent" ? "#ef4444" : "rgba(255,255,255,0.2)",
                              color: status === "absent" ? "#fca5a5" : "rgba(255,255,255,0.6)",
                            }}
                          >
                            Absent
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAttendanceToggle(student._id, "late")}
                            style={{
                              padding: "0.3rem 0.6rem",
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              borderRadius: "4px",
                              border: "1px solid",
                              cursor: "pointer",
                              background: status === "late" ? "rgba(234,179,8,0.3)" : "transparent",
                              borderColor: status === "late" ? "#eab308" : "rgba(255,255,255,0.2)",
                              color: status === "late" ? "#fef08a" : "rgba(255,255,255,0.6)",
                            }}
                          >
                            Late
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  disabled={savingAttendance}
                  onClick={handleSaveAttendance}
                  className="adminSubmitButton"
                  style={{ width: "100%", marginTop: "1.25rem" }}
                >
                  {savingAttendance ? "Saving Attendance..." : "Save Class Attendance"}
                </button>
              </div>

              {/* Today's Class Schedule */}
              <div className="adminContentCard">
                <h2>Today&apos;s Class Schedule</h2>
                <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
                  {classes.map((c, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "1rem",
                        background: "var(--navy-900)",
                        borderLeft: "3px solid var(--gold-400)",
                        borderRadius: "var(--radius-sm)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", color: "var(--gold-300)", fontSize: "0.75rem", fontWeight: 600 }}>
                        <span>{c.time}</span>
                        <span>{c.room}</span>
                      </div>
                      <h4 style={{ color: "#ffffff", fontSize: "1rem", margin: "0.25rem 0" }}>{c.subject}</h4>
                      <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>{c.gradeSection}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Homework & Notices Section */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
              <div className="adminContentCard">
                <h2>Assigned Homework</h2>
                <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
                  {homework.map((hw) => (
                    <div
                      key={hw._id}
                      style={{
                        padding: "1rem",
                        background: "var(--navy-900)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-sm)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", color: "var(--gold-400)", fontSize: "0.75rem", fontWeight: 600 }}>
                        <span>{hw.subject}</span>
                        <span>Due: {hw.dueDate}</span>
                      </div>
                      <h4 style={{ color: "#ffffff", fontSize: "0.95rem", margin: "0.25rem 0" }}>{hw.title}</h4>
                      <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>{hw.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="adminContentCard">
                <h2>School Notices</h2>
                <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
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
            </div>
          </>
        )}
      </main>

      {/* Homework Creation Modal */}
      {showHomeworkModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", zIndex: 100 }}>
          <div className="adminCard" style={{ width: "100%", maxWidth: "500px" }}>
            <h3 className="adminHeading">Create Homework Assignment</h3>
            <form onSubmit={handleCreateHomework} style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label className="adminLabel">Assignment Title *</label>
                <input
                  type="text"
                  required
                  value={hwTitle}
                  onChange={(e) => setHwTitle(e.target.value)}
                  placeholder="e.g. Thermodynamics Numericals"
                  className="adminInput"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="adminLabel">Subject *</label>
                  <input
                    type="text"
                    required
                    value={hwSubject}
                    onChange={(e) => setHwSubject(e.target.value)}
                    className="adminInput"
                  />
                </div>

                <div>
                  <label className="adminLabel">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={hwDueDate}
                    onChange={(e) => setHwDueDate(e.target.value)}
                    className="adminInput"
                  />
                </div>
              </div>

              <div>
                <label className="adminLabel">Instructions / Description *</label>
                <textarea
                  rows={3}
                  required
                  value={hwDesc}
                  onChange={(e) => setHwDesc(e.target.value)}
                  placeholder="Details for students..."
                  className="adminInput"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowHomeworkModal(false)}
                  style={{ padding: "0.5rem 1rem", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: "var(--radius-sm)", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingHw}
                  className="adminSubmitButton"
                  style={{ width: "auto" }}
                >
                  {creatingHw ? "Assigning..." : "Assign Homework"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
