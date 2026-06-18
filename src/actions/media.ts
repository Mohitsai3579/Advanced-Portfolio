"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getMedia() {
  const session = await auth()
  if (!session?.user?.portfolioId) return []

  return await prisma.media.findMany({
    where: { portfolioId: session.user.portfolioId },
    orderBy: { createdAt: "desc" }
  })
}

export async function createMedia(fileUrl: string, fileName: string) {
  const session = await auth()
  if (!session?.user?.portfolioId) return { error: "Unauthorized" }

  try {
    const media = await prisma.media.create({
      data: {
        fileUrl,
        fileName,
        fileType: "image",
        size: 0,
        portfolioId: session.user.portfolioId
      }
    })
    revalidatePath("/admin/media")
    return { success: true, data: media }
  } catch (error) {
    return { error: "Failed to save media record" }
  }
}

export async function deleteMedia(id: string) {
  const session = await auth()
  if (!session?.user?.portfolioId) return { error: "Unauthorized" }

  try {
    await prisma.media.delete({
      where: { id, portfolioId: session.user.portfolioId }
    })
    revalidatePath("/admin/media")
    return { success: true }
  } catch (error) {
    return { error: "Failed to delete media" }
  }
}
