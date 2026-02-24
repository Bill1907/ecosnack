import { defineEventHandler, getQuery } from 'h3'
import { getDb } from '../../../../src/db'
import { articles } from '../../../../src/db/schema'
import { eq, desc, and, or, lt, sql } from 'drizzle-orm'
import { setApiHeaders, apiSuccess, apiError } from '../../../utils/api-response'

export default defineEventHandler(async (event) => {
  setApiHeaders(event)

  try {
    const query = getQuery(event)
    const limit = Math.min(Math.max(Number(query.limit) || 12, 1), 50)
    const category = query.category as string | undefined
    const search = query.q as string | undefined
    const region = query.region as string | undefined
    const cursorId = query.cursor_id ? Number(query.cursor_id) : undefined
    const cursorDate = query.cursor_date as string | undefined

    const db = getDb()
    const conditions = []

    if (category) {
      conditions.push(eq(articles.category, category))
    }

    if (search) {
      conditions.push(
        or(
          sql`${articles.title} ILIKE ${`%${search}%`}`,
          sql`${articles.description} ILIKE ${`%${search}%`}`,
          sql`${search} = ANY(${articles.keywords})`
        )
      )
    }

    if (region && (region === 'KR' || region === 'US')) {
      conditions.push(eq(articles.region, region))
    }

    if (cursorId && cursorDate) {
      const date = new Date(cursorDate)
      conditions.push(
        or(
          lt(articles.pubDate, date),
          and(eq(articles.pubDate, date), lt(articles.id, cursorId))
        )
      )
    } else if (cursorId) {
      conditions.push(lt(articles.id, cursorId))
    }

    const result = await db
      .select({
        id: articles.id,
        title: articles.title,
        link: articles.link,
        description: articles.description,
        imageUrl: articles.imageUrl,
        pubDate: articles.pubDate,
        source: articles.source,
        region: articles.region,
        headlineSummary: articles.headlineSummary,
        category: articles.category,
        sentiment: articles.sentiment,
        importanceScore: articles.importanceScore,
        keywords: articles.keywords,
      })
      .from(articles)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(articles.pubDate), desc(articles.id))
      .limit(limit + 1)

    const hasNextPage = result.length > limit
    const articlesData = hasNextPage ? result.slice(0, limit) : result
    const lastArticle = articlesData[articlesData.length - 1]
    const nextCursor =
      hasNextPage && lastArticle
        ? {
            id: lastArticle.id,
            pubDate: lastArticle.pubDate?.toISOString() ?? null,
          }
        : null

    return apiSuccess({
      articles: articlesData,
      nextCursor,
      hasNextPage,
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return apiError(500, '기사 조회 중 오류가 발생했습니다.')
  }
})
