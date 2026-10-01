import { HTTPError, defineEventHandler } from 'h3'
import { desc } from 'drizzle-orm'
import { getDb } from '../../src/db'
import { articles } from '../../src/db/schema'
import { generateSitemap } from '../../src/lib/sitemap'

// sitemap 용 기사 목록 (id, createdAt 만, 최신순 최대 50000개)
// 공개 RPC(createServerFn)로 노출하지 않도록 일반 함수로 DB 를 직접 조회한다
async function getSitemapArticles() {
  const db = getDb()
  return db
    .select({ id: articles.id, createdAt: articles.createdAt })
    .from(articles)
    .orderBy(desc(articles.createdAt), desc(articles.id))
    .limit(50000)
}

export default defineEventHandler(async () => {
  try {
    const sitemapArticles = await getSitemapArticles()

    // Sitemap XML 생성
    const sitemap = generateSitemap(sitemapArticles)

    // XML 응답 반환
    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=10800, s-maxage=10800',
      },
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    throw new HTTPError('Error generating sitemap', {
      cause: error,
      status: 500,
    })
  }
})
