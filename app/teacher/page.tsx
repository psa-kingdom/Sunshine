"use client";

import React, { useEffect, useState } from "react";
import ProfileDropdown from "@/components/kokonutui/profile-dropdown";
import BrandLogo from "@/components/ui/BrandLogo";
import ThemeToggle from "@/components/theme/ThemeToggle";

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
  grade: string;
  section: string;
  parentName: string;
  parentPhone: string;
}

interface ClassItem {
  time: string;
  subject: string;
  gradeSection: string;
  room: string;
  meetLink?: string;
}

interface HomeworkItem {
  _id: string;
  title: string;
  subject: string;
  dueDate: string;
  description: string;
  resourceUrl?: string;
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
  const [activeTab, setActiveTab] = useState<"dashboard" | "gradebook" | "messages">("dashboard");

  // Attendance state
  const [attendanceDate, setAttendanceDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceMap, setAttendanceMap] = useState<Record<string, "present" | "absent" | "late">>({});
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [attendanceMsg, setAttendanceMsg] = useState("");

  // Gradebook State
  const [selectedStudentForMarks, setSelectedStudentForMarks] = useState<string>("");
  const [marksSubject, setMarksSubject] = useState("Physics");
  const [marksObtained, setMarksObtained] = useState("");
  const [totalMarks, setTotalMarks] = useState("100");
  const [marksRemarks, setMarksRemarks] = useState("");
  const [savingMarks, setSavingMarks] = useState(false);
  const [marksSuccessMsg, setMarksSuccessMsg] = useState("");

  // Student Profile Inspector Drawer State
  const [inspectedStudent, setInspectedStudent] = useState<StudentItem | null>(null);

  // Homework creation state
  const [showHomeworkModal, setShowHomeworkModal] = useState(false);
  const [hwTitle, setHwTitle] = useState("");
  const [hwSubject, setHwSubject] = useState("Physics");
  const [hwDesc, setHwDesc] = useState("");
  const [hwDueDate, setHwDueDate] = useState("");
  const [hwResourceUrl, setHwResourceUrl] = useState("");
  const [creatingHw, setCreatingHw] = useState(false);

  // Message Form State
  const [msgRecipientEmail, setMsgRecipientEmail] = useState("");
  const [msgSubject, setMsgSubject] = useState("");
  const [msgContent, setMsgContent] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [sentMsgFeedback, setSentMsgFeedback] = useState("");

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

