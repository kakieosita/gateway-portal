import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  MessagesSquare,
  Award,
  LogOut,
  Settings,
  ChevronLeft,
  Search,
  Bell
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/auth-api";
import { useNavigate } from "@tanstack/react-router";

const alumniMenu = [
  {
    title: "Dashboard",
    url: "/alumni",
    icon: LayoutDashboard,
  },
  {
    title: "Alumni Directory",
    url: "/alumni/directory",
    icon: Users,
  },
  {
    title: "Career Hub",
    url: "/alumni/career",
    icon: Briefcase,
  },
  {
    title: "Community",
    url: "/alumni/community",
    icon: MessagesSquare,
  },
  {
    title: "Education & Records",
    url: "/alumni/education",
    icon: Award,
  },
];

export function AlumniSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      navigate({ to: "/login" });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex h-12 items-center gap-2 px-4 font-semibold text-lg">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Award className="size-5" />
          </div>
          <span className="truncate group-data-[collapsible=icon]:hidden">
            Alumni Portal
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {alumniMenu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url || (item.url !== "/alumni" && location.pathname.startsWith(item.url))}
                    tooltip={item.title}
                  >
                    <Link to={item.url as any}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
             <SidebarMenuButton asChild tooltip="Settings">
                <Link to="/alumni">
                   <Settings className="size-4" />
                   <span>Settings</span>
                </Link>
             </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Sign out">
              <LogOut className="size-4" />
              <span className="truncate group-data-[collapsible=icon]:hidden">
                Sign out
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Exit Portal">
              <Link to="/">
                <ChevronLeft className="size-4" />
                <span className="truncate group-data-[collapsible=icon]:hidden">
                  Back to Website
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
