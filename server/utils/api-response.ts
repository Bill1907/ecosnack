import { H3Event, setResponseHeaders, createError } from 'h3'

/**
 * API 응답에 공통 헤더를 설정합니다.
 */
export function setApiHeaders(event: H3Event) {
  setResponseHeaders(event, {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=60, s-maxage=300',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  })
}

/**
 * 성공 응답을 반환합니다.
 */
export function apiSuccess<T>(data: T) {
  return {
    success: true,
    data,
  }
}

/**
 * 에러 응답을 생성합니다.
 */
export function apiError(statusCode: number, message: string) {
  throw createError({
    statusCode,
    statusMessage: message,
    message,
  })
}
