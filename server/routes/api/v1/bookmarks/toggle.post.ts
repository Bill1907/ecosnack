import { defineEventHandler, readBody } from 'h3'
import { getDb } from '../../../../src/db'
import { bookmarks } from '../../../../src/db/schema'
import { eq, and } from 'drizzle-orm'
import { requireAuth } from '../../../utils/api-auth'
import { setApiHeaders, apiSuccess, apiError } from '../../../utils/api-response'

export default defineEventHandler(async (event) => {
  setApiHeaders(event)

  try {
    const userId = await requireAuth(event)
    const body = await readBody(event)
    const articleId = Number(body?.articleId)

    if (!articleId || isNaN(articleId)) {
      return apiError(400, '유효한 articleId를 입력해주세요.')
    }

    const db = getDb()

    // 기존 북마크 확인
    const existing = await db
      .select()
      .from(bookmarks)
      .where(and(eq(bookmarks.userId, userId), eq(bookmarks.articleId, articleId)))
      .limit(1)

    if (existing[0]) {
      await db.delete(bookmarks).where(eq(bookmarks.id, existing[0].id))
      return apiSuccess({ bookmarked: false, articleId })
    } else {
      await db.insert(bookmarks).values({ userId, articleId })
      return apiSuccess({ bookmarked: true, articleId })
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('Error toggling bookmark:', error)
    return apiError(500, '북마크 변경 중 오류가 발생했습니다.')
  }
})
