# Open Graph 이미지 가이드

## 필요한 이미지

### 1. og-image.png (메인 Open Graph 이미지)

- **위치**: `/public/og-image.png`
- **크기**: 1200 x 630px
- **형식**: PNG 또는 JPG
- **용도**: 소셜 미디어 공유 시 표시되는 기본 이미지

#### 디자인 가이드라인:

- 배경: 그라데이션 (진한 파란색 #1a1a1a → 다크 틸)
- 메인 텍스트: "HEY! Vona" (흰색, 굵게, 중앙)
- 부제: "오늘의 경제, 한 입에" (흰색, 약간 작게)
- 하단 태그라인: "글로벌 & 한국 경제 뉴스를 쉽게" (연한 회색)
- 배경 요소: 추상적인 기하학 도형 또는 금융 차트 요소 (미묘하게)
- 전문적이고 신뢰감 있는 느낌

### 2. logo.png (로고 이미지)

- **위치**: `/public/logo.png`
- **크기**: 512 x 512px (정사각형)
- **형식**: PNG (투명 배경)
- **용도**: JSON-LD Organization schema, favicon 등

### 3. favicon.ico

- **위치**: `/public/favicon.ico` (이미 존재)
- **크기**: 다양한 크기 포함 (16x16, 32x32, 64x64)

### 4. 추가 아이콘 (선택사항)

- **logo192.png**: 192 x 192px (PWA용)
- **logo512.png**: 512 x 512px (PWA용)
- **apple-touch-icon.png**: 180 x 180px (iOS용)

## 이미지 생성 도구

### 온라인 도구

- [Canva](https://www.canva.com/) - 템플릿 사용 가능
- [Figma](https://www.figma.com/) - 전문적인 디자인
- [Adobe Express](https://www.adobe.com/express/) - 빠른 생성

### AI 이미지 생성

- [DALL-E](https://openai.com/dall-e-2)
- [Midjourney](https://www.midjourney.com/)
- [Stable Diffusion](https://stability.ai/)

## 이미지 최적화

생성한 이미지는 다음 도구로 최적화하세요:

- [TinyPNG](https://tinypng.com/) - PNG 압축
- [Squoosh](https://squoosh.app/) - 다양한 형식 지원
- [ImageOptim](https://imageoptim.com/) - Mac용 앱

## 테스트

이미지를 추가한 후 다음 도구로 테스트하세요:

1. **Facebook Sharing Debugger**
   - URL: https://developers.facebook.com/tools/debug/
   - 사이트 URL 입력 후 "Scrape Again" 클릭

2. **Twitter Card Validator**
   - URL: https://cards-dev.twitter.com/validator
   - 사이트 URL 입력 후 미리보기 확인

3. **LinkedIn Post Inspector**
   - URL: https://www.linkedin.com/post-inspector/
   - 사이트 URL 입력 후 검사

## 현재 상태

- [x] SEO 메타 태그 설정 완료
- [x] JSON-LD 구조화 데이터 추가
- [ ] og-image.png 추가 필요
- [ ] logo.png 추가 필요
- [ ] PWA 아이콘 추가 (선택사항)

## 임시 해결책

이미지를 아직 생성하지 못한 경우, `src/lib/seo.ts`의 `SITE_CONFIG.image`를 임시로 주석 처리하거나 외부 이미지 URL을 사용할 수 있습니다:

\`\`\`typescript
export const SITE_CONFIG = {
// ...
image: 'https://via.placeholder.com/1200x630/1a1a1a/ffffff?text=HEY!+Vona', // 임시 placeholder
}
\`\`\`
