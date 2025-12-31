# PR #15 리뷰 코멘트 (GitHub에 직접 붙여넣기용)

아래 코멘트들을 GitHub PR #15의 "Files changed" 탭에서 해당 라인에 직접 추가해주세요.

---

## 📝 전체 리뷰 코멘트 (PR 상단에 작성)

```
# PR #15 리뷰 요약

전반적으로 **매우 잘 구현된 SEO 아키텍처**입니다! 🎉

## ✅ 긍정적인 점
- 체계적인 SEO 구현 (메타 태그, JSON-LD, 사이트맵, robots.txt)
- 재사용 가능한 유틸리티 함수로 잘 분리됨
- TypeScript 타입 안전성 확보
- 상세한 문서화 (`docs/SEO.md`, `docs/IMAGES.md`)
- 로딩 스켈레톤 UI 추가

## 🔧 주요 개선사항

### High Priority (반드시 수정)
1. ⚠️ **보안**: `server/routes/api/sitemap.xml.ts:22`의 에러 처리 개선 필요
2. 🚀 **성능**: Sitemap 메모리 캐싱 추가 필요

### Medium Priority (권장)
3. 📍 Canonical URL 추가
4. 💡 코드 품질 개선 (truncateDescription, 하드코딩 제거)

### Low Priority (선택)
5. 타입 안전성, robots.txt 환경 설정, JSON-LD 개선

## 테스트 체크리스트
- [ ] `/api/sitemap.xml` 접근 테스트
- [ ] Google Rich Results Test: https://search.google.com/test/rich-results
- [ ] Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- [ ] Twitter Card Validator: https://cards-dev.twitter.com/validator
- [ ] Lighthouse SEO 점수 확인

상세 리뷰는 각 파일의 인라인 코멘트를 참고해주세요!
```

---

## 📂 파일별 인라인 코멘트

### 1. `server/routes/api/sitemap.xml.ts` - Line 22

```
⚠️ **보안 이슈**: `cause: error`로 전체 에러 객체를 노출하면 내부 DB 구조나 민감한 정보가 클라이언트에 전달될 수 있습니다.

**권장 수정:**
```typescript
} catch (error) {
  console.error('Error generating sitemap:', error)
  throw new HTTPError('Failed to generate sitemap', {
    status: 500,
    // cause를 제거하거나, 프로덕션 환경에서만 제거
  })
}
```
```

### 2. `server/routes/api/sitemap.xml.ts` - Line 8

```
🚀 **성능 최적화 필요**: 기사가 10,000개 이상 쌓이면 메모리와 응답 시간이 문제될 수 있습니다. 캐시 헤더는 있지만 데이터 fetch는 매번 수행됩니다.

**권장 수정 (메모리 캐싱):**
```typescript
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

  return new Response(sitemap, { /* ... */ })
})
```

**대안 (Pagination):**
```typescript
const recentArticles = await getArticles({
  limit: 1000,
  orderBy: 'createdAt DESC'
})
// 또는 Sitemap Index 사용 고려
```
```

### 3. `src/routes/article.$id.tsx` - Line 42 (head 함수 내부)

```
📍 **Canonical URL 누락**: 각 기사 페이지별 canonical URL이 필요합니다. 중복 콘텐츠 문제를 방지할 수 있습니다.

**권장 추가:**
```typescript
return {
  meta: getPageMeta({ /* ... */ }),
  links: [
    {
      rel: 'canonical',
      href: `${SITE_CONFIG.url}/article/${article.id}`,
    },
  ],
  scripts: [ /* ... */ ],
}
```
```

### 4. `src/routes/index.tsx` - Line 39 (head 함수 내부)

```
📍 **Canonical URL 누락**: 홈페이지에도 canonical URL이 필요합니다.

**권장 추가:**
```typescript
return {
  meta: getPageMeta({ /* ... */ }),
  links: [
    {
      rel: 'canonical',
      href: SITE_CONFIG.url,
    },
  ],
  scripts: [ /* ... */ ],
}
```
```

### 5. `src/lib/seo.ts` - Line 235

```
💡 **코드 개선**: 현재 `truncateDescription`이 단어 중간에서 잘릴 수 있습니다.

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
```

### 6. `src/lib/sitemap.ts` - Line 61

```
💡 **하드코딩 제거**: 카테고리를 하드코딩하는 대신 스키마에서 가져오는 것이 유지보수에 좋습니다.

**권장 수정:**
```typescript
import { CategorySchema } from '../db/schema'

const categories = CategorySchema.options.filter(c => c !== 'all')
```
```

### 7. `src/routes/article.$id.tsx` - Line 51

```
🔒 **타입 안전성**: `article.keywords`의 타입 검증을 추가하면 더 안전합니다.

**권장 수정:**
```typescript
keywords: Array.isArray(article.keywords)
  ? article.keywords
  : [categoryName, '경제뉴스', '뉴스분석'],
```
```

### 8. `public/robots.txt` - Line 9

```
🌍 **환경 설정**: Sitemap URL이 하드코딩되어 있어 개발/스테이징 환경에서 문제가 될 수 있습니다.

**권장:**
- 상대 경로 사용: `Sitemap: /api/sitemap.xml`
- 또는 환경별로 다른 robots.txt 생성
```

### 9. `src/lib/seo.ts` - Line 129

```
📊 **JSON-LD 개선**: `image` 필드를 ImageObject 형식으로 변경하면 더 풍부한 검색 결과를 얻을 수 있습니다.

**권장 수정:**
```typescript
image: article.imageUrl ? {
  '@type': 'ImageObject',
  url: article.imageUrl,
  width: 1200,  // OG 이미지 표준 크기
  height: 630,
} : SITE_CONFIG.image,
```
```

---

## 🎯 사용 방법

1. GitHub에서 PR #15로 이동
2. "Files changed" 탭 클릭
3. 위에 명시된 각 파일의 해당 라인 번호 옆 `+` 버튼 클릭
4. 위의 코멘트 내용을 복사해서 붙여넣기
5. "Start a review" 또는 "Add review comment" 클릭
6. 모든 코멘트 추가 후 "Finish your review" 클릭

또는 전체 리뷰 코멘트만 PR 상단 "Conversation" 탭에 남겨도 됩니다!
