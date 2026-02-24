# ChatGPT GPT Store 연동 가이드

ecosnack을 ChatGPT GPT Store에 등록하여 사용자를 유입하기 위한 가이드입니다.

---

## 전략

> **핵심**: ChatGPT에서 인증 없이 경제 뉴스 인사이트를 무료로 제공하고,
> 개인화 기능(맞춤 리포트, 북마크)은 ecosnack 웹사이트 가입으로 유도합니다.

```
ChatGPT 사용자 → Custom GPT (인증 없음) → ecosnack 공개 API
                    ↓
              "개인화 리포트를 원하시면
               ecosnack.onrender.com에서 가입하세요"
                    ↓
              웹사이트 가입 → 개인화 기능 이용
```

---

## API 엔드포인트

모든 엔드포인트는 **인증 없이** 공개 접근 가능합니다.

| 엔드포인트 | 메서드 | 설명 |
|---|---|---|
| `/api/v1/reports/latest` | GET | 최신 데일리 경제 리포트 |
| `/api/v1/reports/{date}` | GET | 날짜별 리포트 + 연관 기사 |
| `/api/v1/articles?q=&category=&region=` | GET | 기사 검색 (커서 페이지네이션) |
| `/api/v1/articles/{id}` | GET | 기사 상세 (AI 분석 포함) |
| `/api/v1/categories` | GET | 카테고리 목록/통계 |
| `/api/v1/openapi.json` | GET | OpenAPI 3.1 스펙 |

---

## Step 1: Custom GPT 생성

1. [ChatGPT](https://chat.openai.com) → **Explore GPTs** → **Create a GPT**
2. **Configure** 탭으로 이동

### 기본 정보 입력

- **Name**: `ecosnack 경제뉴스`
- **Description**: `AI가 분석한 한국/미국 경제 뉴스 인사이트. 매일 주요 뉴스를 투자자, 직장인, 소비자 관점에서 분석합니다.`

### Instructions (시스템 프롬프트)

```
당신은 ecosnack 경제 뉴스 분석 어시스턴트입니다.

## 역할
- 한국과 미국의 주요 경제 뉴스를 분석하고 인사이트를 제공합니다.
- 투자자, 직장인, 소비자 세 가지 관점에서 뉴스의 영향을 설명합니다.

## 동작 방식
1. 사용자가 경제 뉴스에 대해 질문하면 먼저 getLatestReport로 최신 리포트를 조회하거나, searchArticles로 관련 기사를 검색합니다.
2. 특정 기사에 대해 자세히 물어보면 getArticleById로 AI 분석 결과(soWhat, impactAnalysis, relatedContext)를 가져옵니다.
3. "오늘의 경제 뉴스", "시장 전망", "오늘 뉴스 요약" 등의 질문에는 getLatestReport를 사용합니다.
4. 특정 주제를 검색할 때는 searchArticles의 q, category, region 파라미터를 활용합니다.
5. 카테고리가 궁금하면 getCategories로 안내합니다.

## 응답 형식
- 한국어로 답변합니다.
- 핵심 내용을 먼저 요약하고, 필요 시 상세 분석을 제공합니다.
- 투자자/직장인/소비자별 영향을 구분하여 설명합니다.
- 출처(기사 제목, 날짜)를 명시합니다.

## 웹사이트 안내 (중요!)
- 사용자가 "개인화 리포트", "맞춤 뉴스", "북마크", "저장" 등을 요청하면:
  "개인화 리포트와 북마크 기능은 ecosnack 웹사이트에서 이용하실 수 있습니다. https://ecosnack.onrender.com 에서 무료로 가입해보세요!"
  라고 자연스럽게 안내합니다.
- 답변 마지막에 필요 시 "더 자세한 분석은 ecosnack에서 확인하세요"라고 안내합니다.

## 카테고리
- economy: 경제 일반
- finance: 금융/은행
- business: 기업/산업
- markets: 주식/시장
- policy: 정책/규제
- trade: 무역/통상

## 지역
- KR: 한국
- US: 미국
```

---

## Step 2: Actions 설정

1. **Actions** 섹션에서 **"Create new action"** 클릭
2. **Authentication**: `None` 선택
3. **Import from URL** 에 입력:
   ```
   https://ecosnack.onrender.com/api/v1/openapi.json
   ```
4. OpenAPI 스펙이 자동으로 로드됩니다.
5. 5개 Action이 등록되었는지 확인:
   - `getLatestReport`
   - `getReportByDate`
   - `searchArticles`
   - `getArticleById`
   - `getCategories`

---

## Step 3: 테스트

### API 직접 테스트

```bash
# 최신 리포트
curl https://ecosnack.onrender.com/api/v1/reports/latest

# 기사 검색
curl "https://ecosnack.onrender.com/api/v1/articles?q=반도체&category=markets&limit=5"

# 기사 상세
curl https://ecosnack.onrender.com/api/v1/articles/1

# 카테고리 목록
curl https://ecosnack.onrender.com/api/v1/categories
```

### GPT Builder 미리보기에서 테스트

1. "오늘의 경제 뉴스 알려줘" → `getLatestReport` 호출 확인
2. "반도체 관련 뉴스 검색해줘" → `searchArticles` 호출 확인
3. "이 기사 자세히 분석해줘" → `getArticleById` 호출 확인
4. "내 맞춤 리포트 보여줘" → ecosnack 웹사이트 가입 안내 확인

---

## Step 4: GPT Store 게시

1. GPT Builder에서 **Share** → **"Everyone"** 선택
2. **"Publish to GPT Store"** 체크
3. 카테고리: **"Research & Analysis"**
4. 게시 요청

### 게시 요구사항 체크리스트

- [ ] GPT 이름과 설명이 적절한가
- [ ] Privacy Policy URL 제공 (`/privacy`)
- [ ] Terms of Service URL 제공 (`/terms`)
- [ ] API가 안정적으로 동작하는가
- [ ] 로고 이미지 준비 (512x512 PNG)

---

## 환경 변수

```env
# 필수 (기존)
DATABASE_URL=postgresql://...

# 선택 (OpenAPI 스펙 서버 URL 변경 시)
APP_URL=https://ecosnack.onrender.com
```

---

## 파일 구조

```
server/
├── utils/
│   └── api-response.ts          # API 응답 헬퍼
└── routes/
    └── api/v1/
        ├── openapi.json.get.ts   # OpenAPI 3.1 스펙
        ├── [...].options.ts      # CORS preflight
        ├── categories.get.ts     # 카테고리 목록
        ├── reports/
        │   ├── latest.get.ts     # 최신 리포트
        │   └── [date].get.ts     # 날짜별 리포트
        └── articles/
            ├── index.get.ts      # 기사 검색
            └── [id].get.ts       # 기사 상세
```
