import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

import { useAuthStore } from "@/stores/auth-store";
import { redirect } from "@tanstack/react-router";
import { authApi } from "@/lib/auth-api";

export const Route = createFileRoute("/admin")({
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

    if (user && user.role !== "admin") {
      throw redirect({ to: authApi.getDashboardRoute(user.role) });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { user, loading } = useAuthStore();

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
  if (user.role !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center bg-background px-4 text-center">
        <div>
          <p className="text-lg font-semibold text-foreground">This area is for admins only.</p>
          <Link to="/" className="mt-3 inline-flex text-sm font-medium text-primary hover:underline">
            Go home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/40">
        <AdminSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <AdminTopbar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
