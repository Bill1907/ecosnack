import { defineEventHandler, setResponseHeaders } from 'h3'

/**
 * 모든 /api/v1/** 경로에 대한 CORS preflight (OPTIONS) 요청 처리
 * ChatGPT Actions에서 API를 호출할 때 필요합니다.
 */
export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '86400',
  })

  return null
})
