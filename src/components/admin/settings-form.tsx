"use client"

import { useState } from "react"
import { updateSiteSettings } from "@/actions/settings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function SettingsForm({ initialData }: { initialData: any }) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function action(formData: FormData) {
    setIsLoading(true)
    setMessage("")
    const res = await updateSiteSettings(formData)
    setIsLoading(false)
    if (res.error) setMessage(res.error)
    else setMessage("Settings saved successfully!")
  }

  return (
    <Card className="max-w-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20">
      <CardHeader>
        <CardTitle>Site Settings</CardTitle>
        <CardDescription>Manage your global portfolio settings.</CardDescription>
      </CardHeader>
      <form action={action}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input id="siteName" name="siteName" defaultValue={initialData?.siteName || ""} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteDescription">Site Description</Label>
            <Input id="siteDescription" name="siteDescription" defaultValue={initialData?.siteDescription || ""} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteUrl">Site URL</Label>
            <Input id="siteUrl" name="siteUrl" defaultValue={initialData?.siteUrl || ""} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoTitle">SEO Title</Label>
            <Input id="seoTitle" name="seoTitle" defaultValue={initialData?.seoTitle || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoDescription">SEO Description</Label>
            <Input id="seoDescription" name="seoDescription" defaultValue={initialData?.seoDescription || ""} />
          </div>
          {message && <p className="text-sm font-medium">{message}</p>}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>Save Settings</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
