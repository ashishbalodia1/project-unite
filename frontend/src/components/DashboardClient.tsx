"use client";

import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Issue {
  id: string;
  title: string;
  category: string;
  location: {
    lat: number;
    lng: number;
  };
  severity: number;
  timestamp: string;
}

export default function DashboardClient() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
    const newSocket = io(socketUrl);

    newSocket.on("connect", () => {
      console.log("Socket.io connected");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket.io disconnected");
      setIsConnected(false);
    });

    newSocket.on("issueUpdate", (issue: Issue) => {
      console.log("Received issueUpdate:", issue);
      setIssues((prev) => [issue, ...prev].slice(0, 20)); // Keep latest 20 issues
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <div className="mt-8 space-y-6">
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        <div
          className={`h-3 w-3 rounded-full ${
            isConnected ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-red-500"
          }`}
        />
        <span className="text-sm text-zinc-300">
          {isConnected ? "Real-time updates active" : "Connecting..."}
        </span>
      </div>

      {/* Heatmap placeholder */}
      <div className="rounded-lg bg-white/3 p-6">
        <h2 className="text-xl font-semibold mb-4">Issue Heatmap</h2>
        <div className="relative h-64 bg-zinc-900/50 rounded-lg overflow-hidden">
          {/* Simple visualization - show dots for issues */}
          {issues.map((issue) => {
            const x = ((issue.location.lng + 180) / 360) * 100;
            const y = ((90 - issue.location.lat) / 180) * 100;
            
            return (
              <div
                key={issue.id}
                className="absolute w-3 h-3 rounded-full bg-cyan-500 animate-ping"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  animationDuration: "2s",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Issues Feed */}
      <div className="rounded-lg bg-white/3 p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Issues ({issues.length})</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {issues.length === 0 ? (
            <p className="text-sm text-zinc-400">Waiting for issue updates...</p>
          ) : (
            issues.map((issue, index) => (
              <div
                key={issue.id}
                className="p-4 rounded-lg bg-white/5 border border-white/10 animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-zinc-100">{issue.title}</h3>
                    <div className="flex items-center gap-3 mt-2 text-sm text-zinc-400">
                      <span className="capitalize">{issue.category}</span>
                      <span>•</span>
                      <span>Severity: {issue.severity}/5</span>
                      <span>•</span>
                      <span>{new Date(issue.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <div
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      issue.severity >= 4
                        ? "bg-red-500/20 text-red-400"
                        : issue.severity >= 3
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {issue.severity >= 4 ? "High" : issue.severity >= 3 ? "Medium" : "Low"}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
