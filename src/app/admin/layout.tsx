import { ReactNode } from "react"
import { auth } from "@/auth"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { PageTransition } from "@/components/admin/page-transition"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth()

  return (
    <div className="flex min-h-screen w-full bg-muted/20 selection:bg-primary/20">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader user={session?.user} />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  )
}
