import { createFileRoute, Outlet, useMatchRoute } from "@tanstack/react-router";
import { PartnerSidebar } from "@/components/partner/PartnerSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/partner")({
  component: PartnerLayout,
});

function PartnerLayout() {
  const matchRoute = useMatchRoute();
  const isLoginPage = matchRoute({ to: "/partner/login" });

  // Login page renders standalone — no sidebar
  if (isLoginPage) {
    return <Outlet />;
  }

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
