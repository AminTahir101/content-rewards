// Edge-compatible auth — JWT only, no Prisma adapter.
// Used exclusively in middleware (Edge Runtime).
import NextAuth from 'next-auth'
import type { UserRole } from '@/generated/prisma/enums'

export const { auth } = NextAuth({
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: UserRole }).role
        token.id = user.id as string
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
      }
      return session
    },
  },
})
