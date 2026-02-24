import { defineEventHandler, getRouterParam } from 'h3'
import { getDb } from '../../../../../src/db'
import { personalizedDailyReports, articles } from '../../../../../src/db/schema'
import { eq, and, desc, inArray } from 'drizzle-orm'
import { requireAuth } from '../../../../utils/api-auth'
import { setApiHeaders, apiSuccess, apiError } from '../../../../utils/api-response'

export default defineEventHandler(async (event) => {
  setApiHeaders(event)

  const date = getRouterParam(event, 'date')

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return apiError(400, 'YYYY-MM-DD 형식의 날짜를 입력해주세요.')
  }

  try {
    const userId = await requireAuth(event)
    const db = getDb()

    const reportResult = await db
      .select()
      .from(personalizedDailyReports)
      .where(
        and(
          eq(personalizedDailyReports.userId, userId),
          eq(personalizedDailyReports.reportDate, date)
        )
      )
      .limit(1)

    const report = reportResult[0]
    if (!report) {
      return apiError(404, `${date} 날짜의 개인화 리포트를 찾을 수 없습니다.`)
    }

    // 연관 기사 조회
    const relatedArticles =
      report.articleIds.length > 0
        ? await db
            .select({
              id: articles.id,
              title: articles.title,
              headlineSummary: articles.headlineSummary,
              category: articles.category,
              pubDate: articles.pubDate,
            })
            .from(articles)
            .where(inArray(articles.id, report.articleIds))
            .orderBy(desc(articles.pubDate))
        : []

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
      articles: relatedArticles,
    })
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('Error fetching personalized report by date:', error)
    return apiError(500, '개인화 리포트 조회 중 오류가 발생했습니다.')
  }
})
