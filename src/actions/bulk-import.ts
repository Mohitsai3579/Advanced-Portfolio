"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function bulkImportSkillsFromResume(formData?: FormData) {
  const session = await auth()
  if (!session?.user?.portfolioId) return { error: "Unauthorized" }

  const portfolio = await prisma.portfolio.findUnique({
    where: { id: session.user.portfolioId },
    select: { parsedResume: true }
  })

  const parsedResume = portfolio?.parsedResume as any
  if (!parsedResume || !parsedResume.skills || parsedResume.skills.length === 0) {
    return { error: "No skills found in parsed resume. Please upload a resume first via Profile." }
  }

  try {
    const newSkills = parsedResume.skills.map((s: any) => ({
      portfolioId: session.user.portfolioId,
      name: s.name,
      category: s.category || "General",
      proficiency: s.proficiency || 80
    }))

    await prisma.skill.createMany({
      data: newSkills,
      skipDuplicates: true
    })

    revalidatePath("/admin/skills")
    return { success: true }
  } catch (error) {
    return { error: "Failed to import skills" }
  }
}

export async function bulkImportProjectsFromResume(formData?: FormData) {
  const session = await auth()
  if (!session?.user?.portfolioId) return { error: "Unauthorized" }

  const portfolio = await prisma.portfolio.findUnique({
    where: { id: session.user.portfolioId },
    select: { parsedResume: true }
  })

  const parsedResume = portfolio?.parsedResume as any
  if (!parsedResume || !parsedResume.projects || parsedResume.projects.length === 0) {
    return { error: "No projects found in parsed resume. Please upload a resume first via Profile." }
  }

  try {
    const newProjects = parsedResume.projects.map((p: any) => ({
      portfolioId: session.user.portfolioId,
      title: p.title,
      slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: p.description,
      technologies: p.technologies || [],
      featured: true
    }))

    await prisma.project.createMany({
      data: newProjects,
      skipDuplicates: true
    })

    revalidatePath("/admin/projects")
    return { success: true }
  } catch (error) {
    return { error: "Failed to import projects" }
  }
}

export async function bulkImportExperiencesFromResume(formData?: FormData) {
  const session = await auth()
  if (!session?.user?.portfolioId) return { error: "Unauthorized" }

  const portfolio = await prisma.portfolio.findUnique({
    where: { id: session.user.portfolioId },
    select: { parsedResume: true }
  })

  const parsedResume = portfolio?.parsedResume as any
  if (!parsedResume || !parsedResume.experiences || parsedResume.experiences.length === 0) {
    return { error: "No work experience found in parsed resume. Please upload a resume first via Profile." }
  }

  try {
    const newExperiences = parsedResume.experiences.map((exp: any) => {
      let startDate = new Date()
      if (exp.startDate) {
        const parsed = Date.parse(exp.startDate)
        if (!isNaN(parsed)) startDate = new Date(parsed)
      }

      let endDate = null
      if (!exp.current && exp.endDate) {
        const parsed = Date.parse(exp.endDate)
        if (!isNaN(parsed)) endDate = new Date(parsed)
      }

      return {
        portfolioId: session.user.portfolioId,
        company: exp.company || "Unknown Company",
        position: exp.position || "Software Engineer",
        location: exp.location || null,
        startDate,
        endDate,
        current: !!exp.current,
        description: exp.description || "",
        technologies: exp.technologies || []
      }
    })

    await prisma.experience.createMany({
      data: newExperiences,
      skipDuplicates: true
    })

    revalidatePath("/admin/experience")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to import experiences:", error)
    return { error: "Failed to import experiences" }
  }
}

export async function bulkImportEducationsFromResume(formData?: FormData) {
  const session = await auth()
  if (!session?.user?.portfolioId) return { error: "Unauthorized" }

  const portfolio = await prisma.portfolio.findUnique({
    where: { id: session.user.portfolioId },
    select: { parsedResume: true }
  })

  const parsedResume = portfolio?.parsedResume as any
  if (!parsedResume || !parsedResume.educations || parsedResume.educations.length === 0) {
    return { error: "No education entries found in parsed resume. Please upload a resume first via Profile." }
  }

  try {
    const newEducations = parsedResume.educations.map((edu: any) => {
      let startDate = new Date()
      if (edu.startDate) {
        const parsed = Date.parse(edu.startDate)
        if (!isNaN(parsed)) startDate = new Date(parsed)
      }

      let endDate = null
      if (!edu.current && edu.endDate) {
        const parsed = Date.parse(edu.endDate)
        if (!isNaN(parsed)) endDate = new Date(parsed)
      }

      return {
        portfolioId: session.user.portfolioId,
        institution: edu.institution || "Unknown Institution",
        degree: edu.degree || "Degree",
        fieldOfStudy: edu.fieldOfStudy || null,
        startDate,
        endDate,
        current: !!edu.current,
        description: edu.description || null
      }
    })

    await prisma.education.createMany({
      data: newEducations,
      skipDuplicates: true
    })

    revalidatePath("/admin/education")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to import educations:", error)
    return { error: "Failed to import educations" }
  }
}
