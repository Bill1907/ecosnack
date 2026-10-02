import { createFileRoute } from '@tanstack/react-router'
import { desc } from 'drizzle-orm'
import { getDb } from '@/db'
import { articles } from '@/db/schema'
import { generateSitemap } from '@/lib/sitemap'

// sitemap 용 기사 목록 (id, createdAt 만, 최신순 최대 50000개)
// 공개 RPC(createServerFn)로 노출하지 않도록 서버 라우트에서 DB 를 직접 조회한다
async function getSitemapArticles() {
  const db = getDb()
  return db
    .select({ id: articles.id, createdAt: articles.createdAt })
    .from(articles)
    .orderBy(desc(articles.createdAt), desc(articles.id))
    .limit(50000)
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const sitemap = generateSitemap(await getSitemapArticles())
          return new Response(sitemap, {
            headers: {
              'Content-Type': 'application/xml',
              'Cache-Control': 'public, max-age=10800, s-maxage=10800',
            },
          })
        } catch (error) {
          console.error('Error generating sitemap:', error)
          return new Response('Error generating sitemap', { status: 500 })
        }
      },
    },
  },
})
