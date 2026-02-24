import { defineEventHandler } from 'h3'
import { getDb } from '../../../../../src/db'
import { personalizedDailyReports } from '../../../../../src/db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireAuth } from '../../../../utils/api-auth'
import { setApiHeaders, apiSuccess, apiError } from '../../../../utils/api-response'

export default defineEventHandler(async (event) => {
  setApiHeaders(event)

  try {
    const userId = await requireAuth(event)
    const db = getDb()

    const result = await db
      .select()
      .from(personalizedDailyReports)
      .where(eq(personalizedDailyReports.userId, userId))
      .orderBy(desc(personalizedDailyReports.reportDate))
      .limit(1)

    const report = result[0]
    if (!report) {
      return apiError(404, '개인화 리포트를 찾을 수 없습니다. 먼저 웹사이트에서 선호도를 설정해주세요.')
    }

    return apiSuccess({
      id: report.id,
      reportDate: report.reportDate,
      title: report.title,
      executiveSummary: report.executiveSummary,
      marketOverview: report.marketOverview,
      keyInsights: report.keyInsights,
      topKeywords: report.topKeywords,
      sentimentAnalysis: report.sentimentAnalysis,
      articleCount: report.articleCount,
      preferenceSnapshot: report.preferenceSnapshot,
    })
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('Error fetching personalized report:', error)
    return apiError(500, '개인화 리포트 조회 중 오류가 발생했습니다.')
  }
})
