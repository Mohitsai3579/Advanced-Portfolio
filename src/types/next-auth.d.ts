import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    role?: string
    portfolioId?: string
  }

  interface Session {
    user: {
      role?: string
      portfolioId?: string
    } & DefaultSession["user"]
  }
}
