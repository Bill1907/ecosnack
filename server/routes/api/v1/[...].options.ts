import { defineEventHandler, setResponseHeaders, setResponseStatus } from 'h3'

/**
 * 모든 /api/v1/** 경로에 대한 CORS preflight (OPTIONS) 요청 처리
 * ChatGPT Actions에서 API를 호출할 때 필요합니다.
 */
export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  })

  setResponseStatus(event, 204)
  return ''
})
