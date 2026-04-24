import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { InstructorSidebar } from "@/components/instructor/Sidebar";
import { InstructorTopbar } from "@/components/instructor/Topbar";

export const Route = createFileRoute("/instructor")({
  head: () => ({
    meta: [
      { title: "Instructor — Upskill School of Technology" },
      { name: "description", content: "Instructor panel for managing courses, students, and analytics." },
    ],
  }),
  component: InstructorLayout,
});

function InstructorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="flex">
        <InstructorSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-h-screen flex-1 flex-col">
          <InstructorTopbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
