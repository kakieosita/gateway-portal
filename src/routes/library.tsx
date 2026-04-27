import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LibrarySidebar } from "@/components/library/LibrarySidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/library")({
  component: LibraryLayout,
});

function LibraryLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <LibrarySidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 md:p-8 pt-16 md:pt-8">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
