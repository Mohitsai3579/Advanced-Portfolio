"use client"

import { useState } from "react"
import { updateAccountSettings } from "@/actions/account"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock } from "lucide-react"

export function AccountForm({ initialData }: { initialData: any }) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    email: initialData?.email || "",
    name: initialData?.name || "",
    password: "",
    confirmPassword: ""
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")
    setError("")

    const fd = new FormData()
    fd.append("email", formData.email)
    fd.append("name", formData.name)
    if (formData.password) {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        setIsLoading(false)
        return
      }
      fd.append("password", formData.password)
      fd.append("confirmPassword", formData.confirmPassword)
    }

    const res = await updateAccountSettings(fd)
    setIsLoading(false)
    
    if (res.error) {
      setError(res.error)
    } else {
      setMessage("Account credentials updated successfully!")
      // Clear password fields
      setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }))
    }
  }

  return (
    <Card className="max-w-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          Account Credentials
        </CardTitle>
        <CardDescription>Update your admin login email and password.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountName">Display Name</Label>
              <Input 
                id="accountName" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountEmail">Login Email *</Label>
              <Input 
                id="accountEmail" 
                type="email" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountPassword">New Password (Leave blank to keep current)</Label>
              <Input 
                id="accountPassword" 
                type="password" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                value={formData.confirmPassword}
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          </div>

          {message && <p className="text-sm font-medium text-green-600">{message}</p>}
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Save Credentials"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
