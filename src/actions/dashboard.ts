"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function getDashboardStats() {
  const session = await auth()
  if (!session?.user?.portfolioId) return null

  const portfolioId = session.user.portfolioId

  try {
    const [
      visitorCount,
      projectCount,
      skillCount,
      messageCount,
      recentMessages,
      recentViews,
      profile,
      settings
    ] = await Promise.all([
      prisma.pageView.count({ where: { portfolioId } }),
      prisma.project.count({ where: { portfolioId } }),
      prisma.skill.count({ where: { portfolioId } }),
      prisma.contactMessage.count({ where: { portfolioId } }),
      prisma.contactMessage.findMany({
        where: { portfolioId },
        orderBy: { createdAt: "desc" },
        take: 5
      }),
      prisma.pageView.findMany({
        where: { portfolioId },
        orderBy: { createdAt: "desc" },
        take: 8
      }),
      prisma.profile.findFirst({ where: { portfolioId } }),
      prisma.siteSettings.findFirst({ where: { portfolioId } })
    ])

    // Calculate profile completion setup score
    let setupScore = 0
    let maxScore = 7

    if (profile?.name) setupScore++
    if (profile?.title) setupScore++
    if (profile?.bio) setupScore++
    if (profile?.profileImage) setupScore++
    if (profile?.resumeUrl) setupScore++
    if (profile?.linkedinUrl || profile?.githubUrl) setupScore++
    if (settings?.siteName) setupScore++

    const progressPercentage = Math.round((setupScore / maxScore) * 100)

    return {
      visitorCount,
      projectCount,
      skillCount,
      messageCount,
      recentMessages,
      recentViews,
      progressPercentage
    }
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return null
  }
}
