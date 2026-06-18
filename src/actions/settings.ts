"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function getSiteSettings() {
  const session = await auth()
  if (!session?.user?.portfolioId) return null

  return await prisma.siteSettings.findUnique({
    where: { portfolioId: session.user.portfolioId }
  })
}

export async function updateSiteSettings(formData: FormData) {
  const session = await auth()
  if (!session?.user?.portfolioId) return { error: "Unauthorized" }

  try {
    const data = {
      siteName: formData.get("siteName") as string,
      siteDescription: formData.get("siteDescription") as string,
      siteUrl: formData.get("siteUrl") as string,
      seoTitle: formData.get("seoTitle") as string,
      seoDescription: formData.get("seoDescription") as string,
    }

    const settings = await prisma.siteSettings.upsert({
      where: { portfolioId: session.user.portfolioId },
      update: data,
      create: {
        portfolioId: session.user.portfolioId,
        ...data,
      }
    })

    return { success: true, data: settings }
  } catch (error) {
    console.error(error)
    return { error: "Failed to update settings" }
  }
}
