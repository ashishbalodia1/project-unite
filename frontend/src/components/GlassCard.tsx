"use client";

import React from "react";

type GlassCardProps = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
};

export default function GlassCard({
  title,
  subtitle,
  children,
  actionLabel = "Get started",
  onAction,
}: GlassCardProps) {
  return (
    <div className="glass-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {subtitle && (
            <p className="mt-1 text-sm text-zinc-300">{subtitle}</p>
          )}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={onAction}
            className="glow-btn"
            aria-label={actionLabel}
          >
            {actionLabel}
          </button>
        </div>
      </div>

      {children && <div className="mt-4 text-sm text-zinc-200">{children}</div>}
    </div>
  );
}
