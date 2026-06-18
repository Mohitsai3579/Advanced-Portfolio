"use client"

import { useState } from "react"
import { upsertEducation, deleteEducation } from "@/actions/education"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Edit3, X, Calendar, GraduationCap } from "lucide-react"

export function EducationClient({ initialEducations }: { initialEducations: any[] }) {
  const [educations, setEducations] = useState(initialEducations)
  const [editingEdu, setEditingEdu] = useState<any | null>(null)
  const [message, setMessage] = useState("")

  const [formData, setFormData] = useState({
    id: "",
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    current: false,
    description: ""
  })

  // Format date helper to convert Date objects/ISO strings to YYYY-MM-DD for inputs
  const formatDateForInput = (dateVal: any) => {
    if (!dateVal) return ""
    const date = new Date(dateVal)
    if (isNaN(date.getTime())) return ""
    return date.toISOString().split("T")[0]
  }

  const handleEdit = (edu: any) => {
    setEditingEdu(edu)
    setFormData({
      id: edu.id,
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy || "",
      startDate: formatDateForInput(edu.startDate),
      endDate: formatDateForInput(edu.endDate),
      current: edu.current,
      description: edu.description || ""
    })
    setMessage("")
  }

  const handleCancel = () => {
    setEditingEdu(null)
    setFormData({
      id: "",
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      current: false,
      description: ""
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage("")

    const fd = new FormData()
    if (formData.id) fd.append("id", formData.id)
    fd.append("institution", formData.institution)
    fd.append("degree", formData.degree)
    fd.append("fieldOfStudy", formData.fieldOfStudy)
    fd.append("startDate", formData.startDate)
    fd.append("endDate", formData.current ? "" : formData.endDate)
    fd.append("current", formData.current ? "true" : "false")
    fd.append("description", formData.description)

    const res = await upsertEducation(fd)
    if (res.error) {
      setMessage(`Error: ${res.error}`)
    } else {
      setMessage(formData.id ? "Education updated successfully!" : "Education added successfully!")
      window.location.reload()
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this education?")) {
      const res = await deleteEducation(id)
      if (res.error) {
        alert(res.error)
      } else {
        setEducations(educations.filter(edu => edu.id !== id))
        if (editingEdu?.id === id) {
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
                <GraduationCap className="w-5 h-5 text-primary" />
                {editingEdu ? "Edit Education" : "Add Education"}
              </span>
              {editingEdu && (
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
                <label className="text-xs font-semibold text-muted-foreground">Institution / School *</label>
                <Input 
                  name="institution" 
                  placeholder="e.g. Stanford University" 
                  value={formData.institution}
                  onChange={e => setFormData({...formData, institution: e.target.value})}
                  required 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Degree *</label>
                <Input 
                  name="degree" 
                  placeholder="e.g. Bachelor of Science" 
                  value={formData.degree}
                  onChange={e => setFormData({...formData, degree: e.target.value})}
                  required 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Field of Study</label>
                <Input 
                  name="fieldOfStudy" 
                  placeholder="e.g. Computer Science" 
                  value={formData.fieldOfStudy}
                  onChange={e => setFormData({...formData, fieldOfStudy: e.target.value})}
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
                  I currently study here
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Description / Extra Details</label>
                <Textarea
                  name="description"
                  placeholder="Describe details like coursework, honors, projects, etc..."
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              {message && <p className="text-xs font-medium text-primary mt-2 animate-pulse">{message}</p>}

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingEdu ? "Update Education" : "Add Education"}
                </Button>
                {editingEdu && (
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
        <h2 className="text-xl font-bold tracking-tight">Academic Timeline</h2>
        {educations.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No education history added yet. Add your first education entry on the left or auto-import.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {educations.map((edu) => {
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
                <Card key={edu.id} className={`shadow-sm border transition-colors ${editingEdu?.id === edu.id ? "border-primary bg-primary/5 shadow-primary/5" : "hover:border-primary/20"}`}>
                  <CardContent className="p-5 flex justify-between items-start gap-4">
                    <div className="space-y-2 flex-1">
                      <div>
                        <h3 className="font-bold text-lg leading-snug">{edu.degree}</h3>
                        <p className="text-primary font-medium text-sm">
                          {edu.institution}
                          {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {startDateStr} - {endDateStr}
                        </span>
                      </div>

                      {edu.description && (
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-2 leading-relaxed">
                          {edu.description}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(edu)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(edu.id)}
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
