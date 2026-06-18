"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getExperiences() {
  const session = await auth()
  if (!session?.user?.portfolioId) return []

  return await prisma.experience.findMany({
    where: { portfolioId: session.user.portfolioId },
    orderBy: { startDate: "desc" }
  })
}

export async function upsertExperience(formData: FormData) {
  const session = await auth()
  if (!session?.user?.portfolioId) return { error: "Unauthorized" }

  const id = formData.get("id") as string
  const company = formData.get("company") as string
  const position = formData.get("position") as string
  const location = formData.get("location") as string
  const startDateStr = formData.get("startDate") as string
  const endDateStr = formData.get("endDate") as string
  const current = formData.get("current") === "true" || formData.get("current") === "on"
  const description = formData.get("description") as string
  const technologiesStr = formData.get("technologies") as string

  if (!company || !position || !startDateStr) {
    return { error: "Missing required fields" }
  }

  try {
    const startDate = new Date(startDateStr)
    const endDate = current || !endDateStr ? null : new Date(endDateStr)
    const technologies = technologiesStr
      ? technologiesStr.split(",").map((t) => t.trim()).filter(Boolean)
      : []

    const data = {
      company,
      position,
      location: location || null,
      startDate,
      endDate,
      current,
      description,
      technologies
    }

    if (id) {
      await prisma.experience.update({
        where: { id, portfolioId: session.user.portfolioId },
        data
      })
    } else {
      await prisma.experience.create({
        data: { portfolioId: session.user.portfolioId, ...data }
      })
    }

    revalidatePath("/admin/experience")
    revalidatePath("/")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to save experience:", error)
    return { error: "Failed to save experience" }
  }
}

export async function deleteExperience(id: string) {
  const session = await auth()
  if (!session?.user?.portfolioId) return { error: "Unauthorized" }

  try {
    await prisma.experience.delete({
      where: { id, portfolioId: session.user.portfolioId }
    })
    revalidatePath("/admin/experience")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { error: "Failed to delete experience" }
  }
}
