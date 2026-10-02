import { createMiddleware } from '@tanstack/react-start'
import { isNotFound, isRedirect } from '@tanstack/react-router'

// 클라이언트에 노출할 일반 에러 메시지
const MASKED_ERROR_MESSAGE = '서버 요청을 처리하지 못했습니다'

// 서버 함수 에러 마스킹 전역 미들웨어
// - 하위 미들웨어/핸들러가 던진 에러는 next() 가 throw 하지 않고 result.error 로 돌려준다
// - redirect / notFound / Response 는 라우터 제어 흐름이므로 그대로 통과
// - 그 외 에러는 서버 로그에 원본을 남기고, production 에서는 일반 메시지로 교체
//   (DB 에러의 SQL 원문 등이 응답 본문으로 직렬화되는 것을 막기 위함)
export const errorMaskingMiddleware = createMiddleware({
  type: 'function',
}).server(async ({ next, functionId }) => {
  const result = await next()
  const error = (result as { error?: unknown }).error

  if (
    error === undefined ||
    error === null ||
    isRedirect(error) ||
    isNotFound(error) ||
    error instanceof Response
  ) {
    return result
  }

  // 원본 에러는 서버 로그에만 남긴다
  console.error(`[server-fn error] ${functionId}`, error)

  if (process.env.NODE_ENV !== 'production') {
    return result
  }

  return {
    ...result,
    error: new Error(MASKED_ERROR_MESSAGE),
  }
})
