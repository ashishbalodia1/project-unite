"use client";

import dynamic from "next/dynamic";
import GlassCard from "../components/GlassCard";

const Canvas3D = dynamic(() => import("../components/Canvas3D"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="mx-auto flex min-h-[72vh] max-w-7xl items-center gap-12 px-6 py-12 lg:py-24">
      <section className="z-10 w-full max-w-2xl">
        <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight">
          Project UNITE
        </h1>
        <p className="mt-4 max-w-xl text-lg text-zinc-300">
          Reconnecting the World Digitally
        </p>

        <div className="mt-8 flex items-center gap-4">
          <a
            href="#"
            className="neon-btn inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-semibold shadow-neon">
            <span className="mr-1">Join the Movement</span>
          </a>

          <a
            href="#features"
            className="rounded-full px-4 py-2 text-sm text-zinc-300 hover:text-zinc-100"
          >
            Learn more
          </a>
        </div>

        <p className="mt-6 text-sm text-zinc-400">
          A minimal demo landing page: responsive, elegant, and styled with a
          dark-to-neon palette. The globe to the right is a live 3D placeholder.
        </p>

        <div className="mt-8 max-w-md">
          <GlassCard
            title="Connect globally"
            subtitle="Encrypted, open, and private"
            actionLabel="Join"
            onAction={() => alert('Join clicked')}
          >
            <p>Join the private beta and start connecting with communities worldwide.</p>
          </GlassCard>
        </div>
      </section>

      <aside className="relative hidden w-1/2 flex-1 rounded-2xl bg-gradient-to-br from-transparent via-[#00121a]/30 to-transparent p-4 shadow-2xl lg:block">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[380px] w-[380px] max-w-full">
            <Canvas3D />
          </div>
        </div>
      </aside>
    </main>
  );
}
