"use client"

import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button 
      variant="secondary" 
      size="icon" 
      type="button"
      className="h-8 w-8 rounded-full shadow-lg hover:bg-background" 
      onClick={handleCopy}
      title="Copy Image URL"
    >
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-foreground" />}
    </Button>
  )
}
