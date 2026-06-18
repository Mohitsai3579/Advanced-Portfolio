"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getCertifications() {
  const session = await auth()
  if (!session?.user?.portfolioId) return []

  return await prisma.certification.findMany({
    where: { portfolioId: session.user.portfolioId },
    orderBy: { createdAt: "desc" }
  })
}

export async function upsertCertification(formData: FormData) {
  const session = await auth()
  if (!session?.user?.portfolioId) return { error: "Unauthorized" }

  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const issuer = formData.get("issuer") as string
  const url = formData.get("url") as string
  const imageUrl = formData.get("imageUrl") as string
  const issueDateStr = formData.get("issueDate") as string

  if (!name || !issuer) return { error: "Missing required fields" }

  try {
    const data = { 
      name, 
      issuer, 
      url, 
      imageUrl,
      issueDate: issueDateStr ? new Date(issueDateStr) : null
    }

    if (id) {
      await prisma.certification.update({
        where: { id, portfolioId: session.user.portfolioId },
        data
      })
    } else {
      await prisma.certification.create({
        data: { portfolioId: session.user.portfolioId, ...data }
      })
    }

    revalidatePath("/admin/certifications")
    return { success: true }
  } catch (error) {
    return { error: "Failed to save certification" }
  }
}

export async function deleteCertification(id: string) {
  const session = await auth()
  if (!session?.user?.portfolioId) return { error: "Unauthorized" }

  try {
    await prisma.certification.delete({
      where: { id, portfolioId: session.user.portfolioId }
    })
    revalidatePath("/admin/certifications")
    return { success: true }
  } catch (error) {
    return { error: "Failed to delete certification" }
  }
}
