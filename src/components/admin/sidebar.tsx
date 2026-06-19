"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { 
  LayoutDashboard, 
  Settings, 
  FolderGit2, 
  FileText, 
  Image as ImageIcon, 
  User,
  Mail,
  Briefcase,
  GraduationCap,
  Award
} from "lucide-react"

export const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Messages", href: "/admin/messages", icon: Mail },
  { name: "Profile", href: "/admin/profile", icon: User },
  { name: "Skills", href: "/admin/skills", icon: FolderGit2 },
  { name: "Experience", href: "/admin/experience", icon: Briefcase },
  { name: "Education", href: "/admin/education", icon: GraduationCap },
  { name: "Certs", href: "/admin/certifications", icon: FileText },
  { name: "Achievements", href: "/admin/achievements", icon: Award },
  { name: "Projects", href: "/admin/projects", icon: FolderGit2 },
  { name: "Blogs", href: "/admin/blogs", icon: FileText },
  { name: "Media", href: "/admin/media", icon: ImageIcon },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-card/50 backdrop-blur-xl p-4 flex flex-col gap-6 shadow-sm hidden md:flex z-10 relative">
      <div className="flex items-center gap-3 px-2">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-md">
          P
        </div>
        <h2 className="text-xl font-bold tracking-tight">Portfolio Admin</h2>
      </div>
      
      <nav className="flex flex-col gap-2 text-sm font-medium">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin" && item.href.length > 6)
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={`h-4 w-4 relative z-10 transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
              <span className="relative z-10">{item.name}</span>
            </Link>
          )
        })}
      </nav>
      
      <div className="mt-auto px-2">
        <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-4 border border-primary/10 backdrop-blur shadow-sm">
          <h4 className="text-sm font-semibold text-foreground">Need help?</h4>
          <p className="text-xs text-muted-foreground mt-1 mb-3">Check the documentation for SaaS setup.</p>
          <a href="#" className="text-xs font-medium text-primary hover:underline">View Docs &rarr;</a>
        </div>
      </div>
    </aside>
  )
}
