import { createServerFn } from '@tanstack/react-start'
import { zodValidator } from '@tanstack/zod-adapter'
import { auth } from '@clerk/tanstack-react-start/server'
import { getDb } from '@/db'
import { bookmarks, users, articles } from '@/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { z } from 'zod'

// 북마크 토글 (추가/제거)
export const toggleBookmark = createServerFn({ method: 'POST' })
  .inputValidator(zodValidator(z.object({ articleId: z.number() })))
  .handler(async ({ data }) => {
    const { userId } = await auth()

    if (!userId) {
      throw new Error('Unauthorized')
    }

    const db = getDb()
    const { articleId } = data

    // 사용자 존재 확인 (Webhook이 아직 처리되지 않은 경우 대비)
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1)

    if (!existingUser[0]) {
      // Lazy creation: Webhook이 늦게 도착할 수 있으므로 임시 생성
      await db.insert(users).values({ clerkId: userId })
    }

    // 기존 북마크 확인
    const existingBookmark = await db
      .select()
      .from(bookmarks)
      .where(and(eq(bookmarks.userId, userId), eq(bookmarks.articleId, articleId)))
      .limit(1)

    if (existingBookmark[0]) {
      // 북마크 제거
      await db.delete(bookmarks).where(eq(bookmarks.id, existingBookmark[0].id))
      return { bookmarked: false }
    } else {
      // 북마크 추가
      await db.insert(bookmarks).values({
        userId,
        articleId,
      })
      return { bookmarked: true }
    }
  })

// 북마크 상태 확인
export const getBookmarkStatus = createServerFn({ method: 'GET' })
  .inputValidator(zodValidator(z.object({ articleId: z.number() })))
  .handler(async ({ data }) => {
    const { userId } = await auth()

    if (!userId) {
      return { bookmarked: false }
    }

    const db = getDb()
    const bookmark = await db
      .select()
      .from(bookmarks)
      .where(and(eq(bookmarks.userId, userId), eq(bookmarks.articleId, data.articleId)))
      .limit(1)

    return { bookmarked: !!bookmark[0] }
  })

// 여러 기사의 북마크 상태 한번에 확인 (목록 페이지용)
export const getBookmarkStatuses = createServerFn({ method: 'GET' })
  .inputValidator(zodValidator(z.object({ articleIds: z.array(z.number()) })))
  .handler(async ({ data }) => {
    const { userId } = await auth()

    if (!userId || data.articleIds.length === 0) {
      return { bookmarkedIds: [] as number[] }
    }

    const db = getDb()
    const userBookmarks = await db
      .select({ articleId: bookmarks.articleId })
      .from(bookmarks)
      .where(eq(bookmarks.userId, userId))

    const bookmarkedIds = userBookmarks.map((b) => b.articleId)
    return { bookmarkedIds }
  })

// 사용자의 북마크 목록 조회
export const getUserBookmarks = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { userId } = await auth()

    if (!userId) {
      return []
    }

    const db = getDb()
    const result = await db
      .select({
        bookmark: bookmarks,
        article: articles,
      })
      .from(bookmarks)
      .innerJoin(articles, eq(bookmarks.articleId, articles.id))
      .where(eq(bookmarks.userId, userId))
      .orderBy(desc(bookmarks.createdAt))

    return result.map((row) => ({
      ...row.article,
      bookmarkedAt: row.bookmark.createdAt,
    }))
  }
)
