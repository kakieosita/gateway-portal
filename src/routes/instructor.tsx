import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { InstructorSidebar } from "@/components/instructor/Sidebar";
import { InstructorTopbar } from "@/components/instructor/Topbar";

import { useAuthStore } from "@/stores/auth-store";
import { redirect } from "@tanstack/react-router";
import { authApi } from "@/lib/auth-api";

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
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login", search: { redirect: location.href } as never });
      return;
    }
    if (user.role !== "instructor" && user.role !== "admin") {
      navigate({ to: authApi.getDashboardRoute(user.role) as never });
    }
  }, [loading, location.href, navigate, user]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;
  if (user.role !== "instructor" && user.role !== "admin") return null;

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
