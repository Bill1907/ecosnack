import { defineEventHandler, setResponseHeaders } from 'h3'

const OPENAPI_SPEC = {
  openapi: '3.1.0',
  info: {
    title: 'Ecosnack API',
    description:
      'ecosnack(에코스낵)은 경제 뉴스 분석 플랫폼입니다. 매일 주요 경제 뉴스를 AI가 분석하여 투자자, 직장인, 소비자 관점의 인사이트를 제공합니다. 데일리 리포트, 기사 검색, 개인화 리포트, 북마크 기능을 지원합니다.',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'https://ecosnack.onrender.com',
      description: 'Production server',
    },
  ],
  paths: {
    '/api/v1/reports/latest': {
      get: {
        operationId: 'getLatestReport',
        summary: '최신 데일리 경제 리포트 조회',
        description:
          '오늘(또는 가장 최근)의 데일리 경제 리포트를 조회합니다. 주요 뉴스 요약, 시장 전망, 핵심 인사이트, 감성 분석 결과를 포함합니다.',
        responses: {
          '200': {
            description: '최신 리포트',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ReportResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/reports/{date}': {
      get: {
        operationId: 'getReportByDate',
        summary: '특정 날짜의 데일리 리포트 조회',
        description:
          'YYYY-MM-DD 형식의 날짜로 해당일의 데일리 경제 리포트를 조회합니다. 연관 기사 목록도 함께 반환됩니다.',
        parameters: [
          {
            name: 'date',
            in: 'path',
            required: true,
            description: '조회할 날짜 (YYYY-MM-DD 형식)',
            schema: { type: 'string', format: 'date', example: '2025-01-15' },
          },
        ],
        responses: {
          '200': {
            description: '해당 날짜의 리포트',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ReportWithArticlesResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/articles': {
      get: {
        operationId: 'searchArticles',
        summary: '경제 뉴스 기사 검색 및 목록 조회',
        description:
          '경제 뉴스 기사를 검색합니다. 키워드, 카테고리(economy, finance, business, markets, policy, trade), 지역(KR/US)으로 필터링할 수 있습니다.',
        parameters: [
          {
            name: 'q',
            in: 'query',
            description: '검색 키워드 (제목, 설명, 키워드에서 검색)',
            schema: { type: 'string' },
          },
          {
            name: 'category',
            in: 'query',
            description: '카테고리 필터',
            schema: {
              type: 'string',
              enum: ['economy', 'finance', 'business', 'markets', 'policy', 'trade'],
            },
          },
          {
            name: 'region',
            in: 'query',
            description: '지역 필터 (KR: 국내, US: 해외)',
            schema: { type: 'string', enum: ['KR', 'US'] },
          },
          {
            name: 'limit',
            in: 'query',
            description: '반환할 기사 수 (1-50, 기본값 12)',
            schema: { type: 'integer', minimum: 1, maximum: 50, default: 12 },
          },
          {
            name: 'cursor_id',
            in: 'query',
            description: '페이지네이션 커서 (이전 응답의 nextCursor.id)',
            schema: { type: 'integer' },
          },
          {
            name: 'cursor_date',
            in: 'query',
            description: '페이지네이션 커서 (이전 응답의 nextCursor.pubDate)',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: '기사 목록',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ArticlesListResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/articles/{id}': {
      get: {
        operationId: 'getArticleById',
        summary: '기사 상세 조회',
        description:
          '특정 기사의 전체 AI 분석 결과를 조회합니다. So What 분석, 투자자/직장인/소비자 영향 분석, 관련 컨텍스트가 포함됩니다.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: '기사 ID',
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': {
            description: '기사 상세 정보',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ArticleDetailResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/categories': {
      get: {
        operationId: 'getCategories',
        summary: '뉴스 카테고리 목록 및 통계',
        description: '사용 가능한 뉴스 카테고리 목록과 각 카테고리별 기사 수를 반환합니다.',
        responses: {
          '200': {
            description: '카테고리 목록',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CategoriesResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/bookmarks': {
      get: {
        operationId: 'getBookmarks',
        summary: '내 북마크 목록 조회',
        description: '로그인한 사용자의 북마크된 기사 목록을 조회합니다. 인증이 필요합니다.',
        security: [{ oauth2: [] }],
        responses: {
          '200': {
            description: '북마크 목록',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BookmarksResponse' },
              },
            },
          },
          '401': { description: '인증 필요' },
        },
      },
    },
    '/api/v1/bookmarks/toggle': {
      post: {
        operationId: 'toggleBookmark',
        summary: '기사 북마크 추가/제거',
        description: '기사를 북마크에 추가하거나 이미 있으면 제거합니다. 인증이 필요합니다.',
        security: [{ oauth2: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['articleId'],
                properties: {
                  articleId: {
                    type: 'integer',
                    description: '북마크할 기사 ID',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: '북마크 상태',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        bookmarked: { type: 'boolean' },
                        articleId: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': { description: '인증 필요' },
        },
      },
    },
    '/api/v1/me/report/latest': {
      get: {
        operationId: 'getMyLatestReport',
        summary: '내 최신 개인화 리포트 조회',
        description:
          '사용자의 관심사와 북마크 패턴을 기반으로 생성된 개인화 경제 리포트를 조회합니다. 인증이 필요합니다.',
        security: [{ oauth2: [] }],
        responses: {
          '200': {
            description: '개인화 리포트',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PersonalizedReportResponse' },
              },
            },
          },
          '401': { description: '인증 필요' },
        },
      },
    },
    '/api/v1/me/report/{date}': {
      get: {
        operationId: 'getMyReportByDate',
        summary: '특정 날짜의 개인화 리포트 조회',
        description: '특정 날짜의 개인화 경제 리포트를 조회합니다. 인증이 필요합니다.',
        security: [{ oauth2: [] }],
        parameters: [
          {
            name: 'date',
            in: 'path',
            required: true,
            description: '조회할 날짜 (YYYY-MM-DD 형식)',
            schema: { type: 'string', format: 'date' },
          },
        ],
        responses: {
          '200': {
            description: '개인화 리포트',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PersonalizedReportResponse' },
              },
            },
          },
          '401': { description: '인증 필요' },
        },
      },
    },
    '/api/v1/me/preferences': {
      get: {
        operationId: 'getMyPreferences',
        summary: '내 선호도 정보 조회',
        description:
          '사용자의 뉴스 선호도 분석 결과를 조회합니다. 선호 카테고리, 키워드, 매체 정보를 포함합니다. 인증이 필요합니다.',
        security: [{ oauth2: [] }],
        responses: {
          '200': {
            description: '선호도 정보',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PreferencesResponse' },
              },
            },
          },
          '401': { description: '인증 필요' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      oauth2: {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: 'https://YOUR_CLERK_DOMAIN/oauth/authorize',
            tokenUrl: 'https://YOUR_CLERK_DOMAIN/oauth/token',
            scopes: {
              'read:profile': '사용자 프로필 읽기',
              'read:bookmarks': '북마크 조회',
              'write:bookmarks': '북마크 추가/삭제',
              'read:reports': '개인화 리포트 조회',
            },
          },
        },
      },
    },
    schemas: {
      SentimentAnalysis: {
        type: 'object',
        properties: {
          overall: {
            type: 'string',
            enum: ['positive', 'negative', 'neutral', 'mixed'],
          },
          confidence: { type: 'number' },
        },
      },
      ExecutiveSummary: {
        type: 'object',
        properties: {
          headline: { type: 'string' },
          overview: { type: 'string' },
          highlights: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                description: { type: 'string' },
              },
            },
          },
          sentiment: {
            type: 'object',
            properties: {
              overall: { type: 'string' },
              description: { type: 'string' },
            },
          },
        },
      },
      MarketOverview: {
        type: 'object',
        properties: {
          summary: { type: 'string' },
          sections: { type: 'array', items: { type: 'object' } },
          outlook: { type: 'string' },
          watchList: { type: 'array', items: { type: 'string' } },
        },
      },
      KeyInsight: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          summary: { type: 'string' },
          analysis: { type: 'string' },
          implications: {
            type: 'object',
            properties: {
              investors: { type: 'string' },
              workers: { type: 'string' },
              consumers: { type: 'string' },
            },
          },
          actionItems: { type: 'array', items: { type: 'string' } },
          impact: { type: 'string', enum: ['high', 'medium', 'low'] },
          timeHorizon: { type: 'string', enum: ['short', 'medium', 'long'] },
        },
      },
      ReportResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              reportDate: { type: 'string' },
              title: { type: 'string' },
              executiveSummary: { $ref: '#/components/schemas/ExecutiveSummary' },
              marketOverview: { $ref: '#/components/schemas/MarketOverview' },
              keyInsights: {
                type: 'array',
                items: { $ref: '#/components/schemas/KeyInsight' },
              },
              topKeywords: { type: 'array', items: { type: 'string' } },
              sentimentAnalysis: {
                type: 'object',
                properties: {
                  overall: { type: 'string' },
                  positiveCount: { type: 'integer' },
                  negativeCount: { type: 'integer' },
                  neutralCount: { type: 'integer' },
                },
              },
              articleCount: { type: 'integer' },
            },
          },
        },
      },
      ReportWithArticlesResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              reportDate: { type: 'string' },
              title: { type: 'string' },
              executiveSummary: { $ref: '#/components/schemas/ExecutiveSummary' },
              marketOverview: { $ref: '#/components/schemas/MarketOverview' },
              keyInsights: {
                type: 'array',
                items: { $ref: '#/components/schemas/KeyInsight' },
              },
              topKeywords: { type: 'array', items: { type: 'string' } },
              articleCount: { type: 'integer' },
              articles: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    title: { type: 'string' },
                    headlineSummary: { type: 'string' },
                    category: { type: 'string' },
                    pubDate: { type: 'string' },
                    source: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
      ArticlesListResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              articles: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                    headlineSummary: { type: 'string' },
                    category: { type: 'string' },
                    sentiment: { $ref: '#/components/schemas/SentimentAnalysis' },
                    importanceScore: { type: 'integer' },
                    pubDate: { type: 'string' },
                    source: { type: 'string' },
                    region: { type: 'string' },
                    keywords: { type: 'array', items: { type: 'string' } },
                  },
                },
              },
              nextCursor: {
                type: 'object',
                nullable: true,
                properties: {
                  id: { type: 'integer' },
                  pubDate: { type: 'string', nullable: true },
                },
              },
              hasNextPage: { type: 'boolean' },
            },
          },
        },
      },
      ArticleDetailResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              title: { type: 'string' },
              link: { type: 'string' },
              description: { type: 'string' },
              headlineSummary: { type: 'string' },
              pubDate: { type: 'string' },
              source: { type: 'string' },
              region: { type: 'string' },
              category: { type: 'string' },
              sentiment: { $ref: '#/components/schemas/SentimentAnalysis' },
              importanceScore: { type: 'integer' },
              keywords: { type: 'array', items: { type: 'string' } },
              soWhat: {
                type: 'object',
                properties: {
                  main_point: { type: 'string' },
                  market_signal: { type: 'string' },
                  time_horizon: { type: 'string' },
                },
              },
              impactAnalysis: {
                type: 'object',
                properties: {
                  investors: {
                    type: 'object',
                    properties: {
                      summary: { type: 'string' },
                      action_items: { type: 'array', items: { type: 'string' } },
                      sectors_affected: { type: 'array', items: { type: 'string' } },
                    },
                  },
                  workers: {
                    type: 'object',
                    properties: {
                      summary: { type: 'string' },
                      industries_affected: { type: 'array', items: { type: 'string' } },
                      job_outlook: { type: 'string' },
                    },
                  },
                  consumers: {
                    type: 'object',
                    properties: {
                      summary: { type: 'string' },
                      price_impact: { type: 'string' },
                      spending_advice: { type: 'string' },
                    },
                  },
                },
              },
              relatedContext: {
                type: 'object',
                properties: {
                  background: { type: 'string' },
                  related_events: { type: 'array', items: { type: 'string' } },
                  what_to_watch: { type: 'string' },
                },
              },
            },
          },
        },
      },
      CategoriesResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              categories: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    category: { type: 'string' },
                    articleCount: { type: 'integer' },
                    latestArticle: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
      BookmarksResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              bookmarks: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    title: { type: 'string' },
                    headlineSummary: { type: 'string' },
                    category: { type: 'string' },
                    pubDate: { type: 'string' },
                    source: { type: 'string' },
                    bookmarkedAt: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
      PersonalizedReportResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              reportDate: { type: 'string' },
              title: { type: 'string' },
              executiveSummary: { $ref: '#/components/schemas/ExecutiveSummary' },
              marketOverview: { $ref: '#/components/schemas/MarketOverview' },
              keyInsights: {
                type: 'array',
                items: { $ref: '#/components/schemas/KeyInsight' },
              },
              topKeywords: { type: 'array', items: { type: 'string' } },
              articleCount: { type: 'integer' },
              preferenceSnapshot: {
                type: 'object',
                nullable: true,
                properties: {
                  topCategories: { type: 'array', items: { type: 'object' } },
                  topKeywords: { type: 'array', items: { type: 'string' } },
                  sentimentBias: { type: 'string', nullable: true },
                },
              },
            },
          },
        },
      },
      PreferencesResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              preferences: {
                type: 'object',
                nullable: true,
                properties: {
                  topCategories: { type: 'array', items: { type: 'object' } },
                  topKeywords: { type: 'array', items: { type: 'string' } },
                  preferredSources: { type: 'array', items: { type: 'string' } },
                  sentimentBias: { type: 'string', nullable: true },
                  bookmarkCount: { type: 'integer' },
                  analyzedAt: { type: 'string', nullable: true },
                },
              },
              message: { type: 'string' },
            },
          },
        },
      },
    },
  },
}

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=3600',
  })

  return OPENAPI_SPEC
})
