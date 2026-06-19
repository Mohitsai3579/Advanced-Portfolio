"use client"

import { useState } from "react"
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
import { Bell, Search, Menu, X } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { navItems } from "./sidebar"

export function AdminHeader({ user }: { user: any }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-6 sticky top-0 z-20 shadow-sm">
      {/* Mobile Sidebar Hamburger Menu */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden text-muted-foreground hover:text-foreground shrink-0"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

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

      {/* Mobile Sidebar Slide-over Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          {/* Sidebar Panel */}
          <div className="fixed inset-y-0 left-0 w-64 bg-card border-r p-6 shadow-xl flex flex-col gap-6 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-md">
                  P
                </div>
                <h2 className="text-xl font-bold tracking-tight">Admin</h2>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground h-8 w-8"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="flex flex-col gap-1 text-sm font-medium overflow-y-auto pr-2 max-h-[calc(100vh-120px)]">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin" && item.href.length > 6)
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                      isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
