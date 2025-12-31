# Pull Request #15 리뷰: SEO 아키텍처 구현 및 검색 엔진 최적화

## 전체 평가 ⭐⭐⭐⭐☆ (4/5)

이번 PR은 체계적인 SEO 아키텍처를 구현하여 검색 엔진 최적화를 크게 개선했습니다. 코드 구조가 잘 정리되어 있고, JSON-LD 구조화 데이터, 동적 사이트맵, 메타 태그 등 핵심 SEO 요소들이 모두 포함되어 있습니다.

---

## 긍정적인 점 ✅

### 1. **체계적인 SEO 구현**
- ✅ 메타 태그 (og:, twitter:card) 완벽 구현
- ✅ JSON-LD 구조화 데이터 (NewsArticle, BreadcrumbList, WebSite, Organization)
- ✅ 동적 사이트맵 생성 (`/api/sitemap.xml`)
- ✅ robots.txt 설정

### 2. **코드 품질**
```typescript
// src/lib/seo.ts - 잘 구조화된 유틸리티 함수들
export function getPageMeta({ ... }) { ... }
export function getArticleJsonLd(article: Article) { ... }
```
- ✅ 재사용 가능한 유틸리티 함수로 분리
- ✅ TypeScript 타입 안전성 확보
- ✅ XML 이스케이프 처리 (`escapeXml` 함수)

### 3. **UX 개선**
- ✅ 로딩 스켈레톤 컴포넌트 (`NewsCardSkeleton`)
- ✅ 404 에러 처리 개선 (`ArticleNotFound`)
- ✅ 이미지 지원 강화

### 4. **문서화**
- ✅ `docs/SEO.md` - 상세한 SEO 가이드
- ✅ `docs/IMAGES.md` - OG 이미지 가이드

---

## 개선이 필요한 부분 🔧

### 1. **보안 & 에러 처리** ⚠️ (High Priority)

**위치:** `server/routes/api/sitemap.xml.ts:20-26`

```typescript
} catch (error) {
  console.error('Error generating sitemap:', error)
  throw new HTTPError('Error generating sitemap', {
    cause: error,  // ⚠️ 민감한 정보 노출 가능성
    status: 500,
  })
}
```

**문제점:**
- `cause: error`로 전체 에러 객체를 노출하면 내부 DB 구조나 민감한 정보가 클라이언트에 전달될 수 있습니다.

**권장 수정:**
```typescript
} catch (error) {
  console.error('Error generating sitemap:', error)
  throw new HTTPError('Failed to generate sitemap', {
    status: 500,
    // cause를 제거하거나, 프로덕션 환경에서는 제거
  })
}
```

---

### 2. **성능 최적화** 🚀 (High Priority)

**위치:** `server/routes/api/sitemap.xml.ts:8`

```typescript
const articles = await getArticles()  // ⚠️ 모든 기사를 가져옴
```

**문제점:**
- 기사가 10,000개 이상 쌓이면 메모리와 응답 시간이 문제될 수 있습니다.
- 캐시 헤더는 있지만, 데이터 fetch 자체는 매번 수행됩니다.

**권장 수정:**
```typescript
// Option 1: 메모리 캐싱 추가
let cachedSitemap: { data: string; timestamp: number } | null = null
const CACHE_DURATION = 3 * 60 * 60 * 1000 // 3시간

export default defineEventHandler(async () => {
  const now = Date.now()

  if (cachedSitemap && now - cachedSitemap.timestamp < CACHE_DURATION) {
    return new Response(cachedSitemap.data, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=10800, s-maxage=10800',
      },
    })
  }

  const articles = await getArticles()
  const sitemap = generateSitemap(articles)
  cachedSitemap = { data: sitemap, timestamp: now }

  return new Response(sitemap, { ... })
})

// Option 2: 최근 N개만 가져오기 + Sitemap Index 사용
const recentArticles = await getArticles({ limit: 1000, orderBy: 'createdAt DESC' })
```

---

### 3. **SEO - Canonical URL 누락** 📍 (Medium Priority)

**위치:** `src/routes/article.$id.tsx`, `src/routes/index.tsx`

**문제점:**
- `__root.tsx`에만 canonical URL이 있고, 각 페이지별 canonical이 없습니다.
- 중복 콘텐츠 문제가 발생할 수 있습니다.

**권장 수정:**
```typescript
// src/routes/article.$id.tsx
head: ({ loaderData }) => {
  return {
    meta: [...],
    links: [
      {
        rel: 'canonical',
        href: `${SITE_CONFIG.url}/article/${article.id}`,
      },
    ],
  }
}

// src/routes/index.tsx
head: () => {
  return {
    meta: [...],
    links: [
      {
        rel: 'canonical',
        href: SITE_CONFIG.url,
      },
    ],
  }
}
```

