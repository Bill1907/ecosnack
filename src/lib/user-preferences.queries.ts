import { queryOptions } from '@tanstack/react-query'
import { getUserPreferences } from './user-preferences.api'

// 사용자 선호도 조회
export const userPreferencesQueryOptions = queryOptions({
  queryKey: ['userPreferences'] as const,
  queryFn: () => getUserPreferences(),
  staleTime: 1000 * 60 * 10, // 10분
})
