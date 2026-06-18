import { getMedia, deleteMedia } from "@/actions/media"
import { MediaUpload } from "@/components/admin/media-upload"
import { CopyButton } from "@/components/admin/copy-button"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export default async function MediaPage() {
  const media = await getMedia()

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground mt-1">Manage your uploaded images and assets.</p>
        </div>
        <MediaUpload />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {media.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-xl border-border/50 bg-muted/10">
            No media found. Upload an image to get started.
          </div>
        ) : (
          media.map((item) => (
            <div key={item.id} className="group relative rounded-xl border border-border bg-card overflow-hidden shadow-sm aspect-square transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 border-border/50">
              <img 
                src={item.fileUrl} 
                alt="Media item" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                <CopyButton text={item.fileUrl} />
                <form action={async () => {
                  "use server"
                  await deleteMedia(item.id)
                }}>
                  <Button type="submit" variant="destructive" size="icon" className="h-8 w-8 rounded-full shadow-lg hover:bg-destructive">
                    <Trash2 className="h-4 w-4 text-white" />
                  </Button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
