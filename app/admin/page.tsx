import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/db";
import { Student } from "@/db/models/Student";
import { Teacher } from "@/db/models/Teacher";
import { Inquiry } from "@/db/models/Inquiry";
import { MediaItem } from "@/db/models/MediaItem";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    redirect("/login");
  }

  await connectDB();
  const totalStudents = await Student.countDocuments({});
  const totalTeachers = await Teacher.countDocuments({});
  const totalInquiries = await Inquiry.countDocuments({});
  const totalMedia = await MediaItem.countDocuments({});

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
            <Link
              href="/admin/students"
              className="text-xs uppercase tracking-wider font-semibold text-[var(--gold-400)] hover:underline"
            >
              Students
            </Link>
            <span className="text-gray-500">•</span>
            <Link
              href="/admin/teachers"
              className="text-xs uppercase tracking-wider font-semibold text-[var(--gold-400)] hover:underline"
            >
              Teachers
            </Link>
            <span className="text-gray-500">•</span>
            <Link
              href="/admin/inquiries"
              className="text-xs uppercase tracking-wider font-semibold text-[var(--gold-400)] hover:underline"
            >
              Inquiries
            </Link>
            <span className="text-gray-500">•</span>
            <Link
              href="/admin/gallery"
              className="text-xs uppercase tracking-wider font-semibold text-[var(--gold-400)] hover:underline"
            >
              Gallery
            </Link>
            <span className="text-gray-500">•</span>
            <span>
              Logged in as <strong>{session.user.email}</strong>
            </span>
            <span className="text-gray-500">•</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button type="submit" className="adminSignOutButton">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="adminMain">
        {/* Banner */}
        <div className="adminContentCard" style={{ marginBottom: "2rem" }}>
          <h2>System Control Dashboard</h2>
          <p>
            Welcome to the Sunshine Public School management console. Select an administrative module below to manage enrolled students, faculty members, admission inquiries, and campus media assets.
          </p>
        </div>

        {/* Overview Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
          <div className="adminContentCard" style={{ padding: "1.25rem" }}>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--gold-400)", fontWeight: 600 }}>
              Total Enrolled Students
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "#ffffff", fontWeight: 700, margin: "0.25rem 0" }}>
              {totalStudents}
            </div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>Grade IX - XII Active</div>
          </div>

          <div className="adminContentCard" style={{ padding: "1.25rem" }}>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--gold-400)", fontWeight: 600 }}>
              Faculty Members
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "#ffffff", fontWeight: 700, margin: "0.25rem 0" }}>
              {totalTeachers}
            </div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>Teaching Staff</div>
          </div>

          <div className="adminContentCard" style={{ padding: "1.25rem" }}>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--gold-400)", fontWeight: 600 }}>
              Admission Inquiries
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "#ffffff", fontWeight: 700, margin: "0.25rem 0" }}>
              {totalInquiries}
            </div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>Submissions Pending</div>
          </div>

          <div className="adminContentCard" style={{ padding: "1.25rem" }}>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--gold-400)", fontWeight: 600 }}>
              Gallery Media
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "#ffffff", fontWeight: 700, margin: "0.25rem 0" }}>
              {totalMedia}
            </div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>Vercel Blob Assets</div>
          </div>
        </div>

        {/* Modules Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          <Link href="/admin/students" style={{ textDecoration: "none" }}>
            <div className="adminContentCard" style={{ cursor: "pointer", height: "100%" }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold-400)", fontWeight: 600, marginBottom: "0.5rem" }}>
                Directory
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#ffffff", marginBottom: "0.5rem" }}>
                Student Directory →
              </h3>
              <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>
                View enrolled student profiles, roll numbers, class sections, parent contact info, and register new students.
              </p>
            </div>
          </Link>

          <Link href="/admin/teachers" style={{ textDecoration: "none" }}>
            <div className="adminContentCard" style={{ cursor: "pointer", height: "100%" }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold-400)", fontWeight: 600, marginBottom: "0.5rem" }}>
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

          <Link href="/admin/inquiries" style={{ textDecoration: "none" }}>
            <div className="adminContentCard" style={{ cursor: "pointer", height: "100%" }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold-400)", fontWeight: 600, marginBottom: "0.5rem" }}>
                Admissions
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#ffffff", marginBottom: "0.5rem" }}>
                Admission Inquiries →
              </h3>
              <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>
                View submitted parent enquiries, update review status, and manage prospective student applications.
              </p>
            </div>
          </Link>

          <Link href="/admin/gallery" style={{ textDecoration: "none" }}>
            <div className="adminContentCard" style={{ cursor: "pointer", height: "100%" }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold-400)", fontWeight: 600, marginBottom: "0.5rem" }}>
                Media & Assets
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#ffffff", marginBottom: "0.5rem" }}>
                Media Gallery →
              </h3>
              <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>
                Upload campus photography, lab facilities, and event media assets directly to Vercel Blob storage.
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
