import { createServerFn } from '@tanstack/react-start'
import { zodValidator } from '@tanstack/zod-adapter'
import { getDb } from '@/db'
import { dailyReports, articles } from '@/db/schema'
import { eq, desc, inArray } from 'drizzle-orm'
import { z } from 'zod'

// 페이지네이션 입력 스키마
const PaginationInputSchema = z.object({
  limit: z.number().min(1).max(50).default(10),
  offset: z.number().min(0).default(0),
})

// Daily Reports 목록 조회 (페이지네이션)
export const getDailyReports = createServerFn()
  .inputValidator(zodValidator(PaginationInputSchema))
  .handler(async ({ data }) => {
    const db = getDb()
    const { limit, offset } = data

    const result = await db
      .select()
      .from(dailyReports)
      .orderBy(desc(dailyReports.reportDate))
      .limit(limit)
      .offset(offset)

    const totalCount = await db
      .select({ count: dailyReports.id })
      .from(dailyReports)

    return {
      reports: result,
      totalCount: totalCount.length,
      hasMore: offset + result.length < totalCount.length,
    }
  })

// 특정 날짜의 Daily Report 조회 (YYYY-MM-DD 형식)
export const getDailyReportByDate = createServerFn()
  .inputValidator(zodValidator(z.string()))
  .handler(async ({ data: dateString }) => {
    const db = getDb()

    const result = await db
      .select()
      .from(dailyReports)
      .where(eq(dailyReports.reportDate, dateString))
      .limit(1)

    return result[0] ?? null
  })

// ID로 Daily Report 조회
export const getDailyReportById = createServerFn()
  .inputValidator(zodValidator(z.number()))
  .handler(async ({ data: id }) => {
    const db = getDb()

    const result = await db
      .select()
      .from(dailyReports)
      .where(eq(dailyReports.id, id))
      .limit(1)

    return result[0] ?? null
  })

// Daily Report + 연관 기사 조회 (YYYY-MM-DD 형식)
export const getDailyReportWithArticles = createServerFn()
  .inputValidator(zodValidator(z.string()))
  .handler(async ({ data: dateString }) => {
    const db = getDb()

    const reportResult = await db
      .select()
      .from(dailyReports)
      .where(eq(dailyReports.reportDate, dateString))
      .limit(1)

    const report = reportResult[0]
    if (!report) {
      return null
    }

    // 연관 기사 조회
    const relatedArticles =
      report.articleIds.length > 0
        ? await db
            .select()
            .from(articles)
            .where(inArray(articles.id, report.articleIds))
            .orderBy(desc(articles.pubDate))
        : []

    return {
      report,
      articles: relatedArticles,
    }
  })

// 최신 Daily Report 조회
export const getLatestDailyReport = createServerFn().handler(async () => {
  const db = getDb()

  const result = await db
    .select()
    .from(dailyReports)
    .orderBy(desc(dailyReports.reportDate))
    .limit(1)

  return result[0] ?? null
})
