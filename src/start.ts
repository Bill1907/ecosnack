import { clerkMiddleware } from '@clerk/tanstack-react-start/server'
import { createStart } from '@tanstack/react-start'
import { errorMaskingMiddleware } from '@/lib/error-masking.middleware'

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [clerkMiddleware()],
    // 모든 서버 함수에 적용: 에러 원문(SQL 등) 클라이언트 노출 방지
    functionMiddleware: [errorMaskingMiddleware],
  }
})
