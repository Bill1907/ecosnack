import { defineEventHandler } from 'h3'
import { getDb } from '../../../../src/db'
import { bookmarks, articles } from '../../../../src/db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireAuth } from '../../../utils/api-auth'
import { setApiHeaders, apiSuccess, apiError } from '../../../utils/api-response'

export default defineEventHandler(async (event) => {
  setApiHeaders(event)

  try {
    const userId = await requireAuth(event)
    const db = getDb()

    const result = await db
      .select({
        bookmark: bookmarks,
        article: articles,
      })
      .from(bookmarks)
      .innerJoin(articles, eq(bookmarks.articleId, articles.id))
      .where(eq(bookmarks.userId, userId))
      .orderBy(desc(bookmarks.createdAt))

    return apiSuccess({
      bookmarks: result.map((row) => ({
        id: row.article.id,
        title: row.article.title,
        headlineSummary: row.article.headlineSummary,
        category: row.article.category,
        sentiment: row.article.sentiment,
        pubDate: row.article.pubDate,
        source: row.article.source,
        bookmarkedAt: row.bookmark.createdAt,
      })),
    })
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('Error fetching bookmarks:', error)
    return apiError(500, '북마크 조회 중 오류가 발생했습니다.')
  }
})
