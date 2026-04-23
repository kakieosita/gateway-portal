import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { DashboardTopbar } from "@/components/dashboard/Topbar";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Upskill School of Technology" },
      { name: "description", content: "Your learning dashboard at Upskill School of Technology, Owerri." },
    ],
  }),
  component: DashboardLayout,
});

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="flex">
        <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-h-screen flex-1 flex-col">
          <DashboardTopbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