---

### 4. **코드 품질 개선** 💡 (Medium Priority)

#### 4.1 `truncateDescription` 함수 개선
**위치:** `src/lib/seo.ts:235-238`

```typescript
export function truncateDescription(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'  // ⚠️ 단어 중간에서 잘림
}
```

**권장 수정:**
```typescript
export function truncateDescription(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text

  // 단어 경계에서 자르기
  const truncated = text.slice(0, maxLength - 3)
  const lastSpace = truncated.lastIndexOf(' ')

  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + '...'
}
```

#### 4.2 카테고리 하드코딩 제거
**위치:** `src/lib/sitemap.ts:61-68`

```typescript
const categories: Category[] = [
  'economy',
  'finance',
  'business',
  'markets',
  'policy',
  'trade',
]
```

**권장 수정:**
```typescript
// CategorySchema에서 가져오기
import { CategorySchema } from '../db/schema'

const categories = CategorySchema.options.filter(c => c !== 'all')
```

---

### 5. **타입 안전성** 🔒 (Low Priority)

**위치:** `src/routes/article.$id.tsx:51`

```typescript
keywords: article.keywords || [categoryName, '경제뉴스', '뉴스분석'],
```

**문제점:**
- `article.keywords`가 `string[] | undefined`로 가정되지만, 실제 타입 검증이 없습니다.

**권장 수정:**
```typescript
keywords: Array.isArray(article.keywords)
  ? article.keywords
  : [categoryName, '경제뉴스', '뉴스분석'],
```

---

### 6. **robots.txt 환경 설정** 🌍 (Low Priority)

**위치:** `public/robots.txt:9`

```txt
Sitemap: https://heyvona.com/sitemap.xml
```

**문제점:**
- URL이 하드코딩되어 있어 개발/스테이징 환경에서 문제가 될 수 있습니다.

**권장 수정:**
- 동적 생성하거나, 환경변수로 관리
- 또는 상대 경로 사용: `Sitemap: /api/sitemap.xml`

---

### 7. **JSON-LD 개선 제안** 📊 (Low Priority)

**위치:** `src/lib/seo.ts:121-152`

```typescript
export function getArticleJsonLd(article: Article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    // ...
    image: article.imageUrl || SITE_CONFIG.image,  // ⚠️ ImageObject 형식 권장
  }
}
```

**권장 수정:**
```typescript
image: article.imageUrl ? {
  '@type': 'ImageObject',
  url: article.imageUrl,
  width: 1200,  // OG 이미지 기준
  height: 630,
} : SITE_CONFIG.image,
```

---

## 테스트 체크리스트 ✓

다음 항목들을 테스트해주세요:

- [ ] `/api/sitemap.xml` 접근 시 올바른 XML 반환 확인
- [ ] 기사 페이지에서 `<head>` 태그에 og: 메타 태그 확인
- [ ] Google Rich Results Test: https://search.google.com/test/rich-results
- [ ] Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- [ ] Twitter Card Validator: https://cards-dev.twitter.com/validator
- [ ] Lighthouse SEO 점수 확인
- [ ] 10,000개 이상의 기사가 있을 때 sitemap 성능 테스트

---

## 추가 권장사항 💭

### 1. **Sitemap Index 고려**
기사가 50,000개 이상 될 경우, sitemap을 여러 파일로 분할하는 것을 고려하세요:
```
/api/sitemap.xml (index)
/api/sitemap-articles-1.xml
/api/sitemap-articles-2.xml
```

### 2. **RSS 피드 추가**
SEO와 함께 RSS 피드도 추가하면 좋습니다:
```
/api/feed.xml
```

### 3. **구조화 데이터 모니터링**
Google Search Console에 사이트 등록 후 구조화 데이터 오류 모니터링을 권장합니다.

---

## 결론

전반적으로 매우 잘 구현된 SEO 아키텍처입니다! 🎉

주요 개선사항:
1. ⚠️ **High Priority**: 에러 처리 보안 강화, sitemap 성능 최적화
2. 📍 **Medium Priority**: Canonical URL 추가, 코드 품질 개선
3. 💡 **Low Priority**: 타입 안전성, robots.txt 환경 설정

위 사항들을 반영하면 프로덕션 레벨의 SEO 시스템이 될 것입니다.

---

**Reviewed by:** Claude
**Date:** 2025-12-31
