import { createServerFn } from '@tanstack/react-start'
import { zodValidator } from '@tanstack/zod-adapter'
import { getDb } from '@/db'
import { articles } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { z } from 'zod'

// 전체 기사 목록 조회
export const getArticles = createServerFn().handler(async ({ context }) => {
  const db = getDb(context?.env as { DATABASE_URL?: string } | undefined)
  const result = await db
    .select()
    .from(articles)
    .orderBy(desc(articles.pubDate))

  return result
})

// 단일 기사 조회
export const getArticleById = createServerFn()
  .inputValidator(zodValidator(z.number()))
  .handler(async ({ data: id, context }) => {
    const db = getDb(context?.env as { DATABASE_URL?: string } | undefined)
    const result = await db
      .select()
      .from(articles)
      .where(eq(articles.id, id))
      .limit(1)

    return result[0] ?? null
  })

// 카테고리별 기사 조회
export const getArticlesByCategory = createServerFn()
  .inputValidator(zodValidator(z.string()))
  .handler(async ({ data: category, context }) => {
    const db = getDb(context?.env as { DATABASE_URL?: string } | undefined)
    const result = await db
      .select()
      .from(articles)
      .where(eq(articles.category, category))
      .orderBy(desc(articles.pubDate))

    return result
  })
