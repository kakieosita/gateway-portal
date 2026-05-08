import { createFileRoute, Outlet, useLocation, useMatchRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AlumniSidebar } from "@/components/alumni/AlumniSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

import { useAuthStore } from "@/stores/auth-store";
import { redirect } from "@tanstack/react-router";
import { authApi } from "@/lib/auth-api";

export const Route = createFileRoute("/alumni")({
  beforeLoad: async ({ location }) => {
    const { user, initialized } = useAuthStore.getState();
    
    // Don't guard the login page itself
    if (location.pathname === "/alumni/login") return;

    if (initialized && !user) {
      throw redirect({
        to: "/alumni/login",
        search: {
          redirect: location.href,
        },
      });
    }

    if (user && user.role !== "alumni" && user.role !== "admin") {
      throw redirect({ to: "/" });
    }
  },
  component: AlumniLayout,
});

function AlumniLayout() {
  const matchRoute = useMatchRoute();
  const isLoginPage = matchRoute({ to: "/alumni/login" });
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoginPage || loading) return;
    if (!user) {
      navigate({ to: "/alumni/login", search: { redirect: location.href } as never });
      return;
    }
    if (user.role !== "alumni" && user.role !== "admin") {
      navigate({ to: authApi.getDashboardRoute(user.role) as never });
    }
  }, [isLoginPage, loading, location.href, navigate, user]);

  // Login page renders standalone — no sidebar
  if (isLoginPage) {
    return <Outlet />;
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;
  if (user.role !== "alumni" && user.role !== "admin") return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AlumniSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 md:p-8 pt-16 md:pt-8">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
