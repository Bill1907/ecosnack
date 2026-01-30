import { auth } from '@clerk/tanstack-react-start/server'

/**
 * 인증 상태를 확인하고 userId를 반환 (리다이렉트 없음)
 * 선택적 인증이 필요한 페이지에서 사용
 *
 * 주의: beforeLoad는 서버와 클라이언트 모두에서 실행됩니다.
 * - 서버: auth()로 인증 체크
 * - 클라이언트: 컴포넌트에서 Clerk 훅으로 체크하므로 여기서는 스킵
 */
export async function getAuthStatus() {
  // 클라이언트 사이드에서는 스킵 (컴포넌트에서 체크)
  if (typeof window !== 'undefined') {
    return { userId: null, isAuthenticated: false }
  }

  const { userId } = await auth()
  return { userId, isAuthenticated: !!userId }
}
