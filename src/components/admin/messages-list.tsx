"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { markMessageAsRead, deleteMessage } from "@/actions/contact"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, MailOpen, Mail } from "lucide-react"

export function MessagesList({ initialMessages }: { initialMessages: any[] }) {
  const router = useRouter()
  const [messages, setMessages] = useState(initialMessages)

  async function handleMarkAsRead(id: string) {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m))
    await markMessageAsRead(id)
    router.refresh()
  }

  async function handleDelete(id: string) {
    setMessages(prev => prev.filter(m => m.id !== id))
    await deleteMessage(id)
    router.refresh()
  }

  if (messages.length === 0) {
    return (
      <Card className="text-center py-12 border-dashed">
        <CardContent>
          <Mail className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium">No messages yet</h3>
          <p className="text-sm text-muted-foreground mt-1">When people contact you via your portfolio, their messages will appear here.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <Card key={msg.id} className={`transition-all duration-300 ${!msg.isRead ? 'border-primary/50 shadow-sm bg-primary/5' : 'bg-card'}`}>
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <CardTitle className="text-lg">{msg.name}</CardTitle>
                {!msg.isRead && <Badge className="bg-primary">New</Badge>}
              </div>
              <CardDescription className="text-sm">
                <a href={`mailto:${msg.email}`} className="hover:underline">{msg.email}</a>
                <span className="mx-2">•</span>
                {new Date(msg.createdAt).toLocaleDateString()}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {!msg.isRead && (
                <Button variant="ghost" size="icon" onClick={() => handleMarkAsRead(msg.id)} title="Mark as read">
                  <MailOpen className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(msg.id)} title="Delete message">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap text-foreground/90 bg-background/50 p-4 rounded-lg border border-border/50">
              {msg.message}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
