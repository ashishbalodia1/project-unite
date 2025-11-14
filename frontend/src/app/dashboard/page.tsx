import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import LogoutButton from "../../components/LogoutButton";
import DashboardClient from "../../components/DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = (await getServerSession(authOptions as any)) as any;

  if (!session) {
    // Redirect unauthenticated users to the login/home page
    redirect("/");
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-2 text-sm text-zinc-300">Welcome back, {session.user?.name ?? session.user?.email}</p>
          </div>
          <LogoutButton />
        </div>

        <DashboardClient />
      </div>
    </main>
  );
}
