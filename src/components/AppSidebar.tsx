import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Home, Users, Briefcase, FileText, Zap, Settings, Activity } from "lucide-react"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Profiles",
    url: "/profiles",
    icon: Users,
  },
  {
    title: "Clients",
    url: "/clients",
    icon: Users,
  },
  {
    title: "Proposals",
    url: "/proposals",
    icon: Briefcase,
  },
  {
    title: "Connects",
    url: "/connects",
    icon: Zap,
  },
  {
    title: "Templates",
    url: "/templates",
    icon: FileText,
  },
  {
    title: "Activity Logs",
    url: "/activity",
    icon: Activity,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-4">
        <h2 className="text-xl font-bold tracking-tight">Agency Operator</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <a href={item.url} className="w-full">
                    <SidebarMenuButton>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </a>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
