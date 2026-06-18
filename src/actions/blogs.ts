"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getPosts() {
  const session = await auth()
  if (!session?.user?.portfolioId) return []

  return await prisma.blog.findMany({
    where: { portfolioId: session.user.portfolioId },
    orderBy: { createdAt: "desc" }
  })
}

export async function getPost(id: string) {
  const session = await auth()
  if (!session?.user?.portfolioId) return null

  return await prisma.blog.findUnique({
    where: { id, portfolioId: session.user.portfolioId }
  })
}

export async function upsertPost(formData: FormData) {
  const session = await auth()
  if (!session?.user?.portfolioId || !session?.user?.id) return { error: "Unauthorized" }

  const id = formData.get("id") as string
  
  // Store content as a JSON string to satisfy Prisma Json type
  const contentString = formData.get("content") as string
  const contentJson = JSON.stringify(contentString)

  const data = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    excerpt: formData.get("excerpt") as string,
    contentJson,
    coverImage: formData.get("coverImage") as string,
    published: formData.get("published") === "true",
    authorId: session.user.id,
  }

  try {
    if (id) {
      await prisma.blog.update({
        where: { id, portfolioId: session.user.portfolioId },
        data
      })
    } else {
      await prisma.blog.create({
        data: {
          ...data,
          portfolioId: session.user.portfolioId
        }
      })
    }

    revalidatePath("/admin/blogs")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Failed to save blog post. Ensure slug is unique." }
  }
}

export async function deletePost(id: string) {
  const session = await auth()
  if (!session?.user?.portfolioId) return { error: "Unauthorized" }

  try {
    await prisma.blog.delete({
      where: { id, portfolioId: session.user.portfolioId }
    })
    revalidatePath("/admin/blogs")
    return { success: true }
  } catch (error) {
    return { error: "Failed to delete blog post" }
  }
}
