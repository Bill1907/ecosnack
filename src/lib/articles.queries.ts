import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'
import { getArticlesPaginated, getCategories } from './articles.api'
import type { Category, Region } from '@/db/schema'

type Cursor = {
  pubDate: string | null
  id: number
} | null

type ArticlesFilterOptions = {
  category?: Category
  query?: string
  region?: Region
}

export const articlesInfiniteQueryOptions = (
  filters?: ArticlesFilterOptions,
) =>
  infiniteQueryOptions({
    queryKey: ['articles', 'infinite', filters] as const,
    queryFn: async ({ pageParam }) => {
      return getArticlesPaginated({
        data: {
          limit: 12,
          cursor: pageParam ?? undefined,
          category: filters?.category,
          query: filters?.query,
          region: filters?.region,
        },
      })
    },
    initialPageParam: null as Cursor,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

export const categoriesQueryOptions = queryOptions({
  queryKey: ['categories'] as const,
  queryFn: () => getCategories(),
  staleTime: 1000 * 60 * 60, // 1시간
})
