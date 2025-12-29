import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

function getDatabaseUrl(env?: { DATABASE_URL?: string }): string {
  // Cloudflare Workers에서는 env 객체를 통해 환경 변수에 접근
  // 개발 환경에서는 process.env.DATABASE_URL이 Vite의 define을 통해 주입됨
  const databaseUrl = env?.DATABASE_URL || process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not configured')
  }

  return databaseUrl
}

export function getDb(env?: { DATABASE_URL?: string }) {
  const databaseUrl = getDatabaseUrl(env)
  const sql = neon(databaseUrl)
  return drizzle(sql, { schema })
}
