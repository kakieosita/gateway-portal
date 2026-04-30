import { createFileRoute, Outlet, useMatchRoute } from "@tanstack/react-router";
import { PartnerSidebar } from "@/components/partner/PartnerSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

import { useAuthStore } from "@/stores/auth-store";
import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/partner")({
  beforeLoad: async ({ location }) => {
    const { user, initialized } = useAuthStore.getState();
    
    // Don't guard the login page itself
    if (location.pathname === "/partner/login") return;

    if (initialized && !user) {
      throw redirect({
        to: "/partner/login",
        search: {
          redirect: location.href,
        },
      });
    }

    if (user && user.role !== "partner" && user.role !== "admin") {
      throw redirect({ to: "/" });
    }
  },
  component: PartnerLayout,
});

function PartnerLayout() {
  const matchRoute = useMatchRoute();
  const isLoginPage = matchRoute({ to: "/partner/login" });
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

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <PartnerSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 md:p-8 pt-16 md:pt-8">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
