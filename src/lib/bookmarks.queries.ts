import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  toggleBookmark,
  getBookmarkStatus,
  getBookmarkStatuses,
  getUserBookmarks,
} from './bookmarks.api'

// 단일 기사의 북마크 상태
export const bookmarkStatusQueryOptions = (articleId: number) =>
  queryOptions({
    queryKey: ['bookmark', 'status', articleId] as const,
    queryFn: () => getBookmarkStatus({ data: { articleId } }),
  })

// 여러 기사의 북마크 상태 (목록 페이지용)
export const bookmarkStatusesQueryOptions = (articleIds: number[]) =>
  queryOptions({
    queryKey: ['bookmark', 'statuses', articleIds] as const,
    queryFn: () => getBookmarkStatuses({ data: { articleIds } }),
    enabled: articleIds.length > 0,
  })

// 사용자 북마크 목록
export const userBookmarksQueryOptions = queryOptions({
  queryKey: ['bookmarks', 'user'] as const,
  queryFn: () => getUserBookmarks(),
})

// 북마크 토글 mutation hook
export function useToggleBookmark() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (articleId: number) => toggleBookmark({ data: { articleId } }),
    onMutate: async (articleId) => {
      // 낙관적 업데이트
      await queryClient.cancelQueries({
        queryKey: ['bookmark', 'status', articleId],
      })

      const previousStatus = queryClient.getQueryData<{ bookmarked: boolean }>([
        'bookmark',
        'status',
        articleId,
      ])

      queryClient.setQueryData(['bookmark', 'status', articleId], {
        bookmarked: !previousStatus?.bookmarked,
      })

      return { previousStatus }
    },
    onSuccess: (data, articleId) => {
      // PostHog 이벤트 트래킹
      if (typeof window !== 'undefined' && window.posthog) {
        const eventName = data.bookmarked ? 'bookmark_add' : 'bookmark_remove'
        window.posthog.capture(eventName, {
          article_id: articleId,
          timestamp: new Date().toISOString(),
        })
      }
    },
    onError: (_err, articleId, context) => {
      // 에러 시 롤백
      if (context?.previousStatus) {
        queryClient.setQueryData(
          ['bookmark', 'status', articleId],
          context.previousStatus,
        )
      }
    },
    onSettled: (_data, _error, articleId) => {
      // 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['bookmark', 'status', articleId],
      })
      queryClient.invalidateQueries({
        queryKey: ['bookmark', 'statuses'],
      })
      queryClient.invalidateQueries({
        queryKey: ['bookmarks', 'user'],
      })
    },
  })
}
