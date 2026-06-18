import Link from "next/link"

export function PublicNavbar({ settings, resumeUrl }: { settings: any; resumeUrl?: string | null }) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold tracking-tight text-xl">
          {settings?.siteName || "Portfolio"}
        </Link>
        <div className="flex items-center gap-6 hidden sm:flex">
          <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
          <Link href="#skills" className="text-sm font-medium hover:text-primary transition-colors">Skills</Link>
          <Link href="#experience" className="text-sm font-medium hover:text-primary transition-colors">Experience</Link>
          <Link href="#education" className="text-sm font-medium hover:text-primary transition-colors">Education</Link>
          <Link href="#projects" className="text-sm font-medium hover:text-primary transition-colors">Projects</Link>
          {resumeUrl && <Link href="#resume" className="text-sm font-medium hover:text-primary transition-colors">Resume</Link>}
          <Link href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</Link>
        </div>
      </div>
    </nav>
  )
}
