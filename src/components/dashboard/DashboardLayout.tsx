import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Store,
  Tags,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const ITEMS = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Produits", url: "/dashboard/produits", icon: Package },
  { title: "Marques", url: "/dashboard/marques", icon: Store },
  { title: "Catégories", url: "/dashboard/categories", icon: Tags },
  { title: "Commandes", url: "/dashboard/commandes", icon: ShoppingCart },
  { title: "Clients", url: "/dashboard/clients", icon: Users },
  { title: "Statistiques", url: "/dashboard/statistiques", icon: BarChart3 },
  { title: "Paramètres", url: "/dashboard/parametres", icon: Settings },
] as const;

export function DashboardLayout({ title, children }: { title: string; children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-secondary/30">
        <Sidebar collapsible="icon">
          <SidebarContent>
            <div className="px-4 py-5">
              <Link to="/" className="font-display text-lg tracking-[0.16em]">
                MAISON ORÉE
              </Link>
            </div>
            <SidebarGroup>
              <SidebarGroupLabel>Administration</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {ITEMS.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={pathname === item.url}>
                        <Link to={item.url} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-background px-4 py-3">
            <SidebarTrigger />
            <h1 className="truncate text-sm uppercase tracking-[0.16em]">{title}</h1>
            <Link to="/" className="shrink-0 text-xs text-muted-foreground hover:text-foreground">
              Voir la boutique
            </Link>
          </header>
          <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}