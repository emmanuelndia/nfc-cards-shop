// lib/db.ts
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Vérifie que l'URL de la base de données existe
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables')
}

const connectionString = process.env.DATABASE_URL

const isLocalConnectionString = (value: string) => {
  const v = value.toLowerCase()
  return v.includes('localhost') || v.includes('127.0.0.1')
}

const prismaClientSingleton = () => {
  // Créer un pool de connexions PostgreSQL
  const pool = new Pool(
    isLocalConnectionString(connectionString)
      ? { connectionString }
      : {
          connectionString,
          ssl: { rejectUnauthorized: false },
        },
  )
  const adapter = new PrismaPg(pool)
  
  return new PrismaClient({ adapter })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma