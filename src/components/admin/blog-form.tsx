"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { upsertPost } from "@/actions/blogs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function BlogForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  let initialContent = ""
  try {
    initialContent = initialData?.contentJson ? JSON.parse(initialData.contentJson) : ""
  } catch (e) {
    initialContent = initialData?.contentJson || ""
  }

  async function action(formData: FormData) {
    setIsLoading(true)
    setError("")
    
    const published = formData.get("published") === "on" ? "true" : "false"
    formData.set("published", published)

    const res = await upsertPost(formData)
    setIsLoading(false)

    if (res.error) {
      setError(res.error)
    } else {
      router.push("/admin/blogs")
    }
  }

  return (
    <Card className="max-w-4xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/20">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Post" : "Create Post"}</CardTitle>
        <CardDescription>Write and publish your blog posts here.</CardDescription>
      </CardHeader>
      <form action={action}>
        {initialData && <input type="hidden" name="id" value={initialData.id} />}
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Post Title</Label>
              <Input id="title" name="title" defaultValue={initialData?.title || ""} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input id="slug" name="slug" defaultValue={initialData?.slug || ""} required />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="excerpt">Short Excerpt (for previews)</Label>
            <Textarea id="excerpt" name="excerpt" defaultValue={initialData?.excerpt || ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Post Content (Markdown or HTML)</Label>
            <Textarea id="content" name="content" defaultValue={initialContent} required className="min-h-[300px] font-mono text-sm" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <Input id="coverImage" name="coverImage" defaultValue={initialData?.coverImage || ""} />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch id="published" name="published" defaultChecked={initialData?.published} />
            <Label htmlFor="published">Publish immediately</Label>
          </div>

          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.push("/admin/blogs")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Post"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
