import type { Article } from '../db/schema'

/**
 * SEO 관련 유틸리티 함수들
 */

// 사이트 기본 정보
export const SITE_CONFIG = {
  name: 'HEY! Vona',
  title: 'HEY! Vona - 오늘의 경제, 한 입에',
  description:
    '글로벌 & 한국 경제 뉴스를 "그래서 나한테 뭔 영향?"까지 쉽게 설명해주는 서비스',
  url: 'https://heyvona.com',
  locale: 'ko_KR',
  type: 'website',
  image: 'https://cdn.heyvona.com/logo.png', // Open Graph 기본 이미지
}

/**
 * 기본 메타 태그 생성
 */
export function getDefaultMeta() {
  return [
    { charSet: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: SITE_CONFIG.description },
    {
      name: 'keywords',
      content: '경제뉴스,금융,투자,비즈니스,시장분석,뉴스요약',
    },
    { name: 'author', content: SITE_CONFIG.name },
    { name: 'robots', content: 'index, follow' },
    { name: 'googlebot', content: 'index, follow' },

    // Open Graph
    { property: 'og:type', content: SITE_CONFIG.type },
    { property: 'og:site_name', content: SITE_CONFIG.name },
    { property: 'og:locale', content: SITE_CONFIG.locale },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },

    // 모바일 최적화
    { name: 'theme-color', content: '#1a1a1a' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
    { name: 'apple-mobile-web-app-title', content: SITE_CONFIG.name },
  ]
}

/**
 * 페이지별 메타 태그 생성
 */
export function getPageMeta({
  title,
  description,
  path = '',
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  keywords,
}: {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  keywords?: string[]
}) {
  const fullTitle =
    title === SITE_CONFIG.name ? title : `${title} | ${SITE_CONFIG.name}`
  const url = `${SITE_CONFIG.url}${path}`
  const imageUrl = image || SITE_CONFIG.image

  const meta = [
    { title: fullTitle },
    { name: 'description', content: description },

    // Open Graph
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: imageUrl },
    { property: 'og:type', content: type },

    // Twitter Card
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: imageUrl },
  ]

  // 키워드 추가
  if (keywords && keywords.length > 0) {
    meta.push({ name: 'keywords', content: keywords.join(',') })
  }

  // 기사 타입일 경우 추가 메타 태그
  if (type === 'article') {
    if (publishedTime) {
      meta.push({ property: 'article:published_time', content: publishedTime })
    }
    if (modifiedTime) {
      meta.push({ property: 'article:modified_time', content: modifiedTime })
    }
    if (author) {
      meta.push({ property: 'article:author', content: author })
    }
  }

  return meta
}

/**
 * 기사용 JSON-LD 구조화 데이터 생성
 */
export function getArticleJsonLd(article: Article) {
  const url = `${SITE_CONFIG.url}/article/${article.id}`

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.description || article.headlineSummary || '',
    image: article.imageUrl || SITE_CONFIG.image,
    datePublished: article.pubDate?.toISOString(),
    dateModified: article.createdAt?.toISOString(),
    author: {
      '@type': 'Organization',
      name: article.source || SITE_CONFIG.name,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: article.category || 'economy',
    keywords: article.keywords?.join(', ') || '',
    inLanguage: 'ko-KR',
  }
}

/**
 * 홈페이지용 JSON-LD 구조화 데이터 생성
 */
export function getWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    inLanguage: 'ko-KR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Organization JSON-LD 구조화 데이터 생성
 */
export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
  }
}

/**
 * BreadcrumbList JSON-LD 구조화 데이터 생성
 */
export function getBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.url}`,
    })),
  }
}

/**
 * 카테고리 한글 이름 매핑
 */
export const CATEGORY_NAMES: Record<string, string> = {
  economy: '경제',
  finance: '금융',
  business: '비즈니스',
  markets: '시장',
  policy: '정책',
  trade: '무역',
  all: '전체',
}

/**
 * 카테고리별 설명
 */
export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  economy: '글로벌 및 한국 경제 동향과 주요 경제 지표 분석',
  finance: '금융 시장 동향, 투자 정보, 금융 정책 분석',
  business: '기업 뉴스, 산업 동향, 비즈니스 전략 분석',
  markets: '주식, 채권, 외환 등 금융 시장 분석',
  policy: '경제 정책, 규제, 정부 발표 분석',
  trade: '무역 동향, 국제 통상, 수출입 분석',
  all: '모든 카테고리의 경제 뉴스',
}

/**
 * 텍스트를 SEO 친화적으로 정리 (160자 제한)
 */
export function truncateDescription(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}
