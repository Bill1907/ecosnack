import { defineEventHandler } from 'h3'
import { getDb } from '../../../src/db'
import { categoryStats } from '../../../src/db/schema'
import { desc } from 'drizzle-orm'
import { setApiHeaders, apiSuccess, apiError } from '../../utils/api-response'

export default defineEventHandler(async (event) => {
  setApiHeaders(event)

  try {
    const db = getDb()
    const result = await db
      .select()
      .from(categoryStats)
      .orderBy(desc(categoryStats.articleCount))

    return apiSuccess({
      categories: result.map((row) => ({
        category: row.category,
        articleCount: row.articleCount,
        latestArticle: row.latestArticle,
      })),
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return apiError(500, '카테고리 조회 중 오류가 발생했습니다.')
  }
})
