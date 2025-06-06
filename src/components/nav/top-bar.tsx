'use client'
import * as React from "react"
import { Bell, HelpCircle, LucideClock, Search, X } from "lucide-react"
import { UserData } from "@/lib/actions/auth"
import { Button, ButtonTooltip } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSearchParams, usePathname } from "next/navigation"
import { getHeadingFromPath } from "@/lib/utils/getHeading"
import { AttendanceDialog } from "./attendance-dialog"
import { SearchForm } from "../search-form"

interface TopBarProps {
  user: UserData;
}

const TopBar: React.FC<TopBarProps> = ({ user }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const headingFromQuery = searchParams.get('h');
  const heading = headingFromQuery || getHeadingFromPath(pathname);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  return (
    <div className="flex justify-between items-center w-full py-4 px-2 bg-background rounded-lg">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold">{heading}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Attendance */}
        <AttendanceDialog />

        {/* Help Button */}
        <Button variant="outline" size="icon" className="text-muted-foreground hover:text-foreground">
          <HelpCircle className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <span className="font-semibold">Notifications</span>
              <Button variant="ghost" size="sm">Mark all as read</Button>
            </div>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <span className="font-medium">New team member added</span>
                <span className="text-xs text-muted-foreground">2 hours ago</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <span className="font-medium">Your subscription was renewed</span>
                <span className="text-xs text-muted-foreground">1 day ago</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings */}
        <Button variant="outline" size="icon" className="text-muted-foreground hover:text-foreground" onClick={() => { setIsSearchOpen(true) }}>
          <Search className="h-5 w-5" />
        </Button>
        {isSearchOpen && (
          <div className="w-full p-4 absolute left-0 bg-white shadow-md flex items-center gap-2">
            <SearchForm className="flex-1" />
            <Button variant="outline" size="icon" className="text-muted-foreground hover:text-foreground " onClick={() => { setIsSearchOpen(false) }}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TopBar 