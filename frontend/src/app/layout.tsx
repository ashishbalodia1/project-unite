import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LoginButton from "../components/LoginButton";
import Providers from "../components/Providers";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project UNITE",
  description: "Reconnecting the World Digitally - Project UNITE",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-[#050406] via-[#071428] to-[#001219] text-zinc-100`}
        suppressHydrationWarning
      >
        <Providers session={session}>
          <header className="mx-auto max-w-7xl px-6 py-6">
          <nav className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <span className="inline-block h-9 w-9 rounded-full bg-gradient-to-br from-[#00f6ff] to-[#6bffb8] shadow-[0_0_20px_rgba(107,255,184,0.12)]" />
              <span className="font-semibold text-lg tracking-tight">Project UNITE</span>
            </a>
            <ul className="flex items-center gap-6 text-sm list-none">
              <li>
                <a href="/" className="hover:text-[#6bffb8]">Home</a>
              </li>
              <li>
                <a href="/dashboard" className="hover:text-[#6bffb8]">Dashboard</a>
              </li>
              <li>
                <div className="rounded-md px-2 py-1">
                  <LoginButton />
                </div>
              </li>
            </ul>
          </nav>
        </header>

          {children}
        </Providers>
      </body>
    </html>
  );
}
