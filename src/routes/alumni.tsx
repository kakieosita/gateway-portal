import { createFileRoute, Outlet, useMatchRoute } from "@tanstack/react-router";
import { AlumniSidebar } from "@/components/alumni/AlumniSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

import { useAuthStore } from "@/stores/auth-store";
import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/alumni")({
  beforeLoad: async ({ location }) => {
    const { user, initialized } = useAuthStore.getState();
    
    // Don't guard the login or signup pages
    if (location.pathname === "/alumni/login" || location.pathname === "/alumni/signup") return;

    if (initialized && !user) {
      throw redirect({
        to: "/alumni/login",
        search: {
          redirect: location.pathname,
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
  const { user, loading } = useAuthStore();
  
  // Auth pages render standalone — no sidebar
  const isAuthPage = matchRoute({ to: "/alumni/login" }) || matchRoute({ to: "/alumni/signup" });
  
  if (isAuthPage) {
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
