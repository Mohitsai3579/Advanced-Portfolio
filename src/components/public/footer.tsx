import { 
  Send, 
  Phone, 
  Mail, 
  MapPin, 
  Heart 
} from "lucide-react"

export function PublicFooter({ profile, settings }: { profile: any; settings: any }) {
  const name = profile?.name || "Developer"
  const email = profile?.email || "mohit@example.com"
  const phone = profile?.phone || "+91 XXX-XXX-XXXX"
  const location = profile?.location || "India"

  return (
    <footer className="relative border-t border-border/20 bg-background/80 backdrop-blur-md pt-20 pb-8 z-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        
        {/* Column 1: Info */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold tracking-tight text-foreground">{name}'s Portfolio</h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            Thank you for visiting my personal portfolio website. Connect with me over socials.
          </p>
          <p className="text-sm font-medium text-yellow-500/90 flex items-center gap-1.5 pt-2">
            <span>Keep Rising 🚀. Connect with me over live chat!</span>
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold tracking-tight text-foreground">Quick Links</h3>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-muted-foreground">
            <li>
              <a href="#hero" className="hover:text-primary transition-colors flex items-center gap-1.5">
                &rsaquo; Home
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-primary transition-colors flex items-center gap-1.5">
                &rsaquo; About
              </a>
            </li>
            <li>
              <a href="#skills" className="hover:text-primary transition-colors flex items-center gap-1.5">
                &rsaquo; Skills
              </a>
            </li>
            <li>
              <a href="#education" className="hover:text-primary transition-colors flex items-center gap-1.5">
                &rsaquo; Education
              </a>
            </li>
            <li>
              <a href="#experience" className="hover:text-primary transition-colors flex items-center gap-1.5">
                &rsaquo; Experience
              </a>
            </li>
            <li>
              <a href="#projects" className="hover:text-primary transition-colors flex items-center gap-1.5">
                &rsaquo; Projects
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold tracking-tight text-foreground">Contact Info</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-yellow-500 shrink-0" />
              <span>{phone}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-yellow-500 shrink-0" />
              <span>{email}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-yellow-500 shrink-0" />
              <span>{location}</span>
            </li>
          </ul>

          {/* Social Icons (Match reference screenshot styles using inline SVGs) */}
          <div className="flex flex-wrap gap-2.5 pt-4">
            {profile?.phone && (
              <a 
                href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, "")}?text=Hi`}
                target="_blank" 
                rel="noreferrer" 
                className="h-9 w-9 rounded-full bg-muted/50 border border-border/30 hover:border-green-500 hover:bg-green-500/10 hover:text-green-500 flex items-center justify-center transition-all hover:scale-105"
                title="WhatsApp"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.338 5.397 0 11.96 0c3.178.001 6.169 1.24 8.413 3.487 2.245 2.246 3.48 5.239 3.48 8.415-.004 6.555-5.342 11.892-11.905 11.892-2.002-.002-3.974-.51-5.729-1.474L0 24zm6.59-3.807c1.62.962 3.2 1.488 4.8 1.49 5.485 0 9.948-4.463 9.95-9.95.002-2.657-1.03-5.155-2.906-7.03C16.615 2.83 14.116 1.8 11.46 1.8 5.97 1.8 1.508 6.261 1.506 11.75c0 1.658.435 3.275 1.258 4.7l-.36 1.314.218-.08 1.368-.372c1.4.922 2.872 1.4 4.542 1.4l-.425.001zm9.83-6.52c-.27-.135-1.59-.785-1.838-.875-.246-.09-.427-.135-.607.135-.18.27-.7.875-.858 1.06-.157.18-.315.2-.585.067-.27-.135-1.14-.42-2.17-1.34-.8-.713-1.34-1.597-1.5-1.868-.16-.27-.017-.417.118-.552.12-.12.27-.315.405-.473.134-.158.18-.27.27-.45.09-.18.044-.338-.023-.473-.067-.135-.607-1.462-.832-2.007-.22-.53-.446-.458-.607-.466-.157-.008-.337-.008-.517-.008-.18 0-.472.067-.72.337-.246.27-.945.922-.945 2.25 0 1.328.967 2.61 1.1 2.79.135.18 1.9 2.9 4.606 4.07.643.278 1.146.444 1.537.568.647.206 1.236.177 1.7.108.518-.077 1.59-.65 1.815-1.28.225-.63.225-1.17.157-1.282-.067-.113-.247-.18-.517-.315z"/>
                </svg>
              </a>
            )}
            {profile?.linkedinUrl && (
              <a 
                href={profile.linkedinUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="h-9 w-9 rounded-full bg-muted/50 border border-border/30 hover:border-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-500 flex items-center justify-center transition-all hover:scale-105"
                title="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            )}
            {profile?.githubUrl && (
              <a 
                href={profile.githubUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="h-9 w-9 rounded-full bg-muted/50 border border-border/30 hover:border-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-500 flex items-center justify-center transition-all hover:scale-105"
                title="GitHub"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </a>
            )}
            {profile?.twitterUrl && (
              <a 
                href={profile.twitterUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="h-9 w-9 rounded-full bg-muted/50 border border-border/30 hover:border-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-500 flex items-center justify-center transition-all hover:scale-105"
                title="Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            )}
            {profile?.telegramUrl && (
              <a 
                href={profile.telegramUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="h-9 w-9 rounded-full bg-muted/50 border border-border/30 hover:border-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-500 flex items-center justify-center transition-all hover:scale-105"
                title="Telegram"
              >
                <Send className="w-4 h-4 -rotate-45" />
              </a>
            )}
            {profile?.instagramUrl && (
              <a 
                href={profile.instagramUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="h-9 w-9 rounded-full bg-muted/50 border border-border/30 hover:border-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-500 flex items-center justify-center transition-all hover:scale-105"
                title="Instagram"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto px-4 border-t border-border/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} {name}. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Designed with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" /> by{" "}
          <span className="font-semibold text-yellow-500">{name}</span>
        </p>
      </div>
    </footer>
  )
}
