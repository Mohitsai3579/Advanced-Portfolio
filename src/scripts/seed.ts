import "dotenv/config"
import { prisma } from "../lib/prisma"
import bcrypt from "bcryptjs"

async function main() {
  const existingPortfolio = await prisma.portfolio.findUnique({
    where: { subdomain: "default" }
  })

  let portfolioId = existingPortfolio?.id

  if (!portfolioId) {
    const portfolio = await prisma.portfolio.create({
      data: {
        name: "My Portfolio",
        subdomain: "default",
      }
    })
    portfolioId = portfolio.id
  }

  const passwordHash = await bcrypt.hash("admin123", 10)

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {
      password: passwordHash,
      portfolioId: portfolioId
    },
    create: {
      email: "admin@example.com",
      name: "Super Admin",
      password: passwordHash,
      role: "SUPER_ADMIN",
      portfolioId: portfolioId
    }
  })

  console.log("Seeding complete!")
  console.log("Admin Email:", admin.email)
  console.log("Admin Password: admin123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    process.exit(0)
  })
