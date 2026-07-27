import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

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
            <span>
              Logged in as <strong>{session.user.email}</strong>
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
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
        <div className="adminContentCard" style={{ marginBottom: "2rem" }}>
          <h2>Admin Dashboard</h2>
          <p>
            Welcome to the Sunshine Public School management console. Select an administrative module below to manage submissions and content.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
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
        </div>
      </main>
    </div>
  );
}
