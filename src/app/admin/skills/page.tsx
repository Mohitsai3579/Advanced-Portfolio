import { getSkills } from "@/actions/skills"
import { bulkImportSkillsFromResume } from "@/actions/bulk-import"
import { Button } from "@/components/ui/button"
import { Wand2 } from "lucide-react"
import { SkillsClient } from "@/components/admin/skills-client"

export default async function SkillsPage() {
  const skills = await getSkills()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
          <p className="text-muted-foreground">Manage your technical skills and proficiency levels.</p>
        </div>
        <form action={async () => {
          "use server"
          await bulkImportSkillsFromResume()
        }}>
          <Button type="submit" variant="secondary" className="gap-2">
            <Wand2 className="w-4 h-4" /> Auto-Import from Resume
          </Button>
        </form>
      </div>

      <SkillsClient initialSkills={skills} />
    </div>
  )
}
