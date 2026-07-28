import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminNavbar from "@/components/admin/AdminNavbar";

/**
 * Shared layout for all /admin/* routes.
 * - Authenticates at the layout level (one DB call, not per-page)
 * - Renders the shared AdminNavbar with real user info from session
 * - All admin pages only need to render their <main> content
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    redirect("/login");
  }

  const user = session.user as {
    name?: string | null;
    email?: string | null;
    role?: string;
  };

  return (
    <div className="adminShell">
      <AdminNavbar
        userName={user.name ?? "Administrator"}
        userEmail={user.email ?? "admin@sunshineps.edu.in"}
      />
      {children}
    </div>
  );
}
