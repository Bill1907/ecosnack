import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

function getDatabaseUrl(): string {
  // process.env.DATABASE_URL is injected via Vite's define in development
  // and via Cloudflare secrets in production
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not configured')
  }

  return databaseUrl
}

export function getDb() {
  const databaseUrl = getDatabaseUrl()
  const sql = neon(databaseUrl)
  return drizzle(sql, { schema })
}
