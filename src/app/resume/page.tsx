import { getPublicPortfolio } from "@/actions/public"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ResumePage() {
  const portfolio = await getPublicPortfolio("resume")

  if (!portfolio) {
    notFound()
  }

  const profile = portfolio.profiles?.[0]
  if (!profile?.resumeUrl) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <h1 className="text-3xl font-bold mb-4">Resume Not Available</h1>
        <p className="text-muted-foreground mb-8">This developer hasn't uploaded a resume yet.</p>
        <Link href="/" className="text-primary hover:underline flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Portfolio
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border/20 bg-card/50 backdrop-blur-md">
        <Link href="/" className="flex items-center text-sm font-semibold hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Portfolio
        </Link>
        <h1 className="font-bold">{profile.name} - Resume</h1>
        <a 
          href={profile.resumeUrl} 
          download 
          className="text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-full hover:shadow-[0_0_15px_var(--primary)]/50 transition-all"
        >
          Download PDF
        </a>
      </div>
      <div className="flex-1 w-full relative">
        <iframe 
          src={`${profile.resumeUrl}#toolbar=0&navpanes=0`} 
          className="absolute inset-0 w-full h-full border-none bg-zinc-900"
          title="Resume PDF Viewer"
        />
      </div>
    </div>
  )
}
