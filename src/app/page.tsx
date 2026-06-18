import { getPublicPortfolio } from "@/actions/public"
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Code, Briefcase, MessageCircle, Download, GraduationCap, MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import { PublicNavbar } from "@/components/public/navbar"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ParticlesBackground } from "@/components/ui/particles-background"
import { Typewriter } from "@/components/ui/typewriter"
import { TiltCard } from "@/components/ui/tilt-card"
import { ProjectRequestWidget } from "@/components/public/project-request-widget"
import { PublicFooter } from "@/components/public/footer"

export default async function PublicHomePage() {
  const portfolio = await getPublicPortfolio()

  if (!portfolio) {
    notFound()
  }

  const profile = portfolio.profiles?.[0]
  const settings = portfolio.siteSettings
  const projects = portfolio.projects || []
  const posts = portfolio.blogs || []
  const skills = portfolio.skills || []
  const certifications = portfolio.certifications || []

  const experiences = portfolio.experiences || []
  const educations = portfolio.educations || []

  const roles = [
    profile?.title || "Full-Stack Software Engineer",
    "SaaS Application Architect",
    "High-Performance Web Developer",
    "AI Systems Integrator"
  ]

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
      <ParticlesBackground />
      
      <PublicNavbar settings={settings} resumeUrl={profile?.resumeUrl} />

      <main className="relative">
        
        {/* Animated Background Orbs */}
        <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse mix-blend-screen" />
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] animate-pulse mix-blend-screen" style={{ animationDelay: '2s' }} />
        </div>

        {/* HERO SECTION */}
        <section id="hero" className="pt-20 pb-32 max-w-5xl mx-auto px-4 flex flex-col items-center text-center relative z-10">
          <Badge variant="outline" className="mb-8 rounded-full px-4 py-1.5 text-sm border-primary/50 text-primary bg-primary/10 shadow-[0_0_15px_var(--primary)]/20 backdrop-blur-md font-medium tracking-wide">
            Available for new opportunities
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-tight">
            <span className="text-foreground mr-4 md:block md:mb-2 md:mr-0">Hi, I'm</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-purple-500 animate-gradient-x drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]">
              {profile?.name || "Developer"}
            </span>
          </h1>
          
          <h2 className="text-xl md:text-3xl text-muted-foreground/80 max-w-3xl mb-12 font-medium min-h-[40px] leading-relaxed">
            I am a <Typewriter words={roles} />
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
            <a 
              href="#projects" 
              className={cn(buttonVariants({ size: "lg" }), "h-14 rounded-full px-10 text-lg font-bold shadow-[0_0_30px_var(--primary)]/40 hover:shadow-[0_0_50px_var(--primary)]/60 transition-all hover:scale-105 border border-primary/50")}
            >
              Explore Work
            </a>
            {profile?.resumeUrl ? (
              <a 
                href="#resume"
                className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-14 rounded-full px-10 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 border-border/50 bg-background/50 backdrop-blur-md group")}
              >
                <Download className="mr-2 h-5 w-5 group-hover:-translate-y-1 transition-transform" />
                View Resume
              </a>
            ) : (
              <a 
                href="#contact"
                className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-14 rounded-full px-10 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 border-border/50 bg-background/50 backdrop-blur-md")}
              >
                Contact Me
              </a>
            )}
          </div>
          
          <div className="flex items-center gap-8 mt-16 text-muted-foreground">
            {profile?.githubUrl && (
              <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="hover:text-primary hover:drop-shadow-[0_0_10px_var(--primary)] transition-all hover:scale-110">
                <Code className="h-7 w-7" />
              </a>
            )}
            {profile?.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-primary hover:drop-shadow-[0_0_10px_var(--primary)] transition-all hover:scale-110">
                <Briefcase className="h-7 w-7" />
              </a>
            )}
            {profile?.twitterUrl && (
              <a href={profile.twitterUrl} target="_blank" rel="noreferrer" className="hover:text-primary hover:drop-shadow-[0_0_10px_var(--primary)] transition-all hover:scale-110">
                <MessageCircle className="h-7 w-7" />
              </a>
            )}
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="py-28 relative border-t border-border/20 bg-background/30 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 text-center">About Me</h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
              
              {/* Bio Details */}
              <div className="md:col-span-7 space-y-6">
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Crafting code, shaping the future of web architecture.
                </h3>
                <p className="text-lg text-muted-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {profile?.bio || "A passionate software developer focused on building modern, high-performance web applications with exceptional user experiences."}
                </p>
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-border/10">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-primary tracking-wider">Name</h4>
                    <p className="text-sm font-medium mt-1">{profile?.name || "Developer"}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-primary tracking-wider">Role</h4>
                    <p className="text-sm font-medium mt-1">{profile?.title || "Full-Stack Engineer"}</p>
                  </div>
                  {profile?.email && (
                    <div>
                      <h4 className="text-xs font-bold uppercase text-primary tracking-wider">Email</h4>
                      <p className="text-sm font-medium mt-1">{profile.email}</p>
                    </div>
                  )}
                  {profile?.phone && (
                    <div>
                      <h4 className="text-xs font-bold uppercase text-primary tracking-wider">Phone</h4>
                      <p className="text-sm font-medium mt-1">{profile.phone}</p>
                    </div>
                  )}
                  {profile?.location && (
                    <div>
                      <h4 className="text-xs font-bold uppercase text-primary tracking-wider">Location</h4>
                      <p className="text-sm font-medium mt-1">{profile.location}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Image with Tilt */}
              <div className="md:col-span-5 flex justify-center">
                {profile?.profileImage ? (
                  <TiltCard maxTilt={12} scale={1.03} className="relative group rounded-3xl overflow-hidden border border-primary/20 shadow-[0_0_50px_var(--primary)]/10 max-w-sm w-full aspect-square">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent z-10 pointer-events-none" />
                    <img
                      src={profile.profileImage}
                      alt={profile?.name || "Developer"}
                      className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                    />
                  </TiltCard>
                ) : (
                  <div className="relative group rounded-3xl overflow-hidden border border-primary/20 bg-muted/20 flex items-center justify-center max-w-sm w-full aspect-square text-muted-foreground">
                    No profile image uploaded
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* SKILLS SECTION */}
        {skills.length > 0 && (
          <section id="skills" className="py-24 relative border-t border-border/20 bg-background/50 backdrop-blur-3xl">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 text-center">Technical Arsenal</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {skills.map((skill: any) => (
                  <div key={skill.id} className="group relative p-6 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_var(--primary)]/20 hover:-translate-y-1">
                    <h3 className="font-bold text-lg mb-3 text-foreground/90 group-hover:text-primary transition-colors">{skill.name}</h3>
                    <div className="w-full bg-muted/50 rounded-full h-1.5 mt-4 overflow-hidden">
                      <div 
                        className="bg-primary h-1.5 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_var(--primary)]" 
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* EXPERIENCE SECTION */}
        {experiences.length > 0 && (
          <section id="experience" className="py-24 border-t border-border/20 bg-background/50 backdrop-blur-md relative">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 text-center">Work Experience</h2>
              
              <div className="relative border-l-2 border-primary/20 ml-4 md:ml-6 space-y-12 pb-6">
                {experiences.map((exp: any) => {
                  const startDateStr = new Date(exp.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric"
                  })
                  const endDateStr = exp.current
                    ? "Present"
                    : exp.endDate
                    ? new Date(exp.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                    : "N/A"

                  return (
                    <div key={exp.id} className="relative pl-8 md:pl-10 group">
                      {/* Timeline node */}
                      <span className="absolute -left-[9px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-background border-2 border-primary group-hover:bg-primary group-hover:scale-125 transition-all duration-300 shadow-[0_0_10px_var(--primary)]" />
                      
                      <div className="space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                          <div>
                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{exp.position}</h3>
                            <p className="text-primary font-medium text-sm">{exp.company}</p>
                          </div>
                          <span className="inline-flex items-center text-xs font-semibold text-muted-foreground bg-muted/40 border border-border/40 px-2.5 py-1 rounded-full w-fit">
                            <Calendar className="w-3.5 h-3.5 mr-1" />
                            {startDateStr} - {endDateStr}
                          </span>
                        </div>

                        {exp.location && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5" />
                            {exp.location}
                          </div>
                        )}

                        {exp.description && (
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed mt-2">
                            {exp.description}
                          </p>
                        )}

                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {exp.technologies.map((tech: string) => (
                              <span key={tech} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted/30 text-foreground border border-border/20">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* EDUCATION SECTION */}
        {educations.length > 0 && (
          <section id="education" className="py-24 border-t border-border/20 bg-background/30 backdrop-blur-md relative">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 text-center">Education</h2>
              
              <div className="relative border-l-2 border-primary/20 ml-4 md:ml-6 space-y-12 pb-6">
                {educations.map((edu: any) => {
                  const startDateStr = new Date(edu.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric"
                  })
                  const endDateStr = edu.current
                    ? "Present"
                    : edu.endDate
                    ? new Date(edu.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                    : "N/A"

                  return (
                    <div key={edu.id} className="relative pl-8 md:pl-10 group">
                      {/* Timeline node */}
                      <span className="absolute -left-[9px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-background border-2 border-purple-500 group-hover:bg-purple-500 group-hover:scale-125 transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                      
                      <div className="space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                          <div>
                            <h3 className="text-xl font-bold text-foreground group-hover:text-purple-400 transition-colors">{edu.degree}</h3>
                            <p className="text-purple-400 font-medium text-sm">
                              {edu.institution}
                              {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                            </p>
                          </div>
                          <span className="inline-flex items-center text-xs font-semibold text-muted-foreground bg-muted/40 border border-border/40 px-2.5 py-1 rounded-full w-fit">
                            <Calendar className="w-3.5 h-3.5 mr-1" />
                            {startDateStr} - {endDateStr}
                          </span>
                        </div>

                        {edu.description && (
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed mt-2">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* PROJECTS SECTION */}
        {projects.length > 0 && (
          <section id="projects" className="py-32 max-w-7xl mx-auto px-4 relative">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Featured Work</h2>
                <p className="text-xl text-muted-foreground">Digital experiences that push boundaries.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {projects.map((project: any) => (
                <TiltCard key={project.id} maxTilt={8} scale={1.01} className="group rounded-3xl border border-border/20 bg-card/20 backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_40px_var(--primary)]/10 hover:-translate-y-2">
                  {project.imageUrl && (
                    <div className="w-full h-80 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80 z-10" />
                      <img 
                        src={project.imageUrl} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                    </div>
                  )}
                  <div className={`p-8 relative z-20 ${project.imageUrl ? '-mt-12' : ''}`}>
                    <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors drop-shadow-md">{project.title}</h3>
                    <p className="text-muted-foreground mb-8 text-base md:text-lg line-clamp-2 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {project.technologies.slice(0, 4).map((tech: string) => (
                        <Badge key={tech} variant="secondary" className="bg-muted/50 hover:bg-primary/20 hover:text-primary border-border/30 px-3 py-1 text-xs md:text-sm transition-colors">{tech}</Badge>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATIONS SECTION */}
        {certifications.length > 0 && (
          <section id="certifications" className="py-24 border-y border-border/20 bg-muted/10 relative backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 text-center">Credentials</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {certifications.map((cert: any) => (
                  <TiltCard key={cert.id} maxTilt={10} scale={1.01} className="group rounded-2xl border border-border/20 bg-card/30 backdrop-blur shadow-lg flex flex-col overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_var(--primary)]/10">
                    {cert.imageUrl && (
                      <div className="h-48 overflow-hidden relative border-b border-border/10 bg-black/50">
                        <img src={cert.imageUrl} alt={cert.name} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-bold text-xl mb-2 text-foreground/90">{cert.name}</h3>
                      <p className="text-muted-foreground font-medium mb-6">{cert.issuer}</p>
                      <div className="mt-auto">
                        {cert.url ? (
                          <a href={cert.url} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary hover:drop-shadow-[0_0_8px_var(--primary)] transition-all flex items-center">
                            Verify Credential <ArrowRight className="ml-1 w-4 h-4" />
                          </a>
                        ) : (
                          <span className="text-sm text-muted-foreground">{new Date(cert.createdAt).getFullYear()}</span>
                        )}
                      </div>
                    </div>
                  </TiltCard>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* RESUME SECTION */}
        {profile?.resumeUrl && (
          <section id="resume" className="py-24 border-y border-border/20 relative backdrop-blur-sm bg-background/30">
            <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8 text-center">Resume</h2>
              <div className="w-full max-w-4xl h-[80vh] min-h-[600px] max-h-[1000px] border border-border/50 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] relative group">
                <div className="absolute inset-0 bg-primary/5 pointer-events-none group-hover:bg-transparent transition-colors" />
                <iframe 
                  src={`${profile.resumeUrl}#toolbar=0&navpanes=0`} 
                  className="w-full h-full border-none bg-zinc-900/50 backdrop-blur-3xl"
                  title="Resume PDF Viewer"
                />
              </div>
              <div className="mt-12">
                <a 
                  href={profile.resumeUrl} 
                  download 
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-14 rounded-full px-10 text-lg shadow-[0_0_20px_var(--primary)]/20 hover:shadow-[0_0_30px_var(--primary)]/40 transition-all hover:scale-105 border-primary/50 text-primary bg-primary/10 hover:bg-primary/20")}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download PDF
                </a>
              </div>
            </div>
          </section>
        )}

        {/* CONTACT SECTION */}
        <section id="contact" className="py-40 max-w-3xl mx-auto px-4 text-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent -z-10 blur-3xl" />
          <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-8">Let's build magic.</h2>
          <p className="text-xl text-muted-foreground mb-16">
            Ready to push boundaries? Drop a message and let's talk.
          </p>
          
          <div className="bg-card/40 backdrop-blur-2xl border border-primary/20 p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] text-left relative z-10">
            <form action={async (formData) => {
              "use server";
              const { submitContactMessage } = await import("@/actions/contact");
              formData.append("portfolioId", portfolio.id);
              await submitContactMessage(formData);
            }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Name</label>
                  <input id="name" name="name" type="text" required className="flex h-14 w-full rounded-xl border border-border/50 bg-background/50 px-4 py-2 text-base ring-offset-background placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Email</label>
                  <input id="email" name="email" type="email" required className="flex h-14 w-full rounded-xl border border-border/50 bg-background/50 px-4 py-2 text-base ring-offset-background placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Message</label>
                <textarea id="message" name="message" required className="flex min-h-[160px] w-full rounded-xl border border-border/50 bg-background/50 px-4 py-4 text-base ring-offset-background placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all"></textarea>
              </div>
              <Button type="submit" size="lg" className="w-full rounded-xl text-lg font-bold h-14 shadow-[0_0_20px_var(--primary)]/40 hover:shadow-[0_0_40px_var(--primary)]/60 transition-all hover:-translate-y-1 border border-primary/50">
                Send Transmission
              </Button>
            </form>
          </div>
        </section>
      </main>

      <ProjectRequestWidget portfolioId={portfolio.id} />

      <PublicFooter profile={profile} settings={settings} />
    </div>
  )
}
