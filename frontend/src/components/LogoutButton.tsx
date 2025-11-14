"use client";

import React from "react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="px-4 py-2 rounded-full bg-zinc-700 text-white/90 hover:bg-zinc-600"
    >
      Sign out
    </button>
  );
}
