"use client"

import * as React from "react"
import { NavMain } from "@/components/nav/nav-main"
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
import { useState, useEffect } from "react"
import Loading from "@/app/loading"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const [loading, setLoading] = useState(true);
  const [sidebar, setSidebar] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      var sidebar = await getSidebarData();
      setSidebar(sidebar.result);
      setLoading(false);
    })();
  }, []);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <Credenzo />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebar?.menu || []} loading={loading} />
      </SidebarContent>
      <SidebarFooter>
        {loading ? (
          <Loading />
        ) : (
          <NavUser user={sidebar.user} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
