import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#051325] text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 mb-8 border-b border-white/10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#d99b26] font-semibold">
              Admin Portal
            </span>
            <h1 className="text-3xl font-bold mt-1">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">
              Logged in as <strong className="text-white">{session.user.email}</strong>
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button
                type="submit"
                className="px-4 py-2 text-sm rounded-lg bg-red-600/80 hover:bg-red-600 text-white font-medium transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </form>
          </div>
        </header>

        <section className="bg-[#07192f] border border-[#d99b26]/20 rounded-xl p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-[#d99b26] mb-3">
            Welcome to the Sunshine Admin Portal
          </h2>
          <p className="text-gray-300 leading-relaxed max-w-2xl">
            Authentication setup is complete. You are currently logged in as an authorized administrator. Dashboard features and management tools will appear here.
          </p>
        </section>
      </div>
    </main>
  );
}
