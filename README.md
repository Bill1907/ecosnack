# HEY! Vona (ecosnack)

TanStack Start + React + Clerk + Drizzle(Neon) 경제 뉴스 서비스. Cloudflare Workers 에 배포한다.

## 로컬 개발

```bash
bun install
bun run dev            # http://localhost:3000
```

- `.env` : 공통 값 (`DATABASE_URL`, `VITE_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`, `VITE_PUBLIC_POSTHOG_KEY`, `VITE_PUBLIC_POSTHOG_HOST`)
- `.env.local` : 로컬 덮어쓰기. 운영 Clerk 키(`pk_live`)는 localhost 에서 동작하지 않으므로 여기에 Clerk 개발 인스턴스 키(`pk_test`/`sk_test`)를 둔다.

## 배포 (Cloudflare Workers)

| git 브랜치 | Worker | 빌드 명령 | 도메인 |
|---|---|---|---|
| `main` | `ecosnack` | `bun run build` | heyvona.com |
| `dev` | `ecosnack-dev` | `CLOUDFLARE_ENV=dev bun run build` | dev.heyvona.com |

배포 명령은 둘 다 `bunx wrangler deploy` (빌드 결과 `dist/server/wrangler.json` 이 대상 Worker 를 정한다).

### 변수

- **빌드 변수** (클라이언트·서버 번들 양쪽에 박힘, Workers Builds → Build variables): `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_PUBLIC_POSTHOG_KEY`, `VITE_PUBLIC_POSTHOG_HOST`
- **런타임 시크릿** (`bunx wrangler secret put <NAME> [--env dev]`): `DATABASE_URL`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`

### 수동 배포

```bash
bun run deploy       # main → ecosnack
bun run deploy:dev   # dev  → ecosnack-dev
```
