import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

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
        <div className="adminContentCard">
          <h2>Admin Dashboard</h2>
          <p>
            Welcome to the Sunshine Public School management console. Authentication has been established using Auth.js and MongoDB Atlas. Administrative data management modules will be populated here.
          </p>
        </div>
      </main>
    </div>
  );
}
