import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'
import { getArticlesPaginated, getCategories } from './articles.api'
import type { Category } from '@/db/schema'

type Cursor = {
  pubDate: string | null
  id: number
} | null

export const articlesInfiniteQueryOptions = (category?: Category) =>
  infiniteQueryOptions({
    queryKey: ['articles', 'infinite', { category }] as const,
    queryFn: async ({ pageParam }) => {
      return getArticlesPaginated({
        data: {
          limit: 12,
          cursor: pageParam ?? undefined,
          category,
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
