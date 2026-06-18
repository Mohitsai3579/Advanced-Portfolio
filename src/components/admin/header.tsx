"use client"

import { signOutAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Search } from "lucide-react"
import { useRouter } from "next/navigation"

export function AdminHeader({ user }: { user: any }) {
  const router = useRouter()
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-6 sticky top-0 z-20 shadow-sm">
      <div className="flex-1 flex items-center gap-4">
        <div className="relative w-64 max-w-sm hidden md:flex">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            type="search" 
            placeholder="Search across portfolio..." 
            className="flex h-9 w-full rounded-md border border-input bg-muted/50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:bg-background pl-9"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="relative h-9 w-9 rounded-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border-none bg-transparent p-0 cursor-pointer">
            <Avatar className="h-9 w-9 border border-border shadow-sm hover:opacity-80 transition-opacity">
              <AvatarImage src="" alt={user?.name || "Admin"} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {user?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || "Super Admin"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/admin/profile")} className="cursor-pointer">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/admin/settings")} className="cursor-pointer">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer p-0">
              <form action={signOutAction} className="w-full">
                <button type="submit" className="w-full text-left px-2 py-1.5">Log out</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
