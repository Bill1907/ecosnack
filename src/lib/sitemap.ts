import type { Article, Category } from '../db/schema'
import { SITE_CONFIG } from './seo'

/**
 * Sitemap 생성 유틸리티
 */

interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never'
  priority?: number
}

/**
 * XML 특수 문자 이스케이프
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Sitemap URL 엔트리 생성
 */
function createUrlEntry(url: SitemapUrl): string {
  return `
  <url>
    <loc>${escapeXml(url.loc)}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ''}
  </url>`
}

/**
 * Sitemap XML 생성
 */
export function generateSitemap(articles: Article[]): string {
  const urls: SitemapUrl[] = []

  // 홈페이지
  urls.push({
    loc: SITE_CONFIG.url,
    changefreq: 'daily',
    priority: 1.0,
  })

  // 정적 페이지
  const staticPages = [
    { path: '/about', changefreq: 'monthly' as const, priority: 0.8 },
    { path: '/contact', changefreq: 'monthly' as const, priority: 0.5 },
    { path: '/privacy', changefreq: 'yearly' as const, priority: 0.3 },
    { path: '/terms', changefreq: 'yearly' as const, priority: 0.3 },
  ]
  staticPages.forEach((page) => {
    urls.push({
      loc: `${SITE_CONFIG.url}${page.path}`,
      changefreq: page.changefreq,
      priority: page.priority,
    })
  })

  // 카테고리 페이지
  const categories: Category[] = [
    'economy',
    'finance',
    'business',
    'markets',
    'policy',
    'trade',
  ]
  categories.forEach((category) => {
    urls.push({
      loc: `${SITE_CONFIG.url}/category/${category}`,
      changefreq: 'daily',
      priority: 0.8,
    })
  })

  // 기사 페이지
  articles.forEach((article) => {
    urls.push({
      loc: `${SITE_CONFIG.url}/article/${article.id}`,
      lastmod:
        article.createdAt?.toISOString().split('T')[0] ||
        new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 0.6,
    })
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(createUrlEntry).join('')}
</urlset>`

  return xml
}

/**
 * Sitemap Index 생성 (여러 sitemap이 있을 경우)
 */
export function generateSitemapIndex(
  sitemaps: { loc: string; lastmod?: string }[],
): string {
  const entries = sitemaps
    .map(
      (sitemap) => `
  <sitemap>
    <loc>${escapeXml(sitemap.loc)}</loc>
    ${sitemap.lastmod ? `<lastmod>${sitemap.lastmod}</lastmod>` : ''}
  </sitemap>`,
    )
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`
}
