import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.portfolioId = user.portfolioId
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string
        session.user.portfolioId = token.portfolioId as string
      }
      return session
    },
  },
  providers: [], // Overridden/expanded in src/auth.ts
} satisfies NextAuthConfig
