import { Link, useLocation } from "@tanstack/react-router";
import {
  Library,
  Search,
  PlusCircle,
  Bookmark,
  BookMarked,
  Settings,
  LogOut,
  ChevronRight,
  Video,
  FileText,
  Book,
  Globe
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

const libraryMenu = [
  {
    title: "Discovery",
    url: "/library",
    icon: Library,
  },
  {
    title: "My Bookmarks",
    url: "/library/my-list",
    icon: Bookmark,
  },
  {
    title: "Contribute",
    url: "/library/manage",
    icon: PlusCircle,
  },
];

const categories = [
  { name: "Web Development", icon: Globe },
  { name: "Design", icon: FileText },
  { name: "Data Science", icon: Search },
  { name: "Pedagogy", icon: BookMarked },
];

export function LibrarySidebar() {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex h-12 items-center gap-2 px-4 font-semibold text-lg">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Library className="size-5" />
          </div>
          <span className="truncate group-data-[collapsible=icon]:hidden">
            UST E-Library
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {libraryMenu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url || (item.url !== "/library" && location.pathname.startsWith(item.url))}
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

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((cat) => (
                <SidebarMenuItem key={cat.name}>
                  <SidebarMenuButton asChild>
                    <Link to="/library">
                      <cat.icon className="size-4" />
                      <span>{cat.name}</span>
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
            <SidebarMenuButton asChild tooltip="Exit Library">
              <Link to="/">
                <LogOut className="size-4" />
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
