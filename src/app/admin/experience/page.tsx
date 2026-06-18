import { getExperiences } from "@/actions/experience"
import { bulkImportExperiencesFromResume } from "@/actions/bulk-import"
import { Button } from "@/components/ui/button"
import { Wand2 } from "lucide-react"
import { ExperienceClient } from "@/components/admin/experience-client"

export default async function ExperiencePage() {
  const experiences = await getExperiences()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Work Experience</h1>
          <p className="text-muted-foreground">Manage your professional career timeline and achievements.</p>
        </div>
        <form action={async () => {
          "use server"
          await bulkImportExperiencesFromResume()
        }}>
          <Button type="submit" variant="secondary" className="gap-2">
            <Wand2 className="w-4 h-4" /> Auto-Import from Resume
          </Button>
        </form>
      </div>

      <ExperienceClient initialExperiences={experiences} />
    </div>
  )
}
