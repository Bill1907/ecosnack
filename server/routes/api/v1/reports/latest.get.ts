import { defineEventHandler } from 'h3'
import { getDb } from '../../../../src/db'
import { dailyReports } from '../../../../src/db/schema'
import { desc } from 'drizzle-orm'
import { setApiHeaders, apiSuccess, apiError } from '../../../utils/api-response'

export default defineEventHandler(async (event) => {
  setApiHeaders(event)

  try {
    const db = getDb()
    const result = await db
      .select()
      .from(dailyReports)
      .orderBy(desc(dailyReports.reportDate))
      .limit(1)

    const report = result[0]
    if (!report) {
      return apiError(404, '최신 리포트를 찾을 수 없습니다.')
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
    })
  } catch (error) {
    console.error('Error fetching latest report:', error)
    return apiError(500, '리포트 조회 중 오류가 발생했습니다.')
  }
})
