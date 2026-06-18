"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getSkills() {
  const session = await auth()
  if (!session?.user?.portfolioId) return []

  return await prisma.skill.findMany({
    where: { portfolioId: session.user.portfolioId },
    orderBy: { proficiency: "desc" }
  })
}

export async function upsertSkill(formData: FormData) {
  const session = await auth()
  if (!session?.user?.portfolioId) return { error: "Unauthorized" }

  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const category = formData.get("category") as string
  const proficiency = parseInt(formData.get("proficiency") as string || "0")

  if (!name || !category) return { error: "Missing required fields" }

  try {
    const data = { name, category, proficiency }

    if (id) {
      await prisma.skill.update({
        where: { id, portfolioId: session.user.portfolioId },
        data
      })
    } else {
      await prisma.skill.create({
        data: { portfolioId: session.user.portfolioId, ...data }
      })
    }

    revalidatePath("/admin/skills")
    return { success: true }
  } catch (error) {
    return { error: "Failed to save skill" }
  }
}

export async function deleteSkill(id: string) {
  const session = await auth()
  if (!session?.user?.portfolioId) return { error: "Unauthorized" }

  try {
    await prisma.skill.delete({
      where: { id, portfolioId: session.user.portfolioId }
    })
    revalidatePath("/admin/skills")
    return { success: true }
  } catch (error) {
    return { error: "Failed to delete skill" }
  }
}
