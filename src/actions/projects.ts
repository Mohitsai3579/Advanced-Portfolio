"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getProjects() {
  const session = await auth()
  if (!session?.user?.portfolioId) return []

  return await prisma.project.findMany({
    where: { portfolioId: session.user.portfolioId },
    orderBy: { createdAt: "desc" }
  })
}

export async function getProject(id: string) {
  const session = await auth()
  if (!session?.user?.portfolioId) return null

  return await prisma.project.findUnique({
    where: { id, portfolioId: session.user.portfolioId }
  })
}

export async function upsertProject(formData: FormData) {
  const session = await auth()
  if (!session?.user?.portfolioId) return { error: "Unauthorized" }

  const id = formData.get("id") as string
  const techString = formData.get("technologies") as string
  const technologies = techString ? techString.split(",").map(t => t.trim()).filter(Boolean) : []

  const data = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    content: formData.get("content") as string,
    imageUrl: formData.get("imageUrl") as string,
    githubUrl: formData.get("githubUrl") as string,
    liveUrl: formData.get("liveUrl") as string,
    technologies,
    featured: formData.get("featured") === "true",
  }

  try {
    if (id) {
      await prisma.project.update({
        where: { id, portfolioId: session.user.portfolioId },
        data
      })
    } else {
      await prisma.project.create({
        data: {
          ...data,
          portfolioId: session.user.portfolioId
        }
      })
    }

    revalidatePath("/admin/projects")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Failed to save project. Ensure slug is unique." }
  }
}

export async function deleteProject(id: string) {
  const session = await auth()
  if (!session?.user?.portfolioId) return { error: "Unauthorized" }

  try {
    await prisma.project.delete({
      where: { id, portfolioId: session.user.portfolioId }
    })
    revalidatePath("/admin/projects")
    return { success: true }
  } catch (error) {
    return { error: "Failed to delete project" }
  }
}
