"use client"

import { useState } from "react"
import { upsertCertification, deleteCertification } from "@/actions/certifications"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Edit3, X, FileText, Link as LinkIcon, Image as ImageIcon } from "lucide-react"
import Link from "next/link"

export function CertificationsClient({ initialCertifications }: { initialCertifications: any[] }) {
  const [certs, setCerts] = useState(initialCertifications)
  const [editingCert, setEditingCert] = useState<any | null>(null)
  const [message, setMessage] = useState("")

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    issuer: "",
    url: "",
    imageUrl: "",
    issueDate: ""
  })

  // Format date helper to convert Date objects/ISO strings to YYYY-MM-DD for inputs
  const formatDateForInput = (dateVal: any) => {
    if (!dateVal) return ""
    const date = new Date(dateVal)
    if (isNaN(date.getTime())) return ""
    return date.toISOString().split("T")[0]
  }

  const handleEdit = (cert: any) => {
    setEditingCert(cert)
    setFormData({
      id: cert.id,
      name: cert.name,
      issuer: cert.issuer,
      url: cert.url || "",
      imageUrl: cert.imageUrl || "",
      issueDate: formatDateForInput(cert.issueDate)
    })
    setMessage("")
  }

  const handleCancel = () => {
    setEditingCert(null)
    setFormData({
      id: "",
      name: "",
      issuer: "",
      url: "",
      imageUrl: "",
      issueDate: ""
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage("")

    const fd = new FormData()
    if (formData.id) fd.append("id", formData.id)
    fd.append("name", formData.name)
    fd.append("issuer", formData.issuer)
    fd.append("url", formData.url)
    fd.append("imageUrl", formData.imageUrl)
    fd.append("issueDate", formData.issueDate)

    const res = await upsertCertification(fd)
    if (res.error) {
      setMessage(`Error: ${res.error}`)
    } else {
      setMessage(formData.id ? "Certification updated successfully!" : "Certification added successfully!")
      window.location.reload()
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this certification?")) {
      const res = await deleteCertification(id)
      if (res.error) {
        alert(res.error)
      } else {
        setCerts(certs.filter(c => c.id !== id))
        if (editingCert?.id === id) {
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
                <FileText className="w-5 h-5 text-primary" />
                {editingCert ? "Edit Credential" : "Add Certification"}
              </span>
              {editingCert && (
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
                <label className="text-xs font-semibold text-muted-foreground">Certification Name *</label>
                <Input 
                  name="name" 
                  placeholder="e.g. AWS Solutions Architect" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Issuer *</label>
                <Input 
                  name="issuer" 
                  placeholder="e.g. Amazon Web Services" 
                  value={formData.issuer}
                  onChange={e => setFormData({...formData, issuer: e.target.value})}
                  required 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Issue Date</label>
                <Input 
                  type="date" 
                  name="issueDate" 
                  value={formData.issueDate}
                  onChange={e => setFormData({...formData, issueDate: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Credential URL (Optional)</label>
                <Input 
                  name="url" 
                  placeholder="https://..." 
                  value={formData.url}
                  onChange={e => setFormData({...formData, url: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-muted-foreground">Image URL (Optional)</label>
                  <Link href="/admin/media" target="_blank" className="text-xs text-primary hover:underline flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" /> Get from Media
                  </Link>
                </div>
                <Input 
                  name="imageUrl" 
                  placeholder="/uploads/..." 
                  value={formData.imageUrl}
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                />
              </div>

              {message && <p className="text-xs font-medium text-primary mt-2 animate-pulse">{message}</p>}

              <div className="flex gap-2">
                <Button type="submit" className="w-full">
                  {editingCert ? "Update Certification" : "Add Certification"}
                </Button>
                {editingCert && (
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
        <h2 className="text-xl font-bold tracking-tight">Credentials</h2>
        {certs.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No certifications added yet. Add your first credential on the left.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certs.map((cert) => (
              <Card key={cert.id} className={`shadow-sm border overflow-hidden flex ${editingCert?.id === cert.id ? "border-primary bg-primary/5 shadow-primary/5" : "hover:border-primary/20"}`}>
                {cert.imageUrl && (
                  <img src={cert.imageUrl} alt={cert.name} className="w-24 h-24 object-cover border-r border-border shrink-0" />
                )}
                <CardContent className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base leading-snug">{cert.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{cert.issuer}</p>
                    {cert.url && (
                      <a href={cert.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2">
                        <LinkIcon className="w-3 h-3" /> Verify Credential
                      </a>
                    )}
                  </div>

                  <div className="flex gap-1 justify-end mt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(cert)}
                      className="text-muted-foreground hover:text-foreground h-8 w-8"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(cert.id)}
                      className="text-destructive hover:bg-destructive/10 h-8 w-8"
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
