import { getEducations } from "@/actions/education"
import { bulkImportEducationsFromResume } from "@/actions/bulk-import"
import { Button } from "@/components/ui/button"
import { Wand2 } from "lucide-react"
import { EducationClient } from "@/components/admin/education-client"

export default async function EducationPage() {
  const educations = await getEducations()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Education</h1>
          <p className="text-muted-foreground">Manage your academic achievements and degrees.</p>
        </div>
        <form action={async () => {
          "use server"
          await bulkImportEducationsFromResume()
        }}>
          <Button type="submit" variant="secondary" className="gap-2">
            <Wand2 className="w-4 h-4" /> Auto-Import from Resume
          </Button>
        </form>
      </div>

      <EducationClient initialEducations={educations} />
    </div>
  )
}
