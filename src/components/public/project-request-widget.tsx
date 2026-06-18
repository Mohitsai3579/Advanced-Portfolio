"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Check, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ProjectRequestWidget({ portfolioId }: { portfolioId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "SaaS Application",
    budget: "$1k - $5k",
    description: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const fd = new FormData()
    fd.append("name", formData.name)
    fd.append("email", formData.email)
    fd.append("portfolioId", portfolioId)
    fd.append("subject", `Project Request: ${formData.projectType} (${formData.budget})`)
    fd.append("message", `Project Type: ${formData.projectType}\nEstimated Budget: ${formData.budget}\n\nProject Details:\n${formData.description}`)

    try {
      const { submitContactMessage } = await import("@/actions/contact")
      const result = await submitContactMessage(fd)
      if (result.success) {
        setIsSuccess(true)
        setTimeout(() => {
          setIsSuccess(false)
          setIsOpen(false)
          setFormData({
            name: "",
            email: "",
            projectType: "SaaS Application",
            budget: "$1k - $5k",
            description: ""
          })
        }, 2000)
      } else {
        alert(result.error || "Failed to submit request")
      }
    } catch (err) {
      console.error(err)
      alert("Failed to send submission")
    } finally {
      setIsLoading(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      {/* Floating Scroll to Top (Bottom Right) */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full bg-yellow-500 hover:bg-yellow-600 active:scale-95 text-background flex items-center justify-center shadow-lg hover:shadow-yellow-500/20 transition-all cursor-pointer font-bold border border-yellow-400/20"
        title="Scroll to Top"
      >
        <ArrowUp className="w-5 h-5 text-black font-extrabold stroke-[3]" />
      </button>

      {/* Floating Project Request Button (Bottom Left) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-40 h-14 w-14 rounded-full bg-yellow-500 hover:bg-yellow-600 active:scale-95 text-background flex items-center justify-center shadow-lg hover:shadow-yellow-500/30 hover:scale-105 transition-all cursor-pointer border border-yellow-400/20"
        title="Hire Me / Request Project"
      >
        <MessageSquare className="w-6 h-6 text-black" />
      </button>

      {/* Floating Popup Form */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 left-6 z-50 w-full max-w-md bg-card/60 backdrop-blur-2xl border border-yellow-500/30 rounded-3xl shadow-[0_0_50px_rgba(234,179,8,0.15)] overflow-hidden"
          >
            <div className="bg-yellow-500/10 p-6 border-b border-yellow-500/20 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-lg text-yellow-500 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                  Request a Project
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Tell me about your vision and budget.</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              {isSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="h-12 w-12 rounded-full bg-yellow-500 flex items-center justify-center text-black shadow-[0_0_20px_rgba(234,179,8,0.4)] animate-bounce">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h4 className="font-bold text-lg text-yellow-500">Transmission Recieved!</h4>
                  <p className="text-sm text-muted-foreground max-w-[280px]">I will review your project request and respond within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-background/50 border border-border/50 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-yellow-500/50 transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-background/50 border border-border/50 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-yellow-500/50 transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Project Type</label>
                      <select
                        value={formData.projectType}
                        onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full bg-background/50 border border-border/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-yellow-500/50 transition-colors cursor-pointer text-foreground"
                      >
                        <option value="SaaS Application" className="bg-zinc-950 text-foreground">SaaS Application</option>
                        <option value="E-Commerce Site" className="bg-zinc-950 text-foreground">E-Commerce Site</option>
                        <option value="Mobile App" className="bg-zinc-950 text-foreground">Mobile App</option>
                        <option value="Custom AI/LLM Bot" className="bg-zinc-950 text-foreground">Custom AI/LLM Bot</option>
                        <option value="Portfolio / Landing" className="bg-zinc-950 text-foreground">Portfolio / Landing</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Estimated Budget</label>
                      <select
                        value={formData.budget}
                        onChange={e => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full bg-background/50 border border-border/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-yellow-500/50 transition-colors cursor-pointer text-foreground"
                      >
                        <option value="< $1k" className="bg-zinc-950 text-foreground">&lt; $1,000</option>
                        <option value="$1k - $5k" className="bg-zinc-950 text-foreground">$1,000 - $5,000</option>
                        <option value="$5k - $10k" className="bg-zinc-950 text-foreground">$5,000 - $10,000</option>
                        <option value="$10k+" className="bg-zinc-950 text-foreground">$10,000+</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Project Details</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-background/50 border border-border/50 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50 transition-colors min-h-[90px] max-h-[160px]"
                      placeholder="What are we building?"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-extrabold h-11 rounded-xl shadow-[0_0_15px_rgba(234,179,8,0.2)] hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all mt-2 border border-yellow-400/20"
                  >
                    {isLoading ? "Transmitting..." : "Send Request"}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
