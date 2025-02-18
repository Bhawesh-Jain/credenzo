import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { UserProvider } from "@/contexts/user-context"
import { UserData } from "@/lib/actions/auth"
import { validateSession } from "@/lib/session"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const session = await validateSession();
    
    const user: UserData = {
      user_id: session.user_id,
      user_phone: session.user_phone,
      user_email: session.user_email,
      user_avatar: session.user_avatar,
      company_name: session.company_name,
      company_id: session.company_id,
      role: session.role,
    }

    return (
      <UserProvider user={user}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">
                        Building Your Application
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </UserProvider>
    )
  } catch (error) {
    redirect('/login')
  }
}
