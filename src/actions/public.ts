"use server"

import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"

export async function getPublicPortfolio(pageName: string = "home") {
  const portfolio = await prisma.portfolio.findUnique({
    where: { subdomain: "default" },
    include: {
      profiles: true,
      siteSettings: true,
      skills: { orderBy: { proficiency: "desc" } },
      experiences: { orderBy: { startDate: "desc" } },
      educations: { orderBy: { startDate: "desc" } },
      certifications: { orderBy: { createdAt: "desc" } },
      achievements: { orderBy: { createdAt: "desc" } },
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

  if (portfolio) {
    try {
      const headerList = await headers()
      const country = headerList.get("x-vercel-ip-country") || "Local/Unknown"
      const userAgent = headerList.get("user-agent") || ""
      const isMobile = /mobile/i.test(userAgent)
      const isTablet = /ipad|tablet/i.test(userAgent)
      const device = isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop"

      await prisma.pageView.create({
        data: {
          portfolioId: portfolio.id,
          page: pageName,
          country,
          device
        }
      })
    } catch (err) {
      console.error("Failed to log page view:", err)
    }
  }

  return portfolio
}
