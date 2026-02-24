import { defineEventHandler } from 'h3'
import { getDb } from '../../../../src/db'
import { userPreferences } from '../../../../src/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../../../utils/api-auth'
import { setApiHeaders, apiSuccess, apiError } from '../../../utils/api-response'

export default defineEventHandler(async (event) => {
  setApiHeaders(event)

  try {
    const userId = await requireAuth(event)
    const db = getDb()

    const result = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1)

    const prefs = result[0]
    if (!prefs) {
      return apiSuccess({
        preferences: null,
        message: '아직 선호도가 설정되지 않았습니다. 웹사이트에서 기사를 북마크하면 자동으로 선호도가 분석됩니다.',
      })
    }

    return apiSuccess({
      preferences: {
        topCategories: prefs.topCategories,
        topKeywords: prefs.topKeywords,
        preferredSources: prefs.preferredSources,
        sentimentBias: prefs.sentimentBias,
        bookmarkCount: prefs.bookmarkCount,
        analyzedAt: prefs.analyzedAt,
      },
    })
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('Error fetching preferences:', error)
    return apiError(500, '선호도 조회 중 오류가 발생했습니다.')
  }
})
