import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { useState } from "react";
import { InstructorSidebar } from "@/components/instructor/Sidebar";
import { InstructorTopbar } from "@/components/instructor/Topbar";

import { useAuthStore } from "@/stores/auth-store";
import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/instructor")({
  beforeLoad: async ({ location }) => {
    const { user, initialized } = useAuthStore.getState();
    
    if (initialized && !user) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }

    if (user && user.role !== "instructor" && user.role !== "admin") {
      throw redirect({ to: "/" });
    }
  },
  head: () => ({
    meta: [
      { title: "Instructor — Upskill School of Technology" },
      { name: "description", content: "Instructor panel for managing courses, students, and analytics." },
    ],
  }),
  component: InstructorLayout,
});

function InstructorLayout() {
  const { user, loading } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background px-4 text-center">
        <div>
          <p className="text-lg font-semibold text-foreground">Please sign in to continue.</p>
          <Link to="/login" className="mt-3 inline-flex text-sm font-medium text-primary hover:underline">
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }
  if (user.role !== "instructor" && user.role !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center bg-background px-4 text-center">
        <div>
          <p className="text-lg font-semibold text-foreground">This dashboard is for instructors.</p>
          <Link to="/" className="mt-3 inline-flex text-sm font-medium text-primary hover:underline">
            Go home
          </Link>
        </div>
      </div>
    );
  }

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
