"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function submitContactMessage(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const message = formData.get("message") as string
  const subject = formData.get("subject") as string || null
  const portfolioId = formData.get("portfolioId") as string

  if (!name || !email || !message || !portfolioId) {
    return { error: "Missing required fields." }
  }

  try {
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
        portfolioId
      }
    })
    return { success: true }
  } catch (error) {
    console.error("Failed to submit contact message:", error)
    return { error: "Failed to send message. Please try again later." }
  }
}

export async function getContactMessages() {
  const session = await auth()
  if (!session?.user?.portfolioId) return []

  return await prisma.contactMessage.findMany({
    where: { portfolioId: session.user.portfolioId },
    orderBy: { createdAt: "desc" }
  })
}

export async function markMessageAsRead(id: string) {
  const session = await auth()
  if (!session?.user?.portfolioId) return { error: "Unauthorized" }

  try {
    await prisma.contactMessage.update({
      where: { id, portfolioId: session.user.portfolioId },
      data: { isRead: true }
    })
    revalidatePath("/admin/messages")
    return { success: true }
  } catch (error) {
    return { error: "Failed to update message" }
  }
}

export async function deleteMessage(id: string) {
  const session = await auth()
  if (!session?.user?.portfolioId) return { error: "Unauthorized" }

  try {
    await prisma.contactMessage.delete({
      where: { id, portfolioId: session.user.portfolioId }
    })
    revalidatePath("/admin/messages")
    return { success: true }
  } catch (error) {
    return { error: "Failed to delete message" }
  }
}
