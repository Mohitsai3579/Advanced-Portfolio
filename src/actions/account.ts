"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import bcrypt from "bcryptjs"

export async function getAccountSettings() {
  const session = await auth()
  if (!session?.user?.id) return null

  return await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, name: true }
  })
}

export async function updateAccountSettings(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const email = formData.get("email") as string
  const name = formData.get("name") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!email) {
    return { error: "Email is required" }
  }

  try {
    const data: any = { email, name }

    if (password) {
      if (password !== confirmPassword) {
        return { error: "Passwords do not match" }
      }
      if (password.length < 6) {
        return { error: "Password must be at least 6 characters" }
      }
      data.password = await bcrypt.hash(password, 10)
    }

    // Check if email is taken
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: session.user.id }
      }
    })

    if (existingUser) {
      return { error: "Email is already in use" }
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data
    })

    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Failed to update account credentials" }
  }
}
