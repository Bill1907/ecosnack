import { createServerFn } from '@tanstack/react-start'
import { zodValidator } from '@tanstack/zod-adapter'
import { getDb } from '@/db'
import { articles, categoryStats } from '@/db/schema'
import { eq, desc, sql } from 'drizzle-orm'
import { z } from 'zod'

// 전체 기사 목록 조회
export const getArticles = createServerFn().handler(async () => {
  const db = getDb()
  const result = await db
    .select()
    .from(articles)
    .orderBy(desc(articles.pubDate))

  return result
})

// 단일 기사 조회
export const getArticleById = createServerFn()
  .inputValidator(zodValidator(z.number()))
  .handler(async ({ data: id }) => {
    const db = getDb()
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
  .handler(async ({ data: category }) => {
    const db = getDb()
    const result = await db
      .select()
      .from(articles)
      .where(eq(articles.category, category))
      .orderBy(desc(articles.pubDate))

    return result
  })

// 카테고리 통계 조회 (Materialized View 사용)
export const getCategoryStats = createServerFn().handler(async () => {
  const db = getDb()
  const result = await db
    .select()
    .from(categoryStats)
    .orderBy(desc(categoryStats.articleCount))

  return result
})

// 카테고리 목록만 조회
export const getCategories = createServerFn().handler(async () => {
  const db = getDb()
  const result = await db
    .select({ category: categoryStats.category })
    .from(categoryStats)
    .orderBy(categoryStats.category)

  return result.map((row) => row.category)
})

// Materialized View 갱신 (기사 추가 후 호출)
export const refreshCategoryStats = createServerFn().handler(async () => {
  const db = getDb()
  await db.execute(sql`REFRESH MATERIALIZED VIEW category_stats`)
  return { success: true }
})
