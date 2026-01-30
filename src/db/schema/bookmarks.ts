import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core'
import { users } from './users'
import { articles } from './articles'

// ============================================
// Bookmarks 테이블 (사용자-기사 북마크)
// ============================================

export const bookmarks = pgTable(
  'bookmarks',
  {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.clerkId, { onDelete: 'cascade' }),
    articleId: integer('article_id')
      .notNull()
      .references(() => articles.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [unique().on(table.userId, table.articleId)]
)

export type Bookmark = typeof bookmarks.$inferSelect
export type NewBookmark = typeof bookmarks.$inferInsert
