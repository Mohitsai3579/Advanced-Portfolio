"use client"

import { useState } from "react"
import { upsertExperience, deleteExperience } from "@/actions/experience"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Edit3, X, Calendar, MapPin, Briefcase } from "lucide-react"

export function ExperienceClient({ initialExperiences }: { initialExperiences: any[] }) {
  const [experiences, setExperiences] = useState(initialExperiences)
  const [editingExp, setEditingExp] = useState<any | null>(null)
  const [message, setMessage] = useState("")

  const [formData, setFormData] = useState({
    id: "",
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    technologies: "",
    description: ""
  })

  // Format date helper to convert Date objects/ISO strings to YYYY-MM-DD for inputs
  const formatDateForInput = (dateVal: any) => {
    if (!dateVal) return ""
    const date = new Date(dateVal)
    if (isNaN(date.getTime())) return ""
    return date.toISOString().split("T")[0]
  }

  const handleEdit = (exp: any) => {
    setEditingExp(exp)
    setFormData({
      id: exp.id,
      company: exp.company,
      position: exp.position,
      location: exp.location || "",
      startDate: formatDateForInput(exp.startDate),
      endDate: formatDateForInput(exp.endDate),
      current: exp.current,
      technologies: exp.technologies ? exp.technologies.join(", ") : "",
      description: exp.description || ""
    })
    setMessage("")
  }

  const handleCancel = () => {
    setEditingExp(null)
    setFormData({
      id: "",
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      technologies: "",
      description: ""
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage("")

    const fd = new FormData()
    if (formData.id) fd.append("id", formData.id)
    fd.append("company", formData.company)
    fd.append("position", formData.position)
    fd.append("location", formData.location)
    fd.append("startDate", formData.startDate)
    fd.append("endDate", formData.current ? "" : formData.endDate)
    fd.append("current", formData.current ? "true" : "false")
    fd.append("technologies", formData.technologies)
    fd.append("description", formData.description)

    const res = await upsertExperience(fd)
    if (res.error) {
      setMessage(`Error: ${res.error}`)
    } else {
      setMessage(formData.id ? "Experience updated successfully!" : "Experience added successfully!")
      window.location.reload()
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this experience?")) {
      const res = await deleteExperience(id)
      if (res.error) {
        alert(res.error)
      } else {
        setExperiences(experiences.filter(exp => exp.id !== id))
        if (editingExp?.id === id) {
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
                <Briefcase className="w-5 h-5 text-primary" />
                {editingExp ? "Edit Experience" : "Add Experience"}
              </span>
              {editingExp && (
                <Button type="button" variant="ghost" size="icon-xs" onClick={handleCancel}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="id" value={formData.id} />
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Company Name *</label>
                <Input 
                  name="company" 
                  placeholder="e.g. Google" 
                  value={formData.company}
                  onChange={e => setFormData({...formData, company: e.target.value})}
                  required 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Position / Title *</label>
                <Input 
                  name="position" 
                  placeholder="e.g. Senior Software Engineer" 
                  value={formData.position}
                  onChange={e => setFormData({...formData, position: e.target.value})}
                  required 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Location</label>
                <Input 
                  name="location" 
                  placeholder="e.g. Mountain View, CA" 
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Start Date *</label>
                  <Input 
                    type="date" 
                    name="startDate" 
                    value={formData.startDate}
                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">End Date</label>
                  <Input 
                    type="date" 
                    name="endDate" 
                    value={formData.endDate}
                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                    disabled={formData.current}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="current"
                  name="current"
                  checked={formData.current}
                  onChange={e => setFormData({...formData, current: e.target.checked})}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="current" className="text-sm font-medium text-foreground cursor-pointer select-none">
                  I currently work here
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Technologies (comma-separated)</label>
                <Input 
                  name="technologies" 
                  placeholder="e.g. React, Next.js, Node.js" 
                  value={formData.technologies}
                  onChange={e => setFormData({...formData, technologies: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Description / Achievements</label>
                <Textarea
                  name="description"
                  placeholder="Describe key responsibilities and goals achieved..."
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              {message && <p className="text-xs font-medium text-primary mt-2 animate-pulse">{message}</p>}

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingExp ? "Update Experience" : "Add Experience"}
                </Button>
                {editingExp && (
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* List Column */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Current Timeline</h2>
        {experiences.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No experiences added yet. Add your first experience on the left or auto-import.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {experiences.map((exp) => {
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
                <Card key={exp.id} className={`shadow-sm border transition-colors ${editingExp?.id === exp.id ? "border-primary bg-primary/5 shadow-primary/5" : "hover:border-primary/20"}`}>
                  <CardContent className="p-5 flex justify-between items-start gap-4">
                    <div className="space-y-2 flex-1">
                      <div>
                        <h3 className="font-bold text-lg leading-snug">{exp.position}</h3>
                        <p className="text-primary font-medium text-sm">{exp.company}</p>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {startDateStr} - {endDateStr}
                        </span>
                        {exp.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {exp.location}
                          </span>
                        )}
                      </div>

                      {exp.description && (
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-2 leading-relaxed">
                          {exp.description}
                        </p>
                      )}

                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {exp.technologies.map((tech: string) => (
                            <span
                              key={tech}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-foreground border border-border"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(exp)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(exp.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
