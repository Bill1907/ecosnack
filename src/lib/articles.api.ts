import { createServerFn } from '@tanstack/react-start'
import { zodValidator } from '@tanstack/zod-adapter'
import { getDb } from '@/db'
import { articles, categoryStats } from '@/db/schema'
import { eq, desc, sql, and, or, lt } from 'drizzle-orm'
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

// 페이지네이션 입력 스키마
const PaginationInputSchema = z.object({
  limit: z.number().min(1).max(50).default(12),
  cursor: z
    .object({
      pubDate: z.string().nullable(),
      id: z.number(),
    })
    .optional(),
  category: z.string().optional(),
})

// 페이지네이션 기사 조회 (무한 스크롤용)
export const getArticlesPaginated = createServerFn()
  .inputValidator(zodValidator(PaginationInputSchema))
  .handler(async ({ data }) => {
    const db = getDb()
    const { limit, cursor, category } = data

    // 조건 배열
    const conditions = []

    // 카테고리 필터
    if (category) {
      conditions.push(eq(articles.category, category))
    }

    // 커서 기반 페이지네이션 조건
    // (pubDate < cursor.pubDate) OR (pubDate = cursor.pubDate AND id < cursor.id)
    if (cursor) {
      const cursorDate = cursor.pubDate ? new Date(cursor.pubDate) : null
      if (cursorDate) {
        conditions.push(
          or(
            lt(articles.pubDate, cursorDate),
            and(eq(articles.pubDate, cursorDate), lt(articles.id, cursor.id))
          )
        )
      } else {
        // pubDate가 null인 경우 id만으로 비교
        conditions.push(lt(articles.id, cursor.id))
      }
    }

    // 쿼리 실행 (limit + 1로 hasNextPage 판별)
    const result = await db
      .select()
      .from(articles)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(articles.pubDate), desc(articles.id))
      .limit(limit + 1)

    // hasNextPage 판별 및 실제 반환 데이터 분리
    const hasNextPage = result.length > limit
    const articlesData = hasNextPage ? result.slice(0, limit) : result

    // 다음 커서 계산
    const lastArticle = articlesData[articlesData.length - 1]
    const nextCursor =
      hasNextPage && lastArticle
        ? {
            pubDate: lastArticle.pubDate?.toISOString() ?? null,
            id: lastArticle.id,
          }
        : null

    return {
      articles: articlesData,
      nextCursor,
      hasNextPage,
    }
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
