import { createServerFn } from '@tanstack/react-start'
import { zodValidator } from '@tanstack/zod-adapter'
import { getDb } from '@/db'
import { dailyReports, articles } from '@/db/schema'
import { asc, desc, eq, gt, inArray, lt } from 'drizzle-orm'
import { z } from 'zod'
import { articleCardColumns } from './article-columns'
import { isValidReportDate } from './route-params'

// 실제 존재하는 YYYY-MM-DD 날짜만 허용 (라우트 loader 에서 먼저 걸러 404 처리)
const ReportDateSchema = z.string().refine(isValidReportDate, {
  message: '유효하지 않은 날짜 형식입니다',
})

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
  .inputValidator(zodValidator(ReportDateSchema))
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
  .inputValidator(zodValidator(ReportDateSchema))
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

    // 연관 기사 + 실제로 존재하는 이전/다음 리포트 날짜
    // (날짜 +-1 로 링크하면 최신 리포트의 '다음'이나 빠진 날짜가 404 로 이어진다)
    const [relatedArticles, prevResult, nextResult] = await Promise.all([
      report.articleIds.length > 0
        ? db
            .select(articleCardColumns)
            .from(articles)
            .where(inArray(articles.id, report.articleIds))
            .orderBy(desc(articles.pubDate))
        : Promise.resolve([]),
      db
        .select({ reportDate: dailyReports.reportDate })
        .from(dailyReports)
        .where(lt(dailyReports.reportDate, dateString))
        .orderBy(desc(dailyReports.reportDate))
        .limit(1),
      db
        .select({ reportDate: dailyReports.reportDate })
        .from(dailyReports)
        .where(gt(dailyReports.reportDate, dateString))
        .orderBy(asc(dailyReports.reportDate))
        .limit(1),
    ])

    return {
      report,
      articles: relatedArticles,
      prevDate: prevResult[0]?.reportDate ?? null,
      nextDate: nextResult[0]?.reportDate ?? null,
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
