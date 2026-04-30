import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Building2,
  BarChart3,
  CreditCard,
  MessageSquare,
  Award,
  LogOut,
  Settings,
  FileText,
  Users,
  ChevronLeft
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
import { authApi } from "@/lib/auth-api";
import { useNavigate } from "@tanstack/react-router";

const partnerMenu = [
  {
    title: "Dashboard",
    url: "/partner",
    icon: LayoutDashboard,
  },
  {
    title: "Partnership",
    url: "/partner/management",
    icon: Building2,
  },
  {
    title: "Reporting & Impact",
    url: "/partner/reports",
    icon: BarChart3,
  },
  {
    title: "Invoicing & Payments",
    url: "/partner/finance",
    icon: CreditCard,
  },
  {
    title: "Communication",
    url: "/partner/support",
    icon: MessageSquare,
  },
];

export function PartnerSidebar() {
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
            <Building2 className="size-5" />
          </div>
          <span className="truncate group-data-[collapsible=icon]:hidden">
            Partner Portal
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {partnerMenu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url || (item.url !== "/partner" && location.pathname.startsWith(item.url))}
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
                <Link to="/partner">
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
