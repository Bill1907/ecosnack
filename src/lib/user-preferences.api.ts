import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { getDb } from '@/db'
import { userPreferences } from '@/db/schema'
import { eq } from 'drizzle-orm'

// 사용자 선호도 조회
// (선호도는 파이프라인이 북마크 기반으로 계산하는 값이므로 쓰기 엔드포인트는 두지 않는다)
export const getUserPreferences = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { userId } = await auth()

    if (!userId) {
      return null
    }

    const db = getDb()

    const result = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1)

    return result[0] ?? null
  },
)
