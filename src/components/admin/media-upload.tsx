"use client"

import { CldUploadWidget } from "next-cloudinary"
import { createMedia } from "@/actions/media"
import { Button } from "@/components/ui/button"
import { UploadCloud } from "lucide-react"

export function MediaUpload() {
  return (
    <CldUploadWidget 
      signatureEndpoint="/api/cloudinary"
      onSuccess={async (result: any) => {
        if (result.info) {
          await createMedia(result.info.secure_url, result.info.public_id)
        }
      }}
    >
      {({ open }) => {
        return (
          <Button onClick={() => open()} className="shadow-sm">
            <UploadCloud className="mr-2 h-4 w-4" /> Upload Media
          </Button>
        )
      }}
    </CldUploadWidget>
  )
}
