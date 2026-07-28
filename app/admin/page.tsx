import Link from "next/link";
import { connectDB } from "@/db";
import { Student } from "@/db/models/Student";
import { Teacher } from "@/db/models/Teacher";
import { Inquiry } from "@/db/models/Inquiry";
import { Fee } from "@/db/models/Fee";
import { Notice } from "@/db/models/Notice";
import AdminStatCard from "@/components/admin/AdminStatCard";

export default async function AdminDashboardPage() {
  await connectDB();

  // Parallel data fetching for performance
  const [
    totalStudents,
    totalTeachers,
    totalInquiries,
    totalNotices,
    feeAgg,
  ] = await Promise.all([
    Student.countDocuments({}),
    Teacher.countDocuments({}),
    Inquiry.countDocuments({}),
    Notice.countDocuments({}),
    Fee.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, totalCollected: { $sum: "$amount" } } },
    ]),
  ]);

  const totalCollected = feeAgg.length > 0 ? feeAgg[0].totalCollected : 0;

  return (
    <main className="adminMain">
      {/* Banner */}
      <div className="adminContentCard" style={{ marginBottom: "2rem" }}>
        <h2>System Control Dashboard</h2>
        <p>
          Welcome to the Sunshine Public School management console. Select an administrative module below to manage enrolled students, faculty members, fee collection, email broadcasts, notices, and academic events.
        </p>
      </div>

      {/* Overview Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <AdminStatCard
          label="Enrolled Students"
          value={totalStudents}
          subtext="Active Students"
        />
        <AdminStatCard
          label="Faculty Members"
          value={totalTeachers}
          subtext="Teaching Staff"
        />
        <AdminStatCard
          label="Fees Collected"
          value={`₹${totalCollected.toLocaleString()}`}
          subtext="Collected Invoices"
          valueColor="#86efac"
        />
        <AdminStatCard
          label="Published Notices"
          value={totalNotices}
          subtext="Active Announcements"
        />
      </div>

      {/* Modules Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        <Link href="/admin/fees" style={{ textDecoration: "none" }}>
          <div className="adminContentCard" style={{ cursor: "pointer", height: "100%" }}>
            <div
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--gold-400)",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              Accounts
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#ffffff", marginBottom: "0.5rem" }}>
              Fee Management →
            </h3>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>
              Audit fee collections, check paid & pending history, issue class invoices, and dispatch payment reminders.
            </p>
          </div>
        </Link>

        <Link href="/admin/notices" style={{ textDecoration: "none" }}>
          <div className="adminContentCard" style={{ cursor: "pointer", height: "100%" }}>
            <div
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--gold-400)",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              Announcements
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#ffffff", marginBottom: "0.5rem" }}>
              Notice Manager →
            </h3>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>
              Publish school announcements, filter target audiences, and pin important notices to the homepage.
            </p>
          </div>
        </Link>

        <Link href="/admin/emails" style={{ textDecoration: "none" }}>
          <div className="adminContentCard" style={{ cursor: "pointer", height: "100%" }}>
            <div
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--gold-400)",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              Communication
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#ffffff", marginBottom: "0.5rem" }}>
              Email Broadcasts →
            </h3>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>
              Send class-wise email broadcasts, faculty notifications, and parent alerts.
            </p>
          </div>
        </Link>

        <Link href="/admin/events" style={{ textDecoration: "none" }}>
          <div className="adminContentCard" style={{ cursor: "pointer", height: "100%" }}>
            <div
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--gold-400)",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              Academic Calendar
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#ffffff", marginBottom: "0.5rem" }}>
              Events & Holidays →
            </h3>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>
              Manage school events, national holiday schedules, exam dates, and sports meets.
            </p>
          </div>
        </Link>

        <Link href="/admin/students" style={{ textDecoration: "none" }}>
          <div className="adminContentCard" style={{ cursor: "pointer", height: "100%" }}>
            <div
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--gold-400)",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              Directory
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#ffffff", marginBottom: "0.5rem" }}>
              Student Directory →
            </h3>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>
              View student profiles, roll numbers, class sections, parent contact info, and register new students.
            </p>
          </div>
        </Link>

        <Link href="/admin/teachers" style={{ textDecoration: "none" }}>
          <div className="adminContentCard" style={{ cursor: "pointer", height: "100%" }}>
            <div
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--gold-400)",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              Faculty
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#ffffff", marginBottom: "0.5rem" }}>
              Faculty Directory →
            </h3>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>
              Manage teaching staff, department assignments, employee IDs, and class teacher responsibilities.
            </p>
          </div>
        </Link>
      </div>
    </main>
  );
}
