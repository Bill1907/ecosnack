import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

// ============================================
// Users 테이블 (Clerk 사용자 동기화)
// ============================================

export const users = pgTable('users', {
  clerkId: varchar('clerk_id', { length: 255 }).primaryKey(),
  email: varchar('email', { length: 255 }),
  name: varchar('name', { length: 255 }),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
