import { useUser } from '@clerk/tanstack-react-start'
import { usePostHog } from 'posthog-js/react'
import { useEffect } from 'react'

/**
 * PostHog 사용자 식별 훅
 * Clerk 로그인 시 자동으로 PostHog에 사용자 정보를 전송합니다.
 */
export function usePostHogIdentify() {
  const { user, isLoaded } = useUser()
  const posthog = usePostHog()

  useEffect(() => {
    if (!isLoaded) return

    if (user) {
      // 로그인한 사용자 식별
      posthog.identify(user.id, {
        email: user.emailAddresses[0]?.emailAddress,
        name: user.fullName || user.firstName || 'Unknown',
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        createdAt: user.createdAt,
      })
    } else {
      // 로그아웃 시 세션 리셋
      posthog.reset()
    }
  }, [user, isLoaded, posthog])
}
