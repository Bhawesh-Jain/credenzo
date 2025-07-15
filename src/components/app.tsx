'use client'

import { useSidebar } from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"

export function App({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar()
  const isMobile = useIsMobile();

  if (isMobile) {
    return <div className="w-full py-16">
      <div className="flex justify-center gap-2 md:justify-start px-4">
        <a href="#" className="flex items-center gap-2 font-medium">
          <Avatar className="h-6 w-6 bg-primary text-primary-foreground">
            <AvatarImage src="/assets/favicon.ico" alt="Credenzo" />
          </Avatar>
          Credenzo
        </a>
      </div>
      <div className="bg-white flex flex-col justify-center items-center p-4 text-center mt-8">
        <p className="text-lg font-semibold">Mobile View Not Supported Yet.</p>
        <p className="text-sm text-gray-500">Coming Soon</p>
      </div>
    </div>
  }

  return (
    <div className={cn("max-w-[100vw] transition-all ease-linear", state === "expanded" ? "md:max-w-[calc(100vw-16rem)]" : "md:max-w-[calc(100vw-3rem)]")}>
      {children}
    </div>
  )
}