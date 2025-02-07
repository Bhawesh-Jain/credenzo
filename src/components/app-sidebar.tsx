
import * as React from "react"
import { NavMain } from "@/components/nav/nav-main"
import { NavSecondary } from "@/components/nav/nav-secondary"
import { NavUser } from "@/components/nav/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarRail
} from "@/components/ui/sidebar"
import { Credenzo } from "./credenzo"
import { getSidebarData } from "@/lib/actions/sidebar"
import { redirect } from "next/navigation"

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  var sidebar = await getSidebarData();

  if (!sidebar.success) {
    redirect('/login')
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <Credenzo />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebar.result.menu} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebar.result.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
