"use client";

import React from "react";
import { signIn, useSession } from "next-auth/react";

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return <button className="px-4 py-2 rounded-md bg-zinc-800 text-white/80">Loading...</button>;

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-zinc-200">{session.user.name ?? session.user.email}</span>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="px-4 py-2 rounded-full bg-gradient-to-r from-neon-cyan to-electric-purple text-black font-semibold"
    >
      Sign in
    </button>
  );
}
