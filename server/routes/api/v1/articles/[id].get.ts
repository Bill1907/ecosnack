import { defineEventHandler, getRouterParam } from 'h3'
import { getDb } from '../../../../src/db'
import { articles } from '../../../../src/db/schema'
import { eq } from 'drizzle-orm'
import { setApiHeaders, apiSuccess, apiError } from '../../../utils/api-response'

export default defineEventHandler(async (event) => {
  setApiHeaders(event)

  const idParam = getRouterParam(event, 'id')
  const id = Number(idParam)

  if (!id || isNaN(id)) {
    return apiError(400, '유효한 기사 ID를 입력해주세요.')
  }

  try {
    const db = getDb()
    const result = await db
      .select()
      .from(articles)
      .where(eq(articles.id, id))
      .limit(1)

    const article = result[0]
    if (!article) {
      return apiError(404, '기사를 찾을 수 없습니다.')
    }

    return apiSuccess({
      id: article.id,
      title: article.title,
      link: article.link,
      description: article.description,
      imageUrl: article.imageUrl,
      pubDate: article.pubDate,
      source: article.source,
      region: article.region,
      headlineSummary: article.headlineSummary,
      soWhat: article.soWhat,
      impactAnalysis: article.impactAnalysis,
      relatedContext: article.relatedContext,
      keywords: article.keywords,
      category: article.category,
      sentiment: article.sentiment,
      importanceScore: article.importanceScore,
    })
  } catch (error) {
    console.error('Error fetching article:', error)
    return apiError(500, '기사 조회 중 오류가 발생했습니다.')
  }
})
