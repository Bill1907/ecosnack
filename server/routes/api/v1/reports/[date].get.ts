import { defineEventHandler, getRouterParam } from 'h3'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { getDb } from '../../../../src/db'
import { dailyReports, articles } from '../../../../src/db/schema'
import { eq, desc, inArray } from 'drizzle-orm'
import { setApiHeaders, apiSuccess, apiError } from '../../../utils/api-response'

dayjs.extend(customParseFormat)

export default defineEventHandler(async (event) => {
  setApiHeaders(event)

  const date = getRouterParam(event, 'date')

  if (!date || !dayjs(date, 'YYYY-MM-DD', true).isValid()) {
    return apiError(400, 'YYYY-MM-DD 형식의 유효한 날짜를 입력해주세요.')
  }

  try {
    const db = getDb()
    const reportResult = await db
      .select()
      .from(dailyReports)
      .where(eq(dailyReports.reportDate, date))
      .limit(1)

    const report = reportResult[0]
    if (!report) {
      return apiError(404, `${date} 날짜의 리포트를 찾을 수 없습니다.`)
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
              sentiment: articles.sentiment,
              pubDate: articles.pubDate,
              source: articles.source,
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
      articles: relatedArticles,
    })
  } catch (error) {
    console.error('Error fetching report by date:', error)
    return apiError(500, '리포트 조회 중 오류가 발생했습니다.')
  }
})
