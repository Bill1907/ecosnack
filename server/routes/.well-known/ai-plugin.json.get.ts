import { defineEventHandler, setResponseHeaders } from 'h3'

/**
 * ChatGPT Plugin / GPT Actions 매니페스트
 * https://platform.openai.com/docs/plugins/getting-started
 */
export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=3600',
  })

  return {
    schema_version: 'v1',
    name_for_human: 'ecosnack 경제뉴스',
    name_for_model: 'ecosnack',
    description_for_human:
      'AI가 분석한 경제 뉴스 인사이트. 매일 주요 경제 뉴스를 투자자, 직장인, 소비자 관점에서 분석합니다.',
    description_for_model:
      'ecosnack은 한국/미국 경제 뉴스를 AI로 분석하는 플랫폼입니다. 매일 데일리 리포트(시장 전망, 핵심 인사이트, 감성 분석)를 생성하고, 개별 기사에 대해 투자자/직장인/소비자 영향 분석을 제공합니다. 사용자가 경제 뉴스에 대해 물어보면 최신 리포트와 기사를 검색하여 답변하세요. 한국어로 답변하세요.',
    auth: {
      type: 'oauth',
      client_url: 'https://YOUR_CLERK_DOMAIN/oauth/authorize',
      scope: 'read:profile read:bookmarks write:bookmarks read:reports',
      authorization_url: 'https://YOUR_CLERK_DOMAIN/oauth/token',
      authorization_content_type: 'application/json',
      verification_tokens: {
        openai: 'YOUR_OPENAI_VERIFICATION_TOKEN',
      },
    },
    api: {
      type: 'openapi',
      url: 'https://ecosnack.onrender.com/api/v1/openapi.json',
    },
    logo_url: 'https://ecosnack.onrender.com/logo.png',
    contact_email: 'support@ecosnack.com',
    legal_info_url: 'https://ecosnack.onrender.com/terms',
  }
})
