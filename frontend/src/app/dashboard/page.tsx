import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import LogoutButton from "../../components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions as any);

  if (!session) {
    // Redirect unauthenticated users to the login/home page
    redirect("/");
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-sm text-zinc-300">Welcome back, {session.user?.name ?? session.user?.email}</p>

        <section className="mt-6">
          <div className="space-y-4">
            <div className="rounded-lg bg-white/3 p-4">
              <p className="text-sm text-zinc-200">This is a protected page only visible to authenticated users.</p>
            </div>

            <LogoutButton />
          </div>
        </section>
      </div>
    </main>
  );
}
