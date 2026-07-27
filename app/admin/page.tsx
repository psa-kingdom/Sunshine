import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/db";
import { Student } from "@/db/models/Student";
import { Teacher } from "@/db/models/Teacher";
import { Inquiry } from "@/db/models/Inquiry";
import { Fee } from "@/db/models/Fee";
import { Notice } from "@/db/models/Notice";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    redirect("/login");
  }

  await connectDB();
  const totalStudents = await Student.countDocuments({});
  const totalTeachers = await Teacher.countDocuments({});
  const totalInquiries = await Inquiry.countDocuments({});
  const totalNotices = await Notice.countDocuments({});

  const fees = await Fee.find({}).lean();
  const totalCollected = fees.filter((f) => f.status === "paid").reduce((acc, f) => acc + f.amount, 0);

  return (
    <div className="adminShell">
      <header className="adminHeader">
        <div className="adminHeaderInner">
          <div className="adminBrand">
            <span className="adminCrest">S</span>
            <div className="adminTitle">
              SUNSHINE PUBLIC SCHOOL
              <small>Admin Portal</small>
            </div>
          </div>

          <div className="adminUserInfo">
            <Link href="/admin/students" className="text-xs uppercase tracking-wider font-semibold text-[var(--gold-400)] hover:underline">Students</Link>
            <span className="text-gray-500">•</span>
            <Link href="/admin/teachers" className="text-xs uppercase tracking-wider font-semibold text-[var(--gold-400)] hover:underline">Teachers</Link>
            <span className="text-gray-500">•</span>
            <Link href="/admin/fees" className="text-xs uppercase tracking-wider font-semibold text-[var(--gold-400)] hover:underline">Fees</Link>
            <span className="text-gray-500">•</span>
            <Link href="/admin/notices" className="text-xs uppercase tracking-wider font-semibold text-[var(--gold-400)] hover:underline">Notices</Link>
            <span className="text-gray-500">•</span>
            <Link href="/admin/emails" className="text-xs uppercase tracking-wider font-semibold text-[var(--gold-400)] hover:underline">Emails</Link>
            <span className="text-gray-500">•</span>
            <Link href="/admin/events" className="text-xs uppercase tracking-wider font-semibold text-[var(--gold-400)] hover:underline">Calendar</Link>
            <span className="text-gray-500">•</span>
            <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }); }}>
              <button type="submit" className="adminSignOutButton">Sign Out</button>
            </form>
          </div>
        </div>
      </header>

      <main className="adminMain">
        {/* Banner */}
        <div className="adminContentCard" style={{ marginBottom: "2rem" }}>
          <h2>System Control Dashboard</h2>
          <p>
            Welcome to the Sunshine Public School management console. Select an administrative module below to manage enrolled students, faculty members, fee collection, email broadcasts, notices, and academic events.
          </p>
        </div>

        {/* Overview Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
          <div className="adminContentCard" style={{ padding: "1.25rem" }}>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--gold-400)", fontWeight: 600 }}>Enrolled Students</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "#ffffff", fontWeight: 700, margin: "0.25rem 0" }}>{totalStudents}</div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>Active Students</div>
          </div>

          <div className="adminContentCard" style={{ padding: "1.25rem" }}>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--gold-400)", fontWeight: 600 }}>Faculty Members</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "#ffffff", fontWeight: 700, margin: "0.25rem 0" }}>{totalTeachers}</div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>Teaching Staff</div>
          </div>

          <div className="adminContentCard" style={{ padding: "1.25rem" }}>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--gold-400)", fontWeight: 600 }}>Fees Collected</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "#86efac", fontWeight: 700, margin: "0.25rem 0" }}>₹{totalCollected.toLocaleString()}</div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>Collected Invoices</div>
          </div>

          <div className="adminContentCard" style={{ padding: "1.25rem" }}>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--gold-400)", fontWeight: 600 }}>Published Notices</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "#ffffff", fontWeight: 700, margin: "0.25rem 0" }}>{totalNotices}</div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>Active Announcements</div>
          </div>
        </div>

        {/* Modules Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          <Link href="/admin/fees" style={{ textDecoration: "none" }}>
            <div className="adminContentCard" style={{ cursor: "pointer", height: "100%" }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold-400)", fontWeight: 600, marginBottom: "0.5rem" }}>Accounts</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#ffffff", marginBottom: "0.5rem" }}>Fee Management →</h3>
              <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>Audit fee collections, check paid & pending history, issue class invoices, and dispatch payment reminders.</p>
            </div>
          </Link>

          <Link href="/admin/notices" style={{ textDecoration: "none" }}>
            <div className="adminContentCard" style={{ cursor: "pointer", height: "100%" }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold-400)", fontWeight: 600, marginBottom: "0.5rem" }}>Announcements</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#ffffff", marginBottom: "0.5rem" }}>Notice Manager →</h3>
              <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>Publish school announcements, filter target audiences, and pin important notices to the homepage.</p>
            </div>
          </Link>

          <Link href="/admin/emails" style={{ textDecoration: "none" }}>
            <div className="adminContentCard" style={{ cursor: "pointer", height: "100%" }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold-400)", fontWeight: 600, marginBottom: "0.5rem" }}>Communication</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#ffffff", marginBottom: "0.5rem" }}>Email Broadcasts →</h3>
              <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>Send class-wise email broadcasts, faculty notifications, and parent alerts.</p>
            </div>
          </Link>

          <Link href="/admin/events" style={{ textDecoration: "none" }}>
            <div className="adminContentCard" style={{ cursor: "pointer", height: "100%" }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold-400)", fontWeight: 600, marginBottom: "0.5rem" }}>Academic Calendar</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#ffffff", marginBottom: "0.5rem" }}>Events & Holidays →</h3>
              <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>Manage school events, national holiday schedules, exam dates, and sports meets.</p>
            </div>
          </Link>

          <Link href="/admin/students" style={{ textDecoration: "none" }}>
            <div className="adminContentCard" style={{ cursor: "pointer", height: "100%" }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold-400)", fontWeight: 600, marginBottom: "0.5rem" }}>Directory</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#ffffff", marginBottom: "0.5rem" }}>Student Directory →</h3>
              <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>View student profiles, roll numbers, class sections, parent contact info, and register new students.</p>
            </div>
          </Link>

          <Link href="/admin/teachers" style={{ textDecoration: "none" }}>
            <div className="adminContentCard" style={{ cursor: "pointer", height: "100%" }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold-400)", fontWeight: 600, marginBottom: "0.5rem" }}>Faculty</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#ffffff", marginBottom: "0.5rem" }}>Faculty Directory →</h3>
              <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>Manage teaching staff, department assignments, employee IDs, and class teacher responsibilities.</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
