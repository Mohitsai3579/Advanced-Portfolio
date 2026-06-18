"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getEducations() {
  const session = await auth()
  if (!session?.user?.portfolioId) return []

  return await prisma.education.findMany({
    where: { portfolioId: session.user.portfolioId },
    orderBy: { startDate: "desc" }
  })
}

export async function upsertEducation(formData: FormData) {
  const session = await auth()
  if (!session?.user?.portfolioId) return { error: "Unauthorized" }

  const id = formData.get("id") as string
  const institution = formData.get("institution") as string
  const degree = formData.get("degree") as string
  const fieldOfStudy = formData.get("fieldOfStudy") as string
  const startDateStr = formData.get("startDate") as string
  const endDateStr = formData.get("endDate") as string
  const current = formData.get("current") === "true" || formData.get("current") === "on"
  const description = formData.get("description") as string

  if (!institution || !degree || !startDateStr) {
    return { error: "Missing required fields" }
  }

  try {
    const startDate = new Date(startDateStr)
    const endDate = current || !endDateStr ? null : new Date(endDateStr)

    const data = {
      institution,
      degree,
      fieldOfStudy: fieldOfStudy || null,
      startDate,
      endDate,
      current,
      description: description || null
    }

    if (id) {
      await prisma.education.update({
        where: { id, portfolioId: session.user.portfolioId },
        data
      })
    } else {
      await prisma.education.create({
        data: { portfolioId: session.user.portfolioId, ...data }
      })
    }

    revalidatePath("/admin/education")
    revalidatePath("/")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to save education:", error)
    return { error: "Failed to save education" }
  }
}

export async function deleteEducation(id: string) {
  const session = await auth()
  if (!session?.user?.portfolioId) return { error: "Unauthorized" }

  try {
    await prisma.education.delete({
      where: { id, portfolioId: session.user.portfolioId }
    })
    revalidatePath("/admin/education")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { error: "Failed to delete education" }
  }
}
