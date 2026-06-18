"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { upsertProject } from "@/actions/projects"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function ProjectForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function action(formData: FormData) {
    setIsLoading(true)
    setError("")
    
    // Checkbox mapping for FormData logic
    const featured = formData.get("featured") === "on" ? "true" : "false"
    formData.set("featured", featured)

    const res = await upsertProject(formData)
    setIsLoading(false)

    if (res.error) {
      setError(res.error)
    } else {
      router.push("/admin/projects")
    }
  }

  return (
    <Card className="max-w-3xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/20">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Project" : "Create Project"}</CardTitle>
        <CardDescription>Enter the details for your portfolio project.</CardDescription>
      </CardHeader>
      <form action={action}>
        {initialData && <input type="hidden" name="id" value={initialData.id} />}
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input id="title" name="title" defaultValue={initialData?.title || ""} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug / URL Path</Label>
              <Input id="slug" name="slug" defaultValue={initialData?.slug || ""} required />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea id="description" name="description" defaultValue={initialData?.description || ""} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Full Content / Case Study</Label>
            <Textarea id="content" name="content" defaultValue={initialData?.content || ""} className="min-h-[150px]" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Cover Image URL</Label>
            <Input id="imageUrl" name="imageUrl" defaultValue={initialData?.imageUrl || ""} />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input id="githubUrl" name="githubUrl" defaultValue={initialData?.githubUrl || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="liveUrl">Live Demo URL</Label>
              <Input id="liveUrl" name="liveUrl" defaultValue={initialData?.liveUrl || ""} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="technologies">Technologies (comma-separated)</Label>
            <Input id="technologies" name="technologies" defaultValue={initialData?.technologies?.join(", ") || ""} placeholder="React, Next.js, Tailwind" />
          </div>

          <div className="flex items-center gap-6 pt-4">
            <div className="flex items-center space-x-2">
              <Switch id="featured" name="featured" defaultChecked={initialData?.featured} />
              <Label htmlFor="featured">Featured Project</Label>
            </div>
          </div>

          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.push("/admin/projects")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Project"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
