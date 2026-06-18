"use client"

import { useState, useRef } from "react"
import { updateProfile } from "@/actions/profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, UploadCloud, Image as ImageIcon } from "lucide-react"
import Link from "next/link"

export function ProfileForm({ initialData }: { initialData: any }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [message, setMessage] = useState("")
  const [parseMessage, setParseMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form State
  const [formDataState, setFormDataState] = useState({
    name: initialData?.name || "",
    title: initialData?.title || "",
    bio: initialData?.bio || "",
    resumeUrl: initialData?.resumeUrl || "",
    profileImage: initialData?.profileImage || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    location: initialData?.location || "",
    githubUrl: initialData?.githubUrl || "",
    linkedinUrl: initialData?.linkedinUrl || "",
    twitterUrl: initialData?.twitterUrl || "",
    telegramUrl: initialData?.telegramUrl || "",
    instagramUrl: initialData?.instagramUrl || ""
  })

  async function handleAIParse(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsParsing(true)
    setParseMessage("Reading resume and extracting intelligence...")
    
    const fd = new FormData()
    fd.append("file", file)

    try {
      const res = await fetch("/api/parse-resume", {
        method: "POST",
        body: fd
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to parse resume")

      if (json.data?.profile) {
        setFormDataState(prev => ({
          ...prev,
          name: json.data.profile.name || prev.name,
          title: json.data.profile.title || prev.title,
          bio: json.data.profile.bio || prev.bio,
          githubUrl: json.data.profile.githubUrl || prev.githubUrl,
          linkedinUrl: json.data.profile.linkedinUrl || prev.linkedinUrl,
          resumeUrl: json.resumeUrl || prev.resumeUrl,
        }))
        setParseMessage("Resume successfully parsed! Profile auto-filled.")
      }
    } catch (error: any) {
      console.error(error)
      setParseMessage(error.message)
    } finally {
      setIsParsing(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function action(formData: FormData) {
    setIsLoading(true)
    setMessage("")
    const res = await updateProfile(formData)
    setIsLoading(false)
    if (res.error) setMessage(res.error)
    else setMessage("Profile saved successfully!")
  }

  return (
    <div className="space-y-6">
      <Card className="max-w-2xl shadow-md border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0 shadow-inner">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Magic Auto-Fill</h3>
              <p className="text-sm text-muted-foreground mb-3">Upload your PDF Resume. Our Gemini AI will instantly parse it and auto-fill your Profile, Skills, and Experience.</p>
              
              <div className="flex items-center gap-3">
                <input 
                  type="file" 
                  accept="application/pdf" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleAIParse}
                />
                <Button 
                  type="button" 
                  variant="default" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isParsing}
                >
                  <UploadCloud className="mr-2 h-4 w-4" />
                  {isParsing ? "Analyzing AI..." : "Upload Resume PDF"}
                </Button>
                {parseMessage && <span className="text-xs font-medium text-primary animate-pulse">{parseMessage}</span>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20">
        <CardHeader>
          <CardTitle>Personal Profile</CardTitle>
          <CardDescription>Update your personal information and bio.</CardDescription>
        </CardHeader>
        <form action={action}>
          <input type="hidden" name="id" value={initialData?.id || ""} />
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={formDataState.name} onChange={e => setFormDataState({...formDataState, name: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Professional Title</Label>
                <Input id="title" name="title" value={formDataState.title} onChange={e => setFormDataState({...formDataState, title: e.target.value})} required />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea id="bio" name="bio" value={formDataState.bio} onChange={e => setFormDataState({...formDataState, bio: e.target.value})} required className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="profileImage">Profile Image URL</Label>
                <Link href="/admin/media" target="_blank" className="text-xs text-primary hover:underline flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" /> Upload to Media Library
                </Link>
              </div>
              <Input id="profileImage" name="profileImage" value={formDataState.profileImage} onChange={e => setFormDataState({...formDataState, profileImage: e.target.value})} placeholder="/uploads/..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resumeUrl">Resume URL (Optional)</Label>
              <Input id="resumeUrl" name="resumeUrl" value={formDataState.resumeUrl} onChange={e => setFormDataState({...formDataState, resumeUrl: e.target.value})} placeholder="https://..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Public Contact Email</Label>
                <Input id="email" name="email" value={formDataState.email} onChange={e => setFormDataState({...formDataState, email: e.target.value})} placeholder="mohit@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" value={formDataState.phone} onChange={e => setFormDataState({...formDataState, phone: e.target.value})} placeholder="+91 XXXXXXXXXX" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" value={formDataState.location} onChange={e => setFormDataState({...formDataState, location: e.target.value})} placeholder="Pune, India" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input id="githubUrl" name="githubUrl" value={formDataState.githubUrl} onChange={e => setFormDataState({...formDataState, githubUrl: e.target.value})} placeholder="https://github.com/..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input id="linkedinUrl" name="linkedinUrl" value={formDataState.linkedinUrl} onChange={e => setFormDataState({...formDataState, linkedinUrl: e.target.value})} placeholder="https://linkedin.com/in/..." />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="twitterUrl">Twitter URL</Label>
                <Input id="twitterUrl" name="twitterUrl" value={formDataState.twitterUrl} onChange={e => setFormDataState({...formDataState, twitterUrl: e.target.value})} placeholder="https://twitter.com/..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telegramUrl">Telegram URL</Label>
                <Input id="telegramUrl" name="telegramUrl" value={formDataState.telegramUrl} onChange={e => setFormDataState({...formDataState, telegramUrl: e.target.value})} placeholder="https://t.me/..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagramUrl">Instagram URL</Label>
                <Input id="instagramUrl" name="instagramUrl" value={formDataState.instagramUrl} onChange={e => setFormDataState({...formDataState, instagramUrl: e.target.value})} placeholder="https://instagram.com/..." />
              </div>
            </div>

            {message && <p className="text-sm font-medium text-green-600">{message}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Saving..." : "Save Profile"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
