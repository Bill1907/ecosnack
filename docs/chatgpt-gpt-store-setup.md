# ChatGPT GPT Store 연동 가이드

ecosnack을 ChatGPT App Store (GPT Store)에 등록하기 위한 설정 가이드입니다.

---

## 아키텍처 개요

```
ChatGPT 사용자 → Custom GPT → Actions (OpenAPI) → ecosnack API (/api/v1/*)
                                                        ↓
                                              Clerk OAuth (인증 필요 시)
                                                        ↓
                                              PostgreSQL (Neon DB)
```

### API 엔드포인트 구조

| 엔드포인트 | 메서드 | 인증 | 설명 |
|---|---|---|---|
| `/api/v1/reports/latest` | GET | 불필요 | 최신 데일리 리포트 |
| `/api/v1/reports/{date}` | GET | 불필요 | 날짜별 리포트 + 연관 기사 |
| `/api/v1/articles` | GET | 불필요 | 기사 검색 (q, category, region) |
| `/api/v1/articles/{id}` | GET | 불필요 | 기사 상세 (AI 분석 포함) |
| `/api/v1/categories` | GET | 불필요 | 카테고리 목록/통계 |
| `/api/v1/bookmarks` | GET | **필요** | 내 북마크 목록 |
| `/api/v1/bookmarks/toggle` | POST | **필요** | 북마크 추가/제거 |
| `/api/v1/me/report/latest` | GET | **필요** | 내 최신 개인화 리포트 |
| `/api/v1/me/report/{date}` | GET | **필요** | 날짜별 개인화 리포트 |
| `/api/v1/me/preferences` | GET | **필요** | 내 선호도 정보 |

---

## Step 1: Clerk OAuth 설정

### 1.1 Clerk Dashboard에서 OAuth Application 생성

