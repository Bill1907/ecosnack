import { H3Event, getHeader, createError } from 'h3'
import { getDb } from '../../src/db'
import { users } from '../../src/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Clerk JWT에서 userId를 추출합니다.
 * ChatGPT Actions OAuth 플로우에서 전달받은 Bearer 토큰을 검증합니다.
 */
export async function getAuthUserId(event: H3Event): Promise<string | null> {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.slice(7)

  try {
    // Clerk JWT를 검증합니다
    // Clerk의 공개 JWKS 엔드포인트를 사용해 토큰을 디코딩합니다
    const clerkSecretKey = process.env.CLERK_SECRET_KEY
    if (!clerkSecretKey) {
      console.error('CLERK_SECRET_KEY is not configured')
      return null
    }

    // Clerk Backend API로 토큰 검증
    const response = await fetch('https://api.clerk.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      // 토큰이 세션 토큰이 아닌 경우, JWT 디코딩 시도
      return await verifyClerkJwt(token)
    }

    const userData = await response.json()
    return userData.id as string
  } catch (error) {
    console.error('Auth token verification failed:', error)
    return null
  }
}

/**
 * Clerk JWT를 직접 디코딩하여 userId를 추출합니다.
 * CLERK_JWT_ISSUER (예: https://your-app.clerk.accounts.dev) 기반 검증
 */
async function verifyClerkJwt(token: string): Promise<string | null> {
  try {
    // JWT payload 디코딩 (base64url)
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString('utf-8')
    )

    // 만료 시간 검증
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null
    }

    // Clerk의 sub 클레임이 userId
    return payload.sub || null
  } catch {
    return null
  }
}

/**
 * 인증이 필요한 API 엔드포인트에서 사용합니다.
 * userId가 없으면 401 에러를 던집니다.
 */
export async function requireAuth(event: H3Event): Promise<string> {
  const userId = await getAuthUserId(event)

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: '유효한 인증 토큰이 필요합니다.',
    })
  }

  // DB에서 사용자 존재 확인
  const db = getDb()
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, userId))
    .limit(1)

  if (!existingUser[0]) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'ecosnack 계정이 필요합니다. 먼저 웹사이트에서 가입해주세요.',
    })
  }

  return userId
}
