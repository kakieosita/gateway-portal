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
  Users
} from "lucide-react";
import { authApi } from "@/lib/auth-api";
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
            <SidebarMenuButton 
              tooltip="Sign Out"
              onClick={async () => {
                await authApi.logout();
                window.location.href = "/";
              }}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="size-4" />
              <span className="truncate group-data-[collapsible=icon]:hidden">
                Sign Out
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
