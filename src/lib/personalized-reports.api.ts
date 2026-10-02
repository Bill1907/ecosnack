import { createServerFn } from '@tanstack/react-start'
import { zodValidator } from '@tanstack/zod-adapter'
import { auth } from '@clerk/tanstack-react-start/server'
import { getDb } from '@/db'
import { personalizedDailyReports, articles } from '@/db/schema'
import { eq, desc, and, inArray } from 'drizzle-orm'
import { z } from 'zod'
import { articleCardColumns } from './article-columns'

// 페이지네이션 입력 스키마
const PaginationInputSchema = z.object({
  limit: z.number().min(1).max(50).default(10),
  offset: z.number().min(0).default(0),
})

// 사용자의 개인화 리포트 목록 조회 (페이지네이션)
export const getPersonalizedReports = createServerFn({ method: 'GET' })
  .inputValidator(zodValidator(PaginationInputSchema))
  .handler(async ({ data }) => {
    const { userId } = await auth()

    if (!userId) {
      return { reports: [], totalCount: 0, hasMore: false }
    }

    const db = getDb()
    const { limit, offset } = data

    const result = await db
      .select()
      .from(personalizedDailyReports)
      .where(eq(personalizedDailyReports.userId, userId))
      .orderBy(desc(personalizedDailyReports.reportDate))
      .limit(limit)
      .offset(offset)

    const totalCount = await db
      .select({ count: personalizedDailyReports.id })
      .from(personalizedDailyReports)
      .where(eq(personalizedDailyReports.userId, userId))

    return {
      reports: result,
      totalCount: totalCount.length,
      hasMore: offset + result.length < totalCount.length,
    }
  })

// 특정 날짜의 개인화 리포트 조회
export const getPersonalizedReportByDate = createServerFn({ method: 'GET' })
  .inputValidator(zodValidator(z.string()))
  .handler(async ({ data: dateString }) => {
    const { userId } = await auth()

    if (!userId) {
      return null
    }

    const db = getDb()

    const result = await db
      .select()
      .from(personalizedDailyReports)
      .where(
        and(
          eq(personalizedDailyReports.userId, userId),
          eq(personalizedDailyReports.reportDate, dateString),
        ),
      )
      .limit(1)

    return result[0] ?? null
  })

// 개인화 리포트 + 연관 기사 조회
export const getPersonalizedReportWithArticles = createServerFn({
  method: 'GET',
})
  .inputValidator(zodValidator(z.string()))
  .handler(async ({ data: dateString }) => {
    const { userId } = await auth()

    if (!userId) {
      return null
    }

    const db = getDb()

    const reportResult = await db
      .select()
      .from(personalizedDailyReports)
      .where(
        and(
          eq(personalizedDailyReports.userId, userId),
          eq(personalizedDailyReports.reportDate, dateString),
        ),
      )
      .limit(1)

    const report = reportResult[0]
    if (!report) {
      return null
    }

    // 연관 기사 조회
    const relatedArticles =
      report.articleIds.length > 0
        ? await db
            .select(articleCardColumns)
            .from(articles)
            .where(inArray(articles.id, report.articleIds))
            .orderBy(desc(articles.pubDate))
        : []

    return {
      report,
      articles: relatedArticles,
    }
  })

// 최신 개인화 리포트 조회
export const getLatestPersonalizedReport = createServerFn({
  method: 'GET',
}).handler(async () => {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const db = getDb()

  const result = await db
    .select()
    .from(personalizedDailyReports)
    .where(eq(personalizedDailyReports.userId, userId))
    .orderBy(desc(personalizedDailyReports.reportDate))
    .limit(1)

  return result[0] ?? null
})
