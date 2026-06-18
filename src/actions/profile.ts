"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function getProfile() {
  const session = await auth()
  if (!session?.user?.portfolioId) return null

  return await prisma.profile.findFirst({
    where: { portfolioId: session.user.portfolioId }
  })
}

export async function updateProfile(formData: FormData) {
  const session = await auth()
  if (!session?.user?.portfolioId) return { error: "Unauthorized" }

  const id = formData.get("id") as string

  try {
    const data = {
      name: formData.get("name") as string,
      title: formData.get("title") as string,
      bio: formData.get("bio") as string,
      resumeUrl: formData.get("resumeUrl") as string,
      profileImage: formData.get("profileImage") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      location: formData.get("location") as string,
      githubUrl: formData.get("githubUrl") as string,
      linkedinUrl: formData.get("linkedinUrl") as string,
      twitterUrl: formData.get("twitterUrl") as string,
      telegramUrl: formData.get("telegramUrl") as string,
      instagramUrl: formData.get("instagramUrl") as string,
    }

    if (id) {
      await prisma.profile.update({
        where: { id, portfolioId: session.user.portfolioId },
        data
      })
    } else {
      await prisma.profile.create({
        data: {
          portfolioId: session.user.portfolioId,
          ...data
        }
      })
    }

    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Failed to update profile" }
  }
}
