# SEO 최적화 가이드

이 프로젝트에는 다음과 같은 SEO 최적화가 적용되어 있습니다.

## 📋 적용된 SEO 기능

### 1. 메타 태그 최적화

- **기본 메타 태그**: `src/lib/seo.ts`에서 관리
- **페이지별 동적 메타 태그**: 각 라우트의 `head` 함수에서 설정
- **Open Graph 태그**: 소셜 미디어 공유 최적화
- **Twitter Cards**: 트위터 공유 최적화

### 2. 구조화된 데이터 (JSON-LD)

- **NewsArticle Schema**: 기사 상세 페이지
- **WebSite Schema**: 홈페이지
- **Organization Schema**: 사이트 정보
- **BreadcrumbList Schema**: 탐색 경로

### 3. Sitemap

- **동적 Sitemap**: `/api/sitemap.xml` 엔드포인트
- 모든 기사와 카테고리 페이지 포함
- 1시간 캐싱 적용

### 4. robots.txt

- 검색 엔진 크롤링 규칙 정의
- Sitemap 위치 명시
- `/public/robots.txt`

### 5. 성능 최적화

- **OptimizedImage 컴포넌트**: Lazy loading, alt 텍스트 필수
- **캐싱**: Sitemap 1시간 캐싱

## 🔧 설정 방법

### 사이트 정보 수정

`src/lib/seo.ts`의 `SITE_CONFIG`를 수정하세요:

\`\`\`typescript
export const SITE_CONFIG = {
name: 'HEY! Vona',
title: 'HEY! Vona - 오늘의 경제, 한 입에',
description: '글로벌 & 한국 경제 뉴스를 "그래서 나한테 뭔 영향?"까지 쉽게 설명해주는 서비스',
url: 'https://ecosnack.com', // 실제 도메인으로 변경
locale: 'ko_KR',
type: 'website',
twitter: '@heyvona', // 실제 트위터 계정으로 변경
image: '/og-image.png', // Open Graph 기본 이미지
}
\`\`\`

### Open Graph 이미지 추가

`/public/og-image.png` 파일을 추가하세요:

- 권장 크기: 1200x630px
- 형식: PNG 또는 JPG
- 파일 크기: 1MB 이하

### robots.txt 수정

`/public/robots.txt`에서 크롤링 규칙을 수정할 수 있습니다.

## 📊 SEO 체크리스트

### 필수 항목

- [x] 모든 페이지에 고유한 title 태그
- [x] 모든 페이지에 meta description (160자 이하)
- [x] Open Graph 태그 (og:title, og:description, og:image, og:url)
- [x] Twitter Card 태그
- [x] Canonical URL
- [x] robots.txt
- [x] sitemap.xml
- [x] 구조화된 데이터 (JSON-LD)
- [x] 이미지 alt 텍스트
- [x] 언어 설정 (lang="ko")

### 권장 항목

- [ ] Google Search Console 등록
- [ ] Google Analytics 설정
- [ ] 페이지 속도 최적화 (Core Web Vitals)
- [ ] 모바일 친화성 테스트
- [ ] HTTPS 적용
- [ ] 404 페이지 최적화

## 🧪 테스트 방법

### 1. 메타 태그 확인

브라우저 개발자 도구에서 `<head>` 태그를 확인하세요.

### 2. Open Graph 미리보기

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### 3. 구조화된 데이터 테스트

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

### 4. Sitemap 확인

브라우저에서 `/sitemap.xml`에 접속하여 확인하세요.

### 5. 페이지 속도 테스트

- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)

## 📈 모니터링

### Google Search Console

1. [Google Search Console](https://search.google.com/search-console) 등록
2. Sitemap 제출: `https://your-domain.com/sitemap.xml`
3. 색인 상태 모니터링
4. 검색 성능 분석

### Google Analytics

`src/routes/__root.tsx`에 Google Analytics 스크립트 추가:

\`\`\`tsx

<head>
  <HeadContent />
  {/* Google Analytics */}
  <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  />
  <script
    dangerouslySetInnerHTML={{
      __html: \`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID');
      \`,
    }}
  />
</head>
\`\`\`

## 🔍 추가 개선 사항

### 1. 이미지 최적화

- WebP 형식 사용
- 적절한 크기로 리사이징
- CDN 사용 고려

### 2. 성능 최적화

- Code splitting
- Tree shaking
- 번들 크기 최적화
- 캐싱 전략

### 3. 접근성 (A11y)

- ARIA 레이블
- 키보드 네비게이션
- 스크린 리더 지원

### 4. 국제화 (i18n)

- 다국어 지원
- hreflang 태그

## 📚 참고 자료

- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Schema.org](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [TanStack Router Docs](https://tanstack.com/router/latest)
