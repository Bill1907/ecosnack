import { HTTPError, defineEventHandler } from 'h3'
import { getArticles } from '../../src/lib/articles.api'
import { generateSitemap } from '../../src/lib/sitemap'

export default defineEventHandler(async () => {
  try {
    // 모든 기사 가져오기
    const articles = await getArticles()

    // Sitemap XML 생성
    const sitemap = generateSitemap(articles)

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
