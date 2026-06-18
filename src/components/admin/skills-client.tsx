"use client"

import { useState } from "react"
import { upsertSkill, deleteSkill } from "@/actions/skills"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Edit3, Plus, X, FolderGit2 } from "lucide-react"

export function SkillsClient({ initialSkills }: { initialSkills: any[] }) {
  const [skills, setSkills] = useState(initialSkills)
  const [editingSkill, setEditingSkill] = useState<any | null>(null)
  const [message, setMessage] = useState("")

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "",
    proficiency: ""
  })

  const handleEdit = (skill: any) => {
    setEditingSkill(skill)
    setFormData({
      id: skill.id,
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency.toString()
    })
    setMessage("")
  };

  const handleCancel = () => {
    setEditingSkill(null)
    setFormData({ id: "", name: "", category: "", proficiency: "" })
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage("")
    
    const fd = new FormData()
    if (formData.id) fd.append("id", formData.id)
    fd.append("name", formData.name)
    fd.append("category", formData.category)
    fd.append("proficiency", formData.proficiency)

    const res = await upsertSkill(fd)
    if (res.error) {
      setMessage(`Error: ${res.error}`)
    } else {
      setMessage(formData.id ? "Skill updated successfully!" : "Skill added successfully!")
      // Fetch skills list updates locally or reload
      window.location.reload()
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      const res = await deleteSkill(id)
      if (res.error) {
        alert(res.error)
      } else {
        setSkills(skills.filter(s => s.id !== id))
        if (editingSkill?.id === id) {
          handleCancel()
        }
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form Column */}
      <div className="lg:col-span-1">
        <Card className="shadow-sm sticky top-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-primary" />
                {editingSkill ? "Edit Skill" : "Add Skill"}
              </span>
              {editingSkill && (
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
                <label className="text-xs font-semibold text-muted-foreground">Skill Name *</label>
                <Input 
                  name="name" 
                  placeholder="e.g. React" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  required 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Category *</label>
                <Input 
                  name="category" 
                  placeholder="e.g. Frontend" 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})} 
                  required 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Proficiency (0-100) *</label>
                <Input 
                  type="number" 
                  name="proficiency" 
                  placeholder="85" 
                  max="100" 
                  min="0"
                  value={formData.proficiency} 
                  onChange={e => setFormData({...formData, proficiency: e.target.value})} 
                  required 
                />
              </div>

              {message && <p className="text-xs font-medium text-primary mt-2 animate-pulse">{message}</p>}

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingSkill ? "Update Skill" : "Add Skill"}
                </Button>
                {editingSkill && (
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
        <h2 className="text-xl font-bold tracking-tight">Active Skills</h2>
        {skills.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No skills added yet. Add your first skill or import from resume.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill) => (
              <Card key={skill.id} className={`shadow-sm border transition-colors ${editingSkill?.id === skill.id ? "border-primary bg-primary/5 shadow-primary/5" : "hover:border-primary/20"}`}>
                <CardContent className="flex justify-between items-center p-4">
                  <div className="flex-1 mr-4">
                    <h3 className="font-bold text-base leading-snug">{skill.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{skill.category} • {skill.proficiency}%</p>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${skill.proficiency}%` }}></div>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEdit(skill)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(skill.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
