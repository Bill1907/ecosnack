import { pgTable, varchar, integer, timestamp } from 'drizzle-orm/pg-core'

// ============================================
// 카테고리 통계 Materialized View
// ============================================

export const categoryStats = pgTable('category_stats', {
  category: varchar('category', { length: 50 }).primaryKey(),
  articleCount: integer('article_count').notNull(),
  latestArticle: timestamp('latest_article', { withTimezone: true }),
})

export type CategoryStat = typeof categoryStats.$inferSelect