      if (data.students && data.students.length > 0) {
        setSelectedStudentForMarks(data.students[0]._id);
        const initialMap: Record<string, "present" | "absent" | "late"> = {};
        data.students.forEach((s: StudentItem) => {
          initialMap[s._id] = "present";
        });
        setAttendanceMap(initialMap);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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

      if (res.ok) {
        setAttendanceMsg("✓ Class attendance saved successfully!");
        setTimeout(() => setAttendanceMsg(""), 4000);
      } else {
        alert("Failed to save attendance");
      }
    } catch {
      alert("Error saving attendance");
    } finally {
      setSavingAttendance(false);
    }
  };

  const handleSaveMarks = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingMarks(true);
    setMarksSuccessMsg("");
    try {
      const res = await fetch("/api/teacher/gradebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudentForMarks,
          subject: marksSubject,
          marksObtained: Number(marksObtained),
          totalMarks: Number(totalMarks),
          remarks: marksRemarks,
        }),
      });

      if (res.ok) {
        setMarksObtained("");
        setMarksRemarks("");
        setMarksSuccessMsg("✓ Student marks updated in Gradebook!");
        setTimeout(() => setMarksSuccessMsg(""), 4000);
      } else {
        alert("Failed to save marks");
      }
    } catch {
      alert("Error saving marks");
    } finally {
      setSavingMarks(false);
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
          resourceUrl: hwResourceUrl,
        }),
      });

      if (res.ok) {
        setHwTitle("");
        setHwDesc("");
        setHwDueDate("");
        setHwResourceUrl("");
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingMsg(true);
    setSentMsgFeedback("");
    try {
      const res = await fetch("/api/student/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail: msgRecipientEmail,
          subject: msgSubject,
          content: msgContent,
        }),
      });

      if (res.ok) {
        setMsgSubject("");
        setMsgContent("");
        setSentMsgFeedback("✓ Message sent successfully to recipient.");
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
            <BrandLogo height={46} />
          </div>

          <div className="adminUserInfo" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <ThemeToggle />
            <ProfileDropdown userName={teacher?.name || "Dr. Ananya Sharma"} userEmail={teacher?.email || "teacher@sunshineps.edu.in"} userRole="Teacher" />
          </div>
        </div>
      </header>

      <main className="adminMain">
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "rgba(255,255,255,0.7)" }}>
            Loading Faculty Portal...
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
                    Welcome, {teacher?.name}
                  </h2>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>
                    {teacher?.department} • Class Teacher: <strong style={{ color: "var(--gold-300)" }}>{teacher?.assignedClass}</strong>
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <a
                  href="https://meet.google.com/new"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: "0.6rem 1.25rem",
                    background: "rgba(34,197,94,0.2)",
                    border: "1px solid #22c55e",
                    color: "#86efac",
                    borderRadius: "var(--radius-sm)",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  📹 Launch Live Google Meet Class
                </a>
                <button
                  onClick={() => setShowHomeworkModal(true)}
                  className="adminSubmitButton"
                  style={{ width: "auto", padding: "0.6rem 1.25rem" }}
                >
                  + Create Assignment
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem" }}>
              <button
                onClick={() => setActiveTab("dashboard")}
                style={{
                  padding: "0.5rem 1rem",
                  background: activeTab === "dashboard" ? "var(--gold-500)" : "transparent",
                  color: activeTab === "dashboard" ? "var(--navy-900)" : "#fff",
                  fontWeight: 700,
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                📊 Class Overview & Attendance
              </button>
              <button
                onClick={() => setActiveTab("gradebook")}
                style={{
                  padding: "0.5rem 1rem",
                  background: activeTab === "gradebook" ? "var(--gold-500)" : "transparent",
                  color: activeTab === "gradebook" ? "var(--navy-900)" : "#fff",
                  fontWeight: 700,
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                📝 Gradebook & Marks Entry
              </button>
              <button
                onClick={() => setActiveTab("messages")}
                style={{
                  padding: "0.5rem 1rem",
                  background: activeTab === "messages" ? "var(--gold-500)" : "transparent",
                  color: activeTab === "messages" ? "var(--navy-900)" : "#fff",
                  fontWeight: 700,
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                💬 Communication Center
              </button>
            </div>

            {/* TAB 1: DASHBOARD & ATTENDANCE */}
            {activeTab === "dashboard" && (
              <>
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
                        onChange={(e) => setAttendanceDate(e.target.value)}
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
                              <strong
                                onClick={() => setInspectedStudent(student)}
                                style={{ color: "var(--gold-300)", fontSize: "0.875rem", display: "block", cursor: "pointer", textDecoration: "underline" }}
                              >
                                {student.name}
                              </strong>
                              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>
                                Roll No: #{student.rollNumber}
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
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.25rem" }}>
                            <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>{c.gradeSection}</span>
                            <a
                              href="https://meet.google.com/new"
                              target="_blank"
                              rel="noreferrer"
                              style={{ fontSize: "0.75rem", color: "#86efac", fontWeight: 600, textDecoration: "underline" }}
                            >
                              📹 Join Virtual Room
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Homework & Notices */}
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
                    <h2>School Announcements</h2>
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

            {/* TAB 2: GRADEBOOK & MARKS ENTRY */}
            {activeTab === "gradebook" && (
              <div className="adminContentCard" style={{ maxWidth: "650px" }}>
                <h2>Gradebook & Exam Assessment Entry</h2>
                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "1.25rem" }}>
                  Record student examination marks, generate total percentages, and issue report card letter grades.
                </p>

                {marksSuccessMsg && (
                  <div style={{ background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.4)", color: "#86efac", padding: "0.75rem 1rem", borderRadius: "var(--radius-sm)", marginBottom: "1rem" }}>
                    {marksSuccessMsg}
                  </div>
                )}

                <form onSubmit={handleSaveMarks} style={{ display: "grid", gap: "1rem" }}>
                  <div>
                    <label className="adminLabel">Select Student *</label>
                    <select
                      value={selectedStudentForMarks}
                      onChange={(e) => setSelectedStudentForMarks(e.target.value)}
                      className="adminInput"
                    >
                      {students.map((s) => (
                        <option key={s._id} value={s._id} style={{ background: "var(--navy-900)" }}>
                          #{s.rollNumber} - {s.name} ({s.grade}-{s.section})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label className="adminLabel">Subject *</label>
                      <input
                        type="text"
                        required
                        value={marksSubject}
                        onChange={(e) => setMarksSubject(e.target.value)}
                        className="adminInput"
                      />
                    </div>
                    <div>
                      <label className="adminLabel">Marks Obtained *</label>
                      <input
                        type="number"
                        required
                        value={marksObtained}
                        onChange={(e) => setMarksObtained(e.target.value)}
                        placeholder="95"
                        className="adminInput"
                      />
                    </div>
                    <div>
                      <label className="adminLabel">Total Max Marks *</label>
                      <input
                        type="number"
                        required
                        value={totalMarks}
                        onChange={(e) => setTotalMarks(e.target.value)}
                        className="adminInput"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="adminLabel">Teacher Remarks</label>
                    <textarea
                      rows={3}
                      value={marksRemarks}
                      onChange={(e) => setMarksRemarks(e.target.value)}
                      placeholder="e.g. Excellent analytical skills and practical lab performance."
                      className="adminInput"
                    />
                  </div>

                  <button type="submit" disabled={savingMarks} className="adminSubmitButton">
                    {savingMarks ? "Saving Marks..." : "Save Student Grade"}
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: MESSAGES */}
            {activeTab === "messages" && (
              <div className="adminContentCard" style={{ maxWidth: "650px" }}>
                <h2>Send Direct Message / Announcement</h2>
                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "1.25rem" }}>
                  Communicate directly with class students or parent guardians.
                </p>

                {sentMsgFeedback && (
                  <div style={{ background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.4)", color: "#86efac", padding: "0.75rem 1rem", borderRadius: "var(--radius-sm)", marginBottom: "1rem" }}>
                    {sentMsgFeedback}
                  </div>
                )}

                <form onSubmit={handleSendMessage} style={{ display: "grid", gap: "1rem" }}>
                  <div>
                    <label className="adminLabel">Recipient Student Email *</label>
                    <input
                      type="email"
                      required
                      value={msgRecipientEmail}
                      onChange={(e) => setMsgRecipientEmail(e.target.value)}
                      placeholder="student@sunshineps.edu.in"
                      className="adminInput"
                    />
                  </div>

                  <div>
                    <label className="adminLabel">Subject *</label>
                    <input
                      type="text"
                      required
                      value={msgSubject}
                      onChange={(e) => setMsgSubject(e.target.value)}
                      placeholder="e.g. Physics Lab Project Guidance"
                      className="adminInput"
                    />
                  </div>

                  <div>
                    <label className="adminLabel">Message Content *</label>
                    <textarea
                      rows={4}
                      required
                      value={msgContent}
                      onChange={(e) => setMsgContent(e.target.value)}
                      placeholder="Write message..."
                      className="adminInput"
                    />
                  </div>

                  <button type="submit" disabled={sendingMsg} className="adminSubmitButton">
                    {sendingMsg ? "Sending Message..." : "✉ Send Message"}
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </main>

      {/* Student Inspector Modal */}
      {inspectedStudent && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", zIndex: 100 }}>
          <div className="adminCard" style={{ width: "100%", maxWidth: "480px" }}>
            <h3 className="adminHeading">Student Biodata Profile</h3>
            <div style={{ display: "grid", gap: "0.75rem", fontSize: "0.9rem", color: "#ffffff", marginTop: "1rem" }}>
              <div><strong>Name:</strong> {inspectedStudent.name}</div>
              <div><strong>Roll Number:</strong> #{inspectedStudent.rollNumber}</div>
              <div><strong>Class:</strong> {inspectedStudent.grade} - {inspectedStudent.section}</div>
              <div><strong>Email:</strong> {inspectedStudent.email}</div>
              <div><strong>Parent Guardian:</strong> {inspectedStudent.parentName} ({inspectedStudent.parentPhone})</div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}>
              <button
                type="button"
                onClick={() => setInspectedStudent(null)}
                className="adminSubmitButton"
                style={{ width: "auto" }}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Homework Creation Modal */}
      {showHomeworkModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", zIndex: 100 }}>
          <div className="adminCard" style={{ width: "100%", maxWidth: "500px" }}>
            <h3 className="adminHeading">Create Homework Assignment</h3>
            <form onSubmit={handleCreateHomework} style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label className="adminLabel">Assignment Title *</label>
                <input type="text" required value={hwTitle} onChange={(e) => setHwTitle(e.target.value)} placeholder="e.g. Optics Lab Report" className="adminInput" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="adminLabel">Subject *</label>
                  <input type="text" required value={hwSubject} onChange={(e) => setHwSubject(e.target.value)} className="adminInput" />
                </div>
                <div>
                  <label className="adminLabel">Due Date *</label>
                  <input type="date" required value={hwDueDate} onChange={(e) => setHwDueDate(e.target.value)} className="adminInput" />
                </div>
              </div>

              <div>
                <label className="adminLabel">Study Material Resource URL (PDF/Link)</label>
                <input type="url" value={hwResourceUrl} onChange={(e) => setHwResourceUrl(e.target.value)} placeholder="https://..." className="adminInput" />
              </div>

              <div>
                <label className="adminLabel">Instructions / Description *</label>
                <textarea rows={3} required value={hwDesc} onChange={(e) => setHwDesc(e.target.value)} placeholder="Details..." className="adminInput" />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setShowHomeworkModal(false)} style={{ padding: "0.5rem 1rem", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" disabled={creatingHw} className="adminSubmitButton" style={{ width: "auto" }}>
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
