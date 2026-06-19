"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getAchievements() {
  const session = await auth()
  if (!session?.user?.portfolioId) return []

  return await prisma.achievement.findMany({
    where: { portfolioId: session.user.portfolioId },
    orderBy: { createdAt: "desc" }
  })
}

export async function upsertAchievement(formData: FormData) {
  const session = await auth()
  if (!session?.user?.portfolioId) return { error: "Unauthorized" }

  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const issuer = formData.get("issuer") as string
  const date = formData.get("date") as string
  const description = formData.get("description") as string
  const link = formData.get("link") as string

  if (!title) return { error: "Title is required" }

  try {
    const data = { title, issuer, date, description, link }

    if (id) {
      await prisma.achievement.update({
        where: { id, portfolioId: session.user.portfolioId },
        data
      })
    } else {
      await prisma.achievement.create({
        data: { portfolioId: session.user.portfolioId, ...data }
      })
    }

    revalidatePath("/admin/achievements")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Failed to save achievement" }
  }
}

export async function deleteAchievement(id: string) {
  const session = await auth()
  if (!session?.user?.portfolioId) return { error: "Unauthorized" }

  try {
    await prisma.achievement.delete({
      where: { id, portfolioId: session.user.portfolioId }
    })
    revalidatePath("/admin/achievements")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Failed to delete achievement" }
  }
}
