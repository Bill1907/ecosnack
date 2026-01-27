import { queryOptions } from '@tanstack/react-query'
import {
  getDailyReports,
  getDailyReportByDate,
  getDailyReportById,
  getDailyReportWithArticles,
  getLatestDailyReport,
} from './daily-reports.api'

type PaginationOptions = {
  limit?: number
  offset?: number
}

// Daily Reports 목록 조회
export const dailyReportsQueryOptions = (options?: PaginationOptions) =>
  queryOptions({
    queryKey: ['dailyReports', 'list', options] as const,
    queryFn: () =>
      getDailyReports({
        data: {
          limit: options?.limit ?? 10,
          offset: options?.offset ?? 0,
        },
      }),
  })

// 날짜별 Daily Report 조회
export const dailyReportByDateQueryOptions = (date: string) =>
  queryOptions({
    queryKey: ['dailyReports', 'byDate', date] as const,
    queryFn: () => getDailyReportByDate({ data: date }),
    enabled: !!date,
  })

// ID별 Daily Report 조회
export const dailyReportByIdQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ['dailyReports', 'byId', id] as const,
    queryFn: () => getDailyReportById({ data: id }),
    enabled: id > 0,
  })

// Daily Report + 연관 기사 조회
export const dailyReportWithArticlesQueryOptions = (date: string) =>
  queryOptions({
    queryKey: ['dailyReports', 'withArticles', date] as const,
    queryFn: () => getDailyReportWithArticles({ data: date }),
    enabled: !!date,
  })

// 최신 Daily Report 조회
export const latestDailyReportQueryOptions = queryOptions({
  queryKey: ['dailyReports', 'latest'] as const,
  queryFn: () => getLatestDailyReport(),
  staleTime: 1000 * 60 * 5, // 5분
})
