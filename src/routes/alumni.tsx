import { createFileRoute, Outlet, useMatchRoute, Link } from "@tanstack/react-router";
import { AlumniSidebar } from "@/components/alumni/AlumniSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

import { useAuthStore } from "@/stores/auth-store";
import { redirect } from "@tanstack/react-router";

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

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background px-4 text-center">
        <div>
          <p className="text-lg font-semibold text-foreground">Please sign in to continue.</p>
          <Link to="/alumni/login" className="mt-3 inline-flex text-sm font-medium text-primary hover:underline">
            Go to alumni sign in
          </Link>
        </div>
      </div>
    );
  }
  if (user.role !== "alumni" && user.role !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center bg-background px-4 text-center">
        <div>
          <p className="text-lg font-semibold text-foreground">This dashboard is for alumni.</p>
          <Link to="/" className="mt-3 inline-flex text-sm font-medium text-primary hover:underline">
            Go home
          </Link>
        </div>
      </div>
    );
  }

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
