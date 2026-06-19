"use client"

import { useState } from "react"
import { upsertAchievement, deleteAchievement } from "@/actions/achievements"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Edit3, X, Award, Link as LinkIcon } from "lucide-react"

export function AchievementsClient({ initialAchievements }: { initialAchievements: any[] }) {
  const [achievements, setAchievements] = useState(initialAchievements)
  const [editingAchievement, setEditingAchievement] = useState<any | null>(null)
  const [message, setMessage] = useState("")

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    issuer: "",
    date: "",
    description: "",
    link: ""
  })

  const handleEdit = (ach: any) => {
    setEditingAchievement(ach)
    setFormData({
      id: ach.id,
      title: ach.title,
      issuer: ach.issuer || "",
      date: ach.date || "",
      description: ach.description || "",
      link: ach.link || ""
    })
    setMessage("")
  }

  const handleCancel = () => {
    setEditingAchievement(null)
    setFormData({
      id: "",
      title: "",
      issuer: "",
      date: "",
      description: "",
      link: ""
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage("")

    const fd = new FormData()
    if (formData.id) fd.append("id", formData.id)
    fd.append("title", formData.title)
    fd.append("issuer", formData.issuer)
    fd.append("date", formData.date)
    fd.append("description", formData.description)
    fd.append("link", formData.link)

    const res = await upsertAchievement(fd)
    if (res.error) {
      setMessage(`Error: ${res.error}`)
    } else {
      setMessage(formData.id ? "Achievement updated successfully!" : "Achievement added successfully!")
      window.location.reload()
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this achievement?")) {
      const res = await deleteAchievement(id)
      if (res.error) {
        alert(res.error)
      } else {
        setAchievements(achievements.filter(a => a.id !== id))
        if (editingAchievement?.id === id) {
          handleCancel()
        }
      }
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form Column */}
      <div className="lg:col-span-1">
        <Card className="shadow-sm sticky top-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                {editingAchievement ? "Edit Achievement" : "Add Achievement"}
              </span>
              {editingAchievement && (
                <Button type="button" variant="ghost" size="icon" onClick={handleCancel} className="h-6 w-6 p-0">
                  <X className="w-4 h-4" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="id" value={formData.id} />
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Achievement Title *</label>
                <Input 
                  name="title" 
                  placeholder="e.g. 1st Place at Hackathon" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  required 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Issuer / Organizer</label>
                <Input 
                  name="issuer" 
                  placeholder="e.g. Google Cloud, University" 
                  value={formData.issuer}
                  onChange={e => setFormData({...formData, issuer: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Date / Year</label>
                <Input 
                  name="date" 
                  placeholder="e.g. June 2026 or 2025" 
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Verification Link (Optional)</label>
                <Input 
                  name="link" 
                  placeholder="https://..." 
                  value={formData.link}
                  onChange={e => setFormData({...formData, link: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Description (Optional)</label>
                <Textarea 
                  name="description" 
                  placeholder="Briefly describe what you achieved or details about the award..." 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="min-h-[80px]"
                />
              </div>

              {message && <p className="text-xs font-medium text-primary mt-2 animate-pulse">{message}</p>}

              <div className="flex gap-2">
                <Button type="submit" className="w-full">
                  {editingAchievement ? "Update" : "Add"}
                </Button>
                {editingAchievement && (
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Grid List Column */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Achievements & Honors</h2>
        {achievements.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No achievements added yet. Add your first honor on the left.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {achievements.map((ach) => (
              <Card key={ach.id} className={`shadow-sm border overflow-hidden flex flex-col justify-between ${editingAchievement?.id === ach.id ? "border-primary bg-primary/5 shadow-primary/5" : "hover:border-primary/20"}`}>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base leading-snug">{ach.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">
                          {ach.issuer && <span>{ach.issuer}</span>}
                          {ach.issuer && ach.date && <span className="mx-1.5">•</span>}
                          {ach.date && <span>{ach.date}</span>}
                        </p>
                        {ach.description && (
                          <p className="text-sm text-muted-foreground mt-2.5 whitespace-pre-wrap leading-relaxed">
                            {ach.description}
                          </p>
                        )}
                        {ach.link && (
                          <a href={ach.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-3">
                            <LinkIcon className="w-3.5 h-3.5" /> View Award / Certificate
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-1 shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(ach)}
                        className="text-muted-foreground hover:text-foreground h-8 w-8"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(ach.id)}
                        className="text-destructive hover:bg-destructive/10 h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
