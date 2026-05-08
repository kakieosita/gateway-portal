import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { DashboardTopbar } from "@/components/dashboard/Topbar";

import { useAuthStore } from "@/stores/auth-store";
import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ location }) => {
    // We use the store directly for the sync check
    const { user, initialized } = useAuthStore.getState();
    
    // If not initialized, we might want to wait or just proceed and let the component handle it
    // But for a hard lock, we check if we have a user and if they are a student or admin
    if (initialized && !user) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }

    if (user && user.role !== "student" && user.role !== "admin") {
      // If they are logged in but not a student, send them home or to their own dashboard
      throw redirect({ to: "/" });
    }
  },
  head: () => ({
    meta: [
      { title: "Dashboard — Upskill School of Technology" },
      { name: "description", content: "Your learning dashboard at Upskill School of Technology, Owerri." },
    ],
  }),
  component: DashboardLayout,
});

function DashboardLayout() {
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
  if (user.role !== "student" && user.role !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center bg-background px-4 text-center">
        <div>
          <p className="text-lg font-semibold text-foreground">This dashboard is for students.</p>
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
