import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

function createPrismaClient() {
  const connectionString =
    process.env.POSTGRES_PRISMA_URL ?? process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('No database connection string found (POSTGRES_PRISMA_URL or DATABASE_URL)')
  }
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
