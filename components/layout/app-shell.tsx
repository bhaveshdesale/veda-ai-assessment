"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f1e8] p-3 lg:p-5">
      <div className="flex min-h-[calc(100vh-24px)] gap-3 lg:min-h-[calc(100vh-40px)]">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Topbar
            onMenuClick={() => setSidebarOpen(true)}
          />

          <main className="min-h-0 flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}