1. [Clerk Dashboard](https://dashboard.clerk.com) 접속
2. 좌측 메뉴 **"OAuth Applications"** 클릭
3. **"Create OAuth Application"** 클릭
4. 설정:
   - **Name**: `ChatGPT ecosnack`
   - **Redirect URI**: `https://chat.openai.com/aip/g-{YOUR_GPT_ID}/oauth/callback`
     - GPT를 먼저 생성한 후 ChatGPT에서 제공하는 콜백 URL로 교체
   - **Scopes**: `profile`, `email`
5. 생성 후 **Client ID**와 **Client Secret**을 복사

### 1.2 환경 변수 확인

기존 환경 변수가 설정되어 있어야 합니다:
```env
CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
DATABASE_URL=postgresql://...
```

---

## Step 2: ChatGPT GPT Builder 설정

### 2.1 Custom GPT 생성

1. [ChatGPT](https://chat.openai.com) → **Explore GPTs** → **Create a GPT**
2. **Configure** 탭으로 이동

### 2.2 기본 정보 입력

- **Name**: `ecosnack 경제뉴스`
- **Description**: `AI가 분석한 한국/미국 경제 뉴스 인사이트. 매일 주요 뉴스를 투자자, 직장인, 소비자 관점에서 분석합니다.`
- **Instructions** (시스템 프롬프트):

```
당신은 ecosnack 경제 뉴스 분석 어시스턴트입니다.

## 역할
- 한국과 미국의 주요 경제 뉴스를 분석하고 인사이트를 제공합니다.
- 투자자, 직장인, 소비자 세 가지 관점에서 뉴스의 영향을 설명합니다.

## 동작 방식
1. 사용자가 경제 뉴스에 대해 질문하면 먼저 getLatestReport 또는 searchArticles로 관련 정보를 검색합니다.
2. 특정 기사에 대해 자세히 물어보면 getArticleById로 AI 분석 결과를 가져옵니다.
3. "오늘의 경제 뉴스", "시장 전망" 등의 질문에는 getLatestReport를 사용합니다.
4. 검색이 필요한 경우 searchArticles의 q, category, region 파라미터를 활용합니다.

## 인증된 사용자 기능
- 사용자가 로그인한 경우 개인화 리포트(getMyLatestReport), 북마크(getBookmarks), 선호도(getMyPreferences)에 접근할 수 있습니다.
- "내 리포트", "내 북마크", "내 관심사" 등의 요청에 해당 API를 사용합니다.

## 응답 형식
- 한국어로 답변합니다.
- 핵심 내용을 먼저 요약하고, 필요 시 상세 분석을 제공합니다.
- 투자자/직장인/소비자별 영향을 구분하여 설명합니다.
- 출처(기사 제목, 날짜)를 명시합니다.

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

### 2.3 Actions 설정

1. **Actions** 섹션에서 **"Create new action"** 클릭
2. **Import from URL** 에 아래 입력:
   ```
   https://ecosnack.onrender.com/api/v1/openapi.json
   ```
3. OpenAPI 스펙이 자동으로 로드됩니다.

### 2.4 Authentication 설정

Actions의 **Authentication** 설정:

- **Authentication Type**: OAuth
- **Client ID**: Clerk에서 복사한 Client ID
- **Client Secret**: Clerk에서 복사한 Client Secret
- **Authorization URL**: `https://YOUR_CLERK_DOMAIN/oauth/authorize`
- **Token URL**: `https://YOUR_CLERK_DOMAIN/oauth/token`
- **Scope**: `profile email`
- **Token Exchange Method**: `POST request`

> `YOUR_CLERK_DOMAIN`은 Clerk Dashboard의 **API Keys** 페이지에서 확인할 수 있습니다.
> 예: `clerk.your-app.com` 또는 `your-app.clerk.accounts.dev`

### 2.5 Callback URL 설정

GPT를 저장한 후 ChatGPT가 제공하는 **Callback URL**을 복사하여
Clerk Dashboard의 OAuth Application **Redirect URI**에 추가합니다.

---

## Step 3: 테스트

### 3.1 공개 API 테스트 (인증 불필요)

```bash
# 최신 리포트
curl https://ecosnack.onrender.com/api/v1/reports/latest

# 기사 검색
curl "https://ecosnack.onrender.com/api/v1/articles?q=반도체&category=markets&limit=5"

# 카테고리 목록
curl https://ecosnack.onrender.com/api/v1/categories
```

### 3.2 ChatGPT에서 테스트

GPT Builder 미리보기에서:
1. "오늘의 경제 뉴스 알려줘" → `getLatestReport` 호출 확인
2. "반도체 관련 뉴스 검색해줘" → `searchArticles` 호출 확인
3. "내 북마크 보여줘" → OAuth 로그인 플로우 → `getBookmarks` 호출 확인

---

## Step 4: GPT Store 게시

1. GPT Builder에서 **Share** 옵션을 **"Everyone"** 으로 설정
2. **"Publish to GPT Store"** 체크
3. 카테고리 선택: **"Research & Analysis"** 또는 **"Productivity"**
4. 게시 요청

### 게시 요구사항 체크리스트

- [x] GPT 이름과 설명이 적절한가
- [x] Privacy Policy URL 제공 (`/privacy`)
- [x] Terms of Service URL 제공 (`/terms`)
- [x] Contact 정보 제공 (`/contact`)
- [x] API가 안정적으로 동작하는가
- [x] OAuth 플로우가 정상 작동하는가
- [ ] 로고 이미지 준비 (512x512 PNG)

---

## 파일 구조

```
server/
├── utils/
│   ├── api-auth.ts          # OAuth 토큰 검증 미들웨어
│   └── api-response.ts      # API 응답 헬퍼
└── routes/
    ├── .well-known/
    │   └── ai-plugin.json.get.ts  # Plugin 매니페스트
    └── api/v1/
        ├── openapi.json.get.ts     # OpenAPI 스펙
        ├── [...].options.ts        # CORS preflight
        ├── categories.get.ts       # 카테고리 목록
        ├── reports/
        │   ├── latest.get.ts       # 최신 리포트
        │   └── [date].get.ts       # 날짜별 리포트
        ├── articles/
        │   ├── index.get.ts        # 기사 검색
        │   └── [id].get.ts         # 기사 상세
        ├── bookmarks/
        │   ├── index.get.ts        # 북마크 목록 (인증)
        │   └── toggle.post.ts      # 북마크 토글 (인증)
        └── me/
            ├── preferences.get.ts  # 선호도 (인증)
            └── report/
                ├── latest.get.ts   # 개인화 리포트 (인증)
                └── [date].get.ts   # 날짜별 개인화 리포트 (인증)
```

---

## 주의사항

1. **YOUR_CLERK_DOMAIN**: `ai-plugin.json.get.ts`와 `openapi.json.get.ts`에서 실제 Clerk 도메인으로 교체해야 합니다.
2. **서버 URL**: OpenAPI 스펙의 `servers[0].url`을 실제 배포 URL로 교체합니다.
3. **로고**: GPT Store 등록 시 512x512 PNG 로고가 필요합니다. `/public/logo.png`에 배치하세요.
4. **Rate Limiting**: 프로덕션에서는 API rate limiting 추가를 권장합니다.
