import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getDashboardStats } from "@/actions/dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Eye, 
  FolderGit2, 
  Settings, 
  Mail, 
  Plus, 
  FileText, 
  User, 
  Wand2, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  TrendingUp
} from "lucide-react"
import Link from "next/link"

export default async function AdminDashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const stats = await getDashboardStats()

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {session.user.name || session.user.email}!</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/profile">
            <Button size="sm" className="gap-1">
              <User className="w-4 h-4" /> Edit Profile
            </Button>
          </Link>
          <Link href="/" target="_blank">
            <Button size="sm" variant="outline" className="gap-1">
              <Eye className="w-4 h-4" /> View Site
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:border-primary/20 transition-all shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Visitors</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Eye className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{stats?.visitorCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              Live traffic analytics
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/20 transition-all shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Projects Published</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
              <FolderGit2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{stats?.projectCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">SaaS and open source items</p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/20 transition-all shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Skills</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Wand2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{stats?.skillCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Proficiency levels mapped</p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/20 transition-all shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inquiries Recieved</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500">
              <Mail className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{stats?.messageCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Client messages in inbox</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Messages Column */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>Latest client inquiries and project requests.</CardDescription>
              </div>
              <Link href="/admin/messages">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {!stats?.recentMessages || stats.recentMessages.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  No messages received yet.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {stats.recentMessages.map((msg: any) => (
                    <div key={msg.id} className="py-4 first:pt-0 last:pb-0 flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{msg.name}</span>
                          <span className="text-xs text-muted-foreground">({msg.email})</span>
                          {!msg.isRead && (
                            <span className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="text-xs font-semibold text-primary">{msg.subject || "No Subject"}</p>
                        <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">{msg.message}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Live Traffic Analytics */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Live Traffic Logs</CardTitle>
              <CardDescription>Real-time analytics of visitors browsing your portfolio pages.</CardDescription>
            </CardHeader>
            <CardContent>
              {!stats?.recentViews || stats.recentViews.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  No visitors logged yet. Public traffic views will appear here dynamically.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-border/60 text-muted-foreground text-xs uppercase tracking-wider">
                        <th className="py-3 px-2">Page</th>
                        <th className="py-3 px-2">Country</th>
                        <th className="py-3 px-2">Device</th>
                        <th className="py-3 px-2 text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {stats.recentViews.map((view: any) => (
                        <tr key={view.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-2 font-medium">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary capitalize">
                              {view.page}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-muted-foreground">{view.country || "Unknown"}</td>
                          <td className="py-3 px-2 text-muted-foreground">{view.device || "Desktop"}</td>
                          <td className="py-3 px-2 text-right text-xs text-muted-foreground">
                            {new Date(view.createdAt).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Setup Progress & Quick Actions Column */}
        <div className="space-y-6">
          {/* Profile setup progress */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Portfolio Setup Score</CardTitle>
              <CardDescription>Check how ready your SaaS portfolio is.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-sm font-semibold mb-1.5">
                  <span>Completion</span>
                  <span className="text-primary">{stats?.progressPercentage || 0}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_var(--primary)]/30" 
                    style={{ width: `${stats?.progressPercentage || 0}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Resume upload complete</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Interactive timelines built</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Connect settings configured</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Panel */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 pt-0">
              <Link href="/admin/projects/new" className="w-full">
                <Button variant="outline" className="w-full justify-start gap-1.5 text-xs py-5">
                  <Plus className="w-4 h-4" /> Add Project
                </Button>
              </Link>
              <Link href="/admin/media" className="w-full">
                <Button variant="outline" className="w-full justify-start gap-1.5 text-xs py-5">
                  <FileText className="w-4 h-4" /> Upload Media
                </Button>
              </Link>
              <Link href="/admin/settings" className="w-full">
                <Button variant="outline" className="w-full justify-start gap-1.5 text-xs py-5">
                  <Settings className="w-4 h-4" /> Settings
                </Button>
              </Link>
              <Link href="/admin/profile" className="w-full">
                <Button variant="outline" className="w-full justify-start gap-1.5 text-xs py-5">
                  <User className="w-4 h-4" /> Edit Bio
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
