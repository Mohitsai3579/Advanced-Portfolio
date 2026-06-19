import { getAchievements } from "@/actions/achievements"
import { AchievementsClient } from "@/components/admin/achievements-client"

export default async function AchievementsPage() {
  const achievements = await getAchievements()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
        <p className="text-muted-foreground">Manage your awards, contest honors, hackathons, and key milestones.</p>
      </div>

      <AchievementsClient initialAchievements={achievements} />
    </div>
  )
}
