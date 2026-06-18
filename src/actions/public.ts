"use server"

import { prisma } from "@/lib/prisma"

export async function getPublicPortfolio() {
  const portfolio = await prisma.portfolio.findUnique({
    where: { subdomain: "default" },
    include: {
      profiles: true,
      siteSettings: true,
      skills: { orderBy: { proficiency: "desc" } },
      experiences: { orderBy: { startDate: "desc" } },
      educations: { orderBy: { startDate: "desc" } },
      certifications: { orderBy: { createdAt: "desc" } },
      projects: {
        orderBy: { featured: 'desc' },
        take: 6
      },
      blogs: {
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        take: 3
      }
    }
  })

  return portfolio
}
